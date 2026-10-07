// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

/* =====================================================================
   VERSIÓN VULNERABLE · Laboratorio 07 · NO USAR COMO REFERENCIA
   =====================================================================
   Esta es la versión del contrato del proyecto del docente TAL COMO ESTABA
   publicada antes del 7 de octubre de 2026, cuando se preparó esta sesión y
   se encontró el hueco.

   Tiene UNA diferencia con la versión corregida, y está en `_update`.
   El laboratorio consiste en encontrarla explotándola, no leyéndola.

   La promesa del contrato —«el tope de reventa no se puede rodear»— es
   FALSA en este archivo. Averigüen por qué.
   ===================================================================== */

/* =====================================================================
   (encabezado original de la copia de lectura)
   COPIA DE LECTURA · Laboratorio 07
   =====================================================================
   Este archivo es el contrato del PROYECTO DEL DOCENTE, tal como está
   publicado en github.com/andresdapena81/entradas-reventa-controlada.
   Se trae aquí para leerlo y para intentar romperlo, no para modificarlo.

   Si lo cambian, cámbienlo en su copia: el objetivo del laboratorio es
   averiguar si la regla del tope de reventa se puede rodear DESDE AFUERA,
   que es como la atacaría alguien de verdad.
   ===================================================================== */

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Entradas con reventa controlada
 * @notice Demostración del curso Blockchain y Web 3.0 · USB Medellín.
 *
 * La tesis del contrato cabe en una frase: la regla de reventa deja de ser
 * un término y condiciones y pasa a ser algo que no se puede incumplir.
 *
 * Para lograrlo, la transferencia directa está BLOQUEADA. La única forma de
 * mover una entrada es `comprarReventa`, que verifica el tope antes de mover
 * nada. Da igual que alguien escriba su propio programa y no use la interfaz:
 * el contrato lo rechaza.
 *
 * NUNCA usar con dinero real. Es material de clase, sin auditar.
 */
contract EntradasVulnerable is ERC721, Ownable {
    /* ----------------------------------------------------------- estado */

    string public evento;
    uint256 public immutable aforo;
    uint256 public immutable precioOriginal;
    uint256 public immutable topeReventa;
    uint256 public immutable cierreReventa; // marca temporal
    uint256 public emitidas;

    /// Quien valida en la puerta. No puede emitir ni mover entradas.
    address public validador;

    struct Oferta {
        uint256 precio;
        bool activa;
    }

    mapping(uint256 tokenId => Oferta) public ofertas;
    mapping(uint256 tokenId => bool) public usada;

    /// Patrón de retiro: se acredita el saldo, no se envía el dinero.
    mapping(address titular => uint256 monto) public saldos;

    /**
     * Compuerta de la transferencia. Solo `comprarReventa` la abre, y la
     * cierra inmediatamente después. Es lo que hace imposible saltarse el
     * tope de precio.
     */
    bool private _transferenciaAbierta;

    /* ----------------------------------------------------------- errores */

    error AforoAgotado();
    error PagoIncorrecto(uint256 esperado, uint256 recibido);
    error NoEsPropietario();
    error PrecioSobreTope(uint256 tope, uint256 pedido);
    error ReventaCerrada();
    error NoEstaEnVenta();
    error TransferenciaDirectaBloqueada();
    error SinSaldo();
    error EntradaYaUsada();
    error NoAutorizado();
    error NoSePuedeComprarASiMismo();

    /* ----------------------------------------------------------- eventos */

    event EntradaEmitida(uint256 indexed tokenId, address indexed comprador, uint256 precio);
    event PuestaEnVenta(uint256 indexed tokenId, uint256 precio);
    event QuitadaDeVenta(uint256 indexed tokenId);
    event Revendida(uint256 indexed tokenId, address indexed de, address indexed a, uint256 precio);
    event Retirado(address indexed titular, uint256 monto);
    event EntradaUsada(uint256 indexed tokenId, address indexed portador);
    event ValidadorCambiado(address indexed anterior, address indexed nuevo);

    /* ------------------------------------------------------ construcción */

    constructor(
        string memory nombreEvento,
        uint256 aforo_,
        uint256 precioOriginal_,
        uint256 topeReventa_,
        uint256 cierreReventa_
    ) ERC721("Entrada USB", "ENT") Ownable(msg.sender) {
        require(aforo_ > 0, "aforo debe ser mayor que cero");
        require(topeReventa_ >= precioOriginal_, "el tope no puede ser menor que el precio original");
        evento = nombreEvento;
        aforo = aforo_;
        precioOriginal = precioOriginal_;
        topeReventa = topeReventa_;
        cierreReventa = cierreReventa_;
    }

    /* -------------------------------------------------------- venta base */

    /// @notice Compra una entrada del lote original al precio de emisión.
    function comprar() external payable returns (uint256 tokenId) {
        if (emitidas >= aforo) revert AforoAgotado();
        if (msg.value != precioOriginal) revert PagoIncorrecto(precioOriginal, msg.value);

        tokenId = ++emitidas;                 // los identificadores empiezan en 1
        saldos[owner()] += msg.value;         // el organizador retira después
        _safeMint(msg.sender, tokenId);

        emit EntradaEmitida(tokenId, msg.sender, msg.value);
    }

    /* ------------------------------------------------------------ reventa */

    /// @notice Pone una entrada en venta. El precio no puede superar el tope.
    function ponerEnVenta(uint256 tokenId, uint256 precio) external {
        if (ownerOf(tokenId) != msg.sender) revert NoEsPropietario();
        if (block.timestamp >= cierreReventa) revert ReventaCerrada();
        if (precio > topeReventa) revert PrecioSobreTope(topeReventa, precio);
        if (usada[tokenId]) revert EntradaYaUsada();

        ofertas[tokenId] = Oferta({precio: precio, activa: true});
        emit PuestaEnVenta(tokenId, precio);
    }

    /// @notice Retira una entrada de la venta.
    function quitarDeVenta(uint256 tokenId) external {
        if (ownerOf(tokenId) != msg.sender) revert NoEsPropietario();
        delete ofertas[tokenId];
        emit QuitadaDeVenta(tokenId);
    }

    /**
     * @notice Compra una entrada que está en reventa.
     * @dev Es la ÚNICA vía por la que una entrada cambia de dueño. Abre la
     *      compuerta de transferencia, mueve el token y la vuelve a cerrar.
     */
    function comprarReventa(uint256 tokenId) external payable {
        Oferta memory oferta = ofertas[tokenId];
        if (!oferta.activa) revert NoEstaEnVenta();
        if (block.timestamp >= cierreReventa) revert ReventaCerrada();
        if (usada[tokenId]) revert EntradaYaUsada();
        if (msg.value != oferta.precio) revert PagoIncorrecto(oferta.precio, msg.value);

        address vendedor = ownerOf(tokenId);
        if (vendedor == msg.sender) revert NoSePuedeComprarASiMismo();

        // Efectos antes de la interacción: la oferta se cierra y el saldo se
        // acredita ANTES de mover el token.
        delete ofertas[tokenId];
        saldos[vendedor] += msg.value;

        _transferenciaAbierta = true;
        _safeTransfer(vendedor, msg.sender, tokenId, "");
        _transferenciaAbierta = false;

        emit Revendida(tokenId, vendedor, msg.sender, msg.value);
    }

    /* ------------------------------------------------------------ retiro */

    /**
     * @notice Retira el saldo acumulado por ventas.
     * @dev Patrón de retiro: el contrato nunca envía dinero por su cuenta.
     *      Se pone el saldo a cero ANTES de enviar, para que una reentrada
     *      no encuentre nada que llevarse.
     */
    function retirar() external {
        uint256 monto = saldos[msg.sender];
        if (monto == 0) revert SinSaldo();

        saldos[msg.sender] = 0;
        (bool ok, ) = payable(msg.sender).call{value: monto}("");
        require(ok, "el envio fallo");

        emit Retirado(msg.sender, monto);
    }

    /* --------------------------------------------------------- validación */

    function asignarValidador(address nuevo) external onlyOwner {
        emit ValidadorCambiado(validador, nuevo);
        validador = nuevo;
    }

    /**
     * @notice ¿Puede entrar `portador` con la entrada `tokenId`?
     * @dev La usa la aplicación de puerta. Es una consulta: no cuesta gas.
     */
    function esValida(uint256 tokenId, address portador) external view returns (bool) {
        if (tokenId == 0 || tokenId > emitidas) return false;
        if (usada[tokenId]) return false;
        return _ownerOf(tokenId) == portador;
    }

    /**
     * @notice Marca la entrada como usada al entrar.
     * @dev Registrarlo en la cadena hace esperar a la fila. La alternativa es
     *      llevar la lista fuera de la cadena y guardar la firma como
     *      evidencia. Aquí está la versión en cadena para poder mostrar las
     *      dos y discutir el intercambio.
     */
    function marcarUsada(uint256 tokenId) external {
        if (msg.sender != validador && msg.sender != owner()) revert NoAutorizado();
        if (tokenId == 0 || tokenId > emitidas) revert NoEstaEnVenta();
        if (usada[tokenId]) revert EntradaYaUsada();

        usada[tokenId] = true;
        delete ofertas[tokenId];               // una entrada usada ya no se revende
        emit EntradaUsada(tokenId, _ownerOf(tokenId));
    }

    /* ------------------------------------------- el corazón del contrato */

    /**
     * @dev Único punto por el que pasa toda transferencia en ERC-721.
     *      Se permite acuñar (from == 0) y se permite mover solo cuando la
     *      compuerta está abierta, cosa que únicamente hace `comprarReventa`.
     *
     *      Aquí es donde la regla deja de ser una promesa. Quien intente
     *      `transferFrom` o `safeTransferFrom` por su cuenta, desde su propio
     *      programa, revierte.
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && !_transferenciaAbierta) {
            revert TransferenciaDirectaBloqueada();
        }
        return super._update(to, tokenId, auth);
    }

    /* ----------------------------------------------------------- consulta */

    function quedanDisponibles() external view returns (uint256) {
        return aforo - emitidas;
    }

    function reventaAbierta() external view returns (bool) {
        return block.timestamp < cierreReventa;
    }
}
