import React from 'react';
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
  loadStatus,
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
  const shellImage = `${BASE}images/production/stank-radio-console-v3.png`;

  return (
    <main className={playing ? 'fullConsolePage isPlaying' : 'fullConsolePage'}>
      <section className="fullConsoleStage" aria-label="STANK Radio broadcast console">
        <img
          className="fullConsoleHardware"
          src={shellImage}
          alt=""
          draggable={false}
        />

        <div className="consoleOverlay consoleEnvironment" aria-label="Environment monitor">
          <div>
            <span>Containment</span>
            <b>{activeTrack ? 'ACTIVE' : 'STANDBY'}</b>
          </div>
          <div>
            <span>Signal</span>
            <b>{activeTrack ? roomTone.level : 'LOW'}</b>
          </div>
          <div>
            <span>Noise</span>
            <b>{roomTone.label}</b>
          </div>
          <div>
            <span>Pressure</span>
            <b>{playing ? 'ELEVATED' : 'NORMAL'}</b>
          </div>
        </div>

        <div className="consoleOverlay consoleCover">
          <img
            src={displayTrack.cover || defaultCover}
            alt={activeTrack ? `${displayTrack.title} cover art` : ''}
          />
        </div>

        <div className="consoleOverlay consoleScope" aria-hidden="true">
          <div className="consoleScopeTrace">
            {roomTone.bars.concat(roomTone.bars).map((height, index) => (
              <i
                key={index}
                style={{ '--scope-height': `${Math.max(14, height)}%` }}
              />
            ))}
          </div>
        </div>

        <section className="consoleOverlay consoleTrackData" aria-label="Current transmission">
          <small>{playing ? 'NOW LEAKING' : activeTrack ? 'LEAK ARMED' : 'STANDBY'}</small>
          <h1>{activeTrack ? displayTrack.title : 'NO TRANSMISSION SELECTED'}</h1>
          <h2>{displayTrack.artist}</h2>
          <p>{displayTrack.description}</p>
        </section>

        <section className="consoleOverlay consoleLyrics" aria-label="Lyrics">
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

        <aside className="consoleOverlay consoleLibrary" aria-label="Transmission library">
          <label className="consoleSearch">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setLibraryPage(1);
              }}
              placeholder="SEARCH ARCHIVE..."
            />
          </label>

          <div className="consoleLibraryActions">
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setLibraryPage(1);
                setPlaylistsOpen(true);
              }}
            >
              <ListMusic size={13} />
              Playlists
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTag('ALL');
                setQuery('');
                setLibraryPage(1);
              }}
            >
              All tracks
            </button>
          </div>

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

          <nav className="consolePagination" aria-label="Library pages">
            <button
              type="button"
              aria-label="Previous page"
              disabled={libraryPage <= 1}
              onClick={() => setLibraryPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft size={14} />
            </button>

            <span>
              {libraryPage} / {totalLibraryPages}
            </span>

            <button
              type="button"
              aria-label="Next page"
              disabled={libraryPage >= totalLibraryPages}
              onClick={() =>
                setLibraryPage((page) => Math.min(totalLibraryPages, page + 1))
              }
            >
              <ChevronRight size={14} />
            </button>
          </nav>
        </aside>

        <div className="consoleSystemStatus" title={loadStatus}>
          {loadStatus}
        </div>

        <div className="consoleTransport" aria-label="Playback controls">
          <button
            className="transportPrevious"
            type="button"
            onClick={() => stepTrack(-1)}
            aria-label="Previous track"
          >
            <SkipBack />
          </button>

          <button
            className="transportPlay"
            type="button"
            onClick={togglePlay}
            disabled={!hasActiveAudio}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause /> : <Play />}
          </button>

          <button
            className="transportNext"
            type="button"
            onClick={() => stepTrack(1)}
            aria-label="Next track"
          >
            <SkipForward />
          </button>

          <button
            className="transportShuffle"
            type="button"
            onClick={randomTrack}
            aria-label="Random track"
          >
            <Shuffle />
          </button>

          <button
            className="transportShare"
            type="button"
            onClick={shareTrack}
            aria-label="Share track"
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
      </section>

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
