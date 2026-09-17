/* =====================================================================
   Sesión 06 · Solidity I · fundamentos del contrato inteligente
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 06 · SOLIDITY I · FUNDAMENTOS", titulo: "Sesión 06 · Solidity I" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 06 · UNIDAD II · ETHEREUM Y CONTRATOS",
    titulo: "SOLIDITY I\nEL PRIMER\nCONTRATO",
    sub: "Hoy escriben un programa que, una vez desplegado, nadie puede cambiar. Ni siquiera ustedes.",
    palabra: "DESPLEGAR",
    ic: "codigo",
    notas: "Primera sesión de programación. Ritmo lento en el bloque A: casi todo lo que sigue en el curso depende de esta base.",
  });

  await D.agenda({
    intro: "La sesión más práctica hasta ahora: al salir, cada pareja tiene un contrato propio desplegado en una red pública.",
    bloques: [
      ["A", "EL LENGUAJE", "Estructura, tipos, funciones, visibilidad, errores, eventos y modificadores.", "~70 min"],
      ["B", "LABORATORIO 06 · REMIX", "Registro de certificados: completar, probar, desplegar en Sepolia.", "~80 min"],
      ["C", "ENTREGA DEL ANTEPROYECTO", "Qué se entrega hoy y cómo se filtra el alcance.", "~30 min"],
    ],
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
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "El lenguaje", sub: "Solidity se parece a JavaScript en la sintaxis y a nada conocido en las consecuencias: cada línea se paga y ninguna se puede corregir después.", minutos: "APROXIMADAMENTE 70 MINUTOS", ic: "codigo" });

  {
    const s = await D.lamina({ kicker: "A.1 · antes de escribir", titulo: "Ni inteligente, ni contrato", ic: "termino", tituloSize: 30 });
    D.parrafo(s, "El término lo acuñó Nick Szabo en los años noventa. Hoy describe algo más modesto y más preciso:", { y: 1.9, h: 0.5, size: 14.5 });
    D.enunciado(s, "Un contrato inteligente es un programa desplegado en la cadena, con dirección propia, que se ejecuta exactamente como fue escrito cuando alguien lo llama.", { y: 2.55, h: 1.45, size: 19, line: C.naranja });
    D.dosColumnas(s,
      { et: "No es inteligente", texto: "No interpreta intenciones ni corrige errores. Si el código dice algo que el autor no quería, se ejecuta lo que dice el código. Varios de los robos más grandes de la historia fueron código funcionando exactamente como estaba escrito." },
      { et: "No es un contrato jurídico", texto: "Puede automatizar el cumplimiento de un acuerdo, pero no es por sí mismo un contrato ante la ley. Su validez jurídica en Colombia se discute en la Sesión 16." },
      { y: 4.2, h: 2.5, size: 12.5 });
    s.addNotes("Szabo, N. (1994/1996), Smart Contracts. La confusión con 'contrato jurídico' aparece en casi todos los anteproyectos: desactivarla hoy.");
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
  }

  {
    const s = await D.lamina({ kicker: "A.3 · la versión del compilador", titulo: "pragma: fijar con quién se compila", ic: "candado", tituloSize: 28 });
    D.tabla(s, ["escritura", "qué acepta", "cuándo usarla"], [
      ["pragma solidity 0.8.28;", "Solo 0.8.28.", "Contratos que se despliegan: el bytecode verificado debe ser reproducible."],
      ["pragma solidity ^0.8.28;", "0.8.28 o superior, dentro de 0.8.x.", "Bibliotecas y material que se reutiliza. Es la que usamos en clase."],
      ["pragma solidity >=0.8.0 <0.9.0;", "Todo el rango indicado.", "Código que otros compilarán con versiones distintas."],
    ], { y: 1.9, h: 2.5, colW: [3.9, 3.3, 4.893], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Por qué importa la 0.8", x: M, y: 4.65, w: CW, h: 1.35, texto: "Desde la versión 0.8.0, una suma que se desborda revierte automáticamente. Antes daba la vuelta en silencio: 255 + 1 en un uint8 daba 0. Ese cambio eliminó una familia entera de robos, como veremos en la Sesión 9.", size: 13 });
    D.parrafo(s, "El compilador que eligen hoy queda grabado para siempre en el contrato desplegado: no hay «actualizar dependencias».", { y: 6.2, h: 0.55, size: 13, color: C.ocre });
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
  }

  {
    const s = await D.lamina({ kicker: "A.5 · dónde vive cada variable", titulo: "Variables de estado y variables locales", ic: "capas", tituloSize: 27 });
    D.codigo(s, `contract Tienda {
    uint256 public ventas;          // ESTADO · storage · persiste

    function vender(uint256 precio) external {
        uint256 conIva = precio * 119 / 100;  // LOCAL · desaparece
        ventas += conIva;                     // escritura en storage
    }
}`, { x: M, y: 1.9, w: CW, h: 2.6, lang: "sol", size: 12.5 });
    D.dosColumnas(s,
      { et: "Estado", items: ["Declarada fuera de las funciones.", "Vive en storage: la cadena la recuerda para siempre.", "Cada escritura nueva: unos 22 000 de gas."] },
      { et: "Local", items: ["Declarada dentro de una función.", "Vive en la pila o en memory: se borra al terminar.", "Casi gratis."] },
      { y: 4.7, h: 2.0, size: 12.5 });
    s.addNotes("Observen el orden de la multiplicación: precio * 119 / 100. Al revés, precio / 100 * 119 pierde los decimales antes de multiplicar. Sin punto flotante, el orden de las operaciones es parte de la corrección.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · quién puede llamar", titulo: "Visibilidad: cuatro palabras, cuatro fronteras", ic: "llave", tituloSize: 26 });
    D.tabla(s, ["visibilidad", "desde fuera", "desde este contrato", "desde un hijo"], [
      ["public", "Sí", "Sí", "Sí"],
      ["external", "Sí", "Solo con this.funcion()", "No directamente"],
      ["internal", "No", "Sí", "Sí"],
      ["private", "No", "Sí", "No"],
    ], { y: 1.9, h: 2.4, colW: [2.6, 2.6, 3.9, 2.993], size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "private NO significa secreto", x: M, y: 4.55, w: CW, h: 1.45, texto: "private solo impide que OTROS CONTRATOS la lean. Cualquier persona puede leer el storage completo de cualquier contrato con una llamada al nodo. Guardar una contraseña en una variable private es publicarla.", size: 13.5 });
    D.parrafo(s, "Una variable de estado public genera automáticamente una función de lectura con su nombre. Por eso se puede consultar emisor() en el laboratorio sin haberla escrito.", { y: 6.2, h: 0.58, size: 12.5 });
    s.addNotes("Demostración opcional: ethers.provider.getStorage(direccion, 0) lee la ranura 0 de cualquier contrato, private o no.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · qué hace la función con el estado", titulo: "view, pure y payable", ic: "gas", tituloSize: 30 });
    D.tabla(s, ["modificador", "lee estado", "cambia estado", "recibe ETH", "costo si se llama desde fuera"], [
      ["(ninguno)", "Sí", "Sí", "No", "Transacción: cuesta gas."],
      ["view", "Sí", "No", "No", "Llamada gratuita al nodo."],
      ["pure", "No", "No", "No", "Llamada gratuita al nodo."],
      ["payable", "Sí", "Sí", "Sí", "Transacción: cuesta gas."],
    ], { y: 1.9, h: 2.4, colW: [2.2, 1.8, 2.1, 1.9, 4.093], size: 12 });
    D.parrafo(s, "«Gratuita» tiene letra pequeña:", { y: 4.5, h: 0.4, size: 14, bold: true, color: C.tinta });
    D.lista(s, [
      "Es gratis cuando una aplicación la consulta directamente a un nodo: no se crea transacción.",
      "Si otro contrato la llama dentro de una transacción, el gas se paga igual.",
      "Una función sin payable que recibe ETH revierte: es una protección, no un descuido.",
    ], { y: 4.95, h: 1.8, size: 13, gap: 6 });
  }

  {
    const s = await D.lamina({ kicker: "A.8 · lo que el contrato sabe del mundo", titulo: "Variables globales", ic: "mundo", tituloSize: 30 });
    D.tabla(s, ["variable", "qué contiene", "cuidado"], [
      ["msg.sender", "Quién llamó directamente a esta función.", "Si un contrato llama a otro, es el contrato intermediario, no la persona."],
      ["msg.value", "Cuántos wei vinieron con la llamada.", "Solo tiene sentido en funciones payable."],
      ["block.timestamp", "Marca de tiempo del bloque, en segundos.", "La elige el proponente del bloque dentro de un margen pequeño: no sirve para decisiones al segundo."],
      ["block.number", "Altura del bloque.", "No es una medida exacta de tiempo."],
      ["tx.origin", "La cuenta externa que firmó la transacción original.", "NUNCA para control de acceso. Es una vulnerabilidad clásica (Sesión 9)."],
    ], { y: 1.9, h: 4.1, colW: [2.4, 4.3, 5.393], size: 11.5 });
    D.parrafo(s, "Lo que NO hay: la hora real, archivos, internet, números aleatorios. Todo lo que el contrato sabe está en la cadena o viene en la llamada.", { y: 6.15, h: 0.6, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.9 · fallar bien", titulo: "require, revert, errores personalizados y assert", ic: "alerta", tituloSize: 24 });
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
    s.addNotes("En el laboratorio se usan solo errores personalizados: es la práctica actual de OpenZeppelin v5.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · contarle al mundo lo que pasó", titulo: "Eventos", ic: "red", tituloSize: 31 });
    D.codigo(s, `event CertificadoEmitido(bytes32 indexed hashDocumento, string programa, uint64 fecha);

emit CertificadoEmitido(hashDocumento, programa, ahora);`, { x: M, y: 1.9, w: CW, h: 1.2, lang: "sol", size: 12 });
    D.dosColumnas(s,
      { et: "Por qué existen", items: ["Son la forma barata de dejar constancia: la mitad que escribir en storage (medido en la Sesión 5).", "Las aplicaciones se suscriben a ellos para actualizarse sin consultar todo el tiempo.", "Quedan en el recibo de la transacción, para siempre."] },
      { et: "Lo que no pueden hacer", items: ["Otro contrato NO puede leer un evento. Si la lógica lo necesita, va en storage.", "Hasta 3 parámetros indexed: son los que se pueden filtrar rápido.", "Un evento no prueba nada por sí mismo si el contrato que lo emite no es el esperado."] },
      { y: 3.3, h: 2.75, size: 12.5 });
    D.parrafo(s, "Regla práctica: toda función que cambia el estado emite un evento. Sin evento, la interfaz de la Sesión 12 no se entera.", { y: 6.2, h: 0.55, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.11 · inicializar y proteger", titulo: "Constructor y modificadores", ic: "escudo", tituloSize: 29 });
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
  }

  {
    const s = await D.lamina({ kicker: "A.12 · vista previa de la Sesión 7", titulo: "El mapping que necesitamos hoy", ic: "rejilla", tituloSize: 28 });
    D.parrafo(s, "El laboratorio necesita buscar un certificado por su hash. Para eso existe el mapping: una tabla de pares clave → valor. Hoy basta con usarlo; la Sesión 7 lo estudia a fondo.", { y: 1.9, h: 0.95, size: 14.5 });
    D.codigo(s, `mapping(bytes32 => Certificado) private _certificados;

_certificados[hash] = Certificado({ programa: p, fechaEmision: t, revocado: false, existe: true });

Certificado storage c = _certificados[hash];   // referencia: los cambios se guardan`, { x: M, y: 3.0, w: CW, h: 1.75, lang: "sol", size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Lo único que hay que saber hoy", x: M, y: 5.0, w: CW, h: 1.7, texto: "Toda clave existe: si nunca se escribió, devuelve el valor por defecto (ceros, falso, texto vacío). Por eso el certificado lleva el campo «existe»: sin él, no se distingue un certificado que nunca se emitió de uno emitido con datos vacíos.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.13 · la decisión de diseño del laboratorio", titulo: "Lo que nunca va a una cadena pública", ic: "candado", tituloSize: 27 });
    D.parrafo(s, "La tentación es guardar el nombre del graduado, su cédula y su programa. Parece útil. Es un error grave, y no técnico: jurídico.", { y: 1.9, h: 0.62, size: 14.5 });
    D.dosColumnas(s,
      { et: "El choque", linea: C.rojo, color: C.rojo, texto: "La Ley Estatutaria 1581 de 2012 de protección de datos personales da a toda persona derecho a conocer, actualizar, rectificar y pedir la supresión de sus datos. Una cadena pública es inmutable: lo escrito no se puede suprimir." },
      { et: "La salida", texto: "En la cadena va solo el HASH del archivo del diploma. Quien tiene el PDF calcula el hash y verifica. Quien no lo tiene no aprende nada: un hash no identifica a una persona por sí solo." },
      { y: 2.7, h: 2.55, size: 13 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Regla para el anteproyecto", x: M, y: 5.45, w: CW, h: 1.28, texto: "Si su proyecto maneja datos de personas, el anteproyecto tiene que decir explícitamente qué va en la cadena, qué va fuera y por qué. Un proyecto que guarde datos personales en cadena no se aprueba.", size: 13 });
    s.addNotes("Matiz para quien pregunte: incluso un hash puede ser dato personal si es fácil de asociar (por ejemplo, el hash de una cédula, que se puede adivinar por fuerza bruta). Por eso se hashea el archivo completo del diploma, no un identificador corto.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · el contrato del laboratorio · 1 de 2", titulo: "Emitir: validar, guardar, avisar", ic: "codigo", tituloSize: 28 });
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
  }

  {
    const s = await D.lamina({ kicker: "A.15 · el contrato del laboratorio · 2 de 2", titulo: "Revocar sin borrar, verificar sin pagar", ic: "codigo", tituloSize: 26 });
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
  }

  {
    const s = await D.lamina({ kicker: "A.16 · lo que hay que llevarse del bloque A", titulo: "Seis ideas antes de abrir Remix", ic: "lista", tituloSize: 29 });
    const ideas = [
      "Un contrato hace exactamente lo que dice su código, aunque no sea lo que quería su autor.",
      "private impide que otros contratos lean; no impide que las personas lean.",
      "Validar todo antes de cambiar el estado, y fallar con errores que digan por qué.",
      "Toda función que cambia el estado emite un evento.",
      "Un modificador olvidado en una sola función abre la puerta entera.",
      "En una cadena pública no van datos personales: va su hash.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14.5, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Laboratorio 06 · Remix", sub: "Completar el registro de certificados, probarlo en la máquina virtual del navegador y desplegarlo en Sepolia.", minutos: "APROXIMADAMENTE 80 MINUTOS · EN PAREJAS", ic: "martillo" });

  {
    const s = await D.lamina({ kicker: "B.1 · 10 minutos", titulo: "Preparar Remix", ic: "pantalla", tituloSize: 31 });
    D.pasos(s, [
      ["ABRIR", "Ir a remix.ethereum.org en el navegador donde está instalada la billetera."],
      ["CREAR ARCHIVO", "En el explorador de archivos, crear CertificadosUSB.sol y pegar el andamiaje: andamiaje/s06/CertificadosUSB.sol."],
      ["COMPILADOR", "En la pestaña Solidity Compiler, elegir la versión 0.8.28 y activar la optimización."],
      ["COMPILAR", "Compilar. Tiene que compilar sin errores ANTES de escribir nada: el andamiaje está hecho para eso."],
    ], { y: 1.9, alto: 0.82, gap: 0.14, anchoEt: 2.5, size: 13 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Si la sala bloquea Remix", x: M, y: 5.8, w: CW, h: 0.96, texto: "Plan B: el mismo contrato en el repositorio del curso con Hardhat. Guía en laboratorios-evm/guias/s06.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · 40 minutos", titulo: "Completar los siete TODO", ic: "codigo", tituloSize: 30 });
    D.tabla(s, ["TODO", "qué hacer", "cómo probarlo en la Remix VM"], [
      ["1 · modificador", "Revertir si quien llama no es el emisor.", "Cambiar de cuenta en Remix e intentar emitir: debe fallar."],
      ["2 · constructor", "Guardar al emisor.", "Consultar emisor(): debe ser la cuenta que desplegó."],
      ["3 y 4 · emitir", "Validar, guardar, contar y emitir el evento.", "Emitir un hash de prueba y consultar emitidos()."],
      ["5 · revocar", "Validar existencia y estado, revocar.", "Revocar dos veces: la segunda debe fallar."],
      ["6 · verificar", "Devolver válido = existe y no revocado.", "Verificar antes y después de revocar."],
      ["7 · cambiar emisor", "Rechazar la dirección cero y traspasar.", "Traspasar a otra cuenta y comprobar que la anterior ya no puede emitir."],
    ], { y: 1.9, h: 4.2, colW: [2.3, 4.2, 5.593], size: 11.5 });
    D.parrafo(s, "Después de cada TODO: compilar, desplegar de nuevo en la Remix VM y probar a mano. Avanzar de uno en uno ahorra la mitad del tiempo de depuración.", { y: 6.25, h: 0.55, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "B.3 · el dato que se registra", titulo: "Calcular el hash del diploma", ic: "documento", tituloSize: 30 });
    D.parrafo(s, "Cada pareja usa un PDF cualquiera como «diploma» —un documento propio de prueba, nunca uno real con datos personales— y calcula su hash con el script del repositorio:", { y: 1.9, h: 0.95, size: 14 });
    D.codigo(s, `node scripts/s06/hash-documento.js mi-diploma-de-prueba.pdf

  archivo : mi-diploma-de-prueba.pdf
  tamaño  : 48.213 bytes
  keccak  : 0x1c3c4078e3a4d1c6f0b1fc78d1924bb9ca55d997da9fa621cc1eced16ce1b538`, { x: M, y: 3.0, w: CW, h: 1.75, lang: "js", size: 12 });
    D.pasos(s, [
      ["EMITIR", "Pegar ese valor como hashDocumento en emitir()."],
      ["ALTERAR", "Editar el PDF, guardarlo y volver a calcular el hash: cambió por completo (Sesión 2)."],
      ["VERIFICAR", "verificar() con el hash nuevo: no es válido. Esa es la garantía que ofrece el sistema."],
    ], { y: 4.95, alto: 0.54, gap: 0.08, anchoEt: 1.9, size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.4 · 15 minutos", titulo: "Desplegar en Sepolia", ic: "cohete", tituloSize: 31 });
    D.pasos(s, [
      ["ENTORNO", "En Deploy & Run, cambiar Environment de «Remix VM» a «Injected Provider – MetaMask»."],
      ["RED", "Confirmar en la billetera que la red es Sepolia. Remix muestra el identificador 11155111."],
      ["DESPLEGAR", "Deploy. La billetera muestra la transacción: revisar red, costo y que no hay valor enviado. Confirmar."],
      ["ESPERAR", "Unos segundos. Remix muestra la dirección del contrato: copiarla."],
      ["USAR", "Emitir el hash del diploma de prueba desde Remix. Confirmar en la billetera."],
    ], { y: 1.9, alto: 0.7, gap: 0.1, anchoEt: 2.2, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Antes de confirmar cualquier firma", x: M, y: 5.86, w: CW, h: 0.92, texto: "Leer qué red, a qué dirección y cuánto. No se firma nada cuyo contenido no se entienda.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.5 · 15 minutos", titulo: "Ver y verificar en el explorador", ic: "lupa", tituloSize: 29 });
    D.pasos(s, [
      ["BUSCAR", "Pegar la dirección del contrato en sepolia.etherscan.io. Ver la transacción de creación y la de emisión."],
      ["LOGS", "Abrir la emisión, pestaña Logs: ahí está CertificadoEmitido con el hash indexado."],
      ["VERIFICAR CÓDIGO", "Pestaña Contract → Verify and Publish. Compilador 0.8.28, optimización activa, licencia MIT, pegar el código."],
      ["LEER", "Con el código verificado aparece Read Contract: llamar verificar() desde el explorador, sin billetera."],
    ], { y: 1.9, alto: 0.88, gap: 0.14, anchoEt: 2.7, size: 12.5 });
    D.parrafo(s, "La última prueba es la que importa: cualquier persona, desde cualquier computador y sin cuenta, puede comprobar el diploma. Eso es lo que se construyó hoy.", { y: 6.0, h: 0.75, size: 13.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "B.6 · qué se entrega", titulo: "Evidencia del laboratorio 06", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["Contrato verificado", "Dirección en Sepolia con el código verificado en el explorador.", "35 %"],
      ["Tres transacciones", "Hashes de: una emisión, una revocación y un intento fallido de emitir desde otra cuenta.", "30 %"],
      ["Prueba de alteración", "Los dos hashes (original y alterado) y la captura de verificar() con cada uno.", "20 %"],
      ["Una respuesta", "¿Por qué el contrato revoca en lugar de borrar? Un párrafo.", "15 %"],
    ], { y: 1.9, h: 3.1, colW: [2.9, 7.593, 1.6], size: 12 });
    D.tabla(s, ["si pasa esto", "revisar"], [
      ["«Gas estimation failed» al emitir", "Una validación está revirtiendo: hash en cero, programa vacío o cuenta distinta al emisor."],
      ["Remix no ve la billetera", "Recargar Remix y aceptar la conexión en la billetera. Revisar que el navegador sea el mismo."],
      ["La verificación en el explorador falla", "Versión del compilador u optimización distinta a la usada al desplegar."],
    ], { y: 5.2, h: 1.55, colW: [3.9, 8.193], size: 10.5 });
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "Entrega del anteproyecto", sub: "Hoy se entrega la propuesta. La decisión más importante del semestre no es técnica: es qué queda dentro del alcance y qué queda fuera.", minutos: "APROXIMADAMENTE 30 MINUTOS", ic: "bandera" });

  {
    const s = await D.lamina({ kicker: "C.1 · qué se entrega", titulo: "El anteproyecto, en tres páginas", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["sección", "qué debe responder"], [
      ["Problema", "Quién sufre qué, con qué frecuencia y cuánto le cuesta. Enunciado SIN nombrar la tecnología."],
      ["Usuarios", "Quiénes usan el sistema y qué hace cada uno."],
      ["Por qué blockchain", "Las cinco preguntas de la Sesión 4. Qué alternativa centralizada se descartó y por qué."],
      ["Qué va en cadena y qué no", "En especial si hay datos personales (A.13 de hoy)."],
      ["Alcance", "Historias de usuario que entran. Lista explícita de lo que queda fuera."],
      ["Arquitectura preliminar", "Contratos, interfaz y servicios externos, en un diagrama."],
      ["Equipo", "Tres integrantes y rol inicial de cada uno."],
    ], { y: 1.9, h: 4.35, colW: [3.0, 9.093], size: 12 });
    D.parrafo(s, "Máximo tres páginas. Peso: 5 % de la nota final y 20 % del primer corte.", { y: 6.35, h: 0.45, size: 13, color: C.ocre });
    s.addNotes("El deck 'Proyecto del docente · acotar el alcance' es el ejemplo completo de cómo se ve un alcance bien hecho.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · el filtro", titulo: "El docente aprueba, recorta o devuelve", ic: "tijera", tituloSize: 28 });
    D.tabla(s, ["decisión", "cuándo", "qué pasa después"], [
      ["Aprobado", "Problema claro, justificación sólida, alcance que cabe en el semestre.", "Se empieza a construir en la Sesión 7."],
      ["Aprobado con recorte", "Buena idea, demasiado grande. Es lo más frecuente.", "El docente marca qué historias salen. El equipo lo acepta o argumenta en 48 horas."],
      ["Devuelto", "Se enuncia desde la tecnología, o una base de datos lo resolvería mejor.", "Nueva versión para la Sesión 7. No se pierde el proyecto, se pierde una semana."],
    ], { y: 1.9, h: 2.9, colW: [2.6, 4.9, 4.593], size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La prueba que se aplica primero", x: M, y: 5.05, w: CW, h: 1.65, texto: "¿Se puede enunciar el problema sin nombrar la tecnología? ¿Qué alternativa sin cadena de bloques se consideró? ¿Cabe el alcance en una lámina? Si alguna respuesta es no, el anteproyecto vuelve.", size: 13.5 });
  }

  await D.preguntaSemana({
    pregunta: "El contrato confía en una sola cuenta. Si roban esa clave, ¿qué puede hacer el ladrón, qué no, y cómo lo diseñarían para limitar el daño?",
    trabajo: [
      "Entregar la evidencia del laboratorio 06.",
      "Completar las lecciones 1 y 2 de CryptoZombies.",
      "Leer en la documentación de Solidity las secciones sobre mapping y struct: son la base de la Sesión 7.",
      "Esperar la respuesta del docente sobre el anteproyecto y, si hay recorte, aceptarlo o argumentar en 48 horas.",
    ],
    notas: "La pregunta prepara el patrón multifirma (Sesión 15) y el control de acceso por roles. Respuesta mínima: puede emitir diplomas falsos y revocar legítimos; no puede alterar la historia registrada.",
  });

  await D.cierre({
    frase: "Hoy desplegaron un programa que ya no pueden cambiar. Por eso se valida todo antes de desplegar.",
    sub: "Solidity se aprende rápido. Lo difícil es acostumbrarse a que no hay parche posible: la próxima sesión empieza a construir con patrones que existen justamente por eso.",
    proxima: "Sesión 7 · Solidity II · estructuras de datos y patrones de diseño",
  });

  return D.guardar(path.join(__dirname, "Sesion-06-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
