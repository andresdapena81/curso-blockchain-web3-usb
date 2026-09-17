// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Canje · Laboratorio 10 · el patrón approve + transferFrom
 * @notice Un puesto que canjea FichaUSB por un premio. Demuestra POR QUÉ
 *         existe el patrón de aprobación: el contrato mueve tokens del usuario
 *         SOLO por la cantidad que el usuario autorizó antes, ni un token más.
 *
 * Flujo:
 *   1. El usuario llama ficha.approve(canje, precio)   → autoriza
 *   2. El usuario llama canje.canjear()                → el contrato retira
 *
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
        // transferFrom mueve tokens del usuario a la tesorería usando la
        // autorización previa. Si no aprobó, o aprobó menos, esto revierte.
        bool ok = ficha.transferFrom(msg.sender, tesoreria, precio);
        if (!ok) revert TransferenciaFallida();

        premiosDe[msg.sender] += 1;
        emit Canjeado(msg.sender, precio);
    }
}
