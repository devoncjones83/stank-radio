import React from 'react';

const ICON_PATHS = {
  previous: (
    <>
      <path className="playerIcon__bar" d="M11 12H16V36H11Z" />
      <path className="playerIcon__plate" d="M36 12L18 21V27L36 36L39 33V15Z" />
    </>
  ),
  play: <path className="playerIcon__plate" d="M14 11L37 21.5V26.5L14 37L11 34V14Z" />,
  pause: (
    <>
      <path className="playerIcon__bar" d="M13 11H21V37H13Z" />
      <path className="playerIcon__bar" d="M27 11H35V37H27Z" />
    </>
  ),
  next: (
    <>
      <path className="playerIcon__plate" d="M12 12L30 21V27L12 36L9 33V15Z" />
      <path className="playerIcon__bar" d="M32 12H37V36H32Z" />
    </>
  ),
  shuffle: (
    <>
      <path d="M8 14H16L31 33H39" />
      <path d="M34 28L40 33L34 38" />
      <path d="M8 34H16L23 25" />
      <path d="M27 20L32 14H39" />
      <path d="M34 9L40 14L34 19" />
    </>
  ),
  share: (
    <>
      <path d="M16 22L30 14" />
      <path d="M16 26L30 34" />
      <path className="playerIcon__node" d="M7 21L11 18L16 20L17 25L13 29L8 27Z" />
      <path className="playerIcon__node" d="M29 10L34 8L38 11L38 16L34 19L29 17Z" />
      <path className="playerIcon__node" d="M29 31L34 29L38 32L38 37L34 40L29 38Z" />
    </>
  ),
};

export default function PlayerIcon({ type }) {
  return (
    <svg
      className={`playerIcon playerIcon--${type}`}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[type]}
    </svg>
  );
}
