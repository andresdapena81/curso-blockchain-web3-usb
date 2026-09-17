// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FichaUSB · Laboratorio 10 · un token ERC-20 con tope
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 10
 *
 * Token de puntos de un evento universitario. Se construye SOBRE OpenZeppelin,
 * no a mano: el estándar completo (transfer, approve, allowance, transferFrom,
 * eventos) lo aporta ERC20. Aquí solo se añaden las decisiones de diseño:
 *
 *   - Capped:   hay un tope máximo de emisión. No se puede imprimir sin límite.
 *   - Ownable:  solo el organizador acuña puntos nuevos.
 *   - Burnable: cualquiera puede quemar los suyos (canjearlos).
 *
 * Tokenómica DELIBERADA: oferta con tope, emisión controlada, quema abierta.
 * Es lo contrario de un esquema donde el dueño imprime a voluntad.
 *
 * Material de clase, sin auditar. Nunca con dinero real.
 */
contract FichaUSB is ERC20, ERC20Burnable, ERC20Capped, Ownable {
    constructor(uint256 topeEnTokens)
        ERC20("Ficha USB", "FUSB")
        ERC20Capped(topeEnTokens * 10 ** decimals())
        Ownable(msg.sender)
    {}

    /// @notice El organizador acuña puntos. El tope se comprueba en _update.
    function acunar(address a, uint256 cantidadEnTokens) external onlyOwner {
        _mint(a, cantidadEnTokens * 10 ** decimals());
    }

    // OpenZeppelin v5: al heredar de ERC20 y ERC20Capped hay que resolver
    // explícitamente cuál _update se usa. El de Capped valida el tope y luego
    // llama al de ERC20. Sin esto, el contrato no compila: es a propósito,
    // para que el estudiante entienda que las extensiones se componen aquí.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, value);
    }
}
