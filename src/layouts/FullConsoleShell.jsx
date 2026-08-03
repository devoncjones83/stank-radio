import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react';

import CautionPanel from '../components/CautionPanel';
import { cautionMessages } from '../data/cautionMessages';
import './full-console-shell.css';

const LAYOUT_STORAGE_KEY = 'stank-radio-console-layout-v23';
const DESKTOP_CANVAS_WIDTH = 1672;
const DESKTOP_CANVAS_HEIGHT = 941;

const DEFAULT_CONSOLE_LAYOUT = {
  topLeftBiohazard: { label: 'Return to Directorate', x: 0.31, y: 0.7, w: 9.62, h: 15.9 },
  stankPanel: { label: 'Stank Radio panel', x: 9.83, y: 0, w: 26.05, h: 17.96 },
  frequencyPanel: { label: 'Frequency panel', x: 35.9, y: 0.76, w: 9.98, h: 15.79 },
  liveContainmentPanel: { label: 'Live containment panel', x: 45.43, y: 0.54, w: 18.12, h: 16.67 },
  liveContainmentMasterLight: { label: 'Live containment: master lamp', x: 46.5, y: 4, w: 1.39, h: 2.52 },
  liveContainmentTxLight: { label: 'Live containment: TX Active lamp', x: 47, y: 12.3, w: 0.82, h: 1.15 },
  liveContainmentSignalLight: { label: 'Live containment: Signal Lock lamp', x: 52.25, y: 12.3, w: 0.8, h: 1.2 },
  liveContainmentSafeLight: { label: 'Live containment: Safe Mode lamp', x: 57.8, y: 12.25, w: 0.82, h: 1.15 },
  liveContainmentOnAir: { label: 'Live containment: ON AIR lamp', x: 58.8, y: 3.64, w: 3.17, h: 4.92 },
  systemHealthPanel: { label: 'System health panel', x: 62.73, y: 0.65, w: 11.23, h: 16.34 },
  transmitterStatusPanel: { label: 'Transmitter status panel', x: 73.49, y: 1.32, w: 9.56, h: 17.32 },
  diagnosticsPanel: { label: 'Diagnostics panel', x: 83.03, y: 0.76, w: 8.42, h: 15.46 },
  topRightSector: { label: 'Top-right sector', x: 91.69, y: 1.54, w: 7.51, h: 14.37 },
  environmentTitle: { label: 'Environment Monitor title', x: 0.65, y: 18.25, w: 12.7, h: 6 },
  environmentContainment: { label: 'Monitor: containment', x: 0.2, y: 24.02, w: 14.4, h: 9.89 },
  environmentSignal: { label: 'Monitor: signal', x: 0.68, y: 34.45, w: 13, h: 10.73 },
  environmentNoise: { label: 'Monitor: noise', x: 0.5, y: 45.6, w: 12.95, h: 11.7 },
  environmentPressure: { label: 'Monitor: pressure', x: 0.25, y: 55.65, w: 14.4, h: 12.32 },
  roomTonePanel: { label: 'Room tone panel', x: 0.62, y: 66.38, w: 13.22, h: 22.43 },
  cover: { label: 'Cover art', x: 14.95, y: 19.15, w: 26.2, h: 51.7 },
  scopeGrid: { label: 'Scope: signal grid', x: 42.08, y: 56.96, w: 26.97, h: 14.82 },
  scope: { label: 'Scope', x: 39.75, y: 57.84, w: 31.55, h: 15.48 },
  trackData: { label: 'Track data', x: 42, y: 17.4, w: 26.95, h: 19.35 },
  transmissionSignalMeter: { label: 'Transmission status: signal strength meter', x: 43.35, y: 20.05, w: 3.75, h: 10.2 },
  transmissionReadout: { label: 'Transmission status: primary readout', x: 46.55, y: 20.5, w: 17.3, h: 10.85 },
  transmissionContainmentMeter: { label: 'Transmission status: containment meter', x: 63.95, y: 20.05, w: 3.75, h: 10.2 },
  transmissionArchive: { label: 'Transmission status: archive field', x: 43.25, y: 31.45, w: 4.05, h: 4.2 },
  transmissionSignalLock: { label: 'Transmission status: signal lock field', x: 47.4, y: 31.45, w: 4.05, h: 4.2 },
  transmissionContainment: { label: 'Transmission status: containment field', x: 51.55, y: 31.45, w: 4.05, h: 4.2 },
  transmissionRuntime: { label: 'Transmission status: runtime field', x: 55.7, y: 31.45, w: 4.05, h: 4.2 },
  transmissionIntegrity: { label: 'Transmission status: integrity field', x: 59.85, y: 31.45, w: 4.05, h: 4.2 },
  transmissionNext: { label: 'Transmission status: next transmission field', x: 64, y: 31.45, w: 4.05, h: 4.2 },
  lyrics: { label: 'Lyrics', x: 42.05, y: 36.8, w: 26.85, h: 21.9 },
  library: { label: 'Track library', x: 68.4, y: 20.6, w: 31.6, h: 75.35 },
  libraryTitle: { label: 'Library: title', x: 69.7, y: 18.15, w: 29.45, h: 5.15 },
  librarySearch: { label: 'Library: search', x: 70.9, y: 24.85, w: 13.8, h: 4.35 },
  libraryPlaylists: { label: 'Library: playlists', x: 85.95, y: 24.05, w: 6.1, h: 6 },
  libraryAllTracks: { label: 'Library: all tracks', x: 92.3, y: 24.05, w: 6.1, h: 6 },
  pagePrevious: { label: 'Pagination: previous', x: 77, y: 82.5, w: 2.8, h: 4.2 },
  pageIndicator: { label: 'Pagination: indicator', x: 80.5, y: 82.1, w: 6.9, h: 5.2 },
  pageNext: { label: 'Pagination: next', x: 88.05, y: 82.5, w: 2.8, h: 4.45 },
  share: { label: 'Share control', x: 15.3, y: 75, w: 5.25, h: 9.9 },
  previous: { label: 'Previous control', x: 22.8, y: 75, w: 5.25, h: 9.9 },
  play: { label: 'Play control', x: 30.4, y: 75, w: 5.65, h: 9.9 },
  next: { label: 'Next control', x: 37.2, y: 75, w: 5.25, h: 9.9 },
  shuffle: { label: 'Shuffle control', x: 43.05, y: 75, w: 5.25, h: 9.9 },
  outputLeftMeter: { label: 'Output meter: left', x: 51, y: 76.45, w: 7.45, h: 7.85 },
  outputRightMeter: { label: 'Output meter: right', x: 59.32, y: 76.45, w: 7.7, h: 7.85 },
  outputLeftNeedle: { label: 'Output needle: left', x: 51.2, y: 77.7, w: 7.45, h: 7.85 },
  outputRightNeedle: { label: 'Output needle: right', x: 59.5, y: 77.7, w: 7.7, h: 7.85 },
  directoratePlate: { label: 'Directorate property plate', x: 75.65, y: 86.3, w: 27.06, h: 6.4 },
  cautionPanel1: { label: 'Caution panel 1', x: 0.2, y: 90.25, w: 19.2, h: 8.2 },
  cautionPanel2: { label: 'Caution panel 2', x: 19.9, y: 90.25, w: 19.2, h: 8.31 },
  cautionPanel3: { label: 'Caution panel 3', x: 39.38, y: 90.25, w: 19.2, h: 8.2 },
  cautionPanel4: { label: 'Caution panel 4', x: 58.4, y: 90.25, w: 19.2, h: 8.2 },
  playlistModalClose: { label: 'Playlist modal: close control', x: 94.67, y: 2.2, w: 4.2, h: 7.45 },
  playlistModalRows: { label: 'Playlist modal: playlist rows', x: 10.41, y: 24.99, w: 78.07, h: 59.31 },
  playlistModalKnob: { label: 'Playlist modal: scrollbar knob', x: 88.57, y: 26.55, w: 2.67, h: 14.63 },
};

function createDefaultLayout() {
  return Object.fromEntries(
    Object.entries(DEFAULT_CONSOLE_LAYOUT).map(([id, item]) => [id, { ...item }]),
  );
}

function buildScopeWavePoints(bars, phase = 0) {
  const samples = bars?.length ? bars : [50];
  const pointCount = 241;

  return Array.from({ length: pointCount }, (_, index) => {
    const x = (index / (pointCount - 1)) * 100;
    const progress = index / (pointCount - 1);
    const samplePosition = progress * (samples.length - 1);
    const sampleIndex = Math.floor(samplePosition);
    const nextSampleIndex = Math.min(samples.length - 1, sampleIndex + 1);
    const sampleMix = samplePosition - sampleIndex;
    const sample =
      (Number(samples[sampleIndex]) || 50) * (1 - sampleMix) +
      (Number(samples[nextSampleIndex]) || 50) * sampleMix;
    const edgeEnvelope = Math.pow(Math.sin(Math.PI * progress), 0.62);
    const broadEnvelope = 0.64 + 0.36 * Math.pow(Math.sin(Math.PI * progress * 3.15 + 0.35), 2);
    const amplitude = Math.min(18.5, (3.5 + sample * 0.25) * edgeEnvelope * broadEnvelope);
    const carrier =
      Math.sin(index * 2.42 + phase) * 0.7 +
      Math.sin(index * 1.17 - phase * 1.6) * 0.22 +
      Math.sin(index * 3.83 + phase * 0.7) * 0.08;
    const y = 20 + amplitude * carrier;
    return `${x.toFixed(3)},${y.toFixed(3)}`;
  }).join(' ');
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

function EnvironmentMonitor({ metrics, layoutProps }) {
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
        value={metric.value}
        max={metric.max}
      />
    </div>
  ));
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function stableTrackNumber(track, offset = 0) {
  if (!track?.id) return 0;
  return Array.from(track.id).reduce((total, character) => total + character.charCodeAt(0), offset);
}

function formatRuntime(value) {
  if (!Number.isFinite(value) || value < 0) return '--:--';
  const totalSeconds = Math.floor(value);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) return `${String(minutes).padStart(2, '0')}:${seconds}`;
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}:${seconds}`;
}

function StatusMeter({ label, value, suffix, activeSegments, ariaLabel, className = '', ...props }) {
  const segmentCount = 12;
  return (
    <section className={`transmissionStatusMeter ${className}`} aria-label={ariaLabel} {...props}>
      <b>{label}</b>
      <div className="transmissionStatusMeter__segments" aria-hidden="true">
        {Array.from({ length: segmentCount }, (_, index) => {
          const isActive = index < activeSegments;
          const band = index >= 10 ? 'isCritical' : index >= 8 ? 'isWarning' : '';
          return <i key={index} className={[isActive && 'isActive', isActive && band].filter(Boolean).join(' ')} />;
        })}
      </div>
      <span>{value}{suffix}</span>
    </section>
  );
}

function TransmissionStatusDisplay({
  activeTrack,
  displayTrack,
  playing,
  currentTime,
  duration,
  visibleTracks,
  flavorText,
  layoutProps,
}) {
  const containmentLevel = activeTrack
    ? clamp(Number(activeTrack.containmentLevel) || 38 + (stableTrackNumber(activeTrack, 17) % 55), 0, 100)
    : null;
  const signalPercent = activeTrack
    ? clamp(
      44 + (stableTrackNumber(activeTrack, 5) % 32) + (playing ? Math.round(Math.sin((currentTime || 0) * 2.35) * 8) : 0),
      12,
      96,
    )
    : 0;
  const signalDb = activeTrack ? -Math.max(3.1, 42 - signalPercent * 0.34) : null;
  const playbackState = !activeTrack ? 'idle' : playing ? 'playing' : 'paused';
  const activeTrackIndex = activeTrack
    ? visibleTracks.findIndex((track) => track.id === activeTrack.id)
    : -1;
  const nextTrackCount = activeTrackIndex >= 0
    ? Math.max(0, visibleTracks.length - activeTrackIndex - 1)
    : 0;
  const footer = [
    ['ARCHIVE', activeTrack ? 'CONNECTED' : 'STANDBY', Boolean(activeTrack)],
    ['SIGNAL LOCK', activeTrack ? (playing ? 'VERIFIED' : 'HELD') : '---', Boolean(activeTrack)],
    ['CONTAINMENT', activeTrack ? (playing ? 'ARMED' : 'SECURED') : 'IDLE', Boolean(activeTrack)],
    ['RUNTIME', activeTrack ? `${formatRuntime(currentTime)} / ${formatRuntime(duration)}` : '--:-- / --:--', Boolean(activeTrack)],
    ['INTEGRITY', activeTrack ? 'STABLE' : '---', Boolean(activeTrack)],
    ['NEXT TX', activeTrack ? (nextTrackCount ? String(nextTrackCount) : 'EMPTY') : 'EMPTY', Boolean(activeTrack && nextTrackCount)],
  ];
  const topStatus = playbackState === 'idle'
    ? 'ARCHIVE STATUS // STANDBY'
    : playbackState === 'playing'
      ? 'LEAK STATUS // ARMED'
      : 'TRANSMISSION SUSPENDED';

  const footerIds = [
    'transmissionArchive', 'transmissionSignalLock', 'transmissionContainment',
    'transmissionRuntime', 'transmissionIntegrity', 'transmissionNext',
  ];

  return (
    <div className="transmissionStatusDisplay">
        <StatusMeter
          className="consoleOverlay"
          label="SIGNAL STRENGTH"
          value={signalDb === null ? '--.-' : signalDb.toFixed(1)}
          suffix=" dB"
          activeSegments={Math.ceil(signalPercent / 100 * 12)}
          ariaLabel={`Signal strength ${signalDb === null ? 'unavailable' : `${signalDb.toFixed(1)} decibels`}`}
          {...layoutProps('transmissionSignalMeter')}
        />

        <div className={`consoleOverlay transmissionStatusDisplay__center ${activeTrack ? 'hasTrack' : 'isIdle'}`} aria-live="polite" {...layoutProps('transmissionReadout')}>
          <small>{topStatus}</small>
          <h1>{activeTrack ? displayTrack.title : 'NO TRANSMISSION SELECTED'}</h1>
          <h2>{activeTrack ? displayTrack.artist : 'CHOOSE A TRACK FROM THE LIBRARY'}</h2>
          {activeTrack ? <p>{flavorText}</p> : null}
        </div>

        <StatusMeter
          className="consoleOverlay"
          label="CONTAINMENT LEVEL"
          value={containmentLevel === null ? '--' : containmentLevel}
          suffix="%"
          activeSegments={containmentLevel === null ? 0 : Math.ceil(containmentLevel / 100 * 12)}
          ariaLabel={`Containment level ${containmentLevel === null ? 'unavailable' : `${containmentLevel} percent`}`}
          {...layoutProps('transmissionContainmentMeter')}
        />

      {footer.map(([heading, value, active], index) => (
          <div className="consoleOverlay transmissionStatusFooterItem" key={heading} {...layoutProps(footerIds[index])}>
            <b>{heading}</b>
            <span title={value}>{value}</span>
            <i className={active ? 'isActive' : ''} aria-label={active ? `${heading} active` : `${heading} inactive`} />
          </div>
        ))}
    </div>
  );
}

export default function FullConsoleShell({
  BASE,
  defaultCover,
  lyricLineRefs,
  tracks,
  activeTrack,
  playbackTrack,
  displayTrack,
  pagedTracks,
  visibleTracks,
  query,
  playing,
  hasActiveAudio,
  currentTime,
  duration,
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
  sharePlaylist,
}) {
  const shellImage = `${BASE}images/production/stank-radio-console-v6.png`;
  const backgroundImage = `${BASE}images/production/stank-radio-console-background.png`;
  const stankPanelImage = `${BASE}images/production/stank-radio-panel-v2.png`;
  const returnPanelImage = `${BASE}images/production/return-to-directorate-panel.png`;
  const roomTonePanelImage = `${BASE}images/production/room-tone-panel.png`;
  const sectorPanelImage = `${BASE}images/production/sector-panel.png`;
  const outputMeterImage = `${BASE}images/production/vu-meter-face-v2.png`;
  const outputNeedleImage = `${BASE}images/production/output-needle.png`;
  const environmentTitleImage = `${BASE}images/production/environment-monitor-title.png`;
  const scopeGridImage = `${BASE}images/production/signal-readout-grid.png`;
  const monitorBackgroundImage = `${BASE}images/production/monitor-bg.png`;
  const transcriptPanelImage = `${BASE}images/production/transcript-feed-panel.png`;
  const transmissionStatusPanelImage = `${BASE}images/production/transmission-status-panel.png`;
  const playlistShellImage = `${BASE}images/production/playlist-shell.png`;
  const playlistRowImage = `${BASE}images/production/playlist-row.png`;
  const playlistKnobImage = `${BASE}images/production/playlist-knob.png`;
  const playlistCloseImage = `${BASE}images/production/playlist-close-button.png`;
  const cautionPanelImage = `${BASE}assets/stank-radio/caution-message-panel.png`;
  const diagnosticsLights = [
    { status: 'uplink', color: 'green', image: `${BASE}images/production/diagnostics-button-green.png` },
    { status: 'latency', color: 'orange', image: `${BASE}images/production/diagnostics-button-orange.png` },
    { status: 'packet-loss', color: 'off', image: `${BASE}images/production/diagnostics-button-off.png` },
    { status: 'jitter', color: 'red', image: `${BASE}images/production/diagnostics-button-red.png` },
  ];
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
  const [environmentLampLevels] = useState(() => ({
    containment: 3 + Math.floor(Math.random() * 5),
    signal: 3 + Math.floor(Math.random() * 5),
    noise: 3 + Math.floor(Math.random() * 5),
    pressure: 3 + Math.floor(Math.random() * 4),
  }));
  const [cautionPanelMessages, setCautionPanelMessages] = useState(() =>
    Array.from(
      { length: 4 },
      (_, index) => index % Math.max(1, cautionMessages.length),
    ),
  );
  const [changingCautionPanel, setChangingCautionPanel] = useState(null);
  const [shareNoticeUrl, setShareNoticeUrl] = useState('');
  const [playlistScrollProgress, setPlaylistScrollProgress] = useState(0);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [editorNotice, setEditorNotice] = useState('Saved locally');
  const [editorPosition, setEditorPosition] = useState(() => ({
    x: DESKTOP_CANVAS_WIDTH - 408,
    y: 18,
  }));
  const [desktopScale, setDesktopScale] = useState(() => ({
    x: Math.max(0.01, window.innerWidth / DESKTOP_CANVAS_WIDTH),
    y: Math.max(0.01, window.innerHeight / DESKTOP_CANVAS_HEIGHT),
  }));
  const desktopViewportRef = useRef(null);
  const stageRef = useRef(null);
  const editorPanelRef = useRef(null);
  const playlistModalPanelRef = useRef(null);
  const layoutGestureRef = useRef(null);
  const editorGestureRef = useRef(null);
  const nextCautionMessageRef = useRef(4 % Math.max(1, cautionMessages.length));
  const nextCautionPanelRef = useRef(0);
  const cautionFadeTimerRef = useRef(null);
  const shareNoticeTimerRef = useRef(null);
  const playlistGridRef = useRef(null);
  const selectedLayout = layout[selectedLayoutId] || DEFAULT_CONSOLE_LAYOUT[selectedLayoutId];
  const editingPlaylistModal = selectedLayoutId.startsWith('playlistModal');
  const scopeWaveFrames = [0, 0.9, 1.8, 2.7, 3.6, 4.5].map((phase) =>
    buildScopeWavePoints(roomTone.bars, phase),
  );
  const scopeWaveAnimation = [...scopeWaveFrames, scopeWaveFrames[0]].join(';');
  const transmissionFlavorPool = [
    'OLFACTORY OUTPUT EXCEEDS ACOUSTIC LEVEL',
    'PSYCHOLOGICAL DRIFT WITHIN LIMITS',
    'MEMETIC EXPOSURE ACCEPTABLE',
    'PERSONNEL INTEGRITY STABLE',
    'SIGNAL CONTAINS TRACE WOMBAT ACTIVITY',
    'ARCHIVE INTEGRITY VERIFIED',
    'UNAUTHORIZED TOE TAPPING DETECTED',
    'CONTAINMENT SEAL HOLDING',
    'COGNITIVE CONTAMINATION MINIMAL',
  ];
  const activeTransmissionFlavor = activeTrack
    ? transmissionFlavorPool[
      Array.from(activeTrack.id).reduce((total, character) => total + character.charCodeAt(0), 0)
      % transmissionFlavorPool.length
    ]
    : 'NO TRANSMISSION LOADED';
  const environmentItems = [
    {
      id: 'environmentContainment',
      metricId: 'containment',
      label: 'Containment',
      max: 7,
      value: environmentLampLevels.containment,
      image: `${BASE}images/production/environment-containment-v2.png`,
    },
    {
      id: 'environmentSignal',
      metricId: 'signal',
      label: 'Signal Strength',
      max: 7,
      value: environmentLampLevels.signal,
      image: `${BASE}images/production/environment-signal-v2.png`,
    },
    {
      id: 'environmentNoise',
      metricId: 'noise',
      label: 'Background Noise',
      max: 7,
      value: environmentLampLevels.noise,
      image: `${BASE}images/production/environment-noise-v2.png`,
    },
    {
      id: 'environmentPressure',
      metricId: 'pressure',
      label: 'Pressure Level',
      max: 6,
      value: environmentLampLevels.pressure,
      image: `${BASE}images/production/environment-pressure-v2.png`,
    },
  ];

  useEffect(() => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
    setEditorNotice('Saved locally');
  }, [layout]);

  useEffect(() => {
    const viewport = desktopViewportRef.current;
    if (!viewport) return undefined;

    let resizeFrame = 0;
    const updateScale = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        const viewportRect = viewport.getBoundingClientRect();
        const viewportWidth = viewportRect.width || window.innerWidth;
        const viewportHeight = viewportRect.height || window.innerHeight;
        const nextScale = {
          x: viewportWidth / DESKTOP_CANVAS_WIDTH,
          y: viewportHeight / DESKTOP_CANVAS_HEIGHT,
        };
        if (
          Number.isFinite(nextScale.x) && nextScale.x > 0 &&
          Number.isFinite(nextScale.y) && nextScale.y > 0
        ) {
          setDesktopScale(nextScale);
        }
      });
    };

    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);
    window.addEventListener('resize', updateScale);
    updateScale();
    return () => {
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (layoutEditing && editingPlaylistModal) setPlaylistsOpen(true);
  }, [editingPlaylistModal, layoutEditing, setPlaylistsOpen]);

  useEffect(() => {
    if (!playlistsOpen) return undefined;

    setPlaylistScrollProgress(0);
    if (playlistGridRef.current) playlistGridRef.current.scrollTop = 0;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setPlaylistsOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [playlistsOpen, setPlaylistsOpen]);

  const selectedPlaylistTracks = selectedPlaylist
    ? tracks.filter((track) => track.playlists.includes(selectedPlaylist.id))
    : [];

  function closePlaylistModal() {
    setSelectedPlaylist(null);
    setPlaylistsOpen(false);
  }

  function showPlaylistShareNotice() {
    const url = sharePlaylist?.(selectedPlaylist);
    if (!url) return;
    setShareNoticeUrl(url);
    if (shareNoticeTimerRef.current) window.clearTimeout(shareNoticeTimerRef.current);
    shareNoticeTimerRef.current = window.setTimeout(() => setShareNoticeUrl(''), 3200);
  }

  useEffect(() => {
    if (!cautionMessages.length) return undefined;

    const rotationTimer = window.setInterval(() => {
      const panelIndex = nextCautionPanelRef.current;
      nextCautionPanelRef.current = (panelIndex + 1) % 4;
      setChangingCautionPanel(panelIndex);

      cautionFadeTimerRef.current = window.setTimeout(() => {
        setCautionPanelMessages((current) => {
          let messageIndex = nextCautionMessageRef.current;

          if (cautionMessages.length >= 4) {
            while (current.some((value, index) => index !== panelIndex && value === messageIndex)) {
              messageIndex = (messageIndex + 1) % cautionMessages.length;
            }
          }

          nextCautionMessageRef.current = (messageIndex + 1) % cautionMessages.length;
          return current.map((value, index) => (index === panelIndex ? messageIndex : value));
        });
        setChangingCautionPanel(null);
      }, 190);
    }, 5250);

    return () => {
      window.clearInterval(rotationTimer);
      if (cautionFadeTimerRef.current) window.clearTimeout(cautionFadeTimerRef.current);
      if (shareNoticeTimerRef.current) window.clearTimeout(shareNoticeTimerRef.current);
    };
  }, []);

  function layoutProps(id, surface = 'console') {
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
        startLayoutGesture(event, id, 'move', surface);
      },
      onPointerMove: updateLayoutGesture,
      onPointerUp: finishLayoutGesture,
      onPointerCancel: finishLayoutGesture,
    };
  }

  function startLayoutGesture(event, id, mode, surface = 'console') {
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
      surface,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function updateLayoutGesture(event) {
    const gesture = layoutGestureRef.current;
    const stage = (gesture.surface === 'playlist'
      ? playlistModalPanelRef.current
      : stageRef.current)?.getBoundingClientRect();
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
      panelX: editorPosition.x,
      panelY: editorPosition.y,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function updateEditorDrag(event) {
    const gesture = editorGestureRef.current;
    const panel = editorPanelRef.current?.getBoundingClientRect();
    if (!gesture || gesture.pointerId !== event.pointerId || !panel) return;
    event.preventDefault();
    setEditorPosition({
      x: Math.max(0, Math.min(DESKTOP_CANVAS_WIDTH - panel.width / desktopScale.x, gesture.panelX + (event.clientX - gesture.startX) / desktopScale.x)),
      y: Math.max(0, Math.min(DESKTOP_CANVAS_HEIGHT - panel.height / desktopScale.y, gesture.panelY + (event.clientY - gesture.startY) / desktopScale.y)),
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

  function selectLayoutAsset(id) {
    setSelectedLayoutId(id);
    if (id.startsWith('playlistModal')) setPlaylistsOpen(true);
  }

  function copyLayoutJson() {
    navigator.clipboard
      ?.writeText(JSON.stringify(layout, null, 2))
      .then(() => setEditorNotice('Layout JSON copied'))
      .catch(() => setEditorNotice('Copy unavailable'));
  }

  function handleShareTrack() {
    const url = shareTrack();
    if (!url) return;
    setShareNoticeUrl(url);
    if (shareNoticeTimerRef.current) window.clearTimeout(shareNoticeTimerRef.current);
    shareNoticeTimerRef.current = window.setTimeout(() => setShareNoticeUrl(''), 3200);
  }

  return (
    <main className={playing ? 'fullConsolePage isPlaying' : 'fullConsolePage'}>
      <div className="stankDesktopViewport" ref={desktopViewportRef}>
        <div
          className="stankDesktopScaledBounds"
          style={{
            width: `${DESKTOP_CANVAS_WIDTH * desktopScale.x}px`,
            height: `${DESKTOP_CANVAS_HEIGHT * desktopScale.y}px`,
          }}
        >
          <div
            className="stankDesktopCanvas"
            style={{ transform: `scale(${desktopScale.x}, ${desktopScale.y})` }}
          >
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

        <div
          className="consoleOverlay consoleStankPanel"
          aria-label="Stank Radio"
          {...layoutProps('stankPanel')}
        >
          <img src={stankPanelImage} alt="" draggable={false} />
        </div>

        {auxiliaryPanels.map((panel) => (
          <div
            key={panel.id}
            className="consoleOverlay consolePanelAsset consoleAuxiliaryPanel"
            aria-label={panel.label}
            {...layoutProps(panel.id)}
          >
            <img src={panel.image} alt="" draggable={false} />
            {panel.id === 'systemHealthPanel' && (
              <div className="systemHealthLights" aria-hidden="true">
                {Array.from({ length: 24 }, (_, index) => (
                  <i key={index} style={{ '--health-index': index }} />
                ))}
              </div>
            )}
            {panel.id === 'transmitterStatusPanel' && (
              <div className="transmitterStatusLights" aria-hidden="true">
                {Array.from({ length: 24 }, (_, index) => (
                  <i key={index} style={{ '--transmitter-index': index }} />
                ))}
              </div>
            )}
            {panel.id === 'diagnosticsPanel' && (
              <div className="diagnosticsStatusLights" aria-hidden="true">
                {diagnosticsLights.map((light, index) => (
                  <img
                    key={light.status}
                    className={`diagnosticsStatusLight diagnosticsStatusLight--${light.status} diagnosticsStatusLight--${light.color}`}
                    src={light.image}
                    alt=""
                    draggable={false}
                    style={{ '--diagnostics-index': index }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        <i
          className="consoleOverlay liveContainmentLight liveContainmentLight--master"
          aria-label="Live containment master lamp"
          {...layoutProps('liveContainmentMasterLight')}
        />
        <i
          className="consoleOverlay liveContainmentLight liveContainmentLight--tx"
          aria-label="Live containment TX Active lamp"
          {...layoutProps('liveContainmentTxLight')}
        />
        <i
          className="consoleOverlay liveContainmentLight liveContainmentLight--signal"
          aria-label="Live containment Signal Lock lamp"
          {...layoutProps('liveContainmentSignalLight')}
        />
        <i
          className="consoleOverlay liveContainmentLight liveContainmentLight--safe"
          aria-label="Live containment Safe Mode lamp"
          {...layoutProps('liveContainmentSafeLight')}
        />
        <span
          className="consoleOverlay liveContainmentOnAir"
          aria-label="Live containment ON AIR lamp"
          {...layoutProps('liveContainmentOnAir')}
        />

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

        <img
          className="consoleOverlay consoleEnvironmentTitle"
          src={environmentTitleImage}
          alt="Environment Monitor"
          draggable={false}
          {...layoutProps('environmentTitle')}
        />

        <EnvironmentMonitor
          metrics={environmentItems}
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

        <img
          className="consoleOverlay consoleScopeGrid"
          src={scopeGridImage}
          alt=""
          aria-hidden="true"
          draggable={false}
          {...layoutProps('scopeGrid')}
        />

        <div className="consoleOverlay consoleScope" aria-hidden="true" {...layoutProps('scope')}>
          <div className="consoleScopeTrace">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none">
              <line className="consoleScopeBaseline" x1="0" y1="20" x2="100" y2="20" />
              <polyline className="consoleScopeWave" points={scopeWaveFrames[0]}>
                {playing ? (
                  <animate
                    attributeName="points"
                    values={scopeWaveAnimation}
                    dur="1.05s"
                    repeatCount="indefinite"
                  />
                ) : null}
              </polyline>
            </svg>
          </div>
        </div>

        <section
          className="consoleOverlay consoleTrackData"
          aria-label="Current transmission"
          {...layoutProps('trackData')}
        >
          <img className="consoleMonitorBackground" src={monitorBackgroundImage} alt="" draggable={false} />
          <img className="consoleMonitorFrame" src={transmissionStatusPanelImage} alt="" draggable={false} />
        </section>
        <TransmissionStatusDisplay
          activeTrack={activeTrack}
          displayTrack={displayTrack}
          playing={playing}
          currentTime={currentTime}
          duration={duration}
          visibleTracks={visibleTracks}
          flavorText={activeTransmissionFlavor}
          layoutProps={layoutProps}
        />

        <section className="consoleOverlay consoleLyrics" aria-label="Lyrics" {...layoutProps('lyrics')}>
          <img className="consoleMonitorBackground" src={monitorBackgroundImage} alt="" draggable={false} />
          <div className="consoleMonitorContent consoleLyricsScroll">
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
                      ? 'NO SYNCHRONIZED CONTAMINATION TRANSCRIPT FOUND IN ARCHIVE'
                      : 'SELECT AN AUDIO CONTAMINANT FROM THE ARCHIVE'}
                  </span>
                </div>
              )}
          </div>
          <img className="consoleMonitorFrame" src={transcriptPanelImage} alt="" draggable={false} />
        </section>

        <div
          className="consoleOverlay consoleLibraryTitle"
          aria-label="Containment Library"
          {...layoutProps('libraryTitle')}
        >
          <img
            src={`${BASE}images/production/containment-library-panel.png`}
            alt=""
            draggable={false}
          />
        </div>

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
          <img
            src={`${BASE}images/production/library-playlists-panel.png`}
            alt=""
            draggable={false}
          />
          <span className="srOnly">Playlists</span>
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
          <img
            src={`${BASE}images/production/library-all-tracks-panel.png`}
            alt=""
            draggable={false}
          />
          <span className="srOnly">All Tracks</span>
        </button>

        <aside
          className="consoleOverlay consoleLibrary"
          aria-label="Transmission library"
          {...layoutProps('library')}
        >
          <div className="consoleTrackList">
            {pagedTracks.map((track) => (
              <div
                key={track.id}
                className={`consoleTrackRow${track.id === activeTrack?.id ? ' active' : ''}${track.id === playbackTrack?.id && playing ? ' isPlaying' : ''}`}
              >
                <button
                  className="consoleTrackSelect"
                  type="button"
                  onClick={() => selectTrack(track, true)}
                >
                  <img src={track.cover || defaultCover} alt="" />
                  <span>
                    <b>{track.title}</b>
                    <small>{track.artist}</small>
                  </span>
                </button>
                <button
                  className="consoleTrackPlay"
                  type="button"
                  aria-label={`Play ${track.title}`}
                  onClick={() => selectTrack(track, true)}
                />
              </div>
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

        {cautionPanelMessages.map((messageIndex, panelIndex) => (
          <CautionPanel
            key={panelIndex}
            assetSrc={cautionPanelImage}
            message={cautionMessages[messageIndex] || ''}
            classification={['SYSTEM NOTICE', 'DIRECTORATE ADVISORY', 'OPERATIONAL WARNING', 'CONTAINMENT BULLETIN'][panelIndex]}
            changing={changingCautionPanel === panelIndex}
            layoutProps={layoutProps(`cautionPanel${panelIndex + 1}`)}
          />
        ))}

        <div className="consoleTransport" aria-label="Playback controls">
          <button
            className="transportShare"
            type="button"
            onClick={handleShareTrack}
            aria-label="Share track"
            {...layoutProps('share')}
          >
            <Share2 />
          </button>

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

        </div>

        {shareNoticeUrl ? (
          <div className="consoleShareNotice" role="status" aria-live="polite">
            <strong>Song Link Copied!</strong>
            <code>{shareNoticeUrl}</code>
          </div>
        ) : null}

        {layoutEditing && selectedLayout && !editingPlaylistModal ? (
          <button
            className="layoutAssetResizeHandle"
            type="button"
            aria-label={`Resize ${selectedLayout.label}`}
            title={`Resize ${selectedLayout.label}`}
            style={{
              left: `calc(${selectedLayout.x + selectedLayout.w}% - 8px)`,
              top: `calc(${selectedLayout.y + selectedLayout.h}% - 8px)`,
            }}
            onPointerDown={(event) => startLayoutGesture(event, selectedLayoutId, 'resize', 'console')}
            onPointerMove={updateLayoutGesture}
            onPointerUp={finishLayoutGesture}
            onPointerCancel={finishLayoutGesture}
          />
        ) : null}
      </section>

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
              onChange={(event) => selectLayoutAsset(event.target.value)}
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
        <section
          className="consoleModal"
          role="dialog"
          aria-modal="true"
          aria-label="Playlists"
          onPointerDown={(event) => {
            if (!layoutEditing && event.target === event.currentTarget) closePlaylistModal();
          }}
        >
          <div
            ref={playlistModalPanelRef}
            className="consoleModalPanel"
            style={{ '--playlist-shell-image': `url("${playlistShellImage}")` }}
          >
            <button
              type="button"
              className="consoleModalClose"
              {...layoutProps('playlistModalClose', 'playlist')}
              onClick={(event) => {
                if (layoutEditing) {
                  event.preventDefault();
                  return;
                }
                closePlaylistModal();
              }}
              aria-label="Close playlists"
            >
              <img
                src={playlistCloseImage}
                alt=""
                aria-hidden="true"
                draggable="false"
              />
            </button>
            {selectedPlaylist ? (
              <div className="consolePlaylistDetailToolbar">
                <button type="button" onClick={() => setSelectedPlaylist(null)}>Back to playlists</button>
                <strong>{selectedPlaylist.title}</strong>
                <button type="button" onClick={showPlaylistShareNotice}>Share playlist</button>
              </div>
            ) : null}
            <div
              className={`consolePlaylistGrid${selectedPlaylist ? ' isDetail' : ''}`}
              ref={playlistGridRef}
              {...layoutProps('playlistModalRows', 'playlist')}
              onScroll={(event) => {
                const grid = event.currentTarget;
                const maximum = grid.scrollHeight - grid.clientHeight;
                setPlaylistScrollProgress(maximum > 0 ? grid.scrollTop / maximum : 0);
              }}
            >
              {(selectedPlaylist ? selectedPlaylistTracks : playlists).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  style={{ '--playlist-row-image': `url("${playlistRowImage}")` }}
                  onClick={(event) => {
                    if (layoutEditing) {
                      event.preventDefault();
                      return;
                    }
                    if (selectedPlaylist) {
                      selectTrack(item, true);
                      closePlaylistModal();
                      return;
                    }
                    setSelectedPlaylist(item);
                    setPlaylistScrollProgress(0);
                    if (playlistGridRef.current) playlistGridRef.current.scrollTop = 0;
                  }}
                >
                  <img
                    src={selectedPlaylist ? item.cover : item.art}
                    alt=""
                    onError={(event) => {
                      if (event.currentTarget.dataset.fallbackApplied) return;
                      event.currentTarget.dataset.fallbackApplied = '1';
                      event.currentTarget.src = selectedPlaylist ? defaultCover : item.fallbackArt;
                    }}
                  />
                  <span>
                    <b>{item.title}</b>
                    <small>{selectedPlaylist ? item.artist : `${item.count} tracks`}</small>
                  </span>
                </button>
              ))}
            </div>
            <img
              className="consolePlaylistKnob"
              src={playlistKnobImage}
              alt=""
              aria-hidden="true"
              {...layoutProps('playlistModalKnob', 'playlist')}
              style={{
                ...layoutProps('playlistModalKnob', 'playlist').style,
                '--playlist-scroll-progress': playlistScrollProgress,
              }}
            />
            {layoutEditing && selectedLayout && editingPlaylistModal ? (
              <button
                className="layoutAssetResizeHandle"
                type="button"
                aria-label={`Resize ${selectedLayout.label}`}
                title={`Resize ${selectedLayout.label}`}
                style={{
                  left: `calc(${selectedLayout.x + selectedLayout.w}% - 8px)`,
                  top: `calc(${selectedLayout.y + selectedLayout.h}% - 8px)`,
                }}
                onPointerDown={(event) => startLayoutGesture(event, selectedLayoutId, 'resize', 'playlist')}
                onPointerMove={updateLayoutGesture}
                onPointerUp={finishLayoutGesture}
                onPointerCancel={finishLayoutGesture}
              />
            ) : null}
          </div>
        </section>
      ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
