#!/usr/bin/env bash
set -euo pipefail

CSS="src/styles.css"

cp "$CSS" "$CSS.bak.SR-002"

cat >> "$CSS" <<'EOF_CSS'

/* === SR-002 Full-width industrial console layout === */

.radioApp {
  min-height: 100dvh;
  padding: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 45% 25%, rgba(57,255,20,.12), transparent 32rem),
    linear-gradient(135deg, #151713, #070907 55%, #1a1712);
}

.masthead {
  min-height: 4.25rem;
  margin: 0;
  border-radius: 0;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  background:
    linear-gradient(90deg, rgba(38,44,33,.95), rgba(15,19,14,.96)),
    url('/stank-radio/assets/bg-matrix-grid.png');
  background-blend-mode: multiply;
  box-shadow: inset 0 -1px 0 rgba(57,255,20,.2), 0 8px 22px rgba(0,0,0,.45);
}

.workspaceGrid {
  width: 100%;
  max-width: none;
  height: calc(100dvh - 4.25rem);
  padding: 0;
  gap: 0;
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(24rem, .72fr);
  grid-template-rows: 5.5rem minmax(0, 1fr) 4.7rem;
  grid-template-areas:
    "hero filters"
    "player library"
    "warning library";
}

.heroDeck {
  grid-area: hero;
  min-height: 0;
  border-radius: 0;
  border-left: 0;
  border-top: 0;
  border-right: 2px solid rgba(57,255,20,.25);
  border-bottom: 2px solid rgba(57,255,20,.25);
  padding: 1rem 1.1rem;
}

.heroDeck .terminalStrip {
  display: none;
}

.heroDeck .heroCopy h1 {
  font-size: clamp(2rem, 4vw, 3.55rem);
  line-height: .78;
}

.heroDeck .heroTagline,
.heroDeck .heroDescription,
.heroDeck .pipeBriefLabel {
  font-size: .68rem;
}

.terminalMetrics {
  padding: .7rem;
}

.heroMetricGrid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .35rem;
  margin-top: .45rem;
}

.heroMetricGrid div {
  padding: .42rem .5rem;
  border-radius: .25rem;
}

.heroMetricGrid span {
  font-size: .48rem;
}

.heroMetricGrid b {
  font-size: .58rem;
}

.consoleGrid {
  display: contents;
}

.playerPanel {
  grid-area: player;
  min-height: 0;
  border-radius: 0;
  border-left: 0;
  border-top: 0;
  border-right: 2px solid rgba(120,120,105,.45);
  border-bottom: 2px solid rgba(120,120,105,.45);
  padding: .7rem;
  background:
    linear-gradient(90deg, rgba(8,14,8,.94), rgba(11,17,11,.88)),
    url('/stank-radio/assets/bg-matrix-grid.png');
  background-size: auto, 320px 320px;
}

.playerPanel > .panelLabel {
  height: 1.5rem;
  margin-bottom: .45rem;
  color: #aaff72;
}

.playerCore.dashboardPlayerCore {
  height: calc(100% - 11rem);
  min-height: 23rem;
  display: grid;
  grid-template-columns: 15rem minmax(20rem, .95fr) minmax(17rem, .8fr);
  gap: .75rem;
}

.containmentSidebar {
  order: 1;
  border: 1px solid rgba(106,120,92,.55);
  background:
    linear-gradient(rgba(3,9,3,.74), rgba(3,9,3,.86)),
    url('/stank-radio/assets/bg-matrix-grid.png');
  box-shadow: inset 0 0 22px rgba(0,0,0,.75);
  padding: .55rem;
}

.coverWell {
  order: 2;
  height: 100%;
  min-height: 0;
  border-radius: 0;
  border: 1px solid rgba(106,120,92,.5);
  box-shadow:
    inset 0 0 0 1px rgba(57,255,20,.1),
    0 0 20px rgba(57,255,20,.08);
}

.coverWell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trackStack {
  order: 3;
  min-height: 0;
  border: 1px solid rgba(106,120,92,.55);
  padding: 1rem;
  background:
    linear-gradient(rgba(5,15,5,.88), rgba(3,8,3,.94)),
    url('/stank-radio/assets/bg-matrix-grid.png');
  box-shadow: inset 0 0 24px rgba(0,0,0,.72);
}

.trackStack h2 {
  color: #9cff73;
  font-size: clamp(2rem, 3.2vw, 3.6rem);
  line-height: .9;
  text-transform: uppercase;
  text-shadow: 0 0 12px rgba(57,255,20,.38);
}

.sourceLine {
  margin-top: .55rem;
}

.lyricsPanel {
  height: 7.2rem;
  margin-top: .55rem;
  border-radius: 0;
  background:
    linear-gradient(rgba(4,11,4,.9), rgba(2,7,2,.95)),
    url('/stank-radio/assets/bg-matrix-grid.png');
}

.transportBar {
  height: 2.75rem;
  margin-top: .55rem;
  display: grid;
  grid-template-columns: 2.3rem minmax(9rem, 12rem) 2.3rem 1fr 1fr 3rem;
  gap: .35rem;
  padding: .25rem;
  border-radius: 0;
  background:
    linear-gradient(180deg, #5b5a4d, #1b1c18 52%, #626050);
  border: 2px solid rgba(0,0,0,.7);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.1);
}

.transportBar button {
  border-radius: .12rem;
}

.filterPanel {
  grid-area: filters;
  border-radius: 0;
  border-top: 0;
  border-right: 0;
  border-left: 2px solid rgba(80,80,70,.8);
  border-bottom: 2px solid rgba(80,80,70,.8);
  background:
    linear-gradient(135deg, rgba(92,94,83,.88), rgba(20,23,19,.94));
  box-shadow: inset 0 0 26px rgba(0,0,0,.68);
}

.searchBox {
  height: 2.7rem;
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgba(10,13,10,.92), rgba(2,5,2,.98));
  box-shadow:
    inset 0 0 15px rgba(0,0,0,.8),
    0 0 0 3px rgba(0,0,0,.25);
}

.libraryPanel {
  grid-area: library;
  min-height: 0;
  border-radius: 0;
  border-top: 0;
  border-right: 0;
  border-bottom: 0;
  border-left: 2px solid rgba(80,80,70,.8);
  padding: 1rem;
  background:
    linear-gradient(rgba(53,55,47,.92), rgba(29,31,27,.96)),
    url('/stank-radio/assets/track-row-plate.png');
  background-size: auto, 380px auto;
}

.libraryPanel .trackList {
  height: calc(100% - 4.7rem);
  overflow-y: auto;
  display: grid;
  grid-auto-rows: 3.1rem;
  gap: .55rem;
}

.trackRow {
  border-radius: .28rem;
  border: 2px solid rgba(8,8,7,.9);
  background:
    linear-gradient(90deg, rgba(16,30,16,.96), rgba(42,64,41,.86), rgba(12,18,12,.96)),
    url('/stank-radio/assets/track-row-plate.png');
  background-size: auto, cover;
  box-shadow:
    inset 0 0 0 1px rgba(210,220,190,.35),
    inset 0 0 18px rgba(57,255,20,.08),
    0 2px 0 rgba(0,0,0,.65);
}

.trackRow.active {
  border-color: rgba(156,255,115,.8);
  box-shadow:
    inset 0 0 0 1px rgba(210,255,190,.55),
    0 0 16px rgba(57,255,20,.18);
}

.trackRow img {
  border-radius: .08rem;
}

.libraryPagination {
  height: 2rem;
  margin-top: .6rem;
}

.warningPanel {
  grid-area: warning;
  border-radius: 0;
  border-left: 0;
  border-right: 2px solid rgba(120,120,105,.45);
  border-bottom: 0;
  padding: .45rem .7rem;
  background:
    linear-gradient(90deg, rgba(90,18,13,.86), rgba(8,8,6,.94)),
    repeating-linear-gradient(135deg, rgba(255,204,0,.34) 0 12px, rgba(0,0,0,.25) 12px 24px);
}

.warningPanel ul {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .35rem;
  margin: 0;
}

.warningPanel li {
  font-size: .58rem;
}

@media (max-width: 1100px) {
  .radioApp {
    overflow: auto;
  }

  .workspaceGrid {
    height: auto;
    min-height: calc(100dvh - 4.25rem);
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      "hero"
      "filters"
      "player"
      "library"
      "warning";
  }

  .playerCore.dashboardPlayerCore {
    height: auto;
    min-height: 0;
    grid-template-columns: 1fr;
  }

  .libraryPanel .trackList {
    height: auto;
  }

  .warningPanel ul {
    grid-template-columns: 1fr;
  }
}
EOF_CSS

npm run build
