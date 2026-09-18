/**
 * Laboratorio 08 · SU suite de pruebas para Recaudo · PLANTILLA
 *
 * 1. Copien este archivo a test/s08/Recaudo.test.js
 * 2. Escriban AL MENOS 10 pruebas (las dos de ejemplo cuentan).
 * 3. Corran:
 *        npx hardhat test test/s08/Recaudo.test.js --coverage
 *    Objetivo: todas en verde y cobertura de líneas ≥ 80 % en Recaudo.sol.
 * 4. Cacen los mutantes:
 *        node scripts/s08/cazar-mutantes.js
 *    Objetivo: los tres mutantes MUERTOS (su suite debe fallar contra cada uno).
 *
 * No miren el código de los mutantes antes de escribir las pruebas: el
 * ejercicio es pensar en los bordes, no copiar la diferencia.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { time, loadFixture } = networkHelpers;

// El script de mutantes cambia esta variable. No la toquen.
const CONTRATO = process.env.CONTRATO || "Recaudo";

const META = ethers.parseEther("10");
const PLAZO = 7 * 24 * 60 * 60;
const eth = (x) => ethers.parseEther(String(x));

/**
 * Fixture: se ejecuta una vez y Hardhat guarda una instantánea de la cadena.
 * Cada prueba que llama a loadFixture(desplegar) arranca desde esa instantánea:
 * rápido, y sin que una prueba contamine a la siguiente.
 */
async function desplegar() {
  const [beneficiario, ana, beto, carla] = await ethers.getSigners();
  const r = await ethers.deployContract(CONTRATO, [META, PLAZO]);
  const fin = await r.fin();
  return { r, beneficiario, ana, beto, carla, fin };
}

describe(`S08 · ${CONTRATO} · despliegue`, () => {
  // EJEMPLO 1 · caso feliz
  it("fija la meta y el dueño", async () => {
    const { r, beneficiario } = await loadFixture(desplegar);
    expect(await r.meta()).to.equal(META);
    expect(await r.owner()).to.equal(beneficiario.address);
  });

  // TODO · ¿qué pasa si se despliega con meta cero o duración cero?
});

describe(`S08 · ${CONTRATO} · aportar`, () => {
  // EJEMPLO 2 · caso de reversión con error personalizado
  it("rechaza un aporte de cero", async () => {
    const { r, ana } = await loadFixture(desplegar);
    await expect(r.connect(ana).aportar({ value: 0 }))
      .to.be.revertedWithCustomError(r, "AporteCero");
  });

  // TODO · un aporte válido suma al aportante y al total, y emite Aporte con los argumentos correctos
  // TODO · ¿se puede aportar después del plazo?
  // TODO · ¿y justo en el límite del plazo?   (herramienta útil: time.setNextBlockTimestamp)
});

describe(`S08 · ${CONTRATO} · recaudo exitoso`, () => {
  // TODO · con la meta superada, tras el plazo, el dueño reclama y recibe el saldo
  //        pista: expect(tx).to.changeEtherBalance(ethers, cuenta, monto)
  // TODO · ¿y en el límite de la meta?
  // TODO · ¿se puede reclamar antes del plazo? ¿dos veces? ¿alguien que no es el dueño?
});

describe(`S08 · ${CONTRATO} · recaudo fallido`, () => {
  // TODO · cada aportante recupera exactamente lo suyo
  // TODO · ¿puede alguien reembolsar más de una vez?
  // TODO · ¿quien no aportó recibe algo?
  // TODO · ¿el dueño puede llevarse los fondos si no se alcanzó la meta?
});
