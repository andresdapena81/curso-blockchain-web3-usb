// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ISubasta} from "./ISubasta.sol";
import {Porcentajes} from "./Porcentajes.sol";

/**
 * @title Subasta inglesa con patrón de retiro · Laboratorio 07 · VERSIÓN DE TRABAJO
 *
 * Copien este archivo sobre contracts/s07/Subasta.sol y corran:
 *     npx hardhat test test/s07/Subasta.test.js
 * Al empezar: 7 passing, 16 failing. El laboratorio está completo cuando
 * pasan las 23 pruebas. Guía: guias/s07-subasta-patrones.pdf
 *
 * Compila tal como está. Completen los TODO en orden.
 */
contract Subasta is ISubasta, Ownable, Pausable {
    using Porcentajes for uint256;

    uint256 public constant INCREMENTO_MINIMO_BPS = 100; // 1 %

    uint256 public immutable fin;
    uint256 public immutable pujaMinima;

    address public mejorPostor;
    uint256 public mejorPuja;
    bool public finalizada;

    mapping(address => uint256) public pendientes;
    mapping(address => bool) public participo;
    address[] private _participantes;

    error SubastaCerrada();
    error SubastaAbierta();
    error YaFinalizada();
    error PujaInsuficiente(uint256 minimoAceptado, uint256 recibido);
    error NadaQueRetirar();
    error EnvioFallido();
    error DuracionInvalida();

    constructor(uint256 duracionSegundos, uint256 pujaMinima_) Ownable(msg.sender) {
        if (duracionSegundos == 0) revert DuracionInvalida();
        fin = block.timestamp + duracionSegundos;
        pujaMinima = pujaMinima_;
    }

    function estado() public view returns (Estado) {
        // TODO 1 · Finalizada si ya se finalizó; PorFinalizar si pasó `fin`; si no, Abierta.
    }

    function minimoSiguiente() public view returns (uint256) {
        // TODO 2 · si nadie ha pujado: pujaMinima.
        //          si no: mejorPuja + mejorPuja.aplicarBps(INCREMENTO_MINIMO_BPS)
    }

    function participantes() external view returns (address[] memory) {
        return _participantes;
    }

    function pujar() external payable override whenNotPaused {
        // TODO 3 · CHECKS: revertir si la subasta cerró (tiempo o finalizada)
        //                  revertir si msg.value < minimoSiguiente()
        //
        // TODO 4 · EFFECTS: si había un mejor postor, ACREDITAR su puja en `pendientes`.
        //                   NO le envíen el dinero aquí: esa es la lección del laboratorio.
        //                   Actualizar mejorPostor y mejorPuja.
        //                   Registrar al participante si es la primera vez.
        //                   Emitir NuevaPuja.
    }

    function retirar() external {
        // TODO 5 · En este orden exacto, y expliquen en el informe por qué el orden importa:
        //   1. leer el monto pendiente; si es cero, NadaQueRetirar
        //   2. poner el pendiente en CERO
        //   3. enviar con call y revertir con EnvioFallido si falla
        //   4. emitir Retiro
    }

    function finalizar() external {
        // TODO 6 · revertir si aún no vence o si ya se finalizó
        //          marcar finalizada
        //          acreditar mejorPuja al dueño (owner()) en `pendientes`
        //          emitir SubastaFinalizada
    }

    function pausar() external onlyOwner {
        _pause();
    }

    function reanudar() external onlyOwner {
        _unpause();
    }
}
