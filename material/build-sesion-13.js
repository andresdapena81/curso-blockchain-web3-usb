/* =====================================================================
   Sesión 13 · Integración full-stack e infraestructura del ecosistema
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 13 · INTEGRACIÓN FULL-STACK", titulo: "Sesión 13 · Integración full-stack" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 13 · UNIDAD III · CIERRE",
    titulo: "CERRAR EL\nCÍRCULO DE\nLA dAPP",
    sub: "Contratos, interfaz y almacenamiento, funcionando juntos. Más las piezas que hacen usable una dApp de verdad.",
    palabra: "INTEGRAR",
    ic: "capas",
    notas: "Cierra la Unidad III. La mitad de la sesión es integración asistida equipo por equipo; al final se entrega el Avance 1.",
  });

  await D.agenda({
    intro: "Menos conceptos nuevos, más integración. El objetivo real de hoy: que cada equipo tenga su dApp de punta a punta para el Avance 1.",
    bloques: [
      ["A", "INFRAESTRUCTURA DEL ECOSISTEMA", "Indexación, ENS, firmas EIP-712, abstracción de cuentas y hosting.", "~55 min"],
      ["B", "INTEGRACIÓN ASISTIDA", "Cada equipo conecta contratos + frontend + IPFS. El docente circula.", "~65 min"],
      ["C", "ENTREGA DEL AVANCE 1", "Revisión técnica equipo por equipo.", "~40 min"],
    ],
  });

  await D.objetivo({
    objetivo: "Cerrar el ciclo de la dApp e incorporar los servicios de infraestructura que la hacen usable a escala.",
    preguntas: [
      "¿Por qué consultar la cadena directamente no escala, y qué se usa en su lugar?",
      "¿Cómo se reemplaza una dirección hexadecimal por un nombre legible?",
      "¿Cómo se inicia sesión sin contraseña, con una firma?",
      "¿Qué promete la abstracción de cuentas para la adopción?",
    ],
    ra: "RA4 · despliegue e infraestructura  ·  RA6 · integración full-stack.",
  });

  await D.glosario({
    items: [
      ["The Graph", "protocolo de indexación", "Indexa eventos de contratos en un «subgrafo» consultable con GraphQL. Evita recorrer la cadena."],
      ["Subgrafo", "subgraph", "La definición de qué eventos indexar y cómo, que The Graph ejecuta por ti."],
      ["ENS", "Ethereum Name Service", "Nombres legibles (ana.eth) que apuntan a direcciones hexadecimales."],
      ["EIP-712", "datos estructurados firmados", "Un estándar para firmar mensajes legibles, no solo transacciones. Base de SIWE y Permit."],
      ["SIWE", "Sign-In with Ethereum", "Iniciar sesión firmando un mensaje, sin contraseña ni servidor de cuentas."],
      ["ERC-4337", "Account Abstraction", "Billeteras que son contratos: recuperación social, pagos patrocinados, reglas propias."],
      ["Gas patrocinado", "sponsored gas", "Que otro pague el gas del usuario, para que no necesite ETH para empezar."],
      ["Gateway IPFS", "puerta IPFS", "Un servidor que sirve contenido de IPFS por HTTP, para navegadores que no hablan IPFS nativo."],
    ],
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "Infraestructura del ecosistema", sub: "Un contrato y una interfaz bastan para una demo. Para una aplicación que use gente de verdad, faltan piezas.", minutos: "APROXIMADAMENTE 55 MINUTOS", ic: "capas" });

  {
    const s = await D.lamina({ kicker: "A.1 · el problema de leer la cadena", titulo: "Consultar directamente no escala", ic: "grafico", tituloSize: 26 });
    D.parrafo(s, "La interfaz de la Sesión 12 leía un saldo: una llamada, instantánea. Pero, ¿y «todas las transferencias de esta cuenta en el último año», o «los diez NFT más recientes»?", { y: 1.9, h: 0.9, size: 14.5 });
    D.dosColumnas(s,
      { et: "Leer la cadena a mano", linea: C.rojo, color: C.rojo, texto: "Habría que recorrer bloque por bloque buscando eventos. Miles de bloques, cada uno una consulta. Lento, caro en llamadas al RPC, e imposible de ordenar o filtrar bien." },
      { et: "Indexar con The Graph", texto: "Un servicio escucha los eventos del contrato a medida que ocurren y los guarda en una base consultable. La interfaz pregunta «dame las transferencias de Ana, ordenadas por fecha» en una consulta." },
      { y: 2.95, h: 2.5, size: 13 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Por qué los eventos vuelven a importar", x: M, y: 5.55, w: CW, h: 1.15, texto: "The Graph indexa EVENTOS (Sesión 6). Un contrato que no emite eventos bien pensados es casi imposible de indexar. Diseñar buenos eventos es diseñar para que la interfaz pueda leer.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.2 · alternativa ligera", titulo: "No todo proyecto necesita The Graph", ic: "balanza", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "The Graph / subgrafo", texto: "Potente, pensado para volumen y consultas complejas. Tiene curva de aprendizaje y, en producción, costo. Vale la pena cuando hay muchos datos y muchas consultas." },
      { et: "Leer logs de eventos", texto: "Para un proyecto de curso, ethers puede consultar los eventos de un contrato con queryFilter y un rango de bloques. Simple, suficiente, sin infraestructura extra." },
      { y: 1.9, h: 2.5, size: 13 });
    D.codigo(s, `// alternativa ligera con ethers: leer eventos pasados
const filtro = contrato.filters.Transfer(null, cuenta);
const eventos = await contrato.queryFilter(filtro, bloqueInicio, "latest");`, { x: M, y: 4.6, w: CW, h: 1.3, lang: "js", size: 12 });
    D.parrafo(s, "Regla del curso: usar la pieza más simple que resuelva. The Graph si de verdad hace falta; queryFilter si basta.", { y: 6.05, h: 0.55, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.3 · nombres legibles", titulo: "ENS: de 0x732805… a ana.eth", ic: "termino", tituloSize: 28 });
    D.parrafo(s, "Una dirección hexadecimal es imposible de verificar a ojo y fácil de confundir. ENS mapea nombres legibles a direcciones, como el DNS mapea dominios a IP.", { y: 1.9, h: 0.9, size: 14.5 });
    D.definicion(s, "ana.eth   →   0x732805FbE544F6117B755512f2029e3e8B6aa135", { x: M, y: 2.95, w: CW, h: 0.65, size: 13 });
    D.dosColumnas(s,
      { et: "Para qué sirve", items: ["Enviar a ana.eth en vez de copiar 42 caracteres.", "Mostrar nombres en la interfaz en vez de direcciones.", "Un perfil: avatar, redes, todo bajo un nombre."] },
      { et: "El matiz de seguridad", items: ["Un nombre parecido puede engañar (una letra distinta).", "Resolverlo es una lectura: verificar a dónde apunta.", "No todo el mundo tiene un nombre ENS."] },
      { y: 3.75, h: 2.05, size: 12.5 });
    D.parrafo(s, "En el proyecto es opcional y suma: mostrar ana.eth en vez de 0x73… hace la interfaz mucho más humana.", { y: 5.9, h: 0.55, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.4 · firmar sin gastar", titulo: "EIP-712: firmar mensajes legibles", ic: "documento", tituloSize: 28 });
    D.parrafo(s, "Firmar no es solo para transacciones. Se puede firmar un MENSAJE —gratis, sin gas— y que un contrato o un servidor verifique después quién lo firmó. EIP-712 lo hace legible en la billetera.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "Firma cruda (mala UX)", linea: C.rojo, color: C.rojo, texto: "La billetera muestra un montón de bytes hexadecimales. El usuario firma sin entender qué. Peligroso: podría estar firmando cualquier cosa." },
      { et: "EIP-712 (buena UX)", texto: "La billetera muestra campos legibles: «Autorizas ingresar a MiApp a las 10:32, dominio miapp.com». El usuario ve qué firma. Es la base de Permit (S10) y de SIWE." },
      { y: 3.05, h: 2.3, size: 13 });
    D.parrafo(s, "La firma se hace fuera de la cadena, así que no cuesta gas. Solo cuesta si después se ENVÍA a un contrato que la use.", { y: 5.5, h: 0.6, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.5 · login sin contraseña", titulo: "Sign-In with Ethereum", ic: "llave", tituloSize: 29 });
    D.pasos(s, [
      ["EL SERVIDOR PIDE", "Manda un mensaje con un número de un solo uso (nonce): «Inicia sesión en MiApp, nonce 8821»."],
      ["EL USUARIO FIRMA", "Con su billetera, en formato EIP-712. Gratis, sin gas."],
      ["EL SERVIDOR VERIFICA", "Recupera la dirección de la firma (la criptografía de la S3). Si coincide, hay sesión."],
      ["SIN CONTRASEÑAS", "No hay contraseña que robar ni base de datos de cuentas que filtrar. La identidad es la clave."],
    ], { y: 1.9, alto: 0.78, gap: 0.12, anchoEt: 3.0, size: 12.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Por qué es elegante", x: M, y: 5.82, w: CW, h: 0.92, texto: "Es la firma digital de la Sesión 3 puesta a autenticar: el nonce de un solo uso impide reusarla.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.6 · billeteras que son contratos", titulo: "Abstracción de cuentas (ERC-4337)", ic: "escudo", tituloSize: 27 });
    D.parrafo(s, "Hoy una cuenta externa es «una clave, una cuenta»: si pierdes la frase, pierdes todo, y necesitas ETH para tu primera transacción. La abstracción de cuentas convierte la billetera en un contrato programable.", { y: 1.9, h: 0.95, size: 14 });
    D.tabla(s, ["capacidad", "qué resuelve"], [
      ["Recuperación social", "Recuperar el acceso con la ayuda de contactos de confianza, sin frase semilla única."],
      ["Gas patrocinado", "Que la app pague el gas del usuario: se puede empezar sin tener ETH."],
      ["Transacciones por lotes", "Aprobar y usar en una sola confirmación (adiós al doble paso de S10)."],
      ["Reglas propias", "Límites de gasto, firmas múltiples, sesiones temporales."],
    ], { y: 3.0, h: 2.8, colW: [3.2, 8.893], size: 12 });
    D.parrafo(s, "Por qué importa para la adopción: elimina las dos barreras que más asustan al usuario nuevo: la frase semilla y «necesitas ETH para empezar».", { y: 5.95, h: 0.6, size: 12.5, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.7 · dónde vive el frontend", titulo: "Hosting: normal o descentralizado", ic: "red", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "Hosting tradicional", texto: "El frontend en un servidor normal (Vercel, Netlify, un servidor propio). Fácil, rápido, gratis para empezar. Pero es el punto centralizado que discutimos en la Sesión 12: si cae, la dApp deja de ser accesible." },
      { et: "IPFS + ENS", texto: "Subir el frontend a IPFS y apuntarle un nombre ENS. Entonces ni la interfaz depende de un servidor: se sirve de la red. Más fiel a la idea de Web3, más trabajo de montar." },
      { y: 1.9, h: 2.6, size: 13 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Decisión honesta para el proyecto", x: M, y: 4.7, w: CW, h: 2.0, texto: "Para el curso, hosting normal está bien: el foco es la lógica, no la infraestructura. Pero el README del proyecto debería decir explícitamente qué partes quedan centralizadas y cómo se descentralizarían en una versión real. Reconocer el límite vale más que fingir que no existe — el criterio de honestidad de todo el curso.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.8 · buenas prácticas de repo", titulo: "Un repositorio que otro pueda correr", ic: "documento", tituloSize: 27 });
    D.lista(s, [
      "README con qué hace, cómo instalar, cómo correr las pruebas y cómo desplegar — en pasos que funcionen de verdad.",
      "Las direcciones de los contratos desplegados, con enlace al explorador.",
      "Ningún secreto: ni claves, ni .env, ni URLs con API key (Sesión 8).",
      "package-lock.json incluido, para que las versiones sean reproducibles.",
      "Instrucciones para levantar el frontend y conectarlo a los contratos.",
      "Una nota honesta de qué está descentralizado y qué no.",
    ], { y: 1.9, h: 3.5, size: 13.5, gap: 8 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La prueba del README", x: M, y: 5.55, w: CW, h: 1.15, texto: "¿Podría otra persona clonar el repo, seguir el README y llegar a la dApp funcionando, sin preguntarles nada? Si no, el README no está listo.", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.9 · lo que hay que llevarse del bloque A", titulo: "Seis piezas de infraestructura", ic: "lista", tituloSize: 28 });
    const ideas = [
      "Leer la cadena a mano no escala: se indexa con The Graph, o con queryFilter si basta.",
      "Los eventos bien diseñados son lo que hace indexable un contrato.",
      "ENS pone nombres legibles sobre las direcciones.",
      "EIP-712 firma mensajes legibles, gratis, y habilita el login sin contraseña.",
      "La abstracción de cuentas quita las dos barreras del usuario nuevo: la frase y el ETH inicial.",
      "Un repo listo es el que otro puede correr siguiendo el README, sin preguntar.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Integración asistida", sub: "El bloque menos expositivo del curso: cada equipo junta sus piezas y el docente circula resolviendo los atascos reales.", minutos: "APROXIMADAMENTE 65 MINUTOS · EN EQUIPOS", ic: "martillo" });

  {
    const s = await D.lamina({ kicker: "B.1 · el objetivo del taller", titulo: "Una dApp de punta a punta", ic: "capas", tituloSize: 28 });
    D.pasos(s, [
      ["CONECTAR", "El frontend habla con los contratos desplegados en Sepolia."],
      ["LEER", "La interfaz muestra al menos un dato real leído de la cadena."],
      ["ESCRIBIR", "La interfaz ejecuta al menos una transacción, con sus estados."],
      ["METADATA", "Si el proyecto usa NFTs, la metadata se sirve desde IPFS."],
      ["FIRMA (opcional)", "Login por firma EIP-712, si el proyecto lo aprovecha."],
    ], { y: 1.9, alto: 0.82, gap: 0.12, anchoEt: 2.4, size: 12.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "El corte vertical, otra vez", x: M, y: 6.02 - 0.1, w: CW, h: 0.86, texto: "Mejor UN flujo completo funcionando de punta a punta que cinco a medias. Es la lección del proyecto del docente.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · los atascos típicos", titulo: "Lo que suele romperse al integrar", ic: "bicho", tituloSize: 27 });
    D.tabla(s, ["síntoma", "causa frecuente"], [
      ["La interfaz no ve el contrato", "Dirección o ABI equivocados, o red distinta a la del despliegue."],
      ["Las cantidades salen enormes o minúsculas", "Olvidar parseUnits / formatUnits: unidades mínimas vs. tokens (S10)."],
      ["La transacción «no hace nada»", "No se espera tx.wait(); se lee el estado antes de que se mine (S12)."],
      ["La imagen del NFT no aparece", "El tokenURI apunta a un CID mal fijado, o falta la puerta IPFS."],
      ["Todo funcionaba y de repente no", "El proveedor RPC alcanzó su límite de tasa: usar clave propia."],
    ], { y: 1.9, h: 3.5, colW: [4.3, 7.793], size: 11.5 });
    D.parrafo(s, "Casi ningún atasco de integración es un concepto nuevo: es un detalle de una sesión anterior que se olvidó. Por eso el docente circula en vez de exponer.", { y: 5.6, h: 0.65, size: 13, color: C.ocre });
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "Entrega del Avance 1", sub: "La primera entrega grande del proyecto: contratos, pruebas, despliegue y frontend, revisados en vivo.", minutos: "APROXIMADAMENTE 40 MINUTOS · 10 % DE LA NOTA", ic: "bandera" });

  {
    const s = await D.lamina({ kicker: "C.1 · qué se entrega", titulo: "La lista del Avance 1", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["componente", "requisito"], [
      ["Contratos", "Desplegados y verificados en Sepolia, con al menos dos patrones aplicados."],
      ["Pruebas", "Suite automatizada con cobertura ≥ 80 % de líneas."],
      ["Seguridad", "Slither pasado; hallazgos críticos, atendidos o justificados."],
      ["Frontend", "Conecta la billetera, lee un dato y ejecuta una transacción, con los 4 estados."],
      ["Metadata", "En IPFS, si el proyecto usa NFTs."],
      ["Repositorio", "Documentado: otro puede clonarlo y correrlo con el README."],
    ], { y: 1.9, h: 3.6, colW: [2.6, 9.493], size: 12 });
    D.parrafo(s, "Peso: 10 % de la nota final. Se revisa equipo por equipo hoy; lo que falte, se cierra por el canal del curso con fecha.", { y: 5.65, h: 0.55, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "C.2 · la revisión técnica", titulo: "Qué pregunta el docente en cada equipo", ic: "lupa", tituloSize: 28 });
    D.lista(s, [
      "Muéstrenme una transacción real en el explorador. ¿Qué hizo?",
      "¿Qué pasa si rechazo la firma en la billetera? (los cuatro estados)",
      "¿Cuánta cobertura tienen, y qué línea NO está cubierta?",
      "¿Qué dijo Slither, y qué hicieron con eso?",
      "¿Qué parte de su dApp no está descentralizada?",
      "Si clono su repo ahora, ¿arranca solo con el README?",
    ], { y: 1.9, h: 3.3, size: 13.5, gap: 8, numerada: true });
    D.parrafo(s, "No es un examen sorpresa: son exactamente los criterios de la rúbrica del proyecto. Quien construyó bien, responde sin esfuerzo.", { y: 5.5, h: 0.6, size: 13, color: C.ocre });
  }

  await D.preguntaSemana({
    pregunta: "¿Cuál de las piezas de infraestructura de hoy —indexación, ENS, firma, abstracción de cuentas— le haría MÁS bien a su proyecto? Elijan una y justifiquen.",
    trabajo: [
      "Cerrar lo que haya quedado pendiente del Avance 1.",
      "Leer sobre DeFi para la Sesión 14: AMM, pérdida impermanente y stablecoins.",
      "Empezar a pensar el ensayo individual (RA7): se plantea formalmente en la Sesión 15.",
    ],
  });

  await D.cierre({
    frase: "Una demo necesita un contrato y una pantalla. Un producto necesita todo lo que hay en medio.",
    sub: "Con el Avance 1 cierra la Unidad III: ya construyeron una dApp completa. La Unidad IV mira el ecosistema alrededor: DeFi, gobernanza, escalabilidad y la ley.",
    proxima: "Sesión 14 · DeFi · finanzas descentralizadas y sus riesgos",
  });

  return D.guardar(path.join(__dirname, "Sesion-13-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
