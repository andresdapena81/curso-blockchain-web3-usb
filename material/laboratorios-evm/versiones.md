# Versiones congeladas del semestre

El ecosistema cambia rápido. Estas versiones se fijaron al preparar el curso y **no se cambian a mitad de semestre**: un tutorial que funcionaba el lunes puede romperse el jueves por una actualización.

| Herramienta | Versión | Dónde se fija |
|---|---|---|
| Node.js | 22 LTS | Instalación de la sala |
| Solidity | 0.8.28 | `hardhat.config.js` |
| Hardhat | 3.16.0 | `package.json` (versión exacta) |
| Toolbox Mocha + Ethers | 3.0.7 | `package.json` (versión exacta) |
| OpenZeppelin Contracts | 5.6.1 | `package.json` (versión exacta) |
| ethers | 6.x (la que trae el toolbox) | dependencia transitiva |

Todas las pruebas del repositorio se verificaron con estas versiones antes del inicio del semestre.

## Si algo cambia

- Si un estudiante tiene otra versión de Node.js y algo falla, primero se revisa la versión.
- Si una red de prueba o un servicio externo cambia, se documenta aquí con fecha y se avisa por el canal del curso.
- Actualizar dependencias es tarea de **entre** semestres, con todas las pruebas corridas de nuevo.
