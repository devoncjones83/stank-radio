#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-016.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-016 ACCESSIBILITY + CROP FIXES === */
@media (min-width: 1101px) {
  /* Bigger, centered page controls */
  .industrialLibraryBay .libraryPagination {
    justify-content: center;
    align-items: center;
    gap: 0.85rem;
    min-height: 46px;
    padding: 0.35rem;
  }

  .industrialLibraryBay .libraryPagination button {
    width: 42px;
    height: 38px;
    display: grid;
    place-items: center;
  }

  .industrialLibraryBay .libraryPagination span {
    font-size: 0.86rem;
    letter-spacing: 0.08em;
  }

  /* Center cover art and avoid bottom clipping */
  .industrialArtworkBay img {
    object-fit: contain;
    object-position: center center;
    background: #050805;
  }

  /* Give the lower left track terminal room to breathe */
  .industrialInfoBay {
    grid-template-columns: minmax(360px, 0.52fr) minmax(420px, 0.48fr);
  }

  .industrialTrackTerminal {
    overflow: hidden;
    padding: 0.65rem;
  }

  .industrialTrackTerminal h2 {
    font-size: clamp(1.55rem, 2.25vw, 2.65rem);
    line-height: 0.92;
    margin-bottom: 0.45rem;
  }

  .industrialTrackTerminal > p:not(.trackTag) {
    max-height: 2.6em;
    overflow: hidden;
  }

  .industrialTrackTerminal dl {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.25rem 0.65rem;
  }

  .industrialTrackTerminal dt {
    font-size: 0.62rem;
  }

  .industrialTrackTerminal dd {
    font-size: 0.8rem;
  }
}
CSS

npm run build
git status --short
