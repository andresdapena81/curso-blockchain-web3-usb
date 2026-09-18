/* =====================================================================
   Sesión 05 · Ethereum y la Máquina Virtual (EVM)

   Estructura fijada por el docente («la cinco sigue igual»):
     E · exposiciones del caso Estonia  ~45 min
     A · la máquina de estados          ~60 min
     B · laboratorio 05                 ~60 min
     C · cierre                         ~15 min
   Lo que cambió respecto a la versión anterior es la profundidad dentro
   de cada bloque, no el orden ni los tiempos.

   Cifras reales usadas en el deck (todas calculadas, no estimadas):
   - Mediciones de gas: scripts/s05/medir-gas.js en la red local de Hardhat
     3.16 / Solidity 0.8.28 / optimizador 200.
   - Transacciones y bloques de Sepolia consultados por RPC el 17-sep-2026
     (bloques 11 727 239 a 11 727 246). La fórmula de EIP-1559 reproduce la
     tarifa base del bloque siguiente en los nueve bloques revisados.
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 05 · ETHEREUM Y LA MÁQUINA VIRTUAL", titulo: "Sesión 05 · Ethereum y la EVM" });
  const { C, F, M, CW } = D;

  /* Seis ideas numeradas: el cierre de cada bloque conceptual */
  function ideas(s, lista, size = 14) {
    lista.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* Lámina de pregunta de verificación al cierre de un bloque */
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
    kicker: "SESIÓN 05 · UNIDAD II · ETHEREUM Y CONTRATOS",
    titulo: "ETHEREUM\nY LA MÁQUINA\nVIRTUAL",
    sub: "Un computador que nadie apaga, que todos ejecutan a la vez, y en el que cada instrucción tiene precio.",
    palabra: "EJECUTAR",
    ic: "engranaje",
    notas: "Arranca la Unidad II. Hasta ahora la cadena guardaba transacciones de valor; desde hoy guarda y ejecuta programas. Abrir con la pregunta de la semana de la S4 (el 40 % del stake en manos de un gobierno): dos respuestas en voz alta, un minuto, y a las exposiciones.",
  });

  await D.agenda({
    intro: "Sesión de transición: se cierra el caso Estonia y empieza la Unidad II, la columna vertebral del curso.",
    bloques: [
      ["E", "EXPOSICIONES · CASO ESTONIA", "Cinco minutos por equipo, preguntas y síntesis.", "~45 min"],
      ["A", "LA MÁQUINA DE ESTADOS", "Cuentas, transacciones, gas, EIP-1559 y la EVM por dentro.", "~60 min"],
      ["B", "LABORATORIO 05", "Análisis forense de transacciones reales y medición de gas.", "~60 min"],
      ["C", "CIERRE", "Evidencia, pregunta de la semana y lo que trae Solidity.", "~15 min"],
    ],
    notas: "180 minutos: 45 + 60 + 60 + 15. Si las exposiciones se alargan, en el bloque A se pueden saltar A.16 (la pila) y A.19 (descomponer una medición): el laboratorio vuelve sobre ellas y están completas en el deck para repasar.",
  });

  await D.objetivo({
    objetivo: "Entender Ethereum como máquina de estados replicada y leer en un explorador el costo real de una transacción.",
    preguntas: [
      "¿Qué cambia al pasar de un registro de pagos a un computador compartido?",
      "¿Qué contiene exactamente una transacción, y qué hace cada campo?",
      "¿Por qué cada instrucción cuesta gas, y cómo se fija su precio?",
      "¿Por qué escribir un dato cuesta cien veces más que sumar dos números?",
    ],
    ra: "RA2 · arquitectura y costos  ·  RA3 · base para programar contratos (complementario)",
    notas: "Leer las cuatro preguntas en voz alta. Al final del bloque A se vuelve a ellas: si alguien no puede responder la cuarta con un número, el bloque no cumplió.",
  });

  await D.glosario({
    items: [
      ["EVM", "Ethereum Virtual Machine", "La máquina virtual que ejecutan todos los nodos. Mismo programa + mismo estado = mismo resultado en todos."],
      ["EOA", "Externally Owned Account", "Cuenta controlada por una clave privada. Es la única que puede iniciar una transacción."],
      ["UTXO", "Unspent Transaction Output", "Salida de transacción no gastada: el modelo de Bitcoin, sin saldos, solo «billetes» por gastar."],
      ["wei · gwei", "unidades de ether", "1 ETH = 10¹⁸ wei. 1 gwei = 10⁹ wei. Todo se calcula en enteros: no hay decimales en la EVM."],
      ["Gas", "unidad de trabajo computacional", "Cada instrucción consume una cantidad fija. Se paga en ETH según el precio del momento."],
      ["EIP-1559", "Ethereum Improvement Proposal 1559", "Mecanismo de tarifa desde 2021: una tarifa base que se quema más una propina para el validador."],
      ["Opcode", "código de operación", "Instrucción elemental de la EVM: ADD, SLOAD, SSTORE, CALL… Cada una con su costo en gas."],
      ["ABI", "Application Binary Interface", "La convención para codificar qué función se llama y con qué argumentos dentro del campo data."],
    ],
    notas: "No leer el glosario: dejarlo proyectado 30 segundos y avisar que es la lámina a la que hay que volver cuando una sigla se pierda. EIP se lee «propuesta de mejora de Ethereum»: el mecanismo público por el que cambia el protocolo.",
  });

  /* =============================================================== E */
  {
    const s = await D.divisor({ letra: "E", titulo: "Exposiciones · el caso Estonia", sub: "Cinco minutos por equipo. Veredicto al frente, la mejor evidencia en pantalla, y la fuente abierta para responder.", minutos: "APROXIMADAMENTE 45 MINUTOS", ic: "lupa" });
    s.addNotes("Tener abierta la guía de la actividad (actividad-04-estonia) y el cronómetro visible. La rúbrica que se proyecta en E.2 es la misma de la sección 07 de esa guía: nada nuevo, solo recordarla.");
  }

  {
    const s = await D.lamina({ kicker: "E.1 · la dinámica", titulo: "Cómo corren las exposiciones", ic: "reloj", tituloSize: 29 });
    D.pasos(s, [
      ["ORDEN", "Por sorteo, no voluntario. Se anuncia el orden completo antes de empezar para que nadie se prepare mientras otro expone."],
      ["CINCO MINUTOS", "Cronómetro visible. Al minuto 5 se corta, sin excepción: elegir qué mostrar es parte de lo que se evalúa."],
      ["UNA PREGUNTA", "Cualquier persona del curso pregunta de dónde salió un dato. El equipo abre la fuente y señala el lugar (E.3)."],
      ["REGISTRO", "Mientras un equipo expone, los demás anotan su veredicto en una línea. Lo usamos en la síntesis."],
    ], { y: 1.9, alto: 0.95, gap: 0.14, anchoEt: 2.6, size: 13 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Lo que se evalúa en este momento", x: M, y: 5.98, w: CW, h: 0.86, texto: "El 10 % de exposición de la rúbrica. El documento escrito se califica aparte.", size: 12.5 });
    s.addNotes("Con 6 equipos: 6 × (5 + 2) = 42 minutos. Con más de 6, bajar la pregunta a una sola por cada dos equipos. Sorteo con papeles o con el número de equipo: nunca 'quién quiere empezar'.");
  }

  {
    const s = await D.lamina({ kicker: "E.2 · la rúbrica de los cinco minutos", titulo: "Qué se espera en cada minuto, y cómo se califica", ic: "lista", tituloSize: 24 });
    D.tabla(s, ["tiempo", "qué muestran", "qué distingue una buena exposición"], [
      ["0:00 – 0:30", "El veredicto: sí, no, o depende de una definición dicha.", "Se dice de entrada, sin suspenso. «Depende» sin definición no es veredicto."],
      ["0:30 – 1:30", "La definición operativa de «cadena de bloques».", "Propiedades verificables una por una, no una frase de diccionario."],
      ["1:30 – 3:30", "La mejor evidencia: UNA, en pantalla.", "Captura con fecha, cita literal o comparación de versiones que se puede localizar."],
      ["3:30 – 4:15", "El límite: qué NO pueden concluir.", "No confundir «el folleto exagera» con «la tecnología no sirve»."],
      ["4:15 – 5:00", "La proyección (T6): un problema de su entorno.", "Enunciado sin nombrar la tecnología."],
    ], { y: 1.9, h: 3.35, colW: [1.9, 4.6, 5.593], size: 11 });
    D.tabla(s, ["criterio del 10 %", "5,0", "3,0", "0"], [
      ["Tiempo y estructura", "Veredicto antes de 0:30 y termina a tiempo.", "Veredicto tardío o se corta a medias.", "Sin veredicto."],
      ["Respuesta a la pregunta", "Abre la fuente y señala el lugar exacto.", "Encuentra la fuente, no el lugar.", "No la puede abrir."],
    ], { y: 5.4, h: 1.38, colW: [2.9, 3.4, 3.2, 2.593], size: 10.5 });
    s.addNotes("Es la estructura sugerida de la sección 06 de la guía de la actividad y el criterio de exposición (10 %) de la sección 07. Calificar cada criterio de 0 a 5 y promediar. El resto de la nota (evidencia 30 %, veredicto 25 %, fuentes 20 %, honestidad 15 %) se califica en el documento escrito, no aquí.");
  }

  {
    const s = await D.lamina({ kicker: "E.3 · el protocolo de preguntas", titulo: "¿De dónde salió ese dato?", ic: "pregunta", tituloSize: 29 });
    D.pasos(s, [
      ["LA PREGUNTA", "Una sola, y siempre sobre un dato concreto: «el conteo de la tarea T1», «la fecha de la captura», «esa cita del artículo». No se vale preguntar opiniones."],
      ["60 SEGUNDOS", "El equipo abre la fuente en pantalla y señala el lugar: página, párrafo, captura con fecha. Puede responder cualquier integrante."],
      ["SI LO ENCUENTRA", "Se anota «evidencia localizada». Es lo que hace creíble todo lo demás que dijeron."],
      ["SI NO LO ENCUENTRA", "Se anota «no localizada» y el docente revisa ese punto en el documento: pesa en el 30 % de evidencia verificable."],
    ], { y: 1.9, alto: 0.86, gap: 0.12, anchoEt: 2.6, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La única pregunta que hace siempre el docente", x: M, y: 5.8, w: CW, h: 0.98, texto: "«¿Qué NO pueden concluir con esa evidencia?» Se responde en una frase. Es el criterio de honestidad intelectual.", size: 12.5 });
    s.addNotes("Coherente con la caja 'Habrá preguntas' de la guía: 'un equipo que no puede hacerlo no reunió la evidencia: la contó'. Si nadie del curso pregunta, pregunta el docente por el dato más fuerte que mostraron. Dos minutos por equipo, cronometrados.");
  }

  {
    const s = await D.lamina({ kicker: "E.4 · síntesis", titulo: "Lo que quedó demostrado y lo que no", ic: "balanza", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Hechos verificables", items: ["El whitepaper de Bitcoin no contiene la palabra «blockchain».", "El FAQ oficial reconoce que se llamaba «hash-linked time-stamping».", "El artículo de Guardtime ancla la confianza en publicaciones periódicas en medios, incluidos periódicos.", "Los propios autores citan a Haber y Stornetta como origen de la técnica."] },
      { et: "Juicios que dependen de la definición", items: ["Si «cadena de bloques» exige participación abierta y consenso entre desconocidos, KSI no lo es.", "Si basta con encadenamiento criptográfico verificable, sí lo es.", "En ningún caso el error del folleto prueba que KSI sea mala tecnología."] },
      { y: 1.9, h: 3.55, size: 12.5 });
    D.enunciado(s, "Un veredicto bien sostenido no es el que acierta: es el que dice qué definición usó y qué no puede concluir.", { y: 5.65, h: 1.05, size: 16, line: C.naranja });
    s.addNotes("Destacar los equipos que escribieron bien el párrafo del límite. Si alguno confundió 'el folleto exagera' con 'la tecnología no sirve', corregirlo aquí sin nombrarlo. Puente al bloque A: hoy vamos a ver qué tiene Ethereum que KSI no tiene (ejecución replicada entre desconocidos) y cuánto cuesta eso.");
  }

  await verificacion({
    kicker: "E.5 · cierre del bloque E",
    pregunta: "Un equipo concluye: «como el FAQ oficial se equivocó sobre el whitepaper, el sistema KSI no es confiable». ¿Qué está mal en ese razonamiento?",
    opciones: [
      "Nada: si la fuente oficial se equivoca, todo el sistema queda en duda.",
      "Confunde un error en el material de mercadeo con una falla técnica del sistema.",
      "El FAQ no se equivocó: el whitepaper sí usa la palabra «blockchain».",
    ],
    pista: "Respuesta en voz alta y en una frase. Vale lo mismo que el párrafo del límite de la tarea T5.",
    notas: "Respuesta: B. Es el error que la guía anuncia que resta en honestidad intelectual. La C es falsa (T1: el whitepaper usa 'chain of blocks' y no 'blockchain'). Treinta segundos: es para cerrar el bloque, no para abrir otra discusión.",
  });

  /* =============================================================== A */
  {
    const s = await D.divisor({ letra: "A", titulo: "La máquina de estados", sub: "Ethereum no es una moneda con extras. Es un computador compartido que, además, tiene una moneda para cobrar su uso.", minutos: "APROXIMADAMENTE 60 MINUTOS", ic: "engranaje" });
    s.addNotes("Bloque de 60 minutos y 23 láminas: ritmo de dos a tres minutos por lámina. Las que se pueden saltar si hay prisa: A.16 y A.19. Las que NO se saltan: A.13 a A.15 (gas con números reales), porque son exactamente el laboratorio.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · de Bitcoin a Ethereum", titulo: "Del dinero programable al computador compartido", ic: "fusion", tituloSize: 25 });
    D.dosColumnas(s,
      { et: "Bitcoin · 2009", items: ["Un lenguaje de guion deliberadamente limitado: sin bucles.", "Pensado para una sola cosa: condiciones de gasto de monedas.", "Limitarlo es una decisión de seguridad, no un descuido."] },
      { et: "Ethereum · 2015", items: ["Propuesto por Vitalik Buterin en 2013; red en marcha en julio de 2015.", "Un lenguaje de propósito general: Turing-completo.", "Cualquier programa, siempre que alguien pague cada paso que ejecuta."] },
      { y: 1.9, h: 2.6, size: 13 });
    D.enunciado(s, "La pregunta que cambió: ya no es «¿quién le pagó a quién?», sino «¿cuál es el estado de todos los programas después de esta transacción?».", { y: 4.75, h: 1.3, size: 18 });
    D.parrafo(s, "Turing-completo trae un problema que Bitcoin evitaba: un programa puede no terminar nunca. Guarden esa idea: es la razón de ser del gas.", { y: 6.2, h: 0.55, size: 13, color: C.ocre });
    s.addNotes("Buterin, V. (2014), Ethereum White Paper. Retoma la lámina 'Turing-completo y compatibilidad con la EVM' de la S1. Error típico a desactivar: 'Ethereum es un Bitcoin más rápido'. No: resuelve otro problema.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · dos formas de llevar la cuenta", titulo: "Modelo UTXO frente a modelo de cuentas", ic: "rejilla", tituloSize: 27 });
    D.parrafo(s, "El mismo pago —Ana tiene 10 y le paga 7 a un comercio— registrado de las dos maneras:", { y: 1.9, h: 0.45, size: 14 });
    D.dosColumnas(s,
      { et: "UTXO · Bitcoin · como billetes", texto: "No existe «el saldo de Ana». Existen salidas no gastadas que su clave puede desbloquear. Para pagar 7 con un billete de 10, se gasta el billete ENTERO y se crean dos salidas nuevas: 7 para el comercio y 3 de cambio para Ana." },
      { et: "Cuentas · Ethereum · como un banco", texto: "Existe un registro global: la dirección de Ana tiene 10. Pagar 7 resta 7 de su cuenta y suma 7 a la otra. Las cuentas de contrato, además, guardan código y datos propios." },
      { y: 2.45, h: 2.35, size: 13 });
    D.nodo(s, { x: M, y: 5.0, w: 2.2, h: 0.62, titulo: "BILLETE 10", fill: C.superf });
    D.flecha(s, M + 2.2, 5.31, M + 2.8, 5.31, C.naranja, 2);
    D.nodo(s, { x: M + 2.8, y: 5.0, w: 1.45, h: 0.62, titulo: "7 → COMERCIO", fill: C.blanco, line: C.naranja, size: 9.5 });
    D.nodo(s, { x: M + 4.35, y: 5.0, w: 1.45, h: 0.62, titulo: "3 → ANA", fill: C.blanco, line: C.naranja, size: 9.5 });
    D.nodo(s, { x: M + 6.45, y: 5.0, w: 2.4, h: 0.62, titulo: "ANA: 10 → 3", fill: C.superf, line: C.violeta });
    D.nodo(s, { x: M + 9.0, y: 5.0, w: CW - 9.0, h: 0.62, titulo: "COMERCIO: 0 → 7", fill: C.superf, line: C.violeta });
    D.parrafo(s, "Error típico: creer que en Bitcoin «se descuenta del saldo». No hay saldo que descontar: el saldo que muestra una billetera es la suma de sus billetes sin gastar.", { y: 5.85, h: 0.9, size: 12.5, color: C.ocre });
    s.addNotes("Ya lo anticipamos en la S3 (se movió aquí en la versión 2 del plan). El cambio vuelve a una dirección nueva en las billeteras bien diseñadas, lo que mejora la privacidad del modelo UTXO. Preguntar: ¿qué pasa si Ana olvida crear la salida de cambio? Respuesta: esos 3 quedan como comisión para el minero.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · qué implica cada modelo", titulo: "Ninguno es mejor: resuelven cosas distintas", ic: "balanza", tituloSize: 27 });
    D.tabla(s, ["criterio", "UTXO", "cuentas"], [
      ["Privacidad", "Mejor: cada pago puede usar direcciones nuevas y no hay saldo acumulado a la vista.", "Peor: una dirección concentra todo su historial y su saldo."],
      ["Paralelismo", "Natural: dos transacciones que gastan salidas distintas no se estorban.", "Difícil: dos transacciones sobre la misma cuenta deben ordenarse."],
      ["Programabilidad", "Limitada: el estado vive repartido en salidas sueltas.", "Natural: un contrato tiene su saldo y su memoria en un solo lugar."],
      ["Repetición", "Imposible por diseño: una salida gastada ya no existe.", "Exige el contador de cuenta (nonce) que vimos en la Sesión 3."],
      ["Tamaño del estado", "El conjunto de salidas no gastadas.", "Todas las cuentas con todo su almacenamiento: crece sin parar."],
    ], { y: 1.9, h: 4.15, colW: [2.4, 4.85, 4.843], size: 11.5 });
    D.parrafo(s, "El modelo de cuentas es la condición para que existan los contratos inteligentes tal como los vamos a programar. Es su mayor ventaja y la raíz de varios problemas que veremos en seguridad.", { y: 6.2, h: 0.58, size: 12.5, color: C.ocre });
    s.addNotes("Cardano usa un UTXO extendido (eUTXO) precisamente para intentar tener programabilidad sin perder paralelismo. Mencionar solo si preguntan. La fila 'Repetición' conecta con el campo nonce de A.7 y A.9.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · la idea central", titulo: "Una máquina de estados replicada", ic: "red", tituloSize: 29 });
    D.definicion(s, "estado_nuevo  =  aplicar( estado_anterior , transacción )", { x: M, y: 1.95, w: CW, h: 0.72, size: 16 });
    const cajas = [["ESTADO σ", "Todas las cuentas: saldos, código y datos de cada contrato."], ["TRANSACCIÓN", "Una instrucción firmada: qué ejecutar y con qué valor."], ["ESTADO σ′", "El resultado. Idéntico en todos los nodos del mundo."]];
    cajas.forEach((c, i) => {
      const x = M + i * 4.15;
      D.caja(s, { x, y: 2.95, w: 3.75, h: 1.55, fill: i === 1 ? C.blanco : C.superf, line: i === 1 ? C.naranja : C.tinta, sombraColor: C.naranja, sombra: i === 1 });
      D.etiqueta(s, c[0], { x: x + 0.25, y: 3.1, w: 3.3, color: i === 1 ? C.ocre : C.tinta, size: 11 });
      D.parrafo(s, c[1], { x: x + 0.25, y: 3.5, w: 3.3, h: 0.9, size: 12.5 });
      if (i < 2) D.flecha(s, x + 3.78, 3.72, x + 4.12, 3.72, C.tinta, 2);
    });
    D.parrafo(s, "Para que miles de nodos lleguen al mismo σ′ sin comunicarse el resultado, la ejecución tiene que ser DETERMINISTA. Eso prohíbe cosas que en otros entornos son triviales:", { y: 4.75, h: 0.65, size: 13.5 });
    D.lista(s, [
      "Leer la hora exacta del computador, un archivo local o una página web.",
      "Generar números aleatorios de verdad: la aleatoriedad en cadena es un problema abierto (Sesión 9).",
      "Usar punto flotante: dos procesadores podrían redondear distinto.",
    ], { y: 5.45, h: 1.3, size: 12.5, gap: 4 });
    s.addNotes("El Yellow Paper escribe esto como σ_{t+1} ≡ Υ(σ_t, T). No hace falta la notación: sí la idea de que el estado es una función pura de la historia. Error típico: 'el contrato consulta el precio del dólar en internet'. No puede: alguien tiene que traerlo en una transacción (oráculo, S1 y S14).");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · dos tipos de cuenta", titulo: "Cuentas externas y cuentas de contrato", ic: "persona", tituloSize: 27 });
    D.tabla(s, ["", "cuenta externa (EOA)", "cuenta de contrato"], [
      ["La controla", "Quien tenga la clave privada.", "Su propio código. Nadie la controla desde fuera."],
      ["Tiene código", "No.", "Sí: el bytecode desplegado, que no se puede cambiar."],
      ["Inicia transacciones", "Sí. Es la única que puede.", "No. Solo reacciona cuando alguien la llama."],
      ["Su dirección sale de", "El hash de la clave pública (Sesión 3).", "La dirección de quien la desplegó y su contador."],
      ["Ejemplo", "Su billetera del curso.", "El contrato de entradas del proyecto del docente."],
    ], { y: 1.9, h: 3.45, colW: [2.6, 4.75, 4.743], size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La consecuencia que más sorprende", x: M, y: 5.52, w: CW, h: 1.22, texto: "Un contrato nunca hace nada por sí solo. No hay tareas programadas ni procesos de fondo: todo empieza con una persona firmando una transacción.", size: 13 });
    s.addNotes("La abstracción de cuentas (ERC-4337, Sesión 13) difumina esta frontera: billeteras que son contratos. Por eso conviene tener clara la distinción clásica primero. Desde fuera, las dos se ven igual: una dirección de 20 bytes. La única forma de distinguirlas es preguntar si tiene código (getCode).");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · el mismo concepto, con un caso", titulo: "Quién hace qué cuando Ana usa un contrato", ic: "flecha", tituloSize: 27 });
    D.nodo(s, { x: M, y: 2.0, w: 2.6, h: 1.1, titulo: "ANA · EOA", sub: "firma y paga\ntodo el gas", fill: C.blanco, line: C.naranja });
    D.flecha(s, M + 2.65, 2.55, M + 3.55, 2.55, C.tinta, 2);
    D.nodo(s, { x: M + 3.6, y: 2.0, w: 3.6, h: 1.1, titulo: "CONTRATO DE ENTRADAS", sub: "comprar()\nmsg.sender = Ana", fill: C.superf });
    D.flecha(s, M + 7.25, 2.55, M + 8.15, 2.55, C.tinta, 2);
    D.nodo(s, { x: M + 8.2, y: 2.0, w: CW - 8.2, h: 1.1, titulo: "CONTRATO DEL TOKEN", sub: "transferFrom()\nmsg.sender = el contrato", fill: C.superf, line: C.violeta });
    D.pasos(s, [
      ["UNA TRANSACCIÓN", "Ana firma UNA transacción dirigida al contrato de entradas. Todo lo que pase después ocurre dentro de ella."],
      ["LLAMADA INTERNA", "El contrato de entradas llama al del token. Eso no es una transacción nueva: es un mensaje dentro de la misma."],
      ["TODO O NADA", "Si el token revierte, se deshace también lo que hizo el contrato de entradas. Ana paga el gas consumido igual."],
    ], { y: 3.35, alto: 0.74, gap: 0.1, anchoEt: 2.7, size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.88, w: CW, h: 0.95, texto: "«El contrato me cobró». Un contrato no puede tomar nada que no le hayan enviado o autorizado antes.", size: 12.5 });
    s.addNotes("En el explorador las llamadas internas aparecen en la pestaña 'Internal Txns', no como transacciones propias. Que msg.sender cambie en cada salto es la base del control de acceso de la S6 y de la vulnerabilidad de tx.origin de la S9.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · qué guarda cada cuenta", titulo: "Los cuatro campos del estado", ic: "capas", tituloSize: 29 });
    const campos = [
      ["nonce", "Cuántas transacciones envió (EOA) o cuántos contratos creó (contrato). El contador anti-repetición de la Sesión 3."],
      ["balance", "Su saldo de ETH en wei. Un entero de 256 bits."],
      ["storageRoot", "La raíz de un árbol con todos los datos persistentes del contrato. Vacío en una EOA."],
      ["codeHash", "El hash del código del contrato. En una EOA, el hash de «nada»."],
    ];
    campos.forEach((c, i) => {
      const y = 1.9 + i * 0.86;
      D.caja(s, { x: M, y, w: CW, h: 0.74, fill: i % 2 ? C.superf : C.blanco, sombra: false, lw: 1.25 });
      s.addText(c[0], { x: M + 0.25, y, w: 2.6, h: 0.74, fontFace: F.mono, fontSize: 15, bold: true, color: C.violetaOs, margin: 0, valign: "middle" });
      D.parrafo(s, c[1], { x: M + 3.0, y: y + 0.08, w: CW - 3.2, h: 0.6, size: 12.5, valign: "middle" });
    });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico: «mis tokens están en mi cuenta»", x: M, y: 5.4, w: CW, h: 1.38, texto: "No. El campo balance es solo ETH. Sus 25 LINK son una fila en el storage del CONTRATO de LINK: «dirección de ustedes → 25». Por eso transferir un token es llamar a ese contrato, y por eso el Value sale en 0 (lo verán en el laboratorio).", size: 12.5 });
    s.addNotes("storageRoot es la raíz de un árbol de Merkle-Patricia: la misma idea de la Sesión 2, adaptada a pares clave-valor. El encabezado de cada bloque incluye la stateRoot de TODAS las cuentas: un cliente ligero puede verificar un saldo con una prueba de inclusión.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · la moneda y sus unidades", titulo: "No hay decimales: todo se cuenta en wei", ic: "moneda", tituloSize: 28 });
    D.tabla(s, ["unidad", "en wei", "para qué se usa"], [
      ["wei", "1", "La unidad real. Todo saldo y todo cálculo dentro de la EVM está en wei."],
      ["gwei", "1 000 000 000  (10⁹)", "Precios del gas. «La tarifa base está en 1 gwei»."],
      ["ether", "1 000 000 000 000 000 000  (10¹⁸)", "Montos que ve una persona. Solo existe en las interfaces."],
    ], { y: 1.9, h: 2.1, colW: [1.8, 4.6, 5.693], size: 12 });
    D.parrafo(s, "Por qué enteros: la EVM tiene que dar el mismo resultado en todos los procesadores (A.4). El punto flotante redondea distinto según el hardware; los enteros no. Los tokens copian la idea: USDC usa 6 decimales, LINK usa 18.", { y: 4.15, h: 0.9, size: 13.5 });
    D.codigo(s, `// JavaScript con ethers v6
ethers.parseEther("0.5")               // 500000000000000000n
ethers.formatEther(500000000000000000n) // "0.5"
ethers.parseUnits("3", "gwei")          // 3000000000n`, { x: M, y: 5.15, w: CW, h: 1.6, lang: "js", size: 12 });
    s.addNotes("La 'n' final en JavaScript es BigInt. Error típico del laboratorio: leer 18100000 en un token de USDC y creer que son 18 millones. Son 18,1 USDC: el contrato declara 6 decimales. Siempre mirar decimals() antes de interpretar un monto.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · anatomía de una transacción", titulo: "Qué contiene exactamente lo que se firma", ic: "documento", tituloSize: 27 });
    D.codigo(s, `{
  type:                 2,           // EIP-1559
  chainId:              11155111,    // Sepolia
  nonce:                1820,
  maxPriorityFeePerGas: 2000000000,  // 2 gwei
  maxFeePerGas:         4051050452,  // ≈ 4,05 gwei
  gasLimit:             21000,
  to:                   "0xCA0e…a684",
  value:                117300000000000, // 0,0001173 ETH
  data:                 "0x",
  accessList:           [],
  // firma: v (yParity), r, s
}`, { x: M, y: 1.9, w: 6.4, h: 4.85, lang: "js", titulo: "transacción real · sepolia · bloque 11 727 244", size: 11 });
    const campos = [
      ["chainId", "Impide repetir la firma en otra red. Una transacción de Sepolia no vale en la red principal."],
      ["nonce", "El contador de la cuenta. Fija el orden y evita la repetición."],
      ["maxFee · priority", "Cuánto está dispuesto a pagar por unidad de gas, como máximo y como propina."],
      ["gasLimit", "El tope de trabajo. Si se agota, la ejecución se revierte."],
      ["to · value · data", "A quién, cuántos wei, y qué función con qué argumentos. Aquí data va vacío: es un pago simple."],
    ];
    campos.forEach((c, i) => {
      const y = 1.9 + i * 0.97;
      D.etiqueta(s, c[0], { x: M + 6.7, y, w: CW - 6.7, size: 10.5, color: C.ocre });
      D.parrafo(s, c[1], { x: M + 6.7, y: y + 0.34, w: CW - 6.7, h: 0.6, size: 11.5, ls: 1.1 });
    });
    s.addNotes("Transacción real: 0xde9cdb0c…4263f4 en sepolia.etherscan.io (consultada el 17-sep-2026). El chainId entró con EIP-155 (2016) tras la división Ethereum/Ethereum Classic. Lo que NO está en la transacción: el 'from'. Se deduce de la firma (S3: recuperar la clave pública). Error típico: pensar que el remitente es un campo que se puede escribir.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · el campo data", titulo: "Cómo se dice «llama a esta función»", ic: "codigo", tituloSize: 28 });
    D.parrafo(s, "Una llamada a contrato viaja en data: el selector de la función y después los argumentos, cada uno rellenado a 32 bytes. Esta es una transacción real de Sepolia que envía 25 LINK de prueba:", { y: 1.9, h: 0.95, size: 13.5 });
    D.definicion(s, "a9059cbb\n0000000000000000000000005051ae5167b315b37de54bbfafd772db81043b9c\n0000000000000000000000000000000000000000000000015af1d78b58c40000", { x: M, y: 2.95, w: CW, h: 1.35, size: 12.5 });
    D.pasos(s, [
      ["SELECTOR · 4 BYTES", "Los primeros 4 bytes de keccak256(\"transfer(address,uint256)\"). Keccak de la Sesión 2, otra vez."],
      ["ARGUMENTO 1 · 32 BYTES", "La dirección de destino, con 12 bytes de ceros a la izquierda para completar 32."],
      ["ARGUMENTO 2 · 32 BYTES", "0x15af1d78b58c40000 = 25 × 10¹⁸. LINK tiene 18 decimales: 25 tokens son 25 seguidos de 18 ceros."],
    ], { y: 4.5, alto: 0.66, gap: 0.08, anchoEt: 3.5, size: 11.5 });
    s.addNotes("Transacción 0xbca5f6b7…2dd0, bloque 11 726 903, al contrato de LINK 0x7798…4789 (verificado). El selector se comprobó con ethers.id('transfer(address,uint256)'). 68 bytes en total: 4 + 32 + 32. Error típico: buscar el destinatario real en el campo To; ahí está el contrato del token.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · por qué existe el gas", titulo: "Un programa que no termina nunca", ic: "gas", tituloSize: 29 });
    D.parrafo(s, "Con un lenguaje Turing-completo, alguien puede desplegar un bucle infinito. Y no existe algoritmo que decida de antemano si un programa cualquiera terminará: es el problema de la parada, demostrado por Turing en 1936.", { y: 1.9, h: 0.95, size: 14.5 });
    D.enunciado(s, "Solución: no se pregunta si el programa termina. Se cobra cada paso por adelantado, y cuando se acaba lo pagado, se detiene.", { y: 3.0, h: 1.22, size: 19, line: C.naranja });
    D.dosColumnas(s,
      { et: "Qué resuelve", items: ["Nadie puede bloquear la red con un cómputo infinito.", "Quien consume recursos de miles de nodos los paga.", "El costo de un ataque de denegación de servicio se vuelve real."] },
      { et: "Qué NO resuelve", items: ["No hace barato lo que de verdad es costoso.", "No evita que un contrato mal hecho consuma gas en vano.", "No protege al usuario que firma un límite demasiado alto sin mirar."] },
      { y: 4.42, h: 2.32, size: 12.5 });
    s.addNotes("Distinción clave, y el error típico número uno: gas es la CANTIDAD de trabajo (fija por instrucción). El precio del gas es cuánto ETH vale cada unidad (variable según la demanda). 'La transacción costó 21 000 gas' y 'costó 0,00006 ETH' son dos datos distintos.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · límite y consumo", titulo: "El límite de gas y lo que pasa si se agota", ic: "alerta", tituloSize: 27 });
    D.tabla(s, ["caso", "qué ocurre con el estado", "qué ocurre con el gas"], [
      ["Termina bien", "Se aplican todos los cambios.", "Se cobra solo lo usado. El resto del límite no se paga."],
      ["Se revierte (require falla)", "No se aplica ningún cambio: como si no hubiera ocurrido.", "Se cobra el gas consumido HASTA el punto del error."],
      ["Se agota el límite", "No se aplica ningún cambio.", "Se cobra el límite COMPLETO: el trabajo sí se hizo."],
    ], { y: 1.9, h: 2.6, colW: [2.9, 4.6, 4.593], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Visto en Sepolia", x: M, y: 4.7, w: CW, h: 1.3, texto: "Una llamada a transfer() firmada con límite de 500 000 falló: consumió 22 550 de gas y pagó 0,0000439 ETH por un resultado nulo. Revertir protege el estado, no el bolsillo.", size: 13 });
    D.parrafo(s, "Por eso las billeteras estiman el gas antes de enviar: ejecutan la transacción en simulación sobre el estado actual y proponen un límite con un margen.", { y: 6.15, h: 0.6, size: 13 });
    s.addNotes("Transacción real 0xcb485277…78da (bloque 11 727 244): el explorador la muestra como 'Fail With Custom Error FHERC20IncompatibleFunction()'. Es un token confidencial que no admite transfer() normal. Si la billetera estima y la simulación revierte, avisa antes de firmar: por eso casi todas las fallas que se ven son de bots o de scripts que no estiman.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · el precio del gas", titulo: "EIP-1559: tarifa base más propina", ic: "grafico", tituloSize: 29 });
    D.parrafo(s, "Desde agosto de 2021 el precio no se subasta a ciegas. Tiene dos partes con destinos distintos:", { y: 1.9, h: 0.5, size: 14.5 });
    D.dosColumnas(s,
      { et: "Tarifa base (baseFee)", texto: "La fija el protocolo en cada bloque, igual para todos. Si el bloque anterior usó más de la mitad de su capacidad, sube; si usó menos, baja. Como máximo un 12,5 % por bloque. Se QUEMA: no la recibe nadie." },
      { et: "Propina (priorityFee)", texto: "La elige el usuario y la recibe el validador que incluye la transacción. Es el incentivo para ser incluido antes cuando hay congestión." },
      { y: 2.55, h: 2.35, size: 13 });
    D.definicion(s, "precio efectivo = mín( maxFeePerGas , tarifa_base + maxPriorityFeePerGas )      costo = gas_usado × precio efectivo", { x: M, y: 5.1, w: CW, h: 0.7, size: 11.5 });
    D.parrafo(s, "Lo que se firma es un máximo. Si la tarifa base baja entre la firma y la inclusión, la diferencia no se cobra.", { y: 5.98, h: 0.6, size: 13.5, color: C.ocre });
    s.addNotes("EIP-1559 se activó con la actualización London, el 5 de agosto de 2021. Antes, el precio era una subasta de primer precio: la gente pagaba de más por miedo. Error típico: creer que la propina va al 'dueño de la red'. Va al validador del bloque; la base no va a nadie.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · la tarifa base, bloque a bloque", titulo: "La fórmula, comprobada en Sepolia", ic: "grafico", tituloSize: 28 });
    D.definicion(s, "base_siguiente = base + base × (usado − objetivo) ÷ objetivo ÷ 8        objetivo = límite ÷ 2 = 30 000 000", { x: M, y: 1.9, w: CW, h: 0.62, size: 11.5 });
    D.tabla(s, ["bloque", "tarifa base", "gas usado del límite", "fórmula predice", "bloque siguiente, real", "cambio"], [
      ["11 727 239", "1,029057347 gwei", "23,81 %", "0,961679578 gwei", "0,961679578 gwei", "−6,55 %"],
      ["11 727 240", "0,961679578 gwei", "99,98 %  (lleno)", "1,081844398 gwei", "1,081844398 gwei", "+12,50 %"],
      ["11 727 241", "1,081844398 gwei", "32,90 %", "1,035597630 gwei", "1,035597630 gwei", "−4,27 %"],
    ], { y: 2.7, h: 2.1, colW: [1.7, 2.2, 2.2, 2.1, 2.2, 1.693], size: 11 });
    D.parrafo(s, "Tres bloques seguidos, con límite de 60 millones de gas. Un bloque lleno sube la base casi exactamente el máximo (12,5 %); uno con poco uso la baja. La predicción coincide con el valor real hasta el último wei.", { y: 5.0, h: 0.9, size: 13.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Lo que esto significa", x: M, y: 5.95, w: CW, h: 0.86, texto: "La tarifa base no la decide nadie: se calcula. Por eso una billetera la puede predecir antes de firmar.", size: 12.5 });
    s.addNotes("Calculado con ethers contra un nodo público de Sepolia el 17-sep-2026: la fórmula entera de EIP-1559 reprodujo la tarifa base de 9 bloques consecutivos sin un wei de diferencia. Hacer una multiplicación en el tablero: 0,9617 × (1 + 29 988 738 / 30 000 000 / 8) ≈ 1,0818.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · con números reales", titulo: "Cuánto costó de verdad un pago en Sepolia", ic: "moneda", tituloSize: 26 });
    D.tabla(s, ["dato", "valor", "de dónde sale"], [
      ["Gas usado", "21 000", "Transferencia simple: solo la base (A.17)."],
      ["Tarifa base del bloque", "0,947200913 gwei", "La fijó el protocolo (A.14)."],
      ["Propina máxima firmada", "2 gwei", "La eligió la billetera."],
      ["Precio efectivo", "2,947200913 gwei", "Base + propina: no llegó al máximo de 4,05 gwei."],
      ["Costo total", "21 000 × 2,947200913 gwei = 0,000061891219173 ETH", "Lo que salió de la cuenta, además del valor enviado."],
      ["Quemado", "21 000 × 0,947200913 gwei = 0,000019891219173 ETH", "Desaparece de la oferta total de ETH."],
      ["Para el validador", "21 000 × 2 gwei = 0,000042 ETH", "La propina."],
    ], { y: 1.9, h: 4.25, colW: [2.6, 5.2, 4.293], size: 11.5 });
    D.parrafo(s, "Comprueben la suma: quemado + propina = costo total. Y el tope firmado era 21 000 × 4,05 gwei ≈ 0,000085 ETH: la diferencia no se cobró.", { y: 6.25, h: 0.55, size: 12.5, color: C.ocre });
    s.addNotes("Transacción real 0xde9cdb0c…4263f4, bloque 11 727 244 de Sepolia. Todas las cifras calculadas con enteros en wei y coinciden con Transaction Fee y Burnt Fees de Etherscan. Es EXACTAMENTE el cálculo que exige el informe del laboratorio: hacerlo en el tablero. Curiosidad: aquí la propina pesa más que la base, porque Sepolia tiene poca demanda; en la red principal suele ser al revés.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · por dentro", titulo: "La EVM es una máquina de pila", ic: "capas", tituloSize: 29 });
    D.parrafo(s, "No tiene registros como un procesador: opera sobre una pila de palabras de 256 bits. Cada instrucción saca valores de arriba, opera y pone el resultado.", { y: 1.9, h: 0.65, size: 14.5 });
    D.codigo(s, `PUSH1 0x03    // pila: [3]
PUSH1 0x04    // pila: [4, 3]
ADD           // pila: [7]
PUSH1 0x00    // pila: [0, 7]
SSTORE        // guarda 7 en la ranura 0 · pila: []`, { x: M, y: 2.75, w: 6.3, h: 2.35, lang: "sol", titulo: "3 + 4, y guardarlo", size: 12 });
    D.lista(s, [
      "Palabras de 256 bits: por eso uint256 es el tipo natural de Solidity.",
      "Profundidad máxima de 1 024 elementos.",
      "Unas 150 instrucciones, cada una con su costo fijo en gas.",
      "Solidity compila a esta secuencia de bytes: el bytecode que se despliega.",
    ], { x: M + 6.6, y: 2.75, w: CW - 6.6, h: 2.4, size: 13, gap: 7 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "No hace falta escribir esto a mano", x: M, y: 5.35, w: CW, h: 1.35, texto: "Nunca van a programar en opcodes. Pero cuando en la Sesión 7 optimicen gas, o en la Sesión 9 lean un exploit, van a necesitar saber que cada línea de Solidity se paga en instrucciones como estas.", size: 12.5 });
    s.addNotes("Costo del ejemplo: PUSH1 3 + PUSH1 3 + ADD 3 + PUSH1 3 + SSTORE 22 100 (ranura nueva, primer acceso). Casi todo el costo está en la última línea: esa es la lección. evm.codes permite ejecutar opcodes paso a paso en el navegador. Lámina que se puede saltar si hay prisa.");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · la tabla de precios", titulo: "Lo que cuesta cada instrucción", ic: "gas", tituloSize: 29 });
    D.tabla(s, ["instrucción", "gas", "qué hace"], [
      ["ADD · MUL", "3 · 5", "Aritmética en la pila. Casi gratis."],
      ["KECCAK256", "30 + 6 por palabra", "Calcular un hash."],
      ["SLOAD", "2 100 primera vez · 100 después", "Leer una ranura del almacenamiento."],
      ["SSTORE 0 → x", "20 000 (+ 2 100 primer acceso)", "Estrenar una ranura. La operación más cara de uso común."],
      ["SSTORE x → y", "2 900 (+ 2 100 primer acceso)", "Cambiar un valor que ya existía."],
      ["SSTORE x → 0", "2 900 (+ 2 100) y devuelve 4 800", "Liberar espacio tiene premio (hasta 1/5 del gas usado)."],
      ["LOG", "375 + 375 por tema + 8 por byte", "Emitir un evento."],
      ["Transacción base", "21 000", "Solo por existir: firma, nonce, saldo."],
      ["Datos de la llamada", "4 por byte cero · 16 por byte no cero", "Lo que viaja en data."],
    ], { y: 1.9, h: 4.45, colW: [2.9, 3.9, 5.293], size: 11 });
    D.parrafo(s, "Vigentes desde Berlin (2021) y London (reembolsos). La actualización Glamsterdam, prevista para Sepolia en octubre de 2026, cambia varios de estos precios.", { y: 6.42, h: 0.42, size: 11, color: C.gris });
    s.addNotes("⚠ VERIFICAR ANTES DE DICTAR: Glamsterdam tenía fecha tentativa en Sepolia el 6-oct-2026 (ethereum.org/roadmap/glamsterdam). Incluye EIP-2780 (baja la base de 21 000), EIP-8037 (sube el costo de crear estado) y EIP-8038 (sube el acceso a estado). Si ya está activa en Sepolia, las transacciones del laboratorio NO darán 21 000: decirlo y usarlo como hallazgo. La red local de Hardhat sigue con los precios de esta tabla. La proporción que hay que memorizar: estrenar una ranura cuesta unas 7 000 veces una suma.");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · dónde viven los datos", titulo: "storage, memory y calldata", ic: "rejilla", tituloSize: 30 });
    D.tabla(s, ["lugar", "dura", "quién lo modifica", "costo"], [
      ["storage", "Para siempre, entre transacciones.", "Solo el propio contrato.", "Muy caro: es el estado que replican todos los nodos."],
      ["memory", "Solo durante la llamada.", "La función que se ejecuta.", "Barato y crece con el tamaño usado."],
      ["calldata", "Solo durante la llamada.", "Nadie: es de solo lectura.", "El más barato para parámetros: no se copia."],
      ["stack", "Solo durante la instrucción.", "La propia EVM.", "Casi gratis, pero limitado a 16 variables accesibles."],
    ], { y: 1.9, h: 3.0, colW: [1.9, 3.1, 2.9, 4.193], size: 11.5 });
    D.codigo(s, `function sumar(uint256[] calldata datos)  // no se copia: 39 360 de gas (50 números)
function sumar(uint256[] memory datos)    // se copia antes: 42 058 de gas`, { x: M, y: 5.05, w: CW, h: 0.95, lang: "sol", size: 12 });
    D.parrafo(s, "Error típico: creer que memory «guarda» algo. Al terminar la llamada desaparece; si el dato debe sobrevivir, tiene que ir a storage, y eso se paga.", { y: 6.12, h: 0.65, size: 12.5, color: C.ocre });
    s.addNotes("Las dos cifras son medidas con scripts/s05/medir-gas.js (Hardhat 3.16, Solidity 0.8.28, optimizador 200). El error 'stack too deep' de Solidity viene del límite de 16: aparece cuando una función tiene demasiadas variables locales.");
  }

  {
    const s = await D.lamina({ kicker: "A.19 · descomponer una medición", titulo: "De dónde sale cada unidad de gas", ic: "gas", tituloSize: 28 });
    D.tabla(s, ["operación medida", "base", "datos", "instrucción cara", "resto", "total"], [
      ["escribirNueva(42) · 0 → 42", "21 000", "204", "SSTORE nueva 22 100", "298", "43 602"],
      ["sobrescribir(43) · 42 → 43", "21 000", "204", "SSTORE 5 000", "275", "26 479"],
      ["leerEnTransaccion()", "21 000", "64", "SLOAD frío 2 100", "200", "23 364"],
      ["borrar() · 43 → 0", "21 000", "64", "SSTORE 5 000 − 4 800", "181", "21 445"],
      ["registrarConEvento(42)", "21 000", "204", "LOG2 1 381", "277", "22 862"],
    ], { y: 1.9, h: 3.0, colW: [3.3, 1.2, 1.1, 3.2, 1.2, 2.093], size: 11 });
    D.parrafo(s, "Datos: 204 = 31 bytes en cero × 4 + 5 bytes distintos de cero × 16. El «resto» es el trabajo de Solidity: comparar el selector, decodificar el argumento, saltar a la función.", { y: 5.05, h: 0.75, size: 13 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Pregunta para el laboratorio", x: M, y: 5.88, w: CW, h: 0.95, texto: "¿Por qué borrar cuesta casi lo mismo que una transferencia simple?", size: 12.5 });
    s.addNotes("Todo medido con medir-gas.js y descompuesto contando los bytes reales del campo data. LOG2 = 375 + 2 × 375 (dos temas: firma del evento y quien, indexado) + 8 × 32 bytes. borrar: 26 245 antes del reembolso de 4 800 (EIP-3529; el tope es 1/5 del gas usado, que aquí no limita). Respuesta a la pregunta: por el reembolso. Lámina que se puede saltar si hay prisa: el laboratorio la retoma.");
  }

  {
    const s = await D.lamina({ kicker: "A.20 · el viaje de una transacción", titulo: "De la firma a la finalidad", ic: "flecha", tituloSize: 29 });
    D.pasos(s, [
      ["FIRMA", "La billetera arma la transacción, estima el gas y la firma con la clave privada. Nada ha salido del computador."],
      ["MEMPOOL", "Se envía a un nodo, que la valida y la propaga por rumor (Sesión 3). Queda pendiente, a la vista de todos."],
      ["INCLUSIÓN", "Un constructor de bloques la elige, normalmente por propina. El validador de turno propone el bloque cada 12 segundos."],
      ["CONFIRMACIÓN", "El bloque se propaga y otros validadores lo atestiguan. Aparece en el explorador con estado y recibo."],
      ["FINALIDAD", "Unas dos épocas después, unos 13 minutos, queda finalizada (Sesión 4)."],
    ], { y: 1.9, alto: 0.72, gap: 0.1, anchoEt: 2.6, size: 12.5 });
    D.parrafo(s, "Error típico: «si ya salió en el explorador, es definitiva». Confirmada no es lo mismo que finalizada: lo vimos con las reorganizaciones de la Sesión 4.", { y: 6.1, h: 0.7, size: 13, color: C.ocre });
    s.addNotes("Mencionar que en la red principal la mayoría de bloques los arman constructores especializados (separación proponente-constructor, MEV-boost). Se profundiza en MEV en la Sesión 9. Una transacción puede quedarse en el mempool si su maxFee está por debajo de la tarifa base: por eso las billeteras ofrecen 'acelerar' (reemplazar con el mismo nonce y más propina).");
  }

  {
    const s = await D.lamina({ kicker: "A.21 · el recibo", titulo: "Leer una transacción en el explorador", ic: "lupa", tituloSize: 28 });
    D.tabla(s, ["campo del explorador", "qué significa", "error típico al leerlo"], [
      ["Status", "Success o Fail.", "Creer que Fail no costó nada."],
      ["From · To", "Quién firmó y a quién iba.", "En un token, To es el CONTRATO del token, no quien recibe."],
      ["Value", "ETH enviado con la llamada.", "Pensar que 0 ETH significa que no se movió valor: los tokens van en data."],
      ["Transaction Fee", "Lo que pagó el remitente.", "Confundirlo con el valor transferido."],
      ["Gas Limit & Usage", "El tope firmado y lo consumido.", "Asumir que se cobra el límite cuando la transacción terminó bien."],
      ["Burnt Fees", "La parte quemada de la tarifa base.", "Creer que la recibió el validador."],
      ["Input Data", "El campo data, decodificado si el contrato está verificado.", "No ver nada útil porque el contrato no está verificado."],
      ["Logs", "Los eventos emitidos.", "Ignorarlos: son la forma más confiable de saber qué pasó."],
    ], { y: 1.9, h: 4.85, colW: [2.7, 4.1, 5.293], size: 11 });
    s.addNotes("Hacer este recorrido EN VIVO sobre la transferencia de USDC 0xe51f75ba…bf0a (bloque 11 727 240): Value 0, To = contrato de USDC (un proxy), Input Data decodificado como transfer, y en Logs el evento Transfer con 18,1 USDC. Son 3 minutos y ahorran 20 preguntas en el laboratorio.");
  }

  {
    const s = await D.lamina({ kicker: "A.22 · lo que hay que llevarse del bloque A", titulo: "Seis ideas para la Unidad II", ic: "lista", tituloSize: 29 });
    ideas(s, [
      "Ethereum es una máquina de estados: mismo estado más misma transacción da el mismo resultado en todo el mundo.",
      "Solo una cuenta externa inicia algo. Un contrato nunca actúa por su cuenta.",
      "Una llamada a función es un selector de 4 bytes seguido de argumentos de 32 bytes.",
      "El gas existe porque no se puede saber si un programa termina: se cobra cada paso.",
      "Costo = gas usado × (tarifa base quemada + propina). Lo firmado es un máximo.",
      "Escribir en storage es, con diferencia, lo más caro. Diseñar contratos es diseñar alrededor de eso.",
    ]);
    s.addNotes("Volver a las cuatro preguntas de la lámina de objetivo: la cuarta ya se puede responder con un número (22 100 frente a 3).");
  }

  await verificacion({
    kicker: "A.23 · cierre del bloque A",
    pregunta: "Una transferencia de token muestra en el explorador «Value: 0 ETH» y «Status: Fail». ¿Qué afirmación es correcta?",
    opciones: [
      "No se movió nada y no costó nada: el valor es cero y además falló.",
      "No se aplicó ningún cambio de estado, pero el remitente pagó el gas consumido hasta el error.",
      "Se transfirieron los tokens, pero no el ETH, porque el Value es cero.",
    ],
    pista: "Un minuto en parejas y respuesta a mano alzada. Después, a abrir la billetera.",
    notas: "Respuesta: B. La A mezcla dos errores típicos (Value 0 en un token es normal; Fail sí cuesta). La C ignora que un revert deshace todo. Si más de un tercio elige mal, repasar A.12 antes del laboratorio.",
  });

  /* =============================================================== B */
  {
    const s = await D.divisor({ letra: "B", titulo: "Laboratorio 05", sub: "Primero se lee la cadena como un forense. Después se predice y se mide el costo de cada instrucción.", minutos: "APROXIMADAMENTE 60 MINUTOS · EN PAREJAS", ic: "lupa" });
    s.addNotes("Guía completa: laboratorios-evm/guias/s05-forense-y-gas.pdf. Repartirla ANTES del punto de control. Tiempos: 5 billeteras + 30 forense + 25 gas. Si la red de la sala falla, empezar por la parte B (no necesita internet una vez instalado).");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · antes de empezar · 5 minutos", titulo: "Punto de control de billeteras", ic: "llave", tituloSize: 29 });
    D.pasos(s, [
      ["ABRIR", "Abrir la billetera creada en la Sesión 2 y desbloquearla."],
      ["RED", "Cambiar a la red de prueba Sepolia. Confirmar que la red NO es la principal."],
      ["SALDO", "Verificar que hay ETH de prueba. Si no, avisar: se reparte desde la billetera institucional."],
      ["FRASE", "Confirmar que la frase de recuperación está guardada en papel, fuera del computador."],
    ], { y: 1.9, alto: 0.76, gap: 0.12, anchoEt: 2.0, size: 13 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Quien perdió la billetera la rehace hoy", x: M, y: 5.42, w: CW, h: 1.3, texto: "No en la Sesión 6, que es cuando se despliega el primer contrato. Nunca se usa esta billetera con dinero real, y la frase no se comparte con nadie, tampoco con el docente.", size: 12.5 });
    s.addNotes("Recorrer la sala con una lista: nombre, ¿billetera sí/no?, ¿saldo sí/no? Quien no tenga saldo se anota para la distribución institucional. Sin saldo NO se puede desplegar en la S6. Si alguien ofrece dictar su frase 'para que el docente la revise', detenerlo en público: es la lección.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · parte A · 30 minutos", titulo: "Análisis forense de tres transacciones", ic: "lupa", tituloSize: 28 });
    D.parrafo(s, "En el explorador de Sepolia, cada pareja encuentra tres transacciones reales de tipos distintos y llena una hoja de trabajo por cada una.", { y: 1.9, h: 0.6, size: 14.5 });
    D.tabla(s, ["tipo", "cómo encontrarla", "qué tiene que identificar"], [
      ["1 · Transferencia de ETH", "La dirección de su propia billetera, si recibió fondos de prueba.", "Gas usado exactamente 21 000. Valor, tarifa base, propina, costo total."],
      ["2 · Transferencia de token", "El contrato de LINK o USDC de prueba → pestaña Token Transfers.", "Selector a9059cbb, destinatario real en los argumentos, el evento Transfer en los logs."],
      ["3 · Llamada que falló", "Un contrato con mucho uso: buscar una fila con el ícono rojo de error.", "Por qué falló, cuánto gas consumió y cuánto costó igualmente."],
    ], { y: 2.65, h: 2.85, colW: [2.6, 4.3, 5.193], size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta que tiene que responder el informe", x: M, y: 5.7, w: CW, h: 1.0, texto: "Para cada una: ¿cuánto se quemó, cuánto recibió el validador, y por qué el gas usado fue el que fue?", size: 13 });
    s.addNotes("Direcciones en la guía: LINK 0x779877A7B0D9E8603169DdbD7836e478b4624789 y USDC de Circle 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238, ambos verificados en sepolia.etherscan.io. ⚠ VERIFICAR ANTES DE DICTAR: si Glamsterdam ya está activa en Sepolia, la transferencia de ETH no dará 21 000; pedir que anoten el valor real y lo expliquen.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · parte A, paso a paso", titulo: "Qué se abre y dónde se mira", ic: "lupa", tituloSize: 29 });
    D.pasos(s, [
      ["BUSCAR", "sepolia.etherscan.io → pegar el hash, la dirección o el contrato en la barra de búsqueda. Comprobar que la URL dice «sepolia»."],
      ["OVERVIEW", "Status, Block, From, To, Value, Transaction Fee, Gas Price. Anotarlos tal cual, con todas sus cifras."],
      ["MÁS DETALLES", "«Click to show more»: Gas Limit & Usage, Gas Fees (Base, Max, Max Priority), Burnt Fees, Input Data."],
      ["INPUT DATA", "«Decode Input Data»: función y argumentos. Si no decodifica, el contrato no está verificado."],
      ["LOGS", "Pestaña Logs: cada evento con su nombre, sus temas (topics) y sus datos."],
    ], { y: 1.9, alto: 0.78, gap: 0.1, anchoEt: 2.3, size: 12 });
    D.parrafo(s, "Salida esperada: tres hojas de trabajo llenas, con los hashes pegados como enlaces que abran.", { y: 6.3, h: 0.5, size: 13, color: C.ocre });
    s.addNotes("Los nombres de los campos son los de Etherscan en septiembre de 2026; si cambian de sitio, la guía trae la descripción de qué buscar. Circular por la sala: el error más frecuente en los primeros 5 minutos es estar en etherscan.io (red principal) en lugar de sepolia.etherscan.io.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · un ejemplo resuelto", titulo: "Una hoja de trabajo bien llena", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["campo", "transferencia de USDC · bloque 11 727 240"], [
      ["Hash", "0xe51f75bad82aceb9e03cbf9af64d080df91203c43f801b99f7d71556654fbf0a"],
      ["To · Value", "El contrato de USDC (no la persona) · 0 ETH"],
      ["Gas Limit · Used", "69 301 · 62 171 (89,7 % del límite)"],
      ["Base · efectivo", "0,961679578 gwei · 0,962779578 gwei (propina 0,0011 gwei)"],
      ["Fee = quemado + propina", "0,000059856969143838 = 0,000059788581043838 + 0,0000000683881 ETH"],
      ["Input Data", "transfer · selector a9059cbb · destinatario 0x9d7f…25db · monto 18 100 000"],
      ["Logs", "1 evento Transfer: 18,1 USDC (el token tiene 6 decimales)"],
    ], { y: 1.9, h: 4.15, colW: [3.0, 9.093], size: 11 });
    D.parrafo(s, "Fíjense: la propina es casi nula y el bloque estaba lleno. Por eso el bloque siguiente subió su tarifa base un 12,5 % (A.14).", { y: 6.2, h: 0.6, size: 12.5, color: C.ocre });
    s.addNotes("Transacción real, consultada el 17-sep-2026. No la pueden usar en su informe: cada pareja trae las suyas. Sirve de modelo de precisión: todas las cifras con todos sus decimales y la comprobación de la suma escrita.");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · parte B · 25 minutos", titulo: "Predecir primero, medir después", ic: "terminal", tituloSize: 29 });
    D.pasos(s, [
      ["PREDECIR", "Con A.17 y A.19, escribir cuánto gas cuesta cada operación del contrato Operaciones. Sin correr nada."],
      ["PROBAR EL ENTORNO", "Correr las pruebas de la sesión: 7 en verde significan que Hardhat funciona."],
      ["MEDIR", "Correr el script: imprime una tabla de 12 filas, en la red local, sin gastar ETH ni necesitar internet."],
      ["COMPARAR", "Anotar la diferencia entre predicción y medición, y explicar las dos mayores."],
    ], { y: 1.9, alto: 0.74, gap: 0.1, anchoEt: 2.9, size: 12 });
    D.codigo(s, `npx hardhat test test/s05/Operaciones.test.js    # → 7 passing
npx hardhat run scripts/s05/medir-gas.js         # → la tabla
  Escribir en una ranura vacía (0 → 42)             43.602
  Sobrescribir una ranura ocupada (42 → 43)         26.479`, { x: M, y: 5.2, w: CW, h: 1.58, lang: "js", titulo: "en la carpeta laboratorios-evm", size: 11 });
    s.addNotes("npm install se hace una sola vez por semestre. La predicción es lo que se evalúa, no el acierto: una predicción muy equivocada pero bien explicada vale más que una copia de la tabla de A.19. Quien termine antes: ¿por qué 'agregar 10 elementos' no cuesta 10 veces 'agregar 1'?");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · errores frecuentes", titulo: "Lo que suele salir mal", ic: "bicho", tituloSize: 30 });
    D.tabla(s, ["síntoma", "causa"], [
      ["El explorador no encuentra mi dirección", "Están en el explorador de la red principal y no en el de Sepolia."],
      ["«Value: 0» en una transferencia de token", "Correcto: el token no es ETH. El monto está en Input Data y en los logs."],
      ["El Input Data es ilegible", "El contrato no está verificado. Busquen otro token que sí lo esté."],
      ["El monto del token parece enorme", "No dividieron por los decimales: USDC usa 6, LINK usa 18."],
      ["npm install falla en la sala", "Restricción de red. Plan B: el docente comparte la carpeta node_modules por red local."],
      ["El script da cifras algo distintas a las de la lámina", "Otra versión del compilador u optimizador. Las proporciones deben mantenerse."],
    ], { y: 1.9, h: 4.2, colW: [4.4, 7.693], size: 11.5 });
    D.parrafo(s, "Si algo no se resuelve en 5 minutos, se anota en la hoja y se sigue con la siguiente parte. No se pierde el laboratorio por un problema de red.", { y: 6.22, h: 0.58, size: 13, color: C.ocre });
    s.addNotes("La guía PDF trae la tabla completa de errores (más de diez). Esta lámina queda proyectada durante el laboratorio.");
  }

  await verificacion({
    kicker: "B.7 · cómo saber que terminaron",
    pregunta: "Antes de cerrar el computador: su hoja dice «Fee = 0,00012 ETH» y «Burnt + propina = 0,00009 ETH». ¿Qué hacen?",
    opciones: [
      "Nada: son aproximaciones y el explorador redondea.",
      "Revisar: la suma tiene que coincidir exactamente; algo se copió mal o se usó el máximo firmado en vez del precio efectivo.",
      "Cambiar el Fee para que cuadre con la suma.",
    ],
    pista: "Terminado = tres hashes que abren + sumas que cuadran + tabla de gas con las dos diferencias explicadas.",
    notas: "Respuesta: B. El error más común es multiplicar por maxFeePerGas en vez del precio efectivo. Esta lámina es la lista de chequeo del laboratorio: si las tres condiciones de la pista se cumplen, pueden irse al cierre.",
  });

  /* =============================================================== C */
  {
    const s = await D.lamina({ kicker: "C.1 · qué se entrega", titulo: "Evidencia del laboratorio 05", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["parte", "contenido", "peso"], [
      ["A · forense", "Tres hojas de trabajo con hashes que abren, las sumas comprobadas y las cuatro preguntas de la guía.", "50 %"],
      ["B · gas", "La tabla con predicciones, mediciones y la explicación de las dos mayores diferencias.", "35 %"],
      ["Reflexión", "Un párrafo: ¿qué operación evitarían en un contrato real después de hoy, y por qué?", "15 %"],
    ], { y: 1.9, h: 2.4, colW: [2.2, 8.293, 1.6], size: 12.5 });
    D.parrafo(s, "Máximo dos páginas, con la plantilla de informe de la guía. Un informe por pareja. Se sube a la plataforma antes de la Sesión 6.", { y: 4.5, h: 0.6, size: 14 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Política de laboratorios", x: M, y: 5.25, w: CW, h: 1.45, texto: "Sin hashes de transacción verificables, la parte A no se califica. Y los hashes tienen que abrir en el explorador: una transacción inventada por un asistente de IA no existe en la cadena, y eso se comprueba en diez segundos.", size: 13 });
    s.addNotes("Es una de las 4 evidencias de laboratorio del primer corte (S2–S5), que en conjunto valen el 12 % de la nota final. Revisar al azar dos hashes por informe.");
  }

  await D.preguntaSemana({
    pregunta: "Si guardar un dato en la cadena cuesta decenas de miles de gas, ¿qué NO guardarían nunca en un contrato, y dónde lo guardarían en su lugar?",
    trabajo: [
      "Entregar el informe del laboratorio 05 antes de la Sesión 6.",
      "Leer la introducción de la documentación oficial de Solidity: «Introduction to Smart Contracts».",
      "Terminar el anteproyecto: se entrega en la Sesión 6. Máximo tres páginas, con la plantilla publicada.",
      "Opcional: jugar las dos primeras lecciones de CryptoZombies.",
    ],
    notas: "La pregunta prepara la Sesión 6 (en el registro de certificados va el hash, no el diploma), la Sesión 11 (IPFS) y el diseño del proyecto: casi siempre se guarda un hash en cadena y el dato fuera. URL de la lectura: docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html.",
  });

  {
    const s = await D.cierre({
      frase: "Cada instrucción tiene precio. Programar bien es saber cuánto cuesta lo que se escribe.",
      sub: "Hoy leyeron la máquina desde fuera. La próxima sesión escriben su primer programa para ella y lo despliegan en una red pública.",
      proxima: "Sesión 6 · Solidity I · primer contrato en Sepolia · entrega del anteproyecto",
    });
    s.addNotes("Recordar las dos condiciones para la S6: billetera con saldo de Sepolia y anteproyecto listo. Quien no tenga saldo hoy, que lo diga antes de salir.");
  }

  return D.guardar(path.join(__dirname, "Sesion-05-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
