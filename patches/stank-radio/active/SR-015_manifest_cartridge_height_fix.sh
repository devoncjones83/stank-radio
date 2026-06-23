#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/main.jsx "src/main.jsx.bak.SR-015.$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-015.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

path = Path("src/main.jsx")
text = path.read_text()
text = text.replace(
  "const tracksPerPage = viewMode === 'filth' ? 7 : TRACKS_PER_PAGE;",
  "const tracksPerPage = viewMode === 'filth' ? 5 : TRACKS_PER_PAGE;"
)
path.write_text(text)
PY

cat >> src/styles.css <<'CSS'

/* === SR-015 MANIFEST CARTRIDGE HEIGHT FIX === */
@media (min-width: 1101px) {
  .industrialLibraryBay .trackList {
    display: grid;
    grid-template-rows: repeat(5, minmax(104px, 1fr));
    gap: 0.9rem;
    overflow: hidden;
  }

  .industrialLibraryBay .trackRow {
    height: auto !important;
    min-height: 104px;
    max-height: none;
    display: grid;
    grid-template-columns: 86px minmax(0, 1fr) 42px;
    padding: 0.7rem 0.65rem 0.7rem 0.75rem;
    gap: 1rem;
    align-items: center;
  }

  .industrialLibraryBay .trackRow img {
    width: 86px;
    height: 86px;
    grid-column: 1;
  }

  .industrialLibraryBay .trackRowText {
    grid-column: 2;
    padding-left: 0.25rem;
  }

  .industrialLibraryBay .trackRowText b {
    font-size: 1.22rem;
  }

  .industrialLibraryBay .trackRowText small {
    font-size: 0.78rem;
  }

  .industrialLibraryBay .trackRow::after {
    position: static;
    grid-column: 3;
    justify-self: center;
    align-self: center;
    width: 34px;
    height: 64px;
    margin: 0;
  }

  .industrialLibraryBay .trackRow::before {
    right: 1.3rem;
  }
}
CSS

npm run build
git status --short
