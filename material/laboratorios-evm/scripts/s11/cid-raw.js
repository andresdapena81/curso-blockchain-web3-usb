/**
 * Laboratorio 11 · calcular un CID a mano, sin subir nada a ningún lado
 *
 *     node scripts/s11/cid-raw.js ruta/al/archivo
 *     node scripts/s11/cid-raw.js --texto "hello world"
 *
 * Un CID versión 1 «raw» es, literalmente:
 *     "b" + base32( 0x01 · 0x55 · 0x12 · 0x20 · sha256(bytes) )
 *        |          |      |      |      |
 *        |          |      |      |      +-- 32 bytes: longitud del hash
 *        |          |      |      +-- 0x12: el hash es sha2-256
 *        |          |      +-- 0x55: el contenido son bytes crudos (raw)
 *        |          +-- 0x01: CID versión 1
 *        +-- "b": la cadena está en base32 minúscula
 *
 * Es la Sesión 2 otra vez: el identificador ES el hash del contenido.
 * Prueba:  --texto "hello world"  da  bafkreifzjut3te2nhyekklss27nh3k72ysco7y32koao5eei66wof36n5e
 * y ese CID abre en cualquier puerta: https://ipfs.io/ipfs/<ese CID>
 *
 * OJO, y es parte de la lección: un servicio de pinning puede devolver OTRO
 * CID para los mismos bytes (p. ej. uno que empieza por «bafybei»), porque
 * envuelve el archivo en una estructura distinta (dag-pb) antes de hashear.
 * Los dos son hash del contenido; solo difiere la receta. Solo archivos
 * pequeños (hasta 256 KiB, un único bloque) dan este CID raw al subirlos
 * con `ipfs add --cid-version 1`.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const ALFABETO = "abcdefghijklmnopqrstuvwxyz234567"; // base32 RFC 4648, minúsculas

function base32(bytes) {
  let bits = 0, valor = 0, salida = "";
  for (const b of bytes) {
    valor = (valor << 8) | b;
    bits += 8;
    while (bits >= 5) { salida += ALFABETO[(valor >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) salida += ALFABETO[(valor << (5 - bits)) & 31];
  return salida;
}

const args = process.argv.slice(2);
let bytes, origen;
if (args[0] === "--texto" && args[1] !== undefined) { bytes = Buffer.from(args[1], "utf8"); origen = `texto «${args[1]}»`; }
else if (args[0]) { bytes = readFileSync(args[0]); origen = args[0]; }
else { console.error('Uso: node scripts/s11/cid-raw.js archivo   |   --texto "hola"'); process.exit(1); }

const hash = createHash("sha256").update(bytes).digest();
const cid = "b" + base32(Buffer.concat([Buffer.from([0x01, 0x55, 0x12, 0x20]), hash]));

console.log(`\n  origen  : ${origen}`);
console.log(`  bytes   : ${bytes.length.toLocaleString("es-CO")}`);
console.log(`  sha256  : ${hash.toString("hex")}`);
console.log(`  CID raw : ${cid}`);
if (bytes.length > 262144) console.log("  (más de 256 KiB: un nodo IPFS lo partiría en bloques y el CID sería otro)");
console.log(`  probar  : https://ipfs.io/ipfs/${cid}\n`);
