/**
 * Laboratorio 07 · ¿Se puede rodear el tope de reventa?
 *
 *     npx hardhat test test/s07/AtaqueAlTope.test.js
 *
 * El encargo del laboratorio es de una sola línea: revendan una entrada por
 * encima del tope. Estas pruebas son el registro de los intentos. Cuatro
 * fallan, y el quinto no: léanlo entero antes de sacar conclusiones.
 */

import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture, time } = networkHelpers;

const PRECIO = ethers.parseEther("0.1");   // precio del lote original
const TOPE = ethers.parseEther("0.12");    // tope de reventa: 20 % más
const AFORO = 50;
const SEMANA = 7 * 24 * 60 * 60;

async function desplegarYComprar() {
  const [organizador, revendedor, victima, complice] = await ethers.getSigners();
  const cierre = (await time.latest()) + SEMANA;

  const entradas = await ethers.deployContract("Entradas", [
    "Concierto USB", AFORO, PRECIO, TOPE, cierre,
  ]);

  // El revendedor no compra con su billetera: compra con su propio contrato.
  const atacante = await ethers.deployContract("AtacanteTope", [entradas.target], revendedor);
  await atacante.connect(revendedor).comprarOriginal({ value: PRECIO });
  const tokenId = 1n;

  expect(await entradas.ownerOf(tokenId)).to.equal(atacante.target);
  return { entradas, atacante, organizador, revendedor, victima, complice, tokenId, cierre };
}

describe("S07 · el revendedor programa su propio contrato", () => {
  it("la compra original sí funciona: el atacante es dueño de la entrada 1", async () => {
    const { entradas, atacante, tokenId } = await loadFixture(desplegarYComprar);
    expect(await entradas.ownerOf(tokenId)).to.equal(atacante.target);
    expect(await entradas.quedanDisponibles()).to.equal(BigInt(AFORO) - 1n);
  });

  it("★ intento 1 · transferFrom directo: BLOQUEADO", async () => {
    const { entradas, atacante, victima, tokenId } = await loadFixture(desplegarYComprar);
    await expect(atacante.intentoTransferenciaDirecta(tokenId, victima.address))
      .to.be.revertedWithCustomError(entradas, "TransferenciaDirectaBloqueada");
  });

  it("★ intento 2 · safeTransferFrom: BLOQUEADO igual", async () => {
    const { entradas, atacante, victima, tokenId } = await loadFixture(desplegarYComprar);
    await expect(atacante.intentoTransferenciaSegura(tokenId, victima.address))
      .to.be.revertedWithCustomError(entradas, "TransferenciaDirectaBloqueada");
  });

  it("★ intento 3 · aprobar a un cómplice: la aprobación SE CONCEDE…", async () => {
    const { entradas, atacante, complice, tokenId } = await loadFixture(desplegarYComprar);
    await atacante.intentoAprobarAComplice(tokenId, complice.address);
    expect(await entradas.getApproved(tokenId)).to.equal(complice.address);
    // Aprobar no mueve nada: solo anota un permiso. El bloqueo aparece al usarlo.
  });

  it("★ …pero el cómplice tampoco puede moverla: BLOQUEADO", async () => {
    const { entradas, atacante, complice, victima, tokenId } = await loadFixture(desplegarYComprar);
    await atacante.intentoAprobarAComplice(tokenId, complice.address);
    await expect(
      entradas.connect(complice).transferFrom(atacante.target, victima.address, tokenId),
    ).to.be.revertedWithCustomError(entradas, "TransferenciaDirectaBloqueada");
  });

  it("★ intento 4 · poner en venta por encima del tope: RECHAZADO con el tope adentro", async () => {
    const { entradas, atacante, tokenId } = await loadFixture(desplegarYComprar);
    const abusivo = ethers.parseEther("0.5");
    await expect(atacante.intentoPrecioSobreTope(tokenId, abusivo))
      .to.be.revertedWithCustomError(entradas, "PrecioSobreTope")
      .withArgs(TOPE, abusivo);
  });

  it("★ el borde: justo EN el tope sí se acepta", async () => {
    const { entradas, atacante, tokenId } = await loadFixture(desplegarYComprar);
    await atacante.intentoPrecioSobreTope(tokenId, TOPE);
    const oferta = await entradas.ofertas(tokenId);
    expect(oferta.activa).to.equal(true);
    expect(oferta.precio).to.equal(TOPE);
  });

  it("★ intento 5 · vender en el tope y cobrar la diferencia POR FUERA: el contrato no lo impide", async () => {
    const { entradas, atacante, revendedor, victima, tokenId } = await loadFixture(desplegarYComprar);

    // 1 · El comprador le paga al revendedor por fuera de la cadena. Aquí lo
    //     simulamos con una transferencia directa de ether entre personas:
    //     para el contrato de entradas, esto sencillamente no existe.
    const porFuera = ethers.parseEther("0.38");
    await victima.sendTransaction({ to: revendedor.address, value: porFuera });

    // 2 · Y ahora la reventa "legal", en el tope exacto.
    await atacante.connect(revendedor).ponerEnVentaEnElTope(tokenId);
    await entradas.connect(victima).comprarReventa(tokenId, { value: TOPE });

    expect(await entradas.ownerOf(tokenId)).to.equal(victima.address);

    // La víctima pagó 0,12 en cadena y 0,38 por fuera: 0,5 en total, cuatro
    // veces el tope. Todo lo que el contrato puede ver dice que se cumplió.
    const oferta = await entradas.ofertas(tokenId);
    expect(oferta.activa).to.equal(false);
  });

  it("el saldo del atacante refleja SOLO lo que pasó por el contrato", async () => {
    const { entradas, atacante, revendedor, victima, tokenId } = await loadFixture(desplegarYComprar);
    await atacante.connect(revendedor).ponerEnVentaEnElTope(tokenId);
    await entradas.connect(victima).comprarReventa(tokenId, { value: TOPE });

    // El contrato acredita el tope al vendedor, que es el contrato atacante.
    expect(await entradas.saldos(atacante.target)).to.equal(TOPE);
    // Lo cobrado por fuera no aparece en ninguna parte del estado del contrato.
  });
});

describe("S07 · lo que el bloqueo NO impide", () => {
  it("una entrada se puede seguir revendiendo cuantas veces quieran, siempre bajo el tope", async () => {
    const { entradas, atacante, revendedor, victima, complice, tokenId } = await loadFixture(desplegarYComprar);

    await atacante.connect(revendedor).ponerEnVentaEnElTope(tokenId);
    await entradas.connect(victima).comprarReventa(tokenId, { value: TOPE });

    await entradas.connect(victima).ponerEnVenta(tokenId, TOPE);
    await entradas.connect(complice).comprarReventa(tokenId, { value: TOPE });

    expect(await entradas.ownerOf(tokenId)).to.equal(complice.address);
  });

  it("★ tras el cierre de la reventa, ni el revendedor más hábil mueve la entrada", async () => {
    const { entradas, atacante, revendedor, victima, tokenId, cierre } = await loadFixture(desplegarYComprar);
    await atacante.connect(revendedor).ponerEnVentaEnElTope(tokenId);

    await time.increaseTo(cierre + 1);

    await expect(entradas.connect(victima).comprarReventa(tokenId, { value: TOPE }))
      .to.be.revertedWithCustomError(entradas, "ReventaCerrada");
    await expect(atacante.intentoTransferenciaDirecta(tokenId, victima.address))
      .to.be.revertedWithCustomError(entradas, "TransferenciaDirectaBloqueada");
  });
});
