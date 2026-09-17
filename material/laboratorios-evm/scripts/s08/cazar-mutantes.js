/**
 * Laboratorio 08 · ¿sus pruebas atrapan errores de verdad?
 *
 *     node scripts/s08/cazar-mutantes.js [ruta/a/la/suite.test.js]
 *
 * Corre la suite contra el contrato correcto y contra tres mutantes, cada uno
 * con un error sutil. Un mutante está MUERTO si al menos una prueba falla
 * contra él. Un mutante VIVO significa que hay un error que su suite no ve.
 *
 * Funciona igual en Windows (PowerShell o cmd) que en macOS y Linux.
 */
import { spawnSync } from "node:child_process";

const suite = process.argv[2] || "test/s08/Recaudo.test.js";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function correr(contrato) {
  const r = spawnSync(npx, ["hardhat", "test", suite], {
    env: { ...process.env, CONTRATO: contrato },
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  const salida = (r.stdout || "") + (r.stderr || "");
  const pasan = Number((salida.match(/(\d+) passing/) || [])[1] || 0);
  const fallan = Number((salida.match(/(\d+) failing/) || [])[1] || 0);
  return { pasan, fallan, salida };
}

console.log(`\n  Suite: ${suite}\n`);

const original = correr("Recaudo");
if (original.pasan === 0) {
  console.log("  No se encontraron pruebas. ¿Copiaron la plantilla a test/s08/?\n");
  console.log(original.salida.split("\n").slice(-15).join("\n"));
  process.exit(1);
}
if (original.fallan > 0) {
  console.log(`  ✗ Contra el contrato CORRECTO fallan ${original.fallan} prueba(s).`);
  console.log("    Primero la suite tiene que pasar completa contra Recaudo.sol.\n");
  process.exit(1);
}
console.log(`  ✔ Recaudo (correcto)      ${original.pasan} pruebas en verde\n`);

let vivos = 0;
for (const m of ["RecaudoMutante1", "RecaudoMutante2", "RecaudoMutante3"]) {
  const r = correr(m);
  const muerto = r.fallan > 0;
  if (!muerto) vivos++;
  console.log(`  ${muerto ? "✔ MUERTO" : "✗ VIVO  "}  ${m}   ${r.pasan} pasan · ${r.fallan} fallan`);
}

console.log(vivos === 0
  ? "\n  Los tres mutantes murieron: su suite detecta los tres errores.\n"
  : `\n  ${vivos} mutante(s) sobrevive(n). Hay un error que su suite no ve: piensen en los bordes.\n`);
process.exit(vivos === 0 ? 0 : 1);
