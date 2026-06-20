import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Disc3,
  ExternalLink,
  FileAudio,
  ListMusic,
  Pause,
  Play,
  Radio,
  Search,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
} from 'lucide-react';
import './styles.css';

const BASE = import.meta.env.BASE_URL || '/';
const defaultCover = `${BASE}images/stank-radio-icon.png`;
const TRACKS_PER_PAGE = 10;
const playlistNotes = {
  'UNCLASSIFIED STANK': 'Unfiled transmissions and residue without a clean category.',
  'AFTER HOURS STANK': 'Slow-burn radio for rooms that should have closed already.',
  'HAZARDOUS STANK': 'High-impact signal damage, loose bass, and unstable equipment.',
};

const playlistDefinitions = [
  { id: 'RAP BATTLES', title: 'Rap Battles', description: 'High-friction verses and unlicensed confidence.', artClass: 'rapBattles' },
  { id: 'DREAM SYMPHONY', title: 'Dream Symphony', description: 'Cloudy transmissions with strange inner weather.', artClass: 'dreamSymphony' },
  { id: 'STUFF', title: 'Stuff', description: 'A little bit of everything that should not work together.', artClass: 'stuff' },
  { id: 'HOLIDAY HIJINKS', title: 'Holiday Hijinks', description: 'Seasonal detours, bad gifts, and loose cheer.', artClass: 'holidayHijinks' },
  { id: 'CONSPIRACY OR TRUTH', title: 'Conspiracy or Truth?', description: 'Questionable signals from a suspicious source.', artClass: 'conspiracyTruth' },
  { id: 'DISSIN KIDS', title: 'Dissin Kids', description: 'Small voices, large opinions, unreasonable bass.', artClass: 'dissinKids' },
  { id: 'UNCLASSIFIED STANK', title: 'Unclassified Stank', description: playlistNotes['UNCLASSIFIED STANK'], artClass: 'unclassifiedStank' },
  { id: 'AFTER HOURS STANK', title: 'After Hours Stank', description: playlistNotes['AFTER HOURS STANK'], artClass: 'afterHoursStank' },
];

const roomTonePresets = [
  { label: 'Idle air', level: 'LOW', bars: [22, 30, 18, 34, 24, 16, 28, 20] },
  { label: 'Wet subfloor', level: 'MED', bars: [42, 66, 28, 78, 52, 38, 70, 44] },
  { label: 'Fire exit hum', level: 'HIGH', bars: [58, 30, 82, 46, 74, 34, 64, 52] },
  { label: 'Unstable transformer', level: 'HOT', bars: [78, 54, 90, 44, 84, 64, 96, 58] },
];

const fallbackTracks = [
  {
    id: 'fallback-containment-funk-protocol',
    title: 'Containment Funk Protocol',
    artist: 'Explosive Crossfader',
    tag: 'UNCLASSIFIED STANK',
    playlists: ['Fallback Stank'],
    description: 'Fallback stank engaged. The funk refuses to die.',
    cover: defaultCover,
    audio: '',
  },
];

function cleanArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function assetPath(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith(BASE)) return path;
  if (path.startsWith('/stank-radio/')) return path;
  if (path.startsWith('/')) return `${BASE}${path.slice(1)}`;
  if (path.startsWith('music/') || path.startsWith('images/')) return `${BASE}${path}`;
  return `${BASE}music/${path}`;
}

function normalizeTrack(song, index) {
  const playlists = cleanArray(song.playlists || song.playlist || song.collection);
  const tag = song.tag || song.classification || song.genre || 'UNCLASSIFIED STANK';

  return {
    id: `${song.title || song.name || song.filename || 'track'}-${index}`,
    title: song.title || song.name || song.track || song.filename || `Unlabeled Stank ${index + 1}`,
    artist: song.artist || song.author || song.creator || 'Certified Audio Contaminator',
    tag,
    playlists,
    description: song.description || song.lyrics || 'No field notes provided. The funk speaks for itself.',
    lyricsTimeline: Array.isArray(song.lyricsTimeline)
      ? song.lyricsTimeline
          .map((line) => ({ time: Number(line.time), text: String(line.text || '').trim() }))
          .filter((line) => Number.isFinite(line.time) && line.text)
          .sort((a, b) => a.time - b.time)
      : [],
    created: song.created || song.date || song.uploaded || '',
    audio: assetPath(song.audio || song.src || song.file || song.path || song.url || ''),
    cover: assetPath(song.cover || song.coverArt || song.image || song.artwork || defaultCover),
  };
}

function App() {
  const audioRef = useRef(null);
  const lyricLineRefs = useRef([]);
  const [tracks, setTracks] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('ALL');
  const [libraryPage, setLibraryPage] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playlistsOpen, setPlaylistsOpen] = useState(false);
  const [loadStatus, setLoadStatus] = useState('Tuning the contamination manifest');

  useEffect(() => {
    fetch(`${BASE}songs.json`, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`songs.json returned ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const rawSongs = Array.isArray(data) ? data : data.songs || data.tracks || [];
        const normalized = rawSongs.map(normalizeTrack);
        const nextTracks = normalized.length ? normalized : fallbackTracks;
        setTracks(nextTracks);
        setActiveId('');
        setLoadStatus(`${nextTracks.length} contaminants indexed`);
      })
      .catch((error) => {
        console.error(error);
        setTracks(fallbackTracks);
        setActiveId('');
        setLoadStatus('Manifest missing. Emergency stink loop armed.');
      });
  }, []);

  const filteredTracks = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tracks.filter((track) => {
      const haystack = [track.title, track.artist, track.tag, track.description, ...track.playlists]
        .join(' ')
        .toLowerCase();
      const playlistMatch = activeTag === 'ALL' || track.playlists.includes(activeTag);
      return playlistMatch && (!needle || haystack.includes(needle));
    });
  }, [activeTag, query, tracks]);

  const visibleTracks = filteredTracks;
  const totalLibraryPages = Math.max(1, Math.ceil(visibleTracks.length / TRACKS_PER_PAGE));
  const pagedTracks = visibleTracks.slice(
    (libraryPage - 1) * TRACKS_PER_PAGE,
    libraryPage * TRACKS_PER_PAGE,
  );
  const activeTrack = tracks.find((track) => track.id === activeId) || null;
  const displayTrack = activeTrack || {
    title: 'No transmission selected',
    artist: 'Choose a track from the library',
    tag: 'Fumes: idle',
    description: 'The fumes stay still until someone chooses a stank.',
    cover: defaultCover,
  };
  const activeIndex = activeTrack ? visibleTracks.findIndex((track) => track.id === activeTrack.id) : -1;
  const stankIndex = activeTrack
    ? Math.min(99, Math.max(43, activeTrack.title.length + activeTrack.tag.length))
    : 0;
  const hasActiveAudio = Boolean(activeTrack?.audio);
  const currentLyrics = activeTrack?.lyricsTimeline || [];
  const activeLyricIndex = useMemo(() => {
    if (!currentLyrics.length) return -1;
    return currentLyrics.reduce(
      (latestIndex, line, index) => (line.time <= currentTime ? index : latestIndex),
      0,
    );
  }, [currentLyrics, currentTime]);
  const selectedTrackIndex = activeTrack ? tracks.findIndex((track) => track.id === activeTrack.id) : -1;
  const roomTone = activeTrack
    ? roomTonePresets[(selectedTrackIndex + 1) % roomTonePresets.length]
    : roomTonePresets[0];

  const playlists = useMemo(
    () =>
      playlistDefinitions.map((playlist) => ({
        ...playlist,
        count: tracks.filter((track) => track.playlists.includes(playlist.id)).length,
      })),
    [tracks],
  );

  useEffect(() => {
    setCurrentTime(0);
  }, [activeId]);

  useEffect(() => {
    setLibraryPage((page) => Math.min(page, totalLibraryPages));
  }, [totalLibraryPages]);

  useEffect(() => {
    if (activeLyricIndex < 0) return;
    lyricLineRefs.current[activeLyricIndex]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeLyricIndex]);

  function selectTrack(track, autoplay = false) {
    setActiveId(track.id);
    setPlaying(false);
    window.setTimeout(() => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (autoplay) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 50);
  }

  function stepTrack(direction) {
    if (!visibleTracks.length || activeIndex < 0) return;
    const nextIndex = (activeIndex + direction + visibleTracks.length) % visibleTracks.length;
    selectTrack(visibleTracks[nextIndex], false);
  }

  function randomTrack() {
    if (!visibleTracks.length) return;
    let nextIndex = Math.floor(Math.random() * visibleTracks.length);
    if (visibleTracks.length > 1 && nextIndex === activeIndex) {
      nextIndex = (nextIndex + 1) % visibleTracks.length;
    }
    selectTrack(visibleTracks[nextIndex], false);
  }

  function togglePlay() {
    if (!audioRef.current || !hasActiveAudio) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  }

  function shareTrack() {
    if (!activeTrack) return;
    const url = `${window.location.origin}${BASE}?song=${encodeURIComponent(activeTrack.title)}`;
    navigator.clipboard?.writeText(url).catch(() => {});
  }

  function updatePlaybackTime(event) {
    setCurrentTime(event.currentTarget.currentTime);
  }

  return (
    <main className={playing ? 'radioApp isPlaying' : 'radioApp'}>
      <div
        className="backdrop"
        style={{ '--app-bg': `url("${BASE}images/stank-radio-bg.png")` }}
        aria-hidden="true"
      />
      <div className="scanlines" aria-hidden="true" />

      <header className="masthead">
        <a className="brand" href={BASE} aria-label="STANK RADIO">
          <img src={defaultCover} alt="" />
          <span>
            <b>STANK RADIO</b>
            <small>Big Dumb Idiot Labs Broadcast Division</small>
          </span>
        </a>

        <div className="transmissionFlag">
          <span />
          Live containment
        </div>

        <aside className="headerRoomTone" aria-label="Room tone meter">
          <span>Room tone</span>
          <b>{roomTone.label}</b>
          <div className="meterBars" aria-hidden="true">
            {roomTone.bars.map((height, index) => (
              <i key={index} style={{ '--meter-height': `${height}%` }} />
            ))}
          </div>
        </aside>

        <div className="topPipeBlock">
          <h2 className="pipeHeadline">
            <span>Fresh From The Suno</span>
            <span><b className="stinkPipeWord">STINK PIPE</b></span>
          </h2>
          <p>Freshly harvested audio contaminants. Press play at your own risk.</p>
        </div>
            ))}
          </div>
        </aside>

        <aside className="headerSignal" aria-label="Containment signal status">
          <div title={loadStatus}>
            <span>Containment index</span>
            <b>{tracks.length}</b>
          </div>
          <div>
            <span>Fumes</span>
            <b>{activeTrack ? `${stankIndex}%` : 'Idle'}</b>
          </div>
        </aside>

        <a
          className="manifestLink"
          href={`${BASE}songs.json`}
          target="_blank"
          rel="noreferrer"
        >
          <FileAudio size={16} />
          Music manifest
          <ExternalLink size={14} />
        </a>
      </header>

      <section className="workspaceGrid">
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
      </section>

      <section className="consoleGrid">
        <section className="playerPanel">
          <div className="panelLabel">
            <Radio size={17} />
            Now leaking
          </div>

          <div className="playerCore">
            <div className="coverWell">
              <img src={displayTrack.cover || defaultCover} alt="" />
              <div className="vinylBadge">
                <Disc3 size={12} />
                {activeTrack ? 'Active residue' : 'Awaiting selection'}
              </div>
            </div>

            <div className="trackStack">
              <p className="trackTag">{displayTrack.tag}</p>
              <h2>{displayTrack.title}</h2>
              <p>{displayTrack.description}</p>

              <dl className="trackMeta">
                <div>
                  <dt>Operator</dt>
                  <dd>{displayTrack.artist}</dd>
                </div>
                <div>
                  <dt>Stank load</dt>
                  <dd>{activeTrack ? `${stankIndex}%` : 'None'}</dd>
                </div>
                <div>
                  <dt>Indexed</dt>
                  <dd>{tracks.length || 0} tracks</dd>
                </div>
              </dl>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={activeTrack?.audio || undefined}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={updatePlaybackTime}
            onEnded={() => stepTrack(1)}
          />

          <div className="sourceLine">
            {!activeTrack ? (
              <span>Choose a stank to infect your Ear Holes.</span>
            ) : hasActiveAudio ? (
              <a href={activeTrack.audio} target="_blank" rel="noreferrer">
                <FileAudio size={16} />
                Open loaded audio file
                <ExternalLink size={14} />
              </a>
            ) : (
              <span>No audio file connected for this manifest entry.</span>
            )}
          </div>

          <section className="lyricsPanel" aria-label="Lyrics">
            <div className="lyricsHeading">
              <span>Lyrics</span>
              {currentLyrics.length ? <b>Following track</b> : <b>Awaiting lyric timing</b>}
            </div>
            <div className="lyricsScroll">
              {currentLyrics.length ? (
                currentLyrics.map((line, index) => (
                  <p
                    key={`${line.time}-${index}`}
                    ref={(element) => {
                      lyricLineRefs.current[index] = element;
                    }}
                    className={index === activeLyricIndex ? 'active' : ''}
                  >
                    {line.text}
                  </p>
                ))
              ) : (
                <p className="lyricsEmpty">Select a track with timed lyrics to follow the transmission.</p>
              )}
            </div>
          </section>

          <div className="transportBar">
            <button type="button" onClick={() => stepTrack(-1)} aria-label="Previous track">
              <SkipBack size={18} />
            </button>
            <button
              className="primaryPlay"
              type="button"
              onClick={togglePlay}
              disabled={!hasActiveAudio}
              title={hasActiveAudio ? 'Play track' : 'No audio file is connected'}
            >
              {playing ? <Pause size={22} /> : <Play size={22} />}
              {playing ? 'Pause leak' : 'Start leak'}
            </button>
            <button type="button" onClick={() => stepTrack(1)} aria-label="Next track">
              <SkipForward size={18} />
            </button>
            <button type="button" onClick={randomTrack}>
              <Shuffle size={18} />
              Random
            </button>
            <button type="button" onClick={shareTrack}>
              <Share2 size={18} />
              Share
            </button>
          </div>
        </section>

        <aside className="filterPanel">
          <div className="filterHeader">
            <div className="panelLabel">
              <Search size={17} />
              Search the spill
            </div>
            <button className="playlistLink" type="button" onClick={() => setPlaylistsOpen(true)}>
              <ListMusic size={16} />
              Playlists
            </button>
            <button
              className={activeTag === 'ALL' ? 'playlistLink allTracksLink active' : 'playlistLink allTracksLink'}
              type="button"
              onClick={() => {
                setActiveTag('ALL');
                setLibraryPage(1);
              }}
            >
              All tracks
            </button>
          </div>

          <label className="searchBox">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setLibraryPage(1);
              }}
              placeholder="Title, operator, tag..."
            />
          </label>

        </aside>

        <section className="libraryPanel">
          <div className="panelLabel">
            <SlidersHorizontal size={17} />
            Containment library
          </div>

          <div className="trackList">
            {pagedTracks.map((track) => (
              <button
                key={track.id}
                className={track.id === activeTrack?.id ? 'trackRow active' : 'trackRow'}
                type="button"
                onClick={() => selectTrack(track, false)}
              >
                <img src={track.cover || defaultCover} alt="" />
                <span className="trackRowText">
                  <b>{track.title}</b>
                  <small>{track.artist}</small>
                </span>
              </button>
            ))}
            {!visibleTracks.length ? (
              <p className="emptyLibrary">Nothing in this spill. Clear the search or return to all tracks.</p>
            ) : null}
          </div>
          <nav className="libraryPagination" aria-label="Containment library pages">
            <button
              type="button"
              title="Previous library page"
              aria-label="Previous library page"
              disabled={libraryPage === 1}
              onClick={() => setLibraryPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft size={15} />
            </button>
            <span>Page {libraryPage} / {totalLibraryPages}</span>
            <button
              type="button"
              title="Next library page"
              aria-label="Next library page"
              disabled={libraryPage === totalLibraryPages}
              onClick={() => setLibraryPage((page) => Math.min(totalLibraryPages, page + 1))}
            >
              <ChevronRight size={15} />
            </button>
          </nav>
        </section>

        <aside className="warningPanel">
          <div className="panelLabel">
            <AlertTriangle size={14} />
            Field warnings
          </div>
          <ul>
            <li>Do not clean the signal path.</li>
            <li>Do not trust anything labeled smooth.</li>
            <li>Report all suspicious silence.</li>
          </ul>
        </aside>

      </section>
      </section>

      {playlistsOpen ? (
        <section className="playlistModal" role="dialog" aria-modal="true" aria-label="Available playlists">
          <div className="playlistModalPanel">
            <div className="playlistModalHead">
              <div>
                <p className="eyebrow">Browse by contamination class</p>
                <h2>Playlists</h2>
              </div>
              <button type="button" className="modalDismiss" onClick={() => setPlaylistsOpen(false)}>
                Close
              </button>
            </div>

            <div className="playlistGrid">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  type="button"
                  className="playlistCard"
                  onClick={() => {
                    setActiveTag(playlist.id);
                    setQuery('');
                    setLibraryPage(1);
                    setPlaylistsOpen(false);
                  }}
                >
                  <span className={`playlistArt ${playlist.artClass}`} aria-hidden="true" />
                  <span className="playlistCardCopy">
                    <b>{playlist.title}</b>
                    <small>{playlist.count} tracks</small>
                    <em>{playlist.description}</em>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
