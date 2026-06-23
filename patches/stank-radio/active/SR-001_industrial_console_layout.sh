#!/usr/bin/env bash
set -euo pipefail

cp src/main.jsx /tmp/stank-radio-main.pre-SR-001.jsx
cp src/styles.css /tmp/stank-radio-styles.pre-SR-001.css

python3 - <<'PY'
from pathlib import Path
import re

p = Path("src/main.jsx")
s = p.read_text()

s, n1 = re.subn(r'\n          <aside className="headerRoomTone"[\s\S]*?\n          </aside>\n', '\n', s, count=1)
s, n2 = re.subn(r'\n          <aside className="headerSignal"[\s\S]*?\n          </aside>\n', '\n', s, count=1)

old_hero = '''          <div className="heroCopy">
            <p className="eyebrow">Public Broadcast Facility <span aria-hidden="true">·</span> Questionable Frequency</p>
            <h1><span>MAXIMUM</span><span>STANK</span></h1>
            <p className="heroTagline">If it smells like a hit, it probably came from here.</p>
          </div>'''

new_hero = '''          <div className="heroCopy">
            <p className="eyebrow">Public Broadcast Facility <span aria-hidden="true">·</span> Questionable Frequency</p>
            <div className="maximumStankBlock">
              <div>
                <h1><span>MAXIMUM</span><span>STANK</span></h1>
                <p className="heroTagline">If it smells like a hit, it probably came from here.</p>
              </div>
              <p className="stankDefinition">
                Maximum Stank is officially defined as a measurable cloud of musical nonsense, emotional fumes,
                questionable rhythm choices, and audio residue so powerful it makes a person nod like they understand science.
              </p>
            </div>
          </div>'''

if old_hero not in s:
    raise SystemExit("Hero block not found")
s = s.replace(old_hero, new_hero, 1)

s = s.replace('<p className="pipeBriefLabel">Freshly audio contaminants.</p>', '<p className="pipeBriefLabel">Fresh Audio Contaminants</p>', 1)

old_core = '''            <div className="playerCore">
              <div className="coverWell">'''

new_core = '''            <div className="playerMachine">
              <aside className="telemetryRail" aria-label="Broadcast telemetry">
                <div className="telemetryGauge">
                  <span>Containment Index</span>
                  <b>{tracks.length}</b>
                  <small>indexed</small>
                </div>
                <div className="telemetryGauge">
                  <span>Fumes</span>
                  <b>{activeTrack ? `${stankIndex}%` : 'Idle'}</b>
                  <small>{activeTrack ? 'leaking' : 'dead air'}</small>
                </div>
                <div className="telemetryBars">
                  <span>Room Tone</span>
                  <b>{roomTone.label}</b>
                  <div className="meterBars" aria-hidden="true">
                    {roomTone.bars.map((height, index) => (
                      <i key={index} style={{ '--meter-height': `${height}%` }} />
                    ))}
                  </div>
                </div>
              </aside>

              <div className="playerCore">
              <div className="coverWell">'''

if old_core not in s:
    raise SystemExit("playerCore block not found")
s = s.replace(old_core, new_core, 1)

s = s.replace('''            </div>

            <audio''', '''            </div>
            </div>

            <audio''', 1)

p.write_text(s)
PY

cat >> src/styles.css <<'CSS'

/* === SR-001 INDUSTRIAL CONSOLE FINAL OVERRIDE === */
@media (min-width: 1101px) {
  .headerRoomTone,
  .headerSignal {
    display: none !important;
  }

  .workspaceGrid {
    grid-template-columns: minmax(0, 1.42fr) minmax(21rem, 0.58fr) !important;
    grid-template-rows: 7.1rem minmax(0, 1fr) 4.5rem !important;
    gap: 0.55rem !important;
  }

  .maximumStankBlock {
    display: grid !important;
    grid-template-columns: minmax(12rem, 0.5fr) minmax(18rem, 1fr);
    gap: 0.75rem;
    align-items: center;
  }

  .stankDefinition {
    margin: 0;
    padding: 0.58rem 0.7rem;
    border-left: 1px solid rgba(167,255,97,.38);
    color: rgba(246,239,212,.78);
    font-size: 0.7rem;
    line-height: 1.24;
  }

  .playerMachine {
    display: grid !important;
    grid-template-columns: 10rem minmax(0, 1fr);
    gap: 0.55rem;
  }

  .telemetryRail {
    display: grid !important;
    grid-template-rows: 1fr 1fr 1.5fr;
    gap: 0.45rem;
  }

  .telemetryGauge,
  .telemetryBars {
    display: grid;
    align-content: center;
    gap: 0.2rem;
    min-height: 5rem;
    padding: 0.55rem;
    border: 2px solid rgba(32,37,30,.95);
    background: linear-gradient(180deg, rgba(48,55,43,.86), rgba(10,13,9,.96));
    box-shadow: inset 0 0 18px rgba(0,0,0,.7);
  }

  .telemetryGauge span,
  .telemetryGauge small,
  .telemetryBars span {
    color: var(--safety);
    font-family: "Lucida Console", "Courier New", monospace;
    font-size: 0.58rem;
    font-weight: 1000;
    text-align: center;
    text-transform: uppercase;
  }

  .telemetryGauge b,
  .telemetryBars b {
    color: #a7ff61;
    font-family: Impact, Haettenschweiler, "Arial Black", sans-serif;
    font-size: clamp(1.35rem, 2vw, 2rem);
    text-align: center;
    text-transform: uppercase;
  }

  .telemetryBars .meterBars {
    height: 4rem;
  }

  .playerCore {
    grid-template-columns: minmax(20rem, 58%) minmax(0, 1fr) !important;
    gap: 0.55rem !important;
  }

  .coverWell,
  .coverWell img {
    min-height: 23rem !important;
    max-height: 45vh !important;
  }
}
CSS

npm run build
docker restart bigdumbidiot-stank-radio
