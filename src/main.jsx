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
import '@fontsource/barlow-condensed/latin-800.css';
import './styles.css';
import PocketFilthScanner from './layouts/PocketFilthScanner.jsx';
import FullConsoleShell from './layouts/FullConsoleShell.jsx';

const BASE = import.meta.env.BASE_URL || '/';
const defaultCover = `${BASE}images/stank-radio-icon.png`;
const TRACKS_PER_PAGE = 10;

function playlistSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
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
    collection: 'UNCLASSIFIED STANK',
    certification: 'Certified Audio Contamination',
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
  if (path.startsWith('/music/')) return path;
  if (path.startsWith('/')) return `${BASE}${path.slice(1)}`;
  if (path.startsWith('music/') || path.startsWith('images/')) return `${BASE}${path}`;
  return `${BASE}music/${path}`;
}

function normalizeTrack(song, index) {
  const playlists = cleanArray(song.playlists || song.playlist || song.collection);
  const tag = song.tag || song.classification || song.genre || 'UNCLASSIFIED STANK';
  const suppliedArtist = song.performingEntity || song.artist || song.author || song.creator || 'The Containment Unit';
  const artist = /^certified audio contaminator$/i.test(suppliedArtist)
    ? 'The Containment Unit'
    : suppliedArtist;

  const audioSource = song.audio || song.src || song.file || song.path || song.url || '';
  const isLocalBeastModeTest = import.meta.env.DEV && /(?:^|\/)03-beast-mode\.mp3(?:$|[?#])/i.test(audioSource);

  return {
    id: `${song.title || song.name || song.filename || 'track'}-${index}`,
    title: song.title || song.name || song.track || song.filename || `Unlabeled Stank ${index + 1}`,
    artist,
    tag,
    collection: song.collection || tag,
    certification: song.certification || 'Certified Audio Contamination',
    playlists,
    description: song.description || song.lyrics || 'No field notes provided. The funk speaks for itself.',
    lyricsTimeline: Array.isArray(song.lyricsTimeline)
      ? song.lyricsTimeline
          .map((line) => ({ time: Number(line.time), text: String(line.text || '').trim() }))
          .filter((line) => Number.isFinite(line.time) && line.text)
          .sort((a, b) => a.time - b.time)
      : [],
    created: song.created || song.date || song.uploaded || '',
    // Local-only test route. Production continues to use the main site's /music/ library.
    audio: isLocalBeastModeTest ? `${BASE}music/songs/03-beast-mode.mp3` : assetPath(audioSource),
    cover: assetPath(song.cover || song.coverArt || song.image || song.artwork || defaultCover),
  };
}

function useHardwarePlatform() {
  const getPlatform = () => {
    // The desktop console is a fixed canvas. Below its practical operating
    // width, use the purpose-built Pocket Filth interface instead of showing
    // the old blank desktop guard while a resize is in progress.
    if (window.innerWidth < 1100) return 'pocket-filth';
    return 'filth-up-console';
  };

  const [hardwarePlatform, setHardwarePlatform] = useState(getPlatform);

  useEffect(() => {
    const updateHardware = () => setHardwarePlatform(getPlatform());
    updateHardware();
    window.addEventListener('resize', updateHardware);
    return () => window.removeEventListener('resize', updateHardware);
  }, []);

  return hardwarePlatform;
}

function DesktopGuard() {
  return (
    <main className="desktopGuard">
      <section className="desktopGuardPanel">
        <p>BIG DUMB IDIOT LABS</p>
        <h1>FILTH-UP CONSOLE</h1>
        <strong>Desktop viewport below safe operating width.</strong>
        <span>Widen the browser to continue console operation.</span>
        <small>POCKET FILTH activates at 900px and below.</small>
      </section>
    </main>
  );
}

function useFilthStageScale() {
  const getScale = () => {
    const viewportHeight =
      window.visualViewport?.height ||
      document.documentElement.clientHeight ||
      window.innerHeight;

    return Math.min(
      (window.innerWidth - 64) / 1920,
      (viewportHeight - 220) / 1080,
      1
    );
  };
  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    const updateScale = () => setScale(getScale());
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return scale;
}

function App() {
  const audioRef = useRef(null);
  const lyricLineRefs = useRef([]);
  const sharedSongRequestRef = useRef(
    new URLSearchParams(window.location.search).get('song')?.trim() || '',
  );
  const sharedAutoplayTrackIdRef = useRef('');
  const [tracks, setTracks] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [playbackId, setPlaybackId] = useState('');
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('ALL');
  const [libraryPage, setLibraryPage] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlistsOpen, setPlaylistsOpen] = useState(false);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [loadStatus, setLoadStatus] = useState('Tuning the contamination manifest');
  const [viewMode, setViewMode] = useState('filth');
  const hardwarePlatform = useHardwarePlatform();
  const filthStageScale = useFilthStageScale();

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
        const requestedSong = sharedSongRequestRef.current.toLocaleLowerCase();
        const requestedTrack = requestedSong
          ? nextTracks.find((track) => track.title.trim().toLocaleLowerCase() === requestedSong)
          : null;
        sharedAutoplayTrackIdRef.current = requestedTrack?.audio ? requestedTrack.id : '';
        setTracks(nextTracks);
        setActiveId(requestedTrack?.id || '');
        setPlaybackId(requestedTrack?.audio ? requestedTrack.id : '');
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
  const tracksPerPage = viewMode === 'filth' ? 6 : TRACKS_PER_PAGE;
  const totalLibraryPages = Math.max(1, Math.ceil(visibleTracks.length / tracksPerPage));
  const pagedTracks = visibleTracks.slice(
    (libraryPage - 1) * tracksPerPage,
    libraryPage * tracksPerPage,
  );
  const activeTrack = tracks.find((track) => track.id === activeId) || null;
  const playbackTrack = tracks.find((track) => track.id === playbackId) || null;
  const displayTrack = activeTrack || {
    title: 'No transmission selected',
    artist: 'Choose a track from the library',
    tag: 'Fumes: idle',
    collection: 'Containment standby',
    certification: 'Certified Audio Contamination',
    description: 'The fumes stay still until someone chooses a stank.',
    cover: defaultCover,
  };
  const activeIndex = activeTrack ? visibleTracks.findIndex((track) => track.id === activeTrack.id) : -1;
  const playbackIndex = playbackTrack
    ? visibleTracks.findIndex((track) => track.id === playbackTrack.id)
    : activeIndex;
  const stankIndex = activeTrack
    ? Math.min(99, Math.max(43, activeTrack.title.length + activeTrack.tag.length))
    : 0;
  const fumesMeterAngle = activeTrack ? Math.round((stankIndex / 99) * 130 - 65) : -70;
  const hasActiveAudio = Boolean((playbackTrack || activeTrack)?.audio);
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

  // Build the playlist list from whatever playlists actually exist in the
  // catalog (managed by the admin tool), so new playlists appear automatically.
  const playlists = useMemo(() => {
    const counts = new Map();
    const firstCover = new Map();
    tracks.forEach((track) => {
      track.playlists.forEach((id) => {
        if (!id) return;
        counts.set(id, (counts.get(id) || 0) + 1);
        if (!firstCover.has(id) && track.cover) firstCover.set(id, track.cover);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([id, count]) => {
        const known = playlistDefinitions.find((p) => p.id === id);
        return {
          id,
          title: known ? known.title : id,
          description: known ? known.description : `${count} contaminant${count === 1 ? '' : 's'} filed under ${id}.`,
          artClass: known ? known.artClass : 'unclassifiedStank',
          count,
          art: `/music/playlist-covers/${playlistSlug(id)}.png`,
          fallbackArt: firstCover.get(id) || defaultCover,
        };
      });
  }, [tracks]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [playbackId]);

  useEffect(() => {
    if (!playbackTrack || sharedAutoplayTrackIdRef.current !== playbackTrack.id) return undefined;

    const audio = audioRef.current;
    if (!audio) return undefined;

    let cancelled = false;
    const beginSharedTrack = () => {
      if (cancelled) return;
      audio.currentTime = 0;
      const playRequest = audio.play();
      if (!playRequest?.then) {
        setPlaying(true);
        sharedAutoplayTrackIdRef.current = '';
        return;
      }
      playRequest
        .then(() => {
          if (cancelled) return;
          setPlaying(true);
          sharedAutoplayTrackIdRef.current = '';
        })
        .catch(() => {
          if (!cancelled) setPlaying(false);
        });
    };

    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      beginSharedTrack();
    } else {
      audio.addEventListener('canplay', beginSharedTrack, { once: true });
      audio.load();
    }

    return () => {
      cancelled = true;
      audio.removeEventListener('canplay', beginSharedTrack);
    };
  }, [playbackTrack]);

  useEffect(() => {
    setLibraryPage((page) => Math.min(page, totalLibraryPages));
  }, [totalLibraryPages]);

  useEffect(() => {
    if (activeLyricIndex < 0) return;
    lyricLineRefs.current[activeLyricIndex]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeLyricIndex]);

  function selectTrack(track, autoplay = false) {
    setActiveId(track.id);
    if (!autoplay) return;

    sharedAutoplayTrackIdRef.current = track.id;
    if (playbackTrack?.id !== track.id) {
      setPlaying(false);
      setPlaybackId(track.id);
      return;
    }

    window.setTimeout(() => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play().then(() => {
        sharedAutoplayTrackIdRef.current = '';
      }).catch(() => setPlaying(false));
    }, 50);
  }

  function stepTrack(direction) {
    if (!visibleTracks.length) return;
    const currentIndex = playbackIndex >= 0 ? playbackIndex : Math.max(0, activeIndex);
    const nextIndex = (currentIndex + direction + visibleTracks.length) % visibleTracks.length;
    selectTrack(visibleTracks[nextIndex], true);
  }

  function randomTrack() {
    if (!visibleTracks.length) return;

    const currentIndex = playbackIndex >= 0 ? playbackIndex : activeIndex;
    let nextIndex = Math.floor(Math.random() * visibleTracks.length);

    if (visibleTracks.length > 1 && nextIndex === currentIndex) {
      nextIndex = (nextIndex + 1) % visibleTracks.length;
    }

    selectTrack(visibleTracks[nextIndex], true);
  }

  function togglePlay() {
    if (!playbackTrack && activeTrack?.audio) {
      selectTrack(activeTrack, true);
      return;
    }
    if (!audioRef.current || !playbackTrack?.audio) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }

  useEffect(() => {
    if (hardwarePlatform === 'pocket-filth') return undefined;

    const handleDesktopSpace = (event) => {
      if (event.code !== 'Space' && event.key !== ' ') return;

      const target = event.target;
      if (
        target instanceof HTMLElement
        && target.closest('input, textarea, select, [contenteditable="true"]')
      ) return;

      // Stop Space from triggering whichever desktop button currently has focus.
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (!event.repeat && activeTrack) togglePlay();
    };

    window.addEventListener('keydown', handleDesktopSpace, { capture: true });
    return () => window.removeEventListener('keydown', handleDesktopSpace, { capture: true });
  }, [activeId, hardwarePlatform, playbackId, playing]);

  function shareTrack() {
    if (!activeTrack) return;
    const url = `${window.location.origin}${BASE}?song=${encodeURIComponent(activeTrack.title)}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    return url;
  }

  function updatePlaybackTime(event) {
    setCurrentTime(event.currentTarget.currentTime);
  }

  function updatePlaybackDuration(event) {
    const nextDuration = event.currentTarget.duration;
    setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
  }

  const sharedAudio = (
    <audio
      key="stank-radio-shared-audio"
      ref={audioRef}
      src={playbackTrack?.audio || undefined}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onAbort={() => setPlaying(false)}
      onEmptied={() => setPlaying(false)}
      onError={() => setPlaying(false)}
      onTimeUpdate={updatePlaybackTime}
      onLoadedMetadata={updatePlaybackDuration}
      onDurationChange={updatePlaybackDuration}
      onEnded={() => {
        setPlaying(false);
        stepTrack(1);
      }}
    />
  );

  if (hardwarePlatform === 'pocket-filth') {
    return (
      <>
        {sharedAudio}
        <PocketFilthScanner
        BASE={BASE}
        defaultCover={defaultCover}
        audioRef={audioRef}
        activeTrack={activeTrack}
        playbackTrack={playbackTrack}
        displayTrack={displayTrack}
        pagedTracks={pagedTracks}
        visibleTracks={visibleTracks}
        playing={playing}
        currentTime={currentTime}
        duration={duration}
        currentLyrics={currentLyrics}
        activeLyricIndex={activeLyricIndex}
        libraryPage={libraryPage}
        totalLibraryPages={totalLibraryPages}
        playlists={playlists}
        query={query}
        setQuery={setQuery}
        setActiveTag={setActiveTag}
        setLibraryPage={setLibraryPage}
        selectTrack={selectTrack}
        togglePlay={togglePlay}
        stepTrack={stepTrack}
        randomTrack={randomTrack}
        shareTrack={shareTrack}
        />
      </>
    );
  }

  if (hardwarePlatform === 'desktop-guard') {
    return <>{sharedAudio}<DesktopGuard /></>;
  }

  if (viewMode === 'filth') {
    return (
      <>
        {sharedAudio}
        <FullConsoleShell
        BASE={BASE}
        defaultCover={defaultCover}
        lyricLineRefs={lyricLineRefs}
        activeTrack={activeTrack}
        playbackTrack={playbackTrack}
        displayTrack={displayTrack}
        pagedTracks={pagedTracks}
        visibleTracks={visibleTracks}
        query={query}
        playing={playing}
        hasActiveAudio={hasActiveAudio}
        currentTime={currentTime}
        duration={duration}
        currentLyrics={currentLyrics}
        activeLyricIndex={activeLyricIndex}
        libraryPage={libraryPage}
        totalLibraryPages={totalLibraryPages}
        roomTone={roomTone}
        loadStatus={loadStatus}
        playlists={playlists}
        playlistsOpen={playlistsOpen}
        setPlaylistsOpen={setPlaylistsOpen}
        setActiveTag={setActiveTag}
        setQuery={setQuery}
        setLibraryPage={setLibraryPage}
        selectTrack={selectTrack}
        togglePlay={togglePlay}
        stepTrack={stepTrack}
        randomTrack={randomTrack}
        shareTrack={shareTrack}
        />
      </>
    );
  }

  return (
    <>
      {sharedAudio}
      <main className={`${playing ? 'radioApp isPlaying' : 'radioApp'} ${viewMode === 'filth' ? 'filthUpView' : 'containmentView'}`}>
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

        <div className="transmissionFlag liveContainmentBadge">
          <span />
          LIVE CONTAINMENT
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

        <aside className="headerSignal" aria-label="Containment signal status">
          <div title={loadStatus}>
            <span>Containment index</span>
            <b className="digitalCount">{tracks.length}</b>
          </div>
          <div>
            <span>Fumes</span>
            <b>{activeTrack ? `${stankIndex}%` : 'Idle'}</b>
          </div>
        </aside>

        <button
          className="viewToggle"
          type="button"
          onClick={() => setViewMode((mode) => (mode === 'containment' ? 'filth' : 'containment'))}
          aria-pressed={viewMode === 'filth'}
        >
          {viewMode === 'filth' ? 'Containment View' : 'Filth-Up View'}
        </button>

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

      <section className="workspaceGrid dashboardContainment">
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
      </section>

      <section className="consoleGrid">
        <section className="playerPanel">
          <div className="panelLabel">
            <Radio size={17} />
            Now leaking
          </div>

          <div className="playerCore dashboardPlayerCore">
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

            <div className="coverWell">
              <img src={displayTrack.cover || defaultCover} alt="" />
              <div className="vinylBadge">
                <Disc3 size={12} />
                {activeTrack ? 'Active residue' : 'Awaiting selection'}
              </div>
            </div>

            <div className="trackStack">
              <p className="trackTag">{activeTrack ? displayTrack.tag : 'FUMES: IDLE'}</p>
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

          <div className="sourceLine">
            {!activeTrack ? (
              <span>Choose a stank to infect your Ear Holes.</span>
            ) : hasActiveAudio ? (
              <button type="button" className="sourceButton" onClick={() => setPlayerModalOpen(true)}>
                  <FileAudio size={16} />
                  Open in-page stank player
                </button>
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
              <div
                key={track.id}
                className={track.id === activeTrack?.id ? 'trackRow active' : 'trackRow'}
              >
                <button type="button" className="trackRowSelect" onClick={() => selectTrack(track, false)}>
                  <img src={track.cover || defaultCover} alt="" />
                  <span className="trackRowText">
                    <b>{track.title}</b>
                    <small>{track.artist}</small>
                  </span>
                </button>
                <button
                  type="button"
                  className="trackRowPlay"
                  aria-label={`Play ${track.title}`}
                  onClick={() => selectTrack(track, true)}
                >
                  <Play size={17} />
                </button>
              </div>
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

      {playerModalOpen && activeTrack ? (
        <section className="playerModal" role="dialog" aria-modal="true" aria-label="Stank player">
          <div className="playerModalPanel">
            <button type="button" className="modalDismiss" onClick={() => setPlayerModalOpen(false)}>
              Close
            </button>
            <img className="playerModalCover" src={displayTrack.cover || defaultCover} alt="" />
            <div className="playerModalCopy">
              <p>{displayTrack.tag}</p>
              <h2>{displayTrack.title}</h2>
              <span>{displayTrack.artist}</span>
            </div>
            <audio className="playerModalAudio" controls src={activeTrack.audio} />
          </div>
        </section>
      ) : null}

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
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
