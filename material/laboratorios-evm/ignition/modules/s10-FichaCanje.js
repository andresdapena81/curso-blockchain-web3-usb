/**
 * Laboratorio 10 · módulo de Ignition: FichaUSB + Canje
 *
 * Despliega el token y, con su dirección, el puesto de canje. Ignition anota
 * cada paso en ignition/deployments/: si la conexión se corta, al repetir el
 * MISMO comando retoma donde quedó y no despliega dos veces.
 *
 *   Red local (ensayo, no gasta nada):
 *     npx hardhat ignition deploy ignition/modules/s10-FichaCanje.js
 *
 *   Sepolia, con sus parámetros y verificación en Etherscan:
 *     npx hardhat ignition deploy ignition/modules/s10-FichaCanje.js \
 *       --network sepolia \
 *       --parameters ignition/parametros/s10-mi-ficha.json \
 *       --verify
 *
 * El JSON de parámetros lo escribe cada pareja (ver la guía, paso 11):
 *   { "FichaCanjeModulo": { "topeEnTokens": 1000000,
 *                            "precioEnUnidadesMinimas": "25000000000000000000",
 *                            "tesoreria": "0x...su segunda cuenta..." } }
 */
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FichaCanjeModulo", (m) => {
  // Valores por defecto: sirven para el ensayo en la red local.
  const tope = m.getParameter("topeEnTokens", 1_000_000n);
  const precio = m.getParameter("precioEnUnidadesMinimas", 25n * 10n ** 18n); // 25 FUSB
  const tesoreria = m.getParameter("tesoreria", m.getAccount(0));

  const ficha = m.contract("FichaUSB", [tope]);
  const canje = m.contract("Canje", [ficha, precio, tesoreria]);
  return { ficha, canje };
});
