/* =====================================================================
   Práctica · De la ficha al diploma
   Deck de INTRODUCCIÓN Y EXPLICACIÓN del laboratorio que sigue a la
   magistral de tokens. Dos laboratorios encadenados (ERC-20 y ERC-721/SBT),
   TODO EN HARDHAT LOCAL: sin ETH, sin red pública, sin IPFS real.

   Reutiliza, verbatim, las láminas de laboratorio de build-sesion-10.js
   (bloques A.5b, A.8, A.13, B.1, B.1b, B.1c) y de build-sesion-11.js
   (B.2, C.2), con las de IPFS/Sepolia reescritas a 100% local.

   Conteos verificados corriendo las pruebas (solc 0.8.34, Hardhat 3.16):
   FichaUSB.test.js = 12 passing · DiplomaUSB.test.js = 11 · DiplomaSBT = 9
   (los dos de s11 juntos = 20 passing).
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "PRÁCTICA · TOKENS Y NFT · LAB S10·S11", titulo: "Práctica · De la ficha al diploma" });
  const { C, F, M, CW } = D;

  /* ---------------------------------------------------------- apertura */
  await D.portada({
    kicker: "PRÁCTICA · UNIDAD III · WEB 3.0",
    titulo: "DE LA FICHA\nAL DIPLOMA",
    sub: "Dos laboratorios encadenados: un token fungible y una credencial única. Todo en la red local de Hardhat, sin ETH.",
    palabra: "PRACTICA",
    ic: "martillo",
    notas: "Gancho (2 min): ayer, en el tablero, explicamos los dos estándares de token. Hoy los construyen con sus manos y los dejan en verde. No hay teoría nueva: es puro taller. Todo corre en la red simulada de Hardhat, así que nadie se queda esperando ETH ni una puerta de IPFS.",
  });

  await D.agenda({
    intro: "Hoy construimos lo que ayer explicamos. Dos laboratorios en parejas, en máquina, todo en la red local de Hardhat: sin ETH, sin red pública, sin IPFS.",
    bloques: [
      ["A", "LAB 1 · TOKEN ERC-20 (FICHAUSB + CANJE)", "Token con tope y quema, y un puesto que cobra con approve + transferFrom. Completar 4 TODO hasta 12 pruebas en verde.", "~80 min"],
      ["B", "LAB 2 · NFT (DIPLOMA + SBT)", "DiplomaUSB (ERC-721 con tope) y el intransferible DiplomaSBT (ERC-5192). Hasta 20 pruebas en verde.", "~70 min"],
    ],
    notas: "170 min de taller + una pausa de 10. Es trabajo en parejas, en la máquina. Circular por las parejas preguntando '¿qué prueba falla y qué TODO la gobierna?' en vez de dictar la línea. Lo que no se termine se completa en casa: el entregable es local (pruebas en verde + informe), nada on-chain.",
  });

  await D.objetivo({
    objetivo: "Completar los contratos hasta que las pruebas pasen (12 en el Lab 1, 20 en el Lab 2), entendiendo cada pieza.",
    preguntas: [
      "¿Cómo se COMPONE un token a partir de las extensiones de OpenZeppelin?",
      "¿Por qué approve + transferFrom mueve mis tokens sin entregar mi clave?",
      "¿Qué hace único a un NFT, y dónde vive de verdad su metadata?",
      "¿Qué cambia una sola línea en _update para volver intransferible un diploma?",
    ],
    ra: "RA3 · Programar contratos aplicando estándares (ERC-20, ERC-721, OpenZeppelin) · RA4 · Suite de pruebas automatizadas.",
  });

  {
    const s = await D.lamina({ kicker: "El método", titulo: "Cómo se trabaja hoy", ic: "terminal", tituloSize: 29 });
    D.parrafo(s, "Trabajan sobre el ANDAMIAJE: los contratos con TODO que ya compilan. Copian cada archivo sobre contracts/, completan los TODO en orden y corren las pruebas hasta verlas en verde. La solución no se entrega: es justo el objetivo.", { y: 1.9, h: 0.85, size: 14 });
    D.codigo(s, `npm install                                                    # una sola vez
npx hardhat test test/s10/FichaUSB.test.js                     # Lab 1 · meta: 12 passing
npx hardhat test test/s11/DiplomaUSB.test.js test/s11/DiplomaSBT.test.js   # Lab 2 · meta: 20 passing`, { x: M, y: 2.9, w: CW, h: 1.55, lang: "js", titulo: "en la carpeta del laboratorio", size: 10.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Dos recordatorios", x: M, y: 4.65, w: CW, h: 1.35, texto: "npx hardhat test recibe ARCHIVOS, no carpetas. Y todo corre en la red local de Hardhat: sin ETH, sin red pública y sin subir nada a IPFS. El tokenURI del NFT será una cadena de prueba.", size: 12.5 });
    D.parrafo(s, "El orden sugerido: terminen el Lab 1 completo antes de abrir el Lab 2. El intransferible (DiplomaSBT) es un reto opcional que depende de que DiplomaUSB ya esté listo.", { y: 6.15, h: 0.55, size: 12, color: C.ocre });
    s.addNotes("Si una pareja no ve rojo al empezar, probablemente no copió el andamiaje sobre contracts/ y está corriendo la solución. El andamiaje vive en andamiaje/s10 y andamiaje/s11.");
  }

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "Lab 1 · Token ERC-20", sub: "FichaUSB (token con tope y quema) y Canje (el patrón approve + transferFrom). Cuatro TODO, doce pruebas en verde.", minutos: "APROXIMADAMENTE 80 MINUTOS · EN PAREJAS", ic: "moneda" });

  {
    const s = await D.lamina({ kicker: "A.1 · lo que se construye", titulo: "FichaUSB y Canje", ic: "moneda", tituloSize: 30 });
    D.tabla(s, ["parte", "qué hace", "estándar que aplica"], [
      ["FichaUSB", "Token de puntos con tope, acuñación controlada y quema.", "ERC20 + Capped + Burnable + Ownable"],
      ["acunar", "El organizador crea puntos, hasta el tope.", "_mint con control de acceso"],
      ["Canje", "Un puesto que cobra fichas por un premio, usando la aprobación.", "approve + transferFrom"],
    ], { y: 1.9, h: 2.4, colW: [2.3, 5.8, 3.993], size: 12 });
    D.codigo(s, `# Se copia el andamiaje sobre contracts/s10 y se completan los TODO 1-4
npx hardhat test test/s10/FichaUSB.test.js      # 12 pruebas: deben pasar`, { x: M, y: 4.45, w: CW, h: 1.0, lang: "js", size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Las pruebas ★ son las que importan", x: M, y: 5.55, w: CW, h: 1.2, texto: "No acuñar sobre el tope; quemar libera espacio; el canje retira exactamente lo aprobado; el contrato no puede tomar más. Esas cuatro son la tesis del laboratorio.", size: 12.5 });
    s.addNotes("El estudiante recibe el andamiaje con 4 TODO que compilan pero fallan las pruebas; la solución de referencia pasa las 12. Verificado: solución 12/12 verdes; andamiaje falla solo en lo TODO. Todo local.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · el token, casi entero heredado", titulo: "OpenZeppelin: componer extensiones", ic: "jerarquia", tituloSize: 25 });
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
    const s = await D.lamina({ kicker: "A.3 · el código que escriben", titulo: "Los cuatro TODO, en orden", ic: "codigo", tituloSize: 28 });
    D.pasos(s, [
      ["TODO 1 · EL TOPE", "En el constructor: ERC20Capped(topeEnTokens * 10 ** decimals()). Sin convertir, el tope es una fracción invisible."],
      ["TODO 2 · ACUNAR", "_mint(a, cantidadEnTokens * 10 ** decimals()). No revisar el tope aquí: lo hace Capped en _update."],
      ["TODO 3 · _UPDATE", "Una línea: super._update(from, to, value). Mientras esté vacío, NINGÚN saldo se mueve."],
      ["TODO 4 · CANJEAR", "transferFrom(msg.sender, tesoreria, precio), revert si false, sumar el premio y emitir Canjeado (ver A.4)."],
    ], { y: 1.9, alto: 0.84, gap: 0.12, anchoEt: 2.9, size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El orden importa", x: M, y: 5.8, w: CW, h: 1.0, texto: "Empiecen por el TODO 3: sin él casi todas las pruebas fallan, y los otros tres TODO parecen rotos aunque estén bien.", size: 12.5 });
    s.addNotes("Los TODO y sus pistas están en andamiaje/s10/FichaUSB.sol y Canje.sol, y explicados uno por uno en la guía (guias/s10-token-erc20.pdf). Circular por las parejas preguntando '¿qué prueba falla y qué TODO la gobierna?' en vez de dictar la línea.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · el Canje por dentro", titulo: "Qué pasa exactamente en canjear()", ic: "codigo", tituloSize: 27 });
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
    const s = await D.lamina({ kicker: "A.5 · cómo saben que terminaron", titulo: "Salida esperada, al empezar y al terminar", ic: "terminal", tituloSize: 26 });
    D.codigo(s, `# con el andamiaje recién copiado (salida real):
  2 passing
  10 failing          # pasan solo nombre/decimales y "solo el organizador acuña"

# con los cuatro TODO completos:
  12 passing          # esa es la meta

# ensayo del despliegue en la RED LOCAL de Hardhat (sin un peso):
[ FichaCanjeModulo ] successfully deployed
FichaCanjeModulo#FichaUSB - 0x5FbD...0aa3
FichaCanjeModulo#Canje    - 0xe7f1...0512`, { x: M, y: 1.9, w: CW, h: 3.5, lang: "py", titulo: "npx hardhat test test/s10/FichaUSB.test.js", size: 11 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Terminado significa dos cosas (todo local)", x: M, y: 5.4, w: CW, h: 1.4, texto: "(1) 12 pruebas en verde en su máquina. (2) Un informe corto: por qué canjear() no necesita require sobre la allowance, y qué pasa en un segundo canje sin re-aprobar. Nada on-chain.", size: 11.5 });
    s.addNotes("Salidas reales: el andamiaje da 2 passing/10 failing y la solución 12 passing; el módulo ignition/modules/s10-FichaCanje.js se desplegó en la red local (direcciones deterministas de Hardhat). No se despliega a ninguna red pública en esta práctica.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · verificación del Lab 1", titulo: "Tres preguntas antes de cerrar", ic: "pregunta", tituloSize: 27 });
    D.tabla(s, ["pregunta", "respuesta esperada"], [
      ["El token tiene 18 decimales. ¿Qué valor debe recibir approve para autorizar 25 fichas?", "25 × 10¹⁸ = 25000000000000000000 (parseUnits(\"25\", 18))."],
      ["Ana aprobó 25 al Canje y luego transfirió todo su saldo a Beto. ¿Funciona canjear()?", "No: la allowance sigue en 25, pero Ana no tiene saldo. approve no aparta tokens."],
      ["¿Por qué FichaUSB no hereda Pausable?", "Porque el freno sería un poder centralizado sin necesidad en este caso."],
    ], { y: 1.9, h: 3.3, colW: [6.3, 5.793], size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Cómo usar esta lámina", x: M, y: 5.4, w: CW, h: 1.35, texto: "Tapar la segunda columna. Una pareja responde cada pregunta en voz alta; otra la corrige. Si la mayoría falla la segunda, repasen la tabla de saldos de la magistral: es el error que más tiempo cuesta en el laboratorio.", size: 12.5 });
    s.addNotes("Verificación de cierre del Lab 1. La segunda pregunta: transferFrom revertiría con ERC20InsufficientBalance, no por allowance. Son los mismos conceptos que la magistral de ayer, ahora aterrizados en el código que acaban de escribir.");
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Lab 2 · Diploma NFT y el intransferible", sub: "DiplomaUSB (ERC-721 con tope) y DiplomaSBT, el mismo diploma pero «atado al alma» (ERC-5192). Todo local; el tokenURI es una cadena de prueba.", minutos: "APROXIMADAMENTE 70 MINUTOS · EN PAREJAS", ic: "imagen" });

  {
    const s = await D.lamina({ kicker: "B.1 · el mapa del lab", titulo: "Cuatro pasos, en este orden", ic: "lista", tituloSize: 29 });
    D.pasos(s, [
      ["CONTRATO DIPLOMA (20 MIN)", "Completar los TODO de emitir() y totalEmitidos() en DiplomaUSB. Meta: 11 pruebas en verde."],
      ["EL INTRANSFERIBLE (20)", "Reto opcional: los TODO de DiplomaSBT (locked, revocar, el if en _update). 9 pruebas más."],
      ["LEER EL CONTRATO (15)", "En la consola de Hardhat: emitir un diploma con un tokenURI de prueba y leer su dueño y su tokenURI."],
      ["INFORME (15)", "Responder las preguntas que traen los andamiajes (ver la última lámina)."],
    ], { y: 1.9, alto: 0.82, gap: 0.12, anchoEt: 3.3, size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Nada sale de la máquina", x: M, y: 5.6, w: CW, h: 1.15, texto: "El tokenURI es solo una cadena de prueba: hoy no se sube nada a IPFS. Todo corre en la red local de Hardhat, sin ETH.", size: 12 });
    s.addNotes("Tiempos orientativos que suman 70. Si una pareja se atrasa, lo prioritario es DiplomaUSB (las 11 pruebas) y el informe; el intransferible es reto opcional. La solución está en contracts/s11; al estudiante le llega el andamiaje. La guía es guias/s11-diploma-nft-ipfs.pdf.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · el contrato DiplomaUSB", titulo: "emitir(): checks, effects, interaction", ic: "codigo", tituloSize: 26 });
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
    D.parrafo(s, "¿Por qué _safeMint va al final? Si el receptor es un contrato, se le llama; el estado ya debe estar escrito (checks-effects-interactions, de la sesión de seguridad).", { y: 6.15, h: 0.55, size: 12.5, color: C.ocre });
    s.addNotes("La solución está en contracts/s11 del repositorio del docente; al estudiante le llega el andamiaje. Si alguien pone _safeMint antes de _setTokenURI, las pruebas pasan igual: úsenlo para discutir que una prueba verde no demuestra ausencia de riesgo, y que CEI es una disciplina, no un requisito de las pruebas.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · el intransferible, en código", titulo: "Un if en _update bloquea la transferencia", ic: "candado", tituloSize: 26 });
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
    s.addNotes("Dejen la pregunta abierta: es insumo para el informe. Respuesta madura: el SBT traslada el control de la persona a la institución emisora. Para un diploma eso quizá es correcto (la universidad ya es la autoridad), pero entonces la cadena aporta verificabilidad pública, no descentralización del poder.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · cómo saben que terminaron", titulo: "Salida esperada, al empezar y al terminar", ic: "terminal", tituloSize: 26 });
    D.codigo(s, `# DiplomaUSB, con el andamiaje recién copiado:
  4 passing
  7 failing           # las ★: tope, uri vacío, emitir, totalEmitidos

# DiplomaUSB, con los TODO completos:
  11 passing

# el intransferible (reto opcional), terminado:
  9 passing           # transferFrom revierte, locked, revocar, reemitir

# los dos archivos juntos:
  20 passing          # esa es la meta`, { x: M, y: 1.9, w: CW, h: 3.3, lang: "py", titulo: "npx hardhat test test/s11/DiplomaUSB.test.js test/s11/DiplomaSBT.test.js", size: 11 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Terminado significa (todo local)", x: M, y: 5.4, w: CW, h: 1.3, texto: "20 pruebas en verde (11 + 9) y un informe con las preguntas respondidas. Nada on-chain: la evidencia es la terminal.", size: 12 });
    s.addNotes("Conteos verificados corriendo las pruebas con solc 0.8.34 / Hardhat 3.16: DiplomaUSB.test.js = 11 passing, DiplomaSBT.test.js = 9, los dos juntos = 20. El split del andamiaje (4 passing / 7 failing) corresponde a los TODO sin completar en emitir() y totalEmitidos().");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · lo que más falla", titulo: "Errores comunes del laboratorio", ic: "alerta", tituloSize: 27 });
    D.tabla(s, ["síntoma", "causa y arreglo"], [
      ["No compila: «Derived contract must override function _update»", "En DiplomaSBT falta la firma exacta _update(address,uint256,address). Cópienla del andamiaje."],
      ["ERC721NonexistentToken al consultar el dueño", "Preguntan por un tokenId que no se emitió, o emitir() todavía tiene los TODO sin completar."],
      ["La prueba de «no transferible» NO revierte", "El if de _update está mal: debe revertir solo cuando from y to son AMBOS distintos de address(0)."],
      ["TopeAlcanzado al emitir en una prueba", "El tope del constructor se fijó más bajo que los diplomas que la prueba intenta emitir."],
      ["OwnableUnauthorizedAccount", "emitir() o revocar() se llaman desde una cuenta que no es la que desplegó (el owner)."],
      ["Locked no se emite al emitir", "Falta el emit Locked(tokenId) cuando from == address(0) (el último TODO del SBT)."],
    ], { y: 1.9, h: 4.85, colW: [4.6, 7.493], size: 10.5 });
    s.addNotes("Todos son errores LOCALES de compilación o de lógica; ninguno depende de una red. La guía PDF trae la tabla con más detalle. El error de override es el primero que ven si copian mal la firma del _update del SBT.");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · qué se entrega", titulo: "Evidencia del laboratorio (local)", ic: "documento", tituloSize: 28 });
    D.lista(s, [
      { text: "Captura de la terminal con 12 passing (Lab 1) y 20 passing (Lab 2).", bold: true },
      "Sus archivos completos: FichaUSB.sol, Canje.sol, DiplomaUSB.sol y —si hicieron el reto— DiplomaSBT.sol.",
      "Un informe corto (media página) que responda las preguntas de los andamiajes.",
    ], { y: 1.9, h: 2.1, size: 13.5, gap: 9 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Las preguntas del informe (vienen en los andamiajes)", x: M, y: 4.15, w: CW, h: 2.6, texto: "(1) ¿Qué evento estándar de ERC-721 aparece en el recibo de emitir(), además de DiplomaEmitido, y con qué dirección de origen? (2) ¿Por qué canjear() NO necesita un require sobre la allowance? (3) ¿Por qué DiplomaUSB no compila sin los override de tokenURI y supportsInterface? (4) En el reto del SBT: tras «billetera perdida», ¿quién conserva el poder real sobre el diploma?", size: 13 });
    s.addNotes("Es un entregable 100% local: no se pide hash de transacción ni contrato verificado, porque no se desplegó a ninguna red pública. Las tres primeras preguntas están literalmente como comentario dentro de los archivos de andamiaje; la cuarta sale de la lámina B.3.");
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "La actividad: qué se entrega y cómo se califica", sub: "Trabajo en grupos, en red local. La prueba en verde es parte de la nota.", minutos: "ENTREGA Y RÚBRICA", ic: "corte" });

  {
    const s = await D.lamina({ kicker: "C.1 · el entregable", titulo: "Qué se entrega", ic: "documento", tituloSize: 30 });
    D.parrafo(s, "Una sola entrega por grupo (los mismos del proyecto). Todo corre en la red local de Hardhat: no se necesita ETH, ni red pública, ni IPFS.", { y: 1.85, h: 0.55, size: 14 });
    D.tabla(s, ["evidencia", "detalle"], [
      ["Contratos completos", "FichaUSB.sol, Canje.sol, DiplomaUSB.sol y DiplomaSBT.sol con los // TODO resueltos."],
      ["Capturas de pruebas", "Terminal con 12 passing (Lab 1) y 20 passing (Lab 2) a la vista."],
      ["Informe corto", "Las 4 preguntas de reflexión respondidas con sus palabras (3–5 líneas cada una)."],
    ], { y: 2.55, h: 2.2, colW: [3.4, 8.693], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Lo esencial", x: M, y: 4.95, w: CW, h: 1.3, texto: "La evidencia es LOCAL: no se pide hash de transacción ni contrato verificado, porque no se despliega a ninguna red pública. Basta la terminal en verde y el informe.", size: 12.5 });
    s.addNotes("Entrega por grupo. Insistir en que la parte automática la verifican ellos mismos antes de entregar, corriendo las pruebas. La guía completa con esta misma rúbrica está en guias/rubrica-laboratorio-tokens-nft.pdf, dentro del zip.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · la rúbrica", titulo: "Cómo se califica · 100 puntos", ic: "balanza", tituloSize: 27 });
    D.parrafo(s, "Cuatro componentes. La parte automática es la prueba en verde (pasa o no pasa); la de argumento mide que expliquen el código con sus palabras.", { y: 1.85, h: 0.55, size: 14 });
    D.tabla(s, ["componente", "pts", "reparto interno"], [
      ["Lab 1 · Token (FichaUSB + Canje)", "30", "Pruebas en verde 22 (las 12) · explican los 4 TODO 8"],
      ["Lab 2 · Diploma NFT (DiplomaUSB)", "30", "Pruebas en verde 22 (las 11) · C-E-I y los override 8"],
      ["Lab 2b · SBT intransferible (DiplomaSBT)", "20", "Pruebas en verde 14 (las 9) · el if en _update y su trade-off 6"],
      ["Informe y reflexión", "20", "Las 4 preguntas de reflexión"],
    ], { y: 2.5, h: 2.65, colW: [4.4, 0.9, 6.793], size: 10.5 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "58 de 100 son automáticos", x: M, y: 5.35, w: CW, h: 1.3, texto: "La parte de pruebas (22 + 22 + 14) la verifican ustedes mismos con npm run ficha y npm run diploma. Los otros 42 puntos miden que entiendan lo que escribieron.", size: 12.5 });
    s.addNotes("SBT calificable (20 pts): una pareja que no alcance el reto aún llega a 80/100 con el resto. Crédito parcial a juicio del docente en lo automático si casi todas las pruebas pasan y falla un solo TODO.");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · el informe", titulo: "Preguntas de reflexión", ic: "pregunta", tituloSize: 29 });
    D.parrafo(s, "Valen 20 puntos. Se responden mirando SU código y SU proyecto, no en abstracto.", { y: 1.85, h: 0.5, size: 14 });
    D.lista(s, [
      "¿Qué evento estándar de ERC-721 emite emitir() además de DiplomaEmitido, y con qué dirección de origen?",
      "¿Por qué canjear() NO necesita un require sobre la allowance? (pruébenlo sin aprobar y miren el error).",
      "¿Por qué el contrato no compila sin los override de tokenURI y supportsInterface?",
      "¿Cuál de las tres familias (fungible / NFT / SBT) le aplicaría a su propio proyecto, y en qué función?",
    ], { numerada: true, y: 2.5, h: 2.75, size: 13, gap: 10 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Respuestas genéricas = 0", x: M, y: 5.45, w: CW, h: 1.2, texto: "La respuesta que valdría igual para cualquier curso —la que produce un asistente sin ver su código— no recibe puntos, aunque esté «bien escrita».", size: 12.5 });
    s.addNotes("Las tres primeras preguntas vienen como comentario dentro de los archivos de andamiaje; la cuarta sale del cierre del Lab 2. Permitir IA declarándola: la reflexión mide criterio, que es lo que un asistente taparía.");
  }

  await D.cierre({
    frase: "Lo fungible es una tabla de saldos; lo único, una fila por token. Y los dos salen de OpenZeppelin.",
    sub: "Ayer lo explicamos en el tablero; hoy lo construyeron y lo dejaron en verde, sin un peso y sin salir de su máquina.",
    proxima: "Siguiente · Frontend Web3 · conectar la interfaz a la cadena",
  });

  return D.guardar(path.join(__dirname, "Laboratorio-Tokens-y-NFT.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
