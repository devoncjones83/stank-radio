import type { HTMLAttributes } from 'react';

import './CautionPanel.css';

type CautionPanelProps = {
  assetSrc: string;
  message: string;
  classification: string;
  changing: boolean;
  layoutProps: HTMLAttributes<HTMLElement>;
};

export default function CautionPanel({
  assetSrc,
  message,
  classification,
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
      <span className="consoleCautionPanel__message">
        <small>{classification}</small>
        <b className={changing ? 'isChanging' : ''}>{message}</b>
      </span>
    </section>
  );
}
