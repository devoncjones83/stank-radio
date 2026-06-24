#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-041.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-041 HEADER IDENTITY TEXT PLACEMENT === */
@media (min-width: 1101px) {
  .broadcastIdentityPanel {
    display: grid !important;
    grid-template-columns: 250px minmax(0, 1fr) !important;
    grid-template-rows: 58px 1fr !important;
    align-items: center !important;
    column-gap: 1.2rem !important;
    padding: 0.55rem 1.1rem 0.65rem !important;
  }

  .broadcastIdentityPanel h1 {
    grid-column: 1 / 2 !important;
    grid-row: 1 / 2 !important;
    align-self: start !important;
    margin: 0 !important;
    font-size: clamp(2rem, 2.9vw, 3.35rem) !important;
    line-height: 0.82 !important;
  }

  .broadcastIdentityPanel > strong {
    grid-column: 1 / 2 !important;
    grid-row: 2 / 3 !important;
    align-self: end !important;
    margin: 0 0 0.15rem !important;
    font-size: 0.82rem !important;
    line-height: 1.05 !important;
  }

  .broadcastIdentityCopy {
    grid-column: 2 / 3 !important;
    grid-row: 1 / 3 !important;
    align-self: center !important;
    justify-self: start !important;
    max-width: 100% !important;
    transform: none !important;
    display: grid !important;
    gap: 0.1rem !important;
  }

  .broadcastIdentityCopy span {
    font-size: 0.95rem !important;
    line-height: 1 !important;
  }

  .broadcastIdentityCopy b {
    font-size: 1.42rem !important;
    line-height: 0.95 !important;
  }

  .broadcastIdentityCopy em {
    font-size: 0.9rem !important;
    line-height: 1.05 !important;
    max-width: 360px !important;
  }
}
CSS

npm run build
echo "SR-041 complete. Refresh and review header text placement."
