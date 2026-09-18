// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DiplomaUSB · Laboratorio 11 · VERSIÓN DE TRABAJO
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 11
 *
 * Este archivo COMPILA tal como está, pero emitir() no hace nada. Cópienlo
 * sobre contracts/s11/DiplomaUSB.sol y completen los TODO en orden. Después
 * de cada uno, corran:
 *
 *     npx hardhat test test/s11/DiplomaUSB.test.js
 *
 * Al empezar fallan las pruebas marcadas con ★. Terminan cuando las 11 pasan.
 *
 * Reglas de diseño que NO se negocian:
 *   - el tokenURI es ipfs://CID (nunca una URL https de un servidor propio);
 *   - ni en la cadena ni en el JSON de IPFS va un dato personal (Ley 1581 de
 *     2012): nada de nombres, cédulas ni correos. Metadata de PRUEBA.
 *
 * Material de clase, sin auditar. Nunca con dinero real.
 */
contract DiplomaUSB is ERC721, ERC721URIStorage, Ownable {
    /// @notice Máximo de diplomas que este contrato podrá emitir jamás.
    uint256 public immutable tope;

    uint256 private _siguienteId = 1;

    error TopeAlcanzado(uint256 tope);
    error URIVacio();

    event DiplomaEmitido(uint256 indexed tokenId, address indexed a, string uri);

    constructor(uint256 tope_) ERC721("Diploma USB", "DUSB") Ownable(msg.sender) {
        tope = tope_;
    }

    /// @notice Solo la universidad emite (el modificador onlyOwner ya está puesto).
    function emitir(address a, string calldata uri) external onlyOwner returns (uint256 tokenId) {
        // TODO 1 · CHECKS, en este orden:
        //   - uri vacío                         → revert URIVacio()
        //     pista: bytes(uri).length == 0
        //   - ya se emitieron `tope` diplomas   → revert TopeAlcanzado(tope)
        //     pista: si _siguienteId > tope, ya no cabe otro
        //
        // TODO 2 · EFFECTS:
        //   - tokenId = _siguienteId++;       (el primer diploma es el 1, no el 0)
        //   - _setTokenURI(tokenId, uri);     guarda el enlace a la metadata
        //
        // TODO 3 · INTERACTION y evento:
        //   - _safeMint(a, tokenId);          crea el token y se lo asigna a `a`.
        //     Va DESPUÉS de los efectos: si `a` es un contrato, _safeMint le
        //     llama onERC721Received, y para entonces el estado ya debe estar escrito.
        //   - emit DiplomaEmitido(tokenId, a, uri);
        //
        // Pregunta para el informe: ¿qué evento estándar de ERC-721 aparece en el
        // recibo además de DiplomaEmitido, y con qué dirección de origen?
    }

    function totalEmitidos() external view returns (uint256) {
        // TODO 4 · cuántos diplomas se han emitido. Pista: el siguiente id menos 1.
    }

    // OpenZeppelin v5: ERC721 y ERC721URIStorage comparten estos dos métodos
    // y hay que resolver el conflicto de herencia explícitamente. YA ESTÁN HECHOS:
    // léanlos y expliquen en el informe por qué el contrato no compila sin ellos.
    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view virtual override(ERC721, ERC721URIStorage) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
