/* =====================================================================
   Sesión 17 · Demo Day: sustentación de proyectos y cierre
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 17 · DEMO DAY Y CIERRE", titulo: "Sesión 17 · Demo Day" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 17 · CIERRE DEL CURSO",
    titulo: "DEMO DAY:\nMOSTRAR Y\nDEFENDER",
    sub: "El día de sustentar lo construido, defenderlo con preguntas reales, y mirar hacia dónde sigue el camino.",
    palabra: "SUSTENTAR",
    ic: "cohete",
    notas: "Última sesión. Tres bloques: las sustentaciones, la auditoría cruzada #2 y el cierre del curso. Cronómetro estricto.",
  });

  await D.agenda({
    intro: "El día es de los equipos, no del docente. La mayor parte del tiempo son las sustentaciones y las preguntas entre pares.",
    bloques: [
      ["A", "SUSTENTACIONES", "15 minutos por equipo + 5 de preguntas. Con demo en vivo sobre testnet.", "~la mayor parte"],
      ["B", "AUDITORÍA CRUZADA #2", "Cada equipo formula una pregunta técnica al equipo evaluado. Se califica la pregunta.", "incluido en A"],
      ["C", "CIERRE DEL CURSO", "Retrospectiva, rutas de profundización y qué sigue.", "~30 min"],
    ],
  });

  await D.objetivo({
    objetivo: "Sustentar públicamente la solución construida y defenderla técnicamente ante preguntas de pares y del docente.",
    preguntas: [
      "¿El proyecto de verdad necesita blockchain, con honestidad?",
      "¿Qué decisiones de diseño se tomaron, y qué se sacrificó con cada una?",
      "¿Qué vulnerabilidades se consideraron y cómo se mitigaron?",
      "¿Cuáles son los límites y el costo real de la solución?",
    ],
    ra: "Los siete RA convergen aquí: se sustenta y se defiende todo lo del semestre.",
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "Las sustentaciones", sub: "Quince minutos para contar el problema, la solución, la demo, la seguridad y los límites. Cinco de preguntas. Cronómetro visible.", minutos: "15 + 5 MINUTOS POR EQUIPO", ic: "pantalla" });

  {
    const s = await D.lamina({ kicker: "A.1 · la estructura", titulo: "Cinco partes en quince minutos", ic: "lista", tituloSize: 28 });
    D.tabla(s, ["parte", "qué contar", "minutos"], [
      ["Problema", "Quién sufre qué. Y, con honestidad: ¿de verdad requiere blockchain?", "~3"],
      ["Arquitectura", "Contratos, interfaz, almacenamiento. Las decisiones de diseño y qué se sacrificó.", "~3"],
      ["Demo en vivo", "Sobre testnet. El flujo principal, funcionando de verdad.", "~5"],
      ["Seguridad", "Vulnerabilidades consideradas y mitigaciones aplicadas.", "~2"],
      ["Límites y futuro", "Costos estimados, qué no resuelve, qué sigue.", "~2"],
    ], { y: 1.9, h: 3.3, colW: [2.4, 7.7, 1.993], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "La demo en vivo puede fallar", x: M, y: 5.5, w: CW, h: 1.2, texto: "Redes de prueba, faucets, conexión: cualquier cosa puede caerse en el peor momento. Por eso se pidió un video de respaldo de 3 minutos. Tener el plan B listo es parte de la madurez profesional, no una rendición.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.2 · lo que distingue una buena sustentación", titulo: "Honestidad sobre entusiasmo", ic: "balanza", tituloSize: 25 });
    D.dosColumnas(s,
      { et: "Una sustentación floja", linea: C.rojo, color: C.rojo, items: ["Vende la tecnología como mágica.", "Esconde lo que no funciona.", "«Usamos blockchain porque es innovador».", "No sabe qué pasa si algo falla."] },
      { et: "Una buena sustentación", items: ["Dice qué resuelve y qué no.", "Muestra los límites sin que se los saquen.", "Justifica por qué blockchain, o admite dónde no hacía falta.", "Responde «¿y si…?» con solvencia."] },
      { y: 1.9, h: 2.55, size: 13 });
    D.enunciado(s, "El equipo que dice «aquí una base de datos habría bastado, pero esta parte sí necesita la cadena porque…» demuestra más que el que jura que todo es revolucionario.", { y: 4.6, h: 1.35, size: 16, line: C.naranja });
    s.addNotes("Es el criterio de pertinencia de la rúbrica y el hilo de todo el curso desde la Sesión 1. Premiar la honestidad explícitamente.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · auditoría cruzada #2", titulo: "La pregunta también se califica", ic: "lupa", tituloSize: 28 });
    D.parrafo(s, "Al terminar cada sustentación, otro equipo formula al menos una pregunta técnica. No es un trámite: la CALIDAD de la pregunta se evalúa.", { y: 1.9, h: 0.9, size: 14.5 });
    D.dosColumnas(s,
      { et: "Preguntas que no aportan", linea: C.rojo, color: C.rojo, items: ["«¿Cuánto tardaron en hacerlo?»", "«¿Por qué eligieron ese color?»", "Cualquiera que se responde con sí o no."] },
      { et: "Preguntas que demuestran criterio", items: ["«¿Qué pasa si dos usuarios llaman esa función en el mismo bloque?»", "«¿Su contrato es vulnerable a reentrancy en la función de retiro?»", "«¿De dónde saca el precio, y qué pasa si el oráculo miente?»"] },
      { y: 2.9, h: 2.5, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Por qué se evalúa preguntar", x: M, y: 5.5, w: CW, h: 1.15, texto: "Leer código ajeno y encontrarle la grieta es una competencia profesional central (Sesión 9). Una buena pregunta demuestra que se entendió el proyecto del otro.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.4 · la rúbrica, a la vista", titulo: "Con qué se califica el proyecto final", ic: "voto", tituloSize: 27 });
    D.tabla(s, ["criterio", "peso", "qué mira"], [
      ["Pertinencia", "15 %", "¿De verdad necesita blockchain? ¿Descartó alternativas con argumentos?"],
      ["Calidad de contratos", "25 %", "Código limpio, estándares, gas, eventos bien diseñados."],
      ["Pruebas y despliegue", "20 %", "Cobertura ≥ 80 %, casos límite, despliegue verificado y reproducible."],
      ["Seguridad", "20 %", "Vulnerabilidades documentadas, mitigadas; análisis estático sin críticos."],
      ["Integración e interfaz", "10 %", "dApp funcional, estados manejados, usable por alguien no experto."],
      ["Sustentación y docs", "10 %", "Claridad, dominio, responde con solvencia; README reproducible."],
    ], { y: 1.9, h: 4.1, colW: [3.3, 1.4, 7.393], size: 11 });
    D.parrafo(s, "Nada aquí es sorpresa: son los mismos criterios que se anunciaron en la Sesión 6 y se revisaron en cada avance.", { y: 6.15, h: 0.45, size: 12.5, color: C.ocre });
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "Cierre del curso", sub: "Qué construyeron, qué aprendieron a preguntar, y hacia dónde sigue el camino si quieren seguirlo.", minutos: "APROXIMADAMENTE 30 MINUTOS", ic: "bandera" });

  {
    const s = await D.lamina({ kicker: "C.1 · retrospectiva", titulo: "Lo que saben hacer que no sabían en la Sesión 1", ic: "grafico", tituloSize: 24 });
    D.lista(s, [
      "Explicar, con precisión, qué problema resuelve blockchain y cuándo NO usarla.",
      "Programar, probar, desplegar y verificar contratos con un flujo profesional.",
      "Encontrar y explotar las vulnerabilidades más comunes, y defenderse de ellas.",
      "Construir una dApp completa: contratos, interfaz, almacenamiento e infraestructura.",
      "Implementar tokens, NFTs y gobernanza on-chain con estándares de la industria.",
      "Evaluar una solución con honestidad: costos, límites, regulación y ética.",
    ], { y: 1.9, h: 3.4, size: 13.5, gap: 9 });
    D.enunciado(s, "La habilidad más valiosa del curso no es escribir Solidity. Es saber cuándo NO usar blockchain, y poder defender esa decisión.", { y: 5.5, h: 1.2, size: 16, line: C.naranja });
  }

  {
    const s = await D.lamina({ kicker: "C.2 · hacia dónde seguir", titulo: "Rutas de profundización", ic: "cohete", tituloSize: 28 });
    D.tabla(s, ["ruta", "qué es", "por dónde empezar"], [
      ["Seguridad y auditoría", "Encontrar fallos por oficio. Muy demandado y bien pagado.", "Damn Vulnerable DeFi, competencias de auditoría, Ethernaut completo."],
      ["Conocimiento cero (ZK)", "La frontera técnica: probar sin revelar. Matemática intensa.", "Circom, zkSync, cursos de ZK."],
      ["Infraestructura de protocolo", "Construir las cadenas y las L2, no encima de ellas.", "Clientes de Ethereum, el diseño de rollups."],
      ["Producto Web3", "Diseñar dApps que la gente de verdad use.", "Scaffold-ETH, Speed Run Ethereum."],
    ], { y: 1.9, h: 3.3, colW: [3.0, 4.6, 4.493], size: 11 });
    D.parrafo(s, "Y lo más importante: hay trabajos de grado y semilleros en la universidad donde seguir cualquiera de estas rutas. Toquen la puerta.", { y: 5.4, h: 0.6, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "C.3 · la última idea", titulo: "Lo que se llevan, más allá del código", ic: "escudo", tituloSize: 27 });
    D.parrafo(s, "Este ecosistema está lleno de promesas exageradas, de proyectos que no necesitaban existir y de estafas con buen diseño. Ustedes ahora tienen las herramientas para distinguir.", { y: 1.9, h: 0.95, size: 14.5 });
    D.lista(s, [
      "Cuando alguien diga «esto es seguro porque usa blockchain», sabrán preguntar qué propiedad concreta aporta.",
      "Cuando prometan rendimientos altísimos, sabrán preguntar de dónde sale el dinero.",
      "Cuando vendan un token que no hace nada, lo reconocerán.",
      "Y cuando de verdad haga falta una cadena, sabrán construirla bien.",
    ], { y: 3.0, h: 2.4, size: 13.5, gap: 9 });
    D.enunciado(s, "El curso empezó con una pregunta —¿qué problema resuelve blockchain?— y termina con la capacidad de responderla, caso por caso, con honestidad.", { y: 5.5, h: 1.2, size: 16, line: C.naranja });
    s.addNotes("Cerrar agradeciendo el trabajo del semestre y recordando que el proyecto del docente (entradas) también recorrió este camino, en paralelo con ellos.");
  }

  {
    const s = D.pres.addSlide();
    s.background = { color: C.tinta };
    s.addShape(D.pres.ShapeType.rect, { x: 0, y: 0, w: D.W, h: 0.16, fill: { color: C.naranja }, line: { width: 0 } });
    await (async () => {
      s.addImage({ data: await D.icono("cadena", C.naranja), x: D.W / 2 - 0.35, y: 2.2, w: 0.7, h: 0.7 });
    })();
    s.addText("GRACIAS", { x: 0, y: 3.1, w: D.W, h: 1.0, fontFace: F.display, fontSize: 54, color: C.blanco, align: "center", valign: "middle", margin: 0 });
    s.addText("Blockchain y Web 3.0 · Ingeniería de Sistemas · Universidad de San Buenaventura Medellín", {
      x: 0, y: 4.3, w: D.W, h: 0.5, fontFace: F.body, fontSize: 14, color: "B9B4C4", align: "center", valign: "middle", margin: 0,
    });
    D.pie(s, true);
  }

  return D.guardar(path.join(__dirname, "Sesion-17-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
