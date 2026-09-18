// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TokenLab14 · Laboratorio 14 · token de juguete para el pool
 * @notice Cualquiera puede acuñar: es un token de PRUEBA para alimentar el
 *         mini-AMM del laboratorio (hace de «ETH» y de «USD»). No tiene valor
 *         y nunca debe usarse fuera de la red local o de Sepolia.
 */
contract TokenLab14 is ERC20 {
    constructor(string memory nombre, string memory simbolo) ERC20(nombre, simbolo) {}

    /// @notice Grifo sin control de acceso: aceptable SOLO en un token de laboratorio.
    function acunar(address a, uint256 cantidad) external {
        _mint(a, cantidad);
    }
}
