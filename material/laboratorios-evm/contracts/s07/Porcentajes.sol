// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Porcentajes en puntos básicos
 * @notice Sin punto flotante, un porcentaje se expresa en puntos básicos:
 *         10 000 bps = 100 %, 100 bps = 1 %, 1 bp = 0,01 %.
 *
 *         Con `using Porcentajes for uint256;` se escribe  monto.aplicarBps(250)
 *         en lugar de  Porcentajes.aplicarBps(monto, 250).
 */
library Porcentajes {
    uint256 internal constant BASE = 10_000;

    error BpsFueraDeRango(uint256 bps);

    /// @notice Devuelve `bps` puntos básicos de `monto`, redondeando hacia abajo.
    function aplicarBps(uint256 monto, uint256 bps) internal pure returns (uint256) {
        if (bps > BASE) revert BpsFueraDeRango(bps);
        return (monto * bps) / BASE;   // multiplicar ANTES de dividir
    }
}
