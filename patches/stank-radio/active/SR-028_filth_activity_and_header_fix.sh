#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/main.jsx "src/main.jsx.bak.SR-028.$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-028.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

p = Path("src/main.jsx")
s = p.read_text()

s = s.replace(
  '<main className="radioApp filthUpView">',
  '<main className={playing ? "radioApp filthUpView isPlaying" : "radioApp filthUpView"}>',
  1
)

p.write_text(s)
PY

cat >> src/styles.css <<'CSS'

/* === SR-028 FILTH ACTIVITY + HEADER FIX === */
@media (min-width: 1101px) {
  .industrialHeader.broadcastDeck {
    grid-template-columns:
      minmax(520px, 1.45fr)
      minmax(300px, 0.78fr)
      minmax(330px, 0.9fr)
      minmax(330px, 0.95fr);
  }

  .broadcastIdentityPanel {
    grid-template-columns: minmax(220px, 0.9fr) minmax(240px, 1fr);
    grid-template-rows: 1fr;
    align-items: center;
    column-gap: 0.9rem;
  }

  .broadcastIdentityPanel h1,
  .broadcastIdentityPanel > strong {
    grid-column: 1;
  }

  .broadcastIdentityPanel .broadcastIdentityCopy {
    grid-column: 2;
    align-content: center;
  }

  .broadcastDefinitionPanel span {
    font-size: 0.78rem;
    line-height: 1.35;
  }

  .radioApp.filthUpView .industrialArtworkBay {
    background:
      linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.72)),
      url("/images/filth-skull-tile.png") center / 220px 220px repeat,
      #050805 !important;
  }

  .radioApp.filthUpView .industrialArtworkBay img {
    position: relative;
    z-index: 2;
  }

  .radioApp.filthUpView.isPlaying .industrialMainBay::after {
    background: radial-gradient(circle at 35% 35%, #f4ffd8, #9eff35 42%, #2c8112 100%) !important;
    box-shadow:
      0 0 16px rgba(158,255,53,0.95),
      0 0 38px rgba(99,255,28,0.62) !important;
    animation: filthBeaconPulse 1.05s ease-in-out infinite !important;
  }

  .industrialLyrics {
    overflow: hidden;
  }

  .industrialLyrics .lyricsScroll {
    height: calc(100% - 28px);
    max-height: none;
    overflow: auto;
  }

  .industrialLyricsEmpty {
    font-size: 0.74rem;
    gap: 0.28rem;
    line-height: 1.2;
  }

  .industrialLyricsEmpty b {
    font-size: 0.82rem;
  }
}
CSS

npm run build
git status --short
