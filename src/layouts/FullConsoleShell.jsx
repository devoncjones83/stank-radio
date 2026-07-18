import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ListMusic,
  Pause,
  Play,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react';

import './full-console-shell.css';

const LAYOUT_STORAGE_KEY = 'stank-radio-console-layout-v16';

const DEFAULT_CONSOLE_LAYOUT = {
  topLeftBiohazard: { label: 'Return to Directorate', x: 0.31, y: 0.7, w: 9.62, h: 15.9 },
  stankPanel: { label: 'Stank Radio panel', x: 9.83, y: 0, w: 26.05, h: 17.96 },
  frequencyPanel: { label: 'Frequency panel', x: 35.9, y: 0.76, w: 9.98, h: 15.79 },
  liveContainmentPanel: { label: 'Live containment panel', x: 45.43, y: 0.54, w: 18.12, h: 16.67 },
  systemHealthPanel: { label: 'System health panel', x: 62.73, y: 0.65, w: 11.23, h: 16.34 },
  transmitterStatusPanel: { label: 'Transmitter status panel', x: 73.6, y: 1.2, w: 9.3, h: 14.8 },
  diagnosticsPanel: { label: 'Diagnostics panel', x: 83.03, y: 0.76, w: 8.42, h: 15.46 },
  topRightSector: { label: 'Top-right sector', x: 91.69, y: 1.54, w: 7.51, h: 14.37 },
  environmentTitle: { label: 'Environment Monitor title', x: 1.98, y: 18.67, w: 10, h: 4.14 },
  environmentContainment: { label: 'Monitor: containment', x: 0, y: 22.76, w: 13.84, h: 11.55 },
  environmentSignal: { label: 'Monitor: signal', x: 0, y: 32.55, w: 13.75, h: 14.73 },
  environmentNoise: { label: 'Monitor: noise', x: 0.05, y: 45.12, w: 14.12, h: 13.21 },
  environmentPressure: { label: 'Monitor: pressure', x: 0, y: 55.62, w: 14.2, h: 11.99 },
  roomTonePanel: { label: 'Room tone panel', x: 1.4, y: 67.85, w: 11.7, h: 18.7 },
  cover: { label: 'Cover art', x: 14.95, y: 19.15, w: 26.2, h: 51.7 },
  scope: { label: 'Scope', x: 39.27, y: 57.07, w: 31.92, h: 15.48 },
  trackData: { label: 'Track data', x: 42.27, y: 18.4, w: 26.15, h: 17.58 },
  lyrics: { label: 'Lyrics', x: 42.63, y: 37.67, w: 25.83, h: 20.27 },
  library: { label: 'Track library', x: 68.25, y: 18.2, w: 31.8, h: 77.65 },
  libraryTitle: { label: 'Library: title', x: 69, y: 18.45, w: 29.1, h: 4.4 },
  librarySearch: { label: 'Library: search', x: 70.9, y: 24.85, w: 13.8, h: 4.35 },
  libraryPlaylists: { label: 'Library: playlists', x: 86.35, y: 24.55, w: 5.45, h: 5.1 },
  libraryAllTracks: { label: 'Library: all tracks', x: 92.45, y: 24.85, w: 5.45, h: 5.1 },
  pagePrevious: { label: 'Pagination: previous', x: 77, y: 82.5, w: 2.8, h: 4.2 },
  pageIndicator: { label: 'Pagination: indicator', x: 80.5, y: 82.1, w: 6.9, h: 5.2 },
  pageNext: { label: 'Pagination: next', x: 88.05, y: 82.5, w: 2.8, h: 4.45 },
  previous: { label: 'Previous control', x: 15.3, y: 75, w: 5.25, h: 9.9 },
  play: { label: 'Play control', x: 22.8, y: 75, w: 5.65, h: 9.9 },
  next: { label: 'Next control', x: 30.4, y: 75, w: 5.25, h: 9.9 },
  shuffle: { label: 'Shuffle control', x: 37.2, y: 75, w: 5.25, h: 9.9 },
  share: { label: 'Share control', x: 43.05, y: 75, w: 5.25, h: 9.9 },
  outputLeftMeter: { label: 'Output meter: left', x: 51, y: 76.45, w: 7.45, h: 7.85 },
  outputRightMeter: { label: 'Output meter: right', x: 59.32, y: 76.45, w: 7.7, h: 7.85 },
  outputLeftNeedle: { label: 'Output needle: left', x: 50.9, y: 76.75, w: 7.45, h: 7.85 },
  outputRightNeedle: { label: 'Output needle: right', x: 59.32, y: 76.75, w: 7.7, h: 7.85 },
  directoratePlate: { label: 'Directorate property plate', x: 75.5, y: 84.25, w: 27.25, h: 8.15 },
};

function createDefaultLayout() {
  return Object.fromEntries(
    Object.entries(DEFAULT_CONSOLE_LAYOUT).map(([id, item]) => [id, { ...item }]),
  );
}

function loadSavedLayout() {
  const defaults = createDefaultLayout();

  try {
    const saved = JSON.parse(window.localStorage.getItem(LAYOUT_STORAGE_KEY) || '{}');
    Object.keys(defaults).forEach((id) => {
      if (saved[id]) defaults[id] = { ...defaults[id], ...saved[id] };
    });
    if (defaults.environmentSignal.w <= 0 || defaults.environmentSignal.h <= 0) {
      defaults.environmentSignal = { ...DEFAULT_CONSOLE_LAYOUT.environmentSignal };
    }
  } catch {
    // Invalid local editor data should never prevent the radio from loading.
  }

  return defaults;
}

function IndicatorLamp({ state = 'inactive' }) {
  return (
    <span
      className={`environment-indicator__lamp environment-indicator__lamp--${state}`}
      aria-hidden="true"
    />
  );
}

function IndicatorRow({ id, label, value, max = 7, state = 'active' }) {
  const safeValue = Math.max(0, Math.min(value, max));

  return (
    <div
      className={`environment-indicator__row environment-indicator__row--${id}`}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={safeValue}
    >
      {Array.from({ length: max }, (_, index) => (
        <IndicatorLamp key={index} state={index < safeValue ? state : 'inactive'} />
      ))}
    </div>
  );
}

function EnvironmentMonitor({ metrics, levels, layoutProps }) {
  return metrics.map((metric) => (
    <div
      key={metric.id}
      className={`consoleOverlay consoleEnvironmentItem environment-monitor environment-monitor--${metric.metricId}`}
      {...layoutProps(metric.id)}
    >
      <img src={metric.image} alt="" draggable={false} />
      <IndicatorRow
        id={metric.metricId}
        label={metric.label}
        value={levels[metric.id] || 0}
        max={metric.max}
      />
    </div>
  ));
}

export default function FullConsoleShell({
  BASE,
  defaultCover,
  audioRef,
  lyricLineRefs,
  activeTrack,
  displayTrack,
  pagedTracks,
  visibleTracks,
  query,
  playing,
  hasActiveAudio,
  currentLyrics,
  activeLyricIndex,
  libraryPage,
  totalLibraryPages,
  roomTone,
  playlists,
  playlistsOpen,
  setPlaylistsOpen,
  setActiveTag,
  setQuery,
  setLibraryPage,
  selectTrack,
  togglePlay,
  stepTrack,
  randomTrack,
  shareTrack,
  updatePlaybackTime,
  setPlaying,
}) {
  const shellImage = `${BASE}images/production/stank-radio-console-shell-v8.png`;
  const backgroundImage = `${BASE}images/production/stank-radio-console-background.png`;
  const stankPanelImage = `${BASE}images/production/stank-radio-panel-v2.png`;
  const returnPanelImage = `${BASE}images/production/return-to-directorate-panel.png`;
  const roomTonePanelImage = `${BASE}images/production/room-tone-panel.png`;
  const sectorPanelImage = `${BASE}images/production/sector-panel.png`;
  const outputMeterImage = `${BASE}images/production/vu-meter-face-v2.png`;
  const outputNeedleImage = `${BASE}images/production/output-needle.png`;
  const auxiliaryPanels = [
    { id: 'frequencyPanel', label: 'Frequency', image: `${BASE}images/production/frequency-panel.png` },
    { id: 'liveContainmentPanel', label: 'Live containment', image: `${BASE}images/production/live-containment-panel.png` },
    { id: 'systemHealthPanel', label: 'System health', image: `${BASE}images/production/system-health-panel.png` },
    { id: 'transmitterStatusPanel', label: 'Transmitter status', image: `${BASE}images/production/transmitter-status-panel.png` },
    { id: 'diagnosticsPanel', label: 'Diagnostics', image: `${BASE}images/production/diagnostics-panel.png` },
  ];
  const [layoutEditing, setLayoutEditing] = useState(false);
  const [selectedLayoutId, setSelectedLayoutId] = useState('library');
  const [layout, setLayout] = useState(loadSavedLayout);
  const [environmentLevels, setEnvironmentLevels] = useState({});
  const [editorNotice, setEditorNotice] = useState('Saved locally');
  const [editorPosition, setEditorPosition] = useState(() => ({
    x: Math.max(18, window.innerWidth - 408),
    y: 18,
  }));
  const stageRef = useRef(null);
  const editorPanelRef = useRef(null);
  const layoutGestureRef = useRef(null);
  const editorGestureRef = useRef(null);
  const selectedLayout = layout[selectedLayoutId] || DEFAULT_CONSOLE_LAYOUT[selectedLayoutId];
  const environmentItems = [
    {
      id: 'environmentContainment',
      metricId: 'containment',
      label: 'Containment',
      max: 7,
      image: `${BASE}images/production/environment-containment.png`,
    },
    {
      id: 'environmentSignal',
      metricId: 'signal',
      label: 'Signal Strength',
      max: 7,
      image: `${BASE}images/production/environment-signal.png`,
    },
    {
      id: 'environmentNoise',
      metricId: 'noise',
      label: 'Background Noise',
      max: 7,
      image: `${BASE}images/production/environment-noise.png`,
    },
    {
      id: 'environmentPressure',
      metricId: 'pressure',
      label: 'Pressure Level',
      max: 7,
      activeMax: 6,
      image: `${BASE}images/production/environment-pressure.png`,
    },
  ];

  useEffect(() => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
    setEditorNotice('Saved locally');
  }, [layout]);

  useEffect(() => {
    if (!playing) {
      setEnvironmentLevels({});
      return;
    }

    setEnvironmentLevels(Object.fromEntries(
      environmentItems.map((item) => [
        item.id,
        Math.floor(Math.random() * (item.activeMax || item.max)) + 1,
      ]),
    ));
  }, [playing, activeTrack?.id]);

  function layoutProps(id) {
    const item = layout[id] || DEFAULT_CONSOLE_LAYOUT[id];
    return {
      'data-layout-id': id,
      'data-layout-selected': id === selectedLayoutId ? 'true' : undefined,
      style: {
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.w}%`,
        height: `${item.h}%`,
      },
      onPointerDown: (event) => {
        if (!layoutEditing) return;
        startLayoutGesture(event, id, 'move');
      },
      onPointerMove: updateLayoutGesture,
      onPointerUp: finishLayoutGesture,
      onPointerCancel: finishLayoutGesture,
    };
  }

  function startLayoutGesture(event, id, mode) {
    if (!layoutEditing) return;
    const item = layout[id] || DEFAULT_CONSOLE_LAYOUT[id];
    event.preventDefault();
    event.stopPropagation();
    setSelectedLayoutId(id);
    layoutGestureRef.current = {
      id,
      mode,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      item: { ...item },
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function updateLayoutGesture(event) {
    const gesture = layoutGestureRef.current;
    const stage = stageRef.current?.getBoundingClientRect();
    if (!gesture || gesture.pointerId !== event.pointerId || !stage) return;
    event.preventDefault();
    event.stopPropagation();

    const dx = ((event.clientX - gesture.startX) / stage.width) * 100;
    const dy = ((event.clientY - gesture.startY) / stage.height) * 100;
    const round = (value) => Math.round(value * 100) / 100;
    let next;

    if (gesture.mode === 'resize') {
      next = {
        ...gesture.item,
        w: round(Math.max(0.5, Math.min(100 - gesture.item.x, gesture.item.w + dx))),
        h: round(Math.max(0.5, Math.min(100 - gesture.item.y, gesture.item.h + dy))),
      };
    } else {
      next = {
        ...gesture.item,
        x: round(Math.max(0, Math.min(100 - gesture.item.w, gesture.item.x + dx))),
        y: round(Math.max(0, Math.min(100 - gesture.item.h, gesture.item.y + dy))),
      };
    }

    setEditorNotice('Saving...');
    setLayout((current) => ({ ...current, [gesture.id]: next }));
  }

  function finishLayoutGesture(event) {
    const gesture = layoutGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    layoutGestureRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function startEditorDrag(event) {
    const panel = editorPanelRef.current?.getBoundingClientRect();
    if (!panel) return;
    event.preventDefault();
    editorGestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panelX: panel.left,
      panelY: panel.top,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function updateEditorDrag(event) {
    const gesture = editorGestureRef.current;
    const panel = editorPanelRef.current?.getBoundingClientRect();
    if (!gesture || gesture.pointerId !== event.pointerId || !panel) return;
    event.preventDefault();
    setEditorPosition({
      x: Math.max(0, Math.min(window.innerWidth - panel.width, gesture.panelX + event.clientX - gesture.startX)),
      y: Math.max(0, Math.min(window.innerHeight - panel.height, gesture.panelY + event.clientY - gesture.startY)),
    });
  }

  function finishEditorDrag(event) {
    if (editorGestureRef.current?.pointerId !== event.pointerId) return;
    editorGestureRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function updateSelectedLayout(field, value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    setEditorNotice('Saving...');
    setLayout((current) => ({
      ...current,
      [selectedLayoutId]: {
        ...current[selectedLayoutId],
        [field]: Math.max(0, Math.min(100, numericValue)),
      },
    }));
  }

  function resetSelectedLayout() {
    setLayout((current) => ({
      ...current,
      [selectedLayoutId]: { ...DEFAULT_CONSOLE_LAYOUT[selectedLayoutId] },
    }));
  }

  function resetAllLayout() {
    setLayout(createDefaultLayout());
    setSelectedLayoutId('library');
  }

  function copyLayoutJson() {
    navigator.clipboard
      ?.writeText(JSON.stringify(layout, null, 2))
      .then(() => setEditorNotice('Layout JSON copied'))
      .catch(() => setEditorNotice('Copy unavailable'));
  }

  return (
    <main className={playing ? 'fullConsolePage isPlaying' : 'fullConsolePage'}>
      <section
        ref={stageRef}
        className={layoutEditing ? 'fullConsoleStage layoutEditing' : 'fullConsoleStage'}
        aria-label="STANK Radio broadcast console"
        onClickCapture={(event) => {
          if (!layoutEditing) return;
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <img
          className="fullConsoleBackground"
          src={backgroundImage}
          alt=""
          draggable={false}
        />

        <img
          className="fullConsoleHardware"
          src={shellImage}
          alt=""
          draggable={false}
        />

        <img
          className="consoleOverlay consoleStankPanel"
          src={stankPanelImage}
          alt="Stank Radio"
          draggable={false}
          {...layoutProps('stankPanel')}
        />

        {auxiliaryPanels.map((panel) => (
          <img
            key={panel.id}
            className="consoleOverlay consolePanelAsset consoleAuxiliaryPanel"
            src={panel.image}
            alt={panel.label}
            draggable={false}
            {...layoutProps(panel.id)}
          />
        ))}

        <a
          className="consoleOverlay consoleReturnPanel"
          href="/"
          aria-label="Return to the Directorate"
          {...layoutProps('topLeftBiohazard')}
        >
          <img src={returnPanelImage} alt="" draggable={false} />
        </a>

        <div
          className="consoleOverlay consolePanelAsset consoleSectorPanel"
          aria-label="Sector monitor"
          {...layoutProps('topRightSector')}
        >
          <img src={sectorPanelImage} alt="" draggable={false} />
          <span className="consoleRadarSweep" aria-hidden="true" />
        </div>

        <img
          className="consoleOverlay consolePanelAsset"
          src={roomTonePanelImage}
          alt="Room tone control"
          draggable={false}
          {...layoutProps('roomTonePanel')}
        />

        <h2
          className="consoleOverlay consoleEnvironmentTitle"
          {...layoutProps('environmentTitle')}
        >
          Environment Monitor
        </h2>

        <EnvironmentMonitor
          metrics={environmentItems}
          levels={environmentLevels}
          layoutProps={layoutProps}
        />

        <img
          className="consoleOverlay consolePanelAsset consoleOutputMeter"
          src={outputMeterImage}
          alt="Left output level"
          draggable={false}
          {...layoutProps('outputLeftMeter')}
        />

        <img
          className="consoleOverlay consolePanelAsset consoleOutputMeter"
          src={outputMeterImage}
          alt="Right output level"
          draggable={false}
          {...layoutProps('outputRightMeter')}
        />

        <div
          className="consoleOverlay consoleOutputNeedle left"
          aria-hidden="true"
          {...layoutProps('outputLeftNeedle')}
        >
          <img src={outputNeedleImage} alt="" draggable={false} />
        </div>

        <div
          className="consoleOverlay consoleOutputNeedle right"
          aria-hidden="true"
          {...layoutProps('outputRightNeedle')}
        >
          <img src={outputNeedleImage} alt="" draggable={false} />
        </div>

        <div className="consoleOverlay consoleCover" {...layoutProps('cover')}>
          <img
            src={displayTrack.cover || defaultCover}
            alt={activeTrack ? `${displayTrack.title} cover art` : ''}
          />
        </div>

        <div className="consoleOverlay consoleScope" aria-hidden="true" {...layoutProps('scope')}>
          <div className="consoleScopeTrace">
            {roomTone.bars.concat(roomTone.bars).map((height, index) => (
              <i
                key={index}
                style={{ '--scope-height': `${Math.max(14, height)}%` }}
              />
            ))}
          </div>
        </div>

        <section
          className="consoleOverlay consoleTrackData"
          aria-label="Current transmission"
          {...layoutProps('trackData')}
        >
          <small>{playing ? 'NOW LEAKING' : activeTrack ? 'LEAK ARMED' : 'STANDBY'}</small>
          <h1>{activeTrack ? displayTrack.title : 'NO TRANSMISSION SELECTED'}</h1>
          <h2>{displayTrack.artist}</h2>
          <p>{displayTrack.description}</p>
        </section>

        <section className="consoleOverlay consoleLyrics" aria-label="Lyrics" {...layoutProps('lyrics')}>
          <div className="consoleLyricsScroll">
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
              <div className="consoleEmptyMessage">
                <b>{activeTrack ? 'LYRIC DATA NOT AVAILABLE' : 'AWAITING TRANSMISSION'}</b>
                <span>
                  {activeTrack
                    ? 'No synchronized contamination transcript found.'
                    : 'Select an audio contaminant from the archive.'}
                </span>
              </div>
            )}
          </div>
        </section>

        <h2
          className="consoleOverlay consoleLibraryTitle"
          {...layoutProps('libraryTitle')}
        >
          Containment Library
        </h2>

        <label
          className="consoleOverlay consoleSearch"
          {...layoutProps('librarySearch')}
        >
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLibraryPage(1);
            }}
            placeholder="SEARCH..."
          />
        </label>

        <button
          className="consoleOverlay consoleLibraryAction"
          type="button"
          onClick={() => {
            setQuery('');
            setLibraryPage(1);
            setPlaylistsOpen(true);
          }}
          {...layoutProps('libraryPlaylists')}
        >
          <ListMusic size={13} />
          Playlists
        </button>

        <button
          className="consoleOverlay consoleLibraryAction"
          type="button"
          onClick={() => {
            setActiveTag('ALL');
            setQuery('');
            setLibraryPage(1);
          }}
          {...layoutProps('libraryAllTracks')}
        >
          All Tracks
        </button>

        <aside
          className="consoleOverlay consoleLibrary"
          aria-label="Transmission library"
          {...layoutProps('library')}
        >
          <div className="consoleTrackList">
            {pagedTracks.map((track) => (
              <button
                key={track.id}
                type="button"
                className={track.id === activeTrack?.id ? 'active' : ''}
                onClick={() => selectTrack(track, false)}
              >
                <img src={track.cover || defaultCover} alt="" />
                <span>
                  <b>{track.title}</b>
                  <small>{track.artist}</small>
                </span>
              </button>
            ))}

            {!visibleTracks.length ? (
              <p className="consoleNoResults">NO MATCHING CONTAMINANTS</p>
            ) : null}
          </div>

        </aside>

        <nav className="consolePaginationGroup" aria-label="Library pages">
          <button
            className="consoleOverlay consolePaginationAsset"
            type="button"
            aria-label="Previous page"
            disabled={libraryPage <= 1}
            onClick={() => setLibraryPage((page) => Math.max(1, page - 1))}
            {...layoutProps('pagePrevious')}
          >
            <ChevronLeft size={24} strokeWidth={3.25} />
          </button>

          <span
            className="consoleOverlay consolePaginationAsset consolePageIndicator"
            {...layoutProps('pageIndicator')}
          >
            {libraryPage} / {totalLibraryPages}
          </span>

          <button
            className="consoleOverlay consolePaginationAsset"
            type="button"
            aria-label="Next page"
            disabled={libraryPage >= totalLibraryPages}
            onClick={() =>
              setLibraryPage((page) => Math.min(totalLibraryPages, page + 1))
            }
            {...layoutProps('pageNext')}
          >
            <ChevronRight size={24} strokeWidth={3.25} />
          </button>
        </nav>

        <section
          className="consoleOverlay consoleDirectoratePlate"
          aria-label="Property of the Directorate"
          {...layoutProps('directoratePlate')}
        >
          <strong>PROPERTY OF THE DIRECTORATE</strong>
          <div className="consoleDirectorateBarcode" aria-hidden="true" />
        </section>

        <div className="consoleTransport" aria-label="Playback controls">
          <button
            className="transportPrevious"
            type="button"
            onClick={() => stepTrack(-1)}
            aria-label="Previous track"
            {...layoutProps('previous')}
          >
            <SkipBack />
          </button>

          <button
            className="transportPlay"
            type="button"
            onClick={togglePlay}
            disabled={!hasActiveAudio}
            aria-label={playing ? 'Pause' : 'Play'}
            {...layoutProps('play')}
          >
            {playing ? <Pause /> : <Play />}
          </button>

          <button
            className="transportNext"
            type="button"
            onClick={() => stepTrack(1)}
            aria-label="Next track"
            {...layoutProps('next')}
          >
            <SkipForward />
          </button>

          <button
            className="transportShuffle"
            type="button"
            onClick={randomTrack}
            aria-label="Random track"
            {...layoutProps('shuffle')}
          >
            <Shuffle />
          </button>

          <button
            className="transportShare"
            type="button"
            onClick={shareTrack}
            aria-label="Share track"
            {...layoutProps('share')}
          >
            <Share2 />
          </button>
        </div>

        <audio
          ref={audioRef}
          src={activeTrack?.audio || undefined}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={updatePlaybackTime}
          onEnded={() => stepTrack(1)}
        />

        {layoutEditing && selectedLayout ? (
          <button
            className="layoutAssetResizeHandle"
            type="button"
            aria-label={`Resize ${selectedLayout.label}`}
            title={`Resize ${selectedLayout.label}`}
            style={{
              left: `calc(${selectedLayout.x + selectedLayout.w}% - 8px)`,
              top: `calc(${selectedLayout.y + selectedLayout.h}% - 8px)`,
            }}
            onPointerDown={(event) => startLayoutGesture(event, selectedLayoutId, 'resize')}
            onPointerMove={updateLayoutGesture}
            onPointerUp={finishLayoutGesture}
            onPointerCancel={finishLayoutGesture}
          />
        ) : null}
      </section>

      <button
        className={layoutEditing ? 'layoutEditorToggle active' : 'layoutEditorToggle'}
        type="button"
        onClick={() => setLayoutEditing((editing) => !editing)}
      >
        {layoutEditing ? 'DONE EDITING' : 'EDIT LAYOUT'}
      </button>

      {layoutEditing ? (
        <aside
          ref={editorPanelRef}
          className="layoutEditorPanel"
          aria-label="Console layout editor"
          style={{ left: editorPosition.x, top: editorPosition.y }}
        >
          <header
            onPointerDown={startEditorDrag}
            onPointerMove={updateEditorDrag}
            onPointerUp={finishEditorDrag}
            onPointerCancel={finishEditorDrag}
          >
            <div>
              <small>CONSOLE CALIBRATION</small>
              <h2>LAYOUT EDITOR</h2>
            </div>
            <span>{editorNotice}</span>
          </header>

          <label className="layoutEditorAssetSelect">
            <span>Asset</span>
            <select
              value={selectedLayoutId}
              onChange={(event) => setSelectedLayoutId(event.target.value)}
            >
              {Object.entries(layout).map(([id, item]) => (
                <option key={id} value={id}>{item.label}</option>
              ))}
            </select>
          </label>

          <p className="layoutEditorHint">Drag an asset to move it. Drag its square handle to resize it. Drag this panel by its header.</p>

          <div className="layoutEditorFields">
            {[
              ['x', 'X position'],
              ['y', 'Y position'],
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
                  value={selectedLayout[field]}
                  onChange={(event) => updateSelectedLayout(field, event.target.value)}
                />
                <input
                  className="layoutEditorNumber"
                  type="number"
                  min="0"
                  max="100"
                  step="0.05"
                  value={selectedLayout[field]}
                  onChange={(event) => updateSelectedLayout(field, event.target.value)}
                />
              </label>
            ))}
          </div>

          <div className="layoutEditorActions">
            <button type="button" onClick={resetSelectedLayout}>Reset asset</button>
            <button type="button" onClick={resetAllLayout}>Reset all</button>
            <button type="button" onClick={copyLayoutJson}>Copy JSON</button>
          </div>
        </aside>
      ) : null}

      {playlistsOpen ? (
        <section className="consoleModal" role="dialog" aria-modal="true" aria-label="Playlists">
          <div className="consoleModalPanel">
            <header>
              <div>
                <small>ARCHIVE CLASSIFICATION</small>
                <h2>PLAYLISTS</h2>
              </div>
              <button type="button" onClick={() => setPlaylistsOpen(false)}>
                Close
              </button>
            </header>

            <div className="consolePlaylistGrid">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  type="button"
                  onClick={() => {
                    setActiveTag(playlist.id);
                    setQuery('');
                    setLibraryPage(1);
                    setPlaylistsOpen(false);
                  }}
                >
                  <img
                    src={playlist.art}
                    alt=""
                    onError={(event) => {
                      if (event.currentTarget.dataset.fallbackApplied) return;
                      event.currentTarget.dataset.fallbackApplied = '1';
                      event.currentTarget.src = playlist.fallbackArt;
                    }}
                  />
                  <span>
                    <b>{playlist.title}</b>
                    <small>{playlist.count} tracks</small>
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
