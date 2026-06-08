import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Radio, Shuffle, Volume2, AlertTriangle, Activity, Skull } from 'lucide-react';
import './styles.css';

const fallbackTracks = [
  {
    title: 'Containment Funk Protocol',
    artist: 'Explosive Crossfader',
    tag: 'UNCLASSIFIED STANK',
    cover: '/stank-radio/images/stank-radio-icon.png',
    audio: ''
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

function normalizePath(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/stank-radio/')) return path;
  if (path.startsWith('/music/')) return `/stank-radio${path}`;
  if (path.startsWith('music/')) return `/stank-radio/${path}`;
  if (path.startsWith('/')) return `/stank-radio${path}`;
  return `/stank-radio/music/${path}`;
}

function normalizeTrack(song, i) {
  const title = song.title || song.name || song.track || song.filename || `Unlabeled Stank ${String(i + 1).padStart(3, '0')}`;
  const artist = song.artist || song.author || song.creator || 'Explosive Crossfader';
  const audio = song.audio || song.src || song.file || song.path || song.url || '';
  const cover = song.cover || song.coverArt || song.image || song.artwork || '/stank-radio/images/stank-radio-icon.png';
  const rawPlaylists = song.playlists || song.playlist || song.collection || [];
  const playlists = Array.isArray(rawPlaylists)
    ? rawPlaylists
    : String(rawPlaylists).split(',').map(x => x.trim()).filter(Boolean);

  return {
    title,
    artist,
    tag: song.tag || song.classification || song.genre || 'UNCLASSIFIED STANK',
    playlists,
    audio: normalizePath(audio),
    cover: normalizePath(cover)
  };
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
  const [tracks, setTracks] = useState([]);
  const [index, setIndex] = useState(0);
  const [meta, setMeta] = useState(makeMeta());
  const [loadStatus, setLoadStatus] = useState('Loading contamination manifest...');
  const [query, setQuery] = useState('');
  const [activePlaylist, setActivePlaylist] = useState('ALL PLAYLISTS');

  const [logs, setLogs] = useState(() =>
    Array.from({ length: 7 }, (_, i) => ({
      time: new Date(Date.now() - (7 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: pick(logLines)
    }))
  );

  useEffect(() => {
    fetch('/stank-radio/music/songs.json', { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error(`songs.json returned ${r.status}`);
        return r.json();
      })
      .then(data => {
        const rawSongs = Array.isArray(data) ? data : (data.songs || data.tracks || []);
        const normalized = rawSongs.map(normalizeTrack).filter(t => t.title);
        setTracks(normalized.length ? normalized : fallbackTracks);
        setLoadStatus(normalized.length ? 'Manifest contaminated successfully.' : 'No songs found. Fallback stank engaged.');
      })
      .catch(err => {
        console.error(err);
        setTracks(fallbackTracks);
        setLoadStatus('Manifest unavailable. Fallback stank engaged.');
      });
  }, []);

  if (!tracks.length) {
    return <main className="page"><h1>{loadStatus}</h1></main>;
  }

  const playlists = useMemo(() => {
    const names = new Set();
    tracks.forEach(track => {
      (track.playlists || []).forEach(name => names.add(name));
      if (track.tag) names.add(track.tag);
    });
    return ['ALL PLAYLISTS', ...Array.from(names).sort()];
  }, [tracks]);

  const filteredTracks = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return tracks.filter(track => {
      const haystack = [
        track.title,
        track.artist,
        track.tag,
        ...(track.playlists || [])
      ].join(' ').toLowerCase();

      const matchesQuery = !needle || haystack.includes(needle);
      const matchesPlaylist =
        activePlaylist === 'ALL PLAYLISTS' ||
        track.tag === activePlaylist ||
        (track.playlists || []).includes(activePlaylist);

      return matchesQuery && matchesPlaylist;
    });
  }, [tracks, query, activePlaylist]);

  const visibleTracks = filteredTracks.length ? filteredTracks : tracks;
  const safeIndex = Math.min(index, visibleTracks.length - 1);
  const track = visibleTracks[safeIndex];

  function nextTrack() {
    let next = Math.floor(Math.random() * visibleTracks.length);
    if (visibleTracks.length > 1 && next === index) next = (next + 1) % visibleTracks.length;

    setIndex(next);
    setMeta(makeMeta());
    setLogs(prev => [
      ...prev.slice(-6),
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: pick(logLines)
      }
    ]);

    setTimeout(() => audioRef.current?.play?.().catch(() => {}), 75);
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">BIG DUMB IDIOT LABS</p>
          <h1><Radio size={42}/> STANK RADIO</h1>
          <p className="subtitle">Primary contaminated broadcast console. {loadStatus}</p>
        </div>

        <div className="status"><span className="pulse"></span>LIVE TRANSMISSION</div>
      </section>

      <section className="grid">
        <div className="panel searchPanel">
          <div className="panelHeader">
            <span>TRANSMISSION SEARCH</span>
            <b>{filteredTracks.length} FOUND</b>
          </div>

          <input
            className="searchInput"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              setIndex(0);
            }}
            placeholder="Search by song, artist, tag, or playlist..."
          />

          <div className="playlistRail">
            {playlists.map(name => (
              <button
                key={name}
                className={name === activePlaylist ? 'playlistPill active' : 'playlistPill'}
                onClick={() => {
                  setActivePlaylist(name);
                  setIndex(0);
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="panel main">
          <div className="panelHeader">
            <span>CURRENTLY CONTAMINATING</span>
            <b>{track.tag}</b>
          </div>

          <div className="player">
            <div className="cover">
              <img src={track.cover || '/stank-radio/images/stank-radio-icon.png'} alt="" />
            </div>

            <div className="trackInfo">
              <h2>{track.title}</h2>
              <p>{track.artist}</p>

              <audio ref={audioRef} controls src={track.audio || undefined} />

              <button onClick={nextTrack} className="stankButton">
                <Shuffle size={18}/>
                INITIATE RANDOM CONTAMINATION
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
            <div><dt>Tracks Online</dt><dd>{tracks.length}</dd></div>
            <div><dt>Filtered</dt><dd>{filteredTracks.length}</dd></div>
            <div><dt>Uptime</dt><dd>{meta.uptime} hrs</dd></div>
          </dl>
        </div>

        <div className="panel">
          <div className="panelHeader"><span>REQUESTED BY</span><Skull size={18}/></div>
          <h3>{meta.requester}</h3>
          <p className="quote">"{meta.reason}"</p>
        </div>

        <div className="panel alert">
          <div className="panelHeader"><span>EMERGENCY BROADCAST</span><AlertTriangle size={18}/></div>
          <p>Containment personnel are advised that rhythm leakage has exceeded cafeteria guidelines.</p>
        </div>

        <div className="panel playlistPanel">
          <div className="panelHeader"><span>AVAILABLE TRACKS</span><b>{activePlaylist}</b></div>
          <ul className="trackList">
            {visibleTracks.slice(0, 12).map((item, i) => (
              <li key={`${item.title}-${i}`}>
                <button
                  className={item === track ? 'trackPick active' : 'trackPick'}
                  onClick={() => setIndex(i)}
                >
                  <span>{item.title}</span>
                  <small>{item.artist} · {item.tag}</small>
                </button>
              </li>
            ))}
          </ul>
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
