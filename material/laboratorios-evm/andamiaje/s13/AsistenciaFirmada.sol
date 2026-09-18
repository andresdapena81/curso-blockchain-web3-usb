// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

/**
 * @title AsistenciaFirmada · Laboratorio 13 · VERSIÓN DE TRABAJO
 *
 * Copien este archivo sobre contracts/s13/AsistenciaFirmada.sol y corran:
 *     npx hardhat test test/s13/AsistenciaFirmada.test.js
 * El laboratorio está completo cuando pasan las 16 pruebas.
 *
 * Compila tal como está. Completen los TODO en orden: primero el hash (TODO 1),
 * luego la verificación (TODO 2 a 5). La guía explica cada uno.
 *
 * El estudiante FIRMA fuera de la cadena (gratis) el mensaje tipado
 *     Asistencia(address estudiante, uint256 sesion, uint256 nonce, uint256 vence)
 * y cualquiera lo ENVÍA al contrato pagando el gas.
 *
 * Material de clase, sin auditar. Nunca registren datos personales en cadena.
 */
contract AsistenciaFirmada is EIP712, Nonces {
    /// @dev keccak256 del tipo, escrito EXACTAMENTE como lo firma la billetera.
    bytes32 public constant ASISTENCIA_TYPEHASH =
        keccak256("Asistencia(address estudiante,uint256 sesion,uint256 nonce,uint256 vence)");

    /// sesion => estudiante => asistió
    mapping(uint256 => mapping(address => bool)) public asistio;

    event AsistenciaRegistrada(
        address indexed estudiante,
        uint256 indexed sesion,
        address indexed enviadaPor,
        uint256 nonce
    );

    error FirmaVencida(uint256 vence, uint256 ahora);
    error FirmaInvalida(address recuperado, address esperado);

    constructor() EIP712("AsistenciaUSB", "1") {}

    /// @notice El resumen (digest) EIP-712 que el estudiante firma.
    function hashAsistencia(address estudiante, uint256 sesion, uint256 nonce, uint256 vence)
        public
        view
        returns (bytes32)
    {
        // TODO 1 · Dos líneas:
        //   bytes32 hashStruct = keccak256(abi.encode(ASISTENCIA_TYPEHASH, estudiante, sesion, nonce, vence));
        //   return _hashTypedDataV4(hashStruct);
        // Ojo: abi.encode, NO abi.encodePacked. Y los campos en el MISMO orden del tipo.
        // (las cuatro líneas siguientes solo existen para que compile; bórrenlas)
        estudiante; sesion; nonce; vence;
        return bytes32(0);
    }

    /// @notice Quién firmó este mensaje (lectura, no cuesta gas). Útil para depurar.
    function firmante(address estudiante, uint256 sesion, uint256 nonce, uint256 vence, bytes calldata firma)
        external
        view
        returns (address)
    {
        return ECDSA.recover(hashAsistencia(estudiante, sesion, nonce, vence), firma);
    }

    /// @notice Registra la asistencia con la firma del estudiante. La puede enviar cualquiera.
    function registrar(address estudiante, uint256 sesion, uint256 nonce, uint256 vence, bytes calldata firma)
        external
    {
        // TODO 2 · ¿sigue vigente? Si block.timestamp > vence:
        //          revert FirmaVencida(vence, block.timestamp);
        //
        // TODO 3 · ¿la firmó el estudiante? Recuperen la dirección:
        //          address recuperado = ECDSA.recover(hashAsistencia(...los cuatro campos...), firma);
        //          si recuperado != estudiante: revert FirmaInvalida(recuperado, estudiante);
        //
        // TODO 4 · ¿es el nonce que toca? Una sola línea de OpenZeppelin que además lo CONSUME:
        //          _useCheckedNonce(estudiante, nonce);
        //          (si no coincide, revierte sola con InvalidAccountNonce)
        //
        // TODO 5 · Efecto y evento:
        //          asistio[sesion][estudiante] = true;
        //          emit AsistenciaRegistrada(estudiante, sesion, msg.sender, nonce);
        //
        // Pregunta para el informe: si intercambian los TODO 3 y 4, ¿se rompe la seguridad?
        // Piensen qué deshace un revert, y qué dice el patrón checks-effects-interactions.
        // (la línea siguiente solo existe para que compile; bórrenla)
        estudiante; sesion; nonce; vence; firma;
    }
}
