/**
 * Laboratorio 02 · Parte 3
 * Transacciones firmadas, bloques y validación de la cadena.
 * Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín
 *
 * Completa los cuerpos marcados con TODO. No modifiques lab03.test.js.
 */

import { createHash } from "node:crypto";
import { firmar, verificar, direccionDesdePublica } from "./cripto.js";
import { raizDeMerkle } from "./merkle.js";          // viene del Laboratorio 01

export function sha256Hex(datos) {
  return createHash("sha256").update(datos).digest("hex");
}

/** Serialización canónica: claves ordenadas, sin espacios. Ya resuelta. */
function canonico(obj) {
  const claves = Object.keys(obj).sort();
  return "{" + claves.map((k) => JSON.stringify(k) + ":" + JSON.stringify(obj[k])).join(",") + "}";
}

/* =====================================================================
   TRANSACCIÓN
   ===================================================================== */
export class Transaccion {
  constructor(origen, destino, monto, contador) {
    this.origen = origen;
    this.destino = destino;
    this.monto = monto;
    this.contador = contador;
    this.firma = null;
    this.publica = null;
  }

  /**
   * Representación en bytes, DETERMINISTA: siempre los mismos campos
   * en el mismo orden. Si dos nodos serializan distinto calculan
   * hashes distintos y la firma no verifica.
   *
   * La firma NO forma parte de lo que se firma.
   * Pista: usa canonico({ origen, destino, monto, contador }).
   */
  serializar() {
    // TODO
    throw new Error("Parte 3 · Transaccion.serializar sin implementar");
  }

  hash() {
    return sha256Hex(this.serializar());
  }

  /**
   * Firma la transacción y devuelve this.
   * Antes de firmar debe comprobar que la dirección derivada de la
   * clave pública coincida con this.origen; si no, lanzar un error.
   * Sin esa comprobación cualquiera firmaría declarando el origen ajeno.
   */
  firmarCon(privada, publica) {
    // TODO
    throw new Error("Parte 3 · Transaccion.firmarCon sin implementar");
  }

  /**
   * La firma verifica Y la clave pública corresponde al origen.
   * Devuelve false si falta la firma o la clave pública.
   */
  firmaValida() {
    // TODO
    throw new Error("Parte 3 · Transaccion.firmaValida sin implementar");
  }
}

/* =====================================================================
   BLOQUE
   ===================================================================== */
export class Bloque {
  constructor(indice, hashAnterior, transacciones = [], marcaTemporal = 0, nonce = 0) {
    this.indice = indice;
    this.hashAnterior = hashAnterior;
    this.transacciones = transacciones;
    this.marcaTemporal = marcaTemporal;
    this.nonce = nonce;
  }

  /**
   * Raíz de Merkle de las transacciones. REUTILIZA el Laboratorio 01.
   * Se calcula sobre la serialización de cada transacción.
   * Convención: un bloque sin transacciones tiene raíz sha256Hex("").
   */
  raizMerkle() {
    // TODO
    throw new Error("Parte 3 · Bloque.raizMerkle sin implementar");
  }

  /**
   * Serialización determinista de la cabecera: indice, hashAnterior,
   * raizMerkle(), marcaTemporal, nonce.
   * SOLO la cabecera se hashea; el cuerpo entra por la raíz de Merkle.
   */
  cabecera() {
    // TODO
    throw new Error("Parte 3 · Bloque.cabecera sin implementar");
  }

  /** Hash RECALCULADO SIEMPRE desde la cabecera. Nunca se guarda.
   *  Guardarlo es el error conceptual más grave de este laboratorio. */
  hash() {
    return sha256Hex(this.cabecera());
  }
}

/* =====================================================================
   VALIDACIÓN
   ===================================================================== */
export function bloqueGenesis() {
  return new Bloque(0, "0".repeat(64), [], 0);
}

/**
 * Valida la cadena completa.
 * Devuelve { ok: true, motivo: "" } o { ok: false, motivo } con el
 * PRIMER fallo encontrado. Devolver el motivo es lo que permite ver en
 * qué orden se rompen las cosas al alterar un bloque.
 *
 * Comprobar, en este orden:
 *   1. Cadena no vacía y génesis apuntando a ceros.
 *   2. Que TODAS las firmas verifiquen.
 *      Motivo sugerido: `firma inválida en el bloque i, transacción j`
 *   3. Que hashAnterior coincida con el hash REAL del bloque previo.
 *      Motivo sugerido: `el eslabón del bloque i no coincide…`
 *   4. Que los índices sean consecutivos.
 */
export function cadenaValida(cadena) {
  // TODO
  throw new Error("Parte 3 · cadenaValida sin implementar");
}

/**
 * Aplica todas las transacciones y devuelve los saldos finales.
 * Lanza un error ante un saldo insuficiente.
 */
export function saldos(cadena, inicial) {
  // TODO
  throw new Error("Parte 3 · saldos sin implementar");
}
