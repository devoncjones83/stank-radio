#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-050.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-050 PLAYER SHELL CONTENT ALIGNMENT === */
@media (min-width: 1101px) {
  .shellCoverViewport {
    left: 26.2% !important;
    top: 19.1% !important;
    width: 47.1% !important;
    height: 46.7% !important;
  }

  .shellCoverViewport img {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    max-height: none !important;
    object-fit: cover !important;
  }

  .shellVizViewport {
    left: 73.7% !important;
    top: 18.9% !important;
    width: 22.1% !important;
    height: 19.2% !important;
  }

  .shellLyricsPanel {
    left: 73.7% !important;
    top: 40.3% !important;
    width: 22.1% !important;
    height: 33.8% !important;
    padding: 0.55rem 0.7rem !important;
  }

  .shellLyricsPanel .lyricsScroll {
    height: calc(100% - 24px) !important;
    overflow: hidden !important;
  }

  .shellDossierPanel {
    left: 6.3% !important;
    top: 67.4% !important;
    width: 66.4% !important;
    height: 9.2% !important;
    padding: 0.36rem 0.85rem !important;
  }

  .shellDossierPanel h2 {
    font-size: clamp(0.95rem, 1.65vw, 1.75rem) !important;
  }

  .shellDossierPanel p {
    font-size: 0.72rem !important;
    line-height: 1.16 !important;
    max-width: 95% !important;
  }

  .shellTransport {
    left: 4.6% !important;
    right: 4.9% !important;
    bottom: 5.2% !important;
    height: 6.9% !important;
  }

  .shellTransport .industrialStartLeak {
    min-width: 12.5rem !important;
  }

  .shellTitleStrip {
    left: 6.2% !important;
    top: 4.2% !important;
    width: 65.5% !important;
    height: 9.8% !important;
  }

  .shellTitleStrip span {
    font-size: 1rem !important;
  }

  .shellTitleStrip b {
    font-size: 0.72rem !important;
  }

  .shellCoverViewport em {
    top: 0.65rem !important;
    left: 0.7rem !important;
    font-size: 0.66rem !important;
  }
}
CSS

npm run build
echo "SR-050 complete. Refresh and check player content alignment."
