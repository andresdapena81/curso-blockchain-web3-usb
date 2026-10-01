// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * PASO 4 · Quién manda aquí
 *
 * En el paso 3 cualquiera registraba equipos. Hace falta decir QUIÉN puede
 * hacer QUÉ. Dos piezas nuevas: el constructor y un modificador.
 */
contract PrestamoEquipos {
    struct Equipo {
        string nombre;
        address prestadoA;
        bool existe;
    }

    mapping(uint256 id => Equipo) public equipos;
    uint256 public totalEquipos;

    /// Quien administra el inventario del laboratorio.
    address public encargado;

    error EquipoNoRegistrado(uint256 id);
    error EquipoOcupado(address loTiene);
    error NoLoTienesTu();
    error NombreVacio();
    error SoloElEncargado(address quienLlamo);

    /**
     * El CONSTRUCTOR corre una sola vez: cuando se despliega. Nunca más.
     * Aquí dejamos grabado quién es el encargado.
     */
    constructor() {
        encargado = msg.sender;
    }

    /**
     * Un MODIFICADOR es una condición que se repite, escrita una sola vez.
     * El `_;` del final es "aquí va el cuerpo de la función".
     */
    modifier soloEncargado() {
        if (msg.sender != encargado) revert SoloElEncargado(msg.sender);
        _;
    }

    function registrar(string calldata nombre) public soloEncargado returns (uint256 id) {
        if (bytes(nombre).length == 0) revert NombreVacio();
        totalEquipos++;
        id = totalEquipos;
        equipos[id] = Equipo({nombre: nombre, prestadoA: address(0), existe: true});
    }

    /**
     * El encargado también necesita poder recuperar un equipo a la fuerza:
     * alguien se graduó, perdió la billetera, o simplemente no devuelve.
     * Sin esta función, un equipo quedaría prestado para siempre.
     */
    function recuperar(uint256 id) public soloEncargado {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        equipos[id].prestadoA = address(0);
    }

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

   1. Desplegar con la cuenta 1. Leer `encargado`: es la cuenta 1.
   2. Cuenta 2 → `registrar("Lo que sea")`. REVIERTE con SoloElEncargado.
   3. Cuenta 1 → `registrar(...)`. Funciona.
   4. Prestar el equipo con la cuenta 2, y que la cuenta 1 lo `recuperar`.

   Y ahora la conversación que de verdad importa, que no es técnica:
   acabamos de darle a UNA dirección el poder de quitarle el equipo a
   cualquiera. Si esa llave se pierde, nadie registra nunca más. Si se la roban,
   el inventario es del ladrón.

   Todo contrato tiene una respuesta a "¿quién manda?". Lo grave no es tener un
   dueño: es no darse cuenta de que lo hay.

   (En la próxima sesión esto se reemplaza por `Ownable` de OpenZeppelin, que es
   este mismo código ya auditado y con transferencia de propiedad.)

   Falta algo obvio: nadie dijo hasta cuándo. Eso es el paso 5.
   ───────────────────────────────────────────────────────────────────────────── */
