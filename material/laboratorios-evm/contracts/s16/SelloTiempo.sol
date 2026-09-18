// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title SelloTiempo · Laboratorio 16 · el mismo contrato en L1 y en L2
 * @notice Un sello de tiempo mínimo: guarda el hash de un documento y el
 *         momento en que se registró (prueba de existencia, Sesiones 2 y 6).
 *         Es deliberadamente pequeño y sin dependencias para que el MISMO
 *         bytecode se despliegue sin cambios en Sepolia y en OP Sepolia, y la
 *         comparación de costos sea justa.
 *
 * Solo se guarda el HASH, nunca el documento ni datos personales (Ley 1581
 * de 2012).
 *
 * Material de clase, sin auditar.
 */
contract SelloTiempo {
    mapping(bytes32 => uint256) public selladoEn;   // hash → timestamp (0 = no existe)
    mapping(bytes32 => address) public selladoPor;
    uint256 public totalSellos;

    event Sellado(bytes32 indexed hash, address indexed quien, uint256 cuando);

    error YaSellado(bytes32 hash, uint256 cuando);

    function sellar(bytes32 hash) external {
        if (selladoEn[hash] != 0) revert YaSellado(hash, selladoEn[hash]);
        selladoEn[hash] = block.timestamp;
        selladoPor[hash] = msg.sender;
        totalSellos += 1;
        emit Sellado(hash, msg.sender, block.timestamp);
    }
}
