/* SVG markup for the pmbok-prep pack icons. Deep navy + amber accent —
   reads as "professional certification" without aping PMI's trademark. */

export const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="PMBOK Prep">
  <rect width="512" height="512" rx="96" fill="#0e1d3a"/>
  <text x="256" y="280" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-weight="700" font-size="180" fill="#f0b952"
        letter-spacing="-6">PM</text>
  <text x="256" y="400" text-anchor="middle"
        font-family="ui-monospace, 'SF Mono', monospace"
        font-weight="600" font-size="48" fill="#aab8d9"
        letter-spacing="6">PMBOK</text>
</svg>
`;

export const ICON_MASKABLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="PMBOK Prep maskable">
  <rect width="512" height="512" fill="#0e1d3a"/>
  <g transform="translate(96 96)">
    <text x="160" y="192" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-weight="700" font-size="150" fill="#f0b952"
          letter-spacing="-6">PM</text>
    <text x="160" y="276" text-anchor="middle"
          font-family="ui-monospace, 'SF Mono', monospace"
          font-weight="600" font-size="36" fill="#aab8d9"
          letter-spacing="4">PMBOK</text>
  </g>
</svg>
`;
