/**
 * Laboratorio 13 · despliegue de AsistenciaFirmada con Hardhat Ignition
 *
 *   Red local (ensayo):
 *     npx hardhat ignition deploy ignition/modules/s13-AsistenciaFirmada.js
 *
 *   Sepolia, con verificación en Etherscan:
 *     npx hardhat ignition deploy ignition/modules/s13-AsistenciaFirmada.js --network sepolia --verify
 *
 * El contrato no recibe parámetros: el dominio EIP-712 toma el chainId y su
 * propia dirección automáticamente al desplegarse.
 */
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AsistenciaFirmadaModulo", (m) => {
  const asistencia = m.contract("AsistenciaFirmada");
  return { asistencia };
});
