# Laboratorio 09 · Reentrancy, Ethernaut y auditoría cruzada

**Sesión 9 · Seguridad · en parejas (Ethernaut y auditoría) · el parcial es individual**

> El parcial práctico de esta sesión es evaluación calificada (45 % del segundo corte) y va aparte, en `evaluaciones/parcial-s09/`.

## Parte 0 · Reentrancy en vivo (con el docente)

```bash
npx hardhat test test/s09/Reentrancy.test.js
```

Cinco pruebas que demuestran el robo y las dos defensas:

- **`BancoVulnerable`**: tres clientes honestos depositan 10 ETH. El `Atacante` deposita 1 y sale con **11**. El banco queda en cero y los saldos honestos quedan impagables.
- **`BancoSeguro`** (CEI + `ReentrancyGuard`): el mismo ataque revierte en cadena y el banco conserva sus 10 ETH.

Lean los tres contratos en `contracts/s09/` mientras corre la prueba. El fallo está en el **orden**: `BancoVulnerable` envía el ETH antes de poner el saldo en cero.

Detalle fino que vale la pena notar: contra `BancoSeguro`, el ataque no revierte con `ReentrancyGuardReentrantCall` sino con `EnvioFallido`. La reentrada choca con el guard dentro del `receive()` del atacante, ese `receive()` revierte, y eso hace fallar el envío del banco. La cascada deja todo intacto.

## Parte 1 · Ethernaut (en parejas)

Prerrequisito: nivel 0 (**Hello Ethernaut**) resuelto en el trabajo de la Sesión 8.

1. Entrar a **https://ethernaut.openzeppelin.com** con la billetera del curso en Sepolia.
2. Resolver, en orden: **Fallback**, **Fal1out**, **Token**, **Re-entrancy**, **Force**.
3. Cada nivel se «gana» desde la consola del navegador (F12). Ethernaut da la instancia y el objetivo.

| Nivel | Vulnerabilidad | Conecta con |
|---|---|---|
| Fallback | `receive`/`fallback` y control de acceso | S7 |
| Fal1out | Un «constructor» que es función pública | S6 |
| Token | Desbordamiento aritmético (versión vieja) | S9 A.9 |
| Re-entrancy | El robo de la Parte 0, a mano | S9 A.3–A.7 |
| Force | Enviar ETH con `selfdestruct` a un contrato sin `receive` | Suposiciones sobre el saldo |

**Evidencia:** captura de la consola con cada nivel superado, y una línea por nivel explicando la vulnerabilidad.

## Parte 2 · Auditoría cruzada #1 (en parejas)

Cada equipo entrega el contrato principal de su proyecto y recibe el de otro equipo.

1. Recorrer las **ocho** vulnerabilidades de la taxonomía (A.2 del deck), una por una.
2. Pasar Slither: `slither <contrato>` (o la extensión de VS Code si la sala no permite Python).
3. Clasificar cada hallazgo: severidad alta / media / baja + línea exacta.
4. Proponer la corrección mínima de cada uno. **No reescribir** el contrato ajeno.

**Evidencia:** informe de auditoría de una a dos páginas. Se califica la calidad de la auditoría, no cuántos fallos tenga el contrato revisado.

---

## Parcial práctico (individual, 90 min, libro abierto)

En `evaluaciones/parcial-s09/VaultVulnerable.sol`. Tres vulnerabilidades de la taxonomía. Tres tareas:

1. **Identificar** las tres: nombre, severidad y línea.
2. **Explotar** al menos una con una prueba de Hardhat.
3. **Corregir** las tres en `VaultCorregido.sol`, sin romper lo legítimo y sin reescribir el contrato entero.

Rúbrica sobre 20 puntos en el material del docente. Entrega: `VaultCorregido.sol` + la prueba del exploit + media página con las tres vulnerabilidades, su severidad y la corrección.

## Instalar Slither (opcional, recomendado)

```bash
pip install slither-analyzer
slither contracts/s09/BancoVulnerable.sol
```

Marca la reentrancy y el orden CEI violado en segundos. Es el primer filtro de seguridad, no el último: no entiende la lógica de negocio ni encuentra fallos de diseño nuevos.
