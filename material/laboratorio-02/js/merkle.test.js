/**
 * Laboratorio 01 · Integridad verificable — SUITE DE PRUEBAS
 * Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín
 *
 * ESTE ARCHIVO NO SE MODIFICA. Las pruebas son la especificación:
 * el laboratorio termina cuando todas pasan.
 *
 *     node --test
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  hashHex,
  bitsDistintos,
  construirArbol,
  raizDeMerkle,
  generarPrueba,
  verificarPrueba,
} from "./merkle.js";

const A = "USB Medellin";
const B = "USB Medellín";
const HASH_A = "a4bca74553f433194546f1ca04e5ac3980e9005c4ce7041f594a2b15f50ff0cc";
const HASH_B = "6a26f8eaf52f416dc14ad4dfe64db2c16e17c4f4e03e1a4022062f7b9ba7a6bd";

const OCHO = Array.from({ length: 8 }, (_, i) => `lote-${String(i).padStart(3, "0")}`);
const CINCO = OCHO.slice(0, 5);                       // número impar de hojas

/* ------------------------------------------------------------- parte 1 */
test("hash: longitud fija de 64 caracteres", () => {
  for (const e of ["", "a", "x".repeat(10000)]) assert.equal(hashHex(e).length, 64);
});

test("hash: determinista", () => {
  assert.equal(hashHex("misma entrada"), hashHex("misma entrada"));
});

test("hash: valores de referencia", () => {
  assert.equal(hashHex(A), HASH_A);
  assert.equal(hashHex(B), HASH_B);
});

test("avalancha: un hash no difiere de sí mismo", () => {
  assert.equal(bitsDistintos(HASH_A, HASH_A), 0);
});

test("avalancha: valor de referencia", () => {
  assert.equal(bitsDistintos(HASH_A, HASH_B), 134);
});

test("avalancha: una tilde cambia cerca de la mitad", () => {
  const d = bitsDistintos(hashHex(A), hashHex(B));
  assert.ok(d > 96 && d < 160, `Se esperaba algo cercano a 128, se obtuvo ${d}`);
});

test("avalancha: promedio sobre 100 pares cercano a 128", () => {
  let total = 0;
  for (let i = 0; i < 100; i++) {
    total += bitsDistintos(hashHex(`entrada-${i}`), hashHex(`entrada-${i}!`));
  }
  const prom = total / 100;
  assert.ok(prom > 120 && prom < 136, `Promedio fuera de rango: ${prom}`);
});

/* ------------------------------------------------------------- parte 2 */
test("árbol: conjunto vacío es error", () => {
  assert.throws(() => raizDeMerkle([]), /vac/i);
});

test("árbol: un solo elemento es su propio hash", () => {
  assert.equal(raizDeMerkle(["solo"]), hashHex("solo"));
});

test("árbol: las hojas son el hash del dato", () => {
  assert.equal(construirArbol(OCHO)[0][0], hashHex(OCHO[0]));
});

test("árbol: devuelve todos los niveles", () => {
  assert.deepEqual(construirArbol(OCHO).map((n) => n.length), [8, 4, 2, 1]);
});

test("árbol: número impar de hojas se rellena", () => {
  const niveles = construirArbol(CINCO);
  assert.equal(niveles[0].length, 6);
  assert.equal(niveles.at(-1).length, 1);
});

test("árbol: raíz determinista", () => {
  assert.equal(raizDeMerkle(OCHO), raizDeMerkle(OCHO));
});

test("árbol: alterar un elemento cambia la raíz", () => {
  const alterado = [...OCHO];
  alterado[3] = alterado[3] + " ";               // un solo espacio de más
  assert.notEqual(raizDeMerkle(alterado), raizDeMerkle(OCHO));
});

test("árbol: el orden importa", () => {
  assert.notEqual(raizDeMerkle(OCHO), raizDeMerkle([...OCHO].reverse()));
});

/* ------------------------------------------------------------- parte 3 */
test("prueba: tamaño logarítmico", () => {
  assert.equal(generarPrueba(OCHO, 0).length, 3);
});

test("prueba: verifica en todos los índices", () => {
  const raiz = raizDeMerkle(OCHO);
  OCHO.forEach((dato, i) => {
    assert.ok(verificarPrueba(dato, generarPrueba(OCHO, i), raiz), `Falló el índice ${i}`);
  });
});

test("prueba: verifica con número impar de hojas", () => {
  const raiz = raizDeMerkle(CINCO);
  CINCO.forEach((dato, i) => {
    assert.ok(verificarPrueba(dato, generarPrueba(CINCO, i), raiz));
  });
});

test("prueba: rechaza un dato ajeno", () => {
  assert.equal(verificarPrueba("lote-999", generarPrueba(OCHO, 2), raizDeMerkle(OCHO)), false);
});

test("prueba: rechaza una raíz alterada", () => {
  assert.equal(verificarPrueba(OCHO[2], generarPrueba(OCHO, 2), hashHex("otra cosa")), false);
});

test("prueba: la de un elemento no sirve para otro", () => {
  assert.equal(verificarPrueba(OCHO[5], generarPrueba(OCHO, 2), raizDeMerkle(OCHO)), false);
});

test("prueba: el lado importa", () => {
  const raiz = raizDeMerkle(OCHO);
  const invertida = generarPrueba(OCHO, 2).map((p) => ({
    hash: p.hash,
    lado: p.lado === "der" ? "izq" : "der",
  }));
  assert.equal(verificarPrueba(OCHO[2], invertida, raiz), false);
});

test("prueba: escala a 1024 elementos", () => {
  const muchos = Array.from({ length: 1024 }, (_, i) => `dato-${String(i).padStart(5, "0")}`);
  const raiz = raizDeMerkle(muchos);
  const prueba = generarPrueba(muchos, 777);
  assert.equal(prueba.length, 10);
  assert.ok(verificarPrueba(muchos[777], prueba, raiz));
});
