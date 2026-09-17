# Laboratorio 07 · Subasta con patrón de retiro

**Sesión 7 · Solidity II · en parejas · 80 minutos**

> Evidencia calificable: contrato desplegado en Sepolia + informe de decisiones de diseño.

## Qué se construye y qué se demuestra

1. **Construir** una subasta inglesa segura: pujas con incremento mínimo, patrón de retiro, cierre por tiempo, pausa de emergencia.
2. **Demostrar** que la versión ingenua (devolver el dinero al instante) puede ser congelada por un solo contrato hostil que **no roba nada**.
3. **Medir** cuánto cuesta en gas defenderse.

## Archivos

| Archivo | Rol |
|---|---|
| `contracts/s07/Subasta.sol` | Solución completa |
| `andamiaje/s07/Subasta.sol` | Versión con 6 TODO |
| `contracts/s07/ISubasta.sol` | Interfaz común |
| `contracts/s07/Porcentajes.sol` | Biblioteca de puntos básicos |
| `contracts/s07/SubastaPush.sol` | Antipatrón: no se modifica |
| `contracts/s07/SubastaPullMinima.sol` | Igual a la push salvo el patrón: comparación justa |
| `contracts/s07/PostorHostil.sol` | El atacante |
| `contracts/s07/Empaquetado.sol` | Empaquetado de storage |
| `test/s07/Subasta.test.js` | 21 pruebas |

---

## Parte 1 · Completar la subasta (45 min)

```bash
cp andamiaje/s07/Subasta.sol contracts/s07/Subasta.sol
npx hardhat test test/s07/Subasta.test.js
```

Al empezar fallan 16 de 21. Se trabaja TODO por TODO y se vuelve a correr la suite.

| TODO | Qué hacer | Se confirma con |
|---|---|---|
| 1 · `estado` | `Finalizada` si `finalizada`; `PorFinalizar` si `block.timestamp >= fin`; si no, `Abierta` | «recorre los tres estados» |
| 2 · `minimoSiguiente` | Sin postor: `pujaMinima`. Con postor: `mejorPuja + mejorPuja.aplicarBps(INCREMENTO_MINIMO_BPS)` | «exige superar la puja anterior al menos en 1 %» |
| 3 · checks de `pujar` | Cerrada por tiempo o finalizada → `SubastaCerrada`. Monto bajo → `PujaInsuficiente(minimo, msg.value)` | grupo «pujar» |
| 4 · effects de `pujar` | **Acreditar** (no enviar) la puja superada con `+=`. Actualizar mejor postor y puja. Registrar participante. Emitir evento | «al ser superado…», «acumula…», ★ pull |
| 5 · `retirar` | Leer → si cero, `NadaQueRetirar` → **poner en cero** → `call` → si falla, `EnvioFallido` → evento | grupo «retirar», prueba de pausa |
| 6 · `finalizar` | Vencida y no finalizada → marcar → acreditar al `owner()` → evento | grupo «finalizar y estado» |

Recuperar la solución en cualquier momento: `git checkout contracts/s07/Subasta.sol`.

## Parte 2 · El ataque y la medición (20 min)

```bash
npx hardhat test test/s07/Subasta.test.js --grep "postor hostil"
npx hardhat test test/s07/Subasta.test.js --grep "empaquetado"
```

Valores medidos al preparar el curso (Solidity 0.8.28, optimizador activo):

| Medición | Gas |
|---|---|
| Segunda puja · `SubastaPush` | 42 280 |
| Segunda puja · `SubastaPullMinima` | 55 350 |
| Retiro posterior · pull | 29 977 |
| Struct desordenado | 88 341 |
| Struct ordenado | 66 279 |

## Parte 3 · Desplegar en Sepolia (15 min)

1. En Remix, crear `ISubasta.sol`, `Porcentajes.sol` y `Subasta.sol` **en la misma carpeta** y pegar el contenido.
2. Compilar con 0.8.28 y optimización. Los `import` de OpenZeppelin se descargan solos.
3. *Injected Provider – MetaMask*, red Sepolia. Desplegar `Subasta` con:
   - `duracionSegundos`: `600`
   - `pujaMinima_`: `1000000000000000` (0,001 ETH)
4. Desde **dos cuentas** de la billetera del curso: pujar 0,001 ETH y luego 0,002 ETH. En Remix, el campo *Value* en la unidad correcta.
5. Esperar diez minutos. `finalizar` desde cualquier cuenta. `retirar` desde la cuenta superada y desde la dueña.
6. Verificar el código en el explorador (versión 0.8.28, optimización 200, y los tres archivos: use *Solidity Standard JSON Input* desde Remix si el formulario de un solo archivo falla con los imports).

---

## Informe · preguntas obligatorias

1. ¿Por qué la puja de 50 ETH de Beto revierte en la subasta push? Expliquen la cadena de llamadas.
2. ¿Por qué el mismo hostil no bloquea la subasta pull? ¿Quién pierde en ese caso?
3. Con las cifras de la tabla: ¿cuánto más cuesta el patrón pull en total, y quién paga la diferencia?
4. ¿Cuántas ranuras ahorra el struct ordenado y cómo lo deducen de la diferencia de gas?
5. Si alguien pone `whenNotPaused` en `retirar()`, ¿qué prueba falla y por qué existe esa prueba?
6. En `retirar()`, ¿qué pasaría si el saldo se pusiera en cero **después** del `call`?

## Evidencia

| Evidencia | Peso |
|---|---|
| Suite de 21 pruebas en verde con su versión (captura de la terminal) | 25 % |
| Contrato en Sepolia + hashes de dos pujas, la finalización y un retiro | 35 % |
| Informe con las seis respuestas | 40 % |

## Errores frecuentes

| Síntoma | Causa |
|---|---|
| El retiro «pasa» pero el saldo no cambia | El pendiente se pone en cero después del `call`, o nunca |
| Falla «acumula si es superado varias veces» | `=` en lugar de `+=` |
| `EnforcedPause` al retirar | `whenNotPaused` en `retirar()` |
| El dueño no puede retirar | `finalizar()` no acredita `mejorPuja` al `owner()` |
| No acepta la primera puja | `minimoSiguiente()` aplica el 1 % sin postor |
| Remix no encuentra `ISubasta.sol` | Archivos en carpetas distintas |
