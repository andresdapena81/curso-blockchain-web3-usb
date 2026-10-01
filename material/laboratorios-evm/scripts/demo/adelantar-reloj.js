/**
 * Adelantar el reloj de la red local · utilidad de clase
 *
 *     npx hardhat run scripts/demo/adelantar-reloj.js --network localhost
 *     DIAS=5 npx hardhat run scripts/demo/adelantar-reloj.js --network localhost      (bash)
 *     $env:DIAS="5"; npx hardhat run scripts/demo/adelantar-reloj.js --network localhost   (PowerShell)
 *
 * Para qué: en la clase paso a paso, el préstamo vence en días. Nadie va a
 * esperar dos semanas frente al proyector. La red local de pruebas sí permite
 * mover su propio reloj, así que con esto se "viaja al futuro" y la mora se ve
 * en vivo, en el mismo Remix donde se desplegó el contrato.
 *
 * Cómo se usa en clase:
 *   1. En una terminal:  npx hardhat node       (deja la red local corriendo)
 *   2. En Remix, cambiar el entorno a "Dev - Hardhat Provider".
 *   3. Desplegar el contrato y prestar un equipo por 1 día.
 *   4. Correr este script con DIAS=3 en otra terminal.
 *   5. En Remix, volver a llamar a estaVencido(1) y diasDeMora(1). Cambiaron.
 *
 * Esto NO funciona ni en la máquina virtual de Remix ni en Sepolia: el reloj
 * solo se puede mover en una red de pruebas propia. Vale la pena decirlo en
 * clase, porque explica por qué los contratos con plazos se prueban en local.
 */

import { network } from "hardhat";

const DIA = 24 * 60 * 60;

async function main() {
  const dias = Number(process.env.DIAS ?? 3);
  if (!Number.isFinite(dias) || dias <= 0) {
    throw new Error(`DIAS debe ser un número positivo; llegó ${process.env.DIAS}`);
  }

  const { provider } = await network.connect();

  const antes = await bloque(provider);
  await provider.request({ method: "evm_increaseTime", params: [dias * DIA] });
  await provider.request({ method: "evm_mine", params: [] });
  const despues = await bloque(provider);

  const avance = despues.hora - antes.hora;
  console.log(`antes   · bloque ${antes.numero}  ${fecha(antes.hora)}`);
  console.log(`después · bloque ${despues.numero}  ${fecha(despues.hora)}`);
  console.log(`el reloj avanzó ${(avance / DIA).toFixed(2)} días (${avance} segundos)`);
}

async function bloque(provider) {
  const b = await provider.request({
    method: "eth_getBlockByNumber",
    params: ["latest", false],
  });
  return { numero: Number(b.number), hora: Number(b.timestamp) };
}

function fecha(segundos) {
  return new Date(segundos * 1000).toISOString().replace("T", " ").slice(0, 19);
}

main().catch((e) => {
  console.error(`\nNo se pudo mover el reloj: ${e.message}`);
  console.error("¿Está corriendo `npx hardhat node`, y se pasó --network localhost?");
  process.exitCode = 1;
});
