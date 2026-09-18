/**
 * Laboratorio 15 · la DAO bien armada (piezas, roles y defensas)
 *
 *     npx hardhat test test/s15/Gobierno.test.js
 *
 * Estas pruebas NO recorren el ciclo de una propuesta (eso lo escriben
 * ustedes en CicloGobierno.test.js). Comprueban que la DAO está bien montada:
 * que sin delegar no hay votos, que el timelock solo obedece al Governor, que
 * la tesorería solo obedece al timelock, que nadie quedó como administrador
 * escondido, y que votos comprados DESPUÉS de proponer no cuentan.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { mine, loadFixture } = networkHelpers;

const RETARDO = 3600; // segundos del timelock en las pruebas (1 hora)

async function desplegarDAO() {
  const [fundador, ana, beto, carla, atacante] = await ethers.getSigners();

  // 1 · el token de voto
  const token = await ethers.deployContract("TokenVoto");

  // 2 · el timelock: sin proponentes todavía, ejecución abierta a cualquiera
  //     (address(0)), y el fundador como administrador TEMPORAL.
  const timelock = await ethers.deployContract("TimelockUSB", [RETARDO, [], [ethers.ZeroAddress], fundador.address]);

  // 3 · el Governor, que conoce al token y al timelock
  const gobierno = await ethers.deployContract("GobiernoUSB", [await token.getAddress(), await timelock.getAddress()]);

  // 4 · repartir roles: solo el Governor propone y cancela en el timelock
  const PROPOSER = await timelock.PROPOSER_ROLE();
  const CANCELLER = await timelock.CANCELLER_ROLE();
  const ADMIN = await timelock.DEFAULT_ADMIN_ROLE();
  await timelock.grantRole(PROPOSER, await gobierno.getAddress());
  await timelock.grantRole(CANCELLER, await gobierno.getAddress());
  // 5 · el fundador RENUNCIA a administrar: desde aquí nadie tiene llaves maestras
  await timelock.renounceRole(ADMIN, fundador.address);

  // 6 · la tesorería pertenece al TIMELOCK (no al Governor)
  const tesoreria = await ethers.deployContract("Tesoreria", [await timelock.getAddress()]);
  await fundador.sendTransaction({ to: await tesoreria.getAddress(), value: ethers.parseEther("5") });

  // 7 · repartir poder de voto y delegar
  await token.acunar(ana.address, ethers.parseEther("60"));
  await token.acunar(beto.address, ethers.parseEther("30"));
  await token.acunar(carla.address, ethers.parseEther("10"));
  await token.connect(ana).delegate(ana.address);
  await token.connect(beto).delegate(beto.address);
  await token.connect(carla).delegate(carla.address);
  await mine(1);

  return { token, timelock, gobierno, tesoreria, fundador, ana, beto, carla, atacante, PROPOSER, CANCELLER, ADMIN };
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

describe("S15 · TokenVoto · delegación", () => {
  it("los tokens NO cuentan como votos hasta que se delega", async () => {
    const [, ana] = await ethers.getSigners();
    const token = await ethers.deployContract("TokenVoto");
    await token.acunar(ana.address, ethers.parseEther("10"));
    expect(await token.balanceOf(ana.address)).to.equal(ethers.parseEther("10"));
    expect(await token.getVotes(ana.address)).to.equal(0n);   // tiene tokens, pero 0 votos
    await token.connect(ana).delegate(ana.address);
    expect(await token.getVotes(ana.address)).to.equal(ethers.parseEther("10"));
  });

  it("delegar a otra cuenta le presta la voz, no los tokens", async () => {
    const [, ana, beto] = await ethers.getSigners();
    const token = await ethers.deployContract("TokenVoto");
    await token.acunar(ana.address, ethers.parseEther("10"));
    await token.connect(ana).delegate(beto.address);
    expect(await token.getVotes(beto.address)).to.equal(ethers.parseEther("10"));
    expect(await token.getVotes(ana.address)).to.equal(0n);
    expect(await token.balanceOf(beto.address)).to.equal(0n);  // los tokens siguen siendo de Ana
  });

  it("solo el dueño puede acuñar: acuñar libremente sería fabricar votos", async () => {
    const [, ana] = await ethers.getSigners();
    const token = await ethers.deployContract("TokenVoto");
    await expect(token.connect(ana).acunar(ana.address, 1n))
      .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  });
});

describe("S15 · roles del timelock", () => {
  it("el Governor es el único proponente y cancelador; ejecutar es abierto", async () => {
    const { timelock, gobierno, fundador, PROPOSER, CANCELLER } = await loadFixture(desplegarDAO);
    expect(await timelock.hasRole(PROPOSER, await gobierno.getAddress())).to.equal(true);
    expect(await timelock.hasRole(CANCELLER, await gobierno.getAddress())).to.equal(true);
    expect(await timelock.hasRole(PROPOSER, fundador.address)).to.equal(false);
    expect(await timelock.hasRole(await timelock.EXECUTOR_ROLE(), ethers.ZeroAddress)).to.equal(true);
    expect(await timelock.getMinDelay()).to.equal(BigInt(RETARDO));
  });

  it("★ el fundador renunció: ya no puede repartir roles (no hay dueño escondido)", async () => {
    const { timelock, fundador, atacante, PROPOSER, ADMIN } = await loadFixture(desplegarDAO);
    expect(await timelock.hasRole(ADMIN, fundador.address)).to.equal(false);
    await expect(timelock.connect(fundador).grantRole(PROPOSER, atacante.address))
      .to.be.revertedWithCustomError(timelock, "AccessControlUnauthorizedAccount");
  });

  it("nadie puede agendar directamente en el timelock saltándose la votación", async () => {
    const { timelock, tesoreria, fundador, atacante } = await loadFixture(desplegarDAO);
    const datos = tesoreria.interface.encodeFunctionData("liberar", [atacante.address, ethers.parseEther("5")]);
    await expect(
      timelock.connect(fundador).schedule(tesoreria.target, 0n, datos, ethers.ZeroHash, ethers.ZeroHash, RETARDO)
    ).to.be.revertedWithCustomError(timelock, "AccessControlUnauthorizedAccount");
  });
});

describe("S15 · la tesorería solo obedece al timelock", () => {
  it("nadie puede sacar fondos directamente: ni el fundador, ni un votante, ni el Governor", async () => {
    const { tesoreria, gobierno, fundador, ana } = await loadFixture(desplegarDAO);
    await expect(tesoreria.connect(fundador).liberar(ana.address, 1n))
      .to.be.revertedWithCustomError(tesoreria, "OwnableUnauthorizedAccount");
    await expect(tesoreria.connect(ana).liberar(ana.address, 1n))
      .to.be.revertedWithCustomError(tesoreria, "OwnableUnauthorizedAccount");
    expect(await tesoreria.owner()).to.not.equal(await gobierno.getAddress());
  });

  it("el dueño de la tesorería es el timelock", async () => {
    const { tesoreria, timelock } = await loadFixture(desplegarDAO);
    expect(await tesoreria.owner()).to.equal(await timelock.getAddress());
  });
});

describe("S15 · defensas de la votación", () => {
  it("★ votos comprados DESPUÉS de proponer no cuentan (defensa contra el préstamo relámpago)", async () => {
    const { token, gobierno, tesoreria, ana, atacante } = await loadFixture(desplegarDAO);
    const p = propuestaLiberar(tesoreria, ana.address, ethers.parseEther("1"), "Propuesta vigilada");
    await gobierno.connect(ana).propose(p.targets, p.values, p.calldatas, p.descripcion);
    const id = await gobierno.hashProposal(p.targets, p.values, p.calldatas, p.hashDescripcion);

    // El atacante consigue 1.000 tokens (10 veces todo lo demás) DESPUÉS de la propuesta.
    await token.acunar(atacante.address, ethers.parseEther("1000"));
    await token.connect(atacante).delegate(atacante.address);
    await mine(2);
    expect(await token.getVotes(atacante.address)).to.equal(ethers.parseEther("1000")); // hoy sí tiene votos...

    await gobierno.connect(atacante).castVote(id, 0);                                   // ...vota en contra...
    const [contra, aFavor] = await gobierno.proposalVotes(id);
    expect(contra).to.equal(0n);                                                          // ...y su voto pesa CERO
    expect(aFavor).to.equal(0n);
    const snapshot = await gobierno.proposalSnapshot(id);
    expect(await gobierno.getVotes(atacante.address, snapshot)).to.equal(0n);
  });

  it("nadie vota dos veces", async () => {
    const { gobierno, tesoreria, ana } = await loadFixture(desplegarDAO);
    const p = propuestaLiberar(tesoreria, ana.address, 1n, "Doble voto");
    await gobierno.connect(ana).propose(p.targets, p.values, p.calldatas, p.descripcion);
    const id = await gobierno.hashProposal(p.targets, p.values, p.calldatas, p.hashDescripcion);
    await mine(2);
    await gobierno.connect(ana).castVote(id, 1);
    await expect(gobierno.connect(ana).castVote(id, 1))
      .to.be.revertedWithCustomError(gobierno, "GovernorAlreadyCastVote");
  });

  it("sin quórum, la propuesta es derrotada aunque todos los votos sean a favor", async () => {
    const { token, gobierno, tesoreria } = await loadFixture(desplegarDAO);
    const [, , , , , pequeno] = await ethers.getSigners();
    await token.acunar(pequeno.address, ethers.parseEther("1"));   // 1 de 101 ≈ 1 % < 4 %
    await token.connect(pequeno).delegate(pequeno.address);
    await mine(1);
    const p = propuestaLiberar(tesoreria, pequeno.address, ethers.parseEther("1"), "Propuesta sin quorum");
    await gobierno.connect(pequeno).propose(p.targets, p.values, p.calldatas, p.descripcion);
    const id = await gobierno.hashProposal(p.targets, p.values, p.calldatas, p.hashDescripcion);
    await mine(2);
    await gobierno.connect(pequeno).castVote(id, 1);               // 100 % de los votos emitidos a favor
    await mine(51);
    expect(await gobierno.quorum(await gobierno.proposalSnapshot(id))).to.equal(ethers.parseEther("4.04"));
    expect(await gobierno.state(id)).to.equal(3n);                 // Defeated: faltó participación
  });
});
