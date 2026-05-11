/* SVG markup for the learn-french pack icons.
   French tricolore vertical stripes with a soft "Bonjour" wordmark. */

export const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="French for beginners">
  <rect width="512" height="512" rx="96" fill="#0a2a66"/>
  <rect x="56" y="120" width="120" height="272" rx="12" fill="#0055a4"/>
  <rect x="196" y="120" width="120" height="272" rx="12" fill="#f5f5f5"/>
  <rect x="336" y="120" width="120" height="272" rx="12" fill="#ef4135"/>
  <text x="256" y="460" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-weight="700" font-size="36" fill="#f5f5f5"
        letter-spacing="6">BONJOUR</text>
</svg>
`;

export const ICON_MASKABLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="French for beginners maskable">
  <rect width="512" height="512" fill="#0a2a66"/>
  <g transform="translate(96 96)">
    <rect x="0" y="40" width="106" height="240" rx="10" fill="#0055a4"/>
    <rect x="107" y="40" width="106" height="240" rx="10" fill="#f5f5f5"/>
    <rect x="214" y="40" width="106" height="240" rx="10" fill="#ef4135"/>
    <text x="160" y="316" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-weight="700" font-size="30" fill="#f5f5f5"
          letter-spacing="5">BONJOUR</text>
  </g>
</svg>
`;
