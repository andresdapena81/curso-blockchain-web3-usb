# Laboratorio 06 · Registro de certificados académicos en Remix

**Sesión 6 · Solidity I · en parejas · 80 minutos**

> Evidencia calificable. Resultado: un contrato propio, verificado y usado en Sepolia.

## Qué se construye

Un registro donde la oficina de registro publica el **hash** de cada diploma. Cualquier persona que reciba el PDF de un diploma puede comprobar, sin cuenta y sin pagar, que lo emitió la universidad y que no fue revocado.

**Regla de diseño que no se negocia:** en la cadena no va el nombre, ni la cédula, ni ningún dato personal. Solo el hash del archivo. La cadena es pública e inmutable, y la Ley 1581 de 2012 da a las personas derecho a suprimir sus datos.

## Archivos

| Archivo | Para qué |
|---|---|
| `andamiaje/s06/CertificadosUSB.sol` | La versión con siete TODO. **Compila tal como está.** |
| `contracts/s06/CertificadosUSB.sol` | La solución de referencia. |
| `test/s06/CertificadosUSB.test.js` | 18 pruebas que definen el comportamiento correcto. |
| `scripts/s06/hash-documento.js` | Calcula el keccak256 de un archivo. |

---

## Paso 1 · Preparar Remix (10 min)

1. Abrir **https://remix.ethereum.org** en el navegador donde está la billetera del curso.
2. En *File Explorer*, crear `CertificadosUSB.sol` y pegar el contenido del andamiaje.
3. Pestaña *Solidity Compiler*: versión **0.8.28**, *Advanced Configurations* → **Enable optimization** con 200 ejecuciones.
4. **Compile**. Debe compilar sin errores antes de tocar nada.

## Paso 2 · Completar los TODO (40 min)

Uno a la vez. Después de cada uno: compilar → pestaña *Deploy & Run* con *Environment* en **Remix VM** → *Deploy* → probar a mano.

| TODO | Qué hacer | Prueba manual en la Remix VM |
|---|---|---|
| 1 · modificador | Si `msg.sender != emisor`, `revert NoEsEmisor(msg.sender)` | Cambiar de *Account* e intentar emitir: debe fallar |
| 2 · constructor | `emisor = msg.sender` y emitir `EmisorCambiado` | Botón `emisor`: debe mostrar la cuenta que desplegó |
| 3 · validar en emitir | Hash cero, programa vacío, ya existe | Emitir `0x000…000`: debe fallar con `HashVacio` |
| 4 · efectos de emitir | Guardar, sumar, emitir evento | Emitir un hash de prueba y consultar `emitidos` |
| 5 · revocar | `Certificado storage c`, validar, marcar, evento | Revocar dos veces: la segunda falla |
| 6 · verificar | `valido = existe && !revocado` | Verificar antes y después de revocar |
| 7 · cambiar emisor | Rechazar `address(0)`, evento, actualizar | Traspasar y comprobar que la cuenta anterior ya no emite |

Un hash de prueba para la Remix VM (cualquier valor de 32 bytes sirve):

```
0x1c3c4078e3a4d1c6f0b1fc78d1924bb9ca55d997da9fa621cc1eced16ce1b538
```

## Paso 3 · El hash del diploma de prueba

Usen un PDF **de prueba**, creado por ustedes. Nunca un diploma real ni un documento con datos personales.

```bash
node scripts/s06/hash-documento.js mi-diploma-de-prueba.pdf
```

Guarden el valor `keccak`. Después editen el PDF (una letra basta), guárdenlo y calculen de nuevo: **el hash cambia por completo**.

## Paso 4 · Desplegar en Sepolia (15 min)

1. *Deploy & Run* → *Environment*: **Injected Provider – MetaMask**. Aceptar la conexión en la billetera.
2. Confirmar que Remix muestra **Custom (11155111) network** o *Sepolia*. Si dice otra red, cambiarla en la billetera.
3. **Deploy**. En la billetera, antes de confirmar: red Sepolia, sin valor enviado, costo razonable. Confirmar.
4. Copiar la dirección del contrato desplegado (*Deployed Contracts*).
5. Llamar `emitir` con el hash del diploma de prueba y el programa. Confirmar en la billetera.
6. Llamar `verificar` con el hash original (válido) y con el alterado (no válido). Tomar captura de ambos.
7. Cambiar de cuenta en la billetera e intentar `emitir`: debe fallar. Guardar el hash de esa transacción fallida.
8. Volver a la cuenta emisora y `revocar` el diploma de prueba.

## Paso 5 · Verificar el código en el explorador (15 min)

1. **https://sepolia.etherscan.io** → pegar la dirección del contrato.
2. Pestaña *Contract* → **Verify and Publish**.
3. *Compiler Type*: Solidity (Single file). *Compiler Version*: **v0.8.28**. *License*: MIT.
4. Pegar el código completo. *Optimization*: **Yes**, 200 runs.
5. Al terminar aparece la marca verde y la pestaña **Read Contract**: llamar `verificar` desde el explorador, sin billetera.

---

## Plan B · si la sala bloquea Remix

El mismo trabajo con Hardhat, en el repositorio del curso:

```bash
cp andamiaje/s06/CertificadosUSB.sol contracts/s06/CertificadosUSB.sol
npx hardhat test test/s06/CertificadosUSB.test.js
```

Al principio fallan casi todas las pruebas. El laboratorio está completo cuando pasan las 18. Para recuperar la solución: `git checkout contracts/s06/CertificadosUSB.sol`.

El despliegue a Sepolia en este plan se hace en la Sesión 8, con script.

---

## Evidencia

| Evidencia | Detalle | Peso |
|---|---|---|
| Contrato verificado | Dirección en Sepolia con marca de verificación | 35 % |
| Tres transacciones | Hashes de una emisión, una revocación y un intento fallido desde otra cuenta | 30 % |
| Prueba de alteración | Los dos hashes y las capturas de `verificar` con cada uno | 20 % |
| Respuesta | ¿Por qué el contrato revoca en lugar de borrar? Un párrafo | 15 % |

## Errores frecuentes

| Síntoma | Causa |
|---|---|
| *Gas estimation failed* al emitir | Una validación revierte: hash cero, programa vacío o cuenta distinta del emisor |
| Remix no ve la billetera | Recargar Remix y aceptar la conexión. Mismo navegador que la billetera |
| La verificación en el explorador falla | Versión del compilador u optimización distinta a la del despliegue |
| `revocar` no cambia nada | Usaron `Certificado memory c` en lugar de `storage`: modificaron una copia |
| `verificar` dice válido para un hash nunca emitido | Olvidaron comprobar `existe` |
