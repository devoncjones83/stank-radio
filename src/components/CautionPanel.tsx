import type { HTMLAttributes } from 'react';

import './CautionPanel.css';

type CautionPanelProps = {
  assetSrc: string;
  message: string;
  changing: boolean;
  layoutProps: HTMLAttributes<HTMLElement>;
};

export default function CautionPanel({
  assetSrc,
  message,
  changing,
  layoutProps,
}: CautionPanelProps) {
  return (
    <section
      className="consoleOverlay consoleCautionPanel"
      aria-label={`Caution: ${message}`}
      {...layoutProps}
    >
      <img
        className="consoleCautionPanel__background"
        src={assetSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <span
        className={`consoleCautionPanel__message${changing ? ' isChanging' : ''}`}
      >
        {message}
      </span>
    </section>
  );
}
