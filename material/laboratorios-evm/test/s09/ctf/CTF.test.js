/**
 * CTF local · Sesión 9 · las tres pruebas que delatan sus exploits
 *
 *     npx hardhat test test/s09/ctf/CTF.test.js
 *
 * Cada prueba despliega SU atacante (contracts/s09/ctf/Atacantes.sol) y
 * comprueba que el ataque funcionó. Con el andamiaje vacío, las tres
 * fallan. Cuando escriban bien el exploit, pasan. Eso es su calificación.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();
const ETH = (n) => ethers.parseEther(String(n));

describe("CTF · Reto 1 · control de acceso (tx.origin)", () => {
  it("★ el tesorero cae en la trampa y la caja se vacía", async () => {
    const [tesorero, ladron] = await ethers.getSigners();
    const caja = await ethers.deployContract("CajaDelSemillero");
    await tesorero.sendTransaction({ to: caja.target, value: ETH(5) });

    const atacante = await ethers.deployContract("AtacanteReto1", [caja.target], ladron);
    // El tesorero firma una transacción contra el contrato del atacante.
    await expect(atacante.connect(tesorero).reclamar())
      .to.changeEtherBalance(ethers, ladron, ETH(5));
    expect(await caja.saldo()).to.equal(0n);
  });
});

describe("CTF · Reto 2 · azar en cadena", () => {
  it("★ el atacante adivina el secreto en la misma transacción y se lleva el bote", async () => {
    const [, ladron, donante] = await ethers.getSigners();
    const loteria = await ethers.deployContract("LoteriaDelSemillero");
    await loteria.connect(donante).depositar({ value: ETH(3) });

    const atacante = await ethers.deployContract("AtacanteReto2", [loteria.target], ladron);
    await expect(atacante.connect(ladron).robar())
      .to.changeEtherBalance(ethers, ladron, ETH(3));
    expect(await loteria.bote()).to.equal(0n);
  });
});

describe("CTF · Reto 3 · reentrada", () => {
  it("★ con 1 ETH de cebo, el atacante drena la bóveda y roba los 3 de los demás", async () => {
    const [, ladron, ana, beto, caro] = await ethers.getSigners();
    const boveda = await ethers.deployContract("BovedaDelSemillero");
    for (const h of [ana, beto, caro]) await boveda.connect(h).depositar({ value: ETH(1) });
    expect(await boveda.saldo()).to.equal(ETH(3));

    const atacante = await ethers.deployContract("AtacanteReto3", [boveda.target], ladron);
    await expect(atacante.connect(ladron).atacar({ value: ETH(1) }))
      .to.changeEtherBalance(ethers, ladron, ETH(3));
    expect(await boveda.saldo()).to.equal(0n);
  });
});
