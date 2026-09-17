/* =====================================================================
   Sesión 15 · DAOs, gobernanza e identidad descentralizada
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 15 · DAOS, GOBERNANZA E IDENTIDAD", titulo: "Sesión 15 · DAOs e identidad" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 15 · UNIDAD IV · ECOSISTEMA",
    titulo: "¿QUIÉN MANDA\nCUANDO NO\nHAY DUEÑO?",
    sub: "Gobernar un sistema sin jefe: propuestas, votos y ejecución en el código. Y quién eres tú, en una cadena.",
    palabra: "GOBERNAR",
    ic: "voto",
    notas: "Objetivo doble: implementar gobernanza on-chain real (lab) y discutir con honestidad la identidad descentralizada. Aquí se plantea el ensayo.",
  });

  await D.agenda({
    intro: "De la banca sin banco a la organización sin jefe. Y una conversación difícil: qué significa tu identidad cuando vive en una cadena pública.",
    bloques: [
      ["A", "DAOS E IDENTIDAD", "Multisig, gobernanza on-chain, modelos de voto, sus fallas, e identidad descentralizada.", "~70 min"],
      ["B", "LABORATORIO 15", "Desplegar un gobierno completo: proponer, votar, ejecutar. Y un multisig.", "~80 min"],
      ["C", "EL ENSAYO (RA7)", "Se plantea el ensayo individual sobre el contexto colombiano.", "~30 min"],
    ],
  });

  await D.objetivo({
    objetivo: "Implementar un mecanismo de gobernanza on-chain y evaluar críticamente los modelos de identidad descentralizada.",
    preguntas: [
      "¿Cuándo un multisig es la respuesta correcta y cuándo hace falta más?",
      "¿Cómo pasa una propuesta de una idea a una ejecución automática?",
      "¿Qué falla en «un token, un voto», y cómo se ataca una votación?",
      "¿Qué tensión hay entre identidad on-chain y el derecho al olvido?",
    ],
    ra: "RA2 · arquitecturas de gobernanza  ·  RA3 · Governor  ·  RA7 · identidad y ética.",
  });

  await D.glosario({
    items: [
      ["DAO", "Decentralized Autonomous Organization", "Organización cuyas reglas viven en contratos y cuyas decisiones toman sus miembros, sin jefe único."],
      ["Multisig", "multifirma", "Una cuenta que exige m de n firmas para actuar. La forma más simple y sólida de gobierno compartido."],
      ["Governor", "contrato de gobierno", "El contrato de OpenZeppelin que gestiona propuestas, votación y ejecución."],
      ["Quórum", "quorum", "El mínimo de poder de voto que debe participar para que una decisión sea válida."],
      ["Timelock", "retardo temporal", "Un plazo obligatorio entre aprobar y ejecutar, para que quien no esté de acuerdo pueda salir."],
      ["Delegación", "delegation", "Ceder tu poder de voto a otra cuenta, sin ceder tus tokens."],
      ["DID", "Decentralized Identifier", "Un identificador de identidad que su dueño controla, no una plataforma."],
      ["SBT", "Soulbound Token", "Token no transferible atado a una cuenta: para credenciales y reputación (Sesión 11)."],
    ],
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "DAOs e identidad", sub: "Gobernar sin jefe suena utópico. En la práctica es un espectro que va del multisig sencillo a la votación on-chain completa, cada uno con sus grietas.", minutos: "APROXIMADAMENTE 70 MINUTOS", ic: "voto" });

  {
    const s = await D.lamina({ kicker: "A.1 · qué es una DAO", titulo: "Un espectro, no una cosa", ic: "capas", tituloSize: 29 });
    D.parrafo(s, "«DAO» se usa para cosas muy distintas. Es útil verlo como un espectro entre dos extremos, y saber que casi todas las buenas viven cerca del extremo simple.", { y: 1.9, h: 0.9, size: 14.5 });
    D.nodo(s, { x: M, y: 3.0, w: 4.0, h: 1.2, titulo: "MULTISIG CON MARCA", sub: "unos pocos firmantes\ndeciden. Simple y sólido.", fill: C.blanco, line: C.violeta, subSize: 11 });
    D.flecha(s, M + 4.2, 3.6, M + 7.6, 3.6, C.tinta, 2);
    D.nodo(s, { x: M + 7.8, y: 3.0, w: CW - 7.8, h: 1.2, titulo: "GOBERNANZA ON-CHAIN PLENA", sub: "propuestas y votos de\nmiles, ejecutados solos.", fill: C.blanco, line: C.naranja, subSize: 11 });
    D.parrafo(s, "A la izquierda: rápido, entendible, pero concentrado. A la derecha: descentralizado de verdad, pero lento, complejo y con sus propios ataques. La madurez es elegir el punto correcto para cada momento.", { y: 4.55, h: 0.95, size: 13.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "El consejo que sorprende", x: M, y: 5.55, w: CW, h: 1.15, texto: "Casi siempre, al principio, un multisig es lo correcto. La gobernanza on-chain plena tiene sentido con una comunidad grande y real que gobernar, no antes.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.2 · multisig", titulo: "m de n: la pieza más sólida", ic: "llave", tituloSize: 29 });
    D.parrafo(s, "Una cuenta multifirma exige que m de n personas firmen para que una transacción se ejecute. Un 2 de 3, un 3 de 5. Simple, auditado, y suficiente para la mayoría de los casos.", { y: 1.9, h: 0.9, size: 14.5 });
    D.dosColumnas(s,
      { et: "Por qué es tan buena", items: ["Elimina el punto único de falla de un solo dueño (Sesión 6).", "Si roban una clave, no basta: hacen falta m.", "Safe es el estándar, muy probado, con buena interfaz.", "Fácil de entender para todos los firmantes."] },
      { et: "Sus límites", items: ["No escala a miles de miembros: es para un grupo pequeño.", "Los firmantes son conocidos: no es anónimo ni abierto.", "Coordinar m firmas puede ser lento en una urgencia."] },
      { y: 3.0, h: 2.5, size: 12.5 });
    D.parrafo(s, "Es la respuesta a la pregunta de la semana de la Sesión 6: cómo dejar de depender de una sola clave.", { y: 5.65, h: 0.55, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.3 · gobernanza on-chain", titulo: "El ciclo de una propuesta", ic: "voto", tituloSize: 29 });
    D.pasos(s, [
      ["PROPONER", "Alguien con suficiente poder de voto presenta una propuesta: «liberar 2 ETH de la tesorería al semillero»."],
      ["RETRASO", "Un plazo antes de que abra la votación, para que todos se enteren."],
      ["VOTAR", "Durante un periodo, cada quien vota a favor, en contra o se abstiene, con el peso de sus tokens."],
      ["QUÓRUM Y MAYORÍA", "Si participa el quórum mínimo y ganan los votos a favor, la propuesta pasa."],
      ["TIMELOCK", "Un plazo antes de ejecutar: quien no esté de acuerdo puede retirarse a tiempo."],
      ["EJECUTAR", "Cualquiera dispara la ejecución. El contrato hace lo aprobado, sin intermediarios."],
    ], { y: 1.9, alto: 0.72, gap: 0.1, anchoEt: 2.4, size: 12 });
    D.parrafo(s, "Lo notable: nadie «ejecuta la decisión» a mano. El código hace lo que la propuesta decía, exacto. Es el laboratorio de hoy.", { y: 6.4, h: 0.4, size: 12, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.4 · el poder de voto", titulo: "Por qué hay que delegarse el voto", ic: "termino", tituloSize: 27 });
    D.parrafo(s, "Un detalle que confunde a todos: tener tokens de gobierno no basta para votar. Hay que DELEGAR el voto —a uno mismo o a otro— para que cuente.", { y: 1.9, h: 0.9, size: 14.5 });
    D.definicion(s, "getVotes(ana) = 0   →   ana.delegate(ana)   →   getVotes(ana) = su saldo", { x: M, y: 3.0, w: CW, h: 0.65, size: 12 });
    D.dosColumnas(s,
      { et: "Por qué existe la delegación", texto: "Registrar el poder de voto en cada momento tiene un costo (los checkpoints). Exigir delegar hace que solo se registre a quien participa. Y permite algo útil: ceder tu voz a alguien que sigue el tema, sin darle tus tokens." },
      { et: "El voto se congela al proponer", texto: "Se cuenta el poder de voto que cada quien tenía en el bloque de la propuesta. Así nadie puede comprar tokens, votar, venderlos y votar de nuevo: el registro histórico lo impide." },
      { y: 3.8, h: 2.15, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error número uno del laboratorio", x: M, y: 5.98, w: CW, h: 0.82, texto: "«Tengo tokens pero mi voto sale en cero»: falta delegar. Es la primera prueba de test/s15.", size: 12 });
  }

  {
    const s = await D.lamina({ kicker: "A.5 · modelos de voto", titulo: "«Un token, un voto» y sus alternativas", ic: "balanza", tituloSize: 26 });
    D.tabla(s, ["modelo", "cómo cuenta", "el problema"], [
      ["Un token, un voto", "El poder es proporcional a los tokens.", "Plutocracia: quien más tiene, más manda. Las ballenas deciden solas."],
      ["Voto cuadrático", "El costo de cada voto extra crece al cuadrado.", "Favorece a la mayoría sobre la intensidad de pocos, pero se rompe con identidades falsas (Sybil, Sesión 4)."],
      ["Voto por convicción", "El peso crece cuanto más tiempo se sostiene el voto.", "Premia el compromiso, pero es más complejo de entender."],
    ], { y: 1.9, h: 2.9, colW: [2.8, 4.4, 4.893], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Los dos males de casi toda DAO", x: M, y: 5.05, w: CW, h: 1.65, texto: "PLUTOCRACIA: unas pocas ballenas concentran el voto y deciden por todos. APATÍA: la mayoría no vota nunca, así que el poder efectivo se concentra aún más. Muchas «DAOs» son, en la práctica, gobernadas por un puñado de direcciones. Reconocerlo es parte de evaluarlas con honestidad.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.6 · ataques a la gobernanza", titulo: "Se puede comprar una votación", ic: "bicho", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Ataque con préstamo relámpago", linea: C.rojo, color: C.rojo, texto: "Si el poder de voto se mide en el momento de votar, un atacante pide millones en tokens con un flash loan (Sesión 14), vota, y los devuelve — todo en una transacción. Ha pasado: propuestas maliciosas aprobadas con votos alquilados por segundos." },
      { et: "La defensa", texto: "Medir el voto en un bloque PASADO (al proponer), no al votar. El flash loan dura una transacción; no puede cambiar el saldo de un bloque anterior. Es exactamente lo que hace ERC20Votes con sus checkpoints." },
      { y: 1.9, h: 2.6, size: 12.5 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Captura por ballenas", x: M, y: 4.7, w: CW, h: 2.0, texto: "Otro ataque, más lento y legal: una entidad acumula suficiente poder de voto para aprobar lo que quiera. No es un hackeo — es el sistema funcionando como está diseñado, y por eso es más difícil de resolver. La descentralización de la gobernanza, como la de la Sesión 4, es un vector, no un sí o un no: se mide en qué tan repartido está el poder de voto real.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.7 · identidad descentralizada", titulo: "Quién eres cuando no hay plataforma", ic: "persona", tituloSize: 27 });
    D.parrafo(s, "Hoy tu identidad digital la guardan plataformas: Google, el banco, la universidad. La identidad descentralizada propone que la controles tú, con credenciales que presentas sin pedir permiso.", { y: 1.9, h: 0.9, size: 14 });
    D.tabla(s, ["concepto", "qué es"], [
      ["DID · identificador descentralizado", "Un identificador que tú controlas con tu clave, no una cuenta que una empresa te da y te puede quitar."],
      ["Credencial verificable", "Un título, un carné, firmado por quien lo emite. Lo presentas y cualquiera verifica la firma, sin llamar al emisor."],
      ["Soulbound Token (SBT)", "Un NFT no transferible (Sesión 11) para credenciales y reputación atadas a una persona."],
      ["Reputación on-chain", "Tu historial de acciones en la cadena como base de confianza, sin un puntaje central."],
    ], { y: 3.0, h: 2.9, colW: [3.6, 8.493], size: 11.5 });
    D.parrafo(s, "El diploma de la Sesión 11 era exactamente esto: una credencial verificable emitida por la universidad.", { y: 6.05, h: 0.5, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.8 · la tensión difícil", titulo: "Identidad permanente vs. derecho al olvido", ic: "escudo", tituloSize: 25 });
    D.dosColumnas(s,
      { et: "Lo que promete la identidad on-chain", texto: "Credenciales que nadie te puede quitar, que presentas sin permiso, verificables por cualquiera para siempre. Autonomía real sobre tu identidad." },
      { et: "Lo que choca con la ley", linea: C.rojo, color: C.rojo, texto: "La Ley 1581 de 2012 (habeas data) te da derecho a corregir y SUPRIMIR tus datos. Una credencial permanente en una cadena pública no se puede borrar. ¿Y si la credencial fue un error, o revela algo que preferirías olvidar?" },
      { y: 1.9, h: 2.55, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "No hay respuesta fácil, y ese es el punto", x: M, y: 4.6, w: CW, h: 2.1, texto: "La misma inmutabilidad que hace confiable un diploma hace imposible borrarlo. Las salidas —guardar solo hashes, credenciales revocables, datos fuera de la cadena— son parches parciales. Es exactamente la lección de la Sesión 6: en una cadena pública no van datos personales. Este es un tema abierto, ideal para el ensayo de RA7.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.9 · lo que hay que llevarse del bloque A", titulo: "Seis ideas sobre gobierno e identidad", ic: "lista", tituloSize: 26 });
    const ideas = [
      "«DAO» es un espectro: casi siempre, empezar por un multisig es lo correcto.",
      "Un multisig m de n elimina el punto único de falla de un solo dueño.",
      "La gobernanza on-chain ejecuta lo aprobado sin intermediarios: proponer → votar → ejecutar.",
      "Hay que DELEGAR el voto para que cuente; y se mide en un bloque pasado, contra flash loans.",
      "«Un token, un voto» tiende a la plutocracia; la apatía concentra aún más el poder.",
      "La identidad on-chain choca de frente con el derecho al olvido. No hay solución limpia.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Laboratorio 15", sub: "Desplegar una DAO que gobierna una tesorería: proponer, delegar, votar y ejecutar. El ciclo completo, de verdad.", minutos: "APROXIMADAMENTE 80 MINUTOS · EN PAREJAS", ic: "voto" });

  {
    const s = await D.lamina({ kicker: "B.1 · las piezas", titulo: "Token de voto, gobierno y tesorería", ic: "capas", tituloSize: 27 });
    D.tabla(s, ["contrato", "qué hace"], [
      ["TokenVoto", "ERC20Votes: token con registro histórico de poder de voto y delegación."],
      ["GobiernoUSB", "Governor de OpenZeppelin: gestiona propuestas, votación, quórum y ejecución."],
      ["Tesoreria", "Guarda fondos; su único dueño es el gobierno. Solo una propuesta ejecutada libera dinero."],
    ], { y: 1.9, h: 2.15, colW: [2.6, 9.493], size: 12 });
    D.codigo(s, `npx hardhat test test/s15/Gobierno.test.js      # 5 pruebas: el ciclo completo`, { x: M, y: 4.25, w: CW, h: 0.62, lang: "js", size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La prueba que lo demuestra todo", x: M, y: 5.1, w: CW, h: 1.6, texto: "«Proponer, votar a favor y ejecutar libera los fondos»: recorre el ciclo entero y comprueba que la tesorería suelta 2 ETH SOLO porque una propuesta se aprobó. Y otra prueba confirma que ni el fundador puede sacar un peso por su cuenta.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · el ciclo, paso a paso", titulo: "Recorrer una propuesta real", ic: "voto", tituloSize: 28 });
    D.pasos(s, [
      ["ACUÑAR Y DELEGAR", "Repartir tokens entre tres cuentas y que cada una se delegue el voto a sí misma."],
      ["PROPONER", "propose() con la llamada a liberar fondos de la tesorería y una descripción."],
      ["ESPERAR Y VOTAR", "Avanzar los bloques del retraso; castVote() a favor o en contra."],
      ["CERRAR", "Avanzar los bloques del periodo; comprobar el estado: Succeeded o Defeated."],
      ["EJECUTAR", "execute() con los mismos parámetros y el hash de la descripción. Los fondos se mueven."],
    ], { y: 1.9, alto: 0.82, gap: 0.12, anchoEt: 2.6, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El detalle que atasca a todos", x: M, y: 5.72, w: CW, h: 1.05, texto: "execute() necesita los MISMOS targets, values y calldatas que propose(), y el HASH de la descripción. Si no coinciden, revierte.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.3 · el reto y la entrega", titulo: "Ampliar y demostrar", ic: "martillo", tituloSize: 28 });
    D.lista(s, [
      "Escribir una propuesta propia (por ejemplo, cambiar un parámetro de otro contrato del equipo) y llevarla del inicio a la ejecución.",
      "Provocar una derrota: una propuesta que pierde la votación y comprobar que NO se puede ejecutar.",
      "Opcional: configurar un multisig de prueba (Safe en testnet) y ejecutar una transacción con dos firmantes.",
    ], { y: 1.9, h: 2.1, size: 13, gap: 8 });
    D.tabla(s, ["evidencia", "peso"], [
      ["Las 5 pruebas del gobierno en verde (captura)", "30 %"],
      ["Una propuesta propia recorrida de principio a fin, con los hashes o la salida de las pruebas", "40 %"],
      ["Una propuesta derrotada, demostrando que no se ejecuta", "15 %"],
      ["Un párrafo: ¿qué modelo de voto usaría su proyecto y por qué?", "15 %"],
    ], { y: 4.15, h: 2.4, colW: [10.093, 2.0], size: 11 });
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "El ensayo individual (RA7)", sub: "La única pieza estrictamente individual y escrita del curso: pensar en serio una implicación del ecosistema, en el contexto colombiano.", minutos: "APROXIMADAMENTE 30 MINUTOS · SE ENTREGA EN LA S17", ic: "documento" });

  {
    const s = await D.lamina({ kicker: "C.1 · el encargo", titulo: "1 500 palabras, una postura sostenida", ic: "documento", tituloSize: 27 });
    D.tabla(s, ["", "detalle"], [
      ["Qué es", "Un ensayo individual de 1 500 palabras sobre una implicación del ecosistema aplicada a Colombia."],
      ["Ejes posibles", "Regulatoria, ética, económica o ambiental. Uno, a fondo, no los cuatro por encima."],
      ["Qué se evalúa", "Argumentación, uso de fuentes y una postura propia sostenida — no un resumen."],
      ["IA", "Se permite y se declara: una nota al final diciendo para qué se usó."],
      ["Cuándo", "Se plantea hoy, se entrega en la Sesión 17. Peso: 20 % del tercer corte."],
    ], { y: 1.9, h: 3.35, colW: [2.2, 9.893], size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Temas que salieron del curso", x: M, y: 5.5, w: CW, h: 1.2, texto: "El derecho al olvido frente a la inmutabilidad (hoy). El costo energético (S4). Estafas y responsabilidad del ingeniero (S9). La regulación colombiana (S16). Todos dan para un buen ensayo.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "C.2 · qué distingue un buen ensayo", titulo: "Postura, no resumen", ic: "balanza", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Un ensayo flojo", linea: C.rojo, color: C.rojo, items: ["Resume qué es blockchain, otra vez.", "Enumera pros y contras sin decidir.", "Cita sin leer, o no cita.", "Podría ser sobre cualquier país."] },
      { et: "Un buen ensayo", items: ["Toma una postura clara y la sostiene.", "Usa fuentes reales, leídas, y las discute.", "Se ancla en Colombia: una ley, un caso, un dato local.", "Reconoce el argumento contrario y responde."] },
      { y: 1.9, h: 2.55, size: 13 });
    D.parrafo(s, "Es el mismo criterio de toda la actividad de Estonia: una afirmación sostenida con evidencia vale más que un resumen equilibrado que no arriesga nada.", { y: 4.65, h: 0.7, size: 13, color: C.ocre });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Declaración de uso de IA, obligatoria", x: M, y: 5.5, w: CW, h: 1.2, texto: "Igual que en el caso Estonia: se permite usar IA, y se declara para qué. Lo que no se acepta es presentar como propio un texto que no se pensó, ni citar fuentes que no se abrieron.", size: 13 });
  }

  await D.preguntaSemana({
    pregunta: "Elijan el eje de su ensayo y escriban en una frase la postura que van a defender. Si no cabe en una frase, aún no la tienen.",
    trabajo: [
      "Entregar la evidencia del laboratorio 15.",
      "Definir la postura del ensayo individual (se entrega en la Sesión 17).",
      "Avanzar hacia el Avance 2: la dApp integrada se entrega en la Sesión 16.",
      "Leer sobre capas 2 y sobre la regulación colombiana de criptoactivos para la Sesión 16.",
    ],
  });

  await D.cierre({
    frase: "Gobernar sin jefe no elimina el poder: lo hace visible.",
    sub: "Ya no es quién manda, es quién tiene los votos. Saben construir, asegurar, integrar y gobernar; falta situarlo en el mundo: cuánto escala, cuánto cuesta y qué dice la ley colombiana.",
    proxima: "Sesión 16 · Escalabilidad, interoperabilidad y marco regulatorio · Avance 2",
  });

  return D.guardar(path.join(__dirname, "Sesion-15-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
