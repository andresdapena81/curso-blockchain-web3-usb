/* =====================================================================
   Blockchain y Web 3.0 — Universidad de San Buenaventura Medellín
   Generador del deck · Proyecto del docente · Alcance
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
  s.addText("PROYECTO DEL DOCENTE · CÓMO SE ACOTA UN ALCANCE", {
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
   DECK · EL PROYECTO DEL DOCENTE · ACOTAR EL ALCANCE
   ===================================================================== */

Object.assign(ICONOS, {
  diamante:  "M12 2 22 12 12 22 2 12z",
  corte:     "M3 4h18v4H3zM3 10h18v4H3zM3 16h18v4H3z",
  riesgo:    "M12 3 22 20H2zM12 10v4M12 16.5v1",
  tijera:    "M6 4a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM6 15a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM8 8l10 9M8 16 18 7",
  usuario:   "M3 20v-2a3 3 0 013-3h4a3 3 0 013 3v2M8 5a3 3 0 106 0 3 3 0 00-6 0M16 20v-2a3 3 0 00-1.5-2.6",
  lupa:      "M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l5 5",
  matraz:    "M9 3h6M10 3v6L4 20h16L14 9V3M7 15h10",
  pantalla:  "M3 4h18v13H3zM10 8l5 2.5-5 2.5zM8 21h8",
});

async function construir() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Universidad de San Buenaventura Medellín";
  pres.title = "El proyecto del docente · Acotar el alcance";
  pres.subject = "Entradas con reventa controlada";

  /* ---------- PORTADA ---------- */
  {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 4.1, h: H, fill: { color: C.naranja }, line: { width: 0 } });
    s.addImage({ data: await icono("tijera", C.tinta), x: 1.35, y: 2.6, w: 1.4, h: 1.4 });
    s.addText("ACOTAR", { x: 0, y: 4.1, w: 4.1, h: 0.7, fontFace: F.display, fontSize: 34, color: C.tinta, align: "center", valign: "middle", margin: 0 });
    s.addImage({ data: await icono("cadena", C.naranja), x: 4.8, y: 1.28, w: 0.34, h: 0.34 });
    s.addText("EL PROYECTO DEL DOCENTE · EN ESTE CURSO YO TAMBIÉN CONSTRUYO", {
      x: 5.26, y: 1.26, w: 7.5, h: 0.38, fontFace: F.mono, fontSize: 10.5, color: C.naranja, charSpacing: 1.5, margin: 0, valign: "middle",
    });
    s.addText("CÓMO SE ACOTA\nUN ALCANCE", {
      x: 4.8, y: 1.95, w: 7.95, h: 2.2, fontFace: F.display, fontSize: 46, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 0.95,
    });
    s.addText("Entradas con reventa controlada · el caso con el que lo voy a mostrar", {
      x: 4.8, y: 4.35, w: 7.95, h: 0.5, fontFace: F.body, fontSize: 16, color: "B9B4C4", margin: 0, valign: "top",
    });
    s.addText("Blockchain y Web 3.0 · Ingeniería de Sistemas\nUniversidad de San Buenaventura Medellín", {
      x: 4.8, y: 5.35, w: 7.95, h: 0.8, fontFace: F.body, fontSize: 13.5, color: "8B8697", margin: 0, valign: "top", lineSpacingMultiple: 1.25,
    });
    s.addNotes("Presentar el propósito: mostrar con un caso real cómo se acota un alcance antes del anteproyecto. El proyecto del docente crece una pieza por sesión, a la vista de todos. 2 minutos.");
    nSlide++;
  }

  /* ---------- Por qué ---------- */
  {
    const s = await lamina({ kicker: "Encuadre", titulo: "En este curso yo también hago proyecto", ic: "usuario", tituloSize: 27 });
    parrafo(s, "No para competir con ustedes ni para tener algo bonito que mostrar. Por tres razones concretas.", { y: 1.9, h: 0.5, size: 14.5 });
    const razones = [
      ["01", "VAN A VER EL PROCESO, NO EL RESULTADO", "Un proyecto terminado no enseña nada sobre cómo se llegó ahí. Van a ver el código feo de la semana tres y cómo se refactoriza en la nueve."],
      ["02", "VOY A EQUIVOCARME EN VIVO", "Y a corregirlo delante de ustedes. Eso es más útil que veinte diapositivas sobre buenas prácticas."],
      ["03", "TENDRÁN UNA VARA DE MEDIDA", "Cuando pregunten «¿esto está bien?», habrá un referente concreto que también se está construyendo, con las mismas restricciones de tiempo."],
    ];
    razones.forEach((r, i) => {
      const y = 2.6 + i * 1.35;
      s.addText(r[0], { x: M, y: y + 0.05, w: 0.8, h: 0.5, fontFace: F.display, fontSize: 26, color: C.naranja, margin: 0, valign: "middle" });
      s.addText(r[1], { x: M + 0.95, y, w: 5.2, h: 0.4, fontFace: F.mono, fontSize: 11, bold: true, color: C.tinta, charSpacing: 1.15, margin: 0, valign: "middle" });
      parrafo(s, r[2], { x: M + 6.3, y: y - 0.02, w: CW - 6.3, h: 1.1, size: 13 });
      linea(s, M, y - 0.18, M + CW, y - 0.18, C.grisClaro, 1);
    });
    linea(s, M, 2.42 + 3 * 1.35, M + CW, 2.42 + 3 * 1.35, C.grisClaro, 1);
    s.addNotes("El proyecto crece una pieza por sesión, justo después de explicar el concepto que esa pieza necesita. Hoy toca la pieza cero: el alcance.");
  }

  /* ---------- El problema ---------- */
  {
    const s = await lamina({ kicker: "El caso", titulo: "Entradas con reventa controlada", ic: "pantalla", tituloSize: 29 });
    parrafo(s, "En los eventos universitarios y culturales pasan dos cosas, y ambas por la misma razón: la entrada es un dato que se puede copiar, y una promesa que nadie puede hacer cumplir.", { y: 1.9, h: 0.7, size: 14.5 });

    caja(s, { x: M, y: 2.75, w: CW / 2 - 0.12, h: 1.5, fill: C.superf });
    s.addText("FALSIFICACIÓN", { x: M + 0.3, y: 2.95, w: 4, h: 0.32, fontFace: F.mono, fontSize: 11, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Una imagen con un código se reenvía y varias personas llegan con la misma entrada.", { x: M + 0.3, y: 3.32, w: CW / 2 - 0.72, h: 0.8, size: 13 });

    caja(s, { x: M + CW / 2 + 0.12, y: 2.75, w: CW / 2 - 0.12, h: 1.5, fill: C.superf });
    s.addText("REVENTA A SOBREPRECIO", { x: M + CW / 2 + 0.42, y: 2.95, w: 4.5, h: 0.32, fontFace: F.mono, fontSize: 11, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "El organizador la prohíbe en sus términos y condiciones, y no tiene forma de impedirla.", { x: M + CW / 2 + 0.42, y: 3.32, w: CW / 2 - 0.72, h: 0.8, size: 13 });

    enunciado(s, "Quien emite la entrada pierde el control sobre ella en el momento en que la entrega. A partir de ahí solo puede confiar.", { y: 4.5, h: 1.35, size: 20 });
    parrafo(s, "Ese es el problema. Todavía no he dicho ni una palabra sobre la solución — y ese orden importa más de lo que parece.", { y: 6.05, h: 0.55, size: 13, color: C.gris });
    s.addNotes("Insistir en que el enunciado del problema no menciona blockchain, ni NFT, ni contratos. Si el problema solo se puede enunciar nombrando la tecnología, es que se partió de la solución.");
  }

  /* ---------- DIVISOR A ---------- */
  (await divisor({ letra: "A", titulo: "Cómo se acota un alcance", sub: "Lo que separa un proyecto que se termina de uno que se abandona en la semana diez.", minutos: "LO QUE HAY QUE APRENDER HOY", ic: "tijera" })).addNotes("Lo que hay que aprender hoy: el error de partida, el doble diamante, el punto de vista, las historias con criterios de aceptación y el corte vertical. Cada idea se muestra aplicada al caso de las entradas.");

  /* ---------- El error de partida ---------- */
  {
    const s = await lamina({ kicker: "A.1 · el error de partida", titulo: "Llegar con la solución en la mano", ic: "equis", tituloSize: 28 });
    parrafo(s, "La mayoría de los anteproyectos empiezan por «quiero hacer una aplicación de…». Eso ya es una solución, y detrás no hay un problema examinado: hay una tecnología que llamó la atención.", { y: 1.9, h: 0.7, size: 14.5 });

    tabla(s, ["se dice así", "y esconde esto"], [
      ["«Quiero hacer un NFT de diplomas»", "¿Qué problema tiene hoy alguien con los diplomas? ¿Quién sufre, cuánto, y cuánto le cuesta?"],
      ["«Una app de trazabilidad con blockchain»", "¿Trazabilidad de qué, para quién, y quién no le cree hoy a quién?"],
      ["«Un sistema de votación descentralizado»", "¿Qué votación concreta? ¿El voto es secreto? Porque si lo es, cambia todo."],
    ], { y: 2.8, h: 2.55, colW: [4.5, 7.593], size: 12 });

    const r = await ficha(s, { tipo: "alerta", etiqueta: "La prueba de fuego", x: M, y: 5.6, w: CW, h: 1.05 });
    parrafo(s, "Si no pueden enunciar su problema SIN nombrar la tecnología, todavía no tienen un problema: tienen una solución buscando dónde aplicarse.", { x: r.x, y: r.y - 0.08, w: r.w, h: 0.45, size: 13 });
    s.addNotes("Este es el filtro del criterio de pertinencia de la rúbrica, que vale el 15 %. Vale la pena decirlo explícitamente.");
  }

  /* ---------- Doble diamante ---------- */
  {
    const s = await lamina({ kicker: "A.2 · diseño centrado en el problema", titulo: "Divergir, después converger. Dos veces.", ic: "diamante", tituloSize: 26 });
    parrafo(s, "El doble diamante viene del diseño, y es la herramienta más útil que hay para acotar. Se abre para explorar y se cierra para decidir — y se hace dos veces: una sobre el problema y otra sobre la solución.", { y: 1.85, h: 0.65, size: 13.5 });

    const dy = 3.0, dh = 1.9;
    s.addShape(pres.ShapeType.diamond, { x: M + 0.3, y: dy, w: 5.0, h: dh, fill: { type: "none" }, line: { color: C.tinta, width: 2.5 } });
    s.addShape(pres.ShapeType.diamond, { x: M + 6.5, y: dy, w: 5.0, h: dh, fill: { type: "none" }, line: { color: C.naranja, width: 2.5 } });

    s.addText("EL PROBLEMA", { x: M + 0.3, y: dy + 0.62, w: 5.0, h: 0.4, fontFace: F.display, fontSize: 15, color: C.tinta, align: "center", valign: "middle", margin: 0 });
    s.addText("LA SOLUCIÓN", { x: M + 6.5, y: dy + 0.62, w: 5.0, h: 0.4, fontFace: F.display, fontSize: 15, color: C.ocre, align: "center", valign: "middle", margin: 0 });

    const et = [
      [M + 0.3, "1 · DESCUBRIR", "muchas preguntas"],
      [M + 2.8, "2 · DEFINIR", "un solo problema"],
      [M + 6.5, "3 · IDEAR", "muchas opciones"],
      [M + 9.0, "4 · ENTREGAR", "una sola solución"],
    ];
    et.forEach(e => {
      s.addText(e[1], { x: e[0], y: 2.6, w: 2.5, h: 0.3, fontFace: F.mono, fontSize: 9.5, bold: true, color: C.tinta, charSpacing: 1.1, align: "center", margin: 0, valign: "middle" });
      s.addText(e[2], { x: e[0], y: dy + dh + 0.08, w: 2.5, h: 0.3, fontFace: F.mono, fontSize: 9.5, color: C.gris, align: "center", margin: 0, valign: "middle" });
    });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "El error que hay que evitar", x: M, y: 5.42, w: CW, h: 1.28 });
    parrafo(s, "Saltar directo al segundo diamante. Llegar con la solución significa empezar en el paso 3 sin haber hecho nunca el 1 ni el 2 — y entonces el proyecto resuelve un problema que nadie examinó.", { x: r.x, y: r.y - 0.06, w: r.w, h: 0.6, size: 13, color: C.tinta });
    s.addNotes("El primer diamante es el que casi nadie hace. Es también el más barato: son conversaciones, no código.");
  }

  /* ---------- Diamante 1 · Descubrir ---------- */
  {
    const s = await lamina({ kicker: "A.2.1 · primer diamante · descubrir", titulo: "Lo que encontré al preguntar", ic: "lupa", tituloSize: 28 });
    parrafo(s, "Cinco conversaciones de veinte minutos: dos organizadores de eventos pequeños, dos personas que compran entradas con frecuencia, y alguien que ha trabajado en puerta. Nada más. Una semana.", { y: 1.88, h: 0.6, size: 13.5 });

    const hallazgos = [
      ["EL ORGANIZADOR", "«Yo prohíbo la reventa en las condiciones, pero no tengo cómo saber si pasó. Me entero cuando alguien llega bravo a la puerta.»"],
      ["QUIEN COMPRA", "«Compré por fuera y me tocó arriesgarme. El vendedor me mandó una foto del código y recé.»"],
      ["QUIEN TRABAJA EN PUERTA", "«Cuando hay dos con el mismo código, entra el que llegó primero. Al otro le toca discutir conmigo, y yo no decido nada.»"],
      ["EL HALLAZGO QUE NO ESPERABA", "La plataforma que vende las entradas COBRA COMISIÓN POR CADA REVENTA. Es el actor con menos incentivo para limitarla — y es justo a quien el organizador le delegó el problema."],
    ];
    hallazgos.forEach((h, i) => {
      const y = 2.55 + i * 0.95;
      const ultimo = i === 3;
      const hc = ultimo ? 1.0 : 0.8;
      caja(s, { x: M, y, w: CW, h: hc, fill: ultimo ? C.blanco : C.superf, line: ultimo ? C.naranja : C.tinta, sombraColor: ultimo ? C.naranja : C.tinta, sombra: ultimo });
      s.addText(h[0], { x: M + 0.28, y: y + 0.08, w: 3.6, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: ultimo ? C.ocre : C.gris, charSpacing: 1.15, margin: 0, valign: "middle" });
      parrafo(s, h[1], { x: M + 0.28, y: y + 0.4, w: CW - 0.56, h: hc - 0.44, size: 12.5, color: ultimo ? C.tinta : C.tintaSuav });
    });

    parrafo(s, "Ese último renglón cambió el proyecto. Sin él, la respuesta obvia habría sido «que el organizador monte su propia plataforma».", { y: 6.5, h: 0.3, size: 12.5, color: C.gris });
    s.addNotes("Divergir cuesta una semana de conversaciones y no cuesta una línea de código. Es la fase con mejor retorno de todo el proyecto.");
  }

  /* ---------- Diamante 2 · Definir ---------- */
  {
    const s = await lamina({ kicker: "A.2.2 · primer diamante · definir", titulo: "De cinco problemas a uno", ic: "diamante", tituloSize: 28 });
    parrafo(s, "Converger duele, porque hay que soltar problemas reales. Estos cinco salieron de las conversaciones. Cuatro se descartaron.", { y: 1.88, h: 0.5, size: 13.5 });

    tabla(s, ["problema candidato", "por qué NO lo elegí"], [
      ["La fila en la puerta es lenta", "Es un problema de operación y de personal, no de confianza. Se resuelve con más lectores y más gente."],
      ["No se sabe cuánta gente entró de verdad", "Es un problema de instrumentación. Un contador y una hoja de cálculo lo resuelven."],
      ["El pago al artista se demora", "Real, pero es un problema contractual entre dos partes que ya se conocen y tienen contrato firmado."],
      ["La entrada se falsifica", "Es la mitad del problema, y se resuelve sin cadena: un código dinámico desde un servidor basta."],
      ["LA REGLA DE REVENTA NO SE PUEDE HACER CUMPLIR", "ELEGIDO. Es el único donde hay partes con intereses opuestos y el árbitro disponible es parte interesada."],
    ], { y: 2.45, h: 3.25, colW: [4.8, 7.293], size: 11.5 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "El criterio de corte", x: M, y: 5.9, w: CW, h: 0.85 });
    s.addText("Me quedé con el único problema donde la tecnología aporta algo que la organización no puede aportar sola.", { x: r.x, y: r.y - 0.12, w: r.w, h: 0.3, fontFace: F.display, fontSize: 14, color: C.tinta, margin: 0, valign: "middle" });
    s.addNotes("Los cuatro descartados son buenos problemas. Simplemente no son problemas de este curso, y decirlo así es más honesto que forzarlos.");
  }

  /* ---------- Diamante 3 · Idear ---------- */
  {
    const s = await lamina({ kicker: "A.2.3 · segundo diamante · idear", titulo: "Cinco caminos, no uno", ic: "rejilla", tituloSize: 28 });
    parrafo(s, "Con el problema fijado, se abre otra vez. La tecnología aparece aquí — y solo como una opción entre varias.", { y: 1.88, h: 0.45, size: 13.5 });

    tabla(s, ["camino", "¿frena la falsificación?", "¿frena la reventa?", "¿exige confiar en el organizador?"], [
      ["Reglamento y sanciones", "No", "No — solo castiga si se entera", "Sí"],
      ["Entrada nominal con documento", "Parcialmente", "La complica, no la impide", "Sí, y trata datos personales"],
      ["Plataforma propia con tope", "Sí", "Sí, si toda la reventa pasa por ahí", "Sí, del todo"],
      ["Código dinámico desde un servidor", "Sí", "No", "Sí, del todo"],
      ["La regla dentro de un contrato", "Sí", "Sí, y no se puede rodear", "No"],
    ], { y: 2.4, h: 3.1, colW: [3.35, 2.5, 2.75, 3.493], size: 11 });

    const r = await ficha(s, { tipo: "alerta", etiqueta: "Lectura honesta de la tabla", x: M, y: 5.62, w: CW, h: 1.15 });
    parrafo(s, "La tercera opción —plataforma propia— resuelve las dos columnas del medio y es mucho más barata de construir. Si el organizador fuera de fiar, sería la respuesta correcta y este proyecto no existiría.", { x: r.x, y: r.y - 0.06, w: r.w, h: 0.6, size: 12.5 });
    s.addNotes("No esconder que hay una solución más simple. Reconocerla y explicar por qué no sirve AQUÍ es lo que sostiene el criterio de pertinencia.");
  }

  /* ---------- Diamante 4 · Entregar ---------- */
  {
    const s = await lamina({ kicker: "A.2.4 · segundo diamante · entregar", titulo: "Por qué gana el contrato, y qué cuesta", ic: "diamante", tituloSize: 27 });

    caja(s, { x: M, y: 1.9, w: CW, h: 1.5, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("LA ÚNICA COLUMNA QUE LO DECIDE", { x: M + 0.32, y: 2.12, w: 6, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.violetaOs, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "La última: «¿exige confiar en el organizador?». Y esa columna solo importa por el hallazgo del primer diamante — que el intermediario gana con la reventa. Sin ese dato, ninguna de las dos últimas opciones se distinguiría.", { x: M + 0.32, y: 2.5, w: CW - 0.64, h: 0.8, size: 13.5 });

    parrafo(s, "Elegir no es solo quedarse con lo bueno. Es aceptar lo que viene con ello:", { y: 3.55, h: 0.4, size: 14 });

    const costos = [
      ["LO QUE GANO", "La regla se ejecuta sola. Nadie puede rodearla, ni siquiera el organizador."],
      ["LO QUE PIERDO", "Quien no tiene billetera no puede comprar. Quien la pierde, pierde la entrada."],
      ["LO QUE NO RESUELVO", "Que quien escanea en la puerta haga bien su trabajo. Eso sigue siendo un problema humano."],
    ];
    costos.forEach((c, i) => {
      const y = 4.05 + i * 0.8;
      caja(s, { x: M, y, w: CW, h: 0.68, fill: i === 0 ? C.superf : C.blanco, line: i === 0 ? C.tinta : C.naranja, sombraColor: i === 0 ? C.tinta : C.naranja, sombra: false });
      s.addText(c[0], { x: M + 0.28, y, w: 2.9, h: 0.68, fontFace: F.mono, fontSize: 10, bold: true, color: i === 0 ? C.tinta : C.ocre, charSpacing: 1.15, margin: 0, valign: "middle" });
      s.addText(c[1], { x: M + 3.3, y, w: CW - 3.6, h: 0.68, fontFace: F.body, fontSize: 12.5, color: C.tintaSuav, margin: 0, valign: "middle" });
    });

    parrafo(s, "Un equipo que solo enumera la primera fila no terminó de decidir: solo eligió lo que le gustaba.", { y: 6.5, h: 0.3, size: 12.5, color: C.gris });
    s.addNotes("Cerrar el diamante es aceptar el costo, no solo el beneficio. Es la diferencia entre elegir y desear.");
  }

  /* ---------- Divergir sobre el problema ---------- */
  {
    const s = await lamina({ kicker: "A.3 · primer diamante · descubrir", titulo: "Las preguntas que abren el problema", ic: "lupa", tituloSize: 27 });
    parrafo(s, "Antes de decidir nada. No hace falta investigación etnográfica: con cinco conversaciones dirigidas y una tarde de observación se aprende más que con dos semanas de suposiciones.", { y: 1.88, h: 0.6, size: 13.5 });

    const preg = [
      ["¿QUIÉN SUFRE ESTO?", "Nombres y roles concretos, no «los usuarios». En el caso de las entradas: el organizador, quien compra, quien revende, quien vigila la puerta."],
      ["¿CUÁNTO LE CUESTA?", "En dinero, en tiempo o en riesgo. Si nadie puede cuantificarlo ni aproximadamente, probablemente no duele tanto."],
      ["¿QUÉ HACEN HOY?", "Siempre hay una solución actual, aunque sea un cuaderno o un grupo de WhatsApp. Entenderla dice qué es lo mínimo que hay que superar."],
      ["¿POR QUÉ NO SE HA RESUELTO?", "Si es un problema evidente y sigue abierto, hay una razón. Encontrarla evita repetir el fracaso de otros."],
    ];
    preg.forEach((p, i) => {
      const y = 2.65 + i * 1.05;
      s.addText(p[0], { x: M, y, w: 3.5, h: 0.4, fontFace: F.mono, fontSize: 11, bold: true, color: C.ocre, charSpacing: 1.2, margin: 0, valign: "middle" });
      parrafo(s, p[1], { x: M + 3.7, y: y - 0.02, w: CW - 3.7, h: 0.85, size: 12.5 });
      linea(s, M, y - 0.14, M + CW, y - 0.14, C.grisClaro, 1);
    });
    linea(s, M, 2.51 + 4 * 1.05, M + CW, 2.51 + 4 * 1.05, C.grisClaro, 1);
    s.addNotes("Cinco entrevistas de veinte minutos caben en una semana y cambian por completo el enunciado. Es la inversión con mejor retorno de todo el proyecto.");
  }

  /* ---------- Punto de vista ---------- */
  {
    const s = await lamina({ kicker: "A.4 · primer diamante · definir", titulo: "Del problema al punto de vista", ic: "diamante", tituloSize: 28 });
    parrafo(s, "Converger significa escribir UNA frase. Hay una fórmula que obliga a no hacer trampa, porque si falta cualquiera de las tres partes se nota.", { y: 1.88, h: 0.5, size: 14 });

    caja(s, { x: M, y: 2.5, w: CW, h: 1.25, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText([
      { text: "[quién] ", options: { color: C.violetaOs, bold: true } },
      { text: "necesita ", options: { color: C.tintaSuav } },
      { text: "[qué] ", options: { color: C.violetaOs, bold: true } },
      { text: "porque ", options: { color: C.tintaSuav } },
      { text: "[por qué, sorprendente]", options: { color: C.violetaOs, bold: true } },
    ], { x: M + 0.3, y: 2.5, w: CW - 0.6, h: 1.25, fontFace: F.mono, fontSize: 17, align: "center", valign: "middle", margin: 0 });

    parrafo(s, "La tercera parte es la que hace el trabajo. Si el «porque» es obvio, el problema no da para un semestre. Si sorprende, hay proyecto.", { y: 3.95, h: 0.5, size: 13.5 });

    caja(s, { x: M, y: 4.6, w: CW, h: 1.9, fill: C.superf });
    s.addText("APLICADO AL PROYECTO DEL DOCENTE", { x: M + 0.32, y: 4.82, w: 6, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    s.addText("Un organizador de eventos pequeños necesita que su regla de reventa se cumpla sin depender de nadie, porque la plataforma que le vende las entradas cobra comisión por cada reventa — y es, por tanto, el actor con menos incentivo para limitarla.", {
      x: M + 0.32, y: 5.2, w: CW - 0.64, h: 1.2, fontFace: F.body, fontSize: 14.5, color: C.tinta, margin: 0, valign: "top", lineSpacingMultiple: 1.22,
    });
    s.addNotes("Ese «porque» es el hallazgo del primer diamante: no salió de la cabeza, salió de mirar quién gana con el problema.");
  }

  /* ---------- Cómo podríamos ---------- */
  {
    const s = await lamina({ kicker: "A.5 · el puente al segundo diamante", titulo: "«¿Cómo podríamos…?»", ic: "pregunta", tituloSize: 30 });
    parrafo(s, "Es un giro de una sola línea que convierte el problema en una pregunta de diseño, sin decidir todavía la solución. Sirve para abrir el segundo diamante sin cerrarlo de entrada.", { y: 1.9, h: 0.6, size: 14 });

    const ej = [
      ["DEMASIADO ANCHA", "¿Cómo podríamos arreglar la venta de entradas?", "no se puede empezar por ningún lado"],
      ["DEMASIADO ESTRECHA", "¿Cómo podríamos hacer un NFT con tope de precio?", "ya trae la solución dentro"],
      ["EN SU PUNTO", "¿Cómo podríamos hacer que una regla de reventa se cumpla sin depender de la buena voluntad de nadie?", "abre opciones y no prescribe ninguna"],
    ];
    ej.forEach((e, i) => {
      const y = 2.7 + i * 1.25;
      const esBuena = i === 2;
      caja(s, { x: M, y, w: CW, h: 1.05, fill: esBuena ? C.blanco : C.superf, line: esBuena ? C.naranja : C.tinta, sombraColor: esBuena ? C.naranja : C.tinta, sombra: esBuena });
      s.addText(e[0], { x: M + 0.3, y: y + 0.12, w: 3.2, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: esBuena ? C.ocre : C.gris, charSpacing: 1.2, margin: 0, valign: "middle" });
      s.addText(e[1], { x: M + 0.3, y: y + 0.45, w: CW - 0.6, h: 0.45, fontFace: F.body, fontSize: 14, bold: esBuena, color: C.tinta, margin: 0, valign: "middle" });
      s.addText(e[2], { x: M + CW - 3.2, y: y + 0.12, w: 2.9, h: 0.3, fontFace: F.mono, fontSize: 9.5, color: C.gris, align: "right", margin: 0, valign: "middle" });
    });
    parrafo(s, "Escriban tres. La buena casi nunca es la primera.", { y: 6.55, h: 0.4, size: 13, color: C.gris });
    s.addNotes("Nótese que la buena no menciona blockchain. La tecnología aparece al converger el segundo diamante, no antes.");
  }

  /* ---------- Historias de usuario ---------- */
  {
    const s = await lamina({ kicker: "A.6 · segundo diamante · convertir en trabajo", titulo: "Historias con criterios de aceptación", ic: "usuario", tituloSize: 26 });
    parrafo(s, "Una vez elegida la solución, hay que partirla en trozos que se puedan terminar. La unidad no es «la pantalla de compra»: es algo que alguien puede hacer de principio a fin.", { y: 1.88, h: 0.6, size: 13.5 });

    caja(s, { x: M, y: 2.55, w: CW, h: 1.0, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("Como [rol], quiero [acción] para [beneficio]", { x: M, y: 2.55, w: CW, h: 1.0, fontFace: F.mono, fontSize: 16, color: C.tinta, align: "center", valign: "middle", margin: 0 });

    parrafo(s, "Y el trozo no está listo cuando «funciona», sino cuando se cumple una condición observable que se escribió ANTES. Eso es un criterio de aceptación:", { y: 3.75, h: 0.55, size: 13.5 });

    caja(s, { x: M, y: 4.4, w: CW, h: 1.2, fill: C.tinta, line: C.tinta });
    s.addText([
      { text: "DADO QUE   ", options: { color: C.naranja } },
      { text: "Ana es dueña de la entrada 7 y la puso en venta en el tope\n", options: { color: "F4F2F7" } },
      { text: "CUANDO     ", options: { color: C.naranja } },
      { text: "Bruno paga exactamente ese precio\n", options: { color: "F4F2F7" } },
      { text: "ENTONCES   ", options: { color: C.naranja } },
      { text: "Bruno queda como dueño y a Ana se le acredita el monto", options: { color: "F4F2F7" } },
    ], { x: M + 0.3, y: 4.56, w: CW - 0.6, h: 0.95, fontFace: F.mono, fontSize: 12.5, lineSpacingMultiple: 1.3, margin: 0, valign: "top" });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Esto ya lo hicieron", x: M, y: 5.7, w: CW, h: 1.12 });
    s.addText("Es lo mismo que hacían las pruebas del laboratorio: la prueba es la especificación, y el trabajo termina cuando pasa.", { x: r.x, y: r.y - 0.14, w: r.w, h: 0.5, fontFace: F.display, fontSize: 14, color: C.tinta, margin: 0, valign: "middle" });
    s.addNotes("Conectar explícitamente con los laboratorios 1 y 2: allí las pruebas venían dadas. Aquí se las escriben ellos, y son lo mismo.");
  }

  /* ---------- Aplicado: las historias ---------- */
  {
    const s = await lamina({ kicker: "A.6 · aplicado al proyecto del docente", titulo: "Las historias, y su talla", ic: "lista", tituloSize: 28 });
    parrafo(s, "Sin histórico no se puede estimar en horas con seriedad. Se usa talla relativa: pequeña, mediana, grande. Y se fija un presupuesto total que no se puede exceder.", { y: 1.88, h: 0.55, size: 13.5 });
    tabla(s, ["#", "historia", "talla", "¿mínimo?"], [
      ["H1", "Como asistente, quiero comprar una entrada para tenerla a mi nombre.", "M", "SÍ"],
      ["H2", "Como asistente, quiero ponerla en venta dentro del tope para recuperar mi dinero.", "M", "SÍ"],
      ["H3", "Como asistente, quiero comprar una entrada en reventa para ir al evento.", "M", "SÍ"],
      ["H4", "Como personal de puerta, quiero comprobar que quien llega es el dueño real.", "G", "SÍ"],
      ["H5", "Como organizador, quiero retirar lo recaudado.", "P", "SÍ"],
      ["H6", "Como asistente, quiero ver mis entradas con su imagen y datos del evento.", "M", "no"],
      ["H7", "Como organizador, quiero ver estadísticas de venta.", "M", "no"],
    ], { y: 2.6, h: 3.8, colW: [0.7, 7.6, 1.3, 2.493], size: 11.5 });
    parrafo(s, "Cinco historias en el mínimo, dos aparcadas. Ese recorte es el alcance.", { y: 6.55, h: 0.4, size: 13, color: C.gris });
    s.addNotes("H4 es grande y es la más riesgosa. Por eso, como se ve en la lámina siguiente, es la primera que hay que atacar y no la última.");
  }

  /* ---------- Corte vertical ---------- */
  {
    const s = await lamina({ kicker: "A.7 · el orden de construcción", titulo: "Corte vertical, no capas horizontales", ic: "corte", tituloSize: 26 });
    parrafo(s, "El error de secuencia más caro: construir toda una capa antes de pasar a la siguiente. Al final del semestre hay tres piezas y ninguna se ha visto funcionar junta.", { y: 1.85, h: 0.6, size: 13.5 });

    const capas = ["CONTRATO", "INTERFAZ", "INTEGRACIÓN"];
    capas.forEach((c, i) => {
      const y = 2.95 + i * 0.6;
      caja(s, { x: M, y, w: 5.3, h: 0.48, fill: C.superf, sombra: false });
      s.addText(c, { x: M + 0.2, y, w: 5.0, h: 0.48, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.gris, charSpacing: 1.2, margin: 0, valign: "middle" });
    });
    s.addText("POR CAPAS", { x: M, y: 2.55, w: 5.3, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.tinta, charSpacing: 1.3, margin: 0, valign: "middle" });
    linea(s, M + 0.5, 3.05, M + 4.8, 4.58, C.ocre, 3);
    linea(s, M + 4.8, 3.05, M + 0.5, 4.58, C.ocre, 3);
    parrafo(s, "Nada funciona hasta el final. Y el riesgo se descubre en la última semana.", { x: M, y: 4.72, w: 5.3, h: 0.55, size: 12.5, color: C.ocre });

    const x2 = M + 6.5;
    capas.forEach((c, i) => {
      const y = 2.95 + i * 0.6;
      caja(s, { x: x2, y, w: 5.59, h: 0.48, fill: C.superf, sombra: false });
      s.addText(c, { x: x2 + 0.2, y, w: 3.0, h: 0.48, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.gris, charSpacing: 1.2, margin: 0, valign: "middle" });
    });
    s.addText("POR CORTE VERTICAL", { x: x2, y: 2.55, w: 5.59, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.tinta, charSpacing: 1.3, margin: 0, valign: "middle" });
    s.addShape(pres.ShapeType.rect, { x: x2 + 3.6, y: 2.9, w: 1.5, h: 1.73, fill: { type: "none" }, line: { color: C.naranja, width: 3 } });
    parrafo(s, "Una entrada, de punta a punta, en la semana dos. Fea, pero completa.", { x: x2, y: 4.72, w: 5.59, h: 0.55, size: 12.5, color: C.ocre });

    enunciado(s, "El primer objetivo no es que esté bien hecho: es que exista un camino completo por el que pase un caso real.", { y: 5.45, h: 1.1, size: 18 });
    s.addNotes("Se llama esqueleto ambulante. Es feo a propósito. Lo que importa es que a partir de ahí cada mejora se puede probar de verdad.");
  }

  /* ---------- MVP ---------- */
  {
    const s = await lamina({ kicker: "A.8 · qué es y qué no es un mínimo viable", titulo: "El mínimo lo define el riesgo, no el conteo", ic: "riesgo", tituloSize: 25 });
    tabla(s, ["NO es", "SÍ es"], [
      ["Una versión fea de lo mismo.", "La cosa más pequeña que pone a prueba el supuesto más riesgoso."],
      ["La mitad de las funciones.", "Un camino completo, aunque estrecho."],
      ["Lo que alcancemos a hacer.", "Lo que se decidió antes de empezar, y se defendió."],
      ["Un prototipo desechable.", "Código que se conserva y se mejora."],
    ], { y: 1.95, h: 2.5, colW: [5.5, 6.593], size: 12.5 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Aplicado al proyecto del docente", x: M, y: 4.6, w: CW, h: 2.25 });
    parrafo(s, "El supuesto más riesgoso no es que la gente compre entradas: eso ya se sabe que funciona. Es que LA REGLA DE REVENTA SE PUEDA HACER CUMPLIR de verdad, incluso contra alguien que escriba su propio programa.", { x: r.x, y: r.y, w: r.w, h: 0.85, size: 13.5 });
    parrafo(s, "Por eso el bloqueo de transferencia entra en el mínimo aunque sea la parte más difícil. Si eso no se sostiene, el proyecto entero no tiene tesis.", { x: r.x, y: r.y + 0.9, w: r.w, h: 0.7, size: 13.5, color: C.tinta });
    s.addNotes("Ataquen el riesgo primero. Si algo va a matar el proyecto, mejor saberlo en la semana tres que en la quince.");
  }

  /* ---------- Fuera de alcance ---------- */
  {
    const s = await lamina({ kicker: "A.9 · el artefacto que casi nadie escribe", titulo: "El alcance es lo que decidiste NO hacer", ic: "tijera", tituloSize: 25 });
    parrafo(s, "La lista de exclusiones es más útil que la de inclusiones, porque es la que se puede señalar cuando alguien —o uno mismo— quiera añadir algo a mitad de camino.", { y: 1.88, h: 0.6, size: 14 });

    caja(s, { x: M, y: 2.6, w: CW, h: 2.6, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("FUERA DE ALCANCE · PROYECTO DEL DOCENTE", { x: M + 0.32, y: 2.82, w: 7, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    lista(s, [
      "Pasarela de pago con dinero real — todo ocurre en red de prueba.",
      "Aplicación móvil nativa — dos páginas web bastan.",
      "Diseño gráfico elaborado — que se entienda qué pasa es suficiente.",
      "Categorías de entrada, mapas de asientos y descuentos.",
      "Recuperación de cuentas — se describe como decisión, no se implementa.",
    ], { x: M + 0.32, y: 3.22, w: CW - 0.64, h: 1.85, size: 13, gap: 5 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "La regla del «todavía no»", x: M, y: 5.4, w: CW, h: 1.25 });
    parrafo(s, "Las ideas que se caen no se tiran: se aparcan en una lista con la fecha en que se revisarán. Eso quita la ansiedad de perderlas y evita meterlas por la puerta de atrás.", { x: r.x, y: r.y - 0.04, w: r.w, h: 0.6, size: 13 });
    s.addNotes("En la sustentación se pregunta explícitamente qué quedó fuera y por qué. Un equipo sin lista de exclusiones no acotó nada.");
  }

  /* ---------- Supuestos y restricciones ---------- */
  {
    const s = await lamina({ kicker: "A.10 · lo que condiciona sin ser una decisión", titulo: "Supuestos y restricciones", ic: "escudo", tituloSize: 28 });

    caja(s, { x: M, y: 1.95, w: CW / 2 - 0.12, h: 2.5, fill: C.superf });
    s.addText("RESTRICCIONES · no se negocian", { x: M + 0.3, y: 2.15, w: 5, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.2, margin: 0, valign: "middle" });
    lista(s, [
      "Dieciséis semanas, ni una más.",
      "Tres personas, con otras materias.",
      "Sin presupuesto: solo red de prueba.",
      "El calendario del curso decide qué se puede usar y cuándo.",
    ], { x: M + 0.3, y: 2.55, w: CW / 2 - 0.72, h: 1.75, size: 12.5, gap: 4 });

    caja(s, { x: M + CW / 2 + 0.12, y: 1.95, w: CW / 2 - 0.12, h: 2.5, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("SUPUESTOS · pueden ser falsos", { x: M + CW / 2 + 0.42, y: 2.15, w: 5, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.violetaOs, charSpacing: 1.2, margin: 0, valign: "middle" });
    lista(s, [
      "El asistente tiene o puede instalar una billetera.",
      "En la puerta hay al menos un teléfono con cámara.",
      "El organizador acepta fijar un tope público.",
    ], { x: M + CW / 2 + 0.42, y: 2.55, w: CW / 2 - 0.72, h: 1.75, size: 12.5, gap: 4 });

    parrafo(s, "La diferencia importa: una restricción se acepta y se diseña alrededor de ella. Un supuesto hay que ir a comprobarlo, porque si es falso el proyecto cambia.", { y: 4.7, h: 0.6, size: 14 });

    const r = await ficha(s, { tipo: "alerta", etiqueta: "Las restricciones son aliadas", x: M, y: 5.45, w: CW, h: 1.2 });
    parrafo(s, "«Dieciséis semanas y tres personas» no es una queja: es lo que hace decidible el alcance. Un proyecto sin límites de tiempo ni de gente no se acota nunca, porque siempre cabe una función más.", { x: r.x, y: r.y - 0.04, w: r.w, h: 0.6, size: 13 });
    s.addNotes("Pedir que cada equipo escriba sus supuestos en el anteproyecto y marque cuál va a comprobar primero.");
  }

  /* ---------- Definición de terminado ---------- */
  {
    const s = await lamina({ kicker: "A.11 · cuándo se puede decir «ya está»", titulo: "Definición de terminado", ic: "bandera", tituloSize: 29 });
    parrafo(s, "Se acuerda una vez, al principio, y se aplica a todo. Sin ella cada quien tiene su propia idea de «terminado» y las entregas se discuten en vez de revisarse.", { y: 1.9, h: 0.6, size: 14 });

    const dod = [
      "El criterio de aceptación se cumple, y hay una prueba automática que lo comprueba.",
      "El código está en el repositorio, en la rama principal.",
      "Otra persona del equipo lo leyó.",
      "Funciona en la red de prueba, no solo en la máquina de quien lo escribió.",
      "Si cambió una decisión, quedó anotada en el documento del proyecto.",
    ];
    dod.forEach((d, i) => {
      const y = 2.75 + i * 0.72;
      s.addShape(pres.ShapeType.rect, { x: M, y: y + 0.06, w: 0.28, h: 0.28, fill: { type: "none" }, line: { color: C.tinta, width: 2 } });
      parrafo(s, d, { x: M + 0.55, y: y - 0.02, w: CW - 0.55, h: 0.6, size: 13.5 });
      linea(s, M, y - 0.14, M + CW, y - 0.14, C.grisClaro, 1);
    });
    linea(s, M, 2.61 + 5 * 0.72, M + CW, 2.61 + 5 * 0.72, C.grisClaro, 1);

    parrafo(s, "Cinco puntos. Si son quince, nadie los aplica.", { y: 6.45, h: 0.4, size: 13, color: C.gris });
    s.addNotes("El cuarto punto es el que más se salta y el que más problemas causa en la sustentación: funciona en el portátil de uno y no en el proyector.");
  }

  /* ---------- Deriva del alcance ---------- */
  {
    const s = await lamina({ kicker: "A.12 · el enemigo silencioso", titulo: "Deriva del alcance", ic: "alerta", tituloSize: 29 });
    parrafo(s, "Nunca llega como «vamos a duplicar el proyecto». Llega en frases pequeñas y razonables, una por semana, y para la semana diez el proyecto es otro y va tarde.", { y: 1.9, h: 0.65, size: 14 });

    tabla(s, ["cómo suena", "qué hacer"], [
      ["«Ya que estamos, podríamos añadir…»", "A la lista de «todavía no», con fecha de revisión. No al alcance."],
      ["«Es solo un campo más»", "Ningún campo es solo un campo: es interfaz, validación, prueba y documentación."],
      ["«Vi una librería que hace esto mejor»", "Si el corte vertical ya funciona, se evalúa. Si todavía no, se anota y se sigue."],
      ["«El profesor dijo que estaría bien que…»", "Preguntar si es requisito o sugerencia. Casi siempre es sugerencia."],
    ], { y: 2.65, h: 2.8, colW: [5.0, 7.093], size: 12 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "La regla de una línea", x: M, y: 5.65, w: CW, h: 0.95 });
    s.addText("Si entra algo nuevo, sale algo. El presupuesto de esfuerzo no crece porque aparezca una buena idea.", { x: r.x, y: r.y - 0.12, w: r.w, h: 0.4, fontFace: F.display, fontSize: 15, color: C.tinta, margin: 0, valign: "middle" });
    s.addNotes("Este intercambio explícito —entra uno, sale uno— es lo que convierte la conversación sobre alcance en una decisión y no en una discusión.");
  }

  /* ---------- DIVISOR B ---------- */
  (await divisor({ letra: "B", titulo: "Qué aplica y qué no", sub: "Estas disciplinas están pensadas para equipos grandes y proyectos largos. No todo se traslada.", minutos: "HONESTIDAD METODOLÓGICA", ic: "rombo" })).addNotes("Honestidad metodológica: estas disciplinas vienen de equipos grandes y proyectos largos. Decir qué se toma y qué no para un equipo de tres en un semestre.");

  /* ---------- Sí aplica ---------- */
  {
    const s = await lamina({ kicker: "B.1 · lo que sí se traslada", titulo: "Lo que sí vale la pena en un semestre", ic: "escudoCheck", tituloSize: 26 });
    tabla(s, ["de dónde viene", "qué se usa", "para qué sirve aquí"], [
      ["Diseño (design thinking)", "Doble diamante · punto de vista · «¿cómo podríamos?»", "Impide llegar con la solución hecha y no haber mirado el problema."],
      ["Gestión de proyectos", "Enunciado de alcance · lista de exclusiones · supuestos y restricciones", "Convierte «vamos a hacer una app» en algo que se puede terminar y defender."],
      ["Ingeniería de software", "Historias con criterios de aceptación · corte vertical · definición de terminado", "Hace que «terminado» signifique lo mismo para todos y que se pueda comprobar."],
      ["Gestión de riesgos", "Atacar primero lo más incierto", "Descubrir en la semana tres, no en la quince, si la tesis no se sostiene."],
    ], { y: 1.95, h: 4.4, colW: [3.0, 4.4, 4.693], size: 11.5 });
    s.addNotes("Son cuatro ideas, no cuatro metodologías. Nadie está pidiendo certificarse en nada.");
  }

  /* ---------- No aplica ---------- */
  {
    const s = await lamina({ kicker: "B.2 · lo que no se traslada", titulo: "Lo que NO vale la pena aquí", ic: "equis", tituloSize: 28 });
    parrafo(s, "Decirlo evita que gasten tiempo en ceremonias que no les devuelven nada a esta escala.", { y: 1.88, h: 0.42, size: 13.5, color: C.gris });
    tabla(s, ["qué", "por qué no, y qué hacer en su lugar"], [
      ["Scrum completo con ceremonias", "Tres personas y dieciséis semanas no necesitan cuatro reuniones por sprint. Un tablero con tres columnas y una reunión semanal de treinta minutos."],
      ["Estimación en puntos de historia", "Sin histórico propio, los puntos son horas disfrazadas. Tallas relativas —pequeña, mediana, grande— y un presupuesto total que no se excede."],
      ["Documentación UML exhaustiva", "Nadie la lee ni la mantiene. Un diagrama de contexto y uno de secuencia del flujo crítico. Nada más."],
      ["Investigación de usuarios formal", "No hay tiempo ni acceso. Cinco conversaciones dirigidas de veinte minutos rinden casi lo mismo para este alcance."],
      ["Arquitectura completa antes de codificar", "Se decide sobre supuestos no comprobados. Corte vertical primero; la arquitectura emerge de lo que ya funciona."],
    ], { y: 2.45, h: 4.0, colW: [4.0, 8.093], size: 11.5 });
    s.addNotes("El criterio general: en un equipo pequeño, la comunicación directa reemplaza al proceso. El proceso existe para escalar la comunicación, y aquí no hace falta escalarla.");
  }

  /* ---------- DIVISOR C ---------- */
  (await divisor({ letra: "C", titulo: "El alcance de nuestro proyecto", sub: "Todo lo anterior, aplicado. Con el porqué de cada recorte, y lo que cada recorte costó.", minutos: "EL CASO COMPLETO", ic: "tijera" })).addNotes("El caso completo: el alcance del proyecto del docente con el porqué de cada recorte y lo que cada recorte costó. Es el modelo de lo que se espera en el anteproyecto.");

  /* ---------- C.1 · el alcance en una lámina ---------- */
  {
    const s = await lamina({ kicker: "C.1 · el alcance, de un vistazo", titulo: "Dentro y fuera", ic: "corte", tituloSize: 30 });
    parrafo(s, "Cinco historias dentro, todo lo demás fuera. Esta lámina es el contrato conmigo mismo: lo que esté a la izquierda se termina, lo que esté a la derecha no se toca.", { y: 1.88, h: 0.6, size: 13.5 });

    caja(s, { x: M, y: 2.5, w: CW / 2 - 0.12, h: 3.08, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("DENTRO · se termina", { x: M + 0.3, y: 2.72, w: 4.5, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.violetaOs, charSpacing: 1.2, margin: 0, valign: "middle" });
    lista(s, [
      "Emitir un lote con aforo fijo.",
      "Comprar una entrada del lote original.",
      "Ponerla en venta, dentro del tope.",
      "Comprarla en reventa.",
      "Validar en puerta que quien llega es el dueño.",
      "Que el organizador retire lo recaudado.",
    ], { x: M + 0.3, y: 3.12, w: CW / 2 - 0.72, h: 2.35, size: 12.5, gap: 4 });

    caja(s, { x: M + CW / 2 + 0.12, y: 2.5, w: CW / 2 - 0.12, h: 3.08, fill: C.superf, sombra: false });
    s.addText("FUERA · ni se empieza", { x: M + CW / 2 + 0.42, y: 2.72, w: 4.5, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.gris, charSpacing: 1.2, margin: 0, valign: "middle" });
    lista(s, [
      "Pago con dinero real.",
      "Aplicación móvil nativa.",
      "Diseño gráfico elaborado.",
      "Categorías de entrada y mapa de asientos.",
      "Recuperación de cuentas.",
      "Estadísticas para el organizador.",
    ], { x: M + CW / 2 + 0.42, y: 3.12, w: CW / 2 - 0.72, h: 2.35, size: 12.5, gap: 4, color: C.gris });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "La prueba de que está acotado", x: M, y: 5.75, w: CW, h: 0.9 });
    s.addText("Cabe en una lámina. Si no cupiera, todavía no estaría decidido.", { x: r.x, y: r.y - 0.16, w: r.w, h: 0.4, fontFace: F.display, fontSize: 15, color: C.tinta, margin: 0, valign: "middle" });
    s.addNotes("La columna derecha no es una lista de fracasos: es la lista que se señala cuando alguien —incluido yo— quiera añadir algo en la semana ocho.");
  }

  /* ---------- C.2 · decisiones I ---------- */
  {
    const s = await lamina({ kicker: "C.2 · las decisiones y su porqué · 1 de 2", titulo: "Sobre la regla", ic: "rombo", tituloSize: 29 });
    tabla(s, ["decisión", "por qué", "qué descarté"], [
      ["Poner un TOPE a la reventa, no prohibirla",
       "Prohibir castiga a quien de verdad no puede ir y empuja la venta a un canal donde nadie protege a nadie. El tope conserva el uso legítimo y mata el especulativo.",
       "La entrada intransferible. Es hostil con el usuario honesto y no resuelve nada que el tope no resuelva."],
      ["BLOQUEAR la transferencia directa",
       "Es lo único que hace real el tope. Si la entrada se puede mover por fuera, la regla vuelve a ser una promesa.",
       "Cobrar un porcentaje por cada transferencia. No pone techo al precio: solo lo grava, y el revendedor lo traslada al comprador."],
      ["CERRAR la reventa antes del evento",
       "Es lo que permite que la puerta funcione sin conexión: se descarga la lista de dueños y ya no cambia.",
       "Reventa abierta hasta el último minuto. Obligaría a consultar la cadena en vivo, justo donde peor señal hay."],
    ], { y: 1.95, h: 4.7, colW: [3.3, 4.7, 4.093], size: 11 });
    s.addNotes("Las tres son decisiones de producto, no técnicas. La técnica viene después y se subordina a ellas.");
  }

  /* ---------- C.3 · decisiones II ---------- */
  {
    const s = await lamina({ kicker: "C.3 · las decisiones y su porqué · 2 de 2", titulo: "Sobre la construcción", ic: "capas", tituloSize: 28 });
    tabla(s, ["decisión", "por qué", "qué descarté"], [
      ["Validar en puerta con RETO Y RESPUESTA",
       "Un código fijo en pantalla se toma en pantallazo y se reenvía. Firmar un número que cambia cada vez lo vuelve inútil.",
       "El QR estático con el número de entrada. Es lo más fácil de construir y lo primero que se rompe."],
      ["Marcar la entrada como usada FUERA de la cadena",
       "Registrarlo en cadena obliga a la fila a esperar una confirmación. La firma queda igual como evidencia de quién entró.",
       "Marcarla en cadena en la puerta. Queda en el contrato para poder mostrar el intercambio, pero no es el camino normal."],
      ["DOS interfaces separadas, no una con roles",
       "El dispositivo de la puerta se presta, se pierde y lo manejan varias personas en una noche. Si además firmara, sería el punto más débil.",
       "Una sola aplicación con permisos. Más cómoda de construir y mucho peor de defender."],
      ["Patrón de RETIRO en lugar de enviar el dinero",
       "Si el destinatario rechaza el envío, la venta entera fallaría. Y quita un camino de reentrada.",
       "Transferir al vendedor dentro de la misma operación. Un paso menos para el usuario, un riesgo más para todos."],
    ], { y: 1.95, h: 4.9, colW: [3.3, 4.7, 4.093], size: 10.5 });
    s.addNotes("La segunda decisión es la que más discusión da: el contrato tiene marcarUsada aunque el flujo normal no lo use. Está a propósito, para poder enseñar las dos opciones.");
  }

  /* ---------- C.4 · intercambios ---------- */
  {
    const s = await lamina({ kicker: "C.4 · lo que acepté perder", titulo: "Los intercambios, dichos en voz alta", ic: "riesgo", tituloSize: 27 });
    parrafo(s, "Ninguna decisión es gratis. Estas son las facturas que este alcance deja sin pagar, y las asumo a sabiendas.", { y: 1.88, h: 0.5, size: 14 });

    tabla(s, ["lo que gano", "lo que cuesta"], [
      ["La regla se cumple sola, sin depender de nadie.", "Quien no tiene billetera no puede comprar. Es la mayoría del público real."],
      ["Nadie puede revender por encima del tope.", "Quien pierde su billetera pierde la entrada. No hay «olvidé mi contraseña»."],
      ["La puerta funciona sin conexión.", "Nadie puede vender su entrada en las últimas horas, que es cuando más falta hace."],
      ["Todo movimiento queda registrado y es auditable.", "El tope es público. El organizador pierde margen de maniobra comercial."],
      ["El organizador no puede alterar el registro.", "Tampoco puede corregir un error de emisión. La inmutabilidad corta para los dos lados."],
    ], { y: 2.45, h: 3.1, colW: [5.4, 6.693], size: 11.5 });

    const r = await ficha(s, { tipo: "alerta", etiqueta: "Lo que se pregunta en la sustentación", x: M, y: 5.75, w: CW, h: 0.95 });
    parrafo(s, "Esta lámina, o su equivalente. Un equipo que solo puede llenar la columna izquierda no ha terminado de decidir: todavía está deseando.", { x: r.x, y: r.y - 0.08, w: r.w, h: 0.45, size: 12.5 });
    s.addNotes("La última fila es la más incómoda y la más importante: la inmutabilidad no es un beneficio unilateral. Corta también contra quien la eligió.");
  }

  /* ---------- Estado del proyecto ---------- */
  {
    const s = await lamina({ kicker: "Cierre · dónde va el proyecto del docente", titulo: "Lo que ya existe", ic: "matraz", tituloSize: 29 });
    parrafo(s, "El alcance está acotado y el riesgo principal, atacado. Esto es lo que hay hoy:", { y: 1.9, h: 0.45, size: 14 });

    cifra(s, "28", "Pruebas automáticas, todas pasando. Dos de ellas son la tesis del proyecto.", { x: M, y: 2.5, w: 3.85, h: 1.6, size: 44 });
    cifra(s, "7 995", "Bytes del contrato desplegado. El límite son 24 576.", { x: M + 4.12, y: 2.5, w: 3.85, h: 1.6, size: 34, color: C.ocre });
    cifra(s, "0", "Gas que cuesta validar en la puerta: es una consulta, no una transacción.", { x: M + 8.24, y: 2.5, w: 3.85, h: 1.6, size: 44, color: C.violeta });

    caja(s, { x: M, y: 4.3, w: CW, h: 1.35, fill: C.tinta, line: C.tinta });
    s.addText([
      { text: "Entradas · transferencia directa\n", options: { color: "9A95A8" } },
      { text: "  ✔ bloquea transferFrom aunque lo llame el propietario\n", options: { color: "8FD98F" } },
      { text: "  ✔ rechaza poner en venta por encima del tope", options: { color: "8FD98F" } },
    ], { x: M + 0.3, y: 4.5, w: CW - 0.6, h: 1.0, fontFace: F.mono, fontSize: 12.5, lineSpacingMultiple: 1.25, margin: 0, valign: "top" });

    parrafo(s, "Esas dos líneas verdes son el proyecto entero. Si alguna se pusiera en rojo, no habría tesis que defender.", { y: 5.8, h: 0.55, size: 13.5 });
    s.addNotes("El contrato se construye en vivo entre las sesiones 6 y 11. Lo que se muestra aquí es el destino, no lo que existirá en la sesión 6.");
  }

  /* ---------- Qué se espera ---------- */
  {
    const s = await lamina({ kicker: "Entrega 1 de 3 · qué entregan ustedes", titulo: "Su entrega de esta etapa: el alcance", ic: "documento", tituloSize: 28 });
    parrafo(s, "Todo lo de hoy cabe en una página. Si no cabe, es que todavía no está acotado.", { y: 1.9, h: 0.45, size: 14 });

    const items = [
      ["01", "EL PUNTO DE VISTA", "Una frase con la fórmula: quién, qué, y el porqué sorprendente."],
      ["02", "LA PREGUNTA DE DISEÑO", "Un «¿cómo podríamos…?» que no nombre la tecnología."],
      ["03", "DÓNDE ENTRA BLOCKCHAIN", "Y dónde no. Con el recorrido por el árbol de decisión."],
      ["04", "LAS HISTORIAS DEL MÍNIMO", "Entre cuatro y seis, con su talla y su criterio de aceptación."],
      ["05", "LO QUE QUEDA FUERA", "La lista explícita. Es la parte que se revisa primero."],
      ["06", "SUPUESTOS Y RESTRICCIONES", "Y cuál supuesto van a comprobar antes que los demás."],
    ];
    items.forEach((it, i) => {
      const y = 2.5 + i * 0.7;
      s.addText(it[0], { x: M, y: y + 0.02, w: 0.6, h: 0.4, fontFace: F.display, fontSize: 18, color: C.naranja, margin: 0, valign: "middle" });
      s.addText(it[1], { x: M + 0.75, y, w: 4.3, h: 0.4, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.tinta, charSpacing: 1.15, margin: 0, valign: "middle" });
      parrafo(s, it[2], { x: M + 5.3, y: y - 0.02, w: CW - 5.3, h: 0.6, size: 12.5 });
      linea(s, M, y - 0.13, M + CW, y - 0.13, C.grisClaro, 1);
    });
    linea(s, M, 2.37 + 6 * 0.7, M + CW, 2.37 + 6 * 0.7, C.grisClaro, 1);
    s.addNotes("Es la primera de tres entregas del anteproyecto. Las siguientes son la arquitectura con la especificación, y el plan de trabajo.");
  }

  /* ---------- Lo que viene ---------- */
  {
    const s = await lamina({ kicker: "Entrega 2 · la próxima sesión", titulo: "Lo que sigue: arquitectura y especificación", ic: "corte", tituloSize: 25 });
    parrafo(s, "El alcance dice QUÉ se va a construir. La arquitectura dice CÓMO se reparte, y la especificación dice exactamente qué hace cada pieza. Se presenta por partes porque en ese orden se puede corregir barato.", { y: 1.9, h: 0.7, size: 14 });

    const partes = [
      ["ENTREGA 1", "EL ALCANCE", "Punto de vista, historias del mínimo, lo que queda fuera.", true],
      ["ENTREGA 2", "ARQUITECTURA Y SPEC", "Las piezas, cómo se hablan, y qué hace cada una exactamente.", false],
      ["ENTREGA 3", "PLAN DE TRABAJO", "Quién hace qué, en qué orden, y contra qué riesgo.", false],
    ];
    partes.forEach((p, i) => {
      const y = 2.65 + i * 1.0;
      caja(s, { x: M, y, w: CW, h: 0.86, fill: p[3] ? C.superf : C.blanco, line: i === 1 ? C.naranja : C.tinta, sombraColor: i === 1 ? C.naranja : C.tinta, sombra: i === 1 });
      s.addText(p[0], { x: M + 0.3, y: y + 0.1, w: 1.9, h: 0.34, fontFace: F.mono, fontSize: 10, bold: true, color: p[3] ? C.gris : C.ocre, charSpacing: 1.2, margin: 0, valign: "middle" });
      s.addText(p[1], { x: M + 0.3, y: y + 0.46, w: 4.5, h: 0.38, fontFace: F.display, fontSize: 15, color: p[3] ? C.gris : C.tinta, margin: 0, valign: "middle" });
      parrafo(s, p[2], { x: M + 5.2, y: y + 0.2, w: CW - 5.5, h: 0.65, size: 12.5, color: p[3] ? C.gris : C.tintaSuav });
      if (p[3]) s.addText("HECHA", { x: M + CW - 1.5, y: y + 0.1, w: 1.2, h: 0.34, fontFace: F.mono, fontSize: 9.5, bold: true, color: C.gris, align: "right", margin: 0, valign: "middle" });
    });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Por qué en este orden", x: M, y: 5.66, w: CW, h: 1.04 });
    s.addText("Cambiar el alcance cuesta una conversación. Cambiar la arquitectura cuesta una semana. Cambiar el código cuesta el semestre.", { x: r.x, y: r.y - 0.14, w: r.w, h: 0.5, fontFace: F.display, fontSize: 14, color: C.tinta, margin: 0, valign: "middle" });
    s.addNotes("La entrega 2 traerá el diagrama de contexto, el reparto en componentes, la interfaz del contrato función por función, y el flujo crítico en secuencia.");
  }

  /* ---------- CIERRE ---------- */
  {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addImage({ data: await icono("tijera", C.naranja), x: M, y: 1.5, w: 0.5, h: 0.5 });
    s.addText("LO ÚNICO QUE HAY QUE RECORDAR", {
      x: M + 0.7, y: 1.53, w: 9, h: 0.44, fontFace: F.mono, fontSize: 12, color: C.naranja, charSpacing: 2, margin: 0, valign: "middle",
    });
    s.addText("EL ALCANCE NO ES\nLO QUE VAS A HACER.\nES LO QUE DECIDISTE\nNO HACER.", {
      x: M, y: 2.4, w: 11.5, h: 3.0, fontFace: F.display, fontSize: 40, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 1.02,
    });
    s.addText("Universidad de San Buenaventura Medellín · Facultad de Ingeniería\nBlockchain y Web 3.0 · El proyecto del docente · Acotar el alcance", {
      x: M, y: 6.0, w: 9.5, h: 0.8, fontFace: F.mono, fontSize: 10, color: "6E6A7C", margin: 0, valign: "top", lineSpacingMultiple: 1.35,
    });
    s.addNotes("Leer la frase en voz alta y cerrar. La entrega 1 de los equipos es su alcance en una página; la próxima entrega es arquitectura y especificación. 1 minuto.");
    nSlide++;
  }

  const salida = "D:/Curso Blockchain y Web 3.0/material/Proyecto-docente-acotar-alcance.pptx";
  await pres.writeFile({ fileName: salida });
  console.log("Generado:", salida, "·", nSlide, "láminas");
}

construir().catch(e => { console.error(e); process.exit(1); });
