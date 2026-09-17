// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DiplomaUSB · Laboratorio 11 · credencial verificable como NFT
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 11
 *
 * Cada diploma es un token ÚNICO (no fungible). Su metadata —el JSON con el
 * programa, la fecha y el enlace al archivo— vive en IPFS, no en la cadena:
 * en la cadena va solo el tokenURI que apunta a ese JSON por su CID.
 *
 * DECISIÓN DE DISEÑO: se usa tokenURI de IPFS (ipfs://CID). Una URL
 * https://miuniversidad.edu/diploma/1 rompería la promesa: el día que ese
 * servidor cambie o caiga, el NFT apunta a la nada. IPFS direcciona por
 * CONTENIDO: el CID ES el hash del archivo, así que no puede cambiar sin
 * que cambie el enlace.
 *
 * Igual que en la S6: en la cadena NO hay datos personales. El JSON en IPFS
 * tampoco debe llevarlos si el CID va a ser público; para un diploma real se
 * cifraría o se publicaría solo el hash. Aquí se usa metadata de PRUEBA.
 *
 * Material de clase, sin auditar. Nunca con dinero real.
 */
contract DiplomaUSB is ERC721, ERC721URIStorage, Ownable {
    uint256 private _siguienteId = 1;

    event DiplomaEmitido(uint256 indexed tokenId, address indexed a, string uri);

    constructor() ERC721("Diploma USB", "DUSB") Ownable(msg.sender) {}

    /// @notice Solo la universidad emite. Devuelve el id del diploma creado.
    function emitir(address a, string calldata uri) external onlyOwner returns (uint256 tokenId) {
        tokenId = _siguienteId++;
        _safeMint(a, tokenId);
        _setTokenURI(tokenId, uri);
        emit DiplomaEmitido(tokenId, a, uri);
    }

    function totalEmitidos() external view returns (uint256) {
        return _siguienteId - 1;
    }

    // OpenZeppelin v5: ERC721 y ERC721URIStorage comparten estos dos métodos
    // y hay que resolver el conflicto de herencia explícitamente.
    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721URIStorage) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
