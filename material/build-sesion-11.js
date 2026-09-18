/* =====================================================================
   Sesión 11 · NFTs, ERC-721/1155 y almacenamiento descentralizado
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 11 · NFT, ERC-721/1155 E IPFS", titulo: "Sesión 11 · NFTs e IPFS" });
  const { C, F, M, CW } = D;

  /* ---------------------------------------------------------- apertura */
  await D.portada({
    kicker: "SESIÓN 11 · UNIDAD III · WEB 3.0",
    titulo: "NFT: LO ÚNICO,\nY DÓNDE VIVE\nDE VERDAD",
    sub: "El contrato guarda quién es dueño de qué. La imagen casi nunca está en la cadena. Entender esa separación es la sesión.",
    palabra: "ÚNICO",
    ic: "imagen",
    notas: "Gancho (2 min): pregunten quién ha «comprado» un NFT o conoce a alguien que lo hizo, y qué creen que compró. Casi siempre la respuesta es «la imagen». Hoy vamos a ver que no: se compra una fila en un contrato que APUNTA a una imagen, y que dónde vive esa imagen decide si el NFT significa algo dentro de diez años.",
  });

  await D.agenda({
    intro: "Tokens no fungibles, el archivo que casi todo el mercado guarda mal, y un caso propio: el diploma de la USB.",
    bloques: [
      ["A", "NFT, METADATA Y ALMACENAMIENTO", "ERC-721 y 1155, tokenURI, IPFS y CID, Arweave, regalías, casos serios y críticas.", "~70 min"],
      ["B", "LABORATORIO 11 · EN PAREJAS", "Diploma NFT: imagen y JSON en IPFS, contrato probado, despliegue y verificación.", "~75 min"],
      ["C", "CASO USB · EL DIPLOMA", "¿ERC-721, 1155 o SBT? Trade-offs y habeas data (Ley 1581 de 2012).", "~25 min"],
    ],
    notas: "180 min: 70 + 75 + 25 = 170, más una pausa de 10 minutos entre A y B. Si el bloque A se alarga, recorten el comentario de A.17 (críticas), nunca el laboratorio: la evidencia de hoy cuenta para el segundo corte. Lo que no se termine del laboratorio se completa en casa con la guía PDF.",
  });

  await D.objetivo({
    objetivo: "Implementar tokens no fungibles con metadata descentralizada y evaluar cuándo un NFT resuelve un problema real.",
    preguntas: [
      "¿Qué distingue un ERC-721 de un ERC-1155, y cuándo usar cada uno?",
      "¿Dónde está «el NFT» y dónde está «el archivo»?",
      "¿Por qué una URL centralizada rompe la promesa de permanencia, y qué la arregla?",
      "Para un diploma: ¿transferible, semi-fungible o atado a la persona?",
    ],
    ra: "RA3 · implementar estándares (ERC-721)  ·  RA6 · integrar almacenamiento descentralizado (IPFS).",
    notas: "Lean las cuatro preguntas en voz alta y díganles que al final de cada bloque hay una lámina de verificación que las retoma. La cuarta pregunta NO tiene una respuesta única: se evalúa el argumento.",
  });

  await D.glosario({
    items: [
      ["NFT", "Non-Fungible Token", "Token único: el número 7 es distinto del 8 y no se cambia uno por otro. Lo contrario de un ERC-20."],
      ["ERC-721", "estándar de NFT (2018)", "Un contrato, muchos tokens únicos, cada uno con su id, su dueño y su tokenURI."],
      ["ERC-1155", "estándar multi-token", "Un contrato con muchos ids; cada id puede tener 1 o miles de copias. Transferencias por lotes."],
      ["tokenURI", "enlace a la metadata", "Función que devuelve DÓNDE está el JSON que describe el token. Es un texto, no el archivo."],
      ["IPFS", "InterPlanetary File System", "Red que pide archivos por su contenido: el enlace es el hash, no una ubicación."],
      ["CID", "Content Identifier", "El identificador de IPFS. Se calcula del contenido: cambia un byte y cambia el CID."],
      ["Pinning", "fijar un archivo", "Compromiso de un nodo de guardar el archivo y servirlo. Sin nadie que lo fije, desaparece."],
      ["SBT", "Soulbound Token · ERC-5192", "Token atado a una cuenta: no se puede transferir. Pensado para credenciales."],
    ],
    notas: "No lean el glosario: díganles que es la lámina para repasar antes del parcial. Adviertan que «CID» y «pinning» son las dos palabras que más se confunden hoy.",
  });

  /* ================================================================ A */
  {
    const s = await D.divisor({ letra: "A", titulo: "NFT, metadata y almacenamiento", sub: "Comprar un NFT casi nunca es comprar una imagen. Es comprar una fila en un contrato que apunta a una imagen. Dónde apunta lo cambia todo.", minutos: "APROXIMADAMENTE 70 MINUTOS", ic: "imagen" });
    s.addNotes("Bloque A: 70 minutos, con tres verificaciones intermedias (A.6, A.14, A.19). Ritmo sugerido: estándares hasta A.6 (20 min), almacenamiento hasta A.14 (25 min), regalías, casos y críticas hasta A.20 (25 min).");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · de dónde venimos", titulo: "Un billete cualquiera, o esta entrada exacta", ic: "rejilla", tituloSize: 26 });
    D.dosColumnas(s,
      { et: "Fungible · ERC-20 (Sesión 10)", texto: "Cada unidad es idéntica e intercambiable. Mi FUSB vale igual que tu FUSB. Solo importa CUÁNTOS tienes. Como el dinero: da igual qué billete de 50 000 te entreguen." },
      { et: "No fungible · ERC-721", texto: "Cada token es único, con identidad propia. Importa CUÁL tienes. Una entrada con asiento asignado, un diploma, un título de propiedad: no se cambian uno por otro." },
      { y: 1.9, h: 2.45, size: 13 });
    D.definicion(s, "ERC-20:  balanceOf(ana) = 30 FUSB      ·      ERC-721:  ownerOf(7) = ana", { x: M, y: 4.6, w: CW, h: 0.62, size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error de concepto típico", x: M, y: 5.42, w: CW, h: 1.28, texto: "«No fungible» no significa «valioso» ni «artístico». Significa solo que cada unidad tiene identidad. Un NFT puede no valer nada y un token fungible puede valer mucho.", size: 12.5 });
    s.addNotes("Pregunta rápida (1 min): ¿un pasaje de avión es fungible? Antes de asignar asiento, casi; después, no. La fungibilidad es una decisión de diseño, no una propiedad del objeto. Conecten con la S10: el ERC-20 pregunta «cuántos»; hoy se pregunta «de quién es el número 7».");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · identidad única, en el estado del contrato", titulo: "Un NFT es una fila en una tabla", ic: "rejilla", tituloSize: 28 });
    D.parrafo(s, "Por dentro, un ERC-721 es poco más que dos diccionarios. Este es el estado real de nuestro DiplomaUSB después de emitir dos diplomas en el laboratorio:", { y: 1.85, h: 0.65, size: 14 });
    D.tabla(s, ["tokenId", "ownerOf(tokenId)", "tokenURI(tokenId)"], [
      ["1", "0x7099…79C8  (Ana)", "ipfs://bafkrei…/1.json"],
      ["2", "0x3C44…93BC  (Beto)", "ipfs://bafkrei…/2.json"],
      ["3", "— revierte: ERC721NonexistentToken(3)", "— revierte"],
    ], { y: 2.65, h: 1.75, colW: [1.6, 4.9, 5.593], size: 12 });
    D.dosColumnas(s,
      { et: "Qué es «tener» el NFT", texto: "Que tu dirección aparezca en la columna ownerOf. Nada más. Transferirlo es cambiar esa celda, con tu firma." },
      { et: "Qué NO está en la tabla", texto: "La imagen, el nombre, la descripción. Solo hay un texto que dice dónde buscarlos: el tokenURI." },
      { y: 4.6, h: 2.1, size: 13 });
    s.addNotes("Los valores de la tabla son los del laboratorio (red local de Hardhat, cuentas #1 y #2). Hagan notar la fila 3: consultar un token que no existe no devuelve «nadie»: revierte. Lo prueba el test «consultar el dueño de un token inexistente revierte».");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · la interfaz ERC-721", titulo: "Las funciones que todo NFT tiene", ic: "codigo", tituloSize: 28 });
    D.codigo(s, `// ERC-721 (EIP-721, 2018) · lo mínimo que exige el estándar
function balanceOf(address dueno) view returns (uint256);
function ownerOf(uint256 tokenId) view returns (address);
function transferFrom(address de, address a, uint256 tokenId);
function safeTransferFrom(address de, address a, uint256 tokenId);
function approve(address operador, uint256 tokenId);
function setApprovalForAll(address operador, bool aprobado);
event Transfer(address indexed de, address indexed a, uint256 indexed tokenId);
// extensión de metadata (la que usan los exploradores)
function tokenURI(uint256 tokenId) view returns (string);`, { x: M, y: 1.85, w: 8.2, h: 3.55, lang: "sol", size: 10.5 });
    D.lista(s, [
      "balanceOf dice CUÁNTOS NFT tienes; ownerOf dice de quién es UNO.",
      "safeTransferFrom comprueba que un contrato receptor sepa recibir NFT.",
      "Emitir (mint) es un Transfer desde la dirección cero.",
    ], { x: M + 8.45, y: 1.85, w: CW - 8.45, h: 3.55, size: 12, gap: 8 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "setApprovalForAll: la firma más peligrosa del ecosistema", x: M, y: 5.6, w: CW, h: 1.12, texto: "Autoriza a un operador a mover TODOS tus NFT de ese contrato. Es lo que piden los sitios de phishing. No se firma lo que no se entiende.", size: 12.5 });
    s.addNotes("OpenZeppelin implementa todo esto: nuestro contrato solo añade emitir(). Insistan en setApprovalForAll: la mayoría de robos de NFT no rompen ningún contrato; el usuario firma una aprobación para todo. Es la regla de seguridad del curso aplicada.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · el otro estándar", titulo: "ERC-1155: muchos tipos en un contrato", ic: "capas", tituloSize: 27 });
    D.parrafo(s, "En ERC-1155 el saldo depende de dos cosas: la cuenta Y el id. Cada id puede tener una sola copia (no fungible) o miles (fungible). Y se pueden mover varios ids en una sola transacción.", { y: 1.85, h: 0.95, size: 14 });
    D.codigo(s, `balanceOf(ana, 1)   // id 1: "Espada legendaria" -> 1 (única)
balanceOf(ana, 2)   // id 2: "Poción"            -> 250 (fungible)
safeBatchTransferFrom(ana, beto, [1, 2], [1, 10], "")
// una transacción: la espada y 10 pociones
uri(2) -> "ipfs://bafy.../{id}.json"   // la app reemplaza {id}`, { x: M, y: 2.95, w: CW, h: 2.15, lang: "js", size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error de concepto típico", x: M, y: 5.3, w: CW, h: 1.4, texto: "«1155 es un 721 mejorado.» No: es otro modelo. Al permitir copias, un id de 1155 no identifica a UNA pieza; si necesitan una pieza con historia propia, 1155 los obliga a usar un id por pieza, y ahí pierde su ventaja.", size: 12.5 });
    s.addNotes("Ejemplo clásico: videojuegos, entradas por categoría (100 entradas «general» = un id con 100 copias), membresías por nivel. La plantilla {id} en uri() es parte del estándar: el cliente la reemplaza por el id en hexadecimal de 64 caracteres.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · cómo elegir", titulo: "ERC-721 frente a ERC-1155", ic: "balanza", tituloSize: 28 });
    D.tabla(s, ["criterio", "ERC-721", "ERC-1155"], [
      ["Unidad", "Un token único por id.", "Un id con N copias (N puede ser 1)."],
      ["Saldo", "ownerOf(id) → una dirección.", "balanceOf(cuenta, id) → una cantidad."],
      ["Transferir varios", "Uno por llamada.", "Por lotes: muchos ids en una transacción."],
      ["Caso típico", "Diploma, obra única, título.", "Ítems de juego, entradas por categoría."],
      ["Soporte en exploradores", "Universal.", "Amplio, algo menor."],
    ], { y: 1.85, h: 3.25, colW: [2.7, 4.6, 4.793], size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La regla práctica", x: M, y: 5.3, w: CW, h: 1.4, texto: "¿Cada ítem tiene historia propia (quién lo tuvo, cuándo)? ERC-721. ¿Hay muchas copias idénticas de pocos tipos, o se mueven inventarios en lote? ERC-1155. Si dudan, empiecen por 721: es el más simple de explicar y de auditar.", size: 12.5 });
    s.addNotes("No den todavía la respuesta para el diploma: es el debate del bloque C. Solo planten la pregunta: ¿un diploma es una pieza con historia propia o una copia de un «tipo» (el programa)?");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · verificación · estándares", titulo: "Antes de seguir: ¿721 o 1155?", ic: "pregunta", tituloSize: 28 });
    D.enunciado(s, "Un festival vende 5 000 entradas generales iguales y 20 entradas VIP numeradas, cada una con su silla. ¿Qué estándar usarían, y cuántos ids habría?", { y: 1.9, h: 1.75, size: 18, line: C.naranja });
    D.lista(s, [
      "Piensen 1 minuto en pareja. Escriban su respuesta antes de verla.",
      "Pista: ¿las entradas generales se distinguen entre sí? ¿Y las VIP?",
    ], { y: 3.9, h: 0.95, size: 13.5, gap: 6 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Respuesta (se revela después de discutir)", x: M, y: 5.0, w: CW, h: 1.7, texto: "Una opción defendible: ERC-1155 con 21 ids — id 0 = «general» con 5 000 copias, e ids 1 a 20 = cada silla VIP con 1 copia. Con ERC-721 serían 5 020 tokens distintos para cosas que no se distinguen. Lo que se evalúa es que justifiquen por la fungibilidad, no el número.", size: 12.5 });
    s.addNotes("Verificación de bloque (3 min). Tapen la ficha de abajo o avancen con clic si la animan. Respuesta alternativa aceptable: dos contratos (un ERC-20 para las generales y un ERC-721 para las VIP) — también es defendible; lo que no es defendible es 5 020 NFT sin argumento.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · tokenURI y el esquema JSON", titulo: "La ficha que leen exploradores y billeteras", ic: "documento", tituloSize: 25 });
    D.codigo(s, `{
  "name": "Diploma de prueba · Laboratorio 11",
  "description": "Credencial de PRUEBA. Sin datos personales.",
  "image": "ipfs://bafybei.../diploma.png",
  "attributes": [
    { "trait_type": "Programa", "value": "Ingeniería de Sistemas" },
    { "trait_type": "Cohorte",  "value": "2026-2" }
  ]
}`, { x: M, y: 1.85, w: 7.55, h: 3.25, lang: "js", titulo: "diploma.json · subido a IPFS", size: 11 });
    D.lista(s, [
      "name, description e image vienen del esquema de EIP-721.",
      "attributes no es del estándar: es una convención que popularizó OpenSea y hoy leen casi todos.",
      "image es OTRO enlace IPFS: la ficha y la imagen son dos archivos.",
    ], { x: M + 7.8, y: 1.85, w: CW - 7.8, h: 3.25, size: 12, gap: 8 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Regla del curso · habeas data", x: M, y: 5.3, w: CW, h: 1.4, texto: "Ni nombre, ni cédula, ni correo en el JSON: en IPFS es público y no se puede borrar. Ley 1581 de 2012. Un diploma real publicaría, a lo sumo, el hash del documento (como en la Sesión 6).", size: 12.5 });
    s.addNotes("El JSON de la lámina es el mismo que usa la guía del laboratorio. Pregunta: ¿quién decide qué campos se muestran? El explorador o la billetera, no la cadena. Por eso «attributes» funciona: es un acuerdo del ecosistema, no del protocolo.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · la distinción clave", titulo: "«El NFT» no es «el archivo»", ic: "imagen", tituloSize: 29 });
    D.nodo(s, { x: M, y: 2.0, w: 3.3, h: 1.35, titulo: "EN LA CADENA", sub: "ownerOf(1) = ana\ntokenURI(1) = ipfs://…json", fill: C.blanco, line: C.naranja, subSize: 11 });
    D.flecha(s, M + 3.3, 2.67, M + 4.4, 2.67, C.tinta, 2);
    D.nodo(s, { x: M + 4.4, y: 2.0, w: 3.3, h: 1.35, titulo: "EN IPFS · EL JSON", sub: "name, description,\n\"image\": ipfs://…png", fill: C.superf, subSize: 11 });
    D.flecha(s, M + 7.7, 2.67, M + 8.8, 2.67, C.tinta, 2);
    D.nodo(s, { x: M + 8.8, y: 2.0, w: CW - 8.8, h: 1.35, titulo: "EN IPFS · LA IMAGEN", sub: "el archivo .png\ndel diploma", fill: C.superf, subSize: 11 });
    D.parrafo(s, "Tres saltos, dos redes. El contrato guarda al dueño y UN texto. Ese texto lleva al JSON; el JSON lleva a la imagen. Un explorador que «muestra el NFT» está haciendo estos tres saltos por ustedes.", { y: 3.65, h: 0.95, size: 14 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Lo que de verdad se compra", x: M, y: 4.8, w: CW, h: 1.9, texto: "Comprar un NFT es quedar en la celda ownerOf. Si la imagen desaparece, siguen siendo dueños de un token que apunta a la nada. Y tener el NFT no da derechos de autor sobre la imagen: eso lo decide una licencia, no el contrato. En el laboratorio van a recorrer los tres saltos a mano con el script leer-diploma.js.", size: 12.5 });
    s.addNotes("Esta es LA lámina de la sesión. Si solo recuerdan una cosa, que sea esta. El script scripts/s11/leer-diploma.js imprime los tres saltos: cadena → JSON → imagen, y dice cuál falla si alguno falla.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · ¿y si la imagen va en la cadena?", titulo: "Medido: guardar bytes cuesta una fortuna", ic: "gas", tituloSize: 26 });
    D.parrafo(s, "Lo medimos en Hardhat con un contrato que solo hace datos = d (almacenamiento permanente en la cadena):", { y: 1.85, h: 0.6, size: 14 });
    D.tabla(s, ["qué se guarda", "gas medido", "comentario"], [
      ["1 KB de bytes", "770 482", "Ya es 15 veces una transferencia de FUSB (51 692)."],
      ["20 KB de bytes", "14 569 502", "Unos 730 000 de gas por KB."],
      ["Imagen de 100 KB", "≈ 73 millones (extrapolado)", "No cabe en un bloque de la red local de Hardhat (60 millones)."],
      ["El tokenURI (66 caracteres)", "173 838 · emitir completo", "Incluye crear el token, el dueño y el enlace."],
    ], { y: 2.55, h: 2.65, colW: [3.0, 3.1, 5.993], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La conclusión de ingeniería", x: M, y: 5.4, w: CW, h: 1.3, texto: "En la cadena va lo que necesita consenso: quién es el dueño y un compromiso con el contenido (el CID). El contenido pesado va afuera. Hay NFT «100 % on-chain» (SVG pequeños generados por código), pero son la excepción.", size: 12.5 });
    s.addNotes("Cifras medidas con Hardhat 3.16 / solc 0.8.28 (optimizador 200) en la preparación del curso: contrato Almacen { bytes datos; guardar(bytes) }. El 100 KB es extrapolación lineal. No conviertan a pesos: el precio del gas y del ETH cambia cada hora; el orden de magnitud es lo que importa. El límite de gas de la red principal también cambia (subió varias veces en 2025): si lo citan, consúltenlo el día de la clase en un explorador.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · el problema de la permanencia", titulo: "Una URL normal rompe la promesa", ic: "alerta", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "tokenURI = https://…", linea: C.rojo, color: C.rojo, texto: "https://miuni.edu/diplomas/1.json\n\nQuien controla ese servidor puede cambiar el archivo mañana sin tocar la cadena. Si el dominio vence o el servidor cae, el NFT apunta a la nada. La cadena es inmutable; el servidor, no." },
      { et: "tokenURI = ipfs://CID", texto: "ipfs://bafkrei…\n\nEl enlace ES el hash del contenido. Si alguien cambia un byte, el CID ya no coincide: cualquiera lo detecta. Nadie puede sustituir el contenido a escondidas, ni siquiera quien lo subió." },
      { y: 1.9, h: 2.8, size: 12.5 });
    D.enunciado(s, "IPFS no hace eterno un archivo. Hace imposible cambiarlo sin que se note. Son dos garantías distintas.", { y: 4.95, h: 1.3, size: 17, line: C.naranja });
    s.addNotes("Error de concepto típico: «está en IPFS, entonces es permanente». Falso: IPFS da integridad (nadie lo altera), no disponibilidad (alguien tiene que guardarlo). La disponibilidad es el pinning de A.13. Pregunten: ¿qué garantía les da un https:// de la universidad? Ninguna de las dos, técnicamente; solo la confianza en la institución.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · cómo funciona IPFS", titulo: "Pedir por contenido, no por ubicación", ic: "red", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "La web · por ubicación", texto: "«Tráeme lo que haya en ese servidor, en esa ruta.» Lo que llega depende de quién controla el servidor hoy." },
      { et: "IPFS · por contenido", texto: "«Tráeme el archivo cuyo hash es este.» Cualquier nodo que lo tenga lo sirve, y el que lo recibe recalcula el hash para comprobarlo." },
      { y: 1.85, h: 1.95, size: 13 });
    D.pasos(s, [
      ["PEDIR", "El navegador o la puerta (gateway) pregunta a la red: ¿quién tiene el CID bafkrei…?"],
      ["ENCONTRAR", "Una tabla distribuida (DHT) responde qué nodos anunciaron tener ese contenido."],
      ["DESCARGAR", "Se baja de cualquiera de ellos: no importa de cuál, porque…"],
      ["VERIFICAR", "…se recalcula el hash. Si no coincide con el CID, se descarta. Confianza cero en el nodo."],
    ], { y: 4.0, alto: 0.62, gap: 0.08, anchoEt: 2.3, size: 12 });
    s.addNotes("La última fila es la Sesión 2 aplicada: el hash como identificador que se autoverifica. Una puerta (gateway) como ipfs.io es un servidor HTTP normal que hace estos pasos por ustedes; cuando usan una puerta, vuelven a confiar en ese servidor, a menos que verifiquen el hash ustedes mismos.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · un CID, calculado de verdad", titulo: "El CID es el hash, con una etiqueta delante", ic: "llave", tituloSize: 25 });
    D.codigo(s, `node scripts/s11/cid-raw.js --texto "hello world"
  sha256  : b94d27b9934d3e08a52e52d7da7dabfac484efe3...
  CID raw : bafkreifzjut3te2nhyekklss27nh3k72ysco7y32koao5eei66wof36n5e

--texto "Diploma USB - prueba 1" -> bafkreiez36qzdmqn6bh6gefu6wpky4dezu...
--texto "Diploma USB - prueba 2" -> bafkreicmjjso6teuztsxwcuwv4stofvsen...`, { x: M, y: 1.85, w: CW, h: 2.2, lang: "js", titulo: "salida real del script del laboratorio", size: 10.5 });
    D.definicion(s, "CID v1 raw  =  \"b\" + base32( 01 · 55 · 12 · 20 · sha256(bytes) )     versión · raw · sha2-256 · 32 bytes", { x: M, y: 4.2, w: CW, h: 0.62, size: 10.5 });
    D.dosColumnas(s,
      { et: "Compruébenlo en vivo", texto: "https://ipfs.io/ipfs/bafkreifz…n5e devuelve «hello world». Nadie lo subió para esta clase: alguien en el mundo fijó esos mismos bytes y el CID coincide." },
      { et: "El error de concepto típico", linea: C.rojo, color: C.rojo, texto: "«Mismo archivo, mismo CID siempre.» No: Pinata puede dar un CID «bafybei…» para esos bytes porque los envuelve en otra estructura. Ambos son hash; cambia la receta." },
      { y: 5.0, h: 1.72, size: 11.5 });
    s.addNotes("Los tres CID de la lámina se calcularon con scripts/s11/cid-raw.js durante la preparación (verifiquen en vivo, tarda un segundo). La consulta a ipfs.io con el CID de «hello world» devolvió el texto exacto al preparar la clase. Los CID antiguos (versión 0) empiezan por «Qm»; los de versión 1 por «baf». Cambiar «1» por «2» en el texto cambia el CID entero: efecto avalancha de la Sesión 2.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · disponibilidad", titulo: "Pinning: alguien tiene que guardarlo", ic: "candado", tituloSize: 27 });
    D.parrafo(s, "Un nodo IPFS guarda lo que visita solo como caché y lo borra cuando necesita espacio. Un archivo sobrevive si algún nodo lo FIJA. Los servicios de pinning son empresas que fijan por ustedes.", { y: 1.85, h: 0.95, size: 14 });
    D.tabla(s, ["servicio", "plan gratuito anunciado (sep. 2026)", "para el laboratorio"], [
      ["Pinata", "1 GB, 500 archivos, una puerta propia.", "Opción principal. Subir como PÚBLICO."],
      ["Filebase", "5 GB, compartidos con su almacenamiento S3.", "Alternativa si Pinata falla."],
      ["IPFS Desktop", "Su propio nodo, gratis.", "Plan B: el archivo existe solo mientras su PC esté encendido."],
    ], { y: 2.95, h: 1.9, colW: [2.2, 5.3, 4.593], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Dos trampas que vimos al preparar la clase", x: M, y: 5.05, w: CW, h: 1.65, texto: "1) Pinata permite subir como «privado»: esos archivos NO se anuncian a la red y ninguna puerta pública los encuentra. 2) Las puertas públicas (ipfs.io, dweb.link) limitan consultas y a veces responden 429: prueben con la puerta de su propio servicio.", size: 12 });
    s.addNotes("Planes consultados en las páginas de precios de Pinata y Filebase en septiembre de 2026. ⚠ VERIFICAR ANTES DE DICTAR: que el registro gratuito siga sin pedir tarjeta (no se pudo crear cuenta al preparar el material). Regla: si un servicio pide tarjeta, NO la ponen; usan la alternativa o el plan B. El 429 de ipfs.io ocurrió de verdad en una prueba de preparación y a los minutos volvió a responder.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · otra forma de pagar la permanencia", titulo: "Servidor, IPFS o Arweave", ic: "balanza", tituloSize: 29 });
    D.tabla(s, ["", "servidor https", "IPFS + pinning", "Arweave"], [
      ["Integridad", "Ninguna: el dueño cambia el archivo.", "Sí: el CID es el hash.", "Sí: identificador ligado al contenido."],
      ["Disponibilidad", "Mientras paguen el servidor.", "Mientras alguien fije (y pague).", "Pago único, diseñado para ser permanente."],
      ["Costo", "Mensual.", "Mensual (gratis en poco volumen).", "Una vez, al subir."],
      ["Riesgo principal", "Cambio o caída silenciosa.", "Que nadie siga fijando.", "Depende de que su economía se sostenga."],
    ], { y: 1.85, h: 3.15, colW: [2.3, 3.2, 3.3, 3.293], size: 11 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Verificación · almacenamiento", x: M, y: 5.2, w: CW, h: 1.5, texto: "La universidad sube el JSON a IPFS y deja de pagar Pinata en 2030. ¿Qué pasa con el diploma en la cadena? ¿Y qué pasa si en vez de eso alguien intenta cambiar el JSON? Respondan las dos por separado.", size: 13 });
    s.addNotes("Respuesta esperada: si dejan de fijar, el token sigue existiendo y su tokenURI sigue igual, pero el JSON puede volverse inalcanzable (disponibilidad). Si alguien cambia el JSON, obtiene otro CID: el token sigue apuntando al original, así que el cambio no afecta al NFT (integridad). Arweave: no citen cifras de «200 años»; digan que su modelo es un fondo que se paga al subir y que su sostenibilidad es una apuesta económica.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · regalías", titulo: "EIP-2981: se declara, no se garantiza", ic: "moneda", tituloSize: 27 });
    D.codigo(s, `function royaltyInfo(uint256 tokenId, uint256 precioVenta)
    external view returns (address receptor, uint256 regalia);
// ej.: 5 % -> royaltyInfo(1, 1 ether) = (creador, 0.05 ether)`, { x: M, y: 1.85, w: CW, h: 1.35, lang: "sol", size: 11.5 });
    D.parrafo(s, "El propio estándar lo dice: el pago es voluntario, porque transferFrom no sabe si hubo una venta. El contrato informa; el marketplace decide si paga.", { y: 3.35, h: 0.7, size: 13.5 });
    D.tabla(s, ["fecha", "qué pasó"], [
      ["Nov. 2022", "OpenSea lanza su «Operator Filter» para bloquear mercados que no pagan regalías."],
      ["Ago. 2023", "OpenSea lo apaga: regalías opcionales para colecciones nuevas desde el 31 de agosto."],
      ["2024", "OpenSea soporta ERC-721C: el contrato restringe quién puede transferir para forzar el pago."],
    ], { y: 4.2, h: 1.75, colW: [1.8, 10.293], size: 11.5 });
    D.parrafo(s, "Forzar regalías exige restringir transferencias. Es el mismo dilema del proyecto de entradas: control del emisor frente a libertad del dueño.", { y: 6.1, h: 0.62, size: 12.5, color: C.ocre });
    s.addNotes("Fuentes: texto de EIP-2981 (estado Final; interfaz 0x2a55205a), The Block 17-08-2023 sobre el fin del Operator Filter, blog de OpenSea sobre ERC-721C (2024). El debate de fondo no es técnico: es quién tiene poder sobre un bien después de venderlo.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · más allá del arte", titulo: "Casos donde la unicidad sí importa", ic: "diana", tituloSize: 27 });
    D.tabla(s, ["caso", "qué aporta el NFT", "el matiz honesto"], [
      ["Credenciales académicas", "Cualquiera verifica quién emitió qué, sin llamar a la universidad.", "¿Debería poder transferirse? Bloque C."],
      ["Trazabilidad (café, cacao)", "Cada lote con su historia pública e inalterable.", "El dato de entrada sigue dependiendo de un humano honesto."],
      ["Entradas a eventos", "Cada entrada es única; la reventa se acota por contrato.", "Es el proyecto del docente."],
      ["Licencias y membresías", "Acceso verificable y, si se quiere, transferible.", "A menudo ERC-1155 encaja mejor."],
      ["Activos reales (RWA)", "Un bien, un token, un dueño visible.", "Sin reconocimiento legal, el token no es el título."],
    ], { y: 1.85, h: 3.9, colW: [2.9, 4.6, 4.593], size: 11 });
    D.parrafo(s, "En todos sigue viva la pregunta de la Sesión 1: ¿hace falta una cadena, o basta una base de datos firmada por quien ya es la autoridad?", { y: 5.95, h: 0.75, size: 13, color: C.ocre });
    s.addNotes("RWA = real-world assets. Sean honestos con el último: en Colombia, un token no reemplaza la escritura pública ni el registro; un NFT de un lote no es el lote. Para credenciales, la ventaja real es verificar sin intermediario; la pregunta es si la universidad no podría firmar un PDF y ya.");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · críticas honestas", titulo: "Lo que el mercado NFT hizo mal", ic: "bicho", tituloSize: 28 });
    D.tabla(s, ["crítica", "en qué consiste"], [
      ["Enlaces rotos", "Colecciones con tokenURI en servidores propios que cerraron: el token queda apuntando a nada."],
      ["Tokenizar no da derechos", "Cualquiera puede emitir un NFT de una obra ajena. El contrato no verifica autoría."],
      ["Especulación y lavado de volumen", "Ventas de una cuenta a sí misma para inflar precios (wash trading), documentadas en informes de análisis de cadena."],
      ["Phishing de aprobaciones", "Sitios falsos que piden setApprovalForAll y vacían la billetera."],
      ["Consumo energético", "Crítica válida en 2021; en Ethereum bajó drásticamente con la prueba de participación (Sesión 4)."],
    ], { y: 1.85, h: 3.85, colW: [3.3, 8.793], size: 11.5 });
    D.parrafo(s, "Nada de esto invalida la técnica. Invalida usarla sin preguntarse qué problema resuelve. Esa es la tesis del curso.", { y: 5.9, h: 0.8, size: 13.5, color: C.ocre });
    s.addNotes("No citen cifras de volumen o de «porcentaje de colecciones que valen cero»: los informes que circulan son de metodología discutible. Si un estudiante trae una cifra, pidan la fuente y el método: es la costumbre que queremos. La fila de energía conecta con la S4 (ethereum.org cita una reducción del orden del 99,9 %).");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · verificación · todo el bloque A", titulo: "Tres preguntas antes del laboratorio", ic: "pregunta", tituloSize: 27 });
    D.pasos(s, [
      ["¿QUÉ SE TRANSFIERE?", "Cuando Ana transfiere su diploma a Beto, ¿qué cambia en la cadena y qué NO cambia en IPFS?"],
      ["¿QUIÉN PUEDE ALTERAR?", "Si el tokenURI es ipfs://CID, ¿puede la universidad cambiar el JSON del diploma 1 después de emitirlo?"],
      ["¿QUÉ HACE FALTA PAGAR?", "¿Qué pasa con la imagen si nadie la fija, y qué NO pasa con el token?"],
    ], { y: 1.9, alto: 0.95, gap: 0.14, anchoEt: 3.1, size: 12.5 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Respuestas cortas", x: M, y: 5.1, w: CW, h: 1.6, texto: "1) Cambia ownerOf; el tokenURI y el JSON quedan iguales (lo prueba un test del laboratorio). 2) No puede cambiar ESE archivo; podría subir otro con otro CID, pero el token seguiría apuntando al original. 3) La imagen puede volverse inalcanzable; el token y su dueño siguen intactos en la cadena.", size: 12.5 });
    s.addNotes("5 minutos. Pidan respuestas a tres parejas distintas antes de mostrar la ficha. Matiz para la 2: nuestro contrato no tiene función para cambiar el tokenURI; si la tuviera (hay contratos así), la universidad sí podría cambiar el ENLACE. Leer el contrato antes de confiar es parte de verificar.");
  }

  {
    const s = await D.lamina({ kicker: "A.19 · lo que hay que llevarse del bloque A", titulo: "Seis ideas sobre NFTs", ic: "lista", tituloSize: 28 });
    const ideas = [
      "No fungible = con identidad: importa CUÁL, no cuántos. No significa «valioso».",
      "ERC-721 para piezas con historia propia; ERC-1155 para muchas copias de pocos tipos.",
      "«El NFT» es la celda ownerOf; el JSON y la imagen viven afuera, casi siempre en IPFS.",
      "IPFS garantiza integridad (el CID es el hash), no disponibilidad: eso es el pinning.",
      "Las regalías (EIP-2981) se declaran; forzarlas exige restringir transferencias.",
      "Firmar setApprovalForAll es entregar todos tus NFT de ese contrato. Leer antes de firmar.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
    s.addNotes("Aquí va la pausa de 10 minutos. Pidan que durante la pausa abran pinata.cloud y creen la cuenta (plan gratuito, sin tarjeta): es el paso que más tiempo consume del laboratorio.");
  }

  /* ================================================================ B */
  {
    const s = await D.divisor({ letra: "B", titulo: "Laboratorio 11", sub: "Un diploma NFT de prueba: imagen y JSON en IPFS, contrato con pruebas, despliegue en Sepolia y los tres saltos verificados.", minutos: "APROXIMADAMENTE 75 MINUTOS · EN PAREJAS", ic: "martillo" });
    s.addNotes("Repartan la guía PDF: laboratorios-evm/guias/s11-diploma-nft-ipfs.pdf. Las láminas B.1 a B.8 son el mapa; el detalle de cada comando está en la guía. Si la red de la sala falla, las partes 1 y 2 (contrato y pruebas) no necesitan internet.");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · el mapa del laboratorio", titulo: "Seis pasos, en este orden", ic: "lista", tituloSize: 29 });
    D.pasos(s, [
      ["CONTRATO (15 MIN)", "Completar los TODO de emitir() en DiplomaUSB y ver 11 pruebas en verde."],
      ["IMAGEN A IPFS (10)", "Subir un PNG de prueba a Pinata, como público. Anotar su CID."],
      ["JSON A IPFS (10)", "Escribir el JSON con el CID de la imagen adentro. Subirlo. Anotar su CID."],
      ["ENSAYO LOCAL (10)", "Desplegar y emitir en la red local con Ignition, sin gastar nada."],
      ["SEPOLIA (15)", "Desplegar, verificar y emitir el diploma con SU tokenURI real."],
      ["VERIFICAR (15)", "Ver el token en el explorador y correr leer-diploma.js: los tres saltos."],
    ], { y: 1.85, alto: 0.7, gap: 0.1, anchoEt: 3.1, size: 12 });
    s.addNotes("Tiempos orientativos que suman 75. Si una pareja se atrasa en IPFS, que avance el contrato y el ensayo local: el pinning se puede terminar en casa. Lo que no puede faltar para la evidencia: contrato verificado en Sepolia con un diploma emitido cuyo tokenURI resuelva.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · paso 1 · el contrato", titulo: "emitir(): checks, effects, interaction", ic: "codigo", tituloSize: 26 });
    D.codigo(s, `function emitir(address a, string calldata uri)
    external onlyOwner returns (uint256 tokenId)
{
    if (bytes(uri).length == 0) revert URIVacio();          // checks
    if (_siguienteId > tope) revert TopeAlcanzado(tope);
    tokenId = _siguienteId++;                               // effects
    _setTokenURI(tokenId, uri);
    _safeMint(a, tokenId);        // interaction: puede llamar al receptor
    emit DiplomaEmitido(tokenId, a, uri);
}`, { x: M, y: 1.85, w: 8.1, h: 3.4, lang: "sol", titulo: "contracts/s11/DiplomaUSB.sol · la solución", size: 10.5 });
    D.lista(s, [
      "Copien andamiaje/s11/DiplomaUSB.sol sobre contracts/s11/.",
      "Al empezar: 4 pruebas pasan y 7 (las ★) fallan.",
      "Terminado: 11 passing.",
    ], { x: M + 8.35, y: 1.85, w: CW - 8.35, h: 3.4, size: 12, gap: 9 });
    D.codigo(s, `npx hardhat test test/s11/DiplomaUSB.test.js`, { x: M, y: 5.45, w: CW, h: 0.55, lang: "js", size: 12 });
    D.parrafo(s, "¿Por qué _safeMint va al final? Si el receptor es un contrato, se le llama; el estado ya debe estar escrito (Sesión 9).", { y: 6.15, h: 0.55, size: 12.5, color: C.ocre });
    s.addNotes("La solución está en contracts/s11 del repositorio del docente; al estudiante le llega el andamiaje. Si alguien pone _safeMint antes de _setTokenURI, las pruebas pasan igual: úsenlo para discutir que una prueba verde no demuestra ausencia de riesgo, y que CEI es una disciplina, no un requisito de las pruebas.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · pasos 2 y 3 · IPFS", titulo: "Primero la imagen, después el JSON", ic: "red", tituloSize: 27 });
    D.pasos(s, [
      ["SUBIR LA IMAGEN", "Pinata → Upload → File, red PÚBLICA. Un PNG de prueba, sin fotos ni datos de nadie."],
      ["COPIAR SU CID", "Algo como bafybei… o bafkrei…. Ábranlo en https://gateway.pinata.cloud/ipfs/<CID>."],
      ["ESCRIBIR EL JSON", "El de A.7, con \"image\": \"ipfs://<CID de la imagen>\". Guardarlo como diploma.json."],
      ["SUBIR EL JSON", "Mismo procedimiento. Su CID es el tokenURI: ipfs://<CID del JSON>."],
    ], { y: 1.85, alto: 0.78, gap: 0.12, anchoEt: 2.7, size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Cómo saber que terminó este paso", x: M, y: 5.45, w: CW, h: 1.25, texto: "La URL de la puerta con el CID del JSON muestra el JSON, y dentro, el enlace de la imagen abre la imagen. Si una puerta da 429 o tarda, prueben otra. Si NINGUNA lo encuentra, casi siempre lo subieron como privado.", size: 12.5 });
    s.addNotes("El orden importa: el CID de la imagen va DENTRO del JSON, así que el JSON se escribe y se sube después. Si cambian la imagen, cambia su CID, cambia el JSON y cambia el CID del JSON: todo se rehace. Muéstrenlo como consecuencia directa del direccionamiento por contenido.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · pasos 4 y 5 · desplegar", titulo: "Ensayo local, y después Sepolia", ic: "cohete", tituloSize: 28 });
    D.codigo(s, `# ensayo en la red local: no gasta nada
npx hardhat ignition deploy ignition/modules/s11-DiplomaUSB.js

# Sepolia, con SU archivo de parámetros (tope, destinatario, tokenURI)
npx hardhat ignition deploy ignition/modules/s11-DiplomaUSB.js \\
  --network sepolia --parameters ignition/parametros/diploma-sepolia.json --verify`, { x: M, y: 1.85, w: CW, h: 2.3, lang: "py", size: 10.5 });
    D.codigo(s, `[ DiplomaModulo ] successfully deployed
DiplomaModulo#DiplomaUSB - 0x5FbDB2315678afecb367f032d93F642f64180aa3`, { x: M, y: 4.3, w: CW, h: 0.95, lang: "js", titulo: "salida esperada del ensayo local (dirección real)", size: 10.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Claves solo en el keystore", x: M, y: 5.45, w: CW, h: 1.25, texto: "SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY y ETHERSCAN_API_KEY van con npx hardhat keystore set. Nunca en el JSON de parámetros ni en Git: ese archivo solo lleva el tope, SU dirección pública y el tokenURI.", size: 12.5 });
    s.addNotes("La dirección 0x5FbDB… es la del primer contrato de la cuenta #0 en una red local nueva: les va a salir igual. El módulo despliega y además llama emitir() una vez (m.call), así que al terminar ya existe el diploma #1. --verify publica el código en el explorador.");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · paso 6 · ¿dónde se ve?", titulo: "No hay marketplace oficial de testnet", ic: "lupa", tituloSize: 27 });
    D.parrafo(s, "El plan original decía «verlo en el marketplace de prueba». Lo verificamos antes de clase: OpenSea cerró su sitio de redes de prueba en julio de 2025 (testnets.opensea.io hoy redirige a un aviso de despedida). La evidencia será otra, y mejor:", { y: 1.85, h: 1.0, size: 13.5 });
    D.tabla(s, ["dónde", "qué muestra"], [
      ["sepolia.etherscan.io/nft/<contrato>/<id>", "El token ERC-721, su dueño, su historial y la metadata que logre resolver."],
      ["eth-sepolia.blockscout.com/token/<contrato>/instance/<id>", "Explorador abierto: resuelve el JSON y muestra imagen y atributos."],
      ["npx hardhat run scripts/s11/leer-diploma.js", "Los tres saltos, uno por uno: cadena → JSON → imagen, con el sha256."],
      ["testnet.rarible.com (opcional)", "Sigue en línea y lista colecciones de Sepolia; indexar la suya no depende de ustedes."],
    ], { y: 3.0, h: 2.85, colW: [5.2, 6.893], size: 11 });
    D.parrafo(s, "Un marketplace solo hace los tres saltos por ustedes. El script los hace a la vista: eso vale más como evidencia.", { y: 6.0, h: 0.7, size: 12.5, color: C.ocre });
    s.addNotes("Verificado en septiembre de 2026: testnets.opensea.io redirige a support.opensea.io «Farewell testnets» (23-07-2025). La API pública de Blockscout Sepolia devolvió metadata e imagen de un ERC-721 real. testnet.rarible.com respondió con colecciones de Sepolia. ⚠ VERIFICAR ANTES DE DICTAR: que Rarible testnet siga en línea e indexe contratos nuevos; si no, se omite esa fila. Etherscan protege el sitio con una verificación anti-bots: con navegador normal abre sin problema.");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · salida esperada", titulo: "Así se ven los tres saltos resueltos", ic: "terminal", tituloSize: 27 });
    D.codigo(s, `1 · EN LA CADENA  (sepolia)
  contrato  : 0x…  «Diploma USB»
  dueño     : 0x…  (su dirección)
  tokenURI  : ipfs://bafkrei…
2 · LA METADATA (el JSON)
  resuelto en: https://gateway.pinata.cloud/ipfs/bafkrei…
  name       : Diploma de prueba · Laboratorio 11
  rasgo      : Programa = Ingeniería de Sistemas
3 · EL ARCHIVO (la imagen)
  tamaño     : 48.213 bytes
  sha256     : 0x9d1b…
Los tres saltos resolvieron. Guarden esta salida como evidencia.`, { x: M, y: 1.85, w: 7.6, h: 4.85, lang: "js", titulo: "scripts/s11/leer-diploma.js", size: 10.5 });
    D.lista(s, [
      "Si falla el salto 1: dirección o red equivocada.",
      "Si falla el 2: CID mal copiado, o subido como privado.",
      "Si falla el 3: el \"image\" del JSON no empieza por ipfs:// o el CID está mal.",
      "Si una puerta da 429, el script prueba la siguiente.",
    ], { x: M + 7.85, y: 1.85, w: CW - 7.85, h: 4.85, size: 12, gap: 9 });
    s.addNotes("La forma de la salida es la real del script (se probó contra una red local con un tokenURI público). Los valores con puntos suspensivos varían por pareja; el tamaño y el sha256 son de ejemplo. Se corre con: $env:DIPLOMA=\"0x…\"; $env:TOKEN_ID=\"1\"; npx hardhat run scripts/s11/leer-diploma.js --network sepolia.");
  }

  {
    const s = await D.lamina({ kicker: "B.7 · lo que más falla", titulo: "Errores comunes del laboratorio 11", ic: "alerta", tituloSize: 27 });
    D.tabla(s, ["síntoma", "causa y arreglo"], [
      ["Las puertas IPFS no encuentran el CID", "Subieron como PRIVADO en Pinata. Vuelvan a subir como público."],
      ["El explorador muestra el token sin imagen", "\"image\" apunta a https o a un CID mal copiado; o el explorador aún no lo indexa: esperen y usen el script."],
      ["TopeAlcanzado al emitir", "El tope del JSON de parámetros es menor que los diplomas emitidos."],
      ["OwnableUnauthorizedAccount", "Emiten desde una cuenta que no desplegó el contrato."],
      ["HHE… «config variable not found»", "Falta cargar una clave con npx hardhat keystore set."],
      ["insufficient funds for gas", "Sin ETH de Sepolia: pidan a la reserva del docente."],
    ], { y: 1.85, h: 4.85, colW: [4.0, 8.093], size: 11 });
    s.addNotes("La guía PDF trae la tabla completa. El error número uno en la preparación fue el de «privado»: la interfaz de Pinata distingue público y privado y el privado no se anuncia a la red IPFS (documentación de Pinata, «Private IPFS»).");
  }

  {
    const s = await D.lamina({ kicker: "B.8 · cómo saber que terminó · qué se entrega", titulo: "Evidencia del laboratorio 11", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["Pruebas", "Captura de 11 passing en test/s11/DiplomaUSB.test.js con SU contrato.", "20 %"],
      ["CIDs en IPFS", "CID de la imagen y del JSON; ambos abren en una puerta pública.", "20 %"],
      ["Contrato en Sepolia", "Dirección verificada y hash de la transacción de emitir.", "25 %"],
      ["Los tres saltos", "Salida de leer-diploma.js y captura del token en un explorador.", "20 %"],
      ["Reflexión", "Respuestas de la guía (permanencia, CID raw vs CID de Pinata, SBT).", "15 %"],
    ], { y: 1.85, h: 3.5, colW: [2.6, 7.893, 1.6], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Dónde está todo", x: M, y: 5.55, w: CW, h: 1.15, texto: "Guía paso a paso: laboratorios-evm/guias/s11-diploma-nft-ipfs.pdf. Reto opcional: DiplomaSBT (bloque C). Sin evidencia en cadena, el laboratorio no se califica.", size: 12.5 });
    s.addNotes("Terminó cuando: 11 pruebas verdes, un diploma emitido en Sepolia cuyo tokenURI resuelve, y la salida del script guardada. La rúbrica completa está en la guía. Política del curso: hash de transacción o dirección de contrato obligatorios.");
  }

  /* ================================================================ C */
  {
    const s = await D.divisor({ letra: "C", titulo: "Caso USB · el diploma", sub: "La universidad quiere emitir diplomas verificables en cadena. Tres modelos técnicos, una ley de datos personales, y ninguna respuesta gratis.", minutos: "APROXIMADAMENTE 25 MINUTOS", ic: "escudo" });
    s.addNotes("Formato: 5 min de exposición (C.1 a C.3), 12 min de trabajo por equipos de proyecto, 8 min de defensas de 1 minuto. Lo que se evalúa es nombrar lo que se sacrifica.");
  }

  {
    const s = await D.lamina({ kicker: "C.1 · el debate", titulo: "Tres formas de modelar el mismo diploma", ic: "balanza", tituloSize: 26 });
    D.tabla(s, ["modelo", "a favor", "en contra"], [
      ["ERC-721 transferible", "Estándar, simple; cualquier explorador lo muestra.", "Un título se podría vender o regalar: el dueño del token no es el graduado."],
      ["ERC-1155 (un id por programa)", "Barato para cohortes grandes; un id = «Sistemas 2026».", "Las copias son idénticas: no distingue a una persona de otra del mismo programa."],
      ["SBT · ERC-5192", "No se transfiere: el token queda atado a la cuenta del graduado.", "Pierde la billetera, pierde el diploma; la universidad conserva poder de revocar."],
    ], { y: 1.85, h: 3.25, colW: [2.9, 4.4, 4.793], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "ERC-5192 en una línea", x: M, y: 5.3, w: CW, h: 1.4, texto: "Estándar Final: añade locked(tokenId) y los eventos Locked/Unlocked a un ERC-721. Si locked devuelve true, TODA función que mueva el token entre cuentas debe revertir. Interfaz ERC-165: 0xb45a3c0e.", size: 12.5 });
    s.addNotes("Texto de ERC-5192 verificado en eips.ethereum.org (estado Final). Nuestro DiplomaSBT lo implementa en ~10 líneas y lo prueban 9 pruebas (test/s11/DiplomaSBT.test.js), incluida la de «billetera perdida».");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · el SBT, en código", titulo: "Un if en _update bloquea la transferencia", ic: "candado", tituloSize: 26 });
    D.codigo(s, `function _update(address to, uint256 tokenId, address auth)
    internal override returns (address)
{
    address from = _ownerOf(tokenId);
    if (from != address(0) && to != address(0))       // ni mint ni quema
        revert DiplomaIntransferible(tokenId);          // = transferencia
    address anterior = super._update(to, tokenId, auth);
    if (from == address(0)) emit Locked(tokenId);      // ERC-5192
    return anterior;
}`, { x: M, y: 1.85, w: 8.3, h: 3.45, lang: "sol", titulo: "contracts/s11/DiplomaSBT.sol", size: 10.5 });
    D.lista(s, [
      "En OpenZeppelin v5 todo movimiento pasa por _update.",
      "Emitir (de 0) y revocar (a 0) siguen permitidos.",
      "Reto opcional: andamiaje/s11/DiplomaSBT.sol.",
    ], { x: M + 8.55, y: 1.85, w: CW - 8.55, h: 3.45, size: 12, gap: 9 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Lo que muestra la prueba «billetera perdida»", x: M, y: 5.5, w: CW, h: 1.2, texto: "La universidad revoca el token 1 y emite el 2 a la cuenta nueva. El 1 queda quemado para siempre. ¿Es eso un diploma «inmutable»? ¿Quién tiene el poder real?", size: 12.5 });
    s.addNotes("Dejen la pregunta abierta: es insumo para el debate. Respuesta madura: el SBT traslada el control de la persona a la institución emisora. Para un diploma eso quizá es correcto (la universidad ya es la autoridad), pero entonces la cadena aporta verificabilidad pública, no descentralización del poder.");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · habeas data", titulo: "Ley 1581 de 2012: nada personal en cadena", ic: "escudo", tituloSize: 26 });
    D.tabla(s, ["dónde", "qué SÍ", "qué NO, nunca"], [
      ["En la cadena", "Dirección, tokenId, tokenURI, fecha de emisión.", "Nombre, cédula, correo, fotografía."],
      ["En IPFS (público)", "Programa, cohorte, imagen genérica del diploma.", "Cualquier dato que identifique a la persona."],
      ["En la universidad", "El PDF firmado y la relación persona ↔ dirección.", "—  (es donde la ley sí permite custodiarlos)"],
    ], { y: 1.85, h: 2.45, colW: [2.4, 4.8, 4.893], size: 11.5 });
    D.dosColumnas(s,
      { et: "El choque", linea: C.rojo, color: C.rojo, texto: "La ley reconoce al titular el derecho a pedir la supresión de sus datos. Una cadena pública y un CID fijado por terceros no se pueden borrar." },
      { et: "La salida de diseño", texto: "Lo personal nunca sale de la universidad. En cadena, a lo sumo, el hash del PDF (Sesión 6): prueba integridad sin revelar nada." },
      { y: 4.5, h: 2.2, size: 12.5 });
    s.addNotes("Ley Estatutaria 1581 de 2012, régimen general de protección de datos personales; el artículo 8 reconoce el derecho a revocar la autorización y a solicitar la supresión. Ojo con un matiz: incluso la relación «esta dirección es de Ana» es dato personal si la universidad la publica. Por eso ni siquiera se publica la lista de direcciones de graduados.");
  }

  {
    const s = await D.lamina({ kicker: "C.4 · trabajo en equipos · verificación del bloque C", titulo: "Elijan un modelo y defiéndanlo", ic: "taller", tituloSize: 27 });
    D.pasos(s, [
      ["ELEGIR (3 MIN)", "721, 1155 o SBT. Una sola opción por equipo."],
      ["NOMBRAR EL COSTO (4)", "Qué se sacrifica, en una frase. «Nada» no es respuesta válida."],
      ["PASAR LA LEY (3)", "Qué va en cadena, qué en IPFS, qué en la universidad (tabla C.3)."],
      ["DEFENDER (1 CADA UNO)", "Un minuto por equipo. Los demás preguntan una sola cosa."],
    ], { y: 1.85, alto: 0.78, gap: 0.12, anchoEt: 3.3, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta que cierra el caso", x: M, y: 5.45, w: CW, h: 1.25, texto: "Si al final la universidad controla emisión y revocación, ¿qué aporta la cadena que no aporte un PDF firmado digitalmente? Si no pueden responderla, su diseño no necesita blockchain.", size: 12.5 });
    s.addNotes("Es la tesis del curso aplicada: saber cuándo NO usar blockchain. Respuesta defendible: verificación pública y permanente sin depender de que la universidad responda o exista; registro de revocaciones auditable. Respuesta también defendible: no aporta lo suficiente y basta una firma digital con sello de tiempo. Se califica el argumento, no la elección.");
  }

  await D.preguntaSemana({
    pregunta: "Elijan un NFT famoso y sigan sus tres saltos: ¿su tokenURI es ipfs://, Arweave o https? ¿Qué le pasaría si la empresa detrás cerrara mañana?",
    trabajo: [
      "Terminar y entregar la evidencia del laboratorio 11 (guía PDF, lista de chequeo al final).",
      "Contratos del proyecto completos: son la base del Avance 1 (Sesión 13).",
      "Sesión 12: traer MetaMask funcionando y Node.js; se conecta una interfaz a la FichaUSB de la S10.",
      "Opcional: completar el reto DiplomaSBT y sus 9 pruebas.",
    ],
    notas: "La pregunta de la semana se abre en los primeros 5 minutos de la S12. Pista para quien no sepa por dónde empezar: en el explorador, pestaña «Read contract», llamar tokenURI con un id; si empieza por https, ya tienen la mitad de la respuesta.",
  });

  {
    const s = await D.cierre({
      frase: "Tener un NFT es estar en una celda. Que signifique algo depende de dónde viva el archivo.",
      sub: "Ya saben emitir tokens fungibles y no fungibles, y guardar su contenido sin depender de un servidor. Falta lo que una persona de verdad ve: una interfaz.",
      proxima: "Sesión 12 · Web 3.0 · conectar el frontend a la cadena",
    });
    s.addNotes("Cierre en un minuto. Recuerden la frase de A.10: IPFS da integridad, el pinning da disponibilidad. Y que la S12 asume MetaMask instalado y la FichaUSB de la S10 a mano.");
  }

  return D.guardar(path.join(__dirname, "Sesion-11-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
