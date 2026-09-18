/* =====================================================================
   Sesión 08 · Entorno profesional: Hardhat, pruebas y despliegue
   Estándar de la Sesión 4. Todas las cifras (cobertura, pruebas, gas,
   salidas de consola) se midieron en una copia del repositorio con
   Hardhat 3.16.0 / solc 0.8.28.
   REGLA DE ESTE DECK: no revelar cuáles son los mutantes de Recaudo ni
   qué cambia cada uno. Se enseña a pensar en bordes; los ejemplos de
   mutación usan la Subasta de la S7, no Recaudo.
   ===================================================================== */

const path = require("path");
const { crearDeck } = require("./lib/sistema");

async function construir() {
  const D = crearDeck({ pie: "SESIÓN 08 · HARDHAT, PRUEBAS Y DESPLIEGUE", titulo: "Sesión 08 · Hardhat, pruebas y despliegue" });
  const { C, F, M, CW } = D;

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

  await D.portada({
    kicker: "SESIÓN 08 · UNIDAD II · ETHEREUM Y CONTRATOS",
    titulo: "PROBAR ANTES\nDE QUE SEA\nPARA SIEMPRE",
    sub: "Hardhat, pruebas automatizadas y despliegue reproducible: el flujo real de un equipo que no puede publicar parches.",
    palabra: "PROBAR",
    ic: "terminal",
    notas: "Apertura (3 min). Retomar la pregunta de la semana de la S7 (el postor hostil que bloquea sin robar). Sesión bisagra: desde hoy todo el trabajo del curso, incluido el proyecto, se hace con este flujo. La pregunta que guía el día: ¿cómo sé que mis pruebas sirven, y no solo que están en verde?",
  });

  await D.agenda({
    intro: "Hoy se sale del navegador. Y se aprende la diferencia entre tener pruebas y tener pruebas que atrapan errores. Pausa de 10 minutos entre A y B.",
    bloques: [
      ["A", "EL FLUJO PROFESIONAL", "Proyecto, red local, console.log, pruebas, cobertura, mutación, despliegue y secretos.", "~65 min"],
      ["B", "LABORATORIO 08 · CAZAR MUTANTES", "Suite de ≥ 10 pruebas, ≥ 80 % de cobertura, tres mutantes muertos, Ignition en Sepolia.", "~80 min"],
      ["C", "EL PROYECTO, EN HARDHAT", "Estructura del repositorio del equipo, .gitignore y lo que nunca se sube.", "~25 min"],
    ],
    notas: "65 + 10 + 80 + 25 = 180. El plan pide migrar el contrato de la S7 a Hardhat: aquí el laboratorio usa Recaudo (un contrato nuevo, sin pruebas) para que nadie copie la suite de la S7, y la migración real ocurre en el bloque C con el contrato del proyecto. Antes de la clase: probar el flujo completo en una máquina de la sala (el plan lo exige: sección 10).",
  });

  await D.objetivo({
    objetivo: "Trabajar con el flujo real de un equipo: pruebas, cobertura, mutación, despliegue reproducible y código verificado.",
    preguntas: [
      "¿Qué no se puede hacer bien desde Remix?",
      "¿Qué hace que una prueba sea buena, y no solo verde?",
      "¿Por qué el 80 % de cobertura puede dejar pasar un error grave?",
      "¿Cómo se despliega sin que la clave privada toque el repositorio?",
    ],
    ra: "RA4 · Construir una suite de pruebas automatizadas y desplegar contratos verificados con un entorno profesional (Hardhat).",
    notas: "1 minuto. La tercera pregunta es el corazón de la sesión: al final del bloque A tienen que poder responderla con un ejemplo concreto.",
  });

  await D.glosario({
    items: [
      ["Hardhat", "entorno de desarrollo", "Compila, prueba, despliega y verifica desde la terminal. Trae su propia red local."],
      ["Mocha · Chai", "bibliotecas de pruebas", "Mocha organiza (describe, it); Chai comprueba (expect). Estándar en JavaScript."],
      ["Fixture", "estado de partida", "Despliegue que se ejecuta una vez y se restaura como instantánea antes de cada prueba."],
      ["Cobertura", "code coverage", "Porcentaje de líneas del contrato que alguna prueba ejecutó. No dice si se comprobaron."],
      ["Mutante", "mutation testing", "Copia del contrato con un error introducido a propósito. Una buena suite debe fallar contra él."],
      ["Ignition", "Hardhat Ignition", "Despliegue declarativo: registra lo hecho y retoma si se interrumpe."],
      ["RPC", "Remote Procedure Call", "La URL del nodo con el que se habla. Suele llevar una clave de API: es un secreto."],
      ["Keystore", "almacén cifrado", "Donde Hardhat 3 guarda claves y URLs, protegido con contraseña, fuera del repositorio."],
    ],
    notas: "2 minutos. Mutante y cobertura son las dos palabras que más se confunden: la cobertura mide qué se ejecutó; el mutante mide si alguien lo comprobó.",
  });

  /* =============================================================== A */
  {
    const s = await D.divisor({ letra: "A", titulo: "El flujo profesional", sub: "En software tradicional una prueba ahorra tiempo. Aquí es la última oportunidad de encontrar un error antes de que custodie dinero para siempre.", minutos: "APROXIMADAMENTE 65 MINUTOS", ic: "terminal" });
    s.addNotes("Recordar la S6: 'hoy desplegaron un programa que ya no pueden cambiar'. Las pruebas son la única red de seguridad antes del despliegue.");
  }

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
    D.parrafo(s, "Remix sigue siendo excelente para explorar y enseñar. Pero ningún equipo serio despliega desde el navegador.", { y: 6.35, h: 0.45, size: 12.5, color: C.ocre });
    s.addNotes("3 minutos. Preguntar: en la S7, ¿cuántas veces tuvieron que desplegar en Remix para probar la subasta? ¿Cuánto tardaría probar a mano las 23 situaciones de la suite? El plan menciona Foundry como alternativa: mismo flujo, pruebas en Solidity; en el curso se usa Hardhat para no duplicar entornos.");
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
    s.addNotes("2 minutos. Error típico de quien viene de Remix: desplegar en Sepolia para 'probar'. Cada despliegue cuesta ETH de prueba y minutos de espera; en la red local cuesta milisegundos.");
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
};`, { x: M + 6.0, y: 1.9, w: CW - 6.0, h: 4.0, lang: "js", size: 11, titulo: "hardhat.config.js (extracto)" });
    D.parrafo(s, "configVariable no contiene el secreto: le dice a Hardhat que lo busque en el almacén cifrado solo cuando se use esa red. Las pruebas locales nunca lo piden.", { y: 6.1, h: 0.65, size: 13, color: C.ocre });
    s.addNotes("3 minutos. Abrir el hardhat.config.js real del repositorio en el proyector. Señalar la versión del compilador y el optimizador: son los mismos que hay que declarar al verificar. Hardhat 3 usa módulos ES (import/export): por eso package.json dice \"type\": \"module\".");
  }

  {
    const s = await D.lamina({ kicker: "A.4 · la red local", titulo: "Una cadena completa en su computador", ic: "red", tituloSize: 29 });
    D.tabla(s, ["característica", "qué permite"], [
      ["20 cuentas con 10 000 ETH de prueba", "Simular a Ana, Beto, el dueño y un atacante sin pedir fondos a nadie."],
      ["Minado instantáneo", "Cada transacción queda en un bloque al momento: las pruebas corren en milisegundos."],
      ["Control del reloj", "time.increase(7 días) prueba plazos sin esperar una semana."],
      ["Instantáneas", "Guardar el estado y volver a él: la base de los fixtures."],
      ["Mensajes de error completos", "Muestra qué error personalizado revirtió y con qué argumentos."],
      ["npx hardhat node", "La misma red, como servidor en localhost:8545, para conectar una billetera o una interfaz (S12)."],
    ], { y: 1.9, h: 3.95, colW: [4.0, 8.093], size: 12 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Las cuentas de la red local son públicas", x: M, y: 5.93, w: CW, h: 0.92, texto: "Sus claves privadas están impresas en la documentación. Nunca se usan en una red real.", size: 12.5 });
    s.addNotes("3 minutos. Las 20 cuentas y los 10 000 ETH se comprobaron en el repositorio del curso (ethers.getSigners() devuelve 20). Cada ejecución de npx hardhat test arranca una cadena nueva en memoria; nada persiste entre corridas. Error típico: importar una de estas cuentas en MetaMask y usarla en Sepolia: cualquiera la puede vaciar.");
  }

  {
    const s = await D.lamina({ kicker: "A.5 · depurar sin adivinar", titulo: "console.log dentro de Solidity", ic: "terminal", tituloSize: 29 });
    D.codigo(s, `import "hardhat/console.sol";

function aportar() external payable {
    console.log("aporte de %s por %d wei", msg.sender, msg.value);
    total += msg.value;
    console.log("total ahora: %d", total);
}`, { x: M, y: 1.9, w: 7.2, h: 2.75, lang: "sol", size: 11.5 });
    D.codigo(s, `aporte de 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 por 1000 wei
total ahora: 1000
    ✔ imprime`, { x: M, y: 4.85, w: 7.2, h: 1.25, lang: "js", size: 10.5, titulo: "salida real de npx hardhat test" });
    D.lista(s, [
      "Solo funciona en la red local de Hardhat: en Sepolia no imprime nada.",
      "Sirve para ver valores intermedios mientras se escribe una prueba que no entienden por qué falla.",
      "Cuesta gas y ensucia el contrato: se borra antes de desplegar.",
    ], { x: M + 7.5, y: 1.9, w: CW - 7.5, h: 3.4, size: 12.5, gap: 8 });
    D.parrafo(s, "Error típico: dejar el import y los console.log en el contrato que se verifica en el explorador.", { x: M + 7.5, y: 5.4, w: CW - 7.5, h: 0.9, size: 12, color: C.ocre });
    s.addNotes("3 minutos. Salida verificada con un contrato de prueba en el repositorio (la dirección es la segunda cuenta de la red local). %s para texto y direcciones, %d para números. Demostración en vivo opcional: agregar un console.log a Recaudo.aportar() y correr una prueba; después quitarlo.");
  }

  {
    const s = await D.lamina({ kicker: "A.6 · dependencias", titulo: "Versiones exactas, o sorpresas a mitad de semestre", ic: "candado", tituloSize: 25 });
    D.codigo(s, `npm install --save-exact @openzeppelin/contracts@5.6.1

"devDependencies": {
  "hardhat": "3.16.0",
  "@nomicfoundation/hardhat-toolbox-mocha-ethers": "3.0.7"
},
"dependencies": { "@openzeppelin/contracts": "5.6.1" }`, { x: M, y: 1.9, w: 7.0, h: 2.75, lang: "js", titulo: "package.json", size: 11 });
    D.tabla(s, ["escritura", "instala"], [
      ["\"5.6.1\"", "Exactamente esa."],
      ["\"^5.6.1\"", "Cualquier 5.x posterior."],
      ["\"~5.6.1\"", "Cualquier 5.6.x posterior."],
    ], { x: M + 7.3, y: 1.9, w: CW - 7.3, h: 1.75, colW: [1.9, CW - 7.3 - 1.9], size: 12 });
    D.parrafo(s, "Sin --save-exact, npm escribe con ^: dos personas del mismo equipo pueden compilar con bibliotecas distintas.", { x: M + 7.3, y: 3.8, w: CW - 7.3, h: 0.95, size: 12.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Por qué importa más aquí que en una aplicación web", x: M, y: 4.95, w: CW, h: 1.75, texto: "El código de OpenZeppelin que se compila queda dentro del contrato desplegado, para siempre. Si una versión nueva cambia un comportamiento, no hay actualización posible. Por eso package-lock.json también se sube al repositorio: fija incluso las dependencias de las dependencias.", size: 12.5 });
    s.addNotes("3 minutos. En el repositorio del curso OpenZeppelin ya está instalado; el comando es el que usarán en el repositorio del proyecto. versiones.md documenta la decisión de congelar versiones (plan, sección 11).");
  }

  {
    const s = await D.lamina({ kicker: "A.7 · anatomía de una prueba", titulo: "describe, it, expect", ic: "codigo", tituloSize: 30 });
    D.codigo(s, `import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

async function desplegar() {                               // fixture: con NOMBRE
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
});`, { x: M, y: 1.9, w: CW, h: 4.85, lang: "js", size: 11 });
    s.addNotes("3 minutos. Leer la prueba en voz alta como una frase: 'Recaudo, al aportar, rechaza un aporte de cero'. Si el nombre no se lee como una especificación, está mal nombrado. En Hardhat 3 la red se obtiene con network.create() y loadFixture exige una función con nombre (no una flecha anónima): son los dos errores más comunes al copiar tutoriales de Hardhat 2.");
  }

  {
    const s = await D.lamina({ kicker: "A.8 · fixtures", titulo: "Cada prueba empieza de cero, sin pagarlo", ic: "reloj", tituloSize: 28 });
    D.pasos(s, [
      ["PRIMERA LLAMADA", "loadFixture ejecuta desplegar(): despliega el contrato y guarda una instantánea de toda la cadena."],
      ["LLAMADAS SIGUIENTES", "No vuelve a desplegar: restaura la instantánea. Milisegundos en lugar de segundos."],
      ["AISLAMIENTO", "Lo que una prueba cambió —aportes, tiempo adelantado— no existe para la siguiente."],
    ], { y: 1.9, alto: 0.92, gap: 0.14, anchoEt: 3.2, size: 13 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "El error clásico", x: M, y: 5.2, w: CW, h: 1.5, texto: "Desplegar en un before() compartido y dejar que las pruebas se afecten entre sí. La suite pasa en un orden y falla en otro, y nadie entiende por qué. Con fixtures ese problema no puede ocurrir.", size: 13.5 });
    s.addNotes("3 minutos. Ejemplo: una prueba adelanta el reloj una semana; si la siguiente no restaura, encuentra el plazo vencido y falla sin razón aparente. Con loadFixture, el reloj vuelve al momento de la instantánea.");
  }

  {
    const s = await D.lamina({ kicker: "A.9 · qué probar", titulo: "Las cinco familias de pruebas", ic: "lista", tituloSize: 30 });
    D.tabla(s, ["familia", "pregunta que responde", "ejemplo con la Subasta de la S7"], [
      ["Caso feliz", "¿Hace lo que promete cuando todo va bien?", "Una puja válida cambia mejorPostor y emite NuevaPuja."],
      ["Reversión", "¿Se niega a lo que no debe hacer?", "Pujar por debajo del mínimo revierte con PujaInsuficiente."],
      ["Permisos", "¿Solo quien debe puede hacerlo?", "Solo el dueño pausa."],
      ["Eventos", "¿Le cuenta al mundo lo que pasó, con los datos correctos?", "SubastaFinalizada con ganador y monto."],
      ["Bordes", "¿Qué pasa exactamente en el límite?", "La puja que supera en exactamente el 1 %, ni un wei menos."],
    ], { y: 1.9, h: 3.7, colW: [2.2, 4.8, 5.093], size: 12 });
    D.enunciado(s, "Las cuatro primeras dan cobertura. La quinta es la que atrapa los errores.", { y: 5.75, h: 1.0, size: 17, line: C.naranja });
    s.addNotes("3 minutos. Todos los ejemplos están en test/s07/Subasta.test.js: los conocen de la semana pasada. Preguntar por cada familia: ¿cuál de las pruebas de la S7 es de esta familia?");
  }

  {
    const s = await D.lamina({ kicker: "A.10 · las comprobaciones que más se usan", titulo: "Matchers de Hardhat para Chai", ic: "voto", tituloSize: 28 });
    D.codigo(s, `// revierte con un error personalizado, y con qué argumentos
await expect(tx).to.be.revertedWithCustomError(s, "PujaInsuficiente").withArgs(minimo, enviado);

// emite un evento con argumentos exactos
await expect(tx).to.emit(r, "Aporte").withArgs(ana.address, monto, total);

// cambia el saldo de ETH de una o varias cuentas (ethers va primero)
await expect(tx).to.changeEtherBalance(ethers, ana, monto);
await expect(tx).to.changeEtherBalances(ethers, [ana, r], [monto, -monto]);

// sin permiso, con el error de OpenZeppelin
await expect(tx).to.be.revertedWithCustomError(r, "OwnableUnauthorizedAccount");`, { x: M, y: 1.9, w: CW, h: 3.5, lang: "js", size: 11 });
    await D.ficha(s, { tipo: "alerta", etiqueta: "Dos trampas", x: M, y: 5.55, w: CW, h: 1.18, texto: "changeEtherBalance ya descuenta el gas: comparen el monto exacto. Y no usen .to.be.reverted a secas: está desaconsejado y no dice POR QUÉ revirtió.", size: 12.5 });
    s.addNotes("3 minutos. Una prueba que solo dice 'revirtió' pasa aunque revierta por la razón equivocada (por ejemplo, falta de fondos en lugar de la regla que se quería probar). revertedWithCustomError con withArgs es la forma de exigir la razón correcta. En Hardhat 3 los matchers de saldo reciben ethers como primer argumento.");
  }

  {
    const s = await D.lamina({ kicker: "A.11 · simular el mundo", titulo: "Otras cuentas y otro momento", ic: "persona", tituloSize: 30 });
    D.codigo(s, `const [dueno, ana, atacante] = await ethers.getSigners();

await r.connect(ana).aportar({ value: eth(3) });          // Ana firma

await time.increase(7 * 24 * 60 * 60);                     // pasa una semana
await time.increaseTo(fin);                                // mina un bloque en fin
await time.setNextBlockTimestamp(fin);                     // el PRÓXIMO bloque cae en fin

await expect(r.connect(atacante).reclamarFondos())         // alguien sin permiso
  .to.be.revertedWithCustomError(r, "OwnableUnauthorizedAccount");`, { x: M, y: 1.9, w: CW, h: 3.3, lang: "js", size: 12 });
    D.parrafo(s, "connect(cuenta) cambia quién firma. time viene de networkHelpers y mueve el reloj de la red local, nunca el de una red real. La diferencia entre increaseTo y setNextBlockTimestamp es sutil y es la lámina siguiente.", { y: 5.4, h: 1.3, size: 13.5 });
    s.addNotes("3 minutos. Error típico: olvidar connect y hacer todo con la primera cuenta (el dueño). Así, las pruebas de permisos pasan por accidente.");
  }

  {
    const s = await D.lamina({ kicker: "A.12 · el reloj en el límite · ejemplo trabajado", titulo: "¿En qué segundo cae mi transacción?", ic: "reloj", tituloSize: 27 });
    D.parrafo(s, "La Subasta de la S7 dice: if (block.timestamp >= fin) revert SubastaCerrada(). ¿Qué pasa si alguien puja en el segundo exacto de fin? Hay que poder llevar una transacción a ese segundo.", { y: 1.85, h: 0.95, size: 13.5 });
    D.tabla(s, ["herramienta", "qué hace el reloj", "la puja siguiente cae en", "sirve para probar"], [
      ["time.increaseTo(fin)", "Mina un bloque vacío con marca fin.", "fin + 1", "«después del cierre»"],
      ["time.setNextBlockTimestamp(fin)", "No mina nada: fija la marca del PRÓXIMO bloque.", "fin, exacto", "«en el segundo exacto»"],
      ["setNextBlockTimestamp(fin − 1n)", "Igual, un segundo antes.", "fin − 1", "«un segundo antes»"],
    ], { y: 2.95, h: 2.2, colW: [3.5, 3.7, 2.4, 2.493], size: 11.5 });
    await D.ficha(s, { tipo: "termino", etiqueta: "La regla para cualquier plazo", x: M, y: 5.35, w: CW, h: 1.37, texto: "Para cada comparación con el tiempo, tres pruebas: un segundo antes, el segundo exacto y un segundo después. Una prueba con «una semana después» nunca llega al límite: por eso casi nadie lo prueba, y por eso ahí viven los errores.", size: 12.5 });
    s.addNotes("4 minutos. Ejemplo con la Subasta de la S7, no con Recaudo. Dibujar en el tablero la línea de tiempo fin-1, fin, fin+1 y marcar qué debe pasar en cada punto según el >= del contrato. fin es un BigInt en ethers v6: por eso fin - 1n.");
  }

  {
    const s = await D.lamina({ kicker: "A.13 · cobertura", titulo: "Qué mide, y qué no mide", ic: "grafico", tituloSize: 30 });
    D.codigo(s, `npx hardhat test test/s07/Subasta.test.js --coverage`, { x: M, y: 1.9, w: 8.0, h: 0.62, lang: "js", size: 12.5 });
    D.dosColumnas(s,
      { et: "Qué mide", items: ["Qué líneas del contrato ejecutó alguna prueba.", "Qué líneas nunca se ejecutaron: el informe las lista por número.", "Útil para encontrar funciones o reversiones que nadie probó."] },
      { et: "Qué NO mide", linea: C.rojo, color: C.rojo, items: ["Si la prueba comprobó el resultado. Una prueba sin expect da cobertura.", "Si se probó el valor exacto del borde.", "Si el contrato hace lo que el negocio necesita."] },
      { y: 2.75, h: 2.65, size: 13 });
    D.enunciado(s, "La cobertura dice dónde NO hay pruebas. No dice que las que hay sirvan.", { y: 5.65, h: 1.05, size: 18, line: C.naranja });
    s.addNotes("3 minutos. Preguntar: ¿una prueba que llama aportar() sin ningún expect cuenta para la cobertura? Sí. ¿Prueba algo? Solo que no revierte.");
  }

  {
    const s = await D.lamina({ kicker: "A.14 · leer el informe", titulo: "Una fila, tres columnas, una lista", ic: "lupa", tituloSize: 29 });
    D.codigo(s, `║ File Path                     │ Line % │ Statement % │ Uncovered Lines   ║
║ contracts\\s07\\Empaquetado.sol │ 100.00 │ 100.00      │ -                 ║
║ contracts\\s07\\Subasta.sol     │ 97.06  │ 97.87       │ 118               ║
║ contracts\\s08\\Recaudo.sol     │ 0.00   │ 0.00        │ 49-51, 55-56, ... ║
║ Total                         │ 21.38  │ 21.64       │                   ║`, { x: M, y: 1.9, w: CW, h: 1.85, lang: "js", size: 11, titulo: "salida real, recortada" });
    D.pasos(s, [
      ["BUSCAR SU FILA", "El informe lista TODOS los contratos del repositorio. La fila que importa es la del contrato que prueban."],
      ["IGNORAR EL TOTAL", "21 % de Total no significa nada: incluye contratos de otras sesiones que esta suite ni toca."],
      ["LEER LAS LÍNEAS", "118 es el revert EnvioFallido de retirar(): solo se ejecuta si el receptor rechaza el pago. Cada número es una pregunta."],
    ], { y: 3.85, alto: 0.76, gap: 0.08, anchoEt: 2.9, size: 12 });
    D.parrafo(s, "También queda un informe navegable en coverage/html/index.html, con cada línea pintada de verde o rojo.", { y: 6.47, h: 0.35, size: 12, color: C.gris });
    s.addNotes("3 minutos. Cifras medidas con las 23 pruebas de la S7. La línea 118 no se cubre porque ninguna prueba usa un receptor que rechace el retiro: alcanzarla exige un contrato auxiliar. No todo el 100 % vale la pena; lo que importa es saber POR QUÉ cada línea queda sin cubrir.");
  }

  {
    const s = await D.lamina({ kicker: "A.15 · pruebas de mutación", titulo: "¿Mis pruebas notarían un error?", ic: "bicho", tituloSize: 28 });
    D.parrafo(s, "La idea: introducir un error pequeño a propósito —un mutante— y correr la suite. Si alguna prueba falla, el mutante está MUERTO: la suite lo vio. Si todas pasan, está VIVO: ese error llegaría a producción.", { y: 1.85, h: 0.95, size: 13.5 });
    D.tabla(s, ["mutante sobre la Subasta de la S7", "resultado con las 23 pruebas", "por qué"], [
      ["INCREMENTO_MINIMO_BPS = 10 en lugar de 100", "MUERTO · 2 pruebas fallan", "Dos pruebas comprueban el valor exacto: 2,02 ETH."],
      ["Borrar emit Retiro(...) en retirar()", "VIVO · 23 pasan", "Ninguna prueba comprueba el evento Retiro."],
    ], { y: 2.95, h: 1.7, colW: [4.4, 3.2, 4.493], size: 11.5 });
    await D.ficha(s, { tipo: "profundidad", etiqueta: "Lo que enseña el mutante vivo", x: M, y: 4.85, w: CW, h: 1.87, texto: "Subasta.sol tiene 97 % de cobertura y aun así una interfaz que escuche el evento Retiro dejaría de enterarse de los retiros, sin que ninguna prueba lo note. La línea del evento estaba cubierta; nadie comprobaba lo que emitía. Arreglarlo es una línea: to.emit(s, \"Retiro\").withArgs(ana.address, eth(1)).", size: 12.5 });
    s.addNotes("4 minutos. Los dos mutantes se corrieron de verdad contra test/s07/Subasta.test.js al preparar la sesión: el primero hace fallar 'exige superar la puja anterior al menos en 1 %' y 'se usa desde la subasta: 1 % de 2 ETH'; el segundo sobrevive con 23 en verde. Ejercicio relámpago: ¿qué prueba agregarían? Aquí los ejemplos son de la S7 a propósito: los mutantes del laboratorio no se muestran.");
  }

  {
    const s = await D.lamina({ kicker: "A.16 · el experimento de hoy", titulo: "88 % de cobertura y tres errores vivos", ic: "bicho", tituloSize: 28 });
    D.parrafo(s, "Preparando el laboratorio escribimos una suite de referencia para el contrato Recaudo y tres copias del contrato con un error cada una. Después quitamos solo las pruebas de borde.", { y: 1.9, h: 0.95, size: 14 });
    D.cifra(s, "13", "pruebas en verde contra el contrato correcto", { x: M, y: 3.0, w: 2.8, h: 1.65, size: 34 });
    D.cifra(s, "88 %", "de cobertura de líneas: cumple la meta del curso", { x: M + 3.0, y: 3.0, w: 3.0, h: 1.65, color: C.violeta, size: 34 });
    D.cifra(s, "13 / 13", "siguen en verde contra CADA mutante", { x: M + 6.2, y: 3.0, w: 2.9, h: 1.65, color: C.rojo, size: 30 });
    D.cifra(s, "3", "errores reales que la suite no ve", { x: M + 9.3, y: 3.0, w: CW - 9.3, h: 1.65, color: C.rojo, size: 34 });
    D.tabla(s, ["", "suite sin bordes", "suite con 3 pruebas de borde más"], [
      ["Contra el contrato correcto", "13 pasan · 88 %", "16 pasan · 92 %"],
      ["Contra cada mutante", "13 pasan · VIVO", "15 pasan, 1 falla · MUERTO"],
    ], { y: 4.95, h: 1.3, colW: [3.8, 3.9, 4.393], size: 12.5 });
    D.parrafo(s, "Medido con npx hardhat test --coverage y scripts/s08/cazar-mutantes.js. Cuáles son los bordes: eso lo descubren ustedes.", { y: 6.38, h: 0.4, size: 11.5, color: C.gris });
    s.addNotes("3 minutos. Cifras exactas medidas: 88,46 % de líneas con 13 pruebas; 92,31 % con 16. El 92 % no llega a 100 porque las dos líneas 'revert EnvioFallido' solo se alcanzan con un receptor que rechace el pago. NO decir cuáles son las tres pruebas ni qué cambia cada mutante: el solucionario está en el repositorio privado.");
  }

  {
    const s = await D.lamina({ kicker: "A.17 · pruebas de borde", titulo: "Dónde viven los errores", ic: "diana", tituloSize: 31 });
    D.tabla(s, ["borde", "la pregunta que hay que hacerle al contrato", "por qué ahí"], [
      ["Tiempo", "¿Qué pasa un segundo antes, en el segundo exacto y un segundo después de cada plazo?", "Una comparación mal escrita deja entrar o salir justo en el límite, y ninguna prueba «normal» llega a ese instante."],
      ["Umbral", "¿Qué pasa con el valor exacto de cada límite: ni un wei más, ni uno menos?", "Los casos cómodos siempre quedan lejos del límite: por eso nadie los prueba."],
      ["Repetición", "¿Qué pasa si la misma cuenta llama dos veces seguidas?", "Un efecto que debería ocurrir una vez puede repetirse si el estado no cambió."],
      ["Cero y vacío", "¿Qué pasa con 0, con la dirección cero, con un texto vacío?", "Son valores válidos para la EVM y absurdos para el negocio."],
      ["Quién llama", "¿Qué pasa si llama otra cuenta, o un contrato?", "Basta una función sin su modificador."],
    ], { y: 1.9, h: 4.3, colW: [2.0, 4.9, 5.193], size: 11.5 });
    D.parrafo(s, "Para cada función del contrato, recorrer las cinco filas. Así se encuentran los errores que la cobertura no ve.", { y: 6.35, h: 0.42, size: 13, color: C.ocre });
    s.addNotes("3 minutos. Esta tabla es la herramienta del laboratorio. No asociar ninguna fila a un mutante concreto: si preguntan '¿cuál es el de tiempo?', devolver la pregunta: '¿qué comparaciones con el tiempo tiene Recaudo, y qué prueba haría falta en cada límite?'.");
  }

  {
    const s = await D.lamina({ kicker: "A.18 · gas en las pruebas", titulo: "Cuánto cuesta cada función, de un vistazo", ic: "gas", tituloSize: 26 });
    D.codigo(s, `npx hardhat test test/s07/Subasta.test.js --gas-stats

  contracts/s07/Subasta.sol:Subasta
  Function name   Min      Average   Median    Max       #calls
  finalizar       49379    67786     73922     73922     4
  pujar           45421    115482    124090    138289    24
  retirar         30000    30000     30000     30000     5
  estado          23494    23509     23516     23516     3
  Deployment      712669                                 1`, { x: M, y: 1.9, w: CW, h: 3.3, lang: "js", size: 12 });
    D.lista(s, [
      "pujar varía de 45 421 a 138 289: estrenar ranuras (primer postor, nuevo participante) es lo caro (S5 y S7).",
      "estado aparece con gas porque la prueba la llama; desde una aplicación, leer es gratis.",
      "Si un cambio de código hace subir mucho una cifra, es una señal para revisar antes de desplegar.",
    ], { y: 5.4, h: 1.35, size: 12.5, gap: 5 });
    s.addNotes("2 minutos. Salida real y recortada de la suite de la S7 (23 pruebas). Es la misma herramienta con la que llenaron la tabla push/pull la semana pasada. En el proyecto, la rúbrica pide 'gas optimizado': esta tabla es la evidencia.");
  }

  {
    const s = await D.lamina({ kicker: "A.19 · desplegar", titulo: "Ignition: despliegues que se pueden repetir", ic: "cohete", tituloSize: 28 });
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
      "El mismo módulo sirve para la red local y para Sepolia; cambian solo los parámetros (0,005 ETH y 30 minutos en Sepolia).",
    ], { y: 5.1, h: 1.65, size: 12.5, gap: 6 });
    s.addNotes("3 minutos. Diferencia con un script suelto: si un script se cae después de desplegar y antes de guardar la dirección, al repetirlo despliega otra vez. Ignition guarda un diario (journal) y no repite lo que ya se hizo. Los valores grandes van como texto en el JSON porque 5·10¹⁵ no cabe exacto en un número de JavaScript.");
  }

  {
    const s = await D.lamina({ kicker: "A.20 · secretos", titulo: "La clave privada nunca toca el repositorio", ic: "llave", tituloSize: 27 });
    D.codigo(s, `npx hardhat keystore set SEPOLIA_RPC_URL        # la primera vez pide crear una contraseña
npx hardhat keystore set SEPOLIA_PRIVATE_KEY    # la de la billetera DEL CURSO
npx hardhat keystore set ETHERSCAN_API_KEY
npx hardhat keystore list                       # muestra los NOMBRES, nunca los valores`, { x: M, y: 1.9, w: CW, h: 1.5, lang: "js", size: 11.5 });
    D.dosColumnas(s,
      { et: "Qué hace el almacén", items: ["Guarda los valores cifrados con una contraseña que se pide al usarlos.", "Vive en un archivo de su carpeta de usuario, fuera del proyecto.", "configVariable los busca solo cuando una tarea los necesita."] },
      { et: "Si una clave se sube a GitHub", linea: C.rojo, color: C.rojo, items: ["Hay programas que recorren los repositorios públicos buscando claves.", "ConsenSys documenta billeteras vaciadas «en segundos».", "Borrar el archivo no basta: queda en el historial de Git."] },
      { y: 3.55, h: 2.45, size: 11.5 });
    D.parrafo(s, "Si ocurre: la clave se da por perdida. Se mueven los fondos a una billetera nueva y no se vuelve a usar.", { y: 6.15, h: 0.55, size: 13, color: C.rojo, bold: true });
    s.addNotes("3 minutos. Fuente: ConsenSys, 'How to Avoid Uploading Your Private Key to GitHub' (consensys.io/blog). Documentación de Hardhat 3: keystore y configuration variables; también existe keystore set --dev para valores no sensibles sin contraseña. Nada de archivos .env con la clave: el curso usa solo el keystore. La frase semilla no va en ningún lado: ni en el keystore.");
  }

  {
    const s = await D.lamina({ kicker: "A.21 · verificar", titulo: "Publicar el código fuente del contrato", ic: "lupa", tituloSize: 28 });
    D.codigo(s, `npx hardhat ignition deploy ignition/modules/Recaudo.js \\
  --network sepolia \\
  --parameters ignition/parametros/recaudo-sepolia.json \\
  --verify`, { x: M, y: 1.9, w: CW, h: 1.5, lang: "js", size: 12.5 });
    D.pasos(s, [
      ["QUÉ HACE", "Envía al explorador el código, la versión del compilador y la configuración. El explorador recompila y compara con el bytecode desplegado."],
      ["SI COINCIDE", "Aparece la marca de verificación, el código legible y las pestañas para leer y escribir el contrato."],
      ["POR QUÉ IMPORTA", "Un contrato sin verificar pide confianza ciega: nadie puede saber qué hace sin descompilarlo."],
    ], { y: 3.6, alto: 0.9, gap: 0.12, anchoEt: 2.5, size: 12.5 });
    D.parrafo(s, "En la rúbrica del proyecto: sin contrato verificado, «pruebas y despliegue» cae a insuficiente.", { y: 6.38, h: 0.42, size: 13, color: C.ocre });
    s.addNotes("3 minutos. La marca de verificación es lo que la S6 hizo a mano en el explorador; aquí es una bandera del mismo comando de despliegue. Verificar es el 'verificar en vez de creer' del curso aplicado al propio contrato.");
  }

  await verificacion({
    kicker: "Verificación · bloque A",
    titulo: "Antes de la pausa: cuatro preguntas",
    preguntas: [
      "Una suite tiene 95 % de cobertura. Den un ejemplo concreto de error que podría no detectar.",
      "¿Qué diferencia hay entre time.increaseTo(fin) y time.setNextBlockTimestamp(fin) para la transacción siguiente?",
      "¿Qué comando usan para ver qué líneas de su contrato nunca se ejecutaron, y qué fila del informe miran?",
      "¿Dónde vive la clave privada de Sepolia en este flujo, y qué archivo del repositorio la menciona?",
    ],
    notas: "3 minutos. Respuestas: (1) el emit Retiro borrado de A.15, o cualquier valor que se ejecuta pero no se compara; (2) increaseTo mina un bloque en fin y la siguiente cae en fin + 1; setNextBlockTimestamp hace que la siguiente caiga exactamente en fin; (3) npx hardhat test <archivo> --coverage, la fila del contrato, columna Line % y Uncovered Lines; (4) en el keystore cifrado de la carpeta de usuario; hardhat.config.js solo la NOMBRA con configVariable. Pausa de 10 minutos.",
  });

  /* =============================================================== B */
  {
    const s = await D.divisor({ letra: "B", titulo: "Laboratorio 08 · cazar mutantes", sub: "Escribir la suite de un contrato que no trae pruebas, alcanzar la cobertura, matar tres mutantes y desplegar con Ignition.", minutos: "APROXIMADAMENTE 80 MINUTOS · EN PAREJAS", ic: "bicho" });
    s.addNotes("Repartir el PDF de la guía (laboratorios-evm/guias/s08-pruebas-y-mutantes.pdf). Regla que se dice en voz alta ahora: no se abren los archivos de los mutantes hasta que los tres estén muertos.");
  }

  {
    const s = await D.lamina({ kicker: "B.1 · preparar · 10 minutos", titulo: "El entorno de la sala, comprobado", ic: "terminal", tituloSize: 29 });
    D.codigo(s, `node --version                                        # v22.x
npm install                                           # solo si no se hizo en la S5
npx hardhat --version                                 # 3.16.0
npx hardhat test test/s07/Subasta.test.js             # 23 passing: el entorno funciona`, { x: M, y: 1.9, w: CW, h: 1.55, lang: "js", size: 11.5 });
    D.tabla(s, ["si pasa esto", "hacer esto"], [
      ["npm install tarda o falla por la red de la sala", "Reintentar una vez; si persiste, avisar: el docente tiene el repositorio con node_modules en memoria USB."],
      ["npx hardhat --version no da 3.16.0", "No actualizar nada. Revisar que la terminal esté en laboratorios-evm."],
      ["La suite de la S7 falla", "Dejaron su versión incompleta de Subasta.sol: git checkout contracts/s07/Subasta.sol."],
    ], { y: 3.65, h: 2.2, colW: [4.6, 7.493], size: 11.5 });
    D.parrafo(s, "Cómo saber que terminó: 23 passing en la S7. Nada de lo que sigue funciona si esto no funciona.", { y: 6.05, h: 0.6, size: 13, color: C.ocre });
    s.addNotes("10 minutos. El plan advierte que la red de la sala es el riesgo operativo principal: tener la copia en USB lista. No avanzar con parejas cuyo entorno falla: se pierden todo el laboratorio.");
  }

  {
    const s = await D.lamina({ kicker: "B.2 · el contrato y la plantilla", titulo: "Leer Recaudo, copiar la plantilla", ic: "documento", tituloSize: 28 });
    D.codigo(s, `mkdir test/s08                                          # cmd: mkdir test\\s08
cp andamiaje/s08/Recaudo.test.js test/s08/Recaudo.test.js
npx hardhat test test/s08/Recaudo.test.js               # 2 passing: los ejemplos`, { x: M, y: 1.9, w: CW, h: 1.2, lang: "js", size: 11.5 });
    D.tabla(s, ["final", "condición, tras el plazo", "qué se puede hacer"], [
      ["Exitoso", "totalRecaudado >= meta", "El dueño reclama los fondos, una vez."],
      ["Fallido", "totalRecaudado < meta", "Cada aportante recupera exactamente lo suyo."],
    ], { y: 3.3, h: 1.25, colW: [1.8, 4.5, 5.793], size: 12 });
    D.pasos(s, [
      ["LEER EL CONTRATO", "contracts/s08/Recaudo.sol: tres funciones, dos finales. Marquen cada if con un límite: son candidatos a borde."],
      ["NO LEER LOS MUTANTES", "El ejercicio es pensar en los bordes. Abrirlos antes lo convierte en copiar, y no se aprende nada."],
    ], { y: 4.75, alto: 0.84, gap: 0.12, anchoEt: 3.0, size: 12.5 });
    s.addNotes("5 minutos. Pedir que subrayen en Recaudo.sol cada comparación (<, >=, ==) y cada cambio de estado: ese subrayado es su lista de pruebas de borde. No decir cuáles importan.");
  }

  {
    const s = await D.lamina({ kicker: "B.3 · parte 1 · 30 minutos", titulo: "Escribir la suite: diez pruebas o más", ic: "codigo", tituloSize: 28 });
    D.tabla(s, ["grupo", "mínimo", "qué no olvidar"], [
      ["despliegue", "2", "Parámetros inválidos en el constructor."],
      ["aportar", "3", "Evento con argumentos exactos. Los límites del plazo."],
      ["recaudo exitoso", "3", "Permisos. Doble reclamo. Saldo exacto que recibe el dueño. Los límites de la meta."],
      ["recaudo fallido", "3", "Cada quien lo suyo. Quien no aportó. El dueño no se lleva nada. Repeticiones."],
    ], { y: 1.9, h: 2.5, colW: [2.6, 1.3, 8.193], size: 12 });
    await D.ficha(s, { tipo: "termino", etiqueta: "Una prueba falla por la razón correcta, o no prueba nada", x: M, y: 4.6, w: CW, h: 2.1, texto: "Antes de dar por buena una prueba de reversión, pregúntense: ¿qué otra cosa podría hacerla revertir? Si una segunda llamada revierte porque el contrato se quedó sin dinero y no por la regla, la prueba pasa por accidente. Diseñen el escenario para que SOLO la regla pueda detenerla, y exijan el error exacto con revertedWithCustomError.", size: 12.5 });
    s.addNotes("30 minutos. Circular. La ficha es el consejo más importante del laboratorio y es general: aplica a cualquier prueba de reversión. Si una pareja tiene dudas de sintaxis, remitir a las láminas A.10–A.12 y a la sección de herramientas de la guía.");
  }

  {
    const s = await D.lamina({ kicker: "B.4 · parte 2 · 10 minutos", titulo: "Medir la cobertura y leer lo que falta", ic: "grafico", tituloSize: 28 });
    D.codigo(s, `npx hardhat test test/s08/Recaudo.test.js --coverage

║ contracts\\s08\\Recaudo.sol     │ 11.54  │ 15.79       │ 49, 55-56, 60, 63-64, ...   ← con la plantilla`, { x: M, y: 1.9, w: CW, h: 1.35, lang: "js", size: 11 });
    D.pasos(s, [
      ["SU FILA", "contracts\\s08\\Recaudo.sol. Meta del curso: Line % ≥ 80."],
      ["CADA NÚMERO", "Abran Recaudo.sol en esa línea. ¿Qué prueba la ejecutaría? Escríbanla."],
      ["LO QUE QUEDA", "Si solo quedan líneas de revert EnvioFallido, está bien: exigen un receptor que rechace el pago. Anótenlo en el informe."],
    ], { y: 3.45, alto: 0.84, gap: 0.12, anchoEt: 2.5, size: 12.5 });
    D.parrafo(s, "Cómo saber que terminó esta parte: ≥ 10 pruebas en verde y Line % ≥ 80 en la fila de Recaudo.sol. Captura de pantalla.", { y: 6.35, h: 0.45, size: 12.5, color: C.ocre });
    s.addNotes("10 minutos. 11,54 % es la cobertura medida con las dos pruebas de la plantilla. Llegar al 80 % es fácil; la parte 3 muestra que no basta.");
  }

  {
    const s = await D.lamina({ kicker: "B.5 · parte 3 · 20 minutos", titulo: "Cazar los tres mutantes", ic: "diana", tituloSize: 30 });
    D.codigo(s, `node scripts/s08/cazar-mutantes.js

  ✔ Recaudo (correcto)      2 pruebas en verde

  ✗ VIVO    RecaudoMutante1   2 pasan · 0 fallan
  ✗ VIVO    RecaudoMutante2   2 pasan · 0 fallan
  ✗ VIVO    RecaudoMutante3   2 pasan · 0 fallan

  3 mutante(s) sobrevive(n). Hay un error que su suite no ve: piensen en los bordes.`, { x: M, y: 1.9, w: CW, h: 2.9, lang: "js", size: 11.5 });
    D.pasos(s, [
      ["MIENTRAS HAYA VIVOS", "Volver a la tabla de bordes (A.17) y al subrayado de Recaudo.sol. Escribir la prueba que falta. No abrir el mutante."],
      ["CUANDO MUERAN LOS TRES", "Ahora sí: abrir cada mutante, encontrar la diferencia y anotar qué prueba lo mató y por qué."],
    ], { y: 5.0, alto: 0.8, gap: 0.12, anchoEt: 3.3, size: 12.5 });
    s.addNotes("20 minutos. Salida real con la plantilla de 2 pruebas. Mutante muerto = al menos una prueba falla contra él. Si una pareja pide pistas, solo preguntas de la tabla A.17 aplicadas a una función: '¿qué pasa en el límite exacto de esa comparación?', nunca 'el mutante 2 es…'. Con la suite de referencia del docente, cada mutante muere con exactamente una prueba.");
  }

  {
    const s = await D.lamina({ kicker: "B.6 · parte 4 · primero en local", titulo: "Desplegar con Ignition en la red local", ic: "cohete", tituloSize: 28 });
    D.codigo(s, `npx hardhat ignition deploy ignition/modules/Recaudo.js

You are running Hardhat Ignition against an in-process instance of Hardhat Network.
This will execute the deployment, but the results will be lost.
Hardhat Ignition 🚀
Deploying [ RecaudoModulo ]
Batch #1
  Executed RecaudoModulo#Recaudo
[ RecaudoModulo ] successfully deployed 🚀
Deployed Addresses
RecaudoModulo#Recaudo - 0x5FbDB2315678afecb367f032d93F642f64180aa3`, { x: M, y: 1.9, w: CW, h: 3.5, lang: "js", size: 11, titulo: "salida real, recortada" });
    D.parrafo(s, "Cómo saber que funcionó: «successfully deployed» y una dirección. En la red en memoria el resultado se pierde al terminar: es solo para comprobar que el módulo y los parámetros por defecto están bien, antes de gastar ETH de prueba.", { y: 5.6, h: 1.1, size: 13 });
    s.addNotes("5 minutos. La dirección 0x5FbDB… es siempre la misma en la red local: primera cuenta, nonce 0. Si falla aquí, fallará en Sepolia: se corrige aquí.");
  }

  {
    const s = await D.lamina({ kicker: "B.7 · parte 4 · Sepolia · 15 minutos", titulo: "Keystore, despliegue, verificación y uso", ic: "llave", tituloSize: 27 });
    D.pasos(s, [
      ["SECRETOS", "keystore set de SEPOLIA_RPC_URL (de Alchemy o Infura), SEPOLIA_PRIVATE_KEY (billetera del curso) y ETHERSCAN_API_KEY."],
      ["DESPLEGAR", "El comando de A.21: --network sepolia, --parameters y --verify. Pide la contraseña del keystore."],
      ["COMPROBAR", "La dirección en sepolia.etherscan.io muestra la marca de código verificado."],
      ["USAR", "Aportar 0,005 ETH desde Write Contract. Esperar los 30 minutos. Reclamar desde la cuenta que desplegó."],
    ], { y: 1.9, alto: 0.82, gap: 0.08, anchoEt: 2.3, size: 12 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "Antes del git push", x: M, y: 5.6, w: CW, h: 1.15, texto: "git status: ni claves, ni .env, ni URLs con API key. Sí se sube ignition/deployments/chain-11155111: es la evidencia reproducible del despliegue.", size: 12.5 });
    s.addNotes("15 minutos. Si --verify falla por tiempo, repetir EL MISMO comando: Ignition sabe que ya desplegó y solo reintenta la verificación. La cuenta que desplegó es el owner(): solo ella puede reclamar. Si no alcanza el tiempo para esperar los 30 minutos, reclamar en casa y adjuntar el hash.");
  }

  {
    const s = await D.lamina({ kicker: "B.8 · errores frecuentes y evidencia", titulo: "Lo que suele salir mal, y qué se entrega", ic: "bicho", tituloSize: 27 });
    D.tabla(s, ["síntoma", "causa"], [
      ["El script dice «No se encontraron pruebas»", "La suite no está en test/s08/Recaudo.test.js."],
      ["Una prueba de plazo pasa contra todo", "Nunca llega al segundo exacto: revisen A.12."],
      ["Una reversión pasa por otra razón","Revisen el escenario (B.3) y exijan el error exacto."],
      ["loadFixture falla con una función anónima", "La fixture necesita nombre: async function desplegar()."],
      ["--verify falla", "Falta ETHERSCAN_API_KEY, o reintentar el mismo comando tras un minuto."],
    ], { y: 1.9, h: 2.75, colW: [5.0, 7.093], size: 11 });
    D.tabla(s, ["evidencia", "detalle", "peso"], [
      ["Suite", "test/s08/Recaudo.test.js con ≥ 10 pruebas en verde.", "25 %"],
      ["Cobertura", "Captura con ≥ 80 % de líneas en Recaudo.sol.", "15 %"],
      ["Mutantes", "Los tres muertos + qué prueba mató a cada uno y por qué.", "35 %"],
      ["Despliegue", "Dirección en Sepolia, verificada, desplegada con Ignition.", "25 %"],
    ], { y: 4.85, h: 1.9, colW: [2.0, 8.493, 1.6], size: 11 });
    s.addNotes("Evidencia de la sesión según el plan: repositorio con suite de pruebas verde y contrato verificado. La rúbrica completa está en la guía.");
  }

  await verificacion({
    kicker: "Verificación · bloque B",
    titulo: "Lo que el laboratorio debió dejar claro",
    preguntas: [
      "Su suite tenía más de 80 % de cobertura antes de matar a los tres mutantes. ¿Qué les dice eso sobre el requisito del 80 %?",
      "Para una de sus pruebas de borde: ¿qué otra razón podría haberla hecho fallar, y cómo lo descartaron?",
      "¿Qué líneas de Recaudo.sol quedaron sin cubrir, y por qué es aceptable (o no)?",
      "Si mañana cambian un parámetro de Sepolia, ¿qué archivo tocan y qué comando repiten?",
    ],
    notas: "4 minutos. Respuestas esperadas: (1) el 80 % es necesario, no suficiente; (2) depende de la pareja: lo que importa es que puedan explicar por qué SOLO la regla podía hacerla fallar; (3) típicamente las dos líneas revert EnvioFallido: exigen un receptor que rechace el pago; (4) ignition/parametros/recaudo-sepolia.json y el mismo ignition deploy (un despliegue nuevo con otros parámetros usa otro --deployment-id o --reset en la red local). No revelar aquí las pruebas del solucionario.",
  });

  /* =============================================================== C */
  {
    const s = await D.divisor({ letra: "C", titulo: "El proyecto, en Hardhat", sub: "Desde hoy el repositorio del equipo tiene la misma forma que el del curso. El Avance 1 se entrega en la Sesión 13.", minutos: "APROXIMADAMENTE 25 MINUTOS", ic: "bandera" });
    s.addNotes("25 minutos: cada equipo crea su repositorio en clase, con el docente circulando. Los equipos reorientados en la S7 que aún no tengan alcance aprobado usan este tiempo con el docente: sin alcance aprobado no hay repositorio que montar.");
  }

  {
    const s = await D.lamina({ kicker: "C.1 · el repositorio del equipo", titulo: "La estructura recomendada, desde hoy", ic: "rejilla", tituloSize: 28 });
    D.codigo(s, `npx hardhat --init                  # plantilla mocha + ethers
npm install --save-exact @openzeppelin/contracts@5.6.1

proyecto-equipo/
├── contracts/            su contrato principal (el borrador de la S7)
├── test/                 una suite por contrato
├── ignition/modules/     un módulo por despliegue
├── ignition/parametros/  sepolia.json
├── docs/                 anteproyecto, decisiones de diseño
├── hardhat.config.js     con configVariable, sin secretos
├── package.json          versiones exactas
├── package-lock.json     SÍ se sube
├── .gitignore
└── README.md             qué hace, cómo instalar, cómo probar`, { x: M, y: 1.9, w: 7.6, h: 4.85, lang: "js", size: 10.5 });
    D.lista(s, [
      "Usen las mismas versiones del curso (versiones.md): Hardhat 3.16.0, Solidity 0.8.28, OpenZeppelin 5.6.1.",
      "Repositorio en GitHub, los tres integrantes con permisos y el docente como colaborador.",
      "El borrador de la S7 se mueve a contracts/ y se le escriben pruebas con el método de hoy.",
    ], { x: M + 7.9, y: 1.9, w: CW - 7.9, h: 4.85, size: 12.5, gap: 10 });
    s.addNotes("5 minutos. npx hardhat --init existe en Hardhat 3 (opción global --init; se verificó en la ayuda de la versión 3.16.0). Si la red de la sala impide instalar, alternativa: copiar la estructura de laboratorios-evm sin sus contratos. docs/ guarda el anteproyecto y el informe de decisiones: la rúbrica pide documentación.");
  }

  {
    const s = await D.lamina({ kicker: "C.2 · lo que nunca se sube", titulo: ".gitignore, y la revisión antes de cada push", ic: "candado", tituloSize: 26 });
    D.codigo(s, `node_modules/
artifacts/
cache/
coverage/
types/
ignition/deployments/chain-31337/
.env
*.log`, { x: M, y: 1.9, w: 4.4, h: 3.2, lang: "js", titulo: ".gitignore del curso", size: 12 });
    D.tabla(s, ["nunca se sube", "por qué"], [
      ["Claves privadas y frases semilla", "Vaciado en segundos. Y queda en el historial."],
      ["URLs de RPC con clave de API", "Otro consume su cuota o la usa a su nombre."],
      ["node_modules, artifacts, cache", "Se regeneran; pesan cientos de megas."],
      ["Datos personales (Ley 1581 de 2012)", "Ni en la cadena ni en el repositorio: solo hashes."],
    ], { x: M + 4.7, y: 1.9, w: CW - 4.7, h: 3.2, colW: [3.3, CW - 4.7 - 3.3], size: 11.5 });
    await D.ficha(s, { tipo: "seguridad", etiqueta: "La rutina antes de cada git push", x: M, y: 5.3, w: CW, h: 1.42, texto: "git status y git diff --staged. Leer cada archivo que va a subir. Si aparece un secreto: no se sube, se rota la clave y se avisa. Borrarlo en un commit posterior NO lo elimina del historial.", size: 12.5 });
    s.addNotes("4 minutos. El .gitignore es el real del repositorio del curso. ignition/deployments/chain-31337 (red local) se ignora; el de Sepolia (chain-11155111) SÍ se sube como evidencia. Recordar que con el keystore no hay .env con secretos; el .env está en la lista por si alguien trae la costumbre de otro proyecto.");
  }

  {
    const s = await D.lamina({ kicker: "C.3 · hasta la Sesión 9 · y la verificación", titulo: "El estado mínimo del repositorio", ic: "flecha", tituloSize: 28 });
    D.tabla(s, ["pieza", "estado mínimo esperado para la S9"], [
      ["Contrato principal", "Compila en Hardhat. Aplica al menos dos patrones de la Sesión 7."],
      ["Suite inicial", "Al menos 5 pruebas, con al menos una de cada familia de A.9 (incluido un borde)."],
      ["Secretos", "Ninguno en el repositorio. keystore configurado por quien despliega."],
      ["README", "Qué hace el proyecto, cómo instalarlo y cómo correr las pruebas, en cinco líneas."],
    ], { y: 1.9, h: 2.55, colW: [2.8, 9.293], size: 12 });
    await D.ficha(s, { tipo: "pregunta", etiqueta: "Verificación del bloque C · cada equipo, antes de salir", x: M, y: 4.65, w: CW, h: 2.07, texto: "1. ¿La URL de su repositorio ya está en el canal del curso?\n2. ¿Qué archivo de su repositorio podría filtrar un secreto si se descuidan?\n3. ¿Qué borde de su contrato principal van a probar primero, y por qué ese?", size: 13 });
    s.addNotes("5 minutos. Avance 1 (S13): contratos desplegados y verificados en Sepolia, cobertura ≥ 80 % y repositorio documentado. Desde hoy se espera que maten a sus propios mutantes: en la S9 la auditoría cruzada lo va a intentar por ellos.");
  }

  await D.preguntaSemana({
    pregunta: "Si una suite con 88 % de cobertura dejó pasar tres errores, ¿qué número o qué evidencia le pedirían a un proveedor para creerle que su contrato está bien probado?",
    trabajo: [
      "Evidencia del laboratorio 08: suite, cobertura, mutantes muertos con su explicación, y Recaudo verificado en Sepolia.",
      "Trabajo autónomo: el proyecto en la estructura de C.1, con el contrato principal compilando y 5 pruebas.",
      "Traer el refactor de CertificadosUSB de la S7, ahora con su suite corriendo en Hardhat.",
      "Crear cuenta en ethernaut.openzeppelin.com y resolver el nivel 0: la Sesión 9 empieza en el 1.",
    ],
    notas: "La pregunta prepara la conversación de auditorías de la Sesión 9: cobertura, mutación, fuzzing, análisis estático, verificación formal y auditoría externa son evidencias distintas y complementarias.",
  });

  {
    const s = await D.cierre({
      frase: "Una prueba verde no demuestra nada si también estaría verde con el error.",
      sub: "Hoy escribieron pruebas y las pusieron a prueba. La próxima sesión cambian de lado: van a atacar contratos ajenos para aprender a defender los propios.",
      proxima: "Sesión 9 · Seguridad de contratos · Ethernaut · parcial práctico",
    });
    s.addNotes("Cierre (1 minuto). Recordar el parcial práctico de la S9: en máquina, libro abierto, con este mismo entorno. Quien no tenga el entorno funcionando hoy, lo resuelve esta semana.");
  }

  return D.guardar(path.join(__dirname, "Sesion-08-Blockchain-Web3.pptx"));
}

construir().catch(e => { console.error(e); process.exit(1); });
