import { defineConfig } from "vitest/config";
import path from "path";

const PACK_ID = process.env.NEXT_PUBLIC_CONTENT_PACK_ID || "cca-f-prep";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/__tests__/**/*.test.ts", "src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@active-pack": path.resolve(__dirname, `./content-packs/${PACK_ID}`),
    },
  },
});
