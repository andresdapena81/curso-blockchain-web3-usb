# Proyecto integrador · Blockchain y Web 3.0 · USB Medellín

Un solo proyecto por equipo de **3 estudiantes**, que evoluciona durante todo el semestre en **cuatro entregas** incrementales, más dos actividades que lo rodean: la **auditoría cruzada** (dos momentos) y el **ensayo individual** (RA7). Este índice reúne las instrucciones públicas de cada una. Todo lo que aquí se enlaza es para estudiantes; las claves y solucionarios viven en `material/evaluaciones/`, no aquí.

> Fuente de verdad: `Plan-de-estudio-Blockchain-Web3.md`, secciones 7 (sesiones), 8 (proyecto y rúbrica) y 9 (evaluación). Si algo de esta carpeta contradice el plan, manda el plan.

## Documentos

Cada documento existe en HTML (fuente) y PDF (el que se reparte), con el mismo nombre.

| # | Entrega o actividad | Sesión | Instrucciones | Peso (plan §8) |
|---|---|---|---|---|
| 1 | **Anteproyecto**: problema, usuarios, por qué blockchain, alcance, arquitectura preliminar, equipo. Máx. 3 páginas. | S6 | [01-anteproyecto.html](01-anteproyecto.html) · [PDF](01-anteproyecto.pdf) | 5 % |
| 2 | **Avance 1**: contratos desplegados y verificados en Sepolia + suite de pruebas (≥ 80 % de cobertura) + repositorio documentado. | S13 | [02-avance-1.html](02-avance-1.html) · [PDF](02-avance-1.pdf) | 10 % |
| 3 | **Avance 2**: dApp integrada; frontend conectado, flujo completo funcional, metadata en IPFS si aplica. | S16 | [03-avance-2.html](03-avance-2.html) · [PDF](03-avance-2.pdf) | 10 % |
| 4 | **Entrega final + sustentación**: producto completo, documentación técnica, video demo de 3 min, sustentación y defensa (Demo Day). | S17 | [04-entrega-final.html](04-entrega-final.html) · [PDF](04-entrega-final.pdf) | 15 % |
| — | **Planilla de sustentación**: la hoja con la que el docente califica en vivo cada equipo y la pregunta de la auditoría cruzada #2. Es pública para que sepan exactamente qué se mira. | S17 | [planilla-sustentacion.html](planilla-sustentacion.html) · [PDF](planilla-sustentacion.pdf) | — |
| — | **Auditoría cruzada**: #1 escrita (S9, hallazgos por severidad sobre el contrato de otro equipo) y #2 oral (S17, una pregunta técnica que se califica). | S9 y S17 | [auditoria-cruzada.html](auditoria-cruzada.html) · [PDF](auditoria-cruzada.pdf) | ver §9 abajo |
| — | **Ensayo individual (RA7)**: 1.500 palabras sobre una implicación regulatoria, ética, económica o ambiental, aplicada a Colombia, con declaración de uso de IA. | S15 → S17 | [ensayo-individual.html](ensayo-individual.html) · [PDF](ensayo-individual.pdf) | 8 % |

El deck que conduce el Demo Day es `material/Sesion-17-Blockchain-Web3.pptx` (construido con `node build-sesion-17.js`).

## Calendario de entregas

El plan fija las entregas por sesión, no por fecha. La columna «Fecha» se completa al inicio del semestre con el calendario académico.

| Sesión | Fecha | Qué pasa | Quién |
|---|---|---|---|
| S6 | ____ | **Entrega del anteproyecto.** El docente aprueba o recorta el alcance explícitamente (filtro contra proyectos sobredimensionados). | Equipo |
| S9 | ____ | **Auditoría cruzada #1**: cada equipo audita el contrato de otro y entrega hallazgos clasificados por severidad. | Equipo |
| S13 | ____ | **Entrega del avance 1**: contratos verificados en Sepolia, pruebas con cobertura ≥ 80 %, repositorio documentado. | Equipo |
| S15 | ____ | **Se plantea el ensayo individual** (RA7). | Individual |
| S16 | ____ | **Entrega del avance 2**: dApp integrada y funcional. Se anuncian el orden provisional del Demo Day, las parejas de la auditoría cruzada #2 y el formato del día según el número de equipos. | Equipo |
| S17 | ____ | **Demo Day**: entrega final (etiqueta `v1.0-final` en el repositorio antes de iniciar), sustentación de 15 + 5 min, **auditoría cruzada #2** y **entrega del ensayo individual**. | Equipo e individual |

## Esquema de evaluación del curso (plan §9)

Propuesta del plan, ajustable al esquema de cortes del reglamento institucional.

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

**Política de laboratorios:** cada laboratorio se entrega con evidencia verificable en cadena (hash de transacción o dirección de contrato) y repositorio Git. Sin evidencia en cadena, el laboratorio no se califica.

**Auditoría cruzada #2:** el plan dice que se califica la calidad de la pregunta, sin fijarle un peso propio. En este material, su nota (0 a 5) es el 20 % del criterio «Sustentación y documentación» de la rúbrica final del equipo que pregunta. Detalle en [04-entrega-final](04-entrega-final.html), sección 05.

### ⚠ Las dos tablas de pesos del plan no coinciden

La tabla de entregas (§8) asigna **5 / 10 / 10 / 15 %** (suma 40 % de la nota final). El esquema por cortes (§9) asigna al anteproyecto **6 %** y al «proyecto final (avances + entrega + sustentación)» **28 %** (suma 34 %). Las dos no pueden regir a la vez. El esquema de §9 es el único que suma 100 % con el resto de componentes, así que es el que se puede aplicar tal cual; si se adopta, una lectura coherente es repartir el 28 % en la proporción de §8 (10 : 10 : 15), es decir **avance 1 = 8 %, avance 2 = 8 %, entrega final + sustentación = 12 %**. Es una decisión del docente: debe tomarse y anunciarse antes de la Sesión 6, y corregirse en el plan.

## Rúbrica del proyecto final (plan §8)

La rúbrica completa, con los descriptores de los tres niveles, está en [04-entrega-final](04-entrega-final.html), sección 04. Resumen de pesos:

| Criterio | Peso |
|---|---|
| Pertinencia de la solución | 15 % |
| Calidad de los contratos | 25 % |
| Pruebas y despliegue | 20 % |
| Seguridad | 20 % |
| Integración e interfaz | 10 % |
| Sustentación y documentación | 10 % |

## Reglas que atraviesan todas las entregas

- Solo redes de prueba o red local: nunca dinero real.
- La frase semilla no se comparte con nadie, tampoco con el docente; no se firma lo que no se entiende.
- Claves privadas, URL de RPC y API keys solo en el keystore de Hardhat (`npx hardhat keystore set ...`), jamás en archivos del repositorio.
- Ningún dato personal en cadena (Ley 1581 de 2012): de un documento, solo su hash.
- Los contratos son material académico sin auditar.

## Cómo regenerar los PDF

Desde `material/`:

```
python lib/html_a_pdf.py proyecto/04-entrega-final.html "PROYECTO · ENTREGA FINAL Y SUSTENTACIÓN"
python lib/html_a_pdf.py proyecto/planilla-sustentacion.html "PROYECTO · PLANILLA DE SUSTENTACIÓN" --sin-portada
```

(Los demás documentos se regeneran igual, con su propio texto de pie.)
