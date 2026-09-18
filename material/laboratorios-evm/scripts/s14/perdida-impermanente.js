/**
 * Laboratorio 14 · Pérdida impermanente, calculada
 *
 *     node scripts/s14/perdida-impermanente.js          # tabla + los tres escenarios de la hoja
 *     node scripts/s14/perdida-impermanente.js 10       # además, un factor r propio (aquí ×10)
 *
 * Un proveedor de liquidez deposita dos activos a partes iguales en un pool
 * de producto constante (x * y = k). Si el precio de uno cambia, al retirar
 * tendrá MENOS valor que si simplemente hubiera conservado los dos activos.
 * Esa diferencia es la pérdida impermanente. No usa la cadena: es aritmética.
 * (La versión EN CADENA, con el contrato PoolXYK, es scripts/s14/pool-en-numeros.js.)
 *
 * Fórmula (para un cambio de precio de factor r respecto al inicio):
 *     valor_pool / valor_holdear = 2*sqrt(r) / (1 + r)
 *     pérdida impermanente = 1 - ese cociente
 *
 * De dónde sale: con k = x*y y precio p = y/x, las reservas para un precio p
 * son x = sqrt(k/p) e y = sqrt(k*p). Si p pasa de p0 a p1 = r*p0, las
 * cantidades del proveedor se multiplican por 1/sqrt(r) (ETH) y sqrt(r) (USD).
 */

function perdidaImpermanente(r) {
  return 1 - (2 * Math.sqrt(r)) / (1 + r);
}

const n = (x, d = 2) => x.toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------------------------------------------------------------- 1 · tabla
const escenarios = [
  ["El precio no cambia (r = 1)", 1],
  ["El precio sube 25 % (r = 1.25)", 1.25],
  ["El precio se duplica (r = 2)", 2],
  ["El precio se triplica (r = 3)", 3],
  ["El precio cae a la mitad (r = 0.5)", 0.5],
  ["El precio se multiplica por 5 (r = 5)", 5],
];

console.log("\n  PÉRDIDA IMPERMANENTE SEGÚN EL CAMBIO DE PRECIO\n");
console.log("  " + "escenario".padEnd(38) + "pérdida vs. conservar");
console.log("  " + "-".repeat(60));
for (const [nombre, r] of escenarios) {
  const pi = perdidaImpermanente(r) * 100;
  console.log("  " + nombre.padEnd(38) + (pi < 0.005 ? "0,00 %" : n(pi) + " %"));
}

// ------------------------------------------- 2 · ejemplo trabajado (la hoja)
// Escenario base: 1 ETH + 2 000 USDC, con ETH a 2 000. k = 1 * 2 000 = 2 000.
const x0 = 1, y0 = 2000, p0 = 2000;
const casos = [["A · ETH cae a 1 000", 1000], ["B · ETH sube a 4 000", 4000], ["C · ETH sube a 8 000", 8000]];
const propio = Number(process.argv[2]);
if (Number.isFinite(propio) && propio > 0) casos.push([`propio · r = ${propio}`, p0 * propio]);

console.log("\n  EJEMPLO TRABAJADO · depósito de 1 ETH + 2 000 USDC con ETH a 2 000 (k = 2 000)\n");
console.log("  escenario              r      ETH en pool  USDC en pool  valor pool  valor conservar  pérdida");
console.log("  " + "-".repeat(94));
for (const [nombre, p1] of casos) {
  const r = p1 / p0;
  const x1 = x0 / Math.sqrt(r);          // = sqrt(k / p1)
  const y1 = y0 * Math.sqrt(r);          // = sqrt(k * p1)
  const valorPool = x1 * p1 + y1;
  const valorConservar = x0 * p1 + y0;
  const pi = 1 - valorPool / valorConservar;
  console.log("  " + nombre.padEnd(21) + n(r, 2).padStart(6) + n(x1, 4).padStart(13) + n(y1, 2).padStart(14)
    + n(valorPool, 2).padStart(12) + n(valorConservar, 2).padStart(17) + (n(pi * 100) + " %").padStart(10));
}

console.log("\n  La clave: la pérdida es SIMÉTRICA (subir x2 o bajar a la mitad duelen igual)");
console.log("  y crece con la magnitud del cambio. Se llama «impermanente» porque");
console.log("  desaparece si el precio vuelve al punto de partida — y se vuelve");
console.log("  permanente en cuanto el proveedor retira su liquidez.\n");
