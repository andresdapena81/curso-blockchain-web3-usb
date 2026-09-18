/**
 * Laboratorio 14 · el mini-AMM en números, sobre la red local
 *
 *     npx hardhat run scripts/s14/pool-en-numeros.js
 *
 * Despliega dos tokens de juguete (TETH y TUSD) y un PoolXYK con 10 TETH y
 * 20 000 TUSD, exactamente el ejemplo de la clase. Luego:
 *   1. cotiza compras de 100, 2 000 y 10 000 TUSD y mide el precio promedio;
 *   2. ejecuta la compra de 2 000 TUSD y muestra cómo cambian reservas, k y precio;
 *   3. un arbitrajista lleva el precio a ≈ 8 000 y se mide la pérdida
 *      impermanente del proveedor de liquidez, EN CADENA, contra la fórmula.
 * No gasta ETH de prueba ni necesita internet.
 */
import { network } from "hardhat";

const { ethers } = await network.create();
const [lp, usuario, arbitrajista] = await ethers.getSigners();
const E = 10n ** 18n;
const n = (x, d = 2) => x.toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });
const f = (x, d = 4) => (Number(x) / 1e18).toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });

const teth = await ethers.deployContract("TokenLab14", ["Ether de laboratorio", "TETH"]);
const tusd = await ethers.deployContract("TokenLab14", ["Dolar de laboratorio", "TUSD"]);
const pool = await ethers.deployContract("PoolXYK", [await teth.getAddress(), await tusd.getAddress()]);
const dirPool = await pool.getAddress();
const dirUsd = await tusd.getAddress();
for (const c of [lp, usuario, arbitrajista]) {
  await (await teth.acunar(c.address, 1_000n * E)).wait();
  await (await tusd.acunar(c.address, 1_000_000n * E)).wait();
  await (await teth.connect(c).approve(dirPool, ethers.MaxUint256)).wait();
  await (await tusd.connect(c).approve(dirPool, ethers.MaxUint256)).wait();
}
await (await pool.connect(lp).agregarLiquidez(10n * E, 20_000n * E)).wait();

const estado = async (titulo) => {
  const a = await pool.reservaA(), b = await pool.reservaB();
  console.log(`  ${titulo.padEnd(22)} TETH ${f(a).padStart(12)} · TUSD ${f(b, 2).padStart(12)} · k ${f((a * b) / E, 2).padStart(12)} · precio ${f(await pool.precioSpotA(), 2).padStart(10)}`);
};

console.log("\n  POOL INICIAL: 10 TETH + 20 000 TUSD · comisión 0,30 %\n");
await estado("inicio");

console.log("\n  1 · COTIZAR (lectura, sin gas)\n");
console.log("  TUSD que entran   TETH que salen   precio promedio   peor que el spot");
for (const usd of [100n, 2_000n, 10_000n]) {
  const sale = await pool.cotizar(dirUsd, usd * E);
  const prom = Number(usd * E) / Number(sale);
  console.log(`  ${usd.toLocaleString("es-CO").padStart(12)}   ${f(sale, 6).padStart(14)}   ${n(prom).padStart(15)}   ${n((prom / 2000 - 1) * 100).padStart(13)} %`);
}

console.log("\n  2 · COMPRAR con 2 000 TUSD, tolerancia de slippage del 1 %\n");
const cotizado = await pool.cotizar(dirUsd, 2_000n * E);
const minimo = (cotizado * 99n) / 100n;
const rc = await (await pool.connect(usuario).intercambiar(dirUsd, 2_000n * E, minimo)).wait();
console.log(`  recibió ${f(cotizado, 6)} TETH (mínimo aceptado ${f(minimo, 6)}) · gas ${rc.gasUsed}`);
await estado("después de comprar");

console.log("\n  3 · PÉRDIDA IMPERMANENTE, MEDIDA EN CADENA\n");
// se reinicia el escenario con un pool limpio para aislar el efecto del precio
const pool2 = await ethers.deployContract("PoolXYK", [await teth.getAddress(), dirUsd]);
for (const c of [lp, arbitrajista]) {
  await (await teth.connect(c).approve(await pool2.getAddress(), ethers.MaxUint256)).wait();
  await (await tusd.connect(c).approve(await pool2.getAddress(), ethers.MaxUint256)).wait();
}
await (await pool2.connect(lp).agregarLiquidez(10n * E, 20_000n * E)).wait();
await (await pool2.connect(arbitrajista).intercambiar(dirUsd, 20_000n * E, 0n)).wait();
const p1 = await pool2.precioSpotA();
const [a, b] = await pool2.connect(lp).quitarLiquidez.staticCall(await pool2.balanceOf(lp.address));
const valorPool = (a * p1) / E + b;
const valorConservar = (10n * E * p1) / E + 20_000n * E;
const r = Number(p1) / 2_000e18;
const medida = Number(valorConservar - valorPool) / Number(valorConservar);
const formula = 1 - (2 * Math.sqrt(r)) / (1 + r);
console.log(`  el arbitrajista mete 20 000 TUSD; nuevo precio ${f(p1, 2)} (r = ${n(r, 4)})`);
console.log(`  el LP retiraría      ${f(a)} TETH + ${f(b, 2)} TUSD = ${f(valorPool, 2)} TUSD`);
console.log(`  si hubiera conservado 10 TETH + 20 000 TUSD      = ${f(valorConservar, 2)} TUSD`);
console.log(`  pérdida impermanente medida ${n(medida * 100)} %  ·  fórmula 2√r/(1+r) ${n(formula * 100)} %`);
console.log("  (la medida es un poco MENOR que la fórmula: la comisión del arbitrajista quedó para el LP)\n");
