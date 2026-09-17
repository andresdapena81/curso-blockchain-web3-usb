/* =====================================================================
   Sesión 11 · NFTs, ERC-721/1155 y almacenamiento descentralizado
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 11 · NFT, ERC-721/1155 E IPFS", titulo: "Sesión 11 · NFTs e IPFS" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 11 · UNIDAD III · WEB 3.0",
    titulo: "NFT: LO ÚNICO,\nY DÓNDE VIVE\nDE VERDAD",
    sub: "El contrato guarda quién es dueño de qué. La imagen casi nunca está en la cadena. Entender esa separación es la sesión.",
    palabra: "ÚNICO",
    ic: "imagen",
    notas: "El gancho: la mayoría de los NFT apuntan a una imagen que su dueño no controla. Hoy se hace bien, con IPFS.",
  });

  await D.agenda({
    intro: "Tokens no fungibles: cada uno distinto. Y el problema que casi todo el mercado hace mal: dónde se guarda el archivo.",
    bloques: [
      ["A", "NO FUNGIBILIDAD E IPFS", "ERC-721 vs 1155, metadata, IPFS, CID, y casos de uso serios.", "~65 min"],
      ["B", "LABORATORIO 11", "Diploma NFT con metadata en IPFS, minteado y visible en un marketplace de prueba.", "~85 min"],
      ["C", "CASO USB", "Modelar el diploma: ¿ERC-721, 1155 o token del alma? Discusión.", "~30 min"],
    ],
  });

  await D.objetivo({
    objetivo: "Implementar tokens no fungibles con metadata descentralizada y evaluar cuándo un NFT resuelve un problema real.",
    preguntas: [
      "¿Qué distingue un ERC-721 de un ERC-1155, y cuándo usar cada uno?",
      "¿Dónde está «el NFT» y dónde está «el archivo»?",
      "¿Por qué una URL centralizada rompe la promesa de permanencia?",
      "¿Qué casos de uso serios existen más allá del arte especulativo?",
    ],
    ra: "RA3 · estándares (ERC-721)  ·  RA6 · almacenamiento descentralizado.",
  });

  await D.glosario({
    items: [
      ["NFT", "Non-Fungible Token", "Token único: el número 7 es distinto del 8 y no se cambia uno por otro. Lo contrario de un ERC-20."],
      ["ERC-721", "estándar de NFT", "Un token único por id. Cada uno con su dueño y su metadata."],
      ["ERC-1155", "estándar multi-token", "Un solo contrato con muchos tipos, fungibles o no, y transferencias por lotes."],
      ["tokenURI", "enlace a la metadata", "Función que devuelve dónde está el JSON que describe el token."],
      ["Metadata", "metadatos", "El JSON con nombre, descripción, imagen y atributos. NO es el token: es su ficha."],
      ["IPFS", "InterPlanetary File System", "Red de almacenamiento que direcciona por contenido: el enlace es el hash del archivo."],
      ["CID", "Content Identifier", "El identificador de IPFS: es el hash del contenido. Si el archivo cambia, el CID cambia."],
      ["Pinning", "fijado", "Pagar a un servicio para que mantenga tu archivo disponible en IPFS. Si nadie lo fija, desaparece."],
    ],
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "No fungibilidad e IPFS", sub: "Comprar un NFT casi nunca es comprar una imagen. Es comprar una fila en un contrato que apunta a una imagen. Dónde apunta lo cambia todo.", minutos: "APROXIMADAMENTE 65 MINUTOS", ic: "imagen" });

  {
    const s = await D.lamina({ kicker: "A.1 · fungible vs no fungible", titulo: "Un billete cualquiera, o esta entrada exacta", ic: "rejilla", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "Fungible · ERC-20 (Sesión 10)", texto: "Cada unidad es idéntica e intercambiable. Mi punto vale igual que tu punto. Solo importa CUÁNTOS tienes. Como el dinero: da igual qué billete de 50." },
      { et: "No fungible · ERC-721", texto: "Cada token es único, con identidad propia. Importa CUÁL tienes. Como una entrada con asiento asignado, un diploma, un título de propiedad: no son intercambiables uno por otro." },
      { y: 1.9, h: 2.55, size: 13 });
    D.definicion(s, "ERC-20:  balanceOf(ana) = 30        ·        ERC-721:  ownerOf(7) = ana", { x: M, y: 4.7, w: CW, h: 0.65, size: 12 });
    D.parrafo(s, "El cambio de pregunta lo resume todo: en ERC-20 se pregunta «¿cuántos?»; en ERC-721, «¿de quién es el número 7?».", { y: 5.55, h: 0.7, size: 13.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.2 · dos estándares", titulo: "ERC-721 y ERC-1155", ic: "capas", tituloSize: 30 });
    D.tabla(s, ["", "ERC-721", "ERC-1155"], [
      ["Idea", "Un token único por id.", "Un contrato con muchos tipos a la vez."],
      ["Fungibilidad", "Todos no fungibles.", "Mezcla: tipos fungibles y no fungibles juntos."],
      ["Transferir varios", "Uno por transacción.", "Por lotes: muchos en una sola transacción."],
      ["Caso típico", "Un diploma, una obra única, un título.", "Ítems de un juego: 1000 pociones y 1 espada legendaria."],
      ["Costo", "Un contrato por colección.", "Más barato al manejar muchos tipos e inventarios."],
    ], { y: 1.9, h: 3.3, colW: [2.3, 4.6, 5.193], size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Cómo elegir", x: M, y: 5.4, w: CW, h: 1.3, texto: "¿Cada ítem es una pieza única con su propia historia? ERC-721. ¿Hay muchas copias de pocos tipos, o se mueven inventarios en lote? ERC-1155. El diploma es claramente 721.", size: 13.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.3 · la distinción clave", titulo: "«El NFT» no es «el archivo»", ic: "imagen", tituloSize: 29 });
    D.nodo(s, { x: M, y: 2.1, w: 3.3, h: 1.3, titulo: "EN LA CADENA", sub: "ownerOf(7) = ana\ntokenURI(7) = ipfs://...", fill: C.blanco, line: C.naranja, subSize: 11 });
    D.flecha(s, M + 3.3, 2.75, M + 4.4, 2.75, C.tinta, 2);
    D.nodo(s, { x: M + 4.4, y: 2.1, w: 3.3, h: 1.3, titulo: "EN IPFS · EL JSON", sub: "nombre, descripción,\n\"image\": ipfs://...", fill: C.superf, subSize: 11 });
    D.flecha(s, M + 7.7, 2.75, M + 8.8, 2.75, C.tinta, 2);
    D.nodo(s, { x: M + 8.8, y: 2.1, w: CW - 8.8, h: 1.3, titulo: "EN IPFS · LA IMAGEN", sub: "el archivo .png\no .pdf del diploma", fill: C.superf, subSize: 11 });
    D.parrafo(s, "El contrato guarda dos cosas: quién es el dueño, y un enlace (tokenURI) al JSON. El JSON, a su vez, enlaza la imagen. Ni el JSON ni la imagen están en la cadena: sería carísimo (Sesión 5).", { y: 3.85, h: 0.95, size: 14 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Lo que de verdad se compra", x: M, y: 4.95, w: CW, h: 1.75, texto: "Comprar un NFT es hacerse dueño de la fila del contrato: ownerOf(7) pasa a ser tu dirección. La imagen es un archivo al que ese token apunta. Si ese archivo desaparece, sigues siendo dueño de un token que apunta a la nada. Por eso importa tanto DÓNDE vive el archivo.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.4 · el problema de la permanencia", titulo: "Una URL normal rompe la promesa", ic: "alerta", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "tokenURI con URL normal", linea: C.rojo, color: C.rojo, texto: "https://miuni.edu/diploma/7.json\n\nEl día que ese servidor cambie el archivo, caiga, o la universidad deje de pagarlo, el NFT apunta a la nada — o peor, a otra cosa. Quien controla el servidor puede cambiar «tu» NFT sin tocar la cadena." },
      { et: "tokenURI con IPFS", texto: "ipfs://bafybei.../7.json\n\nEl enlace ES el hash del contenido. Si alguien cambia el archivo, cambia el CID, así que el enlace ya no coincide: es imposible sustituir el contenido a escondidas." },
      { y: 1.9, h: 2.75, size: 12.5 });
    D.enunciado(s, "Un NFT es tan permanente como el lugar donde vive su archivo. IPFS no lo hace eterno gratis, pero hace imposible falsificarlo.", { y: 4.85, h: 1.35, size: 17, line: C.naranja });
  }

  {
    const s = await D.lamina({ kicker: "A.5 · cómo funciona IPFS", titulo: "Direccionar por contenido, no por ubicación", ic: "red", tituloSize: 26 });
    D.dosColumnas(s,
      { et: "La web normal · por ubicación", texto: "«Tráeme lo que haya en esta dirección.» Lo que devuelve depende de quién controla el servidor, y puede cambiar en cualquier momento." },
      { et: "IPFS · por contenido", texto: "«Tráeme el archivo cuyo hash es este.» El CID es el hash del contenido. Cualquier nodo que lo tenga sirve exactamente el mismo archivo, o ninguno: no hay forma de devolver algo distinto." },
      { y: 1.9, h: 2.3, size: 13 });
    D.definicion(s, "CID = hash(contenido)     →     cambiar un byte del archivo cambia el CID por completo (Sesión 2)", { x: M, y: 4.45, w: CW, h: 0.65, size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El costo que nadie cuenta: pinning", x: M, y: 5.3, w: CW, h: 1.4, texto: "IPFS no garantiza que tu archivo siga ahí. Solo existe mientras algún nodo lo «fije» (pin). Si subes a un servicio gratuito y deja de fijarlo, el archivo desaparece y el NFT queda roto. Para algo serio, se paga un servicio de pinning o se usa Arweave, que cobra una vez por almacenamiento permanente.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.6 · el JSON de metadata", titulo: "La ficha que leen los marketplaces", ic: "documento", tituloSize: 27 });
    D.codigo(s, `{
  "name": "Diploma · Ingeniería de Sistemas · 2026",
  "description": "Credencial verificable emitida por la USB Medellín.",
  "image": "ipfs://bafybei.../diploma-7.png",
  "attributes": [
    { "trait_type": "Programa", "value": "Ingeniería de Sistemas" },
    { "trait_type": "Año", "value": 2026 }
  ]
}`, { x: M, y: 1.9, w: 7.4, h: 3.2, lang: "js", titulo: "7.json en IPFS", size: 11.5 });
    D.lista(s, [
      "Es una convención, no una regla del protocolo: los marketplaces esperan estos campos.",
      "image también es un enlace IPFS: la ficha y la imagen son archivos distintos.",
      "attributes es lo que un marketplace muestra como «rasgos».",
      "Un diploma real NO pondría datos personales en un JSON público.",
    ], { x: M + 7.7, y: 1.9, w: CW - 7.7, h: 3.2, size: 12, gap: 8 });
    D.parrafo(s, "El contrato solo guarda el enlace a este JSON. Todo lo demás —cómo se ve, qué dice— vive fuera de la cadena.", { y: 5.3, h: 0.6, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.7 · regalías", titulo: "EIP-2981: un porcentaje sugerido, no garantizado", ic: "moneda", tituloSize: 25 });
    D.parrafo(s, "Muchos creadores quieren cobrar un porcentaje cada vez que su obra se revende. EIP-2981 estandariza cómo un contrato DECLARA esa regalía. Pero declararla no es cobrarla.", { y: 1.9, h: 0.9, size: 14.5 });
    D.dosColumnas(s,
      { et: "Lo que hace el estándar", texto: "El contrato responde a royaltyInfo(tokenId, precio) diciendo a quién y cuánto. Es información: le dice al marketplace qué regalía respetar." },
      { et: "Lo que NO puede hacer", linea: C.rojo, color: C.rojo, texto: "Obligar a pagarla. Si dos personas se transfieren el NFT por fuera de un marketplace que la respete, no hay regalía. El contrato del NFT no puede impedir la transferencia sin más (lo vimos en el proyecto de entradas)." },
      { y: 2.95, h: 2.4, size: 12.5 });
    D.parrafo(s, "Es el mismo problema del proyecto de entradas: quien emite pierde control al entregar, salvo que bloquee la transferencia directa. Un tema de diseño, no de estándar.", { y: 5.5, h: 0.7, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.8 · más allá del arte", titulo: "Casos de uso donde la unicidad importa", ic: "diana", tituloSize: 27 });
    D.tabla(s, ["caso", "por qué un NFT", "el matiz"], [
      ["Credenciales académicas", "Cada diploma es único y verificable por cualquiera.", "¿Debería poder transferirse un diploma? Ver A.9."],
      ["Entradas a eventos", "Cada entrada es única; la reventa se puede acotar por contrato.", "Es el proyecto del docente."],
      ["Trazabilidad de producto", "Cada lote de café con su historia única on-chain.", "El dato de entrada sigue dependiendo de un humano honesto (caso Estonia)."],
      ["Títulos de propiedad", "Un bien, un token, un dueño.", "Requiere que la ley reconozca el token. Aún no, en general."],
      ["Membresías y licencias", "Acceso único y transferible o no.", "Muchas veces un ERC-1155 encaja mejor."],
    ], { y: 1.9, h: 3.7, colW: [3.0, 4.6, 4.493], size: 11 });
    D.parrafo(s, "En todos, la pregunta de la Sesión 1 sigue viva: ¿de verdad hace falta una cadena, o basta una base de datos firmada?", { y: 5.75, h: 0.6, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.9 · un caso incómodo", titulo: "¿Un diploma se debería poder vender?", ic: "balanza", tituloSize: 27 });
    D.parrafo(s, "Un ERC-721 normal es transferible: su dueño lo puede vender. Para un diploma eso es absurdo: un título no se compra a otra persona. Aquí entra un tercer tipo de token.", { y: 1.9, h: 0.9, size: 14 });
    D.dosColumnas(s,
      { et: "SBT · Soulbound Token", texto: "Un token no transferible, «atado al alma» de una cuenta. Se emite y no se puede mover. Ideal para credenciales, reputación, membresías personales. Se logra bloqueando la transferencia, como en el proyecto de entradas." },
      { et: "La tensión que trae", linea: C.rojo, color: C.rojo, texto: "Si es intransferible y la persona pierde su billetera, pierde su credencial. Y una credencial permanente en una cadena pública choca con el derecho al olvido (Sesión 16). No hay respuesta fácil." },
      { y: 2.9, h: 2.5, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La discusión del bloque C", x: M, y: 5.55, w: CW, h: 1.15, texto: "Para el diploma de la USB: ¿ERC-721 transferible, ERC-1155, o SBT no transferible? No hay respuesta correcta única. Lo que se evalúa es el argumento.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.10 · lo que hay que llevarse del bloque A", titulo: "Seis ideas sobre NFTs", ic: "lista", tituloSize: 28 });
    const ideas = [
      "No fungible = único: importa CUÁL, no cuántos.",
      "ERC-721 para piezas únicas; ERC-1155 para muchos tipos y lotes.",
      "«El NFT» es la fila del contrato; «el archivo» vive fuera, casi siempre en IPFS.",
      "Una URL normal rompe la permanencia; IPFS direcciona por contenido y no se puede falsificar.",
      "IPFS no es gratis ni eterno: sin pinning, el archivo desaparece.",
      "Las regalías se declaran, no se garantizan: es el problema del control tras la entrega.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Laboratorio 11", sub: "Un diploma NFT con su metadata en IPFS, minteado en testnet y visible en un marketplace de prueba.", minutos: "APROXIMADAMENTE 85 MINUTOS · EN PAREJAS", ic: "martillo" });

  {
    const s = await D.lamina({ kicker: "B.1 · subir a IPFS", titulo: "Primero el archivo, después el token", ic: "red", tituloSize: 28 });
    D.pasos(s, [
      ["CUENTA DE PINNING", "Crear cuenta en Pinata (plan gratuito) u otro servicio de pinning."],
      ["SUBIR LA IMAGEN", "Un PNG de prueba del «diploma». Copiar su CID: ese es el ipfs:// de la imagen."],
      ["ESCRIBIR EL JSON", "El de A.6, con el CID de la imagen dentro. Sin datos personales reales."],
      ["SUBIR EL JSON", "Copiar su CID. Ese es el tokenURI que va al contrato."],
    ], { y: 1.9, alto: 0.82, gap: 0.12, anchoEt: 2.4, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El orden importa", x: M, y: 6.02 - 0.1, w: CW, h: 0.86, texto: "La imagen primero: su CID tiene que ir DENTRO del JSON antes de subir el JSON. Si cambian la imagen, cambia todo.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · el contrato", titulo: "DiplomaUSB: mintear con tokenURI", ic: "codigo", tituloSize: 28 });
    D.codigo(s, `function emitir(address a, string calldata uri)
    external onlyOwner returns (uint256 tokenId)
{
    tokenId = _siguienteId++;
    _safeMint(a, tokenId);
    _setTokenURI(tokenId, uri);       // el enlace a IPFS
    emit DiplomaEmitido(tokenId, a, uri);
}`, { x: M, y: 1.9, w: 7.4, h: 3.0, lang: "sol", size: 12 });
    D.lista(s, [
      "Hereda de ERC721 y ERC721URIStorage: casi todo es de OpenZeppelin.",
      "_setTokenURI guarda el enlace ipfs:// por token.",
      "El override de tokenURI y supportsInterface es obligatorio en v5.",
      "npx hardhat test test/s11: 7 pruebas verdes.",
    ], { x: M + 7.7, y: 1.9, w: CW - 7.7, h: 3.0, size: 12, gap: 7 });
    D.pasos(s, [
      ["DESPLEGAR Y VERIFICAR", "En Sepolia. Emitir un diploma con el tokenURI del JSON de IPFS."],
      ["VER EN EL MARKETPLACE", "Abrir el NFT en un marketplace de testnet (por ejemplo el de OpenSea para redes de prueba). Debe mostrar la imagen y los atributos leídos del JSON."],
    ], { y: 5.1, alto: 0.7, gap: 0.1, anchoEt: 3.4, size: 12 });
  }

  {
    const s = await D.lamina({ kicker: "B.3 · qué se entrega", titulo: "Evidencia del laboratorio 11", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["CIDs en IPFS", "El CID de la imagen y el del JSON, ambos accesibles por una puerta IPFS.", "25 %"],
      ["Contrato verificado", "DiplomaUSB en Sepolia con al menos un diploma emitido.", "30 %"],
      ["Visible en marketplace", "Captura del NFT mostrando imagen y atributos leídos del JSON.", "25 %"],
      ["Prueba de permanencia", "Explicar qué pasaría con el NFT si se borrara el pin. Un párrafo.", "20 %"],
    ], { y: 1.9, h: 3.1, colW: [2.6, 7.893, 1.6], size: 12 });
    D.parrafo(s, "El proyecto necesita sus contratos completos para el Avance 1 (Sesión 13): este laboratorio suele ser una pieza directa de él.", { y: 5.2, h: 0.55, size: 13, color: C.ocre });
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "Caso USB", sub: "Modelar el diploma de la universidad como credencial verificable, con las tres opciones sobre la mesa y sus intercambios.", minutos: "APROXIMADAMENTE 30 MINUTOS", ic: "escudo" });

  {
    const s = await D.lamina({ kicker: "C.1 · el debate", titulo: "Tres formas de modelar el mismo diploma", ic: "balanza", tituloSize: 26 });
    D.tabla(s, ["opción", "a favor", "en contra"], [
      ["ERC-721 transferible", "Simple, estándar, se ve en cualquier marketplace.", "Un diploma no debería venderse. Transferible es raro aquí."],
      ["ERC-1155", "Barato para muchos diplomas; un tipo por programa.", "Menos natural para algo estrictamente único por persona."],
      ["SBT no transferible", "Atado a la persona: es lo que un diploma es.", "Si pierde la billetera, pierde el título. Choca con el derecho al olvido."],
    ], { y: 1.9, h: 2.9, colW: [2.8, 4.6, 4.693], size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Trabajo de la sesión", x: M, y: 5.05, w: CW, h: 1.65, texto: "En equipos: elegir una opción y defenderla en tres minutos, nombrando explícitamente qué se sacrifica. No hay respuesta correcta única — se evalúa que el equipo reconozca el intercambio que asume, como en el alcance del proyecto del docente.", size: 13.5 });
  }

  await D.preguntaSemana({
    pregunta: "Busquen un NFT famoso y averigüen DÓNDE vive su imagen: ¿IPFS, Arweave, o un servidor normal? ¿Qué pasaría con ese NFT si la empresa detrás cerrara mañana?",
    trabajo: [
      "Entregar la evidencia del laboratorio 11.",
      "Avanzar los contratos del proyecto: deben estar completos para el Avance 1 (Sesión 13).",
      "TERMINAR la nivelación de React: la Sesión 12 construye una interfaz y la asume por completo.",
      "Crear cuenta en un proveedor RPC (Alchemy o Infura) para la Sesión 12.",
    ],
    notas: "Insistir en la nivelación de React: la S12 no enseña React, enseña a conectarlo a la cadena.",
  });

  await D.cierre({
    frase: "Ser dueño de un NFT es ser dueño de una fila en un contrato. Que signifique algo depende de dónde viva el archivo.",
    sub: "Ya saben construir contratos, tokens y NFTs. Falta lo que la gente de verdad ve: una interfaz. La Unidad III se cierra conectando todo a una pantalla.",
    proxima: "Sesión 12 · Web 3.0 · conectar el frontend a la cadena",
  });

  return D.guardar(path.join(__dirname, "Sesion-11-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
