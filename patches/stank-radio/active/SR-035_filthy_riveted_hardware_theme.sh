#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-035.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-035 FILTHY RIVETED HARDWARE THEME === */
@media (min-width: 1101px) {
  .radioApp.filthUpView {
    --filth-metal-hi: rgba(101, 98, 82, 0.92);
    --filth-metal-mid: rgba(46, 46, 38, 0.98);
    --filth-metal-lo: rgba(12, 13, 10, 0.98);
    --filth-rust: rgba(113, 46, 24, 0.48);
    --filth-screen: rgba(2, 8, 3, 0.96);
  }

  .industrialHeader,
  .industrialLeftRail,
  .industrialMainBay,
  .industrialInfoBay,
  .industrialLibraryBay,
  .industrialWarningStrip,
  .broadcastIdentityPanel,
  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel,
  .broadcastStatusPanel,
  .industrialTrackTerminal,
  .industrialLyrics,
  .industrialLibraryBay .filterHeader,
  .industrialLibraryBay .searchBox,
  .industrialTransport,
  .industrialGauge,
  .industrialLedMeter,
  .industrialSignalQuality,
  .industrialLibraryBay .trackRow {
    border: 2px solid #080906 !important;
    background:
      radial-gradient(circle at 14px 14px, rgba(0,0,0,0.85) 0 3px, transparent 4px),
      radial-gradient(circle at calc(100% - 14px) 14px, rgba(0,0,0,0.85) 0 3px, transparent 4px),
      radial-gradient(circle at 14px calc(100% - 14px), rgba(0,0,0,0.85) 0 3px, transparent 4px),
      radial-gradient(circle at calc(100% - 14px) calc(100% - 14px), rgba(0,0,0,0.85) 0 3px, transparent 4px),
      linear-gradient(135deg, var(--filth-rust), transparent 18%),
      linear-gradient(180deg, var(--filth-metal-hi), var(--filth-metal-mid) 42%, var(--filth-metal-lo)) !important;
    box-shadow:
      inset 0 0 0 2px rgba(150, 143, 116, 0.18),
      inset 0 0 0 7px rgba(0,0,0,0.42),
      inset 0 0 28px rgba(0,0,0,0.78),
      0 0 0 1px rgba(120,255,48,0.10) !important;
  }

  .broadcastIdentityPanel,
  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel,
  .broadcastStatusPanel,
  .industrialTrackTerminal,
  .industrialLyrics,
  .industrialLibraryBay .searchBox {
    background:
      radial-gradient(circle at 14px 14px, rgba(0,0,0,0.75) 0 3px, transparent 4px),
      radial-gradient(circle at calc(100% - 14px) 14px, rgba(0,0,0,0.75) 0 3px, transparent 4px),
      radial-gradient(circle at 14px calc(100% - 14px), rgba(0,0,0,0.75) 0 3px, transparent 4px),
      radial-gradient(circle at calc(100% - 14px) calc(100% - 14px), rgba(0,0,0,0.75) 0 3px, transparent 4px),
      linear-gradient(180deg, rgba(9, 24, 7, 0.96), var(--filth-screen)),
      repeating-linear-gradient(0deg, rgba(150,255,55,0.04) 0 1px, transparent 1px 5px) !important;
  }

  .industrialGauge,
  .industrialLedMeter,
  .industrialSignalQuality {
    padding: 0.55rem;
  }

  .industrialGauge::before,
  .industrialSignalQuality::before,
  .industrialLedMeter::before {
    content: "";
    position: absolute;
    inset: 18px;
    pointer-events: none;
    border: 2px solid rgba(0,0,0,0.82);
    background:
      linear-gradient(180deg, rgba(2, 7, 2, 0.62), rgba(0,0,0,0.62));
    box-shadow:
      inset 0 0 0 1px rgba(150,255,55,0.08),
      inset 0 0 18px rgba(0,0,0,0.9);
    z-index: 0;
  }

  .industrialGauge > *,
  .industrialLedMeter > *,
  .industrialSignalQuality > * {
    position: relative;
    z-index: 2;
  }

  .industrialWarningStrip::after {
    display: none !important;
  }

  .industrialWarningStrip::before {
    content: "FIELD WARNING";
    position: absolute;
    right: 1.1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #baff42;
    font-size: 0.9rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-shadow: 0 0 8px rgba(158,255,53,0.38);
  }

  .industrialWarningStrip {
    padding-right: 11rem;
  }
}
CSS

npm run build
git status --short
