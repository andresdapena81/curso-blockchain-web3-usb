// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Empaquetado de variables en storage · Laboratorio 07
 * @notice Mismos datos, distinto orden de declaración.
 *
 * El storage se organiza en ranuras de 32 bytes. Variables consecutivas que
 * caben juntas en 32 bytes comparten ranura. Declarar un uint256 en medio de
 * dos tipos pequeños los separa y obliga a usar una ranura más.
 */
contract Empaquetado {
    // DESORDENADO: uint64 (8 bytes) | uint256 (32) | uint64 (8)  → 3 ranuras
    struct Desordenado {
        uint64 a;
        uint256 b;
        uint64 c;
    }

    // ORDENADO:    uint64 + uint64 juntos (16 bytes) | uint256   → 2 ranuras
    struct Ordenado {
        uint64 a;
        uint64 c;
        uint256 b;
    }

    Desordenado public desordenado;
    Ordenado public ordenado;

    function guardarDesordenado(uint64 a, uint256 b, uint64 c) external {
        desordenado = Desordenado(a, b, c);
    }

    function guardarOrdenado(uint64 a, uint256 b, uint64 c) external {
        ordenado = Ordenado(a, c, b);
    }
}
