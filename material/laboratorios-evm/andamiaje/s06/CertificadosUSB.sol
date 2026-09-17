// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Registro de certificados académicos · Laboratorio 06 · VERSIÓN DE TRABAJO
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 6
 *
 * Este archivo COMPILA tal como está, pero no hace nada. Completen cada
 * bloque marcado con TODO, en orden. Después de cada uno: compilar en Remix,
 * desplegar en la «Remix VM» y probar a mano antes de seguir.
 *
 * Regla de diseño: en la cadena NO va el nombre, ni la cédula, ni ningún
 * dato personal. Solo el hash del archivo del diploma.
 */
contract CertificadosUSB {
    /* ------------------------------------------------------------- estado */

    struct Certificado {
        string programa;
        uint64 fechaEmision;
        bool revocado;
        bool existe;
    }

    address public emisor;
    uint256 public emitidos;
    mapping(bytes32 => Certificado) private _certificados;

    /* ------------------------------------------------------------ errores */

    error NoEsEmisor(address quien);
    error HashVacio();
    error ProgramaVacio();
    error YaEmitido(bytes32 hashDocumento);
    error NoExiste(bytes32 hashDocumento);
    error YaRevocado(bytes32 hashDocumento);
    error DireccionCero();

    /* ------------------------------------------------------------ eventos */

    event CertificadoEmitido(bytes32 indexed hashDocumento, string programa, uint64 fecha);
    event CertificadoRevocado(bytes32 indexed hashDocumento, string motivo);
    event EmisorCambiado(address indexed anterior, address indexed nuevo);

    /* -------------------------------------------------------- modificador */

    modifier soloEmisor() {
        // TODO 1 · si quien llama (msg.sender) no es el emisor, revertir con NoEsEmisor(msg.sender)
        _;
    }

    /* -------------------------------------------------------- constructor */

    constructor() {
        // TODO 2 · quien despliega queda como emisor, y se emite EmisorCambiado(address(0), msg.sender)
    }

    /* ---------------------------------------------------------- funciones */

    function emitir(bytes32 hashDocumento, string calldata programa) external soloEmisor {
        // TODO 3 · validaciones, en este orden:
        //   - hash en cero               → revert HashVacio()
        //   - programa vacío             → revert ProgramaVacio()     pista: bytes(programa).length
        //   - ya existe ese hash         → revert YaEmitido(hashDocumento)
        //
        // TODO 4 · efectos:
        //   - guardar el Certificado con fechaEmision = uint64(block.timestamp) y existe = true
        //   - sumar 1 a emitidos
        //   - emitir CertificadoEmitido
    }

    function revocar(bytes32 hashDocumento, string calldata motivo) external soloEmisor {
        // TODO 5 · pista: Certificado storage c = _certificados[hashDocumento];
        //   - si no existe          → revert NoExiste(hashDocumento)
        //   - si ya está revocado   → revert YaRevocado(hashDocumento)
        //   - marcar revocado y emitir CertificadoRevocado
        //
        //   ¿Por qué se revoca en lugar de borrar? Respóndanlo en el informe.
    }

    function verificar(bytes32 hashDocumento)
        external
        view
        returns (bool valido, string memory programa, uint64 fechaEmision, bool revocado)
    {
        // TODO 6 · es válido si existe Y no está revocado. Devolver los cuatro valores.
    }

    function cambiarEmisor(address nuevo) external soloEmisor {
        // TODO 7 · rechazar address(0) con DireccionCero(), emitir EmisorCambiado y actualizar emisor
    }
}
