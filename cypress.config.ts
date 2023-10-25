import { defineConfig } from "cypress";
import { APP_URL } from "./src/env";

export default defineConfig({
  e2e: {
    baseUrl: APP_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
