#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-020.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-020 BUTTON ALIGNMENT FIX === */
@media (min-width: 1101px) {
  .industrialMainBay::after {
    top: 50%;
    right: 13px;
    width: 26px;
    height: 26px;
    margin-top: -13px;
    z-index: 6;
  }

  .industrialLibraryBay .libraryPagination {
    position: relative;
    bottom: 0;
    transform: translateY(-10px);
    min-height: 40px;
    margin-top: -4px;
  }

  .industrialLibraryBay .libraryPagination button {
    width: 46px;
    height: 40px;
  }
}
CSS

npm run build
git status --short
