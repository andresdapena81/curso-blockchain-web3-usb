# Laboratorio 02 · Mini-blockchain firmada

**Blockchain y Web 3.0 · Sesión 3 · Universidad de San Buenaventura Medellín**

Construir, en unas doscientas líneas, un sistema que reúne toda la Unidad I: transacciones firmadas, agrupadas en bloques, comprometidas por un árbol de Merkle y encadenadas por hash. Y después romperlo, para ver la cascada con los propios ojos.

---

## Instalación

```bash
cd python && pip install -r requirements.txt && python -m pytest test_lab03.py -v
```

```bash
cd js && npm install && node --test
```

**No modifiques los archivos de prueba.** Son la especificación: el laboratorio termina cuando todas pasan.

---

## Qué hay que completar

| Parte | Archivo | Funciones | Minutos |
|---|---|---|---|
| 1 · Claves y firmas | `cripto` | `generar_par`, `firmar`, `verificar` | ≈ 15 |
| 2 · Dirección y checksum | `cripto` | `direccion_desde_publica`, `a_eip55`, `eip55_valido` | ≈ 12 |
| 3 · Mini-blockchain | `cadena` | `Transaccion`, `Bloque`, `cadena_valida`, `saldos` | ≈ 25 |

Vienen ya resueltos: `keccak256` —nunca se implementa criptografía a mano—, la conversión de formatos de clave en JavaScript, la serialización canónica, y `merkle` completo, que es el resultado del Laboratorio 01.

> Si tienes tu propia implementación del Laboratorio 01, **reemplaza `merkle.py` / `merkle.js` por la tuya**. Comprobar que tu código de la semana pasada encaja con el de esta es media gracia del ejercicio.

---

## Las tres convenciones

1. **La clave privada son 32 bytes; la pública, 64** — `X || Y`, **sin** el byte de prefijo de formato. Recibir 65 bytes significa que trae el prefijo, y hashearlo produce una dirección silenciosamente equivocada. Es la causa número uno de que la dirección no coincida.
2. **Se firma sobre SHA-256 del mensaje.** En JavaScript, además, con codificación cruda `r || s` (`dsaEncoding: "ieee-p1363"`), no DER.
3. **La dirección son los últimos 20 bytes** de `keccak256(pública)`.

---

## Valores de referencia

Reproducibles: la clave privada se deriva de una frase fija. **Nunca usar con fondos reales.**

```
frase          "USB Medellin 2026 · material de clase"
clave privada  7fa03ea163b89b38dfe61c7070b0894b2b5b3eee14187af429a90d17ec19fd1e
dirección      732805fbe544f6117b755512f2029e3e8b6aa135
EIP-55         0x732805FbE544F6117B755512f2029e3e8B6aa135

keccak256("")  c5d2460186f7233c…    ← si no coincide, estás usando SHA3-256
```

---

## Errores frecuentes

| Síntoma | Causa |
|---|---|
| La firma verifica en una máquina y no en otra | Serialización no determinista: campos en distinto orden. Fija el orden y hashea bytes. |
| La dirección no coincide con la de referencia | Estás hasheando la clave pública **con el prefijo** de formato. Hashea los 64 bytes de las coordenadas. |
| Todo el checksum sale en minúsculas | Estás comparando el carácter del hash como texto. Conviértelo a entero hexadecimal y compáralo con 8. |
| `keccak256("")` no empieza por `c5d2` | Estás usando SHA3-256, no Keccak. Es la trampa de la Sesión 2. |
| La cadena valida aunque se alteró un bloque | La validación lee un hash guardado en lugar de recalcularlo desde la cabecera. **Es el error conceptual más grave de este laboratorio.** |
| Todas las firmas fallan tras cambiar un campo | Correcto. Es el resultado esperado del paso 4 de la parte 3. |

---

## Entregable

- Repositorio Git con el código y **la suite de pruebas pasando**.
- Media página describiendo la salida del último paso: **qué comprobación falló primero y por qué en ese orden**.
- **Plazo:** antes del inicio de la Sesión 4.

**Trabajo autónomo.** Implementar la propagación entre dos instancias locales y resolver el conflicto quedándose con la cadena más larga. Es el anticipo de la Sesión 4.

---

## Para el docente

`python/solucion/` y `js/solucion/` traen la implementación de referencia. Para verificar:

```bash
cd python && cp solucion/*.py . && python -m pytest test_lab03.py -q
```

```bash
cd js && cp solucion/*.js . && node --test
```

Ambas suites están verificadas: **33 pruebas en Python, 31 en JavaScript**, todas pasando, y las dos reproducen los mismos valores de referencia.

Para restaurar el andamiaje después de comprobar la solución:

```bash
cp python/andamiaje/*.py python/ && cp js/andamiaje/*.js js/
```

Con el andamiaje puesto pasan solo las dos pruebas base —el vector de keccak y la derivación de la clave de referencia—, que no dependen del código del estudiante.
