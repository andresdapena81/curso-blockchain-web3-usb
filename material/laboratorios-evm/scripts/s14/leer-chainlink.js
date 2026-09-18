/**
 * Laboratorio 14 · leer el price feed ETH/USD de Chainlink
 *
 *   Red local (con el oráculo falso, sin internet):
 *     npx hardhat run scripts/s14/leer-chainlink.js
 *
 *   Sepolia (el feed REAL; solo lectura, no gasta ETH de prueba):
 *     npx hardhat run scripts/s14/leer-chainlink.js --network sepolia
 *
 *   Sepolia, además a través de SU OraculoConsumidor desplegado:
 *     $env:CONSUMIDOR="0x...dirección..."        (PowerShell)
 *     npx hardhat run scripts/s14/leer-chainlink.js --network sepolia
 *
 * Dirección del feed ETH/USD en Sepolia, verificada en docs.chain.link
 * (Price Feed Contract Addresses → Ethereum → Sepolia) el 17-sep-2026:
 *     0x694AA1769357215DE4FAC081bf1f309aDC325306 · 8 decimales · heartbeat 3600 s · desviación 1 %
 * Antes de usarla en un semestre nuevo, vuelvan a comprobarla en esa página.
 */
import { network } from "hardhat";

const FEED_SEPOLIA = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
const HEARTBEAT = 3600;

const { ethers } = await network.create();
const { chainId } = await ethers.provider.getNetwork();

let feed;
if (chainId === 11155111n) {
  feed = await ethers.getContractAt("AggregatorV3Interface", FEED_SEPOLIA);
  console.log("\n  Red: Sepolia · feed real de Chainlink", FEED_SEPOLIA);
} else {
  feed = await ethers.deployContract("OraculoFalso", [2000n * 10n ** 8n, 8]);
  await feed.waitForDeployment();
  console.log("\n  Red local (chainId", chainId.toString() + ") · OraculoFalso a 2 000 USD (no es Chainlink)");
}

const decimales = await feed.decimals();
const [roundId, answer, , updatedAt] = await feed.latestRoundData();
const bloque = await ethers.provider.getBlock("latest");
const edad = bloque.timestamp - Number(updatedAt);

console.log("  roundId       :", roundId.toString());
console.log("  answer (crudo):", answer.toString(), `(${decimales} decimales)`);
console.log("  precio ETH/USD:", ethers.formatUnits(answer, decimales));
console.log("  actualizado   :", new Date(Number(updatedAt) * 1000).toISOString(), `· hace ${edad} s`);
console.log("  ¿rancio?      :", edad > HEARTBEAT ? `SÍ: más viejo que el heartbeat de ${HEARTBEAT} s` : `no (heartbeat ${HEARTBEAT} s)`);

if (process.env.CONSUMIDOR) {
  const consumidor = await ethers.getContractAt("OraculoConsumidor", process.env.CONSUMIDOR);
  // margen: el heartbeat más una hora, para no rechazar un precio sano por segundos
  const p = await consumidor.precioEth(2 * HEARTBEAT);
  console.log("\n  Su OraculoConsumidor", process.env.CONSUMIDOR);
  console.log("  precioEth(7200) :", ethers.formatUnits(p, 18), "(normalizado a 18 decimales)");
}
console.log("");
