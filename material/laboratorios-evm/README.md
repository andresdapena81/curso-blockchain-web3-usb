# Laboratorios EVM · Blockchain y Web 3.0

**Universidad de San Buenaventura Medellín · Ingeniería de Sistemas**

Un solo repositorio para todos los laboratorios de Solidity del semestre, de la Sesión 5 a la 16. Se instala **una vez** y se usa todo el curso: en una sala de cómputo con red restringida, un `npm install` por semestre es mucho más seguro que doce.

> **Nunca se usa dinero real.** Todo corre en la red local de Hardhat o en redes de prueba. Los contratos de este repositorio son material de clase, sin auditar.

---

## Instalación

Requisitos: Node.js 22 LTS y Git.

```bash
npm install
npx hardhat test          # todas las pruebas del semestre deben pasar
```

## Estructura

```
contracts/sNN/     contratos de cada sesión
test/sNN/          pruebas de cada sesión
scripts/sNN/       scripts de medición y despliegue
andamiaje/sNN/     versiones con huecos (TODO) para trabajar en clase
guias/             la guía de cada laboratorio
```

Las versiones con huecos viven **fuera** de `contracts/` a propósito: un contrato incompleto rompería la compilación de todo el repositorio. Para trabajar un laboratorio, se copia el andamiaje a su carpeta de trabajo según indique la guía.

## Correr solo una sesión

```bash
npx hardhat test test/s05/Operaciones.test.js
npx hardhat run scripts/s05/medir-gas.js
```

## Redes públicas y claves

Hardhat 3 guarda los secretos en un **almacén cifrado**, no en archivos del proyecto:

```bash
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
npx hardhat keystore set ETHERSCAN_API_KEY
```

Reglas que no admiten excepción:

1. La clave privada es la de la **billetera del curso**, nunca una con fondos reales.
2. Ninguna clave, URL con API key ni frase de recuperación se escribe en un archivo del repositorio.
3. Antes de cada `git push`, `git status` y revisar que no se sube nada de lo anterior.

## Versiones congeladas

Ver [`versiones.md`](versiones.md). **No se actualizan a mitad de semestre.**

## Índice de laboratorios

| Sesión | Guía | Contratos |
|---|---|---|
| 05 · EVM y gas | `guias/s05-forense-y-gas.pdf` (fuente `.html`) | `Operaciones` |
| 06 · Solidity I · Remix | `guias/s06-certificados-remix.pdf` (fuente `.html`) | `CertificadosUSB` |
| 07 · Solidity II · subasta y patrones | `guias/s07-subasta-patrones.pdf` (fuente `.html`) | `Subasta`, `ISubasta`, `Porcentajes`, `SubastaPush`, `SubastaPullMinima`, `PostorHostil`, `Empaquetado` |
| 08 · Hardhat · pruebas y mutantes | `guias/s08-pruebas-y-mutantes.pdf` (fuente `.html`) | `Recaudo` (+ 3 mutantes), `ignition/modules/Recaudo.js` |
| 09 · Seguridad · Ethernaut y auditoría | `guias/s09-seguridad-ethernaut.pdf` (fuente `.html`) | `BancoVulnerable`, `Atacante`, `BancoSeguro` |
| 10 · Tokens fungibles · ERC-20 | `guias/s10-token-erc20.pdf` (fuente `.html`) | `FichaUSB`, `Canje`, `ignition/modules/s10-FichaCanje.js` |
| 11 · NFT, IPFS y diploma | `guias/s11-diploma-nft-ipfs.pdf` (fuente `.html`) | `DiplomaUSB`, `DiplomaSBT`, `ignition/modules/s11-DiplomaUSB.js` |
| 12 · Frontend Web3 | `../laboratorio-12/guia/guia-laboratorio-12.pdf` (la dApp vive en `../laboratorio-12/`) | usa `FichaUSB` de la S10 · `scripts/s12/` |
| 13 · Firmas EIP-712 e indexación | `guias/s13-firmas-eip712.pdf` (fuente `.html`) | `AsistenciaFirmada`, `ignition/modules/s13-AsistenciaFirmada.js` |
| 14 · DeFi · oráculos y AMM | `guias/s14-defi-oraculos-amm.pdf` (fuente `.html`) + `guias/s14-plantilla-perdida-impermanente.xlsx` | `PoolXYK`, `TokenLab14`, `OraculoConsumidor`, `OraculoFalso`, `ignition/modules/s14-OraculoConsumidor.js` |
| 15 · DAOs y gobernanza | `guias/s15-gobernanza-dao.pdf` (fuente `.html`) | `TokenVoto`, `GobiernoUSB`, `TimelockUSB`, `Tesoreria`, `MultisigUSB` |
| 16 · Capa 2 y regulación | `guias/s16-capa2-comparativa.pdf` (fuente `.html`) | `SelloTiempo` |
