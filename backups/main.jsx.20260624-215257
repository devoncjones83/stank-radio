import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronLeft, ChevronRight, Pause, Play, Search, Share2, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import './styles.css';

const BASE = import.meta.env.BASE_URL || '/';
const defaultCover = `${BASE}images/stank-radio-icon.png`;
const TRACKS_PER_PAGE = 5;

function assetPath(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith(BASE)) return path;
  if (path.startsWith('/stank-radio/')) return path;
  if (path.startsWith('/music/')) return path;
  if (path.startsWith('/')) return `${BASE}${path.slice(1)}`;
  if (path.startsWith('music/') || path.startsWith('images/')) return `${BASE}${path}`;
  return `${BASE}music/${path}`;
}

function normalizeTrack(song, index) {
  return {
    id: `${song.title || song.name || song.filename || 'track'}-${index}`,
    title: song.title || song.name || song.track || song.filename || `Unlabeled Stank ${index + 1}`,
    artist: song.artist || song.author || song.creator || 'Big Dumb Idiot Labs',
    tag: song.tag || song.classification || song.genre || 'UNCLASSIFIED STANK',
    description: song.description || song.lyrics || 'No field notes provided. The funk speaks for itself.',
    audio: assetPath(song.audio || song.src || song.file || song.path || song.url || ''),
    cover: assetPath(song.cover || song.coverArt || song.image || song.artwork || defaultCover),
    lyricsTimeline: Array.isArray(song.lyricsTimeline) ? song.lyricsTimeline : [],
  };
}

function App() {
  const audioRef = useRef(null);
  const [tracks, setTracks] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetch(`${BASE}songs.json`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const raw = Array.isArray(data) ? data : data.songs || data.tracks || [];
        const normalized = raw.map(normalizeTrack);
        setTracks(normalized);
      })
      .catch(() => setTracks([]));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return tracks;
    return tracks.filter((track) =>
      [track.title, track.artist, track.tag, track.description].join(' ').toLowerCase().includes(needle)
    );
  }, [tracks, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / TRACKS_PER_PAGE));
  const pagedTracks = filtered.slice((page - 1) * TRACKS_PER_PAGE, page * TRACKS_PER_PAGE);
  const activeTrack = tracks.find((track) => track.id === activeId) || null;
  const displayTrack = activeTrack || {
    title: 'NO TRANSMISSION SELECTED',
    artist: 'Choose a stank',
    description: 'The fumes stay still until someone chooses a stank.',
    cover: defaultCover,
    audio: '',
  };

  function selectTrack(track, autoplay = false) {
    setActiveId(track.id);
    setPlaying(false);
    setTimeout(() => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (autoplay && track.audio) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 50);
  }

  function stepTrack(direction) {
    if (!filtered.length || !activeTrack) return;
    const index = filtered.findIndex((track) => track.id === activeTrack.id);
    const next = filtered[(index + direction + filtered.length) % filtered.length];
    selectTrack(next, false);
  }

  function randomTrack() {
    if (!filtered.length) return;
    selectTrack(filtered[Math.floor(Math.random() * filtered.length)], false);
  }

  function togglePlay() {
    if (!audioRef.current || !activeTrack?.audio) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  }

  function shareTrack() {
    if (!activeTrack) return;
    navigator.clipboard?.writeText(`${window.location.origin}${BASE}?song=${encodeURIComponent(activeTrack.title)}`).catch(() => {});
  }

  return (
    <main className={playing ? 'radioApp filthUpView isPlaying' : 'radioApp filthUpView'}>
      <section className="industrialShell">
        <header className="industrialHeader" />

        <section className="industrialPlayerShell">
          <div className="shellCoverViewport">
            <img src={displayTrack.cover || defaultCover} alt="" />
            <em>{activeTrack ? 'ACTIVE RESIDUE' : 'AWAITING SELECTION'}</em>
          </div>

          <div className="shellVizViewport">
            <div className="shellScopeTrace" />
          </div>

          <div className="shellDossierPanel">
            <b>TRACK DOSSIER</b>
            <h2>{displayTrack.title}</h2>
            <p>{displayTrack.description}</p>
          </div>

          <div className="shellLyricsPanel">
            <b>LYRIC CONTAINMENT</b>
            <p>{activeTrack ? 'LYRIC DATA NOT AVAILABLE' : 'AWAITING LYRIC TIMING DATA'}</p>
            <span>FUNK LEVELS ACCEPTABLE</span>
          </div>

          <div className="industrialTransport">
            <button type="button" onClick={() => stepTrack(-1)}><SkipBack size={18} /></button>
            <button type="button" className="primaryPlay" onClick={togglePlay} disabled={!activeTrack?.audio}>
              {playing ? <Pause size={20} /> : <Play size={20} />}
              {playing ? 'PAUSE' : 'PLAY'}
            </button>
            <button type="button" onClick={() => stepTrack(1)}><SkipForward size={18} /></button>
            <button type="button" onClick={randomTrack}><Shuffle size={17} /></button>
            <button type="button" onClick={shareTrack}><Share2 size={17} /></button>
          </div>
        </section>

        <aside className="industrialLibraryBay">
          <label className="searchBox">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Title, operator, tag..."
            />
          </label>

          <div className="trackList">
            {pagedTracks.map((track) => (
              <button
                key={track.id}
                type="button"
                className={track.id === activeTrack?.id ? 'trackRow active' : 'trackRow'}
                onClick={() => selectTrack(track, false)}
              >
                <img src={track.cover || defaultCover} alt="" />
                <span>
                  <b>{track.title}</b>
                  <small>{track.artist}</small>
                </span>
              </button>
            ))}
          </div>

          <nav className="libraryPagination">
            <button type="button" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft size={18} />
            </button>
            <span>{page} / {totalPages}</span>
            <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              <ChevronRight size={18} />
            </button>
          </nav>
        </aside>

        <aside className="industrialWarningStrip" />

        <audio
          ref={audioRef}
          src={activeTrack?.audio || undefined}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => stepTrack(1)}
        />
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
