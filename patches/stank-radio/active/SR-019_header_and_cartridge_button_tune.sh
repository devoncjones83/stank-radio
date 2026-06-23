#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-019.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-019 HEADER + CARTRIDGE BUTTON TUNE === */
@media (min-width: 1101px) {
  .broadcastIdentityPanel {
    gap: 0.22rem;
  }

  .broadcastIdentityPanel h1 {
    font-size: clamp(1.75rem, 2.75vw, 3.35rem);
    line-height: 0.86;
    letter-spacing: -0.07em;
  }

  .broadcastIdentityPanel strong {
    font-size: 0.68rem;
    line-height: 1.05;
  }

  .broadcastIdentityCopy span,
  .broadcastIdentityCopy em {
    font-size: 0.72rem;
    line-height: 1.05;
  }

  .broadcastIdentityCopy b {
    font-size: 0.92rem;
    line-height: 1.05;
  }

  .industrialLibraryBay .trackRow {
    grid-template-columns: 86px minmax(0, 1fr) 52px;
  }

  .industrialLibraryBay .trackRow::after {
    width: 42px;
    height: 72px;
    justify-self: center;
    align-self: center;
  }

  .industrialLibraryBay .trackRow::before {
    right: 1.62rem;
    top: 50%;
  }
}
CSS

npm run build
git status --short
