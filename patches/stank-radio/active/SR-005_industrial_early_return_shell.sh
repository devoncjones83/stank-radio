#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "FILTH-UP" ]; then
  echo "ERROR: Not on FILTH-UP branch"
  exit 1
fi

cp src/main.jsx "src/main.jsx.bak.SR-005-early.$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-005-early.$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

main = Path("src/main.jsx")
text = main.read_text()

marker = "  return (\n    <main className={`"
industrial_return = r'''  if (viewMode === 'filth') {
    return (
      <main className="radioApp filthUpView">
        <div
          className="backdrop"
          style={{ '--app-bg': `url("${BASE}images/stank-radio-bg.png")` }}
          aria-hidden="true"
        />
        <div className="scanlines" aria-hidden="true" />

        <section className="industrialShell" aria-label="Filth-Up industrial console">
          <header className="industrialHeader">
            <a className="brand" href={BASE} aria-label="STANK RADIO">
              <img src={defaultCover} alt="" />
              <span>
                <b>STANK RADIO</b>
                <small>FILTH-UP Industrial Leak Console</small>
              </span>
            </a>

            <div className="transmissionFlag liveContainmentBadge">
              <span />
              {playing ? 'TRANSMISSION ACTIVE' : 'AWAITING LEAK'}
            </div>

            <button
              className="viewToggle"
              type="button"
              onClick={() => setViewMode('containment')}
            >
              Containment View
            </button>
          </header>

          <aside className="industrialLeftRail">
            <div className="industrialGauge">
              <span>Containment</span>
              <b>INDEX</b>
              <i />
            </div>
            <div className="industrialGauge">
              <span>Fumes</span>
              <b>{activeTrack ? `${stankIndex}%` : 'IDLE'}</b>
              <i />
            </div>
            <div className="industrialLedMeter" aria-hidden="true">
              {roomTone.bars.map((height, index) => (
                <i key={index} style={{ '--meter-height': `${height}%` }} />
              ))}
            </div>
          </aside>

          <section className="industrialMainBay">
            <div className="industrialStatusRail">
              <span>{playing ? 'NOW LEAKING' : 'NO TRANSMISSION SELECTED'}</span>
              <b>88.8 STANK FM</b>
            </div>

            <div className="industrialArtworkBay">
              <img src={displayTrack.cover || defaultCover} alt="" />
              <em>{activeTrack ? 'ACTIVE RESIDUE' : 'AWAITING SELECTION'}</em>
            </div>

            <div className="industrialTransport">
              <button type="button" onClick={() => stepTrack(-1)} aria-label="Previous track">
                <SkipBack size={18} />
              </button>
              <button
                className="industrialStartLeak"
                type="button"
                onClick={togglePlay}
                disabled={!hasActiveAudio}
              >
                {playing ? <Pause size={22} /> : <Play size={22} />}
                {playing ? 'PAUSE LEAK' : 'START LEAK'}
              </button>
              <button type="button" onClick={() => stepTrack(1)} aria-label="Next track">
                <SkipForward size={18} />
              </button>
              <button type="button" onClick={randomTrack}>
                <Shuffle size={18} />
                RANDOM
              </button>
              <button type="button" onClick={shareTrack}>
                <Share2 size={18} />
                SHARE
              </button>
            </div>
          </section>

          <section className="industrialInfoBay">
            <div className="industrialTrackTerminal">
              <p className="trackTag">{displayTrack.tag}</p>
              <h2>{displayTrack.title}</h2>
              <p>{displayTrack.description}</p>
              <dl>
                <div><dt>Operator</dt><dd>{displayTrack.artist}</dd></div>
                <div><dt>Stank Load</dt><dd>{activeTrack ? `${stankIndex}%` : 'None'}</dd></div>
                <div><dt>Indexed</dt><dd>{tracks.length || 0} tracks</dd></div>
              </dl>
            </div>

            <section className="industrialLyrics" aria-label="Lyrics">
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
          </section>

          <aside className="industrialLibraryBay">
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

            <div className="panelLabel industrialLibraryTitle">
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
          </aside>

          <aside className="industrialWarningStrip">
            <span>FIELD WARNING</span>
            <b>DO NOT CLEAN THE SIGNAL PATH.</b>
            <b>DO NOT TRUST ANYTHING LABELED SMOOTH.</b>
            <b>REPORT ALL SUSPICIOUS SILENCE.</b>
          </aside>

          <audio
            ref={audioRef}
            src={activeTrack?.audio || undefined}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={updatePlaybackTime}
            onEnded={() => stepTrack(1)}
          />
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
    );
  }

'''

if marker not in text:
    raise SystemExit("Could not find return marker")

text = text.replace(marker, industrial_return + marker, 1)
main.write_text(text)

css = Path("src/styles.css")
css.write_text(css.read_text() + r'''

/* === SR-005 INDUSTRIAL EARLY RETURN SHELL === */
.industrialShell {
  display: none;
}

.radioApp.filthUpView .industrialShell {
  display: grid;
}

@media (min-width: 1101px) {
  .radioApp.filthUpView {
    min-height: 100vh;
    padding: 0.5rem;
    overflow: hidden;
    background:
      radial-gradient(circle at 42% 32%, rgba(122, 255, 31, 0.12), transparent 34rem),
      linear-gradient(135deg, #555246, #1d1d18 42%, #3a2d24);
  }

  .radioApp.filthUpView .backdrop {
    opacity: 0.22;
    filter: sepia(0.9) hue-rotate(28deg) saturate(0.8) brightness(0.55);
  }

  .industrialShell {
    position: relative;
    z-index: 2;
    height: calc(100vh - 1rem);
    display: grid;
    grid-template-columns: 150px minmax(0, 1.2fr) minmax(320px, 0.65fr) minmax(360px, 0.75fr);
    grid-template-rows: 78px minmax(0, 1fr) 96px;
    grid-template-areas:
      "head head head head"
      "rail main info library"
      "warn warn warn library";
    gap: 0.45rem;
    border: 2px solid rgba(31, 31, 27, 0.96);
    background:
      linear-gradient(180deg, rgba(86, 84, 72, 0.88), rgba(32, 32, 27, 0.98)),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 48px);
    box-shadow:
      inset 0 0 0 4px rgba(0,0,0,0.5),
      inset 0 0 80px rgba(0,0,0,0.75);
    padding: 0.55rem;
  }

  .industrialHeader,
  .industrialLeftRail,
  .industrialMainBay,
  .industrialInfoBay,
  .industrialLibraryBay,
  .industrialWarningStrip {
    border: 1px solid rgba(24, 24, 20, 0.98);
    background:
      linear-gradient(180deg, rgba(92, 90, 76, 0.78), rgba(24, 25, 21, 0.97));
    box-shadow:
      inset 0 0 0 2px rgba(113, 108, 88, 0.28),
      inset 0 0 26px rgba(0,0,0,0.68);
  }

  .industrialHeader {
    grid-area: head;
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 0.65rem;
    padding: 0.55rem;
  }

  .industrialLeftRail {
    grid-area: rail;
    display: grid;
    grid-template-rows: 180px 180px minmax(0, 1fr);
    gap: 0.55rem;
    padding: 0.55rem;
  }

  .industrialGauge {
    display: grid;
    place-items: center;
    text-align: center;
    border: 1px solid rgba(10,10,8,0.9);
    background:
      radial-gradient(circle at center 38%, rgba(207, 231, 157, 0.55), rgba(39, 44, 33, 0.9) 46%, rgba(12,12,10,0.98) 70%);
  }

  .industrialGauge span,
  .industrialGauge b {
    color: #baff42;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 0.08em;
  }

  .industrialGauge i {
    width: 70%;
    height: 4px;
    background: #1b1b14;
    border-top: 2px solid #d35f3a;
    transform: rotate(-8deg);
  }

  .industrialLedMeter {
    display: flex;
    align-items: end;
    gap: 0.25rem;
    padding: 0.65rem;
    border: 1px solid rgba(10,10,8,0.9);
    background: #091009;
  }

  .industrialLedMeter i {
    flex: 1;
    height: var(--meter-height);
    background: linear-gradient(180deg, #caff57, #64d81f);
    box-shadow: 0 0 10px rgba(131,255,37,0.4);
  }

  .industrialMainBay {
    grid-area: main;
    display: grid;
    grid-template-rows: 46px minmax(0, 1fr) 68px;
    gap: 0.5rem;
    padding: 0.55rem;
  }

  .industrialStatusRail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(126,255,46,0.25);
    background: rgba(4, 13, 4, 0.82);
    color: #baff42;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 0.08em;
    padding: 0 0.8rem;
  }

  .industrialArtworkBay {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 0;
    overflow: hidden;
    border: 1px solid rgba(10,10,8,0.96);
    background: #050805;
  }

  .industrialArtworkBay img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .industrialArtworkBay em {
    position: absolute;
    left: 0.8rem;
    bottom: 0.8rem;
    background: #a6ff38;
    color: #081006;
    font-style: normal;
    font-weight: 900;
    padding: 0.25rem 0.5rem;
    text-transform: uppercase;
    font-size: 0.72rem;
  }

  .industrialTransport {
    display: grid;
    grid-template-columns: 52px minmax(190px, 260px) 52px 1fr 1fr;
    gap: 0.35rem;
  }

  .industrialTransport button {
    border: 1px solid rgba(20,20,16,0.98);
    background: linear-gradient(180deg, rgba(87,83,68,0.95), rgba(24,24,20,0.98));
    color: #f3f1db;
    font-weight: 900;
    text-transform: uppercase;
    cursor: pointer;
  }

  .industrialTransport .industrialStartLeak {
    background: linear-gradient(180deg, #9d4930, #4d2018);
    color: #ffe1c2;
  }

  .industrialInfoBay {
    grid-area: info;
    display: grid;
    grid-template-rows: 42% minmax(0, 1fr);
    gap: 0.5rem;
    padding: 0.55rem;
  }

  .industrialTrackTerminal,
  .industrialLyrics {
    min-height: 0;
    border: 1px solid rgba(126,255,46,0.22);
    background:
      linear-gradient(180deg, rgba(4, 24, 5, 0.86), rgba(2, 8, 3, 0.96));
    padding: 0.75rem;
    overflow: hidden;
  }

  .industrialTrackTerminal h2 {
    color: #caff57;
    text-transform: uppercase;
    font-size: clamp(1.8rem, 3vw, 3.3rem);
    line-height: 0.9;
  }

  .industrialTrackTerminal dl {
    display: grid;
    gap: 0.35rem;
  }

  .industrialLibraryBay {
    grid-area: library;
    display: grid;
    grid-template-rows: auto auto auto minmax(0, 1fr) auto;
    gap: 0.55rem;
    padding: 0.65rem;
    overflow: hidden;
  }

  .industrialLibraryBay .trackList {
    min-height: 0;
    overflow: auto;
    padding-right: 0.2rem;
  }

  .industrialLibraryBay .trackRow {
    min-height: 58px;
    border-radius: 2px;
    background: linear-gradient(180deg, rgba(58, 68, 48, 0.82), rgba(17, 21, 15, 0.94));
  }

  .industrialLibraryBay .trackRow img {
    width: 42px;
    height: 42px;
  }

  .industrialWarningStrip {
    grid-area: warn;
    display: grid;
    grid-template-columns: 160px repeat(3, 1fr);
    gap: 0.35rem;
    align-items: center;
    padding: 0.55rem;
    border-color: rgba(184, 64, 36, 0.85);
    background:
      linear-gradient(180deg, rgba(93, 30, 17, 0.72), rgba(20, 10, 8, 0.96)),
      repeating-linear-gradient(90deg, rgba(244, 160, 37, 0.2) 0 18px, rgba(16,8,4,0.45) 18px 36px);
  }

  .industrialWarningStrip span,
  .industrialWarningStrip b {
    color: #fff2d6;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 0.78rem;
  }

  .industrialWarningStrip span {
    color: #aaff38;
  }
}
''')
PY

npm run build
git status --short
