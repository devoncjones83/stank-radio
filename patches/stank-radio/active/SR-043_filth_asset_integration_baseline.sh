#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-043.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-043 FILTH ASSET INTEGRATION BASELINE === */
@media (min-width: 1101px) {
  /* Header becomes real hardware art */
  .industrialHeader.broadcastDeck {
    background:
      url("/images/industrial-header-filthup-v1.png")
      center center / 100% 100% no-repeat !important;
    border: 0 !important;
    box-shadow: none !important;
    min-height: 132px !important;
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

  /* keep live status usable over the rendered header */
  .broadcastStatusControls,
  .broadcastWaveform,
  .viewToggle {
    position: relative;
    z-index: 4;
  }

  /* Left rail meter asset */
  .industrialLeftRail {
    background:
      url("/images/industrial-double-meter-face-v1.png")
      top center / 100% auto no-repeat,
      linear-gradient(180deg, #30362f, #111510) !important;
    border: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  .industrialGauge {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  .industrialGauge::before,
  .industrialGauge::after,
  .industrialGauge span,
  .industrialGauge b {
    display: none !important;
  }

  .industrialGauge i {
    position: absolute !important;
    left: 50% !important;
    width: 34% !important;
    height: 4px !important;
    background: #0c0907 !important;
    border: 0 !important;
    border-radius: 4px !important;
    transform-origin: left center !important;
    box-shadow:
      0 1px 1px rgba(255,255,255,0.22),
      0 0 4px rgba(0,0,0,0.85) !important;
    z-index: 10 !important;
  }

  .industrialGauge:nth-child(1) i {
    top: 13.8% !important;
    transform: rotate(-42deg) !important;
  }

  .industrialGauge:nth-child(2) i {
    top: 36.8% !important;
    transform: rotate(-42deg) !important;
  }

  .radioApp.filthUpView.isPlaying .industrialGauge:nth-child(1) i {
    transform: rotate(-8deg) !important;
  }

  .radioApp.filthUpView.isPlaying .industrialGauge:nth-child(2) i {
    transform: rotate(10deg) !important;
  }

  /* warning banner asset */
  .industrialWarningStrip {
    background:
      url("/images/industrial-warning-banner-v1.png")
      center center / 100% 100% no-repeat !important;
    border: 0 !important;
    box-shadow: none !important;
    animation: none !important;
    padding: 0.55rem 3.8rem 0.55rem 1rem !important;
  }

  .industrialWarningStrip::before,
  .industrialWarningStrip::after {
    display: none !important;
    content: none !important;
  }

  .industrialWarningStrip b,
  .warningPlate {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    color: #fff0cf !important;
    text-shadow:
      1px 1px 0 #000,
      0 0 7px rgba(255,70,45,0.45) !important;
    font-size: 1rem !important;
  }

  .warningPlate {
    color: #ffd9b2 !important;
  }

  /* make remaining CSS rivets look like rivets, not holes */
  .industrialMainBay,
  .industrialInfoBay,
  .industrialLibraryBay,
  .industrialTrackTerminal,
  .industrialLyrics,
  .industrialLibraryBay .trackRow,
  .industrialTransport,
  .searchBox,
  .filterHeader {
    background-blend-mode: normal !important;
  }

  .industrialMainBay::before,
  .industrialInfoBay::before,
  .industrialLibraryBay::before,
  .industrialTrackTerminal::before,
  .industrialLyrics::before {
    background:
      radial-gradient(circle at 12px 12px, #b8b2a2 0 3px, #5d584c 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 12px) 12px, #b8b2a2 0 3px, #5d584c 4px 6px, transparent 7px),
      radial-gradient(circle at 12px calc(100% - 12px), #b8b2a2 0 3px, #5d584c 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 12px) calc(100% - 12px), #b8b2a2 0 3px, #5d584c 4px 6px, transparent 7px) !important;
  }
}

CSS

npm run build
echo "SR-043 complete. Header, left meter face, warning banner integrated."
