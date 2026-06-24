#!/bin/bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
cp src/styles.css "src/styles.css.bak.SR-043A.$STAMP"

cat >> src/styles.css <<'CSS'

/* =====================================================
   SR-043A
   HEADER ASSET ONLY
   ===================================================== */

@media (min-width:1100px){

  .industrialHeader.broadcastDeck{
    background:
      url("/images/industrial-header-filthup-v1.png")
      center center / cover no-repeat !important;

    min-height:135px !important;
    border:none !important;
    overflow:hidden !important;
  }

  /* hide duplicate artwork text */

  .broadcastIdentityPanel,
  .broadcastDefinitionPanel,
  .broadcastContaminantsPanel{
    visibility:hidden !important;
  }

  /* keep status panel alive */

  .broadcastStatusPanel{
    background:none !important;
    border:none !important;
    box-shadow:none !important;
  }

  .broadcastStatusPanel *{
    position:relative;
    z-index:5;
  }

  /* position live status over asset */

  .broadcastStatusPanel{
    display:flex !important;
    justify-content:flex-end !important;
    align-items:flex-start !important;
    padding-top:12px !important;
    padding-right:16px !important;
  }

}

CSS

npm run build
echo "SR-043A complete"
