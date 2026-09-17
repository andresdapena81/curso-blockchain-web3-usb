"""
Laboratorio 01 · Integridad verificable
Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín

Completa los cuerpos marcados con TODO. No modifiques test_merkle.py:
las pruebas son la especificación y el laboratorio termina cuando pasan.

    python -m pytest test_merkle.py -v
"""

import hashlib
from typing import List, Tuple

# =====================================================================
# CONVENCIONES DEL LABORATORIO — acordadas para todo el curso
#
#   1. Las HOJAS son hash_hex(dato). Se hashea el dato; no se mete crudo.
#   2. Al combinar dos nodos se concatenan sus BYTES, no sus cadenas
#      hexadecimales.  ->  bytes.fromhex(izq) + bytes.fromhex(der)
#   3. Si un nivel tiene un número IMPAR de elementos, se DUPLICA el
#      último para completar el par.
#
# Si tu raíz no coincide con la de otra pareja, la causa está casi
# siempre en una de estas tres.
# =====================================================================


# --------------------------------------------------------------- PARTE 1
def hash_hex(dato) -> str:
    """Hash SHA-256 de `dato`, devuelto en hexadecimal (64 caracteres).

    Debe aceptar str (codificar en utf-8) y también bytes.

    Pista: hashlib.sha256(b).hexdigest()
    """
    # TODO
    raise NotImplementedError("Parte 1 · hash_hex")


def bits_distintos(hash_a: str, hash_b: str) -> int:
    """Número de bits que difieren entre dos hashes hexadecimales.

    OJO: no compares carácter a carácter. Cada carácter hexadecimal son
    4 bits, así que contar caracteres distintos NO da el número de bits.

    Pista: convierte ambos a entero con int(h, 16), aplica XOR (^) y
    cuenta los unos del resultado en binario.
    """
    # TODO
    raise NotImplementedError("Parte 1 · bits_distintos")


# --------------------------------------------------------------- PARTE 2
def _combinar(izquierdo: str, derecho: str) -> str:
    """Hash del par de nodos. Ya viene resuelto: fíjate en la convención 2.

    Concatena los BYTES de ambos hashes, no sus representaciones en texto.
    """
    return hashlib.sha256(bytes.fromhex(izquierdo) + bytes.fromhex(derecho)).hexdigest()


def construir_arbol(hojas: List[str]) -> List[List[str]]:
    """Construye el árbol y devuelve TODOS los niveles, de abajo arriba.

    niveles[0]  -> las hojas ya hasheadas
    niveles[-1] -> [raíz]

    Devuelve todos los niveles (no solo la raíz) porque generar_prueba()
    los necesita. Guarda cada nivel YA RELLENADO —con el último elemento
    duplicado si eran impares—, para que los índices coincidan después.

    Debe lanzar ValueError si `hojas` está vacío.

    Estructura sugerida:
        nivel = [hash de cada hoja]
        repetir:
            si len(nivel) > 1 y es impar: duplicar el último
            guardar nivel
            si len(nivel) == 1: terminar
            nivel = combinar los elementos de dos en dos
    """
    # TODO
    raise NotImplementedError("Parte 2 · construir_arbol")


def raiz_de_merkle(hojas: List[str]) -> str:
    """Raíz de Merkle del conjunto. Apóyate en construir_arbol()."""
    # TODO
    raise NotImplementedError("Parte 2 · raiz_de_merkle")


# --------------------------------------------------------------- PARTE 3
def generar_prueba(hojas: List[str], indice: int) -> List[Tuple[str, str]]:
    """Prueba de inclusión del elemento que ocupa la posición `indice`.

    Devuelve una lista de pares (hash_hermano, lado), donde lado vale
    'izq' si el hermano va a la IZQUIERDA al concatenar, y 'der' si va a
    la DERECHA.

    GUARDAR EL LADO ES IMPRESCINDIBLE. Si concatenas siempre en el mismo
    orden, la verificación falla aproximadamente la mitad de las veces:
    es el error más común de esta parte.

    Estructura sugerida:
        recorrer los niveles menos el último
        si el índice es par -> el hermano está a la derecha (idx + 1)
        si es impar         -> el hermano está a la izquierda (idx - 1)
        subir de nivel: idx = idx // 2
    """
    # TODO
    raise NotImplementedError("Parte 3 · generar_prueba")


def verificar_prueba(dato, prueba: List[Tuple[str, str]], raiz: str) -> bool:
    """¿Pertenece `dato` al conjunto cuya raíz de Merkle es `raiz`?

    Parte del hash del dato y combínalo sucesivamente con cada hermano,
    RESPETANDO EL LADO. Si el valor final coincide con la raíz, el
    elemento estaba en el conjunto.

    Debe devolver False —no lanzar excepción— cuando la prueba no cuadre.
    Una verificación que solo acepta lo correcto está a medio escribir:
    tiene que rechazar lo incorrecto.
    """
    # TODO
    raise NotImplementedError("Parte 3 · verificar_prueba")


# =====================================================================
# Comprobación rápida a ojo:  python merkle.py
# =====================================================================
if __name__ == "__main__":
    a, b = "USB Medellin", "USB Medellín"
    ha, hb = hash_hex(a), hash_hex(b)
    print(f"{a!r}\n  -> {ha}")
    print(f"{b!r}\n  -> {hb}")
    d = bits_distintos(ha, hb)
    print(f"\nBits distintos: {d} de 256  ({d / 256:.1%})\n")

    lotes = [f"lote-{i:03d}" for i in range(8)]
    raiz = raiz_de_merkle(lotes)
    print("Raíz de 8 elementos:", raiz)

    lotes_alterados = list(lotes)
    lotes_alterados[3] = "lote-003 "          # un solo espacio de más
    print("Raíz tras alterar uno:", raiz_de_merkle(lotes_alterados))

    prueba = generar_prueba(lotes, 2)
    print(f"\nPrueba de inclusión de {lotes[2]!r}: {len(prueba)} hashes")
    print("  ¿verifica?", verificar_prueba(lotes[2], prueba, raiz))
    print("  ¿acepta un dato ajeno?", verificar_prueba("lote-999", prueba, raiz))
