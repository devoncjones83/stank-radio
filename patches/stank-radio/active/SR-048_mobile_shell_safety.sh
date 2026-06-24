#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-048.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-048 MOBILE SHELL SAFETY === */
@media (max-width: 1100px) {
  .industrialPlayerShell {
    position: relative;
    min-height: 760px;
    background:
      url("/images/industrial-player-shell-v2-final.png")
      center top / contain no-repeat;
    overflow: hidden;
  }

  .shellMeters,
  .shellVizViewport,
  .shellTitleStrip {
    display: none !important;
  }

  .shellCoverViewport {
    position: absolute;
    left: 8%;
    right: 8%;
    top: 17%;
    height: 43%;
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .shellCoverViewport img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .shellDossierPanel {
    position: absolute;
    left: 8%;
    right: 8%;
    top: 63%;
    height: 11%;
    overflow: hidden;
  }

  .shellLyricsPanel {
    position: absolute;
    left: 8%;
    right: 8%;
    top: 76%;
    height: 11%;
    overflow: hidden;
  }

  .shellTransport {
    position: absolute !important;
    left: 7%;
    right: 7%;
    bottom: 4%;
    display: flex;
    gap: 0.25rem;
  }

  .shellTransport button {
    font-size: 0.65rem !important;
    padding: 0.35rem !important;
  }
}
CSS

npm run build
echo "SR-048 complete. Mobile shell safety added."
