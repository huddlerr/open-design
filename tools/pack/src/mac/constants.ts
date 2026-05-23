export const PRODUCT_NAME = "Design Jury";

export const INTERNAL_PACKAGES = [
  { directory: "packages/contracts", name: "@design-jury/contracts" },
  { directory: "packages/registry-protocol", name: "@design-jury/registry-protocol" },
  { directory: "packages/sidecar-proto", name: "@design-jury/sidecar-proto" },
  { directory: "packages/sidecar", name: "@design-jury/sidecar" },
  { directory: "packages/platform", name: "@design-jury/platform" },
  { directory: "packages/agui-adapter", name: "@design-jury/agui-adapter" },
  { directory: "packages/plugin-runtime", name: "@design-jury/plugin-runtime" },
  { directory: "packages/diagnostics", name: "@design-jury/diagnostics" },
  { directory: "apps/daemon", name: "@design-jury/daemon" },
  { directory: "apps/web", name: "@design-jury/web" },
  { directory: "apps/desktop", name: "@design-jury/desktop" },
  { directory: "apps/packaged", name: "@design-jury/packaged" },
] as const;

export const DESKTOP_LOG_ECHO_ENV = "OD_DESKTOP_LOG_ECHO";
export const WEB_STANDALONE_HOOK_CONFIG_ENV = "OD_TOOLS_PACK_WEB_STANDALONE_HOOK_CONFIG";
export const WEB_STANDALONE_RESOURCE_NAME = "design-jury-web-standalone";
export const ELECTRON_BUILDER_ASAR = false;
export const ELECTRON_BUILDER_BUILD_DEPENDENCIES_FROM_SOURCE = false;
export const ELECTRON_REBUILD_MODE = "sequential" as const;
export const ELECTRON_REBUILD_NATIVE_MODULES = ["better-sqlite3"] as const;
export const ELECTRON_BUILDER_FILE_PATTERNS = [
  "**/*",
  "!**/node_modules/.bin",
  "!**/node_modules/electron{,/**/*}",
  "!**/*.map",
  "!**/*.tsbuildinfo",
  "!**/.next/cache",
  "!**/.next/cache/**",
  "!**/node_modules/better-sqlite3/build/Release/obj",
  "!**/node_modules/better-sqlite3/build/Release/obj/**",
  "!**/node_modules/better-sqlite3/deps",
  "!**/node_modules/better-sqlite3/deps/**",
] as const;
// Keep Electron native UI resources aligned with the Web UI locale set.
// Electron uses underscore-separated locale ids; its base "es" resource
// covers the app's es-ES dictionary.
export const MAC_ELECTRON_LANGUAGES = [
  "en",
  "de",
  "zh_CN",
  "zh_TW",
  "pt_BR",
  "es",
  "ru",
  "fa",
  "ar",
  "ja",
  "ko",
  "pl",
  "hu",
  "fr",
  "uk",
  "tr",
] as const;
