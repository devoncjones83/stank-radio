#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/main.jsx "src/main.jsx.bak.SR-010.$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-010.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

path = Path("src/main.jsx")
text = path.read_text()

old = """          <header className="industrialHeader">
            <a className="brand" href={BASE} aria-label="STANK RADIO">
              <img src={defaultCover} alt="" />
              <span>
                <b>STANK RADIO</b>
                <small>FILTH-UP Industrial Leak Console</small>
              </span>
            </a>

            <div className="transmissionFlag liveContainmentBadge">
              <span />
              {playing ? 'TRANSMISSION ACTIVE' : 'AWAITING LEAK'}
            </div>

            <button
              className="viewToggle"
              type="button"
              onClick={() => setViewMode('containment')}
            >
              Containment View
            </button>
          </header>"""

new = """          <header className="industrialHeader broadcastDeck">
            <section className="broadcastIdentityPanel">
              <p>MAXIMUM</p>
              <h1>STANK RADIO</h1>
              <div>
                <span>PUBLIC BROADCAST</span>
                <b>QUESTIONABLE FREQUENCY</b>
              </div>
              <strong>88.8 STANK FM</strong>
            </section>

            <section className="broadcastDefinitionPanel">
              <p>MAXIMUM STANK: OFFICIAL DEFINITION</p>
              <span>
                Maximum Stank is officially defined as a measurable cloud of musical nonsense,
                emotional fumes, questionable rhythm choices, and audio residue so powerful
                it makes a person nod like they understand science.
              </span>
            </section>

            <section className="broadcastContaminantsPanel">
              <p>FRESH AUDIO CONTAMINANTS</p>
              <span>
                Foul little transmissions, harvested <b>FRESH</b> from the Suno stink pipe.
              </span>
              <strong>PRESS PLAY AT YOUR OWN RISK.</strong>
            </section>

            <section className="broadcastStatusPanel">
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
            </section>
          </header>"""

if old not in text:
    raise SystemExit("Could not find industrialHeader block")

text = text.replace(old, new, 1)
path.write_text(text)
PY

cat >> src/styles.css <<'CSS'

/* === SR-010 BROADCAST DECK === */
@media (min-width: 1101px) {
  .industrialShell {
    grid-template-rows: 150px minmax(0, 1fr) 96px;
  }

  .industrialHeader.broadcastDeck {
    display: grid;
    grid-template-columns: minmax(300px, 0.9fr) minmax(360px, 1.1fr) minmax(300px, 0.9fr) minmax(300px, 0.9fr);
    gap: 0.45rem;
    padding: 0.45rem;
    min-height: 0;
    align-items: stretch;
    background:
      linear-gradient(180deg, rgba(53, 54, 47, 0.98), rgba(18, 19, 15, 0.98)),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 52px);
  }

  .broadcastIdentityPanel,
  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel,
  .broadcastStatusPanel {
    position: relative;
    min-width: 0;
    border: 2px solid #11130d;
    background:
      linear-gradient(180deg, rgba(11, 25, 8, 0.92), rgba(3, 8, 3, 0.98)),
      repeating-linear-gradient(0deg, rgba(150,255,55,0.045) 0 1px, transparent 1px 5px);
    box-shadow:
      inset 0 0 0 2px rgba(147, 255, 50, 0.08),
      inset 0 0 24px rgba(0,0,0,0.85);
    padding: 0.65rem;
    overflow: hidden;
  }

  .broadcastIdentityPanel {
    display: grid;
    grid-template-rows: auto 1fr auto auto;
    background:
      radial-gradient(circle at 20% 45%, rgba(145,255,55,0.12), transparent 12rem),
      linear-gradient(180deg, rgba(14, 28, 8, 0.95), rgba(3, 7, 3, 0.98));
  }

  .broadcastIdentityPanel p,
  .broadcastDefinitionPanel p,
  .broadcastContaminantsPanel p {
    margin: 0;
    color: #caff57;
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .broadcastIdentityPanel h1 {
    margin: 0.15rem 0 0;
    color: #fff4da;
    font-size: clamp(2.25rem, 3.1vw, 4.1rem);
    line-height: 0.82;
    letter-spacing: -0.08em;
    text-transform: uppercase;
    text-shadow:
      0 0 12px rgba(163,255,51,0.26),
      3px 3px 0 rgba(125, 47, 28, 0.95);
  }

  .broadcastIdentityPanel div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.35rem;
    color: #caff57;
    font-size: 0.64rem;
    text-transform: uppercase;
    font-weight: 900;
  }

  .broadcastIdentityPanel strong {
    color: #baff42;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel {
    display: grid;
    align-content: start;
    gap: 0.55rem;
  }

  .broadcastDefinitionPanel span,
  .broadcastContaminantsPanel span,
  .broadcastContaminantsPanel strong {
    color: #efe9c9;
    font-size: 0.8rem;
    line-height: 1.45;
    font-weight: 800;
  }

  .broadcastContaminantsPanel b,
  .broadcastContaminantsPanel strong {
    color: #baff42;
  }

  .broadcastStatusPanel {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    gap: 0.45rem;
  }

  .broadcastStatusPanel .transmissionFlag {
    width: 100%;
    justify-content: start;
    border: 1px solid rgba(150,255,50,0.45);
    background: rgba(3, 12, 3, 0.86);
    box-shadow: inset 0 0 0 2px rgba(0,0,0,0.4);
  }

  .broadcastWaveform {
    display: flex;
    align-items: center;
    gap: 3px;
    min-height: 0;
    padding: 0.45rem;
    border: 1px solid rgba(150,255,50,0.22);
    background:
      linear-gradient(180deg, rgba(3, 16, 4, 0.88), rgba(1, 5, 1, 0.98));
  }

  .broadcastWaveform i {
    flex: 1;
    height: var(--meter-height);
    background: linear-gradient(180deg, #caff57, #5ed719);
    box-shadow: 0 0 9px rgba(145,255,40,0.42);
  }

  .broadcastStatusPanel .viewToggle {
    min-height: 32px;
    padding: 0.35rem 0.5rem;
    font-size: 0.68rem;
  }
}
CSS

npm run build
git status --short
