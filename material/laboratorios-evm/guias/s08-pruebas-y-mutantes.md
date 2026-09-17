# Laboratorio 08 · Pruebas que atrapan errores, cobertura y despliegue con Ignition

**Sesión 8 · Hardhat · en parejas · 90 minutos**

> Evidencia calificable: suite en verde, cobertura ≥ 80 %, tres mutantes muertos y contrato verificado en Sepolia.

## La idea del laboratorio

`contracts/s08/Recaudo.sol` es un contrato de recaudo con meta y plazo que **no trae pruebas**. En la misma carpeta hay tres copias —`RecaudoMutante1`, `2` y `3`— con un error sutil cada una.

Una suite de pruebas buena:

1. pasa completa contra `Recaudo`,
2. **falla** contra cada mutante.

Al preparar el curso se comprobó que una suite con 13 pruebas y **88 % de cobertura** sigue completamente en verde contra los tres mutantes. La cobertura dice dónde no hay pruebas; no dice que las que hay sirvan.

> **No lean el código de los mutantes hasta que los tres estén muertos.** El ejercicio es pensar en los bordes, no copiar la diferencia.

---

## 1 · Preparar (10 min)

```bash
npm install
npx hardhat test test/s06/CertificadosUSB.test.js      # 18 en verde: el entorno funciona
mkdir -p test/s08
cp andamiaje/s08/Recaudo.test.js test/s08/Recaudo.test.js
npx hardhat test test/s08/Recaudo.test.js               # 2 en verde: los ejemplos
```

En `cmd` de Windows: `mkdir test\s08` y `copy andamiaje\s08\Recaudo.test.js test\s08\`.

Lean `contracts/s08/Recaudo.sol` completo. Tiene tres funciones y dos finales posibles:

| Final | Condición | Qué se puede hacer |
|---|---|---|
| **Exitoso** | Tras el plazo, `totalRecaudado >= meta` | El dueño reclama los fondos |
| **Fallido** | Tras el plazo, `totalRecaudado < meta` | Cada aportante recupera lo suyo |

## 2 · Escribir la suite y medir cobertura (40 min)

Mínimo 10 pruebas en total (los dos ejemplos cuentan), repartidas así:

| Grupo | Mínimo | No olvidar |
|---|---|---|
| despliegue | 2 | Constructor con meta cero o duración cero |
| aportar | 3 | Evento con argumentos exactos; aporte después del plazo |
| recaudo exitoso | 3 | Solo el dueño; no dos veces; saldo que recibe el dueño |
| recaudo fallido | 3 | Cada quien lo suyo; quien no aportó; el dueño no se lleva nada |

```bash
npx hardhat test test/s08/Recaudo.test.js --coverage
```

El informe marca las **líneas no cubiertas** de `Recaudo.sol`. Cada una es una prueba que falta. Meta: ≥ 80 % de líneas.

### Herramientas que van a necesitar

```js
// otra cuenta firma
await r.connect(ana).aportar({ value: eth(3) });

// el reloj
await time.increase(7 * 24 * 60 * 60);   // avanza una semana
await time.increaseTo(fin);              // mina un bloque en `fin`; la SIGUIENTE tx cae en fin + 1
await time.setNextBlockTimestamp(fin);   // la PRÓXIMA transacción cae exactamente en `fin`

// comprobaciones
await expect(tx).to.be.revertedWithCustomError(r, "PlazoVencido");
await expect(tx).to.emit(r, "Aporte").withArgs(ana.address, monto, total);
await expect(tx).to.changeEtherBalance(ethers, cuenta, monto);
await expect(tx).to.changeEtherBalances(ethers, [ana, r], [monto, -monto]);
```

## 3 · Cazar los mutantes (25 min)

```bash
node scripts/s08/cazar-mutantes.js
```

El script corre su suite contra el contrato correcto y contra los tres mutantes, e informa cuáles siguen **vivos**. Funciona igual en PowerShell, cmd, macOS y Linux.

Mientras haya mutantes vivos, recorran para cada función las cinco preguntas de borde:

| Borde | La pregunta |
|---|---|
| Tiempo | ¿Qué pasa un segundo antes, en el segundo exacto y un segundo después de cada plazo? |
| Umbral | ¿Qué pasa con el valor exacto de cada límite? |
| Repetición | ¿Qué pasa si la misma cuenta llama dos veces seguidas? |
| Cero y vacío | ¿Qué pasa con 0 o con la dirección cero? |
| Quién llama | ¿Qué pasa si llama otra cuenta? |

**Cuando los tres estén muertos**, abran cada mutante, encuentren la diferencia con `Recaudo.sol` y anoten en el informe qué prueba lo mató.

## 4 · Desplegar y verificar con Ignition (15 min)

Primero en la red local, para confirmar que el módulo funciona:

```bash
npx hardhat ignition deploy ignition/modules/Recaudo.js
```

Guardar los secretos en el almacén cifrado (se pide una contraseña la primera vez):

```bash
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set SEPOLIA_PRIVATE_KEY      # la de la billetera DEL CURSO
npx hardhat keystore set ETHERSCAN_API_KEY
```

Desplegar y verificar en Sepolia:

```bash
npx hardhat ignition deploy ignition/modules/Recaudo.js --network sepolia --parameters ignition/parametros/recaudo-sepolia.json --verify
```

Los parámetros de Sepolia fijan una meta de 0,005 ETH y un plazo de 30 minutos: se puede aportar y ver el final dentro de la clase. Aporten desde la billetera en la pestaña *Write Contract* del explorador.

Si la verificación falla por tiempo, esperen un minuto y repitan **el mismo comando**: Ignition sabe que ya desplegó y solo reintenta la verificación.

**Antes de `git push`:** `git status`. No debe aparecer ninguna clave, ningún `.env` ni ninguna URL con API key.

---

## Evidencia

| Evidencia | Detalle | Peso |
|---|---|---|
| Suite | `test/s08/Recaudo.test.js` con ≥ 10 pruebas en verde | 25 % |
| Cobertura | Captura del informe con ≥ 80 % de líneas en `Recaudo.sol` | 15 % |
| Mutantes | Salida del script con los tres muertos + para cada uno: qué prueba lo mató y cuál era el error | 35 % |
| Despliegue | Dirección en Sepolia verificada, desplegada con Ignition | 25 % |

## Errores frecuentes

| Síntoma | Causa |
|---|---|
| «No se encontraron pruebas» | La suite no está en `test/s08/Recaudo.test.js` |
| Una prueba de plazo pasa contra el correcto y contra todo | Usaron `increaseTo` donde hacía falta `setNextBlockTimestamp` |
| La prueba de doble reembolso no mata a nadie | En el contrato no quedaba saldo de otros aportantes: la segunda llamada falla por falta de fondos, no por la regla |
| `changeEtherBalance` falla por una cantidad pequeña | Están comparando saldos a mano y restando mal el gas; usen el matcher |
| `--verify` falla | Falta `ETHERSCAN_API_KEY`, o hay que reintentar tras un minuto |
