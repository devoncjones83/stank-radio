#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-044.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-044 HARDWARE LAYOUT SHELL === */
@media (min-width: 1101px) {
  .industrialShell {
    grid-template-rows: 132px minmax(0, 1fr) 190px 78px !important;
  }

  /* HEADER: use rendered hardware, hide old duplicate React header text */
  .industrialHeader.broadcastDeck {
    background: url("/images/industrial-header-filthup-v1.png") center center / 100% 100% no-repeat !important;
    border: 0 !important;
    box-shadow: none !important;
    overflow: hidden !important;
  }

  .broadcastIdentityPanel,
  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel,
  .broadcastStatusPanel {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  .broadcastIdentityPanel,
  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel,
  .broadcastStatusControls,
  .broadcastWaveform,
  .viewToggle {
    visibility: hidden !important;
  }

  /* LEFT RAIL: real double meter face */
  .industrialLeftRail {
    position: relative !important;
    background:
      url("/images/industrial-double-meter-face-v1.png") top center / 100% auto no-repeat,
      linear-gradient(180deg, #30352e, #10140f) !important;
    border: 0 !important;
    box-shadow: none !important;
    overflow: hidden !important;
    padding: 0 !important;
  }

  .industrialGauge,
  .industrialLedMeter,
  .industrialSignalQuality {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  .industrialGauge::before,
  .industrialGauge::after,
  .industrialLedMeter,
  .industrialSignalQuality,
  .industrialGauge span,
  .industrialGauge b {
    display: none !important;
  }

  .industrialGauge {
    display: block !important;
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    height: 50% !important;
    pointer-events: none !important;
  }

  .industrialGauge:nth-child(1) {
    top: 0 !important;
  }

  .industrialGauge:nth-child(2) {
    top: 24.5% !important;
  }

  .industrialGauge i {
    display: block !important;
    position: absolute !important;
    left: 50% !important;
    top: 34% !important;
    width: 34% !important;
    height: 4px !important;
    border: 0 !important;
    border-radius: 3px !important;
    background: #0d0a07 !important;
    transform-origin: left center !important;
    transform: rotate(-42deg) !important;
    box-shadow:
      0 1px 1px rgba(255,255,255,0.18),
      0 0 5px rgba(0,0,0,0.9) !important;
  }

  .radioApp.filthUpView.isPlaying .industrialGauge:nth-child(1) i {
    transform: rotate(-8deg) !important;
  }

  .radioApp.filthUpView.isPlaying .industrialGauge:nth-child(2) i {
    transform: rotate(10deg) !important;
  }

  /* FOOTER: use warning banner asset */
  .industrialWarningStrip {
    background: url("/images/industrial-warning-banner-v1.png") center center / 100% 100% no-repeat !important;
    border: 0 !important;
    box-shadow: none !important;
    animation: none !important;
    padding: 0.45rem 4.8rem 0.45rem 1rem !important;
  }

  .industrialWarningStrip::before,
  .industrialWarningStrip::after {
    display: none !important;
    content: none !important;
  }

  .industrialWarningStrip b,
  .industrialWarningStrip span,
  .warningPlate {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    color: #fff0cf !important;
    font-size: 0.95rem !important;
    text-shadow: 1px 1px 0 #000, 0 0 8px rgba(255,60,35,0.45) !important;
  }
}

CSS

npm run build
echo "SR-044 complete. Refresh and inspect header, left rail, and footer only."
