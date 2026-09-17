/**
 * Laboratorio 14 · Pérdida impermanente, calculada
 *
 *     node scripts/s14/perdida-impermanente.js
 *
 * Un proveedor de liquidez deposita dos activos a partes iguales en un pool
 * de producto constante (x * y = k). Si el precio de uno cambia, al retirar
 * tendrá MENOS valor que si simplemente hubiera conservado los dos activos.
 * Esa diferencia es la pérdida impermanente. No usa la cadena: es aritmética.
 *
 * Fórmula (para un cambio de precio de factor r respecto al inicio):
 *     valor_pool / valor_holdear = 2*sqrt(r) / (1 + r)
 *     pérdida impermanente = 1 - ese cociente
 */

function perdidaImpermanente(r) {
  return 1 - (2 * Math.sqrt(r)) / (1 + r);
}

// Escenario base: 1 ETH + 2000 USDC, con ETH a 2000. k se mantiene.
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
  console.log("  " + nombre.padEnd(38) + (pi < 0.005 ? "0.00 %" : pi.toFixed(2) + " %"));
}

console.log("\n  La clave: la pérdida es SIMÉTRICA (subir x2 o bajar a la mitad duelen igual)");
console.log("  y crece con la magnitud del cambio. Se llama «impermanente» porque");
console.log("  desaparece si el precio vuelve al punto de partida — y se vuelve");
console.log("  permanente en cuanto el proveedor retira su liquidez.\n");
