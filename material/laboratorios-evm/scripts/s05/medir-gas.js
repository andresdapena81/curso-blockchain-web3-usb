/**
 * Laboratorio 05 · Parte B · Medir el gas de cada operación
 *
 *     npx hardhat run scripts/s05/medir-gas.js
 *
 * Corre sobre la red local de Hardhat: no gasta ETH de prueba ni necesita
 * internet. ANTES de correrlo, cada pareja escribe su predicción en la hoja
 * de trabajo del laboratorio. Después compara.
 */
import { network } from "hardhat";

const { ethers } = await network.create();
const [cuenta, otra] = await ethers.getSigners();

async function gasDe(promesaTx) {
  const tx = await promesaTx;
  const recibo = await tx.wait();
  return recibo.gasUsed;
}

const c = await ethers.deployContract("Operaciones");
await c.waitForDeployment();

const despliegue = (await c.deploymentTransaction().wait()).gasUsed;
const transferencia = await gasDe(cuenta.sendTransaction({ to: otra.address, value: ethers.parseEther("0.01") }));
const escribirNueva = await gasDe(c.escribirNueva(42));
const sobrescribir = await gasDe(c.sobrescribir(43));
const leer = await gasDe(c.leerEnTransaccion());
const borrar = await gasDe(c.borrar());
const evento = await gasDe(c.registrarConEvento(42));

const datos = Array.from({ length: 50 }, (_, i) => i + 1);
const memoria = await c.sumarEnMemoria.estimateGas(datos);
const calldata = await c.sumarEnCalldata.estimateGas(datos);

const primerPush = await gasDe(c.agregar(1));   // estrena también la ranura del largo
const agregar1 = await gasDe(c.agregar(1));
const agregar10 = await gasDe(c.agregar(10));

const filas = [
  ["Transferir ETH entre cuentas (sin contrato)", transferencia],
  ["Desplegar el contrato", despliegue],
  ["Escribir en una ranura vacía (0 → 42)", escribirNueva],
  ["Sobrescribir una ranura ocupada (42 → 43)", sobrescribir],
  ["Leer la ranura, dentro de una transacción", leer],
  ["Borrar la ranura (43 → 0)", borrar],
  ["Emitir un evento con dos datos", evento],
  ["Sumar 50 números · parámetro en memory", memoria],
  ["Sumar 50 números · parámetro en calldata", calldata],
  ["Primer elemento de un arreglo (estrena el largo)", primerPush],
  ["Agregar 1 elemento más", agregar1],
  ["Agregar 10 elementos más", agregar10],
];

console.log("\n  OPERACIÓN                                            GAS USADO");
console.log("  " + "─".repeat(64));
for (const [nombre, gas] of filas) {
  console.log(`  ${nombre.padEnd(52)} ${gas.toLocaleString("es-CO").padStart(10)}`);
}

// Costo en dinero de prueba, con un precio de gas de referencia.
// Cambien este valor por el que muestre el explorador el día del laboratorio.
const precioGwei = 2n;
const wei = escribirNueva * precioGwei * 10n ** 9n;
console.log(`\n  Con ${precioGwei} gwei por unidad de gas, escribir una ranura nueva cuesta ${ethers.formatEther(wei)} ETH.\n`);
