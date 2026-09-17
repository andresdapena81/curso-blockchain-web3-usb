/**
 * Laboratorio 06 · calcula el hash de un archivo para registrarlo en el contrato
 *
 *     node scripts/s06/hash-documento.js ruta/al/diploma.pdf
 *
 * Imprime el keccak256 de los BYTES del archivo: el mismo valor que se pega
 * en Remix como argumento `hashDocumento` de emitir() y verificar().
 *
 * Es la Sesión 2 aplicada: cambiar un solo byte del PDF produce otro hash, y
 * la verificación falla.
 */
import { readFileSync } from "node:fs";
import { keccak256 } from "ethers";

const ruta = process.argv[2];
if (!ruta) {
  console.error("Uso: node scripts/s06/hash-documento.js ruta/al/archivo");
  process.exit(1);
}

const bytes = readFileSync(ruta);
console.log(`\n  archivo : ${ruta}`);
console.log(`  tamaño  : ${bytes.length.toLocaleString("es-CO")} bytes`);
console.log(`  keccak  : ${keccak256(bytes)}\n`);
