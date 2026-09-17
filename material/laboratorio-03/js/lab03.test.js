/**
 * Laboratorio 02 · Firmas y mini-blockchain — SUITE DE PRUEBAS
 * Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín
 *
 * ESTE ARCHIVO NO SE MODIFICA. Las pruebas son la especificación.
 *
 *     npm install && node --test
 */

import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { keccak256, generarPar, firmar, verificar, direccionDesdePublica, aEip55, eip55Valido } from "./cripto.js";
import { Transaccion, Bloque, bloqueGenesis, cadenaValida, saldos } from "./cadena.js";

const PUB_REF = Buffer.from(
  "edafd5fc366ffb944d605a7050235b9da3cb1ef9914652078e62a570faa3a87f" +
  "032638c917d0dea04a019a27c90b0327b7e0b7b9a981e39b9f0aaadac58bb61d", "hex");
const DIR_REF = "732805fbe544f6117b755512f2029e3e8b6aa135";
const EIP55_REF = "0x732805FbE544F6117B755512f2029e3e8B6aa135";

/* ------------------------------------------------------------------ base */
test("keccak no es sha3: vector conocido", () => {
  assert.ok(keccak256(Buffer.from("")).toString("hex").startsWith("c5d2460186f7233c"));
  assert.notEqual(keccak256(Buffer.from("")).toString("hex"),
                  createHash("sha3-256").update("").digest("hex"));
});

/* --------------------------------------------------------------- parte 1 */
test("claves: tamaños correctos", () => {
  const { privada, publica } = generarPar();
  assert.equal(privada.length, 32);
  assert.equal(publica.length, 64);
});

test("claves: dos pares son distintos", () => {
  assert.notEqual(generarPar().privada.toString("hex"), generarPar().privada.toString("hex"));
});

test("firma: una firma válida verifica", () => {
  const { privada, publica } = generarPar();
  const m = Buffer.from("Transfiero 10 lotes a Bruno", "utf8");
  assert.ok(verificar(publica, m, firmar(privada, m)));
});

test("firma: 64 bytes", () => {
  const { privada } = generarPar();
  assert.equal(firmar(privada, Buffer.from("hola")).length, 64);
});

test("firma: rechaza mensaje alterado", () => {
  const { privada, publica } = generarPar();
  const f = firmar(privada, Buffer.from("Transfiero 10 lotes a Bruno"));
  assert.equal(verificar(publica, Buffer.from("Transfiero 100 lotes a Bruno"), f), false);
});

test("firma: rechaza firma alterada", () => {
  const { privada, publica } = generarPar();
  const m = Buffer.from("mensaje");
  const f = Buffer.from(firmar(privada, m));
  f[0] ^= 0x01;
  assert.equal(verificar(publica, m, f), false);
});

test("firma: rechaza clave ajena", () => {
  const { privada } = generarPar();
  const { publica: otra } = generarPar();
  const m = Buffer.from("mensaje");
  assert.equal(verificar(otra, m, firmar(privada, m)), false);
});

test("firma: no lanza ante basura", () => {
  const { publica } = generarPar();
  assert.equal(verificar(publica, Buffer.from("x"), Buffer.from("basura")), false);
});

/* --------------------------------------------------------------- parte 2 */
test("dirección: valor de referencia", () => {
  assert.equal(direccionDesdePublica(PUB_REF), DIR_REF);
});

test("dirección: 40 caracteres", () => {
  assert.equal(direccionDesdePublica(generarPar().publica).length, 40);
});

test("dirección: rechaza clave con prefijo", () => {
  assert.throws(() => direccionDesdePublica(Buffer.concat([Buffer.from([4]), PUB_REF])));
});

test("EIP-55: valor de referencia", () => {
  assert.equal(aEip55(DIR_REF), EIP55_REF);
});

test("EIP-55: es idempotente", () => {
  assert.equal(aEip55(aEip55(DIR_REF)), EIP55_REF);
});

test("EIP-55: acepta la correcta", () => {
  assert.ok(eip55Valido(EIP55_REF));
});

test("EIP-55: rechaza una letra cambiada", () => {
  const malo = EIP55_REF.slice(0, 12) + (EIP55_REF[12] === "B" ? "b" : "B") + EIP55_REF.slice(13);
  assert.equal(eip55Valido(malo), false);
});

test("EIP-55: rechaza todo en minúsculas", () => {
  assert.equal(eip55Valido("0x" + DIR_REF), false);
});

/* --------------------------------------------------------------- parte 3 */
function cuenta() {
  const { privada, publica } = generarPar();
  return { privada, publica, dir: direccionDesdePublica(publica) };
}

function cadenaDePrueba() {
  const a = cuenta(), b = cuenta();
  const g = bloqueGenesis();
  const t1 = new Transaccion(a.dir, b.dir, 10, 0).firmarCon(a.privada, a.publica);
  const t2 = new Transaccion(a.dir, b.dir, 5, 1).firmarCon(a.privada, a.publica);
  const b1 = new Bloque(1, g.hash(), [t1, t2], 1);
  const t3 = new Transaccion(b.dir, a.dir, 3, 0).firmarCon(b.privada, b.publica);
  const b2 = new Bloque(2, b1.hash(), [t3], 2);
  return { cadena: [g, b1, b2], da: a.dir, db: b.dir };
}

test("tx: serialización determinista", () => {
  const t = new Transaccion("aa", "bb", 7, 0);
  assert.equal(t.serializar().toString(), t.serializar().toString());
});

test("tx: la firma no entra en lo firmado", () => {
  const c = cuenta();
  const t = new Transaccion(c.dir, "bb", 7, 0);
  const antes = t.serializar().toString();
  t.firmarCon(c.privada, c.publica);
  assert.equal(t.serializar().toString(), antes);
});

test("tx: firma válida", () => {
  const c = cuenta();
  assert.ok(new Transaccion(c.dir, "bb", 7, 0).firmarCon(c.privada, c.publica).firmaValida());
});

test("tx: rechaza pública que no corresponde al origen", () => {
  const c = cuenta();
  assert.throws(() => new Transaccion("origen_falso", "bb", 7, 0).firmarCon(c.privada, c.publica));
});

test("tx: sin firmar no es válida", () => {
  assert.equal(new Transaccion("aa", "bb", 7, 0).firmaValida(), false);
});

test("bloque: el hash se recalcula", () => {
  const { cadena } = cadenaDePrueba();
  const b = cadena[1];
  const antes = b.hash();
  b.transacciones[0].monto = 9999;
  assert.notEqual(b.hash(), antes);
});

test("bloque: la raíz depende de las transacciones", () => {
  const { cadena } = cadenaDePrueba();
  const b = cadena[1];
  const antes = b.raizMerkle();
  b.transacciones[0].monto = 9999;
  assert.notEqual(b.raizMerkle(), antes);
});

test("cadena: la correcta es válida", () => {
  const { cadena } = cadenaDePrueba();
  const r = cadenaValida(cadena);
  assert.ok(r.ok, r.motivo);
});

test("cadena: alterar un monto rompe primero la firma", () => {
  const { cadena } = cadenaDePrueba();
  cadena[1].transacciones[0].monto = 9999;
  const r = cadenaValida(cadena);
  assert.equal(r.ok, false);
  assert.ok(/firma/i.test(r.motivo), r.motivo);
});

test("cadena: romper el eslabón se detecta", () => {
  const { cadena } = cadenaDePrueba();
  cadena[2].hashAnterior = "0".repeat(64);
  const r = cadenaValida(cadena);
  assert.equal(r.ok, false);
  assert.ok(/eslab/i.test(r.motivo), r.motivo);
});

test("cadena: alterar la cabecera invalida los posteriores", () => {
  const { cadena } = cadenaDePrueba();
  const antes = cadena[1].hash();
  cadena[1].marcaTemporal = 999;
  assert.notEqual(cadena[1].hash(), antes);
  const r = cadenaValida(cadena);
  assert.equal(r.ok, false);
  assert.ok(/eslab/i.test(r.motivo), r.motivo);
});

test("cadena: vacía no es válida", () => {
  assert.equal(cadenaValida([]).ok, false);
});

test("saldos: aplica las transacciones", () => {
  const { cadena, da, db } = cadenaDePrueba();
  const s = saldos(cadena, { [da]: 100, [db]: 0 });
  assert.equal(s[da], 100 - 10 - 5 + 3);
  assert.equal(s[db], 10 + 5 - 3);
});

test("saldos: rechaza saldo insuficiente", () => {
  const { cadena, da, db } = cadenaDePrueba();
  assert.throws(() => saldos(cadena, { [da]: 1, [db]: 0 }));
});
