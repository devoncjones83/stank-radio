import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Radio, Shuffle, Search, SkipBack, SkipForward, Share2, Play, Pause } from 'lucide-react';
import './styles.css';

const fallbackTracks = [{
  title: 'Containment Funk Protocol',
  artist: 'Explosive Crossfader',
  tag: 'UNCLASSIFIED STANK',
  playlists: ['Fallback Stank'],
  description: 'Fallback stank engaged. The funk refuses to die.',
  cover: '/stank-radio/images/stank-radio-icon.png',
  audio: ''
}];

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
  const rawPlaylists = song.playlists || song.playlist || song.collection || [];
  const playlists = Array.isArray(rawPlaylists)
    ? rawPlaylists
    : String(rawPlaylists).split(',').map(x => x.trim()).filter(Boolean);

  return {
    title: song.title || song.name || song.track || song.filename || `Unlabeled Stank ${String(i + 1).padStart(3, '0')}`,
    artist: song.artist || song.author || song.creator || 'Certified Audio Contaminator',
    tag: song.tag || song.classification || song.genre || 'UNCLASSIFIED STANK',
    playlists,
    description: song.description || song.lyrics || 'No field notes provided. The funk speaks for itself.',
    lyrics: song.lyrics || song.description || 'No field notes provided. The funk speaks for itself.',
    created: song.created || song.date || song.uploaded || '',
    audio: normalizePath(song.audio || song.src || song.file || song.path || song.url || ''),
    cover: normalizePath(song.cover || song.coverArt || song.image || song.artwork || '/stank-radio/images/stank-radio-icon.png')
  };
}

function App() {
  const audioRef = useRef(null);
  const [tracks, setTracks] = useState([]);
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [activePlaylist, setActivePlaylist] = useState('ALL PLAYLISTS');
  const [playing, setPlaying] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loadStatus, setLoadStatus] = useState('Loading contamination manifest...');

  useEffect(() => {
    fetch('/stank-radio/music/songs.json', { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error(`songs.json returned ${r.status}`);
        return r.json();
      })
      .then(data => {
        const rawSongs = Array.isArray(data) ? data : (data.songs || data.tracks || []);
        const normalized = rawSongs.map(normalizeTrack);
        setTracks(normalized.length ? normalized : fallbackTracks);
        setLoadStatus(normalized.length ? 'Fresh from the Suno stink pipe.' : 'Fallback stank engaged.');
      })
      .catch(err => {
        console.error(err);
        setTracks(fallbackTracks);
        setLoadStatus('Manifest unavailable. Fallback stank engaged.');
      });
  }, []);

  const playlists = useMemo(() => {
    const names = new Set();
    tracks.forEach(track => {
      if (track.tag) names.add(track.tag);
      (track.playlists || []).forEach(name => names.add(name));
    });
    return ['ALL PLAYLISTS', ...Array.from(names).sort()];
  }, [tracks]);

  const filteredTracks = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return tracks.filter(track => {
      const haystack = [track.title, track.artist, track.tag, ...(track.playlists || [])].join(' ').toLowerCase();
      const matchesQuery = !needle || haystack.includes(needle);
      const matchesPlaylist =
        activePlaylist === 'ALL PLAYLISTS' ||
        track.tag === activePlaylist ||
        (track.playlists || []).includes(activePlaylist);

      return matchesQuery && matchesPlaylist;
    });
  }, [tracks, query, activePlaylist]);

  const visibleTracks = filteredTracks.length ? filteredTracks : tracks;
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(visibleTracks.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedTracks = visibleTracks.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const track = visibleTracks[Math.min(index, visibleTracks.length - 1)] || fallbackTracks[0];

  function chooseTrack(i, autoplay = false) {
    setPlayerOpen(true);
    setIndex(i);
    setPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (autoplay) {
        audioRef.current?.play?.().then(() => setPlaying(true)).catch(() => {});
      }
    }, 75);
  }

  function nextTrack() {
    chooseTrack((index + 1) % visibleTracks.length, false);
  }

  function prevTrack() {
    chooseTrack((index - 1 + visibleTracks.length) % visibleTracks.length, false);
  }

  function randomTrack() {
    let next = Math.floor(Math.random() * visibleTracks.length);
    if (visibleTracks.length > 1 && next === index) next = (next + 1) % visibleTracks.length;
    chooseTrack(next, false);
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  }

  function shareTrack() {
    const url = `${window.location.origin}/stank-radio/?song=${encodeURIComponent(track.title)}`;
    navigator.clipboard?.writeText(url).catch(() => {});
  }

  return (
    <main className="radioApp">
      <section className="radioTop">
        <div className="brandBlock">
          <p className="eyebrow">BIG DUMB IDIOT LABS</p>
          <h1><img className="brandIcon" src="/stank-radio/images/stank-radio-icon.png" alt="" /> STANK RADIO</h1>
        </div>

        <div className="topPipeBlock">
          <h2 className="pipeHeadline">
            <span>Fresh From The Suno</span>
            <span><b className="stinkPipeWord">STINK PIPE</b></span>
          </h2>
          <p>Freshly harvested audio contaminants. Press play at your own risk.</p>
        </div>

        <div className="status"><span className="pulse"></span>"Live" TRANSMISSION</div>
        <button className="mobileSearchToggle" type="button" onClick={() => setSearchOpen(true)} aria-label="Open search">
          🔍
        </button>
      </section>


      {searchOpen ? (
        <section className="mobileSearchOverlay">
          <div className="mobileSearchTop">
            <button type="button" onClick={() => setSearchOpen(false)}>‹</button>
            <div className="mobileSearchInput">
              <Search size={24}/>
              <input
                autoFocus
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setIndex(0);
                  setPage(1);
                }}
                placeholder="Search for songs in your library"
              />
            </div>
          </div>

          <div className="mobileSearchResults">
            {visibleTracks.map((item, i) => (
              <button
                key={`${item.title}-mobile-${i}`}
                className={item === track ? 'mobileSongRow active' : 'mobileSongRow'}
                type="button"
                onClick={() => {
                  chooseTrack(i, false);
                  setSearchOpen(false);
                }}
              >
                <img src={item.cover || '/stank-radio/images/stank-radio-icon.png'} alt="" />
                <span>
                  <b>{item.title}</b>
                  <small>{item.tag}</small>
                </span>
                <em>⋮</em>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="radioShell">
        <div className="libraryDeck">
          <section className={searchOpen ? 'librarySearch mobileSearchOpen' : 'librarySearch'}>
            <button className="mobileSearchClose" type="button" onClick={() => setSearchOpen(false)}>×</button>
            <div className="searchTitle">SEARCH A STANK</div>
            <div className="searchBox">
              <Search size={18}/>
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setIndex(0); setPage(1); }}
                placeholder="Search song, artist, playlist, or tag..."
              />
            </div>

            <div className="searchDeadSpace">
              <span>PUBLIC BROADCAST FACILITY</span>
              <b>QUESTIONABLE FREQUENCY</b>
            </div>

            <div className="playlistSelectWrap">
              <label htmlFor="playlist-select">Playlist / Tag</label>
              <select
                id="playlist-select"
                className="playlistSelect"
                value={activePlaylist}
                onChange={event => {
                  setActivePlaylist(event.target.value);
                  setIndex(0);
                  setPage(1);
                }}
              >
                {playlists.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div className="stanksAiredBox">
              <span>STANKS AIRED</span>
              <b>{filteredTracks.length}</b>
            </div>
          </section>

          <section className="broadcastLibrary">
            <div className="libraryHeader">
              <span>CONTAMINANT LIBRARY</span>
            </div>

            <div className="libraryGrid">
              {pagedTracks.map((item, i) => {
                const realIndex = (currentPage - 1) * pageSize + i;
                return (
                  <button
                    key={`${item.title}-${realIndex}`}
                    className={item === track ? 'songTile active' : 'songTile'}
                    onClick={() => chooseTrack(realIndex)}
                  >
                    <span>{item.title}</span>
                    <img src={item.cover || '/stank-radio/images/stank-radio-icon.png'} alt="" />
                  </button>
                );
              })}
            </div>

            <div className="libraryPager">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                PREV
              </button>
              <span>PAGE {currentPage} / {pageCount}</span>
              <button
                type="button"
                disabled={currentPage >= pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                NEXT
              </button>
            </div>
          </section>
        </div>

        <aside
          className={playerOpen ? 'stationRail mobileOpen' : 'stationRail'}
          style={{ '--track-cover': `url("${track.cover || '/stank-radio/images/stank-radio-icon.png'}")` }}
        >
          <button className="modalClose" type="button" onClick={() => setPlayerOpen(false)}>×</button>
          <div className="stationCover">
            <img src={track.cover || '/stank-radio/images/stank-radio-icon.png'} alt="" />
          </div>

          <p className="stationKicker">NOW STANKIN'</p>
          <h2>{track.title}</h2>
          <p className="stationDesc">{track.description}</p>

          <div className="metaRow">
            <span>🎤 {track.artist}</span>
            <span>🏷️ {track.tag}</span>
            
          </div>

          <audio
            ref={audioRef}
            controls
            src={track.audio || undefined}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={nextTrack}
          />

          <div className="stationControls">
            <button className="playWide" onClick={togglePlay}>{playing ? <Pause size={16}/> : <Play size={16}/>} {playing ? 'Pause' : 'Play'}</button>
            <button onClick={prevTrack}><SkipBack size={16}/> Previous</button>
            <button onClick={nextTrack}><SkipForward size={16}/> Next</button>
            <button onClick={randomTrack}><Shuffle size={16}/> Random Stank</button>
            <button onClick={shareTrack}><Share2 size={16}/> Share Stank</button>
          </div>

          
        </aside>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
