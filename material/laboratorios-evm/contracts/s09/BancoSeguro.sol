// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BancoSeguro · Laboratorio 09 · la corrección
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 9
 *
 * El mismo banco, corregido de DOS maneras que se refuerzan:
 *   1. Checks-Effects-Interactions: el saldo se pone en cero ANTES de enviar.
 *   2. ReentrancyGuard: el modificador nonReentrant bloquea la reentrada
 *      aunque alguien olvide el orden en el futuro.
 *
 * En la práctica basta con CEI. El guard es el cinturón sobre los tirantes:
 * defensa en profundidad.
 */
contract BancoSeguro is ReentrancyGuard {
    mapping(address => uint256) public saldos;

    error SinSaldo();
    error EnvioFallido();

    function depositar() external payable {
        saldos[msg.sender] += msg.value;
    }

    function retirar() external nonReentrant {
        uint256 monto = saldos[msg.sender];
        if (monto == 0) revert SinSaldo();

        saldos[msg.sender] = 0;                                // EFFECT primero

        (bool ok, ) = payable(msg.sender).call{value: monto}(""); // INTERACTION al final
        if (!ok) revert EnvioFallido();
    }

    function balanceTotal() external view returns (uint256) {
        return address(this).balance;
    }
}
