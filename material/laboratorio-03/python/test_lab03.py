"""
Laboratorio 02 · Firmas y mini-blockchain — SUITE DE PRUEBAS
Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín

ESTE ARCHIVO NO SE MODIFICA. Las pruebas son la especificación.

    python -m pytest test_lab03.py -v
"""

import hashlib
import pytest

from cripto import (
    keccak256, generar_par, firmar, verificar,
    direccion_desde_publica, a_eip55, eip55_valido,
)
from cadena import Transaccion, Bloque, bloque_genesis, cadena_valida, saldos

# Valores de referencia. La clave privada se deriva de una frase fija,
# así que son reproducibles. NUNCA usar con fondos reales.
FRASE = "USB Medellin 2026 · material de clase"
PRIV_REF = bytes.fromhex("7fa03ea163b89b38dfe61c7070b0894b2b5b3eee14187af429a90d17ec19fd1e")
PUB_REF = bytes.fromhex(
    "edafd5fc366ffb944d605a7050235b9da3cb1ef9914652078e62a570faa3a87f"
    "032638c917d0dea04a019a27c90b0327b7e0b7b9a981e39b9f0aaadac58bb61d"
)
DIR_REF = "732805fbe544f6117b755512f2029e3e8b6aa135"
EIP55_REF = "0x732805FbE544F6117B755512f2029e3e8B6aa135"


# ---------------------------------------------------------------- base
def test_keccak_no_es_sha3():
    """Vector conocido. Si esto falla, se está usando SHA3-256."""
    assert keccak256(b"").hex().startswith("c5d2460186f7233c")
    assert keccak256(b"").hex() != hashlib.sha3_256(b"").hexdigest()


def test_frase_de_referencia_produce_la_clave():
    assert hashlib.sha256(FRASE.encode("utf-8")).digest() == PRIV_REF


# -------------------------------------------------------------- parte 1
class TestClaves:
    def test_tamanos(self):
        priv, pub = generar_par()
        assert len(priv) == 32
        assert len(pub) == 64

    def test_dos_pares_son_distintos(self):
        a, _ = generar_par()
        b, _ = generar_par()
        assert a != b, "El generador de claves no está usando azar real"


class TestFirmas:
    def test_firma_valida_verifica(self):
        priv, pub = generar_par()
        m = b"Transfiero 10 lotes a Bruno"
        assert verificar(pub, m, firmar(priv, m))

    def test_longitud_de_la_firma(self):
        priv, _ = generar_par()
        assert len(firmar(priv, b"hola")) == 64

    def test_rechaza_mensaje_alterado(self):
        priv, pub = generar_par()
        f = firmar(priv, b"Transfiero 10 lotes a Bruno")
        assert not verificar(pub, b"Transfiero 100 lotes a Bruno", f)

    def test_rechaza_firma_alterada(self):
        priv, pub = generar_par()
        m = b"mensaje"
        f = bytearray(firmar(priv, m))
        f[0] ^= 0x01                      # un solo bit
        assert not verificar(pub, m, bytes(f))

    def test_rechaza_clave_ajena(self):
        priv, _ = generar_par()
        _, otra_pub = generar_par()
        m = b"mensaje"
        assert not verificar(otra_pub, m, firmar(priv, m))

    def test_no_lanza_ante_basura(self):
        _, pub = generar_par()
        assert verificar(pub, b"x", b"basura") is False

    def test_firma_de_referencia_verifica(self):
        m = "Transfiero 10 lotes a Bruno".encode("utf-8")
        assert verificar(PUB_REF, m, firmar(PRIV_REF, m))


# -------------------------------------------------------------- parte 2
class TestDireccion:
    def test_valor_de_referencia(self):
        assert direccion_desde_publica(PUB_REF) == DIR_REF

    def test_longitud(self):
        _, pub = generar_par()
        assert len(direccion_desde_publica(pub)) == 40

    def test_rechaza_clave_con_prefijo(self):
        """65 bytes = clave con byte de formato. Debe fallar, no producir
        una dirección silenciosamente equivocada."""
        with pytest.raises(ValueError):
            direccion_desde_publica(b"\x04" + PUB_REF)


class TestEIP55:
    def test_valor_de_referencia(self):
        assert a_eip55(DIR_REF) == EIP55_REF

    def test_es_idempotente(self):
        assert a_eip55(a_eip55(DIR_REF)) == EIP55_REF

    def test_acepta_la_correcta(self):
        assert eip55_valido(EIP55_REF)

    def test_rechaza_una_letra_cambiada(self):
        malo = EIP55_REF[:12] + ("b" if EIP55_REF[12] == "B" else "B") + EIP55_REF[13:]
        assert not eip55_valido(malo)

    def test_rechaza_todo_minusculas(self):
        assert not eip55_valido("0x" + DIR_REF)


# -------------------------------------------------------------- parte 3
def _cuenta():
    priv, pub = generar_par()
    return priv, pub, direccion_desde_publica(pub)


def _cadena_de_prueba():
    pa, ua, da = _cuenta()
    pb, ub, db = _cuenta()
    g = bloque_genesis()
    t1 = Transaccion(da, db, 10, 0).firmar_con(pa, ua)
    t2 = Transaccion(da, db, 5, 1).firmar_con(pa, ua)
    b1 = Bloque(1, g.hash(), [t1, t2], marca_temporal=1)
    t3 = Transaccion(db, da, 3, 0).firmar_con(pb, ub)
    b2 = Bloque(2, b1.hash(), [t3], marca_temporal=2)
    return [g, b1, b2], da, db


class TestTransaccion:
    def test_serializacion_determinista(self):
        t = Transaccion("aa", "bb", 7, 0)
        assert t.serializar() == t.serializar()

    def test_la_firma_no_entra_en_lo_firmado(self):
        priv, pub = generar_par()
        d = direccion_desde_publica(pub)
        t = Transaccion(d, "bb", 7, 0)
        antes = t.serializar()
        t.firmar_con(priv, pub)
        assert t.serializar() == antes

    def test_firma_valida(self):
        priv, pub = generar_par()
        d = direccion_desde_publica(pub)
        assert Transaccion(d, "bb", 7, 0).firmar_con(priv, pub).firma_valida()

    def test_rechaza_publica_que_no_corresponde_al_origen(self):
        priv, pub = generar_par()
        with pytest.raises(ValueError):
            Transaccion("origen_falso", "bb", 7, 0).firmar_con(priv, pub)

    def test_sin_firmar_no_es_valida(self):
        assert not Transaccion("aa", "bb", 7, 0).firma_valida()


class TestBloque:
    def test_el_hash_se_recalcula(self):
        """Alterar el contenido DEBE cambiar el hash. Si no cambia, se
        está leyendo un hash guardado en lugar de recalcularlo."""
        cadena, _, _ = _cadena_de_prueba()
        b = cadena[1]
        antes = b.hash()
        b.transacciones[0].monto = 9999
        assert b.hash() != antes

    def test_la_raiz_depende_de_las_transacciones(self):
        cadena, _, _ = _cadena_de_prueba()
        b = cadena[1]
        antes = b.raiz_merkle()
        b.transacciones[0].monto = 9999
        assert b.raiz_merkle() != antes


class TestCadena:
    def test_cadena_correcta_es_valida(self):
        cadena, _, _ = _cadena_de_prueba()
        ok, motivo = cadena_valida(cadena)
        assert ok, motivo

    def test_alterar_un_monto_rompe_primero_la_firma(self):
        cadena, _, _ = _cadena_de_prueba()
        cadena[1].transacciones[0].monto = 9999
        ok, motivo = cadena_valida(cadena)
        assert not ok
        assert "firma" in motivo.lower()

    def test_romper_el_eslabon_se_detecta(self):
        cadena, _, _ = _cadena_de_prueba()
        cadena[2].hash_anterior = "0" * 64
        ok, motivo = cadena_valida(cadena)
        assert not ok
        assert "eslab" in motivo.lower()

    def test_alterar_un_bloque_invalida_los_posteriores(self):
        """Aunque se re-firme la transacción alterada, el eslabón del
        bloque siguiente deja de coincidir: es el efecto cascada."""
        cadena, _, _ = _cadena_de_prueba()
        b1 = cadena[1]
        antes = b1.hash()
        b1.marca_temporal = 999          # altera la cabecera, no las firmas
        assert b1.hash() != antes
        ok, motivo = cadena_valida(cadena)
        assert not ok
        assert "eslab" in motivo.lower()

    def test_cadena_vacia(self):
        ok, _ = cadena_valida([])
        assert not ok


class TestSaldos:
    def test_aplica_las_transacciones(self):
        cadena, da, db = _cadena_de_prueba()
        s = saldos(cadena, {da: 100, db: 0})
        assert s[da] == 100 - 10 - 5 + 3
        assert s[db] == 10 + 5 - 3

    def test_rechaza_saldo_insuficiente(self):
        cadena, da, db = _cadena_de_prueba()
        with pytest.raises(ValueError):
            saldos(cadena, {da: 1, db: 0})
