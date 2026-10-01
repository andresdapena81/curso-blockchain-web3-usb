// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * PrestamoEquipos · versión final de la clase paso a paso
 *
 * Copia probada del paso 6 (material/clase-solidity-paso-a-paso/pasos/paso-6.sol).
 * Las pruebas de test/demo/ son las que permiten mostrar la mora en clase sin
 * esperar dos semanas: el reloj de la red de pruebas se adelanta a pedido.
 *
 * Versión final. Para llevarse un equipo se deja un DEPÓSITO. Si se devuelve a
 * tiempo, se recupera completo. Si se devuelve en mora, el depósito se queda en
 * el laboratorio.
 *
 * Aquí entra lo que hace distinto a un contrato inteligente de un formulario:
 * el dinero y la regla viven en el mismo sitio, y la regla se cumple sola.
 */
contract PrestamoEquipos {
    struct Equipo {
        string nombre;
        address prestadoA;
        uint64 vence;
        bool existe;
    }

    mapping(uint256 id => Equipo) public equipos;
    uint256 public totalEquipos;
    address public encargado;

    /// Depósito exigido por préstamo, en wei. Se fija al desplegar y no cambia.
    uint256 public immutable deposito;

    /// Lo que cada dirección puede reclamar. Ver `retirar()`.
    mapping(address quien => uint256 wei_) public saldo;

    uint64 public constant PLAZO_MAXIMO = 14 days;

    error EquipoNoRegistrado(uint256 id);
    error EquipoOcupado(address loTiene);
    error NoLoTienesTu();
    error NombreVacio();
    error SoloElEncargado(address quienLlamo);
    error PlazoInvalido(uint64 maximo);
    error DepositoIncorrecto(uint256 esperado, uint256 recibido);
    error SinSaldo();
    error EnvioDirectoNoPermitido();

    // EVENTOS: no cambian el estado, escriben en el registro de la transacción.
    // Cuestan mucho menos que guardar lo mismo, y son de donde una interfaz o
    // una auditoría sacan la historia. Un contrato NO puede leerlos.
    event EquipoRegistrado(uint256 indexed id, string nombre);
    event Prestado(uint256 indexed id, address indexed quien, uint64 vence);
    event Devuelto(uint256 indexed id, address indexed quien, bool aTiempo, uint256 depositoDevuelto);

    constructor(uint256 deposito_) {
        encargado = msg.sender;
        deposito = deposito_;
    }

    modifier soloEncargado() {
        if (msg.sender != encargado) revert SoloElEncargado(msg.sender);
        _;
    }

    // ── Inventario ──────────────────────────────────────────────────────────

    function registrar(string calldata nombre) public soloEncargado returns (uint256 id) {
        if (bytes(nombre).length == 0) revert NombreVacio();
        totalEquipos++;
        id = totalEquipos;
        equipos[id] = Equipo({nombre: nombre, prestadoA: address(0), vence: 0, existe: true});
        emit EquipoRegistrado(id, nombre);
    }

    /**
     * Recuperar un equipo a la fuerza. El depósito queda para el laboratorio:
     * si hubo que ir a buscarlo, el costo no lo paga el laboratorio.
     */
    function recuperar(uint256 id) public soloEncargado {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        address quien = equipos[id].prestadoA;
        equipos[id].prestadoA = address(0);
        equipos[id].vence = 0;
        if (quien != address(0)) {
            saldo[encargado] += deposito;
            emit Devuelto(id, quien, false, 0);
        }
    }

    // ── Préstamo ────────────────────────────────────────────────────────────

    /**
     * Llevarse un equipo, dejando el depósito exacto.
     * @param dias cuántos días (1 a 14)
     */
    function prestar(uint256 id, uint64 dias) public payable {
        // CHECKS · validar todo antes de tocar nada
        if (!estaDisponible(id)) revert EquipoOcupado(equipos[id].prestadoA);
        uint64 plazo = dias * 1 days;
        if (dias == 0 || plazo > PLAZO_MAXIMO) revert PlazoInvalido(PLAZO_MAXIMO);
        if (msg.value != deposito) revert DepositoIncorrecto(deposito, msg.value);
        //
        // `payable` es el interruptor que permite que entre dinero. Sin esa
        // palabra, la función rechaza cualquier ether. Y exigimos el monto
        // EXACTO: aceptar de más obligaría a devolver cambio, y devolver dinero
        // a un desconocido es justo la operación delicada que veremos en la
        // sesión de seguridad.

        // EFFECTS · ahora sí, cambiar el estado
        equipos[id].prestadoA = msg.sender;
        equipos[id].vence = uint64(block.timestamp) + plazo;

        emit Prestado(id, msg.sender, equipos[id].vence);
    }

    /**
     * Devolver el equipo. Si llega a tiempo, el depósito queda acreditado a su
     * favor y lo retira cuando quiera. Si llega en mora, queda para el
     * laboratorio.
     */
    function devolver(uint256 id) public {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        if (equipos[id].prestadoA != msg.sender) revert NoLoTienesTu();

        bool aTiempo = block.timestamp <= equipos[id].vence;

        equipos[id].prestadoA = address(0);
        equipos[id].vence = 0;

        address beneficiario = aTiempo ? msg.sender : encargado;
        saldo[beneficiario] += deposito;
        //
        // Fíjense en lo que NO hicimos: no le enviamos el dinero a nadie. Solo
        // lo anotamos. Ese es el patrón de retiro, y es la línea siguiente la
        // que explica por qué.

        emit Devuelto(id, msg.sender, aTiempo, aTiempo ? deposito : 0);
    }

    /**
     * Reclamar lo que el contrato le debe a quien llama.
     *
     * PATRÓN DE RETIRO. Si el contrato enviara el dinero por su cuenta:
     *   1. Si el destinatario es un contrato que rechaza el envío, la operación
     *      entera fallaría. Uno solo podría bloquear el sistema para todos.
     *   2. Enviar ether le entrega el control de la ejecución al que recibe.
     *      Si el estado no quedó en orden antes, puede volver a entrar y cobrar
     *      dos veces. Así se perdieron 3,6 millones de ether en 2016.
     */
    function retirar() public {
        uint256 monto = saldo[msg.sender];
        if (monto == 0) revert SinSaldo();

        saldo[msg.sender] = 0;
        // ↑ EN CERO ANTES DE ENVIAR. El orden de estas dos líneas es la
        //   diferencia entre un contrato seguro y uno vaciable.

        (bool ok, ) = msg.sender.call{value: monto}("");
        require(ok, "el envio fallo");
    }

    // ── Consultas · gratis desde una interfaz ───────────────────────────────

    function estaDisponible(uint256 id) public view returns (bool) {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        return equipos[id].prestadoA == address(0);
    }

    function quienLoTiene(uint256 id) public view returns (address) {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        return equipos[id].prestadoA;
    }

    function estaVencido(uint256 id) public view returns (bool) {
        if (!equipos[id].existe) revert EquipoNoRegistrado(id);
        Equipo memory e = equipos[id];
        return e.prestadoA != address(0) && block.timestamp > e.vence;
    }

    function diasDeMora(uint256 id) public view returns (uint64) {
        if (!estaVencido(id)) return 0;
        return (uint64(block.timestamp) - equipos[id].vence) / 1 days;
    }

    // ── Y si alguien manda ether sin más ────────────────────────────────────

    /// Dinero suelto, sin decir para qué equipo. Se rechaza.
    receive() external payable {
        revert EnvioDirectoNoPermitido();
    }

    /// Llamada a una función que no existe (nombre mal escrito, ABI viejo).
    fallback() external payable {
        revert EnvioDirectoNoPermitido();
    }
}

/* ─────────────────────────────────────────────────────────────────────────────
   EN CLASE, EL RECORRIDO FINAL:

   1. Desplegar con `deposito_` = 100000000000000000 (0,1 ETH).
   2. Registrar un equipo. Mirar el evento EquipoRegistrado en los logs de Remix:
      ahí está la historia, y no costó una variable de estado.
   3. Cuenta 2 → `prestar(1, 2)` SIN poner valor. Revierte: DepositoIncorrecto,
      y dice cuánto esperaba. Volver a intentar con 0,1 ETH en el campo VALUE.
   4. Mirar el saldo de la cuenta 2 en Remix: bajó. Y el del contrato: subió.
   5. `devolver(1)` a tiempo → leer `saldo(cuenta2)`: 0,1 ETH. El dinero NO le
      llegó todavía. `retirar()` → ahora sí.
   6. Repetir en mora (la guía trae cómo adelantar el reloj) y ver que el saldo
      queda para el encargado.
   7. Enviar 1 wei al contrato desde Remix sin llamar a ninguna función:
      revierte con EnvioDirectoNoPermitido.

   LA PREGUNTA DE CIERRE, Y ES LA DEL CURSO ENTERO:
   ¿esto necesitaba una blockchain? Para el laboratorio de la universidad, NO:
   una hoja de cálculo y una persona honesta bastan, y salen gratis.
   Tendría sentido si el inventario fuera compartido entre varias universidades
   que no se fían entre sí, o si el depósito tuviera que devolverse sin que
   nadie pueda decidir no devolverlo.

   Saber distinguir esos dos casos vale más que saber escribir el contrato.
   ───────────────────────────────────────────────────────────────────────────── */
