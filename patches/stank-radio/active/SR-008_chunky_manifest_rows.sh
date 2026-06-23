#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-008.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-008 CHUNKY MANIFEST ROWS === */
@media (min-width: 1101px) {
  .industrialLibraryBay {
    grid-template-rows: auto auto auto minmax(0, 1fr) 42px;
  }

  .industrialLibraryBay .trackList {
    display: grid;
    align-content: start;
    gap: 0.7rem;
    padding: 0.35rem 0.25rem 0.35rem 0;
  }

  .industrialLibraryBay .trackRow {
    min-height: 82px;
    padding: 0.65rem 4.1rem 0.65rem 0.75rem;
    gap: 0.85rem;
  }

  .industrialLibraryBay .trackRow img {
    width: 58px;
    height: 58px;
    border: 2px solid rgba(10, 12, 9, 0.95);
    box-shadow:
      inset 0 0 0 2px rgba(0,0,0,0.35),
      0 0 0 1px rgba(150,255,55,0.12);
  }

  .industrialLibraryBay .trackRowText b {
    font-size: 1.02rem;
    line-height: 1.05;
  }

  .industrialLibraryBay .trackRowText small {
    font-size: 0.7rem;
    margin-top: 0.25rem;
  }

  .industrialLibraryBay .trackRow::after {
    right: 0.75rem;
    width: 32px;
    height: 48px;
  }

  .industrialLibraryBay .trackRow::before {
    right: 1.35rem;
  }

  .industrialLibraryBay .trackRow.active {
    box-shadow:
      inset 0 0 0 2px rgba(174, 255, 71, 0.22),
      inset 0 -10px 18px rgba(0,0,0,0.46),
      0 0 12px rgba(142,255,51,0.18);
  }
}
CSS

npm run build
git status --short
