#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-046.$STAMP"

cat >> src/styles.css <<'CSS'

/* === SR-046 LIBRARY FRAME INTEGRATION === */
@media (min-width: 1101px) {
  .industrialLibraryBay {
    position: relative !important;
    overflow: hidden !important;
    border: 0 !important;
    box-shadow: none !important;
    background:
      url("/images/industrial-library-frame-v1.png")
      center center / 100% 100% no-repeat !important;
    padding: 1.05rem 1.15rem 1.05rem 1.15rem !important;
  }

  /* put controls into the rendered top hardware area */
  .industrialLibraryBay .filterHeader {
    position: absolute !important;
    top: 1.05rem !important;
    left: 1.25rem !important;
    right: 1.25rem !important;
    height: 3.15rem !important;
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) auto auto !important;
    gap: 0.5rem !important;
    align-items: center !important;
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    padding: 0 0.4rem !important;
    z-index: 5 !important;
  }

  .industrialLibraryBay .filterHeader .panelLabel {
    color: #baff42 !important;
    font-size: 0.9rem !important;
    font-weight: 950 !important;
    letter-spacing: 0.055em !important;
    text-transform: uppercase !important;
    text-shadow: 0 0 8px rgba(186,255,66,0.42), 1px 1px 0 #000 !important;
  }

  .industrialLibraryBay .playlistLink {
    min-width: 7.8rem !important;
    height: 2.15rem !important;
    background: rgba(3, 14, 4, 0.76) !important;
    border: 1px solid rgba(186,255,66,0.38) !important;
    color: #baff42 !important;
    box-shadow: inset 0 0 14px rgba(0,0,0,0.78) !important;
  }

  /* search input sits in second top screen */
  .industrialLibraryBay .searchBox {
    position: absolute !important;
    top: 4.75rem !important;
    left: 1.25rem !important;
    right: 1.25rem !important;
    height: 2.75rem !important;
    background: rgba(1, 8, 3, 0.66) !important;
    border: 0 !important;
    box-shadow: none !important;
    padding: 0 0.85rem !important;
    z-index: 5 !important;
  }

  .industrialLibraryBay .searchBox input {
    color: #fff0cf !important;
    font-size: 0.95rem !important;
    font-weight: 800 !important;
  }

  .industrialLibraryBay .searchBox input::placeholder {
    color: rgba(255,240,207,0.68) !important;
  }

  /* title sits in metal body below cables */
  .industrialLibraryTitle {
    position: absolute !important;
    top: 8.35rem !important;
    left: 1.35rem !important;
    height: 1.6rem !important;
    margin: 0 !important;
    color: #baff42 !important;
    font-size: 0.85rem !important;
    font-weight: 950 !important;
    letter-spacing: 0.075em !important;
    text-transform: uppercase !important;
    text-shadow: 0 0 8px rgba(186,255,66,0.38), 1px 1px 0 #000 !important;
    z-index: 5 !important;
  }

  /* track viewport over the large green screen */
  .industrialLibraryBay .trackList {
    position: absolute !important;
    left: 1.35rem !important;
    right: 1.75rem !important;
    top: 10.35rem !important;
    bottom: 3.35rem !important;
    display: grid !important;
    grid-template-rows: repeat(5, minmax(0, 1fr)) !important;
    gap: 0.48rem !important;
    overflow: hidden !important;
    z-index: 5 !important;
  }

  .industrialLibraryBay .trackRow {
    min-height: 0 !important;
    height: 100% !important;
    background: rgba(1, 8, 3, 0.42) !important;
    border: 1px solid rgba(180,180,160,0.28) !important;
    box-shadow:
      inset 0 0 20px rgba(0,0,0,0.82),
      0 0 0 1px rgba(0,0,0,0.8) !important;
    padding: 0.35rem 4.25rem 0.35rem 0.55rem !important;
    align-items: center !important;
  }

  .industrialLibraryBay .trackRow img {
    width: 58px !important;
    height: 58px !important;
    object-fit: cover !important;
    align-self: center !important;
  }

  .industrialLibraryBay .trackRowText b {
    color: #fff0cf !important;
    font-size: 0.96rem !important;
  }

  .industrialLibraryBay .trackRowText small {
    color: rgba(255,240,207,0.72) !important;
    font-size: 0.66rem !important;
  }

  .industrialLibraryBay .trackRow.active {
    border-color: rgba(186,255,66,0.75) !important;
    box-shadow:
      inset 0 0 18px rgba(0,0,0,0.86),
      0 0 0 1px rgba(186,255,66,0.7),
      0 0 16px rgba(186,255,66,0.18) !important;
  }

  .industrialLibraryBay .emptyLibrary {
    align-self: center !important;
    justify-self: center !important;
    color: #fff0cf !important;
    text-shadow: 1px 1px 0 #000 !important;
  }

  .industrialLibraryBay .libraryPagination {
    position: absolute !important;
    right: 2.1rem !important;
    bottom: 1.25rem !important;
    height: 2rem !important;
    transform: none !important;
    background: rgba(0,0,0,0.48) !important;
    border: 1px solid rgba(186,255,66,0.22) !important;
    z-index: 6 !important;
  }

  .industrialLibraryBay .libraryPagination span {
    color: #fff0cf !important;
    font-size: 0.78rem !important;
  }

  .industrialLibraryBay .libraryPagination button {
    width: 2rem !important;
    height: 1.75rem !important;
    color: #fff0cf !important;
  }
}
CSS

npm run build
echo "SR-046 complete. Refresh and inspect library frame only."
