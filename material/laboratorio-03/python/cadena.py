"""
Laboratorio 02 · Parte 3
Transacciones firmadas, bloques y validación de la cadena.
Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín

Completa los cuerpos marcados con TODO. No modifiques test_lab03.py.
"""

import hashlib
import json
from dataclasses import dataclass, field
from typing import List, Optional

from cripto import firmar, verificar, direccion_desde_publica
from merkle import raiz_de_merkle          # viene del Laboratorio 01


def sha256_hex(datos: bytes) -> str:
    return hashlib.sha256(datos).hexdigest()


# =====================================================================
# TRANSACCIÓN
# =====================================================================
@dataclass
class Transaccion:
    origen: str          # dirección hexadecimal, sin 0x
    destino: str
    monto: int
    contador: int        # el "nonce" por cuenta: impide reenviar la misma tx
    firma: Optional[bytes] = None
    publica: Optional[bytes] = None

    def serializar(self) -> bytes:
        """Representación en bytes, DETERMINISTA.

        Siempre los mismos campos en el mismo orden. Si dos nodos
        serializan distinto calculan hashes distintos y la firma no
        verifica: es el error más común de este laboratorio.

        La firma NO forma parte de lo que se firma.

        Pista: json.dumps(cuerpo, sort_keys=True, separators=(",", ":"))
        y codificar en utf-8.
        """
        # TODO
        raise NotImplementedError("Parte 3 · Transaccion.serializar")

    def hash(self) -> str:
        return sha256_hex(self.serializar())

    def firmar_con(self, privada: bytes, publica: bytes) -> "Transaccion":
        """Firma la transacción y devuelve self.

        Antes de firmar debe comprobar que la dirección derivada de la
        clave pública coincide con el campo `origen`; si no, lanzar
        ValueError. Sin esa comprobación, cualquiera podría firmar una
        transacción declarando el origen de otra persona.
        """
        # TODO
        raise NotImplementedError("Parte 3 · Transaccion.firmar_con")

    def firma_valida(self) -> bool:
        """La firma verifica Y la clave pública corresponde al origen.

        Devuelve False si falta la firma o la clave pública.
        Comprobar las dos cosas: una firma correcta hecha con la clave
        equivocada sigue siendo una transacción inválida.
        """
        # TODO
        raise NotImplementedError("Parte 3 · Transaccion.firma_valida")


# =====================================================================
# BLOQUE
# =====================================================================
@dataclass
class Bloque:
    indice: int
    hash_anterior: str
    transacciones: List[Transaccion] = field(default_factory=list)
    marca_temporal: int = 0
    nonce: int = 0

    def raiz_merkle(self) -> str:
        """Raíz de Merkle de las transacciones. REUTILIZA el Lab 01.

        Se calcula sobre la serialización de cada transacción.
        Convención del curso: un bloque sin transacciones tiene como
        raíz sha256_hex(b"").
        """
        # TODO
        raise NotImplementedError("Parte 3 · Bloque.raiz_merkle")

    def cabecera(self) -> bytes:
        """Serialización determinista de la cabecera.

        Campos: indice, hash_anterior, raiz_merkle(), marca_temporal,
        nonce. SOLO la cabecera se hashea; el cuerpo entra a través de
        la raíz de Merkle. Esa es toda la gracia de la Sesión 2.
        """
        # TODO
        raise NotImplementedError("Parte 3 · Bloque.cabecera")

    def hash(self) -> str:
        """Hash del bloque, RECALCULADO SIEMPRE desde la cabecera.

        Nunca se guarda en un atributo para leerlo después. Guardarlo
        es el error conceptual más grave de este laboratorio: la cadena
        validaría aunque se hubiera alterado su contenido.
        """
        return sha256_hex(self.cabecera())


# =====================================================================
# VALIDACIÓN
# =====================================================================
def bloque_genesis() -> Bloque:
    return Bloque(indice=0, hash_anterior="0" * 64, transacciones=[], marca_temporal=0)


def cadena_valida(cadena: List[Bloque]) -> tuple:
    """Valida la cadena completa.

    Devuelve (True, "") si es válida, o (False, motivo) con el PRIMER
    fallo encontrado. Devolver el motivo es lo que permite ver en qué
    orden se rompen las cosas al alterar un bloque — que es el objetivo
    del paso 4.

    Debe comprobar, en este orden:
      1. Que la cadena no esté vacía y que el génesis apunte a ceros.
      2. Para cada bloque, que TODAS las firmas verifiquen.
         Motivo sugerido: "firma inválida en el bloque i, transacción j"
      3. Para cada bloque salvo el génesis, que hash_anterior coincida
         con el hash REAL del bloque previo.
         Motivo sugerido: "el eslabón del bloque i no coincide…"
      4. Que los índices sean consecutivos.
    """
    # TODO
    raise NotImplementedError("Parte 3 · cadena_valida")


def saldos(cadena: List[Bloque], inicial: dict) -> dict:
    """Aplica todas las transacciones y devuelve los saldos finales.

    Lanza ValueError ante un saldo insuficiente: es la comprobación
    que impide gastar lo que no se tiene.
    """
    # TODO
    raise NotImplementedError("Parte 3 · saldos")
