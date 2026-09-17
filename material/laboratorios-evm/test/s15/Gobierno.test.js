/**
 * Laboratorio 15 · el ciclo completo de gobernanza on-chain
 *
 *     npx hardhat test test/s15/Gobierno.test.js
 *
 * Proponer → delegar → votar → ejecutar. La prueba central recorre el ciclo
 * entero y comprueba que la tesorería solo libera fondos por una propuesta
 * aprobada, nunca por decisión de una sola persona.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { time, mine, loadFixture } = networkHelpers;

async function desplegar() {
  const [fundador, ana, beto, carla] = await ethers.getSigners();

  const token = await ethers.deployContract("TokenVoto");
  const gobierno = await ethers.deployContract("GobiernoUSB", [await token.getAddress()]);
  const tesoreria = await ethers.deployContract("Tesoreria", [await gobierno.getAddress()]);

  // Repartir poder de voto.
  await token.acunar(ana.address, ethers.parseEther("60"));
  await token.acunar(beto.address, ethers.parseEther("30"));
  await token.acunar(carla.address, ethers.parseEther("10"));
  // Delegar: sin delegar, los tokens NO cuentan como votos.
  await token.connect(ana).delegate(ana.address);
  await token.connect(beto).delegate(beto.address);
  await token.connect(carla).delegate(carla.address);
  await mine(1);

  // Financiar la tesorería con 5 ETH.
  await fundador.sendTransaction({ to: await tesoreria.getAddress(), value: ethers.parseEther("5") });

  return { token, gobierno, tesoreria, fundador, ana, beto, carla };
}

function propuestaLiberar(gobierno, tesoreria, a, monto, descripcion) {
  const calldata = tesoreria.interface.encodeFunctionData("liberar", [a, monto]);
  return {
    targets: [tesoreria.target],
    values: [0n],
    calldatas: [calldata],
    descripcion,
    hashDescripcion: ethers.id(descripcion),
  };
}

describe("S15 · TokenVoto · delegación", () => {
  it("los tokens NO cuentan como votos hasta que se delega", async () => {
    const [, ana] = await ethers.getSigners();
    const token = await ethers.deployContract("TokenVoto");
    await token.acunar(ana.address, ethers.parseEther("10"));
    expect(await token.getVotes(ana.address)).to.equal(0n);   // aún sin delegar
    await token.connect(ana).delegate(ana.address);
    expect(await token.getVotes(ana.address)).to.equal(ethers.parseEther("10"));
  });
});

describe("S15 · la tesorería solo obedece al gobierno", () => {
  it("nadie puede sacar fondos directamente, ni el fundador", async () => {
    const { tesoreria, fundador, ana } = await loadFixture(desplegar);
    await expect(tesoreria.connect(fundador).liberar(ana.address, 1n))
      .to.be.revertedWithCustomError(tesoreria, "OwnableUnauthorizedAccount");
    await expect(tesoreria.connect(ana).liberar(ana.address, 1n))
      .to.be.revertedWithCustomError(tesoreria, "OwnableUnauthorizedAccount");
  });
});

describe("S15 · ciclo completo de una propuesta", () => {
  it("★ proponer, votar a favor y ejecutar libera los fondos", async () => {
    const { token, gobierno, tesoreria, ana, beto, carla } = await loadFixture(desplegar);
    const monto = ethers.parseEther("2");
    const p = propuestaLiberar(gobierno, tesoreria, carla.address, monto, "Financiar el semillero #1");

    // 1 · proponer
    const tx = await gobierno.connect(ana).propose(p.targets, p.values, p.calldatas, p.descripcion);
    const rec = await tx.wait();
    const idProp = await gobierno.hashProposal(p.targets, p.values, p.calldatas, p.hashDescripcion);
    expect(await gobierno.state(idProp)).to.equal(0n);      // Pending

    // 2 · esperar el retraso de votación
    await mine(2);
    expect(await gobierno.state(idProp)).to.equal(1n);      // Active

    // 3 · votar (0=contra, 1=a favor, 2=abstención)
    await gobierno.connect(ana).castVote(idProp, 1);        // 60 a favor
    await gobierno.connect(beto).castVote(idProp, 0);       // 30 en contra
    // Ana sola (60 de 100) supera a los votos en contra y el quórum del 4 %.

    // 4 · cerrar la votación
    await mine(51);
    expect(await gobierno.state(idProp)).to.equal(4n);      // Succeeded

    // 5 · ejecutar
    await expect(
      gobierno.execute(p.targets, p.values, p.calldatas, p.hashDescripcion)
    ).to.changeEtherBalance(ethers, carla, monto);
    expect(await gobierno.state(idProp)).to.equal(7n);      // Executed
  });

  it("★ una propuesta sin apoyo suficiente es derrotada y no se puede ejecutar", async () => {
    const { gobierno, tesoreria, ana, beto, carla } = await loadFixture(desplegar);
    const p = propuestaLiberar(gobierno, tesoreria, carla.address, ethers.parseEther("2"), "Propuesta impopular");

    await gobierno.connect(carla).propose(p.targets, p.values, p.calldatas, p.descripcion);
    const idProp = await gobierno.hashProposal(p.targets, p.values, p.calldatas, p.hashDescripcion);
    await mine(2);

    await gobierno.connect(ana).castVote(idProp, 0);        // 60 en contra
    await gobierno.connect(carla).castVote(idProp, 1);      // 10 a favor
    await mine(51);
    expect(await gobierno.state(idProp)).to.equal(3n);      // Defeated

    await expect(
      gobierno.execute(p.targets, p.values, p.calldatas, p.hashDescripcion)
    ).to.be.revertedWithCustomError(gobierno, "GovernorUnexpectedProposalState");
  });

  it("sin quórum, la propuesta no prospera aunque todos los votos sean a favor", async () => {
    const { token, gobierno, tesoreria, carla } = await loadFixture(desplegar);
    // Solo Carla (10 %) vota a favor; el quórum es 4 %, así que 10 % lo supera.
    // Para mostrar el fallo de quórum, se necesita un votante por debajo del 4 %.
    const [, , , , dwarf] = await ethers.getSigners();
    await token.acunar(dwarf.address, ethers.parseEther("1"));  // 1 de ~101 ≈ 1 %
    await token.connect(dwarf).delegate(dwarf.address);
    await mine(1);

    const p = propuestaLiberar(gobierno, tesoreria, dwarf.address, ethers.parseEther("1"), "Propuesta sin quorum");
    await gobierno.connect(dwarf).propose(p.targets, p.values, p.calldatas, p.descripcion);
    const idProp = await gobierno.hashProposal(p.targets, p.values, p.calldatas, p.hashDescripcion);
    await mine(2);
    await gobierno.connect(dwarf).castVote(idProp, 1);       // 1 % a favor, por debajo del quórum
    await mine(51);
    expect(await gobierno.state(idProp)).to.equal(3n);       // Defeated (por falta de quórum)
  });
});
