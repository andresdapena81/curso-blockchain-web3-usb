/* =====================================================================
   Sesión 10 · Tokens fungibles: el estándar ERC-20
   Estándar "más explicado" (modelo: build-sesion-04.js).
   Cifras y estándares verificados con fuente (ver notas del orador).
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 10 · TOKENS FUNGIBLES · ERC-20", titulo: "Sesión 10 · ERC-20" });
  const { C, F, M, CW } = D;

  function ideas(s, arr, size = 14) {
    arr.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  await D.portada({
    kicker: "SESIÓN 10 · UNIDAD III · WEB 3.0",
    titulo: "ERC-20\nUN ESTÁNDAR\nCOMPARTIDO",
    sub: "Un token no vale por su código, sino porque miles de aplicaciones ya saben hablarle. Eso es un estándar.",
    palabra: "ESTANDAR",
    ic: "moneda",
    notas: "Arranca la Unidad III: cosas que la gente usa. El punto de hoy es la interoperabilidad, no la sintaxis. Se construye SOBRE OpenZeppelin, auditado, no a mano.",
  });

  await D.agenda({
    intro: "Se construye SOBRE OpenZeppelin: el estándar ya está escrito y auditado. Hoy se aprende el patrón de aprobación, se despliega en Sepolia y se decide la tokenómica del proyecto.",
    bloques: [
      ["A", "EL ESTÁNDAR Y SU MECÁNICA", "Qué es un EIP/ERC, la interfaz, approve/transferFrom, decimales, extensiones y tokenómica.", "~65 min"],
      ["B", "LABORATORIO 10", "Token con tope y quema, canje por aprobación, despliegue a Sepolia y revocación.", "~85 min"],
      ["C", "PROYECTO", "Diseñar la tokenómica, o justificar por qué el proyecto NO lleva token.", "~30 min"],
    ],
    notas: "El bloque B es en parejas y produce artefactos on-chain (token verificado, hashes de transferencia y de canje). El bloque C se puede acabar en trabajo autónomo.",
  });

  await D.objetivo({
    objetivo: "Implementar un token fungible conforme al estándar y entender la mecánica de aprobaciones que usa todo DeFi.",
    preguntas: [
      "¿Por qué la interoperabilidad depende de un estándar y no del mejor código?",
      "¿Por qué existe approve + transferFrom, y qué riesgo trae?",
      "¿Por qué no hay decimales de verdad, y cómo se representa el valor?",
      "¿Qué distingue una tokenómica sostenible de un esquema extractivo?",
    ],
    ra: "RA3 · Programar contratos aplicando estándares de la industria (ERC-20, OpenZeppelin).",
  });

  await D.glosario({
    items: [
      ["ERC / EIP", "Ethereum Request for Comments / Improvement Proposal", "Un EIP propone; cuando define una interfaz de aplicación, se le llama ERC. ERC-20 es el número 20."],
      ["Fungible", "intercambiable", "Cada unidad es idéntica a otra: un punto vale igual que cualquier otro punto. Como el dinero."],
      ["allowance", "autorización", "Cuántos tokens de A puede mover un tercero C. La base de approve + transferFrom."],
      ["transferFrom", "transferir desde", "Mueve tokens de otra cuenta, dentro del límite que esa cuenta autorizó."],
      ["Decimales", "decimals", "Cuántas cifras minúsculas tiene el token. 18 es lo habitual. No hay coma flotante real."],
      ["Mint · Burn", "acuñar · quemar", "Crear tokens nuevos (sube el suministro) y destruirlos (lo baja)."],
      ["EIP-2612", "Permit", "Aprobar con una firma, sin una transacción aparte. Ahorra un paso y gas al usuario."],
      ["Tokenómica", "tokenomics", "Las reglas económicas del token: cuánto hay, cómo se emite, cómo se destruye, cómo se reparte."],
    ],
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "El estándar y su mecánica", sub: "ERC-20 son seis funciones y dos eventos. Que sean SIEMPRE los mismos es justo lo que hace que un token sirva.", minutos: "APROXIMADAMENTE 65 MINUTOS", ic: "moneda" });

  {
    const s = await D.lamina({ kicker: "A.1 · qué es un EIP/ERC", titulo: "Un acuerdo, no una ley", ic: "documento", tituloSize: 29 });
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
    const s = await D.lamina({ kicker: "A.1b · cómo nace un estándar", titulo: "De una idea a «Final»: el proceso EIP", ic: "jerarquia", tituloSize: 26 });
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
    const s = await D.lamina({ kicker: "A.2 · la interfaz", titulo: "Seis funciones y dos eventos", ic: "codigo", tituloSize: 29 });
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
    const s = await D.lamina({ kicker: "A.2b · la interfaz pieza por pieza", titulo: "Qué hace cada función, y quién la llama", ic: "lista", tituloSize: 26 });
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
    const s = await D.lamina({ kicker: "A.2c · ejemplo de estado", titulo: "La tabla de saldos, antes y después", ic: "rejilla", tituloSize: 27 });
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
    const s = await D.lamina({ kicker: "A.3 · lo que NO es", titulo: "Un token no es una cuenta con monedas dentro", ic: "rejilla", tituloSize: 26 });
    D.parrafo(s, "El error mental más común: creer que cada usuario «tiene» tokens en su billetera. No es así.", { y: 1.9, h: 0.55, size: 14.5 });
    D.definicion(s, "mapping(address => uint256) private _balances;   // TODO el token es esta tabla", { x: M, y: 2.6, w: CW, h: 0.65, size: 12 });
    D.dosColumnas(s,
      { et: "Dónde vive el token", texto: "En UN contrato: la FichaUSB. Ese contrato guarda una tabla de saldos. Su billetera no contiene tokens: contiene la clave que autoriza a mover una fila de esa tabla." },
      { et: "Qué significa «transferir»", texto: "Restar de una fila y sumar a otra, dentro del mismo contrato. No se mueve nada de un lado a otro: se reescribe una tabla. Por eso una transferencia emite el evento Transfer." },
      { y: 3.5, h: 2.3, size: 13 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La consecuencia práctica", x: M, y: 5.9, w: CW, h: 0.9, texto: "Para que una billetera «vea» un token, hay que darle la dirección del contrato: no está en la billetera, está en el contrato.", size: 12.5 });
    s.addNotes("Este error mental se paga en el laboratorio: el estudiante despliega el token, no lo ve en MetaMask, y cree que falló. No falló: hay que IMPORTARLO con la dirección del contrato (paso del bloque B).");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · decimales", titulo: "Por qué 1 token son 1 000 000 000 000 000 000", ic: "moneda", tituloSize: 26 });
    D.parrafo(s, "La EVM no tiene coma flotante (Sesión 5). Un token con 18 decimales guarda internamente enteros enormes, y la coma es pura presentación.", { y: 1.9, h: 0.7, size: 14.5 });
    D.tabla(s, ["lo que ve la persona", "lo que guarda el contrato (unidades mínimas)"], [
      ["1 FUSB", "1 000 000 000 000 000 000  (1 × 10¹⁸)"],
      ["0,5 FUSB", "500 000 000 000 000 000"],
      ["0,000000000000000001 FUSB", "1  (la unidad mínima, indivisible)"],
    ], { y: 2.75, h: 2.0, colW: [4.3, 7.793], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error de principiante", x: M, y: 4.95, w: CW, h: 1.85, texto: "Escribir acunar(ana, 100) pensando en 100 tokens, cuando la función espera unidades mínimas, acuña una fracción invisible (100 de 10¹⁸). Por eso el token del laboratorio recibe la cantidad EN TOKENS y multiplica por 10**decimals() adentro: la interfaz habla en tokens, el contrato en unidades mínimas. En ethers.js se usa parseUnits(\"1\", 18) para escribir y formatUnits(v, 18) para leer.", size: 12.5 });
    s.addNotes("⚠ Números verificados con ethers: 1 token = 1e18; 25 FUSB = 25·10^18 = 25000000000000000000; 0,5 = 5e17. Contraste útil: USDC usa 6 decimales, no 18 → 25 USDC = 25000000. No todos los tokens usan 18: siempre leer decimals().");
  }

  {
    const s = await D.lamina({ kicker: "A.4b · conversiones calculadas", titulo: "parseUnits y formatUnits, con números reales", ic: "terminal", tituloSize: 25 });
    D.parrafo(s, "En JavaScript nunca se multiplica a mano por 10¹⁸: se usan dos funciones de ethers. parseUnits va de lo humano al contrato; formatUnits, del contrato a lo humano. Salidas reales, ejecutadas con ethers 6:", { y: 1.85, h: 0.9, size: 13.5 });
    D.codigo(s, `parseUnits("25", 18)        ->  25000000000000000000n   // el precio del Canje
parseUnits("0.1", 18)       ->  100000000000000000n
parseUnits("1000000", 18)   ->  1000000000000000000000000n   // el tope
parseUnits("1.5", 6)        ->  1500000n                 // un token de 6 decimales

formatUnits(123456789000000000000n, 18)  ->  "123.456789"
formatUnits(100n, 18)       ->  "0.0000000000000001"     // el error de A.4`, { x: M, y: 2.85, w: CW, h: 2.6, lang: "js", titulo: "ethers 6 · salida real", size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Tres errores típicos", x: M, y: 5.6, w: CW, h: 1.2, texto: "(1) Usar Number en vez de BigInt: 25e18 no cabe exacto en un Number de JavaScript. (2) Suponer 18 decimales en un token de 6. (3) Pasar un string con coma («0,5»): parseUnits exige punto decimal.", size: 12 });
    s.addNotes("⚠ Salidas calculadas con ethers 6 (node) en el repo de laboratorios, no de memoria. Number.MAX_SAFE_INTEGER ≈ 9·10^15, así que 25·10^18 pierde precisión si se usa Number: por eso ethers 6 devuelve bigint (el sufijo n). El último renglón es exactamente acunar(ana, 100) sin convertir: 100 unidades mínimas = 0,0000000000000001 FUSB.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · el patrón de aprobación", titulo: "Por qué transferir en dos pasos", ic: "llave", tituloSize: 28 });
    D.parrafo(s, "transfer mueve MIS tokens. Pero, ¿cómo deja un usuario que un CONTRATO —un exchange, un canje— mueva los suyos, sin entregarle su clave privada? Con una autorización previa y acotada.", { y: 1.9, h: 0.95, size: 14 });
    D.nodo(s, { x: M, y: 3.05, w: 3.5, h: 1.0, titulo: "1 · approve", sub: "Ana autoriza al canje\nhasta 25 fichas", fill: C.blanco, line: C.violeta, subSize: 11 });
    D.flecha(s, M + 3.5, 3.55, M + 4.3, 3.55, C.tinta, 2);
    D.nodo(s, { x: M + 4.3, y: 3.05, w: 3.7, h: 1.0, titulo: "2 · transferFrom", sub: "el canje retira 25,\nni una más", fill: C.blanco, line: C.naranja, subSize: 11 });
    D.flecha(s, M + 8.0, 3.55, M + 8.8, 3.55, C.tinta, 2);
    D.nodo(s, { x: M + 8.8, y: 3.05, w: CW - 8.8, h: 1.0, titulo: "allowance = 0", sub: "la autorización se gastó", fill: C.superf, subSize: 11 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Lo que hace seguro el patrón", x: M, y: 4.4, w: CW, h: 1.35, texto: "El contrato NUNCA puede mover más de lo aprobado. Verificado en el laboratorio: un segundo canje sin volver a aprobar revierte. La clave privada de Ana no sale nunca de su billetera.", size: 13 });
    D.parrafo(s, "Así funcionan todos los intercambios descentralizados: primero autorizas al contrato del DEX, después el DEX mueve tus tokens al hacer el swap.", { y: 5.9, h: 0.6, size: 13, color: C.ocre });
    s.addNotes("Verificado en test/s10 (★): con aprobación exacta el canje retira 25 y la allowance queda en 0; sin aprobación revierte con ERC20InsufficientAllowance; un segundo canje sin re-aprobar revierte. Es la tesis de la sesión.");
  }

  {
    const s = await D.lamina({ kicker: "A.5b · el Canje por dentro", titulo: "Qué pasa exactamente en canjear()", ic: "codigo", tituloSize: 27 });
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
    s.addNotes("Es el TODO 4 del laboratorio. Dos msg.sender distintos en la misma transacción: esa es la idea difícil. Dibujar la cadena Ana → Canje → FichaUSB en el tablero. Error de OZ 5 verificado en test/s10: ERC20InsufficientAllowance.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · el riesgo del patrón", titulo: "Aprobaciones ilimitadas: comodidad peligrosa", ic: "alerta", tituloSize: 26 });
    D.parrafo(s, "Muchas aplicaciones piden aprobar una cantidad gigante «para no molestar otra vez». Es cómodo, y es el origen de robos enormes.", { y: 1.9, h: 0.6, size: 14.5 });
    D.dosColumnas(s,
      { et: "Qué pasa", linea: C.rojo, color: C.rojo, texto: "Si apruebas una cantidad ilimitada a un contrato, y ese contrato resulta malicioso o es hackeado más adelante, puede vaciar TODO tu saldo de ese token cuando quiera. La autorización sigue viva hasta que la revoques." },
      { et: "Qué hacer", texto: "Aprobar solo lo necesario para la operación. Revisar y revocar aprobaciones viejas (hay herramientas para verlas todas). Desconfiar de una app que pide aprobación ilimitada sin explicarlo." },
      { y: 2.6, h: 2.15, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "El caso real · Badger DAO, diciembre de 2021", x: M, y: 4.9, w: CW, h: 1.85, texto: "El front-end de Badger DAO fue comprometido (un script malicioso inyectado vía Cloudflare) y pedía a los usuarios firmar aprobaciones ILIMITADAS. Unas 500 billeteras aprobaron; el atacante usó transferFrom y drenó del orden de 120 millones de dólares. El contrato estaba bien: el robo entró por una aprobación excesiva que la gente firmó sin mirar. Regla: se entrega la aprobación más pequeña que sirva, y se revoca poniendo la allowance en cero.", size: 12.5 });
    s.addNotes("⚠ Verificado: Badger DAO, 2 dic 2021, ~120 M USD. Script inyectado por Cloudflare en el front-end pedía approve ilimitado; ~500 wallets firmaron; el atacante usó transferFrom (coindesk, halborn). Es el caso REAL que exige el encargo para las aprobaciones ilimitadas. Herramientas de revocación: revoke.cash, y el 'Token Approvals' del explorador.");
  }

  {
    const s = await D.lamina({ kicker: "A.6b · verificación · aprobaciones", titulo: "¿Qué puede hacer el Canje con esto?", ic: "pregunta", tituloSize: 27 });
    D.enunciado(s, "Ana, «para no aprobar cada vez», autoriza al Canje por type(uint256).max. Canjea una vez (25). ¿Cuánto le queda de autorización, y qué podría hacer el Canje si mañana lo reemplazan por uno malicioso?", { y: 1.9, h: 1.9, size: 18, line: C.naranja });
    D.dosColumnas(s,
      { et: "La respuesta", linea: C.rojo, color: C.rojo, texto: "Le sigue quedando el máximo: en OpenZeppelin 5, una allowance igual a type(uint256).max se trata como INFINITA y no se descuenta al gastarse. El gastador puede mover TODO el saldo de Ana, hoy y dentro de un año." },
      { et: "La lección", texto: "Con una aprobación exacta (25), después del canje la allowance queda en 0 y no hay nada que robar. La aprobación ilimitada convierte cualquier fallo futuro del gastador en un robo de tu saldo completo. Es el mecanismo exacto de Badger." },
      { y: 4.0, h: 2.75, size: 12.5 });
    s.addNotes("⚠ Verificado en el código de OpenZeppelin 5.6.1 (ERC20._spendAllowance): 'Does not update the allowance value in case of infinite allowance' — si currentAllowance == type(uint256).max no se descuenta. Pregunta de cierre del tramo de aprobaciones. Dar 45 segundos en parejas.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · la carrera del approve", titulo: "Cambiar una aprobación de 50 a 20", ic: "reloj", tituloSize: 27 });
    D.parrafo(s, "El propio EIP-20 advierte de un riesgo de carrera. Ana aprobó 50 a Beto (un gastador) y decide bajarlo a 20. Parece inofensivo. Pero su transacción pasa por el mempool, a la vista (Sesión 9, A.12):", { y: 1.85, h: 0.9, size: 13.5 });
    D.pasos(s, [
      ["ANA ENVÍA approve(beto, 20)", "Su transacción queda pendiente en el mempool. La allowance todavía vale 50."],
      ["BETO LA VE Y SE ADELANTA", "Envía transferFrom(ana, beto, 50) con más gas: entra ANTES. Se lleva los 50 viejos."],
      ["SE CONFIRMA LA DE ANA", "approve escribe 20 (no resta: SOBRESCRIBE). Beto tiene una allowance nueva de 20."],
      ["BETO GASTA OTRA VEZ", "transferFrom(ana, beto, 20). Total: 70. Ana quería autorizar como máximo 50."],
    ], { y: 2.85, alto: 0.62, gap: 0.1, anchoEt: 3.4, size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La idea llana", x: M, y: 5.75, w: CW, h: 1.02, texto: "approve no dice «cambia de 50 a 20»; dice «ahora son 20», sin saber cuánto se gastó ya.", size: 12.5 });
    s.addNotes("⚠ Verificado: el EIP-20 documenta este vector y recomienda que la UI ponga la allowance en 0 antes de cambiarla a otro valor para el mismo gastador; el contrato no lo obliga, por compatibilidad hacia atrás (eips.ethereum.org/EIPS/eip-20). Cifras del ejemplo: 50 + 20 = 70. Conecta con 'el costo del estándar' de A.1: el defecto lo heredan todos los tokens.");
  }

  {
    const s = await D.lamina({ kicker: "A.7b · las salidas", titulo: "Cómo cambiar una aprobación sin regalar", ic: "escudo", tituloSize: 27 });
    D.tabla(s, ["opción", "cómo funciona", "trade-off"], [
      ["Pasar por 0", "approve(g, 0), confirmar, mirar cuánto gastó g, y recién entonces approve(g, M).", "Dos transacciones, pero decides M sabiendo lo gastado. Lo recomienda el EIP-20."],
      ["increase / decreaseAllowance", "Sumar o restar a la allowance en vez de sobrescribirla.", "Existían en OpenZeppelin 4. Se QUITARON de ERC20 en OZ 5 (no son del estándar y se usaron en phishing)."],
      ["SafeERC20 (lado del contrato)", "forceApprove y safeIncreaseAllowance, para contratos que aprueban a otros.", "Es una librería para quien LLAMA al token, no una función del token."],
      ["Aprobar exacto y a tiempo", "Aprobar solo lo que se va a gastar, justo antes de usarlo (o con Permit).", "La allowance vive poco y vale poco: casi nada que correr."],
    ], { y: 1.9, h: 3.55, colW: [2.9, 4.8, 4.393], size: 10.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico: copiar un tutorial viejo", x: M, y: 5.55, w: CW, h: 1.25, texto: "Muchos tutoriales llaman token.increaseAllowance(...). Con OpenZeppelin 5.6.1 (el del curso) eso no compila: la función ya no existe en ERC20.", size: 12 });
    s.addNotes("⚠ Verificado: (1) en node_modules/@openzeppelin/contracts 5.6.1, ERC20.sol no tiene increaseAllowance/decreaseAllowance; SafeERC20 trae safeIncreaseAllowance, safeDecreaseAllowance y forceApprove. (2) OZ 5.0 (oct 2023) las quitó por no ser parte del EIP-20 y por su uso en phishing (changelog de OpenZeppelin, issue #4583). El paso 'REVOCAR' del laboratorio es justamente pasar por 0.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · el token, casi entero heredado", titulo: "OpenZeppelin: componer extensiones", ic: "jerarquia", tituloSize: 25 });
    D.codigo(s, `contract FichaUSB is ERC20, ERC20Burnable, ERC20Capped, Ownable {
    constructor(uint256 topeEnTokens)
        ERC20("Ficha USB", "FUSB")
        ERC20Capped(topeEnTokens * 10 ** decimals())
        Ownable(msg.sender)
    {}

    function acunar(address a, uint256 cant) external onlyOwner {
        _mint(a, cant * 10 ** decimals());
    }
    function _update(address from, address to, uint256 v)
        internal override(ERC20, ERC20Capped) { super._update(from, to, v); }
}`, { x: M, y: 1.9, w: 8.0, h: 4.3, lang: "sol", size: 10.5 });
    D.lista(s, [
      "ERC20: las seis funciones.",
      "Burnable: quemar los propios.",
      "Capped: tope de emisión.",
      "Ownable: solo el dueño acuña.",
      "Lo único propio: acunar y el _update que compone las extensiones.",
    ], { x: M + 8.3, y: 1.9, w: CW - 8.3, h: 4.3, size: 12, gap: 8 });
    D.parrafo(s, "El _update override es obligatorio en OpenZeppelin v5: al mezclar ERC20 y Capped hay que decir cuál gana. Sin él, no compila — a propósito, para entender que las extensiones se componen aquí.", { y: 6.35, h: 0.45, size: 11.5, color: C.ocre });
    s.addNotes("OpenZeppelin 5.6.1 (versiones.md). En v5: Ownable(msg.sender) en el constructor, y el override de _update sustituye a los _beforeTokenTransfer de v4. Este es el contrato real de contracts/s10/FichaUSB.sol.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · el catálogo de extensiones", titulo: "Qué añade cada pieza de OpenZeppelin", ic: "rejilla", tituloSize: 25 });
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
    const s = await D.lamina({ kicker: "A.9b · cada extensión tiene su precio", titulo: "Burnable, Capped y Pausable: los trade-offs", ic: "balanza", tituloSize: 24 });
    D.tabla(s, ["extensión", "lo que ganas", "lo que cuesta o arriesga", "ejemplo en FichaUSB"], [
      ["Burnable", "Sacar unidades de circulación: canjes, retiros, deflación.", "La quema es irreversible; burnFrom exige allowance (otra aprobación que vigilar).", "Ana quema 40 → balance y totalSupply bajan 40."],
      ["Capped", "Escasez creíble: nadie puede emitir por encima del tope, ni el dueño.", "Si el tope es muy bajo, el proyecto se queda sin emisión. Cambiarlo exige otro contrato.", "Tope 1 000 000: acuñar 1 más revierte con ERC20ExceededCap."],
      ["Pausable", "Un freno de emergencia: congelar todas las transferencias.", "Quien tiene el freno puede congelar el dinero de todos: es poder centralizado.", "FichaUSB NO la usa, a propósito: no hay freno que abusar."],
    ], { y: 1.9, h: 3.6, colW: [1.9, 3.3, 3.8, 3.093], size: 10.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico con Capped", x: M, y: 5.65, w: CW, h: 1.12, texto: "Creer que el tope cuenta lo acuñado en la historia. Cuenta el suministro VIVO: si se queman 10 con el tope lleno, se pueden volver a acuñar 10. Lo demuestra la prueba ★ «quemar libera espacio bajo el tope».", size: 12 });
    s.addNotes("Verificado en test/s10: ERC20ExceededCap al acuñar sobre el tope, y la prueba ★ de quemar y re-acuñar. En OZ 5, ERC20Pausable sobrescribe _update con whenNotPaused (verificado en node_modules). Preguntar: '¿pondrían Pausable en el token de su proyecto? ¿Quién tendría el freno?'.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · aprobar con una firma", titulo: "EIP-2612 Permit: un paso menos", ic: "documento", tituloSize: 27 });
    D.parrafo(s, "El patrón clásico exige DOS transacciones: aprobar y luego usar. Permit deja aprobar con una FIRMA fuera de la cadena, que el contrato verifica al usarla. El usuario firma gratis; una sola transacción hace todo.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "Sin Permit", items: ["Transacción 1: approve (cuesta gas).", "Transacción 2: la operación (cuesta gas).", "Dos confirmaciones en la billetera."] },
      { et: "Con Permit (EIP-2612)", items: ["Una firma fuera de la cadena (gratis, sin gas).", "Transacción única: la operación incluye la aprobación.", "La firma usa EIP-712, que veremos en la Sesión 13."] },
      { y: 3.05, h: 2.1, size: 12.5 });
    D.parrafo(s, "OpenZeppelin lo trae en la extensión ERC20Permit. Lo propuso Martin Lundfall en 2020, es estándar «Final», y hoy lo usan casi todos los tokens grandes. En el proyecto es opcional, pero mejora mucho la experiencia.", { y: 5.35, h: 0.8, size: 13, color: C.ocre });
    s.addNotes("⚠ Verificado: EIP-2612, autor Martin Lundfall, creado 13 abr 2020, Final. Firma permit(owner, spender, value, deadline, v, r, s); depende de EIP-712 (eips.ethereum.org/EIPS/eip-2612). EIP-712 es firma de datos estructurados, tema de la S13.");
  }

  {
    const s = await D.lamina({ kicker: "A.10b · Permit paso a paso", titulo: "El flujo de una aprobación firmada", ic: "llave", tituloSize: 27 });
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
    s.addNotes("⚠ Verificado en OZ 5.6.1 (ERC20Permit.sol): errores ERC2612ExpiredSignature(deadline) y ERC2612InvalidSigner(signer, owner), nonces(owner) y DOMAIN_SEPARATOR(). Firma del EIP-2612: permit(owner, spender, value, deadline, v, r, s). La construcción de la firma EIP-712 se hace en la S13; hoy basta el flujo.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · tokenómica", titulo: "Las reglas económicas son una decisión de diseño", ic: "grafico", tituloSize: 24 });
    D.tabla(s, ["decisión", "opciones", "qué comunica"], [
      ["Suministro", "Fijo (tope) vs. inflacionario (se emite sin fin).", "Un tope da escasez creíble; la inflación premia sin fin, pero diluye."],
      ["Emisión", "Quién acuña y bajo qué regla.", "«El dueño imprime cuando quiere» es una señal de alarma."],
      ["Quema", "Si se pueden destruir tokens, y quién.", "La quema reduce el suministro: puede canjear o retirar de circulación."],
      ["Distribución inicial", "Cómo se reparte el primer lote.", "Si el equipo se queda con casi todo, los demás compran su salida."],
      ["Vesting", "Liberar por partes en el tiempo.", "Evita que los primeros vendan todo el día uno."],
    ], { y: 1.9, h: 3.7, colW: [2.6, 4.6, 4.893], size: 11 });
    D.enunciado(s, "Un diseño sostenible reparte y limita el poder de emisión. Un esquema extractivo concentra ambos en quien lo lanzó.", { y: 5.75, h: 0.95, size: 16, line: C.naranja });
    s.addNotes("Conectar con la tesis del curso: la pregunta no es 'cómo hago un token', sino 'este token, ¿reparte poder o lo concentra?'. El FichaUSB del laboratorio es deliberadamente sostenible: tope + emisión controlada + quema abierta.");
  }

  {
    const s = await D.lamina({ kicker: "A.11b · dos diseños contrastados", titulo: "El mismo código, dos intenciones", ic: "balanza", tituloSize: 28 });
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
    const s = await D.lamina({ kicker: "A.11c · señales de alerta", titulo: "Cómo leer un token antes de confiar en él", ic: "lupa", tituloSize: 26 });
    D.parrafo(s, "Todo esto se puede verificar en el explorador, con el código verificado delante. Verificar en vez de creer (la tesis del curso) aplicado a tokens:", { y: 1.85, h: 0.65, size: 14 });
    D.tabla(s, ["señal de alerta", "cómo se ve en el código o en la cadena"], [
      ["El dueño imprime sin tope", "Una función de mint con onlyOwner y sin cap(), o con un cap que el dueño cambia."],
      ["Concentración inicial", "Los primeros eventos Transfer desde 0x0 van casi todos a pocas direcciones."],
      ["Sin vesting", "El equipo recibe todo el día uno, sin contrato que libere por partes."],
      ["Poderes de congelar o confiscar", "Pausable, listas negras o funciones que mueven saldos ajenos en manos de una sola llave."],
      ["Código no verificado", "Si no se puede leer el código en el explorador, no hay nada que auditar: se descarta."],
    ], { y: 2.6, h: 3.1, colW: [3.6, 8.493], size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.8, w: CW, h: 1.0, texto: "Juzgar el token por el sitio web o por el precio. Se juzga por el contrato y por la distribución real en la cadena.", size: 12.5 });
    s.addNotes("Ejercicio opcional si hay tiempo: abrir en el explorador de Sepolia la FichaUSB de una pareja y revisar las cinco señales en vivo. Conecta con la S14 (DeFi) y la S16 (regulación).");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · lo que hay que llevarse del bloque A", titulo: "Seis ideas sobre tokens", ic: "lista", tituloSize: 28 });
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

  {
    const s = await D.lamina({ kicker: "A.13 · verificación del bloque A", titulo: "Tres preguntas antes del laboratorio", ic: "pregunta", tituloSize: 27 });
    D.tabla(s, ["pregunta", "respuesta esperada"], [
      ["El token tiene 18 decimales. ¿Qué valor debe recibir approve para autorizar 25 fichas?", "25 × 10¹⁸ = 25000000000000000000 (parseUnits(\"25\", 18))."],
      ["Ana aprobó 25 al Canje y luego transfirió todo su saldo a Beto. ¿Funciona canjear()?", "No: la allowance sigue en 25, pero Ana no tiene saldo. approve no aparta tokens (A.2c)."],
      ["¿Por qué FichaUSB no hereda Pausable?", "Porque el freno sería un poder centralizado sin necesidad en este caso (A.9b)."],
    ], { y: 1.9, h: 3.3, colW: [6.3, 5.793], size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Cómo usar esta lámina", x: M, y: 5.4, w: CW, h: 1.35, texto: "Tapar la segunda columna. Una pareja responde cada pregunta en voz alta; otra la corrige. Si la segunda falla en la mayoría del grupo, volver a A.2c antes de abrir el laboratorio: es el error que más tiempo cuesta en el bloque B.", size: 12.5 });
    s.addNotes("Verificación de cierre del bloque A (estándar S4). La segunda pregunta: transferFrom revertiría con ERC20InsufficientBalance, no por allowance.");
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Laboratorio 10", sub: "Un token con tope y quema, un contrato que canjea por aprobación, y su despliegue a Sepolia: verificar, importar, transferir y revocar.", minutos: "APROXIMADAMENTE 85 MINUTOS · EN PAREJAS", ic: "martillo" });

  {
    const s = await D.lamina({ kicker: "B.1 · lo que se construye", titulo: "FichaUSB y Canje", ic: "moneda", tituloSize: 30 });
    D.tabla(s, ["parte", "qué hace", "estándar que aplica"], [
      ["FichaUSB", "Token de puntos con tope, acuñación controlada y quema.", "ERC20 + Capped + Burnable + Ownable"],
      ["acunar", "El organizador crea puntos, hasta el tope.", "_mint con control de acceso"],
      ["Canje", "Un puesto que cobra fichas por un premio, usando la aprobación.", "approve + transferFrom"],
    ], { y: 1.9, h: 2.4, colW: [2.3, 5.8, 3.993], size: 12 });
    D.codigo(s, `# Se copia el andamiaje sobre contracts/s10 y se completan los TODO 1-4
npx hardhat test test/s10/FichaUSB.test.js      # 12 pruebas: deben pasar`, { x: M, y: 4.45, w: CW, h: 1.0, lang: "js", size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Las pruebas ★ son las que importan", x: M, y: 5.55, w: CW, h: 1.2, texto: "No acuñar sobre el tope; quemar libera espacio; el canje retira exactamente lo aprobado; el contrato no puede tomar más. Esas cuatro son la tesis de la sesión.", size: 12.5 });
    s.addNotes("El estudiante recibe el andamiaje (andamiaje/s10) con 4 TODO que compilan pero fallan las pruebas; la solución de referencia (contracts/s10) pasa las 12. La guía en PDF explica cada TODO. Verificado: solución 12/12 verdes; andamiaje falla solo en lo TODO.");
  }

  {
    const s = await D.lamina({ kicker: "B.1b · el código que escriben", titulo: "Los cuatro TODO, en orden", ic: "codigo", tituloSize: 28 });
    D.pasos(s, [
      ["TODO 1 · EL TOPE", "En el constructor: ERC20Capped(topeEnTokens * 10 ** decimals()). Sin convertir, el tope es una fracción invisible."],
      ["TODO 2 · ACUNAR", "_mint(a, cantidadEnTokens * 10 ** decimals()). No revisar el tope aquí: lo hace Capped en _update."],
      ["TODO 3 · _UPDATE", "Una línea: super._update(from, to, value). Mientras esté vacío, NINGÚN saldo se mueve."],
      ["TODO 4 · CANJEAR", "transferFrom(msg.sender, tesoreria, precio), revert si false, sumar el premio y emitir Canjeado (A.5b)."],
    ], { y: 1.9, alto: 0.84, gap: 0.12, anchoEt: 2.9, size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El orden importa", x: M, y: 5.8, w: CW, h: 1.0, texto: "Empiecen por el TODO 3: sin él casi todas las pruebas fallan, y los otros tres TODO parecen rotos aunque estén bien.", size: 12.5 });
    s.addNotes("Los TODO y sus pistas están en andamiaje/s10/FichaUSB.sol y Canje.sol, y explicados uno por uno en la guía (sección 3). Circular por las parejas preguntando '¿qué prueba falla y qué TODO la gobierna?' en vez de dictar la línea.");
  }

  {
    const s = await D.lamina({ kicker: "B.1c · cómo saben que terminaron", titulo: "Salida esperada, al empezar y al terminar", ic: "terminal", tituloSize: 26 });
    D.codigo(s, `# con el andamiaje recién copiado (salida real):
  2 passing
  10 failing          # pasan solo nombre/decimales y "solo el organizador acuña"

# con los cuatro TODO completos:
  12 passing          # esa es la meta local

# ensayo del despliegue en la red local (salida real):
[ FichaCanjeModulo ] successfully deployed
FichaCanjeModulo#FichaUSB - 0x5FbD...0aa3
FichaCanjeModulo#Canje    - 0xe7f1...0512`, { x: M, y: 1.9, w: CW, h: 3.5, lang: "py", titulo: "npx hardhat test test/s10/FichaUSB.test.js", size: 11 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Terminado significa las tres cosas", x: M, y: 5.55, w: CW, h: 1.22, texto: "(1) 12 pruebas en verde en su máquina. (2) FichaUSB y Canje desplegados en Sepolia con el check verde de verificación en el explorador. (3) Los hashes de transferencia, approve, canjear y el canje fallido tras revocar, anotados.", size: 12.5 });
    s.addNotes("Las salidas son reales: el andamiaje se probó copiándolo sobre contracts/s10 (2 passing, 10 failing) y la solución da 12 passing; el módulo ignition/modules/s10-FichaCanje.js se desplegó en la red local (direcciones deterministas de Hardhat). En Sepolia las direcciones serán otras.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · desplegar a Sepolia", titulo: "Del contrato a una dirección real", ic: "cohete", tituloSize: 27 });
    D.codigo(s, `# 1. Guardar los secretos en el almacén cifrado (una vez):
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set SEPOLIA_PRIVATE_KEY     # billetera DEL CURSO
npx hardhat keystore set ETHERSCAN_API_KEY

# 2. Desplegar y verificar con Ignition (mismo módulo que la S8):
npx hardhat ignition deploy ignition/modules/s10-FichaCanje.js \\
  --network sepolia \\
  --parameters ignition/parametros/s10-mi-ficha.json \\
  --verify`, { x: M, y: 1.9, w: CW, h: 3.0, lang: "js", size: 11 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Las reglas que no cambian", x: M, y: 5.05, w: CW, h: 1.7, texto: "La clave privada es la de la billetera del curso, SIN fondos reales. Ninguna clave ni URL con API key se escribe en un archivo del repositorio: solo en el almacén cifrado (keystore). Antes de cada git push: git status, y confirmar que no se sube nada. Si la verificación falla por tiempo, esperar un minuto y repetir el MISMO comando: Ignition sabe que ya desplegó.", size: 12.5 });
    s.addNotes("El módulo Ignition ignition/modules/s10-FichaCanje.js despliega FichaUSB y luego Canje con su dirección. Verificado que despliega en la red local. El JSON de parámetros lo escribe cada pareja con su tope, precio y tesorería. Es el mismo flujo keystore + Ignition + --verify de la S8.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · en la billetera", titulo: "Importar, transferir y canjear", ic: "llave", tituloSize: 28 });
    D.pasos(s, [
      ["IMPORTAR EL TOKEN", "En MetaMask: «Importar token» con la dirección del contrato. Recordar A.3: no aparece solo."],
      ["TRANSFERIR", "Acuñar puntos a un compañero y que él los vea; guardar el hash de una transferencia entre dos cuentas."],
      ["APROBAR Y CANJEAR", "Desplegar/usar Canje, aprobar el precio desde la billetera, canjear. Revisar que la allowance quedó en cero."],
      ["REVOCAR", "Aprobar de nuevo y luego poner la aprobación en cero: ver que el canje ya NO funciona (revierte)."],
    ], { y: 1.9, alto: 0.72, gap: 0.1, anchoEt: 2.7, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "El gesto que evita los robos de A.6", x: M, y: 5.15, w: CW, h: 1.6, texto: "Antes de firmar cada approve, mirar A QUIÉN se autoriza y CUÁNTO. Aprobar el precio exacto, no una cantidad ilimitada. Revocar cuando ya no se usa es poner la allowance en cero. Es el mismo cuidado que le habría ahorrado 120 millones de dólares a las víctimas de Badger.", size: 12.5 });
    s.addNotes("Todo con hashes verificables en el explorador de Sepolia. Un token que no aparece en la cadena no se califica. La revocación es literalmente approve(canje, 0): la guía lo muestra paso a paso.");
  }

  {
    const s = await D.lamina({ kicker: "B.3b · errores comunes del laboratorio", titulo: "Síntoma, causa y arreglo", ic: "alerta", tituloSize: 28 });
    D.tabla(s, ["síntoma", "causa y arreglo"], [
      ["Desplegué y no veo el token en MetaMask.", "No falló: hay que importarlo con la dirección del contrato (A.3)."],
      ["acunar(ana, 100) y aparece 0,0000000000000001.", "Falta multiplicar por 10 ** decimals() (TODO 1 y 2)."],
      ["canjear() revierte con ERC20InsufficientAllowance.", "No aprobaron, aprobaron menos del precio, o ya se gastó/revocó. approve del precio exacto."],
      ["canjear() revierte con ERC20InsufficientBalance.", "Hay allowance pero no saldo: la cuenta no tiene 25 fichas."],
      ["acunar revierte con OwnableUnauthorizedAccount.", "Se llamó desde una cuenta que no desplegó el token. Solo el organizador acuña."],
      ["La verificación en Etherscan falla.", "Falta ETHERSCAN_API_KEY en el keystore, o esperar un minuto y repetir el MISMO comando."],
    ], { y: 1.9, h: 4.4, colW: [5.0, 7.093], size: 11.5 });
    D.parrafo(s, "La tabla completa, con más casos, está en la guía del laboratorio (sección 10).", { y: 6.4, h: 0.4, size: 12, color: C.ocre });
    s.addNotes("Los nombres de error son los de OpenZeppelin 5.6.1, verificados en test/s10 (ERC20InsufficientAllowance, ERC20InsufficientBalance, OwnableUnauthorizedAccount, ERC20ExceededCap).");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · qué se entrega", titulo: "Evidencia del laboratorio 10", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["Token verificado", "FichaUSB en Sepolia, verificado, importado en la billetera.", "35 %"],
      ["Transferencia", "Hash de una transferencia entre dos cuentas del curso.", "20 %"],
      ["Canje completo", "Hashes de: approve, canjear, y el intento fallido tras revocar.", "30 %"],
      ["Tokenómica", "Un párrafo: ¿por qué eligieron ese tope? ¿Quemarían? ¿Cómo repartirían?", "15 %"],
    ], { y: 1.9, h: 3.1, colW: [2.6, 7.893, 1.6], size: 12 });
    D.parrafo(s, "Todo con hashes verificables en el explorador. Un token que no aparece en la cadena no se califica (política de laboratorios del curso).", { y: 5.2, h: 0.5, size: 13, color: C.ocre });
    s.addNotes("La guía en PDF trae la lista de chequeo de entrega y la rúbrica completa. El párrafo de tokenómica anticipa el bloque C.");
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "El proyecto", sub: "Muchos proyectos no necesitan un token. Decidir eso con honestidad vale tanto como diseñar uno bueno.", minutos: "APROXIMADAMENTE 30 MINUTOS", ic: "bandera" });

  {
    const s = await D.lamina({ kicker: "C.1 · la decisión", titulo: "¿Su proyecto lleva token, o no?", ic: "balanza", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Sí, si…", items: ["Hay algo intercambiable que circula entre usuarios.", "Se necesita representar valor, puntos o participación fungibles.", "La interoperabilidad con otras apps aporta de verdad."] },
      { et: "No, si…", linea: C.rojo, color: C.rojo, items: ["El token se añade «porque es un curso de blockchain».", "Una variable en un contrato haría lo mismo sin token.", "Solo sirve para especular, sin uso real dentro del proyecto."] },
      { y: 1.9, h: 2.55, size: 13 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Plantilla de decisión (media página, para el Avance 1)", x: M, y: 4.65, w: CW, h: 2.1, texto: "Respondan por escrito: (1) ¿Qué circula entre usuarios y por qué debe ser fungible? (2) ¿Una variable en un contrato lo resolvería sin token? (3) Si SÍ lleva token: suministro, emisión, quema y distribución. Si NO: por qué. Las dos respuestas valen igual; lo que no vale es un token decorativo. Es el mismo criterio de pertinencia de la Sesión 1.", size: 12.5 });
    s.addNotes("La plantilla corta de decisión también está dentro de la guía del laboratorio (sección de tokenómica), para que la puedan completar fuera de clase. Es el trabajo autónomo hacia el Avance 1.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · la plantilla de decisión", titulo: "¿Mi proyecto lleva token? En cinco preguntas", ic: "lista", tituloSize: 25 });
    D.tabla(s, ["#", "pregunta", "si la respuesta es…"], [
      ["1", "¿Qué circula entre usuarios, y por qué cada unidad debe ser idéntica a otra?", "«Nada circula» → no lleva token."],
      ["2", "¿Una variable o un mapping en un contrato haría lo mismo?", "«Sí» → no lleva token: usen el mapping."],
      ["3", "¿Aporta algo que billeteras y otras apps lo reconozcan (interoperabilidad)?", "«No» → el estándar ERC-20 sobra."],
      ["4", "Si lleva: ¿suministro, emisión, quema y distribución? (A.11)", "Cada respuesta con su porqué, en una línea."],
      ["5", "¿Quién puede cambiar las reglas después, y quién lo controla? (A.11c)", "Si es una sola llave, justificar por qué."],
    ], { y: 1.9, h: 3.6, colW: [0.6, 6.4, 5.093], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Ejemplo resuelto: un registro de diplomas", x: M, y: 5.65, w: CW, h: 1.12, texto: "Un diploma no es intercambiable (pregunta 1: nada fungible circula) y un mapping lo resuelve (pregunta 2). Conclusión: no lleva ERC-20. Si acaso, un token no fungible, tema de la Sesión 11.", size: 12 });
    s.addNotes("La plantilla también está en la guía (sección 9) para completarla fuera de clase: media página para el Avance 1. El ejemplo de diplomas es de la lista de proyectos viables del plan (sección 8) y engancha con la S11 (ERC-721).");
  }

  await D.preguntaSemana({
    pregunta: "¿Han aprobado alguna vez una cantidad ilimitada de un token a una aplicación? Revisen sus aprobaciones activas con una herramienta de revocación y cuenten qué encontraron.",
    trabajo: [
      "Entregar la evidencia del laboratorio 10 (token verificado + hashes).",
      "Completar la plantilla de decisión de tokenómica del proyecto (lleva token o no).",
      "Leer sobre NFTs e IPFS para la Sesión 11: la diferencia entre «el NFT» y «el archivo».",
      "Quien no haya empezado la nivelación de React: la Sesión 12 la asume por completo.",
    ],
    notas: "La pregunta engancha con el caso Badger de A.6. Herramientas: revoke.cash o el 'Token Approvals' del explorador. En testnet las aprobaciones son las mismas que en mainnet.",
  });

  await D.cierre({
    frase: "Un token no vale por su código. Vale porque todo el ecosistema ya sabe hablarle.",
    sub: "Hoy construyeron algo fungible: cada unidad igual a otra. La próxima sesión, lo contrario: tokens únicos, y el problema de dónde vive de verdad la imagen.",
    proxima: "Sesión 11 · NFTs, ERC-721/1155 y almacenamiento descentralizado",
  });

  return D.guardar(path.join(__dirname, "Sesion-10-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
