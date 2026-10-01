/**
 * Pruebas de PrestamoEquipos · la versión final de la clase paso a paso
 *
 * Para qué sirven en clase: en Remix no se puede adelantar el reloj, así que la
 * mora no se puede mostrar en vivo. Aquí sí. Proyectar la corrida de estas
 * pruebas es la forma más rápida de demostrar que el contrato cobra el depósito
 * cuando el equipo llega tarde.
 *
 *     npx hardhat test test/demo/PrestamoEquipos.test.js
 */

import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture, time } = networkHelpers;

const DEPOSITO = ethers.parseEther("0.1");
const DIA = 24 * 60 * 60;

async function desplegarPrestamo() {
  const [encargado, ana, beto] = await ethers.getSigners();
  const prestamo = await ethers.deployContract("PrestamoEquipos", [DEPOSITO]);
  await prestamo.registrar("Proyector Epson");  // id 1
  await prestamo.registrar("Kit Arduino");      // id 2
  return { prestamo, encargado, ana, beto };
}

describe("PrestamoEquipos · inventario", () => {
  it("el que despliega queda como encargado y el depósito queda fijo", async () => {
    const { prestamo, encargado } = await loadFixture(desplegarPrestamo);
    expect(await prestamo.encargado()).to.equal(encargado.address);
    expect(await prestamo.deposito()).to.equal(DEPOSITO);
  });

  it("los id empiezan en 1 y el inventario se registra con su nombre", async () => {
    const { prestamo } = await loadFixture(desplegarPrestamo);
    expect(await prestamo.totalEquipos()).to.equal(2n);
    expect((await prestamo.equipos(1)).nombre).to.equal("Proyector Epson");
    expect((await prestamo.equipos(2)).nombre).to.equal("Kit Arduino");
  });

  it("registrar emite EquipoRegistrado con el id", async () => {
    const { prestamo } = await loadFixture(desplegarPrestamo);
    await expect(prestamo.registrar("Cámara"))
      .to.emit(prestamo, "EquipoRegistrado")
      .withArgs(3n, "Cámara");
  });

  it("★ solo el encargado registra", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);
    await expect(prestamo.connect(ana).registrar("Equipo fantasma"))
      .to.be.revertedWithCustomError(prestamo, "SoloElEncargado")
      .withArgs(ana.address);
  });

  it("★ rechaza un nombre vacío", async () => {
    const { prestamo } = await loadFixture(desplegarPrestamo);
    await expect(prestamo.registrar(""))
      .to.be.revertedWithCustomError(prestamo, "NombreVacio");
  });

  it("★ un id que no existe no contesta 'disponible': revierte", async () => {
    const { prestamo } = await loadFixture(desplegarPrestamo);
    await expect(prestamo.estaDisponible(99))
      .to.be.revertedWithCustomError(prestamo, "EquipoNoRegistrado")
      .withArgs(99n);
  });
});

describe("PrestamoEquipos · prestar", () => {
  it("presta, deja el depósito en el contrato y fija el vencimiento", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 2, { value: DEPOSITO });

    expect(await prestamo.quienLoTiene(1)).to.equal(ana.address);
    expect(await prestamo.estaDisponible(1)).to.equal(false);
    expect(await ethers.provider.getBalance(prestamo.target)).to.equal(DEPOSITO);

    const ahora = await time.latest();
    expect((await prestamo.equipos(1)).vence).to.equal(BigInt(ahora + 2 * DIA));
  });

  it("★ exige el depósito exacto, ni más ni menos", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);

    await expect(prestamo.connect(ana).prestar(1, 1, { value: 0 }))
      .to.be.revertedWithCustomError(prestamo, "DepositoIncorrecto")
      .withArgs(DEPOSITO, 0n);

    await expect(prestamo.connect(ana).prestar(1, 1, { value: DEPOSITO * 2n }))
      .to.be.revertedWithCustomError(prestamo, "DepositoIncorrecto")
      .withArgs(DEPOSITO, DEPOSITO * 2n);
  });

  it("★ no se presta un equipo que ya está prestado", async () => {
    const { prestamo, ana, beto } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 1, { value: DEPOSITO });

    await expect(prestamo.connect(beto).prestar(1, 1, { value: DEPOSITO }))
      .to.be.revertedWithCustomError(prestamo, "EquipoOcupado")
      .withArgs(ana.address);
  });

  it("★ rechaza plazo cero y plazo mayor al máximo, y acepta el máximo exacto", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);

    for (const dias of [0, 15]) {
      await expect(prestamo.connect(ana).prestar(1, dias, { value: DEPOSITO }))
        .to.be.revertedWithCustomError(prestamo, "PlazoInvalido")
        .withArgs(14n * BigInt(DIA));
    }

    await prestamo.connect(ana).prestar(1, 14, { value: DEPOSITO }); // el borde sí entra
    expect(await prestamo.quienLoTiene(1)).to.equal(ana.address);
  });
});

describe("PrestamoEquipos · devolver a tiempo", () => {
  it("acredita el depósito a quien devolvió, sin enviárselo todavía", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 5, { value: DEPOSITO });

    await time.increase(2 * DIA); // dos días: va a tiempo
    await prestamo.connect(ana).devolver(1);

    expect(await prestamo.saldo(ana.address)).to.equal(DEPOSITO);
    expect(await prestamo.estaDisponible(1)).to.equal(true);
    // El dinero sigue en el contrato: el patrón de retiro no envía, acredita.
    expect(await ethers.provider.getBalance(prestamo.target)).to.equal(DEPOSITO);
  });

  it("y al retirar, el dinero sí llega", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 5, { value: DEPOSITO });
    await prestamo.connect(ana).devolver(1);

    await expect(prestamo.connect(ana).retirar())
      .to.changeEtherBalance(ethers, ana, DEPOSITO);
    expect(await prestamo.saldo(ana.address)).to.equal(0n);
  });

  it("emite Devuelto diciendo que llegó a tiempo", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 5, { value: DEPOSITO });
    await expect(prestamo.connect(ana).devolver(1))
      .to.emit(prestamo, "Devuelto")
      .withArgs(1n, ana.address, true, DEPOSITO);
  });

  it("★ el borde: devolver en el último segundo del plazo cuenta como a tiempo", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 1, { value: DEPOSITO });
    const vence = (await prestamo.equipos(1)).vence;

    await time.setNextBlockTimestamp(vence); // exactamente el vencimiento
    await prestamo.connect(ana).devolver(1);

    expect(await prestamo.saldo(ana.address)).to.equal(DEPOSITO);
  });

  it("★ nadie devuelve un equipo que no tiene", async () => {
    const { prestamo, ana, beto } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 1, { value: DEPOSITO });
    await expect(prestamo.connect(beto).devolver(1))
      .to.be.revertedWithCustomError(prestamo, "NoLoTienesTu");
  });
});

describe("PrestamoEquipos · mora (esto es lo que no se puede mostrar en Remix)", () => {
  it("★ pasado el plazo, estaVencido es cierto y diasDeMora cuenta los días", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 1, { value: DEPOSITO });

    expect(await prestamo.estaVencido(1)).to.equal(false);
    expect(await prestamo.diasDeMora(1)).to.equal(0n);

    await time.increase(4 * DIA); // un día de plazo, cuatro transcurridos

    expect(await prestamo.estaVencido(1)).to.equal(true);
    expect(await prestamo.diasDeMora(1)).to.equal(3n);
  });

  it("★ la división entera trunca: 1,9 días de mora se cuentan como 1", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 1, { value: DEPOSITO });

    await time.increase(DIA + Math.floor(1.9 * DIA));
    expect(await prestamo.diasDeMora(1)).to.equal(1n);
  });

  it("★ devolver en mora: el depósito queda para el laboratorio", async () => {
    const { prestamo, ana, encargado } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 1, { value: DEPOSITO });

    await time.increase(3 * DIA);
    await expect(prestamo.connect(ana).devolver(1))
      .to.emit(prestamo, "Devuelto")
      .withArgs(1n, ana.address, false, 0n);

    expect(await prestamo.saldo(ana.address)).to.equal(0n);
    expect(await prestamo.saldo(encargado.address)).to.equal(DEPOSITO);

    // Y el equipo vuelve a estar disponible: el laboratorio no pierde el activo.
    expect(await prestamo.estaDisponible(1)).to.equal(true);
  });

  it("★ quien devolvió en mora no puede retirar nada", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 1, { value: DEPOSITO });
    await time.increase(3 * DIA);
    await prestamo.connect(ana).devolver(1);

    await expect(prestamo.connect(ana).retirar())
      .to.be.revertedWithCustomError(prestamo, "SinSaldo");
  });
});

describe("PrestamoEquipos · recuperar a la fuerza", () => {
  it("el encargado recupera el equipo y se queda con el depósito", async () => {
    const { prestamo, ana, encargado } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 14, { value: DEPOSITO });

    await prestamo.connect(encargado).recuperar(1);

    expect(await prestamo.estaDisponible(1)).to.equal(true);
    expect(await prestamo.saldo(encargado.address)).to.equal(DEPOSITO);
    expect(await prestamo.saldo(ana.address)).to.equal(0n);
  });

  it("★ solo el encargado recupera", async () => {
    const { prestamo, ana, beto } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(ana).prestar(1, 1, { value: DEPOSITO });
    await expect(prestamo.connect(beto).recuperar(1))
      .to.be.revertedWithCustomError(prestamo, "SoloElEncargado");
  });

  it("recuperar un equipo que nadie tiene no acredita nada a nadie", async () => {
    const { prestamo, encargado } = await loadFixture(desplegarPrestamo);
    await prestamo.connect(encargado).recuperar(1);
    expect(await prestamo.saldo(encargado.address)).to.equal(0n);
  });
});

describe("PrestamoEquipos · dinero que llega solo", () => {
  it("★ rechaza ether enviado sin llamar a ninguna función", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);
    await expect(ana.sendTransaction({ to: prestamo.target, value: 1n }))
      .to.be.revertedWithCustomError(prestamo, "EnvioDirectoNoPermitido");
  });

  it("★ rechaza una llamada a una función que no existe", async () => {
    const { prestamo, ana } = await loadFixture(desplegarPrestamo);
    await expect(ana.sendTransaction({ to: prestamo.target, data: "0xdeadbeef" }))
      .to.be.revertedWithCustomError(prestamo, "EnvioDirectoNoPermitido");
  });

  it("★ sin saldo no se puede retirar", async () => {
    const { prestamo, beto } = await loadFixture(desplegarPrestamo);
    await expect(prestamo.connect(beto).retirar())
      .to.be.revertedWithCustomError(prestamo, "SinSaldo");
  });
});
