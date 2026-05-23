export const PRODUCT_NAME = "Design Jury";
export const DESKTOP_LOG_ECHO_ENV = "OD_DESKTOP_LOG_ECHO";
export const WEB_STANDALONE_HOOK_CONFIG_ENV = "OD_TOOLS_PACK_WEB_STANDALONE_HOOK_CONFIG";
export const WEB_STANDALONE_RESOURCE_NAME = "design-jury-web-standalone";
export const ELECTRON_BUILDER_ASAR = false;
export const ELECTRON_BUILDER_BUILD_DEPENDENCIES_FROM_SOURCE = false;
export const ELECTRON_BUILDER_NODE_GYP_REBUILD = false;
export const ELECTRON_BUILDER_NPM_REBUILD = false;
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
export const NSIS_INSTALLER_LANGUAGE_BY_WEB_LOCALE = {
  en: "en_US",
  fa: "fa_IR",
  "pt-BR": "pt_BR",
  ru: "ru_RU",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
} as const;
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
