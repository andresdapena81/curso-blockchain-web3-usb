// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Tesoreria · Laboratorio 15 · lo que la DAO gobierna
 * @notice Una tesorería cuyo dueño es el TIMELOCK de la DAO. Solo una propuesta
 *         aprobada, encolada y ejecutada tras el retardo puede liberar fondos:
 *         nadie, ni siquiera quien la desplegó, puede sacar el dinero por su
 *         cuenta.
 *
 * Ojo: con GovernorTimelockControl quien hace la llamada final es el timelock,
 * no el Governor. Si el dueño fuera el Governor, la ejecución revertiría con
 * OwnableUnauthorizedAccount(timelock).
 *
 * Material de clase, sin auditar.
 */
contract Tesoreria is Ownable {
    error EnvioFallido();
    event Liberado(address indexed a, uint256 monto);

    constructor(address timelock) Ownable(timelock) {}

    receive() external payable {}

    /// @notice Solo el dueño (el timelock) puede llamarla, y solo lo hace al
    ///         ejecutar una propuesta aprobada cuyo retardo ya venció.
    function liberar(address a, uint256 monto) external onlyOwner {
        (bool ok, ) = payable(a).call{value: monto}("");
        if (!ok) revert EnvioFallido();
        emit Liberado(a, monto);
    }
}
