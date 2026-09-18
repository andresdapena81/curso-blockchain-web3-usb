// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title TimelockUSB · Laboratorio 15 · el retardo obligatorio
 * @notice Un TimelockController de OpenZeppelin, sin cambios. Existe como
 *         archivo propio solo para que Hardhat genere su artefacto y se pueda
 *         desplegar con ethers.deployContract("TimelockUSB", [...]).
 *
 * Qué hace: una propuesta aprobada NO se ejecuta enseguida. Se agenda
 * (schedule) y solo puede ejecutarse cuando pasan `minDelay` segundos. Ese
 * plazo es la «salida de emergencia» de la minoría: quien no esté de acuerdo
 * con lo aprobado alcanza a retirar sus fondos antes de que se ejecute.
 *
 * Roles (OpenZeppelin v5):
 *   - PROPOSER_ROLE: puede agendar. Debe tenerlo SOLO el Governor.
 *   - CANCELLER_ROLE: puede cancelar lo agendado. También el Governor.
 *   - EXECUTOR_ROLE: puede ejecutar lo vencido. address(0) = cualquiera.
 *   - DEFAULT_ADMIN_ROLE: puede repartir roles. Quien despliega lo RENUNCIA
 *     al terminar la configuración; si no, la DAO tiene un dueño escondido.
 *
 * Material de clase, sin auditar.
 */
contract TimelockUSB is TimelockController {
    constructor(uint256 minDelay, address[] memory proposers, address[] memory executors, address admin)
        TimelockController(minDelay, proposers, executors, admin)
    {}
}
