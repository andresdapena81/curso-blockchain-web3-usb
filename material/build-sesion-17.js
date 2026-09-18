/* =====================================================================
   Sesión 17 · Demo Day: sustentación de proyectos y cierre del curso
   Deck de CONDUCCIÓN (~27 láminas): la sesión es de los equipos. El deck
   ordena el tiempo, fija las reglas y cierra el curso.
   Material de apoyo: material/proyecto/04-entrega-final.pdf y
   material/proyecto/planilla-sustentacion.pdf
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 17 · DEMO DAY Y CIERRE DEL CURSO", titulo: "Sesión 17 · Demo Day y cierre" });
  const { C, F, M, CW, pres } = D;

  /* semáforo: primitiva local (no existe en lib/) */
  function luz(s, o) {
    D.caja(s, { x: o.x, y: o.y, w: o.w, h: o.h, fill: C.blanco, line: o.color, sombraColor: o.color });
    s.addShape(pres.ShapeType.ellipse, { x: o.x + 0.3, y: o.y + 0.3, w: 0.75, h: 0.75, fill: { color: o.color }, line: { color: C.tinta, width: 1.5 } });
    s.addText(o.tramo, { x: o.x + 1.25, y: o.y + 0.28, w: o.w - 1.45, h: 0.4, fontFace: F.display, fontSize: 17, color: C.tinta, margin: 0, valign: "middle" });
    D.etiqueta(s, o.nombre, { x: o.x + 1.25, y: o.y + 0.72, w: o.w - 1.45, color: o.colorTexto || o.color, size: 10 });
    D.parrafo(s, o.texto, { x: o.x + 0.3, y: o.y + 1.25, w: o.w - 0.6, h: o.h - 1.4, size: 12, ls: 1.15 });
  }

  /* ---------------------------------------------------------- apertura */
  await D.portada({
    kicker: "SESIÓN 17 · UNIDAD IV · CIERRE DEL CURSO",
    titulo: "DEMO DAY:\nMOSTRAR Y\nDEFENDER",
    sub: "Los equipos sustentan lo que construyeron, se auditan entre sí y cerramos el semestre.",
    palabra: "SUSTENTAR",
    ic: "cohete",
    notas: "Última sesión. El día es de los equipos: el docente conduce, cronometra y califica en vivo con la planilla impresa (material/proyecto/planilla-sustentacion.pdf, una hoja por equipo más la hoja de preguntas). Antes de empezar: proyector probado con un portátil de estudiante, cronómetro visible, planillas impresas, sorteo del orden preparado. Esta lámina: 1 minuto.",
  });

  await D.agenda({
    intro: "Tres momentos. La mayor parte del tiempo son las sustentaciones con sus preguntas; la agenda de abajo es para hasta 5 equipos (la lámina siguiente dice cómo ajustarla).",
    bloques: [
      ["A", "APERTURA Y REGLAS", "Entregas del día, sorteo del orden, reglas, plan B y semáforo.", "10 min"],
      ["B", "SUSTENTACIONES + AUDITORÍA #2", "Cada equipo: 15 min de presentación, 5 de preguntas y 2 de cambio. Pausa de 10 min a la mitad.", "130 min"],
      ["C", "CIERRE DEL CURSO", "Retrospectiva guiada, la tesis del curso, rutas de profundización y qué sigue.", "30 min"],
    ],
    notas: "10 + 130 + 30 = 170 min, más la pausa de 10 = 180. Con 5 equipos las sustentaciones ocupan 5 × 22 = 110 min: quedan 10 min de holgura para imprevistos (un portátil que no proyecta, una demo que se reinicia). Si hay más de 5 equipos, pasar a la lámina siguiente ANTES de la sesión y decidir el formato. Esta lámina: 1 minuto.",
  });

  {
    const s = await D.lamina({ kicker: "Para el docente · antes de la sesión", titulo: "La fórmula para ajustar la agenda", ic: "reloj", tituloSize: 27 });
    D.definicion(s, "minutos por equipo  = 15 presentación + 5 preguntas + 2 cambio = 22\ntiempo de la sesión = 50 fijos (10 apertura + 10 pausa + 30 cierre) + 22 × N equipos", { x: M, y: 1.9, w: CW, h: 0.62, size: 11 });
    D.tabla(s, ["equipos (N)", "sustentaciones", "total de la sesión", "qué hacer"], [
      ["3 a 5", "66 a 110 min", "116 a 160 min", "Formato estándar. Sobra tiempo: se usa en preguntas del público."],
      ["6", "132 min", "182 min", "Estándar, recortando la pausa a 5 min (177 min)."],
      ["7 a 8", "154 a 176 min", "204 a 226 min", "No cabe. Dos jornadas, o dos salas en paralelo con dos evaluadores."],
      ["9 o más", "198 min o más", "248 min o más", "Dos jornadas o dos salas: cada sala con la mitad de los equipos."],
    ], { y: 2.72, h: 2.5, colW: [1.8, 2.3, 2.5, 5.493], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Lo que no se recorta", x: M, y: 5.42, w: CW, h: 1.28, texto: "Los 15 + 5 minutos son del plan y la rúbrica cuenta con ellos. Si se decide un formato comprimido (12 + 4 + 1 = 17 min, que alcanza para 7 equipos en 169 min), se anuncia a los equipos con una semana de anticipación, nunca el mismo día.", size: 12.5 });
    s.addNotes("Esta lámina es para el docente: no se proyecta en clase, o se muestra solo si los estudiantes preguntan por el horario. Cifras calculadas: total = 50 + 22·N (N=5 → 160; N=6 → 182; N=7 → 204; N=8 → 226). Formato comprimido: 50 + 17·N (N=7 → 169; N=8 → 186, no cabe). Número máximo de equipos por jornada = piso(130 / minutos por equipo): 5 en el estándar, 7 en el comprimido. Dos salas: cada una con ceil(N/2) equipos, y se necesita un segundo evaluador con la misma planilla. La decisión se toma en la Sesión 16, cuando ya se sabe cuántos equipos llegan al final.");
  }

  await D.objetivo({
    objetivo: "Sustentar públicamente la solución construida y defenderla técnicamente ante preguntas de pares y del docente.",
    preguntas: [
      "¿El proyecto de verdad necesita blockchain? Con honestidad.",
      "¿Qué decisiones de diseño se tomaron, y qué se sacrificó con cada una?",
      "¿Qué vulnerabilidades se consideraron y cómo se mitigaron?",
      "¿Cuáles son los límites, los costos y el trabajo que falta?",
    ],
    ra: "Los siete RA convergen aquí; RA2, RA3, RA4, RA5, RA6 y RA7 se evalúan directamente en la sustentación.",
    notas: "Las cuatro preguntas son, casi palabra por palabra, las cinco partes obligatorias de la sustentación. Decirlo explícitamente: si su presentación responde estas cuatro preguntas con evidencia, está bien encaminada. 1 minuto.",
  });

  /* ================================================================ A */
  await D.divisor({ letra: "A", titulo: "Apertura y reglas", sub: "Qué se entrega hoy, en qué orden se presenta, qué se exige en cada sustentación y qué pasa si la demo falla.", minutos: "10 MINUTOS", ic: "lista" });

  {
    const s = await D.lamina({ kicker: "A.1 · lo que se entrega hoy", titulo: "Dos entregas cierran el semestre", ic: "documento", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Proyecto final · por equipo", items: ["Repositorio con la etiqueta v1.0-final, antes de empezar la sesión.", "Contratos desplegados y verificados en la red de prueba.", "dApp desplegada en una URL pública.", "Documentación técnica: README reproducible, arquitectura, seguridad, costos.", "Video de respaldo de 3 minutos, con enlace en el README."] },
      { et: "Ensayo individual · RA7", items: ["1.500 palabras, planteado en la Sesión 15.", "Una implicación regulatoria, ética, económica o ambiental, aplicada a Colombia.", "Con declaración del uso de herramientas de IA.", "Peso: 20 % del tercer corte (8 % de la nota final)."] },
      { y: 1.9, h: 3.45, size: 12.5 });
    D.parrafo(s, "Lo que se evalúa es lo que está en la etiqueta v1.0-final. Un commit posterior a la hora de inicio no cuenta. Detalle completo: material/proyecto/04-entrega-final.pdf.", { y: 5.6, h: 0.9, size: 13, color: C.ocre });
    s.addNotes("Confirmar en voz alta que todos los equipos crearon la etiqueta (git tag v1.0-final && git push origin v1.0-final). Si un equipo no la tiene, se toma el último commit anterior a la hora de inicio. Recordar el ensayo: se entrega hoy, por el canal del curso. Pesos: entrega final + sustentación 15 % (tabla de entregas del plan, sección 8). 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · reglas de la sustentación", titulo: "Las reglas, iguales para todos", ic: "balanza", tituloSize: 28 });
    D.tabla(s, ["regla", "detalle"], [
      ["Orden", "Se sortea ahora, en público. El equipo siguiente prepara su portátil mientras el anterior responde."],
      ["Tiempo", "15 minutos de presentación, cortados a los 15:00. Luego 5 de preguntas. El semáforo es visible para todos."],
      ["Quién habla", "Hablan los tres integrantes. Cualquier pregunta puede dirigirse a cualquiera: todos deben dominar todo."],
      ["Red", "Solo red de prueba o red local. Nunca dinero real, nunca la red principal."],
      ["Pantalla", "Ninguna frase semilla, clave privada ni URL de RPC en pantalla. Las claves viven en el keystore de Hardhat."],
      ["Datos", "Ningún dato personal real en cadena ni en la demo. Datos inventados; de documentos, solo el hash."],
    ], { y: 1.9, h: 4.25, colW: [2.1, 9.993], size: 12 });
    D.parrafo(s, "Quien se sale de estas reglas en la demo pierde el punto en Seguridad, aunque el código sea impecable.", { y: 6.28, h: 0.45, size: 13, color: C.rojo });
    s.addNotes("Hacer el sorteo en este momento (papelitos o un generador aleatorio proyectado) y escribir el orden en la lámina B.1. Insistir en la regla de pantalla: con una frase semilla visible en un video o en una grabación de la sesión, esa billetera queda comprometida para siempre, aunque sea de prueba; y el hábito es lo que importa. 2 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · las cinco partes obligatorias", titulo: "Qué debe tener cada sustentación", ic: "lista", tituloSize: 27 });
    D.tabla(s, ["parte", "qué se tiene que ver", "min", "criterio"], [
      ["1 · Problema", "Quién sufre qué. Por qué blockchain, con honestidad: qué propiedad aporta la cadena que una base de datos no da.", "3", "Pertinencia"],
      ["2 · Arquitectura", "Contratos, interfaz, almacenamiento. Cada decisión de diseño con la alternativa que se descartó y por qué.", "3", "Contratos"],
      ["3 · Demo en vivo", "El flujo principal en la red de prueba: transacción enviada, confirmada y vista en el explorador.", "5", "Integración"],
      ["4 · Seguridad", "Amenazas consideradas, mitigaciones aplicadas, qué dijo Slither y qué hallazgo de la auditoría #1 corrigieron.", "2", "Seguridad"],
      ["5 · Límites", "Costos medidos de gas, lo que la solución NO resuelve y el trabajo futuro.", "2", "Sustentación"],
    ], { y: 1.9, h: 4.3, colW: [2.2, 6.9, 0.8, 2.193], size: 11.5 });
    D.parrafo(s, "Pruebas y despliegue (20 %) se revisan en el repositorio: cobertura, casos de reversión y contratos verificados.", { y: 6.3, h: 0.45, size: 12.5, color: C.ocre });
    s.addNotes("Los minutos son orientativos; lo obligatorio es que las cinco partes estén. Una sustentación sin la parte 5 pierde puntos en Sustentación aunque todo lo demás sea excelente: reconocer los límites es parte del criterio profesional. La columna 'criterio' dice qué criterio de la rúbrica alimenta sobre todo cada parte. 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · la parte 1, la más difícil", titulo: "«¿Lo requiere?» se responde con honestidad", ic: "diana", tituloSize: 25 });
    D.parrafo(s, "Es la pregunta con la que empezó el curso y la que más pesa en la Pertinencia (15 %). No se gana diciendo que sí; se gana mostrando que se pensó.", { y: 1.9, h: 0.65, size: 14 });
    D.dosColumnas(s,
      { et: "Error de concepto típico", linea: C.rojo, color: C.rojo, items: ["«Usamos blockchain porque es inmutable y transparente.» Una base de datos con registro de auditoría firmado también lo es, si hay alguien de confianza que la opere.", "Esconder la parte del sistema que es centralizada (el servidor, el administrador del contrato)."] },
      { et: "Lo que convence", items: ["Nombrar las partes que no confían entre sí y por qué ninguna puede ser el operador.", "Decir qué parte del proyecto NO necesitaba cadena, y por qué quedó fuera de ella.", "Mostrar quién tiene el rol de administrador y qué puede hacer."] },
      { y: 2.7, h: 2.75, size: 12.5 });
    D.enunciado(s, "«Aquí una base de datos habría bastado, pero esta parte sí necesita la cadena porque…» vale más que jurar que todo es revolucionario.", { y: 5.6, h: 1.1, size: 15, line: C.naranja });
    s.addNotes("Es la tesis del curso aplicada a su propio proyecto. Un equipo que concluye con argumentos que su caso NO necesitaba blockchain y lo explica bien puede sacar 5,0 en Pertinencia; eso es exactamente lo que el curso quiere formar. Lo que se castiga es usar blockchain sin necesidad Y sin darse cuenta (descriptor 'Insuficiente' de la rúbrica). 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · la demo en vivo", titulo: "Lista de chequeo antes de conectar", ic: "pantalla", tituloSize: 28 });
    D.lista(s, [
      "Billetera DEL CURSO con ETH de prueba suficiente para toda la demo, en la red correcta.",
      "El contrato verificado ya abierto en el explorador, en otra pestaña.",
      "La dApp abierta en su URL pública, no en localhost: así se prueba que está desplegada.",
      "Zoom del navegador al 125 % y notificaciones del sistema apagadas.",
      "Un guion: qué botón, qué transacción, qué evento se va a mostrar.",
      "El video de respaldo descargado en el portátil, no solo en la nube.",
    ], { y: 1.9, h: 3.4, size: 13.5, gap: 7 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Nunca en pantalla", x: M, y: 5.45, w: CW, h: 1.25, texto: "La frase semilla, la clave privada o la URL del RPC con su clave. Si hay que importar una cuenta, se hace antes de conectar el proyector. La grabación de la sesión dura más que la billetera de prueba.", size: 12.5 });
    s.addNotes("Qué debe verse para que la demo cuente: 1) la acción en la dApp, 2) la ventana de la billetera con lo que se firma (y que el equipo explique qué se firma: no se firma lo que no se entiende), 3) el estado de la transacción en la interfaz (pendiente, confirmada, error), 4) la transacción o el evento en el explorador. Si se ven los cuatro, la demo cumple. 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · plan B", titulo: "Si la demo falla: la regla de los 2 minutos", ic: "alerta", tituloSize: 26 });
    D.pasos(s, [
      ["Falla algo", "El faucet, el RPC, la red de la sala o la dApp. El equipo lo dice en voz alta y en qué parte falló."],
      ["2 min para recuperar", "Recargar, cambiar de RPC, reconectar la billetera. El cronómetro de la presentación sigue corriendo."],
      ["Se pasa al video", "Si a los 2 minutos no hay demo, se proyecta el video de 3 minutos y se sigue con la parte 4."],
      ["Evidencia en cadena", "Se abre en el explorador la dirección verificada y una transacción real del flujo mostrado."],
    ], { y: 1.9, alto: 0.78, anchoEt: 3.2, size: 12.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Cómo se califica", x: M, y: 5.52, w: CW, h: 1.2, texto: "Si el fallo es de infraestructura externa y la evidencia en cadena existe, el video no resta en Integración. Si el fallo es del código del equipo, cuenta como falla en la demostración. Sin video ni evidencia: descriptor «Insuficiente».", size: 12.5 });
    s.addNotes("Tener el plan B listo es madurez profesional, no una rendición. Distinguir: RPC caído, faucet sin fondos o red de la sala bloqueada = infraestructura externa; revert inesperado, dApp apuntando a otra dirección, ABI desactualizado = código del equipo. En caso de duda, el docente puede pedir que el equipo repita la demo al final de la sesión si sobra tiempo. 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · el temporizador", titulo: "El semáforo: todos ven el mismo reloj", ic: "reloj", tituloSize: 28 });
    const w = (CW - 0.5) / 3;
    luz(s, { x: M, y: 1.95, w, h: 2.55, color: C.verde, tramo: "00:00 – 10:00", nombre: "Verde · adelante", texto: "Partes 1, 2 y la demo. Si a los 10:00 la demo no ha empezado, van tarde." });
    luz(s, { x: M + w + 0.25, y: 1.95, w, h: 2.55, color: "E0A800", colorTexto: C.ocre, tramo: "10:00 – 13:00", nombre: "Amarillo · cerrar", texto: "Terminar la demo y entrar a seguridad. Tarjeta amarilla levantada a los 10:00." });
    luz(s, { x: M + 2 * (w + 0.25), y: 1.95, w, h: 2.55, color: C.rojo, tramo: "13:00 – 15:00", nombre: "Rojo · límites", texto: "Seguridad y límites, y cerrar. A los 15:00 se corta, se haya terminado o no." });
    D.tabla(s, ["momento", "qué se hace"], [
      ["Preguntas · 00:00 – 02:00", "Pregunta del equipo auditor (auditoría cruzada #2) y respuesta."],
      ["Preguntas · 02:00 – 05:00", "Preguntas del docente y, si hay tiempo, del público. A los 05:00 pasa el siguiente equipo."],
    ], { y: 4.8, h: 1.25, colW: [3.6, 8.493], size: 12 });
    D.parrafo(s, "Cronometra un integrante del equipo que presenta dos turnos después; el docente califica y no mira el reloj.", { y: 6.2, h: 0.5, size: 12.5, color: C.ocre });
    s.addNotes("Proyectar un cronómetro grande en una segunda pantalla o en un teléfono visible, y usar tarjetas de color físicas (verde, amarilla, roja). Cortar a los 15:00 es justo con los demás equipos: el que se pasa le quita tiempo al último. Si alguien pregunta por qué tan estricto: en una sustentación profesional o en un pitch el tiempo es parte de la prueba. 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · verificación antes de empezar", titulo: "Pregunta rápida: ¿qué pasa aquí?", ic: "pregunta", tituloSize: 28 });
    D.enunciado(s, "Minuto 7 de la presentación. Al pulsar «Comprar», la dApp muestra un error: el contrato revierte porque el frontend usa la dirección de un despliegue viejo. No hay video. ¿Qué se hace y cómo se califica?", { y: 1.9, h: 2.1, size: 18 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Respuesta esperada", x: M, y: 4.3, w: CW, h: 2.4, texto: "Dos minutos para corregir la dirección y redesplegar el frontend; si no alcanza, se muestra en el explorador el contrato verificado y una transacción real del flujo. Es un fallo del código del equipo, no de infraestructura: cuenta como falla en la demostración (Integración). Sin video, el equipo renunció al plan B. La lección: la dirección del contrato se lee de un solo archivo de configuración, generado por el despliegue.", size: 13 });
    s.addNotes("Pregunta de verificación del bloque A. Pedir la respuesta a mano alzada antes de mostrar la ficha (cubrirla o avanzar la animación verbalmente). Si varios equipos se miran nerviosos, es la señal para que revisen su configuración durante la pausa. 1 minuto.");
  }

  /* ================================================================ B */
  await D.divisor({ letra: "B", titulo: "Sustentaciones y auditoría cruzada #2", sub: "Quince minutos para mostrar, cinco para defender. Y cada equipo, además de presentar, audita a otro con una pregunta que también se califica.", minutos: "130 MINUTOS · PAUSA DE 10 A LA MITAD", ic: "pantalla" });

  {
    const s = await D.lamina({ kicker: "B.1 · el orden del día", titulo: "Orden sorteado y quién audita a quién", ic: "jerarquia", tituloSize: 27 });
    D.tabla(s, ["turno", "equipo que presenta", "equipo auditor", "inicio", "fin"], [
      ["1", "", "", "", ""],
      ["2", "", "", "", ""],
      ["3", "", "", "", ""],
      ["pausa", "10 minutos", "", "", ""],
      ["4", "", "", "", ""],
      ["5", "", "", "", ""],
    ], { y: 1.9, h: 3.4, colW: [1.3, 4.3, 3.2, 1.65, 1.643], size: 12 });
    D.parrafo(s, "Regla de rotación: cada equipo audita al que presenta justo después (ya terminó su propia sustentación); el último turno audita al primero. Si esa pareja ya se auditó en la auditoría #1, se intercambia con el turno siguiente.", { y: 5.5, h: 1.2, size: 13 });
    s.addNotes("Llenar esta tabla a mano (en el tablero o editando en vivo) justo después del sorteo. Horarios con el formato estándar: turno 1 empieza en el minuto 10 de la sesión y cada turno dura 22 minutos (15 + 5 + 2). Si la pareja auditora se conoció desde la Sesión 16 (recomendado: se anunció con el orden provisional), el equipo auditor ya revisó el repositorio y trae preguntas preparadas. 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · auditoría cruzada #2 · la mecánica", titulo: "Cada equipo audita a otro, en voz alta", ic: "lupa", tituloSize: 27 });
    D.pasos(s, [
      ["Antes de la sesión", "El equipo auditor revisa el repositorio del equipo que le tocó: contratos, pruebas, docs/seguridad."],
      ["Trae dos preguntas", "Escritas en la hoja de auditoría. Hace una; la segunda es de reserva si la primera ya fue respondida."],
      ["La formula en voz alta", "Justo al terminar la presentación, en los 2 primeros minutos de preguntas. Máximo 30 segundos."],
      ["Entrega la hoja", "Al docente, con las dos preguntas escritas y la función o archivo al que apuntan."],
    ], { y: 1.9, alto: 0.8, anchoEt: 3.3, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Lo que se califica", x: M, y: 5.6, w: CW, h: 1.12, texto: "La calidad de la PREGUNTA, al equipo que pregunta. No se califica si el otro equipo supo responderla: una pregunta excelente puede no tener respuesta, y eso también es información.", size: 12.5 });
    s.addNotes("Es la continuación de la auditoría cruzada #1 (Sesión 9), ahora oral. Leer código ajeno y encontrar la grieta es una competencia central del RA5. La nota de la pregunta (0 a 5) se registra en la hoja 'Auditoría cruzada #2' de la planilla y entra en el criterio Sustentación y documentación del equipo que pregunta (20 % de ese criterio). ⚠ Esa integración es una decisión de diseño de este material: el plan dice que la pregunta se califica pero no fija su peso. Confirmarla antes de anunciarla. 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · auditoría cruzada #2 · la escala", titulo: "Cómo se califica una pregunta", ic: "voto", tituloSize: 29 });
    D.tabla(s, ["nota", "la pregunta…", "ejemplo"], [
      ["5", "Apunta a una función concreta y a un riesgo real: caso límite, ataque o supuesto de confianza no documentado.", "«Si retirar() se llama dos veces en la misma transacción, ¿qué impide el doble pago?»"],
      ["4", "Es técnica y específica del proyecto, sobre un riesgo que el equipo ya documentó.", "«Ustedes mitigaron la reentrada con un guardia: ¿por qué no bastaba CEI?»"],
      ["3", "Es técnica pero genérica: serviría para cualquier proyecto.", "«¿Qué pasa si hay reentrada?»"],
      ["2", "Es conceptual o de sí/no, sin tocar el código.", "«¿Usaron OpenZeppelin?»"],
      ["1 · 0", "Es trivial o de forma, o no se formuló.", "«¿Cuánto se demoraron?»"],
    ], { y: 1.9, h: 4.45, colW: [1.0, 5.6, 5.493], size: 11.5 });
    D.parrafo(s, "La receta: función concreta + escenario concreto + consecuencia. Una pregunta repetida vale máximo 3.", { y: 6.42, h: 0.4, size: 12.5, color: C.ocre });
    s.addNotes("La misma escala está en material/proyecto/04-entrega-final.pdf (sección de auditoría cruzada) y en la hoja de la planilla. Los ejemplos del nivel 5 y 4 son de un proyecto con retiros de fondos; adaptar el ejemplo si se prefiere uno de los proyectos reales. Error típico del auditor: preguntar algo que ya se respondió en la presentación, o algo de sí/no («¿es seguro su contrato?»). La receta de una buena pregunta: «¿qué pasa si [actor] hace [acción] en [función] cuando [condición]?». Mostrar esta lámina antes del primer turno para subir el nivel desde el principio. 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · la rúbrica, a la vista", titulo: "Con qué se califica el proyecto final", ic: "voto", tituloSize: 27 });
    D.tabla(s, ["criterio", "peso", "excelente (5,0)"], [
      ["Pertinencia", "15 %", "Justifica con rigor por qué blockchain es necesaria; descarta alternativas centralizadas con argumentos."],
      ["Calidad de contratos", "25 %", "Código limpio, modular, estándares bien aplicados, gas optimizado, eventos bien diseñados."],
      ["Pruebas y despliegue", "20 %", "Cobertura ≥ 80 %, casos límite y de reversión probados, despliegue reproducible y verificado."],
      ["Seguridad", "20 %", "Vulnerabilidades documentadas, mitigaciones justificadas, análisis estático sin hallazgos críticos."],
      ["Integración e interfaz", "10 %", "dApp funcional, estados de transacción manejados, UX comprensible para un no experto."],
      ["Sustentación y docs", "10 %", "Claridad, dominio técnico, responde con solvencia; README completo y reproducible."],
    ], { y: 1.9, h: 4.25, colW: [2.9, 1.1, 8.093], size: 11 });
    D.parrafo(s, "Nota = Σ peso × nota del criterio. Descriptores completos (aceptable e insuficiente): 04-entrega-final.pdf.", { y: 6.3, h: 0.45, size: 12.5, color: C.ocre });
    s.addNotes("Rúbrica textual del plan de estudio, sección 8. Ejemplo de cálculo (está en la planilla): 4,5 · 3,8 · 4,0 · 3,5 · 4,2 · 3,8 → 0,675 + 0,95 + 0,8 + 0,7 + 0,42 + 0,38 = 3,925 ≈ 3,9. Nada aquí es sorpresa: son los criterios anunciados desde el anteproyecto (Sesión 6). 1 minuto; luego empieza el turno 1.");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · verificación para el público", titulo: "¿Qué nota tiene esta pregunta?", ic: "pregunta", tituloSize: 29 });
    D.enunciado(s, "El equipo auditor pregunta: «En su contrato de votación, ¿qué impide que alguien transfiera sus tokens a otra cuenta después de votar y vote otra vez?»", { y: 1.9, h: 1.9, size: 18 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Respuesta esperada", x: M, y: 4.1, w: CW, h: 2.6, texto: "Un 5 si el equipo no documentó ese riesgo: nombra un flujo concreto (votar, transferir, votar) y un ataque real, el de la Sesión 15. La respuesta correcta del equipo evaluado sería el mecanismo de instantánea: ERC20Votes cuenta el poder de voto en el bloque en que se creó la propuesta, así que los tokens transferidos después ya no suman. Si el equipo ya lo había explicado en su presentación, la pregunta baja a 4.", size: 13 });
    s.addNotes("Usar esta lámina en la pausa o antes del turno 1 como calibración: que el público vote con los dedos (1 a 5) antes de mostrar la respuesta. Calibra a los auditores con la escala de B.3. 1 minuto.");
  }

  /* ================================================================ C */
  await D.divisor({ letra: "C", titulo: "Cierre del curso", sub: "Qué construyeron, qué aprendieron a preguntar, y hacia dónde seguir si quieren seguir.", minutos: "30 MINUTOS", ic: "bandera" });

  {
    const s = await D.lamina({ kicker: "C.1 · retrospectiva guiada · 12 min", titulo: "Tres tarjetas antes de irse", ic: "taller", tituloSize: 28 });
    D.pasos(s, [
      ["Tarjeta 1 · individual · 3 min", "«En la Sesión 1 creía que blockchain servía para… Hoy creo que sirve para…». Una frase cada una."],
      ["Tarjeta 2 · equipo · 4 min", "La decisión de diseño de su proyecto que cambiarían hoy, y qué la habría evitado antes."],
      ["Tarjeta 3 · anónima · 3 min", "Para el curso: qué empezar a hacer, qué dejar de hacer y qué continuar."],
      ["Ronda · 2 min", "Tres voluntarios leen su tarjeta 1. Las tarjetas 3 se dejan en la caja al salir."],
    ], { y: 1.9, alto: 0.95, anchoEt: 4.0, size: 12.5 });
    D.parrafo(s, "La tarjeta 1 compara al estudiante de la Sesión 1 con el de hoy. Es la mejor medida de lo que dejó el curso.", { y: 6.2, h: 0.5, size: 13, color: C.ocre });
    s.addNotes("Repartir tres tarjetas (o media hoja doblada en tres) a cada estudiante al empezar el bloque C. Tiempos estrictos con el mismo cronómetro de las sustentaciones. La tarjeta 3 es retroalimentación para la siguiente cohorte: recogerla en una caja, sin nombres. Si hay tiempo, leer en voz alta la tarjeta 2 de un equipo: suele ser la lección más útil para todos. 12 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · la tesis del curso, retomada", titulo: "Lo que saben hacer ahora", ic: "grafico", tituloSize: 29 });
    D.lista(s, [
      "Explicar qué problema resuelve una cadena de bloques, y cuándo no hace falta.",
      "Programar, probar, desplegar y verificar contratos con un flujo profesional.",
      "Encontrar vulnerabilidades en código propio y ajeno, y defenderse de ellas.",
      "Construir una dApp completa: contratos, interfaz, almacenamiento, estados de error.",
      "Evaluar una solución con honestidad: costos, límites, regulación colombiana y ética.",
    ], { y: 1.9, h: 3.1, size: 13.5, gap: 8 });
    D.enunciado(s, "La habilidad más valiosa no es escribir Solidity; es saber cuándo NO usar blockchain y defender esa decisión.", { y: 5.2, h: 1.5, size: 19, line: C.naranja });
    s.addNotes("La frase del recuadro es la tesis con la que se abrió la Sesión 1. Leerla despacio. Luego conectar: hoy la vieron aplicada en la parte 1 de cada sustentación. Mencionar los equipos que mejor defendieron su pertinencia, sin dar notas. Este ecosistema está lleno de promesas exageradas y de estafas bien diseñadas: ustedes ahora saben preguntar qué propiedad concreta aporta la cadena y de dónde sale el dinero. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · hacia dónde seguir", titulo: "Cuatro rutas de profundización", ic: "cohete", tituloSize: 28 });
    D.tabla(s, ["ruta", "qué es", "para quién"], [
      ["Seguridad y auditoría", "Encontrar fallos en contratos ajenos, por oficio: auditorías, concursos, recompensas por errores.", "Quien disfrutó la Sesión 9 y la auditoría cruzada."],
      ["Conocimiento cero (ZK)", "Probar que algo es cierto sin revelar el dato. La base de los rollups ZK (Sesión 16).", "Quien disfruta la matemática y la criptografía."],
      ["Infraestructura de protocolo", "Construir los clientes, el consenso y las L2, no aplicaciones encima.", "Quien disfrutó las Sesiones 3 a 5 y los sistemas distribuidos."],
      ["Producto Web3", "Diseñar dApps que la gente de verdad use: interfaz, experiencia, integración.", "Quien disfrutó las Sesiones 12 y 13."],
    ], { y: 1.9, h: 3.7, colW: [3.0, 5.6, 3.493], size: 11.5 });
    D.parrafo(s, "Las dos láminas siguientes traen, para cada ruta, recursos gratuitos verificados. Todas las URL abrían en septiembre de 2026.", { y: 5.8, h: 0.8, size: 13, color: C.ocre });
    s.addNotes("Preguntar a mano alzada cuál ruta les llama más; ayuda a saber a quién invitar a un semillero. 2 minutos para las tres láminas de rutas y recursos: no leer las URL, decir que están en el PDF del deck.");
  }

  {
    const s = await D.lamina({ kicker: "C.4 · recursos · seguridad y ZK", titulo: "Por dónde empezar, gratis", ic: "escudo", tituloSize: 29 });
    D.tabla(s, ["ruta", "recurso", "dirección"], [
      ["Seguridad", "Ethernaut completo (lo empezaron en la S9)", "ethernaut.openzeppelin.com"],
      ["Seguridad", "Damn Vulnerable DeFi v4: 18 retos de DeFi", "damnvulnerabledefi.xyz"],
      ["Seguridad", "Cyfrin Updraft: curso de seguridad y auditoría", "updraft.cyfrin.io/courses/security"],
      ["Seguridad", "Secureum: fallas y buenas prácticas", "secureum.substack.com"],
      ["Seguridad", "Solodit: hallazgos reales de auditorías", "solodit.cyfrin.io"],
      ["ZK", "ZKP MOOC de Berkeley (Boneh, Goldwasser, Song)", "zk-learning.org"],
      ["ZK", "Recursos de ZKProof y el ZK Book de RareSkills", "docs.zkproof.org/edu · rareskills.io/zk-book"],
    ], { y: 1.9, h: 4.55, colW: [1.7, 5.4, 4.993], size: 11.5 });
    s.addNotes("URL comprobadas (respuesta 200) en septiembre de 2026. Orden sugerido para seguridad: terminar Ethernaut, luego Damn Vulnerable DeFi (usa Foundry), en paralelo el curso de Cyfrin Updraft; Solodit sirve para leer cómo se redactan hallazgos reales. Para ZK: el MOOC de Berkeley (2023) es la entrada rigurosa; el ZK Book de RareSkills es más práctico. Circom (github.com/iden3/circom) para escribir el primer circuito. 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "C.5 · recursos · protocolo y producto", titulo: "Más rutas, más recursos", ic: "capas", tituloSize: 29 });
    D.tabla(s, ["ruta", "recurso", "dirección"], [
      ["Protocolo", "Protocol Wiki del Ethereum Protocol Fellowship", "epf.wiki"],
      ["Protocolo", "Upgrading Ethereum: el consenso, explicado a fondo", "eth2book.info"],
      ["Producto", "Speedrun Ethereum: retos de dApp de punta a punta", "speedrunethereum.com"],
      ["Producto", "Scaffold-ETH 2: plantilla de dApp", "scaffoldeth.io"],
      ["Todas", "Documentación y tutoriales para desarrolladores", "ethereum.org/es/developers"],
      ["Todas", "Hackatones presenciales y en línea", "ethglobal.com/events"],
    ], { y: 1.9, h: 4.0, colW: [1.7, 5.4, 4.993], size: 11.5 });
    D.parrafo(s, "Un hackatón es la forma más rápida de pasar de este curso a un proyecto real con otros, en un fin de semana.", { y: 6.1, h: 0.6, size: 13, color: C.ocre });
    s.addNotes("URL comprobadas en septiembre de 2026. EPF (Ethereum Protocol Fellowship) publica material de estudio del protocolo y abre cohortes periódicas; su repositorio es github.com/eth-protocol-fellows/protocol-studies. Speedrun Ethereum usa Scaffold-ETH 2: es el paso natural después de la dApp del proyecto. 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "C.6 · certificaciones y comunidades", titulo: "Lo que de verdad abre puertas", ic: "persona", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Certificaciones, con realismo", items: ["En esta industria pesa más lo público que el diploma: un repositorio, hallazgos en concursos de auditoría (Code4rena, CodeHawks, Sherlock), una dApp en uso.", "Si quieren una certificación con examen vigilado: Cyfrin Updraft SSCD+ (desarrollo en Solidity). Es de pago.", "Desconfíen de «certificados blockchain» sin examen práctico."] },
      { et: "Comunidades en Colombia y LatAm", items: ["Ethereum Bogotá (meetup.com/ethereum-bogota): grupo con encuentros presenciales; revisar su agenda.", "ETH Kipu: fundación educativa latinoamericana, en español (ethkipu.org).", "Agenda de eventos y meetups por ciudad: ethereum.org/es/community/events."] },
      { y: 1.9, h: 3.2, size: 12 });
    D.parrafo(s, "Un buen primer paso: presentar el proyecto de este curso en un meetup o en un hackatón.", { y: 5.4, h: 0.6, size: 13, color: C.ocre });
    s.addNotes("Verificado en septiembre de 2026: la certificación SSCD+ figura en updraft.cyfrin.io/certifications (examen vigilado, con verificación de identidad). ⚠ VERIFICAR ANTES DE DICTAR: el precio vigente de SSCD+ y si Ethereum Bogotá tiene eventos próximos (su último evento visible fue en julio de 2025). No se encontró un grupo activo verificable de Ethereum en Medellín: el enlace de meetup.com para Medellín no existe. Si el docente conoce una comunidad local activa, agregarla aquí. Ninguna certificación reemplaza la evidencia pública. 1 minuto.");
  }

  {
    const s = await D.lamina({ kicker: "C.7 · seguir en la universidad", titulo: "Semilleros y trabajo de grado", ic: "libro", tituloSize: 29 });
    D.parrafo(s, "El proyecto de este curso puede ser el comienzo de algo más largo. Tres caminos concretos dentro de la universidad:", { y: 1.9, h: 0.65, size: 14 });
    D.pasos(s, [
      ["Semillero de investigación", "Llevar una de las rutas a un grupo con continuidad: leer artículos, replicar ataques, publicar."],
      ["Trabajo de grado", "Un proyecto de este curso bien acotado puede crecer: más usuarios reales, una auditoría formal, una L2."],
      ["Monitoría o apoyo", "Ayudar en la siguiente cohorte de este curso: nada consolida más que explicarlo."],
    ], { y: 2.7, alto: 0.8, anchoEt: 4.0, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta para trabajo de grado", x: M, y: 5.5, w: CW, h: 1.15, texto: "Un buen tema de grado no es «una dApp de X». Es una pregunta: «¿en qué condiciones conviene una cadena para X, y cuánto cuesta?». Es la tesis del curso, convertida en investigación.", size: 12.5 });
    s.addNotes("⚠ VERIFICAR ANTES DE DICTAR: nombres de los semilleros vigentes de la facultad que acepten temas de blockchain, seguridad o sistemas distribuidos, y el reglamento de trabajo de grado vigente. Completar con los nombres y el contacto antes de la sesión. 2 minutos.");
  }

  const fin = await D.cierre({
    kicker: "Lo que se llevan del curso",
    frase: "Empezamos preguntando qué resuelve blockchain. Terminamos respondiéndolo caso por caso.",
    sub: "Gracias por el semestre. Las notas del proyecto final se publican con la rúbrica diligenciada de cada equipo.",
    proxima: "Blockchain y Web 3.0 · Ingeniería de Sistemas · USB Medellín · fin del curso",
  });
  fin.addNotes("Cerrar agradeciendo el trabajo del semestre. Recordar: las planillas diligenciadas se escanean y cada equipo recibe la suya con la nota por criterio; el ensayo se califica aparte. El proyecto del docente (entradas con reventa controlada) recorrió este mismo camino en paralelo con ellos: mencionarlo como cierre del ciclo. 1 minuto.");

  return D.guardar(path.join(__dirname, "Sesion-17-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
