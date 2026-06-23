#!/usr/bin/env bash
set -euo pipefail

APP="src/main.jsx"
CSS="src/styles.css"

cp "$APP" "$APP.bak.SR-001"
cp "$CSS" "$CSS.bak.SR-001"

python3 - <<'PY'
from pathlib import Path

app = Path("src/main.jsx")
text = app.read_text()

text = text.replace(
'''      <section className="workspaceGrid">
      <section className="heroDeck" style={{ '--track-cover': `url("${displayTrack.cover}")` }}>
        <div className="heroCopy">
          <p className="eyebrow">Public Broadcast Facility <span aria-hidden="true">·</span> Questionable Frequency</p>
          <h1><span>MAXIMUM</span><span>STANK</span></h1>
          <p className="heroTagline">If it smells like a hit, it probably came from here.</p>
        </div>
        <div className="pipeBrief">
          <p className="pipeBriefLabel">Freshly audio contaminants.</p>
          <p className="heroDescription">Foul little transmissions, harvested <strong>FRESH</strong> from the Suno stink pipe.</p>
          <p className="riskNotice">Press play at your own risk.</p>
          <p className="heroFrequency">Frequency: 88.8 STANK FM</p>
        </div>
      </section>''',
'''      <section className="workspaceGrid dashboardContainment">
      <section className="heroDeck broadcastTerminal background-grid" style={{ '--track-cover': `url("${displayTrack.cover}")` }}>
        <div className="terminalStrip">
          <span>Public Broadcast Facility <b aria-hidden="true">·</b> Questionable Frequency</span>
          <strong>{playing ? 'TRANSMISSION ACTIVE' : 'AWAITING LEAK'}</strong>
        </div>

        <div className="heroCopy">
          <p className="eyebrow">Big Dumb Idiot Labs // Broadcast Division</p>
          <h1 className="text-glow"><span>STANK</span><span>RADIO</span></h1>
          <p className="heroTagline">Containment Broadcast Network</p>
        </div>

        <div className="pipeBrief terminalMetrics">
          <p className="pipeBriefLabel">Freshly audio contaminants.</p>
          <p className="heroDescription">Foul little transmissions, harvested <strong>FRESH</strong> from the Suno stink pipe.</p>
          <div className="heroMetricGrid">
            <div><span>Containment Index</span><b>{tracks.length}</b></div>
            <div><span>Signal Quality</span><b>{playing ? 'Leaking' : 'Idle'}</b></div>
            <div><span>Fumes</span><b>{activeTrack ? `${stankIndex}%` : 'None'}</b></div>
            <div><span>Frequency</span><b>88.8 FM</b></div>
          </div>
        </div>
      </section>'''
)

text = text.replace(
'''          <div className="playerCore">
            <div className="coverWell">''',
'''          <div className="playerCore dashboardPlayerCore">
            <aside className="containmentSidebar" aria-label="Containment meters">
              <div className="containmentGauge">
                <span>Containment</span>
                <div className="gaugeFace">
                  <i className={activeTrack ? 'gaugeNeedle active' : 'gaugeNeedle'} />
                  <em>INDEX</em>
                </div>
              </div>

              <div className="sidebarMetric">
                <span>Signal</span>
                <b>{playing ? 'LIVE' : 'STANDBY'}</b>
              </div>

              <div className="sidebarMetric">
                <span>Stank Load</span>
                <b>{activeTrack ? `${stankIndex}%` : '--'}</b>
              </div>

              <div className="sidebarMetric">
                <span>Indexed</span>
                <b>{tracks.length}</b>
              </div>
            </aside>

            <div className="coverWell">'''
)

text = text.replace(
'''        <div className="transmissionFlag">
          <span />
          Live containment
        </div>''',
'''        <div className="transmissionFlag liveContainmentBadge">
          <span />
          LIVE CONTAINMENT
        </div>'''
)

app.write_text(text)
PY

cat >> "$CSS" <<'EOF_CSS'

/* === SR-001 Dashboard containment reskin === */

.background-grid {
  background-image:
    linear-gradient(rgba(18, 22, 18, 0.96) 0%, rgba(18, 22, 18, 0.96) 100%),
    linear-gradient(to right, rgba(57, 255, 20, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(57, 255, 20, 0.08) 1px, transparent 1px);
  background-size: 100% 100%, 8px 8px, 8px 8px;
}

.text-glow {
  text-shadow:
    0 0 6px rgba(57, 255, 20, 0.6),
    0 0 12px rgba(57, 255, 20, 0.3),
    0 0 22px rgba(57, 255, 20, 0.16);
}

.dashboardContainment {
  isolation: isolate;
}

.broadcastTerminal {
  position: relative;
  overflow: hidden;
  border-color: rgba(57, 255, 20, 0.22);
  box-shadow:
    inset 0 0 28px rgba(0, 0, 0, 0.72),
    0 0 28px rgba(57, 255, 20, 0.06);
}

.terminalStrip {
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: .7rem 1rem;
  border-bottom: 1px solid rgba(57, 255, 20, 0.18);
  background: rgba(0, 0, 0, 0.48);
  color: rgba(217, 255, 213, 0.78);
  font-size: .68rem;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.terminalStrip strong {
  color: #39ff14;
  text-shadow: 0 0 10px rgba(57, 255, 20, .42);
}

.terminalMetrics {
  border-color: rgba(57, 255, 20, 0.18);
  background: rgba(0, 0, 0, 0.48);
}

.heroMetricGrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .55rem;
  margin-top: 1rem;
}

.heroMetricGrid div,
.sidebarMetric,
.containmentGauge {
  border: 1px solid rgba(63, 63, 70, .88);
  background: rgba(0, 0, 0, .38);
  border-radius: .75rem;
  padding: .75rem;
  box-shadow: inset 0 0 14px rgba(0, 0, 0, .45);
}

.heroMetricGrid span,
.sidebarMetric span,
.containmentGauge span {
  display: block;
  color: rgba(161, 161, 170, .86);
  font-size: .62rem;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.heroMetricGrid b,
.sidebarMetric b {
  display: block;
  margin-top: .25rem;
  color: #39ff14;
  font-size: .9rem;
  text-transform: uppercase;
}

.liveContainmentBadge {
  border-color: rgba(57, 255, 20, .72);
  color: #39ff14;
  box-shadow:
    inset 0 0 12px rgba(57, 255, 20, .14),
    0 0 18px rgba(57, 255, 20, .08);
}

.liveContainmentBadge span {
  background: #39ff14;
  box-shadow: 0 0 12px rgba(57, 255, 20, .95);
}

.dashboardPlayerCore {
  grid-template-columns: minmax(8rem, 11rem) minmax(10rem, 15rem) minmax(0, 1fr);
  align-items: stretch;
}

.containmentSidebar {
  display: flex;
  flex-direction: column;
  gap: .75rem;
  min-width: 0;
}

.containmentGauge {
  display: grid;
  place-items: center;
  gap: .55rem;
}

.gaugeFace {
  position: relative;
  width: 7rem;
  height: 3.8rem;
  overflow: hidden;
  border: 1px solid rgba(113, 113, 122, .55);
  border-bottom: 0;
  border-radius: 7rem 7rem 0 0;
  background:
    radial-gradient(circle at 50% 100%, rgba(57, 255, 20, .14), transparent 54%),
    rgba(9, 12, 9, .86);
  box-shadow: inset 0 0 16px rgba(0, 0, 0, .65);
}

.gaugeNeedle {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 2px;
  height: 3.25rem;
  background: #ff2a2a;
  transform-origin: bottom center;
  transform: translateX(-50%) rotate(-58deg);
  transition: transform .55s ease;
  box-shadow: 0 0 10px rgba(255, 42, 42, .55);
}

.gaugeNeedle.active {
  transform: translateX(-50%) rotate(36deg);
}

.gaugeFace em {
  position: absolute;
  left: 0;
  right: 0;
  bottom: .25rem;
  color: rgba(161, 161, 170, .62);
  font-size: .55rem;
  font-style: normal;
  letter-spacing: .18em;
  text-align: center;
}

@media (max-width: 980px) {
  .dashboardPlayerCore {
    grid-template-columns: 1fr;
  }

  .containmentSidebar {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .heroMetricGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .terminalStrip {
    position: relative;
    flex-direction: column;
  }

  .containmentSidebar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .heroMetricGrid {
    grid-template-columns: 1fr;
  }
}
EOF_CSS

npm run build
