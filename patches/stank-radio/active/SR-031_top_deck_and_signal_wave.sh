#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-031.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-031 TOP DECK + SIGNAL WAVE === */
@media (min-width: 1101px) {
  .broadcastIdentityCopy {
    transform: translateY(-8px);
  }

  .broadcastIdentityCopy span {
    font-size: 1.08rem;
  }

  .broadcastIdentityCopy b {
    font-size: 1.72rem;
  }

  .broadcastIdentityCopy em {
    font-size: 1.02rem;
  }

  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel {
    text-align: center;
    align-content: center;
  }

  .broadcastDefinitionPanel p,
  .broadcastContaminantsPanel p {
    color: #d8ff58;
    font-size: 1.02rem;
    text-shadow: 0 0 10px rgba(158,255,53,0.38);
  }

  .broadcastDefinitionPanel span,
  .broadcastContaminantsPanel span,
  .broadcastContaminantsPanel strong {
    font-size: 0.94rem;
  }

  .industrialSignalQuality i {
    height: 32px;
    width: 82%;
    background:
      linear-gradient(90deg, transparent 0 8%, #9eff35 8% 92%, transparent 92%);
    background-size: 100% 2px;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.7;
  }

  .radioApp.filthUpView.isPlaying .industrialSignalQuality i {
    background:
      linear-gradient(90deg,
        transparent 0 2%,
        #9eff35 2% 6%,
        transparent 6% 10%,
        #9eff35 10% 17%,
        transparent 17% 22%,
        #9eff35 22% 31%,
        transparent 31% 36%,
        #9eff35 36% 44%,
        transparent 44% 50%,
        #9eff35 50% 61%,
        transparent 61% 66%,
        #9eff35 66% 76%,
        transparent 76% 82%,
        #9eff35 82% 90%,
        transparent 90% 100%);
    background-size: 160% 100%;
    animation: signalWaveMove 0.85s linear infinite;
    box-shadow: 0 0 14px rgba(158,255,53,0.5);
  }

  @keyframes signalWaveMove {
    from { background-position: 0 0; }
    to { background-position: -160% 0; }
  }
}
CSS

npm run build
git status --short
