#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-040.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-040 HEADER FOOTER LYRICS RIVET CLEANUP === */
@media (min-width: 1101px) {
  /* stop top deck clipping */
  .industrialShell {
    grid-template-rows: 148px minmax(0, 1fr) 192px 76px !important;
  }

  .industrialHeader.broadcastDeck {
    min-height: 140px !important;
    overflow: visible !important;
  }

  .broadcastIdentityPanel,
  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel,
  .broadcastStatusPanel {
    overflow: hidden !important;
    padding: 0.7rem 0.95rem !important;
  }

  .broadcastIdentityPanel h1 {
    font-size: clamp(1.85rem, 2.85vw, 3.35rem) !important;
    line-height: 0.9 !important;
    margin-top: 0 !important;
    transform: none !important;
  }

  .broadcastContaminantsPanel strong {
    font-size: 0.76rem !important;
    line-height: 1.1 !important;
    margin-top: 0.25rem !important;
  }

  /* real light grey rivets */
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
  .industrialLibraryBay .trackRow,
  .terminalPlate,
  .warningPlate {
    background-blend-mode: normal !important;
  }

  .broadcastIdentityPanel,
  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel,
  .broadcastStatusPanel,
  .industrialGauge,
  .industrialLedMeter,
  .industrialSignalQuality,
  .industrialTrackTerminal,
  .industrialLyrics,
  .industrialLibraryBay .trackRow {
    background:
      radial-gradient(circle at 12px 12px, #b6b0a0 0 3px, #5f5b50 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 12px) 12px, #b6b0a0 0 3px, #5f5b50 4px 6px, transparent 7px),
      radial-gradient(circle at 12px calc(100% - 12px), #b6b0a0 0 3px, #5f5b50 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 12px) calc(100% - 12px), #b6b0a0 0 3px, #5f5b50 4px 6px, transparent 7px),
      linear-gradient(180deg, rgba(44,46,38,0.96), rgba(8,10,7,0.98)) !important;
  }

  /* left rail: make it less weird for now */
  .industrialLeftRail {
    background:
      radial-gradient(circle at 18px 18px, #b6b0a0 0 3px, #5f5b50 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 18px) 18px, #b6b0a0 0 3px, #5f5b50 4px 6px, transparent 7px),
      radial-gradient(circle at 18px calc(100% - 18px), #b6b0a0 0 3px, #5f5b50 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 18px) calc(100% - 18px), #b6b0a0 0 3px, #5f5b50 4px 6px, transparent 7px),
      linear-gradient(180deg, #4f554d, #232922 48%, #0d110d) !important;
  }

  .industrialGauge::before {
    inset: 14px 12px 34px !important;
  }

  .industrialGauge i {
    top: 34px !important;
    height: 50px !important;
  }

  .industrialGauge b {
    font-size: 0.7rem !important;
  }

  /* lyrics cleanup */
  .industrialLyrics .lyricsHeading {
    display: none !important;
  }

  .industrialLyrics .lyricsScroll {
    height: calc(100% - 32px) !important;
    margin-top: 0 !important;
    overflow: hidden !important;
  }

  .industrialLyricsEmpty {
    font-size: 0.68rem !important;
    line-height: 1.14 !important;
    gap: 0.2rem !important;
  }

  .industrialLyricsEmpty b {
    font-size: 0.76rem !important;
    line-height: 1.05 !important;
  }

  .industrialLyricsEmpty span {
    font-size: 0.66rem !important;
    line-height: 1.08 !important;
  }

  /* footer warning: bigger text, scrolling danger stripes, no icon */
  .industrialWarningStrip {
    background:
      repeating-linear-gradient(
        135deg,
        #080403 0 18px,
        #080403 18px 28px,
        #9b1d12 28px 46px,
        #9b1d12 46px 56px
      ) !important;
    background-size: 80px 80px !important;
    animation: sr040WarningMarch 1.8s linear infinite !important;
  }

  @keyframes sr040WarningMarch {
    from { background-position: 0 0; }
    to { background-position: 80px 0; }
  }

  .industrialWarningStrip::after,
  .industrialWarningStrip::before {
    display: none !important;
    content: none !important;
  }

  .warningPlate,
  .industrialWarningStrip b {
    font-size: 1rem !important;
    letter-spacing: 0.055em !important;
    font-weight: 950 !important;
  }

  .warningPlate {
    color: #fff0cf !important;
    min-width: 165px !important;
  }
}
CSS

npm run build
echo "SR-040 complete. Refresh and review."
