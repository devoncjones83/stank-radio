#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/main.jsx "src/main.jsx.bak.SR-012.$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-012.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

path = Path("src/main.jsx")
text = path.read_text()

# Replace useless Music Manifest button in broadcast deck
old = """                <a
                  className="manifestLink broadcastManifestLink"
                  href={`${BASE}songs.json`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileAudio size={14} />
                  Music Manifest
                  <ExternalLink size={12} />
                </a>"""
new = """                <div className="broadcastIndexedBox">
                  <span>Indexed</span>
                  <b>{tracks.length}</b>
                </div>"""
text = text.replace(old, new, 1)

# Move industrial transport from library bay back under artwork bay
transport_start = text.find('            <div className="industrialTransport">')
if transport_start == -1:
    raise SystemExit("Could not find industrialTransport block")

transport_end_marker = '            </div>\n\n            <nav className="libraryPagination"'
transport_end = text.find(transport_end_marker, transport_start)
if transport_end == -1:
    raise SystemExit("Could not find transport end marker")
transport_end += len('            </div>\n')
transport_block = text[transport_start:transport_end]

text = text[:transport_start] + text[transport_end:]

insert_after = """            <div className="industrialArtworkBay">
              <img src={displayTrack.cover || defaultCover} alt="" />
              <em>{activeTrack ? 'ACTIVE RESIDUE' : 'AWAITING SELECTION'}</em>
            </div>
"""
if insert_after not in text:
    raise SystemExit("Could not find artwork bay block")

text = text.replace(insert_after, insert_after + "\n" + transport_block, 1)

# FILTH-UP page size from 7 to 6 if present
text = text.replace("const tracksPerPage = viewMode === 'filth' ? 7 : TRACKS_PER_PAGE;", "const tracksPerPage = viewMode === 'filth' ? 6 : TRACKS_PER_PAGE;")

path.write_text(text)
PY

cat >> src/styles.css <<'CSS'

/* === SR-012 CONSOLE REBALANCE === */
@media (min-width: 1101px) {
  .industrialShell {
    grid-template-rows: 150px minmax(0, 1fr) 230px 82px;
  }

  /* Left telemetry: stop the bars from eating the whole rail */
  .industrialLeftRail {
    grid-template-rows: 136px 136px 178px 124px;
    align-content: start;
  }

  .industrialLedMeter {
    max-height: 178px;
  }

  .industrialSignalQuality {
    min-height: 118px;
  }

  /* Main bay: artwork + player buttons live together */
  .industrialMainBay {
    grid-template-rows: 44px minmax(0, 1fr) 72px;
  }

  .industrialMainBay .industrialTransport {
    display: grid !important;
    grid-template-columns: 58px minmax(190px, 280px) 58px 1fr 1fr;
    gap: 0.35rem;
    border: 3px solid #151510;
    padding: 0.35rem;
    background:
      linear-gradient(180deg, #565447, #25251e),
      repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0 2px, transparent 2px 44px);
  }

  .industrialMainBay .industrialTransport button {
    border: 2px solid #11120d;
    background:
      linear-gradient(180deg, #625f50, #2c2c25 52%, #151510);
    color: #f3edd4;
    font-weight: 900;
    text-transform: uppercase;
  }

  .industrialMainBay .industrialTransport .industrialStartLeak {
    background:
      linear-gradient(180deg, #b85d3d, #6e2c20 55%, #32110d);
    color: #ffe4c2;
  }

  .industrialLibraryBay .industrialTransport {
    display: none !important;
  }

  /* Move artwork status tag to top-left */
  .industrialArtworkBay em {
    top: 0.8rem;
    bottom: auto;
    left: 0.8rem;
  }

  /* Broadcast top-right: no manifest button */
  .broadcastStatusControls {
    grid-template-columns: 1.35fr 0.65fr;
  }

  .broadcastIndexedBox {
    min-height: 34px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(150,255,50,0.45);
    background: rgba(3, 12, 3, 0.86);
    color: #baff42;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 0.06em;
    box-shadow: inset 0 0 0 2px rgba(0,0,0,0.4);
  }

  .broadcastIndexedBox span {
    font-size: 0.58rem;
    color: #9eff35;
  }

  .broadcastIndexedBox b {
    font-size: 1rem;
    line-height: 1;
  }

  /* Track list: fewer, taller, cover art fits */
  .industrialLibraryBay {
    grid-template-rows: auto auto auto minmax(0, 1fr) 38px;
  }

  .industrialLibraryBay .trackList {
    gap: 0.9rem;
  }

  .industrialLibraryBay .trackRow {
    min-height: 104px;
    padding: 0.75rem 4.4rem 0.75rem 0.85rem;
    gap: 1rem;
  }

  .industrialLibraryBay .trackRow img {
    width: 76px;
    height: 76px;
  }

  .industrialLibraryBay .trackRowText b {
    font-size: 1.18rem;
  }

  .industrialLibraryBay .trackRowText small {
    font-size: 0.76rem;
  }

  .industrialLibraryBay .trackRow::after {
    width: 34px;
    height: 58px;
  }
}
CSS

npm run build
git status --short
