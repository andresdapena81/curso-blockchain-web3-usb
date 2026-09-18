/* =====================================================================
   Blockchain y Web 3.0 — Universidad de San Buenaventura Medellín
   Generador del deck de la Sesión 03
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
  s.addText("SESIÓN 03 · FIRMAS DIGITALES Y ANATOMÍA DE LA CADENA", {
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
   CONSTRUCCIÓN DEL DECK · SESIÓN 03
   ===================================================================== */

Object.assign(ICONOS, {
  candado:    "M5 11h14v10H5zM8 11V7a4 4 0 018 0v4M12 15v3",
  firma:      "M3 21c4-1 6-3 9-6l6-6-3-3-6 6c-3 3-5 5-6 9zM14 6l4 4M4 17l3 3",
  derivacion: "M3 6h6v5H3zM15 13h6v5h-6zM9 8.5h6M15 8.5l-3-3M15 8.5l-3 3M9 15.5H3M3 15.5l3-3M3 15.5l3 3",
  capas:      "M4 4h16v6H4zM4 14h16v6H4z",
  red:        "M12 3a2 2 0 100 4 2 2 0 000-4zM5 17a2 2 0 100 4 2 2 0 000-4zM19 17a2 2 0 100 4 2 2 0 000-4zM12 7v3M11 11 6.5 15.5M13 11l4.5 4.5",
  matraz:     "M9 3h6M10 3v6L4 20h16L14 9V3M7 15h10",
});

async function construir() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Universidad de San Buenaventura Medellín";
  pres.title = "Blockchain y Web 3.0 — Sesión 03";
  pres.subject = "Firmas digitales y anatomía de la cadena";

  /* ---------- PORTADA ---------- */
  {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 4.1, h: H, fill: { color: C.naranja }, line: { width: 0 } });
    s.addText("03", { x: 0, y: 2.1, w: 4.1, h: 3.0, fontFace: F.display, fontSize: 190, color: C.tinta, align: "center", valign: "middle", margin: 0 });
    s.addImage({ data: await icono("cadena", C.naranja), x: 4.8, y: 1.28, w: 0.34, h: 0.34 });
    s.addText("UNIDAD I · FUNDAMENTOS DE SISTEMAS DISTRIBUIDOS CONFIABLES", {
      x: 5.26, y: 1.26, w: 7.5, h: 0.38, fontFace: F.mono, fontSize: 10.5, color: C.naranja, charSpacing: 1.6, margin: 0, valign: "middle",
    });
    s.addText("FIRMAS DIGITALES\nY ANATOMÍA DE LA CADENA", {
      x: 4.8, y: 1.95, w: 7.95, h: 2.5, fontFace: F.display, fontSize: 43, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 0.95,
    });
    s.addText("Blockchain y Web 3.0 · Ingeniería de Sistemas\nUniversidad de San Buenaventura Medellín", {
      x: 4.8, y: 4.62, w: 7.95, h: 0.8, fontFace: F.body, fontSize: 14.5, color: "B9B4C4", margin: 0, valign: "top", lineSpacingMultiple: 1.25,
    });
    const meta = [["180 MIN", "duración"], ["TEÓRICO-\nPRÁCTICA", "modalidad"], ["LAB 01\nENTREGADO", "prerrequisito"], ["MINI-\nBLOCKCHAIN", "entregable"]];
    meta.forEach((m, i) => {
      const x = 4.8 + i * 2.0;
      s.addText(m[0], { x, y: 5.72, w: 1.85, h: 0.5, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
      s.addText(m[1].toUpperCase(), { x, y: 6.24, w: 1.85, h: 0.28, fontFace: F.mono, fontSize: 8.5, color: "A39EAF", charSpacing: 1.2, margin: 0, valign: "top" });
    });
    s.addNotes("Abrir con la plenaria de la pregunta de la semana: ¿qué le falta a un hash para demostrar además quién escribió el dato? Recoger dos o tres propuestas y anunciar que hoy se responde. Esta sesión cierra la parte técnica de la Unidad I. 3 minutos.");
    nSlide++;
  }

  
  /* ---------- 02 · Requisitos ---------- */
  {
    const s = await lamina({ kicker: "Preliminar · para poder trabajar hoy", titulo: "Lo que hay que traer", ic: "libro", tituloSize: 29 });
    const items = [
      ["01", "EL LABORATORIO 01 FUNCIONANDO", "El de hoy REUTILIZA la función de hash y el árbol de Merkle de la sesión pasada. Se entrega una implementación de referencia, pero conviene llegar con la propia."],
      ["02", "LA DEPENDENCIA NUEVA INSTALADA", "Está en el archivo de requisitos del laboratorio. Instalarla antes de clase ahorra diez minutos."],
      ["03", "LA PREGUNTA DE LA SEMANA PENSADA", "Qué le falta a un hash para demostrar además quién escribió el dato. Abre la sesión."],
    ];
    items.forEach((it, i) => {
      const y = 2.2 + i * 1.2;
      s.addText(it[0], { x: M, y: y + 0.05, w: 0.8, h: 0.5, fontFace: F.display, fontSize: 26, color: C.naranja, margin: 0, valign: "middle" });
      s.addText(it[1], { x: M + 0.95, y, w: 5.2, h: 0.4, fontFace: F.mono, fontSize: 11, bold: true, color: C.tinta, charSpacing: 1.15, margin: 0, valign: "middle" });
      parrafo(s, it[2], { x: M + 6.3, y: y - 0.02, w: CW - 6.3, h: 1.1, size: 13 });
      linea(s, M, y - 0.18, M + CW, y - 0.18, C.grisClaro, 1);
    });
    linea(s, M, 2.02 + 3 * 1.2, M + CW, 2.02 + 3 * 1.2, C.grisClaro, 1);
    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Dónde estamos", x: M, y: 5.78, w: CW, h: 0.92 });
    s.addText("Esta sesión cierra la Unidad I: después de hoy, todo lo que la Sesión 1 afirmó queda demostrado y programado.", { x: r.x, y: r.y - 0.14, w: r.w, h: 0.4, fontFace: F.display, fontSize: 13.5, color: C.tinta, margin: 0, valign: "middle" });
    s.addNotes("Comprobar entornos en la apertura.");
  }

  /* ---------- MAPA ---------- */
  {
    const s = await lamina({ kicker: "Preliminar · estructura de los 180 minutos", titulo: "Mapa de la sesión", ic: "rejilla" });
    tabla(s, ["min", "bloque", "contenido"], [
      ["00–10", "Apertura", "Plenaria de la pregunta de la semana y revisión del entregable de la Sesión 2."],
      ["10–25", "A.1", "El problema de la autoría: por qué un hash no basta y por qué fallan los intentos ingenuos."],
      ["25–42", "A.2", "Criptografía asimétrica: la función de un solo sentido con trampa y la curva secp256k1."],
      ["42–58", "A.3", "ECDSA: firmar y verificar. Qué prueba una firma y qué no. El fallo que revela la clave."],
      ["58–70", "A.4", "De clave pública a dirección: keccak-256, los últimos 20 bytes y el checksum EIP-55."],
      ["70–78", "Pausa", "—"],
      ["78–92", "B.1", "Anatomía del bloque: cabecera y cuerpo, campo por campo."],
      ["92–105", "B.2", "Encadenamiento e inmutabilidad, ahora con todas las piezas en la mano."],
      ["105–118", "B.3", "La red P2P: propagación, mempool y el conflicto que queda abierto."],
      ["118–170", "BLOQUE C", "Laboratorio 02: firmas, dirección y mini-blockchain con transacciones firmadas."],
      ["170–180", "BLOQUE D", "Cierre, entregable y puente hacia el consenso."],
    ], { y: 1.92, h: 4.9, colW: [1.15, 1.5, 9.443], size: 11 });
    s.addNotes("Tras esta sesión, todo lo que la Sesión 1 afirmó sin demostrar queda demostrado y programado por los propios estudiantes.");
  }

  /* ---------- DIVISOR A ---------- */
  (await divisor({ letra: "A", titulo: "Criptografía asimétrica", sub: "Cómo se demuestra la autoría ante alguien que no te conoce, sin revelarle ningún secreto.", minutos: "MIN 10 — 70 · EXPOSICIÓN DIALOGADA", ic: "llave" })).addNotes("Min 10–70. Criptografía asimétrica sin matemática pesada: la idea, un ejemplo real y los errores de concepto típicos. Todo lo que se muestra aquí se programa en el bloque C.");

  /* ---------- A.1 el problema ---------- */
  {
    const s = await lamina({ kicker: "A.1 · min 10–25", titulo: "La Sesión 2 resolvió media pregunta", ic: "candado", tituloSize: 28 });
    parrafo(s, "Sabemos comprobar que un dato no cambió: se publica su hash y cualquiera verifica. Pero eso deja abierta la otra mitad, que es la que hace falta para que exista el dinero digital.", { y: 1.9, h: 0.7 });
    enunciado(s, "Un hash lo puede calcular cualquiera. ¿Cómo demuestro que FUI YO quien escribió el dato, ante alguien que no me conoce y sin revelarle ningún secreto?", { y: 2.8, h: 1.65, size: 21 });
    parrafo(s, "Antes de dar la respuesta conviene agotar los caminos que no funcionan, porque cada fracaso deja claro un requisito.", { y: 4.7, h: 0.5, size: 14 });

    s.addNotes("La pregunta de la semana de la Sesión 2 pedía exactamente esto: diseñar un esquema y encontrar dónde falla. Recoger dos o tres propuestas antes de seguir.");
  }

  /* ---------- A.1 intentos ---------- */
  {
    const s = await lamina({ kicker: "A.1 · los dos caminos que no funcionan", titulo: "Por qué la clave compartida fracasa", ic: "candado", tituloSize: 27 });

    caja(s, { x: M, y: 1.9, w: CW, h: 2.25, fill: C.superf });
    s.addText("INTENTO 1 · CONTRASEÑA COMPARTIDA", { x: M + 0.3, y: 2.12, w: 6, h: 0.32, fontFace: F.mono, fontSize: 11, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Ana y Bruno acuerdan un secreto. Ana publica el mensaje junto a hash(secreto + mensaje). Bruno recalcula y comprueba. Funciona — es una construcción real —, pero tiene dos fallas que lo descartan.", { x: M + 0.3, y: 2.5, w: CW - 0.7, h: 0.7, size: 13 });
    s.addText("NO ESCALA — hace falta un secreto distinto con cada persona, y distribuirlo por un canal seguro que todavía no existe.", { x: M + 0.3, y: 3.2, w: CW - 0.7, h: 0.3, fontFace: F.body, fontSize: 12.5, color: C.tintaSuav, margin: 0, valign: "middle" });
    s.addText("EL VERIFICADOR PUEDE SUPLANTAR — Bruno conoce el secreto, así que Bruno puede fabricar mensajes que parezcan de Ana.", { x: M + 0.3, y: 3.55, w: CW - 0.7, h: 0.3, fontFace: F.body, fontSize: 12.5, color: C.tintaSuav, margin: 0, valign: "middle" });

    caja(s, { x: M, y: 4.35, w: CW, h: 1.15, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("INTENTO 2 · PUBLICAR EL SECRETO PARA QUE TODOS VERIFIQUEN", { x: M + 0.3, y: 4.55, w: 8, h: 0.32, fontFace: F.mono, fontSize: 11, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Y ahora cualquiera la fabrica. El sistema no distingue a Ana de un impostor. Se derrumba de inmediato.", { x: M + 0.3, y: 4.92, w: CW - 0.7, h: 0.45, size: 13, color: C.tinta });

    enunciado(s, "El requisito: que quien puede VERIFICAR una firma no pueda PRODUCIRLA.", { y: 5.7, h: 0.9, size: 20 });
    s.addNotes("Enunciado así parece contradictorio, y durante siglos la criptografía no supo construirlo. La solución llegó en 1976 con la criptografía de clave pública.");
  }

  /* ---------- A.1 propiedades ---------- */
  {
    const s = await lamina({ kicker: "A.1 · lo que aporta una firma", titulo: "Autenticidad, integridad y no repudio", ic: "escudo", tituloSize: 27 });
    tabla(s, ["propiedad", "qué significa"], [
      ["Autenticidad", "El mensaje proviene de quien controla una clave concreta. Nadie más pudo producir esa firma."],
      ["Integridad", "El mensaje no fue alterado después de firmarse. Cambiar un byte invalida la firma."],
      ["No repudio", "Quien firmó no puede negar después haberlo hecho, porque nadie más tenía la capacidad de hacerlo."],
    ], { y: 1.95, h: 2.1, colW: [2.6, 9.493], size: 12.5 });

    const r = await ficha(s, { tipo: "alerta", etiqueta: "El no repudio es técnico, no jurídico", x: M, y: 4.25, w: CW, h: 2.2 });
    parrafo(s, "La firma demuestra que SE USÓ UNA CLAVE CONCRETA. No demuestra que la persona a la que atribuimos esa clave estuviera consciente, de acuerdo, o siquiera presente.", { x: r.x, y: r.y, w: r.w, h: 0.75, size: 13.5 });
    parrafo(s, "Si roban una clave privada, el sistema seguirá considerando auténtica cada firma del ladrón — y matemáticamente tendrá razón. Es lo que ocurre en cada robo de billetera: no falla la criptografía, falla la custodia.", { x: r.x, y: r.y + 0.8, w: r.w, h: 0.8, size: 13.5, color: C.tinta });
    s.addNotes("Para el proyecto: la afirmación «el sistema garantiza que fue el usuario» es falsa. Lo que garantiza es que fue quien tenía la clave.");
  }

  /* ---------- A.2 un solo sentido ---------- */
  {
    const s = await lamina({ kicker: "A.2 · min 25–42", titulo: "Una función de un solo sentido, con trampa", ic: "llave", tituloSize: 27 });
    parrafo(s, "Ya conocemos una función de un solo sentido: el hash de la Sesión 2. Pero al hash le falta algo — es DEMASIADO irreversible, no deja ninguna puerta. Lo que hace falta es una que sea irreversible para todo el mundo salvo para quien conoce un dato secreto.", { y: 1.9, h: 0.85 });

    const r = await ficha(s, { tipo: "profundidad", etiqueta: "Analogía · el candado abierto", x: M, y: 2.9, w: CW, h: 2.05 });
    parrafo(s, "Imagine que reparte por la ciudad candados abiertos con su nombre grabado, y se queda con la única llave. Cualquiera puede cerrar uno de sus candados; solo usted puede abrirlo.", { x: r.x, y: r.y, w: r.w, h: 0.7, size: 13.5 });
    parrafo(s, "Para la FIRMA hay que darle la vuelta: usted usa la llave para producir algo que solo su llave puede producir, y cualquiera comprueba con el candado que salió de allí. La operación privada produce; la pública verifica.", { x: r.x, y: r.y + 0.72, w: r.w, h: 0.7, size: 13.5, color: C.tinta });

    tabla(s, ["operación", "coste"], [
      ["Dados k y G, calcular P = k · G", "BARATO. Hay atajos que lo resuelven en unos cientos de operaciones aunque k tenga 256 bits."],
      ["Dados P y G, recuperar k", "INVIABLE. No se conoce método sustancialmente mejor que probar valores. Con 256 bits está fuera del alcance de cualquier cómputo concebible."],
    ], { y: 5.12, h: 1.45, colW: [4.0, 8.093], size: 12 });
    s.addNotes("Esa asimetría es toda la construcción: k es la clave privada, P es la clave pública. El problema se llama logaritmo discreto sobre curvas elípticas.");
  }

  /* ---------- A.2 secp256k1 ---------- */
  {
    const s = await lamina({ kicker: "A.2 · ficha de término 02", titulo: "secp256k1 y el par de claves", ic: "termino", tituloSize: 28 });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 02 · la curva de Bitcoin y Ethereum", x: M, y: 1.9, w: CW, h: 3.5 });
    definicion(s, "SECP256K1: curva elíptica definida por y² = x³ + 7 sobre un cuerpo finito. Trae\nfijados un punto generador G y un orden n, que es la cantidad de puntos distintos\nque se pueden alcanzar.", { x: r.x, y: r.y, w: r.w, h: 1.05 });
    caja(s, { x: r.x, y: r.y + 1.22, w: r.w / 2 - 0.1, h: 1.3, fill: C.blanco, line: C.violeta, sombra: false });
    s.addText("CLAVE PRIVADA", { x: r.x + 0.24, y: r.y + 1.4, w: 3.5, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.violetaOs, charSpacing: 1.2, margin: 0, valign: "middle" });
    parrafo(s, "Un número entero aleatorio entre 1 y n−1. En la práctica, 32 bytes. No se «genera» con un algoritmo elaborado: se SORTEA.", { x: r.x + 0.24, y: r.y + 1.74, w: r.w / 2 - 0.58, h: 0.75, size: 12.5 });
    caja(s, { x: r.x + r.w / 2 + 0.1, y: r.y + 1.22, w: r.w / 2 - 0.1, h: 1.3, fill: C.superf, sombra: false });
    s.addText("CLAVE PÚBLICA", { x: r.x + r.w / 2 + 0.34, y: r.y + 1.4, w: 3.5, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.gris, charSpacing: 1.2, margin: 0, valign: "middle" });
    parrafo(s, "El punto P = k · G. Son dos coordenadas de 32 bytes cada una: 64 bytes en total. Publicarla no compromete nada.", { x: r.x + r.w / 2 + 0.34, y: r.y + 1.74, w: r.w / 2 - 0.58, h: 0.75, size: 12.5 });

    parrafo(s, "El nombre no es decorativo: sec por el consorcio que la estandarizó, p256 por los bits, k por Koblitz —la familia de curvas— y 1 por ser la primera de esa lista.", { y: 5.6, h: 0.6, size: 12.5, color: C.gris });
    s.addNotes("Que la clave privada sea «solo» un número sorteado es lo que sorprende a los estudiantes. De ahí sale la alerta siguiente.");
  }

  /* ---------- A.2 alerta azar ---------- */
  {
    const s = await lamina({ kicker: "A.2 · dónde está de verdad la seguridad", titulo: "La seguridad está en el sorteo, no en la curva", ic: "alerta", tituloSize: 25 });
    const r = await ficha(s, { tipo: "alerta", etiqueta: "Alerta profesional", x: M, y: 1.95, w: CW, h: 2.5 });
    parrafo(s, "Si la clave privada es simplemente un número aleatorio, toda la seguridad del sistema descansa en la calidad de ese azar. Una clave generada con un generador predecible es tan insegura como la contraseña «1234», por impecable que sea la curva.", { x: r.x, y: r.y, w: r.w, h: 0.9, size: 13.5 });
    parrafo(s, "No es teórico. Ha habido incidentes reales, con pérdidas grandes, causados exclusivamente por generadores de aleatoriedad defectuosos en dispositivos y bibliotecas — no por debilidades de la criptografía.", { x: r.x, y: r.y + 0.95, w: r.w, h: 0.85, size: 13.5, color: C.tinta });

    enunciado(s, "Nunca se genera una clave con la función de azar de propósito general del lenguaje. Se usa la fuente criptográficamente segura del sistema.", { y: 4.7, h: 1.35, size: 19 });
    parrafo(s, "Es lo que hacen por defecto las bibliotecas serias — y es lo que se usará en el laboratorio.", { y: 6.15, h: 0.4, size: 13, color: C.gris });
    s.addNotes("Vincular con la regla general del curso: no se implementa criptografía a mano. Vuelve en la alerta del nonce de firma.");
  }

  /* ---------- A.3 DIAGRAMA firmar/verificar ---------- */
  {
    const s = await lamina({ kicker: "A.3 · min 42–58 · figura 1", titulo: "Quien verifica nunca toca la clave privada", ic: "firma", tituloSize: 27 });

    s.addText("FIRMAR · OPERACIÓN PRIVADA", { x: M, y: 1.85, w: 6, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.violetaOs, charSpacing: 1.3, margin: 0, valign: "middle" });
    nodo(s, { x: M, y: 2.2, w: 2.5, h: 0.6, titulo: "clave privada", fill: C.blanco, line: C.violeta });
    nodo(s, { x: M, y: 2.9, w: 2.5, h: 0.6, titulo: "mensaje" });
    linea(s, M + 2.5, 2.5, M + 3.0, 2.5); linea(s, M + 3.0, 2.5, M + 3.0, 3.2);
    linea(s, M + 2.5, 3.2, M + 3.0, 3.2);
    flecha(s, M + 3.0, 2.85, M + 3.45, 2.85);
    nodo(s, { x: M + 3.5, y: 2.55, w: 2.0, h: 0.6, titulo: "ECDSA" });
    flecha(s, M + 5.5, 2.85, M + 5.95, 2.85);
    caja(s, { x: M + 6.0, y: 2.55, w: 6.09, h: 0.6, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("firma = (r, s) · 64 bytes", { x: M + 6.0, y: 2.55, w: 6.09, h: 0.6, fontFace: F.mono, fontSize: 12.5, color: C.tinta, align: "center", valign: "middle", margin: 0 });

    linea(s, M, 3.9, M + CW, 3.9, C.grisClaro, 1.5, "dash");

    s.addText("VERIFICAR · OPERACIÓN PÚBLICA", { x: M, y: 4.15, w: 6, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    nodo(s, { x: M, y: 4.5, w: 2.5, h: 0.6, titulo: "clave pública" });
    nodo(s, { x: M, y: 5.2, w: 2.5, h: 0.6, titulo: "mensaje + firma" });
    linea(s, M + 2.5, 4.8, M + 3.0, 4.8); linea(s, M + 3.0, 4.8, M + 3.0, 5.5);
    linea(s, M + 2.5, 5.5, M + 3.0, 5.5);
    flecha(s, M + 3.0, 5.15, M + 3.45, 5.15);
    nodo(s, { x: M + 3.5, y: 4.85, w: 2.0, h: 0.6, titulo: "VERIFY" });
    flecha(s, M + 5.5, 5.15, M + 5.95, 5.15);
    nodo(s, { x: M + 6.0, y: 4.85, w: 6.09, h: 0.6, titulo: "verdadero  /  falso" });

    s.addText("Fig. 1 · toda la asimetría cabe en esta diferencia", { x: M, y: 6.15, w: CW, h: 0.3, fontFace: F.mono, fontSize: 10, color: C.gris, charSpacing: 1, margin: 0, valign: "middle" });
    s.addNotes("No se firma el mensaje: se firma su hash. Por eso una firma de 64 bytes compromete un documento de cualquier tamaño. Ahí encajan las sesiones 2 y 3.");
  }

  /* ---------- A.3 ejemplo real ---------- */
  {
    const s = await lamina({ kicker: "A.3 · valores reales y reproducibles", titulo: "Una firma, de verdad", ic: "firma", tituloSize: 29 });
    caja(s, { x: M, y: 1.9, w: CW, h: 3.6, fill: C.tinta, line: C.tinta });
    s.addText([
      { text: "// NUNCA usar esta clave con fondos reales: es material de clase.\n\n", options: { color: "9A95A8" } },
      { text: "clave privada  ", options: { color: C.naranja } },
      { text: "7fa03ea163b89b38dfe61c7070b0894b2b5b3eee14187af429a90d17ec19fd1e\n", options: { color: "F4F2F7" } },
      { text: "               32 bytes · el secreto absoluto\n\n", options: { color: "9A95A8" } },
      { text: "clave pública  ", options: { color: C.naranja } },
      { text: "edafd5fc366ffb944d605a7050235b9d … 9f0aaadac58bb61d\n", options: { color: "F4F2F7" } },
      { text: "               64 bytes · coordenada X seguida de coordenada Y\n\n", options: { color: "9A95A8" } },
      { text: "mensaje        ", options: { color: C.naranja } },
      { text: "\"Transfiero 10 lotes a Bruno\"\n\n", options: { color: "FFA41B" } },
      { text: "firma          ", options: { color: C.naranja } },
      { text: "c877ef924d6ed057e27af4e21bb6a36f8ce97565a85d5172535f8a541aec3d30\n", options: { color: "F4F2F7" } },
      { text: "               f21fe2d75a6cab0e93b080a2020b02cebfc8d5ed6990d90fcde7a432966fe023", options: { color: "F4F2F7" } },
    ], { x: M + 0.3, y: 2.15, w: CW - 0.6, h: 3.1, fontFace: F.mono, fontSize: 11, lineSpacingMultiple: 1.2, margin: 0, valign: "top" });

    caja(s, { x: M, y: 5.7, w: CW, h: 0.95, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("verificar(mensaje, firma, pública) → VERDADERO          verificar(\"Transfiero 100 lotes…\", firma, pública) → FALSO", { x: M + 0.25, y: 5.7, w: CW - 0.5, h: 0.95, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.ocre, align: "center", valign: "middle", margin: 0 });
    s.addNotes("Cambiar un solo carácter del mensaje —un cero de más— invalida la firma. La firma no protege «el sentido»: protege los bytes exactos.");
  }

  /* ---------- A.3 qué prueba ---------- */
  {
    const s = await lamina({ kicker: "A.3 · precisión necesaria", titulo: "Qué prueba una firma y qué no prueba", ic: "firma", tituloSize: 27 });
    tabla(s, ["sí prueba", "no prueba"], [
      ["Que quien produjo la firma tenía la clave privada correspondiente.", "Quién es esa persona. La clave no lleva nombre, cédula ni nacionalidad."],
      ["Que el mensaje no cambió ni un byte después de firmarse.", "Que el firmante entendiera lo que firmaba. Es la base de casi todos los robos a usuarios."],
      ["Que la firma corresponde a ese mensaje y no a otro.", "Cuándo se firmó. No hay marca temporal dentro de la firma."],
      ["Que nadie sin la clave pudo fabricarla.", "Que el firmante fuera el dueño legítimo de la clave, y no alguien que se la robó."],
    ], { y: 1.95, h: 3.3, colW: [6.0, 6.093], size: 12 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Lo que hay que retener", x: M, y: 5.45, w: CW, h: 1.2 });
    s.addText("Una firma prueba que se usó una clave. Todo lo demás son supuestos que hay que sostener por otros medios.", { x: r.x, y: r.y - 0.1, w: r.w, h: 0.58, fontFace: F.display, fontSize: 15, color: C.tinta, margin: 0, valign: "middle" });
    s.addNotes("La columna derecha es la que importa para el proyecto: cada supuesto de la columna derecha que un diseño necesite tiene que resolverse fuera de la criptografía.");
  }

  /* ---------- A.3 alerta nonce ---------- */
  {
    const s = await lamina({ kicker: "A.3 · alerta crítica", titulo: "El número que no se puede repetir", ic: "alerta", tituloSize: 29 });
    const r = await ficha(s, { tipo: "alerta", etiqueta: "Repetirlo revela la clave privada", x: M, y: 1.95, w: CW, h: 2.45 });
    parrafo(s, "Cada firma ECDSA necesita internamente un número aleatorio de un solo uso. Si ese número SE REPITE en dos firmas hechas con la misma clave, cualquiera que vea ambas puede despejar la clave privada con álgebra elemental. No hace falta romper nada: basta resolver un sistema de dos ecuaciones.", { x: r.x, y: r.y, w: r.w, h: 1.05, size: 13.5 });
    parrafo(s, "Ha ocurrido en producción más de una vez, con consecuencias graves: consolas cuya clave de firmado quedó expuesta, y billeteras móviles vaciadas porque el generador del sistema devolvía valores repetidos.", { x: r.x, y: r.y + 1.1, w: r.w, h: 0.85, size: 13.5, color: C.tinta });

    caja(s, { x: M, y: 4.55, w: CW, h: 1.08, fill: C.superf });
    s.addText("LA DEFENSA ESTÁNDAR", { x: M + 0.3, y: 4.68, w: 4, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Derivar ese número de forma determinista a partir de la clave privada y del mensaje, en lugar de sortearlo. Así nunca se repite mientras el mensaje sea distinto, y no depende del azar del dispositivo.", { x: M + 0.3, y: 5.02, w: CW - 0.7, h: 0.55, size: 13 });

    enunciado(s, "No se implementa criptografía a mano. Se usan bibliotecas establecidas y se comprueban contra vectores de prueba conocidos.", { y: 5.8, h: 0.9, size: 17 });
    s.addNotes("Es la moraleja profesional que vale para todo el curso, y se aplica literalmente en el laboratorio de hoy.");
  }

  /* ---------- A.4 DIAGRAMA derivación ---------- */
  {
    const s = await lamina({ kicker: "A.4 · min 58–70 · figura 2", titulo: "La dirección es la cola del hash de la clave pública", ic: "derivacion", tituloSize: 24 });

    const filas = [
      ["1 · CLAVE PRIVADA · 32 bytes · sorteada al azar", "7fa03ea163b89b38dfe61c7070b0894b2b5b3eee14187af429a90d17ec19fd1e", "v"],
      ["2 · CLAVE PÚBLICA · 64 bytes · coordenada X seguida de Y", "edafd5fc366ffb944d605a7050235b9d … 9f0aaadac58bb61d", "n"],
      ["3 · HASH DE LA CLAVE PÚBLICA · 32 bytes", "", "n"],
    ];
    filas.forEach((f, i) => {
      const y = 1.9 + i * 1.32;
      caja(s, { x: M, y, w: CW, h: 0.92, fill: f[2] === "v" ? C.blanco : C.superf, line: f[2] === "v" ? C.violeta : C.tinta, sombra: false });
      s.addText(f[0], { x: M + 0.25, y: y + 0.12, w: CW - 0.5, h: 0.28, fontFace: F.mono, fontSize: 10, color: C.gris, charSpacing: 1, margin: 0, valign: "middle" });
      if (f[1]) s.addText(f[1], { x: M + 0.25, y: y + 0.45, w: CW - 0.5, h: 0.32, fontFace: F.mono, fontSize: 12, color: C.tintaSuav, margin: 0, valign: "middle" });
      if (i < 2) {
        flecha(s, M + 0.5, y + 0.92, M + 0.5, y + 1.32);
        s.addText(i === 0 ? "multiplicación sobre la curva · k · G" : "keccak-256", { x: M + 0.75, y: y + 0.95, w: 6, h: 0.32, fontFace: F.mono, fontSize: 10, color: C.gris, margin: 0, valign: "middle" });
      }
    });
    s.addText([
      { text: "3c966aba52e0ac36472673387", options: { color: C.tintaSuav } },
      { text: "32805fbe544f6117b755512f2029e3e8b6aa135", options: { color: C.ocre, bold: true } },
    ], { x: M + 0.25, y: 4.99, w: CW - 0.5, h: 0.32, fontFace: F.mono, fontSize: 12, margin: 0, valign: "middle" });

    linea(s, M, 5.9, M + CW, 5.9, C.naranja, 2);
    s.addText("4 · DIRECCIÓN = LOS ÚLTIMOS 20 BYTES · se descartan los 12 primeros", { x: M, y: 6.05, w: CW, h: 0.34, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.ocre, charSpacing: 1.1, margin: 0, valign: "middle" });
    s.addNotes("Los cuarenta caracteres resaltados en el hash SON la dirección. No hay transformación adicional: se recorta y se antepone 0x.");
  }

  /* ---------- A.4 EIP-55 ---------- */
  {
    const s = await lamina({ kicker: "A.4 · ficha de término 04", titulo: "El checksum de EIP-55", ic: "termino", tituloSize: 29 });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Una suma de verificación que no ocupa un solo byte", x: M, y: 1.9, w: CW, h: 2.95 });
    parrafo(s, "Se toma la dirección en minúsculas y se calcula su hash. Después, para cada carácter: si es una LETRA y el dígito correspondiente del hash es 8 o mayor, esa letra se escribe en mayúscula. Los dígitos numéricos no cambian, porque no tienen mayúscula.", { x: r.x, y: r.y, w: r.w, h: 1.0, size: 13.5 });
    caja(s, { x: r.x, y: r.y + 1.05, w: r.w, h: 1.15, fill: C.tinta, line: C.tinta });
    s.addText([
      { text: "sin checksum   ", options: { color: "9A95A8" } },
      { text: "0x732805fbe544f6117b755512f2029e3e8b6aa135\n\n", options: { color: "F4F2F7" } },
      { text: "con EIP-55     ", options: { color: "9A95A8" } },
      { text: "0x732805FbE544F6117B755512f2029e3e8B6aa135", options: { color: "FFA41B" } },
    ], { x: r.x + 0.25, y: r.y + 1.15, w: r.w - 0.5, h: 0.95, fontFace: F.mono, fontSize: 12.5, lineSpacingMultiple: 1.1, margin: 0, valign: "middle" });

    parrafo(s, "Son la MISMA dirección: para la red, las mayúsculas son irrelevantes. Pero un programa que valide el patrón detecta casi cualquier error de transcripción antes de enviar los fondos.", { y: 4.98, h: 0.55, size: 13 });

    const r2 = await ficha(s, { tipo: "alerta", etiqueta: "Lo que el checksum NO hace", x: M, y: 5.62, w: CW, h: 1.05 });
    parrafo(s, "Detecta errores de transcripción, no direcciones inexistentes. Enviar fondos a una dirección bien formada pero sin dueño los destruye para siempre.", { x: r2.x, y: r2.y - 0.14, w: r2.w, h: 0.5, size: 12.5 });
    s.addNotes("Por qué 20 bytes y no 32: por costo. Cada byte almacenado en el estado de todos los nodos del mundo se paga. Es una decisión de ingeniería, no de criptografía.");
  }

  /* ---------- DIVISOR B ---------- */
  (await divisor({ letra: "B", titulo: "Anatomía de la cadena", sub: "Ya están todas las piezas. Un bloque es la estructura que las ensambla.", minutos: "MIN 78 — 118 · EXPOSICIÓN DIALOGADA", ic: "capas" })).addNotes("Min 78–118, después de la pausa. Ya están todas las piezas; ahora se ensamblan en un bloque. Pedir que tengan a mano la figura del bloque de la Sesión 1.");

  /* ---------- B.1 cabecera ---------- */
  {
    const s = await lamina({ kicker: "B.1 · min 78–92", titulo: "La cabecera del bloque, campo por campo", ic: "capas", tituloSize: 27 });
    tabla(s, ["campo de la cabecera", "para qué sirve", "de dónde sale"], [
      ["Hash del bloque anterior", "El eslabón. Es lo que convierte una lista de bloques en una cadena.", "Se copia del bloque padre."],
      ["Raíz de Merkle", "Compromete el contenido completo del cuerpo en 32 bytes.", "SESIÓN 2. Se calcula sobre las transacciones del bloque."],
      ["Marca temporal", "Cuándo declara el proponente que se creó el bloque.", "La pone quien propone, dentro de márgenes que la red valida."],
      ["Dificultad", "Cuán costoso debía ser el trabajo para que el bloque sea válido.", "La calcula el protocolo, no el minero. Sesión 4."],
      ["Nonce", "El campo que se recorre por fuerza bruta hasta cumplir la dificultad.", "Lo busca quien mina. Sesión 4."],
    ], { y: 1.95, h: 3.3, colW: [3.0, 5.0, 4.093], size: 11.5 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "La observación que hay que hacer", x: M, y: 5.45, w: CW, h: 1.2 });
    parrafo(s, "El cuerpo puede pesar megabytes, pero solo se hashea la cabecera. Y aun así el hash del bloque queda comprometido con todas sus transacciones — porque la raíz de Merkle está DENTRO de la cabecera.", { x: r.x, y: r.y - 0.06, w: r.w, h: 0.6, size: 13 });
    s.addNotes("Ese es el trabajo que hizo la Sesión 2: comprimir un conjunto arbitrariamente grande en 32 bytes verificables.");
  }

  /* ---------- B.1 división de responsabilidades ---------- */
  {
    const s = await lamina({ kicker: "B.1 · cada pieza responde una pregunta", titulo: "La división de responsabilidades", ic: "capas", tituloSize: 28 });
    parrafo(s, "Las firmas no están en la cabecera: viajan dentro de cada transacción, en el cuerpo. Cada nodo las verifica de forma independiente antes de aceptarlas.", { y: 1.9, h: 0.55, size: 14 });
    const piezas = [
      ["LA FIRMA", "¿Esta transacción la autorizó quien controla esos fondos?", "Sesión 3"],
      ["EL ÁRBOL DE MERKLE", "¿Esta transacción está en este bloque?", "Sesión 2"],
      ["EL ENCADENAMIENTO POR HASH", "¿Este bloque sigue siendo el que era?", "Sesión 3"],
      ["EL CONSENSO", "¿Es esta la cadena en la que todos estamos de acuerdo?", "Sesión 4"],
    ];
    piezas.forEach((p, i) => {
      const y = 2.65 + i * 1.05;
      caja(s, { x: M, y, w: CW, h: 0.88, fill: i === 3 ? C.blanco : C.superf, line: i === 3 ? C.naranja : C.tinta, sombraColor: i === 3 ? C.naranja : C.tinta, sombra: i === 3 });
      s.addText(p[0], { x: M + 0.3, y: y + 0.1, w: 4.4, h: 0.32, fontFace: F.mono, fontSize: 11, bold: true, color: i === 3 ? C.ocre : C.tinta, charSpacing: 1.2, margin: 0, valign: "middle" });
      s.addText(p[1], { x: M + 0.3, y: y + 0.45, w: CW - 2.2, h: 0.32, fontFace: F.body, fontSize: 13.5, color: C.tintaSuav, margin: 0, valign: "middle" });
      s.addText(p[2], { x: M + CW - 1.6, y: y + 0.1, w: 1.3, h: 0.32, fontFace: F.mono, fontSize: 10, color: C.gris, align: "right", margin: 0, valign: "middle" });
    });
    s.addNotes("La cuarta es la única que todavía no tenemos. Ese es el gancho de toda la sesión hacia la S4.");
  }

  /* ---------- B.2 DIAGRAMA cascada ---------- */
  {
    const s = await lamina({ kicker: "B.2 · min 92–105 · figura 3", titulo: "El efecto cascada, con la pieza que lo explica", ic: "bloques", tituloSize: 26 });
    const bw = 3.6, bx = [M, M + 4.25, M + 8.5], by = 2.1, bh = 2.75;
    const datos = [
      ["BLOQUE 120", "0x4c1e…9ab2", "0x8f3a… → 0xd4b7…", "CAMBIA", true],
      ["BLOQUE 121", "ya no coincide", "0x21b7…0f5e", "INVÁLIDO", false],
      ["BLOQUE 122", "ya no coincide", "0x9d02…7e13", "INVÁLIDO", false],
    ];
    datos.forEach((d, i) => {
      const x = bx[i];
      caja(s, { x, y: by, w: bw, h: bh, fill: C.superf, line: i === 0 ? C.naranja : C.tinta, sombraColor: i === 0 ? C.naranja : C.tinta, sombra: i === 0 });
      s.addShape(pres.ShapeType.rect, { x, y: by, w: bw, h: 0.4, fill: { color: C.tinta }, line: { color: C.tinta, width: 1.75 } });
      s.addText(d[0], { x: x + 0.18, y: by, w: bw - 0.36, h: 0.4, fontFace: F.mono, fontSize: 11, bold: true, color: C.blanco, charSpacing: 1.3, margin: 0, valign: "middle" });
      const filas = [["hash anterior", d[1], i > 0], ["raíz de Merkle", d[2], i === 0], ["hash del bloque", d[3], true]];
      filas.forEach((f, j) => {
        const fy = by + 0.55 + j * 0.72;
        s.addText(f[0], { x: x + 0.18, y: fy, w: bw - 0.36, h: 0.24, fontFace: F.mono, fontSize: 9, color: C.gris, charSpacing: 1.1, margin: 0, valign: "middle" });
        s.addText(f[1], { x: x + 0.18, y: fy + 0.24, w: bw - 0.36, h: 0.3, fontFace: F.mono, fontSize: 11, color: f[2] ? C.ocre : C.tintaSuav, bold: f[2], margin: 0, valign: "middle" });
      });
    });
    [0, 1].forEach(i => flecha(s, bx[i] + bw, 3.0, bx[i + 1], 3.0));

    linea(s, M, 5.25, M + CW, 5.25, C.naranja, 2);
    s.addText("SE ALTERA UNA TRANSACCIÓN DEL BLOQUE 120", { x: M, y: 5.4, w: CW, h: 0.34, fontFace: F.display, fontSize: 18, color: C.ocre, margin: 0, valign: "middle" });
    parrafo(s, "cambia su raíz de Merkle · cambia el hash de la cabecera · el bloque siguiente ya no apunta a un hash que exista · y así hasta el final de la cadena", { y: 5.85, h: 0.6, size: 13 });
    s.addNotes("La secuencia es mecánica y no requiere confiar en nadie. Es la Fig. 2 de la Sesión 1, ahora con la raíz de Merkle explicando el primer eslabón.");
  }

  /* ---------- B.2 lo que no resuelve ---------- */
  {
    const s = await lamina({ kicker: "B.2 · el límite del encadenamiento", titulo: "Lo que el encadenamiento NO resuelve", ic: "profundidad", tituloSize: 27 });
    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 05 · inmutabilidad, con precisión", x: M, y: 1.9, w: CW, h: 1.95 });
    parrafo(s, "Alterar un registro escrito es económicamente inviable, no físicamente imposible. Habría que rehacer el trabajo de todos los bloques posteriores más rápido de lo que la red produce bloques nuevos. De ahí la práctica de esperar CONFIRMACIONES: cada bloque encima multiplica el costo de revertir.", { x: r.x, y: r.y, w: r.w, h: 1.05, size: 13.5 });

    const r2 = await ficha(s, { tipo: "alerta", etiqueta: "El hueco que queda", x: M, y: 4.05, w: CW, h: 2.4 });
    parrafo(s, "El encadenamiento garantiza que UNA cadena dada es internamente coherente. No dice nada sobre cuál de dos cadenas coherentes es la buena.", { x: r2.x, y: r2.y, w: r2.w, h: 0.65, size: 13.5 });
    parrafo(s, "Un atacante puede construir su propia cadena, perfectamente encadenada, con las transacciones que le convengan. Todas sus firmas serán válidas y todos sus hashes cuadrarán. El encadenamiento no lo detecta, porque no hay nada que detectar: esa cadena es válida.", { x: r2.x, y: r2.y + 0.7, w: r2.w, h: 0.95, size: 13.5, color: C.tinta });
    s.addNotes("Lo que falta es un criterio para que toda la red elija la misma cadena. Es el doble gasto de la Sesión 1, reaparecido. Se cierra en la Sesión 4.");
  }

  /* ---------- B.3 red P2P ---------- */
  {
    const s = await lamina({ kicker: "B.3 · min 105–118", titulo: "Propagación por rumor y mempool", ic: "red", tituloSize: 28 });
    parrafo(s, "No hay servidor ni directorio central. Cada nodo mantiene conexiones con un puñado de vecinos y aplica una regla simple: cuando recibo algo válido que no conocía, lo valido y se lo paso a mis vecinos.", { y: 1.9, h: 0.65 });

    const r = await ficha(s, { tipo: "termino", etiqueta: "Ficha de término 06 · mempool", x: M, y: 2.65, w: CW, h: 2.85 });
    parrafo(s, "Conjunto de transacciones que un nodo ha recibido y considerado válidas, pero que todavía no están en ningún bloque. Es la sala de espera: cuando en la demostración de la Sesión 2 la transacción apareció como «pendiente», estaba aquí.", { x: r.x, y: r.y, w: r.w, h: 0.8, size: 13.5 });
    const puntos = [
      ["CADA NODO TIENE EL SUYO", "y no son idénticos: dependen de qué le llegó a cada uno y en qué orden."],
      ["ES PÚBLICO", "cualquiera observa las transacciones pendientes antes de que se ejecuten. De ahí el reordenamiento de la Sesión 9."],
      ["ESTAR AHÍ NO GARANTIZA NADA", "una transacción puede quedarse indefinidamente si nadie tiene incentivo para incluirla."],
    ];
    puntos.forEach((p, i) => {
      const y = r.y + 0.88 + i * 0.46;
      s.addText(p[0], { x: r.x, y: y + 0.02, w: 3.3, h: 0.3, fontFace: F.mono, fontSize: 9.5, bold: true, color: C.violetaOs, charSpacing: 1.1, margin: 0, valign: "top" });
      s.addText(p[1], { x: r.x + 3.5, y, w: r.w - 3.5, h: 0.44, fontFace: F.body, fontSize: 12, color: C.tintaSuav, margin: 0, valign: "top" });
    });

    const r2 = await ficha(s, { tipo: "pregunta", etiqueta: "El conflicto que queda abierto", x: M, y: 5.6, w: CW, h: 1.2 });
    parrafo(s, "Dos nodos producen un bloque válido casi al mismo tiempo, apuntando al mismo padre. Ambos son correctos. Media red ve uno y media red ve el otro. Nada de lo construido hasta hoy resuelve esto.", { x: r2.x, y: r2.y - 0.06, w: r2.w, h: 0.55, size: 13, color: C.tinta });
    s.addNotes("Un nodo completo valida firma, saldos, no repetición y reglas del bloque antes de propagar. Su poder es negarse: un bloque inválido no se propaga, venga de donde venga.");
  }

  /* ---------- DIVISOR C ---------- */
  (await divisor({ letra: "C", titulo: "Laboratorio 02", sub: "Doscientas líneas que reúnen toda la Unidad I: firmas, Merkle y encadenamiento. Y después romperlo.", minutos: "MIN 118 — 170 · EN MÁQUINA, EN PAREJAS", ic: "matraz" })).addNotes("Min 118–170, en parejas. Laboratorio 02: claves y firmas, dirección y checksum, mini-blockchain. Verificar entornos y dependencia instalada antes de empezar. El error más común está en la serialización.");

  /* ---------- LAB partes ---------- */
  const partes = [
    { n: "1", min: "≈ 15 min", tit: "Claves y firmas", ic: "llave", pasos: [
      ["01", "Generar un par de claves", "generar_par() usando la fuente de aleatoriedad segura de la biblioteca. Observar los tamaños: 32 bytes la privada, 64 la pública."],
      ["02", "Firmar y verificar", "firmar(privada, mensaje) y verificar(publica, mensaje, firma). Comprobar que una firma válida verifica."],
      ["03", "Romperla de tres maneras", "Alterar el mensaje, alterar un byte de la firma, y usar la clave pública de otro par. LAS TRES DEBEN FALLAR. Una función que solo acepta lo correcto está a medio escribir."],
    ]},
    { n: "2", min: "≈ 12 min", tit: "Dirección y checksum", ic: "derivacion", pasos: [
      ["01", "Derivar la dirección", "keccak-256 de los 64 bytes de la clave pública, quedarse con los ÚLTIMOS 20. Contrastar con el valor de referencia del archivo de pruebas."],
      ["02", "Aplicar EIP-55", "Hashear la dirección en minúsculas y poner en mayúscula cada letra cuyo dígito correspondiente del hash sea 8 o mayor."],
      ["03", "Detectar un error de transcripción", "eip55_valido() debe rechazar una dirección a la que se le cambió una sola letra de caja."],
    ]},
  ];
  for (const p of partes) {
    const s = await lamina({ kicker: `Bloque C · parte ${p.n} · ${p.min}`, titulo: p.tit, ic: p.ic, tituloSize: 29 });
    p.pasos.forEach((q, i) => {
      const y = 1.95 + i * 1.55;
      s.addText(q[0], { x: M, y: y + 0.05, w: 0.85, h: 0.6, fontFace: F.display, fontSize: 30, color: C.naranja, margin: 0, valign: "top" });
      s.addText(q[1], { x: M + 0.95, y, w: CW - 0.95, h: 0.4, fontFace: F.body, fontSize: 15, bold: true, color: C.tinta, margin: 0, valign: "top" });
      parrafo(s, q[2], { x: M + 0.95, y: y + 0.48, w: CW - 0.95, h: 0.95, size: 13 });
      linea(s, M, y - 0.16, M + CW, y - 0.16, C.grisClaro, 1);
    });
    linea(s, M, 1.79 + 3 * 1.55, M + CW, 1.79 + 3 * 1.55, C.grisClaro, 1);
    s.addNotes(`Parte ${p.n} del laboratorio · ${p.min}.`);
  }

  /* ---------- LAB parte 3 ---------- */
  {
    const s = await lamina({ kicker: "Bloque C · parte 3 · ≈ 25 min", titulo: "La mini-blockchain", ic: "capas", tituloSize: 29 });
    const pasos = [
      ["01", "Transacciones firmadas", "Origen, destino, monto, contador y firma. Serialización DETERMINISTA —siempre los mismos campos en el mismo orden— y firma sobre esa serialización. Si dos nodos serializan distinto, la firma no verifica."],
      ["02", "El bloque", "Cabecera con hash del padre, raíz de Merkle de sus transacciones —REUTILIZANDO EL LABORATORIO 01—, marca temporal y nonce. El hash se calcula solo sobre la cabecera."],
      ["03", "Validación de la cadena", "cadena_valida() comprueba para cada bloque: que el hash del padre coincida con el hash real del anterior, que la raíz corresponda a sus transacciones, y que TODAS las firmas verifiquen."],
      ["04", "Romper la cadena", "Alterar el monto de una transacción de un bloque intermedio y validar. Observar QUÉ falla y DÓNDE: primero la firma, después la raíz de Merkle, después el eslabón de todos los posteriores."],
    ];
    pasos.forEach((p, i) => {
      const y = 1.9 + i * 1.12;
      s.addText(p[0], { x: M, y: y + 0.04, w: 0.75, h: 0.5, fontFace: F.display, fontSize: 25, color: C.naranja, margin: 0, valign: "top" });
      s.addText(p[1], { x: M + 0.85, y, w: CW - 0.85, h: 0.36, fontFace: F.body, fontSize: 14.5, bold: true, color: C.tinta, margin: 0, valign: "top" });
      parrafo(s, p[2], { x: M + 0.85, y: y + 0.38, w: CW - 0.85, h: 0.66, size: 12.5 });
      linea(s, M, y - 0.12, M + CW, y - 0.12, C.grisClaro, 1);
    });
    linea(s, M, 1.78 + 4 * 1.12, M + CW, 1.78 + 4 * 1.12, C.grisClaro, 1);
    s.addText("EL PASO 04 ES LA COMPROBACIÓN CENTRAL Y EL CIERRE DE LA UNIDAD I: LA FIG. 3, EJECUTÁNDOSE.", { x: M, y: 6.4, w: CW, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.1, margin: 0, valign: "middle" });
    s.addNotes("Entregable: repositorio con pruebas pasando + media página describiendo qué comprobación falló primero y por qué en ese orden. Antes de la Sesión 4.");
  }

  /* ---------- Errores frecuentes ---------- */
  {
    const s = await lamina({ kicker: "Bloque C · proyectar antes de empezar", titulo: "Errores frecuentes del laboratorio", ic: "equis", tituloSize: 27 });
    tabla(s, ["síntoma", "causa y solución"], [
      ["La firma verifica en una máquina y no en otra", "Serialización no determinista: campos en distinto orden, o un diccionario sin orden fijo. Fija el orden y hashea bytes, no la representación de un objeto."],
      ["La dirección no coincide con la de referencia", "Casi siempre se hashea la clave pública CON el prefijo de formato. Hay que hashear los 64 bytes de las coordenadas, sin byte inicial."],
      ["Se usó SHA-3 en lugar de Keccak", "La trampa de la Sesión 2. Comprueba el vector conocido: keccak256(\"\") empieza por c5d2460186f7233c."],
      ["La cadena valida aunque se alteró un bloque", "La validación lee el hash guardado en el bloque en lugar de recalcularlo desde la cabecera. Es el error conceptual más grave de este laboratorio."],
      ["Todas las firmas fallan tras cambiar un campo", "Correcto. Es el resultado esperado del paso 4, no un fallo."],
    ], { y: 1.95, h: 4.4, colW: [4.3, 7.793], size: 11.5 });
    s.addNotes("Los cinco explican casi todas las preguntas del laboratorio. Proyectarlos antes ahorra media hora.");
  }

  /* ---------- DIVISOR D ---------- */
  (await divisor({ letra: "D", titulo: "Cierre", sub: "Qué llevarse, qué entregar y el hueco que abre la Sesión 4.", minutos: "MIN 170 — 180 · PLENARIA", ic: "bandera" })).addNotes("Min 170–180. Síntesis, entregable y el hueco que abre la Sesión 4. No abrir temas nuevos.");

  /* ---------- Qué llevarse ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · síntesis", titulo: "Lo que hay que llevarse de esta sesión", ic: "bandera", tituloSize: 26 });
    const ideas = [
      ["UNO", "El requisito era ASIMETRÍA: que quien puede verificar no pueda firmar. Los esquemas de clave compartida fracasan por eso."],
      ["DOS", "La clave privada es UN NÚMERO SORTEADO AL AZAR. Toda la seguridad descansa en la calidad de ese sorteo."],
      ["TRES", "Una firma prueba QUE SE USÓ UNA CLAVE. No prueba identidad, ni intención, ni momento, ni comprensión."],
      ["CUATRO", "La dirección es literalmente LA COLA DEL HASH de la clave pública, y su patrón de mayúsculas es un checksum gratuito."],
      ["CINCO", "El bloque ensambla las tres piezas: firmas en el cuerpo, raíz de Merkle en la cabecera, hash del padre como eslabón."],
      ["SEIS", "Nada de lo construido resuelve CUÁL DE DOS CADENAS VÁLIDAS es la buena. Ese hueco tiene nombre y fecha: Sesión 4."],
    ];
    ideas.forEach((it, i) => {
      const y = 1.95 + i * 0.78;
      s.addText(it[0], { x: M, y: y + 0.02, w: 1.35, h: 0.4, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.naranja, charSpacing: 1.4, margin: 0, valign: "middle" });
      parrafo(s, it[1], { x: M + 1.5, y: y - 0.03, w: CW - 1.5, h: 0.7, size: 13 });
      linea(s, M, y - 0.14, M + CW, y - 0.14, C.grisClaro, 1);
    });
    linea(s, M, 1.81 + 6 * 0.78, M + CW, 1.81 + 6 * 0.78, C.grisClaro, 1);
    s.addNotes("Con esta sesión termina la parte criptográfica del curso. Todo lo que la Sesión 1 afirmó está ahora demostrado y programado.");
  }

  /* ---------- Puente ---------- */
  {
    const s = await lamina({ kicker: "Bloque D · puente", titulo: "Queda un hueco perfectamente delimitado", ic: "profundidad", tituloSize: 27 });
    parrafo(s, "Sabemos construir una cadena válida. No sabemos decidir cuál de varias cadenas válidas es LA cadena.", { y: 1.9, h: 0.55, size: 15 });

    caja(s, { x: M, y: 2.6, w: CW, h: 1.5, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    parrafo(s, "Pregunta de la semana: si un atacante construye su propia cadena, perfectamente encadenada y con todas las firmas válidas, ¿qué impide que la red la acepte? Proponga un criterio y busque cómo se lo saltaría usted mismo.", { x: M + 0.34, y: 2.85, w: CW - 0.68, h: 1.05, size: 14 });

    caja(s, { x: M, y: 4.35, w: CW, h: 2.1, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("SESIÓN 04 · CONSENSO, INCENTIVOS Y EL TRILEMA", { x: M + 0.34, y: 4.6, w: 9, h: 0.34, fontFace: F.mono, fontSize: 11, bold: true, color: C.violetaOs, charSpacing: 1.4, margin: 0, valign: "middle" });
    parrafo(s, "Generales bizantinos, prueba de trabajo, prueba de participación, bifurcaciones y finalidad, y el trilema de escalabilidad. Cierra la Unidad I con el QUIZ 1, que evalúa todo lo visto desde la Sesión 1.", { x: M + 0.34, y: 5.0, w: CW - 0.68, h: 1.2, size: 13.5 });
    s.addNotes("Anunciar el Quiz 1 con una semana de antelación y recordar que los glosarios de las tres sesiones son acumulativos.");
  }

  /* ---------- GLOSARIO ---------- */
  const glosario = [
    ["Autenticidad", "", "Garantía de que un mensaje proviene de quien controla una clave concreta."],
    ["Cabecera de bloque", "block header", "Parte pequeña y de tamaño fijo con el hash del padre, la raíz de Merkle, la marca temporal, la dificultad y el nonce. Es lo único que se hashea."],
    ["Clave privada", "", "Número entero de 32 bytes sorteado al azar. Quien lo tiene controla los fondos. No se deriva de nada ni se recupera si se pierde."],
    ["Clave pública", "", "Punto de la curva obtenido multiplicando el generador por la clave privada. Son 64 bytes. Publicarla no compromete nada."],
    ["ECDSA", "Elliptic Curve DSA", "Algoritmo de firma sobre curva elíptica. Produce un par (r, s) de 64 bytes a partir del hash del mensaje y la clave privada."],
    ["EIP-55", "", "Convención que codifica una suma de verificación en el patrón de mayúsculas de una dirección, sin ocupar espacio adicional."],
    ["Logaritmo discreto elíptico", "", "Recuperar k dados P = k·G y G. Calcular P es barato; recuperar k es inviable. Esa asimetría sostiene toda la criptografía de clave pública del curso."],
    ["Mempool", "memory pool", "Transacciones que un nodo considera válidas pero que aún no están en ningún bloque. Público, distinto en cada nodo, y sin garantía de inclusión."],
    ["No repudio", "", "Imposibilidad de negar haber firmado. Es una propiedad técnica sobre la clave, no una prueba jurídica sobre la persona."],
    ["Propagación por rumor", "gossip", "Cada nodo reenvía a sus vecinos lo que recibe y valida. No requiere servidor ni conocer la topología."],
    ["secp256k1", "", "Curva elíptica de Bitcoin y Ethereum: y² = x³ + 7 sobre un cuerpo finito, con generador y orden fijados por el estándar."],
    ["Serialización determinista", "", "Representación en bytes que siempre produce la misma salida para los mismos datos. Condición necesaria para que la firma verifique en todos los nodos."],
  ];
  {
    const POR_PAG = 6, PAGS = Math.ceil(glosario.length / POR_PAG);
    for (let p = 0; p < PAGS; p++) {
      const trozo = glosario.slice(p * POR_PAG, (p + 1) * POR_PAG);
      const s = await lamina({
        kicker: `Anexo · glosario de la sesión · ${p + 1} de ${PAGS}`,
        titulo: p === 0 ? "Glosario de la sesión" : "Glosario · continuación",
        ic: "lista", tituloSize: 28,
      });
      if (p === 0) parrafo(s, "Solo los términos que introduce esta sesión. Los de las sesiones 1 y 2 siguen siendo exigibles.", { y: 1.88, h: 0.35, size: 12.5, color: C.gris });
      const y0 = p === 0 ? 2.4 : 2.0;
      trozo.forEach((g, i) => {
        const y = y0 + i * 0.72;
        s.addText(g[0], { x: M, y, w: 2.9, h: 0.36, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.tinta, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
        if (g[1]) s.addText(g[1], { x: M + 3.0, y: y + 0.03, w: 1.9, h: 0.3, fontFace: F.mono, fontSize: 9, color: C.violetaOs, margin: 0, valign: "top" });
        parrafo(s, g[2], { x: M + 5.05, y: y - 0.03, w: CW - 5.05, h: 0.64, size: 11.5 });
        linea(s, M, y - 0.13, M + CW, y - 0.13, C.grisClaro, 1);
      });
      linea(s, M, y0 - 0.13 + trozo.length * 0.72, M + CW, y0 - 0.13 + trozo.length * 0.72, C.grisClaro, 1);
      s.addNotes("Glosario acumulativo del curso.");
    }
  }

  /* ---------- FUENTES ---------- */
  {
    const s = await lamina({ kicker: "Anexo · fuentes y lecturas", titulo: "Fuentes", ic: "documento", tituloSize: 30 });
    const cols = [
      ["FUENTES PRIMARIAS", [
        "Diffie, W. y Hellman, M. (1976). New Directions in Cryptography.",
        "Estándar SEC 2 — define secp256k1.",
        "RFC 6979 — uso determinista de DSA y ECDSA.",
        "EIP-55 — codificación de dirección con checksum en mayúsculas.",
      ]],
      ["AMPLIACIÓN RECOMENDADA", [
        "Antonopoulos, A. Mastering Bitcoin. Capítulo de claves y direcciones. Libre acceso.",
        "Antonopoulos, A. y Wood, G. Mastering Ethereum. Capítulo de criptografía. Libre acceso.",
        "Narayanan, A. et al. Bitcoin and Cryptocurrency Technologies. Capítulo 1, firmas digitales.",
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
    s.addNotes("Comprobar el vector de keccak al arrancar el laboratorio evita la mitad de los problemas de la parte 2.");
  }

  /* ---------- CIERRE ---------- */
  {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addImage({ data: await icono("cadena", C.naranja), x: M, y: 1.55, w: 0.42, h: 0.42 });
    s.addText("FIN DE LA SESIÓN 03", { x: M + 0.6, y: 1.53, w: 8, h: 0.44, fontFace: F.mono, fontSize: 12, color: C.naranja, charSpacing: 2, margin: 0, valign: "middle" });
    s.addText("PRÓXIMA SESIÓN:\nCONSENSO Y EL TRILEMA", { x: M, y: 2.35, w: 11.5, h: 2.0, fontFace: F.display, fontSize: 46, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 0.98 });
    s.addText("Cierra la Unidad I y trae el Quiz 1. Entregable de hoy: la mini-blockchain con las pruebas pasando, antes de que empiece.", { x: M, y: 4.45, w: 9.8, h: 0.95, fontFace: F.body, fontSize: 16, color: "B9B4C4", margin: 0, valign: "top", lineSpacingMultiple: 1.28 });
    s.addText("Universidad de San Buenaventura Medellín · Facultad de Ingeniería\nBlockchain y Web 3.0 · Unidad I · Sesión 03 de 17", { x: M, y: 5.95, w: 9.5, h: 0.8, fontFace: F.mono, fontSize: 10, color: "6E6A7C", margin: 0, valign: "top", lineSpacingMultiple: 1.35 });
    s.addNotes("Cerrar con la próxima sesión: consenso y trilema, y el Quiz 1 de la Unidad I (sesiones 1 a 4). Entregable de hoy: la mini-blockchain con las pruebas pasando, antes de que empiece la Sesión 4. 1 minuto.");
    nSlide++;
  }

  const salida = "D:/Curso Blockchain y Web 3.0/material/Sesion-03-Blockchain-Web3.pptx";
  await pres.writeFile({ fileName: salida });
  console.log("Generado:", salida, "·", nSlide, "láminas");
}

construir().catch(e => { console.error(e); process.exit(1); });
