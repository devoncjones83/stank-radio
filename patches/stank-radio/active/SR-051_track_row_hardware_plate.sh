#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-051.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-051 TRACK ROW HARDWARE PLATE === */
@media (min-width: 1101px) {
  .industrialLibraryBay .trackRow {
    position: relative !important;
    overflow: hidden !important;
    background:
      url("/images/industrial-track-row-v2.png")
      center center / 100% 100% no-repeat !important;
    border: 0 !important;
    box-shadow: none !important;
    padding: 0.45rem 5.8rem 0.45rem 1.05rem !important;
    display: grid !important;
    grid-template-columns: 70px minmax(0, 1fr) !important;
    gap: 0.9rem !important;
    align-items: center !important;
  }

  .industrialLibraryBay .trackRow::before,
  .industrialLibraryBay .trackRow::after {
    display: none !important;
    content: none !important;
  }

  .industrialLibraryBay .trackRow img {
    width: 54px !important;
    height: 54px !important;
    justify-self: center !important;
    object-fit: cover !important;
    border: 1px solid rgba(186,255,66,0.25) !important;
    box-shadow:
      0 0 0 1px rgba(0,0,0,0.85),
      0 0 10px rgba(0,0,0,0.55) !important;
  }

  .industrialLibraryBay .trackRowText {
    min-width: 0 !important;
    overflow: hidden !important;
  }

  .industrialLibraryBay .trackRowText b {
    color: #fff0cf !important;
    font-size: 0.98rem !important;
    line-height: 1.05 !important;
    text-shadow: 1px 1px 0 #000 !important;
  }

  .industrialLibraryBay .trackRowText small {
    color: rgba(255,240,207,0.75) !important;
    font-size: 0.64rem !important;
    line-height: 1 !important;
  }

  .industrialLibraryBay .trackRow.active {
    filter: brightness(1.12) saturate(1.08) !important;
  }
}
CSS

npm run build
echo "SR-051 complete. Refresh and inspect track row hardware plates."
