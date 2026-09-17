// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Tesoreria · Laboratorio 15 · lo que la DAO gobierna
 * @notice Una tesorería cuyo dueño es el contrato de gobierno. Solo una
 *         propuesta aprobada y ejecutada puede liberar sus fondos: nadie,
 *         ni siquiera quien la desplegó, puede sacar el dinero por su cuenta.
 */
contract Tesoreria is Ownable {
    error EnvioFallido();
    event Liberado(address indexed a, uint256 monto);

    constructor(address gobierno) Ownable(gobierno) {}

    receive() external payable {}

    /// @notice Solo el contrato de gobierno (el owner) puede llamarla, y solo
    ///         lo hace al ejecutar una propuesta aprobada.
    function liberar(address a, uint256 monto) external onlyOwner {
        (bool ok, ) = payable(a).call{value: monto}("");
        if (!ok) revert EnvioFallido();
        emit Liberado(a, monto);
    }
}
