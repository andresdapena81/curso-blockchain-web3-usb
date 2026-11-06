/* =====================================================================
   MAGISTRAL · Tokens e infraestructura Web3 · integra S10 + S11 + S13

   Clase magistral (teórica, sin laboratorio) del viernes 30 de octubre
   de 2026. La PRÁCTICA integrada va aparte, el viernes 6 de noviembre
   (lab en Hardhat local: una ficha ERC-20 se canjea por un diploma NFT
   intransferible, sin ETH ni red pública).

   Versión AMPLIADA: se reintegraron las láminas de desarrollo que se
   habían omitido (proceso EIP, interfaz pieza por pieza, conversiones,
   el patrón por dentro, carrera del approve y sus salidas, extensiones y
   trade-offs, Permit, señales de alerta y síntesis en el bloque A; el
   otro estándar, gas on-chain, CID calculado, pinning, Arweave, regalías,
   críticas y el SBT en código en el bloque B; números del no-escala,
   queryFilter, la decisión, dominio/nonce/vencimiento, phishing de firma,
   EIP-7702 y síntesis en el bloque C) más dos láminas nuevas de concepto.

   El contenido reutiliza, VERBATIM en código/tablas/cifras/notas, las
   láminas teóricas de build-sesion-10.js (bloque A), build-sesion-11.js
   (bloques A y C) y build-sesion-13.js (bloque A). Solo se renumeraron
   los kickers y se suavizó el lenguaje que daba por hecho laboratorio el
   mismo día.
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "MAGISTRAL · TOKENS E INFRAESTRUCTURA · S10·S11·S13", titulo: "Magistral · Tokens e Infraestructura Web3" });
  const { C, F, M, CW } = D;

  /* Fila de ideas numeradas (cierre de bloque). */
  function ideas(s, arr) {
    arr.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* ---------------------------------------------------------- apertura */
  await D.portada({
    kicker: "MAGISTRAL · UNIDAD III · WEB 3.0",
    titulo: "DE LA FICHA\nAL DIPLOMA,\nY SU ECOSISTEMA",
    sub: "Magistral que une tres temas: token fungible, token único e infraestructura que los vuelve una dApp. La práctica, el viernes 6.",
    palabra: "TOKENS",
    ic: "moneda",
    notas: "Magistral de hoy (viernes 30): teoría de tres sesiones en una. Gancho (2 min): casi todos han oído «token» y «NFT» como sinónimos de «cripto» o «arte caro». Hoy se ve que son dos estándares sobre una tabla de saldos, dónde vive de verdad lo que representan, y qué capa los conecta con una pantalla. La práctica —un lab en Hardhat local, sin ETH— es el viernes 6 de noviembre.",
  });

  await D.agenda({
    intro: "Hoy es clase magistral: la teoría de tres sesiones (S10, S11 y S13) en un solo hilo. No hay laboratorio hoy; la práctica integrada es el viernes 6 de noviembre.",
    bloques: [
      ["A", "TOKENS FUNGIBLES · ERC-20", "Qué es un estándar, la interfaz, approve/transferFrom, decimales, aprobaciones peligrosas, extensiones, Permit y tokenómica.", "~65 min"],
      ["B", "NO FUNGIBLES · NFT, IPFS Y EL CASO USB", "ERC-721/1155, tokenURI, dónde vive el archivo, IPFS, CID, pinning, regalías, casos serios y el diploma de la USB (SBT, habeas data).", "~70 min"],
      ["C", "INFRAESTRUCTURA DEL ECOSISTEMA", "Leer la historia, The Graph, ENS, firmas EIP-712, SIWE, abstracción de cuentas y dónde vive el frontend.", "~55 min"],
    ],
    notas: "Magistral densa: 65 + 70 + 55, más una pausa de 10 minutos entre B y C. Hoy no se toca código en máquina: todo lo que se explica se USA en la práctica del viernes 6 (un lab en Hardhat local donde una ficha ERC-20 se canjea por un diploma NFT intransferible, sin ETH ni red pública). Si falta tiempo, recortar las láminas de síntesis y la parte final del bloque C (es la más «de cultura»), nunca el B.",
  });

  await D.objetivo({
    objetivo: "Entender los estándares de token (ERC-20 y ERC-721/1155), dónde vive su metadata y la capa que conecta con una dApp.",
    preguntas: [
      "¿Por qué la interoperabilidad de un token depende de un estándar y no del mejor código?",
      "¿Dónde está «el NFT» y dónde está «el archivo», y por qué una URL normal rompe la promesa?",
      "¿Qué firma una billetera en EIP-712, y cómo se lee la historia de un contrato sin recorrer la cadena?",
      "¿En qué se parece «tener un token» a «tener un archivo», y qué los conecta con una pantalla?",
    ],
    ra: "RA3 · Programar contratos aplicando estándares de la industria · RA6 · Integrar una interfaz Web 3.0 con contratos on-chain.",
  });

  await D.glosario({
    items: [
      ["ERC / EIP", "Ethereum Request for Comments / Improvement Proposal", "Un EIP propone; cuando define una interfaz de aplicación, se le llama ERC. ERC-20 es el número 20."],
      ["Fungible", "intercambiable", "Cada unidad es idéntica a otra: un punto vale igual que cualquier otro. Como el dinero. Un NFT es lo contrario."],
      ["allowance", "autorización · approve", "Cuántos tokens de A puede mover un tercero C. La base de approve + transferFrom."],
      ["Decimales", "decimals", "Cuántas cifras minúsculas tiene el token. 18 es lo habitual. No hay coma flotante real."],
      ["tokenURI", "enlace a la metadata", "Función que devuelve DÓNDE está el JSON que describe un NFT. Es un texto, no el archivo."],
      ["CID · IPFS", "Content Identifier", "El identificador de IPFS: se calcula del contenido. Cambia un byte y cambia el CID."],
      ["SBT", "Soulbound Token · ERC-5192", "Token atado a una cuenta: no se puede transferir. Pensado para credenciales."],
      ["EIP-712 · SIWE", "firma tipada · login", "Firmar datos con tipos y un dominio; SIWE (ERC-4361) inicia sesión firmando texto, sin contraseña."],
    ],
    notas: "No leer el glosario: es la lámina para repasar. Las dos palabras que más se confunden hoy: «CID» (integridad) frente a «pinning» (disponibilidad), y creer que SIWE es EIP-712 (SIWE firma texto, ERC-191).",
  });

  /* =============================================================== A · TOKENS FUNGIBLES */
  await D.divisor({ letra: "A", titulo: "Tokens fungibles · ERC-20", sub: "ERC-20 son seis funciones y dos eventos. Que sean SIEMPRE los mismos es justo lo que hace que un token sirva fuera de su propio código.", minutos: "APROXIMADAMENTE 65 MINUTOS", ic: "moneda" });

  {
    const s = await D.lamina({ kicker: "A.1 · el concepto de fondo", titulo: "Fungible: cada unidad vale por igual", ic: "moneda", tituloSize: 27 });
    D.parrafo(s, "Fungibilidad es que una unidad se puede intercambiar por otra idéntica sin perder valor. Es lo que separa «dinero» de «cosa única», y decide cuál de los dos estándares de hoy le sirve a cada caso.", { y: 1.9, h: 0.85, size: 14.5 });
    D.tabla(s, ["ejemplo", "qué lo hace así", "la pregunta que tiene sentido"], [
      ["Un billete de 50 000 · un gramo de oro · un punto FUSB", "Toda unidad es idéntica e intercambiable.", "«¿cuánto tienes?»"],
      ["La entrada fila 7 asiento 12 · un diploma a tu nombre · la obra original", "Cada unidad es distinguible y única.", "«¿de quién es el número 7?»"],
    ], { y: 2.9, h: 2.0, colW: [5.8, 3.4, 2.893], size: 11 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Los dos estándares de hoy", x: M, y: 5.05, w: CW, h: 1.65, texto: "ERC-20 para lo fungible (bloque A) y ERC-721/1155 para lo único (bloque B). El mismo mecanismo —una tabla dentro de un contrato—, dos preguntas distintas: «cuántos» frente a «cuál».", size: 13 });
    s.addNotes("Gancho del bloque: pregunten a la clase si un pasaje de avión es fungible. Antes de asignar asiento, casi; después, no. La fungibilidad es una decisión de diseño, no una propiedad del objeto. Es la bisagra que une el bloque A (ERC-20) con el B (NFT).");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · qué es un EIP/ERC", titulo: "Un acuerdo, no una ley", ic: "documento", tituloSize: 29 });
    D.parrafo(s, "Un EIP (Ethereum Improvement Proposal) es una propuesta pública. Cuando define cómo deben hablar las aplicaciones entre sí, se le llama ERC. Nadie obliga a seguirlos; se siguen porque convienen.", { y: 1.9, h: 0.9, size: 14.5 });
    D.tabla(s, ["", "qué es", "ejemplo"], [
      ["EIP", "La propuesta, con su número y su discusión abierta.", "EIP-20, EIP-721, EIP-2612"],
      ["ERC", "Un EIP que fija una interfaz de aplicación (el «RC» de Request for Comments).", "ERC-20 = el EIP-20"],
      ["El número", "Orden de llegada de la propuesta. No hay jerarquía en el número.", "20 fue de los primeros"],
    ], { y: 2.95, h: 2.0, colW: [1.7, 6.6, 3.793], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Por qué esto importa hoy", x: M, y: 5.2, w: CW, h: 1.55, texto: "ERC-20 (EIP-20) lo propusieron Fabian Vogelsteller y Vitalik Buterin en noviembre de 2015. Está en estado «Final»: es un contrato social estable del que dependen billeteras, exchanges y todo DeFi. Programar contra un estándar Final es programar contra algo que no se va a mover bajo tus pies.", size: 13 });
    s.addNotes("⚠ Verificado: EIP-20, autores Fabian Vogelsteller y Vitalik Buterin, creado 19 nov 2015, estado Final (eips.ethereum.org/EIPS/eip-20). El repositorio de EIPs es la fuente. La palabra clave: interoperabilidad.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · cómo nace un estándar", titulo: "De una idea a «Final»: el proceso EIP", ic: "jerarquia", tituloSize: 26 });
    D.parrafo(s, "Un EIP no se aprueba por votación ni lo decreta una empresa. Avanza por estados públicos, definidos en el EIP-1, con discusión abierta y editores que revisan la forma, no el gusto.", { y: 1.85, h: 0.9, size: 14 });
    const est = [["IDEA", "se discute\nen foros"], ["DRAFT", "número y\ntexto formal"], ["REVIEW", "revisión\nde pares"], ["LAST CALL", "última ventana,\n~14 días"], ["FINAL", "estable:\nya no cambia"]];
    const w = (CW - 4 * 0.3) / 5;
    est.forEach((e, i) => {
      const x = M + i * (w + 0.3);
      D.nodo(s, { x, y: 2.95, w, h: 1.15, titulo: e[0], sub: e[1], fill: i === 4 ? C.blanco : C.superf, line: i === 4 ? C.violeta : C.tinta, subSize: 10.5 });
      if (i < 4) D.flecha(s, x + w, 3.52, x + w + 0.3, 3.52, C.tinta, 1.75);
    });
    D.parrafo(s, "Salidas laterales: «Stagnant» (6 meses sin actividad), «Withdrawn» (el autor la retira) y «Living» (documentos que nunca se congelan, como el propio EIP-1).", { y: 4.3, h: 0.6, size: 12.5, color: C.gris });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Ejemplo real y error típico", x: M, y: 5.1, w: CW, h: 1.65, texto: "EIP-20 recorrió ese camino y hoy está en «Final». El EIP-2612 (Permit) también. Error típico: citar un EIP en «Draft» como si fuera estándar. Antes de construir sobre un EIP, miren su estado en eips.ethereum.org: si es Draft o Review, la interfaz todavía puede cambiar bajo sus pies.", size: 12.5 });
    s.addNotes("⚠ Verificado en EIP-1 (eips.ethereum.org/EIPS/eip-1): estados Idea, Draft, Review, Last Call (fecha límite típicamente 14 días), Final, Stagnant (6+ meses inactivo), Withdrawn, Living. Tipos: Standards Track (Core, Networking, Interface, ERC), Meta, Informational. Preguntar: '¿quién decide que ERC-20 es el estándar?' Respuesta: nadie lo impone; se adopta porque todos lo implementan.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · la interfaz", titulo: "Seis funciones y dos eventos", ic: "codigo", tituloSize: 29 });
    D.codigo(s, `interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address cuenta) external view returns (uint256);
    function transfer(address a, uint256 monto) external returns (bool);

    function allowance(address dueno, address gastador) external view returns (uint256);
    function approve(address gastador, uint256 monto) external returns (bool);
    function transferFrom(address de, address a, uint256 monto) external returns (bool);

    event Transfer(address indexed de, address indexed a, uint256 monto);
    event Approval(address indexed dueno, address indexed gastador, uint256 monto);
}`, { x: M, y: 1.9, w: CW, h: 3.5, lang: "sol", size: 11 });
    D.parrafo(s, "Eso es todo. Un token ERC-20 es cualquier contrato que implemente exactamente estas firmas. OpenZeppelin ya lo hace, bien y auditado: nosotros no reescribimos nada de esto.", { y: 5.6, h: 0.9, size: 14 });
    s.addNotes("Señalar que 'indexed' en los eventos permite filtrar por dueño/gastador en el explorador (viene de la S6). Las seis firmas son EXACTAS: cambiar un nombre rompe la interoperabilidad.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · la interfaz pieza por pieza", titulo: "Qué hace cada función, y quién la llama", ic: "lista", tituloSize: 26 });
    D.tabla(s, ["función", "qué hace", "quién la llama", "el error típico"], [
      ["totalSupply()", "Cuántas unidades existen en total.", "Cualquiera (lectura).", "Leerla sin dividir por 10^decimals."],
      ["balanceOf(c)", "Cuánto tiene la cuenta c.", "Billeteras, exploradores.", "Creer que el saldo está en la billetera."],
      ["transfer(a, v)", "Mueve v de MÍ (msg.sender) hacia a.", "El dueño de los tokens.", "Mandar a la dirección del propio contrato: se pierden."],
      ["approve(g, v)", "Autoriza a g a mover hasta v de lo MÍO.", "El dueño, antes de usar un contrato.", "Aprobar de más «por comodidad»."],
      ["allowance(d, g)", "Cuánto le queda a g por mover de d.", "Contratos y apps.", "Olvidar que baja al gastarse."],
      ["transferFrom(d, a, v)", "g mueve v de d hacia a, dentro de lo aprobado.", "El gastador (un contrato).", "Llamarla sin approve previo: revierte."],
    ], { y: 1.9, h: 4.2, colW: [2.6, 3.6, 2.6, 3.293], size: 10.5 });
    D.parrafo(s, "Y dos eventos: Transfer (cada movimiento, incluidos acuñar y quemar, con la dirección cero) y Approval (cada autorización). Los exploradores reconstruyen los saldos leyendo esos eventos.", { y: 6.2, h: 0.6, size: 12, color: C.ocre });
    s.addNotes("Recorrer la tabla por columnas: primero 'qué hace', después 'quién la llama'. La clave: transfer usa msg.sender como origen; transferFrom usa un 'de' explícito y consume allowance. Acuñar emite Transfer desde address(0); quemar, Transfer hacia address(0) (así lo hace OZ en _update).");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · lo que NO es", titulo: "Un token no es una cuenta con monedas dentro", ic: "rejilla", tituloSize: 26 });
    D.parrafo(s, "El error mental más común: creer que cada usuario «tiene» tokens en su billetera. No es así.", { y: 1.9, h: 0.55, size: 14.5 });
    D.definicion(s, "mapping(address => uint256) private _balances;   // TODO el token es esta tabla", { x: M, y: 2.6, w: CW, h: 0.65, size: 12 });
    D.dosColumnas(s,
      { et: "Dónde vive el token", texto: "En UN contrato: la FichaUSB. Ese contrato guarda una tabla de saldos. Su billetera no contiene tokens: contiene la clave que autoriza a mover una fila de esa tabla." },
      { et: "Qué significa «transferir»", texto: "Restar de una fila y sumar a otra, dentro del mismo contrato. No se mueve nada de un lado a otro: se reescribe una tabla. Por eso una transferencia emite el evento Transfer." },
      { y: 3.5, h: 2.3, size: 13 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La consecuencia práctica", x: M, y: 5.9, w: CW, h: 0.9, texto: "Para que una billetera «vea» un token, hay que darle la dirección del contrato: no está en la billetera, está en el contrato.", size: 12.5 });
    s.addNotes("Este error mental se paga en la práctica del viernes 6: el estudiante despliega el token, no lo ve en MetaMask, y cree que falló. No falló: hay que IMPORTARLO con la dirección del contrato (un paso de la práctica).");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · ejemplo de estado", titulo: "La tabla de saldos, antes y después", ic: "rejilla", tituloSize: 27 });
    D.parrafo(s, "Todo el token son dos tablas: balances y allowances. Sigamos a Ana, a Beto y al contrato Canje (precio 25) a lo largo de cuatro operaciones. Cifras en FUSB; dentro del contrato, por 10¹⁸.", { y: 1.85, h: 0.9, size: 13.5 });
    D.tabla(s, ["operación", "Ana", "Beto", "tesorería", "allowance Ana→Canje", "totalSupply"], [
      ["0 · acunar(ana, 100)", "100", "0", "0", "0", "100"],
      ["1 · ana.transfer(beto, 30)", "70", "30", "0", "0", "100"],
      ["2 · ana.approve(canje, 25)", "70", "30", "0", "25", "100"],
      ["3 · canje.canjear()  (transferFrom)", "45", "30", "25", "0", "100"],
      ["4 · beto.burn(10)", "45", "20", "25", "0", "90"],
    ], { y: 2.9, h: 2.75, colW: [3.9, 1.3, 1.3, 1.6, 2.4, 1.593], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Qué hay que notar", x: M, y: 5.75, w: CW, h: 1.02, texto: "approve NO mueve tokens (fila 2): solo escribe en la tabla de allowances. Y solo acuñar y quemar cambian totalSupply.", size: 12.5 });
    s.addNotes("Hacerla en el tablero, fila por fila, preguntando a la clase la siguiente fila antes de mostrarla. Error típico: creer que approve 'aparta' o 'bloquea' los tokens: Ana podría gastarlos igual y el canje fallaría por saldo. Las cifras de las filas 0, 2 y 3 son exactamente las de la prueba ★ de test/s10 (100, approve 25, queda 75 y tesorería 25) salvo la transferencia a Beto, añadida aquí.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · decimales", titulo: "Por qué 1 token son 1 000 000 000 000 000 000", ic: "moneda", tituloSize: 26 });
    D.parrafo(s, "La EVM no tiene coma flotante (Sesión 5). Un token con 18 decimales guarda internamente enteros enormes, y la coma es pura presentación.", { y: 1.9, h: 0.7, size: 14.5 });
    D.tabla(s, ["lo que ve la persona", "lo que guarda el contrato (unidades mínimas)"], [
      ["1 FUSB", "1 000 000 000 000 000 000  (1 × 10¹⁸)"],
      ["0,5 FUSB", "500 000 000 000 000 000"],
      ["0,000000000000000001 FUSB", "1  (la unidad mínima, indivisible)"],
    ], { y: 2.75, h: 2.0, colW: [4.3, 7.793], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error de principiante", x: M, y: 4.95, w: CW, h: 1.85, texto: "Escribir acunar(ana, 100) pensando en 100 tokens, cuando la función espera unidades mínimas, acuña una fracción invisible (100 de 10¹⁸). Por eso el token recibe la cantidad EN TOKENS y multiplica por 10**decimals() adentro: la interfaz habla en tokens, el contrato en unidades mínimas. En ethers.js se usa parseUnits(\"1\", 18) para escribir y formatUnits(v, 18) para leer.", size: 12.5 });
    s.addNotes("⚠ Números verificados con ethers: 1 token = 1e18; 25 FUSB = 25·10^18 = 25000000000000000000; 0,5 = 5e17. Contraste útil: USDC usa 6 decimales, no 18 → 25 USDC = 25000000. No todos los tokens usan 18: siempre leer decimals().");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · conversiones calculadas", titulo: "parseUnits y formatUnits, con números reales", ic: "terminal", tituloSize: 25 });
    D.parrafo(s, "En JavaScript nunca se multiplica a mano por 10¹⁸: se usan dos funciones de ethers. parseUnits va de lo humano al contrato; formatUnits, del contrato a lo humano. Salidas reales, ejecutadas con ethers 6:", { y: 1.85, h: 0.9, size: 13.5 });
    D.codigo(s, `parseUnits("25", 18)        ->  25000000000000000000n   // el precio del Canje
parseUnits("0.1", 18)       ->  100000000000000000n
parseUnits("1000000", 18)   ->  1000000000000000000000000n   // el tope
parseUnits("1.5", 6)        ->  1500000n                 // un token de 6 decimales

formatUnits(123456789000000000000n, 18)  ->  "123.456789"
formatUnits(100n, 18)       ->  "0.0000000000000001"     // el error de A.8`, { x: M, y: 2.85, w: CW, h: 2.6, lang: "js", titulo: "ethers 6 · salida real", size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Tres errores típicos", x: M, y: 5.6, w: CW, h: 1.2, texto: "(1) Usar Number en vez de BigInt: 25e18 no cabe exacto en un Number de JavaScript. (2) Suponer 18 decimales en un token de 6. (3) Pasar un string con coma («0,5»): parseUnits exige punto decimal.", size: 12 });
    s.addNotes("⚠ Salidas calculadas con ethers 6 (node) en el repo de laboratorios, no de memoria. Number.MAX_SAFE_INTEGER ≈ 9·10^15, así que 25·10^18 pierde precisión si se usa Number: por eso ethers 6 devuelve bigint (el sufijo n). El último renglón es exactamente acunar(ana, 100) sin convertir: 100 unidades mínimas = 0,0000000000000001 FUSB.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · el patrón de aprobación", titulo: "Por qué transferir en dos pasos", ic: "llave", tituloSize: 28 });
    D.parrafo(s, "transfer mueve MIS tokens. Pero, ¿cómo deja un usuario que un CONTRATO —un exchange, un canje— mueva los suyos, sin entregarle su clave privada? Con una autorización previa y acotada.", { y: 1.9, h: 0.95, size: 14 });
    D.nodo(s, { x: M, y: 3.05, w: 3.5, h: 1.0, titulo: "1 · approve", sub: "Ana autoriza al canje\nhasta 25 fichas", fill: C.blanco, line: C.violeta, subSize: 11 });
    D.flecha(s, M + 3.5, 3.55, M + 4.3, 3.55, C.tinta, 2);
    D.nodo(s, { x: M + 4.3, y: 3.05, w: 3.7, h: 1.0, titulo: "2 · transferFrom", sub: "el canje retira 25,\nni una más", fill: C.blanco, line: C.naranja, subSize: 11 });
    D.flecha(s, M + 8.0, 3.55, M + 8.8, 3.55, C.tinta, 2);
    D.nodo(s, { x: M + 8.8, y: 3.05, w: CW - 8.8, h: 1.0, titulo: "allowance = 0", sub: "la autorización se gastó", fill: C.superf, subSize: 11 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Lo que hace seguro el patrón", x: M, y: 4.4, w: CW, h: 1.35, texto: "El contrato NUNCA puede mover más de lo aprobado. Verificado en el laboratorio: un segundo canje sin volver a aprobar revierte. La clave privada de Ana no sale nunca de su billetera.", size: 13 });
    D.parrafo(s, "Así funcionan todos los intercambios descentralizados: primero autorizas al contrato del DEX, después el DEX mueve tus tokens al hacer el swap.", { y: 5.9, h: 0.6, size: 13, color: C.ocre });
    s.addNotes("Verificado en test/s10 (★): con aprobación exacta el canje retira 25 y la allowance queda en 0; sin aprobación revierte con ERC20InsufficientAllowance; un segundo canje sin re-aprobar revierte. Es la tesis del bloque.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · el patrón por dentro", titulo: "Qué pasa exactamente en canjear()", ic: "codigo", tituloSize: 27 });
    D.codigo(s, `function canjear() external {
    // el Canje es msg.sender para la ficha: es el GASTADOR
    bool ok = ficha.transferFrom(msg.sender, tesoreria, precio);
    if (!ok) revert TransferenciaFallida();

    premiosDe[msg.sender] += 1;
    emit Canjeado(msg.sender, precio);
}`, { x: M, y: 1.9, w: 7.3, h: 2.9, lang: "sol", size: 11 });
    D.lista(s, [
      "Ana llama canjear(): para el Canje, msg.sender = Ana.",
      "El Canje llama a la ficha: para la ficha, msg.sender = el Canje.",
      "La ficha revisa allowance[Ana][Canje] ≥ 25, la descuenta y mueve 25 de Ana a la tesorería.",
      "Si no alcanza, revierte TODO: no hay premio sin pago.",
    ], { x: M + 7.55, y: 1.9, w: CW - 7.55, h: 2.95, size: 12, gap: 6 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error típico de quien lo programa", x: M, y: 5.0, w: CW, h: 1.75, texto: "Escribir ficha.transferFrom(tesoreria, msg.sender, precio) —al revés—, o usar ficha.transfer(tesoreria, precio): eso intentaría mover los tokens DEL CANJE, que no tiene ninguno. El «de» de transferFrom es el usuario; quien gasta la autorización es el contrato que hace la llamada. Tampoco hace falta un require sobre la allowance: transferFrom ya revierte con ERC20InsufficientAllowance.", size: 12 });
    s.addNotes("Ejemplo conceptual de los DOS msg.sender distintos en la misma transacción: esa es la idea difícil. Dibujar la cadena Ana → Canje → FichaUSB en el tablero. Lo escribirán en la práctica del viernes 6. Error de OZ 5 verificado en test/s10: ERC20InsufficientAllowance.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · el riesgo del patrón", titulo: "Aprobaciones ilimitadas: comodidad peligrosa", ic: "alerta", tituloSize: 26 });
    D.parrafo(s, "Muchas aplicaciones piden aprobar una cantidad gigante «para no molestar otra vez». Es cómodo, y es el origen de robos enormes.", { y: 1.9, h: 0.6, size: 14.5 });
    D.dosColumnas(s,
      { et: "Qué pasa", linea: C.rojo, color: C.rojo, texto: "Si apruebas una cantidad ilimitada a un contrato, y ese contrato resulta malicioso o es hackeado más adelante, puede vaciar TODO tu saldo de ese token cuando quiera. La autorización sigue viva hasta que la revoques." },
      { et: "Qué hacer", texto: "Aprobar solo lo necesario para la operación. Revisar y revocar aprobaciones viejas (hay herramientas para verlas todas). Desconfiar de una app que pide aprobación ilimitada sin explicarlo." },
      { y: 2.6, h: 2.15, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "El caso real · Badger DAO, diciembre de 2021", x: M, y: 4.9, w: CW, h: 1.85, texto: "El front-end de Badger DAO fue comprometido (un script malicioso inyectado vía Cloudflare) y pedía a los usuarios firmar aprobaciones ILIMITADAS. Unas 500 billeteras aprobaron; el atacante usó transferFrom y drenó del orden de 120 millones de dólares. El contrato estaba bien: el robo entró por una aprobación excesiva que la gente firmó sin mirar. Regla: se entrega la aprobación más pequeña que sirva, y se revoca poniendo la allowance en cero.", size: 12.5 });
    s.addNotes("⚠ Verificado: Badger DAO, 2 dic 2021, ~120 M USD. Script inyectado por Cloudflare en el front-end pedía approve ilimitado; ~500 wallets firmaron; el atacante usó transferFrom (coindesk, halborn). Es el caso REAL que exige el encargo para las aprobaciones ilimitadas. Herramientas de revocación: revoke.cash, y el 'Token Approvals' del explorador.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · la carrera del approve", titulo: "Cambiar una aprobación de 50 a 20", ic: "reloj", tituloSize: 27 });
    D.parrafo(s, "El propio EIP-20 advierte de un riesgo de carrera. Ana aprobó 50 a Beto (un gastador) y decide bajarlo a 20. Parece inofensivo. Pero su transacción pasa por el mempool, a la vista (Sesión 9):", { y: 1.85, h: 0.9, size: 13.5 });
    D.pasos(s, [
      ["ANA ENVÍA approve(beto, 20)", "Su transacción queda pendiente en el mempool. La allowance todavía vale 50."],
      ["BETO LA VE Y SE ADELANTA", "Envía transferFrom(ana, beto, 50) con más gas: entra ANTES. Se lleva los 50 viejos."],
      ["SE CONFIRMA LA DE ANA", "approve escribe 20 (no resta: SOBRESCRIBE). Beto tiene una allowance nueva de 20."],
      ["BETO GASTA OTRA VEZ", "transferFrom(ana, beto, 20). Total: 70. Ana quería autorizar como máximo 50."],
    ], { y: 2.85, alto: 0.62, gap: 0.1, anchoEt: 3.4, size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La idea llana", x: M, y: 5.75, w: CW, h: 1.02, texto: "approve no dice «cambia de 50 a 20»; dice «ahora son 20», sin saber cuánto se gastó ya.", size: 12.5 });
    s.addNotes("⚠ Verificado: el EIP-20 documenta este vector y recomienda que la UI ponga la allowance en 0 antes de cambiarla a otro valor para el mismo gastador; el contrato no lo obliga, por compatibilidad hacia atrás (eips.ethereum.org/EIPS/eip-20). Cifras del ejemplo: 50 + 20 = 70. Conecta con 'el costo del estándar' de A.2: el defecto lo heredan todos los tokens.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · las salidas", titulo: "Cómo cambiar una aprobación sin regalar", ic: "escudo", tituloSize: 27 });
    D.tabla(s, ["opción", "cómo funciona", "trade-off"], [
      ["Pasar por 0", "approve(g, 0), confirmar, mirar cuánto gastó g, y recién entonces approve(g, M).", "Dos transacciones, pero decides M sabiendo lo gastado. Lo recomienda el EIP-20."],
      ["increase / decreaseAllowance", "Sumar o restar a la allowance en vez de sobrescribirla.", "Existían en OpenZeppelin 4. Se QUITARON de ERC20 en OZ 5 (no son del estándar y se usaron en phishing)."],
      ["SafeERC20 (lado del contrato)", "forceApprove y safeIncreaseAllowance, para contratos que aprueban a otros.", "Es una librería para quien LLAMA al token, no una función del token."],
      ["Aprobar exacto y a tiempo", "Aprobar solo lo que se va a gastar, justo antes de usarlo (o con Permit).", "La allowance vive poco y vale poco: casi nada que correr."],
    ], { y: 1.9, h: 3.55, colW: [2.9, 4.8, 4.393], size: 10.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico: copiar un tutorial viejo", x: M, y: 5.55, w: CW, h: 1.25, texto: "Muchos tutoriales llaman token.increaseAllowance(...). Con OpenZeppelin 5.6.1 (el del curso) eso no compila: la función ya no existe en ERC20.", size: 12 });
    s.addNotes("⚠ Verificado: (1) en node_modules/@openzeppelin/contracts 5.6.1, ERC20.sol no tiene increaseAllowance/decreaseAllowance; SafeERC20 trae safeIncreaseAllowance, safeDecreaseAllowance y forceApprove. (2) OZ 5.0 (oct 2023) las quitó por no ser parte del EIP-20 y por su uso en phishing (changelog de OpenZeppelin, issue #4583). Pasar por 0 es justo lo que harán al revocar en la práctica del viernes 6.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · el catálogo de extensiones", titulo: "Qué añade cada pieza de OpenZeppelin", ic: "rejilla", tituloSize: 25 });
    D.tabla(s, ["extensión", "qué añade", "cuándo usarla"], [
      ["ERC20Burnable", "burn y burnFrom: destruir tokens propios o aprobados.", "Puntos que se canjean o retiran de circulación."],
      ["ERC20Capped", "Un tope máximo de emisión que nunca se supera.", "Cuando prometes escasez: oferta con techo."],
      ["ERC20Pausable", "Congelar todas las transferencias ante una emergencia.", "Si necesitas un «freno» (con su propio riesgo de centralización)."],
      ["ERC20Permit (EIP-2612)", "Aprobar con una FIRMA fuera de la cadena, sin transacción de approve.", "Mejor experiencia: una sola transacción hace todo."],
    ], { y: 1.9, h: 3.4, colW: [3.0, 5.2, 3.893], size: 11 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Componer, no reescribir", x: M, y: 5.45, w: CW, h: 1.3, texto: "Se heredan las que se necesitan y se combinan. Cada una está auditada por separado. La habilidad no es escribir un ERC-20 desde cero —eso es un antipatrón— sino elegir y componer las extensiones correctas para tu problema.", size: 12.5 });
    s.addNotes("Pausable en OZ v5 vive en utils/. ERC20Permit exige nombrar el token en el constructor del permit y trae DOMAIN_SEPARATOR (EIP-712). No hace falta implementar Permit hoy; sí saber que existe y qué resuelve.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · cada extensión tiene su precio", titulo: "Burnable, Capped y Pausable: los trade-offs", ic: "balanza", tituloSize: 24 });
    D.tabla(s, ["extensión", "lo que ganas", "lo que cuesta o arriesga", "ejemplo en FichaUSB"], [
      ["Burnable", "Sacar unidades de circulación: canjes, retiros, deflación.", "La quema es irreversible; burnFrom exige allowance (otra aprobación que vigilar).", "Ana quema 40 → balance y totalSupply bajan 40."],
      ["Capped", "Escasez creíble: nadie puede emitir por encima del tope, ni el dueño.", "Si el tope es muy bajo, el proyecto se queda sin emisión. Cambiarlo exige otro contrato.", "Tope 1 000 000: acuñar 1 más revierte con ERC20ExceededCap."],
      ["Pausable", "Un freno de emergencia: congelar todas las transferencias.", "Quien tiene el freno puede congelar el dinero de todos: es poder centralizado.", "FichaUSB NO la usa, a propósito: no hay freno que abusar."],
    ], { y: 1.9, h: 3.6, colW: [1.9, 3.3, 3.8, 3.093], size: 10.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico con Capped", x: M, y: 5.65, w: CW, h: 1.12, texto: "Creer que el tope cuenta lo acuñado en la historia. Cuenta el suministro VIVO: si se queman 10 con el tope lleno, se pueden volver a acuñar 10. Lo demuestra la prueba ★ «quemar libera espacio bajo el tope».", size: 12 });
    s.addNotes("Verificado en test/s10: ERC20ExceededCap al acuñar sobre el tope, y la prueba ★ de quemar y re-acuñar. En OZ 5, ERC20Pausable sobrescribe _update con whenNotPaused (verificado en node_modules). Preguntar: '¿pondrían Pausable en el token de su proyecto? ¿Quién tendría el freno?'.");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · aprobar con una firma", titulo: "EIP-2612 Permit: un paso menos", ic: "documento", tituloSize: 27 });
    D.parrafo(s, "El patrón clásico exige DOS transacciones: aprobar y luego usar. Permit deja aprobar con una FIRMA fuera de la cadena, que el contrato verifica al usarla. El usuario firma gratis; una sola transacción hace todo.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "Sin Permit", items: ["Transacción 1: approve (cuesta gas).", "Transacción 2: la operación (cuesta gas).", "Dos confirmaciones en la billetera."] },
      { et: "Con Permit (EIP-2612)", items: ["Una firma fuera de la cadena (gratis, sin gas).", "Transacción única: la operación incluye la aprobación.", "La firma usa EIP-712, que veremos en el bloque C."] },
      { y: 3.05, h: 2.1, size: 12.5 });
    D.parrafo(s, "OpenZeppelin lo trae en la extensión ERC20Permit. Lo propuso Martin Lundfall en 2020, es estándar «Final», y hoy lo usan casi todos los tokens grandes. En el proyecto es opcional, pero mejora mucho la experiencia.", { y: 5.35, h: 0.8, size: 13, color: C.ocre });
    s.addNotes("⚠ Verificado: EIP-2612, autor Martin Lundfall, creado 13 abr 2020, Final. Firma permit(owner, spender, value, deadline, v, r, s); depende de EIP-712 (eips.ethereum.org/EIPS/eip-2612). EIP-712 es firma de datos estructurados, tema del bloque C.");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · Permit paso a paso", titulo: "El flujo de una aprobación firmada", ic: "llave", tituloSize: 27 });
    D.pasos(s, [
      ["ANA FIRMA, SIN GAS", "Su billetera muestra un mensaje estructurado (EIP-712): dueño, gastador, valor, nonce y fecha límite. Firma fuera de la cadena."],
      ["LA APP RECIBE LA FIRMA", "La firma (v, r, s) viaja a la aplicación. Todavía no ha pasado nada en la cadena."],
      ["UNA SOLA TRANSACCIÓN", "El contrato llama token.permit(ana, gastador, valor, deadline, v, r, s) y, a continuación, transferFrom."],
      ["EL TOKEN VERIFICA", "Recupera quién firmó, compara con ana, revisa el deadline y consume el nonce: la misma firma no se puede reusar."],
    ], { y: 1.9, alto: 0.72, gap: 0.08, anchoEt: 3.1, size: 11.5 });
    D.dosColumnas(s,
      { et: "Si algo no cuadra", texto: "Firma vencida: ERC2612ExpiredSignature. Firmante distinto del dueño: ERC2612InvalidSigner. El DOMAIN_SEPARATOR ata la firma a esa red y a ese contrato." },
      { et: "El trade-off", linea: C.rojo, color: C.rojo, texto: "Firmar un permit ES aprobar, aunque no cueste gas. «Es gratis, solo una firma» es justo lo que usa el phishing: se lee el gastador y el valor antes de firmar." },
      { y: 5.1, h: 1.7, size: 11.5 });
    s.addNotes("⚠ Verificado en OZ 5.6.1 (ERC20Permit.sol): errores ERC2612ExpiredSignature(deadline) y ERC2612InvalidSigner(signer, owner), nonces(owner) y DOMAIN_SEPARATOR(). Firma del EIP-2612: permit(owner, spender, value, deadline, v, r, s). La construcción de la firma EIP-712 se ve en el bloque C; hoy basta el flujo.");
  }

  {
    const s = await D.lamina({ kicker: "A.19 · dos diseños contrastados", titulo: "El mismo código, dos intenciones", ic: "balanza", tituloSize: 28 });
    D.parrafo(s, "Los dos tokens siguientes son ERC-20 perfectamente válidos, heredados de OpenZeppelin. Lo que los separa no es la calidad del código: es a quién le sirven las reglas.", { y: 1.85, h: 0.65, size: 14 });
    D.tabla(s, ["decisión", "A · sostenible (FichaUSB)", "B · extractivo (ejemplo ilustrativo)"], [
      ["Suministro", "Tope fijo de 1 000 000, visible en cap().", "Sin tope: mint() del dueño sin límite."],
      ["Emisión", "El organizador acuña por asistencia, a la vista (eventos Transfer).", "El dueño acuña cuando quiere, sin regla pública."],
      ["Distribución", "Se reparte a quien participa; el equipo no se queda un lote.", "90 % preasignado al equipo, sin vesting."],
      ["Quema", "Cualquiera quema lo suyo al canjear un premio.", "Sin quema; o el dueño quema saldos AJENOS."],
      ["Poderes especiales", "Ninguno más allá de acuñar bajo el tope.", "Pausa, lista negra y comisión de venta que el dueño cambia a su antojo."],
    ], { y: 2.6, h: 3.1, colW: [2.3, 4.9, 4.893], size: 10.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta que decide", x: M, y: 5.8, w: CW, h: 1.0, texto: "¿Quién puede cambiar las reglas después de que tú compraste o recibiste el token?", size: 12.5 });
    s.addNotes("El diseño B es ilustrativo, construido a propósito para el contraste; no describe un proyecto real concreto. Hacer la comparación columna por columna preguntando '¿a quién beneficia esta regla?'. Error típico: pensar que 'extractivo' significa 'código con bugs'. No: puede estar impecablemente escrito.");
  }

  {
    const s = await D.lamina({ kicker: "A.20 · señales de alerta", titulo: "Cómo leer un token antes de confiar en él", ic: "lupa", tituloSize: 26 });
    D.parrafo(s, "Todo esto se puede verificar en el explorador, con el código verificado delante. Verificar en vez de creer (la tesis del curso) aplicado a tokens:", { y: 1.85, h: 0.65, size: 14 });
    D.tabla(s, ["señal de alerta", "cómo se ve en el código o en la cadena"], [
      ["El dueño imprime sin tope", "Una función de mint con onlyOwner y sin cap(), o con un cap que el dueño cambia."],
      ["Concentración inicial", "Los primeros eventos Transfer desde 0x0 van casi todos a pocas direcciones."],
      ["Sin vesting", "El equipo recibe todo el día uno, sin contrato que libere por partes."],
      ["Poderes de congelar o confiscar", "Pausable, listas negras o funciones que mueven saldos ajenos en manos de una sola llave."],
      ["Código no verificado", "Si no se puede leer el código en el explorador, no hay nada que auditar: se descarta."],
    ], { y: 2.6, h: 3.1, colW: [3.6, 8.493], size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.8, w: CW, h: 1.0, texto: "Juzgar el token por el sitio web o por el precio. Se juzga por el contrato y por la distribución real en la cadena.", size: 12.5 });
    s.addNotes("Ejercicio opcional si hay tiempo: abrir en el explorador la FichaUSB de referencia y revisar las cinco señales en vivo. Conecta con la S14 (DeFi) y la S16 (regulación).");
  }

  {
    const s = await D.lamina({ kicker: "A.21 · lo que hay que llevarse del bloque A", titulo: "Seis ideas sobre tokens", ic: "lista", tituloSize: 28 });
    ideas(s, [
      "Un token vale por cumplir el estándar (EIP-20), no por tener el mejor código.",
      "Todo el token es una tabla de saldos dentro de UN contrato.",
      "Se hereda y se COMPONE de OpenZeppelin; casi nada se escribe a mano.",
      "No hay decimales reales: la interfaz habla en tokens, el contrato en unidades mínimas.",
      "approve + transferFrom deja mover tus tokens sin tu clave, y solo lo aprobado; ilimitado es peligroso.",
      "La tokenómica es una decisión ética además de técnica: repartir y limitar, o concentrar.",
    ]);
    s.addNotes("Cierre del bloque A. La idea 5 (aprobaciones ilimitadas, caso Badger) y la 6 (tokenómica) son las que más pesan en el proyecto.");
  }

  /* =============================================================== B · NO FUNGIBLES */
  await D.divisor({ letra: "B", titulo: "No fungibles · NFT, IPFS y el caso USB", sub: "Comprar un NFT casi nunca es comprar una imagen. Es comprar una fila en un contrato que apunta a una imagen. Dónde apunta lo cambia todo.", minutos: "APROXIMADAMENTE 70 MINUTOS", ic: "imagen" });

  {
    const s = await D.lamina({ kicker: "B.1 · de dónde venimos", titulo: "Un billete cualquiera, o esta entrada exacta", ic: "rejilla", tituloSize: 26 });
    D.dosColumnas(s,
      { et: "Fungible · ERC-20 (bloque A)", texto: "Cada unidad es idéntica e intercambiable. Mi FUSB vale igual que tu FUSB. Solo importa CUÁNTOS tienes. Como el dinero: da igual qué billete de 50 000 te entreguen." },
      { et: "No fungible · ERC-721", texto: "Cada token es único, con identidad propia. Importa CUÁL tienes. Una entrada con asiento asignado, un diploma, un título de propiedad: no se cambian uno por otro." },
      { y: 1.9, h: 2.45, size: 13 });
    D.definicion(s, "ERC-20:  balanceOf(ana) = 30 FUSB      ·      ERC-721:  ownerOf(7) = ana", { x: M, y: 4.6, w: CW, h: 0.62, size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error de concepto típico", x: M, y: 5.42, w: CW, h: 1.28, texto: "«No fungible» no significa «valioso» ni «artístico». Significa solo que cada unidad tiene identidad. Un NFT puede no valer nada y un token fungible puede valer mucho.", size: 12.5 });
    s.addNotes("Pregunta rápida (1 min): ¿un pasaje de avión es fungible? Antes de asignar asiento, casi; después, no. La fungibilidad es una decisión de diseño, no una propiedad del objeto. Conecten con el bloque A: el ERC-20 pregunta «cuántos»; aquí se pregunta «de quién es el número 7».");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · identidad única, en el estado del contrato", titulo: "Un NFT es una fila en una tabla", ic: "rejilla", tituloSize: 28 });
    D.parrafo(s, "Por dentro, un ERC-721 es poco más que dos diccionarios. Este es el estado real de nuestro DiplomaUSB después de emitir dos diplomas en la práctica del viernes 6:", { y: 1.85, h: 0.65, size: 14 });
    D.tabla(s, ["tokenId", "ownerOf(tokenId)", "tokenURI(tokenId)"], [
      ["1", "0x7099…79C8  (Ana)", "ipfs://bafkrei…/1.json"],
      ["2", "0x3C44…93BC  (Beto)", "ipfs://bafkrei…/2.json"],
      ["3", "— revierte: ERC721NonexistentToken(3)", "— revierte"],
    ], { y: 2.65, h: 1.75, colW: [1.6, 4.9, 5.593], size: 12 });
    D.dosColumnas(s,
      { et: "Qué es «tener» el NFT", texto: "Que tu dirección aparezca en la columna ownerOf. Nada más. Transferirlo es cambiar esa celda, con tu firma." },
      { et: "Qué NO está en la tabla", texto: "La imagen, el nombre, la descripción. Solo hay un texto que dice dónde buscarlos: el tokenURI." },
      { y: 4.6, h: 2.1, size: 13 });
    s.addNotes("Los valores de la tabla son los de la práctica (red local de Hardhat, cuentas #1 y #2). Hagan notar la fila 3: consultar un token que no existe no devuelve «nadie»: revierte. Lo prueba el test «consultar el dueño de un token inexistente revierte».");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · la interfaz ERC-721", titulo: "Las funciones que todo NFT tiene", ic: "codigo", tituloSize: 28 });
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
    const s = await D.lamina({ kicker: "B.4 · el otro estándar", titulo: "ERC-1155: muchos tipos en un contrato", ic: "capas", tituloSize: 27 });
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
    const s = await D.lamina({ kicker: "B.5 · cómo elegir", titulo: "ERC-721 frente a ERC-1155", ic: "balanza", tituloSize: 28 });
    D.tabla(s, ["criterio", "ERC-721", "ERC-1155"], [
      ["Unidad", "Un token único por id.", "Un id con N copias (N puede ser 1)."],
      ["Saldo", "ownerOf(id) → una dirección.", "balanceOf(cuenta, id) → una cantidad."],
      ["Transferir varios", "Uno por llamada.", "Por lotes: muchos ids en una transacción."],
      ["Caso típico", "Diploma, obra única, título.", "Ítems de juego, entradas por categoría."],
      ["Soporte en exploradores", "Universal.", "Amplio, algo menor."],
    ], { y: 1.85, h: 3.25, colW: [2.7, 4.6, 4.793], size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La regla práctica", x: M, y: 5.3, w: CW, h: 1.4, texto: "¿Cada ítem tiene historia propia (quién lo tuvo, cuándo)? ERC-721. ¿Hay muchas copias idénticas de pocos tipos, o se mueven inventarios en lote? ERC-1155. Si dudan, empiecen por 721: es el más simple de explicar y de auditar.", size: 12.5 });
    s.addNotes("No den todavía la respuesta para el diploma: es el debate del caso USB, al final de este bloque. Solo planten la pregunta: ¿un diploma es una pieza con historia propia o una copia de un «tipo» (el programa)?");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · tokenURI y el esquema JSON", titulo: "La ficha que leen exploradores y billeteras", ic: "documento", tituloSize: 25 });
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
    s.addNotes("El JSON de la lámina es el mismo que usa la guía de la práctica. Pregunta: ¿quién decide qué campos se muestran? El explorador o la billetera, no la cadena. Por eso «attributes» funciona: es un acuerdo del ecosistema, no del protocolo.");
  }

  {
    const s = await D.lamina({ kicker: "B.7 · la distinción clave", titulo: "«El NFT» no es «el archivo»", ic: "imagen", tituloSize: 29 });
    D.nodo(s, { x: M, y: 2.0, w: 3.3, h: 1.35, titulo: "EN LA CADENA", sub: "ownerOf(1) = ana\ntokenURI(1) = ipfs://…json", fill: C.blanco, line: C.naranja, subSize: 11 });
    D.flecha(s, M + 3.3, 2.67, M + 4.4, 2.67, C.tinta, 2);
    D.nodo(s, { x: M + 4.4, y: 2.0, w: 3.3, h: 1.35, titulo: "EN IPFS · EL JSON", sub: "name, description,\n\"image\": ipfs://…png", fill: C.superf, subSize: 11 });
    D.flecha(s, M + 7.7, 2.67, M + 8.8, 2.67, C.tinta, 2);
    D.nodo(s, { x: M + 8.8, y: 2.0, w: CW - 8.8, h: 1.35, titulo: "EN IPFS · LA IMAGEN", sub: "el archivo .png\ndel diploma", fill: C.superf, subSize: 11 });
    D.parrafo(s, "Tres saltos, dos redes. El contrato guarda al dueño y UN texto. Ese texto lleva al JSON; el JSON lleva a la imagen. Un explorador que «muestra el NFT» está haciendo estos tres saltos por ustedes.", { y: 3.65, h: 0.95, size: 14 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Lo que de verdad se compra", x: M, y: 4.8, w: CW, h: 1.9, texto: "Comprar un NFT es quedar en la celda ownerOf. Si la imagen desaparece, siguen siendo dueños de un token que apunta a la nada. Y tener el NFT no da derechos de autor sobre la imagen: eso lo decide una licencia, no el contrato. En la práctica del viernes 6 recorrerán los tres saltos a mano con el script leer-diploma.js.", size: 12.5 });
    s.addNotes("Esta es LA lámina del bloque. Si solo recuerdan una cosa, que sea esta. El script scripts/s11/leer-diploma.js imprime los tres saltos: cadena → JSON → imagen, y dice cuál falla si alguno falla.");
  }

  {
    const s = await D.lamina({ kicker: "B.8 · ¿y si la imagen va en la cadena?", titulo: "Medido: guardar bytes cuesta una fortuna", ic: "gas", tituloSize: 26 });
    D.parrafo(s, "Lo medimos en Hardhat con un contrato que solo hace datos = d (almacenamiento permanente en la cadena):", { y: 1.85, h: 0.6, size: 14 });
    D.tabla(s, ["qué se guarda", "gas medido", "comentario"], [
      ["1 KB de bytes", "770 543", "Ya es 15 veces una transferencia de FUSB (51 692)."],
      ["20 KB de bytes", "14 570 319", "Unos 730 000 de gas por KB."],
      ["Imagen de 100 KB", "≈ 73 millones (extrapolado)", "No cabe en un bloque de la red local de Hardhat (60 millones)."],
      ["El tokenURI (67 caracteres)", "173 850 · emitir completo", "Incluye crear el token, el dueño y el enlace."],
    ], { y: 2.55, h: 2.65, colW: [3.0, 3.1, 5.993], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La conclusión de ingeniería", x: M, y: 5.4, w: CW, h: 1.3, texto: "En la cadena va lo que necesita consenso: quién es el dueño y un compromiso con el contenido (el CID). El contenido pesado va afuera. Hay NFT «100 % on-chain» (SVG pequeños generados por código), pero son la excepción.", size: 12.5 });
    s.addNotes("Cifras medidas con Hardhat 3.16 / solc 0.8.34 (optimizador 200): contrato Almacen { bytes datos; function guardar(bytes calldata d) { datos = d; } }, contrato nuevo en cada medición y relleno de bytes 0x01 (sin ningún byte en cero, que es el caso realista de una imagen). Las dos de FUSB y del tokenURI salen de --gas-stats sobre test/s10 y test/s11. El 100 KB es extrapolación lineal. No conviertan a pesos: el precio del gas y del ETH cambia cada hora; el orden de magnitud es lo que importa.");
  }

  {
    const s = await D.lamina({ kicker: "B.9 · el problema de la permanencia", titulo: "Una URL normal rompe la promesa", ic: "alerta", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "tokenURI = https://…", linea: C.rojo, color: C.rojo, texto: "https://miuni.edu/diplomas/1.json\n\nQuien controla ese servidor puede cambiar el archivo mañana sin tocar la cadena. Si el dominio vence o el servidor cae, el NFT apunta a la nada. La cadena es inmutable; el servidor, no." },
      { et: "tokenURI = ipfs://CID", texto: "ipfs://bafkrei…\n\nEl enlace ES el hash del contenido. Si alguien cambia un byte, el CID ya no coincide: cualquiera lo detecta. Nadie puede sustituir el contenido a escondidas, ni siquiera quien lo subió." },
      { y: 1.9, h: 2.8, size: 12.5 });
    D.enunciado(s, "IPFS no hace eterno un archivo. Hace imposible cambiarlo sin que se note. Son dos garantías distintas.", { y: 4.95, h: 1.3, size: 17, line: C.naranja });
    s.addNotes("Error de concepto típico: «está en IPFS, entonces es permanente». Falso: IPFS da integridad (nadie lo altera), no disponibilidad (alguien tiene que guardarlo). La disponibilidad es el pinning de B.12. Pregunten: ¿qué garantía les da un https:// de la universidad? Ninguna de las dos, técnicamente; solo la confianza en la institución.");
  }

  {
    const s = await D.lamina({ kicker: "B.10 · cómo funciona IPFS", titulo: "Pedir por contenido, no por ubicación", ic: "red", tituloSize: 27 });
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
    s.addNotes("La última fila es la Sesión 2 aplicada: el hash como identificador que se autoverifica. Una puerta (gateway) como ipfs.io es un servidor HTTP normal que hace estos pasos por ustedes; cuando usan una puerta, vuelven a confiar en ese servidor, a menos que verifiquen el hash ustedes mismos. El CID se calcula del contenido: cambiar un byte cambia el CID entero (efecto avalancha de la S2); un CID de versión 1 empieza por «baf».");
  }

  {
    const s = await D.lamina({ kicker: "B.11 · un CID, calculado de verdad", titulo: "El CID es el hash, con una etiqueta delante", ic: "llave", tituloSize: 25 });
    D.codigo(s, `node scripts/s11/cid-raw.js --texto "hello world"
  sha256  : b94d27b9934d3e08a52e52d7da7dabfac484efe3...
  CID raw : bafkreifzjut3te2nhyekklss27nh3k72ysco7y32koao5eei66wof36n5e

--texto "Diploma USB - prueba 1" -> bafkreiez36qzdmqn6bh6gefu6wpky4dezu...
--texto "Diploma USB - prueba 2" -> bafkreicmjjso6teuztsxwcuwv4stofvsen...`, { x: M, y: 1.85, w: CW, h: 2.2, lang: "js", titulo: "salida real del script cid-raw.js", size: 10.5 });
    D.definicion(s, "CID v1 raw  =  \"b\" + base32( 01 · 55 · 12 · 20 · sha256(bytes) )     versión · raw · sha2-256 · 32 bytes", { x: M, y: 4.2, w: CW, h: 0.62, size: 10.5 });
    D.dosColumnas(s,
      { et: "Compruébenlo en vivo", texto: "https://ipfs.io/ipfs/bafkreifz…n5e devuelve «hello world». Nadie lo subió para esta clase: alguien en el mundo fijó esos mismos bytes y el CID coincide." },
      { et: "El error de concepto típico", linea: C.rojo, color: C.rojo, texto: "«Mismo archivo, mismo CID siempre.» No: Pinata puede dar un CID «bafybei…» para esos bytes porque los envuelve en otra estructura. Ambos son hash; cambia la receta." },
      { y: 5.0, h: 1.72, size: 11.5 });
    s.addNotes("Los tres CID de la lámina se calcularon con scripts/s11/cid-raw.js durante la preparación (verifiquen en vivo, tarda un segundo). La consulta a ipfs.io con el CID de «hello world» devolvió el texto exacto al preparar la clase. Los CID antiguos (versión 0) empiezan por «Qm»; los de versión 1 por «baf». Cambiar «1» por «2» en el texto cambia el CID entero: efecto avalancha de la Sesión 2.");
  }

  {
    const s = await D.lamina({ kicker: "B.12 · disponibilidad", titulo: "Pinning: alguien tiene que guardarlo", ic: "candado", tituloSize: 27 });
    D.parrafo(s, "Un nodo IPFS guarda lo que visita solo como caché y lo borra cuando necesita espacio. Un archivo sobrevive si algún nodo lo FIJA. Los servicios de pinning son empresas que fijan por ustedes.", { y: 1.85, h: 0.95, size: 14 });
    D.tabla(s, ["servicio", "plan gratuito anunciado (sep. 2026)", "para la práctica"], [
      ["Pinata", "1 GB, 500 archivos, una puerta propia.", "Opción principal. Subir como PÚBLICO."],
      ["Filebase", "5 GB, compartidos con su almacenamiento S3.", "Alternativa si Pinata falla."],
      ["IPFS Desktop", "Su propio nodo, gratis.", "Plan B: el archivo existe solo mientras su PC esté encendido."],
    ], { y: 2.95, h: 1.9, colW: [2.2, 5.3, 4.593], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Dos trampas que vimos al preparar la clase", x: M, y: 5.05, w: CW, h: 1.65, texto: "1) Pinata permite subir como «privado»: esos archivos NO se anuncian a la red y ninguna puerta pública los encuentra. 2) Las puertas públicas (ipfs.io, dweb.link) limitan consultas y a veces responden 429: prueben con la puerta de su propio servicio.", size: 12 });
    s.addNotes("Planes consultados en las páginas de precios de Pinata y Filebase en septiembre de 2026. ⚠ VERIFICAR ANTES DE DICTAR: que el registro gratuito siga sin pedir tarjeta. Regla: si un servicio pide tarjeta, NO la ponen; usan la alternativa o el plan B. El 429 de ipfs.io ocurrió de verdad en una prueba de preparación y a los minutos volvió a responder.");
  }

  {
    const s = await D.lamina({ kicker: "B.13 · otra forma de pagar la permanencia", titulo: "Servidor, IPFS o Arweave", ic: "balanza", tituloSize: 29 });
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
    const s = await D.lamina({ kicker: "B.14 · regalías", titulo: "EIP-2981: se declara, no se garantiza", ic: "moneda", tituloSize: 27 });
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
    const s = await D.lamina({ kicker: "B.15 · más allá del arte", titulo: "Casos donde la unicidad sí importa", ic: "diana", tituloSize: 27 });
    D.tabla(s, ["caso", "qué aporta el NFT", "el matiz honesto"], [
      ["Credenciales académicas", "Cualquiera verifica quién emitió qué, sin llamar a la universidad.", "¿Debería poder transferirse? El caso USB."],
      ["Trazabilidad (café, cacao)", "Cada lote con su historia pública e inalterable.", "El dato de entrada sigue dependiendo de un humano honesto."],
      ["Entradas a eventos", "Cada entrada es única; la reventa se acota por contrato.", "Es el proyecto del docente."],
      ["Licencias y membresías", "Acceso verificable y, si se quiere, transferible.", "A menudo ERC-1155 encaja mejor."],
      ["Activos reales (RWA)", "Un bien, un token, un dueño visible.", "Sin reconocimiento legal, el token no es el título."],
    ], { y: 1.85, h: 3.9, colW: [2.9, 4.6, 4.593], size: 11 });
    D.parrafo(s, "En todos sigue viva la pregunta de la Sesión 1: ¿hace falta una cadena, o basta una base de datos firmada por quien ya es la autoridad?", { y: 5.95, h: 0.75, size: 13, color: C.ocre });
    s.addNotes("RWA = real-world assets. Sean honestos con el último: en Colombia, un token no reemplaza la escritura pública ni el registro; un NFT de un lote no es el lote. Para credenciales, la ventaja real es verificar sin intermediario; la pregunta es si la universidad no podría firmar un PDF y ya.");
  }

  {
    const s = await D.lamina({ kicker: "B.16 · críticas honestas", titulo: "Lo que el mercado NFT hizo mal", ic: "bicho", tituloSize: 28 });
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
    const s = await D.lamina({ kicker: "B.17 · el caso USB · el debate", titulo: "Tres formas de modelar el mismo diploma", ic: "balanza", tituloSize: 26 });
    D.tabla(s, ["modelo", "a favor", "en contra"], [
      ["ERC-721 transferible", "Estándar, simple; cualquier explorador lo muestra.", "Un título se podría vender o regalar: el dueño del token no es el graduado."],
      ["ERC-1155 (un id por programa)", "Barato para cohortes grandes; un id = «Sistemas 2026».", "Las copias son idénticas: no distingue a una persona de otra del mismo programa."],
      ["SBT · ERC-5192", "No se transfiere: el token queda atado a la cuenta del graduado.", "Pierde la billetera, pierde el diploma; la universidad conserva poder de revocar."],
    ], { y: 1.85, h: 3.25, colW: [2.9, 4.4, 4.793], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "ERC-5192 en una línea", x: M, y: 5.3, w: CW, h: 1.4, texto: "Estándar Final: añade locked(tokenId) y los eventos Locked/Unlocked a un ERC-721. Si locked devuelve true, TODA función que mueva el token entre cuentas debe revertir. Interfaz ERC-165: 0xb45a3c0e.", size: 12.5 });
    s.addNotes("Texto de ERC-5192 verificado en eips.ethereum.org (estado Final). Nuestro DiplomaSBT lo implementa en ~10 líneas y lo prueban 9 pruebas (test/s11/DiplomaSBT.test.js), incluida la de «billetera perdida». Pregunta madura: si la universidad controla emisión y revocación, ¿la cadena aporta descentralización, o solo verificabilidad pública?");
  }

  {
    const s = await D.lamina({ kicker: "B.18 · el SBT, en código", titulo: "Un if en _update bloquea la transferencia", ic: "candado", tituloSize: 26 });
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
      "Reto opcional de la práctica: andamiaje/s11/DiplomaSBT.sol.",
    ], { x: M + 8.55, y: 1.85, w: CW - 8.55, h: 3.45, size: 12, gap: 9 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Lo que muestra la prueba «billetera perdida»", x: M, y: 5.5, w: CW, h: 1.2, texto: "La universidad revoca el token 1 y emite el 2 a la cuenta nueva. El 1 queda quemado para siempre. ¿Es eso un diploma «inmutable»? ¿Quién tiene el poder real?", size: 12.5 });
    s.addNotes("Dejen la pregunta abierta: es insumo para el debate. Respuesta madura: el SBT traslada el control de la persona a la institución emisora. Para un diploma eso quizá es correcto (la universidad ya es la autoridad), pero entonces la cadena aporta verificabilidad pública, no descentralización del poder.");
  }

  {
    const s = await D.lamina({ kicker: "B.19 · habeas data", titulo: "Ley 1581 de 2012: nada personal en cadena", ic: "escudo", tituloSize: 26 });
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
    const s = await D.lamina({ kicker: "B.20 · lo que hay que llevarse del bloque B", titulo: "Seis ideas sobre NFTs", ic: "lista", tituloSize: 28 });
    ideas(s, [
      "No fungible = con identidad: importa CUÁL, no cuántos. No significa «valioso».",
      "ERC-721 para piezas con historia propia; ERC-1155 para muchas copias de pocos tipos.",
      "«El NFT» es la celda ownerOf; el JSON y la imagen viven afuera, casi siempre en IPFS.",
      "IPFS garantiza integridad (el CID es el hash), no disponibilidad: eso es el pinning.",
      "Las regalías (EIP-2981) se declaran; forzarlas exige restringir transferencias.",
      "Firmar setApprovalForAll es entregar todos tus NFT de ese contrato. Leer antes de firmar.",
    ]);
    s.addNotes("Cierre del bloque B. Si solo recuerdan tres: el NFT es la celda ownerOf, IPFS da integridad no disponibilidad, y firmar setApprovalForAll entrega todo. Aquí va la pausa de 10 minutos antes del bloque C.");
  }

  /* =============================================================== C · INFRAESTRUCTURA */
  await D.divisor({ letra: "C", titulo: "Infraestructura del ecosistema", sub: "Un contrato y una pantalla bastan para una demo. Para que la use gente real faltan piezas: leer la historia, nombres legibles, firmas y cuentas amables.", minutos: "APROXIMADAMENTE 55 MINUTOS", ic: "red" });

  {
    const s = await D.lamina({ kicker: "C.1 · de qué trata este bloque", titulo: "La plomería que una dApp necesita", ic: "red", tituloSize: 27 });
    D.parrafo(s, "Con los bloques A y B ya saben escribir el contrato: el token fungible y el único. Pero un contrato solo no es una aplicación. Falta la plomería que lo vuelve usable para una persona de verdad.", { y: 1.9, h: 0.9, size: 14.5 });
    const items = [["LEER", "indexar lo que pasó"], ["FIRMAR", "identidad sin contraseña"], ["CUENTA", "abstracción de cuentas"], ["ALOJAR", "dónde vive el frontend"]];
    const w = (CW - 3 * 0.3) / 4;
    items.forEach((it, i) => {
      const x = M + i * (w + 0.3);
      D.nodo(s, { x, y: 3.0, w, h: 1.3, titulo: it[0], sub: it[1], fill: C.blanco, line: i % 2 ? C.violeta : C.naranja, subSize: 11 });
    });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Lo que tienen en común", x: M, y: 4.65, w: CW, h: 1.55, texto: "Ninguna de estas piezas cambia el contrato; todas cambian la experiencia de quien lo usa. Este bloque recorre las cuatro, en ese orden, y cierra con qué necesita un repositorio para que otro lo corra.", size: 13 });
    s.addNotes("Mapa del bloque C. La idea de fondo: la descentralización del contrato no basta; el usuario llega por un frontend, un RPC y a veces un indexador, y cada uno es una decisión. Enlaza con la tesis del curso: saber qué queda centralizado y decirlo con honestidad.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · el problema de leer la cadena", titulo: "El estado solo guarda el presente", ic: "grafico", tituloSize: 28 });
    D.parrafo(s, "Leer una variable como balanceOf es una llamada instantánea y gratis. Pero el producto pide otra cosa: «muéstrame todas las asistencias de Ana» o «las diez últimas transferencias». Y eso el contrato no lo sabe.", { y: 1.9, h: 0.95, size: 14.5 });
    D.dosColumnas(s,
      { et: "Lo que guarda el estado", items: ["El VALOR ACTUAL de cada variable: saldo de hoy, dueño de hoy.", "Cada escritura pisa la anterior: el valor viejo ya no está en el storage.", "Leerlo es barato: una llamada por dato."] },
      { et: "Dónde está la historia", items: ["En los LOGS de los recibos: cada emit deja un registro con el bloque y la transacción.", "Los logs no son accesibles desde el contrato: solo desde fuera.", "Filtrarlos exige pedir rangos de bloques al nodo."] },
      { y: 3.05, h: 2.35, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.6, w: CW, h: 1.12, texto: "«Guardo un arreglo con todo el historial en el contrato y lo leo desde la interfaz». Funciona con diez registros y se vuelve caro e ilegible con diez mil. La historia va en eventos; el estado guarda solo lo que el contrato necesita para decidir.", size: 12 });
    s.addNotes("Preguntar: ¿dónde queda el saldo que Ana tenía ayer? Respuesta: en ningún lado del storage; solo se puede reconstruir con los eventos Transfer. Conectar con la S6 (eventos) y la S5 (el log cuesta menos gas que el storage).");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · por qué no escala, con números", titulo: "Recorrer un año de bloques, a mano", ic: "grafico", tituloSize: 27 });
    D.parrafo(s, "Supongamos que la interfaz quiere el historial completo de un contrato que lleva un año desplegado. En Ethereum sale un bloque cada 12 segundos.", { y: 1.9, h: 0.6, size: 14.5 });
    D.cifra(s, "2 628 000", "bloques en un año: 365 × 24 × 3 600 ÷ 12. Todos hay que revisarlos buscando los logs del contrato.", { x: M, y: 2.7, w: 3.9, h: 1.95, size: 28, tsize: 11.5 });
    D.cifra(s, "263", "consultas eth_getLogs si el proveedor deja pedir 10 000 bloques por vez. En cada visita de cada usuario.", { x: M + 4.1, y: 2.7, w: 3.9, h: 1.95, size: 30, color: C.violeta, tsize: 11.5 });
    D.cifra(s, "0", "capacidad de ordenar, agregar o paginar en el nodo: eso lo tiene que hacer el navegador con todo en memoria.", { x: M + 8.2, y: 2.7, w: CW - 8.2, h: 1.95, size: 30, color: C.tinta, tsize: 11.5 });
    D.parrafo(s, "Cada proveedor de RPC limita el rango de bloques o el número de resultados por consulta, y cuenta las llamadas contra su plan gratuito. Lo que en local es instantáneo, en Sepolia o en la red principal se vuelve lento, caro o simplemente rechazado.", { y: 4.9, h: 0.9, size: 13.5 });
    D.parrafo(s, "La salida es indexar: leer los eventos UNA vez, guardarlos en una base de datos, y que la interfaz consulte esa base.", { y: 5.95, h: 0.6, size: 13.5, color: C.ocre });
    s.addNotes("Cálculo: 31 536 000 s / 12 = 2 628 000 bloques. 2 628 000 / 10 000 = 262,8 → 263 consultas. El límite de 10 000 es un ejemplo: cada proveedor fija el suyo y cambia con el plan; pedir que revisen el de su proveedor. Hoy la red principal va por el bloque ~26 millones (consultado el 17-sep-2026).");
  }

  {
    const s = await D.lamina({ kicker: "C.4 · la alternativa ligera", titulo: "Leer eventos con queryFilter", ic: "codigo", tituloSize: 28 });
    D.codigo(s, `// el evento de la práctica del viernes 6: tres campos indexed = tres «topics» filtrables
event AsistenciaRegistrada(address indexed estudiante, uint256 indexed sesion,
                           address indexed enviadaPor, uint256 nonce);

// ethers v6, desde la interfaz o un script
const filtro  = contrato.filters.AsistenciaRegistrada(ana);    // solo las de Ana
const eventos = await contrato.queryFilter(filtro, bloqueDespliegue, "latest");
for (const e of eventos) console.log(e.blockNumber, e.args.sesion, e.args.nonce);`, { x: M, y: 1.9, w: CW, h: 2.55, lang: "js", titulo: "del contrato a la consulta", size: 11 });
    D.dosColumnas(s,
      { et: "Cuándo basta", items: ["Pocos eventos y un solo contrato: un proyecto de curso.", "Empezar la búsqueda en el bloque del despliegue, no en 0.", "Filtrar por campos indexed: el nodo hace el trabajo."] },
      { et: "Cuándo ya no", linea: C.rojo, color: C.rojo, items: ["Miles de eventos o varios contratos a la vez.", "Hace falta ordenar, sumar o paginar.", "Cada usuario repetiría las mismas consultas al RPC."] },
      { y: 4.65, h: 2.08, size: 12 });
    s.addNotes("Máximo tres parámetros indexed por evento (el primer topic es la firma del evento). Lo no indexado se puede leer pero no filtrar en el nodo. Truco práctico: guardar en el README el bloque del despliegue para usarlo como inicio del rango. En la práctica, la prueba 'los eventos se leen después con queryFilter' hace exactamente esto.");
  }

  {
    const s = await D.lamina({ kicker: "C.5 · indexar de verdad", titulo: "The Graph: un subgrafo en tres archivos", ic: "red", tituloSize: 27 });
    D.nodo(s, { x: M, y: 1.95, w: 2.5, h: 1.15, titulo: "CONTRATO", sub: "emite eventos\nen cada bloque", fill: C.blanco, line: C.naranja, subSize: 10.5 });
    D.flecha(s, M + 2.55, 2.52, M + 3.05, 2.52, C.tinta, 2);
    D.nodo(s, { x: M + 3.1, y: 1.95, w: 3.0, h: 1.15, titulo: "INDEXADOR", sub: "corre sus mappings\ny guarda entidades", fill: C.superf, subSize: 10.5 });
    D.flecha(s, M + 6.15, 2.52, M + 6.65, 2.52, C.tinta, 2);
    D.nodo(s, { x: M + 6.7, y: 1.95, w: 2.6, h: 1.15, titulo: "API GRAPHQL", sub: "consultas con filtro,\norden y paginación", fill: C.superf, subSize: 10.5 });
    D.flecha(s, M + 9.35, 2.52, M + 9.85, 2.52, C.tinta, 2);
    D.nodo(s, { x: M + 9.9, y: 1.95, w: CW - 9.9, h: 1.15, titulo: "dAPP", sub: "una consulta\npor pantalla", fill: C.blanco, line: C.violeta, subSize: 10.5 });
    D.tabla(s, ["archivo", "qué dice"], [
      ["subgraph.yaml", "Qué contrato, en qué red, desde qué bloque y qué eventos escuchar (el manifiesto)."],
      ["schema.graphql", "Qué entidades se guardan: por ejemplo Asistencia { estudiante, sesion, bloque }."],
      ["mapping.ts", "Qué hacer con cada evento: crear o actualizar entidades. Se escribe en AssemblyScript."],
    ], { y: 3.35, h: 1.75, colW: [2.6, 9.493], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Estado actual, verificado", x: M, y: 5.3, w: CW, h: 1.42, texto: "Para pocos eventos basta leerlos con queryFilter desde la interfaz. Cuando hay volumen, filtros, orden o varias entidades, se indexa. El «hosted service» gratuito de The Graph se apagó el 12 de junio de 2024; hoy se publica en Subgraph Studio (plan gratuito: 100 000 consultas al mes).", size: 12 });
    s.addNotes("Fuentes verificadas el 17-sep-2026: thegraph.com/blog/sunsetting-hosted-service (fin del hosted service el 12-jun-2024) y thegraph.com/studio-pricing (100 000 consultas gratis al mes). Muchos tutoriales viejos todavía dicen 'despliega en el hosted service': ya no existe. Error típico: pensar que The Graph 'lee el storage'; solo ve eventos. Un contrato sin eventos es invisible para él. La regla del curso: usar la pieza más simple que resuelva — para un proyecto de curso casi siempre basta queryFilter.");
  }

  {
    const s = await D.lamina({ kicker: "C.6 · la decisión", titulo: "¿Cuál usar en su proyecto?", ic: "balanza", tituloSize: 29 });
    D.tabla(s, ["opción", "cuándo conviene", "qué cuesta", "qué centraliza"], [
      ["queryFilter en la interfaz", "Pocos eventos, un contrato, consultas simples.", "Nada extra; llamadas al RPC.", "Nada nuevo: el mismo RPC de siempre."],
      ["Subgrafo (The Graph)", "Muchos eventos, filtros, orden, varias entidades.", "Aprender GraphQL y AssemblyScript; consultas sobre el plan gratuito se pagan.", "Dependen de la red de indexadores y de Studio."],
      ["Indexador propio (script + base de datos)", "Necesidades muy específicas o datos fuera de la cadena.", "Operar un servidor y una base de datos.", "Todo: ustedes son el punto único."],
    ], { y: 1.9, h: 3.25, colW: [2.9, 3.3, 3.0, 2.893], size: 11 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Regla del curso", x: M, y: 5.35, w: CW, h: 1.37, texto: "Usen la pieza más simple que resuelva. Para el Avance 2 basta queryFilter en casi todos los proyectos. Si eligen un subgrafo, el README debe decir por qué queryFilter no alcanzaba: es una decisión de diseño que se defiende.", size: 12.5 });
    s.addNotes("Pregunta rápida al grupo: ¿alguno de sus proyectos necesita ordenar o paginar miles de registros? Normalmente ninguno. Dejar claro que un indexador propio es legítimo pero reintroduce el servidor central que la dApp quería evitar.");
  }

  {
    const s = await D.lamina({ kicker: "C.7 · nombres legibles", titulo: "ENS: vitalik.eth en vez de 0xd8dA…6045", ic: "termino", tituloSize: 26 });
    D.parrafo(s, "Una dirección de 42 caracteres no se puede verificar a ojo. ENS es un registro en cadena que asocia nombres a direcciones, como el DNS asocia dominios a IP. Resolverlo es una LECTURA en dos pasos.", { y: 1.9, h: 0.95, size: 14 });
    D.codigo(s, `const p = new ethers.JsonRpcProvider(URL_MAINNET);   // la URL, desde el keystore
await p.resolveName("vitalik.eth");
//  → 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045        (nombre → dirección)
await p.lookupAddress("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
//  → "vitalik.eth"                                     (dirección → nombre, «reverse»)`, { x: M, y: 3.0, w: CW, h: 1.95, lang: "js", titulo: "resuelto de verdad el 17-sep-2026, red principal", size: 11 });
    D.dosColumnas(s,
      { et: "Cómo funciona", texto: "El registro ENS dice qué contrato «resolver» atiende cada nombre; el resolver devuelve la dirección, o un contenthash para un sitio en IPFS." },
      { et: "Error típico", linea: C.rojo, color: C.rojo, texto: "Creer que el nombre es para siempre: los .eth se pagan por año (5 USD/año desde 5 letras) y, si vencen, tras 90 días de gracia otro los puede registrar." },
      { y: 5.12, h: 1.6, size: 11.5 });
    s.addNotes("Valores verificados en vivo con ethers contra la red principal el 17-sep-2026 (resolver 0x231b…8E63, contenthash ipfs://QmULSd…). Precio y período de gracia: docs.ens.domains/registry/eth. Seguridad: nombres parecidos (homoglifos) engañan; mostrar siempre también la dirección. ⚠ VERIFICAR ANTES DE DICTAR: en feb-2026 ENS anunció que ENSv2 se desplegará en la capa 1 (abandonó su L2 'Namechain'); revisar si ya migró y si cambia algo del flujo.");
  }

  {
    const s = await D.lamina({ kicker: "C.8 · firmar sin transaccionar", titulo: "Tres formas de firmar, tres riesgos", ic: "llave", tituloSize: 27 });
    D.parrafo(s, "En la Sesión 3 firmamos transacciones. Pero una billetera también firma MENSAJES: no van a la cadena, no cuestan gas, y aun así prueban quién los autorizó. La diferencia está en qué ve el usuario antes de firmar.", { y: 1.9, h: 0.95, size: 14 });
    D.tabla(s, ["tipo", "qué se firma", "qué ve el usuario", "riesgo"], [
      ["Hash crudo (eth_sign)", "32 bytes cualesquiera.", "Un hexadecimal ilegible.", "Puede ser el hash de una transacción: por eso las billeteras lo bloquean."],
      ["Texto (ERC-191, personal_sign)", "Un texto con el prefijo «\\x19Ethereum Signed Message».", "El texto tal cual.", "El prefijo impide que sea una transacción. Es el que usa SIWE."],
      ["Datos tipados (EIP-712)", "Campos con tipo + un DOMINIO (app, versión, red, contrato).", "Cada campo con su nombre y valor.", "Si el usuario no lee los campos, puede firmar un permiso de gastar sus tokens."],
    ], { y: 3.0, h: 2.6, colW: [2.9, 3.2, 2.5, 3.493], size: 11 });
    D.parrafo(s, "La firma sigue siendo la de la Sesión 3: ECDSA sobre secp256k1, y de la firma se recupera la dirección. Lo que cambia es QUÉ bytes se firman.", { y: 5.8, h: 0.8, size: 13, color: C.ocre });
    s.addNotes("Prefijo exacto ERC-191: \\x19Ethereum Signed Message:\\n + longitud. EIP-712 usa el prefijo \\x19\\x01. Ambos prefijos existen para que una firma de mensaje NUNCA pueda interpretarse como una transacción válida. Pregunta: ¿por qué las billeteras modernas bloquean eth_sign?");
  }

  {
    const s = await D.lamina({ kicker: "C.9 · EIP-712 por dentro", titulo: "Dominio + tipos + mensaje = un resumen", ic: "documento", tituloSize: 26 });
    D.codigo(s, `const dominio = { name: "AsistenciaUSB", version: "1",
                  chainId: 11155111, verifyingContract: "0x…" };   // Sepolia y SU contrato
const tipos = { Asistencia: [
  { name: "estudiante", type: "address" }, { name: "sesion", type: "uint256" },
  { name: "nonce",      type: "uint256" }, { name: "vence",  type: "uint256" } ] };
const firma = await signer.signTypedData(dominio, tipos, mensaje);   // gratis
ethers.verifyTypedData(dominio, tipos, mensaje, firma);              // → dirección`, { x: M, y: 1.9, w: CW, h: 2.4, lang: "js", titulo: "cómo se firma y se verifica · ethers 6", size: 11 });
    D.definicion(s, "resumen = keccak256( 0x19 0x01  ‖  hash(dominio)  ‖  keccak256( typeHash ‖ estudiante ‖ sesion ‖ nonce ‖ vence ) )", { x: M, y: 4.45, w: CW, h: 0.62, size: 11.5 });
    D.dosColumnas(s,
      { et: "En Solidity (OpenZeppelin 5)", texto: "Heredan EIP712(\"AsistenciaUSB\", \"1\"). _hashTypedDataV4(hashStruct) arma el resumen; ECDSA.recover(resumen, firma) devuelve quién firmó." },
      { et: "Error típico", linea: C.rojo, color: C.rojo, texto: "Escribir el tipo con un espacio de más, otro orden o abi.encodePacked. La firma «no verifica» y nadie sabe por qué: el typeHash debe ser idéntico, carácter por carácter." },
      { y: 5.22, h: 1.5, size: 11.5 });
    s.addNotes("La prueba 'calcula el mismo resumen que ethers (TypedDataEncoder)' de la práctica compara el hash de Solidity con el de ethers: si alguien se equivoca en el tipo, esa prueba lo delata antes que las demás. En Solidity se usa abi.encode (cada campo ocupa 32 bytes), no encodePacked.");
  }

  {
    const s = await D.lamina({ kicker: "C.10 · por qué hay dominio, nonce y vencimiento", titulo: "Una firma válida no es válida para siempre", ic: "escudo", tituloSize: 25 });
    D.parrafo(s, "Una firma es un objeto que cualquiera puede copiar. Si el mensaje no dice DÓNDE, CUÁNTAS VECES y HASTA CUÁNDO vale, quien la copie la puede reenviar. Cada campo cierra un ataque concreto, y la práctica prueba los cinco:", { y: 1.9, h: 0.95, size: 13.5 });
    D.tabla(s, ["ataque", "qué lo impide", "prueba de la práctica"], [
      ["Reenviar la firma en otra red", "chainId en el dominio.", "★ dominio de otra cadena"],
      ["Reenviarla a otro contrato","verifyingContract en el dominio.", "★ dominio de otro contrato"],
      ["Enviarla dos veces", "nonce que se consume al usarla.", "★ repetición (InvalidAccountNonce)"],
      ["Usarla meses después", "vence: fecha límite en el mensaje.", "★ firma vencida"],
      ["Firmar por otra persona", "recover(resumen, firma) ≠ estudiante.", "★ firma de otro (FirmaInvalida)"],
    ], { y: 3.0, h: 2.75, colW: [3.6, 4.1, 4.393], size: 11.5 });
    D.parrafo(s, "Error típico: comprobar la firma y olvidar el nonce. El contrato «funciona» en todas las pruebas felices y es vulnerable a la primera repetición.", { y: 5.95, h: 0.75, size: 13, color: C.ocre });
    s.addNotes("Esta tabla es el mapa de la práctica del viernes 6: cada fila es una prueba con estrella. Pedir que la fotografíen. Nota: el valor del nonce lo consume _useCheckedNonce de OpenZeppelin (utils/Nonces.sol), el mismo mecanismo que usa ERC20Permit.");
  }

  {
    const s = await D.lamina({ kicker: "C.11 · la cara peligrosa", titulo: "Firmar un permiso es entregar la llave", ic: "alerta", tituloSize: 27 });
    D.parrafo(s, "EIP-712 hace legible la firma, pero no la hace inofensiva. El mismo mecanismo que registra una asistencia sirve, en ERC-2612 (permit), para autorizar a un tercero a gastar tus tokens. Sin gas, sin transacción visible.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "El ataque de phishing", linea: C.rojo, color: C.rojo, items: ["Un sitio falso pide «firmar para verificar la billetera».", "Lo que se firma es un Permit: spender = el atacante, value = todo.", "El atacante envía la firma y vacía los tokens. La víctima nunca pagó gas."] },
      { et: "La costumbre profesional", items: ["Leer el dominio: ¿es la app que creo, en la red que creo?", "Leer el tipo: Permit, Order, Delegation… ¿qué autoriza?", "Si no se entiende, no se firma. Regla del curso desde la S1."] },
      { y: 2.95, h: 2.5, size: 12 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Regla del curso", x: M, y: 5.6, w: CW, h: 1.12, texto: "No se firma lo que no se entiende, aunque «sea gratis». Una firma sin gas puede mover más dinero que una transacción.", size: 13 });
    s.addNotes("Conectar con el bloque A (permit de ERC-20). Mostrar en la billetera del curso una solicitud de firma EIP-712 durante la práctica y pedir que lean cada campo en voz alta. No mencionar casos concretos con cifras sin verificarlas.");
  }

  {
    const s = await D.lamina({ kicker: "C.12 · login sin contraseña", titulo: "Sign-In with Ethereum (ERC-4361)", ic: "llave", tituloSize: 27 });
    D.codigo(s, `miapp.edu.co wants you to sign in with your Ethereum account:
0x70997970C51812dc3A010C7d01b50e0d17dc79C8

Ingresar al tablero del curso.

URI: https://miapp.edu.co
Version: 1
Chain ID: 11155111
Nonce: 8f3kQ2mZ
Issued At: 2026-09-17T19:30:00Z
Expiration Time: 2026-09-17T19:40:00Z`, { x: M, y: 1.9, w: 6.3, h: 3.55, lang: "js", titulo: "el mensaje estándar (texto, ERC-191)", size: 10.5 });
    D.pasos(s, [
      ["NONCE", "El servidor genera un nonce de un solo uso."],
      ["FIRMA", "La billetera muestra el texto; el usuario firma."],
      ["VERIFICA", "El servidor recupera la dirección y revisa dominio, nonce y fecha."],
      ["SESIÓN", "Emite una cookie o un token como siempre."],
    ], { x: M + 6.55, y: 1.9, w: CW - 6.55, alto: 0.78, gap: 0.1, anchoEt: 1.55, size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico: «SIWE es EIP-712»", x: M, y: 5.6, w: CW, h: 1.12, texto: "No: ERC-4361 firma TEXTO con ERC-191, a propósito, porque todas las billeteras lo soportan. EIP-712 es otra herramienta, la que usa la práctica del viernes 6 para autorizar una acción en un contrato.", size: 12 });
    s.addNotes("Formato del mensaje tomado de la especificación ERC-4361 (eips.ethereum.org/EIPS/eip-4361, estado Final). La especificación explica por qué eligió ERC-191 sobre EIP-712: soporte universal en billeteras. Para cuentas que son contratos, la verificación se hace con ERC-1271. Lo que SIWE protege: el dominio en el mensaje frena que un sitio falso reuse la firma para otro sitio; el nonce frena la repetición. Después del login, la sesión es web tradicional.");
  }

  {
    const s = await D.lamina({ kicker: "C.13 · billeteras que son contratos", titulo: "Abstracción de cuentas: ERC-4337", ic: "escudo", tituloSize: 27 });
    D.parrafo(s, "Una cuenta normal (EOA) es «una clave, una cuenta»: sin la frase semilla no hay recuperación, y sin ETH no hay primera transacción. ERC-4337 convierte la cuenta en un contrato programable, sin cambiar el protocolo.", { y: 1.9, h: 0.95, size: 14 });
    D.nodo(s, { x: M, y: 3.1, w: 2.45, h: 1.05, titulo: "USUARIO", sub: "firma una\nUserOperation", fill: C.blanco, line: C.naranja, subSize: 10.5 });
    D.flecha(s, M + 2.5, 3.62, M + 2.95, 3.62, C.tinta, 2);
    D.nodo(s, { x: M + 3.0, y: 3.1, w: 2.45, h: 1.05, titulo: "BUNDLER", sub: "junta varias y\npaga el gas", fill: C.superf, subSize: 10.5 });
    D.flecha(s, M + 5.5, 3.62, M + 5.95, 3.62, C.tinta, 2);
    D.nodo(s, { x: M + 6.0, y: 3.1, w: 2.45, h: 1.05, titulo: "ENTRYPOINT", sub: "contrato único\nque valida y ejecuta", fill: C.superf, subSize: 10.5 });
    D.flecha(s, M + 8.5, 3.62, M + 8.95, 3.62, C.tinta, 2);
    D.nodo(s, { x: M + 9.0, y: 3.1, w: CW - 9.0, h: 1.05, titulo: "CUENTA-CONTRATO", sub: "sus propias reglas\nde validación", fill: C.blanco, line: C.violeta, subSize: 10.5 });
    D.linea(s, M + 7.225, 4.15, M + 7.225, 4.45, C.tinta, 1.5, "dash");
    D.nodo(s, { x: M + 4.9, y: 4.45, w: 4.65, h: 0.62, titulo: "PAYMASTER · OPCIONAL · PAGA EL GAS", fill: C.blanco, size: 10 });
    D.tabla(s, ["capacidad", "qué resuelve para el usuario nuevo"], [
      ["Recuperación social o por guardianes", "Perder un dispositivo ya no es perderlo todo."],
      ["Gas patrocinado (paymaster)", "Empezar sin tener ETH: la app paga."],
      ["Operaciones por lotes", "approve + usar en una sola confirmación (el doble paso del bloque A)."],
    ], { y: 5.25, h: 1.47, colW: [4.2, 7.893], size: 11 });
    s.addNotes("ERC-4337 está en producción desde el 1 de marzo de 2023, cuando se desplegó el EntryPoint en la red principal (anunciado en ETHDenver / WalletCon); no requirió bifurcación porque todo vive en contratos y en un mempool alternativo. Estado del estándar en eips.ethereum.org: Final. Costos que hay que decir: cada operación gasta más gas que una transacción simple, y se depende de bundlers y paymasters.");
  }

  {
    const s = await D.lamina({ kicker: "C.14 · ya activo desde mayo de 2025", titulo: "EIP-7702: la cuenta normal aprende trucos", ic: "engranaje", tituloSize: 26 });
    D.parrafo(s, "Con la actualización Pectra (red principal, 7 de mayo de 2025) una EOA puede firmar una AUTORIZACIÓN que delega su ejecución al código de un contrato. Conserva la misma dirección y los mismos fondos, y gana lotes y gas patrocinado.", { y: 1.9, h: 0.95, size: 14 });
    D.tabla(s, ["", "ERC-4337", "EIP-7702"], [
      ["Qué es", "Estándar de contratos, sin cambiar el protocolo.", "Cambio del protocolo: un tipo de transacción nuevo."],
      ["La dirección", "Una cuenta-contrato nueva, con dirección nueva.", "La misma EOA de siempre."],
      ["La clave original", "Puede dejar de ser necesaria (otras reglas).", "Sigue mandando: quien tiene la clave, manda."],
      ["Se complementan", "Aporta la infraestructura: bundlers, paymasters.", "Deja que una EOA existente use esa infraestructura."],
    ], { y: 3.0, h: 2.35, colW: [2.3, 4.9, 4.893], size: 11 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "El riesgo nuevo", x: M, y: 5.55, w: CW, h: 1.17, texto: "Firmar una autorización 7702 hacia un contrato malicioso es entregarle la cuenta entera. Es la versión extrema de la lámina C.11: la billetera debe mostrar a qué código se delega, y el usuario debe entenderlo.", size: 12.5 });
    s.addNotes("Verificado: blog.ethereum.org/2025/04/23/pectra-mainnet (activación en la época 364032, 7-may-2025, 10:05:11 UTC) y eips.ethereum.org/EIPS/eip-7702 (estado Final). No entrar en el formato de la transacción tipo 4. Idea para llevarse: la abstracción de cuentas ya no es futuro, está en la red principal.");
  }

  {
    const s = await D.lamina({ kicker: "C.15 · dónde vive el frontend", titulo: "IPFS + ENS frente a hosting tradicional", ic: "red", tituloSize: 25 });
    D.dosColumnas(s,
      { et: "Hosting tradicional", texto: "Vercel, Netlify o un servidor propio. Rápido de montar y gratis para empezar. Pero si el proveedor cae, bloquea la cuenta o cambia el código, la dApp deja de estar accesible o sirve otra cosa." },
      { et: "IPFS + ENS", texto: "Se compila el frontend, se sube a IPFS (contenido direccionado por hash) y se pone su CID en el contenthash del nombre ENS. Un gateway como eth.limo lo sirve: vitalik.eth.limo funciona así hoy." },
      { y: 1.9, h: 2.35, size: 12.5 });
    D.tabla(s, ["capa", "¿quién la controla en una dApp típica?"], [
      ["Contratos", "Nadie en particular: la cadena."],
      ["Frontend", "El proveedor de hosting, o nadie si está en IPFS con su CID fijado (pinning)."],
      ["Gateway IPFS y RPC", "Empresas concretas: siguen siendo puntos centrales."],
      ["Indexador", "Studio / red de The Graph, o su propio servidor."],
    ], { y: 4.45, h: 2.27, colW: [3.0, 9.093], size: 11.5 });
    s.addNotes("Verificado el 17-sep-2026: el contenthash de vitalik.eth es ipfs://QmULSd… y vitalik.eth.limo responde. ERC-1577 define el campo contenthash. Error típico: 'mi dApp está en IPFS, es 100 % descentralizada'; el usuario igual llega por un gateway y un RPC centralizados. Para el curso, hosting tradicional es aceptable si el README lo declara.");
  }

  {
    const s = await D.lamina({ kicker: "C.16 · lo que hay que llevarse del bloque C", titulo: "Seis ideas de infraestructura", ic: "lista", tituloSize: 28 });
    ideas(s, [
      "El estado guarda el presente; la historia está en los eventos. Se lee con queryFilter o se indexa.",
      "The Graph hoy se usa por Subgraph Studio: el hosted service se apagó en junio de 2024.",
      "ENS es una lectura en dos pasos; los nombres vencen y los parecidos engañan.",
      "EIP-712 firma datos con dominio; el nonce y el vencimiento evitan que la firma se reuse.",
      "SIWE firma texto (ERC-191). 4337 y 7702 hacen la cuenta programable; 7702 ya está en la red.",
      "Un repo está listo cuando otro lo corre siguiendo el README, sin secretos dentro.",
    ]);
    s.addNotes("Cierre del bloque C y de la magistral. Repasar en voz alta en 2 minutos; la próxima clase, todo esto en las manos en la práctica del viernes 6.");
  }

  await D.cierre({
    frase: "Token: todos saben hablarle. NFT: importa dónde vive su archivo. dApp: la capa que une a ambos.",
    sub: "La próxima clase, todo esto en las manos: un lab en Hardhat local donde una ficha ERC-20 se canjea por un diploma NFT intransferible — sin ETH, sin red pública.",
    proxima: "VIERNES 6 DE NOVIEMBRE · PRÁCTICA INTEGRADA EN HARDHAT LOCAL",
  });

  return D.guardar(path.join(__dirname, "Magistral-Tokens-e-Infraestructura.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
