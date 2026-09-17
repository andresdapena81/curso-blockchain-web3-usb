# Laboratorio 05 · Análisis forense de transacciones y medición de gas

**Sesión 5 · Ethereum y la máquina virtual · en parejas · 60 minutos**

> Evidencia calificable del primer corte. Se entrega un informe por pareja, máximo dos páginas, antes de la Sesión 6.

---

## 0 · Punto de control de billeteras (5 min)

1. Abrir la billetera creada en la Sesión 2 y desbloquearla.
2. Cambiar a **Sepolia**. Confirmar en la parte superior que **no** dice «Ethereum Mainnet».
3. Verificar que hay ETH de prueba. Si no hay, avisar al docente: se reparte desde la billetera institucional.
4. Confirmar que la frase de recuperación está en papel, fuera del computador.

**Nunca se usa esta billetera con dinero real. La frase no se comparte con nadie, tampoco con el docente.**

---

## Parte A · Análisis forense (30 min)

Explorador: **https://sepolia.etherscan.io**

Busquen tres transacciones reales, de tres tipos distintos, y llenen una tabla por cada una.

### Transacción 1 · Transferencia de ETH

Cómo encontrarla: peguen la dirección de su propia billetera en el buscador. Si recibieron ETH de prueba, ahí está.

### Transacción 2 · Transferencia de un token ERC-20

Cómo encontrarla: en el buscador escriban el nombre de un token de prueba conocido (por ejemplo, las versiones de prueba de USDC o LINK en Sepolia), entren a la página del token y abran la pestaña **Transfers**. Elijan una transferencia y ábranla.

Asegúrense de que el contrato del token esté **verificado** (marca verde en la pestaña *Contract*): si no, el *Input Data* no se decodifica.

### Transacción 3 · Una transacción que falló

Cómo encontrarla: en la página de un contrato con mucho uso, en la lista de transacciones, busquen una fila con el ícono rojo de error o con estado **Fail**.

### Hoja de trabajo · una por transacción

| Campo | Transacción ___ |
|---|---|
| Hash (con enlace) | |
| Tipo | |
| Estado (Success / Fail) | |
| From | |
| To — ¿es una persona o un contrato? | |
| Value (ETH) | |
| Gas Limit | |
| Gas Used (y % del límite) | |
| Base Fee (gwei) | |
| Max Priority Fee (gwei) | |
| Transaction Fee (ETH) | |
| Burnt Fees (ETH) | |
| Propina al validador = Fee − Burnt | |
| Selector de función (primeros 4 bytes del Input Data) | |
| Eventos en la pestaña Logs | |

### Preguntas que el informe tiene que responder

1. **Transacción 1:** ¿el gas usado es exactamente 21 000? Si no lo es, ¿qué indica eso sobre el destinatario?
2. **Transacción 2:** el campo *Value* dice 0 ETH. ¿Dónde está entonces el monto transferido? Muéstrenlo en el *Input Data* y en el evento `Transfer`. ¿El selector es `0xa9059cbb`? Si no, ¿qué función se llamó?
3. **Transacción 3:** ¿por qué falló? ¿Cuánto gas consumió? ¿Cuánto pagó el remitente a pesar del fallo?
4. **Las tres:** comprueben a mano que `Transaction Fee = Gas Used × (Base Fee + Priority Fee efectiva)`. Muestren la multiplicación.

---

## Parte B · Predecir y medir el gas (25 min)

### B.1 · Predecir, sin correr nada (10 min)

Abran `contracts/s05/Operaciones.sol` y lean cada función. Con la tabla de costos de la lámina A.15, escriban **su predicción** en la columna correspondiente. Se evalúa el razonamiento, no el acierto.

| Operación | Predicción | Medición | Diferencia | ¿Por qué? |
|---|---|---|---|---|
| Transferir ETH sin contrato | | | | |
| Desplegar el contrato | | | | |
| Escribir en una ranura vacía (0 → 42) | | | | |
| Sobrescribir una ranura ocupada (42 → 43) | | | | |
| Leer la ranura, dentro de una transacción | | | | |
| Borrar la ranura (43 → 0) | | | | |
| Emitir un evento con dos datos | | | | |
| Sumar 50 números · memory | | | | |
| Sumar 50 números · calldata | | | | |
| Primer elemento de un arreglo | | | | |
| Agregar 1 elemento más | | | | |
| Agregar 10 elementos más | | | | |

### B.2 · Medir (10 min)

En la carpeta del repositorio del curso:

```bash
npm install                                        # una sola vez en el semestre
npx hardhat test test/s05/Operaciones.test.js      # comprueba que el entorno funciona
npx hardhat run scripts/s05/medir-gas.js           # imprime la tabla de mediciones
```

Todo corre en la **red local de Hardhat**: no gasta ETH de prueba ni necesita internet después del `npm install`.

### B.3 · Comparar (5 min)

Copien las mediciones en la tabla y expliquen **las dos diferencias más grandes** entre predicción y medición.

Pistas para las explicaciones:

- La **base de 21 000** se paga en toda transacción: réstenla antes de comparar con la tabla de opcodes.
- El **primer acceso** a una ranura en una transacción cuesta 2 100 adicionales (acceso «frío»).
- **Borrar** una ranura genera un reembolso parcial.
- El **primer** elemento de un arreglo estrena también la ranura donde se guarda su largo.
- Los **argumentos** de la llamada también cuestan: 4 gas por byte cero y 16 por byte no cero.

---

## Reflexión (15 % del informe)

Un párrafo: después de hoy, ¿qué operación evitarían en un contrato real y por qué? ¿Qué harían en su lugar?

---

## Qué se entrega

| Parte | Contenido | Peso |
|---|---|---|
| A · forense | Tres hojas de trabajo con hashes verificables y las cuatro preguntas respondidas | 50 % |
| B · gas | Tabla de predicción y medición con las dos diferencias explicadas | 35 % |
| Reflexión | Un párrafo | 15 % |

**Sin hashes que abran en el explorador, la parte A no se califica.** Un hash inventado —por ejemplo, por un asistente de IA— no existe en la cadena, y eso se comprueba en diez segundos.

## Errores frecuentes

| Síntoma | Causa |
|---|---|
| El explorador no encuentra mi dirección | Están en el explorador de la red principal, no en el de Sepolia. |
| *Value: 0* en una transferencia de token | Correcto. El monto de un token viaja en *Input Data* y aparece en los logs. |
| *Input Data* ilegible | El contrato no está verificado. Busquen otro token. |
| `npm install` falla en la sala | Restricción de red. Plan B: el docente comparte `node_modules` por red local. |
| Las cifras del script difieren un poco de las de la lámina | Otra versión del compilador u optimizador. Las proporciones deben mantenerse. |
