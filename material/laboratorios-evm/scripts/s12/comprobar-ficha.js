/**
 * Laboratorio 12 · punto de control ANTES de abrir el navegador
 *
 * Hace las mismas LECTURAS que la dApp (symbol, decimals, balanceOf), con el
 * mismo ABI de texto, pero desde la terminal. Si esto falla, la dApp también
 * va a fallar: el problema está en la dirección o en la red, no en el HTML.
 *
 *   PowerShell:
 *     $env:FICHA="0xDIRECCION_DEL_TOKEN"; $env:CUENTA="0xSU_DIRECCION"
 *     npx hardhat run scripts/s12/comprobar-ficha.js --network localhost
 *     (o --network sepolia si su token de la Sesión 10 está allá)
 *
 * No firma nada ni gasta gas: son llamadas view.
 */
import { network } from "hardhat";

const { FICHA, CUENTA } = process.env;
const { ethers } = await network.create();
if (!FICHA || !ethers.isAddress(FICHA) || !CUENTA || !ethers.isAddress(CUENTA)) {
  console.error("Faltan FICHA y/o CUENTA (direcciones 0x…). Ver el encabezado del script.");
  process.exit(1);
}

// Idéntico al ABI de la dApp: solo lo que la interfaz usa.
const ABI = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

const red = await ethers.provider.getNetwork();
const codigo = await ethers.provider.getCode(FICHA);
if (codigo === "0x") {
  console.error(`\n  En ${FICHA} NO hay contrato en la red ${red.chainId}.`);
  console.error("  ¿Red equivocada? ¿Reiniciaron el nodo local y la cadena se borró?\n");
  process.exit(1);
}

const ficha = new ethers.Contract(FICHA, ABI, ethers.provider);
const simbolo = await ficha.symbol();
const decimales = await ficha.decimals();
const bruto = await ficha.balanceOf(CUENTA);
console.log(`
  red           : ${red.name} (${red.chainId})
  contrato      : ${FICHA}  (${(codigo.length - 2) / 2} bytes de código)
  símbolo       : ${simbolo}
  decimales     : ${decimales}
  saldo bruto   : ${bruto}      <- lo que devuelve la cadena (entero)
  saldo legible : ${ethers.formatUnits(bruto, decimales)} ${simbolo}   <- formatUnits
  ETH p/ gas    : ${ethers.formatEther(await ethers.provider.getBalance(CUENTA))}
`);
