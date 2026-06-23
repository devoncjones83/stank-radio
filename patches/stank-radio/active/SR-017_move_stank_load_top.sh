#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/main.jsx "src/main.jsx.bak.SR-017.$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-017.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

path = Path("src/main.jsx")
text = path.read_text()

text = text.replace(
"""                <div className="broadcastIndexedBox">
                  <span>Indexed</span>
                  <b>{tracks.length}</b>
                </div>""",
"""                <div className="broadcastIndexedBox broadcastStankLoadBox">
                  <span>Stank Load</span>
                  <b>{activeTrack ? `${stankIndex}%` : '--'}</b>
                </div>
                <div className="broadcastIndexedBox">
                  <span>Indexed</span>
                  <b>{tracks.length}</b>
                </div>"""
)

text = text.replace(
"""              <dl>
                <div><dt>Operator</dt><dd>{displayTrack.artist}</dd></div>
                <div><dt>Stank Load</dt><dd>{activeTrack ? `${stankIndex}%` : 'None'}</dd></div>
                <div><dt>Indexed</dt><dd>{tracks.length || 0} tracks</dd></div>
              </dl>""",
""
)

path.write_text(text)
PY

cat >> src/styles.css <<'CSS'

/* === SR-017 MOVE STANK LOAD TOP === */
@media (min-width: 1101px) {
  .broadcastStatusControls {
    grid-template-columns: 1.4fr 0.55fr 0.55fr;
  }

  .broadcastStankLoadBox b {
    color: #d8ff58;
  }

  .industrialTrackTerminal {
    display: grid;
    align-content: start;
    gap: 0.45rem;
  }

  .industrialTrackTerminal dl {
    display: none;
  }

  .industrialTrackTerminal > p:not(.trackTag) {
    max-height: none;
  }
}
CSS

npm run build
git status --short
