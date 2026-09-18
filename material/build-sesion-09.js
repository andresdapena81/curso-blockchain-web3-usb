/* =====================================================================
   Sesión 09 · Seguridad de contratos inteligentes
   Estándar "más explicado" (modelo: build-sesion-04.js).
   Cifras de hackeos verificadas con fuente (ver notas del orador).
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 09 · SEGURIDAD DE CONTRATOS INTELIGENTES", titulo: "Sesión 09 · Seguridad de contratos" });
  const { C, F, M, CW } = D;

  /* ---------- helper local: lista de "ideas" numeradas a pantalla ---------- */
  function ideas(s, arr, size = 14.5) {
    arr.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* ---------------------------------------------------------- apertura */
  await D.portada({
    kicker: "SESIÓN 09 · UNIDAD II · CIERRE",
    titulo: "EL CÓDIGO ES\nPÚBLICO, CUSTODIA\nVALOR Y NO SE\nPARCHA",
    sub: "Hoy cambiamos de lado: para defender un contrato hay que saber atacarlo. Y al final, un parcial: encontrar, explotar y corregir.",
    palabra: "ATACAR",
    ic: "candado",
    notas: "Sesión más intensa del curso. El bloque A termina con reentrancy explotada en vivo; B es Ethernaut + auditoría cruzada; C es el parcial calificado de 90 minutos. Ser MUY estricto con el reloj: A y B tienen que caber en 90 minutos porque el parcial es intocable.",
  });

  await D.agenda({
    intro: "Cierra la Unidad II. Primero la taxonomía completa y un robo en vivo; después el CTF Ethernaut y la auditoría cruzada; y de últimas, 90 minutos de parcial individual.",
    bloques: [
      ["A", "TAXONOMÍA Y DEFENSAS", "Las vulnerabilidades más caras de la historia, una explotada en vivo, y el ciclo de vida seguro.", "~55 min"],
      ["B", "ETHERNAUT + AUDITORÍA", "Cinco niveles del CTF y auditoría cruzada #1 entre equipos.", "~35 min"],
      ["C", "PARCIAL PRÁCTICO", "Encontrar, explotar y corregir. Individual, libro abierto.", "90 min"],
    ],
    notas: "Con el parcial de 90 min, A y B tienen que caber en 90. Hay una pausa corta entre B y C. Repartir el enunciado del parcial impreso o por el canal solo al empezar el bloque C.",
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
      ["Proxy", "contrato actualizable", "Separa el almacenamiento (proxy) de la lógica (implementación) vía delegatecall, para poder cambiar el código."],
    ],
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "Taxonomía y defensas", sub: "Cada vulnerabilidad de esta lista costó dinero real. Varias, cientos de millones. Ninguna era código roto: era código que hacía exactamente lo que decía.", minutos: "APROXIMADAMENTE 55 MINUTOS", ic: "bicho" });

  {
    const s = await D.lamina({ kicker: "A.1 · por qué es diferente", titulo: "Tres cosas que no pasan en una app normal", ic: "candado", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "Una aplicación web", items: ["Si hay un error, se publica un parche.", "El código corre en un servidor privado.", "El dinero está en un banco con reversos y soporte."] },
      { et: "Un contrato", linea: C.rojo, color: C.rojo, items: ["El código desplegado es inmutable: no hay parche.", "Es público: cualquiera lo lee y lo estudia.", "Custodia valor directamente, y las transferencias no se revierten."] },
      { y: 1.9, h: 2.6, size: 13 });
    D.enunciado(s, "En la web, un atacante busca una puerta mal cerrada. Aquí tiene los planos del edificio, tiempo ilimitado, y si entra se lleva la caja fuerte sin que nadie pueda perseguirlo.", { y: 4.7, h: 1.4, size: 17 });
    D.parrafo(s, "Por eso el orden es: escribir menos, reutilizar código auditado, probar los bordes (Sesión 8) y auditar antes de tocar dinero.", { y: 6.25, h: 0.5, size: 13, color: C.ocre });
    s.addNotes("Abrir con una pregunta: '¿cuántos de ustedes han publicado un hotfix en producción?'. Aquí eso no existe. El error mental típico del estudiante: creer que un contrato es un backend más.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · el mapa", titulo: "La taxonomía de hoy: ocho vectores", ic: "lista", tituloSize: 28 });
    D.tabla(s, ["vulnerabilidad", "en una frase", "caso célebre (verificado)"], [
      ["Reentrancy", "Vuelven a entrar antes de que actualices el estado.", "The DAO, jun 2016 · ~3,6 M ETH"],
      ["Control de acceso", "Falta un permiso, o se comprueba mal (tx.origin).", "Parity multisig, jul 2017"],
      ["delegatecall no protegido", "Código ajeno escribe en tu almacenamiento.", "Parity, nov 2017 · 513.774 ETH congelados"],
      ["Desbordamiento aritmético", "Un número da la vuelta. Resuelto en 0.8.", "BeautyChain (BEC), abr 2018"],
      ["Aleatoriedad on-chain", "El azar es predecible o influenciable.", "SmartBillions, oct 2017 · ~400 ETH"],
      ["Front-running / MEV", "Ven tu transacción y se adelantan.", "DEX, a diario · «Flash Boys 2.0»"],
      ["Manipulación de oráculos", "Falsean el precio del que dependes.", "Mango Markets, oct 2022 · >110 M USD"],
      ["DoS por bucle o receptor", "Un dato o una cuenta bloquean a todos.", "King of the Ether, feb 2016"],
    ], { y: 1.9, h: 4.55, colW: [3.0, 5.0, 4.093], size: 11 });
    D.parrafo(s, "Reentrancy la explotamos en vivo. Las demás, con su caso real. Todas pueden salir en el parcial.", { y: 6.55, h: 0.35, size: 12.5, color: C.ocre });
    s.addNotes("⚠ Cifras verificadas (2026-09): The DAO 3,6 M ETH (coindesk, withsecure). Parity jul-2017 ~153.037 ETH robados; nov-2017 513.774,16 ETH congelados en 587 wallets (openzeppelin blog, parity postmortem). BEC = CVE-2018-10299 (NVD). SmartBillions ~400 ETH (~120k USD). Mango >110 M USD (CFTC 8647-23). King of the Ether feb 2016 (post-mortem kingoftheether.com). No dictar cifras que no estén aquí sin volver a verificar.");
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
    s.addNotes("Dar 60 segundos para que lo encuentren antes de pasar. Muchos verán que el orden está invertido. El contrato real está en contracts/s09/BancoVulnerable.sol.");
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
    await D.ficha(s, { tipo: "seguridad", etiqueta: "La regla que se violó", x: M, y: 5.92, w: CW, h: 0.86, texto: "Interacción (enviar) antes que efecto (limpiar el saldo). Es exactamente al revés de Checks-Effects-Interactions.", size: 12.5 });
    s.addNotes("El detalle fino: el saldo se pone en CERO al final, no se resta. Si fuera saldos[...] -= monto, el underflow chequeado de 0.8 cortaría la cascada. Con = 0 el ataque drena hasta vaciar. Vale mencionarlo al final.");
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
    s.addNotes("Correr la prueba en vivo: npx hardhat test test/s09/Reentrancy.test.js. Ver el balance del banco caer a 0 y el atacante quedar con 11 ETH. Es la prueba con ★.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · el robo real", titulo: "The DAO, junio de 2016", ic: "grafico", tituloSize: 30 });
    D.parrafo(s, "The DAO era un fondo de inversión colectivo gobernado por contrato. Recaudó una de las mayores sumas de su tiempo (del orden de 150 millones de dólares). Tenía exactamente este error.", { y: 1.9, h: 0.9, size: 14.5 });
    D.cifra(s, "~3,6 M ETH", "drenados por reentrancy en unas horas", { x: M, y: 3.0, w: 3.9, h: 1.7, color: C.rojo, size: 26 });
    D.cifra(s, "≈ 5 %", "de todo el ETH que existía entonces", { x: M + 4.1, y: 3.0, w: 3.9, h: 1.7, color: C.violeta, size: 30 });
    D.cifra(s, "1 línea", "el orden invertido de dos instrucciones", { x: M + 8.2, y: 3.0, w: CW - 8.2, h: 1.7, size: 26 });
    D.parrafo(s, "La respuesta partió a Ethereum en dos: la mayoría hizo una bifurcación dura para revertir el robo (la cadena que hoy llamamos Ethereum); una minoría se negó por principio y siguió en la cadena original (Ethereum Classic). Es el ejemplo de la Sesión 4 sobre que la inmutabilidad también es una convención social.", { y: 5.0, h: 1.6, size: 13.5 });
    s.addNotes("⚠ Verificado: 17 jun 2016, ~3,6 M ETH (≈ un tercio del fondo; ≈ 5% del ETH existente). Hard fork en el bloque 1.920.000, 20 jul 2016 → ETH / ETC. Fuentes: coindesk 'How the DAO hack changed Ethereum', withsecure labs, wikipedia Ethereum Classic. Conectar con S4 (hard fork) y S6 (el código hace lo que dice, no lo que se quería).");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · la defensa", titulo: "Dos cinturones para el mismo riesgo", ic: "escudo", tituloSize: 29 });
    D.dosColumnas(s,
      { et: "1 · Checks-Effects-Interactions", texto: "saldos[msg.sender] = 0;   // primero\n(bool ok, ) = ...call{value: monto}(\"\");\n\nCuando el atacante recibe el control, su saldo ya es cero. Reentrar no sirve: no hay nada que cobrar." },
      { et: "2 · ReentrancyGuard", texto: "function retirar() external nonReentrant { ... }\n\nUn cerrojo que se cierra al entrar y se abre al salir. La segunda entrada revierte, aunque alguien olvide el orden." },
      { y: 1.9, h: 2.75, size: 12.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Por qué ambas, si una basta", x: M, y: 4.85, w: CW, h: 1.85, texto: "CEI es la corrección de fondo y no cuesta gas extra. El guard es defensa en profundidad: protege del error humano futuro, cuando alguien modifique la función dentro de seis meses y rompa el orden sin darse cuenta. En seguridad no se apuesta todo a una sola barrera.", size: 13 });
    s.addNotes("Verificado en test/s09: contra BancoSeguro el mismo atacante revierte y el banco conserva sus 10 ETH. Detalle: revierte con EnvioFallido (la reentrada choca con el guard dentro del receive del atacante, ese receive revierte, y el envío del banco falla). ReentrancyGuard vive en @openzeppelin/contracts/utils/.");
  }

  {
    const s = await D.lamina({ kicker: "A.7b · verificación · reentrancy", titulo: "¿Entendieron el patrón?", ic: "pregunta", tituloSize: 30 });
    D.enunciado(s, "Un compañero dice: «lo arreglo poniendo require(msg.sender == tx.origin) para que solo entren personas, no contratos». ¿Resuelve la reentrancy?", { y: 1.95, h: 1.85, size: 19, line: C.naranja });
    D.dosColumnas(s,
      { et: "La respuesta corta", linea: C.rojo, color: C.rojo, texto: "No. Y además introduce OTRO problema: rompe la compatibilidad con billeteras-contrato (multisig, smart accounts) y usa tx.origin, que es justo lo que veremos que nunca se debe usar para lógica." },
      { et: "Lo que sí resuelve", texto: "Poner el efecto antes de la interacción (CEI). El guard es el refuerzo. La reentrancy es un problema de ORDEN, no de quién llama." },
      { y: 4.0, h: 1.9, size: 12.5 });
    s.addNotes("Pregunta de cierre del primer tramo del bloque A. Dar 30 segundos de discusión en parejas. El error 'msg.sender == tx.origin' es un antipatrón real que aparece en foros: sirve para lo contrario de lo que la gente cree y se rompe con account abstraction.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · control de acceso", titulo: "El permiso que mira a la cuenta equivocada", ic: "llave", tituloSize: 26 });
    D.codigo(s, `require(tx.origin == admin, "solo admin");   // MAL
require(msg.sender == admin, "solo admin");  // BIEN`, { x: M, y: 1.9, w: CW, h: 1.2, lang: "sol", size: 12.5 });
    D.dosColumnas(s,
      { et: "tx.origin", linea: C.rojo, color: C.rojo, texto: "La cuenta que FIRMÓ la transacción, al principio de toda la cadena de llamadas. Si el admin firma una transacción a un contrato malicioso, ese contrato llama al vault y tx.origin sigue siendo el admin: la comprobación pasa." },
      { et: "msg.sender", texto: "Quien llama DIRECTAMENTE a esta función. Si el contrato malicioso llama al vault, msg.sender es el contrato malicioso, no el admin: la comprobación falla, como debe ser." },
      { y: 3.3, h: 2.15, size: 13 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Regla sin excepciones", x: M, y: 5.6, w: CW, h: 1.2, texto: "tx.origin nunca se usa para autorizar. Ante la duda, msg.sender — o mejor, Ownable / AccessControl de OpenZeppelin.", size: 13 });
    s.addNotes("El caso Parity de julio 2017 (~153.037 ETH robados) fue en el fondo control de acceso: la función de inicialización quedó pública y sin protección. Se ve en detalle en A.9.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · delegatecall no protegido", titulo: "El código ajeno que escribe en tu casa", ic: "bicho", tituloSize: 26 });
    D.parrafo(s, "delegatecall ejecuta el código de OTRO contrato pero con TU almacenamiento y TU saldo. Es lo que hace posibles los proxies (A.20). Sin protección, es una de las llaves maestras más peligrosas de la EVM.", { y: 1.85, h: 0.95, size: 14 });
    D.pasos(s, [
      ["LA BIBLIOTECA COMPARTIDA", "Cientos de multisigs delegaban su lógica en una única biblioteca de código. Esa biblioteca quedó sin inicializar."],
      ["CUALQUIERA LA INICIALIZA", "Una función de inicialización sin control de acceso permitió a un desconocido declararse dueño de la biblioteca."],
      ["Y LUEGO LA MATA", "Siendo dueño, invocó selfdestruct sobre la biblioteca. Al destruirse el código del que TODOS dependían por delegatecall..."],
      ["513.774 ETH CONGELADOS", "...los 587 monederos que la usaban quedaron sin lógica: nadie pudo volver a mover sus fondos. No fue robo: fue un ladrillo."],
    ], { y: 2.8, alto: 0.6, gap: 0.1, anchoEt: 3.1, size: 12 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "La defensa", x: M, y: 5.6, w: CW, h: 1.2, texto: "No usar delegatecall salvo para proxies bien entendidos. Nunca hacia una dirección que un usuario elija. Inicializar con un initializer protegido.", size: 12 });
    s.addNotes("⚠ Verificado: Parity multisig. Robo del 19 jul 2017 (~153.037 ETH ≈ 30 M USD) por initWallet sin protección vía delegatecall. Congelación del 6 nov 2017: 'devops199' llamó initWallet en la LIBRERÍA no inicializada y luego kill() → 513.774,16 ETH en 587 wallets, congelados para siempre (EIP-999 no se adoptó). Fuentes: openzeppelin blog 'On the parity wallet multisig hack', parity postmortem, github openethereum/parity-ethereum#6995, theregister. Esta lámina cuenta la CONGELACIÓN de noviembre.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · desbordamiento aritmético", titulo: "Un número que da la vuelta", ic: "bicho", tituloSize: 27 });
    D.codigo(s, `// Solidity < 0.8, sin SafeMath:
uint8 x = 255;
x = x + 1;      // -> 0   (envolvente, en silencio)

uint256 saldo = 20;
saldo = saldo - 21;   // -> 2^256 - 1  (underflow gigante)`, { x: M, y: 1.85, w: CW, h: 1.6, lang: "sol", size: 12 });
    D.dosColumnas(s,
      { et: "Qué pasaba antes de 0.8", linea: C.rojo, color: C.rojo, texto: "La aritmética envolvía sin avisar. Un require(saldo - monto >= 0) con uint es SIEMPRE cierto: una resta de uint nunca es negativa. Así se saltaban chequeos de saldo." },
      { et: "Qué cambió en Solidity 0.8", texto: "Desde 0.8.0 (dic 2020) se verifica por defecto: over/underflow REVIERTEN. El riesgo hoy vive en los bloques unchecked { ... }, para ahorrar gas." },
      { y: 3.55, h: 1.95, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El caso · BeautyChain (BEC)", x: M, y: 5.6, w: CW, h: 1.2, texto: "En abril de 2018, el «batchOverflow» (CVE-2018-10299) acuñó tokens astronómicos de la nada por un overflow en batchTransfer. Es una de las razones por las que 0.8 revierte solo.", size: 12 });
    s.addNotes("⚠ Verificado: CVE-2018-10299, 22 abr 2018, BeautyChain/BEC, overflow en batchTransfer (NVD, peckshield). Solidity 0.8.0 salió el 16 dic 2020 (soliditylang blog). Es el mismo fallo del nivel Token de Ethernaut, que corre en 0.6.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · aleatoriedad on-chain", titulo: "No hay azar dentro de la cadena", ic: "bicho", tituloSize: 27 });
    D.parrafo(s, "Todo lo que un contrato puede leer —block.timestamp, block.prevrandao, blockhash— es público y, en parte, influenciable por el proponente del bloque. Un contrato atacante calcula el mismo «azar» en la misma transacción antes de apostar.", { y: 1.9, h: 1.0, size: 14 });
    D.codigo(s, `// Loteria ingenua: el "azar" es una cuenta pública
uint256 premio = uint256(keccak256(
    abi.encodePacked(block.timestamp, block.prevrandao))) % 10;
// El atacante ejecuta el MISMO cálculo en su contrato y
// solo juega cuando premio le favorece.`, { x: M, y: 3.05, w: CW, h: 1.75, lang: "sol", size: 11.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "El caso · SmartBillions, y la defensa", x: M, y: 5.0, w: CW, h: 1.75, texto: "Una lotería on-chain perdió ~400 ETH (oct 2017) porque su «azar» se leía del estado y se podía predecir. Solución: un oráculo de aleatoriedad verificable (Chainlink VRF) o un esquema commit-reveal (comprometer un valor cifrado y revelarlo después). Nunca variables de bloque. «Poner más variables de bloque» NO arregla nada.", size: 12.5 });
    s.addNotes("⚠ Verificado: SmartBillions, oct 2017, ~400 ETH (~120k USD), aleatoriedad predecible por seed+blockhash legibles (medium SmartBillions, crypto.news). Este es el vector que aparece en el parcial: la respuesta 'usar más variables de bloque' NO puntúa.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · front-running / MEV", titulo: "Todas tus intenciones son públicas", ic: "bicho", tituloSize: 27 });
    D.parrafo(s, "Antes de confirmarse, tu transacción vive en el mempool a la vista de todos. Quien arma el bloque puede colar la suya antes, después, o reordenar, para ganar a tu costa. Es el «valor máximo extraíble» (MEV).", { y: 1.9, h: 0.95, size: 14.5 });
    D.dosColumnas(s,
      { et: "Cómo te afecta", linea: C.rojo, color: C.rojo, items: ["Un bot ve tu compra grande en un DEX y compra antes para venderte más caro (sandwich).", "Ve tu solución a un puzzle premiado y la copia con más gas.", "Reordena liquidaciones para quedarse el bono."] },
      { et: "Las defensas", items: ["Límites de deslizamiento (slippage) en cada swap.", "Revelar en dos pasos (commit-reveal) lo que no debe verse antes.", "Subastas por lotes; mempools privados.", "Nunca suponer el orden de llegada."] },
      { y: 3.0, h: 2.5, size: 12.5 });
    D.parrafo(s, "No es un bug de tu contrato: es una propiedad del sistema. Se diseña PARA él, no contra él.", { y: 5.7, h: 0.5, size: 13, color: C.ocre });
    s.addNotes("⚠ El término MEV y su estudio sistemático vienen de 'Flash Boys 2.0' (Daian et al., 2019, arXiv:1904.05234). Se ve a fondo en la Sesión 14 con los flash loans. Aquí basta la intuición: el mempool es público.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · manipulación de oráculos", titulo: "Si dependes de un precio, pueden moverlo", ic: "bicho", tituloSize: 26 });
    D.parrafo(s, "Un contrato que lee el precio «spot» de un solo mercado (un DEX) se puede engañar moviendo ese precio, aunque sea por un instante, con un préstamo relámpago dentro de la misma transacción.", { y: 1.9, h: 0.95, size: 14 });
    D.pasos(s, [
      ["PIDE PRESTADO ENORME", "Un flash loan le da millones sin garantía, a devolver en la misma transacción."],
      ["MUEVE EL PRECIO SPOT", "Compra masivamente el activo en el mercado que el oráculo lee: el precio se dispara."],
      ["EXPLOTA AL QUE LO LEE", "El contrato-víctima ve ese precio inflado y le presta o le paga de más contra ese valor."],
      ["DEVUELVE Y SE VA", "Devuelve el préstamo, deshace la posición y se queda la diferencia. Todo en un bloque."],
    ], { y: 2.85, alto: 0.6, gap: 0.1, anchoEt: 3.0, size: 12 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "El caso · Mango Markets, y la defensa", x: M, y: 5.55, w: CW, h: 1.25, texto: "Mango Markets perdió más de 110 M USD (oct 2022) por manipulación de su oráculo de precio. Defensa: precios promediados en el tiempo (TWAP), varios oráculos independientes, servicios como Chainlink. Nunca un solo precio spot.", size: 12 });
    s.addNotes("⚠ Verificado: Mango Markets, 11 oct 2022, >110 M USD, Avraham Eisenberg infló el precio de MNGO 13x en los mercados que alimentaban el oráculo y pidió prestado contra el colateral inflado (CFTC press release 8647-23; condenado en abril 2024). Los flash loans se ven a fondo en la S14.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · denegación de servicio", titulo: "Un solo dato puede bloquear a todos", ic: "bicho", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "DoS por receptor que revierte", linea: C.rojo, color: C.rojo, texto: "Si el contrato PAGA en un bucle y una de las cuentas es un contrato que revierte al recibir (o consume todo el gas), el pago a TODOS los demás falla. King of the Ether (feb 2016) se atascó así: send() a una wallet-contrato falló y el retorno no se comprobó." },
      { et: "DoS por bucle no acotado", texto: "Recorrer un arreglo que crece sin límite (la lista de participantes de la S7) puede superar el límite de gas de un bloque: la función se vuelve imposible de ejecutar. El contrato queda vivo pero inútil." },
      { y: 1.9, h: 2.7, size: 12.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La defensa: el patrón de retiro (S7)", x: M, y: 4.8, w: CW, h: 1.95, texto: "No EMPUJES los pagos (push): deja que cada quien RETIRE lo suyo (pull). Así un receptor que revierte solo se afecta a sí mismo. No recorras arreglos ilimitados; no dependas de que un envío externo funcione. Es el mismo patrón «pull over push» de la Sesión 7.", size: 13 });
    s.addNotes("⚠ Verificado: King of the Ether Throne, 6-8 feb 2016, send() con 2300 gas fallaba hacia wallets-contrato y no se comprobaba el retorno; se reembolsaron 98,5 ETH a mano (post-mortem kingoftheether.com/postmortem.html). Enlaza directo con el withdrawal pattern de la S7.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · verificación de la taxonomía", titulo: "Clasifiquen estos tres fallos", ic: "pregunta", tituloSize: 27 });
    D.tabla(s, ["síntoma en el código", "¿qué vulnerabilidad es?"], [
      ["Una función de retiro que envía ETH y después descuenta el saldo.", "Reentrancy (orden CEI violado)."],
      ["require(tx.origin == owner) para autorizar una función crítica.", "Control de acceso mal implementado."],
      ["Un ganador elegido con keccak256(block.timestamp) % n.", "Aleatoriedad on-chain manipulable."],
    ], { y: 1.9, h: 2.4, colW: [7.3, 4.793], size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Cómo se responde en el parcial", x: M, y: 4.5, w: CW, h: 2.2, texto: "Tapen la segunda columna y pídanle a la clase nombrarlas en voz alta, con la LÍNEA exacta. En el parcial se pide justo esto: nombre + severidad + ubicación. Nombrar sin ubicar vale la mitad. Estos tres son ejemplos de método; el contrato del parcial es otro.", size: 13 });
    s.addNotes("Pregunta de verificación del bloque A (parte de taxonomía). No revelar el contrato del parcial. Estos tres ejemplos son genéricos, del mismo tipo que el estudiante deberá reconocer.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · el ciclo de vida seguro", titulo: "La seguridad no es un paso: es una cadena", ic: "escudo", tituloSize: 26 });
    const capas = [
      ["ESCRIBIR MENOS", "Cada línea propia es superficie de ataque. Reutilizar OpenZeppelin auditado en lugar de reescribir."],
      ["PROBAR LOS BORDES", "La suite de la Sesión 8, con pruebas que atrapan errores, no solo que dan cobertura."],
      ["ANÁLISIS ESTÁTICO", "Slither revisa el código sin ejecutarlo y marca patrones peligrosos en segundos."],
      ["FUZZING E INVARIANTES", "Miles de entradas al azar buscando romper una invariante que uno afirma siempre cierta."],
      ["AUDITORÍA EXTERNA", "Ojos que no escribieron el código. Cuesta, pero es la última red antes de custodiar valor."],
      ["RECOMPENSAS Y MONITOREO", "Bug bounties (Immunefi y otros) y vigilancia del contrato ya desplegado."],
    ];
    capas.forEach((c, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.6, h: 0.65, fontFace: F.display, fontSize: 17, color: C.naranja, margin: 0, valign: "middle" });
      D.etiqueta(s, c[0], { x: M + 0.7, y: y + 0.06, w: 3.5, color: C.tinta, size: 10.5 });
      D.parrafo(s, c[1], { x: M + 4.35, y: y + 0.04, w: CW - 4.35, h: 0.6, size: 12.5, valign: "middle" });
      D.linea(s, M, y + 0.73, M + CW, y + 0.73, C.grisClaro, 1);
    });
    s.addNotes("Ninguna capa sola es suficiente. The DAO tenía pruebas. Muchos contratos auditados igual fueron robados. Es defensa en profundidad. Las capas 2 y 3 ya las tienen del curso (S8 y hoy).");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · una herramienta concreta", titulo: "Slither: salida real sobre el banco", ic: "lupa", tituloSize: 27 });
    D.codigo(s, `$ pip install slither-analyzer          # requiere Python 3.10+
$ slither contracts/s09/BancoVulnerable.sol`, { x: M, y: 1.85, w: CW, h: 1.0, lang: "js", size: 11.5 });
    D.codigo(s, `Reentrancy in BancoVulnerable.retirar() (BancoVulnerable.sol#21-30):
    External calls:
    - (ok,None) = address(msg.sender).call{value: monto}()  (#26)
    State variables written after the call(s):
    - saldos[msg.sender] = 0  (#29)
Reference: .../Detector-Documentation#reentrancy-vulnerabilities-1
analyzed (1 contracts with 102 detectors), 2 result(s) found`, { x: M, y: 3.0, w: CW, h: 2.35, lang: "py", titulo: "salida real (reentrancy-eth · severidad ALTA)", size: 10.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Qué NO puede hacer", x: M, y: 5.55, w: CW, h: 1.22, texto: "Slither encontró la reentrancy en segundos y sin ejecutar nada. Pero no entiende la lógica de negocio, no sabe qué DEBERÍA hacer el contrato, y no encuentra fallos de diseño nuevos. Es el primer filtro, no el último; no reemplaza al auditor humano.", size: 12.5 });
    s.addNotes("⚠ Salida REAL: se corrió slither 0.11.6 (con solc-select 0.8.28) sobre contracts/s09/BancoVulnerable.sol y marcó reentrancy-eth (ALTA) + low-level-calls (informativa): '2 result(s) found'. Sobre BancoSeguro (con --filter-paths node_modules) solo queda low-level-calls informativa: la corrección desaparece el hallazgo alto. Si la sala no permite Python, hay extensiones de VS Code. Correrlo en vivo si hay tiempo.");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · más allá del análisis estático", titulo: "Fuzzing, invariantes y auditoría externa", ic: "lupa", tituloSize: 25 });
    D.tabla(s, ["técnica", "qué hace", "qué atrapa que lo anterior no"], [
      ["Fuzzing", "Lanza miles de entradas aleatorias contra el contrato buscando romper algo.", "Combinaciones raras de valores que ningún test escrito a mano previó."],
      ["Invariantes", "Afirmas algo que SIEMPRE debe ser cierto (p. ej. suma de saldos = balance) y se pone a prueba.", "Errores de contabilidad y de diseño que no violan una función suelta."],
      ["Auditoría externa", "Personas expertas que no escribieron el código lo revisan a fondo.", "Fallos de lógica de negocio y de arquitectura; lo que ninguna herramienta ve."],
      ["Bug bounty", "Se paga a quien encuentre fallos en el contrato YA desplegado (Immunefi y otros).", "Lo que se escapó de todo lo anterior, antes de que lo use un atacante."],
    ], { y: 1.9, h: 3.55, colW: [2.5, 5.0, 4.593], size: 11 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "El orden importa", x: M, y: 5.55, w: CW, h: 1.25, texto: "Cada capa es más cara que la anterior. Se sube en orden: no se paga una auditoría de un código que ni siquiera pasa Slither. La auditoría no es un sello: es una foto en un momento, sobre una versión concreta.", size: 12.5 });
    s.addNotes("Herramientas de fuzzing del ecosistema: Echidna, Foundry (invariant testing), Medusa. No hace falta nombrarlas todas; sí la idea de que se generan miles de casos automáticamente. Immunefi es la mayor plataforma de bug bounties de web3.");
  }

  {
    const s = await D.lamina({ kicker: "A.19 · actualizar lo inmutable", titulo: "Proxies: poder cambiar el código, y su precio", ic: "engranaje", tituloSize: 25 });
    D.parrafo(s, "Si el código es inmutable, ¿cómo se corrige un bug? Con un proxy: un contrato «fachada» que guarda el estado y, vía delegatecall, ejecuta la lógica de OTRO contrato que sí se puede reemplazar.", { y: 1.85, h: 0.95, size: 14 });
    D.nodo(s, { x: M, y: 3.0, w: 3.4, h: 1.0, titulo: "PROXY", sub: "guarda el estado\ny la dirección de la lógica", fill: C.blanco, line: C.violeta, subSize: 10.5 });
    D.flecha(s, M + 3.4, 3.5, M + 4.2, 3.5, C.tinta, 2);
    D.nodo(s, { x: M + 4.2, y: 3.0, w: 3.6, h: 1.0, titulo: "LÓGICA v1 → v2", sub: "delegatecall:\nse puede reemplazar", fill: C.blanco, line: C.naranja, subSize: 10.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "El poder es el riesgo", x: M + 8.0, y: 3.0, w: CW - 8.0, h: 1.0, texto: "Cambiar la lógica cambia el dinero de todos.", size: 11 });
    D.dosColumnas(s,
      { et: "Los riesgos propios del proxy", linea: C.rojo, color: C.rojo, items: ["Colisión de almacenamiento entre proxy y lógica.", "Un initializer sin proteger: como Parity (A.9).", "La clave de administración: si se filtra, se acabó."] },
      { et: "Cómo se mitiga", items: ["Patrones probados de OpenZeppelin (UUPS, Transparent).", "El admin es un multisig o una DAO, no una sola llave.", "Un timelock: los cambios se anuncian antes de aplicarse."] },
      { y: 4.3, h: 2.0, size: 12 });
    D.parrafo(s, "«Actualizable» y «descentralizado» están en tensión: cada mecanismo de actualización es un poder que alguien concentra.", { y: 6.45, h: 0.4, size: 11.5, color: C.ocre });
    s.addNotes("Conectar con A.9 (Parity fue un proxy/biblioteca mal protegido) y con la S15 (gobernanza). El mensaje: la actualizabilidad no es gratis, mueve el problema de 'código inmutable' a 'quién controla la llave de actualización'.");
  }

  {
    const s = await D.lamina({ kicker: "A.20 · lo que hay que llevarse del bloque A", titulo: "Seis ideas antes de atacar", ic: "lista", tituloSize: 29 });
    ideas(s, [
      "El código es inmutable, público y custodia valor: no hay parche ni reverso.",
      "call a un contrato le cede el control: puede reentrar antes de que actualices el estado.",
      "Reentrancy se cierra con CEI, y se blinda con un guard. Ambos.",
      "Los permisos van con msg.sender, jamás con tx.origin.",
      "El azar seguro no existe on-chain: se necesita un oráculo o commit-reveal.",
      "La seguridad es una cadena de capas —Slither, fuzzing, auditoría, bounties—; ninguna sola basta.",
    ]);
    s.addNotes("Cierre del bloque A. Estas seis ideas son las candidatas naturales del parcial y de la auditoría cruzada. Pausa corta antes del bloque B.");
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Ethernaut + auditoría cruzada", sub: "Jugar a romper contratos, y después leer el de otro equipo con la mirada de quien busca la grieta.", minutos: "APROXIMADAMENTE 35 MINUTOS", ic: "diana" });

  {
    const s = await D.lamina({ kicker: "B.1 · qué es Ethernaut", titulo: "Un CTF donde ganar es hackear", ic: "diana", tituloSize: 29 });
    D.parrafo(s, "Ethernaut, de OpenZeppelin, es una serie de contratos con una vulnerabilidad cada uno. Se «gana» un nivel explotándolo desde la consola del navegador. Es la mejor forma de fijar lo del bloque A.", { y: 1.9, h: 0.95, size: 14.5 });
    D.tabla(s, ["nivel", "vulnerabilidad", "con qué se conecta"], [
      ["1 · Fallback", "Control de acceso por receive/fallback mal puestos.", "S7 receive/fallback · A.8"],
      ["2 · Fal1out", "Un «constructor» que en realidad es una función pública.", "S6 constructor"],
      ["5 · Token", "Desbordamiento aritmético (contrato en versión 0.6).", "A.10 de hoy"],
      ["11 · Re-entrancy", "El robo que acabamos de ver, para explotar con las manos.", "A.3 a A.7"],
      ["7 · Force", "Enviar ETH a un contrato sin receive, con selfdestruct.", "Suposiciones falsas sobre el saldo"],
    ], { y: 3.0, h: 3.0, colW: [2.4, 5.5, 4.193], size: 11.5 });
    D.parrafo(s, "Prerrequisito: el nivel 0 (Hello Ethernaut) quedó de trabajo de la Sesión 8. Hoy se empieza en Fallback. La guía en PDF trae el método de cada nivel.", { y: 6.2, h: 0.5, size: 12.5, color: C.ocre });
    s.addNotes("⚠ Verificado en el repo oficial: los números de nivel son 1 Fallback, 2 Fal1out, 5 Token, 7 Force, 11 Re-entrancy. Se resuelven en ese orden salvo Force, que conviene dejar al final (requiere desplegar en Remix). Redes soportadas por el juego: Sepolia (por defecto), Optimism/Arbitrum Sepolia, Holesky, Amoy. Usar Sepolia.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · cómo se juega", titulo: "La consola del navegador es tu terminal", ic: "terminal", tituloSize: 27 });
    D.pasos(s, [
      ["CONECTAR", "MetaMask del curso en Sepolia. Abrir la consola del navegador (F12 → Console)."],
      ["OBTENER INSTANCIA", "Botón «Get New Instance»: Ethernaut despliega un contrato solo para ti y lo expone como `contract`."],
      ["INSPECCIONAR", "`player`, `await contract.info()`, y sobre todo `contract.abi`: ahí están TODAS las funciones que puedes llamar."],
      ["INTERACTUAR", "`await contract.metodo(args)` o `contract.sendTransaction({value: ...})` para enviar ETH."],
      ["ENVIAR", "Botón «Submit instance»: Ethernaut comprueba si cumpliste el objetivo del nivel."],
    ], { y: 1.9, alto: 0.7, gap: 0.1, anchoEt: 2.6, size: 12.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "El reflejo que hay que adquirir", x: M, y: 5.85, w: CW, h: 0.95, texto: "Ante cualquier nivel: mirar primero contract.abi y el código fuente. La vulnerabilidad casi siempre salta leyendo.", size: 12.5 });
    s.addNotes("⚠ Comandos verificados contra la guía oficial (instances.md): player, getBalance(player), help(), ethernaut, contract, contract.abi, await contract.info(), Get New Instance, Submit instance. En la guía en PDF está el método por nivel, con pistas escalonadas SIN la solución. La solución completa está en evaluaciones/ethernaut-SOLUCION-DOCENTE.md (no proyectar).");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · auditoría cruzada #1", titulo: "Leer el contrato de otro equipo", ic: "lupa", tituloSize: 28 });
    D.parrafo(s, "Cada equipo entrega el contrato principal de su proyecto y recibe el de otro. Media hora para auditarlo con una lista concreta. Leer código ajeno es parte de la competencia.", { y: 1.9, h: 0.65, size: 14.5 });
    D.pasos(s, [
      ["RECORRER LA TAXONOMÍA", "Las ocho vulnerabilidades de A.2, una por una, contra el contrato recibido."],
      ["PASAR SLITHER", "Correrlo y leer los hallazgos: separar los reales de los falsos positivos."],
      ["CLASIFICAR", "Cada hallazgo con severidad —crítica, alta, media, baja, informativa— y la línea exacta."],
      ["PROPONER", "Para cada uno, la corrección mínima. No reescribir el contrato ajeno."],
    ], { y: 2.65, alto: 0.68, gap: 0.1, anchoEt: 3.2, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "El formato y la rúbrica están en el material del proyecto", x: M, y: 5.55, w: CW, h: 1.25, texto: "«Auditoría cruzada» (HTML + PDF, público) trae el formato de hallazgo, cómo se asignan los equipos, qué se entrega y la rúbrica. Se califica la calidad de la auditoría, no cuántos fallos tenga el otro.", size: 12.5 });
    s.addNotes("Este es el 'Ethernaut + auditoría cruzada #1' que vale 20% del segundo corte. El documento de formato es material/proyecto/auditoria-cruzada.(html|pdf). La entrega del informe puede cerrarse fuera de clase si el tiempo aprieta.");
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "Parcial práctico", sub: "Un contrato vulnerable. Encontrar los fallos, explotar al menos uno y entregar la versión corregida. 90 minutos, individual, libro abierto.", minutos: "90 MINUTOS · 45 % DEL SEGUNDO CORTE", ic: "candado" });

  {
    const s = await D.lamina({ kicker: "C.1 · qué se entrega", titulo: "Las tres tareas del parcial", ic: "documento", tituloSize: 28 });
    D.tabla(s, ["", "detalle"], [
      ["El insumo", "Un contrato vulnerable, entregado al empezar el bloque, con vulnerabilidades de la taxonomía de hoy."],
      ["Tarea 1 · identificar", "Nombrar cada fallo, con su severidad y su línea exacta."],
      ["Tarea 2 · explotar", "Una prueba en Hardhat que demuestre al menos un abuso."],
      ["Tarea 3 · corregir", "La versión corregida, sin romper lo legítimo y sin reescribir el contrato entero."],
      ["Se entrega", "El contrato corregido, la prueba del exploit y media página con los hallazgos y sus correcciones."],
    ], { y: 1.9, h: 3.4, colW: [2.6, 9.493], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Una restricción importante", x: M, y: 5.45, w: CW, h: 1.3, texto: "Corregir lo MÍNIMO necesario: reescribir el contrato entero cuesta puntos. Un evento que falta, una pausa ausente o una contabilidad que no cuadra son mejoras o bugs, no vulnerabilidades de seguridad: no cuentan como hallazgo.", size: 12.5 });
    s.addNotes("El enunciado y el contrato se reparten SOLO al empezar el bloque C. La solución y la rúbrica están en evaluaciones/parcial-s09/ (privado): NO proyectar, NO dar pistas del contenido del contrato. Este deck solo da la logística.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · cómo se trabaja", titulo: "Tiempos, reglas y uso de IA", ic: "reloj", tituloSize: 28 });
    D.tabla(s, ["", "detalle"], [
      ["Duración", "90 minutos exactos, en máquina, en el repositorio de laboratorios del curso."],
      ["Modalidad", "Individual. Cada quien entrega lo suyo."],
      ["Libro abierto", "Material del curso, documentación oficial y el repositorio. Todo lo escrito está permitido."],
      ["Sobre la IA", "Sin asistentes de IA (Copilot, ChatGPT y similares) ni ayuda de otra persona. El objetivo es evaluar TU criterio de seguridad."],
      ["Peso", "45 % del segundo corte."],
      ["Integridad", "Una sospecha fundada anula el parcial. Se revisa el historial de escritura si hace falta."],
    ], { y: 1.9, h: 4.1, colW: [2.3, 9.793], size: 12 });
    D.parrafo(s, "Sugerencia de reparto: ~25 min leer e identificar, ~35 min escribir el exploit, ~25 min corregir, ~5 min redactar la media página.", { y: 6.15, h: 0.6, size: 13, color: C.ocre });
    s.addNotes("Insistir en la regla de IA: el parcial mide criterio propio, que es justo lo que un asistente taparía. Recordar dónde se guarda el trabajo y cómo se entrega (según el canal del curso). No adelantar nada del contrato.");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · cómo se califica", titulo: "Rúbrica sobre 20 puntos", ic: "voto", tituloSize: 30 });
    D.tabla(s, ["criterio", "puntos", "qué se espera"], [
      ["Identificar los fallos", "6", "Nombre correcto y línea. Media si nombra sin ubicar."],
      ["Severidad justificada", "3", "Coherente con el impacto real de cada una."],
      ["Exploit funcional", "5", "Una prueba que demuestra el abuso. Más si roba fondos."],
      ["Corregir los fallos", "4", "Todos, sin romper la funcionalidad legítima."],
      ["No romper lo legítimo", "2", "Prueba de humo del docente sobre el contrato corregido."],
    ], { y: 1.9, h: 3.1, colW: [3.6, 1.6, 6.893], size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Cómo subir la nota", x: M, y: 5.2, w: CW, h: 1.55, texto: "La severidad se justifica con el impacto: ¿se roban fondos, se bloquea el contrato, o solo es una molestia? Un exploit que efectivamente MUEVE dinero vale más que uno que solo describe el abuso. Y la corrección mínima que conserva depositar/retirar honestos es la mitad de la nota de corrección.", size: 12.5 });
    s.addNotes("La rúbrica detallada y el solucionario están en evaluaciones/parcial-s09/SOLUCION-DOCENTE.md (privado). NO proyectar. Esta lámina da la estructura de puntos sin revelar cuáles ni cuántas son las vulnerabilidades del contrato.");
  }

  await D.preguntaSemana({
    pregunta: "De las ocho vulnerabilidades de hoy, ¿cuáles podría tener SU proyecto? Revísenlo con la lista en la mano antes del Avance 1.",
    trabajo: [
      "Terminar los cinco niveles de Ethernaut si no se alcanzaron en clase.",
      "Entregar el informe de la auditoría cruzada #1 con el formato del material del proyecto.",
      "Pasar Slither al contrato del proyecto y anotar los hallazgos.",
      "Empezar la Unidad III: leer sobre el estándar ERC-20 para la Sesión 10.",
      "Nivelación de React: quien no lo haya visto, empezar el tutorial entregado. La Sesión 12 lo asume.",
    ],
    notas: "El tutorial de nivelación de React se entrega en esta sesión (material aparte). Es trabajo autónomo de ~4 horas. La pregunta de la semana se retoma en la S10.",
  });

  await D.cierre({
    frase: "Para escribir un contrato que nadie pueda robar, primero hay que aprender a robarlo.",
    sub: "Con esto cierra la Unidad II: ya saben escribir, probar, desplegar y auditar. La Unidad III construye cosas que la gente usa: tokens, NFTs y una interfaz de verdad.",
    proxima: "Sesión 10 · Tokens fungibles · el estándar ERC-20",
  });

  return D.guardar(path.join(__dirname, "Sesion-09-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
