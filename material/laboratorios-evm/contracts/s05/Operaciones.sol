// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Operaciones · Laboratorio 05 · el costo real de cada instrucción
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 5
 *
 * Cada función hace UNA sola cosa costosa, para poder aislar su gas.
 * El ejercicio consiste en PREDECIR el gas de cada una antes de medirlo.
 *
 * No es un contrato útil: es un instrumento de medición.
 */
contract Operaciones {
    uint256 public valor;          // ranura de almacenamiento 0
    uint256[] private _lista;

    event Registrado(address indexed quien, uint256 valor);

    /// Escribe en una ranura que estaba en CERO. Es la operación más cara de la EVM.
    function escribirNueva(uint256 v) external {
        valor = v;
    }

    /// Sobrescribe una ranura que YA tenía un valor distinto de cero.
    function sobrescribir(uint256 v) external {
        valor = v;
    }

    /// Pone la ranura de nuevo en cero. El protocolo devuelve parte del gas.
    function borrar() external {
        delete valor;
    }

    /// Lee la ranura sin escribir. Llamada como transacción, para medirla.
    function leerEnTransaccion() external returns (uint256) {
        return valor;
    }

    /// No toca el almacenamiento: deja constancia con un evento.
    function registrarConEvento(uint256 v) external {
        emit Registrado(msg.sender, v);
    }

    /// Suma un arreglo copiándolo primero a memoria.
    function sumarEnMemoria(uint256[] memory datos) external pure returns (uint256 total) {
        for (uint256 i = 0; i < datos.length; i++) total += datos[i];
    }

    /// Suma el mismo arreglo leyéndolo directamente de los datos de la llamada.
    function sumarEnCalldata(uint256[] calldata datos) external pure returns (uint256 total) {
        for (uint256 i = 0; i < datos.length; i++) total += datos[i];
    }

    /// Agrega n elementos a un arreglo en almacenamiento: el costo crece con n.
    function agregar(uint256 n) external {
        for (uint256 i = 0; i < n; i++) _lista.push(i + 1);
    }

    function largo() external view returns (uint256) {
        return _lista.length;
    }
}
