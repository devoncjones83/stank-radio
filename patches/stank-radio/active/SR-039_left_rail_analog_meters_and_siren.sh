#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-039.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-039 LEFT RAIL ANALOG METERS + REAL WARNING SIREN === */
@media (min-width: 1101px) {
  .industrialLeftRail {
    background:
      radial-gradient(circle at 18px 18px, #6f6a58 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 18px) 18px, #6f6a58 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at 18px calc(100% - 18px), #6f6a58 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 18px) calc(100% - 18px), #6f6a58 0 3px, #14130f 4px 6px, transparent 7px),
      linear-gradient(135deg, rgba(120,38,18,0.22), transparent 22%),
      linear-gradient(180deg, #5d6155, #292e27 42%, #11140f) !important;
    box-shadow:
      inset 0 0 0 2px rgba(210,200,160,0.12),
      inset 0 0 0 8px rgba(0,0,0,0.38),
      inset 0 0 38px rgba(0,0,0,0.8),
      0 0 0 1px rgba(0,0,0,0.9) !important;
  }

  .industrialGauge {
    border-radius: 2px !important;
    background:
      radial-gradient(circle at 12px 12px, #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 12px) 12px, #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at 12px calc(100% - 12px), #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 12px) calc(100% - 12px), #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      linear-gradient(180deg, #74796d, #3d433b 46%, #171b16) !important;
  }

  .industrialGauge::before {
    inset: 18px 14px 32px !important;
    border-radius: 7px !important;
    border: 2px solid #171912 !important;
    background:
      radial-gradient(ellipse at center bottom, rgba(0,0,0,0.28), transparent 52%),
      linear-gradient(180deg, #d8d0a5, #8d8b70 56%, #3b3f34) !important;
    box-shadow:
      inset 0 0 0 2px rgba(255,245,200,0.12),
      inset 0 0 18px rgba(0,0,0,0.52),
      0 2px 0 rgba(255,255,255,0.08) !important;
  }

  .industrialGauge span {
    position: absolute !important;
    bottom: 10px !important;
    left: 17px !important;
    right: 17px !important;
    height: 25px !important;
    display: grid !important;
    place-items: center !important;
    background:
      linear-gradient(180deg, #172318, #061006) !important;
    border: 2px solid #14160f !important;
    color: #baff42 !important;
    font-size: 0.68rem !important;
    letter-spacing: 0.12em !important;
    z-index: 5 !important;
  }

  .industrialGauge b {
    position: relative !important;
    z-index: 6 !important;
    margin-top: 18px !important;
    color: rgba(32,35,28,0.72) !important;
    font-size: 0.76rem !important;
    text-shadow: none !important;
  }

  .industrialGauge i {
    position: absolute !important;
    left: 24px !important;
    right: 24px !important;
    top: 38px !important;
    height: 56px !important;
    width: auto !important;
    border: 0 !important;
    background:
      repeating-linear-gradient(75deg, transparent 0 8px, rgba(44,45,35,0.7) 8px 10px, transparent 10px 17px),
      conic-gradient(from 250deg at 50% 100%,
        transparent 0deg,
        transparent 24deg,
        #24351e 24deg,
        #738348 50deg,
        #b29a4d 76deg,
        #8d2218 105deg,
        transparent 105deg) !important;
    border-radius: 120px 120px 0 0 !important;
    z-index: 4 !important;
    opacity: 0.95 !important;
  }

  .industrialGauge i::before {
    left: 50% !important;
    bottom: 0 !important;
    width: 45% !important;
    height: 3px !important;
    transform-origin: left center !important;
    transform: rotate(-32deg) !important;
    background: #47180e !important;
    box-shadow: 0 0 5px rgba(80,20,10,0.45) !important;
  }

  .radioApp.filthUpView.isPlaying .industrialGauge i::before,
  .radioApp.filthUpView .industrialGauge:nth-child(2) i::before {
    transform: rotate(-8deg) !important;
    background: #d84b29 !important;
    box-shadow: 0 0 8px rgba(216,75,41,0.75) !important;
  }

  .industrialGauge i::after {
    left: calc(50% - 5px) !important;
    bottom: -5px !important;
    background: #191913 !important;
    border-color: #786f57 !important;
  }

  .industrialLedMeter {
    background:
      radial-gradient(circle at 12px 12px, #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 12px) 12px, #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at 12px calc(100% - 12px), #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 12px) calc(100% - 12px), #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      linear-gradient(180deg, #62675c, #2a3029 48%, #10140f) !important;
  }

  .industrialLedMeter::before {
    background:
      linear-gradient(180deg, rgba(4,13,5,0.95), rgba(0,0,0,0.92)),
      repeating-linear-gradient(0deg, rgba(186,255,66,0.045) 0 1px, transparent 1px 6px) !important;
    border-radius: 4px !important;
  }

  .industrialSignalQuality {
    background:
      radial-gradient(circle at 12px 12px, #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 12px) 12px, #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at 12px calc(100% - 12px), #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      radial-gradient(circle at calc(100% - 12px) calc(100% - 12px), #77715e 0 3px, #14130f 4px 6px, transparent 7px),
      linear-gradient(180deg, #5f655b, #252b25 50%, #0d110d) !important;
  }

  .industrialWarningStrip::after {
    width: 42px !important;
    height: 42px !important;
    right: 10px !important;
    border-radius: 7px 7px 14px 14px !important;
    background:
      radial-gradient(ellipse at 50% 18%, rgba(255,240,205,0.95) 0 8%, transparent 9%),
      radial-gradient(ellipse at 50% 44%, #ff3d2c 0 32%, #a20d08 56%, #340201 78%) !important;
    border: 2px solid #190504 !important;
    box-shadow:
      inset 0 2px 8px rgba(255,230,180,0.5),
      inset 0 -8px 15px rgba(0,0,0,0.55),
      0 0 15px rgba(255,30,20,0.9),
      0 0 34px rgba(255,20,10,0.55) !important;
    animation: sr039BeaconFlash 0.72s ease-in-out infinite !important;
  }

  .industrialWarningStrip::before {
    content: "" !important;
    display: block !important;
    position: absolute;
    right: 13px;
    top: calc(50% + 22px);
    width: 36px;
    height: 8px;
    border-radius: 50%;
    background: #0c0907;
    box-shadow: 0 -2px 0 rgba(255,255,255,0.08);
  }

  @keyframes sr039BeaconFlash {
    0%, 100% {
      filter: brightness(0.65);
      transform: translateY(-50%) scale(0.96);
    }
    50% {
      filter: brightness(1.55);
      transform: translateY(-50%) scale(1.04);
    }
  }
}
CSS

npm run build
echo "SR-039 complete. Refresh and review the analog stank."
