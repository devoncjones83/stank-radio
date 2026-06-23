#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-022.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-022 BEACON PLAY STATE === */
@media (min-width: 1101px) {
  .industrialMainBay::after {
    top: 18px;
    right: 13px;
    width: 28px;
    height: 28px;
    margin-top: 0;
    background:
      radial-gradient(circle at 35% 35%, #ffb2a0, #c83d1f 45%, #5f1409 100%);
    box-shadow:
      0 0 12px rgba(255,80,40,0.55),
      0 0 28px rgba(255,40,20,0.35);
  }

  .radioApp.isPlaying.filthUpView .industrialMainBay::after {
    background:
      radial-gradient(circle at 35% 35%, #f0ffd5, #9eff35 42%, #2e7f12 100%);
    box-shadow:
      0 0 14px rgba(158,255,53,0.85),
      0 0 34px rgba(99,255,28,0.55);
    animation: filthBeaconPulse 1.15s ease-in-out infinite;
  }

  @keyframes filthBeaconPulse {
    0%, 100% {
      transform: scale(0.92);
      opacity: 0.75;
    }
    50% {
      transform: scale(1.08);
      opacity: 1;
    }
  }
}
CSS

npm run build
git status --short
