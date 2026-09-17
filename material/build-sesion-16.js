/* =====================================================================
   Sesión 16 · Escalabilidad, interoperabilidad y marco regulatorio
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 16 · ESCALABILIDAD Y REGULACIÓN", titulo: "Sesión 16 · L2 y regulación" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 16 · UNIDAD IV · ECOSISTEMA",
    titulo: "CÓMO ESCALA,\nY QUÉ DICE\nLA LEY",
    sub: "La capa base no alcanza para todos. Y una solución técnica impecable puede ser ilegal, cara o inaplicable. Hoy, las dos cosas.",
    palabra: "ESCALAR",
    ic: "puente",
    notas: "Penúltima sesión. La parte regulatoria hay que ACTUALIZARLA antes de dictar: la norma colombiana cambia. Se entrega el Avance 2.",
  });

  await D.agenda({
    intro: "Dos temas que todo proyecto real enfrenta tarde o temprano: no escala, y no está claro si es legal. Y el laboratorio compara costos de verdad.",
    bloques: [
      ["A", "ESCALABILIDAD E INTEROPERABILIDAD", "Trilema, capa 2, rollups, otras L1, puentes y sus robos.", "~50 min"],
      ["B", "MARCO REGULATORIO COLOMBIANO", "UIAF, DIAN, sandbox, MiCA, y si un contrato es un contrato jurídico.", "~50 min"],
      ["C", "LABORATORIO 16 + AVANCE 2", "Desplegar en una L2 de prueba y comparar costo. Entrega del Avance 2.", "~60 min"],
    ],
  });

  await D.objetivo({
    objetivo: "Evaluar soluciones de escalado y situar un proyecto blockchain en el contexto legal colombiano.",
    preguntas: [
      "¿Por qué la capa base no puede escalar sola?",
      "¿Qué diferencia un rollup optimista de uno de conocimiento cero?",
      "¿Por qué los puentes concentran los mayores robos del ecosistema?",
      "¿Qué obligaciones legales tendría su proyecto si saliera a producción en Colombia?",
    ],
    ra: "RA2 · arquitecturas y escalado  ·  RA7 · marco regulatorio y ética.",
  });

  await D.glosario({
    items: [
      ["Capa 2 · L2", "Layer 2", "Una red que procesa transacciones fuera de la capa base y le entrega a esta solo el resumen, heredando su seguridad."],
      ["Rollup", "acumulador", "Una L2 que agrupa muchas transacciones y publica su resultado comprimido en la L1."],
      ["Rollup optimista", "optimistic rollup", "Asume que las transacciones son válidas; abre un plazo para impugnar con una prueba de fraude."],
      ["ZK-rollup", "zero-knowledge", "Publica una prueba criptográfica de validez: no hay que confiar ni esperar a impugnar."],
      ["Puente · bridge", "bridge", "Un mecanismo para mover activos entre cadenas distintas. Concentra los mayores robos históricos."],
      ["EVM-compatible", "compatible con la EVM", "Una cadena donde corre el mismo bytecode de Ethereum: el mismo contrato sirve sin reescribir."],
      ["UIAF", "Unidad de Información y Análisis Financiero", "El organismo colombiano al que se reportan operaciones sospechosas."],
      ["MiCA", "Markets in Crypto-Assets", "El marco regulatorio de criptoactivos de la Unión Europea."],
    ],
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "Escalabilidad e interoperabilidad", sub: "Ethereum procesa pocas transacciones por segundo, y a veces caras. Escalar sin perder su seguridad es el gran problema técnico abierto.", minutos: "APROXIMADAMENTE 50 MINUTOS", ic: "puente" });

  {
    const s = await D.lamina({ kicker: "A.1 · de vuelta al trilema", titulo: "Por qué la capa base no escala sola", ic: "diana", tituloSize: 27 });
    D.parrafo(s, "Recordando la Sesión 4: descentralización, seguridad y escala, elige dos. Ethereum eligió las dos primeras. Procesar más transacciones por bloque exigiría nodos más potentes, y eso reduce cuántos pueden participar.", { y: 1.9, h: 0.95, size: 14.5 });
    D.enunciado(s, "Subir la escala en la capa base se paga en descentralización. Así que la escala se busca en otra parte: encima.", { y: 3.05, h: 1.25, size: 19 });
    D.parrafo(s, "La idea que organiza toda la sesión: dejar la capa base como una corte suprema —lenta, cara, pero máximamente segura— y mover el trabajo diario a capas de encima que se apoyan en ella.", { y: 4.55, h: 0.95, size: 13.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La analogía útil", x: M, y: 5.55, w: CW, h: 1.15, texto: "La capa base es la corte suprema: no se acude a ella para todo, pero su palabra es final. Las capas 2 son los juzgados del día a día que apelan a ella.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.2 · la idea de capa 2", titulo: "Trabajar afuera, liquidar adentro", ic: "capas", tituloSize: 28 });
    D.nodo(s, { x: M, y: 2.2, w: 5.7, h: 1.5, titulo: "CAPA 2", sub: "miles de transacciones\nbaratas y rápidas", fill: C.blanco, line: C.naranja, subSize: 12 });
    D.flecha(s, M + 2.85, 3.7, M + 2.85, 4.3, C.tinta, 2);
    D.etiqueta(s, "publica el resumen comprimido", { x: M + 3.0, y: 3.85, w: 4.5, color: C.gris, size: 9 });
    D.nodo(s, { x: M, y: 4.3, w: 5.7, h: 1.5, titulo: "CAPA 1 · ETHEREUM", sub: "guarda el resumen y\naporta la seguridad", fill: C.superf, line: C.violeta, subSize: 12 });
    D.lista(s, [
      "Las transacciones ocurren en la L2: rápidas y baratas.",
      "La L2 publica en la L1 solo un resumen de lo que pasó.",
      "La seguridad la sigue dando la L1: la L2 la hereda.",
      "Resultado: cientos de veces más barato, sin renunciar del todo a la seguridad de Ethereum.",
    ], { x: M + 6.1, y: 2.2, w: CW - 6.1, h: 3.6, size: 13, gap: 9 });
    s.addNotes("La diferencia con una cadena aparte (sidechain) es justo esa herencia de seguridad: una L2 de verdad se apoya en la L1, no solo la usa de vez en cuando.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · dos familias de rollup", titulo: "Optimista frente a conocimiento cero", ic: "escudo", tituloSize: 27 });
    D.tabla(s, ["", "rollup optimista", "ZK-rollup"], [
      ["Suposición", "Las transacciones son válidas, salvo que se demuestre lo contrario.", "Cada lote trae una prueba criptográfica de que es válido."],
      ["Cómo se confía", "Hay un plazo para impugnar con una prueba de fraude.", "La prueba se verifica al instante: no hay que confiar."],
      ["Retiro a la L1", "Lento: hay que esperar el plazo de impugnación (días).", "Rápido: en cuanto se verifica la prueba."],
      ["Complejidad", "Más simple de construir.", "Matemática pesada; era caro de generar, cada vez menos."],
      ["Ejemplos", "Arbitrum, Optimism, Base.", "zkSync, Starknet, Polygon zkEVM."],
    ], { y: 1.9, h: 3.5, colW: [2.3, 4.9, 4.893], size: 11 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Conocimiento cero, sin la matemática", x: M, y: 5.55, w: CW, h: 1.15, texto: "Una prueba de conocimiento cero demuestra que algo es cierto sin revelar por qué. Aquí: «este lote es válido», sin reejecutarlo. Es la frontera más activa del ecosistema.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.4 · otras capas base", titulo: "No todo es Ethereum, y «compatible con la EVM»", ic: "rejilla", tituloSize: 24 });
    D.parrafo(s, "Existen otras L1 con compromisos distintos del trilema: algunas priorizan velocidad sobre descentralización. La pregunta clave al mirarlas es qué sacrificaron.", { y: 1.9, h: 0.9, size: 14.5 });
    D.dosColumnas(s,
      { et: "El espectro de otras L1", texto: "Algunas ofrecen miles de transacciones por segundo con muy pocos validadores potentes: más rápidas, menos descentralizadas. Otras exploran arquitecturas nuevas. Cada una es un punto distinto del trilema de la Sesión 4." },
      { et: "«Compatible con la EVM»", texto: "Muchas corren el MISMO bytecode que Ethereum. Eso significa que el contrato que ustedes escribieron en Solidity funciona ahí sin reescribir: se despliega igual. Es la razón de que la EVM sea un estándar de facto." },
      { y: 2.95, h: 2.4, size: 12.5 });
    D.parrafo(s, "Para el proyecto: lo que aprendieron es transferible. El mismo contrato corre en Ethereum, en sus L2 y en muchas otras cadenas compatibles.", { y: 5.55, h: 0.6, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.5 · puentes", titulo: "Mover activos entre cadenas: el punto más frágil", ic: "puente", tituloSize: 25 });
    D.parrafo(s, "Cada cadena es un mundo cerrado. Un puente mueve activos entre dos: bloquea el activo en la cadena de origen y emite una representación en la de destino. Suena simple. Es donde ocurren los mayores robos del ecosistema.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "Por qué son tan atacados", linea: C.rojo, color: C.rojo, texto: "Un puente custodia, en un solo lugar, todo el valor bloqueado de los dos lados. Es un pozo de dinero enorme con lógica compleja. Varios de los robos más grandes de la historia —cientos de millones cada uno— fueron a puentes." },
      { et: "Qué mirar antes de usar uno", texto: "Quién custodia los fondos y bajo qué reglas. Si es un multisig, quiénes firman. Si es un contrato, si está auditado. La pregunta de siempre: ¿a quién le estoy confiando esto, y qué pasa si falla?" },
      { y: 2.95, h: 2.5, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "La regla práctica", x: M, y: 5.5, w: CW, h: 1.15, texto: "Un puente concentra riesgo por diseño. Si el proyecto puede vivir en una sola cadena, casi siempre es mejor. Cruzar cadenas es una decisión de riesgo, no solo técnica.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.6 · lo que hay que llevarse del bloque A", titulo: "Cinco ideas sobre escala", ic: "lista", tituloSize: 28 });
    const ideas = [
      "La capa base no escala sola sin sacrificar descentralización: la escala se busca encima.",
      "Una L2 procesa afuera y liquida adentro, heredando la seguridad de la L1.",
      "Optimista: confía y deja impugnar. ZK: prueba de validez, sin confiar ni esperar.",
      "«Compatible con la EVM» significa que su contrato corre sin reescribir en muchas cadenas.",
      "Los puentes concentran el valor y los robos: cruzar cadenas es una decisión de riesgo.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.88;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.7, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.1, w: CW - 0.85, h: 0.6, size: 14.5, valign: "middle" });
      D.linea(s, M, y + 0.8, M + CW, y + 0.8, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Marco regulatorio colombiano", sub: "Una solución técnica impecable puede ser ilegal, cara de cumplir o sin efecto jurídico. Un ingeniero responsable conoce el terreno legal.", minutos: "APROXIMADAMENTE 50 MINUTOS", ic: "balanza" });

  {
    const s = await D.lamina({ kicker: "B.0 · advertencia", titulo: "Esta parte caduca: verifíquela antes de clase", ic: "alerta", tituloSize: 25 });
    D.parrafo(s, "La regulación colombiana de criptoactivos ha estado en evolución activa. Lo que sigue es el marco general y las preguntas correctas, no una asesoría jurídica ni una foto vigente.", { y: 1.9, h: 0.95, size: 14.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Antes de dictar esta sesión", x: M, y: 3.1, w: CW, h: 1.6, texto: "Verificar el estado vigente de la normativa (UIAF, DIAN, Superintendencia Financiera, proyectos de ley en curso) y actualizar las referencias. Se recomienda fuertemente invitar a un profesional del área jurídica o financiera. El docente NO es la fuente de verdad legal.", size: 13.5 });
    D.parrafo(s, "Lo que NO caduca es el método: qué preguntas hacerse, qué organismos existen y por qué la técnica no basta. Eso es lo que se evalúa.", { y: 5.0, h: 0.7, size: 13, color: C.ocre });
    s.addNotes("Insistir: esta es la sesión que más fácilmente queda desactualizada. Actualizarla es responsabilidad de quien la dicta.");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · el mapa institucional", titulo: "Quién regula qué en Colombia", ic: "documento", tituloSize: 26 });
    D.tabla(s, ["organismo", "qué le importa", "la pregunta que hace"], [
      ["UIAF", "Prevención de lavado de activos.", "¿Se reportan las operaciones sospechosas?"],
      ["DIAN", "Impuestos.", "¿Se declaran las ganancias en criptoactivos?"],
      ["Superintendencia Financiera", "Estabilidad y protección al consumidor.", "¿Esto es un producto financiero que requiere licencia?"],
      ["Congreso", "El marco legal.", "¿Qué dice la ley que aún se está discutiendo?"],
    ], { y: 1.9, h: 3.0, colW: [3.2, 4.0, 4.893], size: 11.5 });
    D.parrafo(s, "El sandbox regulatorio de la Superintendencia Financiera ha permitido probar proyectos con criptoactivos en un entorno controlado y vigilado. Es la vía de experimentar legalmente.", { y: 5.1, h: 0.8, size: 13 });
    D.parrafo(s, "Verificar el estado y los nombres exactos antes de clase (B.0).", { y: 6.0, h: 0.4, size: 12, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · el panorama internacional", titulo: "AML, KYC, el Travel Rule y MiCA", ic: "mundo", tituloSize: 26 });
    D.tabla(s, ["término", "qué exige"], [
      ["AML · antilavado", "Medidas para impedir que el sistema se use para lavar dinero."],
      ["KYC · conoce a tu cliente", "Identificar a los usuarios. Choca de frente con el ideal de anonimato de las cadenas públicas."],
      ["Travel Rule", "Que la información del que envía y el que recibe «viaje» con las transferencias grandes entre entidades."],
      ["MiCA (Unión Europea)", "El marco integral de criptoactivos de la UE: licencias, stablecoins, protección al consumidor. La referencia que muchos países miran."],
    ], { y: 1.9, h: 3.1, colW: [3.4, 8.693], size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La tensión de fondo", x: M, y: 5.2, w: CW, h: 1.5, texto: "Las cadenas públicas se diseñaron para ser abiertas y seudónimas. La regulación financiera exige identificar a las partes. Todo proyecto real vive en esa tensión: cuánto anonimato preserva y cuánto cumplimiento acepta. No hay una respuesta técnica: es una decisión de diseño con consecuencias legales.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "B.3 · la pregunta jurídica de fondo", titulo: "¿Un contrato inteligente es un contrato?", ic: "balanza", tituloSize: 26 });
    D.dosColumnas(s,
      { et: "Lo que es", texto: "Un programa que ejecuta reglas automáticamente. Puede AUTOMATIZAR el cumplimiento de un acuerdo: liberar un pago cuando se cumple una condición." },
      { et: "Lo que no necesariamente es", linea: C.rojo, color: C.rojo, texto: "Un contrato jurídicamente válido y exigible ante un juez. Eso depende de la ley, no del código. ¿Hubo consentimiento? ¿Las partes tenían capacidad? ¿Qué jurisdicción aplica si algo sale mal?" },
      { y: 1.9, h: 2.4, size: 12.5 });
    D.parrafo(s, "Es la duda que aparece en casi todos los anteproyectos (Sesión 6). La respuesta honesta: un contrato inteligente y un contrato jurídico pueden coincidir, pero no son lo mismo, y confundirlos trae problemas.", { y: 4.5, h: 0.85, size: 13.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta que casi nadie hace", x: M, y: 5.5, w: CW, h: 1.2, texto: "Si el contrato hace algo que las partes no querían (un error, un exploit), ¿quién responde ante la ley? ¿El que lo programó? ¿El que lo desplegó? Es terreno sin resolver, y es exactamente el tipo de tema para el ensayo.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "B.4 · ética y sostenibilidad", titulo: "La responsabilidad del que construye", ic: "escudo", tituloSize: 26 });
    D.tabla(s, ["tema", "la conversación honesta"], [
      ["Huella energética", "La prueba de trabajo consume mucho (S4). La prueba de participación bajó el consumo de Ethereum ~99,9 %. El dato importa y hay que citarlo con la fuente vigente, no de memoria."],
      ["Inclusión financiera", "La promesa: banca para quien no la tiene. La realidad: hace falta internet, un teléfono y saber usarlo. ¿Incluye de verdad, o solo a quien ya estaba cerca?"],
      ["Estafas", "El ecosistema está lleno de esquemas extractivos (S10, S14). Quien construye tiene la responsabilidad de no sumar uno más, y de no prometer lo que no es."],
    ], { y: 1.9, h: 3.5, colW: [2.8, 9.293], size: 11.5 });
    D.enunciado(s, "Saber construir esto trae una responsabilidad: reconocer cuándo NO se debe, y no vender humo. Es donde empezó el curso, en la Sesión 1.", { y: 5.6, h: 1.1, size: 16, line: C.naranja });
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "Laboratorio 16 y Avance 2", sub: "Desplegar el mismo contrato en una L2 de prueba y comparar el costo con la L1. Y entregar la dApp integrada.", minutos: "APROXIMADAMENTE 60 MINUTOS", ic: "puente" });

  {
    const s = await D.lamina({ kicker: "C.1 · laboratorio", titulo: "El mismo contrato, dos redes, un cuadro", ic: "grafico", tituloSize: 27 });
    D.pasos(s, [
      ["ELEGIR CONTRATO", "Cualquiera ya escrito del curso: el de certificados, el token, o uno del proyecto."],
      ["DESPLEGAR EN L1", "En Sepolia. Anotar el costo del despliegue y de una operación típica."],
      ["DESPLEGAR EN L2", "En una L2 de prueba compatible con la EVM (por ejemplo la testnet de Optimism o Base). El MISMO contrato, sin cambios."],
      ["COMPARAR", "Una tabla con datos propios: costo y tiempo de confirmación en cada red."],
    ], { y: 1.9, alto: 0.82, gap: 0.12, anchoEt: 2.6, size: 12.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Lo que demuestra en carne propia", x: M, y: 6.02 - 0.1, w: CW, h: 0.86, texto: "«Compatible con la EVM» no es teoría: el mismo bytecode se despliega en la L2 sin tocar una línea, y cuesta una fracción.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "C.2 · taller regulatorio", titulo: "El análisis legal del proyecto propio", ic: "documento", tituloSize: 26 });
    D.parrafo(s, "En equipos, media hora: aplicar el mapa institucional al propio proyecto. No es un ejercicio abstracto — es lo que habría que resolver para sacarlo a producción en Colombia.", { y: 1.9, h: 0.9, size: 14 });
    D.lista(s, [
      "Si nuestro proyecto saliera a producción, ¿qué obligación de la UIAF o la DIAN aplicaría?",
      "¿Manejamos datos personales? ¿Cómo cumplimos la Ley 1581 con una cadena inmutable? (S6, S11)",
      "¿Nuestro token o servicio podría considerarse un producto financiero regulado?",
      "¿El «contrato» de nuestro proyecto tiene algún efecto jurídico, o solo automatiza?",
    ], { y: 2.9, h: 2.6, size: 13.5, gap: 9, numerada: true });
    D.parrafo(s, "Estas respuestas alimentan directamente la sustentación final y, para muchos, el ensayo individual.", { y: 5.7, h: 0.5, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "C.3 · entrega", titulo: "Avance 2 · la dApp integrada", ic: "bandera", tituloSize: 28 });
    D.tabla(s, ["componente", "requisito"], [
      ["Frontend conectado", "La interfaz ejecuta el flujo completo del proyecto contra los contratos."],
      ["Flujo funcional", "Un caso de uso de punta a punta funciona: leer, escribir, y ver el resultado."],
      ["Metadata en IPFS", "Si el proyecto usa NFTs, la metadata se sirve desde IPFS."],
      ["Manejo de estados", "Los cuatro estados de transacción (S12), visibles al usuario."],
    ], { y: 1.9, h: 2.4, colW: [2.9, 9.193], size: 12 });
    D.parrafo(s, "Peso: 10 % de la nota final. Con esto, al Demo Day solo le queda pulir, documentar y preparar la defensa.", { y: 4.5, h: 0.55, size: 13, color: C.ocre });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Lo que se revisa hoy", x: M, y: 5.2, w: CW, h: 1.5, texto: "Que el flujo principal funcione de verdad, no en diapositivas. Mejor un caso de uso completo y sólido que cinco a medias — el corte vertical del proyecto del docente, una vez más. Lo que falte se cierra antes del Demo Day, con fecha.", size: 13 });
  }

  await D.preguntaSemana({
    pregunta: "Para su proyecto en Colombia: nombren la obligación legal que MÁS le costaría cumplir. ¿La cumplirían, o rediseñarían para no tener que hacerlo?",
    trabajo: [
      "Entregar el Avance 2 y el cuadro comparativo L1 vs. L2 del laboratorio.",
      "Preparar la sustentación final para el Demo Day (Sesión 17): 15 min + 5 de preguntas.",
      "Terminar el ensayo individual (RA7): se entrega en la Sesión 17.",
      "Grabar un video demo de respaldo de 3 minutos, por si la demo en vivo falla.",
    ],
  });

  await D.cierre({
    frase: "Una solución técnica perfecta puede ser ilegal o inaplicable. Saberlo es parte de saber construir.",
    sub: "Ya está todo: el mecanismo, el código, la seguridad, la interfaz, el gobierno y el contexto. Lo que queda es mostrarlo y defenderlo. Nos vemos en el Demo Day.",
    proxima: "Sesión 17 · Demo Day · sustentación de proyectos y cierre del curso",
  });

  return D.guardar(path.join(__dirname, "Sesion-16-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
