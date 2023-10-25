import { CodegenConfig } from "@graphql-codegen/cli";
import { REST_API_URL } from "./src/env";

const config: CodegenConfig = {
  schema: `${REST_API_URL}/graphql`,
  documents: ["src/**/*.{tsx,ts}"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/": {
      preset: "client",
    },
  },
};

export default config;
