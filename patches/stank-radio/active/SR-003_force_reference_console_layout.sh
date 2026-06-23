#!/usr/bin/env bash
set -euo pipefail

CSS="src/styles.css"
cp "$CSS" "$CSS.bak.SR-003"

cat >> "$CSS" <<'EOF_CSS'

/* === SR-003 Force reference console layout === */

@media (min-width: 1101px) {
  .radioApp {
    height: 100dvh;
    overflow: hidden;
  }

  .masthead {
    height: 4.6rem;
    display: grid;
    grid-template-columns: 19rem 14rem 1fr 12rem;
    gap: .8rem;
    align-items: center;
    padding: .45rem .7rem;
  }

  .brand b {
    font-size: 1.55rem;
    line-height: .9;
  }

  .brand img {
    width: 2.3rem;
    height: 2.3rem;
  }

  .workspaceGrid {
    height: calc(100dvh - 4.6rem);
    grid-template-columns: minmax(0, 1fr) 27rem;
    grid-template-rows: 5.2rem minmax(0, 1fr) 4.2rem;
    grid-template-areas:
      "hero filters"
      "player library"
      "warning library";
  }

  .heroDeck {
    display: grid;
    grid-template-columns: 19rem minmax(0, 1fr) 22rem;
    align-items: center;
    gap: .9rem;
    padding: .55rem .7rem;
  }

  .heroCopy h1 {
    font-size: 3rem !important;
    line-height: .75 !important;
    letter-spacing: -.07em;
  }

  .heroCopy .eyebrow {
    font-size: .52rem;
    margin-bottom: .2rem;
  }

  .heroTagline {
    font-size: .66rem !important;
  }

  .pipeBrief {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .heroMetricGrid {
    grid-template-columns: repeat(4, 1fr);
  }

  .heroMetricGrid div {
    padding: .28rem .34rem;
  }

  .consoleGrid {
    display: contents !important;
  }

  .playerPanel {
    display: grid;
    grid-template-rows: 1.6rem minmax(0, 1fr) auto auto 2.6rem;
    gap: .45rem;
    padding: .45rem;
  }

  .playerCore.dashboardPlayerCore {
    height: auto !important;
    min-height: 0 !important;
    display: grid;
    grid-template-columns: 15rem minmax(24rem, .95fr) minmax(18rem, .78fr);
    gap: .55rem;
  }

  .containmentSidebar {
    height: 100%;
    display: grid;
    grid-template-rows: 5.6rem repeat(3, 3.05rem) 1fr;
    gap: .45rem;
  }

  .containmentGauge,
  .sidebarMetric {
    border-radius: .35rem;
  }

  .coverWell {
    height: 100%;
    max-height: none;
  }

  .coverWell img {
    height: 100%;
    object-fit: cover;
  }

  .vinylBadge {
    left: 1rem;
    right: auto;
    bottom: .65rem;
  }

  .trackStack {
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto auto auto auto 1fr;
  }

  .trackStack h2 {
    font-size: clamp(2.4rem, 3.7vw, 4.4rem) !important;
    line-height: .82 !important;
  }

  .trackStack > p:not(.trackTag) {
    font-size: .8rem;
  }

  .trackMeta {
    margin-top: .8rem;
  }

  .sourceLine {
    min-height: 2.1rem;
    margin: 0;
  }

  .sourceButton {
    width: 13.5rem;
    justify-content: center;
  }

  .lyricsPanel {
    height: 4.6rem !important;
    margin: 0;
  }

  .lyricsScroll {
    max-height: 2.6rem;
  }

  .transportBar {
    margin: 0;
    height: 2.35rem;
    grid-template-columns: 2.2rem 9rem 2.2rem 1fr 1fr;
  }

  .transportBar button {
    min-height: 0;
    height: 100%;
  }

  .libraryPanel {
    display: grid;
    grid-template-rows: 2.4rem minmax(0, 1fr) 2.2rem;
  }

  .libraryPanel .trackList {
    height: auto !important;
    grid-auto-rows: 3.18rem;
    overflow-y: hidden;
  }

  .trackRow {
    min-height: 0;
    padding: .32rem;
    grid-template-columns: 2.35rem minmax(0, 1fr);
  }

  .trackRow img {
    width: 2.05rem;
    height: 2.05rem;
  }

  .trackRowText b {
    font-size: .86rem;
  }

  .trackRowText small {
    font-size: .53rem;
  }

  .filterPanel {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 2.7rem;
    gap: .55rem;
    padding: .7rem;
  }

  .filterHeader {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: .45rem;
    align-items: center;
  }

  .warningPanel {
    height: 4.2rem;
    overflow: hidden;
  }
}

/* make the whole console feel more like worn metal instead of flat green */
.masthead,
.filterPanel,
.libraryPanel,
.playerPanel,
.warningPanel {
  background-blend-mode: overlay, normal;
}

.libraryPanel,
.filterPanel {
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.07),
    inset 0 0 35px rgba(0,0,0,.8);
}

EOF_CSS

npm run build
