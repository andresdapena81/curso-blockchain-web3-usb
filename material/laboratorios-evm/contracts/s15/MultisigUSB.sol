// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title MultisigUSB · Laboratorio 15 · una cuenta que exige m de n firmas · VERSIÓN DE TRABAJO
 *
 * Copien este archivo sobre contracts/s15/MultisigUSB.sol y corran:
 *     npx hardhat test test/s15/Multisig.test.js
 * Compila tal como está. Está completo cuando pasan las 11 pruebas.
 *
 * @notice Multisig MÍNIMO, para entender el mecanismo por dentro. En la vida
 *         real se usa Safe (auditado, con interfaz y años en producción); este
 *         contrato es el plan B de la clase cuando no hay ETH de prueba o no
 *         hay red, y la forma de ver qué hace Safe sin su complejidad.
 *
 * Flujo: un firmante PROPONE una transacción (y con eso ya la confirma), los
 * demás la CONFIRMAN, y cuando hay `umbral` confirmaciones cualquier firmante
 * la EJECUTA. Un firmante puede REVOCAR su confirmación antes de la ejecución.
 *
 * Diferencia con Safe: aquí cada confirmación es una transacción en cadena (y
 * cuesta gas). En Safe las confirmaciones son firmas fuera de la cadena que se
 * verifican todas juntas al ejecutar; solo la ejecución paga gas.
 *
 * Material de clase, sin auditar.
 */
contract MultisigUSB {
    struct Transaccion {
        address destino;
        uint256 valor;
        bytes datos;
        bool ejecutada;
        uint256 confirmaciones;
    }

    address[] public firmantes;
    mapping(address => bool) public esFirmante;
    uint256 public immutable umbral;

    Transaccion[] public transacciones;
    mapping(uint256 => mapping(address => bool)) public confirmo;

    event Deposito(address indexed de, uint256 monto);
    event Propuesta(uint256 indexed id, address indexed firmante, address destino, uint256 valor);
    event Confirmada(uint256 indexed id, address indexed firmante);
    event Revocada(uint256 indexed id, address indexed firmante);
    event Ejecutada(uint256 indexed id);

    error ConfiguracionInvalida();
    error NoEsFirmante();
    error NoExiste(uint256 id);
    error YaEjecutada(uint256 id);
    error YaConfirmo(uint256 id);
    error NoHabiaConfirmado(uint256 id);
    error FaltanConfirmaciones(uint256 tiene, uint256 necesita);
    error EjecucionFallida();

    modifier soloFirmante() {
        if (!esFirmante[msg.sender]) revert NoEsFirmante();
        _;
    }

    modifier existeYPendiente(uint256 id) {
        if (id >= transacciones.length) revert NoExiste(id);
        if (transacciones[id].ejecutada) revert YaEjecutada(id);
        _;
    }

    /// @param firmantes_ las n cuentas que pueden firmar (sin repetir, sin la dirección cero)
    /// @param umbral_ m: cuántas confirmaciones hacen falta (1 ≤ m ≤ n)
    constructor(address[] memory firmantes_, uint256 umbral_) {
        if (umbral_ == 0 || umbral_ > firmantes_.length) revert ConfiguracionInvalida();
        for (uint256 i = 0; i < firmantes_.length; i++) {
            address f = firmantes_[i];
            if (f == address(0) || esFirmante[f]) revert ConfiguracionInvalida();
            esFirmante[f] = true;
            firmantes.push(f);
        }
        umbral = umbral_;
    }

    receive() external payable {
        emit Deposito(msg.sender, msg.value);
    }

    function cantidadTransacciones() external view returns (uint256) {
        return transacciones.length;
    }

    /// @notice Propone una transacción. Quien propone ya cuenta como una confirmación.
    function proponer(address destino, uint256 valor, bytes calldata datos)
        external soloFirmante returns (uint256 id)
    {
        id = transacciones.length;
        transacciones.push(Transaccion({ destino: destino, valor: valor, datos: datos, ejecutada: false, confirmaciones: 0 }));
        emit Propuesta(id, msg.sender, destino, valor);
        confirmar(id);
    }

    /// @notice Suma la confirmación de quien llama. Cada firmante confirma una sola vez.
    function confirmar(uint256 id) public soloFirmante existeYPendiente(id) {
        // TODO 1 · (los modificadores ya comprobaron que quien llama es firmante
        //           y que la transacción existe y no se ha ejecutado)
        //   a) si confirmo[id][msg.sender] ya es true → revert YaConfirmo(id)
        //   b) marcar confirmo[id][msg.sender] = true
        //   c) sumar 1 a transacciones[id].confirmaciones
        //   d) emitir Confirmada(id, msg.sender)
        //   Mirar revocar(), que hace exactamente lo contrario.
    }

    /// @notice Retira la confirmación propia, mientras la transacción no se haya ejecutado.
    function revocar(uint256 id) external soloFirmante existeYPendiente(id) {
        if (!confirmo[id][msg.sender]) revert NoHabiaConfirmado(id);
        confirmo[id][msg.sender] = false;
        transacciones[id].confirmaciones -= 1;
        emit Revocada(id, msg.sender);
    }

    /// @notice Ejecuta la transacción si reúne el umbral. Se marca como ejecutada
    ///         ANTES de la llamada externa (verificar → modificar → interactuar, Sesión 9).
    function ejecutar(uint256 id) external soloFirmante existeYPendiente(id) {
        // TODO 2 · en ESTE orden (verificar → modificar → interactuar):
        //   a) Transaccion storage t = transacciones[id];
        //   b) si t.confirmaciones < umbral → revert FaltanConfirmaciones(t.confirmaciones, umbral)
        //   c) t.ejecutada = true;              ← ANTES de la llamada externa (Sesión 9)
        //   d) (bool ok, ) = t.destino.call{value: t.valor}(t.datos);
        //   e) si !ok → revert EjecucionFallida()
        //   f) emitir Ejecutada(id)
    }
}
