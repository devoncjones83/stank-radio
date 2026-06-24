#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-032.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-032 BRAND + SIGNAL WAVE TUNE === */
@media (min-width: 1101px) {
  .broadcastIdentityPanel h1 {
    font-size: clamp(2.35rem, 3.55vw, 4.3rem);
  }

  .broadcastIdentityPanel > strong {
    font-size: 0.96rem;
  }

  .broadcastIdentityCopy {
    transform: translateY(-18px);
  }

  .radioApp.filthUpView.isPlaying .industrialSignalQuality i {
    height: 42px;
    background:
      repeating-linear-gradient(
        90deg,
        transparent 0 7px,
        #9eff35 7px 10px,
        transparent 10px 17px
      );
    clip-path: polygon(
      0% 50%,
      6% 20%,
      12% 80%,
      18% 35%,
      24% 65%,
      30% 15%,
      36% 85%,
      42% 40%,
      48% 60%,
      54% 25%,
      60% 75%,
      66% 30%,
      72% 70%,
      78% 18%,
      84% 82%,
      90% 38%,
      96% 62%,
      100% 50%
    );
    animation: signalWaveMove 0.75s linear infinite;
  }

  .radioApp.filthUpView:not(.isPlaying) .industrialSignalQuality i {
    height: 18px;
    background: linear-gradient(90deg, transparent 0 8%, #9eff35 8% 92%, transparent 92%);
    clip-path: none;
    animation: none;
  }
}
CSS

npm run build
git status --short
