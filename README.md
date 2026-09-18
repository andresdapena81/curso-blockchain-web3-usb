# Blockchain y Web 3.0 · Curso completo de pregrado

**Universidad de San Buenaventura Medellín · Ingeniería de Sistemas / Software**
Material abierto de un curso electivo de un semestre: 17 sesiones, 51 horas presenciales.

> **Documento vivo.** Este material se sigue mejorando semestre a semestre. Las afirmaciones sensibles al tiempo —consumo energético, regulación colombiana, versiones de herramientas— hay que **verificarlas antes de dictar**; el propio material señala dónde.

---

## Qué es esto

Un curso completo, no un temario. Incluye las presentaciones, los laboratorios con código que corre y se prueba solo, las guías paso a paso y el plan de estudio con su mapa de resultados de aprendizaje.

La tesis pedagógica del curso, que atraviesa las 17 sesiones:

> **La habilidad más valiosa no es escribir Solidity. Es saber cuándo NO usar blockchain, y poder defender esa decisión.**

Por eso el material insiste en verificar en vez de creer: los estudiantes comprueban que el whitepaper de Bitcoin **no contiene la palabra «blockchain»**, descubren con código que su tabla de confirmaciones **subestima el riesgo**, y auditan un caso real (Estonia) donde la fuente oficial contiene el argumento de sus críticos.

## Contenido

| Unidad | Sesiones | Eje |
|---|---|---|
| **I · Fundamentos** | 1–4 | Criptografía, estructura de la cadena, consenso |
| **II · Ethereum y contratos** | 5–9 | EVM, Solidity, pruebas, seguridad |
| **III · Web 3.0** | 10–13 | ERC-20/721, IPFS, frontend, integración |
| **IV · Ecosistema** | 14–17 | DeFi, DAOs, L2, regulación, proyecto final |

```
Plan-de-estudio-Blockchain-Web3.md   carta descriptiva completa, RA y evaluación
material/
├── Sesion-NN-Blockchain-Web3.pptx   las 17 presentaciones (y su versión .pdf)
├── build-sesion-NN.js               el código que genera cada presentación
├── lib/                             motor de decks con validación de maqueta
├── actividad-04-estonia/            actividad de investigación + guía en PDF
├── proyecto/                        proyecto integrador: anteproyecto, avances,
│                                    entrega final, ensayo, auditoría cruzada, planillas
├── laboratorio-02/ 03/ 04/          labs en Python y JavaScript (andamiaje + pruebas)
├── laboratorio-12/                  dApp en un archivo (ethers v6), como andamiaje
└── laboratorios-evm/                un solo proyecto Hardhat para las sesiones 5 a 16,
                                     con una guía en PDF por laboratorio
```

Cada laboratorio trae una **guía en PDF exageradamente detallada**: preparación desde cero, cada paso con su comando y la salida esperada, errores frecuentes, preguntas de reflexión y rúbrica.

## Las presentaciones se generan con código

No son archivos que se editan a mano: cada deck se **construye** con un script, sobre un sistema de diseño compartido que valida la maqueta automáticamente (avisa si un texto no cabe en su caja, si una tabla crece de más o si algo invade el pie).

```bash
cd material
npm install pptxgenjs sharp
node build-sesion-04.js        # genera Sesion-04-Blockchain-Web3.pptx
python lib/qa_deck.py Sesion-04-Blockchain-Web3.pptx   # control de calidad por render
```

## Los laboratorios

Todos traen pruebas automáticas: el laboratorio está terminado cuando pasan en verde.

| Lab | Tema | Cómo se corre |
|---|---|---|
| 02 | Hash y árboles de Merkle | Python y JavaScript · código de demostración, completo |
| 03 | Firmas digitales y mini-blockchain | Python y JavaScript |
| 04 | Minería y ataque del 51 % | Python |
| 05–11 | EVM y gas, Solidity, patrones, pruebas y mutantes, seguridad, ERC-20, NFT e IPFS | Hardhat |
| 12 | Frontend Web3 | HTML + ethers v6, sin herramientas de compilación |
| 13–16 | Firmas EIP-712, DeFi (AMM y oráculos), DAO con timelock y multisig, capa 2 | Hardhat |

```bash
cd material/laboratorios-evm
npm install
npx hardhat test
```

> **Los ejercicios vienen como andamiaje**, con sus funciones por completar: sus pruebas **fallan a propósito** hasta que se resuelven. Es el ejercicio, no un error. Hoy, en un clon limpio, `npx hardhat test` da 57 pruebas en verde y 97 en rojo, todas de las sesiones 06, 07, 10, 11, 13, 14 y 15. Lo mismo pasa con los laboratorios 03, 04 y 12.

## Versiones congeladas

Hardhat 3.16 · Solidity 0.8.28 · OpenZeppelin 5.6.1 · Node 22 LTS · Python 3.10+
Ver [`material/laboratorios-evm/versiones.md`](material/laboratorios-evm/versiones.md). No se cambian a mitad de semestre.

## El proyecto del docente

En este curso el docente también construye un proyecto, en paralelo con los estudiantes, para que vean el proceso y no solo el resultado:
**https://github.com/andresdapena81/entradas-reventa-controlada**

## Advertencias

- Todo el trabajo es en **red local o redes de prueba**. Nunca con dinero real.
- Los contratos son **material de clase, sin auditar**.
- Las billeteras creadas en clase son desechables; la frase de recuperación no se comparte con nadie.

## Licencia

- **Código** (contratos, laboratorios, scripts, generadores): [MIT](LICENSE).
- **Contenido** (presentaciones, guías, plan de estudio): [CC BY 4.0](LICENSE-CONTENIDO.md) — úsalo, adáptalo y compártelo, citando la fuente.

## Cómo citar

> Dapena, A. *Blockchain y Web 3.0 — material del curso.* Universidad de San Buenaventura Medellín. https://github.com/andresdapena81/curso-blockchain-web3-usb

---

Las soluciones de los laboratorios y las claves de evaluación no están aquí, por razones obvias. Si dictas el curso y las necesitas, escribe.
