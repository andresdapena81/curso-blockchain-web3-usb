/**
 * Pruebas del Tablón · contrato de demostración comentado
 *
 * Estas pruebas están aquí por dos razones. La primera: un contrato de clase
 * que no se prueba es una promesa, no un ejemplo. La segunda: leerlas enseña
 * casi tanto como leer el contrato, porque cada prueba nombra un
 * comportamiento esperado.
 *
 *     npx hardhat test test/demo/Tablon.test.js
 */

import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture, time } = networkHelpers;

const PRECIO = ethers.parseUnits("100", "gwei"); // wei por segundo
const HORA = 3600;

// loadFixture exige una función CON NOMBRE: despliega una vez y luego
// restaura el estado, que es mucho más rápido que volver a desplegar.
async function desplegarTablon() {
  const [duenno, ana, beto] = await ethers.getSigners();
  const tablon = await ethers.deployContract("Tablon", [PRECIO]);
  return { tablon, duenno, ana, beto };
}

describe("Tablón · despliegue", () => {
  it("fija el precio por segundo y deja el tablón libre", async () => {
    const { tablon } = await loadFixture(desplegarTablon);
    expect(await tablon.precioPorSegundo()).to.equal(PRECIO);
    expect(await tablon.estaLibre()).to.equal(true);
    expect(await tablon.tiempoRestante()).to.equal(0n);
    expect(await tablon.mensaje()).to.equal("");
  });

  it("el dueño es quien despliega", async () => {
    const { tablon, duenno } = await loadFixture(desplegarTablon);
    expect(await tablon.owner()).to.equal(duenno.address);
  });

  it("calcula el costo multiplicando segundos por precio", async () => {
    const { tablon } = await loadFixture(desplegarTablon);
    expect(await tablon.costo(HORA)).to.equal(PRECIO * BigInt(HORA));
  });
});

describe("Tablón · publicar", () => {
  it("publica, ocupa el tablón y acredita al dueño", async () => {
    const { tablon, ana, duenno } = await loadFixture(desplegarTablon);
    const valor = await tablon.costo(HORA);

    await tablon.connect(ana).publicar("Hola desde la USB", HORA, { value: valor });

    expect(await tablon.mensaje()).to.equal("Hola desde la USB");
    expect(await tablon.autor()).to.equal(ana.address);
    expect(await tablon.estaLibre()).to.equal(false);
    // El dinero NO se envió: quedó acreditado. Ese es el patrón de retiro.
    expect(await tablon.saldo(duenno.address)).to.equal(valor);
    expect(await ethers.provider.getBalance(tablon.target)).to.equal(valor);
  });

  it("emite Publicado con los datos correctos", async () => {
    const { tablon, ana } = await loadFixture(desplegarTablon);
    const valor = await tablon.costo(HORA);
    await expect(tablon.connect(ana).publicar("Aviso", HORA, { value: valor }))
      .to.emit(tablon, "Publicado")
      .withArgs(ana.address, (v) => v > 0n, valor, "Aviso");
  });

  it("★ rechaza el pago que no es exacto, por debajo y por encima", async () => {
    const { tablon, ana } = await loadFixture(desplegarTablon);
    const valor = await tablon.costo(HORA);

    await expect(tablon.connect(ana).publicar("x", HORA, { value: valor - 1n }))
      .to.be.revertedWithCustomError(tablon, "PagoIncorrecto")
      .withArgs(valor, valor - 1n);

    await expect(tablon.connect(ana).publicar("x", HORA, { value: valor + 1n }))
      .to.be.revertedWithCustomError(tablon, "PagoIncorrecto")
      .withArgs(valor, valor + 1n);
  });

  it("★ rechaza el mensaje vacío", async () => {
    const { tablon, ana } = await loadFixture(desplegarTablon);
    await expect(
      tablon.connect(ana).publicar("", HORA, { value: await tablon.costo(HORA) }),
    ).to.be.revertedWithCustomError(tablon, "MensajeVacio");
  });

  it("★ rechaza duraciones fuera de los límites, y acepta los límites exactos", async () => {
    const { tablon, ana } = await loadFixture(desplegarTablon);

    for (const malo of [59, 7 * 24 * 3600 + 1]) {
      await expect(
        tablon.connect(ana).publicar("x", malo, { value: await tablon.costo(malo) }),
      ).to.be.revertedWithCustomError(tablon, "DuracionInvalida");
    }

    // El borde exacto SÍ se acepta: 60 segundos.
    await tablon.connect(ana).publicar("borde", 60, { value: await tablon.costo(60) });
    expect(await tablon.mensaje()).to.equal("borde");
  });

  it("★ no se puede publicar mientras el tablón está ocupado", async () => {
    const { tablon, ana, beto } = await loadFixture(desplegarTablon);
    await tablon.connect(ana).publicar("de Ana", HORA, { value: await tablon.costo(HORA) });

    await expect(
      tablon.connect(beto).publicar("de Beto", HORA, { value: await tablon.costo(HORA) }),
    ).to.be.revertedWithCustomError(tablon, "TablonOcupado");
  });

  it("★ cuando vence el plazo, otro puede publicar encima", async () => {
    const { tablon, ana, beto } = await loadFixture(desplegarTablon);
    await tablon.connect(ana).publicar("de Ana", HORA, { value: await tablon.costo(HORA) });

    await time.increase(HORA); // el reloj de la red de pruebas avanza a pedido

    expect(await tablon.estaLibre()).to.equal(true);
    expect(await tablon.tiempoRestante()).to.equal(0n);
    await tablon.connect(beto).publicar("de Beto", HORA, { value: await tablon.costo(HORA) });
    expect(await tablon.autor()).to.equal(beto.address);
  });

  it("tiempoRestante baja con el reloj y no revierte al vencer", async () => {
    const { tablon, ana } = await loadFixture(desplegarTablon);
    await tablon.connect(ana).publicar("x", HORA, { value: await tablon.costo(HORA) });

    await time.increase(HORA / 2);
    const restante = await tablon.tiempoRestante();
    expect(restante).to.be.greaterThan(0n);
    expect(restante).to.be.lessThanOrEqual(BigInt(HORA / 2));

    await time.increase(HORA); // bien pasado el vencimiento
    expect(await tablon.tiempoRestante()).to.equal(0n);
  });
});

describe("Tablón · retirar (patrón de retiro)", () => {
  // Ojo al escribir pruebas: NO conviene encadenar `changeEtherBalance` con
  // `emit` sobre la misma transacción. Cada matcher la procesa por su cuenta y
  // la transacción termina enviándose dos veces; la segunda revierte con
  // SinSaldo y la prueba falla por un motivo que no tiene que ver con el
  // contrato. Se comprueba una cosa por prueba.

  it("el dueño retira lo acreditado y le llega el dinero", async () => {
    const { tablon, ana, duenno } = await loadFixture(desplegarTablon);
    const valor = await tablon.costo(HORA);
    await tablon.connect(ana).publicar("x", HORA, { value: valor });

    await expect(tablon.connect(duenno).retirar())
      .to.changeEtherBalance(ethers, duenno, valor);

    expect(await tablon.saldo(duenno.address)).to.equal(0n);
    expect(await ethers.provider.getBalance(tablon.target)).to.equal(0n);
  });

  it("al retirar emite Retirado con quien retira y cuánto", async () => {
    const { tablon, ana, duenno } = await loadFixture(desplegarTablon);
    const valor = await tablon.costo(HORA);
    await tablon.connect(ana).publicar("x", HORA, { value: valor });

    await expect(tablon.connect(duenno).retirar())
      .to.emit(tablon, "Retirado")
      .withArgs(duenno.address, valor);
  });

  it("★ quien no tiene saldo no puede retirar", async () => {
    const { tablon, beto } = await loadFixture(desplegarTablon);
    await expect(tablon.connect(beto).retirar())
      .to.be.revertedWithCustomError(tablon, "SinSaldo");
  });

  it("★ no se puede retirar dos veces", async () => {
    const { tablon, ana, duenno } = await loadFixture(desplegarTablon);
    await tablon.connect(ana).publicar("x", HORA, { value: await tablon.costo(HORA) });
    await tablon.connect(duenno).retirar();
    await expect(tablon.connect(duenno).retirar())
      .to.be.revertedWithCustomError(tablon, "SinSaldo");
  });
});

describe("Tablón · moderar", () => {
  it("el dueño borra el mensaje y le acredita al autor el tiempo no usado", async () => {
    const { tablon, ana, duenno } = await loadFixture(desplegarTablon);
    await tablon.connect(ana).publicar("mensaje incómodo", HORA, {
      value: await tablon.costo(HORA),
    });

    await time.increase(HORA / 2); // se usó la mitad del tiempo
    await expect(tablon.connect(duenno).moderar()).to.emit(tablon, "Moderado");

    expect(await tablon.mensaje()).to.equal("");
    expect(await tablon.autor()).to.equal(ethers.ZeroAddress);
    expect(await tablon.estaLibre()).to.equal(true);

    // A Ana le quedó acreditado, aproximadamente, medio pago.
    const saldoAna = await tablon.saldo(ana.address);
    const mitad = (await tablon.costo(HORA)) / 2n;
    expect(saldoAna).to.be.closeTo(mitad, PRECIO * 5n); // margen de unos segundos

    // Y Ana puede reclamarlo de verdad.
    await expect(tablon.connect(ana).retirar()).to.changeEtherBalance(ethers, ana, saldoAna);
  });

  it("★ solo el dueño puede moderar", async () => {
    const { tablon, ana, beto } = await loadFixture(desplegarTablon);
    await tablon.connect(ana).publicar("x", HORA, { value: await tablon.costo(HORA) });

    await expect(tablon.connect(beto).moderar())
      .to.be.revertedWithCustomError(tablon, "OwnableUnauthorizedAccount")
      .withArgs(beto.address);
  });

  it("★ no se puede moderar si no hay nada publicado", async () => {
    const { tablon, duenno } = await loadFixture(desplegarTablon);
    await expect(tablon.connect(duenno).moderar())
      .to.be.revertedWithCustomError(tablon, "NoHayNadaQueModerar");
  });

  it("★ si el dueño ya retiró, el reembolso se limita a lo que quede", async () => {
    const { tablon, ana, duenno } = await loadFixture(desplegarTablon);
    await tablon.connect(ana).publicar("x", HORA, { value: await tablon.costo(HORA) });
    await tablon.connect(duenno).retirar(); // el dueño se llevó todo

    // Moderar no revierte: devuelve lo que haya, que es cero.
    await tablon.connect(duenno).moderar();
    expect(await tablon.saldo(ana.address)).to.equal(0n);
    expect(await tablon.mensaje()).to.equal("");
  });
});

describe("Tablón · receive y fallback", () => {
  it("★ rechaza el ether enviado sin llamar a ninguna función", async () => {
    const { tablon, ana } = await loadFixture(desplegarTablon);
    await expect(
      ana.sendTransaction({ to: tablon.target, value: 1n }),
    ).to.be.revertedWithCustomError(tablon, "EnvioDirectoNoPermitido");
  });

  it("★ rechaza una llamada a una función que no existe", async () => {
    const { tablon, ana } = await loadFixture(desplegarTablon);
    await expect(
      ana.sendTransaction({ to: tablon.target, data: "0x12345678" }),
    ).to.be.revertedWithCustomError(tablon, "EnvioDirectoNoPermitido");
  });
});
