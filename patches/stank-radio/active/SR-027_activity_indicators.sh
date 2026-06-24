#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/main.jsx "src/main.jsx.bak.SR-027.$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-027.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

p = Path("src/main.jsx")
s = p.read_text()

s = s.replace(
"              <span>{playing ? 'NOW LEAKING' : 'NO TRANSMISSION SELECTED'}</span>",
"              <span>{playing ? 'NOW LEAKING' : activeTrack ? 'LEAK ARMED' : 'NO TRANSMISSION SELECTED'}</span>"
)

s = s.replace(
"              <b>{playing ? 'LIVE CONTAINMENT' : 'AWAITING LEAK'}</b>",
"              <b>{playing ? 'LIVE CONTAINMENT' : activeTrack ? 'LEAK ARMED' : 'AWAITING LEAK'}</b>"
)

s = s.replace(
"              <b>{playing ? 'LIVE' : 'IDLE'}</b>\n              <em>{playing ? 'LEAKING' : 'DEAD AIR'}</em>",
"              <b>{playing ? 'CLEAR' : activeTrack ? 'LOCKED' : 'IDLE'}</b>\n              <em>{playing ? 'STABLE' : activeTrack ? 'READY' : 'DEAD AIR'}</em>"
)

s = s.replace(
"""                  <p className="lyricsEmpty">Select a track with timed lyrics to follow the transmission.</p>""",
"""                  <div className="lyricsEmpty industrialLyricsEmpty">
                    {activeTrack ? (
                      <>
                        <b>LYRIC DATA NOT AVAILABLE</b>
                        <span>Track indexed successfully.</span>
                        <span>No synchronized contamination transcript found.</span>
                        <span>Awaiting future LRC containment records.</span>
                      </>
                    ) : (
                      <>
                        <b>AWAITING LYRIC TIMING DATA</b>
                        <span>NO SYNCHRONIZED TRANSCRIPT PRESENT</span>
                        <span>FUNK LEVELS ACCEPTABLE</span>
                        <em>&gt;</em>
                      </>
                    )}
                  </div>"""
)

p.write_text(s)
PY

cat >> src/styles.css <<'CSS'

/* === SR-027 ACTIVITY INDICATORS === */
@media (min-width: 1101px) {
  .industrialMainBay::after {
    top: 15px;
    right: 13px;
    width: 30px;
    height: 30px;
  }

  .radioApp.filthUpView:not(.isPlaying) .industrialMainBay::after {
    background: radial-gradient(circle at 35% 35%, #ffd0bd, #e64b2b 45%, #641609 100%);
    box-shadow:
      0 0 10px rgba(255,80,40,0.75),
      0 0 24px rgba(255,40,20,0.45);
    animation: none;
  }

  .radioApp.filthUpView.isPlaying .industrialMainBay::after {
    background: radial-gradient(circle at 35% 35%, #f4ffd8, #9eff35 42%, #2c8112 100%);
    box-shadow:
      0 0 16px rgba(158,255,53,0.95),
      0 0 38px rgba(99,255,28,0.62);
    animation: filthBeaconPulse 1.05s ease-in-out infinite;
  }

  .radioApp.filthUpView.isPlaying .broadcastWaveform i {
    animation: waveformKick 0.9s ease-in-out infinite;
  }

  .radioApp.filthUpView.isPlaying .broadcastWaveform i:nth-child(2n) {
    animation-delay: -0.2s;
  }

  .radioApp.filthUpView.isPlaying .broadcastWaveform i:nth-child(3n) {
    animation-delay: -0.4s;
  }

  @keyframes waveformKick {
    0%, 100% { transform: scaleY(0.78); opacity: 0.72; }
    50% { transform: scaleY(1.18); opacity: 1; }
  }

  .industrialLyricsEmpty {
    display: grid;
    gap: 0.45rem;
    align-content: start;
    color: #cfe8a8;
    font-size: 0.86rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .industrialLyricsEmpty b {
    color: #caff57;
    font-size: 0.95rem;
  }

  .industrialLyricsEmpty span {
    color: #efe9c9;
  }

  .industrialLyricsEmpty em {
    color: #baff42;
    font-style: normal;
    font-size: 1.4rem;
    animation: lyricCursorBlink 1s step-end infinite;
  }

  @keyframes lyricCursorBlink {
    50% { opacity: 0; }
  }

  .industrialSignalQuality b {
    text-shadow: 0 0 12px rgba(158,255,53,0.35);
  }

  .radioApp.filthUpView.isPlaying .industrialSignalQuality b {
    animation: signalPulse 1.25s ease-in-out infinite;
  }

  @keyframes signalPulse {
    0%, 100% { opacity: 0.82; }
    50% { opacity: 1; text-shadow: 0 0 20px rgba(158,255,53,0.75); }
  }
}
CSS

npm run build
git status --short
