/**
 * Laboratorio 10 · ERC-20 con tope, quema, y el patrón approve/transferFrom
 *
 *     npx hardhat test test/s10/FichaUSB.test.js
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture } = networkHelpers;

const TOPE = 1_000_000n;                 // en tokens
const u = (x) => ethers.parseUnits(String(x), 18);

async function desplegar() {
  const [organizador, ana, beto, tesoreria] = await ethers.getSigners();
  const ficha = await ethers.deployContract("FichaUSB", [TOPE]);
  return { ficha, organizador, ana, beto, tesoreria };
}

describe("S10 · FichaUSB · estándar", () => {
  it("tiene nombre, símbolo y 18 decimales", async () => {
    const { ficha } = await loadFixture(desplegar);
    expect(await ficha.name()).to.equal("Ficha USB");
    expect(await ficha.symbol()).to.equal("FUSB");
    expect(await ficha.decimals()).to.equal(18n);
    expect(await ficha.totalSupply()).to.equal(0n);
  });

  it("una transferencia mueve el saldo y emite Transfer", async () => {
    const { ficha, ana, beto } = await loadFixture(desplegar);
    await ficha.acunar(ana.address, 100);
    await expect(ficha.connect(ana).transfer(beto.address, u(30)))
      .to.emit(ficha, "Transfer").withArgs(ana.address, beto.address, u(30));
    expect(await ficha.balanceOf(ana.address)).to.equal(u(70));
    expect(await ficha.balanceOf(beto.address)).to.equal(u(30));
  });

  it("no se puede transferir más de lo que se tiene", async () => {
    const { ficha, ana, beto } = await loadFixture(desplegar);
    await ficha.acunar(ana.address, 10);
    await expect(ficha.connect(ana).transfer(beto.address, u(11)))
      .to.be.revertedWithCustomError(ficha, "ERC20InsufficientBalance");
  });
});

describe("S10 · FichaUSB · acuñar con tope", () => {
  it("solo el organizador acuña", async () => {
    const { ficha, ana } = await loadFixture(desplegar);
    await expect(ficha.connect(ana).acunar(ana.address, 1))
      .to.be.revertedWithCustomError(ficha, "OwnableUnauthorizedAccount");
  });

  it("acuñar aumenta el suministro total", async () => {
    const { ficha, ana } = await loadFixture(desplegar);
    await ficha.acunar(ana.address, 500);
    expect(await ficha.totalSupply()).to.equal(u(500));
  });

  it("★ no se puede acuñar por encima del tope", async () => {
    const { ficha, ana } = await loadFixture(desplegar);
    await ficha.acunar(ana.address, Number(TOPE));            // exactamente el tope
    expect(await ficha.totalSupply()).to.equal(u(TOPE.toString()));
    await expect(ficha.acunar(ana.address, 1))
      .to.be.revertedWithCustomError(ficha, "ERC20ExceededCap");
  });
});

describe("S10 · FichaUSB · quemar", () => {
  it("el titular quema los suyos y baja el suministro", async () => {
    const { ficha, ana } = await loadFixture(desplegar);
    await ficha.acunar(ana.address, 100);
    await ficha.connect(ana).burn(u(40));
    expect(await ficha.balanceOf(ana.address)).to.equal(u(60));
    expect(await ficha.totalSupply()).to.equal(u(60));
  });

  it("★ quemar libera espacio bajo el tope: se puede volver a acuñar", async () => {
    const { ficha, ana } = await loadFixture(desplegar);
    await ficha.acunar(ana.address, Number(TOPE));
    await ficha.connect(ana).burn(u(10));
    await ficha.acunar(ana.address, 10);                              // el tope mira el suministro vivo
    expect(await ficha.totalSupply()).to.equal(u(TOPE.toString()));  // de vuelta al tope
  });
});

describe("S10 · approve + transferFrom + Canje", () => {
  async function conCanje() {
    const base = await loadFixture(desplegar);
    const { ficha, ana, tesoreria } = base;
    await ficha.acunar(ana.address, 100);
    const canje = await ethers.deployContract("Canje", [await ficha.getAddress(), u(25), tesoreria.address]);
    return { ...base, canje };
  }

  it("sin aprobación, el canje revierte", async () => {
    const { ficha, canje, ana } = await conCanje();
    await expect(canje.connect(ana).canjear())
      .to.be.revertedWithCustomError(ficha, "ERC20InsufficientAllowance");
  });

  it("★ con aprobación exacta, el canje retira exactamente el precio", async () => {
    const { ficha, canje, ana, tesoreria } = await conCanje();
    await ficha.connect(ana).approve(await canje.getAddress(), u(25));
    await expect(canje.connect(ana).canjear()).to.emit(canje, "Canjeado").withArgs(ana.address, u(25));
    expect(await ficha.balanceOf(ana.address)).to.equal(u(75));
    expect(await ficha.balanceOf(tesoreria.address)).to.equal(u(25));
    expect(await ficha.allowance(ana.address, await canje.getAddress())).to.equal(0n);
    expect(await canje.premiosDe(ana.address)).to.equal(1n);
  });

  it("★ el contrato NO puede llevarse más de lo aprobado", async () => {
    const { ficha, canje, ana } = await conCanje();
    await ficha.connect(ana).approve(await canje.getAddress(), u(25));
    await canje.connect(ana).canjear();                       // gasta la aprobación
    await expect(canje.connect(ana).canjear())                // segundo intento sin re-aprobar
      .to.be.revertedWithCustomError(ficha, "ERC20InsufficientAllowance");
  });

  it("una aprobación se puede revocar poniéndola en cero", async () => {
    const { ficha, canje, ana } = await conCanje();
    await ficha.connect(ana).approve(await canje.getAddress(), u(25));
    await ficha.connect(ana).approve(await canje.getAddress(), 0);
    await expect(canje.connect(ana).canjear())
      .to.be.revertedWithCustomError(ficha, "ERC20InsufficientAllowance");
  });
});
