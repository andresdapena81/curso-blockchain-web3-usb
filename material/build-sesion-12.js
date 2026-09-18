/* =====================================================================
   Sesión 12 · Web 3.0: conectando el frontend a la cadena
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 12 · WEB 3.0 · FRONTEND Y CADENA", titulo: "Sesión 12 · Frontend Web3" });
  const { C, F, M, CW } = D;

  /* ---------------------------------------------------------- apertura */
  await D.portada({
    kicker: "SESIÓN 12 · UNIDAD III · WEB 3.0",
    titulo: "CONECTAR LA\nPANTALLA A\nLA CADENA",
    sub: "Hasta hoy todo pasaba en la terminal y el explorador. Hoy, una interfaz que una persona no técnica puede usar, y que no le miente.",
    palabra: "CONECTAR",
    ic: "pantalla",
    notas: "Abran con la pregunta de la semana de la S11 (5 min): ¿dónde vivía la imagen del NFT famoso que eligieron? Luego el gancho: lo nuevo hoy no es HTML ni React; es hablar con la cadena y aceptar que una transacción NO es instantánea ni siempre exitosa.",
  });

  await D.agenda({
    intro: "La sesión más de «producto» del curso. El error que se combate: creer que una transacción es instantánea y siempre sale bien.",
    bloques: [
      ["A", "ARQUITECTURA, ETHERS Y UX", "Qué está descentralizado, RPC, Provider/Signer/Contract, eventos y los estados de error.", "~65 min"],
      ["B", "LABORATORIO 12 · EN PAREJAS", "La dApp de la FichaUSB: conectar, leer saldo, transferir y provocar los 4 errores.", "~85 min"],
      ["C", "PROYECTO · HACIA EL AVANCE 1", "Qué lee y qué escribe la interfaz del proyecto; React y wagmi.", "~20 min"],
    ],
    notas: "65 + 85 + 20 = 170, más 10 de pausa entre A y B. El laboratorio va SIN herramientas de compilación (un solo HTML): la sala puede no permitir instalar un toolchain de React. React + wagmi se presentan como el camino profesional para el proyecto (A.18 y C.2).",
  });

  await D.objetivo({
    objetivo: "Construir una interfaz que lea y escriba en contratos, gestionando la billetera y los estados de una transacción.",
    preguntas: [
      "En una dApp, ¿qué parte está de verdad descentralizada y cuál no?",
      "¿Qué diferencia una lectura gratis de una transacción que cuesta gas?",
      "¿Cómo se entera la interfaz de que algo cambió en la cadena?",
      "¿Cuáles son los cuatro errores que todo principiante ignora, y cómo se detecta cada uno?",
    ],
    ra: "RA6 · Integrar una interfaz Web 3.0 con contratos, gestionando wallets, eventos y estados de transacción.",
    notas: "Las cuatro preguntas se verifican al final de cada tramo del bloque A (A.5, A.12, A.19). La cuarta es la que se evalúa en el laboratorio: los cuatro errores provocados a propósito.",
  });

  await D.glosario({
    items: [
      ["dApp", "aplicación descentralizada", "Interfaz + contratos. La interfaz suele ser una web normal; lo descentralizado son los contratos."],
      ["RPC", "Remote Procedure Call", "El nodo al que la interfaz le hace preguntas: propio, de MetaMask o de Alchemy/Infura."],
      ["Provider", "proveedor (ethers)", "Objeto que LEE la cadena: saldos, estado, eventos. No firma, no cuesta gas."],
      ["Signer", "firmante (ethers)", "Objeto que ESCRIBE: pide a la billetera que firme una transacción. Cuesta gas."],
      ["ABI", "Application Binary Interface", "La lista de funciones y eventos del contrato que la interfaz necesita para llamarlo."],
      ["EIP-1193", "API del proveedor", "El estándar de window.ethereum: request(), eventos y códigos de error como 4001."],
      ["wagmi · viem", "librerías de React y JS", "El camino profesional: ganchos listos para conexión, lecturas y escrituras."],
      ["Recibo", "transaction receipt", "Lo que existe cuando la transacción se minó: bloque, gas usado y status (1 ok, 0 revertida)."],
    ],
    notas: "EIP-1193 es el que más importa hoy: define el código 4001 (el usuario rechazó), que es uno de los cuatro errores. No lean todo; señalen Provider/Signer y Recibo, que son el corazón del bloque A.",
  });

  /* ================================================================ A */
  {
    const s = await D.divisor({ letra: "A", titulo: "Arquitectura, ethers y UX", sub: "Una dApp es, casi siempre, una web normal que además sabe hablar con una cadena. Lo interesante está en ese «además».", minutos: "APROXIMADAMENTE 65 MINUTOS", ic: "engranaje" });
    s.addNotes("Tres tramos con su verificación: arquitectura y RPC (hasta A.5, 15 min), ethers y transacciones (hasta A.12, 25 min), eventos y UX (hasta A.19, 25 min).");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · qué hay detrás de un botón", titulo: "Las cinco piezas de una dApp", ic: "red", tituloSize: 28 });
    D.nodo(s, { x: M, y: 2.0, w: 2.15, h: 1.15, titulo: "FRONTEND", sub: "HTML/JS en un\nservidor normal", fill: C.superf, subSize: 10.5 });
    D.flecha(s, M + 2.15, 2.57, M + 2.6, 2.57, C.tinta, 2);
    D.nodo(s, { x: M + 2.6, y: 2.0, w: 2.15, h: 1.15, titulo: "BILLETERA", sub: "MetaMask: guarda\nla clave y firma", fill: C.blanco, line: C.naranja, subSize: 10.5 });
    D.flecha(s, M + 4.75, 2.57, M + 5.2, 2.57, C.tinta, 2);
    D.nodo(s, { x: M + 5.2, y: 2.0, w: 2.15, h: 1.15, titulo: "RPC", sub: "Infura, Alchemy\no nodo propio", fill: C.superf, subSize: 10.5 });
    D.flecha(s, M + 7.35, 2.57, M + 7.8, 2.57, C.tinta, 2);
    D.nodo(s, { x: M + 7.8, y: 2.0, w: 2.0, h: 1.15, titulo: "NODO", sub: "uno de miles\nen la red", fill: C.superf, subSize: 10.5 });
    D.flecha(s, M + 9.8, 2.57, M + 10.2, 2.57, C.tinta, 2);
    D.nodo(s, { x: M + 10.2, y: 2.0, w: CW - 10.2, h: 1.15, titulo: "CONTRATO", sub: "FichaUSB", fill: C.blanco, line: C.violeta, subSize: 10.5 });
    D.parrafo(s, "Ejemplo trabajado: Ana pulsa «Enviar 2,5 FUSB». El frontend arma la llamada con el ABI; MetaMask le muestra qué va a firmar y firma con SU clave (el frontend nunca la ve); el RPC recibe la transacción firmada y la pasa a la red; un nodo la incluye en un bloque; el contrato mueve los saldos y emite Transfer.", { y: 3.45, h: 1.35, size: 13.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error de concepto típico", x: M, y: 4.95, w: CW, h: 1.75, texto: "«La página tiene acceso a mi billetera.» No: la página PIDE, la billetera decide. La clave privada nunca sale de MetaMask. Por eso la regla del curso es leer lo que la billetera muestra antes de firmar: es la única pieza que trabaja para ustedes.", size: 12.5 });
    s.addNotes("Recorran el diagrama de izquierda a derecha con el ejemplo. Pregunta rápida: ¿quién paga el gas? Ana, desde su cuenta; el frontend no paga nada. Conecten con la S3: la firma es ECDSA con la clave que solo está en la billetera.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · qué está descentralizado", titulo: "La respuesta honesta: menos de lo que parece", ic: "balanza", tituloSize: 26 });
    D.tabla(s, ["pieza", "quién la controla", "si cae o miente…"], [
      ["Frontend", "Quien paga el hosting y el dominio.", "La dApp desaparece o muestra otra cosa; el contrato sigue vivo."],
      ["RPC", "Una empresa (o ustedes, si tienen nodo).", "No se puede leer ni enviar; o responde datos falsos a quien no verifica."],
      ["Billetera", "El usuario (software de un tercero).", "Sin billetera no hay firma: solo lectura."],
      ["Contrato", "Nadie: sus reglas están en la cadena.", "No cae mientras la red exista. Es lo único descentralizado de verdad."],
    ], { y: 1.85, h: 3.15, colW: [2.0, 4.0, 6.093], size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Cómo decirlo con madurez", x: M, y: 5.2, w: CW, h: 1.5, texto: "El VALOR y las REGLAS están descentralizados en el contrato; el ACCESO, muchas veces no. Se puede mejorar (frontend en IPFS, varios RPC, nodo propio), pero en el README del proyecto hay que decir con honestidad cuál es cuál.", size: 12.5 });
    s.addNotes("Esta tabla es la que se pide en la reflexión del laboratorio. Ejemplo real frecuente: cuando un proveedor RPC grande tiene una falla, muchas «dApps» dejan de funcionar al mismo tiempo aunque la red siga produciendo bloques. No citen un incidente concreto sin fuente; el mecanismo es lo que importa.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · proveedores RPC", titulo: "Nodo propio o servicio de infraestructura", ic: "capas", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "Nodo propio", texto: "Máxima independencia: nadie les filtra ni les limita. Pero un nodo completo de Ethereum pide cientos de GB de disco rápido, sincronizar tarda horas o días, y hay que mantenerlo." },
      { et: "Infura, Alchemy y similares", texto: "Una URL con una clave de API y listo. Plan gratuito con límite de consultas por segundo y por mes. A cambio, dependen de una empresa que ve todas sus consultas." },
      { y: 1.85, h: 2.5, size: 12.5 });
    D.tabla(s, ["situación", "de dónde lee la dApp del laboratorio"], [
      ["El usuario conectó MetaMask", "Del RPC que MetaMask tenga configurado para esa red. La dApp no necesita clave propia."],
      ["Sin billetera (solo lectura)", "De un RPC propio del frontend: su clave queda VISIBLE en el código de la página."],
    ], { y: 4.55, h: 1.35, colW: [3.2, 8.893], size: 11.5 });
    D.parrafo(s, "Una clave de API en un frontend es pública por definición: restrínjanla por dominio en el panel del proveedor. Las de Hardhat van al keystore; esta no es secreta, solo acotada.", { y: 6.05, h: 0.65, size: 12, color: C.ocre });
    s.addNotes("No den cifras de los planes gratuitos: cambian a menudo; que las consulten en la página del proveedor el día que las necesiten. Diferencia clave con Hardhat: la URL de Sepolia con clave que usan para desplegar va en el keystore (da acceso a su cuota); la de un frontend público se expone sí o sí y se protege con restricciones de dominio.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · límites de tasa", titulo: "El RPC también dice «no»", ic: "reloj", tituloSize: 29 });
    D.parrafo(s, "Todo RPC gratuito limita cuántas consultas acepta. Una interfaz mal hecha lo agota sola: por ejemplo, preguntar el saldo cada segundo desde cada pestaña abierta.", { y: 1.85, h: 0.9, size: 14 });
    D.tabla(s, ["mala práctica", "mejor"], [
      ["Preguntar el saldo en un bucle cada segundo.", "Leer una vez y escuchar el evento Transfer (A.13)."],
      ["Pedir todos los eventos desde el bloque 0.", "Pedir un rango acotado o usar un indexador (Sesión 13)."],
      ["Reintentar sin pausa cuando algo falla.", "Reintentar con espera creciente y avisar al usuario."],
    ], { y: 2.9, h: 2.1, colW: [5.6, 6.493], size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "El síntoma", x: M, y: 5.2, w: CW, h: 1.5, texto: "Errores 429 («too many requests») o respuestas lentas que parecen «la red está caída». En la Sesión 11 lo vimos con las puertas IPFS públicas: el mismo fenómeno, en otra capa. Es un límite comercial, no una falla de la cadena.", size: 12.5 });
    s.addNotes("La consulta de logs en rango amplio es el caso típico: muchos proveedores limitan cuántos bloques abarca una sola llamada eth_getLogs. Eso motiva el indexador de la Sesión 13 (The Graph o similares).");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · verificación · arquitectura", titulo: "¿Qué deja de funcionar?", ic: "pregunta", tituloSize: 29 });
    D.enunciado(s, "El proveedor RPC que usa MetaMask cae durante una hora. ¿Qué le pasa a la FichaUSB, a los saldos y a su dApp? ¿Y si lo que cae es el hosting del frontend?", { y: 1.9, h: 1.85, size: 18, line: C.naranja });
    D.lista(s, ["Un minuto en pareja. Separen: el contrato, los datos, el acceso."], { y: 3.95, h: 0.45, size: 13.5 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Respuesta", x: M, y: 4.6, w: CW, h: 2.1, texto: "Caído el RPC: el contrato y los saldos siguen intactos en miles de nodos; la dApp no puede leer ni enviar, a menos que el usuario cambie de RPC en MetaMask. Caído el hosting: la página no carga, pero cualquiera puede interactuar con el contrato desde el explorador («Write contract») o desde otro frontend. Nada se pierde; se pierde el ACCESO cómodo.", size: 12.5 });
    s.addNotes("Verificación de 3 minutos. El punto: el fallo de acceso no es fallo de datos. Lo del explorador «Write contract» lo usaron en la S6: es literalmente otro frontend sobre el mismo contrato.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · las tres piezas de ethers v6", titulo: "Provider, Signer, Contract", ic: "codigo", tituloSize: 29 });
    D.codigo(s, `// PROVIDER: habla con el nodo a través de la billetera. Lee gratis.
const provider = new ethers.BrowserProvider(window.ethereum);
await provider.send("eth_requestAccounts", []);   // MetaMask pide permiso

// SIGNER: la cuenta que firma. Escribir cuesta gas.
const signer = await provider.getSigner();

// CONTRACT: dirección + ABI + quién llama.
const ficha = new ethers.Contract(DIRECCION_FICHA, ABI, signer);

const bruto = await ficha.balanceOf(cuenta);          // lectura
const tx    = await ficha.transfer(dest, cantidad);   // escritura`, { x: M, y: 1.85, w: CW, h: 3.35, lang: "js", titulo: "material/dapp-ficha/index.html (resumido)", size: 11 });
    D.tabla(s, ["pieza", "para qué", "¿firma?"], [
      ["Provider", "Leer: saldos, estado, eventos, recibos.", "No"],
      ["Signer", "Firmar y enviar transacciones.", "Sí"],
      ["Contract", "Traducir llamadas de JS a la cadena usando el ABI.", "Según la función"],
    ], { y: 5.35, h: 1.35, colW: [2.2, 7.393, 2.5], size: 11 });
    s.addNotes("Son líneas reales de la dApp de referencia (ethers 6.15 cargado desde jsDelivr). En ethers v5 era providers.Web3Provider; si encuentran tutoriales viejos con ese nombre, están desactualizados. viem es la alternativa moderna con otra API; los conceptos son los mismos.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · el ABI", titulo: "Lo único que la interfaz necesita del contrato", ic: "documento", tituloSize: 26 });
    D.codigo(s, `const ABI = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];`, { x: M, y: 1.85, w: CW, h: 2.35, lang: "js", titulo: "el ABI completo de la dApp: cinco líneas", size: 11.5 });
    D.lista(s, [
      "Formato «legible» de ethers: se copia la firma de la función tal como en Solidity.",
      "Solo lo que la interfaz usa. El ABI completo está en artifacts/ tras compilar con Hardhat.",
      "Con él, ethers calcula el selector de 4 bytes (Sesión 5) y codifica los argumentos.",
      "No es secreto: el contrato verificado lo publica en el explorador.",
    ], { y: 4.4, h: 1.75, size: 12.5, gap: 6 });
    D.parrafo(s, "Error típico: una coma de menos o un tipo mal escrito (uint en vez de uint256) y ethers lanza error al crear el Contract.", { y: 6.2, h: 0.5, size: 12, color: C.ocre });
    s.addNotes("Es el mismo ABI que usa scripts/s12/comprobar-ficha.js, para que el punto de control de terminal pruebe exactamente lo que va a hacer el navegador. Si cambian una firma en el contrato, hay que cambiarla aquí: el ABI es un contrato entre frontend y cadena.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · leer no es escribir", titulo: "La distinción que define el costo", ic: "balanza", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "Lectura · eth_call", texto: "ficha.balanceOf(ana)\n\nEl nodo ejecuta la función en su copia local y responde. No hay transacción, no hay firma, no hay gas para el usuario, no queda rastro en la cadena. Instantánea." },
      { et: "Escritura · transacción", texto: "ficha.transfer(dest, monto)\n\nLa billetera pide firmar; la transacción viaja a la red; espera turno en un bloque; cuesta gas; puede fallar. Devuelve una tx cuyo recibo hay que esperar." },
      { y: 1.85, h: 2.6, size: 12.5 });
    D.tabla(s, ["operación sobre FichaUSB (medida en Hardhat)", "gas"], [
      ["transfer a una cuenta que tenía saldo 0", "51 692"],
      ["transfer a una cuenta que ya tenía saldo", "34 592"],
      ["balanceOf llamada como lectura", "0 para el usuario (el nodo la ejecuta gratis)"],
    ], { y: 4.65, h: 1.55, colW: [7.6, 4.493], size: 11.5 });
    D.parrafo(s, "¿Por qué la primera transferencia cuesta más? Escribir una celda de almacenamiento que estaba en cero es la operación más cara de la EVM (Sesión 5).", { y: 6.3, h: 0.45, size: 11.5, color: C.ocre });
    s.addNotes("Cifras medidas contra un nodo local de Hardhat 3.16 durante la preparación. Si la misma función balanceOf se enviara como transacción costaría unos 24 000 de gas (estimado): por eso nunca se «transacciona» una lectura. La diferencia de ~17 000 entre las dos transferencias es el SSTORE de cero a no-cero.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · unidades", titulo: "No hay decimales en la cadena", ic: "moneda", tituloSize: 29 });
    D.codigo(s, `decimales = 18
ethers.parseUnits("2.5", 18)     // -> 2500000000000000000n   (lo que viaja)
ethers.formatUnits(1000000000000000000000n, 18)   // -> "1000.0"  (lo que se muestra)

Number(1000000000000000000000n)  // 1e+21 -> pierde precisión: NO`, { x: M, y: 1.85, w: CW, h: 2.15, lang: "js", titulo: "ejecutado con ethers 6", size: 11.5 });
    D.dosColumnas(s,
      { et: "Regla de oro", texto: "Todo lo que va o viene de la cadena es un entero BigInt (sufijo n). Se convierte a texto legible solo para mostrar, y de texto a BigInt solo al enviar." },
      { et: "El error de concepto típico", linea: C.rojo, color: C.rojo, texto: "Usar Number o parseFloat con montos: 0,1 + 0,2 no da 0,3 en JavaScript, y los enteros grandes pierden dígitos. Con dinero, eso es un error de contabilidad." },
      { y: 4.2, h: 2.5, size: 12.5 });
    s.addNotes("Conecta con la S10 (decimals = 18). comprobar-ficha.js imprime a propósito el saldo bruto (1000000000000000000000) y el legible (1000.0) uno debajo del otro: pídanles que lo miren. Pregunta del informe: ¿qué número exacto devuelve balanceOf si tienen 1000 FUSB?");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · las dos esperas", titulo: "«Enviada» no es «hecha»", ic: "reloj", tituloSize: 30 });
    D.codigo(s, `const tx = await ficha.transfer(dest, cantidad);
// ya hay HASH: la transacción fue firmada y enviada. NO se ha transferido nada.

const recibo = await tx.wait();
// ahora sí: está en un bloque. recibo.status 1 = éxito.
// en ethers v6, si status es 0 (revertida), wait() LANZA un error CALL_EXCEPTION.`, { x: M, y: 1.85, w: CW, h: 2.25, lang: "js", size: 11.5 });
    D.pasos(s, [
      ["PRIMER await", "Espera a que el usuario firme en MetaMask y a que el RPC acepte la transacción. Segundos."],
      ["ENTRE LOS DOS", "La transacción está pendiente en el mempool. Puede tardar, reemplazarse o no minarse nunca."],
      ["SEGUNDO await", "Espera a que se mine. En Sepolia, unos 12 s por bloque; en la red local, al instante."],
    ], { y: 4.3, alto: 0.72, gap: 0.1, anchoEt: 2.6, size: 12 });
    s.addNotes("EL error de la sesión: mostrar «listo» después del primer await. En la red local de Hardhat se mina al instante y el error no se nota; en Sepolia sí. Por eso el laboratorio se prueba también en Sepolia si es posible. Verificamos el comportamiento de wait() con ethers 6.17: una transacción revertida hace que wait() lance CALL_EXCEPTION con el recibo adjunto.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · cuánto esperar", titulo: "Una confirmación no es finalidad", ic: "candado", tituloSize: 28 });
    D.parrafo(s, "tx.wait() espera por defecto UNA confirmación: el bloque que la incluye. Recuerden la Sesión 4: ese bloque todavía puede reorganizarse.", { y: 1.85, h: 0.65, size: 14 });
    D.tabla(s, ["qué pasa en la interfaz", "cuánto esperar"], [
      ["Mostrar un saldo actualizado, un «me gusta»", "1 confirmación: tx.wait()."],
      ["Liberar algo de valor (un producto, un certificado)", "Varias: tx.wait(n), o esperar la finalidad."],
      ["Finalidad económica en Ethereum", "Unos 13 minutos (dos épocas, Sesión 4)."],
    ], { y: 2.65, h: 2.1, colW: [6.3, 5.793], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Decisión de negocio, no técnica", x: M, y: 4.95, w: CW, h: 1.75, texto: "Cuántas confirmaciones esperar depende de cuánto se pierde si la transacción desaparece. Para el laboratorio, una basta. Para un sistema que entrega algo de valor, hay que escribir el número en el diseño y justificarlo, igual que en la Sesión 4.", size: 12.5 });
    s.addNotes("Esto cumple la promesa de la lámina A.18 de la S4: «en la Sesión 12 veremos cómo lo maneja una interfaz». tx.wait(3) espera tres confirmaciones. En redes de capa 2 (Sesión 16) la noción cambia otra vez.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · verificación · ethers", titulo: "¿Qué muestra la pantalla, y cuándo?", ic: "pregunta", tituloSize: 27 });
    D.codigo(s, `estado("Confirma en la billetera…");
const tx = await ficha.transfer(dest, ethers.parseUnits(monto, 18));
estado("¡Listo! Transferencia hecha.");      // (1)
const recibo = await tx.wait();
refrescarSaldo();`, { x: M, y: 1.85, w: CW, h: 2.0, lang: "js", titulo: "código de un estudiante", size: 11.5 });
    D.lista(s, [
      "¿Qué está mal en la línea (1)? ¿Qué debería decir ahí?",
      "Si el usuario escribe 2,5 en el monto, ¿qué número exacto viaja a la cadena?",
      "¿Qué pasa con este código si la transacción se revierte?",
    ], { y: 4.0, h: 1.2, size: 13, gap: 5 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Respuestas", x: M, y: 5.3, w: CW, h: 1.4, texto: "(1) Dice «listo» cuando apenas se ENVIÓ: debe decir «enviada, esperando confirmación» y el «listo» va después de wait(). Viaja 2500000000000000000n. Si se revierte, wait() lanza CALL_EXCEPTION y, sin try/catch, la pantalla se queda en «¡Listo!»: una mentira.", size: 12 });
    s.addNotes("4 minutos. La tercera respuesta es la más importante: sin manejo de errores, la interfaz miente. Enlaza con los cuatro estados de A.14.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · escuchar la cadena", titulo: "Que la interfaz se actualice sola", ic: "red", tituloSize: 28 });
    D.codigo(s, `function suscribirEventos() {
  contrato.on("Transfer", (from, to) => {
    if (from === cuenta || to === cuenta) refrescarSaldo();   // solo si me toca
  });
}`, { x: M, y: 1.85, w: CW, h: 1.8, lang: "js", titulo: "dapp-ficha/index.html", size: 12 });
    D.dosColumnas(s,
      { et: "Sin eventos", texto: "La interfaz pregunta el saldo cada pocos segundos, cambie o no. Gasta cuota del RPC y siempre va un poco atrasada." },
      { et: "Con eventos", texto: "La interfaz no pregunta hasta que el contrato emite Transfer. Si un compañero les transfiere, el saldo cambia solo, sin recargar." },
      { y: 3.85, h: 1.75, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Lo que encontramos al probar la dApp de referencia", x: M, y: 5.75, w: CW, h: 0.95, texto: "suscribirEventos() estaba definida pero nunca se llamaba: el saldo no se refrescaba solo. Se corrigió y se probó.", size: 12 });
    s.addNotes("Caso real de esta preparación: la dApp de referencia tenía la función de eventos escrita y nunca invocada. Se detectó probando: una transferencia hecha desde fuera no actualizaba el saldo. Tras la corrección, una transferencia externa de 10 FUSB bajó el saldo mostrado de 996 a 986 en menos de 5 s sin recargar. Moraleja: el código que no se ejecuta no se prueba solo.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · la UX de Web3", titulo: "Los cuatro estados que todos olvidan", ic: "alerta", tituloSize: 27 });
    D.tabla(s, ["estado", "qué ve el usuario si NO se maneja", "qué debe mostrar la interfaz"], [
      ["1 · Red equivocada", "Un error críptico, o una transacción en otra red.", "«Estás en la red equivocada» y el botón Enviar bloqueado."],
      ["2 · Sin billetera", "La página se rompe: window.ethereum no existe.", "«Instala MetaMask» y el botón Conectar desactivado."],
      ["3 · Usuario rechaza", "La app queda «cargando» para siempre.", "«Rechazaste la transacción» y volver al estado normal."],
      ["4 · Revertida", "La app dice «éxito» cuando falló.", "«Se revirtió», con el motivo y si se pagó gas o no."],
    ], { y: 1.85, h: 3.4, colW: [2.5, 4.9, 4.693], size: 11 });
    D.enunciado(s, "Y dos estados que no son errores pero se olvidan igual: PENDIENTE (enviada, sin minar) y MINADA (con su bloque).", { y: 5.45, h: 1.25, size: 15.5, line: C.naranja });
    s.addNotes("La tabla es el núcleo evaluable del laboratorio: una captura por cada estado, provocado a propósito. Los estados pendiente y minada son los de A.10; la dApp usa amarillo para pendiente, verde para minada y rojo para error.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · cómo se detecta cada uno", titulo: "Del estado al código", ic: "codigo", tituloSize: 29 });
    D.tabla(s, ["estado", "señal en el código (ethers v6 + MetaMask)", "cuándo aparece"], [
      ["Sin billetera", "typeof window.ethereum === \"undefined\"", "Al cargar la página."],
      ["Red equivocada", "(await provider.getNetwork()).chainId !== 11155111n", "Al conectar, y en el evento chainChanged."],
      ["Rechazo", "e.code === \"ACTION_REJECTED\" (4001 en EIP-1193)", "Al esperar la firma."],
      ["Revertida al simular", "e.code === \"CALL_EXCEPTION\", sin e.receipt", "Antes de firmar: estimateGas falla. No gasta gas."],
      ["Revertida minada", "e.code === \"CALL_EXCEPTION\", con e.receipt", "En tx.wait(). El gas SÍ se pagó."],
    ], { y: 1.85, h: 3.75, colW: [2.4, 5.6, 4.093], size: 10.5 });
    D.parrafo(s, "Verificado en la preparación: transferir más que el saldo falla al simular con CALL_EXCEPTION y el mensaje «execution reverted (unknown custom error)», sin abrir MetaMask.", { y: 5.8, h: 0.9, size: 12.5, color: C.ocre });
    s.addNotes("«unknown custom error» aparece porque el ABI de la dApp no declara los errores personalizados de OpenZeppelin (ERC20InsufficientBalance). Reto para quien termine: agregar \"error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)\" al ABI y ver cómo ethers decodifica el motivo. En la red local, Hardhat rechaza incluso las transacciones forzadas que revertirían, así que el caso «minada» se ve mejor en Sepolia.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · el camino de una transacción en pantalla", titulo: "De «Enviar» a «confirmada»", ic: "flecha", tituloSize: 27 });
    D.pasos(s, [
      ["VALIDAR", "Dirección con ethers.isAddress y monto > 0 ANTES de tocar la billetera. Si fallan, avisar y parar."],
      ["PEDIR FIRMA", "«Confirma en la billetera…» (amarillo). Aquí puede ocurrir el rechazo (3) o la reversión al simular (4)."],
      ["ENVIADA", "Ya hay hash: «Esperando confirmación… 0x1a2b…» (amarillo). Todavía NO decir listo."],
      ["ESPERAR RECIBO", "tx.wait(). Si lanza CALL_EXCEPTION con recibo: revertida minada (4)."],
      ["CONFIRMADA", "«¡Listo! Confirmada en el bloque 11» (verde). Refrescar saldo; opcional: enlace al explorador."],
    ], { y: 1.85, alto: 0.8, gap: 0.1, anchoEt: 2.6, size: 12 });
    D.parrafo(s, "Cada paso tiene su mensaje. El usuario nunca debe mirar una pantalla que no dice qué está pasando.", { y: 6.35, h: 0.4, size: 12.5, color: C.ocre });
    s.addNotes("El «bloque 11» no es inventado: es el mensaje que mostró la dApp de referencia en la prueba de preparación contra el nodo local. Durante el paso 2 hay que desactivar el botón Enviar para evitar dobles envíos (la dApp lo hace en el try/finally).");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · dos mejoras de UX reales", titulo: "Cambiar de red, y varias billeteras", ic: "engranaje", tituloSize: 26 });
    D.dosColumnas(s,
      { et: "Ofrecer el cambio de red", texto: "En vez de solo decir «red equivocada», la interfaz puede pedirle a MetaMask que cambie:\n\nwallet_switchEthereumChain con chainId 0xaa36a7 (Sepolia).\n\nSi la billetera no conoce esa red, responde el código 4902 y hay que ofrecer agregarla." },
      { et: "Varias billeteras: EIP-6963", texto: "Con dos extensiones instaladas, ambas pelean por window.ethereum y «gana la última en cargar». EIP-6963 (estado Final) lo resuelve: cada billetera se anuncia con un evento y la dApp muestra la lista para que el usuario elija." },
      { y: 1.85, h: 3.6, size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Para el proyecto, no para hoy", x: M, y: 5.65, w: CW, h: 1.05, texto: "La dApp del laboratorio usa window.ethereum a secas: basta para aprender. wagmi y RainbowKit ya implementan las dos mejoras.", size: 12.5 });
    s.addNotes("0xaa36a7 = 11155111 en hexadecimal. Texto de EIP-6963 verificado (Final): eventos eip6963:announceProvider y eip6963:requestProvider. El código 4902 lo devuelve MetaMask cuando la red no está agregada.");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · el stack moderno", titulo: "ethers a mano, o React + wagmi + RainbowKit", ic: "capas", tituloSize: 24 });
    D.codigo(s, `const { address, isConnected } = useAccount();
const { data: saldo } = useReadContract({ address: FICHA, abi, functionName: "balanceOf", args: [address] });
const { writeContract, isPending } = useWriteContract();
const { isSuccess } = useWaitForTransactionReceipt({ hash });`, { x: M, y: 1.85, w: CW, h: 1.75, lang: "js", titulo: "wagmi · los mismos cuatro pasos, como ganchos de React", size: 10 });
    D.tabla(s, ["", "ethers a mano (laboratorio)", "React + wagmi + RainbowKit (proyecto)"], [
      ["Se ve cada pieza", "Sí: ideal para entender.", "No: la magia la hacen los ganchos."],
      ["Herramientas", "Un HTML y un navegador.", "Node, npm y un empaquetador (p. ej. Vite)."],
      ["Billeteras y red", "A mano.", "Incluido."],
    ], { y: 3.8, h: 1.75, colW: [3.2, 4.2, 4.693], size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Versiones, verificadas en septiembre de 2026", x: M, y: 5.7, w: CW, h: 1.0, texto: "wagmi va en la 3.x, pero RainbowKit 2.2 exige wagmi 2.x. Si usan RainbowKit, fijen wagmi 2 (versiones congeladas).", size: 12 });
    s.addNotes("Versiones consultadas en el registro de npm: wagmi 3.7.7, @rainbow-me/rainbowkit 2.2.11 con peerDependency wagmi ^2.9.0, viem 2.x, ethers 6.17.0. ⚠ VERIFICAR ANTES DE DICTAR: si RainbowKit ya publicó compatibilidad con wagmi 3. Los nombres de ganchos son los de wagmi 2/3.");
  }

  {
    const s = await D.lamina({ kicker: "A.19 · verificación · UX", titulo: "Diagnostiquen la pantalla", ic: "pregunta", tituloSize: 29 });
    D.tabla(s, ["lo que reporta un usuario", "¿qué estado es?", "¿qué debió mostrar la dApp?"], [
      ["«Le di Enviar, cerré el MetaMask y la página quedó cargando.»", "?", "?"],
      ["«Decía listo, pero el saldo de mi amigo no cambió.»", "?", "?"],
      ["«Abrí el link desde el celular y no pasó nada al tocar Conectar.»", "?", "?"],
    ], { y: 1.85, h: 2.6, colW: [6.1, 2.3, 3.693], size: 12 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Respuestas", x: M, y: 4.65, w: CW, h: 2.05, texto: "1) Rechazo (3): «Rechazaste la transacción» y volver a habilitar el botón. 2) Dijo «listo» sin esperar el recibo: o seguía pendiente, o se revirtió (4); debía decir «esperando confirmación» y luego el resultado real. 3) Sin billetera (2): el navegador del celular no tiene window.ethereum; debía decir «instala una billetera o abre esto desde su navegador interno».", size: 12 });
    s.addNotes("4 minutos. Es exactamente el tipo de pregunta del Avance 2 y de la sustentación: un síntoma de usuario y un diagnóstico técnico. Pausa de 10 minutos después de la síntesis.");
  }

  {
    const s = await D.lamina({ kicker: "A.20 · lo que hay que llevarse del bloque A", titulo: "Seis ideas sobre dApps", ic: "lista", tituloSize: 28 });
    const ideas = [
      "Lo descentralizado es el contrato; el frontend y el RPC muchas veces no. Hay que decirlo.",
      "La página pide; la billetera decide y firma. La clave nunca sale de la billetera.",
      "Provider lee gratis (eth_call); Signer escribe con una transacción que cuesta gas.",
      "Todo monto es BigInt: parseUnits para enviar, formatUnits para mostrar.",
      "await transfer() significa «enviada»; «hecha» lo dice tx.wait(). Una confirmación no es finalidad.",
      "La calidad está en los cuatro errores y en los estados pendiente y minada.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 13.5, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
    s.addNotes("Pausa de 10 minutos. Pidan que en la pausa abran MetaMask y confirmen que recuerdan cómo desbloquearla, y que tengan a mano la dirección de su FichaUSB de la S10 si la desplegaron en Sepolia.");
  }

  /* ================================================================ B */
  {
    const s = await D.divisor({ letra: "B", titulo: "Laboratorio 12", sub: "Una interfaz que conecta la billetera, muestra el saldo de la FichaUSB, transfiere y maneja los cuatro errores. Sin compilar nada.", minutos: "APROXIMADAMENTE 85 MINUTOS · EN PAREJAS", ic: "pantalla" });
    s.addNotes("Guía: material/laboratorio-12/guia/guia-laboratorio-12.pdf. Material: laboratorio-12/andamiaje/index.html (con TODO) y scripts en laboratorios-evm/scripts/s12. Recomendación para la sala: red local de Hardhat (no depende de faucets ni de internet salvo para cargar ethers la primera vez).");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · el punto de partida", titulo: "Un solo archivo, ocho TODO", ic: "codigo", tituloSize: 29 });
    D.parrafo(s, "laboratorio-12/andamiaje/index.html es la dApp de referencia con las funciones clave vacías. Mientras un TODO falte, la caja «Estado» dice cuál: no falla en silencio.", { y: 1.85, h: 0.9, size: 13.5 });
    D.tabla(s, ["TODO", "qué completan", "lámina que lo explica"], [
      ["1", "Detectar que no hay billetera (estado 2).", "A.14 · A.15"],
      ["2 · 3", "Conectar: provider, signer, cuenta; detectar red equivocada (estado 1).", "A.6 · A.15"],
      ["4 · 5", "Crear el Contract; leer symbol, decimals y balanceOf; formatUnits.", "A.7 · A.9"],
      ["6", "transfer con parseUnits, mensaje de «enviada» y tx.wait().", "A.10 · A.16"],
      ["7", "Clasificar el error: rechazo (3), revertida (4), sin gas.", "A.15"],
      ["8", "Escuchar Transfer y refrescar el saldo solo.", "A.13"],
    ], { y: 2.9, h: 3.8, colW: [1.3, 7.6, 3.193], size: 11.5 });
    s.addNotes("La solución es material/dapp-ficha/index.html (en el repositorio del docente; en el público se reemplaza por el andamiaje). Los comentarios de cada TODO traen el código casi literal: el aprendizaje está en entender qué hace cada línea y en PROVOCAR los errores, no en tipearlo.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · paso 1 · servir la página", titulo: "Doble clic no sirve: hace falta un servidor", ic: "terminal", tituloSize: 25 });
    D.dosColumnas(s,
      { et: "Por qué file:// falla", linea: C.rojo, color: C.rojo, texto: "Chrome no deja que las extensiones actúen en páginas file:// salvo que se active un permiso por extensión, y MetaMask da permisos por SITIO: una página file:// no tiene un origen normal. Resultado típico: «no se detecta billetera»." },
      { et: "La solución: un servidor local", texto: "Desde la carpeta andamiaje:\n\nnpx serve .\n→ abrir http://localhost:3000\n\no, si no hay Node:\npython -m http.server 8000\n→ abrir http://localhost:8000" },
      { y: 1.85, h: 3.25, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "No activen «Permitir acceso a URL de archivo»", x: M, y: 5.3, w: CW, h: 1.4, texto: "Funcionaría a veces, pero da a la extensión acceso a sus archivos locales. La práctica correcta es servir por http://localhost, igual que en producción se sirve por https.", size: 12.5 });
    s.addNotes("El manifiesto de MetaMask declara file://, pero Chrome deja ese acceso apagado por defecto para toda extensión; es un interruptor en chrome://extensions. npx serve descarga el paquete serve la primera vez (pide confirmación): si la sala no deja, python -m http.server ya viene con Python. Probado en la preparación con python -m http.server.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · paso 2 · un token para probar", titulo: "Red local (sala) o Sepolia (casa)", ic: "cohete", tituloSize: 28 });
    D.codigo(s, `# terminal 1 · se deja abierta
npx hardhat node

# terminal 2 · despliega FichaUSB, les da 1000 FUSB y 10 ETH locales
$env:DESTINO="0xSU_DIRECCION_DE_METAMASK"
npx hardhat run scripts/s12/preparar-local.js --network localhost`, { x: M, y: 1.85, w: 7.4, h: 2.6, lang: "py", titulo: "opción A · red local de Hardhat", size: 10.5 });
    D.lista(s, [
      "En MetaMask: agregar red RPC http://127.0.0.1:8545, chainId 31337, moneda ETH.",
      "Ninguna clave privada se importa: el script les manda fondos a SU cuenta.",
      "Opción B: la FichaUSB que desplegaron en la S10, en Sepolia.",
    ], { x: M + 7.65, y: 1.85, w: CW - 7.65, h: 2.6, size: 12, gap: 8 });
    D.codigo(s, `DIRECCION_FICHA : 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
chainId         : 31337
    FUSB        : 1000.0
    ETH (local) : 10.0`, { x: M, y: 4.65, w: CW, h: 1.35, lang: "js", titulo: "salida esperada (la dirección puede variar)", size: 10.5 });
    D.parrafo(s, "Si reinician el nodo, la cadena se borra: se vuelve a correr el script y se limpia la actividad de MetaMask.", { y: 6.15, h: 0.55, size: 12, color: C.ocre });
    s.addNotes("preparar-local.js se niega a correr fuera de la red 31337 (regala ETH). La dirección 0x9fE4… es la que salió en la preparación como tercer contrato de la cuenta #0; en un nodo recién iniciado suele salir 0x5FbDB…; da igual, se copia la que imprima. El ETH local mostrado será 10.0 para una cuenta nueva de MetaMask.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · paso 3 · configurar y comprobar", titulo: "Antes del navegador, la terminal", ic: "terminal", tituloSize: 28 });
    D.codigo(s, `const DIRECCION_FICHA = "0x9fE4…a6e0";   // la que imprimió el script
const CHAIN_ID_SEPOLIA = 31337n;          // 11155111n si usan Sepolia`, { x: M, y: 1.85, w: CW, h: 1.05, lang: "js", titulo: "en index.html", size: 11.5 });
    D.codigo(s, `$env:FICHA="0x9fE4…a6e0"; $env:CUENTA="0xSU_DIRECCION"
npx hardhat run scripts/s12/comprobar-ficha.js --network localhost

  símbolo       : FUSB
  decimales     : 18
  saldo bruto   : 1000000000000000000000      <- lo que devuelve la cadena
  saldo legible : 1000.0 FUSB   <- formatUnits`, { x: M, y: 3.05, w: CW, h: 2.35, lang: "py", titulo: "punto de control · salida real", size: 10.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Por qué este paso", x: M, y: 5.55, w: CW, h: 1.15, texto: "Hace las mismas lecturas que la dApp con el mismo ABI. Si esto falla, el problema es la dirección o la red, no su HTML: ahorra media hora de depurar el navegador.", size: 12.5 });
    s.addNotes("El nombre CHAIN_ID_SEPOLIA se conserva igual al de la solución para que comparen fácil; en red local se le pone 31337n. Si comprobar-ficha dice «NO hay contrato», casi siempre reiniciaron el nodo o están en otra red.");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · pasos 4 y 5 · completar los TODO", titulo: "Conectar y leer, después escribir", ic: "martillo", tituloSize: 27 });
    D.pasos(s, [
      ["TODO 1 A 3", "Conectar. Se espera: cuenta 0x…, red «unknown (31337)» o «sepolia (11155111)»."],
      ["TODO 4 Y 5", "Leer. Se espera: «Saldo FUSB 1000.0 FUSB» y el estado verde «Conectado»."],
      ["TODO 6", "Transferir 2,5 a un compañero. Amarillo «esperando confirmación», luego verde con el bloque."],
      ["TODO 7", "Errores clasificados: cada uno con su mensaje rojo propio (lámina siguiente)."],
      ["TODO 8", "Que un compañero les transfiera: el saldo cambia SIN recargar la página."],
    ], { y: 1.85, alto: 0.78, gap: 0.1, anchoEt: 2.3, size: 12 });
    D.parrafo(s, "Después de cada TODO: guardar, recargar el navegador (F5) y probar. Nada se compila.", { y: 6.3, h: 0.4, size: 12.5, color: C.ocre });
    s.addNotes("Los mensajes esperados son los que mostró la dApp de referencia en la prueba de navegador de la preparación (saldo, «¡Listo! Transferencia confirmada en el bloque N.»). En la red local todo es instantáneo: la transición amarillo → verde apenas se ve. En Sepolia dura unos segundos.");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · el reto de verdad", titulo: "Provocar los cuatro errores a propósito", ic: "bicho", tituloSize: 27 });
    D.tabla(s, ["estado", "cómo provocarlo", "mensaje esperado"], [
      ["1 · Red equivocada", "En MetaMask, cambiar a otra red (p. ej. Sepolia si esperan 31337) y reconectar.", "«Red equivocada…» y Enviar bloqueado."],
      ["2 · Sin billetera", "Abrir la página en otro navegador o ventana sin MetaMask.", "«No se detecta una billetera…»"],
      ["3 · Rechazo", "Pulsar Enviar y, en MetaMask, «Rechazar».", "«Rechazaste la transacción…»"],
      ["4 · Revertida", "Transferir más FUSB de los que tienen.", "«Se revirtió al simularla… no se gastó gas»."],
    ], { y: 1.85, h: 3.55, colW: [2.4, 5.8, 3.893], size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Evidencia", x: M, y: 5.6, w: CW, h: 1.1, texto: "Una captura por estado, más una de pendiente y una de confirmada. Seis capturas: es lo que demuestra que se entendió la UX.", size: 12.5 });
    s.addNotes("Los cuatro se reprodujeron en la preparación con una billetera simulada contra el nodo local (sin MetaMask real): los mensajes de la tercera columna son los que mostró la dApp. Con MetaMask real el texto del motivo del estado 4 puede variar un poco; lo que se evalúa es que se clasifique como revertida.");
  }

  {
    const s = await D.lamina({ kicker: "B.7 · lo que más falla", titulo: "Errores comunes del laboratorio 12", ic: "alerta", tituloSize: 27 });
    D.tabla(s, ["síntoma", "causa y arreglo"], [
      ["«No se detecta una billetera» teniendo MetaMask", "Abrieron el archivo con doble clic (file://). Sírvanlo con npx serve o python -m http.server."],
      ["«could not decode result data» al leer", "DIRECCION_FICHA no tiene contrato en ESA red: dirección o red equivocada, o reiniciaron el nodo."],
      ["MetaMask: «nonce too high» en red local", "Reiniciaron el nodo: en MetaMask, borrar los datos de actividad de la cuenta (configuración avanzada)."],
      ["Red siempre «equivocada»", "CHAIN_ID_SEPOLIA no coincide: 31337n en local; comparen BigInt con BigInt (con la n)."],
      ["El saldo no se actualiza solo", "Falta llamar suscribirEventos() después de conectar (TODO 4 y 8)."],
      ["ethers is not defined", "Sin internet no carga ethers desde jsDelivr. Recarguen con conexión."],
    ], { y: 1.85, h: 4.85, colW: [4.3, 7.793], size: 10.5 });
    s.addNotes("«could not decode result data» es el mensaje de ethers v6 cuando eth_call devuelve 0x (no hay código en esa dirección). El de «nonce too high» es clásico con Hardhat: MetaMask recuerda el nonce de una cadena que ya no existe. La ubicación exacta del botón de MetaMask cambia entre versiones: la guía lo describe.");
  }

  {
    const s = await D.lamina({ kicker: "B.8 · cómo saber que terminó · qué se entrega", titulo: "Evidencia del laboratorio 12", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["Repositorio", "index.html con los 8 TODO completos, en el repo del equipo.", "25 %"],
      ["Transferencia real", "Captura de «confirmada» con su hash (en Sepolia, enlace al explorador).", "20 %"],
      ["Los cuatro errores + 2 estados", "Seis capturas, cada estado provocado a propósito.", "35 %"],
      ["Eventos", "Saldo actualizado sin recargar tras una transferencia de un compañero.", "10 %"],
      ["Reflexión", "¿Qué parte de su dApp NO está descentralizada? (tabla A.2).", "10 %"],
    ], { y: 1.85, h: 3.5, colW: [3.2, 7.293, 1.6], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Dónde está todo", x: M, y: 5.55, w: CW, h: 1.15, texto: "Guía exageradamente detallada: laboratorio-12/guia/guia-laboratorio-12.pdf. Terminó cuando las seis capturas existen y el saldo cambia solo. Sin hash de transacción, no se califica.", size: 12.5 });
    s.addNotes("Si trabajaron solo en red local, el hash de la transacción local vale como evidencia del laboratorio pero no es verificable por terceros: recomienden repetir una transferencia en Sepolia desde casa (política de laboratorios del plan: evidencia verificable en cadena).");
  }

  /* ================================================================ C */
  {
    const s = await D.divisor({ letra: "C", titulo: "El proyecto", sub: "Conectar la interfaz propia a los contratos propios. El primer momento en que el proyecto se ve como un producto.", minutos: "APROXIMADAMENTE 20 MINUTOS", ic: "bandera" });
    s.addNotes("20 minutos por equipos de proyecto (no parejas). Cada equipo sale con la frase de integración de C.2 escrita.");
  }

  {
    const s = await D.lamina({ kicker: "C.1 · hacia el Avance 1", titulo: "Lo que debe funcionar en la Sesión 13", ic: "flecha", tituloSize: 27 });
    D.tabla(s, ["pieza", "estado esperado"], [
      ["Contratos", "Desplegados y verificados en Sepolia, con cobertura ≥ 80 %."],
      ["Interfaz", "Conecta la billetera, lee al menos un dato y ejecuta al menos una transacción."],
      ["Estados", "Los cuatro errores y los estados pendiente/minada, con mensajes claros."],
      ["Repositorio", "Contratos, pruebas y frontend, con un README que diga qué NO está descentralizado."],
    ], { y: 1.85, h: 2.75, colW: [2.6, 9.493], size: 12.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Qué dice el plan", x: M, y: 4.85, w: CW, h: 1.85, texto: "El Avance 1 (S13) exige contratos desplegados y verificados, pruebas con 80 % de cobertura y repositorio documentado. La interfaz integrada se evalúa en el Avance 2 (S16) y en la rúbrica final («Integración e interfaz», 10 %: estados de transacción manejados y UX comprensible). Empezar hoy es llegar holgados.", size: 12.5 });
    s.addNotes("Sección 8 del plan: Avance 1 = contratos + pruebas + repo; Avance 2 = dApp integrada. La fila «Interfaz» es adelanto, no requisito del Avance 1. Díganlo así para no generar ansiedad falsa.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · trabajo en equipos", titulo: "La frase de integración", ic: "taller", tituloSize: 29 });
    D.enunciado(s, "«Nuestra interfaz LEE ____ con una llamada view, y ESCRIBE ____ con una transacción que firma ____.»", { y: 1.85, h: 1.6, size: 19, line: C.naranja });
    D.lista(s, [
      "Si no la pueden completar en una línea, la interfaz aún no está pensada.",
      "Una función de punta a punta antes que diez a medias (corte vertical, como el proyecto del docente).",
      "Para el proyecto pueden usar React + wagmi; lo que se evalúa son los estados, no el framework.",
      "Reutilicen el manejo de errores del laboratorio: la tabla A.15 vale igual en React.",
    ], { y: 3.7, h: 2.2, size: 13, gap: 7 });
    D.parrafo(s, "Verificación del bloque C: cada equipo lee su frase en voz alta. El docente pregunta «¿y si la transacción se revierte?».", { y: 6.05, h: 0.65, size: 12.5, color: C.ocre });
    s.addNotes("Ejemplo para arrancar: «Nuestra interfaz LEE el estado de una entrada con estadoDe(id), y ESCRIBE una reventa con revender(id, precio), que firma el dueño de la entrada.» Si algún equipo no tiene transacción de usuario (solo el admin escribe), es una señal para revisar si necesitan blockchain.");
  }

  await D.preguntaSemana({
    pregunta: "Abran una dApp conocida y, a mitad de uso, cambien de red en MetaMask o desconecten internet. ¿Qué deja de funcionar y qué mensaje les muestra? ¿Maneja los cuatro estados?",
    trabajo: [
      "Entregar la evidencia del laboratorio 12 (seis capturas, repo y reflexión).",
      "Avance 1 para la Sesión 13: contratos verificados + pruebas ≥ 80 % + README.",
      "Escribir la frase de integración del proyecto en el README.",
      "Leer sobre EIP-712 y «Sign-In with Ethereum» para la Sesión 13.",
    ],
    notas: "La pregunta se abre al inicio de la S13 (5 min). Es auditoría de UX: encontrar dApps reales que fallen en alguno de los cuatro estados es muy común y muy instructivo.",
  });

  {
    const s = await D.cierre({
      frase: "await transfer() no dice «hecho», dice «enviado». Esa diferencia es la UX de Web3.",
      sub: "Ya hay una interfaz que lee y escribe en la cadena sin mentirle al usuario. La próxima sesión la completa: indexación, nombres legibles, firmas sin gas. Y se entrega el Avance 1.",
      proxima: "Sesión 13 · Integración full-stack e infraestructura · Avance 1",
    });
    s.addNotes("Cierre en un minuto. Repitan la regla: validar, pedir firma, enviada, esperar recibo, confirmada; y un mensaje rojo claro para cada uno de los cuatro errores.");
  }

  return D.guardar(path.join(__dirname, "Sesion-12-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
