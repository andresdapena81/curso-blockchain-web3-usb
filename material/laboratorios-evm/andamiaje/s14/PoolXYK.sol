// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title PoolXYK · Laboratorio 14 · un AMM de producto constante, en miniatura
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 14 · VERSIÓN DE TRABAJO
 *
 * Copien este archivo sobre contracts/s14/PoolXYK.sol y corran:
 *     npx hardhat test test/s14/PoolXYK.test.js
 * El laboratorio está completo cuando pasan las 15 pruebas. Compila tal como
 * está; completen los TODO 1 (cotizar), 2 (intercambiar) y 3 (quitarLiquidez).
 *
 * Es la idea de Uniswap v2 reducida a lo esencial, para LEERLA y medirla:
 *
 *   - Un pool guarda dos reservas, A y B. El precio de A, en B, es reservaB / reservaA.
 *   - Quien intercambia mete una cantidad de un token y saca del otro la que
 *     mantiene el producto  reservaA · reservaB = k  (con la comisión, k crece un poco).
 *   - De cada entrada se descuenta una comisión del 0,30 % que se queda en el pool:
 *     es la ganancia de los proveedores de liquidez (LP).
 *   - Los LP reciben «participaciones» (un ERC-20) proporcionales a lo que aportan.
 *
 * Lo que deliberadamente NO tiene (y un AMM real sí): oráculo TWAP, protección
 * contra reentrada por tokens raros, liquidez mínima bloqueada, fábrica de
 * pares, ruteo. Material de clase, sin auditar. NUNCA con fondos reales.
 */
contract PoolXYK is ERC20 {
    using SafeERC20 for IERC20;

    uint256 public constant COMISION_BPS = 30; // 0,30 %
    uint256 private constant BPS = 10_000;

    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;

    uint256 public reservaA;
    uint256 public reservaB;

    event LiquidezAgregada(address indexed proveedor, uint256 montoA, uint256 montoB, uint256 participaciones);
    event LiquidezRetirada(address indexed proveedor, uint256 montoA, uint256 montoB, uint256 participaciones);
    event Intercambio(address indexed usuario, address indexed tokenEntrada, uint256 montoEntrada, uint256 montoSalida);

    error TokenInvalido(address token);
    error MontoCero();
    error SinLiquidez();
    error SlippageExcedido(uint256 minimoAceptado, uint256 obtenido);

    constructor(IERC20 tokenA_, IERC20 tokenB_) ERC20("Participacion Pool XYK", "LP-XYK") {
        tokenA = tokenA_;
        tokenB = tokenB_;
    }

    /* ------------------------------------------------------------ lecturas */

    /// @notice Precio spot de A expresado en B, con 18 decimales. Se mueve con CADA intercambio:
    ///         por eso NUNCA debe usarse como oráculo (se manipula en una sola transacción).
    function precioSpotA() external view returns (uint256) {
        if (reservaA == 0) revert SinLiquidez();
        return (reservaB * 1e18) / reservaA;
    }

    /// @notice Cuánto sale del otro token si se meten `montoEntrada` de `tokenEntrada`.
    /// @dev    entradaNeta = montoEntrada · (1 − 0,003)
    ///         salida      = reservaSalida · entradaNeta / (reservaEntrada + entradaNeta)
    ///         Se despeja de (reservaEntrada + entradaNeta) · (reservaSalida − salida) = k.
    function cotizar(address tokenEntrada, uint256 montoEntrada) public view returns (uint256) {
        (uint256 rEntrada, uint256 rSalida) = _reservasPara(tokenEntrada);
        // TODO 1 · La fórmula del AMM, con la comisión:
        //   - si montoEntrada == 0: revert MontoCero();
        //   - si alguna reserva es 0: revert SinLiquidez();
        //   - entradaNeta = montoEntrada * (BPS - COMISION_BPS)        ← ya multiplicada por 10 000
        //   - return (rSalida * entradaNeta) / (rEntrada * BPS + entradaNeta);
        // Multipliquen ANTES de dividir: en Solidity la división entera trunca.
        // Comprueben a mano: 2 000 TUSD contra 10 TETH / 20 000 TUSD deben dar 0,906610893880149131 TETH.
        rEntrada; rSalida; montoEntrada;   // solo para que compile; bórrenla
        return 0;
    }

    /* --------------------------------------------------------- liquidez */

    /// @notice Aporta liquidez. Si el pool ya tiene fondos, solo se toma la parte
    ///         PROPORCIONAL a las reservas (el sobrante de un token no se cobra).
    function agregarLiquidez(uint256 maxA, uint256 maxB) external returns (uint256 participaciones) {
        if (maxA == 0 || maxB == 0) revert MontoCero();
        uint256 montoA;
        uint256 montoB;
        uint256 total = totalSupply();

        if (total == 0) {
            // primer proveedor: fija el precio inicial con la proporción que elige
            (montoA, montoB) = (maxA, maxB);
            participaciones = Math.sqrt(montoA * montoB);
        } else {
            uint256 bOptimo = (maxA * reservaB) / reservaA;
            if (bOptimo <= maxB) {
                (montoA, montoB) = (maxA, bOptimo);
            } else {
                (montoA, montoB) = ((maxB * reservaA) / reservaB, maxB);
            }
            participaciones = Math.min((montoA * total) / reservaA, (montoB * total) / reservaB);
        }
        if (participaciones == 0) revert MontoCero();

        reservaA += montoA;
        reservaB += montoB;
        _mint(msg.sender, participaciones);

        tokenA.safeTransferFrom(msg.sender, address(this), montoA);
        tokenB.safeTransferFrom(msg.sender, address(this), montoB);
        emit LiquidezAgregada(msg.sender, montoA, montoB, participaciones);
    }

    /// @notice Devuelve participaciones y retira la parte proporcional de AMBAS reservas.
    function quitarLiquidez(uint256 participaciones) external returns (uint256 montoA, uint256 montoB) {
        // TODO 3 · La parte proporcional de AMBAS reservas:
        //   - si participaciones == 0: revert MontoCero();
        //   - montoA = participaciones * reservaA / totalSupply();   (igual para B)
        //   - _burn(msg.sender, participaciones);   ← revierte sola si no las tiene
        //   - restar de las reservas, transferir los dos tokens y emitir LiquidezRetirada.
        // Pregunta: ¿por qué hay que leer totalSupply() ANTES de quemar?
        participaciones;   // solo para que compile; bórrenla
        (montoA, montoB) = (0, 0);
    }

    /* ------------------------------------------------------ intercambio */

    /// @notice Mete `montoEntrada` de `tokenEntrada` y recibe el otro token.
    /// @param minimoSalida protección de slippage: si sale menos, se revierte todo.
    function intercambiar(address tokenEntrada, uint256 montoEntrada, uint256 minimoSalida)
        external
        returns (uint256 salida)
    {
        // TODO 2 · En el orden checks → effects → interactions (Sesión 9):
        //   CHECKS    salida = cotizar(tokenEntrada, montoEntrada);
        //             si salida < minimoSalida: revert SlippageExcedido(minimoSalida, salida);
        //   EFFECTS   si entra A: reservaA += montoEntrada; reservaB -= salida;
        //             si entra B: al revés.
        //   INTERACT. IERC20(tokenEntrada).safeTransferFrom(msg.sender, address(this), montoEntrada);
        //             el OTRO token: safeTransfer(msg.sender, salida);
        //             emit Intercambio(msg.sender, tokenEntrada, montoEntrada, salida);
        tokenEntrada; montoEntrada; minimoSalida;   // solo para que compile; bórrenla
        salida = 0;
    }

    /* ---------------------------------------------------------- internas */

    function _reservasPara(address tokenEntrada) internal view returns (uint256, uint256) {
        if (tokenEntrada == address(tokenA)) return (reservaA, reservaB);
        if (tokenEntrada == address(tokenB)) return (reservaB, reservaA);
        revert TokenInvalido(tokenEntrada);
    }
}
