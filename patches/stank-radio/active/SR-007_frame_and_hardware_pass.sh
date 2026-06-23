#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-007.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-007 FRAME + HARDWARE PASS === */
@media (min-width: 1101px) {

  .industrialShell {
    grid-template-columns:
      190px
      minmax(0, 0.95fr)
      minmax(340px, 0.55fr)
      minmax(480px, 0.90fr);
  }

  .industrialHeader {
    min-height: 58px;
    padding: 0.3rem 0.5rem;
  }

  .industrialHeader .brand {
    min-width: 260px;
    max-width: 320px;
  }

  .industrialHeader .brand b {
    font-size: 1.2rem;
  }

  .industrialHeader .brand small {
    font-size: 0.62rem;
  }

  .industrialLeftRail {
    position: relative;
    overflow: hidden;
  }

  .industrialLeftRail::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.18) 100%);
  }

  .industrialGauge {
    min-width: 0;
    overflow: hidden;
  }

  .industrialGauge span {
    font-size: 0.78rem;
    white-space: nowrap;
  }

  .industrialGauge b {
    font-size: 1rem;
  }

  .industrialMainBay {
    position: relative;
  }

  .industrialMainBay::after {
    content: "";
    position: absolute;
    top: 14px;
    right: 14px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 35% 35%, #ffb2a0, #c83d1f 45%, #5f1409 100%);
    box-shadow:
      0 0 12px rgba(255,80,40,0.55),
      0 0 28px rgba(255,40,20,0.35);
  }

  .industrialArtworkBay {
    position: relative;
  }

  .industrialArtworkBay::after {
    content: "";
    position: absolute;
    inset: 10px;
    pointer-events: none;
    border: 1px solid rgba(160,255,55,0.10);
    box-shadow:
      inset 0 0 0 1px rgba(0,0,0,0.55);
  }

  .industrialTrackTerminal,
  .industrialLyrics,
  .industrialLibraryBay {
    position: relative;
  }

  .industrialTrackTerminal::before,
  .industrialLyrics::before,
  .industrialLibraryBay::before {
    content: "";
    position: absolute;
    inset: 6px;
    pointer-events: none;
    border: 1px solid rgba(160,255,55,0.08);
  }

  .industrialLibraryBay .trackRow {
    position: relative;
    padding-right: 52px;
  }

  .industrialLibraryBay .trackRow::after {
    width: 24px;
    height: 34px;
    border-radius: 2px;
    background:
      linear-gradient(180deg, #8c846d, #403d32);
    border: 2px solid #151611;
    box-shadow:
      inset 0 0 0 2px rgba(0,0,0,0.4),
      inset 0 1px 0 rgba(255,255,255,0.08);
  }

  .industrialLibraryBay .trackRow::before {
    content: "";
    position: absolute;
    right: 17px;
    top: 50%;
    width: 8px;
    height: 8px;
    margin-top: -4px;
    border-radius: 50%;
    background: rgba(0,0,0,0.55);
    z-index: 3;
  }

  .industrialWarningStrip {
    position: relative;
  }

  .industrialWarningStrip::after {
    content: "";
    position: absolute;
    right: 16px;
    top: 50%;
    width: 28px;
    height: 28px;
    margin-top: -14px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 35% 35%, #ffcfbf, #ff5a32 45%, #8a2412 100%);
    box-shadow:
      0 0 10px rgba(255,90,50,0.75),
      0 0 30px rgba(255,50,20,0.35);
  }

  .industrialShell::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(
        90deg,
        transparent 189px,
        rgba(0,0,0,0.28) 190px,
        rgba(255,255,255,0.03) 191px,
        transparent 192px
      );
  }

  .industrialShell::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      radial-gradient(circle, rgba(0,0,0,0.65) 2px, transparent 3px);
    background-size: 120px 120px;
    opacity: 0.35;
  }
}
CSS

npm run build
git status --short
