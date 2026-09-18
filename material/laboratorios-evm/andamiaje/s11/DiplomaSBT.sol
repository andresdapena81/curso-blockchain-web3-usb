// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {DiplomaUSB} from "./DiplomaUSB.sol";

/// @notice Interfaz mínima de ERC-5192 (Minimal Soulbound NFTs, estado Final).
///         Identificador de interfaz ERC-165: 0xb45a3c0e
interface IERC5192 {
    event Locked(uint256 tokenId);
    event Unlocked(uint256 tokenId);
    function locked(uint256 tokenId) external view returns (bool);
}

/**
 * @title DiplomaSBT · Laboratorio 11 · RETO OPCIONAL · VERSIÓN DE TRABAJO
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 11
 *
 * El mismo diploma, pero NO transferible («soulbound», ERC-5192). Requiere
 * que DiplomaUSB.sol ya esté completo. Cópienlo sobre contracts/s11/DiplomaSBT.sol
 * y completen los TODO. Pruebas:
 *
 *     npx hardhat test test/s11/DiplomaSBT.test.js
 *
 * La regla de ERC-5192: si locked(id) devuelve true, TODA función de ERC-721
 * que mueva el token de una cuenta a otra debe revertir.
 *
 * Material de clase, sin auditar. Nunca con dinero real.
 */
contract DiplomaSBT is DiplomaUSB, IERC5192 {
    error DiplomaIntransferible(uint256 tokenId);

    event DiplomaRevocado(uint256 indexed tokenId, string motivo);

    constructor(uint256 tope_) DiplomaUSB(tope_) {}

    function locked(uint256 tokenId) external view returns (bool) {
        // TODO 1 · si el token no existe, revertir; si existe, está bloqueado.
        //   pista: _requireOwned(tokenId) revierte con ERC721NonexistentToken
        //   si no existe. Después, return true.
    }

    function revocar(uint256 tokenId, string calldata motivo) external onlyOwner {
        // TODO 2 · quemar el token con _burn(tokenId) y emitir DiplomaRevocado.
    }

    /// @dev En OpenZeppelin v5 TODO movimiento de un token pasa por aquí:
    ///      emisión (de 0 a alguien), quema (de alguien a 0) y transferencia.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        // TODO 3 · antes de llamar a super:
        //   address from = _ownerOf(tokenId);
        //   si from != address(0) Y to != address(0) → es una transferencia
        //   → revert DiplomaIntransferible(tokenId)
        //
        // TODO 4 · después de llamar a super: si from == address(0) (fue una
        //   emisión), emit Locked(tokenId). Pista: guarden el resultado de
        //   super._update en una variable y devuélvanlo al final.
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(IERC5192).interfaceId || super.supportsInterface(interfaceId);
    }
}
