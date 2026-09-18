/**
 * Laboratorio 15 · la DAO completa en una red real (o en la local)
 *
 *     npx hardhat run scripts/s15/ciclo-gobierno.js                     # red local: segundos
 *     npx hardhat run scripts/s15/ciclo-gobierno.js --network sepolia   # Sepolia: ~15 minutos
 *
 * Despliega TokenVoto + TimelockUSB + GobiernoUSB + Tesoreria, reparte los
 * roles, renuncia a la administración y recorre UNA propuesta de principio a
 * fin: delegar → proponer → votar → encolar → esperar → ejecutar. Imprime la
 * dirección de cada contrato y el hash de cada transacción: esa es la
 * evidencia en cadena del laboratorio.
 *
 * En Sepolia todo lo firma UNA sola cuenta (la del keystore): es a la vez
 * fundadora, única votante y ejecutora. Sirve para ver el ciclo en cadena, no
 * para simular una comunidad (eso lo hacen las pruebas con varias cuentas).
 *
 * Costo medido en la red local: 7,57 millones de gas en despliegues (el Governor
 * solo, 3,93 M) + unas 0,66 M en transacciones ≈ 8,2 M de gas. Con gas a 1 gwei
 * son ≈ 0,0082 ETH de prueba, más 0,002 ETH que se depositan en la tesorería (la
 * mitad vuelve a la misma cuenta al ejecutar). Tengan al menos 0,02 ETH de prueba.
 */
import { network } from "hardhat";

const { ethers, networkHelpers, networkName } = await network.create();
const local = networkHelpers !== undefined && (networkName === "default" || networkName === "hardhat");

const RETARDO = 120;                       // segundos del timelock en esta demostración
const DEPOSITO = ethers.parseEther("0.002");
const PAGO = ethers.parseEther("0.001");
const ESTADOS = ["Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"];

const [yo] = await ethers.getSigners();
const t0 = Date.now();
const log = (paso, texto) => console.log(`  [${String(Math.round((Date.now() - t0) / 1000)).padStart(4)} s] ${paso.padEnd(12)} ${texto}`);

async function enviar(paso, promesaTx) {
  const tx = await promesaTx;
  const recibo = await tx.wait();
  log(paso, `tx ${tx.hash}  gas ${recibo.gasUsed.toLocaleString("es-CO")}`);
  return recibo;
}

async function esperarBloque(objetivo) {
  if (local) { await networkHelpers.mine(Number(objetivo - BigInt(await ethers.provider.getBlockNumber())) + 1); return; }
  for (;;) {
    const n = BigInt(await ethers.provider.getBlockNumber());
    if (n > objetivo) return;
    process.stdout.write(`\r  ... bloque ${n}, faltan ${objetivo - n + 1n}          `);
    await new Promise(r => setTimeout(r, 15000));
  }
}

async function esperarHasta(timestamp) {
  if (local) { await networkHelpers.time.increaseTo(Number(timestamp) + 1); return; }
  for (;;) {
    const b = await ethers.provider.getBlock("latest");
    if (BigInt(b.timestamp) > timestamp) { process.stdout.write("\n"); return; }
    process.stdout.write(`\r  ... faltan ${timestamp - BigInt(b.timestamp) + 1n} s del timelock          `);
    await new Promise(r => setTimeout(r, 15000));
  }
}

console.log(`\n  Red: ${networkName} · cuenta: ${yo.address}`);
console.log(`  Saldo: ${ethers.formatEther(await ethers.provider.getBalance(yo.address))} ETH\n`);

// 1 · despliegue
const token = await ethers.deployContract("TokenVoto");
await token.waitForDeployment();
log("token", await token.getAddress());
const timelock = await ethers.deployContract("TimelockUSB", [RETARDO, [], [ethers.ZeroAddress], yo.address]);
await timelock.waitForDeployment();
log("timelock", await timelock.getAddress());
const gobierno = await ethers.deployContract("GobiernoUSB", [await token.getAddress(), await timelock.getAddress()]);
await gobierno.waitForDeployment();
log("gobierno", await gobierno.getAddress());
const tesoreria = await ethers.deployContract("Tesoreria", [await timelock.getAddress()]);
await tesoreria.waitForDeployment();
log("tesoreria", await tesoreria.getAddress());

// 2 · roles y renuncia
await enviar("rol propone", timelock.grantRole(await timelock.PROPOSER_ROLE(), await gobierno.getAddress()));
await enviar("rol cancela", timelock.grantRole(await timelock.CANCELLER_ROLE(), await gobierno.getAddress()));
await enviar("renuncia", timelock.renounceRole(await timelock.DEFAULT_ADMIN_ROLE(), yo.address));

// 3 · fondos, votos y delegación
await enviar("deposito", yo.sendTransaction({ to: await tesoreria.getAddress(), value: DEPOSITO }));
await enviar("acunar", token.acunar(yo.address, ethers.parseEther("100")));
log("votos antes", `${ethers.formatEther(await token.getVotes(yo.address))} (sin delegar no hay votos)`);
await enviar("delegar", token.delegate(yo.address));
log("votos ahora", ethers.formatEther(await token.getVotes(yo.address)));

// 4 · proponer
const descripcion = `Laboratorio 15 · liberar 0,001 ETH · ${new Date().toISOString()}`;
const targets = [await tesoreria.getAddress()];
const values = [0n];
const calldatas = [tesoreria.interface.encodeFunctionData("liberar", [yo.address, PAGO])];
const hashDescripcion = ethers.id(descripcion);
if (local) await networkHelpers.mine(1);   // en la red local, que la delegación quede en un bloque pasado
await enviar("proponer", gobierno.propose(targets, values, calldatas, descripcion));
const id = await gobierno.hashProposal(targets, values, calldatas, hashDescripcion);
log("id", id.toString());

// 5 · votar
await esperarBloque(await gobierno.proposalSnapshot(id));
log("estado", ESTADOS[Number(await gobierno.state(id))]);
await enviar("votar", gobierno.castVote(id, 1));

// 6 · cerrar la votación y encolar
log("esperando", `fin de la votación en el bloque ${await gobierno.proposalDeadline(id)}`);
await esperarBloque(await gobierno.proposalDeadline(id));
process.stdout.write("\n");
log("estado", ESTADOS[Number(await gobierno.state(id))]);
await enviar("encolar", gobierno.queue(targets, values, calldatas, hashDescripcion));
const eta = await gobierno.proposalEta(id);
log("estado", `${ESTADOS[Number(await gobierno.state(id))]} · ejecutable desde ${new Date(Number(eta) * 1000).toISOString()}`);

// 7 · esperar el timelock y ejecutar
await esperarHasta(eta);
const antes = await ethers.provider.getBalance(await tesoreria.getAddress());
await enviar("ejecutar", gobierno.execute(targets, values, calldatas, hashDescripcion));
const despues = await ethers.provider.getBalance(await tesoreria.getAddress());
log("estado", ESTADOS[Number(await gobierno.state(id))]);
log("tesoreria", `${ethers.formatEther(antes)} → ${ethers.formatEther(despues)} ETH`);
console.log("\n  Evidencia: copien las direcciones y los hashes de arriba en el informe.\n");
