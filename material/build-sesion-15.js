/* =====================================================================
   Sesión 15 · DAOs, gobernanza e identidad descentralizada
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 15 · DAOS, GOBERNANZA E IDENTIDAD", titulo: "Sesión 15 · DAOs, gobernanza e identidad" });
  const { C, F, M, CW } = D;

  /* lista numerada grande, como el cierre de bloque de la Sesión 4 */
  function ideasNumeradas(s, ideas, paso = 0.8, size = 14.5) {
    ideas.forEach((t, i) => {
      const y = 1.9 + i * paso;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size, valign: "middle" });
      D.linea(s, M, y + paso - 0.06, M + CW, y + paso - 0.06, C.grisClaro, 1);
    });
  }

  /* ---------------------------------------------------------- apertura */
  await D.portada({
    kicker: "SESIÓN 15 · UNIDAD IV · ECOSISTEMA",
    titulo: "¿QUIÉN MANDA\nCUANDO NO\nHAY DUEÑO?",
    sub: "Gobernar un sistema sin jefe: firmas múltiples, propuestas, votos, un plazo de gracia y ejecución en el código. Y quién eres tú en una cadena.",
    palabra: "GOBERNAR",
    ic: "voto",
    notas: "Objetivo doble: implementar gobernanza on-chain real con timelock (laboratorio) y discutir con honestidad la identidad descentralizada frente al habeas data colombiano. Hoy se plantea el ensayo individual (RA7). Arranque: 2 minutos. Pregunta de enganche: «¿quién es el owner del contrato de su proyecto? ¿Qué pasa si esa persona pierde el computador mañana?»",
  });

  await D.agenda({
    intro: "Del contrato con un solo dueño a la organización sin dueño. Y una conversación difícil: qué significa tu identidad cuando vive en una cadena pública.",
    bloques: [
      ["A", "DAOS Y GOBERNANZA", "Multisig, Safe, Governor + Timelock, quórum, delegación, modelos de voto y el caso Beanstalk.", "~60 min"],
      ["B", "IDENTIDAD DESCENTRALIZADA", "DID, credenciales verificables, SBT y el choque con el habeas data.", "~20 min"],
      ["C", "LABORATORIO 15", "Una DAO con timelock, el ciclo completo con tiempo simulado, y un multisig 2 de 3.", "~70 min"],
      ["D", "EL ENSAYO INDIVIDUAL (RA7)", "Se plantea hoy; se entrega en la Sesión 17. 8 % de la nota final.", "~20 min"],
    ],
    notas: "Suma: 10 de apertura + 60 + 20 + 70 + 20 = 180. Pausa de 10 minutos entre B y C (se descuenta del laboratorio si hace falta: la guía PDF permite terminar en casa). El ensayo va al final porque necesita la conversación de identidad (B) fresca.",
  });

  await D.objetivo({
    objetivo: "Implementar un mecanismo de gobernanza on-chain con timelock y evaluar críticamente los modelos de identidad descentralizada.",
    preguntas: [
      "¿Cuándo un multisig es la respuesta correcta y cuándo hace falta votación?",
      "¿Cómo pasa una propuesta de una idea a una ejecución automática, con plazo de gracia?",
      "¿Qué falla en «un token, un voto», y cómo se compró una votación en 2022?",
      "¿Qué tensión hay entre una identidad on-chain y el derecho a suprimir tus datos?",
    ],
    ra: "RA2 · arquitecturas de gobernanza  ·  RA3 · Governor + Timelock  ·  RA7 · identidad, ética y habeas data.",
    notas: "Leer las cuatro preguntas en voz alta. Al cierre se vuelve a esta lámina: cada pregunta debe tener respuesta en una frase. 2 minutos.",
  });

  await D.glosario({
    items: [
      ["DAO", "Decentralized Autonomous Organization", "Organización cuyas reglas viven en contratos y cuyas decisiones toman sus miembros, sin jefe único."],
      ["Multisig", "multifirma · m de n", "Cuenta que exige m firmas de n posibles para actuar. Safe es el estándar de facto."],
      ["Governor", "contrato de gobierno", "Contrato de OpenZeppelin que recibe propuestas, cuenta votos y manda ejecutar lo aprobado."],
      ["Timelock", "TimelockController", "Plazo obligatorio entre aprobar y ejecutar: la salida de emergencia de la minoría."],
      ["Quórum", "quorum", "Mínimo de poder de voto que debe participar para que una votación valga."],
      ["Delegación", "delegate()", "Activar tu poder de voto, en ti o en otra cuenta. Sin delegar, tus tokens votan cero."],
      ["DID", "Decentralized Identifier", "Identificador que controla su dueño con una clave, no una plataforma. W3C, 2022."],
      ["SBT", "Soulbound Token", "Token no transferible atado a una cuenta, para credenciales y reputación."],
    ],
    notas: "No leer todo: señalar Timelock y Delegación, que son los dos que el laboratorio exige entender y los que más confunden. 2 minutos.",
  });

  /* ================================================================ A */
  await D.divisor({ letra: "A", titulo: "DAOs y gobernanza", sub: "Gobernar sin jefe suena utópico. En la práctica es un espectro: desde un multisig de tres personas hasta miles votando on-chain, cada punto con sus grietas.", minutos: "APROXIMADAMENTE 60 MINUTOS", ic: "voto" }).then(s => s.addNotes("Bloque A: 60 minutos. Ritmo: 3-4 minutos por lámina; las de ejemplo trabajado (A.7, A.13, A.15) piden más."));

  {
    const s = await D.lamina({ kicker: "A.1 · de dónde venimos", titulo: "El problema del dueño único", ic: "llave", tituloSize: 29 });
    D.parrafo(s, "Desde la Sesión 6 casi todos los contratos del curso tienen un dueño: una sola dirección con permisos especiales (onlyOwner, soloEmisor). Es cómodo. Y es un punto único de falla.", { y: 1.9, h: 0.9, size: 14.5 });
    D.tabla(s, ["si esa clave…", "lo que pasa con el contrato"], [
      ["se pierde (se daña el disco, se olvida la frase)", "Nadie vuelve a poder pausar, emitir o cambiar nada. Para siempre."],
      ["se la roban", "El ladrón tiene TODOS los poderes del dueño: vaciar, pausar, cambiar reglas."],
      ["pertenece a alguien que se va del equipo", "El proyecto depende de la buena voluntad de una persona que ya no está."],
    ], { y: 3.0, h: 2.1, colW: [4.6, 7.493], size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta que organiza el bloque", x: M, y: 5.35, w: CW, h: 1.35, texto: "¿Cómo se reparte el poder sobre un contrato entre varias personas, de modo que ninguna sola pueda perderlo, robarlo o abusar de él? Hay dos respuestas: firmas múltiples y votación. Hoy vemos las dos.", size: 13 });
    s.addNotes("Pedir a dos equipos que digan quién es el owner de su contrato del Avance 1. Casi siempre es la billetera de un solo integrante. Ese es el punto. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · qué es una DAO", titulo: "Un espectro, no una cosa", ic: "capas", tituloSize: 29 });
    D.parrafo(s, "«DAO» se usa para cosas muy distintas. Ordenémoslas por cuánta gente decide y cuánto hace el código solo:", { y: 1.9, h: 0.6, size: 14.5 });
    const puntos = [
      ["UNA CLAVE", "un dueño decide todo"],
      ["MULTISIG", "m de n personas conocidas firman"],
      ["MULTISIG + VOTO", "la comunidad opina; el multisig ejecuta"],
      ["ON-CHAIN PLENA", "votan miles; el código ejecuta solo"],
    ];
    const w = (CW - 0.6) / 4;
    puntos.forEach((p, i) => {
      const x = M + i * (w + 0.2);
      D.nodo(s, { x, y: 2.75, w, h: 1.15, titulo: p[0], sub: p[1], fill: i === 1 ? C.blanco : C.superf, line: i === 1 ? C.violeta : (i === 3 ? C.naranja : C.tinta), subSize: 11 });
      if (i < 3) D.flecha(s, x + w + 0.02, 3.32, x + w + 0.18, 3.32, C.tinta, 1.5);
    });
    D.etiqueta(s, "más rápido, más concentrado", { x: M, y: 4.05, w: 5, color: C.gris, size: 9 });
    D.etiqueta(s, "más lento, más repartido", { x: M + CW - 5, y: 4.05, w: 5, color: C.gris, size: 9, align: "right" });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error de concepto típico", x: M, y: 4.5, w: CW, h: 1.18, texto: "«Si es una DAO, está descentralizada». No: muchas «DAOs» son, en la práctica, un multisig de cinco fundadores con una votación consultiva encima.", size: 12.5 });
    D.parrafo(s, "El consejo que sorprende: casi siempre, al principio, lo correcto es la segunda casilla. La cuarta tiene sentido con una comunidad grande y real que gobernar, no antes.", { y: 5.88, h: 0.8, size: 13, color: C.ocre });
    s.addNotes("La tercera casilla es muy común: votación fuera de cadena (sin gas) y un multisig que ejecuta lo votado. Es un compromiso honesto si se dice. Preguntar: ¿en qué casilla está su proyecto? ¿En cuál debería estar? 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · multisig · la idea", titulo: "m de n: ninguna llave sola abre la caja", ic: "llave", tituloSize: 27 });
    D.parrafo(s, "Una cuenta multifirma exige que m de n personas firmen para ejecutar una transacción. Lo que se elige al crearla son dos números, y cada combinación resiste cosas distintas:", { y: 1.9, h: 0.9, size: 14 });
    D.tabla(s, ["esquema", "sobrevive a perder…", "resiste que roben…", "comentario"], [
      ["1 de 2", "1 clave", "0 claves", "Una llave de repuesto. Cualquiera de los dos puede vaciarla."],
      ["2 de 2", "0 claves", "1 clave", "Si uno pierde su clave, los fondos quedan congelados."],
      ["2 de 3", "1 clave", "1 clave", "El equilibrio típico de un equipo pequeño."],
      ["3 de 5", "2 claves", "2 claves", "Tesorerías de proyectos; más lento de coordinar."],
    ], { y: 2.95, h: 2.55, colW: [1.6, 2.5, 2.5, 5.493], size: 11.5 });
    D.definicion(s, "regla: sobrevive a perder n − m claves  ·  resiste que roben m − 1 claves", { x: M, y: 5.7, w: CW, h: 0.5, size: 12 });
    D.parrafo(s, "Error típico: un 2 de 3 donde las tres claves viven en el mismo portátil es, en la práctica, un 1 de 1.", { y: 6.3, h: 0.45, size: 12.5, color: C.ocre });
    s.addNotes("Hacer la cuenta en voz alta con el 2 de 3: perder 1 → quedan 2, alcanza (3−2=1). Robar 1 → el ladrón tiene 1, necesita 2 (2−1=1). Pregunta rápida: ¿qué esquema usarían para la tesorería de un semillero de 3 personas? 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · multisig en la práctica", titulo: "Safe: firmar gratis, ejecutar una vez", ic: "escudo", tituloSize: 27 });
    D.pasos(s, [
      ["CREAR", "En app.safe.global se eligen red, firmantes y umbral. Con 2 o más firmantes, el despliegue paga gas."],
      ["PROPONER", "Un firmante arma la transacción y la firma. La firma NO es una transacción: no cuesta gas."],
      ["CONFIRMAR", "El segundo firmante revisa y firma también, fuera de la cadena. Queda en la cola."],
      ["EJECUTAR", "Con el umbral reunido, cualquiera ejecuta: UNA transacción que lleva todas las firmas. Solo ella paga gas."],
    ], { y: 1.9, alto: 0.8, gap: 0.12, anchoEt: 2.3, size: 12.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Verificado hoy para el laboratorio", x: M, y: 5.6, w: CW, h: 1.12, texto: "Safe{Wallet} soporta Sepolia (sí) y NO lista OP Sepolia. El laboratorio usa Sepolia. Y trae un multisig mínimo propio (MultisigUSB) para ver el mecanismo por dentro sin red.", size: 12.5 });
    s.addNotes("Verificado el 17-09-2026 en la configuración pública de Safe: safe-config.safe.global/api/v1/chains/11155111 responde; .../chains/11155420 (OP Sepolia) da 404. Ayuda oficial: help.safe.global, artículo «Creating a Safe on a Web browser». Diferencia clave con el MultisigUSB del laboratorio: allí cada confirmación es una transacción; en Safe son firmas fuera de cadena. ⚠ VERIFICAR ANTES DE DICTAR que Sepolia siga habilitada. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · gobernanza on-chain · las piezas", titulo: "Token, Governor, Timelock y tesorería", ic: "jerarquia", tituloSize: 26 });
    D.nodo(s, { x: M, y: 2.0, w: 2.7, h: 1.1, titulo: "TOKENVOTO", sub: "ERC20Votes: saldos\n+ historial de votos", fill: C.blanco, subSize: 10.5 });
    D.flecha(s, M + 2.75, 2.55, M + 3.35, 2.55, C.tinta, 2);
    D.nodo(s, { x: M + 3.4, y: 2.0, w: 2.7, h: 1.1, titulo: "GOBIERNOUSB", sub: "Governor: propuestas,\nvotos, quórum", fill: C.blanco, line: C.violeta, subSize: 10.5 });
    D.flecha(s, M + 6.15, 2.55, M + 6.75, 2.55, C.tinta, 2);
    D.nodo(s, { x: M + 6.8, y: 2.0, w: 2.7, h: 1.1, titulo: "TIMELOCKUSB", sub: "espera el plazo\ny EJECUTA", fill: C.blanco, line: C.naranja, subSize: 10.5 });
    D.flecha(s, M + 9.55, 2.55, M + 10.15, 2.55, C.tinta, 2);
    D.nodo(s, { x: M + 10.2, y: 2.0, w: CW - 10.2, h: 1.1, titulo: "TESORERÍA", sub: "owner =\ntimelock", fill: C.superf, subSize: 10.5 });
    D.tabla(s, ["pieza", "le pregunta a…", "error típico"], [
      ["Governor", "al token: ¿cuántos votos tenía cada quien en el bloque de la propuesta?", "Creer que cuenta el saldo de HOY: cuenta el de ese bloque."],
      ["Timelock", "al Governor: ¿esta operación fue aprobada? Solo él puede agendar.", "Dejar al que desplegó como administrador: un dueño escondido."],
      ["Tesorería", "al que llama: ¿eres mi dueño?", "Poner de dueño al Governor: quien llama al final es el TIMELOCK."],
    ], { y: 3.45, h: 2.5, colW: [1.9, 5.2, 4.993], size: 11.5 });
    D.parrafo(s, "Las cuatro piezas del laboratorio. La flecha es el camino del poder: nadie se la puede saltar.", { y: 6.15, h: 0.5, size: 12.5, color: C.ocre });
    s.addNotes("El tercer error de la tabla es el que más tumba laboratorios: la ejecución revierte con OwnableUnauthorizedAccount(dirección del timelock). La prueba «el dueño de la tesorería es el timelock» lo cubre. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · el ciclo de una propuesta", titulo: "Siete pasos, cinco estados", ic: "voto", tituloSize: 29 });
    D.pasos(s, [
      ["PROPONER · Pending", "Alguien presenta: «liberar 2 ETH de la tesorería al semillero». Queda fijado el bloque de conteo."],
      ["RETRASO", "Un plazo antes de abrir la votación, para que todos se enteren (aquí: 1 bloque)."],
      ["VOTAR · Active", "A favor, en contra o abstención, con el peso de los votos delegados (aquí: 50 bloques)."],
      ["CERRAR · Succeeded", "Si hubo quórum y ganaron los votos a favor. Si no: Defeated, y se acabó."],
      ["ENCOLAR · Queued", "queue() agenda la operación en el timelock. Empieza a correr el plazo de gracia."],
      ["ESPERAR", "Pasa el retardo mínimo (en segundos). Quien no esté de acuerdo puede irse a tiempo."],
      ["EJECUTAR · Executed", "Cualquiera llama execute(). El timelock hace exactamente lo aprobado."],
    ], { y: 1.85, alto: 0.6, gap: 0.08, anchoEt: 3.0, size: 11.5 });
    s.addNotes("Estados del Governor de OpenZeppelin v5: 0 Pending, 1 Active, 2 Canceled, 3 Defeated, 4 Succeeded, 5 Queued, 6 Expired, 7 Executed. Las pruebas del laboratorio comparan esos números. Pregunta: ¿por qué el retraso se mide en bloques y el timelock en segundos? (el Governor usa el reloj del token, que en ERC20Votes es el número de bloque; el TimelockController usa block.timestamp). 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · el ciclo con números", titulo: "Una propuesta real del laboratorio", ic: "grafico", tituloSize: 27 });
    D.parrafo(s, "Ana tiene 60 votos, Beto 30 y Carla 10 (100 en total, todos delegados). Quórum: 4 % = 4 votos. Ana propone en el bloque 100.", { y: 1.85, h: 0.6, size: 13.5 });
    D.tabla(s, ["momento", "bloque / tiempo", "qué pasa", "estado"], [
      ["propose()", "bloque 100", "Se fija el snapshot: bloque 101 (retraso de 1).", "Pending"],
      ["votación abierta", "102 a 151", "Ana vota a favor (60); Beto en contra (30).", "Active"],
      ["cierre", "bloque 152", "Participaron 90 ≥ 4 (quórum) y 60 > 30.", "Succeeded"],
      ["queue()", "hora t", "El timelock agenda la operación: ejecutable desde t + 3 600 s.", "Queued"],
      ["execute() antes", "t + 10 min", "Revierte: TimelockUnexpectedOperationState.", "Queued"],
      ["execute()", "t + 1 h", "La tesorería envía 2 ETH a Carla.", "Executed"],
    ], { y: 2.55, h: 3.35, colW: [2.1, 1.9, 6.093, 2.0], size: 11.5 });
    D.parrafo(s, "Estos son los números de la prueba «★ proponer, votar, encolar, esperar y ejecutar». En la red local el tiempo se simula: mine(51) salta bloques; time.increase(3601) salta segundos.", { y: 6.05, h: 0.7, size: 12, color: C.ocre });
    s.addNotes("Hacer la cuenta en el tablero: snapshot = bloque de la propuesta + votingDelay (1) = 101; deadline = snapshot + votingPeriod (50) = 151. La votación está activa mientras el bloque actual esté entre 102 y 151. Todo verificado corriendo test/s15/CicloGobierno.test.js. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · quórum y mayoría", titulo: "Dos condiciones distintas, las dos obligatorias", ic: "balanza", tituloSize: 25 });
    D.parrafo(s, "En el conteo simple de OpenZeppelin: el quórum se mide con los votos A FAVOR + ABSTENCIÓN; la mayoría, con A FAVOR frente a EN CONTRA. Mismo padrón de 100 votos, quórum 4:", { y: 1.9, h: 0.9, size: 14 });
    D.tabla(s, ["escenario", "a favor", "en contra", "abstención", "resultado"], [
      ["Solo Carla vota a favor", "10", "0", "0", "Pasa: 10 ≥ 4 y 10 > 0"],
      ["Una cuenta con 1 voto vota a favor", "1", "0", "0", "Derrotada: 1 < 4, falta quórum aunque sea 100 % a favor"],
      ["Ana en contra, Carla a favor", "10", "60", "0", "Derrotada: hay quórum, pero 10 < 60"],
      ["Beto se abstiene, Carla a favor", "10", "0", "30", "Pasa: 40 ≥ 4 y 10 > 0"],
    ], { y: 2.95, h: 2.55, colW: [3.6, 1.2, 1.3, 1.4, 4.593], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error de concepto típico", x: M, y: 5.6, w: CW, h: 1.15, texto: "«Si nadie vota en contra, pasa». No: sin quórum, una propuesta 100 % a favor también es derrotada. Lo prueba «sin quórum, la propuesta es derrotada…».", size: 12.5 });
    s.addNotes("Fuente: GovernorCountingSimple de OpenZeppelin 5 (_quorumReached = quorum <= forVotes + abstainVotes; _voteSucceeded = forVotes > againstVotes). El cuarto escenario sorprende: abstenerse ayuda a alcanzar el quórum. Pregunta: ¿por qué alguien se abstendría en vez de no votar? 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · el poder de voto", titulo: "Sin delegar, tus tokens votan cero", ic: "termino", tituloSize: 28 });
    D.parrafo(s, "El detalle que confunde a todos: tener tokens de gobierno no basta. Hay que DELEGAR el voto —a uno mismo o a otro— para que cuente.", { y: 1.9, h: 0.65, size: 14.5 });
    D.codigo(s, `await token.acunar(ana, 10)          // balanceOf(ana) = 10
await token.getVotes(ana)            // → 0      ¡sin delegar!
await token.connect(ana).delegate(ana)
await token.getVotes(ana)            // → 10
await token.connect(ana).delegate(beto)
await token.getVotes(beto)           // → 10     (los tokens siguen siendo de Ana)`, { x: M, y: 2.7, w: CW, h: 2.2, lang: "js", titulo: "lo que muestran las pruebas de test/s15/Gobierno.test.js", size: 11.5 });
    D.dosColumnas(s,
      { et: "Por qué existe", texto: "Registrar el poder de voto en cada bloque cuesta gas (los checkpoints). Exigir delegar hace que solo se registre quien quiere participar." },
      { et: "Para qué sirve", texto: "Ceder tu voz a alguien que sigue el tema, sin darle tus tokens: la democracia representativa, en un contrato." },
      { y: 5.1, h: 1.6, size: 12.5 });
    s.addNotes("Error número uno del laboratorio y de las DAOs reales: gente con tokens que nunca delegó y cree que votó. La prueba «sin delegar, ni la dueña del 60 % logra aprobar nada» lo demuestra: el voto se emite, pero pesa 0. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · la foto del padrón", titulo: "El voto se congela al proponer", ic: "reloj", tituloSize: 28 });
    D.parrafo(s, "El Governor no pregunta cuántos votos tienes HOY: pregunta cuántos tenías en el bloque del snapshot. Consecuencia: comprar votos después de que se publica la propuesta no sirve de nada.", { y: 1.9, h: 0.95, size: 14.5 });
    D.pasos(s, [
      ["BLOQUE 100", "Ana propone. El snapshot queda en el bloque 101."],
      ["BLOQUE 103", "Un atacante consigue 1 000 votos: diez veces todo lo demás."],
      ["BLOQUE 104", "Vota en contra. getVotes(atacante, 101) = 0: su voto pesa CERO."],
    ], { y: 3.05, alto: 0.68, gap: 0.1, anchoEt: 2.3, size: 12.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Por qué importa: el préstamo relámpago", x: M, y: 5.45, w: CW, h: 1.25, texto: "Un flash loan (Sesión 14) presta millones dentro de UNA transacción y exige devolverlos antes de que termine. No puede cambiar el saldo de un bloque que ya pasó. El snapshot es la defensa. Veremos qué pasó cuando no la había.", size: 12.5 });
    s.addNotes("Es la prueba «★ votos comprados DESPUÉS de proponer no cuentan». Mostrarla en pantalla si hay tiempo. Transición a A.11: el timelock es la segunda defensa. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · el timelock", titulo: "El plazo de gracia de la minoría", ic: "candado", tituloSize: 28 });
    D.parrafo(s, "Una propuesta aprobada no se ejecuta enseguida: se encola y espera un retardo mínimo. Ese plazo protege al que perdió la votación: si la mayoría aprobó algo que lo perjudica, alcanza a retirar sus fondos antes.", { y: 1.9, h: 0.95, size: 14 });
    D.tabla(s, ["rol del TimelockController", "quién lo tiene en la DAO del laboratorio"], [
      ["PROPOSER · agenda operaciones", "Solo el Governor. Nadie puede saltarse la votación."],
      ["CANCELLER · cancela lo agendado", "Solo el Governor."],
      ["EXECUTOR · ejecuta lo vencido", "Cualquiera (address(0)): no hace falta confiar en nadie para ejecutar."],
      ["ADMIN · reparte roles", "Nadie. Quien desplegó RENUNCIA al terminar de configurar."],
    ], { y: 3.0, h: 2.35, colW: [4.4, 7.693], size: 11.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "El dueño escondido", x: M, y: 5.55, w: CW, h: 1.15, texto: "Si el que desplegó conserva el rol ADMIN, puede darse a sí mismo PROPOSER y agendar lo que quiera sin votación. La prueba «★ el fundador renunció…» verifica que ya no puede.", size: 12.5 });
    s.addNotes("OpenZeppelin lo advierte en GovernorTimelockControl: dar PROPOSER o CANCELLER a alguien más que el Governor es «muy riesgoso». Al auditar una DAO real, lo primero que se mira es quién tiene roles en el timelock. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · modelos de voto", titulo: "«Un token, un voto» y sus alternativas", ic: "balanza", tituloSize: 26 });
    D.tabla(s, ["modelo", "cómo cuenta", "a favor", "el problema"], [
      ["Un token, un voto", "Poder proporcional a los tokens.", "Simple; alinea voto y capital en riesgo.", "Plutocracia: quien más tiene, más manda."],
      ["Cuadrático", "n votos cuestan n² tokens.", "Da peso a la mayoría frente a unas pocas ballenas.", "Se rompe si una persona se divide en muchas cuentas (Sybil, Sesión 4)."],
      ["Por convicción", "El peso crece cuanto más tiempo se mantiene el voto.", "Premia el compromiso sostenido, no la compra de último minuto.", "Más difícil de entender y de auditar; decisiones lentas."],
    ], { y: 1.9, h: 3.2, colW: [2.2, 3.0, 3.3, 3.593], size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Ninguno es neutral", x: M, y: 5.35, w: CW, h: 1.35, texto: "Cada regla de conteo reparte el poder de una forma distinta. Elegir el modelo ES una decisión política, no técnica. En el laboratorio usamos el primero porque es el que trae OpenZeppelin, no porque sea el mejor.", size: 13 });
    s.addNotes("La siguiente lámina hace las cuentas del cuadrático, que es el que más confunde. Pregunta: ¿qué modelo usarían para elegir representante estudiantil? (ninguno basado en tokens: una persona, un voto exige identidad, y eso nos lleva al bloque B). 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · el voto cuadrático, con números", titulo: "Por qué frena a la ballena, y cómo se rompe", ic: "grafico", tituloSize: 25 });
    D.definicion(s, "votos = √tokens gastados    (1 voto cuesta 1 · 10 votos cuestan 100 · 100 votos cuestan 10 000)", { x: M, y: 1.9, w: CW, h: 0.55, size: 12 });
    D.tabla(s, ["quién", "tokens", "un token, un voto", "cuadrático"], [
      ["Una ballena", "10 000", "10 000 votos", "√10 000 = 100 votos"],
      ["100 estudiantes con 100 cada uno", "10 000", "10 000 votos", "100 × √100 = 1 000 votos"],
      ["La ballena partida en 100 cuentas de 100", "10 000", "10 000 votos", "100 × √100 = 1 000 votos"],
    ], { y: 2.65, h: 2.2, colW: [4.6, 1.6, 2.9, 2.993], size: 12 });
    D.dosColumnas(s,
      { et: "Lo que logra", texto: "Con el mismo capital, cien personas pesan diez veces más que una sola ballena. La intensidad cuenta, pero con rendimientos decrecientes." },
      { et: "Cómo se rompe", linea: C.rojo, color: C.rojo, texto: "Última fila: si la ballena crea 100 cuentas, recupera los 1 000 votos. El cuadrático SOLO funciona si se sabe que cada cuenta es una persona distinta." },
      { y: 5.05, h: 1.65, size: 12.5 });
    s.addNotes("Cuentas verificables: √10 000 = 100; √100 = 10; 100 × 10 = 1 000. Puente al bloque B: el voto cuadrático necesita identidad (prueba de persona), y la identidad on-chain tiene sus propios problemas. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · los males de casi toda DAO", titulo: "Plutocracia, apatía y captura", ic: "persona", tituloSize: 28 });
    D.parrafo(s, "Una cuenta que se hace en un minuto: suministro de 100 millones de tokens, quórum del 4 % (4 millones). Si solo vota el 5 % (5 millones)…", { y: 1.9, h: 0.65, size: 14 });
    D.cifra(s, "3 M", "Con 3 millones de votos, una sola cuenta es el 60 % de lo emitido: decide sola.", { x: M, y: 2.7, w: 3.85, h: 1.75, tsize: 11.5 });
    D.cifra(s, "4 M", "Con 4 millones, alcanza el quórum SOLA, aunque nadie más vote.", { x: M + 4.12, y: 2.7, w: 3.85, h: 1.75, color: C.violeta, tsize: 11.5 });
    D.cifra(s, "95 %", "de los votos posibles nunca aparecieron. La apatía concentra el poder real.", { x: M + 8.24, y: 2.7, w: CW - 8.24, h: 1.75, color: C.tinta, tsize: 11.5 });
    D.tabla(s, ["mal", "qué es"], [
      ["Plutocracia", "Quien más tokens tiene, más manda. Es el diseño funcionando, no un error."],
      ["Apatía", "La mayoría no vota nunca; el poder efectivo queda en pocas manos."],
      ["Captura", "Una entidad acumula el poder de voto de forma legal y aprueba lo que quiere. No es un hackeo: por eso es difícil de remediar."],
    ], { y: 4.7, h: 2.0, colW: [2.2, 9.893], size: 11.5 });
    s.addNotes("Las cifras son un ejemplo calculado, no de una DAO concreta. Invitar a revisar un tablero público de participación de una DAO real (p. ej. el explorador de propuestas de Tally) antes de afirmar porcentajes: cambian cada mes. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · caso real · Beanstalk, 17 de abril de 2022", titulo: "Una votación comprada por segundos", ic: "bicho", tituloSize: 26 });
    D.pasos(s, [
      ["UN DÍA ANTES", "El atacante presenta la propuesta BIP-18: transferirse los fondos del protocolo. Y espera el retraso de ~24 h."],
      ["PRESTAR", "En UNA transacción pide préstamos relámpago: unos USD 1 000 millones en stablecoins de Aave, y más en otros protocolos."],
      ["COMPRAR VOTOS", "Convierte lo prestado en poder de voto de Beanstalk, que se medía en ese mismo momento."],
      ["APROBAR Y EJECUTAR", "Con más de 2/3 de los votos, la «ejecución de emergencia» corre BIP-18 en esa misma transacción."],
      ["DEVOLVER", "Paga los préstamos y se queda con la diferencia. Todo en un solo bloque."],
    ], { y: 1.85, alto: 0.7, gap: 0.08, anchoEt: 2.5, size: 11.5 });
    D.cifra(s, "~USD 181 M", "drenados del protocolo", { x: M, y: 5.8, w: 5.9, h: 0.95, size: 20, tsize: 10.5 });
    D.cifra(s, "~USD 76 M", "ganancia neta del atacante (24 830 WETH)", { x: M + 6.19, y: 5.8, w: CW - 6.19, h: 0.95, size: 20, color: C.rojo, tsize: 10.5 });
    s.addNotes("Fuentes consultadas el 17-09-2026: post-mortem oficial, bean.money/blog/beanstalk-governance-exploit (17-04-2022, ~12:24 UTC; ~USD 77 M en activos de usuarios); documentación de gobernanza, docs.bean.money/almanac/governance/beanstalk (emergencyCommit: más de 24 h desde la propuesta y más de 2/3 a favor); rekt.news/beanstalk-rekt (préstamos de Aave: 350 M DAI + 500 M USDC + 150 M USDT ≈ USD 1 000 M; ~USD 181 M drenados; ~USD 76 M netos). Rekt fecha el artículo el 18-04 por zona horaria; el post-mortem oficial dice 17-04. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · qué lo habría evitado", titulo: "Las dos defensas del laboratorio de hoy", ic: "escudo", tituloSize: 26 });
    D.dosColumnas(s,
      { et: "Snapshot en un bloque pasado", texto: "Si el poder de voto se hubiera medido en el bloque de la propuesta (un día antes), los tokens prestados en el bloque del ataque habrían pesado cero. Es exactamente lo que hace ERC20Votes con sus checkpoints." },
      { et: "Timelock sin atajos", texto: "La «ejecución de emergencia» permitía aprobar y ejecutar en la misma transacción. Con un timelock obligatorio entre aprobar y ejecutar, el préstamo relámpago —que dura una transacción— no alcanza a llegar a la ejecución." },
      { y: 1.9, h: 2.7, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "La lección que sirve más allá de Beanstalk", x: M, y: 4.85, w: CW, h: 1.85, texto: "El código hizo exactamente lo que decía. No hubo un error de programación clásico: hubo un diseño de gobernanza que confundió «tener tokens ahora» con «tener derecho a decidir». Los atajos «de emergencia» son siempre el punto a auditar primero.", size: 13 });
    s.addNotes("Conectar con la Sesión 9: aquí no hay reentrancia ni desbordamiento; el ataque es económico y de diseño. Pregunta: ¿su proyecto tiene alguna función «de emergencia» que salte controles? 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · lo que hay que llevarse del bloque A", titulo: "Siete ideas sobre gobernar sin jefe", ic: "lista", tituloSize: 27 });
    ideasNumeradas(s, [
      "«DAO» es un espectro; casi siempre, empezar por un multisig es lo correcto.",
      "m de n sobrevive a perder n − m claves y resiste que roben m − 1.",
      "El ciclo: proponer → votar → encolar → esperar → ejecutar. Nadie ejecuta a mano.",
      "Sin delegar, los tokens votan cero. Y cuenta el saldo del snapshot, no el de hoy.",
      "Quórum (a favor + abstención) y mayoría (a favor > en contra) son dos pruebas distintas.",
      "El timelock ejecuta y es dueño de la tesorería; quien desplegó renuncia al rol admin.",
      "Ningún modelo de voto es neutral; el cuadrático exige saber quién es quién.",
    ], 0.7, 14);
    s.addNotes("Leerlas rápido: son el resumen para repasar. 2 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · verificación del bloque A", titulo: "Pregunta de control", ic: "pregunta", tituloSize: 29 });
    D.enunciado(s, "Un equipo despliega TokenVoto, GobiernoUSB y TimelockUSB, pone la tesorería a nombre del Governor y no renuncia al rol admin. Una propuesta gana. ¿Qué pasa al ejecutarla, y qué riesgo quedó abierto?", { y: 1.9, h: 2.05, size: 18, line: C.naranja });
    await D.ficha(s, { tipo: "termino", etiqueta: "Respuesta esperada (mostrar después de escuchar)", x: M, y: 4.2, w: CW, h: 2.5, texto: "La ejecución revierte: quien llama a liberar() es el timelock, no el Governor, así que Ownable responde OwnableUnauthorizedAccount(timelock). Y queda un dueño escondido: con el rol admin, quien desplegó puede darse PROPOSER y agendar operaciones sin votación. Las dos cosas las detectan las pruebas de test/s15/Gobierno.test.js.", size: 13 });
    s.addNotes("Dar 2 minutos en parejas antes de revelar. Si nadie llega a la primera parte, volver a A.5. Pausa de 10 minutos después de B si el tiempo va justo.");
  }

  /* ================================================================ B */
  await D.divisor({ letra: "B", titulo: "Identidad descentralizada", sub: "El voto cuadrático, «una persona, un voto», las credenciales: todo necesita saber quién es quién. ¿Puede una cadena pública responder eso sin volverse una base de datos de personas?", minutos: "APROXIMADAMENTE 20 MINUTOS", ic: "persona" }).then(s => s.addNotes("Bloque B: 20 minutos. Es la base del ensayo: dejar que discutan en B.4."));

  {
    const s = await D.lamina({ kicker: "B.1 · DID", titulo: "Un identificador que nadie te puede quitar", ic: "persona", tituloSize: 26 });
    D.parrafo(s, "Hoy tu identidad digital la guardan plataformas: el correo institucional, la cuenta del banco, el «iniciar sesión con…». Si la plataforma cierra tu cuenta, desapareces. Un DID es un identificador que controlas tú con una clave.", { y: 1.9, h: 0.95, size: 14 });
    D.definicion(s, "did : ethr : 0xb9c5714089478a327f09197987f16f9e5d936e8a\n  esquema   método   identificador propio del método", { x: M, y: 3.0, w: CW, h: 0.9, size: 13 });
    D.dosColumnas(s,
      { et: "Qué hay detrás", texto: "El DID apunta a un «documento DID» con las claves públicas que lo controlan. Quien tiene la clave privada demuestra que es el dueño firmando (Sesión 3)." },
      { et: "El error de concepto típico", linea: C.rojo, color: C.rojo, texto: "«Un DID guarda mis datos en la cadena». No: un DID es un identificador y unas claves. Tus datos no tienen por qué estar en ninguna cadena, y NO deben." },
      { y: 4.1, h: 1.9, size: 12.5 });
    D.parrafo(s, "Estándar: W3C Decentralized Identifiers (DIDs) v1.0, Recomendación del 19 de julio de 2022.", { y: 6.2, h: 0.45, size: 12, color: C.ocre });
    s.addNotes("La sintaxis formal es did:<método>:<identificador-del-método> (w3.org/TR/did-core, consultado 17-09-2026). El ejemplo usa el método ethr con una dirección inventada para la clase. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · credenciales verificables", titulo: "Emisor, titular y verificador", ic: "documento", tituloSize: 27 });
    D.nodo(s, { x: M, y: 2.0, w: 3.3, h: 1.15, titulo: "EMISOR", sub: "la USB firma el\ndiploma de Ana", fill: C.blanco, line: C.violeta, subSize: 11 });
    D.flecha(s, M + 3.35, 2.57, M + 4.35, 2.57, C.tinta, 2);
    D.nodo(s, { x: M + 4.4, y: 2.0, w: 3.3, h: 1.15, titulo: "TITULAR", sub: "Ana lo guarda en\nsu billetera", fill: C.blanco, line: C.naranja, subSize: 11 });
    D.flecha(s, M + 7.75, 2.57, M + 8.75, 2.57, C.tinta, 2);
    D.nodo(s, { x: M + 8.8, y: 2.0, w: CW - 8.8, h: 1.15, titulo: "VERIFICADOR", sub: "una empresa comprueba\nla firma de la USB", fill: C.blanco, subSize: 11 });
    D.parrafo(s, "La empresa verifica la firma de la universidad sin llamar a la universidad. Ana decide a quién mostrar su diploma y cuándo. Estándar: W3C Verifiable Credentials Data Model v2.0 (Recomendación, 15 de mayo de 2025).", { y: 3.45, h: 0.95, size: 13.5 });
    D.tabla(s, ["qué va dónde", "en la cadena", "fuera de la cadena"], [
      ["El diploma con nombre y cédula", "NUNCA", "En la billetera de Ana"],
      ["La clave pública de la USB (su DID)", "Puede ir", "—"],
      ["«Este diploma fue revocado»", "Un registro de revocación, sin datos personales", "—"],
    ], { y: 4.55, h: 2.1, colW: [4.2, 4.2, 3.693], size: 11.5 });
    s.addNotes("Conectar con el DiplomaUSB de la Sesión 11 y con el CertificadosUSB de la S6, que guardaba solo el hash del documento. Es la misma idea con estándar W3C. Fuente: w3.org/TR/vc-data-model-2.0 (consultado 17-09-2026). 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · soulbound tokens", titulo: "Un NFT que no se puede vender", ic: "candado", tituloSize: 28 });
    D.parrafo(s, "Un SBT es un token atado a una cuenta: no se transfiere. La idea se popularizó en 2022 (Weyl, Ohlson y Buterin, «Decentralized Society») y tiene un estándar mínimo, ERC-5192, donde locked(tokenId) = true bloquea toda transferencia.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "Para qué sirve", items: ["Asistencia a un evento, un curso aprobado.", "Pertenencia a una comunidad.", "Base para «una persona, un voto».", "Reputación que no se puede comprar."] },
      { et: "Lo que sale mal", linea: C.rojo, color: C.rojo, items: ["Si pierdes la clave, pierdes la credencial.", "Es público para siempre: todos ven tu historial.", "Puede marcar negativamente («deudor», «sancionado»).", "No se puede borrar si fue un error."] },
      { y: 3.05, h: 2.45, size: 12.5 });
    D.parrafo(s, "La tercera fila de la derecha es la que nos lleva a la ley colombiana.", { y: 5.75, h: 0.5, size: 13, color: C.ocre });
    s.addNotes("ERC-5192 «Minimal Soulbound NFTs», estado Final, creado el 01-07-2022 (eips.ethereum.org/EIPS/eip-5192, consultado 17-09-2026). El artículo de Weyl, Ohlson y Buterin es de mayo de 2022 (SSRN); no se pudo abrir la página de SSRN al verificar: ⚠ VERIFICAR ANTES DE DICTAR la fecha exacta si se va a citar. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · la tensión difícil", titulo: "Inmutable frente a habeas data", ic: "balanza", tituloSize: 27 });
    D.tabla(s, ["norma colombiana", "lo que garantiza", "choque con una cadena pública"], [
      ["Constitución, art. 15", "Derecho a conocer, actualizar y rectificar la información que se tenga sobre uno.", "Lo escrito en la cadena no se rectifica: solo se añade encima."],
      ["Ley 1581 de 2012, art. 8", "Solicitar la SUPRESIÓN del dato y revocar la autorización.", "No existe forma técnica de suprimir un dato de todos los nodos."],
      ["Ley 1266 de 2008 (mod. Ley 2157 de 2021)", "El dato negativo de crédito tiene permanencia máxima: el doble de la mora, hasta 4 años.", "Un SBT de «deudor» seguiría visible después del plazo legal."],
    ], { y: 1.9, h: 3.0, colW: [3.0, 4.6, 4.493], size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Discutan dos minutos en parejas", x: M, y: 5.1, w: CW, h: 1.6, texto: "Una cooperativa de Medellín quiere emitir SBT de «buen pagador» y de «mal pagador» para abaratar el crédito. ¿Qué parte es legal? ¿Qué parte es imposible de cumplir en una cadena pública? ¿Qué rediseñarían?", size: 13 });
    s.addNotes("Fuentes (consultadas 17-09-2026): Ley 1581 de 2012 en secretariasenado.gov.co/senado/basedoc/ley_1581_2012.html; Ley 2157 de 2021 en suin-juriscol.gov.co (permanencia del dato negativo: el doble de la mora, máximo 4 años desde el pago) y concepto de la SIC «Permanencia del dato negativo (Ley 2157 de 2021)». Respuesta esperada: la de «buen pagador» es posible con consentimiento; la de «mal pagador» choca con la permanencia máxima y la supresión. Rediseño: credenciales fuera de cadena con registro de revocación. No es asesoría jurídica. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · salidas de diseño", titulo: "Parches honestos, ninguno perfecto", ic: "engranaje", tituloSize: 27 });
    D.tabla(s, ["salida", "qué resuelve", "qué NO resuelve"], [
      ["Solo el hash en la cadena (S6)", "El dato personal no se publica; se prueba la integridad del documento.", "Un hash de un dato adivinable (una cédula) se puede revertir probando."],
      ["Credencial fuera de cadena + registro de revocación", "El titular guarda sus datos; el emisor puede revocar.", "Revocar no es borrar: el historial de revocaciones sigue siendo público."],
      ["Divulgación selectiva / pruebas de conocimiento cero", "Probar «soy mayor de edad» sin mostrar la fecha de nacimiento.", "Complejidad técnica; aún poco adoptado; depende de emisores confiables."],
    ], { y: 1.9, h: 3.2, colW: [3.3, 4.4, 4.393], size: 11.5 });
    D.enunciado(s, "La regla del curso no cambia: en una cadena pública no van datos personales. Ni cifrados, ni «por ahora».", { y: 5.35, h: 1.3, size: 17, line: C.naranja });
    s.addNotes("Error típico: «lo cifro y lo pongo en la cadena». El cifrado de hoy puede romperse mañana, y el dato cifrado sigue siendo dato personal para la ley. Las pruebas de conocimiento cero vuelven en la Sesión 16 (ZK-rollups). 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · verificación del bloque B", titulo: "Pregunta de control", ic: "pregunta", tituloSize: 29 });
    D.enunciado(s, "La universidad propone publicar en Sepolia, como SBT, el diploma de cada egresado con su nombre y su promedio. Den dos razones para no hacerlo y una alternativa que conserve la verificación.", { y: 1.9, h: 2.0, size: 18, line: C.naranja });
    await D.ficha(s, { tipo: "termino", etiqueta: "Respuesta esperada", x: M, y: 4.15, w: CW, h: 2.55, texto: "(1) Nombre y promedio son datos personales: la Ley 1581 da derecho a suprimirlos, y en la cadena no se puede. (2) Queda público para siempre y atado a una cuenta: cualquiera reconstruye el historial del egresado. Alternativa: credencial verificable firmada por la USB que el egresado guarda y muestra cuando quiere; en la cadena, a lo sumo, el hash del documento y un registro de revocación (el patrón de las Sesiones 6 y 11).", size: 12.5 });
    s.addNotes("Dos minutos en parejas. Si alguien dice «lo cifro», volver a B.5.");
  }

  /* ================================================================ C */
  await D.divisor({ letra: "C", titulo: "Laboratorio 15", sub: "Una DAO completa que gobierna una tesorería, con timelock: armarla, probar sus defensas, recorrer el ciclo con tiempo simulado y dejar evidencia en Sepolia. Y un multisig 2 de 3.", minutos: "APROXIMADAMENTE 70 MINUTOS · EN PAREJAS", ic: "martillo" }).then(s => s.addNotes("Bloque C: 70 minutos. Guía completa: laboratorios-evm/guias/s15-gobernanza-dao.pdf. Lo que no se termine en clase se termina en casa con la guía."));

  {
    const s = await D.lamina({ kicker: "C.1 · qué hay en el repositorio", titulo: "Cinco contratos, tres archivos de pruebas", ic: "capas", tituloSize: 26 });
    D.tabla(s, ["archivo", "qué es", "¿lo completan?"], [
      ["contracts/s15/TokenVoto.sol", "ERC20Votes: saldos, historial y delegación.", "No: se lee"],
      ["contracts/s15/GobiernoUSB.sol", "Governor + GovernorTimelockControl.", "No: se lee"],
      ["contracts/s15/TimelockUSB.sol", "TimelockController de OpenZeppelin.", "No: se lee"],
      ["contracts/s15/Tesoreria.sol", "Fondos cuyo dueño es el timelock.", "No: se lee"],
      ["contracts/s15/MultisigUSB.sol", "Multisig mínimo m de n.", "SÍ · TODO 1 y 2"],
      ["test/s15/Gobierno.test.js", "11 pruebas de estructura y defensas.", "No: deben pasar ya"],
      ["test/s15/CicloGobierno.test.js", "El ciclo completo con tiempo simulado.", "SÍ · TODO 1 a 5"],
      ["test/s15/Multisig.test.js", "11 pruebas del multisig.", "No: son la meta"],
    ], { y: 1.85, h: 4.4, colW: [4.1, 5.0, 2.993], size: 11 });
    D.parrafo(s, "Los contratos del Governor casi no tienen lógica propia: son OpenZeppelin bien armado. Lo que se aprende es a MONTARLO y a recorrerlo.", { y: 6.35, h: 0.45, size: 12, color: C.ocre });
    s.addNotes("Mostrar el árbol en el editor. Aclarar que andamiaje/s15 tiene las versiones con TODO y que se copian encima según la guía (sección 3). 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · parte 1 · armar la DAO", titulo: "El orden del despliegue importa", ic: "jerarquia", tituloSize: 27 });
    D.codigo(s, `const token    = await ethers.deployContract("TokenVoto");
const timelock = await ethers.deployContract("TimelockUSB",
                   [3600, [], [ethers.ZeroAddress], fundador.address]);
const gobierno = await ethers.deployContract("GobiernoUSB", [token, timelock]);

await timelock.grantRole(await timelock.PROPOSER_ROLE(),  gobierno);
await timelock.grantRole(await timelock.CANCELLER_ROLE(), gobierno);
await timelock.renounceRole(await timelock.DEFAULT_ADMIN_ROLE(), fundador.address);

const tesoreria = await ethers.deployContract("Tesoreria", [timelock]);`, { x: M, y: 1.85, w: CW, h: 3.5, lang: "js", titulo: "la función desplegarDAO() de las pruebas", size: 11.5 });
    D.pasos(s, [
      ["HUEVO Y GALLINA", "El timelock necesita al Governor como proponente, y el Governor necesita al timelock: por eso el fundador es admin un momento."],
      ["RENUNCIAR", "Lo último: renunciar al rol admin. Después, nadie tiene llaves maestras."],
    ], { y: 5.5, alto: 0.58, gap: 0.08, anchoEt: 2.5, size: 11.5 });
    s.addNotes("Correr en vivo: npx hardhat test test/s15/Gobierno.test.js → «11 passing». Si falla aquí, el problema es de instalación, no del estudiante. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · parte 2 · el ciclo con tiempo simulado", titulo: "Completar CicloGobierno.test.js", ic: "reloj", tituloSize: 26 });
    D.codigo(s, `await token.connect(ana).delegate(ana.address);  await mine(1);   // TODO 1a
await gobierno.connect(ana).propose(targets, values, calldatas, descripcion); // 1b
await mine(2);                                                   // TODO 2a · Active
await gobierno.connect(ana).castVote(id, VOTO.AFavor);           // TODO 2b
await mine(51);                                                  // TODO 2c · Succeeded
await gobierno.queue(targets, values, calldatas, hashDescripcion);   // 3a · Queued
await time.increase(RETARDO + 1);                   // TODO 3b · segundos, no bloques
await gobierno.execute(targets, values, calldatas, hashDescripcion); // ya escrito`, { x: M, y: 1.85, w: CW, h: 3.0, lang: "js", titulo: "prueba 1: la forma de la solución · TODO 4 y 5 son las otras dos pruebas ★", size: 11 });
    D.tabla(s, ["momento", "salida esperada de npx hardhat test test/s15/CicloGobierno.test.js"], [
      ["al empezar", "2 passing · 3 failing (las tres marcadas con ★)"],
      ["al terminar", "5 passing · 0 failing: la parte 2 está lista"],
    ], { y: 5.05, h: 1.1, colW: [2.2, 9.893], size: 11.5 });
    D.parrafo(s, "Cómo saber que terminó: las 5 en verde, y pueden explicar por qué mine() mueve la votación y time.increase() el timelock.", { y: 6.25, h: 0.5, size: 12, color: C.ocre });
    s.addNotes("No proyectar esta lámina hasta que hayan intentado 10 minutos: es casi la solución. Los números salen de correr la solución y el andamiaje el 17-09-2026. 20 minutos de trabajo en parejas.");
  }

  {
    const s = await D.lamina({ kicker: "C.4 · parte 3 · multisig", titulo: "MultisigUSB en local, Safe en Sepolia", ic: "llave", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "3a · MultisigUSB (red local)", items: ["Copiar andamiaje/s15/MultisigUSB.sol sobre contracts/s15/.", "Completar TODO 1 confirmar() y TODO 2 ejecutar().", "Al empezar: 4 passing · 7 failing.", "Al terminar: 11 passing."] },
      { et: "3b · Safe 2 de 2 en Sepolia", items: ["Dos billeteras del curso con ETH de prueba (una por integrante).", "Crear el Safe en app.safe.global con umbral 2.", "Proponer enviar 0,001 ETH; el otro confirma; ejecutar.", "Evidencia: hash de la ejecución en el explorador."] },
      { y: 1.9, h: 3.05, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Si no hay ETH de prueba", x: M, y: 5.2, w: CW, h: 1.5, texto: "La parte 3b es la única que depende de la red. Si el faucet falla, se entrega la 3a con sus 11 pruebas en verde y se documenta el flujo de Safe con capturas del intento. Nunca con dinero real, nunca con la billetera personal.", size: 12.5 });
    s.addNotes("Verificado el 17-09-2026: Safe soporta Sepolia; OP Sepolia no aparece en su lista de redes. El despliegue de un Safe con 2 firmantes paga gas (ETH de prueba). ⚠ VERIFICAR ANTES DE DICTAR. 20 minutos entre 3a y 3b.");
  }

  {
    const s = await D.lamina({ kicker: "C.5 · parte 4 · evidencia en cadena", titulo: "La misma DAO, de verdad, en Sepolia", ic: "terminal", tituloSize: 27 });
    D.codigo(s, `npx hardhat run scripts/s15/ciclo-gobierno.js                     # ensayo local: segundos
npx hardhat run scripts/s15/ciclo-gobierno.js --network sepolia   # real: unos 15 minutos`, { x: M, y: 1.85, w: CW, h: 0.95, lang: "js", size: 11.5 });
    D.codigo(s, `[  0 s] votos antes  0.0 (sin delegar no hay votos)
[  0 s] delegar      tx 0x2a80…  gas 95.622
[  0 s] proponer     tx 0x0ff9…  gas 69.694
[  0 s] votar        tx 0xde55…  gas 83.256
[  0 s] encolar      tx 0x46bd…  gas 145.311
[  0 s] ejecutar     tx 0x51ed…  gas 98.066
[  0 s] tesoreria    0.002 → 0.001 ETH`, { x: M, y: 2.95, w: 7.3, h: 2.75, lang: "py", titulo: "salida real en la red local (extracto)", size: 10.5 });
    D.lista(s, [
      "En Sepolia una sola cuenta hace todo: es para ver el ciclo en cadena, no una comunidad.",
      "Espera ~10 min de votación (50 bloques) y 2 min de timelock.",
      "Usa el keystore: SEPOLIA_RPC_URL y SEPOLIA_PRIVATE_KEY.",
    ], { x: M + 7.55, y: 2.95, w: CW - 7.55, h: 2.75, size: 12, gap: 6 });
    D.parrafo(s, "Cómo saber que terminó: la última línea muestra la tesorería bajando 0,001 ETH y el estado Executed. Los hashes van al informe.", { y: 5.95, h: 0.7, size: 12.5, color: C.ocre });
    s.addNotes("Salida real de la corrida local del 17-09-2026 (los hashes locales cambian en cada corrida). Arrancarlo en Sepolia al principio de la parte 3, porque tarda: mientras vota y espera, trabajan en el multisig. 5 minutos de explicación.");
  }

  {
    const s = await D.lamina({ kicker: "C.6 · errores frecuentes", titulo: "Lo que atasca a casi todos", ic: "alerta", tituloSize: 28 });
    D.tabla(s, ["síntoma", "causa y solución"], [
      ["El voto se emite, pero la propuesta sale Defeated", "Nadie delegó, o se delegó después del snapshot. Delegar y mine(1) ANTES de proponer."],
      ["execute() revierte con TimelockUnexpectedOperationState", "No se esperó el timelock, o se avanzó con mine(). El retardo es en segundos: time.increase."],
      ["execute() revierte con OwnableUnauthorizedAccount", "La tesorería tiene de dueño al Governor. Debe ser el timelock."],
      ["queue() revierte con GovernorNonexistentProposal", "El hash de la descripción no coincide: un espacio de más cambia el id."],
      ["state() revierte con GovernorNonexistentProposal", "Se calculó el id pero nunca se llamó propose()."],
      ["Error HHE… de configuración al usar --network sepolia", "Falta una variable del keystore: npx hardhat keystore set SEPOLIA_RPC_URL."],
    ], { y: 1.85, h: 4.85, colW: [4.9, 7.193], size: 11 });
    s.addNotes("Todos estos errores se provocaron a propósito al preparar el laboratorio; la guía PDF trae la tabla ampliada. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "C.7 · entrega del laboratorio", titulo: "Qué se entrega y cómo se califica", ic: "bandera", tituloSize: 27 });
    D.tabla(s, ["evidencia", "peso"], [
      ["Gobierno.test.js 11/11 y CicloGobierno.test.js 5/5 en verde (captura con el comando visible)", "30 %"],
      ["MultisigUSB: Multisig.test.js 11/11 en verde", "20 %"],
      ["Evidencia en Sepolia: direcciones y hashes de ciclo-gobierno.js (o del Safe 2 de 2)", "25 %"],
      ["Reflexión: respuestas a las preguntas de la guía, con datos de SU corrida", "25 %"],
    ], { y: 1.9, h: 2.9, colW: [10.093, 2.0], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Dónde está todo", x: M, y: 5.05, w: CW, h: 1.65, texto: "Guía paso a paso: laboratorios-evm/guias/s15-gobernanza-dao.pdf, con preparación, salidas esperadas, errores y rúbrica. Se entrega en el repositorio del equipo antes de la Sesión 16. Política del curso: sin evidencia verificable, el laboratorio no se califica.", size: 12.5 });
    s.addNotes("El laboratorio es parte del 4 % de «Laboratorios S14–S16» del tercer corte. 2 minutos.");
  }

  /* ================================================================ D */
  await D.divisor({ letra: "D", titulo: "El ensayo individual (RA7)", sub: "La única pieza estrictamente individual y escrita del curso: pensar en serio una implicación del ecosistema, anclada en Colombia, con postura propia.", minutos: "APROXIMADAMENTE 20 MINUTOS · SE ENTREGA EN LA S17", ic: "documento" }).then(s => s.addNotes("Bloque D: 20 minutos. Documento público con todo el detalle: material/proyecto/ensayo-individual.pdf."));

  {
    const s = await D.lamina({ kicker: "D.1 · el encargo", titulo: "1 500 palabras, una postura sostenida", ic: "documento", tituloSize: 27 });
    D.tabla(s, ["", "detalle"], [
      ["Qué es", "Análisis crítico de UNA implicación —regulatoria, ética, económica o ambiental— aplicada a Colombia."],
      ["Extensión", "1 500 palabras (±10 %), sin contar referencias ni la declaración de IA."],
      ["Fuentes", "Mínimo 5, leídas; al menos 2 primarias (norma, documento oficial, artículo académico) y 1 colombiana."],
      ["Postura", "Una tesis propia, sustentada, que reconoce el mejor argumento contrario y le responde."],
      ["IA", "Permitida y declarada con el formato del documento. No declararla anula el ensayo."],
      ["Fechas y peso", "Se plantea hoy (S15), se entrega en la S17. 20 % del tercer corte = 8 % de la nota final."],
    ], { y: 1.85, h: 4.1, colW: [2.2, 9.893], size: 11.5 });
    D.parrafo(s, "Todo el detalle —rúbrica, formato, temas— en material/proyecto/ensayo-individual.pdf.", { y: 6.15, h: 0.5, size: 12.5, color: C.ocre });
    s.addNotes("El peso sale de la sección 9 del plan: ensayo individual 20 % del tercer corte (40 %) = 8 % del total. Evalúa RA7. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "D.2 · qué distingue un buen ensayo", titulo: "Postura, no resumen", ic: "balanza", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Un ensayo flojo", linea: C.rojo, color: C.rojo, items: ["Explica otra vez qué es blockchain.", "Lista pros y contras y no decide.", "Cita sin haber leído, o no cita.", "Podría ser sobre cualquier país."] },
      { et: "Un buen ensayo", items: ["Tesis clara en el primer párrafo.", "Fuentes reales, leídas y discutidas.", "Anclado en Colombia: una ley, un caso, un dato.", "Responde al mejor argumento contrario."] },
      { y: 1.9, h: 2.5, size: 13 });
    D.codigo(s, `DECLARACIÓN DE USO DE IA
Herramienta y versión: ______   ·   Fecha(s): ______
Para qué la usé: [ ] buscar fuentes  [ ] resumir  [ ] corregir estilo  [ ] contraargumentos  [ ] otro: ___
Qué NO hizo: la tesis, la estructura y la conclusión son mías.
Anexo: las instrucciones (prompts) principales que usé.`, { x: M, y: 4.6, w: CW, h: 2.1, lang: "py", titulo: "la declaración obligatoria, al final del ensayo", size: 10.5 });
    s.addNotes("Mismo criterio de la actividad de Estonia: una afirmación sostenida con evidencia vale más que un resumen equilibrado que no arriesga nada. Lo que no se acepta: un texto que no se pensó, o citar fuentes que no se abrieron. El docente puede pedir una defensa oral de 5 minutos. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "D.3 · temas y rúbrica", titulo: "Por dónde empezar", ic: "lupa", tituloSize: 29 });
    D.tabla(s, ["eje", "tema sugerido (hay más en el documento)"], [
      ["Ético", "Identidad on-chain y habeas data: ¿puede una credencial pública respetar la Ley 1581?"],
      ["Regulatorio", "¿Basta el reporte a la UIAF para proteger a los usuarios de plataformas de intercambio? (S16)"],
      ["Económico", "Remesas hacia Colombia con stablecoins: ¿inclusión real o nuevo riesgo?"],
      ["Ambiental", "¿Tiene sentido la minería de prueba de trabajo con energía hidroeléctrica colombiana?"],
    ], { y: 1.85, h: 2.6, colW: [2.0, 10.093], size: 11.5 });
    D.tabla(s, ["criterio de la rúbrica", "peso"], [
      ["Tesis y postura propia sustentada", "30 %"],
      ["Argumentación y contraargumento", "25 %"],
      ["Uso de fuentes (calidad, lectura real, citación)", "20 %"],
      ["Anclaje en Colombia", "15 %"],
      ["Escritura y declaración de IA", "10 %"],
    ], { y: 4.6, h: 2.1, colW: [10.093, 2.0], size: 11 });
    s.addNotes("Los temas son sugerencias; se acepta cualquier otro del curso con aprobación por correo antes de la S16. La rúbrica completa, con niveles, está en el PDF. 5 minutos.");
  }

  await D.preguntaSemana({
    pregunta: "Elijan el eje de su ensayo y escriban en UNA frase la postura que van a defender. Si no cabe en una frase, aún no la tienen.",
    trabajo: [
      "Laboratorio 15: las cuatro partes y la reflexión, en el repositorio antes de la S16 (guía PDF).",
      "Ensayo individual: tesis en una frase y 5 fuentes elegidas esta semana. Entrega en la S17.",
      "Avance 2 (S16): la dApp integrada con el flujo completo funcionando.",
      "Traer ETH de prueba en Sepolia: la S16 despliega en Sepolia y en OP Sepolia.",
    ],
    notas: "La frase de la postura se revisa al comienzo de la S16 (2-3 voluntarios). Recordar que la S16 necesita ETH de prueba en Sepolia para puentear a OP Sepolia si los faucets fallan.",
  });

  const cierre = await D.cierre({
    frase: "Gobernar sin jefe no elimina el poder: lo vuelve visible y lo pone en el código.",
    sub: "Ya no es quién manda, es quién tiene los votos, cuándo se cuentan y cuánto hay que esperar. Falta situarlo en el mundo: cuánto escala, cuánto cuesta y qué dice la ley colombiana.",
    proxima: "Sesión 16 · Escalabilidad, puentes y marco regulatorio · Avance 2",
  });
  cierre.addNotes("Volver a la lámina de objetivos y pedir una respuesta en una frase por pregunta. Cierre: 2 minutos.");

  return D.guardar(path.join(__dirname, "Sesion-15-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
