#!/usr/bin/env bash
set -euo pipefail

cp src/main.jsx "src/main.jsx.bak.SR-004.$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-004.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

main = Path("src/main.jsx")
text = main.read_text()

text = text.replace(
"  const [loadStatus, setLoadStatus] = useState('Tuning the contamination manifest');",
"  const [loadStatus, setLoadStatus] = useState('Tuning the contamination manifest');\n  const [viewMode, setViewMode] = useState('containment');"
)

text = text.replace(
"    <main className={playing ? 'radioApp isPlaying' : 'radioApp'}>",
"    <main className={`${playing ? 'radioApp isPlaying' : 'radioApp'} ${viewMode === 'filth' ? 'filthUpView' : 'containmentView'}`}>"
)

text = text.replace(
"""        <a
          className="manifestLink"
          href={`${BASE}songs.json`}
          target="_blank"
          rel="noreferrer"
        >
          <FileAudio size={16} />
          Music manifest
          <ExternalLink size={14} />
        </a>""",
"""        <button
          className="viewToggle"
          type="button"
          onClick={() => setViewMode((mode) => (mode === 'containment' ? 'filth' : 'containment'))}
          aria-pressed={viewMode === 'filth'}
        >
          {viewMode === 'filth' ? 'Containment View' : 'Filth-Up View'}
        </button>

        <a
          className="manifestLink"
          href={`${BASE}songs.json`}
          target="_blank"
          rel="noreferrer"
        >
          <FileAudio size={16} />
          Music manifest
          <ExternalLink size={14} />
        </a>"""
)

main.write_text(text)

css = Path("src/styles.css")
css.write_text(css.read_text() + r'''

/* === SR-004 FILTH-UP VIEW SHELL === */
.viewToggle {
  border: 1px solid rgba(155, 255, 64, 0.65);
  background:
    linear-gradient(180deg, rgba(122, 42, 21, 0.55), rgba(23, 20, 14, 0.95)),
    rgba(10, 14, 8, 0.9);
  color: #baff42;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  font-weight: 900;
  font-size: 0.72rem;
  padding: 0.82rem 1rem;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.8), 0 0 18px rgba(138, 255, 45, 0.12);
  cursor: pointer;
}

.viewToggle:hover,
.viewToggle:focus-visible {
  border-color: #e86d43;
  color: #fff2d8;
}

.radioApp.filthUpView {
  --panel: rgba(26, 28, 22, 0.94);
  --panel-strong: rgba(44, 46, 38, 0.98);
  --line: rgba(105, 118, 87, 0.65);
  --green: #9eff35;
  --amber: #d2a95f;
  --rust: #8f3f24;
  background:
    radial-gradient(circle at 52% 36%, rgba(74, 255, 25, 0.11), transparent 26rem),
    linear-gradient(135deg, rgba(75, 71, 58, 0.5), rgba(15, 16, 13, 0.96) 40%, rgba(54, 40, 31, 0.8));
}

.radioApp.filthUpView .masthead,
.radioApp.filthUpView .heroDeck,
.radioApp.filthUpView .playerPanel,
.radioApp.filthUpView .filterPanel,
.radioApp.filthUpView .libraryPanel,
.radioApp.filthUpView .warningPanel {
  border-color: rgba(79, 87, 66, 0.9);
  background:
    linear-gradient(180deg, rgba(87, 86, 73, 0.44), rgba(23, 24, 20, 0.95)),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 42px);
  box-shadow:
    inset 0 0 0 2px rgba(0,0,0,0.65),
    inset 0 0 30px rgba(0,0,0,0.55),
    0 0 24px rgba(0,0,0,0.35);
}

.radioApp.filthUpView .workspaceGrid {
  gap: 0.55rem;
}

.radioApp.filthUpView .heroDeck {
  min-height: 128px;
}

.radioApp.filthUpView .consoleGrid {
  gap: 0.55rem;
}

.radioApp.filthUpView .coverWell {
  border: 2px solid rgba(24, 24, 20, 0.95);
  box-shadow:
    inset 0 0 0 4px rgba(95, 92, 76, 0.48),
    0 0 0 1px rgba(0,0,0,0.9),
    0 0 32px rgba(113, 255, 35, 0.18);
}

.radioApp.filthUpView .trackRow,
.radioApp.filthUpView .transportBar button,
.radioApp.filthUpView .searchBox,
.radioApp.filthUpView .playlistLink {
  border-color: rgba(91, 95, 78, 0.92);
  background:
    linear-gradient(180deg, rgba(78, 82, 69, 0.75), rgba(21, 23, 19, 0.95));
}

.radioApp.filthUpView .primaryPlay {
  background:
    linear-gradient(180deg, rgba(143, 63, 36, 0.95), rgba(72, 30, 20, 0.98)) !important;
  color: #ffe9cc;
}

.radioApp.filthUpView .warningPanel {
  border-color: rgba(232, 88, 44, 0.7);
  background:
    linear-gradient(180deg, rgba(90, 30, 18, 0.6), rgba(18, 10, 8, 0.94)),
    repeating-linear-gradient(90deg, rgba(255, 180, 50, 0.22) 0 18px, rgba(20, 10, 0, 0.4) 18px 36px);
}
''')
PY

npm run build
git status --short
