#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-023.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-023 COVER ART CONTAIN FIX === */
@media (min-width: 1101px) {
  .radioApp.filthUpView .industrialArtworkBay {
    background: #050805;
  }

  .radioApp.filthUpView .industrialArtworkBay img {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
    object-position: center center !important;
    background: #050805;
  }
}
CSS

npm run build
git status --short
