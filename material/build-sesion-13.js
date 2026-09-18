/* =====================================================================
   Sesión 13 · Integración full-stack e infraestructura del ecosistema
   Estándar de la Sesión 4: cada concepto con idea llana, ejemplo trabajado
   y error típico; notas del orador en todas las láminas.
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 13 · INTEGRACIÓN FULL-STACK E INFRAESTRUCTURA", titulo: "Sesión 13 · Integración full-stack e infraestructura" });
  const { C, F, M, CW } = D;

  /* Lámina de verificación al cierre de cada bloque (primitiva local). */
  async function verificacion({ kicker, pregunta, pistas, notas }) {
    const s = await D.lamina({ kicker, titulo: "Pregunta de verificación", ic: "pregunta", tituloSize: 29 });
    D.enunciado(s, pregunta, { y: 1.9, h: 1.9, size: 19, line: C.naranja });
    D.etiqueta(s, "Antes de responder, piensen en", { x: M, y: 4.05, w: 8, color: C.gris });
    D.lista(s, pistas, { y: 4.45, h: 2.3, size: 13.5, gap: 6 });
    s.addNotes(notas);
    return s;
  }

  /* Fila de ideas numeradas (cierre de bloque). */
  function ideas(s, lista, y0 = 1.9, paso = 0.8) {
    lista.forEach((t, i) => {
      const y = y0 + i * paso;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* ------------------------------------------------------------ apertura */
  await D.portada({
    kicker: "SESIÓN 13 · UNIDAD III · CIERRE",
    titulo: "CERRAR EL\nCÍRCULO DE\nLA dAPP",
    sub: "Leer la historia sin recorrer la cadena, entrar sin contraseña con una firma, y entregar un proyecto que otro pueda correr.",
    palabra: "INTEGRAR",
    ic: "capas",
    notas: "Cierra la Unidad III. Hoy hay tres cosas: la infraestructura que hace usable una dApp (bloque A), el laboratorio 13 de firmas EIP-712 más integración asistida (B) y la entrega del Avance 1 con revisión técnica (C). Recordar desde el minuto uno: la lista de preguntas de la revisión técnica es pública y está en material/proyecto/02-avance-1. 2 minutos.",
  });

  await D.agenda({
    intro: "Apertura de 10 minutos y una pausa de 10 entre A y B. Hoy la teoría es corta y práctica: todo lo que se explica en A se usa en B o se revisa en C.",
    bloques: [
      ["A", "INFRAESTRUCTURA DEL ECOSISTEMA", "Indexación, ENS, EIP-712 y SIWE, abstracción de cuentas, hosting y repositorio.", "~65 min"],
      ["B", "LAB 13 + INTEGRACIÓN ASISTIDA", "Autenticación por firma EIP-712; después, cada equipo integra su dApp.", "~70 min"],
      ["C", "ENTREGA DEL AVANCE 1", "Lista de chequeo, rúbrica y cierre de la revisión técnica por equipos.", "~25 min"],
    ],
    notas: "Reparto real: 0-10 apertura (pregunta de la semana de la S12), 10-75 bloque A, 75-85 pausa, 85-155 bloque B (40 de laboratorio guiado y 30 de integración; mientras integran, el docente empieza la revisión técnica equipo por equipo), 155-180 bloque C. Si el grupo tiene más de 8 equipos, empezar la revisión desde el minuto 100.",
  });

  await D.objetivo({
    objetivo: "Cerrar el ciclo de la dApp e incorporar la infraestructura que la hace usable: indexación, nombres, firmas y cuentas.",
    preguntas: [
      "¿Por qué no se puede sacar el historial de un contrato leyendo su estado, y qué se usa en su lugar?",
      "¿Qué firma exactamente una billetera en EIP-712, y qué impide que esa firma se reutilice?",
      "¿Cómo se inicia sesión con una firma, y qué hace la abstracción de cuentas por el usuario nuevo?",
      "¿Qué tiene que tener un repositorio para que otro lo corra sin preguntarles nada?",
    ],
    ra: "RA4 · despliegue verificado y reproducible  ·  RA6 · integración de la interfaz con contratos, firmas y eventos.",
    notas: "Leer el objetivo en voz alta. Las cuatro preguntas se retoman en la lámina de ideas del bloque A y en la revisión técnica del bloque C. RA4 y RA6 son los que el Avance 1 evalúa.",
  });

  await D.glosario({
    items: [
      ["Log / evento", "registro de ejecución", "Dato que un contrato emite con emit. Queda en el recibo, no en el estado: el contrato no puede leerlo después."],
      ["Indexador", "indexer", "Servicio que lee los eventos una vez, los guarda en una base de datos y responde consultas rápidas."],
      ["Subgrafo", "subgraph", "La receta de indexación para The Graph: qué contrato, qué eventos y cómo guardarlos. Se consulta con GraphQL."],
      ["ENS", "Ethereum Name Service", "Registro en cadena que traduce nombres como vitalik.eth a direcciones, y al revés."],
      ["EIP-712", "typed structured data", "Estándar para firmar datos con tipos y un dominio. La billetera muestra campos legibles, no bytes."],
      ["SIWE · ERC-4361", "Sign-In with Ethereum", "Iniciar sesión firmando un mensaje de texto estándar con nonce y dominio. Sin contraseña."],
      ["ERC-4337", "account abstraction", "Cuentas que son contratos, operadas con UserOperations, bundlers y un contrato EntryPoint."],
      ["EIP-7702", "set code for EOAs", "Desde mayo de 2025, una cuenta normal puede delegar su ejecución a un contrato sin cambiar de dirección."],
    ],
    notas: "No leer las ocho definiciones: pedir que las lean y preguntar cuál ya habían escuchado. La distinción clave de hoy: SIWE firma TEXTO (ERC-191), no EIP-712. Muchos tutoriales lo confunden.",
  });

  /* ================================================================ A */
  {
    const s = await D.divisor({ letra: "A", titulo: "Infraestructura del ecosistema", sub: "Un contrato y una pantalla bastan para una demo. Para que la use gente real faltan piezas: leer la historia, nombres legibles, firmas y cuentas amables.", minutos: "APROXIMADAMENTE 65 MINUTOS", ic: "capas" });
    s.addNotes("Bloque A: seis temas del plan (indexación, ENS, EIP-712 y SIWE, abstracción de cuentas, hosting, repositorio). Unos 10 minutos por tema. Cada uno se usa hoy mismo en B o se revisa en C.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · el problema de leer la cadena", titulo: "El estado solo guarda el presente", ic: "grafico", tituloSize: 28 });
    D.parrafo(s, "La interfaz de la Sesión 12 leía balanceOf: una llamada, instantánea, gratis. Pero el producto pide otra cosa: «muéstrame todas las asistencias de Ana» o «las diez últimas transferencias». Y eso el contrato no lo sabe.", { y: 1.9, h: 0.95, size: 14.5 });
    D.dosColumnas(s,
      { et: "Lo que guarda el estado", items: ["El VALOR ACTUAL de cada variable: saldo de hoy, dueño de hoy.", "Cada escritura pisa la anterior: el valor viejo ya no está en el storage.", "Leerlo es barato: una llamada por dato."] },
      { et: "Dónde está la historia", items: ["En los LOGS de los recibos: cada emit deja un registro con el bloque y la transacción.", "Los logs no son accesibles desde el contrato: solo desde fuera.", "Filtrarlos exige pedir rangos de bloques al nodo."] },
      { y: 3.05, h: 2.35, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico", x: M, y: 5.6, w: CW, h: 1.12, texto: "«Guardo un arreglo con todo el historial en el contrato y lo leo desde la interfaz». Funciona con diez registros y se vuelve caro e ilegible con diez mil. La historia va en eventos; el estado guarda solo lo que el contrato necesita para decidir.", size: 12 });
    s.addNotes("Preguntar: ¿dónde queda el saldo que Ana tenía ayer? Respuesta: en ningún lado del storage; solo se puede reconstruir con los eventos Transfer. Conectar con la S6 (eventos) y la S5 (el log cuesta menos gas que el storage). 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · por qué no escala, con números", titulo: "Recorrer un año de bloques, a mano", ic: "grafico", tituloSize: 27 });
    D.parrafo(s, "Supongamos que la interfaz quiere el historial completo de un contrato que lleva un año desplegado. En Ethereum sale un bloque cada 12 segundos.", { y: 1.9, h: 0.6, size: 14.5 });
    D.cifra(s, "2 628 000", "bloques en un año: 365 × 24 × 3 600 ÷ 12. Todos hay que revisarlos buscando los logs del contrato.", { x: M, y: 2.7, w: 3.9, h: 1.95, size: 28, tsize: 11.5 });
    D.cifra(s, "263", "consultas eth_getLogs si el proveedor deja pedir 10 000 bloques por vez. En cada visita de cada usuario.", { x: M + 4.1, y: 2.7, w: 3.9, h: 1.95, size: 30, color: C.violeta, tsize: 11.5 });
    D.cifra(s, "0", "capacidad de ordenar, agregar o paginar en el nodo: eso lo tiene que hacer el navegador con todo en memoria.", { x: M + 8.2, y: 2.7, w: CW - 8.2, h: 1.95, size: 30, color: C.tinta, tsize: 11.5 });
    D.parrafo(s, "Cada proveedor de RPC limita el rango de bloques o el número de resultados por consulta, y cuenta las llamadas contra su plan gratuito. Lo que en local es instantáneo, en Sepolia o en la red principal se vuelve lento, caro o simplemente rechazado.", { y: 4.9, h: 0.9, size: 13.5 });
    D.parrafo(s, "La salida es indexar: leer los eventos UNA vez, guardarlos en una base de datos, y que la interfaz consulte esa base.", { y: 5.95, h: 0.6, size: 13.5, color: C.ocre });
    s.addNotes("Cálculo: 31 536 000 s / 12 = 2 628 000 bloques. 2 628 000 / 10 000 = 262,8 → 263 consultas. El límite de 10 000 es un ejemplo: cada proveedor fija el suyo y cambia con el plan; pedir que revisen el de su proveedor. Hoy la red principal va por el bloque ~26 millones (consultado el 17-sep-2026). 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · la alternativa ligera", titulo: "Leer eventos con queryFilter", ic: "codigo", tituloSize: 28 });
    D.codigo(s, `// el evento del laboratorio de hoy: tres campos indexed = tres «topics» filtrables
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
    s.addNotes("Máximo tres parámetros indexed por evento (el primer topic es la firma del evento). Lo no indexado se puede leer pero no filtrar en el nodo. Truco práctico: guardar en el README el bloque del despliegue para usarlo como inicio del rango. En el laboratorio B la prueba 'los eventos se leen después con queryFilter' hace exactamente esto. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · indexar de verdad", titulo: "The Graph: un subgrafo en tres archivos", ic: "red", tituloSize: 27 });
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
    await D.ficha(s, { tipo: "termino", etiqueta: "Estado actual, verificado", x: M, y: 5.3, w: CW, h: 1.42, texto: "El «hosted service» gratuito de The Graph se apagó el 12 de junio de 2024. Hoy se publica en Subgraph Studio y se sirve desde su red descentralizada de indexadores; el plan gratuito incluye 100 000 consultas al mes. Todo lo demás del subgrafo es igual.", size: 12 });
    s.addNotes("Fuentes verificadas el 17-sep-2026: thegraph.com/blog/sunsetting-hosted-service (fin del hosted service el 12-jun-2024) y thegraph.com/studio-pricing (100 000 consultas gratis al mes). Muchos tutoriales viejos todavía dicen 'despliega en el hosted service': ya no existe. Error típico: pensar que The Graph 'lee el storage'; solo ve eventos (y opcionalmente llamadas). Un contrato sin eventos es invisible para él. 6 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · la decisión", titulo: "¿Cuál usar en su proyecto?", ic: "balanza", tituloSize: 29 });
    D.tabla(s, ["opción", "cuándo conviene", "qué cuesta", "qué centraliza"], [
      ["queryFilter en la interfaz", "Pocos eventos, un contrato, consultas simples.", "Nada extra; llamadas al RPC.", "Nada nuevo: el mismo RPC de siempre."],
      ["Subgrafo (The Graph)", "Muchos eventos, filtros, orden, varias entidades.", "Aprender GraphQL y AssemblyScript; consultas sobre el plan gratuito se pagan.", "Dependen de la red de indexadores y de Studio."],
      ["Indexador propio (script + base de datos)", "Necesidades muy específicas o datos fuera de la cadena.", "Operar un servidor y una base de datos.", "Todo: ustedes son el punto único."],
    ], { y: 1.9, h: 3.25, colW: [2.9, 3.3, 3.0, 2.893], size: 11 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Regla del curso", x: M, y: 5.35, w: CW, h: 1.37, texto: "Usen la pieza más simple que resuelva. Para el Avance 2 basta queryFilter en casi todos los proyectos. Si eligen un subgrafo, el README debe decir por qué queryFilter no alcanzaba: es una decisión de diseño que se defiende.", size: 12.5 });
    s.addNotes("Pregunta rápida al grupo: ¿alguno de sus proyectos necesita ordenar o paginar miles de registros? Normalmente ninguno. Dejar claro que un indexador propio es legítimo pero reintroduce el servidor central que la dApp quería evitar. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · nombres legibles", titulo: "ENS: vitalik.eth en vez de 0xd8dA…6045", ic: "termino", tituloSize: 26 });
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
    s.addNotes("Valores verificados en vivo con ethers contra la red principal el 17-sep-2026 (resolver 0x231b…8E63, contenthash ipfs://QmULSd…). Precio y período de gracia: docs.ens.domains/registry/eth. Seguridad: nombres parecidos (homoglifos) engañan; mostrar siempre también la dirección. ⚠ VERIFICAR ANTES DE DICTAR: en feb-2026 ENS anunció que ENSv2 se desplegará en la capa 1 (abandonó su L2 'Namechain'); revisar si ya migró y si cambia algo del flujo. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · firmar sin transaccionar", titulo: "Tres formas de firmar, tres riesgos", ic: "llave", tituloSize: 27 });
    D.parrafo(s, "En la Sesión 3 firmamos transacciones. Pero una billetera también firma MENSAJES: no van a la cadena, no cuestan gas, y aun así prueban quién los autorizó. La diferencia está en qué ve el usuario antes de firmar.", { y: 1.9, h: 0.95, size: 14 });
    D.tabla(s, ["tipo", "qué se firma", "qué ve el usuario", "riesgo"], [
      ["Hash crudo (eth_sign)", "32 bytes cualesquiera.", "Un hexadecimal ilegible.", "Puede ser el hash de una transacción: por eso las billeteras lo bloquean."],
      ["Texto (ERC-191, personal_sign)", "Un texto con el prefijo «\\x19Ethereum Signed Message».", "El texto tal cual.", "El prefijo impide que sea una transacción. Es el que usa SIWE."],
      ["Datos tipados (EIP-712)", "Campos con tipo + un DOMINIO (app, versión, red, contrato).", "Cada campo con su nombre y valor.", "Si el usuario no lee los campos, puede firmar un permiso de gastar sus tokens."],
    ], { y: 3.0, h: 2.6, colW: [2.9, 3.2, 2.5, 3.493], size: 11 });
    D.parrafo(s, "La firma sigue siendo la de la Sesión 3: ECDSA sobre secp256k1, y de la firma se recupera la dirección. Lo que cambia es QUÉ bytes se firman.", { y: 5.8, h: 0.8, size: 13, color: C.ocre });
    s.addNotes("Prefijo exacto ERC-191: \\x19Ethereum Signed Message:\\n + longitud. EIP-712 usa el prefijo \\x19\\x01. Ambos prefijos existen para que una firma de mensaje NUNCA pueda interpretarse como una transacción válida. Pregunta: ¿por qué las billeteras modernas bloquean eth_sign? 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · EIP-712 por dentro", titulo: "Dominio + tipos + mensaje = un resumen", ic: "documento", tituloSize: 26 });
    D.codigo(s, `const dominio = { name: "AsistenciaUSB", version: "1",
                  chainId: 11155111, verifyingContract: "0x…" };   // Sepolia y SU contrato
const tipos = { Asistencia: [
  { name: "estudiante", type: "address" }, { name: "sesion", type: "uint256" },
  { name: "nonce",      type: "uint256" }, { name: "vence",  type: "uint256" } ] };
const firma = await signer.signTypedData(dominio, tipos, mensaje);   // gratis
ethers.verifyTypedData(dominio, tipos, mensaje, firma);              // → dirección`, { x: M, y: 1.9, w: CW, h: 2.4, lang: "js", titulo: "lo que corre el laboratorio 13", size: 11 });
    D.definicion(s, "resumen = keccak256( 0x19 0x01  ‖  hash(dominio)  ‖  keccak256( typeHash ‖ estudiante ‖ sesion ‖ nonce ‖ vence ) )", { x: M, y: 4.45, w: CW, h: 0.62, size: 11.5 });
    D.dosColumnas(s,
      { et: "En Solidity (OpenZeppelin 5)", texto: "Heredan EIP712(\"AsistenciaUSB\", \"1\"). _hashTypedDataV4(hashStruct) arma el resumen; ECDSA.recover(resumen, firma) devuelve quién firmó." },
      { et: "Error típico", linea: C.rojo, color: C.rojo, texto: "Escribir el tipo con un espacio de más, otro orden o abi.encodePacked. La firma «no verifica» y nadie sabe por qué: el typeHash debe ser idéntico, carácter por carácter." },
      { y: 5.22, h: 1.5, size: 11.5 });
    s.addNotes("La prueba 'calcula el mismo resumen que ethers (TypedDataEncoder)' del laboratorio compara el hash de Solidity con el de ethers: si alguien se equivoca en el tipo, esa prueba lo delata antes que las demás. En Solidity se usa abi.encode (cada campo ocupa 32 bytes), no encodePacked. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · por qué hay dominio, nonce y vencimiento", titulo: "Una firma válida no es válida para siempre", ic: "escudo", tituloSize: 25 });
    D.parrafo(s, "Una firma es un objeto que cualquiera puede copiar. Si el mensaje no dice DÓNDE, CUÁNTAS VECES y HASTA CUÁNDO vale, quien la copie la puede reenviar. Cada campo cierra un ataque concreto, y el laboratorio prueba los cinco:", { y: 1.9, h: 0.95, size: 13.5 });
    D.tabla(s, ["ataque", "qué lo impide", "prueba del laboratorio"], [
      ["Reenviar la firma en otra red", "chainId en el dominio.", "★ dominio de otra cadena"],
      ["Reenviarla a otro contrato","verifyingContract en el dominio.", "★ dominio de otro contrato"],
      ["Enviarla dos veces", "nonce que se consume al usarla.", "★ repetición (InvalidAccountNonce)"],
      ["Usarla meses después", "vence: fecha límite en el mensaje.", "★ firma vencida"],
      ["Firmar por otra persona", "recover(resumen, firma) ≠ estudiante.", "★ firma de otro (FirmaInvalida)"],
    ], { y: 3.0, h: 2.75, colW: [3.6, 4.1, 4.393], size: 11.5 });
    D.parrafo(s, "Error típico: comprobar la firma y olvidar el nonce. El contrato «funciona» en todas las pruebas felices y es vulnerable a la primera repetición.", { y: 5.95, h: 0.75, size: 13, color: C.ocre });
    s.addNotes("Esta tabla es el mapa del laboratorio: cada fila es una prueba con estrella. Pedir que la fotografíen. Nota: el valor del nonce lo consume _useCheckedNonce de OpenZeppelin (utils/Nonces.sol), el mismo mecanismo que usa ERC20Permit. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · la cara peligrosa", titulo: "Firmar un permiso es entregar la llave", ic: "alerta", tituloSize: 27 });
    D.parrafo(s, "EIP-712 hace legible la firma, pero no la hace inofensiva. El mismo mecanismo que hoy registra una asistencia sirve, en ERC-2612 (permit), para autorizar a un tercero a gastar tus tokens. Sin gas, sin transacción visible.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "El ataque de phishing", linea: C.rojo, color: C.rojo, items: ["Un sitio falso pide «firmar para verificar la billetera».", "Lo que se firma es un Permit: spender = el atacante, value = todo.", "El atacante envía la firma y vacía los tokens. La víctima nunca pagó gas."] },
      { et: "La costumbre profesional", items: ["Leer el dominio: ¿es la app que creo, en la red que creo?", "Leer el tipo: Permit, Order, Delegation… ¿qué autoriza?", "Si no se entiende, no se firma. Regla del curso desde la S1."] },
      { y: 2.95, h: 2.5, size: 12 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Regla del curso", x: M, y: 5.6, w: CW, h: 1.12, texto: "No se firma lo que no se entiende, aunque «sea gratis». Una firma sin gas puede mover más dinero que una transacción.", size: 13 });
    s.addNotes("Conectar con la S10 (permit de ERC-20). Mostrar en la billetera del curso una solicitud de firma EIP-712 durante el laboratorio y pedir que lean cada campo en voz alta. No mencionar casos concretos con cifras sin verificarlas. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · login sin contraseña", titulo: "Sign-In with Ethereum (ERC-4361)", ic: "llave", tituloSize: 27 });
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
    await D.ficha(s, { tipo: "alerta", etiqueta: "Error típico: «SIWE es EIP-712»", x: M, y: 5.6, w: CW, h: 1.12, texto: "No: ERC-4361 firma TEXTO con ERC-191, a propósito, porque todas las billeteras lo soportan. EIP-712 es otra herramienta, la que usa el laboratorio para autorizar una acción en un contrato.", size: 12 });
    s.addNotes("Formato del mensaje tomado de la especificación ERC-4361 (eips.ethereum.org/EIPS/eip-4361, estado Final). La especificación explica por qué eligió ERC-191 sobre EIP-712: soporte universal en billeteras. Para cuentas que son contratos, la verificación se hace con ERC-1271. Lo que SIWE protege: el dominio en el mensaje frena que un sitio falso reuse la firma para otro sitio; el nonce frena la repetición. Después del login, la sesión es web tradicional. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · billeteras que son contratos", titulo: "Abstracción de cuentas: ERC-4337", ic: "escudo", tituloSize: 27 });
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
      ["Operaciones por lotes", "approve + usar en una sola confirmación (el doble paso de la S10)."],
    ], { y: 5.25, h: 1.47, colW: [4.2, 7.893], size: 11 });
    s.addNotes("ERC-4337 está en producción desde el 1 de marzo de 2023, cuando se desplegó el EntryPoint en la red principal (anunciado en ETHDenver / WalletCon); no requirió bifurcación porque todo vive en contratos y en un mempool alternativo. Estado del estándar en eips.ethereum.org: Final. Costos que hay que decir: cada operación gasta más gas que una transacción simple, y se depende de bundlers y paymasters. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · ya activo desde mayo de 2025", titulo: "EIP-7702: la cuenta normal aprende trucos", ic: "engranaje", tituloSize: 26 });
    D.parrafo(s, "Con la actualización Pectra (red principal, 7 de mayo de 2025) una EOA puede firmar una AUTORIZACIÓN que delega su ejecución al código de un contrato. Conserva la misma dirección y los mismos fondos, y gana lotes y gas patrocinado.", { y: 1.9, h: 0.95, size: 14 });
    D.tabla(s, ["", "ERC-4337", "EIP-7702"], [
      ["Qué es", "Estándar de contratos, sin cambiar el protocolo.", "Cambio del protocolo: un tipo de transacción nuevo."],
      ["La dirección", "Una cuenta-contrato nueva, con dirección nueva.", "La misma EOA de siempre."],
      ["La clave original", "Puede dejar de ser necesaria (otras reglas).", "Sigue mandando: quien tiene la clave, manda."],
      ["Se complementan", "Aporta la infraestructura: bundlers, paymasters.", "Deja que una EOA existente use esa infraestructura."],
    ], { y: 3.0, h: 2.35, colW: [2.3, 4.9, 4.893], size: 11 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "El riesgo nuevo", x: M, y: 5.55, w: CW, h: 1.17, texto: "Firmar una autorización 7702 hacia un contrato malicioso es entregarle la cuenta entera. Es la versión extrema de la lámina A.10: la billetera debe mostrar a qué código se delega, y el usuario debe entenderlo.", size: 12.5 });
    s.addNotes("Verificado: blog.ethereum.org/2025/04/23/pectra-mainnet (activación en la época 364032, 7-may-2025, 10:05:11 UTC) y eips.ethereum.org/EIPS/eip-7702 (estado Final). No entrar en el formato de la transacción tipo 4. Idea para llevarse: la abstracción de cuentas ya no es futuro, está en la red principal. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · dónde vive el frontend", titulo: "IPFS + ENS frente a hosting tradicional", ic: "red", tituloSize: 25 });
    D.dosColumnas(s,
      { et: "Hosting tradicional", texto: "Vercel, Netlify o un servidor propio. Rápido de montar y gratis para empezar. Pero si el proveedor cae, bloquea la cuenta o cambia el código, la dApp deja de estar accesible o sirve otra cosa." },
      { et: "IPFS + ENS", texto: "Se compila el frontend, se sube a IPFS (contenido direccionado por hash, S11) y se pone su CID en el contenthash del nombre ENS. Un gateway como eth.limo lo sirve: vitalik.eth.limo funciona así hoy." },
      { y: 1.9, h: 2.35, size: 12.5 });
    D.tabla(s, ["capa", "¿quién la controla en una dApp típica?"], [
      ["Contratos", "Nadie en particular: la cadena."],
      ["Frontend", "El proveedor de hosting, o nadie si está en IPFS con su CID fijado (pinning)."],
      ["Gateway IPFS y RPC", "Empresas concretas: siguen siendo puntos centrales."],
      ["Indexador", "Studio / red de The Graph, o su propio servidor."],
    ], { y: 4.45, h: 2.27, colW: [3.0, 9.093], size: 11.5 });
    s.addNotes("Verificado el 17-sep-2026: el contenthash de vitalik.eth es ipfs://QmULSd… y vitalik.eth.limo responde. ERC-1577 define el campo contenthash. Error típico: 'mi dApp está en IPFS, es 100 % descentralizada'; el usuario igual llega por un gateway y un RPC centralizados. Para el curso, hosting tradicional es aceptable si el README lo declara. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · un repositorio que otro pueda correr", titulo: "La estructura mínima de un proyecto Web3", ic: "documento", tituloSize: 25 });
    D.codigo(s, `mi-proyecto/
├── README.md          qué es, cómo instalar, probar, desplegar
├── contracts/         el código fuente de los contratos
├── test/              las pruebas (cobertura ≥ 80 %)
├── ignition/modules/  despliegue reproducible
├── frontend/          la interfaz (Avance 2)
├── docs/              arquitectura, decisiones, SEGURIDAD.md
├── package.json       y package-lock.json SIEMPRE
└── .gitignore         node_modules, artifacts, coverage, .env`, { x: M, y: 1.9, w: 6.6, h: 3.1, lang: "js", titulo: "árbol de referencia", size: 10.5 });
    D.parrafo(s, "El README es la puerta de entrada. La plantilla está en material/proyecto/02-avance-1. Debe tener, como mínimo:", { x: M + 6.85, y: 1.9, w: CW - 6.85, h: 0.9, size: 12.5 });
    D.lista(s, [
      "Problema y por qué blockchain (del anteproyecto).",
      "Direcciones desplegadas con enlace a Etherscan verificado.",
      "Comandos exactos para instalar, probar y desplegar.",
      "Resultado de cobertura y de Slither.",
      "Qué queda centralizado, dicho con honestidad.",
    ], { x: M + 6.85, y: 2.85, w: CW - 6.85, h: 2.2, size: 12, gap: 4 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Ningún secreto en el repositorio", x: M, y: 5.25, w: CW, h: 1.47, texto: "Claves privadas y URLs de RPC van SOLO en el keystore de Hardhat (npx hardhat keystore set …). Antes de cada push: git status y revisar. Un secreto subido una vez queda en la historia de Git aunque después se borre.", size: 12.5 });
    s.addNotes("Mostrar la plantilla de README del documento del Avance 1. La prueba de fuego de C: el docente clona el repo y sigue el README al pie de la letra. Si no arranca, el criterio 'repositorio documentado' no se cumple aunque el código sea bueno. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · lo que hay que llevarse del bloque A", titulo: "Seis ideas de infraestructura", ic: "lista", tituloSize: 28 });
    ideas(s, [
      "El estado guarda el presente; la historia está en los eventos. Se lee con queryFilter o se indexa.",
      "The Graph hoy se usa por Subgraph Studio: el hosted service se apagó en junio de 2024.",
      "ENS es una lectura en dos pasos; los nombres vencen y los parecidos engañan.",
      "EIP-712 firma datos con dominio; el nonce y el vencimiento evitan que la firma se reuse.",
      "SIWE firma texto (ERC-191). 4337 y 7702 hacen la cuenta programable; 7702 ya está en la red.",
      "Un repo está listo cuando otro lo corre siguiendo el README, sin secretos dentro.",
    ]);
    s.addNotes("Repasar en voz alta en 2 minutos. Antes de la pausa, la pregunta de verificación de la lámina siguiente.");
  }

  await verificacion({
    kicker: "A.17 · cierre del bloque A",
    pregunta: "Un compañero guarda en su contrato un arreglo con cada asistencia «para poder mostrar el historial», y su login pide firmar el texto «Hola». ¿Qué dos cosas le cambian?",
    pistas: [
      "Dónde debería vivir la historia, y con qué se lee desde la interfaz.",
      "Qué le falta a «Hola» para que una firma copiada no sirva a un atacante.",
      "Qué campos del dominio EIP-712 y del mensaje SIWE cumplen esa función.",
    ],
    notas: "Respuesta esperada: (1) quitar el arreglo, emitir un evento con campos indexed y leerlo con queryFilter (o un subgrafo si hay volumen); el arreglo crece sin límite y encarece el contrato. (2) El mensaje debe incluir dominio, nonce de un solo uso y fecha de vencimiento (formato ERC-4361); si no, cualquiera que obtenga esa firma la reutiliza para siempre y en cualquier sitio. Dar 2 minutos en parejas y pedir dos respuestas. Luego pausa de 10 minutos.",
  });

  /* ================================================================ B */
  {
    const s = await D.divisor({ letra: "B", titulo: "Lab 13 · firma EIP-712 e integración", sub: "Primero, en parejas, un contrato que autentica con firmas y resiste cinco ataques. Después, cada equipo integra su propia dApp mientras el docente hace la revisión técnica.", minutos: "APROXIMADAMENTE 70 MINUTOS · 40 DE LAB + 30 DE INTEGRACIÓN", ic: "martillo" });
    s.addNotes("Repartir la guía en PDF: laboratorios-evm/guias/s13-firmas-eip712.pdf. El laboratorio tiene punto de control a los 20 minutos (TODO 1 verde) y a los 40 (16 pruebas verdes). Quien termine antes pasa a integrar su proyecto.");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · qué van a construir", titulo: "Asistencia firmada: firma uno, paga otro", ic: "llave", tituloSize: 27 });
    D.parrafo(s, "El estudiante firma en su billetera «asistí a la sesión 13», gratis. El computador del docente envía esa firma al contrato y paga el gas. El contrato solo registra la asistencia si la firma es del estudiante, para este contrato, en esta red, con el nonce que toca y antes de vencer.", { y: 1.9, h: 1.2, size: 14 });
    D.tabla(s, ["archivo", "qué es", "qué hacen ustedes"], [
      ["andamiaje/s13/AsistenciaFirmada.sol", "El contrato con TODO 1 a 5.", "Lo copian sobre contracts/s13/ y lo completan."],
      ["test/s13/AsistenciaFirmada.test.js", "16 pruebas: 8 felices, 8 ataques (★).", "No se modifica. Es el juez."],
      ["scripts/s13/firmar-asistencia.js", "Firma, verifica fuera y envía; lee eventos.", "Lo corren en local y luego en Sepolia."],
      ["ignition/modules/s13-AsistenciaFirmada.js", "El despliegue reproducible.", "Despliegan y verifican en Sepolia."],
    ], { y: 3.3, h: 2.45, colW: [4.3, 3.8, 3.993], size: 11 });
    D.parrafo(s, "Evidencia: dirección del contrato verificada en Sepolia + hash de la transacción registrar + salida del script + respuestas de la guía.", { y: 5.95, h: 0.75, size: 13, color: C.ocre });
    s.addNotes("El caso es deliberadamente del mundo del curso: no hay datos personales en cadena, solo una dirección y un número de sesión (Ley 1581: nada de nombres ni documentos). Señalar que esto ES gas patrocinado, el mismo concepto de A.12, hecho a mano. 3 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · pasos 1 y 2", titulo: "Preparar y ver las pruebas en rojo", ic: "terminal", tituloSize: 27 });
    D.codigo(s, `cd laboratorios-evm
git pull                                        # traer el material de hoy
copy andamiaje\\s13\\AsistenciaFirmada.sol contracts\\s13\\     (Windows)
cp andamiaje/s13/AsistenciaFirmada.sol contracts/s13/         (macOS / Linux)
npx hardhat test test/s13/AsistenciaFirmada.test.js

#   3 passing          ← las que no dependen de su código (dominio, firmar sin gas…)
#  13 failing          ← el mapa de lo que falta`, { x: M, y: 1.9, w: CW, h: 2.6, lang: "js", titulo: "en la terminal", size: 11.5 });
    D.dosColumnas(s,
      { et: "Cómo saber que va bien", items: ["Compila sin errores (solo avisos de «pure»).", "Salen exactamente 3 verdes y 13 rojas.", "Las rojas nombran lo que falta: resumen, firma, nonce…"] },
      { et: "Si no sale así", linea: C.rojo, color: C.rojo, items: ["HH404 / archivo no encontrado: están fuera de laboratorios-evm.", "Error de compilación: copiaron el archivo a medias.", "0 pruebas: pasaron una carpeta en vez del archivo."] },
      { y: 4.68, h: 2.04, size: 11.5 });
    s.addNotes("Verificado en la copia de prueba del docente: con el andamiaje intacto, 3 pasan y 13 fallan. npx hardhat test recibe ARCHIVOS, no carpetas. Si algún equipo no tiene el repositorio al día, que clone de nuevo. 5 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · pasos 3 y 4", titulo: "Los cinco TODO del contrato", ic: "codigo", tituloSize: 28 });
    D.codigo(s, `function hashAsistencia(...) public view returns (bytes32) {
    bytes32 hashStruct = keccak256(abi.encode(ASISTENCIA_TYPEHASH,
                                   estudiante, sesion, nonce, vence));      // TODO 1
    return _hashTypedDataV4(hashStruct);
}
function registrar(address estudiante, uint256 sesion, uint256 nonce,
                   uint256 vence, bytes calldata firma) external {
    if (block.timestamp > vence) revert FirmaVencida(vence, block.timestamp);  // 2
    address r = ECDSA.recover(hashAsistencia(estudiante, sesion, nonce, vence), firma);
    if (r != estudiante) revert FirmaInvalida(r, estudiante);                  // 3
    _useCheckedNonce(estudiante, nonce);                                       // 4
    asistio[sesion][estudiante] = true;                                        // 5
    emit AsistenciaRegistrada(estudiante, sesion, msg.sender, nonce);
}`, { x: M, y: 1.9, w: CW, h: 3.55, lang: "sol", titulo: "la solución, para la proyección después del punto de control", size: 10.5 });
    D.parrafo(s, "Punto de control a los 20 minutos: con el TODO 1 pasa la prueba «calcula el mismo resumen que ethers». Al terminar el 5: 16 passing.", { y: 5.6, h: 0.55, size: 13, color: C.ocre });
    D.parrafo(s, "No la copien antes de intentarlo: la guía da cada TODO con pistas, y la proyección llega después del punto de control.", { y: 6.2, h: 0.5, size: 12 });
    s.addNotes("NO proyectar esta lámina hasta el minuto 20 del laboratorio. Es exactamente contracts/s13/AsistenciaFirmada.sol. Pregunta de la guía: si se intercambian los pasos 3 y 4, ¿se rompe algo? Respuesta: no para la seguridad, porque el revert deshace el consumo del nonce; sí por estilo, porque checks-effects-interactions pide validar todo antes de escribir. 5 minutos de explicación tras el punto de control.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · paso 5", titulo: "El script: firmar, verificar, enviar, leer", ic: "terminal", tituloSize: 27 });
    D.codigo(s, `npx hardhat run scripts/s13/firmar-asistencia.js

  3 · FIRMA (65 bytes = r ‖ s ‖ v)
     0x28ccf51f1807d3ec0a1170eea504e438cffeb71ae5e308ed6035…
     transacciones del estudiante antes/después de firmar: 0 / 0 ← firmar no es transaccionar
  4 · VERIFICACIÓN FUERA DE LA CADENA
     recuperado       : 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 ✔ coincide
  5 · ENVÍO EN CADENA
     enviada por      : 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (el docente paga el gas)
     bloque / gas     : 2 / 75330
  6 · EVENTOS LEÍDOS CON queryFilter
     bloque 2 · sesión 13 · nonce 0 · enviada por 0xf39F…2266`, { x: M, y: 1.9, w: CW, h: 3.6, lang: "js", titulo: "salida real en la red local (la firma cambia con la hora)", size: 10.5 });
    D.parrafo(s, "Lo que deben poder explicar: por qué el contador de transacciones del estudiante no cambia al firmar, y por qué la dirección que envía es otra.", { y: 5.7, h: 0.95, size: 13.5, color: C.ocre });
    s.addNotes("Salida tomada de una corrida real del script en la red local (Hardhat 3.16.0). El gas de registrar fue 75 330 en esa corrida con el nonce en cero; puede variar un poco. La firma cambia en cada corrida porque 'vence' depende de la hora del bloque. El andamiaje del script (andamiaje/s13/firmar-asistencia.js) tiene los TODO A-F para quien quiera escribirlo. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · paso 6 · evidencia en cadena", titulo: "Llevarlo a Sepolia", ic: "cohete", tituloSize: 29 });
    D.codigo(s, `npx hardhat ignition deploy ignition/modules/s13-AsistenciaFirmada.js --network sepolia --verify
$env:CONTRATO="0x…la dirección que imprimió Ignition…"          # PowerShell
npx hardhat run scripts/s13/firmar-asistencia.js --network sepolia`, { x: M, y: 1.9, w: CW, h: 1.5, lang: "js", titulo: "requiere el keystore de la sesión 8 (SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY, ETHERSCAN_API_KEY)", size: 10.5 });
    D.pasos(s, [
      ["DESPLEGAR", "Ignition imprime la dirección y, con --verify, el enlace a Etherscan con el código verificado."],
      ["FIRMAR Y ENVIAR", "En Sepolia hay una sola cuenta: firma y envía la misma. Tarda unos 12 s por bloque."],
      ["COMPROBAR", "En Etherscan: la pestaña Events muestra AsistenciaRegistrada con su dirección y la sesión 13."],
      ["ENTREGAR", "Dirección, hash de la transacción registrar y captura de la pestaña Events."],
    ], { y: 3.6, alto: 0.68, gap: 0.1, anchoEt: 2.6, size: 12 });
    s.addNotes("Si Etherscan tarda en verificar, reintentar con npx hardhat ignition verify <deployment-id>. Si no hay ETH de Sepolia, el docente distribuye desde la billetera institucional (plan, sección 10). La dirección de un contrato no es un secreto: puede ir en una variable de entorno; la clave, jamás. 4 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · errores frecuentes", titulo: "Lo que suele fallar en este laboratorio", ic: "bicho", tituloSize: 27 });
    D.tabla(s, ["síntoma", "causa y solución"], [
      ["El resumen no coincide con el de ethers", "typeHash distinto: espacios, orden o nombres. Cópienlo exacto de la guía."],
      ["FirmaInvalida con una firma correcta", "Firmaron con otro chainId o verifyingContract: lean el dominio con eip712Domain()."],
      ["InvalidAccountNonce en la primera firma", "Usaron un nonce fijo: pídanlo con contrato.nonces(estudiante)."],
      ["FirmaVencida en Sepolia", "La hora del bloque, no la del computador: calculen vence desde el último bloque."],
      ["queryFilter devuelve vacío en Sepolia", "Rango desde el bloque 0: el RPC lo rechaza o lo corta. Empiecen cerca del despliegue."],
    ], { y: 1.9, h: 3.7, colW: [4.4, 7.693], size: 11.5 });
    D.parrafo(s, "Todos estos síntomas son la misma lección: una firma vale solo para el mensaje EXACTO que se firmó. Un bit distinto y es otra firma.", { y: 5.8, h: 0.85, size: 13.5, color: C.ocre });
    s.addNotes("Esta tabla está ampliada en la guía PDF (sección de errores frecuentes). Circular por la sala preguntando en qué fila está cada pareja. 2 minutos.");
  }

  {
    const s = await D.lamina({ kicker: "B.7 · la segunda mitad del bloque", titulo: "Integración asistida: el corte vertical", ic: "capas", tituloSize: 27 });
    D.pasos(s, [
      ["CONTRATOS", "Desplegados y verificados en Sepolia: esto es Avance 1 y se revisa hoy."],
      ["PRUEBAS", "npx hardhat test --coverage con 80 % o más de líneas en SUS contratos."],
      ["LECTURA", "La interfaz muestra un dato real de su contrato (avance hacia el Avance 2)."],
      ["ESCRITURA", "Una transacción desde la interfaz, con sus estados (S12)."],
      ["FIRMA (si aplica)", "¿Algún flujo de su proyecto mejora con EIP-712? Anótenlo en el README."],
    ], { y: 1.9, alto: 0.72, gap: 0.09, anchoEt: 2.6, size: 12.5 });
    D.parrafo(s, "Mientras tanto, el docente pasa equipo por equipo con la lista pública de preguntas de la revisión técnica (bloque C). Tengan abiertos Etherscan, la terminal y el README.", { y: 5.95, h: 0.75, size: 13, color: C.ocre });
    s.addNotes("El orden de revisión se sortea al inicio del bloque B y se escribe en el tablero. Unos 5 minutos por equipo. Los equipos que esperan siguen integrando. Recordar: mejor un flujo completo funcionando que cinco a medias.");
  }

  {
    const s = await D.lamina({ kicker: "B.8 · los atascos típicos de integrar", titulo: "Casi todo es un detalle olvidado", ic: "bicho", tituloSize: 27 });
    D.tabla(s, ["síntoma", "causa frecuente", "sesión donde se vio"], [
      ["La interfaz no ve el contrato", "Dirección o ABI viejos, o red distinta a la del despliegue.", "S12"],
      ["Cantidades enormes o minúsculas", "Olvidar parseUnits / formatUnits con los decimales del token.", "S10"],
      ["La transacción «no hace nada»", "No se espera tx.wait() y se lee el estado antes de que se mine.", "S12"],
      ["La imagen del NFT no aparece", "tokenURI con un CID mal fijado o sin gateway.", "S11"],
      ["Funcionaba y de repente no", "El proveedor RPC cortó por límite de tasa: clave propia en el keystore.", "S12"],
    ], { y: 1.9, h: 3.6, colW: [3.6, 6.393, 2.1], size: 11.5 });
    D.parrafo(s, "Por eso este bloque no es expositivo: el docente circula y resuelve los atascos reales, que casi nunca son conceptos nuevos.", { y: 5.7, h: 0.8, size: 13.5, color: C.ocre });
    s.addNotes("Tener a mano las guías de S10, S11 y S12 para remitir. Si un error se repite en varios equipos, parar 1 minuto y explicarlo a todos.");
  }

  await verificacion({
    kicker: "B.9 · cierre del bloque B",
    pregunta: "Ana firmó su asistencia en Sepolia para SU contrato. Beto copia la firma y la envía al contrato de su equipo, desplegado con el mismo código. ¿Pasa? ¿Y si la envía dos veces al contrato de Ana?",
    pistas: [
      "Qué campo del dominio distingue dos contratos con el mismo código.",
      "Qué prueba con ★ del laboratorio reproduce cada caso.",
      "Qué error exacto devuelve el contrato en cada uno.",
    ],
    notas: "Respuesta: al contrato de Beto no pasa, porque verifyingContract es otro y el resumen cambia: ECDSA recupera otra dirección y revierte FirmaInvalida (prueba ★ dominio de otro contrato). Al contrato de Ana, la primera vez se registra (Beto solo transporta; no gana nada: la asistencia es de Ana) y la segunda revierte InvalidAccountNonce (prueba ★ repetición). Remarcar que quien envía no importa: importa quien firma.",
  });

  /* ================================================================ C */
  {
    const s = await D.divisor({ letra: "C", titulo: "Entrega del Avance 1", sub: "La primera entrega grande del proyecto: contratos desplegados y verificados, pruebas con cobertura y un repositorio que otro puede correr.", minutos: "APROXIMADAMENTE 25 MINUTOS · 10 % DE LA NOTA FINAL", ic: "bandera" });
    s.addNotes("Todo lo del bloque C está en el documento público material/proyecto/02-avance-1 (HTML y PDF): qué se entrega, plantilla de README, lista de chequeo, rúbrica y las preguntas de la revisión técnica.");
  }

  {
    const s = await D.lamina({ kicker: "C.1 · qué se entrega", titulo: "Los tres componentes del Avance 1", ic: "documento", tituloSize: 28 });
    D.tabla(s, ["componente", "requisito verificable", "cómo se comprueba"], [
      ["Contratos en Sepolia", "Desplegados con Ignition y verificados: el código se lee en Etherscan.", "Enlace en el README; pestaña Contract con marca verde."],
      ["Suite de pruebas", "≥ 80 % de líneas en SUS contratos, con casos de reversión y límite.", "npx hardhat test --coverage en vivo."],
      ["Repositorio documentado", "README con la plantilla, sin secretos, reproducible desde cero.", "El docente clona y sigue el README."],
    ], { y: 1.9, h: 2.6, colW: [2.9, 5.2, 3.993], size: 11.5 });
    D.dosColumnas(s,
      { et: "Qué NO es el Avance 1", items: ["El frontend terminado: eso es el Avance 2 (S16).", "Cobertura de librerías de OpenZeppelin: cuentan sus contratos."] },
      { et: "Cómo se entrega", items: ["Enlace al repositorio y commit etiquetado avance-1.", "Formulario del curso, hoy antes de las 23:59."] },
      { y: 4.7, h: 2.02, size: 12 });
    s.addNotes("Fuente: plan de estudio, sección 8 (Avance 1, 10 %). La etiqueta de Git (git tag avance-1 && git push --tags) fija qué commit se revisa. ⚠ VERIFICAR ANTES DE DICTAR: la hora límite y el medio de entrega (formulario o plataforma institucional) los fija el docente; ajustar esta lámina y el documento público si cambian.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · cómo se califica", titulo: "Rúbrica del Avance 1", ic: "balanza", tituloSize: 29 });
    D.tabla(s, ["criterio", "peso", "excelente (5,0)", "insuficiente (< 3,0)"], [
      ["Contratos desplegados y verificados", "30 %", "Todos verificados, desplegados con Ignition, direcciones en el README.", "Sin desplegar o sin verificar."],
      ["Pruebas y cobertura", "35 %", "≥ 80 % de líneas; reversiones, límites y eventos probados.", "Menos de 60 % o solo casos felices."],
      ["Repositorio y README", "25 %", "Se instala y prueba siguiendo el README; sin secretos; Slither documentado.", "No arranca o contiene claves."],
      ["Revisión técnica en vivo", "10 %", "Los tres integrantes responden con solvencia.", "Nadie sabe explicar su código."],
    ], { y: 1.9, h: 3.8, colW: [3.0, 1.0, 4.4, 3.693], size: 11 });
    D.parrafo(s, "La columna «aceptable (3,5)» y el detalle de cada nivel están en el documento del Avance 1. Una clave privada en el repositorio anula el criterio de repositorio.", { y: 5.9, h: 0.8, size: 13, color: C.ocre });
    s.addNotes("La rúbrica deriva de la rúbrica final del plan (sección 8): 'Pruebas y despliegue' y 'Sustentación y documentación'. Anunciar que la revisión técnica es individual dentro del equipo: se le puede preguntar a cualquiera.");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · la revisión técnica, pública", titulo: "Las preguntas que hará el docente", ic: "lupa", tituloSize: 28 });
    D.lista(s, [
      "Muéstrenme el contrato verificado en Etherscan. ¿Qué hace esta función, línea por línea?",
      "Corran la cobertura ahora. ¿Qué línea NO está cubierta y por qué aceptan ese riesgo?",
      "Enséñenme una prueba que espere una reversión. ¿Qué error personalizado verifica?",
      "¿Qué dijo Slither y qué hicieron con cada hallazgo?",
      "Si clono el repo ahora, ¿qué comando corro primero? ¿Dónde están las claves?",
      "¿Qué parte de su proyecto NO está descentralizada, y lo dice el README?",
    ], { y: 1.9, h: 3.6, size: 13.5, gap: 8, numerada: true });
    D.parrafo(s, "No es un examen sorpresa: la lista completa está publicada. Prepárenla. Cualquiera de los tres puede ser preguntado.", { y: 5.7, h: 0.8, size: 14, color: C.ocre });
    s.addNotes("Son seis de las doce preguntas del documento público (material/proyecto/02-avance-1). Registrar las respuestas en la hoja de revisión del docente. 5 minutos por equipo como máximo.");
  }

  {
    const s = await D.lamina({ kicker: "C.4 · antes de entregar", titulo: "La lista de chequeo en cinco minutos", ic: "voto", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "Código y pruebas", items: ["npx hardhat test pasa completo en un clon limpio.", "Cobertura ≥ 80 % de líneas en sus contratos.", "Al menos una prueba por cada error personalizado.", "Slither corrido; hallazgos anotados en docs/SEGURIDAD.md."] },
      { et: "Despliegue y repositorio", items: ["Direcciones de Sepolia en el README, con enlace verificado.", "package-lock.json incluido; .gitignore correcto.", "git log sin claves ni .env; keystore para todo secreto.", "Etiqueta avance-1 empujada al remoto."] },
      { y: 1.9, h: 3.2, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La prueba del README", x: M, y: 5.35, w: CW, h: 1.37, texto: "Uno de los tres clona el repositorio en una carpeta nueva y sigue el README sin ayuda de los otros dos. Si se detiene en algún paso, el README no está listo. Háganlo antes de entregar, no después.", size: 13 });
    s.addNotes("La lista completa (más larga) está en el documento del Avance 1. Dar los últimos minutos para que cada equipo la recorra y etiquete el commit.");
  }

  await D.preguntaSemana({
    pregunta: "¿Qué pieza de hoy —indexación, ENS, EIP-712, SIWE o abstracción de cuentas— le haría más bien a su proyecto, y qué costo o centralización agrega?",
    trabajo: [
      "Entregar el Avance 1 (contratos verificados, cobertura ≥ 80 %, README) con la etiqueta avance-1.",
      "Laboratorio 13: evidencia de Sepolia y respuestas de la guía, por el canal del curso.",
      "Leer para la Sesión 14: qué es un AMM (x · y = k) y qué fue el colapso de UST/Terra.",
      "Seguir el frontend: el Avance 2 (dApp integrada) se entrega en la Sesión 16.",
    ],
    notas: "La pregunta de la semana se retoma en la apertura de la S14. Respuesta esperada: no hay una única correcta; se evalúa que nombren el costo (p. ej. SIWE agrega un backend de sesión; un subgrafo depende de Studio; un paymaster tiene que financiarse).",
  });

  {
    const s = await D.cierre({
      frase: "Una demo necesita un contrato y una pantalla. Un producto necesita todo lo que hay en medio.",
      sub: "Con el Avance 1 cierra la Unidad III. La Unidad IV mira el ecosistema: DeFi, gobernanza, escalabilidad y la ley.",
      proxima: "Sesión 14 · DeFi · AMM, préstamos, stablecoins, oráculos y sus riesgos",
    });
    s.addNotes("Cerrar recordando la entrega de hoy y que la S14 tiene laboratorio en Hardhat (mini-AMM y oráculo de Chainlink en Sepolia): traer el keystore funcionando.");
  }

  return D.guardar(path.join(__dirname, "Sesion-13-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
