// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * PASO 5 · Hasta cuándo
 *
 * Hasta aquí un equipo se podía prestar "para siempre". Ahora el préstamo
 * tiene plazo, y el contrato puede decir quién está en mora.
 * Pieza nueva: el tiempo, con todo lo que trae.
 */
contract PrestamoEquipos {
    struct Equipo {
        string nombre;
        address prestadoA;
        uint64 vence; // momento en que se vence el préstamo (reloj Unix)
        bool existe;
    }
    // Nota de gas que se ve bien aquí: `address` (20 bytes) + `uint64` (8) +
    // `bool` (1) = 29 bytes, así que caben en UNA ranura de 32. Si `vence`
    // fuera `uint256`, harían falta dos. Agrupar bien ahorra dinero real.

    mapping(uint256 id => Equipo) public equipos;
    uint256 public totalEquipos;
    address public encargado;

    /// Plazo máximo de un préstamo. `constant`: no ocupa estado, va en el código.
    uint64 public constant PLAZO_MAXIMO = 14 days;

    error EquipoNoRegistrado(uint256 id);
    error EquipoOcupado(address loTiene);
    error NoLoTienesTu();
    error NombreVacio();
    error SoloElEncargado(address quienLlamo);
    error PlazoInvalido(uint64 maximo);

    constructor() {
        encargado = msg.sender;
    }

    modifier soloEncargado() {
        if (msg.sender != encargado) revert SoloElEncargado(msg.sender);
        _;
    }

    function registrar(string calldata nombre) public soloEncargado returns (uint256 id) {
        if (bytes(nombre).length == 0) revert NombreVacio();
        totalEquipos++;
        id = totalEquipos;
        equipos[id] = Equipo({nombre: nombre, prestadoA: address(0), vence: 0, existe: true});
    }

    function recuperar(uint256 id) public soloEncargado {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        equipos[id].prestadoA = address(0);
        equipos[id].vence = 0;
    }

    function estaDisponible(uint256 id) public view returns (bool) {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        return equipos[id].prestadoA == address(0);
    }

    /**
     * @param dias cuántos días se lleva el equipo
     */
    function prestar(uint256 id, uint64 dias) public {
        if (!estaDisponible(id)) revert EquipoOcupado(equipos[id].prestadoA);
        uint64 plazo = dias * 1 days;
        if (dias == 0 || plazo > PLAZO_MAXIMO) revert PlazoInvalido(PLAZO_MAXIMO);

        equipos[id].prestadoA = msg.sender;
        equipos[id].vence = uint64(block.timestamp) + plazo;
        //
        // `block.timestamp` es el reloj del bloque, en segundos. Dos avisos que
        // hay que dar siempre:
        //   1. Quien produce el bloque lo puede mover unos segundos. Para
        //      "catorce días" da igual; para sortear algo, JAMÁS se usa.
        //   2. Es `uint256`: hay que convertirlo. La suma, en cambio, revierte
        //      si desborda, y eso lo garantiza Solidity 0.8 sin hacer nada.
    }

    function devolver(uint256 id) public {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        if (equipos[id].prestadoA != msg.sender) revert NoLoTienesTu();
        equipos[id].prestadoA = address(0);
        equipos[id].vence = 0;
    }

    /// ¿Este equipo está en mora?
    function estaVencido(uint256 id) public view returns (bool) {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        Equipo memory e = equipos[id];
        return e.prestadoA != address(0) && block.timestamp > e.vence;
    }

    /// Días (redondeando hacia abajo) que lleva vencido. Cero si está al día.
    function diasDeMora(uint256 id) public view returns (uint64) {
        if (!estaVencido(id)) return 0;
        return (uint64(block.timestamp) - equipos[id].vence) / 1 days;
        //
        // Aquí se ve algo que descoloca a todo el mundo: en Solidity NO HAY
        // decimales. La división entera trunca. 1,9 días de mora son "1".
    }
}

/* ─────────────────────────────────────────────────────────────────────────────
   EN CLASE:

   1. Prestar el equipo 1 por 2 días. Leer `equipos(1)`: aparece `vence`, un
      número grande. Es un reloj en segundos desde 1970.
   2. `estaVencido(1)` → false. `diasDeMora(1)` → 0.
   3. En la máquina virtual de Remix el reloj no avanza solo. Para no esperar
      dos días: prestar otro equipo por 1 día y usar la consola de Remix, o
      —más simple en clase— prestar con `dias = 1` y mostrar la cuenta del
      vencimiento a mano. (La guía trae el truco para adelantar el reloj.)
   4. Preguntar: `estaVencido` dice quién está en mora. ¿Y qué?
      El contrato no puede ir a buscar el equipo.

   Estar en mora, hasta ahora, no cuesta nada. Eso es el paso 6, y es el que
   convierte esto en un contrato de verdad: el que mueve dinero.
   ───────────────────────────────────────────────────────────────────────────── */
