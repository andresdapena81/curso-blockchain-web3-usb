/* =====================================================================
   Sesión 08 · Entorno profesional: Hardhat, pruebas y despliegue
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 08 · HARDHAT, PRUEBAS Y DESPLIEGUE", titulo: "Sesión 08 · Hardhat, pruebas y despliegue" });
  const { C, F, M, CW } = D;

  await D.portada({
    kicker: "SESIÓN 08 · UNIDAD II · ETHEREUM Y CONTRATOS",
    titulo: "PROBAR ANTES\nDE QUE SEA\nPARA SIEMPRE",
    sub: "Hardhat, pruebas automatizadas y despliegue reproducible: el flujo real de un equipo que no puede publicar parches.",
    palabra: "PROBAR",
    ic: "terminal",
    notas: "Sesión bisagra: desde hoy todo el trabajo del curso, incluido el proyecto, se hace con este flujo.",
  });

  await D.agenda({
    intro: "Hoy se sale del navegador. Y se aprende la diferencia entre tener pruebas y tener pruebas que atrapan errores.",
    bloques: [
      ["A", "EL FLUJO PROFESIONAL", "Proyecto, red local, pruebas, cobertura, mutantes, despliegue y secretos.", "~60 min"],
      ["B", "LABORATORIO 08", "Escribir la suite de un contrato, cazar tres mutantes y desplegar con Ignition.", "~90 min"],
      ["C", "EL PROYECTO EN HARDHAT", "Estructura del repositorio del equipo desde hoy.", "~30 min"],
    ],
  });

  await D.objetivo({
    objetivo: "Trabajar con el flujo real de un equipo: pruebas automáticas, cobertura, despliegue reproducible y código verificado.",
    preguntas: [
      "¿Qué no se puede hacer bien desde Remix?",
      "¿Qué hace que una prueba sea buena, y no solo verde?",
      "¿Por qué el 80 % de cobertura puede dejar pasar un error grave?",
      "¿Cómo se despliega sin que la clave privada toque el repositorio?",
    ],
    ra: "RA4 · Construir una suite de pruebas automatizadas y desplegar contratos verificados con un entorno profesional.",
  });

  await D.glosario({
    items: [
      ["Hardhat", "entorno de desarrollo", "Compila, prueba, despliega y verifica desde la terminal. Trae su propia red local."],
      ["Mocha · Chai", "bibliotecas de pruebas", "Mocha organiza (describe, it); Chai comprueba (expect). Estándar en JavaScript."],
      ["Fixture", "estado de partida", "Despliegue que se ejecuta una vez y se restaura como instantánea antes de cada prueba."],
      ["Cobertura", "code coverage", "Porcentaje de líneas del contrato que alguna prueba ejecutó. No dice si se comprobaron."],
      ["Mutante", "mutation testing", "Copia del contrato con un error introducido a propósito. Una buena suite debe fallar contra él."],
      ["Ignition", "Hardhat Ignition", "Sistema de despliegue declarativo: registra lo hecho y retoma si se interrumpe."],
      ["RPC", "Remote Procedure Call", "La URL del nodo con el que se habla. Suele llevar una clave de API: es un secreto."],
      ["Keystore", "almacén cifrado", "Donde Hardhat 3 guarda claves y URLs, protegido con contraseña, fuera del repositorio."],
    ],
  });

  /* =============================================================== A */
  await D.divisor({ letra: "A", titulo: "El flujo profesional", sub: "En software tradicional una prueba ahorra tiempo. Aquí es la última oportunidad de encontrar un error antes de que custodie dinero para siempre.", minutos: "APROXIMADAMENTE 60 MINUTOS", ic: "terminal" });

  {
    const s = await D.lamina({ kicker: "A.1 · por qué salir del navegador", titulo: "Lo que Remix no puede hacer bien", ic: "pantalla", tituloSize: 29 });
    D.tabla(s, ["necesidad", "en Remix", "en Hardhat"], [
      ["Repetir 50 pruebas tras cada cambio", "A mano, clic por clic.", "Un comando, en segundos."],
      ["Probar qué pasa dentro de una semana", "Imposible: el tiempo es real.", "Se adelanta el reloj de la red local."],
      ["Saber qué líneas nunca se ejecutaron", "No existe.", "Informe de cobertura."],
      ["Trabajar en equipo con Git", "Archivos en el navegador.", "Repositorio normal, revisión de código."],
      ["Desplegar igual en local, prueba y producción", "Cada vez a mano.", "Módulo de despliegue con parámetros."],
      ["Guardar claves con seguridad", "Depende de la billetera del navegador.", "Almacén cifrado fuera del proyecto."],
    ], { y: 1.9, h: 4.35, colW: [4.3, 3.8, 3.993], size: 12 });
    D.parrafo(s, "Remix sigue siendo excelente para explorar y enseñar. Pero ningún equipo serio despliega desde ahí.", { y: 6.38, h: 0.42, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.2 · el ciclo", titulo: "Del código al contrato verificado", ic: "flecha", tituloSize: 29 });
    const etapas = [["ESCRIBIR", "contracts/"], ["COMPILAR", "hardhat compile"], ["PROBAR", "hardhat test"], ["COBERTURA", "--coverage"], ["DESPLEGAR", "ignition deploy"], ["VERIFICAR", "--verify"]];
    etapas.forEach((e, i) => {
      const x = M + i * 2.02;
      D.nodo(s, { x, y: 2.1, w: 1.8, h: 1.05, titulo: e[0], sub: e[1], fill: i === 2 ? C.blanco : C.superf, line: i === 2 ? C.naranja : C.tinta, size: 10.5, subSize: 10 });
      if (i < 5) D.flecha(s, x + 1.8, 2.62, x + 2.02, 2.62, C.tinta, 1.5);
    });
    D.flecha(s, M + 2 * 2.02 + 0.9, 3.25, M + 2 * 2.02 + 0.9, 3.75, C.naranja, 2);
    D.nodo(s, { x: M + 2 * 2.02 - 0.6, y: 3.75, w: 3.0, h: 0.62, titulo: "¿FALLA? VOLVER A ESCRIBIR", fill: C.blanco, line: C.naranja, size: 10 });
    D.dosColumnas(s,
      { et: "Todo en la red local", texto: "Escribir, compilar, probar y medir cobertura no gasta ETH ni necesita internet. Se repite cien veces al día." },
      { et: "Solo al final, la red pública", texto: "Desplegar y verificar se hace una vez, cuando la suite está verde y la cobertura es suficiente." },
      { y: 4.65, h: 2.05, size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.3 · la forma de un proyecto", titulo: "Estructura y configuración", ic: "rejilla", tituloSize: 30 });
    D.codigo(s, `laboratorios-evm/
├── contracts/          contratos .sol
├── test/               pruebas .test.js
├── ignition/
│   ├── modules/        cómo se despliega
│   └── parametros/     con qué valores, por red
├── scripts/            utilidades
├── hardhat.config.js
├── package.json        versiones EXACTAS
└── .gitignore          lo que NUNCA se sube`, { x: M, y: 1.9, w: 5.7, h: 4.0, lang: "js", size: 12 });
    D.codigo(s, `export default {
  plugins: [toolbox],
  solidity: {
    version: "0.8.28",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    sepolia: {
      type: "http",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
};`, { x: M + 6.0, y: 1.9, w: CW - 6.0, h: 4.0, lang: "js", size: 11, titulo: "hardhat.config.js" });
    D.parrafo(s, "configVariable no contiene el secreto: le dice a Hardhat que lo busque en el almacén cifrado solo cuando se use esa red. Las pruebas locales nunca lo piden.", { y: 6.1, h: 0.65, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.4 · la red local", titulo: "Una cadena completa en su computador", ic: "red", tituloSize: 29 });
    D.tabla(s, ["característica", "qué permite"], [
      ["20 cuentas con 10 000 ETH de prueba", "Simular a Ana, Beto, el dueño y un atacante sin pedir fondos a nadie."],
      ["Minado instantáneo", "Cada transacción queda en un bloque al momento: las pruebas corren en milisegundos."],
      ["Control del reloj", "time.increase(7 días) prueba plazos sin esperar una semana."],
      ["Instantáneas", "Guardar el estado y volver a él: la base de los fixtures."],
      ["Mensajes de error completos", "Muestra qué error personalizado revirtió y con qué argumentos."],
      ["Se reinicia sola", "Cada ejecución de pruebas arranca de una cadena limpia."],
    ], { y: 1.9, h: 3.95, colW: [4.0, 8.093], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Las cuentas de la red local son públicas", x: M, y: 5.93, w: CW, h: 0.92, texto: "Sus claves privadas están impresas en la documentación. Nunca se usan en una red real.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.5 · dependencias", titulo: "Versiones exactas, o sorpresas a mitad de semestre", ic: "candado", tituloSize: 25 });
    D.codigo(s, `"devDependencies": {
  "hardhat": "3.16.0",
  "@nomicfoundation/hardhat-toolbox-mocha-ethers": "3.0.7"
},
"dependencies": {
  "@openzeppelin/contracts": "5.6.1"
}`, { x: M, y: 1.9, w: 6.2, h: 2.75, lang: "js", titulo: "package.json", size: 11.5 });
    D.tabla(s, ["escritura", "instala"], [
      ["\"5.6.1\"", "Exactamente esa."],
      ["\"^5.6.1\"", "Cualquier 5.x posterior."],
      ["\"~5.6.1\"", "Cualquier 5.6.x posterior."],
    ], { x: M + 6.5, y: 1.9, w: CW - 6.5, h: 1.75, colW: [2.0, CW - 6.5 - 2.0], size: 12 });
    D.parrafo(s, "npm install escribe por defecto con ^. Para un contrato, eso significa que dos personas del mismo equipo pueden compilar con bibliotecas distintas.", { x: M + 6.5, y: 3.8, w: CW - 6.5, h: 0.95, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Por qué importa más aquí que en una aplicación web", x: M, y: 4.95, w: CW, h: 1.75, texto: "El código de OpenZeppelin que se compila queda dentro del contrato desplegado, para siempre. Si una versión nueva cambia un comportamiento, no hay actualización posible. Además, el paquete package-lock.json se sube al repositorio: fija incluso las dependencias de las dependencias.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.6 · anatomía de una prueba", titulo: "describe, it, expect", ic: "codigo", tituloSize: 30 });
    D.codigo(s, `import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

async function desplegar() {                               // fixture
  const [dueno, ana] = await ethers.getSigners();
  const r = await ethers.deployContract("Recaudo", [META, PLAZO]);
  return { r, dueno, ana };
}

describe("Recaudo · aportar", () => {                     // grupo
  it("rechaza un aporte de cero", async () => {           // caso
    const { r, ana } = await networkHelpers.loadFixture(desplegar);
    await expect(r.connect(ana).aportar({ value: 0 }))
      .to.be.revertedWithCustomError(r, "AporteCero");     // comprobación
  });
});`, { x: M, y: 1.9, w: CW, h: 4.85, lang: "js", size: 11.5 });
    s.addNotes("Leer la prueba en voz alta como una frase: 'Recaudo, al aportar, rechaza un aporte de cero'. Si el nombre no se lee como una especificación, está mal nombrada.");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · fixtures", titulo: "Cada prueba empieza de cero, sin pagarlo", ic: "reloj", tituloSize: 28 });
    D.pasos(s, [
      ["PRIMERA LLAMADA", "loadFixture ejecuta desplegar(): despliega el contrato y guarda una instantánea de toda la cadena."],
      ["LLAMADAS SIGUIENTES", "No vuelve a desplegar: restaura la instantánea. Milisegundos en lugar de segundos."],
      ["AISLAMIENTO", "Lo que una prueba cambió —aportes, tiempo adelantado— no existe para la siguiente."],
    ], { y: 1.9, alto: 0.92, gap: 0.14, anchoEt: 3.2, size: 13 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error clásico", x: M, y: 5.2, w: CW, h: 1.5, texto: "Desplegar en un beforeAll compartido y dejar que las pruebas se afecten entre sí. La suite pasa en un orden y falla en otro, y nadie entiende por qué. Con fixtures ese problema no puede ocurrir.", size: 13.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.8 · qué probar", titulo: "Las cinco familias de pruebas", ic: "lista", tituloSize: 30 });
    D.tabla(s, ["familia", "pregunta que responde", "ejemplo en Recaudo"], [
      ["Caso feliz", "¿Hace lo que promete cuando todo va bien?", "Un aporte suma al aportante y al total."],
      ["Reversión", "¿Se niega a lo que no debe hacer?", "Aportar después del plazo revierte con PlazoVencido."],
      ["Permisos", "¿Solo quien debe puede hacerlo?", "Solo el dueño reclama los fondos."],
      ["Eventos", "¿Le cuenta al mundo lo que pasó, con los datos correctos?", "Aporte con aportante, monto y total."],
      ["Bordes", "¿Qué pasa exactamente en el límite?", "Aportar en el segundo exacto del cierre. Meta exacta."],
    ], { y: 1.9, h: 3.7, colW: [2.2, 4.8, 5.093], size: 12 });
    D.enunciado(s, "Las cuatro primeras dan cobertura. La quinta es la que atrapa los errores.", { y: 5.75, h: 1.0, size: 17, line: C.naranja });
  }

  {
    const s = await D.lamina({ kicker: "A.9 · las comprobaciones que más se usan", titulo: "Matchers de Hardhat para Chai", ic: "voto", tituloSize: 28 });
    D.codigo(s, `// revierte con un error personalizado, y con qué argumentos
await expect(tx).to.be.revertedWithCustomError(r, "PujaInsuficiente").withArgs(minimo, enviado);

// emite un evento con argumentos exactos
await expect(tx).to.emit(r, "Aporte").withArgs(ana.address, monto, total);

// cambia el saldo de ETH de una o varias cuentas
await expect(tx).to.changeEtherBalance(ethers, ana, monto);
await expect(tx).to.changeEtherBalances(ethers, [ana, r], [monto, -monto]);

// sin permiso, con el error de OpenZeppelin
await expect(tx).to.be.revertedWithCustomError(r, "OwnableUnauthorizedAccount");`, { x: M, y: 1.9, w: CW, h: 3.75, lang: "js", size: 11 });
    await D.ficha(s, { tipo: "termino", etiqueta: "changeEtherBalance ya descuenta el gas", x: M, y: 5.85, w: CW, h: 0.92, texto: "Por eso compara el monto exacto, sin tener que restar lo que costó la transacción.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.10 · simular el mundo", titulo: "Otras cuentas y otro momento", ic: "persona", tituloSize: 30 });
    D.codigo(s, `const [dueno, ana, atacante] = await ethers.getSigners();

await r.connect(ana).aportar({ value: eth(3) });          // Ana firma

await time.increase(7 * 24 * 60 * 60);                     // pasa una semana
await time.increaseTo(fin);                                // exactamente al cierre
await time.setNextBlockTimestamp(fin);                     // el PRÓXIMO bloque cae en fin

await expect(r.connect(atacante).reclamarFondos())         // alguien sin permiso
  .to.be.revertedWithCustomError(r, "OwnableUnauthorizedAccount");`, { x: M, y: 1.9, w: CW, h: 3.3, lang: "js", size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "La diferencia sutil que atrapa un mutante", x: M, y: 5.4, w: CW, h: 1.3, texto: "increaseTo(fin) mina un bloque en fin y la SIGUIENTE transacción ya cae en fin + 1. Para probar qué pasa exactamente en fin se usa setNextBlockTimestamp(fin).", size: 13 });
  }

  {
    const s = await D.lamina({ kicker: "A.11 · cobertura", titulo: "Qué mide, y qué no mide", ic: "grafico", tituloSize: 30 });
    D.codigo(s, `npx hardhat test --coverage`, { x: M, y: 1.9, w: 5.0, h: 0.62, lang: "js", size: 13 });
    D.dosColumnas(s,
      { et: "Qué mide", items: ["Qué líneas del contrato ejecutó alguna prueba.", "Qué ramas quedaron sin recorrer: el informe marca las líneas.", "Útil para encontrar funciones o reversiones que nadie probó."] },
      { et: "Qué NO mide", linea: C.rojo, color: C.rojo, items: ["Si la prueba comprobó el resultado. Una prueba sin expect da cobertura.", "Si se probó el valor exacto del borde.", "Si el contrato hace lo que el negocio necesita."] },
      { y: 2.75, h: 2.65, size: 13 });
    D.enunciado(s, "La cobertura dice dónde NO hay pruebas. No dice que las que hay sirvan.", { y: 5.65, h: 1.05, size: 18, line: C.naranja });
  }

  {
    const s = await D.lamina({ kicker: "A.12 · el experimento de hoy", titulo: "88 % de cobertura y tres errores vivos", ic: "bicho", tituloSize: 28 });
    D.parrafo(s, "Preparando este laboratorio escribimos una suite de referencia para el contrato Recaudo, y tres copias del contrato con un error cada una. Después quitamos solo las pruebas de borde.", { y: 1.9, h: 0.95, size: 14 });
    D.cifra(s, "13", "pruebas en verde contra el contrato correcto", { x: M, y: 3.0, w: 2.8, h: 1.65, size: 34 });
    D.cifra(s, "88 %", "de cobertura de líneas: cumple el requisito del curso", { x: M + 3.0, y: 3.0, w: 3.0, h: 1.65, color: C.violeta, size: 34 });
    D.cifra(s, "13 / 13", "siguen en verde contra CADA mutante", { x: M + 6.2, y: 3.0, w: 2.9, h: 1.65, color: C.rojo, size: 30 });
    D.cifra(s, "3", "errores reales que la suite no ve", { x: M + 9.3, y: 3.0, w: CW - 9.3, h: 1.65, color: C.rojo, size: 34 });
    D.tabla(s, ["", "suite sin bordes", "suite con 3 pruebas de borde"], [
      ["Contra el contrato correcto", "13 pasan", "16 pasan"],
      ["Contra cada mutante", "13 pasan · VIVO", "15 pasan, 1 falla · MUERTO"],
    ], { y: 4.95, h: 1.3, colW: [3.8, 3.9, 4.393], size: 12.5 });
    D.parrafo(s, "Cifras medidas con npx hardhat test --coverage y el script scripts/s08/cazar-mutantes.js.", { y: 6.38, h: 0.4, size: 11.5, color: C.gris });
  }

  {
    const s = await D.lamina({ kicker: "A.13 · pruebas de borde", titulo: "Dónde viven los errores", ic: "diana", tituloSize: 31 });
    D.tabla(s, ["borde", "la pregunta que hay que hacerle al contrato", "por qué ahí"], [
      ["Tiempo", "¿Qué pasa un segundo antes, en el segundo exacto y un segundo después de cada plazo?", "Una comparación mal escrita deja entrar o salir justo en el límite, y ninguna prueba «normal» llega a ese instante."],
      ["Umbral", "¿Qué pasa con el valor exacto de cada límite: ni un wei más, ni uno menos?", "Los casos cómodos siempre quedan lejos del límite: por eso nadie los prueba."],
      ["Repetición", "¿Qué pasa si la misma cuenta llama dos veces seguidas?", "Un efecto que debería ocurrir una vez puede repetirse si el estado no cambió."],
      ["Cero y vacío", "¿Qué pasa con 0, con la dirección cero, con un texto vacío?", "Son valores válidos para la EVM y absurdos para el negocio."],
      ["Quién llama", "¿Qué pasa si llama otra cuenta, o un contrato?", "Basta una función sin su modificador."],
    ], { y: 1.9, h: 4.3, colW: [2.0, 4.9, 5.193], size: 11.5 });
    D.parrafo(s, "Para cada función del contrato, recorrer las cinco filas. Así se encuentran los errores que la cobertura no ve.", { y: 6.35, h: 0.42, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.14 · gas en las pruebas", titulo: "Cuánto cuesta cada función, de un vistazo", ic: "gas", tituloSize: 26 });
    D.codigo(s, `npx hardhat test test/s06/CertificadosUSB.test.js --gas-stats

  contracts/s06/CertificadosUSB.sol:CertificadosUSB
  Function name   Min      Average   Max      #calls
  emitir          94 795   94 795    94 795   9
  revocar         32 208   32 288    32 448   3
  verificar       27 075   27 227    27 379   4
  cambiarEmisor   28 636   28 636    28 636   1
  Deployment     554 715                      1
  Bytecode size    2 206`, { x: M, y: 1.9, w: CW, h: 3.3, lang: "js", size: 12 });
    D.lista(s, [
      "emitir es la más cara: estrena varias ranuras de storage (Sesión 5).",
      "verificar aparece con gas porque las pruebas la llaman en transacción; desde una aplicación es gratis.",
      "Si un cambio de código hace subir mucho una cifra, es una señal para revisar antes de desplegar.",
    ], { y: 5.4, h: 1.35, size: 13, gap: 5 });
  }

  {
    const s = await D.lamina({ kicker: "A.15 · desplegar", titulo: "Ignition: despliegues que se pueden repetir", ic: "cohete", tituloSize: 28 });
    D.codigo(s, `import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("RecaudoModulo", (m) => {
  const meta = m.getParameter("meta", 10n * 10n ** 18n);
  const duracion = m.getParameter("duracionSegundos", 604800);
  const recaudo = m.contract("Recaudo", [meta, duracion]);
  return { recaudo };
});`, { x: M, y: 1.9, w: 7.3, h: 3.0, lang: "js", titulo: "ignition/modules/Recaudo.js", size: 11 });
    D.codigo(s, `{
  "RecaudoModulo": {
    "meta": "5000000000000000",
    "duracionSegundos": 1800
  }
}`, { x: M + 7.6, y: 1.9, w: CW - 7.6, h: 3.0, lang: "js", titulo: "parametros/recaudo-sepolia.json", size: 11.5 });
    D.lista(s, [
      "Describe QUÉ se despliega, no los pasos: Ignition decide el orden.",
      "Anota cada despliegue en ignition/deployments/: si se cae la red a mitad, retoma sin desplegar dos veces.",
      "El mismo módulo sirve para la red local y para Sepolia; cambian solo los parámetros.",
    ], { y: 5.1, h: 1.65, size: 13, gap: 6 });
  }

  {
    const s = await D.lamina({ kicker: "A.16 · secretos", titulo: "La clave privada nunca toca el repositorio", ic: "llave", tituloSize: 27 });
    D.codigo(s, `npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
npx hardhat keystore set ETHERSCAN_API_KEY`, { x: M, y: 1.9, w: CW, h: 1.2, lang: "js", size: 12.5 });
    D.dosColumnas(s,
      { et: "Qué hace el almacén", items: ["Guarda los valores cifrados, con una contraseña que se pide al usarlos.", "Vive fuera de la carpeta del proyecto.", "configVariable los busca solo cuando una tarea los necesita."] },
      { et: "Qué pasa si una clave se sube a GitHub", linea: C.rojo, color: C.rojo, items: ["Hay programas que recorren los repositorios públicos buscando claves.", "Una clave con fondos se vacía en minutos, según múltiples reportes.", "Borrar el archivo no basta: queda en el historial de Git."] },
      { y: 3.3, h: 2.47, size: 12 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Si ocurre", x: M, y: 5.86, w: CW, h: 0.92, texto: "La clave se da por perdida: se mueven los fondos a una billetera nueva y no se vuelve a usar.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "A.17 · verificar", titulo: "Publicar el código fuente del contrato", ic: "lupa", tituloSize: 28 });
    D.codigo(s, `npx hardhat ignition deploy ignition/modules/Recaudo.js \\
  --network sepolia \\
  --parameters ignition/parametros/recaudo-sepolia.json \\
  --verify`, { x: M, y: 1.9, w: CW, h: 1.5, lang: "js", size: 12.5 });
    D.pasos(s, [
      ["QUÉ HACE", "Envía al explorador el código, la versión del compilador y la configuración. El explorador recompila y compara con el bytecode desplegado."],
      ["SI COINCIDE", "Aparece la marca de verificación, el código legible y las pestañas para leer y escribir el contrato."],
      ["POR QUÉ IMPORTA", "Un contrato sin verificar pide confianza ciega: nadie puede saber qué hace sin descompilarlo."],
    ], { y: 3.6, alto: 0.9, gap: 0.12, anchoEt: 2.5, size: 12.5 });
    D.parrafo(s, "En la rúbrica del proyecto: un contrato no verificado cae a «insuficiente» en pruebas y despliegue.", { y: 6.38, h: 0.42, size: 13, color: C.ocre });
  }

  {
    const s = await D.lamina({ kicker: "A.18 · lo que hay que llevarse del bloque A", titulo: "Seis reglas del flujo profesional", ic: "lista", tituloSize: 29 });
    const ideas = [
      "Todo se prueba en local, cien veces. A la red pública se va una vez.",
      "Cada prueba empieza de un estado limpio: fixtures, nunca estado compartido.",
      "Una prueba sin expect da cobertura y no prueba nada.",
      "Los errores viven en los bordes: segundo exacto, monto exacto, segunda llamada.",
      "Versiones exactas y package-lock.json en el repositorio.",
      "Ningún secreto en el código. Ningún contrato sin verificar.",
    ];
    ideas.forEach((t, i) => {
      const y = 1.9 + i * 0.8;
      s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.65, fontFace: F.display, fontSize: 20, color: C.naranja, margin: 0, valign: "middle" });
      D.parrafo(s, t, { x: M + 0.85, y: y + 0.08, w: CW - 0.85, h: 0.6, size: 14.5, valign: "middle" });
      D.linea(s, M, y + 0.74, M + CW, y + 0.74, C.grisClaro, 1);
    });
  }

  /* =============================================================== B */
  await D.divisor({ letra: "B", titulo: "Laboratorio 08 · cazar mutantes", sub: "Escribir la suite de un contrato que no trae pruebas, alcanzar la cobertura, matar tres mutantes y desplegar con Ignition.", minutos: "APROXIMADAMENTE 90 MINUTOS · EN PAREJAS", ic: "bicho" });

  {
    const s = await D.lamina({ kicker: "B.1 · 10 minutos", titulo: "Preparar el entorno", ic: "terminal", tituloSize: 31 });
    D.codigo(s, `npm install                                              # si no se hizo en la S5
npx hardhat test test/s06/CertificadosUSB.test.js       # debe dar 18 en verde
cp andamiaje/s08/Recaudo.test.js test/s08/Recaudo.test.js
npx hardhat test test/s08/Recaudo.test.js                # 2 en verde: los ejemplos`, { x: M, y: 1.9, w: CW, h: 1.75, lang: "js", size: 12 });
    D.pasos(s, [
      ["LEER EL CONTRATO", "contracts/s08/Recaudo.sol. Entender las tres funciones y los dos finales posibles: exitoso o fallido."],
      ["NO LEER LOS MUTANTES", "El ejercicio es pensar en los bordes. Leer la diferencia antes lo convierte en copiar."],
      ["LEER LA PLANTILLA", "Tiene los grupos armados y un TODO por cada caso que falta."],
    ], { y: 3.85, alto: 0.84, gap: 0.12, anchoEt: 3.0, size: 12.5 });
    D.parrafo(s, "En PowerShell, cp funciona igual. En cmd: copy andamiaje\\s08\\Recaudo.test.js test\\s08\\", { y: 6.42, h: 0.38, size: 11.5, color: C.gris });
  }

  {
    const s = await D.lamina({ kicker: "B.2 · 40 minutos", titulo: "Escribir la suite y medir cobertura", ic: "codigo", tituloSize: 29 });
    D.tabla(s, ["grupo", "mínimo de pruebas", "no olvidar"], [
      ["despliegue", "2", "Parámetros inválidos en el constructor."],
      ["aportar", "3", "Evento con argumentos. Después del plazo."],
      ["recaudo exitoso", "3", "Permisos. Doble reclamo. Saldo que recibe el dueño."],
      ["recaudo fallido", "3", "Cada quien lo suyo. Quien no aportó. El dueño no se lleva nada."],
    ], { y: 1.9, h: 2.4, colW: [2.8, 2.4, 6.893], size: 12 });
    D.codigo(s, `npx hardhat test test/s08/Recaudo.test.js --coverage`, { x: M, y: 4.5, w: CW, h: 0.62, lang: "js", size: 13 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Meta de esta parte", x: M, y: 5.35, w: CW, h: 1.35, texto: "Al menos 10 pruebas en verde y 80 % o más de cobertura de líneas en Recaudo.sol. Leer las líneas no cubiertas del informe: cada una es una prueba que falta.", size: 13.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.3 · 25 minutos", titulo: "Cazar los tres mutantes", ic: "diana", tituloSize: 30 });
    D.codigo(s, `node scripts/s08/cazar-mutantes.js

  ✔ Recaudo (correcto)      11 pruebas en verde

  ✔ MUERTO  RecaudoMutante1   10 pasan · 1 fallan
  ✗ VIVO    RecaudoMutante2   11 pasan · 0 fallan
  ✗ VIVO    RecaudoMutante3   11 pasan · 0 fallan

  2 mutante(s) sobrevive(n). Hay un error que su suite no ve: piensen en los bordes.`, { x: M, y: 1.9, w: CW, h: 2.9, lang: "js", size: 12 });
    D.pasos(s, [
      ["MIENTRAS HAYA VIVOS", "Volver a la tabla de bordes de A.13 y escribir la prueba que falta. No abrir el mutante."],
      ["CUANDO MUERAN LOS TRES", "Ahora sí: abrir cada mutante, encontrar el error y anotar en el informe qué prueba lo mató y por qué."],
    ], { y: 5.0, alto: 0.8, gap: 0.12, anchoEt: 3.3, size: 12.5 });
    s.addNotes("La salida de la lámina es ilustrativa. Con el solucionario del docente, los tres mueren con exactamente una prueba cada uno.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · 15 minutos", titulo: "Desplegar y verificar con Ignition", ic: "cohete", tituloSize: 29 });
    D.pasos(s, [
      ["PROBAR EN LOCAL", "npx hardhat ignition deploy ignition/modules/Recaudo.js — tiene que funcionar antes de ir a Sepolia."],
      ["GUARDAR SECRETOS", "keystore set de SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY (billetera del curso) y ETHERSCAN_API_KEY."],
      ["DESPLEGAR", "El mismo comando con --network sepolia, --parameters y --verify."],
      ["USAR", "Aportar desde la billetera en el explorador (Write Contract). Con meta de 0,005 ETH y 30 minutos, se puede completar en clase."],
    ], { y: 1.9, alto: 0.92, gap: 0.12, anchoEt: 2.6, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Antes del git push", x: M, y: 6.02 - 0.12, w: CW, h: 0.86, texto: "git status: ni claves, ni .env, ni URLs con API key. Solo la carpeta de despliegue de Sepolia.", size: 12.5 });
  }

  {
    const s = await D.lamina({ kicker: "B.5 · qué se entrega", titulo: "Evidencia del laboratorio 08", ic: "documento", tituloSize: 29 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["Suite", "test/s08/Recaudo.test.js con ≥ 10 pruebas en verde.", "25 %"],
      ["Cobertura", "Captura del informe con ≥ 80 % de líneas en Recaudo.sol.", "15 %"],
      ["Mutantes", "Salida de cazar-mutantes.js con los tres muertos, y para cada uno: qué prueba lo mató y cuál era el error.", "35 %"],
      ["Despliegue", "Dirección en Sepolia verificada, desplegada con Ignition.", "25 %"],
    ], { y: 1.9, h: 2.9, colW: [2.2, 8.293, 1.6], size: 12 });
    D.tabla(s, ["si pasa esto", "revisar"], [
      ["El script dice «No se encontraron pruebas»", "La suite no está en test/s08/Recaudo.test.js."],
      ["Contra el correcto falla una prueba de borde", "increaseTo en lugar de setNextBlockTimestamp (A.10)."],
      ["--verify falla", "ETHERSCAN_API_KEY sin guardar, o esperar un minuto y volver a correr: Ignition retoma."],
    ], { y: 5.0, h: 1.75, colW: [4.4, 7.693], size: 11 });
  }

  /* =============================================================== C */
  await D.divisor({ letra: "C", titulo: "El proyecto, en Hardhat", sub: "Desde hoy el repositorio del equipo tiene la misma forma que el del curso. El Avance 1 se entrega en la Sesión 13.", minutos: "APROXIMADAMENTE 30 MINUTOS", ic: "bandera" });

  {
    const s = await D.lamina({ kicker: "C.1 · el repositorio del equipo", titulo: "Lo que tiene que existir antes de la Sesión 9", ic: "rejilla", tituloSize: 26 });
    D.tabla(s, ["pieza", "estado mínimo esperado"], [
      ["Repositorio en GitHub", "Los tres integrantes con permisos. El docente como colaborador."],
      ["Estructura", "La de A.3. Versiones exactas. package-lock.json incluido."],
      ["Contrato principal", "Compila. Aplica al menos dos patrones de la Sesión 7."],
      ["Suite inicial", "Al menos 5 pruebas, con al menos una de cada familia de A.8."],
      [".gitignore", "node_modules, artifacts, cache, coverage y cualquier archivo con secretos."],
      ["README", "Qué hace el proyecto, cómo instalarlo y cómo correr las pruebas, en cinco líneas."],
    ], { y: 1.9, h: 4.1, colW: [3.2, 8.893], size: 12.5 });
    D.parrafo(s, "Avance 1 (Sesión 13): contratos desplegados y verificados, cobertura ≥ 80 %, repositorio documentado. Y desde hoy, se espera que maten a sus propios mutantes.", { y: 6.15, h: 0.62, size: 13, color: C.ocre });
  }

  await D.preguntaSemana({
    pregunta: "Si una suite con 88 % de cobertura dejó pasar tres errores, ¿qué número o qué evidencia le pedirían a un proveedor para creerle que su contrato está bien probado?",
    trabajo: [
      "Entregar la evidencia del laboratorio 08.",
      "Montar el repositorio del proyecto con la estructura de C.1.",
      "Crear cuenta en ethernaut.openzeppelin.com y resolver el nivel 0 (Hello Ethernaut): la Sesión 9 empieza desde el nivel 1.",
      "Quien no haya trabajado con React: el tutorial de nivelación se entrega la próxima sesión.",
    ],
    notas: "La pregunta prepara la conversación de auditorías de la Sesión 9: cobertura, mutantes, fuzzing, verificación formal y auditoría externa son evidencias distintas.",
  });

  await D.cierre({
    frase: "Una prueba verde no demuestra nada si también estaría verde con el error.",
    sub: "Hoy escribieron pruebas y las pusieron a prueba. La próxima sesión cambian de lado: van a atacar contratos ajenos para aprender a defender los propios.",
    proxima: "Sesión 9 · Seguridad de contratos · Ethernaut · parcial práctico",
  });

  return D.guardar(path.join(__dirname, "Sesion-08-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
