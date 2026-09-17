"""
Laboratorio 04 · Minería, dificultad y el ataque del 51 %
Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín

VERSIÓN DE TRABAJO. Completa las funciones marcadas con TODO.
No modifiques el archivo de pruebas.

Tres piezas:
  1. minar()                   prueba de trabajo real con SHA-256
  2. elegir_cadena()           la regla del mayor trabajo acumulado
  3. probabilidad_nakamoto()   la fórmula de la sección 11 del whitepaper
     simular_ataque()          la misma probabilidad, estimada por Monte Carlo
"""

import hashlib
import math
import random
import time
from dataclasses import dataclass
from typing import List


# =====================================================================
# 1 · PRUEBA DE TRABAJO
# =====================================================================
@dataclass
class ResultadoMinado:
    nonce: int
    hash_hex: str
    intentos: int
    segundos: float


def objetivo_para(bits: int) -> int:
    """Un hash «gana» si, leído como entero de 256 bits, es menor que esto.

    Con `bits` de dificultad, el objetivo es 2^(256 - bits): en promedio
    hacen falta 2^bits intentos para encontrar un hash por debajo.
    """
    # TODO · objetivo_para
    raise NotImplementedError("objetivo_para")


def minar(encabezado: str, bits: int, limite: int = 50_000_000) -> ResultadoMinado:
    """Busca el primer nonce tal que sha256(encabezado + nonce) < objetivo."""
    # TODO · minar
    raise NotImplementedError("minar")


def verificar_minado(encabezado: str, bits: int, nonce: int) -> bool:
    """Verificar cuesta UN hash, sin importar cuánto costó encontrarlo."""
    # TODO · verificar_minado
    raise NotImplementedError("verificar_minado")


def experimento_dificultad(bits_lista: List[int], repeticiones: int = 5, semilla: int = 7):
    """Mina `repeticiones` bloques por cada dificultad y promedia los intentos.

    Devuelve filas (bits, intentos_promedio, intentos_esperados, segundos_promedio).
    """
    rnd = random.Random(semilla)
    filas = []
    for bits in bits_lista:
        intentos, segundos = [], []
        for _ in range(repeticiones):
            r = minar(f"bloque-{rnd.random()}-", bits)
            intentos.append(r.intentos)
            segundos.append(r.segundos)
        filas.append((bits, sum(intentos) / repeticiones, 2 ** bits, sum(segundos) / repeticiones))
    return filas


# =====================================================================
# 2 · REGLA DE ELECCIÓN DE CADENA
# =====================================================================
@dataclass
class Bloque:
    altura: int
    bits: int

    @property
    def trabajo(self) -> int:
        """Trabajo esperado para producir este bloque: 2^bits intentos."""
        return 2 ** self.bits


def trabajo_acumulado(cadena: List[Bloque]) -> int:
    # TODO · trabajo_acumulado
    raise NotImplementedError("trabajo_acumulado")


def elegir_cadena(a: List[Bloque], b: List[Bloque]) -> List[Bloque]:
    """Gana la de MÁS TRABAJO acumulado, no la más larga.

    Empate: se conserva la primera (la que el nodo ya tenía). Es lo que hace
    Bitcoin: no cambia de rama ante un empate.
    """
    # TODO · elegir_cadena
    raise NotImplementedError("elegir_cadena")


# =====================================================================
# 3 · EL ATAQUE DEL 51 %
# =====================================================================
def probabilidad_nakamoto(q: float, z: int) -> float:
    """Probabilidad de que un atacante con fracción q del cómputo alcance
    a la cadena honesta, cuando el comerciante espera z confirmaciones.

    Traducción directa del código C de la sección 11 del whitepaper:
      p      = 1 - q
      lambda = z * q / p      (bloques que el atacante mina, en promedio,
                               mientras los honestos minan z)
      P      = 1 - sum_{k=0..z} Poisson(k; lambda) * (1 - (q/p)^(z-k))
    """
    # TODO · probabilidad_nakamoto
    raise NotImplementedError("probabilidad_nakamoto")


def probabilidad_exacta(q: float, z: int) -> float:
    """La misma probabilidad, SIN la aproximación de Poisson.

    Nakamoto supuso que, mientras los honestos minan z bloques, el atacante
    mina una cantidad con distribución de Poisson. En realidad sigue una
    binomial negativa, que tiene más varianza: a veces el atacante tiene
    mucha suerte temprano. El resultado exacto (Rosenfeld, 2014,
    «Analysis of hashrate-based double spending») es:

      P = 1 - sum_{m=0..z} C(m+z-1, m) * (p^z q^m - q^z p^m)
    """
    # TODO · probabilidad_exacta
    raise NotImplementedError("probabilidad_exacta")


def confirmaciones_necesarias(q: float, umbral: float = 0.001, maximo: int = 5000, exacta: bool = False) -> int:
    """Menor z tal que la probabilidad de éxito del atacante cae bajo el umbral."""
    f = probabilidad_exacta if exacta else probabilidad_nakamoto
    for z in range(maximo + 1):
        if f(q, z) < umbral:
            return z
    raise RuntimeError("no se alcanza el umbral: el atacante está demasiado cerca del 50 %")


def simular_ataque(q: float, z: int, ensayos: int = 20_000, semilla: int = 1, tope: int = 200) -> float:
    """Estima la misma probabilidad por simulación, bloque a bloque.

    Fase 1: se minan bloques hasta que los honestos llevan z; el atacante
            lleva k en secreto.
    Fase 2: el déficit d = z - k evoluciona como un paseo aleatorio: baja 1
            con probabilidad q (bloque del atacante), sube 1 con p. El
            ataque tiene éxito si el déficit llega a 0. Si supera `tope`,
            se da por perdido (la probabilidad de volver es despreciable).
    """
    # TODO · simular_ataque
    raise NotImplementedError("simular_ataque")


if __name__ == "__main__":
    print("PARTE 1 · dificultad frente a intentos")
    print(f"{'bits':>5} {'intentos prom.':>16} {'esperados 2^bits':>18} {'segundos':>10}")
    for bits, intentos, esperados, seg in experimento_dificultad([8, 12, 16, 18]):
        print(f"{bits:>5} {intentos:>16,.0f} {esperados:>18,} {seg:>10.4f}")

    print("\nPARTE 3 · whitepaper, fórmula exacta y simulación (q = 0,30)")
    for z in (0, 5, 10, 15):
        print(f"  z={z:>2}  nakamoto={probabilidad_nakamoto(0.3, z):.4f}  "
              f"exacta={probabilidad_exacta(0.3, z):.4f}  simulación={simular_ataque(0.3, z, 20_000):.4f}")

    print("\nConfirmaciones para P < 0,1 %      whitepaper   exacta")
    for q in (0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45):
        print(f"  q={q:.2f}                        {confirmaciones_necesarias(q):>6}   "
              f"{confirmaciones_necesarias(q, exacta=True):>6}")
