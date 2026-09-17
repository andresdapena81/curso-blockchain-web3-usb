/**
 * Laboratorios EVM · Blockchain y Web 3.0 · USB Medellín
 *
 * Un solo proyecto para todo el semestre: se instala UNA vez en la sala de
 * cómputo. Las versiones están congeladas en package.json y NO se cambian a
 * mitad de semestre (ver versiones.md).
 *
 * Las redes públicas leen la URL del nodo y la clave privada desde variables
 * de configuración. Nunca se escriben en este archivo ni se suben a Git:
 *
 *     npx hardhat keystore set SEPOLIA_RPC_URL
 *     npx hardhat keystore set SEPOLIA_PRIVATE_KEY
 *     npx hardhat keystore set ETHERSCAN_API_KEY
 *
 * La clave privada es la de la billetera DE CURSO, sin fondos reales.
 */
import toolbox from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable } from "hardhat/config";

export default {
  plugins: [toolbox],
  solidity: {
    version: "0.8.28",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    // Sesión 16: el mismo contrato en una capa 2 de prueba
    opSepolia: {
      type: "http",
      chainType: "op",
      url: configVariable("OP_SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
  verify: {
    etherscan: { apiKey: configVariable("ETHERSCAN_API_KEY") },
  },
};
