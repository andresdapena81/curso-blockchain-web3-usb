/**
 * Laboratorio 12 · prepara la red LOCAL para probar la dApp con MetaMask
 *
 *   Terminal 1 (se deja abierta todo el laboratorio):
 *     npx hardhat node
 *
 *   Terminal 2 — PowerShell:
 *     $env:DESTINO="0xSU_DIRECCION_DE_METAMASK"
 *     npx hardhat run scripts/s12/preparar-local.js --network localhost
 *
 *   Terminal 2 — bash / macOS:
 *     DESTINO=0xSU_DIRECCION npx hardhat run scripts/s12/preparar-local.js --network localhost
 *
 * Qué hace, en la red local (NUNCA en Sepolia: este script regala ETH):
 *   1. despliega FichaUSB (el token de la Sesión 10) con tope de 1 000 000;
 *   2. acuña 1000 FUSB a la dirección DESTINO (su cuenta de MetaMask);
 *   3. le envía 10 ETH LOCALES para que pueda pagar el gas;
 *   4. imprime la dirección del contrato para pegarla en la dApp.
 *
 * Con $env:FICHA="0x…" (la dirección que imprimió antes) NO despliega nada:
 * solo acuña 100 FUSB más a DESTINO, para probar que la dApp escucha eventos.
 *
 * Así no hace falta importar en MetaMask ninguna clave privada: la billetera
 * del curso recibe fondos como cualquier otra cuenta. La dirección no es un
 * secreto; la frase semilla y las claves privadas sí.
 */
import { network } from "hardhat";

const { ethers } = await network.create();
const red = await ethers.provider.getNetwork();
if (red.chainId !== 31337n) {
  console.error(`Este script solo corre en la red local (31337). Están en ${red.chainId}.`);
  process.exit(1);
}

const destino = process.env.DESTINO;
if (!destino || !ethers.isAddress(destino)) {
  console.error("Falta DESTINO con su dirección de MetaMask (0x…). Ver el encabezado del script.");
  process.exit(1);
}

const [organizador] = await ethers.getSigners();

// MODO «ACUÑAR MÁS» (para probar el TODO 8, eventos): si ya existe la ficha,
//   $env:FICHA="0xDIRECCION_QUE_IMPRIMIO_ANTES"
// se reutiliza y solo se acuñan 100 FUSB más a DESTINO. Eso emite un Transfer
// desde la dirección cero hacia ustedes: la dApp debe actualizar el saldo sola.
if (process.env.FICHA) {
  const existente = await ethers.getContractAt("FichaUSB", process.env.FICHA);
  await (await existente.acunar(destino, 100n)).wait();
  console.log(`\n  Acuñados 100 FUSB más a ${destino}.`);
  console.log(`  Saldo ahora: ${ethers.formatUnits(await existente.balanceOf(destino), 18)} FUSB.`);
  console.log("  Miren la dApp SIN recargar: si el TODO 8 está bien, el saldo ya cambió.\n");
  process.exit(0);
}

const ficha = await ethers.deployContract("FichaUSB", [1_000_000n]);
await ficha.waitForDeployment();
const direccion = await ficha.getAddress();

await (await ficha.acunar(destino, 1000n)).wait();
await (await organizador.sendTransaction({ to: destino, value: ethers.parseEther("10") })).wait();

const saldo = await ficha.balanceOf(destino);
console.log(`
  FichaUSB desplegada en la red local
  ------------------------------------------------------------
  DIRECCION_FICHA : ${direccion}
  chainId         : ${red.chainId}
  a ${destino}
      FUSB        : ${ethers.formatUnits(saldo, await ficha.decimals())}
      ETH (local) : ${ethers.formatEther(await ethers.provider.getBalance(destino))}

  Siguiente paso: pegar DIRECCION_FICHA en la dApp (index.html) y poner
  el chainId esperado en 31337n. Ver la guía, paso 6.
  OJO: si reinician «npx hardhat node», la cadena se borra y hay que
  volver a correr este script (y limpiar la actividad en MetaMask).
`);
