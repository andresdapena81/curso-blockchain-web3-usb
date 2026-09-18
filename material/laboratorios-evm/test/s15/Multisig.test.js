/**
 * Laboratorio 15 · multisig mínimo 2 de 3
 *
 *     npx hardhat test test/s15/Multisig.test.js
 *
 * El mecanismo de Safe, sin Safe: proponer (y confirmar), confirmar, ejecutar.
 * Las pruebas marcadas con ★ fallan en el andamiaje hasta completar
 * confirmar() y ejecutar() en contracts/s15/MultisigUSB.sol.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture } = networkHelpers;

async function desplegarMultisig() {
  const [ana, beto, carla, extrano, destino] = await ethers.getSigners();
  const multisig = await ethers.deployContract("MultisigUSB", [[ana.address, beto.address, carla.address], 2]);
  await ana.sendTransaction({ to: await multisig.getAddress(), value: ethers.parseEther("3") });
  return { multisig, ana, beto, carla, extrano, destino };
}

describe("S15 · MultisigUSB · configuración", () => {
  it("guarda los 3 firmantes y el umbral 2", async () => {
    const { multisig, ana, carla } = await loadFixture(desplegarMultisig);
    expect(await multisig.umbral()).to.equal(2n);
    expect(await multisig.esFirmante(ana.address)).to.equal(true);
    expect(await multisig.firmantes(2)).to.equal(carla.address);
  });

  it("rechaza configuraciones absurdas: umbral 0, umbral > n, firmante repetido", async () => {
    const [a, b] = await ethers.getSigners();
    const F = await ethers.getContractFactory("MultisigUSB");
    await expect(F.deploy([a.address, b.address], 0)).to.be.revertedWithCustomError(F, "ConfiguracionInvalida");
    await expect(F.deploy([a.address, b.address], 3)).to.be.revertedWithCustomError(F, "ConfiguracionInvalida");
    await expect(F.deploy([a.address, a.address], 1)).to.be.revertedWithCustomError(F, "ConfiguracionInvalida");
  });

  it("un extraño no puede proponer", async () => {
    const { multisig, extrano, destino } = await loadFixture(desplegarMultisig);
    await expect(multisig.connect(extrano).proponer(destino.address, 1n, "0x"))
      .to.be.revertedWithCustomError(multisig, "NoEsFirmante");
  });
});

describe("S15 · MultisigUSB · flujo m de n", () => {
  it("★ proponer cuenta como la primera confirmación", async () => {
    const { multisig, ana, destino } = await loadFixture(desplegarMultisig);
    await multisig.connect(ana).proponer(destino.address, ethers.parseEther("1"), "0x");
    const t = await multisig.transacciones(0);
    expect(t.confirmaciones).to.equal(1n);
    expect(await multisig.confirmo(0, ana.address)).to.equal(true);
  });

  it("★ con una sola firma NO se ejecuta", async () => {
    const { multisig, ana, destino } = await loadFixture(desplegarMultisig);
    await multisig.connect(ana).proponer(destino.address, ethers.parseEther("1"), "0x");
    await expect(multisig.connect(ana).ejecutar(0))
      .to.be.revertedWithCustomError(multisig, "FaltanConfirmaciones").withArgs(1n, 2n);
  });

  it("★ con dos firmas se ejecuta y el dinero llega", async () => {
    const { multisig, ana, beto, destino } = await loadFixture(desplegarMultisig);
    const monto = ethers.parseEther("1");
    await multisig.connect(ana).proponer(destino.address, monto, "0x");
    await expect(multisig.connect(beto).confirmar(0)).to.emit(multisig, "Confirmada").withArgs(0n, beto.address);
    await expect(multisig.connect(beto).ejecutar(0)).to.changeEtherBalance(ethers, destino, monto);
    expect((await multisig.transacciones(0)).ejecutada).to.equal(true);
  });

  it("★ nadie confirma dos veces", async () => {
    const { multisig, ana, destino } = await loadFixture(desplegarMultisig);
    await multisig.connect(ana).proponer(destino.address, 1n, "0x");
    await expect(multisig.connect(ana).confirmar(0)).to.be.revertedWithCustomError(multisig, "YaConfirmo");
  });

  it("★ una transacción ejecutada no se ejecuta otra vez", async () => {
    const { multisig, ana, beto, carla, destino } = await loadFixture(desplegarMultisig);
    await multisig.connect(ana).proponer(destino.address, ethers.parseEther("1"), "0x");
    await multisig.connect(beto).confirmar(0);
    await multisig.connect(beto).ejecutar(0);
    await expect(multisig.connect(carla).ejecutar(0)).to.be.revertedWithCustomError(multisig, "YaEjecutada");
  });

  it("★ revocar antes de ejecutar devuelve la transacción por debajo del umbral", async () => {
    const { multisig, ana, beto, destino } = await loadFixture(desplegarMultisig);
    await multisig.connect(ana).proponer(destino.address, 1n, "0x");
    await multisig.connect(beto).confirmar(0);
    await multisig.connect(beto).revocar(0);
    await expect(multisig.connect(ana).ejecutar(0))
      .to.be.revertedWithCustomError(multisig, "FaltanConfirmaciones").withArgs(1n, 2n);
  });

  it("un extraño no puede confirmar ni ejecutar", async () => {
    const { multisig, ana, extrano, destino } = await loadFixture(desplegarMultisig);
    await multisig.connect(ana).proponer(destino.address, 1n, "0x");
    await expect(multisig.connect(extrano).confirmar(0)).to.be.revertedWithCustomError(multisig, "NoEsFirmante");
    await expect(multisig.connect(extrano).ejecutar(0)).to.be.revertedWithCustomError(multisig, "NoEsFirmante");
  });

  it("★ si la llamada de destino falla, la ejecución revierte entera", async () => {
    const { multisig, ana, beto, destino } = await loadFixture(desplegarMultisig);
    await multisig.connect(ana).proponer(destino.address, ethers.parseEther("100"), "0x"); // no hay 100 ETH
    await multisig.connect(beto).confirmar(0);
    await expect(multisig.connect(beto).ejecutar(0)).to.be.revertedWithCustomError(multisig, "EjecucionFallida");
    expect((await multisig.transacciones(0)).ejecutada).to.equal(false);
  });
});
