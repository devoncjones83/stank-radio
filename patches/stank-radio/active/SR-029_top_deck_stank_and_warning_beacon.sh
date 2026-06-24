#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-029.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-029 TOP DECK STANK + WARNING BEACON === */
@media (min-width: 1101px) {
  .broadcastIdentityPanel h1 {
    color: #fff0cf;
    font-size: clamp(2.05rem, 3.15vw, 4rem);
    line-height: 0.78;
    letter-spacing: -0.085em;
    text-shadow:
      0 0 14px rgba(178,255,65,0.28),
      3px 3px 0 rgba(117, 43, 27, 0.95);
  }

  .broadcastIdentityPanel > strong {
    color: #c8c0a2;
    font-size: 0.72rem;
    letter-spacing: 0.105em;
  }

  .broadcastIdentityCopy span {
    color: #efe9c9;
    font-size: 0.82rem;
    font-weight: 900;
  }

  .broadcastIdentityCopy b {
    color: #d8ff58;
    font-size: 1.38rem;
    line-height: 0.95;
    letter-spacing: 0.08em;
    text-shadow: 0 0 12px rgba(158,255,53,0.42);
  }

  .broadcastIdentityCopy em {
    color: #fff4d6;
    font-size: 0.82rem;
    font-weight: 900;
  }

  .broadcastDefinitionPanel p,
  .broadcastContaminantsPanel p {
    color: #d6ff56;
    font-size: 0.88rem;
    letter-spacing: 0.1em;
  }

  .broadcastDefinitionPanel span,
  .broadcastContaminantsPanel span,
  .broadcastContaminantsPanel strong {
    color: #fff1cf;
    font-size: 0.86rem;
    line-height: 1.36;
    font-weight: 900;
  }

  .broadcastContaminantsPanel strong {
    color: #caff57;
    text-shadow: 0 0 9px rgba(158,255,53,0.35);
  }

  .industrialWarningStrip::after {
    background: radial-gradient(circle at 35% 35%, #ffd0bd, #e64b2b 45%, #641609 100%);
    box-shadow:
      0 0 10px rgba(255,80,40,0.75),
      0 0 24px rgba(255,40,20,0.45);
  }

  .radioApp.filthUpView.isPlaying .industrialWarningStrip::after {
    background: radial-gradient(circle at 35% 35%, #f4ffd8, #9eff35 42%, #2c8112 100%);
    box-shadow:
      0 0 16px rgba(158,255,53,0.95),
      0 0 38px rgba(99,255,28,0.62);
    animation: filthBeaconPulse 1.05s ease-in-out infinite;
  }
}
CSS

npm run build
git status --short
