/* Acme Onboarding icons — clock-face glyph to signal the
   time-logging workflow this pack teaches. Distinct palette from
   the consumer packs so swap visibility is obvious. */

export const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Acme Onboarding">
  <rect width="512" height="512" rx="96" fill="#1e293b"/>
  <circle cx="256" cy="256" r="148" fill="none" stroke="#fbbf24" stroke-width="20"/>
  <line x1="256" y1="256" x2="256" y2="148" stroke="#fbbf24" stroke-width="18" stroke-linecap="round"/>
  <line x1="256" y1="256" x2="332" y2="256" stroke="#fbbf24" stroke-width="14" stroke-linecap="round"/>
  <circle cx="256" cy="256" r="10" fill="#fbbf24"/>
  <text x="256" y="450" text-anchor="middle"
        font-family="ui-monospace, 'SF Mono', monospace"
        font-weight="700" font-size="44" fill="#fbbf24"
        letter-spacing="6">ACME</text>
</svg>
`;

export const ICON_MASKABLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Acme Onboarding maskable">
  <rect width="512" height="512" fill="#1e293b"/>
  <g transform="translate(96 96)">
    <circle cx="160" cy="160" r="100" fill="none" stroke="#fbbf24" stroke-width="16"/>
    <line x1="160" y1="160" x2="160" y2="86" stroke="#fbbf24" stroke-width="14" stroke-linecap="round"/>
    <line x1="160" y1="160" x2="212" y2="160" stroke="#fbbf24" stroke-width="12" stroke-linecap="round"/>
    <circle cx="160" cy="160" r="8" fill="#fbbf24"/>
  </g>
</svg>
`;
