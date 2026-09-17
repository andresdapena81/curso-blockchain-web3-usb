/**
 * Laboratorio 09 · reentrancy: el ataque y las dos defensas
 *
 *     npx hardhat test test/s09/Reentrancy.test.js
 *
 * La prueba central demuestra que el MISMO atacante vacía el banco vulnerable
 * y fracasa contra el seguro. Es el robo de The DAO, en miniatura.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture } = networkHelpers;
const eth = (x) => ethers.parseEther(String(x));

async function escenario(nombreBanco) {
  const [dueno, ana, beto, carla, atacanteEOA] = await ethers.getSigners();
  const banco = await ethers.deployContract(nombreBanco);
  // Tres clientes honestos dejan 10 ETH en total.
  await banco.connect(ana).depositar({ value: eth(4) });
  await banco.connect(beto).depositar({ value: eth(3) });
  await banco.connect(carla).depositar({ value: eth(3) });
  return { banco, dueno, atacanteEOA };
}

// loadFixture exige funciones con nombre (no anónimas): una por banco.
const bancoVulnerable = () => escenario("BancoVulnerable");
const bancoSeguro = () => escenario("BancoSeguro");

describe("S09 · el banco vulnerable se vacía", () => {
  it("★ con 1 ETH de cebo, el atacante se lleva los 11", async () => {
    const { banco, atacanteEOA } = await loadFixture(bancoVulnerable);
    expect(await banco.balanceTotal()).to.equal(eth(10));

    const atacante = await ethers.deployContract("Atacante", [await banco.getAddress()], atacanteEOA);
    await atacante.atacar({ value: eth(1) });

    // El banco queda seco y el contrato atacante tiene los 11 ETH.
    expect(await banco.balanceTotal()).to.equal(0n);
    expect(await ethers.provider.getBalance(await atacante.getAddress())).to.equal(eth(11));
  });

  it("los saldos honestos quedan intactos en el registro, pero ya no hay con qué pagarlos", async () => {
    const { banco, atacanteEOA } = await loadFixture(bancoVulnerable);
    const [, ana] = await ethers.getSigners();
    const atacante = await ethers.deployContract("Atacante", [await banco.getAddress()], atacanteEOA);
    await atacante.atacar({ value: eth(1) });

    expect(await banco.saldos(ana.address)).to.equal(eth(4)); // el registro dice que Ana tiene 4
    await expect(banco.connect(ana).retirar()).to.be.revertedWith("envio fallido"); // el banco no tiene fondos
  });
});

describe("S09 · el banco seguro resiste el mismo ataque", () => {
  it("★ el ataque revierte en cadena y el banco conserva su dinero", async () => {
    const { banco, atacanteEOA } = await loadFixture(bancoSeguro);
    const atacante = await ethers.deployContract("Atacante", [await banco.getAddress()], atacanteEOA);

    // La reentrada choca con el guard (o con el saldo ya en cero por CEI): revierte
    // dentro del receive() del atacante, y eso hace fallar el envío del banco.
    // El error que llega arriba es EnvioFallido: la cascada dejó todo como estaba.
    await expect(atacante.atacar({ value: eth(1) })).to.be.revertedWithCustomError(banco, "EnvioFallido");
    expect(await banco.balanceTotal()).to.equal(eth(10));
  });

  it("los clientes honestos retiran con normalidad", async () => {
    const { banco } = await loadFixture(bancoSeguro);
    const [, ana] = await ethers.getSigners();
    await expect(banco.connect(ana).retirar()).to.changeEtherBalance(ethers, ana, eth(4));
    expect(await banco.balanceTotal()).to.equal(eth(6));
  });

  it("no se puede retirar dos veces", async () => {
    const { banco } = await loadFixture(bancoSeguro);
    const [, ana] = await ethers.getSigners();
    await banco.connect(ana).retirar();
    await expect(banco.connect(ana).retirar()).to.be.revertedWithCustomError(banco, "SinSaldo");
  });
});
