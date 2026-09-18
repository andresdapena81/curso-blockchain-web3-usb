/**
 * Laboratorio 11 · leer un diploma DESDE LA CADENA y resolver su metadata en IPFS
 *
 *   PowerShell:
 *     $env:DIPLOMA="0xDIRECCION_DEL_CONTRATO"; $env:TOKEN_ID="1"
 *     npx hardhat run scripts/s11/leer-diploma.js --network sepolia
 *
 *   bash / macOS:
 *     DIPLOMA=0x... TOKEN_ID=1 npx hardhat run scripts/s11/leer-diploma.js --network sepolia
 *
 * Opcional: GATEWAY="https://SU-SUBDOMINIO.mypinata.cloud/ipfs" para usar
 * primero la puerta de su servicio de pinning.
 *
 * Es la misma cadena de saltos que hace un explorador o un marketplace:
 *   contrato --tokenURI--> JSON en IPFS --"image"--> archivo en IPFS
 * Si algún salto falla, el script dice cuál. Esa es la evidencia de que
 * «el NFT» (la fila del contrato) y «el archivo» son cosas distintas.
 *
 * Las puertas públicas (ipfs.io, dweb.link) limitan la tasa de consultas y a
 * veces responden 429: por eso se prueban varias, en orden.
 */
import { network } from "hardhat";

const direccion = process.env.DIPLOMA;
const tokenId = BigInt(process.env.TOKEN_ID ?? "1");
if (!direccion) {
  console.error("Falta la variable DIPLOMA con la dirección del contrato. Ver el encabezado del script.");
  process.exit(1);
}

const PUERTAS = [
  ...(process.env.GATEWAY ? [process.env.GATEWAY.replace(/\/$/, "")] : []),
  "https://gateway.pinata.cloud/ipfs",
  "https://ipfs.io/ipfs",
  "https://dweb.link/ipfs",
];

const ABI = [
  "function name() view returns (string)",
  "function ownerOf(uint256) view returns (address)",
  "function tokenURI(uint256) view returns (string)",
];

/** ipfs://CID/ruta  ->  CID/ruta ;  https://...  ->  null (no es IPFS) */
function rutaIpfs(uri) {
  return uri.startsWith("ipfs://") ? uri.slice("ipfs://".length).replace(/^ipfs\//, "") : null;
}

async function traer(uri, comoJson) {
  const ruta = rutaIpfs(uri);
  if (!ruta) {
    console.log(`  ⚠ ${uri} NO es un enlace ipfs://: depende de quien controle ese servidor.`);
    const r = await fetch(uri);
    return { url: uri, cuerpo: comoJson ? await r.json() : Buffer.from(await r.arrayBuffer()) };
  }
  for (const puerta of PUERTAS) {
    const url = `${puerta}/${ruta}`;
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!r.ok) { console.log(`  · ${puerta} respondió ${r.status}; pruebo la siguiente`); continue; }
      return { url, cuerpo: comoJson ? await r.json() : Buffer.from(await r.arrayBuffer()) };
    } catch (e) {
      console.log(`  · ${puerta} falló (${e.name}); pruebo la siguiente`);
    }
  }
  throw new Error(`Ninguna puerta IPFS devolvió ${uri}. ¿Está fijado (pinned)? ¿El CID está bien copiado?`);
}

const { ethers } = await network.create();
const diploma = new ethers.Contract(direccion, ABI, ethers.provider);

console.log(`\n1 · EN LA CADENA  (${(await ethers.provider.getNetwork()).name})`);
console.log(`  contrato  : ${direccion}  «${await diploma.name()}»`);
console.log(`  token     : #${tokenId}`);
console.log(`  dueño     : ${await diploma.ownerOf(tokenId)}`);
const uri = await diploma.tokenURI(tokenId);
console.log(`  tokenURI  : ${uri}`);

console.log(`\n2 · LA METADATA (el JSON)`);
const meta = await traer(uri, true);
console.log(`  resuelto en: ${meta.url}`);
const campo = (v) => v ?? "(el JSON no trae este campo)";
console.log(`  name       : ${campo(meta.cuerpo.name)}`);
console.log(`  description: ${campo(meta.cuerpo.description)}`);
console.log(`  image      : ${campo(meta.cuerpo.image)}`);
for (const a of meta.cuerpo.attributes ?? []) console.log(`  rasgo      : ${a.trait_type} = ${a.value}`);

if (meta.cuerpo.image) {
  console.log(`\n3 · EL ARCHIVO (la imagen)`);
  const img = await traer(meta.cuerpo.image, false);
  console.log(`  resuelto en: ${img.url}`);
  console.log(`  tamaño     : ${img.cuerpo.length.toLocaleString("es-CO")} bytes`);
  console.log(`  sha256     : ${ethers.sha256(img.cuerpo)}`);
}
console.log(`\nLos tres saltos resolvieron. Guarden esta salida como evidencia.\n`);
