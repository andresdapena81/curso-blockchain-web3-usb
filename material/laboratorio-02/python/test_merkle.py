"""
Laboratorio 01 · Integridad verificable — SUITE DE PRUEBAS
Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín

ESTE ARCHIVO NO SE MODIFICA. Las pruebas son la especificación del
laboratorio: está terminado cuando todas pasan.

Ejecutar:  python -m pytest test_merkle.py -v
"""

import pytest
from merkle import (
    hash_hex,
    bits_distintos,
    construir_arbol,
    raiz_de_merkle,
    generar_prueba,
    verificar_prueba,
)

# Valores de referencia verificados. Si tu implementación no los reproduce,
# revisa la codificación (utf-8) y que no sobre un salto de línea.
A, B = "USB Medellin", "USB Medellín"
HASH_A = "a4bca74553f433194546f1ca04e5ac3980e9005c4ce7041f594a2b15f50ff0cc"
HASH_B = "6a26f8eaf52f416dc14ad4dfe64db2c16e17c4f4e03e1a4022062f7b9ba7a6bd"

OCHO = [f"lote-{i:03d}" for i in range(8)]
CINCO = [f"lote-{i:03d}" for i in range(5)]        # número impar de hojas


# ---------------------------------------------------------------- parte 1
class TestHash:
    def test_longitud_fija(self):
        for entrada in ["", "a", "x" * 10_000]:
            assert len(hash_hex(entrada)) == 64

    def test_determinista(self):
        assert hash_hex("misma entrada") == hash_hex("misma entrada")

    def test_valores_de_referencia(self):
        assert hash_hex(A) == HASH_A
        assert hash_hex(B) == HASH_B

    def test_acepta_bytes(self):
        assert hash_hex(b"USB Medellin") == HASH_A


class TestEfectoAvalancha:
    def test_hash_consigo_mismo_no_difiere(self):
        assert bits_distintos(HASH_A, HASH_A) == 0

    def test_valor_de_referencia(self):
        assert bits_distintos(HASH_A, HASH_B) == 134

    def test_una_tilde_cambia_cerca_de_la_mitad(self):
        d = bits_distintos(hash_hex(A), hash_hex(B))
        assert 96 < d < 160, f"Se esperaba un valor cercano a 128, se obtuvo {d}"

    def test_promedio_sobre_una_muestra(self):
        """El promedio sobre 100 pares debe acercarse mucho a 128."""
        total = 0
        for i in range(100):
            x, y = f"entrada-{i}", f"entrada-{i}!"
            total += bits_distintos(hash_hex(x), hash_hex(y))
        promedio = total / 100
        assert 120 < promedio < 136, f"Promedio fuera de rango: {promedio}"


# ---------------------------------------------------------------- parte 2
class TestArbol:
    def test_conjunto_vacio_es_error(self):
        with pytest.raises(ValueError):
            raiz_de_merkle([])

    def test_un_solo_elemento_es_su_propio_hash(self):
        assert raiz_de_merkle(["solo"]) == hash_hex("solo")

    def test_hojas_son_el_hash_del_dato(self):
        niveles = construir_arbol(OCHO)
        assert niveles[0][0] == hash_hex(OCHO[0])

    def test_devuelve_todos_los_niveles(self):
        niveles = construir_arbol(OCHO)
        assert [len(n) for n in niveles] == [8, 4, 2, 1]

    def test_niveles_con_numero_impar(self):
        """Con 5 hojas el primer nivel se rellena a 6, luego 3 -> 4, 2, 1."""
        niveles = construir_arbol(CINCO)
        assert len(niveles[0]) == 6
        assert len(niveles[-1]) == 1

    def test_raiz_determinista(self):
        assert raiz_de_merkle(OCHO) == raiz_de_merkle(OCHO)

    def test_raiz_cambia_al_alterar_un_elemento(self):
        alterado = list(OCHO)
        alterado[3] = alterado[3] + " "        # un solo espacio de más
        assert raiz_de_merkle(alterado) != raiz_de_merkle(OCHO)

    def test_el_orden_importa(self):
        assert raiz_de_merkle(OCHO) != raiz_de_merkle(list(reversed(OCHO)))


# ---------------------------------------------------------------- parte 3
class TestPruebaDeInclusion:
    def test_tamano_logaritmico(self):
        assert len(generar_prueba(OCHO, 0)) == 3          # log2(8)

    def test_verifica_todos_los_indices(self):
        raiz = raiz_de_merkle(OCHO)
        for i, dato in enumerate(OCHO):
            prueba = generar_prueba(OCHO, i)
            assert verificar_prueba(dato, prueba, raiz), f"Falló el índice {i}"

    def test_verifica_con_numero_impar_de_hojas(self):
        raiz = raiz_de_merkle(CINCO)
        for i, dato in enumerate(CINCO):
            assert verificar_prueba(dato, generar_prueba(CINCO, i), raiz)

    def test_rechaza_un_dato_ajeno(self):
        raiz = raiz_de_merkle(OCHO)
        prueba = generar_prueba(OCHO, 2)
        assert not verificar_prueba("lote-999", prueba, raiz)

    def test_rechaza_una_raiz_alterada(self):
        prueba = generar_prueba(OCHO, 2)
        raiz_falsa = hash_hex("otra cosa")
        assert not verificar_prueba(OCHO[2], prueba, raiz_falsa)

    def test_rechaza_una_prueba_de_otro_elemento(self):
        """La prueba del índice 2 no debe servir para el índice 5."""
        raiz = raiz_de_merkle(OCHO)
        prueba = generar_prueba(OCHO, 2)
        assert not verificar_prueba(OCHO[5], prueba, raiz)

    def test_el_lado_importa(self):
        """Si se ignora el lado y se concatena siempre igual, falla."""
        raiz = raiz_de_merkle(OCHO)
        prueba = generar_prueba(OCHO, 2)
        invertida = [(h, "izq" if lado == "der" else "der") for h, lado in prueba]
        assert not verificar_prueba(OCHO[2], invertida, raiz)

    def test_escala(self):
        """1024 elementos -> prueba de 10 hashes, y verifica."""
        muchos = [f"dato-{i:05d}" for i in range(1024)]
        raiz = raiz_de_merkle(muchos)
        prueba = generar_prueba(muchos, 777)
        assert len(prueba) == 10
        assert verificar_prueba(muchos[777], prueba, raiz)
