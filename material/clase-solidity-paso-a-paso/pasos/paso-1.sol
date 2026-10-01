// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

/**
 * PASO 1 · El contrato recuerda
 *
 * Problema de verdad: el laboratorio presta equipos y el registro vive en una
 * hoja de papel. Nadie sabe quién tiene el proyector.
 *
 * Esta primera versión solo hace una cosa: recordar quién tiene el equipo.
 * Nada más. Y ya con eso se ve lo esencial de Solidity.
 */
contract PrestamoEquipos {
    // Variables de ESTADO: viven en la cadena. Siguen ahí mañana.
    string public nombreEquipo = "Proyector Epson";
    address public prestadoA;

    // `public` nos regala dos funciones de lectura: nombreEquipo() y prestadoA().
    // No hace falta escribirlas.

    /**
     * Pedir el equipo prestado.
     *
     * No recibe quién lo pide. No hace falta: `msg.sender` es quien firma la
     * transacción. En Solidity nadie dice quién es; se demuestra firmando.
     */
    function prestar() public {
        prestadoA = msg.sender;
    }

    /**
     * Devolverlo.
     *
     * `address(0)` es la dirección cero, el "vacío" de Ethereum. La usamos para
     * decir "no lo tiene nadie".
     */
    function devolver() public {
        prestadoA = address(0);
    }
}

/* ─────────────────────────────────────────────────────────────────────────────
   EN CLASE, AL TERMINAR ESTE PASO:

   1. Desplegar y leer `prestadoA`: devuelve 0x000...000. Nadie lo tiene.
   2. Llamar a `prestar()` con la cuenta 1 y volver a leer: aparece la cuenta 1.
   3. Cambiar a la cuenta 2 y llamar a `prestar()` otra vez.

   ¿Qué pasó? El equipo "cambió de manos" aunque la cuenta 1 nunca lo devolvió.
   El contrato acaba de permitir algo imposible en la vida real.

   Eso es lo que arregla el paso 2.
   ───────────────────────────────────────────────────────────────────────────── */
