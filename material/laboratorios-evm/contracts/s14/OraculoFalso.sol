// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AggregatorV3Interface} from "./OraculoConsumidor.sol";

/**
 * @title OraculoFalso · Laboratorio 14 · un oráculo controlable para pruebas
 * @notice Imita la interfaz de Chainlink pero deja fijar el precio y la fecha
 *         a mano. Sirve para dos cosas: probar sin depender de la red, y
 *         DEMOSTRAR por qué un oráculo manipulable rompe todo lo que depende de él.
 */
contract OraculoFalso is AggregatorV3Interface {
    int256 private _precio;
    uint256 private _updatedAt;
    uint8 private _decimales;

    constructor(int256 precioInicial, uint8 decimales_) {
        _precio = precioInicial;
        _decimales = decimales_;
        _updatedAt = block.timestamp;
    }

    function fijarPrecio(int256 nuevo) external {
        _precio = nuevo;
        _updatedAt = block.timestamp;
    }

    /// Deja el precio pero vuelve rancia la última actualización.
    function envejecer(uint256 segundos_) external {
        _updatedAt = block.timestamp - segundos_;
    }

    function decimals() external view returns (uint8) {
        return _decimales;
    }

    function latestRoundData()
        external
        view
        returns (uint80, int256, uint256, uint256, uint80)
    {
        return (1, _precio, _updatedAt, _updatedAt, 1);
    }
}
