/* =====================================================================
   Clase en vivo · Un contrato, paso a paso
   Deck de PROYECCIÓN: acompaña a Remix, no lo reemplaza.

   Ritmo de cada paso:  idea → código → romper y probar → pregunta → respuesta
   La respuesta SIEMPRE va en la lámina siguiente a la pregunta.
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({
    pie: "UN CONTRATO, PASO A PASO · SOLIDITY EN VIVO",
    titulo: "Un contrato, paso a paso",
  });
  const { C, F, M, CW } = D;

  /* ---------- ayudantes locales del ritmo de la clase ---------- */

  // Lámina de código: lo que se está escribiendo en Remix, en grande.
  async function codigoDe({ kicker, titulo, codigo, nota, size = 12.5, y = 1.85, h = 4.1 }) {
    const s = await D.lamina({ kicker, titulo, ic: "codigo", tituloSize: 29 });
    D.codigo(s, codigo, { x: M, y, w: CW, h, size, lang: "sol" });
    if (nota) D.parrafo(s, nota, { y: y + h + 0.18, h: 0.75, size: 13.5, color: C.ocre });
    return s;
  }

  // Lámina "ahora rómpanlo": la secuencia de clics en Remix.
  async function probar({ kicker, titulo, items, cierre, alto = 0.72 }) {
    const s = await D.lamina({ kicker, titulo, ic: "taller", tituloSize: 29 });
    D.pasos(s, items, { y: 1.95, alto, gap: 0.1, anchoEt: 2.5, size: 12.5 });
    if (cierre) {
      const y = 1.95 + items.length * (alto + 0.1) + 0.15;
      D.parrafo(s, cierre, { y, h: 0.8, size: 13.5, color: C.ocre });
    }
    return s;
  }

  // Pregunta abierta, a pantalla completa. La respuesta va en la lámina siguiente.
  async function pregunta({ kicker, texto, pista, notas }) {
    const s = await D.lamina({ kicker, titulo: "Pregunta", ic: "pregunta", tituloSize: 30 });
    D.enunciado(s, texto, { y: 2.35, h: 2.3, size: 22, line: C.naranja });
    if (pista) D.parrafo(s, pista, { y: 4.95, h: 0.8, size: 14, color: C.gris, align: "center" });
    if (notas) s.addNotes(notas);
    return s;
  }

  // Respuesta: lo que se recoge de ellos, y el puente al paso siguiente.
  async function respuesta({ kicker, titulo, texto, columnas, puente, notas }) {
    const s = await D.lamina({ kicker, titulo, ic: "diana", tituloSize: 29 });
    D.enunciado(s, texto, { y: 1.9, h: 1.5, size: 18, line: C.verde });
    if (columnas) D.dosColumnas(s, columnas[0], columnas[1], { y: 3.6, h: 2.0, size: 12.5 });
    if (puente) {
      D.caja(s, { x: M, y: 5.8, w: CW, h: 0.85, fill: C.superfAlt, line: C.violeta, sombraColor: C.violetaOs });
      D.etiqueta(s, "Y ESO ES LO QUE ARREGLA EL PASO SIGUIENTE", { x: M + 0.3, y: 5.95, w: 5.2, color: C.violetaOs });
      D.parrafo(s, puente, { x: M + 0.3, y: 6.2, w: CW - 0.6, h: 0.5, size: 13 });
    }
    if (notas) s.addNotes(notas);
    return s;
  }

  /* ================================================================
     APERTURA
     ================================================================ */

  await D.portada({
    kicker: "SOLIDITY EN VIVO · SE ESCRIBE EN CLASE, NO SE LEE",
    titulo: "UN CONTRATO,\nPASO A PASO",
    sub: "Seis versiones del mismo contrato. Cada una se rompe delante de ustedes, y la función siguiente existe para arreglar eso.",
    palabra: "CONSTRUIR",
    ic: "martillo",
    notas: "Abrir diciendo que hoy se trabaja al revés: del problema al código. Nada de lista de palabras del lenguaje; cada cosa aparece cuando hace falta. Remix ya abierto, compilador en 0.8.34, Value en 0.",
  });

  {
    const s = await D.lamina({ kicker: "El encargo", titulo: "El laboratorio presta equipos", ic: "taller", tituloSize: 31 });
    D.parrafo(s, "Proyectores, kits de Arduino, cámaras. El registro vive en una hoja de papel pegada a la puerta, y esa hoja no sabe responder:", { y: 1.9, h: 0.72, size: 15 });
    D.pasos(s, [
      ["¿ESTÁ LIBRE?", "Alguien necesita el proyector ahora. ¿Lo tiene alguien, o está en el estante?"],
      ["¿QUIÉN LO TIENE?", "Aparece en la hoja un nombre escrito a mano, de hace tres semanas, sin apellido."],
      ["¿DESDE CUÁNDO?", "Nadie anotó la fecha de entrega, así que nadie está formalmente en mora."],
      ["¿Y EL DEPÓSITO?", "Lo guarda quien esté en el mostrador ese día. Devolverlo depende de que esa persona se acuerde."],
    ], { y: 2.75, alto: 0.8, gap: 0.12, anchoEt: 2.9, size: 13 });
    D.parrafo(s, "Hoy escribimos, entre todos, un programa que responda esas cuatro preguntas y que haga cumplir sus propias reglas.", { y: 6.2, h: 0.6, size: 14.5, color: C.ocre });
    s.addNotes("Preguntarles si alguno ha perdido un equipo prestado o se ha quedado sin el depósito. Dos o tres respuestas bastan: el objetivo es que el problema sea de ellos, no un ejemplo de libro.");
  }

  {
    const s = await D.lamina({ kicker: "A dónde vamos a llegar", titulo: "Esto corre al final de la clase", ic: "diana", tituloSize: 28 });
    D.tabla(s, ["lo que alguien pregunta", "la función que lo responde"], [
      ["¿Está libre el equipo 3?", "estaDisponible(3) · consulta, no cuesta nada"],
      ["¿Quién lo tiene?", "quienLoTiene(3) · devuelve la dirección de quien firmó"],
      ["¿Está en mora, y de cuánto?", "estaVencido(3) y diasDeMora(3)"],
      ["Quiero llevármelo cinco días", "prestar(3, 5) · dejando el depósito exacto"],
      ["Lo traigo de vuelta", "devolver(3) · a tiempo recupera el depósito; tarde, no"],
      ["Quiero mi plata", "retirar() · cada quien reclama lo suyo"],
    ], { y: 1.95, h: 3.4, colW: [5.3, 6.793], size: 13 });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "Y algo igual de importante: lo que NO va a hacer",
      x: M, y: 5.55, w: CW, h: 1.2,
      texto: "No va a saber si el equipo volvió roto, ni si volvió completo, ni si quien lo devolvió es la misma persona que se lo llevó. Un contrato solo sabe lo que alguien le escribe. Eso lo vamos a decir en voz alta varias veces hoy.",
      size: 13,
    });
    s.addNotes("Esta lámina es el contrato de la clase: al final, todo esto tiene que funcionar en pantalla. Si al cierre algo de la tabla no corre, se dice por qué.");
  }

  {
    const s = await D.lamina({ kicker: "Cómo vamos a trabajar", titulo: "Seis versiones, seis roturas", ic: "bifurca", tituloSize: 30 });
    D.parrafo(s, "No vamos a escribir el contrato terminado. Vamos a escribir una versión simple, romperla en pantalla, y dejar que el problema pida la función siguiente.", { y: 1.88, h: 0.72, size: 15 });
    D.tabla(s, ["paso", "qué le agregamos", "qué problema arregla"], [
      ["1", "Estado y msg.sender", "Línea base: el contrato recuerda quién tiene el equipo."],
      ["2", "Errores y una guardia", "Cualquiera se llevaba un equipo que ya estaba prestado."],
      ["3", "struct y mapping", "Solo existía UN equipo, y el laboratorio tiene cuarenta."],
      ["4", "Constructor y modificador", "Cualquiera podía registrar inventario inventado."],
      ["5", "Tiempo y plazo", "Nadie devolvía nunca y no había forma de saber quién estaba en mora."],
      ["6", "Depósito y retiro", "Estar en mora no costaba nada."],
    ], { y: 2.75, h: 3.3, colW: [0.9, 3.6, 7.593], size: 12.5 });
    D.parrafo(s, "Cuando algo no cuadre, interrumpan. Una pregunta a tiempo vale más que la lámina siguiente.", { y: 6.25, h: 0.55, size: 13.5, color: C.ocre });
    s.addNotes("Dejar esta tabla a la vista mientras se despliega el paso 1. Es el mapa de la clase y se retoma al cierre.");
  }

  /* ================================================================
     PASO 1
     ================================================================ */

  await D.divisor({
    letra: "1", titulo: "El contrato recuerda",
    sub: "Dos variables y dos funciones de tres palabras. Con eso ya aparece lo esencial de Solidity.",
    minutos: "ESTADO · msg.sender", ic: "bloques",
  });

  await codigoDe({
    kicker: "Paso 1 · lo que estamos escribiendo",
    titulo: "Quince líneas, y ya tenemos un contrato",
    codigo: `contract PrestamoEquipos {

    string  public nombreEquipo = "Proyector Epson";
    address public prestadoA;

    function prestar() public {
        prestadoA = msg.sender;
    }

    function devolver() public {
        prestadoA = address(0);
    }
}`,
    nota: "Las variables de estado viven en la cadena: siguen ahí mañana. Y la palabra public regala las funciones de lectura, no hay que escribirlas.",
  });

  {
    const s = await D.lamina({ kicker: "Paso 1 · la idea que importa", titulo: "Nadie dice quién es: lo demuestra firmando", ic: "llave", tituloSize: 27 });
    D.enunciado(s, "prestar() no recibe quién la llama. msg.sender es la dirección que firmó la transacción, y no se puede falsificar sin la llave privada.", { y: 1.95, h: 1.65, size: 19, line: C.naranja });
    D.dosColumnas(s,
      { et: "En cualquier otro programa", texto: "Quién eres es un campo del formulario, o una sesión que el servidor te asignó. Alguien puede mentir, y hay que comprobarlo contra una base de datos." },
      { et: "Aquí", texto: "Quién eres viene de la firma de la transacción. El contrato no pregunta: recibe una dirección que solo pudo producir quien tiene la llave." },
      { y: 3.85, h: 2.0, size: 13 });
    D.parrafo(s, "address(0) es la dirección cero, el «vacío» de Ethereum. La usamos para decir «no lo tiene nadie», y va a volver a aparecer todo el día.", { y: 6.05, h: 0.6, size: 13.5, color: C.ocre });
    s.addNotes("Aquí se detiene un momento: es el concepto más valioso del paso 1. Si alguien pregunta por qué no se puede falsificar, remitir a la sesión 3 (firmas) sin entrar en detalle.");
  }

  await probar({
    kicker: "Paso 1 · ahora en Remix",
    titulo: "Compilar, desplegar y romperlo",
    items: [
      ["DESPLEGAR", "Compilar hasta la marca verde y oprimir Deploy, con Value en 0. El contrato aparece en Deployed Contracts."],
      ["LEER prestadoA", "Botón azul: es una consulta y no cuesta nada. Devuelve 0x0000…0000. Nadie lo tiene."],
      ["PRESTAR · CUENTA 1", "Botón naranja: es una transacción. Volver a leer prestadoA: ahora es la cuenta 1. Comparar los primeros y últimos cuatro caracteres con el selector Account."],
      ["CAMBIAR A LA CUENTA 2", "Arriba, en Account. Oprimir prestar otra vez."],
      ["LEER prestadoA", "Ahora dice cuenta 2. La transacción salió bien. Verde. Sin un solo error."],
    ],
    cierre: "La cuenta 1 nunca devolvió el proyector. ¿Dónde está el proyector?",
  });

  await pregunta({
    kicker: "Paso 1",
    texto: "El código no tiene un solo error de sintaxis, y acaba de hacer algo imposible en la vida real. ¿Dónde está el error, entonces?",
    pista: "Pista: miren otra vez la última transacción. Salió verde.",
    notas: "Silencio de tres segundos antes de recibir respuestas. Si nadie habla, reformular: «¿qué tendría que haber pasado cuando la cuenta 2 apretó el botón?». La palabra que se busca es: que se cayera.",
  });

  await respuesta({
    kicker: "Paso 1 · respuesta",
    titulo: "La rotura no es roja",
    texto: "No falta corregir un error: falta escribir una regla. El contrato nunca comprueba si el equipo ya está prestado, así que hizo exactamente lo que le pedimos.",
    columnas: [
      { et: "Lo que uno espera de un error", texto: "Algo rojo, una excepción, un mensaje. Eso es lo que nos enseñaron a buscar, y aquí no aparece." },
      { et: "Lo que de verdad pasa", texto: "Todo sale bien y el resultado es imposible. La mayoría de los robos en contratos son código funcionando como está escrito." },
    ],
    puente: "El contrato tiene que poder decir que NO. Eso es un require, o mejor, un error con nombre propio.",
    notas: "Si alguien dice «que lo valide la aplicación»: es la respuesta equivocada más útil del día. Guardarla y contestar que cualquiera puede llamar al contrato sin pasar por la aplicación, como estamos haciendo nosotros desde Remix.",
  });

  /* ================================================================
     PASO 2
     ================================================================ */

  await D.divisor({
    letra: "2", titulo: "El contrato dice NO",
    sub: "Un contrato que no sabe negarse no sirve para nada. Y al negarse, conviene que diga por qué.",
    minutos: "ERRORES PROPIOS · view", ic: "escudo",
  });

  await codigoDe({
    kicker: "Paso 2 · lo que agregamos",
    titulo: "Dos errores con nombre y dos guardias",
    codigo: `error EquipoOcupado(address loTiene);
error NoLoTienesTu();

function estaDisponible() public view returns (bool) {
    return prestadoA == address(0);
}

function prestar() public {
    if (!estaDisponible()) revert EquipoOcupado(prestadoA);
    prestadoA = msg.sender;
}

function devolver() public {
    if (prestadoA != msg.sender) revert NoLoTienesTu();
    prestadoA = address(0);
}`,
    nota: "view = leo el estado pero no lo cambio: desde fuera no cuesta gas. Y el error lleva datos: no dice «ocupado», dice quién lo tiene.",
    size: 12,
    h: 4.0,
  });

  await probar({
    kicker: "Paso 2 · ahora en Remix",
    titulo: "Que se caiga, y que diga por qué",
    items: [
      ["VOLVER A DESPLEGAR", "Cada Deploy crea un contrato NUEVO y vacío. El anterior sigue ahí con su estado: usamos siempre el último de la lista."],
      ["CUENTA 1 · PRESTAR", "Pasa. estaDisponible() ahora devuelve false."],
      ["CUENTA 2 · PRESTAR", "REVIERTE. En la terminal, abrir la flecha: el error trae la dirección de la cuenta 1 adentro."],
      ["CUENTA 2 · DEVOLVER", "REVIERTE con NoLoTienesTu. Nadie devuelve lo que no tiene."],
      ["CUENTA 1 · DEVOLVER", "Pasa. Y ahora sí, la cuenta 2 puede prestarlo."],
    ],
    cierre: "Validar cuesta gas: prestar pasó de unas 24 400 a unas 26 600 unidades. Negarse no es gratis.",
  });

  await pregunta({
    kicker: "Paso 2",
    texto: "El laboratorio tiene cuarenta equipos. ¿Desplegamos cuarenta contratos?",
    pista: "Piensen en qué significaría eso el día que haya que cambiar una regla.",
    notas: "Alguien va a decir que sí, porque es lo que el código sugiere. Dejar que lo digan y luego contar el costo: cuarenta despliegues, cuarenta direcciones, y una corrección de regla multiplicada por cuarenta.",
  });

  await respuesta({
    kicker: "Paso 2 · respuesta",
    titulo: "Un contrato, muchos equipos",
    texto: "No. Hace falta una tabla adentro del contrato: un identificador por equipo, y los datos de cada uno agrupados.",
    columnas: [
      { et: "struct", texto: "Un tipo propio que agrupa datos que van juntos: el nombre del equipo, quién lo tiene, si existe." },
      { et: "mapping", texto: "Una tabla: dele un identificador y le devuelve el equipo. Con tres rarezas que vamos a ver de frente." },
    ],
    puente: "Y apenas haya inventario, aparece la pregunta de quién tiene derecho a agregarle cosas.",
  });

  /* ================================================================
     PASO 3
     ================================================================ */

  await D.divisor({
    letra: "3", titulo: "Muchos equipos, un contrato",
    sub: "struct para agrupar, mapping para guardar. Y una rareza del mapping que engaña a todo el mundo la primera vez.",
    minutos: "struct · mapping · calldata", ic: "rejilla",
  });

  await codigoDe({
    kicker: "Paso 3 · lo que agregamos",
    titulo: "Una tabla de equipos",
    codigo: `struct Equipo {
    string  nombre;
    address prestadoA;
    bool    existe;        // ¿por qué hace falta esto?
}

mapping(uint256 id => Equipo) public equipos;
uint256 public totalEquipos;

function registrar(string calldata nombre) public returns (uint256 id) {
    if (bytes(nombre).length == 0) revert NombreVacio();
    totalEquipos++;        // el primer equipo es el 1, no el 0
    id = totalEquipos;
    equipos[id] = Equipo({nombre: nombre, prestadoA: address(0), existe: true});
}`,
    nota: "calldata: el texto se lee directo de la transacción, sin copiarlo. Es lo más barato para un parámetro que no se modifica.",
    size: 11.5,
    h: 4.0,
  });

  {
    const s = await D.lamina({ kicker: "Paso 3 · la rareza", titulo: "Tres cosas del mapping que sorprenden", ic: "rombo", tituloSize: 29 });
    D.pasos(s, [
      ["NO SE RECORRE", "No existe «dame todos los equipos». Por eso llevamos totalEquipos a mano. Si hace falta la lista, se paga por mantenerla."],
      ["TODA CLAVE EXISTE", "Preguntar por el equipo 99, que nadie registró, no da error: devuelve una estructura con todo en cero."],
      ["LAS CLAVES SE NOMBRAN", "mapping(uint256 id => Equipo) se lee mejor que mapping(uint256 => Equipo). Es solo documentación, y vale la pena."],
    ], { y: 2.1, alto: 0.95, gap: 0.14, anchoEt: 3.0, size: 13 });
    D.parrafo(s, "La segunda es la peligrosa, y es la que vamos a provocar ahora mismo en pantalla.", { y: 5.6, h: 0.6, size: 14, color: C.ocre });
    s.addNotes("No explicar todavía para qué sirve el campo `existe`: eso es la pregunta de este paso. Aquí solo se siembra.");
  }

  await probar({
    kicker: "Paso 3 · ahora en Remix",
    titulo: "Dos equipos y una consulta tramposa",
    items: [
      ["REGISTRAR DOS", "registrar(\"Proyector Epson\") y registrar(\"Kit Arduino\"). Leer totalEquipos: 2. Leer equipos(1) y equipos(2)."],
      ["PRESTAR EN PARALELO", "La cuenta 1 presta el equipo 1; la cuenta 2 presta el equipo 2. Conviven sin estorbarse."],
      ["PREGUNTAR POR EL 99", "estaDisponible(99). El equipo 99 no existe. Miren bien qué contesta."],
    ],
    cierre: "Y después: que la cuenta 3, un estudiante cualquiera, llame a registrar(\"Portátil que no existe\"). Funciona.",
    alto: 0.95,
  });

  await pregunta({
    kicker: "Paso 3",
    texto: "¿Qué debería contestar estaDisponible(99) si el equipo 99 nunca se registró?",
    pista: "Lo intuitivo es «que no está disponible». Piénsenlo otra vez.",
    notas: "Casi todos contestan false. Es la respuesta cómoda y es la equivocada: sin el campo `existe`, el mapping devuelve ceros y prestadoA sería address(0), o sea «disponible». El contrato diría que sí, y estaría mintiendo sobre un equipo que no existe.",
  });

  await respuesta({
    kicker: "Paso 3 · respuesta",
    titulo: "Debe reventar, no contestar",
    texto: "Sin el campo existe, el mapping devuelve todo en cero y el contrato respondería «sí, disponible» sobre un equipo que nunca existió. Una mentira cómoda es peor que un error.",
    columnas: [
      { et: "Contestar false", texto: "Suena razonable y es falso: mezcla «no está disponible» con «no existe». Quien use el dato no puede distinguirlos." },
      { et: "Revertir con EquipoNoRegistrado(99)", texto: "Dice exactamente qué pasó, y quien llama puede reaccionar distinto a cada caso." },
    ],
    puente: "Pero además acabamos de ver que cualquiera puede registrar inventario. Falta decir quién manda aquí.",
  });

  /* ================================================================
     PASO 4
     ================================================================ */

  await D.divisor({
    letra: "4", titulo: "Quién manda aquí",
    sub: "El constructor corre una sola vez. Un modificador es una condición que se escribe una vez y se reutiliza.",
    minutos: "constructor · modifier", ic: "candado",
  });

  await codigoDe({
    kicker: "Paso 4 · lo que agregamos",
    titulo: "Un dueño, y una condición reutilizable",
    codigo: `address public encargado;

constructor() {
    encargado = msg.sender;      // corre UNA vez, al desplegar
}

modifier soloEncargado() {
    if (msg.sender != encargado) revert SoloElEncargado(msg.sender);
    _;                           // <- aquí va el cuerpo de la función
}

function registrar(string calldata nombre) public soloEncargado returns (uint256 id) { ... }

function recuperar(uint256 id) public soloEncargado { ... }`,
    nota: "recuperar() existe porque alguien se gradúa, pierde la billetera, o simplemente no devuelve. Sin esa función, un equipo quedaría prestado para siempre.",
    size: 11.5,
    h: 4.2,
  });

  await probar({
    kicker: "Paso 4 · ahora en Remix",
    titulo: "Quién puede y quién no",
    items: [
      ["DESPLEGAR CON LA CUENTA 1", "Leer encargado: es la cuenta 1. Quedó grabado en el constructor y no vuelve a correr."],
      ["CUENTA 2 · REGISTRAR", "REVIERTE con SoloElEncargado, y el error trae la dirección de quien lo intentó."],
      ["CUENTA 1 · REGISTRAR", "Pasa. El inventario solo crece si lo hace el encargado."],
      ["CUENTA 2 PRESTA · CUENTA 1 RECUPERA", "El encargado le quita el equipo a la cuenta 2 sin pedirle permiso."],
    ],
    cierre: "Ese último clic es el que importa hoy, y no es técnico.",
  });

  await pregunta({
    kicker: "Paso 4",
    texto: "Acabamos de darle a una sola dirección el poder de quitarle el equipo a cualquiera. ¿Está mal? ¿Y qué pasa el día que se pierda esa llave?",
    notas: "Dejar que discutan. Hay dos respuestas buenas y opuestas: «está mal porque es centralizado» y «está bien porque alguien tiene que administrar». Las dos sirven; lo que no sirve es no haberse dado cuenta.",
  });

  await respuesta({
    kicker: "Paso 4 · respuesta",
    titulo: "Tener dueño no es el problema",
    texto: "Todo contrato responde a la pregunta «¿quién manda aquí?». Lo grave no es tener un dueño: es no darse cuenta de que lo hay, o descubrirlo cuando ya es tarde.",
    columnas: [
      { et: "Lo que ganamos", texto: "Nadie inventa inventario, y hay quien responda cuando un equipo no vuelve. Un laboratorio sin administrador no funciona." },
      { et: "Lo que cuesta", texto: "Si esa llave se pierde, nadie registra nunca más. Si se la roban, el inventario es del ladrón. Y está escrito a la vista, que ya es más de lo que ofrecen muchas plataformas." },
    ],
    puente: "Falta algo obvio: nadie dijo hasta cuándo. Un préstamo sin fecha no es un préstamo.",
    notas: "Mencionar de pasada que en la sesión siguiente esto se reemplaza por Ownable de OpenZeppelin, que es este mismo código ya auditado y con transferencia de propiedad.",
  });

  /* ================================================================
     PASO 5
     ================================================================ */

  await D.divisor({
    letra: "5", titulo: "Hasta cuándo",
    sub: "El reloj del bloque, el plazo, la mora. Y dos cosas de Solidity que descolocan a todo el mundo.",
    minutos: "block.timestamp · división entera", ic: "reloj",
  });

  await codigoDe({
    kicker: "Paso 5 · lo que agregamos",
    titulo: "Un plazo, y la cuenta de la mora",
    codigo: `uint64 public constant PLAZO_MAXIMO = 14 days;

function prestar(uint256 id, uint64 dias) public {
    ...
    equipos[id].vence = uint64(block.timestamp) + dias * 1 days;
}

function estaVencido(uint256 id) public view returns (bool) {
    Equipo memory e = equipos[id];
    return e.prestadoA != address(0) && block.timestamp > e.vence;
}

function diasDeMora(uint256 id) public view returns (uint64) {
    if (!estaVencido(id)) return 0;
    return (uint64(block.timestamp) - equipos[id].vence) / 1 days;
}`,
    nota: "14 days no es magia: Solidity lo convierte a 1 209 600 segundos. Y el tiempo en la cadena se mide en segundos desde 1970, como en casi todo el software.",
    size: 11.5,
    h: 4.3,
  });

  {
    const s = await D.lamina({ kicker: "Paso 5 · dos cosas que descolocan", titulo: "El reloj miente un poco, y no hay decimales", ic: "alerta", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "block.timestamp es aproximado", texto: "Lo pone quien produce el bloque y lo puede mover unos segundos. Para «catorce días» da igual. Para sortear algo, JAMÁS: es una de las formas clásicas de hacer trampa, y vuelve en la sesión de seguridad." },
      { et: "En Solidity no hay decimales", texto: "La división entera trunca: 1,9 días de mora se cuentan como 1. No es un redondeo mal hecho; es que el tipo no tiene parte decimal. Lo mismo pasa con el dinero, y por eso todo se mide en wei." },
      { y: 2.0, h: 2.35, size: 13.5 });
    await D.ficha(s, {
      tipo: "profundidad", etiqueta: "De paso, una decisión de diseño que se ve aquí",
      x: M, y: 4.6, w: CW, h: 1.35,
      texto: "vence se declaró uint64 y no uint256. Junto a una dirección (20 bytes) y un bool, caben en la misma ranura de 32 bytes del almacenamiento. Agrupar bien ahorra una escritura entera, y escribir en storage es lo más caro que hace un contrato.",
      size: 13,
    });
    s.addNotes("Si alguien pregunta por qué no usar una fecha legible: porque un uint64 cuesta menos y la conversión a fecha es trabajo de la interfaz, no de la cadena.");
  }

  await probar({
    kicker: "Paso 5 · ahora en Remix",
    titulo: "Prestar con plazo, y el límite del simulador",
    items: [
      ["PRESTAR POR 2 DÍAS", "prestar(1, 2). Leer equipos(1): aparece vence, un número grande. Son segundos desde 1970."],
      ["PREGUNTAR POR LA MORA", "estaVencido(1) devuelve false y diasDeMora(1) devuelve 0. Todavía está a tiempo."],
      ["QUERER ADELANTAR EL RELOJ", "No se puede: ni en el simulador de Remix ni en una red pública se puede mover el tiempo. Hay que esperarlo."],
    ],
    cierre: "Para ver la mora de verdad: la red local del curso sí deja mover su reloj, o se proyectan las 25 pruebas automáticas, que la comprueban en segundos.",
    alto: 0.95,
  });

  await pregunta({
    kicker: "Paso 5",
    texto: "El contrato ya sabe quién está en mora. ¿Y qué? ¿Qué puede hacer un contrato al respecto?",
    pista: "Sean literales: ¿qué puede hacer un programa que vive en una cadena?",
    notas: "Alguien dirá «mandar un correo» o «bloquearlo». El contrato no puede hacer ninguna de las dos por sí mismo: no sale de la cadena. Lo único que puede hacer es mover valor que ya tiene adentro.",
  });

  await respuesta({
    kicker: "Paso 5 · respuesta",
    titulo: "Nada, si no hay algo en juego",
    texto: "El contrato no puede ir a buscar el equipo, ni llamar a nadie, ni salir de la cadena. Solo puede hacer una cosa: que la mora tenga una consecuencia que él mismo sí controle.",
    columnas: [
      { et: "Lo que no puede", texto: "Mandar un correo, bloquear un carné, avisarle al coordinador. Nada de eso ocurre dentro de la cadena, y un contrato no sale de ahí." },
      { et: "Lo que sí puede", texto: "Retener un depósito que ya está en su poder. Si devolver a tiempo recupera la plata y devolver tarde no, la regla se hace cumplir sola." },
    ],
    puente: "Y ahí entra lo que convierte esto en un contrato de verdad: el dinero.",
  });

  /* ================================================================
     PASO 6
     ================================================================ */

  await D.divisor({
    letra: "6", titulo: "Que la mora cueste",
    sub: "Entra el dinero, y con él la parte donde los errores se pagan caro.",
    minutos: "payable · patrón de retiro · eventos", ic: "moneda",
  });

  await codigoDe({
    kicker: "Paso 6 · lo que agregamos",
    titulo: "Depósito al llevarse el equipo",
    codigo: `uint256 public immutable deposito;          // se fija al desplegar
mapping(address quien => uint256 wei_) public saldo;

function prestar(uint256 id, uint64 dias) public payable {
    ...
    if (msg.value != deposito) revert DepositoIncorrecto(deposito, msg.value);
    ...
}

function devolver(uint256 id) public {
    ...
    bool aTiempo = block.timestamp <= equipos[id].vence;
    saldo[aTiempo ? msg.sender : encargado] += deposito;   // se ANOTA, no se envía
    emit Devuelto(id, msg.sender, aTiempo, aTiempo ? deposito : 0);
}`,
    nota: "payable es el interruptor que permite que entre dinero. Sin esa palabra, la función no ignora el ether: lo rechaza.",
    size: 11.5,
    h: 4.3,
  });

  await codigoDe({
    kicker: "Paso 6 · la función más delicada del día",
    titulo: "Cada quien reclama lo suyo",
    codigo: `function retirar() public {
    uint256 monto = saldo[msg.sender];
    if (monto == 0) revert SinSaldo();

    saldo[msg.sender] = 0;                       // <- PRIMERO en cero

    (bool ok, ) = msg.sender.call{value: monto}("");   // <- DESPUÉS el envío
    require(ok, "el envio fallo");
}`,
    nota: "Si se invierten esas dos líneas, este contrato se puede vaciar. Es el error que costó 3,6 millones de ether en 2016, y lo vamos a explotar en la sesión de seguridad.",
    y: 2.1,
    h: 2.9,
  });

  await probar({
    kicker: "Paso 6 · ahora en Remix",
    titulo: "Dinero entrando y saliendo",
    items: [
      ["DESPLEGAR CON DEPÓSITO", "En el campo del constructor: 100000000000000000 wei, que son 0,1 ETH. Ojo con el selector de unidad."],
      ["PRESTAR SIN PAGAR", "REVIERTE con DepositoIncorrecto, y el error dice cuánto esperaba y cuánto llegó."],
      ["PRESTAR PAGANDO", "Poner 0.1 Ether en Value y prestar. El saldo de la cuenta baja; el del contrato sube."],
      ["DEVOLVER A TIEMPO", "Leer saldo(sucuenta): 0,1 ETH. El dinero NO llegó todavía: está anotado."],
      ["RETIRAR", "Ahora sí llega. Y retirar otra vez revierte con SinSaldo."],
      ["MANDAR 1 WEI AL CONTRATO", "Sin llamar ninguna función: REVIERTE con EnvioDirectoNoPermitido."],
    ],
    alto: 0.63,
  });

  await pregunta({
    kicker: "Paso 6",
    texto: "¿Por qué el contrato no le envía el depósito de una vez al devolver, y en cambio lo deja anotado para que cada quien lo reclame?",
    pista: "Parece un rodeo inútil. No lo es.",
    notas: "Es la pregunta más importante de la clase. Dejar que propongan; casi siempre alguien dice «para ahorrar gas», que no es la razón principal.",
  });

  await respuesta({
    kicker: "Paso 6 · respuesta",
    titulo: "Patrón de retiro",
    texto: "Porque enviar dinero es entregarle el control de la ejecución a quien lo recibe. Anotar primero y dejar que cada quien reclame quita dos problemas de un golpe.",
    columnas: [
      { et: "Si el receptor rechaza el envío", texto: "Un contrato puede estar hecho para reventar al recibir dinero. Si el envío va dentro de devolver(), ese solo participante tumba la operación entera. Para todos." },
      { et: "Si el receptor vuelve a entrar", texto: "Al recibir, su código corre. Si el estado no quedó en orden antes, puede llamar otra vez y cobrar dos veces. Así se perdieron 3,6 millones de ether en The DAO." },
    ],
    puente: "Por eso saldo[msg.sender] = 0 va ANTES del envío, y no después.",
  });

  /* ================================================================
     CIERRE
     ================================================================ */

  {
    const s = await D.lamina({ kicker: "Cierre", titulo: "La clase entera en una tabla", ic: "lista", tituloSize: 30 });
    D.tabla(s, ["paso", "lo que se rompió en pantalla", "lo que lo arregló"], [
      ["1", "El equipo cambió de manos sin que nadie lo devolviera.", "Una guardia: el contrato aprende a decir NO."],
      ["2", "Un contrato por equipo no escala.", "struct y mapping: una tabla adentro."],
      ["3", "Un equipo que no existe aparecía como disponible.", "El campo existe, y revertir en vez de mentir."],
      ["4", "Cualquiera registraba inventario inventado.", "Constructor y modificador: alguien responde."],
      ["5", "Nadie devolvía y la mora no se podía medir.", "Un plazo y el reloj del bloque."],
      ["6", "Estar en mora no costaba nada.", "Un depósito, y el patrón de retiro para moverlo sin riesgo."],
    ], { y: 1.95, h: 3.6, colW: [0.9, 5.8, 5.393], size: 12.5 });
    D.parrafo(s, "Si mañana recuerdan una sola cosa de hoy, que sea esta: en un contrato, los errores caros casi nunca son errores de sintaxis. Son reglas que nadie escribió.", { y: 5.75, h: 0.8, size: 15, color: C.ocre });
    s.addNotes("Pedirles que reconstruyan la tabla de memoria antes de proyectarla, en parejas, dos minutos. Es la mejor señal de si la clase funcionó.");
  }

  {
    const s = await D.lamina({ kicker: "La pregunta de siempre", titulo: "¿Esto necesitaba una blockchain?", ic: "balanza", tituloSize: 30 });
    D.enunciado(s, "Para el laboratorio de nuestra universidad: no. Una hoja de cálculo y una persona honesta hacen lo mismo, más rápido y gratis.", { y: 1.95, h: 1.5, size: 20, line: C.rojo });
    D.dosColumnas(s,
      { et: "Cuándo sí tendría sentido", texto: "Si el inventario fuera compartido entre varias universidades que no se fían entre sí. O si el depósito tuviera que devolverse sin que nadie pueda decidir no devolverlo." },
      { et: "Lo que de verdad aprendieron hoy", texto: "A leer un contrato y saber qué regla hace cumplir, cuánto cuesta, y quién manda adentro. Eso sirve igual para decidir que NO hace falta." },
      { y: 3.65, h: 2.1, size: 13.5 });
    D.parrafo(s, "Saber distinguir esos dos casos vale más que saber escribir el contrato.", { y: 5.95, h: 0.6, size: 15, color: C.ocre, align: "center" });
    s.addNotes("No suavizar el «no». La credibilidad del curso se construye en láminas como esta.");
  }

  await D.preguntaSemana({
    pregunta: "Repitan los seis pasos solos, de memoria hasta donde puedan, y con la guía cuando se traben. ¿En cuál paso se demoraron más, y por qué?",
    trabajo: [
      "Repetir los seis pasos en Remix, solos. La guía del estudiante trae cada paso con su comprobación y una tabla de errores frecuentes.",
      "Elegir UNO de los tres ejercicios de ampliación y contestar por escrito sus tres preguntas de diseño, antes de escribir código.",
      "Evidencia: la dirección del contrato desplegado y una captura de una transacción que REVIERTA. La que revierte, no la que funciona.",
    ],
    notas: "La evidencia es la dirección del contrato desplegado y una captura de la transacción que revierte. Insistir: la que revierte, no la que funciona.",
  });

  await D.cierre({
    kicker: "Lo que se llevan de hoy",
    frase: "Un contrato no es inteligente: hace exactamente lo que está escrito, incluso cuando eso es un desastre.",
    sub: "Hoy escribimos seis versiones y rompimos cinco. Cada función que quedó existe porque algo falló sin ella.",
    proxima: "La próxima sesión: los mismos patrones, pero con código ya auditado por miles de personas. Y la primera vez que esto toca una red de verdad.",
  });

  await D.guardar(path.join(__dirname, "Clase-Solidity-Paso-a-Paso.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
