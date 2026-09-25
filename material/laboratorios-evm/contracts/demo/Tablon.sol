// SPDX-License-Identifier: MIT
//
// ↑ PRIMERA LÍNEA, Y NO ES DECORACIÓN.
//   Esta es la única línea que el compilador de Solidity espera ANTES del
//   pragma. Declara la licencia del código fuente. Si falta, el compilador
//   emite una advertencia (no un error), y el explorador de bloques la muestra
//   como "licencia no especificada" cuando alguien verifica el contrato.
//   Se escribe con un identificador de la lista SPDX: MIT, GPL-3.0, Apache-2.0,
//   UNLICENSED... "UNLICENSED" significa "nadie puede reutilizar esto".

pragma solidity 0.8.28;
//
// ↑ QUÉ VERSIÓN DEL COMPILADOR PUEDE COMPILAR ESTE ARCHIVO.
//   Aquí está FIJA en 0.8.28: ninguna otra versión lo compila. Es lo que
//   queremos en un curso y en producción, porque el mismo código compilado con
//   otra versión produce otro bytecode.
//
//   Verán mucho `pragma solidity ^0.8.0;` en tutoriales. El acento circunflejo
//   significa "0.8.0 o superior, pero menor que 0.9.0". Es cómodo y peligroso:
//   el contrato que ustedes probaron con 0.8.19 puede acabar desplegado con
//   0.8.28, que genera bytecode distinto.
//
//   Detalle que casi nadie menciona: desde 0.8.0 las operaciones aritméticas
//   REVIERTEN al desbordarse. Antes de 0.8.0 daban la vuelta en silencio
//   (255 + 1 = 0 en un uint8), y de ahí salieron robos famosos. Por eso el
//   curso usa 0.8.x y por eso ya casi nadie necesita la librería SafeMath.

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
//
// ↑ IMPORTACIÓN CON NOMBRES EXPLÍCITOS.
//   `import {Ownable} from "..."` trae SOLO ese símbolo. Se puede escribir
//   `import "..."` sin llaves, que trae todo lo del archivo al espacio de
//   nombres: funciona, pero ensucia y esconde de dónde viene cada cosa.
//
//   ¿Por qué usar código de OpenZeppelin y no escribir el nuestro? Porque
//   `Ownable` son treinta líneas que ya leyeron y auditaron miles de personas.
//   La regla del curso: el código propio se reserva para la lógica propia; lo
//   que ya es un estándar, se reutiliza.

/**
 * @title Tablón de anuncios por tiempo
 * @author Curso Blockchain y Web 3.0 · USB Medellín
 * @notice Un solo mensaje visible a la vez. Quien quiera publicar el suyo paga
 *         por segundo y ocupa el tablón hasta que se le acabe el tiempo.
 * @dev DEMOSTRACIÓN DE CLASE. Sin auditar. Nunca con dinero real.
 *
 *      Esto es un contrato pequeño a propósito, pero con todas las piezas que
 *      se repiten en cualquier contrato serio:
 *
 *        · estado que persiste y cuánto cuesta escribirlo,
 *        · dinero entrando (`payable`) y saliendo (patrón de retiro),
 *        · tiempo (`block.timestamp`) y sus trampas,
 *        · control de acceso (quién puede hacer qué),
 *        · errores personalizados en vez de cadenas de texto,
 *        · eventos, que son la forma barata de contarle al mundo qué pasó,
 *        · checks-effects-interactions, el orden que evita la reentrada.
 *
 *      Los comentarios de documentación de este bloque son NatSpec: los lee el
 *      compilador y terminan en la documentación y en las billeteras. Usan
 *      etiquetas con arroba (title, notice, dev, param, return). De ahí una
 *      trampa comprobada: si una arroba ABRE el renglón dentro de un bloque
 *      así, el compilador la lee como etiqueta y el archivo no compila. En
 *      medio de la línea (un correo, por ejemplo) no pasa nada. Cuando MetaMask
 *      muestra "¿Confirmas publicar un mensaje?" en lenguaje humano, lo que
 *      está leyendo es esto.
 */
contract Tablon is Ownable {
    //
    // `is Ownable` es HERENCIA. Este contrato incorpora el código de Ownable:
    // la variable `owner`, el modificador `onlyOwner` y la transferencia de
    // propiedad. No es composición (no tenemos "un" Ownable adentro): el
    // bytecode desplegado es uno solo, con todo junto.

    // =========================================================================
    // 1 · ESTADO: lo que el contrato recuerda entre una transacción y otra
    // =========================================================================
    //
    // Cada variable de estado vive en el `storage` del contrato, en ranuras de
    // 32 bytes. Es la memoria más cara de la EVM: escribir una ranura que
    // estaba vacía cuesta 20 000 de gas; cambiar una que ya tenía valor, 2 900;
    // leerla, 2 100 la primera vez en la transacción. Por eso la regla que
    // repite el curso: leer del estado una vez, trabajar con copias locales y
    // escribir lo mínimo.

    /// @notice El mensaje que se está mostrando ahora mismo.
    string public mensaje;
    //
    // `public` en una variable NO significa "cualquiera puede cambiarla".
    // Significa que el compilador genera gratis una función de lectura llamada
    // `mensaje()`. Escribirla solo se puede desde las funciones de aquí abajo.
    //
    // `string` es un arreglo de bytes de longitud variable: no cabe en una
    // ranura fija. Un mensaje largo cuesta más gas que uno corto, y eso se
    // siente. Un contrato que guardara mensajes de 10 KB sería inviable; ahí la
    // respuesta sería guardar el hash en cadena y el texto en IPFS.

    /// @notice Quién publicó el mensaje actual.
    address public autor;
    //
    // `address` son 20 bytes: una dirección de Ethereum. Puede ser una persona
    // (cuenta controlada por una llave) o otro contrato. Desde el contrato NO
    // hay forma fiable de distinguirlas, y suponer lo contrario es una fuente
    // clásica de errores: ver el comentario de `_pagar`.

    /// @notice Momento (en segundos de reloj Unix) en que el tablón se libera.
    uint64 public ocupadoHasta;
    //
    // ¿Por qué `uint64` y no `uint256`? Porque una marca de tiempo de 64 bits
    // alcanza hasta el año 584 942 417 355. Y porque `uint64` + `address`
    // (20 bytes) suman 28 bytes: CABEN EN LA MISMA RANURA de 32 bytes. Eso se
    // llama empaquetado, y ahorra una escritura de estado entera.
    //
    // Cuidado con la ilusión: empaquetar solo ahorra si las variables se
    // declaran CONTIGUAS y se usan juntas. Si entre ellas se cuela un
    // `uint256`, el empaquetado se pierde y el ahorro desaparece.

    /// @notice Precio en wei por cada segundo de publicación.
    uint256 public immutable precioPorSegundo;
    //
    // `immutable`: se fija UNA VEZ en el constructor y no cambia nunca más.
    // No ocupa ranura de storage; el compilador escribe el valor directamente
    // en el bytecode. Leerla cuesta prácticamente nada.
    //
    // La familia completa, que conviene no confundir:
    //   · `constant`  → el valor se conoce al escribir el código.
    //   · `immutable` → el valor se decide al desplegar (como este).
    //   · normal      → puede cambiar en cualquier momento.

    /// @notice Duración mínima y máxima de una publicación, en segundos.
    uint64 public constant MINIMO = 60;      // un minuto
    uint64 public constant MAXIMO = 7 days;  // una semana
    //
    // `7 days` es azúcar sintáctico de Solidity: lo convierte a 604 800. Se
    // pueden usar `seconds`, `minutes`, `hours`, `days`, `weeks`. Ojo: `years`
    // se eliminó del lenguaje, precisamente porque los años no tienen todos la
    // misma cantidad de segundos y eso invitaba a errores.

    /// @notice Saldo que cada dirección puede reclamar. Ver `retirar()`.
    mapping(address cuenta => uint256 wei_) public saldo;
    //
    // Un `mapping` es una tabla clave → valor. Tres cosas que sorprenden:
    //
    //   1. NO se puede recorrer. No existe "dame todas las claves". El
    //      contrato no sabe quiénes tienen saldo; solo puede responder
    //      "¿cuánto tiene esta dirección?". Si hace falta la lista, hay que
    //      mantener un arreglo aparte, y pagar por ello.
    //   2. Toda clave existe desde siempre, con el valor cero. Preguntar por
    //      una dirección que nunca apareció devuelve 0, no un error.
    //   3. Desde Solidity 0.8.18 las claves y valores se pueden nombrar
    //      (`address cuenta => uint256 wei_`). Es solo documentación, pero se
    //      lee mucho mejor.
    //
    // `wei_` lleva guion bajo porque `wei` es palabra reservada del lenguaje.

    // =========================================================================
    // 2 · EVENTOS: el registro de lo que pasó
    // =========================================================================
    //
    // Un evento no cambia el estado: escribe una entrada en el registro de la
    // transacción. Cuesta unas 50 veces menos que guardar lo mismo en storage,
    // y las interfaces y los indexadores viven de esto. El precio: los
    // contratos NO pueden leer eventos. Son un canal hacia afuera, nada más.
    //
    // Regla práctica: si un dato lo necesita la lógica del contrato, va en
    // storage; si lo necesita la interfaz o una auditoría, va en un evento.

    /// @notice Se publicó un mensaje nuevo.
    /// @param autor quién publicó
    /// @param hasta hasta cuándo queda ocupado el tablón
    /// @param pagado cuánto pagó, en wei
    /// @param mensaje el texto publicado
    event Publicado(address indexed autor, uint64 hasta, uint256 pagado, string mensaje);
    //
    // `indexed` convierte ese parámetro en un "topic" por el que se puede
    // filtrar: así una interfaz pregunta "todas las publicaciones de esta
    // dirección" sin leer toda la cadena. Se permiten hasta tres parámetros
    // indexados por evento. Indexar cuesta un poco más de gas, así que se
    // indexa lo que se va a buscar (direcciones, identificadores), no el texto.

    /// @notice El dueño del tablón borró un mensaje antes de su vencimiento.
    event Moderado(address indexed autorBorrado, uint256 reembolso);

    /// @notice Alguien retiró el saldo que tenía a su favor.
    event Retirado(address indexed quien, uint256 monto);

    // =========================================================================
    // 3 · ERRORES PERSONALIZADOS
    // =========================================================================
    //
    // Antes se escribía `require(cond, "el tablon esta ocupado")`. Esa cadena
    // viaja dentro del bytecode y se paga al desplegar y al revertir. Desde
    // 0.8.4 existen los errores personalizados: se codifican en 4 bytes, como
    // las funciones. Son más baratos y, sobre todo, la interfaz puede
    // distinguirlos y reaccionar a cada uno.
    //
    // Los parámetros son oro puro para depurar: no solo "pago incorrecto",
    // sino "esperaba 1000 y recibí 900".

    error TablonOcupado(uint64 libreEn);
    error DuracionInvalida(uint64 minimo, uint64 maximo);
    error PagoIncorrecto(uint256 esperado, uint256 recibido);
    error MensajeVacio();
    error SinSaldo();
    error NoHayNadaQueModerar();
    error EnvioDirectoNoPermitido();

    // =========================================================================
    // 4 · CONSTRUCTOR: se ejecuta UNA sola vez, al desplegar
    // =========================================================================

    /**
     * @param precioPorSegundo_ cuánto cuesta cada segundo de publicación, en wei
     * @dev El guion bajo al final evita que el parámetro tape a la variable de
     *      estado del mismo nombre. Es convención, no obligación.
     */
    constructor(uint256 precioPorSegundo_) Ownable(msg.sender) {
        //
        // `Ownable(msg.sender)` llama al constructor del contrato heredado y le
        // dice quién es el dueño. En OpenZeppelin 5 este argumento es
        // OBLIGATORIO. En la versión 4 no existía: el dueño era automáticamente
        // quien desplegaba. Si copian un tutorial viejo, este es el primer
        // sitio donde no les va a compilar.
        //
        // `msg.sender` aquí es quien firma la transacción de despliegue.

        precioPorSegundo = precioPorSegundo_;
        //
        // Una variable `immutable` SOLO se puede escribir aquí. Y no se puede
        // leer dentro del constructor: en este punto el valor todavía no está
        // en el bytecode.
    }

    // =========================================================================
    // 5 · MODIFICADORES: condiciones que se repiten
    // =========================================================================

    /// @dev Exige que el tablón esté libre en este momento.
    modifier soloSiEstaLibre() {
        if (block.timestamp < ocupadoHasta) {
            revert TablonOcupado(ocupadoHasta);
        }
        _;
        //
        // ↑ ESE GUION BAJO ES EL CUERPO DE LA FUNCIÓN MODIFICADA.
        //   El modificador se "envuelve" alrededor de la función: lo que está
        //   antes del `_;` corre antes; lo que esté después, correría al
        //   terminar. Es el mecanismo de `onlyOwner`, `nonReentrant` y
        //   `whenNotPaused`.
        //
        //   Límite importante: un modificador NO puede recibir ni devolver
        //   datos de la función. Para lógica que necesita valores intermedios,
        //   una función interna es más clara.
    }

    // =========================================================================
    // 6 · LA FUNCIÓN PRINCIPAL
    // =========================================================================

    /**
     * @notice Publica un mensaje en el tablón durante los segundos indicados.
     * @param texto el mensaje a mostrar
     * @param segundos_ cuánto tiempo se quiere ocupar el tablón
     * @dev Hay que enviar EXACTAMENTE `costo(segundos_)` wei.
     */
    function publicar(string calldata texto, uint64 segundos_)
        external
        payable
        soloSiEstaLibre
    {
        // ── Firma de la función, pieza por pieza ─────────────────────────────
        //
        // `string calldata texto`
        //    `calldata` es la zona de solo lectura donde llegan los argumentos
        //    de la transacción. Es la más barata: no se copia nada. Si
        //    escribiéramos `memory`, el compilador copiaría el texto a memoria
        //    y nos cobraría por la copia sin que la necesitemos.
        //    Regla: en funciones `external`, parámetros de tamaño variable en
        //    `calldata`, salvo que haya que modificarlos.
        //
        // `external`
        //    Se llama desde fuera del contrato. Las cuatro visibilidades:
        //      · external → solo desde fuera
        //      · public   → desde fuera y desde dentro
        //      · internal → desde este contrato y los que lo hereden
        //      · private  → solo desde este contrato
        //    Advertencia que siempre hay que dar: `private` NO es secreto.
        //    Todo el storage de un contrato se puede leer desde fuera con
        //    `eth_getStorageAt`. `private` limita quién puede llamar, no quién
        //    puede ver. Nunca se guarda un secreto en una cadena pública.
        //
        // `payable`
        //    Sin esta palabra, la función RECHAZA cualquier ether que le
        //    envíen. Es el interruptor que decide si el dinero puede entrar.
        //
        // `soloSiEstaLibre`
        //    El modificador de arriba. Corre ANTES de la primera línea.

        // ── CHECKS · primero validar, sin tocar nada ────────────────────────
        //
        // Este orden se llama checks-effects-interactions y es la defensa
        // principal contra la reentrada (Sesión 9). Aquí: comprobar, luego
        // cambiar el estado, y solo al final hablar con el exterior.

        if (bytes(texto).length == 0) revert MensajeVacio();
        //
        // No existe `texto.length` para un `string`: hay que convertirlo a
        // `bytes`. Y cuidado con el detalle que sale en la Sesión 2: esto
        // cuenta BYTES, no caracteres. "ñ" son dos bytes en UTF-8. Un límite
        // de 100 no es un límite de 100 letras.

        if (segundos_ < MINIMO || segundos_ > MAXIMO) {
            revert DuracionInvalida(MINIMO, MAXIMO);
        }

        uint256 debido = costo(segundos_);
        if (msg.value != debido) {
            revert PagoIncorrecto(debido, msg.value);
        }
        //
        // Exigimos el pago EXACTO. La alternativa sería aceptar de más y
        // devolver el cambio, y es una decisión de diseño con consecuencias:
        // devolver cambio significa enviar ether a quien llama, y enviar ether
        // a un desconocido es justamente la operación que abre la puerta a la
        // reentrada. El pago exacto es más incómodo para el usuario y más
        // simple de razonar. En este curso preferimos lo simple y decimos por
        // qué, en vez de esconder la decisión.
        //
        // `msg.value` son los wei que vienen en esta llamada. Si la función no
        // fuera `payable` y llegara valor, la transacción revertiría sola.

        // ── EFFECTS · ahora sí, cambiar el estado ───────────────────────────

        mensaje = texto;
        autor = msg.sender;
        ocupadoHasta = uint64(block.timestamp) + segundos_;
        //
        // `block.timestamp` es el reloj del bloque, en segundos. Dos avisos:
        //
        //   1. Es `uint256`, así que hay que convertirlo con `uint64(...)`.
        //      La conversión explícita TRUNCA en silencio si el valor no cabe
        //      (aquí no pasará en ningún futuro razonable). La suma, en cambio,
        //      revierte si desborda: eso lo garantiza Solidity 0.8.
        //   2. No es un reloj exacto. Quien produce el bloque puede moverlo
        //      unos segundos. Por eso NUNCA se usa para sortear nada, y por eso
        //      medir tiempos con una precisión de segundos es ilusorio. Para
        //      "una semana" da igual; para "quién llegó primero por medio
        //      segundo", no sirve.

        _pagar(owner(), msg.value);
        //
        // El dinero NO se le envía al dueño: se le ACREDITA. Ver `_pagar`.

        // ── INTERACTIONS · hablar con el exterior ───────────────────────────
        //
        // Un evento no es una llamada externa peligrosa, pero por costumbre va
        // al final: cuando se emite, el estado ya es el definitivo, así que lo
        // que cuenta el evento es verdad.

        emit Publicado(msg.sender, ocupadoHasta, msg.value, texto);
    }

    /**
     * @notice Borra el mensaje actual. Solo el dueño del tablón.
     * @dev Reembolsa (acredita) al autor la parte del tiempo que no alcanzó a
     *      usar. Es una decisión ética, no técnica: si el dueño puede callar a
     *      alguien, lo mínimo es que no se quede con su plata.
     *
     *      Y conviene decirlo en voz alta en clase: este contrato TIENE censura.
     *      El dueño puede borrar cualquier mensaje. Eso contradice el discurso
     *      de "nadie puede censurar en blockchain". La pregunta honesta no es
     *      "¿es descentralizado?", sino "¿quién tiene qué poder, y está
     *      escrito?". Aquí está escrito, a la vista, y eso ya es más de lo que
     *      ofrece la mayoría de las plataformas.
     */
    function moderar() external onlyOwner {
        if (block.timestamp >= ocupadoHasta) revert NoHayNadaQueModerar();
        //
        // `onlyOwner` viene de Ownable: revierte con `OwnableUnauthorizedAccount`
        // si quien llama no es el dueño.

        uint64 restante = ocupadoHasta - uint64(block.timestamp);
        uint256 reembolso = uint256(restante) * precioPorSegundo;
        address autorBorrado = autor;
        //
        // Guardamos el autor en una variable local ANTES de borrarlo. Leer una
        // variable de estado dos veces se paga dos veces; y, sobre todo,
        // después de la línea siguiente ya no existiría.

        // El dueño devuelve de su propio saldo acreditado lo que no se usó.
        uint256 saldoDuenno = saldo[owner()];
        uint256 aDevolver = reembolso > saldoDuenno ? saldoDuenno : reembolso;
        //
        // Ese `?:` es el operador ternario: si la condición es cierta toma el
        // primer valor, si no, el segundo. Aquí evita descontarle al dueño más
        // de lo que tiene acreditado, que revertiría por resta negativa.
        // Puede pasar si el dueño ya retiró: entonces devuelve lo que quede.
        // Es un compromiso; en un contrato de verdad, el dinero se retendría
        // hasta que venciera el plazo.

        saldo[owner()] = saldoDuenno - aDevolver;
        _pagar(autorBorrado, aDevolver);

        mensaje = "";
        autor = address(0);
        ocupadoHasta = 0;
        //
        // `address(0)` es la dirección cero: el "vacío" de Ethereum. También es
        // el destino que marca la quema de tokens. Borrar devolviendo una
        // variable a su valor por defecto reembolsa algo de gas.

        emit Moderado(autorBorrado, aDevolver);
    }

    /**
     * @notice Retira el saldo que usted tenga a su favor.
     * @dev PATRÓN DE RETIRO (pull), el patrón más importante de esta demo.
     *
     *      Lo natural sería enviarle el dinero a cada quien en el momento. Dos
     *      razones para no hacerlo:
     *
     *      1. Si el destinatario es un contrato que revierte al recibir, el
     *         envío falla y se lleva consigo TODA la operación. Un solo
     *         participante hostil podría dejar el tablón inservible. Eso es una
     *         denegación de servicio, y es un error de diseño, no un accidente.
     *      2. Enviar ether le pasa el control de la ejecución al que recibe.
     *         Si el estado no quedó consistente antes, puede volver a entrar y
     *         cobrar dos veces. Eso es la reentrada, y así se perdieron 3,6
     *         millones de ether en The DAO en 2016.
     *
     *      La solución es invertir la responsabilidad: el contrato solo apunta
     *      cuánto le debe a quién, y cada uno viene a reclamar lo suyo.
     */
    function retirar() external {
        uint256 monto = saldo[msg.sender];
        if (monto == 0) revert SinSaldo();

        saldo[msg.sender] = 0;
        //
        // ↑ EL ORDEN DE ESTAS DOS LÍNEAS ES TODO.
        //   Ponemos el saldo en CERO antes de enviar. Si alguien reentra
        //   durante el envío, encuentra saldo cero y se va con las manos
        //   vacías. Invertir estas dos líneas convierte este contrato en el
        //   contrato vulnerable de la Sesión 9.

        (bool ok, ) = msg.sender.call{value: monto}("");
        //
        // Tres formas de enviar ether, y por qué esta:
        //
        //   · `transfer(monto)` → revierte solo si falla, pero solo entrega
        //     2300 de gas. Se recomendaba durante años, hasta que un cambio de
        //     precios de la EVM (EIP-1884) rompió contratos que la usaban. Hoy
        //     está desaconsejada precisamente porque ese límite no es estable.
        //   · `send(monto)` → igual, pero devuelve `false` en vez de revertir.
        //     Si no se comprueba el resultado, el error pasa inadvertido.
        //   · `call{value: monto}("")` → entrega todo el gas disponible y
        //     devuelve si funcionó. Es lo recomendado HOY, con una condición:
        //     al dar todo el gas, el receptor puede ejecutar código, así que
        //     exige tener el estado ya en orden. Que es exactamente lo que
        //     hicimos en la línea anterior.
        //
        // Esa coma suelta en `(bool ok, )` descarta el segundo valor devuelto
        // (los datos de retorno), que aquí no nos interesan.

        require(ok, "el envio fallo");
        //
        // `require` con cadena, a propósito, para que vean la diferencia con
        // los errores personalizados de arriba. Si falla, revierte y deshace
        // TODO, incluido el saldo que acabamos de poner en cero. Una
        // transacción en Ethereum es atómica: o pasa completa, o no pasa.

        emit Retirado(msg.sender, monto);
    }

    // =========================================================================
    // 7 · FUNCIONES DE CONSULTA: gratis, si se llaman desde fuera
    // =========================================================================

    /**
     * @notice Cuánto cuesta publicar durante `segundos_` segundos.
     * @dev `pure` = no lee ni escribe el estado. `view` = lee pero no escribe.
     *      Esta multiplica dos cosas... pero una es `precioPorSegundo`, que es
     *      del contrato, así que NO puede ser `pure`: es `view`.
     *
     *      Llamadas así desde una interfaz no cuestan gas: el nodo las responde
     *      sin escribir nada en la cadena. Pero si otro contrato la llama
     *      dentro de una transacción, sí se paga el cómputo. "Gratis" describe
     *      quién pregunta, no la función.
     */
    function costo(uint64 segundos_) public view returns (uint256) {
        return uint256(segundos_) * precioPorSegundo;
        //
        // La conversión a `uint256` antes de multiplicar no es un adorno: sin
        // ella, la multiplicación se haría en 64 bits y podría desbordar. Con
        // Solidity 0.8 eso revertiría (no daría un número falso), pero un
        // rechazo tampoco es lo que queremos.
    }

    /// @notice ¿Está libre el tablón ahora mismo?
    function estaLibre() external view returns (bool) {
        return block.timestamp >= ocupadoHasta;
    }

    /// @notice Segundos que le quedan al mensaje actual. Cero si ya venció.
    function tiempoRestante() external view returns (uint64) {
        if (block.timestamp >= ocupadoHasta) return 0;
        return ocupadoHasta - uint64(block.timestamp);
        //
        // El `if` no es paranoia: sin él, la resta daría negativa cuando el
        // plazo ya pasó y la transacción revertiría. Una función de consulta
        // que revierte en un caso normal es una función mal escrita.
    }

    // =========================================================================
    // 8 · RECIBIR ETHER SIN LLAMAR A NINGUNA FUNCIÓN
    // =========================================================================
    //
    // Un contrato puede recibir ether de tres maneras: en una función
    // `payable`, en estas dos de abajo, o por la fuerza (`selfdestruct` y la
    // recompensa de un bloque no se pueden rechazar). La consecuencia práctica:
    // NUNCA se debe asumir que `address(this).balance` es igual a la suma de lo
    // que uno contabilizó. Puede ser mayor. Un contrato cuya lógica dependa de
    // que sea exacto se puede romper desde fuera.

    /// @notice Alguien envió ether sin datos. No lo aceptamos.
    receive() external payable {
        revert EnvioDirectoNoPermitido();
        //
        // Aquí se ve un contraste que vale la pena discutir: podríamos aceptar
        // el dinero y agradecer. Rechazamos, porque un envío suelto no dice qué
        // mensaje publicar ni por cuánto tiempo, y quedaría dinero atrapado sin
        // dueño claro. Rechazar es más amable que quedárselo.
        //
        // `receive` se ejecuta cuando llega ether con datos vacíos. Como
        // revierte, el envío falla y quien lo intentó conserva su dinero
        // (menos el gas gastado).
    }

    /// @notice Llamaron a una función que no existe.
    fallback() external payable {
        revert EnvioDirectoNoPermitido();
        //
        // `fallback` atrapa las llamadas que no coinciden con NINGUNA función,
        // por ejemplo porque el nombre estaba mal escrito o porque la interfaz
        // usa un ABI viejo. Sin él, la transacción también revertiría, pero con
        // un mensaje mucho menos claro.
        //
        // Este mismo mecanismo es el que hace posibles los contratos
        // actualizables: un `fallback` que reenvía toda llamada desconocida a
        // otra dirección con `delegatecall`. Es potente y peligroso: así se
        // congelaron 513 774 ether en el caso Parity, en 2017.
    }

    // =========================================================================
    // 9 · AYUDANTE INTERNO
    // =========================================================================

    /**
     * @dev Acredita `monto` a `quien`, sin enviar nada.
     *
     *      `internal` y con guion bajo al principio: convención muy extendida
     *      para lo que no se llama desde fuera. Tener la contabilidad en un
     *      solo sitio evita la clase de error más tonta y más frecuente:
     *      sumarle a la cuenta equivocada.
     */
    function _pagar(address quien, uint256 monto) internal {
        if (monto > 0) saldo[quien] += monto;
        //
        // El `if` ahorra una escritura de estado cuando el monto es cero
        // (que cuesta gas igual, aunque no cambie nada).
        //
        // Aquí el `+=` es seguro: con Solidity 0.8, si desbordara, revertiría.
        // Y para desbordar un `uint256` haría falta más ether del que existe.
    }
}

// =============================================================================
// LO QUE ESTE CONTRATO *NO* HACE, Y HAY QUE DECIRLO
// =============================================================================
//
// Un contrato de clase también enseña por sus límites:
//
// · NO tiene pausa de emergencia. Si aparece un error, no hay forma de parar
//   el contrato. En producción se usaría `Pausable` de OpenZeppelin, sabiendo
//   que eso le da otro poder al dueño.
// · NO es actualizable. El código desplegado es el código para siempre. Es una
//   ventaja (nadie cambia las reglas) y una desventaja (nadie corrige un error).
// · NO valida el contenido. Un contrato no puede moderar texto; solo el dueño,
//   a mano, con `moderar()`.
// · NO guarda historia. Los mensajes anteriores solo quedan en los eventos, no
//   en el estado. Consultarlos es trabajo de la interfaz o de un indexador.
// · NO protege contra el dueño. Quien despliega puede moderar y retirar. Todo
//   contrato tiene una respuesta a "¿quién manda aquí?"; lo grave no es tener
//   un dueño, es no darse cuenta de que lo hay.
//
// Y la pregunta que atraviesa el curso entero, aplicada a este ejemplo:
// ¿este tablón necesita una blockchain? Con honestidad: NO. Una base de datos
// con una pasarela de pagos haría lo mismo, más rápido y más barato. Tendría
// sentido en cadena solo si hiciera falta que NADIE —tampoco su dueño— pudiera
// borrar la historia de lo publicado ni quedarse con el dinero ajeno sin que se
// vea. Saber distinguir esos dos casos vale más que saber escribir el contrato.
