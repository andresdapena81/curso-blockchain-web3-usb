# Laboratorio 04 · Minería, dificultad y el ataque del 51 %

**Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín · Sesión 4**

> **Modalidad:** trabajo autónomo, en parejas. En la Sesión 4 el tiempo de laboratorio lo ocupa la actividad del caso Estonia; este laboratorio lleva la teoría del consenso a código y se recomienda hacerlo antes del Quiz 1 de repaso o como preparación de la Sesión 5. **No se califica.**

---

## Qué van a construir

Tres piezas pequeñas que convierten en código tres láminas de la sesión:

| Parte | Función | Lámina |
|---|---|---|
| 1 · Prueba de trabajo | `objetivo_para`, `minar`, `verificar_minado` | A.5 y A.6 |
| 2 · Elección de cadena | `trabajo_acumulado`, `elegir_cadena` | A.7 |
| 3 · El ataque del 51 % | `probabilidad_nakamoto`, `simular_ataque`, `probabilidad_exacta` | A.9 |

Y un hallazgo que no se esperan: **la tabla del whitepaper de Bitcoin subestima el riesgo**. Lo van a demostrar ustedes.

## Requisitos

- Python 3.10 o superior.
- `pytest`: `python -m pip install pytest`

Nada más. No usa red, ni billetera, ni dependencias criptográficas externas: solo `hashlib` de la biblioteca estándar.

## Estructura

```
laboratorio-04/
├── consenso.py          ← AQUÍ se trabaja: funciones con TODO
├── test_consenso.py     ← las pruebas; no se modifica
├── andamiaje/           ← copia intacta de consenso.py, por si hay que empezar de cero
└── solucion/            ← la solución de referencia (el docente decide cuándo se publica)
```

Para empezar de cero en cualquier momento:

```bash
cp andamiaje/consenso.py consenso.py
```

## Cómo se corre

```bash
python -m pytest -q
```

Al principio fallan las 32. El laboratorio está terminado cuando pasan todas. Conviene ir por partes:

```bash
python -m pytest -q -k "objetivo or minar or nonce or bits"      # parte 1
python -m pytest -q -k "gana or empate"                          # parte 2
python -m pytest -q -k "formula or confirmaciones or mayoria"    # parte 3a
python -m pytest -q -k "simulacion or subestima"                 # parte 3b
```

Y cuando todo pase, el experimento completo:

```bash
python consenso.py
```

---

## Parte 1 · Prueba de trabajo

Un bloque es válido si `sha256(encabezado + nonce)`, leído como entero de 256 bits, es **menor que un objetivo**. Con `bits` de dificultad, el objetivo es `2^(256 - bits)`.

**Pistas**

- `int(hash_hexadecimal, 16)` convierte el hash en un entero comparable.
- `minar` prueba `nonce = 0, 1, 2, …` y devuelve el **primero** que cumple. `intentos` es `nonce + 1`.
- `verificar_minado` calcula **un solo** hash. Esa asimetría es toda la idea.

**Pregunta para el informe:** corran `experimento_dificultad([8, 12, 16, 18, 20])`. ¿Cuánto aumenta el tiempo por cada bit extra? ¿Cuántos bits harían falta para que su computador tardara diez minutos?

## Parte 2 · Elección de cadena

`trabajo_acumulado` suma `2^bits` de cada bloque. `elegir_cadena` devuelve la de **más trabajo**, y ante un empate **conserva la primera**.

**Pregunta para el informe:** ¿por qué un nodo no cambia de cadena ante un empate? Piensen qué pasaría en la red si todos cambiaran cada vez que ven una rama igual de pesada.

## Parte 3 · El ataque del 51 %

### 3a · La fórmula del whitepaper

La sección 11 del whitepaper trae un programa en C. Tradúzcanlo a Python en `probabilidad_nakamoto`. El docstring tiene la fórmula completa.

Las pruebas comparan su resultado con **los números que Nakamoto publicó**, copiados literalmente de la página 8. Si pasan, su traducción es exacta.

### 3b · La simulación

`simular_ataque` no usa ninguna fórmula: simula la carrera bloque a bloque, miles de veces, y cuenta cuántas veces gana el atacante. El docstring describe las dos fases.

Y aquí viene la sorpresa. **La simulación no coincide con el whitepaper.** Sale sistemáticamente más alta.

### 3c · Por qué

Nakamoto supuso que, mientras los honestos minan `z` bloques, el atacante mina una cantidad con **distribución de Poisson**. Es una aproximación. La cantidad real sigue una **binomial negativa**, que tiene más varianza: a veces el atacante tiene mucha suerte al principio, y esos casos son los que la aproximación subestima.

El cálculo exacto lo publicó Meni Rosenfeld en 2014. Impleméntenlo en `probabilidad_exacta` y comprueben que **la simulación coincide con la fórmula exacta**, no con la del whitepaper.

| Atacante | Whitepaper (Poisson) | Exacta (Rosenfeld) |
|---|---|---|
| 10 % | 5 confirmaciones | **6** |
| 20 % | 11 | **13** |
| 30 % | 24 | **32** |
| 40 % | 89 | **133** |

*Confirmaciones necesarias para que la probabilidad de éxito del atacante baje de 0,1 %.*

**Pregunta para el informe:** ¿esto significa que Bitcoin es inseguro? Respondan con cuidado — es la misma trampa de la actividad de Estonia: encontrar un error en un documento no es lo mismo que demostrar que el sistema falla. ¿Qué cambia en la práctica, y para quién?

---

## Errores frecuentes

| Síntoma | Causa probable |
|---|---|
| `minar` nunca termina | Comparan el hash como texto en vez de como entero. |
| La prueba de la tabla falla por muy poco | Olvidaron que el sumatorio incluye `k = z`: es `range(z + 1)`. |
| La simulación da siempre 1,0 | El paseo aleatorio no tiene condición de salida por abajo del tope, o el signo del paso está invertido. |
| `OverflowError` en `probabilidad_exacta` con `q` alto | `math.comb` crece demasiado. Calculen en espacio logarítmico con `math.lgamma`. |
| La simulación coincide con Nakamoto | Están generando los bloques del atacante con Poisson en lugar de bloque a bloque. |

## Referencias

- Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*, sección 11. https://bitcoin.org/bitcoin.pdf
- Rosenfeld, M. (2014). *Analysis of hashrate-based double spending*. arXiv:1402.2009. https://arxiv.org/abs/1402.2009
- Grunspan, C. y Pérez-Marco, R. (2017). *Double spend races*. arXiv:1702.02867. https://arxiv.org/abs/1702.02867
