/**
 * Laboratorio 11 · reto opcional · el diploma como SBT (ERC-5192)
 *
 *     npx hardhat test test/s11/DiplomaSBT.test.js
 *
 * Con el andamiaje (andamiaje/s11/DiplomaSBT.sol copiado sobre
 * contracts/s11/DiplomaSBT.sol, y DiplomaUSB ya resuelto) fallan las ★.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture } = networkHelpers;

const URI1 = "ipfs://bafkreiexamplecidparaelprimerdiplomadelaboratorio1111/1.json";
const URI2 = "ipfs://bafkreiexamplecidparaelsegundodiplomadelaboratorio222/2.json";

async function desplegarSBT() {
  const [universidad, ana, beto, billeteraNueva] = await ethers.getSigners();
  const d = await ethers.deployContract("DiplomaSBT", [10n]);
  await d.emitir(ana.address, URI1);
  return { d, universidad, ana, beto, billeteraNueva };
}

describe("S11 · DiplomaSBT · ERC-5192", () => {
  it("declara ERC-5192 (0xb45a3c0e) además de ERC-721", async () => {
    const { d } = await loadFixture(desplegarSBT);
    expect(await d.supportsInterface("0xb45a3c0e")).to.equal(true);
    expect(await d.supportsInterface("0x80ac58cd")).to.equal(true);
  });

  it("★ al emitir, anuncia Locked(tokenId)", async () => {
    const { d, beto } = await loadFixture(desplegarSBT);
    await expect(d.emitir(beto.address, URI2)).to.emit(d, "Locked").withArgs(2);
  });

  it("★ locked() es true para un diploma existente", async () => {
    const { d } = await loadFixture(desplegarSBT);
    expect(await d.locked(1)).to.equal(true);
  });

  it("★ locked() de un token inexistente revierte", async () => {
    const { d } = await loadFixture(desplegarSBT);
    await expect(d.locked(99)).to.be.revertedWithCustomError(d, "ERC721NonexistentToken");
  });
});

describe("S11 · DiplomaSBT · no transferible", () => {
  it("★ transferFrom revierte, aunque lo pida el propio dueño", async () => {
    const { d, ana, beto } = await loadFixture(desplegarSBT);
    await expect(d.connect(ana).transferFrom(ana.address, beto.address, 1))
      .to.be.revertedWithCustomError(d, "DiplomaIntransferible").withArgs(1);
  });

  it("★ safeTransferFrom también revierte", async () => {
    const { d, ana, beto } = await loadFixture(desplegarSBT);
    await expect(d.connect(ana)["safeTransferFrom(address,address,uint256)"](ana.address, beto.address, 1))
      .to.be.revertedWithCustomError(d, "DiplomaIntransferible").withArgs(1);
  });

  it("★ la universidad revoca: el token deja de existir", async () => {
    const { d } = await loadFixture(desplegarSBT);
    await expect(d.revocar(1, "billetera perdida"))
      .to.emit(d, "DiplomaRevocado").withArgs(1, "billetera perdida");
    await expect(d.ownerOf(1)).to.be.revertedWithCustomError(d, "ERC721NonexistentToken");
  });

  it("★ billetera perdida: revocar y reemitir a otra cuenta (otro tokenId)", async () => {
    const { d, billeteraNueva } = await loadFixture(desplegarSBT);
    await d.revocar(1, "billetera perdida");
    await d.emitir(billeteraNueva.address, URI1);
    expect(await d.ownerOf(2)).to.equal(billeteraNueva.address);
    expect(await d.totalEmitidos()).to.equal(2n); // el 1 queda quemado, no se reutiliza
    await expect(d.ownerOf(1)).to.be.revertedWithCustomError(d, "ERC721NonexistentToken");
  });

  it("nadie más que la universidad revoca", async () => {
    const { d, ana } = await loadFixture(desplegarSBT);
    await expect(d.connect(ana).revocar(1, "x"))
      .to.be.revertedWithCustomError(d, "OwnableUnauthorizedAccount");
  });
});
