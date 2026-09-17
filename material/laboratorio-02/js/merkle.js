/**
 * Laboratorio 01 · Integridad verificable
 * Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín
 *
 * Completa los cuerpos marcados con TODO. No modifiques merkle.test.js:
 * las pruebas son la especificación y el laboratorio termina cuando pasan.
 *
 *     node --test
 */

import { createHash } from "node:crypto";

/* =====================================================================
   CONVENCIONES DEL LABORATORIO — acordadas para todo el curso

     1. Las HOJAS son hashHex(dato). Se hashea el dato; no se mete crudo.
     2. Al combinar dos nodos se concatenan sus BYTES, no sus cadenas
        hexadecimales.  ->  Buffer.from(hex, "hex")
     3. Si un nivel tiene un número IMPAR de elementos, se DUPLICA el
        último para completar el par.

   Si tu raíz no coincide con la de otra pareja, la causa está casi
   siempre en una de estas tres.
   ===================================================================== */

/* --------------------------------------------------------------- PARTE 1 */

/**
 * Hash SHA-256 de `dato`, devuelto en hexadecimal (64 caracteres).
 * Debe aceptar string (codificar en utf8) y también Buffer.
 *
 * Pista: createHash("sha256").update(buf).digest("hex")
 */
export function hashHex(dato) {
  // TODO
  throw new Error("Parte 1 · hashHex sin implementar");
}

/**
 * Número de bits que difieren entre dos hashes hexadecimales.
 *
 * OJO: no compares carácter a carácter. Cada carácter hexadecimal son
 * 4 bits, así que contar caracteres distintos NO da el número de bits.
 *
 * OJO 2: 256 bits no caben en un Number de JavaScript. Usa BigInt:
 *        BigInt("0x" + hash) para convertir, ^ para XOR, y recorre los
 *        bits con & 1n y >>= 1n.
 */
export function bitsDistintos(hashA, hashB) {
  // TODO
  throw new Error("Parte 1 · bitsDistintos sin implementar");
}

/* --------------------------------------------------------------- PARTE 2 */

/**
 * Hash del par de nodos. Ya viene resuelto: fíjate en la convención 2.
 * Se concatenan los BYTES de ambos hashes, no sus cadenas de texto.
 */
function combinar(izquierdo, derecho) {
  return createHash("sha256")
    .update(Buffer.concat([Buffer.from(izquierdo, "hex"), Buffer.from(derecho, "hex")]))
    .digest("hex");
}

/**
 * Construye el árbol y devuelve TODOS los niveles, de abajo arriba.
 *
 *   niveles[0]      -> las hojas ya hasheadas
 *   niveles.at(-1)  -> [raíz]
 *
 * Devuelve todos los niveles (no solo la raíz) porque generarPrueba()
 * los necesita. Guarda cada nivel YA RELLENADO —con el último elemento
 * duplicado si eran impares—, para que los índices coincidan después.
 *
 * Debe lanzar un error cuyo mensaje mencione "vacío" si `hojas` lo está.
 *
 * Estructura sugerida:
 *   let nivel = hojas.map(hashHex)
 *   bucle:
 *     si nivel.length > 1 y es impar -> duplicar el último
 *     guardar nivel
 *     si nivel.length === 1 -> devolver
 *     nivel = combinar de dos en dos
 */
export function construirArbol(hojas) {
  // TODO
  throw new Error("Parte 2 · construirArbol sin implementar");
}

/** Raíz de Merkle del conjunto. Apóyate en construirArbol(). */
export function raizDeMerkle(hojas) {
  // TODO
  throw new Error("Parte 2 · raizDeMerkle sin implementar");
}

/* --------------------------------------------------------------- PARTE 3 */

/**
 * Prueba de inclusión del elemento en la posición `indice`.
 *
 * Devuelve un arreglo de objetos { hash, lado }, donde lado vale "izq"
 * si el hermano va a la IZQUIERDA al concatenar y "der" si va a la
 * DERECHA.
 *
 * GUARDAR EL LADO ES IMPRESCINDIBLE. Si concatenas siempre en el mismo
 * orden, la verificación falla aproximadamente la mitad de las veces:
 * es el error más común de esta parte.
 *
 * Estructura sugerida:
 *   recorrer los niveles menos el último
 *   si el índice es par  -> el hermano está a la derecha (idx + 1)
 *   si es impar          -> el hermano está a la izquierda (idx - 1)
 *   subir de nivel: idx = Math.floor(idx / 2)
 */
export function generarPrueba(hojas, indice) {
  // TODO
  throw new Error("Parte 3 · generarPrueba sin implementar");
}

/**
 * ¿Pertenece `dato` al conjunto cuya raíz de Merkle es `raiz`?
 *
 * Parte del hash del dato y combínalo sucesivamente con cada hermano,
 * RESPETANDO EL LADO. Si el valor final coincide con la raíz, el
 * elemento estaba en el conjunto.
 *
 * Debe devolver false —no lanzar error— cuando la prueba no cuadre.
 * Una verificación que solo acepta lo correcto está a medio escribir:
 * tiene que rechazar lo incorrecto.
 */
export function verificarPrueba(dato, prueba, raiz) {
  // TODO
  throw new Error("Parte 3 · verificarPrueba sin implementar");
}
