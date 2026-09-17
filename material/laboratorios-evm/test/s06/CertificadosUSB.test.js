/**
 * Laboratorio 06 · Registro de certificados académicos
 *
 *     npx hardhat test test/s06/CertificadosUSB.test.js
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

const PROGRAMA = "Ingenieria de Sistemas";
const hashDe = (texto) => ethers.keccak256(ethers.toUtf8Bytes(texto));
const DIPLOMA = hashDe("diploma-2026-0001.pdf · contenido del archivo");
const OTRO = hashDe("diploma-2026-0002.pdf · contenido del archivo");

async function desplegar() {
  const [oficina, estudiante, empresa, nuevaOficina] = await ethers.getSigners();
  const c = await ethers.deployContract("CertificadosUSB");
  return { c, oficina, estudiante, empresa, nuevaOficina };
}

describe("S06 · CertificadosUSB · despliegue", () => {
  it("quien despliega queda como emisor", async () => {
    const { c, oficina } = await networkHelpers.loadFixture(desplegar);
    expect(await c.emisor()).to.equal(oficina.address);
    expect(await c.emitidos()).to.equal(0n);
  });
});

describe("S06 · CertificadosUSB · emitir", () => {
  it("emite, cuenta y registra la fecha del bloque", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    await c.emitir(DIPLOMA, PROGRAMA);
    const [valido, programa, fecha, revocado] = await c.verificar(DIPLOMA);
    expect(valido).to.equal(true);
    expect(programa).to.equal(PROGRAMA);
    expect(fecha).to.equal(BigInt(await networkHelpers.time.latest()));
    expect(revocado).to.equal(false);
    expect(await c.emitidos()).to.equal(1n);
  });

  it("emite el evento con el hash indexado", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    await expect(c.emitir(DIPLOMA, PROGRAMA)).to.emit(c, "CertificadoEmitido");
  });

  it("solo el emisor puede emitir", async () => {
    const { c, estudiante } = await networkHelpers.loadFixture(desplegar);
    await expect(c.connect(estudiante).emitir(DIPLOMA, PROGRAMA))
      .to.be.revertedWithCustomError(c, "NoEsEmisor").withArgs(estudiante.address);
  });

  it("no se puede emitir dos veces el mismo documento", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    await c.emitir(DIPLOMA, PROGRAMA);
    await expect(c.emitir(DIPLOMA, PROGRAMA)).to.be.revertedWithCustomError(c, "YaEmitido");
  });

  it("rechaza un hash vacío", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    await expect(c.emitir(ethers.ZeroHash, PROGRAMA)).to.be.revertedWithCustomError(c, "HashVacio");
  });

  it("rechaza un programa vacío", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    await expect(c.emitir(DIPLOMA, "")).to.be.revertedWithCustomError(c, "ProgramaVacio");
  });
});

describe("S06 · CertificadosUSB · verificar", () => {
  it("un documento nunca emitido no es válido", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    const [valido, , fecha] = await c.verificar(OTRO);
    expect(valido).to.equal(false);
    expect(fecha).to.equal(0n);
  });

  it("cambiar un solo byte del documento invalida la verificación", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    await c.emitir(DIPLOMA, PROGRAMA);
    const alterado = hashDe("diploma-2026-0001.pdf · contenido del archivo.");
    const [valido] = await c.verificar(alterado);
    expect(valido).to.equal(false);
  });

  it("verificar no cuesta nada a quien consulta: es una función view", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    const fragmento = c.interface.getFunction("verificar");
    expect(fragmento.stateMutability).to.equal("view");
  });
});

describe("S06 · CertificadosUSB · revocar", () => {
  it("revoca y deja constancia: existe pero ya no es válido", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    await c.emitir(DIPLOMA, PROGRAMA);
    await expect(c.revocar(DIPLOMA, "Error en la fecha de grado"))
      .to.emit(c, "CertificadoRevocado").withArgs(DIPLOMA, "Error en la fecha de grado");
    const [valido, programa, , revocado] = await c.verificar(DIPLOMA);
    expect(valido).to.equal(false);
    expect(revocado).to.equal(true);
    expect(programa).to.equal(PROGRAMA);
  });

  it("no se revoca lo que no existe", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    await expect(c.revocar(OTRO, "x")).to.be.revertedWithCustomError(c, "NoExiste");
  });

  it("no se revoca dos veces", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    await c.emitir(DIPLOMA, PROGRAMA);
    await c.revocar(DIPLOMA, "motivo");
    await expect(c.revocar(DIPLOMA, "motivo")).to.be.revertedWithCustomError(c, "YaRevocado");
  });

  it("un certificado revocado no se puede volver a emitir con el mismo hash", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    await c.emitir(DIPLOMA, PROGRAMA);
    await c.revocar(DIPLOMA, "motivo");
    await expect(c.emitir(DIPLOMA, PROGRAMA)).to.be.revertedWithCustomError(c, "YaEmitido");
  });

  it("solo el emisor puede revocar", async () => {
    const { c, empresa } = await networkHelpers.loadFixture(desplegar);
    await c.emitir(DIPLOMA, PROGRAMA);
    await expect(c.connect(empresa).revocar(DIPLOMA, "x")).to.be.revertedWithCustomError(c, "NoEsEmisor");
  });
});

describe("S06 · CertificadosUSB · cambiar emisor", () => {
  it("traspasa el rol y el anterior pierde el permiso", async () => {
    const { c, oficina, nuevaOficina } = await networkHelpers.loadFixture(desplegar);
    await expect(c.cambiarEmisor(nuevaOficina.address))
      .to.emit(c, "EmisorCambiado").withArgs(oficina.address, nuevaOficina.address);
    await expect(c.emitir(DIPLOMA, PROGRAMA)).to.be.revertedWithCustomError(c, "NoEsEmisor");
    await c.connect(nuevaOficina).emitir(DIPLOMA, PROGRAMA);
    expect(await c.emitidos()).to.equal(1n);
  });

  it("no permite traspasar a la dirección cero", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    await expect(c.cambiarEmisor(ethers.ZeroAddress)).to.be.revertedWithCustomError(c, "DireccionCero");
  });
});

describe("S06 · CertificadosUSB · privacidad", () => {
  it("el registro no guarda ningún texto que identifique al titular", async () => {
    const { c } = await networkHelpers.loadFixture(desplegar);
    const abi = JSON.stringify(c.interface.fragments.map(f => f.format("full")));
    for (const prohibido of ["nombre", "titular", "cedula", "documentoIdentidad"]) {
      expect(abi.toLowerCase()).to.not.include(prohibido.toLowerCase());
    }
  });
});
