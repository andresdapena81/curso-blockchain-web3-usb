# Laboratorio 12 · Una dApp que habla con la cadena y no miente

**Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín · Sesión 12**

Una interfaz web de **un solo archivo** (HTML + ethers v6 desde jsDelivr, sin compilar nada) que:

- conecta MetaMask y muestra la cuenta y la red;
- **lee** el saldo de la FichaUSB (el token ERC-20 de la Sesión 10) sin gastar gas;
- **transfiere** con una transacción, mostrando los estados *pendiente* y *minada*;
- maneja los **cuatro errores**: billetera no instalada, red equivocada, rechazo del usuario y transacción revertida;
- escucha el evento `Transfer` para actualizar el saldo sin recargar.

> Solo red local de Hardhat o Sepolia. Nunca dinero real. No se importa ninguna clave privada en MetaMask.

## Contenido

```
andamiaje/index.html          la dApp con 8 TODO: aquí se trabaja
guia/guia-laboratorio-12.pdf  guía paso a paso (fuente: guia-laboratorio-12.html)
```

Scripts de apoyo, en el repositorio Hardhat del curso (`material/laboratorios-evm`):

```
scripts/s12/preparar-local.js   despliega FichaUSB en la red local y les manda 1000 FUSB y 10 ETH locales
scripts/s12/comprobar-ficha.js  hace desde la terminal las mismas lecturas que la dApp (punto de control)
```

## Arranque rápido (red local)

```powershell
# terminal 1 · en material/laboratorios-evm
npx hardhat node

# terminal 2 · en material/laboratorios-evm
$env:DESTINO="0xSU_DIRECCION_DE_METAMASK"
npx hardhat run scripts/s12/preparar-local.js --network localhost

# terminal 3 · en material/laboratorio-12/andamiaje
npx serve .                    # o: python -m http.server 8000
```

En MetaMask, agregar la red `http://127.0.0.1:8545` con chainId `31337`. En `index.html`, pegar la dirección que imprimió el script en `DIRECCION_FICHA` y poner `CHAIN_ID_SEPOLIA = 31337n`. Abrir `http://localhost:3000` (o `:8000`).

**No abrir `index.html` con doble clic:** en `file://` Chrome no deja actuar a MetaMask y la dApp dice «No se detecta una billetera». La guía explica por qué.

## Evidencia

Los 8 TODO completos en el repositorio del equipo, una transferencia confirmada con su hash, seis capturas (los cuatro errores provocados a propósito, pendiente y confirmada), el saldo actualizado por evento y la reflexión. Detalle y rúbrica en la guía.
