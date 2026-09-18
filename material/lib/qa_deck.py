"""
Control de calidad de un deck ya generado.

    python lib/qa_deck.py Sesion-05-Blockchain-Web3.pptx [otro.pptx ...]

1. Convierte el PPTX a PDF con LibreOffice (renderiza como lo haría un proyector).
2. Por cada lámina detecta:
   - texto fuera del marco;
   - texto que invade la franja del pie;
   - bloques de texto que se PISAN entre sí (el desborde típico de una caja
     que se queda corta y dibuja encima de la siguiente).
3. Exporta PNG de las láminas indicadas con --png 3,7,12 para revisión visual.

Sale con código 1 si encuentra problemas.
"""

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import fitz  # PyMuPDF

SOFFICE = r"C:\Program Files\LibreOffice\program\soffice.exe"
QA_DIR = Path(__file__).resolve().parent.parent / "_qa"


def convertir(pptx: Path) -> Path:
    QA_DIR.mkdir(exist_ok=True)
    pdf = QA_DIR / (pptx.stem + ".pdf")
    if pdf.exists():
        pdf.unlink()  # que un PDF viejo no pase por el recién generado
    # Perfil de LibreOffice propio por corrida: con un perfil compartido, dos
    # conversiones simultáneas se estorban y la segunda falla en silencio.
    perfil = Path(tempfile.mkdtemp(prefix="usbqa_"))
    subprocess.run(
        [SOFFICE, f"-env:UserInstallation={perfil.as_uri()}", "--headless",
         "--convert-to", "pdf", "--outdir", str(QA_DIR), str(pptx)],
        capture_output=True,
    )
    shutil.rmtree(perfil, ignore_errors=True)
    if not pdf.exists():
        sys.exit(f"LibreOffice no produjo {pdf.name}")
    return pdf


def bloques(pagina):
    salida = []
    for b in pagina.get_text("blocks"):
        x0, y0, x1, y1, txt = b[0], b[1], b[2], b[3], b[4].strip()
        if txt:
            salida.append((fitz.Rect(x0, y0, x1, y1), txt.replace("\n", " ")))
    return salida


def revisar(pdf: Path, pngs):
    d = fitz.open(pdf)
    W, H = d[0].rect.width, d[0].rect.height
    y_pie = H * (6.88 / 7.5)
    problemas = 0
    for i, pg in enumerate(d):
        bl = bloques(pg)
        for r, t in bl:
            if r.x1 > W - 3 or r.x0 < 3 or r.y1 > H - 3 or r.y0 < 1:
                print(f"  L{i+1:02d} FUERA DE MARCO  {t[:55]!r}")
                problemas += 1
            es_pie = r.y0 >= y_pie - 2 and r.height < 20
            if not es_pie and r.y1 > y_pie + 3:
                print(f"  L{i+1:02d} INVADE EL PIE   y1={r.y1:.0f}>{y_pie:.0f}  {t[:50]!r}")
                problemas += 1
        # solapes entre bloques de texto distintos
        for a in range(len(bl)):
            for b in range(a + 1, len(bl)):
                ra, rb = bl[a][0], bl[b][0]
                inter = ra & rb
                if inter.is_empty:
                    continue
                area = inter.width * inter.height
                menor = min(ra.width * ra.height, rb.width * rb.height)
                # tolerancia: los renglones contiguos se tocan 1-2 pt
                if menor > 0 and area / menor > 0.18 and inter.height > 4:
                    print(f"  L{i+1:02d} SE PISAN        {bl[a][1][:32]!r}  ×  {bl[b][1][:32]!r}")
                    problemas += 1
    for n in pngs:
        if 1 <= n <= d.page_count:
            destino = QA_DIR / f"{pdf.stem}_L{n:02d}.png"
            d[n - 1].get_pixmap(dpi=100).save(destino)
            print(f"  png → {destino}")
    print(f"{pdf.stem}: {d.page_count} láminas · {problemas} problema(s)")
    d.close()
    return problemas


if __name__ == "__main__":
    args = sys.argv[1:]
    pngs = []
    if "--png" in args:
        k = args.index("--png")
        pngs = [int(x) for x in args[k + 1].split(",")]
        args = args[:k] + args[k + 2:]
    total = 0
    for a in args:
        total += revisar(convertir(Path(a).resolve()), pngs)
    sys.exit(1 if total else 0)
