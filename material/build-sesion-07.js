/* =====================================================================
   Sesión 07 · Leer un contrato que no escribiste
   =====================================================================
   El salto de la S6 a la S7 es de ESCRIBIR a LEER. El método —las cuatro
   pasadas— se aplica EN VIVO sobre el contrato del proyecto del docente
   (material/laboratorios-evm/contracts/s07/Entradas.sol, 254 líneas,
   publicado en github.com/andresdapena81/entradas-reventa-controlada) y
   después cada equipo lo aplica a su propio contrato, el que expone en la
   Sesión 8.

   Los patrones que el plan pide para la S7 (herencia, immutable/constant,
   struct + mapping, errores personalizados, patrón de retiro, CEI, gas)
   se enseñan LEYENDO ese contrato, no en abstracto.

   CLÍMAX DEL BLOQUE B: preparando la sesión se encontró una vulnerabilidad
   REAL en el contrato del docente. `comprarReventa` abría la compuerta
   `_transferenciaAbierta` y la cerraba al volver, así que el aviso al
   receptor (`onERC721Received`) corría con la compuerta abierta y un
   comprador que fuera un contrato podía sacar otra entrada suya sin pasar
   por el tope. Se corrigió moviendo el cierre DENTRO de `_update`: la
   compuerta quedó de un solo uso. El laboratorio explota la versión
   publicada (`EntradasVulnerable.sol`) y comprueba la corregida.

   CIFRAS DE GAS: todas medidas el 7-oct-2026 en copia aislada del proyecto
   (Hardhat 3.16.0, solc 0.8.34, evm target osaka, optimizador en 200), con
   recibos reales de cada transacción sobre la red local. El camino medido
   fue desplegar → dos comprar() → ponerEnVenta() → comprarReventa() → dos
   retirar(), sobre tres contratos: Entradas (corregida), EntradasVulnerable
   y una copia idéntica SIN la compuerta ni el gancho _update, para aislar
   lo que cuesta hacer cumplir la regla y lo que cuesta la corrección.

       función            CORREGIDA   VULNERABLE   SIN COMPUERTA
       despliegue           1889937      1889085         1866810
       comprar (1.ª)         117309       117335          117054
       comprar (2.ª)          83109        83135           82854
       ponerEnVenta           72090        72090           72090
       comprarReventa         81839        81678           64976
       retirar                30023        30023           30023
       transferFrom directo REVIERTE     REVIERTE           59877

   Tamaño del código: 7 999 bytes la corregida, 7 995 la vulnerable.

   Las 15 pruebas de test/s07/AtaqueAlTope.test.js (11) y
   test/s07/CompuertaAbierta.test.js (4) se verificaron en verde en la
   misma corrida.
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({
    pie: "SESIÓN 07 · LEER UN CONTRATO QUE NO ESCRIBISTE",
    titulo: "Sesión 07 · Leer un contrato que no escribiste",
  });
  const { C, F, M, CW } = D;

  /* ---------- ayudantes locales ---------- */

  /* Lámina de pregunta de verificación (cierre de bloque) */
  async function verificacion({ kicker, titulo, preguntas, notas }) {
    const s = await D.lamina({ kicker, titulo, ic: "pregunta", tituloSize: 27 });
    D.parrafo(s, "Respondan en parejas, sin mirar las láminas. Si alguna no sale en un minuto, esa es la lámina que hay que volver a ver.", { y: 1.85, h: 0.6, size: 13.5 });
    preguntas.forEach((p, i) => {
      const y = 2.6 + i * 1.02;
      D.caja(s, { x: M, y, w: CW, h: 0.88, fill: i % 2 ? C.superf : C.blanco, sombra: false, lw: 1.25, line: C.grisClaro });
      s.addText(String(i + 1).padStart(2, "0"), { x: M + 0.15, y, w: 0.7, h: 0.88, fontFace: F.display, fontSize: 18, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, p, { x: M + 0.95, y: y + 0.08, w: CW - 1.15, h: 0.72, size: 13, valign: "middle", ls: 1.12 });
    });
    s.addNotes(notas);
    return s;
  }

  /* Pregunta abierta a pantalla completa. La respuesta va en la lámina siguiente. */
  async function pregunta({ kicker, texto, pista, notas }) {
    const s = await D.lamina({ kicker, titulo: "Pregunta", ic: "pregunta", tituloSize: 30 });
    D.enunciado(s, texto, { y: 2.3, h: 2.3, size: 21, line: C.naranja });
    if (pista) D.parrafo(s, pista, { y: 4.9, h: 0.8, size: 14, color: C.gris, align: "center" });
    s.addNotes(notas);
    return s;
  }

  /* ================================================================
     APERTURA · 5 minutos
     ================================================================ */

  await D.portada({
    kicker: "SESIÓN 07 · UNIDAD II · ETHEREUM Y CONTRATOS",
    titulo: "LEER UN\nCONTRATO QUE\nNO ESCRIBISTE",
    sub: "Si no puedes responder las cuatro pasadas sobre tu propio contrato, ese contrato todavía no es tuyo.",
    palabra: "LEER",
    ic: "lupa",
    notas: "Apertura (2 min). La sesión pasada escribimos un contrato desde cero, en vivo, y se rompió cinco veces. Hoy se hace lo contrario, que es lo que de verdad van a hacer toda la vida profesional: alguien les pasa un contrato y tienen que decidir si confían en él. Decir en voz alta la frase de la portada y dejarla ahí: es la vara de la sesión y la de la defensa de la S8. No hay moralina sobre la IA: hay un método y una vara. Y adelantar, sin dar detalles, que ese método encontró esta semana un hueco real en el contrato del propio docente.",
  });

  await D.agenda({
    intro: "Cinco minutos de apertura, tres bloques y una pausa de 10 minutos entre B y C. Hoy no se escribe un contrato nuevo: se lee uno ajeno, se intenta romper —y se rompe— y después cada equipo lee el suyo.",
    bloques: [
      ["A", "EL CASO Y LAS CUATRO PASADAS", "El problema de la reventa, el contrato del docente pieza por pieza con sus decisiones de diseño, y después el método: qué promete, quién manda, el dinero, qué pasa si…", "~75 min"],
      ["B", "LABORATORIO DE ATAQUE", "Un encargo de una línea: revendan una entrada por encima del tope. Seis ataques, una vulnerabilidad real y los cinco tipos que hay detrás.", "~60 min"],
      ["C", "SU PROPIO CONTRATO", "Las cuatro pasadas aplicadas al contrato del proyecto, aquí, con la ficha de lectura en la mano.", "~30 min"],
    ],
    notas: "5 + 75 + 60 + 10 de pausa + 30 = 180 minutos. El bloque A trae primero el caso y el contrato entero (A.1, nueve láminas) y después las cuatro pasadas: está pensado para poder dictarse sin haber estudiado el contrato de antemano, leyendo las láminas en orden. Si algo se alarga, se recorta del bloque A (las láminas de gas y de errores se pueden dejar para la guía), nunca del clímax del bloque B ni del bloque C: los equipos exponen en la S8 y la ficha de lectura se llena HOY, en el salón, con el docente disponible. Avisar ya que el laboratorio de la subasta pasa a trabajo autónomo y sigue siendo evidencia evaluable.",
  });

  await D.objetivo({
    objetivo: "Leer un contrato ajeno con método, encontrar lo que su autor no dijo, y defender el contrato del proyecto propio.",
    preguntas: [
      "¿Qué promete un contrato, leyendo solo los nombres de sus funciones y eventos?",
      "¿Quién manda adentro, y qué es exactamente lo que NO puede hacer?",
      "¿Por dónde entra el dinero, dónde se queda y por dónde sale?",
      "¿Qué regla hace cumplir de verdad, y dónde termina su poder?",
    ],
    ra: "RA3 · patrones y estándares (se evalúa)  ·  RA5 · base de la seguridad (complementario, se profundiza en la S9)",
    notas: "1 minuto. Leer las cuatro en voz alta y pedir que las escriban: son las cuatro pasadas, y son exactamente las cuatro secciones de la ficha de lectura del bloque C. La cuarta es la que más cuesta y la única que no se puede responder leyendo: hay que correr código, y eso es el bloque B.",
  });

  await D.glosario({
    items: [
      ["las cuatro pasadas", "el método de hoy", "Qué promete · quién manda · por dónde el dinero · qué pasa si. En ese orden, sin saltarse ninguna."],
      ["gancho · hook", "función interna que se reemplaza", "Un punto del padre por el que pasa siempre cierta operación. Sobreescribirlo cambia la regla para todas."],
      ["ERC-721", "estándar de token no fungible", "Cada entrada es un token con dueño. OpenZeppelin trae la implementación: aquí se hereda, no se copia."],
      ["aviso al receptor", "onERC721Received", "Al recibir un token, si el receptor es un contrato se ejecuta SU código. Hoy eso tiene consecuencias."],
      ["compuerta", "bandera que habilita un paso", "Una variable que una sola función abre, por un instante, y cierra. Hoy aparece una, y hubo que corregirla."],
      ["error personalizado", "revert con datos adentro", "revert PrecioSobreTope(tope, pedido): dice qué pasó y con qué números. Más barato que una cadena."],
      ["CEI", "Checks-Effects-Interactions", "Validar, cambiar el estado propio y, solo al final, llamar hacia fuera."],
      ["patrón de retiro", "acreditar en vez de enviar", "El contrato anota el saldo y cada quien llama retirar(). Nadie depende de que un envío ajeno funcione."],
    ],
    notas: "2 minutos. No leer todas: señalar «gancho», «aviso al receptor» y «compuerta», que son las tres palabras nuevas y la clave del bloque B. No explicar todavía cuál es el gancho ni dónde está la compuerta: eso se descubre corriendo el ataque. Si alguien pregunta qué hubo que corregir, contestar que se verá a las dos horas.",
  });

  /* ================================================================
     BLOQUE A · 55 minutos
     ================================================================ */

  {
    const s = await D.divisor({
      letra: "A", titulo: "Leer un contrato que no escribiste",
      sub: "Cuatro pasadas, en orden, sobre un contrato real de 254 líneas. En pantalla, en vivo, y sin que nadie lo haya escrito en esta clase.",
      minutos: "APROXIMADAMENTE 75 MINUTOS · EN VIVO",
      ic: "lupa",
    });
    s.addNotes("Transición (30 s). Abrir el archivo real en el editor y dejarlo en pantalla todo el bloque: material/laboratorios-evm/contracts/s07/Entradas.sol. El deck acompaña; el protagonista es el archivo. Decirles que no tomen apuntes del contrato: tomen apuntes del MÉTODO, porque el método se lo van a aplicar a su contrato en el bloque C. Importante para el docente: en este bloque NO se abre _update. Esa función se reserva para el bloque B.");
  }

  {
    const s = await D.lamina({ kicker: "A.0 · el método", titulo: "Cuatro pasadas, en este orden", ic: "lista", tituloSize: 29 });
    D.parrafo(s, "Nadie lee un contrato de corrido y entiende. Se lee cuatro veces, y cada vez se busca una sola cosa. Saltarse una pasada es la forma más común de creer que se entendió.", { y: 1.85, h: 0.55, size: 14 });
    D.pasos(s, [
      ["¿QUÉ PROMETE?", "Solo los nombres: funciones públicas y eventos. Sin entrar a ningún cuerpo."],
      ["¿QUIÉN MANDA?", "Las direcciones privilegiadas. Qué puede cada una y, sobre todo, qué NO puede."],
      ["¿Y EL DINERO?", "Por dónde entra, dónde se queda mientras está adentro y por dónde sale."],
      ["¿QUÉ PASA SI…?", "La pasada del adversario. Es la única que no se responde leyendo, y abre el bloque B."],
    ], { y: 2.5, alto: 0.68, gap: 0.08, anchoEt: 3.0, size: 12.5 });
    await D.ficha(s, {
      tipo: "pregunta", etiqueta: "La vara de hoy, y la de la Sesión 8",
      x: M, y: 5.64, w: CW, h: 1.15,
      texto: "Si no pueden responder las cuatro pasadas sobre su propio contrato, ese contrato todavía no es suyo. Da igual quién escribió las líneas.",
      size: 13,
    });
    s.addNotes("3 minutos. Las cuatro preguntas son las mismas de la lámina de objetivo: eso es a propósito. Decir que el orden importa: si se empieza por «qué pasa si», se inventan amenazas que el contrato no tiene; si se empieza por los nombres, las amenazas aparecen solas. Anunciar que la ficha de lectura del bloque C tiene exactamente estas cuatro secciones, y que este método no es una invención del curso: es lo que hace cualquier auditoría antes de abrir una herramienta.");
  }

  {
    const s = await D.lamina({ kicker: "A.0 · el paciente", titulo: "El contrato que vamos a leer hoy", ic: "documento", tituloSize: 28 });
    D.enunciado(s, "La regla de reventa deja de ser un término y condiciones: pasa a ser algo que no se puede incumplir.", { y: 1.85, h: 1.0, size: 16, line: C.violeta });
    const yN = 3.05, hN = 1.0, wN = 3.7, g = 0.4965;
    D.nodo(s, { x: M, y: yN, w: wN, h: hN, titulo: "ORGANIZADOR · owner", sub: "asignarValidador\nretirar el recaudo", fill: C.blanco, line: C.tinta, subSize: 10.5 });
    D.nodo(s, { x: M + wN + g, y: yN, w: wN, h: hN, titulo: "ASISTENTES", sub: "comprar · ponerEnVenta\nquitarDeVenta · comprarReventa · retirar", fill: C.blanco, line: C.tinta, subSize: 10.5 });
    D.nodo(s, { x: M + 2 * (wN + g), y: yN, w: wN, h: hN, titulo: "VALIDADOR DE PUERTA", sub: "esValida (0 gas)\nmarcarUsada", fill: C.blanco, line: C.tinta, subSize: 10.5 });
    const c1 = M + wN / 2, c2 = M + wN + g + wN / 2, c3 = M + 2 * (wN + g) + wN / 2;
    D.linea(s, c1, 4.05, c1, 4.37, C.tinta, 1.5);
    D.linea(s, c2, 4.05, c2, 4.37, C.tinta, 1.5);
    D.linea(s, c3, 4.05, c3, 4.37, C.tinta, 1.5);
    D.linea(s, c1, 4.37, c3, 4.37, C.tinta, 1.5);
    D.flecha(s, c2, 4.37, c2, 4.62, C.naranja, 2.25);
    D.nodo(s, { x: c2 - 3.55, y: 4.65, w: 7.1, h: 0.95, titulo: "CONTRATO  Entradas", sub: "ERC-721 · 254 líneas · transferencia directa BLOQUEADA", fill: C.tinta, line: C.naranja, color: C.naranja, subColor: "B9B4C4", subSize: 11 });
    D.parrafo(s, "Es la entrega 2 del proyecto del docente, publicada en github.com/andresdapena81/entradas-reventa-controlada. Hoy es el paciente: se lee en pantalla y no se toca.", { y: 5.75, h: 0.55, size: 12.5, color: C.gris });
    s.addNotes("3 minutos. Contar el problema en dos frases: las entradas se revenden a cuatro veces su precio y los términos y condiciones no lo impiden porque nadie los hace cumplir. Este contrato intenta que la regla se cumpla sola. Señalar los tres actores del diagrama y decir que la pasada 2 va a mirar con lupa al de la derecha. El diagrama sale de demo-entradas/ARQUITECTURA.md, sección 1.");
  }

  /* ------------------------------------- A.1 · el caso y el contrato entero */

  {
    const s = await D.lamina({ kicker: "A.1 · el caso", titulo: "El problema que este contrato ataca", ic: "diana", tituloSize: 28 });
    D.enunciado(s, "Una entrada de 80 000 pesos aparece a 400 000 el día del evento. El reglamento lo prohíbe, y no pasa nada: una regla que nadie hace cumplir no es una regla.", { y: 1.85, h: 1.3, size: 17, line: C.naranja });
    D.dosColumnas(s,
      { et: "Lo que se intenta hoy", items: [
        "Prohibir la reventa en los términos y condiciones.",
        "Entradas nominativas y cédula en la puerta: lento, y castiga a quien de verdad no puede ir.",
        "Una plataforma oficial de reventa, que cobra comisión por hacer de árbitro.",
      ] },
      { et: "Lo que ninguna de las tres logra", items: [
        "La reventa ocurre igual, por fuera y sin protección para el comprador.",
        "Si el evento se cancela o la entrada es falsa, no hay a quién reclamarle.",
        "El árbitro cobra, y hay que confiar en él. Si decide no devolver, no devuelve.",
      ] },
      { y: 3.30, h: 2.60, size: 12 });
    D.parrafo(s, "La apuesta del contrato: que el tope de reventa no dependa de que alguien quiera hacerlo cumplir.", { y: 6.02, h: 0.5, size: 13.5, color: C.ocre });
    s.addNotes("4 minutos. Este es el gancho de la sesión y conviene contarlo con un caso que ellos hayan vivido: cualquier concierto reciente en Medellín sirve. La pregunta para el grupo, si hay tiempo: ¿quién pierde con la reventa abusiva? No es solo el comprador: el organizador pierde la relación con su público y la reputación del evento. Si alguien pregunta por qué no basta una plataforma oficial, esa es exactamente la discusión del curso y se retoma al cierre del bloque B.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · el recorrido", titulo: "La vida de una entrada, de punta a punta", ic: "capas", tituloSize: 27 });
    D.pasos(s, [
      ["COMPRAR", "Alguien paga el precio oficial y el contrato le acuña una entrada a su nombre. El dinero queda acreditado al organizador, no enviado."],
      ["NO PUEDE IR", "Pone su entrada en venta. El contrato no la deja ofrecer por encima del tope: ahí la regla se hace cumplir sola."],
      ["REVENDER", "Otro la compra pagando el precio exacto de la oferta. La entrada cambia de dueño y el vendedor queda con saldo a favor."],
      ["RETIRAR", "Vendedor y organizador reclaman su dinero cuando quieran. El contrato nunca envía por su cuenta."],
      ["CERRAR LA REVENTA", "Unas horas antes del evento se congela: la lista de dueños deja de cambiar, y la puerta puede validar sin conexión."],
      ["ENTRAR", "En la puerta se consulta esValida y se marca la entrada como usada. Una entrada usada ya no vale ni se puede revender."],
    ], { y: 1.95, alto: 0.73, gap: 0.08, anchoEt: 2.6, size: 12 });
    s.addNotes("4 minutos. Recorrer el ciclo con el dedo sobre la lámina, sin abrir código todavía: esto es el QUÉ, el código es el CÓMO. Dato útil si preguntan: el cierre de la reventa es lo que permite que la puerta funcione con una lista descargada; si la reventa siguiera abierta, habría que consultar la cadena en vivo justo donde peor señal hay.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · el estado", titulo: "Qué recuerda el contrato", ic: "rejilla", tituloSize: 30 });
    D.tabla(s, ["variable", "qué guarda", "detalle que importa"], [
      ["evento · aforo", "Nombre del evento y cuántas entradas existen.", "El aforo es immutable: ni el organizador puede imprimir una entrada de más."],
      ["precioOriginal · topeReventa", "Precio de emisión y precio máximo de reventa.", "También immutable. El tope es público: cualquiera lo puede verificar."],
      ["cierreReventa", "Momento tras el cual no se revende.", "Una marca de tiempo. Después de esa hora, las ofertas dejan de poder comprarse."],
      ["emitidas", "Cuántas se han vendido.", "Los identificadores empiezan en 1, así que el 0 significa «no existe»."],
      ["validador", "Quién valida en la puerta.", "Lo asigna el organizador y lo puede cambiar. Es el único rol que cambia."],
      ["ofertas · usada", "Qué entrada está en venta y cuál ya entró.", "Dos mappings por identificador de entrada."],
      ["saldos", "Lo que el contrato le debe a cada quien.", "El corazón del patrón de retiro: aquí se anota, y cada uno reclama."],
    ], { y: 1.9, h: 4.4, colW: [3.0, 3.9, 5.193], size: 11.5 });
    D.parrafo(s, "Hay una octava, privada, que aparece en el bloque B y que es el centro de todo lo de hoy.", { y: 6.45, h: 0.4, size: 12.5, color: C.gris });
    s.addNotes("4 minutos. Esta tabla sale de ARQUITECTURA.md, sección 2. No hay que leerla entera: señalar los tres immutable (son las reglas que nadie puede cambiar, ni el dueño) y el mapping saldos, que es el que explica por qué el contrato no envía dinero. La octava variable es `_transferenciaAbierta`: NO nombrarla todavía, está puesta ahí como anzuelo para el bloque B.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · la interfaz · 1 de 2", titulo: "Las funciones que mueven entradas", ic: "lista", tituloSize: 28 });
    D.tabla(s, ["función", "quién la llama", "qué hace, y cuándo se niega"], [
      ["comprar()", "cualquiera", "Vende una entrada del lote original al precio exacto. Se niega si se agotó el aforo o si el pago no es exacto."],
      ["ponerEnVenta(id, precio)", "el dueño de esa entrada", "Publica una oferta. Se niega si no es suya, si el precio supera el tope, si la reventa ya cerró o si la entrada ya se usó."],
      ["quitarDeVenta(id)", "el dueño de esa entrada", "Retira la oferta. Sin ceremonia: borra la oferta y emite el evento."],
      ["comprarReventa(id)", "cualquiera menos el vendedor", "La ÚNICA puerta por la que una entrada cambia de dueño. Exige el precio exacto de la oferta."],
    ], { y: 1.9, h: 3.2, colW: [3.1, 2.6, 6.393], size: 12 });
    await D.ficha(s, {
      tipo: "termino", etiqueta: "Lo que ya se puede deducir sin leer un solo cuerpo de función",
      x: M, y: 5.25, w: CW, h: 1.45,
      texto: "Hay exactamente una forma de que una entrada cambie de manos, y tiene el tope adentro. Si eso es verdad, la promesa del contrato se sostiene. Comprobarlo es el trabajo del bloque B.",
      size: 13,
    });
    s.addNotes("5 minutos. Leer la tabla de izquierda a derecha, columna «quién la llama» primero: es la que más información da. La última fila es la importante y conviene decirla despacio: UNA sola puerta. Si alguien pregunta «¿y transferFrom, que todo ERC-721 tiene?», es la mejor pregunta posible: anotarla en el tablero con el nombre de quien la hizo y contestar que se responde en el bloque B.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · la interfaz · 2 de 2", titulo: "El dinero, la puerta y la administración", ic: "llave", tituloSize: 28 });
    D.tabla(s, ["función", "quién la llama", "qué hace, y cuándo se niega"], [
      ["retirar()", "quien tenga saldo", "Envía a quien llama lo que el contrato le debe. Se niega si su saldo es cero."],
      ["esValida(id, portador)", "la app de puerta", "¿Puede entrar esa persona con esa entrada? Es una consulta: no cuesta gas y no deja rastro."],
      ["marcarUsada(id)", "validador u organizador", "Marca la entrada como usada y borra su oferta. Nadie más puede llamarla."],
      ["asignarValidador(dir)", "solo el organizador", "Cambia quién valida en la puerta. El dispositivo se presta y se pierde: por eso el rol es reemplazable."],
      ["quedanDisponibles() · reventaAbierta()", "cualquiera", "Consultas de conveniencia para la interfaz. Gratis."],
    ], { y: 1.9, h: 3.5, colW: [3.5, 2.5, 6.093], size: 12 });
    D.parrafo(s, "Fíjense en el reparto: el organizador cobra y administra, el validador solo marca, y el dinero sale únicamente por retirar(), llamado por su dueño. Ningún rol puede mover una entrada ajena.", { y: 5.6, h: 0.9, size: 13.5 });
    s.addNotes("4 minutos. Esta lámina ya es media pasada 2, y está bien: sirve de preparación. Señalar que esValida es una consulta y que por eso la puerta puede funcionar con un teléfono prestado y sin gastar un peso. marcarUsada sí es transacción, y la decisión de cuándo usarla está en las decisiones de diseño de la lámina siguiente.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · el flujo crítico", titulo: "comprarReventa, por dentro", ic: "engranaje", tituloSize: 29 });
    D.pasos(s, [
      ["COMPRUEBA", "Que la oferta exista, que la reventa no haya cerrado, que la entrada no esté usada y que el pago sea exactamente el de la oferta."],
      ["Y COMPRUEBA MÁS", "Que quien compra no sea el mismo que vende. Sin eso, un vendedor podría simular ventas consigo mismo."],
      ["CAMBIA SU ESTADO", "Borra la oferta y le acredita el dinero al vendedor. Esto ocurre ANTES de mover nada hacia afuera: es checks-effects-interactions."],
      ["MUEVE LA ENTRADA", "Abre una compuerta, transfiere la entrada al comprador y la vuelve a cerrar."],
      ["AVISA", "Emite Revendida con el antes, el después y el precio. Esa es la huella que queda para cualquiera que audite."],
    ], { y: 1.95, alto: 0.8, gap: 0.1, anchoEt: 2.9, size: 12.5 });
    await D.ficha(s, {
      tipo: "pregunta", etiqueta: "El paso 4 tiene una palabra rara, y es deliberada",
      x: M, y: 5.92, w: CW, h: 0.95,
      texto: "¿Qué es esa compuerta, y qué pasa en el instante en que está abierta? Esa pregunta es el bloque B entero.",
      size: 12.5,
    });
    s.addNotes("5 minutos. Es el flujo de ARQUITECTURA.md sección 5. Dos cosas que decir sí o sí: (1) el orden —comprobar, cambiar lo propio, y solo al final tocar afuera— tiene nombre y es la defensa principal contra la reentrada, que se ve completa en la S9; (2) la compuerta queda deliberadamente sin explicar. Si insisten, contestar: «lo van a encontrar ustedes dentro de una hora, y les va a gustar más así».");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · decisiones de diseño", titulo: "Seis decisiones, y lo que se descartó", ic: "balanza", tituloSize: 28 });
    D.tabla(s, ["la decisión", "por qué", "qué se descartó"], [
      ["Tope de reventa, no prohibición", "Prohibir castiga a quien de verdad no puede ir y empuja la venta a un canal sin protección.", "La entrada intransferible: hostil con el usuario honesto."],
      ["Bloquear la transferencia directa", "Es lo único que vuelve real el tope. Si la entrada se mueve por fuera, la regla es otra vez una promesa.", "Cobrar un porcentaje: no pone techo al precio, solo lo grava, y el revendedor lo traslada."],
      ["Cerrar la reventa antes del evento", "Permite validar en la puerta sin conexión: la lista de dueños deja de cambiar.", "Reventa hasta el último minuto: obliga a consultar la cadena donde peor señal hay."],
      ["Marcar usada fuera de cadena", "Registrarlo en cadena haría esperar a la fila una confirmación.", "Marcar siempre en cadena: más puro, y una fila más lenta."],
      ["Dos interfaces separadas", "El dispositivo de la puerta se presta y se pierde; si firmara transacciones de valor sería el punto más débil.", "Una sola app con permisos por rol."],
      ["Patrón de retiro", "Si el destinatario rechaza un envío, la venta entera fallaría. Y enviar abre un camino de reentrada.", "Enviar el dinero dentro de la misma operación."],
    ], { y: 1.9, h: 4.55, colW: [3.2, 4.85, 4.043], size: 10.5 });
    D.parrafo(s, "Ninguna de estas seis es obvia, y cada una se pudo decidir al revés. Eso es diseñar: elegir, y saber qué se está perdiendo.", { y: 6.6, h: 0.4, size: 12.5, color: C.ocre });
    s.addNotes("6 minutos, y es la lámina más valiosa del bloque A para el proyecto de ellos. Sale de ARQUITECTURA.md sección 6. No leerla entera: elegir dos, la primera y la que más les toque según sus proyectos, y preguntarles qué habrían decidido ellos. Decir explícitamente que esta tabla —decisión, por qué, alternativa descartada— es lo que se les va a pedir en la defensa de la S8: un contrato sin decisiones explicadas es un contrato que nadie pensó.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · el precio de las decisiones", titulo: "Lo que se gana y lo que cuesta", ic: "balanza", tituloSize: 29 });
    D.dosColumnas(s,
      { et: "Lo que gano", items: [
        "La regla se cumple sola, sin depender de que alguien quiera aplicarla.",
        "Nadie revende por encima del tope a través del contrato.",
        "La puerta funciona sin conexión.",
        "Todo movimiento queda registrado y cualquiera lo puede auditar.",
        "El organizador no puede alterar el registro.",
      ] },
      { et: "Lo que cuesta", items: [
        "Quien no tiene billetera no puede comprar.",
        "Quien pierde su billetera pierde la entrada, y no hay a quién reclamarle.",
        "Nadie vende su entrada en las últimas horas.",
        "El tope es público: el organizador pierde margen comercial.",
        "Tampoco se puede corregir un error de emisión. La inmutabilidad corta para los dos lados.",
      ] },
      { y: 1.95, h: 3.5, size: 12.5 });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "La pregunta del curso, aplicada a este contrato",
      x: M, y: 5.60, w: CW, h: 1.25,
      texto: "¿Esto necesitaba una blockchain? Solo si el organizador no quiere —o no puede— ser el árbitro de su propia regla. Si el público confía en él, una base de datos hace lo mismo más barato.",
      size: 13,
    });
    s.addNotes("4 minutos. Sale de ARQUITECTURA.md sección 7. Es la lámina honesta del bloque: se proyecta entera y se lee la columna derecha en voz alta, que es la que casi nadie escribe en su propio proyecto. Cerrar con la pregunta de la ficha y NO responderla del todo: se retoma al final del bloque B, cuando ya sepan dónde termina el poder del contrato.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 → pasada 1", titulo: "Ya saben qué hace. Ahora léanlo con método", ic: "lupa", tituloSize: 27 });
    D.parrafo(s, "Lo anterior es el recorrido que haría cualquiera que le explique su contrato. A partir de aquí hacemos lo contrario: nadie nos lo explica. Leemos el archivo, en pantalla, en el orden de las cuatro pasadas, y sacamos las conclusiones nosotros.", { y: 1.95, h: 1.0, size: 15 });
    D.dosColumnas(s,
      { et: "Lo que acaban de recibir", texto: "Una explicación. Cómoda, ordenada y escrita por el autor del contrato, que cuenta lo que él cree que su contrato hace." },
      { et: "Lo que van a hacer ahora", texto: "Una lectura. Incómoda, en desorden aparente, y que puede terminar contradiciendo al autor. Hoy, de hecho, lo contradice." },
      { y: 3.2, h: 1.9, size: 13.5 });
    D.parrafo(s, "En la Sesión 8 ustedes van a estar del otro lado: explicando su contrato a un grupo que lo va a leer con este método.", { y: 5.35, h: 0.6, size: 14, color: C.ocre });
    s.addNotes("2 minutos. Es la bisagra del bloque y conviene no saltársela: marca que la explicación del autor y la lectura del auditor son dos cosas distintas, y que hoy la segunda le va a encontrar algo a la primera. No adelantar qué.");
  }

  /* ---------------------------------------------- pasada 1 · ¿qué promete? */

  {
    const s = await D.lamina({ kicker: "A · pasada 1 · ¿qué promete?", titulo: "Pasada 1: solo los nombres", ic: "lista", tituloSize: 30 });
    D.parrafo(s, "Regla de esta pasada: no se abre ningún cuerpo de función. Solo la lista de nombres públicos. Lo que se deduce de un nombre es una hipótesis, y se anota como hipótesis.", { y: 1.85, h: 0.5, size: 13 });
    D.tabla(s, ["función pública", "qué promete el nombre"], [
      ["comprar() payable", "Alguien paga y recibe. Al ser payable y no llevar parámetro de precio, el precio lo fija el contrato, no el vendedor."],
      ["ponerEnVenta(id, precio)", "El dueño ofrece. Que el precio sea un parámetro y no un valor fijo sugiere que hay un límite escrito en otra parte."],
      ["quitarDeVenta(id)", "La oferta se puede deshacer. Una oferta irrevocable sería una trampa; esta no lo es."],
      ["comprarReventa(id) payable", "Hay un mercado secundario ADENTRO del contrato. Y si está adentro, lo más probable es que afuera esté cerrado."],
      ["retirar()", "El dinero no se envía: se reclama. Patrón de retiro reconocido sin abrir una sola línea del cuerpo."],
      ["esValida(id, portador) view", "Una consulta, gratis, pensada para la puerta del evento: pregunta por un portador concreto."],
      ["marcarUsada(id)", "Alguien escribe sobre la entrada de otro. ¿Quién tiene ese permiso? Esa pregunta es la pasada 2."],
    ], { y: 2.45, h: 4.3, colW: [3.5, 8.593], size: 11 });
    s.addNotes("7 minutos. Hacerlo con ellos: proyectar el archivo, usar el esquema del editor o un buscador de «function », y pedir que digan en voz alta qué promete cada nombre ANTES de leer el cuerpo. La columna derecha es la cosecha de ese ejercicio, no una respuesta para dictar. Insistir en la última fila: una función que escribe sobre la cosa de otro es siempre una pista de que hay un privilegio. Si alguien quiere abrir un cuerpo, recordarle la regla: todavía no.");
  }

  {
    const s = await D.lamina({ kicker: "A · pasada 1 · ¿qué promete?", titulo: "Siete eventos, y lo que delatan", ic: "red", tituloSize: 29 });
    D.parrafo(s, "Los eventos son la única memoria del contrato que se lee cómodamente desde fuera. Quien quiera auditar, o construir una interfaz, vive de esta lista.", { y: 1.85, h: 0.5, size: 13 });
    D.tabla(s, ["evento", "qué cuenta, y a quién le sirve"], [
      ["EntradaEmitida", "Se vendió una del lote original: id, comprador y precio. Con esto se reconstruye el aforo sin leer el estado."],
      ["PuestaEnVenta · QuitadaDeVenta", "El mercado secundario se puede seguir en vivo desde una interfaz, sin consultar el contrato."],
      ["Revendida", "De quién a quién y por cuánto. Es el renglón que permite auditar si el tope se respetó."],
      ["Retirado", "Quién sacó dinero y cuánto. La contabilidad del contrato queda publicada."],
      ["EntradaUsada", "Quién entró al evento con cuál entrada, y cuándo."],
      ["ValidadorCambiado", "Lleva el anterior Y el nuevo: se puede reconstruir la cadena de custodia del aparato de la puerta."],
    ], { y: 2.45, h: 3.6, colW: [3.9, 8.193], size: 11 });
    D.parrafo(s, "Lo que falta también habla: no hay ningún evento de pausa, de actualización ni de reembolso. Si algo importante no emite nada, casi siempre es porque no existe. Anótenlo y lo comprobamos al cerrar el bloque.", { y: 6.15, h: 0.6, size: 12.5, color: C.ocre });
    s.addNotes("4 minutos. Son siete eventos en seis renglones: PuestaEnVenta y QuitadaDeVenta van juntos. Preguntar: con solo estos eventos, ¿podrían construir la página que muestra las entradas en venta? Sí. ¿Podrían saber cuánto pagó de verdad alguien por una entrada? Solo lo que pasó por el contrato: esa grieta es el final del bloque B, y ahí hay dos sorpresas. El truco de lectura que se enseña aquí es mirar lo que NO está en la lista.");
  }

  {
    const s = await D.lamina({ kicker: "A · pasada 1 · herencia", titulo: "Lo que hereda: ERC-721 y Ownable", ic: "jerarquia", tituloSize: 28 });
    D.codigo(s, `import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Entradas is ERC721, Ownable {
    constructor(...) ERC721("Entrada USB", "ENT") Ownable(msg.sender) { ... }
}`, { x: M, y: 1.85, w: CW, h: 1.7, lang: "sol", size: 12 });
    D.tabla(s, ["lo que llega heredado", "y lo que eso implica al leer"], [
      ["ERC721", "ownerOf, balanceOf, approve, transferFrom, safeTransferFrom y varios ganchos internos. Son cientos de líneas que NO están en este archivo."],
      ["Ownable", "owner(), onlyOwner y transferOwnership. Su error de permiso se llama OwnableUnauthorizedAccount y no figura entre los once de este contrato."],
    ], { y: 3.65, h: 1.65, colW: [3.5, 8.593], size: 11 });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "La trampa de leer un contrato que hereda",
      x: M, y: 5.4, w: CW, h: 1.4,
      texto: "Buena parte de lo que hace Entradas.sol no está escrito en Entradas.sol. Cuando un nombre no aparece en el archivo, está en el padre, y hay que abrir el padre. Y al contrario: heredar código auditado y usado por miles de contratos es la defensa más barata que existe.",
      size: 12.5,
    });
    s.addNotes("4 minutos. OpenZeppelin v5 exige pasar el dueño inicial al constructor de Ownable: en v4 era implícito, y los tutoriales viejos no compilan por eso. Abrir en el editor ERC721.sol de node_modules y mostrar su tamaño: eso es lo que no se ve. Preguntar: ¿cuántas funciones públicas tiene Entradas desde fuera? Muchas más que las de la pasada 1, porque hereda. Esa diferencia es exactamente la grieta que el bloque B va a usar dos veces.");
  }

  /* --------------------------------------------- pasada 2 · ¿quién manda? */

  {
    const s = await D.lamina({ kicker: "A · pasada 2 · ¿quién manda?", titulo: "Pasada 2: dos direcciones con poder", ic: "llave", tituloSize: 27 });
    D.tabla(s, ["", "owner · el organizador", "validador · la puerta"], [
      ["Quién la fija", "El que despliega: Ownable(msg.sender) en el constructor.", "La asigna el owner con asignarValidador, y la puede cambiar cuando quiera."],
      ["Qué PUEDE", "Asignar el validador · marcar una entrada como usada · retirar su propio saldo del recaudo.", "Marcar una entrada como usada. Nada más."],
      ["Qué NO puede", "Emitir gratis · mover una entrada ajena · cambiar el tope · tocar el saldo de otro · parar el contrato.", "Emitir · mover entradas · ver ni tocar dinero · cambiar nada del contrato."],
      ["Si se pierde la clave", "Nadie asigna validador y el recaudo acreditado queda atrapado. Las entradas siguen funcionando.", "El owner asigna otro aparato en una transacción. Ese es justamente el punto."],
    ], { y: 1.85, h: 2.6, colW: [2.3, 5.0, 4.793], size: 11 });
    D.dosColumnas(s,
      { et: "La decisión: un validador débil a propósito", texto: "El aparato de la puerta se presta y se pierde. Por eso el validador no emite, no mueve entradas y no toca dinero: quien se lo encuentre no puede hacer nada con valor. El límite honesto: puede quemar la entrada de alguien que todavía no llegó." },
      { et: "La alternativa descartada", linea: C.rojo, color: C.rojo, texto: "Una sola aplicación con permisos por rol. Más cómoda de construir, y convierte el aparato más expuesto del evento en el que firma transacciones de valor. Está en ARQUITECTURA.md, sección 6, con las otras cinco decisiones." },
      { y: 4.55, h: 2.15, size: 12 });
    s.addNotes("8 minutos. Construir la tabla con ellos buscando en el archivo «onlyOwner» y «validador»: son tres apariciones y se encuentran en veinte segundos. Lo valioso es la fila «qué NO puede»: para llenarla hay que leer, porque no hay ninguna palabra clave que la delate. El error típico al leer es quedarse en lo que el dueño PUEDE; la columna que importa es la otra, porque dice cuánto hay que confiar en él. Todo contrato responde a «¿quién manda aquí?»: lo que se busca no es si hay un dueño, es qué pasa el día que esa llave se pierda. Preguntar también qué habrían hecho ellos con el validador: hay dos respuestas buenas y opuestas, y las dos sirven; lo que no sirve es no haberse dado cuenta de que había que decidir. Conectar con la S6 y anunciar la multifirma de la S15.");
  }

  {
    const s = await D.lamina({ kicker: "A · pasada 2 · immutable", titulo: "Reglas que nadie puede cambiar", ic: "candado", tituloSize: 28 });
    D.codigo(s, `uint256 public immutable aforo;           // se fija al desplegar
uint256 public immutable precioOriginal;  // y ya nadie lo cambia
uint256 public immutable topeReventa;     // <- la regla del laboratorio de hoy
uint256 public immutable cierreReventa;

uint256 public emitidas;                  // normal: cambia con cada compra
address public validador;                 // normal: el owner la reasigna`, { x: M, y: 1.85, w: CW, h: 1.85, lang: "sol", size: 11.5 });
    D.tabla(s, ["palabra", "dónde vive el valor", "en Entradas.sol", "error típico"], [
      ["constant", "Incrustado en el código al compilar. No ocupa ranura.", "No hay ninguna: todo depende del despliegue.", "Querer asignarla en el constructor: no compila."],
      ["immutable", "Se fija en el constructor y queda incrustado en el código desplegado.", "aforo, precioOriginal, topeReventa, cierreReventa.", "Usarla para algo que deba cambiar después."],
      ["normal", "Una ranura de almacenamiento. Leerla cuesta 2 100 de gas la primera vez en cada transacción.", "emitidas, validador, evento y los tres mappings.", "Dejar normal algo que nunca cambia: se paga en cada lectura."],
    ], { y: 3.8, h: 2.05, colW: [1.6, 4.3, 3.2, 2.993], size: 11 });
    D.parrafo(s, "Lo que se lee aquí es una promesa fuerte: el tope de reventa NO se puede cambiar, y el organizador tampoco puede. Esa es la diferencia entre una regla y una intención. (El costo de 2 100 es el de la EIP-2929.)", { y: 5.95, h: 0.6, size: 12.5, color: C.ocre });
    s.addNotes("4 minutos. Preguntar: ¿por qué cierreReventa es immutable y no constant? Porque depende del momento del despliegue, y eso no se conoce al compilar. ¿Por qué emitidas no puede ser immutable? Porque cambia con cada compra. Lo importante para la lectura: cuando vean immutable, están viendo una regla que ni el dueño puede tocar, y eso cambia por completo lo que hay que confiarle. Es también la respuesta a «¿puede el organizador subir el tope si el evento se vende en diez minutos?».");
  }

  /* ------------------------------------------------- pasada 3 · el dinero */

  {
    const s = await D.lamina({ kicker: "A · pasada 3 · ¿y el dinero?", titulo: "Pasada 3: las dos puertas del dinero", ic: "moneda", tituloSize: 27 });
    D.codigo(s, `function comprar() external payable returns (uint256 tokenId) {
    if (emitidas >= aforo) revert AforoAgotado();
    if (msg.value != precioOriginal) revert PagoIncorrecto(precioOriginal, msg.value);

    tokenId = ++emitidas;
    saldos[owner()] += msg.value;      // se ACREDITA, no se envía
    _safeMint(msg.sender, tokenId);
    emit EntradaEmitida(tokenId, msg.sender, msg.value);
}`, { x: M, y: 1.85, w: CW, h: 2.25, lang: "sol", size: 11.5 });
    D.pasos(s, [
      ["PUERTA 1 · comprar()", "payable y msg.value exacto. Entra precioOriginal y se acredita al organizador. No hay descuentos ni cortesías: esa función no existe."],
      ["PUERTA 2 · comprarReventa()", "payable y msg.value igual al precio de la oferta. Entra y se acredita al vendedor, nunca al contrato ni al organizador."],
    ], { y: 4.2, alto: 0.8, gap: 0.1, anchoEt: 3.4, size: 12.5 });
    D.parrafo(s, "Y no hay una tercera. El contrato no tiene receive ni fallback, así que el ether que llegue sin llamar a una de esas dos funciones se rechaza. Eso también es una decisión, y se lee por ausencia.", { y: 6.0, h: 0.6, size: 12.5, color: C.ocre });
    s.addNotes("5 minutos. Buscar «payable» en el archivo: dos apariciones, y ahí está la respuesta a media pasada 3. Señalar la comparación exacta (msg.value != precioOriginal): no «mayor o igual», exacto, así que pagar de más revierte en vez de regalar. Preguntar: ¿qué pasa si alguien manda 1 wei al contrato desde su billetera? Revierte, porque no hay receive. Eso lo verificamos en la S6 con el contrato de certificados.");
  }

  {
    const s = await D.lamina({ kicker: "A · pasada 3 · struct y mapping", titulo: "Dónde se queda: struct y mapping", ic: "rejilla", tituloSize: 28 });
    D.codigo(s, `struct Oferta { uint256 precio; bool activa; }

mapping(uint256 tokenId => Oferta) public ofertas;   // qué se ofrece y a cuánto
mapping(uint256 tokenId => bool)   public usada;     // si ya entró al evento
mapping(address titular => uint256 monto) public saldos;   // lo que cada quien reclama`, { x: M, y: 1.85, w: CW, h: 1.4, lang: "sol", size: 11 });
    D.tabla(s, ["propiedad del mapping", "cómo se lee en este contrato"], [
      ["Toda clave existe", "ofertas[999] devuelve Oferta{0, false} aunque la entrada 999 no exista. Por eso hay un campo activa: distingue «sin oferta» de «ofrecida en cero»."],
      ["No se puede recorrer", "No hay forma de listar las entradas en venta desde el contrato. La interfaz las arma leyendo los eventos PuestaEnVenta."],
      ["Borrar es poner en cero", "delete ofertas[id] deja activa en false. Es lo que hace comprarReventa en cuanto cobra, y marcarUsada al entrar."],
      ["saldos es la contabilidad", "Un solo mapping lleva el recaudo del organizador y lo de cada revendedor. El contrato no distingue de quién es: solo debe."],
    ], { y: 3.35, h: 2.6, colW: [3.0, 9.093], size: 11 });
    D.parrafo(s, "Error típico al leer: ver un mapping y suponer que hay una lista. No hay. Si una interfaz les muestra «todas las entradas en venta», ese dato no salió del estado del contrato: salió de los eventos.", { y: 6.05, h: 0.6, size: 12.5, color: C.ocre });
    s.addNotes("5 minutos. Es el mapping de la S6 otra vez, ahora leído en un contrato ajeno. La ranura de cada entrada se calcula con keccak256(clave, posición): el Keccak de la S2 aparece hasta en el almacenamiento. Preguntar: si quisieran cobrar una comisión del 5 % al organizador, ¿qué mapping tocarían y qué se rompería? saldos, y habría que decidir qué pasa con el redondeo. La aritmética de porcentajes sin decimales está en la guía de la subasta.");
  }

  {
    const s = await D.lamina({ kicker: "A · pasada 3 · retiro y CEI", titulo: "Por dónde sale: retirar() y CEI", ic: "escudo", tituloSize: 28 });
    D.codigo(s, `function retirar() external {
    uint256 monto = saldos[msg.sender];
    if (monto == 0) revert SinSaldo();            // 1 · CHECKS

    saldos[msg.sender] = 0;                       // 2 · EFFECTS

    (bool ok, ) = payable(msg.sender).call{value: monto}("");   // 3 · INTERACTIONS
    require(ok, "el envio fallo");
    emit Retirado(msg.sender, monto);
}`, { x: M, y: 1.85, w: CW, h: 2.4, lang: "sol", size: 11.5 });
    D.dosColumnas(s,
      { et: "Por qué acredita y no envía", texto: "Si comprarReventa le enviara el dinero al vendedor, la venta entera dependería de que ese vendedor quisiera recibirlo. Un contrato vendedor que reviente al recibir congelaría el mercado para todos." },
      { et: "Por qué el cero va antes del call", texto: "Cuando el receptor recibe el control, su saldo ya es cero. Si vuelve a entrar, no hay nada que llevarse. Es la reentrada, y se desactiva sola con el orden de las tres líneas." },
      { y: 4.35, h: 1.8, size: 12 });
    D.parrafo(s, "Por qué call y no transfer: transfer entrega 2 300 de gas fijos, y en 2019 la EIP-1884 subió el costo de leer almacenamiento y dejó esa cifra corta. Una defensa que depende de un número que no controlas no es una defensa.", { y: 6.25, h: 0.55, size: 12.5, color: C.ocre });
    s.addNotes("6 minutos. Es la función más delicada del contrato y la que se lee con más calma. Pedir que la lean en voz alta en tres partes y nombren cada una: checks, effects, interactions. Ejemplo mental de la reentrada: el organizador tiene 2 ETH acreditados y el contrato guarda 10 de otros; con el orden invertido, su receive llama retirar() cuatro veces más antes de que la primera ponga el saldo en cero. El robo de The DAO en 2016 es exactamente esto, y se explota en vivo en la S9. Guardar esta idea —«entregar el control con el estado a medio camino»— porque el bloque B la va a usar sin que haya dinero en juego. Datos de la EIP-1884 verificados en el texto de la EIP y en el aviso de ConsenSys Diligence de septiembre de 2019.");
  }

  {
    const s = await D.lamina({ kicker: "A · pasada 3 · errores", titulo: "Errores que dicen qué pasó", ic: "alerta", tituloSize: 30 });
    D.codigo(s, `error PagoIncorrecto(uint256 esperado, uint256 recibido);
error PrecioSobreTope(uint256 tope, uint256 pedido);
error TransferenciaDirectaBloqueada();

if (precio > topeReventa) revert PrecioSobreTope(topeReventa, precio);`, { x: M, y: 1.85, w: CW, h: 1.35, lang: "sol", size: 11.5 });
    D.tabla(s, ["los once errores, por grupo", "qué le dicen a quien lee"], [
      ["Pago", "PagoIncorrecto(esperado, recibido) y PrecioSobreTope(tope, pedido). Llevan los dos números: quien falla ve en qué se equivocó sin consultar nada."],
      ["Permiso", "NoEsPropietario · NoAutorizado · NoSePuedeComprarASiMismo. Marcan los tres sitios donde el contrato comprueba quién está llamando."],
      ["Momento", "ReventaCerrada · AforoAgotado · EntradaYaUsada · NoEstaEnVenta. El ciclo de vida completo de una entrada se deduce de esta lista."],
      ["La regla", "TransferenciaDirectaBloqueada. El único error que no corresponde a ninguna función pública: salta desde un sitio que todavía no hemos leído."],
    ], { y: 3.3, h: 2.6, colW: [3.0, 9.093], size: 11 });
    D.parrafo(s, "Esa última fila es la pista que abre el laboratorio: hay una regla que ninguna función pública declara y que aun así existe. Guárdenla.", { y: 6.0, h: 0.6, size: 12.5, color: C.ocre });
    s.addNotes("4 minutos. Truco de lectura que vale para cualquier contrato: la lista de errores es el índice de las reglas. Agruparlos como aquí —pago, permiso, momento— y después buscar si sobra alguno. Aquí sobra uno, y es el que importa. NO decir todavía desde dónde salta: que se queden con la pregunta. Los errores personalizados cuestan menos gas que una cadena de texto y llevan datos adentro: es documentación ejecutable.");
  }

  {
    const s = await D.lamina({ kicker: "A · pasada 3 · gas medido", titulo: "Lo que cuesta, medido en gas", ic: "gas", tituloSize: 29 });
    D.parrafo(s, "Camino completo del dinero, con recibos reales: desplegar, dos compras, poner en venta, una reventa y los retiros. Red local, solc 0.8.34, optimizador en 200.", { y: 1.85, h: 0.6, size: 13 });
    D.tabla(s, ["lo que hace una transacción", "gas medido", "de dónde sale el número"], [
      ["desplegar el contrato", "1 889 937", "7 999 bytes de código. Se paga una sola vez, y la paga el organizador."],
      ["comprar() · la primera entrada", "117 309", "Acuña el token y estrena la ranura del saldo del organizador."],
      ["comprar() · la segunda", "83 109", "34 200 menos que la primera, sin hacer nada distinto."],
      ["ponerEnVenta() en el tope", "72 090", "Escribe la oferta: el precio y la bandera, dos ranuras nuevas."],
      ["comprarReventa()", "81 839", "Cobra, acredita al vendedor, borra la oferta y mueve el token."],
      ["retirar()", "30 023", "Igual para el organizador y para el revendedor: es la función más barata."],
    ], { y: 2.6, h: 3.5, colW: [4.0, 2.0, 6.093], size: 11 });
    D.parrafo(s, "Lo que enseña la tercera fila: esos 34 200 de diferencia no son el token. Son las escrituras que la primera compra estrena y la segunda ya encuentra hechas. Estrenar almacenamiento es lo más caro que hace un contrato.", { y: 6.2, h: 0.6, size: 12.5, color: C.ocre });
    s.addNotes("4 minutos. Todas estas cifras se midieron en copia aislada del proyecto con recibos de transacción, no estimadas: Hardhat 3.16.0, solc 0.8.34, objetivo osaka, optimizador 200. Si alguien las reproduce y le dan distintas, lo primero que hay que mirar es la versión del compilador: cambiar de compilador cambia el objetivo de la EVM y mueve el gas. La fila de retirar() es la buena noticia del patrón de retiro: reclamar lo propio es barato. Lo que falta medir —cuánto cuesta la regla del tope, y cuánto costó corregirla— es el final del bloque B.");
  }

  /* --------------------------------------------- pasada 4 · ¿qué pasa si? */

  {
    const s = await D.lamina({ kicker: "A · pasada 4 · ¿qué pasa si…?", titulo: "Pasada 4: la pasada del adversario", ic: "bicho", tituloSize: 27 });
    D.parrafo(s, "La cuarta pasada no busca errores de código: busca supuestos. Por cada regla que el contrato promete, se pregunta quién gana rodeándola y qué tendría que hacer para lograrlo.", { y: 1.85, h: 0.55, size: 13.5 });
    D.pasos(s, [
      ["¿QUIÉN GANA SI SE ROMPE?", "El revendedor que puede cobrar más del tope. Tiene motivo, tiene tiempo y, si sabe programar, tiene herramientas."],
      ["¿QUÉ SUPONE EL CONTRATO?", "Que la única forma de mover una entrada es comprarReventa. Si ese supuesto es falso, el tope es decorativo."],
      ["¿HASTA DÓNDE LLEGA?", "Solo a lo que pasa por sus funciones. Lo que ocurra fuera de la cadena el contrato no lo ve, y no puede verlo."],
      ["¿Y SI NO USAN LA APP?", "Nadie está obligado a usar la interfaz oficial. Un atacante llama al contrato directamente, o escribe el suyo."],
    ], { y: 2.5, alto: 0.78, gap: 0.1, anchoEt: 3.6, size: 12.5 });
    D.parrafo(s, "Estas preguntas no son un ejercicio: aplicadas a este contrato, esta semana, encontraron un hueco de verdad. Lo van a encontrar ustedes en el bloque B, corriendo código.", { y: 6.12, h: 0.6, size: 12.5, color: C.ocre });
    s.addNotes("5 minutos. Esta pasada se hace en el tablero con ellos: tres columnas, «qué promete», «quién gana si es falso», «cómo lo intentaría». Recoger tres o cuatro supuestos de la sala; alguno va a ser bueno y alguno va a ser imposible, y las dos cosas enseñan. No corregir todavía: el bloque B va a decidir cuál era cuál. Si alguien menciona el aviso al receptor del ERC-721, felicitarlo y no confirmar nada: ese es exactamente el hueco.");
  }

  {
    const s = await D.lamina({ kicker: "A · pasada 4 · las ausencias", titulo: "Lo que el contrato NO tiene", ic: "equis", tituloSize: 29 });
    D.tabla(s, ["lo que NO está, y se nota al leer", "qué significa que no esté"], [
      ["No es pausable", "No hay Pausable ni interruptor de emergencia. Si mañana aparece un fallo, nadie puede detener las ventas: solo esperar el cierre de la reventa."],
      ["No es actualizable", "No hay proxy. El código desplegado es el que queda para siempre. El tope es inamovible, y los errores también."],
      ["No tiene receive ni fallback", "El ether que llegue sin llamar a comprar o a comprarReventa se rechaza. Una sola puerta por donde entra el dinero."],
      ["No tiene reembolsos", "No existe devolver una entrada al organizador. Si el evento se cancela, el contrato no sabe resolverlo."],
      ["No tiene lista de ofertas", "Ninguna función devuelve «las entradas en venta». Eso lo arma la interfaz leyendo eventos."],
    ], { y: 1.9, h: 3.2, colW: [3.8, 8.293], size: 11 });
    await D.ficha(s, {
      tipo: "pregunta", etiqueta: "Lo que esta lista vale en una defensa",
      x: M, y: 5.2, w: CW, h: 1.55,
      texto: "Un ausente no es un olvido hasta que se demuestre. En la Sesión 8 la pregunta va a ser esta: ¿esto no está porque lo decidieron, o porque nadie se dio cuenta? Las dos respuestas se oyen distinto, y solo una se puede defender.",
      size: 12.5,
    });
    s.addNotes("4 minutos. Esta es la lámina que más les va a servir en su propio contrato, y la que menos se les ocurre hacer solos. Las dos primeras filas son decisiones defendibles: un contrato pausable le da al organizador el poder de congelar un mercado, y un contrato actualizable le da el poder de cambiar el tope después de vender. Decirlo así convierte una ausencia en un argumento. La cuarta fila, en cambio, es una ausencia incómoda y hay que reconocerla: si el evento se cancela, este contrato no tiene respuesta. Y guardar la primera fila para el final del bloque B: cuando aparezca el hueco, la pregunta «¿y si esto hubiera pasado en producción?» se contesta con ella.");
  }

  await verificacion({
    kicker: "Verificación · bloque A",
    titulo: "Lo que las cuatro pasadas debieron dejar",
    preguntas: [
      "Sin abrir ningún cuerpo de función: ¿qué hace sospechar que este contrato tiene un tope de precio?",
      "El organizador pierde su clave privada. ¿Qué deja de funcionar, y qué sigue funcionando igual?",
      "En retirar(), ¿qué línea va antes del call y qué ataque evita exactamente?",
      "Nombren dos cosas que el contrato NO tiene, y qué consecuencia tiene cada ausencia.",
    ],
    notas: "3 minutos, en parejas. Respuestas: (1) ponerEnVenta recibe el precio como parámetro —hay algo que lo compara— y hay un error llamado PrecioSobreTope, además de una variable immutable topeReventa; (2) deja de poder asignarse un validador nuevo y el recaudo acreditado queda atrapado; las compras, las reventas y los retiros de los demás siguen funcionando; (3) saldos[msg.sender] = 0, que evita la reentrada; (4) no es pausable (nadie puede detener las ventas ante un fallo) y no es actualizable (ni el tope ni los errores se pueden corregir). Si la pregunta 2 no sale, volver a la lámina de la pasada 2: es la que más vale para su propio contrato.",
  });

  /* ================================================================
     BLOQUE B · 70 minutos
     ================================================================ */

  {
    const s = await D.divisor({
      letra: "B", titulo: "El laboratorio de ataque",
      sub: "Un encargo de una sola línea: revendan una entrada por encima del tope. Seis ataques, una vulnerabilidad real encontrada esta semana, y los cinco tipos que hay detrás.",
      minutos: "APROXIMADAMENTE 60 MINUTOS · EN PAREJAS",
      ic: "bicho",
    });
    s.addNotes("Transición (30 s). Avisar aquí que el laboratorio de la subasta (laboratorios-evm/guias/s07-subasta-patrones.pdf, 16 páginas) pasa a trabajo autónomo y sigue siendo evidencia evaluable: el tiempo de clase se va en esto, porque esto no se puede hacer solo. El docente circula; no dicta comandos. Reparto del tiempo: 15 minutos de correr y leer, 25 de los seis ataques, 10 de los tipos y la regla general, 12 del sexto intento propio, 3 de verificación.");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · el encargo", titulo: "El encargo, en una sola línea", ic: "diana", tituloSize: 29 });
    D.enunciado(s, "Revendan una entrada por encima del tope.", { y: 1.9, h: 1.35, size: 24, line: C.rojo });
    D.pasos(s, [
      ["NO SE TOCA EL CONTRATO", "Entradas.sol y EntradasVulnerable.sol son copias de lectura. Atacar cambiando el contrato que se ataca no demuestra nada."],
      ["SE ATACA DESDE AFUERA", "Como lo haría alguien de verdad: con otro contrato, llamando a las funciones públicas sin pasar por la interfaz."],
      ["LA PRUEBA ES LA EVIDENCIA", "Un intento sin una prueba que lo corra es una opinión. Si el intento funciona, tiene que funcionar en verde."],
    ], { y: 3.4, alto: 0.78, gap: 0.1, anchoEt: 3.5, size: 12.5 });
    D.parrafo(s, "Archivos del laboratorio: contracts/s07/Entradas.sol · EntradasVulnerable.sol · AtacanteTope.sol · AtacanteCompuerta.sol, y las pruebas test/s07/AtaqueAlTope.test.js y CompuertaAbierta.test.js.", { y: 6.14, h: 0.6, size: 12, color: C.gris });
    s.addNotes("3 minutos. Leer el encargo y callarse diez segundos. Alguien va a decir «eso no se puede». Contestar que es exactamente lo que hay que averiguar, y que hay seis ataques ya escritos esperándolos, de los cuales dos funcionan. La regla de no tocar el contrato es la más importante y la que más se rompe: un ataque que modifica el objetivo no es un ataque. Explicar de pasada por qué hay DOS versiones del contrato y no decir todavía en qué se diferencian.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · correr primero · 6 minutos", titulo: "Quince pruebas, y todas en verde", ic: "terminal", tituloSize: 27 });
    D.codigo(s, `npx hardhat test test/s07/AtaqueAlTope.test.js test/s07/CompuertaAbierta.test.js

  S07 · el revendedor programa su propio contrato
    ✔ ★ intento 1 · transferFrom directo: BLOQUEADO
    ✔ ★ intento 2 · safeTransferFrom: BLOQUEADO igual
    ✔ ★ intento 3 · aprobar a un cómplice: la aprobación SE CONCEDE…
    ✔ ★ intento 4 · sobre el tope: RECHAZADO · y el borde EN el tope: aceptado
    ✔ ★ intento 5 · vender en el tope y cobrar la diferencia POR FUERA
  S07 · el ataque de la compuerta · versión VULNERABLE
    ✔ ★ el atacante saca su entrada del tope desde onERC721Received
  S07 · el mismo ataque · versión CORREGIDA
    ✔ ★ la compuerta se cierra antes del aviso, y el escape falla
  15 passing`, { x: M, y: 1.85, w: CW, h: 2.85, lang: "js", size: 10.5 });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "Quince en verde, y eso es lo raro",
      x: M, y: 4.8, w: CW, h: 1.3,
      texto: "Una suite verde normalmente significa «funciona». Aquí significa otra cosa: unos intentos fallan como se espera, otros funcionan como NO se espera, y uno de ellos encontró un hueco de verdad en el contrato del docente.",
      size: 12.5,
    });
    D.parrafo(s, "Primero se corre, después se lee. Si una pareja no ve «15 passing», el problema es de entorno y se resuelve ahora: npm install desde laboratorios-evm.", { y: 6.2, h: 0.55, size: 12.5, color: C.ocre });
    s.addNotes("6 minutos. Verificado el 7-oct-2026: las quince pasan (once en AtaqueAlTope y cuatro en CompuertaAbierta). Que todas las parejas lleguen a «15 passing» antes de abrir un solo archivo; si alguien ve otra cosa es entorno. Mientras corren, pedir que lean los nombres y apuesten cuáles de los ataques son los que funcionan. Recoger las apuestas en voz alta: cuesta nada y sube el interés del resto del bloque.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · el atacante", titulo: "Un revendedor que sabe programar", ic: "codigo", tituloSize: 28 });
    D.codigo(s, `contract AtacanteTope is IERC721Receiver {
    function intentoTransferenciaDirecta(uint256 id, address comprador) external {
        IERC721(address(entradas)).transferFrom(address(this), comprador, id);
    }
    function intentoTransferenciaSegura(uint256 id, address c) external { ... }
    function intentoAprobarAComplice(uint256 id, address complice) external { ... }
    function intentoPrecioSobreTope(uint256 id, uint256 precioAbusivo) external { ... }
    function ponerEnVentaEnElTope(uint256 id) external { ... }
}`, { x: M, y: 1.85, w: CW, h: 2.15, lang: "sol", size: 11 });
    D.parrafo(s, "Cinco intentos, uno por función. No usa la interfaz oficial: llama al contrato directamente, que es lo que hace cualquiera con malas intenciones y una tarde libre.", { y: 4.1, h: 0.55, size: 12.5 });
    D.tabla(s, ["intento", "la idea del revendedor"], [
      ["1 · transferFrom", "«Le paso la entrada a mi comprador y que él me pague por fuera.»"],
      ["2 · safeTransferFrom", "«Probemos con la versión segura, por si la otra está vigilada.»"],
      ["3 · approve", "«Apruebo a un cómplice y que la saque él.»"],
      ["4 · ponerEnVenta", "«Pongo el precio que yo quiera: 0,5 ETH en vez de 0,12.»"],
      ["5 · ponerEnVentaEnElTope", "«La pongo en el tope exacto, que es perfectamente legal.» Léanlo entero antes de opinar."],
    ], { y: 4.75, h: 2.0, colW: [3.3, 8.793], size: 11 });
    s.addNotes("4 minutos. Abrir AtacanteTope.sol y recorrerlo. Señalar onERC721Received: el atacante tuvo que implementarlo para poder recibir entradas, porque un ERC-721 exige que el receptor avise que sabe recibirlas. Es un detalle que enseña mucho —para atacar un estándar hay que cumplirlo— y además es la puerta por la que entra el sexto ataque. No adelantar nada todavía; la tabla deja la duda a propósito.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · intentos 1 y 2", titulo: "Intentos 1 y 2: contra un muro", ic: "alerta", tituloSize: 28 });
    D.codigo(s, `it("★ intento 1 · transferFrom directo: BLOQUEADO", async () => {
  await expect(atacante.intentoTransferenciaDirecta(tokenId, victima.address))
    .to.be.revertedWithCustomError(entradas, "TransferenciaDirectaBloqueada");
});`, { x: M, y: 1.85, w: CW, h: 1.2, lang: "js", size: 11.5 });
    D.enunciado(s, "Las dos formas estándar de mover un ERC-721 revierten. Y ninguna función pública de Entradas.sol declara ese error.", { y: 3.15, h: 1.3, size: 18, line: C.naranja });
    D.dosColumnas(s,
      { et: "Lo que el atacante esperaba", texto: "transferFrom es parte del estándar ERC-721. Cualquier contrato que lo cumpla la tiene, y funciona. Entradas.sol la tiene y no funciona." },
      { et: "Lo que eso implica", texto: "Alguien sobreescribió algo heredado. El bloqueo no está en las funciones que leímos en la pasada 1: está más abajo, en una pieza del padre." },
      { y: 4.55, h: 1.65, size: 12.5 });
    s.addNotes("4 minutos. Correr solo estas dos: npx hardhat test test/s07/AtaqueAlTope.test.js --grep \"intento 1\". Pedir que abran el archivo y busquen «TransferenciaDirectaBloqueada»: aparece en la lista de errores y en un solo sitio más. Que NO lean todavía ese sitio: primero la pregunta de la lámina siguiente. Si alguien ya lo encontró, pedirle que se guarde la respuesta treinta segundos.");
  }

  await pregunta({
    kicker: "B.5 · la pregunta del bloque",
    texto: "Ninguna de las funciones públicas que leímos declara TransferenciaDirectaBloqueada. ¿Desde dónde revierte, entonces?",
    pista: "Pista: la respuesta está en lo que el contrato hereda, no en lo que escribe.",
    notas: "2 minutos. Silencio de cinco segundos antes de recibir respuestas. Si nadie habla, reformular: «si transferFrom viene del padre y aquí no está escrita, ¿dónde se le puede poner una condición?». La palabra que se busca es: en un gancho del padre. Si alguien dice «en un modificador», es un error útil: no hay modificador porque la función no está en este archivo.",
  });

  {
    const s = await D.lamina({ kicker: "B.6 · la respuesta", titulo: "El gancho por donde pasan todas", ic: "rombo", tituloSize: 28 });
    D.codigo(s, `function _update(address to, uint256 tokenId, address auth)
    internal override returns (address)
{
    address from = _ownerOf(tokenId);
    if (from != address(0) && !_transferenciaAbierta) {
        revert TransferenciaDirectaBloqueada();
    }
    return super._update(to, tokenId, auth);
}`, { x: M, y: 1.85, w: 7.0, h: 2.35, lang: "sol", size: 11, titulo: "la versión publicada hasta esta semana" });
    D.lista(s, [
      "Todo movimiento de un ERC-721 pasa por _update: acuñar, transferir y quemar.",
      "Se permite acuñar, que es cuando from vale cero.",
      "Se permite mover solo si la compuerta está abierta.",
      "La abre una sola función, por un instante, y solo tras verificar el tope.",
    ], { x: M + 7.3, y: 1.85, w: CW - 7.3, h: 2.35, size: 12.5, gap: 8 });
    D.codigo(s, `_transferenciaAbierta = true;
_safeTransfer(vendedor, msg.sender, tokenId, "");   // la única vía
_transferenciaAbierta = false;`, { x: M, y: 4.3, w: CW, h: 1.25, lang: "sol", size: 12, titulo: "dentro de comprarReventa" });
    D.enunciado(s, "Esa es la diferencia entre una regla escrita en unos términos y condiciones y una regla que el sistema hace cumplir.", { y: 5.62, h: 1.15, size: 15, line: C.verde });
    s.addNotes("5 minutos. Es la revelación del bloque, y funciona porque llegaron estrellados contra el muro. Mostrar en el editor las tres líneas de comprarReventa que abren y cierran la compuerta. Preguntar: ¿por qué se permite que from valga cero? Porque esa es la emisión, y si se bloqueara no se podría vender ni una entrada. OJO, docente: lo que hay en esta lámina es la versión que estuvo PUBLICADA hasta el 7 de octubre de 2026, no la corregida. Déjenla en pantalla un rato: a las tres láminas se descubre qué tiene de malo. Si alguien lo ve ahora mismo, premiarlo y seguir.");
  }

  {
    const s = await D.lamina({ kicker: "B.7 · intento 3", titulo: "Intento 3: aprobar no es mover", ic: "llave", tituloSize: 28 });
    D.dosColumnas(s,
      { et: "La aprobación SÍ se concede", texto: "approve(complice, id) pasa sin problema, y getApproved(id) devuelve la dirección del cómplice. Tiene sentido: aprobar no mueve nada, solo anota un permiso en un mapping." },
      { et: "Y no le sirve de nada", texto: "Cuando el cómplice llama transferFrom, el gancho se interpone igual. Da exactamente lo mismo quién llame: la compuerta no está abierta." },
      { y: 1.9, h: 2.1, size: 12.5 });
    D.codigo(s, `await atacante.intentoAprobarAComplice(tokenId, complice.address);
expect(await entradas.getApproved(tokenId)).to.equal(complice.address);  // pasa
await expect(entradas.connect(complice).transferFrom(atacante, victima, id))
  .to.be.revertedWithCustomError(entradas, "TransferenciaDirectaBloqueada");`, { x: M, y: 4.1, w: CW, h: 1.25, lang: "js", size: 12 });
    await D.ficha(s, {
      tipo: "termino", etiqueta: "La lección de lectura",
      x: M, y: 5.45, w: CW, h: 1.3,
      texto: "Un permiso concedido no es un movimiento permitido. Al leer un contrato hay que separar las dos cosas: approve escribe en un mapping, y mover es otra operación, que es la que está vigilada.",
      size: 12.5,
    });
    s.addNotes("4 minutos. Este intento es el que más engaña, porque la primera transacción pasa en verde y da la sensación de haber logrado algo. Preguntar: ¿sirve de algo que exista la aprobación? Sí, para la interfaz oficial de un mercado, que aquí no se usa. Y preguntar lo incómodo: ¿debería ponerse una guardia también en approve? Se puede discutir. No hacerlo deja un permiso inútil escrito en la cadena; hacerlo cuesta gas y código. Esta familia de ataque vuelve en la S10 con las aprobaciones ilimitadas de ERC-20.");
  }

  {
    const s = await D.lamina({ kicker: "B.8 · intento 4", titulo: "Intento 4: el tope, y su borde", ic: "balanza", tituloSize: 28 });
    D.codigo(s, `// el tope es 0,12 ETH y el revendedor pide 0,5
await expect(atacante.intentoPrecioSobreTope(tokenId, abusivo))
  .to.be.revertedWithCustomError(entradas, "PrecioSobreTope")
  .withArgs(TOPE, abusivo);        // el error trae los dos números adentro`, { x: M, y: 1.85, w: CW, h: 1.2, lang: "js", size: 12 });
    D.dosColumnas(s,
      { et: "Por encima del tope: rechazado", texto: "ponerEnVenta compara antes de escribir. El error no dice «no puedes»: dice cuál es el tope y cuánto se pidió. Quien lea el recibo entiende qué pasó." },
      { et: "Justo EN el tope: aceptado", texto: "Una prueba comprueba el borde exacto: precio igual a topeReventa entra. La comparación es «mayor que», no «mayor o igual». Esa diferencia de un carácter es una regla de negocio." },
      { y: 3.15, h: 1.8, size: 12.5 });
    await D.ficha(s, {
      tipo: "pregunta", etiqueta: "Lo que hay que mirar siempre en una comparación",
      x: M, y: 5.05, w: CW, h: 1.25,
      texto: "El borde. En un contrato, > y >= separan «se puede» de «no se puede». Cuando lean su propio contrato, busquen cada comparación y pregunten qué pasa exactamente en el valor límite.",
      size: 12.5,
    });
    s.addNotes("4 minutos. Verificado: la prueba del intento 4 revierte con PrecioSobreTope(tope, pedido) y la del borde acepta el precio igual al tope, dejando la oferta activa. Preguntar: ¿y si el tope fuera «menor que», sin el igual? Entonces nadie podría vender exactamente al tope y el precio máximo real sería un wei menos. Parece una tontería y es el tipo de detalle por el que se pierde dinero. Pedirles que busquen en SU contrato todas las comparaciones y anoten el borde de cada una: es una fila de la ficha de lectura.");
  }

  {
    const s = await D.lamina({ kicker: "B.9 · el clímax · el hallazgo", titulo: "La compuerta se quedaba abierta", ic: "bicho", tituloSize: 28 });
    D.parrafo(s, "Preparando esta sesión, las cuatro pasadas se aplicaron al contrato del propio docente. La pasada 4 encontró un hueco real: la promesa central del contrato —«el tope no se puede rodear»— era falsa. Estuvo publicada así hasta el 7 de octubre de 2026.", { y: 1.85, h: 0.9, size: 13.5 });
    D.pasos(s, [
      ["ABRE LA COMPUERTA", "comprarReventa pone _transferenciaAbierta en true para poder mover el token. Hasta aquí, todo correcto."],
      ["AVISA AL RECEPTOR", "_safeTransfer llama a onERC721Received del comprador. Si el comprador es un contrato, SU CÓDIGO CORRE AHÍ."],
      ["Y SIGUE ABIERTA", "Porque se cerraba después, al volver. Durante ese instante, cualquier transferencia pasa el control de _update."],
      ["EL ESCAPE", "Desde su propio aviso, el atacante llama transferFrom y saca OTRA entrada suya. Sin oferta, sin precio y sin tope."],
    ], { y: 2.9, alto: 0.82, gap: 0.1, anchoEt: 3.2, size: 12 });
    s.addNotes("4 minutos. Tono: sin dramatizar y sin pedir perdón. El valor pedagógico está en que el docente expone su propio código a que lo rompan, y en que el hueco lo encontró el método que se enseña hoy, no una herramienta. Volver a la lámina B.6, que sigue reciente, y señalar la línea «_transferenciaAbierta = false;» DESPUÉS del _safeTransfer: ahí está todo. Preguntar antes de pasar: ¿qué tendría que hacer el atacante para aprovechar esto? La respuesta es la lámina siguiente, y casi siempre alguien la dice.");
  }

  {
    const s = await D.lamina({ kicker: "B.10 · la prueba de concepto", titulo: "El escape, dentro del aviso", ic: "codigo", tituloSize: 29 });
    D.codigo(s, `function onERC721Received(address, address, uint256, bytes calldata)
    external returns (bytes4)
{
    // la compuerta del contrato de entradas sigue abierta en este instante
    try IERC721(address(entradas)).transferFrom(address(this), destino, tokenAEscapar) {
        loLogro = true;          // y lo logró
    } catch { loLogro = false; }
    return IERC721Receiver.onERC721Received.selector;
}`, { x: M, y: 1.85, w: CW, h: 2.15, lang: "sol", size: 11 });
    D.tabla(s, ["las cuatro pruebas del ataque", "resultado"], [
      ["Contra EntradasVulnerable", "El escape FUNCIONA: la entrada 1 acaba en manos del comprador del atacante, y saldos del atacante queda en cero. El contrato no registró ningún precio."],
      ["Contra Entradas, la corregida", "El escape FALLA: loLogro queda en false y la entrada 1 sigue siendo del atacante."],
      ["La compra que lo disparaba", "Se completa igual: la entrada 2 cambia de dueño con normalidad. La corrección no rompe el camino legítimo."],
      ["Una reventa normal", "Sigue funcionando entre dos personas. Es la prueba que evita «arreglar» rompiendo otra cosa."],
    ], { y: 4.1, h: 2.6, colW: [4.0, 8.093], size: 11 });
    s.addNotes("6 minutos. Correr en vivo: npx hardhat test test/s07/CompuertaAbierta.test.js. Es un solo ataque contra dos contratos, y la diferencia entre los dos son tres líneas. Señalar lo más grave de la primera fila: el traspaso ocurre y el contrato no registra NINGÚN precio, así que el tope no intervino y la auditoría de eventos no muestra nada. Preguntar: ¿cuántas entradas podría sacar así un revendedor con cien entradas? Una por cada reventa legítima que compre, y las reventas legítimas las puede comprar él mismo desde otro contrato. Ahí se ve la gravedad.");
  }

  {
    const s = await D.lamina({ kicker: "B.11 · la corrección", titulo: "La corrección: tres líneas", ic: "martillo", tituloSize: 30 });
    D.codigo(s, `if (from != address(0)
    && !_transferenciaAbierta) {
    revert TransferenciaDirectaBloqueada();
}
// se cerraba al volver, en comprarReventa`, { x: M, y: 1.85, w: CW / 2 - 0.15, h: 1.7, lang: "sol", size: 11, titulo: "antes · publicado" });
    D.codigo(s, `if (from != address(0)) {
    if (!_transferenciaAbierta)
        revert TransferenciaDirectaBloqueada();
    _transferenciaAbierta = false;   // UN SOLO USO
}`, { x: M + CW / 2 + 0.15, y: 1.85, w: CW / 2 - 0.15, h: 1.7, lang: "sol", size: 11, titulo: "ahora · corregido" });
    D.cifra(s, "+161", "gas de más por reventa: 81 839 contra 81 678", { x: M, y: 3.7, w: 3.8, h: 1.4, color: C.verde, size: 30 });
    D.cifra(s, "+4", "bytes de código: 7 999 contra 7 995", { x: M + 4.1, y: 3.7, w: 3.8, h: 1.4, size: 30 });
    D.cifra(s, "+852", "gas de más al desplegar, una sola vez", { x: M + 8.2, y: 3.7, w: CW - 8.2, h: 1.4, size: 30 });
    await D.ficha(s, {
      tipo: "profundidad", etiqueta: "Por qué esta lámina está en el deck",
      x: M, y: 5.2, w: CW, h: 1.55,
      texto: "Porque el contrato que el docente publicó como ejemplo de «la regla no se puede rodear» sí se podía rodear. Estaba bien escrito, revisado y con sus pruebas en verde, y tenía un hueco que costaba 161 de gas tapar. Enseñarlo vale más que esconderlo.",
      size: 12.5,
    });
    s.addNotes("5 minutos. La compuerta ahora es de UN SOLO USO: se cierra dentro de _update, antes de que _safeTransfer avise al receptor, así que cuando el código del comprador corre ya está cerrada. Las tres cifras se midieron con recibos reales el 7-oct-2026, comparando las dos versiones en el mismo camino. Decir en voz alta lo incómodo: las once pruebas de AtaqueAlTope estaban en verde contra la versión vulnerable, y ninguna lo detectó. Las pruebas comprueban lo que a uno se le ocurrió comprobar. Eso es la antesala exacta de la S8 (pruebas de mutación) y de la S9.");
  }

  {
    const s = await D.lamina({ kicker: "B.12 · intento 5 · el otro que funciona", titulo: "Intento 5: el pago por fuera", ic: "bicho", tituloSize: 28 });
    D.pasos(s, [
      ["POR FUERA", "La víctima le transfiere 0,38 ETH al revendedor, de billetera a billetera. Para el contrato de entradas, eso no existe."],
      ["EN EL TOPE", "El revendedor pone la entrada en venta en 0,12 exacto. Perfectamente legal, y así lo confirma la prueba del borde."],
      ["LA COMPRA", "La víctima llama comprarReventa con 0,12. Todas las validaciones pasan: tope, cierre, pago exacto, dueño."],
      ["EL RESULTADO", "Pagó 0,5 ETH por una entrada con tope de 0,12. Cuatro veces el tope, y el contrato no vio nada raro."],
    ], { y: 1.85, alto: 0.8, gap: 0.1, anchoEt: 2.6, size: 12.5 });
    D.enunciado(s, "El contrato hace cumplir la regla adentro. Con un pago por fuera no puede hacer nada, y nunca va a poder.", { y: 5.55, h: 1.25, size: 17, line: C.rojo });
    s.addNotes("5 minutos. Esta es la otra lámina clave del bloque, y es distinta de la del hallazgo: el hallazgo era un fallo que se arregló con tres líneas; esto no se arregla con ninguna. Correr la prueba en vivo: --grep \"intento 5\". Mostrar después la prueba del saldo: el contrato acredita al vendedor exactamente el tope, 0,12, y los 0,38 no aparecen en ningún mapping ni en ningún evento. Preguntar: si ustedes auditaran esta cadena, ¿verían algo fuera de lugar? Nada. Dejar que el malestar se sienta antes de pasar a la lámina siguiente: ese malestar es el aprendizaje.");
  }

  {
    const s = await D.lamina({ kicker: "B.13 · el límite", titulo: "Dónde termina el poder del contrato", ic: "balanza", tituloSize: 27 });
    D.dosColumnas(s,
      { et: "Lo que esto NO es", linea: C.rojo, color: C.rojo, texto: "No es un fallo del contrato, y no se parece al hallazgo de la compuerta. Ahí faltaba una línea; aquí no hay línea que escribir: ningún código puede ver un pago en efectivo." },
      { et: "Lo que SÍ es", texto: "El límite de lo que un contrato puede hacer cumplir. Lo que entra en su alcance lo hace cumplir sin excepciones; lo que queda fuera no lo roza siquiera." },
      { y: 1.9, h: 2.0, size: 12.5 });
    D.tabla(s, ["lo que el tope sí logra", "y lo que no"], [
      ["Mata el mercado abierto de reventa", "No mata el acuerdo privado entre dos personas."],
      ["Deja el precio en cadena auditable", "No dice nada del precio real que se pagó."],
      ["Pone un techo al precio", "No pone un precio justo: el techo se vuelve el precio."],
      ["Cierra todo al llegar el cierre", "No limita cuántas veces se revende antes."],
    ], { y: 4.0, h: 1.95, colW: [5.5, 6.593], size: 11 });
    D.parrafo(s, "Y esta es la tesis del curso en su versión incómoda: la pregunta nunca es «¿se puede poner en la cadena?». Es «¿qué parte del problema queda dentro del alcance de lo que la cadena hace cumplir, y qué parte sigue dependiendo de la gente?».", { y: 6.05, h: 0.75, size: 12.5, color: C.ocre });
    s.addNotes("4 minutos. Aquí se cierra el arco del curso: en la S1 dijimos que la habilidad valiosa es saber cuándo NO usar blockchain y defender esa decisión. Esta lámina es la versión fina de lo mismo: incluso cuando la respuesta es sí, hay que saber qué parte del problema queda adentro. La tercera fila de la tabla da para discutir: un techo de precio convierte el techo en el precio, igual que cualquier precio regulado, y eso no es un fallo del contrato sino del diseño del negocio; el contrato solo lo hace visible. Las dos últimas filas salen de las dos pruebas finales de AtaqueAlTope.");
  }

  {
    const s = await D.lamina({ kicker: "B.14 · el tipo de ataque", titulo: "Los cinco tipos de ataque de hoy", ic: "jerarquia", tituloSize: 28 });
    D.parrafo(s, "Cada intento de hoy pertenece a una familia conocida. Reconocer la familia es lo que les permite trasladar la lección a su propio contrato, que no tiene entradas ni topes.", { y: 1.85, h: 0.5, size: 13 });
    D.tabla(s, ["el intento de hoy", "la familia, y qué enseña"], [
      ["Llamada directa al contrato", "Se rodea la interfaz oficial. Una regla que solo vive en la aplicación no existe: cualquiera llama al contrato sin pasar por ella."],
      ["Puerta alterna a lo mismo", "transferFrom y safeTransferFrom mueven lo mismo. Por eso se controla el punto por donde pasa el ESTADO, no cada puerta. Se llama mediación completa."],
      ["Abuso de la delegación", "Aprobar sí se concede, porque aprobar no mueve nada. El control va en el momento de ejercer el permiso, no en el de concederlo."],
      ["Devolución del control", "El contrato llama a código ajeno con el estado a medio camino. Es la familia de la reentrada; aquí la variante no toca el dinero: toca la compuerta."],
      ["Canal lateral fuera de cadena", "El pago por fuera, que el contrato no puede ver. No es un fallo: es el límite de lo que un contrato hace cumplir."],
    ], { y: 2.45, h: 3.2, colW: [3.9, 8.193], size: 11 });
    D.parrafo(s, "Dos de estas familias tienen su caso real propio en el curso: las aprobaciones ilimitadas de ERC-20 y el robo a Badger DAO llegan en la S10; la reentrada completa, con The DAO, en la S9.", { y: 5.75, h: 0.9, size: 12.5, color: C.ocre });
    s.addNotes("5 minutos. El docente pidió explícitamente esta lámina: explicar el ataque Y el tipo de ataque. Recorrerla despidiendo cada intento con su nombre de familia, y pedir que la copien: es la única parte del bloque B que se traslada tal cual a un contrato que no sea de entradas. La cuarta fila es la más valiosa, porque la variante de hoy no roba dinero —roba una autorización— y eso enseña que la reentrada no es «un ataque para robar ether»: es «entregar el control con el estado a medio camino».");
  }

  {
    const s = await D.lamina({ kicker: "B.15 · la regla general", titulo: "La regla que hay que llevarse", ic: "diana", tituloSize: 29 });
    D.enunciado(s, "Un control se pone en el punto por donde pasa el estado, no en cada puerta de entrada. Y todo lo que entregue el control a código ajeno debe dejar el estado ya cerrado antes de hacerlo.", { y: 1.85, h: 1.6, size: 18, line: C.violeta });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "Y una familia más que este contrato NO resuelve",
      x: M, y: 3.6, w: CW, h: 1.7,
      texto: "comprarReventa solo exige el pago exacto y que el comprador no sea el vendedor. Nada impide que un bot vea una oferta recién publicada y la compre antes que la persona a la que el vendedor se la quería dejar. Es front-running, de la familia del MEV: se ve en la S9 y en la S14. El contrato no lo resuelve, y decirlo vale más que esconderlo.",
      size: 12.5,
    });
    D.parrafo(s, "Las dos mitades de la regla se aplican a su contrato así: (1) busquen la operación que cambia el estado y pongan el control AHÍ, no en las tres funciones que la llaman; (2) hagan la lista de cada línea de su contrato que llame a una dirección que no controlan —un envío de ether, un token ajeno, un aviso al receptor— y comprueben que antes de esa línea el estado ya quedó en su sitio.", { y: 5.4, h: 1.2, size: 13 });
    s.addNotes("3 minutos. Es la lámina que se dicta. Pedir que copien la frase del recuadro palabra por palabra: resume el hallazgo de la compuerta y la reentrada de la S9 en una sola idea. La nota del front-running es honestidad del docente sobre su propio contrato: se verificó que comprarReventa no se defiende de eso, y no se va a arreglar hoy, porque la defensa (compromiso y revelación, o una subasta por lotes) es tema de la S14. Decirlo en clase es el ejemplo de la conducta que se les va a exigir en la defensa de la S8.");
  }

  {
    const s = await D.lamina({ kicker: "B.16 · su parte · 12 minutos", titulo: "Su sexto intento", ic: "martillo", tituloSize: 31 });
    D.parrafo(s, "El laboratorio no termina al correr las quince pruebas. Termina cuando cada pareja escribe un intento propio y demuestra si falla o si funciona.", { y: 1.85, h: 0.55, size: 13.5 });
    D.pasos(s, [
      ["ELIJAN UNA FAMILIA", "De la tabla B.14. Un ejemplo que no está probado: ¿y si el comprador de la reventa fuera un contrato sin onERC721Received?"],
      ["ESCRÍBANLO", "Una función más en su copia de un atacante y una prueba más en su copia del archivo de pruebas. La copia: nunca el original."],
      ["CÓRRANLO", "Si revierte: anoten con qué error y desde qué línea del contrato sale. Si pasa: anoten qué supuesto rompieron y qué ganaron."],
      ["DEFIÉNDANLO", "Dos frases: a qué familia pertenece su intento y qué demostró el resultado. Un intento que falla enseña tanto como uno que funciona."],
    ], { y: 2.5, alto: 0.8, gap: 0.1, anchoEt: 3.2, size: 12 });
    D.parrafo(s, "Evidencia del bloque: la captura de «15 passing», su sexto intento con su prueba, y las dos frases que lo defienden.", { y: 6.2, h: 0.55, size: 12.5, color: C.ocre });
    s.addNotes("12 minutos. Es la parte larga del bloque y hay que protegerla del reloj. Circular. Ideas que suelen salir y vale la pena empujar: un comprador que es un contrato sin onERC721Received (¿qué pasa?), comprarse a sí mismo desde dos contratos del mismo dueño, poner en venta una entrada ya usada, revender después de marcarla usada, un bot que se adelanta a una oferta recién publicada (esa SÍ funciona, y es la del recuadro de B.15). Si una pareja se bloquea, darle el ejemplo de la lámina y que lo escriba: el objetivo es que corran un experimento propio, no que lo inventen de cero.");
  }

  await verificacion({
    kicker: "Verificación · bloque B",
    titulo: "Lo que el ataque debió dejar claro",
    preguntas: [
      "¿Por qué el bloqueo de la transferencia no está en ninguna función pública, y dónde sí está?",
      "La compuerta seguía abierta mientras corría el código del comprador. ¿Por qué eso bastaba para romper el tope?",
      "El pago por fuera funciona y no se puede arreglar. ¿En qué se diferencia del hallazgo de la compuerta?",
      "Enuncien la regla general: ¿dónde se pone un control, y qué hay que hacer antes de llamar a código ajeno?",
    ],
    notas: "3 minutos, en parejas. Respuestas: (1) está en _update, el gancho heredado de ERC721 por el que pasa toda transferencia; las funciones de mover vienen del padre y no están escritas en el archivo; (2) porque durante ese instante cualquier transferencia pasaba el control de _update, así que el atacante podía sacar otra entrada suya sin oferta, sin precio y sin tope; (3) el de la compuerta era un fallo del contrato y se tapó con tres líneas; el pago por fuera no es un fallo, es el límite de lo que un contrato puede hacer cumplir, y no hay línea que lo arregle; (4) el control va en el punto por donde pasa el estado, no en cada puerta; y antes de entregar el control a código ajeno el estado debe quedar cerrado. La pausa de 10 minutos va después de esta lámina.",
  });

  /* ================================================================
     BLOQUE C · 40 minutos
     ================================================================ */

  {
    const s = await D.divisor({
      letra: "C", titulo: "Su propio contrato",
      sub: "Las cuatro pasadas, aplicadas aquí y ahora al contrato que su equipo expone en la Sesión 8. Con la ficha de lectura en la mano.",
      minutos: "APROXIMADAMENTE 30 MINUTOS · POR EQUIPO",
      ic: "diana",
    });
    s.addNotes("Transición después de la pausa (30 s). Repartir la ficha de lectura impresa: material/proyecto/ficha-lectura-contrato.pdf. Decir de entrada que esto no es una tarea para la casa: se hace aquí, con el docente en el salón, porque la mitad de los equipos va a descubrir que no puede responder la pasada 2 de su propio contrato y es mejor que lo descubran ahora. Y recordar lo que acabó de pasar en el bloque B: el contrato del docente tenía un hueco, así que nadie en este salón está por encima del método.");
  }

  {
    const s = await D.lamina({ kicker: "C.1 · el trabajo del bloque", titulo: "Las cuatro pasadas, sobre lo suyo", ic: "lupa", tituloSize: 28 });
    D.parrafo(s, "Cinco o seis equipos, cuarenta minutos. Cada equipo abre su contrato, hace las cuatro pasadas en orden y llena la ficha. El docente circula.", { y: 1.85, h: 0.55, size: 13.5 });
    D.tabla(s, ["pasada", "qué llenan en la ficha", "min"], [
      ["1 · ¿Qué promete?", "La lista de funciones públicas y eventos, y una frase por cada una: qué promete ese nombre.", "8"],
      ["2 · ¿Quién manda?", "Cada dirección privilegiada, con dos columnas: qué puede y qué NO puede. Y qué pasa si se pierde esa clave.", "8"],
      ["3 · ¿Y el dinero?", "Por dónde entra, dónde se queda y por dónde sale. Si no entra dinero, escriban por qué no y qué custodia en su lugar.", "8"],
      ["4 · ¿Qué pasa si…?", "Tres supuestos del contrato, con su familia de la tabla B.14, y quién gana si cada uno es falso.", "10"],
    ], { y: 2.5, h: 2.6, colW: [2.6, 8.293, 1.2], size: 11 });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "La ficha de lectura",
      x: M, y: 5.2, w: CW, h: 1.3,
      texto: "material/proyecto/ficha-lectura-contrato.pdf. Se llena a mano, en el salón, y se entrega firmada por el equipo. Es el insumo de la defensa de la Sesión 8: lo que no esté en la ficha no se puede alegar en la exposición.",
      size: 12.5,
    });
    s.addNotes("4 minutos de instrucción y 36 de trabajo. Los tiempos de la columna son una guía, no un cronómetro; lo que no se negocia es el orden. Si un equipo todavía no tiene contrato, hace las cuatro pasadas sobre el borrador que tenga, aunque no compile: el método funciona igual y la conversación es la misma. Si un equipo tiene el contrato escrito con IA y no sabe por dónde empezar, empieza por la pasada 1, que no exige entender nada: solo listar nombres. Para la pasada 4, dejar proyectada la tabla B.14 de las cinco familias: es el andamio que hace la diferencia entre inventar amenazas y encontrarlas.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · la defensa de la S8", titulo: "Las tres preguntas de la defensa", ic: "pregunta", tituloSize: 28 });
    D.parrafo(s, "En la Sesión 8, a cada equipo se le hacen estas tres. Siempre, a todos, y no hay versión corta. No son una sorpresa: están aquí, hoy, por escrito.", { y: 1.85, h: 0.55, size: 13.5 });
    D.pasos(s, [
      ["¿QUIÉN MANDA?", "Señalen la línea donde se decide quién tiene privilegios. ¿Qué puede hacer esa dirección que nadie más puede, y qué pasa el día que se pierda?"],
      ["¿POR DÓNDE SALE EL DINERO?", "Señalen la única línea por la que el valor sale del contrato. Si hay dos, expliquen por qué hay dos. Si no sale nunca, digan qué queda atrapado."],
      ["¿QUÉ PASA SI…?", "Nombren el supuesto más frágil de su contrato y quién gana si es falso. Después muestren la línea que lo defiende, o admitan que no hay ninguna."],
    ], { y: 2.5, alto: 1.0, gap: 0.12, anchoEt: 3.8, size: 12.5 });
    D.parrafo(s, "Ninguna se responde con el deck ni con una búsqueda: se responden señalando una línea de SU archivo en la pantalla. Si nadie del equipo puede señalarla, el equipo no ha leído su contrato.", { y: 5.85, h: 0.8, size: 13, color: C.ocre });
    s.addNotes("5 minutos. Leerlas despacio y pedir que las copien tal cual en la ficha. La tercera admite «no hay ninguna línea que lo defienda» como respuesta válida: eso es honestidad técnica y se califica bien; es exactamente lo que hizo hoy el docente con el front-running de su propio contrato. Lo que no se acepta es no saber cuál es el supuesto frágil. Decir explícitamente que el docente elige a quién del equipo le pregunta, para que nadie reparta el trabajo en «el que entiende el contrato» y los demás. Logística de la S8: 12 minutos por equipo —siete de exposición y cinco de preguntas—, el contrato abierto en pantalla y no diapositivas sobre el contrato, y la ficha entregada antes de la sesión.");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · el elefante en el salón", titulo: "Escribir contratos con ayuda de IA", ic: "engranaje", tituloSize: 27 });
    D.enunciado(s, "El problema no es usar la IA. El problema es no poder defender lo que produjo.", { y: 1.85, h: 1.3, size: 19, line: C.violeta });
    D.dosColumnas(s,
      { et: "Lo que es legítimo", texto: "Pedirle código, pedirle que explique una línea, pedirle alternativas y pedirle que critique su propio resultado. Usarla para leer más rápido un contrato ajeno. Nada de eso es trampa, y en la industria se hace todos los días." },
      { et: "Lo que no se sostiene", linea: C.rojo, color: C.rojo, texto: "Entregar líneas que nadie del equipo puede explicar. En la defensa no se pregunta quién escribió el código: se pregunta por qué está ahí. «Lo puso la IA» no es una respuesta a esa pregunta." },
      { y: 3.3, h: 2.0, size: 12.5 });
    await D.ficha(s, {
      tipo: "pregunta", etiqueta: "La regla, sin moralina",
      x: M, y: 5.4, w: CW, h: 1.35,
      texto: "Si nadie del equipo sabe por qué una línea está ahí, esa línea se borra o se entiende. Las dos salidas valen y las dos exigen trabajo. La tercera —dejarla y esperar que no pregunten— es la que cuesta la nota.",
      size: 12.5,
    });
    s.addNotes("5 minutos. Tono: ni sermón ni permiso. El argumento es práctico, no moral, y el bloque B lo acaba de demostrar: el hueco de la compuerta estaba en un contrato bien escrito, con pruebas en verde, y lo encontró una persona haciendo cuatro preguntas en orden. Lo que no hay que esconder es lo otro: esa misma herramienta, bien usada, es un buen primer lector. La mejor forma de usarla hoy mismo es pedirle que haga las cuatro pasadas sobre su contrato y después verificar cada respuesta contra el archivo, línea por línea. Verificar, no creer: es la tesis del curso aplicada a la herramienta.");
  }

  await verificacion({
    kicker: "Verificación · bloque C",
    titulo: "Cada equipo, antes de salir del salón",
    preguntas: [
      "Sin mirar la ficha: ¿quién manda en su contrato, y qué es lo que NO puede hacer?",
      "¿Por dónde sale el valor de su contrato? Nombren la función exacta.",
      "Digan un supuesto de su contrato, a qué familia pertenece, y quién gana si resulta falso.",
      "¿Queda alguna línea en su contrato que nadie del equipo pueda explicar? ¿Cuál?",
    ],
    notas: "5 minutos, por equipo, en voz alta y rápido. El docente recoge la ficha o una foto: sirve para preparar las preguntas de la S8. Tres señales de alarma que hay que atender hoy mismo: un equipo que no puede responder la 1 todavía no sabe quién administra su sistema; un equipo que en la 3 no logra nombrar una familia de la tabla B.14 no hizo la pasada 4; y un equipo que responde «ninguna» a la 4 sin haber mirado línea por línea casi siempre está equivocado, así que conviene pedirle que señale tres líneas al azar y las explique.",
  });

  /* ================================================================
     CIERRE
     ================================================================ */

  await D.preguntaSemana({
    pregunta: "El hueco de la compuerta se tapó con tres líneas. El pago por fuera no se puede tapar con ninguna. ¿Cuál de las dos cosas es su supuesto más frágil?",
    trabajo: [
      "Laboratorio de hoy: captura de «15 passing», su sexto intento con su prueba, y las dos frases que lo defienden, con la familia a la que pertenece.",
      "Ficha de lectura del contrato del equipo, completa y firmada. Se entrega antes de la S8: es el insumo de la exposición.",
      "El laboratorio de la subasta (laboratorios-evm/guias/s07-subasta-patrones.pdf, 16 páginas) pasa a TRABAJO AUTÓNOMO y sigue siendo evidencia evaluable: las 23 pruebas en verde y la tabla de gas push frente a pull.",
      "Traer el portátil con Node.js 22 y el repositorio instalado: la S8 es en la terminal, y arranca con las exposiciones.",
    ],
    notas: "2 minutos. La pregunta se retoma al abrir la S8 y conecta con la S9 (reentrada y MEV) y con la S14 (los acuerdos por fuera de un protocolo DeFi). Insistir en el tercer punto: la guía de la subasta está completa, con cada paso y su salida esperada, y su evidencia se entrega igual; lo que cambió es que el tiempo de clase se usó en lo que no se puede hacer solo.",
  });

  {
    const s = await D.cierre({
      frase: "Si no puedes responder las cuatro pasadas sobre tu propio contrato, ese contrato todavía no es tuyo.",
      sub: "Hoy leyeron un contrato ajeno con método, le encontraron un hueco real que su autor no había visto, y vieron también dónde termina su poder. La próxima sesión ese método se vuelve público: cada equipo defiende el suyo delante del curso.",
      proxima: "Sesión 8 · exposición de contratos, Hardhat y pruebas automatizadas",
    });
    s.addNotes("Cierre (1 minuto). Repetir la frase y no suavizarla. Recordar que las tres preguntas de la defensa están en la lámina C.2 y en la ficha: nadie puede decir que no las sabía. Y dejar las dos últimas ideas del día en el aire: el contrato más cuidado del curso tenía un hueco que nadie había visto, y aun arreglado pierde contra un acuerdo entre dos personas en una esquina. Saber dónde termina el poder de la herramienta es lo que separa a un ingeniero de un entusiasta.");
  }

  return D.guardar(path.join(__dirname, "Sesion-07-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
