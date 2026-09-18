/**
 * Laboratorio 11 · despliega DiplomaUSB y emite el primer diploma
 *
 *   Red local (ensayo, sin internet ni ETH de prueba):
 *     npx hardhat ignition deploy ignition/modules/s11-DiplomaUSB.js
 *
 *   Sepolia, con SUS parámetros y verificación en el explorador:
 *     npx hardhat ignition deploy ignition/modules/s11-DiplomaUSB.js \
 *       --network sepolia \
 *       --parameters ignition/parametros/diploma-sepolia.json \
 *       --verify
 *
 *   El archivo de parámetros lo crea cada pareja (ver la guía, paso 7):
 *     { "DiplomaModulo": { "tope": 100,
 *                          "destinatario": "0xSU_DIRECCION",
 *                          "tokenURI": "ipfs://SU_CID_DEL_JSON" } }
 *
 * Ignition registra el despliegue en ignition/deployments/: si se corta la
 * conexión, al repetir el comando retoma donde quedó y no despliega dos veces.
 */
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DiplomaModulo", (m) => {
  const tope = m.getParameter("tope", 100n);
  // En la red local, por defecto el diploma va a la primera cuenta de Hardhat.
  const destinatario = m.getParameter("destinatario", m.getAccount(0));
  // CID de EJEMPLO: en Sepolia se reemplaza por el CID real del JSON subido a IPFS.
  const tokenURI = m.getParameter("tokenURI", "ipfs://bafkreiexamplecidparaelprimerdiplomadelaboratorio1111");

  const diploma = m.contract("DiplomaUSB", [tope]);
  m.call(diploma, "emitir", [destinatario, tokenURI], { id: "emitirPrimerDiploma" });

  return { diploma };
});
