/* Security awareness icons — shield + check in emerald. */

export const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Security awareness">
  <rect width="512" height="512" rx="96" fill="#064e3b"/>
  <path d="M256 96 L376 144 V272 q0 96-120 144 q-120-48-120-144 V144 z"
        fill="#34d399"/>
  <path d="M192 256 L240 304 L324 220"
        stroke="#064e3b" stroke-width="28" fill="none"
        stroke-linecap="round" stroke-linejoin="round"/>
  <text x="256" y="470" text-anchor="middle"
        font-family="ui-monospace, 'SF Mono', monospace"
        font-weight="700" font-size="38" fill="#34d399"
        letter-spacing="6">SECURE</text>
</svg>
`;

export const ICON_MASKABLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Security awareness maskable">
  <rect width="512" height="512" fill="#064e3b"/>
  <g transform="translate(96 96)">
    <path d="M160 36 L248 72 V164 q0 64-88 96 q-88-32-88-96 V72 z"
          fill="#34d399"/>
    <path d="M112 160 L148 196 L208 132"
          stroke="#064e3b" stroke-width="20" fill="none"
          stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;
