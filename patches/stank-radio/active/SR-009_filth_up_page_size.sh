#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/main.jsx "src/main.jsx.bak.SR-009.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

path = Path("src/main.jsx")
text = path.read_text()

text = text.replace(
"  const visibleTracks = filteredTracks;\n  const totalLibraryPages = Math.max(1, Math.ceil(visibleTracks.length / TRACKS_PER_PAGE));\n  const pagedTracks = visibleTracks.slice(\n    (libraryPage - 1) * TRACKS_PER_PAGE,\n    libraryPage * TRACKS_PER_PAGE,\n  );",
"  const visibleTracks = filteredTracks;\n  const tracksPerPage = viewMode === 'filth' ? 7 : TRACKS_PER_PAGE;\n  const totalLibraryPages = Math.max(1, Math.ceil(visibleTracks.length / tracksPerPage));\n  const pagedTracks = visibleTracks.slice(\n    (libraryPage - 1) * tracksPerPage,\n    libraryPage * tracksPerPage,\n  );"
)

path.write_text(text)
PY

npm run build
git status --short
