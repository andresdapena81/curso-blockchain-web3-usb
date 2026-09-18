/**
 * Laboratorio 16 · el mismo contrato en L1 y en L2: cuánto cuesta y cuánto tarda
 *
 *     npx hardhat run scripts/s16/desplegar-y-medir.js --network sepolia
 *     npx hardhat run scripts/s16/desplegar-y-medir.js --network opSepolia
 *
 * Sin --network corre en la red local (sin costo, para ensayar). Para ensayar
 * en local cómo se ve un recibo de rollup OP, con su costo L1 de datos:
 *     PowerShell:  $env:SIMULAR_OP="1"; npx hardhat run scripts/s16/desplegar-y-medir.js
 *     bash:        SIMULAR_OP=1 npx hardhat run scripts/s16/desplegar-y-medir.js
 *
 * Mide, para el despliegue de SelloTiempo y para una llamada a sellar():
 *   - gas usado y precio efectivo del gas (gwei)
 *   - costo de EJECUCIÓN = gasUsed × effectiveGasPrice
 *   - en un rollup OP, el costo L1 DE DATOS (campo l1Fee del recibo): lo que
 *     la L2 le paga a Ethereum por publicar los datos de la transacción
 *   - costo TOTAL en ETH = ejecución + datos L1
 *   - tiempo desde el envío hasta tener el recibo (segundos de reloj)
 *
 * Al final imprime una fila lista para pegar en la tabla comparativa de la guía.
 * Las URL de RPC y la clave viven SOLO en el keystore de Hardhat:
 *     npx hardhat keystore set SEPOLIA_RPC_URL
 *     npx hardhat keystore set OP_SEPOLIA_RPC_URL
 *     npx hardhat keystore set SEPOLIA_PRIVATE_KEY
 */
import { network } from "hardhat";

const simular = process.env.SIMULAR_OP === "1";
const conexion = simular ? await network.create({ chainType: "op" }) : await network.create();
const { ethers, networkName } = conexion;
const nombreRed = simular ? `${networkName} (simulando OP)` : networkName;

const [yo] = await ethers.getSigners();
const { chainId } = await ethers.provider.getNetwork();
const gwei = (wei) => ethers.formatUnits(wei, "gwei");          // precisión completa
const eth = (wei) => ethers.formatEther(wei);                   // precisión completa: en L2 hay cifras diminutas

/** Lee el recibo CRUDO del nodo: ethers no expone los campos propios de OP (l1Fee...). */
async function reciboCrudo(hash) {
  return ethers.provider.send("eth_getTransactionReceipt", [hash]);
}

async function medir(nombre, enviarTx) {
  const inicio = Date.now();
  const tx = await enviarTx();
  const recibo = await tx.wait();
  const segundos = (Date.now() - inicio) / 1000;
  const crudo = await reciboCrudo(tx.hash);

  const gasUsado = recibo.gasUsed;
  const precio = recibo.gasPrice;                      // effectiveGasPrice
  const ejecucion = gasUsado * precio;
  const l1Fee = crudo.l1Fee !== undefined && crudo.l1Fee !== null ? BigInt(crudo.l1Fee) : null;
  const total = ejecucion + (l1Fee ?? 0n);

  console.log(`\n  ${nombre}`);
  console.log(`    tx               ${tx.hash}`);
  console.log(`    bloque           ${recibo.blockNumber}`);
  console.log(`    gas usado        ${gasUsado.toLocaleString("es-CO")}`);
  console.log(`    precio del gas   ${gwei(precio)} gwei`);
  console.log(`    ejecución        ${eth(ejecucion)} ETH`);
  if (l1Fee !== null) {
    console.log(`    datos L1 (l1Fee) ${eth(l1Fee)} ETH   ← lo que el rollup paga a Ethereum`);
    if (crudo.l1GasUsed) console.log(`    l1GasUsed        ${BigInt(crudo.l1GasUsed).toLocaleString("es-CO")}`);
    if (crudo.l1BaseFeeScalar) console.log(`    l1BaseFeeScalar  ${BigInt(crudo.l1BaseFeeScalar)}   l1BlobBaseFeeScalar ${BigInt(crudo.l1BlobBaseFeeScalar ?? 0)}`);
    const pct = total > 0n ? Number((l1Fee * 10000n) / total) / 100 : 0;
    console.log(`    parte L1 del total ${pct.toFixed(2)} %`);
  } else {
    console.log(`    datos L1 (l1Fee) no aplica: esta red no es un rollup OP`);
  }
  console.log(`    TOTAL            ${eth(total)} ETH`);
  console.log(`    tiempo al recibo ${segundos.toFixed(1)} s`);
  return { gasUsado, precio, ejecucion, l1Fee, total, segundos };
}

console.log(`\n  Red: ${nombreRed} · chainId ${chainId} · cuenta ${yo.address}`);
const saldo = await ethers.provider.getBalance(yo.address);
console.log(`  Saldo: ${ethers.formatEther(saldo)} ETH`);
if (saldo === 0n) {
  console.log("\n  Sin saldo en esta red. Consigan ETH de prueba (faucet o puente) antes de seguir: ver la guía.\n");
  process.exit(1);
}

let sello;
const d = await medir("DESPLIEGUE de SelloTiempo", async () => {
  const fabrica = await ethers.getContractFactory("SelloTiempo");
  sello = await fabrica.deploy();
  return sello.deploymentTransaction();
});
console.log(`    contrato         ${await sello.getAddress()}`);

const hash = ethers.id(`laboratorio-16 · ${yo.address} · ${Date.now()}`);
const o = await medir("OPERACIÓN sellar(hash)", () => sello.sellar(hash));

console.log("\n  Fila para la tabla (red · chainId · gas despliegue · total despliegue ETH · gas sellar · total sellar ETH · datos L1 sellar ETH · s al recibo sellar):");
console.log(`  ${nombreRed} | ${chainId} | ${d.gasUsado} | ${eth(d.total)} | ${o.gasUsado} | ${eth(o.total)} | ${o.l1Fee === null ? "n/a" : eth(o.l1Fee)} | ${o.segundos.toFixed(1)}\n`);
