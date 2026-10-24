import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Flat config replaces a rule rather than merging it, so a file matching
// several blocks only keeps the last one. Every block below therefore spells
// out its whole list, composed from these shared pieces.

const NO_FRAMEWORK = {
  group: ["next", "next/*", "server-only", "react", "react-dom", "hono", "hono/*"],
  message:
    "The domain layer must not depend on a framework. Framework glue belongs in src/server/api/.",
};

const NO_SESSION = {
  group: ["@/lib/auth", "@/lib/auth/*"],
  message:
    "Do not read the session in the domain layer. Resolve the user in the adapter and pass userId as an argument.",
};

const NO_UI = {
  group: ["@/features/*", "@/features/*/*", "@/components/*", "@/app/*"],
  message:
    "The domain layer must not import UI. Dependencies point from UI to src/server/, never the other way.",
};

const NO_SQL = {
  group: ["drizzle-orm", "drizzle-orm/*", "@/server/db", "@/server/db/*"],
  message:
    "SQL belongs in a repository. A service declares the unit of work with @/server/transaction and nothing more.",
};

const NO_FOREIGN_REPOSITORY = {
  group: ["@/server/*/repository"],
  message:
    "Never reach into another domain's repository. Go through its service (@/server/<domain>/service).",
};

const NO_SERVICE_FROM_REPOSITORY = {
  group: ["./service", "@/server/*/service"],
  message: "A repository must not call back up into a service.",
};

const NO_DB_FROM_UI = {
  group: ["drizzle-orm", "drizzle-orm/*", "@/server/db", "@/server/db/*"],
  message: "Database access belongs in src/server/.",
};

const NO_DOMAIN_INTERNALS = {
  group: ["@/server/*/repository", "@/server/db", "@/server/db/*"],
  message: "Call a service (@/server/<domain>/service), not the layers beneath it.",
};

const NO_DEEP_FEATURE = {
  group: [
    "@/features/*/screens/*",
    "@/features/*/components/*",
    "@/features/*/hooks/*",
  ],
  message:
    "Import through the feature's entry point (@/features/<name>). Inside the same feature, use a relative path.",
};

const NO_FETCHING = {
  group: ["@/server/*/service", "@/server/*/queries", "@/server/*/mutations"],
  message:
    "Data fetching belongs in features/{domain}/screens/. Take the data as a prop.",
};

const restrict = (...patterns) => ({
  "no-restricted-imports": ["error", { patterns }],
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // ---- Domain layer -------------------------------------------------------
  // Framework-independent, so it can be lifted into a separate backend later.
  {
    files: ["src/server/**/*.ts"],
    ignores: ["src/server/**/actions.ts", "src/server/api/**"],
    rules: restrict(NO_FRAMEWORK, NO_SESSION, NO_UI),
  },
  // Services own business rules. No SQL, no other domain's repository.
  {
    files: ["src/server/*/service.ts"],
    rules: restrict(NO_FRAMEWORK, NO_SESSION, NO_UI, NO_SQL, NO_FOREIGN_REPOSITORY),
  },
  // Repositories own SQL. They never call back up.
  {
    files: ["src/server/*/repository.ts"],
    rules: restrict(NO_FRAMEWORK, NO_SESSION, NO_UI, NO_SERVICE_FROM_REPOSITORY),
  },
  // Adapters may know the framework, but not the layers below the service.
  {
    files: ["src/server/api/**/*.ts", "src/server/**/actions.ts"],
    rules: restrict(NO_UI, NO_FOREIGN_REPOSITORY, NO_DB_FROM_UI),
  },

  // ---- UI -----------------------------------------------------------------
  {
    files: [
      "src/app/**/*.{ts,tsx}",
      "src/features/**/*.{ts,tsx}",
      "src/components/**/*.{ts,tsx}",
    ],
    rules: restrict(NO_DOMAIN_INTERNALS, NO_DEEP_FEATURE),
  },
  // Pages map a URL to one screen and nothing else.
  {
    files: ["src/app/**/page.tsx", "src/app/**/layout.tsx"],
    rules: restrict(NO_DOMAIN_INTERNALS, NO_DEEP_FEATURE, NO_FETCHING),
  },
  // Presentational components receive data as props.
  {
    files: ["src/features/*/components/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    rules: restrict(NO_DOMAIN_INTERNALS, NO_DEEP_FEATURE, NO_FETCHING),
  },
]);

export default eslintConfig;
