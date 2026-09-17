/* =====================================================================
   Blockchain y Web 3.0 — Universidad de San Buenaventura Medellín
   SISTEMA DE DISEÑO COMPARTIDO PARA LOS DECKS

   Brutalismo digital sobre la paleta institucional de usbmed.edu.co.
   Es la misma identidad de build-sesion-01.js, extraída a un módulo para
   que las sesiones 4 a 17 no repitan 300 líneas cada una.

   Además de las primitivas, trae un ESTIMADOR DE AJUSTE: cada texto se
   mide contra la caja que lo contiene y, si no cabe, se registra un aviso
   con el número de lámina. Al guardar se imprime el resumen.

       const D = crearDeck({ pie: "SESIÓN 05 · ETHEREUM Y LA EVM", titulo: "..." });
       const s = await D.lamina({ kicker, titulo, ic });
       D.parrafo(s, "texto", { y: 1.9, h: 0.6 });
       await D.guardar(ruta);
   ===================================================================== */

const pptxgen = require("pptxgenjs");
const sharp = require("sharp");

/* ---------------------------------------------------------------- tokens */

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
  verde:     "1F7A4D",
  rojo:      "B3261E",
  codigoFondo: "16151B",
  codigoTexto: "F4F2F7",
  codigoComentario: "8B8697",
  codigoCadena: "FFA41B",
  codigoTipo: "A897FF",
};

const F = { display: "Arial Black", body: "Arial", mono: "Courier New" };

const W = 13.333, H = 7.5;
const M = 0.62;
const CW = W - 2 * M;       // 12.093
const Y_PIE = 6.88;          // el contenido debe terminar antes de esta línea

const sombra = (color = C.tinta) => ({
  type: "outer", angle: 45, blur: 0, offset: 5, color, opacity: 1,
});

/* ------------------------------------------------------------ iconografía */

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
  lupa:        "M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l5 5",
  balanza:     "M12 3v18M6 21h12M12 6 4 9l3 5 3-5zM12 6l8 3-3 5-3-5z",
  mundo:       "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18",
  codigo:      "M8 7 3 12l5 5M16 7l5 5-5 5M14 4l-4 16",
  terminal:    "M3 4h18v16H3zM7 9l3 3-3 3M12 15h5",
  engranaje:   "M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1",
  gas:         "M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16M3 21h14M8 7h4M15 10l3 2v6a1.5 1.5 0 003 0v-8l-3-3",
  moneda:      "M12 3a9 9 0 100 18 9 9 0 000-18zM9 9.5a3 2.5 0 016 0c0 3-6 2-6 5a3 2.5 0 006 0M12 5.5v13",
  imagen:      "M3 4h18v16H3zM3 16l5-5 4 4 3-3 6 6M15 8.5a1.5 1.5 0 100 .01",
  red:         "M12 3v6M12 15v6M5 7l5 3M14 14l5 3M5 17l5-3M14 10l5-3M12 9a3 3 0 100 6 3 3 0 000-6z",
  voto:        "M4 12l5 5L20 6",
  capas:       "M12 3 2 8l10 5 10-5zM2 12l10 5 10-5M2 16l10 5 10-5",
  puente:      "M2 18h20M4 18V10M20 18V10M4 10c4-5 12-5 16 0M9 18v-5M15 18v-5",
  martillo:    "M14 4l6 6-3 3-6-6zM11 7 3 15l3 3 8-8",
  diana:       "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11a1 1 0 100 2 1 1 0 000-2z",
  candado:     "M5 11h14v10H5zM8 11V7a4 4 0 018 0v4M12 15v2",
  bicho:       "M9 7a3 3 0 016 0v1H9zM7 9h10v6a5 5 0 01-10 0zM3 12h4M17 12h4M4 7l3 2M20 7l-3 2M4 19l3-2M20 19l-3-2M12 11v8",
  flecha:      "M4 12h16M14 6l6 6-6 6",
  persona:     "M12 4a4 4 0 100 8 4 4 0 000-8zM4 21v-2a5 5 0 015-5h6a5 5 0 015 5v2",
  cohete:      "M12 2c4 3 6 7 6 12l-3 3H9l-3-3c0-5 2-9 6-12zM12 8a2 2 0 100 4 2 2 0 000-4zM9 17l-2 4M15 17l2 4",
  tijera:      "M6 4a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM6 15a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM8 8l10 9M8 16 18 7",
  arbol:       "M12 3v4M12 7 6 12M12 7l6 5M6 12v3M18 12v3M4 15h4v4H4zM16 15h4v4h-4z",
  corte:       "M3 4h18v4H3zM3 10h18v4H3zM3 16h18v4H3z",
};

const cacheIconos = {};
async function icono(nombre, color) {
  const clave = nombre + "-" + color;
  if (cacheIconos[clave]) return cacheIconos[clave];
  const trazo = ICONOS[nombre];
  if (!trazo) throw new Error(`Icono desconocido: ${nombre}`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="#${color}" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
      <path d="${trazo}"/></svg>`;
  const buf = await sharp(Buffer.from(svg)).resize(320, 320).png().toBuffer();
  cacheIconos[clave] = "image/png;base64," + buf.toString("base64");
  return cacheIconos[clave];
}

/* ------------------------------------------------------ estimador de ajuste

   PowerPoint no avisa cuando un texto desborda su caja: simplemente lo
   dibuja encima de lo que haya debajo. Esto estima cuántas líneas ocupa un
   texto con el ancho medio de carácter de cada familia y lo compara con el
   alto disponible. Es deliberadamente un poco pesimista.                    */

const ANCHO_EM = { "Arial": 0.53, "Arial Black": 0.68, "Courier New": 0.61 };

function lineasDe(texto, anchoPulg, puntos, familia, charSpacing = 0) {
  const em = ANCHO_EM[familia] || 0.55;
  const anchoCar = (puntos * em + charSpacing * 0.75) / 72;         // pulgadas
  const porLinea = Math.max(1, Math.floor(anchoPulg / anchoCar));
  return String(texto).split("\n").reduce((n, parrafo) => {
    if (!parrafo.length) return n + 1;
    // corte por palabras: una palabra larga no se parte
    let lineas = 1, actual = 0;
    for (const palabra of parrafo.split(" ")) {
      const l = palabra.length;
      if (actual === 0) actual = l;
      else if (actual + 1 + l <= porLinea) actual += 1 + l;
      else { lineas++; actual = l; }
      while (actual > porLinea) { lineas++; actual -= porLinea; }
    }
    return n + lineas;
  }, 0);
}

function altoNecesario(texto, anchoPulg, puntos, familia, interlineado = 1.2, charSpacing = 0, extraPts = 0) {
  const lineas = lineasDe(texto, anchoPulg, puntos, familia, charSpacing);
  return (lineas * puntos * 1.2 * interlineado + extraPts) / 72;
}

/* =========================================================== fábrica del deck */

function crearDeck({ pie: textoPie, titulo, asunto }) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Universidad de San Buenaventura Medellín";
  pres.title = titulo;
  pres.subject = asunto || titulo;

  let nSlide = 0;
  const avisos = [];

  function avisar(tipo, detalle, texto) {
    avisos.push({ lamina: nSlide, tipo, detalle, texto: String(texto).replace(/\n/g, " ").slice(0, 60) });
  }

  function comprobar(texto, o, puntos, familia, interlineado, charSpacing = 0) {
    if (o.h === undefined || o.w === undefined) return;
    const necesita = altoNecesario(texto, o.w, puntos, familia, interlineado, charSpacing);
    if (necesita > o.h + 0.06) {
      avisar("DESBORDE", `necesita ${necesita.toFixed(2)}" y tiene ${o.h.toFixed(2)}"`, texto);
    }
    if (o.y !== undefined && o.y + Math.min(o.h, necesita) > Y_PIE + 0.02 && !o.permitePie) {
      avisar("INVADE PIE", `termina en ${(o.y + Math.min(o.h, necesita)).toFixed(2)}"`, texto);
    }
  }

  /* ---------------------------------------------------------- primitivas */

  function caja(s, o) {
    s.addShape(pres.ShapeType.rect, {
      x: o.x, y: o.y, w: o.w, h: o.h,
      fill: { color: o.fill || C.blanco },
      line: { color: o.line || C.tinta, width: o.lw === undefined ? 1.75 : o.lw, dashType: o.dash },
      shadow: o.sombra === false ? undefined : sombra(o.sombraColor || C.tinta),
    });
    if (o.y + o.h > Y_PIE + 0.02 && !o.permitePie) avisar("CAJA INVADE PIE", `termina en ${(o.y + o.h).toFixed(2)}"`, "caja");
  }

  function pie(s, oscuro = false) {
    nSlide++;
    const col = oscuro ? "6E6A7C" : C.gris;
    s.addText(textoPie, {
      x: M, y: Y_PIE, w: 9.2, h: 0.3, fontFace: F.mono, fontSize: 8, color: col,
      charSpacing: 1.2, margin: 0, valign: "middle",
    });
    s.addText("USB MEDELLÍN", {
      x: 9.9, y: Y_PIE, w: 2.0, h: 0.3, fontFace: F.mono, fontSize: 8, color: col,
      charSpacing: 1.2, align: "right", margin: 0, valign: "middle",
    });
    s.addText(String(nSlide).padStart(2, "0"), {
      x: 12.05, y: Y_PIE, w: 0.66, h: 0.3, fontFace: F.mono, fontSize: 9, bold: true,
      color: oscuro ? C.naranja : C.tinta, align: "right", margin: 0, valign: "middle",
    });
  }

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
    const lineasTitulo = lineasDe(titulo.toUpperCase(), CW, tituloSize, F.display);
    if (lineasTitulo > 1) avisar("TÍTULO EN 2 LÍNEAS", `${lineasTitulo} líneas a ${tituloSize}pt`, titulo);
    return s;
  }

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
    comprobar(titulo.toUpperCase(), { w: 8.7, h: 1.45 }, 34, F.display, 0.98);
    comprobar(sub, { w: 8.4, h: 1.15 }, 14, F.body, 1.25);
    return s;
  }

  function parrafo(s, texto, o = {}) {
    const op = {
      x: o.x || M, y: o.y, w: o.w || CW, h: o.h || 1.0,
      fontFace: o.face || F.body, fontSize: o.size || 14.5, color: o.color || C.tintaSuav,
      lineSpacingMultiple: o.ls || 1.24, margin: 0, valign: o.valign || "top", align: o.align,
      bold: o.bold, italic: o.italic,
    };
    s.addText(texto, op);
    comprobar(texto, { ...op, permitePie: o.permitePie }, op.fontSize, op.fontFace, op.lineSpacingMultiple);
  }

  function etiqueta(s, texto, o) {
    const op = {
      x: o.x, y: o.y, w: o.w, h: o.h || 0.32, fontFace: F.mono, fontSize: o.size || 10.5, bold: true,
      color: o.color || C.ocre, charSpacing: o.cs === undefined ? 1.3 : o.cs, margin: 0, valign: "middle", align: o.align,
    };
    s.addText(String(texto).toUpperCase(), op);
    comprobar(String(texto).toUpperCase(), op, op.fontSize, F.mono, 1.0, op.charSpacing);
  }

  function lista(s, items, o = {}) {
    const size = o.size || 14;
    const arr = items.map((t, i) => {
      const obj = (typeof t === "string") ? { text: t } : t;
      return {
        text: obj.text,
        options: {
          bullet: o.numerada ? { type: "number" } : { code: "25A0", indent: 16 },
          breakLine: i < items.length - 1,
          bold: obj.bold,
          color: obj.color || o.color || C.tintaSuav,
          paraSpaceAfter: o.gap === undefined ? 9 : o.gap,
        },
      };
    });
    const op = {
      x: o.x || M, y: o.y, w: o.w || CW, h: o.h || 3.5,
      fontFace: F.body, fontSize: size, color: C.tintaSuav,
      lineSpacingMultiple: 1.18, margin: 0, valign: "top",
    };
    s.addText(arr, op);
    const gap = (o.gap === undefined ? 9 : o.gap) / 72;
    const textos = items.map(t => (typeof t === "string" ? t : t.text));
    const necesita = textos.reduce((acc, t) => acc + altoNecesario(t, op.w - 0.25, size, F.body, 1.18) + gap, 0);
    if (necesita > op.h + 0.08) avisar("DESBORDE LISTA", `necesita ${necesita.toFixed(2)}" y tiene ${op.h.toFixed(2)}"`, textos[0]);
    if (op.y + Math.min(op.h, necesita) > Y_PIE + 0.02) avisar("LISTA INVADE PIE", `termina en ${(op.y + Math.min(op.h, necesita)).toFixed(2)}"`, textos[0]);
  }

  async function ficha(s, o) {
    const paleta = {
      termino:     { linea: C.violeta, etiqueta: C.violetaOs, ic: "termino",     fill: C.blanco },
      alerta:      { linea: C.naranja, etiqueta: C.ocre,      ic: "alerta",      fill: C.blanco },
      profundidad: { linea: C.tinta,   etiqueta: C.gris,      ic: "profundidad", fill: C.superfAlt },
      pregunta:    { linea: C.tinta,   etiqueta: C.tinta,     ic: "pregunta",    fill: C.blanco, lw: 2.75 },
      seguridad:   { linea: C.rojo,    etiqueta: C.rojo,      ic: "escudo",      fill: C.blanco },
    }[o.tipo];
    caja(s, {
      x: o.x, y: o.y, w: o.w, h: o.h,
      fill: paleta.fill, line: paleta.linea, lw: paleta.lw,
      sombraColor: o.tipo === "termino" ? C.violeta : (o.tipo === "alerta" ? C.naranja : (o.tipo === "seguridad" ? C.rojo : C.tinta)),
      sombra: o.tipo !== "profundidad",
    });
    s.addImage({ data: await icono(paleta.ic, paleta.etiqueta), x: o.x + 0.26, y: o.y + 0.24, w: 0.26, h: 0.26 });
    s.addText(o.etiqueta.toUpperCase(), {
      x: o.x + 0.62, y: o.y + 0.21, w: o.w - 0.9, h: 0.32, fontFace: F.mono, fontSize: 9.5,
      bold: true, color: paleta.etiqueta, charSpacing: 1.5, margin: 0, valign: "middle",
    });
    const cuerpo = { x: o.x + 0.26, y: o.y + 0.56, w: o.w - 0.52, h: o.h - 0.66 };
    if (o.texto) parrafo(s, o.texto, { ...cuerpo, size: o.size || 13 });
    return cuerpo;
  }

  function definicion(s, texto, o) {
    s.addShape(pres.ShapeType.rect, {
      x: o.x, y: o.y, w: o.w, h: o.h,
      fill: { color: C.superfAlt }, line: { color: C.violeta, width: 1 },
    });
    const op = {
      x: o.x + 0.18, y: o.y + 0.08, w: o.w - 0.36, h: o.h - 0.16,
      fontFace: F.mono, fontSize: o.size || 11, color: C.tintaSuav, lineSpacingMultiple: 1.2,
      margin: 0, valign: "middle",
    };
    s.addText(texto, op);
    comprobar(texto, op, op.fontSize, F.mono, 1.2);
  }

  function tabla(s, cabecera, filas, o) {
    const hdrH = 0.34;
    const alto = o.h || 4;
    const bodyH = (alto - hdrH) / filas.length;
    const size = o.size || 11;
    const colW = o.colW;
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
          bold: j === 0 && o.primeraNegrita !== false,
          fontFace: j === 0 && o.primeraMono !== false ? F.mono : F.body,
          fontSize: size,
          valign: "top",
        },
      }))),
    ];
    s.addTable(rows, {
      x: o.x || M, y: o.y, w: o.w || CW, colW,
      border: { type: "solid", color: C.grisClaro, pt: 1 },
      rowH: [hdrH, ...filas.map(() => bodyH)], margin: [6, 8, 6, 8], autoPage: false,
    });
    s.addShape(pres.ShapeType.rect, {
      x: (o.x || M) - 0.02, y: o.y - 0.02, w: (o.w || CW) + 0.04, h: alto + 0.04,
      fill: { type: "none" }, line: { color: C.tinta, width: 1.75 },
    });

    // ¿cabe cada fila? margen interno 6pt arriba + 6pt abajo, 8pt a cada lado
    if (colW) {
      let total = hdrH;
      filas.forEach((f, i) => {
        const necesitaFila = Math.max(...f.map((t, j) => {
          const fam = j === 0 && o.primeraMono !== false ? F.mono : F.body;
          return altoNecesario(t, colW[j] - 16 / 72, size, fam, 1.0, 0, 12);
        }));
        if (necesitaFila > bodyH + 0.04) avisar("FILA DE TABLA CRECE", `fila ${i + 1}: necesita ${necesitaFila.toFixed(2)}" y tiene ${bodyH.toFixed(2)}"`, f[0]);
        total += Math.max(necesitaFila, bodyH);
      });
      if (o.y + total > Y_PIE + 0.02) avisar("TABLA INVADE PIE", `termina en ≈${(o.y + total).toFixed(2)}"`, cabecera.join(" · "));
      const suma = colW.reduce((a, b) => a + b, 0);
      if (Math.abs(suma - (o.w || CW)) > 0.02) avisar("COLUMNAS", `colW suma ${suma.toFixed(3)} y el ancho es ${(o.w || CW).toFixed(3)}`, cabecera.join(" · "));
    }
  }

  function cifra(s, valor, texto, o) {
    caja(s, { x: o.x, y: o.y, w: o.w, h: o.h, fill: o.fill || C.blanco, sombra: o.sombra });
    s.addText(valor, {
      x: o.x + 0.2, y: o.y + 0.18, w: o.w - 0.4, h: o.h * 0.46,
      fontFace: F.display, fontSize: o.size || 36, color: o.color || C.naranja, margin: 0, valign: "middle",
    });
    parrafo(s, texto, { x: o.x + 0.2, y: o.y + o.h * 0.58, w: o.w - 0.4, h: o.h * 0.38, size: o.tsize || 12, ls: 1.15 });
  }

  function enunciado(s, texto, o = {}) {
    const y = o.y || 2.6, h = o.h || 1.9;
    caja(s, { x: o.x || M, y, w: o.w || CW, h, fill: C.blanco, lw: 2.75, line: o.line, sombraColor: o.line });
    const op = {
      x: (o.x || M) + 0.42, y: y + 0.2, w: (o.w || CW) - 0.84, h: h - 0.4,
      fontFace: F.display, fontSize: o.size || 22, color: C.tinta,
      lineSpacingMultiple: 1.06, margin: 0, valign: "middle",
    };
    s.addText(texto, op);
    comprobar(texto, op, op.fontSize, F.display, 1.06);
  }

  function flecha(s, x1, y1, x2, y2, color = C.tinta, ancho = 1.75) {
    s.addShape(pres.ShapeType.line, {
      x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001,
      line: { color, width: ancho, endArrowType: "triangle" },
      flipH: x2 < x1, flipV: y2 < y1,
    });
  }

  function linea(s, x1, y1, x2, y2, color = C.tinta, ancho = 1.75, dash) {
    s.addShape(pres.ShapeType.line, {
      x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001,
      line: { color, width: ancho, dashType: dash },
      flipH: x2 < x1, flipV: y2 < y1,
    });
  }

  function nodo(s, o) {
    caja(s, { x: o.x, y: o.y, w: o.w, h: o.h, fill: o.fill || C.superf, line: o.line || C.tinta, sombra: o.sombra === true });
    s.addText(o.titulo, {
      x: o.x + 0.1, y: o.sub ? o.y + 0.1 : o.y, w: o.w - 0.2, h: o.sub ? 0.32 : o.h, fontFace: F.mono, fontSize: o.size || 11,
      bold: true, color: o.color || C.tinta, charSpacing: 0.8, align: o.align || "center", margin: 0, valign: "middle",
    });
    if (o.sub) {
      const op = {
        x: o.x + 0.1, y: o.y + 0.44, w: o.w - 0.2, h: o.h - 0.52, fontFace: F.body, fontSize: o.subSize || 10.5,
        color: o.subColor || C.gris, align: o.align || "center", margin: 0, valign: "top", lineSpacingMultiple: 1.1,
      };
      s.addText(o.sub, op);
      comprobar(o.sub, op, op.fontSize, F.body, 1.1);
    }
  }

  /* --------------------------------------------------- código con color

     Resaltado léxico sencillo para Solidity, JavaScript y Python. No es un
     analizador: basta para que en proyección se distingan palabras clave,
     tipos, cadenas y comentarios.                                           */

  const CLAVES = {
    sol: /\b(pragma|solidity|contract|interface|library|abstract|is|function|modifier|event|error|emit|revert|require|assert|return|returns|if|else|for|while|do|break|continue|new|delete|public|private|internal|external|view|pure|payable|constant|immutable|override|virtual|memory|storage|calldata|constructor|receive|fallback|struct|enum|mapping|using|import|from|indexed|unchecked|try|catch|anonymous)\b/,
    js: /\b(import|from|export|default|const|let|var|function|async|await|return|if|else|for|of|in|while|new|class|extends|try|catch|throw|describe|it|expect|this|true|false|null|undefined)\b/,
    py: /\b(def|return|if|elif|else|for|in|while|import|from|class|True|False|None|and|or|not|with|as|try|except|raise|lambda|yield|assert|pass)\b/,
  };
  const TIPOS = /\b(uint256|uint8|uint32|uint64|uint96|uint128|uint|int256|int|address|bool|bytes32|bytes4|bytes|string|mapping)\b/;

  function tokenizar(linea, lang) {
    const out = [];
    const coment = lang === "py" ? "#" : "//";
    let resto = linea;
    const idxC = (() => {
      // un comentario que no esté dentro de una cadena
      let enCadena = null;
      for (let i = 0; i < linea.length; i++) {
        const ch = linea[i];
        if (enCadena) { if (ch === enCadena && linea[i - 1] !== "\\") enCadena = null; continue; }
        if (ch === '"' || ch === "'" || ch === "`") { enCadena = ch; continue; }
        if (linea.startsWith(coment, i)) return i;
      }
      return -1;
    })();
    let comentario = "";
    if (idxC >= 0) { comentario = linea.slice(idxC); resto = linea.slice(0, idxC); }

    const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|[A-Za-z_][A-Za-z0-9_]*|\d[\d_]*(?:\.\d+)?|\s+|.)/g;
    let m;
    while ((m = re.exec(resto))) {
      const t = m[0];
      let color = C.codigoTexto;
      if (/^["'`]/.test(t)) color = C.codigoCadena;
      else if (CLAVES[lang] && CLAVES[lang].test(t) && t.match(CLAVES[lang])[0] === t) color = C.naranja;
      else if (lang === "sol" && TIPOS.test(t) && t.match(TIPOS)[0] === t) color = C.codigoTipo;
      else if (/^\d/.test(t)) color = C.codigoCadena;
      out.push({ t, color });
    }
    if (comentario) out.push({ t: comentario, color: C.codigoComentario });
    return out;
  }

  function codigo(s, texto, o) {
    const lang = o.lang || "sol";
    const size = o.size || 11;
    caja(s, { x: o.x, y: o.y, w: o.w, h: o.h, fill: C.codigoFondo, line: C.codigoFondo, sombra: o.sombra === true });
    if (o.titulo) {
      s.addText(o.titulo.toUpperCase(), {
        x: o.x + 0.22, y: o.y + 0.08, w: o.w - 0.44, h: 0.3, fontFace: F.mono, fontSize: 8.5, bold: true,
        color: C.codigoComentario, charSpacing: 1.4, margin: 0, valign: "middle",
      });
    }
    const top = o.titulo ? 0.42 : 0.16;
    const lineas = texto.replace(/\s+$/, "").split("\n");
    const runs = [];
    lineas.forEach((ln, i) => {
      const toks = tokenizar(ln, lang);
      if (!toks.length) toks.push({ t: " ", color: C.codigoTexto });
      toks.forEach((tk, j) => {
        runs.push({ text: tk.t, options: { color: tk.color, breakLine: j === toks.length - 1 && i < lineas.length - 1 } });
      });
    });
    const op = {
      x: o.x + 0.22, y: o.y + top, w: o.w - 0.44, h: o.h - top - 0.12,
      fontFace: F.mono, fontSize: size, lineSpacingMultiple: o.ls || 1.12, margin: 0, valign: "top",
    };
    s.addText(runs, op);
    // el código no se parte por palabras: medir por longitud de la línea más larga
    const anchoCar = size * ANCHO_EM[F.mono] / 72;
    const largo = Math.max(...lineas.map(l => l.length));
    if (largo * anchoCar > op.w + 0.05) avisar("CÓDIGO ANCHO", `línea de ${largo} car. no cabe en ${op.w.toFixed(2)}"`, lineas.find(l => l.length === largo));
    const altoCod = lineas.length * size * 1.2 * op.lineSpacingMultiple / 72;
    if (altoCod > op.h + 0.06) avisar("CÓDIGO ALTO", `${lineas.length} líneas necesitan ${altoCod.toFixed(2)}" y hay ${op.h.toFixed(2)}"`, lineas[0]);
  }

  /* ------------------------------------------------ láminas compuestas */

  async function portada({ kicker, titulo, sub, palabra, ic, notas }) {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 4.1, h: H, fill: { color: C.naranja }, line: { width: 0 } });
    s.addImage({ data: await icono(ic, C.tinta), x: 1.35, y: 2.55, w: 1.4, h: 1.4 });
    s.addText(palabra, { x: 0.15, y: 4.15, w: 3.8, h: 0.7, fontFace: F.display, fontSize: palabra.length > 9 ? 22 : 27, color: C.tinta, align: "center", valign: "middle", margin: 0 });
    s.addImage({ data: await icono("cadena", C.naranja), x: 4.8, y: 1.22, w: 0.34, h: 0.34 });
    s.addText(kicker, {
      x: 5.26, y: 1.2, w: 7.5, h: 0.38, fontFace: F.mono, fontSize: 10.5, color: C.naranja, charSpacing: 1.5, margin: 0, valign: "middle",
    });
    s.addText(titulo, {
      x: 4.8, y: 1.88, w: 7.95, h: 2.6, fontFace: F.display, fontSize: 38, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 0.98,
    });
    s.addText(sub, {
      x: 4.8, y: 4.62, w: 7.95, h: 0.75, fontFace: F.body, fontSize: 15, color: "B9B4C4", margin: 0, valign: "top", lineSpacingMultiple: 1.2,
    });
    s.addText("Blockchain y Web 3.0 · Ingeniería de Sistemas\nUniversidad de San Buenaventura Medellín", {
      x: 4.8, y: 5.6, w: 7.95, h: 0.8, fontFace: F.body, fontSize: 13, color: "8B8697", margin: 0, valign: "top", lineSpacingMultiple: 1.25,
    });
    nSlide++;
    comprobar(titulo, { w: 7.95, h: 2.6 }, 38, F.display, 0.98);
    comprobar(sub, { w: 7.95, h: 0.75 }, 15, F.body, 1.2);
    if (notas) s.addNotes(notas);
    return s;
  }

  /* Agenda de la sesión: tres bloques A · B · C con tiempos */
  async function agenda({ intro, bloques, notas }) {
    const s = await lamina({ kicker: "Lo de hoy", titulo: "Cómo vamos a usar las tres horas", ic: "reloj", tituloSize: 28 });
    parrafo(s, intro, { y: 1.9, h: 0.62, size: 14.5 });
    const alto = bloques.length > 3 ? 0.86 : 1.12;
    const paso = alto + (bloques.length > 3 ? 0.12 : 0.2);
    const y0 = bloques.length > 3 ? 2.62 : 2.7;
    bloques.forEach((p, i) => {
      const y = y0 + i * paso;
      caja(s, { x: M, y, w: CW, h: alto, fill: i === 0 ? C.blanco : C.superf, sombra: i === 0 });
      s.addShape(pres.ShapeType.rect, { x: M, y, w: 0.85, h: alto, fill: { color: i === 0 ? C.naranja : C.grisClaro }, line: { width: 0 } });
      s.addText(p[0], { x: M, y, w: 0.85, h: alto, fontFace: F.display, fontSize: 28, color: C.tinta, align: "center", valign: "middle", margin: 0 });
      etiqueta(s, p[1], { x: M + 1.1, y: y + 0.14, w: 8.5, color: C.tinta, size: 11 });
      parrafo(s, p[2], { x: M + 1.1, y: y + 0.5, w: 8.6, h: alto - 0.56, size: 12.5 });
      s.addText(p[3], { x: M + CW - 2.1, y, w: 1.85, h: alto, fontFace: F.mono, fontSize: 12, bold: true, color: C.ocre, align: "right", valign: "middle", margin: 0 });
    });
    if (notas) s.addNotes(notas);
    return s;
  }

  /* Objetivo + preguntas guía + resultado de aprendizaje */
  async function objetivo({ objetivo: obj, preguntas, ra, notas }) {
    const s = await lamina({ kicker: "El propósito de la sesión", titulo: "Al salir de aquí", ic: "diana", tituloSize: 30 });
    enunciado(s, obj, { y: 1.9, h: 1.3, size: 19 });
    etiqueta(s, "Las preguntas que la sesión responde", { x: M, y: 3.45, w: 8, color: C.gris });
    preguntas.forEach((p, i) => {
      const y = 3.9 + i * 0.62;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.6, h: 0.5, fontFace: F.display, fontSize: 16, color: C.naranja, margin: 0, valign: "middle" });
      parrafo(s, p, { x: M + 0.72, y: y + 0.07, w: CW - 0.72, h: 0.5, size: 14 });
    });
    if (ra) {
      const yRa = 3.9 + preguntas.length * 0.62 + 0.12;
      definicion(s, ra, { x: M, y: yRa, w: CW, h: 0.5, size: 10.5 });
    }
    if (notas) s.addNotes(notas);
    return s;
  }

  /* Glosario: fichas de sigla → nombre completo → qué es */
  async function glosario({ kicker = "Vocabulario de la sesión", titulo = "Siglas y términos de hoy", items, notas }) {
    const s = await lamina({ kicker, titulo, ic: "termino", tituloSize: 28 });
    const cols = 2;
    const filas = Math.ceil(items.length / cols);
    const altoDisp = Y_PIE - 0.12 - 1.9;
    const gapY = 0.14;
    const h = Math.min(1.25, (altoDisp - gapY * (filas - 1)) / filas);
    const w = (CW - 0.24) / 2;
    items.forEach((it, i) => {
      const x = M + (i % cols) * (w + 0.24);
      const y = 1.9 + Math.floor(i / cols) * (h + gapY);
      caja(s, { x, y, w, h, fill: C.blanco, line: C.violeta, sombra: false, lw: 1.25 });
      s.addShape(pres.ShapeType.rect, { x, y, w: 0.09, h, fill: { color: C.violeta }, line: { width: 0 } });
      etiqueta(s, it[0], { x: x + 0.28, y: y + 0.08, w: 2.3, h: 0.3, color: C.violetaOs, size: 11, cs: 0.6 });
      s.addText(it[1], { x: x + 2.55, y: y + 0.08, w: w - 2.75, h: 0.3, fontFace: F.body, fontSize: 10.5, italic: true, color: C.gris, margin: 0, valign: "middle" });
      comprobar(it[1], { w: w - 2.75, h: 0.3 }, 10.5, F.body, 1.0);
      parrafo(s, it[2], { x: x + 0.28, y: y + 0.42, w: w - 0.45, h: h - 0.5, size: 11, ls: 1.15 });
    });
    if (notas) s.addNotes(notas);
    return s;
  }

  /* Pasos numerados en filas: [etiqueta, texto] */
  function pasos(s, items, o) {
    const y0 = o.y, alto = o.alto || 0.78, gap = o.gap === undefined ? 0.12 : o.gap;
    const anchoEt = o.anchoEt || 3.6;
    items.forEach((it, i) => {
      const y = y0 + i * (alto + gap);
      caja(s, { x: o.x || M, y, w: o.w || CW, h: alto, fill: i % 2 ? C.superf : C.blanco, sombra: false, lw: 1.25, line: C.grisClaro });
      s.addText(String(i + 1).padStart(2, "0"), { x: (o.x || M) + 0.14, y, w: 0.6, h: alto, fontFace: F.display, fontSize: 16, color: C.naranja, margin: 0, valign: "middle" });
      etiqueta(s, it[0], { x: (o.x || M) + 0.78, y: y + (alto - 0.32) / 2, w: anchoEt - 0.3, color: C.tinta, size: 10, cs: 1.0 });
      parrafo(s, it[1], { x: (o.x || M) + 0.78 + anchoEt, y: y + 0.1, w: (o.w || CW) - 0.9 - anchoEt, h: alto - 0.16, size: o.size || 12.5, valign: "middle", ls: 1.15 });
    });
  }

  /* Dos columnas contrapuestas con etiqueta y cuerpo */
  function dosColumnas(s, izq, der, o) {
    const w = (CW - 0.3) / 2;
    [[izq, M, C.naranja, C.ocre], [der, M + w + 0.3, C.violeta, C.violetaOs]].forEach(([c, x, lin, col]) => {
      caja(s, { x, y: o.y, w, h: o.h, fill: C.blanco, line: c.linea || lin, sombraColor: c.linea || lin, sombra: c.sombra !== false });
      etiqueta(s, c.et, { x: x + 0.3, y: o.y + 0.2, w: w - 0.6, color: c.color || col });
      if (c.items) lista(s, c.items, { x: x + 0.3, y: o.y + 0.62, w: w - 0.6, h: o.h - 0.8, size: o.size || 13, gap: 5 });
      else parrafo(s, c.texto, { x: x + 0.3, y: o.y + 0.62, w: w - 0.6, h: o.h - 0.8, size: o.size || 13.5 });
    });
  }

  /* Pregunta de la semana (trabajo autónomo) */
  async function preguntaSemana({ pregunta, trabajo, notas }) {
    const s = await lamina({ kicker: "Trabajo autónomo", titulo: "La pregunta de la semana", ic: "pregunta", tituloSize: 29 });
    enunciado(s, pregunta, { y: 1.9, h: 1.75, size: 20, line: C.naranja });
    etiqueta(s, "Para la próxima sesión", { x: M, y: 3.95, w: 8, color: C.gris });
    lista(s, trabajo, { y: 4.35, h: 2.35, size: 13.5, gap: 6 });
    if (notas) s.addNotes(notas);
    return s;
  }

  async function cierre({ kicker = "Lo que se llevan de hoy", frase, sub, proxima }) {
    const s = pres.addSlide();
    s.background = { color: C.tinta };
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.16, fill: { color: C.naranja }, line: { width: 0 } });
    s.addImage({ data: await icono("cadena", C.naranja), x: M, y: 1.35, w: 0.5, h: 0.5 });
    s.addText(kicker.toUpperCase(), { x: M, y: 2.05, w: CW, h: 0.5, fontFace: F.mono, fontSize: 11.5, color: C.naranja, charSpacing: 1.8, margin: 0, valign: "middle" });
    s.addText(frase, { x: M, y: 2.6, w: CW, h: 2.05, fontFace: F.display, fontSize: 36, color: C.blanco, margin: 0, valign: "top", lineSpacingMultiple: 1.0 });
    s.addText(sub, { x: M, y: 4.75, w: CW - 1.2, h: 0.9, fontFace: F.body, fontSize: 15, color: "B9B4C4", margin: 0, valign: "top", lineSpacingMultiple: 1.25 });
    s.addShape(pres.ShapeType.rect, { x: M, y: 5.85, w: CW, h: 0.75, fill: { color: "1C1B21" }, line: { color: "343240", width: 1 } });
    s.addText(proxima.toUpperCase(), { x: M + 0.3, y: 5.85, w: CW - 0.6, h: 0.75, fontFace: F.mono, fontSize: 11, color: C.naranja, charSpacing: 1.2, margin: 0, valign: "middle" });
    nSlide++;
    comprobar(frase, { w: CW, h: 2.05 }, 36, F.display, 1.0);
    comprobar(sub, { w: CW - 1.2, h: 0.9 }, 15, F.body, 1.25);
    comprobar(proxima.toUpperCase(), { w: CW - 0.6, h: 0.75 }, 11, F.mono, 1.0, 1.2);
    return s;
  }

  async function guardar(ruta) {
    await pres.writeFile({ fileName: ruta });
    const nombre = require("path").basename(ruta);
    if (avisos.length) {
      console.log(`\n⚠  ${nombre}: ${avisos.length} aviso(s) de ajuste`);
      avisos.forEach(a => console.log(`   L${String(a.lamina).padStart(2, "0")} ${a.tipo.padEnd(20)} ${a.detalle.padEnd(38)} «${a.texto}»`));
    }
    console.log(`OK · ${nSlide} láminas · ${nombre}${avisos.length ? "" : " · sin avisos de ajuste"}`);
    return { laminas: nSlide, avisos };
  }

  return {
    pres, C, F, W, H, M, CW, Y_PIE, icono, ICONOS,
    caja, pie, lamina, divisor, parrafo, etiqueta, lista, ficha, definicion, tabla, cifra,
    enunciado, flecha, linea, nodo, codigo, portada, agenda, objetivo, glosario, pasos,
    dosColumnas, preguntaSemana, cierre, guardar,
    get nSlide() { return nSlide; },
  };
}

module.exports = { crearDeck, C, F, W, H, M, CW };
