#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/main.jsx "src/main.jsx.bak.SR-018.$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-018.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

path = Path("src/main.jsx")
text = path.read_text()

text = text.replace(
"""              <p>MAXIMUM</p>
              <h1>STANK RADIO</h1>
              <div>
                <span>PUBLIC BROADCAST</span>
                <b>QUESTIONABLE FREQUENCY</b>
              </div>
              <strong>88.8 STANK FM</strong>""",
"""              <h1>STANK RADIO</h1>
              <strong>BIG DUMB IDIOT LABS: BROADCAST DIVISION</strong>
              <div className="broadcastIdentityCopy">
                <span>Infecting your Ear Holes with</span>
                <b>MAXIMUM STANK</b>
                <em>If it smells like a hit, it probably came from here.</em>
              </div>"""
)

text = text.replace(
"              <p>MAXIMUM STANK: OFFICIAL DEFINITION</p>",
"              <p>MAXIMUM STANK: noun</p>"
)

path.write_text(text)
PY

cat >> src/styles.css <<'CSS'

/* === SR-018 STANK RADIO HEADER COPY === */
@media (min-width: 1101px) {
  .broadcastIdentityPanel {
    grid-template-rows: auto auto 1fr;
    align-content: center;
    gap: 0.35rem;
  }

  .broadcastIdentityPanel h1 {
    font-size: clamp(2.4rem, 3.6vw, 4.8rem);
    line-height: 0.82;
    margin: 0;
  }

  .broadcastIdentityPanel strong {
    margin: 0;
    font-size: 0.74rem;
    line-height: 1;
    color: #d8d0aa;
    letter-spacing: 0.08em;
  }

  .broadcastIdentityPanel .broadcastIdentityCopy {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.1rem;
    align-content: end;
    color: #efe9c9;
    font-weight: 900;
    text-transform: none;
  }

  .broadcastIdentityCopy span {
    color: #efe9c9;
    font-size: 0.82rem;
  }

  .broadcastIdentityCopy b {
    color: #caff57;
    font-size: 1.05rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .broadcastIdentityCopy em {
    color: #efe9c9;
    font-size: 0.82rem;
    font-style: normal;
  }

  .broadcastDefinitionPanel p {
    text-transform: none;
  }
}
CSS

npm run build
git status --short
