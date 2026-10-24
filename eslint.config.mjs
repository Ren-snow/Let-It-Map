import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Domain layer must stay framework-independent.
  // Everything under src/server/ is plain TypeScript + Drizzle, so it can be
  // lifted into a separate backend later without a rewrite.
  // The only exception is actions.ts, the adapter that binds it to Next.js.
  {
    files: ["src/server/**/*.ts"],
    ignores: ["src/server/**/actions.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next", "next/*", "server-only", "react", "react-dom"],
              message:
                "The domain layer must not depend on Next.js or React. Move framework glue into src/server/**/actions.ts.",
            },
            {
              group: ["@/lib/auth", "@/lib/auth/*"],
              message:
                "Do not read the session inside the domain layer. Resolve the user in actions.ts and pass userId as an argument.",
            },
            {
              group: ["@/features/*", "@/components/*", "@/app/*"],
              message:
                "The domain layer must not import UI. Dependencies point from UI to src/server/, never the other way.",
            },
          ],
        },
      ],
    },
  },
  // UI must not talk to the database directly.
  {
    files: [
      "src/app/**/*.{ts,tsx}",
      "src/features/**/*.{ts,tsx}",
      "src/components/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/server/db", "@/server/db/*", "drizzle-orm", "drizzle-orm/*"],
              message:
                "Database access belongs in src/server/. Call a query or an action instead.",
            },
          ],
        },
      ],
    },
  },
  // Routing layer: pages map a URL to one screen and nothing else.
  {
    files: ["src/app/**/page.tsx", "src/app/**/layout.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/server/*/queries", "@/server/*/mutations", "@/server/db", "@/server/db/*"],
              message:
                "app/ is routing only. Fetch inside features/{domain}/screens/ instead.",
            },
          ],
        },
      ],
    },
  },
  // Presentational components receive data as props.
  {
    files: ["src/features/*/components/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/server/*/queries", "@/server/*/mutations"],
              message:
                "Data fetching belongs in features/{domain}/screens/. Take it as a prop.",
            },
            {
              group: ["@/server/db", "@/server/db/*", "drizzle-orm", "drizzle-orm/*"],
              message: "Database access belongs in src/server/.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
