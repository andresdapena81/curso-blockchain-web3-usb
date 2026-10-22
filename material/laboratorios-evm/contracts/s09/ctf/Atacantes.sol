// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

/* =====================================================================
   ANDAMIAJE · los tres atacantes del CTF · Sesión 9
   =====================================================================
   Un contrato por reto. El andamiaje trae todo armado MENOS la jugada:
   el cuerpo del método clave está vacío, con un `// TODO`. Esa es su
   parte. Cuando la escriban bien, la prueba del reto pasa.

   NO cambien los contratos de contracts/s09/ctf/Retos.sol. El trabajo
   es atacarlos desde afuera, no arreglarlos.
   ===================================================================== */

interface ICaja { function sacarTodo(address payable destino) external; }
interface ILoteria { function probar(uint256 intento) external; }
interface IBoveda { function depositar() external payable; function retirar() external; }

/* ---------------------------------------------------------------------
   RETO 1 · control de acceso
   La caja comprueba la identidad con tx.origin. Piensen: ¿quién es
   tx.origin cuando el TESORERO, sin saberlo, firma una transacción que
   llama a ESTE contrato?
   --------------------------------------------------------------------- */
contract AtacanteReto1 {
    ICaja public caja;
    address public ladron;
    constructor(address caja_) { caja = ICaja(caja_); ladron = msg.sender; }
    receive() external payable {}

    /// El tesorero llamará esta función (cree que reclama un premio).
    function reclamar() external {
        // TODO · reto 1
        //  1. pídanle a la caja que les mande TODO a este contrato
        //  2. reenvíen el botín al ladron
        //  Pista: aquí tx.origin sigue siendo el tesorero.
        revert("sin implementar");
    }
}

/* ---------------------------------------------------------------------
   RETO 2 · azar en cadena
   El número secreto sale de datos del bloque. Un contrato puede leer
   esos MISMOS datos en la misma transacción antes de responder.
   --------------------------------------------------------------------- */
contract AtacanteReto2 {
    ILoteria public loteria;
    address public ladron;
    constructor(address loteria_) { loteria = ILoteria(loteria_); ladron = msg.sender; }
    receive() external payable {}

    function robar() external {
        // TODO · reto 2
        //  1. calculen el secreto con la MISMA fórmula del contrato,
        //     usando address(this) donde el contrato usa msg.sender
        //  2. llamen a probar(secreto)
        //  3. reenvíen el bote al ladron
        revert("sin implementar");
    }
}

/* ---------------------------------------------------------------------
   RETO 3 · reentrada
   La bóveda entrega el dinero ANTES de poner el saldo en cero. Mientras
   les paga, el control vuelve a ustedes: ¿y si vuelven a pedir?
   --------------------------------------------------------------------- */
contract AtacanteReto3 {
    IBoveda public boveda;
    address public ladron;
    uint256 public cebo;
    constructor(address boveda_) { boveda = IBoveda(boveda_); ladron = msg.sender; }

    function atacar() external payable {
        // TODO · reto 3 · parte A
        //  1. guarden el cebo (msg.value)
        //  2. depositen el cebo en la bóveda
        //  3. llamen a retirar() para arrancar la cadena
        //  4. al final, reenvíen todo al ladron
        revert("sin implementar");
    }

    receive() external payable {
        // TODO · reto 3 · parte B
        //  mientras la bóveda tenga con qué pagar, vuelvan a retirar()
    }
}
