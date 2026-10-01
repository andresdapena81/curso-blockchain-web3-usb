# Versiones congeladas del semestre

El ecosistema cambia rápido. Estas versiones se fijaron al preparar el curso y **no se cambian a mitad de semestre**: un tutorial que funcionaba el lunes puede romperse el jueves por una actualización.

| Herramienta | Versión | Dónde se fija |
|---|---|---|
| Node.js | 22 LTS | Instalación de la sala |
| Solidity | 0.8.34 (`0.8.34+commit.80d5c536`) | `hardhat.config.js` y el `pragma` de cada contrato |
| Hardhat | 3.16.0 | `package.json` (versión exacta) |
| Toolbox Mocha + Ethers | 3.0.7 | `package.json` (versión exacta) |
| OpenZeppelin Contracts | 5.6.1 | `package.json` (versión exacta) |
| ethers | 6.x (la que trae el toolbox) | dependencia transitiva |

Todas las pruebas del repositorio se verificaron con estas versiones antes del inicio del semestre.

## Cambio de Solidity a mitad de semestre (1-oct-2026)

Se pasó de **0.8.28 a 0.8.34**, rompiendo a propósito la regla de arriba, por una razón práctica: Remix abre hoy con 0.8.34 por omisión, y cada archivo del curso fallaba en clase con `ParserError: Source file requires different compiler version` hasta cambiar el desplegable a mano. En un salón, eso son tres minutos perdidos por sesión y una pregunta que distrae del tema.

Antes de cambiar se comprobó el costo, que es lo que vuelve defendible la excepción:

- Las **200 pruebas** del repositorio pasan con 0.8.34.
- El objetivo de la EVM pasa de `cancun` a `osaka`, así que se volvieron a **medir las 118 funciones** con `--gas-stats` y a comparar contra 0.8.28: **solo tres cambian, y cambian en 1 unidad de gas** (`publicar` 95012→95011, `moderar` 42742→42741, `proponer` 145886→145885). El resto de las cifras publicadas sigue siendo exacto.
- Los `pragma` quedaron **fijos** en `0.8.34` en todos los contratos, incluidos los andamiajes, que antes usaban `^0.8.28`.

Para quien dicte el curso en otro momento: si Remix vuelve a cambiar su versión por omisión, la decisión correcta es **elegir la versión del curso en el desplegable**, no bajarle el pin a los archivos. Cambiarla obliga a repetir esta comprobación entera.

## Si algo cambia

- Si un estudiante tiene otra versión de Node.js y algo falla, primero se revisa la versión.
- Si una red de prueba o un servicio externo cambia, se documenta aquí con fecha y se avisa por el canal del curso.
- Actualizar dependencias es tarea de **entre** semestres, con todas las pruebas corridas de nuevo.
