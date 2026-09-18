/**
 * Laboratorio 07 · Parte 3 · ejercicio comparativo de gas: push frente a pull
 *
 * La misma subasta jugada de la misma forma contra tres contratos:
 *   - SubastaPush         devuelve el dinero al superado en la misma puja
 *   - SubastaPullMinima   idéntica, salvo que acredita y cada quien retira
 *   - Subasta             la del laboratorio: pull + participantes + pausa
 *
 * Dos escenarios, porque el resultado depende de CÓMO se puja:
 *   A · cuatro postores distintos, una puja cada uno
 *   B · dos postores que se disputan el lote: seis pujas alternadas
 *
 * Las cifras de la tabla del informe se leen con --gas-stats, UN escenario a la vez
 * (las estadísticas suman todas las pruebas que corran juntas):
 *
 *     npx hardhat test test/s07/GasPushPull.test.js --grep "escenario A" --gas-stats
 *     npx hardhat test test/s07/GasPushPull.test.js --grep "escenario B" --gas-stats
 *
 * Además, cada prueba imprime el total de gas del escenario completo,
 * sumando el gasUsed de cada recibo: sirve para comprobar sus cuentas.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { time } = networkHelpers;

const HORA = 60 * 60;
const eth = (x) => ethers.parseEther(String(x));

async function gas(txPromesa) {
  const recibo = await (await txPromesa).wait();
  return recibo.gasUsed;
}

// Cada subasta se despliega justo antes de jugarla: el reloj avanza al finalizar
// cada una, y la siguiente tiene que encontrarse abierta.
const push = () => ethers.deployContract("SubastaPush", [HORA]);
const pull = () => ethers.deployContract("SubastaPullMinima", [HORA]);
const completa = () => ethers.deployContract("Subasta", [HORA, eth(1)]);

/**
 * Juega una secuencia de pujas, deja vencer la subasta, la finaliza y, si el
 * contrato usa el patrón de retiro, hace que TODOS retiren lo suyo (también el
 * beneficiario). Devuelve el gas total y el desglose.
 */
async function jugar(desplegar, pujas, conRetiros, beneficiario) {
  const subasta = await desplegar();
  let gPujas = 0n;
  for (const [cuenta, monto] of pujas) {
    gPujas += await gas(subasta.connect(cuenta).pujar({ value: eth(monto) }));
  }
  await time.increase(HORA);
  const gFinalizar = await gas(subasta.finalizar());

  let gRetiros = 0n;
  let nRetiros = 0;
  if (conRetiros) {
    // Retira cada cuenta que fue superada alguna vez (todas las pujas menos la
    // última), más el beneficiario. Se deduce de la secuencia, sin llamar a
    // pendientes(): así --gas-stats solo muestra funciones que cuestan gas.
    const superadas = pujas.slice(0, -1).map(([c]) => c);
    const cuentas = [...new Set([...superadas, beneficiario])];
    for (const c of cuentas) {
      gRetiros += await gas(subasta.connect(c).retirar());
      nRetiros++;
    }
    expect(await ethers.provider.getBalance(await subasta.getAddress())).to.equal(0n);
  }
  return { gPujas, gFinalizar, gRetiros, nRetiros, total: gPujas + gFinalizar + gRetiros };
}

function informe(nombre, r) {
  console.log(
    `        ${nombre.padEnd(18)} pujas ${String(r.gPujas).padStart(7)} · finalizar ${String(r.gFinalizar).padStart(6)}` +
    ` · retiros (${r.nRetiros}) ${String(r.gRetiros).padStart(6)} · TOTAL ${String(r.total).padStart(7)}`,
  );
}

describe("S07 · gas · escenario A · cuatro postores, una puja cada uno", () => {
  it("push, pull mínima y subasta completa, con la misma secuencia", async () => {
    const [dueno, ana, beto, carla, dani] = await ethers.getSigners();
    const pujas = [[ana, 1], [beto, 2], [carla, 3], [dani, 4]];

    const rPush = await jugar(push, pujas, false, dueno);
    const rPull = await jugar(pull, pujas, true, dueno);
    const rCompleta = await jugar(completa, pujas, true, dueno);
    informe("SubastaPush", rPush);
    informe("SubastaPullMinima", rPull);
    informe("Subasta (completa)", rCompleta);

    // Con postores distintos, cada acreditación estrena una ranura: pull cuesta más.
    expect(rPull.total).to.be.greaterThan(rPush.total);
  });
});

describe("S07 · gas · escenario B · dos postores se disputan el lote", () => {
  it("push, pull mínima y subasta completa, con seis pujas alternadas", async () => {
    const [dueno, ana, beto] = await ethers.getSigners();
    const pujas = [[ana, 1], [beto, 2], [ana, 3], [beto, 4], [ana, 5], [beto, 6]];

    const rPush = await jugar(push, pujas, false, dueno);
    const rPull = await jugar(pull, pujas, true, dueno);
    const rCompleta = await jugar(completa, pujas, true, dueno);
    informe("SubastaPush", rPush);
    informe("SubastaPullMinima", rPull);
    informe("Subasta (completa)", rCompleta);

    // La pregunta del informe: ¿qué cambió respecto al escenario A, y por qué?
    expect(rPull.total).to.be.greaterThan(0n);
  });
});
