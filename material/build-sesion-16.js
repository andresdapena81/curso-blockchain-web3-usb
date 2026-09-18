/* =====================================================================
   Sesión 16 · Escalabilidad, interoperabilidad y marco regulatorio
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

const VERIFICADO = "17 de septiembre de 2026";

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 16 · ESCALABILIDAD Y REGULACIÓN", titulo: "Sesión 16 · Capa 2, puentes y marco regulatorio" });
  const { C, F, M, CW } = D;

  function ideasNumeradas(s, ideas, paso = 0.8, size = 14.5) {
    ideas.forEach((t, i) => {
      const y = 1.9 + i * paso;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size, valign: "middle" });
      D.linea(s, M, y + paso - 0.06, M + CW, y + paso - 0.06, C.grisClaro, 1);
    });
  }

  /* ---------------------------------------------------------- apertura */
  await D.portada({
    kicker: "SESIÓN 16 · UNIDAD IV · ECOSISTEMA",
    titulo: "CÓMO ESCALA,\nQUÉ SE ROBA\nY QUÉ DICE LA LEY",
    sub: "La capa base no alcanza, los puentes concentran el riesgo y una solución impecable puede ser ilegal. Hoy, las tres cosas.",
    palabra: "ESCALAR",
    ic: "puente",
    notas: `Penúltima sesión. La parte regulatoria (bloque B) se verificó en fuentes oficiales el ${VERIFICADO}; antes de dictar, revisar la lámina B.10 («Estado verificado») y actualizar lo que haya cambiado. Se recibe el Avance 2. Enganche: «¿cuánto les costó desplegar en Sepolia en la Sesión 13? Hoy lo van a comparar con una capa 2».`,
  });

  await D.agenda({
    intro: "Tres temas que todo proyecto real enfrenta tarde o temprano: no escala, cruzar cadenas es peligroso y no está claro qué obliga la ley. Y el laboratorio mide costos de verdad.",
    bloques: [
      ["A", "ESCALABILIDAD Y PUENTES", "Trilema, rollups, sidechains, blobs y los mayores robos a puentes.", "~50 min"],
      ["B", "MARCO REGULATORIO", "SFC, UIAF, DIAN, arenera, Congreso, MiCA y Travel Rule. Verificado a hoy.", "~45 min"],
      ["C", "LABORATORIO 16 + TALLER", "El mismo contrato en Sepolia y OP Sepolia; taller regulatorio del proyecto.", "~55 min"],
      ["D", "AVANCE 2", "Entrega y demostración corta de la dApp integrada.", "~20 min"],
    ],
    notas: "Suma: 10 de apertura + 50 + 45 + 55 + 20 = 180. Pausa de 10 minutos entre B y C, descontada del laboratorio: el despliegue en dos redes se puede terminar en casa con la guía PDF. El Avance 2 se revisa al final para no cortar el laboratorio.",
  });

  await D.objetivo({
    objetivo: "Evaluar soluciones de escalado con datos propios y situar un proyecto blockchain en el marco legal colombiano vigente.",
    preguntas: [
      "¿Por qué la capa base no puede escalar sola, y qué hace una capa 2?",
      "¿Qué diferencia un rollup optimista de uno de conocimiento cero, en seguridad y en tiempo de retiro?",
      "¿Por qué los puentes concentran los mayores robos del ecosistema?",
      "¿Qué obligaciones legales tendría su proyecto si saliera a producción en Colombia?",
    ],
    ra: "RA2 · arquitecturas y escalado  ·  RA7 · marco regulatorio colombiano, ética y sostenibilidad.",
    notas: "Al cierre, cada pregunta debe tener respuesta en una frase. La cuarta es la del taller y la del ensayo. 2 minutos.",
  });

  await D.glosario({
    items: [
      ["L2 · capa 2", "Layer 2", "Red que ejecuta transacciones fuera de la capa base y publica en ella datos y compromisos, heredando su seguridad."],
      ["Rollup", "acumulador", "L2 que agrupa muchas transacciones y publica en la L1 los datos comprimidos y la raíz del nuevo estado."],
      ["Fraud proof", "prueba de fraude", "En un rollup optimista: demostración de que un lote publicado era incorrecto, durante la ventana de desafío."],
      ["Validity proof", "prueba de validez", "En un ZK-rollup: prueba criptográfica de que el lote es correcto, verificada por un contrato en la L1."],
      ["Blob", "EIP-4844", "Espacio de datos barato y temporal (~18 días) que la L1 ofrece a los rollups desde marzo de 2024."],
      ["Puente", "bridge", "Mecanismo que bloquea un activo en una cadena y emite su representación en otra."],
      ["PSAV", "proveedor de servicios de activos virtuales", "Plataforma de intercambio, custodia o transferencia. Reporta a la UIAF en Colombia."],
      ["MiCA · CARF", "UE · OCDE", "Reglamento europeo de criptoactivos; marco de la OCDE para intercambiar información tributaria de criptoactivos."],
    ],
    notas: "Señalar Blob y PSAV: el primero explica la caída de costos de las L2; el segundo es la palabra clave de la regulación colombiana. 2 minutos.",
  });

  /* ================================================================ A */
  (await D.divisor({ letra: "A", titulo: "Escalabilidad y puentes", sub: "Ethereum procesa pocas transacciones por segundo, a veces caras. Escalar sin perder su seguridad es el gran problema técnico abierto; cruzar cadenas, el gran riesgo.", minutos: "APROXIMADAMENTE 50 MINUTOS", ic: "puente" })).addNotes("Bloque A: 50 minutos, unas 3 por lámina. Las de números (A.1, A.9) piden más.");

  {
    const s = await D.lamina({ kicker: "A.1 · de vuelta al trilema (Sesión 4)", titulo: "La cuenta que muestra el techo", ic: "diana", tituloSize: 28 });
    D.parrafo(s, "Descentralización, seguridad y escala: elija dos. Ethereum eligió las dos primeras. Pongámosle números con un bloque real de hoy:", { y: 1.9, h: 0.65, size: 14.5 });
    D.definicion(s, "60 000 000 de gas por bloque ÷ 21 000 gas por transferencia simple ÷ 12 s por bloque ≈ 238 transferencias por segundo, como MÁXIMO teórico", { x: M, y: 2.7, w: CW, h: 0.75, size: 12 });
    D.cifra(s, "≈ 238", "tx/s en el mejor caso: solo transferencias simples, bloques llenos.", { x: M, y: 3.7, w: 3.85, h: 1.7, tsize: 11.5 });
    D.cifra(s, "169", "transacciones tenía el bloque 26 000 939 (17-sep-2026): muchas son más caras que 21 000.", { x: M + 4.12, y: 3.7, w: 3.85, h: 1.7, color: C.violeta, tsize: 11 });
    D.cifra(s, "miles", "de pagos por segundo procesa un sistema de tarjetas en temporada alta.", { x: M + 8.24, y: 3.7, w: CW - 8.24, h: 1.7, color: C.tinta, size: 28, tsize: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error de concepto típico", x: M, y: 5.52, w: CW, h: 1.22, texto: "«Subamos el límite de gas y listo». Bloques más grandes exigen nodos más potentes, y menos gente puede verificar: la escala se paga en descentralización. Por eso la escala se busca ENCIMA.", size: 12.5 });
    s.addNotes("Datos consultados en vivo el 17-09-2026 con eth_getBlockByNumber a un RPC público de mainnet: bloque 26 000 939, gasLimit 60 000 000, 169 transacciones, 4 blobs. El límite de gas cambia con el tiempo (los validadores lo votan): repetir la consulta antes de dictar. La cifra de «miles» de tarjetas es deliberadamente vaga: no citar un número sin fuente. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · la idea de capa 2", titulo: "Ejecutar afuera, asegurar adentro", ic: "capas", tituloSize: 28 });
    D.nodo(s, { x: M, y: 2.0, w: 5.7, h: 1.4, titulo: "CAPA 2 · EJECUCIÓN", sub: "un secuenciador ordena y ejecuta\nmiles de transacciones baratas", fill: C.blanco, line: C.naranja, subSize: 11.5 });
    D.flecha(s, M + 2.85, 3.45, M + 2.85, 4.05, C.tinta, 2);
    D.etiqueta(s, "datos comprimidos + raíz de estado", { x: M + 3.0, y: 3.58, w: 4.2, color: C.gris, size: 9 });
    D.nodo(s, { x: M, y: 4.1, w: 5.7, h: 1.4, titulo: "CAPA 1 · ETHEREUM", sub: "guarda los datos, verifica pruebas\ny custodia los fondos del puente", fill: C.superf, line: C.violeta, subSize: 11.5 });
    D.lista(s, [
      "Los usuarios transaccionan en la L2: rápido y barato.",
      "La L2 publica en la L1 los DATOS de las transacciones: cualquiera puede reconstruir el estado.",
      "Un contrato en la L1 decide qué estado es válido (por desafío o por prueba).",
      "Si el operador de la L2 desaparece, los usuarios pueden salir a la L1 con sus fondos.",
    ], { x: M + 6.1, y: 2.0, w: CW - 6.1, h: 3.5, size: 12.5, gap: 8 });
    D.parrafo(s, "La clave: la L2 no le pide a nadie que confíe en su operador. La disponibilidad de los datos en la L1 es lo que permite verificar y salir.", { y: 5.8, h: 0.8, size: 13, color: C.ocre });
    s.addNotes("La última viñeta es la prueba de fuego para distinguir una L2 de verdad de una cadena aparte: ¿pueden los usuarios retirar sus fondos a la L1 sin permiso del operador? L2BEAT clasifica los rollups por esto (etapas 0, 1 y 2). 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · rollup optimista", titulo: "Confiar, pero dejar impugnar", ic: "reloj", tituloSize: 28 });
    D.parrafo(s, "El rollup optimista publica el nuevo estado SIN probar que es correcto. Supone que lo es, y abre una ventana de desafío: cualquiera que vea un error presenta una prueba de fraude, el contrato de la L1 reejecuta el paso en disputa y castiga al que mintió.", { y: 1.9, h: 1.0, size: 14 });
    D.pasos(s, [
      ["DÍA 0", "Ana pide retirar 1 ETH de OP Mainnet a Ethereum. El retiro queda registrado en la L2."],
      ["DÍAS 0 A 7", "Ventana de desafío: si el estado publicado fuera falso, alguien lo impugna."],
      ["DÍA 7", "Sin impugnación exitosa, el estado es final: Ana reclama su 1 ETH en la L1."],
    ], { y: 3.05, alto: 0.66, gap: 0.1, anchoEt: 2.2, size: 12.5 });
    D.tabla(s, ["red", "ventana de retiro a la L1"], [
      ["OP Mainnet", "7 días (docs.optimism.io)"],
      ["Arbitrum One", "≈ 6,4 días (docs.arbitrum.io): «una semana» redondeada"],
      ["OP Sepolia (el laboratorio)", "7 días también: la testnet replica los tiempos de mainnet"],
    ], { y: 5.4, h: 1.35, colW: [3.6, 8.493], size: 11.5 });
    s.addNotes(`Verificado el ${VERIFICADO}: docs.optimism.io/app-developers/bridging/messaging dice 7 días en mainnet; docs.arbitrum.io (l2-to-l1-messaging) dice 6,4 días; en OP Sepolia se leyó en cadena proofMaturityDelaySeconds = 604 800 s (7 días), y el tutorial de puentes de Optimism confirma que la testnet replica mainnet (una página vieja de Optimism dice que es más corto: está desactualizada). Error típico: «optimista = inseguro». Basta UN verificador honesto que vigile. Consecuencia para el laboratorio: DEPOSITAR en OP Sepolia tarda minutos; RETIRAR, 7 días. 4 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "A.4 · rollup de conocimiento cero", titulo: "Probar en vez de esperar", ic: "candado", tituloSize: 28 });
    D.parrafo(s, "El ZK-rollup publica cada lote con una prueba de validez: un certificado matemático, corto y rápido de verificar, de que el nuevo estado resulta de aplicar correctamente esas transacciones. El contrato de la L1 verifica la prueba; si no cuadra, rechaza el lote.", { y: 1.9, h: 1.0, size: 14 });
    D.dosColumnas(s,
      { et: "La intuición, sin matemática", texto: "Resolver un sudoku difícil toma mucho; comprobar uno ya resuelto toma segundos. Generar la prueba de un lote es caro (lo hace el operador, con hardware potente); verificarla es barato (lo hace un contrato)." },
      { et: "El error de concepto típico", linea: C.rojo, color: C.rojo, texto: "«ZK = privado». En un ZK-rollup la prueba sirve para ESCALAR: los datos de las transacciones se publican igual. «Conocimiento cero» describe la propiedad de la prueba, no la privacidad del usuario." },
      { y: 3.05, h: 2.25, size: 12.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La consecuencia práctica", x: M, y: 5.5, w: CW, h: 1.2, texto: "Como la validez se prueba, no hay ventana de desafío: el retiro a la L1 puede hacerse en cuanto se verifica la prueba del lote (horas, no días). El costo se traslada a generar pruebas.", size: 12.5 });
    s.addNotes("El sudoku es la analogía de P frente a NP que usa casi toda la literatura divulgativa. Vuelve el tema de la S15 (divulgación selectiva): la misma familia de técnicas, usada para otra cosa. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · la comparación", titulo: "Optimista frente a ZK", ic: "balanza", tituloSize: 29 });
    D.tabla(s, ["", "rollup optimista", "ZK-rollup"], [
      ["Supuesto de seguridad", "Al menos un verificador honesto vigila y desafía a tiempo.", "La criptografía de la prueba es sólida y el verificador está bien programado."],
      ["Qué se publica en la L1", "Datos de las transacciones + raíz de estado.", "Datos de las transacciones + raíz de estado + prueba de validez."],
      ["Retiro a la L1", "Lento: 7 días de ventana.", "Rápido: al verificarse la prueba."],
      ["Costo principal", "Publicar datos.", "Publicar datos + generar pruebas."],
      ["Compatibilidad EVM", "Muy alta: ejecutan el mismo bytecode.", "Alta y creciente; históricamente más difícil."],
      ["Ejemplos", "OP Mainnet, Base, Arbitrum One.", "zkSync Era, Starknet, Linea, Scroll."],
    ], { y: 1.85, h: 4.4, colW: [2.6, 4.75, 4.743], size: 11 });
    D.parrafo(s, "Ninguna gana en todo. Y los dos dependen de lo mismo: que los datos estén disponibles en la L1.", { y: 6.35, h: 0.45, size: 12.5, color: C.ocre });
    s.addNotes("Los ejemplos son redes conocidas en funcionamiento a la fecha; no implica recomendación. Starknet no ejecuta bytecode EVM (usa Cairo): buena pregunta para detectar quién leyó con cuidado. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · lo que NO es un rollup", titulo: "Sidechains y canales de estado", ic: "bifurca", tituloSize: 27 });
    D.tabla(s, ["", "sidechain", "canal de estado"], [
      ["Qué es", "Otra cadena, con sus propios validadores, conectada por un puente.", "Un acuerdo entre dos partes que se firman estados fuera de la cadena."],
      ["De dónde viene la seguridad", "De SUS validadores, no de Ethereum.", "De Ethereum: cualquiera puede llevar el último estado firmado a la L1."],
      ["Bueno para", "Aplicaciones que aceptan otra confianza a cambio de costo bajo.", "Muchas interacciones repetidas entre las mismas partes (pagos, juegos)."],
      ["El límite", "Si sus validadores se coluden, el puente se vacía.", "Solo sirve entre participantes fijos y conectados."],
    ], { y: 1.85, h: 3.2, colW: [2.5, 4.8, 4.793], size: 11.5 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Un canal, con números", x: M, y: 5.25, w: CW, h: 1.45, texto: "Ana y la cafetería abren un canal con 20 000 COP en tokens: 1 transacción. Ana paga 100 tintos firmando estados «Ana 19 800 / café 200», «19 600 / 400»… sin tocar la cadena. Al cerrar, se publica solo el último: 1 transacción. 100 pagos, 2 transacciones.", size: 12.5 });
    s.addNotes("Error típico: llamar «L2» a una sidechain. La prueba de A.2: ¿los fondos están asegurados por la L1 o por los validadores de la otra cadena? Si alguien intenta cerrar el canal con un estado viejo, la contraparte presenta el más reciente (firmado por ambos) durante un plazo de disputa. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · otras capas base", titulo: "«Compatible con la EVM»: qué significa y qué no", ic: "rejilla", tituloSize: 24 });
    D.parrafo(s, "Existen otras L1 con otros puntos del trilema: algunas priorizan velocidad con pocos validadores potentes, otras usan arquitecturas o lenguajes distintos. La pregunta al mirarlas siempre es la misma: ¿qué sacrificaron?", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "Qué SÍ significa", items: ["Corre el mismo bytecode de la EVM.", "El mismo SelloTiempo.sol se despliega sin cambiar una línea.", "Las mismas herramientas: Hardhat, ethers, MetaMask.", "Solo cambian la URL del nodo y el chainId."] },
      { et: "Qué NO significa", linea: C.rojo, color: C.rojo, items: ["Misma seguridad: depende de quién valida.", "Mismos costos: cada red tiene su mercado de gas.", "Misma dirección = mismo contrato: son redes distintas.", "Mismos tokens: un USDC en otra red es otro contrato."] },
      { y: 3.05, h: 2.55, size: 12.5 });
    D.parrafo(s, "Es lo que el laboratorio de hoy demuestra: el mismo contrato, dos redes, dos costos.", { y: 5.85, h: 0.5, size: 13, color: C.ocre });
    s.addNotes("La tercera viñeta de la derecha causa pérdidas reales: enviar tokens a «la misma dirección» en otra red cuando esa dirección es un contrato que no existe allí. Pregunta: ¿qué define el chainId y por qué la firma de una transacción lo incluye (EIP-155)? 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · Dencun y EIP-4844", titulo: "Los blobs: datos baratos que caducan", ic: "gas", tituloSize: 28 });
    D.parrafo(s, "El mayor costo de un rollup era publicar sus datos como calldata, que se guarda para siempre. EIP-4844 creó un espacio aparte, los blobs: más barato, con su propio mercado de gas, y que los nodos borran a las ~2,5 semanas. Suficiente para que cualquiera verifique o desafíe; inútil para almacenamiento permanente.", { y: 1.9, h: 1.2, size: 13.5 });
    D.tabla(s, ["hito", "fecha (mainnet)", "blobs por bloque: objetivo / máximo"], [
      ["Dencun (EIP-4844)", "13-mar-2024", "3 / 6 · cada blob = 128 KiB · retención ≈ 18 días"],
      ["Pectra (EIP-7691)", "07-may-2025", "6 / 9"],
      ["Fusaka (PeerDAS) + BPO1", "03-dic-2025 · 09-dic-2025", "10 / 15"],
      ["BPO2", "07-ene-2026", "14 / 21"],
    ], { y: 3.25, h: 2.1, colW: [3.3, 3.2, 5.593], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "El efecto medido en las tarifas de las L2", x: M, y: 5.55, w: CW, h: 1.15, texto: "Tras Dencun, la tarifa mediana cayó ≈ 95-96 % en Base, OP Mainnet y Arbitrum, 98 % en Starknet y ≈ 65 % en zkSync (DL News con datos de growthepie). No todas por igual.", size: 12.5 });
    s.addNotes(`Verificado el ${VERIFICADO}: blog.ethereum.org (anuncios de Dencun 27-02-2024, Pectra 23-04-2025 y Fusaka 06-11-2025); eips.ethereum.org/EIPS/eip-4844 (4096 × 32 bytes = 128 KiB, MIN_EPOCHS_FOR_BLOB_SIDECARS_REQUESTS = 4096 épocas ≈ 18 días) y EIP-7691. Cifras de caída de tarifas: dlnews.com, «Ethereum's Dencun upgrade cuts layer 2 fees as much as 98%» (fuente secundaria con datos de growthepie). El bloque de mainnet consultado hoy usaba 4 blobs. Error típico: «los blobs sirven para guardar archivos». Caducan. 4 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "A.9 · cómo se ve en un recibo real", titulo: "Dos costos en cada transacción de OP", ic: "documento", tituloSize: 26 });
    D.parrafo(s, "En un rollup OP, el recibo trae un campo extra, l1Fee: lo que la transacción aporta para publicar sus datos en Ethereum. Recibo real de OP Sepolia, leído hoy del nodo público:", { y: 1.85, h: 0.65, size: 13.5 });
    D.codigo(s, `gasUsed              123824          # ejecución en la L2
effectiveGasPrice    1700250 wei     # 0,00170025 gwei
l1GasUsed            4257            # tamaño de sus datos, en gas L1
l1Fee                44559595925 wei # costo de publicar esos datos
l1BaseFeeScalar      7600   l1BlobBaseFeeScalar  862000`, { x: M, y: 2.6, w: CW, h: 1.95, lang: "py", titulo: "eth_getTransactionReceipt · OP Sepolia · bloque 48 944 873", size: 11 });
    D.definicion(s, "costo total = gasUsed × effectiveGasPrice + l1Fee = 210 532 956 000 + 44 559 595 925 wei ≈ 0,000000255 ETH  (el 17 % es la parte L1)", { x: M, y: 4.7, w: CW, h: 0.65, size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error de medición típico", x: M, y: 5.55, w: CW, h: 1.15, texto: "Calcular el costo como gasUsed × gasPrice y olvidar l1Fee. En la L2 eso subestima el costo real. El script del laboratorio lee el recibo crudo del nodo para incluirlo.", size: 12.5 });
    s.addNotes(`Recibo leído el ${VERIFICADO} con eth_getTransactionReceipt en https://sepolia.optimism.io (una transacción del bloque 48 944 873). Cuenta: 123 824 × 1 700 250 = 210 532 956 000 wei; más 44 559 595 925 = 255 092 551 925 wei ≈ 2,55 × 10⁻⁷ ETH; 44,56 / 255,09 ≈ 17 %. La fórmula del l1Fee (Ecotone/Fjord) está en docs.optimism.io/stack/transactions/fees; no hace falta explicarla. También existe el predeploy GasPriceOracle (0x42…0F) con getL1Fee(bytes). 4 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "A.10 · puentes", titulo: "Tres formas de cruzar, tres confianzas", ic: "puente", tituloSize: 27 });
    D.parrafo(s, "Un puente bloquea el activo en la cadena de origen y emite una representación en la de destino. La pregunta es siempre la misma: ¿quién certifica que el bloqueo ocurrió?", { y: 1.9, h: 0.65, size: 14 });
    D.tabla(s, ["modelo", "quién certifica", "falla si…"], [
      ["Custodio o multisig externo", "Un grupo de firmantes (m de n) o un proveedor.", "Roban o coluden m claves. Es la Sesión 15, con cientos de millones detrás."],
      ["Red de validadores o guardianes", "Un conjunto propio de nodos que firman mensajes.", "Se comprometen los validadores o el código que verifica sus firmas."],
      ["Puente nativo de un rollup", "La propia L1, con pruebas de fraude o de validez.", "Falla el sistema de pruebas del rollup (y hereda sus tiempos: 7 días al salir de un optimista)."],
    ], { y: 2.75, h: 2.7, colW: [3.2, 4.2, 4.693], size: 11.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Por qué atraen a los atacantes", x: M, y: 5.52, w: CW, h: 1.2, texto: "Un puente custodia en un solo contrato todo lo bloqueado de un lado. Es un pozo de valor enorme con lógica compleja: la combinación perfecta.", size: 12.5 });
    s.addNotes("El puente del laboratorio (L1StandardBridge de OP) es del tercer tipo. Pregunta: ¿cuál de los tres modelos usa el puente que ustedes elegirían para su proyecto, y a quién le están confiando? 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · los mayores robos", titulo: "Cinco puentes, más de USD 1 300 millones", ic: "bicho", tituloSize: 25 });
    D.tabla(s, ["puente", "fecha", "monto", "qué falló"], [
      ["Ronin", "23-mar-2022", "≈ USD 624 M (173 600 ETH + 25,5 M USDC)", "El atacante controló 5 de 9 claves de validadores."],
      ["Wormhole", "02-feb-2022", "120 000 wETH ≈ USD 320-326 M", "Se burló la verificación de firmas de los guardianes en Solana."],
      ["Nomad", "01-ago-2022", "≈ USD 190 M", "Una actualización dejó la raíz 0x00 como válida: cualquier mensaje pasaba."],
      ["Multichain", "06-jul-2023", "≈ USD 126 M", "Claves MPC comprometidas."],
      ["Harmony Horizon", "23-jun-2022", "≈ USD 100 M", "Multisig 2 de 5 con dos claves comprometidas."],
    ], { y: 1.85, h: 3.75, colW: [2.1, 1.7, 3.6, 4.693], size: 11 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Lean la última columna", x: M, y: 5.8, w: CW, h: 0.95, texto: "Tres de cinco son un m de n mal elegido o mal custodiado. La lección de la Sesión 15 vale cientos de millones.", size: 12.5 });
    s.addNotes(`Cifras consultadas el ${VERIFICADO}. Fuentes: rekt.news (ronin-rekt, wormhole-rekt, nomad-rekt y la tabla leaderboard); chainalysis.com/blog/multichain-exploit-july-2023; Elliptic (análisis de Harmony, 99,7 M). Son fuentes secundarias concordantes: los post-mortems oficiales de Ronin, Wormhole y Nomad no abrieron al verificar (404/403). Montos en USD al precio del día del robo. Suma: 624 + 320 + 190 + 126 + 100 ≈ 1 360 M. Ronin se descubrió seis días después (29-mar-2022). ⚠ VERIFICAR ANTES DE DICTAR si se quiere citar el post-mortem oficial de cada proyecto. 4 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "A.12 · Ronin, de cerca", titulo: "Cuando 5 de 9 son 2 organizaciones", ic: "llave", tituloSize: 27 });
    D.pasos(s, [
      ["EL DISEÑO", "El puente exigía 5 firmas de 9 validadores. En el papel, un 5 de 9 resiste que roben 4 claves (m − 1, Sesión 15)."],
      ["LA REALIDAD", "Cuatro de las nueve claves las operaba la misma empresa, Sky Mavis. Y una quinta firmaba por ella por un permiso temporal que nunca se revocó."],
      ["EL ATAQUE", "Con un ataque de ingeniería social contra empleados, el atacante obtuvo las 4 claves de la empresa y usó el permiso olvidado para la quinta."],
      ["EL RESULTADO", "Dos retiros firmados «válidamente» vaciaron el puente. Nadie lo notó durante seis días."],
    ], { y: 1.85, alto: 0.8, gap: 0.1, anchoEt: 2.3, size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "La lección", x: M, y: 5.5, w: CW, h: 1.2, texto: "La seguridad de un m de n depende de cuántas ORGANIZACIONES independientes hay detrás de las claves, no de cuántas claves hay.", size: 12.5 });
    s.addNotes("Fuente: rekt.news/ronin-rekt (consultada el 17-09-2026): 4 claves de Sky Mavis por spear-phishing y 1 del Axie DAO por una allowlist nunca revocada. Es el ejemplo perfecto de A.3 de la S15: «un 2 de 3 en el mismo portátil es un 1 de 1». 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · lo que hay que llevarse del bloque A", titulo: "Seis ideas sobre escala y puentes", ic: "lista", tituloSize: 27 });
    ideasNumeradas(s, [
      "La L1 tiene un techo de transacciones: subirlo cuesta descentralización. La escala va encima.",
      "Un rollup ejecuta afuera y publica sus datos en la L1: por eso cualquiera puede verificar y salir.",
      "Optimista: confía y deja desafiar 7 días. ZK: prueba la validez y permite salir rápido.",
      "Sidechain y canal NO son rollups: la seguridad de la sidechain es la de sus validadores.",
      "Los blobs (EIP-4844) abarataron los datos de las L2; en el recibo de OP, eso es l1Fee.",
      "Los puentes concentran valor y robos; un m de n vale lo que las organizaciones detrás.",
    ], 0.8, 14);
    s.addNotes("Resumen para repasar. 2 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · verificación del bloque A", titulo: "Pregunta de control", ic: "pregunta", tituloSize: 29 });
    D.enunciado(s, "Un equipo quiere que su dApp de tiquetes corra en una L2 «para que sea barata» y que los usuarios puedan retirar su dinero a Ethereum el mismo día. ¿Optimista o ZK? ¿Y qué número del recibo tienen que mirar para saber cuánto cuesta de verdad?", { y: 1.9, h: 2.1, size: 17.5, line: C.naranja });
    await D.ficha(s, { tipo: "termino", etiqueta: "Respuesta esperada", x: M, y: 4.25, w: CW, h: 2.45, texto: "Retiro el mismo día descarta el puente nativo de un rollup optimista (7 días); un ZK-rollup lo permite en cuanto se verifica la prueba (o, en un optimista, un puente de terceros con liquidez, que agrega otra confianza: A.10). Para el costo: gasUsed × effectiveGasPrice MÁS el l1Fee del recibo; si solo miran la primera parte, subestiman.", size: 12.5 });
    s.addNotes("2 minutos en parejas. Pausa de 10 minutos antes del bloque B si el tiempo va justo.");
  }

  /* ================================================================ B */
  (await D.divisor({ letra: "B", titulo: "Marco regulatorio colombiano", sub: `Una solución técnica impecable puede ser ilegal, cara de cumplir o sin efecto jurídico. Todo lo que sigue se verificó en fuentes oficiales el ${VERIFICADO}.`, minutos: "APROXIMADAMENTE 45 MINUTOS", ic: "balanza" })).addNotes("Bloque B: 45 minutos. Si hay un profesional invitado, este es su espacio. Cada lámina trae en las notas la fuente oficial exacta.");

  {
    const s = await D.lamina({ kicker: "B.0 · advertencia y método", titulo: "Esta parte caduca: el método no", ic: "alerta", tituloSize: 28 });
    D.parrafo(s, "La regulación colombiana de criptoactivos cambia. Lo que sigue es el estado verificado en fuentes oficiales en una fecha concreta, no asesoría jurídica. Lo que no caduca es el método:", { y: 1.9, h: 0.95, size: 14 });
    D.pasos(s, [
      ["IR A LA FUENTE", "La norma o el comunicado del organismo que la emite: SFC, BanRep, UIAF, DIAN, Congreso. No la nota de prensa."],
      ["FECHAR", "Anotar la fecha en que se consultó. Una afirmación regulatoria sin fecha no vale nada."],
      ["SEPARAR", "¿Es una ley, una resolución, un concepto, un proyecto o una opinión? Obligan distinto."],
    ], { y: 3.0, alto: 0.72, gap: 0.1, anchoEt: 2.4, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Antes de dictar esta sesión", x: M, y: 5.5, w: CW, h: 1.22, texto: "Revisar la lámina B.10 y abrir cada fuente otra vez. Se recomienda invitar a un profesional del área jurídica o de cumplimiento. El docente de ingeniería NO es la fuente de verdad legal.", size: 12.5 });
    s.addNotes("Recomendación del plan de estudios: invitar a un abogado o a un oficial de cumplimiento (SARLAFT) de una entidad financiera o de un PSAV. 15-20 minutos de su parte encajan en B.2-B.5. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · naturaleza jurídica", titulo: "No son moneda, no son valores, no están regulados", ic: "documento", tituloSize: 24 });
    D.tabla(s, ["pronunciamiento", "qué dice"], [
      ["SFC · Carta Circular 29 de 2014", "El peso es la única moneda de curso legal (Ley 31 de 1992); el Bitcoin no es divisa. Las plataformas no están reguladas ni vigiladas."],
      ["SFC · Carta Circular 78 de 2016", "Transcribe al Banco de la República: ninguna moneda virtual es moneda ni divisa, ni sirve para operaciones de cambio."],
      ["SFC · Carta Circular 52 de 2017", "No son «valor» (Ley 964 de 2005). Las entidades vigiladas no pueden custodiar, invertir ni intermediar con ellos."],
      ["SFC · página oficial, actualizada el 11-jun-2026", "No son dinero reconocido legalmente, no hay definición legal y ninguna autoridad los supervisa."],
    ], { y: 1.85, h: 3.6, colW: [3.6, 8.493], size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Qué significa para su proyecto", x: M, y: 5.52, w: CW, h: 1.2, texto: "Comprar o tener criptoactivos no es ilegal; pero no hay supervisor que proteja al usuario si algo sale mal. Y un banco colombiano no puede custodiarlos por ustedes.", size: 12.5 });
    s.addNotes(`Fuentes (consultadas el ${VERIFICADO}): superfinanciera.gov.co/publicaciones/10082339 (CC 29/2014), /10085788 (CC 78/2016), /10087902 (CC 52/2017) y /10115324 «¿Qué son los activos digitales o criptoactivos?» (modificada 11/06/2026). La posición del Banco de la República se confirmó tal como la citan la SFC y la DIAN; las páginas de conceptos de banrep.gov.co no abrieron al verificar (bloqueo de bots). ⚠ VERIFICAR ANTES DE DICTAR en banrep.gov.co si se cita al BanRep como fuente directa. 4 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "B.2 · UIAF", titulo: "Los PSAV reportan: Resolución 314 de 2021", ic: "lupa", tituloSize: 26 });
    D.parrafo(s, "La Unidad de Información y Análisis Financiero impuso obligaciones de reporte a las empresas y personas naturales que presten servicios de activos virtuales (PSAV) en Colombia. Resolución 314 del 15 de diciembre de 2021.", { y: 1.9, h: 0.95, size: 13.5 });
    D.tabla(s, ["reporte", "cuándo", "qué"], [
      ["Operaciones sospechosas (ROS)", "Inmediato", "Por el sistema SIREL, en cuanto se detectan."],
      ["Ausencia de ROS", "Mensual", "Declarar que no hubo operaciones sospechosas."],
      ["Transacciones con activos virtuales", "Mensual, primeros 20 días", "Individuales desde USD 150; múltiples desde USD 450 en conjunto."],
      ["Clientes", "Mensual", "Activos, inactivos y desvinculados."],
    ], { y: 3.0, h: 2.5, colW: [3.5, 2.6, 5.993], size: 11.5 });
    D.parrafo(s, "Obligatorio desde el 1-jul-2022 (la Resolución 84 de 2022 corrió la fecha inicial del 1-abr-2022). Sanciona la Superintendencia de Sociedades o el supervisor respectivo.", { y: 5.7, h: 0.9, size: 12.5, color: C.ocre });
    s.addNotes(`Fuentes (consultadas el ${VERIFICADO}): uiaf.gov.co/sites/default/files/2024-10/Resolución_314_de_2021_AV.pdf (arts. 2 a 7, 11 y 12), uiaf.gov.co/sites/default/files/2024-10/Resolucion_84_de_2022.pdf y uiaf.gov.co/sector/activos-virtuales (publica el calendario de reportes 2026). No se encontraron modificaciones posteriores. ⚠ VERIFICAR ANTES DE DICTAR si hubo cambios en 2026. Pregunta: ¿su proyecto sería un PSAV? Casi nunca: un registro de certificados no intercambia activos por cuenta de clientes. 4 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "B.3 · DIAN", titulo: "Impuestos y el nuevo reporte CARF", ic: "moneda", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Tratamiento tributario", items: ["Concepto Unificado 018075 del 17-oct-2023: revoca los anteriores.", "Criptoactivos y NFT = activos intangibles.", "Se declaran en el patrimonio.", "Vender o permutar: renta ordinaria; ganancia ocasional si era activo fijo por más de 2 años."] },
      { et: "Reporte de proveedores (CARF)", items: ["Resolución 000240 del 24-dic-2025.", "Implementa el marco CARF de la OCDE.", "Reportan los proveedores de servicios de criptoactivos.", "Años gravables 2026 y siguientes, en XML, hasta el último día hábil de mayo del año siguiente."] },
      { y: 1.9, h: 3.2, size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "La consecuencia práctica", x: M, y: 5.3, w: CW, h: 1.4, texto: "Desde el año gravable 2026 las plataformas reportan a la DIAN lo que hacen sus usuarios. El «nadie se entera» se acabó para quien usa un intermediario. El primer reporte sería en mayo de 2027.", size: 12.5 });
    s.addNotes(`Fuentes (consultadas el ${VERIFICADO}): normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_18075_2023.htm; dian.gov.co/normatividad/Normatividad/Resolución 000240 de 24-12-2025.pdf (arts. 1.6.11.1 y 1.6.11.4; adiciona el Capítulo 11 a la Resolución 000227 de 2025; Colombia firmó el acuerdo CARF el 31-oct-2024). «Primer reporte en mayo de 2027» es una INFERENCIA de los arts. 1.6.11.1 y 1.6.11.4, no una frase literal: ⚠ VERIFICAR ANTES DE DICTAR. Tampoco se verificó la resolución de exógena «tradicional» (Formato 1012, concepto 1206) vigente para 2026. 4 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "B.4 · la arenera de la SFC", titulo: "Un piloto de tres años, sin incidentes", ic: "taller", tituloSize: 27 });
    D.parrafo(s, "El Decreto 1234 de 2020 creó el «espacio controlado de prueba» para innovación financiera. En su arenera («laArenera»), la SFC corrió un piloto: bancos abrían cuentas de depósito a plataformas de criptoactivos, bajo vigilancia.", { y: 1.9, h: 0.95, size: 13.5 });
    D.pasos(s, [
      ["17-SEP-2020", "Se anuncia el piloto."],
      ["29-ENE-2021", "Se seleccionan 9 de 14 alianzas banco-plataforma; operaron 7."],
      ["22-JUN-2021", "Empieza la primera alianza."],
      ["13-JUN-2024", "Termina el piloto. El 27-jun-2024 la SFC publica su balance."],
    ], { y: 3.0, alto: 0.55, gap: 0.08, anchoEt: 2.2, size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "El resultado, según la SFC", x: M, y: 5.56, w: CW, h: 1.18, texto: "No se observaron incidentes ni riesgos materializados para los consumidores. Es «insumo» para una eventual regulación; los criptoactivos siguen sin regular.", size: 12.5 });
    s.addNotes(`Fuentes (consultadas el ${VERIFICADO}): funcionpublica.gov.co (Decreto 1234 de 2020, norma i=142005); superfinanciera.gov.co/publicaciones/10107301 (pruebas en el sandbox) y /10115218 (balance del cierre del piloto). Matiz: la SFC sitúa el piloto en «laArenera» y distingue entre su arenera y el espacio controlado del Decreto 1234; no presentarlo como «un piloto del Decreto 1234». No se encontró un informe final formal, solo el comunicado de balance. ⚠ VERIFICAR ANTES DE DICTAR. 4 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "B.5 · el Congreso", titulo: "Dos proyectos de ley, los dos archivados", ic: "documento", tituloSize: 26 });
    D.tabla(s, ["proyecto", "trámite", "estado"], [
      ["PL 139 de 2021 Cámara · plataformas de intercambio de criptoactivos", "Aprobado en plenaria de Cámara (29-nov-2022) y en tercer debate en la Comisión Sexta del Senado (30-may-2023).", "Archivado (art. 190, Ley 5 de 1992)"],
      ["PL 510 de 2025 Cámara · proveedores de servicios de activos virtuales", "Radicado el 25-feb-2025; ponencias de primer y segundo debate.", "Archivado (art. 190, Ley 5 de 1992)"],
    ], { y: 1.9, h: 2.6, colW: [4.4, 4.9, 2.793], size: 11.5 });
    D.enunciado(s, "A la fecha de verificación no hay ninguna ley de plataformas o PSAV sancionada en Colombia.", { y: 4.75, h: 1.1, size: 17, line: C.naranja });
    D.parrafo(s, "El artículo 190 de la Ley 5 de 1992 archiva los proyectos que no completan su trámite en dos legislaturas.", { y: 6.05, h: 0.6, size: 12, color: C.ocre });
    s.addNotes(`Fuentes (consultadas el ${VERIFICADO}): camara.gov.co/criptoactivos-2227 y camara.gov.co/servicios-activos-virtuales-497; senado.gov.co, noticia 4578 (tercer debate). No se confirmaron radicaciones nuevas en la legislatura 2026-2027 (desde el 20-jul-2026): la prensa menciona iniciativas, pero no se encontró la fuente oficial. ⚠ VERIFICAR ANTES DE DICTAR en camara.gov.co y senado.gov.co. 3 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "B.6 · la referencia internacional", titulo: "MiCA: el reglamento europeo, por fechas", ic: "mundo", tituloSize: 27 });
    D.parrafo(s, "Reglamento (UE) 2023/1114 sobre mercados de criptoactivos. Es el marco integral que muchos países, Colombia incluida, miran como modelo: licencias para proveedores, reglas para stablecoins y protección al consumidor.", { y: 1.9, h: 0.95, size: 13.5 });
    D.tabla(s, ["fecha", "qué empezó"], [
      ["29-jun-2023", "Entrada en vigor (y algunos artículos habilitantes)."],
      ["30-jun-2024", "Títulos III y IV: stablecoins (tokens referenciados a activos y de dinero electrónico)."],
      ["30-dic-2024", "Aplicación general: proveedores de servicios de criptoactivos (CASP)."],
      ["1-jul-2026", "Fin del periodo transitorio máximo para CASP que ya operaban. Cada país podía acortarlo."],
    ], { y: 3.0, h: 2.45, colW: [2.4, 9.693], size: 11.5 });
    D.parrafo(s, "Hoy, en la UE, prestar servicios de criptoactivos sin licencia MiCA ya no está permitido en ningún Estado miembro.", { y: 5.7, h: 0.8, size: 13, color: C.ocre });
    s.addNotes(`Fuente: eur-lex.europa.eu, CELEX:32023R1114, arts. 143.3 y 149 (texto literal consultado el ${VERIFICADO}). Ojo: un resumen automático de EUR-Lex dio mal las fechas al verificar; se leyó el artículo 149 directamente. La última frase se deduce del fin del transitorio máximo (1-jul-2026); los plazos de cada país están en la lista de ESMA: ⚠ VERIFICAR si se menciona un país concreto. 3 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "B.7 · AML, KYC y la Travel Rule", titulo: "Que los datos viajen con el dinero", ic: "flecha", tituloSize: 27 });
    D.tabla(s, ["regla", "qué exige"], [
      ["GAFI · Recomendación 15", "Aplica a los proveedores de activos virtuales las medidas contra el lavado: conocer al cliente desde transacciones ocasionales de USD/EUR 1 000."],
      ["Travel Rule (R.16 aplicada)", "El proveedor que envía obtiene, guarda y transmite los datos de quien envía y de quien recibe; el que recibe los verifica."],
      ["Revisión de la R.16 · 18-jun-2025", "Datos estandarizados en pagos transfronterizos mayores de USD/EUR 1 000; cumplimiento hacia finales de 2030."],
      ["UE · Reglamento 2023/1113", "Desde el 30-dic-2024, en criptoactivos la información acompaña CADA transferencia, sin umbral."],
    ], { y: 1.85, h: 3.5, colW: [3.6, 8.493], size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La tensión de fondo", x: M, y: 5.55, w: CW, h: 1.15, texto: "Las cadenas públicas se diseñaron seudónimas; la regulación financiera exige identificar a las partes. Cuánto seudonimato preserva un proyecto y cuánto cumplimiento acepta es una decisión de diseño con consecuencias legales.", size: 12.5 });
    s.addNotes(`Fuentes (consultadas el ${VERIFICADO}): fatf-gafi.org, «Updated Guidance for a Risk-Based Approach to Virtual Assets and VASPs» (párrafos 146, 149 y 191) y la publicación de la actualización de la R.16 (junio de 2025); eur-lex.europa.eu CELEX:32023R1113 (art. 40 y considerando 30). No se leyó el texto vigente de la nota interpretativa de la R.15 ni la «Seventh Targeted Update» de julio de 2026: ⚠ VERIFICAR ANTES DE DICTAR. Colombia es miembro de GAFILAT, el regional del GAFI. 4 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "B.8 · la pregunta jurídica de fondo", titulo: "¿Un contrato inteligente es un contrato?", ic: "balanza", tituloSize: 26 });
    D.dosColumnas(s,
      { et: "Lo que es", texto: "Un programa que ejecuta reglas automáticamente. Puede AUTOMATIZAR el cumplimiento de un acuerdo: liberar un pago cuando una propuesta se aprueba y vence el timelock (Sesión 15)." },
      { et: "Lo que no necesariamente es", linea: C.rojo, color: C.rojo, texto: "Un contrato válido y exigible ante un juez. Eso depende de la ley: ¿hubo consentimiento?, ¿las partes eran capaces?, ¿qué jurisdicción aplica si las partes están en tres países?" },
      { y: 1.9, h: 2.45, size: 12.5 });
    D.tabla(s, ["situación", "la pregunta sin respuesta técnica"], [
      ["Un error del código envía fondos a quien no debía", "¿Quién responde: quien lo programó, quien lo desplegó o la DAO que lo aprobó?"],
      ["Un atacante usa una función tal como está escrita (Beanstalk)", "¿Es un robo o «el código es la ley»? Los tribunales no aceptan lo segundo sin más."],
    ], { y: 4.55, h: 1.5, colW: [5.0, 7.093], size: 11.5 });
    D.parrafo(s, "Terreno abierto: ideal para el ensayo individual (eje regulatorio o ético).", { y: 6.2, h: 0.45, size: 12.5, color: C.ocre });
    s.addNotes("No dar una respuesta cerrada: es el punto. Si hay un abogado invitado, esta es la lámina para él. Conectar con el anteproyecto: casi todos escribieron «el contrato garantiza…». 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.9 · ética y sostenibilidad", titulo: "La responsabilidad del que construye", ic: "escudo", tituloSize: 26 });
    D.tabla(s, ["tema", "la conversación honesta"], [
      ["Huella energética", "The Merge (2022) redujo el consumo anualizado de electricidad de Ethereum en más de 99,988 % (CCRI, citado por ethereum.org). La prueba de trabajo de Bitcoin sigue: citar el índice de Cambridge vigente, no una cifra de memoria."],
      ["Inclusión financiera", "La promesa: servicios para quien no tiene banco. La realidad: hace falta internet, un teléfono, saber custodiar una clave y soportar volatilidad. ¿Incluye de verdad, o a quien ya estaba cerca?"],
      ["Estafas", "El ecosistema está lleno de esquemas extractivos (S10, S14). Quien construye tiene la responsabilidad de no sumar uno más y de no prometer rendimientos que no puede explicar."],
    ], { y: 1.85, h: 3.6, colW: [2.6, 9.493], size: 11.5 });
    D.enunciado(s, "Saber construir esto trae una responsabilidad: reconocer cuándo NO se debe, y decirlo. Es la tesis del curso desde la Sesión 1.", { y: 5.65, h: 1.05, size: 16, line: C.naranja });
    s.addNotes(`Fuente de la cifra energética: ethereum.org/energy-consumption (consultada el ${VERIFICADO}), que cita al Crypto Carbon Ratings Institute (CCRI). 3 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "B.10 · fuentes del bloque", titulo: `Estado verificado a ${VERIFICADO}`, ic: "lupa", tituloSize: 21 });
    D.tabla(s, ["tema", "fuente oficial consultada"], [
      ["Naturaleza jurídica", "superfinanciera.gov.co · Cartas Circulares 29/2014, 78/2016, 52/2017 · página «¿Qué son los criptoactivos?» (11-jun-2026)"],
      ["UIAF", "uiaf.gov.co · Resolución 314 de 2021 · Resolución 84 de 2022 · sector «activos virtuales»"],
      ["DIAN", "normograma.dian.gov.co · Concepto 018075 de 2023 · dian.gov.co · Resolución 000240 de 2025"],
      ["Arenera", "funcionpublica.gov.co · Decreto 1234 de 2020 · superfinanciera.gov.co · balance del piloto (27-jun-2024)"],
      ["Congreso", "camara.gov.co · PL 139/2021C y PL 510/2025C · senado.gov.co · noticias de trámite"],
      ["UE y GAFI", "eur-lex.europa.eu · Reglamentos 2023/1114 y 2023/1113 · fatf-gafi.org · guía de activos virtuales y R.16 (2025)"],
      ["⚠ No confirmado", "Conceptos del BanRep (sitio no abrió) · proyectos radicados desde jul-2026 · informe final del piloto · modificaciones 2026"],
    ], { y: 1.85, h: 4.35, colW: [2.4, 9.693], size: 10.5 });
    D.parrafo(s, "Las URL completas están en las notas del orador y en la guía del laboratorio 16. Antes de dictar: abrir cada una otra vez.", { y: 6.3, h: 0.45, size: 12, color: C.ocre });
    s.addNotes(`URL completas (todas abiertas el ${VERIFICADO}): superfinanciera.gov.co/publicaciones/10082339/ · /10085788/ · /10087902/ · /10115324/ · /10115249/ · /10107301/ · /10115218/ · /10114254/ | funcionpublica.gov.co/eva/gestornormativo/norma.php?i=142005 | uiaf.gov.co/sites/default/files/2024-10/Resolución_314_de_2021_AV.pdf · uiaf.gov.co/sites/default/files/2024-10/Resolucion_84_de_2022.pdf · uiaf.gov.co/sector/activos-virtuales | dian.gov.co/normatividad/Normatividad/Resolución 000240 de 24-12-2025.pdf · normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_18075_2023.htm | camara.gov.co/criptoactivos-2227/ · camara.gov.co/servicios-activos-virtuales-497/ · senado.gov.co/index.php/el-senado/noticias/4578-proyecto-de-criptoactivos-supera-otro-debate-en-el-congreso | eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32023R1114 · ...CELEX:32023R1113 | fatf-gafi.org/en/publications/Fatfrecommendations/update-Recommendation-16-payment-transparency-june-2025.html · fatf-gafi.org/content/dam/fatf-gafi/guidance/Updated-Guidance-VA-VASP.pdf. Se sugiere invitar a un profesional jurídico o de cumplimiento para esta sesión. 2 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "B.11 · verificación del bloque B", titulo: "Pregunta de control", ic: "pregunta", tituloSize: 29 });
    D.enunciado(s, "Un compañero dice: «En Colombia las criptomonedas son ilegales y la DIAN no se entera de nada». Corrijan las dos mitades de la frase citando la fuente oficial de cada corrección.", { y: 1.9, h: 1.8, size: 18, line: C.naranja });
    await D.ficha(s, { tipo: "termino", etiqueta: "Respuesta esperada", x: M, y: 3.95, w: CW, h: 2.75, texto: "No son ilegales: no son moneda de curso legal ni valores, y no están reguladas ni supervisadas (SFC, Cartas Circulares 29/2014, 78/2016 y 52/2017; página de la SFC actualizada en 2026). Pero tenerlas o negociarlas no está prohibido. Y la DIAN sí se entera: se declaran como activos intangibles (Concepto 018075 de 2023) y, desde el año gravable 2026, los proveedores reportan a sus usuarios (Resolución 000240 de 2025, CARF). Además, los PSAV reportan transacciones a la UIAF desde 2022 (Resolución 314 de 2021).", size: 12.5 });
    s.addNotes("2 minutos en parejas. Premiar a quien cite la resolución con número: es la costumbre que queremos.");
  }

  /* ================================================================ C */
  (await D.divisor({ letra: "C", titulo: "Laboratorio 16 y taller", sub: "El mismo contrato, sin tocar una línea, en Sepolia y en OP Sepolia: cuánto cuesta y cuánto tarda en cada una, con datos propios. Y el análisis regulatorio del proyecto.", minutos: "APROXIMADAMENTE 55 MINUTOS · EN EQUIPOS", ic: "grafico" })).addNotes("Bloque C: 55 minutos. Guía completa: laboratorios-evm/guias/s16-capa2-comparativa.pdf. Si los faucets fallan, el docente reparte ETH de OP Sepolia desde la billetera institucional.");

  {
    const s = await D.lamina({ kicker: "C.1 · qué se hace", titulo: "Un contrato, dos redes, una tabla", ic: "grafico", tituloSize: 28 });
    D.pasos(s, [
      ["PROBAR EN LOCAL", "npx hardhat test test/s16/SelloTiempo.test.js → 3 passing. Antes de gastar ETH, comprobar que el contrato funciona."],
      ["ENSAYAR LA MEDICIÓN", "El script en la red local, y simulando un rollup OP para ver el campo l1Fee sin gastar nada."],
      ["CONSEGUIR ETH EN OP SEPOLIA", "Faucet o puente desde Sepolia (1 a 3 minutos). Detalle en C.2."],
      ["DESPLEGAR Y MEDIR", "El mismo script con --network sepolia y con --network opSepolia."],
      ["COMPARAR", "Llenar la tabla con SUS números y responder las preguntas de la guía."],
    ], { y: 1.85, alto: 0.76, gap: 0.1, anchoEt: 3.2, size: 12 });
    D.parrafo(s, "El contrato es SelloTiempo: guarda el hash de un documento y su fecha. Pequeño y sin dependencias, para que la comparación sea justa.", { y: 6.2, h: 0.55, size: 12.5, color: C.ocre });
    s.addNotes("hardhat.config.js ya define la red opSepolia (chainType op). No se toca el archivo de configuración: solo el keystore. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · preparar la red de prueba", titulo: "Keystore, faucets y puente", ic: "llave", tituloSize: 28 });
    D.codigo(s, `npx hardhat keystore set OP_SEPOLIA_RPC_URL   # p. ej. https://sepolia.optimism.io (público)
npx hardhat keystore list                      # deben aparecer SEPOLIA_* y OP_SEPOLIA_RPC_URL`, { x: M, y: 1.85, w: CW, h: 0.95, lang: "py", size: 11 });
    D.tabla(s, ["vía para tener ETH en OP Sepolia", "condiciones (verificadas el 17-sep-2026)"], [
      ["Superchain Faucet · console.optimism.io/faucet", "Faucet oficial de Optimism. Montos: la página no se pudo leer al verificar."],
      ["QuickNode · faucet.quicknode.com/optimism/sepolia", "Un reclamo cada 12 h, sin saldo mínimo en mainnet."],
      ["Alchemy · alchemy.com/faucets/optimism-sepolia", "0,1 ETH cada 24 h; exige 0,001 ETH en mainnet: no apto para billeteras del curso."],
      ["Puente desde Sepolia (L1StandardBridge)", "Enviar ETH de Sepolia a 0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1: llega en 1-3 min."],
    ], { y: 2.95, h: 2.55, colW: [4.9, 7.193], size: 11 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Antes de enviar al puente", x: M, y: 5.62, w: CW, h: 1.12, texto: "Verifiquen la dirección en el registro oficial (guía, sección 5). Solo ETH de Sepolia, solo desde la billetera del curso. Volver de OP Sepolia a Sepolia tarda 7 días.", size: 12 });
    s.addNotes(`Verificado el ${VERIFICADO}: docs.optimism.io/app-developers/tools/faucets; direcciones en el superchain-registry (github.com/ethereum-optimism/superchain-registry, superchain/configs/sepolia/op.toml): L1StandardBridgeProxy 0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1. Enviar ETH directamente al proxy desde una cuenta normal (EOA) deposita la misma cantidad a la misma dirección en OP Sepolia. Tiempo de depósito 1-3 min según docs.optimism.io. chainId OP Sepolia: 11155420. ⚠ VERIFICAR ANTES DE DICTAR que los faucets sigan activos. 4 minutos.`);
  }

  {
    const s = await D.lamina({ kicker: "C.3 · desplegar y medir", titulo: "El script y lo que imprime", ic: "terminal", tituloSize: 28 });
    D.codigo(s, `npx hardhat run scripts/s16/desplegar-y-medir.js --network sepolia
npx hardhat run scripts/s16/desplegar-y-medir.js --network opSepolia`, { x: M, y: 1.85, w: CW, h: 0.9, lang: "py", size: 11.5 });
    D.codigo(s, `OPERACIÓN sellar(hash)
  gas usado        90.279
  precio del gas   ...  gwei
  ejecución        ...  ETH
  datos L1 (l1Fee) ...  ETH   ← solo en OP Sepolia
  TOTAL            ...  ETH
  tiempo al recibo ...  s`, { x: M, y: 2.9, w: 6.2, h: 2.55, lang: "py", titulo: "forma de la salida (red local: gas real)", size: 10.5 });
    D.lista(s, [
      "El gas usado es CASI igual en las dos redes: es el mismo bytecode ejecutando lo mismo.",
      "Lo que cambia es el precio del gas y, en la L2, el l1Fee.",
      "El tiempo al recibo depende del tiempo de bloque: 12 s en Sepolia, 2 s en OP Sepolia.",
    ], { x: M + 6.45, y: 2.9, w: CW - 6.45, h: 2.55, size: 12, gap: 6 });
    D.parrafo(s, "Cómo saber que terminó: cada corrida imprime una «Fila para la tabla». Con las dos filas, la tabla de C.4 se llena sola.", { y: 5.65, h: 0.7, size: 12.5, color: C.ocre });
    s.addNotes("Medido en la red local el 17-09-2026: desplegar SelloTiempo usa 169 615 de gas y sellar(hash) 90 279. El tiempo de bloque de OP Sepolia es de 2 s (dato del OP Stack; se puede comprobar comparando timestamps de bloques consecutivos). 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "C.4 · la tabla comparativa", titulo: "Qué esperar, antes de medir", ic: "grafico", tituloSize: 28 });
    D.tabla(s, ["sellar(hash) · 90 279 gas", "Sepolia (L1)", "OP Sepolia (L2)"], [
      ["Precio del gas observado hoy", "≈ 1,075 gwei (base fee)", "≈ 0,0017 gwei"],
      ["Ejecución", "≈ 0,0000971 ETH", "≈ 0,000000153 ETH"],
      ["Datos L1 (l1Fee), estimado", "no aplica", "≈ 0,0000000167 ETH"],
      ["Total estimado", "≈ 0,0000971 ETH", "≈ 0,00000017 ETH"],
    ], { y: 1.85, h: 2.6, colW: [4.3, 3.9, 3.893], size: 11.5 });
    D.cifra(s, "≈ 570×", "más barato en OP Sepolia, con los precios observados hoy. El de ustedes será otro.", { x: M, y: 4.65, w: 4.6, h: 1.9, tsize: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "No generalizar", x: M + 4.85, y: 4.65, w: CW - 4.85, h: 1.9, texto: "Son redes de PRUEBA: sus precios no reflejan los de mainnet. Lo que sí se generaliza es la estructura: el gas es igual, el precio no, y la L2 suma un costo de datos L1.", size: 12 });
    s.addNotes("Estimación calculada el 17-09-2026: gas de sellar medido en local (90 279) × precios observados ese día en nodos públicos (base fee de Sepolia 1,075106545 gwei; effectiveGasPrice típico de OP Sepolia 1 700 250 wei; l1Fee de una transacción pequeña de OP Sepolia con l1GasUsed 1 600 = 16 746 508 672 wei). Sepolia: 90 279 × 1,0751 gwei = 97 059 543 776 055 wei. OP Sepolia: 153 496 869 750 + 16 746 508 672 = 170 243 378 422 wei. Razón ≈ 570. Los estudiantes deben reemplazar todo con SUS números. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "C.5 · errores frecuentes", titulo: "Lo que atasca a casi todos", ic: "alerta", tituloSize: 28 });
    D.tabla(s, ["síntoma", "causa y solución"], [
      ["«Sin saldo en esta red» en opSepolia", "El ETH está en Sepolia, no en OP Sepolia. Faucet de OP Sepolia o puente (C.2)."],
      ["HHE… configuration variable OP_SEPOLIA_RPC_URL", "Falta en el keystore: npx hardhat keystore set OP_SEPOLIA_RPC_URL."],
      ["Envió ETH al puente y no llega", "Esperar 1-3 minutos y revisar el explorador de OP Sepolia con la MISMA dirección."],
      ["«rate limit» o 429 con el RPC público", "El nodo público limita. Usar una URL de Alchemy o Infura para OP Sepolia en el keystore."],
      ["l1Fee aparece como «no aplica»", "Corrieron sin --network opSepolia: están en Sepolia o en la red local."],
      ["El total de la L2 da 0,0", "Leyeron gasUsed × gasPrice redondeado. El script imprime la cifra completa en ETH: no redondeen."],
    ], { y: 1.85, h: 4.85, colW: [4.6, 7.493], size: 11 });
    s.addNotes("La guía PDF trae la tabla ampliada. 2 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "C.6 · taller regulatorio", titulo: "El análisis legal del proyecto propio", ic: "taller", tituloSize: 26 });
    D.parrafo(s, "En equipos, 20 minutos, con la plantilla de la guía. No es un ejercicio abstracto: es lo que habría que resolver para sacar SU proyecto a producción en Colombia.", { y: 1.85, h: 0.65, size: 13.5 });
    D.tabla(s, ["pregunta de la plantilla", "norma que la responde (bloque B)"], [
      ["¿Nuestro proyecto intercambia, custodia o transfiere activos virtuales por cuenta de otros? ¿Seríamos PSAV?", "UIAF · Resolución 314 de 2021"],
      ["¿Nuestros usuarios obtienen ganancias con un token? ¿Qué declaran? ¿Reportaríamos?", "DIAN · Concepto 018075 de 2023 · Resolución 000240 de 2025"],
      ["¿Nuestro token podría verse como producto financiero o valor?", "SFC · Cartas Circulares; Ley 964 de 2005"],
      ["¿Qué datos personales tocamos y dónde viven? ¿Cómo cumplimos la supresión?", "Ley 1581 de 2012 (Sesión 15)"],
      ["¿El «contrato» de nuestro proyecto tiene efecto jurídico, o solo automatiza?", "B.8: pregunta abierta"],
    ], { y: 2.6, h: 3.6, colW: [7.6, 4.493], size: 11 });
    D.parrafo(s, "Se entrega con el laboratorio. Alimenta la sustentación del Demo Day y, para muchos, el ensayo.", { y: 6.3, h: 0.45, size: 12.5, color: C.ocre });
    s.addNotes("Circular por los equipos. Respuesta típica correcta: la mayoría de proyectos del curso NO son PSAV; su obligación más real es la Ley 1581. Premiar al equipo que descubra que su diseño obliga a algo que no había previsto. 20 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "C.7 · entrega del laboratorio", titulo: "Qué se entrega y cómo se califica", ic: "bandera", tituloSize: 27 });
    D.tabla(s, ["evidencia", "peso"], [
      ["SelloTiempo desplegado en Sepolia y en OP Sepolia: direcciones y hashes verificables en los exploradores", "30 %"],
      ["Tabla comparativa llenada con las dos «filas» del script, incluido el l1Fee", "25 %"],
      ["Respuestas de análisis (guía, sección 8) con SUS números", "20 %"],
      ["Plantilla del taller regulatorio del proyecto propio, con normas citadas y fecha de consulta", "25 %"],
    ], { y: 1.9, h: 2.9, colW: [10.093, 2.0], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Dónde está todo", x: M, y: 5.05, w: CW, h: 1.65, texto: "Guía paso a paso: laboratorios-evm/guias/s16-capa2-comparativa.pdf (faucets, puente, keystore, script, tabla y plantilla del taller). Se entrega en el repositorio del equipo antes de la Sesión 17. Sin direcciones verificables en las dos redes, el laboratorio no se califica.", size: 12.5 });
    s.addNotes("Parte del 4 % de «Laboratorios S14–S16». 2 minutos.");
  }

  /* ================================================================ D */
  (await D.divisor({ letra: "D", titulo: "Avance 2 · la dApp integrada", sub: "El proyecto deja de ser contratos sueltos: una interfaz conectada que ejecuta el flujo principal de punta a punta en Sepolia.", minutos: "APROXIMADAMENTE 20 MINUTOS · 10 % DE LA NOTA FINAL", ic: "bandera" })).addNotes("Bloque D: 20 minutos. Documento público con checklist y rúbrica: material/proyecto/03-avance-2.pdf.");

  {
    const s = await D.lamina({ kicker: "D.1 · qué se entrega", titulo: "Avance 2: el corte vertical funcionando", ic: "bandera", tituloSize: 27 });
    D.tabla(s, ["componente", "requisito mínimo"], [
      ["Frontend conectado", "Conecta la billetera, detecta la red (Sepolia) y lee y escribe en SUS contratos verificados."],
      ["Flujo completo", "El caso de uso principal funciona de punta a punta: acción del usuario → transacción → resultado visible."],
      ["Estados de transacción", "Esperando firma, pendiente, confirmada; y los cuatro errores de la S12: red equivocada, sin billetera, rechazo, revertida."],
      ["Metadata en IPFS (si aplica)", "Si hay NFT, el tokenURI apunta a IPFS y la imagen se ve en la interfaz."],
      ["Repositorio", "README con cómo correrlo, direcciones de contratos y etiqueta git v0.2-avance-2."],
    ], { y: 1.85, h: 3.75, colW: [3.0, 9.093], size: 11.5 });
    D.parrafo(s, "Peso: 10 % de la nota final. Mejor UN flujo completo y sólido que cinco a medias.", { y: 5.8, h: 0.5, size: 13, color: C.ocre });
    s.addNotes("Peso según la sección 8 del plan (Avance 2: 10 %). Ojo: la sección 9 del plan agrupa todos los avances en un 28 %; material/proyecto/README.md explica la discrepancia y la decisión que debe anunciar el docente. Detalle y rúbrica en proyecto/03-avance-2.pdf. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "D.2 · cómo se demuestra", titulo: "Tres minutos en vivo, y un video de respaldo", ic: "pantalla", tituloSize: 26 });
    D.pasos(s, [
      ["ABRIR", "La dApp en el navegador, billetera del curso, red Sepolia."],
      ["EJECUTAR", "El flujo principal completo, en vivo: firmar, esperar, ver el resultado en la interfaz."],
      ["VERIFICAR", "Abrir el hash de esa transacción en el explorador: la cadena confirma lo que muestra la interfaz."],
      ["PROVOCAR UN ERROR", "Rechazar una firma o cambiar de red: la interfaz lo explica sin romperse."],
    ], { y: 1.85, alto: 0.78, gap: 0.1, anchoEt: 2.6, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Si la demo en vivo falla", x: M, y: 5.5, w: CW, h: 1.2, texto: "Se muestra el video de respaldo de 3 minutos (el mismo que exige el Demo Day) y se agenda una revisión en horario de atención antes de la S17. Nunca con dinero real, nunca con la billetera personal.", size: 12.5 });
    s.addNotes("Con equipos de 3 y ~6 equipos, 3 minutos por equipo caben en 20. Si hay más equipos, revisar la mitad hoy y la otra mitad con el video. La rúbrica detallada está en el PDF.");
  }

  await D.preguntaSemana({
    pregunta: "Para su proyecto en Colombia: nombren la obligación legal que MÁS les costaría cumplir. ¿La cumplirían, o rediseñarían el proyecto para no tenerla?",
    trabajo: [
      "Laboratorio 16: despliegue en dos redes, tabla, análisis y plantilla del taller (guía PDF).",
      "Demo Day (S17): sustentación de 15 min + 5 de preguntas; ensayar con cronómetro.",
      "Ensayo individual (RA7): entrega en la S17, con la declaración de uso de IA.",
      "Video demo de respaldo de 3 minutos y repositorio final con README reproducible.",
    ],
    notas: "La respuesta a la pregunta de la semana es una lámina natural de la sustentación: «limitaciones y costos» (punto 5 de la estructura del Demo Day, plan de estudios).",
  });

  const cierre = await D.cierre({
    frase: "Una solución técnica perfecta puede ser ilegal o impagable. Saberlo es parte de saber construir.",
    sub: "Ya está todo: el mecanismo, el código, la seguridad, la interfaz, el gobierno, la escala y el contexto. Lo que queda es mostrarlo y defenderlo.",
    proxima: "Sesión 17 · Demo Day · sustentación de proyectos y cierre del curso",
  });
  cierre.addNotes("Volver a la lámina de objetivos: una frase por pregunta. Recordar la fecha del ensayo y del Demo Day. 2 minutos.");

  return D.guardar(path.join(__dirname, "Sesion-16-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
