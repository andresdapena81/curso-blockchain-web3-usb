/* =====================================================================
   Sesión 14 · DeFi: finanzas descentralizadas
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 14 · DEFI · FINANZAS DESCENTRALIZADAS", titulo: "Sesión 14 · DeFi" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 14 · UNIDAD IV · ECOSISTEMA",
    titulo: "DEFI: DINERO\nLEGO, Y SUS\nGRIETAS",
    sub: "Contratos que se componen para hacer banca sin banco. Poderoso, y lleno de riesgos que hay que saber nombrar.",
    palabra: "COMPONER",
    ic: "moneda",
    notas: "Abre la Unidad IV. Objetivo: entender las primitivas y sobre todo sus RIESGOS técnicos, no invitar a especular.",
  });

  await D.agenda({
    intro: "Las primitivas financieras on-chain y, con igual peso, cómo fallan. No es una sesión para aprender a invertir: es para entender el mecanismo y el riesgo.",
    bloques: [
      ["A", "PRIMITIVAS Y RIESGOS", "AMM, pérdida impermanente, préstamos, stablecoins, oráculos y flash loans.", "~70 min"],
      ["B", "LABORATORIO 14", "Pérdida impermanente en números y un consumidor de oráculo, con su manipulación.", "~80 min"],
      ["C", "PROYECTO", "¿Toca su proyecto alguna primitiva DeFi? Riesgos que asume.", "~30 min"],
    ],
  });

  await D.objetivo({
    objetivo: "Comprender las primitivas financieras on-chain y sus riesgos técnicos, como quien las evalúa, no quien especula.",
    preguntas: [
      "¿Cómo pone precio un AMM sin libro de órdenes ni intermediario?",
      "¿Qué es la pérdida impermanente y por qué es simétrica?",
      "¿Por qué los préstamos DeFi exigen más garantía que el préstamo?",
      "¿Por qué los oráculos y los flash loans concentran tantos ataques?",
    ],
    ra: "RA2 · arquitecturas  ·  RA5 · riesgos y seguridad  ·  RA7 · implicaciones económicas.",
  });

  await D.glosario({
    items: [
      ["DeFi", "Decentralized Finance", "Servicios financieros —cambiar, prestar, ahorrar— hechos con contratos, sin banco ni intermediario."],
      ["AMM", "Automated Market Maker", "Un contrato que pone precio con una fórmula y un pool de fondos, en vez de emparejar órdenes."],
      ["Pool de liquidez", "liquidity pool", "El depósito de dos activos que un AMM usa para permitir intercambios."],
      ["Slippage", "deslizamiento", "La diferencia entre el precio esperado y el que sale, por el tamaño de la operación."],
      ["Pérdida impermanente", "impermanent loss", "Lo que pierde un proveedor de liquidez frente a solo conservar los activos, cuando el precio cambia."],
      ["Sobrecolateral", "over-collateralization", "Dejar en garantía MÁS valor del que se pide prestado. La norma en DeFi."],
      ["Stablecoin", "moneda estable", "Token que busca valer siempre lo mismo (p. ej. 1 USD). Colateralizada o algorítmica."],
      ["Flash loan", "préstamo relámpago", "Préstamo sin garantía que se pide y devuelve en la MISMA transacción, o no ocurre."],
    ],
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "Primitivas y riesgos", sub: "DeFi es un puñado de piezas que se combinan sin permiso. Esa composabilidad es su fuerza y, cuando algo falla, su forma de propagar el daño.", minutos: "APROXIMADAMENTE 70 MINUTOS", ic: "moneda" });

  {
    const s = await D.lamina({ kicker: "A.1 · qué es DeFi", titulo: "Banca sin banco, y dinero lego", ic: "capas", tituloSize: 28 });
    D.parrafo(s, "DeFi replica servicios financieros —cambiar divisas, prestar, ganar interés— con contratos abiertos, sin una entidad que apruebe, custodie o pueda excluir a nadie.", { y: 1.9, h: 0.9, size: 14.5 });
    D.enunciado(s, "«Dinero lego»: como los contratos son públicos y se pueden llamar entre sí, cada uno es una pieza que otro encaja sin pedir permiso.", { y: 3.0, h: 1.25, size: 18 });
    D.dosColumnas(s,
      { et: "Lo que promete", items: ["Acceso sin permiso: solo hace falta una billetera.", "Transparencia: las reglas están en el código público.", "Composabilidad: se construye sobre lo que ya existe."] },
      { et: "Lo que trae consigo", linea: C.rojo, color: C.rojo, items: ["Sin banco no hay a quién reclamar si algo sale mal.", "Un fallo en una pieza contamina a todas las que la usan.", "El código con errores custodia el dinero directamente (Sesión 9)."] },
      { y: 4.5, h: 2.2, size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.2 · el AMM", titulo: "Poner precio con una fórmula, no con un libro", ic: "grafico", tituloSize: 26 });
    D.parrafo(s, "Una bolsa tradicional empareja compradores y vendedores en un libro de órdenes. Un AMM no: tiene un pool de dos activos y una fórmula que fija el precio según cuánto hay de cada uno.", { y: 1.9, h: 0.95, size: 14 });
    D.definicion(s, "x · y = k     el producto de las dos reservas se mantiene constante en cada intercambio", { x: M, y: 3.0, w: CW, h: 0.65, size: 13 });
    D.parrafo(s, "Ejemplo: un pool con 10 ETH y 20 000 USDC (k = 200 000). Si alguien compra ETH, saca ETH y mete USDC; como x baja e y sube, el ETH que queda se encarece. El precio sale del balance del pool, sin que nadie lo fije.", { y: 3.75, h: 1.0, size: 13.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Slippage: por qué las órdenes grandes salen caras", x: M, y: 4.95, w: CW, h: 1.75, texto: "Cuanto más grande la compra respecto al pool, más se mueve el balance y peor el precio promedio. Comprar 1 ETH de un pool enorme casi no mueve el precio; comprar la mitad del pool lo dispara. Por eso las interfaces piden una «tolerancia de slippage»: el máximo peor precio que aceptas.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.3 · el costo de proveer liquidez", titulo: "Pérdida impermanente", ic: "balanza", tituloSize: 29 });
    D.parrafo(s, "Quien pone los fondos en el pool (proveedor de liquidez) gana comisiones, pero corre un riesgo propio: si el precio se mueve, al retirar tendrá menos valor que si solo hubiera conservado los dos activos.", { y: 1.9, h: 0.95, size: 14 });
    D.tabla(s, ["cambio de precio", "pérdida vs. conservar"], [
      ["Sin cambio", "0 %"],
      ["+25 %", "0,62 %"],
      ["Se duplica (×2)", "5,72 %"],
      ["Se triplica (×3)", "13,40 %"],
      ["Cae a la mitad (÷2)", "5,72 %  ← igual que ×2: es simétrica"],
      ["×5", "25,46 %"],
    ], { y: 3.0, h: 2.75, colW: [4.0, 8.093], size: 11.5 });
    D.parrafo(s, "Cifras del laboratorio de hoy. «Impermanente» porque desaparece si el precio vuelve al inicio — y se vuelve permanente al retirar.", { y: 5.95, h: 0.55, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.4 · préstamos", titulo: "Prestar sin conocer a nadie: sobrecolateral", ic: "escudo", tituloSize: 26 });
    D.parrafo(s, "Un banco presta según tu historial. Un contrato no te conoce ni puede embargarte. ¿Cómo presta entonces sin arriesgarse? Exigiendo MÁS garantía de la que presta.", { y: 1.9, h: 0.9, size: 14.5 });
    D.pasos(s, [
      ["DEPOSITAR GARANTÍA", "Dejas 150 USD en ETH para pedir 100 USDC. El préstamo vale menos que la garantía."],
      ["FACTOR DE SALUD", "Un número que mide qué tan cubierto está el préstamo. Si baja de 1, estás en riesgo."],
      ["SI LA GARANTÍA CAE", "Si el ETH baja y la garantía ya no cubre, cualquiera puede LIQUIDARte: vende tu garantía para pagar la deuda."],
      ["LA LIQUIDACIÓN ES AUTOMÁTICA", "No hay negociación ni aviso: el contrato ejecuta la regla. Aave y Compound funcionan así."],
    ], { y: 3.0, alto: 0.82, gap: 0.12, anchoEt: 3.2, size: 12.5 });
    D.parrafo(s, "¿Para qué pedir prestado menos de lo que dejas? Para no vender: mantener tu ETH y aun así tener liquidez, o apalancarte.", { y: 6.2, h: 0.5, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.5 · stablecoins", titulo: "Monedas que buscan no moverse", ic: "moneda", tituloSize: 28 });
    D.tabla(s, ["tipo", "cómo mantiene el valor", "el riesgo"], [
      ["Colateralizada en fiat", "Una empresa guarda 1 USD real por cada token. USDC, USDT.", "Hay que confiar en que la empresa de verdad tenga el respaldo. Es centralizado."],
      ["Colateralizada en cripto", "Sobrecolateral en ETH u otros, gestionado por contrato. DAI.", "Si el colateral se desploma rápido, el sistema puede quedar corto."],
      ["Algorítmica", "Un algoritmo emite y quema para sostener el precio, sin respaldo real.", "Frágil. UST/Terra colapsó en 2022: perdió el valor y arrastró miles de millones."],
    ], { y: 1.9, h: 3.1, colW: [3.0, 5.0, 4.093], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El caso Terra/UST, 2022", x: M, y: 5.2, w: CW, h: 1.5, texto: "UST era algorítmica: sostenía su valor solo con incentivos, sin reservas. Cuando la confianza se rompió, el mecanismo aceleró la caída en vez de frenarla (una espiral de muerte). Desaparecieron decenas de miles de millones en días. Un diseño elegante en el papel y catastrófico en la práctica.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.6 · oráculos", titulo: "El talón de Aquiles: traer datos de afuera", ic: "red", tituloSize: 26 });
    D.parrafo(s, "Casi todo DeFi necesita saber un precio. Pero un contrato no puede consultar internet (Sesión 5). Depende de un oráculo, y ahí está una de las mayores superficies de ataque.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "El error frecuente", linea: C.rojo, color: C.rojo, texto: "Leer el precio «spot» de un solo AMM. Un atacante lo mueve con un flash loan dentro de la misma transacción, engaña al contrato que lo lee, y se aprovecha del precio falso. Ha pasado muchas veces." },
      { et: "Cómo se hace bien", texto: "Oráculos que agregan muchas fuentes (Chainlink), precios promediados en el tiempo (TWAP), y comprobar que el precio no sea rancio ni cero. El laboratorio de hoy programa esas comprobaciones." },
      { y: 3.0, h: 2.4, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Lo que se ve en el laboratorio", x: M, y: 5.55, w: CW, h: 1.15, texto: "Un consumidor de oráculo que rechaza precios rancios y no positivos — y una demostración de que quien controla el oráculo controla el precio que el contrato «cree». Verificado en test/s14.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.7 · flash loans", titulo: "Préstamos que existen por una transacción", ic: "bicho", tituloSize: 27 });
    D.parrafo(s, "Un flash loan presta millones sin garantía, con una única condición: se devuelve en la MISMA transacción. Si no se devuelve, toda la transacción se revierte, como si nunca hubiera pasado.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "Por qué es posible", texto: "La atomicidad de la transacción: o se cumple todo, o no se cumple nada (Sesión 5). El contrato presta confiando en que, si no le devuelven, revierte y recupera su dinero automáticamente." },
      { et: "Por qué es peligroso", linea: C.rojo, color: C.rojo, texto: "Democratiza el capital para atacar: cualquiera puede mover millones por unos segundos. No es el ataque en sí — es el amplificador. Manipular un oráculo, forzar una liquidación, explotar una lógica: todo se vuelve viable sin ser rico." },
      { y: 3.0, h: 2.55, size: 12.5 });
    D.parrafo(s, "Un flash loan no roba nada por sí mismo. Convierte un fallo de diseño pequeño en una pérdida enorme. La defensa no es prohibirlos: es no tener el fallo.", { y: 5.65, h: 0.65, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.8 · de dónde sale el rendimiento", titulo: "La pregunta que desinfla el humo", ic: "lupa", tituloSize: 27 });
    D.parrafo(s, "Muchas plataformas prometen rendimientos altísimos. La pregunta profesional siempre es la misma: ¿de dónde sale ese dinero? Si no hay una respuesta clara, la respuesta suele ser «de los próximos que entren».", { y: 1.9, h: 0.95, size: 14.5 });
    D.tabla(s, ["fuente del rendimiento", "¿sostenible?"], [
      ["Comisiones reales de intercambios o préstamos", "Sí: alguien paga por un servicio que usa."],
      ["Incentivos en el token propio de la plataforma", "A veces: sostenible solo mientras el token valga; se diluye."],
      ["El capital de los nuevos participantes", "No: es un esquema piramidal con otro nombre."],
    ], { y: 3.0, h: 2.2, colW: [6.5, 5.593], size: 12 });
    D.enunciado(s, "Un ingeniero no pregunta «¿cuánto rinde?». Pregunta «¿quién paga ese rendimiento, y qué pasa cuando deje de pagarlo?».", { y: 5.4, h: 1.3, size: 16, line: C.naranja });
  }

  {
    const s = await D.lamina({ kicker: "A.9 · lo que hay que llevarse del bloque A", titulo: "Seis ideas sobre DeFi", ic: "lista", tituloSize: 28 });
    const ideas = [
      "DeFi es dinero lego: contratos que se componen sin permiso, y propagan fallos igual de fácil.",
      "Un AMM pone precio con x·y=k; las órdenes grandes sufren slippage.",
      "Proveer liquidez tiene un costo propio y simétrico: la pérdida impermanente.",
      "Los préstamos DeFi son sobrecolateralizados y se liquidan solos, sin aviso.",
      "Los oráculos y los flash loans concentran los ataques: el flash loan amplifica, no roba.",
      "Ante un rendimiento alto, preguntar quién lo paga y qué pasa cuando pare.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Laboratorio 14", sub: "La pérdida impermanente en números propios, y un consumidor de oráculo que se defiende de un precio rancio y demuestra la manipulación.", minutos: "APROXIMADAMENTE 80 MINUTOS · EN PAREJAS", ic: "martillo" });

  {
    const s = await D.lamina({ kicker: "B.1 · pérdida impermanente", titulo: "Ver la simetría con sus números", ic: "grafico", tituloSize: 28 });
    D.codigo(s, `node scripts/s14/perdida-impermanente.js

  El precio se duplica (r = 2)          5.72 %
  El precio cae a la mitad (r = 0.5)    5.72 %   ← igual
  El precio se multiplica por 5 (r = 5) 25.46 %`, { x: M, y: 1.9, w: CW, h: 2.0, lang: "js", size: 12 });
    D.pasos(s, [
      ["CORRER", "El script imprime la pérdida para varios cambios de precio. No usa la cadena: es aritmética."],
      ["EXPLICAR LA SIMETRÍA", "¿Por qué subir ×2 y bajar a la mitad duelen exactamente igual? Justificarlo en el informe."],
      ["AÑADIR UN ESCENARIO", "Calcular la pérdida para un caso propio (por ejemplo ×10) y compararlo con conservar."],
    ], { y: 4.1, alto: 0.72, gap: 0.1, anchoEt: 3.0, size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · consumir un oráculo", titulo: "Leer un precio, y defenderse de él", ic: "red", tituloSize: 28 });
    D.codigo(s, `npx hardhat test test/s14/Oraculo.test.js      # 6 pruebas verdes`, { x: M, y: 1.9, w: CW, h: 0.62, lang: "js", size: 12 });
    D.lista(s, [
      "OraculoConsumidor lee el precio y lo normaliza a 18 decimales.",
      "Rechaza un precio no positivo y uno rancio (updatedAt viejo): un oráculo caído es tan peligroso como uno manipulado.",
      "Se prueba con OraculoFalso, controlable, sin depender de la red.",
      "La prueba ★ demuestra: quien mueve el oráculo mueve el precio que el contrato cree.",
    ], { y: 2.75, h: 2.0, size: 13, gap: 7 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "El ejercicio de diseño", x: M, y: 5.0, w: CW, h: 1.7, texto: "Añadir una comprobación más al consumidor: por ejemplo, rechazar si el precio cambió más de un X % respecto a la última lectura (un «circuit breaker» de precio). Escribir una prueba que lo demuestre. Es pensar como quien defiende, no como quien ataca.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "B.3 · qué se entrega", titulo: "Evidencia del laboratorio 14", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["Pérdida impermanente", "Tabla propia con al menos un escenario nuevo, y la explicación de la simetría.", "30 %"],
      ["Oráculo", "Las 6 pruebas verdes y la comprobación extra añadida con su prueba.", "40 %"],
      ["Análisis", "Elegir un ataque real a DeFi (oráculo o flash loan) y explicar en un párrafo qué falló.", "30 %"],
    ], { y: 1.9, h: 2.5, colW: [3.0, 7.493, 1.6], size: 12 });
    D.parrafo(s, "Este laboratorio no despliega en Sepolia: todo corre en local. El foco es entender el riesgo, no gastar gas de prueba.", { y: 4.6, h: 0.55, size: 13, color: C.ocre });
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "El proyecto", sub: "Casi ningún proyecto de curso es DeFi puro, pero muchos rozan una primitiva. Reconocer el riesgo que se asume es parte de hacerlo bien.", minutos: "APROXIMADAMENTE 30 MINUTOS", ic: "bandera" });

  {
    const s = await D.lamina({ kicker: "C.1 · ¿toca su proyecto a DeFi?", titulo: "Preguntas de riesgo para el proyecto", ic: "escudo", tituloSize: 26 });
    D.lista(s, [
      "¿Su contrato lee algún precio o dato externo? Si sí, ¿de qué oráculo, y qué pasa si miente o se cae?",
      "¿Maneja fondos que alguien querría drenar con un flash loan? ¿Qué invariante lo impediría?",
      "¿Depende de que un token mantenga su valor? ¿Qué pasa si no lo mantiene?",
      "¿Alguna función podría manipularse moviendo un balance dentro de la misma transacción?",
    ], { y: 1.9, h: 2.9, size: 13.5, gap: 9, numerada: true });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Para el Avance 2 y la sustentación", x: M, y: 5.05, w: CW, h: 1.65, texto: "En la rúbrica, «seguridad» pregunta qué vulnerabilidades consideraron. Si el proyecto roza DeFi, estas cuatro preguntas tienen que estar respondidas. «No aplica, porque…» es una respuesta válida y buena, si el porqué es correcto.", size: 13 });
  }

  await D.preguntaSemana({
    pregunta: "Busquen un ataque real a un protocolo DeFi (hay listas públicas de hackeos por año). ¿Fue un oráculo, un flash loan, un error de lógica? ¿Cuánto se perdió?",
    trabajo: [
      "Entregar la evidencia del laboratorio 14.",
      "Avanzar el proyecto hacia el Avance 2 (dApp integrada, Sesión 16).",
      "Leer sobre DAOs y gobernanza on-chain para la Sesión 15.",
      "El ensayo individual (RA7) se plantea formalmente la próxima sesión: ir pensando el tema.",
    ],
  });

  await D.cierre({
    frase: "En DeFi, el que pregunta «de dónde sale el rendimiento» entiende más que el que pregunta «cuánto rinde».",
    sub: "Vieron las primitivas y, sobre todo, cómo fallan. La próxima sesión: quién manda en estos sistemas cuando no hay dueño — la gobernanza.",
    proxima: "Sesión 15 · DAOs, gobernanza e identidad descentralizada",
  });

  return D.guardar(path.join(__dirname, "Sesion-14-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
