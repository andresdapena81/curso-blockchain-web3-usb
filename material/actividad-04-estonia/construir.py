"""
Construye el PDF de la Actividad 4 · El caso Estonia.

    python construir.py

Dos pasos: Edge en modo headless convierte el HTML a PDF respetando el CSS de
impresión, y PyMuPDF estampa después el pie de página con la numeración —
Chrome no sabe numerar páginas desde CSS y el pie fijo colisiona con los
encabezados de sección.
"""

import os
import subprocess
import sys
from pathlib import Path

import fitz  # PyMuPDF

AQUI = Path(__file__).parent
HTML = AQUI / "guia-actividad-estonia.html"
PDF = AQUI / "Actividad-04-El-caso-Estonia.pdf"

EDGE = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")

IZQUIERDA = "BLOCKCHAIN Y WEB 3.0  ·  USB MEDELLIN  ·  INGENIERIA DE SISTEMAS"
DERECHA = "ACTIVIDAD 4  ·  EL CASO ESTONIA"

GRIS = (0.435, 0.420, 0.502)
GRIS_CLARO = (0.851, 0.839, 0.878)
NARANJA = (0.941, 0.498, 0.024)


def render():
    navegador = EDGE if EDGE.exists() else CHROME
    if not navegador.exists():
        sys.exit("No se encontro Edge ni Chrome para renderizar.")

    if PDF.exists():
        PDF.unlink()

    subprocess.run(
        [
            str(navegador),
            "--headless=new",
            "--disable-gpu",
            "--run-all-compositor-stages-before-draw",
            "--virtual-time-budget=10000",
            "--no-first-run",
            f"--user-data-dir={os.environ['TEMP']}\\edgepdf_prof",
            "--no-pdf-header-footer",
            f"--print-to-pdf={PDF}",
            HTML.as_uri(),
        ],
        capture_output=True,
    )

    if not PDF.exists():
        sys.exit("El navegador no produjo el PDF.")


def estampar_pie():
    """Dibuja el pie en el margen inferior de cada pagina, salvo la portada."""
    doc = fitz.open(PDF)
    for i, pagina in enumerate(doc):
        if i == 0:  # la portada lleva su propia identificacion
            continue
        ancho, alto = pagina.rect.width, pagina.rect.height
        y = alto - 34

        pagina.draw_line(
            fitz.Point(40, y), fitz.Point(ancho - 40, y),
            color=GRIS_CLARO, width=1.2,
        )
        pagina.insert_text(
            fitz.Point(40, y + 13), IZQUIERDA,
            fontname="cour", fontsize=6.5, color=GRIS,
        )
        ancho_der = fitz.get_text_length(DERECHA, fontname="cour", fontsize=6.5)
        pagina.insert_text(
            fitz.Point(ancho - 40 - ancho_der - 26, y + 13), DERECHA,
            fontname="cour", fontsize=6.5, color=GRIS,
        )
        num = f"{i + 1:02d}"
        ancho_num = fitz.get_text_length(num, fontname="cobo", fontsize=9)
        pagina.insert_text(
            fitz.Point(ancho - 40 - ancho_num, y + 14), num,
            fontname="cobo", fontsize=9, color=NARANJA,
        )

    doc.set_metadata({
        "title": "Actividad 4 · El caso Estonia",
        "author": "Universidad de San Buenaventura Medellín",
        "subject": "Blockchain y Web 3.0 · Ingeniería de Sistemas",
    })
    doc.saveIncr()
    doc.close()


if __name__ == "__main__":
    render()
    estampar_pie()
    doc = fitz.open(PDF)
    print(f"OK · {PDF.name} · {doc.page_count} paginas · {PDF.stat().st_size:,} bytes")
    doc.close()
