// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

/**
 * @title GobiernoUSB · Laboratorio 15 · gobernanza on-chain
 * @notice El contrato Governor: recibe propuestas, abre votación, cuenta votos
 *         según el poder de voto de cada quien (del TokenVoto) y ejecuta lo
 *         aprobado. El ciclo completo: proponer → votar → ejecutar.
 *
 * Parámetros elegidos cortos para poder recorrer el ciclo en una clase:
 *   - retraso de votación: 1 bloque
 *   - periodo de votación: ~50 bloques
 *   - quórum: 4 % del suministro
 *
 * Material de clase, sin auditar.
 */
contract GobiernoUSB is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    constructor(IVotes token)
        Governor("GobiernoUSB")
        GovernorSettings(1 /* retraso */, 50 /* periodo */, 0 /* umbral para proponer */)
        GovernorVotes(token)
        GovernorVotesQuorumFraction(4 /* 4 % de quórum */)
    {}

    // Resolución de herencia exigida por OpenZeppelin v5.
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
}
