#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-049.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-049 DESKTOP HARDWARE GRID RECOVERY === */
@media (min-width: 1101px) {
  body:has(.radioApp.filthUpView),
  html:has(.radioApp.filthUpView) {
    overflow: hidden !important;
  }

  .radioApp.filthUpView {
    width: 100vw !important;
    height: 100vh !important;
    min-height: 100vh !important;
    overflow: hidden !important;
    display: block !important;
    padding: 0 !important;
  }

  .radioApp.filthUpView .backdrop,
  .radioApp.filthUpView .scanlines {
    position: fixed !important;
    inset: 0 !important;
  }

  .industrialShell {
    width: 100vw !important;
    height: 100vh !important;
    min-height: 0 !important;
    display: grid !important;
    grid-template-areas:
      "header header"
      "player library"
      "player library"
      "warning warning" !important;
    grid-template-columns: 37.5vw 62.5vw !important;
    grid-template-rows: 15.5vh 66.5vh 9vh 9vh !important;
    gap: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    align-items: stretch !important;
    justify-items: stretch !important;
  }

  .industrialHeader.broadcastDeck {
    grid-area: header !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
  }

  .industrialPlayerShell {
    grid-area: player !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    align-self: stretch !important;
    justify-self: stretch !important;
    background:
      url("/images/industrial-player-shell-v2-final.png")
      center center / 100% 100% no-repeat !important;
  }

  .industrialLibraryBay {
    grid-area: library !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    align-self: stretch !important;
    justify-self: stretch !important;
  }

  .industrialWarningStrip {
    grid-area: warning !important;
    width: 100% !important;
    height: 100% !important;
    align-self: stretch !important;
    justify-self: stretch !important;
    margin: 0 !important;
  }
}
CSS

npm run build
echo "SR-049 complete. Refresh desktop and inspect full-page grid."
