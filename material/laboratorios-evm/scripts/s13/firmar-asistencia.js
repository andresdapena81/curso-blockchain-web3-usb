/**
 * Laboratorio 13 · firmar una asistencia con EIP-712, verificarla y enviarla
 *
 *   Red local (no gasta nada; despliega su propio contrato):
 *     npx hardhat run scripts/s13/firmar-asistencia.js
 *
 *   Sepolia, sobre el contrato que desplegaron con Ignition:
 *     $env:CONTRATO="0x...dirección..."                       (PowerShell)
 *     export CONTRATO=0x...dirección...                       (macOS / Linux)
 *     npx hardhat run scripts/s13/firmar-asistencia.js --network sepolia
 *
 * La dirección de un contrato NO es un secreto: puede ir en una variable de
 * entorno. La clave privada y la URL del RPC, en cambio, solo en el keystore.
 *
 * Qué hace, en orden:
 *   1. arma el DOMINIO leyendo eip712Domain() del propio contrato;
 *   2. el estudiante FIRMA el mensaje con signTypedData (gratis, sin gas);
 *   3. se VERIFICA fuera de la cadena con ethers.verifyTypedData;
 *   4. otra cuenta (el docente) ENVÍA la firma y paga el gas;
 *   5. se LEEN los eventos con queryFilter, sin The Graph.
 */
import { network } from "hardhat";

const { ethers } = await network.create();
const cuentas = await ethers.getSigners();
const docente = cuentas[0];                    // despliega y envía (paga el gas)
// En Sepolia solo hay UNA cuenta configurada: firma y envía la misma.
const estudiante = cuentas[1] ?? cuentas[0];   // solo firma

// 1 · el contrato: el de la variable CONTRATO, o uno nuevo en la red local
let contrato;
if (process.env.CONTRATO) {
  contrato = await ethers.getContractAt("AsistenciaFirmada", process.env.CONTRATO);
} else {
  contrato = await ethers.deployContract("AsistenciaFirmada");
  await contrato.waitForDeployment();
}
const direccion = await contrato.getAddress();

// 2 · el dominio lo dice el contrato; así no hay forma de equivocarse de red
const d = await contrato.eip712Domain();
const dominio = { name: d.name, version: d.version, chainId: d.chainId, verifyingContract: d.verifyingContract };

const tipos = {
  Asistencia: [
    { name: "estudiante", type: "address" },
    { name: "sesion", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "vence", type: "uint256" },
  ],
};

const bloque = await ethers.provider.getBlock("latest");
const mensaje = {
  estudiante: estudiante.address,
  sesion: 13n,
  nonce: await contrato.nonces(estudiante.address),   // el siguiente que toca
  vence: BigInt(bloque.timestamp + 10 * 60),            // vale 10 minutos
};

console.log("\n  1 · DOMINIO");
console.log("     nombre / versión :", dominio.name, "/", dominio.version);
console.log("     chainId          :", dominio.chainId.toString());
console.log("     contrato         :", direccion);
console.log("\n  2 · MENSAJE QUE SE FIRMA");
console.log("     estudiante       :", mensaje.estudiante);
console.log("     sesión / nonce   :", mensaje.sesion.toString(), "/", mensaje.nonce.toString());
console.log("     vence (unix)     :", mensaje.vence.toString());

const txAntes = await ethers.provider.getTransactionCount(estudiante.address);
const firma = await estudiante.signTypedData(dominio, tipos, mensaje);
const txDespues = await ethers.provider.getTransactionCount(estudiante.address);
console.log("\n  3 · FIRMA (65 bytes = r ‖ s ‖ v)");
console.log("     " + firma);
console.log("     transacciones del estudiante antes/después de firmar:", txAntes, "/", txDespues, "← firmar no es transaccionar");

const digest = ethers.TypedDataEncoder.hash(dominio, tipos, mensaje);
const recuperado = ethers.verifyTypedData(dominio, tipos, mensaje, firma);
console.log("\n  4 · VERIFICACIÓN FUERA DE LA CADENA");
console.log("     digest EIP-712   :", digest);
console.log("     digest (contrato):", await contrato.hashAsistencia(mensaje.estudiante, mensaje.sesion, mensaje.nonce, mensaje.vence));
console.log("     recuperado       :", recuperado, recuperado === estudiante.address ? "✔ coincide" : "✘ NO coincide");

const tx = await contrato
  .connect(docente)
  .registrar(mensaje.estudiante, mensaje.sesion, mensaje.nonce, mensaje.vence, firma);
const recibo = await tx.wait();
console.log("\n  5 · ENVÍO EN CADENA");
console.log("     enviada por      :", recibo.from, docente === estudiante ? "(misma cuenta: en Sepolia hay una sola)" : "(el docente paga el gas)");
console.log("     hash de la tx    :", recibo.hash);
console.log("     bloque / gas     :", recibo.blockNumber, "/", recibo.gasUsed.toString());
console.log("     ¿asistió?        :", await contrato.asistio(13n, estudiante.address));

// 6 · leer los eventos: la alternativa ligera a un subgrafo. En redes públicas
//     los RPC limitan el rango de bloques: se busca desde el bloque del recibo.
const desde = Math.max(0, recibo.blockNumber - 10);
const eventos = await contrato.queryFilter(contrato.filters.AsistenciaRegistrada(estudiante.address), desde, "latest");
console.log("\n  6 · EVENTOS LEÍDOS CON queryFilter (bloques", desde, "a latest)");
for (const e of eventos) {
  console.log(`     bloque ${e.blockNumber} · sesión ${e.args.sesion} · nonce ${e.args.nonce} · enviada por ${e.args.enviadaPor}`);
}
console.log("");
