"""
Convierte documentos HTML del curso a PDF A4 con pie de página numerado.

    python lib/html_a_pdf.py ruta/doc.html "TEXTO DEL PIE" [--sin-portada]

- Inyecta la hoja de estilos compartida lib/impreso.css donde el HTML diga
  <!--ESTILOS-->.
- Renderiza con Edge (o Chrome) en modo headless respetando el CSS de impresión.
- Estampa con PyMuPDF el pie y la numeración: Chrome no numera desde CSS.
- Revisa que ningún bloque de texto se salga de la página.
"""

import os
import subprocess
import sys
import tempfile
from pathlib import Path

import fitz

AQUI = Path(__file__).resolve().parent
EDGE = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")

GRIS = (0.435, 0.420, 0.502)
GRIS_CLARO = (0.851, 0.839, 0.878)
NARANJA = (0.941, 0.498, 0.024)


def convertir(html: Path, pie: str, sin_portada: bool) -> Path:
    css = (AQUI / "impreso.css").read_text(encoding="utf-8")
    fuente = html.read_text(encoding="utf-8").replace("<!--ESTILOS-->", f"<style>{css}</style>")
    tmp = Path(tempfile.gettempdir()) / f"_usb_{html.stem}.html"
    tmp.write_text(fuente, encoding="utf-8")
    pdf = html.with_suffix(".pdf")
    if pdf.exists():
        pdf.unlink()

    nav = EDGE if EDGE.exists() else CHROME
    # Perfil único por corrida: evita que un perfil bloqueado por una corrida
    # anterior (o un Edge ya abierto) impida el print headless.
    prof = tempfile.mkdtemp(prefix="usbpdf_")
    r = subprocess.run(
        [str(nav), "--headless=new", "--disable-gpu", "--no-first-run",
         f"--user-data-dir={prof}", "--run-all-compositor-stages-before-draw",
         "--virtual-time-budget=8000",
         "--no-pdf-header-footer", f"--print-to-pdf={pdf}", tmp.as_uri()],
        capture_output=True, text=True,
    )
    if not pdf.exists():
        print(r.stderr[-800:] if r.stderr else "(sin stderr)")
        sys.exit(f"No se produjo {pdf.name}")

    doc = fitz.open(pdf)
    problemas = 0
    for i, pg in enumerate(doc):
        ancho, alto = pg.rect.width, pg.rect.height
        for b in pg.get_text("blocks"):
            if b[2] > ancho - 6 or b[0] < 6 or b[3] > alto - 30:
                print(f"  p{i+1} DESBORDE {b[4][:50]!r}")
                problemas += 1
        if i == 0 and not sin_portada:
            continue
        y = alto - 30
        pg.draw_line(fitz.Point(40, y), fitz.Point(ancho - 40, y), color=GRIS_CLARO, width=1.2)
        pg.insert_text(fitz.Point(40, y + 13), "BLOCKCHAIN Y WEB 3.0  ·  USB MEDELLIN",
                       fontname="cour", fontsize=6.5, color=GRIS)
        der = pie.upper()
        ad = fitz.get_text_length(der, fontname="cour", fontsize=6.5)
        pg.insert_text(fitz.Point(ancho - 40 - ad - 26, y + 13), der, fontname="cour", fontsize=6.5, color=GRIS)
        num = f"{i + 1:02d}"
        an = fitz.get_text_length(num, fontname="cobo", fontsize=9)
        pg.insert_text(fitz.Point(ancho - 40 - an, y + 14), num, fontname="cobo", fontsize=9, color=NARANJA)
    doc.set_metadata({"title": pie, "author": "Universidad de San Buenaventura Medellín"})
    doc.saveIncr()
    n = doc.page_count
    doc.close()
    print(f"OK · {pdf.name} · {n} páginas · {problemas} desborde(s)")
    return pdf


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    convertir(Path(sys.argv[1]).resolve(), sys.argv[2], "--sin-portada" in sys.argv)
