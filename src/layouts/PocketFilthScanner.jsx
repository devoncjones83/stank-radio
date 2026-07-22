import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Share2, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { cautionMessages } from '../data/cautionMessages';
import './pocket-filth.css';

const ENVIRONMENT_STATUSES = ['STABLE', 'CONTAINED', 'PUTRID', 'AGGRESSIVE', 'HAZARDOUS'];
const LEVEL_METER_COLUMNS = [23, 39, 55];
const LEVEL_METER_ROWS = [15, 23, 32, 41, 50, 58, 67, 75];
const MOBILE_LAYOUT_STORAGE_KEY = 'stank-radio-pocket-layout-v2';
const DEFAULT_MOBILE_LAYOUT = {
  shell: { label: 'Mobile shell', x: 0, y: 0, w: 100, h: 100 },
  liveStatus: { label: 'Live containment status', x: 62.85, y: 5.585972070772803, w: 36.6, h: 8.725611171690879 },
  liveStatusLight: { label: 'STANDBY / ON AIR light', x: 69.9, y: 10.914633296985473, w: 21.1, h: 4.728416757536319 },
  libraryOpen: { label: 'Containment library control', x: 3.25, y: 17.4, w: 85.4, h: 7.8 },
  primaryDisplay: { label: 'Cover / information display', x: 4.05, y: 27.575122234338178, w: 93.30000000000001, h: 33.3 },
  nowPlaying: { label: 'Track information', x: 22.3, y: 61.05, w: 56.4, h: 8.05 },
  trackLevelMeter: { label: 'Track level meter', x: 76.3, y: 60.85, w: 22.9, h: 9.7 },
  trackCurrentTime: { label: 'Track time: elapsed', x: 3.0999999999999996, y: 69.5, w: 11.76, h: 4 },
  trackFill: { label: 'Track progress: green line', x: 18.5, y: 71.16, w: 65.65, h: 0.72 },
  trackMarker: { label: 'Track progress: position button', x: 19.1, y: 70.8, w: 60.35, h: 1.72 },
  trackDuration: { label: 'Track time: duration', x: 85.34, y: 69.5, w: 11.16, h: 4 },
  hazardGlow: { label: 'Track hazard glow', x: 3.8, y: 60.95, w: 17, h: 8.1 },
  environmentGlobe: { label: 'Environment globe', x: 5.3, y: 88.8, w: 9.6, h: 5.1 },
  directorateSeal: { label: 'Directorate seal', x: 62.80000000000001, y: 88.33743888283092, w: 13.4, h: 6.418172288859966 },
  radarSymbol: { label: 'Radar symbol', x: 84.5, y: 88.75, w: 9.5, h: 5.35 },
  radarSweep: { label: 'Radar sweep', x: 84.35, y: 88.65, w: 9.5, h: 5.35 },
  transport: { label: 'Player controls', x: 4.5, y: 74.35, w: 91.7, h: 8.55 },
  tabs: { label: 'Information tabs', x: 3.5, y: 83.25, w: 93, h: 4.05 },
  environmentReadout: { label: 'Environment readout', x: 18.8, y: 88.05, w: 61.4, h: 6.8 },
  warning: { label: 'Warning message', x: 18.5, y: 95.25, w: 43.5, h: 3.8 },
};

function createDefaultMobileLayout() {
  return Object.fromEntries(
    Object.entries(DEFAULT_MOBILE_LAYOUT).map(([id, item]) => [id, { ...item }]),
  );
}

function loadMobileLayout() {
  const defaults = createDefaultMobileLayout();
  try {
    const saved = JSON.parse(window.localStorage.getItem(MOBILE_LAYOUT_STORAGE_KEY) || '{}');
    Object.keys(defaults).forEach((id) => {
      if (saved[id]) defaults[id] = { ...defaults[id], ...saved[id] };
    });
  } catch {
    // A malformed local calibration must never prevent the player from loading.
  }
  return defaults;
}

export default function PocketFilthScanner({
  BASE,
  defaultCover,
  audioRef,
  activeTrack,
  playbackTrack,
  displayTrack,
  pagedTracks,
  visibleTracks,
  playing,
  currentTime,
  duration,
  currentLyrics,
  activeLyricIndex,
  libraryPage,
  totalLibraryPages,
  playlists,
  query,
  setQuery,
  setActiveTag,
  setLibraryPage,
  selectTrack,
  togglePlay,
  stepTrack,
  randomTrack,
  shareTrack,
}) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [playlistMenuOpen, setPlaylistMenuOpen] = useState(false);
  const [activePane, setActivePane] = useState('transmission');
  const [shareNotice, setShareNotice] = useState('');
  const [trackMeterLevels, setTrackMeterLevels] = useState([1, 1, 1]);
  const [warningIndex, setWarningIndex] = useState(0);
  const [mobileLayoutEditing, setMobileLayoutEditing] = useState(false);
  const [selectedMobileLayoutId, setSelectedMobileLayoutId] = useState('primaryDisplay');
  const [mobileLayout, setMobileLayout] = useState(loadMobileLayout);
  const [mobileEditorNotice, setMobileEditorNotice] = useState('Saved locally');
  const [mobileEditorPosition, setMobileEditorPosition] = useState({ x: 12, y: 76 });
  const pocketConsoleRef = useRef(null);
  const mobileLayoutGestureRef = useRef(null);
  const mobileEditorDragRef = useRef(null);
  const [environmentStatus] = useState(
    () => ENVIRONMENT_STATUSES[Math.floor(Math.random() * ENVIRONMENT_STATUSES.length)],
  );
  const [signalStability, setSignalStability] = useState(() => 82 + Math.floor(Math.random() * 16));
  useEffect(() => {
    if (!libraryOpen) {
      setPlaylistMenuOpen(false);
      setQuery('');
    }
  }, [libraryOpen, setQuery]);

  useEffect(() => {
    if (!playing) {
      setTrackMeterLevels([1, 1, 1]);
      return undefined;
    }

    const updateMeter = () => {
      setTrackMeterLevels((current) => current.map((level) => {
        const target = 2 + Math.floor(Math.random() * 7);
        const next = Math.round(level * 0.28 + target * 0.72);
        return Math.max(1, Math.min(8, next));
      }));
    };

    updateMeter();
    const timer = window.setInterval(updateMeter, 135);
    return () => window.clearInterval(timer);
  }, [playing, playbackTrack?.id]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWarningIndex((index) => (index + 1) % Math.max(1, cautionMessages.length));
    }, 7875);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(MOBILE_LAYOUT_STORAGE_KEY, JSON.stringify(mobileLayout));
    setMobileEditorNotice('Saved locally');
  }, [mobileLayout]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSignalStability((current) => {
        const change = Math.floor(Math.random() * 7) - 3;
        return Math.min(99, Math.max(81, current + change));
      });
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  function seekTrack(event) {
    if (!audioRef.current || !duration) return;
    audioRef.current.currentTime = Number(event.currentTarget.value);
  }

  function formatTime(value) {
    const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
    const minutes = Math.floor(safeValue / 60);
    const seconds = Math.floor(safeValue % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  function handleShare() {
    const url = shareTrack?.();
    if (!url) return;
    setShareNotice(url);
    window.setTimeout(() => setShareNotice(''), 2600);
  }

  function playLibraryTrack(track) {
    selectTrack(track, true);
    setLibraryOpen(false);
  }

  function closeLibrary() {
    setQuery('');
    setLibraryOpen(false);
  }

  function mobileLayoutProps(id, extraStyle = {}) {
    const item = mobileLayout[id] || DEFAULT_MOBILE_LAYOUT[id];
    return {
      'data-mobile-layout-id': id,
      style: {
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.w}%`,
        height: `${item.h}%`,
        ...extraStyle,
      },
      onPointerDown: (event) => {
        if (!mobileLayoutEditing || id === 'shell') return;
        startMobileLayoutGesture(event, id, 'move');
      },
      onPointerMove: updateMobileLayoutGesture,
      onPointerUp: finishMobileLayoutGesture,
      onPointerCancel: finishMobileLayoutGesture,
    };
  }

  function startMobileLayoutGesture(event, id, mode) {
    if (!mobileLayoutEditing) return;
    const item = mobileLayout[id] || DEFAULT_MOBILE_LAYOUT[id];
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setSelectedMobileLayoutId(id);
    mobileLayoutGestureRef.current = {
      id,
      mode,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      item: { ...item },
    };
  }

  function updateMobileLayoutGesture(event) {
    const gesture = mobileLayoutGestureRef.current;
    const stage = pocketConsoleRef.current;
    if (!gesture || !stage || gesture.pointerId !== event.pointerId) return;
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const deltaX = ((event.clientX - gesture.startX) / bounds.width) * 100;
    const deltaY = ((event.clientY - gesture.startY) / bounds.height) * 100;
    const next = gesture.mode === 'resize'
      ? {
          ...gesture.item,
          w: Math.max(0.5, Math.min(100 - gesture.item.x, gesture.item.w + deltaX)),
          h: Math.max(0.5, Math.min(100 - gesture.item.y, gesture.item.h + deltaY)),
        }
      : {
          ...gesture.item,
          x: Math.max(0, Math.min(100 - gesture.item.w, gesture.item.x + deltaX)),
          y: Math.max(0, Math.min(100 - gesture.item.h, gesture.item.y + deltaY)),
        };
    setMobileLayout((current) => ({ ...current, [gesture.id]: next }));
  }

  function finishMobileLayoutGesture(event) {
    const gesture = mobileLayoutGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    mobileLayoutGestureRef.current = null;
  }

  function updateSelectedMobileLayout(field, value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return;
    setMobileLayout((current) => ({
      ...current,
      [selectedMobileLayoutId]: {
        ...current[selectedMobileLayoutId],
        [field]: Math.max(0, Math.min(100, number)),
      },
    }));
  }

  function resetSelectedMobileLayout() {
    setMobileLayout((current) => ({
      ...current,
      [selectedMobileLayoutId]: { ...DEFAULT_MOBILE_LAYOUT[selectedMobileLayoutId] },
    }));
  }

  function resetAllMobileLayout() {
    setMobileLayout(createDefaultMobileLayout());
    setSelectedMobileLayoutId('primaryDisplay');
  }

  function copyMobileLayoutJson() {
    navigator.clipboard?.writeText(JSON.stringify(mobileLayout, null, 2))
      .then(() => setMobileEditorNotice('Layout JSON copied'))
      .catch(() => setMobileEditorNotice('Clipboard unavailable'));
  }

  function startMobileEditorDrag(event) {
    if (event.target.closest('button, input, select')) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    mobileEditorDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      position: { ...mobileEditorPosition },
    };
  }

  function updateMobileEditorDrag(event) {
    const gesture = mobileEditorDragRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    setMobileEditorPosition({
      x: Math.max(0, Math.min(window.innerWidth - 280, gesture.position.x + event.clientX - gesture.startX)),
      y: Math.max(0, Math.min(window.innerHeight - 80, gesture.position.y + event.clientY - gesture.startY)),
    });
  }

  function finishMobileEditorDrag(event) {
    const gesture = mobileEditorDragRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    mobileEditorDragRef.current = null;
  }

  const lyricText = currentLyrics?.[activeLyricIndex]?.text ||
    (activeTrack ? 'Lyrics unavailable for this contained transmission.' : 'Select a transmission from the containment library.');
  const boundedTime = duration ? Math.min(currentTime, duration) : 0;
  const progress = duration ? (boundedTime / duration) * 100 : 0;
  const titleLength = displayTrack.title.length;
  const titleSize = titleLength <= 18 ? 'short' : titleLength <= 34 ? 'medium' : titleLength <= 58 ? 'long' : 'extra-long';
  const confusionRating = activeTrack
    ? 1 + Array.from(activeTrack.id).reduce((score, character) => score + character.charCodeAt(0), 0) % 5
    : 0;
  const lyricStart = Math.max(0, activeLyricIndex - 2);
  const visibleLyrics = currentLyrics?.slice(lyricStart, lyricStart + 5) || [];
  const selectedMobileLayout = mobileLayout[selectedMobileLayoutId] || DEFAULT_MOBILE_LAYOUT[selectedMobileLayoutId];

  return (
    <main className={`pocketFilth${playing ? ' isPlaying' : ''}`}>
      <section
        ref={pocketConsoleRef}
        className={`pocketConsole${mobileLayoutEditing ? ' mobileLayoutEditing' : ''}`}
        aria-label="Stank Radio Pocket Filth player"
      >
        <div
          className="pocketLiveStatus"
          aria-label="Live containment"
          {...mobileLayoutProps('liveStatus')}
        >
          LIVE CONTAINMENT
        </div>
        <strong
          className="pocketLiveState"
          aria-label={playing ? 'On air active' : 'On air inactive'}
          {...mobileLayoutProps('liveStatusLight')}
        ><span>ON</span><span>AIR</span></strong>

        <button
          className="pocketLibraryOpen"
          type="button"
          onClick={() => setLibraryOpen(true)}
          aria-label="Open containment library"
          {...mobileLayoutProps('libraryOpen')}
        />

        <section
          className={`pocketPrimaryDisplay is-${activePane}`}
          aria-live="polite"
          {...mobileLayoutProps('primaryDisplay')}
        >
          {activePane === 'transmission' ? (
            <img
              className="pocketCover"
              src={displayTrack.cover || defaultCover}
              alt={activeTrack ? `${displayTrack.title} cover art` : 'Stank Radio headphone cover art'}
              onError={(event) => {
                event.currentTarget.src = defaultCover;
              }}
            />
          ) : null}
          {activePane === 'lyrics' ? (
            <div className="pocketLyricsView">
              <img src={`${BASE}images/mobile/lyrics-feed.png`} alt="Lyrics feed interface" />
              <div className="pocketLyricsCopy">
                {visibleLyrics.length ? visibleLyrics.map((line, index) => (
                  <p className={lyricStart + index === activeLyricIndex ? 'active' : ''} key={`${line.time}-${index}`}>
                    {line.text}
                  </p>
                )) : <p className="active">{lyricText}</p>}
              </div>
            </div>
          ) : null}
          {activePane === 'dossier' ? (
            <div className="pocketDossierView">
              <img className="pocketDossier" src={`${BASE}images/mobile/transmission-dossier.png`} alt="Transmission dossier" />
              <div className="pocketConfusionRating" aria-label={`Public confusion rating: ${confusionRating} of 5`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <img
                    key={index}
                    className={index < confusionRating ? 'isActive' : ''}
                    src={`${BASE}images/mobile/skull-icon.png`}
                    alt=""
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section
          className="pocketNowPlaying"
          aria-label="Active transmission metadata"
          {...mobileLayoutProps('nowPlaying')}
        >
          <h1 className={`pocketTrackTitle ${titleSize}`}>{displayTrack.title}</h1>
        </section>

        <div
          className="pocketTrackLevelMeter"
          aria-label={playing ? 'Active track output level' : 'Track output level idle'}
          {...mobileLayoutProps('trackLevelMeter')}
        >
          {LEVEL_METER_COLUMNS.flatMap((left, column) => LEVEL_METER_ROWS.map((top, row) => {
            const lit = row >= LEVEL_METER_ROWS.length - trackMeterLevels[column];
            return (
              <i
                className={lit ? 'isLit' : ''}
                key={`${column}-${row}`}
                style={{
                  left: `${(left / 85) * 100}%`,
                  top: `${(top / 96) * 100}%`,
                  width: `${(10 / 85) * 100}%`,
                  height: `${(4 / 96) * 100}%`,
                }}
              />
            );
          }))}
        </div>

        <time className="pocketTrackTime pocketTrackTime--elapsed" {...mobileLayoutProps('trackCurrentTime')}>
          {formatTime(boundedTime)}
        </time>
        <div
          className="pocketTrackFillAsset"
          aria-hidden="true"
          {...mobileLayoutProps('trackFill', { '--track-progress': `${progress}%` })}
        >
          <span className="pocketTrackFill" />
        </div>
        <div
          className="pocketTrackMarkerAsset"
          {...mobileLayoutProps('trackMarker', { '--track-progress': `${progress}%` })}
        >
          <img
            className="pocketTrackMarker"
            src={`${BASE}images/mobile/track-position-marker.png`}
            alt=""
            aria-hidden="true"
          />
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={boundedTime}
            disabled={!playbackTrack?.audio || !duration}
            onChange={seekTrack}
            aria-label="Seek through track"
          />
        </div>
        <time className="pocketTrackTime pocketTrackTime--duration" {...mobileLayoutProps('trackDuration')}>
          {formatTime(duration)}
        </time>

        <div className="pocketTrackHazardGlow" aria-hidden="true" {...mobileLayoutProps('hazardGlow')} />
        <div className="pocketEnvironmentGlobe" aria-hidden="true" {...mobileLayoutProps('environmentGlobe')} />
        <img
          className="pocketDirectorateSeal"
          src={`${BASE}images/mobile/directorate-seal.png`}
          alt=""
          aria-hidden="true"
          {...mobileLayoutProps('directorateSeal')}
        />
        <div className="pocketRadarSymbol" aria-hidden="true" {...mobileLayoutProps('radarSymbol')} />
        <div className="pocketRadarSweep" aria-hidden="true" {...mobileLayoutProps('radarSweep')} />

        <div className="pocketTransport" aria-label="Playback controls" {...mobileLayoutProps('transport')}>
          <button type="button" aria-label="Share track" onClick={handleShare}><Share2 /></button>
          <button type="button" aria-label="Previous track" onClick={() => stepTrack(-1)}><SkipBack /></button>
          <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay}>{playing ? <Pause /> : <Play />}</button>
          <button type="button" aria-label="Next track" onClick={() => stepTrack(1)}><SkipForward /></button>
          <button type="button" aria-label="Shuffle selection" onClick={randomTrack}><Shuffle /></button>
        </div>

        <nav className="pocketTabs" aria-label="Track information" {...mobileLayoutProps('tabs')}>
          {['transmission', 'lyrics', 'dossier'].map((pane) => (
            <button
              key={pane}
              type="button"
              className={activePane === pane ? 'active' : ''}
              onClick={() => setActivePane(pane)}
              aria-label={`Show ${pane}`}
            >{pane}</button>
          ))}
        </nav>

        <div
          className="pocketEnvironmentReadout"
          aria-label="Environment signal stability"
          {...mobileLayoutProps('environmentReadout')}
        >
          <span>ENVIRONMENT: <strong>{environmentStatus}</strong></span>
          <span>SIGNAL STABILITY: <strong>{signalStability}%</strong></span>
        </div>

        <div className="pocketWarning" aria-live="polite" {...mobileLayoutProps('warning')}>
          {cautionMessages[warningIndex] || ''}
        </div>

        <img
          className="pocketShell"
          src={`${BASE}images/mobile/pocket-filth-shell-v2.png`}
          alt=""
          {...mobileLayoutProps('shell')}
        />

        {mobileLayoutEditing && selectedMobileLayout ? (
          <div
            className="mobileLayoutSelection"
            style={{
              left: `${selectedMobileLayout.x}%`,
              top: `${selectedMobileLayout.y}%`,
              width: `${selectedMobileLayout.w}%`,
              height: `${selectedMobileLayout.h}%`,
            }}
            onPointerDown={(event) => startMobileLayoutGesture(event, selectedMobileLayoutId, 'move')}
            onPointerMove={updateMobileLayoutGesture}
            onPointerUp={finishMobileLayoutGesture}
            onPointerCancel={finishMobileLayoutGesture}
          >
            <span>{selectedMobileLayout.label}</span>
            <button
              type="button"
              aria-label={`Resize ${selectedMobileLayout.label}`}
              onPointerDown={(event) => startMobileLayoutGesture(event, selectedMobileLayoutId, 'resize')}
              onPointerMove={updateMobileLayoutGesture}
              onPointerUp={finishMobileLayoutGesture}
              onPointerCancel={finishMobileLayoutGesture}
            />
          </div>
        ) : null}

      </section>

      <button
        className={mobileLayoutEditing ? 'mobileLayoutEditorToggle active' : 'mobileLayoutEditorToggle'}
        type="button"
        onClick={() => setMobileLayoutEditing((editing) => !editing)}
      >
        {mobileLayoutEditing ? 'DONE' : 'EDIT LAYOUT'}
      </button>

      {mobileLayoutEditing ? (
        <aside
          className="mobileLayoutEditorPanel"
          aria-label="Pocket Filth layout editor"
          style={{ left: mobileEditorPosition.x, top: mobileEditorPosition.y }}
        >
          <header
            onPointerDown={startMobileEditorDrag}
            onPointerMove={updateMobileEditorDrag}
            onPointerUp={finishMobileEditorDrag}
            onPointerCancel={finishMobileEditorDrag}
          >
            <div>
              <small>POCKET CALIBRATION</small>
              <h2>LAYOUT EDITOR</h2>
            </div>
            <span>{mobileEditorNotice}</span>
          </header>

          <label className="mobileLayoutAssetSelect">
            <span>Asset</span>
            <select
              value={selectedMobileLayoutId}
              onChange={(event) => setSelectedMobileLayoutId(event.target.value)}
            >
              {Object.entries(mobileLayout).map(([id, item]) => (
                <option key={id} value={id}>{item.label}</option>
              ))}
            </select>
          </label>

          <p>Drag the outlined asset to move it. Drag the lower-right square to resize it. Drag this panel by its header.</p>

          <div className="mobileLayoutEditorFields">
            {[
              ['x', 'X'],
              ['y', 'Y'],
              ['w', 'Width'],
              ['h', 'Height'],
            ].map(([field, label]) => (
              <label key={field}>
                <span>{label}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.05"
                  value={selectedMobileLayout[field]}
                  onChange={(event) => updateSelectedMobileLayout(field, event.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.05"
                  value={selectedMobileLayout[field]}
                  onChange={(event) => updateSelectedMobileLayout(field, event.target.value)}
                />
              </label>
            ))}
          </div>

          <div className="mobileLayoutEditorActions">
            <button type="button" onClick={resetSelectedMobileLayout}>Reset asset</button>
            <button type="button" onClick={resetAllMobileLayout}>Reset all</button>
            <button type="button" onClick={copyMobileLayoutJson}>Copy JSON</button>
          </div>
        </aside>
      ) : null}

      <section
        className={`pocketLibraryDrawer${libraryOpen ? ' open' : ''}`}
        aria-hidden={!libraryOpen}
        onClick={closeLibrary}
      >
        <div className="pocketLibraryStage" onClick={(event) => event.stopPropagation()}>
          <div className="pocketLibraryList">
            {playlistMenuOpen ? (
              <div className="pocketPlaylistMenu">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    type="button"
                    onClick={() => {
                      setActiveTag(playlist.id);
                      setLibraryPage(1);
                      setPlaylistMenuOpen(false);
                    }}
                  >
                    <img
                      className="pocketPlaylistArt"
                      src={playlist.fallbackArt || defaultCover}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.src = playlist.fallbackArt || defaultCover;
                      }}
                    />
                    <span className="pocketPlaylistCopy">
                      <b>{playlist.title}</b>
                      <small>{playlist.count} tracks</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : pagedTracks.map((track) => (
              <div
                className={`pocketTrackRow${track.id === activeTrack?.id ? ' active' : ''}`}
                key={track.id}
                role="button"
                tabIndex="0"
                aria-label={`Play ${track.title}`}
                onClick={() => playLibraryTrack(track)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    playLibraryTrack(track);
                  }
                }}
              >
                <img
                  className="pocketTrackCover"
                  src={track.cover || defaultCover}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.src = defaultCover;
                  }}
                />
                <div className="pocketTrackSelect">
                  <b>{track.title}</b>
                  <span>{track.artist}</span>
                </div>
                <div className="pocketTrackPlay" aria-hidden="true" />
                <img className="pocketTrackShell" src={`${BASE}images/mobile/pocket-filth-track-row.png`} alt="" />
              </div>
            ))}
            {!playlistMenuOpen && !visibleTracks.length ? <p className="pocketNoTracks">NO CONTAINMENT RECORDS FOUND</p> : null}
          </div>

          <input
            className="pocketLibrarySearch"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLibraryPage(1);
            }}
            aria-label="Search tracks"
            placeholder="SEARCH..."
          />
          <button className="pocketLibraryClose" type="button" onClick={closeLibrary} aria-label="Close library" />
          <button
            className="pocketLibraryPlaylists"
            type="button"
            onClick={() => {
              setQuery('');
              setLibraryPage(1);
              setPlaylistMenuOpen((open) => !open);
            }}
            aria-label="Playlists"
          />
          <button
            className="pocketLibraryAll"
            type="button"
            onClick={() => {
              setQuery('');
              setActiveTag('ALL');
              setLibraryPage(1);
              setPlaylistMenuOpen(false);
            }}
            aria-label="All tracks"
          />
          <button
            className="pocketLibraryPrevious"
            type="button"
            disabled={libraryPage <= 1 || playlistMenuOpen}
            onClick={() => setLibraryPage((page) => Math.max(1, page - 1))}
            aria-label="Previous library page"
          />
          <button
            className="pocketLibraryNext"
            type="button"
            disabled={libraryPage >= totalLibraryPages || playlistMenuOpen}
            onClick={() => setLibraryPage((page) => Math.min(totalLibraryPages, page + 1))}
            aria-label="Next library page"
          />
          <span className="pocketLibraryPage">{libraryPage} / {totalLibraryPages}</span>
          <img className="pocketLibraryShell" src={`${BASE}images/mobile/pocket-filth-library.png`} alt="" />
        </div>
      </section>

      {shareNotice ? (
        <div className="pocketShareNotice" role="status">
          <strong>Song Link Copied!</strong>
          <span>{shareNotice}</span>
        </div>
      ) : null}
    </main>
  );
}
