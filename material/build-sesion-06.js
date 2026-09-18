/* =====================================================================
   Sesión 06 · Solidity I · fundamentos del contrato inteligente

     A · el lenguaje                          ~70 min
     B · laboratorio 06 en Remix              ~80 min
     C · entrega del anteproyecto             ~30 min

   Cifras reales usadas en el deck (calculadas, no estimadas):
   - Gas de CertificadosUSB medido en la red local de Hardhat 3.16 con
     Solidity 0.8.28 y optimizador 200 (despliegue 554 715; emitir 94 807
     el primero y 77 707 los siguientes; revocar 32 352; cambiarEmisor
     28 636).
   - Hash del archivo scripts/s06/diploma-de-prueba.pdf y de su versión
     con un bit cambiado, calculados con scripts/s06/hash-documento.js.
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 06 · SOLIDITY I · FUNDAMENTOS", titulo: "Sesión 06 · Solidity I" });
  const { C, F, M, CW } = D;

  function ideas(s, lista, size = 14) {
    lista.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  async function verificacion({ kicker, pregunta, opciones, pista, notas }) {
    const s = await D.lamina({ kicker, titulo: "Pregunta de verificación", ic: "pregunta", tituloSize: 29 });
    D.enunciado(s, pregunta, { y: 1.9, h: 1.45, size: 17, line: C.naranja });
    opciones.forEach((o, i) => {
      const y = 3.6 + i * 0.66;
      D.caja(s, { x: M, y, w: CW, h: 0.56, fill: i % 2 ? C.superf : C.blanco, sombra: false, lw: 1.25, line: C.grisClaro });
      s.addText(String.fromCharCode(65 + i), { x: M + 0.15, y, w: 0.5, h: 0.56, fontFace: F.display, fontSize: 16, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, o, { x: M + 0.75, y: y + 0.06, w: CW - 0.95, h: 0.46, size: 12.5, valign: "middle" });
    });
    if (pista) D.parrafo(s, pista, { y: 3.6 + opciones.length * 0.66 + 0.08, h: 0.5, size: 12, color: C.gris });
    s.addNotes(notas);
    return s;
  }

  /* ------------------------------------------------------------ apertura */
  await D.portada({
    kicker: "SESIÓN 06 · UNIDAD II · ETHEREUM Y CONTRATOS",
    titulo: "SOLIDITY I\nEL PRIMER\nCONTRATO",
    sub: "Hoy escriben un programa que, una vez desplegado, nadie puede cambiar. Ni siquiera ustedes.",
    palabra: "DESPLEGAR",
    ic: "codigo",
    notas: "Primera sesión de programación. Ritmo lento en el bloque A: casi todo lo que sigue en el curso depende de esta base. Abrir con la pregunta de la semana de la S5 (qué NO guardarían en un contrato): la respuesta correcta es exactamente el diseño del laboratorio de hoy, que guarda un hash y no el diploma.",
  });

  await D.agenda({
    intro: "La sesión más práctica hasta ahora: al salir, cada pareja tiene un contrato propio desplegado y verificado en una red pública.",
    bloques: [
      ["A", "EL LENGUAJE", "Estructura, tipos, funciones, visibilidad, errores, eventos, modificadores y el costo del storage.", "~70 min"],
      ["B", "LABORATORIO 06 · REMIX", "Registro de certificados: completar, probar, desplegar y verificar en Sepolia.", "~80 min"],
      ["C", "ENTREGA DEL ANTEPROYECTO", "Qué se entrega hoy, la prueba de la base de datos y cómo se filtra el alcance.", "~30 min"],
    ],
    notas: "70 + 80 + 30 = 180. Recibir los anteproyectos AL INICIO (impresos o en la plataforma) para leerlos mientras los equipos trabajan en el laboratorio: así el bloque C puede dar retroalimentación en vivo sobre dos o tres casos.",
  });

  await D.objetivo({
    objetivo: "Escribir, desplegar y verificar un primer contrato funcional en una red de prueba.",
    preguntas: [
      "¿Qué partes tiene un archivo de Solidity y para qué sirve cada una?",
      "¿Quién puede llamar cada función, y cuáles cuestan gas?",
      "¿Cómo falla bien un contrato, y cómo le cuenta al mundo lo que hizo?",
      "¿Qué datos nunca deben ir a una cadena pública?",
    ],
    ra: "RA3 · Programar contratos inteligentes en Solidity aplicando patrones y estándares de la industria.",
    notas: "La cuarta pregunta es la que más pesa en el anteproyecto: un proyecto que guarde datos personales en cadena no se aprueba.",
  });

  await D.glosario({
    items: [
      ["SPDX", "Software Package Data Exchange", "Identificador estándar de licencia en la primera línea. El compilador advierte si falta."],
      ["pragma", "directiva del compilador", "Qué versiones de Solidity pueden compilar el archivo."],
      ["Remix", "Remix IDE", "Entorno de desarrollo en el navegador: editar, compilar, desplegar y llamar sin instalar nada."],
      ["Bytecode", "código de bytes", "Lo que produce el compilador y se despliega: las instrucciones de la EVM de la Sesión 5."],
      ["msg.sender", "remitente del mensaje", "La dirección que llamó directamente a la función. La base de todo control de acceso."],
      ["view · pure", "mutabilidad", "view lee el estado sin cambiarlo; pure ni lo lee. Llamadas desde fuera: sin costo."],
      ["revert", "reversión", "Deshace todos los cambios de la llamada y devuelve un error. El gas consumido se paga igual."],
      ["event", "evento", "Registro que el contrato deja en el recibo. Barato, legible desde fuera, invisible para otros contratos."],
    ],
    notas: "Dejar proyectado mientras se reparte la guía PDF del laboratorio. Remix se escribe con mayúscula: es el nombre del producto.",
  });

  /* =============================================================== A */
  {
    const s = await D.divisor({ letra: "A", titulo: "El lenguaje", sub: "Solidity se parece a JavaScript en la sintaxis y a nada conocido en las consecuencias: cada línea se paga y ninguna se puede corregir después.", minutos: "APROXIMADAMENTE 70 MINUTOS", ic: "codigo" });
    s.addNotes("Bloque de 70 minutos y 20 láminas. Las láminas A.17 y A.18 son el contrato del laboratorio: si el tiempo aprieta, se leen rápido porque en el bloque B se vuelve sobre ellas línea por línea.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · antes de escribir", titulo: "Ni inteligente, ni contrato", ic: "termino", tituloSize: 30 });
    D.parrafo(s, "El término lo acuñó Nick Szabo en los años noventa. Hoy describe algo más modesto y más preciso:", { y: 1.9, h: 0.5, size: 14.5 });
    D.enunciado(s, "Un contrato inteligente es un programa desplegado en la cadena, con dirección propia, que se ejecuta exactamente como fue escrito cuando alguien lo llama.", { y: 2.55, h: 1.45, size: 19, line: C.naranja });
    D.dosColumnas(s,
      { et: "No es inteligente", texto: "No interpreta intenciones ni corrige errores. Si el código dice algo que el autor no quería, se ejecuta lo que dice el código. Varios de los robos más grandes de la historia fueron código funcionando exactamente como estaba escrito." },
      { et: "No es un contrato jurídico", texto: "Puede automatizar el cumplimiento de un acuerdo, pero no es por sí mismo un contrato ante la ley. Su validez jurídica en Colombia se discute en la Sesión 16." },
      { y: 4.2, h: 2.5, size: 12.5 });
    s.addNotes("Szabo, N. (1994/1996), Smart Contracts. La confusión con 'contrato jurídico' aparece en casi todos los anteproyectos: desactivarla hoy. 'Con dirección propia' conecta con la S5: es una cuenta de contrato, con código y storage.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · la forma de un archivo", titulo: "Anatomía de un contrato", ic: "documento", tituloSize: 30 });
    D.codigo(s, `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Contador {
    uint256 public cuenta;             // estado

    event Incrementado(uint256 nueva); // evento

    function incrementar() external {  // función
        cuenta += 1;
        emit Incrementado(cuenta);
    }
}`, { x: M, y: 1.9, w: 6.6, h: 4.8, lang: "sol", titulo: "contador.sol", size: 12.5 });
    const partes = [
      ["LICENCIA", "Primera línea. Los contratos verificados son públicos: la licencia dice qué se puede hacer con ese código."],
      ["PRAGMA", "Rango de versiones del compilador. Protege de compilar con una versión con otras reglas."],
      ["CONTRACT", "Como una clase: agrupa estado y funciones. Se despliega en su propia dirección."],
      ["ESTADO", "Variables que viven en storage. Persisten y cuestan (Sesión 5)."],
      ["EVENTOS Y FUNCIONES", "Lo que el contrato expone y lo que cuenta al exterior."],
    ];
    partes.forEach((p, i) => {
      const y = 1.9 + i * 0.97;
      D.etiqueta(s, p[0], { x: M + 6.9, y, w: CW - 6.9, size: 10.5 });
      D.parrafo(s, p[1], { x: M + 6.9, y: y + 0.34, w: CW - 6.9, h: 0.58, size: 12, ls: 1.12 });
    });
    s.addNotes("Preguntar: ¿cuánto gas cuesta la primera llamada a incrementar()? Con lo de la S5: 21 000 + datos + SSTORE de 0 a 1 (22 100) + LOG1 + resto. La segunda, unos 17 000 menos. Error típico: pensar que 'contract' es una instancia; es la plantilla, y cada despliegue crea una instancia con dirección distinta.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · la versión del compilador", titulo: "pragma: fijar con quién se compila", ic: "candado", tituloSize: 28 });
    D.tabla(s, ["escritura", "qué acepta", "cuándo usarla"], [
      ["pragma solidity 0.8.28;", "Solo 0.8.28.", "Contratos que se despliegan: el bytecode verificado debe ser reproducible."],
      ["pragma solidity ^0.8.28;", "0.8.28 o superior, dentro de 0.8.x.", "Bibliotecas y material que se reutiliza. Es la que usamos en clase."],
      ["pragma solidity >=0.8.0 <0.9.0;", "Todo el rango indicado.", "Código que otros compilarán con versiones distintas."],
    ], { y: 1.9, h: 2.5, colW: [3.9, 3.3, 4.893], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Por qué importa la 0.8", x: M, y: 4.65, w: CW, h: 1.35, texto: "Desde la versión 0.8.0, una suma que se desborda revierte automáticamente. Antes daba la vuelta en silencio: 255 + 1 en un uint8 daba 0. Ese cambio eliminó una familia entera de robos, como veremos en la Sesión 9.", size: 13 });
    D.parrafo(s, "Error típico al verificar en el explorador: elegir otra versión del compilador. El bytecode no coincide y la verificación falla.", { y: 6.2, h: 0.55, size: 13, color: C.ocre });
    s.addNotes("Con ^0.8.28, Remix puede ofrecer una versión más nueva: en el laboratorio se elige 0.8.28 exacta para que coincida con versiones.md y con la verificación. El compilador queda grabado en los metadatos del bytecode desplegado.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · tipos de valor", titulo: "Los tipos que van a usar todo el semestre", ic: "rejilla", tituloSize: 27 });
    D.tabla(s, ["tipo", "qué guarda", "detalle que importa"], [
      ["uint256", "Entero sin signo de 256 bits. Existen de uint8 a uint256.", "El natural de la EVM. Usar tamaños menores solo ahorra al empaquetar en storage (Sesión 7)."],
      ["int256", "Entero con signo.", "Poco usado: saldos y montos nunca son negativos."],
      ["bool", "true o false.", "Ocupa un byte en storage, no un bit."],
      ["address", "Dirección de 20 bytes.", "address payable, además, puede recibir ETH con transfer y send."],
      ["bytes32", "Exactamente 32 bytes.", "El tipo natural de un hash. Barato y de tamaño fijo."],
      ["bytes · string", "Secuencias de tamaño variable.", "Caros. string no tiene longitud ni comparación nativa: se convierte a bytes."],
    ], { y: 1.9, h: 4.35, colW: [2.2, 4.3, 5.593], size: 11.5 });
    D.parrafo(s, "No existe float ni double. Los montos se guardan en la unidad más pequeña, como el wei (Sesión 5).", { y: 6.35, h: 0.45, size: 13, color: C.ocre });
    s.addNotes("En el laboratorio el hash del diploma es bytes32 y el programa es string. Pregunta: ¿por qué el hash no se guarda como string? Porque bytes32 ocupa exactamente una ranura y se compara con ==; un string de 66 caracteres ocuparía tres ranuras y no se puede comparar directamente.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · lo que sorprende de los tipos", titulo: "Valores por defecto, límites y comparaciones", ic: "alerta", tituloSize: 25 });
    D.codigo(s, `uint256 x;              // vale 0: toda variable nace en cero
bool b;                 // vale false
address a;              // vale address(0)
uint8 y = 255;
y = y + 1;              // REVIERTE: desbordamiento (desde 0.8.0)

string memory p = "Sistemas";
// if (p == "Sistemas")                        NO COMPILA
if (keccak256(bytes(p)) == keccak256("Sistemas")) { }  // así sí
if (bytes(p).length == 0) { }                          // ¿vacío?`, { x: M, y: 1.9, w: CW, h: 3.2, lang: "sol", size: 12 });
    D.dosColumnas(s,
      { et: "La consecuencia de los ceros", texto: "No hay «null». Un certificado que nunca se emitió no da error: devuelve ceros. Por eso el laboratorio guarda un campo existe." },
      { et: "La de los strings", texto: "Comparar textos exige hashearlos. Por eso en cadena se prefieren bytes32 e identificadores numéricos." },
      { y: 5.25, h: 1.58, size: 11.5 });
    s.addNotes("Las líneas del bloque son válidas en Solidity 0.8.28 (dentro de una función). Error típico en Remix: escribir p == 'x' y no entender el error del compilador 'Operator == not compatible with types string'. bytes(programa).length es exactamente lo que usa emitir() para rechazar un programa vacío.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · dónde vive cada variable", titulo: "Variables de estado y variables locales", ic: "capas", tituloSize: 27 });
    D.codigo(s, `contract Tienda {
    uint256 public ventas;          // ESTADO · storage · persiste

    function vender(uint256 precio) external {
        uint256 conIva = precio * 119 / 100;  // LOCAL · desaparece
        ventas += conIva;                     // escritura en storage
    }
}`, { x: M, y: 1.9, w: CW, h: 2.6, lang: "sol", size: 12.5 });
    D.dosColumnas(s,
      { et: "Estado", items: ["Declarada fuera de las funciones.", "Vive en storage: la cadena la recuerda para siempre.", "Estrenar una ranura: 22 100 de gas (Sesión 5)."] },
      { et: "Local", items: ["Declarada dentro de una función.", "Vive en la pila o en memory: se borra al terminar.", "Casi gratis."] },
      { y: 4.7, h: 2.0, size: 12.5 });
    s.addNotes("Observen el orden de la multiplicación: precio * 119 / 100. Al revés, precio / 100 * 119 pierde los decimales antes de multiplicar (con precio = 150: 150/100 = 1, 1*119 = 119 en vez de 178). Sin punto flotante, el orden de las operaciones es parte de la corrección.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · el costo del storage, medido", titulo: "Cuánto cuesta el contrato de hoy", ic: "gas", tituloSize: 29 });
    D.tabla(s, ["operación en CertificadosUSB", "gas medido", "por qué"], [
      ["Desplegar", "554 715", "Guardar 2 206 bytes de código en la cadena, más el constructor."],
      ["Emitir el primer certificado", "94 807", "Estrena 2 ranuras del certificado y la del contador emitidos (0 → 1)."],
      ["Emitir los siguientes", "77 707", "El contador ya existe: 1 → 2 cuesta 5 000 y no 22 100. Diferencia: 17 100."],
      ["Revocar", "32 352", "Cambia un bool en una ranura que ya existe, y emite un evento."],
      ["Cambiar el emisor", "28 636", "Sobrescribe una dirección."],
      ["Verificar (view)", "0 para quien consulta", "Es una lectura al nodo, no una transacción."],
    ], { y: 1.9, h: 3.75, colW: [3.8, 2.4, 5.893], size: 11.5 });
    D.parrafo(s, "Con una tarifa base cercana a 1 gwei, como la de Sepolia en septiembre de 2026, desplegar cuesta del orden de 0,0006 ETH de prueba y emitir, 0,0001.", { y: 5.8, h: 0.55, size: 12.5 });
    D.parrafo(s, "Error típico: «guardemos el PDF del diploma en el contrato». Un PDF de 100 KB son más de 3 000 ranuras: decenas de millones de gas.", { y: 6.35, h: 0.45, size: 12, color: C.ocre });
    s.addNotes("Medido con Hardhat 3.16 / Solidity 0.8.28 / optimizador 200 en la red local. La diferencia 94 807 − 77 707 = 17 100 = 22 100 − 5 000 es exactamente la tabla de la S5. ⚠ VERIFICAR ANTES DE DICTAR: si Sepolia ya activó Glamsterdam (prevista para el 6-oct-2026), crear estado cuesta más (EIP-8037) y estas cifras cambian en Sepolia, no en la red local.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · quién puede llamar", titulo: "Visibilidad: cuatro palabras, cuatro fronteras", ic: "llave", tituloSize: 26 });
    D.tabla(s, ["visibilidad", "desde fuera", "desde este contrato", "desde un hijo"], [
      ["public", "Sí", "Sí", "Sí"],
      ["external", "Sí", "Solo con this.funcion()", "No directamente"],
      ["internal", "No", "Sí", "Sí"],
      ["private", "No", "Sí", "No"],
    ], { y: 1.9, h: 2.4, colW: [2.6, 2.6, 3.9, 2.993], size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "private NO significa secreto", x: M, y: 4.55, w: CW, h: 1.45, texto: "private solo impide que OTROS CONTRATOS la lean. Cualquier persona puede leer el storage completo de cualquier contrato con una llamada al nodo. Guardar una contraseña en una variable private es publicarla.", size: 13.5 });
    D.parrafo(s, "Una variable de estado public genera automáticamente una función de lectura con su nombre. Por eso se puede consultar emisor() en el laboratorio sin haberla escrito.", { y: 6.2, h: 0.58, size: 12.5 });
    s.addNotes("Demostración opcional: ethers.provider.getStorage(direccion, 0) lee la ranura 0 de cualquier contrato, private o no. En CertificadosUSB el mapping es private y aun así cualquiera puede leer cada certificado calculando su ranura. Regla del laboratorio: las funciones que se llaman desde fuera son external.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · qué hace la función con el estado", titulo: "view, pure y payable", ic: "gas", tituloSize: 30 });
    D.tabla(s, ["modificador", "lee estado", "cambia estado", "recibe ETH", "costo si se llama desde fuera"], [
      ["(ninguno)", "Sí", "Sí", "No", "Transacción: cuesta gas."],
      ["view", "Sí", "No", "No", "Llamada gratuita al nodo."],
      ["pure", "No", "No", "No", "Llamada gratuita al nodo."],
      ["payable", "Sí", "Sí", "Sí", "Transacción: cuesta gas."],
    ], { y: 1.9, h: 2.4, colW: [2.2, 1.8, 2.1, 1.9, 4.093], size: 12 });
    D.parrafo(s, "«Gratuita» tiene letra pequeña:", { y: 4.5, h: 0.4, size: 14, bold: true, color: C.tinta });
    D.lista(s, [
      "Es gratis cuando una aplicación la consulta directamente a un nodo: no se crea transacción.",
      "Si otro contrato la llama dentro de una transacción, el gas se paga igual: verificar() costaría unos 27 000.",
      "Una función sin payable que recibe ETH revierte: es una protección, no un descuido.",
    ], { y: 4.95, h: 1.8, size: 13, gap: 6 });
    s.addNotes("En Remix el color del botón lo dice: azul = view/pure (llamada gratuita, respuesta inmediata), naranja = transacción, rojo = payable. Error típico: declarar view una función que escribe; el compilador lo impide. El contrario (no declarar view una función que solo lee) compila, pero Remix la trata como transacción y la cobra.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · lo que el contrato sabe del mundo", titulo: "Variables globales", ic: "mundo", tituloSize: 30 });
    D.tabla(s, ["variable", "qué contiene", "cuidado"], [
      ["msg.sender", "Quién llamó directamente a esta función.", "Si un contrato llama a otro, es el contrato intermediario, no la persona."],
      ["msg.value", "Cuántos wei vinieron con la llamada.", "Solo tiene sentido en funciones payable."],
      ["block.timestamp", "Marca de tiempo del bloque, en segundos.", "La elige el proponente del bloque dentro de un margen pequeño: no sirve para decisiones al segundo."],
      ["block.number", "Altura del bloque.", "No es una medida exacta de tiempo."],
      ["tx.origin", "La cuenta externa que firmó la transacción original.", "NUNCA para control de acceso. Es una vulnerabilidad clásica (Sesión 9)."],
    ], { y: 1.9, h: 4.1, colW: [2.4, 4.3, 5.393], size: 11.5 });
    D.parrafo(s, "Lo que NO hay: la hora real, archivos, internet, números aleatorios. Todo lo que el contrato sabe está en la cadena o viene en la llamada.", { y: 6.15, h: 0.6, size: 13, color: C.ocre });
    s.addNotes("El laboratorio usa las dos más importantes: msg.sender en el modificador y block.timestamp para la fecha de emisión (guardada como uint64: alcanza hasta el año 584 mil millones). Recordar A.6 de la S5: msg.sender cambia en cada salto entre contratos.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · fallar bien", titulo: "require, revert, errores personalizados y assert", ic: "alerta", tituloSize: 24 });
    D.codigo(s, `// 1 · require con mensaje: simple, pero guarda el texto en el bytecode
require(msg.sender == emisor, "no autorizado");

// 2 · error personalizado: más barato y lleva datos
error NoEsEmisor(address quien);
if (msg.sender != emisor) revert NoEsEmisor(msg.sender);

// 3 · assert: para lo que NUNCA debería pasar
assert(totalEmitidos >= totalRevocados);`, { x: M, y: 1.9, w: CW, h: 2.95, lang: "sol", size: 12 });
    D.tabla(s, ["", "para qué", "gas"], [
      ["require / revert", "Validar entradas, permisos y condiciones de uso.", "Consumido hasta el error; el resto se devuelve."],
      ["error personalizado", "Lo mismo, con datos estructurados que la interfaz puede mostrar.", "Menor: no almacena cadenas de texto."],
      ["assert", "Invariantes internas. Si falla, hay un error de programación.", "Produce un Panic: señal de defecto, no de uso."],
    ], { y: 5.02, h: 1.76, colW: [2.6, 5.4, 4.093], size: 10.5 });
    s.addNotes("En el laboratorio se usan solo errores personalizados: es la práctica actual de OpenZeppelin v5. Desde Solidity 0.8.26 require también acepta un error personalizado, pero en clase se usa la forma if + revert porque se lee igual en cualquier versión 0.8.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · un revert, visto desde fuera", titulo: "Qué ve quien llama cuando algo falla", ic: "lupa", tituloSize: 27 });
    D.pasos(s, [
      ["LA BILLETERA SIMULA", "Antes de firmar, estima el gas ejecutando la llamada. Si revierte, avisa: en Remix aparece «Gas estimation failed»."],
      ["EL ERROR VIAJA CODIFICADO", "NoEsEmisor(0xf39F…2266) viaja como 0x63898998 + la dirección: el selector del error y su argumento, igual que una función."],
      ["SI SE FIRMA IGUAL", "La transacción entra a un bloque con Status Fail, se paga el gas consumido y no cambia nada. Es la evidencia del intento fallido del laboratorio."],
    ], { y: 1.9, alto: 1.0, gap: 0.14, anchoEt: 3.3, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.5, w: CW, h: 1.25, texto: "«Si revierte, no pasó nada». Para el estado es cierto. Para quien firmó, no: el gas consumido se cobra y el intento queda para siempre en la cadena.", size: 13 });
    s.addNotes("El selector 0x63898998 = primeros 4 bytes de keccak256('NoEsEmisor(address)'), calculado con ethers. Si el contrato está verificado, el explorador lo traduce: 'Fail With Custom Error NoEsEmisor'. Lo vieron en la S5 con FHERC20IncompatibleFunction.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · contarle al mundo lo que pasó", titulo: "Eventos", ic: "red", tituloSize: 31 });
    D.codigo(s, `event CertificadoEmitido(bytes32 indexed hashDocumento, string programa, uint64 fecha);

emit CertificadoEmitido(hashDocumento, programa, ahora);`, { x: M, y: 1.9, w: CW, h: 1.2, lang: "sol", size: 12 });
    D.dosColumnas(s,
      { et: "Por qué existen", items: ["Son la forma barata de dejar constancia: menos de la mitad que escribir en storage (medido en la Sesión 5).", "Las aplicaciones se suscriben a ellos para actualizarse sin consultar todo el tiempo.", "Quedan en el recibo de la transacción, para siempre."] },
      { et: "Lo que no pueden hacer", items: ["Otro contrato NO puede leer un evento. Si la lógica lo necesita, va en storage.", "Hasta 3 parámetros indexed: son los que se pueden filtrar rápido.", "Un evento no prueba nada por sí mismo si el contrato que lo emite no es el esperado."] },
      { y: 3.3, h: 2.75, size: 12.5 });
    D.parrafo(s, "Regla práctica: toda función que cambia el estado emite un evento. Sin evento, la interfaz de la Sesión 12 no se entera.", { y: 6.2, h: 0.55, size: 13, color: C.ocre });
    s.addNotes("La tercera fila de la derecha es la de la S5: en los logs, siempre revisar la dirección del contrato que emitió. Un contrato falso puede emitir un evento 'CertificadoEmitido' idéntico.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · un evento dentro del recibo", titulo: "Cómo se ve CertificadoEmitido en el explorador", ic: "lupa", tituloSize: 25 });
    D.tabla(s, ["parte del log", "contenido", "de dónde sale"], [
      ["Address", "La dirección de SU contrato.", "Quién emitió: lo primero que se comprueba."],
      ["Topics[0]", "0x774ca613…3fd6", "keccak256(\"CertificadoEmitido(bytes32,string,uint64)\")"],
      ["Topics[1]", "El hash del diploma, completo.", "El parámetro indexed: por eso se puede buscar."],
      ["Data", "«Ingenieria de Sistemas» y la fecha, codificados en ABI.", "Los no indexados: se leen, no se filtran."],
    ], { y: 1.9, h: 2.75, colW: [2.2, 4.6, 5.293], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Por qué el hash va indexado", x: M, y: 4.85, w: CW, h: 1.9, texto: "Una empresa que recibe un diploma calcula su hash y pregunta al nodo: «dame los eventos CertificadoEmitido cuyo Topics[1] sea este hash». Sin indexar, tendría que descargar y leer todos los eventos del contrato. Indexar el programa no aporta: nadie busca por programa.", size: 13 });
    s.addNotes("Topic calculado con ethers sobre el contrato de referencia: 0x774ca613bc69539f740c09dc7a428006e870e9cb3dff99a89fbd49088e2c3fd6. En el laboratorio lo van a ver en la pestaña Logs de su transacción de emisión, y es parte de la evidencia.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · inicializar y proteger", titulo: "Constructor y modificadores", ic: "escudo", tituloSize: 29 });
    D.codigo(s, `address public emisor;

constructor() {
    emisor = msg.sender;   // UNA vez, al desplegar
}

modifier soloEmisor() {
    if (msg.sender != emisor) revert NoEsEmisor(msg.sender);
    _;          // aquí se inserta la función
}

function emitir(bytes32 h, string calldata p) external soloEmisor {
    // solo llega aquí si pasó el modificador
}`, { x: M, y: 1.9, w: 7.1, h: 4.85, lang: "sol", size: 11 });
    D.lista(s, [
      "El constructor no queda en el bytecode desplegado: corre una vez y desaparece.",
      "Quien despliega es msg.sender en el constructor. Por eso el emisor es la cuenta con la que se despliega.",
      "El guion bajo _; marca dónde se ejecuta la función protegida.",
      "Un modificador olvidado en UNA función abre la puerta entera. Revisar cada función que cambia estado.",
    ], { x: M + 7.4, y: 1.9, w: CW - 7.4, h: 4.85, size: 13, gap: 10 });
    s.addNotes("Error típico del TODO 1: olvidar el _; o ponerlo antes del if (entonces la función corre y DESPUÉS se revisa el permiso: el revert deshace todo, así que es correcto pero gasta más). Error típico del TODO 2: desplegar con la cuenta equivocada de MetaMask; el emisor queda siendo esa.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · vista previa de la Sesión 7", titulo: "El mapping que necesitamos hoy", ic: "rejilla", tituloSize: 28 });
    D.parrafo(s, "El laboratorio necesita buscar un certificado por su hash. Para eso existe el mapping: una tabla de pares clave → valor. Hoy basta con usarlo; la Sesión 7 lo estudia a fondo.", { y: 1.9, h: 0.95, size: 14.5 });
    D.codigo(s, `mapping(bytes32 => Certificado) private _certificados;

_certificados[hash] = Certificado({ programa: p, fechaEmision: t, revocado: false, existe: true });

Certificado storage c = _certificados[hash];   // referencia: los cambios se guardan`, { x: M, y: 3.0, w: CW, h: 1.75, lang: "sol", size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Lo único que hay que saber hoy", x: M, y: 5.0, w: CW, h: 1.7, texto: "Toda clave existe: si nunca se escribió, devuelve el valor por defecto (ceros, falso, texto vacío). Por eso el certificado lleva el campo «existe»: sin él, no se distingue un certificado que nunca se emitió de uno emitido con datos vacíos.", size: 13 });
    s.addNotes("Conecta con A.5 (valores por defecto). Un mapping no se puede recorrer ni sabe cuántas claves tiene: por eso existe el contador emitidos. Error típico del TODO 5: escribir Certificado memory c; se modifica una copia y la revocación no se guarda.");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · la decisión de diseño del laboratorio", titulo: "Lo que nunca va a una cadena pública", ic: "candado", tituloSize: 27 });
    D.parrafo(s, "La tentación es guardar el nombre del graduado, su cédula y su programa. Parece útil. Es un error grave, y no técnico: jurídico.", { y: 1.9, h: 0.62, size: 14.5 });
    D.dosColumnas(s,
      { et: "El choque", linea: C.rojo, color: C.rojo, texto: "La Ley Estatutaria 1581 de 2012 de protección de datos personales da a toda persona derecho a conocer, actualizar, rectificar y pedir la supresión de sus datos. Una cadena pública es inmutable: lo escrito no se puede suprimir." },
      { et: "La salida", texto: "En la cadena va solo el HASH del archivo del diploma. Quien tiene el PDF calcula el hash y verifica. Quien no lo tiene no aprende nada: un hash no identifica a una persona por sí solo." },
      { y: 2.7, h: 2.55, size: 13 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Regla para el anteproyecto", x: M, y: 5.45, w: CW, h: 1.28, texto: "Si su proyecto maneja datos de personas, el anteproyecto tiene que decir explícitamente qué va en la cadena, qué va fuera y por qué. Un proyecto que guarde datos personales en cadena no se aprueba.", size: 13 });
    s.addNotes("Matiz para quien pregunte: incluso un hash puede ser dato personal si es fácil de asociar (por ejemplo, el hash de una cédula, que se puede adivinar por fuerza bruta: hay pocos millones de cédulas). Por eso se hashea el archivo completo del diploma, no un identificador corto. La prueba 'privacidad' del laboratorio revisa que el ABI no tenga campos como nombre o cedula.");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · el contrato del laboratorio · 1 de 2", titulo: "Emitir: validar, guardar, avisar", ic: "codigo", tituloSize: 28 });
    D.codigo(s, `function emitir(bytes32 hashDocumento, string calldata programa)
    external soloEmisor
{
    if (hashDocumento == bytes32(0)) revert HashVacio();
    if (bytes(programa).length == 0) revert ProgramaVacio();
    if (_certificados[hashDocumento].existe) revert YaEmitido(hashDocumento);

    uint64 ahora = uint64(block.timestamp);
    _certificados[hashDocumento] = Certificado(programa, ahora, false, true);
    emitidos += 1;

    emit CertificadoEmitido(hashDocumento, programa, ahora);
}`, { x: M, y: 1.9, w: 7.6, h: 4.85, lang: "sol", size: 10.5 });
    const notas = [
      ["VALIDAR PRIMERO", "Todas las comprobaciones antes de tocar el estado. Si algo falla, no se escribió nada."],
      ["CALLDATA", "El texto se lee sin copiarlo a memoria: más barato (Sesión 5)."],
      ["UN SOLO HASH, UNA VEZ", "YaEmitido impide sobrescribir un certificado existente, incluido uno revocado."],
      ["EVENTO AL FINAL", "Se emite cuando todo salió bien."],
    ];
    notas.forEach((n, i) => {
      const y = 1.9 + i * 1.2;
      D.etiqueta(s, n[0], { x: M + 7.9, y, w: CW - 7.9, size: 10 });
      D.parrafo(s, n[1], { x: M + 7.9, y: y + 0.34, w: CW - 7.9, h: 0.82, size: 12, ls: 1.12 });
    });
    s.addNotes("Es la solución de los TODO 3 y 4. Se proyecta ANTES del laboratorio a propósito: el ejercicio no es adivinar la sintaxis sino escribirla, probarla y desplegarla. Quien quiera el reto completo, que no mire esta lámina durante el laboratorio.");
  }

  {
    const s = await D.lamina({ kicker: "A.19 · el contrato del laboratorio · 2 de 2", titulo: "Revocar sin borrar, verificar sin pagar", ic: "codigo", tituloSize: 26 });
    D.codigo(s, `function revocar(bytes32 h, string calldata motivo) external soloEmisor {
    Certificado storage c = _certificados[h];
    if (!c.existe) revert NoExiste(h);
    if (c.revocado) revert YaRevocado(h);
    c.revocado = true;
    emit CertificadoRevocado(h, motivo);
}

function verificar(bytes32 h) external view
    returns (bool valido, string memory programa, uint64 fecha, bool revocado)
{
    Certificado storage c = _certificados[h];
    return (c.existe && !c.revocado, c.programa, c.fechaEmision, c.revocado);
}`, { x: M, y: 1.9, w: 7.6, h: 4.85, lang: "sol", size: 10.5 });
    const notas = [
      ["STORAGE, NO MEMORY", "c apunta al dato guardado. Con memory se modificaría una copia y el cambio se perdería."],
      ["REVOCAR NO ES BORRAR", "Queda la historia: existió, se emitió en tal fecha, se revocó por tal motivo. Eso es lo que da confianza."],
      ["VIEW", "Quien verifica un diploma no paga nada ni necesita billetera."],
    ];
    notas.forEach((n, i) => {
      const y = 1.9 + i * 1.6;
      D.etiqueta(s, n[0], { x: M + 7.9, y, w: CW - 7.9, size: 10 });
      D.parrafo(s, n[1], { x: M + 7.9, y: y + 0.34, w: CW - 7.9, h: 1.15, size: 12, ls: 1.12 });
    });
    s.addNotes("Soluciones de los TODO 5 y 6. El motivo de revocación es texto libre: advertir que tampoco puede contener datos personales ('revocado porque Juan Pérez plagió' queda para siempre). ¿Por qué revocar en lugar de borrar? Es la pregunta del informe.");
  }

  await verificacion({
    kicker: "A.20 · cierre del bloque A",
    pregunta: "Un compañero propone: «guardemos el nombre del graduado en una variable private; así nadie lo ve y cumplimos la Ley 1581». ¿Qué le responden?",
    opciones: [
      "Bien: private oculta el dato a todos menos al contrato.",
      "Mal: private solo impide que otros contratos lo lean; cualquiera lee el storage, y además no se podría suprimir.",
      "Bien, siempre que el nombre se guarde en mayúsculas.",
    ],
    pista: "Un minuto en parejas. La respuesta correcta tiene dos razones: encuéntrenlas las dos.",
    notas: "Respuesta: B. Las dos razones: private no es secreto (A.8) y lo escrito en cadena no se puede suprimir (A.17). Si alguien eligió A, repasar A.8 antes de abrir Remix: es el error que más anteproyectos comete.",
  });

  /* =============================================================== B */
  {
    const s = await D.divisor({ letra: "B", titulo: "Laboratorio 06 · Remix", sub: "Completar el registro de certificados, probarlo en la máquina virtual del navegador, desplegarlo en Sepolia y verificarlo.", minutos: "APROXIMADAMENTE 80 MINUTOS · EN PAREJAS", ic: "martillo" });
    s.addNotes("Guía completa: laboratorios-evm/guias/s06-certificados-remix.pdf. Tiempos: 10 preparar + 35 TODO + 5 hash + 15 Sepolia + 15 explorador. Quien no tenga saldo de Sepolia trabaja en la Remix VM y despliega al final con fondos de la billetera institucional.");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · 10 minutos", titulo: "Preparar y compilar en Remix", ic: "pantalla", tituloSize: 29 });
    D.pasos(s, [
      ["ABRIR", "remix.ethereum.org, en el navegador donde está la billetera del curso."],
      ["CREAR ARCHIVO", "File Explorer → carpeta contracts → nuevo archivo CertificadosUSB.sol. Pegar el andamiaje: andamiaje/s06/CertificadosUSB.sol."],
      ["COMPILADOR", "Pestaña Solidity Compiler: versión 0.8.28. En Advanced Configurations, activar optimización con 200 ejecuciones."],
      ["COMPILAR", "Compile CertificadosUSB.sol. Salida esperada: marca verde en el ícono del compilador y ningún error en rojo."],
    ], { y: 1.9, alto: 0.84, gap: 0.12, anchoEt: 2.5, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Por qué compilar antes de escribir", x: M, y: 5.8, w: CW, h: 0.98, texto: "El andamiaje compila tal como viene. Si no compila antes de tocarlo, el problema es de configuración, no de su código.", size: 12.5 });
    s.addNotes("Los avisos amarillos del andamiaje (parámetros sin usar) son normales: desaparecen al completar los TODO. ⚠ VERIFICAR ANTES DE DICTAR: la interfaz de Remix cambia seguido; revisar la semana anterior que los nombres de pestañas y opciones coincidan con la guía.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · 35 minutos", titulo: "Completar los siete TODO", ic: "codigo", tituloSize: 30 });
    D.tabla(s, ["TODO", "qué hacer", "cómo probarlo en la Remix VM"], [
      ["1 · modificador", "Revertir si quien llama no es el emisor.", "Cambiar de cuenta en Remix e intentar emitir: debe fallar con NoEsEmisor."],
      ["2 · constructor", "Guardar al emisor y emitir EmisorCambiado.", "Botón emisor: debe ser la cuenta que desplegó."],
      ["3 y 4 · emitir", "Validar, guardar, contar y emitir el evento.", "Emitir un hash de prueba y consultar emitidos: 1."],
      ["5 · revocar", "Validar existencia y estado, revocar.", "Revocar dos veces: la segunda falla con YaRevocado."],
      ["6 · verificar", "Devolver válido = existe y no revocado.", "Verificar antes y después de revocar."],
      ["7 · cambiar emisor", "Rechazar la dirección cero y traspasar.", "Traspasar y comprobar que la anterior ya no puede emitir."],
    ], { y: 1.9, h: 4.2, colW: [2.3, 4.2, 5.593], size: 11.5 });
    D.parrafo(s, "Después de cada TODO: compilar, desplegar de nuevo en la Remix VM y probar a mano. Avanzar de uno en uno ahorra la mitad del tiempo de depuración.", { y: 6.25, h: 0.55, size: 13, color: C.ocre });
    s.addNotes("Circular por la sala mirando los TODO 1 y 5: son los que más se equivocan (el _; y storage vs memory). Quien termine antes: correr las 18 pruebas con Hardhat (B.7).");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · probar a mano", titulo: "La Remix VM, paso a paso", ic: "pantalla", tituloSize: 30 });
    D.pasos(s, [
      ["ENTORNO", "Deploy & Run → Environment: Remix VM. Aparecen cuentas de prueba con 100 ETH ficticios cada una."],
      ["DESPLEGAR", "Deploy. En Deployed Contracts aparece CertificadosUSB con un botón por función."],
      ["LEER", "Botones azules (view): emisor, emitidos, verificar. Responden al instante y no cuestan nada."],
      ["ESCRIBIR", "Botones naranja (transacción): emitir, revocar, cambiarEmisor. Cada uno deja una línea en la terminal."],
      ["REVISAR", "En la terminal, desplegar la transacción: status, gas usado y logs con el evento."],
    ], { y: 1.9, alto: 0.74, gap: 0.1, anchoEt: 2.3, size: 12.5 });
    D.parrafo(s, "Cómo saber que funcionó: verificar(hash) devuelve true, el programa y una fecha distinta de cero justo después de emitir.", { y: 6.2, h: 0.6, size: 13, color: C.ocre });
    s.addNotes("En la Remix VM todo es instantáneo y gratis: es el lugar para equivocarse. Recordar que cada 'Deploy' crea un contrato NUEVO con estado vacío: si redesplegaron, los certificados emitidos antes están en el contrato viejo.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · el dato que se registra", titulo: "Calcular el hash del diploma", ic: "documento", tituloSize: 30 });
    D.parrafo(s, "El repositorio trae un diploma ficticio, sin datos de ninguna persona. Se calcula su hash, se altera un solo bit y se vuelve a calcular:", { y: 1.9, h: 0.65, size: 14 });
    D.codigo(s, `node scripts/s06/hash-documento.js scripts/s06/diploma-de-prueba.pdf
  keccak  : 0x87daf6ef2771bae4d21b7fb938774a35b9bd4a1a6989dd253c6694e9dcbed455

node scripts/s06/alterar-un-byte.js scripts/s06/diploma-de-prueba.pdf
node scripts/s06/hash-documento.js scripts/s06/diploma-de-prueba-alterado.pdf
  keccak  : 0xc89d02a9a7f8b6660f3567945455456ed1e2b96cdd0637371b863b2c0f913951`, { x: M, y: 2.7, w: CW, h: 2.2, lang: "js", titulo: "en la carpeta laboratorios-evm", size: 11.5 });
    D.pasos(s, [
      ["EMITIR", "Pegar el primer valor como hashDocumento en emitir()."],
      ["VERIFICAR", "verificar() con el segundo valor: no es válido. Un bit distinto, otro hash (Sesión 2)."],
    ], { y: 5.1, alto: 0.72, gap: 0.1, anchoEt: 1.9, size: 12.5 });
    s.addNotes("Valores reales, calculados con los dos scripts sobre el archivo del repositorio. Cualquier PDF propio SIN datos personales sirve igual; nunca un diploma real. Sin Node en la máquina: la guía explica cómo calcularlo en la consola del navegador de Remix.");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · 15 minutos", titulo: "Desplegar en Sepolia", ic: "cohete", tituloSize: 31 });
    D.pasos(s, [
      ["ENTORNO", "Environment: la opción de billetera del navegador (Browser Extension / Injected Provider – MetaMask). Aceptar la conexión."],
      ["RED", "Confirmar que Remix muestra Sepolia, identificador 11155111. Si dice otra red, cambiarla en la billetera."],
      ["DESPLEGAR", "Deploy. En la billetera, antes de confirmar: red Sepolia, valor 0, costo del orden de 0,001 ETH de prueba. Confirmar."],
      ["ESPERAR", "Unos 12 a 30 segundos. Copiar la dirección del contrato desde Deployed Contracts."],
      ["USAR", "Emitir el hash del diploma, verificar ambos hashes, intentar emitir desde otra cuenta, revocar."],
    ], { y: 1.9, alto: 0.72, gap: 0.08, anchoEt: 2.2, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Antes de confirmar cualquier firma", x: M, y: 5.88, w: CW, h: 0.95, texto: "Leer qué red, a qué dirección y cuánto. No se firma nada cuyo contenido no se entienda.", size: 12.5 });
    s.addNotes("⚠ VERIFICAR ANTES DE DICTAR el nombre exacto de la opción de billetera en Remix: la documentación actual la llama 'Browser Extension'; versiones anteriores, 'Injected Provider – MetaMask'. El intento fallido desde otra cuenta: Remix avisará 'Gas estimation failed' y ofrecerá enviarla igual; se envía a propósito para tener la evidencia (cuesta muy poco).");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · 15 minutos", titulo: "Ver el evento y verificar el código", ic: "lupa", tituloSize: 28 });
    D.pasos(s, [
      ["BUSCAR", "sepolia.etherscan.io → la dirección del contrato. Ver la transacción de creación y las de uso."],
      ["LOGS", "Abrir la emisión → pestaña Logs: CertificadoEmitido, con el hash del diploma en Topics[1] (A.14)."],
      ["VERIFY", "Pestaña Contract → Verify and Publish: Solidity (Single file), v0.8.28, licencia MIT, optimización Yes con 200."],
      ["PEGAR", "El código exacto que se desplegó. Si todo coincide aparece la marca verde de verificado."],
      ["LEER", "Read Contract → verificar(hash): cualquier persona, sin billetera, comprueba el diploma."],
    ], { y: 1.9, alto: 0.76, gap: 0.1, anchoEt: 1.9, size: 12.5 });
    D.parrafo(s, "La última prueba es la que importa: cualquiera, desde cualquier computador y sin cuenta, puede comprobar el diploma. Eso es lo que se construyó hoy.", { y: 6.2, h: 0.6, size: 13, color: C.ocre });
    s.addNotes("Alternativa sin salir de Remix: el complemento 'Contract Verification' (Sourcify sin clave; Etherscan exige una clave de API). Si la verificación falla, en 9 de 10 casos es la versión del compilador o la optimización (deben ser idénticas a las del despliegue).");
  }

  {
    const s = await D.lamina({ kicker: "B.7 · la otra forma de probar", titulo: "Las pruebas automáticas del andamiaje", ic: "terminal", tituloSize: 28 });
    D.parrafo(s, "El repositorio trae 18 pruebas que definen el comportamiento correcto. Sirven como plan B si la sala bloquea Remix, y como comprobación final para todos:", { y: 1.9, h: 0.65, size: 14 });
    D.codigo(s, `cp andamiaje/s06/CertificadosUSB.sol contracts/s06/CertificadosUSB.sol
npx hardhat test test/s06/CertificadosUSB.test.js
#   con el andamiaje sin tocar:  4 passing · 14 failing
#   con los siete TODO bien:     18 passing`, { x: M, y: 2.65, w: CW, h: 1.6, lang: "js", titulo: "en la carpeta laboratorios-evm", size: 12 });
    D.dosColumnas(s,
      { et: "Cómo leer lo que falla", items: ["Cada prueba en rojo dice qué comportamiento falta.", "Resolver en orden: despliegue, emitir, revocar, cambiar emisor.", "Terminado = 18 passing."] },
      { et: "Cuidado", items: ["El cp REEMPLAZA la solución de referencia en su copia local.", "Para recuperarla: git checkout contracts/s06/CertificadosUSB.sol.", "No suban la solución a su repositorio de entrega."] },
      { y: 4.42, h: 2.4, size: 12.5 });
    s.addNotes("Resultado verificado con el andamiaje real: 4 pruebas pasan sin tocar nada (las tres de verificar que devuelven ceros y la de privacidad) y 14 fallan. En Windows sin Git Bash, copy en vez de cp (la guía trae ambas).");
  }

  {
    const s = await D.lamina({ kicker: "B.8 · errores frecuentes", titulo: "Lo que suele salir mal", ic: "bicho", tituloSize: 30 });
    D.tabla(s, ["síntoma", "causa"], [
      ["«Gas estimation failed» al emitir", "Una validación revierte: hash en cero, programa vacío, hash ya emitido o cuenta distinta del emisor."],
      ["Remix no ve la billetera", "Recargar Remix, aceptar la conexión en la billetera, mismo navegador. La billetera desbloqueada."],
      ["revocar no cambia nada", "Usaron Certificado memory c en lugar de storage: modificaron una copia."],
      ["verificar dice válido un hash nunca emitido", "Olvidaron comprobar existe."],
      ["Los certificados «desaparecieron»", "Redesplegaron: cada Deploy crea un contrato nuevo y vacío."],
      ["La verificación en el explorador falla", "Versión del compilador u optimización distinta a la del despliegue, o código distinto."],
    ], { y: 1.9, h: 4.35, colW: [4.2, 7.893], size: 11.5 });
    D.parrafo(s, "Si algo no se resuelve en 5 minutos: anotarlo, pedir ayuda y seguir con el siguiente paso.", { y: 6.35, h: 0.45, size: 13, color: C.ocre });
    s.addNotes("La guía PDF trae la tabla completa. Esta lámina queda proyectada durante el laboratorio.");
  }

  {
    const s = await D.lamina({ kicker: "B.9 · qué se entrega", titulo: "Evidencia del laboratorio 06", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["Contrato verificado", "Dirección en Sepolia con el código verificado en el explorador.", "35 %"],
      ["Tres transacciones", "Hashes de: una emisión, una revocación y un intento fallido de emitir desde otra cuenta.", "30 %"],
      ["Prueba de alteración", "Los dos hashes (original y alterado) y la captura de verificar() con cada uno.", "20 %"],
      ["Una respuesta", "¿Por qué el contrato revoca en lugar de borrar? Un párrafo.", "15 %"],
    ], { y: 1.9, h: 3.1, colW: [2.9, 7.593, 1.6], size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Cómo saber que terminaron", x: M, y: 5.25, w: CW, h: 1.5, texto: "El contrato tiene la marca verde en el explorador; la pestaña Logs muestra CertificadoEmitido y CertificadoRevocado; hay una transacción con Status Fail desde otra cuenta; y Read Contract responde false para el hash alterado.", size: 13 });
    s.addNotes("Se entrega antes de la Sesión 7 con la plantilla de la guía. Sin dirección de contrato verificable no se califica (política de laboratorios).");
  }

  await verificacion({
    kicker: "B.10 · cierre del bloque B",
    pregunta: "Revocaron un diploma por error. ¿Pueden volver a emitirlo con el mismo hash?",
    opciones: [
      "Sí: revocar lo borra y el hash queda libre.",
      "No: el registro sigue existiendo y emitir revierte con YaEmitido. Hay que emitir un documento nuevo, con otro hash.",
      "Sí, si lo hace una cuenta distinta del emisor.",
    ],
    pista: "Pruébenlo en la Remix VM antes de responder: la respuesta está en una de las 18 pruebas.",
    notas: "Respuesta: B (prueba 'un certificado revocado no se puede volver a emitir con el mismo hash'). Es una decisión de diseño discutible y buena para la Sesión 7: ¿debería existir 'reactivar'? ¿Qué se pierde y qué se gana?",
  });

  /* =============================================================== C */
  {
    const s = await D.divisor({ letra: "C", titulo: "Entrega del anteproyecto", sub: "Hoy se entrega la propuesta. La decisión más importante del semestre no es técnica: es qué queda dentro del alcance y qué queda fuera.", minutos: "APROXIMADAMENTE 30 MINUTOS", ic: "bandera" });
    s.addNotes("Plantilla y rúbrica públicas en material/proyecto/01-anteproyecto.pdf. Deck de referencia: 'Proyecto del docente · acotar el alcance'. Usar dos anteproyectos recibidos hoy como casos en vivo (con permiso del equipo).");
  }

  {
    const s = await D.lamina({ kicker: "C.1 · qué se entrega", titulo: "El anteproyecto, en tres páginas", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["sección", "qué debe responder"], [
      ["1 · Problema", "Quién sufre qué, con qué frecuencia y cuánto le cuesta. Enunciado SIN nombrar la tecnología."],
      ["2 · Usuarios", "Quiénes usan el sistema y qué hace cada uno."],
      ["3 · Por qué blockchain", "El árbol de la Sesión 1, paso por paso, y la prueba de la base de datos (C.2)."],
      ["4 · Qué va en cadena y qué no", "En especial si hay datos personales (A.17 de hoy)."],
      ["5 · Alcance", "Historias que entran, con criterio de aceptación. Lista explícita de lo que queda fuera."],
      ["6 · Arquitectura preliminar", "Contratos, interfaces y servicios externos, en un diagrama."],
      ["7 · Equipo", "Tres integrantes y el rol inicial de cada uno."],
    ], { y: 1.9, h: 4.35, colW: [3.3, 8.793], size: 12 });
    D.parrafo(s, "Máximo tres páginas. Peso: 5 % de la nota final. Plantilla, rúbrica y ejemplos en material/proyecto/01-anteproyecto.pdf.", { y: 6.35, h: 0.45, size: 12.5, color: C.ocre });
    s.addNotes("⚠ VERIFICAR ANTES DE DICTAR: el plan dice 5 % en la tabla de entregas (sección 8) pero 20 % del primer corte = 6 % en la sección 9; se usa 5 %, igual que el enunciado del proyecto del docente. El deck 'Proyecto del docente · acotar el alcance' es el ejemplo completo de cómo se ve un alcance bien hecho. La plantilla trae un ejemplo breve bien hecho y uno mal hecho: leerlos juntos en voz alta toma 5 minutos y vale la pena.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · la primera prueba", titulo: "¿Una base de datos lo resolvería?", ic: "rombo", tituloSize: 28 });
    D.tabla(s, ["paso del árbol (Sesión 1)", "si la respuesta es…", "entonces"], [
      ["1 · ¿Más de una parte escribe?", "No", "Base de datos."],
      ["2 · ¿Intereses divergentes?", "No", "Base de datos compartida con control de acceso."],
      ["3 · ¿Hay un tercero aceptable para todos?", "Sí", "Usen ese tercero."],
      ["4 · ¿Datos personales?", "Sí", "En cadena solo el hash; el dato, fuera."],
      ["5 · ¿Tolera latencia y costo por operación?", "No", "Capa 2 o arquitectura convencional."],
      ["6 · ¿Es un problema de registro o de captura?", "Captura", "La cadena no garantiza que el dato sea cierto: ¿quién lo introduce?"],
    ], { y: 1.9, h: 3.75, colW: [4.4, 2.1, 5.593], size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Lo que tiene que decir el anteproyecto", x: M, y: 5.85, w: CW, h: 0.95, texto: "Qué alternativa sin cadena de bloques consideraron, y la razón concreta por la que no basta.", size: 12.5 });
    s.addNotes("Es el árbol de A.7 de la S1, aplicado en orden estricto. La mayoría de las propuestas mueren en el paso 1 o en el 3, y eso está bien: un anteproyecto que llega a 'una base de datos basta' con buen argumento no se reprueba, se reorienta. Lo que se devuelve es el que no hizo el recorrido.");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · el filtro", titulo: "El docente aprueba, recorta o devuelve", ic: "tijera", tituloSize: 28 });
    D.tabla(s, ["decisión", "cuándo", "qué pasa después"], [
      ["Aprobado", "Problema claro, justificación sólida, alcance que cabe en el semestre.", "Se empieza a construir en la Sesión 7."],
      ["Aprobado con recorte", "Buena idea, demasiado grande. Es lo más frecuente.", "El docente marca qué historias salen. El equipo lo acepta o argumenta en 48 horas."],
      ["Devuelto", "Se enuncia desde la tecnología, una base de datos lo resolvería mejor, o hay datos personales en cadena.", "Nueva versión para la Sesión 7. No se pierde el proyecto, se pierde una semana."],
    ], { y: 1.9, h: 3.0, colW: [2.6, 4.9, 4.593], size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Las tres preguntas que se aplican primero", x: M, y: 5.1, w: CW, h: 1.65, texto: "¿Se puede enunciar el problema sin nombrar la tecnología? ¿Qué alternativa sin cadena de bloques se consideró? ¿Cabe el alcance —lo que entra y lo que no— en una página? Si alguna respuesta es no, el anteproyecto vuelve.", size: 13.5 });
    s.addNotes("Coherente con el plan (sección 12, 'proyectos sobredimensionados': filtro de alcance en el anteproyecto) y con el deck del docente ('cabe en una lámina; si no cupiera, todavía no estaría decidido').");
  }

  {
    const s = await D.lamina({ kicker: "C.4 · cómo se califica", titulo: "La rúbrica del anteproyecto", ic: "balanza", tituloSize: 29 });
    D.tabla(s, ["criterio", "peso", "lo que distingue un 5,0"], [
      ["Problema y usuarios", "20 %", "Se enuncia sin la tecnología, con un caso concreto: quién, qué, cuánto le cuesta."],
      ["Por qué blockchain", "30 %", "Recorre los seis pasos y descarta la alternativa centralizada con un argumento propio."],
      ["Qué va en cadena", "10 %", "Separa dato y hash; nada personal en cadena; dice quién introduce cada dato."],
      ["Alcance", "25 %", "4 a 6 historias con criterio de aceptación, lista de fuera y el supuesto más riesgoso."],
      ["Arquitectura y equipo", "15 %", "Diagrama coherente con las historias; tres roles con responsable."],
    ], { y: 1.9, h: 3.6, colW: [3.0, 1.2, 7.893], size: 12 });
    D.parrafo(s, "Devolución automática, sin importar el puntaje: datos personales en cadena, más de tres páginas, o ninguna lista de lo que queda fuera.", { y: 5.7, h: 0.6, size: 13.5, color: C.rojo, bold: true });
    s.addNotes("La rúbrica completa con los niveles 5,0 · 3,5 · menos de 3,0 está en material/proyecto/01-anteproyecto.pdf. Pesa más la justificación que la arquitectura: a estas alturas del semestre, decidir bien importa más que dibujar bien.");
  }

  {
    const s = await D.lamina({ kicker: "C.5 · dos ejemplos, en una línea cada uno", titulo: "El mismo tema, bien y mal planteado", ic: "equis", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "Mal planteado", linea: C.rojo, color: C.rojo, items: ["«Plataforma blockchain para historias clínicas de todas las EPS de Colombia.»", "Nombra la tecnología en el problema.", "Un solo escritor por historia: una base de datos basta.", "Datos de salud en cadena: choca con la Ley 1581.", "Sin lista de lo que queda fuera."] },
      { et: "Bien planteado", items: ["«Tres semilleros de universidades distintas manejan un fondo común y ninguno acepta que otro lo administre solo.»", "Varios escritores con intereses divergentes, sin tercero aceptable.", "En cadena: montos y aprobaciones. Fuera: facturas y nombres.", "Fuera de alcance: pagos en pesos, app móvil."] },
      { y: 1.9, h: 4.1, size: 12.5 });
    D.parrafo(s, "Los dos ejemplos completos, desarrollados sección por sección, están en la plantilla.", { y: 6.2, h: 0.55, size: 13, color: C.ocre });
    s.addNotes("Pedir a la sala que diga en qué paso del árbol muere el ejemplo de la izquierda (paso 1: un solo escritor por historia; y el 4, por los datos). El de la derecha sobrevive, pero la plantilla muestra su límite honesto: la cadena no sabe si la factura es real (paso 6).");
  }

  await D.preguntaSemana({
    pregunta: "El contrato confía en una sola cuenta. Si roban esa clave, ¿qué puede hacer el ladrón, qué no, y cómo lo diseñarían para limitar el daño?",
    trabajo: [
      "Entregar la evidencia del laboratorio 06 antes de la Sesión 7.",
      "Completar las lecciones 1 y 2 de CryptoZombies.",
      "Leer en la documentación de Solidity las secciones sobre mapping y struct: son la base de la Sesión 7.",
      "Esperar la respuesta del docente sobre el anteproyecto y, si hay recorte, aceptarlo o argumentar en 48 horas.",
    ],
    notas: "La pregunta prepara el patrón multifirma (Sesión 15) y el control de acceso por roles. Respuesta mínima: puede emitir diplomas falsos y revocar legítimos, y hasta quedarse con el rol llamando a cambiarEmisor; no puede alterar la historia registrada ni borrar eventos. La revocación de los falsos deja rastro.",
  });

  {
    const s = await D.cierre({
      frase: "Hoy desplegaron un programa que ya no pueden cambiar. Por eso se valida todo antes de desplegar.",
      sub: "Solidity se aprende rápido. Lo difícil es acostumbrarse a que no hay parche posible: la próxima sesión empieza a construir con patrones que existen justamente por eso.",
      proxima: "Sesión 7 · Solidity II · estructuras de datos y patrones de diseño",
    });
    s.addNotes("Anunciar el plazo de respuesta a los anteproyectos (antes de la Sesión 7) y recordar que el trabajo autónomo de la S7 es refactorizar este mismo contrato con dos patrones.");
  }

  return D.guardar(path.join(__dirname, "Sesion-06-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
