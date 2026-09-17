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
| 05 · EVM y gas | `guias/s05-forense-y-gas.md` | `Operaciones` |
