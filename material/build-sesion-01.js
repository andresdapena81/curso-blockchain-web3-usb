/* =====================================================================
   Blockchain y Web 3.0 — Universidad de San Buenaventura Medellín
   Generador del deck de la Sesión 01
   Identidad: brutalismo digital sobre la paleta institucional de usbmed.edu.co
   ===================================================================== */

const pptxgen = require("pptxgenjs");
const sharp = require("sharp");

/* ---------------------------------------------------------------------
   TOKENS
   --------------------------------------------------------------------- */

const C = {
  naranja:   "F07F06",
  ocre:      "A35604",
  violeta:   "7152E9",
  violetaOs: "5638C9",
  tinta:     "0F0F11",
  tintaSuav: "3A3844",
  gris:      "6F6B80",
  grisClaro: "D9D6E0",
  superf:    "FAF9FB",
  superfAlt: "F2F0F5",
  blanco:    "FFFFFF",
};

const F = {
  display: "Arial Black",
  body:    "Arial",
  mono:    "Courier New",
};

const W = 13.333, H = 7.5;
const M = 0.62;                 // margen lateral
const CW = W - 2 * M;           // ancho de contenido = 12.093

/* Sombra sólida sin desenfoque: el gesto brutalista del sistema.
   Se construye nueva en cada llamada — pptxgenjs muta el objeto. */
const sombra = (color = C.tinta) => ({
  type: "outer", angle: 45, blur: 0, offset: 5, color, opacity: 1,
});

/* ---------------------------------------------------------------------
   ICONOGRAFÍA — mismos trazos que el material HTML
   --------------------------------------------------------------------- */

const ICONOS = {
  cadena:      "M9 12h6M10 8H8a4 4 0 000 8h2M14 8h2a4 4 0 010 8h-2",
  termino:     "M9 4H4v16h5M15 4h5v16h-5M10.5 12h3",
  profundidad: "M12 3 2 8l10 5 10-5-10-5zM2 14l10 5 10-5",
  alerta:      "M12 3 22 20H2zM12 10v4M12 16.5v1",
  docente:     "M3 4h18v12H3zM12 16v4M8 20h8",
  pregunta:    "M4 4h16v12H9l-5 4z",
  libro:       "M4 4h7v16H4zM13 4h7v16h-7z",
  rejilla:     "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  bifurca:     "M2 12h8M10 12 20 6M20 6l-5 1M20 6l-1 5M10 12 20 18M20 18l-5-1M20 18l-1-5",
  escudo:      "M12 3 3 7v5c0 5 4 8 9 9 5-1 9-4 9-9V7z",
  reloj:       "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l4 2",
  fusion:      "M4 4v6a4 4 0 004 4h12M16 10l4 4-4 4",
  bloques:     "M3 8h5v8H3zM11 8h5v8h-5zM19 8h2v8h-2zM8 12h3M16 12h3",
  jerarquia:   "M9 3h6v4H9zM2 17h6v4H2zM16 17h6v4h-6zM12 7v3M5 17v-3h14v3",
  rombo:       "M12 2 22 12 12 22 2 12zM12 8v4M12 15.5v1",
  pantalla:    "M3 4h18v13H3zM10 8l5 2.5-5 2.5zM8 21h8",
  bandera:     "M5 21V4h14l-3 4 3 4H5",
  equis:       "M12 3a9 9 0 100 18 9 9 0 000-18zM8.5 8.5l7 7M15.5 8.5l-7 7",
  lista:       "M3 6h2M8 6h13M3 12h2M8 12h13M3 18h2M8 18h13",
  documento:   "M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7",
  llave:       "M14 7a4 4 0 11-4 4l-7 7v3h3l7-7",
  grafico:     "M3 3v18h18M7 17v-4M12 17V9M17 17v-7",
  taller:      "M3 20v-2a3 3 0 013-3h4a3 3 0 013 3v2M8 5a3 3 0 106 0 3 3 0 00-6 0M16 20v-2a3 3 0 00-1.5-2.6M15.5 5.3a3 3 0 010 5.4",
};

const cacheIconos = {};
async function icono(nombre, color) {
  const clave = nombre + "-" + color;
  if (cacheIconos[clave]) return cacheIconos[clave];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="#${color}" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
      <path d="${ICONOS[nombre]}"/></svg>`;
  const buf = await sharp(Buffer.from(svg)).resize(320, 320).png().toBuffer();
  cacheIconos[clave] = "image/png;base64," + buf.toString("base64");
  return cacheIconos[clave];
}

/* ---------------------------------------------------------------------
   PRIMITIVAS DE COMPOSICIÓN
   --------------------------------------------------------------------- */

let pres, nSlide = 0;

function caja(s, o) {
  s.addShape(pres.ShapeType.rect, {
    x: o.x, y: o.y, w: o.w, h: o.h,
    fill: { color: o.fill || C.blanco },
    line: { color: o.line || C.tinta, width: o.lw === undefined ? 1.75 : o.lw, dashType: o.dash },
    shadow: o.sombra === false ? undefined : sombra(o.sombraColor || C.tinta),
  });
}

function pie(s, oscuro = false) {
  nSlide++;
  const col = oscuro ? "6E6A7C" : C.gris;
  s.addText("SESIÓN 01 · ¿QUÉ PROBLEMA RESUELVE REALMENTE BLOCKCHAIN?", {
    x: M, y: 6.88, w: 9.2, h: 0.3, fontFace: F.mono, fontSize: 8, color: col,
    charSpacing: 1.2, margin: 0, valign: "middle",
  });
  s.addText("USB MEDELLÍN", {
    x: 9.9, y: 6.88, w: 2.0, h: 0.3, fontFace: F.mono, fontSize: 8, color: col,
    charSpacing: 1.2, align: "right", margin: 0, valign: "middle",
  });
  s.addText(String(nSlide).padStart(2, "0"), {
    x: 12.05, y: 6.88, w: 0.66, h: 0.3, fontFace: F.mono, fontSize: 9, bold: true,
    color: oscuro ? C.naranja : C.tinta, align: "right", margin: 0, valign: "middle",
  });
}

/* Cabecera estándar de lámina de contenido */
async function lamina({ kicker, titulo, ic = "bloques", tituloSize = 27 }) {
  const s = pres.addSlide();
  s.background = { color: C.blanco };
  s.addImage({ data: await icono(ic, C.naranja), x: M, y: 0.44, w: 0.3, h: 0.3 });
  s.addText(kicker.toUpperCase(), {
    x: M + 0.44, y: 0.42, w: CW - 0.44, h: 0.34, fontFace: F.mono, fontSize: 9.5,
    color: C.gris, charSpacing: 1.6, margin: 0, valign: "middle",
  });
  s.addText(titulo.toUpperCase(), {
    x: M, y: 0.85, w: CW, h: 0.85, fontFace: F.display, fontSize: tituloSize,
    color: C.tinta, margin: 0, valign: "top", lineSpacingMultiple: 0.92,
  });
  pie(s);
  return s;
}

/* Lámina divisoria oscura */
async function divisor({ letra, titulo, sub, minutos, ic }) {
  const s = pres.addSlide();
  s.background = { color: C.tinta };
  s.addShape(pres.ShapeType.rect, { x: 0, y: 2.45, w: 3.3, h: 2.6, fill: { color: C.naranja }, line: { color: C.naranja, width: 0 } });
  s.addText(letra, {
    x: 0, y: 2.45, w: 3.3, h: 2.6, fontFace: F.display, fontSize: 118,
    color: C.tinta, align: "center", valign: "middle", margin: 0,
  });
  s.addImage({ data: await icono(ic, C.naranja), x: 3.95, y: 2.5, w: 0.36, h: 0.36 });
  s.addText(minutos, {
    x: 4.45, y: 2.47, w: 7.9, h: 0.4, fontFace: F.mono, fontSize: 11,
    color: C.naranja, charSpacing: 1.8, margin: 0, valign: "middle",
  });
  s.addText(titulo.toUpperCase(), {
    x: 3.95, y: 2.98, w: 8.7, h: 1.45, fontFace: F.display, fontSize: 34,
    color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 0.98,
  });
  s.addText(sub, {
    x: 3.95, y: 4.52, w: 8.4, h: 1.15, fontFace: F.body, fontSize: 14,
    color: "B9B4C4", margin: 0, valign: "top", lineSpacingMultiple: 1.25,
  });
  pie(s, true);
  return s;
}

/* Bloque de texto corrido */
function parrafo(s, texto, o = {}) {
  s.addText(texto, {
    x: o.x || M, y: o.y, w: o.w || CW, h: o.h || 1.0,
    fontFace: F.body, fontSize: o.size || 14.5, color: o.color || C.tintaSuav,
    lineSpacingMultiple: o.ls || 1.24, margin: 0, valign: "top", align: o.align,
  });
}

/* Lista con viñetas */
function lista(s, items, o = {}) {
  const arr = items.map((t, i) => {
    const obj = (typeof t === "string") ? { text: t } : t;
    return {
      text: obj.text,
      options: {
        bullet: { code: "25A0", indent: 16 },
        breakLine: i < items.length - 1,
        bold: obj.bold,
        color: obj.color || o.color || C.tintaSuav,
        paraSpaceAfter: o.gap === undefined ? 9 : o.gap,
      },
    };
  });
  s.addText(arr, {
    x: o.x || M, y: o.y, w: o.w || CW, h: o.h || 3.5,
    fontFace: F.body, fontSize: o.size || 14, color: C.tintaSuav,
    lineSpacingMultiple: 1.18, margin: 0, valign: "top",
  });
}

/* Ficha: caja con icono, etiqueta y cuerpo */
async function ficha(s, o) {
  const paleta = {
    termino:     { linea: C.violeta, etiqueta: C.violetaOs, ic: "termino",     fill: C.blanco },
    alerta:      { linea: C.naranja, etiqueta: C.ocre,      ic: "alerta",      fill: C.blanco },
    profundidad: { linea: C.tinta,   etiqueta: C.gris,      ic: "profundidad", fill: C.superfAlt },
    docente:     { linea: C.gris,    etiqueta: C.gris,      ic: "docente",     fill: C.superfAlt, dash: "dash" },
    pregunta:    { linea: C.tinta,   etiqueta: C.tinta,     ic: "pregunta",    fill: C.blanco, lw: 2.75 },
  }[o.tipo];

  caja(s, {
    x: o.x, y: o.y, w: o.w, h: o.h,
    fill: paleta.fill, line: paleta.linea, lw: paleta.lw, dash: paleta.dash,
    sombraColor: o.tipo === "termino" ? C.violeta : (o.tipo === "alerta" ? C.naranja : C.tinta),
    sombra: o.tipo === "profundidad" || o.tipo === "docente" ? false : true,
  });

  s.addImage({ data: await icono(paleta.ic, paleta.etiqueta), x: o.x + 0.26, y: o.y + 0.24, w: 0.26, h: 0.26 });
  s.addText(o.etiqueta.toUpperCase(), {
    x: o.x + 0.62, y: o.y + 0.21, w: o.w - 0.9, h: 0.32, fontFace: F.mono, fontSize: 9.5,
    bold: true, color: paleta.etiqueta, charSpacing: 1.5, margin: 0, valign: "middle",
  });
  return { x: o.x + 0.26, y: o.y + 0.64, w: o.w - 0.52 };
}

/* Definición formal en monoespaciada */
function definicion(s, texto, o) {
  s.addShape(pres.ShapeType.rect, {
    x: o.x, y: o.y, w: o.w, h: o.h,
    fill: { color: C.superfAlt }, line: { color: C.violeta, width: 1 },
  });
  s.addText(texto, {
    x: o.x + 0.18, y: o.y + 0.1, w: o.w - 0.36, h: o.h - 0.2,
    fontFace: F.mono, fontSize: 11, color: C.tintaSuav, lineSpacingMultiple: 1.2,
    margin: 0, valign: "middle",
  });
}

/* Tabla con la retícula del sistema */
function tabla(s, cabecera, filas, o) {
  /* La cabecera lleva altura propia; el resto del alto disponible se reparte
     entre las filas de cuerpo. Sin esto, rowH se aplica también a la cabecera
     y la banda negra empuja el contenido fuera del marco. */
  const hdrH = 0.34;
  const bodyH = ((o.h || 4) - hdrH) / filas.length;
  const rows = [
    cabecera.map(t => ({
      text: t.toUpperCase(),
      options: { fill: { color: C.tinta }, color: C.blanco, bold: true, fontFace: F.mono, fontSize: 9, charSpacing: 1.1, valign: "middle" },
    })),
    ...filas.map((f, i) => f.map((t, j) => ({
      text: t,
      options: {
        fill: { color: i % 2 ? C.superf : C.blanco },
        color: j === 0 ? C.tinta : C.tintaSuav,
        bold: j === 0,
        fontFace: j === 0 ? F.mono : F.body,
        fontSize: o.size || 11,
        valign: "top",
      },
    }))),
  ];
  s.addTable(rows, {
    x: o.x || M, y: o.y, w: o.w || CW, colW: o.colW,
    border: { type: "solid", color: C.grisClaro, pt: 1 },
    rowH: [hdrH, ...filas.map(() => bodyH)], margin: o.margin || [7, 9, 7, 9], autoPage: false,
  });
  s.addShape(pres.ShapeType.rect, {
    x: (o.x || M) - 0.02, y: o.y - 0.02, w: (o.w || CW) + 0.04, h: (o.h || 4) + 0.04,
    fill: { type: "none" }, line: { color: C.tinta, width: 1.75 },
  });
}

/* Cifra grande de apoyo */
function cifra(s, valor, etiqueta, o) {
  caja(s, { x: o.x, y: o.y, w: o.w, h: o.h, fill: o.fill || C.blanco });
  s.addText(valor, {
    x: o.x + 0.2, y: o.y + 0.22, w: o.w - 0.4, h: o.h * 0.46,
    fontFace: F.display, fontSize: o.size || 40, color: o.color || C.naranja, margin: 0, valign: "middle",
  });
  s.addText(etiqueta, {
    x: o.x + 0.2, y: o.y + o.h * 0.58, w: o.w - 0.4, h: o.h * 0.36,
    fontFace: F.body, fontSize: 12, color: C.tintaSuav, margin: 0, valign: "top", lineSpacingMultiple: 1.15,
  });
}

/* Enunciado destacado a toda página */
function enunciado(s, texto, o = {}) {
  caja(s, { x: M, y: o.y || 2.6, w: CW, h: o.h || 1.9, fill: C.blanco, lw: 2.75 });
  s.addText(texto, {
    x: M + 0.42, y: (o.y || 2.6) + 0.24, w: CW - 0.84, h: (o.h || 1.9) - 0.48,
    fontFace: F.display, fontSize: o.size || 22, color: C.tinta,
    lineSpacingMultiple: 1.06, margin: 0, valign: "middle",
  });
}

/* Línea con punta de flecha */
function flecha(s, x1, y1, x2, y2, color = C.tinta, ancho = 1.75) {
  s.addShape(pres.ShapeType.line, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    line: { color, width: ancho, endArrowType: "triangle" },
    flipH: x2 < x1, flipV: y2 < y1,
  });
}
function linea(s, x1, y1, x2, y2, color = C.tinta, ancho = 1.75, dash) {
  s.addShape(pres.ShapeType.line, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    line: { color, width: ancho, dashType: dash },
    flipH: x2 < x1, flipV: y2 < y1,
  });
}

/* Cajita rotulada de diagrama */
function nodo(s, o) {
  caja(s, { x: o.x, y: o.y, w: o.w, h: o.h, fill: o.fill || C.superf, line: o.line || C.tinta, sombra: false });
  s.addText(o.titulo, {
    x: o.x + 0.12, y: o.y + 0.13, w: o.w - 0.24, h: 0.3, fontFace: F.mono, fontSize: 11.5,
    bold: true, color: C.tinta, charSpacing: 1.1, align: o.align || "center", margin: 0, valign: "middle",
  });
  if (o.sub) s.addText(o.sub, {
    x: o.x + 0.12, y: o.y + 0.44, w: o.w - 0.24, h: 0.32, fontFace: F.mono, fontSize: 10,
    color: C.gris, align: o.align || "center", margin: 0, valign: "middle",
  });
}

/* =====================================================================
   CONSTRUCCIÓN DEL DECK
   ===================================================================== */

async function construir() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Universidad de San Buenaventura Medellín";
  pres.title = "Blockchain y Web 3.0 — Sesión 01";
  pres.subject = "¿Qué problema resuelve realmente blockchain?";

  /* ---------- 01 · PORTADA ---------- */
  {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 4.1, h: H, fill: { color: C.naranja }, line: { width: 0 } });
    s.addText("01", {
      x: 0, y: 2.1, w: 4.1, h: 3.0, fontFace: F.display, fontSize: 190,
      color: C.tinta, align: "center", valign: "middle", margin: 0,
    });
    s.addImage({ data: await icono("cadena", C.naranja), x: 4.8, y: 1.28, w: 0.34, h: 0.34 });
    s.addText("UNIDAD I · FUNDAMENTOS DE SISTEMAS DISTRIBUIDOS CONFIABLES", {
      x: 5.26, y: 1.26, w: 7.5, h: 0.38, fontFace: F.mono, fontSize: 10.5,
      color: C.naranja, charSpacing: 1.6, margin: 0, valign: "middle",
    });
    s.addText("¿QUÉ PROBLEMA RESUELVE REALMENTE BLOCKCHAIN?", {
      x: 4.8, y: 1.95, w: 7.95, h: 2.5, fontFace: F.display, fontSize: 43,
      color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 0.95,
    });
    s.addText("Blockchain y Web 3.0 · Ingeniería de Sistemas\nUniversidad de San Buenaventura Medellín", {
      x: 4.8, y: 4.62, w: 7.95, h: 0.8, fontFace: F.body, fontSize: 14.5,
      color: "B9B4C4", margin: 0, valign: "top", lineSpacingMultiple: 1.25,
    });
    const meta = [["180 MIN", "duración"], ["TEÓRICO-\nCONCEPTUAL", "modalidad"], ["NO SE\nREQUIERE", "equipo"], ["NINGUNO", "entregable"]];
    meta.forEach((m, i) => {
      const x = 4.8 + i * 2.0;
      s.addText(m[0], { x, y: 5.72, w: 1.85, h: 0.5, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
      s.addText(m[1].toUpperCase(), { x, y: 6.24, w: 1.85, h: 0.28, fontFace: F.mono, fontSize: 8.5, color: "A39EAF", charSpacing: 1.2, margin: 0, valign: "top" });
    });
    s.addNotes("Presentarse y presentar el curso: 17 sesiones, proyecto integrador en equipos de tres y la regla de oro: nunca dinero real. Hoy es teórica, sin computadores. Lanzar la pregunta del título y dejarla abierta: la sesión entera la responde. 3 minutos.");
    nSlide++;
  }

  /* ---------- 02 · CONVENCIONES ---------- */
  {
    const s = await lamina({ kicker: "Preliminar · cómo leer este material", titulo: "Convenciones del documento", ic: "libro" });
    parrafo(s, "El material funciona a la vez como guion proyectado y como texto de estudio. Todo concepto se explica dentro del propio documento: ninguna sigla ni término técnico exige buscar información en otra parte.", { y: 1.92, h: 0.72 });

    const defs = [
      { tipo: "termino", et: "Ficha de término", tx: "Concepto central con definición formal, origen del nombre y explicación extendida." },
      { tipo: "profundidad", et: "Profundidad", tx: "Material que excede el mínimo evaluable. Opcional en primera lectura." },
      { tipo: "alerta", et: "Alerta", tx: "Seguridad, errores frecuentes y afirmaciones falsas de circulación común. Se leen siempre." },
    ];
    for (let i = 0; i < defs.length; i++) {
      const x = M + (i % 2) * (CW / 2 + 0.12);
      const y = 2.82 + Math.floor(i / 2) * 1.42;
      const r = await ficha(s, { tipo: defs[i].tipo, etiqueta: defs[i].et, x, y, w: CW / 2 - 0.12, h: 1.24 });
      parrafo(s, defs[i].tx, { x: r.x, y: r.y - 0.03, w: r.w, h: 0.55, size: 12.5 });
    }
    parrafo(s, "Las siglas se expanden entre corchetes en el mismo renglón, siempre visibles. Los diagramas no ilustran: cada uno sustituye a un párrafo.", { y: 5.78, h: 0.6, size: 13, color: C.gris });
    s.addNotes("Dedicar dos minutos a esto. El grupo debe reconocer los cuatro tipos de caja antes de que aparezca la primera. Aclarar que las fichas de profundidad no se evalúan salvo que el proyecto del estudiante toque ese tema.");
  }

  /* ---------- 03 · MAPA ---------- */
  {
    const s = await lamina({ kicker: "Preliminar · estructura de los 180 minutos", titulo: "Mapa de la sesión", ic: "rejilla" });
    tabla(s, ["min", "bloque", "contenido"], [
      ["00–10", "Apertura", "Presentación del curso, del proyecto integrador y de la regla de oro: nunca dinero real."],
      ["10–30", "A.1", "El doble gasto: por qué el dinero digital sin intermediario fue un problema abierto treinta años."],
      ["30–45", "A.2", "El tercero de confianza: qué garantiza realmente un banco y cuál es el costo de esa garantía."],
      ["45–60", "A.3", "Los intentos fallidos: DigiCash, Hashcash, b-money, bit gold."],
      ["60–72", "A.4", "2008 y la síntesis: Bitcoin no inventó ninguna pieza; ensambló cinco existentes."],
      ["72–82", "A.5", "Anatomía conceptual: qué es una cadena de bloques en términos de estructuras de datos."],
      ["82–92", "A.6", "Taxonomía de redes y qué significa —y qué no— «Web 3.0»."],
      ["92–105", "A.7", "Cuándo NO usar blockchain. La sección más importante de la sesión."],
      ["105–115", "Pausa", "—"],
      ["115–132", "B.1", "El ecosistema: quién sostiene la red y por qué la descentralización es un vector."],
      ["132–147", "B.2", "Mapa del territorio: Bitcoin, Ethereum, compatibilidad con la EVM y las capas."],
      ["147–160", "B.3", "Adopción real: qué encontró uso sostenido después de quince años y qué no."],
      ["160–172", "B.4", "Taller de casos en grupos de tres. Aplicar el árbol de decisión y defenderlo."],
      ["172–180", "BLOQUE C", "Síntesis, pregunta de la semana y lectura obligatoria para la Sesión 2."],
    ], { y: 1.92, h: 4.8, colW: [1.15, 1.5, 9.443], size: 11, margin: [3, 9, 3, 9] });
    s.addNotes("Las marcas de minuto son referencia de ritmo, no camisa de fuerza. Si el grupo llega sin base de redes, extender A.2 y recortar A.6, que es el más prescindible.");
  }

  /* ---------- 04 · RESULTADOS DE APRENDIZAJE ---------- */
  {
    const s = await lamina({ kicker: "Preliminar · qué se espera al terminar", titulo: "Resultados de aprendizaje", ic: "bandera" });
    tabla(s, ["ra", "resultado de aprendizaje", "nivel", "dónde se evidencia"], [
      ["RA1", "Explicar los fundamentos criptográficos que sustentan la integridad de un registro distribuido.", "Comprender", "Se introduce hoy · se evalúa en el Quiz 1 (S4)"],
      ["RA2", "Comparar arquitecturas y justificar la elección frente a un problema concreto.", "Analizar", "Taller A.7 · Anteproyecto (S6)"],
      ["RA7", "Evaluar críticamente implicaciones económicas, éticas y regulatorias.", "Evaluar", "Discusión A.4 y A.7 · Ensayo final"],
    ], { y: 1.95, h: 2.5, colW: [0.85, 5.6, 1.55, 4.093], rowH: 0.72, size: 12 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Sobre esta sesión", x: M, y: 4.85, w: CW, h: 1.72 });
    parrafo(s, "Esta sesión es íntegramente teórica: sin computadores, sin laboratorio y sin entregable. Su función es construir el modelo mental sobre el que descansa el resto del semestre. La Sesión 2 abre con la demostración en vivo y sigue con el primer laboratorio en máquina.", { x: r.x, y: r.y, w: r.w, h: 0.95, size: 13.5 });
    s.addNotes("Anunciar explícitamente que hoy no se califica nada. Baja la ansiedad del primer día y permite que las preguntas fluyan.");
  }

  /* ---------- 05 · DIVISOR BLOQUE A ---------- */
  (await divisor({ letra: "A", titulo: "El problema y su historia", sub: "Siete secciones encadenadas: del doble gasto a la decisión de no usar blockchain.", minutos: "MIN 10 — 105 · EXPOSICIÓN DIALOGADA", ic: "reloj" })).addNotes("Bloque A, min 10–105: siete secciones encadenadas que terminan en la más importante, cuándo NO usar blockchain (A.7). Anunciar que cada sección cierra con una pregunta para el aula.");

  /* ---------- 06 · A.1 apertura ---------- */
  {
    const s = await lamina({ kicker: "A.1 · min 10–30 · el doble gasto", titulo: "Copiar es gratis. Ese es el problema.", ic: "bifurca", tituloSize: 26 });
    parrafo(s, "Copiar un archivo digital es gratis, instantáneo y perfecto. Esa propiedad —la razón por la cual internet funciona tan bien para distribuir información— es exactamente la razón por la cual el dinero digital fue un problema irresuelto durante décadas.", { y: 1.9, h: 0.95, size: 15 });

    cifra(s, "1 → 2", "Si envío una fotografía, ambos terminamos con la fotografía. Eso es deseable.", { x: M, y: 3.0, w: 3.85, h: 1.75 });
    cifra(s, "$ → $$", "Si el archivo representara un billete, ambos terminaríamos con el billete. El sistema colapsa.", { x: M + 4.12, y: 3.0, w: 3.85, h: 1.75, color: C.ocre });
    cifra(s, "0", "Veces que un bien digital puede transferirse. Solo puede duplicarse.", { x: M + 8.24, y: 3.0, w: 3.85, h: 1.75, color: C.violeta });

    enunciado(s, "El problema no es criptográfico. Con criptografía sabemos, desde los años setenta, probar autoría e integridad. Lo que la criptografía no resuelve por sí sola es el ORDEN.", { y: 5.05, h: 1.45, size: 18 });
    s.addNotes("Si Ana firma dos transferencias válidas de la misma moneda, ambas son criptográficamente impecables. El problema es decidir cuál ocurrió primero, y lograr que todos los participantes coincidan en esa decisión sin consultar a una autoridad. Este es el punto que hay que dejar clavado antes de seguir.");
  }

  /* ---------- 07 · Ficha doble gasto ---------- */
  {
    const s = await lamina({ kicker: "A.1 · ficha de término 01", titulo: "Doble gasto", ic: "termino" });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 01 · doble gasto", x: M, y: 1.9, w: CW, h: 4.6 });
    definicion(s, "DOBLE GASTO (en inglés, double-spending): posibilidad de que una misma unidad de\ndinero digital sea gastada más de una vez, porque el gasto consiste en transmitir\nuna copia de un dato y el emisor conserva el original.", { x: r.x, y: r.y, w: r.w, h: 1.05 });
    parrafo(s, "Es el problema fundacional de todo el campo. Formulado con precisión: en un sistema donde el dinero es información, y la información es perfectamente replicable, ¿cómo se garantiza que quien transfiere una unidad deje efectivamente de poseerla?", { x: r.x, y: r.y + 1.24, w: r.w, h: 0.95, size: 14 });
    parrafo(s, "Nótese que el problema no es criptográfico en su núcleo. Si Ana firma dos transferencias válidas de la misma moneda, ambas son impecables. El reto es decidir cuál ocurrió primero y lograr que todos coincidan en esa decisión sin autoridad central.", { x: r.x, y: r.y + 2.32, w: r.w, h: 0.95, size: 14 });
    s.addNotes("Insistir en la distinción: criptografía resuelve autenticidad e integridad. No resuelve orden ni acuerdo. Esa es la brecha que quedó abierta desde los años ochenta.");
  }

  /* ---------- 08 · El dinero es un registro ---------- */
  {
    const s = await lamina({ kicker: "A.1 · reencuadre del problema", titulo: "El dinero no es un objeto: es un registro", ic: "lista", tituloSize: 25 });
    parrafo(s, "Tendemos a pensar el dinero como una cosa que pasa de mano en mano. Pero en el sistema financiero moderno la enorme mayoría del dinero no existe como objeto: existe como una anotación en un libro contable.", { y: 1.88, h: 0.78 });

    caja(s, { x: M, y: 2.82, w: CW, h: 1.28, fill: C.superf });
    parrafo(s, "Cuando alguien transfiere cien mil pesos entre bancos, ningún objeto viaja. Un banco resta cien mil de un renglón, otro banco suma cien mil en otro renglón, y ambos concilian a través de un tercero.  El dinero ES el registro. No hay nada más.", { x: M + 0.34, y: 3.06, w: CW - 0.68, h: 0.85, size: 14.5 });

    enunciado(s, "La pregunta deja de ser «¿cómo hago único un objeto digital?» —que no tiene solución— y pasa a ser «¿cómo construyo un libro contable en el que todos confíen, sin que nadie sea dueño del libro?»", { y: 4.4, h: 2.05, size: 19 });
    s.addNotes("Este reencuadre es la bisagra de toda la sesión. La segunda pregunta sí tiene solución, y esa solución es el objeto de estudio del curso completo. Si el grupo no cruza este puente, el resto no se sostiene.");
  }

  /* ---------- 09 · Ficha libro mayor / DLT ---------- */
  {
    const s = await lamina({ kicker: "A.1 · ficha de término 02", titulo: "Libro mayor y DLT", ic: "termino" });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 02 · libro mayor / ledger", x: M, y: 1.9, w: CW, h: 4.6 });
    definicion(s, "LIBRO MAYOR (en inglés, ledger): registro ordenado y acumulativo de todas las\ntransacciones de un sistema, a partir del cual se puede derivar el estado actual\n—los saldos— de cada participante.", { x: r.x, y: r.y, w: r.w, h: 1.05 });
    parrafo(s, "El término viene de la contabilidad de partida doble, formalizada por Luca Pacioli en 1494. No se almacenan los saldos: se almacenan los movimientos, y el saldo se calcula sumándolos desde el inicio. Eso permite auditar, porque cada peso tiene una historia rastreable.", { x: r.x, y: r.y + 1.22, w: r.w, h: 0.95, size: 14 });
    s.addText([
      { text: "DLT ", options: { fontFace: F.mono, bold: true, color: C.tinta, fontSize: 14 } },
      { text: "[Distributed Ledger Technology · tecnología de libro mayor distribuido] ", options: { fontFace: F.mono, color: C.violetaOs, fontSize: 12 } },
      { text: "es el término técnico y neutral que engloba a blockchain y a otras estructuras similares. Toda blockchain es un DLT; no todo DLT es una blockchain, porque algunos no agrupan las transacciones en bloques encadenados.", options: { fontFace: F.body, color: C.tintaSuav, fontSize: 14 } },
    ], { x: r.x, y: r.y + 2.35, w: r.w, h: 1.1, lineSpacingMultiple: 1.24, margin: 0, valign: "top" });
    s.addNotes("Señalar que DLT es el término que aparece en documentos regulatorios y de banca central, donde «blockchain» se evita por su carga de mercadeo.");
  }

  /* ---------- 10 · Cómo se ve un doble gasto ---------- */
  {
    const s = await lamina({ kicker: "A.1 · el ataque, paso a paso", titulo: "Cómo se ve concretamente un doble gasto", ic: "bifurca", tituloSize: 25 });
    parrafo(s, "Sistema ingenuo: cada usuario tiene un par de claves y una transferencia es un mensaje firmado que se difunde por la red. Ana puede hacer lo siguiente.", { y: 1.88, h: 0.55, size: 13.5, color: C.gris });
    const pasos = [
      ["01", "Firma «M → Bruno» y lo envía solo a Bruno y a los nodos cercanos a Bruno."],
      ["02", "En el mismo instante firma «M → Carlos» y lo envía solo a Carlos y a los nodos cercanos a él."],
      ["03", "Bruno verifica la firma: válida. Ve la moneda M en su copia del libro. Entrega la mercancía."],
      ["04", "Carlos hace exactamente lo mismo. También entrega la mercancía."],
      ["05", "Al propagarse ambos mensajes existen dos versiones incompatibles del libro. Alguien fue estafado y no hay criterio para decidir quién."],
    ];
    pasos.forEach((p, i) => {
      const y = 2.56 + i * 0.79;
      s.addText(p[0], { x: M, y, w: 0.78, h: 0.62, fontFace: F.display, fontSize: 24, color: C.naranja, margin: 0, valign: "middle" });
      parrafo(s, p[1], { x: M + 0.85, y: y + 0.04, w: CW - 0.85, h: 0.62, size: 13.5 });
      linea(s, M, y - 0.09, M + CW, y - 0.09, C.grisClaro, 1);
    });
    linea(s, M, 2.47 + 5 * 0.79, M + CW, 2.47 + 5 * 0.79, C.grisClaro, 1);
    s.addNotes("Lo esencial: NINGÚN componente falló. Las firmas eran válidas, los mensajes íntegros, los nodos honestos. El fallo es arquitectónico: falta un mecanismo para establecer un orden único y global.");
  }

  /* ---------- 11 · DIAGRAMA doble gasto ---------- */
  {
    const s = await lamina({ kicker: "A.1 · figura 1", titulo: "El doble gasto no rompe la criptografía: rompe el orden", ic: "bifurca", tituloSize: 22 });

    s.addText("TX 1 · FIRMADA POR ANA · M → BRUNO", { x: 3.8, y: 1.82, w: 5, h: 0.24, fontFace: F.mono, fontSize: 9.5, color: C.gris, charSpacing: 1, margin: 0, valign: "middle" });
    nodo(s, { x: 3.8, y: 2.1, w: 2.1, h: 0.95, titulo: "BRUNO", sub: "verifica y entrega" });
    flecha(s, 5.9, 2.575, 6.42, 2.575);
    nodo(s, { x: 6.5, y: 2.1, w: 6.21, h: 0.95, titulo: "LIBRO DE LA MITAD A DE LA RED", sub: "M pertenece a Bruno" });

    nodo(s, { x: M, y: 3.6, w: 2.0, h: 0.95, titulo: "ANA", sub: "posee la moneda M" });
    linea(s, 2.62, 4.075, 3.05, 4.075);
    linea(s, 3.05, 2.575, 3.05, 5.555);
    flecha(s, 3.05, 2.575, 3.72, 2.575);
    flecha(s, 3.05, 5.555, 3.72, 5.555);

    caja(s, { x: 3.8, y: 3.6, w: 8.91, h: 0.95, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("LAS DOS TRANSACCIONES SON VÁLIDAS", { x: 3.95, y: 3.72, w: 8.6, h: 0.32, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.ocre, charSpacing: 1.2, align: "center", margin: 0, valign: "middle" });
    s.addText("ninguna es fraude; el sistema no tiene criterio interno para ordenarlas", { x: 3.95, y: 4.06, w: 8.6, h: 0.32, fontFace: F.mono, fontSize: 10, color: C.gris, align: "center", margin: 0, valign: "middle" });

    s.addText("TX 2 · FIRMADA POR ANA · M → CARLOS", { x: 3.8, y: 4.8, w: 5, h: 0.24, fontFace: F.mono, fontSize: 9.5, color: C.gris, charSpacing: 1, margin: 0, valign: "middle" });
    nodo(s, { x: 3.8, y: 5.08, w: 2.1, h: 0.95, titulo: "CARLOS", sub: "verifica y entrega" });
    flecha(s, 5.9, 5.555, 6.42, 5.555);
    nodo(s, { x: 6.5, y: 5.08, w: 6.21, h: 0.95, titulo: "LIBRO DE LA MITAD B DE LA RED", sub: "M pertenece a Carlos" });

    s.addText("Fig. 1", { x: M, y: 6.3, w: 2, h: 0.26, fontFace: F.mono, fontSize: 9, color: C.gris, charSpacing: 1.2, margin: 0, valign: "middle" });
    s.addNotes("Recorrer el diagrama de izquierda a derecha. El punto es la caja naranja del centro: ambas ramas son legítimas por separado y solo entran en conflicto cuando la red intenta unificarlas.");
  }

  /* ---------- 12 · Profundidad sistemas distribuidos ---------- */
  {
    const s = await lamina({ kicker: "A.1 · profundidad", titulo: "Conexión con Sistemas Distribuidos", ic: "profundidad" });
    const r = await ficha(s, { tipo: "profundidad", etiqueta: "Profundidad · no evaluable", x: M, y: 1.9, w: CW, h: 2.05 });
    parrafo(s, "Este es el problema del orden total de eventos en ausencia de un reloj global, tratado por Leslie Lamport en «Time, Clocks, and the Ordering of Events in a Distributed System» (1978). Blockchain no es un tema nuevo desconectado de la carrera: es una solución particular a un problema que la disciplina lleva medio siglo estudiando.", { x: r.x, y: r.y, w: r.w, h: 1.1, size: 13.5 });

    parrafo(s, "La diferencia crítica está en el modelo de fallas", { y: 4.2, h: 0.32, size: 13, color: C.gris });
    caja(s, { x: M, y: 4.6, w: CW / 2 - 0.12, h: 1.55, fill: C.blanco });
    s.addText("FALLAS POR CAÍDA", { x: M + 0.28, y: 4.78, w: CW / 2 - 0.68, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.gris, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Paxos, Raft. Un nodo puede apagarse o perder mensajes, pero si responde, responde honestamente.", { x: M + 0.28, y: 5.14, w: CW / 2 - 0.68, h: 0.85, size: 13 });
    caja(s, { x: M + CW / 2 + 0.12, y: 4.6, w: CW / 2 - 0.12, h: 1.55, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("FALLAS BIZANTINAS", { x: M + CW / 2 + 0.4, y: 4.78, w: CW / 2 - 0.68, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Blockchain. Un nodo puede mentir activamente, coludirse con otros y tener incentivos económicos para hacerlo.", { x: M + CW / 2 + 0.4, y: 5.14, w: CW / 2 - 0.68, h: 0.85, size: 13 });
    s.addNotes("Ese endurecimiento del modelo de fallas es lo que hace el problema difícil. Se formaliza en la Sesión 4 con el problema de los generales bizantinos (Lamport, Shostak y Pease, 1982).");
  }

  /* ---------- 13 · Pregunta al aula ---------- */
  {
    const s = await lamina({ kicker: "A.1 · cierre · discusión abierta", titulo: "Pregunta para el aula", ic: "pregunta" });
    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Discusión · 3 minutos", x: M, y: 2.15, w: CW, h: 2.5 });
    s.addText("Si el problema es lograr que todos coincidan en el orden de los eventos, ¿por qué no basta con poner un servidor que reciba todo y decida el orden?", {
      x: r.x + 0.2, y: r.y + 0.05, w: r.w - 0.4, h: 1.2, fontFace: F.display, fontSize: 21, color: C.tinta, lineSpacingMultiple: 1.08, margin: 0, valign: "top",
    });
    parrafo(s, "¿Qué se gana y qué se pierde con esa decisión?", { x: r.x + 0.2, y: r.y + 1.35, w: r.w - 0.4, h: 0.4, size: 15, color: C.gris });
    parrafo(s, "Recoger tres respuestas antes de pasar a A.2. La respuesta correcta —que sí basta— es la que abre la sección siguiente.", { y: 5.1, h: 0.5, size: 13, color: C.gris });
    s.addNotes("No corregir todavía. Dejar que el grupo llegue solo a que sí funciona, y que la objeción no es técnica sino de poder y de dependencia.");
  }

  /* ---------- 14 · A.2 tercero de confianza ---------- */
  {
    const s = await lamina({ kicker: "A.2 · min 30–45 · el tercero de confianza", titulo: "La solución que ya usamos hace siglos", ic: "escudo", tituloSize: 26 });
    parrafo(s, "Sí basta con poner un servidor. Esa es la solución que la humanidad usa desde hace siglos: se llama banco. Es importante entender que esta solución funciona bien, porque el discurso entusiasta del sector suele presentarla como si estuviera rota, y no lo está.", { y: 1.9, h: 0.85 });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 03 · tercero de confianza", x: M, y: 2.95, w: CW, h: 3.4 });
    definicion(s, "TERCERO DE CONFIANZA (trusted third party, TTP): entidad en la que dos partes que\nno confían entre sí delegan la verificación y el registro de una transacción,\nporque ambas confían en ella.", { x: r.x, y: r.y, w: r.w, h: 1.05 });
    parrafo(s, "Un banco, una cámara de compensación, una notaría, una autoridad certificadora y una plataforma de pagos son todos terceros de confianza. Resuelven el doble gasto de la forma más simple posible: hay una sola copia autorizada del libro —la del tercero— y si dos transacciones entran en conflicto, el tercero decide.", { x: r.x, y: r.y + 1.24, w: r.w, h: 1.0, size: 14 });
    s.addNotes("Marcar el tono: esta sección no es un ataque a la banca. Es un análisis de qué garantiza y qué cuesta. El estudiante que sale de aquí creyendo que los bancos están rotos no entendió la sesión.");
  }

  /* ---------- 15 · Qué garantiza ---------- */
  {
    const s = await lamina({ kicker: "A.2 · el lado positivo", titulo: "Qué garantiza realmente un tercero de confianza", ic: "escudo", tituloSize: 24 });
    const items = [
      ["ORDEN", "Al haber un único punto de escritura no hay ambigüedad sobre qué ocurrió primero. El doble gasto es imposible por construcción."],
      ["REVERSIBILIDAD", "Si hay fraude o error, existe una autoridad que puede revertir la operación. Las cadenas públicas pierden esta propiedad por completo."],
      ["IDENTIDAD Y CUMPLIMIENTO", "El tercero sabe quién es cada parte. Permite aplicar KYC [conozca a su cliente] y AML [antilavado de activos], y responder ante un juez."],
      ["EFICIENCIA", "Varios órdenes de magnitud más rápido y barato por transacción. No es una limitación temporal: es consecuencia de replicar y verificar en miles de nodos."],
    ];
    items.forEach((it, i) => {
      const x = M + (i % 2) * (CW / 2 + 0.12);
      const y = 1.95 + Math.floor(i / 2) * 2.42;
      caja(s, { x, y, w: CW / 2 - 0.12, h: 2.18, fill: C.blanco });
      s.addText(it[0], { x: x + 0.3, y: y + 0.26, w: CW / 2 - 0.72, h: 0.34, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.ocre, charSpacing: 1.4, margin: 0, valign: "middle" });
      parrafo(s, it[1], { x: x + 0.3, y: y + 0.72, w: CW / 2 - 0.72, h: 1.25, size: 13.5 });
    });
    s.addNotes("La reversibilidad es la que más cuesta aceptar a los entusiastas. Insistir: poder revertir un fraude es una propiedad valiosa, y renunciar a ella tiene que estar justificado.");
  }

  /* ---------- 16 · Qué cuesta ---------- */
  {
    const s = await lamina({ kicker: "A.2 · el precio de esas garantías", titulo: "Qué cuesta: cuatro riesgos estructurales", ic: "alerta", tituloSize: 25 });
    parrafo(s, "El tercero debe ser confiable, permanentemente y para todos. Eso implica riesgos que no se eliminan con mejor ingeniería, porque son propiedades del modelo.", { y: 1.9, h: 0.55, size: 13.5, color: C.gris });
    const items = [
      ["PUNTO ÚNICO DE FALLA", "SPOF [Single Point Of Failure]. Si el tercero cae, se corrompe o es capturado, el sistema entero cae con él."],
      ["PODER DE EXCLUSIÓN", "Decide quién participa. Puede negar el servicio, congelar fondos o excluir a una población entera. No es hipotético: es la experiencia de la población no bancarizada."],
      ["PODER DE CENSURA", "Puede negarse a procesar una transacción concreta entre dos partes que sí quieren realizarla."],
      ["OPACIDAD", "El usuario no puede auditar el libro. Debe creer en el saldo que le muestran. Los grandes fraudes contables del último siglo consistieron exactamente en esto."],
    ];
    items.forEach((it, i) => {
      const y = 2.6 + i * 1.06;
      s.addText(it[0], { x: M, y, w: 3.3, h: 0.38, fontFace: F.mono, fontSize: 11, bold: true, color: C.tinta, charSpacing: 1.3, margin: 0, valign: "top" });
      parrafo(s, it[1], { x: M + 3.5, y: y - 0.02, w: CW - 3.5, h: 0.9, size: 13.5 });
      linea(s, M, y - 0.14, M + CW, y - 0.14, C.grisClaro, 1);
    });
    linea(s, M, 2.46 + 4 * 1.06, M + CW, 2.46 + 4 * 1.06, C.grisClaro, 1);
    s.addNotes("Enfatizar que ninguno de estos cuatro se arregla con mejor software. Son consecuencias de la topología, no de la implementación.");
  }

  /* ---------- 17 · El aporte real + trustless ---------- */
  {
    const s = await lamina({ kicker: "A.2 · el aporte real, sin entusiasmo", titulo: "Cambiar confiar en una entidad por verificar un mecanismo", ic: "escudo", tituloSize: 23 });
    enunciado(s, "Blockchain ofrece un conjunto de garantías distinto, a un costo distinto. No es mejor en abstracto. Es mejor cuando y solo cuando el costo de confiar en un tercero supera el costo enorme de replicar y verificar todo en una red abierta.", { y: 1.9, h: 1.85, size: 18 });

    const r = await ficha(s, { tipo: "alerta", etiqueta: "Alerta conceptual · «sin confianza» es una mala traducción", x: M, y: 4.0, w: CW, h: 2.45 });
    parrafo(s, "Un sistema trustless SÍ requiere confianza; solo la traslada. Hay que confiar en la matemática de las funciones criptográficas, en la corrección del código del cliente, en que la mayoría del poder de la red no está coludida y en que el contrato con el que se interactúa no tiene puerta trasera.", { x: r.x, y: r.y, w: r.w, h: 0.95, size: 13.5 });
    parrafo(s, "La traducción honesta es «que no exige confiar en una contraparte identificada», o mejor: minimizado en confianza. Quien cree que no confía en nada, no audita nada — y ese es el perfil de la víctima típica de una estafa cripto.", { x: r.x, y: r.y + 1.02, w: r.w, h: 0.85, size: 13.5, color: C.tinta });
    s.addNotes("Determinar cuándo se cumple esa condición es la competencia profesional que el curso busca formar. Vuelve en A.7 como árbol de decisión y en la rúbrica del proyecto como criterio de pertinencia.");
  }

  /* ---------- 18 · A.3 cypherpunk ---------- */
  {
    const s = await lamina({ kicker: "A.3 · min 45–60 · genealogía técnica", titulo: "Treinta años de intentos fallidos", ic: "reloj" });
    parrafo(s, "Bitcoin no apareció de la nada en 2008. Fue el resultado de una tradición de investigación que se puede fechar con precisión y cuyos fracasos son más instructivos que el éxito final, porque cada uno aisló una pieza del problema.", { y: 1.9, h: 0.78 });
    caja(s, { x: M, y: 2.85, w: CW, h: 1.6, fill: C.superf });
    s.addText("CYPHERPUNK", { x: M + 0.34, y: 3.05, w: 3, h: 0.34, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.ocre, charSpacing: 1.4, margin: 0, valign: "middle" });
    parrafo(s, "Movimiento de criptógrafos, matemáticos y activistas que desde finales de los ochenta sostuvo que la criptografía fuerte, en manos de individuos, era condición necesaria para la privacidad en una sociedad digital. Su lista de correo fue el laboratorio donde se discutieron casi todas las ideas que hoy estudiamos.", { x: M + 0.34, y: 3.44, w: CW - 0.68, h: 0.9, size: 13.5 });
    enunciado(s, "El patrón que se repite: o la propuesta tenía un emisor central y por lo tanto era clausurable, o no tenía emisor central pero no explicaba cómo lograr acuerdo.", { y: 4.75, h: 1.7, size: 19 });
    s.addNotes("Durante veinte años nadie cerró esa brecha. Es importante que el grupo vea la genealogía antes de la tabla: evita la narrativa del genio solitario.");
  }

  /* ---------- 19 · Tabla genealogía I ---------- */
  {
    const s = await lamina({ kicker: "A.3 · la genealogía, primera parte", titulo: "De las firmas ciegas al oro digital", ic: "reloj", tituloSize: 25 });
    tabla(s, ["año", "propuesta", "autor", "aporte conservado", "por qué no bastó"], [
      ["1982", "Firmas ciegas", "David Chaum", "Permite firmar un mensaje sin ver su contenido: base del dinero digital anónimo.", "Es una primitiva criptográfica, no un sistema. No dice nada sobre el orden ni sobre quién lleva el libro."],
      ["1989", "DigiCash / eCash", "David Chaum", "Primer dinero digital con privacidad real puesto en producción.", "El emisor seguía siendo una empresa central. Al quebrar en 1998, el dinero desapareció con ella."],
      ["1996", "e-gold", "Douglas Jackson", "Demostró que existía demanda real y masiva de pagos digitales transfronterizos.", "Centralizado y respaldado en oro físico. Fue cerrado por las autoridades. Ilustra la vulnerabilidad regulatoria del emisor único."],
    ], { y: 1.95, h: 4.4, colW: [0.75, 1.9, 1.55, 3.7, 4.193], rowH: 1.32, size: 11.5 });
    s.addNotes("Chaum es el padre fundador del campo. Su fracaso empresarial no fue técnico: fue de modelo, porque el emisor central era él mismo.");
  }

  /* ---------- 20 · Tabla genealogía II ---------- */
  {
    const s = await lamina({ kicker: "A.3 · la genealogía, segunda parte", titulo: "Las tres piezas que Bitcoin heredó", ic: "reloj", tituloSize: 25 });
    tabla(s, ["año", "propuesta", "autor", "aporte conservado", "por qué no bastó"], [
      ["1997", "Hashcash", "Adam Back", "PRUEBA DE TRABAJO. Obligar al emisor a gastar cómputo verificable. Diseñado contra el correo no deseado.", "Resolvía el costo de emitir, no el registro ni el consenso. Es la pieza que Bitcoin toma casi sin modificar."],
      ["1998", "b-money", "Wei Dai", "Propuso que todos los participantes mantuvieran una copia del libro y que crear dinero costara trabajo computacional.", "Nunca se implementó. No especificaba cómo lograr acuerdo cuando las copias divergieran."],
      ["1998", "bit gold", "Nick Szabo", "Cadenas de pruebas de trabajo encadenadas por hash, con sellado temporal. Muy cercano a lo que vendría.", "Tampoco se implementó, y dependía de un registro de títulos que requería consenso bizantino no resuelto."],
    ], { y: 1.95, h: 4.4, colW: [0.75, 1.9, 1.55, 3.7, 4.193], rowH: 1.32, size: 11.5 });
    s.addNotes("b-money y bit gold llegaron conceptualmente hasta el borde. Lo que les faltó fue exactamente el mecanismo de consenso con incentivos, que es la contribución de 2008.");
  }

  /* ---------- 21 · Ficha PoW ---------- */
  {
    const s = await lamina({ kicker: "A.3 · ficha de término 04", titulo: "Prueba de trabajo", ic: "termino" });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 04 · proof of work (PoW)", x: M, y: 1.9, w: CW, h: 3.05 });
    definicion(s, "PRUEBA DE TRABAJO (Proof of Work, PoW): mecanismo por el cual un participante\ndemuestra que invirtió una cantidad medible de cómputo, mediante un resultado que es\nCOSTOSO DE PRODUCIR y BARATO DE VERIFICAR.", { x: r.x, y: r.y, w: r.w, h: 1.05 });
    parrafo(s, "Esa asimetría es toda la idea. Encontrar la solución exige millones de intentos aleatorios; comprobar que una solución propuesta es correcta exige una sola operación. Así, cualquier participante —incluso con un teléfono— puede verificar el trabajo de una granja industrial en microsegundos.", { x: r.x, y: r.y + 1.22, w: r.w, h: 1.0, size: 14 });

    enunciado(s, "Convierte el derecho a escribir en el libro en algo que cuesta dinero real, y por lo tanto en algo que un atacante no puede acaparar gratuitamente.", { y: 5.2, h: 1.3, size: 19 });
    s.addNotes("Se formaliza en la Sesión 4 y se implementa en la Sesión 3. Hoy basta la intuición de la asimetría costo/verificación.");
  }

  /* ---------- 22 · A.4 2008 ---------- */
  {
    const s = await lamina({ kicker: "A.4 · min 60–72 · la síntesis", titulo: "31 de octubre de 2008", ic: "fusion" });
    parrafo(s, "Alguien que firmaba como Satoshi Nakamoto —seudónimo cuya identidad real sigue sin establecerse— publicó en una lista de correo de criptografía un documento de nueve páginas: «Bitcoin: A Peer-to-Peer Electronic Cash System». El 3 de enero de 2009 se generó el primer bloque de la red.", { y: 1.9, h: 0.95 });

    cifra(s, "9", "Páginas del documento que abrió el campo.", { x: M, y: 3.0, w: 2.85, h: 1.85, size: 46 });
    cifra(s, "2008", "Crisis financiera más grave desde 1929. Los rescates bancarios con dinero público en el centro del debate.", { x: M + 3.1, y: 3.0, w: 4.35, h: 1.85, size: 36, color: C.ocre });
    cifra(s, "0", "Piezas nuevas inventadas. Todas existían ya.", { x: M + 7.7, y: 3.0, w: 4.39, h: 1.85, size: 46, color: C.violeta });

    const r = await ficha(s, { tipo: "profundidad", etiqueta: "El bloque génesis", x: M, y: 5.02, w: CW, h: 1.66 });
    parrafo(s, "En el primer bloque quedó grabado, de forma permanente, el titular de portada de The Times del 3 de enero de 2009 sobre un segundo rescate bancario. Cumple dos funciones: es prueba criptográfica de que el bloque no pudo crearse antes de esa fecha, y es una declaración política inequívoca sobre el objeto del proyecto.", { x: r.x, y: r.y, w: r.w, h: 0.95, size: 13.5 });
    s.addNotes("El contexto no es anecdótico. Explica por qué el diseño prioriza resistencia a la censura y ausencia de emisor por encima del rendimiento.");
  }

  /* ---------- 23 · Las cinco piezas ---------- */
  {
    const s = await lamina({ kicker: "A.4 · la contribución real", titulo: "Bitcoin no inventó ninguna de sus piezas", ic: "fusion", tituloSize: 26 });
    tabla(s, ["pieza", "ya existía desde", "función dentro del sistema", "se ve en"], [
      ["Funciones hash criptográficas", "Años 70–90", "Encadenar bloques y hacer detectable cualquier alteración.", "Sesión 2"],
      ["Firmas digitales de clave pública", "1976 en adelante", "Probar la autoría de una transacción sin revelar la clave privada.", "Sesión 2"],
      ["Árboles de Merkle", "1979", "Resumir miles de transacciones en un único valor verificable.", "Sesión 2"],
      ["Prueba de trabajo (Hashcash)", "1997", "Hacer costoso el derecho a proponer un bloque.", "Sesión 4"],
      ["Redes P2P [peer-to-peer, de par a par]", "Años 90–2000", "Propagar transacciones y bloques sin servidor central.", "Sesión 3"],
    ], { y: 1.95, h: 3.2, colW: [3.5, 1.9, 5.2, 1.493], rowH: 0.53, size: 11.5 });

    enunciado(s, "La pieza genuinamente nueva es la sexta, y no es tecnológica sino económica: un esquema de incentivos que hace que comportarse honestamente sea más rentable que atacar el sistema.", { y: 5.3, h: 1.2, size: 17 });
    s.addNotes("Quien aporta cómputo recibe monedas y comisiones; ese ingreso solo tiene valor si la red conserva credibilidad; atacar la red destruiría el valor de la recompensa que se busca. El atacante racional descubre que atacar le cuesta más de lo que le rinde.");
  }

  /* ---------- 24 · Idea central ---------- */
  {
    const s = await lamina({ kicker: "A.4 · idea central de la sesión", titulo: "Cómo se logró el acuerdo entre desconocidos", ic: "pregunta", tituloSize: 26 });
    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Idea central", x: M, y: 1.95, w: CW, h: 2.1 });
    s.addText("El acuerdo entre desconocidos no se logró con más criptografía. Se logró alineando incentivos económicos con el comportamiento honesto, y usando criptografía para que las trampas fueran DETECTABLES.", {
      x: r.x + 0.2, y: r.y, w: r.w - 0.4, h: 1.2, fontFace: F.display, fontSize: 20, color: C.tinta, lineSpacingMultiple: 1.08, margin: 0, valign: "top",
    });

    const r2 = await ficha(s, { tipo: "profundidad", etiqueta: "Profundidad · por qué esto importa a un ingeniero de software", x: M, y: 4.25, w: CW, h: 2.2 });
    parrafo(s, "Cuando un sistema tiene participantes con intereses propios, el modelo de amenaza debe incluir la racionalidad económica del adversario, no solo sus capacidades técnicas. La seguridad tradicional pregunta «¿puede un atacante hacer X?». El diseño de protocolos económicos pregunta además «¿le conviene?».", { x: r2.x, y: r2.y, w: r2.w, h: 1.35, size: 13.5 });
    s.addNotes("Un sistema puede ser técnicamente vulnerable y en la práctica seguro porque el ataque no es rentable, y puede ser técnicamente sólido y en la práctica quebrado porque un incentivo mal calibrado hace que los honestos abandonen. Vuelve en la Sesión 9 y en la 14.");
  }

  /* ---------- 25 · A.5 definición ---------- */
  {
    const s = await lamina({ kicker: "A.5 · min 72–82 · anatomía conceptual", titulo: "Qué es una cadena de bloques, con precisión", ic: "bloques", tituloSize: 25 });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 05 · blockchain", x: M, y: 1.9, w: CW, h: 1.75 });
    definicion(s, "Lista enlazada, de solo anexado, cuyos nodos —los bloques— agrupan transacciones y\ncontienen el resumen criptográfico del nodo anterior; replicada en una red de pares\nque acuerdan su contenido mediante consenso tolerante a fallas bizantinas.", { x: r.x, y: r.y, w: r.w, h: 1.0 });

    const claves = [
      ["LISTA ENLAZADA", "La estructura de datos que se estudia en segundo semestre. No hay nada exótico."],
      ["DE SOLO ANEXADO", "La única escritura permitida es agregar al final. No existen update ni delete."],
      ["ENLACE POR HASH", "El enlace no es un puntero: es el hash del contenido previo. Alterar un bloque invalida todo lo posterior en cascada."],
      ["REPLICADA EN PARES", "No hay una copia: hay miles. Borrar el dato exigiría alcanzarlas todas simultáneamente."],
      ["CONSENSO BIZANTINO", "El mecanismo por el que esas copias acuerdan la versión válida, aun si parte de los participantes miente."],
    ];
    claves.forEach((k, i) => {
      const y = 3.95 + i * 0.55;
      s.addText(k[0], { x: M, y, w: 3.05, h: 0.4, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.2, margin: 0, valign: "top" });
      parrafo(s, k[1], { x: M + 3.2, y: y - 0.01, w: CW - 3.2, h: 0.5, size: 12.5 });
    });
    s.addNotes("Desarmar la definición cláusula por cláusula. Cada una carga un requisito de diseño, y todas se implementan en la Sesión 3.");
  }

  /* ---------- 26 · Estructura de un bloque ---------- */
  {
    const s = await lamina({ kicker: "A.5 · la carga útil y la cabecera", titulo: "Estructura simplificada de un bloque", ic: "bloques", tituloSize: 26 });
    caja(s, { x: M, y: 1.95, w: 7.0, h: 4.25, fill: C.tinta, line: C.tinta });
    s.addText([
      { text: "// Representación conceptual. Se implementa en la Sesión 3.\n\n", options: { color: "9A95A8" } },
      { text: "Bloque {\n", options: { color: "F4F2F7" } },
      { text: "  cabecera {\n", options: { color: C.naranja } },
      { text: "    hashBloqueAnterior : bytes32   ", options: { color: "F4F2F7" } },
      { text: "// el enlace de la cadena\n", options: { color: "9A95A8" } },
      { text: "    raizDeMerkle       : bytes32   ", options: { color: "F4F2F7" } },
      { text: "// resumen de TODAS las tx\n", options: { color: "9A95A8" } },
      { text: "    marcaDeTiempo      : uint      ", options: { color: "F4F2F7" } },
      { text: "// cuándo se propuso\n", options: { color: "9A95A8" } },
      { text: "    dificultad         : uint      ", options: { color: "F4F2F7" } },
      { text: "// cuán costoso debía ser\n", options: { color: "9A95A8" } },
      { text: "    nonce              : uint      ", options: { color: "F4F2F7" } },
      { text: "// se busca por fuerza bruta\n", options: { color: "9A95A8" } },
      { text: "  }\n", options: { color: C.naranja } },
      { text: "  transacciones", options: { color: C.naranja } },
      { text: ": Transaccion[]   ", options: { color: "F4F2F7" } },
      { text: "// la carga útil\n", options: { color: "9A95A8" } },
      { text: "}", options: { color: "F4F2F7" } },
    ], { x: M + 0.3, y: 2.2, w: 6.4, h: 3.8, fontFace: F.mono, fontSize: 11.5, lineSpacingMultiple: 1.24, margin: 0, valign: "top" });

    const r = await ficha(s, { tipo: "alerta", etiqueta: "Ojo con la palabra «nonce»", x: 7.85, y: 1.95, w: 4.86, h: 4.25 });
    parrafo(s, "NONCE viene de «number used once», número usado una sola vez. Es el campo que se recorre por fuerza bruta hasta que el hash del bloque cumpla la condición de dificultad.", { x: r.x, y: r.y, w: r.w, h: 1.1, size: 13 });
    parrafo(s, "El minero no «resuelve un problema matemático útil». Prueba un nonce, calcula el hash, verifica si empieza con los ceros requeridos y si no, incrementa y repite. Miles de billones de veces por segundo.", { x: r.x, y: r.y + 1.2, w: r.w, h: 1.35, size: 13 });
    parrafo(s, "En Ethereum la misma palabra designa además un contador de transacciones por cuenta, que no tiene nada que ver con el minado. Dos conceptos distintos, un solo nombre.", { x: r.x, y: r.y + 2.52, w: r.w, h: 1.0, size: 12.5, color: C.tinta });
    s.addNotes("La ambigüedad del nonce confunde a todo el mundo en la Sesión 5. Dejarla advertida hoy ahorra media hora entonces.");
  }

  /* ---------- 27 · DIAGRAMA encadenamiento ---------- */
  {
    const s = await lamina({ kicker: "A.5 · figura 2", titulo: "El enlace no es un puntero: es el hash del contenido previo", ic: "bloques", tituloSize: 22 });
    const bw = 3.6, bx = [M, M + 4.25, M + 8.5], by = 2.05, bh = 3.05;
    const datos = [
      ["BLOQUE 120", "0x4c1e…9ab2", "0x8f3a…c41d"],
      ["BLOQUE 121", "0x8f3a…c41d", "0x21b7…0f5e"],
      ["BLOQUE 122", "0x21b7…0f5e", "0x9d02…7e13"],
    ];
    datos.forEach((d, i) => {
      const x = bx[i];
      caja(s, { x, y: by, w: bw, h: bh, fill: C.superf, sombra: false });
      s.addShape(pres.ShapeType.rect, { x, y: by, w: bw, h: 0.42, fill: { color: C.tinta }, line: { color: C.tinta, width: 1.75 } });
      s.addText(d[0], { x: x + 0.18, y: by, w: bw - 0.36, h: 0.42, fontFace: F.mono, fontSize: 11, bold: true, color: C.blanco, charSpacing: 1.3, margin: 0, valign: "middle" });
      const filas = [["HASH ANTERIOR", d[1]], ["TRANSACCIONES", "raíz de Merkle"], ["HASH DE ESTE BLOQUE", d[2]]];
      filas.forEach((f, j) => {
        const fy = by + 0.58 + j * 0.83;
        s.addText(f[0], { x: x + 0.18, y: fy, w: bw - 0.36, h: 0.26, fontFace: F.mono, fontSize: 9, color: C.gris, charSpacing: 1.1, margin: 0, valign: "middle" });
        s.addText(f[1], { x: x + 0.18, y: fy + 0.26, w: bw - 0.36, h: 0.3, fontFace: F.mono, fontSize: 12, color: j === 2 ? C.tinta : C.tintaSuav, bold: j === 2, margin: 0, valign: "middle" });
        if (j < 2) linea(s, x, fy + 0.6, x + bw, fy + 0.6, C.grisClaro, 1);
      });
    });
    [0, 1].forEach(i => {
      const xa = bx[i] + bw, xb = bx[i + 1], mid = xa + 0.32;
      linea(s, xa, 4.72, mid, 4.72);
      linea(s, mid, 4.72, mid, 2.9);
      flecha(s, mid, 2.9, xb, 2.9);
    });
    linea(s, M, 5.5, M + bw, 5.5, C.naranja, 2);
    linea(s, bx[1], 5.5, bx[2] + bw, 5.5, C.naranja, 2);
    s.addText("1 · SE ALTERA UN BYTE AQUÍ", { x: M, y: 5.58, w: bw, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: C.ocre, charSpacing: 1.1, margin: 0, valign: "middle" });
    s.addText("2 · SU HASH CAMBIA Y ROMPE TODOS LOS ENLACES POSTERIORES", { x: bx[1], y: 5.58, w: bw * 2 + 0.65, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: C.ocre, charSpacing: 1.1, margin: 0, valign: "middle" });
    s.addText("Fig. 2", { x: M, y: 6.24, w: 2, h: 0.26, fontFace: F.mono, fontSize: 9, color: C.gris, charSpacing: 1.2, margin: 0, valign: "middle" });
    s.addNotes("Señalar con el cursor que el valor del hash de un bloque aparece literalmente copiado en el campo «hash anterior» del siguiente. Ese es todo el mecanismo. La detección de manipulación es inmediata y no requiere confiar en nadie.");
  }

  /* ---------- 28 · Alerta inmutabilidad ---------- */
  {
    const s = await lamina({ kicker: "A.5 · precisión necesaria", titulo: "Inmutable no significa indestructible", ic: "alerta", tituloSize: 27 });
    const r = await ficha(s, { tipo: "alerta", etiqueta: "Alerta · la inmutabilidad es económica, no física", x: M, y: 1.95, w: CW, h: 2.3 });
    parrafo(s, "Nada impide matemáticamente reescribir la historia. Lo que lo impide es que hacerlo exigiría rehacer la prueba de trabajo de todos los bloques posteriores más rápido de lo que el resto de la red produce bloques nuevos. Es una barrera de costo, no un candado.", { x: r.x, y: r.y, w: r.w, h: 1.2, size: 14 });

    caja(s, { x: M, y: 4.5, w: CW, h: 1.95, fill: C.superf });
    s.addText("CONSECUENCIA PRÁCTICA", { x: M + 0.34, y: 4.72, w: 5, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.gris, charSpacing: 1.4, margin: 0, valign: "middle" });
    parrafo(s, "Un bloque no es definitivo de inmediato. Se vuelve progresivamente más difícil de revertir a medida que se acumulan bloques encima. Por eso los intercambios esperan un número de confirmaciones antes de acreditar un depósito. En la Sesión 3 mediremos experimentalmente ese costo.", { x: M + 0.34, y: 5.1, w: CW - 0.68, h: 1.1, size: 14 });
    s.addNotes("Este es uno de los puntos donde más se exagera en la divulgación. La inmutabilidad es probabilística y creciente, no binaria.");
  }

  /* ---------- 29 · A.6 taxonomía ---------- */
  {
    const s = await lamina({ kicker: "A.6 · min 82–92 · taxonomía", titulo: "«Blockchain» no designa una sola cosa", ic: "jerarquia", tituloSize: 26 });
    parrafo(s, "Designa una familia de arquitecturas con propiedades muy distintas. Confundirlas es el error más común en las propuestas de proyecto, y es un error caro: la mitad de las decisiones de diseño dependen de esta elección. Dos ejes las clasifican: quién puede LEER y quién puede ESCRIBIR.", { y: 1.9, h: 0.78 });
    tabla(s, ["tipo", "lee", "escribe", "confianza requerida", "uso apropiado"], [
      ["Pública sin permiso", "Cualquiera", "Cualquiera", "Mínima. No hay que identificar a nadie.", "Activos de circulación abierta; registros que deben resistir la presión de cualquier gobierno o empresa."],
      ["Pública con permiso", "Cualquiera", "Conjunto autorizado", "En los validadores autorizados.", "Registros públicos estatales donde la transparencia es obligatoria pero la escritura debe ser oficial."],
      ["De consorcio", "Miembros", "Miembros", "En el consorcio como colectivo.", "Trazabilidad entre empresas competidoras que no confían entre sí pero necesitan un registro común."],
      ["Privada", "Una organización", "Una organización", "Total, en el operador.", "Casi siempre: ninguno. Ver la lámina siguiente."],
    ], { y: 3.0, h: 3.3, colW: [2.15, 1.5, 1.75, 2.9, 3.793], rowH: 0.78, size: 11 });
    s.addNotes("Pedir a los estudiantes que, cuando propongan proyecto en la Sesión 6, digan explícitamente en qué fila se ubican y por qué.");
  }

  /* ---------- 30 · Alerta privada ---------- */
  {
    const s = await lamina({ kicker: "A.6 · el caso que hay que saber descartar", titulo: "La blockchain privada de un solo dueño", ic: "alerta", tituloSize: 27 });
    const r = await ficha(s, { tipo: "alerta", etiqueta: "Alerta · casi nunca es la respuesta", x: M, y: 1.95, w: CW, h: 2.5 });
    parrafo(s, "Si una sola organización controla la lectura, la escritura y los nodos, esa organización puede reescribir el registro cuando quiera. Ha construido, con un costo de operación mucho mayor, una base de datos con bitácora de auditoría.", { x: r.x, y: r.y, w: r.w, h: 0.95, size: 14 });
    parrafo(s, "Una base de datos relacional con firmas digitales y registros de solo anexado ofrece las mismas garantías reales, con mejor rendimiento y personal disponible en el mercado laboral.", { x: r.x, y: r.y + 1.0, w: r.w, h: 0.8, size: 14 });

    enunciado(s, "¿Hay más de una parte, con intereses divergentes, que necesita coincidir en un registro común? Si la respuesta es no, no hay caso.", { y: 4.75, h: 1.7, size: 21 });
    s.addNotes("Matizar: el caso de consorcio, con varias organizaciones que NO confían entre sí, es legítimo y frecuente en la industria. Lo que no se sostiene es la cadena privada de dueño único.");
  }

  /* ---------- 31 · Web 1/2/3 ---------- */
  {
    const s = await lamina({ kicker: "A.6 · la promesa Web 3.0", titulo: "Leer, escribir, poseer", ic: "jerarquia" });
    parrafo(s, "El término «Web 3.0» es de mercadeo antes que técnico y conviene tratarlo con la distancia crítica correspondiente. Dicho eso, describe un desplazamiento real en el control de los datos y de la identidad.", { y: 1.9, h: 0.6, size: 13.5, color: C.gris });
    tabla(s, ["etapa", "periodo", "verbo", "quién posee los datos", "modelo de identidad"], [
      ["Web 1.0", "1991–2004", "Leer", "Quien publica el sitio", "Ninguno. Documentos anónimos enlazados."],
      ["Web 2.0", "2004–hoy", "Leer y escribir", "La plataforma que aloja el contenido", "Cuenta en un servidor ajeno: usuario y contraseña que la plataforma puede revocar."],
      ["Web 3.0", "2015–hoy", "Leer, escribir y POSEER", "El usuario, mediante control de claves criptográficas", "Par de claves del usuario. Nadie puede revocarlo, y nadie puede recuperarlo si se pierde."],
    ], { y: 2.65, h: 2.15, colW: [1.25, 1.35, 1.9, 3.3, 4.293], size: 11.5 });

    const r = await ficha(s, { tipo: "profundidad", etiqueta: "La simetría hay que decirla completa", x: M, y: 4.95, w: CW, h: 1.5 });
    parrafo(s, "Si nadie puede quitarle la cuenta al usuario, entonces nadie puede devolvérsela si la pierde. No hay «olvidé mi contraseña». Es la mayor barrera de adopción del modelo, y el motivo de toda una línea de investigación —abstracción de cuentas, Sesión 13—.", { x: r.x, y: r.y, w: r.w, h: 0.8, size: 13.5 });
    s.addNotes("En la Web 2.0 la identidad la otorga un servidor y por lo tanto la puede quitar. En Web3 la identidad es una clave que el usuario genera por su cuenta, sin pedir permiso y sin registro previo. Se ve en vivo en la demostración 1.");
  }

  /* ---------- 32 · Web 3.0 vs Web3 ---------- */
  {
    const s = await lamina({ kicker: "A.6 · precisión terminológica", titulo: "Web 3.0 no es lo mismo que Web3", ic: "profundidad", tituloSize: 27 });
    caja(s, { x: M, y: 2.15, w: CW / 2 - 0.12, h: 2.6, fill: C.superfAlt, sombra: false });
    s.addText("WEB 3.0", { x: M + 0.32, y: 2.42, w: 4, h: 0.42, fontFace: F.display, fontSize: 20, color: C.tinta, margin: 0, valign: "middle" });
    parrafo(s, "En el uso original de Tim Berners-Lee y del W3C [World Wide Web Consortium, organismo de estándares de la web], se refiere a la WEB SEMÁNTICA: datos estructurados y legibles por máquinas mediante ontologías. No tiene relación con blockchain.", { x: M + 0.32, y: 2.95, w: CW / 2 - 0.76, h: 1.6, size: 13.5 });

    caja(s, { x: M + CW / 2 + 0.12, y: 2.15, w: CW / 2 - 0.12, h: 2.6, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("WEB3", { x: M + CW / 2 + 0.44, y: 2.42, w: 4, h: 0.42, fontFace: F.display, fontSize: 20, color: C.violetaOs, margin: 0, valign: "middle" });
    parrafo(s, "Sin punto. Término acuñado hacia 2014 en el entorno de Ethereum para designar la web construida sobre protocolos descentralizados y propiedad criptográfica. Es el sentido que adopta este curso.", { x: M + CW / 2 + 0.44, y: 2.95, w: CW / 2 - 0.76, h: 1.6, size: 13.5 });

    parrafo(s, "En el uso actual de la industria los dos se han fundido. Se señala la distinción porque en la literatura académica anterior a 2015 «Web 3.0» significa otra cosa, y quien cite esas fuentes sin advertirlo cometerá un error.", { y: 5.15, h: 0.9, size: 13.5, color: C.gris });
    s.addNotes("Detalle menor pero útil para trabajos de grado: evita citas mal atribuidas.");
  }

  /* ---------- 33 · A.7 apertura ---------- */
  {
    const s = await lamina({ kicker: "A.7 · min 92–105 · sección crítica", titulo: "Cuándo NO se debe usar blockchain", ic: "rombo", tituloSize: 28 });
    enunciado(s, "Un ingeniero que solo sabe construir con una herramienta la usará para todo. La competencia profesional consiste en saber descartarla con argumentos.", { y: 1.95, h: 1.5, size: 20 });
    parrafo(s, "Esta es la sección más importante de la sesión y la que más pesa en la rúbrica del proyecto.", { y: 3.7, h: 0.4, size: 14.5 });
    caja(s, { x: M, y: 4.25, w: CW, h: 2.15, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("15 %", { x: M + 0.4, y: 4.55, w: 2.2, h: 0.85, fontFace: F.display, fontSize: 46, color: C.naranja, margin: 0, valign: "middle" });
    s.addText("CRITERIO DE PERTINENCIA · RÚBRICA DEL PROYECTO FINAL", { x: M + 2.9, y: 4.58, w: 8.6, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Descriptor de «insuficiente», literal: usa blockchain sin necesidad real; una base de datos resolvería mejor. Conviene tomárselo en serio desde hoy.", { x: M + 2.9, y: 4.98, w: 8.6, h: 0.95, size: 14 });
    s.addNotes("Esta lámina se puede proyectar de nuevo en la Sesión 6, cuando se entreguen los anteproyectos. Es el filtro de alcance.");
  }

  /* ---------- 34 · Árbol I ---------- */
  {
    const s = await lamina({ kicker: "A.7 · árbol de decisión · pasos 1 a 3", titulo: "La primera respuesta que corte, corta", ic: "rombo", tituloSize: 26 });
    const pasos = [
      ["01", "¿Hay más de una parte que escriba en el registro?", "SI NO → use una base de datos. Un registro con un solo escritor no tiene problema de consenso, y el consenso es lo único que blockchain aporta y lo único que cuesta caro."],
      ["02", "¿Esas partes tienen intereses divergentes, al punto de que una podría querer alterar el registro en su favor?", "SI NO → use una base de datos compartida con control de acceso. Entre partes que confían mutuamente, replicar y verificar todo es costo puro sin beneficio."],
      ["03", "¿Existe un tercero de confianza aceptable para todas las partes y disponible en la práctica?", "SI EXISTE → úselo. Es más barato, más rápido y con recurso legal en caso de disputa. Blockchain solo se justifica cuando ese tercero no existe, no es aceptable para todos, o su costo o poder de exclusión son inaceptables."],
    ];
    pasos.forEach((p, i) => {
      const y = 1.95 + i * 1.55;
      s.addText(p[0], { x: M, y: y + 0.05, w: 0.85, h: 0.6, fontFace: F.display, fontSize: 30, color: C.naranja, margin: 0, valign: "top" });
      s.addText(p[1], { x: M + 0.95, y: y, w: CW - 0.95, h: 0.5, fontFace: F.body, fontSize: 15, bold: true, color: C.tinta, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
      parrafo(s, p[2], { x: M + 0.95, y: y + 0.58, w: CW - 0.95, h: 0.8, size: 13 });
      linea(s, M, y - 0.16, M + CW, y - 0.16, C.grisClaro, 1);
    });
    linea(s, M, 1.79 + 3 * 1.55, M + CW, 1.79 + 3 * 1.55, C.grisClaro, 1);
    s.addNotes("Aplicar en orden estricto. La mayoría de las propuestas de proyecto mueren en el paso 1 o en el 3, y eso está bien: descartar con argumento es el aprendizaje.");
  }

  /* ---------- 35 · Árbol II ---------- */
  {
    const s = await lamina({ kicker: "A.7 · árbol de decisión · pasos 4 a 6", titulo: "Datos personales, latencia y el último kilómetro", ic: "rombo", tituloSize: 25 });
    const pasos = [
      ["04", "¿El dato debe ser público, o al menos verificable por terceros?", "SI ES SENSIBLE O PERSONAL → cuidado grave. Lo escrito en una cadena pública es visible para siempre y no se puede borrar. Colisiona con el derecho de supresión de la Ley 1581 de 2012 en Colombia. Si hay que registrarlo, va el HASH del dato, nunca el dato."],
      ["05", "¿El sistema tolera latencia de segundos a minutos y un costo por operación?", "SI NECESITA MILES DE OPERACIONES POR SEGUNDO → la capa base no sirve. Evalúe capa 2 (Sesión 16) o, con honestidad, una arquitectura convencional."],
      ["06", "¿El problema es de registro, o es de captura de datos?", "La trampa más frecuente en trazabilidad. Una cadena garantiza que lo escrito no se alteró después. NO garantiza que fuera cierto. Si alguien registra que un lote es orgánico y no lo es, la cadena preservará esa mentira con integridad perfecta y para siempre."],
    ];
    pasos.forEach((p, i) => {
      const y = 1.95 + i * 1.55;
      s.addText(p[0], { x: M, y: y + 0.05, w: 0.85, h: 0.6, fontFace: F.display, fontSize: 30, color: C.naranja, margin: 0, valign: "top" });
      s.addText(p[1], { x: M + 0.95, y: y, w: CW - 0.95, h: 0.5, fontFace: F.body, fontSize: 15, bold: true, color: C.tinta, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
      parrafo(s, p[2], { x: M + 0.95, y: y + 0.58, w: CW - 0.95, h: 0.85, size: 13 });
      linea(s, M, y - 0.16, M + CW, y - 0.16, C.grisClaro, 1);
    });
    linea(s, M, 1.79 + 3 * 1.55, M + CW, 1.79 + 3 * 1.55, C.grisClaro, 1);
    s.addNotes("El paso 6 es el que más proyectos salva de ser malos. El último kilómetro —la conexión entre el mundo físico y el registro— no lo resuelve la tecnología sino el diseño institucional.");
  }

  /* ---------- 36 · Oráculo ---------- */
  {
    const s = await lamina({ kicker: "A.7 · enunciado desde el primer día", titulo: "El problema del oráculo", ic: "alerta" });
    const r = await ficha(s, { tipo: "alerta", etiqueta: "Alerta · una cadena no tiene acceso al mundo exterior", x: M, y: 1.95, w: CW, h: 2.4 });
    parrafo(s, "No puede consultar el clima, ni un precio, ni si un contenedor llegó al puerto. Toda información externa debe ser introducida por un actor, y ese actor es un punto de confianza que hay que analizar explícitamente.", { x: r.x, y: r.y, w: r.w, h: 0.9, size: 14 });
    parrafo(s, "Cualquier proyecto que dependa de datos del mundo físico debe responder, en el anteproyecto, quién introduce el dato y por qué debemos creerle. La respuesta «lo pone el usuario» es válida solo si se acepta explícitamente que el sistema no verifica la veracidad.", { x: r.x, y: r.y + 0.95, w: r.w, h: 0.9, size: 14 });

    enunciado(s, "La cadena garantiza integridad del registro. No garantiza veracidad del dato registrado.", { y: 4.65, h: 1.35, size: 22 });
    s.addNotes("Se trata a fondo en la Sesión 14 con oráculos descentralizados. Hoy basta con que quede enunciado, porque condiciona los anteproyectos de la Sesión 6.");
  }

  /* ---------- 37 · Números ---------- */
  {
    const s = await lamina({ kicker: "A.7 · para dimensionar el costo", titulo: "Los números, en órdenes de magnitud", ic: "rombo", tituloSize: 26 });
    s.addText([
      { text: "TPS ", options: { fontFace: F.mono, bold: true, color: C.tinta, fontSize: 13 } },
      { text: "[Transactions Per Second · transacciones por segundo]", options: { fontFace: F.mono, color: C.violetaOs, fontSize: 11.5 } },
    ], { x: M, y: 1.88, w: CW, h: 0.3, margin: 0, valign: "middle" });
    tabla(s, ["sistema", "rendimiento aprox.", "latencia hasta liquidación práctica", "costo por operación"], [
      ["Motor de base de datos centralizado", "Decenas de miles a millones", "Milisegundos", "Despreciable"],
      ["Red de tarjetas de pago", "Miles (promedio real)", "Segundos para autorizar; días para liquidar", "Comisión porcentual al comercio"],
      ["Ethereum, capa base", "Orden de decenas", "Decenas de segundos a minutos", "Variable, según congestión"],
      ["Bitcoin, capa base", "Orden de unidades", "Decenas de minutos", "Variable, según congestión"],
      ["Capa 2 sobre Ethereum", "Cientos a miles", "Segundos", "Fracción de la capa base"],
    ], { y: 2.3, h: 3.35, colW: [4.0, 2.6, 3.5, 1.993], size: 11.5 });

    s.addNotes("La tabla sirve para razonar en órdenes de magnitud, que es lo que se necesita para decidir una arquitectura — no como dato duro.");
  }

  /* ---------- 38 · Cierre del bloque A ---------- */
  {
    const s = await lamina({ kicker: "A.7 · cierre del bloque A", titulo: "El árbol no se memoriza: se recorre", ic: "rombo", tituloSize: 26 });
    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Se aplica después de la pausa, en el taller B.4", x: M, y: 1.95, w: CW, h: 1.9 });
    s.addText("No hay que memorizar los seis pasos. Hay que saber recorrerlos con un caso concreto en la mano — que es lo que exigirá el anteproyecto de la Sesión 6.", {
      x: r.x + 0.2, y: r.y, w: r.w - 0.4, h: 1.0, fontFace: F.display, fontSize: 19, color: C.tinta, lineSpacingMultiple: 1.08, margin: 0, valign: "top",
    });

    parrafo(s, "Antes de la pausa, la síntesis del bloque A en tres afirmaciones:", { y: 4.15, h: 0.4, size: 13.5, color: C.gris });
    const tres = [
      ["EL PROBLEMA", "No era criptográfico sino de orden: coincidir en qué ocurrió primero, sin árbitro."],
      ["LA SOLUCIÓN", "No fue más criptografía, sino incentivos económicos alineados con la honestidad."],
      ["EL COSTO", "Rendimiento bajo, irreversibilidad total y todo el registro público para siempre."],
    ];
    tres.forEach((t, i) => {
      const x = M + i * (CW / 3 + 0.06);
      caja(s, { x, y: 4.65, w: CW / 3 - 0.12, h: 1.75, fill: C.blanco });
      s.addText(t[0], { x: x + 0.3, y: 4.9, w: CW / 3 - 0.72, h: 0.34, fontFace: F.mono, fontSize: 11, bold: true, color: C.ocre, charSpacing: 1.4, margin: 0, valign: "middle" });
      parrafo(s, t[1], { x: x + 0.3, y: 5.32, w: CW / 3 - 0.72, h: 0.95, size: 13 });
    });
    s.addNotes("Pausa de 10 minutos al terminar. El bloque B empieza en el minuto 115.");
  }

  /* ---------- 39 · DIVISOR BLOQUE B ---------- */
  (await divisor({ letra: "B", titulo: "Profundización", sub: "Quién sostiene la red, cómo está organizado el territorio y qué demostró la evidencia después de quince años.", minutos: "MIN 115 — 172 · EXPOSICIÓN + TALLER", ic: "profundidad" })).addNotes("Después de la pausa (min 115). Cambio de registro: del porqué histórico a quién sostiene hoy la red, cómo está organizado el territorio y qué demostró la evidencia. Cierra con el taller de casos en grupos de tres.");

  /* ---------- 40 · B.1 apertura ---------- */
  {
    const s = await lamina({ kicker: "B.1 · min 115–132 · el ecosistema", titulo: "Si nadie es dueño, ¿quién opera esto?", ic: "jerarquia", tituloSize: 27 });
    parrafo(s, "En el bloque A quedó establecido que una cadena pública no tiene dueño. Eso plantea de inmediato una pregunta que casi nunca se hace y que es la más importante para evaluar cualquier proyecto.", { y: 1.9, h: 0.7 });
    enunciado(s, "Si nadie es dueño, ¿quién opera esto, con qué recursos y a cambio de qué?", { y: 2.8, h: 1.3, size: 24 });
    parrafo(s, "Responderla es lo que permite distinguir una red genuinamente resistente de una que solo lo parece. Y es la pregunta que un ingeniero debe saber contestar antes de recomendar una arquitectura a un cliente.", { y: 4.35, h: 0.75, size: 14.5 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Hacia dónde va este bloque", x: M, y: 5.25, w: CW, h: 1.2 });
    parrafo(s, "Siete actores, el poder de cada uno, y la conclusión: la descentralización no es una propiedad que se tiene o no se tiene, sino un vector de varias dimensiones que pueden estar en estados opuestos al mismo tiempo.", { x: r.x, y: r.y - 0.06, w: r.w, h: 0.55, size: 12.5 });
    s.addNotes("Esta pregunta cierra el círculo abierto en A.2 —el costo de confiar en un tercero— y en A.6 —la descentralización como variable continua—.");
  }

  /* ---------- 41 · Actores I ---------- */
  {
    const s = await lamina({ kicker: "B.1 · quién sostiene la red · 1 de 2", titulo: "Los actores que producen y verifican", ic: "jerarquia", tituloSize: 26 });
    tabla(s, ["actor", "qué aporta", "qué poder tiene", "qué lo limita"], [
      ["Validadores", "Producen bloques y comprometen capital o cómputo como garantía.", "Deciden qué transacciones entran y EN QUÉ ORDEN. El orden es un poder económico real, no un detalle.", "Los nodos rechazan bloques inválidos. El comportamiento deshonesto probado destruye el capital comprometido."],
      ["Nodos completos", "Verifican de forma independiente cada bloque y conservan una copia íntegra del libro.", "RECHAZAR. Un bloque que viola las reglas no se propaga, sin importar quién lo firmó.", "Nada, salvo el costo de operarlos. Son el contrapeso real del sistema y el más invisible."],
      ["Desarrolladores de protocolo", "Escriben y mantienen el software cliente que todos ejecutan.", "Proponer cambios de reglas y decidir qué se implementa.", "No pueden imponer nada: cada operador decide qué versión ejecuta."],
      ["Usuarios y titulares", "Demanda, uso y valor.", "Poder de salida: vender, migrar o seguir una bifurcación distinta.", "La coordinación es costosa. En la práctica, la mayoría no ejerce este poder."],
    ], { y: 1.95, h: 4.5, colW: [2.5, 3.1, 3.3, 3.193], size: 11 });
    s.addNotes("El poder de ordenar transacciones tiene nombre propio y mercado detrás: se llama MEV y se ve en la lámina de profundidad de este mismo bloque.");
  }

  /* ---------- 42 · Actores II ---------- */
  {
    const s = await lamina({ kicker: "B.1 · quién sostiene la red · 2 de 2", titulo: "Los actores que casi nadie cuenta", ic: "jerarquia", tituloSize: 26 });
    tabla(s, ["actor", "qué aporta", "qué poder tiene", "qué lo limita"], [
      ["Intercambios centralizados", "Liquidez y la puerta de entrada desde el dinero tradicional.", "Enorme y sistemáticamente subestimado: custodian fondos ajenos, controlan el acceso al sistema financiero y, en redes con gobernanza por token, pueden votar con monedas de sus clientes.", "La regulación y la posibilidad de que los usuarios retiren a autocustodia."],
      ["Proveedores de acceso", "Infraestructura de lectura de la cadena para billeteras y aplicaciones.", "Casi todas las billeteras del mundo consultan la cadena a través de un puñado de empresas. Si caen, la red sigue viva pero nadie puede usarla.", "Cualquiera puede correr su propio nodo. Casi nadie lo hace."],
      ["Reguladores", "No participan del protocolo.", "Determinan quién puede operar en la frontera con el dinero tradicional, que es por donde pasa casi toda la utilidad práctica.", "La jurisdicción. Una red global no se apaga desde un solo país, pero sí se puede aislar de su sistema financiero."],
    ], { y: 1.95, h: 4.5, colW: [2.5, 3.1, 3.3, 3.193], size: 11 });
    s.addNotes("Estos tres son los que faltan en casi toda la divulgación, y son justamente donde se concentra el poder real del ecosistema.");
  }

  /* ---------- 43 · Ficha nodo completo / ligero ---------- */
  {
    const s = await lamina({ kicker: "B.1 · ficha de término 07", titulo: "Nodo completo y nodo ligero", ic: "termino", tituloSize: 27 });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 07 · full node / light client", x: M, y: 1.9, w: CW, h: 3.0 });
    definicion(s, "NODO COMPLETO (full node): computador que descarga y verifica por sí mismo todos los\nbloques y transacciones, aplicando las reglas del protocolo sin confiar en nadie.\nNODO LIGERO (light client): programa que no verifica todo, sino que consulta a otros\nnodos y comprueba solo pruebas puntuales.", { x: r.x, y: r.y, w: r.w, h: 1.25 });
    parrafo(s, "La distinción es política además de técnica. Quien corre un nodo completo no le cree a nadie: comprueba. Quien usa un nodo ligero —es decir, prácticamente todo el mundo, porque toda billetera de navegador o de teléfono lo es— confía en que alguien más verificó bien.", { x: r.x, y: r.y + 1.42, w: r.w, h: 1.0, size: 13.5 });

    enunciado(s, "La verificación independiente es lo que hace valioso al sistema, y es justamente lo que casi ningún usuario ejerce.", { y: 5.15, h: 1.3, size: 21 });
    s.addNotes("Esta es la tensión central del ecosistema. Sirve para aterrizar la pregunta del aula que cierra B.1.");
  }

  /* ---------- 44 · Dimensiones ---------- */
  {
    const s = await lamina({ kicker: "B.1 · precisión sobre A.6", titulo: "La descentralización no es una propiedad: es un vector", ic: "rejilla", tituloSize: 24 });
    parrafo(s, "No es una sola variable, sino varias dimensiones independientes que pueden estar en estados opuestos al mismo tiempo. Una red puede ser ejemplar en una y desastrosa en otra.", { y: 1.88, h: 0.5, size: 13.5, color: C.gris });
    tabla(s, ["dimensión", "la pregunta que la mide", "señal de concentración"], [
      ["Consenso", "¿Cuántas entidades independientes producen bloques?", "Unos pocos grupos concentran la mayoría de la capacidad de validación."],
      ["Cliente", "¿Cuántas implementaciones del software existen y se usan?", "Una sola domina: un fallo en ella tumba la red entera."],
      ["Acceso", "¿Por dónde leen la cadena las aplicaciones y las billeteras?", "Casi todo el tráfico pasa por dos o tres proveedores comerciales."],
      ["Capital", "¿Cómo está distribuida la tenencia del activo?", "Un puñado de direcciones controla una fracción decisiva del total."],
      ["Gobernanza", "¿Quién decide los cambios de reglas y cómo?", "Una fundación o un grupo cerrado aprueba sin oposición efectiva."],
      ["Desarrollo", "¿Quién paga a quienes escriben el protocolo?", "Una sola organización financia a la mayoría de los desarrolladores."],
    ], { y: 2.5, h: 3.9, colW: [1.9, 5.1, 5.093], size: 11.5 });
    s.addNotes("Pedir que, en el anteproyecto de la Sesión 6, cada equipo diga en qué dimensiones necesita descentralización y en cuáles no. Casi nunca las necesita todas.");
  }

  /* ---------- 45 · Alerta + MEV ---------- */
  {
    const s = await lamina({ kicker: "B.1 · cierre", titulo: "La descentralización de la base no se hereda hacia arriba", ic: "alerta", tituloSize: 24 });
    const r = await ficha(s, { tipo: "alerta", etiqueta: "Alerta · la situación habitual", x: M, y: 1.9, w: CW, h: 1.6 });
    parrafo(s, "Es perfectamente posible —y es lo normal— que la capa base sea muy descentralizada y la experiencia del usuario esté completamente centralizada: la billetera es de una empresa, lee la cadena a través de otra, el activo se compró en un intercambio custodio y la interfaz web se sirve desde un servidor con dueño.", { x: r.x, y: r.y, w: r.w, h: 1.1, size: 13.5 });

    const r2 = await ficha(s, { tipo: "profundidad", etiqueta: "Profundidad · el poder de ordenar", x: M, y: 3.68, w: CW, h: 1.55 });
    s.addText([
      { text: "MEV ", options: { fontFace: F.mono, bold: true, color: C.tinta, fontSize: 13 } },
      { text: "[Maximal Extractable Value · valor máximo extraíble] ", options: { fontFace: F.mono, color: C.violetaOs, fontSize: 11.5 } },
      { text: "es el beneficio que un productor de bloques obtiene incluyendo, excluyendo o reordenando transacciones. Es una consecuencia estructural, no un fallo: alguien tiene que decidir el orden, y quien decide puede aprovecharlo. Sesiones 9 y 14.", options: { fontFace: F.body, color: C.tintaSuav, fontSize: 13 } },
    ], { x: r2.x, y: r2.y - 0.04, w: r2.w, h: 0.9, lineSpacingMultiple: 1.22, margin: 0, valign: "top" });

    const r3 = await ficha(s, { tipo: "pregunta", etiqueta: "Pregunta para el aula", x: M, y: 5.45, w: CW, h: 1.0 });
    s.addText("Si casi nadie corre un nodo completo, ¿en qué se diferencia el usuario promedio del cliente de un banco?", { x: r3.x, y: r3.y - 0.1, w: r3.w, h: 0.42, fontFace: F.display, fontSize: 14, color: C.tinta, margin: 0, valign: "middle" });
    s.addNotes("Cuando alguien afirme que un sistema «es descentralizado», la pregunta profesional es siempre: ¿en qué dimensión, y comparado con qué?");
  }

  /* ---------- 46 · B.2 Bitcoin vs Ethereum ---------- */
  {
    const s = await lamina({ kicker: "B.2 · min 132–147 · mapa del territorio", titulo: "Bitcoin y Ethereum no compiten por lo mismo", ic: "fusion", tituloSize: 25 });
    parrafo(s, "Existen miles de cadenas, pero por debajo hay muy pocas ideas arquitectónicas distintas. Conocerlas permite ubicar cualquier proyecto nuevo sin estudiarlo desde cero. Uno es dinero; el otro es una plataforma de cómputo.", { y: 1.88, h: 0.5, size: 13.5, color: C.gris });
    tabla(s, ["criterio", "bitcoin", "ethereum"], [
      ["Propósito de diseño", "Ser dinero digital resistente a la censura y a la inflación discrecional.", "Ser una computadora mundial: ejecutar programas con estado compartido y verificable."],
      ["Programación", "Lenguaje deliberadamente limitado, sin bucles. Se condiciona un pago, no se construye una aplicación.", "Lenguaje de propósito general. Cualquier cómputo, con el límite del gas."],
      ["Modelo de estado", "UTXO: el estado son las salidas de transacción no gastadas.", "Cuentas y saldos, como un libro contable convencional."],
      ["Consenso", "Prueba de trabajo.", "Prueba de participación desde 2022."],
      ["Cultura de cambio", "Conservadurismo extremo y deliberado. La estabilidad es la funcionalidad.", "Evolución rápida y planificada, con cambios de protocolo frecuentes."],
      ["Riesgo dominante", "Quedarse corto en funcionalidad frente a otras redes.", "Introducir un fallo al cambiar. Más superficie, más cosas que pueden romperse."],
    ], { y: 2.5, h: 3.9, colW: [2.35, 4.9, 4.843], size: 11.5 });
    s.addNotes("El error de encuadre más común es tratarlos como competidores. Sirven propósitos distintos y sus decisiones de diseño se siguen de ahí.");
  }

  /* ---------- 47 · Turing-completo + EVM ---------- */
  {
    const s = await lamina({ kicker: "B.2 · fichas de término 08 y 09", titulo: "Turing-completo y compatibilidad con la EVM", ic: "termino", tituloSize: 25 });

    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha 08 · Turing-completo", x: M, y: 1.9, w: CW / 2 - 0.12, h: 2.6 });
    parrafo(s, "Sistema de cómputo capaz de expresar cualquier algoritmo calculable, dado tiempo y memoria suficientes. Permite bucles y recursión — incluidos programas que nunca terminan.", { x: r.x, y: r.y, w: r.w, h: 1.1, size: 13 });
    parrafo(s, "En una red donde TODOS los nodos ejecutan el mismo código, un bucle infinito congelaría la red entera.", { x: r.x, y: r.y + 1.15, w: r.w, h: 0.75, size: 12.5, color: C.tinta });

    const r2 = await ficha(s, { tipo: "termino", etiqueta: "Ficha 09 · EVM y compatibilidad", x: M + CW / 2 + 0.12, y: 1.9, w: CW / 2 - 0.12, h: 2.6 });
    parrafo(s, "La máquina virtual de Ethereum es la especificación de la máquina de estados que ejecuta los contratos: qué operaciones existen y cuánto cuesta cada una.", { x: r2.x, y: r2.y, w: r2.w, h: 1.1, size: 13 });
    parrafo(s, "Una red «compatible con la EVM» ejecuta esa misma especificación: el código se transfiere sin reescribirse.", { x: r2.x, y: r2.y + 1.15, w: r2.w, h: 0.75, size: 12.5, color: C.tinta });

    enunciado(s, "La solución de Ethereum es cobrar por cada operación elemental: un programa que no termina se queda sin fondos y aborta. Ese mecanismo se llama GAS y es el centro de la Sesión 5.", { y: 4.7, h: 1.25, size: 17 });

    parrafo(s, "Por eso proliferan las cadenas compatibles: adoptar la EVM permite heredar un ecosistema entero de desarrolladores y de código probado. Lo que se aprende aquí no es una red: es un modelo de cómputo.", { y: 6.12, h: 0.6, size: 12.5, color: C.gris });
    s.addNotes("Este es el argumento de empleabilidad del curso, y conviene decirlo explícitamente.");
  }

  /* ---------- 48 · Capas + por qué Ethereum ---------- */
  {
    const s = await lamina({ kicker: "B.2 · ficha de término 10", titulo: "Capa 1 y capa 2", ic: "bloques", tituloSize: 28 });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 10 · layer 1 / layer 2", x: M, y: 1.9, w: CW, h: 2.75 });
    definicion(s, "CAPA 1 (L1): la cadena base, que provee consenso y seguridad por sí misma.\nCAPA 2 (L2): red construida encima que ejecuta transacciones fuera de la capa base\ny se apoya en ella para la seguridad y la resolución de disputas.", { x: r.x, y: r.y, w: r.w, h: 1.05 });
    parrafo(s, "La motivación viene directamente del trilema de A.4: la capa base no puede ganar escalabilidad sin ceder descentralización o seguridad. La estrategia de las capas 2 es mover la ejecución fuera y dejar en la base solo la verificación, que es mucho más barata. Es la vía de escalado dominante hoy y se estudia en la Sesión 16.", { x: r.x, y: r.y + 1.22, w: r.w, h: 1.05, size: 13.5 });

    const r2 = await ficha(s, { tipo: "pregunta", etiqueta: "Por qué este curso usa Ethereum", x: M, y: 4.85, w: CW, h: 1.6 });
    parrafo(s, "No es una elección ideológica. Es donde están las herramientas maduras y la documentación; sus estándares —sesiones 10 y 11— son los que adoptó el resto de la industria; y el conocimiento se transfiere sin fricción a todas las redes compatibles con la EVM, que son la mayoría de las que un egresado encontrará en el mercado.", { x: r2.x, y: r2.y - 0.04, w: r2.w, h: 0.95, size: 13 });
    s.addNotes("Buena parte de la actividad real ya no ocurre en la capa base. Sin las capas 2 el mapa del territorio queda incompleto.");
  }

  /* ---------- 49 · B.3 lo que prendió ---------- */
  {
    const s = await lamina({ kicker: "B.3 · min 147–160 · adopción real", titulo: "Lo que sí encontró uso sostenido", ic: "grafico", tituloSize: 27 });
    parrafo(s, "Después de más de quince años se puede mirar la evidencia en lugar de la promesa. El método cabe en dos preguntas: ¿qué problema resolvió, y para quién? Si la respuesta exige hablar del futuro, todavía no hay evidencia.", { y: 1.88, h: 0.55, size: 13.5, color: C.gris });
    tabla(s, ["caso", "por qué funcionó"], [
      ["Monedas estables y pagos transfronterizos", "El caso con adopción más medible, con especial peso en economías con alta inflación, controles de capital o infraestructura de pagos costosa. Resuelve un problema que la gente tenía de verdad: mover valor entre países sin depender de una cadena de bancos corresponsales."],
      ["Especulación y mercados de activos digitales", "Hay que decirlo con honestidad intelectual: es el uso dominante en volumen. Un curso serio no lo omite ni lo celebra; lo reconoce como el hecho que financió toda la infraestructura que sí tiene otros usos."],
      ["Tokenización de activos financieros", "Bonos, fondos e instrumentos de deuda emitidos y liquidados sobre cadena. Funciona porque la liquidación entre instituciones que no confían plenamente entre sí es exactamente el problema que resuelve un libro compartido."],
      ["Credenciales y registros verificables", "Adopción lenta pero sostenida. Funciona cuando lo que se ancla es un hash y no el dato, y cuando el emisor ya es confiable: lo que aporta la cadena es verificar sin depender de que el emisor siga existiendo."],
    ], { y: 2.55, h: 3.85, colW: [3.6, 8.493], size: 11.5 });
    s.addNotes("Insistir en la honestidad del segundo renglón. Un curso que oculta que la especulación es el uso dominante pierde credibilidad ante los estudiantes que ya lo saben.");
  }

  /* ---------- 50 · B.3 lo que no prendió ---------- */
  {
    const s = await lamina({ kicker: "B.3 · adopción real", titulo: "Lo que no prendió, y en qué paso del árbol muere", ic: "equis", tituloSize: 25 });
    tabla(s, ["caso", "dónde falla"], [
      ["Trazabilidad genérica de cadena de suministro", "PASO 6. El registro es impecable y el dato de entrada no está verificado. Se invirtió mucho en resolver criptográficamente un problema que era de auditoría física."],
      ["Blockchain empresarial privada", "PASOS 1 Y 2. Una sola organización, o varias que ya confían entre sí y tienen contratos. La ola de pilotos corporativos terminó, en su mayoría, en bases de datos con más pasos."],
      ["Identidad digital universal", "ADOPCIÓN Y RECUPERACIÓN. Técnicamente viable, pero exige que todo un ecosistema adopte el mismo esquema al tiempo, y choca con qué hacer cuando el usuario pierde sus claves."],
      ["Coleccionables digitales como mercado masivo", "EL ACTIVO NO TENÍA LA DEMANDA QUE EL PRECIO SUPONÍA. El mercado especulativo colapsó, pero el estándar técnico sobrevivió y hoy se usa para entradas, credenciales y membresías. La tecnología no fracasó; la tesis de inversión sí."],
    ], { y: 1.95, h: 3.45, colW: [3.9, 8.193], size: 11.5 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "El patrón, en una frase", x: M, y: 5.55, w: CW, h: 1.2 });
    s.addText("Sobrevivieron los casos que necesitaban resistencia a la censura o liquidación sin intermediario. Fracasaron los que solo necesitaban un registro compartido.", { x: r.x, y: r.y - 0.08, w: r.w, h: 0.5, fontFace: F.display, fontSize: 14, color: C.tinta, lineSpacingMultiple: 1.05, margin: 0, valign: "middle" });
    s.addNotes("Cada fila remite a un paso concreto del árbol de A.7. Eso convierte el árbol en una herramienta con respaldo empírico, no en una opinión del docente.");
  }

  /* ---------- 51 · B.3 contexto regional ---------- */
  {
    const s = await lamina({ kicker: "B.3 · cierre", titulo: "Contexto regional", ic: "grafico", tituloSize: 28 });
    const r = await ficha(s, { tipo: "alerta", etiqueta: "Verificar antes de dictar", x: M, y: 2.0, w: CW, h: 2.9 });
    parrafo(s, "América Latina aparece de forma recurrente en las mediciones de adopción minorista de criptoactivos, impulsada por las remesas, por la exposición a la inflación y por una parte significativa de la población con acceso limitado a servicios financieros.", { x: r.x, y: r.y, w: r.w, h: 0.95, size: 13.5 });
    parrafo(s, "En Colombia ha habido actividad regulatoria relevante: pruebas supervisadas de operación entre entidades financieras y plataformas de intercambio, obligaciones de reporte de operaciones y discusión legislativa sobre el régimen aplicable.", { x: r.x, y: r.y + 1.0, w: r.w, h: 0.95, size: 13.5 });

    parrafo(s, "El estado exacto de todo lo anterior cambia con frecuencia. Es material de la Sesión 16 y debe verificarse en fuentes primarias antes de dictarse; aquí se enuncia solo para situar el curso en su contexto y para que los anteproyectos de la Sesión 6 no se diseñen en el vacío.", { y: 5.2, h: 1.0, size: 13.5, color: C.gris });
    s.addNotes("No dar cifras concretas sin fuente y fecha. Si algún estudiante pregunta por números, remitir a la Sesión 16 y al requisito de citar fuente en el proyecto.");
  }

  /* ---------- 52 · B.4 taller ---------- */
  {
    const s = await lamina({ kicker: "B.4 · min 160–172 · taller", titulo: "Taller de casos · grupos de tres", ic: "taller", tituloSize: 27 });
    parrafo(s, "Aplicación directa del árbol de A.7 y del criterio de evidencia de B.3. Es el ensayo del anteproyecto de la Sesión 6: el mismo razonamiento, sobre casos ajenos y sin nota de por medio. Ocho minutos de trabajo, cuatro de plenaria, treinta segundos por grupo.", { y: 1.88, h: 0.7, size: 13.5 });

    parrafo(s, "Tres respuestas, escritas, de una línea cada una", { y: 2.7, h: 0.32, size: 13, color: C.gris });
    const preg = [
      ["01", "¿En qué paso del árbol se corta el caso? Si no se corta en ninguno, decirlo y justificar por qué sobrevive los seis."],
      ["02", "Si sobrevive: ¿qué actor introduce los datos y por qué habría que creerle? Es la pregunta del oráculo, y no admite «el sistema lo verifica»."],
      ["03", "¿Qué arquitectura corresponde —pública, de consorcio, permisionada— y por qué? Usar la taxonomía de A.6."],
    ];
    preg.forEach((p, i) => {
      const y = 3.15 + i * 0.72;
      s.addText(p[0], { x: M, y: y + 0.02, w: 0.6, h: 0.42, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      parrafo(s, p[1], { x: M + 0.75, y, w: CW - 0.75, h: 0.62, size: 13.5 });
      linea(s, M, y - 0.12, M + CW, y - 0.12, C.grisClaro, 1);
    });
    linea(s, M, 3.03 + 3 * 0.72, M + CW, 3.03 + 3 * 0.72, C.grisClaro, 1);

    const casos = [
      ["CASO 1 · DIPLOMAS", "La universidad quiere que un empleador verifique un diploma sin llamar a registro, y que siga funcionando dentro de treinta años."],
      ["CASO 2 · CAFÉ", "Una cooperativa cafetera quiere demostrar a un comprador europeo el origen de cada lote y las condiciones de compra al caficultor."],
      ["CASO 3 · ASISTENCIA", "Una empresa quiere registrar la asistencia diaria de sus empleados de forma inalterable, para evitar disputas laborales."],
    ];
    casos.forEach((c, i) => {
      const x = M + i * (CW / 3 + 0.06);
      caja(s, { x, y: 5.5, w: CW / 3 - 0.12, h: 1.35, fill: C.blanco });
      s.addText(c[0], { x: x + 0.26, y: 5.68, w: CW / 3 - 0.64, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
      parrafo(s, c[1], { x: x + 0.26, y: 6.02, w: CW / 3 - 0.64, h: 0.78, size: 11.5 });
    });
    s.addNotes("Repartir los casos, no dejar que elijan: si eligen, casi todos toman el 1. El caso 2 es el más rico para discutir.");
  }

  
  /* ---------- 57 · DIVISOR BLOQUE C ---------- */
  (await divisor({ letra: "C", titulo: "Cierre", sub: "Qué llevarse, qué trabajar y qué viene en la Sesión 2.", minutos: "MIN 172 — 180 · PLENARIA", ic: "bandera" })).addNotes("Últimos 8 minutos. Síntesis en voz alta, trabajo autónomo y lo que viene en la Sesión 2. No abrir temas nuevos.");

  /* ---------- 58 · Qué llevarse ---------- */
  {
    const s = await lamina({ kicker: "Bloque C · síntesis", titulo: "Lo que hay que llevarse de esta sesión", ic: "bandera", tituloSize: 26 });
    const ideas = [
      ["UNO", "El problema original no era criptográfico sino de ORDEN: cómo hacer que participantes que no se conocen coincidan en qué ocurrió primero, sin árbitro."],
      ["DOS", "El dinero es un REGISTRO, no un objeto. Esa reformulación es la que hace el problema soluble."],
      ["TRES", "Blockchain no elimina la confianza: la TRASLADA de una institución a un mecanismo verificable, y ese traslado tiene un costo alto en rendimiento y en irreversibilidad."],
      ["CUATRO", "La contribución de 2008 no fue tecnológica sino de DISEÑO DE INCENTIVOS. Todas las piezas criptográficas ya existían."],
      ["CINCO", "Saber CUÁNDO NO USARLA es parte del oficio, y en este curso es parte de la nota."],
      ["SEIS", "«Descentralizado» no es una propiedad: es un VECTOR de varias dimensiones que pueden estar en estados opuestos al tiempo."],
      ["SIETE", "Después de quince años hay EVIDENCIA en lugar de promesa: sobrevivió lo que necesitaba resistencia a la censura o liquidación sin intermediario."],
    ];
    ideas.forEach((it, i) => {
      const y = 1.95 + i * 0.68;
      s.addText(it[0], { x: M, y: y + 0.02, w: 1.35, h: 0.4, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.naranja, charSpacing: 1.4, margin: 0, valign: "middle" });
      parrafo(s, it[1], { x: M + 1.5, y: y - 0.03, w: CW - 1.5, h: 0.62, size: 12.5 });
      linea(s, M, y - 0.13, M + CW, y - 0.13, C.grisClaro, 1);
    });
    linea(s, M, 1.82 + 7 * 0.68, M + CW, 1.82 + 7 * 0.68, C.grisClaro, 1);
    s.addNotes("Pedir al grupo que digan cuál de las cinco les resultó más contraintuitiva. Suele ser la tres.");
  }

  /* ---------- 59 · Trabajo autónomo ---------- */
  {
    const s = await lamina({ kicker: "Bloque C · trabajo autónomo para la Sesión 2", titulo: "Se exige, no se recoge", ic: "documento", tituloSize: 28 });
    const r = await ficha(s, { tipo: "alerta", etiqueta: "Nada de esto se entrega ni se califica", x: M, y: 1.9, w: CW, h: 1.15 });
    parrafo(s, "Es trabajo real y necesario —la Sesión 2 lo da por hecho—, pero se verifica en clase mediante discusión, no mediante recolección. Quien no lo haga no pierde nota: pierde la sesión siguiente.", { x: r.x, y: r.y - 0.06, w: r.w, h: 0.5, size: 13.5 });

    const tareas = [
      ["01", "LECTURA OBLIGATORIA", "Whitepaper de Bitcoin, secciones 1 a 5. Son cinco páginas. Léase sin buscar entenderlo todo: el objetivo es reconocer, en el texto original, los conceptos discutidos hoy. Traer identificado el párrafo donde se enuncia el problema del doble gasto."],
      ["02", "PREPARACIÓN TÉCNICA", "Verificar que el equipo personal tenga Python 3 o Node.js funcionando desde la línea de comandos. La Sesión 2 abre con la demostración en vivo y sigue con el primer laboratorio del semestre."],
      ["03", "PREGUNTA DE LA SEMANA", "Se piensa y se trae resuelta, no se entrega. Abre la plenaria de la Sesión 2 y se responde en voz alta."],
    ];
    tareas.forEach((t, i) => {
      const y = 3.3 + i * 1.13;
      s.addText(t[0], { x: M, y: y + 0.04, w: 0.7, h: 0.5, fontFace: F.display, fontSize: 24, color: C.naranja, margin: 0, valign: "middle" });
      s.addText(t[1], { x: M + 0.82, y, w: 3.4, h: 0.34, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.tinta, charSpacing: 1.2, margin: 0, valign: "middle" });
      parrafo(s, t[2], { x: M + 4.4, y: y - 0.02, w: CW - 4.4, h: 1.0, size: 12.5 });
      linea(s, M, y - 0.16, M + CW, y - 0.16, C.grisClaro, 1);
    });
    linea(s, M, 3.14 + 3 * 1.13, M + CW, 3.14 + 3 * 1.13, C.grisClaro, 1);
    s.addNotes("Pregunta de la semana: si una cadena de bloques garantiza que un registro no fue alterado después de escrito, ¿qué garantiza sobre la veracidad de ese registro en el momento de escribirlo? Ilústrelo con un ejemplo propio.");
  }

  /* ---------- 60 · Puente a la Sesión 2 ---------- */
  {
    const s = await lamina({ kicker: "Bloque C · puente", titulo: "Qué trae la Sesión 2", ic: "profundidad", tituloSize: 27 });
    parrafo(s, "Hoy usamos tres veces la palabra hash sin definirla con rigor: al describir el enlace entre bloques, al derivar una dirección desde una clave pública y al identificar una transacción. También afirmamos, sin demostrarlo, que de una clave pública no puede recuperarse la privada.", { y: 1.9, h: 0.85 });

    caja(s, { x: M, y: 2.95, w: CW, h: 2.25, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("SESIÓN 02 · CRIPTOGRAFÍA APLICADA", { x: M + 0.34, y: 3.2, w: 8, h: 0.34, fontFace: F.mono, fontSize: 11, bold: true, color: C.violetaOs, charSpacing: 1.4, margin: 0, valign: "middle" });
    parrafo(s, "ABRE CON LA DEMOSTRACIÓN EN VIVO: se crea una billetera en pantalla, se muestra qué es una frase semilla, se emite una transacción y se recorre campo por campo en un explorador de bloques. Después, el primer laboratorio: funciones hash, efecto avalancha, árbol de Merkle y firma con curva elíptica.", { x: M + 0.34, y: 3.62, w: CW - 0.68, h: 1.1, size: 13 });

    enunciado(s, "Al final de esa sesión, «alterar un bloque invalida la cadena» dejará de ser una afirmación y pasará a ser algo que cada estudiante habrá comprobado en su propio código.", { y: 5.4, h: 1.15, size: 18 });
    s.addNotes("Cerrar la sesión aquí. Es el gancho para que lleguen con la lectura hecha.");
  }

  /* ---------- 61-62 · Afirmaciones falsas ---------- */
  {
    const s = await lamina({ kicker: "Anexo I · higiene conceptual", titulo: "Afirmaciones falsas de circulación común", ic: "equis", tituloSize: 26 });
    parrafo(s, "Todas estas frases se escuchan con frecuencia, incluso en medios especializados. Todas son falsas o gravemente imprecisas. Reconocerlas es parte del criterio profesional.", { y: 1.9, h: 0.5, size: 13.5, color: C.gris });
    tabla(s, ["se dice", "por qué es falso"], [
      ["«Blockchain es imposible de hackear»", "El protocolo base es robusto, pero los ataques ocurren en las capas de arriba: contratos con fallos, billeteras comprometidas, puentes entre redes, ingeniería social. La inmensa mayoría de las pérdidas no atacaron el consenso."],
      ["«Las transacciones son anónimas»", "Son SEUDÓNIMAS. No llevan nombre, pero cada dirección tiene un historial público completo y permanente. El análisis de cadena es una industria consolidada, y basta un punto de contacto con el mundo real para desanonimizar todo hacia atrás."],
      ["«Los mineros resuelven problemas matemáticos útiles»", "El cálculo no tiene utilidad externa. Es fuerza bruta deliberadamente inútil; su función es COSTAR, no producir conocimiento."],
      ["«Blockchain elimina intermediarios»", "Los sustituye. Aparecen intercambios, custodios, proveedores de infraestructura de nodos, emisores de stablecoins y desarrolladores de protocolo. Algunos concentran tanto poder como los que reemplazaron."],
    ], { y: 2.55, h: 3.9, colW: [3.8, 8.293], rowH: 0.97, size: 11.5 });
    s.addNotes("Este anexo se puede usar como quiz rápido: leer la frase y pedir al grupo que explique por qué es falsa.");
  }
  {
    const s = await lamina({ kicker: "Anexo I · higiene conceptual · continuación", titulo: "Tres más que conviene desmontar", ic: "equis", tituloSize: 27 });
    tabla(s, ["se dice", "por qué es falso"], [
      ["«Los datos no se pueden borrar, luego sirve para guardar cualquier cosa»", "La primera parte es cierta y por eso mismo la conclusión es peligrosa. La permanencia es un problema legal grave para datos personales, y almacenar archivos en cadena es prohibitivamente caro. Se almacena el hash; el dato vive fuera."],
      ["«Un contrato inteligente es un contrato»", "Ni es inteligente ni es, por sí solo, un contrato en sentido jurídico. Es un programa que se ejecuta de forma determinista cuando se cumplen condiciones. Su relación con el derecho es materia de la Sesión 16."],
      ["«Es descentralizado, luego nadie lo controla»", "La descentralización es una variable continua, no binaria, y se mide en varias dimensiones: quién valida, quién desarrolla el cliente, quién opera los nodos de acceso, quién controla el capital. Muchas redes que se presentan como descentralizadas están concentradas en al menos una."],
    ], { y: 1.95, h: 3.62, colW: [4.2, 7.893], size: 12 });

    s.addNotes("La última es la más importante para el criterio profesional: obliga a preguntar «descentralizado en qué dimensión».");
  }

  /* ---------- 63-66 · GLOSARIO ---------- */
  const glosario = [
    ["AML", "Anti-Money Laundering", "Antilavado de activos. Obligaciones normativas que exigen a las entidades financieras detectar y reportar operaciones sospechosas. En Colombia el reporte se dirige a la UIAF."],
    ["Bloque", "", "Agrupación de transacciones con una cabecera que contiene el hash del bloque anterior, la raíz de Merkle de sus transacciones, una marca temporal y los datos de la prueba de trabajo."],
    ["Blockchain", "", "Lista enlazada de solo anexado, replicada en una red de pares, encadenada mediante hashes y acordada mediante consenso tolerante a fallas bizantinas."],
    ["Capa 1 y capa 2", "layer 1 / layer 2", "La capa 1 es la cadena base, que provee consenso y seguridad por sí misma. La capa 2 es una red construida encima que ejecuta transacciones fuera de la base y se apoya en ella para la seguridad y la resolución de disputas."],
    ["Confirmación", "", "Cada bloque añadido por encima del que contiene una transacción. A más confirmaciones, mayor el costo de revertirla y mayor la certeza práctica de que es definitiva."],
    ["Cypherpunk", "", "Movimiento de finales de los ochenta que promovía el uso de criptografía fuerte por individuos como condición para la privacidad. Contexto intelectual del que surge Bitcoin."],
    ["dApp", "decentralized application", "Aplicación descentralizada: programa cuya lógica de negocio reside en contratos inteligentes desplegados en una cadena, en lugar de en un servidor bajo control de una organización."],
    ["Dirección", "", "Identificador público de una cuenta, derivado por hash de la clave pública. En Ethereum, 20 bytes representados como 40 caracteres hexadecimales precedidos de 0x."],
    ["DLT", "Distributed Ledger Technology", "Tecnología de libro mayor distribuido. Categoría general que engloba a blockchain y a otras estructuras de registro replicado que no necesariamente encadenan bloques."],
    ["Doble gasto", "", "Gastar dos veces la misma unidad de dinero digital aprovechando que transferir información equivale a copiarla. Problema fundacional del campo."],
    ["EVM", "Ethereum Virtual Machine", "Máquina virtual de Ethereum. Especificación de la máquina de estados que ejecuta los contratos: qué operaciones existen y cuánto cuesta cada una. Una red compatible con la EVM ejecuta esa misma especificación, por lo que el código se transfiere sin reescribirse."],
    ["Hash", "", "Resumen criptográfico. Salida de longitud fija de una función determinista, irreversible en la práctica, en la que un cambio mínimo de la entrada altera por completo la salida."],
    ["Inmutabilidad", "", "Propiedad por la cual alterar un registro escrito resulta económicamente inviable, al exigir rehacer todo el trabajo posterior más rápido que el resto de la red. Barrera de costo, no imposibilidad física."],
    ["Intercambio centralizado", "CEX", "Plataforma que custodia fondos de terceros y hace de puerta de entrada desde el dinero tradicional. Concentra un poder subestimado: controla el acceso al sistema financiero y puede votar con monedas de sus clientes."],
    ["KYC", "Know Your Customer", "«Conozca a su cliente». Obligación normativa de identificar y verificar la identidad de los usuarios de servicios financieros antes de operar con ellos."],
    ["Libro mayor", "ledger", "Registro acumulativo y ordenado de transacciones del cual se derivan los saldos. El dinero moderno es, en lo esencial, una anotación en un libro mayor."],
    ["MEV", "Maximal Extractable Value", "Valor máximo extraíble. Beneficio que un productor de bloques obtiene incluyendo, excluyendo o reordenando transacciones. Es una consecuencia estructural de que alguien deba decidir el orden, no un fallo."],
    ["Minado", "mining", "Proceso de buscar por fuerza bruta un valor que haga que el hash de un bloque cumpla la condición de dificultad, obteniendo el derecho a proponerlo y la recompensa asociada."],
    ["Moneda estable", "stablecoin", "Criptoactivo diseñado para mantener un valor estable frente a una referencia externa. Es el caso de uso con adopción sostenida más medible, sobre todo en pagos transfronterizos."],
    ["Nodo", "", "Computador que ejecuta el software del protocolo, mantiene una copia del libro mayor y valida de forma independiente las transacciones y bloques que recibe."],
    ["Nodo completo", "full node", "Nodo que descarga y verifica por sí mismo todos los bloques, sin confiar en nadie. Su poder es rechazar: un bloque inválido no se propaga."],
    ["Nodo ligero", "light client", "Programa que no verifica toda la cadena, sino que consulta a otros nodos. Toda billetera de navegador o teléfono lo es."],
    ["Nonce", "number used once", "Dos sentidos. En el minado: campo variable de la cabecera que se recorre por fuerza bruta. En una cuenta de Ethereum: contador de transacciones emitidas, que impide la reutilización y fija el orden."],
    ["Oráculo", "", "Mecanismo que introduce información del mundo exterior en una cadena de bloques. Constituye siempre un punto de confianza que debe analizarse de forma explícita."],
    ["P2P", "peer-to-peer", "De par a par. Arquitectura de red en la que todos los participantes tienen el mismo rol y se comunican directamente, sin servidor central que coordine."],
    ["PoW", "Proof of Work", "Prueba de trabajo. Mecanismo por el cual se demuestra haber invertido cómputo, mediante un resultado costoso de producir y barato de verificar."],
    ["Proveedor de acceso", "RPC", "Empresa que ofrece la infraestructura por la que billeteras y aplicaciones leen la cadena. Punto de centralización invisible: si cae, la red sigue viva pero deja de ser utilizable."],
    ["Seudonimato", "", "Operar bajo un identificador que no revela la identidad legal, pero cuya actividad es completamente pública y enlazable entre sí. No equivale a anonimato."],
    ["SPOF", "Single Point Of Failure", "Punto único de falla. Componente cuya caída inhabilita el sistema completo. Debilidad estructural característica de las arquitecturas centralizadas."],
    ["TPS", "Transactions Per Second", "Transacciones por segundo. Métrica de rendimiento. Debe interpretarse siempre junto con la latencia hasta la liquidación definitiva, no de forma aislada."],
    ["Trust-minimized", "minimizado en confianza", "Traducción precisa del mal llamado trustless. Reduce la confianza necesaria en contrapartes identificadas, sin eliminar la confianza en la matemática, el código y los supuestos del modelo."],
    ["TTP", "Trusted Third Party", "Tercero de confianza. Entidad en la que dos partes que no confían entre sí delegan la verificación y el registro de sus transacciones."],
    ["Turing-completo", "", "Sistema de cómputo capaz de expresar cualquier algoritmo calculable. Es lo que separa a Ethereum de Bitcoin, y lo que obliga a cobrar por cada operación para que un programa que no termina no congele la red."],
    ["W3C", "World Wide Web Consortium", "Organismo internacional que define los estándares de la web. Origen del sentido original de «Web 3.0» como web semántica, distinto del sentido actual en este curso."],
    ["Wallet", "billetera", "Programa que genera, custodia y usa claves criptográficas para firmar transacciones. No almacena fondos: almacena claves."],
    ["Whitepaper", "", "Documento técnico en el que se expone el diseño de un protocolo. En este campo, «el whitepaper» sin más designa por defecto el documento de Bitcoin de 2008."],
  ];

  /* Alto de fila según el largo de la definición: las de tres renglones pisaban la fila siguiente. */
  const altoFila = (g) => (g[2].length > 190 ? 0.9 : 0.68);
  const POR_PAG = 6, PAGS = Math.ceil(glosario.length / POR_PAG);
  for (let p = 0; p < PAGS; p++) {
    const trozo = glosario.slice(p * POR_PAG, (p + 1) * POR_PAG);
    const s = await lamina({
      kicker: `Anexo II · glosario acumulativo · ${p + 1} de ${PAGS}`,
      titulo: p === 0 ? "Glosario completo de la sesión" : "Glosario · continuación",
      ic: "lista", tituloSize: 27,
    });
    let yAcum = 1.98;
    trozo.forEach((g) => {
      const y = yAcum;
      yAcum += altoFila(g);
      s.addText(g[0], { x: M, y, w: 2.0, h: 0.36, fontFace: F.mono, fontSize: 11, bold: true, color: C.tinta, margin: 0, valign: "top" });
      if (g[1]) s.addText(g[1], { x: M + 2.05, y: y + 0.03, w: 2.5, h: 0.3, fontFace: F.mono, fontSize: 9, color: C.violetaOs, margin: 0, valign: "top" });
      parrafo(s, g[2], { x: M + 4.65, y: y - 0.03, w: CW - 4.65, h: altoFila(g) - 0.08, size: 11.5 });
      linea(s, M, y - 0.13, M + CW, y - 0.13, C.grisClaro, 1);
    });
    linea(s, M, yAcum - 0.13, M + CW, yAcum - 0.13, C.grisClaro, 1);
    s.addNotes("Glosario acumulativo: cada sesión añade entradas y ninguna se elimina.");
  }

  /* ---------- 67 · Fuentes ---------- */
  {
    const s = await lamina({ kicker: "Anexo III · fuentes y lecturas", titulo: "Fuentes", ic: "documento" });
    const cols = [
      ["OBLIGATORIA PARA LA SESIÓN 2", ["Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System. Secciones 1 a 5."]],
      ["FUENTES PRIMARIAS REFERIDAS", [
        "Chaum, D. (1983). Blind Signatures for Untraceable Payments.",
        "Back, A. (1997/2002). Hashcash — A Denial of Service Counter-Measure.",
        "Dai, W. (1998). b-money.",
        "Szabo, N. (1998/2005). Bit Gold.",
        "Lamport, Shostak y Pease (1982). The Byzantine Generals Problem.",
        "Lamport, L. (1978). Time, Clocks, and the Ordering of Events in a Distributed System.",
      ]],
      ["AMPLIACIÓN RECOMENDADA", [
        "Antonopoulos, A. Mastering Bitcoin. Capítulos 1 y 2. Libre acceso.",
        "Narayanan, A. et al. Bitcoin and Cryptocurrency Technologies. Capítulo 1.",
        "Werbach, K. The Blockchain and the New Architecture of Trust. Para la discusión de A.2.",
      ]],
    ];
    let y = 1.95;
    cols.forEach(c => {
      const h = 0.42 + c[1].length * 0.32;
      caja(s, { x: M, y, w: CW, h, fill: C.blanco, sombra: false });
      s.addText(c[0], { x: M + 0.3, y: y + 0.12, w: 6, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
      lista(s, c[1], { x: M + 0.3, y: y + 0.46, w: CW - 0.6, h: h - 0.5, size: 12, gap: 3 });
      y += h + 0.22;
    });
    s.addNotes("Las fuentes primarias son estables y no requieren verificación de vigencia. Los datos de rendimiento y las redes de prueba sí.");
  }

  /* ---------- 68 · CIERRE ---------- */
  {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addImage({ data: await icono("cadena", C.naranja), x: M, y: 1.55, w: 0.42, h: 0.42 });
    s.addText("FIN DE LA SESIÓN 01", {
      x: M + 0.6, y: 1.53, w: 8, h: 0.44, fontFace: F.mono, fontSize: 12,
      color: C.naranja, charSpacing: 2, margin: 0, valign: "middle",
    });
    s.addText("PRÓXIMA SESIÓN:\nCRIPTOGRAFÍA APLICADA", {
      x: M, y: 2.35, w: 11.5, h: 2.0, fontFace: F.display, fontSize: 46,
      color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 0.98,
    });
    s.addText("Hash, árboles de Merkle y firmas digitales. Laboratorio en máquina desde el primer minuto: traer Python 3 o Node.js funcionando.", {
      x: M, y: 4.45, w: 9.5, h: 0.9, fontFace: F.body, fontSize: 16,
      color: "B9B4C4", margin: 0, valign: "top", lineSpacingMultiple: 1.28,
    });
    s.addText("Universidad de San Buenaventura Medellín · Facultad de Ingeniería\nBlockchain y Web 3.0 · Unidad I · Sesión 01 de 17", {
      x: M, y: 5.9, w: 9.5, h: 0.8, fontFace: F.mono, fontSize: 10,
      color: "6E6A7C", margin: 0, valign: "top", lineSpacingMultiple: 1.35,
    });
    s.addNotes("Cerrar con lo que exige la próxima sesión: Python 3 o Node.js instalado y funcionando desde la línea de comandos, y el whitepaper leído (secciones 1 a 5). Sin entorno no se puede hacer el bloque D de la Sesión 2. 1 minuto.");
    nSlide++;
  }

  const salida = "D:/Curso Blockchain y Web 3.0/material/Sesion-01-Blockchain-Web3.pptx";
  await pres.writeFile({ fileName: salida });
  console.log("Generado:", salida, "·", nSlide, "láminas");
}

construir().catch(e => { console.error(e); process.exit(1); });
