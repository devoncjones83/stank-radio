#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-033.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-033 SIGNAL QUALITY FLOW WAVE === */
@media (min-width: 1101px) {
  .industrialSignalQuality {
    overflow: hidden;
  }

  .industrialSignalQuality i {
    position: relative;
    display: block;
    width: 88%;
    height: 38px;
    margin: 0 auto;
    overflow: hidden;
    background: transparent !important;
    clip-path: none !important;
  }

  .industrialSignalQuality i::before,
  .industrialSignalQuality i::after {
    content: "";
    position: absolute;
    left: -50%;
    top: 50%;
    width: 200%;
    height: 22px;
    border-radius: 50%;
    opacity: 0.9;
    filter: blur(0.5px);
    background:
      radial-gradient(ellipse at center, rgba(180,255,120,0.95) 0 8%, transparent 9%),
      linear-gradient(90deg,
        transparent 0%,
        rgba(120,255,65,0.15) 12%,
        rgba(170,255,100,0.95) 25%,
        rgba(110,255,55,0.2) 38%,
        rgba(210,255,150,0.95) 50%,
        rgba(110,255,55,0.2) 62%,
        rgba(170,255,100,0.95) 75%,
        rgba(120,255,65,0.15) 88%,
        transparent 100%);
    transform: translateY(-50%);
    box-shadow:
      0 0 10px rgba(120,255,55,0.75),
      0 0 22px rgba(120,255,55,0.35);
  }

  .radioApp.filthUpView:not(.isPlaying) .industrialSignalQuality i::before,
  .radioApp.filthUpView:not(.isPlaying) .industrialSignalQuality i::after {
    height: 2px;
    top: 50%;
    background: #9eff35;
    opacity: 0.65;
    animation: none;
  }

  .radioApp.filthUpView.isPlaying .industrialSignalQuality i::before {
    animation: stankWaveFlow 1.6s linear infinite, stankWaveFloat 2.4s ease-in-out infinite;
  }

  .radioApp.filthUpView.isPlaying .industrialSignalQuality i::after {
    height: 16px;
    opacity: 0.45;
    filter: blur(5px);
    animation: stankWaveFlow 2.2s linear infinite reverse, stankWaveFloatAlt 2s ease-in-out infinite;
  }

  @keyframes stankWaveFlow {
    from { transform: translate(-8%, -50%); }
    to { transform: translate(8%, -50%); }
  }

  @keyframes stankWaveFloat {
    0%, 100% { clip-path: polygon(0 55%, 8% 28%, 16% 62%, 24% 34%, 32% 68%, 40% 42%, 48% 22%, 56% 58%, 64% 35%, 72% 70%, 80% 40%, 88% 24%, 100% 56%, 100% 100%, 0 100%); }
    50% { clip-path: polygon(0 42%, 8% 70%, 16% 36%, 24% 64%, 32% 28%, 40% 58%, 48% 72%, 56% 38%, 64% 62%, 72% 30%, 80% 60%, 88% 74%, 100% 44%, 100% 100%, 0 100%); }
  }

  @keyframes stankWaveFloatAlt {
    0%, 100% { transform: translate(-6%, -50%) scaleY(0.8); }
    50% { transform: translate(6%, -50%) scaleY(1.15); }
  }
}
CSS

npm run build
git status --short
