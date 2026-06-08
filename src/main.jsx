import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Radio, Shuffle, Volume2, AlertTriangle, Activity, Skull } from 'lucide-react';
import './styles.css';

const tracks = [
  {
    title: 'Containment Funk Protocol',
    artist: 'Explosive Crossfader',
    tag: 'UNCLASSIFIED STANK'
  },
  {
    title: 'Night Shift Reactor Hum',
    artist: 'Big Dumb Idiot Labs',
    tag: 'AFTER HOURS STANK'
  },
  {
    title: 'Unauthorized Bass Leakage',
    artist: 'Explosive Crossfader',
    tag: 'HAZARDOUS STANK'
  }
];

const requesters = [
  ['WC-04 The Night Manager', 'Preparing for battle. Again.'],
  ['WC-06 Radio Host', 'Dead air is illegal in several zones.'],
  ['WC-10 Chief Scientist', 'Testing rhythm resonance.'],
  ['WC-11 Emergency Broadcast Authority', 'Mandatory morale contamination.'],
  ['Unknown Listener', 'Needed more stank.']
];

const logLines = [
  'Transmission initiated',
  'Unauthorized harmonica detected',
  'Signal contamination rising',
  'Wombat interference within acceptable limits',
  'Bass residue found near console',
  'Emergency forklift request denied',
  'Broadcast classified as mostly safe',
  'Containment rhythm stabilized'
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeMeta() {
  const requester = pick(requesters);
  return {
    requester: requester[0],
    reason: requester[1],
    signal: pick(['STABLE', 'SUSPICIOUS', 'STANKY', 'DEGRADED', 'OVERPOWERED']),
    className: pick(['INDUSTRIAL', 'RADIOACTIVE', 'MEMETIC', 'FORKLIFT CERTIFIED', 'EXECUTIVE']),
    contamination: (Math.random() * 3 + 7).toFixed(1),
    listeners: Math.floor(Math.random() * 9000 + 300),
    uptime: Math.floor(Math.random() * 900 + 40)
  };
}

function App() {
  const audioRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [meta, setMeta] = useState(makeMeta());
  const [logs, setLogs] = useState(() =>
    Array.from({ length: 7 }, (_, i) => ({
      time: new Date(Date.now() - (7 - i) * 60000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      text: pick(logLines)
    }))
  );

  const track = tracks[index];

  function nextTrack() {
    setIndex(Math.floor(Math.random() * tracks.length));
    setMeta(makeMeta());
    setLogs(prev => [
      ...prev.slice(-6),
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: pick(logLines)
      }
    ]);
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">BIG DUMB IDIOT LABS</p>
          <h1><Radio size={42} /> STANK RADIO</h1>
          <p className="subtitle">Primary contaminated broadcast console. Do not listen without proper emotional PPE.</p>
        </div>
        <div className="status"><span className="pulse"></span>LIVE TRANSMISSION</div>
      </section>

      <section className="grid">
        <div className="panel main">
          <div className="panelHeader">
            <span>CURRENTLY CONTAMINATING</span>
            <b>{track.tag}</b>
          </div>

          <div className="player">
            <div className="cover">
              <img src="/stank-radio/images/stank-radio-icon.png" alt="Stank Radio" />
            </div>

            <div className="trackInfo">
              <h2>{track.title}</h2>
              <p>{track.artist}</p>
              <audio ref={audioRef} controls />
              <button onClick={nextTrack} className="stankButton">
                <Shuffle size={18} /> INITIATE RANDOM CONTAMINATION
              </button>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panelHeader"><span>TRANSMISSION DATA</span><Activity size={18}/></div>
          <dl className="stats">
            <div><dt>Signal Quality</dt><dd>{meta.signal}</dd></div>
            <div><dt>Broadcast Class</dt><dd>{meta.className}</dd></div>
            <div><dt>Contamination Index</dt><dd>{meta.contamination}</dd></div>
            <div><dt>Listeners</dt><dd>{meta.listeners}</dd></div>
            <div><dt>Uptime</dt><dd>{meta.uptime} hrs</dd></div>
          </dl>
        </div>

        <div className="panel">
          <div className="panelHeader"><span>REQUESTED BY</span><Skull size={18}/></div>
          <h3>{meta.requester}</h3>
          <p className="quote">“{meta.reason}”</p>
        </div>

        <div className="panel alert">
          <div className="panelHeader"><span>EMERGENCY BROADCAST</span><AlertTriangle size={18}/></div>
          <p>Containment personnel are advised that rhythm leakage has exceeded cafeteria guidelines.</p>
          <p>Remain calm. This message will repeat until morale improves.</p>
        </div>

        <div className="panel wide">
          <div className="panelHeader"><span>SIGNAL ACTIVITY FEED</span><Volume2 size={18}/></div>
          <ul className="logs">
            {logs.map((log, i) => (
              <li key={i}><b>{log.time}</b><span>{log.text}</span></li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
