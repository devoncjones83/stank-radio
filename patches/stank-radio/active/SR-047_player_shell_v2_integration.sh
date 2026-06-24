#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/main.jsx "src/main.jsx.bak.SR-047.$STAMP"
cp src/styles.css "src/styles.css.bak.SR-047.$STAMP"

python3 <<'PY'
from pathlib import Path
import re

p = Path("src/main.jsx")
s = p.read_text()

pattern = re.compile(
    r'\n          <aside className="industrialLeftRail">.*?\n          <aside className="industrialLibraryBay">',
    re.S
)

replacement = r'''
          <section className="industrialPlayerShell" aria-label="Filth-Up hardware player">
            <div className="shellTitleStrip">
              <span>{playing ? 'NOW LEAKING' : activeTrack ? 'LEAK ARMED' : 'NO TRANSMISSION SELECTED'}</span>
              <b>88.8 STANK FM</b>
            </div>

            <div className="shellMeters" aria-hidden="true">
              <i className="shellNeedle shellNeedleIndex" />
              <i className="shellNeedle shellNeedleFumes" />
            </div>

            <div className="shellCoverViewport">
              <img src={displayTrack.cover || defaultCover} alt="" />
              <em>{activeTrack ? 'ACTIVE RESIDUE' : 'AWAITING SELECTION'}</em>
            </div>

            <div className="shellVizViewport" aria-hidden="true">
              <div className="shellScopeTrace" />
            </div>

            <div className="shellDossierPanel">
              <div className="terminalPlate">TRACK DOSSIER</div>
              <h2>{activeTrack ? displayTrack.title : 'NO TRANSMISSION SELECTED'}</h2>
              <p>{displayTrack.description}</p>
            </div>

            <section className="shellLyricsPanel" aria-label="Lyrics">
              <div className="terminalPlate">LYRIC CONTAINMENT</div>
              <div className="lyricsScroll">
                {currentLyrics.length ? (
                  currentLyrics.map((line, index) => (
                    <p
                      key={`${line.time}-${index}`}
                      ref={(element) => {
                        lyricLineRefs.current[index] = element;
                      }}
                      className={index === activeLyricIndex ? 'active' : ''}
                    >
                      {line.text}
                    </p>
                  ))
                ) : (
                  <div className="lyricsEmpty industrialLyricsEmpty">
                    {activeTrack ? (
                      <>
                        <b>LYRIC DATA NOT AVAILABLE</b>
                        <span>Track indexed successfully.</span>
                        <span>No synchronized contamination transcript found.</span>
                        <span>Awaiting future LRC containment records.</span>
                      </>
                    ) : (
                      <>
                        <b>AWAITING LYRIC TIMING DATA</b>
                        <span>NO SYNCHRONIZED TRANSCRIPT PRESENT</span>
                        <span>FUNK LEVELS ACCEPTABLE</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </section>

            <div className="industrialTransport shellTransport">
              <button type="button" onClick={() => stepTrack(-1)} aria-label="Previous track">
                <SkipBack size={18} />
              </button>
              <button
                className="industrialStartLeak"
                type="button"
                onClick={togglePlay}
                disabled={!hasActiveAudio}
              >
                {playing ? <Pause size={22} /> : <Play size={22} />}
                {playing ? 'PAUSE LEAK' : 'START LEAK'}
              </button>
              <button type="button" onClick={() => stepTrack(1)} aria-label="Next track">
                <SkipForward size={18} />
              </button>
              <button type="button" onClick={randomTrack}>
                <Shuffle size={18} />
                RANDOM
              </button>
              <button type="button" onClick={shareTrack}>
                <Share2 size={18} />
                SHARE
              </button>
            </div>
          </section>

          <aside className="industrialLibraryBay">'''

s2, n = pattern.subn(replacement, s, count=1)
if n != 1:
    raise SystemExit(f"Expected to replace one industrial player block, replaced {n}")

p.write_text(s2)
PY

cat >> src/styles.css <<'CSS'

/* === SR-047 PLAYER SHELL V2 INTEGRATION === */
@media (min-width: 1101px) {
  .industrialShell {
    grid-template-areas:
      "header header"
      "player library"
      "player library"
      "warning warning" !important;
    grid-template-columns: minmax(720px, 0.83fr) minmax(620px, 1.17fr) !important;
    grid-template-rows: 132px minmax(0, 1fr) 190px 78px !important;
  }

  .industrialLeftRail,
  .industrialMainBay,
  .industrialInfoBay {
    display: none !important;
  }

  .industrialPlayerShell {
    grid-area: player;
    position: relative;
    min-height: 0;
    overflow: hidden;
    background:
      url("/images/industrial-player-shell-v2-final.png")
      center center / 100% 100% no-repeat;
  }

  .shellTitleStrip {
    position: absolute;
    left: 6.3%;
    top: 4.6%;
    width: 62.5%;
    height: 9.6%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.1rem;
    color: #baff42;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    text-shadow: 0 0 8px rgba(186,255,66,0.45), 1px 1px 0 #000;
    pointer-events: none;
  }

  .shellTitleStrip b {
    color: #fff0cf;
    font-size: 0.72rem;
  }

  .shellMeters {
    position: absolute;
    left: 2.5%;
    top: 14.8%;
    width: 18.2%;
    height: 47%;
    pointer-events: none;
  }

  .shellNeedle {
    position: absolute;
    left: 50%;
    width: 34%;
    height: 4px;
    border-radius: 3px;
    background: #0b0806;
    transform-origin: left center;
    box-shadow: 0 1px 1px rgba(255,255,255,0.2), 0 0 5px rgba(0,0,0,0.9);
  }

  .shellNeedleIndex {
    top: 20%;
    transform: rotate(-40deg);
  }

  .shellNeedleFumes {
    top: 52%;
    transform: rotate(-40deg);
  }

  .radioApp.filthUpView.isPlaying .shellNeedleIndex {
    transform: rotate(-8deg);
  }

  .radioApp.filthUpView.isPlaying .shellNeedleFumes {
    transform: rotate(10deg);
  }

  .shellCoverViewport {
    position: absolute;
    left: 25.4%;
    top: 19.4%;
    width: 46.8%;
    height: 45.4%;
    display: grid;
    place-items: center;
    overflow: hidden;
    background:
      linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.18)),
      url("/images/filth-skull-tile.png") center / 190px 190px repeat,
      #020602;
  }

  .shellCoverViewport img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 2;
  }

  .shellCoverViewport em {
    position: absolute;
    left: 0.8rem;
    top: 0.7rem;
    z-index: 3;
    background: #baff42;
    color: #061006;
    padding: 0.32rem 0.55rem;
    font-size: 0.68rem;
    font-weight: 950;
    font-style: normal;
    text-transform: uppercase;
  }

  .shellVizViewport {
    position: absolute;
    left: 73.8%;
    top: 19.6%;
    width: 21.8%;
    height: 21.8%;
    overflow: hidden;
  }

  .shellVizViewport::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)),
      repeating-linear-gradient(0deg, rgba(186,255,66,0.08) 0 1px, transparent 1px 12px),
      repeating-linear-gradient(90deg, rgba(186,255,66,0.07) 0 1px, transparent 1px 12px);
    opacity: 0.72;
  }

  .shellScopeTrace {
    position: absolute;
    left: -20%;
    right: -20%;
    top: 50%;
    height: 2px;
    background: #9eff35;
    box-shadow: 0 0 12px rgba(158,255,53,0.7);
  }

  .radioApp.filthUpView.isPlaying .shellScopeTrace {
    height: 26px;
    background:
      linear-gradient(90deg,
        transparent 0%,
        #9eff35 7%,
        transparent 12%,
        #9eff35 20%,
        transparent 27%,
        #9eff35 37%,
        transparent 44%,
        #9eff35 57%,
        transparent 64%,
        #9eff35 78%,
        transparent 100%);
    clip-path: polygon(0 50%, 8% 22%, 16% 78%, 24% 38%, 34% 65%, 44% 18%, 54% 82%, 66% 36%, 78% 70%, 90% 40%, 100% 50%);
    animation: sr047Scope 1s linear infinite;
  }

  @keyframes sr047Scope {
    from { transform: translateX(0); }
    to { transform: translateX(-12%); }
  }

  .shellDossierPanel {
    position: absolute;
    left: 6.2%;
    top: 67.2%;
    width: 65.5%;
    height: 10.3%;
    overflow: hidden;
    padding: 0.38rem 0.75rem;
    color: #fff0cf;
  }

  .shellDossierPanel .terminalPlate,
  .shellLyricsPanel .terminalPlate {
    height: 20px !important;
    min-width: 122px !important;
    margin: 0 0 0.25rem !important;
    font-size: 0.56rem !important;
  }

  .shellDossierPanel h2 {
    margin: 0;
    color: #baff42;
    font-size: clamp(0.9rem, 1.45vw, 1.45rem);
    line-height: 0.95;
    text-transform: uppercase;
    text-shadow: 0 0 9px rgba(186,255,66,0.36);
  }

  .shellDossierPanel p {
    margin: 0.28rem 0 0;
    max-width: 92%;
    font-size: 0.68rem;
    line-height: 1.2;
    color: #fff0cf;
  }

  .shellLyricsPanel {
    position: absolute;
    left: 73.8%;
    top: 43.2%;
    width: 21.8%;
    height: 34.2%;
    overflow: hidden;
    padding: 0.55rem 0.65rem;
    color: #fff0cf;
  }

  .shellLyricsPanel .lyricsScroll {
    height: calc(100% - 25px);
    overflow: hidden;
    font-size: 0.64rem;
    line-height: 1.15;
  }

  .shellLyricsPanel .industrialLyricsEmpty {
    font-size: 0.62rem !important;
    line-height: 1.15 !important;
    gap: 0.15rem !important;
  }

  .shellLyricsPanel .industrialLyricsEmpty b {
    font-size: 0.66rem !important;
  }

  .shellTransport {
    position: absolute !important;
    left: 4.5% !important;
    right: 5.2% !important;
    bottom: 8.4% !important;
    height: 6.5% !important;
    display: flex !important;
    gap: 0.45rem !important;
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
    z-index: 6;
  }

  .shellTransport button {
    height: 100% !important;
    min-height: 0 !important;
    padding: 0 0.75rem !important;
    background: rgba(5, 7, 5, 0.72) !important;
    border: 1px solid rgba(210,200,160,0.22) !important;
    color: #fff0cf !important;
    box-shadow: inset 0 0 14px rgba(0,0,0,0.86) !important;
  }

  .shellTransport .industrialStartLeak {
    min-width: 13rem !important;
    color: #baff42 !important;
  }
}

CSS

npm run build
echo "SR-047 complete. Refresh and inspect player shell only."
