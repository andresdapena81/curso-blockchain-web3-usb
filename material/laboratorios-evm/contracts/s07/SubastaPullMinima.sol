// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ISubasta} from "./ISubasta.sol";

/**
 * @title Subasta pull mínima · Laboratorio 07
 * @notice Idéntica a SubastaPush en todo, excepto en cómo devuelve el dinero.
 *         Existe solo para que la comparación de gas push/pull sea justa:
 *         Subasta.sol además registra participantes y tiene pausa, y eso
 *         también cuesta gas.
 */
contract SubastaPullMinima is ISubasta {
    address public immutable beneficiario;
    uint256 public immutable fin;

    address public mejorPostor;
    uint256 public mejorPuja;
    bool public finalizada;
    mapping(address => uint256) public pendientes;

    error SubastaCerrada();
    error SubastaAbierta();
    error YaFinalizada();
    error PujaInsuficiente(uint256 minimoAceptado, uint256 recibido);
    error NadaQueRetirar();
    error EnvioFallido();

    constructor(uint256 duracionSegundos) {
        beneficiario = msg.sender;
        fin = block.timestamp + duracionSegundos;
    }

    function estado() external view returns (Estado) {
        if (finalizada) return Estado.Finalizada;
        if (block.timestamp >= fin) return Estado.PorFinalizar;
        return Estado.Abierta;
    }

    function pujar() external payable override {
        if (block.timestamp >= fin) revert SubastaCerrada();
        if (msg.value <= mejorPuja) revert PujaInsuficiente(mejorPuja + 1, msg.value);

        if (mejorPostor != address(0)) {
            pendientes[mejorPostor] += mejorPuja;     // PULL: acreditar, no enviar
        }
        mejorPostor = msg.sender;
        mejorPuja = msg.value;
        emit NuevaPuja(msg.sender, msg.value);
    }

    function retirar() external {
        uint256 monto = pendientes[msg.sender];
        if (monto == 0) revert NadaQueRetirar();
        pendientes[msg.sender] = 0;
        (bool ok, ) = payable(msg.sender).call{value: monto}("");
        if (!ok) revert EnvioFallido();
        emit Retiro(msg.sender, monto);
    }

    function finalizar() external {
        if (block.timestamp < fin) revert SubastaAbierta();
        if (finalizada) revert YaFinalizada();
        finalizada = true;
        pendientes[beneficiario] += mejorPuja;
        emit SubastaFinalizada(mejorPostor, mejorPuja);
    }
}
