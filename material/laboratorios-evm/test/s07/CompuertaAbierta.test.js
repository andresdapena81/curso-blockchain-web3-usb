/**
 * Laboratorio 07 · la compuerta abierta
 *
 *     npx hardhat test test/s07/CompuertaAbierta.test.js
 *
 * El mismo ataque contra las dos versiones del contrato del proyecto:
 * la que estaba publicada hasta el 7 de octubre de 2026, y la corregida.
 * La única diferencia entre ambas son tres líneas de `_update`.
 */

import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture, time } = networkHelpers;

const PRECIO = ethers.parseEther("0.1");
const TOPE = ethers.parseEther("0.12");
const SEMANA = 7 * 24 * 60 * 60;

/** Monta el escenario contra el contrato que se le indique. */
function escenarioCon(nombreContrato) {
  return async function montar() {
    const [, atacanteEOA, vendedor, comprador] = await ethers.getSigners();
    const cierre = (await time.latest()) + SEMANA;
    const entradas = await ethers.deployContract(nombreContrato, ["Concierto USB", 50, PRECIO, TOPE, cierre]);

    // El atacante compra con su propio contrato la entrada 1: la que quiere sacar.
    const atacante = await ethers.deployContract("AtacanteCompuerta", [entradas.target], atacanteEOA);
    await atacante.connect(atacanteEOA).comprarOriginal({ value: PRECIO });

    // Alguien más compra la entrada 2 y la pone en venta, en el tope.
    await entradas.connect(vendedor).comprar({ value: PRECIO });
    await entradas.connect(vendedor).ponerEnVenta(2, TOPE);

    return { entradas, atacante, atacanteEOA, comprador };
  };
}

describe("S07 · el ataque de la compuerta · versión VULNERABLE", () => {
  it("★ el atacante saca su entrada por fuera del tope desde onERC721Received", async () => {
    const { entradas, atacante, atacanteEOA, comprador } =
      await loadFixture(escenarioCon("EntradasVulnerable"));

    await atacante.connect(atacanteEOA).prepararEscape(1, comprador.address);
    await atacante.connect(atacanteEOA).comprarYEscapar(2, { value: TOPE });

    // La compra de la 2 fue legítima; el escape de la 1 no debería haber sido posible.
    expect(await atacante.loLogro()).to.equal(true);
    expect(await entradas.ownerOf(1)).to.equal(comprador.address);

    // Y lo más grave: el contrato no registra ningún precio para ese traspaso.
    // Lo que se haya pagado por fuera es invisible, y el tope no intervino.
    expect(await entradas.saldos(atacante.target)).to.equal(0n);
  });
});

describe("S07 · el mismo ataque · versión CORREGIDA", () => {
  it("★ la compuerta se cierra antes del aviso, y el escape falla", async () => {
    const { entradas, atacante, atacanteEOA, comprador } =
      await loadFixture(escenarioCon("Entradas"));

    await atacante.connect(atacanteEOA).prepararEscape(1, comprador.address);
    await atacante.connect(atacanteEOA).comprarYEscapar(2, { value: TOPE });

    expect(await atacante.loLogro()).to.equal(false);
    expect(await entradas.ownerOf(1)).to.equal(atacante.target);
  });

  it("y la compra legítima que disparaba el ataque sí se completa", async () => {
    const { entradas, atacante, atacanteEOA, comprador } =
      await loadFixture(escenarioCon("Entradas"));

    await atacante.connect(atacanteEOA).prepararEscape(1, comprador.address);
    await atacante.connect(atacanteEOA).comprarYEscapar(2, { value: TOPE });

    // La entrada 2 cambió de dueño con normalidad: la corrección no rompe nada.
    expect(await entradas.ownerOf(2)).to.equal(atacante.target);
  });

  it("★ y una reventa normal entre personas sigue funcionando", async () => {
    const { entradas, comprador } = await loadFixture(escenarioCon("Entradas"));
    await entradas.connect(comprador).comprarReventa(2, { value: TOPE });
    expect(await entradas.ownerOf(2)).to.equal(comprador.address);
  });
});
