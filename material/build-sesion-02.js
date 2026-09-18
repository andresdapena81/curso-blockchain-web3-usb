/* =====================================================================
   Blockchain y Web 3.0 — Universidad de San Buenaventura Medellín
   Generador del deck de la Sesión 02
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
  s.addText("SESIÓN 02 · INTEGRIDAD VERIFICABLE: HASH Y ÁRBOLES DE MERKLE", {
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
    rowH: [hdrH, ...filas.map(() => bodyH)], margin: [7, 9, 7, 9], autoPage: false,
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
   CONSTRUCCIÓN DEL DECK · SESIÓN 02
   ===================================================================== */

Object.assign(ICONOS, {
  funcion:     "M3 5h18v14H3zM7 12h8M12 8l4 4-4 4",
  escudoCheck: "M12 3 3 7v5c0 5 4 8 9 9 5-1 9-4 9-9V7zM8.5 12l2.5 2.5L16 10",
  comparar:    "M3 5h8v14H3zM13 5h8v14h-8z",
  arbol:       "M9 3h6v4H9zM2 17h6v4H2zM16 17h6v4h-6zM12 7v3M5 17v-4h14v4",
  matraz:      "M9 3h6M10 3v6L4 20h16L14 9V3M7 15h10",
});

async function construir() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Universidad de San Buenaventura Medellín";
  pres.title = "Blockchain y Web 3.0 — Sesión 02";
  pres.subject = "Integridad verificable: hash y árboles de Merkle";

  const PIE = "SESIÓN 02 · INTEGRIDAD VERIFICABLE: HASH Y ÁRBOLES DE MERKLE";

  /* ---------- 01 · PORTADA ---------- */
  {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 4.1, h: H, fill: { color: C.naranja }, line: { width: 0 } });
    s.addText("02", { x: 0, y: 2.1, w: 4.1, h: 3.0, fontFace: F.display, fontSize: 190, color: C.tinta, align: "center", valign: "middle", margin: 0 });
    s.addImage({ data: await icono("cadena", C.naranja), x: 4.8, y: 1.28, w: 0.34, h: 0.34 });
    s.addText("UNIDAD I · FUNDAMENTOS DE SISTEMAS DISTRIBUIDOS CONFIABLES", {
      x: 5.26, y: 1.26, w: 7.5, h: 0.38, fontFace: F.mono, fontSize: 10.5, color: C.naranja, charSpacing: 1.6, margin: 0, valign: "middle",
    });
    s.addText("INTEGRIDAD VERIFICABLE:\nHASH Y ÁRBOLES DE MERKLE", {
      x: 4.8, y: 1.95, w: 7.95, h: 2.5, fontFace: F.display, fontSize: 43, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 0.95,
    });
    s.addText("Blockchain y Web 3.0 · Ingeniería de Sistemas\nUniversidad de San Buenaventura Medellín", {
      x: 4.8, y: 4.62, w: 7.95, h: 0.8, fontFace: F.body, fontSize: 14.5, color: "B9B4C4", margin: 0, valign: "top", lineSpacingMultiple: 1.25,
    });
    const meta = [["180 MIN", "duración"], ["DEMO +\nLABORATORIO", "modalidad"], ["PYTHON 3\nO NODE.JS", "equipo"], ["REPOSITORIO", "entregable"]];
    meta.forEach((m, i) => {
      const x = 4.8 + i * 2.0;
      s.addText(m[0], { x, y: 5.72, w: 1.85, h: 0.5, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
      s.addText(m[1].toUpperCase(), { x, y: 6.24, w: 1.85, h: 0.28, fontFace: F.mono, fontSize: 8.5, color: "A39EAF", charSpacing: 1.2, margin: 0, valign: "top" });
    });
    s.addNotes("Abrir con la plenaria de la pregunta de la semana de la Sesión 1. Anunciar el formato de hoy: demostración en vivo, billetera propia, teoría del hash y código en parejas. Comprobar quién llegó sin entorno. 2 minutos.");
    nSlide++;
  }

  
  /* ---------- 02 · Requisitos ---------- */
  {
    const s = await lamina({ kicker: "Preliminar · para poder trabajar hoy", titulo: "Lo que hay que traer", ic: "libro", tituloSize: 29 });
    const items = [
      ["01", "PYTHON 3 O NODE.JS", "Instalado y funcionando desde la línea de comandos. Se anunció la sesión pasada. El bloque D empieza en el minuto 120 y no hay tiempo para instalaciones."],
      ["02", "EL WHITEPAPER LEÍDO", "Secciones 1 a 5. Abrimos con la plenaria de la pregunta de la semana."],
      ["03", "PAPEL Y LAPICERO", "Para la frase semilla del bloque B. No sirve el teléfono, y la razón se explica ahí mismo."],
    ];
    items.forEach((it, i) => {
      const y = 2.2 + i * 1.2;
      s.addText(it[0], { x: M, y: y + 0.05, w: 0.8, h: 0.5, fontFace: F.display, fontSize: 26, color: C.naranja, margin: 0, valign: "middle" });
      s.addText(it[1], { x: M + 0.95, y, w: 5.0, h: 0.4, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.tinta, charSpacing: 1.2, margin: 0, valign: "middle" });
      parrafo(s, it[2], { x: M + 6.1, y: y - 0.02, w: CW - 6.1, h: 1.1, size: 13 });
      linea(s, M, y - 0.18, M + CW, y - 0.18, C.grisClaro, 1);
    });
    linea(s, M, 2.02 + 3 * 1.2, M + CW, 2.02 + 3 * 1.2, C.grisClaro, 1);
    const r = await ficha(s, { tipo: "alerta", etiqueta: "Si llega sin entorno", x: M, y: 5.8, w: CW, h: 0.9 });
    parrafo(s, "Trabajen en pareja con alguien que sí lo tenga, y resuelvan su instalación fuera de clase.", { x: r.x, y: r.y - 0.14, w: r.w, h: 0.4, size: 12.5 });
    s.addNotes("Comprobar entornos en la apertura, no al empezar el bloque D.");
  }

  /* ---------- 03 · MAPA ---------- */
  {
    const s = await lamina({ kicker: "Preliminar · estructura de los 180 minutos", titulo: "Mapa de la sesión", ic: "rejilla" });
    tabla(s, ["min", "bloque", "contenido"], [
      ["00–10", "Apertura", "Plenaria de la pregunta de la semana: ¿qué garantiza una cadena sobre la veracidad de lo escrito?"],
      ["10–55", "BLOQUE A", "Demostración en vivo. Siete demostraciones proyectadas: de la clave a la cadena."],
      ["55–70", "BLOQUE B", "Billetera propia. Cada estudiante replica lo que acaba de ver."],
      ["70–80", "C.1", "Qué es un hash y qué no es. Las cuatro confusiones que salen caras."],
      ["80–92", "C.2", "Las propiedades exigibles y qué se rompe si falla cada una."],
      ["92–100", "C.3", "SHA-256 y Keccak-256. La trampa de que Keccak-256 no es SHA3-256."],
      ["100–112", "C.4", "Árboles de Merkle: probar que algo está en un bloque sin descargar el bloque."],
      ["112–120", "Pausa", "—"],
      ["120–170", "BLOQUE D", "Laboratorio 01: hash, efecto avalancha, árbol de Merkle y prueba de inclusión."],
      ["170–180", "BLOQUE E", "Cierre, entregable y puente hacia las firmas digitales."],
    ], { y: 1.92, h: 4.9, colW: [1.15, 1.5, 9.443], size: 11 });
    s.addNotes("El laboratorio arranca en el minuto 120 y no hay margen para instalaciones. Verificar entornos en la apertura, no al empezar el bloque D.");
  }

  /* ---------- 04 · RA ---------- */
  {
    const s = await lamina({ kicker: "Preliminar · qué se espera al terminar", titulo: "Resultados de aprendizaje", ic: "bandera" });
    tabla(s, ["ra", "resultado de aprendizaje", "nivel", "dónde se evidencia"], [
      ["RA1", "Explicar los fundamentos criptográficos que sustentan la integridad de un registro distribuido.", "Comprender", "Núcleo de esta sesión. Laboratorio + Quiz 1 (S4)"],
      ["RA4", "Construir una suite de pruebas automatizadas.", "Aplicar", "Se inicia aquí con las pruebas del laboratorio. Se evalúa en S8."],
    ], { y: 1.95, h: 1.9, colW: [0.85, 5.6, 1.55, 4.093], size: 12 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Las tres afirmaciones que hoy se demuestran", x: M, y: 4.2, w: CW, h: 2.3 });
    const afirm = [
      ["01", "Un cambio mínimo altera la mitad de la salida."],
      ["02", "Una raíz de Merkle compromete el conjunto entero."],
      ["03", "La pertenencia se prueba con una fracción logarítmica de los datos."],
    ];
    afirm.forEach((a, i) => {
      const y = r.y + 0.05 + i * 0.5;
      s.addText(a[0], { x: r.x, y, w: 0.55, h: 0.4, fontFace: F.display, fontSize: 18, color: C.naranja, margin: 0, valign: "middle" });
      parrafo(s, a[1], { x: r.x + 0.7, y: y + 0.02, w: r.w - 0.7, h: 0.4, size: 14 });
    });
    s.addNotes("Las tres se enuncian en el bloque C y se comprueban en código en el bloque D. Esa es la estructura de la sesión.");
  }

  /* ---------- 05 · DIVISOR A ---------- */
  (await divisor({ letra: "A", titulo: "Demostración en vivo", sub: "Siete demostraciones proyectadas. Convierte en datos concretos todo lo que la Sesión 1 dejó en abstracto.", minutos: "MIN 10 — 55 · EL DOCENTE EJECUTA Y NARRA", ic: "pantalla" })).addNotes("Min 10–55. El docente ejecuta y narra; ustedes miran y anotan. Todo ocurre en red de prueba: nunca dinero real.");

  /* ---------- 06 · Qué se demuestra ---------- */
  {
    const s = await lamina({ kicker: "Bloque A · de la clave a la cadena", titulo: "Qué deja cada demostración", ic: "pantalla", tituloSize: 28 });
    tabla(s, ["#", "demostración", "la idea que debe quedar"], [
      ["01", "Crear una identidad desde cero", "Una cuenta válida en una red global en menos de un minuto, sin nombre, sin documento y sin que nadie la apruebe."],
      ["02", "La frase semilla, en pantalla", "Doce palabras reconstruyen la cuenta completa en otro navegador y sin contraseña. La frase no da acceso: ES la billetera."],
      ["03", "Anatomía de una dirección", "Cuarenta y dos caracteres, y las mayúsculas no son decorativas: codifican una suma de verificación."],
      ["04", "Cambiar de red", "La misma dirección en dos libros independientes con saldos distintos."],
      ["05", "Firmar: la pantalla que nadie lee", "Firmar es irreversible. La mayoría de los robos no rompe criptografía: consigue que la víctima firme."],
      ["06", "El explorador, campo por campo", "Todo lo de la sesión pasada aparece como datos concretos. Es la demostración central."],
      ["07", "La cuenta de un desconocido", "Seudónimo no es anónimo: sin nombre, pero todo enlazado y permanente."],
    ], { y: 1.95, h: 4.45, colW: [0.7, 3.6, 7.793], size: 11 });
    s.addNotes("El guion completo —ruta de clics, frases para decir, montaje de dos navegadores y planes de contingencia— está en la Guía de demostración, documento aparte.");
  }

  /* ---------- 07 · Gancho ---------- */
  {
    const s = await lamina({ kicker: "Bloque A · cierre", titulo: "El gancho hacia el bloque conceptual", ic: "pregunta", tituloSize: 27 });
    enunciado(s, "En la demostración 06 apareció un campo llamado «Transaction Hash», y se dijo que cambia por completo si se altera un solo byte. Eso es una afirmación fuerte.", { y: 2.2, h: 1.75, size: 20 });
    parrafo(s, "En hora y media la habremos demostrado — no de palabra, sino midiéndola en código propio.", { y: 4.25, h: 0.5, size: 15 });

    s.addNotes("Dejar la pregunta abierta. Se responde en C.2 con la medición del efecto avalancha.");
  }

  /* ---------- 08 · DIVISOR B ---------- */
  (await divisor({ letra: "B", titulo: "Billetera propia", sub: "Quince minutos, inmediatamente después de haberlo visto hacer. Es el momento de máxima comprensión.", minutos: "MIN 55 — 70 · CADA ESTUDIANTE EN SU MÁQUINA", ic: "llave" })).addNotes("Min 55–70. Cada estudiante crea su billetera justo después de verla crear. La frase semilla va en papel, nunca en foto ni en archivo, y no se comparte con nadie, tampoco con el docente.");

  /* ---------- 09 · Reglas ---------- */
  {
    const s = await lamina({ kicker: "Bloque B · rigen desde hoy", titulo: "Tres reglas que no admiten excepción", ic: "alerta", tituloSize: 26 });
    parrafo(s, "Se enunciaron en la Sesión 1. A partir de este momento aplican de verdad, porque cada quien tiene su propia billetera.", { y: 1.88, h: 0.42, size: 13.5, color: C.gris });
    const reglas = [
      ["01", "Nunca se ingresa dinero real en la billetera del curso.", "Quien quiera operar con fondos reales debe usar otra, creada fuera de clase, en un equipo de su propiedad."],
      ["02", "La frase de recuperación no se comparte con nadie. Nunca. Tampoco con el docente.", "Nadie legítimo la pedirá jamás. Cualquiera que la pida está intentando robar."],
      ["03", "No se firma ninguna transacción cuyo contenido no se comprenda.", "Firmar es irreversible y puede autorizar a un tercero a mover todos los fondos de la cuenta."],
    ];
    reglas.forEach((r, i) => {
      const y = 2.45 + i * 1.42;
      caja(s, { x: M, y, w: CW, h: 1.25, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
      s.addText(r[0], { x: M + 0.3, y: y + 0.24, w: 0.8, h: 0.5, fontFace: F.display, fontSize: 26, color: C.naranja, margin: 0, valign: "middle" });
      s.addText(r[1], { x: M + 1.2, y: y + 0.18, w: CW - 1.55, h: 0.34, fontFace: F.body, fontSize: 14, bold: true, color: C.tinta, margin: 0, valign: "middle" });
      parrafo(s, r[2], { x: M + 1.2, y: y + 0.55, w: CW - 1.55, h: 0.62, size: 12.5 });
    });
    s.addNotes("Pedir confirmación explícita del grupo. Es el único momento del semestre en que se enuncian completas y con la billetera delante.");
  }

  /* ---------- 10 · Pasos billetera ---------- */
  {
    const s = await lamina({ kicker: "Bloque B · procedimiento", titulo: "Cinco pasos, quince minutos", ic: "llave", tituloSize: 28 });
    const pasos = [
      ["01", "INSTALAR DESDE LA TIENDA OFICIAL", "Verificar desarrollador y número de instalaciones. Existen falsificaciones con ícono casi idéntico cuyo único fin es capturar la frase semilla."],
      ["02", "CREAR Y ANOTAR LAS DOCE PALABRAS", "En papel, a mano, en orden. No captura, no foto, no archivo, no nota del teléfono, no correo a sí mismo."],
      ["03", "HABILITAR LA RED DE PRUEBA", "Verificar en el selector antes de continuar. La contraseña del navegador no es la cuenta y no la recupera en otro equipo."],
      ["04", "RECIBIR FONDOS DE PRUEBA", "El docente distribuye desde la billetera institucional. No se depende de faucets públicos en clase."],
      ["05", "ENVIAR LA DIRECCIÓN AL CANAL DEL CURSO", "Solo la dirección, que es pública. Sirve para el punto de control de la Sesión 5 y para las distribuciones siguientes."],
    ];
    pasos.forEach((p, i) => {
      const y = 1.95 + i * 0.94;
      s.addText(p[0], { x: M, y: y + 0.02, w: 0.6, h: 0.44, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      s.addText(p[1], { x: M + 0.72, y, w: 4.3, h: 0.4, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.tinta, charSpacing: 1.1, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
      parrafo(s, p[2], { x: M + 5.2, y: y - 0.02, w: CW - 5.2, h: 0.85, size: 12.5 });
      linea(s, M, y - 0.14, M + CW, y - 0.14, C.grisClaro, 1);
    });
    linea(s, M, 1.81 + 5 * 0.94, M + CW, 1.81 + 5 * 0.94, C.grisClaro, 1);
    s.addNotes("Si a los doce minutos hay más de tres o cuatro atascados, seguir adelante: el laboratorio de hoy no necesita billetera y el punto de control de la Sesión 5 recoge a los rezagados.");
  }

  /* ---------- 11 · DIVISOR C ---------- */
  (await divisor({ letra: "C", titulo: "Integridad verificable", sub: "Qué es realmente un hash, qué propiedades debe cumplir y cómo se resume un conjunto entero en un solo valor.", minutos: "MIN 70 — 112 · EXPOSICIÓN DIALOGADA", ic: "funcion" })).addNotes("Min 70–112. Exposición dialogada: qué es un hash, qué propiedades debe cumplir y cómo un árbol de Merkle resume un conjunto. Todo lo de este bloque se ejecuta después en el bloque D.");

  /* ---------- 12 · C.1 apertura ---------- */
  {
    const s = await lamina({ kicker: "C.1 · min 70–80", titulo: "Qué es una función hash, y qué no es", ic: "funcion", tituloSize: 27 });
    parrafo(s, "En la Sesión 1 usamos la palabra hash tres veces sin definirla con rigor: al describir el enlace entre bloques, al derivar una dirección desde una clave pública y al identificar una transacción. Aquí se salda esa deuda.", { y: 1.9, h: 0.75 });

    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 01 · función hash criptográfica", x: M, y: 2.8, w: CW, h: 3.6 });
    definicion(s, "Función matemática que toma una entrada de LONGITUD ARBITRARIA y produce una salida\nde LONGITUD FIJA, de forma determinista, eficiente de calcular en un sentido e\ninviable de invertir.", { x: r.x, y: r.y, w: r.w, h: 1.05 });
    parrafo(s, "La entrada puede ser un carácter o una película de tres horas: la salida siempre mide lo mismo. En SHA-256, 256 bits, que se escriben como 64 caracteres hexadecimales.", { x: r.x, y: r.y + 1.22, w: r.w, h: 0.75, size: 13.5 });
    parrafo(s, "Nótese la asimetría, que es toda la utilidad: calcular el hash de un dato es instantáneo; recuperar el dato a partir del hash es inviable con cualquier cómputo concebible.", { x: r.x, y: r.y + 2.0, w: r.w, h: 0.75, size: 13.5, color: C.tinta });
    s.addNotes("Los sinónimos —hash, resumen, digest, huella digital— designan todos lo mismo. Conviene decirlo para que no suene a conceptos distintos cuando aparezcan en la bibliografía.");
  }

  /* ---------- 13 · Las cuatro confusiones ---------- */
  {
    const s = await lamina({ kicker: "C.1 · higiene conceptual", titulo: "Un hash no es cifrado, ni compresión, ni azar, ni firma", ic: "equis", tituloSize: 23 });
    parrafo(s, "Casi todo lo que sale mal con funciones hash en la práctica profesional viene de confundirlas con otra cosa.", { y: 1.88, h: 0.42, size: 13.5, color: C.gris });
    tabla(s, ["un hash NO es…", "por qué"], [
      ["…cifrado", "El cifrado es REVERSIBLE: existe una clave que devuelve el texto original, y ese es su propósito. Un hash no tiene clave y no tiene vuelta. «Hasheada» y «encriptada» no son lo mismo, y confundirlo cambia por completo el análisis de riesgo."],
      ["…compresión", "La compresión conserva la información: por eso se puede descomprimir. El hash DESTRUYE información. Un archivo de 4 GB y uno de 4 bytes producen salidas del mismo tamaño."],
      ["…aleatorio", "Es completamente DETERMINISTA: la misma entrada produce siempre la misma salida, en cualquier máquina y momento. Parece aleatorio, que es distinto. Esa apariencia es una propiedad buscada, no azar."],
      ["…una firma", "Prueba que un dato no cambió; NO prueba quién lo escribió. Cualquiera puede calcular el hash de cualquier cosa. La autoría requiere criptografía asimétrica: Sesión 3."],
    ], { y: 2.45, h: 3.95, colW: [2.5, 9.593], size: 11.5 });
    s.addNotes("La confusión entre hash y cifrado aparece en informes de auditoría y en respuestas a incidentes reales. Vale la pena insistir.");
  }

  /* ---------- 14 · Colisiones ---------- */
  {
    const s = await lamina({ kicker: "C.1 · el principio del palomar", titulo: "Las colisiones existen. Necesariamente.", ic: "funcion", tituloSize: 28 });
    cifra(s, "∞", "Entradas posibles: cualquier archivo, de cualquier tamaño.", { x: M, y: 1.95, w: 3.85, h: 1.7, size: 46 });
    cifra(s, "2²⁵⁶", "Salidas posibles en SHA-256. Un número finito.", { x: M + 4.12, y: 1.95, w: 3.85, h: 1.7, size: 40, color: C.ocre });
    cifra(s, "⇒", "Al meter infinitos elementos en casillas finitas, hay casillas con más de uno.", { x: M + 8.24, y: 1.95, w: 3.85, h: 1.7, size: 46, color: C.violeta });

    enunciado(s, "Las colisiones no solo son posibles: es matemáticamente seguro que existen. La seguridad no consiste en que no existan, sino en que NADIE SEA CAPAZ DE ENCONTRAR UNA.", { y: 3.95, h: 1.55, size: 19 });

    parrafo(s, "El número 2²⁵⁶ es difícil de dimensionar. Una comparación que suele funcionar en clase: es del orden de la cantidad estimada de átomos en el universo observable. Encontrar dos entradas con el mismo hash de 256 bits por fuerza bruta no es difícil — es imposible con la física conocida.", { y: 5.75, h: 0.9, size: 13.5, color: C.gris });
    s.addNotes("Este razonamiento desmonta la creencia de que «un buen hash no tiene colisiones». Sí las tiene; lo que no tiene es forma de hallarlas.");
  }

  /* ---------- 15 · Alerta contraseñas ---------- */
  {
    const s = await lamina({ kicker: "C.1 · alerta profesional", titulo: "Nunca uses SHA-256 para guardar contraseñas", ic: "alerta", tituloSize: 26 });
    const r = await ficha(s, { tipo: "alerta", etiqueta: "La aplicación equivocada más frecuente", x: M, y: 1.95, w: CW, h: 2.6 });
    parrafo(s, "SHA-256 está diseñada para ser RÁPIDA, y esa es exactamente la propiedad que no se quiere al almacenar contraseñas: un atacante con la base de datos filtrada puede probar miles de millones de candidatos por segundo.", { x: r.x, y: r.y, w: r.w, h: 1.0, size: 13.5 });
    parrafo(s, "Para contraseñas se usan funciones deliberadamente lentas y con sal —bcrypt, scrypt, Argon2—, diseñadas para que cada intento cueste. Es un dominio distinto con requisitos opuestos.", { x: r.x, y: r.y + 1.05, w: r.w, h: 0.9, size: 13.5, color: C.tinta });

    caja(s, { x: M, y: 4.85, w: CW / 2 - 0.12, h: 1.6, fill: C.superf });
    s.addText("EN BLOCKCHAIN", { x: M + 0.3, y: 5.08, w: 4, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Queremos velocidad: cada nodo verifica millones de hashes. SHA-256 y Keccak-256 son la elección correcta.", { x: M + 0.3, y: 5.45, w: CW / 2 - 0.72, h: 0.9, size: 13 });

    caja(s, { x: M + CW / 2 + 0.12, y: 4.85, w: CW / 2 - 0.12, h: 1.6, fill: C.superf });
    s.addText("EN AUTENTICACIÓN", { x: M + CW / 2 + 0.42, y: 5.08, w: 4, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Queremos lentitud: que cada intento del atacante cueste. Son la elección incorrecta.", { x: M + CW / 2 + 0.42, y: 5.45, w: CW / 2 - 0.72, h: 0.9, size: 13 });
    s.addNotes("La función se elige por el problema, no por costumbre. Es la lección transferible de esta lámina.");
  }

  /* ---------- 16 · Propiedades I ---------- */
  {
    const s = await lamina({ kicker: "C.2 · min 80–92 · 1 de 2", titulo: "Las propiedades exigibles", ic: "escudoCheck", tituloSize: 28 });
    parrafo(s, "Que una función produzca salida de longitud fija no la hace criptográfica. Léase la última columna: dice qué se rompería en una blockchain si esa propiedad fallara.", { y: 1.88, h: 0.5, size: 13.5, color: C.gris });
    tabla(s, ["propiedad", "qué exige", "qué se rompe si falla"], [
      ["Determinismo", "La misma entrada produce siempre la misma salida.", "Todo. Dos nodos calcularían hashes distintos para el mismo bloque y la red nunca alcanzaría acuerdo."],
      ["Eficiencia", "Calcular el hash debe ser rápido y barato.", "La verificación se volvería impracticable: cada nodo comprueba millones de hashes por bloque."],
      ["Efecto avalancha", "Un cambio mínimo altera aproximadamente la mitad de los bits de la salida, de forma impredecible.", "Se podrían hacer cambios «pequeños» con hashes parecidos, y la manipulación dejaría de ser evidente."],
    ], { y: 2.5, h: 3.9, colW: [2.3, 4.6, 5.193], size: 11.5 });
    s.addNotes("Las tres primeras son de funcionamiento; las tres siguientes son de resistencia frente a un atacante.");
  }

  /* ---------- 17 · Propiedades II ---------- */
  {
    const s = await lamina({ kicker: "C.2 · 2 de 2 · resistencia frente a un atacante", titulo: "Preimagen, segunda preimagen y colisión", ic: "escudoCheck", tituloSize: 26 });
    tabla(s, ["propiedad", "qué exige", "qué se rompe si falla"], [
      ["Resistencia a preimagen", "Dado un hash h, es inviable encontrar ALGUNA entrada m tal que hash(m) = h.", "Se podría revertir un hash. Toda la construcción «clave pública → dirección» se vendría abajo."],
      ["Resistencia a segunda preimagen", "Dado un mensaje m₁, es inviable encontrar otro m₂ ≠ m₁ con el mismo hash.", "Se podría sustituir una transacción por otra distinta conservando el mismo hash: fraude indetectable."],
      ["Resistencia a colisiones", "Es inviable encontrar CUALQUIER par m₁ ≠ m₂ con el mismo hash.", "Un atacante prepararía de antemano dos documentos con el mismo hash y cambiaría uno por otro después de que el primero fuera aceptado."],
    ], { y: 1.95, h: 3.3, colW: [3.0, 4.5, 4.593], size: 11.5 });

    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 02 · están ordenadas de más difícil a más fácil", x: M, y: 5.4, w: CW, h: 1.25 });
    parrafo(s, "En una preimagen el objetivo está fijo. En una segunda preimagen hay un mensaje dado que igualar. En una colisión el atacante elige LOS DOS mensajes, y esa libertad la hace mucho más barata.", { x: r.x, y: r.y - 0.08, w: r.w, h: 0.45, size: 12.5 });
    s.addNotes("Por eso una función puede seguir siendo resistente a preimagen cuando ya se le encontraron colisiones, que es lo que ocurrió con funciones hoy retiradas.");
  }

  /* ---------- 18 · Paradoja del cumpleaños ---------- */
  {
    const s = await lamina({ kicker: "C.2 · profundidad", titulo: "Por qué las colisiones cuestan la mitad", ic: "profundidad", tituloSize: 27 });
    const r = await ficha(s, { tipo: "profundidad", etiqueta: "La paradoja del cumpleaños", x: M, y: 1.9, w: CW, h: 2.0 });
    parrafo(s, "En un salón de 23 personas, la probabilidad de que dos compartan cumpleaños supera el 50 %. Sorprende porque uno piensa en «alguien que coincida CONMIGO», cuando lo que cuenta es cualquier par entre todos. Con 23 personas hay 253 pares posibles.", { x: r.x, y: r.y, w: r.w, h: 1.05, size: 13.5 });

    cifra(s, "2ⁿ", "Coste de encontrar una PREIMAGEN sobre una salida de n bits.", { x: M, y: 4.1, w: 3.85, h: 1.6, size: 40 });
    cifra(s, "2ⁿ/²", "Coste de encontrar una COLISIÓN. Cada hash nuevo se compara con todos los anteriores.", { x: M + 4.12, y: 4.1, w: 3.85, h: 1.6, size: 36, color: C.ocre });
    cifra(s, "128", "Bits de resistencia real de SHA-256 frente a colisiones, no 256.", { x: M + 8.24, y: 4.1, w: 3.85, h: 1.6, size: 40, color: C.violeta });

    parrafo(s, "Sigue siendo un número inalcanzable, pero explica por qué el tamaño de salida se elige al doble del nivel de seguridad que se busca.", { y: 5.9, h: 0.55, size: 13, color: C.gris });
    s.addNotes("Material no evaluable en el Quiz 1, pero explica una decisión de diseño que los estudiantes verán repetida en toda la criptografía aplicada.");
  }

  /* ---------- 19 · DIAGRAMA avalancha ---------- */
  {
    const s = await lamina({ kicker: "C.2 · figura 1 · valores reales", titulo: "Una tilde cambia la mitad de la salida", ic: "escudoCheck", tituloSize: 27 });

    nodo(s, { x: M, y: 2.0, w: 3.4, h: 0.85, titulo: "ENTRADA A", sub: "\"USB Medellin\"", align: "left" });
    flecha(s, M + 3.4, 2.425, M + 3.95, 2.425);
    caja(s, { x: M + 4.02, y: 2.0, w: 8.07, h: 0.85, fill: C.superf, sombra: false });
    s.addText("a4bca74553f433194546f1ca04e5ac39", { x: M + 4.2, y: 2.12, w: 7.7, h: 0.3, fontFace: F.mono, fontSize: 12.5, color: C.tintaSuav, margin: 0, valign: "middle" });
    s.addText("80e9005c4ce7041f594a2b15f50ff0cc", { x: M + 4.2, y: 2.44, w: 7.7, h: 0.3, fontFace: F.mono, fontSize: 12.5, color: C.tintaSuav, margin: 0, valign: "middle" });

    caja(s, { x: M, y: 3.1, w: 3.4, h: 0.85, fill: C.blanco, line: C.naranja, sombra: false });
    s.addText("ENTRADA B · UNA TILDE MÁS", { x: M + 0.15, y: 3.22, w: 3.1, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: C.ocre, charSpacing: 1, margin: 0, valign: "middle" });
    s.addText("\"USB Medellín\"", { x: M + 0.15, y: 3.54, w: 3.1, h: 0.3, fontFace: F.mono, fontSize: 12, color: C.tintaSuav, margin: 0, valign: "middle" });
    flecha(s, M + 3.4, 3.525, M + 3.95, 3.525);
    caja(s, { x: M + 4.02, y: 3.1, w: 8.07, h: 0.85, fill: C.blanco, line: C.naranja, sombra: false });
    s.addText("6a26f8eaf52f416dc14ad4dfe64db2c1", { x: M + 4.2, y: 3.22, w: 7.7, h: 0.3, fontFace: F.mono, fontSize: 12.5, color: C.tintaSuav, margin: 0, valign: "middle" });
    s.addText("6e17c4f4e03e1a4022062f7b9ba7a6bd", { x: M + 4.2, y: 3.54, w: 7.7, h: 0.3, fontFace: F.mono, fontSize: 12.5, color: C.tintaSuav, margin: 0, valign: "middle" });

    linea(s, M, 4.35, M + CW, 4.35, C.naranja, 2);
    s.addText("134 DE LOS 256 BITS CAMBIARON · 52,3 %", { x: M, y: 4.5, w: CW, h: 0.4, fontFace: F.display, fontSize: 21, color: C.ocre, margin: 0, valign: "middle" });
    parrafo(s, "62 de los 64 caracteres hexadecimales son distintos. No hay ninguna relación visible entre las dos salidas — y sin embargo la entrada cambió en un solo carácter.", { y: 5.05, h: 0.6, size: 14 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Por qué importa", x: M, y: 5.75, w: CW, h: 0.95 });
    s.addText("El efecto avalancha es lo que hace que toda manipulación sea siempre evidente.", { x: r.x, y: r.y - 0.1, w: r.w, h: 0.4, fontFace: F.display, fontSize: 16, color: C.tinta, margin: 0, valign: "middle" });
    s.addNotes("Valores reales de SHA-256, verificados. El laboratorio de hoy reproduce esta medición sobre 100 pares y obtiene un promedio cercano a 128.");
  }

  /* ---------- 20 · C.3 SHA vs Keccak ---------- */
  {
    const s = await lamina({ kicker: "C.3 · min 92–100", titulo: "SHA-256 y Keccak-256", ic: "comparar", tituloSize: 28 });
    parrafo(s, "No hay una sola función hash: hay familias, y cada red eligió la suya. El laboratorio de hoy y todo el código de contratos a partir de la Sesión 6 dependen de esa elección.", { y: 1.88, h: 0.5, size: 13.5, color: C.gris });
    tabla(s, ["función", "origen", "dónde se usa"], [
      ["SHA-256", "Familia SHA-2, publicada por el instituto de estándares estadounidense en 2001.", "Bitcoin, en casi todo: identificadores de transacción, árboles de Merkle y prueba de trabajo — habitualmente aplicada dos veces seguidas."],
      ["Keccak-256", "Algoritmo ganador del concurso público que buscaba el sucesor de SHA-2.", "Ethereum, en todo: identificadores, derivación de direcciones, firmas de función en los contratos y el operador keccak256 de Solidity."],
    ], { y: 2.56, h: 2.25, colW: [2.0, 4.4, 5.693], size: 11.5 });

    const r = await ficha(s, { tipo: "profundidad", etiqueta: "Por qué dos familias y no una", x: M, y: 4.95, w: CW, h: 1.55 });
    parrafo(s, "Están construidas sobre principios estructurales distintos, y esa diversidad es deliberada: si apareciera un ataque contra una de las dos familias, la otra no quedaría comprometida por la misma vía. Es el mismo argumento que en la Sesión 1 justificaba tener varias implementaciones del cliente — la monocultura es frágil.", { x: r.x, y: r.y - 0.04, w: r.w, h: 0.9, size: 13 });
    s.addNotes("Conviene anticipar que en Solidity el operador se llama keccak256 y que ese nombre no es casual: es la variante de Ethereum, no la del estándar.");
  }

  /* ---------- 21 · Alerta Keccak ---------- */
  {
    const s = await lamina({ kicker: "C.3 · la trampa que rompe código real", titulo: "Keccak-256 no es SHA3-256", ic: "alerta", tituloSize: 30 });
    const r = await ficha(s, { tipo: "alerta", etiqueta: "Esta distinción confunde a todo el mundo al menos una vez", x: M, y: 1.95, w: CW, h: 2.85 });
    parrafo(s, "Keccak ganó el concurso, pero antes de publicarlo como estándar oficial con el nombre SHA-3, el organismo normalizador MODIFICÓ EL RELLENO del algoritmo. Ethereum ya estaba usando la versión original y se quedó con ella.", { x: r.x, y: r.y, w: r.w, h: 1.0, size: 13.5 });
    parrafo(s, "Resultado: keccak256(x) y sha3_256(x) producen salidas distintas para la misma entrada, aunque el algoritmo de fondo sea el mismo.", { x: r.x, y: r.y + 1.05, w: r.w, h: 0.8, size: 13.5, color: C.tinta });

    enunciado(s, "Si una biblioteca ofrece «SHA-3», hay que verificar cuál de las dos implementa. Comprobarlo siempre contra un valor conocido antes de confiar en el resultado.", { y: 5.05, h: 1.45, size: 19 });
    s.addNotes("Muchas bibliotecas llaman sha3 a la variante de Ethereum y otras a la del estándar. Aparece cada semestre en el laboratorio.");
  }

  /* ---------- 22 · C.4 el problema ---------- */
  {
    const s = await lamina({ kicker: "C.4 · min 100–112 · árboles de Merkle", titulo: "Probar sin entregar el conjunto", ic: "arbol", tituloSize: 28 });
    parrafo(s, "Planteemos el problema antes de la solución, que es como se entiende.", { y: 1.88, h: 0.4, size: 14 });

    caja(s, { x: M, y: 2.4, w: CW, h: 1.5, fill: C.superf });
    parrafo(s, "Un teléfono quiere comprobar que UNA transacción concreta está incluida en un bloque. El bloque contiene miles de transacciones y pesa megabytes. Descargarlo entero para verificar una sola línea es absurdo, y descargar la cadena completa está fuera del alcance de un dispositivo móvil.", { x: M + 0.34, y: 2.62, w: CW - 0.68, h: 1.1, size: 14 });

    enunciado(s, "¿Se puede demostrar que un elemento pertenece a un conjunto SIN ENTREGAR EL CONJUNTO?", { y: 4.15, h: 1.25, size: 22 });
    parrafo(s, "Sí. La estructura que lo hace posible se publicó en 1979 y hoy sostiene tanto la cabecera de un bloque como el direccionamiento por contenido de los sistemas de archivos descentralizados.", { y: 5.6, h: 0.7, size: 14 });
    s.addNotes("Ralph Merkle, 1979, «A Certified Digital Signature». La estructura es anterior a Bitcoin en casi treinta años.");
  }

  /* ---------- 23 · Ficha árbol ---------- */
  {
    const s = await lamina({ kicker: "C.4 · ficha de término 03", titulo: "Árbol de Merkle", ic: "termino", tituloSize: 30 });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 03 · Merkle tree / hash tree", x: M, y: 1.9, w: CW, h: 4.55 });
    definicion(s, "Árbol binario en el que cada hoja es el hash de un dato y cada nodo interno es el\nhash de la concatenación de sus dos hijos. El nodo superior se llama RAÍZ DE MERKLE\ny resume todo el conjunto en un solo valor de longitud fija.", { x: r.x, y: r.y, w: r.w, h: 1.05 });
    parrafo(s, "La construcción es sencilla: se calcula el hash de cada elemento, se agrupan de dos en dos, se concatenan y se vuelve a hashear; el resultado sube un nivel. Se repite hasta quedar un único valor.", { x: r.x, y: r.y + 1.22, w: r.w, h: 0.8, size: 13.5 });
    parrafo(s, "Si el número de elementos de un nivel es impar, la convención más extendida es duplicar el último para completar el par.", { x: r.x, y: r.y + 2.05, w: r.w, h: 0.6, size: 13.5 });

    caja(s, { x: r.x, y: r.y + 2.8, w: r.w, h: 1.0, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    parrafo(s, "Cambiar un solo elemento cambia su hoja, lo que cambia su padre, y así hasta la raíz. LA RAÍZ ES UN COMPROMISO SOBRE EL CONJUNTO ENTERO.", { x: r.x + 0.28, y: r.y + 3.0, w: r.w - 0.56, h: 0.65, size: 13.5, color: C.tinta });
    s.addNotes("Ese compromiso es lo que hace que la raíz sirva en la cabecera del bloque: fija el contenido sin almacenarlo.");
  }

  /* ---------- 24 · DIAGRAMA árbol ---------- */
  {
    const s = await lamina({ kicker: "C.4 · figura 2", titulo: "Prueba de inclusión: tres hashes en lugar de ocho hojas", ic: "arbol", tituloSize: 23 });

    const dib = (x, y, w, h, txt, tipo) => {
      const col = tipo === "a" ? C.naranja : (tipo === "v" ? C.violeta : C.tinta);
      caja(s, { x, y, w, h, fill: tipo === "n" ? C.superf : C.blanco, line: col, sombra: false });
      s.addText(txt, { x, y, w, h, fontFace: F.mono, fontSize: 11, bold: tipo !== "n", color: tipo === "n" ? C.tintaSuav : C.tinta, align: "center", valign: "middle", margin: 0 });
    };

    const hojaX = i => M + i * 1.52, hojaW = 1.36, hojaY = 5.15, altura = 0.5;
    const n2X = p => M + 0.76 + p * 3.04, n2Y = 4.15;
    const n1X = k => M + 2.28 + k * 6.08, n1Y = 3.15;
    const raizX = M + 5.32, raizY = 2.15;

    dib(raizX, raizY, hojaW, altura, "RAÍZ", "v");
    dib(n1X(0), n1Y, hojaW, altura, "H(ABCD)", "v");
    dib(n1X(1), n1Y, hojaW, altura, "H(EFGH)", "a");
    ["H(AB)", "H(CD)", "H(EF)", "H(GH)"].forEach((t, p) => dib(n2X(p), n2Y, hojaW, altura, t, p === 0 ? "a" : (p === 1 ? "v" : "n")));
    ["H(A)", "H(B)", "H(C)", "H(D)", "H(E)", "H(F)", "H(G)", "H(H)"].forEach((t, i) =>
      dib(hojaX(i), hojaY, hojaW, altura, t, i === 2 ? "v" : (i === 3 ? "a" : "n")));

    for (let p = 0; p < 4; p++) {
      const cx = n2X(p) + hojaW / 2;
      linea(s, hojaX(2 * p) + hojaW / 2, hojaY, hojaX(2 * p) + hojaW / 2, hojaY - 0.18);
      linea(s, hojaX(2 * p + 1) + hojaW / 2, hojaY, hojaX(2 * p + 1) + hojaW / 2, hojaY - 0.18);
      linea(s, hojaX(2 * p) + hojaW / 2, hojaY - 0.18, hojaX(2 * p + 1) + hojaW / 2, hojaY - 0.18);
      linea(s, cx, hojaY - 0.18, cx, n2Y + altura);
    }
    for (let k = 0; k < 2; k++) {
      const cx = n1X(k) + hojaW / 2;
      linea(s, n2X(2 * k) + hojaW / 2, n2Y, n2X(2 * k) + hojaW / 2, n2Y - 0.18);
      linea(s, n2X(2 * k + 1) + hojaW / 2, n2Y, n2X(2 * k + 1) + hojaW / 2, n2Y - 0.18);
      linea(s, n2X(2 * k) + hojaW / 2, n2Y - 0.18, n2X(2 * k + 1) + hojaW / 2, n2Y - 0.18);
      linea(s, cx, n2Y - 0.18, cx, n1Y + altura);
    }
    linea(s, n1X(0) + hojaW / 2, n1Y, n1X(0) + hojaW / 2, n1Y - 0.18);
    linea(s, n1X(1) + hojaW / 2, n1Y, n1X(1) + hojaW / 2, n1Y - 0.18);
    linea(s, n1X(0) + hojaW / 2, n1Y - 0.18, n1X(1) + hojaW / 2, n1Y - 0.18);
    linea(s, raizX + hojaW / 2, n1Y - 0.18, raizX + hojaW / 2, raizY + altura);

    linea(s, M, 5.95, M + CW, 5.95, C.naranja, 2);
    s.addText("PRUEBA DE INCLUSIÓN DE C  =  H(D) + H(AB) + H(EFGH)", { x: M, y: 6.08, w: 7.5, h: 0.34, fontFace: F.mono, fontSize: 12, bold: true, color: C.ocre, charSpacing: 1.1, margin: 0, valign: "middle" });
    s.addText("naranja: la prueba · violeta: el camino que se recalcula", { x: M + 5.6, y: 6.08, w: CW - 5.6, h: 0.34, fontFace: F.mono, fontSize: 10, color: C.gris, align: "right", margin: 0, valign: "middle" });
    s.addNotes("Recorrer de abajo hacia arriba: se parte de H(C), se combina con H(D) para obtener H(CD), luego con H(AB) para obtener H(ABCD), y por último con H(EFGH) para llegar a la raíz.");
  }

  /* ---------- 25 · Ficha prueba de inclusión ---------- */
  {
    const s = await lamina({ kicker: "C.4 · ficha de término 04", titulo: "Prueba de inclusión", ic: "termino", tituloSize: 30 });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 04 · Merkle proof", x: M, y: 1.9, w: CW, h: 3.35 });
    definicion(s, "Conjunto mínimo de hashes que permite a quien conoce la raíz verificar que un\nelemento pertenece al conjunto, SIN NECESIDAD DE CONOCER LOS DEMÁS ELEMENTOS.", { x: r.x, y: r.y, w: r.w, h: 0.8 });
    parrafo(s, "Quien recibe la prueba parte del dato, calcula su hash, lo combina con el primer hash de la prueba, hashea el resultado, lo combina con el siguiente, y así sucesivamente. Si el valor al que llega coincide con la raíz que ya tenía, el elemento estaba en el conjunto. Si no coincide, no estaba.", { x: r.x, y: r.y + 0.95, w: r.w, h: 1.1, size: 13.5 });
    parrafo(s, "Lo notable es lo que NO hace falta: no se necesitan los otros elementos, ni confiar en quien envía la prueba. Una prueba falsa no cuadra con la raíz.", { x: r.x, y: r.y + 2.05, w: r.w, h: 0.7, size: 13.5, color: C.tinta });

    const r2 = await ficha(s, { tipo: "alerta", etiqueta: "Trampa del laboratorio", x: M, y: 5.4, w: CW, h: 1.25 });
    parrafo(s, "La prueba debe guardar si cada hermano estaba a la izquierda o a la derecha. Si se concatena siempre en el mismo orden, la verificación falla la mitad de las veces.", { x: r2.x, y: r2.y - 0.08, w: r2.w, h: 0.45, size: 12.5 });
    s.addNotes("Este es el error número uno de la parte 3 del laboratorio. Anticiparlo ahorra veinte minutos de depuración.");
  }

  /* ---------- 26 · Logarítmico ---------- */
  {
    const s = await lamina({ kicker: "C.4 · por qué esto lo cambia todo", titulo: "El crecimiento logarítmico", ic: "arbol", tituloSize: 29 });
    parrafo(s, "La prueba tiene tantos hashes como niveles tiene el árbol, es decir log₂(n). Ese crecimiento tan lento es lo que hace la técnica útil a escala real.", { y: 1.88, h: 0.5, size: 14 });
    tabla(s, ["elementos en el conjunto", "hashes en la prueba", "tamaño aproximado (32 bytes cada uno)"], [
      ["8", "3", "96 bytes"],
      ["1 024", "10", "320 bytes"],
      ["1 048 576", "20", "640 bytes"],
      ["1 000 000 000", "30", "960 bytes"],
    ], { y: 2.6, h: 2.3, colW: [3.5, 3.2, 5.393], size: 12.5 });

    enunciado(s, "Multiplicar el conjunto por mil añade diez hashes a la prueba. Un teléfono verifica la pertenencia a un conjunto de mil millones de elementos con menos de un kilobyte.", { y: 5.1, h: 1.4, size: 18 });
    s.addNotes("Aquí conviene detenerse: es el resultado más contraintuitivo de la sesión y el que hace posibles las billeteras móviles.");
  }

  /* ---------- 27 · Dónde aparece ---------- */
  {
    const s = await lamina({ kicker: "C.4 · cierre del bloque conceptual", titulo: "Dónde vuelve a aparecer esto", ic: "arbol", tituloSize: 28 });
    const usos = [
      ["EN LA CABECERA DEL BLOQUE", "La raíz es uno de los campos de la Fig. 2 de la Sesión 1. Alterar una transacción cambia la raíz, que cambia el hash del bloque, que rompe el enlace del siguiente. Ahora esa cadena es demostrable, no una afirmación."],
      ["EN LOS CLIENTES LIGEROS", "Es lo que permite que una billetera de teléfono verifique sus transacciones sin descargar la cadena. Retoma la distinción entre nodo completo y ligero de la Sesión 1."],
      ["EN LAS LISTAS DE DISTRIBUCIÓN", "Se publica una sola raíz en el contrato en lugar de miles de direcciones, y cada beneficiario presenta su prueba. Se usa en la Sesión 10."],
      ["EN EL DIRECCIONAMIENTO POR CONTENIDO", "La base de cómo IPFS identifica archivos. Se usa en la Sesión 11."],
    ];
    usos.forEach((u, i) => {
      const y = 1.95 + i * 1.18;
      caja(s, { x: M, y, w: CW, h: 1.0, fill: i % 2 ? C.superf : C.blanco, sombra: false });
      s.addText(u[0], { x: M + 0.3, y: y + 0.14, w: 4.6, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.2, margin: 0, valign: "middle" });
      parrafo(s, u[1], { x: M + 5.1, y: y + 0.12, w: CW - 5.4, h: 0.8, size: 12 });
    });
    s.addNotes("Pausa de 8 minutos al terminar. El laboratorio empieza en el minuto 120.");
  }

  /* ---------- 28 · DIVISOR D ---------- */
  (await divisor({ letra: "D", titulo: "El código, en vivo", sub: "Recorremos la implementación completa, la ejecutan ustedes, y de ahí sale el trabajo del semestre.", minutos: "MIN 120 — 170 · EN MÁQUINA, EN PAREJAS", ic: "matraz" })).addNotes("Después de la pausa, min 120–170, en parejas. Verificar primero que cada pareja tenga Python o Node funcionando; si no, emparejar con quien sí. El código se entrega completo: se lee, se ejecuta y se rompe.");

  /* ---------- 29 · Cómo vamos a trabajar ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · formato", titulo: "Se entrega resuelto, y se lee", ic: "matraz", tituloSize: 28 });
    parrafo(s, "El código de esta sesión viene completo. No hay que escribirlo desde cero: hay que ENTENDERLO, ejecutarlo y romperlo. Son setenta líneas y en ellas está toda la Sesión 2.", { y: 1.9, h: 0.7, size: 15 });

    const pasos = [
      ["01", "LO RECORREMOS JUNTOS", "Cinco láminas, función por función. Cada una responde a una idea que ya vimos en el bloque C."],
      ["02", "LO EJECUTAN USTEDES", "En sus máquinas, con los ocho valores de referencia. La raíz que obtengan debe coincidir con la de la lámina."],
      ["03", "LO ROMPEN", "Cambian un carácter de un dato y vuelven a calcular. Ahí se ve el compromiso de la raíz, en su propia pantalla."],
      ["04", "LO CONVIERTEN EN ALGO SUYO", "El trabajo del semestre parte de aquí: construir una interfaz sobre este código."],
    ];
    pasos.forEach((p, i) => {
      const y = 2.74 + i * 0.8;
      s.addText(p[0], { x: M, y: y + 0.04, w: 0.7, h: 0.44, fontFace: F.display, fontSize: 22, color: C.naranja, margin: 0, valign: "middle" });
      s.addText(p[1], { x: M + 0.8, y, w: 4.5, h: 0.36, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.tinta, charSpacing: 1.1, margin: 0, valign: "middle" });
      parrafo(s, p[2], { x: M + 5.5, y: y - 0.02, w: CW - 5.5, h: 0.66, size: 12.5 });
      linea(s, M, y - 0.14, M + CW, y - 0.14, C.grisClaro, 1);
    });
    linea(s, M, 2.6 + 4 * 0.8, M + CW, 2.6 + 4 * 0.8, C.grisClaro, 1);

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Por qué así", x: M, y: 5.88, w: CW, h: 0.85 });
    s.addText("Leer código ajeno y entenderlo es una competencia profesional. Escribirlo desde cero, hoy, no lo es todavía.", { x: r.x, y: r.y - 0.16, w: r.w, h: 0.4, fontFace: F.display, fontSize: 14, color: C.tinta, margin: 0, valign: "middle" });
    s.addNotes("El código completo está en la carpeta del laboratorio, en Python y en JavaScript. Se entrega antes de empezar el recorrido para que puedan seguirlo en pantalla.");
  }

  /* ---------- 30 · Código 1 · hash y avalancha ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · el código · 1 de 5", titulo: "Hash y efecto avalancha", ic: "funcion", tituloSize: 29 });
    caja(s, { x: M, y: 1.9, w: 7.15, h: 3.15, fill: C.tinta, line: C.tinta });
    s.addText([
      { text: "def ", options: { color: C.naranja } },
      { text: "hash_hex", options: { color: "FFA41B" } },
      { text: "(dato):\n", options: { color: "F4F2F7" } },
      { text: "    if ", options: { color: C.naranja } },
      { text: "isinstance(dato, str):\n", options: { color: "F4F2F7" } },
      { text: "        dato = dato.encode(", options: { color: "F4F2F7" } },
      { text: "\"utf-8\"", options: { color: "8FD98F" } },
      { text: ")\n", options: { color: "F4F2F7" } },
      { text: "    return ", options: { color: C.naranja } },
      { text: "hashlib.sha256(dato).hexdigest()\n\n", options: { color: "F4F2F7" } },
      { text: "def ", options: { color: C.naranja } },
      { text: "bits_distintos", options: { color: "FFA41B" } },
      { text: "(a, b):\n", options: { color: "F4F2F7" } },
      { text: "    return ", options: { color: C.naranja } },
      { text: "bin(int(a, 16) ^ int(b, 16)).count(", options: { color: "F4F2F7" } },
      { text: "\"1\"", options: { color: "8FD98F" } },
      { text: ")", options: { color: "F4F2F7" } },
    ], { x: M + 0.28, y: 2.12, w: 6.6, h: 2.7, fontFace: F.mono, fontSize: 12.5, lineSpacingMultiple: 1.25, margin: 0, valign: "top" });

    const notas = [
      ["¿POR QUÉ .encode()?", "SHA-256 hashea BYTES, no texto. Fijar utf-8 explícitamente es lo que hace que dos máquinas obtengan el mismo hash."],
      ["¿POR QUÉ XOR?", "El XOR pone a 1 exactamente los bits que difieren. Contar los unos da el número de bits distintos — comparar caracteres hexadecimales daría otra cosa: cada carácter son 4 bits."],
    ];
    notas.forEach((n, i) => {
      const y = 1.9 + i * 1.6;
      caja(s, { x: M + 7.35, y, w: 4.74, h: 1.45, fill: C.blanco, sombra: false });
      s.addText(n[0], { x: M + 7.6, y: y + 0.14, w: 4.3, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: C.ocre, charSpacing: 1.1, margin: 0, valign: "middle" });
      parrafo(s, n[1], { x: M + 7.6, y: y + 0.48, w: 4.3, h: 0.9, size: 11.5 });
    });

    linea(s, M, 5.35, M + CW, 5.35, C.naranja, 2);
    s.addText("PROMEDIO SOBRE 100 PARES QUE DIFIEREN EN UN CARÁCTER → ≈ 128 DE 256 BITS", { x: M, y: 5.5, w: CW, h: 0.34, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.ocre, charSpacing: 1.1, margin: 0, valign: "middle" });
    parrafo(s, "Ese número no está pactado en ninguna parte del código: emerge de la función. Es la propiedad del efecto avalancha, medida.", { y: 5.95, h: 0.6, size: 13 });
    s.addNotes("Preguntar antes de mostrar la segunda caja: ¿por qué no basta con comparar los dos hashes carácter a carácter?");
  }

  /* ---------- 31 · Código 2 · las tres convenciones ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · el código · 2 de 5", titulo: "Las tres convenciones, en tres líneas", ic: "comparar", tituloSize: 26 });
    caja(s, { x: M, y: 1.9, w: CW, h: 1.5, fill: C.tinta, line: C.tinta });
    s.addText([
      { text: "def ", options: { color: C.naranja } },
      { text: "_combinar", options: { color: "FFA41B" } },
      { text: "(izquierdo, derecho):\n", options: { color: "F4F2F7" } },
      { text: "    return ", options: { color: C.naranja } },
      { text: "hashlib.sha256(", options: { color: "F4F2F7" } },
      { text: "bytes.fromhex(izquierdo) + bytes.fromhex(derecho)", options: { color: "FFA41B" } },
      { text: ").hexdigest()", options: { color: "F4F2F7" } },
    ], { x: M + 0.28, y: 2.15, w: CW - 0.56, h: 1.0, fontFace: F.mono, fontSize: 13, lineSpacingMultiple: 1.3, margin: 0, valign: "top" });

    parrafo(s, "Una sola línea, y es donde se pierde la mitad de las parejas. Si en lugar de bytes.fromhex() se concatenan las cadenas de texto, el resultado es un hash perfectamente válido — y distinto del de todo el mundo.", { y: 3.55, h: 0.7, size: 14 });

    const conv = [
      ["1", "LAS HOJAS SON EL HASH DEL DATO", "No se mete el dato crudo en el árbol. Se hashea primero."],
      ["2", "SE CONCATENAN BYTES, NO TEXTO", "bytes.fromhex() convierte los 64 caracteres hexadecimales en los 32 bytes que representan."],
      ["3", "NIVEL IMPAR: SE DUPLICA EL ÚLTIMO", "Es una convención, no una ley matemática. Otras implementaciones eligen distinto — y obtienen otra raíz."],
    ];
    conv.forEach((c, i) => {
      const y = 4.4 + i * 0.78;
      s.addText(c[0], { x: M, y: y + 0.02, w: 0.4, h: 0.4, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      s.addText(c[1], { x: M + 0.55, y, w: 4.4, h: 0.4, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.tinta, charSpacing: 1.1, margin: 0, valign: "middle" });
      parrafo(s, c[2], { x: M + 5.15, y: y - 0.02, w: CW - 5.15, h: 0.65, size: 12.5 });
      linea(s, M, y - 0.14, M + CW, y - 0.14, C.grisClaro, 1);
    });
    linea(s, M, 4.26 + 3 * 0.78, M + CW, 4.26 + 3 * 0.78, C.grisClaro, 1);
    s.addNotes("Si una pareja obtiene una raíz distinta a la del resto, la causa está en una de estas tres. En ese orden de probabilidad.");
  }

  /* ---------- 32 · Código 3 · construir el árbol ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · el código · 3 de 5", titulo: "Construir el árbol: un bucle que sube", ic: "arbol", tituloSize: 27 });
    caja(s, { x: M, y: 1.9, w: 7.15, h: 3.5, fill: C.tinta, line: C.tinta });
    s.addText([
      { text: "def ", options: { color: C.naranja } },
      { text: "construir_arbol", options: { color: "FFA41B" } },
      { text: "(hojas):\n", options: { color: "F4F2F7" } },
      { text: "    nivel = [hash_hex(h) ", options: { color: "F4F2F7" } },
      { text: "for ", options: { color: C.naranja } },
      { text: "h ", options: { color: "F4F2F7" } },
      { text: "in ", options: { color: C.naranja } },
      { text: "hojas]\n", options: { color: "F4F2F7" } },
      { text: "    niveles = []\n", options: { color: "F4F2F7" } },
      { text: "    while True:\n", options: { color: C.naranja } },
      { text: "        if ", options: { color: C.naranja } },
      { text: "len(nivel) > 1 ", options: { color: "F4F2F7" } },
      { text: "and ", options: { color: C.naranja } },
      { text: "len(nivel) % 2 == 1:\n", options: { color: "F4F2F7" } },
      { text: "            nivel = nivel + [nivel[-1]]\n", options: { color: "FFA41B" } },
      { text: "        niveles.append(nivel)\n", options: { color: "F4F2F7" } },
      { text: "        if ", options: { color: C.naranja } },
      { text: "len(nivel) == 1: ", options: { color: "F4F2F7" } },
      { text: "return ", options: { color: C.naranja } },
      { text: "niveles\n", options: { color: "F4F2F7" } },
      { text: "        nivel = [_combinar(nivel[i], nivel[i+1])\n", options: { color: "F4F2F7" } },
      { text: "                 ", options: { color: "F4F2F7" } },
      { text: "for ", options: { color: C.naranja } },
      { text: "i ", options: { color: "F4F2F7" } },
      { text: "in ", options: { color: C.naranja } },
      { text: "range(0, len(nivel), 2)]", options: { color: "F4F2F7" } },
    ], { x: M + 0.28, y: 2.12, w: 6.6, h: 3.05, fontFace: F.mono, fontSize: 11.5, lineSpacingMultiple: 1.22, margin: 0, valign: "top" });

    const notas = [
      ["8 → 4 → 2 → 1", "Cada vuelta del bucle reduce el nivel a la mitad. Por eso la altura del árbol es log₂(n), y por eso la prueba de inclusión también."],
      ["¿POR QUÉ DEVUELVE TODOS LOS NIVELES?", "Porque generar_prueba() los necesita: para subir por el árbol hay que saber quién era el hermano en cada escalón."],
    ];
    notas.forEach((n, i) => {
      const y = 1.9 + i * 1.8;
      caja(s, { x: M + 7.35, y, w: 4.74, h: 1.65, fill: C.blanco, sombra: false });
      s.addText(n[0], { x: M + 7.6, y: y + 0.14, w: 4.3, h: 0.32, fontFace: F.mono, fontSize: 10, bold: true, color: C.ocre, charSpacing: 1.1, margin: 0, valign: "middle" });
      parrafo(s, n[1], { x: M + 7.6, y: y + 0.5, w: 4.3, h: 1.05, size: 11.5 });
    });

    parrafo(s, "La línea naranja es la convención 3. Es la única decisión arbitraria de toda la función — y es la que hay que acordar antes de comparar resultados con otra pareja.", { y: 5.65, h: 0.65, size: 13 });
    s.addNotes("Recorrer el bucle en voz alta con 8 hojas: primera vuelta guarda 8 y produce 4; segunda guarda 4 y produce 2; tercera guarda 2 y produce 1; cuarta guarda 1 y devuelve.");
  }

  /* ---------- 33 · Código 4 · la prueba ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · el código · 4 de 5", titulo: "Generar y verificar la prueba", ic: "arbol", tituloSize: 28 });
    caja(s, { x: M, y: 1.9, w: CW / 2 - 0.12, h: 2.55, fill: C.tinta, line: C.tinta });
    s.addText([
      { text: "def ", options: { color: C.naranja } },
      { text: "generar_prueba", options: { color: "FFA41B" } },
      { text: "(hojas, indice):\n", options: { color: "F4F2F7" } },
      { text: "    niveles = construir_arbol(hojas)\n", options: { color: "F4F2F7" } },
      { text: "    prueba, idx = [], indice\n", options: { color: "F4F2F7" } },
      { text: "    for ", options: { color: C.naranja } },
      { text: "nivel ", options: { color: "F4F2F7" } },
      { text: "in ", options: { color: C.naranja } },
      { text: "niveles[:-1]:\n", options: { color: "F4F2F7" } },
      { text: "        if ", options: { color: C.naranja } },
      { text: "idx % 2 == 0:\n", options: { color: "F4F2F7" } },
      { text: "            prueba.append((nivel[idx+1], ", options: { color: "F4F2F7" } },
      { text: "\"der\"", options: { color: "8FD98F" } },
      { text: "))\n", options: { color: "F4F2F7" } },
      { text: "        else:\n", options: { color: C.naranja } },
      { text: "            prueba.append((nivel[idx-1], ", options: { color: "F4F2F7" } },
      { text: "\"izq\"", options: { color: "8FD98F" } },
      { text: "))\n", options: { color: "F4F2F7" } },
      { text: "        idx = idx // 2\n", options: { color: "FFA41B" } },
      { text: "    return ", options: { color: C.naranja } },
      { text: "prueba", options: { color: "F4F2F7" } },
    ], { x: M + 0.24, y: 2.1, w: CW / 2 - 0.6, h: 2.15, fontFace: F.mono, fontSize: 10.5, lineSpacingMultiple: 1.2, margin: 0, valign: "top" });

    caja(s, { x: M + CW / 2 + 0.12, y: 1.9, w: CW / 2 - 0.12, h: 2.55, fill: C.tinta, line: C.tinta });
    s.addText([
      { text: "def ", options: { color: C.naranja } },
      { text: "verificar_prueba", options: { color: "FFA41B" } },
      { text: "(dato, prueba, raiz):\n", options: { color: "F4F2F7" } },
      { text: "    actual = hash_hex(dato)\n", options: { color: "F4F2F7" } },
      { text: "    for ", options: { color: C.naranja } },
      { text: "hermano, lado ", options: { color: "F4F2F7" } },
      { text: "in ", options: { color: C.naranja } },
      { text: "prueba:\n", options: { color: "F4F2F7" } },
      { text: "        if ", options: { color: C.naranja } },
      { text: "lado == ", options: { color: "F4F2F7" } },
      { text: "\"izq\"", options: { color: "8FD98F" } },
      { text: ":\n", options: { color: "F4F2F7" } },
      { text: "            actual = _combinar(hermano, actual)\n", options: { color: "FFA41B" } },
      { text: "        else:\n", options: { color: C.naranja } },
      { text: "            actual = _combinar(actual, hermano)\n", options: { color: "FFA41B" } },
      { text: "    return ", options: { color: C.naranja } },
      { text: "actual == raiz", options: { color: "F4F2F7" } },
    ], { x: M + CW / 2 + 0.36, y: 2.1, w: CW / 2 - 0.6, h: 2.15, fontFace: F.mono, fontSize: 10.5, lineSpacingMultiple: 1.2, margin: 0, valign: "top" });

    const r = await ficha(s, { tipo: "alerta", etiqueta: "Las dos líneas naranja son el mismo tema", x: M, y: 4.6, w: CW, h: 1.55 });
    parrafo(s, "A la izquierda, idx // 2 es «subir un escalón». A la derecha, el orden de la concatenación depende del lado. Si se ignora el lado y se concatena siempre igual, la verificación falla la mitad de las veces — y falla de forma intermitente, que es lo peor que le puede pasar a un error.", { x: r.x, y: r.y - 0.06, w: r.w, h: 0.85, size: 12.5 });

    parrafo(s, "Nótese lo que verificar_prueba NO recibe: el conjunto de datos. Solo el dato, los hashes hermanos y la raíz. Ahí está toda la utilidad de la estructura.", { y: 6.28, h: 0.55, size: 12.5, color: C.gris });
    s.addNotes("Cerrar esta lámina con la Fig. 2 del bloque C proyectada al lado, si se puede: el código y el dibujo dicen exactamente lo mismo.");
  }

  /* ---------- 34 · Código 5 · córranlo ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · el código · 5 de 5", titulo: "Ahora córranlo ustedes", ic: "matraz", tituloSize: 29 });
    parrafo(s, "Quince minutos. En parejas, con el código ya en la máquina.", { y: 1.88, h: 0.4, size: 14 });

    const pasos = [
      ["01", "EJECUTAR EL ARCHIVO", "python merkle.py  ·  o  node merkle.js\nDebe imprimir los dos hashes de referencia, los bits distintos y la raíz de ocho elementos."],
      ["02", "COMPARAR LA RAÍZ", "La raíz de lote-000 … lote-007 debe empezar por 53c895e4. Si no coincide, revisen las tres convenciones."],
      ["03", "ROMPERLA", "Cambien un solo carácter de un solo dato. Vuelvan a ejecutar. La raíz cambia por completo: el compromiso, en su propia pantalla."],
      ["04", "PEDIR UNA PRUEBA", "generar_prueba(lotes, 2) devuelve 3 hashes. Verifíquenla. Después verifiquen un dato que NO está y comprueben que devuelve falso."],
    ];
    pasos.forEach((p, i) => {
      const y = 2.45 + i * 0.86;
      s.addText(p[0], { x: M, y: y + 0.04, w: 0.7, h: 0.44, fontFace: F.display, fontSize: 22, color: C.naranja, margin: 0, valign: "middle" });
      s.addText(p[1], { x: M + 0.8, y, w: 3.5, h: 0.36, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.tinta, charSpacing: 1.1, margin: 0, valign: "middle" });
      parrafo(s, p[2], { x: M + 4.5, y: y - 0.02, w: CW - 4.5, h: 0.72, size: 12.5 });
      linea(s, M, y - 0.14, M + CW, y - 0.14, C.grisClaro, 1);
    });
    linea(s, M, 2.31 + 4 * 0.86, M + CW, 2.31 + 4 * 0.86, C.grisClaro, 1);

    caja(s, { x: M, y: 5.92, w: CW, h: 0.72, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("RAÍZ DE REFERENCIA  ·  53c895e4efd5451ab9e313d532203158e907660d0e5d860a5a5cc99ada592fa3", { x: M + 0.25, y: 5.92, w: CW - 0.5, h: 0.72, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.ocre, align: "center", valign: "middle", margin: 0 });
    s.addNotes("Circular durante estos quince minutos. El fallo más común es que no instalaron nada y no pueden ejecutar: emparejar con quien sí.");
  }

  /* ---------- 35 · El visor ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · herramienta de apoyo", titulo: "El visor de árboles de Merkle", ic: "arbol", tituloSize: 28 });
    parrafo(s, "Una página que implementa exactamente estas mismas tres convenciones. Sirve para comprobar el propio código y para ver el árbol completo, que en texto no se aprecia.", { y: 1.9, h: 0.65, size: 14.5 });

    const funciones = [
      ["EDITAR LOS DATOS", "y ver la raíz cambiar al instante, con la anterior tachada al lado."],
      ["CLIC EN UNA HOJA", "resalta en violeta el camino hasta la raíz y en naranja los hashes que forman la prueba."],
      ["VERIFICACIÓN PASO A PASO", "cada combinación, con el lado y el valor intermedio, hasta comparar con la raíz."],
      ["PROBAR CON UN DATO FALSO", "muestra el rechazo. Una verificación que solo acepta lo correcto está a medio escribir."],
    ];
    funciones.forEach((f, i) => {
      const x = M + (i % 2) * (CW / 2 + 0.12);
      const y = 2.65 + Math.floor(i / 2) * 1.4;
      caja(s, { x, y, w: CW / 2 - 0.12, h: 1.22, fill: i === 3 ? C.blanco : C.superf, line: i === 3 ? C.naranja : C.tinta, sombraColor: i === 3 ? C.naranja : C.tinta, sombra: i === 3 });
      s.addText(f[0], { x: x + 0.3, y: y + 0.16, w: CW / 2 - 0.72, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: i === 3 ? C.ocre : C.tinta, charSpacing: 1.2, margin: 0, valign: "middle" });
      parrafo(s, f[1], { x: x + 0.3, y: y + 0.52, w: CW / 2 - 0.72, h: 0.7, size: 12.5 });
    });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Lo importante", x: M, y: 5.45, w: CW, h: 1.25 });
    s.addText("La raíz del visor y la de su código deben ser idénticas. Si no lo son, la diferencia está en una de las tres convenciones.", { x: r.x, y: r.y - 0.1, w: r.w, h: 0.6, fontFace: F.display, fontSize: 15, color: C.tinta, margin: 0, valign: "middle" });
    s.addNotes("Proyectar el visor en vivo mientras se explica. Editar un dato delante del grupo y dejar que vean la raíz anterior tachada.");
  }

  /* ---------- 36 · El trabajo ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · trabajo del semestre", titulo: "Construyan su propia interfaz", ic: "pantalla", tituloSize: 28 });
    parrafo(s, "A partir del código que acaban de ejecutar, construir una interfaz web que lo haga visible. No hay que reimplementar la criptografía: ya está resuelta y probada.", { y: 1.9, h: 0.65, size: 14.5 });

    caja(s, { x: M, y: 2.7, w: CW, h: 1.9, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("MÍNIMO EXIGIBLE", { x: M + 0.32, y: 2.92, w: 5, h: 0.32, fontFace: F.mono, fontSize: 11, bold: true, color: C.violetaOs, charSpacing: 1.4, margin: 0, valign: "middle" });
    parrafo(s, "Un campo para introducir varios datos · la raíz calculada y visible · que la raíz cambie al editar un dato · y que se vea, de alguna forma, la estructura del árbol.", { x: M + 0.32, y: 3.32, w: CW - 0.64, h: 1.15, size: 14 });

    const extras = [
      ["SUMA", "Prueba de inclusión al hacer clic en un elemento."],
      ["SUMA", "Verificación paso a paso, mostrando cada combinación."],
      ["SUMA", "Rechazo visible de un elemento que no pertenece."],
    ];
    extras.forEach((e, i) => {
      const x = M + i * (CW / 3 + 0.06);
      caja(s, { x, y: 4.85, w: CW / 3 - 0.12, h: 1.05, fill: C.superf, sombra: false });
      s.addText(e[0], { x: x + 0.26, y: 4.99, w: 2, h: 0.28, fontFace: F.mono, fontSize: 9.5, bold: true, color: C.ocre, charSpacing: 1.2, margin: 0, valign: "middle" });
      parrafo(s, e[1], { x: x + 0.26, y: 5.28, w: CW / 3 - 0.64, h: 0.55, size: 12 });
    });

    parrafo(s, "Tecnología libre. Puede ser una sola página con HTML y JavaScript, o el marco de trabajo que prefieran. Lo que se evalúa es que funcione y que se entienda lo que muestra.", { y: 6.15, h: 0.6, size: 13, color: C.gris });
    s.addNotes("Trabajo en parejas. Plazo y peso los fija el docente. El visor que se acaba de proyectar es la referencia de lo que se espera, no el techo.");
  }

  /* ---------- 34 · Errores frecuentes I ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · proyectar antes de empezar", titulo: "Errores frecuentes · 1 de 2", ic: "equis", tituloSize: 28 });
    tabla(s, ["síntoma", "causa y solución"], [
      ["El hash cambia entre ejecuciones", "Se está hasheando un objeto cuya representación varía —un diccionario sin orden fijo, o algo con marca temporal—. Hay que hashear BYTES de una serialización determinista, no la representación de un objeto."],
      ["El hash no coincide con el de un compañero", "Codificación de texto distinta, o un salto de línea invisible al final de la cadena. Fijar utf-8 explícitamente y comprobar la longitud en bytes antes de hashear."],
      ["La raíz no coincide con la de otra pareja", "Casi siempre una de tres: se concatenan CADENAS HEXADECIMALES en lugar de BYTES; se hashea el elemento crudo en lugar de su hash al construir las hojas; o se resuelve distinto el nivel impar. Acordar las tres convenciones antes de comparar."],
    ], { y: 1.95, h: 4.3, colW: [4.0, 8.093], size: 12 });
    s.addNotes("Estos tres explican el 80 % de las preguntas del laboratorio. Proyectarlos antes ahorra media hora.");
  }

  /* ---------- 35 · Errores frecuentes II ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · proyectar antes de empezar", titulo: "Errores frecuentes · 2 de 2", ic: "equis", tituloSize: 28 });
    tabla(s, ["síntoma", "causa y solución"], [
      ["La verificación falla la mitad de las veces", "No se está respetando el orden izquierda/derecha al concatenar con el hermano. Es el error más común de la parte 3: la prueba debe guardar la posición, no solo el hash."],
      ["El promedio de bits distintos da lejos de 128", "Se están comparando caracteres hexadecimales en lugar de bits. Cada carácter hexadecimal son 4 bits: hay que convertir a entero y usar XOR, no comparar cadenas posición a posición."],
      ["En JavaScript los números salen mal", "256 bits no caben en el tipo numérico por defecto. Usar BigInt para las operaciones de bits, o trabajar directamente sobre Buffer byte a byte."],
      ["La biblioteca de «SHA-3» da otro resultado", "Es la trampa de C.3: unas bibliotecas llaman sha3 a la variante de Ethereum y otras a la del estándar. Comprobar contra un valor conocido antes de confiar."],
    ], { y: 1.95, h: 4.3, colW: [4.0, 8.093], size: 12 });
    s.addNotes("El último remite directamente a la alerta de C.3. Aparece cada semestre.");
  }

  /* ---------- 36 · DIVISOR E ---------- */
  (await divisor({ letra: "E", titulo: "Cierre", sub: "Qué llevarse, qué entregar y qué viene en la Sesión 3.", minutos: "MIN 170 — 180 · PLENARIA", ic: "bandera" })).addNotes("Min 170–180. Síntesis, entregable y lo que viene en la Sesión 3. No abrir temas nuevos.");

  /* ---------- 37 · Qué llevarse ---------- */
  {
    const s = await lamina({ kicker: "Bloque E · síntesis", titulo: "Lo que hay que llevarse de esta sesión", ic: "bandera", tituloSize: 26 });
    const ideas = [
      ["UNO", "Un hash NO es cifrado, ni compresión, ni azar, ni firma. Es una función determinista de un solo sentido."],
      ["DOS", "Las colisiones EXISTEN NECESARIAMENTE: infinitas entradas, finitas salidas. La seguridad está en que nadie pueda encontrarlas."],
      ["TRES", "El EFECTO AVALANCHA ya no es una afirmación: cada pareja lo midió y obtuvo alrededor de 128 bits sobre 256."],
      ["CUATRO", "La RAÍZ DE MERKLE es un compromiso sobre todo el conjunto. Por eso alterar una transacción rompe el bloque, y romper el bloque rompe la cadena."],
      ["CINCO", "Se puede probar pertenencia con LOG₂(N) HASHES. Mil millones de elementos caben en una prueba de menos de un kilobyte."],
      ["SEIS", "La función se elige POR EL PROBLEMA: rápida para verificar cadenas, deliberadamente lenta para guardar contraseñas."],
    ];
    ideas.forEach((it, i) => {
      const y = 1.95 + i * 0.78;
      s.addText(it[0], { x: M, y: y + 0.02, w: 1.35, h: 0.4, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.naranja, charSpacing: 1.4, margin: 0, valign: "middle" });
      parrafo(s, it[1], { x: M + 1.5, y: y - 0.03, w: CW - 1.5, h: 0.7, size: 13 });
      linea(s, M, y - 0.14, M + CW, y - 0.14, C.grisClaro, 1);
    });
    linea(s, M, 1.81 + 6 * 0.78, M + CW, 1.81 + 6 * 0.78, C.grisClaro, 1);
    s.addNotes("Preguntar cuál de las seis les resultó más contraintuitiva. Suele ser la cinco.");
  }

  /* ---------- 38 · Puente ---------- */
  {
    const s = await lamina({ kicker: "Bloque E · puente", titulo: "Hoy resolvimos la mitad del problema", ic: "profundidad", tituloSize: 28 });
    parrafo(s, "Sabemos comprobar que un dato no cambió. Pero un hash lo puede calcular cualquiera, y por lo tanto no dice nada sobre QUIÉN escribió el dato.", { y: 1.9, h: 0.65, size: 15 });

    caja(s, { x: M, y: 2.7, w: CW, h: 1.55, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    parrafo(s, "En la demostración de apertura hubo un momento en el que el docente pulsó «Confirmar» y la red aceptó la transacción como suya. Nadie mostró un documento de identidad. ¿Cómo se logra eso?", { x: M + 0.34, y: 2.95, w: CW - 0.68, h: 1.05, size: 14.5 });

    caja(s, { x: M, y: 4.5, w: CW, h: 1.95, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("SESIÓN 03 · FIRMAS DIGITALES Y ANATOMÍA DE LA CADENA", { x: M + 0.34, y: 4.75, w: 9, h: 0.34, fontFace: F.mono, fontSize: 11, bold: true, color: C.violetaOs, charSpacing: 1.4, margin: 0, valign: "middle" });
    parrafo(s, "Criptografía asimétrica, firma con curva elíptica, y la construcción completa clave privada → clave pública → dirección que hoy quedó dibujada pero no demostrada. Con las firmas disponibles, el laboratorio construye la mini-blockchain con transacciones firmadas de verdad.", { x: M + 0.34, y: 5.15, w: CW - 0.68, h: 1.1, size: 13.5 });
    s.addNotes("Pregunta de la semana: ¿qué le falta a un hash para poder demostrar además quién escribió el dato? Intente diseñar un esquema que lo consiga y encuentre el punto donde falla.");
  }

  /* ---------- 39 · Glosario I ---------- */
  const glosario = [
    ["Árbol de Merkle", "Merkle tree", "Árbol binario en el que cada hoja es el hash de un dato y cada nodo interno es el hash de la concatenación de sus dos hijos. Resume un conjunto entero en un único valor."],
    ["Colisión", "", "Par de entradas distintas que producen el mismo hash. Existen necesariamente; la seguridad consiste en que sean inencontrables, no inexistentes."],
    ["Digest", "resumen", "Sinónimo de hash: la salida de longitud fija que produce la función. También «huella digital»."],
    ["Efecto avalancha", "", "Propiedad por la cual un cambio mínimo en la entrada altera aproximadamente la mitad de los bits de la salida, de forma impredecible."],
    ["Función hash criptográfica", "", "Función determinista que convierte una entrada de longitud arbitraria en una salida de longitud fija, barata de calcular e inviable de invertir."],
    ["Keccak-256", "", "Función hash de 256 bits que usa Ethereum en todo. Corresponde a la versión original del concurso SHA-3 y NO coincide con SHA3-256, que lleva un relleno distinto."],
    ["Paradoja del cumpleaños", "", "Fenómeno por el cual hallar cualquier coincidencia dentro de un conjunto es mucho más barato que hallar una coincidencia con un elemento fijo. Explica que la resistencia a colisiones sea del orden de 2ⁿ/²."],
    ["Preimagen", "", "Entrada que produce un hash dado. La resistencia a preimagen exige que, conocido el hash, sea inviable hallar una entrada que lo genere."],
    ["Prueba de inclusión", "Merkle proof", "Conjunto mínimo de hashes hermanos que permite verificar que un elemento pertenece a un conjunto conociendo solo la raíz. Su tamaño crece como log₂(n)."],
    ["Raíz de Merkle", "Merkle root", "Nodo superior del árbol. Compromiso sobre el conjunto completo: cambiar cualquier elemento la cambia. Es uno de los campos de la cabecera de un bloque."],
    ["Sal", "salt", "Valor aleatorio que se añade a una entrada antes de hashearla para que entradas iguales produzcan salidas distintas. Imprescindible con contraseñas; no se usa en una cadena de bloques, cuyos hashes deben ser reproducibles."],
    ["Segunda preimagen", "", "Mensaje distinto de uno dado que produce su mismo hash. Más difícil de hallar que una colisión, porque uno de los dos mensajes está fijado."],
    ["SHA-256", "", "Función hash de 256 bits de la familia SHA-2. La que usa Bitcoin en identificadores, árboles de Merkle y prueba de trabajo."],
  ];
  {
    /* Reparto fijo 6 + 7 y alto de fila según el largo de la definición:
       con filas iguales, las definiciones de tres renglones pisaban la siguiente. */
    const paginas = [glosario.slice(0, 6), glosario.slice(6)];
    const PAGS = paginas.length;
    const altoFila = (g) => (g[2].length > 190 ? 0.83 : 0.63);
    for (let p = 0; p < PAGS; p++) {
      const trozo = paginas[p];
      const s = await lamina({
        kicker: `Anexo · glosario de la sesión · ${p + 1} de ${PAGS}`,
        titulo: p === 0 ? "Glosario de la sesión" : "Glosario · continuación",
        ic: "lista", tituloSize: 28,
      });
      if (p === 0) parrafo(s, "Solo los términos que introduce esta sesión. Los de la Sesión 1 no se repiten y siguen siendo exigibles.", { y: 1.88, h: 0.35, size: 12.5, color: C.gris });
      const y0 = p === 0 ? 2.35 : 1.98;
      let yAcum = y0;
      trozo.forEach((g) => {
        const y = yAcum;
        yAcum += altoFila(g);
        s.addText(g[0], { x: M, y, w: 2.6, h: 0.36, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.tinta, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
        if (g[1]) s.addText(g[1], { x: M + 2.7, y: y + 0.03, w: 1.8, h: 0.3, fontFace: F.mono, fontSize: 9, color: C.violetaOs, margin: 0, valign: "top" });
        parrafo(s, g[2], { x: M + 4.65, y: y - 0.03, w: CW - 4.65, h: altoFila(g) - 0.07, size: 11.5 });
        linea(s, M, y - 0.12, M + CW, y - 0.12, C.grisClaro, 1);
      });
      linea(s, M, yAcum - 0.12, M + CW, yAcum - 0.12, C.grisClaro, 1);
      s.addNotes("Glosario acumulativo del curso: cada sesión añade entradas y ninguna se elimina.");
    }
  }

  /* ---------- Fuentes ---------- */
  {
    const s = await lamina({ kicker: "Anexo · fuentes y lecturas", titulo: "Fuentes", ic: "documento", tituloSize: 30 });
    const cols = [
      ["FUENTES PRIMARIAS", [
        "Merkle, R. (1979). A Certified Digital Signature. Origen de la estructura.",
        "Nakamoto, S. (2008). Bitcoin. Sección 7 «Reclaiming Disk Space» y sección 8 «Simplified Payment Verification».",
        "Especificaciones oficiales de SHA-2 y SHA-3 del instituto de estándares estadounidense.",
      ]],
      ["AMPLIACIÓN RECOMENDADA", [
        "Antonopoulos, A. Mastering Bitcoin. Capítulo sobre estructura del bloque y árboles de Merkle. Libre acceso.",
        "Narayanan, A. et al. Bitcoin and Cryptocurrency Technologies. Capítulo 1, primitivas criptográficas.",
        "Documentación de Solidity, entrada del operador keccak256 — anticipa su uso desde la Sesión 6.",
      ]],
    ];
    let y = 1.95;
    cols.forEach(c => {
      const h = 0.42 + c[1].length * 0.40;
      caja(s, { x: M, y, w: CW, h, fill: C.blanco, sombra: false });
      s.addText(c[0], { x: M + 0.3, y: y + 0.12, w: 6, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
      lista(s, c[1], { x: M + 0.3, y: y + 0.46, w: CW - 0.6, h: h - 0.52, size: 12, gap: 3 });
      y += h + 0.22;
    });

    s.addNotes("Es la trampa señalada en C.3 y aparece cada semestre.");
  }

  /* ---------- CIERRE ---------- */
  {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addImage({ data: await icono("cadena", C.naranja), x: M, y: 1.55, w: 0.42, h: 0.42 });
    s.addText("FIN DE LA SESIÓN 02", {
      x: M + 0.6, y: 1.53, w: 8, h: 0.44, fontFace: F.mono, fontSize: 12, color: C.naranja, charSpacing: 2, margin: 0, valign: "middle",
    });
    s.addText("PRÓXIMA SESIÓN:\nFIRMAS DIGITALES", {
      x: M, y: 2.35, w: 11.5, h: 2.0, fontFace: F.display, fontSize: 46, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 0.98,
    });
    s.addText("Criptografía asimétrica, ECDSA y la mini-blockchain con transacciones firmadas de verdad. Entregable de hoy: repositorio con la suite de pruebas pasando, antes de que empiece.", {
      x: M, y: 4.45, w: 9.8, h: 0.95, fontFace: F.body, fontSize: 16, color: "B9B4C4", margin: 0, valign: "top", lineSpacingMultiple: 1.28,
    });
    s.addText("Universidad de San Buenaventura Medellín · Facultad de Ingeniería\nBlockchain y Web 3.0 · Unidad I · Sesión 02 de 17", {
      x: M, y: 5.95, w: 9.5, h: 0.8, fontFace: F.mono, fontSize: 10, color: "6E6A7C", margin: 0, valign: "top", lineSpacingMultiple: 1.35,
    });
    s.addNotes("Cerrar con la próxima sesión: firmas digitales y la mini-blockchain. Recordar el entregable (repositorio con la suite de pruebas pasando, antes de que empiece la Sesión 3) y que el laboratorio 02 trae una dependencia nueva que hay que instalar antes. 1 minuto.");
    nSlide++;
  }

  const salida = "D:/Curso Blockchain y Web 3.0/material/Sesion-02-Blockchain-Web3.pptx";
  await pres.writeFile({ fileName: salida });
  console.log("Generado:", salida, "·", nSlide, "láminas");
}

construir().catch(e => { console.error(e); process.exit(1); });
