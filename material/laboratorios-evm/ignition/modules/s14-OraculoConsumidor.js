/**
 * Laboratorio 14 · desplegar OraculoConsumidor apuntando al feed ETH/USD de Chainlink
 *
 *   Sepolia, con verificación en Etherscan:
 *     npx hardhat ignition deploy ignition/modules/s14-OraculoConsumidor.js --network sepolia --verify
 *
 * El parámetro `feed` trae por defecto la dirección del feed ETH/USD de
 * Chainlink en Sepolia, verificada en docs.chain.link el 17-sep-2026:
 *     0x694AA1769357215DE4FAC081bf1f309aDC325306
 * En la red local ese contrato no existe: allí se prueba con OraculoFalso
 * (test/s14/Oraculo.test.js), no con este módulo.
 */
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("OraculoConsumidorModulo", (m) => {
  const feed = m.getParameter("feed", "0x694AA1769357215DE4FAC081bf1f309aDC325306");
  const consumidor = m.contract("OraculoConsumidor", [feed]);
  return { consumidor };
});
