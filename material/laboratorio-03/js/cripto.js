/**
 * Laboratorio 02 · Parte 1 y 2
 * Claves, firmas, dirección y checksum EIP-55.
 * Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín
 *
 * Completa los cuerpos marcados con TODO. No modifiques lab03.test.js.
 *
 *     npm install && node --test
 */

import { createSign, createVerify, generateKeyPairSync, createPublicKey, createPrivateKey } from "node:crypto";
import pkg from "js-sha3";
const { keccak256: keccakHex } = pkg;

/* =====================================================================
   CONVENCIONES DEL LABORATORIO
     1. La privada son 32 bytes; la pública, 64 (X || Y, SIN el byte de
        prefijo de formato). Ese prefijo es la causa número uno de que
        la dirección no coincida con la de referencia.
     2. Se firma sobre SHA-256 del mensaje, con codificación CRUDA
        (r || s) en lugar de DER: dsaEncoding: "ieee-p1363".
     3. La dirección son los ÚLTIMOS 20 bytes de keccak256(pública).
   ===================================================================== */

/** Keccak-256, la variante de Ethereum. NO es SHA3-256.
 *  Ya viene resuelta: nunca se implementa criptografía a mano.
 *  Vector: keccak256(Buffer.from("")) empieza por c5d2460186f7233c. */
export function keccak256(datos) {
  return Buffer.from(keccakHex.arrayBuffer(datos));
}

/* Conversión entre los bytes crudos y el formato que espera node.
   Ya viene resuelto: es plomería, no criptografía. */
function privadaAKeyObject(privada) {
  const der = Buffer.concat([
    Buffer.from("302e0201010420", "hex"), privada,
    Buffer.from("a00706052b8104000a", "hex"),
  ]);
  return createPrivateKey({ key: der, format: "der", type: "sec1" });
}

function publicaAKeyObject(publica) {
  const der = Buffer.concat([
    Buffer.from("3056301006072a8648ce3d020106052b8104000a034200", "hex"),
    Buffer.from([0x04]), publica,
  ]);
  return createPublicKey({ key: der, format: "der", type: "spki" });
}

/* --------------------------------------------------------------- PARTE 1 */

/**
 * Genera un par de claves sobre secp256k1.
 * Devuelve { privada, publica }: Buffers de 32 y 64 bytes.
 *
 * La aleatoriedad la aporta node desde la fuente segura del sistema.
 * NUNCA se usa Math.random para esto.
 *
 * Pista: generateKeyPairSync("ec", { namedCurve: "secp256k1" }).
 * Después hay que extraer los bytes crudos del DER exportado:
 *   privada -> privateKey.export({format:"der",type:"sec1"}).subarray(7, 39)
 *   pública -> publicKey.export({format:"der",type:"spki"}).subarray(-64)
 */
export function generarPar() {
  // TODO
  throw new Error("Parte 1 · generarPar sin implementar");
}

/**
 * Firma ECDSA del mensaje. Devuelve 64 bytes: r || s.
 *
 * Pista: createSign("sha256"), .update(mensaje), .end(), y firmar con
 * { key: privadaAKeyObject(privada), dsaEncoding: "ieee-p1363" }.
 * Sin ese dsaEncoding la firma sale en DER y mide ~70 bytes variables.
 */
export function firmar(privada, mensaje) {
  // TODO
  throw new Error("Parte 1 · firmar sin implementar");
}

/**
 * ¿La firma corresponde a ese mensaje y a esa clave pública?
 *
 * Debe devolver false —NO lanzar— ante cualquier fallo: firma inválida,
 * mensaje alterado, clave equivocada o firma malformada.
 */
export function verificar(publica, mensaje, firma) {
  // TODO
  throw new Error("Parte 1 · verificar sin implementar");
}

/* --------------------------------------------------------------- PARTE 2 */

/**
 * Dirección de 20 bytes en hexadecimal, sin prefijo 0x.
 * keccak256 de los 64 bytes de la clave pública; se conservan los
 * ÚLTIMOS 20 y se descartan los 12 primeros.
 *
 * Debe lanzar un error si la clave no mide exactamente 64 bytes.
 */
export function direccionDesdePublica(publica) {
  // TODO
  throw new Error("Parte 2 · direccionDesdePublica sin implementar");
}

/**
 * Aplica el checksum de EIP-55 y devuelve la dirección con 0x.
 *
 * Se hashea la dirección EN MINÚSCULAS; después, para cada carácter,
 * si es una letra y el dígito correspondiente del hash es 8 o mayor,
 * se pone en mayúscula.
 *
 * Ojo: parseInt(h[i], 16) — el dígito del hash se lee como número
 * hexadecimal, no se compara como texto.
 *
 * Debe aceptar la dirección con o sin 0x y ser idempotente.
 */
export function aEip55(direccionHex) {
  // TODO
  throw new Error("Parte 2 · aEip55 sin implementar");
}

/**
 * ¿El patrón de mayúsculas de esta dirección es el correcto?
 * Una dirección toda en minúsculas o toda en mayúsculas se considera
 * "sin checksum" y devuelve false. También false si no mide 40.
 */
export function eip55Valido(direccion) {
  // TODO
  throw new Error("Parte 2 · eip55Valido sin implementar");
}
