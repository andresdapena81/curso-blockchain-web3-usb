// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FichaUSB · Laboratorio 10 · VERSIÓN DE TRABAJO
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 10
 *
 * Copien este archivo sobre contracts/s10/FichaUSB.sol y corran:
 *     npx hardhat test test/s10/FichaUSB.test.js
 * El laboratorio está completo cuando pasan las 12 pruebas (junto con Canje).
 *
 * Compila tal como está. Completen los TODO en orden: 1, 2 y 3.
 *
 * Lo que YA está hecho (no lo toquen): la herencia. ERC20 aporta las seis
 * funciones del estándar y los dos eventos; Burnable aporta burn/burnFrom;
 * Capped aporta el tope; Ownable aporta onlyOwner. Ustedes solo escriben
 * las decisiones de diseño.
 *
 * Material de clase, sin auditar. Nunca con dinero real.
 */
contract FichaUSB is ERC20, ERC20Burnable, ERC20Capped, Ownable {
    constructor(uint256 topeEnTokens)
        ERC20("Ficha USB", "FUSB")
        // TODO 1 · El tope llega EN TOKENS (por ejemplo 1 000 000), pero
        // ERC20Capped lo espera en UNIDADES MÍNIMAS (1 token = 10**18 unidades).
        // Tal como está, el tope queda en 1 000 000 unidades mínimas: una
        // fracción invisible de un token. Conviértanlo con decimals().
        ERC20Capped(topeEnTokens)
        Ownable(msg.sender)
    {}

    /// @notice El organizador acuña puntos. El tope se comprueba en _update.
    function acunar(address a, uint256 cantidadEnTokens) external onlyOwner {
        // TODO 2 · Crear `cantidadEnTokens` tokens a favor de `a`.
        //   - La función interna de OpenZeppelin que crea tokens es _mint(cuenta, monto).
        //   - `monto` va en unidades mínimas: la misma conversión del TODO 1.
        //   - No comprueben el tope aquí: ERC20Capped ya lo hace en _update.
    }

    // OpenZeppelin v5: al heredar de ERC20 y de ERC20Capped, las dos definen
    // _update. Solidity exige decir explícitamente qué versión se usa, y por
    // eso esta función existe (sin ella el contrato no compila).
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
    {
        // TODO 3 · Delegar en la cadena de herencia con una sola línea.
        //   Pista: super._update(...) llama al _update de ERC20Capped, que
        //   revisa el tope y luego llama al de ERC20, que mueve los saldos.
        //   Mientras esté vacío, NINGUNA transferencia mueve saldos.
    }
}
