import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PlayerIcon from '../components/PlayerIcon';
import { cautionMessages } from '../data/cautionMessages';
import './pocket-filth.css';

const ENVIRONMENT_STATUSES = ['STABLE', 'CONTAINED', 'PUTRID', 'AGGRESSIVE', 'HAZARDOUS'];
const LEVEL_METER_COLUMNS = [23, 39, 55];
const LEVEL_METER_ROWS = [15, 23, 32, 41, 50, 58, 67, 75];
const LEVEL_METER_WIDTH = 113.81;
const LEVEL_METER_HEIGHT = 86.91;
const MOBILE_DESIGN_WIDTH = 497;
const MOBILE_DESIGN_HEIGHT = 896;
const MOBILE_LAYOUT_STORAGE_KEY = 'stank-radio-pocket-layout-v4-pixels';
const DEFAULT_MOBILE_LAYOUT = {
  shell: { label: 'Mobile shell', x: 0, y: 0, w: 497, h: 896 },
  liveStatus: { label: 'Live containment status', x: 312.36, y: 50.05, w: 181.9, h: 78.18 },
  liveStatusLight: { label: 'STANDBY / ON AIR light', x: 347.4, y: 97.8, w: 104.87, h: 42.37 },
  libraryOpen: { label: 'Containment library control', x: 16.15, y: 155.9, w: 424.44, h: 69.89 },
  primaryDisplay: { label: 'Cover / information display', x: 20.13, y: 247.07, w: 463.7, h: 298.37 },
  nowPlaying: { label: 'Track information', x: 110.83, y: 547.01, w: 280.31, h: 72.13 },
  trackLevelMeter: { label: 'Track level meter', x: 379.21, y: 545.22, w: 113.81, h: 86.91 },
  trackCurrentTime: { label: 'Track time: elapsed', x: 15.41, y: 619.5, w: 77, h: 58.5 },
  trackFill: { label: 'Track progress: green line', x: 91.94, y: 637.59, w: 326.28, h: 6.45 },
  trackMarker: { label: 'Track progress: position button', x: 94.93, y: 634.37, w: 299.94, h: 15.41 },
  trackDuration: { label: 'Track time: duration', x: 411, y: 613, w: 77, h: 58.5 },
  hazardGlow: { label: 'Track hazard glow', x: 18.89, y: 546.11, w: 84.49, h: 72.58 },
  environmentGlobe: { label: 'Environment globe', x: 26.34, y: 795.65, w: 47.71, h: 45.7 },
  directorateSeal: { label: 'Directorate seal', x: 312.12, y: 791.5, w: 66.6, h: 57.51 },
  radarSymbol: { label: 'Radar symbol', x: 419.96, y: 795.2, w: 47.21, h: 47.94 },
  radarSweep: { label: 'Radar sweep', x: 419.22, y: 794.3, w: 47.21, h: 47.94 },
  transport: { label: 'Player controls', x: 22.36, y: 666.18, w: 455.75, h: 76.61 },
  tabs: { label: 'Information tabs', x: 17.39, y: 745.92, w: 462.21, h: 36.29 },
  environmentReadout: { label: 'Environment readout', x: 93.44, y: 788.93, w: 305.16, h: 60.93 },
  warning: { label: 'Warning message', x: 93.75, y: 853.75, w: 222.25, h: 34.05 },
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
  tracks,
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
  sharePlaylist,
}) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [playlistMenuOpen, setPlaylistMenuOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [activePane, setActivePane] = useState('transmission');
  const [shareNotice, setShareNotice] = useState('');
  const [shareNoticeType, setShareNoticeType] = useState('Song');
  const [trackMeterLevels, setTrackMeterLevels] = useState([1, 1, 1]);
  const [warningIndex, setWarningIndex] = useState(0);
  const [mobileLayoutEditing, setMobileLayoutEditing] = useState(false);
  const [selectedMobileLayoutId, setSelectedMobileLayoutId] = useState('primaryDisplay');
  const [mobileLayout, setMobileLayout] = useState(loadMobileLayout);
  const [mobileEditorNotice, setMobileEditorNotice] = useState('Saved locally');
  const [mobileEditorPosition, setMobileEditorPosition] = useState({ x: 12, y: 76 });
  const [mobileStageScale, setMobileStageScale] = useState(1);
  const pocketWrapperRef = useRef(null);
  const pocketConsoleRef = useRef(null);
  const mobileLayoutGestureRef = useRef(null);
  const mobileEditorDragRef = useRef(null);
  const [environmentStatus] = useState(
    () => ENVIRONMENT_STATUSES[Math.floor(Math.random() * ENVIRONMENT_STATUSES.length)],
  );
  const [signalStability, setSignalStability] = useState(() => 82 + Math.floor(Math.random() * 16));
  useLayoutEffect(() => {
    const wrapper = pocketWrapperRef.current;
    if (!wrapper) return undefined;

    const updateScale = () => {
      setMobileStageScale(wrapper.clientWidth / MOBILE_DESIGN_WIDTH || 1);
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

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
    setShareNoticeType('Song');
    setShareNotice(url);
    window.setTimeout(() => setShareNotice(''), 2600);
  }

  const selectedPlaylistTracks = selectedPlaylist
    ? tracks.filter((track) => track.playlists.includes(selectedPlaylist.id))
    : [];

  function handlePlaylistShare() {
    const url = sharePlaylist?.(selectedPlaylist);
    if (!url) return;
    setShareNoticeType('Playlist');
    setShareNotice(url);
    window.setTimeout(() => setShareNotice(''), 2600);
  }

  function playLibraryTrack(track) {
    selectTrack(track, true);
    setLibraryOpen(false);
  }

  function closeLibrary() {
    setQuery('');
    setSelectedPlaylist(null);
    setLibraryOpen(false);
  }

  function mobileLayoutProps(id, extraStyle = {}) {
    const item = mobileLayout[id] || DEFAULT_MOBILE_LAYOUT[id];
    return {
      'data-mobile-layout-id': id,
      style: {
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.w}px`,
        height: `${item.h}px`,
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

  function mobileTimeLayoutProps(id) {
    const item = mobileLayout[id] || DEFAULT_MOBILE_LAYOUT[id];
    // Keep the timestamps subordinate to the progress rail even when their
    // editable bounding boxes are enlarged in the layout editor.
    const fontSize = Math.max(9, Math.min(13, item.h * 0.3, item.w * 0.3));
    return mobileLayoutProps(id, { '--pocket-time-font-size': `${fontSize}px` });
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
    const deltaX = ((event.clientX - gesture.startX) / bounds.width) * MOBILE_DESIGN_WIDTH;
    const deltaY = ((event.clientY - gesture.startY) / bounds.height) * MOBILE_DESIGN_HEIGHT;
    const next = gesture.mode === 'resize'
      ? {
          ...gesture.item,
          w: Math.max(2, Math.min(MOBILE_DESIGN_WIDTH - gesture.item.x, gesture.item.w + deltaX)),
          h: Math.max(2, Math.min(MOBILE_DESIGN_HEIGHT - gesture.item.y, gesture.item.h + deltaY)),
        }
      : {
          ...gesture.item,
          x: Math.max(0, Math.min(MOBILE_DESIGN_WIDTH - gesture.item.w, gesture.item.x + deltaX)),
          y: Math.max(0, Math.min(MOBILE_DESIGN_HEIGHT - gesture.item.h, gesture.item.y + deltaY)),
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
    const limit = field === 'x' || field === 'w' ? MOBILE_DESIGN_WIDTH : MOBILE_DESIGN_HEIGHT;
    setMobileLayout((current) => ({
      ...current,
      [selectedMobileLayoutId]: {
        ...current[selectedMobileLayoutId],
        [field]: Math.max(0, Math.min(limit, number)),
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
  const trackFillProgress = (progress / 100) * 326.28;
  const trackMarkerProgress = (progress / 100) * 299.94;
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
      <div className="pocketConsoleWrapper" ref={pocketWrapperRef}>
        <section
          ref={pocketConsoleRef}
          className={`pocketConsole${mobileLayoutEditing ? ' mobileLayoutEditing' : ''}`}
          style={{ transform: `scale(${mobileStageScale})` }}
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
                )) : <p className="active pocketLyricsFallback">{lyricText}</p>}
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
                  left: `${(left / 85) * LEVEL_METER_WIDTH}px`,
                  top: `${(top / 96) * LEVEL_METER_HEIGHT}px`,
                  width: `${(10 / 85) * LEVEL_METER_WIDTH}px`,
                  height: `${(4 / 96) * LEVEL_METER_HEIGHT}px`,
                }}
              />
            );
          }))}
        </div>

        <time className="pocketTrackTime pocketTrackTime--elapsed" {...mobileTimeLayoutProps('trackCurrentTime')}>
          <span>{formatTime(boundedTime)}</span>
        </time>
        <div
          className="pocketTrackFillAsset"
          aria-hidden="true"
          {...mobileLayoutProps('trackFill', { '--track-progress-px': `${trackFillProgress}px` })}
        >
          <span className="pocketTrackFill" />
        </div>
        <div
          className="pocketTrackMarkerAsset"
          {...mobileLayoutProps('trackMarker', { '--track-progress-px': `${trackMarkerProgress}px` })}
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
        <time className="pocketTrackTime pocketTrackTime--duration" {...mobileTimeLayoutProps('trackDuration')}>
          <span>{formatTime(duration)}</span>
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
          <button type="button" className="playerButton" aria-label="Share track" onClick={handleShare}><PlayerIcon type="share" /></button>
          <button type="button" className="playerButton" aria-label="Previous track" onClick={() => stepTrack(-1)}><PlayerIcon type="previous" /></button>
          <button type="button" className={`playerButton playerButton--primary${playing ? ' is-active' : ''}`} aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay}><PlayerIcon type={playing ? 'pause' : 'play'} /></button>
          <button type="button" className="playerButton" aria-label="Next track" onClick={() => stepTrack(1)}><PlayerIcon type="next" /></button>
          <button type="button" className="playerButton" aria-label="Shuffle selection" onClick={randomTrack}><PlayerIcon type="shuffle" /></button>
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
              left: `${selectedMobileLayout.x}px`,
              top: `${selectedMobileLayout.y}px`,
              width: `${selectedMobileLayout.w}px`,
              height: `${selectedMobileLayout.h}px`,
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
      </div>


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
              ['x', 'X', MOBILE_DESIGN_WIDTH],
              ['y', 'Y', MOBILE_DESIGN_HEIGHT],
              ['w', 'Width', MOBILE_DESIGN_WIDTH],
              ['h', 'Height', MOBILE_DESIGN_HEIGHT],
            ].map(([field, label, max]) => (
              <label key={field}>
                <span>{label}</span>
                <input
                  type="range"
                  min="0"
                  max={max}
                  step="0.25"
                  value={selectedMobileLayout[field]}
                  onChange={(event) => updateSelectedMobileLayout(field, event.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max={max}
                  step="0.25"
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
                      setLibraryPage(1);
                      setSelectedPlaylist(playlist);
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
            ) : selectedPlaylist ? (
              <div className="pocketPlaylistDetail">
                <div className="pocketPlaylistDetailToolbar">
                  <button type="button" onClick={() => setSelectedPlaylist(null)}>BACK</button>
                  <strong>{selectedPlaylist.title}</strong>
                  <button type="button" onClick={handlePlaylistShare}>SHARE PLAYLIST</button>
                </div>
                <div className="pocketPlaylistTracks">
                  {selectedPlaylistTracks.map((track) => (
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
                      <img className="pocketTrackCover" src={track.cover || defaultCover} alt="" onError={(event) => { event.currentTarget.src = defaultCover; }} />
                      <div className="pocketTrackSelect"><b>{track.title}</b></div>
                      <div className="pocketTrackPlay" aria-hidden="true" />
                      <img className="pocketTrackShell" src={`${BASE}images/mobile/pocket-filth-track-row.png`} alt="" />
                    </div>
                  ))}
                </div>
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
                </div>
                <div className="pocketTrackPlay" aria-hidden="true" />
                <img className="pocketTrackShell" src={`${BASE}images/mobile/pocket-filth-track-row.png`} alt="" />
              </div>
            ))}
            {!playlistMenuOpen && !selectedPlaylist && !visibleTracks.length ? <p className="pocketNoTracks">NO CONTAINMENT RECORDS FOUND</p> : null}
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
              setSelectedPlaylist(null);
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
              setSelectedPlaylist(null);
              setPlaylistMenuOpen(false);
            }}
            aria-label="All tracks"
          />
          <button
            className="pocketLibraryPrevious"
            type="button"
            disabled={libraryPage <= 1 || playlistMenuOpen || selectedPlaylist}
            onClick={() => setLibraryPage((page) => Math.max(1, page - 1))}
            aria-label="Previous library page"
          />
          <button
            className="pocketLibraryNext"
            type="button"
            disabled={libraryPage >= totalLibraryPages || playlistMenuOpen || selectedPlaylist}
            onClick={() => setLibraryPage((page) => Math.min(totalLibraryPages, page + 1))}
            aria-label="Next library page"
          />
          <span className="pocketLibraryPage">{selectedPlaylist ? 'PLAYLIST' : `${libraryPage} / ${totalLibraryPages}`}</span>
          <img className="pocketLibraryShell" src={`${BASE}images/mobile/pocket-filth-library.png`} alt="" />
        </div>
      </section>

      {shareNotice ? (
        <div className="pocketShareNotice" role="status">
          <strong>{shareNoticeType} Link Copied!</strong>
          <span>{shareNotice}</span>
        </div>
      ) : null}
    </main>
  );
}
