// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

/* =====================================================================
   CTF LOCAL · Sesión 9 · tres contratos con un fallo cada uno
   =====================================================================
   Los tres funcionan. Los tres pasan una prueba feliz. Y los tres se
   pueden vaciar desde afuera.

   El trabajo NO es arreglarlos: es DEMOSTRAR que están rotos, escribiendo
   el contrato atacante de cada reto (andamiaje/s09/ctf/). La prueba de
   cada reto pasa cuando el ataque funciona de verdad.

   Material de clase, sin auditar. Nunca con dinero real.
   ===================================================================== */

/* ---------------------------------------------------------------------
   RETO 1 · La caja del semillero  ·  familia: control de acceso
   ---------------------------------------------------------------------
   Guarda la plata del semillero. Solo el tesorero puede sacarla, y el
   contrato lo comprueba. Parece bien hecho. ¿Lo está?
   --------------------------------------------------------------------- */
contract CajaDelSemillero {
    address public tesorero;

    error NoAutorizado();

    constructor() {
        tesorero = msg.sender;
    }

    receive() external payable {}

    function saldo() external view returns (uint256) {
        return address(this).balance;
    }

    /// Envía TODO el saldo a donde diga quien autoriza la operación.
    function sacarTodo(address payable destino) external {
        if (tx.origin != tesorero) revert NoAutorizado();
        destino.transfer(address(this).balance);
    }
}

/* ---------------------------------------------------------------------
   RETO 2 · La lotería del semillero  ·  familia: azar en cadena
   ---------------------------------------------------------------------
   Deposita el bote quien quiera. El que adivine el número secreto (0 a
   99) se lo lleva entero. El número sale de datos del bloque, que —según
   el autor— nadie puede controlar.
   --------------------------------------------------------------------- */
contract LoteriaDelSemillero {
    error NumeroEquivocado();

    function depositar() external payable {}

    function bote() external view returns (uint256) {
        return address(this).balance;
    }

    function probar(uint256 intento) external {
        uint256 secreto = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        ) % 100;
        if (intento != secreto) revert NumeroEquivocado();

        (bool ok, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(ok, "pago fallido");
    }
}

/* ---------------------------------------------------------------------
   RETO 3 · La bóveda del semillero  ·  familia: reentrada
   ---------------------------------------------------------------------
   Cada quien deposita y puede retirar lo suyo cuando quiera. El contrato
   es cortés: primero le entrega el dinero, y después pone su saldo en
   cero. En ese orden.
   --------------------------------------------------------------------- */
contract BovedaDelSemillero {
    mapping(address => uint256) public saldos;

    error SinSaldo();

    function depositar() external payable {
        saldos[msg.sender] += msg.value;
    }

    function saldo() external view returns (uint256) {
        return address(this).balance;
    }

    function retirar() external {
        uint256 monto = saldos[msg.sender];
        if (monto == 0) revert SinSaldo();

        (bool ok, ) = payable(msg.sender).call{value: monto}("");   // interacción...
        require(ok, "envio fallido");

        saldos[msg.sender] = 0;                                      // ...y el efecto, tarde
    }
}
