/* =====================================================================
   Sesión 08 · Defender su contrato, probarlo y desplegarlo
   =====================================================================
   DECK AUTOCONTENIDO. Está escrito para dictarse SIN preparación previa:
   todo lo que hay que decir y todo el código que hay que mostrar está EN
   LAS LÁMINAS. El docente no necesita abrir el editor ni leer las notas
   para sostener la clase. Mismo criterio que el bloque A.1 de la S7.

   DOS RESTRICCIONES REALES DE ESTA CORRIDA DEL CURSO:

   1. NO HAY ETH DE PRUEBA. El despliegue en Sepolia NO se hace. Se
      despliega en la RED LOCAL, en vivo y gratis (bloque D), y el salto a
      Sepolia más la verificación del código quedan EXPLICADOS, no
      ejecutados. El cierre dice la deuda en voz alta: sin ese despliegue
      se caen la S10 (token), la S11 (NFT) y el Avance 1 de la S13.
   2. LOS EQUIPOS DEFIENDEN SU CONTRATO AL INICIO (bloque A, 45 min).
      5 o 6 equipos, 7 minutos cada uno. Las cuatro pasadas vienen de la
      S7 y de material/proyecto/ficha-lectura-contrato.pdf (las tres
      preguntas fijas de su página 6 son las de la lámina A.4).

   REGLA QUE NO SE ROMPE: el deck NO revela cuáles son los mutantes de
   Recaudo ni qué operador cambia cada uno. Los ejemplos trabajados de
   mutación usan la Subasta de la S7, no Recaudo. Se enseña a pensar en
   bordes.

   ---------------------------------------------------------------------
   PROCEDENCIA DE CADA CIFRA DEL DECK
   ---------------------------------------------------------------------
   A) MEDIDAS POR EL DOCENTE el 15-oct-2026 con el compilador del curso
      (solc 0.8.34, evm target osaka, optimizador en 200), sobre
      contracts/s08/Recaudo.sol y los tres mutantes:

        suite SIN pruebas de borde   13 pruebas · 88,46 % de líneas ·
                                     92,11 % de sentencias · los TRES
                                     mutantes VIVOS
        suite COMPLETA               16 pruebas · 92,31 % de líneas ·
                                     94,74 % de sentencias · los TRES
                                     mutantes MUERTOS, cada uno con
                                     exactamente 1 prueba que falla
        diferencia                   3 pruebas de borde · +3,85 puntos
        líneas sin cubrir            de «60, 78, 93» a «78, 93»

      Nota de redacción: la segunda columna del informe de cobertura de
      Hardhat se llama «Statement %». En el deck se dice «sentencias» y
      no «ramas», para que lo que se proyecta coincida palabra por
      palabra con lo que el docente ve en la terminal. Las cifras son las
      medidas, sin tocar. Coherencia comprobada: Recaudo.sol tiene 26
      líneas contables y 38 sentencias; 23/26 = 88,46 %, 24/26 = 92,31 %,
      35/38 = 92,11 %, 36/38 = 94,74 %. Encaja exacto.

   B) MEDIDAS AL CONSTRUIR ESTE DECK (15-oct-2026) en copia aislada del
      repositorio (robocopy + unión de node_modules, según ESTANDAR):

        plantilla andamiaje/s08/Recaudo.test.js
            2 passing · Recaudo.sol 11,54 % de líneas / 15,79 % de
            sentencias · sin cubrir 49, 55-56, 60, 63-64, 66, 70-72,
            74-75, 77-78, 80, 84-85, 87-88, 90, 92-93, 95 · Total 18,49 %
        node scripts/s08/cazar-mutantes.js con esa plantilla
            los tres VIVOS, 2 pasan · 0 fallan cada uno (salida literal
            en la lámina C.12)
        npx hardhat ignition deploy ignition/modules/Recaudo.js
            --network localhost (contra npx hardhat node)
            dirección 0x5FbDB2315678afecb367f032d93F642f64180aa3
            desde     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
            bloque 1 · estado SUCCESS · gas 515 666 · 2 014 bytes de
            código desplegado · args 10 ETH y 604 800 s
            segunda corrida: «Nothing new to deploy based on previous
            execution stored in .\ignition\deployments\chain-31337»
        MUTACIÓN SOBRE LA SUBASTA DE LA S7 (el ejemplo trabajado de C.4),
        contra las 23 pruebas de test/s07/Subasta.test.js:
            INCREMENTO_MINIMO_BPS = 10 en vez de 100  →  MUERTO
                21 pasan · 2 fallan («exige superar la puja anterior al
                menos en 1 %» y «se usa desde la subasta: 1 % de 2 ETH»)
            comentar el emit Retiro(...) de retirar()  →  VIVO
                23 pasan · 0 fallan
            base sin mutar: 23 passing
        Subasta.sol con su propia suite: 97,06 % de líneas / 97,87 % de
            sentencias · sin cubrir la línea 118 (el revert EnvioFallido)

   C) DOCUMENTADAS EN EL REPOSITORIO, no re-medidas aquí:
        versiones congeladas y 0.8.34+commit.80d5c536 → versiones.md
        rúbrica del laboratorio 25/15/35/25 → guias/s08-pruebas-y-mutantes
        ParserError de la S6 → build-sesion-06.js y la guía de Remix

   D) VERIFICADA EN LA WEB el 15-oct-2026:
        sepolia.etherscan.io/contractsVerified existe, no pide cuenta y
        lista «the last 500 verified contracts source code». A propósito
        NO se cita ninguna dirección concreta: las de esa lista rotan.
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({
    pie: "SESIÓN 08 · DEFENDER, PROBAR Y DESPLEGAR",
    titulo: "Sesión 08 · Defender su contrato, probarlo y desplegarlo",
  });
  const { C, F, M, CW } = D;

  /* ---------- ayudantes locales ---------- */

  /* Pregunta de verificación: cierra cada bloque. Máximo cuatro preguntas. */
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

  /* ================================================================
     APERTURA · 5 minutos
     ================================================================ */

  await D.portada({
    kicker: "SESIÓN 08 · UNIDAD II · ETHEREUM Y CONTRATOS",
    titulo: "DEFENDER SU\nCONTRATO Y\nPROBARLO",
    sub: "Primero lo defienden delante del curso. Después ven por qué una suite verde puede no estar probando nada.",
    palabra: "PROBAR",
    ic: "escudo",
    notas: "Apertura (1 min). La clase arranca con los equipos al frente: no hay introducción larga, se dice el plan y se llama al primero. Decir en voz alta las dos cosas que ordenan el día. UNA: hoy defienden su contrato con el código en pantalla, igual que la S7 pero del otro lado del método. DOS: después de la pausa van a ver, con números medidos, que una suite con 88 % de cobertura puede no detectar ni un error. Aviso que hay que dar de entrada y sin rodeos: el despliegue en Sepolia NO se hace hoy porque no hay ETH de prueba; se despliega en la red local, en vivo, y el resto queda explicado. Eso se vuelve a decir en el cierre como deuda, no como excusa.",
  });

  await D.agenda({
    intro: "Cinco minutos de apertura, cuatro bloques y una pausa de 10 minutos entre B y C. La clase empieza con los equipos al frente: 5 + 45 + 35 + 10 + 55 + 25 + 5 = 180 minutos.",
    bloques: [
      ["A", "DEFENSAS", "Cada equipo defiende su contrato proyectando el código. Siete minutos por equipo.", "~45 min"],
      ["B", "DEL NAVEGADOR AL TALLER", "Por qué se sale de Remix, la forma de un proyecto Hardhat y cómo se escribe una prueba.", "~35 min"],
      ["C", "CAZAR MUTANTES", "Qué mide la cobertura, qué no mide, y tres mutantes que hay que matar.", "~55 min"],
      ["D", "DESPLEGAR SIN GASTAR UN PESO", "Ignition contra la red local, en vivo. Y qué cambia al apuntar a Sepolia.", "~25 min"],
    ],
    notas: "1 minuto. Tiempos: apertura 5, A 45 (6 equipos × 7 = 42 más 3 de arranque), B 35, pausa 10, C 55, D 25, cierre 5. Si algo se alarga, se recorta de B (las láminas de familias de pruebas y de red local se pueden dejar para la guía), NUNCA del bloque C: el laboratorio de los mutantes es la lección de la sesión y es lo que se evalúa. El bloque A no se recorta por otra razón: si un equipo no defiende hoy, no hay otro momento en el calendario. Decir ya que la pausa es entre B y C, para que nadie se pare antes.",
  });

  await D.objetivo({
    objetivo: "Defender el contrato propio con el código en pantalla, y probarlo hasta que una suite verde signifique algo.",
    preguntas: [
      "¿Qué promete su contrato, quién manda adentro y por dónde entra y sale el dinero?",
      "¿Qué hace que una prueba sirva, y no solo que esté en verde?",
      "¿Por qué una suite con 88 % de cobertura puede no detectar ni un error?",
      "¿Qué hace falta para desplegar y verificar, y qué parte de eso no cuesta un peso?",
    ],
    ra: "RA3 · patrones y estándares  ·  RA4 · suite de pruebas automatizadas y despliegue con un entorno profesional",
    notas: "1 minuto. La tercera pregunta es el corazón del día y la única que se responde con números medidos: al final del bloque C tienen que poder contestarla con las cifras de la lámina C.5. La primera es la del bloque A y es la misma de la S7: no hay nada nuevo que estudiar para la defensa.",
  });

  await D.glosario({
    items: [
      ["Hardhat", "entorno de desarrollo", "Compila, prueba, despliega y verifica desde la terminal. Trae su propia red local, gratis e instantánea."],
      ["loadFixture", "estado de partida", "Despliega una vez, guarda una instantánea de la cadena y la restaura antes de cada prueba."],
      ["Cobertura", "line coverage", "Porcentaje de líneas del contrato que alguna prueba ejecutó. No dice si alguien comprobó el resultado."],
      ["Mutante", "mutation testing", "Copia del contrato con un error puesto a propósito. Una suite que sirve tiene que fallar contra él."],
      ["borde", "edge case", "El valor exacto del límite: el último segundo, el peso justo, la segunda llamada seguida."],
      ["Ignition", "despliegue declarativo", "Describe QUÉ se despliega, anota cada paso en un diario y no repite lo que ya hizo."],
      ["keystore", "almacén cifrado", "Donde Hardhat 3 guarda claves y URLs, con contraseña y fuera del repositorio."],
      ["verificar", "source code verification", "Subir la fuente al explorador para que recompile y compruebe que da el mismo bytecode."],
    ],
    notas: "1 minuto. No leerlo: dejarlo proyectado y avisar que es la lámina a la que hay que volver. Las dos palabras que más se confunden son cobertura y mutante: la cobertura mide qué se EJECUTÓ, el mutante mide si alguien lo COMPROBÓ. Son preguntas distintas y la segunda es la que importa.",
  });

  {
    const s = await D.lamina({ kicker: "Lo que se entrega hoy", titulo: "Tres evidencias y una frase", ic: "bandera", tituloSize: 29 });
    D.enunciado(s, "Una suite con 88 % de cobertura puede no servir para nada. Hoy lo van a ver con números.", { y: 1.85, h: 1.35, size: 21, line: C.naranja });
    D.etiqueta(s, "Lo que sale de esta sesión", { x: M, y: 3.4, w: 8, color: C.gris });
    D.pasos(s, [
      ["LA DEFENSA", "Cada equipo, al frente, con su contrato en pantalla. Se califica hoy mismo, con la rúbrica de la lámina A.3."],
      ["LA SUITE Y LOS MUTANTES", "Diez pruebas o más para Recaudo, la cobertura medida, y los tres mutantes muertos con su explicación."],
      ["EL DESPLIEGUE LOCAL", "La salida de Ignition con la dirección del contrato desplegado en la red local, hecho en vivo."],
    ], { y: 3.8, alto: 0.9, gap: 0.12, anchoEt: 3.0, size: 12.5 });
    s.addNotes("2 minutos. Leer la frase del recuadro en voz alta y dejarla ahí: es la vara del día. El 88 % no es un número inventado ni un ejemplo de libro: es lo que midió el docente esta semana con una suite real sobre el contrato del laboratorio, y con esa cobertura los tres errores sembrados pasaron desapercibidos. No adelantar más: la cifra completa va en C.5. Sobre la tercera evidencia, decirlo ya: el despliegue es en la RED LOCAL, no en Sepolia, porque no hay ETH de prueba. Lo de Sepolia se explica en el bloque D y queda como deuda del curso.");
  }

  /* ================================================================
     BLOQUE A · DEFENSAS · 45 minutos
     ================================================================ */

  {
    const s = await D.divisor({
      letra: "A", titulo: "Defensas", ic: "escudo",
      sub: "Siete minutos por equipo, con el código en pantalla. Las cuatro pasadas de la Sesión 7, aplicadas al contrato propio, y una prueba que tiene que fallar.",
      minutos: "APROXIMADAMENTE 45 MINUTOS · 7 POR EQUIPO",
    });
    s.addNotes("30 segundos de transición. Antes de llamar al primer equipo, tres cosas en voz alta: (1) el orden es por sorteo y se anuncia completo ahora, para que nadie se prepare mientras otro expone; (2) el cronómetro está visible y a los 7 minutos se corta; (3) mientras un equipo defiende, los demás escuchan con la ficha de lectura en la mano, porque las mismas preguntas les van a caer a ellos. Tener listo el cable o el adaptador del proyector: el minuto de cambio existe justo para eso y se pierde completo si hay que buscarlo.");
  }

  {
    const s = await D.lamina({ kicker: "A.1 · el guion de la defensa", titulo: "Qué pasa en cada minuto", ic: "reloj", tituloSize: 30 });
    D.tabla(s, ["minuto", "qué hace el equipo", "qué tiene que verse en la pantalla"], [
      ["0:00 – 0:45", "Pasada 1: qué promete el contrato. Solo los nombres públicos.", "La lista de funciones y eventos. Ningún cuerpo abierto todavía."],
      ["0:45 – 1:45", "Pasada 2: quién manda, y el día en que esa llave se pierde.", "La línea del modificador o del require que da ese poder."],
      ["1:45 – 2:45", "Pasada 3: por dónde entra el dinero y por dónde sale.", "Cada payable y cada envío, señalados con el cursor."],
      ["2:45 – 4:00", "La prueba propia que falla a propósito. Se corre ahí mismo.", "La terminal, con la prueba en rojo y el mensaje del fallo."],
      ["4:00 – 6:00", "Dos preguntas del docente, de las de la lámina A.4.", "El archivo abierto, para buscar la respuesta en el código."],
      ["6:00 – 7:00", "Cambio: el siguiente equipo conecta mientras se anota la nota.", "Nada: es el minuto del cable y del proyector."],
    ], { y: 1.9, h: 3.6, colW: [1.5, 4.6, 5.993], size: 11 });
    await D.ficha(s, {
      tipo: "pregunta", etiqueta: "Las dos reglas de la dinámica",
      x: M, y: 5.7, w: CW, h: 1.15,
      texto: "El orden es por sorteo y se anuncia completo antes de empezar. A los 7 minutos se corta, sin excepción: elegir qué mostrar en cuatro minutos es parte de lo que se evalúa.",
      size: 12.5,
    });
    s.addNotes("3 minutos, y es la lámina que se proyecta durante todo el bloque. Con 6 equipos: 6 × 7 = 42 minutos, más estos 3 de arranque, son los 45. Con 5 equipos sobran 7 minutos: se usan para la síntesis al final del bloque, no para alargar a nadie. Quien lleva el cronómetro es el docente, en voz alta a los 4:00 («tiempo de preguntas») y a los 6:00 («cambio»). La cuarta fila es la que más cuesta y la que más vale: si un equipo intenta describir la prueba en lugar de correrla, pedirle que la corra. Si no la trae, la lámina A.5 dice exactamente qué hacer.");
  }

  {
    const s = await D.lamina({ kicker: "A.2 · lo que cada equipo tiene que responder", titulo: "Las cuatro pasadas, sobre su contrato", ic: "lista", tituloSize: 26 });
    D.pasos(s, [
      ["PASADA 1 · QUÉ PROMETE", "Leer la lista de nombres públicos —funciones y eventos— y decir qué promete cada uno. Sin abrir ningún cuerpo: lo que se deduce de un nombre es una hipótesis, y se dice como hipótesis."],
      ["PASADA 2 · QUIÉN MANDA", "Qué direcciones tienen poder, qué puede hacer cada una, y qué es exactamente lo que NO puede hacer. Y el día malo completo: si esa llave se pierde o se filtra, ¿qué queda atrapado?"],
      ["PASADA 3 · EL DINERO", "Por dónde entra (cada payable), dónde se queda (qué variable lo contabiliza) y por dónde sale. Quién dispara cada salida y con qué límite."],
      ["PASADA 4 · UNA PRUEBA QUE FALLE", "Una prueba escrita por el equipo que falle A PROPÓSITO, corrida en pantalla. Tienen que decir qué regla queda sin cumplir cuando falla, y por qué eligieron esa."],
    ], { y: 1.85, alto: 0.88, gap: 0.12, anchoEt: 3.4, size: 12.5 });
    await D.ficha(s, {
      tipo: "termino", etiqueta: "No hay nada nuevo que preparar",
      x: M, y: 5.85, w: CW, h: 1.0,
      texto: "Las pasadas 1 a 3 son las páginas 1 a 4 de la ficha de lectura que llenaron en la Sesión 7. La cuarta es la novedad de hoy.",
      size: 12,
    });
    s.addNotes("3 minutos. Es el mismo método de la S7, y conviene decirlo así para bajar la ansiedad: quien llenó la ficha en el salón ya tiene las tres primeras pasadas escritas. La pasada 4 es nueva y es la que distingue esta defensa de una exposición: no se trata de contar que el contrato funciona, sino de mostrar la línea que lo hace cumplir y demostrar que si se rompe, algo se queja. Si un equipo pregunta qué prueba hacer fallar, la respuesta es una pregunta: «¿cuál es la regla principal de su contrato?». La prueba es la que comprueba esa regla; se la hace fallar cambiando el escenario, no el contrato.");
  }

  {
    const s = await D.lamina({ kicker: "A.3 · cómo se califica", titulo: "La rúbrica de la defensa", ic: "balanza", tituloSize: 30 });
    D.tabla(s, ["criterio", "peso", "un 5,0 se oye así", "baja a 3,0 o menos si…"], [
      ["¿Qué promete?", "15 %", "Lee la lista de nombres y dice qué promete cada uno, marcando lo que es hipótesis.", "Lee el archivo de corrido, o explica cómo funciona cuando se le pidió qué promete."],
      ["¿Quién manda?", "20 %", "Nombra el rol, el poder exacto que tiene, y cuenta el día en que esa llave se pierde.", "Responde «está protegido con OpenZeppelin», o no sabe qué queda atrapado ese día."],
      ["¿Y el dinero?", "25 %", "Señala con el cursor cada entrada y cada salida, y dice quién la dispara y con qué límite.", "Describe el flujo de memoria, sin señalar ninguna línea del archivo."],
      ["La prueba que falla", "40 %", "Corre la prueba, falla, y explican qué regla quedó sin cumplir y por qué eligieron esa.", "La prueba falla por otra razón —sintaxis, saldo, cuenta equivocada— y no lo notan. Sin prueba: 0."],
    ], { y: 1.9, h: 4.1, colW: [2.6, 0.75, 4.4, 4.343], size: 11 });
    D.parrafo(s, "La cuarta vale 40 %: es la única que no se puede improvisar en el pasillo, y por eso es la que de verdad separa a un equipo que conoce su contrato de uno que lo tiene.", { y: 6.15, h: 0.6, size: 13, color: C.ocre });
    s.addNotes("4 minutos. Esta lámina se proyecta y se deja quieta: es la rúbrica, no un resumen de la rúbrica. Calificar cada criterio de 0 a 5 y ponderar con los pesos; la nota sale en el minuto de cambio, mientras el siguiente equipo conecta. Coherencia con el resto del material: los criterios 1 a 3 son las pasadas de la S7 y las tres preguntas fijas de la página 6 de la ficha de lectura; el criterio 4 es nuevo y es el que empuja hacia el bloque C. Decir en voz alta por qué pesa 40 %: una prueba que falla a propósito demuestra dos cosas a la vez, que el equipo sabe cuál es su regla principal y que sabe escribir código que la vigila. Lo demás se puede recitar.");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · las preguntas del docente", titulo: "«¿Qué pasa si…?»", ic: "pregunta", tituloSize: 30 });
    D.pasos(s, [
      ["BORRAR", "Señalen la línea que hace cumplir su regla principal. ¿Qué deja de ser cierto si yo la borro?"],
      ["LA LLAVE", "¿Quién se queda con el dinero o con el control si esa llave se pierde o se filtra hoy?"],
      ["DOS VECES", "¿Qué pasa si la misma cuenta llama dos veces seguidas a esa función?"],
      ["EL RECEPTOR", "¿Qué pasa si quien recibe el dinero es un contrato que rechaza el pago?"],
      ["EL SEGUNDO EXACTO", "¿Qué pasa un segundo antes, en el segundo exacto y un segundo después de ese plazo?"],
      ["OTRA CUENTA", "¿Qué pasa si llama una cuenta que no es la del dueño? ¿Y si quien llama es un contrato?"],
    ], { y: 1.85, alto: 0.70, gap: 0.07, anchoEt: 2.2, size: 12 });
    D.parrafo(s, "Y la última, siempre: digan una cosa que su contrato NO puede impedir, y por qué siguen pensando que vale la pena.", { y: 6.48, h: 0.38, size: 12, color: C.ocre });
    s.addNotes("2 minutos para presentarla, y después se usa durante todo el bloque. Son dos preguntas por equipo, elegidas de esta lista según lo que hayan mostrado. Están proyectadas a propósito: no son una trampa, y la única forma de fallarlas es no haber leído el contrato propio. Son las mismas tres preguntas fijas de la página 6 de la ficha de lectura, ampliadas con las de la pasada del adversario. Dos criterios al calificar la respuesta: una buena respuesta señala un archivo, una función y una línea; una mala respuesta nombra una biblioteca. Y sobre la última pregunta: «no se nos ocurre ninguna» y «entonces no sirve para nada» son la misma respuesta, y las dos dicen que no se pensó.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · si un equipo llega sin la prueba", titulo: "Lo que se hace, y lo que no", ic: "balanza", tituloSize: 29 });
    D.pasos(s, [
      ["NO SE REGAÑA", "Nadie pierde la defensa por esto. Se sigue con el resto de la rúbrica y se califica completo lo que sí trajeron."],
      ["SE DICE EN VOZ ALTA", "«¿Qué regla querrían comprobar, y en qué línea de su contrato vive?» Treinta segundos, sin código y sin terminal."],
      ["QUEDA ESCRITO", "El docente anota la regla que el equipo dijo. Esa es la prueba que debe entregar, no otra cualquiera."],
      ["CON FECHA", "Se entrega antes de la Sesión 9, por el canal del curso: el archivo de prueba y la captura de la corrida en rojo."],
    ], { y: 1.85, alto: 0.86, gap: 0.12, anchoEt: 2.9, size: 12.5 });
    await D.ficha(s, {
      tipo: "pregunta", etiqueta: "Por qué decirla en voz alta ya vale algo",
      x: M, y: 5.78, w: CW, h: 1.05,
      texto: "Un equipo que sabe qué quiere comprobar está a una tarde de la prueba. El que no lo sabe, no lo está, y conviene saberlo hoy.",
      size: 12,
    });
    s.addNotes("2 minutos. Esta lámina es para el docente tanto como para ellos: la tentación de regañar es fuerte y no sirve de nada en los siete minutos que tiene el equipo al frente. El objetivo del bloque es que cada equipo salga sabiendo cuál es su regla principal; la prueba es el instrumento, no el fin. ⚠ ANTES DE DICTAR: decir la fecha exacta del calendario, no «antes de la Sesión 9», y anotarla en el tablero. Si son más de dos los equipos sin prueba, es señal de que el encargo no quedó claro en la S7: anotarlo y dedicar los primeros minutos del bloque C a repetir qué es una prueba que falla a propósito.");
  }

  await verificacion({
    kicker: "Verificación · bloque A",
    titulo: "Lo que las defensas debieron dejar",
    preguntas: [
      "De todos los contratos que vieron hoy, ¿cuál tenía la regla principal más clara, y en qué línea vivía?",
      "¿Qué equipo contó el día malo completo de su llave, y qué quedaba atrapado ese día?",
      "¿Una prueba que falla porque la cuenta no tiene saldo demuestra algo sobre la regla del contrato?",
      "Sobre su propio contrato: ¿qué pregunta de la lámina A.4 les costó más, y por qué esa?",
    ],
    notas: "3 minutos, en parejas, y es la bisagra con el resto del día. Respuestas: (1) y (2) dependen de la sala; lo que importa es que puedan nombrar una línea y un rol, no una impresión general. (3) No: no demuestra nada sobre la regla. La prueba pasó porque el escenario tenía otro problema, y pasaría igual si la regla no existiera. Ese es exactamente el tema del bloque C y conviene subrayarlo aquí: una prueba que falla por la razón equivocada es una prueba que no prueba. (4) La más incómoda suele ser la de la llave perdida, porque casi ningún proyecto de clase tiene salida para ese día. Si nadie responde la 3, no seguir: repetirla con un ejemplo del tablero.",
  });

  /* ================================================================
     BLOQUE B · DEL NAVEGADOR AL TALLER · 35 minutos
     ================================================================ */

  {
    const s = await D.divisor({
      letra: "B", titulo: "Del navegador al taller", ic: "terminal",
      sub: "Remix sirve para explorar. No sirve para versionar, ni para correr cien pruebas en lote, ni para desplegar dos veces igual. Hoy se cambia de herramienta.",
      minutos: "APROXIMADAMENTE 35 MINUTOS",
    });
    s.addNotes("30 segundos. Puente desde el bloque A: acabaron de ver seis contratos y seis pruebas corriendo. Todo eso se hizo en una terminal, no en el navegador, y a partir de ahora el curso entero trabaja así. Decir que este bloque es el más denso en sintaxis del semestre y que TODO el código que hace falta está en estas láminas: no hay que memorizarlo ni copiarlo del tablero, se vuelve a estas láminas cuando se necesite. El código de este bloque es código REAL del repositorio del curso (test/s07/Subasta.test.js), el mismo que ya corrieron la semana pasada.");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · por qué salir del navegador", titulo: "Lo que Remix no puede hacer bien", ic: "pantalla", tituloSize: 29 });
    D.parrafo(s, "Remix sigue siendo excelente para explorar un contrato y para enseñar. Pero hay seis cosas que un equipo necesita y que ahí no se pueden hacer.", { y: 1.85, h: 0.5, size: 13.5 });
    D.tabla(s, ["lo que hace falta", "en Remix", "en Hardhat"], [
      ["Guardar la historia del código", "Archivos dentro del navegador.", "Git: ramas, revisión, quién cambió qué."],
      ["Correr cien pruebas en lote", "A mano, clic por clic.", "Un comando, y segundos."],
      ["Desplegar dos veces igual", "Cada vez a mano, y distinto.", "Un módulo con parámetros, repetible."],
      ["Saber qué líneas nadie ejecutó", "No existe.", "Informe de cobertura, por número de línea."],
      ["Probar qué pasa en una semana", "Imposible: el tiempo es el real.", "Se adelanta el reloj de la red local."],
      ["Guardar claves con cuidado", "Depende de la billetera del navegador.", "Almacén cifrado, fuera del proyecto."],
    ], { y: 2.5, h: 3.6, colW: [4.1, 3.9, 4.093], size: 11 });
    D.parrafo(s, "Ningún equipo serio despliega desde el navegador. No porque Remix sea malo, sino porque un despliegue tiene que poder repetirse exactamente igual, y eso un clic no lo garantiza.", { y: 6.25, h: 0.55, size: 12.5, color: C.ocre });
    s.addNotes("4 minutos. Preguntar antes de mostrar la tabla: en la S6, ¿cuántas veces tuvieron que volver a desplegar en Remix para probar una corrección? Y después: ¿cuánto tardarían en probar a mano las 23 situaciones de la suite de la subasta de la semana pasada? La fila que más les va a servir en el proyecto es la tercera: el Avance 1 pide un despliegue reproducible, y «lo hicimos a mano aquella vez» no es reproducible. El plan del curso menciona Foundry como alternativa: mismo flujo, pruebas escritas en Solidity; el curso usa Hardhat para no sostener dos entornos en la sala.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · la forma de un proyecto", titulo: "Anatomía de un proyecto Hardhat", ic: "rejilla", tituloSize: 28 });
    D.codigo(s, `laboratorios-evm/
├── contracts/          los contratos .sol
├── test/               las pruebas .test.js
├── ignition/
│   ├── modules/        CÓMO se despliega
│   └── parametros/     CON QUÉ valores, por red
├── scripts/            utilidades sueltas
├── hardhat.config.js   compilador y redes
├── package.json        versiones EXACTAS
└── .gitignore          lo que NUNCA se sube`, { x: M, y: 1.9, w: 5.7, h: 4.0, lang: "js", size: 12 });
    D.codigo(s, `export default {
  plugins: [toolbox],
  solidity: {
    version: "0.8.34",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    sepolia: {
      type: "http",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
};`, { x: M + 6.0, y: 1.9, w: CW - 6.0, h: 4.0, lang: "js", size: 11, titulo: "hardhat.config.js · el del curso, recortado" });
    D.parrafo(s, "configVariable NO contiene el secreto: le dice a Hardhat que lo busque en el almacén cifrado, y solo cuando se use esa red. Las pruebas locales nunca lo piden, así que se puede trabajar todo el semestre sin configurar ninguna clave.", { y: 6.1, h: 0.65, size: 13, color: C.ocre });
    s.addNotes("4 minutos. Señalar tres cosas en el archivo de la derecha y nada más. UNA: la versión del compilador, 0.8.34, que es la misma que fija el pragma de todos los contratos del curso y la misma que habrá que declarar al verificar (bloque D). DOS: el optimizador, activado con 200 ejecuciones: también hay que declararlo al verificar. TRES: configVariable, que es un NOMBRE, no un valor. Hardhat 3 usa módulos ES —import y export, no require—, y por eso package.json dice type: module; es el error más común al copiar tutoriales viejos. La carpeta ignition se abre en el bloque D.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · la red local", titulo: "Una cadena completa en su computador", ic: "red", tituloSize: 28 });
    D.tabla(s, ["lo que trae", "qué permite hacer"], [
      ["20 cuentas con 10 000 ETH", "Simular a Ana, a Beto, al dueño y a un atacante sin pedirle fondos a nadie."],
      ["Minado instantáneo", "Cada transacción entra en un bloque al momento: las pruebas corren en milisegundos."],
      ["Control del reloj", "Adelantar siete días para probar un plazo, sin esperar una semana."],
      ["Instantáneas del estado", "Guardar la cadena y volver a ese punto: es la base de las fixtures."],
      ["Errores completos", "Dice qué error personalizado revirtió y con qué argumentos, no «transaction failed»."],
      ["npx hardhat node", "La misma red como servidor en localhost:8545, para conectar una billetera o una interfaz."],
    ], { y: 1.9, h: 3.95, colW: [4.0, 8.093], size: 12 });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "Las cuentas de la red local son públicas",
      x: M, y: 5.93, w: CW, h: 0.92,
      texto: "Sus claves privadas están impresas en la documentación. Nunca se usan en una red real.",
      size: 12.5,
    });
    s.addNotes("3 minutos. Cada npx hardhat test arranca una cadena nueva en memoria: nada persiste entre corridas, y por eso las pruebas no se estorban entre ejecuciones. La última fila importa para el bloque D: npx hardhat node levanta la misma red pero como servidor, y ahí sí el despliegue queda guardado mientras el servidor viva. Error típico que hay que nombrar: importar una de estas 20 cuentas en MetaMask y usarla en Sepolia. Cualquiera la puede vaciar, porque la clave está publicada en la documentación de Hardhat.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · cómo se escribe una prueba", titulo: "La forma de un archivo de pruebas", ic: "codigo", tituloSize: 28 });
    D.codigo(s, `import { expect } from "chai";
import { network } from "hardhat";
const { ethers, networkHelpers } = await network.create();   // Hardhat 3: create()
const { time, loadFixture } = networkHelpers;
const HORA = 60 * 60;
const MINIMA = ethers.parseEther("1");

async function desplegar() {                         // la fixture LLEVA NOMBRE
  const [dueno, ana, beto, carla] = await ethers.getSigners();
  const s = await ethers.deployContract("Subasta", [HORA, MINIMA]);
  return { s, dueno, ana, beto, carla };
}

describe("S07 · Subasta · pujar", () => {                            // el grupo
  it("acepta la primera puja desde el mínimo", async () => {          // el caso
    const { s, ana } = await loadFixture(desplegar);
    await expect(s.connect(ana).pujar({ value: MINIMA }))
      .to.emit(s, "NuevaPuja").withArgs(ana.address, MINIMA);     // qué se exige
  });
});`, { x: M, y: 1.85, w: CW, h: 4.5, lang: "js", size: 10.5, titulo: "test/s07/Subasta.test.js · código real del repositorio, recortado" });
    D.parrafo(s, "Se lee como una frase: «Subasta, al pujar, acepta la primera puja desde el mínimo». Si no se lee así, está mal nombrado.", { y: 6.45, h: 0.35, size: 12, color: C.ocre });
    s.addNotes("5 minutos, y es la lámina más importante del bloque. Recorrerla de arriba abajo señalando con el cursor. Las dos trampas de Hardhat 3 que rompen cualquier tutorial copiado: la red se obtiene con await network.create() —no connect()—, y loadFixture exige una función CON NOMBRE, no una flecha anónima. describe agrupa, it es un caso, expect comprueba. La última línea es la que convierte esto en una prueba: sin un expect, el caso pasa aunque el contrato no haga nada de lo prometido, y aun así cuenta para la cobertura. Eso vuelve en el bloque C.");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · loadFixture", titulo: "Cada prueba empieza de cero, sin pagarlo", ic: "reloj", tituloSize: 26 });
    D.pasos(s, [
      ["PRIMERA LLAMADA", "loadFixture ejecuta desplegar(): despliega el contrato y guarda una instantánea de toda la cadena."],
      ["LLAMADAS SIGUIENTES", "No vuelve a desplegar: restaura la instantánea. Milisegundos en lugar de segundos."],
      ["AISLAMIENTO", "Lo que una prueba cambió —aportes, saldos, el reloj adelantado— no existe para la siguiente."],
    ], { y: 1.9, alto: 0.92, gap: 0.14, anchoEt: 3.2, size: 13 });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "El error clásico, y por qué es tan difícil de encontrar",
      x: M, y: 5.1, w: CW, h: 1.7,
      texto: "Desplegar una sola vez en un before() compartido y dejar que las pruebas se afecten entre sí. Una prueba adelanta el reloj una semana; la siguiente encuentra el plazo vencido y falla sin razón aparente. La suite pasa en un orden y falla en otro, y se pierden horas buscando el error en el contrato, que está bien. Con loadFixture ese problema no puede ocurrir.",
      size: 13,
    });
    s.addNotes("3 minutos. Preguntar: ¿por qué no basta con volver a desplegar en cada prueba? Porque desplegar cuesta tiempo real y una suite de cien pruebas se vuelve inusable; la instantánea cuesta casi nada. El ejemplo del reloj de la ficha es el que más les va a pasar en el laboratorio del bloque C, porque Recaudo tiene un plazo: conviene decirlo ya para que lo reconozcan cuando les ocurra.");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · simular cuentas y mover el reloj", titulo: "Quién firma, y en qué momento", ic: "persona", tituloSize: 29 });
    D.codigo(s, `const [dueno, ana, beto, carla] = await ethers.getSigners();   // las 20 cuentas

await s.connect(ana).pujar({ value: eth(1) });        // firma Ana, no el dueño
await s.connect(beto).pujar({ value: eth(2) });       // firma Beto

await time.increase(HORA);                            // pasa una hora
await time.increaseTo(fin);                           // mina un bloque EN fin
await time.setNextBlockTimestamp(fin);                // el PRÓXIMO bloque, en fin

await expect(s.connect(ana).pausar())                 // una cuenta sin permiso
  .to.be.revertedWithCustomError(s, "OwnableUnauthorizedAccount");`,
      { x: M, y: 1.9, w: CW, h: 3.2, lang: "js", size: 12 });
    D.dosColumnas(s,
      { et: "connect(cuenta)", texto: "Cambia quién firma. Sin él, todo lo hace el dueño y las pruebas de permisos pasan por accidente." },
      { et: "time", texto: "Mueve el reloj de la red local, nunca el de una red real. Viene de networkHelpers." },
      { y: 5.25, h: 1.45, size: 13 });
    s.addNotes("4 minutos. Las dos herramientas con las que se simula el mundo: otra cuenta y otro momento. El error típico es olvidar connect y hacer todo con la primera cuenta, que es el dueño: así una prueba de permisos pasa sin probar nada, porque quien llama sí tenía permiso. La diferencia entre increaseTo y setNextBlockTimestamp parece un detalle y no lo es: es la lámina C.8, y es justo lo que hace falta para probar un plazo en el segundo exacto. fin es un BigInt en ethers v6, así que un segundo antes se escribe fin - 1n, con la n.");
  }

  {
    const s = await D.lamina({ kicker: "B.7 · comprobar que algo revierta", titulo: "revertedWithCustomError y withArgs", ic: "escudo", tituloSize: 27 });
    D.codigo(s, `// test/s07/Subasta.test.js · la reversión, con su error y sus argumentos
it("rechaza una primera puja por debajo del mínimo", async () => {
  const { s, ana } = await loadFixture(desplegar);
  await expect(s.connect(ana).pujar({ value: eth("0.5") }))
    .to.be.revertedWithCustomError(s, "PujaInsuficiente").withArgs(MINIMA, eth("0.5"));
});

it("no acepta pujas después del cierre", async () => {
  const { s, ana } = await loadFixture(desplegar);
  await time.increase(HORA);
  await expect(s.connect(ana).pujar({ value: eth(5) }))
    .to.be.revertedWithCustomError(s, "SubastaCerrada");
});`, { x: M, y: 1.9, w: CW, h: 3.1, lang: "js", size: 11.5 });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "Por qué no vale decir solo «revirtió»",
      x: M, y: 5.05, w: CW, h: 1.75,
      texto: "No usen .to.be.reverted a secas: está desaconsejado en Hardhat 3 y pasa aunque el contrato revierta por la razón equivocada: falta de saldo, cuenta sin permiso, otra regla que se disparó primero. revertedWithCustomError exige el error exacto, y withArgs exige además los valores con los que se revirtió. Esa es la diferencia entre una prueba y una ilusión de prueba.",
      size: 13,
    });
    s.addNotes("4 minutos. Es el matcher que más van a usar en el laboratorio. Leer la primera prueba y preguntar: ¿qué OTRA cosa podría hacer revertir esa transacción? Si Ana no tuviera saldo, por ejemplo: la prueba pasaría igual y no habría probado la regla del mínimo. Por eso el escenario se diseña para que SOLO la regla pueda detener la transacción. La segunda prueba es la misma idea con el reloj adelantado, y es exactamente el tipo de prueba que el laboratorio del bloque C va a pedir en el límite exacto en lugar de «una hora después».");
  }

  {
    const s = await D.lamina({ kicker: "B.8 · comprobar eventos y saldos", titulo: "withArgs, y el dinero que se movió", ic: "moneda", tituloSize: 28 });
    D.codigo(s, `// el evento, con los argumentos exactos
await expect(s.connect(carla).finalizar())
  .to.emit(s, "SubastaFinalizada").withArgs(ana.address, eth(3));

// el saldo de una cuenta, y de varias a la vez (ethers va PRIMERO)
await expect(s.connect(ana).retirar())
  .to.changeEtherBalances(ethers, [ana, s], [eth(1), -eth(1)]);

// el perdedor NO recibe su dinero al ser superado: su saldo cambia en 0
await expect(s.connect(beto).pujar({ value: eth(2) }))
  .to.changeEtherBalance(ethers, ana, 0n);

// y lo que quedó guardado se lee como cualquier variable pública
expect(await s.pendientes(ana.address)).to.equal(eth(1));`,
      { x: M, y: 1.9, w: CW, h: 3.3, lang: "js", size: 11.5 });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "Dos trampas comprobadas en el repositorio",
      x: M, y: 5.35, w: CW, h: 1.4,
      texto: "changeEtherBalance ya descuenta el gas, así que se compara el monto exacto y no hay que restarle nada. Y no se encadena con .to.emit sobre la misma transacción: se envía dos veces y la segunda falla.",
      size: 12.5,
    });
    s.addNotes("4 minutos. Las tres comprobaciones que faltaban. UNA: el evento con withArgs, que es lo único que detecta si un contrato dejó de avisarle al mundo; vuelve en C.4 como el mutante que sobrevive. DOS: el saldo, con ethers como primer argumento, que es un cambio de Hardhat 3 y el error más frecuente al copiar código viejo. TRES: la tercera prueba es sutil y vale la pena detenerse: comprobar que un saldo cambia en CERO es comprobar que el contrato NO hizo algo, y es así como se prueba el patrón de retiro de la S7.");
  }

  {
    const s = await D.lamina({ kicker: "B.9 · qué probar", titulo: "Las cinco familias de pruebas", ic: "lista", tituloSize: 30 });
    D.tabla(s, ["familia", "qué pregunta responde", "ejemplo real de test/s07/Subasta.test.js"], [
      ["Caso feliz", "¿Hace lo que promete cuando todo va bien?", "Una puja válida cambia mejorPostor y emite NuevaPuja."],
      ["Reversión", "¿Se niega a hacer lo que no debe?", "Pujar por debajo del mínimo revierte con PujaInsuficiente."],
      ["Permisos", "¿Solo quien debe puede hacerlo?", "Solo el dueño pausa: el resto recibe OwnableUnauthorizedAccount."],
      ["Eventos", "¿Le cuenta al mundo lo que pasó, con los datos correctos?", "SubastaFinalizada, con el ganador y el monto exactos."],
      ["Bordes", "¿Qué pasa exactamente en el límite?", "La puja que supera en exactamente el 1 %, ni un wei menos."],
    ], { y: 1.9, h: 3.7, colW: [2.2, 4.3, 5.593], size: 11 });
    D.enunciado(s, "Las cuatro primeras dan cobertura. La quinta es la que atrapa los errores.", { y: 5.75, h: 1.0, size: 17, line: C.naranja });
    s.addNotes("3 minutos. Los cinco ejemplos están en el archivo que ya corrieron la semana pasada: preguntar por cada familia cuál de las pruebas de la S7 es de ese tipo. La frase del recuadro es la tesis del bloque C y conviene dejarla dicha antes de la pausa: las cuatro primeras familias son las que se le ocurren a cualquiera, y son las que dan los puntos de cobertura; la quinta es la que nadie escribe, y es donde viven los errores. Después de la pausa se demuestra con números.");
  }

  await verificacion({
    kicker: "Verificación · bloque B",
    titulo: "Antes de la pausa: cuatro preguntas",
    preguntas: [
      "¿Por qué una fixture tiene que ser una función con nombre, y qué pasa si se le pasa una flecha anónima?",
      "¿Qué comprueba de verdad una prueba que dice solo .to.be.reverted, y qué no?",
      "Si quieren probar que una cuenta sin permiso no puede pausar, ¿qué dos cosas tiene que tener esa prueba?",
      "¿Qué comando corre las pruebas, y cuál de los dos lenguajes está en test/ y cuál en contracts/?",
    ],
    notas: "3 minutos. Respuestas: (1) loadFixture la identifica por el nombre para saber si ya tiene instantánea de ella; con una flecha anónima falla. (2) Comprueba que la transacción revirtió, y nada más: no comprueba POR QUÉ, así que pasa igual si revirtió por falta de saldo o por una regla distinta de la que se quería probar. (3) connect(otraCuenta) y revertedWithCustomError con el nombre del error; sin lo primero firma el dueño y la prueba pasa por accidente. (4) npx hardhat test <archivo>; JavaScript en test/, Solidity en contracts/. Y recordar que npx hardhat test recibe ARCHIVOS, no carpetas. Después de esto, pausa de 10 minutos.",
  });

  /* ================================================================
     PAUSA · 10 minutos
     ================================================================ */

  {
    const s = await D.lamina({ kicker: "Pausa · 10 minutos", titulo: "Diez minutos", ic: "reloj", tituloSize: 31 });
    D.enunciado(s, "Al volver: una suite en verde, 88 % de cobertura, y tres errores que nadie ve.", { y: 2.4, h: 1.9, size: 22, line: C.naranja });
    D.parrafo(s, "Mientras tanto, dos cosas: abran una terminal en laboratorios-evm y corran npx hardhat --version —tiene que decir 3.16.0—, y tengan a mano el contrato del laboratorio, contracts/s08/Recaudo.sol. El bloque C empieza escribiendo pruebas, no instalando cosas.", { y: 4.6, h: 1.4, size: 14 });
    s.addNotes("10 minutos de pausa, cronometrados y anunciados en voz alta: «volvemos a las …». Mientras la sala se vacía, el docente usa la pausa para dos cosas concretas. UNA: comprobar que el proyector siga conectado a la máquina del docente, porque el bloque C se dicta desde las láminas y el bloque D se corre en vivo en la terminal. DOS: pasar por las dos o tres parejas que llegaron con el entorno roto; si npm install hay que repetirlo, es ahora y no en el minuto 10 del laboratorio. La copia del repositorio con node_modules en memoria USB es el plan B de la red de la sala.");
  }

  /* ================================================================
     BLOQUE C · CAZAR MUTANTES · 55 minutos
     ================================================================ */

  {
    const s = await D.divisor({
      letra: "C", titulo: "Cazar mutantes", ic: "bicho",
      sub: "Trece pruebas, 88 % de cobertura y tres errores vivos. Tres pruebas más y los tres mueren. El bloque empieza con los números y termina con ustedes escribiendo esas pruebas.",
      minutos: "APROXIMADAMENTE 55 MINUTOS · EN PAREJAS",
    });
    s.addNotes("30 segundos. Es el corazón de la sesión y el bloque que no se recorta. Estructura: 20 minutos de teoría con números medidos (C.1 a C.8) y 35 de laboratorio (C.9 a C.13). Repartir ahora el PDF de la guía: laboratorios-evm/guias/s08-pruebas-y-mutantes.pdf. Y decir en voz alta la regla del laboratorio, la que más se rompe: no se abren los archivos de los mutantes hasta que los tres estén muertos. Quien los abre antes cambia un ejercicio de pensar por un ejercicio de copiar, y la evaluación pregunta por el razonamiento, no por la diferencia.");
  }

  {
    const s = await D.lamina({ kicker: "C.0 · el contrato de hoy", titulo: "Recaudo: una vaca con meta y plazo", ic: "moneda", tituloSize: 28 });
    D.parrafo(s, "Un semillero recoge aportes para un proyecto. Hay una meta y una fecha de cierre. Lo que pase después depende de una sola cosa: si se alcanzó la meta o no.", { y: 1.85, h: 0.62, size: 14.5 });
    D.pasos(s, [
      ["MIENTRAS HAY PLAZO", "Cualquiera aporta con aportar(). El contrato anota cuánto puso cada quien y el total acumulado."],
      ["SE VENCE EL PLAZO", "Se acabaron los aportes. El contrato pasa a Exitoso si el total llegó a la meta, o a Fallido si no llegó."],
      ["SI FUE EXITOSO", "El beneficiario —el dueño del contrato— reclama todo con reclamarFondos(). Una sola vez."],
      ["SI FUE FALLIDO", "Cada aportante recupera exactamente lo suyo con reembolsar(). Ni más, ni el de otro."],
    ], { y: 2.62, alto: 0.82, gap: 0.1, anchoEt: 3.1, size: 13 });
    await D.ficha(s, {
      tipo: "pregunta", etiqueta: "Por qué este caso y no otro",
      x: M, y: 5.92, w: CW, h: 0.95,
      texto: "Tiene dinero, plazo y dos finales opuestos. Casi todos los errores de contratos viven en esos tres sitios.",
      size: 12.5,
    });
    s.addNotes("4 minutos. Leer el recorrido completo antes de abrir una sola línea de código: para escribir pruebas hay que conocer las REGLAS, no la sintaxis. Si alguien pregunta por qué el dueño es el beneficiario, es una decisión de diseño discutible y vale la pena decirlo: en un caso real el beneficiario podría ser otra dirección, y eso sería un parámetro más del constructor. El contrato está en contracts/s08/Recaudo.sol y NO trae pruebas en el repositorio: escribirlas es el laboratorio.");
  }

  {
    const s = await D.lamina({ kicker: "C.0 · Recaudo, en código", titulo: "Tres funciones y nueve formas de decir que no", ic: "codigo", tituloSize: 26 });
    D.codigo(s, `function aportar() external payable {
    if (block.timestamp >= fin) revert PlazoVencido();
    if (msg.value == 0)         revert AporteCero();
    aportes[msg.sender] += msg.value;
    totalRecaudado      += msg.value;
    emit Aporte(msg.sender, msg.value, totalRecaudado);
}

function reclamarFondos() external onlyOwner {
    if (block.timestamp < fin)    revert PlazoVigente();
    if (totalRecaudado < meta)    revert MetaNoAlcanzada();
    if (fondosReclamados)         revert YaReclamado();
    fondosReclamados = true;                 // efectos antes del envío
    (bool ok, ) = payable(owner()).call{value: address(this).balance}("");
}

function reembolsar() external {
    if (block.timestamp < fin)    revert PlazoVigente();
    if (totalRecaudado >= meta)   revert MetaAlcanzada();
    uint256 monto = aportes[msg.sender];
    if (monto == 0)               revert NadaQueReembolsar();
    aportes[msg.sender] = 0;                 // en cero ANTES de enviar
    (bool ok, ) = payable(msg.sender).call{value: monto}("");
}`, { x: M, y: 1.78, w: CW, h: 4.62, size: 9.5 });
    D.parrafo(s, "Cuenten las comparaciones: siete. Cada una es una regla, y cada regla tiene un borde. Ahí se esconden los tres errores.", { y: 6.48, h: 0.4, size: 12.5, color: C.ocre });
    s.addNotes("5 minutos. Recorrer las tres funciones señalando SOLO las comparaciones: >=, <, ==, <, >=, ==. Decir en voz alta que cada `>=` podría haber sido `>` y cada `<` un `<=`, y que el contrato seguiría compilando y pasando casi todas las pruebas. Esa es la idea entera del laboratorio. Señalar también el patrón que ya conocen de la S7: poner el estado en cero ANTES de enviar. El contrato completo son 95 líneas y está en el repositorio; esta lámina trae lo que importa para hoy.");
  }

  {
    const s = await D.lamina({ kicker: "C.1 · cobertura", titulo: "Qué mide, y qué no mide", ic: "grafico", tituloSize: 30 });
    D.codigo(s, `npx hardhat test test/s08/Recaudo.test.js --coverage`, { x: M, y: 1.9, w: 8.0, h: 0.62, lang: "js", size: 12.5 });
    D.dosColumnas(s,
      { et: "Qué mide", items: ["Qué líneas del contrato ejecutó alguna prueba.", "Qué líneas no se ejecutaron nunca: las lista por número.", "Sirve para encontrar funciones o reversiones que nadie probó."] },
      { et: "Qué NO mide", linea: C.rojo, color: C.rojo, items: ["Si la prueba comprobó el resultado: una prueba sin expect da cobertura.", "Si se probó el valor exacto del límite, o solo uno cómodo.", "Si el contrato hace lo que el negocio necesita."] },
      { y: 2.75, h: 2.65, size: 13 });
    D.enunciado(s, "La cobertura dice dónde NO hay pruebas. No dice que las que hay sirvan.", { y: 5.65, h: 1.05, size: 18, line: C.naranja });
    s.addNotes("3 minutos. Preguntar y esperar la respuesta: ¿una prueba que llama a aportar() y no comprueba nada cuenta para la cobertura? Sí, cuenta completo. ¿Y qué prueba? Solo que la llamada no revirtió. Esa pregunta es toda la lámina. El 80 % que pide la rúbrica del curso es un piso, no una meta: sirve para detectar funciones enteras sin probar, que es un problema real y frecuente. Lo que no sirve es tratarlo como certificado de calidad, y las cifras de C.5 lo demuestran con el contrato de hoy.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · leer el informe", titulo: "Una fila, tres columnas y una lista", ic: "lupa", tituloSize: 29 });
    D.codigo(s, `║ File Path                  │ Line % │ Statement % │ Uncovered Lines                                     ║
║ contracts\\s08\\Recaudo.sol  │ 11.54  │ 15.79       │ 49, 55-56, 60, 63-64, 66, 70-72, 74-75, 77-78, 80,… ║
║ contracts\\s07\\Subasta.sol  │ 18.18  │ 0.00        │ 59-61, 67-69, 74-75, 83, 89-91, 93-96, 98-99, 101,… ║
║ Total                      │ 18.49  │ 0.73        │                                                     ║`,
      { x: M, y: 1.9, w: CW, h: 1.5, lang: "js", size: 10.5, titulo: "salida real con la plantilla del laboratorio, recortada" });
    D.pasos(s, [
      ["BUSQUEN SU FILA", "El informe lista TODOS los contratos del repositorio. La única que importa es la de contracts\\s08\\Recaudo.sol."],
      ["IGNOREN EL TOTAL", "18,49 % de Total no significa nada: suma contratos de otras sesiones que esta suite ni toca."],
      ["LEAN LAS LÍNEAS", "Cada número es una pregunta. Abran Recaudo.sol en esa línea y escriban la prueba que la ejecutaría."],
    ], { y: 3.7, alto: 0.84, gap: 0.12, anchoEt: 2.9, size: 12.5 });
    D.parrafo(s, "Son cifras reales: es lo que da la plantilla de dos pruebas del laboratorio. Queda además un informe navegable en coverage/html.", { y: 6.5, h: 0.32, size: 11.5, color: C.gris });
    s.addNotes("3 minutos. Esta salida es literal: se midió al preparar la sesión corriendo la plantilla del andamiaje tal como la van a copiar ellos. Señalar la segunda columna: se llama Statement %, mide sentencias y no líneas, y es normal que no coincida con Line %. Señalar también que Subasta.sol aparece con 18 % en esta corrida solo porque esta suite no la prueba; con su propia suite llega a 97,06 %. Eso es lo que significa «busquen su fila». Y la tercera columna es la que de verdad se usa: no es un castigo, es una lista de preguntas.");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · pruebas de mutación", titulo: "¿Mis pruebas notarían un error?", ic: "bicho", tituloSize: 28 });
    D.parrafo(s, "La idea es simple y un poco desagradable: se toma el contrato, se le mete un error pequeño a propósito —eso es un mutante— y se corre la misma suite, sin tocar ni una prueba. Lo que pase después dice si la suite sirve.", { y: 1.85, h: 0.9, size: 13.5 });
    D.dosColumnas(s,
      { et: "Mutante MUERTO", linea: C.verde, color: C.verde, texto: "Al menos una prueba falla contra él. La suite vio el error: ese error no habría llegado a producción." },
      { et: "Mutante VIVO", linea: C.rojo, color: C.rojo, texto: "Todas las pruebas siguen en verde. El error está ahí y nadie lo nota: así se despliega un contrato roto." },
      { y: 2.9, h: 1.8, size: 13.5 });
    await D.ficha(s, {
      tipo: "profundidad", etiqueta: "Por qué esto importa más aquí que en una aplicación web",
      x: M, y: 4.9, w: CW, h: 1.8,
      texto: "La cobertura dice dónde no hay pruebas; la mutación dice si las que hay sirven. Son preguntas distintas y la segunda es la que importa, porque un contrato desplegado no se puede parchear. Lo que esta tarde es un mutante de juguete, en producción es una línea mal escrita que custodia dinero para siempre, y la suite en verde es lo único que había entre ella y el despliegue.",
      size: 13,
    });
    s.addNotes("4 minutos. Insistir en que no se toca ninguna prueba: lo único que cambia es el contrato. Si la suite no nota la diferencia, la suite no estaba vigilando esa parte. Es la misma lógica de la S7 cuando el contrato del docente tenía un hueco y las once pruebas de AtaqueAlTope estaban en verde: las pruebas comprueban lo que a uno se le ocurrió comprobar. La mutación es la forma de medir qué tan buena fue esa ocurrencia, y es un número, no una opinión.");
  }

  {
    const s = await D.lamina({ kicker: "C.3b · los tres de hoy", titulo: "Qué son exactamente esos mutantes", ic: "bicho", tituloSize: 28 });
    D.parrafo(s, "En la carpeta del laboratorio, al lado de Recaudo.sol, hay tres archivos más: RecaudoMutante1, 2 y 3. Son copias del mismo contrato, idénticas línea por línea salvo UNA.", { y: 1.85, h: 0.65, size: 14 });
    D.tabla(s, ["lo que hay que saber", "el detalle"], [
      ["Los escribió el docente", "No son un error que apareció solo: cada uno tiene un error metido a propósito, y los tres son distintos entre sí."],
      ["Uno solo cada uno", "Un cambio mínimo: una comparación, un número, una línea que falta. El contrato compila igual y funciona igual casi siempre."],
      ["No se dice cuál ni dónde", "Ni en el deck, ni en la guía, ni en el encabezado del archivo. Averiguarlo es el ejercicio."],
      ["Están abiertos", "Pueden abrirlos: nadie se lo impide. Pero el que los abre se queda sin laboratorio, y en el parcial no va a haber un archivo que abrir."],
      ["Se corren solos", "El cazador toma SU suite —sin tocar ni una prueba— y la corre contra los cuatro contratos, uno tras otro."],
    ], { y: 2.58, h: 3.15, colW: [3.3, 8.793], size: 11.5 });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "Y por eso la regla del laboratorio es rara pero justa",
      x: M, y: 5.80, w: CW, h: 1.05,
      texto: "No se cambia ni una línea de ningún contrato. Lo único que se escribe son pruebas.",
      size: 13,
    });
    s.addNotes("4 minutos. Aquí se despeja la confusión más común del laboratorio: creen que hay que arreglar los mutantes. NO. Los mutantes se quedan rotos para siempre; lo que se construye es la suite que los delata. La frase para decirlo: «ustedes no son los que arreglan, son los que detectan». Sobre abrirlos: no prohibirlo con tono de examen, decir la consecuencia y seguir — el que abre se queda sin el ejercicio, y la plantilla del parcial no viene con archivos que abrir.");
  }

  {
    const s = await D.lamina({ kicker: "C.4 · ejemplo trabajado · la Subasta de la S7", titulo: "Dos mutantes, medidos", ic: "diana", tituloSize: 29 });
    D.tabla(s, ["mutante sobre Subasta.sol", "contra las 23 pruebas de la S7", "por qué"], [
      ["INCREMENTO_MINIMO_BPS = 10 en vez de 100", "MUERTO · 21 pasan, 2 fallan", "Dos pruebas comparan el valor exacto: 2,02 ETH y 0,02 ETH. El 10 % no da eso."],
      ["Comentar el emit Retiro(...) de retirar()", "VIVO · 23 pasan, 0 fallan", "Ninguna de las 23 comprueba ese evento. La línea se ejecuta; nadie mira qué emite."],
    ], { y: 1.9, h: 1.8, colW: [4.4, 3.2, 4.493], size: 11 });
    await D.ficha(s, {
      tipo: "profundidad", etiqueta: "Lo que enseña el mutante que sobrevivió",
      x: M, y: 3.9, w: CW, h: 2.1,
      texto: "Subasta.sol tiene 97,06 % de cobertura de líneas y aun así, sin ese emit, una interfaz que escuche el evento Retiro deja de enterarse de los retiros y ninguna prueba lo nota. La línea estaba cubierta; lo que nadie comprobaba era lo que emitía. Arreglarlo cuesta una línea, la de B.8: .to.emit(s, \"Retiro\").withArgs(ana.address, eth(1)).",
      size: 12.5,
    });
    D.parrafo(s, "Las dos corridas se hicieron esta semana en una copia aislada del repositorio, contra test/s07/Subasta.test.js. Ejercicio relámpago, treinta segundos: ¿qué prueba agregarían para matar al segundo?", { y: 6.1, h: 0.6, size: 12.5 });
    s.addNotes("5 minutos y es la lámina que convence. A propósito los dos ejemplos son de la SUBASTA de la semana pasada y no del contrato del laboratorio: los mutantes de Recaudo no se muestran ni se insinúan. Las cifras son medidas: con el primer mutante fallan exactamente «exige superar la puja anterior al menos en 1 %» y «se usa desde la subasta: 1 % de 2 ETH son 0,02 ETH»; con el segundo pasan las 23. Hacer el ejercicio relámpago de verdad, con la mano levantada: alguien va a decir «comprobar el evento», y ahí está. Si nadie lo dice, mostrar la línea de la ficha y dejar que la lean.");
  }

  {
    const s = await D.lamina({ kicker: "C.5 · el experimento de esta semana", titulo: "88 % de cobertura y tres errores vivos", ic: "grafico", tituloSize: 27 });
    D.parrafo(s, "Preparando el laboratorio se escribió una suite de referencia para Recaudo y tres copias del contrato, cada una con un error distinto. Después se quitaron SOLO las tres pruebas de borde. Esto es lo que salió.", { y: 1.85, h: 0.85, size: 14 });
    D.tabla(s, ["", "sin las pruebas de borde", "suite completa", "la diferencia"], [
      ["Pruebas", "13", "16", "+3 pruebas de borde"],
      ["Cobertura de líneas", "88,46 %", "92,31 %", "+3,85 puntos"],
      ["Sentencias (Statement %)", "92,11 %", "94,74 %", "+2,63 puntos"],
      ["Líneas sin cubrir", "60, 78, 93", "78, 93", "una línea menos"],
      ["Los tres mutantes", "VIVOS · 0 fallan", "MUERTOS · 1 falla cada uno", "de no ver nada a verlo todo"],
    ], { y: 2.8, h: 3.0, colW: [2.9, 2.9, 3.1, 3.193], size: 11 });
    D.enunciado(s, "Tres pruebas separan «no detecta nada» de «detecta todo».", { y: 5.95, h: 0.85, size: 17, line: C.naranja });
    s.addNotes("5 minutos, y es la lámina que justifica el día entero. Leer la tabla fila por fila y detenerse en la última. Con 13 pruebas la suite cumplía la meta del curso —88,46 % supera el 80 %— y no detectaba NINGUNO de los tres errores. Con tres pruebas más la cobertura sube menos de cuatro puntos y los tres mueren, cada uno con exactamente una prueba que falla. Decirlo con todas las letras: la cobertura subió 3,85 puntos y la capacidad de detectar errores pasó de cero a tres de tres. No son magnitudes comparables. Lo que NO se dice aquí, ni aunque pregunten: cuáles son esas tres pruebas ni qué cambia cada mutante. Si insisten, la respuesta es la lámina siguiente.");
  }

  {
    const s = await D.lamina({ kicker: "C.6 · pruebas de borde", titulo: "Dónde viven los errores", ic: "diana", tituloSize: 31 });
    D.tabla(s, ["borde", "la pregunta que hay que hacerle al contrato", "por qué ahí"], [
      ["Tiempo", "¿Qué pasa un segundo antes, en el segundo exacto y un segundo después de cada plazo?", "Una comparación mal escrita deja entrar o salir justo en el límite, y ninguna prueba «normal» llega a ese instante."],
      ["Umbral", "¿Qué pasa con el valor exacto de cada límite: ni un wei más, ni uno menos?", "Los casos cómodos siempre quedan lejos del límite, así que nadie los prueba y ahí nadie mira."],
      ["Repetición", "¿Qué pasa si la misma cuenta llama dos veces seguidas a la misma función?", "Un efecto que debería ocurrir una sola vez puede repetirse si el estado no cambió antes."],
      ["Cero y vacío", "¿Qué pasa con 0, con la dirección cero, con un texto vacío?", "Son valores perfectamente válidos para la EVM y absurdos para el negocio."],
      ["Quién llama", "¿Qué pasa si llama otra cuenta, o si quien llama es un contrato?", "Basta una función a la que se le olvidó el modificador."],
    ], { y: 1.9, h: 4.3, colW: [2.0, 4.9, 5.193], size: 11.5 });
    D.parrafo(s, "Para cada función, recorrer las cinco filas y escribir la prueba que falta. Así se encuentra lo que la cobertura no ve.", { y: 6.35, h: 0.42, size: 13, color: C.ocre });
    s.addNotes("4 minutos. Esta tabla es la herramienta del laboratorio y es la única pista que se da. Hacerla con ellos sobre una función de Recaudo que no sea candidata a mutante, para mostrar el método sin regalar la respuesta. Y cuando alguien pregunte «¿cuál es el de tiempo?», devolver la pregunta: «¿qué comparaciones con el tiempo tiene Recaudo, y qué prueba haría falta en cada límite?». No asociar ninguna fila a ningún mutante, ni por gesto: la mitad de la sala está mirando la cara del docente, no la lámina.");
  }

  {
    const s = await D.lamina({ kicker: "C.7 · el reloj en el límite · ejemplo trabajado", titulo: "¿En qué segundo cae mi transacción?", ic: "reloj", tituloSize: 27 });
    D.parrafo(s, "La Subasta de la S7 dice: if (block.timestamp >= fin) revert SubastaCerrada(). ¿Qué pasa si alguien puja en el segundo exacto de fin? Para probarlo hay que poder llevar una transacción a ese segundo, y no a «una hora después».", { y: 1.85, h: 0.95, size: 13.5 });
    D.tabla(s, ["herramienta", "qué hace con el reloj", "la puja siguiente cae en", "sirve para probar"], [
      ["time.increaseTo(fin)", "Mina un bloque vacío con marca fin.", "fin + 1", "«después del cierre»"],
      ["time.setNextBlockTimestamp(fin)", "No mina nada: fija la marca del PRÓXIMO bloque.", "fin, exacto", "«en el segundo exacto»"],
      ["setNextBlockTimestamp(fin - 1n)", "Lo mismo, un segundo antes.", "fin - 1", "«un segundo antes»"],
    ], { y: 2.95, h: 2.2, colW: [3.5, 3.7, 2.4, 2.493], size: 11.5 });
    await D.ficha(s, {
      tipo: "termino", etiqueta: "La regla, para cualquier plazo de cualquier contrato",
      x: M, y: 5.35, w: CW, h: 1.37,
      texto: "Por cada comparación con el tiempo, tres pruebas: un segundo antes, el segundo exacto y un segundo después. Una prueba con «una semana después» nunca llega al límite: por eso casi nadie lo prueba, y por eso ahí viven los errores.",
      size: 12.5,
    });
    s.addNotes("4 minutos. Dibujar en el tablero la línea de tiempo con tres marcas —fin-1, fin, fin+1— y escribir encima de cada una qué debe pasar según el >= del contrato. Es el ejercicio que tienen que repetir con cada plazo de Recaudo. La diferencia entre las dos herramientas parece un detalle de biblioteca y es la razón por la que un plazo mal escrito pasa todas las pruebas: increaseTo deja la siguiente transacción UN segundo después del límite, que es justo el caso cómodo. fin es BigInt en ethers v6, de ahí el 1n.");
  }

  {
    const s = await D.lamina({ kicker: "C.8 · laboratorio · arrancar", titulo: "El contrato, la plantilla y la regla", ic: "terminal", tituloSize: 28 });
    D.codigo(s, `npx hardhat --version                                    # 3.16.0
mkdir test\\s08                                           # Git Bash: mkdir -p test/s08
copy andamiaje\\s08\\Recaudo.test.js test\\s08\\             # Git Bash: cp ...
npx hardhat test test/s08/Recaudo.test.js                # 2 passing: los dos ejemplos`,
      { x: M, y: 1.9, w: CW, h: 1.55, lang: "js", size: 11.5 });
    D.tabla(s, ["final del recaudo", "condición, una vez vencido el plazo", "qué se puede hacer"], [
      ["Exitoso", "totalRecaudado >= meta", "El dueño reclama los fondos, una sola vez."],
      ["Fallido", "totalRecaudado < meta", "Cada aportante recupera exactamente lo suyo."],
    ], { y: 3.6, h: 1.25, colW: [2.2, 4.3, 5.593], size: 12 });
    D.pasos(s, [
      ["LEER EL CONTRATO", "contracts/s08/Recaudo.sol: tres funciones y dos finales. Subrayen cada <, >= y ==: esa es su lista de bordes."],
      ["NO ABRIR LOS MUTANTES", "Hasta que los tres estén muertos. Abrirlos antes cambia el ejercicio por copiar una diferencia."],
    ], { y: 5.05, alto: 0.80, gap: 0.10, anchoEt: 3.2, size: 12.5 });
    s.addNotes("5 minutos. Contar el caso en dos frases: un semillero recoge aportes; si al vencer el plazo se alcanzó la meta el beneficiario reclama, y si no, cada aportante recupera exactamente lo que puso. Después mandar a leer el archivo con lápiz: subrayar cada comparación y cada cambio de estado. Ese subrayado ES la lista de pruebas de borde, y es el único trabajo de pensamiento del laboratorio; lo demás es sintaxis que está en las láminas B.4 a B.8. La plantilla trae 2 pruebas de ejemplo, una de caso feliz y una de reversión, y esas dos cuentan para las diez.");
  }

  {
    const s = await D.lamina({ kicker: "C.9 · laboratorio · parte 1 · 20 minutos", titulo: "Escribir la suite: diez pruebas o más", ic: "codigo", tituloSize: 28 });
    D.tabla(s, ["grupo", "mínimo", "qué no olvidar"], [
      ["despliegue", "2", "Parámetros inválidos en el constructor."],
      ["aportar", "3", "El evento con argumentos exactos. Los dos extremos del plazo."],
      ["recaudo exitoso", "3", "Permisos. Doble reclamo. El saldo exacto que recibe el dueño. El límite de la meta."],
      ["recaudo fallido", "3", "Cada quien lo suyo. Quien no aportó. El dueño no se lleva nada. Las repeticiones."],
    ], { y: 1.9, h: 2.5, colW: [2.6, 1.3, 8.193], size: 12 });
    await D.ficha(s, {
      tipo: "termino", etiqueta: "Una prueba falla por la razón correcta, o no prueba nada",
      x: M, y: 4.6, w: CW, h: 2.1,
      texto: "Antes de dar por buena una prueba de reversión, pregúntense qué OTRA cosa podría hacerla revertir. Si la segunda llamada revierte porque el contrato se quedó sin dinero y no por la regla que querían comprobar, la prueba pasa por accidente y seguiría pasando si la regla no existiera. Diseñen el escenario para que SOLO la regla pueda detener la transacción, y exijan el error exacto con revertedWithCustomError.",
      size: 12.5,
    });
    s.addNotes("20 minutos. Circular, pareja por pareja, sin tocar el teclado. La ficha es el consejo más importante del laboratorio y sirve para cualquier prueba de reversión de aquí al final del semestre. Si una pareja se traba en sintaxis, remitir a B.4 a B.8 y a la sección de herramientas de la guía, no explicarlo de nuevo: el tiempo del docente se gasta en el razonamiento de los bordes, que es lo que no está escrito en ninguna parte. A los 10 minutos, aviso en voz alta: «la mitad del tiempo».");
  }

  {
    const s = await D.lamina({ kicker: "C.10 · laboratorio · parte 2 · 5 minutos", titulo: "Medir la cobertura y leer lo que falta", ic: "grafico", tituloSize: 28 });
    D.codigo(s, `npx hardhat test test/s08/Recaudo.test.js --coverage

║ contracts\\s08\\Recaudo.sol  │ 11.54  │ 15.79  │ …   ← esto es lo que da la plantilla`,
      { x: M, y: 1.9, w: CW, h: 1.0, lang: "js", size: 11.5 });
    D.pasos(s, [
      ["SU FILA", "contracts\\s08\\Recaudo.sol, columna Line %. La meta del curso es 80 o más."],
      ["CADA NÚMERO", "Abran Recaudo.sol en esa línea y pregúntense qué prueba la ejecutaría. Escríbanla."],
      ["LO QUE QUEDE", "Si solo quedan líneas de revert EnvioFallido, está bien: exigen un receptor que rechace el pago. Anótenlo."],
    ], { y: 3.1, alto: 0.82, gap: 0.10, anchoEt: 2.5, size: 12.5 });
    D.parrafo(s, "Cómo saben que esta parte terminó: diez pruebas o más en verde, y Line % de 80 o más en la fila de Recaudo.sol. Captura de pantalla, que es la evidencia. Y una advertencia que la parte 3 va a demostrar: llegar al 80 % es la parte fácil, y no basta.", { y: 5.9, h: 0.85, size: 13 });
    s.addNotes("5 minutos. El 11,54 % de la lámina es real: es la cobertura de la plantilla con sus dos pruebas de ejemplo. Casi todas las parejas van a pasar del 80 % sin esfuerzo, y eso es parte del diseño del laboratorio: la sensación de haber terminado es exactamente la que la parte 3 va a desarmar. No adelantarlo; dejar que lo descubran cuando corran el cazador.");
  }

  {
    const s = await D.lamina({ kicker: "C.11 · laboratorio · parte 3 · 10 minutos", titulo: "Cazar los tres mutantes", ic: "diana", tituloSize: 30 });
    D.codigo(s, `node scripts/s08/cazar-mutantes.js

  Suite: test/s08/Recaudo.test.js

  ✔ Recaudo (correcto)      2 pruebas en verde

  ✗ VIVO    RecaudoMutante1   2 pasan · 0 fallan
  ✗ VIVO    RecaudoMutante2   2 pasan · 0 fallan
  ✗ VIVO    RecaudoMutante3   2 pasan · 0 fallan

  3 mutante(s) sobrevive(n). Hay un error que su suite no ve: piensen en los bordes.`,
      { x: M, y: 1.9, w: CW, h: 2.9, lang: "js", size: 11.5, titulo: "salida real con la plantilla de dos pruebas" });
    D.pasos(s, [
      ["MIENTRAS HAYA VIVOS", "Volver a la tabla de bordes de C.6 y al subrayado de Recaudo.sol. Escribir la prueba que falta. No abrir el mutante."],
      ["CUANDO MUERAN LOS TRES", "Ahora sí: abrir cada mutante, encontrar la diferencia y anotar qué prueba lo mató y por qué esa."],
    ], { y: 5.0, alto: 0.80, gap: 0.10, anchoEt: 3.3, size: 12.5 });
    s.addNotes("10 minutos. La salida de la lámina es literal, medida con la plantilla: los tres vivos. Mutante muerto significa que al menos una prueba falla contra él, nada más. Si el script dice que no encontró pruebas, la suite no está en test/s08/Recaudo.test.js. Cuando una pareja pida una pista, solo se dan preguntas de la tabla C.6 aplicadas a una función concreta —«¿qué pasa en el límite exacto de esa comparación?»—, nunca «el mutante 2 es…». Dato útil para calibrar: con la suite de referencia del docente cada mutante muere con exactamente UNA prueba, así que quien escribió las tres de borde los mata los tres.");
  }

  {
    const s = await D.lamina({ kicker: "C.12 · el corte", titulo: "Si a los 35 minutos nadie mató el primero", ic: "tijera", tituloSize: 27 });
    D.enunciado(s, "Minuto 35 del bloque: si nadie mató al primero, se mata entre todos.", { y: 1.85, h: 1.3, size: 20, line: C.naranja });
    D.pasos(s, [
      ["EN EL TABLERO", "El docente escribe las comparaciones de Recaudo.sol y la sala propone el borde, en voz alta, sin computador."],
      ["SE ESCRIBE JUNTOS", "La prueba se teclea en el proyector, se corre, y el primer mutante muere delante de todos."],
      ["LOS OTROS DOS", "Quedan de trabajo autónomo, con la misma evidencia: qué prueba lo mató y por qué esa."],
    ], { y: 3.3, alto: 0.82, gap: 0.10, anchoEt: 2.8, size: 12.5 });
    D.parrafo(s, "Nadie se va sin haber visto morir un mutante. Un laboratorio que no llega al final no enseña la lección, y la lección es lo que se evalúa, no la velocidad.", { y: 6.08, h: 0.72, size: 12.5, color: C.ocre });
    s.addNotes("Esta lámina es un plan de contingencia y es para el docente: se proyecta solo si hace falta. Mirar el reloj en el minuto 35 del bloque C y decidir sin negociar. Si hay al menos dos parejas con un mutante muerto, no se corta: se les pide que cuenten en voz alta qué prueba lo mató, sin decir cuál era el error, y eso basta como pista para el resto. Si no hay ninguna, se corta y se hace en el tablero. El riesgo que esta lámina evita es el peor de la sesión: terminar el bloque C con la sala frustrada y sin haber visto la lección, que es justo lo contrario de lo que el experimento de C.5 quería demostrar.");
  }

  {
    const s = await D.lamina({ kicker: "C.13 · qué sale mal, y qué se entrega", titulo: "Errores frecuentes y evidencia", ic: "bicho", tituloSize: 27 });
    D.tabla(s, ["síntoma", "causa, y qué hacer"], [
      ["El script dice «No se encontraron pruebas»", "La suite no está en test/s08/Recaudo.test.js."],
      ["Una prueba de plazo pasa contra los tres mutantes", "Nunca llega al segundo exacto: vuelvan a C.7."],
      ["Una reversión pasa, pero por otra razón", "Rediseñen el escenario y exijan el error exacto."],
      ["loadFixture falla con una flecha anónima", "La fixture necesita nombre: async function desplegar()."],
      ["Cambié el contrato y el mutante murió", "No se toca el contrato. Se escriben pruebas."],
    ], { y: 1.9, h: 2.6, colW: [5.0, 7.093], size: 11 });
    D.tabla(s, ["criterio de la guía", "qué se entrega", "peso"], [
      ["Suite", "Diez pruebas o más de las cinco familias, en verde contra el contrato correcto.", "25 %"],
      ["Cobertura", "Captura con Line % de 80 o más, y una explicación de cada línea sin cubrir.", "15 %"],
      ["Mutantes", "Los tres muertos, con qué prueba mató a cada uno y por qué la cobertura no lo veía.", "35 %"],
      ["Despliegue", "Hoy: la salida de Ignition en local. Queda en deuda hasta desplegar en Sepolia.", "25 %"],
    ], { y: 4.75, h: 1.9, colW: [2.2, 8.293, 1.6], size: 11 });
    s.addNotes("4 minutos. La segunda tabla es la rúbrica de la guía en PDF, sin cambiarle los pesos. Decir en voz alta lo del último criterio: el despliegue vale 25 % y exige Sepolia verificado, así que hoy queda la mitad hecha —el módulo probado en local— y la otra mitad en deuda. Esa deuda se cierra cuando haya ETH de prueba, y la lámina del cierre dice qué se cae si no se cierra. La quinta fila de la primera tabla es la que más se rompe: tocar el contrato para que el mutante muera no es matar un mutante, es borrarlo.");
  }

  await verificacion({
    kicker: "Verificación · bloque C",
    titulo: "Lo que el laboratorio debió dejar claro",
    preguntas: [
      "Su suite pasó del 80 % de cobertura antes de matar a los tres mutantes. ¿Qué les dice eso sobre el requisito del 80 %?",
      "Para una de sus pruebas de borde: ¿qué otra razón podría haberla hecho fallar, y cómo descartaron esa razón?",
      "¿Qué líneas de Recaudo.sol les quedaron sin cubrir, y por qué es aceptable (o no lo es)?",
      "Si la cobertura sube 3,85 puntos y la detección pasa de 0 a 3 errores de 3, ¿para qué sirve exactamente la cobertura?",
    ],
    notas: "4 minutos. Respuestas: (1) el 80 % es necesario pero no suficiente; sirve para encontrar lo que nadie probó, no para certificar que lo probado está bien. (2) Depende de la pareja; lo que importa es que puedan explicar por qué SOLO la regla podía hacer fallar esa prueba. (3) Típicamente las dos líneas de revert EnvioFallido, que exigen un receptor que rechace el pago: es aceptable si saben decir por qué, y no lo es si no lo saben. (4) Para saber dónde NO hay pruebas. Es un detector de huecos, no una medida de calidad, y conviene cerrar el bloque con esa frase. No revelar aquí ninguna prueba del solucionario, ni siquiera a quien ya terminó.",
  });

  /* ================================================================
     BLOQUE D · DESPLEGAR SIN GASTAR UN PESO · 25 minutos
     ================================================================ */

  {
    const s = await D.divisor({
      letra: "D", titulo: "Desplegar sin gastar un peso", ic: "cohete",
      sub: "El despliegue en la red local se hace ahora, en vivo y gratis. El salto a Sepolia y la verificación del código se explican: hoy no hay ETH de prueba, y eso queda dicho como deuda.",
      minutos: "APROXIMADAMENTE 25 MINUTOS · EN VIVO",
    });
    s.addNotes("30 segundos. Decirlo sin rodeos y sin disculpas: hoy no hay ETH de prueba, así que el despliegue en Sepolia no se hace. Lo que sí se hace, completo y en vivo, es el despliegue en la red local, que es donde se descubre el 90 % de los errores de un módulo de despliegue y no cuesta nada. Lo de Sepolia se explica entero —qué cambia, qué es el keystore, qué es verificar— para que el día que haya fondos sea media hora de trabajo y no una clase nueva. El docente dicta este bloque con la terminal abierta: son dos comandos y las salidas están en las láminas por si la máquina falla.");
  }

  {
    const s = await D.lamina({ kicker: "D.1 · el módulo de despliegue", titulo: "Ignition: qué se despliega, y con qué valores", ic: "cohete", tituloSize: 25 });
    D.codigo(s, `import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("RecaudoModulo", (m) => {
  const meta = m.getParameter("meta", 10n * 10n ** 18n);
  const duracion = m.getParameter("duracionSegundos", 7 * 24 * 60 * 60);

  const recaudo = m.contract("Recaudo", [meta, duracion]);
  return { recaudo };
});`, { x: M, y: 1.9, w: 7.3, h: 2.9, lang: "js", size: 11, titulo: "ignition/modules/Recaudo.js · el archivo real" });
    D.codigo(s, `{
  "RecaudoModulo": {
    "meta": "5000000000000000",
    "duracionSegundos": 1800
  }
}`, { x: M + 7.6, y: 1.9, w: CW - 7.6, h: 2.9, lang: "js", size: 11.5, titulo: "parametros/recaudo-sepolia.json" });
    D.lista(s, [
      "Describe QUÉ se despliega, no los pasos: Ignition decide el orden y los lotes.",
      "El segundo argumento de getParameter es el valor por omisión: con eso funciona en la red local sin pasar ningún archivo.",
      "El mismo módulo sirve para la red local y para Sepolia. Lo único que cambia son los parámetros: 0,005 ETH y 30 minutos en lugar de 10 ETH y 7 días.",
      "Los números grandes van como texto en el JSON, porque 5 · 10¹⁵ no cabe exacto en un número de JavaScript.",
    ], { y: 5.1, h: 1.65, size: 12.5, gap: 6 });
    s.addNotes("4 minutos. Abrir el archivo real en el proyector mientras se explica: son nueve líneas y se entienden de una pasada. Lo importante es la idea: un módulo es una descripción, no un guion de pasos. Señalar la diferencia de parámetros entre local y Sepolia y explicar por qué: en Sepolia la meta es 0,005 ETH y el plazo 30 minutos para que el laboratorio se pueda terminar en una sesión; en local da igual, porque el reloj se puede adelantar. Y el detalle de los números como texto es un error real que aparece cuando alguien escribe la meta sin comillas.");
  }

  {
    const s = await D.lamina({ kicker: "D.2 · en vivo", titulo: "Desplegar en la red local", ic: "terminal", tituloSize: 30 });
    D.codigo(s, `npx hardhat node                      # en OTRA terminal: la red local como servidor
npx hardhat ignition deploy ignition/modules/Recaudo.js --network localhost

Hardhat Ignition

Deploying [ RecaudoModulo ]

Batch #1
  Executing RecaudoModulo#Recaudo...
  Executed RecaudoModulo#Recaudo

[ RecaudoModulo ] successfully deployed

Deployed Addresses

RecaudoModulo#Recaudo - 0x5FbDB2315678afecb367f032d93F642f64180aa3`,
      { x: M, y: 1.9, w: CW, h: 3.8, lang: "js", size: 11, titulo: "salida real, medida al preparar la sesión · sin los emojis de la terminal" });
    D.parrafo(s, "Cómo se sabe que funcionó: dice «successfully deployed» y da una dirección. Esa dirección es siempre la misma en una red local recién arrancada —primera cuenta, nonce 0—, y eso es señal de que la red es determinista, no de que algo esté mal. Sin npx hardhat node, el mismo comando funciona igual pero contra una red en memoria que se borra al terminar.", { y: 5.8, h: 0.95, size: 13 });
    s.addNotes("5 minutos, en vivo y en la terminal del docente. Si la máquina falla, la salida está en la lámina y la clase sigue. Dos cosas que decir mientras corre. UNA: esto no gasta nada y se puede repetir cien veces, así que es aquí donde se corrigen los errores del módulo, no en Sepolia. DOS: si el módulo falla aquí, va a fallar en Sepolia, y allá cada intento cuesta ETH de prueba y minutos de espera. El puerto es localhost:8545 y el identificador de cadena 31337; si el puerto está ocupado, cerrar el otro proceso antes de insistir.");
  }

  {
    const s = await D.lamina({ kicker: "D.3 · el recibo", titulo: "Qué quedó registrado del despliegue", ic: "documento", tituloSize: 29 });
    D.codigo(s, `ignition/deployments/chain-31337/
├── deployed_addresses.json   la dirección desplegada
├── journal.jsonl             el diario de lo que se hizo
├── artifacts/                el ABI del contrato
└── build-info/               fuente y configuración del compilador

{ "RecaudoModulo#Recaudo": "0x5FbDB2315678afecb367f032d93F642f64180aa3" }`,
      { x: M, y: 1.9, w: 7.2, h: 2.25, lang: "js", size: 11, titulo: "lo que Ignition escribió en el disco" });
    D.codigo(s, `desde     0xf39F…2266  (cuenta 1)
contrato  0x5FbDB…0aa3
bloque    1
estado    SUCCESS
gas       515 666
bytecode  2 014 bytes
args      10 ETH · 604 800 s`,
      { x: M + 7.5, y: 1.9, w: CW - 7.5, h: 2.25, lang: "js", size: 11, titulo: "el recibo, leído del nodo" });
    D.pasos(s, [
      ["LO QUE SE GUARDA", "La dirección, el diario, el ABI y la configuración exacta del compilador. Las cuatro cosas hacen falta para verificar."],
      ["LO QUE SE SUBE A GIT", "El de Sepolia (chain-11155111) sí, como evidencia del Avance 1. El de la red local (chain-31337) lo excluye el .gitignore."],
    ], { y: 4.45, alto: 0.84, gap: 0.10, anchoEt: 3.0, size: 12.5 });
    D.parrafo(s, "Las cifras del recibo se midieron al preparar esta lámina, pidiéndole al nodo local el recibo de esa transacción.", { y: 6.35, h: 0.4, size: 12.5, color: C.gris });
    s.addNotes("4 minutos. Señalar build-info: ahí queda guardada la fuente y la configuración con la que se compiló, y es justo lo que hay que declarar al verificar. Eso conecta esta lámina con D.7. Los 2 014 bytes son el tamaño del código que quedó en la cadena: es lo único que hay allá, y es la razón de que la verificación exista. El gas de 515 666 en la red local no cuesta nada; el mismo despliegue en Sepolia gastaría ese gas en ETH de prueba, que es la otra mitad de la deuda de hoy.");
  }

  {
    const s = await D.lamina({ kicker: "D.4 · por qué Ignition y no un script", titulo: "Correr el mismo comando dos veces", ic: "flecha", tituloSize: 28 });
    D.codigo(s, `npx hardhat ignition deploy ignition/modules/Recaudo.js --network localhost
[ RecaudoModulo ] Nothing new to deploy based on previous execution stored in .\\ignition\\deployments\\chain-31337`,
      { x: M, y: 1.9, w: CW, h: 1.1, lang: "js", size: 11, titulo: "segunda corrida · salida real" });
    D.dosColumnas(s,
      { et: "Un script suelto", linea: C.rojo, color: C.rojo, texto: "Si se cae después de desplegar y antes de guardar la dirección, al repetirlo despliega otra vez. Quedan dos contratos, el dinero gastado dos veces, y nadie sabe cuál es el bueno." },
      { et: "Ignition", texto: "Escribe cada paso en el diario antes de darlo. Al repetir el comando lee el diario, ve que ya está hecho y no vuelve a desplegar: dice «Nothing new to deploy»." },
      { y: 3.2, h: 2.1, size: 13 });
    D.parrafo(s, "Por eso el mismo comando se puede repetir sin miedo. Y si una verificación falla por tiempo de espera, se vuelve a lanzar tal cual: Ignition sabe que el contrato ya está desplegado y solo reintenta lo que falta.", { y: 5.5, h: 1.2, size: 13 });
    s.addNotes("3 minutos. Correrlo en vivo: es el mismo comando de D.2 otra vez, y la salida cambia. La idea de fondo es la del curso: un despliegue tiene que poder repetirse y dar el mismo resultado, igual que una compilación. Mencionar --reset para empezar de cero en la red local cuando se quiere desplegar otra vez a propósito; en una red real eso no se usa a la ligera, porque el contrato anterior sigue existiendo para siempre. El plural «lotes» de D.1 se ve aquí: con un solo contrato hay un Batch #1 y nada más.");
  }

  {
    const s = await D.lamina({ kicker: "D.5 · lo teórico", titulo: "Qué cambia al apuntar a Sepolia", ic: "red", tituloSize: 30 });
    D.tabla(s, ["lo que cambia", "en la red local · lo de hoy", "en Sepolia · lo pendiente"], [
      ["La red", "Nada, o --network localhost.", "--network sepolia, y una URL de nodo con clave de API."],
      ["La clave", "Las 20 cuentas de la red local, públicas.", "La clave privada de la billetera del curso, en el keystore."],
      ["El gas", "Gratis e instantáneo.", "ETH de prueba de verdad, y una espera de segundos o minutos."],
      ["El resultado", "Se borra al apagar la red.", "Queda para siempre, y cualquiera lo puede leer."],
      ["La verificación", "No aplica: no hay explorador.", "--verify sube la fuente al explorador y publica el código."],
    ], { y: 1.9, h: 3.3, colW: [3.0, 4.4, 4.693], size: 11 });
    await D.ficha(s, {
      tipo: "seguridad", etiqueta: "Lo que NO cambia, y por eso el trabajo de hoy sirve",
      x: M, y: 5.4, w: CW, h: 1.3,
      texto: "El módulo es el mismo archivo. El contrato es el mismo. La suite es la misma. Lo único que se agrega son la red, la clave y la paciencia.",
      size: 12.5,
    });
    s.addNotes("4 minutos. Es la lámina que convierte la restricción de hoy en algo defendible: el 80 % del trabajo de desplegar se hizo, y se hizo gratis. Las dos filas que valen la pena discutir son la segunda y la cuarta. La segunda abre la lámina del keystore. La cuarta es la que les cuesta interiorizar: en la red local un error se borra reiniciando, y en Sepolia queda publicado con su dirección, su fecha y su autor, y no hay forma de retirarlo. Eso es exactamente el argumento de por qué la suite de pruebas importa tanto en este oficio.");
  }

  {
    const s = await D.lamina({ kicker: "D.6 · el keystore", titulo: "La clave privada nunca vive en un archivo", ic: "llave", tituloSize: 27 });
    D.codigo(s, `npx hardhat keystore set SEPOLIA_RPC_URL        # la primera vez pide crear una contraseña
npx hardhat keystore set SEPOLIA_PRIVATE_KEY    # la de la billetera DEL CURSO
npx hardhat keystore set ETHERSCAN_API_KEY
npx hardhat keystore list                       # muestra los NOMBRES, nunca los valores`,
      { x: M, y: 1.9, w: CW, h: 1.5, lang: "js", size: 11.5 });
    D.dosColumnas(s,
      { et: "Qué hace el almacén", items: ["Guarda los valores cifrados, con una contraseña que se pide al usarlos.", "Vive en un archivo de la carpeta de usuario, fuera del proyecto y fuera de Git.", "configVariable los busca solo cuando una tarea los necesita de verdad."] },
      { et: "Si una clave se sube a GitHub", linea: C.rojo, color: C.rojo, items: ["Hay programas que recorren los repositorios públicos buscando claves.", "ConsenSys documenta billeteras vaciadas «en segundos».", "Borrar el archivo no basta: la clave queda en el historial de Git para siempre."] },
      { y: 3.55, h: 2.45, size: 11.5 });
    D.parrafo(s, "Si ocurre, la clave se da por perdida: se mueven los fondos a una billetera nueva y esa no se vuelve a usar nunca. No se «arregla» con un commit.", { y: 6.15, h: 0.6, size: 13, color: C.rojo, bold: true });
    s.addNotes("4 minutos. Fuente de la cifra: ConsenSys, «How to Avoid Uploading Your Private Key to GitHub» (consensys.io/blog). Tres cosas que decir. UNA: el keystore no es un .env; está cifrado y fuera del proyecto, y el curso no usa .env con secretos en ningún caso. DOS: existe keystore set --dev para valores no sensibles, sin contraseña. TRES: la frase de recuperación no va en ningún lado, tampoco en el keystore, y no se comparte con nadie, ni con el docente. Esta lámina es trabajo autónomo de esta semana: quien no configure el keystore llega bloqueado a la S10.");
  }

  {
    const s = await D.lamina({ kicker: "D.7 · verificar el código fuente", titulo: "En la cadena solo hay bytecode", ic: "lupa", tituloSize: 29 });
    D.parrafo(s, "Lo que quedó desplegado son 2 014 bytes de números: ni un nombre de función, ni un comentario, ni el nombre del archivo. Verificar es darle al explorador lo necesario para que vuelva a compilar la fuente y compruebe que le sale exactamente ese bytecode.", { y: 1.85, h: 0.8, size: 13.5 });
    D.tabla(s, ["qué se le entrega al explorador", "de dónde sale en este proyecto"], [
      ["El código fuente completo", "contracts/s08/Recaudo.sol, y todo lo que importa, OpenZeppelin incluido."],
      ["La versión exacta del compilador", "hardhat.config.js: 0.8.34, que es 0.8.34+commit.80d5c536."],
      ["La configuración del optimizador", "hardhat.config.js: enabled true, runs 200."],
      ["Los argumentos del constructor", "Los del módulo de Ignition: 10 ETH de meta y 604 800 segundos."],
    ], { y: 2.8, h: 2.0, colW: [4.6, 7.493], size: 11 });
    await D.ficha(s, {
      tipo: "termino", etiqueta: "Qué se gana, y por qué el curso lo exige",
      x: M, y: 5.0, w: CW, h: 1.7,
      texto: "Si el bytecode recompilado coincide, el explorador publica la fuente con la marca de verificado y habilita las pestañas para leer y escribir el contrato. Si no coincide, no publica nada. Un contrato sin verificar pide confianza ciega: nadie puede saber qué hace sin descompilarlo. Es el «verificar en vez de creer» del curso aplicado al código propio.",
      size: 13,
    });
    s.addNotes("4 minutos. La forma de decirlo que funciona: el explorador no cree lo que uno le manda, lo comprueba recompilando. Por eso hacen falta las cuatro cosas de la tabla y no solo el archivo .sol. Recordar que esto ya lo hicieron a mano en la S6, en la pestaña Verify and Publish de Etherscan, con v0.8.34+commit.80d5c536 y optimización Yes con 200: con Ignition es la misma cosa, pero como una bandera del comando de despliegue, --verify. Y en la rúbrica del proyecto, sin contrato verificado el criterio de pruebas y despliegue cae a insuficiente.");
  }

  {
    const s = await D.lamina({ kicker: "D.8 · la trampa que ya vivieron", titulo: "Si el compilador no coincide, falla", ic: "alerta", tituloSize: 28 });
    D.enunciado(s, "Es el mismo error de hace dos clases, con otra cara.", { y: 1.85, h: 1.3, size: 20, line: C.naranja });
    D.dosColumnas(s,
      { et: "Hace dos clases, en Remix", texto: "«ParserError: Source file requires different compiler version». El archivo fijaba 0.8.34 y el desplegable del navegador tenía otra versión. Se arregló eligiendo la del curso, nunca bajándole el pragma al archivo." },
      { et: "Hoy, al verificar", linea: C.rojo, color: C.rojo, texto: "Si se declara una versión distinta a la que compiló el bytecode, el explorador recompila, le sale otro bytecode y rechaza la verificación. No dice «versión equivocada»: dice que no coincide, y hay que deducirlo." },
      { y: 3.3, h: 2.1, size: 12.5 });
    D.parrafo(s, "De ahí la regla del curso de tener la versión congelada en versiones.md y el pragma fijo en todos los contratos, andamiajes incluidos. Cambiar de compilador no es solo cambiar un número: cambia el objetivo de la EVM, cambia el bytecode y obliga a volver a medir todo.", { y: 5.55, h: 1.1, size: 13 });
    s.addNotes("3 minutos, y es la lámina que más les va a ahorrar tiempo el día que desplieguen. Contar el caso real del curso: estaba fijado en 0.8.28, Remix empezó a abrir con 0.8.34, cada archivo fallaba con ese ParserError, y al pasar el curso a 0.8.34 hubo que volver a medir el gas de 118 funciones para comprobar que nada se movía. Esa es la cara visible del mismo problema: el compilador queda grabado en los metadatos del bytecode desplegado, así que el explorador puede detectar la diferencia aunque el código fuente sea idéntico.");
  }

  {
    const s = await D.lamina({ kicker: "D.9 · gratis, y vale la pena", titulo: "Abrir un contrato ya verificado", ic: "pantalla", tituloSize: 29 });
    D.pasos(s, [
      ["ENTRAR", "sepolia.etherscan.io/contractsVerified: la lista de los últimos 500 contratos verificados. Abran el primero."],
      ["PESTAÑA CODE", "La fuente completa, la versión del compilador, el optimizador y los argumentos del constructor. Y el ABI, más abajo."],
      ["PESTAÑA READ CONTRACT", "Cada función de lectura, con su botón. Leer no cuesta gas y no pide conectar billetera."],
      ["PESTAÑA WRITE CONTRACT", "Cada función que escribe. Pide conectar billetera y pagar gas: hoy no se toca."],
    ], { y: 1.9, alto: 0.82, gap: 0.10, anchoEt: 2.9, size: 12.5 });
    await D.ficha(s, {
      tipo: "pregunta", etiqueta: "La pregunta que se hace mirando la pantalla",
      x: M, y: 5.6, w: CW, h: 1.1,
      texto: "¿Qué puede hacer cualquiera con este contrato sin pedirle permiso a nadie, y qué no? Esto es lo que su proyecto tiene que poder mostrar en el Avance 1.",
      size: 12,
    });
    s.addNotes("3 minutos, con el navegador en el proyector. No cuesta nada y vale mucho: ver un contrato verificado de otra persona es la mejor explicación de para qué sirve verificar. A propósito no hay ninguna dirección concreta en la lámina: la lista de contratos verificados rota todos los días, así que se abre la lista y se toma el primero que aparezca. Si la página de Etherscan no carga, el plan B es la misma lista de cualquier explorador de Sepolia. Al abrirlo, señalar las tres pestañas y preguntar qué parte de lo que está en pantalla salió del repositorio de quien lo desplegó: la respuesta es todo, y por eso se llama verificación.");
  }

  await verificacion({
    kicker: "Verificación · bloque D",
    titulo: "Lo que el bloque D debió dejar",
    preguntas: [
      "¿Qué parte del despliegue se hizo hoy completa y gratis, y qué parte exacta es la que quedó pendiente?",
      "Si corren dos veces el mismo comando de Ignition contra la misma red, ¿qué pasa la segunda vez, y por qué?",
      "¿Qué cuatro cosas hay que entregarle al explorador para verificar, y de qué archivo del proyecto sale cada una?",
      "Una verificación falla sin decir por qué. ¿Cuál es la primera sospecha, y qué error de la Sesión 6 se le parece?",
    ],
    notas: "3 minutos. Respuestas: (1) se hizo el módulo, los parámetros y el despliegue contra la red local, que es donde se descubren los errores del módulo; queda pendiente la red de prueba, la clave en el keystore, el gas real y la verificación. (2) No vuelve a desplegar: lee el diario de ignition/deployments y dice «Nothing new to deploy». (3) La fuente (contracts/), la versión exacta del compilador y la configuración del optimizador (hardhat.config.js), y los argumentos del constructor (el módulo de Ignition). (4) Que la versión del compilador declarada no es la que compiló el bytecode; es el mismo problema del ParserError de la S6, que allá se veía al compilar y aquí se ve al verificar.",
  });

  /* ================================================================
     CIERRE · 5 minutos
     ================================================================ */

  {
    const s = await D.lamina({ kicker: "Cierre · la evidencia", titulo: "Lo que sale de esta sesión", ic: "bandera", tituloSize: 29 });
    D.tabla(s, ["evidencia", "qué es exactamente", "dónde queda"], [
      ["Defensa", "La ficha de lectura llena y la prueba que falló en pantalla.", "Planilla del docente, hoy."],
      ["Suite", "test/s08/Recaudo.test.js con diez pruebas o más, en verde.", "Repositorio del equipo."],
      ["Mutantes", "Los tres muertos, y qué prueba mató a cada uno y por qué.", "Captura de cazar-mutantes.js."],
      ["Despliegue", "La salida de Ignition con la dirección desplegada en local.", "Captura de la terminal."],
    ], { y: 1.9, h: 2.6, colW: [2.6, 5.6, 3.893], size: 11 });
    await D.ficha(s, {
      tipo: "alerta", etiqueta: "La captura del mutante muerto no basta sola",
      x: M, y: 4.7, w: CW, h: 1.2,
      texto: "El 35 % del laboratorio está en la explicación, no en la captura: qué prueba mató a cada mutante, y por qué la cobertura no lo veía.",
      size: 12.5,
    });
    D.parrafo(s, "Todo se sube al repositorio del equipo esta semana. Y antes de cada git push: git status y git diff --staged, leyendo cada archivo que va a subir.", { y: 6.0, h: 0.7, size: 13 });
    s.addNotes("2 minutos. Repasar la tabla señalando, no leyendo. La fila de la defensa se califica hoy mismo y ya está hecha. Las otras tres se suben esta semana. Insistir en la ficha: la parte que más pesa del laboratorio es la explicación escrita, y es la que más se omite porque la captura se siente como el final del trabajo. Y cerrar con la rutina del push, que es la misma de siempre: nada de claves, nada de .env, nada de URLs con clave de API.");
  }

  {
    const s = await D.lamina({ kicker: "Cierre · la deuda", titulo: "El despliegue en Sepolia queda pendiente", ic: "alerta", tituloSize: 26 });
    D.enunciado(s, "Hoy no se hizo. Y sin eso, tres cosas del curso no arrancan.", { y: 1.85, h: 1.4, size: 21, line: C.rojo });
    D.pasos(s, [
      ["SESIÓN 10", "El token ERC-20 se despliega y se verifica en Sepolia. Sin ETH de prueba y sin keystore, ese laboratorio no arranca."],
      ["SESIÓN 11", "El diploma NFT se emite en Sepolia y su tokenURI tiene que resolver desde el explorador."],
      ["AVANCE 1 · SESIÓN 13", "Exige contratos desplegados y verificados. Es nota, y no hay forma de hacerlo la semana anterior."],
    ], { y: 3.45, alto: 0.80, gap: 0.10, anchoEt: 2.6, size: 12.5 });
    D.parrafo(s, "Esta semana, cada equipo: billetera del curso con ETH de prueba, y el keystore configurado con las tres variables de D.6.", { y: 6.15, h: 0.6, size: 13, color: C.rojo, bold: true });
    s.addNotes("2 minutos, y se dice sin adornos: la deuda es del curso, no de ellos, y se paga esta semana. ⚠ VERIFICAR ANTES DE DICTAR: comprobar qué grifo de Sepolia está funcionando el día de la clase y decir el nombre en voz alta; los grifos cambian de condiciones seguido y no conviene proyectar una dirección que puede estar caída. Decir también cuánto ETH de prueba hace falta de verdad —con 0,05 alcanza de sobra para los laboratorios de la S10 y la S11— para que nadie pierda la tarde pidiendo fondos. Quien llegue a la S10 sin keystore y sin fondos se queda mirando el laboratorio de los demás, y eso ya pasó en otras cohortes.");
  }

  await D.preguntaSemana({
    pregunta: "Si una suite con 88 % de cobertura dejó pasar tres errores, ¿qué número o qué evidencia le pedirían a un proveedor para creerle que su contrato está bien probado?",
    trabajo: [
      "Terminar el laboratorio 08: suite de diez pruebas o más, cobertura medida, los tres mutantes muertos con su explicación escrita, y la captura del despliegue local con Ignition.",
      "Configurar el keystore con las tres variables de D.6, y conseguir ETH de prueba en la billetera del curso. Sin esto, la Sesión 10 no se puede hacer.",
      "Los equipos que defendieron sin la prueba que falla: entregarla con la regla que dijeron en voz alta, antes de la próxima sesión.",
      "Crear cuenta en ethernaut.openzeppelin.com y resolver el nivel 0: la Sesión 9 empieza en el nivel 1.",
    ],
    notas: "1 minuto. La pregunta prepara la conversación de la S9: cobertura, mutación, fuzzing, análisis estático, verificación formal y auditoría externa son evidencias distintas y complementarias, y ninguna sola alcanza. La respuesta que se busca no es un número: es «muéstreme qué pruebas fallan si le rompo el contrato». El segundo punto del trabajo autónomo es el que hay que repetir dos veces, porque es el que bloquea las dos sesiones siguientes.",
  });

  {
    const s = await D.cierre({
      frase: "Una prueba verde no demuestra nada si también estaría verde con el error.",
      sub: "Hoy defendieron su contrato, escribieron pruebas y después pusieron esas pruebas a prueba. La próxima sesión cambian de lado: van a atacar contratos ajenos para aprender a defender el propio.",
      proxima: "Sesión 9 · Seguridad de contratos · Ethernaut · parcial práctico",
    });
    s.addNotes("Cierre (1 minuto). Leer la frase y no explicarla: ya está demostrada con las cifras de C.5. Recordar el parcial práctico de la S9: en máquina, libro abierto, con este mismo entorno, así que quien no tenga Hardhat funcionando lo resuelve esta semana y no el día del parcial. Y la última frase del día, dicha en voz alta: el contrato que defendieron hoy es el que otro equipo va a auditar en la S9.");
  }

  return D.guardar(path.join(__dirname, "Sesion-08-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
