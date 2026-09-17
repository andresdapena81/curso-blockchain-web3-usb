// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Interfaz común de las dos subastas del laboratorio 07
 * @notice Una interfaz declara QUÉ se puede llamar, sin decir CÓMO.
 *         Las versiones push y pull la implementan igual por fuera y
 *         muy distinto por dentro: por eso se pueden comparar.
 */
interface ISubasta {
    enum Estado {
        Abierta,
        PorFinalizar,   // venció el plazo, falta llamar finalizar()
        Finalizada
    }

    event NuevaPuja(address indexed postor, uint256 monto);
    event Retiro(address indexed cuenta, uint256 monto);
    event SubastaFinalizada(address indexed ganador, uint256 monto);

    function pujar() external payable;
    function finalizar() external;
    function estado() external view returns (Estado);
}
