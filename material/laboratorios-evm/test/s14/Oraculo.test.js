/**
 * Laboratorio 14 · consumir un oráculo, y por qué su manipulación es peligrosa
 *
 *     npx hardhat test test/s14/Oraculo.test.js
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { time, loadFixture } = networkHelpers;

const DIA = 24 * 60 * 60;

async function desplegar() {
  // Oráculo falso: ETH a 2000 USD, 8 decimales (como Chainlink).
  const feed = await ethers.deployContract("OraculoFalso", [2000n * 10n ** 8n, 8]);
  const consumidor = await ethers.deployContract("OraculoConsumidor", [await feed.getAddress()]);
  return { feed, consumidor };
}

describe("S14 · OraculoConsumidor", () => {
  it("lee el precio y lo normaliza a 18 decimales", async () => {
    const { consumidor } = await loadFixture(desplegar);
    const p = await consumidor.precioEth(DIA);
    expect(p).to.equal(2000n * 10n ** 18n);
  });

  it("refleja un cambio de precio del oráculo", async () => {
    const { feed, consumidor } = await loadFixture(desplegar);
    await feed.fijarPrecio(2500n * 10n ** 8n);
    expect(await consumidor.precioEth(DIA)).to.equal(2500n * 10n ** 18n);
  });

  it("rechaza un precio no positivo", async () => {
    const { feed, consumidor } = await loadFixture(desplegar);
    await feed.fijarPrecio(0);
    await expect(consumidor.precioEth(DIA)).to.be.revertedWithCustomError(consumidor, "PrecioInvalido");
  });

  it("★ rechaza un precio rancio: un oráculo que dejó de actualizarse es peligroso", async () => {
    const { feed, consumidor } = await loadFixture(desplegar);
    await feed.envejecer(2 * DIA);   // la última actualización fue hace dos días
    await expect(consumidor.precioEth(DIA)).to.be.revertedWithCustomError(consumidor, "PrecioViejo");
  });

  it("★ demuestra la manipulación: quien controla el oráculo controla el precio", async () => {
    const { feed, consumidor } = await loadFixture(desplegar);
    // Un atacante que pueda mover el oráculo hace que el consumidor «crea» cualquier precio.
    await feed.fijarPrecio(1n * 10n ** 8n);    // ETH a 1 USD: absurdo, pero el consumidor lo cree
    expect(await consumidor.precioEth(DIA)).to.equal(1n * 10n ** 18n);
    // Moraleja: nunca depender de UN solo precio spot manipulable (por eso Chainlink agrega muchas fuentes).
  });

  it("un precio recién actualizado siempre pasa el filtro de antigüedad", async () => {
    const { feed, consumidor } = await loadFixture(desplegar);
    await feed.fijarPrecio(3000n * 10n ** 8n);   // actualiza updatedAt a ahora
    await time.increase(60);
    expect(await consumidor.precioEth(DIA)).to.equal(3000n * 10n ** 18n);
  });
});
