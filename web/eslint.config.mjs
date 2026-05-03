import nextCore from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCore,
  ...nextTs,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "e2e/**",
      "playwright-report/**",
      // Pack-authored curriculum files mark themselves with their own
      // /* eslint-disable */ header — no global ignore needed here.
    ],
  },
];

export default eslintConfig;
