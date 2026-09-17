/**
 * Laboratorio 08 · módulo de despliegue de Hardhat Ignition
 *
 * Ignition registra cada despliegue en ignition/deployments/: si se corta la
 * conexión a mitad de camino, al volver a ejecutarlo retoma donde quedó y no
 * despliega dos veces. Por eso se usa en lugar de un script suelto.
 *
 *   Red local (prueba):
 *     npx hardhat ignition deploy ignition/modules/Recaudo.js
 *
 *   Sepolia, con parámetros y verificación:
 *     npx hardhat ignition deploy ignition/modules/Recaudo.js \
 *       --network sepolia \
 *       --parameters ignition/parametros/recaudo-sepolia.json \
 *       --verify
 */
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("RecaudoModulo", (m) => {
  // Valores por defecto para la red local. En Sepolia se sobrescriben con el JSON.
  const meta = m.getParameter("meta", 10n * 10n ** 18n);        // 10 ETH
  const duracion = m.getParameter("duracionSegundos", 7 * 24 * 60 * 60);

  const recaudo = m.contract("Recaudo", [meta, duracion]);
  return { recaudo };
});
