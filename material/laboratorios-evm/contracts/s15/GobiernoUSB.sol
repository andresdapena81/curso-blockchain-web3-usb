// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import {GovernorTimelockControl} from "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

/**
 * @title GobiernoUSB · Laboratorio 15 · gobernanza on-chain con timelock
 * @notice El contrato Governor: recibe propuestas, abre la votación, cuenta los
 *         votos según el poder de voto de cada quien (del TokenVoto) y, si la
 *         propuesta gana, la ENCOLA en el TimelockController. Pasado el retardo,
 *         cualquiera la ejecuta. El ciclo completo:
 *
 *             proponer → votar → encolar (queue) → esperar → ejecutar
 *
 * Con timelock, quien ejecuta de verdad es el TIMELOCK, no el Governor: por eso
 * la tesorería debe tener como dueño al timelock (error de concepto número 1).
 *
 * Parámetros elegidos cortos para recorrer el ciclo en una clase:
 *   - retraso de votación: 1 bloque
 *   - periodo de votación: 50 bloques (≈ 10 minutos en Sepolia, con bloques de 12 s)
 *   - umbral para proponer: 0 (cualquiera con cuenta puede proponer)
 *   - quórum: 4 % del suministro en el bloque de la propuesta
 *   - el retardo del timelock se fija al desplegar el TimelockUSB
 *
 * Material de clase, sin auditar.
 */
contract GobiernoUSB is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    constructor(IVotes token, TimelockController timelock_)
        Governor("GobiernoUSB")
        GovernorSettings(1 /* retraso */, 50 /* periodo */, 0 /* umbral para proponer */)
        GovernorVotes(token)
        GovernorVotesQuorumFraction(4 /* 4 % de quórum */)
        GovernorTimelockControl(timelock_)
    {}

    // ------------------------------------------------------------------
    // Resolución de herencia exigida por OpenZeppelin v5. No hay lógica
    // nueva: solo se le dice a Solidity cuál versión usar (la de más abajo
    // en la lista de herencia, vía super).
    // ------------------------------------------------------------------

    function votingDelay() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    function quorum(uint256 timepoint)
        public view override(Governor, GovernorVotesQuorumFraction) returns (uint256)
    {
        return super.quorum(timepoint);
    }

    function state(uint256 proposalId)
        public view override(Governor, GovernorTimelockControl) returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(uint256 proposalId)
        public view override(Governor, GovernorTimelockControl) returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }
}
