/* =====================================================================
   Sesión 09 · Seguridad de contratos inteligentes
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 09 · SEGURIDAD DE CONTRATOS INTELIGENTES", titulo: "Sesión 09 · Seguridad de contratos" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 09 · UNIDAD II · CIERRE",
    titulo: "EL CÓDIGO ES\nPÚBLICO, CUSTODIA\nVALOR Y NO SE\nPARCHA",
    sub: "Hoy cambiamos de lado: para defender un contrato hay que saber atacarlo. Y al final, un parcial: encontrar, explotar y corregir.",
    palabra: "ATACAR",
    ic: "candado",
    notas: "Sesión más intensa del curso. El bloque A termina con reentrancy explotada en vivo; B es Ethernaut; C es el parcial calificado.",
  });

  await D.agenda({
    intro: "Cierra la Unidad II. Primero la taxonomía y un robo en vivo; después el CTF; y de últimas, 90 minutos de parcial individual.",
    bloques: [
      ["A", "TAXONOMÍA Y REENTRANCY", "Las vulnerabilidades más caras de la historia, y una explotada en vivo.", "~55 min"],
      ["B", "ETHERNAUT + AUDITORÍA", "Cinco niveles del CTF y auditoría cruzada entre equipos.", "~50 min"],
      ["C", "PARCIAL PRÁCTICO", "Encontrar, explotar y corregir. Individual, libro abierto.", "90 min"],
    ],
    notas: "Con el parcial de 90 min, los bloques A y B tienen que caber en 90. Ser estricto con el reloj.",
  });

  await D.objetivo({
    objetivo: "Identificar, explotar y remediar las vulnerabilidades más frecuentes de los contratos inteligentes.",
    preguntas: [
      "¿Por qué la seguridad aquí es distinta de la de una aplicación web?",
      "¿Cómo se roba un contrato con reentrancy, línea por línea?",
      "¿Qué defensas existen, y por qué ninguna sola basta?",
      "¿Cómo se lee un contrato ajeno buscando el fallo?",
    ],
    ra: "RA5 · Identificar y remediar vulnerabilidades típicas mediante análisis manual y herramientas automáticas.",
  });

  await D.glosario({
    items: [
      ["Reentrancy", "reentrada", "Un contrato externo vuelve a llamar antes de que el primero termine de actualizar su estado."],
      ["CEI", "Checks-Effects-Interactions", "Validar, actualizar el estado propio y solo al final llamar hacia afuera."],
      ["tx.origin", "origen de la transacción", "La cuenta que firmó. NUNCA para permisos: quien llama directo es msg.sender."],
      ["delegatecall", "llamada delegada", "Ejecuta el código de otro contrato con el almacenamiento del propio. Poderosa y peligrosa."],
      ["MEV", "Maximal Extractable Value", "Ganancia que un productor de bloques extrae reordenando, insertando o censurando transacciones."],
      ["Oráculo", "oracle", "Servicio que trae datos externos a la cadena. Su manipulación es un vector de ataque frecuente."],
      ["Slither", "analizador estático", "Herramienta que revisa el código sin ejecutarlo y marca patrones peligrosos."],
      ["Ethernaut", "CTF de OpenZeppelin", "Serie de contratos que hay que «hackear» para aprender vulnerabilidades jugando."],
    ],
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "Taxonomía y reentrancy", sub: "Cada vulnerabilidad de esta lista costó dinero real. Varias, cientos de millones. Ninguna era código roto: era código que hacía exactamente lo que decía.", minutos: "APROXIMADAMENTE 55 MINUTOS", ic: "bicho" });

  {
    const s = await D.lamina({ kicker: "A.1 · por qué es diferente", titulo: "Tres cosas que no pasan en una app normal", ic: "candado", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "Una aplicación web", items: ["Si hay un error, se publica un parche.", "El código corre en un servidor privado.", "El dinero está en un banco con reversos y soporte."] },
      { et: "Un contrato", linea: C.rojo, color: C.rojo, items: ["El código desplegado es inmutable: no hay parche.", "Es público: cualquiera lo lee y lo estudia.", "Custodia valor directamente, y las transferencias no se revierten."] },
      { y: 1.9, h: 2.6, size: 13 });
    D.enunciado(s, "En la web, un atacante busca una puerta mal cerrada. Aquí tiene los planos del edificio, tiempo ilimitado, y si entra se lleva la caja fuerte sin que nadie pueda perseguirlo.", { y: 4.7, h: 1.4, size: 17 });
    D.parrafo(s, "Por eso el orden es: escribir menos, reutilizar código auditado, probar los bordes (Sesión 8) y auditar antes de tocar dinero.", { y: 6.25, h: 0.5, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.2 · el mapa", titulo: "La taxonomía de hoy", ic: "lista", tituloSize: 30 });
    D.tabla(s, ["vulnerabilidad", "en una frase", "caso célebre"], [
      ["Reentrancy", "Vuelven a entrar antes de que actualices el estado.", "The DAO, 2016 · ~60 M USD"],
      ["Control de acceso", "Falta un permiso, o se comprueba mal (tx.origin).", "Parity multisig, 2017"],
      ["delegatecall no protegido", "Código ajeno escribe en tu almacenamiento.", "Parity, 2017 · ~150 M USD congelados"],
      ["Desbordamiento aritmético", "Un número da la vuelta. Resuelto en 0.8.", "BeautyChain, 2018"],
      ["Aleatoriedad on-chain", "El azar es predecible o influenciable.", "Múltiples loterías"],
      ["Front-running / MEV", "Ven tu transacción y se adelantan.", "DEX, a diario"],
      ["Manipulación de oráculos", "Falsean el precio del que dependes.", "Ataques con flash loans"],
      ["DoS por bucle o receptor", "Un dato o una cuenta bloquean a todos.", "King of the Ether, 2016"],
    ], { y: 1.9, h: 4.55, colW: [3.0, 5.0, 4.093], size: 11 });
    D.parrafo(s, "Reentrancy la explotamos en vivo. Las demás, con ejemplos. Todas pueden salir en el parcial.", { y: 6.55, h: 0.35, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.3 · el contrato que vamos a robar", titulo: "Un banco que parece correcto", ic: "moneda", tituloSize: 28 });
    D.codigo(s, `contract BancoVulnerable {
    mapping(address => uint256) public saldos;

    function depositar() external payable {
        saldos[msg.sender] += msg.value;
    }

    function retirar() external {
        uint256 monto = saldos[msg.sender];
        require(monto > 0, "sin saldo");

        (bool ok, ) = payable(msg.sender).call{value: monto}("");
        require(ok, "envio fallido");

        saldos[msg.sender] = 0;    // <-- el saldo se limpia AL FINAL
    }
}`, { x: M, y: 1.9, w: 7.4, h: 4.85, lang: "sol", size: 11.5 });
    D.lista(s, [
      "Lleva la cuenta de cada depósito.",
      "Solo deja retirar lo propio.",
      "Comprueba que el envío no falle.",
      "Pone el saldo en cero.",
    ], { x: M + 7.7, y: 1.9, w: CW - 7.7, h: 2.4, size: 13, gap: 8 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta antes de seguir", x: M + 7.7, y: 4.5, w: CW - 7.7, h: 2.2, texto: "Todo parece bien. ¿En qué línea está el fallo? Pista: piensen qué pasa DURANTE el call, antes de la última línea.", size: 13 });
    s.addNotes("Dar 60 segundos para que lo encuentren antes de pasar. Muchos verán que el orden está invertido.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · el fallo", titulo: "El envío cede el control al atacante", ic: "alerta", tituloSize: 28 });
    D.parrafo(s, "call{value: monto} no es solo mover ETH. Si el receptor es un contrato, EJECUTA su función receive(). Y ahí, el atacante toma el control con el saldo todavía sin limpiar.", { y: 1.9, h: 0.95, size: 14.5 });
    D.pasos(s, [
      ["LÍNEA 1 DEL ATAQUE", "El banco ejecuta call y le envía el ETH al contrato atacante."],
      ["EL CONTROL SALTA", "Se ejecuta receive() del atacante — antes de que el banco llegue a saldos = 0."],
      ["EL ATACANTE REENTRA", "Desde receive() vuelve a llamar retirar(). El banco aún cree que tiene saldo."],
      ["SE REPITE", "El banco vuelve a enviar. Y otra vez. Hasta que se queda sin fondos."],
    ], { y: 3.0, alto: 0.82, gap: 0.12, anchoEt: 3.0, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "La regla que se violó", x: M, y: 6.02 - 0.1, w: CW, h: 0.86, texto: "Interacción (enviar) antes que efecto (limpiar el saldo). Es exactamente al revés de Checks-Effects-Interactions.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.5 · el exploit", titulo: "Trece líneas que vacían el banco", ic: "codigo", tituloSize: 28 });
    D.codigo(s, `contract Atacante {
    IBanco banco;  uint256 cebo;

    function atacar() external payable {
        cebo = msg.value;
        banco.depositar{value: msg.value}();   // deposita 1
        banco.retirar();                        // pide su retiro
    }

    receive() external payable {                // el banco le paga...
        if (address(banco).balance >= cebo) {
            banco.retirar();                    // ...y vuelve a entrar
        }
    }
}`, { x: M, y: 1.9, w: 7.6, h: 4.5, lang: "sol", size: 11.5 });
    D.cifra(s, "1 → 11", "deposita 1 ETH, se lleva los 11 del banco", { x: M + 7.9, y: 1.9, w: CW - 7.9, h: 1.9, color: C.rojo, size: 30 });
    D.parrafo(s, "Verificado en test/s09: tres clientes honestos tenían 10 ETH; el atacante depositó 1 y salió con 11. El banco quedó en cero, y los saldos honestos quedaron impagables.", { x: M + 7.9, y: 3.95, w: CW - 7.9, h: 1.8, size: 12.5 });
    s.addNotes("Correr la prueba en vivo: npx hardhat test test/s09/Reentrancy.test.js. Ver el balance del banco caer a 0.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · el robo real", titulo: "The DAO, junio de 2016", ic: "grafico", tituloSize: 30 });
    D.parrafo(s, "The DAO era un fondo de inversión colectivo gobernado por contrato. Recaudó una de las mayores sumas de su tiempo. Tenía exactamente este error.", { y: 1.9, h: 0.9, size: 14.5 });
    D.cifra(s, "~3,6 M ETH", "drenados por reentrancy en unas horas", { x: M, y: 3.0, w: 3.9, h: 1.7, color: C.rojo, size: 26 });
    D.cifra(s, "≈ 5 %", "de todo el ETH que existía entonces", { x: M + 4.1, y: 3.0, w: 3.9, h: 1.7, color: C.violeta, size: 30 });
    D.cifra(s, "1 línea", "el orden invertido de dos instrucciones", { x: M + 8.2, y: 3.0, w: CW - 8.2, h: 1.7, size: 26 });
    D.parrafo(s, "La respuesta partió a Ethereum en dos: la mayoría hizo una bifurcación dura para revertir el robo (la cadena que hoy llamamos Ethereum); una minoría se negó por principio y siguió en la cadena original (Ethereum Classic). Es el ejemplo de la Sesión 4 sobre que la inmutabilidad también es una convención social.", { y: 5.0, h: 1.6, size: 13.5 });
    s.addNotes("Conectar con S4 (hard fork) y con S6 (el código hace lo que dice, no lo que se quería). Es el caso que amarra media Unidad II.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · la defensa", titulo: "Dos cinturones para el mismo riesgo", ic: "escudo", tituloSize: 29 });
    D.dosColumnas(s,
      { et: "1 · Checks-Effects-Interactions", texto: "saldos[msg.sender] = 0;   // primero\n(bool ok, ) = ...call{value: monto}(\"\");\n\nCuando el atacante recibe el control, su saldo ya es cero. Reentrar no sirve: no hay nada que cobrar." },
      { et: "2 · ReentrancyGuard", texto: "function retirar() external nonReentrant { ... }\n\nUn cerrojo que se cierra al entrar y se abre al salir. La segunda entrada revierte, aunque alguien olvide el orden." },
      { y: 1.9, h: 2.75, size: 12.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Por qué ambas, si una basta", x: M, y: 4.85, w: CW, h: 1.85, texto: "CEI es la corrección de fondo y no cuesta gas extra. El guard es defensa en profundidad: protege del error humano futuro, cuando alguien modifique la función dentro de seis meses y rompa el orden sin darse cuenta. En seguridad no se apuesta todo a una sola barrera.", size: 13 });
    s.addNotes("Verificado: contra BancoSeguro el mismo atacante revierte y el banco conserva sus 10 ETH.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · control de acceso", titulo: "El permiso que mira a la cuenta equivocada", ic: "llave", tituloSize: 26 });
    D.codigo(s, `require(tx.origin == admin, "solo admin");   // MAL
require(msg.sender == admin, "solo admin");  // BIEN`, { x: M, y: 1.9, w: CW, h: 1.2, lang: "sol", size: 12.5 });
    D.dosColumnas(s,
      { et: "tx.origin", linea: C.rojo, color: C.rojo, texto: "La cuenta que FIRMÓ la transacción, al principio de toda la cadena de llamadas. Si el admin firma una transacción a un contrato malicioso, ese contrato llama al vault y tx.origin sigue siendo el admin: la comprobación pasa." },
      { et: "msg.sender", texto: "Quien llama DIRECTAMENTE a esta función. Si el contrato malicioso llama al vault, msg.sender es el contrato malicioso, no el admin: la comprobación falla, como debe ser." },
      { y: 3.3, h: 2.3, size: 13 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Regla sin excepciones", x: M, y: 5.75, w: CW, h: 0.95, texto: "tx.origin nunca se usa para autorizar. Su único uso legítimo es raro. Ante la duda, msg.sender.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.9 · el resto de la taxonomía · 1 de 2", titulo: "delegatecall, desbordamiento, azar", ic: "bicho", tituloSize: 26 });
    D.tabla(s, ["vulnerabilidad", "el mecanismo", "la defensa"], [
      ["delegatecall no protegido", "Ejecuta código ajeno con TU almacenamiento y TU saldo. Si apunta a un contrato que alguien controla, se apodera del tuyo.", "No usarlo salvo para proxies bien entendidos. Nunca hacia una dirección que un usuario elija."],
      ["Desbordamiento aritmético", "Un uint8 en 255 más 1 daba 0. Antes de 0.8 pasaba en silencio.", "Solidity 0.8 revierte solo. Cuidado con los bloques unchecked."],
      ["Aleatoriedad on-chain", "block.timestamp y block.prevrandao son conocidos o influenciables; un contrato calcula el mismo «azar» antes de apostar.", "Oráculo de aleatoriedad (Chainlink VRF) o esquema commit-reveal. Nunca variables de bloque."],
    ], { y: 1.9, h: 3.8, colW: [2.8, 5.4, 3.893], size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El azar entra en el parcial", x: M, y: 5.86, w: CW, h: 0.92, texto: "«Poner más variables de bloque» no arregla la aleatoriedad. Es la respuesta que hay que evitar.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.10 · el resto de la taxonomía · 2 de 2", titulo: "MEV, oráculos y denegación de servicio", ic: "bicho", tituloSize: 27 });
    D.tabla(s, ["vulnerabilidad", "el mecanismo", "la defensa"], [
      ["Front-running / MEV", "Todas las transacciones pendientes son públicas. Quien arma el bloque puede colar la suya antes, o reordenar, para ganar a costa tuya.", "Límites de deslizamiento, subastas por lotes, revelar en dos pasos. No suponer orden de llegada."],
      ["Manipulación de oráculos", "Un contrato que lee el precio «spot» de un DEX se engaña moviendo ese precio con un préstamo relámpago, dentro de la misma transacción.", "Precios promediados en el tiempo (TWAP), varios oráculos, Chainlink. Nunca un solo precio spot."],
      ["DoS por bucle o receptor", "Un arreglo que crece sin límite (S7) o un receptor que revierte (King of the Ether) bloquean la función para todos.", "Patrón de retiro. No recorrer arreglos ilimitados. No depender de que un envío externo funcione."],
    ], { y: 1.9, h: 4.1, colW: [2.8, 5.4, 3.893], size: 11 });
    D.parrafo(s, "Los préstamos relámpago (flash loans) no son un ataque en sí: son crédito sin garantía que se pide y devuelve en una transacción. Amplifican los otros ataques. Se ven a fondo en la Sesión 14.", { y: 6.15, h: 0.6, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.11 · el ciclo de vida seguro", titulo: "La seguridad no es un paso: es una cadena", ic: "escudo", tituloSize: 26 });
    const capas = [
      ["ESCRIBIR MENOS", "Cada línea propia es superficie de ataque. Reutilizar OpenZeppelin auditado en lugar de reescribir."],
      ["PROBAR LOS BORDES", "La suite de la Sesión 8, con pruebas que atrapan errores, no solo que dan cobertura."],
      ["ANÁLISIS ESTÁTICO", "Slither revisa el código sin ejecutarlo y marca patrones peligrosos en segundos."],
      ["FUZZING", "Miles de entradas al azar buscando romper una invariante que uno afirma siempre cierta."],
      ["AUDITORÍA EXTERNA", "Ojos que no escribieron el código. Cuesta, pero es la última red antes de custodiar valor."],
      ["RECOMPENSAS Y MONITOREO", "Pagar a quien encuentre fallos, y vigilar el contrato ya desplegado."],
    ];
    capas.forEach((c, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.6, h: 0.65, fontFace: F.display, fontSize: 17, color: C.naranja, margin: 0, valign: "middle" });
      D.etiqueta(s, c[0], { x: M + 0.7, y: y + 0.06, w: 3.3, color: C.tinta, size: 10.5 });
      D.parrafo(s, c[1], { x: M + 4.2, y: y + 0.04, w: CW - 4.2, h: 0.6, size: 12.5, valign: "middle" });
      D.linea(s, M, y + 0.73, M + CW, y + 0.73, C.grisClaro, 1);
    });
    s.addNotes("Ninguna capa sola es suficiente. The DAO tenía pruebas. Muchos contratos auditados igual fueron robados. Es defensa en profundidad.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · una herramienta concreta", titulo: "Slither: un analizador en la terminal", ic: "lupa", tituloSize: 28 });
    D.codigo(s, `pip install slither-analyzer
slither contracts/s09/BancoVulnerable.sol`, { x: M, y: 1.9, w: CW, h: 1.05, lang: "js", size: 12.5 });
    D.dosColumnas(s,
      { et: "Qué encuentra bien", items: ["Reentrancy y orden CEI violado.", "Uso de tx.origin, de variables de bloque como azar.", "Envíos sin comprobar, visibilidad faltante.", "Docenas de patrones conocidos, en segundos y gratis."] },
      { et: "Qué NO puede hacer", linea: C.rojo, color: C.rojo, items: ["Entender la lógica de negocio: no sabe qué DEBERÍA hacer el contrato.", "Encontrar fallos de diseño nuevos.", "Reemplazar a un auditor humano."] },
      { y: 3.15, h: 2.5, size: 12.5 });
    D.parrafo(s, "En el proyecto: Slither sin hallazgos críticos es parte del criterio de seguridad de la rúbrica. Es el primer filtro, no el último.", { y: 5.8, h: 0.6, size: 13, color: C.ocre });
    s.addNotes("Slither exige Python. Si la sala no lo permite, hay una versión web y extensiones de VS Code. Mostrarlo sobre el BancoVulnerable en vivo si hay tiempo.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · lo que hay que llevarse del bloque A", titulo: "Seis ideas antes de atacar", ic: "lista", tituloSize: 29 });
    const ideas = [
      "El código es inmutable, público y custodia valor: no hay parche ni reverso.",
      "call a un contrato le cede el control: puede reentrar antes de que actualices el estado.",
      "Reentrancy se cierra con CEI, y se blinda con un guard. Ambos.",
      "Los permisos van con msg.sender, jamás con tx.origin.",
      "El azar seguro no existe on-chain: se necesita un oráculo o commit-reveal.",
      "La seguridad es una cadena de capas; ninguna sola basta.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14.5, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Ethernaut + auditoría cruzada", sub: "Jugar a romper contratos, y después leer el de otro equipo con la mirada de quien busca la grieta.", minutos: "APROXIMADAMENTE 50 MINUTOS", ic: "diana" });

  {
    const s = await D.lamina({ kicker: "B.1 · qué es Ethernaut", titulo: "Un CTF donde ganar es hackear", ic: "diana", tituloSize: 29 });
    D.parrafo(s, "Ethernaut, de OpenZeppelin, es una serie de contratos con una vulnerabilidad cada uno. Se «gana» un nivel explotándolo desde la consola del navegador. Es la mejor forma de fijar lo del bloque A.", { y: 1.9, h: 0.95, size: 14.5 });
    D.tabla(s, ["nivel", "vulnerabilidad", "con qué se conecta"], [
      ["Fallback", "Control de acceso por receive/fallback mal puestos.", "S7 receive/fallback"],
      ["Fal1out", "Un «constructor» que en realidad es una función pública.", "S6 constructor"],
      ["Token", "Desbordamiento aritmético (contrato en versión vieja).", "A.9 de hoy"],
      ["Re-entrancy", "El robo que acabamos de ver, para explotar con las manos.", "A.3 a A.7"],
      ["Force", "Enviar ETH a un contrato que no tiene receive, con selfdestruct.", "Suposiciones falsas sobre el saldo"],
    ], { y: 3.0, h: 3.0, colW: [2.3, 5.6, 4.193], size: 11.5 });
    D.parrafo(s, "Prerrequisito: el nivel 0 (Hello Ethernaut) quedó de trabajo de la Sesión 8. Hoy se empieza en Fallback.", { y: 6.2, h: 0.5, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · auditoría cruzada #1", titulo: "Leer el contrato de otro equipo", ic: "lupa", tituloSize: 28 });
    D.parrafo(s, "Cada equipo entrega el contrato principal de su proyecto y recibe el de otro. Media hora para auditarlo con una lista concreta.", { y: 1.9, h: 0.65, size: 14.5 });
    D.pasos(s, [
      ["RECORRER LA TAXONOMÍA", "Las ocho vulnerabilidades de A.2, una por una, contra el contrato recibido."],
      ["PASAR SLITHER", "Correrlo y leer los hallazgos: separar los reales de los falsos positivos."],
      ["CLASIFICAR", "Cada hallazgo con severidad —alta, media, baja— y la línea exacta."],
      ["PROPONER", "Para cada uno, la corrección mínima. No reescribir el contrato ajeno."],
    ], { y: 2.7, alto: 0.78, gap: 0.12, anchoEt: 3.2, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Qué se califica", x: M, y: 5.7, w: CW, h: 1.15, texto: "La calidad de la auditoría, no cuántos fallos tenga el otro. Un informe con «no hallé vulnerabilidades explotables, revisé esto y esto» vale.", size: 12 });
    s.addNotes("Este es el 'Ethernaut + auditoría cruzada #1' que vale 20% del segundo corte. La entrega del informe puede cerrarse fuera de clase si el tiempo aprieta.");
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "Parcial práctico", sub: "Un contrato con exactamente tres vulnerabilidades. Encontrarlas, explotar al menos una y corregir las tres. 90 minutos, individual, libro abierto.", minutos: "90 MINUTOS · 45 % DEL SEGUNDO CORTE", ic: "candado" });

  {
    const s = await D.lamina({ kicker: "C.1 · las reglas", titulo: "Cómo es el parcial", ic: "documento", tituloSize: 30 });
    D.tabla(s, ["", "detalle"], [
      ["Qué se entrega", "El contrato VaultVulnerable.sol con tres vulnerabilidades de la taxonomía de hoy."],
      ["Tarea 1 · identificar", "Nombrar las tres, con severidad y línea exacta."],
      ["Tarea 2 · explotar", "Una prueba en Hardhat que demuestre al menos un abuso."],
      ["Tarea 3 · corregir", "VaultCorregido.sol con las tres arregladas, sin romper lo legítimo."],
      ["Condiciones", "Individual. Libro abierto: material, documentación y el repositorio. Sin ayuda de otra persona ni de un asistente de IA."],
      ["Tiempo y peso", "90 minutos. 45 % del segundo corte."],
    ], { y: 1.9, h: 4.1, colW: [2.6, 9.493], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Una restricción importante", x: M, y: 6.02 - 0.1, w: CW, h: 0.86, texto: "No reescribir el contrato entero: corregir lo mínimo necesario. Reescribirlo cuesta puntos.", size: 12.5 });
    s.addNotes("El contrato está en evaluaciones/parcial-s09/VaultVulnerable.sol. La solución y la rúbrica, en SOLUCION-DOCENTE.md — no proyectar.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · cómo se califica", titulo: "Rúbrica sobre 20 puntos", ic: "voto", tituloSize: 30 });
    D.tabla(s, ["criterio", "puntos", "qué se espera"], [
      ["Identificar las tres", "6", "Nombre correcto y línea. Media si nombra sin ubicar."],
      ["Severidad justificada", "3", "Coherente con el impacto real de cada una."],
      ["Exploit funcional", "5", "Una prueba que demuestra el abuso. Más si roba fondos."],
      ["Corregir las tres", "4", "Las tres, sin romper depositar / retirar / repartir."],
      ["No romper lo legítimo", "2", "Prueba de humo del docente sobre el contrato corregido."],
    ], { y: 1.9, h: 3.1, colW: [3.6, 1.6, 6.893], size: 12 });
    D.parrafo(s, "Lo que NO cuenta como una de las tres: que falte un evento, que no haya pausa, que la contabilidad de un total no cuadre. Son mejoras o bugs, no vulnerabilidades de seguridad.", { y: 5.2, h: 0.75, size: 13, color: C.ocre });
    D.parrafo(s, "Pista general, sin regalar nada: las tres viven en funciones distintas. Una es de las que explotamos hoy; otra es de permisos; otra, de algo que parece azar.", { y: 6.0, h: 0.7, size: 13 });
  }

  await D.preguntaSemana({
    pregunta: "De las ocho vulnerabilidades de hoy, ¿cuáles podría tener SU proyecto? Revísenlo con la lista en la mano antes del Avance 1.",
    trabajo: [
      "Terminar los cinco niveles de Ethernaut si no se alcanzaron en clase.",
      "Entregar el informe de la auditoría cruzada #1.",
      "Pasar Slither al contrato del proyecto y anotar los hallazgos.",
      "Empezar la Unidad III: leer sobre el estándar ERC-20 para la Sesión 10.",
      "Nivelación de React: quien no lo haya visto, empezar el tutorial entregado. La Sesión 12 lo asume.",
    ],
    notas: "El tutorial de nivelación de React se entrega en esta sesión (material aparte). Es trabajo autónomo de ~4 horas.",
  });

  await D.cierre({
    frase: "Para escribir un contrato que nadie pueda robar, primero hay que aprender a robarlo.",
    sub: "Con esto cierra la Unidad II: ya saben escribir, probar, desplegar y auditar. La Unidad III construye cosas que la gente usa: tokens, NFTs y una interfaz de verdad.",
    proxima: "Sesión 10 · Tokens fungibles · el estándar ERC-20",
  });

  return D.guardar(path.join(__dirname, "Sesion-09-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
