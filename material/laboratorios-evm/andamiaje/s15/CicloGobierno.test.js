/**
 * Laboratorio 15 · el ciclo completo de una propuesta, con timelock · VERSIÓN DE TRABAJO
 *
 *     npx hardhat test test/s15/CicloGobierno.test.js
 *
 * Al empezar fallan las 3 pruebas marcadas con ★. Completen los TODO 1 a 5 en
 * orden hasta que las 5 pasen. Las dos pruebas sin ★ ya están completas: úsenlas
 * como ejemplo de cómo se llama cada función.
 *
 * proponer → (retraso) → votar → (periodo) → encolar → (timelock) → ejecutar
 *
 * El tiempo se SIMULA: mine(n) avanza n bloques (la votación se mide en
 * bloques) y time.increase(s) avanza s segundos (el timelock se mide en
 * segundos). En Sepolia, lo mismo toma unos 10 minutos de votación más el
 * retardo del timelock (scripts/s15/ciclo-gobierno.js).
 *
 * Estados del Governor (OpenZeppelin v5):
 *   0 Pending · 1 Active · 2 Canceled · 3 Defeated · 4 Succeeded · 5 Queued · 6 Expired · 7 Executed
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { mine, time, loadFixture } = networkHelpers;

const RETARDO = 3600; // segundos del timelock (1 hora)
const ESTADO = { Pending: 0n, Active: 1n, Canceled: 2n, Defeated: 3n, Succeeded: 4n, Queued: 5n, Expired: 6n, Executed: 7n };
const VOTO = { Contra: 0, AFavor: 1, Abstencion: 2 };

async function desplegarDAO() {
  const [fundador, ana, beto, carla] = await ethers.getSigners();
  const token = await ethers.deployContract("TokenVoto");
  const timelock = await ethers.deployContract("TimelockUSB", [RETARDO, [], [ethers.ZeroAddress], fundador.address]);
  const gobierno = await ethers.deployContract("GobiernoUSB", [await token.getAddress(), await timelock.getAddress()]);
  await timelock.grantRole(await timelock.PROPOSER_ROLE(), await gobierno.getAddress());
  await timelock.grantRole(await timelock.CANCELLER_ROLE(), await gobierno.getAddress());
  await timelock.renounceRole(await timelock.DEFAULT_ADMIN_ROLE(), fundador.address);
  const tesoreria = await ethers.deployContract("Tesoreria", [await timelock.getAddress()]);
  await fundador.sendTransaction({ to: await tesoreria.getAddress(), value: ethers.parseEther("5") });

  // Poder de voto: 60 / 30 / 10. OJO: todavía NADIE ha delegado.
  await token.acunar(ana.address, ethers.parseEther("60"));
  await token.acunar(beto.address, ethers.parseEther("30"));
  await token.acunar(carla.address, ethers.parseEther("10"));

  return { token, timelock, gobierno, tesoreria, ana, beto, carla };
}

function propuestaLiberar(tesoreria, a, monto, descripcion) {
  return {
    targets: [tesoreria.target],
    values: [0n],
    calldatas: [tesoreria.interface.encodeFunctionData("liberar", [a, monto])],
    descripcion,
    hashDescripcion: ethers.id(descripcion),
  };
}

describe("S15 · ciclo completo con timelock", () => {
  it("★ proponer, votar, encolar, esperar y ejecutar libera los fondos", async () => {
    const { token, gobierno, tesoreria, ana, beto, carla } = await loadFixture(desplegarDAO);
    const monto = ethers.parseEther("2");
    const p = propuestaLiberar(tesoreria, carla.address, monto, "Financiar el semillero #1");

    // TODO 1a · delegar: ana, beto y carla se delegan el voto a sí mismas
    //       (token.connect(x).delegate(x.address)) y luego mine(1) para que
    //       el registro de votos quede en un bloque PASADO.

    // TODO 1b · proponer: gobierno.connect(ana).propose(targets, values, calldatas, descripcion)
    //       (la descripción va en TEXTO; el hash solo se usa en queue/execute)
    const id = await gobierno.hashProposal(p.targets, p.values, p.calldatas, p.hashDescripcion);
    expect(await gobierno.state(id)).to.equal(ESTADO.Pending);

    // TODO 2a · esperar el retraso de votación (1 bloque): avanzar 2 bloques con mine
    expect(await gobierno.state(id)).to.equal(ESTADO.Active);

    // TODO 2b · votar: ana A FAVOR (60) y beto EN CONTRA (30) con castVote(id, VOTO.X)

    // TODO 2c · cerrar la votación: el periodo es de 50 bloques → mine(51)
    expect(await gobierno.state(id)).to.equal(ESTADO.Succeeded);

    // TODO 3a · encolar en el timelock: gobierno.queue(targets, values, calldatas, hashDescripcion)
    expect(await gobierno.state(id)).to.equal(ESTADO.Queued);

    // TODO 3b · esperar el retardo del timelock. OJO: se mide en SEGUNDOS, no en
    //       bloques → time.increase(RETARDO + 1)

    // (ya escrito) ejecutar: cualquiera puede, y los fondos se mueven
    await expect(gobierno.execute(p.targets, p.values, p.calldatas, p.hashDescripcion))
      .to.changeEtherBalance(ethers, carla, monto);
    expect(await gobierno.state(id)).to.equal(ESTADO.Executed);
  });

  it("★ ejecutar antes de que venza el timelock revierte", async () => {
    const { token, timelock, gobierno, tesoreria, ana, carla } = await loadFixture(desplegarDAO);
    const p = propuestaLiberar(tesoreria, carla.address, ethers.parseEther("1"), "Pago apurado");

    const id = await gobierno.hashProposal(p.targets, p.values, p.calldatas, p.hashDescripcion);

    // TODO 4a · llevar la propuesta hasta Queued SIN esperar el timelock:
    //   delegar (ana) → mine(1) → proponer → mine(2) → votar a favor → mine(51) → queue

    // TODO 4b · comprobar que execute() revierte con el error del TIMELOCK:
    //   await expect(gobierno.execute(...)).to.be.revertedWithCustomError(timelock, "TimelockUnexpectedOperationState");
    //   (pista: el Governor delega la ejecución al timelock, y es el timelock el que se niega)
    void timelock; // quitar esta línea al usar `timelock` en el expect

    expect(await gobierno.state(id)).to.equal(ESTADO.Queued);
  });

  it("★ una propuesta derrotada no se puede encolar ni ejecutar", async () => {
    const { token, gobierno, tesoreria, ana, carla } = await loadFixture(desplegarDAO);
    const p = propuestaLiberar(tesoreria, carla.address, ethers.parseEther("2"), "Propuesta impopular");

    await token.connect(ana).delegate(ana.address);
    await token.connect(carla).delegate(carla.address);
    await mine(1);
    await gobierno.connect(carla).propose(p.targets, p.values, p.calldatas, p.descripcion);
    const id = await gobierno.hashProposal(p.targets, p.values, p.calldatas, p.hashDescripcion);
    await mine(2);
    await gobierno.connect(ana).castVote(id, VOTO.Contra);    // 60 en contra
    await gobierno.connect(carla).castVote(id, VOTO.AFavor);  // 10 a favor
    await mine(51);
    expect(await gobierno.state(id)).to.equal(ESTADO.Defeated);

    // TODO 5 · comprobar que queue() Y execute() revierten con el error del GOVERNOR
    //   "GovernorUnexpectedProposalState" (una derrotada no llega al timelock).
    expect.fail("TODO 5 · escribir los dos expect(...).to.be.revertedWithCustomError y borrar esta línea");
  });

  it("sin delegar, ni la dueña del 60 % logra aprobar nada", async () => {
    const { gobierno, tesoreria, ana, carla } = await loadFixture(desplegarDAO);
    const p = propuestaLiberar(tesoreria, carla.address, ethers.parseEther("2"), "Olvidamos delegar");
    await gobierno.connect(ana).propose(p.targets, p.values, p.calldatas, p.descripcion);
    const id = await gobierno.hashProposal(p.targets, p.values, p.calldatas, p.hashDescripcion);
    await mine(2);
    await gobierno.connect(ana).castVote(id, VOTO.AFavor);    // vota... con peso 0
    await mine(51);
    expect(await gobierno.state(id)).to.equal(ESTADO.Defeated);
  });

  it("execute exige los MISMOS datos: con otra descripción no encuentra la propuesta", async () => {
    const { token, gobierno, tesoreria, ana, carla } = await loadFixture(desplegarDAO);
    const p = propuestaLiberar(tesoreria, carla.address, ethers.parseEther("2"), "Texto original");
    await token.connect(ana).delegate(ana.address);
    await mine(1);
    await gobierno.connect(ana).propose(p.targets, p.values, p.calldatas, p.descripcion);
    await mine(2);
    const id = await gobierno.hashProposal(p.targets, p.values, p.calldatas, p.hashDescripcion);
    await gobierno.connect(ana).castVote(id, VOTO.AFavor);
    await mine(51);
    await expect(gobierno.queue(p.targets, p.values, p.calldatas, ethers.id("Texto original ")))
      .to.be.revertedWithCustomError(gobierno, "GovernorNonexistentProposal");
  });
});
