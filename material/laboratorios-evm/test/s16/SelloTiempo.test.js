/**
 * Laboratorio 16 · el contrato que se despliega en L1 y en L2
 *
 *     npx hardhat test test/s16/SelloTiempo.test.js
 *
 * Antes de gastar ETH de prueba en dos redes, se comprueba en la red local que
 * el contrato hace lo que dice.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture, time } = networkHelpers;

async function desplegar() {
  const [ana, beto] = await ethers.getSigners();
  const sello = await ethers.deployContract("SelloTiempo");
  return { sello, ana, beto };
}

describe("S16 · SelloTiempo", () => {
  it("sella un hash con el momento y la cuenta que lo registró", async () => {
    const { sello, ana } = await loadFixture(desplegar);
    const h = ethers.id("acta-de-grado-2026.pdf");
    await expect(sello.connect(ana).sellar(h)).to.emit(sello, "Sellado");
    expect(await sello.selladoEn(h)).to.equal(BigInt(await time.latest()));
    expect(await sello.selladoPor(h)).to.equal(ana.address);
    expect(await sello.totalSellos()).to.equal(1n);
  });

  it("el mismo hash no se sella dos veces: el primero conserva la prioridad", async () => {
    const { sello, ana, beto } = await loadFixture(desplegar);
    const h = ethers.id("mismo-documento");
    await sello.connect(ana).sellar(h);
    await expect(sello.connect(beto).sellar(h)).to.be.revertedWithCustomError(sello, "YaSellado");
    expect(await sello.selladoPor(h)).to.equal(ana.address);
  });

  it("un hash nunca sellado devuelve 0", async () => {
    const { sello } = await loadFixture(desplegar);
    expect(await sello.selladoEn(ethers.id("no-existe"))).to.equal(0n);
  });
});
