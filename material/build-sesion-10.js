/* =====================================================================
   Sesión 10 · Tokens fungibles: el estándar ERC-20
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 10 · TOKENS FUNGIBLES · ERC-20", titulo: "Sesión 10 · ERC-20" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 10 · UNIDAD III · WEB 3.0",
    titulo: "ERC-20\nUN ESTÁNDAR\nCOMPARTIDO",
    sub: "Un token no vale por su código, sino porque miles de aplicaciones ya saben hablarle. Eso es un estándar.",
    palabra: "ESTANDAR",
    ic: "moneda",
    notas: "Arranca la Unidad III: cosas que la gente usa. El punto de hoy es la interoperabilidad, no la sintaxis.",
  });

  await D.agenda({
    intro: "Se construye SOBRE OpenZeppelin, no a mano: el estándar ya está escrito y auditado. Hoy se decide la tokenómica y se aprende el patrón de aprobación.",
    bloques: [
      ["A", "EL ESTÁNDAR Y SU MECÁNICA", "Qué es un ERC, la interfaz, approve/transferFrom, decimales y tokenómica.", "~65 min"],
      ["B", "LABORATORIO 10", "Token con tope, quema y un contrato de canje que retira lo aprobado.", "~85 min"],
      ["C", "PROYECTO", "Diseñar la tokenómica, o justificar por qué el proyecto no lleva token.", "~30 min"],
    ],
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
    const s = await D.lamina({ kicker: "A.1 · qué es un estándar", titulo: "Por qué la forma importa más que el código", ic: "termino", tituloSize: 26 });
    D.parrafo(s, "Un ERC no obliga a nadie. Es un acuerdo: «si tu token tiene estas funciones con estos nombres, mi billetera, mi exchange y mi aplicación sabrán usarlo sin conocerte».", { y: 1.9, h: 0.95, size: 14.5 });
    D.enunciado(s, "Un token con código brillante pero funciones con otros nombres no lo reconoce nada. Un token del montón que cumple el estándar lo acepta todo el ecosistema.", { y: 3.0, h: 1.35, size: 18 });
    D.dosColumnas(s,
      { et: "Lo que gana el estándar", items: ["Cualquier billetera muestra el saldo sin saber del token.", "Cualquier exchange puede listarlo.", "Los contratos se componen: DeFi es lego."] },
      { et: "El costo del estándar", items: ["Hay que respetarlo aunque una parte no guste.", "Los errores del estándar se heredan (A.7).", "Innovar en la interfaz rompe la compatibilidad."] },
      { y: 4.55, h: 2.2, size: 12.5 });
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
  }

  {
    const s = await D.lamina({ kicker: "A.4 · sobre OpenZeppelin", titulo: "El token del laboratorio, casi entero heredado", ic: "jerarquia", tituloSize: 26 });
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
    D.parrafo(s, "El _update override es obligatorio en OpenZeppelin v5: al mezclar ERC20 y Capped hay que decir cuál gana.", { y: 6.4, h: 0.4, size: 12, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.5 · decimales", titulo: "Por qué 1 token son 1 000 000 000 000 000 000", ic: "moneda", tituloSize: 26 });
    D.parrafo(s, "La EVM no tiene coma flotante (Sesión 5). Un token con 18 decimales guarda internamente enteros enormes, y la coma es pura presentación.", { y: 1.9, h: 0.7, size: 14.5 });
    D.tabla(s, ["lo que ve la persona", "lo que guarda el contrato"], [
      ["1 FUSB", "1 000 000 000 000 000 000  (1 × 10¹⁸)"],
      ["0,5 FUSB", "500 000 000 000 000 000"],
      ["0,000000000000000001 FUSB", "1  (la unidad mínima, indivisible)"],
    ], { y: 2.75, h: 2.0, colW: [4.3, 7.793], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error de principiante", x: M, y: 4.95, w: CW, h: 1.75, texto: "Escribir acunar(ana, 100) pensando en 100 tokens, cuando la función espera unidades mínimas, acuña una fracción invisible. Por eso el token del laboratorio recibe la cantidad EN TOKENS y multiplica por 10**decimals() adentro: la interfaz habla en tokens, el contrato en unidades mínimas.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.6 · el patrón de aprobación", titulo: "Por qué transferir en dos pasos", ic: "llave", tituloSize: 28 });
    D.parrafo(s, "transfer mueve MIS tokens. Pero, ¿cómo deja un usuario que un CONTRATO —un exchange, un canje— mueva los suyos, sin entregarle su clave privada? Con una autorización previa y acotada.", { y: 1.9, h: 0.95, size: 14 });
    D.nodo(s, { x: M, y: 3.05, w: 3.5, h: 1.0, titulo: "1 · approve", sub: "Ana autoriza al canje\nhasta 25 fichas", fill: C.blanco, line: C.violeta, subSize: 11 });
    D.flecha(s, M + 3.5, 3.55, M + 4.3, 3.55, C.tinta, 2);
    D.nodo(s, { x: M + 4.3, y: 3.05, w: 3.7, h: 1.0, titulo: "2 · transferFrom", sub: "el canje retira 25,\nni una más", fill: C.blanco, line: C.naranja, subSize: 11 });
    D.flecha(s, M + 8.0, 3.55, M + 8.8, 3.55, C.tinta, 2);
    D.nodo(s, { x: M + 8.8, y: 3.05, w: CW - 8.8, h: 1.0, titulo: "allowance = 0", sub: "la autorización se gastó", fill: C.superf, subSize: 11 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Lo que hace seguro el patrón", x: M, y: 4.4, w: CW, h: 1.35, texto: "El contrato NUNCA puede mover más de lo aprobado. Verificado en el laboratorio: un segundo canje sin volver a aprobar revierte. La clave privada de Ana no sale nunca de su billetera.", size: 13 });
    D.parrafo(s, "Así funcionan todos los intercambios descentralizados: primero autorizas al contrato del DEX, después el DEX mueve tus tokens al hacer el swap.", { y: 5.9, h: 0.6, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.7 · el riesgo del patrón", titulo: "Aprobaciones ilimitadas: comodidad peligrosa", ic: "alerta", tituloSize: 26 });
    D.parrafo(s, "Muchas aplicaciones piden aprobar una cantidad gigante «para no molestar otra vez». Es cómodo y es el origen de robos enormes.", { y: 1.9, h: 0.7, size: 14.5 });
    D.dosColumnas(s,
      { et: "Qué pasa", linea: C.rojo, color: C.rojo, texto: "Si apruebas una cantidad ilimitada a un contrato, y ese contrato resulta malicioso o es hackeado más adelante, puede vaciar TODO tu saldo de ese token cuando quiera. La autorización sigue viva hasta que la revoques." },
      { et: "Qué hacer", texto: "Aprobar solo lo necesario para la operación. Revisar y revocar aprobaciones viejas (hay herramientas para verlas todas). Desconfiar de una aplicación que pide aprobación ilimitada sin explicarlo." },
      { y: 2.7, h: 2.55, size: 13 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Regla para el proyecto y para la vida", x: M, y: 5.45, w: CW, h: 1.25, texto: "Una aprobación es una llave que se queda con otro. Se entrega la más pequeña que sirva, y se recoge cuando ya no se usa. Poner la allowance en cero es revocarla.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.8 · aprobar con una firma", titulo: "EIP-2612 Permit: un paso menos", ic: "documento", tituloSize: 28 });
    D.parrafo(s, "El patrón clásico exige DOS transacciones: aprobar y luego usar. Permit deja aprobar con una FIRMA fuera de la cadena, que el contrato verifica al usarla. El usuario firma gratis; una sola transacción hace todo.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "Sin Permit", items: ["Transacción 1: approve (cuesta gas).", "Transacción 2: la operación (cuesta gas).", "Dos confirmaciones en la billetera."] },
      { et: "Con Permit (EIP-2612)", items: ["Una firma fuera de la cadena (gratis, sin gas).", "Transacción única: la operación incluye la aprobación.", "La firma usa EIP-712, que veremos en la Sesión 13."] },
      { y: 3.05, h: 2.1, size: 12.5 });
    D.parrafo(s, "OpenZeppelin lo trae en la extensión ERC20Permit. En el proyecto es opcional, pero mejora mucho la experiencia de usuario.", { y: 5.4, h: 0.6, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.9 · tokenómica", titulo: "Las reglas económicas son una decisión de diseño", ic: "grafico", tituloSize: 25 });
    D.tabla(s, ["decisión", "opciones", "qué comunica"], [
      ["Suministro", "Fijo (tope) vs. inflacionario (se emite sin fin).", "Un tope da escasez creíble; la inflación permite premiar sin fin, pero diluye."],
      ["Emisión", "Quién acuña y bajo qué regla.", "«El dueño imprime cuando quiere» es una señal de alarma."],
      ["Quema", "Si se pueden destruir tokens, y quién.", "La quema reduce el suministro: puede canjear o retirar de circulación."],
      ["Distribución inicial", "Cómo se reparte el primer lote.", "Si el equipo se queda con casi todo, los demás compran su salida."],
      ["Vesting", "Liberar por partes en el tiempo.", "Evita que los primeros vendan todo el día uno."],
    ], { y: 1.9, h: 3.7, colW: [2.6, 4.6, 4.893], size: 11 });
    D.enunciado(s, "Un diseño sostenible reparte y limita el poder de emisión. Un esquema extractivo concentra ambos en quien lo lanzó.", { y: 5.75, h: 0.95, size: 16, line: C.naranja });
  }

  {
    const s = await D.lamina({ kicker: "A.10 · lo que hay que llevarse del bloque A", titulo: "Seis ideas sobre tokens", ic: "lista", tituloSize: 28 });
    const ideas = [
      "Un token vale por cumplir el estándar, no por tener el mejor código.",
      "Todo el token es una tabla de saldos dentro de UN contrato.",
      "Se hereda de OpenZeppelin; casi nada se escribe a mano.",
      "No hay decimales reales: la interfaz habla en tokens, el contrato en unidades mínimas.",
      "approve + transferFrom deja que un contrato mueva tus tokens sin tu clave, y solo lo aprobado.",
      "La tokenómica es una decisión ética además de técnica: repartir y limitar, o concentrar.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Laboratorio 10", sub: "Un token con tope y quema, un contrato que canjea por aprobación, y la prueba de que no puede tomar más de lo autorizado.", minutos: "APROXIMADAMENTE 85 MINUTOS · EN PAREJAS", ic: "martillo" });

  {
    const s = await D.lamina({ kicker: "B.1 · lo que se construye", titulo: "FichaUSB y Canje", ic: "moneda", tituloSize: 30 });
    D.tabla(s, ["parte", "qué hace", "estándar que aplica"], [
      ["FichaUSB", "Token de puntos con tope, acuñación controlada y quema.", "ERC20 + Capped + Burnable + Ownable"],
      ["acunar", "El organizador crea puntos, hasta el tope.", "_mint con control de acceso"],
      ["Canje", "Un puesto que cobra fichas por un premio, usando la aprobación.", "approve + transferFrom"],
    ], { y: 1.9, h: 2.4, colW: [2.3, 5.8, 3.993], size: 12 });
    D.codigo(s, `npx hardhat test test/s10/FichaUSB.test.js      # 12 pruebas: deben pasar`, { x: M, y: 4.55, w: CW, h: 0.62, lang: "js", size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Las pruebas ★ son las que importan", x: M, y: 5.4, w: CW, h: 1.3, texto: "No acuñar sobre el tope; quemar libera espacio; el canje retira exactamente lo aprobado; el contrato no puede tomar más. Esas cuatro son la tesis de la sesión.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · en Remix o en Hardhat", titulo: "Desplegar, importar y transferir", ic: "cohete", tituloSize: 27 });
    D.pasos(s, [
      ["DESPLEGAR", "FichaUSB en Sepolia con un tope (por ejemplo 1 000 000). Verificar el código."],
      ["IMPORTAR EN LA BILLETERA", "Añadir el token con la dirección del contrato. Recordar: no aparece solo (A.3)."],
      ["ACUÑAR Y TRANSFERIR", "Acuñar puntos a un compañero y que él los vea en su billetera."],
      ["CANJEAR", "Desplegar Canje, aprobar el precio desde la billetera, y canjear. Revisar que la allowance quedó en cero."],
      ["REVOCAR", "Aprobar de nuevo y luego poner la aprobación en cero: ver que el canje ya no funciona."],
    ], { y: 1.9, alto: 0.82, gap: 0.12, anchoEt: 2.6, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Recordatorio de la billetera", x: M, y: 6.02 - 0.1, w: CW, h: 0.86, texto: "Antes de firmar cada approve, mirar A QUIÉN se autoriza y CUÁNTO. Es el gesto que evita los robos de A.7.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.3 · qué se entrega", titulo: "Evidencia del laboratorio 10", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["Token verificado", "FichaUSB en Sepolia, verificado, importado en la billetera.", "35 %"],
      ["Transferencia", "Hash de una transferencia entre dos cuentas del curso.", "20 %"],
      ["Canje completo", "Hashes de: approve, canjear, y el intento fallido tras revocar.", "30 %"],
      ["Tokenómica", "Un párrafo: ¿por qué eligieron ese tope? ¿Quemarían? ¿Cómo repartirían?", "15 %"],
    ], { y: 1.9, h: 3.1, colW: [2.6, 7.893, 1.6], size: 12 });
    D.parrafo(s, "Todo con hashes verificables en el explorador. Un token que no aparece en la cadena no se califica.", { y: 5.2, h: 0.5, size: 13, color: C.ocre });
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "El proyecto", sub: "Muchos proyectos no necesitan un token. Decidir eso con honestidad vale tanto como diseñar uno bueno.", minutos: "APROXIMADAMENTE 30 MINUTOS", ic: "bandera" });

  {
    const s = await D.lamina({ kicker: "C.1 · la decisión", titulo: "¿Su proyecto lleva token, o no?", ic: "balanza", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Sí, si…", items: ["Hay algo intercambiable que circula entre usuarios.", "Se necesita representar valor, puntos o participación fungibles.", "La interoperabilidad con otras apps aporta de verdad."] },
      { et: "No, si…", linea: C.rojo, color: C.rojo, items: ["El token se añade «porque es un curso de blockchain».", "Una variable en un contrato haría lo mismo sin token.", "Solo sirve para especular, sin uso real dentro del proyecto."] },
      { y: 1.9, h: 2.55, size: 13 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Trabajo autónomo, para el Avance 1", x: M, y: 4.65, w: CW, h: 2.05, texto: "Diseñar la tokenómica del proyecto —suministro, emisión, quema, distribución— O escribir medio página justificando por qué NO lleva token. Las dos respuestas valen igual; lo que no vale es un token decorativo. Es el mismo criterio de pertinencia de la Sesión 1.", size: 13.5 });
  }

  await D.preguntaSemana({
    pregunta: "¿Han aprobado alguna vez una cantidad ilimitada de un token a una aplicación? Revisen sus aprobaciones activas con una herramienta de revocación y cuenten qué encontraron.",
    trabajo: [
      "Entregar la evidencia del laboratorio 10.",
      "Diseñar la tokenómica del proyecto, o justificar por qué no lleva token.",
      "Leer sobre NFTs e IPFS para la Sesión 11: la diferencia entre «el NFT» y «el archivo».",
      "Quien no haya empezado la nivelación de React: la Sesión 12 la asume por completo.",
    ],
  });

  await D.cierre({
    frase: "Un token no vale por su código. Vale porque todo el ecosistema ya sabe hablarle.",
    sub: "Hoy construyeron algo fungible: cada unidad igual a otra. La próxima sesión, lo contrario: tokens únicos, y el problema de dónde vive de verdad la imagen.",
    proxima: "Sesión 11 · NFTs, ERC-721/1155 y almacenamiento descentralizado",
  });

  return D.guardar(path.join(__dirname, "Sesion-10-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
