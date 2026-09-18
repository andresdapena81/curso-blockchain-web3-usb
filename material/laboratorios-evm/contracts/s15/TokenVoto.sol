// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenVoto · Laboratorio 15 · el token que da poder de voto
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 15
 *
 * Un ERC-20 normal no sirve para votar: no guarda cuántos tokens tenía cada
 * quien en el momento de una propuesta, y sin eso se podría votar, transferir
 * y volver a votar (o pedir prestado, votar y devolver: Beanstalk, 2022).
 * ERC20Votes añade ese registro histórico (checkpoints) y la DELEGACIÓN:
 * hay que delegar el voto —a uno mismo o a otro— para que cuente.
 *
 * Acuñar está restringido al dueño: en un token de gobierno, acuñar libremente
 * sería fabricar votos.
 *
 * Material de clase, sin auditar.
 */
contract TokenVoto is ERC20, ERC20Permit, ERC20Votes, Ownable {
    constructor() ERC20("Token Voto USB", "VOTO") ERC20Permit("Token Voto USB") Ownable(msg.sender) {}

    function acunar(address a, uint256 cantidad) external onlyOwner {
        _mint(a, cantidad);
    }

    // OpenZeppelin v5: resolver la herencia múltiple.
    function _update(address from, address to, uint256 value)
        internal override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public view override(ERC20Permit, Nonces) returns (uint256)
    {
        return super.nonces(owner);
    }
}
