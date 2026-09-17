/**
 * Laboratorio 07 · Subasta con patrón de retiro, antipatrón push y empaquetado
 *
 *     npx hardhat test test/s07/Subasta.test.js
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { time, loadFixture } = networkHelpers;

const HORA = 60 * 60;
const MINIMA = ethers.parseEther("1");
const eth = (x) => ethers.parseEther(String(x));

async function desplegar() {
  const [dueno, ana, beto, carla] = await ethers.getSigners();
  const s = await ethers.deployContract("Subasta", [HORA, MINIMA]);
  return { s, dueno, ana, beto, carla };
}

describe("S07 · Subasta · pujar", () => {
  it("acepta la primera puja desde el mínimo", async () => {
    const { s, ana } = await loadFixture(desplegar);
    await expect(s.connect(ana).pujar({ value: MINIMA })).to.emit(s, "NuevaPuja").withArgs(ana.address, MINIMA);
    expect(await s.mejorPostor()).to.equal(ana.address);
    expect(await s.mejorPuja()).to.equal(MINIMA);
  });

  it("rechaza una primera puja por debajo del mínimo", async () => {
    const { s, ana } = await loadFixture(desplegar);
    await expect(s.connect(ana).pujar({ value: eth("0.5") }))
      .to.be.revertedWithCustomError(s, "PujaInsuficiente").withArgs(MINIMA, eth("0.5"));
  });

  it("exige superar la puja anterior al menos en 1 %", async () => {
    const { s, ana, beto } = await loadFixture(desplegar);
    await s.connect(ana).pujar({ value: eth(2) });
    expect(await s.minimoSiguiente()).to.equal(eth("2.02"));
    await expect(s.connect(beto).pujar({ value: eth("2.01") })).to.be.revertedWithCustomError(s, "PujaInsuficiente");
    await expect(s.connect(beto).pujar({ value: eth("2.02") })).to.emit(s, "NuevaPuja");
  });

  it("al ser superado, el postor NO recibe su dinero: queda pendiente de retiro", async () => {
    const { s, ana, beto } = await loadFixture(desplegar);
    await s.connect(ana).pujar({ value: eth(1) });
    await expect(s.connect(beto).pujar({ value: eth(2) })).to.changeEtherBalance(ethers, ana, 0n);
    expect(await s.pendientes(ana.address)).to.equal(eth(1));
  });

  it("registra a cada participante una sola vez", async () => {
    const { s, ana, beto } = await loadFixture(desplegar);
    await s.connect(ana).pujar({ value: eth(1) });
    await s.connect(beto).pujar({ value: eth(2) });
    await s.connect(ana).pujar({ value: eth(3) });
    expect(await s.participantes()).to.deep.equal([ana.address, beto.address]);
  });

  it("no acepta pujas después del cierre", async () => {
    const { s, ana } = await loadFixture(desplegar);
    await time.increase(HORA);
    await expect(s.connect(ana).pujar({ value: eth(5) })).to.be.revertedWithCustomError(s, "SubastaCerrada");
  });

  it("no se puede desplegar con duración cero", async () => {
    const F = await ethers.getContractFactory("Subasta");
    await expect(F.deploy(0, MINIMA)).to.be.revertedWithCustomError(F, "DuracionInvalida");
  });
});

describe("S07 · Subasta · retirar", () => {
  it("el perdedor retira exactamente lo suyo, una sola vez", async () => {
    const { s, ana, beto } = await loadFixture(desplegar);
    await s.connect(ana).pujar({ value: eth(1) });
    await s.connect(beto).pujar({ value: eth(2) });
    await expect(s.connect(ana).retirar()).to.changeEtherBalances(ethers, [ana, s], [eth(1), -eth(1)]);
    await expect(s.connect(ana).retirar()).to.be.revertedWithCustomError(s, "NadaQueRetirar");
  });

  it("quien va ganando no tiene nada que retirar", async () => {
    const { s, ana } = await loadFixture(desplegar);
    await s.connect(ana).pujar({ value: eth(1) });
    await expect(s.connect(ana).retirar()).to.be.revertedWithCustomError(s, "NadaQueRetirar");
  });

  it("acumula si el mismo postor es superado varias veces", async () => {
    const { s, ana, beto } = await loadFixture(desplegar);
    await s.connect(ana).pujar({ value: eth(1) });
    await s.connect(beto).pujar({ value: eth(2) });
    await s.connect(ana).pujar({ value: eth(3) });
    await s.connect(beto).pujar({ value: eth(4) });
    expect(await s.pendientes(ana.address)).to.equal(eth(4));   // 1 + 3
  });
});

describe("S07 · Subasta · finalizar y estado", () => {
  it("recorre los tres estados", async () => {
    const { s, ana } = await loadFixture(desplegar);
    expect(await s.estado()).to.equal(0n);                      // Abierta
    await s.connect(ana).pujar({ value: eth(1) });
    await time.increase(HORA);
    expect(await s.estado()).to.equal(1n);                      // PorFinalizar
    await s.finalizar();
    expect(await s.estado()).to.equal(2n);                      // Finalizada
  });

  it("no se puede finalizar antes de tiempo ni dos veces", async () => {
    const { s } = await loadFixture(desplegar);
    await expect(s.finalizar()).to.be.revertedWithCustomError(s, "SubastaAbierta");
    await time.increase(HORA);
    await s.finalizar();
    await expect(s.finalizar()).to.be.revertedWithCustomError(s, "YaFinalizada");
  });

  it("cualquiera puede finalizar, y el beneficiario también retira por el patrón pull", async () => {
    const { s, dueno, ana, carla } = await loadFixture(desplegar);
    await s.connect(ana).pujar({ value: eth(3) });
    await time.increase(HORA);
    await expect(s.connect(carla).finalizar()).to.emit(s, "SubastaFinalizada").withArgs(ana.address, eth(3));
    await expect(s.connect(dueno).retirar()).to.changeEtherBalance(ethers, dueno, eth(3));
  });

  it("al final el contrato queda en cero si todos retiran", async () => {
    const { s, dueno, ana, beto } = await loadFixture(desplegar);
    await s.connect(ana).pujar({ value: eth(1) });
    await s.connect(beto).pujar({ value: eth(2) });
    await time.increase(HORA);
    await s.finalizar();
    await s.connect(ana).retirar();
    await s.connect(dueno).retirar();
    expect(await ethers.provider.getBalance(await s.getAddress())).to.equal(0n);
  });
});

describe("S07 · Subasta · interruptor de emergencia", () => {
  it("pausada no acepta pujas, pero SÍ permite retirar", async () => {
    const { s, ana, beto } = await loadFixture(desplegar);
    await s.connect(ana).pujar({ value: eth(1) });
    await s.connect(beto).pujar({ value: eth(2) });
    await s.pausar();
    await expect(s.connect(ana).pujar({ value: eth(5) })).to.be.revertedWithCustomError(s, "EnforcedPause");
    await expect(s.connect(ana).retirar()).to.changeEtherBalance(ethers, ana, eth(1));
    await s.reanudar();
    await expect(s.connect(ana).pujar({ value: eth(5) })).to.emit(s, "NuevaPuja");
  });

  it("solo el dueño pausa", async () => {
    const { s, ana } = await loadFixture(desplegar);
    await expect(s.connect(ana).pausar()).to.be.revertedWithCustomError(s, "OwnableUnauthorizedAccount");
  });
});

describe("S07 · push frente a pull · el postor hostil", () => {
  it("★ contra la subasta PUSH, un postor hostil congela todas las pujas siguientes", async () => {
    const [, , beto] = await ethers.getSigners();
    const push = await ethers.deployContract("SubastaPush", [HORA]);
    const hostil = await ethers.deployContract("PostorHostil");

    await hostil.pujarEn(await push.getAddress(), { value: eth(1) });
    await expect(push.connect(beto).pujar({ value: eth(5) })).to.be.revertedWithCustomError(push, "EnvioFallido");
    await expect(push.connect(beto).pujar({ value: eth(50) })).to.be.revertedWithCustomError(push, "EnvioFallido");
    expect(await push.mejorPostor()).to.equal(await hostil.getAddress());
  });

  it("★ contra la subasta PULL, el mismo ataque no bloquea a nadie", async () => {
    const { s, beto } = await loadFixture(desplegar);
    const hostil = await ethers.deployContract("PostorHostil");

    await hostil.pujarEn(await s.getAddress(), { value: eth(1) });
    await expect(s.connect(beto).pujar({ value: eth(5) })).to.emit(s, "NuevaPuja");
    expect(await s.mejorPostor()).to.equal(beto.address);
    // el hostil solo se perjudica a sí mismo: su dinero queda pendiente
    expect(await s.pendientes(await hostil.getAddress())).to.equal(eth(1));
  });

  it("gas, comparación justa: pull cuesta MÁS por puja y además exige un retiro aparte", async () => {
    const [, ana, beto] = await ethers.getSigners();
    const push = await ethers.deployContract("SubastaPush", [HORA]);
    const pull = await ethers.deployContract("SubastaPullMinima", [HORA]);

    await push.connect(ana).pujar({ value: eth(1) });
    await pull.connect(ana).pujar({ value: eth(1) });
    const gPush = (await (await push.connect(beto).pujar({ value: eth(2) })).wait()).gasUsed;
    const gPull = (await (await pull.connect(beto).pujar({ value: eth(2) })).wait()).gasUsed;
    const gRetiro = (await (await pull.connect(ana).retirar()).wait()).gasUsed;
    console.log(`        segunda puja · push: ${gPush} · pull: ${gPull} · retiro posterior: ${gRetiro}`);

    // La lección honesta: la seguridad del patrón pull no es gratis.
    expect(gPull).to.be.greaterThan(gPush);
    expect(await pull.pendientes(ana.address)).to.equal(0n);
  });
});

describe("S07 · empaquetado de storage", () => {
  it("ordenar las variables ahorra una ranura: una escritura nueva menos", async () => {
    const e = await ethers.deployContract("Empaquetado");
    const gDes = (await (await e.guardarDesordenado(1, 2, 3)).wait()).gasUsed;
    const gOrd = (await (await e.guardarOrdenado(1, 2, 3)).wait()).gasUsed;
    console.log(`        desordenado: ${gDes} gas · ordenado: ${gOrd} gas · ahorro: ${gDes - gOrd}`);
    expect(gDes - gOrd).to.be.greaterThan(15000n);
  });
});

describe("S07 · biblioteca Porcentajes", () => {
  it("se usa desde la subasta: 1 % de 2 ETH son 0,02 ETH", async () => {
    const { s, ana } = await loadFixture(desplegar);
    await s.connect(ana).pujar({ value: eth(2) });
    expect((await s.minimoSiguiente()) - eth(2)).to.equal(eth("0.02"));
  });
});
