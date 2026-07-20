import React, { useEffect, useState } from 'react';
import { Pause, Play, Share2, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { cautionMessages } from '../data/cautionMessages';
import './pocket-filth.css';

const ENVIRONMENT_STATUSES = ['STABLE', 'CONTAINED', 'PUTRID', 'AGGRESSIVE', 'HAZARDOUS'];
const MONITOR_COLUMN_X = [23, 39, 55];
const MONITOR_ROW_Y = [15, 23, 32, 41, 50, 58, 67, 75];

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
  updatePlaybackTime,
  setPlaying,
}) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [playlistMenuOpen, setPlaylistMenuOpen] = useState(false);
  const [activePane, setActivePane] = useState('transmission');
  const [shareNotice, setShareNotice] = useState('');
  const [duration, setDuration] = useState(0);
  const [warningIndex, setWarningIndex] = useState(0);
  const [environmentStatus] = useState(
    () => ENVIRONMENT_STATUSES[Math.floor(Math.random() * ENVIRONMENT_STATUSES.length)],
  );
  const [signalStability, setSignalStability] = useState(() => 82 + Math.floor(Math.random() * 16));
  useEffect(() => {
    if (!libraryOpen) setPlaylistMenuOpen(false);
  }, [libraryOpen]);

  useEffect(() => {
    setDuration(0);
  }, [playbackTrack?.id]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWarningIndex((index) => (index + 1) % Math.max(1, cautionMessages.length));
    }, 7875);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSignalStability((current) => {
        const change = Math.floor(Math.random() * 7) - 3;
        return Math.min(99, Math.max(81, current + change));
      });
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  function captureDuration(event) {
    const nextDuration = event.currentTarget.duration;
    setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
  }

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

  const lyricText = currentLyrics?.[activeLyricIndex]?.text ||
    (activeTrack ? 'Lyrics unavailable for this contained transmission.' : 'Select a transmission from the containment library.');
  const boundedTime = duration ? Math.min(currentTime, duration) : 0;
  const progress = duration ? (boundedTime / duration) * 100 : 0;
  const collection = activeTrack ? (displayTrack.collection || displayTrack.tag) : 'CONTAINMENT STANDBY';
  const certification = displayTrack.certification || 'Certified Audio Contamination';
  const titleLength = displayTrack.title.length;
  const titleSize = titleLength <= 18 ? 'short' : titleLength <= 34 ? 'medium' : titleLength <= 58 ? 'long' : 'extra-long';
  const lyricStart = Math.max(0, activeLyricIndex - 2);
  const visibleLyrics = currentLyrics?.slice(lyricStart, lyricStart + 5) || [];
  const lampDebug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('lampDebug');

  return (
    <main className={`pocketFilth${playing ? ' isPlaying' : ''}`}>
      <section className="pocketConsole" aria-label="Stank Radio Pocket Filth player">
        <div className="pocketFrequency" aria-label="Broadcast frequency 98.8">
          <strong>98.8</strong>
        </div>

        <div className="pocketLiveStatus" aria-label={playing ? 'Live containment, on air' : 'Live containment, standby'}>
          <i aria-hidden="true" />
          <span>LIVE CONTAINMENT</span>
          <strong>{playing ? 'ON AIR' : 'STANDBY'}</strong>
        </div>

        <button
          className="pocketLibraryOpen"
          type="button"
          onClick={() => setLibraryOpen(true)}
          aria-label="Open containment library"
        >
          <span>CONTAINMENT LIBRARY</span>
        </button>

        <section className={`pocketPrimaryDisplay is-${activePane}`} aria-live="polite">
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
            <img className="pocketDossier" src={`${BASE}images/mobile/transmission-dossier.png`} alt="Transmission dossier" />
          ) : null}
        </section>

        <section className="pocketNowPlaying" aria-label="Active transmission metadata">
          <span className="pocketCollection">{collection}</span>
          <h1 className={`pocketTrackTitle ${titleSize}`}>{displayTrack.title}</h1>
          <strong className="pocketTrackArtist">{displayTrack.artist}</strong>
          <span className="pocketCertification">{certification}</span>
        </section>

        <div
          className="pocketTrackProgress"
          style={{ '--track-progress': `${progress}%` }}
          aria-label="Track time"
        >
          <time>{formatTime(boundedTime)}</time>
          <div className="pocketTrackRail">
            <span className="pocketTrackFill" aria-hidden="true" />
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
          <time>{formatTime(duration)}</time>
        </div>

        <div className="pocketTrackHazardGlow" aria-hidden="true" />
        <div className={`environment-monitor${lampDebug ? ' is-debugging' : ''}`} aria-hidden="true">
          <img
            className="environment-monitor__shell"
            src={`${BASE}images/mobile/environment-monitor-85x96.png`}
            alt=""
          />
          <div className="environment-monitor__lamps">
            {MONITOR_COLUMN_X.flatMap((left, column) => MONITOR_ROW_Y.map((top, row) => (
              <i
                className="environment-monitor__lamp"
                key={`${column}-${row}`}
                style={{
                  '--i': column * MONITOR_ROW_Y.length + row,
                  left: `${(left / 85) * 100}%`,
                  top: `${(top / 96) * 100}%`,
                }}
              />
            )))}
          </div>
        </div>

        <div className="pocketSignalBars" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => <i key={index} style={{ '--i': index }} />)}
        </div>
        <div className="pocketEnvironmentGlobe" aria-hidden="true" />
        <img
          className="pocketDirectorateSeal"
          src={`${BASE}images/mobile/directorate-seal.png`}
          alt=""
          aria-hidden="true"
        />
        <div className="pocketRadarSweep" aria-hidden="true" />

        <div className="pocketTransport" aria-label="Playback controls">
          <button type="button" aria-label="Previous track" onClick={() => stepTrack(-1)}><SkipBack /></button>
          <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay}>{playing ? <Pause /> : <Play />}</button>
          <button type="button" aria-label="Next track" onClick={() => stepTrack(1)}><SkipForward /></button>
          <button type="button" aria-label="Shuffle selection" onClick={randomTrack}><Shuffle /></button>
          <button type="button" aria-label="Share track" onClick={handleShare}><Share2 /></button>
        </div>

        <nav className="pocketTabs" aria-label="Track information">
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

        <div className="pocketEnvironmentReadout" aria-label="Environment signal stability">
          <span>ENVIRONMENT: <strong>{environmentStatus}</strong></span>
          <span>SIGNAL STABILITY: <strong>{signalStability}%</strong></span>
        </div>

        <div className="pocketWarning" aria-live="polite">{cautionMessages[warningIndex] || ''}</div>

        <img className="pocketShell" src={`${BASE}images/mobile/pocket-filth-shell-v2.png`} alt="" />
        <img className="pocketHeaderPlate" src={`${BASE}images/mobile/pocket-filth-header.png`} alt="" />

        <audio
          ref={audioRef}
          src={playbackTrack?.audio || undefined}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={updatePlaybackTime}
          onLoadedMetadata={captureDuration}
          onDurationChange={captureDuration}
          onEnded={() => stepTrack(1)}
        />
      </section>

      <section
        className={`pocketLibraryDrawer${libraryOpen ? ' open' : ''}`}
        aria-hidden={!libraryOpen}
        onClick={() => setLibraryOpen(false)}
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
                <div className="pocketTrackLamp" aria-hidden="true">
                  {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--i': index }} />)}
                </div>
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
          <button className="pocketLibraryClose" type="button" onClick={() => setLibraryOpen(false)} aria-label="Close library" />
          <button className="pocketLibraryPlaylists" type="button" onClick={() => setPlaylistMenuOpen((open) => !open)} aria-label="Playlists" />
          <button
            className="pocketLibraryAll"
            type="button"
            onClick={() => {
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
