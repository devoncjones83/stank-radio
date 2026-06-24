#!/usr/bin/env bash
set -euo pipefail

git checkout FILTH-UP >/dev/null

cp src/styles.css "src/styles.css.bak.SR-034.$(date +%Y%m%d-%H%M%S)"

cat >> src/styles.css <<'CSS'

/* === SR-034 1080P DESKTOP TUNING === */
@media (min-width: 1101px) and (max-height: 950px) {
  .industrialShell {
    grid-template-rows: 126px minmax(0, 1fr) 192px 72px;
  }

  .industrialHeader.broadcastDeck {
    grid-template-columns:
      minmax(520px, 1.35fr)
      minmax(300px, 0.8fr)
      minmax(330px, 0.9fr)
      minmax(330px, 0.95fr);
  }

  .broadcastIdentityPanel h1 {
    font-size: clamp(1.85rem, 2.95vw, 3.45rem);
  }

  .broadcastIdentityPanel > strong {
    font-size: 0.78rem;
  }

  .broadcastIdentityCopy {
    transform: translateY(-6px);
  }

  .broadcastIdentityCopy span {
    font-size: 0.88rem;
  }

  .broadcastIdentityCopy b {
    font-size: 1.34rem;
  }

  .broadcastIdentityCopy em {
    font-size: 0.82rem;
  }

  .broadcastDefinitionPanel p,
  .broadcastContaminantsPanel p {
    font-size: 0.84rem;
  }

  .broadcastDefinitionPanel span,
  .broadcastContaminantsPanel span,
  .broadcastContaminantsPanel strong {
    font-size: 0.76rem;
    line-height: 1.22;
  }

  .industrialLibraryBay .trackList {
    grid-template-rows: repeat(5, minmax(86px, 1fr));
    gap: 0.65rem;
  }

  .industrialLibraryBay .trackRow {
    min-height: 86px;
  }

  .industrialLibraryBay .trackRow img {
    width: 68px;
    height: 68px;
  }

  .industrialLibraryBay .trackRowText b {
    font-size: 1.04rem;
  }

  .industrialLibraryBay .trackRowText small {
    font-size: 0.68rem;
  }

  .industrialInfoBay {
    grid-template-columns: minmax(320px, 0.52fr) minmax(380px, 0.48fr);
  }

  .industrialTrackTerminal h2 {
    font-size: clamp(1.35rem, 1.95vw, 2.2rem);
  }

  .industrialLyricsEmpty {
    font-size: 0.66rem;
    gap: 0.18rem;
  }

  .industrialWarningStrip span,
  .industrialWarningStrip b {
    font-size: 0.8rem;
  }
}
CSS

npm run build
git status --short
