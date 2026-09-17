// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RecaudoMutante2 · Laboratorio 08 · CON UN ERROR A PROPÓSITO
 * @notice Blockchain y Web 3.0 · USB Medellín · Sesión 8
 *
 * Un semillero recoge aportes para un proyecto. Si al vencer el plazo se
 * alcanzó la meta, el beneficiario reclama los fondos. Si no, cada aportante
 * recupera exactamente lo que puso.
 *
 * MUTANTE 2 · un error de borde en la meta. No se dice cuál.
 * Una suite de pruebas buena debe FALLAR contra este contrato.
 * No se usa para nada más.
 *
 * Material de clase, sin auditar. Nunca con dinero real.
 */
contract RecaudoMutante2 is Ownable {
    enum Estado {
        Activo,
        Exitoso,
        Fallido
    }

    uint256 public immutable meta;
    uint256 public immutable fin;

    uint256 public totalRecaudado;
    bool public fondosReclamados;
    mapping(address => uint256) public aportes;

    error PlazoVencido();
    error PlazoVigente();
    error AporteCero();
    error MetaNoAlcanzada();
    error MetaAlcanzada();
    error YaReclamado();
    error NadaQueReembolsar();
    error EnvioFallido();
    error ParametrosInvalidos();

    event Aporte(address indexed aportante, uint256 monto, uint256 total);
    event FondosReclamados(address indexed beneficiario, uint256 monto);
    event Reembolso(address indexed aportante, uint256 monto);

    constructor(uint256 meta_, uint256 duracionSegundos) Ownable(msg.sender) {
        if (meta_ == 0 || duracionSegundos == 0) revert ParametrosInvalidos();
        meta = meta_;
        fin = block.timestamp + duracionSegundos;
    }

    function estado() public view returns (Estado) {
        if (block.timestamp < fin) return Estado.Activo;
        return totalRecaudado >= meta ? Estado.Exitoso : Estado.Fallido;
    }

    function aportar() external payable {
        if (block.timestamp >= fin) revert PlazoVencido();
        if (msg.value == 0) revert AporteCero();

        aportes[msg.sender] += msg.value;
        totalRecaudado += msg.value;

        emit Aporte(msg.sender, msg.value, totalRecaudado);
    }

    function reclamarFondos() external onlyOwner {
        if (block.timestamp < fin) revert PlazoVigente();
        if (totalRecaudado <= meta) revert MetaNoAlcanzada();
        if (fondosReclamados) revert YaReclamado();

        fondosReclamados = true;
        uint256 monto = address(this).balance;

        (bool ok, ) = payable(owner()).call{value: monto}("");
        if (!ok) revert EnvioFallido();

        emit FondosReclamados(owner(), monto);
    }

    function reembolsar() external {
        if (block.timestamp < fin) revert PlazoVigente();
        if (totalRecaudado >= meta) revert MetaAlcanzada();

        uint256 monto = aportes[msg.sender];
        if (monto == 0) revert NadaQueReembolsar();

        aportes[msg.sender] = 0;

        (bool ok, ) = payable(msg.sender).call{value: monto}("");
        if (!ok) revert EnvioFallido();

        emit Reembolso(msg.sender, monto);
    }
}
