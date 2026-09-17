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
  s.addText("SESIÓN 04 · ACTIVIDAD · ¿ESTONIA ESTÁ DE VERDAD EN LA CADENA?", {
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
   CONSTRUCCIÓN DEL DECK · ACTIVIDAD 4 · EL CASO ESTONIA
   45 minutos de presentación: el caso, el encargo, la entrega.
   ===================================================================== */

Object.assign(ICONOS, {
  lupa:     "M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l5 5",
  archivo:  "M3 4h18v4H3zM5 8v12h14V8M9 12h6",
  balanza:  "M12 3v18M6 21h12M12 6 4 9l3 5 3-5zM12 6l8 3-3 5-3-5z",
  mundo:    "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18",
  huella:   "M12 3a9 9 0 00-9 9M12 7a5 5 0 00-5 5v4M12 11a1 1 0 00-1 1v6M15 6.5A6 6 0 0118 12v3M12 21v-1",
  periodico:"M3 5h14v14H3zM17 8h4v9a2 2 0 01-4 0zM6 8h8M6 11h8M6 14h5",
});

async function construir() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Universidad de San Buenaventura Medellín";
  pres.title = "Actividad 4 · El caso Estonia";
  pres.subject = "¿Estonia está de verdad en la cadena de bloques?";

  /* ---------- PORTADA ---------- */
  {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 4.1, h: H, fill: { color: C.naranja }, line: { width: 0 } });
    s.addImage({ data: await icono("lupa", C.tinta), x: 1.35, y: 2.55, w: 1.4, h: 1.4 });
    s.addText("VERIFICAR", { x: 0, y: 4.15, w: 4.1, h: 0.7, fontFace: F.display, fontSize: 26, color: C.tinta, align: "center", valign: "middle", margin: 0 });
    s.addImage({ data: await icono("cadena", C.naranja), x: 4.8, y: 1.22, w: 0.34, h: 0.34 });
    s.addText("SESIÓN 4 · ACTIVIDAD EN EQUIPO · TRABAJO AUTÓNOMO", {
      x: 5.26, y: 1.2, w: 7.5, h: 0.38, fontFace: F.mono, fontSize: 10.5, color: C.naranja, charSpacing: 1.5, margin: 0, valign: "middle",
    });
    s.addText("¿ESTONIA ESTÁ\nDE VERDAD EN LA\nCADENA DE BLOQUES?", {
      x: 4.8, y: 1.88, w: 7.95, h: 2.6, fontFace: F.display, fontSize: 38, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 0.98,
    });
    s.addText("Un país entero repetido como caso de éxito. Una afirmación que casi nadie ha ido a verificar.", {
      x: 4.8, y: 4.62, w: 7.95, h: 0.6, fontFace: F.body, fontSize: 15, color: "B9B4C4", margin: 0, valign: "top", lineSpacingMultiple: 1.2,
    });
    s.addText("Blockchain y Web 3.0 · Ingeniería de Sistemas\nUniversidad de San Buenaventura Medellín", {
      x: 4.8, y: 5.55, w: 7.95, h: 0.8, fontFace: F.body, fontSize: 13, color: "8B8697", margin: 0, valign: "top", lineSpacingMultiple: 1.25,
    });
    nSlide++;
    s.addNotes("45 minutos. Bloque A el caso (22 min), bloque B el encargo (18 min), bloque C la entrega (5 min). No revelar el resultado de T1: es el hallazgo que deben hacer ellos.");
  }

  /* ---------- Agenda ---------- */
  {
    const s = await lamina({ kicker: "Lo de hoy", titulo: "Cómo vamos a usar estos 45 minutos", ic: "reloj", tituloSize: 28 });
    parrafo(s, "Al final de la sesión cada equipo se va con un encargo claro, las fuentes en la mano y una fecha. La exposición es la próxima clase.", { y: 1.9, h: 0.55, size: 14.5 });

    const pasos = [
      ["A", "EL CASO", "Qué se afirma sobre Estonia, quién lo afirma y por qué hay discusión.", "~22 min"],
      ["B", "EL ENCARGO", "Seis tareas. Tres de ellas no se pueden resolver sin abrir documentos.", "~18 min"],
      ["C", "LA ENTREGA", "Cinco minutos por equipo, la próxima sesión. Y cómo se evalúa.", "~5 min"],
    ];
    pasos.forEach((p, i) => {
      const y = 2.65 + i * 1.32;
      caja(s, { x: M, y, w: CW, h: 1.1, fill: i === 0 ? C.blanco : C.superf, sombra: i === 0 });
      s.addShape(pres.ShapeType.rect, { x: M, y, w: 0.85, h: 1.1, fill: { color: i === 0 ? C.naranja : C.grisClaro }, line: { width: 0 } });
      s.addText(p[0], { x: M, y, w: 0.85, h: 1.1, fontFace: F.display, fontSize: 30, color: C.tinta, align: "center", valign: "middle", margin: 0 });
      s.addText(p[1], { x: M + 1.1, y: y + 0.17, w: 3.2, h: 0.34, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.tinta, charSpacing: 1.3, margin: 0, valign: "middle" });
      parrafo(s, p[2], { x: M + 1.1, y: y + 0.55, w: 7.6, h: 0.45, size: 13 });
      s.addText(p[3], { x: M + CW - 2.0, y, w: 1.75, h: 1.1, fontFace: F.mono, fontSize: 12, bold: true, color: C.ocre, align: "right", valign: "middle", margin: 0 });
    });
    s.addNotes("Decir de entrada que la exposición es de 5 minutos y que habrá preguntas. Eso cambia cómo escuchan el resto.");
  }

  /* =================== DIVISOR A =================== */
  await divisor({ letra: "A", titulo: "El caso", sub: "Una afirmación que se repite tanto que dejó de examinarse. Vamos a examinarla.", minutos: "APROXIMADAMENTE 22 MINUTOS", ic: "lupa" });

  /* ---------- A.1 · la afirmación ---------- */
  {
    const s = await lamina({ kicker: "A.1 · el punto de partida", titulo: "La frase que todo el mundo repite", ic: "mundo", tituloSize: 29 });
    parrafo(s, "En cualquier lista de «casos de éxito de blockchain en el sector público», Estonia aparece de primera. Siempre con el mismo tono de hecho consumado.", { y: 1.9, h: 0.6, size: 14.5 });

    enunciado(s, "«Estonia puso sus registros públicos en blockchain.»", { y: 2.72, h: 1.15, size: 26 });

    const eco = [
      "«Fue el primer país del mundo en hacerlo.»",
      "«Las historias clínicas de sus ciudadanos están en la cadena.»",
      "«Lo hace desde antes de que existiera Bitcoin.»",
    ];
    eco.forEach((t, i) => {
      const y = 4.15 + i * 0.62;
      s.addText(t, { x: M + 0.6, y, w: CW - 1.2, h: 0.5, fontFace: F.body, fontSize: 14, italic: true, color: C.gris, margin: 0, valign: "middle" });
      linea(s, M + 0.3, y + 0.25, M + 0.5, y + 0.25, C.naranja, 2);
    });

    parrafo(s, "Aparece en presentaciones corporativas, notas de prensa, trabajos de grado, informes de consultoría y material de cursos como este. Cuando algo se repite lo suficiente, deja de necesitar prueba: se vuelve paisaje.", { y: 6.15, h: 0.6, size: 13, color: C.gris });
    s.addNotes("Preguntar a la clase quién ha visto esta afirmación antes. Casi todos levantan la mano. Ese es el punto.");
  }

  /* ---------- A.2 · lo que sí ---------- */
  {
    const s = await lamina({ kicker: "A.2 · antes de dudar de nada", titulo: "Lo que Estonia sí tiene, y nadie discute", ic: "escudo", tituloSize: 27 });
    parrafo(s, "Empezar por aquí es cuestión de honestidad. Lo que Estonia construyó es real y es admirable — y no requiere una cadena de bloques.", { y: 1.9, h: 0.55, size: 14.5 });

    const cosas = [
      ["DOCUMENTO DE IDENTIDAD ELECTRÓNICO", "Con capacidad de firma digital reconocida legalmente."],
      ["INFRAESTRUCTURA DE INTERCAMBIO DE DATOS", "Las entidades del Estado se consultan entre sí sin pedirle papeles al ciudadano."],
      ["REGISTROS INTERCONECTADOS", "Civil, judicial, de propiedad, de salud, empresarial."],
      ["TRÁMITES SIN FILA NI PAPEL", "Lo que en la mayoría de los países todavía exige presencia física."],
    ];
    cosas.forEach((c, i) => {
      const y = 2.6 + i * 0.95;
      caja(s, { x: M, y, w: CW, h: 0.8, fill: C.superf, sombra: false });
      s.addText(c[0], { x: M + 0.28, y: y + 0.08, w: 6.5, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: C.tinta, charSpacing: 1.15, margin: 0, valign: "middle" });
      parrafo(s, c[1], { x: M + 0.28, y: y + 0.4, w: CW - 0.56, h: 0.35, size: 12.5, color: C.gris });
    });

    parrafo(s, "Nada de esto está en duda. Y nada de esto necesita una cadena de bloques para funcionar.", { y: 6.42, h: 0.4, size: 14, color: C.ocre });
    s.addNotes("Insistir: la crítica no va contra Estonia. Va contra una palabra. Si empezamos atacando el país, los estudiantes se ponen a la defensiva del lado equivocado.");
  }

  /* ---------- A.3 · la pieza en duda ---------- */
  {
    const s = await lamina({ kicker: "A.3 · la pieza pequeña", titulo: "Lo que sí está en duda se llama KSI", ic: "llave", tituloSize: 29 });

    caja(s, { x: M, y: 1.9, w: CW, h: 1.35, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("KSI · KEYLESS SIGNATURE INFRASTRUCTURE", { x: M + 0.32, y: 2.08, w: 8, h: 0.34, fontFace: F.mono, fontSize: 11, bold: true, color: C.violetaOs, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "«Infraestructura de firma sin llaves». La desarrolla Guardtime, una empresa estonia. Su función es detectar si un dato guardado en esos registros fue alterado.", { x: M + 0.32, y: 2.45, w: CW - 0.64, h: 0.7, size: 14 });

    parrafo(s, "Fíjense en lo que hace y en lo que no hace:", { y: 3.48, h: 0.4, size: 14 });

    caja(s, { x: M, y: 3.95, w: CW / 2 - 0.12, h: 1.5, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("LO QUE GUARDA", { x: M + 0.3, y: 4.13, w: 4, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "La HUELLA del dato — su hash. Nunca el dato mismo. Los datos no salen de las instalaciones del cliente.", { x: M + 0.3, y: 4.5, w: CW / 2 - 0.72, h: 0.85, size: 13 });

    caja(s, { x: M + CW / 2 + 0.12, y: 3.95, w: CW / 2 - 0.12, h: 1.5, fill: C.superf, sombra: false });
    s.addText("PARA QUÉ SIRVE", { x: M + CW / 2 + 0.42, y: 4.13, w: 4, h: 0.3, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.gris, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Demostrar después que la huella coincide. Es un sistema de INTEGRIDAD: detecta la alteración, no la impide.", { x: M + CW / 2 + 0.42, y: 4.5, w: CW / 2 - 0.72, h: 0.85, size: 13 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Hasta aquí no hay discusión", x: M, y: 5.65, w: CW, h: 1.05 });
    parrafo(s, "Todo el mundo está de acuerdo en qué hace KSI. El desacuerdo empieza en cómo se llama.", { x: r.x, y: r.y - 0.08, w: r.w, h: 0.45, size: 13.5 });
    s.addNotes("Conectar con la sesión 2: esto es exactamente un árbol de Merkle sobre datos, con sellado de tiempo. Ya lo construimos.");
  }

  /* ---------- A.4 · el desacuerdo ---------- */
  {
    const s = await lamina({ kicker: "A.4 · el nudo", titulo: "El desacuerdo, en una línea", ic: "balanza", tituloSize: 30 });

    caja(s, { x: M, y: 1.95, w: CW / 2 - 0.15, h: 2.5, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("LO QUE DICEN ELLOS", { x: M + 0.3, y: 2.18, w: 4.5, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Estonia y Guardtime llaman «blockchain» a KSI, y sostienen que lo hacían desde antes de que se publicara el whitepaper de Bitcoin.", { x: M + 0.3, y: 2.6, w: CW / 2 - 0.75, h: 1.6, size: 13.5 });

    caja(s, { x: M + CW / 2 + 0.15, y: 1.95, w: CW / 2 - 0.15, h: 2.5, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("LO QUE DICEN LOS INDEPENDIENTES", { x: M + CW / 2 + 0.45, y: 2.18, w: 5.2, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.violetaOs, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Que KSI es sellado de tiempo por encadenamiento de hashes — una técnica de 1991 — y que llamarlo cadena de bloques es una decisión de mercadeo, no una descripción técnica.", { x: M + CW / 2 + 0.45, y: 2.6, w: CW / 2 - 0.75, h: 1.6, size: 13.5 });

    flecha(s, M + CW / 2, 4.6, M + CW / 2, 5.1, C.tinta, 2);

    const r = await ficha(s, { tipo: "alerta", etiqueta: "Y aquí está lo interesante", x: M, y: 5.2, w: CW, h: 1.45 });
    parrafo(s, "El propio documento oficial estonio reconoce que, cuando empezaron, ellos mismos llamaban a esta tecnología «hash-linked time-stamping» — sellado de tiempo por encadenamiento de hashes. La fuente oficial contiene el argumento de sus críticos.", { x: r.x, y: r.y - 0.06, w: r.w, h: 0.75, size: 13.5 });
    s.addNotes("Este es el gancho de la sesión. Leerlo despacio. No adelantar el hallazgo de T1: eso lo encuentran ellos.");
  }

  /* ---------- A.5 · la raíz de confianza ---------- */
  {
    const s = await lamina({ kicker: "A.5 · el detalle técnico que decide", titulo: "¿Dónde está la raíz de confianza?", ic: "periodico", tituloSize: 29 });
    parrafo(s, "Toda cadena necesita un ancla: algo que haga costoso reescribir la historia. Comparen dónde está el ancla en cada sistema.", { y: 1.9, h: 0.55, size: 14.5 });

    nodo(s, { x: M, y: 2.6, w: CW / 2 - 0.2, h: 0.6, titulo: "EN BITCOIN", fill: C.tinta, line: C.tinta });
    s.addText("EN BITCOIN", { x: M, y: 2.6, w: CW / 2 - 0.2, h: 0.6, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.naranja, align: "center", valign: "middle", margin: 0 });
    caja(s, { x: M, y: 3.3, w: CW / 2 - 0.2, h: 1.5, fill: C.superf, sombra: false });
    parrafo(s, "Una competencia de trabajo computacional entre nodos anónimos. Reescribir la historia cuesta energía real, y cualquiera puede comprobarlo sin pedir permiso.", { x: M + 0.28, y: 3.5, w: CW / 2 - 0.76, h: 1.2, size: 13 });

    s.addShape(pres.ShapeType.rect, { x: M + CW / 2 + 0.2, y: 2.6, w: CW / 2 - 0.2, h: 0.6, fill: { color: C.naranja }, line: { width: 0 } });
    s.addText("EN KSI", { x: M + CW / 2 + 0.2, y: 2.6, w: CW / 2 - 0.2, h: 0.6, fontFace: F.mono, fontSize: 11.5, bold: true, color: C.tinta, align: "center", valign: "middle", margin: 0 });
    caja(s, { x: M + CW / 2 + 0.2, y: 3.3, w: CW / 2 - 0.2, h: 1.5, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    parrafo(s, "La publicación periódica del hash en periódicos de circulación mundial. El ancla es un acto editorial, no un mecanismo de consenso.", { x: M + CW / 2 + 0.48, y: 3.5, w: CW / 2 - 0.76, h: 1.2, size: 13 });

    const r = await ficha(s, { tipo: "profundidad", etiqueta: "Quién lo dice", x: M, y: 5.0, w: CW, h: 1.6 });
    parrafo(s, "Eso no lo afirma un crítico: está en un artículo técnico firmado por tres ingenieros de Guardtime y publicado en un congreso arbitrado. Es la fuente F4 que les entrego. Y no es una acusación — puede ser una decisión de diseño perfectamente razonable. Pero es una raíz de confianza distinta, y hay que llamarla por su nombre.", { x: r.x, y: r.y - 0.06, w: r.w, h: 0.9, size: 12.5 });
    s.addNotes("Si alguien pregunta si publicar en periódico es serio: sí, lo es. Es una forma clásica y sólida de anclaje público. El punto no es que sea malo, es que es OTRA COSA.");
  }

  /* ---------- A.6 · por qué importa ---------- */
  {
    const s = await lamina({ kicker: "A.6 · por qué no es pedantería", titulo: "La reputación que se pide prestada", ic: "termino", tituloSize: 28 });
    parrafo(s, "Podría parecer una discusión de palabras. No lo es, y la razón importa más que el caso.", { y: 1.9, h: 0.45, size: 14.5 });

    enunciado(s, "Cuando alguien dice «esto es seguro porque está en blockchain», está pidiendo prestada una reputación.", { y: 2.5, h: 1.2, size: 21 });

    parrafo(s, "Esa reputación viene de propiedades muy concretas. Un sistema puede tener integridad criptográfica impecable y no tener ninguna de ellas:", { y: 3.9, h: 0.5, size: 13.5 });

    lista(s, [
      "Que cualquiera pueda participar sin pedir permiso.",
      "Que nadie pueda censurar una operación.",
      "Que no exista una entidad capaz de apagar el sistema.",
      "Que reescribir la historia cueste energía real.",
    ], { y: 4.5, h: 1.5, size: 13.5, gap: 5 });

    const r = await ficha(s, { tipo: "alerta", etiqueta: "El punto que quiero que se lleven", x: M, y: 5.95, w: CW, h: 0.9 });
    parrafo(s, "Si el sistema depende de que una empresa siga existiendo, la confianza no se eliminó: se movió de sitio.", { x: r.x, y: r.y - 0.14, w: r.w, h: 0.4, size: 13.5 });
    s.addNotes("Enlazar con el árbol de decisión de la sesión 1: la pregunta no es «¿es blockchain?» sino «¿qué propiedad necesito y este sistema la tiene?».");
  }

  /* =================== DIVISOR B =================== */
  await divisor({ letra: "B", titulo: "El encargo", sub: "Seis tareas. Tres de ellas no se pueden resolver sin abrir documentos y mirar.", minutos: "APROXIMADAMENTE 18 MINUTOS", ic: "lista" });

  /* ---------- B.1 · la pregunta ---------- */
  {
    const s = await lamina({ kicker: "B.1 · lo que hay que responder", titulo: "La pregunta", ic: "pregunta", tituloSize: 31 });

    caja(s, { x: M, y: 1.95, w: CW, h: 1.5, fill: C.blanco, line: C.naranja, sombraColor: C.naranja, lw: 2.75 });
    s.addText("¿El sistema KSI que protege los registros públicos de Estonia es una cadena de bloques?", {
      x: M + 0.42, y: 2.15, w: CW - 0.84, h: 1.1, fontFace: F.display, fontSize: 23, color: C.tinta, lineSpacingMultiple: 1.05, margin: 0, valign: "middle",
    });

    parrafo(s, "Sí, no, o depende de la definición. Pero si eligen la tercera, quedan obligados a dar la definición y mostrar qué cambia con ella. «Depende» sin definición no es un veredicto: es una forma elegante de no responder.", { y: 3.65, h: 0.75, size: 14 });

    parrafo(s, "Un veredicto defendible necesita tres cosas, y las tres se evalúan:", { y: 4.5, h: 0.4, size: 14 });

    const tres = [
      ["01", "UNA DEFINICIÓN OPERATIVA", "Propiedades que se puedan verificar presentes o ausentes en un sistema concreto."],
      ["02", "LA EVIDENCIA, CITADA", "Qué propiedades tiene KSI y cuáles no, con la fuente de cada una."],
      ["03", "EL LÍMITE", "Qué NO permite concluir la evidencia que reunieron."],
    ];
    tres.forEach((t, i) => {
      const y = 5.05 + i * 0.58;
      s.addText(t[0], { x: M, y, w: 0.5, h: 0.5, fontFace: F.display, fontSize: 16, color: C.naranja, margin: 0, valign: "middle" });
      s.addText(t[1], { x: M + 0.6, y, w: 4.1, h: 0.5, fontFace: F.mono, fontSize: 10, bold: true, color: C.tinta, charSpacing: 1.1, margin: 0, valign: "middle" });
      parrafo(s, t[2], { x: M + 4.9, y: y + 0.09, w: CW - 4.9, h: 0.42, size: 12.5 });
    });
    s.addNotes("El tercero es el que separa un trabajo bueno de uno excelente. Vale 15 % solo.");
  }

  /* ---------- B.2 · las seis tareas ---------- */
  {
    const s = await lamina({ kicker: "B.2 · el encargo completo", titulo: "Seis tareas, todas obligatorias", ic: "rejilla", tituloSize: 29 });
    parrafo(s, "Las tres primeras están marcadas NO-IA: exigen abrir un archivo o una herramienta y mirar. Si las responden sin hacerlo, se nota — las respuestas inventadas no coinciden con lo que hay.", { y: 1.9, h: 0.6, size: 14 });

    tabla(s, ["", "tarea", "qué exige"], [
      ["T1", "Verificación documental", "Auditar una afirmación del documento oficial dentro del whitepaper de Bitcoin."],
      ["T2", "Arqueología web", "Recuperar en la Wayback Machine dos versiones de la misma página, separadas por años."],
      ["T3", "Careo de fuentes", "Enfrentar dos citas literales que se contradicen, con su ubicación exacta."],
      ["T4", "Investigación propia", "Conseguir y clasificar tres fuentes nuevas, además de las cinco que entrego."],
      ["T5", "El veredicto", "Definición operativa, tabla de propiedades con fuentes, y el párrafo del límite."],
      ["T6", "Proyección", "Qué tendría que cambiar, y dónde sí sería decisiva la diferencia."],
    ], { y: 2.65, h: 4.0, colW: [0.85, 3.3, 7.943], size: 11.5 });
    s.addNotes("Repartir el PDF aquí. Cada equipo lo necesita abierto para el resto de la explicación.");
  }

  /* ---------- B.3 · T1 ---------- */
  {
    const s = await lamina({ kicker: "B.3 · tarea 1 · no-IA", titulo: "Auditen la afirmación oficial", ic: "documento", tituloSize: 29 });

    caja(s, { x: M, y: 1.9, w: CW, h: 1.25, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("LA AFIRMACIÓN A AUDITAR", { x: M + 0.32, y: 2.08, w: 6, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "El documento oficial de e-Estonia afirma que el whitepaper de Bitcoin fue el que «acuñó el término blockchain».", { x: M + 0.32, y: 2.45, w: CW - 0.64, h: 0.6, size: 14.5 });

    parrafo(s, "Ustedes ya tienen ese whitepaper. Son nueve páginas y lo leyeron en la Sesión 1. Ábranlo y búsquenlo.", { y: 3.32, h: 0.45, size: 14 });

    const buscar = [
      ["blockchain", "¿Cuántas veces aparece?"],
      ["block chain", "¿Y separado en dos palabras?"],
      ["¿ ?", "¿Qué expresiones usa Nakamoto en su lugar?"],
      ["[ n ]", "¿Qué referencias corresponden a Haber y Stornetta, y de qué años?"],
    ];
    buscar.forEach((b, i) => {
      const y = 3.9 + i * 0.62;
      s.addShape(pres.ShapeType.rect, { x: M, y, w: 2.5, h: 0.5, fill: { color: C.superfAlt }, line: { color: C.violeta, width: 1 } });
      s.addText(b[0], { x: M, y, w: 2.5, h: 0.5, fontFace: F.mono, fontSize: 12, bold: true, color: C.violetaOs, align: "center", valign: "middle", margin: 0 });
      parrafo(s, b[1], { x: M + 2.8, y: y + 0.08, w: CW - 2.8, h: 0.42, size: 13 });
    });

    parrafo(s, "Entregan los conteos exactos, la captura de la búsqueda, las referencias con sus años — y un párrafo sobre qué se sigue de esto, y qué NO se sigue.", { y: 6.42, h: 0.45, size: 12.5, color: C.ocre });
    s.addNotes("NO hacer esta búsqueda en vivo. El hallazgo es de ellos. Si alguien lo grita en clase, pedirle que se lo guarde.");
  }

  /* ---------- B.4 · T2 ---------- */
  {
    const s = await lamina({ kicker: "B.4 · tarea 2 · no-IA", titulo: "Vean cómo cambió el discurso", ic: "archivo", tituloSize: 29 });
    parrafo(s, "Las páginas web cambian de redacción con los años, y casi nadie lo nota. La Wayback Machine guarda las versiones antiguas.", { y: 1.9, h: 0.55, size: 14.5 });

    definicion(s, "WAYBACK MACHINE · web.archive.org — el servicio de paginas archivadas de la fundacion Internet Archive", { x: M, y: 2.6, w: CW, h: 0.62 });

    parrafo(s, "Peguen ahí la dirección de las páginas de e-Estonia sobre KSI o blockchain y recuperen capturas de al menos dos momentos distintos, separados por varios años.", { y: 3.4, h: 0.55, size: 14 });

    nodo(s, { x: M, y: 4.05, w: 3.5, h: 0.95, titulo: "~ 2016 / 2017", sub: "la frase de entonces", fill: C.superf });
    flecha(s, M + 3.7, 4.52, M + 5.0, 4.52, C.naranja, 2.5);
    nodo(s, { x: M + 5.2, y: 4.05, w: 3.5, h: 0.95, titulo: "HOY", sub: "la frase de ahora", fill: C.blanco, line: C.naranja });
    s.addText("¿QUÉ CAMBIÓ?", { x: M + 9.0, y: 4.05, w: 3.0, h: 0.95, fontFace: F.display, fontSize: 15, color: C.naranja, align: "center", valign: "middle", margin: 0 });

    const r = await ficha(s, { tipo: "pregunta", etiqueta: "Dónde mirar con lupa", x: M, y: 5.25, w: CW, h: 1.4 });
    parrafo(s, "En los adjetivos que acompañan a la palabra «blockchain», y en las fechas que se citan como origen del proyecto. Entregan las dos capturas con su fecha y enlace permanente, la frase literal de cada una, y una interpretación de por qué pudo cambiar.", { x: r.x, y: r.y - 0.06, w: r.w, h: 0.75, size: 13 });
    s.addNotes("Aquí SÍ conviene demostrar la herramienta en vivo, pero con otro sitio cualquiera (la página de la universidad, por ejemplo). Enseña el método sin revelar el hallazgo.");
  }

  /* ---------- B.5 · T3 ---------- */
  {
    const s = await lamina({ kicker: "B.5 · tarea 3 · no-IA", titulo: "Pongan a dos fuentes a contradecirse", ic: "balanza", tituloSize: 27 });
    parrafo(s, "Encuentren una afirmación concreta de una fuente oficial y la frase de una fuente independiente que la contradice o la matiza. Las dos, literales.", { y: 1.9, h: 0.6, size: 14.5 });

    caja(s, { x: M, y: 2.6, w: CW / 2 - 0.35, h: 2.0, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("FUENTE OFICIAL", { x: M + 0.3, y: 2.8, w: 4, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Cita literal + dónde está exactamente: página, sección o apartado.", { x: M + 0.3, y: 3.2, w: CW / 2 - 0.95, h: 1.2, size: 13 });

    s.addText("VS", { x: M + CW / 2 - 0.3, y: 3.35, w: 0.6, h: 0.5, fontFace: F.display, fontSize: 20, color: C.tinta, align: "center", valign: "middle", margin: 0 });

    caja(s, { x: M + CW / 2 + 0.35, y: 2.6, w: CW / 2 - 0.35, h: 2.0, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("FUENTE INDEPENDIENTE", { x: M + CW / 2 + 0.65, y: 2.8, w: 4.5, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.violetaOs, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Cita literal + dónde está exactamente: página, sección o apartado.", { x: M + CW / 2 + 0.65, y: 3.2, w: CW / 2 - 0.95, h: 1.2, size: 13 });

    const r = await ficha(s, { tipo: "alerta", etiqueta: "No sirve un resumen del desacuerdo", x: M, y: 4.85, w: CW, h: 1.75 });
    parrafo(s, "Necesito las dos frases textuales, una al lado de la otra, para poder verlas chocar. Y después, a cuál le creen y por qué.\n\nLa fuente F3 —el artículo arbitrado— es la mina para esta tarea: recoge entrevistas de las dos posiciones y las cita textualmente.", { x: r.x, y: r.y - 0.06, w: r.w, h: 1.05, size: 13 });
    s.addNotes("Esta es la tarea que más se parece a lo que hace un ingeniero cuando evalúa una tecnología para un cliente.");
  }

  /* ---------- B.6 · T5 y T6 ---------- */
  {
    const s = await lamina({ kicker: "B.6 · tareas 5 y 6", titulo: "El veredicto y la proyección", ic: "grafico", tituloSize: 29 });
    parrafo(s, "T5 es el núcleo: una tabla con su definición operativa, una fila por propiedad, y para cada una si KSI la tiene, no la tiene o la tiene a medias — con la fuente que lo respalda.", { y: 1.88, h: 0.6, size: 14 });

    tabla(s, ["propiedad a evaluar", "¿la tiene KSI?", "fuente"], [
      ["Encadenamiento criptográfico por hashes", "", ""],
      ["Participación abierta sin permiso previo", "", ""],
      ["Consenso entre partes que no confían entre sí", "", ""],
      ["Ausencia de un operador que pueda detenerlo", "", ""],
      ["Réplica en múltiples nodos independientes", "", ""],
      ["Verificable sin depender del operador", "", ""],
    ], { y: 2.6, h: 2.55, colW: [6.0, 3.0, 3.093], size: 11 });

    parrafo(s, "Pueden añadir o quitar propiedades, justificando. T6 son dos preguntas cortas:", { y: 5.3, h: 0.4, size: 13.5 });
    lista(s, [
      "¿Qué tendría que cambiar —en el sistema, no en el nombre— para que su veredicto se invirtiera?",
      "Nombren un problema de su entorno donde la diferencia SÍ sería decisiva. Enunciado sin nombrar la tecnología.",
    ], { y: 5.8, h: 0.95, size: 13, gap: 4 });
    s.addNotes("La segunda pregunta de T6 es un ensayo del anteproyecto: mismo criterio de pertinencia, mismo filtro de enunciar el problema sin la tecnología.");
  }

  /* ---------- B.7 · las cinco fuentes ---------- */
  {
    const s = await lamina({ kicker: "B.7 · lo que entrego", titulo: "Cinco fuentes verificadas y gratuitas", ic: "libro", tituloSize: 28 });
    parrafo(s, "Escogidas para que se contradigan. Esa mezcla es deliberada: parte del trabajo es notar quién habla desde dónde.", { y: 1.88, h: 0.5, size: 14 });

    tabla(s, ["", "fuente", "qué es", "cómo hay que leerla"], [
      ["F1", "FAQ oficial de e-Estonia", "PDF institucional, 3 páginas", "Parte interesada. Es el objeto de T1."],
      ["F2", "Página KSI Blockchain", "Sitio oficial vigente", "Parte interesada. Punto de partida de T2."],
      ["F3", "Semenzin, Rozas y Hassan (2022)", "Artículo arbitrado, acceso abierto", "Independiente. La más valiosa. Material para T3."],
      ["F4", "Buldas, Kroonmaa y Laanoja (2013)", "Artículo técnico de Guardtime, acceso abierto", "Del proveedor Y arbitrada. La descripción técnica. Sirve para T5."],
      ["F5", "Gerard (2017)", "Blog personal", "Crítico declarado. La menos autorizada, a propósito."],
    ], { y: 2.5, h: 3.35, colW: [0.7, 3.3, 3.4, 4.693], size: 10.5 });

    const r = await ficha(s, { tipo: "profundidad", etiqueta: "Por qué incluyo un blog a propósito", x: M, y: 5.98, w: CW, h: 0.85 });
    parrafo(s, "Para que tengan que evaluarlo. En la exposición les voy a preguntar cómo decidieron cuánto peso darle.", { x: r.x, y: r.y - 0.14, w: r.w, h: 0.4, size: 12.5 });
    s.addNotes("Todas verificadas y accesibles sin registro. Si alguna cae antes de la entrega, avisar por el canal del curso.");
  }

  /* ---------- B.8 · las tres propias ---------- */
  {
    const s = await lamina({ kicker: "B.8 · lo que tienen que conseguir", titulo: "Tres fuentes propias, con reglas", ic: "lupa", tituloSize: 29 });
    parrafo(s, "Encontrar fuentes es una destreza profesional, y no se aprende recibiéndolas.", { y: 1.88, h: 0.42, size: 14 });

    tabla(s, ["regla", "por qué"], [
      ["Máximo UNA de blog u opinión", "Es fácil llenar tres con opiniones. La dificultad está en las otras dos."],
      ["Mínimo UNA arbitrada o institucional", "Artículo con revisión por pares, tesis, norma técnica o informe de organismo público."],
      ["Ninguna puede ser un chatbot", "No es una fuente: no tiene autor responsable ni se puede verificar. Si lo usaron para encontrar algo, citen lo encontrado."],
      ["Todas deben abrirse", "Si el enlace no abre o exige pagar, no cuenta. Verifíquenlo el día que entregan."],
      ["Cada una, clasificada", "Tipo · interés · control de calidad. Sin clasificación, no se cuenta."],
    ], { y: 2.45, h: 3.0, colW: [4.2, 7.893], size: 11 });

    parrafo(s, "Y el formato mínimo de cita, obligatorio para las ocho:", { y: 5.6, h: 0.38, size: 13.5 });
    definicion(s, "Apellido, Inicial. (Año). Título. Editorial o sitio. URL — consultado el DD/MM/AAAA.", { x: M, y: 6.02, w: CW, h: 0.6 });
    s.addNotes("La fecha de consulta no es burocracia: en este caso las páginas cambian de redacción, y T2 se lo va a demostrar en carne propia.");
  }

  /* =================== DIVISOR C =================== */
  await divisor({ letra: "C", titulo: "La entrega", sub: "Un documento y cinco minutos. Con preguntas al final, y con la fuente abierta para responderlas.", minutos: "APROXIMADAMENTE 5 MINUTOS", ic: "bandera" });

  /* ---------- C.1 · la exposición ---------- */
  {
    const s = await lamina({ kicker: "C.1 · la próxima sesión", titulo: "Cinco minutos por equipo", ic: "pantalla", tituloSize: 30 });
    parrafo(s, "Cinco minutos son cortos a propósito: no caben las seis tareas, así que tienen que elegir qué mostrar.", { y: 1.88, h: 0.5, size: 14.5 });

    tabla(s, ["tiempo", "qué va ahí"], [
      ["0:00 – 0:30", "Su veredicto, dicho de entrada. Sin suspenso."],
      ["0:30 – 1:30", "Su definición operativa: qué propiedades exigieron y por qué esas."],
      ["1:30 – 3:30", "LA MEJOR EVIDENCIA QUE ENCONTRARON. Una sola, mostrada en pantalla."],
      ["3:30 – 4:15", "El límite: qué NO pueden concluir."],
      ["4:15 – 5:00", "La proyección: el problema donde la diferencia sí sería decisiva."],
    ], { y: 2.5, h: 2.85, colW: [2.6, 9.493], size: 12 });

    const r = await ficha(s, { tipo: "alerta", etiqueta: "Habrá preguntas", x: M, y: 5.5, w: CW, h: 1.2 });
    parrafo(s, "Cualquiera del curso, o yo, puede preguntarles de dónde salió un dato concreto. Deben poder abrir la fuente en el momento y señalar el lugar exacto. Un equipo que no puede hacerlo no reunió la evidencia: la contó.", { x: r.x, y: r.y - 0.06, w: r.w, h: 0.6, size: 13 });
    s.addNotes("Con equipos de tres y 5 minutos más preguntas, calcular unos 7-8 minutos por equipo en la sesión 5.");
  }

  /* ---------- C.2 · evaluación ---------- */
  {
    const s = await lamina({ kicker: "C.2 · la rúbrica", titulo: "Qué se evalúa", ic: "rombo", tituloSize: 31 });

    tabla(s, ["peso", "criterio", "qué distingue un buen trabajo"], [
      ["30 %", "Evidencia verificable", "T1, T2 y T3 realmente se hicieron. Capturas con fecha, citas localizables, conteos exactos. Se comprueba al azar."],
      ["25 %", "Calidad del veredicto", "Hay definición operativa antes del juicio, y la tabla se llena con fuentes y no con impresiones."],
      ["20 %", "Manejo de fuentes", "Las tres propias cumplen las reglas, están clasificadas y aportan algo nuevo."],
      ["15 %", "Honestidad intelectual", "El párrafo del límite. Reconocer qué no se puede concluir vale más que un veredicto rotundo mal sostenido."],
      ["10 %", "Exposición", "Cinco minutos aprovechados y capacidad de señalar la fuente cuando se pregunta."],
    ], { y: 1.95, h: 4.7, colW: [1.3, 3.2, 7.593], size: 11 });
    s.addNotes("Decir en voz alta que el 30 % se comprueba al azar. Esa frase hace la mitad del trabajo de disuasión.");
  }

  /* ---------- C.3 · la IA ---------- */
  {
    const s = await lamina({ kicker: "C.3 · reglas del juego", titulo: "Sobre el uso de asistentes de IA", ic: "alerta", tituloSize: 28 });

    caja(s, { x: M, y: 1.95, w: CW / 2 - 0.15, h: 2.2, fill: C.blanco, line: C.violeta, sombraColor: C.violeta });
    s.addText("SE PERMITE · Y SE DECLARA", { x: M + 0.3, y: 2.16, w: 5, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.violetaOs, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Incluyan al final una nota corta diciendo para qué lo usaron: traducir, ordenar el texto, sugerir dónde buscar.\n\nEso no resta nada.", { x: M + 0.3, y: 2.58, w: CW / 2 - 0.75, h: 1.4, size: 13 });

    caja(s, { x: M + CW / 2 + 0.15, y: 1.95, w: CW / 2 - 0.15, h: 2.2, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("LO QUE SÍ RESTA, Y MUCHO", { x: M + CW / 2 + 0.45, y: 2.16, w: 5, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Presentar como verificado algo que no se abrió. T1, T2 y T3 se comprueban.\n\nSe pierde el 30 % completo.", { x: M + CW / 2 + 0.45, y: 2.58, w: CW / 2 - 0.75, h: 1.4, size: 13 });

    parrafo(s, "Un modelo de lenguaje que no tiene el documento delante produce conteos plausibles y falsos, citas que no existen y fechas de captura inventadas.", { y: 4.35, h: 0.55, size: 14 });

    enunciado(s, "Si eso aparece en la entrega, habrán demostrado en carne propia la tesis de la actividad: una afirmación repetida con seguridad no es una afirmación verificada.", { y: 5.05, h: 1.6, size: 18 });
    s.addNotes("Prohibirlo sería inaplicable y además falso: la herramienta se va a usar. Lo que se evalúa es si fueron a la fuente.");
  }

  /* ---------- C.4 · la advertencia ---------- */
  {
    const s = await lamina({ kicker: "C.4 · una advertencia, en serio", titulo: "Precisión, no escándalo", ic: "escudo", tituloSize: 31 });
    parrafo(s, "Es muy probable que encuentren imprecisiones en el material oficial. Vale la pena decir con claridad qué significa eso y qué no.", { y: 1.9, h: 0.55, size: 14.5 });

    caja(s, { x: M, y: 2.6, w: CW, h: 1.35, fill: C.blanco, line: C.naranja, sombraColor: C.naranja });
    s.addText("LO QUE NO SE SIGUE", { x: M + 0.32, y: 2.8, w: 6, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.ocre, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Que Estonia sea un fraude. Que KSI sea una mala tecnología. Que el sistema no funcione.", { x: M + 0.32, y: 3.2, w: CW - 0.64, h: 0.6, size: 14.5 });

    caja(s, { x: M, y: 4.15, w: CW, h: 1.5, fill: C.superf, sombra: false });
    s.addText("LO QUE SÍ SE SIGUE", { x: M + 0.32, y: 4.35, w: 6, h: 0.32, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.gris, charSpacing: 1.3, margin: 0, valign: "middle" });
    parrafo(s, "Que un sistema de integridad por encadenamiento de hashes puede ser sólido, útil y estar bien diseñado — y aun así no ser una cadena de bloques en el sentido que este curso le da al término.", { x: M + 0.32, y: 4.75, w: CW - 0.64, h: 0.8, size: 14 });

    parrafo(s, "El equipo que confunda «el folleto exagera» con «la tecnología no sirve» va a perder puntos en honestidad intelectual.", { y: 5.9, h: 0.5, size: 13.5, color: C.ocre });
    s.addNotes("Este es el aprendizaje que sobrevive al curso. La tentación del escándalo es fuerte y hay que desactivarla antes de que empiecen.");
  }

  /* ---------- CIERRE ---------- */
  {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.16, fill: { color: C.naranja }, line: { width: 0 } });
    s.addImage({ data: await icono("lupa", C.naranja), x: M, y: 1.5, w: 0.5, h: 0.5 });
    s.addText("LO QUE SE LLEVAN DE HOY", {
      x: M, y: 2.2, w: CW, h: 0.5, fontFace: F.mono, fontSize: 11.5, color: C.naranja, charSpacing: 1.8, margin: 0, valign: "middle",
    });
    s.addText("Una afirmación repetida\nno es una afirmación verificada.", {
      x: M, y: 2.75, w: CW, h: 1.9, fontFace: F.display, fontSize: 40, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 1.0,
    });
    s.addText("Vale para Estonia, vale para el proveedor que les venda algo dentro de cinco años, y vale para su propio anteproyecto.", {
      x: M, y: 4.85, w: CW - 1.5, h: 0.7, fontFace: F.body, fontSize: 15, color: "B9B4C4", margin: 0, valign: "top", lineSpacingMultiple: 1.25,
    });
    s.addShape(pres.ShapeType.rect, { x: M, y: 5.85, w: CW, h: 0.75, fill: { color: "1C1B21" }, line: { color: "343240", width: 1 } });
    s.addText("PRÓXIMA SESIÓN · EXPOSICIÓN DE 5 MINUTOS POR EQUIPO · CON LAS FUENTES ABIERTAS", {
      x: M + 0.3, y: 5.85, w: CW - 0.6, h: 0.75, fontFace: F.mono, fontSize: 11.5, color: C.naranja, charSpacing: 1.4, margin: 0, valign: "middle",
    });
    nSlide++;
  }

  const salida = require("path").join(__dirname, "Actividad-04-El-caso-Estonia-DECK.pptx");
  await pres.writeFile({ fileName: salida });
  console.log(`OK · ${nSlide} laminas · ${salida}`);
}

construir().catch(e => { console.error(e); process.exit(1); });
