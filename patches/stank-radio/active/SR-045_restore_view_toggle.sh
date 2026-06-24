#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-045.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-045 RESTORE VIEW TOGGLE === */
@media (min-width: 1101px) {
  .viewToggle {
    visibility: visible !important;
    position: fixed !important;
    right: 18px !important;
    top: 18px !important;
    z-index: 9999 !important;
  }
}
CSS

npm run build
echo "SR-045 complete. View toggle restored."
