/* =====================================================================
   Sesión 12 · Web 3.0: conectando el frontend a la cadena
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 12 · WEB 3.0 · FRONTEND Y CADENA", titulo: "Sesión 12 · Frontend Web3" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 12 · UNIDAD III · WEB 3.0",
    titulo: "CONECTAR LA\nPANTALLA A\nLA CADENA",
    sub: "Hasta hoy todo pasaba en la terminal y el explorador. Hoy, por fin, una interfaz que una persona no técnica puede usar.",
    palabra: "CONECTAR",
    ic: "pantalla",
    notas: "Asume React básico (nivelación entregada en S9). Lo nuevo no es React: es hablar con la cadena y manejar que una transacción NO es instantánea.",
  });

  await D.agenda({
    intro: "La sesión más de «producto» del curso. El error que se combate: creer que una transacción es instantánea y siempre exitosa.",
    bloques: [
      ["A", "ARQUITECTURA Y ethers", "Qué está descentralizado, Provider/Signer/Contract, y la UX de una transacción.", "~65 min"],
      ["B", "LABORATORIO 12", "Una interfaz que lee el saldo y transfiere el token de la S10, con los 4 errores.", "~85 min"],
      ["C", "PROYECTO", "Integrar el frontend con los contratos propios.", "~30 min"],
    ],
  });

  await D.objetivo({
    objetivo: "Construir una interfaz que lea y escriba en contratos, gestionando la billetera y los estados de una transacción.",
    preguntas: [
      "En una dApp, ¿qué parte está de verdad descentralizada y cuál no?",
      "¿Qué diferencia una lectura gratis de una transacción que cuesta gas?",
      "¿Cuáles son los cuatro errores que todo principiante ignora?",
      "¿Por qué asumir que una transacción es instantánea rompe la aplicación?",
    ],
    ra: "RA6 · Integrar una interfaz Web 3.0 con contratos, gestionando wallets, eventos y estados de transacción.",
  });

  await D.glosario({
    items: [
      ["dApp", "aplicación descentralizada", "Interfaz + contratos. La interfaz suele ser una web normal; lo descentralizado son los contratos."],
      ["Provider", "proveedor", "El objeto que LEE la cadena. Consultas gratis: saldos, estado, eventos."],
      ["Signer", "firmante", "El objeto que ESCRIBE: firma transacciones con la clave de la billetera. Cuesta gas."],
      ["ABI", "Application Binary Interface", "La descripción de las funciones del contrato que la interfaz necesita para llamarlo."],
      ["RPC", "Remote Procedure Call", "El nodo con el que habla la interfaz. Propio, o de un servicio como Alchemy o Infura."],
      ["ethers · viem", "bibliotecas de JS", "El puente entre la interfaz y la cadena. Usamos ethers v6."],
      ["wagmi · RainbowKit", "librerías de React", "Ganchos y un botón de conexión listos, para no reescribir el mismo código."],
      ["Confirmación", "confirmation", "Un bloque encima de la transacción. Una sola no es finalidad (Sesión 4)."],
    ],
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "Arquitectura y ethers", sub: "Una dApp es, casi siempre, una web normal que además sabe hablar con una cadena. Lo interesante está en ese «además».", minutos: "APROXIMADAMENTE 65 MINUTOS", ic: "engranaje" });

  {
    const s = await D.lamina({ kicker: "A.1 · qué está descentralizado", titulo: "La respuesta honesta: no tanto como parece", ic: "red", tituloSize: 26 });
    D.nodo(s, { x: M, y: 2.2, w: 2.5, h: 1.0, titulo: "FRONTEND", sub: "React, en un\nservidor normal", fill: C.superf, subSize: 11 });
    D.flecha(s, M + 2.5, 2.7, M + 3.3, 2.7, C.tinta, 2);
    D.nodo(s, { x: M + 3.3, y: 2.2, w: 2.5, h: 1.0, titulo: "RPC", sub: "Alchemy, Infura\no nodo propio", fill: C.superf, subSize: 11 });
    D.flecha(s, M + 5.8, 2.7, M + 6.6, 2.7, C.tinta, 2);
    D.nodo(s, { x: M + 6.6, y: 2.2, w: 2.5, h: 1.0, titulo: "NODO", sub: "uno de miles\nen la red", fill: C.blanco, line: C.naranja, subSize: 11 });
    D.flecha(s, M + 9.1, 2.7, M + 9.9, 2.7, C.tinta, 2);
    D.nodo(s, { x: M + 9.9, y: 2.2, w: CW - 9.9, h: 1.0, titulo: "CONTRATO", sub: "descentralizado\nde verdad", fill: C.blanco, line: C.violeta, subSize: 11 });
    D.parrafo(s, "Solo la última caja es de verdad descentralizada. El frontend vive en un servidor que alguien paga; el RPC suele ser una empresa. Si esa empresa cae, tu «dApp» deja de funcionar aunque el contrato siga vivo.", { y: 3.6, h: 0.95, size: 14 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta incómoda y honesta", x: M, y: 4.7, w: CW, h: 1.6, texto: "Si tu interfaz depende de un solo proveedor RPC y de un solo servidor de hosting, ¿en qué sentido es «descentralizada»? La respuesta madura: el VALOR y las REGLAS están descentralizados en el contrato; el acceso, muchas veces no. Se puede mejorar (frontend en IPFS, varios RPC), pero hay que decirlo con honestidad.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.2 · las tres piezas de ethers", titulo: "Provider, Signer, Contract", ic: "codigo", tituloSize: 29 });
    D.codigo(s, `// PROVIDER: lee la cadena (gratis)
const provider = new ethers.BrowserProvider(window.ethereum);

// SIGNER: firma y escribe (cuesta gas)
const signer = await provider.getSigner();

// CONTRACT: el puente hacia un contrato concreto
const ficha = new ethers.Contract(DIRECCION, ABI, signer);

const saldo = await ficha.balanceOf(cuenta);        // lectura: no cuesta
const tx    = await ficha.transfer(dest, cantidad); // escritura: transacción`, { x: M, y: 1.9, w: CW, h: 3.1, lang: "js", size: 12 });
    D.tabla(s, ["pieza", "para qué", "cuesta gas"], [
      ["Provider", "Leer: saldos, estado, eventos.", "No"],
      ["Signer", "Escribir: firmar transacciones.", "Sí"],
      ["Contract", "Traducir llamadas de JS a la cadena, usando el ABI.", "Según la función"],
    ], { y: 5.2, h: 1.5, colW: [2.2, 7.393, 2.5], size: 11.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.3 · leer no es escribir", titulo: "La distinción que define el costo", ic: "balanza", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "Lectura · view", texto: "ficha.balanceOf(ana)\n\nEl provider pregunta al nodo y devuelve la respuesta. No crea transacción, no cuesta gas, es instantánea, no pide confirmación en la billetera. Se puede llamar todas las veces que quieras." },
      { et: "Escritura · transacción", texto: "ficha.transfer(dest, monto)\n\nEl signer arma una transacción, la billetera pide confirmación, cuesta gas, tarda en minarse y puede fallar. Devuelve un objeto tx del que hay que esperar el recibo." },
      { y: 1.9, h: 2.65, size: 12.5 });
    D.definicion(s, "const tx = await ficha.transfer(...);   const recibo = await tx.wait();   // dos esperas distintas", { x: M, y: 4.75, w: CW, h: 0.65, size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El malentendido de raíz", x: M, y: 5.55, w: CW, h: 1.15, texto: "await ficha.transfer(...) NO significa «ya se transfirió». Significa «la transacción se envió». La transferencia ocurre cuando tx.wait() devuelve. Confundir esas dos cosas es EL error de esta sesión.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.4 · el ABI", titulo: "Lo único que la interfaz necesita del contrato", ic: "documento", tituloSize: 26 });
    D.codigo(s, `const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];`, { x: M, y: 1.9, w: CW, h: 2.0, lang: "js", size: 12 });
    D.lista(s, [
      "El ABI describe las funciones y eventos: qué reciben y qué devuelven.",
      "No hace falta el ABI completo: solo lo que la interfaz usa. Aquí, tres líneas.",
      "Al compilar con Hardhat, el ABI completo queda en artifacts/: se puede importar entero.",
      "El ABI no es secreto: es público, como el contrato.",
    ], { y: 4.1, h: 2.0, size: 13.5, gap: 7 });
    D.parrafo(s, "Sin el ABI, la interfaz no sabe cómo empaquetar la llamada (era el selector de 4 bytes de la Sesión 5). Con él, ethers arma el campo data por ti.", { y: 6.2, h: 0.55, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.5 · el stack moderno", titulo: "ethers a mano, o wagmi + RainbowKit", ic: "capas", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "ethers a mano (lo de hoy)", texto: "Se ve cada pieza: provider, signer, contract. Ideal para ENTENDER qué pasa. Es lo que usa la dApp de referencia del laboratorio, en un solo archivo sin compilar." },
      { et: "wagmi + RainbowKit", texto: "Ganchos de React (useAccount, useReadContract, useWriteContract) y un botón de conexión que soporta muchas billeteras. Menos código, más robusto. Es lo que se usa en producción." },
      { y: 1.9, h: 2.5, size: 13 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Recomendación para el proyecto", x: M, y: 4.6, w: CW, h: 2.1, texto: "Entiendan hoy con ethers a mano: es la única forma de saber qué hace la magia. Para el proyecto pueden usar wagmi + RainbowKit y ahorrarse la parte tediosa. Lo que se evalúa es que la interfaz maneje bien los estados de transacción, no cuántas líneas escribieron. Ambos caminos valen.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.6 · escuchar la cadena", titulo: "Que la interfaz se actualice sola", ic: "red", tituloSize: 28 });
    D.codigo(s, `contrato.on("Transfer", (from, to, value) => {
  if (from === cuenta || to === cuenta) {
    refrescarSaldo();          // el saldo cambió: vuelve a leerlo
  }
});`, { x: M, y: 1.9, w: CW, h: 1.75, lang: "js", size: 12.5 });
    D.parrafo(s, "Los eventos de la Sesión 6 no eran decoración: son cómo la interfaz se entera de que algo cambió sin preguntar en bucle. La aplicación se suscribe al evento Transfer y refresca solo lo que hace falta.", { y: 3.85, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "Sin eventos", texto: "La interfaz pregunta el saldo cada pocos segundos, gaste o no. Ineficiente y siempre un poco desactualizada." },
      { et: "Con eventos", texto: "La interfaz no pregunta nada hasta que el contrato AVISA. Reacciona al instante y solo cuando importa." },
      { y: 4.95, h: 1.75, size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.7 · la UX de Web3", titulo: "Los cuatro estados que todos olvidan", ic: "alerta", tituloSize: 27 });
    D.tabla(s, ["estado", "qué ve el usuario si NO se maneja", "qué debe mostrar la interfaz"], [
      ["Red equivocada", "La transacción falla con un error críptico, o se manda a otra red.", "«Estás en la red equivocada, cambia a Sepolia» y bloquear el botón."],
      ["Sin billetera", "La página se rompe: window.ethereum no existe.", "«Instala MetaMask» y desactivar la conexión."],
      ["Usuario rechaza", "La app se queda «cargando» para siempre.", "«Rechazaste la transacción». Volver al estado normal."],
      ["Transacción revierte", "La app dice «éxito» cuando en realidad falló.", "Leer recibo.status; si es 0, «la transacción se revirtió»."],
    ], { y: 1.9, h: 3.5, colW: [2.5, 5.0, 4.593], size: 11 });
    D.enunciado(s, "Una dApp que solo maneja el camino feliz miente la mitad del tiempo. La calidad está en los otros cuatro caminos.", { y: 5.6, h: 1.1, size: 16, line: C.naranja });
  }

  {
    const s = await D.lamina({ kicker: "A.8 · el camino de una transacción en pantalla", titulo: "De «Enviar» a «confirmada»", ic: "flecha", tituloSize: 26 });
    D.pasos(s, [
      ["EL USUARIO PULSA ENVIAR", "Validar la dirección y el monto ANTES de tocar la billetera. Si están mal, avisar y no seguir."],
      ["LA BILLETERA PIDE FIRMA", "Mostrar «confirma en la billetera». Aquí el usuario puede rechazar (estado 3)."],
      ["TRANSACCIÓN ENVIADA", "Ya hay un hash. Mostrar «esperando confirmación» y el hash. NO decir «listo» todavía."],
      ["ESPERAR EL RECIBO", "tx.wait(). Revisar status: 0 es reversión (estado 4)."],
      ["CONFIRMADA", "Ahora sí: «listo», refrescar el saldo, y quizás enlazar al explorador."],
    ], { y: 1.9, alto: 0.82, gap: 0.12, anchoEt: 3.2, size: 12.5 });
    D.parrafo(s, "Cada paso tiene su mensaje. El usuario nunca debe quedarse mirando una pantalla que no dice qué está pasando.", { y: 6.25, h: 0.42, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.9 · lo que hay que llevarse del bloque A", titulo: "Seis ideas sobre dApps", ic: "lista", tituloSize: 28 });
    const ideas = [
      "En una dApp, lo descentralizado es el contrato; el frontend y el RPC muchas veces no.",
      "Provider lee gratis; Signer escribe y cuesta gas.",
      "await transfer() significa «enviada», no «transferida»: eso lo dice tx.wait().",
      "El ABI es lo único que la interfaz necesita para hablarle al contrato.",
      "Los eventos hacen que la interfaz se actualice sola, sin preguntar en bucle.",
      "La calidad de una dApp está en los cuatro estados de error, no en el camino feliz.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Laboratorio 12", sub: "Una interfaz que conecta la billetera, muestra el saldo del token de la Sesión 10 y transfiere, manejando los cuatro errores.", minutos: "APROXIMADAMENTE 85 MINUTOS · EN PAREJAS", ic: "pantalla" });

  {
    const s = await D.lamina({ kicker: "B.1 · el punto de partida", titulo: "Una dApp de referencia en un solo archivo", ic: "codigo", tituloSize: 26 });
    D.parrafo(s, "En material/dapp-ficha/index.html hay una dApp completa que funciona abriéndola en el navegador, sin compilar nada. Es el andamiaje: hoy se estudia parte por parte y se conecta al token propio.", { y: 1.9, h: 0.95, size: 14 });
    D.tabla(s, ["parte de la dApp", "qué muestra en clase"], [
      ["Detección de billetera", "El estado «sin billetera» (error 2), visible sin MetaMask."],
      ["Conexión", "Pedir cuentas, leer la red, detectar la red equivocada (error 1)."],
      ["Lectura", "balanceOf con formatUnits: el saldo, sin gastar gas."],
      ["Escritura", "transfer con parseUnits, tx.wait() y recibo.status (error 4)."],
      ["Manejo de errores", "ACTION_REJECTED (error 3) y los demás, en una función."],
      ["Eventos", "on(\"Transfer\") para refrescar el saldo solo."],
    ], { y: 3.0, h: 3.1, colW: [3.6, 8.493], size: 11.5 });
    D.parrafo(s, "Requisito: poner la dirección de la FichaUSB propia (Sesión 10) en la constante DIRECCION_FICHA.", { y: 6.25, h: 0.42, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · el ejercicio", titulo: "Reconstruir y ampliar", ic: "martillo", tituloSize: 29 });
    D.pasos(s, [
      ["CONECTAR AL TOKEN PROPIO", "Cambiar DIRECCION_FICHA por su contrato. Ver el símbolo y el saldo reales."],
      ["PROBAR LOS CUATRO ERRORES", "Rechazar una firma; cambiar a la red principal; probar sin fondos; ver cada mensaje."],
      ["AGREGAR UNA LECTURA MÁS", "Mostrar también el suministro total (totalSupply). Es otra llamada view."],
      ["AGREGAR UN BOTÓN", "«Refrescar saldo» manual, además del refresco por evento."],
    ], { y: 1.9, alto: 0.78, gap: 0.12, anchoEt: 3.0, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "El reto de verdad", x: M, y: 5.82, w: CW, h: 0.92, texto: "Provocar los cuatro errores a propósito y capturar la pantalla de cada uno. Es la evidencia que demuestra que se entendió la UX.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.3 · qué se entrega", titulo: "Evidencia del laboratorio 12", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["Repositorio del frontend", "La interfaz conectada al token propio, en el repo del proyecto.", "35 %"],
      ["Transferencia real", "Captura de una transferencia confirmada, con su hash en Sepolia.", "25 %"],
      ["Los cuatro errores", "Una captura por cada estado de error, provocado a propósito.", "30 %"],
      ["Reflexión", "¿Qué parte de tu dApp NO está descentralizada, y cómo lo mejorarías? Un párrafo.", "10 %"],
    ], { y: 1.9, h: 3.1, colW: [2.8, 7.693, 1.6], size: 12 });
    D.parrafo(s, "La sesión que viene cierra la Unidad III: IPFS, indexación y firmas sin gas. El Avance 1 se entrega ahí.", { y: 5.2, h: 0.5, size: 13, color: C.ocre });
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "El proyecto", sub: "Conectar la interfaz propia a los contratos propios. El primer momento en que el proyecto se ve como un producto.", minutos: "APROXIMADAMENTE 30 MINUTOS", ic: "bandera" });

  {
    const s = await D.lamina({ kicker: "C.1 · hacia el Avance 1", titulo: "Lo que debe funcionar en la Sesión 13", ic: "flecha", tituloSize: 27 });
    D.tabla(s, ["pieza", "estado esperado"], [
      ["Contratos", "Desplegados y verificados en Sepolia, con cobertura ≥ 80 %."],
      ["Interfaz", "Conecta la billetera, lee al menos un dato y ejecuta al menos una transacción."],
      ["Estados de error", "Los cuatro manejados, con mensajes claros."],
      ["Repositorio", "Contratos, pruebas y frontend, documentado en el README."],
    ], { y: 1.9, h: 2.4, colW: [2.6, 9.493], size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta de integración", x: M, y: 4.55, w: CW, h: 2.05, texto: "¿Qué lee la interfaz y qué escribe? Antes de programar, una pareja escribe en una línea: «la interfaz LEE X con una llamada view, y ESCRIBE Y con una transacción». Si no lo pueden decir así de simple, la interfaz aún no está pensada. Es el mismo corte vertical del proyecto del docente: una función de punta a punta antes que muchas a medias.", size: 13 });
  }

  await D.preguntaSemana({
    pregunta: "Abran una dApp conocida y desconéctense de internet a mitad de uso. ¿Qué deja de funcionar? Eso les dice qué parte NO estaba de verdad descentralizada.",
    trabajo: [
      "Entregar la evidencia del laboratorio 12.",
      "Integrar el frontend del proyecto con sus contratos: es parte del Avance 1.",
      "Preparar el Avance 1 completo para la Sesión 13: contratos + pruebas + frontend + repo.",
      "Leer sobre The Graph y ENS para la Sesión 13.",
    ],
  });

  await D.cierre({
    frase: "await transfer() no dice «hecho», dice «enviado». Esa diferencia es toda la experiencia de usuario de Web3.",
    sub: "Ya hay una interfaz que lee y escribe en la cadena. La próxima sesión la cierra: indexación, nombres legibles y login sin contraseña. Y se entrega el Avance 1.",
    proxima: "Sesión 13 · Integración full-stack e infraestructura · Avance 1",
  });

  return D.guardar(path.join(__dirname, "Sesion-12-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
