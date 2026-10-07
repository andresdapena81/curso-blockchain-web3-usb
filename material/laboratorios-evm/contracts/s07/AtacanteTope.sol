// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IEntradas {
    function comprar() external payable returns (uint256);
    function ponerEnVenta(uint256 tokenId, uint256 precio) external;
    function comprarReventa(uint256 tokenId) external payable;
    function topeReventa() external view returns (uint256);
    function precioOriginal() external view returns (uint256);
}

/**
 * @title AtacanteTope · Laboratorio 07
 * @notice Un revendedor que SÍ sabe programar. No usa la interfaz oficial:
 *         llama al contrato directamente, que es lo que hace cualquiera con
 *         malas intenciones y una tarde libre.
 *
 * @dev Cada función de aquí es un intento distinto de rodear el tope de
 *      reventa. El laboratorio consiste en correr las pruebas y entender
 *      POR QUÉ falla cada una... y encontrar la única que no falla.
 *
 *      Material de clase. Sin auditar. Nunca con dinero real.
 */
contract AtacanteTope is IERC721Receiver {
    IEntradas public immutable entradas;
    address public immutable duenno;

    error NoEraElDuenno();

    constructor(address entradas_) {
        entradas = IEntradas(entradas_);
        duenno = msg.sender;
    }

    /// Para poder recibir entradas: un ERC-721 exige que el receptor avise que sabe recibirlas.
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable {}

    /// Compra una entrada del lote original, al precio oficial.
    function comprarOriginal() external payable returns (uint256) {
        return entradas.comprar{value: msg.value}();
    }

    // =====================================================================
    // INTENTO 1 · «le paso la entrada a mi comprador y él me paga por fuera»
    // =====================================================================
    /// @dev Llama a transferFrom directamente, sin pasar por comprarReventa.
    ///      Es el intento obvio, y el que todo el mundo prueba primero.
    function intentoTransferenciaDirecta(uint256 tokenId, address comprador) external {
        IERC721(address(entradas)).transferFrom(address(this), comprador, tokenId);
    }

    // =====================================================================
    // INTENTO 2 · «la versión segura de la transferencia, por si acaso»
    // =====================================================================
    function intentoTransferenciaSegura(uint256 tokenId, address comprador) external {
        IERC721(address(entradas)).safeTransferFrom(address(this), comprador, tokenId);
    }

    // =====================================================================
    // INTENTO 3 · «apruebo a un cómplice para que la saque él»
    // =====================================================================
    /// @dev La aprobación SÍ se concede: aprobar no mueve nada. El bloqueo
    ///      aparece cuando el cómplice intenta usarla.
    function intentoAprobarAComplice(uint256 tokenId, address complice) external {
        IERC721(address(entradas)).approve(complice, tokenId);
    }

    // =====================================================================
    // INTENTO 4 · «pongo en venta por encima del tope»
    // =====================================================================
    function intentoPrecioSobreTope(uint256 tokenId, uint256 precioAbusivo) external {
        entradas.ponerEnVenta(tokenId, precioAbusivo);
    }

    // =====================================================================
    // INTENTO 5 · el que NO falla, y es el más interesante de los cinco
    // =====================================================================
    /**
     * @dev Pone la entrada en venta EN EL TOPE, que es perfectamente legal, y
     *      se la vende a un comprador que ya le pagó la diferencia por fuera
     *      de la cadena: en efectivo, por transferencia bancaria, en cripto a
     *      otra dirección. El contrato no ve ese pago y no puede verlo.
     *
     *      Esto no es un error del contrato: es el límite de lo que un
     *      contrato puede hacer cumplir. La regla rige lo que pasa ADENTRO.
     */
    function ponerEnVentaEnElTope(uint256 tokenId) external {
        if (msg.sender != duenno) revert NoEraElDuenno();
        entradas.ponerEnVenta(tokenId, entradas.topeReventa());
    }
}
