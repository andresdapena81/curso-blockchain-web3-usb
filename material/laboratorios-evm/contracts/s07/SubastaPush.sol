// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ISubasta} from "./ISubasta.sol";

/**
 * @title Subasta con devolución inmediata · ANTIPATRÓN · Laboratorio 07
 * @notice NO usar. Existe para compararla con Subasta.sol.
 *
 * Parece más amable: al superar una puja, devuelve el dinero al instante.
 * El problema es que el contrato llama a una dirección que no controla. Si
 * esa dirección es un contrato que rechaza el pago, la devolución revierte,
 * y con ella TODA puja nueva. Un solo postor hostil congela la subasta.
 */
contract SubastaPush is ISubasta {
    address public immutable beneficiario;
    uint256 public immutable fin;

    address public mejorPostor;
    uint256 public mejorPuja;
    bool public finalizada;

    error SubastaCerrada();
    error SubastaAbierta();
    error YaFinalizada();
    error PujaInsuficiente(uint256 minimoAceptado, uint256 recibido);
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

        address anterior = mejorPostor;
        uint256 montoAnterior = mejorPuja;

        mejorPostor = msg.sender;
        mejorPuja = msg.value;

        // PUSH: devolver ya. Si `anterior` rechaza el pago, esta puja entera revierte.
        if (anterior != address(0)) {
            (bool ok, ) = payable(anterior).call{value: montoAnterior}("");
            if (!ok) revert EnvioFallido();
        }

        emit NuevaPuja(msg.sender, msg.value);
    }

    function finalizar() external {
        if (block.timestamp < fin) revert SubastaAbierta();
        if (finalizada) revert YaFinalizada();
        finalizada = true;
        (bool ok, ) = payable(beneficiario).call{value: mejorPuja}("");
        if (!ok) revert EnvioFallido();
        emit SubastaFinalizada(mejorPostor, mejorPuja);
    }
}
