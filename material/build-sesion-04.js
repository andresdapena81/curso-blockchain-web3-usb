/* =====================================================================
   Sesión 04 · Consenso, incentivos y el trilema
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 04 · CONSENSO, INCENTIVOS Y EL TRILEMA", titulo: "Sesión 04 · Consenso, incentivos y el trilema" });
  const { C, F, M, CW, pres } = D;

  /* ---------------------------------------------------------- apertura */
  await D.portada({
    kicker: "SESIÓN 04 · UNIDAD I · FUNDAMENTOS",
    titulo: "CONSENSO,\nINCENTIVOS\nY EL TRILEMA",
    sub: "Mil computadores que no se conocen, que no confían entre sí y que tienen que ponerse de acuerdo en un solo orden de los hechos.",
    palabra: "ACORDAR",
    ic: "red",
    notas: "Cierra la Unidad I. La S3 dejó una cadena que se valida sola, pero no respondió cuál de dos cadenas válidas es la verdadera. Eso es lo que resuelve el consenso.",
  });

  await D.agenda({
    intro: "Hoy cierra la Unidad I. Tres momentos en clase, y una cuarta pieza que se lleva para la casa: el laboratorio que convierte la teoría en código.",
    bloques: [
      ["A", "CONSENSO E INCENTIVOS", "Bizantinos, prueba de trabajo y de participación, finalidad y trilema.", "~80 min"],
      ["B", "ACTIVIDAD · EL CASO ESTONIA", "Presentación del encargo en equipos. Se expone la próxima sesión.", "~45 min"],
      ["C", "QUIZ 1 · UNIDAD I", "Individual, sin apuntes. Sesiones 1 a 4.", "30 min"],
      ["D", "LABORATORIO 04 · PARA LA CASA", "Minería y ataque del 51 % en Python.", "se asigna"],
    ],
    notas: "Hay una pausa de 10 minutos entre B y C. El Quiz va al final para no cortar la teoría. El bloque D se explica en 5-8 minutos al cierre: el laboratorio se resuelve fuera de clase con su guía en PDF.",
  });

  await D.objetivo({
    objetivo: "Comparar mecanismos de consenso y justificar cuál conviene a un problema concreto, con sus costos a la vista.",
    preguntas: [
      "¿Cómo se ponen de acuerdo participantes que no confían entre sí y pueden mentir?",
      "¿Por qué hace falta gastar algo escaso —energía o capital— para votar?",
      "¿Qué es exactamente una bifurcación, y cuándo una transacción es definitiva?",
      "¿Por qué ningún diseño consigue a la vez descentralización, seguridad y escala?",
    ],
    ra: "RA2 · Comparar mecanismos de consenso y justificar la elección de una arquitectura frente a un problema concreto.",
  });

  await D.glosario({
    items: [
      ["BFT", "Byzantine Fault Tolerance", "Tolerancia a fallas bizantinas: el sistema sigue acordando aunque algunos participantes mientan o actúen de forma arbitraria."],
      ["PoW", "Proof of Work · prueba de trabajo", "Derecho a proponer el siguiente bloque ganado gastando cómputo verificable. Bitcoin."],
      ["PoS", "Proof of Stake · prueba de participación", "Derecho a proponer y votar ganado inmovilizando capital que se puede perder. Ethereum desde 2022."],
      ["PoA", "Proof of Authority · prueba de autoridad", "Un conjunto conocido y fijo de validadores identificados. Redes permisionadas y de prueba."],
      ["PBFT", "Practical BFT", "Protocolo clásico (1999) de acuerdo por rondas de votación entre nodos conocidos. Finalidad inmediata."],
      ["DPoS", "Delegated Proof of Stake", "Los tenedores eligen a un grupo pequeño de productores de bloques que se turnan."],
      ["Finalidad", "Finality", "El punto a partir del cual revertir una transacción es imposible o prohibitivamente caro."],
      ["Reorg", "Reorganización", "La red abandona los últimos bloques de su cadena porque apareció otra con más peso."],
    ],
  });

  /* ================================================================ A */
  await D.divisor({ letra: "A", titulo: "Consenso e incentivos", sub: "El acuerdo entre desconocidos no se consigue con criptografía sola. Se consigue haciendo que mentir salga caro.", minutos: "APROXIMADAMENTE 80 MINUTOS", ic: "red" });

  {
    const s = await D.lamina({ kicker: "A.1 · de dónde venimos", titulo: "Dos cadenas válidas. ¿Cuál es la buena?", ic: "bifurca", tituloSize: 27 });
    D.parrafo(s, "En la Sesión 3 construimos una cadena que se valida sola: cada firma verifica, cada bloque apunta al hash del anterior, cada raíz de Merkle coincide. Pero quedó un hueco perfectamente delimitado.", { y: 1.9, h: 0.9, size: 14.5 });
    D.nodo(s, { x: M, y: 3.05, w: 1.6, h: 0.7, titulo: "BLOQUE 99", fill: C.superf });
    D.flecha(s, M + 1.6, 3.4, M + 2.3, 3.4, C.tinta, 1.75);
    D.nodo(s, { x: M + 2.3, y: 3.05, w: 1.6, h: 0.7, titulo: "BLOQUE 100", fill: C.superf });
    D.flecha(s, M + 3.9, 3.25, M + 4.8, 2.85, C.naranja, 2);
    D.flecha(s, M + 3.9, 3.55, M + 4.8, 3.95, C.violeta, 2);
    D.nodo(s, { x: M + 4.8, y: 2.5, w: 3.0, h: 0.7, titulo: "101-A · Ana paga a Beto", line: C.naranja, fill: C.blanco });
    D.nodo(s, { x: M + 4.8, y: 3.6, w: 3.0, h: 0.7, titulo: "101-B · Ana paga a Carla", line: C.violeta, fill: C.blanco });
    D.parrafo(s, "Los dos bloques son impecables. Las dos cadenas pasan todas las validaciones del laboratorio. Pero Ana solo tenía dinero para uno de los dos pagos.", { x: M + 8.1, y: 2.55, w: CW - 8.1, h: 1.8, size: 13 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta de hoy", x: M, y: 4.75, w: CW, h: 1.45, texto: "La validez dice qué cadenas son posibles. El consenso dice cuál de ellas es la historia. Sin consenso vuelve el doble gasto de la Sesión 1 — ahora con criptografía perfecta.", size: 14 });
    s.addNotes("Esta lámina conecta directamente con el doble gasto de la S1: la criptografía no impide el doble gasto, solo impide falsificar firmas. El orden lo decide el consenso.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · el problema, formulado en 1982", titulo: "Los generales bizantinos", ic: "bandera", tituloSize: 29 });
    D.parrafo(s, "Lamport, Shostak y Pease plantearon el problema como una alegoría militar. Varios generales rodean una ciudad y deben decidir juntos: atacar o retirarse. Solo se comunican por mensajeros. Y algunos generales son traidores.", { y: 1.9, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "Lo que hace difícil el problema", items: ["Un ataque a medias es peor que no atacar: todos los leales deben decidir lo mismo.", "Un traidor puede decirle «ataquemos» a uno y «retirémonos» a otro.", "Nadie puede distinguir, desde fuera, a un leal de un traidor."] },
      { et: "Lo que se exige a una solución", items: ["Acuerdo: todos los leales toman la misma decisión.", "Validez: si todos los leales proponían lo mismo, eso se decide.", "Terminación: la decisión llega, no se espera para siempre."] },
      { y: 3.05, h: 2.5, size: 13 });
    D.parrafo(s, "«Bizantino» significa aquí: un participante que puede fallar de cualquier forma, incluida la mentira deliberada y coordinada. No solo apagarse.", { y: 5.8, h: 0.7, size: 13, color: C.ocre });
    s.addNotes("Lamport, Shostak y Pease (1982), The Byzantine Generals Problem, ACM TOPLAS. Diferenciar falla por caída (crash) de falla bizantina: la segunda es la que importa en una red abierta.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · el límite matemático", titulo: "Hacen falta más de dos tercios honestos", ic: "balanza", tituloSize: 27 });
    D.parrafo(s, "El resultado clásico: con votación entre participantes conocidos, el acuerdo solo es posible si los traidores son menos de un tercio. Con f traidores, se necesitan al menos 3f + 1 participantes.", { y: 1.9, h: 0.9, size: 14.5 });
    D.tabla(s, ["traidores (f)", "mínimo de participantes", "por qué"], [
      ["1", "4", "Con 3, un traidor puede empatar a los dos leales entre sí y nadie sabe a quién creerle."],
      ["2", "7", "Cualquier grupo de 5 que decida ya contiene al menos 3 leales: la mayoría del grupo es honesta."],
      ["10", "31", "La proporción no cambia al crecer: siempre menos de un tercio."],
    ], { y: 3.0, h: 2.0, colW: [2.2, 2.9, 6.993], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Por qué este número va a reaparecer", x: M, y: 5.2, w: CW, h: 1.5, texto: "El «un tercio» es el umbral de seguridad de la finalidad en Ethereum, de PBFT y de casi todos los protocolos por votación. Cuando alguien concentra un tercio del poder de voto, deja de ser un problema de reputación y pasa a ser un problema de seguridad.", size: 13 });
    s.addNotes("No demostrar el teorema. Basta la intuición del caso f=1, n=3: el general leal A recibe 'atacar' de B y 'retirarse' de C y no puede saber cuál es el traidor.");
  }

  {
    const s = await D.lamina({ kicker: "A.3b · el porqué, con un dibujo", titulo: "Con tres no alcanza; con cuatro, sí", ic: "bandera", tituloSize: 27 });
    D.parrafo(s, "Vale la pena ver de dónde sale ese «un tercio», porque es la intuición que sostiene toda la sesión. Imaginen tres generales: uno es traidor.", { y: 1.85, h: 0.65, size: 14 });
    D.dosColumnas(s,
      { et: "Con 3 generales · el traidor gana", linea: C.rojo, color: C.rojo, texto: "El general A es leal y quiere decidir con B y C. Pero C es traidor: le dice a A «ataquemos» y a B «retirémonos». A recibe un «atacar» (de C) y un «retirar» (de B, que sí es leal y propuso retirar). A ve un empate: un voto por cada opción, y no tiene forma de saber cuál viene del traidor. Cualquier regla que elija puede dejarlo actuando distinto que B. No hay solución." },
      { et: "Con 4 generales · la mayoría honesta manda", texto: "Ahora hay 3 leales y 1 traidor. Cada leal reúne los votos de los demás. El traidor puede mentirle a uno, pero los 3 leales se comunican entre sí lo que recibieron: al comparar notas, el voto contradictorio del traidor queda en evidencia y en minoría. Los 3 leales convergen en la misma decisión. El traidor no alcanza a romper el acuerdo." },
      { y: 2.65, h: 2.75, size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La regla general", x: M, y: 5.5, w: CW, h: 1.2, texto: "Para tolerar f traidores hacen falta 3f + 1 participantes: así, quitando a los f mentirosos y a los f que podrían no responder a tiempo, todavía queda una mayoría honesta clara. Menos de eso, y el traidor puede forzar un empate.", size: 12.5 });
    s.addNotes("Es la intuición del teorema de Lamport-Shostak-Pease (1982), sin la demostración. El punto: el traidor gana cuando puede fabricar un empate, y con 3f+1 nunca puede.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · el obstáculo de una red abierta", titulo: "Votar no sirve si crear votantes es gratis", ic: "persona", tituloSize: 27 });
    D.parrafo(s, "Los protocolos de votación clásicos suponen que se sabe quién vota. En una red abierta cualquiera puede crear mil identidades en un minuto: basta generar mil pares de claves, como hicimos en la Sesión 3.", { y: 1.9, h: 0.95, size: 14.5 });
    D.enunciado(s, "Ataque Sybil: una sola persona finge ser una multitud para ganar cualquier votación que cuente cabezas.", { y: 3.05, h: 1.25, size: 19 });
    D.parrafo(s, "La salida de Nakamoto fue no contar identidades, sino algo que no se puede fabricar gratis. El voto se ata a un recurso escaso del mundo físico:", { y: 4.5, h: 0.6, size: 14 });
    const recursos = [["PRUEBA DE TRABAJO", "un voto por unidad de cómputo gastado"], ["PRUEBA DE PARTICIPACIÓN", "un voto por unidad de capital inmovilizado"], ["PRUEBA DE AUTORIDAD", "un voto por identidad legal verificada"]];
    recursos.forEach((r, i) => {
      const x = M + i * (CW / 3);
      D.caja(s, { x: x + 0.05, y: 5.2, w: CW / 3 - 0.2, h: 1.3, fill: i === 0 ? C.blanco : C.superf, sombra: false, line: i === 0 ? C.naranja : C.tinta });
      D.etiqueta(s, r[0], { x: x + 0.3, y: 5.35, w: CW / 3 - 0.6, color: i === 0 ? C.ocre : C.tinta, size: 10 });
      D.parrafo(s, r[1], { x: x + 0.3, y: 5.75, w: CW / 3 - 0.6, h: 0.65, size: 12.5 });
    });
    s.addNotes("Sybil viene del libro sobre una paciente con personalidad múltiple; el término lo introdujo John Douceur (2002). La tercera opción renuncia a la apertura: vuelve a haber una lista de quién puede votar.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · prueba de trabajo · el mecanismo", titulo: "Buscar un número que nadie puede adivinar", ic: "martillo", tituloSize: 27 });
    D.codigo(s, `# el minero prueba nonces hasta que el hash
# del encabezado quede por debajo del objetivo
objetivo = 2 ** (256 - dificultad_en_bits)

nonce = 0
while True:
    encabezado = anterior + raiz_merkle + str(nonce)
    h = int(sha256(encabezado), 16)
    if h < objetivo:
        break          # bloque encontrado
    nonce += 1`, { x: M, y: 1.9, w: 6.7, h: 3.6, lang: "py", titulo: "minar, en diez líneas", size: 11.5 });
    const puntos = [
      ["DIFÍCIL DE ENCONTRAR", "No hay atajo: el hash es impredecible (Sesión 2). Solo queda probar, en promedio 2^bits veces."],
      ["TRIVIAL DE VERIFICAR", "Cualquier nodo recalcula un único hash y compara. Un teléfono verifica lo que costó una bodega de máquinas."],
      ["IMPOSIBLE DE REUSAR", "El nonce vale solo para ese encabezado. Cambiar una transacción cambia la raíz y obliga a empezar de cero."],
    ];
    puntos.forEach((p, i) => {
      const y = 1.9 + i * 1.22;
      D.caja(s, { x: M + 6.95, y, w: CW - 6.95, h: 1.08, fill: C.blanco, sombra: false, lw: 1.25 });
      D.etiqueta(s, p[0], { x: M + 7.2, y: y + 0.1, w: CW - 7.4, size: 10 });
      D.parrafo(s, p[1], { x: M + 7.2, y: y + 0.44, w: CW - 7.4, h: 0.6, size: 11.5, ls: 1.12 });
    });
    D.parrafo(s, "Esa asimetría —caro de producir, barato de comprobar— es toda la idea. Es el «hashcash» de Adam Back (1997) que vimos en la Sesión 1, puesto a ordenar bloques.", { y: 5.75, h: 0.75, size: 13.5 });
    s.addNotes("En Bitcoin el objetivo no es exactamente 2^(256-bits) sino un valor codificado en el campo 'bits' del encabezado, pero la idea es idéntica. Se hace con doble SHA-256.");
  }

  {
    const s = await D.lamina({ kicker: "A.5b · prueba de trabajo · con números reales", titulo: "El mismo ejemplo, ejecutado de verdad", ic: "martillo", tituloSize: 26 });
    D.parrafo(s, "Pongámoslo a correr. Dificultad de 8 bits: el hash gana si empieza por «00» en hexadecimal (los primeros 8 bits en cero). El encabezado es fijo; lo único que cambia es el nonce.", { y: 1.85, h: 0.7, size: 13.5 });
    D.codigo(s, `sha256("USB-bloque-101|" + nonce)

nonce = 0   ->  4281b7665d49d7dc...   empieza por 42   NO sirve
nonce = 1   ->  ba4342581e4161a3...   empieza por ba   NO sirve
nonce = 2   ->  73c0e9596636af0f...   empieza por 73   NO sirve
   ...
nonce = 49  ->  00db8fc8ef82dc97...   empieza por 00   GANA`, { x: M, y: 2.7, w: 7.7, h: 2.85, lang: "py", titulo: "búsqueda real del nonce", size: 11 });
    D.cifra(s, "50", "intentos hasta ganar, en este caso concreto", { x: M + 7.95, y: 2.7, w: CW - 7.95, h: 1.35, size: 30, tsize: 11.5 });
    D.parrafo(s, "En promedio se necesitan 2⁸ = 256 intentos para 8 bits. Bitcoin usa del orden de 80 bits: 2⁸⁰ intentos, imposible a mano, trivial de verificar (basta recalcular el hash del nonce 49 una vez).", { x: M + 7.95, y: 4.15, w: CW - 7.95, h: 1.4, size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Lo que hay que ver aquí", x: M, y: 5.55, w: CW, h: 1.18, texto: "Nadie pudo «adivinar» que el 49 ganaba: hubo que probar del 0 al 49 uno por uno. Pero cualquiera comprueba el resultado con un solo hash. Producir cuesta; verificar es gratis. Este es exactamente el laboratorio de la casa.", size: 12.5 });
    s.addNotes("Valores reales de sha256, reproducibles en vivo con Python. Dificultad 8 bits = objetivo 2^248 = primeros dos dígitos hex en 00. El promedio teórico es 256 intentos; aquí salieron 50 (la varianza es alta con pocos bits). El punto no es el número exacto, sino la asimetría producir/verificar.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · prueba de trabajo · el ritmo", titulo: "La dificultad se ajusta sola", ic: "reloj", tituloSize: 29 });
    D.parrafo(s, "Si entran más mineros, los bloques saldrían más rápido. Bitcoin lo corrige cada 2 016 bloques: compara el tiempo real con el esperado y mueve el objetivo.", { y: 1.9, h: 0.65, size: 14.5 });
    D.definicion(s, "nueva_dificultad = dificultad_anterior × (20 160 minutos esperados ÷ minutos reales de los últimos 2 016 bloques)", { x: M, y: 2.75, w: CW, h: 0.7, size: 12 });
    D.cifra(s, "10 min", "Tiempo objetivo entre bloques en Bitcoin. Se sostiene aunque la potencia total de la red cambie en órdenes de magnitud.", { x: M, y: 3.7, w: 3.9, h: 2.0, tsize: 11.5 });
    D.cifra(s, "2 016", "Bloques por período de ajuste: unas dos semanas. El ajuste está acotado a un factor de 4 por período.", { x: M + 4.1, y: 3.7, w: 3.9, h: 2.0, color: C.violeta, tsize: 11.5 });
    D.cifra(s, "Tasa de hash", "Intentos de hash por segundo de toda la red. Es la medida física de cuánto cuesta atacarla.", { x: M + 8.2, y: 3.7, w: CW - 8.2, h: 2.0, color: C.tinta, size: 24, tsize: 11.5 });
    D.parrafo(s, "Consecuencia práctica: el tiempo de bloque no mide lo rápido que es la red, mide una decisión de diseño. Diez minutos dan tiempo a que un bloque se propague antes de que aparezca el siguiente, y eso reduce las bifurcaciones.", { y: 5.95, h: 0.8, size: 13 });
    s.addNotes("El laboratorio opcional de esta sesión permite variar la dificultad y medir el tiempo por bloque. Ethereum PoW usaba bloques de ~13 s y por eso tenía muchas más bifurcaciones cortas (bloques ommer).");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · la regla de elección", titulo: "Gana la cadena con más trabajo acumulado", ic: "bloques", tituloSize: 27 });
    D.parrafo(s, "Cuando un nodo ve dos cadenas válidas, se queda con la que representa más trabajo total. Casi siempre coincide con la más larga, pero no es lo mismo: una cadena corta con bloques muy difíciles puede pesar más.", { y: 1.9, h: 0.95, size: 14.5 });
    D.tabla(s, ["cadena", "bloques", "dificultad por bloque", "trabajo acumulado"], [
      ["A", "6", "100", "600"],
      ["B", "5", "150", "750  ← la red elige esta"],
    ], { y: 3.1, h: 1.4, colW: [1.8, 2.0, 3.4, 4.893], size: 12.5 });
    D.dosColumnas(s,
      { et: "Por qué no «la más larga»", texto: "Si bastara con la longitud, un atacante podría fabricar muchos bloques de dificultad mínima en su propia red aislada y presentar una cadena larguísima sin haber gastado casi nada." },
      { et: "Qué vota realmente cada minero", texto: "Minar encima de un bloque es aceptarlo. No hay urnas: el voto es dónde decides gastar tu electricidad, y es irrevocable." },
      { y: 4.75, h: 1.9, size: 13 });
    s.addNotes("La expresión 'longest chain' del whitepaper se refiere a la de mayor proof-of-work, lo dice explícitamente en la sección 4.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · el ataque del 51 %", titulo: "Qué puede hacer una mayoría, y qué no", ic: "bicho", tituloSize: 28 });
    D.parrafo(s, "Quien controla más de la mitad de la tasa de hash puede producir, en privado, una cadena que termine alcanzando y superando a la pública. Es poderoso. Pero tiene límites muy precisos.", { y: 1.9, h: 0.95, size: 14.5 });
    D.dosColumnas(s,
      { et: "Sí puede", linea: C.rojo, color: C.rojo, items: ["Revertir sus propias transacciones recientes: pagar, recibir el producto y borrar el pago. Doble gasto.", "Excluir transacciones de otros: censura.", "Impedir que otros mineros cobren recompensas."] },
      { et: "No puede", items: ["Gastar monedas de otros: no tiene sus claves privadas.", "Crear monedas de la nada: los nodos rechazan el bloque inválido.", "Cambiar las reglas: los nodos completos las siguen verificando."] },
      { y: 3.05, h: 2.2, size: 12.5 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Ha ocurrido", x: M, y: 5.45, w: CW, h: 1.25, texto: "En redes pequeñas de prueba de trabajo, donde alquilar la mayoría del cómputo es barato. Ethereum Classic sufrió varias reorganizaciones profundas por esta vía en 2019 y 2020.", size: 12 });
    s.addNotes("El punto pedagógico: el atacante del 51 % reescribe el ORDEN, no la VALIDEZ. Por eso la separación entre validez y consenso de la lámina A.1 importa.");
  }

  {
    const s = await D.lamina({ kicker: "A.8b · el ataque, paso a paso", titulo: "Cómo se hace, en concreto, un doble gasto", ic: "bicho", tituloSize: 26 });
    D.parrafo(s, "«Revertir una transacción» suena abstracto. Así se ve de verdad, con una mayoría del cómputo:", { y: 1.85, h: 0.55, size: 14 });
    D.pasos(s, [
      ["PAGA EN PÚBLICO", "El atacante paga 10 monedas por un carro. La transacción entra en la cadena pública y el vendedor la ve confirmada."],
      ["RECIBE EL PRODUCTO", "El vendedor entrega el carro: para él, el pago ya ocurrió y está en la cadena."],
      ["MINA EN SECRETO", "En paralelo, el atacante mina su propia cadena alterna —desde un bloque anterior al pago— donde ese pago NO existe. No la publica todavía."],
      ["ADELANTA A LA PÚBLICA", "Como tiene más de la mitad del cómputo, su cadena secreta termina pesando más que la pública."],
      ["LA PUBLICA", "Suelta su cadena. La red, por la regla de A.7, cambia a la de más trabajo. El pago desaparece de la historia: el atacante conserva las 10 monedas y el carro."],
    ], { y: 2.4, alto: 0.68, gap: 0.09, anchoEt: 2.5, size: 12 });
    D.parrafo(s, "Cada bloque que el vendedor espera obliga al atacante a rehacer uno más en secreto: ahí entra la tabla siguiente.", { y: 6.34, h: 0.5, size: 12, color: C.ocre });
    s.addNotes("Vincular con A.1: el atacante no falsificó ninguna firma. Reescribió el ORDEN. El carro se entregó contra una confirmación que resultó reversible.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · cuánto esperar", titulo: "Cada bloque encima hace más difícil revertir", ic: "grafico", tituloSize: 27 });
    D.parrafo(s, "Nakamoto calculó en la sección 11 del whitepaper la probabilidad de que un atacante con una fracción q del cómputo alcance a la cadena honesta cuando va z bloques atrás. Esta es su propia tabla para que esa probabilidad baje de 0,1 %.", { y: 1.9, h: 0.95, size: 14 });
    D.tabla(s, ["fracción del atacante (q)", "bloques de espera (z)"], [
      ["10 %", "5"], ["20 %", "11"], ["30 %", "24"], ["40 %", "89"], ["45 %", "340"],
    ], { x: M, y: 3.05, w: 5.4, h: 3.1, colW: [3.0, 2.4], size: 12.5 });
    D.parrafo(s, "Dos lecturas de la tabla:", { x: M + 5.8, y: 3.05, w: CW - 5.8, h: 0.4, size: 14, bold: true, color: C.tinta });
    D.lista(s, [
      "Por debajo de un 30 %, esperar unos pocos bloques basta. Es la famosa regla de «seis confirmaciones».",
      "Cerca del 50 %, la espera crece sin límite: ya no hay número de confirmaciones que proteja.",
      "La seguridad es PROBABILÍSTICA. Nunca llega a cero; solo se vuelve despreciable.",
    ], { x: M + 5.8, y: 3.5, w: CW - 5.8, h: 2.7, size: 13, gap: 7 });
    D.parrafo(s, "Matiz: la fórmula del whitepaper es una aproximación que subestima el riesgo. El cálculo exacto (Rosenfeld, 2014) pide 32 bloques con q = 30 %. El laboratorio 04 lo demuestra.", { y: 6.2, h: 0.58, size: 11.5, color: C.ocre });
    s.addNotes("Valores de la tabla verificados contra el whitepaper, página 8. Nakamoto modela el avance del atacante con una Poisson; el conteo real es binomial negativo, con más varianza, así que el riesgo real es mayor. Con q=0,10 la cifra exacta es 6 y no 5; con q=0,30 es 32 y no 24. Las 6 confirmaciones son una convención, no una regla del protocolo.");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · el precio de la seguridad", titulo: "El costo energético es la seguridad misma", ic: "gas", tituloSize: 28 });
    D.parrafo(s, "No es un defecto de implementación que se pueda optimizar. En prueba de trabajo, lo que hace caro atacar es exactamente lo que se gasta en electricidad. Reducir el consumo sin cambiar de mecanismo es reducir la seguridad.", { y: 1.9, h: 0.95, size: 14.5 });
    D.dosColumnas(s,
      { et: "El argumento a favor", texto: "El gasto ata la historia al mundo físico. Reescribir la cadena exige volver a gastar la misma energía, y eso no se puede simular ni falsificar." },
      { et: "El argumento en contra", texto: "El consumo de Bitcoin se mide en el orden de países medianos. Una parte relevante proviene de fuentes fósiles, y el gasto no produce nada más que el propio orden." },
      { y: 3.05, h: 2.1, size: 13.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Cómo verificar las cifras", x: M, y: 5.4, w: CW, h: 1.3, texto: "Las estimaciones cambian cada mes. La referencia académica es el Cambridge Bitcoin Electricity Consumption Index (Universidad de Cambridge). Consulten el valor vigente antes de citar un número: esa es la costumbre que queremos.", size: 12.5 });
    s.addNotes("Evitar dar una cifra fija en la lámina: queda desactualizada en semanas. Mostrar el índice de Cambridge en vivo si hay conexión.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · prueba de participación", titulo: "Votar con capital que se puede perder", ic: "moneda", tituloSize: 28 });
    D.parrafo(s, "Ethereum abandonó la prueba de trabajo en septiembre de 2022 («the Merge»). Hoy el derecho a proponer y votar bloques se gana depositando ETH como garantía.", { y: 1.9, h: 0.65, size: 14.5 });
    D.pasos(s, [
      ["DEPÓSITO", "Un validador inmoviliza 32 ETH en el contrato de depósito. Ese capital es la garantía de su buen comportamiento."],
      ["TURNO (SLOT)", "El tiempo se divide en ranuras de 12 segundos. En cada una, el protocolo sortea un validador para proponer el bloque."],
      ["ATESTACIÓN", "Comités de validadores votan qué bloque consideran la cabeza de la cadena. Cada voto va firmado."],
      ["ÉPOCA", "32 ranuras forman una época: 6,4 minutos. Los puntos de control se votan por épocas."],
      ["FINALIDAD", "Cuando dos tercios del stake votan dos puntos de control seguidos, lo anterior queda finalizado: unos 13 minutos."],
    ], { y: 2.7, alto: 0.7, gap: 0.1, anchoEt: 2.6, size: 12 });
    s.addNotes("Esquema Gasper = Casper FFG (finalidad) + LMD-GHOST (elección de cabeza). No hace falta nombrar los algoritmos en clase; sí el umbral de dos tercios, que conecta con A.3.");
  }

  {
    const s = await D.lamina({ kicker: "A.11b · la línea de tiempo de Ethereum", titulo: "De la ranura a la finalidad, en números", ic: "reloj", tituloSize: 26 });
    D.parrafo(s, "Los tiempos de la prueba de participación no son arbitrarios: encajan unos dentro de otros. Vale la pena verlos juntos.", { y: 1.85, h: 0.55, size: 14 });
    D.nodo(s, { x: M, y: 2.6, w: 2.5, h: 1.15, titulo: "RANURA · 12 s", sub: "un validador\nsorteado propone\nun bloque", fill: C.blanco, line: C.naranja, subSize: 10.5 });
    D.flecha(s, M + 2.55, 3.17, M + 3.05, 3.17, C.tinta, 2);
    D.nodo(s, { x: M + 3.1, y: 2.6, w: 2.7, h: 1.15, titulo: "ÉPOCA · 6,4 min", sub: "32 ranuras.\nse vota un punto\nde control", fill: C.superf, subSize: 10.5 });
    D.flecha(s, M + 5.85, 3.17, M + 6.35, 3.17, C.tinta, 2);
    D.nodo(s, { x: M + 6.4, y: 2.6, w: 2.7, h: 1.15, titulo: "2 ÉPOCAS", sub: "dos puntos de\ncontrol seguidos\nvotados por ⅔", fill: C.superf, subSize: 10.5 });
    D.flecha(s, M + 9.15, 3.17, M + 9.65, 3.17, C.tinta, 2);
    D.nodo(s, { x: M + 9.7, y: 2.6, w: CW - 9.7, h: 1.15, titulo: "FINAL · ~13 min", sub: "revertir exige\nquemar ⅓ del\nstake total", fill: C.blanco, line: C.violeta, subSize: 10.5 });
    D.parrafo(s, "Un bloque aparece cada 12 segundos. Cada 32 bloques (6,4 minutos) los validadores votan un «punto de control». Cuando dos puntos de control seguidos reúnen dos tercios del stake, todo lo anterior queda finalizado: unos 13 minutos.", { y: 4.1, h: 1.0, size: 13 });
    await D.ficha(s, { tipo: "termino", etiqueta: "El «dos tercios» es el «un tercio» de A.3, al revés", x: M, y: 5.2, w: CW, h: 1.5, texto: "Se finaliza con dos tercios a favor porque eso garantiza que menos de un tercio quedó en contra o ausente — justo el umbral de los generales bizantinos. Y revertir algo finalizado exigiría que un tercio del stake se contradijera con sus propias firmas, lo que dispara el slashing (lámina siguiente). Por eso se llama finalidad económica: no es imposible, es ruinoso.", size: 12.5 });
    s.addNotes("La cadena de igualdades que amarra la sesión: 3f+1 (A.3) -> dos tercios para finalizar (aquí) -> un tercio como umbral de peligro (A.13). Es el mismo número visto desde tres lados.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · lo que hace creíble la garantía", titulo: "Slashing: el castigo automático", ic: "escudo", tituloSize: 29 });
    D.parrafo(s, "Una garantía solo disuade si se puede ejecutar sin juez. En prueba de participación, las faltas graves se prueban con las propias firmas del validador y el protocolo quema parte de su depósito.", { y: 1.9, h: 0.95, size: 14.5 });
    D.tabla(s, ["falta", "qué significa", "cómo se prueba"], [
      ["Doble propuesta", "Firmar dos bloques distintos para la misma ranura.", "Dos firmas del mismo validador sobre la misma ranura. No hay forma inocente de producirlas."],
      ["Doble voto", "Votar dos puntos de control distintos para la misma época.", "Dos atestaciones firmadas incompatibles."],
      ["Voto envolvente", "Emitir un voto que «rodea» a otro anterior, contradiciéndolo.", "Comparación de las dos atestaciones firmadas."],
    ], { y: 3.05, h: 2.25, colW: [2.5, 4.3, 5.293], size: 11.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Y si simplemente se apaga", x: M, y: 5.5, w: CW, h: 1.22, texto: "Estar desconectado no se castiga con slashing, sino con pequeñas pérdidas por inactividad. El castigo severo se reserva para lo que solo puede ser malicia o un error grave de operación.", size: 12.5 });
    s.addNotes("Aquí la criptografía de la S3 vuelve a ser protagonista: la prueba de la falta son dos firmas. El no repudio de las firmas es lo que hace posible el castigo automático.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · el riesgo que no está en el código", titulo: "La centralización que vuelve por la puerta de atrás", ic: "capas", tituloSize: 25 });
    D.parrafo(s, "32 ETH es mucho dinero, y operar un validador exige conocimiento. La mayoría de tenedores delega en servicios que operan validadores por ellos. El protocolo es descentralizado; el uso real puede no serlo.", { y: 1.9, h: 0.95, size: 14.5 });
    D.dosColumnas(s,
      { et: "Staking líquido", texto: "Protocolos que reciben ETH de muchos usuarios, operan los validadores y entregan a cambio un token negociable. Algunos han llegado a concentrar porcentajes cercanos al tercio del stake total." },
      { et: "Custodios y plataformas", texto: "Exchanges que hacen staking con los fondos de sus clientes. Pocos operadores, mucho stake, y además sujetos a órdenes de una sola jurisdicción." },
      { y: 3.05, h: 2.15, size: 13 });
    D.enunciado(s, "Recuerden A.3: un tercio del stake es el umbral que puede impedir la finalidad. Por eso la concentración no es un tema de reputación, es un tema de seguridad.", { y: 5.4, h: 1.3, size: 16, line: C.naranja });
    s.addNotes("No citar porcentajes exactos de un protocolo concreto: cambian cada mes. Invitar a consultar un tablero público de distribución del stake.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · comparación directa", titulo: "Prueba de trabajo frente a prueba de participación", ic: "balanza", tituloSize: 24 });
    D.tabla(s, ["criterio", "prueba de trabajo", "prueba de participación"], [
      ["Recurso escaso", "Electricidad y hardware especializado.", "Capital inmovilizado en la propia moneda."],
      ["Costo de atacar", "Comprar o alquilar más de la mitad del cómputo, y pagar la energía.", "Adquirir un tercio o dos tercios del stake, que además se pierde por slashing."],
      ["Finalidad", "Probabilística: nunca absoluta, crece con cada bloque.", "Económica: tras unos 13 minutos, revertir exige destruir un tercio del stake."],
      ["Consumo energético", "Muy alto, y es inseparable de la seguridad.", "Del orden de 99,9 % menor, según la propia fundación de Ethereum."],
      ["Barrera de entrada", "Hardware, energía barata, economía de escala.", "Capital. Los ricos votan más: tendencia a la concentración."],
      ["Recuperación tras un ataque", "Difícil: el hardware del atacante sigue existiendo.", "El protocolo puede quemar el stake atacante con consenso social."],
    ], { y: 1.9, h: 4.8, colW: [2.6, 4.75, 4.743], size: 11 });
    s.addNotes("Ninguna columna gana en todo. La pregunta correcta no es cuál es mejor sino qué propiedad valoro más para mi problema. Cifra de energía: ethereum.org, página sobre consumo energético.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · más allá de las redes públicas", titulo: "PoA, PBFT y DPoS: dónde tiene sentido cada uno", ic: "rejilla", tituloSize: 24 });
    D.tabla(s, ["mecanismo", "quién valida", "finalidad", "dónde encaja", "qué se sacrifica"], [
      ["PoA", "Pocos nodos identificados, elegidos de antemano.", "Rápida, por turnos.", "Redes de prueba, consorcios, redes internas.", "Apertura: hay que confiar en la lista."],
      ["PBFT y derivados", "Decenas de nodos conocidos que votan por rondas.", "Inmediata y determinista.", "Consorcios bancarios o de cadena de suministro.", "Escala: los mensajes crecen con el cuadrado de los nodos."],
      ["DPoS", "Un grupo pequeño elegido por votación de tenedores.", "Rápida.", "Redes públicas que priorizan velocidad.", "Descentralización: la votación suele capturarse."],
    ], { y: 1.9, h: 3.35, colW: [1.9, 2.8, 1.9, 2.8, 2.693], size: 11 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Conexión con la actividad de hoy", x: M, y: 5.5, w: CW, h: 1.2, texto: "El sistema estonio KSI publica su ancla en periódicos y lo opera una empresa conocida. ¿A cuál de estas filas se parece más? Guarden la respuesta: les va a servir para la tabla de la tarea T5.", size: 13 });
    s.addNotes("PBFT: Castro y Liskov (1999). Crecimiento cuadrático de mensajes = O(n²). No resolver la pregunta de Estonia: la tienen que trabajar ellos.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · teoría de juegos", titulo: "Por qué a un minero le conviene ser honesto", ic: "diana", tituloSize: 27 });
    D.parrafo(s, "El consenso no depende de que los participantes sean buenos. Depende de que hacer trampa rinda menos que seguir las reglas. Pongámosle números a un minero con el 30 % del cómputo.", { y: 1.9, h: 0.9, size: 14.5 });
    D.tabla(s, ["estrategia", "lo que gana", "lo que arriesga"], [
      ["Minar honestamente", "Unos 3 de cada 10 bloques, con su recompensa. Ingreso predecible.", "Casi nada: el costo de la energía, que ya asumió."],
      ["Intentar un doble gasto", "El valor de lo que revierte, si logra alcanzar a la cadena honesta.", "Cada confirmación que espere la víctima reduce su éxito (A.9). Si falla, pierde lo minado."],
      ["Atacar y tener éxito", "Un doble gasto puntual.", "La confianza en la moneda cae, y con ella el valor de sus propias recompensas y de su hardware."],
    ], { y: 2.95, h: 2.4, colW: [2.9, 4.5, 4.693], size: 11.5 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "El matiz honesto", x: M, y: 5.55, w: CW, h: 1.17, texto: "Eyal y Sirer (2013) mostraron la «minería egoísta»: un minero con bastante menos del 50 % puede ganar más que su parte ocultando bloques. La honestidad es dominante bajo ciertos supuestos, no siempre.", size: 12 });
    s.addNotes("Mensaje: el mecanismo es económico. Si cambian los incentivos (por ejemplo, recompensas muy bajas y comisiones muy volátiles), el análisis puede cambiar.");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · bifurcaciones", titulo: "Por qué el consenso produce cadenas rivales", ic: "bifurca", tituloSize: 27 });
    D.parrafo(s, "Dos mineros encuentran un bloque válido casi al mismo tiempo, en lados distintos del planeta. Durante unos segundos, una parte de la red ve uno y otra parte ve el otro. Nadie hizo trampa.", { y: 1.9, h: 0.95, size: 14.5 });
    const y0 = 3.2;
    ["98", "99", "100"].forEach((n, i) => {
      D.nodo(s, { x: M + i * 1.75, y: y0 + 0.55, w: 1.4, h: 0.65, titulo: n, fill: C.superf });
      if (i < 2) D.flecha(s, M + i * 1.75 + 1.4, y0 + 0.87, M + (i + 1) * 1.75, y0 + 0.87);
    });
    D.flecha(s, M + 4.9, y0 + 0.75, M + 5.7, y0 + 0.2, C.naranja, 2);
    D.flecha(s, M + 4.9, y0 + 1.0, M + 5.7, y0 + 1.5, C.violeta, 2);
    D.nodo(s, { x: M + 5.7, y: y0 - 0.15, w: 1.5, h: 0.65, titulo: "101-A", line: C.naranja, fill: C.blanco });
    D.nodo(s, { x: M + 5.7, y: y0 + 1.2, w: 1.5, h: 0.65, titulo: "101-B", line: C.violeta, fill: C.blanco });
    D.flecha(s, M + 7.2, y0 + 0.17, M + 7.9, y0 + 0.17, C.naranja, 2);
    D.nodo(s, { x: M + 7.9, y: y0 - 0.15, w: 1.5, h: 0.65, titulo: "102-A", line: C.naranja, fill: C.blanco });
    D.etiqueta(s, "LA RAMA A GANA", { x: M + 9.6, y: y0 + 0.02, w: 2.4, color: C.ocre, size: 10 });
    D.etiqueta(s, "101-B QUEDA HUÉRFANO", { x: M + 7.5, y: y0 + 1.37, w: 4.5, color: C.violetaOs, size: 10 });
    D.parrafo(s, "La bifurcación se resuelve sola en cuanto un bloque más se encadena en una de las ramas: todos los nodos cambian a la de más trabajo. Las transacciones del bloque abandonado que no estén en la rama ganadora vuelven al mempool.", { y: 5.35, h: 1.3, size: 13.5 });
    s.addNotes("Bloque huérfano (orphan / stale). En Ethereum PoW se llamaban 'ommer' o 'uncle' y recibían una recompensa parcial para no castigar a mineros mal conectados.");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · reorganización", titulo: "Lo que se ve confirmado puede desaparecer", ic: "alerta", tituloSize: 27 });
    D.parrafo(s, "Una reorganización ocurre cuando un nodo abandona uno o más bloques que ya había aceptado porque apareció una cadena más pesada. Para el usuario, una transacción «confirmada» vuelve a estar pendiente — o desaparece.", { y: 1.9, h: 0.95, size: 14.5 });
    D.pasos(s, [
      ["PROFUNDIDAD 1", "Muy frecuente y casi siempre inofensiva: la transacción suele volver a entrar en el bloque siguiente."],
      ["PROFUNDIDAD 2 A 6", "Rara en redes grandes. Es la zona donde un doble gasto dirigido tiene alguna posibilidad."],
      ["PROFUNDIDAD MAYOR", "En una red grande es un incidente grave o un ataque. En una red pequeña puede ser rutina."],
    ], { y: 3.05, alto: 0.72, anchoEt: 2.8 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "La consecuencia para quien programa", x: M, y: 5.5, w: CW, h: 1.22, texto: "Una aplicación que entrega un producto con la primera confirmación está aceptando riesgo de reorganización. En la Sesión 12 veremos cómo lo maneja una interfaz: esperar confirmaciones es una decisión de negocio.", size: 12.5 });
    s.addNotes("Este es un error real en integraciones: el backend marca 'pagado' al ver la transacción en un bloque y no vuelve a comprobar.");
  }

  {
    const s = await D.lamina({ kicker: "A.19 · cuando cambian las reglas", titulo: "Bifurcación blanda y bifurcación dura", ic: "engranaje", tituloSize: 27 });
    D.parrafo(s, "No toda bifurcación es accidental. Cambiar las reglas del protocolo también bifurca la red, y la diferencia está en si los nodos antiguos aceptan o no los bloques nuevos.", { y: 1.9, h: 0.65, size: 14.5 });
    D.tabla(s, ["", "bifurcación blanda (soft fork)", "bifurcación dura (hard fork)"], [
      ["Qué cambia", "Las reglas se vuelven MÁS estrictas.", "Las reglas se AMPLÍAN o cambian: algo antes inválido pasa a ser válido."],
      ["Nodos sin actualizar", "Siguen aceptando los bloques nuevos: son compatibles hacia atrás.", "Rechazan los bloques nuevos: quedan en otra cadena."],
      ["Riesgo", "Bajo, si la mayoría del cómputo o del stake la adopta.", "División permanente si una parte de la comunidad no está de acuerdo."],
      ["Ejemplo real", "SegWit en Bitcoin, 2017.", "Bitcoin Cash (2017). Ethereum y Ethereum Classic tras el hackeo de The DAO (2016)."],
    ], { y: 2.75, h: 3.1, colW: [2.2, 4.95, 4.943], size: 11.5 });
    D.parrafo(s, "El caso de The DAO vuelve en la Sesión 9: una bifurcación dura para revertir un robo. Técnicamente posible, filosóficamente explosivo.", { y: 6.05, h: 0.65, size: 13, color: C.ocre });
    s.addNotes("La división ETH/ETC es el mejor ejemplo de que la inmutabilidad también es una convención social: la mayoría decidió reescribir y una minoría se negó.");
  }

  {
    const s = await D.lamina({ kicker: "A.20 · la palabra que más se malinterpreta", titulo: "Finalidad: tres significados distintos", ic: "candado", tituloSize: 27 });
    D.tabla(s, ["tipo", "qué garantiza", "dónde", "cuánto tarda"], [
      ["Probabilística", "La probabilidad de reversión cae exponencialmente con cada bloque, pero nunca llega a cero.", "Bitcoin y toda la prueba de trabajo.", "Minutos a horas, según el monto en juego."],
      ["Económica", "Revertir es posible, pero exige destruir al menos un tercio del stake total por slashing.", "Ethereum desde 2022.", "Unos 13 minutos (dos épocas)."],
      ["Determinista", "Una vez decidido, el protocolo no puede revertirlo mientras se cumpla el supuesto de menos de un tercio de fallas.", "PBFT y protocolos de votación clásica.", "Segundos."],
    ], { y: 1.9, h: 3.35, colW: [2.3, 4.6, 2.6, 2.593], size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "La pregunta profesional", x: M, y: 5.5, w: CW, h: 1.2, texto: "Nunca pregunten «¿esta red tiene finalidad?». Pregunten: ¿qué tipo de finalidad, bajo qué supuesto, y cuánto tengo que esperar para el monto que estoy moviendo?", size: 13 });
    s.addNotes("Error típico en anteproyectos: 'la transacción es inmediata e irreversible'. En casi ningún sistema real son las dos cosas a la vez.");
  }

  {
    const s = await D.lamina({ kicker: "A.21 · el trilema", titulo: "Descentralización, seguridad, escala: elija dos", ic: "diana", tituloSize: 27 });
    const cx = M + 3.0, top = 2.1;
    D.linea(s, cx, top + 0.45, cx - 2.3, top + 3.9, C.tinta, 2);
    D.linea(s, cx, top + 0.45, cx + 2.3, top + 3.9, C.tinta, 2);
    D.linea(s, cx - 2.3, top + 3.9, cx + 2.3, top + 3.9, C.tinta, 2);
    D.nodo(s, { x: cx - 1.35, y: top, w: 2.7, h: 0.62, titulo: "DESCENTRALIZACIÓN", fill: C.naranja, line: C.naranja });
    D.nodo(s, { x: cx - 3.0, y: top + 3.62, w: 2.2, h: 0.62, titulo: "SEGURIDAD", fill: C.blanco, line: C.tinta });
    D.nodo(s, { x: cx + 0.8, y: top + 3.62, w: 2.2, h: 0.62, titulo: "ESCALA", fill: C.blanco, line: C.violeta });
    D.parrafo(s, "Término popularizado por Vitalik Buterin. No es un teorema: es una observación empírica sobre los diseños conocidos.", { x: M + 6.4, y: 1.95, w: CW - 6.4, h: 0.9, size: 13 });
    D.tabla(s, ["diseño", "prioriza", "cede"], [
      ["Bitcoin, Ethereum L1", "Descentralización y seguridad", "Escala: pocas transacciones por segundo"],
      ["Red de pocos validadores", "Seguridad y escala", "Descentralización"],
      ["Red rápida con muchos nodos débiles", "Descentralización y escala", "Seguridad"],
    ], { x: M + 6.4, y: 2.95, w: CW - 6.4, h: 2.35, colW: [2.1, 1.8, 1.793], size: 10.5 });
    D.parrafo(s, "Por qué es tan difícil: más transacciones por bloque exigen nodos más potentes, y nodos más caros significan menos personas capaces de verificar. La escala se paga en descentralización.", { x: M + 6.4, y: 5.5, w: CW - 6.4, h: 1.2, size: 12.5, color: C.ocre });
    s.addNotes("Las capas 2 (Sesión 16) son el intento de romper el trilema sacando la ejecución de la capa base sin perder su seguridad.");
  }

  {
    const s = await D.lamina({ kicker: "A.22 · de la teoría a la decisión", titulo: "Cómo elegir el consenso para un problema", ic: "jerarquia", tituloSize: 27 });
    D.pasos(s, [
      ["¿QUIÉN PUEDE PARTICIPAR?", "Cualquiera sin permiso → red pública (PoW o PoS). Un grupo conocido → permisionada (PoA, PBFT)."],
      ["¿CUÁNTOS SON?", "Decenas → votación clásica funciona. Miles o más → hace falta un mecanismo resistente a Sybil."],
      ["¿QUÉ FINALIDAD NECESITO?", "Pagos grandes o entrega inmediata → determinista o económica. Registro sin urgencia → probabilística basta."],
      ["¿DE QUIÉN ME PROTEJO?", "De los propios operadores → necesito descentralización real. Solo de terceros externos → quizá una base de datos firmada basta."],
      ["¿QUÉ CUESTA CADA ESCRITURA?", "Si el modelo de negocio no soporta pagar gas, una red pública no es viable, por buena que sea."],
    ], { y: 1.9, alto: 0.84, gap: 0.12, anchoEt: 3.5, size: 12 });
    s.addNotes("Estas cinco preguntas son las que se exigen en la justificación del anteproyecto (S6). Conectar con el árbol de decisión de la S1: la pregunta 4 es el paso de 'contra quién'.");
  }

  {
    const s = await D.lamina({ kicker: "A.23 · lo que hay que llevarse del bloque A", titulo: "Seis ideas que van al quiz y al proyecto", ic: "lista", tituloSize: 27 });
    const ideas = [
      "La validez dice qué cadenas son posibles; el consenso decide cuál es la historia.",
      "Sin identidades verificadas, votar exige atar el voto a un recurso escaso: cómputo, capital o autoridad.",
      "El atacante con mayoría reescribe el orden, no la validez: no puede gastar lo ajeno.",
      "Las bifurcaciones son normales; las reorganizaciones profundas son la señal de alarma.",
      "Finalidad hay de tres tipos, y cada una con su supuesto y su tiempo de espera.",
      "Ningún diseño gana en descentralización, seguridad y escala a la vez: se elige qué ceder.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.1, w: CW - 0.85, h: 0.55, size: 14.5, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
    s.addNotes("Pausa de 5 minutos antes del bloque B si el tiempo va justo.");
  }

  /* ================================================================ B */
  await D.divisor({ letra: "B", titulo: "Actividad · el caso Estonia", sub: "Se presenta con su propio deck. Trabajo en equipos de proyecto; se expone la próxima sesión, cinco minutos por equipo.", minutos: "APROXIMADAMENTE 45 MINUTOS", ic: "lupa" });

  {
    const s = await D.lamina({ kicker: "B.1 · por qué esta actividad está aquí", titulo: "El consenso aplicado a un caso real", ic: "lupa", tituloSize: 28 });
    D.parrafo(s, "La actividad de Estonia no es un tema aparte: es la teoría de hoy puesta a prueba. Para decidir si KSI es una cadena de bloques van a necesitar exactamente las herramientas del bloque A.", { y: 1.9, h: 0.95, size: 14.5 });
    D.tabla(s, ["lo que vieron hoy", "dónde lo van a usar en la actividad"], [
      ["El ancla de confianza de cada mecanismo (A.4, A.15)", "Tarea T5: ¿dónde está el ancla de KSI y quién la controla?"],
      ["Consenso entre partes que no confían entre sí (A.2)", "Tarea T5: ¿hay partes que no confían entre sí validando en KSI?"],
      ["Finalidad y reorganización (A.18, A.20)", "Tarea T6: ¿qué tendría que cambiar para que el veredicto se invirtiera?"],
    ], { y: 3.05, h: 2.2, colW: [5.3, 6.793], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Material de la actividad", x: M, y: 5.45, w: CW, h: 1.27, texto: "Guía en PDF para los estudiantes y deck de presentación aparte: «Actividad-04-El-caso-Estonia». Las reglas, las fuentes y la rúbrica están allí.", size: 13 });
    s.addNotes("Aquí se cambia al deck Actividad-04-El-caso-Estonia-DECK.pptx y se reparte el PDF.");
  }

  /* ================================================================ C */
  await D.divisor({ letra: "C", titulo: "Quiz 1 · Unidad I", sub: "Treinta minutos, individual y sin apuntes. Evalúa las sesiones 1 a 4: RA1 y RA2.", minutos: "30 MINUTOS · 12 % DE LA NOTA FINAL", ic: "documento" });

  {
    const s = await D.lamina({ kicker: "C.1 · condiciones", titulo: "Cómo es el quiz", ic: "documento", tituloSize: 30 });
    D.tabla(s, ["", "detalle"], [
      ["Formato", "12 preguntas de selección múltiple con única respuesta y 2 preguntas de respuesta corta."],
      ["Duración", "30 minutos exactos, en papel o en la plataforma del curso."],
      ["Qué entra", "S1 problema y doble gasto · S2 hash y Merkle · S3 firmas y anatomía de la cadena · S4 consenso, finalidad y trilema."],
      ["Qué no entra", "La actividad de Estonia, que se evalúa aparte. Ningún cálculo que exija calculadora."],
      ["Peso", "40 % del primer corte, 12 % de la nota final."],
      ["Reglas", "Individual. Sin apuntes, sin teléfono, sin asistentes de IA. Una sospecha fundada anula el quiz."],
    ], { y: 1.9, h: 4.1, colW: [2.2, 9.893], size: 12.5 });
    D.parrafo(s, "Las preguntas de respuesta corta piden explicar, no recitar: se califica que el razonamiento sea correcto aunque el vocabulario no sea exacto.", { y: 6.15, h: 0.55, size: 13, color: C.ocre });
    s.addNotes("El quiz y su clave están en material/evaluaciones/. La clave no se proyecta.");
  }

  /* ================================================================ D */
  await D.divisor({ letra: "D", titulo: "Para la casa · Laboratorio 04", sub: "La teoría de hoy, convertida en código que corre. No cabía en clase, así que se explica ahora y se resuelve en casa, con una guía paso a paso.", minutos: "TRABAJO AUTÓNOMO · NO CALIFICABLE · MUY RECOMENDADO", ic: "martillo" });

  {
    const s = await D.lamina({ kicker: "D.1 · qué es y por qué en casa", titulo: "Minería y ataque del 51 %, en Python", ic: "codigo", tituloSize: 26 });
    D.parrafo(s, "En una sesión de tres horas no cabe teoría + actividad + quiz + laboratorio. Así que este laboratorio se hace en casa: es la mejor forma de fijar lo de hoy, porque pasa de la diapositiva al código que ustedes ejecutan.", { y: 1.85, h: 0.95, size: 14 });
    D.dosColumnas(s,
      { et: "Por qué vale la pena hacerlo", items: ["Convierte en código lo que hoy solo se vio explicado.", "Refuerza justo lo que entra en el Quiz 1.", "No exige red, ni billetera, ni internet: solo Python.", "Trae un hallazgo que sorprende (D.2)."] },
      { et: "Cómo está pensado", items: ["Trabajo individual o en pareja, a su ritmo.", "No se califica: es refuerzo, no evidencia.", "Guía en PDF con cada paso explicado.", "Se resuelve completando funciones marcadas con TODO."] },
      { y: 2.95, h: 2.5, size: 12.5 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Dónde está todo", x: M, y: 5.55, w: CW, h: 1.15, texto: "Carpeta material/laboratorio-04. La guía exageradamente detallada está en el PDF «Guia-Laboratorio-04». Requisito único: Python 3.10 o superior. Nada más que instalar.", size: 12.5 });
    s.addNotes("Repartir el PDF de la guía por el canal del curso. Mostrar esta lámina y las tres siguientes en 5-8 minutos: solo explicar el qué y el porqué, no resolverlo en clase.");
  }

  {
    const s = await D.lamina({ kicker: "D.2 · las tres partes", titulo: "Lo que van a construir", ic: "capas", tituloSize: 28 });
    D.tabla(s, ["parte", "qué se programa", "qué lámina de hoy fija"], [
      ["1 · Prueba de trabajo", "minar() busca un nonce válido; verificar() comprueba en un hash.", "A.5 y A.5b (el ejemplo real)"],
      ["2 · Elección de cadena", "elegir la cadena de mayor trabajo acumulado, no la más larga.", "A.7"],
      ["3 · El ataque del 51 %", "la fórmula del whitepaper y una simulación que la contrasta.", "A.8, A.8b y A.9"],
    ], { y: 1.9, h: 2.4, colW: [2.8, 5.4, 3.893], size: 11.5 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "El hallazgo que da sentido a todo el laboratorio", x: M, y: 4.5, w: CW, h: 2.2, texto: "La tabla de Nakamoto (A.9) es una APROXIMACIÓN, y subestima el riesgo. La parte 3 les pide programar la fórmula del whitepaper, después una simulación bloque a bloque, y descubrir que no coinciden: la simulación da un riesgo mayor. El cálculo exacto (Rosenfeld, 2014) confirma que con un atacante del 30 % no bastan 24 confirmaciones, sino 32. Es la misma lección de la actividad de Estonia: un documento célebre repetido mil veces puede tener un error, y ustedes lo verifican con código en lugar de creerlo.", size: 12.5 });
    s.addNotes("El laboratorio ya está construido y probado: 32 pruebas en Python. La solución de referencia produce exactamente 6 y 32 confirmaciones para q=10% y q=30% con la fórmula exacta.");
  }

  {
    const s = await D.lamina({ kicker: "D.3 · cómo se corre", titulo: "Tres comandos, y a completar TODO", ic: "terminal", tituloSize: 27 });
    D.parrafo(s, "El laboratorio se guía por pruebas: al principio fallan, y está terminado cuando todas pasan. No hay que adivinar si está bien; las pruebas lo dicen.", { y: 1.85, h: 0.7, size: 14 });
    D.codigo(s, `cd material/laboratorio-04
python -m pip install pytest        # una sola vez
python -m pytest -q                 # al empezar: 32 en rojo

# se completan las funciones marcadas con TODO en consenso.py
# y se vuelve a correr hasta que las 32 pasen en verde
python consenso.py                  # el experimento completo`, { x: M, y: 2.65, w: CW, h: 2.5, lang: "py", titulo: "en la terminal, en casa", size: 11.5 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Cómo empezar de cero si algo se rompe", x: M, y: 5.35, w: CW, h: 1.35, texto: "La carpeta trae andamiaje/ con la versión intacta y solucion/ con la solución de referencia. Si se pierden, copian el andamiaje otra vez. La guía en PDF explica cada TODO, con las pistas y los errores frecuentes, uno por uno.", size: 12.5 });
    s.addNotes("Insistir: si la sala o el equipo no tiene pytest, la guía trae la instrucción de instalación. Solo depende de Python estándar (hashlib), sin librerías criptográficas externas.");
  }

  {
    const s = await D.lamina({ kicker: "D.4 · cómo se conecta", titulo: "Por qué importa aunque no se califique", ic: "diana", tituloSize: 27 });
    D.lista(s, [
      "Cada función que completan es una lámina de hoy vuelta código: minar es A.5, elegir cadena es A.7, el ataque es A.8-A.9.",
      "El Quiz 1 pregunta justo esto: quien hizo el laboratorio responde sin dudar.",
      "El hallazgo de la parte 3 es el mismo método de la actividad de Estonia: verificar en vez de creer.",
      "Es el primer código de consenso que escriben; la Unidad II construye software sobre estas ideas.",
    ], { y: 1.9, h: 2.9, size: 13.5, gap: 9 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Si alguien quiere ir más allá", x: M, y: 5.0, w: CW, h: 1.7, texto: "El laboratorio incluye un experimento que varía la dificultad y mide cuántos intentos toma minar, para ver con datos propios el crecimiento exponencial de A.5b. Quien lo corra y traiga su gráfica a la Sesión 5 tiene un punto extra de participación. Es opcional dentro de lo opcional, pero es justo el tipo de curiosidad que el curso premia.", size: 12.5 });
    s.addNotes("El punto extra es sugerencia; ajustar a la política de participación del docente. La gráfica sale de experimento_dificultad() en consenso.py.");
  }

  await D.preguntaSemana({
    pregunta: "Si mañana el 40 % del stake de Ethereum quedara en manos de un solo gobierno, ¿qué podría hacer ese gobierno y qué no? Respondan con lo visto hoy, sin buscarlo.",
    trabajo: [
      "Laboratorio 04 (para la casa): completar consenso.py hasta que las 32 pruebas pasen. Guía en PDF.",
      "Actividad Estonia: avanzar las seis tareas en equipo. Exposición de 5 minutos la próxima sesión.",
      "Preparar la propuesta de proyecto: el anteproyecto se entrega en la Sesión 6.",
      "Llegar a la Sesión 5 con la billetera de la Sesión 2 funcionando: habrá punto de control.",
    ],
    notas: "La pregunta de la semana se retoma en la apertura de la S5. Respuesta esperada: puede impedir la finalidad (más de un tercio) y censurar con propuestas; no puede gastar fondos ajenos ni finalizar historia alternativa sin dos tercios, y arriesga slashing.",
  });

  await D.cierre({
    frase: "El acuerdo entre desconocidos no se basa en la confianza. Se basa en que mentir cuesta más.",
    sub: "Con esto cierra la Unidad I: ya saben cómo se asegura un dato, quién lo escribió y cómo se decide el orden. La Unidad II empieza a programar sobre esa base.",
    proxima: "Sesión 5 · Ethereum y la máquina virtual · exposiciones del caso Estonia",
  });

  return D.guardar(path.join(__dirname, "Sesion-04-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
