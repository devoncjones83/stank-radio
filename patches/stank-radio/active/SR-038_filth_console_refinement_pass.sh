#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/main.jsx "src/main.jsx.bak.SR-038.$STAMP"
cp src/styles.css "src/styles.css.bak.SR-038.$STAMP"

python3 <<'PY'
from pathlib import Path

jsx = Path("src/main.jsx")
s = jsx.read_text()

s = s.replace(
'''              <p className="trackTag">{displayTrack.tag}</p>''',
'''              <p className="trackTag">{activeTrack ? displayTrack.tag : 'FUMES: IDLE'}</p>'''
)

s = s.replace(
'''              <div className="lyricsHeading">
                <span>Lyrics</span>
                {currentLyrics.length ? <b>Following track</b> : <b>Awaiting lyric timing</b>}
              </div>''',
'''              <div className="lyricsHeading">
                <span>Lyrics</span>
                {currentLyrics.length ? <b>Following track</b> : null}
              </div>'''
)

jsx.write_text(s)

css = Path("src/styles.css")
c = css.read_text()

c += r'''

/* === SR-038 FILTH CONSOLE REFINEMENT PASS === */
@media (min-width: 1101px) {
  .radioApp.filthUpView {
    --filth-acid: #baff42;
    --filth-bone: #fff0cf;
    --filth-red: #b33420;
    --filth-rivet: #77715e;
  }

  /* real rivets, not black wormholes */
  .broadcastIdentityPanel::before,
  .broadcastDefinitionPanel::before,
  .broadcastContaminantsPanel::before,
  .broadcastStatusPanel::before,
  .industrialGauge::after,
  .industrialLedMeter::after,
  .industrialSignalQuality::after,
  .industrialTrackTerminal::after,
  .industrialLyrics::after,
  .industrialLibraryBay .trackRow::after,
  .industrialWarningStrip::after {
    box-shadow:
      0 0 0 1px #0a0a07,
      inset 1px 1px 1px rgba(255,240,190,0.35),
      inset -1px -1px 2px rgba(0,0,0,0.85),
      0 0 8px rgba(0,0,0,0.75) !important;
  }

  .industrialHeader.broadcastDeck {
    background:
      linear-gradient(180deg, rgba(34,34,27,0.98), rgba(6,8,5,0.98)) !important;
  }

  .broadcastIdentityPanel,
  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel,
  .broadcastStatusPanel {
    background:
      linear-gradient(180deg, rgba(30,31,25,0.95), rgba(6,9,5,0.98)),
      repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px) !important;
  }

  .broadcastIdentityPanel h1 {
    color: var(--filth-bone) !important;
    -webkit-text-stroke: 1px rgba(0,0,0,0.95);
    text-shadow:
      3px 3px 0 #15120d,
      0 0 13px rgba(186,255,66,0.32) !important;
    letter-spacing: -0.09em !important;
  }

  .broadcastIdentityPanel > strong {
    color: #d2c59b !important;
    text-shadow: 1px 1px 0 #000 !important;
  }

  .broadcastIdentityCopy span,
  .broadcastDefinitionPanel span,
  .broadcastContaminantsPanel span {
    color: var(--filth-bone) !important;
  }

  .broadcastIdentityCopy b,
  .broadcastDefinitionPanel p,
  .broadcastContaminantsPanel p {
    color: var(--filth-acid) !important;
    font-family: Impact, Haettenschweiler, "Arial Black", sans-serif !important;
    letter-spacing: 0.09em !important;
  }

  .broadcastContaminantsPanel strong {
    border-top: 1px solid rgba(186,255,66,0.25);
    padding-top: 0.35rem;
  }

  .industrialStatusRail span {
    color: var(--filth-acid) !important;
    font-family: Impact, Haettenschweiler, "Arial Black", sans-serif !important;
    letter-spacing: 0.08em !important;
    text-shadow: 0 0 11px rgba(186,255,66,0.35);
  }

  .industrialArtworkBay {
    background:
      linear-gradient(rgba(0,0,0,0.42), rgba(0,0,0,0.42)),
      url("/images/filth-skull-tile.png") center / 190px 190px repeat,
      #030603 !important;
  }

  .industrialArtworkBay img {
    background:
      linear-gradient(rgba(0,0,0,0.14), rgba(0,0,0,0.14)),
      url("/images/filth-skull-tile.png") center / 190px 190px repeat !important;
  }

  /* left rail: gauges + oscilloscope */
  .industrialLedMeter {
    display: block !important;
    padding: 0 !important;
  }

  .industrialLedMeter i {
    display: none !important;
  }

  .industrialLedMeter::before {
    content: "SIGNAL ACTIVITY";
    inset: 10px !important;
    display: grid;
    place-items: start center;
    padding-top: 0.55rem;
    color: var(--filth-acid);
    font-size: 0.66rem;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background:
      linear-gradient(180deg, rgba(2,8,3,0.92), rgba(0,0,0,0.9)),
      repeating-linear-gradient(0deg, rgba(186,255,66,0.04) 0 1px, transparent 1px 6px) !important;
  }

  .industrialLedMeter::after {
    content: "";
    position: absolute;
    left: 18px;
    right: 18px;
    top: 52%;
    height: 42px;
    transform: translateY(-50%);
    border: 1px solid rgba(186,255,66,0.16);
    background:
      linear-gradient(90deg, transparent, rgba(186,255,66,0.22), transparent),
      linear-gradient(var(--filth-acid), var(--filth-acid));
    background-size: 200% 100%, 100% 2px;
    background-position: 0 0, center;
    background-repeat: repeat-x, no-repeat;
    filter: drop-shadow(0 0 8px rgba(186,255,66,0.65));
  }

  .radioApp.filthUpView.isPlaying .industrialLedMeter::after {
    background:
      linear-gradient(90deg,
        transparent 0%,
        var(--filth-acid) 6%,
        transparent 11%,
        var(--filth-acid) 17%,
        transparent 22%,
        var(--filth-acid) 29%,
        transparent 35%,
        var(--filth-acid) 44%,
        transparent 50%,
        var(--filth-acid) 59%,
        transparent 65%,
        var(--filth-acid) 72%,
        transparent 79%,
        var(--filth-acid) 88%,
        transparent 100%);
    clip-path: polygon(0 50%, 7% 25%, 14% 78%, 21% 35%, 29% 64%, 37% 18%, 46% 82%, 55% 38%, 64% 68%, 72% 23%, 81% 76%, 90% 42%, 100% 50%);
    animation: sr038ScopeMove 1s linear infinite;
  }

  @keyframes sr038ScopeMove {
    from { background-position: 0 0; }
    to { background-position: -220px 0; }
  }

  .industrialGauge i {
    width: 86% !important;
    height: 58px !important;
    border-radius: 120px 120px 0 0;
    border: 2px solid rgba(186,255,66,0.12);
    border-bottom: 0;
    background:
      radial-gradient(circle at 50% 100%, rgba(186,255,66,0.1), transparent 48%),
      linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.65));
  }

  .industrialGauge i::before {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 44%;
    height: 3px;
    transform-origin: left center;
    transform: rotate(-10deg);
    background: #e85d35;
    box-shadow: 0 0 10px rgba(232,93,53,0.8);
  }

  .industrialGauge i::after {
    content: "";
    position: absolute;
    left: calc(50% - 5px);
    bottom: -5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #201b14;
    border: 2px solid #8d8268;
  }

  .industrialTrackTerminal {
    overflow: hidden !important;
  }

  .industrialTrackTerminal .trackTag {
    display: none !important;
  }

  .industrialTrackTerminal h2 {
    color: var(--filth-acid) !important;
    font-family: Impact, Haettenschweiler, "Arial Black", sans-serif !important;
    font-size: clamp(1.05rem, 1.38vw, 1.55rem) !important;
    letter-spacing: 0.015em !important;
    margin: 0 0 0.4rem !important;
    line-height: 0.95 !important;
    text-shadow: 0 0 9px rgba(186,255,66,0.35) !important;
  }

  .industrialTrackTerminal > p:not(.trackTag) {
    min-height: 82px !important;
    max-height: none !important;
    overflow: auto !important;
    color: var(--filth-bone) !important;
    font-size: 0.82rem !important;
    line-height: 1.32 !important;
  }

  .lyricsHeading b {
    display: none !important;
  }

  .industrialLibraryBay .filterHeader {
    display: grid !important;
    grid-template-columns: 1fr auto auto !important;
    align-items: center !important;
  }

  .industrialLibraryBay .panelLabel,
  .industrialLibraryTitle {
    color: var(--filth-acid) !important;
    font-family: Impact, Haettenschweiler, "Arial Black", sans-serif !important;
    letter-spacing: 0.08em !important;
    text-shadow: 0 0 8px rgba(186,255,66,0.28);
  }

  .industrialLibraryTitle {
    margin: 0.35rem 0 0.25rem !important;
    padding-left: 0.2rem !important;
  }

  .industrialLibraryBay .trackRow {
    display: grid !important;
    grid-template-columns: 78px minmax(0, 1fr) 54px !important;
    align-items: center !important;
    gap: 1rem !important;
    padding: 0.55rem 0.7rem !important;
  }

  .industrialLibraryBay .trackRow img {
    width: 66px !important;
    height: 66px !important;
    justify-self: center !important;
    align-self: center !important;
    object-fit: cover !important;
  }

  .industrialLibraryBay .trackRowText b {
    color: var(--filth-bone) !important;
    font-size: 0.98rem !important;
  }

  .industrialLibraryBay .trackRowText small {
    color: #d1c69e !important;
  }

  .industrialLibraryBay .libraryPagination {
    background: rgba(0,0,0,0.76) !important;
    border: 1px solid rgba(186,255,66,0.24) !important;
    padding: 0.25rem 0.45rem !important;
    transform: translateY(-2px) !important;
  }

  .industrialLibraryBay .libraryPagination span {
    color: #fff0cf !important;
    font-size: 0.82rem !important;
  }

  .industrialLibraryBay .libraryPagination button {
    width: 34px !important;
    height: 30px !important;
    color: #fff0cf !important;
  }

  .industrialWarningStrip {
    background:
      repeating-linear-gradient(135deg, rgba(0,0,0,0.92) 0 18px, rgba(139,25,17,0.96) 18px 36px),
      linear-gradient(180deg, #7d160f, #180606) !important;
    border-color: #120403 !important;
  }

  .industrialWarningStrip b,
  .warningPlate {
    background:
      linear-gradient(180deg, rgba(72,8,5,0.96), rgba(20,3,2,0.96)) !important;
    color: #fff0cf !important;
    border-color: rgba(255,210,170,0.18) !important;
    text-shadow: 0 0 8px rgba(255,40,20,0.45) !important;
  }

  .industrialWarningStrip::after {
    content: "" !important;
    display: block !important;
    position: absolute;
    right: 13px;
    top: 50%;
    width: 30px;
    height: 30px;
    transform: translateY(-50%);
    border-radius: 50%;
    background:
      conic-gradient(from 0deg, #ff2716, #4b0503, #ff7a4a, #4b0503, #ff2716);
    box-shadow:
      0 0 12px rgba(255,30,20,0.85),
      0 0 28px rgba(255,20,10,0.45);
    animation: sr038WarningSpin 0.9s linear infinite;
  }

  @keyframes sr038WarningSpin {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
  }
}
'''

css.write_text(c)
PY

npm run build
echo "SR-038 complete. Refresh and check the filth."
