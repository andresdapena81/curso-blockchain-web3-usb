/* =====================================================================
   Sesión 07 · Solidity II · estructuras de datos y patrones de diseño
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 07 · SOLIDITY II · DATOS Y PATRONES", titulo: "Sesión 07 · Solidity II" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 07 · UNIDAD II · ETHEREUM Y CONTRATOS",
    titulo: "SOLIDITY II\nDATOS Y\nPATRONES",
    sub: "Los patrones de diseño de Solidity no son elegancia: son cicatrices de dinero que se perdió.",
    palabra: "PATRONES",
    ic: "jerarquia",
    notas: "Casi cada patrón de hoy tiene un incidente real detrás. Contarlos: es lo que hace que se recuerden.",
  });

  await D.agenda({
    intro: "Hoy el contrato maneja dinero ajeno. Todo lo que se aprende gira alrededor de una pregunta: ¿qué pasa si alguien no juega limpio?",
    bloques: [
      ["A", "ESTRUCTURAS Y PATRONES", "mapping, arreglos, herencia, manejo de ether, retiro, CEI, pausa y gas.", "~70 min"],
      ["B", "LABORATORIO 07 · SUBASTA", "Completar una subasta segura y demostrar el ataque del postor hostil.", "~80 min"],
      ["C", "DEVOLUCIÓN DEL ANTEPROYECTO", "Aprobados, recortes y primeros pasos del proyecto.", "~30 min"],
    ],
  });

  await D.objetivo({
    objetivo: "Manejar estructuras compuestas y aplicar patrones seguros de manejo de fondos.",
    preguntas: [
      "¿Por qué no se puede recorrer un mapping, y qué se hace en su lugar?",
      "¿Cómo se envía ether sin abrirle la puerta a un atacante?",
      "¿Por qué un contrato no debería enviar dinero por iniciativa propia?",
      "¿Cuánto cuesta la seguridad, medido en gas?",
    ],
    ra: "RA3 · patrones y estándares  ·  RA5 · base de la seguridad (complementario)",
  });

  await D.glosario({
    items: [
      ["mapping", "tabla clave → valor", "Toda clave existe y devuelve cero si nunca se escribió. No se puede recorrer."],
      ["struct · enum", "tipos compuestos", "struct agrupa campos con nombre; enum define un conjunto cerrado de estados."],
      ["interface", "interfaz", "Declara funciones sin implementarlas. Permite llamar a contratos que no se conocen."],
      ["library", "biblioteca", "Funciones reutilizables sin estado propio. Con using for se usan como métodos."],
      ["receive · fallback", "funciones especiales", "Lo que ejecuta un contrato al recibir ether sin datos, o una llamada que no reconoce."],
      ["CEI", "Checks-Effects-Interactions", "Orden obligatorio: validar, cambiar el estado propio, y solo al final llamar hacia fuera."],
      ["Pull over push", "patrón de retiro", "El contrato acredita saldos y cada quien retira lo suyo, en lugar de enviar pagos."],
      ["bps", "basis points · puntos básicos", "10 000 bps = 100 %. La forma de expresar porcentajes sin punto flotante."],
    ],
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "Estructuras y patrones", sub: "La mitad de la sesión es sobre datos. La otra mitad es sobre lo que pasa cuando esos datos son dinero y del otro lado hay un adversario.", minutos: "APROXIMADAMENTE 70 MINUTOS", ic: "jerarquia" });

  {
    const s = await D.lamina({ kicker: "A.1 · mapping a fondo", titulo: "Una tabla donde todas las claves existen", ic: "rejilla", tituloSize: 27 });
    D.codigo(s, `mapping(address => uint256) public saldos;
mapping(address => mapping(address => uint256)) public permisos; // anidado

saldos[ana] = 10;
saldos[beto];           // 0: nunca se escribió, pero "existe"`, { x: M, y: 1.9, w: CW, h: 1.75, lang: "sol", size: 12.5 });
    D.tabla(s, ["propiedad", "consecuencia práctica"], [
      ["Toda clave devuelve un valor", "No se distingue «nunca escrito» de «escrito con cero». Por eso el certificado de la S6 llevaba el campo existe."],
      ["Las claves no se guardan", "Se guarda el valor en la ranura keccak256(clave, posición). No hay lista de claves que recorrer."],
      ["No tiene longitud", "No se sabe cuántas entradas tiene ni cuáles son."],
      ["Borrar = poner en cero", "delete saldos[ana] no elimina la entrada: la devuelve al valor por defecto."],
    ], { y: 3.85, h: 2.9, colW: [3.3, 8.793], size: 12 });
    s.addNotes("La ranura keccak256(clave, posicion) es Keccak de la Sesión 2 otra vez: la ubicación de cada dato del mapping se calcula con un hash.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · el problema de recorrer", titulo: "Mapping más arreglo, y el bucle que nunca termina", ic: "alerta", tituloSize: 25 });
    D.codigo(s, `mapping(address => bool) public participo;
address[] private _participantes;

if (!participo[msg.sender]) {
    participo[msg.sender] = true;       // búsqueda rápida
    _participantes.push(msg.sender);    // para listar
}`, { x: M, y: 1.9, w: 6.6, h: 2.8, lang: "sol", size: 12 });
    D.parrafo(s, "El patrón habitual: el mapping responde «¿está?» en un paso, y el arreglo permite listar. Pero ese arreglo esconde una trampa.", { x: M + 6.9, y: 1.9, w: CW - 6.9, h: 1.5, size: 13.5 });
    D.definicion(s, "for (i = 0; i < _participantes.length; i++) { ... }", { x: M + 6.9, y: 3.55, w: CW - 6.9, h: 0.6, size: 11 });
    D.parrafo(s, "Cada vuelta cuesta gas. Con suficientes participantes, el bucle no cabe en un bloque y la función queda inutilizable para siempre.", { x: M + 6.9, y: 4.25, w: CW - 6.9, h: 0.95, size: 12.5, color: C.ocre });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Regla que no admite excepción", x: M, y: 5.0, w: CW, h: 1.72, texto: "Ninguna función que se ejecute en una transacción recorre un arreglo que un usuario pueda hacer crecer. Leer la lista desde fuera, con una llamada view, es gratis y seguro. Recorrerla dentro de una transacción es una denegación de servicio esperando a ocurrir.", size: 13 });
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
      "delete en un arreglo engaña: la longitud no cambia.",
      "«Intercambiar con el último y quitar» cuesta lo mismo sin importar el tamaño. Desplazar todos los elementos, no.",
      "Si el orden importa, casi siempre es mejor no borrar y marcar como inactivo.",
      "Arreglos fijos: más baratos y seguros cuando el tamaño se conoce de antemano.",
    ], { x: M + 7.5, y: 1.9, w: CW - 7.5, h: 4.3, size: 13, gap: 10 });
    D.parrafo(s, "En la literatura aparece como «swap and pop».", { y: 6.35, h: 0.4, size: 12, color: C.gris });
  }

  {
    const s = await D.lamina({ kicker: "A.4 · tipos compuestos", titulo: "struct y enum", ic: "capas", tituloSize: 31 });
    D.codigo(s, `enum Estado { Abierta, PorFinalizar, Finalizada }

struct Puja {
    address postor;
    uint96  monto;      // 96 + 160 bits = 256: una sola ranura
    uint64  momento;    // otra ranura
}

Puja[] public historial;
historial.push(
    Puja(msg.sender, uint96(msg.value), uint64(block.timestamp))
);

function estado() public view returns (Estado) { ... }`, { x: M, y: 1.9, w: 7.6, h: 4.5, lang: "sol", size: 11.5 });
    D.lista(s, [
      "Un enum se guarda como un entero pequeño: Abierta = 0, PorFinalizar = 1…",
      "Útil para máquinas de estado: prohíbe valores inválidos.",
      "Un struct no tiene métodos: solo agrupa datos.",
      "El orden de los campos decide cuántas ranuras ocupa (A.15).",
    ], { x: M + 7.9, y: 1.9, w: CW - 7.9, h: 4.5, size: 12.5, gap: 10 });
  }

  {
    const s = await D.lamina({ kicker: "A.5 · el error silencioso", titulo: "storage copia la referencia, memory copia el dato", ic: "bicho", tituloSize: 25 });
    D.dosColumnas(s,
      { et: "Bien · storage", texto: "Certificado storage c = _certificados[h];\nc.revocado = true;\n\nc apunta a la ranura real. El cambio queda guardado." },
      { et: "Mal · memory", linea: C.rojo, color: C.rojo, texto: "Certificado memory c = _certificados[h];\nc.revocado = true;\n\nc es una copia en memoria. El cambio se pierde al terminar la función. Y compila sin avisar." },
      { y: 1.9, h: 2.75, size: 13 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Por qué es tan peligroso", x: M, y: 4.9, w: CW, h: 1.8, texto: "No hay error ni advertencia. La transacción termina bien, emite su evento y cobra su gas. Solo una prueba que vuelva a leer el estado después descubre que no cambió nada. Es exactamente la clase de error que las pruebas de la Sesión 8 existen para atrapar.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.6 · reutilizar", titulo: "Herencia", ic: "jerarquia", tituloSize: 31 });
    D.codigo(s, `import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract Subasta is ISubasta, Ownable, Pausable {
    constructor(uint256 duracion, uint256 minima) Ownable(msg.sender) {
        ...
    }

    function pujar() external payable override whenNotPaused { ... }
}`, { x: M, y: 1.9, w: CW, h: 3.0, lang: "sol", size: 12 });
    D.tabla(s, ["palabra", "significa"], [
      ["is", "Hereda estado, funciones y modificadores. Varios padres, de más general a más específico."],
      ["virtual · override", "El padre permite que se reemplace una función; el hijo declara que la reemplaza."],
      ["Ownable(msg.sender)", "Los argumentos del constructor del padre se pasan en la declaración del constructor hijo."],
    ], { y: 5.1, h: 1.65, colW: [3.0, 9.093], size: 11.5 });
    s.addNotes("Mencionar que se hereda de OpenZeppelin en lugar de escribir Ownable a mano: código auditado y usado por miles de contratos. La Sesión 9 vuelve sobre esto.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · piezas para componer", titulo: "abstract, interface y library", ic: "rejilla", tituloSize: 28 });
    D.tabla(s, ["", "abstract contract", "interface", "library"], [
      ["Qué es", "Un contrato con funciones sin implementar.", "Solo firmas de funciones y eventos.", "Funciones reutilizables."],
      ["Tiene estado", "Sí.", "No.", "No (salvo constantes)."],
      ["Se despliega sola", "No: hay que heredarla.", "No.", "Solo si tiene funciones external."],
      ["Para qué sirve", "Plantillas con partes obligatorias.", "Llamar a un contrato ajeno sabiendo solo su forma.", "Aritmética, validaciones, utilidades."],
      ["En el laboratorio", "—", "ISubasta: la usan push y pull.", "Porcentajes, con using for."],
    ], { y: 1.9, h: 3.3, colW: [2.3, 3.3, 3.3, 3.193], size: 11.5 });
    D.codigo(s, `using Porcentajes for uint256;
mejorPuja.aplicarBps(INCREMENTO_MINIMO_BPS);   // en lugar de Porcentajes.aplicarBps(mejorPuja, 100)`, { x: M, y: 5.45, w: CW, h: 1.25, lang: "sol", size: 12 });
  }

  {
    const s = await D.lamina({ kicker: "A.8 · enviar ether", titulo: "transfer, send y call: cuál usar", ic: "moneda", tituloSize: 29 });
    D.tabla(s, ["forma", "gas que entrega al receptor", "si falla", "hoy"], [
      ["transfer", "2 300 fijo", "Revierte.", "Desaconsejada: cualquier receptor que haga algo al recibir puede quedarse sin gas."],
      ["send", "2 300 fijo", "Devuelve false, y es fácil ignorarlo.", "Desaconsejada por la misma razón, y más peligrosa."],
      ["call{value: x}(\"\")", "Todo el disponible", "Devuelve false.", "La recomendada, SIEMPRE comprobando el resultado y aplicando CEI."],
    ], { y: 1.9, h: 2.85, colW: [2.5, 2.6, 2.9, 4.093], size: 11.5 });
    D.codigo(s, `(bool ok, ) = payable(destino).call{value: monto}("");
if (!ok) revert EnvioFallido();`, { x: M, y: 4.95, w: CW, h: 0.9, lang: "sol", size: 12.5 });
    D.parrafo(s, "Por qué cambió la recomendación: en 2019 una actualización subió el costo de ciertas instrucciones y los 2 300 de gas dejaron de alcanzar para receptores legítimos. Entregar todo el gas es más compatible, pero abre la puerta a la reentrada: de ahí la necesidad de CEI (A.13).", { y: 6.0, h: 0.8, size: 12, color: C.ocre });
    s.addNotes("La actualización es Istanbul (EIP-1884). ConsenSys publicó en 2019 'Stop Using Solidity's transfer() Now'.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · recibir ether", titulo: "receive y fallback", ic: "red", tituloSize: 31 });
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
    D.codigo(s, `receive() external payable { ... }            // ether sin datos
fallback() external payable { ... }          // función que no existe`, { x: M, y: 5.55, w: CW, h: 1.15, lang: "sol", size: 12 });
    s.addNotes("El PostorHostil del laboratorio usa receive() para revertir: rechaza cualquier pago que le envíen.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · patrón · control de acceso", titulo: "Ownable, y lo que pasa si se pierde la clave", ic: "llave", tituloSize: 27 });
    D.parrafo(s, "Un solo dueño con permisos especiales. Es el patrón más usado y el más fácil de hacer bien si se hereda de OpenZeppelin en lugar de escribirse a mano.", { y: 1.9, h: 0.65, size: 14 });
    D.tabla(s, ["pieza de OpenZeppelin v5", "qué aporta"], [
      ["Ownable(msg.sender)", "El dueño se fija explícitamente en el constructor."],
      ["onlyOwner", "Modificador que revierte con OwnableUnauthorizedAccount."],
      ["transferOwnership", "Traspasa el control. Un error de tipeo en la dirección lo pierde para siempre."],
      ["Ownable2Step", "El nuevo dueño debe aceptar: evita traspasar a una dirección equivocada."],
      ["renounceOwnership", "Deja el contrato sin dueño. Irreversible: las funciones onlyOwner quedan bloqueadas."],
    ], { y: 2.7, h: 3.05, colW: [3.5, 8.593], size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta de la semana pasada", x: M, y: 5.84, w: CW, h: 0.94, texto: "Un dueño único es un punto único de falla. La respuesta madura es un multifirma: Sesión 15.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.11 · patrón · retiro", titulo: "El contrato nunca envía: cada quien retira", ic: "moneda", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Push · enviar", linea: C.rojo, color: C.rojo, texto: "Al superar una puja, el contrato devuelve el dinero al postor anterior en la misma transacción. Parece amable. Pero la puja nueva depende de que el pago al anterior salga bien, y ese anterior puede ser un contrato que lo rechace." },
      { et: "Pull · retirar", texto: "El contrato anota: «a Ana se le deben 2 ETH». Ana llama a retirar() cuando quiera. Si su retiro falla, solo falla el suyo: nadie más queda bloqueado." },
      { y: 1.9, h: 2.7, size: 13 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Ocurrió · King of the Ether Throne, 2016", x: M, y: 4.85, w: CW, h: 1.85, texto: "Un juego pagaba automáticamente al «rey» destronado. Los pagos a billeteras que eran contratos fallaban por falta de gas, el juego no lo comprobaba y el dinero quedaba atascado. Sus propios autores publicaron un análisis del fallo que se volvió referencia obligada del patrón de retiro.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.12 · el ataque del laboratorio", titulo: "El postor hostil", ic: "bicho", tituloSize: 31 });
    D.codigo(s, `contract PostorHostil {
    function pujarEn(ISubasta s) external payable {
        s.pujar{value: msg.value}();
    }
    receive() external payable {
        revert NoAceptoPagos();   // rechaza la devolución
    }
}`, { x: M, y: 1.9, w: 6.6, h: 3.0, lang: "sol", size: 12 });
    D.pasos(s, [
      ["PUJA", "El contrato hostil puja 1 ETH."],
      ["BETO OFRECE 50", "La subasta push intenta devolver 1 ETH al hostil."],
      ["RECHAZO", "receive() revierte, la devolución falla, y con ella la puja de Beto."],
      ["CONGELADA", "Nadie puede superar al hostil. Gana la subasta con 1 ETH."],
    ], { x: M + 6.9, y: 1.9, w: CW - 6.9, alto: 0.82, gap: 0.06, anchoEt: 1.9, size: 11.5 });
    D.enunciado(s, "El atacante no robó un centavo. Solo se negó a que le devolvieran su dinero, y eso bastó para quedarse con el lote.", { y: 5.48, h: 1.28, size: 17, line: C.rojo });
    s.addNotes("Las pruebas marcadas con ★ en test/s07 lo demuestran contra las dos versiones. Correrlas en vivo.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · patrón · el orden de las operaciones", titulo: "Checks → Effects → Interactions", ic: "escudo", tituloSize: 28 });
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
    s.addNotes("Esto es la reentrada: el robo de The DAO en 2016. La Sesión 9 la explota en vivo. Hoy basta con que el orden se vuelva un hábito.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · patrón · interruptor de emergencia", titulo: "Pausar, y qué no se pausa nunca", ic: "alerta", tituloSize: 27 });
    D.parrafo(s, "Pausable permite detener funciones cuando se descubre un problema. Es útil. Y es un poder que se puede abusar.", { y: 1.9, h: 0.6, size: 14.5 });
    D.dosColumnas(s,
      { et: "Qué conviene pausar", items: ["Recibir dinero nuevo: pujas, depósitos, compras.", "Funciones que agravan el daño si hay un fallo.", "Todo lo que el dueño no puede reparar sin detener."] },
      { et: "Qué NO se pausa", linea: C.rojo, color: C.rojo, items: ["Retirar lo propio. Si el dueño pudiera bloquear los retiros, el contrato sería una custodia disfrazada.", "Consultas: nunca dependen de la pausa."] },
      { y: 2.65, h: 2.55, size: 13 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La prueba que lo demuestra", x: M, y: 5.45, w: CW, h: 1.25, texto: "En el laboratorio hay una prueba que pausa la subasta, comprueba que nadie puede pujar y comprueba que Ana SÍ puede retirar. Si alguien pone whenNotPaused en retirar(), esa prueba falla.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.15 · gas · empaquetado", titulo: "El orden de las variables cuesta dinero", ic: "gas", tituloSize: 28 });
    D.codigo(s, `// 3 ranuras
struct Desordenado {
    uint64  a;   // ranura 0
    uint256 b;   // ranura 1: no cabe con a
    uint64  c;   // ranura 2
}`, { x: M, y: 1.9, w: CW / 2 - 0.15, h: 2.55, lang: "sol", size: 12, titulo: "desordenado" });
    D.codigo(s, `// 2 ranuras
struct Ordenado {
    uint64  a;   // ranura 0
    uint64  c;   // ranura 0: caben juntos
    uint256 b;   // ranura 1
}`, { x: M + CW / 2 + 0.15, y: 1.9, w: CW / 2 - 0.15, h: 2.55, lang: "sol", size: 12, titulo: "ordenado" });
    D.cifra(s, "88 341", "gas para guardar el struct desordenado", { x: M, y: 4.7, w: 3.8, h: 1.6, color: C.rojo, size: 30 });
    D.cifra(s, "66 279", "gas para guardar los mismos datos, ordenados", { x: M + 4.1, y: 4.7, w: 3.8, h: 1.6, color: C.verde, size: 30 });
    D.cifra(s, "−22 062", "una escritura nueva menos, medida en test/s07", { x: M + 8.2, y: 4.7, w: CW - 8.2, h: 1.6, size: 30 });
    D.parrafo(s, "Regla: agrupar los tipos pequeños juntos. Y constant e immutable no ocupan ranura: se incrustan en el código.", { y: 6.42, h: 0.4, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.16 · el costo de la seguridad", titulo: "Push frente a pull, medido con honestidad", ic: "balanza", tituloSize: 27 });
    D.tabla(s, ["", "push", "pull"], [
      ["Segunda puja", "42 280 gas", "55 350 gas"],
      ["Retiro posterior", "—", "29 977 gas"],
      ["Total para el postor superado", "incluido en la puja ajena", "una transacción más, pagada por él"],
      ["Postor hostil", "CONGELA LA SUBASTA", "solo se perjudica a sí mismo"],
    ], { y: 1.9, h: 2.75, colW: [3.9, 4.1, 4.093], size: 12.5 });
    D.parrafo(s, "Medido con dos contratos idénticos salvo en el patrón (SubastaPush y SubastaPullMinima). Comparar con Subasta.sol completa no sería justo: esa además registra participantes y tiene pausa.", { y: 4.85, h: 0.65, size: 12.5, color: C.gris });
    D.enunciado(s, "El patrón seguro cuesta casi el doble en total. Se paga con gusto: la alternativa es que un desconocido decida quién gana.", { y: 5.6, h: 1.12, size: 16, line: C.naranja });
    s.addNotes("Es importante no vender el patrón de retiro como 'más eficiente': no lo es. Es más seguro, y eso se paga.");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · lo que hay que llevarse del bloque A", titulo: "Seis reglas que cuestan dinero ignorar", ic: "lista", tituloSize: 27 });
    const ideas = [
      "Nunca recorrer, dentro de una transacción, un arreglo que un usuario pueda hacer crecer.",
      "storage para modificar lo guardado; memory para una copia que se descarta.",
      "Enviar ether con call, comprobar el resultado y aplicar CEI.",
      "El contrato acredita; cada quien retira lo suyo.",
      "Pausar lo que agrava el daño; nunca bloquear los retiros ajenos.",
      "La seguridad cuesta gas. Se mide, se explica y se paga.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14.5, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Laboratorio 07 · subasta", sub: "Completar una subasta con patrón de retiro, demostrar el ataque contra la versión ingenua y medir cuánto cuesta defenderse.", minutos: "APROXIMADAMENTE 80 MINUTOS · EN PAREJAS", ic: "martillo" });

  {
    const s = await D.lamina({ kicker: "B.1 · el mapa del contrato", titulo: "Dónde está cada patrón", ic: "jerarquia", tituloSize: 30 });
    D.tabla(s, ["archivo", "qué es", "patrón que ilustra"], [
      ["Subasta.sol", "La subasta completa. El andamiaje tiene 6 TODO.", "Ownable, Pausable, retiro, CEI, enum, immutable"],
      ["ISubasta.sol", "La interfaz común.", "interface y eventos compartidos"],
      ["Porcentajes.sol", "Porcentajes en puntos básicos.", "library y using for"],
      ["SubastaPush.sol", "La versión ingenua. No se modifica.", "antipatrón push"],
      ["SubastaPullMinima.sol", "Igual a la push salvo el patrón.", "comparación justa de gas"],
      ["PostorHostil.sol", "El atacante.", "receive que revierte"],
      ["Empaquetado.sol", "Dos structs con los mismos datos.", "empaquetado de storage"],
    ], { y: 1.9, h: 4.75, colW: [3.0, 4.6, 4.493], size: 11.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · 45 minutos", titulo: "Completar la subasta guiados por las pruebas", ic: "terminal", tituloSize: 25 });
    D.codigo(s, `cp andamiaje/s07/Subasta.sol contracts/s07/Subasta.sol
npx hardhat test test/s07/Subasta.test.js      # 16 fallan al empezar`, { x: M, y: 1.9, w: CW, h: 0.95, lang: "js", size: 12 });
    D.tabla(s, ["TODO", "qué hacer", "pruebas que lo confirman"], [
      ["1 · estado", "Calcular el enum según tiempo y bandera.", "«recorre los tres estados»"],
      ["2 · minimoSiguiente", "Mínimo o 1 % por encima de la mejor puja.", "«exige superar la puja anterior»"],
      ["3 y 4 · pujar", "Checks; acreditar al superado; registrar participante.", "todo el grupo «pujar» y el ★ pull"],
      ["5 · retirar", "CEI en el orden exacto.", "grupo «retirar» y la prueba de pausa"],
      ["6 · finalizar", "Validar tiempo, marcar, acreditar al dueño.", "grupo «finalizar y estado»"],
    ], { y: 3.05, h: 3.1, colW: [2.6, 5.0, 4.493], size: 11.5 });
    D.parrafo(s, "Para volver a empezar: copiar otra vez el andamiaje. Para ver la solución: git checkout contracts/s07/Subasta.sol.", { y: 6.3, h: 0.45, size: 12.5, color: C.gris });
  }

  {
    const s = await D.lamina({ kicker: "B.3 · 20 minutos", titulo: "Ver el ataque y medir la defensa", ic: "bicho", tituloSize: 29 });
    D.codigo(s, `npx hardhat test test/s07/Subasta.test.js --grep "postor hostil"
npx hardhat test test/s07/Subasta.test.js --grep "empaquetado"`, { x: M, y: 1.9, w: CW, h: 0.95, lang: "js", size: 12 });
    D.parrafo(s, "Preguntas que responde el informe:", { y: 3.05, h: 0.4, size: 14, bold: true, color: C.tinta });
    D.lista(s, [
      "¿Por qué la puja de 50 ETH de Beto revierte en la subasta push? Expliquen la cadena de llamadas.",
      "¿Por qué el mismo contrato hostil no bloquea la subasta pull? ¿Quién pierde en ese caso?",
      "Según las cifras de gas, ¿cuánto más cuesta el patrón pull en total? ¿Quién paga esa diferencia?",
      "¿Cuántas ranuras ahorra el struct ordenado, y cómo lo deducen de la diferencia de gas?",
      "Si alguien pone whenNotPaused en retirar(), ¿qué prueba falla y por qué esa prueba existe?",
    ], { y: 3.5, h: 3.2, size: 13, gap: 8, numerada: true });
  }

  {
    const s = await D.lamina({ kicker: "B.4 · 15 minutos", titulo: "Desplegar y dejar evidencia", ic: "cohete", tituloSize: 29 });
    D.pasos(s, [
      ["REMIX", "Crear los archivos de contracts/s07 en Remix. Los import de OpenZeppelin se resuelven solos."],
      ["DESPLEGAR", "Desplegar Subasta en Sepolia con duración de 600 segundos y puja mínima de 1 000 000 000 000 000 wei (0,001 ETH)."],
      ["JUGAR", "Pujar desde dos cuentas de prueba. Esperar a que venza. Finalizar. Retirar."],
      ["VERIFICAR", "Verificar el código en el explorador: la Sesión 8 lo automatiza con un script."],
    ], { y: 1.9, alto: 0.84, gap: 0.12, anchoEt: 2.1, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Evidencia", x: M, y: 5.8, w: CW, h: 0.96, texto: "Dirección del contrato, hashes de dos pujas, la finalización y un retiro, más el informe de decisiones.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.5 · errores frecuentes", titulo: "Lo que suele salir mal", ic: "bicho", tituloSize: 30 });
    D.tabla(s, ["síntoma", "causa"], [
      ["La prueba de retiro pasa pero el saldo no cambia", "Pusieron el pendiente en cero DESPUÉS del call, o no lo pusieron."],
      ["«acumula si es superado varias veces» falla", "Usaron = en lugar de += al acreditar al superado."],
      ["«EnforcedPause» al retirar", "Pusieron whenNotPaused en retirar(): exactamente lo que no se debe."],
      ["El dueño no puede retirar tras finalizar", "No acreditaron mejorPuja al owner() en finalizar()."],
      ["La subasta no acepta la primera puja", "minimoSiguiente() aplica el 1 % aunque no haya postor."],
      ["Remix no encuentra ISubasta.sol", "Los tres archivos deben estar en la misma carpeta."],
    ], { y: 1.9, h: 4.4, colW: [4.7, 7.393], size: 12 });
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "Devolución del anteproyecto", sub: "Cada equipo recibe su decisión: aprobado, aprobado con recorte, o devuelto. Y empieza a construir.", minutos: "APROXIMADAMENTE 30 MINUTOS", ic: "bandera" });

  {
    const s = await D.lamina({ kicker: "C.1 · qué sigue para cada equipo", titulo: "Del papel al primer contrato", ic: "flecha", tituloSize: 29 });
    D.tabla(s, ["decisión recibida", "hasta la Sesión 8"], [
      ["Aprobado", "Escribir el contrato principal con al menos dos patrones de hoy y llevarlo a la estructura del repositorio."],
      ["Aprobado con recorte", "Aceptar o argumentar el recorte en 48 horas. Después, igual que aprobado."],
      ["Devuelto", "Nueva versión del anteproyecto para la Sesión 8. Se revisa al inicio de la clase."],
    ], { y: 1.9, h: 2.4, colW: [3.2, 8.893], size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Tres preguntas para el diseño del contrato del proyecto", x: M, y: 4.55, w: CW, h: 2.15, texto: "1. ¿Mi contrato envía dinero? Si sí, ¿por qué no usa el patrón de retiro?\n2. ¿Hay algún arreglo que un usuario pueda hacer crecer y que yo recorra en una transacción?\n3. ¿Qué funciones pausaría en una emergencia, y cuáles nunca?", size: 13.5 });
  }

  await D.preguntaSemana({
    pregunta: "El postor hostil no robó nada y aun así ganó. ¿Dónde más —en el curso o en el mundo— alguien bloquea a todos solo con negarse a cooperar?",
    trabajo: [
      "Entregar el informe del laboratorio 07 con las cinco respuestas y la evidencia en Sepolia.",
      "Refactorizar el contrato de certificados de la S6 aplicando dos patrones de hoy.",
      "Instalar Node.js 22 en el computador propio: la Sesión 8 trabaja todo en local.",
      "Equipos aprobados: primer borrador del contrato principal del proyecto.",
    ],
  });

  await D.cierre({
    frase: "Un contrato que envía dinero depende de que el otro quiera recibirlo.",
    sub: "Hoy vieron que la seguridad tiene forma de orden de operaciones y de patrones concretos, y que cuesta gas. La próxima sesión salen de Remix y aprenden a demostrar, con pruebas automáticas, que el contrato hace lo que dice.",
    proxima: "Sesión 8 · Hardhat, pruebas automatizadas y despliegue profesional",
  });

  return D.guardar(path.join(__dirname, "Sesion-07-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
