# Actividad 09 · Reto de seguridad (CTF local)

Blockchain y Web 3.0 · USB Medellín · Sesión 9

Actividad práctica **individual, para hacer en casa, sin profesor**. Es
evaluable y autocalificable: cada reto trae una prueba que pasa cuando tu
ataque funciona. La guía completa es la página `actividad.html` (ábrela con
doble clic en el navegador); este README es solo el instructivo del paquete.

---

## Qué trae el paquete

- `contracts/s09/ctf/Retos.sol` — los **tres contratos vulnerables** (la caja,
  la lotería y la bóveda del semillero). **No se tocan.** Son el objetivo.
- `contracts/s09/ctf/Atacantes.sol` — el **andamiaje**: tres contratos atacante
  con el método clave vacío y un `// TODO`. **Este es tu único archivo de
  trabajo.**
- `test/s09/ctf/CTF.test.js` — las **tres pruebas autocalificables**. No se
  tocan: son tu calificación.
- `actividad.html` — la guía de la actividad (teoría, los tres retos con pistas
  escalonadas, Slither, rúbrica y preguntas de reflexión).
- `rubrica.pdf` — la rúbrica de calificación.
- La configuración de Hardhat y el `package.json` del proyecto.

---

## Requisitos

- **Node 22 LTS** (compruébalo con `node --version`).
- No necesitas ETH de prueba ni ninguna red pública: **todo corre en la red
  local de Hardhat**.
- Para la parte de Slither (opcional de instalar, vale 10 %): **Python 3.10 o
  superior**. Las instrucciones están en `actividad.html`, sección Slither.

---

## Instalación

Desde una terminal, dentro de la carpeta del paquete:

```bash
npm install
```

---

## Cómo correr las pruebas

```bash
npx hardhat test test/s09/ctf/CTF.test.js
```

Al empezar, **las tres pruebas fallan a propósito**: el andamiaje revienta con
`reverted with reason string 'sin implementar'`. Eso es lo esperado. A medida
que escribes bien cada exploit en `Atacantes.sol`, las pruebas van pasando a
verde, una por una. La meta es `3 passing`.

> `npx hardhat test` recibe **archivos**, no carpetas.

---

## Orden sugerido

1. **Reto 1 · control de acceso (`tx.origin`)** — el más corto, dos líneas.
2. **Reto 2 · azar en cadena** — recalcular el «secreto».
3. **Reto 3 · reentrada** — el más largo; se escribe en dos lugares
   (`atacar()` y `receive()`).
4. **Slither** sobre el contrato de tu propio proyecto del curso.
5. **Preguntas de reflexión.**

---

## Qué se entrega

Una sola carpeta o `.zip` con:

1. Tu `Atacantes.sol` completo.
2. Captura de la terminal con las **tres pruebas en verde** (`3 passing`).
3. Por cada reto, 3–5 líneas con tus palabras: por qué era vulnerable y cómo
   se arreglaría.
4. Captura de la salida de **Slither** sobre tu contrato + tu lectura.
5. Las preguntas de reflexión respondidas.

La rúbrica y los pesos están en `rubrica.pdf` y resumidos en `actividad.html`.

---

## Reglas

- **No modifiques** `Retos.sol` (los contratos vulnerables) ni
  `CTF.test.js` (las pruebas). El trabajo es **escribir los atacantes** en
  `Atacantes.sol` y atacar desde afuera, no arreglar el objetivo ni cambiar la
  prueba.
- Material de clase **sin auditar**: solo red local, nunca dinero real. Lo que
  aprendes a atacar aquí es para **defender**.
- Puedes usar IA **declarándola**; la parte de explicación mide tu criterio, no
  la de un asistente. Ver la caja de honestidad en `actividad.html`.
