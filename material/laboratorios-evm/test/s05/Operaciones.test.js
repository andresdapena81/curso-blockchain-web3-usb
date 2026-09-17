/**
 * Laboratorio 05 · las relaciones de costo que la sesión afirma, comprobadas.
 *
 *     npx hardhat test test/s05/Operaciones.test.js
 *
 * No se prueban cifras exactas (dependen de la versión del compilador y del
 * optimizador), sino las RELACIONES que no deberían cambiar nunca.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

async function gas(txPromise) {
  return (await (await txPromise).wait()).gasUsed;
}

describe("S05 · Operaciones · costo relativo del gas", () => {
  let c, cuenta, otra;

  beforeEach(async () => {
    [cuenta, otra] = await ethers.getSigners();
    c = await ethers.deployContract("Operaciones");
  });

  it("una transferencia simple de ETH cuesta exactamente 21 000", async () => {
    const g = await gas(cuenta.sendTransaction({ to: otra.address, value: 1n }));
    expect(g).to.equal(21000n);
  });

  it("escribir en una ranura vacía cuesta más de 20 000 por encima de la base", async () => {
    const g = await gas(c.escribirNueva(42));
    expect(g).to.be.greaterThan(21000n + 20000n);
  });

  it("sobrescribir una ranura ocupada es mucho más barato que estrenarla", async () => {
    const nueva = await gas(c.escribirNueva(42));
    const sobre = await gas(c.sobrescribir(43));
    expect(nueva - sobre).to.be.greaterThan(10000n);
  });

  it("borrar una ranura devuelve gas: cuesta menos que sobrescribirla", async () => {
    await c.escribirNueva(42);
    const sobre = await gas(c.sobrescribir(43));
    const borra = await gas(c.borrar());
    expect(borra).to.be.lessThan(sobre);
  });

  it("un evento es más barato que escribir el mismo dato en almacenamiento", async () => {
    const ev = await gas(c.registrarConEvento(42));
    const esc = await gas(c.escribirNueva(42));
    expect(ev).to.be.lessThan(esc);
  });

  it("calldata es más barato que memory para el mismo arreglo", async () => {
    const datos = Array.from({ length: 50 }, (_, i) => i + 1);
    const mem = await c.sumarEnMemoria.estimateGas(datos);
    const cal = await c.sumarEnCalldata.estimateGas(datos);
    expect(cal).to.be.lessThan(mem);
    expect(await c.sumarEnCalldata(datos)).to.equal(1275n);
  });

  it("cada elemento nuevo en un arreglo de almacenamiento cuesta una escritura completa", async () => {
    await c.agregar(1);                     // estrena la ranura del largo: no se mide
    const uno = await gas(c.agregar(1));
    const diez = await gas(c.agregar(10));
    // nueve elementos de diferencia, cada uno estrena una ranura (≈ 22 000)
    expect(diez - uno).to.be.greaterThan(9n * 20000n);
    expect(await c.largo()).to.equal(12n);
  });
});
