/* =====================================================================
   Sesión 14 · DeFi: finanzas descentralizadas
   Estándar de la Sesión 4: cada concepto con idea llana, ejemplo trabajado
   (números calculados de verdad) y error típico; notas en todas las láminas.
   Los números del AMM salen de contracts/s14/PoolXYK.sol y
   scripts/s14/pool-en-numeros.js; los de pérdida impermanente, de
   scripts/s14/perdida-impermanente.js.
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 14 · DEFI · FINANZAS DESCENTRALIZADAS", titulo: "Sesión 14 · DeFi: finanzas descentralizadas" });
  const { C, F, M, CW } = D;

  async function verificacion({ kicker, pregunta, pistas, notas }) {
    const s = await D.lamina({ kicker, titulo: "Pregunta de verificación", ic: "pregunta", tituloSize: 29 });
    D.enunciado(s, pregunta, { y: 1.9, h: 1.9, size: 19, line: C.naranja });
    D.etiqueta(s, "Antes de responder, piensen en", { x: M, y: 4.05, w: 8, color: C.gris });
    D.lista(s, pistas, { y: 4.45, h: 2.3, size: 13.5, gap: 6 });
    s.addNotes(notas);
    return s;
  }

  function ideas(s, lista, y0 = 1.9, paso = 0.8) {
    lista.forEach((t, i) => {
      const y = y0 + i * paso;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* ------------------------------------------------------------ apertura */
  await D.portada({
    kicker: "SESIÓN 14 · UNIDAD IV · ECOSISTEMA",
    titulo: "DEFI: DINERO\nLEGO, Y SUS\nGRIETAS",
    sub: "Cambiar, prestar y crear dinero estable con contratos. Hoy con números propios: cómo funciona, y sobre todo cómo falla.",
    palabra: "COMPONER",
    ic: "moneda",
    notas: "Abre la Unidad IV. Advertencia explícita desde el minuto uno: esta NO es una sesión para aprender a invertir ni una recomendación financiera. Es para entender el mecanismo y el riesgo como ingenieros. Todo el laboratorio corre en la red local o en Sepolia, sin dinero real. 2 minutos.",
  });

  await D.agenda({
    intro: "Apertura de 10 minutos y pausa de 10 entre A y B. Cada número de hoy está calculado por un contrato o un script del laboratorio: pueden rehacerlo todo.",
    bloques: [
      ["A", "PRIMITIVAS Y RIESGOS", "AMM y pérdida impermanente, préstamos, stablecoins y UST, oráculos, flash loans, rendimiento.", "~75 min"],
      ["B", "LABORATORIO 14", "Un mini-AMM x·y=k, el oráculo de Chainlink en Sepolia y la hoja de pérdida impermanente.", "~65 min"],
      ["C", "EL PROYECTO", "¿Qué primitiva DeFi toca su proyecto y qué riesgo asume?", "~20 min"],
    ],
    notas: "Reparto: 0-10 apertura (pregunta de la semana de la S13), 10-85 bloque A, 85-95 pausa, 95-160 bloque B (30 min AMM, 20 min oráculo, 15 min hoja), 160-180 bloque C y cierre. Si el tiempo aprieta, la hoja de cálculo pasa a trabajo autónomo: la plantilla trae autocomprobación.",
  });

  await D.objetivo({
    objetivo: "Comprender las primitivas financieras en cadena y sus riesgos técnicos, midiendo cada una con código propio.",
    preguntas: [
      "¿Cómo pone precio un AMM sin libro de órdenes, y por qué las órdenes grandes salen caras?",
      "¿Qué pierde exactamente quien aporta liquidez cuando el precio se mueve?",
      "¿Por qué un préstamo DeFi exige más garantía que lo prestado, y qué es el factor de salud?",
      "¿Por qué oráculos y flash loans concentran los ataques, y por qué cayó UST?",
    ],
    ra: "RA2 · justificar arquitecturas  ·  RA5 · riesgos y seguridad  ·  RA7 · implicaciones económicas y éticas.",
    notas: "Las cuatro preguntas se retoman en la lámina de ideas del bloque A. RA7 conecta con el ensayo individual que se plantea en la S15: UST es un tema de ensayo posible.",
  });

  await D.glosario({
    items: [
      ["AMM", "Automated Market Maker", "Contrato con dos reservas que fija el precio con una fórmula (x · y = k) en vez de emparejar órdenes."],
      ["LP", "liquidity provider", "Quien deposita las dos reservas en el pool y cobra las comisiones. Recibe participaciones."],
      ["Slippage", "deslizamiento", "Diferencia entre el precio esperado y el obtenido. Se acota con un «mínimo a recibir»."],
      ["PI", "pérdida impermanente", "Lo que el LP tiene de menos frente a solo conservar los dos activos, cuando el precio cambia."],
      ["Factor de salud", "health factor", "Garantía ajustada por riesgo ÷ deuda. Por debajo de 1, cualquiera puede liquidar la posición."],
      ["Stablecoin", "moneda estable", "Token que busca valer 1 USD: respaldada en dinero, en cripto, o «algorítmica»."],
      ["Oráculo", "oracle", "Contrato que publica en la cadena un dato de afuera, como el precio ETH/USD."],
      ["Flash loan", "préstamo relámpago", "Préstamo sin garantía que se pide y se devuelve en la MISMA transacción, o todo se revierte."],
    ],
    notas: "Pedir que marquen los que no conocían. Insistir en PI (pérdida impermanente) y factor de salud: son los dos cálculos que se hacen hoy a mano y en código.",
  });

  /* ================================================================ A */
  {
    const s = await D.divisor({ letra: "A", titulo: "Primitivas y riesgos", sub: "DeFi es un puñado de piezas que se combinan sin pedir permiso. Esa composabilidad es su fuerza y, cuando algo falla, su forma de propagar el daño.", minutos: "APROXIMADAMENTE 75 MINUTOS", ic: "moneda" });
    s.addNotes("Orden del bloque: qué es DeFi (5 min), AMM y PI (25), préstamos (12), stablecoins y UST (12), oráculos y flash loans (12), rendimiento y riesgos (7), cierre (2).");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · qué es DeFi y qué dice resolver", titulo: "Servicios financieros hechos de contratos", ic: "capas", tituloSize: 26 });
    D.parrafo(s, "DeFi replica servicios financieros —cambiar un activo por otro, prestar, pedir prestado, ganar interés— con contratos públicos. No hay una entidad que apruebe, custodie ni pueda excluir a nadie: hay código y una billetera.", { y: 1.9, h: 0.95, size: 14.5 });
    D.dosColumnas(s,
      { et: "Lo que promete", items: ["Acceso sin permiso: basta una billetera, sin historial bancario.", "Reglas públicas y verificables: el código está en la cadena.", "Liquidación en minutos, a cualquier hora, sin intermediario."] },
      { et: "Lo que trae consigo", linea: C.rojo, color: C.rojo, items: ["Sin entidad no hay a quién reclamar: un error de código es definitivo.", "El usuario asume riesgos que antes gestionaba un banco.", "La mayoría de los usos reales son especulativos, no inclusión financiera."] },
      { y: 2.95, h: 2.5, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.6, w: CW, h: 1.12, texto: "«Sin intermediario significa sin riesgo de contraparte». El riesgo no desaparece: se muda al código, al oráculo, a la gobernanza y al emisor de la stablecoin. Hoy vamos a nombrar a cada uno.", size: 12.5 });
    s.addNotes("Conectar con la tesis del curso: saber cuándo NO usar blockchain. Para la mayoría de usuarios colombianos, un banco o una billetera regulada resuelve mejor el problema de pagos; DeFi aporta algo distinto (composición abierta), no algo mejor en todo. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · composabilidad", titulo: "Dinero lego: piezas que se encajan solas", ic: "bloques", tituloSize: 27 });
    D.parrafo(s, "Como los contratos son públicos y cualquiera puede llamarlos, cada pieza se usa como bloque de otra sin pedir permiso. Una sola transacción puede atravesar cuatro protocolos:", { y: 1.9, h: 0.65, size: 14 });
    const piezas = [["STABLECOIN", "el dólar en\nla cadena"], ["PRÉSTAMO", "deposita ETH,\npide stablecoins"], ["AMM", "cambia las\nstablecoins"], ["AGREGADOR", "busca el mejor\nprecio entre AMM"]];
    piezas.forEach((p, i) => {
      const x = M + i * 3.05;
      D.nodo(s, { x, y: 2.8, w: 2.6, h: 1.2, titulo: p[0], sub: p[1], fill: i % 2 ? C.superf : C.blanco, line: i === 0 ? C.naranja : C.tinta, subSize: 11 });
      if (i < 3) D.flecha(s, x + 2.62, 3.4, x + 3.03, 3.4, C.tinta, 2);
    });
    D.dosColumnas(s,
      { et: "La fuerza", texto: "Nadie tuvo que firmar un convenio para que el agregador use el AMM, ni el AMM la stablecoin. Innovar es escribir un contrato que llama a otros." },
      { et: "La grieta", linea: C.rojo, color: C.rojo, texto: "Si la stablecoin pierde su valor, fallan a la vez el préstamo que la acepta como garantía, el AMM que la cotiza y todo lo que se apoya en ellos. El contagio también es componible." },
      { y: 4.25, h: 2.45, size: 12.5 });
    s.addNotes("Ejemplo real de contagio: el colapso de UST (A.13) arrastró protocolos que la aceptaban como colateral. No dar cifras de protocolos concretos que no estén verificadas. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · el AMM", titulo: "Poner precio con una fórmula, no con un libro", ic: "grafico", tituloSize: 26 });
    D.parrafo(s, "Una bolsa tradicional empareja compradores y vendedores en un libro de órdenes. Un AMM guarda dos reservas y deja que cualquiera cambie una por otra, siempre que el producto de las reservas no baje.", { y: 1.9, h: 0.95, size: 14 });
    D.definicion(s, "x · y = k        precio del ETH = y ÷ x        (x = ETH en el pool, y = USDC en el pool)", { x: M, y: 3.0, w: CW, h: 0.62, size: 13 });
    D.tabla(s, ["pool de ejemplo", "valor"], [
      ["Reservas", "10 ETH (x) y 20 000 USDC (y)"],
      ["k = x · y", "200 000: la curva sobre la que se mueve el pool"],
      ["Precio spot", "20 000 ÷ 10 = 2 000 USDC por ETH"],
      ["Comisión", "0,30 % de cada entrada, que se queda en el pool (como Uniswap v2)"],
    ], { y: 3.85, h: 1.85, colW: [3.0, 9.093], size: 12 });
    D.parrafo(s, "Nadie fija el precio: sale del balance del pool. Si alguien saca ETH, x baja, y sube, y el ETH que queda se encarece. El arbitraje con otros mercados mantiene el precio cerca del «real».", { y: 5.9, h: 0.8, size: 13, color: C.ocre });
    s.addNotes("Es exactamente el pool del laboratorio: contracts/s14/PoolXYK.sol con 10 TETH y 20 000 TUSD. La comisión de 0,30 % es la de Uniswap v2 (docs.uniswap.org, 'How Uniswap works'); v3 y v4 ofrecen varios niveles. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · ejemplo trabajado", titulo: "Comprar ETH con 2 000 USDC, paso a paso", ic: "grafico", tituloSize: 26 });
    D.pasos(s, [
      ["COMISIÓN", "Entran 2 000 USDC. El 0,30 % se queda en el pool: entrada neta = 2 000 × 0,997 = 1 994."],
      ["NUEVA RESERVA Y", "Para calcular la salida: y' = 20 000 + 1 994 = 21 994."],
      ["NUEVA RESERVA X", "El producto no puede bajar: x' = 200 000 ÷ 21 994 = 9,0934 ETH."],
      ["SALIDA", "Sale 10 − 9,0934 = 0,906611 ETH. No 1 ETH, aunque el spot decía 2 000."],
      ["DESPUÉS", "Reservas 9,0934 ETH y 22 000 USDC · precio 2 419,34 · k = 200 054,56 (creció: la comisión)."],
    ], { y: 1.9, alto: 0.72, gap: 0.09, anchoEt: 2.5, size: 12 });
    D.definicion(s, "salida = y_sal · entrada_neta ÷ (x_ent + entrada_neta) = 10 × 1 994 ÷ 21 994 = 0,906610893880149131 ETH", { x: M, y: 6.25, w: CW, h: 0.5, size: 11 });
    s.addNotes("Valores exactos calculados por el contrato PoolXYK (prueba 'el ejemplo de la lámina' y scripts/s14/pool-en-numeros.js). El valor con 18 decimales es el que la prueba compara bit a bit. Hacerlo en el tablero: es el cálculo que los estudiantes reproducen en el TODO 1 del laboratorio. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · slippage e impacto de precio", titulo: "Cuanto más grande la orden, peor el precio", ic: "grafico", tituloSize: 26 });
    D.tabla(s, ["USDC que entran", "ETH que salen", "precio promedio", "peor que el spot (2 000)"], [
      ["100", "0,049603", "2 016,02", "0,80 %"],
      ["2 000", "0,906611", "2 206,02", "10,30 %"],
      ["10 000", "3,326660", "3 006,02", "50,30 %"],
    ], { y: 1.9, h: 1.75, colW: [2.8, 2.8, 3.0, 3.493], size: 12.5 });
    D.dosColumnas(s,
      { et: "Qué hay dentro de ese «peor»", texto: "0,30 % es la comisión. El resto es impacto de precio: la orden mueve la curva. Con 100 USDC es 0,5 %; con 10 000 (la mitad del pool) es 50 %. Un pool grande sufre menos." },
      { et: "Cómo se defiende el usuario", texto: "La interfaz cotiza y el usuario fija un MÍNIMO a recibir (tolerancia, p. ej. 1 %). Si entre la cotización y la ejecución el precio empeora más, el contrato revierte y no se pierde nada." },
      { y: 3.85, h: 1.85, size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.85, w: CW, h: 0.87, texto: "Poner tolerancia «100 %» para que la transacción no falle: es regalarle la diferencia a quien se adelante (sandwich).", size: 12.5 });
    s.addNotes("Tabla generada por scripts/s14/pool-en-numeros.js (salida real). Fórmula cerrada del precio promedio: 2 000 × (1 + Δ/20 000) ÷ 0,997. Ataque sandwich: un bot ve la orden en el mempool, compra antes, deja que la víctima compre más caro y vende después; el mínimo a recibir es la defensa. La prueba ★ de slippage del laboratorio simula justo eso. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · proveedores de liquidez", titulo: "Quién pone las reservas, y qué gana", ic: "moneda", tituloSize: 27 });
    D.parrafo(s, "El pool no tiene dueño: lo llenan proveedores de liquidez (LP) que depositan los dos activos en la proporción del precio actual. A cambio reciben participaciones, un token que representa su fracción del pool.", { y: 1.9, h: 0.95, size: 14 });
    D.tabla(s, ["momento", "qué pasa (con el contrato del laboratorio)"], [
      ["Primer depósito", "10 ETH + 20 000 USDC → √(10 × 20 000) = 447,21 participaciones. Fija el precio inicial."],
      ["Segundo depósito", "Ofrece 1 ETH y 5 000 USDC; el pool solo toma 2 000 (la proporción) → 44,72 participaciones."],
      ["Cada intercambio", "El 0,30 % de la entrada queda en las reservas: k crece y cada participación vale más."],
      ["Retiro", "Devuelve participaciones y saca su fracción de AMBAS reservas, en la proporción de ese momento."],
    ], { y: 3.0, h: 2.45, colW: [2.6, 9.493], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.6, w: CW, h: 1.12, texto: "«Deposito 1 ETH y 2 000 USDC, y retiro lo mismo más comisiones». No: se retira la proporción del momento. Si el precio cambió, vuelven MÁS de un activo y MENOS del otro. Eso es la lámina siguiente.", size: 12.5 });
    s.addNotes("Las participaciones con raíz cuadrada son el diseño de Uniswap v2 (no dependen de cuál token se tome como unidad). Valores del laboratorio: 447 213 595 499 957 939 281 unidades mínimas = 447,21 participaciones. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · el costo de proveer liquidez", titulo: "Pérdida impermanente, con números", ic: "balanza", tituloSize: 27 });
    D.parrafo(s, "Un LP deposita 1 ETH + 2 000 USDC con ETH a 2 000 (k = 2 000). El arbitraje lleva el pool al precio de mercado. Al retirar, ¿cuánto tiene frente a no haber hecho nada?", { y: 1.9, h: 0.65, size: 14 });
    D.tabla(s, ["escenario", "r", "ETH en el pool", "USDC en el pool", "valor pool", "si conserva", "pérdida"], [
      ["A · ETH cae a 1 000", "0,5", "1,4142", "1 414,21", "2 828,43", "3 000", "5,72 %"],
      ["B · ETH sube a 4 000", "2", "0,7071", "2 828,43", "5 656,85", "6 000", "5,72 %"],
      ["C · ETH sube a 8 000", "4", "0,5000", "4 000,00", "8 000,00", "10 000", "20,00 %"],
    ], { y: 2.7, h: 1.75, colW: [2.9, 0.8, 1.7, 1.8, 1.6, 1.55, 1.743], size: 11.5 });
    D.definicion(s, "ETH en el pool = 1 ÷ √r   ·   USDC en el pool = 2 000 × √r   ·   pérdida = 1 − 2√r ÷ (1 + r)", { x: M, y: 4.65, w: CW, h: 0.55, size: 11.5 });
    D.dosColumnas(s,
      { et: "Por qué pasa", texto: "El pool vende el que sube y compra el que baja. El arbitrajista se lleva la diferencia; el LP la paga." },
      { et: "Por qué «impermanente»", texto: "Si el precio vuelve a 2 000, desaparece. Se vuelve permanente cuando el LP retira." },
      { y: 5.3, h: 1.42, size: 11.5 });
    s.addNotes("Tabla generada por scripts/s14/perdida-impermanente.js (node scripts/s14/perdida-impermanente.js). Es exactamente la hoja de cálculo del laboratorio: los estudiantes la reproducen con fórmulas y la plantilla les dice si coinciden. Derivación: con k = x·y y p = y/x, x = √(k/p) e y = √(k·p). 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · simetría y medida real", titulo: "Subir ×2 duele igual que bajar ÷2", ic: "balanza", tituloSize: 27 });
    D.tabla(s, ["cambio de precio", "×1,25", "×2 o ÷2", "×3", "×4", "×5", "×10"], [
      ["pérdida vs. conservar", "0,62 %", "5,72 %", "13,40 %", "20,00 %", "25,46 %", "42,50 %"],
    ], { y: 1.9, h: 0.95, colW: [3.0, 1.45, 1.6, 1.5, 1.5, 1.5, 1.543], size: 12.5 });
    D.parrafo(s, "La fórmula depende de r y de 1/r de la misma forma: por eso A y B dan igual. Y crece rápido con el tamaño del movimiento, en cualquier dirección.", { y: 3.05, h: 0.65, size: 13.5 });
    D.cifra(s, "19,90 %", "pérdida MEDIDA en cadena con el contrato PoolXYK cuando un arbitrajista lleva el precio a 7 988 (r = 3,994). La fórmula da 19,96 %.", { x: M, y: 3.9, w: 5.9, h: 1.65, size: 30, tsize: 11.5 });
    D.cifra(s, "≈ 38 días", "de comisiones para compensar un 5,72 % en un pool de 40 000 USDC que mueve 20 000 USDC al día (0,30 % → 60 USDC/día).", { x: M + 6.15, y: 3.9, w: CW - 6.15, h: 1.65, size: 30, color: C.violeta, tsize: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.75, w: CW, h: 0.97, texto: "Mirar solo las comisiones cobradas. Ser LP es rentable solo si las comisiones superan la pérdida impermanente del período.", size: 12.5 });
    s.addNotes("Medida en cadena: prueba ★ 'pérdida impermanente en cadena' y parte 3 de scripts/s14/pool-en-numeros.js; la medida es algo menor que la fórmula porque la comisión del arbitrajista quedó para el LP. Los 38 días: 0,0572 × 40 000 = 2 288 USDC ÷ 60 USDC/día = 38,1. Es un ejemplo ilustrativo, no un dato de mercado. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · préstamos", titulo: "Prestar sin conocer a nadie: sobrecolateral", ic: "escudo", tituloSize: 26 });
    D.parrafo(s, "Un banco presta según tu historial y te puede demandar. Un contrato no sabe quién eres ni puede embargarte. Solo le queda una garantía: que dejes en depósito MÁS valor del que te llevas, y venderla si hace falta.", { y: 1.9, h: 0.95, size: 14 });
    D.tabla(s, ["parámetro", "qué es", "ejemplo de hoy"], [
      ["Colateral", "Lo que se deja en garantía, a precio del oráculo.", "1 ETH a 2 000 = 2 000 USD"],
      ["Umbral de liquidación", "Qué fracción del colateral cuenta para cubrir la deuda. Lo fija la gobernanza por activo.", "80 % (valor de ejemplo)"],
      ["Deuda", "Lo prestado, más intereses que crecen con el tiempo.", "1 000 USDC"],
      ["Factor de salud", "colateral × umbral ÷ deuda. Menor que 1: liquidable.", "2 000 × 0,8 ÷ 1 000 = 1,6"],
    ], { y: 3.0, h: 2.55, colW: [2.7, 5.9, 3.493], size: 11.5 });
    D.parrafo(s, "¿Para qué pedir 1 000 dejando 2 000? Para tener liquidez sin vender el ETH (y sin el evento tributario de venderlo), o para apalancarse. En ambos casos se apuesta a que el ETH no caiga mucho.", { y: 5.75, h: 0.95, size: 13, color: C.ocre });
    s.addNotes("La fórmula del factor de salud es la de Aave v3 (aave.com/docs): suma de colateral × umbral de liquidación ÷ deuda total. El 80 % es un valor de EJEMPLO para el cálculo; cada activo tiene el suyo y cambia por gobernanza. Mencionar que Aave ya anunció una v4; la referencia del curso es v3. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · ejemplo trabajado", titulo: "El ETH cae: cuándo y cómo se liquida", ic: "alerta", tituloSize: 27 });
    D.pasos(s, [
      ["PRECIO DE LIQUIDACIÓN", "Factor = 1 cuando P × 0,8 ÷ 1 000 = 1 → P = 1 250. Una caída del 37,5 % basta."],
      ["ETH A 1 200", "Factor = 1 200 × 0,8 ÷ 1 000 = 0,96. Ya es liquidable, sin aviso ni plazo."],
      ["EL LIQUIDADOR", "Paga 500 USDC de la deuda (el 50 %) y recibe 500 × 1,05 ÷ 1 200 = 0,4375 ETH: 5 % de bonificación."],
      ["DESPUÉS", "Quedan 0,5625 ETH (675 USD) y 500 de deuda: factor 675 × 0,8 ÷ 500 = 1,08."],
      ["LA CUENTA", "El prestatario perdió 25 USD de bonificación más su exposición. El liquidador ganó 25 en segundos."],
    ], { y: 1.9, alto: 0.72, gap: 0.09, anchoEt: 3.0, size: 12 });
    D.parrafo(s, "En Aave v3 el liquidador puede pagar hasta el 50 % de la deuda por vez, y hasta el 100 % si el factor cae por debajo de 0,95.", { y: 6.2, h: 0.5, size: 12.5, color: C.ocre });
    s.addNotes("Números calculados con un script (factor inicial 1,6; precio de liquidación 1 250; con ETH a 1 200 el factor es 0,96; tras liquidar 50 %, 1,08). La bonificación del 5 % es de EJEMPLO: en Aave cada activo tiene la suya. El 50 %/100 % con umbral 0,95 está en la documentación de Aave v3.3 (github.com/aave-dao/aave-v3-origin, docs/3.3). Error típico: 'el protocolo me avisa antes'; no hay aviso: bots liquidan en el primer bloque en que se puede. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · stablecoins", titulo: "Tres formas de intentar valer 1 dólar", ic: "moneda", tituloSize: 27 });
    D.tabla(s, ["tipo", "cómo sostiene el valor", "ejemplos", "en qué hay que confiar"], [
      ["Respaldada en dinero (fiat)", "Un emisor guarda reservas en dólares o bonos y redime 1 a 1.", "USDC, USDT", "En el emisor, sus reservas y sus auditorías. Puede congelar direcciones."],
      ["Respaldada en cripto", "Préstamos sobrecolateralizados, como A.9, que acuñan la moneda.", "DAI (MakerDAO, hoy Sky)", "En el colateral y en que las liquidaciones funcionen en caídas bruscas."],
      ["Algorítmica", "Sin reservas suficientes: incentivos de acuñar y quemar otro token.", "UST (Terra), 2020-2022", "En que siempre haya alguien dispuesto a comprar. Lámina siguiente."],
    ], { y: 1.9, h: 3.4, colW: [2.7, 3.7, 2.4, 3.293], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.5, w: CW, h: 1.22, texto: "«Una stablecoin es un dólar». Es un pasivo de alguien, o de un mecanismo. Su riesgo es el de ese alguien o ese mecanismo: congelamiento, falta de reservas, o una espiral de pánico.", size: 12.5 });
    s.addNotes("Sky: MakerDAO cambió de nombre a Sky el 27-ago-2024 y lanzó USDS; DAI sigue existiendo y se puede convertir 1:1 a USDS. ⚠ VERIFICAR ANTES DE DICTAR la composición actual del colateral de DAI/USDS (hoy incluye stablecoins y activos del mundo real, no solo cripto): no afirmar porcentajes sin revisar su tablero público. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · el mecanismo de UST", titulo: "Terra/UST: un dólar respaldado por confianza", ic: "bifurca", tituloSize: 26 });
    D.parrafo(s, "La promesa del protocolo: 1 UST siempre se puede cambiar por 1 dólar EN LUNA, el otro token de Terra, y al revés. Si UST vale menos de 1, conviene quemarlo por LUNA y ganar la diferencia; ese arbitraje debía devolverlo a 1.", { y: 1.9, h: 0.95, size: 14 });
    D.nodo(s, { x: M, y: 3.1, w: 3.6, h: 1.05, titulo: "UST CAE A 0,90", sub: "la gente quema UST\ny recibe 1 USD en LUNA", fill: C.blanco, line: C.naranja, subSize: 10.5 });
    D.flecha(s, M + 3.65, 3.62, M + 4.2, 3.62, C.rojo, 2);
    D.nodo(s, { x: M + 4.25, y: 3.1, w: 3.6, h: 1.05, titulo: "SE ACUÑA MÁS LUNA", sub: "y se vende enseguida:\nLUNA baja de precio", fill: C.superf, subSize: 10.5 });
    D.flecha(s, M + 7.9, 3.62, M + 8.45, 3.62, C.rojo, 2);
    D.nodo(s, { x: M + 8.5, y: 3.1, w: CW - 8.5, h: 1.05, titulo: "HAY QUE ACUÑAR AÚN MÁS", sub: "cada dólar pide más LUNA:\nespiral de muerte", fill: C.blanco, line: C.rojo, subSize: 10.5 });
    D.tabla(s, ["dato (Richmond Fed, 2022)", "valor"], [
      ["UST en circulación en su pico", "≈ 18 000 millones de USD, de los cuales ≈ 16 000 depositados en Anchor"],
      ["Interés que pagaba Anchor sobre UST", "≈ 19,5 % anual: la razón principal para tener UST"],
      ["Reserva desplegada por el LFG", "1 500 millones de USD, frente a 18 000 millones en circulación"],
    ], { y: 4.4, h: 1.55, colW: [4.4, 7.693], size: 11 });
    D.parrafo(s, "El arbitraje solo funciona mientras alguien quiera comprar LUNA. Cuando la confianza se va, el mecanismo acelera la caída en vez de frenarla.", { y: 6.1, h: 0.6, size: 12.5, color: C.ocre });
    s.addNotes("Fuentes verificadas: Richmond Fed, Economic Brief 22-24 (richmondfed.org, 'Why Stablecoins Fail: An Economist's Post-Mortem on Terra'), para el pico de 18 000 millones, los 16 000 en Anchor, el 19,5 % y los 1 500 millones del LFG. El mecanismo 1 UST ↔ 1 USD de LUNA está descrito igual en el comunicado del DOJ (SDNY, 11-dic-2025). 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · la caída, con fechas verificadas", titulo: "Mayo de 2022: de 1 dólar a centavos", ic: "reloj", tituloSize: 27 });
    D.tabla(s, ["fecha", "qué pasó"], [
      ["Mayo de 2021", "UST cae por debajo de 0,92. Se presentó como prueba de que el algoritmo funcionaba; según la justicia de EE. UU., lo recuperó en secreto una firma de trading comprando UST."],
      ["7-8 may 2022", "Salidas grandes de UST del pool de Curve (≈ 6 % de su capitalización): UST baja a 0,985."],
      ["9 may 2022", "LUNA cae 48 % en un día; UST toca 0,60 en Binance. El LFG anuncia 1 500 millones en defensa."],
      ["12 may 2022", "La oferta de LUNA pasa de 0,4 a 32 mil millones de tokens; LUNA vale ≈ 0,01 USD."],
      ["11 dic 2025", "Do Kwon, fundador de Terraform, condenado a 15 años de prisión en Nueva York; la fiscalía cifra las pérdidas en más de 40 000 millones."],
    ], { y: 1.9, h: 3.7, colW: [2.2, 9.893], size: 11 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La lección de diseño", x: M, y: 5.75, w: CW, h: 0.97, texto: "Un mecanismo que depende de la confianza falla justo cuando la confianza falla. No hubo un bug: el diseño hizo lo que decía.", size: 12.5 });
    s.addNotes("Fuentes verificadas el 17-sep-2026: Richmond Fed EB 22-24 (fechas 7-12 mayo, 0,985, 0,60, 48 %, oferta de 0,4 a 32 mil millones, 0,01 USD); comunicado del DOJ-SDNY del 11-dic-2025 (sentencia de 15 años; pérdidas de más de 40 000 millones; valor combinado UST+LUNA superior a 50 000 millones en su pico; apuntalamiento secreto de mayo de 2021 por una 'Trading Firm'). Buen tema para el ensayo de RA7. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · oráculos", titulo: "El contrato no puede mirar afuera", ic: "red", tituloSize: 27 });
    D.parrafo(s, "Todo nodo debe llegar al mismo resultado (S5): un contrato no puede consultar una API. El precio ETH/USD que usan préstamos y stablecoins lo publica en la cadena un ORÁCULO, y el contrato confía en él.", { y: 1.9, h: 0.95, size: 14 });
    D.codigo(s, `// Chainlink ETH/USD en Sepolia, verificado en docs.chain.link el 17-sep-2026
AggregatorV3Interface feed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
(, int256 answer, , uint256 updatedAt, ) = feed.latestRoundData();
// lectura real ese día: answer = 244571660075  → 2 445,72 USD (8 decimales)`, { x: M, y: 3.0, w: CW, h: 1.55, lang: "sol", titulo: "leer un price feed", size: 10.5 });
    D.tabla(s, ["característica del feed", "valor en Sepolia", "qué implica para quien lo consume"], [
      ["Umbral de desviación", "1 %", "Se actualiza si el precio se mueve más de 1 %…"],
      ["Heartbeat", "3 600 s", "…o al menos una vez por hora. Más viejo = rancio."],
      ["Decimales", "8", "Hay que normalizar antes de operar con tokens de 18."],
    ], { y: 4.75, h: 1.95, colW: [3.3, 2.4, 6.393], size: 11.5 });
    s.addNotes("Dirección, 1 %, 3 600 s y 8 decimales tomados de docs.chain.link (Price Feed Contract Addresses → Ethereum → Sepolia, 'More details') el 17-sep-2026. La lectura 244571660075 se hizo ese día con scripts/s14/leer-chainlink.js --network sepolia; el feed respondió 'ETH / USD' en description(). Chainlink agrega respuestas de muchos operadores de nodos; eso reduce, no elimina, la confianza. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · manipulación de oráculos", titulo: "Quien mueve el precio, mueve el contrato", ic: "bicho", tituloSize: 27 });
    D.parrafo(s, "El error más caro de DeFi: usar como oráculo el precio spot de un AMM. En el laboratorio, una sola compra de 100 000 TUSD lleva el precio del pool de 2 000 a más de 70 000 dentro de la misma transacción.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "El ataque", linea: C.rojo, color: C.rojo, items: ["Pedir capital prestado por unos segundos.", "Mover el precio del pool que usa la víctima.", "Pedir prestado contra un colateral «inflado», o liquidar a otros.", "Devolver el préstamo; el pool vuelve; la víctima queda con la deuda."] },
      { et: "Las defensas", items: ["Feeds que agregan muchas fuentes (Chainlink).", "Precios promediados en el tiempo (TWAP), no spot.", "Rechazar precios rancios o no positivos.", "Límites de variación: si salta más de X %, pausar."] },
      { y: 3.0, h: 2.45, size: 12 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Caso real · Mango Markets, octubre de 2022", x: M, y: 5.6, w: CW, h: 1.12, texto: "Un operador infló el precio del token MNGO y retiró unos 110 millones de USD. En 2025 un juez anuló sus condenas penales: ¿es «código es ley» o es fraude? Pregunta abierta para el ensayo.", size: 11.5 });
    s.addNotes("Mango Markets: exploit de octubre de 2022 por unos 110 millones; condenado por jurado en abril de 2024; el 23-may-2025 el juez Arun Subramanian anuló las condenas (fuentes: CoinDesk 24-may-2025, TRM Labs). No afirmar más detalles jurídicos. La prueba ★ 'una sola compra grande multiplica el precio spot' del laboratorio demuestra el mecanismo; OraculoConsumidor implementa la defensa de precio rancio y no positivo. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · flash loans", titulo: "Millones prestados por una transacción", ic: "cohete", tituloSize: 27 });
    D.codigo(s, `function ejecutarOperacion(uint256 monto, uint256 comision) external {   // lo llama el prestamista
    // 1. ya tengo «monto» en mi saldo, sin garantía
    // 2. hago lo que quiera: arbitrar, liquidar, … o atacar
    // 3. devuelvo monto + comisión antes de terminar
}
// el prestamista, al final: if (saldo < antes + comision) revert  → como si nada hubiera pasado`, { x: M, y: 1.9, w: CW, h: 1.75, lang: "sol", titulo: "la idea (esquema, no la interfaz exacta de un protocolo)", size: 10.5 });
    D.tabla(s, ["caso verificado", "fecha", "qué hizo el flash loan"], [
      ["Beanstalk", "17 abr 2022", "≈ 1 000 millones prestados para comprar votos por una transacción y aprobar una propuesta que vació 182 millones."],
      ["Euler Finance", "13 mar 2023", "Capital prestado para explotar una comprobación de liquidez faltante: ≈ 197 millones."],
    ], { y: 3.8, h: 1.55, colW: [2.2, 1.8, 8.093], size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.5, w: CW, h: 1.22, texto: "«El flash loan fue el ataque». No: es el amplificador. Convierte un fallo pequeño en una pérdida enorme sin que el atacante sea rico. La defensa es no tener el fallo.", size: 12 });
    s.addNotes("Fuentes: CoinDesk 17-abr-2022 (Beanstalk, 182 millones; préstamo de ~1 000 millones desde Aave según Merkle Science/Halborn) y Chainalysis (Euler, 13-mar-2023, ~196-197 millones según la fuente). Posible por la atomicidad de la S5: o todo, o nada. El vínculo con la S15: el ataque a Beanstalk fue a la GOBERNANZA. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · de dónde sale el rendimiento", titulo: "La pregunta que desinfla el humo", ic: "lupa", tituloSize: 27 });
    D.parrafo(s, "Ante cualquier «rendimiento del X %», la pregunta profesional no es cuánto, sino quién lo paga. Si no hay respuesta clara, suele ser «los próximos que entren».", { y: 1.9, h: 0.65, size: 14.5 });
    D.tabla(s, ["fuente del rendimiento", "quién paga", "¿sostenible?"], [
      ["Comisiones de un AMM", "Quien intercambia (0,30 % en el ejemplo).", "Sí, mientras haya volumen; menos la pérdida impermanente."],
      ["Intereses de préstamos", "Quien pide prestado.", "Sí, mientras haya demanda de crédito."],
      ["Emisión del token propio", "Nadie: se diluye a los demás tenedores.", "Solo mientras el token valga."],
      ["Subsidio del protocolo", "Una reserva que se agota (Anchor: ≈ 19,5 % sobre UST).", "No: termina cuando se acaba la reserva."],
    ], { y: 2.75, h: 2.5, colW: [3.3, 4.4, 4.393], size: 11.5 });
    D.enunciado(s, "Un ingeniero no pregunta «¿cuánto rinde?». Pregunta «¿quién lo paga, y qué pasa cuando deje de pagarlo?».", { y: 5.45, h: 1.25, size: 16, line: C.naranja });
    s.addNotes("El caso Anchor cierra el círculo con A.12: el 19,5 % era la razón para tener UST, y ese rendimiento lo sostenían subsidios. Recordar: esto no es asesoría financiera; es análisis de mecanismos. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · el mapa de riesgos", titulo: "Cuatro riesgos que ningún rendimiento cubre", ic: "escudo", tituloSize: 27 });
    D.tabla(s, ["riesgo", "qué es", "ejemplo de hoy"], [
      ["De contrato", "Un error en el código custodia el dinero directamente.", "Euler: una comprobación faltante (A.16)."],
      ["De oráculo", "El contrato cree un precio falso o viejo.", "Precio spot manipulable; feed rancio (A.14, A.15)."],
      ["De gobernanza", "Quien vota puede cambiar las reglas o vaciar la tesorería.", "Beanstalk: votos comprados con un flash loan."],
      ["Regulatorio y de emisor", "Un emisor congela fondos o un regulador prohíbe un servicio.", "Stablecoins respaldadas en dinero (A.11); marco colombiano en la S16."],
    ], { y: 1.9, h: 3.3, colW: [2.7, 4.8, 4.593], size: 11.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Regla del curso", x: M, y: 5.4, w: CW, h: 1.32, texto: "Nada de esto se prueba con dinero real. Todo el laboratorio corre en la red local o en Sepolia. Y ninguna lámina de hoy es una recomendación de inversión: es el mapa de por qué estas cosas fallan.", size: 12.5 });
    s.addNotes("Esta tabla es la base de la pregunta de riesgo del bloque C. La S16 retoma el riesgo regulatorio colombiano. 2 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.19 · lo que hay que llevarse del bloque A", titulo: "Seis ideas sobre DeFi", ic: "lista", tituloSize: 28 });
    ideas(s, [
      "Un AMM pone precio con x · y = k; 2 000 USDC compran 0,9066 ETH, no 1: comisión más impacto.",
      "El LP paga la pérdida impermanente: 5,72 % si el precio se duplica o se reduce a la mitad.",
      "Los préstamos son sobrecolateralizados; con factor de salud < 1, cualquiera liquida, sin aviso.",
      "Una stablecoin es un pasivo: fiat, cripto o algorítmica. UST mostró que la confianza no es colateral.",
      "Un oráculo manipulable rompe todo lo que depende de él; el flash loan amplifica el fallo.",
      "Ante un rendimiento alto: quién lo paga y qué pasa cuando deje de pagarlo.",
    ]);
    s.addNotes("Repaso de 2 minutos. Luego la pregunta de verificación y pausa.");
  }

  await verificacion({
    kicker: "A.20 · cierre del bloque A",
    pregunta: "Un protocolo presta USDC contra ETH y lee el precio del ETH del pool de la lámina A.4. ¿Cómo lo ataca alguien sin capital propio, y qué dos cambios lo protegen?",
    pistas: [
      "Qué le pasa al precio spot del pool con una compra de 10 000 USDC (A.5).",
      "De dónde saca el atacante esos 10 000 por unos segundos (A.16).",
      "Qué hace OraculoConsumidor que un precio spot no hace (A.14).",
    ],
    notas: "Respuesta esperada: flash loan de USDC → compra ETH en el pool y sube el spot (con 10 000 USDC el precio pasa de 2 000 a 4 495,50) → deposita ETH como colateral valorado al precio inflado y pide prestados más USDC de lo que vale → devuelve el flash loan; el protocolo queda con deuda sin cubrir. Defensas: usar un feed agregado (Chainlink) o un TWAP en vez del spot, y límites de variación/antigüedad. El 4 495,50 sale de scripts/s14/pool-en-numeros.js (nuevo spot tras 10 000 TUSD). Luego pausa de 10 minutos.",
  });

  /* ================================================================ B */
  {
    const s = await D.divisor({ letra: "B", titulo: "Laboratorio 14", sub: "Un AMM x·y=k que ustedes completan y miden, el price feed real de Chainlink en Sepolia, y la pérdida impermanente en una hoja de cálculo que se autocomprueba.", minutos: "APROXIMADAMENTE 65 MINUTOS · EN PAREJAS", ic: "martillo" });
    s.addNotes("Guía en PDF: laboratorios-evm/guias/s14-defi-oraculos-amm.pdf. Tres partes: AMM (30 min), oráculo (20), hoja (15). Punto de control a los 30 minutos: 15 pruebas del pool en verde.");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · qué van a hacer y por qué así", titulo: "Un DEX propio en vez de uno ajeno", ic: "martillo", tituloSize: 27 });
    D.tabla(s, ["parte", "qué hacen", "archivos"], [
      ["1 · Mini-AMM", "Completan cotizar, intercambiar y quitarLiquidez; miden slippage y pérdida impermanente en cadena.", "andamiaje/s14/PoolXYK.sol · test/s14/PoolXYK.test.js"],
      ["2 · Oráculo", "Completan las defensas del consumidor y lo despliegan en Sepolia contra el feed real de Chainlink.", "andamiaje/s14/OraculoConsumidor.sol · scripts/s14/leer-chainlink.js"],
      ["3 · Hoja de cálculo", "Tres escenarios de precio con fórmulas; la plantilla dice si coinciden.", "guias/s14-plantilla-perdida-impermanente.xlsx"],
    ], { y: 1.9, h: 2.6, colW: [2.3, 5.4, 4.393], size: 11 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Por qué no Uniswap en Sepolia (decisión verificada)", x: M, y: 4.7, w: CW, h: 2.02, texto: "La interfaz de Uniswap sí admite Sepolia en «modo testnet», pero los pools de prueba tienen poca liquidez y precios sin relación con el mercado, y cada paso exige tokens y ETH de prueba. Medir slippage así mide el caos del pool, no el mecanismo. Por eso el laboratorio usa un pool propio cuyo código leen y prueban. Quien quiera, puede repetir la parte 1 en Uniswap (Sepolia) como extensión opcional.", size: 12 });
    s.addNotes("Verificado el 17-sep-2026: support.uniswap.org ('Testnets on Uniswap') lista Sepolia y Unichain como testnets soportadas en la interfaz; se activa en Configuración → modo testnet. ⚠ VERIFICAR ANTES DE DICTAR si se va a hacer la extensión en Uniswap: probar el flujo completo con la billetera del curso (el docente no pudo probarlo sin firmar). 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · parte 1 · pasos 1 y 2", titulo: "El pool en rojo, y los tres TODO", ic: "terminal", tituloSize: 28 });
    D.codigo(s, `copy andamiaje\\s14\\PoolXYK.sol contracts\\s14\\          (macOS/Linux: cp andamiaje/s14/PoolXYK.sol contracts/s14/)
npx hardhat test test/s14/PoolXYK.test.js      #  3 passing · 12 failing  al empezar
                                               # 15 passing               al terminar`, { x: M, y: 1.9, w: CW, h: 1.35, lang: "js", titulo: "en laboratorios-evm", size: 10.5 });
    D.codigo(s, `// TODO 1 · cotizar
uint256 entradaNeta = montoEntrada * (BPS - COMISION_BPS);            // × 9 970
return (rSalida * entradaNeta) / (rEntrada * BPS + entradaNeta);       // multiplicar antes de dividir
// TODO 2 · intercambiar: checks → effects → interactions
salida = cotizar(tokenEntrada, montoEntrada);
if (salida < minimoSalida) revert SlippageExcedido(minimoSalida, salida);
/* actualizar reservas */  safeTransferFrom(entrada) ;  safeTransfer(salida) ;  emit Intercambio(...)
// TODO 3 · quitarLiquidez: montoX = participaciones * reservaX / totalSupply()  → _burn → transferir`, { x: M, y: 3.45, w: CW, h: 2.45, lang: "sol", titulo: "lo esencial de la solución (se proyecta tras el punto de control)", size: 10.5 });
    D.parrafo(s, "Comprobación a mano del TODO 1: con el pool de A.4, 2 000 TUSD deben dar exactamente 906 610 893 880 149 131 unidades (0,9066 TETH).", { y: 6.05, h: 0.65, size: 12.5, color: C.ocre });
    s.addNotes("Conteo verificado con el andamiaje intacto: 3 pruebas pasan (las de agregar liquidez, que ya viene hecha) y 12 fallan. No proyectar el segundo bloque de código hasta el minuto 20. El orden CEI de intercambiar es el de la S9: las reservas se actualizan antes de mover tokens. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · parte 1 · paso 3", titulo: "Medir: slippage y pérdida en cadena", ic: "grafico", tituloSize: 28 });
    D.codigo(s, `npx hardhat run scripts/s14/pool-en-numeros.js

  TUSD que entran   TETH que salen   precio promedio   peor que el spot
           100         0,049603          2.016,02            0,80 %
         2.000         0,906611          2.206,02           10,30 %
        10.000         3,326660          3.006,02           50,30 %
  recibió 0,906611 TETH (mínimo aceptado 0,897545) · gas 69751
  después de comprar     TETH  9,0934 · TUSD 22.000,00 · k 200.054,56 · precio 2.419,34
  el arbitrajista mete 20 000 TUSD; nuevo precio 7.988,00 (r = 3,9940)
  pérdida impermanente medida 19,90 %  ·  fórmula 2√r/(1+r) 19,96 %`, { x: M, y: 1.9, w: CW, h: 2.65, lang: "js", titulo: "salida real (red local)", size: 10.5 });
    D.dosColumnas(s,
      { et: "Cómo saber que funcionó", items: ["Los números coinciden con las láminas A.4, A.5 y A.8.", "La pérdida medida queda ≈ 0,06 puntos por debajo de la fórmula."] },
      { et: "Qué deben explicar", items: ["Por qué k subió de 200 000 a 200 054,56.", "Por qué la pérdida medida es MENOR que la de la fórmula."] },
      { y: 4.75, h: 1.97, size: 11.5 });
    s.addNotes("Salida tomada de una corrida real. Respuestas: k sube porque el 0,30 % de comisión se queda en las reservas; la pérdida medida es menor porque la comisión que pagó el arbitrajista quedó para el LP. El gas de intercambiar (69 751) es de esa corrida y puede variar levemente. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · parte 2", titulo: "El oráculo: defensas y Sepolia", ic: "red", tituloSize: 29 });
    D.codigo(s, `copy andamiaje\\s14\\OraculoConsumidor.sol contracts\\s14\\     # TODO 1-3: positivo, rancio, 18 decimales
npx hardhat test test/s14/Oraculo.test.js                     # 0 → 6 passing
npx hardhat ignition deploy ignition/modules/s14-OraculoConsumidor.js --network sepolia --verify
$env:CONSUMIDOR="0x…"; npx hardhat run scripts/s14/leer-chainlink.js --network sepolia`, { x: M, y: 1.9, w: CW, h: 1.75, lang: "js", titulo: "comandos", size: 10.5 });
    D.codigo(s, `  Red: Sepolia · feed real de Chainlink 0x694AA1769357215DE4FAC081bf1f309aDC325306
  roundId       : 18446744073709587749
  answer (crudo): 244571660075 (8 decimales)
  precio ETH/USD: 2445.71660075
  actualizado   : 2026-09-18T00:04:00.000Z · hace 2952 s
  ¿rancio?      : no (heartbeat 3600 s)`, { x: M, y: 3.8, w: CW, h: 1.75, lang: "js", titulo: "salida real, 17-sep-2026 (hora UTC)", size: 10.5 });
    D.parrafo(s, "Con CONSUMIDOR definido, el script además llama precioEth(7200) de SU contrato: debe dar el mismo precio con 18 decimales. El despliegue verificado es la evidencia en cadena del laboratorio.", { y: 5.7, h: 0.95, size: 12.5, color: C.ocre });
    s.addNotes("Lectura real con el script el 17-sep-2026 por la tarde (hora de Colombia; la marca es UTC). El roundId es enorme porque codifica la fase del agregador en los bits altos: no es un contador simple. El margen de 7 200 s (dos heartbeats) evita rechazar un precio sano por segundos. Si Sepolia no tiene ETH, el docente distribuye. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · parte 3", titulo: "La hoja de cálculo que se autocomprueba", ic: "rejilla", tituloSize: 27 });
    D.pasos(s, [
      ["ABRIR", "guias/s14-plantilla-perdida-impermanente.xlsx en Excel, LibreOffice o Google Sheets."],
      ["FÓRMULAS", "Llenar las celdas amarillas con FÓRMULAS: r, ETH y USDC en el pool, valores y pérdida."],
      ["COMPROBAR", "La columna I dice «✔ coincide» si su fila iguala los valores esperados (A, B y C)."],
      ["ESCENARIO PROPIO", "Fila D: un precio final elegido por ustedes; se contrasta con 1 − 2√r ÷ (1 + r)."],
      ["RESPONDER", "¿Por qué A y B dan igual? ¿Qué comisión anual compensaría el escenario C?"],
    ], { y: 1.9, alto: 0.74, gap: 0.09, anchoEt: 2.6, size: 12 });
    D.parrafo(s, "La plantilla también existe en CSV con los valores esperados. Los números son los de la lámina A.7: si su hoja da otra cosa, la hoja está mal, no la lámina.", { y: 6.1, h: 0.6, size: 12.5, color: C.ocre });
    s.addNotes("Plantilla generada con scripts/s14/generar-plantilla-pi.py (openpyxl); se verificó recalculando en LibreOffice que la versión resuelta marca ✔ en las cuatro filas. La versión resuelta está en evaluaciones/lab-s14 (repositorio privado). 3 minutos de explicación; 15 de trabajo.");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · errores frecuentes", titulo: "Lo que suele fallar en este laboratorio", ic: "bicho", tituloSize: 27 });
    D.tabla(s, ["síntoma", "causa y solución"], [
      ["cotizar da 0 o un número absurdo", "Dividieron antes de multiplicar, u olvidaron multiplicar la reserva de entrada por 10 000."],
      ["k baja después de un intercambio", "Descontaron la comisión de la salida y no de la entrada, o sumaron la entrada neta a la reserva."],
      ["ERC20InsufficientAllowance", "El usuario no aprobó al pool. En las pruebas ya está hecho; en un script propio, approve primero."],
      ["PrecioViejo en Sepolia", "maxAntiguedad menor que el heartbeat (3 600 s). Usen 7 200."],
      ["precioEth devuelve 10^10 veces más", "Normalizaron con 10^18 en vez de 10^(18 − decimales)."],
      ["La hoja marca ✘ con valores «iguales»", "Escribieron números redondeados en vez de fórmulas."],
    ], { y: 1.9, h: 4.2, colW: [4.0, 8.093], size: 11.5 });
    D.parrafo(s, "La guía PDF amplía cada fila con el comando para diagnosticarlo.", { y: 6.25, h: 0.45, size: 12.5, color: C.ocre });
    s.addNotes("Circular preguntando en qué parte está cada pareja. Si varias parejas caen en la misma fila, explicarla en voz alta a todo el grupo.");
  }

  {
    const s = await D.lamina({ kicker: "B.7 · qué se entrega", titulo: "Evidencia del laboratorio 14", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["Mini-AMM", "15 pruebas verdes con su código + salida de pool-en-numeros.js + las dos explicaciones de B.3.", "35 %"],
      ["Oráculo en Sepolia", "6 pruebas verdes + contrato verificado en Sepolia + salida de leer-chainlink.js con CONSUMIDOR.", "30 %"],
      ["Hoja de cálculo", "Las cuatro filas con ✔ (con fórmulas) + las dos respuestas de B.5.", "20 %"],
      ["Análisis", "Un párrafo: un ataque real de hoy (oráculo o flash loan), qué falló y qué defensa del laboratorio lo habría evitado.", "15 %"],
    ], { y: 1.9, h: 3.2, colW: [2.6, 8.093, 1.4], size: 11.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Recordatorio", x: M, y: 5.3, w: CW, h: 1.42, texto: "Solo red local y Sepolia. La dirección de un contrato puede ir en una variable de entorno; la clave privada y la URL del RPC, solo en el keystore. Ninguna captura de la entrega puede mostrar una clave.", size: 12.5 });
    s.addNotes("Esta evidencia es parte de 'Laboratorios S14-S16' (4 % de la nota final, plan sección 9). La política del curso exige evidencia en cadena: aquí es el despliegue verificado del OraculoConsumidor.");
  }

  await verificacion({
    kicker: "B.8 · cierre del bloque B",
    pregunta: "Su pool mide 19,90 % de pérdida impermanente y la fórmula dice 19,96 %. Un compañero dice que su contrato «tiene un error de redondeo». ¿Tiene razón?",
    pistas: [
      "Qué le cobró el pool al arbitrajista al llevar el precio a 7 988.",
      "A quién se le quedó ese cobro.",
      "Qué pasaría con la diferencia si la comisión fuera 0 %.",
    ],
    notas: "No tiene razón. La diferencia no es redondeo: es la comisión del 0,30 % que pagó el arbitrajista (sobre 20 000 TUSD) y que quedó en las reservas, a favor del LP. Con comisión 0 %, la medida coincidiría con la fórmula salvo por el redondeo entero de Solidity, que es del orden de 10^-18.",
  });

  /* ================================================================ C */
  {
    const s = await D.divisor({ letra: "C", titulo: "El proyecto frente a DeFi", sub: "Casi ningún proyecto del curso es DeFi puro, pero muchos rozan una primitiva: un precio, un token, un pago. Reconocer el riesgo que se asume es parte de hacerlo bien.", minutos: "APROXIMADAMENTE 20 MINUTOS · EN EQUIPOS", ic: "bandera" });
    s.addNotes("Trabajo en equipos de proyecto. Producto: una tabla de riesgos de cuatro filas que va a docs/SEGURIDAD.md y se revisa en el Avance 2 (S16).");
  }

  {
    const s = await D.lamina({ kicker: "C.1 · ¿toca su proyecto a DeFi?", titulo: "Cuatro preguntas de riesgo", ic: "escudo", tituloSize: 28 });
    D.lista(s, [
      "¿Su contrato lee algún precio o dato externo? ¿De qué oráculo, con qué antigüedad máxima, y qué pasa si miente o se cae?",
      "¿Custodia fondos que alguien querría drenar con capital prestado por una transacción? ¿Qué invariante lo impide?",
      "¿Depende de que un token o una stablecoin mantenga su valor? ¿Quién es su emisor y qué pasa si congela o cae?",
      "¿Alguna decisión se toma con un balance o un voto que se pueda inflar dentro de la misma transacción?",
    ], { y: 1.9, h: 3.2, size: 13.5, gap: 10, numerada: true });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Para docs/SEGURIDAD.md", x: M, y: 5.3, w: CW, h: 1.42, texto: "Una fila por pregunta: riesgo, probabilidad, impacto y mitigación. «No aplica, porque…» es una respuesta válida y buena, si el porqué es correcto. La rúbrica final pregunta justo esto en el criterio de seguridad.", size: 12.5 });
    s.addNotes("Circular por los equipos. Ejemplos de 'no aplica' correcto: un registro de certificados que no maneja valor ni lee precios. Ejemplo de riesgo real: un marketplace de boletas que acepta una stablecoin (riesgo de emisor y de congelamiento).");
  }

  await verificacion({
    kicker: "C.2 · cierre del bloque C",
    pregunta: "Un equipo vende boletas en su contrato a precio fijo en USD y cobra en ETH, leyendo el precio de Chainlink. ¿Qué comprobación del laboratorio de hoy no puede faltar, y por qué?",
    pistas: [
      "Qué pasa si el feed deja de actualizarse durante una caída.",
      "Qué dos errores personalizados tiene OraculoConsumidor.",
      "Qué antigüedad máxima es razonable para el feed de Sepolia.",
    ],
    notas: "La comprobación de antigüedad (PrecioViejo) y de precio positivo (PrecioInvalido): si el feed queda rancio en una caída, el contrato vendería boletas a un precio de ETH viejo y más alto, cobrando de menos. Antigüedad razonable: algo mayor que el heartbeat de 3 600 s (por ejemplo 7 200 s), nunca 'sin límite'.",
  });

  await D.preguntaSemana({
    pregunta: "UST prometía 19,5 % y un dólar estable. Con lo de hoy, ¿qué pregunta hubieran hecho ANTES de mayo de 2022 para no creerle?",
    trabajo: [
      "Entregar la evidencia del laboratorio 14 (pool, oráculo en Sepolia, hoja y análisis).",
      "Agregar la tabla de riesgos DeFi del proyecto a docs/SEGURIDAD.md.",
      "Leer para la Sesión 15: DAOs, Governor y timelock. El ataque a Beanstalk vuelve allí.",
      "Pensar el tema del ensayo individual (RA7): se plantea formalmente en la Sesión 15.",
    ],
    notas: "Respuesta esperada: ¿quién paga el 19,5 %? (subsidios de una reserva que se agota) y ¿qué respalda el dólar? (solo la disposición a comprar LUNA). Ambas desinflan la promesa sin necesidad de predecir la fecha de la caída. Retomar en la apertura de la S15.",
  });

  {
    const s = await D.cierre({
      frase: "En DeFi, el que pregunta de dónde sale el rendimiento entiende más que el que pregunta cuánto rinde.",
      sub: "Vieron las primitivas con números propios y, sobre todo, cómo fallan. La próxima sesión: quién manda en estos sistemas cuando no hay dueño.",
      proxima: "Sesión 15 · DAOs, gobernanza e identidad descentralizada",
    });
    s.addNotes("Cerrar con la advertencia: nada de lo visto hoy es recomendación de inversión. Recordar entregar el laboratorio y traer el keystore funcionando a la S15 (se despliega un Governor).");
  }

  return D.guardar(path.join(__dirname, "Sesion-14-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
