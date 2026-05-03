/* SVG markup for the CCA-F Prep favicons + PWA icons.
   Inlined as strings so the icon route handlers can serve them
   directly from the active pack without a static-file copy step. */

export const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="CCA-F Prep">
  <rect width="512" height="512" rx="96" fill="#0e0f12"/>
  <text x="256" y="280" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-weight="700" font-size="220" fill="#d97757"
        letter-spacing="-12">C</text>
  <text x="256" y="392" text-anchor="middle"
        font-family="ui-monospace, 'SF Mono', monospace"
        font-weight="600" font-size="56" fill="#8a92a3"
        letter-spacing="6">CCA-F</text>
</svg>
`;

export const ICON_MASKABLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="CCA-F Prep maskable">
  <rect width="512" height="512" fill="#0e0f12"/>
  <g transform="translate(96 96)">
    <text x="160" y="184" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-weight="700" font-size="180" fill="#d97757"
          letter-spacing="-8">C</text>
    <text x="160" y="276" text-anchor="middle"
          font-family="ui-monospace, 'SF Mono', monospace"
          font-weight="600" font-size="44" fill="#8a92a3"
          letter-spacing="4">CCA-F</text>
  </g>
</svg>
`;
