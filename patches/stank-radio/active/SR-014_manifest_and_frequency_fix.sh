#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-014.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-014 MANIFEST + FREQUENCY FIX === */
@media (min-width: 1101px) {
  .broadcastIdentityPanel strong {
    font-size: 1.45rem;
    line-height: 1;
    margin-top: 0.25rem;
    color: #d8ff58;
    text-shadow: 0 0 12px rgba(160,255,45,0.35);
  }

  .industrialStatusRail b {
    display: none;
  }

  .industrialStatusRail {
    justify-content: flex-start;
  }

  .industrialLibraryBay .trackList {
    gap: 0.78rem;
  }

  .industrialLibraryBay .trackRow {
    height: calc((100% - 4.68rem) / 7);
    min-height: 86px;
    padding: 0.55rem 4.4rem 0.55rem 1rem;
    display: grid;
    grid-template-columns: 78px minmax(0, 1fr);
    align-items: center;
    overflow: hidden;
  }

  .industrialLibraryBay .trackRow img {
    width: 78px;
    height: 78px;
    grid-column: 1;
    align-self: center;
    justify-self: center;
  }

  .industrialLibraryBay .trackRowText {
    grid-column: 2;
    display: grid;
    align-content: center;
    padding-left: 0.35rem;
    min-width: 0;
    overflow: hidden;
  }

  .industrialLibraryBay .trackRowText b {
    font-size: 1.16rem;
    line-height: 1.05;
  }

  .industrialLibraryBay .trackRowText small {
    font-size: 0.74rem;
    margin-top: 0.28rem;
  }
}
CSS

npm run build
git status --short
