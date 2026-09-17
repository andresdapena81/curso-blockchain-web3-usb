// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title OraculoConsumidor · Laboratorio 14 · leer un precio de un oráculo
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 14
 *
 * Un contrato NO puede consultar internet (Sesión 5: la EVM es determinista).
 * Para saber el precio del ETH necesita un ORÁCULO: un contrato externo que
 * alguien mantiene actualizado. Chainlink expone la interfaz AggregatorV3.
 *
 * Este contrato consume esa interfaz. En las pruebas se le pasa un oráculo
 * FALSO (OraculoFalso) para no depender de la red: así se ve, además, por qué
 * un oráculo manipulable es un vector de ataque.
 *
 * Material de clase, sin auditar.
 */
interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

contract OraculoConsumidor {
    AggregatorV3Interface public immutable feed;

    error PrecioInvalido();
    error PrecioViejo(uint256 antiguedadSegundos);

    constructor(address feed_) {
        feed = AggregatorV3Interface(feed_);
    }

    /// @notice Precio actual, ya normalizado a 18 decimales.
    /// @dev Comprueba dos cosas que casi todos olvidan: que el precio sea
    ///      positivo y que no sea rancio (updatedAt reciente). Un oráculo que
    ///      dejó de actualizarse es tan peligroso como uno manipulado.
    function precioEth(uint256 maxAntiguedad) external view returns (uint256) {
        (, int256 answer, , uint256 updatedAt, ) = feed.latestRoundData();
        if (answer <= 0) revert PrecioInvalido();
        uint256 antiguedad = block.timestamp - updatedAt;
        if (antiguedad > maxAntiguedad) revert PrecioViejo(antiguedad);

        uint8 d = feed.decimals();
        return uint256(answer) * (10 ** (18 - d));   // a 18 decimales
    }
}
