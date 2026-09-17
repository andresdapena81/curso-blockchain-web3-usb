"""
Laboratorio 01 · Integridad verificable — REFERENCIA DEL LABORATORIO 01
Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín

Se entrega resuelto: es el resultado del Laboratorio 01. Si tienes tu propia
implementación, reemplaza este archivo por la tuya.
"""

import hashlib
from typing import List, Tuple

# =====================================================================
# CONVENCIONES DEL LABORATORIO
# Las tres decisiones que hay que acordar para que dos implementaciones
# produzcan la misma raíz. Si una pareja obtiene una raíz distinta a la
# de otra, es casi seguro que difieren en alguna de estas tres.
#
#   1. Las HOJAS son hash_hex(dato). Se hashea el dato, no se mete crudo.
#   2. Al combinar dos nodos se concatenan sus BYTES, no sus cadenas
#      hexadecimales. De ahí el bytes.fromhex() de _combinar().
#   3. Si un nivel tiene un número IMPAR de elementos, se DUPLICA el
#      último para completar el par.
# =====================================================================


def hash_hex(dato) -> str:
    """Hash SHA-256 de `dato`, devuelto en hexadecimal (64 caracteres).

    Acepta str (se codifica en utf-8) o bytes.
    """
    if isinstance(dato, str):
        dato = dato.encode("utf-8")
    return hashlib.sha256(dato).hexdigest()


def bits_distintos(hash_a: str, hash_b: str) -> int:
    """Número de bits que difieren entre dos hashes hexadecimales.

    XOR pone a 1 exactamente los bits que difieren; basta contarlos.
    Comparar carácter a carácter NO sirve: cada carácter hex son 4 bits.
    """
    return bin(int(hash_a, 16) ^ int(hash_b, 16)).count("1")


def _combinar(izquierdo: str, derecho: str) -> str:
    """Hash del par de nodos, concatenando sus bytes (no sus cadenas hex)."""
    return hashlib.sha256(bytes.fromhex(izquierdo) + bytes.fromhex(derecho)).hexdigest()


def construir_arbol(hojas: List[str]) -> List[List[str]]:
    """Construye el árbol completo y devuelve TODOS los niveles.

    niveles[0] son las hojas ya hasheadas; niveles[-1] es [raíz].
    Se devuelven todos porque generar_prueba() los necesita.
    Los niveles se almacenan YA RELLENADOS (con el último duplicado si
    eran impares), para que la generación de pruebas use los mismos
    índices que la construcción.
    """
    if not hojas:
        raise ValueError("El conjunto no puede estar vacío")

    nivel = [hash_hex(h) for h in hojas]
    niveles: List[List[str]] = []

    while True:
        if len(nivel) > 1 and len(nivel) % 2 == 1:
            nivel = nivel + [nivel[-1]]          # convención 3
        niveles.append(nivel)
        if len(nivel) == 1:
            return niveles
        nivel = [_combinar(nivel[i], nivel[i + 1]) for i in range(0, len(nivel), 2)]


def raiz_de_merkle(hojas: List[str]) -> str:
    """Raíz de Merkle del conjunto."""
    return construir_arbol(hojas)[-1][0]


def generar_prueba(hojas: List[str], indice: int) -> List[Tuple[str, str]]:
    """Prueba de inclusión del elemento `indice`.

    Devuelve una lista de pares (hash_hermano, lado), donde lado es
    'izq' si el hermano va a la izquierda al concatenar y 'der' si va a
    la derecha. GUARDAR EL LADO ES IMPRESCINDIBLE: sin él, la
    verificación falla la mitad de las veces.
    """
    if not 0 <= indice < len(hojas):
        raise IndexError("Índice fuera del conjunto")

    niveles = construir_arbol(hojas)
    prueba: List[Tuple[str, str]] = []
    idx = indice

    for nivel in niveles[:-1]:               # todos menos el de la raíz
        if idx % 2 == 0:
            prueba.append((nivel[idx + 1], "der"))
        else:
            prueba.append((nivel[idx - 1], "izq"))
        idx //= 2

    return prueba


def verificar_prueba(dato, prueba: List[Tuple[str, str]], raiz: str) -> bool:
    """Verifica que `dato` pertenece al conjunto cuya raíz es `raiz`.

    No necesita los demás elementos, ni confiar en quien envía la prueba:
    una prueba falsa simplemente no cuadra con la raíz.
    """
    actual = hash_hex(dato)
    for hermano, lado in prueba:
        if lado == "izq":
            actual = _combinar(hermano, actual)
        else:
            actual = _combinar(actual, hermano)
    return actual == raiz


# =====================================================================
# Demostración manual:  python merkle.py
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
