/**
 * Laboratorio · Árbol de Merkle — IMPLEMENTACIÓN COMPLETA
 * Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín
 *
 * Este es el código que recorremos en clase. Para comprobarlo:
 *
 *     node --test
 */

import { createHash } from "node:crypto";

/* =====================================================================
   CONVENCIONES DEL LABORATORIO
     1. Las HOJAS son hashHex(dato). Se hashea el dato, no se mete crudo.
     2. Al combinar dos nodos se concatenan sus BYTES, no sus cadenas
        hexadecimales.  ->  Buffer.from(hex, "hex")
     3. Si un nivel tiene un número IMPAR de elementos, se DUPLICA el
        último para completar el par.
   ===================================================================== */

export function hashHex(dato) {
  const buf = typeof dato === "string" ? Buffer.from(dato, "utf8") : dato;
  return createHash("sha256").update(buf).digest("hex");
}

/**
 * Bits que difieren entre dos hashes hexadecimales.
 * 256 bits no caben en un Number, así que se usa BigInt.
 */
export function bitsDistintos(hashA, hashB) {
  let x = BigInt("0x" + hashA) ^ BigInt("0x" + hashB);
  let n = 0;
  while (x > 0n) {
    if (x & 1n) n++;
    x >>= 1n;
  }
  return n;
}

function combinar(izquierdo, derecho) {
  return createHash("sha256")
    .update(Buffer.concat([Buffer.from(izquierdo, "hex"), Buffer.from(derecho, "hex")]))
    .digest("hex");
}

/**
 * Devuelve TODOS los niveles, de abajo arriba y ya rellenados.
 * niveles[0] = hojas hasheadas · niveles.at(-1) = [raíz]
 */
export function construirArbol(hojas) {
  if (!Array.isArray(hojas) || hojas.length === 0) {
    throw new Error("El conjunto no puede estar vacío");
  }
  let nivel = hojas.map(hashHex);
  const niveles = [];

  for (;;) {
    if (nivel.length > 1 && nivel.length % 2 === 1) {
      nivel = [...nivel, nivel[nivel.length - 1]];      // convención 3
    }
    niveles.push(nivel);
    if (nivel.length === 1) return niveles;

    const siguiente = [];
    for (let i = 0; i < nivel.length; i += 2) {
      siguiente.push(combinar(nivel[i], nivel[i + 1]));
    }
    nivel = siguiente;
  }
}

export function raizDeMerkle(hojas) {
  return construirArbol(hojas).at(-1)[0];
}

/**
 * Prueba de inclusión: lista de { hash, lado } con lado "izq" | "der".
 * Guardar el lado es imprescindible.
 */
export function generarPrueba(hojas, indice) {
  if (!(indice >= 0 && indice < hojas.length)) {
    throw new RangeError("Índice fuera del conjunto");
  }
  const niveles = construirArbol(hojas);
  const prueba = [];
  let idx = indice;

  for (let n = 0; n < niveles.length - 1; n++) {
    const nivel = niveles[n];
    if (idx % 2 === 0) prueba.push({ hash: nivel[idx + 1], lado: "der" });
    else prueba.push({ hash: nivel[idx - 1], lado: "izq" });
    idx = Math.floor(idx / 2);
  }
  return prueba;
}

export function verificarPrueba(dato, prueba, raiz) {
  let actual = hashHex(dato);
  for (const { hash, lado } of prueba) {
    actual = lado === "izq" ? combinar(hash, actual) : combinar(actual, hash);
  }
  return actual === raiz;
}
