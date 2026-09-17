/* =====================================================================
   Sesión 05 · Ethereum y la Máquina Virtual (EVM)
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 05 · ETHEREUM Y LA MÁQUINA VIRTUAL", titulo: "Sesión 05 · Ethereum y la EVM" });
  const { C, F, M, CW, pres } = D;

  await D.portada({
    kicker: "SESIÓN 05 · UNIDAD II · ETHEREUM Y CONTRATOS",
    titulo: "ETHEREUM\nY LA MÁQUINA\nVIRTUAL",
    sub: "Un computador que nadie apaga, que todos ejecutan a la vez, y en el que cada instrucción tiene precio.",
    palabra: "EJECUTAR",
    ic: "engranaje",
    notas: "Arranca la Unidad II. Hasta ahora la cadena guardaba transacciones de valor; desde hoy guarda y ejecuta programas.",
  });

  await D.agenda({
    intro: "Sesión de transición: se cierra el caso Estonia y empieza la Unidad II, la columna vertebral del curso.",
    bloques: [
      ["E", "EXPOSICIONES · CASO ESTONIA", "Cinco minutos por equipo, preguntas y síntesis.", "~45 min"],
      ["A", "LA MÁQUINA DE ESTADOS", "Cuentas, transacciones, gas, EIP-1559 y la EVM por dentro.", "~60 min"],
      ["B", "LABORATORIO 05", "Análisis forense de transacciones reales y medición de gas.", "~60 min"],
      ["C", "CIERRE", "Evidencia, pregunta de la semana y lo que trae Solidity.", "~15 min"],
    ],
    notas: "Si las exposiciones se alargan, recortar A.14 y A.19: están completas en el material.",
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
  });

  /* =============================================================== E */
  await D.divisor({ letra: "E", titulo: "Exposiciones · el caso Estonia", sub: "Cinco minutos por equipo. Veredicto al frente, la mejor evidencia en pantalla, y la fuente abierta para responder.", minutos: "APROXIMADAMENTE 45 MINUTOS", ic: "lupa" });

  {
    const s = await D.lamina({ kicker: "E.1 · la dinámica", titulo: "Cómo corren las exposiciones", ic: "reloj", tituloSize: 29 });
    D.pasos(s, [
      ["ORDEN", "Por sorteo, no voluntario. Se anuncia el orden completo antes de empezar para que nadie se prepare mientras otro expone."],
      ["CINCO MINUTOS", "Cronómetro visible. Al minuto 5 se corta, sin excepción: elegir qué mostrar es parte de lo que se evalúa."],
      ["UNA PREGUNTA", "Cualquier persona del curso pregunta de dónde salió un dato. El equipo abre la fuente y señala el lugar."],
      ["REGISTRO", "Mientras un equipo expone, los demás anotan su veredicto en una línea. Lo usamos en la síntesis."],
    ], { y: 1.9, alto: 0.95, gap: 0.14, anchoEt: 2.6, size: 13 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Lo que se evalúa en este momento", x: M, y: 6.0 - 0.02, w: CW, h: 0.86, texto: "El 10 % de exposición de la rúbrica. El documento escrito se califica aparte.", size: 12.5 });
    s.addNotes("Con 6 equipos: 6 × (5 + 2) = 42 minutos. Con más de 6, bajar la pregunta a una sola por cada dos equipos.");
  }

  {
    const s = await D.lamina({ kicker: "E.2 · síntesis", titulo: "Lo que quedó demostrado y lo que no", ic: "balanza", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Hechos verificables", items: ["El whitepaper de Bitcoin no contiene la palabra «blockchain».", "El FAQ oficial reconoce que se llamaba «hash-linked time-stamping».", "El artículo de Guardtime ancla la confianza en publicaciones periódicas en medios, incluidos periódicos.", "Los propios autores citan a Haber y Stornetta como origen de la técnica."] },
      { et: "Juicios que dependen de la definición", items: ["Si «cadena de bloques» exige participación abierta y consenso entre desconocidos, KSI no lo es.", "Si basta con encadenamiento criptográfico verificable, sí lo es.", "En ningún caso el error del folleto prueba que KSI sea mala tecnología."] },
      { y: 1.9, h: 3.55, size: 12.5 });
    D.enunciado(s, "Un veredicto bien sostenido no es el que acierta: es el que dice qué definición usó y qué no puede concluir.", { y: 5.65, h: 1.05, size: 16, line: C.naranja });
    s.addNotes("Destacar los equipos que escribieron bien el párrafo del límite. Si alguno confundió 'el folleto exagera' con 'la tecnología no sirve', corregirlo aquí sin nombrarlo.");
  }

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "La máquina de estados", sub: "Ethereum no es una moneda con extras. Es un computador compartido que, además, tiene una moneda para cobrar su uso.", minutos: "APROXIMADAMENTE 60 MINUTOS", ic: "engranaje" });

  {
    const s = await D.lamina({ kicker: "A.1 · de Bitcoin a Ethereum", titulo: "Del dinero programable al computador compartido", ic: "fusion", tituloSize: 25 });
    D.dosColumnas(s,
      { et: "Bitcoin · 2009", items: ["Un lenguaje de guion deliberadamente limitado: sin bucles.", "Pensado para una sola cosa: condiciones de gasto de monedas.", "Limitarlo es una decisión de seguridad, no un descuido."] },
      { et: "Ethereum · 2015", items: ["Propuesto por Vitalik Buterin en 2013; red en marcha en julio de 2015.", "Un lenguaje de propósito general: Turing-completo.", "Cualquier programa, siempre que alguien pague cada paso que ejecuta."] },
      { y: 1.9, h: 2.6, size: 13 });
    D.enunciado(s, "La pregunta que cambió: ya no es «¿quién le pagó a quién?», sino «¿cuál es el estado de todos los programas después de esta transacción?».", { y: 4.75, h: 1.3, size: 18 });
    D.parrafo(s, "Turing-completo trae un problema que Bitcoin evitaba: un programa puede no terminar nunca. Guarden esa idea: es la razón de ser del gas.", { y: 6.2, h: 0.55, size: 13, color: C.ocre });
    s.addNotes("Buterin, V. (2014), Ethereum White Paper. Retoma la lámina 'Turing-completo y compatibilidad con la EVM' de la S1.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · dos formas de llevar la cuenta", titulo: "Modelo UTXO frente a modelo de cuentas", ic: "rejilla", tituloSize: 27 });
    D.parrafo(s, "Ya lo anticipamos en la Sesión 3. Ahora que conocemos Ethereum se ve con claridad, porque cada red eligió un modelo distinto por razones de diseño.", { y: 1.9, h: 0.62, size: 14 });
    D.dosColumnas(s,
      { et: "UTXO · Bitcoin · como billetes", texto: "No existe «el saldo de Ana». Existen salidas no gastadas que su clave puede desbloquear. Para pagar 7 con un billete de 10, se gasta el billete entero y se crean dos salidas nuevas: 7 para el comercio y 3 de cambio para Ana." },
      { et: "Cuentas · Ethereum · como un banco", texto: "Existe un registro global: la dirección de Ana tiene 10. Pagar 7 resta 7 de su cuenta y suma 7 a la otra. Las cuentas de contrato además guardan código y datos propios." },
      { y: 2.7, h: 2.55, size: 13 });
    D.nodo(s, { x: M, y: 5.5, w: 2.2, h: 0.62, titulo: "BILLETE 10", fill: C.superf });
    D.flecha(s, M + 2.2, 5.81, M + 2.8, 5.81, C.naranja, 2);
    D.nodo(s, { x: M + 2.8, y: 5.5, w: 1.45, h: 0.62, titulo: "7 → COMERCIO", fill: C.blanco, line: C.naranja, size: 9.5 });
    D.nodo(s, { x: M + 4.35, y: 5.5, w: 1.45, h: 0.62, titulo: "3 → ANA", fill: C.blanco, line: C.naranja, size: 9.5 });
    D.nodo(s, { x: M + 6.45, y: 5.5, w: 2.4, h: 0.62, titulo: "ANA: 10 → 3", fill: C.superf, line: C.violeta });
    D.nodo(s, { x: M + 9.0, y: 5.5, w: CW - 9.0, h: 0.62, titulo: "COMERCIO: 0 → 7", fill: C.superf, line: C.violeta });
    s.addNotes("El cambio vuelve a una dirección nueva en las billeteras bien diseñadas, lo que mejora la privacidad del modelo UTXO.");
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
    s.addNotes("Cardano usa un UTXO extendido (eUTXO) precisamente para intentar tener programabilidad sin perder paralelismo. Mencionar solo si preguntan.");
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
    s.addNotes("El Yellow Paper escribe esto como σ_{t+1} ≡ Υ(σ_t, T). No hace falta la notación: sí la idea de que el estado es una función pura de la historia.");
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
    s.addNotes("La abstracción de cuentas (ERC-4337, Sesión 13) difumina esta frontera: billeteras que son contratos. Por eso conviene tener clara la distinción clásica primero.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · qué guarda cada cuenta", titulo: "Los cuatro campos del estado", ic: "capas", tituloSize: 29 });
    const campos = [
      ["nonce", "Cuántas transacciones envió (EOA) o cuántos contratos creó (contrato). El contador anti-repetición de la Sesión 3."],
      ["balance", "Su saldo en wei. Un entero de 256 bits."],
      ["storageRoot", "La raíz de un árbol con todos los datos persistentes del contrato. Vacío en una EOA."],
      ["codeHash", "El hash del código del contrato. En una EOA, el hash de «nada»."],
    ];
    campos.forEach((c, i) => {
      const y = 1.9 + i * 0.98;
      D.caja(s, { x: M, y, w: CW, h: 0.84, fill: i % 2 ? C.superf : C.blanco, sombra: false, lw: 1.25 });
      s.addText(c[0], { x: M + 0.25, y, w: 2.6, h: 0.84, fontFace: F.mono, fontSize: 15, bold: true, color: C.violetaOs, margin: 0, valign: "middle" });
      D.parrafo(s, c[1], { x: M + 3.0, y: y + 0.12, w: CW - 3.2, h: 0.64, size: 13, valign: "middle" });
    });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Merkle otra vez", x: M, y: 5.9, w: CW, h: 0.86, texto: "storageRoot es la raíz de un árbol de Merkle-Patricia: la misma idea de la Sesión 2, adaptada a pares clave-valor.", size: 12.5 });
    s.addNotes("El encabezado de cada bloque incluye la stateRoot: la raíz de TODAS las cuentas. Un cliente ligero puede verificar el saldo de una cuenta con una prueba de inclusión, igual que en la S2.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · la moneda y sus unidades", titulo: "No hay decimales: todo se cuenta en wei", ic: "moneda", tituloSize: 28 });
    D.tabla(s, ["unidad", "en wei", "para qué se usa"], [
      ["wei", "1", "La unidad real. Todo saldo y todo cálculo dentro de la EVM está en wei."],
      ["gwei", "1 000 000 000  (10⁹)", "Precios del gas. «La tarifa base está en 3 gwei»."],
      ["ether", "1 000 000 000 000 000 000  (10¹⁸)", "Montos que ve una persona. Solo existe en las interfaces."],
    ], { y: 1.9, h: 2.1, colW: [1.8, 4.6, 5.693], size: 12 });
    D.parrafo(s, "Por qué enteros: la EVM tiene que dar el mismo resultado en todos los procesadores (A.4). El punto flotante redondea distinto según el hardware; los enteros no.", { y: 4.2, h: 0.65, size: 14 });
    D.codigo(s, `// JavaScript con ethers v6
ethers.parseEther("0.5")              // 500000000000000000n
ethers.formatEther(500000000000000000n) // "0.5"
ethers.parseUnits("3", "gwei")         // 3000000000n`, { x: M, y: 5.0, w: CW, h: 1.7, lang: "js", size: 12 });
    s.addNotes("La 'n' final en JavaScript es BigInt. El error de principiante más común en el frontend (Sesión 12) es mezclar number y BigInt.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · anatomía de una transacción", titulo: "Qué contiene exactamente lo que se firma", ic: "documento", tituloSize: 27 });
    D.codigo(s, `{
  type:                 2,           // EIP-1559
  chainId:              11155111,    // Sepolia
  nonce:                14,
  maxPriorityFeePerGas: 2000000000,  // 2 gwei
  maxFeePerGas:         30000000000, // 30 gwei
  gasLimit:             65000,
  to:                   "0x1c7D…7238",
  value:                0,
  data:                 "0xa9059cbb000…",
  accessList:           [],
  // firma: v, r, s
}`, { x: M, y: 1.9, w: 6.2, h: 4.8, lang: "js", titulo: "transacción tipo 2", size: 11.5 });
    const campos = [
      ["chainId", "Impide repetir la firma en otra red. Una transacción de Sepolia no vale en la red principal."],
      ["nonce", "El contador de la cuenta. Fija el orden y evita la repetición."],
      ["maxFee · priority", "Cuánto está dispuesto a pagar por unidad de gas, como máximo y como propina."],
      ["gasLimit", "El tope de trabajo. Si se agota, la ejecución se revierte."],
      ["to · value · data", "A quién, cuántos wei, y qué función con qué argumentos."],
    ];
    campos.forEach((c, i) => {
      const y = 1.9 + i * 0.97;
      D.etiqueta(s, c[0], { x: M + 6.5, y, w: CW - 6.5, size: 10.5, color: C.ocre });
      D.parrafo(s, c[1], { x: M + 6.5, y: y + 0.34, w: CW - 6.5, h: 0.58, size: 12, ls: 1.12 });
    });
    s.addNotes("El chainId entró con EIP-155 (2016) tras la división Ethereum/Ethereum Classic: sin él, las transacciones se podían repetir en la otra cadena.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · el campo data", titulo: "Cómo se dice «llama a esta función»", ic: "codigo", tituloSize: 28 });
    D.parrafo(s, "Una llamada a contrato viaja en data: primero el selector de la función, después los argumentos, cada uno rellenado a 32 bytes. Esta es una transferencia real de 25 tokens, codificada con ethers:", { y: 1.9, h: 0.95, size: 14 });
    D.definicion(s, "a9059cbb\n000000000000000000000000732805fbe544f6117b755512f2029e3e8b6aa135\n0000000000000000000000000000000000000000000000015af1d78b58c40000", { x: M, y: 2.95, w: CW, h: 1.35, size: 12.5 });
    D.pasos(s, [
      ["SELECTOR · 4 BYTES", "Los primeros 4 bytes de keccak256(\"transfer(address,uint256)\"). Keccak de la Sesión 2, otra vez."],
      ["ARGUMENTO 1 · 32 BYTES", "La dirección de destino, rellenada con ceros por la izquierda. Es la dirección del laboratorio de la Sesión 3."],
      ["ARGUMENTO 2 · 32 BYTES", "25 × 10¹⁸ en hexadecimal: el token tiene 18 decimales, así que 25 tokens son 25 seguidos de 18 ceros."],
    ], { y: 4.5, alto: 0.66, gap: 0.08, anchoEt: 3.5, size: 11.5 });
    s.addNotes("68 bytes en total: 4 + 32 + 32. Dos funciones con el mismo selector colisionarían; con 4 bytes pasa, y es un vector de ataque conocido en proxies (Sesión 9).");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · por qué existe el gas", titulo: "Un programa que no termina nunca", ic: "gas", tituloSize: 29 });
    D.parrafo(s, "Con un lenguaje Turing-completo, alguien puede desplegar un bucle infinito. Y no existe algoritmo que decida de antemano si un programa cualquiera terminará: es el problema de la parada, demostrado por Turing en 1936.", { y: 1.9, h: 0.95, size: 14.5 });
    D.enunciado(s, "Solución: no se pregunta si el programa termina. Se cobra cada paso por adelantado, y cuando se acaba lo pagado, se detiene.", { y: 3.0, h: 1.22, size: 19, line: C.naranja });
    D.dosColumnas(s,
      { et: "Qué resuelve", items: ["Nadie puede bloquear la red con un cómputo infinito.", "Quien consume recursos de miles de nodos los paga.", "El costo de un ataque de denegación de servicio se vuelve real."] },
      { et: "Qué NO resuelve", items: ["No hace barato lo que de verdad es costoso.", "No evita que un contrato mal hecho consuma gas en vano.", "No protege al usuario que firma un límite demasiado alto sin mirar."] },
      { y: 4.42, h: 2.32, size: 12.5 });
    s.addNotes("Distinción clave: gas es la cantidad de trabajo (fija por instrucción). El precio del gas es cuánto ETH vale cada unidad (variable según la demanda).");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · límite y consumo", titulo: "El límite de gas y lo que pasa si se agota", ic: "alerta", tituloSize: 27 });
    D.tabla(s, ["caso", "qué ocurre con el estado", "qué ocurre con el gas"], [
      ["Termina bien", "Se aplican todos los cambios.", "Se cobra solo lo usado. El resto del límite no se paga."],
      ["Se revierte (require falla)", "No se aplica ningún cambio: como si no hubiera ocurrido.", "Se cobra el gas consumido HASTA el punto del error."],
      ["Se agota el límite", "No se aplica ningún cambio.", "Se cobra el límite COMPLETO: el trabajo sí se hizo."],
    ], { y: 1.9, h: 2.6, colW: [2.9, 4.6, 4.593], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error que cuesta dinero", x: M, y: 4.75, w: CW, h: 1.2, texto: "Una transacción fallida también aparece en el explorador, con estado «Fail», y también se paga. Revertir protege el estado, no el bolsillo.", size: 13.5 });
    D.parrafo(s, "Por eso las billeteras estiman el gas antes de enviar: ejecutan la transacción en simulación sobre el estado actual y proponen un límite con un margen.", { y: 6.15, h: 0.6, size: 13 });
    s.addNotes("Mostrar en el explorador una transacción con status Fail durante el laboratorio forense: siempre hay alguna.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · el precio del gas", titulo: "EIP-1559: tarifa base más propina", ic: "grafico", tituloSize: 29 });
    D.parrafo(s, "Desde agosto de 2021 el precio no se subasta a ciegas. Tiene dos partes con destinos distintos:", { y: 1.9, h: 0.5, size: 14.5 });
    D.dosColumnas(s,
      { et: "Tarifa base (baseFee)", texto: "La fija el protocolo en cada bloque, igual para todos. Si el bloque anterior pasó de la mitad de su capacidad, sube; si quedó por debajo, baja. Como máximo un 12,5 % por bloque. Se QUEMA: no la recibe nadie." },
      { et: "Propina (priorityFee)", texto: "La elige el usuario y la recibe el validador que incluye la transacción. Es el incentivo para ser incluido antes cuando hay congestión." },
      { y: 2.55, h: 2.35, size: 13 });
    D.definicion(s, "costo = gas_usado × (tarifa_base + propina)          con   tarifa_base + propina  ≤  maxFeePerGas", { x: M, y: 5.1, w: CW, h: 0.65, size: 12 });
    D.parrafo(s, "Lo que se firma es un máximo. Si la tarifa base baja entre la firma y la inclusión, la diferencia no se cobra.", { y: 5.95, h: 0.6, size: 13.5, color: C.ocre });
    s.addNotes("Antes de EIP-1559, el precio era una subasta de primer precio: la gente pagaba de más por miedo. Ahora la tarifa base es predecible bloque a bloque.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · con números", titulo: "Cuánto cuesta de verdad una transferencia de tokens", ic: "moneda", tituloSize: 25 });
    D.tabla(s, ["dato", "valor", "de dónde sale"], [
      ["Gas usado", "65 000", "Lo que consumió la ejecución (el límite firmado era mayor)."],
      ["Tarifa base del bloque", "12 gwei", "La fijó el protocolo en ese bloque."],
      ["Propina", "2 gwei", "La eligió la billetera del usuario."],
      ["Precio efectivo", "14 gwei", "Base más propina."],
      ["Costo total", "65 000 × 14 gwei = 910 000 gwei = 0,00091 ETH", "Lo que sale de la cuenta, además del valor transferido."],
      ["Quemado", "65 000 × 12 gwei = 0,00078 ETH", "Desaparece de la oferta total de ETH."],
      ["Para el validador", "65 000 × 2 gwei = 0,00013 ETH", "La propina."],
    ], { y: 1.9, h: 4.2, colW: [2.6, 4.8, 4.693], size: 11.5 });
    D.parrafo(s, "Cifras ilustrativas: en el laboratorio las van a leer de transacciones reales. El orden de magnitud es el mismo; el precio cambia minuto a minuto.", { y: 6.25, h: 0.5, size: 12.5, color: C.gris });
    s.addNotes("Hacer la multiplicación en el tablero. Es exactamente el ejercicio del informe forense.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · por dentro", titulo: "La EVM es una máquina de pila", ic: "capas", tituloSize: 29 });
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
    s.addNotes("evm.codes permite ejecutar opcodes paso a paso en el navegador. Buen recurso para quien quiera profundizar.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · la tabla de precios", titulo: "Lo que cuesta cada instrucción", ic: "gas", tituloSize: 29 });
    D.tabla(s, ["instrucción", "gas", "qué hace"], [
      ["ADD · MUL", "3 · 5", "Aritmética en la pila. Casi gratis."],
      ["KECCAK256", "30 + 6 por palabra", "Calcular un hash."],
      ["SLOAD", "2 100 primera vez · 100 después", "Leer una ranura del almacenamiento."],
      ["SSTORE 0 → x", "20 000 (+ 2 100 primer acceso)", "Estrenar una ranura. La operación más cara de uso común."],
      ["SSTORE x → y", "2 900 (+ 2 100 primer acceso)", "Cambiar un valor que ya existía."],
      ["LOG", "375 + 375 por tema + 8 por byte", "Emitir un evento."],
      ["Transacción base", "21 000", "Solo por existir: firma, nonce, saldo."],
      ["Datos de la llamada", "4 por byte cero · 16 por byte no cero", "Lo que viaja en data."],
    ], { y: 1.9, h: 4.35, colW: [2.9, 3.9, 5.293], size: 11.5 });
    D.parrafo(s, "Valores vigentes desde la actualización Berlin (2021). Referencia: evm.codes. Las actualizaciones posteriores ajustaron algunos casos, pero la jerarquía es la misma.", { y: 6.35, h: 0.45, size: 11, color: C.gris });
    s.addNotes("La proporción que hay que memorizar: escribir un dato nuevo cuesta unas 7 000 veces más que una suma. Todo diseño de contratos gira alrededor de eso.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · dónde viven los datos", titulo: "storage, memory y calldata", ic: "rejilla", tituloSize: 30 });
    D.tabla(s, ["lugar", "dura", "quién lo modifica", "costo"], [
      ["storage", "Para siempre, entre transacciones.", "Solo el propio contrato.", "Muy caro: es el estado que replican todos los nodos."],
      ["memory", "Solo durante la llamada.", "La función que se ejecuta.", "Barato y crece con el tamaño usado."],
      ["calldata", "Solo durante la llamada.", "Nadie: es de solo lectura.", "El más barato para parámetros: no se copia."],
      ["stack", "Solo durante la instrucción.", "La propia EVM.", "Casi gratis, pero limitado a 16 variables accesibles."],
    ], { y: 1.9, h: 3.35, colW: [1.9, 3.1, 2.9, 4.193], size: 12 });
    D.codigo(s, `function sumar(uint256[] calldata datos)  // no se copia: más barato
function sumar(uint256[] memory datos)    // se copia a memoria primero`, { x: M, y: 5.45, w: CW, h: 1.25, lang: "sol", size: 12.5 });
    s.addNotes("El error 'stack too deep' de Solidity viene de ese límite de 16. Aparece cuando una función tiene demasiadas variables locales.");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · lo medimos", titulo: "Las cifras reales del laboratorio", ic: "grafico", tituloSize: 29 });
    D.tabla(s, ["operación", "gas medido", "lo que enseña"], [
      ["Transferir ETH sin contrato", "21 000", "El costo base exacto: nada más."],
      ["Escribir en una ranura vacía", "43 602", "21 000 base + 22 100 de estrenar la ranura."],
      ["Sobrescribir esa ranura", "26 479", "Mucho más barato: la ranura ya existía."],
      ["Borrarla (volver a cero)", "21 445", "Casi la base: el protocolo devuelve gas por liberar espacio."],
      ["Emitir un evento con dos datos", "22 862", "La mitad que escribir: por eso se registran eventos."],
      ["Sumar 50 números · memory / calldata", "42 058 / 39 360", "Leer sin copiar ahorra."],
    ], { y: 1.9, h: 4.0, colW: [3.9, 2.4, 5.793], size: 12 });
    D.parrafo(s, "Medido en la red local de Hardhat con Solidity 0.8.28 y optimizador activo. En el laboratorio primero predicen, después corren el mismo script y comparan.", { y: 6.05, h: 0.65, size: 12.5, color: C.gris });
    s.addNotes("Estas cifras salen de scripts/s05/medir-gas.js. Si alguien obtiene valores algo distintos, suele ser por otra versión del compilador; las proporciones se mantienen.");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · el viaje de una transacción", titulo: "De la firma a la finalidad", ic: "flecha", tituloSize: 29 });
    D.pasos(s, [
      ["FIRMA", "La billetera arma la transacción, estima el gas y la firma con la clave privada. Nada ha salido del computador."],
      ["MEMPOOL", "Se envía a un nodo, que la valida y la propaga por rumor (Sesión 3). Queda pendiente, a la vista de todos."],
      ["INCLUSIÓN", "Un constructor de bloques la elige, normalmente por propina. El validador de turno propone el bloque."],
      ["CONFIRMACIÓN", "El bloque se propaga y otros validadores lo atestiguan. Aparece en el explorador con estado y recibo."],
      ["FINALIDAD", "Unas dos épocas después, unos 13 minutos, queda finalizada (Sesión 4)."],
    ], { y: 1.9, alto: 0.82, gap: 0.12, anchoEt: 2.6, size: 12.5 });
    s.addNotes("Mencionar que en la red principal la mayoría de bloques los arman constructores especializados (separación proponente-constructor, MEV-boost). Se profundiza en MEV en la Sesión 9.");
  }

  {
    const s = await D.lamina({ kicker: "A.19 · el recibo", titulo: "Leer una transacción en el explorador", ic: "lupa", tituloSize: 28 });
    D.tabla(s, ["campo del explorador", "qué significa", "error típico al leerlo"], [
      ["Status", "Success o Fail.", "Creer que Fail no costó nada."],
      ["From · To", "Quién firmó y a quién iba.", "En un token, To es el CONTRATO del token, no quien recibe."],
      ["Value", "ETH enviado con la llamada.", "Pensar que 0 ETH significa que no se movió valor: los tokens van en data."],
      ["Transaction Fee", "Lo que pagó el remitente.", "Confundirlo con el valor transferido."],
      ["Gas Limit & Usage", "El tope firmado y lo consumido.", "Asumir que se cobra el límite cuando la transacción terminó bien."],
      ["Burnt Fees", "La parte quemada de la tarifa base.", "—"],
      ["Input Data", "El campo data, decodificado si el contrato está verificado.", "No ver nada útil porque el contrato no está verificado."],
      ["Logs", "Los eventos emitidos.", "Ignorarlos: son la forma más confiable de saber qué pasó."],
    ], { y: 1.9, h: 4.8, colW: [2.7, 4.1, 5.293], size: 11 });
    s.addNotes("Hacer este recorrido en vivo sobre una transferencia de token en Sepolia antes de soltar el laboratorio.");
  }

  {
    const s = await D.lamina({ kicker: "A.20 · lo que hay que llevarse del bloque A", titulo: "Seis ideas para la Unidad II", ic: "lista", tituloSize: 29 });
    const ideas = [
      "Ethereum es una máquina de estados: mismo estado más misma transacción da el mismo resultado en todo el mundo.",
      "Solo una cuenta externa inicia algo. Un contrato nunca actúa por su cuenta.",
      "Una llamada a función es un selector de 4 bytes seguido de argumentos de 32 bytes.",
      "El gas existe porque no se puede saber si un programa termina: se cobra cada paso.",
      "Costo = gas usado × (tarifa base quemada + propina). Lo firmado es un máximo.",
      "Escribir en storage es, con diferencia, lo más caro. Diseñar contratos es diseñar alrededor de eso.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Laboratorio 05", sub: "Primero se lee la cadena como un forense. Después se predice y se mide el costo de cada instrucción.", minutos: "APROXIMADAMENTE 60 MINUTOS · EN PAREJAS", ic: "lupa" });

  {
    const s = await D.lamina({ kicker: "B.1 · antes de empezar · 5 minutos", titulo: "Punto de control de billeteras", ic: "llave", tituloSize: 29 });
    D.pasos(s, [
      ["ABRIR", "Abrir la billetera creada en la Sesión 2 y desbloquearla."],
      ["RED", "Cambiar a la red de prueba Sepolia. Confirmar que la red NO es la principal."],
      ["SALDO", "Verificar que hay ETH de prueba. Si no, avisar: se reparte desde la billetera institucional."],
      ["FRASE", "Confirmar que la frase de recuperación está guardada en papel, fuera del computador."],
    ], { y: 1.9, alto: 0.76, gap: 0.12, anchoEt: 2.0, size: 13 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Quien perdió la billetera la rehace hoy", x: M, y: 5.42, w: CW, h: 1.3, texto: "No en la Sesión 6, que es cuando se despliega el primer contrato. Nunca se usa esta billetera con dinero real, y la frase no se comparte con nadie, tampoco con el docente.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · parte A · 30 minutos", titulo: "Análisis forense de tres transacciones", ic: "lupa", tituloSize: 28 });
    D.parrafo(s, "En el explorador de Sepolia, cada pareja encuentra tres transacciones reales de tipos distintos y llena la hoja de trabajo.", { y: 1.9, h: 0.6, size: 14.5 });
    D.tabla(s, ["tipo", "cómo encontrarla", "qué tiene que identificar"], [
      ["1 · Transferencia de ETH", "La dirección de su propia billetera, si recibió fondos de prueba.", "Gas usado exactamente 21 000. Valor, tarifa base, propina, costo total."],
      ["2 · Transferencia de token", "La pestaña de transferencias de cualquier token ERC-20 de prueba.", "Selector a9059cbb, destinatario real en los argumentos, el evento Transfer en los logs."],
      ["3 · Llamada que falló", "Un contrato con mucho uso: filtrar por estado Fail.", "Por qué falló, cuánto gas consumió y cuánto costó igualmente."],
    ], { y: 2.65, h: 2.85, colW: [2.6, 4.3, 5.193], size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta que tiene que responder el informe", x: M, y: 5.7, w: CW, h: 1.0, texto: "Para cada una: ¿cuánto se quemó, cuánto recibió el validador, y por qué el gas usado fue el que fue?", size: 13 });
    s.addNotes("La guía completa y la hoja de trabajo están en laboratorios-evm/guias/s05.md.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · parte B · 25 minutos", titulo: "Predecir primero, medir después", ic: "terminal", tituloSize: 29 });
    D.pasos(s, [
      ["PREDECIR", "Con la tabla de A.15, escribir en la hoja cuánto gas creen que cuesta cada operación del contrato Operaciones. Sin correr nada."],
      ["INSTALAR", "En el repositorio del curso: npm install (una sola vez en el semestre)."],
      ["MEDIR", "npx hardhat run scripts/s05/medir-gas.js — corre en la red local: no gasta ETH ni necesita internet."],
      ["COMPARAR", "Anotar la diferencia entre predicción y medición, y explicar las dos mayores."],
    ], { y: 1.9, alto: 0.84, gap: 0.12, anchoEt: 2.1, size: 12.5 });
    D.codigo(s, `npm install
npx hardhat test test/s05/Operaciones.test.js
npx hardhat run scripts/s05/medir-gas.js`, { x: M, y: 5.78, w: CW, h: 0.98, lang: "js", size: 11.5 });
    s.addNotes("La predicción es lo que se evalúa, no el acierto. Una predicción muy equivocada pero bien explicada vale más que una copia de la tabla.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · qué se entrega", titulo: "Evidencia del laboratorio 05", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["parte", "contenido", "peso"], [
      ["A · forense", "Los tres hashes de transacción con enlace, y la tabla de costos de cada una.", "50 %"],
      ["B · gas", "La hoja con predicciones, mediciones y la explicación de las dos mayores diferencias.", "35 %"],
      ["Reflexión", "Un párrafo: ¿qué operación evitarían en un contrato real después de hoy, y por qué?", "15 %"],
    ], { y: 1.9, h: 2.4, colW: [2.2, 8.293, 1.6], size: 12.5 });
    D.parrafo(s, "Máximo dos páginas. Un informe por pareja. Se sube a la plataforma antes de la Sesión 6.", { y: 4.5, h: 0.5, size: 14 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Política de laboratorios", x: M, y: 5.2, w: CW, h: 1.45, texto: "Sin hashes de transacción verificables, la parte A no se califica. Y los hashes tienen que abrir en el explorador: una transacción inventada por un asistente de IA no existe en la cadena, y eso se comprueba en diez segundos.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "B.5 · errores frecuentes", titulo: "Lo que suele salir mal", ic: "bicho", tituloSize: 30 });
    D.tabla(s, ["síntoma", "causa"], [
      ["El explorador no encuentra mi dirección", "Están mirando el explorador de la red principal y no el de Sepolia."],
      ["«Value: 0» en una transferencia de token", "Correcto: el token no es ETH. El monto está en Input Data y en los logs."],
      ["El Input Data es ilegible", "El contrato no está verificado. Busquen otro token que sí lo esté."],
      ["npm install falla en la sala", "Restricción de red. Plan B: el docente comparte la carpeta node_modules por red local."],
      ["El script da cifras algo distintas a las de la lámina", "Otra versión del compilador u optimizador. Las proporciones deben mantenerse."],
    ], { y: 1.9, h: 4.1, colW: [4.4, 7.693], size: 12 });
    D.parrafo(s, "Si algo no se resuelve en 5 minutos, se anota en la hoja y se sigue con la siguiente parte. No se pierde el laboratorio por un problema de red.", { y: 6.15, h: 0.6, size: 13, color: C.ocre });
  }

  /* =============================================================== C */
  await D.preguntaSemana({
    pregunta: "Si guardar un dato en la cadena cuesta decenas de miles de gas, ¿qué NO guardarían nunca en un contrato, y dónde lo guardarían en su lugar?",
    trabajo: [
      "Entregar el informe del laboratorio 05 antes de la Sesión 6.",
      "Leer la introducción de la documentación oficial de Solidity: «Introduction to Smart Contracts».",
      "Terminar el anteproyecto: se entrega en la Sesión 6. Máximo tres páginas.",
      "Opcional: jugar las dos primeras lecciones de CryptoZombies.",
    ],
    notas: "La pregunta prepara la Sesión 11 (IPFS) y el diseño del proyecto: casi siempre se guarda un hash en cadena y el dato fuera.",
  });

  await D.cierre({
    frase: "Cada instrucción tiene precio. Programar bien es saber cuánto cuesta lo que se escribe.",
    sub: "Hoy leyeron la máquina desde fuera. La próxima sesión escriben su primer programa para ella y lo despliegan en una red pública.",
    proxima: "Sesión 6 · Solidity I · primer contrato en Sepolia · entrega del anteproyecto",
  });

  return D.guardar(path.join(__dirname, "Sesion-05-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
