/* SVG markup for the sample-pack icons. Different palette + glyph from
   the cca-f-prep pack so that swapping the active pack visibly changes
   the favicon and PWA install icon. */

export const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Sample Learning Pack">
  <rect width="512" height="512" rx="96" fill="#0b1f2a"/>
  <text x="256" y="320" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-weight="700" font-size="280" fill="#5cc8c2"
        letter-spacing="-12">L</text>
  <text x="256" y="430" text-anchor="middle"
        font-family="ui-monospace, 'SF Mono', monospace"
        font-weight="600" font-size="48" fill="#9fb1bd"
        letter-spacing="4">LEARN</text>
</svg>
`;

export const ICON_MASKABLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Sample Learning Pack maskable">
  <rect width="512" height="512" fill="#0b1f2a"/>
  <g transform="translate(96 96)">
    <text x="160" y="216" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-weight="700" font-size="220" fill="#5cc8c2"
          letter-spacing="-10">L</text>
    <text x="160" y="296" text-anchor="middle"
          font-family="ui-monospace, 'SF Mono', monospace"
          font-weight="600" font-size="38" fill="#9fb1bd"
          letter-spacing="3">LEARN</text>
  </g>
</svg>
`;
