#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-021.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-021 BEACON + PAGER MICROFIX === */
@media (min-width: 1101px) {
  .industrialMainBay::after {
    top: 28px;
    right: 14px;
    width: 22px;
    height: 22px;
    margin-top: 0;
  }

  .industrialLibraryBay .libraryPagination {
    transform: translateY(-4px);
  }
}
CSS

npm run build
git status --short
