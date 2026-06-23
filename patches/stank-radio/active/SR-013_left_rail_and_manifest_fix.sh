#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/main.jsx "src/main.jsx.bak.SR-013.$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-013.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

path = Path("src/main.jsx")
text = path.read_text()

text = text.replace(
"const tracksPerPage = viewMode === 'filth' ? 6 : TRACKS_PER_PAGE;",
"const tracksPerPage = viewMode === 'filth' ? 7 : TRACKS_PER_PAGE;"
)

path.write_text(text)
PY

cat >> src/styles.css <<'CSS'

/* === SR-013 LEFT RAIL + MANIFEST FIX === */
@media (min-width: 1101px) {
  /* Left telemetry fills the full rail evenly */
  .industrialLeftRail {
    grid-template-rows: 1fr 1fr 1.3fr 1fr;
    align-content: stretch;
  }

  .industrialGauge,
  .industrialLedMeter,
  .industrialSignalQuality {
    height: 100%;
    min-height: 0;
    max-height: none;
  }

  .industrialLedMeter {
    align-items: end;
  }

  /* Manifest rows: contain the cover art instead of letting it hang out */
  .industrialLibraryBay {
    grid-template-rows: auto auto auto minmax(0, 1fr) 38px;
  }

  .industrialLibraryBay .trackList {
    display: flex;
    flex-direction: column;
    gap: 0.62rem;
    overflow: hidden;
  }

  .industrialLibraryBay .trackRow {
    min-height: 0;
    height: calc((100% - 3.72rem) / 7);
    padding: 0.45rem 4.35rem 0.45rem 0.7rem;
    gap: 0.85rem;
    align-items: center;
    overflow: hidden;
  }

  .industrialLibraryBay .trackRow img {
    width: 68px;
    height: 68px;
    flex: 0 0 68px;
    object-fit: cover;
  }

  .industrialLibraryBay .trackRowText {
    min-width: 0;
    overflow: hidden;
  }

  .industrialLibraryBay .trackRowText b {
    font-size: 1.08rem;
    line-height: 1.05;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .industrialLibraryBay .trackRowText small {
    font-size: 0.72rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .industrialLibraryBay .trackRow::after {
    right: 0.72rem;
    width: 32px;
    height: 52px;
  }

  .industrialLibraryBay .trackRow::before {
    right: 1.3rem;
  }
}
CSS

npm run build
git status --short
