#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/main.jsx "src/main.jsx.bak.SR-036.$STAMP"
cp src/styles.css "src/styles.css.bak.SR-036.$STAMP"

python3 <<'PY'
from pathlib import Path

jsx = Path("src/main.jsx")
s = jsx.read_text()

s = s.replace(
'''            <div className="industrialTrackTerminal">
              <p className="trackTag">{displayTrack.tag}</p>''',
'''            <div className="industrialTrackTerminal">
              <div className="terminalPlate">TRACK DOSSIER</div>
              <p className="trackTag">{displayTrack.tag}</p>'''
)

s = s.replace(
'''            <section className="industrialLyrics" aria-label="Lyrics">
              <div className="lyricsHeading">''',
'''            <section className="industrialLyrics" aria-label="Lyrics">
              <div className="terminalPlate">LYRIC CONTAINMENT</div>
              <div className="lyricsHeading">'''
)

s = s.replace(
'''          <aside className="industrialWarningStrip">
            <span>FIELD WARNING</span>
            <b>DO NOT CLEAN THE SIGNAL PATH.</b>
            <b>DO NOT TRUST ANYTHING LABELED SMOOTH.</b>
            <b>REPORT ALL SUSPICIOUS SILENCE.</b>
          </aside>''',
'''          <aside className="industrialWarningStrip">
            <span className="warningPlate">FIELD WARNING</span>
            <b>DO NOT CLEAN THE SIGNAL PATH.</b>
            <b>DO NOT TRUST ANYTHING LABELED SMOOTH.</b>
            <b>REPORT ALL SUSPICIOUS SILENCE.</b>
            <span className="warningPlate warningPlateRight">FIELD WARNING</span>
          </aside>'''
)

jsx.write_text(s)

css = Path("src/styles.css")
c = css.read_text()

c += r'''

/* === SR-036 FILTH HARDWARE CONTAINMENT PASS === */
@media (min-width: 1101px) {
  .radioApp.filthUpView::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      linear-gradient(rgba(0,0,0,0.76), rgba(0,0,0,0.76)),
      url("/images/filth-skull-tile.png") center / 260px 260px repeat;
    opacity: 0.28;
    mix-blend-mode: screen;
  }

  .radioApp.filthUpView > * {
    position: relative;
    z-index: 1;
  }

  .industrialLeftRail {
    display: grid !important;
    grid-template-rows: repeat(4, minmax(0, 1fr)) !important;
    gap: 10px !important;
    padding: 10px !important;
  }

  .industrialGauge,
  .industrialLedMeter,
  .industrialSignalQuality {
    min-height: 0 !important;
    overflow: hidden !important;
    display: grid !important;
    align-content: center !important;
    justify-items: center !important;
  }

  .industrialLedMeter {
    align-items: end !important;
    grid-auto-flow: column !important;
    gap: 8px !important;
    padding: 24px 14px 18px !important;
  }

  .industrialLedMeter::after {
    content: "SIGNAL ACTIVITY";
    position: absolute;
    top: 12px;
    left: 14px;
    color: #baff42;
    font-size: 0.68rem;
    font-weight: 950;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    z-index: 3;
  }

  .broadcastIdentityPanel,
  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel,
  .broadcastStatusPanel {
    min-height: 0 !important;
    overflow: hidden !important;
    padding: 0.7rem 0.85rem !important;
    align-content: center !important;
    justify-content: center !important;
  }

  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel {
    display: grid !important;
    place-items: center !important;
  }

  .broadcastIdentityPanel h1 {
    font-size: clamp(2.35rem, 3.8vw, 4.55rem) !important;
  }

  .broadcastIdentityPanel > strong {
    font-size: 0.98rem !important;
    line-height: 1.05 !important;
  }

  .broadcastIdentityCopy {
    transform: none !important;
    align-self: center !important;
  }

  .broadcastIdentityCopy span {
    font-size: 1.02rem !important;
  }

  .broadcastIdentityCopy b {
    font-size: 1.7rem !important;
  }

  .broadcastIdentityCopy em {
    font-size: 0.98rem !important;
  }

  .broadcastDefinitionPanel p,
  .broadcastContaminantsPanel p {
    margin-bottom: 0.3rem !important;
  }

  .broadcastDefinitionPanel span,
  .broadcastContaminantsPanel span,
  .broadcastContaminantsPanel strong {
    max-width: 92%;
  }

  .terminalPlate,
  .warningPlate {
    display: inline-grid;
    place-items: center;
    border: 2px solid #070806;
    background:
      radial-gradient(circle at 10px 10px, #050504 0 3px, transparent 4px),
      radial-gradient(circle at calc(100% - 10px) 10px, #050504 0 3px, transparent 4px),
      linear-gradient(180deg, rgba(92,88,70,0.92), rgba(31,31,25,0.98));
    color: #baff42;
    box-shadow:
      inset 0 0 0 2px rgba(190,180,130,0.12),
      inset 0 0 18px rgba(0,0,0,0.75),
      0 0 10px rgba(158,255,53,0.12);
    text-transform: uppercase;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-shadow: 0 0 8px rgba(158,255,53,0.35);
  }

  .terminalPlate {
    width: max-content;
    min-width: 150px;
    height: 25px;
    padding: 0 0.7rem;
    margin-bottom: 0.48rem;
    font-size: 0.68rem;
  }

  .industrialTrackTerminal,
  .industrialLyrics {
    padding: 0.65rem 0.75rem !important;
  }

  .industrialTrackTerminal {
    display: grid !important;
    grid-template-rows: auto auto auto minmax(0, 1fr);
    align-content: start !important;
  }

  .industrialTrackTerminal > p:not(.trackTag),
  .industrialLyrics .lyricsScroll {
    border: 1px solid rgba(140,255,50,0.14);
    background:
      linear-gradient(180deg, rgba(1,8,2,0.78), rgba(0,0,0,0.62)),
      repeating-linear-gradient(0deg, rgba(150,255,55,0.035) 0 1px, transparent 1px 5px);
    padding: 0.55rem 0.65rem;
    box-shadow: inset 0 0 18px rgba(0,0,0,0.78);
  }

  .industrialLyrics .lyricsHeading {
    height: 24px !important;
    margin-bottom: 0.35rem !important;
  }

  .industrialLyrics .lyricsScroll {
    height: calc(100% - 58px) !important;
  }

  .industrialLibraryBay .trackRow {
    position: relative !important;
    isolation: isolate;
    overflow: hidden !important;
    padding: 0.72rem 4.5rem 0.72rem 0.92rem !important;
  }

  .industrialLibraryBay .trackRow::before {
    content: "" !important;
    position: absolute !important;
    inset: 8px !important;
    z-index: -1 !important;
    border: 1px solid rgba(150,255,55,0.16) !important;
    background:
      linear-gradient(180deg, rgba(4,10,3,0.7), rgba(0,0,0,0.54)),
      repeating-linear-gradient(0deg, rgba(150,255,55,0.03) 0 1px, transparent 1px 5px) !important;
    box-shadow:
      inset 0 0 20px rgba(0,0,0,0.82),
      inset 0 0 0 1px rgba(0,0,0,0.65) !important;
  }

  .industrialLibraryBay .trackRow img {
    position: relative;
    z-index: 2;
    border: 2px solid #070806;
    box-shadow: 0 0 0 1px rgba(150,255,55,0.18), 0 0 16px rgba(0,0,0,0.72);
  }

  .industrialLibraryBay .trackRowText {
    position: relative;
    z-index: 2;
  }

  .industrialMainBay::after,
  .industrialWarningStrip::after,
  .industrialWarningStrip::before {
    display: none !important;
    content: none !important;
  }

  .industrialWarningStrip {
    grid-template-columns: 180px repeat(3, minmax(0, 1fr)) 180px !important;
    gap: 0.8rem !important;
    padding: 0.55rem 0.7rem !important;
    align-items: center !important;
  }

  .warningPlate {
    height: 34px;
    font-size: 0.78rem;
  }

  .industrialWarningStrip b {
    height: 34px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(0,0,0,0.75);
    background:
      linear-gradient(180deg, rgba(69,58,43,0.88), rgba(20,19,15,0.94));
    box-shadow:
      inset 0 0 0 1px rgba(255,235,180,0.08),
      inset 0 0 18px rgba(0,0,0,0.72);
    color: #fff0cf;
    text-align: center;
  }
}
'''

css.write_text(c)
PY

npm run build
echo "SR-036 complete. Review, then deploy/restart if it looks filthy enough."
