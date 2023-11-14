import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: "https://app.uidesign.ai",
  server: {
    port: 3030,
    // headers: {
    //   "Cross-Origin-Embedder-Policy": "require-corp",
    //   "Cross-Origin-Opener-Policy": "same-origin",
    // },
  },
});
