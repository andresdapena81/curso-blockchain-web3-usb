/* =====================================================================
   Sesión 07 · Solidity II · estructuras de datos y patrones de diseño
   Estándar de la Sesión 4: cada concepto con idea llana, ejemplo trabajado
   y error típico; notas en todas las láminas; verificación al cierre de
   cada bloque. Las cifras de gas se MIDIERON con --gas-stats (Hardhat
   3.16.0, solc 0.8.28, optimizador 200) en test/s07/GasPushPull.test.js.
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 07 · SOLIDITY II · DATOS Y PATRONES", titulo: "Sesión 07 · Solidity II · estructuras de datos y patrones" });
  const { C, F, M, CW } = D;

  /* Lámina de pregunta de verificación (cierre de bloque) */
  async function verificacion({ kicker, titulo, preguntas, notas }) {
    const s = await D.lamina({ kicker, titulo, ic: "pregunta", tituloSize: 27 });
    D.parrafo(s, "Respondan en parejas, sin mirar las láminas. Si alguna no sale en un minuto, esa es la lámina que hay que volver a ver.", { y: 1.85, h: 0.6, size: 13.5 });
    preguntas.forEach((p, i) => {
      const y = 2.6 + i * 1.02;
      D.caja(s, { x: M, y, w: CW, h: 0.88, fill: i % 2 ? C.superf : C.blanco, sombra: false, lw: 1.25, line: C.grisClaro });
      s.addText(String(i + 1).padStart(2, "0"), { x: M + 0.15, y, w: 0.7, h: 0.88, fontFace: F.display, fontSize: 18, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, p, { x: M + 0.95, y: y + 0.08, w: CW - 1.15, h: 0.72, size: 13, valign: "middle", ls: 1.12 });
    });
    s.addNotes(notas);
    return s;
  }

  /* ------------------------------------------------------------ apertura */
  await D.portada({
    kicker: "SESIÓN 07 · UNIDAD II · ETHEREUM Y CONTRATOS",
    titulo: "SOLIDITY II\nDATOS Y\nPATRONES",
    sub: "Los patrones de diseño de Solidity no son elegancia: son cicatrices de dinero que se perdió.",
    palabra: "PATRONES",
    ic: "jerarquia",
    notas: "Apertura (2 min). Retomar la pregunta de la S6: si roban la clave del emisor, ¿qué puede hacer el ladrón? Hoy el contrato ya no guarda hashes sino DINERO ajeno, y casi cada patrón de hoy tiene un incidente real detrás. Contarlos: es lo que hace que se recuerden. Idea fuerza de la sesión: un contrato que envía dinero depende de que el otro quiera recibirlo.",
  });

  await D.agenda({
    intro: "Hoy el contrato custodia dinero ajeno. Todo gira alrededor de una pregunta: ¿qué pasa si alguien no juega limpio? Hay una pausa de 10 minutos entre A y B.",
    bloques: [
      ["A", "ESTRUCTURAS, ETHER Y PATRONES", "mapping, arreglos, herencia, enviar y recibir ether, retiro, CEI, pausa y gas medido.", "~70 min"],
      ["B", "LABORATORIO 07 · SUBASTA SEGURA", "Completar la subasta, ver el ataque, desplegar y llenar la tabla de gas push/pull.", "~75 min"],
      ["C", "DEVOLUCIÓN DEL ANTEPROYECTO", "Cómo se filtró el alcance, qué significa cada decisión y primeros pasos.", "~25 min"],
    ],
    notas: "70 + 10 de pausa + 75 + 25 = 180 minutos. Si el bloque A se alarga, recortar tiempo de la lámina de herencia, nunca del laboratorio: la evidencia de hoy sale del bloque B. La devolución del anteproyecto va al final para que los equipos salgan con la decisión fresca y los primeros pasos claros.",
  });

  await D.objetivo({
    objetivo: "Manejar estructuras compuestas y aplicar patrones seguros de manejo de fondos, midiendo su costo en gas.",
    preguntas: [
      "¿Por qué no se puede recorrer un mapping, y qué se hace en su lugar?",
      "¿Cómo se envía ether sin abrirle la puerta a un atacante?",
      "¿Por qué un contrato no debería enviar dinero por iniciativa propia?",
      "¿Cuánto cuesta la seguridad, medido en gas, y quién la paga?",
    ],
    ra: "RA3 · patrones y estándares (se evalúa)  ·  RA5 · base de la seguridad (complementario, se profundiza en la S9)",
    notas: "1 minuto. Leer las cuatro preguntas en voz alta y pedir que las escriban: al final del bloque A se responden en la lámina de verificación. La cuarta pregunta es la que distingue esta sesión: no basta con decir que un patrón es seguro; hay que medir cuánto cuesta.",
  });

  await D.glosario({
    items: [
      ["mapping", "tabla clave → valor", "Toda clave existe y devuelve cero si nunca se escribió. No se puede recorrer ni contar."],
      ["struct · enum", "tipos compuestos", "struct agrupa campos con nombre; enum define un conjunto cerrado de estados posibles."],
      ["interface · library", "piezas para componer", "interface: solo firmas, para llamar contratos ajenos. library: funciones reutilizables sin estado."],
      ["receive · fallback", "funciones especiales", "Lo que ejecuta un contrato al recibir ether sin datos, o una llamada que no reconoce."],
      ["CEI", "Checks-Effects-Interactions", "Orden obligatorio: validar, cambiar el estado propio y, solo al final, llamar hacia fuera."],
      ["Pull over push", "patrón de retiro", "El contrato acredita saldos y cada quien retira lo suyo, en lugar de enviar pagos."],
      ["Circuit breaker", "interruptor · Pausable", "Detener funciones en una emergencia. Lo que nunca se detiene: retirar lo propio."],
      ["bps", "basis points · puntos básicos", "10 000 bps = 100 %. La forma de expresar porcentajes sin punto flotante."],
    ],
    notas: "2 minutos. No leer todas: señalar CEI y pull over push, que son las dos ideas que más vuelven en la S9 y en el parcial práctico. bps aparece en DeFi (S14) con la misma lógica.",
  });

  /* =============================================================== A */
  {
    const s = await D.divisor({ letra: "A", titulo: "Estructuras, ether y patrones", sub: "La primera mitad es sobre datos. La segunda, sobre lo que pasa cuando esos datos son dinero y del otro lado hay un adversario.", minutos: "APROXIMADAMENTE 70 MINUTOS", ic: "jerarquia" });
    s.addNotes("Transición (30 s). Recordar que el contrato de certificados de la S6 no manejaba dinero: por eso no necesitaba ninguno de los patrones de hoy. La subasta del laboratorio sí.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · mapping a fondo", titulo: "Una tabla donde todas las claves existen", ic: "rejilla", tituloSize: 27 });
    D.codigo(s, `mapping(address => uint256) public saldos;
mapping(address => mapping(address => uint256)) public permisos; // anidado

saldos[ana] = 10;
saldos[beto];           // 0: nunca se escribió, pero "existe"`, { x: M, y: 1.9, w: CW, h: 1.65, lang: "sol", size: 12.5 });
    D.tabla(s, ["propiedad", "consecuencia práctica"], [
      ["Toda clave devuelve un valor", "No se distingue «nunca escrito» de «escrito con cero». Por eso el certificado de la S6 llevaba el campo existe."],
      ["Las claves no se guardan", "El valor vive en la ranura keccak256(clave, posición). No hay lista de claves que recorrer."],
      ["No tiene longitud", "No se sabe cuántas entradas tiene ni cuáles son, ni desde dentro ni desde fuera."],
      ["Borrar = poner en cero", "delete saldos[ana] no elimina la entrada: la devuelve al valor por defecto."],
    ], { y: 3.7, h: 2.5, colW: [3.3, 8.793], size: 11.5 });
    D.parrafo(s, "Error típico: usar saldos[x] == 0 para decidir «esta cuenta no existe». Una cuenta que retiró todo también da cero.", { y: 6.3, h: 0.5, size: 12.5, color: C.ocre });
    s.addNotes("3 minutos. La ranura keccak256(clave, posición) es el Keccak de la Sesión 2 otra vez: la ubicación de cada dato del mapping se calcula con un hash (documentación de Solidity, 'Layout of State Variables in Storage'). Preguntar: ¿cómo sabría la subasta quién participó, si el mapping no se puede recorrer? Respuesta: la lámina siguiente.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · el problema de recorrer", titulo: "Mapping más arreglo, y el bucle que nunca termina", ic: "alerta", tituloSize: 25 });
    D.codigo(s, `mapping(address => bool) public participo;
address[] private _participantes;

if (!participo[msg.sender]) {
    participo[msg.sender] = true;       // ¿está? en un paso
    _participantes.push(msg.sender);    // para poder listar
}`, { x: M, y: 1.9, w: 6.6, h: 2.8, lang: "sol", size: 12 });
    D.parrafo(s, "El patrón habitual: el mapping responde «¿está?» en un paso y el arreglo permite listar. Es exactamente lo que hace Subasta.sol. Pero el arreglo esconde una trampa.", { x: M + 6.9, y: 1.9, w: CW - 6.9, h: 1.5, size: 13 });
    D.definicion(s, "for (i = 0; i < _participantes.length; i++) { ... }", { x: M + 6.9, y: 3.55, w: CW - 6.9, h: 0.6, size: 11 });
    D.parrafo(s, "Cada vuelta cuesta gas. Con suficientes participantes, el bucle no cabe en el límite de gas del bloque y la función queda inutilizable para siempre.", { x: M + 6.9, y: 4.25, w: CW - 6.9, h: 0.95, size: 12.5, color: C.ocre });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Regla que no admite excepción", x: M, y: 5.0, w: CW, h: 1.72, texto: "Ninguna función que se ejecute en una transacción recorre un arreglo que un usuario pueda hacer crecer. Leer la lista desde fuera, con una llamada view, es gratis y seguro. Recorrerla dentro de una transacción es una denegación de servicio esperando a ocurrir.", size: 13 });
    s.addNotes("3 minutos. Por eso participantes() en Subasta.sol es view y lleva una advertencia en el comentario. Preguntar: ¿quién controla cuántos elementos tiene el arreglo? Cualquiera que puje. Un atacante puede pujar desde mil cuentas para inflarlo. Esta es una de las ocho vulnerabilidades de la S9 ('DoS por bucles no acotados').");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · arreglos", titulo: "Borrar de un arreglo sin dejar huecos", ic: "bloques", tituloSize: 28 });
    D.codigo(s, `uint256[] public ids;       // dinámico: crece con push
uint256[3] public podio;    // fijo: siempre 3

ids.push(7);
ids.pop();                  // quita el último

// delete NO lo quita: lo pone en 0 y deja un hueco
delete ids[1];

// quitar el elemento i sin hueco, en un paso (el orden cambia):
ids[i] = ids[ids.length - 1];
ids.pop();`, { x: M, y: 1.9, w: 7.2, h: 4.3, lang: "sol", size: 12 });
    D.lista(s, [
      "Ejemplo: ids = [4, 9, 6]. delete ids[1] deja [4, 0, 6] y la longitud sigue en 3.",
      "Con «intercambiar y quitar» sobre i = 0: [6, 9]. Cuesta lo mismo con 3 o con 3 000 elementos.",
      "Si el orden importa, casi siempre es mejor no borrar y marcar como inactivo.",
      "Arreglo fijo: más barato y más seguro cuando el tamaño se conoce de antemano.",
    ], { x: M + 7.5, y: 1.9, w: CW - 7.5, h: 4.3, size: 12.5, gap: 9 });
    D.parrafo(s, "En la literatura aparece como «swap and pop». Error típico: creer que delete acorta el arreglo.", { y: 6.35, h: 0.4, size: 12, color: C.ocre });
    s.addNotes("3 minutos. Hacer el ejemplo en el tablero: [4, 9, 6], quitar el índice 0 con swap and pop → se copia el 6 a la posición 0 y se hace pop → [6, 9]. Desplazar todos los elementos sería un bucle: el mismo problema de A.2.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · tipos compuestos", titulo: "struct y enum: una máquina de estados", ic: "capas", tituloSize: 28 });
    D.codigo(s, `enum Estado { Abierta, PorFinalizar, Finalizada }   // 0, 1, 2

struct Puja {
    address postor;     // 20 bytes
    uint96  monto;      // 12 bytes → juntos: una sola ranura
    uint64  momento;    // otra ranura
}

function estado() public view returns (Estado) {
    if (finalizada) return Estado.Finalizada;
    if (block.timestamp >= fin) return Estado.PorFinalizar;
    return Estado.Abierta;
}`, { x: M, y: 1.9, w: 7.6, h: 4.4, lang: "sol", size: 11.5 });
    D.lista(s, [
      "El enum se guarda como un entero pequeño: por eso las pruebas comparan estado() con 0n, 1n y 2n.",
      "Prohíbe valores inválidos: no existe el estado 7.",
      "Aquí el estado se CALCULA desde el tiempo: nadie tiene que acordarse de cambiarlo.",
      "Un struct no tiene métodos: solo agrupa datos. El orden de los campos decide cuántas ranuras ocupa (A.16).",
    ], { x: M + 7.9, y: 1.9, w: CW - 7.9, h: 4.4, size: 12, gap: 8 });
    D.parrafo(s, "Error típico: guardar el estado en una variable y olvidar actualizarla cuando vence el plazo.", { y: 6.38, h: 0.4, size: 12, color: C.ocre });
    s.addNotes("3 minutos. estado() es el TODO 1 del laboratorio. Remarcar que PorFinalizar existe porque en la cadena nada pasa solo: el plazo vence, pero alguien tiene que llamar finalizar(). Preguntar: ¿qué pasaría si estado fuera una variable que se actualiza en pujar()? Respuesta: tras el vencimiento nadie puja, así que seguiría diciendo Abierta.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · dónde vive el dato", titulo: "storage, memory y calldata", ic: "bicho", tituloSize: 29 });
    D.tabla(s, ["ubicación", "qué es", "cuándo se usa"], [
      ["storage", "La ranura real y permanente del contrato. Escribir es lo más caro de la EVM.", "Leer o modificar lo guardado: struct storage c = _certificados[h];"],
      ["memory", "Copia temporal, se borra al terminar la función.", "Trabajar con datos que no se guardan."],
      ["calldata", "Los datos de la transacción, solo lectura, sin copia.", "Parámetros string o arreglos de funciones external: lo más barato."],
    ], { y: 1.9, h: 2.25, colW: [1.8, 5.1, 5.193], size: 11.5 });
    D.dosColumnas(s,
      { et: "Bien · storage", texto: "Certificado storage c = _certificados[h];\nc.revocado = true;\nApunta a la ranura real: queda guardado." },
      { et: "Mal · memory", linea: C.rojo, color: C.rojo, texto: "Certificado memory c = _certificados[h];\nc.revocado = true;\nEs una copia: se pierde al salir. Compila sin avisar." },
      { y: 4.3, h: 1.75, size: 12 });
    D.parrafo(s, "Por qué es tan peligroso: no hay error ni advertencia. La transacción termina bien, emite su evento y cobra su gas. Solo una prueba que vuelva a leer el estado descubre que no cambió nada: justo lo que la Sesión 8 enseña a escribir.", { y: 6.15, h: 0.65, size: 12, color: C.ocre });
    s.addNotes("4 minutos. Mostrar revocar() del contrato de la S6: usa storage. Pedir que imaginen el cambio a memory: el evento CertificadoRevocado se emitiría y el certificado seguiría válido. calldata ya apareció en emitir(bytes32, string calldata programa) de la S6: es la tercera optimización de gas de hoy.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · reutilizar", titulo: "Herencia: heredar lo auditado", ic: "jerarquia", tituloSize: 28 });
    D.codigo(s, `import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract Subasta is ISubasta, Ownable, Pausable {
    constructor(uint256 duracion, uint256 minima) Ownable(msg.sender) {
        ...
    }
    function pujar() external payable override whenNotPaused { ... }
}`, { x: M, y: 1.9, w: CW, h: 2.9, lang: "sol", size: 12 });
    D.tabla(s, ["palabra", "significa"], [
      ["is A, B, C", "Hereda estado, funciones y modificadores. Varios padres, del más general al más específico."],
      ["virtual · override", "El padre permite que una función se reemplace; el hijo declara que la reemplaza."],
      ["Ownable(msg.sender)", "Los argumentos del constructor del padre se pasan en la declaración del constructor hijo."],
    ], { y: 5.0, h: 1.4, colW: [2.8, 9.293], size: 11 });
    D.parrafo(s, "Error típico: copiar Ownable a mano «para entenderlo mejor». Se entiende leyéndolo; se usa heredándolo.", { y: 6.45, h: 0.38, size: 12, color: C.ocre });
    s.addNotes("3 minutos. OpenZeppelin v5 exige pasar el dueño inicial al constructor de Ownable (en v4 era implícito). Pausable en v5 vive en utils/, no en security/: tutoriales viejos fallan al compilar por esa ruta. Heredar código auditado y usado por miles de contratos es la defensa número uno de la S9.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · piezas para componer", titulo: "abstract, interface y library", ic: "rejilla", tituloSize: 28 });
    D.tabla(s, ["", "abstract contract", "interface", "library"], [
      ["Qué es", "Un contrato con funciones sin implementar.", "Solo firmas de funciones, eventos y tipos.", "Funciones reutilizables."],
      ["Tiene estado", "Sí.", "No.", "No (salvo constantes)."],
      ["Se despliega sola", "No: hay que heredarla.", "No.", "Solo si tiene funciones external."],
      ["Para qué sirve", "Plantillas con partes obligatorias.", "Llamar a un contrato ajeno sabiendo solo su forma.", "Aritmética, validaciones, utilidades."],
      ["En el laboratorio", "—", "ISubasta: la cumplen push, pull y Subasta.", "Porcentajes, con using for."],
    ], { y: 1.9, h: 3.3, colW: [2.3, 3.3, 3.3, 3.193], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Por qué ISubasta importa en el laboratorio", x: M, y: 5.4, w: CW, h: 1.32, texto: "PostorHostil recibe una ISubasta, no una Subasta concreta. Por eso el mismo atacante sirve contra la versión push y contra la pull: solo conoce la forma, y eso basta para compararlas.", size: 12.5 });
    s.addNotes("3 minutos. Preguntar: ¿qué contrato ajeno de la vida real se llama sabiendo solo su interfaz? Un token ERC-20 (S10): cualquier contrato que cumpla IERC20 se puede usar sin conocer su código.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · una library, con números", titulo: "Porcentajes sin punto flotante", ic: "moneda", tituloSize: 28 });
    D.codigo(s, `library Porcentajes {
    uint256 internal constant BASE = 10_000;       // 100 %
    function aplicarBps(uint256 monto, uint256 bps) internal pure returns (uint256) {
        return (monto * bps) / BASE;                // multiplicar ANTES de dividir
    }
}
using Porcentajes for uint256;
mejorPuja.aplicarBps(100);     // en vez de Porcentajes.aplicarBps(mejorPuja, 100)`, { x: M, y: 1.9, w: CW, h: 2.7, lang: "sol", size: 11.5 });
    D.tabla(s, ["cálculo", "resultado", "qué enseña"], [
      ["1 % de 2 ETH = 2·10¹⁸ × 100 / 10 000", "2·10¹⁶ wei = 0,02 ETH", "El mínimo siguiente tras una puja de 2 ETH es 2,02 ETH (lo comprueba una prueba)."],
      ["(150 × 100) / 10 000", "1 wei", "Correcto: se redondea hacia abajo."],
      ["150 × (100 / 10 000)", "0 wei", "Dividir primero: 100 / 10 000 = 0 en enteros. Todo se pierde."],
    ], { y: 4.8, h: 1.95, colW: [4.0, 2.6, 5.493], size: 11 });
    s.addNotes("3 minutos. En Solidity no hay decimales: 100 / 10 000 da 0. Hacer las dos cuentas en el tablero. Es el mismo error que causó pérdidas por redondeo en protocolos DeFi (S14). La prueba 'se usa desde la subasta: 1 % de 2 ETH son 0,02 ETH' verifica la primera fila.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · enviar ether", titulo: "transfer, send y call: cuál usar", ic: "moneda", tituloSize: 29 });
    D.tabla(s, ["forma", "gas que entrega al receptor", "si falla", "hoy"], [
      ["transfer", "2 300 fijo", "Revierte.", "Desaconsejada: un receptor que haga algo al recibir puede quedarse sin gas."],
      ["send", "2 300 fijo", "Devuelve false, y es fácil ignorarlo.", "Desaconsejada por la misma razón, y más peligrosa."],
      ["call{value: x}(\"\")", "Todo el disponible", "Devuelve false.", "La recomendada, SIEMPRE comprobando el resultado y aplicando CEI."],
    ], { y: 1.9, h: 2.6, colW: [2.5, 2.6, 2.9, 4.093], size: 11.5 });
    D.codigo(s, `(bool ok, ) = payable(destino).call{value: monto}("");
if (!ok) revert EnvioFallido();          // nunca ignorar ok`, { x: M, y: 4.7, w: CW, h: 0.95, lang: "sol", size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.82, w: CW, h: 0.92, texto: "Escribir destino.call{value: monto}(\"\"); sin leer el resultado. Si el envío falla, el contrato sigue como si hubiera pagado.", size: 12.5 });
    s.addNotes("3 minutos. El compilador advierte si se ignora el valor de retorno de call; hacerles notar esa advertencia. send sin comprobar es exactamente el error del caso de A.13 (King of the Ether).");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · por qué call y no transfer", titulo: "Los 2 300 de gas dejaron de alcanzar", ic: "gas", tituloSize: 27 });
    D.pasos(s, [
      ["ANTES DE 2019", "transfer se recomendaba contra la reentrada: con 2 300 de gas el receptor no alcanza a volver a llamar."],
      ["ISTANBUL · EIP-1884", "Una actualización de la red subió el costo de leer storage (SLOAD) de 200 a 800 de gas."],
      ["LO QUE SE ROMPIÓ", "Contratos receptores legítimos cuyo receive leía una variable pasaron de caber a no caber en 2 300: transfer hacia ellos empezó a revertir."],
      ["LA LECCIÓN", "No se puede depender de un costo de gas fijo: la red lo cambia. Se entrega todo el gas con call y la reentrada se previene con CEI."],
    ], { y: 1.9, alto: 0.9, gap: 0.12, anchoEt: 2.8, size: 12.5 });
    D.parrafo(s, "Fuentes: EIP-1884 (eips.ethereum.org/EIPS/eip-1884) y el artículo de ConsenSys Diligence «Stop Using Solidity's transfer() Now» (septiembre de 2019).", { y: 6.08, h: 0.65, size: 11.5, color: C.gris });
    s.addNotes("3 minutos. Esta es una lección de ingeniería general: una defensa que depende de un número que no controlas no es una defensa. call abre la puerta a la reentrada; por eso call y CEI van siempre juntos. Valores de SLOAD verificados en el texto de la EIP-1884.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · recibir ether", titulo: "receive y fallback", ic: "red", tituloSize: 31 });
    D.nodo(s, { x: M, y: 2.0, w: 3.6, h: 0.7, titulo: "LLEGA UNA LLAMADA", fill: C.tinta, color: C.naranja });
    D.flecha(s, M + 3.6, 2.35, M + 4.3, 2.35, C.tinta, 2);
    D.nodo(s, { x: M + 4.3, y: 2.0, w: 3.4, h: 0.7, titulo: "¿data está vacío?", fill: C.blanco, line: C.naranja });
    D.flecha(s, M + 6.0, 2.7, M + 6.0, 3.3, C.naranja, 2);
    D.etiqueta(s, "SÍ", { x: M + 6.1, y: 2.82, w: 0.6, size: 9, color: C.ocre });
    D.nodo(s, { x: M + 4.3, y: 3.3, w: 3.4, h: 0.7, titulo: "¿existe receive()?", fill: C.blanco, line: C.naranja });
    D.flecha(s, M + 6.0, 4.0, M + 6.0, 4.6, C.naranja, 2);
    D.etiqueta(s, "SÍ", { x: M + 6.1, y: 4.12, w: 0.6, size: 9, color: C.ocre });
    D.nodo(s, { x: M + 4.3, y: 4.6, w: 3.4, h: 0.7, titulo: "EJECUTA receive()", fill: C.superf, line: C.violeta });
    D.flecha(s, M + 7.7, 2.35, M + 8.6, 2.35, C.tinta, 2);
    D.etiqueta(s, "NO", { x: M + 7.8, y: 1.98, w: 0.6, size: 9, color: C.gris });
    D.flecha(s, M + 7.7, 3.65, M + 8.6, 3.65, C.tinta, 2);
    D.etiqueta(s, "NO", { x: M + 7.8, y: 3.28, w: 0.6, size: 9, color: C.gris });
    D.nodo(s, { x: M + 8.6, y: 2.0, w: CW - 8.6, h: 2.0, titulo: "¿existe fallback()?", sub: "Sí → ejecuta fallback()\nNo → la llamada revierte", fill: C.blanco, line: C.tinta, subSize: 12 });
    D.parrafo(s, "Subasta.sol no tiene ninguna de las dos, a propósito: la única puerta del dinero es pujar(). Dos pruebas nuevas lo comprueban.", { x: M, y: 3.0, w: 3.9, h: 2.3, size: 12.5, color: C.ocre });
    D.codigo(s, `receive() external payable { ... }            // ether sin datos
fallback() external payable { ... }          // función que no existe`, { x: M, y: 5.55, w: CW, h: 1.15, lang: "sol", size: 12 });
    s.addNotes("3 minutos. Recorrer el diagrama con dos casos: (1) alguien envía 1 ETH desde la billetera a la subasta sin datos → no hay receive ni fallback → revierte (prueba 'rechaza ether enviado directamente'); (2) alguien llama al selector 0x12345678 → revierte (prueba 'función que no existe'). El PostorHostil usa receive() para lo contrario: rechazar todo pago que le envíen.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · patrón · control de acceso", titulo: "Ownable, y lo que pasa si se pierde la clave", ic: "llave", tituloSize: 27 });
    D.parrafo(s, "Un solo dueño con permisos especiales. En la subasta, el dueño es el beneficiario y quien puede pausar. Nada más: finalizar lo puede hacer cualquiera.", { y: 1.9, h: 0.65, size: 13.5 });
    D.tabla(s, ["pieza de OpenZeppelin v5", "qué aporta"], [
      ["Ownable(msg.sender)", "El dueño se fija explícitamente en el constructor."],
      ["onlyOwner", "Modificador que revierte con OwnableUnauthorizedAccount(cuenta)."],
      ["transferOwnership", "Traspasa el control. Un error de tipeo en la dirección lo pierde para siempre."],
      ["Ownable2Step", "El nuevo dueño debe llamar acceptOwnership: evita traspasar a una dirección equivocada."],
      ["renounceOwnership", "Deja el contrato sin dueño. Irreversible: las funciones onlyOwner quedan bloqueadas."],
    ], { y: 2.7, h: 3.0, colW: [3.5, 8.593], size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Diseño mínimo de privilegios", x: M, y: 5.84, w: CW, h: 0.94, texto: "¿Por qué finalizar() NO es onlyOwner? Si el dueño desaparece, los perdedores igual pueden cerrar la subasta y retirar.", size: 12.5 });
    s.addNotes("3 minutos. Conectar con la pregunta de la S6: un dueño único es un punto único de falla; la respuesta madura (multifirma) llega en la S15. Principio: dar al dueño solo lo que no puede hacer nadie más. La prueba 'cualquiera puede finalizar' existe para que nadie 'mejore' el contrato poniéndole onlyOwner.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · patrón · retiro", titulo: "El contrato nunca envía: cada quien retira", ic: "moneda", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Push · enviar", linea: C.rojo, color: C.rojo, texto: "Al superar una puja, el contrato devuelve el dinero al postor anterior en la misma transacción. Parece amable. Pero la puja nueva depende de que el pago al anterior salga bien, y ese anterior puede ser un contrato que lo rechace." },
      { et: "Pull · retirar", texto: "El contrato anota: «a Ana se le deben 2 ETH». Ana llama a retirar() cuando quiera. Si su retiro falla, solo falla el suyo: nadie más queda bloqueado." },
      { y: 1.9, h: 2.55, size: 13 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Ocurrió · King of the Ether Throne, febrero de 2016", x: M, y: 4.65, w: CW, h: 2.05, texto: "Un juego pagaba automáticamente al «rey» destronado con send y 2 300 de gas. Los pagos a billeteras que eran contratos fallaban por falta de gas, el contrato no revisaba el resultado y seguía como si hubiera pagado. Los autores devolvieron a mano 98,5 ether y publicaron un análisis del fallo (kingoftheether.com/postmortem.html) que se volvió referencia del patrón de retiro.", size: 12 });
    s.addNotes("3 minutos. Datos del caso verificados en el post-mortem oficial: incidente del 6 al 8 de febrero de 2016, línea culpable currentMonarch.etherAddress.send(compensation) sin comprobar el retorno, reembolso manual de 98,5 ether. Dos errores juntos: push y no comprobar el resultado.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · el ataque del laboratorio", titulo: "El postor hostil", ic: "bicho", tituloSize: 31 });
    D.codigo(s, `contract PostorHostil {
    function pujarEn(ISubasta s) external payable {
        s.pujar{value: msg.value}();
    }
    receive() external payable {
        revert NoAceptoPagos();   // rechaza la devolución
    }
}`, { x: M, y: 1.9, w: 6.6, h: 3.0, lang: "sol", size: 12 });
    D.pasos(s, [
      ["PUJA", "El contrato hostil puja 1 ETH en la subasta push."],
      ["BETO OFRECE 50", "La subasta intenta devolver 1 ETH al hostil dentro de la puja de Beto."],
      ["RECHAZO", "receive() revierte, el call devuelve false, la subasta revierte con EnvioFallido."],
      ["CONGELADA", "Nadie puede superar al hostil. Gana la subasta con 1 ETH."],
    ], { x: M + 6.9, y: 1.9, w: CW - 6.9, alto: 0.82, gap: 0.06, anchoEt: 1.9, size: 11.5 });
    D.enunciado(s, "El atacante no robó un centavo. Solo se negó a que le devolvieran su dinero, y eso bastó para quedarse con el lote.", { y: 5.48, h: 1.28, size: 17, line: C.rojo });
    s.addNotes("4 minutos. Correr en vivo: npx hardhat test test/s07/Subasta.test.js --grep \"postor hostil\". Las dos pruebas con ★ lo demuestran contra las dos versiones. Preguntar: ¿qué ganaría el hostil en una subasta de un computador que vale 50 ETH? El computador por 1 ETH. Es la 'denegación de servicio por receptor que revierte' de la S9.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · patrón · el orden de las operaciones", titulo: "Checks → Effects → Interactions", ic: "escudo", tituloSize: 28 });
    D.codigo(s, `function retirar() external {
    uint256 monto = pendientes[msg.sender];
    if (monto == 0) revert NadaQueRetirar();             // 1 · CHECKS

    pendientes[msg.sender] = 0;                          // 2 · EFFECTS

    (bool ok, ) = payable(msg.sender).call{value: monto}(""); // 3 · INTERACTIONS
    if (!ok) revert EnvioFallido();
}`, { x: M, y: 1.9, w: CW, h: 2.9, lang: "sol", size: 12.5 });
    D.dosColumnas(s,
      { et: "Si se invierte el orden", linea: C.rojo, color: C.rojo, texto: "Enviar primero y poner a cero después. El receptor, dentro de su receive(), vuelve a llamar a retirar() antes de que el saldo quede en cero, y cobra otra vez. Y otra." },
      { et: "Con este orden", texto: "Cuando el receptor recibe el control, su saldo ya es cero. Si vuelve a llamar, no hay nada que cobrar. El ataque se desactiva sin ninguna herramienta extra." },
      { y: 5.0, h: 1.75, size: 12 });
    s.addNotes("4 minutos. Esto es la reentrada: el robo de The DAO en 2016, que se explota en vivo en la S9. Hoy basta con que el orden se vuelva un hábito. Ejemplo mental: Ana tiene 1 ETH pendiente y el contrato guarda 10 ETH de otros. Con el orden invertido, su receive llama retirar() nueve veces más antes de que la primera llamada ponga el saldo en cero. Es el TODO 5 del laboratorio, y la pregunta 6 del informe.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · patrón · interruptor de emergencia", titulo: "Pausar, y qué no se pausa nunca", ic: "alerta", tituloSize: 27 });
    D.parrafo(s, "Pausable permite detener funciones cuando se descubre un problema. Es útil, y es un poder que se puede abusar.", { y: 1.9, h: 0.6, size: 14.5 });
    D.dosColumnas(s,
      { et: "Qué conviene pausar", items: ["Recibir dinero nuevo: pujas, depósitos, compras.", "Funciones que agravan el daño si hay un fallo.", "Todo lo que el dueño no puede reparar sin detener."] },
      { et: "Qué NO se pausa", linea: C.rojo, color: C.rojo, items: ["Retirar lo propio. Si el dueño pudiera bloquear los retiros, el contrato sería una custodia disfrazada.", "Consultas: nunca dependen de la pausa."] },
      { y: 2.65, h: 2.55, size: 13 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La prueba que lo demuestra", x: M, y: 5.45, w: CW, h: 1.25, texto: "En el laboratorio hay una prueba que pausa la subasta, comprueba que nadie puede pujar y comprueba que Ana SÍ puede retirar. Si alguien pone whenNotPaused en retirar(), esa prueba falla con EnforcedPause.", size: 12.5 });
    s.addNotes("3 minutos. Error típico: pausar 'todo' por reflejo. Preguntar: si pausan retirar y el dueño pierde su clave, ¿qué pasa con el dinero de los perdedores? Queda atrapado para siempre. Un interruptor que atrapa fondos ajenos convierte un fallo técnico en una confiscación.");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · gas · empaquetado", titulo: "El orden de las variables cuesta dinero", ic: "gas", tituloSize: 28 });
    D.codigo(s, `// 3 ranuras
struct Desordenado {
    uint64  a;   // ranura 0
    uint256 b;   // ranura 1: no cabe con a
    uint64  c;   // ranura 2
}`, { x: M, y: 1.9, w: CW / 2 - 0.15, h: 2.45, lang: "sol", size: 12, titulo: "desordenado" });
    D.codigo(s, `// 2 ranuras
struct Ordenado {
    uint64  a;   // ranura 0
    uint64  c;   // ranura 0: caben juntos
    uint256 b;   // ranura 1
}`, { x: M + CW / 2 + 0.15, y: 1.9, w: CW / 2 - 0.15, h: 2.45, lang: "sol", size: 12, titulo: "ordenado" });
    D.cifra(s, "88 341", "gas para guardar el struct desordenado", { x: M, y: 4.55, w: 3.8, h: 1.5, color: C.rojo, size: 30 });
    D.cifra(s, "66 279", "gas para guardar los mismos datos, ordenados", { x: M + 4.1, y: 4.55, w: 3.8, h: 1.5, color: C.verde, size: 30 });
    D.cifra(s, "−22 062", "una ranura nueva menos: 20 000 + 2 100 de acceso en frío", { x: M + 8.2, y: 4.55, w: CW - 8.2, h: 1.5, size: 30 });
    D.parrafo(s, "Medido con --gas-stats (Empaquetado.sol). Regla: agrupar juntos los tipos pequeños. Error típico: creer que uint64 ahorra por sí solo; solo ahorra si comparte ranura.", { y: 6.2, h: 0.6, size: 12, color: C.ocre });
    s.addNotes("3 minutos. La diferencia medida, 22 062, coincide casi exacta con estrenar una ranura: 20 000 (escribir en una ranura en cero) + 2 100 (primer acceso en frío, EIP-2929). Esa deducción es la pregunta 4 del informe. Una ranura = 32 bytes; dos uint64 ocupan 16.");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · gas · lo que no ocupa ranura", titulo: "constant, immutable y calldata", ic: "gas", tituloSize: 28 });
    D.tabla(s, ["palabra", "dónde vive el valor", "en Subasta.sol", "error típico"], [
      ["constant", "Incrustado en el código al compilar. No ocupa storage.", "INCREMENTO_MINIMO_BPS = 100", "Querer asignarla en el constructor: no compila."],
      ["immutable", "Se fija en el constructor y queda incrustado en el código desplegado.", "fin y pujaMinima", "Usarla para algo que debe cambiar después."],
      ["calldata", "Se lee directo de la transacción, sin copiarlo a memory.", "(en la S6: string calldata programa)", "Usar memory en parámetros de funciones external por costumbre."],
    ], { y: 1.9, h: 3.2, colW: [1.8, 3.9, 3.2, 3.193], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Por qué importa", x: M, y: 5.3, w: CW, h: 1.42, texto: "Leer una variable de storage cuesta 2 100 de gas la primera vez en cada transacción (EIP-2929). Leer una constant o una immutable cuesta lo mismo que leer un número escrito en el código. Todo lo que no cambia después del despliegue debería ser una de las dos.", size: 12.5 });
    s.addNotes("3 minutos. Preguntar: ¿por qué fin es immutable y no constant? Porque depende del momento del despliegue (block.timestamp + duración): no se conoce al compilar. ¿Por qué mejorPuja no puede ser immutable? Porque cambia con cada puja.");
  }

  {
    const s = await D.lamina({ kicker: "A.19 · el costo de la seguridad · medido", titulo: "Push frente a pull, con --gas-stats", ic: "balanza", tituloSize: 27 });
    D.parrafo(s, "Escenario A: cuatro postores distintos pujan 1, 2, 3 y 4 ETH; la subasta vence, se finaliza y todos retiran. Mismos pasos contra tres contratos.", { y: 1.85, h: 0.62, size: 13 });
    D.tabla(s, ["gas por función", "SubastaPush", "SubastaPullMinima", "Subasta (completa)"], [
      ["pujar · la primera", "67 047", "67 061", "138 289"],
      ["pujar · cada una de las otras 3", "42 280", "55 350", "109 890"],
      ["finalizar", "56 227", "71 622", "73 922"],
      ["retirar · 4 veces", "—", "29 977 c/u", "30 000 c/u"],
      ["TOTAL del escenario", "250 114", "424 641", "661 881"],
    ], { y: 2.6, h: 2.65, colW: [3.9, 2.6, 2.8, 2.793], size: 12 });
    D.enunciado(s, "El patrón seguro cuesta un 70 % más en total. Se paga con gusto: la alternativa es que un desconocido decida quién gana.", { y: 5.45, h: 1.28, size: 16, line: C.naranja });
    s.addNotes("4 minutos. Cifras medidas con npx hardhat test test/s07/GasPushPull.test.js --grep \"escenario A\" --gas-stats. El total sale de las columnas: push = 67 047 + 3 × 42 280 + 56 227. La comparación justa es push contra pull mínima (idénticas salvo el patrón). La completa además registra participantes (mapping + arreglo = dos ranuras nuevas por postor): eso cuesta más que el propio patrón pull. No vender el retiro como 'más eficiente': es más seguro, y eso se paga.");
  }

  {
    const s = await D.lamina({ kicker: "A.20 · la sorpresa del escenario B", titulo: "Cuando dos se disputan el lote", ic: "grafico", tituloSize: 28 });
    D.parrafo(s, "Escenario B: Ana y Beto se alternan seis pujas (1, 2, 3, 4, 5, 6 ETH). Ahora cada postor es superado varias veces.", { y: 1.85, h: 0.62, size: 13 });
    D.tabla(s, ["pujar (según --gas-stats)", "SubastaPush", "SubastaPullMinima"], [
      ["mínimo", "42 280", "38 250"],
      ["máximo (la primera)", "67 047", "67 061"],
      ["TOTAL (con retiros)","334 674", "454 064"],
    ], { x: M, y: 2.6, w: 7.0, h: 1.9, colW: [3.4, 1.7, 1.9], size: 12 });
    D.parrafo(s, "Desde la cuarta puja, cada puja pull es MÁS BARATA que la push. ¿Por qué?", { x: M + 7.3, y: 2.6, w: CW - 7.3, h: 1.0, size: 13.5, bold: true, color: C.tinta });
    D.parrafo(s, "Estrenar pendientes[ana] cuesta 20 000; sumarle a una ranura que ya tiene valor, unos 2 900. Push, en cambio, paga el envío en cada puja.", { x: M + 7.3, y: 3.65, w: CW - 7.3, h: 1.1, size: 12.5 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "La lectura honesta", x: M, y: 4.8, w: CW, h: 1.92, texto: "El total sigue siendo mayor en pull (un 36 % más), porque los retiros se pagan aparte. Pero la diferencia se achica cuanto más se disputa la subasta. El costo de un patrón no es un número fijo: depende de cómo se usa el contrato. Por eso se mide con el escenario real, no se supone.", size: 12.5 });
    s.addNotes("4 minutos. Cifras de npx hardhat test test/s07/GasPushPull.test.js --grep \"escenario B\" --gas-stats. Pull: 67 061 (primera) + 55 350 × 2 (estrenan pendientes de Ana y de Beto) + 38 250 × 3 (ya tenían valor) = 292 511 en pujas. Push: 67 047 + 42 280 × 5 = 278 447. Costos del protocolo: 20 000 escribir en ranura en cero (SSTORE_SET), 2 900 modificar una con valor (SSTORE_RESET tras EIP-2929). Esta es la pregunta más interesante de la tabla del laboratorio.");
  }

  {
    const s = await D.lamina({ kicker: "A.21 · lo que hay que llevarse del bloque A", titulo: "Seis reglas que cuesta dinero ignorar", ic: "lista", tituloSize: 27 });
    const ideas = [
      "Nunca recorrer, dentro de una transacción, un arreglo que un usuario pueda hacer crecer.",
      "storage para modificar lo guardado; memory para una copia que se descarta.",
      "Enviar ether con call, comprobar el resultado y aplicar CEI.",
      "El contrato acredita; cada quien retira lo suyo.",
      "Pausar lo que agrava el daño; nunca bloquear los retiros ajenos.",
      "La seguridad cuesta gas. Se mide con el escenario real, se explica y se paga.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14.5, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
    s.addNotes("1 minuto. Estas seis reglas son la lista de chequeo del informe de decisiones de diseño y de la auditoría cruzada de la S9.");
  }

  await verificacion({
    kicker: "Verificación · bloque A",
    titulo: "Antes de la pausa: cuatro preguntas",
    preguntas: [
      "La subasta tiene 1 000 participantes en su arreglo. ¿Qué función NO deberían escribir nunca, y por qué?",
      "Un contrato envía el pago con transfer y deja de funcionar tras una actualización de la red. ¿Qué pasó?",
      "En retirar(), ¿qué línea tiene que ir antes del call, y qué ataque evita?",
      "¿Por qué la subasta pull cuesta más gas en el escenario A y la diferencia se achica en el B?",
    ],
    notas: "3 minutos, en parejas. Respuestas: (1) una función que recorra el arreglo en una transacción: el bucle puede exceder el gas del bloque y dejarla inutilizable; (2) los 2 300 de gas dejaron de alcanzar al receptor (EIP-1884 subió SLOAD); (3) pendientes[msg.sender] = 0, evita la reentrada; (4) en A cada acreditación estrena una ranura (20 000) y los retiros se pagan aparte; en B las ranuras ya existen y sumar cuesta unos 2 900. Pausa de 10 minutos después de esta lámina.",
  });

  /* =============================================================== B */
  {
    const s = await D.divisor({ letra: "B", titulo: "Laboratorio 07 · subasta segura", sub: "Completar una subasta con patrón de retiro, ver el ataque contra la versión ingenua, desplegarla en Sepolia y medir cuánto cuesta defenderse.", minutos: "APROXIMADAMENTE 75 MINUTOS · EN PAREJAS", ic: "martillo" });
    s.addNotes("Repartir el PDF de la guía (laboratorios-evm/guias/s07-subasta-patrones.pdf) antes de empezar. La guía trae cada paso con la salida esperada: el docente circula y resuelve dudas, no dicta comandos.");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · el mapa del laboratorio", titulo: "Dónde está cada patrón", ic: "jerarquia", tituloSize: 30 });
    D.tabla(s, ["archivo", "qué es", "patrón que ilustra"], [
      ["contracts/s07/Subasta.sol", "La subasta completa. Ustedes trabajan sobre el andamiaje: 6 TODO.", "Ownable, Pausable, retiro, CEI, enum, immutable"],
      ["ISubasta.sol · Porcentajes.sol", "Interfaz común y biblioteca de puntos básicos.", "interface, library, using for"],
      ["SubastaPush.sol", "La versión ingenua. No se modifica.", "antipatrón push"],
      ["SubastaPullMinima.sol", "Igual a la push salvo el patrón.", "comparación justa de gas"],
      ["PostorHostil.sol", "El atacante.", "receive que revierte"],
      ["Empaquetado.sol", "Dos structs con los mismos datos.", "empaquetado de storage"],
      ["test/s07/Subasta.test.js", "23 pruebas: la especificación.", "—"],
      ["test/s07/GasPushPull.test.js", "Los escenarios A y B de la tabla de gas.", "medir, no suponer"],
    ], { y: 1.9, h: 4.85, colW: [3.6, 4.6, 3.893], size: 11 });
    s.addNotes("2 minutos. Las pruebas son la especificación: el laboratorio se termina cuando las 23 pasan. No se modifican las pruebas ni SubastaPush.sol.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · preparar · 5 minutos", titulo: "Copiar el andamiaje y ver el rojo", ic: "terminal", tituloSize: 28 });
    D.codigo(s, `cd laboratorios-evm
cp andamiaje/s07/Subasta.sol contracts/s07/Subasta.sol     # PowerShell: igual
npx hardhat test test/s07/Subasta.test.js

  7 passing
  16 failing          ← así se empieza. Es lo esperado.`, { x: M, y: 1.9, w: CW, h: 2.3, lang: "js", size: 12 });
    D.pasos(s, [
      ["POR QUÉ 7 PASAN YA", "Prueban partes que no dependen de los TODO: el constructor, la pausa de OpenZeppelin, receive/fallback, la push y el empaquetado."],
      ["SI NO COMPILA", "El andamiaje compila tal cual. Si falla, se copió mal: repetir el cp. Si el error es de OpenZeppelin, falta npm install (S5)."],
      ["EN cmd DE WINDOWS", "copy andamiaje\\s07\\Subasta.sol contracts\\s07\\Subasta.sol"],
    ], { y: 4.4, alto: 0.72, gap: 0.1, anchoEt: 2.9, size: 12 });
    s.addNotes("5 minutos. Verificar que TODAS las parejas vean 7 passing / 16 failing antes de seguir: si alguien ve otra cosa, el problema es de entorno y se resuelve ahora. El andamiaje ya se probó: compila y fallan exactamente las 16 pruebas de los TODO.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · parte 1 · 35 minutos", titulo: "Completar los seis TODO, en orden", ic: "codigo", tituloSize: 28 });
    D.tabla(s, ["TODO", "qué hacer", "pruebas que lo confirman"], [
      ["1 · estado", "Finalizada si finalizada; PorFinalizar si block.timestamp >= fin; si no, Abierta.", "«recorre los tres estados»"],
      ["2 · minimoSiguiente", "Sin postor: pujaMinima. Con postor: mejorPuja + 1 %.", "«exige superar la puja anterior…»"],
      ["3 · pujar · checks", "Cerrada → SubastaCerrada. Monto bajo → PujaInsuficiente(minimo, msg.value).", "grupo «pujar»"],
      ["4 · pujar · effects", "ACREDITAR (+=) al superado, nunca enviarle. Actualizar, registrar, emitir.", "«acumula…» y ★ pull"],
      ["5 · retirar", "Leer → si 0, revertir → PONER EN CERO → call → evento.", "grupo «retirar» y la de pausa"],
      ["6 · finalizar", "Vencida y no finalizada → marcar → acreditar al owner() → evento.", "grupo «finalizar y estado»"],
    ], { y: 1.9, h: 4.05, colW: [2.5, 6.0, 3.593], size: 11 });
    D.parrafo(s, "Después de cada TODO: correr la suite. El número de «failing» debe bajar. Si sube, el último cambio rompió algo.", { y: 6.1, h: 0.62, size: 12.5, color: C.ocre });
    s.addNotes("35 minutos. Circular. El TODO 4 es donde más se equivocan: la tentación es devolver el dinero con call (eso es la push). El TODO 5 es CEI: pedir que expliquen en voz alta por qué el cero va antes del call. No mostrar la solución: se recupera con git checkout contracts/s07/Subasta.sol si alguien se pierde por completo.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · cómo saber que terminó", titulo: "23 en verde, y leer lo que imprimen", ic: "voto", tituloSize: 28 });
    D.codigo(s, `npx hardhat test test/s07/Subasta.test.js

  S07 · push frente a pull · el postor hostil
    ✔ ★ contra la subasta PUSH, un postor hostil congela todas las pujas siguientes
    ✔ ★ contra la subasta PULL, el mismo ataque no bloquea a nadie
        segunda puja · push: 42280 · pull: 55350 · retiro posterior: 29977
  S07 · empaquetado de storage
        desordenado: 88341 gas · ordenado: 66279 gas · ahorro: 22062
  23 passing`, { x: M, y: 1.9, w: CW, h: 3.1, lang: "js", size: 11 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Punto de control · levanten la mano", x: M, y: 5.2, w: CW, h: 1.5, texto: "Captura de pantalla de «23 passing»: es la primera evidencia del laboratorio. Si les da 22 y falla una sola, casi siempre es la de pausa o la de «acumula»: miren la tabla de errores (B.9) antes de preguntar.", size: 12.5 });
    s.addNotes("Los números impresos deben coincidir exactamente: la red local es determinista. Si una pareja obtiene cifras distintas con las 23 en verde, su Subasta hace más escrituras de las necesarias; vale la pena mirar su código.");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · parte 2 · 10 minutos", titulo: "Ver el ataque con los propios ojos", ic: "bicho", tituloSize: 28 });
    D.codigo(s, `npx hardhat test test/s07/Subasta.test.js --grep "postor hostil"`, { x: M, y: 1.9, w: CW, h: 0.65, lang: "js", size: 12.5 });
    D.pasos(s, [
      ["ABRIR LA PRUEBA ★ PUSH", "Leer las cinco líneas: el hostil puja 1 ETH, Beto intenta 5 y 50, las dos revierten con EnvioFallido, el hostil sigue ganando."],
      ["ABRIR LA PRUEBA ★ PULL", "Mismo ataque. Beto puja 5, la puja entra, y el ETH del hostil queda en pendientes: solo se perjudica a sí mismo."],
      ["ROMPERLO A PROPÓSITO", "Cambien el += de pendientes por un call al superado. Corran: la ★ PULL falla. Deshagan el cambio."],
      ["ANOTAR", "Pregunta 1 y 2 del informe: la cadena de llamadas, y quién pierde en cada caso."],
    ], { y: 2.75, alto: 0.84, gap: 0.1, anchoEt: 3.1, size: 12 });
    s.addNotes("10 minutos. El paso 3 es el más valioso: ver cómo una prueba que pasaba empieza a fallar por un cambio de diseño. Es la antesala de las pruebas de mutación de la S8.");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · parte 3 · desplegar primero · 10 minutos", titulo: "Subasta en Sepolia: arrancar el reloj", ic: "cohete", tituloSize: 27 });
    D.pasos(s, [
      ["REMIX", "Crear ISubasta.sol, Porcentajes.sol y Subasta.sol en la MISMA carpeta. Compilar con 0.8.28 y optimización 200."],
      ["DESPLEGAR", "Injected Provider, red Sepolia, billetera del curso. duracionSegundos = 600 · pujaMinima_ = 1000000000000000 (0,001 ETH)."],
      ["DOS PUJAS", "Desde dos cuentas: 0,001 ETH y luego 0,002 ETH (Value en la unidad correcta). Guardar los dos hashes."],
      ["MIENTRAS VENCE", "Diez minutos: se usan para la tabla de gas (B.7). Después: finalizar, y retirar desde la superada y desde la dueña."],
    ], { y: 1.9, alto: 0.82, gap: 0.08, anchoEt: 2.3, size: 12 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Solo red de prueba", x: M, y: 5.6, w: CW, h: 1.15, texto: "Billetera del curso, Sepolia, montos mínimos. No firmen nada cuyo contenido no entiendan: revisen red, función y valor en la ventana de la billetera.", size: 12 });
    s.addNotes("Desplegar ANTES de la tabla es a propósito: el plazo de 600 s corre mientras trabajan la parte 4. Si no hay fondos de prueba, el docente reparte desde la billetera institucional. Plan B sin red: desplegar en la red local de Remix y dejar la evidencia de Sepolia para la casa.");
  }

  {
    const s = await D.lamina({ kicker: "B.7 · parte 4 · 15 minutos", titulo: "La tabla de gas push frente a pull", ic: "grafico", tituloSize: 28 });
    D.codigo(s, `npx hardhat test test/s07/GasPushPull.test.js --grep "escenario A" --gas-stats
npx hardhat test test/s07/GasPushPull.test.js --grep "escenario B" --gas-stats`, { x: M, y: 1.9, w: CW, h: 0.95, lang: "js", size: 11.5 });
    D.tabla(s, ["copiar de --gas-stats", "Push · A", "Pull mínima · A", "Push · B", "Pull mínima · B"], [
      ["pujar · Average × #calls", "____", "____", "____", "____"],
      ["finalizar", "____", "____", "____", "____"],
      ["retirar · Average × #calls", "—", "____", "—", "____"],
      ["TOTAL (sumar)", "____", "____", "____", "____"],
    ], { y: 3.0, h: 2.2, colW: [3.5, 2.0, 2.3, 2.0, 2.293], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Cómo comprobar sus cuentas", x: M, y: 5.4, w: CW, h: 1.32, texto: "Cada prueba imprime el TOTAL exacto sumando los recibos. Su suma a partir de la tabla puede diferir en 1 o 2 de gas (el promedio se redondea); si difiere en más, revisen que multiplicaron por #calls.", size: 12.5 });
    s.addNotes("15 minutos. Un escenario a la vez: --gas-stats suma todas las pruebas que corren juntas. Las cifras correctas están en las láminas A.19 y A.20; no mostrarlas de nuevo aquí: que las lean de su terminal. La pregunta 3 del informe pide explicar por qué la columna B cambia.");
  }

  {
    const s = await D.lamina({ kicker: "B.8 · la evidencia de hoy", titulo: "El informe de decisiones de diseño", ic: "documento", tituloSize: 27 });
    D.parrafo(s, "No es un resumen del laboratorio: es la defensa de por qué el contrato es como es. Por cada decisión, cinco columnas:", { y: 1.85, h: 0.62, size: 13.5 });
    D.tabla(s, ["decisión", "alternativa descartada", "por qué", "evidencia", "costo"], [
      ["Retiro (pull)", "Devolver al instante (push)", "Un receptor hostil congela la push", "Pruebas ★", "+70 % gas en A"],
      ["pendientes = 0 antes del call", "Poner en cero después", "Evita la reentrada", "Prueba de retiro doble", "Ninguno"],
      ["retirar() sin whenNotPaused", "Pausar todo", "…", "…", "…"],
    ], { y: 2.6, h: 2.0, colW: [2.7, 2.6, 2.6, 2.2, 1.993], size: 11 });
    D.lista(s, [
      "Mínimo cinco decisiones: las tres de la tabla y dos más (immutable, finalizar sin dueño, sin receive, registro de participantes…).",
      "Más las seis preguntas de la guía, la tabla de gas llena y los hashes de Sepolia.",
      "Máximo dos páginas. Se escribe en pareja; cada decisión, con la prueba o la cifra que la respalda.",
    ], { y: 4.8, h: 1.95, size: 12.5, gap: 6 });
    s.addNotes("La evidencia de la sesión según el plan es 'contrato desplegado + informe de decisiones de diseño'. La plantilla completa está en la guía PDF. Insistir en la columna 'evidencia': una decisión sin prueba o sin cifra es una opinión.");
  }

  {
    const s = await D.lamina({ kicker: "B.9 · errores frecuentes", titulo: "Lo que suele salir mal", ic: "bicho", tituloSize: 30 });
    D.tabla(s, ["síntoma", "causa"], [
      ["Falla la de retiro: «changed by 0 wei»", "Falta el call: el pendiente se pone en cero pero nunca se envía el dinero."],
      ["Retiro revierte con NadaQueRetirar la primera vez", "Pusieron el pendiente en cero ANTES de leer el monto: el monto leído es 0."],
      ["«acumula si es superado varias veces» falla", "Usaron = en lugar de += al acreditar al superado."],
      ["«EnforcedPause» al retirar", "Pusieron whenNotPaused en retirar(): exactamente lo que no se debe."],
      ["El dueño no puede retirar tras finalizar", "No acreditaron mejorPuja al owner() en finalizar()."],
      ["La subasta no acepta la primera puja", "minimoSiguiente() aplica el 1 % aunque no haya postor."],
      ["La ★ PULL falla con EnvioFallido", "Devolvieron el dinero con call dentro de pujar(): eso es la push."],
      ["Remix no encuentra ISubasta.sol", "Los tres archivos deben estar en la misma carpeta."],
    ], { y: 1.9, h: 4.85, colW: [4.7, 7.393], size: 11.5 });
    s.addNotes("Proyectar esta lámina cuando varias parejas pregunten lo mismo. La tabla completa, con la solución paso a paso, está en la guía.");
  }

  await verificacion({
    kicker: "Verificación · bloque B",
    titulo: "Lo que el laboratorio debió dejar claro",
    preguntas: [
      "¿Qué prueba falla si alguien pone whenNotPaused en retirar(), y qué principio defiende esa prueba?",
      "Si el pendiente se pone en cero DESPUÉS del call, ¿las 23 pruebas lo detectan? ¿Qué haría falta para detectarlo?",
      "En la tabla de gas, ¿quién paga la diferencia entre push y pull: el ganador, los perdedores o el dueño?",
      "¿Qué prueba del laboratorio demuestra que la subasta no tiene receive()?",
    ],
    notas: "3 minutos. Respuestas: (1) 'pausada no acepta pujas, pero SÍ permite retirar'; el dueño no retiene fondos ajenos. (2) No: ninguna prueba usa un receptor que reentre; haría falta un contrato atacante que vuelva a llamar retirar() desde su receive (la S9 lo construye). Es una gran pregunta para anticipar la S8: las pruebas en verde no garantizan que todo esté bien. (3) Los perdedores pagan su retiro, y cada postor paga una puja más cara; el beneficiario paga su propio retiro. (4) 'rechaza ether enviado directamente, sin pasar por pujar()'.",
  });

  /* =============================================================== C */
  {
    const s = await D.divisor({ letra: "C", titulo: "Devolución del anteproyecto", sub: "Cada equipo recibe su decisión: aprobado, aprobado con recorte, o devuelto. Primero, los criterios con que se filtró el alcance.", minutos: "APROXIMADAMENTE 25 MINUTOS", ic: "bandera" });
    s.addNotes("Tener impresas o en el canal del curso las devoluciones individuales. Primero se explican los criterios para todos (8 minutos) y después cada equipo lee la suya y hace preguntas (15 minutos).");
  }

  {
    const s = await D.lamina({ kicker: "C.1 · con qué se filtró", titulo: "El filtro, en el orden en que se aplicó", ic: "tijera", tituloSize: 27 });
    D.etiqueta(s, "1 · Las tres preguntas que se hacen primero", { x: M, y: 1.85, w: 7.0, color: C.tinta, size: 10.5 });
    D.pasos(s, [
      ["SIN TECNOLOGÍA", "¿Se puede enunciar el problema sin nombrar la tecnología?"],
      ["ALTERNATIVA", "¿Qué alternativa sin cadena se consideró, y por qué no basta? (árbol de la S1)"],
      ["UNA PÁGINA", "¿Cabe el alcance —lo que entra y lo que no— en una sola página?"],
    ], { x: M, y: 2.25, w: 7.0, alto: 0.78, gap: 0.1, anchoEt: 2.1, size: 11.5 });
    D.parrafo(s, "Si alguna respuesta es no, el anteproyecto vuelve. Después: devoluciones automáticas. Por último: la rúbrica.", { x: M, y: 4.95, w: 7.0, h: 0.7, size: 12.5, color: C.ocre });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "2 · Devolución automática", x: M + 7.3, y: 1.9, w: CW - 7.3, h: 3.75, texto: "Sin importar el resto:\n\n· Datos personales en la cadena, o su hash si se puede adivinar (Ley 1581 de 2012).\n· Más de tres páginas.\n· No hay lista de lo que queda fuera del alcance.\n· Dinero real en cualquier parte del diseño.", size: 12 });
    D.parrafo(s, "3 · La rúbrica del anteproyecto: material/proyecto/01-anteproyecto.pdf, sección 04.", { y: 5.95, h: 0.6, size: 12.5, color: C.gris });
    s.addNotes("4 minutos. Es exactamente el filtro publicado en material/proyecto/01-anteproyecto (sección 03), y el mismo que se anunció en la S6 (lámina C.2). Nada es nuevo: por eso ningún equipo debería sorprenderse con su decisión. El 'hash que se puede adivinar' es el caso de una cédula o un correo: pocos valores posibles, se prueban todos.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · qué significa cada decisión", titulo: "Aprobado, recortado o devuelto", ic: "bandera", tituloSize: 28 });
    D.tabla(s, ["decisión", "recorte típico y su criterio", "qué sigue"], [
      ["Aprobado", "—", "El alcance aprobado es el contrato del equipo consigo mismo. Se construye desde hoy."],
      ["Aprobado con recorte", "Token + marketplace + votación → solo el flujo que justifica la cadena. Integración con sistemas de la universidad → se simula. App móvil → una página web.", "Aceptar o argumentar por escrito en 48 horas. Pasado el plazo, rige el recorte."],
      ["Devuelto", "El árbol de la S1 dice «base de datos», o hay una devolución automática.", "Se reorienta a un problema vecino; se califica la segunda versión."],
    ], { y: 1.9, h: 3.1, colW: [2.6, 5.4, 4.093], size: 11 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Un recorte no es un castigo", x: M, y: 5.2, w: CW, h: 1.52, texto: "El criterio es siempre el mismo: se conserva el flujo completo donde vive la regla que justifica la cadena, y sale lo que no la necesita o depende de algo que no controlan. Tres historias bien probadas valen más que diez a medias.", size: 12.5 });
    s.addNotes("4 minutos. Los ejemplos de recorte son genéricos, no de un equipo concreto: no exponer a nadie. Coherente con 01-anteproyecto (sección 03): 'si el árbol dice base de datos, el recorrido está bien hecho y el problema no sirve para este curso; no se castiga, se reorienta'. Remitir al deck 'Proyecto del docente · acotar el alcance', lámina 'El alcance es lo que decidiste NO hacer'.");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · primeros pasos", titulo: "Del papel al primer contrato", ic: "flecha", tituloSize: 29 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Tres preguntas para diseñar el contrato del proyecto", x: M, y: 1.9, w: CW, h: 2.2, texto: "1. ¿Mi contrato recibe o envía dinero? Si envía, ¿por qué no usa el patrón de retiro?\n2. ¿Hay algún arreglo que un usuario pueda hacer crecer y que yo recorra en una transacción?\n3. ¿Qué funciones pausaría en una emergencia, y cuáles nunca?", size: 13.5 });
    D.pasos(s, [
      ["ESTA SEMANA", "Leer la devolución, aceptar o argumentar el recorte, y escribir en una lámina lo que queda fuera."],
      ["ANTES DE LA S8", "Primer borrador del contrato principal en Remix: compila, aplica dos patrones de hoy."],
      ["EN LA S8", "El borrador se mueve a un repositorio Hardhat con pruebas. Ese será su repositorio de todo el semestre."],
    ], { y: 4.3, alto: 0.72, gap: 0.1, anchoEt: 2.4, size: 12.5 });
    s.addNotes("4 minutos. Los equipos reorientados trabajan primero la nueva versión del anteproyecto con el docente; el borrador del contrato va después. En la S8 el bloque C arranca con el repositorio Hardhat de cada equipo.");
  }

  await verificacion({
    kicker: "Verificación · bloque C",
    titulo: "Cada equipo, antes de salir",
    preguntas: [
      "¿Qué paso del filtro fue el que más pesó en su decisión, y qué habrían cambiado?",
      "Escriban en una frase qué queda FUERA de su alcance.",
      "¿Qué dato de su proyecto NO puede ir en la cadena, y qué va en su lugar?",
      "¿Qué patrón de hoy va a usar su contrato, y por qué?",
    ],
    notas: "5 minutos, por equipo. El docente recoge la hoja o la foto: sirve para la revisión de la S8. Si un equipo no puede responder la 3, su diseño de datos todavía no está resuelto y es la prioridad de la semana.",
  });

  await D.preguntaSemana({
    pregunta: "El postor hostil no robó nada y aun así ganó. ¿Dónde más —en el curso o en el mundo— alguien bloquea a todos solo con negarse a cooperar?",
    trabajo: [
      "Evidencia del laboratorio 07: 23 en verde, tabla de gas llena, Subasta en Sepolia (dirección + hashes) e informe de decisiones.",
      "Trabajo autónomo: refactorizar CertificadosUSB de la S6 aplicando dos patrones de hoy (guía, sección 11).",
      "Equipos: aceptar o argumentar el recorte en 48 h; primer borrador del contrato del proyecto.",
      "Traer el portátil con Node.js 22 y el repositorio instalado: la Sesión 8 es toda en la terminal.",
    ],
    notas: "La pregunta se retoma al abrir la S8 y conecta con la S9 (denegación de servicio) y con la S15 (quórum en gobernanza: una minoría que no vota puede bloquear). Respuestas posibles: el traidor que fuerza un empate en los generales bizantinos (S4), un validador que no firma, un socio que no firma en un multifirma 2 de 2.",
  });

  {
    const s = await D.cierre({
      frase: "Un contrato que envía dinero depende de que el otro quiera recibirlo.",
      sub: "Hoy vieron que la seguridad tiene forma de orden de operaciones y de patrones concretos, y que cuesta gas medible. La próxima sesión salen de Remix y aprenden a demostrar, con pruebas automáticas, que el contrato hace lo que dice.",
      proxima: "Sesión 8 · Hardhat, pruebas automatizadas y despliegue profesional",
    });
    s.addNotes("Cierre (1 minuto). Recordar que la tabla de gas y los hashes de Sepolia se entregan con el informe; sin evidencia en cadena el laboratorio no se califica (política del curso).");
  }

  return D.guardar(path.join(__dirname, "Sesion-07-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
