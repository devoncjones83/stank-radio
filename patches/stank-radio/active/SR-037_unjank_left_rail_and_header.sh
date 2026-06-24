#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-037.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-037 UNJANK LEFT RAIL + HEADER RECOVERY === */
@media (min-width: 1101px) {
  .industrialShell {
    grid-template-rows: 132px minmax(0, 1fr) 192px 72px !important;
  }

  .broadcastIdentityPanel {
    grid-template-columns: minmax(245px, 0.78fr) minmax(320px, 1fr) !important;
    gap: 1rem !important;
    padding: 0.55rem 0.95rem !important;
  }

  .broadcastIdentityPanel h1 {
    font-size: clamp(2rem, 3.15vw, 3.7rem) !important;
    line-height: 0.78 !important;
    transform: none !important;
  }

  .broadcastIdentityPanel > strong {
    font-size: 0.82rem !important;
    line-height: 1.05 !important;
  }

  .broadcastIdentityCopy b {
    font-size: 1.42rem !important;
  }

  .industrialLeftRail {
    grid-template-rows: 1.15fr 1.15fr 1.2fr 1.35fr !important;
    gap: 8px !important;
    padding: 8px !important;
  }

  .industrialGauge,
  .industrialLedMeter,
  .industrialSignalQuality {
    padding: 0.5rem !important;
    align-content: center !important;
    justify-items: center !important;
  }

  .industrialGauge::before,
  .industrialLedMeter::before,
  .industrialSignalQuality::before {
    inset: 10px !important;
  }

  .industrialGauge span,
  .industrialSignalQuality span {
    font-size: 0.76rem !important;
    letter-spacing: 0.08em !important;
    margin-bottom: 0.15rem !important;
  }

  .industrialGauge b {
    font-size: 1.05rem !important;
  }

  .industrialLedMeter::after {
    content: "SIGNAL ACTIVITY";
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    font-size: 0.62rem;
  }

  .industrialLedMeter {
    grid-auto-flow: column !important;
    align-items: end !important;
    justify-content: center !important;
    gap: 6px !important;
    padding: 28px 12px 13px !important;
  }

  .industrialLedMeter i {
    width: 12px !important;
    max-height: 68px !important;
  }

  .industrialSignalQuality b {
    font-size: 1.45rem !important;
    line-height: 1 !important;
  }

  .industrialSignalQuality em {
    font-size: 0.58rem !important;
  }

  .industrialSignalQuality i {
    height: 18px !important;
    margin-top: 0.3rem !important;
  }

  .industrialTrackTerminal h2 {
    font-size: clamp(1.35rem, 1.8vw, 2rem) !important;
    line-height: 0.9 !important;
  }

  .terminalPlate {
    height: 22px !important;
    min-width: 130px !important;
    font-size: 0.62rem !important;
    margin-bottom: 0.35rem !important;
  }
}

CSS

npm run build
echo "SR-037 complete. Refresh and review."
