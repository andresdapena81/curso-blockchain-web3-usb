// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title BancoVulnerable · Laboratorio 09 · reentrancy en vivo
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 9
 *
 * Reproduce, en pequeño, el error de The DAO (2016). Parece correcto:
 * lleva la cuenta de cada depósito y solo deja retirar lo propio. El fallo
 * es el ORDEN: envía el dinero ANTES de poner el saldo en cero.
 *
 * NUNCA usar. Existe para ser explotado en clase y después corregido.
 */
contract BancoVulnerable {
    mapping(address => uint256) public saldos;

    function depositar() external payable {
        saldos[msg.sender] += msg.value;
    }

    function retirar() external {
        uint256 monto = saldos[msg.sender];
        require(monto > 0, "sin saldo");

        // INTERACCION antes que EFFECT: aqui esta el error.
        (bool ok, ) = payable(msg.sender).call{value: monto}("");
        require(ok, "envio fallido");

        saldos[msg.sender] = 0;   // demasiado tarde: el atacante ya volvio a entrar
    }

    function balanceTotal() external view returns (uint256) {
        return address(this).balance;
    }
}
