/**
 * Laboratorio 14 · mini-AMM de producto constante (x · y = k)
 *
 *     npx hardhat test test/s14/PoolXYK.test.js
 *
 * El pool del ejemplo de la clase: 10 TETH y 20 000 TUSD (precio 2 000).
 * Todos los números esperados se calcularon con aritmética entera exacta,
 * la misma que usa el contrato.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture } = networkHelpers;

const E = 10n ** 18n;
const ETH_INICIAL = 10n * E;
const USD_INICIAL = 20_000n * E;

async function desplegarPool() {
  const [lp, usuario, arbitrajista, lp2] = await ethers.getSigners();
  const teth = await ethers.deployContract("TokenLab14", ["Ether de laboratorio", "TETH"]);
  const tusd = await ethers.deployContract("TokenLab14", ["Dolar de laboratorio", "TUSD"]);
  const pool = await ethers.deployContract("PoolXYK", [await teth.getAddress(), await tusd.getAddress()]);
  const dirPool = await pool.getAddress();

  for (const c of [lp, usuario, arbitrajista, lp2]) {
    await teth.acunar(c.address, 1_000n * E);
    await tusd.acunar(c.address, 1_000_000n * E);
    await teth.connect(c).approve(dirPool, ethers.MaxUint256);
    await tusd.connect(c).approve(dirPool, ethers.MaxUint256);
  }
  await pool.connect(lp).agregarLiquidez(ETH_INICIAL, USD_INICIAL);
  return { pool, teth, tusd, lp, usuario, arbitrajista, lp2 };
}

/** La misma fórmula del contrato, en JavaScript con BigInt. */
function cotizarJS(rEntrada, rSalida, monto) {
  const neta = monto * 9970n;
  return (rSalida * neta) / (rEntrada * 10_000n + neta);
}

describe("S14 · PoolXYK · liquidez", () => {
  it("el primer proveedor fija el precio: 10 TETH y 20 000 TUSD → precio 2 000", async () => {
    const { pool, lp } = await loadFixture(desplegarPool);
    expect(await pool.reservaA()).to.equal(ETH_INICIAL);
    expect(await pool.reservaB()).to.equal(USD_INICIAL);
    expect(await pool.precioSpotA()).to.equal(2_000n * E);
    // participaciones = √(10e18 · 20 000e18) = √(2·10⁴¹)
    expect(await pool.balanceOf(lp.address)).to.equal(447_213_595_499_957_939_281n);
  });

  it("un segundo proveedor recibe participaciones proporcionales y solo se le cobra la proporción", async () => {
    const { pool, tusd, lp, lp2 } = await loadFixture(desplegarPool);
    const antes = await tusd.balanceOf(lp2.address);
    // ofrece 1 TETH y hasta 5 000 TUSD: el pool solo toma 2 000 (la proporción 1:2 000)
    await pool.connect(lp2).agregarLiquidez(1n * E, 5_000n * E);
    expect(antes - (await tusd.balanceOf(lp2.address))).to.equal(2_000n * E);
    // aportó el 1/10 de lo que ya había → recibe 1/10 de las participaciones del primero
    expect(await pool.balanceOf(lp2.address)).to.equal((await pool.balanceOf(lp.address)) / 10n);
  });

  it("retirar todas las participaciones devuelve las dos reservas", async () => {
    const { pool, lp } = await loadFixture(desplegarPool);
    const p = await pool.balanceOf(lp.address);
    await expect(pool.connect(lp).quitarLiquidez(p))
      .to.emit(pool, "LiquidezRetirada")
      .withArgs(lp.address, ETH_INICIAL, USD_INICIAL, p);
    expect(await pool.totalSupply()).to.equal(0n);
  });

  it("si sobra TETH, el pool toma todo el TUSD y solo el TETH proporcional", async () => {
    const { pool, teth, lp, lp2 } = await loadFixture(desplegarPool);
    const antes = await teth.balanceOf(lp2.address);
    // ofrece 5 TETH pero solo 2 000 TUSD: el TUSD limita → toma 1 TETH
    await pool.connect(lp2).agregarLiquidez(5n * E, 2_000n * E);
    expect(antes - (await teth.balanceOf(lp2.address))).to.equal(1n * E);
    expect(await pool.balanceOf(lp2.address)).to.equal((await pool.balanceOf(lp.address)) / 10n);
  });

  it("casos borde: montos cero, pool vacío y aportes tan pequeños que no dan participaciones", async () => {
    const { pool, teth, tusd, lp } = await loadFixture(desplegarPool);
    await expect(pool.agregarLiquidez(0n, 1n)).to.be.revertedWithCustomError(pool, "MontoCero");
    await expect(pool.connect(lp).quitarLiquidez(0n)).to.be.revertedWithCustomError(pool, "MontoCero");
    // 1 wei de cada uno: la proporción da 0 TETH y 0 participaciones → se rechaza
    await expect(pool.agregarLiquidez(1n, 1n)).to.be.revertedWithCustomError(pool, "MontoCero");
    const vacio = await ethers.deployContract("PoolXYK", [await teth.getAddress(), await tusd.getAddress()]);
    await expect(vacio.precioSpotA()).to.be.revertedWithCustomError(vacio, "SinLiquidez");
    await expect(vacio.cotizar(await teth.getAddress(), E)).to.be.revertedWithCustomError(vacio, "SinLiquidez");
  });

  it("no se pueden quitar participaciones que no se tienen", async () => {
    const { pool, usuario } = await loadFixture(desplegarPool);
    await expect(pool.connect(usuario).quitarLiquidez(1n))
      .to.be.revertedWithCustomError(pool, "ERC20InsufficientBalance");
  });
});

describe("S14 · PoolXYK · intercambio y slippage", () => {
  it("el ejemplo de la lámina: 2 000 TUSD compran 0,90661… TETH (no 1)", async () => {
    const { pool, tusd } = await loadFixture(desplegarPool);
    const salida = await pool.cotizar(await tusd.getAddress(), 2_000n * E);
    expect(salida).to.equal(906_610_893_880_149_131n);
    expect(salida).to.equal(cotizarJS(USD_INICIAL, ETH_INICIAL, 2_000n * E));
  });

  it("intercambiar entrega exactamente lo cotizado y mueve el precio a ≈ 2 419", async () => {
    const { pool, teth, tusd, usuario } = await loadFixture(desplegarPool);
    const dirUsd = await tusd.getAddress();
    const cotizado = await pool.cotizar(dirUsd, 2_000n * E);
    const antes = await teth.balanceOf(usuario.address);
    await expect(pool.connect(usuario).intercambiar(dirUsd, 2_000n * E, cotizado))
      .to.emit(pool, "Intercambio")
      .withArgs(usuario.address, dirUsd, 2_000n * E, cotizado);
    expect((await teth.balanceOf(usuario.address)) - antes).to.equal(cotizado);
    const spot = await pool.precioSpotA();
    expect(spot / E).to.equal(2_419n);
  });

  it("k nunca baja: con la comisión, crece un poco en cada intercambio", async () => {
    const { pool, tusd, teth, usuario } = await loadFixture(desplegarPool);
    let k = (await pool.reservaA()) * (await pool.reservaB());
    for (const [token, monto] of [[tusd, 2_000n * E], [teth, 1n * E], [tusd, 500n * E]]) {
      await pool.connect(usuario).intercambiar(await token.getAddress(), monto, 0n);
      const kNuevo = (await pool.reservaA()) * (await pool.reservaB());
      expect(kNuevo).to.be.greaterThan(k);
      k = kNuevo;
    }
  });

  it("cuanto más grande la orden, peor el precio promedio (impacto de precio)", async () => {
    const { pool, tusd } = await loadFixture(desplegarPool);
    const dirUsd = await tusd.getAddress();
    const precioPromedio = async (usd) => (usd * E * 10_000n) / (await pool.cotizar(dirUsd, usd * E)); // en diezmilésimas
    // 2 016,01… · 2 206,01… · 3 006,01… TUSD por TETH, frente a un spot de 2 000
    expect((await precioPromedio(100n)) / 10_000n).to.equal(2_016n);
    expect((await precioPromedio(2_000n)) / 10_000n).to.equal(2_206n);
    expect((await precioPromedio(10_000n)) / 10_000n).to.equal(3_006n);
  });

  it("★ protección de slippage: si sale menos del mínimo aceptado, se revierte todo", async () => {
    const { pool, tusd, usuario } = await loadFixture(desplegarPool);
    const dirUsd = await tusd.getAddress();
    const cotizado = await pool.cotizar(dirUsd, 2_000n * E);
    // alguien se adelanta y compra antes (front-running): el precio empeora
    await pool.intercambiar(dirUsd, 5_000n * E, 0n);
    const minimo = (cotizado * 99n) / 100n;               // tolerancia del 1 %
    await expect(pool.connect(usuario).intercambiar(dirUsd, 2_000n * E, minimo))
      .to.be.revertedWithCustomError(pool, "SlippageExcedido");
  });

  it("rechaza un token que no es del pool y un monto cero", async () => {
    const { pool, tusd, usuario } = await loadFixture(desplegarPool);
    await expect(pool.cotizar(usuario.address, 1n)).to.be.revertedWithCustomError(pool, "TokenInvalido");
    await expect(pool.cotizar(await tusd.getAddress(), 0n)).to.be.revertedWithCustomError(pool, "MontoCero");
  });
});

describe("S14 · PoolXYK · proveedores de liquidez", () => {
  it("las comisiones se quedan en el pool: tras ir y volver, el LP retira más que lo aportado", async () => {
    const { pool, tusd, teth, lp, usuario } = await loadFixture(desplegarPool);
    // un usuario compra y luego vende: el precio vuelve casi al inicio, las comisiones quedan
    const recibido = await pool.cotizar(await tusd.getAddress(), 5_000n * E);
    await pool.connect(usuario).intercambiar(await tusd.getAddress(), 5_000n * E, 0n);
    await pool.connect(usuario).intercambiar(await teth.getAddress(), recibido, 0n);
    const [a, b] = await pool.connect(lp).quitarLiquidez.staticCall(await pool.balanceOf(lp.address));
    // valor a precio 2 000 de lo retirado, frente a los 40 000 TUSD aportados
    const valor = (a * 2_000n) + b;
    expect(valor).to.be.greaterThan(40_000n * E);
  });

  it("★ pérdida impermanente en cadena: si el precio se multiplica por ~4, el LP pierde ≈ 20 % frente a conservar", async () => {
    const { pool, tusd, lp, arbitrajista } = await loadFixture(desplegarPool);
    // un arbitrajista compra TETH hasta llevar el precio del pool a ≈ 8 000 (el «mercado»)
    await pool.connect(arbitrajista).intercambiar(await tusd.getAddress(), 20_000n * E, 0n);
    const precioFinal = await pool.precioSpotA();                         // ≈ 7 988 por la comisión
    const [a, b] = await pool.connect(lp).quitarLiquidez.staticCall(await pool.balanceOf(lp.address));
    const valorPool = (a * precioFinal) / E + b;                          // lo que retira el LP
    const valorConservar = (ETH_INICIAL * precioFinal) / E + USD_INICIAL; // si no hubiera hecho nada
    const perdida = Number(valorConservar - valorPool) / Number(valorConservar);

    const r = Number(precioFinal) / 2_000e18;                              // ≈ 3,99
    const formula = 1 - (2 * Math.sqrt(r)) / (1 + r);                      // la de scripts/s14/perdida-impermanente.js
    // (closeTo de chai no acepta decimales con los matchers de Hardhat: se compara a mano)
    expect(Math.abs(perdida - formula) < 0.002, `medida ${perdida} vs fórmula ${formula}`).to.equal(true);
    expect(Math.abs(perdida - 0.20) < 0.005, `medida ${perdida}`).to.equal(true);
  });
});

describe("S14 · PoolXYK · por qué el precio spot NO es un oráculo", () => {
  it("★ una sola compra grande multiplica el precio spot dentro de la misma transacción", async () => {
    const { pool, tusd, arbitrajista } = await loadFixture(desplegarPool);
    const antes = await pool.precioSpotA();
    // con un flash loan, cualquiera tiene 100 000 TUSD por unos segundos
    await pool.connect(arbitrajista).intercambiar(await tusd.getAddress(), 100_000n * E, 0n);
    const despues = await pool.precioSpotA();
    expect(despues / antes).to.be.greaterThanOrEqual(35n);   // de 2 000 a más de 70 000
    // un contrato que leyera precioSpotA() en ese momento «creería» ese precio absurdo
  });
});
