"""
Pruebas del Laboratorio 04. No modificar.

    python -m pytest -q                # contra consenso.py (tu versión)
    set LAB04=solucion && python -m pytest -q     # contra la solución (Windows)

Los valores esperados de la parte 3 son los que Nakamoto publicó en la
sección 11 del whitepaper, copiados literalmente.
"""

import importlib
import os
import sys
from pathlib import Path

import pytest

AQUI = Path(__file__).resolve().parent
carpeta = os.environ.get("LAB04", "")
sys.path.insert(0, str(AQUI / carpeta) if carpeta else str(AQUI))
c = importlib.import_module("consenso")


# ------------------------------------------------------------ parte 1
def test_objetivo_con_cero_bits_acepta_cualquier_hash():
    assert c.objetivo_para(0) == 2 ** 256


def test_objetivo_se_divide_a_la_mitad_por_bit():
    assert c.objetivo_para(10) * 2 == c.objetivo_para(9)


def test_objetivo_rechaza_dificultad_imposible():
    with pytest.raises(ValueError):
        c.objetivo_para(257)


def test_minar_devuelve_un_nonce_que_verifica():
    r = c.minar("bloque-de-prueba|raiz=abc|", 12)
    assert c.verificar_minado("bloque-de-prueba|raiz=abc|", 12, r.nonce)
    assert int(r.hash_hex, 16) < c.objetivo_para(12)
    assert r.intentos == r.nonce + 1


def test_el_nonce_no_sirve_para_otro_encabezado():
    r = c.minar("encabezado-original|", 14)
    assert c.verificar_minado("encabezado-original|", 14, r.nonce)
    # con un encabezado distinto, el mismo nonce vale con probabilidad 1/16384
    fallos = sum(not c.verificar_minado(f"otro-{i}|", 14, r.nonce) for i in range(50))
    assert fallos >= 45


def test_mas_bits_exige_en_promedio_mas_intentos():
    filas = c.experimento_dificultad([8, 14], repeticiones=8)
    assert filas[1][1] > filas[0][1] * 8     # 2^6 = 64 veces más, con holgura enorme


# ------------------------------------------------------------ parte 2
def test_gana_el_mayor_trabajo_aunque_sea_mas_corta():
    larga = [c.Bloque(i, 10) for i in range(6)]      # 6 × 1024
    corta = [c.Bloque(i, 12) for i in range(5)]      # 5 × 4096
    assert c.elegir_cadena(larga, corta) is corta


def test_con_igual_dificultad_gana_la_mas_larga():
    a = [c.Bloque(i, 10) for i in range(4)]
    b = [c.Bloque(i, 10) for i in range(5)]
    assert c.elegir_cadena(a, b) is b


def test_en_empate_se_conserva_la_cadena_actual():
    a = [c.Bloque(i, 10) for i in range(4)]
    b = [c.Bloque(i, 10) for i in range(4)]
    assert c.elegir_cadena(a, b) is a


# ------------------------------------------------------------ parte 3
@pytest.mark.parametrize("z,esperado", [
    (0, 1.0000000), (1, 0.2045873), (2, 0.0509779), (3, 0.0131722),
    (4, 0.0034552), (5, 0.0009137), (6, 0.0002428), (10, 0.0000012),
])
def test_formula_reproduce_la_tabla_del_whitepaper_q_010(z, esperado):
    assert c.probabilidad_nakamoto(0.1, z) == pytest.approx(esperado, abs=5e-8)


@pytest.mark.parametrize("z,esperado", [
    (5, 0.1773523), (10, 0.0416605), (20, 0.0024804), (50, 0.0000006),
])
def test_formula_reproduce_la_tabla_del_whitepaper_q_030(z, esperado):
    assert c.probabilidad_nakamoto(0.3, z) == pytest.approx(esperado, abs=5e-8)


@pytest.mark.parametrize("q,z", [(0.10, 5), (0.15, 8), (0.20, 11), (0.25, 15), (0.30, 24), (0.35, 41), (0.40, 89), (0.45, 340)])
def test_confirmaciones_para_menos_de_0_1_por_ciento(q, z):
    assert c.confirmaciones_necesarias(q) == z


def test_con_mayoria_el_ataque_siempre_tiene_exito():
    assert c.probabilidad_nakamoto(0.5, 100) == 1.0
    assert c.probabilidad_nakamoto(0.6, 6) == 1.0


def test_la_simulacion_coincide_con_la_formula_exacta():
    for z in (2, 6, 10):
        teorico = c.probabilidad_exacta(0.3, z)
        estimado = c.simular_ataque(0.3, z, ensayos=40_000, semilla=11)
        assert estimado == pytest.approx(teorico, abs=0.01)


def test_el_whitepaper_subestima_el_riesgo():
    """El hallazgo del laboratorio: la aproximación de Poisson se queda corta."""
    for z in (5, 10, 15, 24):
        assert c.probabilidad_exacta(0.3, z) > c.probabilidad_nakamoto(0.3, z)
    assert c.probabilidad_exacta(0.3, 24) > 0.001          # 24 confirmaciones NO bastan
    assert c.confirmaciones_necesarias(0.3, exacta=True) == 32
    assert c.confirmaciones_necesarias(0.1, exacta=True) == 6
