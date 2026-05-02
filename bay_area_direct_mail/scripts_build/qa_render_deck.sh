#!/usr/bin/env bash
#
# QA workflow from the brief:
#     pptx -> PDF via LibreOffice (soffice)
#     PDF  -> JPEG via `pdftoppm -jpeg -r 150` for visual inspection
#
# Requires: libreoffice (soffice) and poppler-utils (pdftoppm).
#
# macOS:   brew install libreoffice poppler
# Debian:  sudo apt-get install libreoffice poppler-utils
#
# Usage: ./scripts_build/qa_render_deck.sh deck/pitch-deck_danville_2026-05-02.pptx

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <pptx-file>"
  exit 1
fi

PPTX="$1"
if [ ! -f "$PPTX" ]; then
  echo "File not found: $PPTX"
  exit 1
fi

OUT_DIR="$(dirname "$PPTX")/qa"
mkdir -p "$OUT_DIR"

if ! command -v soffice >/dev/null 2>&1; then
  echo "soffice (LibreOffice) is required."
  exit 2
fi

if ! command -v pdftoppm >/dev/null 2>&1; then
  echo "pdftoppm (poppler-utils) is required."
  exit 2
fi

echo "Converting to PDF..."
soffice --headless --convert-to pdf --outdir "$OUT_DIR" "$PPTX"

PDF="$OUT_DIR/$(basename "${PPTX%.pptx}.pdf")"
echo "Rendering JPEGs (150 dpi) from $PDF..."
pdftoppm -jpeg -r 150 "$PDF" "$OUT_DIR/$(basename "${PPTX%.pptx}")"

echo "Done. Outputs in: $OUT_DIR"
ls -la "$OUT_DIR"
