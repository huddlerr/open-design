import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { ToolPackCache } from "../cache.js";
import type { ToolPackConfig } from "../config.js";
import { processWebSourcemaps } from "../web-sourcemaps.js";
import { ensureWorkspaceBuildArtifacts } from "../workspace-build.js";
import { runPnpm } from "./commands.js";

async function buildWorkspaceArtifacts(config: ToolPackConfig): Promise<void> {
  const webNextEnvPath = join(config.workspaceRoot, "apps", "web", "next-env.d.ts");
  const previousWebNextEnv = await readFile(webNextEnvPath, "utf8").catch(() => null);

  await runPnpm(config, ["--filter", "@design-jury/contracts", "build"]);
  await runPnpm(config, ["--filter", "@design-jury/registry-protocol", "build"]);
  await runPnpm(config, ["--filter", "@design-jury/sidecar-proto", "build"]);
  await runPnpm(config, ["--filter", "@design-jury/sidecar", "build"]);
  await runPnpm(config, ["--filter", "@design-jury/platform", "build"]);
  await runPnpm(config, ["--filter", "@design-jury/agui-adapter", "build"]);
  await runPnpm(config, ["--filter", "@design-jury/plugin-runtime", "build"]);
  await runPnpm(config, ["--filter", "@design-jury/diagnostics", "build"]);
  await runPnpm(config, ["--filter", "@design-jury/daemon", "build"]);
  try {
    await runPnpm(config, ["--filter", "@design-jury/web", "build"], {
      OD_WEB_OUTPUT_MODE: config.webOutputMode,
    });
    await runPnpm(config, ["--filter", "@design-jury/web", "build:sidecar"]);
    // Inject chunk IDs + upload browser sourcemaps to PostHog, then strip
    // .map files. Runs before any packaging step copies the web output into
    // the Electron resources so .map never ends up inside the .app bundle.
    await processWebSourcemaps(config);
  } finally {
    if (previousWebNextEnv == null) {
      await rm(webNextEnvPath, { force: true });
    } else {
      await writeFile(webNextEnvPath, previousWebNextEnv, "utf8");
    }
  }
  await runPnpm(config, ["--filter", "@design-jury/desktop", "build"]);
  await runPnpm(config, ["--filter", "@design-jury/packaged", "build"]);
}

export async function ensureMacWorkspaceBuild(config: ToolPackConfig, cache: ToolPackCache): Promise<void> {
  await ensureWorkspaceBuildArtifacts(config, cache, async () => {
    await buildWorkspaceArtifacts(config);
  });
}
