// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Canje · Laboratorio 10 · VERSIÓN DE TRABAJO
 * @notice Un puesto que canjea FichaUSB por un premio usando el patrón
 *         approve + transferFrom.
 *
 * Copien este archivo sobre contracts/s10/Canje.sol y corran:
 *     npx hardhat test test/s10/FichaUSB.test.js
 *
 * Flujo que este contrato debe permitir:
 *   1. El usuario llama ficha.approve(canje, precio)   → autoriza
 *   2. El usuario llama canje.canjear()                → el contrato retira
 *
 * Compila tal como está. Completen el TODO 4.
 * Material de clase, sin auditar.
 */
contract Canje {
    IERC20 public immutable ficha;
    uint256 public immutable precio;
    address public immutable tesoreria;
    mapping(address => uint256) public premiosDe;

    error TransferenciaFallida();

    event Canjeado(address indexed usuario, uint256 pagado);

    constructor(address ficha_, uint256 precioEnUnidadesMinimas, address tesoreria_) {
        ficha = IERC20(ficha_);
        precio = precioEnUnidadesMinimas;
        tesoreria = tesoreria_;
    }

    /// @notice Retira `precio` fichas del usuario, si las autorizó, y le da un premio.
    function canjear() external {
        // TODO 4 · Cuatro líneas, en este orden:
        //   a) Mover `precio` fichas DESDE quien llama (msg.sender) HACIA la
        //      `tesoreria`, usando la autorización previa. ¿Cuál de las seis
        //      funciones del estándar mueve tokens de OTRA cuenta?
        //   b) Esa función devuelve un bool: si es false, revert TransferenciaFallida().
        //   c) Sumar 1 a premiosDe[msg.sender].
        //   d) Emitir Canjeado(msg.sender, precio).
        // Pregunta para pensar: ¿por qué aquí NO se escribe ningún require
        // sobre la allowance? (Respuesta: pruébenlo sin aprobar y miren el error.)
    }
}
