#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/main.jsx "src/main.jsx.bak.SR-011.$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-011.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

path = Path("src/main.jsx")
text = path.read_text()

old_status = """            <section className="broadcastStatusPanel">
              <div className="transmissionFlag liveContainmentBadge">
                <span />
                {playing ? 'LIVE CONTAINMENT' : 'AWAITING LEAK'}
              </div>
              <div className="broadcastWaveform" aria-hidden="true">
                {roomTone.bars.concat(roomTone.bars).map((height, index) => (
                  <i key={index} style={{ '--meter-height': `${Math.max(16, height)}%` }} />
                ))}
              </div>
              <button
                className="viewToggle"
                type="button"
                onClick={() => setViewMode('containment')}
              >
                Containment View
              </button>
            </section>"""

new_status = """            <section className="broadcastStatusPanel">
              <div className="broadcastStatusControls">
                <div className="transmissionFlag liveContainmentBadge">
                  <span />
                  {playing ? 'LIVE CONTAINMENT' : 'AWAITING LEAK'}
                </div>
                <a
                  className="manifestLink broadcastManifestLink"
                  href={`${BASE}songs.json`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileAudio size={14} />
                  Music Manifest
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="broadcastWaveform" aria-hidden="true">
                {roomTone.bars.concat(roomTone.bars).map((height, index) => (
                  <i key={index} style={{ '--meter-height': `${Math.max(16, height)}%` }} />
                ))}
              </div>
              <button
                className="viewToggle"
                type="button"
                onClick={() => setViewMode('containment')}
              >
                Containment View
              </button>
            </section>"""

text = text.replace(old_status, new_status, 1)

old_led_close = """            <div className="industrialLedMeter" aria-hidden="true">
              {roomTone.bars.map((height, index) => (
                <i key={index} style={{ '--meter-height': `${height}%` }} />
              ))}
            </div>
          </aside>"""

new_led_close = """            <div className="industrialLedMeter" aria-hidden="true">
              {roomTone.bars.map((height, index) => (
                <i key={index} style={{ '--meter-height': `${height}%` }} />
              ))}
            </div>

            <div className="industrialSignalQuality">
              <span>Signal Quality</span>
              <b>{playing ? 'LIVE' : 'IDLE'}</b>
              <em>{playing ? 'LEAKING' : 'DEAD AIR'}</em>
              <i />
            </div>
          </aside>"""

text = text.replace(old_led_close, new_led_close, 1)

transport_start = text.index('            <div className="industrialTransport">')
transport_end = text.index('            </div>\n          </section>\n\n          <section className="industrialInfoBay">', transport_start) + len('            </div>\n')
transport_block = text[transport_start:transport_end]
text = text[:transport_start] + text[transport_end:]

insert_before = '            <nav className="libraryPagination" aria-label="Containment library pages">'
text = text.replace(insert_before, transport_block + "\n" + insert_before, 1)

path.write_text(text)
PY

cat >> src/styles.css <<'CSS'

/* === SR-011 REBALANCED INDUSTRIAL CONSOLE === */
@media (min-width: 1101px) {
  .industrialShell {
    grid-template-columns: 190px minmax(460px, 0.82fr) minmax(680px, 1.25fr);
    grid-template-rows: 150px minmax(0, 1fr) 218px 82px;
    grid-template-areas:
      "head head head"
      "rail main library"
      "rail info library"
      "warn warn warn";
  }

  .industrialMainBay {
    grid-template-rows: 44px minmax(0, 1fr);
  }

  .industrialArtworkBay img {
    object-fit: cover;
  }

  .industrialInfoBay {
    grid-template-columns: minmax(290px, 0.48fr) minmax(420px, 0.52fr);
    grid-template-rows: minmax(0, 1fr);
  }

  .industrialTrackTerminal,
  .industrialLyrics {
    height: 100%;
  }

  .industrialLibraryBay {
    grid-template-rows: auto auto auto minmax(0, 1fr) 74px 38px;
  }

  .industrialLibraryBay .industrialTransport {
    display: grid;
    grid-template-columns: 58px minmax(190px, 280px) 58px 1fr 1fr;
    gap: 0.35rem;
    border: 3px solid #151510;
    padding: 0.35rem;
    background:
      linear-gradient(180deg, #565447, #25251e),
      repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0 2px, transparent 2px 44px);
  }

  .industrialLibraryBay .industrialTransport button {
    border: 2px solid #11120d;
    background:
      linear-gradient(180deg, #625f50, #2c2c25 52%, #151510);
    color: #f3edd4;
    font-weight: 900;
    text-transform: uppercase;
  }

  .industrialLibraryBay .industrialTransport .industrialStartLeak {
    background:
      linear-gradient(180deg, #b85d3d, #6e2c20 55%, #32110d);
    color: #ffe4c2;
  }

  .industrialLeftRail {
    grid-template-rows: 145px 145px minmax(0, 1fr) 118px;
  }

  .industrialSignalQuality {
    display: grid;
    align-content: center;
    gap: 0.25rem;
    text-align: center;
    border: 3px solid #12130e;
    background:
      linear-gradient(180deg, rgba(8, 20, 7, 0.94), rgba(2, 5, 2, 0.98));
    box-shadow:
      inset 0 0 0 3px rgba(118, 112, 87, 0.18),
      inset 0 0 24px rgba(0,0,0,0.9);
    color: #baff42;
    text-transform: uppercase;
    font-weight: 900;
  }

  .industrialSignalQuality span {
    font-size: 0.7rem;
    letter-spacing: 0.08em;
  }

  .industrialSignalQuality b {
    font-size: 1.65rem;
    color: #caff57;
    line-height: 1;
  }

  .industrialSignalQuality em {
    font-size: 0.62rem;
    color: #d8d0aa;
    font-style: normal;
  }

  .industrialSignalQuality i {
    width: 78%;
    height: 26px;
    margin: 0 auto;
    background:
      radial-gradient(circle, rgba(210,210,190,0.35) 0 1px, transparent 1px);
    background-size: 4px 4px;
    opacity: 0.6;
  }

  .broadcastStatusPanel {
    grid-template-rows: auto minmax(0, 1fr) auto;
  }

  .broadcastStatusControls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem;
  }

  .broadcastStatusControls .transmissionFlag,
  .broadcastManifestLink {
    min-height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    border: 1px solid rgba(150,255,50,0.45);
    background: rgba(3, 12, 3, 0.86);
    color: #baff42;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 0.06em;
  }

  .broadcastManifestLink {
    text-decoration: none;
    font-size: 0.68rem;
  }

  .industrialMainBay .industrialTransport {
    display: none;
  }
}
CSS

npm run build
git status --short
