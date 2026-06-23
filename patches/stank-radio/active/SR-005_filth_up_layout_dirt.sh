#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "FILTH-UP" ]; then
  echo "ERROR: Not on FILTH-UP branch"
  exit 1
fi

cp src/styles.css "src/styles.css.bak.SR-005.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-005 FILTH-UP LAYOUT DIRT === */
@media (min-width: 1101px) {
  .radioApp.filthUpView {
    min-height: 100vh;
    padding: 0.65rem;
    overflow: hidden;
  }

  .radioApp.filthUpView .masthead {
    min-height: 76px;
    display: grid;
    grid-template-columns: 1.2fr auto auto auto auto;
    gap: 0.6rem;
    align-items: center;
    border-radius: 8px 8px 3px 3px;
  }

  .radioApp.filthUpView .workspaceGrid {
    display: grid;
    grid-template-rows: 138px minmax(0, 1fr);
    max-width: none;
    width: 100%;
    height: calc(100vh - 98px);
    margin: 0;
  }

  .radioApp.filthUpView .heroDeck {
    display: grid;
    grid-template-columns: 1.2fr 1.6fr;
    align-items: stretch;
    padding: 0.75rem;
    border-radius: 4px;
    overflow: hidden;
  }

  .radioApp.filthUpView .terminalStrip {
    position: absolute;
    top: 0.45rem;
    left: 0.55rem;
    right: 0.55rem;
    z-index: 3;
    border: 1px solid rgba(140, 255, 54, 0.28);
    background: rgba(4, 10, 5, 0.72);
  }

  .radioApp.filthUpView .heroCopy {
    justify-content: end;
    padding-top: 1.8rem;
  }

  .radioApp.filthUpView .heroCopy h1 {
    font-size: clamp(2.4rem, 6vw, 5.6rem);
    line-height: 0.78;
    letter-spacing: -0.07em;
    text-shadow:
      0 0 12px rgba(137, 255, 45, 0.38),
      4px 4px 0 rgba(0, 0, 0, 0.9);
  }

  .radioApp.filthUpView .pipeBrief {
    align-self: end;
    min-height: 104px;
    border-radius: 3px;
    background:
      linear-gradient(180deg, rgba(6, 20, 7, 0.88), rgba(2, 8, 3, 0.95));
  }

  .radioApp.filthUpView .consoleGrid {
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.78fr);
    grid-template-rows: 96px minmax(0, 1fr) 118px;
    grid-template-areas:
      "player filters"
      "player library"
      "warnings library";
  }

  .radioApp.filthUpView .playerPanel {
    grid-area: player;
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto minmax(120px, 0.55fr) auto;
    gap: 0.55rem;
    padding: 0.7rem;
    overflow: hidden;
  }

  .radioApp.filthUpView .filterPanel {
    grid-area: filters;
    min-height: 0;
    padding: 0.65rem;
  }

  .radioApp.filthUpView .libraryPanel {
    grid-area: library;
    min-height: 0;
    padding: 0.65rem;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
  }

  .radioApp.filthUpView .warningPanel {
    grid-area: warnings;
    min-height: 0;
    padding: 0.65rem;
    overflow: hidden;
  }

  .radioApp.filthUpView .playerCore {
    min-height: 0;
    display: grid;
    grid-template-columns: 150px minmax(260px, 0.85fr) minmax(320px, 1fr);
    gap: 0.55rem;
    align-items: stretch;
  }

  .radioApp.filthUpView .containmentSidebar {
    display: grid;
    grid-template-rows: 1fr auto auto auto;
    gap: 0.45rem;
    padding: 0.5rem;
    border: 1px solid rgba(94, 101, 78, 0.95);
    background:
      linear-gradient(180deg, rgba(74, 72, 59, 0.66), rgba(14, 15, 12, 0.94));
  }

  .radioApp.filthUpView .coverWell {
    min-height: 0;
    height: 100%;
    aspect-ratio: auto;
    display: grid;
    place-items: center;
    border-radius: 4px;
    background:
      radial-gradient(circle, rgba(119, 255, 40, 0.16), transparent 62%),
      #080b07;
  }

  .radioApp.filthUpView .coverWell img {
    width: min(100%, 48vh);
    height: min(100%, 48vh);
    object-fit: cover;
    border-radius: 2px;
  }

  .radioApp.filthUpView .trackStack {
    min-height: 0;
    border: 1px solid rgba(80, 255, 44, 0.25);
    background:
      linear-gradient(180deg, rgba(5, 23, 7, 0.86), rgba(2, 8, 3, 0.96));
    padding: 0.85rem;
    overflow: hidden;
  }

  .radioApp.filthUpView .trackStack h2 {
    color: #caff57;
    font-size: clamp(1.8rem, 3vw, 3.2rem);
    line-height: 0.92;
  }

  .radioApp.filthUpView .trackMeta {
    grid-template-columns: repeat(3, 1fr);
  }

  .radioApp.filthUpView .lyricsPanel {
    min-height: 0;
    overflow: hidden;
    border: 1px solid rgba(80, 255, 44, 0.25);
    background:
      linear-gradient(180deg, rgba(4, 18, 5, 0.88), rgba(2, 8, 3, 0.97));
  }

  .radioApp.filthUpView .lyricsScroll {
    max-height: none;
    height: 100%;
  }

  .radioApp.filthUpView .transportBar {
    min-height: 58px;
    align-items: stretch;
    border: 1px solid rgba(95, 90, 72, 0.95);
    background:
      linear-gradient(180deg, rgba(82, 80, 66, 0.72), rgba(18, 18, 15, 0.96));
    padding: 0.4rem;
  }

  .radioApp.filthUpView .transportBar button {
    border-radius: 2px;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.09),
      inset 0 -2px 0 rgba(0,0,0,0.65);
  }

  .radioApp.filthUpView .transportBar .primaryPlay {
    min-width: 210px;
    font-size: 0.95rem;
  }

  .radioApp.filthUpView .trackList {
    min-height: 0;
    overflow: auto;
    padding-right: 0.15rem;
  }

  .radioApp.filthUpView .trackRow {
    min-height: 58px;
    border-radius: 2px;
  }

  .radioApp.filthUpView .trackRow img {
    width: 44px;
    height: 44px;
    border-radius: 2px;
  }

  .radioApp.filthUpView .warningPanel ul {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.45rem;
  }

  .radioApp.filthUpView .warningPanel li {
    margin: 0;
    font-size: 0.72rem;
  }
}
CSS

npm run build
git status --short
