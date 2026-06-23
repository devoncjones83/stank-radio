#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "FILTH-UP" ]; then
  echo "ERROR: Not on FILTH-UP branch"
  exit 1
fi

cp src/styles.css "src/styles.css.bak.SR-006.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-006 INDUSTRIAL SKIN PASS === */
@media (min-width: 1101px) {
  .radioApp.filthUpView {
    padding: 0;
    background:
      radial-gradient(circle at 34% 38%, rgba(117, 255, 25, 0.08), transparent 33rem),
      linear-gradient(180deg, #5b5a50 0%, #35342e 18%, #1a1a16 55%, #0e0e0c 100%);
  }

  .radioApp.filthUpView::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    opacity: 0.42;
    background:
      repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 5px),
      repeating-linear-gradient(90deg, rgba(0,0,0,0.24) 0 2px, transparent 2px 46px),
      radial-gradient(circle at 20% 10%, rgba(123, 61, 31, 0.32), transparent 24rem),
      radial-gradient(circle at 88% 76%, rgba(105, 48, 24, 0.26), transparent 28rem);
    mix-blend-mode: overlay;
  }

  .industrialShell {
    height: 100vh;
    border: 4px solid #161611;
    border-radius: 0;
    gap: 0;
    padding: 0;
    background:
      linear-gradient(180deg, rgba(105, 103, 91, 0.95), rgba(55, 54, 47, 0.98)),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 84px);
    box-shadow:
      inset 0 0 0 2px #77715f,
      inset 0 0 0 6px #23231d,
      inset 0 0 80px rgba(0,0,0,0.8);
  }

  .industrialHeader,
  .industrialLeftRail,
  .industrialMainBay,
  .industrialInfoBay,
  .industrialLibraryBay,
  .industrialWarningStrip {
    position: relative;
    border: 2px solid #151610;
    border-radius: 0;
    background:
      linear-gradient(180deg, rgba(103, 101, 88, 0.88), rgba(53, 52, 45, 0.98)),
      repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 7px);
    box-shadow:
      inset 0 0 0 2px rgba(145, 138, 111, 0.32),
      inset 0 0 0 5px rgba(0,0,0,0.36),
      inset 0 0 34px rgba(0,0,0,0.72);
  }

  .industrialHeader::before,
  .industrialLeftRail::before,
  .industrialMainBay::before,
  .industrialInfoBay::before,
  .industrialLibraryBay::before {
    content: "";
    position: absolute;
    inset: 8px;
    pointer-events: none;
    border: 1px solid rgba(17, 17, 13, 0.88);
    box-shadow: inset 0 0 0 1px rgba(157, 151, 126, 0.18);
  }

  .industrialHeader {
    padding: 0.45rem 0.6rem;
    border-bottom-width: 4px;
    background:
      linear-gradient(180deg, rgba(82, 82, 74, 0.96), rgba(35, 36, 31, 0.98)),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 54px);
  }

  .industrialHeader .brand {
    width: max-content;
    min-width: 360px;
    border: 1px solid #161811;
    background:
      linear-gradient(180deg, rgba(18, 26, 15, 0.94), rgba(7, 9, 6, 0.98));
    padding: 0.35rem 0.55rem;
    box-shadow:
      inset 0 0 0 2px rgba(125,255,43,0.12),
      0 0 0 2px rgba(0,0,0,0.35);
  }

  .industrialHeader .brand b {
    font-size: 1.55rem;
  }

  .industrialHeader .transmissionFlag,
  .industrialHeader .viewToggle {
    border: 2px solid #141610;
    background:
      linear-gradient(180deg, #3c3b33, #171812);
    box-shadow:
      inset 0 0 0 2px rgba(135, 130, 106, 0.24),
      inset 0 -8px 14px rgba(0,0,0,0.42);
  }

  .industrialLeftRail {
    border-right-width: 4px;
    padding: 0.45rem;
    background:
      linear-gradient(180deg, #4d4d43, #26261f 45%, #171710),
      repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 40px);
  }

  .industrialGauge {
    position: relative;
    border: 3px solid #151510;
    border-radius: 0;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 74%, #1d1d18 0 15%, transparent 16%),
      radial-gradient(ellipse at 50% 76%, rgba(230, 242, 190, 0.82), rgba(155, 174, 121, 0.74) 33%, rgba(54, 58, 45, 0.98) 55%, #11120d 75%);
    box-shadow:
      inset 0 0 0 3px rgba(0,0,0,0.48),
      inset 0 0 18px rgba(255,255,210,0.16);
  }

  .industrialGauge::before {
    content: "";
    position: absolute;
    left: 15%;
    right: 15%;
    top: 28%;
    height: 38%;
    border-top: 3px solid rgba(20, 32, 18, 0.7);
    border-radius: 50% 50% 0 0;
  }

  .industrialGauge::after {
    content: "";
    position: absolute;
    left: 27%;
    right: 27%;
    top: 34%;
    height: 26%;
    border-top: 4px solid rgba(174, 32, 24, 0.72);
    border-radius: 50% 50% 0 0;
  }

  .industrialGauge span {
    position: absolute;
    top: 0.75rem;
    color: #baff42;
    text-shadow: 0 0 8px rgba(150,255,52,0.35);
  }

  .industrialGauge b {
    position: absolute;
    bottom: 1.1rem;
    color: #e7e0bd;
  }

  .industrialGauge i {
    position: absolute;
    bottom: 2.35rem;
    left: 20%;
    width: 60%;
    height: 2px;
    transform-origin: 85% 50%;
    transform: rotate(-10deg);
    background: #d8663f;
    border: 0;
    box-shadow: 0 0 5px rgba(240,80,45,0.6);
  }

  .industrialLedMeter {
    border: 3px solid #12130e;
    background:
      linear-gradient(180deg, #080d07, #020402),
      repeating-linear-gradient(0deg, rgba(110,255,41,0.08) 0 1px, transparent 1px 8px);
    box-shadow:
      inset 0 0 0 3px rgba(118, 112, 87, 0.18),
      inset 0 0 24px rgba(0,0,0,0.9);
  }

  .industrialMainBay {
    border-right-width: 4px;
    padding: 0.55rem;
    background:
      linear-gradient(180deg, #4c4b41, #25251f),
      radial-gradient(circle at 48% 42%, rgba(120,255,25,0.08), transparent 24rem);
  }

  .industrialStatusRail,
  .industrialTrackTerminal,
  .industrialLyrics,
  .industrialLibraryBay .searchBox {
    border: 2px solid #11140d;
    background:
      linear-gradient(180deg, rgba(8, 28, 8, 0.92), rgba(1, 7, 2, 0.98)),
      repeating-linear-gradient(0deg, rgba(140,255,50,0.055) 0 1px, transparent 1px 5px);
    box-shadow:
      inset 0 0 0 2px rgba(120,255,50,0.08),
      inset 0 0 28px rgba(0,0,0,0.88);
  }

  .industrialArtworkBay {
    border: 4px solid #12130e;
    box-shadow:
      inset 0 0 0 4px rgba(111,105,83,0.24),
      inset 0 0 35px rgba(0,0,0,0.9),
      0 0 0 2px rgba(126, 119, 94, 0.3);
  }

  .industrialArtworkBay::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    box-shadow:
      inset 0 0 55px rgba(0,0,0,0.72),
      inset 0 0 0 1px rgba(160,255,55,0.16);
    background:
      repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 1px, transparent 1px 4px);
  }

  .industrialArtworkBay em {
    z-index: 3;
    border: 1px solid #111;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.35);
  }

  .industrialTransport {
    border: 3px solid #151510;
    padding: 0.35rem;
    gap: 0.25rem;
    background:
      linear-gradient(180deg, #565447, #25251e),
      repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0 2px, transparent 2px 44px);
    box-shadow:
      inset 0 0 0 2px rgba(139,132,105,0.22),
      inset 0 0 24px rgba(0,0,0,0.65);
  }

  .industrialTransport button {
    border: 2px solid #11120d;
    background:
      linear-gradient(180deg, #625f50, #2c2c25 52%, #151510);
    color: #f3edd4;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.12),
      inset 0 -8px 14px rgba(0,0,0,0.42);
  }

  .industrialTransport .industrialStartLeak {
    background:
      linear-gradient(180deg, #b85d3d, #6e2c20 55%, #32110d);
    color: #ffe4c2;
    text-shadow: 0 1px 0 #000;
  }

  .industrialInfoBay {
    border-right-width: 4px;
    background:
      linear-gradient(180deg, #46463d, #202019);
  }

  .industrialTrackTerminal h2 {
    color: #d8ff58;
    text-shadow:
      0 0 12px rgba(158,255,47,0.34),
      3px 3px 0 rgba(122, 45, 26, 0.85);
  }

  .industrialTrackTerminal dt {
    color: #9eff35;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 0.7rem;
  }

  .industrialTrackTerminal dd {
    color: #f2efd8;
    margin: 0;
    font-weight: 900;
  }

  .industrialLibraryBay {
    background:
      linear-gradient(180deg, #59574c, #2d2d26 35%, #171711),
      repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 7px);
  }

  .industrialLibraryBay .filterHeader {
    border: 2px solid #11130e;
    padding: 0.4rem;
    background: linear-gradient(180deg, #48463c, #202019);
  }

  .industrialLibraryBay .trackRow {
    border: 2px solid #11130e;
    background:
      linear-gradient(180deg, rgba(77, 88, 64, 0.92), rgba(26, 31, 22, 0.98));
    box-shadow:
      inset 0 0 0 2px rgba(174, 166, 132, 0.14),
      inset 0 -10px 18px rgba(0,0,0,0.46);
  }

  .industrialLibraryBay .trackRow::after {
    content: "";
    width: 18px;
    height: 28px;
    margin-left: auto;
    border: 2px solid #11130e;
    background: linear-gradient(180deg, #7a725e, #2a2a22);
    box-shadow: inset 0 0 0 2px rgba(0,0,0,0.35);
  }

  .industrialLibraryBay .trackRow.active {
    outline: 2px solid rgba(163,255,58,0.65);
  }

  .industrialWarningStrip {
    border-top-width: 4px;
    background:
      linear-gradient(180deg, rgba(92, 30, 17, 0.84), rgba(25, 11, 7, 0.98)),
      repeating-linear-gradient(90deg, rgba(244, 160, 37, 0.28) 0 18px, rgba(16,8,4,0.58) 18px 36px);
  }
}
CSS

npm run build
git status --short
