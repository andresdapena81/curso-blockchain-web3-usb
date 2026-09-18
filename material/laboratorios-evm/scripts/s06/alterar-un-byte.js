/**
 * Laboratorio 06 · prueba de alteración
 *
 *     node scripts/s06/alterar-un-byte.js scripts/s06/diploma-de-prueba.pdf
 *
 * Copia el archivo cambiando UN SOLO BIT del último byte y lo guarda al lado,
 * con el sufijo «-alterado». El PDF se sigue abriendo igual (el último byte
 * es un salto de línea), pero su hash cambia por completo: la Sesión 2
 * aplicada a un diploma.
 *
 * Después:  node scripts/s06/hash-documento.js <archivo>-alterado.pdf
 */
import { readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";

const ruta = process.argv[2];
if (!ruta) {
  console.error("Uso: node scripts/s06/alterar-un-byte.js ruta/al/archivo");
  process.exit(1);
}

const bytes = readFileSync(ruta);
bytes[bytes.length - 1] ^= 1;               // un solo bit de diferencia
const ext = extname(ruta);
const destino = ruta.slice(0, ruta.length - ext.length) + "-alterado" + ext;
writeFileSync(destino, bytes);
console.log(`\n  original : ${ruta}`);
console.log(`  alterado : ${destino}  (mismo tamaño, un bit distinto)\n`);
