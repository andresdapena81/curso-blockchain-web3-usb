/**
 * Laboratorio 13 · firmar una asistencia con EIP-712 · VERSIÓN DE TRABAJO
 *
 * Copien este archivo sobre scripts/s13/firmar-asistencia.js, completen los
 * TODO y corran:
 *     npx hardhat run scripts/s13/firmar-asistencia.js
 *
 * Está terminado cuando imprime «✔ coincide» en el paso 4 y un hash de
 * transacción en el paso 5. En Sepolia, además, se fija la dirección:
 *     $env:CONTRATO="0x...dirección..."     (PowerShell)
 *     npx hardhat run scripts/s13/firmar-asistencia.js --network sepolia
 */
import { network } from "hardhat";

const { ethers } = await network.create();
const cuentas = await ethers.getSigners();
const docente = cuentas[0];                    // despliega y envía (paga el gas)
const estudiante = cuentas[1] ?? cuentas[0];   // solo firma

let contrato;
if (process.env.CONTRATO) {
  contrato = await ethers.getContractAt("AsistenciaFirmada", process.env.CONTRATO);
} else {
  contrato = await ethers.deployContract("AsistenciaFirmada");
  await contrato.waitForDeployment();
}

// TODO A · El dominio. Léanlo del contrato con eip712Domain() y armen el objeto
//          { name, version, chainId, verifyingContract }.
const dominio = null;

// TODO B · Los tipos. UNA entrada «Asistencia» con los cuatro campos, en el MISMO
//          orden y con los MISMOS nombres y tipos que ASISTENCIA_TYPEHASH:
//          estudiante (address), sesion (uint256), nonce (uint256), vence (uint256).
const tipos = null;

const bloque = await ethers.provider.getBlock("latest");
const mensaje = {
  estudiante: estudiante.address,
  sesion: 13n,
  nonce: await contrato.nonces(estudiante.address),
  vence: BigInt(bloque.timestamp + 10 * 60),
};

if (!dominio || !tipos) throw new Error("Completen los TODO A y B antes de correr el script.");

// TODO C · Firmen: const firma = await estudiante.signTypedData(dominio, tipos, mensaje);
const firma = null;

// TODO D · Verifiquen fuera de la cadena: ethers.verifyTypedData(dominio, tipos, mensaje, firma)
//          debe devolver estudiante.address.
const recuperado = null;
console.log("recuperado:", recuperado, recuperado === estudiante.address ? "✔ coincide" : "✘ NO coincide");

// TODO E · Envíen la firma desde la cuenta del docente:
//          contrato.connect(docente).registrar(estudiante, sesion, nonce, vence, firma)
//          esperen el recibo (tx.wait()) e impriman recibo.hash y recibo.gasUsed.

// TODO F · Lean los eventos AsistenciaRegistrada del estudiante con queryFilter
//          (desde el bloque del recibo menos 10 hasta "latest") e imprímanlos.
