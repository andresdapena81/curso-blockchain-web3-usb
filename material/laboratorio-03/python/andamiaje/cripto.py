"""
Laboratorio 02 · Parte 1 y 2
Claves, firmas, dirección y checksum EIP-55.
Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín

Completa los cuerpos marcados con TODO. No modifiques test_lab03.py.

    pip install -r requirements.txt
    python -m pytest test_lab03.py -v
"""

import hashlib
from typing import Tuple

from ecdsa import SigningKey, VerifyingKey, SECP256k1, BadSignatureError
from Crypto.Hash import keccak


# =====================================================================
# CONVENCIONES DEL LABORATORIO
#   1. La clave privada son 32 bytes; la pública, 64 (X || Y, SIN el
#      byte de prefijo de formato). Ese prefijo es la causa número uno
#      de que la dirección no coincida con la de referencia.
#   2. Se firma sobre el hash SHA-256 del mensaje.
#   3. La dirección son los ÚLTIMOS 20 bytes de keccak256(pública).
# =====================================================================


def keccak256(datos: bytes) -> bytes:
    """Keccak-256, la variante que usa Ethereum. NO es SHA3-256.

    Ya viene resuelta: nunca se implementa criptografía a mano.
    Vector de comprobación: keccak256(b"") empieza por c5d2460186f7233c.
    """
    h = keccak.new(digest_bits=256)
    h.update(datos)
    return h.digest()


# --------------------------------------------------------------- PARTE 1
def generar_par() -> Tuple[bytes, bytes]:
    """Genera un par de claves sobre secp256k1.

    Devuelve (privada, publica): 32 y 64 bytes respectivamente.

    La aleatoriedad la aporta la biblioteca desde la fuente segura del
    sistema operativo. NUNCA se usa el generador de azar de propósito
    general del lenguaje: ahí es donde han ocurrido los incidentes
    reales que se mencionaron en clase.

    Pista: SigningKey.generate(curve=SECP256k1), y después .to_string()
    sobre la clave y sobre .get_verifying_key().
    """
    # TODO
    raise NotImplementedError("Parte 1 · generar_par")


def firmar(privada: bytes, mensaje: bytes) -> bytes:
    """Firma ECDSA del mensaje. Devuelve 64 bytes: r || s.

    Pista: SigningKey.from_string(privada, curve=SECP256k1) y luego
    .sign(mensaje, hashfunc=hashlib.sha256)
    """
    # TODO
    raise NotImplementedError("Parte 1 · firmar")


def verificar(publica: bytes, mensaje: bytes, firma: bytes) -> bool:
    """¿La firma corresponde a ese mensaje y a esa clave pública?

    Debe devolver False —NO lanzar excepción— ante cualquier fallo:
    firma inválida, mensaje alterado, clave equivocada o firma
    malformada. Una función que solo acepta lo correcto está a medio
    escribir: tiene que rechazar lo incorrecto sin romperse.

    Pista: VerifyingKey.from_string(...).verify(...) lanza excepción
    cuando falla. Hay que capturarla.
    """
    # TODO
    raise NotImplementedError("Parte 1 · verificar")


# --------------------------------------------------------------- PARTE 2
def direccion_desde_publica(publica: bytes) -> str:
    """Dirección de 20 bytes en hexadecimal, sin prefijo 0x.

    keccak256 de los 64 bytes de la clave pública; se conservan los
    ÚLTIMOS 20 y se descartan los 12 primeros.

    Debe lanzar ValueError si la clave no mide exactamente 64 bytes:
    recibir 65 significa que trae el byte de prefijo de formato, y
    hashearlo produce una dirección silenciosamente equivocada.
    """
    # TODO
    raise NotImplementedError("Parte 2 · direccion_desde_publica")


def a_eip55(direccion_hex: str) -> str:
    """Aplica el checksum de EIP-55 y devuelve la dirección con 0x.

    Procedimiento: se hashea la dirección EN MINÚSCULAS con keccak256;
    después, para cada carácter de la dirección, si es una letra y el
    dígito correspondiente del hash es 8 o mayor, se pone en mayúscula.

    Ojo: el dígito del hash hay que leerlo como número hexadecimal
    —int(h[i], 16)—, no comparar el carácter como texto.

    Debe aceptar la dirección con o sin prefijo 0x, y ser idempotente:
    aplicarla dos veces da el mismo resultado.
    """
    # TODO
    raise NotImplementedError("Parte 2 · a_eip55")


def eip55_valido(direccion: str) -> bool:
    """¿El patrón de mayúsculas de esta dirección es el correcto?

    Una dirección toda en minúsculas o toda en mayúsculas se considera
    "sin checksum" y aquí devuelve False: solo se validan las mixtas.
    También devuelve False si no mide 40 caracteres hexadecimales.
    """
    # TODO
    raise NotImplementedError("Parte 2 · eip55_valido")
