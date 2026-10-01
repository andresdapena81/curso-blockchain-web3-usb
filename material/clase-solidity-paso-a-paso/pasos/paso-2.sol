// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * PASO 2 · El contrato dice NO
 *
 * El paso 1 dejaba que alguien se llevara un equipo que ya estaba prestado.
 * Un contrato que no sabe negarse no sirve para nada.
 */
contract PrestamoEquipos {
    string public nombreEquipo = "Proyector Epson";
    address public prestadoA;

    // ERRORES PERSONALIZADOS. Son el "no" del contrato, con nombre propio.
    // Cuestan menos gas que un texto y la interfaz puede distinguirlos.
    error EquipoOcupado(address loTiene);
    error NoLoTienesTu();

    function estaDisponible() public view returns (bool) {
        return prestadoA == address(0);
    }
    // `view` = esta función LEE el estado pero no lo cambia. Llamarla desde
    // fuera no cuesta gas y no genera una transacción: es una consulta.

    function prestar() public {
        // Primero validar. Siempre.
        if (!estaDisponible()) revert EquipoOcupado(prestadoA);
        prestadoA = msg.sender;
    }

    function devolver() public {
        // Y quien devuelve tiene que ser quien lo tiene. Si no, cualquiera
        // "devuelve" el equipo de otro y se lo lleva.
        if (prestadoA != msg.sender) revert NoLoTienesTu();
        prestadoA = address(0);
    }
}

/* ─────────────────────────────────────────────────────────────────────────────
   EN CLASE:

   1. Cuenta 1 → `prestar()`. Funciona.
   2. Cuenta 2 → `prestar()`. REVIERTE, y Remix muestra el nombre del error con
      la dirección de quien lo tiene. Esa es la diferencia entre un error y un
      mensaje de error: este trae información.
   3. Cuenta 2 → `devolver()`. REVIERTE: no es suya.
   4. Cuenta 1 → `devolver()`. Funciona. Y ahora la 2 ya puede prestarlo.

   Pregunta para ellos: el laboratorio tiene 40 equipos. ¿Vamos a desplegar
   40 contratos?

   Eso es lo que arregla el paso 3.
   ───────────────────────────────────────────────────────────────────────────── */
