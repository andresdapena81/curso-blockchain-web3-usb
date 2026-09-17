/**
 * Laboratorio 11 · NFT de credenciales con metadata en IPFS
 *
 *     npx hardhat test test/s11/DiplomaUSB.test.js
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture } = networkHelpers;

const URI1 = "ipfs://bafybeigdyrindexamplecid0001/1.json";
const URI2 = "ipfs://bafybeigdyrindexamplecid0002/2.json";

async function desplegar() {
  const [universidad, ana, beto] = await ethers.getSigners();
  const d = await ethers.deployContract("DiplomaUSB");
  return { d, universidad, ana, beto };
}

describe("S11 · DiplomaUSB · no fungibilidad", () => {
  it("cada token tiene un id único y consecutivo", async () => {
    const { d, ana, beto } = await loadFixture(desplegar);
    await d.emitir(ana.address, URI1);
    await d.emitir(beto.address, URI2);
    expect(await d.ownerOf(1)).to.equal(ana.address);
    expect(await d.ownerOf(2)).to.equal(beto.address);
    expect(await d.totalEmitidos()).to.equal(2n);
  });

  it("cada token apunta a su propia metadata en IPFS", async () => {
    const { d, ana, beto } = await loadFixture(desplegar);
    await d.emitir(ana.address, URI1);
    await d.emitir(beto.address, URI2);
    expect(await d.tokenURI(1)).to.equal(URI1);
    expect(await d.tokenURI(2)).to.equal(URI2);
  });

  it("emite el evento con el id, el destinatario y el uri", async () => {
    const { d, ana } = await loadFixture(desplegar);
    await expect(d.emitir(ana.address, URI1))
      .to.emit(d, "DiplomaEmitido").withArgs(1, ana.address, URI1);
  });
});

describe("S11 · DiplomaUSB · control y estándar", () => {
  it("solo la universidad emite", async () => {
    const { d, ana } = await loadFixture(desplegar);
    await expect(d.connect(ana).emitir(ana.address, URI1))
      .to.be.revertedWithCustomError(d, "OwnableUnauthorizedAccount");
  });

  it("declara soportar la interfaz ERC-721 y la de metadata", async () => {
    const { d } = await loadFixture(desplegar);
    expect(await d.supportsInterface("0x80ac58cd")).to.equal(true); // ERC721
    expect(await d.supportsInterface("0x5b5e139f")).to.equal(true); // ERC721Metadata
    expect(await d.supportsInterface("0xffffffff")).to.equal(false);
  });

  it("consultar el dueño de un token inexistente revierte", async () => {
    const { d } = await loadFixture(desplegar);
    await expect(d.ownerOf(99)).to.be.revertedWithCustomError(d, "ERC721NonexistentToken");
  });

  it("el dueño puede transferir su diploma", async () => {
    const { d, ana, beto } = await loadFixture(desplegar);
    await d.emitir(ana.address, URI1);
    await d.connect(ana).transferFrom(ana.address, beto.address, 1);
    expect(await d.ownerOf(1)).to.equal(beto.address);
    // el enlace a la metadata NO cambia al transferir
    expect(await d.tokenURI(1)).to.equal(URI1);
  });
});
