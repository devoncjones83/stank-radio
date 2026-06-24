#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-030.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-030 TYPE READABILITY PASS === */
@media (min-width: 1101px) {
  .broadcastIdentityPanel h1 {
    color: #d8ff58;
    -webkit-text-stroke: 1px rgba(10, 16, 6, 0.85);
    text-shadow:
      2px 2px 0 rgba(0,0,0,0.95),
      0 0 8px rgba(140,255,45,0.28);
    filter: none;
  }

  .broadcastIdentityPanel > strong {
    font-size: 0.86rem;
    color: #fff2cf;
  }

  .broadcastIdentityCopy span {
    font-size: 0.95rem;
    color: #fff2cf;
  }

  .broadcastIdentityCopy b {
    font-size: 1.48rem;
  }

  .broadcastIdentityCopy em {
    font-size: 0.92rem;
  }

  .industrialWarningStrip span,
  .industrialWarningStrip b {
    font-size: 0.94rem;
    letter-spacing: 0.04em;
  }

  .industrialWarningStrip {
    grid-template-columns: 190px repeat(3, 1fr);
  }
}
CSS

npm run build
git status --short
