"""
Genera la versión «con huecos» de un archivo Python a partir de la solución.

    python lib/andamiaje.py solucion/consenso.py consenso.py funcion1 funcion2 ...

Conserva firmas, docstrings, comentarios de cabecera y todas las funciones no
listadas. Cada función listada queda con su docstring y un TODO que lanza
NotImplementedError. Así el andamiaje y la solución nunca se desincronizan.
"""

import ast
import sys
from pathlib import Path


def generar(origen: Path, destino: Path, nombres):
    fuente = origen.read_text(encoding="utf-8")
    lineas = fuente.splitlines()
    arbol = ast.parse(fuente)
    reemplazos = []
    encontrados = set()

    for nodo in ast.walk(arbol):
        if isinstance(nodo, (ast.FunctionDef, ast.AsyncFunctionDef)) and nodo.name in nombres:
            encontrados.add(nodo.name)
            cuerpo = nodo.body
            primero = cuerpo[0]
            tiene_doc = isinstance(primero, ast.Expr) and isinstance(getattr(primero, "value", None), ast.Constant) \
                and isinstance(primero.value.value, str)
            inicio_borrado = (primero.end_lineno if tiene_doc else nodo.body[0].lineno - 1)
            fin = nodo.end_lineno
            sangria = " " * (cuerpo[0].col_offset)
            reemplazos.append((inicio_borrado, fin, [f"{sangria}# TODO · {nodo.name}",
                                                     f'{sangria}raise NotImplementedError("{nodo.name}")']))

    faltan = set(nombres) - encontrados
    if faltan:
        sys.exit(f"No se encontraron: {', '.join(sorted(faltan))}")

    for inicio, fin, nuevas in sorted(reemplazos, reverse=True):
        lineas[inicio:fin] = nuevas

    texto = "\n".join(lineas) + "\n"
    texto = texto.replace("SOLUCIÓN DE REFERENCIA. La versión con huecos está en ../andamiaje/.",
                          "VERSIÓN DE TRABAJO. Completa las funciones marcadas con TODO.\nNo modifiques el archivo de pruebas.")
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(texto, encoding="utf-8")
    print(f"andamiaje → {destino} ({len(reemplazos)} funciones vaciadas)")


if __name__ == "__main__":
    generar(Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3:])
