// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * PASO 3 · Muchos equipos, un contrato
 *
 * El paso 2 manejaba UN equipo. El laboratorio tiene cuarenta.
 * Dos herramientas nuevas: `struct` para agrupar datos, `mapping` para
 * guardarlos por identificador.
 */
contract PrestamoEquipos {
    // Un `struct` es un tipo propio: agrupa datos que van juntos.
    struct Equipo {
        string nombre;
        address prestadoA;
        bool existe; // para distinguir "equipo 7 no registrado" de "equipo libre"
    }

    // Un `mapping` es una tabla: dale un id y te da el equipo.
    // Rarezas que hay que decir en voz alta:
    //   · NO se puede recorrer. No existe "dame todos los equipos".
    //   · Toda clave existe desde siempre, con todo en cero. Por eso `existe`.
    mapping(uint256 id => Equipo) public equipos;

    // Como el mapping no se puede recorrer, llevamos la cuenta a mano.
    uint256 public totalEquipos;

    error EquipoNoRegistrado(uint256 id);
    error EquipoOcupado(address loTiene);
    error NoLoTienesTu();
    error NombreVacio();

    /**
     * Registrar un equipo nuevo. Devuelve su id.
     */
    function registrar(string calldata nombre) public returns (uint256 id) {
        if (bytes(nombre).length == 0) revert NombreVacio();

        totalEquipos++;        // el primer equipo es el 1, no el 0:
        id = totalEquipos;     // así "id 0" significa siempre "no existe"
        equipos[id] = Equipo({nombre: nombre, prestadoA: address(0), existe: true});
    }
    // `calldata`: el texto se lee directo de los datos de la transacción, sin
    // copiarlo. Es la opción más barata para parámetros que no se modifican.

    function estaDisponible(uint256 id) public view returns (bool) {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        return equipos[id].prestadoA == address(0);
    }

    function prestar(uint256 id) public {
        if (!estaDisponible(id)) revert EquipoOcupado(equipos[id].prestadoA);
        equipos[id].prestadoA = msg.sender;
    }

    function devolver(uint256 id) public {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        if (equipos[id].prestadoA != msg.sender) revert NoLoTienesTu();
        equipos[id].prestadoA = address(0);
    }
}

/* ─────────────────────────────────────────────────────────────────────────────
   EN CLASE:

   1. `registrar("Proyector Epson")` y `registrar("Kit Arduino")`.
      Leer `totalEquipos`: 2. Leer `equipos(1)` y `equipos(2)`.
   2. Prestar el 1 con la cuenta 1 y el 2 con la cuenta 2. Conviven.
   3. `estaDisponible(99)` → revierte con EquipoNoRegistrado(99).
      Sin el campo `existe`, habría contestado "sí, disponible". Mentira cómoda.

   Ahora la pregunta incómoda: que la cuenta 3, que es un estudiante
   cualquiera, llame a `registrar("Portatil que no existe")`.
   Funciona. Cualquiera puede inventar inventario.

   Eso es lo que arregla el paso 4.
   ───────────────────────────────────────────────────────────────────────────── */
