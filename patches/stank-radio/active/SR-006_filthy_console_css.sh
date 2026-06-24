#!/usr/bin/env bash
set -euo pipefail

cp src/styles.css /tmp/stank-radio-styles.pre-SR-006.css

cat >> src/styles.css <<'CSS'

/* === SR-006 FILTHY CONSOLE CSS FOR CODEX JSX === */
@media (min-width: 1101px) {
  .headerRoomTone,
  .headerSignal {
    display: none !important;
  }

  .background-grid {
    background-image:
      linear-gradient(rgba(10, 14, 10, 0.94), rgba(10, 14, 10, 0.94)),
      linear-gradient(to right, rgba(167,255,97,.055) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(167,255,97,.045) 1px, transparent 1px) !important;
    background-size: 100% 100%, 10px 10px, 10px 10px !important;
  }

  .text-glow {
    text-shadow:
      0 0 8px rgba(167,255,97,.65),
      0 0 20px rgba(167,255,97,.32),
      3px 3px 0 rgba(0,0,0,.9) !important;
  }

  .workspaceGrid.dashboardContainment {
    grid-template-columns: minmax(0, 1.48fr) minmax(22rem, 0.52fr) !important;
    grid-template-rows: 8.25rem minmax(0, 1fr) 4.6rem !important;
    gap: 0.65rem !important;
  }

  .heroDeck.broadcastTerminal {
    display: grid !important;
    grid-template-columns: minmax(0, 1.05fr) minmax(21rem, 0.95fr) !important;
    grid-template-rows: auto minmax(0, 1fr) !important;
    gap: 0.55rem 0.85rem !important;
    min-height: 0 !important;
    padding: 0.75rem !important;
    border: 3px solid rgba(38,45,35,.96) !important;
    background:
      radial-gradient(circle at 30% 25%, rgba(167,255,97,.16), transparent 34%),
      linear-gradient(120deg, rgba(15,21,13,.96), rgba(4,7,4,.94)) !important;
  }

  .terminalStrip {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.45rem;
    border-bottom: 1px solid rgba(167,255,97,.28);
    color: rgba(246,239,212,.75);
    font-family: "Lucida Console", "Courier New", monospace;
    font-size: 0.66rem;
    text-transform: uppercase;
  }

  .terminalStrip strong {
    color: #a7ff61;
  }

  .heroCopy {
    min-width: 0;
    align-self: center;
  }

  .heroCopy h1 {
    font-size: clamp(2.7rem, 4vw, 4.9rem) !important;
    line-height: 0.82 !important;
  }

  .terminalMetrics {
    align-self: stretch;
    padding: 0.65rem !important;
    border: 2px solid rgba(38,45,35,.96);
    background: rgba(3,8,3,.72);
  }

  .pipeBriefLabel {
    font-size: 0.78rem !important;
  }

  .heroMetricGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.45rem;
    margin-top: 0.55rem;
  }

  .heroMetricGrid div,
  .sidebarMetric,
  .containmentGauge {
    border: 2px solid rgba(38,45,35,.96);
    background:
      linear-gradient(180deg, rgba(37,47,34,.92), rgba(7,11,7,.95));
    box-shadow: inset 0 0 18px rgba(0,0,0,.68);
  }

  .heroMetricGrid div {
    padding: 0.45rem;
  }

  .heroMetricGrid span,
  .sidebarMetric span,
  .containmentGauge span {
    display: block;
    color: rgba(246,239,212,.62);
    font-family: "Lucida Console", "Courier New", monospace;
    font-size: 0.58rem;
    font-weight: 1000;
    text-transform: uppercase;
  }

  .heroMetricGrid b,
  .sidebarMetric b {
    display: block;
    margin-top: 0.2rem;
    color: #a7ff61;
    font-family: Impact, Haettenschweiler, "Arial Black", sans-serif;
    font-size: 1.15rem;
    line-height: 0.95;
    text-transform: uppercase;
  }

  .playerPanel {
    overflow: hidden !important;
    padding: 0.7rem !important;
  }

  .playerCore.dashboardPlayerCore {
    display: grid !important;
    grid-template-columns: 10.5rem minmax(20rem, 42%) minmax(0, 1fr) !important;
    gap: 0.65rem !important;
    align-items: stretch !important;
  }

  .containmentSidebar {
    display: grid;
    grid-template-rows: 1.25fr repeat(3, 0.72fr);
    gap: 0.5rem;
    min-width: 0;
  }

  .containmentGauge,
  .sidebarMetric {
    display: grid;
    align-content: center;
    justify-items: center;
    min-height: 4.5rem;
    padding: 0.45rem;
    text-align: center;
  }

  .gaugeFace {
    position: relative;
    width: 7.4rem;
    height: 4rem;
    margin-top: 0.35rem;
    overflow: hidden;
    border: 1px solid rgba(167,255,97,.26);
    border-radius: 7rem 7rem 0 0;
    background: radial-gradient(circle at 50% 90%, rgba(167,255,97,.22), rgba(0,0,0,.88) 58%);
  }

  .gaugeNeedle {
    position: absolute;
    bottom: 0.2rem;
    left: 50%;
    width: 2px;
    height: 3.25rem;
    background: #ff3434;
    transform: translateX(-50%) rotate(-48deg);
    transform-origin: bottom center;
    transition: transform .25s ease;
  }

  .gaugeNeedle.active {
    transform: translateX(-50%) rotate(36deg);
  }

  .gaugeFace em {
    position: absolute;
    bottom: 0.25rem;
    left: 0;
    width: 100%;
    color: rgba(246,239,212,.48);
    font-size: 0.52rem;
    font-style: normal;
    text-align: center;
  }

  .coverWell,
  .coverWell img {
    min-height: 22rem !important;
    max-height: 44vh !important;
  }

  .trackStack {
    min-width: 0;
    justify-content: center !important;
    padding: 0.75rem;
    border: 2px solid rgba(38,45,35,.96);
    background: rgba(4,9,4,.82);
  }

  .trackStack h2 {
    font-size: clamp(2rem, 3vw, 3.45rem) !important;
    line-height: 0.9 !important;
  }

  .trackStack > p:not(.trackTag) {
    font-size: 0.92rem !important;
    line-height: 1.3 !important;
    max-height: 5.2em;
    overflow: hidden;
  }

  .sourceLine,
  .lyricsPanel,
  .transportBar {
    margin-top: 0.55rem !important;
  }

  .transportBar {
    padding-top: 0 !important;
  }

  .lyricsScroll {
    max-height: 3.5rem !important;
  }

  .filterPanel {
    min-height: 0 !important;
    padding: 0.65rem !important;
  }

  .libraryPanel .trackList {
    max-height: calc(100vh - 19rem) !important;
    overflow: auto !important;
  }

  .trackRow {
    min-height: 3.55rem !important;
  }
}
CSS

npm run build
docker restart bigdumbidiot-stank-radio
