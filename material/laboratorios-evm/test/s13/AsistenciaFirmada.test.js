/**
 * Laboratorio 13 · autenticación por firma EIP-712
 *
 *     npx hardhat test test/s13/AsistenciaFirmada.test.js
 *
 * El estudiante firma fuera de la cadena; otra cuenta (el «docente») envía la
 * firma y paga el gas. Las pruebas marcadas con ★ son los ataques que el
 * contrato debe resistir.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture, time } = networkHelpers;

const TIPOS = {
  Asistencia: [
    { name: "estudiante", type: "address" },
    { name: "sesion", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "vence", type: "uint256" },
  ],
};

async function desplegarAsistencia() {
  const [docente, ana, beto] = await ethers.getSigners();
  const c = await ethers.deployContract("AsistenciaFirmada");
  const { chainId } = await ethers.provider.getNetwork();
  const dominio = {
    name: "AsistenciaUSB",
    version: "1",
    chainId,
    verifyingContract: await c.getAddress(),
  };
  const ahora = await time.latest();
  return { c, docente, ana, beto, dominio, ahora };
}

/** Mensaje de asistencia de `estudiante` a la sesión 13, vigente 10 minutos. */
function mensaje(estudiante, ahora, extra = {}) {
  return { estudiante: estudiante.address, sesion: 13n, nonce: 0n, vence: BigInt(ahora + 600), ...extra };
}

describe("S13 · AsistenciaFirmada · el dominio", () => {
  it("expone su dominio EIP-712 (nombre, versión, red y dirección)", async () => {
    const { c, dominio } = await loadFixture(desplegarAsistencia);
    const d = await c.eip712Domain();
    expect(d.name).to.equal("AsistenciaUSB");
    expect(d.version).to.equal("1");
    expect(d.chainId).to.equal(dominio.chainId);
    expect(d.verifyingContract).to.equal(dominio.verifyingContract);
  });

  it("calcula el mismo resumen que ethers (TypedDataEncoder)", async () => {
    const { c, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const v = mensaje(ana, ahora);
    const esperado = ethers.TypedDataEncoder.hash(dominio, TIPOS, v);
    expect(await c.hashAsistencia(v.estudiante, v.sesion, v.nonce, v.vence)).to.equal(esperado);
  });
});

describe("S13 · AsistenciaFirmada · firma válida", () => {
  it("firmar no cuesta gas ni cambia el nonce de la cuenta del estudiante", async () => {
    const { ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const saldoAntes = await ethers.provider.getBalance(ana.address);
    const txAntes = await ethers.provider.getTransactionCount(ana.address);
    await ana.signTypedData(dominio, TIPOS, mensaje(ana, ahora));
    expect(await ethers.provider.getBalance(ana.address)).to.equal(saldoAntes);
    expect(await ethers.provider.getTransactionCount(ana.address)).to.equal(txAntes);
  });

  it("fuera de la cadena, verifyTypedData recupera a quien firmó", async () => {
    const { c, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const v = mensaje(ana, ahora);
    const firma = await ana.signTypedData(dominio, TIPOS, v);
    expect(ethers.verifyTypedData(dominio, TIPOS, v, firma)).to.equal(ana.address);
    // y el contrato llega a la misma conclusión, con una lectura gratuita
    expect(await c.firmante(v.estudiante, v.sesion, v.nonce, v.vence, firma)).to.equal(ana.address);
  });

  it("el docente envía la firma de Ana: se registra la asistencia de Ana y emite el evento", async () => {
    const { c, docente, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const v = mensaje(ana, ahora);
    const firma = await ana.signTypedData(dominio, TIPOS, v);
    await expect(c.connect(docente).registrar(v.estudiante, v.sesion, v.nonce, v.vence, firma))
      .to.emit(c, "AsistenciaRegistrada")
      .withArgs(ana.address, 13n, docente.address, 0n);
    expect(await c.asistio(13n, ana.address)).to.equal(true);
    expect(await c.nonces(ana.address)).to.equal(1n);
  });

  it("quien paga el gas es quien envía (el docente), no quien firma (Ana)", async () => {
    const { c, docente, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const v = mensaje(ana, ahora);
    const firma = await ana.signTypedData(dominio, TIPOS, v);
    const saldoAna = await ethers.provider.getBalance(ana.address);
    const tx = await c.connect(docente).registrar(v.estudiante, v.sesion, v.nonce, v.vence, firma);
    const recibo = await tx.wait();
    expect(recibo.from).to.equal(docente.address);
    expect(await ethers.provider.getBalance(ana.address)).to.equal(saldoAna);
  });

  it("dos firmas seguidas de Ana, con nonce 0 y luego 1, registran dos sesiones", async () => {
    const { c, docente, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const v0 = mensaje(ana, ahora);
    const v1 = mensaje(ana, ahora, { sesion: 14n, nonce: 1n });
    const f0 = await ana.signTypedData(dominio, TIPOS, v0);
    const f1 = await ana.signTypedData(dominio, TIPOS, v1);
    await c.connect(docente).registrar(v0.estudiante, v0.sesion, v0.nonce, v0.vence, f0);
    await c.connect(docente).registrar(v1.estudiante, v1.sesion, v1.nonce, v1.vence, f1);
    expect(await c.asistio(13n, ana.address)).to.equal(true);
    expect(await c.asistio(14n, ana.address)).to.equal(true);
  });

  it("los eventos se leen después con queryFilter (la indexación ligera de la sesión)", async () => {
    const { c, docente, ana, beto, dominio, ahora } = await loadFixture(desplegarAsistencia);
    for (const quien of [ana, beto]) {
      const v = mensaje(quien, ahora);
      const f = await quien.signTypedData(dominio, TIPOS, v);
      await c.connect(docente).registrar(v.estudiante, v.sesion, v.nonce, v.vence, f);
    }
    const todos = await c.queryFilter(c.filters.AsistenciaRegistrada(), 0, "latest");
    expect(todos.map(e => e.args.estudiante)).to.deep.equal([ana.address, beto.address]);
    const soloBeto = await c.queryFilter(c.filters.AsistenciaRegistrada(beto.address), 0, "latest");
    expect(soloBeto.length).to.equal(1);
  });
});

describe("S13 · AsistenciaFirmada · ataques que debe resistir", () => {
  it("★ firma de otro: Beto no puede marcar la asistencia de Ana", async () => {
    const { c, beto, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const v = mensaje(ana, ahora);                        // dice «Ana»…
    const firma = await beto.signTypedData(dominio, TIPOS, v);   // …pero firma Beto
    await expect(c.registrar(v.estudiante, v.sesion, v.nonce, v.vence, firma))
      .to.be.revertedWithCustomError(c, "FirmaInvalida")
      .withArgs(beto.address, ana.address);
  });

  it("★ mensaje alterado: cambiar la sesión después de firmar invalida la firma", async () => {
    const { c, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const v = mensaje(ana, ahora);
    const firma = await ana.signTypedData(dominio, TIPOS, v);
    await expect(c.registrar(v.estudiante, 99n, v.nonce, v.vence, firma))
      .to.be.revertedWithCustomError(c, "FirmaInvalida");
  });

  it("★ firma vencida: pasada la fecha `vence`, se rechaza", async () => {
    const { c, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const v = mensaje(ana, ahora);
    const firma = await ana.signTypedData(dominio, TIPOS, v);
    await time.increaseTo(v.vence + 1n);
    await expect(c.registrar(v.estudiante, v.sesion, v.nonce, v.vence, firma))
      .to.be.revertedWithCustomError(c, "FirmaVencida");
  });

  it("★ repetición: la misma firma no se puede usar dos veces (nonce consumido)", async () => {
    const { c, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const v = mensaje(ana, ahora);
    const firma = await ana.signTypedData(dominio, TIPOS, v);
    await c.registrar(v.estudiante, v.sesion, v.nonce, v.vence, firma);
    await expect(c.registrar(v.estudiante, v.sesion, v.nonce, v.vence, firma))
      .to.be.revertedWithCustomError(c, "InvalidAccountNonce")
      .withArgs(ana.address, 1n);
  });

  it("★ nonce adelantado: una firma con nonce 5 no sirve si el siguiente es 0", async () => {
    const { c, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const v = mensaje(ana, ahora, { nonce: 5n });
    const firma = await ana.signTypedData(dominio, TIPOS, v);
    await expect(c.registrar(v.estudiante, v.sesion, v.nonce, v.vence, firma))
      .to.be.revertedWithCustomError(c, "InvalidAccountNonce")
      .withArgs(ana.address, 0n);
  });

  it("★ dominio de otra cadena: una firma hecha para Sepolia no sirve en esta red", async () => {
    const { c, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const v = mensaje(ana, ahora);
    const firma = await ana.signTypedData({ ...dominio, chainId: 11155111n }, TIPOS, v);
    await expect(c.registrar(v.estudiante, v.sesion, v.nonce, v.vence, firma))
      .to.be.revertedWithCustomError(c, "FirmaInvalida");
  });

  it("★ dominio de otro contrato: una firma para otra copia del contrato no sirve aquí", async () => {
    const { c, ana, dominio, ahora } = await loadFixture(desplegarAsistencia);
    const otro = await ethers.deployContract("AsistenciaFirmada");
    const v = mensaje(ana, ahora);
    const firma = await ana.signTypedData({ ...dominio, verifyingContract: await otro.getAddress() }, TIPOS, v);
    await expect(c.registrar(v.estudiante, v.sesion, v.nonce, v.vence, firma))
      .to.be.revertedWithCustomError(c, "FirmaInvalida");
    // en cambio, en el contrato para el que se firmó, sí sirve
    await expect(otro.registrar(v.estudiante, v.sesion, v.nonce, v.vence, firma))
      .to.emit(otro, "AsistenciaRegistrada");
  });

  it("★ una firma mal formada se rechaza con el error de ECDSA", async () => {
    const { c, ana, ahora } = await loadFixture(desplegarAsistencia);
    const v = mensaje(ana, ahora);
    await expect(c.registrar(v.estudiante, v.sesion, v.nonce, v.vence, "0x1234"))
      .to.be.revertedWithCustomError(c, "ECDSAInvalidSignatureLength");
  });
});
