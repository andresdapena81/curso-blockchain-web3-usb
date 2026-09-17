# Blockchain y Web 3.0 — Plan de Estudio
### Universidad de San Buenaventura · Pregrado en Ingeniería de Sistemas / Software

---

## 1. Identificación del curso

| Campo | Valor |
|---|---|
| Nombre del curso | Blockchain y Web 3.0 |
| Programa | Ingeniería de Sistemas / Ingeniería de Software |
| Nivel | Pregrado — electiva de profundización (recomendado 7.º–9.º semestre) |
| Créditos académicos | 3 (propuesto) |
| Horas presenciales | 51 h — 17 sesiones × 3 h |
| Horas de trabajo autónomo | 93 h — ≈ 5,5 h/semana |
| Modalidad | Presencial con laboratorio en sala de cómputo |
| Código / NRC | _(por asignar)_ |

> **Nota:** los campos institucionales (código, NRC, porcentajes de corte) deben ajustarse al reglamento académico vigente de la USB. Todo lo demás está listo para usarse.

---

## 2. Justificación

La tecnología blockchain dejó de ser una curiosidad criptográfica para convertirse en infraestructura de sistemas productivos: liquidación de pagos, trazabilidad de cadenas de suministro, identidad digital, tokenización de activos y registros públicos verificables. Para un ingeniero de sistemas, esto introduce un modelo de computación nuevo —**estado compartido, replicado, verificable y resistente a la censura**— con restricciones de diseño (costo por operación, inmutabilidad del código desplegado, adversarios económicamente motivados) que no aparecen en el desarrollo de software tradicional.

El curso no busca formar entusiastas de las criptomonedas. Busca que el estudiante **entienda el mecanismo**, sepa **cuándo blockchain es la solución correcta y cuándo no lo es**, y sea capaz de **diseñar, programar, probar, auditar y desplegar** una aplicación descentralizada completa con criterios profesionales de seguridad.

---

## 3. Resultados de aprendizaje (RA)

Al finalizar el curso, el estudiante estará en capacidad de:

| # | Resultado de aprendizaje | Nivel (Bloom) | Se evalúa en |
|---|---|---|---|
| **RA1** | Explicar los fundamentos criptográficos (hash, firma digital, árboles de Merkle) que sustentan la integridad de un registro distribuido. | Comprender | Quiz 1, Lab S2–S3 |
| **RA2** | Comparar mecanismos de consenso y justificar la elección de una arquitectura (pública, privada, permisionada) frente a un problema concreto. | Analizar | Quiz 1, Anteproyecto |
| **RA3** | Programar contratos inteligentes en Solidity aplicando patrones de diseño y estándares de la industria (ERC-20, ERC-721, OpenZeppelin). | Aplicar / Crear | Labs S6–S11, Proyecto |
| **RA4** | Construir una suite de pruebas automatizadas y desplegar contratos verificados en una red de prueba usando un entorno profesional (Hardhat/Foundry). | Aplicar | Parcial práctico, Proyecto |
| **RA5** | Identificar y remediar vulnerabilidades típicas de contratos inteligentes mediante análisis manual y herramientas automatizadas. | Evaluar | Ethernaut, Auditoría cruzada |
| **RA6** | Integrar una interfaz Web 3.0 con contratos on-chain y almacenamiento descentralizado, gestionando wallets, eventos y estados de transacción. | Crear | Proyecto final |
| **RA7** | Evaluar críticamente las implicaciones económicas, regulatorias, éticas y ambientales de una solución basada en blockchain, con referencia al marco colombiano. | Evaluar | Ensayo, Sustentación |

---

## 4. Perfil de entrada y prerrequisitos

**Requeridos**
- Programación orientada a objetos (Java, C#, Python o equivalente).
- Estructuras de datos: listas enlazadas, árboles, tablas hash.
- Manejo de línea de comandos y control de versiones con Git.
- Nociones de redes y arquitecturas cliente-servidor.

**Deseables (no bloqueantes)**
- JavaScript / TypeScript y `npm`.
- Fundamentos de desarrollo web (HTML, React).
- Bases de criptografía o seguridad informática.

> **Nivelación:** la Sesión 12 asume React básico. Se entrega en la Sesión 9 un tutorial guiado de nivelación (≈4 h de trabajo autónomo) para quienes no hayan visto frontend moderno.

---

## 5. Metodología

Cada sesión de 3 horas se organiza en tres bloques:

| Bloque | Duración | Qué ocurre |
|---|---|---|
| **A — Conceptual** | 60–75 min | Exposición dialogada. Cierra siempre con una pregunta abierta o un caso real (exploit, proyecto, decisión de diseño). |
| **B — Laboratorio guiado** | 75–90 min | Trabajo en máquina, en parejas. El docente circula. Todo laboratorio produce un artefacto verificable (contrato desplegado, hash de transacción, repositorio). |
| **C — Proyecto / cierre** | 20–30 min | Avance del proyecto integrador, dudas, y "pregunta de la semana" para trabajo autónomo. |

**Principios metodológicos**
- **Todo se despliega.** Ningún concepto se queda en la diapositiva: si se explica gas, el estudiante mide gas; si se explica reentrancy, el estudiante la explota.
- **Aprendizaje basado en proyecto.** Un único proyecto integrador atraviesa el semestre en cuatro entregas incrementales.
- **Auditoría entre pares.** Los equipos revisan el código de otro equipo en dos momentos del curso; leer código ajeno es parte de la competencia.
- **Testnet siempre.** No se usa dinero real en ninguna actividad. Redes de prueba (Sepolia y un L2 de prueba) y faucets institucionales.

---

## 6. Estructura general

| Unidad | Sesiones | Horas | Eje |
|---|---|---|---|
| **I. Fundamentos de sistemas distribuidos confiables** | 1–4 | 12 h | Criptografía, estructura de la cadena, consenso |
| **II. Ethereum y contratos inteligentes** | 5–9 | 15 h | EVM, Solidity, testing, seguridad |
| **III. Web 3.0: tokens, dApps e infraestructura** | 10–13 | 12 h | ERC-20/721, IPFS, frontend, integración |
| **IV. Ecosistema, escalabilidad y contexto** | 14–17 | 12 h | DeFi, DAOs, L2, regulación, proyecto final |

---

## 7. Cronograma detallado — 17 sesiones

### UNIDAD I — Fundamentos de sistemas distribuidos confiables

---

#### Sesión 1 — ¿Qué problema resuelve realmente blockchain?
**Objetivo:** Situar blockchain como respuesta al problema del doble gasto y de la confianza sin intermediario, y ubicar Web 3.0 en la evolución de la web.

**Contenidos**
- El problema del doble gasto y por qué el dinero digital fracasó antes de 2008.
- Confianza: intermediarios centralizados vs. verificación distribuida.
- Antecedentes: cypherpunks, Hashcash, b-money, bit gold → whitepaper de Bitcoin (2008).
- Taxonomía: cadenas públicas, privadas, permisionadas, consorcio.
- Web 1.0 (leer) → Web 2.0 (escribir, plataformas) → Web 3.0 (poseer, protocolos).
- **Cuándo NO usar blockchain:** árbol de decisión honesto. Si hay una autoridad central confiable y no hay adversario, una base de datos es mejor.

**Contenidos — Bloque B (min 115–172)**
- **B.1 · El ecosistema:** los siete actores que sostienen una red pública y el poder real de cada uno —validadores, nodos completos, desarrolladores de protocolo, usuarios, intercambios centralizados, proveedores de acceso y reguladores—. Nodo completo vs. nodo ligero. La descentralización como **vector de seis dimensiones** (consenso, cliente, acceso, capital, gobernanza, desarrollo), no como propiedad binaria. Introducción conceptual al MEV.
- **B.2 · Mapa del territorio:** Bitcoin y Ethereum como respuestas a problemas distintos. Turing-completitud y su consecuencia (el gas). Qué significa ser compatible con la EVM y por qué proliferan las cadenas parecidas. Capa 1 y capa 2. Justificación de la elección tecnológica del curso.
- **B.3 · Adopción real:** qué encontró uso sostenido después de quince años y qué no, con la evidencia en lugar de la promesa. Cada fracaso mapeado al paso del árbol de decisión donde muere. Contexto latinoamericano y colombiano.
- **B.4 · Taller de casos:** grupos de tres. Aplicar el árbol de A.7 a tres casos, responder por el oráculo y la arquitectura, y defenderlo en plenaria.

> **Sesión íntegramente teórica: sin computadores, sin laboratorio y sin entregable.** El primer día se dedica por completo a construir el modelo mental, sin pelear con instalaciones ni permisos de red. La demostración en vivo de billeteras y explorador de bloques abre la Sesión 2; la billetera propia de cada estudiante se instala de forma guiada en la Sesión 5 y se vuelve indispensable en la Sesión 6.

**Trabajo autónomo** — *se exige, no se recoge*: leer el whitepaper de Bitcoin (secciones 1–5); verificar que el equipo personal tenga Python 3 o Node.js operativo para la Sesión 2; pensar la pregunta de la semana. Se verifica en la plenaria de apertura de la Sesión 2, en voz alta.
**Evidencia:** ninguna. La sesión no se califica.

---

#### Sesión 2 — Integridad verificable: hash y árboles de Merkle
**Objetivo:** Dominar las primitivas de integridad que hacen verificable un registro distribuido, e implementarlas desde cero.

**Bloque A · Demostración en vivo (min 10–55)** — *proyectada por el docente, sin entregable*
Siete demostraciones encadenadas: creación de una identidad desde cero, exhibición y restauración de una frase semilla con billetera desechable, anatomía de una dirección, cambio entre red principal y red de prueba, pantalla de firma, recorrido campo por campo del explorador de bloques, y consulta del historial público de un desconocido. Aterriza en datos concretos todo lo discutido en abstracto en la Sesión 1, y motiva directamente la criptografía que sigue.

**Bloque B · Billetera propia (min 55–70)** — *cada estudiante replica lo que acaba de ver*
Instalación guiada de la billetera personal, en el momento de máxima comprensión y con las máquinas ya abiertas para el laboratorio. Custodia de la frase semilla en papel, red de prueba y fondos. Queda lista para el despliegue de la Sesión 6, sin volver a gastar tiempo de clase en ello.

**Contenidos (min 70–105)**
- Funciones hash: SHA-256 y Keccak-256. Qué son y qué **no** son —no son cifrado ni compresión: no hay vuelta atrás y no se recupera la entrada—.
- Propiedades exigibles: determinismo, efecto avalancha, resistencia a preimagen, a segunda preimagen y a colisiones.
- Árboles de Merkle: construcción, raíz, pruebas de inclusión y por qué el costo es logarítmico y no lineal.
- Uso real: la raíz en la cabecera del bloque, la verificación desde un cliente ligero y las listas de distribución.

**Bloque D · El código, en vivo (min 120–170)** — *la implementación se entrega completa*
Se recorre la solución función por función —hash y efecto avalancha, la línea donde viven las tres convenciones, el bucle que construye el árbol, y la generación y verificación de la prueba—, los estudiantes la ejecutan en sus máquinas, comprueban que reproducen la raíz de referencia y la rompen alterando un dato. Se proyecta además el **visor de árboles de Merkle**, que implementa las mismas convenciones y sirve para contrastar resultados.

> **Decisión pedagógica.** El nivel de programación del grupo es heterogéneo y cincuenta minutos no alcanzan para escribir esto desde cero sin que la mitad se quede atrás. Leer código ajeno y entenderlo *sí* es una competencia profesional exigible hoy; escribirlo desde cero, todavía no. El andamiaje con TODO y su suite de pruebas se entrega igualmente, como ejercicio opcional para quien lo quiera.

**Evidencia de la sesión:** ninguna calificable. Se comprueba en la plenaria de apertura de la Sesión 3 que ejecutaron el código y reprodujeron la raíz.

**📌 Trabajo del semestre — se encarga aquí:** construir una **interfaz web** sobre este código. Mínimo exigible: entrada de varios datos, raíz visible, que cambie al editar un dato, y que se vea la estructura del árbol. Suma —sin ser obligatorio— la prueba de inclusión, la verificación paso a paso y el rechazo de un elemento ajeno. Tecnología libre. Atiende el RA6 y se retoma en la Sesión 12.

> **Movimiento respecto a la versión 1 del plan.** La firma digital y la derivación de dirección salen de esta sesión y pasan a la Sesión 3. La demostración de apertura consume 45 minutos, y sostener hash, Merkle *y* ECDSA en el tiempo restante obligaba a dictar las tres a medias. Separarlas también mejora la secuencia lógica: la Sesión 2 responde «¿cómo sé que un dato no fue alterado?» y la Sesión 3 responde «¿cómo sé quién lo escribió?».

---

#### Sesión 3 — Firmas digitales y anatomía de la cadena
**Objetivo:** Probar autoría sin revelar el secreto, y construir una blockchain mínima con transacciones firmadas.

**Contenidos**
- Criptografía asimétrica: la función de un solo sentido, el problema del logaritmo discreto sobre curva elíptica y la curva `secp256k1`.
- Par de claves: por qué de la pública no se recupera la privada. Se salda aquí la deuda enunciada en la Sesión 1.
- **ECDSA:** firma y verificación. Qué prueba una firma —autoría e integridad— y qué **no** prueba: ni identidad legal, ni intención, ni momento.
- De clave pública a dirección: Keccak-256 y el checksum de EIP-55.
- Estructura de un bloque: cabecera, hash del padre, raíz de Merkle, marca temporal, nonce.
- Encadenamiento e inmutabilidad: por qué modificar el bloque *n* invalida todo lo posterior.
- Red P2P: propagación, mempool, y el papel de los nodos completos frente a los ligeros (retoma B.1 de la Sesión 1).

**Laboratorio**
- Firmar y verificar mensajes; derivar la dirección desde la clave pública y comprobar el checksum de EIP-55.
- **Mini-blockchain con transacciones firmadas** (≈200 líneas): clase `Block`, encadenamiento, prueba de trabajo con dificultad ajustable, validación de firmas y de saldos.
- Alterar un bloque intermedio y observar la invalidación en cascada; medir el costo de "reminar" la cadena.

**Trabajo autónomo:** implementar la propagación entre dos instancias locales y resolver el conflicto por longitud de cadena.
**Evidencia:** repositorio con la mini-blockchain funcional.

> **Movimiento respecto a la versión 1.** Entra la firma digital desde la Sesión 2. Para hacerle sitio salen dos temas: el modelo UTXO frente al de cuentas pasa a la **Sesión 5**, donde encaja de forma natural al introducir el modelo de cuentas de Ethereum; y las bifurcaciones, reorganizaciones y finalidad pasan a la **Sesión 4**, que es donde se explica el consenso que las produce.

---

#### Sesión 4 — Consenso, incentivos y el trilema
**Objetivo:** Comparar mecanismos de consenso y justificar una elección arquitectónica.

**Contenidos**
- Problema de los generales bizantinos; tolerancia a fallas bizantinas (BFT).
- **Proof of Work:** minería, ajuste de dificultad, tasa de hash, ataque del 51 %, costo energético real.
- **Proof of Stake:** el modelo de Ethereum post-Merge, validadores, *slashing*, finalidad, riesgos de centralización por *staking* líquido.
- Otros: PoA, PBFT, DPoS — y dónde tiene sentido cada uno.
- Teoría de juegos: por qué la honestidad es la estrategia dominante.
- **Bifurcaciones:** por qué el consenso produce cadenas competidoras. Reorganizaciones, bifurcaciones blandas y duras, y qué significa la finalidad en cada mecanismo. *(Entra desde la Sesión 3: son consecuencia directa del consenso y no se pueden explicar antes de tenerlo.)*
- **Trilema de escalabilidad:** descentralización, seguridad, escalabilidad — elija dos.

**Laboratorio**
- Simulador de minería: variar dificultad y medir tiempo/energía de bloque.
- Simulación del ataque del 51 % sobre la mini-blockchain de la S3.
- Taller comparativo: dado un caso (trazabilidad de café, historia clínica, votación gremial), justificar arquitectura y consenso.

**Trabajo autónomo:** preparar la propuesta de proyecto.
**📌 Evaluación:** **Quiz 1 (Unidad I)** — 30 min al cierre.

---

### UNIDAD II — Ethereum y contratos inteligentes

---

#### Sesión 5 — Ethereum y la Máquina Virtual (EVM)
**Objetivo:** Entender Ethereum como una máquina de estados replicada y saber leer el costo real de una transacción.

**Contenidos**
- De Bitcoin (dinero programable limitado) a Ethereum (computación de propósito general).
- **Modelo UTXO frente a modelo de cuentas:** cómo representa cada uno el estado y qué implica en la práctica —privacidad, paralelismo, facilidad para programar—. *(Entra desde la Sesión 3: se entiende mucho mejor comparándolo con el modelo de cuentas en el momento de presentarlo.)*
- Estado global: cuentas EOA vs. cuentas de contrato; `nonce`, `balance`, `storage`, `code`.
- Anatomía de una transacción: `to`, `value`, `data`, `gasLimit`, firma.
- **Gas:** por qué existe, unidades, `gasPrice`, EIP-1559 (`baseFee` + `priorityFee`), quema de ETH.
- La EVM: pila de 256 bits, opcodes, costo por operación; `storage` vs. `memory` vs. `calldata` y su impacto en el costo.
- Ciclo de vida de una transacción: firma → mempool → inclusión → confirmación.

**Laboratorio**
- Análisis forense de transacciones reales en el explorador: identificar tipo, descomponer costos, leer `input data` decodificado, interpretar logs de eventos.
- Ejercicio de estimación: predecir el costo en gas de tres operaciones y contrastar con la medición.
- **Punto de control de billeteras** (5 min): verificar que todos conservan la billetera creada en la Sesión 2 y que tiene fondos de prueba. Quien la haya perdido la rehace ahora, no en la Sesión 6.

**Trabajo autónomo:** lectura de la documentación de Solidity (secciones introductorias).
**Evidencia:** informe corto de análisis de tres transacciones.

---

#### Sesión 6 — Solidity I: fundamentos del contrato inteligente
**Objetivo:** Escribir, desplegar y verificar un primer contrato funcional en testnet.

**Contenidos**
- Estructura de un archivo Solidity: licencia SPDX, `pragma`, `contract`.
- Tipos de datos: `uint`, `int`, `address`, `bool`, `bytes`, `string`.
- Variables de estado y almacenamiento persistente (¡y su costo!).
- Funciones: visibilidad (`public`, `private`, `internal`, `external`), mutabilidad (`view`, `pure`, `payable`).
- Variables globales: `msg.sender`, `msg.value`, `block.timestamp`.
- Control de errores: `require`, `revert`, errores personalizados, `assert`.
- Eventos y logs: por qué son la forma barata de comunicar estado al exterior.
- Constructor y modificadores (`modifier`).

**Laboratorio**
- En Remix: contrato **"Registro de Certificados Académicos"** — emitir, consultar y revocar un certificado, con control de acceso y eventos.
- Compilar, desplegar en Sepolia, interactuar desde Remix y desde el explorador.

**Trabajo autónomo:** completar los ejercicios de CryptoZombies (lecciones 1–2).
**📌 Entrega:** **Anteproyecto** — propuesta de dApp (problema, usuarios, por qué blockchain, alcance, equipo de 3).

---

#### Sesión 7 — Solidity II: estructuras de datos y patrones de diseño
**Objetivo:** Manejar estructuras compuestas y aplicar patrones seguros de manejo de fondos.

**Contenidos**
- `mapping`, arreglos dinámicos y fijos, `struct`, `enum`; el problema de iterar mappings.
- Herencia, contratos abstractos, `interface`, `library`, `using for`.
- Manejo de Ether: `payable`, `transfer` / `send` / `call` — cuál usar y por qué.
- Funciones `receive` y `fallback`.
- **Patrones:** `Ownable` (control de acceso), *withdrawal pattern* (retiro en lugar de envío), *circuit breaker* / pausable, *pull over push*.
- Optimización de gas: empaquetado de variables, `constant` / `immutable`, `calldata` en parámetros externos.

**Laboratorio**
- Contrato de **subasta o crowdfunding** con: registro de participantes, manejo de fondos, retiro seguro de perdedores, cierre por tiempo y evento de finalización.
- Ejercicio comparativo de gas: misma lógica con `push` vs. `pull`.

**Trabajo autónomo:** refactorizar el contrato de certificados aplicando dos patrones vistos.
**Evidencia:** contrato desplegado + informe de decisiones de diseño.

---

#### Sesión 8 — Entorno profesional: Hardhat, pruebas y despliegue
**Objetivo:** Salir del navegador y trabajar con el flujo real de un equipo de desarrollo blockchain.

**Contenidos**
- Limitaciones de Remix; por qué se necesita un entorno local.
- **Hardhat** (o Foundry como alternativa): estructura del proyecto, `hardhat.config`, red local, `console.log` en Solidity.
- Gestión de dependencias con `npm`; instalación de OpenZeppelin.
- **Pruebas automatizadas:** Mocha/Chai, `ethers` en tests, *fixtures*, simulación de cuentas y de tiempo, pruebas de casos de reversión, cobertura de código.
- Scripts de despliegue parametrizados; configuración de redes; variables de entorno y manejo de claves privadas (nunca en el repositorio).
- Verificación del código fuente en el explorador de bloques.

**Laboratorio**
- Migrar el contrato de la S7 a un proyecto Hardhat.
- Escribir una suite de al menos 10 pruebas (casos felices + casos de reversión + eventos) y alcanzar ≥ 80 % de cobertura.
- Desplegar con script a Sepolia y verificar el código fuente.

**Trabajo autónomo:** llevar los contratos del proyecto a la estructura Hardhat.
**Evidencia:** repositorio con suite de pruebas verde y contrato verificado.

---

#### Sesión 9 — Seguridad de contratos inteligentes
**Objetivo:** Identificar, explotar y remediar las vulnerabilidades más frecuentes.

**Contenidos**
- Por qué la seguridad es distinta aquí: el código es inmutable, público y custodia valor directamente.
- **Taxonomía de vulnerabilidades:**
  - Reentrancy — caso *The DAO*, 2016.
  - Control de acceso ausente o mal implementado; `tx.origin` vs. `msg.sender`.
  - `delegatecall` no protegido — caso *Parity multisig*.
  - Desbordamiento aritmético (y qué cambió con Solidity 0.8).
  - Dependencia de `block.timestamp` y de aleatoriedad on-chain.
  - Front-running / MEV.
  - Manipulación de oráculos y de precios spot.
  - Denegación de servicio por bucles no acotados o por receptor que revierte.
- **Defensas:** patrón Checks-Effects-Interactions, `ReentrancyGuard`, uso de OpenZeppelin en lugar de código propio, límites de gas, invariantes.
- Ciclo de vida seguro: pruebas, análisis estático (Slither), *fuzzing*, auditoría externa, programas de recompensas, mecanismos de actualización (proxies) y sus propios riesgos.

**Laboratorio**
- **CTF Ethernaut:** resolver los niveles *Fallback*, *Fal1out*, *Token*, *Re-entrancy* y *Force*.
- Análisis estático con Slither sobre el contrato propio.
- **Auditoría cruzada #1:** cada equipo audita el contrato de otro equipo y entrega hallazgos clasificados por severidad.

**📌 Evaluación:** **Parcial práctico** — dado un contrato vulnerable, identificar el fallo, explotarlo y entregar la versión corregida (90 min, en máquina, libro abierto).

---

### UNIDAD III — Web 3.0: tokens, dApps e infraestructura

---

#### Sesión 10 — Tokens fungibles: el estándar ERC-20
**Objetivo:** Implementar un token fungible conforme al estándar y comprender la mecánica de aprobaciones.

**Contenidos**
- Qué es un estándar (EIP/ERC) y por qué la interoperabilidad depende de él.
- Interfaz ERC-20: `totalSupply`, `balanceOf`, `transfer`, `approve`, `allowance`, `transferFrom`.
- El patrón *approve + transferFrom*: por qué existe, cómo lo usan los DEX, y el riesgo de las aprobaciones ilimitadas.
- Decimales: por qué no hay punto flotante y cómo se representa el valor.
- Implementación con OpenZeppelin: `ERC20`, extensiones `Burnable`, `Pausable`, `Capped`, `Permit` (EIP-2612).
- **Tokenómica básica:** oferta fija vs. inflacionaria, emisión, quema, *vesting*, distribución inicial. Qué distingue un diseño sostenible de un esquema extractivo.

**Laboratorio**
- Crear un token ERC-20 institucional con OpenZeppelin (suministro, minteo controlado, quema).
- Desplegar en Sepolia, verificar, importar en MetaMask, transferir entre compañeros.
- Ejercicio de `approve` / `transferFrom` con un contrato intermediario; revocar una aprobación.

**Trabajo autónomo:** diseñar la tokenómica del proyecto (si aplica) o justificar por qué no lleva token.
**Evidencia:** token desplegado y verificado.

---

#### Sesión 11 — NFTs, ERC-721/1155 y almacenamiento descentralizado
**Objetivo:** Implementar tokens no fungibles con metadata descentralizada y evaluar casos de uso serios.

**Contenidos**
- No fungibilidad: identidad única on-chain. ERC-721 vs. ERC-1155 (semi-fungible, lotes).
- Metadata: `tokenURI`, esquema JSON, la diferencia entre "el NFT" y "el archivo".
- **Almacenamiento descentralizado:** IPFS (direccionamiento por contenido, CID, *pinning*), Arweave, y por qué una URL centralizada rompe la promesa de permanencia.
- Regalías y EIP-2981; el debate sobre su cumplimiento.
- **Casos de uso más allá del arte:** credenciales académicas verificables, trazabilidad de producto, tickets, licencias, membresías, tokens de suelo o de activos reales (RWA).
- Límites y críticas honestas del mercado NFT.

**Laboratorio**
- Contrato ERC-721 con OpenZeppelin: minteo, `tokenURI`, control de suministro.
- Subir imágenes y JSON de metadata a IPFS (Pinata o equivalente); obtener CIDs.
- Mintear la colección en testnet y visualizarla en un marketplace de prueba.
- **Caso aplicado:** modelar el diploma de la USB como credencial verificable — ¿ERC-721, ERC-1155 o SBT? Discusión de trade-offs.

**Trabajo autónomo:** avance del proyecto — contratos completos.
**Evidencia:** colección NFT visible en marketplace de testnet.

---

#### Sesión 12 — Web 3.0: conectando el frontend a la cadena
**Objetivo:** Construir una interfaz que lea y escriba en contratos, gestionando wallet y estados de transacción.

**Contenidos**
- Arquitectura de una dApp: frontend ↔ proveedor RPC ↔ nodo ↔ contrato. Qué parte está realmente descentralizada.
- Proveedores: nodo propio vs. servicios de infraestructura (Infura, Alchemy); claves de API y límites de tasa.
- **ethers.js / viem:** `Provider`, `Signer`, `Contract`, ABI. Llamadas de lectura (gratis) vs. transacciones (cuestan gas).
- Stack moderno: `wagmi` + `RainbowKit` para conexión de wallets.
- Escucha de eventos y actualización reactiva de la interfaz.
- **UX de Web3:** estados de una transacción (pendiente, minada, revertida), red incorrecta, wallet no instalada, rechazo del usuario, tiempos de confirmación. El error más común de los principiantes es asumir que la transacción es instantánea y exitosa.

**Laboratorio**
- Aplicación React que se conecta a MetaMask, muestra la dirección y el saldo.
- Leer el `balanceOf` del token de la S10 y ejecutar una transferencia desde la interfaz.
- Manejar los cuatro estados de error mencionados con retroalimentación visible al usuario.

**Trabajo autónomo:** integrar el frontend con los contratos del proyecto.
**Evidencia:** repositorio del frontend funcional.

---

#### Sesión 13 — Integración full-stack e infraestructura del ecosistema
**Objetivo:** Cerrar el ciclo de la dApp e incorporar servicios de infraestructura descentralizada.

**Contenidos**
- Indexación de datos: por qué consultar la cadena directamente no escala; The Graph y subgrafos; alternativa con logs de eventos.
- ENS: nombres legibles en lugar de direcciones hexadecimales.
- Firmas fuera de la cadena: EIP-712 (datos estructurados), autenticación "Sign-In with Ethereum" sin contraseñas.
- *Account abstraction* (ERC-4337): wallets inteligentes, transacciones patrocinadas, recuperación social — panorama y por qué importa para la adopción.
- Despliegue del frontend en infraestructura descentralizada (IPFS + ENS) vs. hosting tradicional.
- Buenas prácticas de repositorio, documentación y README para un proyecto Web3.

**Laboratorio**
- Sesión de integración asistida: cada equipo conecta contratos + frontend + metadata en IPFS.
- Implementar autenticación por firma EIP-712.
- Revisión técnica del docente equipo por equipo.

**📌 Entrega:** **Avance 1 del proyecto** — contratos desplegados y verificados en testnet + suite de pruebas (≥ 80 % cobertura) + repositorio documentado.

---

### UNIDAD IV — Ecosistema, escalabilidad y contexto

---

#### Sesión 14 — DeFi: finanzas descentralizadas
**Objetivo:** Comprender las primitivas financieras on-chain y sus riesgos técnicos.

**Contenidos**
- Qué es DeFi y qué problema dice resolver; composabilidad ("dinero lego").
- **AMMs:** el modelo de producto constante `x · y = k`; pools de liquidez, *slippage*, proveedores de liquidez, **pérdida impermanente** (con ejercicio numérico).
- **Préstamos:** sobrecolateralización, factor de salud, liquidaciones (Aave/Compound como referencia).
- **Stablecoins:** colateralizadas en fiat, colateralizadas en cripto, algorítmicas. Análisis del colapso de UST/Terra como caso de estudio de diseño fallido.
- **Oráculos:** el problema de traer datos externos a la cadena; Chainlink, *price feeds*, manipulación de oráculos.
- **Flash loans:** cómo funcionan y por qué son el vector de ataque más usado.
- Riesgos: contratos, oráculos, gobernanza, regulatorio. Rendimientos y de dónde salen realmente.

**Laboratorio**
- Interactuar con un DEX en testnet: aportar liquidez, intercambiar, medir slippage.
- Integrar un *price feed* de Chainlink en un contrato propio.
- Cálculo de pérdida impermanente en hoja de cálculo para tres escenarios de precio.

**Trabajo autónomo:** avance del proyecto.

---

#### Sesión 15 — DAOs, gobernanza e identidad descentralizada
**Objetivo:** Implementar un mecanismo de gobernanza on-chain y evaluar modelos de identidad.

**Contenidos**
- Qué es una DAO; espectro entre "multisig con marca" y gobernanza on-chain plena.
- **Multisig:** esquema *m-de-n*, Safe, cuándo es la respuesta correcta (casi siempre, al principio).
- **Gobernanza on-chain:** `ERC20Votes`, contrato `Governor`, ciclo propuesta → votación → *timelock* → ejecución; quórum, delegación.
- Modelos de votación: un token un voto, votación cuadrática, votación por convicción; el problema de la plutocracia y de la apatía del votante.
- Fallas reales de gobernanza: ataques de préstamo relámpago a la votación, captura por ballenas.
- **Identidad descentralizada:** DID, credenciales verificables, *Soulbound Tokens*, reputación on-chain. Tensión con el derecho al olvido y con el habeas data.

**Laboratorio**
- Desplegar `ERC20Votes` + `Governor` + `TimelockController`; crear una propuesta, delegar votos, votar y ejecutar.
- Configurar un multisig de prueba y ejecutar una transacción con dos firmantes.

**Trabajo autónomo:** ensayo individual (RA7) — ver Sección 8.

---

#### Sesión 16 — Escalabilidad, interoperabilidad y marco regulatorio
**Objetivo:** Evaluar soluciones de escalado y situar el proyecto en el contexto legal colombiano.

**Contenidos**
- Retomando el trilema: por qué la capa base no puede escalar sola.
- **Capa 2:** *rollups* optimistas (fraud proofs, período de retiro) vs. *rollups* de conocimiento cero (validity proofs); nociones de ZK sin matemática pesada. Sidechains y *state channels*.
- Comparativa de otras L1: arquitecturas alternativas y sus compromisos de diseño; qué significa "compatible con la EVM".
- **Puentes (bridges):** modelos de custodia, y por qué concentran los mayores robos históricos del ecosistema.
- **Marco regulatorio colombiano:** naturaleza jurídica de los criptoactivos; obligaciones de reporte ante la UIAF; tratamiento tributario ante la DIAN; el *sandbox* regulatorio de la Superintendencia Financiera; estado de la iniciativa legislativa sobre plataformas de intercambio.
- Panorama internacional: MiCA en la Unión Europea, obligaciones AML/KYC, el Travel Rule.
- ¿Es un contrato inteligente un contrato jurídico? Validez, ejecutabilidad y jurisdicción.
- Ética y sostenibilidad: huella energética antes y después del Merge, inclusión financiera real vs. narrativa, estafas y responsabilidad profesional del ingeniero.

> ⚠️ El marco regulatorio colombiano ha estado en evolución activa. **Verificar el estado vigente de la normativa antes de dictar esta sesión** y actualizar las referencias; se sugiere invitar a un profesional del área jurídica o financiera.

**Laboratorio**
- Desplegar el mismo contrato en un L2 de prueba y comparar costo y tiempo de confirmación frente a la L1. Tabla comparativa con datos propios.
- Taller: análisis regulatorio del proyecto propio — ¿qué obligaciones aplicarían si saliera a producción en Colombia?

**Trabajo autónomo:** preparación de la sustentación final.
**📌 Entrega:** **Avance 2** — dApp integrada y funcional (contratos + frontend).

---

#### Sesión 17 — Demo Day: sustentación de proyectos y cierre
**Objetivo:** Sustentar públicamente la solución construida y defenderla técnicamente.

**Estructura de la sesión**
- **Presentaciones (15 min por equipo + 5 min de preguntas):**
  1. Problema y por qué requiere blockchain (con honestidad: ¿lo requiere?).
  2. Arquitectura de la solución y decisiones de diseño.
  3. **Demostración en vivo** sobre testnet.
  4. Seguridad: vulnerabilidades consideradas y mitigaciones aplicadas.
  5. Limitaciones, costos estimados y trabajo futuro.
- **Auditoría cruzada #2:** cada equipo formula al menos una pregunta técnica al equipo evaluado; se califica la calidad de la pregunta.
- **Cierre del curso (30 min):** retrospectiva, mapa de rutas de profundización (seguridad y auditoría, ZK, infraestructura de protocolo, producto Web3), certificaciones y comunidades, oportunidades de trabajo de grado y semilleros.

**📌 Entrega:** **Proyecto final completo** — repositorio, contratos verificados, dApp desplegada, documentación técnica y video demostrativo de respaldo (3 min).

---

## 8. Proyecto integrador

Equipos de **3 estudiantes**. Un solo proyecto que evoluciona durante todo el semestre.

### Entregas

| Entrega | Sesión | Contenido | Peso |
|---|---|---|---|
| **Anteproyecto** | S6 | Problema, usuarios, justificación de por qué blockchain, alcance, arquitectura preliminar, equipo. Máx. 3 páginas. | 5 % |
| **Avance 1** | S13 | Contratos desplegados y verificados en Sepolia + suite de pruebas (≥ 80 % cobertura) + repositorio documentado. | 10 % |
| **Avance 2** | S16 | dApp integrada: frontend conectado, flujo completo funcional, metadata en IPFS si aplica. | 10 % |
| **Entrega final + sustentación** | S17 | Producto completo, documentación técnica, video demo, sustentación y defensa. | 15 % |

### Ejemplos de proyectos viables (alcance de un semestre)
- Registro verificable de certificados y diplomas de la universidad.
- Trazabilidad de cadena de suministro para un producto agrícola colombiano (café, cacao).
- Sistema de votación para elecciones estudiantiles con verificabilidad pública.
- Marketplace de tickets con reventa controlada por contrato.
- Tesorería comunitaria con gobernanza multisig para un semillero.
- Registro de propiedad intelectual con sellado temporal.
- Programa de fidelización interoperable entre comercios.

### Rúbrica de evaluación del proyecto final

| Criterio | Peso | Excelente (5,0) | Aceptable (3,5) | Insuficiente (< 3,0) |
|---|---|---|---|---|
| **Pertinencia de la solución** | 15 % | Justifica con rigor por qué blockchain es necesaria; descarta alternativas centralizadas con argumentos. | Justificación razonable pero superficial. | Usa blockchain sin necesidad real; una base de datos resolvería mejor. |
| **Calidad de los contratos** | 25 % | Código limpio, modular, estándares aplicados correctamente, gas optimizado, eventos bien diseñados. | Funciona, con estructura mejorable. | No compila, no cumple estándares o la lógica es incorrecta. |
| **Pruebas y despliegue** | 20 % | Cobertura ≥ 80 %, casos límite y de reversión probados, despliegue reproducible y verificado. | Pruebas de casos felices únicamente. | Sin pruebas o contrato no verificado. |
| **Seguridad** | 20 % | Análisis de vulnerabilidades documentado, mitigaciones implementadas y justificadas, análisis estático sin hallazgos críticos. | Identifica riesgos pero mitiga parcialmente. | Vulnerabilidades explotables evidentes. |
| **Integración e interfaz** | 10 % | dApp funcional, estados de transacción manejados, UX comprensible para un usuario no experto. | Funciona con fricciones. | No integra o falla en la demostración. |
| **Sustentación y documentación** | 10 % | Claridad, dominio técnico, responde con solvencia; README completo y reproducible. | Presentación correcta, dominio parcial. | No responde preguntas técnicas básicas. |

---

## 9. Sistema de evaluación

Propuesta ajustable al esquema de cortes del reglamento institucional.

| Corte | Sesiones | Componente | Peso parcial | Peso total |
|---|---|---|---|---|
| **Primer corte (30 %)** | S1–S6 | Quiz 1 (Unidad I) | 40 % | 12 % |
| | | Laboratorios S2–S5 (4 evidencias) | 40 % | 12 % |
| | | Anteproyecto | 20 % | 6 % |
| **Segundo corte (30 %)** | S7–S12 | Parcial práctico de seguridad (S9) | 45 % | 13,5 % |
| | | Laboratorios S7–S12 (6 evidencias) | 35 % | 10,5 % |
| | | Ethernaut + auditoría cruzada #1 | 20 % | 6 % |
| **Tercer corte (40 %)** | S13–S17 | Proyecto final (avances + entrega + sustentación) | 70 % | 28 % |
| | | Ensayo individual (RA7) | 20 % | 8 % |
| | | Laboratorios S14–S16 | 10 % | 4 % |

**Ensayo individual (S15 → entrega S17):** 1.500 palabras. Análisis crítico de una implicación del ecosistema —regulatoria, ética, económica o ambiental— aplicada al contexto colombiano. Se evalúa argumentación, uso de fuentes y postura propia sustentada. Se exige declaración del uso de herramientas de IA.

**Política de laboratorios:** cada laboratorio se entrega con evidencia verificable en cadena (hash de transacción o dirección de contrato) y repositorio Git. Sin evidencia on-chain, el laboratorio no se califica.

---

## 10. Requerimientos técnicos e infraestructura

### Sala de cómputo
- Node.js LTS y `npm`, con permisos de instalación de paquetes.
- Git y un editor de código (VS Code con extensiones de Solidity).
- Navegador Chrome/Firefox con permiso para instalar extensiones (MetaMask).
- **Salida a internet sin bloqueo** hacia: RPC públicos, faucets, IPFS gateways, registros de `npm` y GitHub.
- Python 3 (para los laboratorios de las sesiones 2 y 3).

> ⚠️ **Riesgo operativo principal:** las restricciones de red o de instalación en salas universitarias son la causa más frecuente de fracaso de este tipo de curso. **Verificar todo lo anterior con la dirección de TI antes de la Sesión 1**, y probar el flujo completo de la Sesión 8 en una máquina de la sala.

### Cuentas y servicios (todos con plan gratuito)
- Proveedor RPC (Infura o Alchemy) — una clave por estudiante o una institucional.
- Cuenta de explorador de bloques con API key (para verificación de contratos).
- Servicio de *pinning* IPFS (Pinata o equivalente).
- GitHub (cuenta educativa).

### Gestión de fondos de prueba
- **Nunca se usa dinero real.** Todo ocurre en redes de prueba.
- Los faucets públicos son intermitentes y suelen exigir saldo previo en la red principal. **Recomendación fuerte:** el docente mantiene una wallet institucional con ETH de prueba y distribuye a los estudiantes al inicio de cada unidad. Preparar esto **antes** de la Sesión 1.
- Plan B: red local de Hardhat con cuentas pre-financiadas, para cualquier laboratorio que no dependa de una red pública.

### Advertencia obligatoria a estudiantes (Sesión 1)
Las wallets creadas en clase son exclusivamente educativas. No deben usarse jamás con fondos reales, la frase semilla no se comparte con nadie —incluido el docente— y no se firma ninguna transacción cuyo contenido no se comprenda.

---

## 11. Bibliografía y recursos

### Textos base
- Antonopoulos, A. & Wood, G. *Mastering Ethereum: Building Smart Contracts and DApps.* O'Reilly. _(Disponible libremente en GitHub.)_
- Antonopoulos, A. *Mastering Bitcoin.* O'Reilly. _(Disponible libremente en GitHub.)_
- Narayanan, A. et al. *Bitcoin and Cryptocurrency Technologies.* Princeton University Press. _(Borrador de libre acceso.)_

### Documentos fundacionales
- Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System.*
- Buterin, V. (2014). *Ethereum White Paper.*
- Wood, G. *Ethereum: A Secure Decentralised Generalised Transaction Ledger* (Yellow Paper). _(Referencia, no lectura obligatoria.)_

### Lectura complementaria
- Werbach, K. *The Blockchain and the New Architecture of Trust.* MIT Press.
- Documentación oficial: Solidity, Hardhat/Foundry, OpenZeppelin Contracts, ethers.js/viem, wagmi.
- Repositorio de EIPs/ERCs (para consulta de estándares).

### Plataformas prácticas
- **Ethernaut** (OpenZeppelin) — CTF de seguridad. Núcleo de la Sesión 9.
- **CryptoZombies** — introducción gamificada a Solidity. Nivelación.
- **Speed Run Ethereum / Scaffold-ETH** — retos de dApp full-stack.
- **Damn Vulnerable DeFi** — opcional, para estudiantes avanzados.

> ⚠️ **Versiones:** el ecosistema cambia rápido. Antes de iniciar el semestre, fijar y documentar las versiones concretas de Solidity, Hardhat/Foundry y OpenZeppelin que se usarán, y verificar que los tutoriales enlazados sigan vigentes. Publicar un archivo `versiones.md` en el repositorio del curso y no cambiarlas a mitad de semestre.

---

## 12. Riesgos del curso y contingencias

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Restricciones de red o de instalación en la sala | Alta | Verificación previa con TI; plan B con Remix (solo navegador) y red local de Hardhat. |
| Faucets caídos o sin fondos | Alta | Wallet institucional con reserva de ETH de prueba; distribución dirigida. |
| Heterogeneidad en el nivel de JavaScript/React | Media | Tutorial de nivelación entregado en S9; laboratorios en parejas con emparejamiento deliberado. |
| Ruptura de tutoriales por cambios de versión | Media | Versiones congeladas y documentadas; laboratorios probados por el docente la semana previa. |
| Sesión perdida por calendario institucional | Media | Las sesiones 14 y 15 admiten compresión a una sola de 3 h en modalidad de seminario, sin afectar los RA evaluados. |
| Proyectos sobredimensionados | Media | Filtro de alcance en el anteproyecto (S6); el docente aprueba o recorta explícitamente. |

---

## 13. Mapa de coherencia RA ↔ sesiones ↔ evaluación

| Sesión | RA1 | RA2 | RA3 | RA4 | RA5 | RA6 | RA7 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 1 · Fundamentos | ● | ● | | | | | ○ |
| 2 · Hash y Merkle | ● | | | | | | |
| 3 · Firmas y anatomía de la cadena | ● | ● | | | | | |
| 4 · Consenso | ○ | ● | | | | | ○ |
| 5 · EVM y gas | | ● | ○ | | | | |
| 6 · Solidity I | | | ● | | | | |
| 7 · Solidity II | | | ● | | ○ | | |
| 8 · Hardhat y pruebas | | | ● | ● | | | |
| 9 · Seguridad | | | ○ | ● | ● | | |
| 10 · ERC-20 | | | ● | ○ | | | ○ |
| 11 · NFT e IPFS | | | ● | | | ● | ○ |
| 12 · Frontend Web3 | | | | | | ● | |
| 13 · Integración | | | ○ | ● | | ● | |
| 14 · DeFi | | ● | | | ● | | ● |
| 15 · DAOs e identidad | | ● | ● | | | | ● |
| 16 · L2 y regulación | | ● | | | | | ● |
| 17 · Sustentación | | ● | ● | ● | ● | ● | ● |

● Se desarrolla y evalúa · ○ Se aborda de forma complementaria

---

---

## 14. Registro de cambios

### Versión 2 — reubicación de la demostración y cascada de temas

La Sesión 1 pasó a ser **íntegramente teórica**, y eso desplazó contenido en cadena hasta la Sesión 5. Los movimientos, con su justificación:

| Tema | De | A | Por qué |
|---|---|---|---|
| Demostración en vivo de billetera y explorador | S1 | **S2** | El primer día se dedica por completo al modelo mental. Además, la demostración motiva mucho mejor la criptografía si va justo antes de estudiarla. |
| Contenido teórico nuevo: ecosistema, mapa del territorio, adopción real, taller de casos | — | **S1** | Rellena los 57 minutos liberados con material propio, no estirando lo existente. |
| Instalación de la billetera del estudiante | S5 | **S2** | Se hace justo después de ver la demostración, en el momento de máxima comprensión y con las máquinas ya abiertas. |
| Firma digital y ECDSA | S2 | **S3** | La demostración consume 45 min de la S2. Además separa bien las preguntas: la S2 responde «¿cómo sé que un dato no fue alterado?» y la S3 «¿cómo sé quién lo escribió?». |
| Modelo UTXO frente a modelo de cuentas | S3 | **S5** | Encaja de forma natural al presentar el modelo de cuentas de Ethereum, por comparación directa. |
| Bifurcaciones, reorganizaciones y finalidad | S3 | **S4** | Son consecuencia directa del mecanismo de consenso; no se pueden explicar antes de tenerlo. |

**Efecto neto sobre la evaluación:** la Sesión 1 no genera evidencia. El primer corte pasa de 5 a 4 laboratorios calificados (S2–S5). Ningún resultado de aprendizaje pierde cobertura.

### Versión 3 — material construido y decisiones de la Sesión 4

Se desarrolló el material completo de las 17 sesiones (presentaciones, laboratorios y evaluaciones). Al construirlo se tomaron dos decisiones que ajustan el plan:

| Decisión | Detalle | Por qué |
|---|---|---|
| La **actividad del caso Estonia** ocupa el bloque de laboratorio de la S4 | El laboratorio de minería (simulador, ataque del 51 %) pasa a ser **trabajo autónomo opcional** (`material/laboratorio-04`). | La S4 no podía sostener teoría + laboratorio + Quiz 1 + actividad en 3 h. La actividad cubre el RA2 con más profundidad y cierra la Unidad I. |
| Un **único repositorio Hardhat** para las Unidades II–IV | `material/laboratorios-evm`, con versiones congeladas (`versiones.md`). | Un `npm install` por semestre en la sala, en vez de doce. Todos los laboratorios de Solidity comparten entorno. |

**Inventario del material (v3):**

- **Presentaciones:** 17 decks PPTX (S1–S17), todos validados sin desbordes de maqueta.
- **Motor de decks:** `material/lib/sistema.js` (sistema de diseño compartido con validación automática de geometría) y `material/lib/qa_deck.py` (control de calidad por render).
- **Laboratorios con código probado:** S2 y S3 (Merkle, firmas, mini-blockchain, Python + JS); S4 (consenso, Python); S5–S16 en `laboratorios-evm` (81 pruebas de contrato, todas en verde, con Hardhat 3.16 / Solidity 0.8.28 / OpenZeppelin 5.6.1).
- **Evaluaciones:** Quiz 1 (estudiante + clave, generados de un solo banco) y Parcial práctico de la S9 (contrato vulnerable + solucionario, exploit y corrección verificados).
- **dApp de referencia:** `material/dapp-ficha` (frontend de un archivo, ethers v6, con los cuatro estados de error).
- **Proyecto del docente:** contrato de entradas con reventa controlada (`demo-entradas`, 28 pruebas) y deck de alcance.

**Pendiente para quien dicte el curso:** actualizar la parte regulatoria de la S16 (la norma colombiana cambia), verificar las cifras energéticas y los casos citados antes de cada dictado, y fijar los campos institucionales.

---

*Documento de trabajo. Ajustar campos institucionales, porcentajes de corte y versiones de herramientas antes de su radicación oficial.*
