import { join } from "node:path";

import { describe, expect, it } from "vitest";

import type { ToolPackConfig } from "../src/config.js";
import { resolveMacInstallIdentity } from "../src/mac/identity.js";
import { resolveMacPaths } from "../src/mac/paths.js";

function makeConfig(root: string, namespace: string): ToolPackConfig {
  return {
    containerized: false,
    electronBuilderCliPath: "/x/electron-builder/cli.js",
    electronDistPath: "/x/electron/dist",
    electronVersion: "41.3.0",
    macCompression: "normal",
    namespace,
    platform: "mac",
    portable: true,
    removeData: false,
    removeLogs: false,
    removeProductUserData: false,
    removeSidecars: false,
    roots: {
      output: {
        appBuilderRoot: join(root, ".tmp", "tools-pack", "out", "mac", "namespaces", namespace, "builder"),
        namespaceRoot: join(root, ".tmp", "tools-pack", "out", "mac", "namespaces", namespace),
        platformRoot: join(root, ".tmp", "tools-pack", "out", "mac"),
        root: join(root, ".tmp", "tools-pack", "out"),
      },
      runtime: {
        namespaceBaseRoot: join(root, ".tmp", "tools-pack", "runtime", "mac", "namespaces"),
        namespaceRoot: join(root, ".tmp", "tools-pack", "runtime", "mac", "namespaces", namespace),
      },
      cacheRoot: join(root, ".tmp", "tools-pack", "cache"),
      toolPackRoot: join(root, ".tmp", "tools-pack"),
    },
    signed: false,
    silent: true,
    to: "dmg",
    webOutputMode: "standalone",
    workspaceRoot: root,
  };
}

describe("resolveMacInstallIdentity", () => {
  it("keeps stable builds on the canonical mac identity", () => {
    expect(resolveMacInstallIdentity(makeConfig("/work", "release-stable"))).toMatchObject({
      appId: "io.design-jury.desktop",
      installerTitle: "Design Jury",
      productName: "Design Jury",
      publicAppBundleName: "Design Jury.app",
      systemAppBundleName: "Design Jury.app",
    });
  });

  it("uses first-class beta app identity for beta release namespaces", () => {
    const config = makeConfig("/work", "release-beta");

    expect(resolveMacInstallIdentity(config)).toEqual({
      appId: "io.design-jury.desktop.beta",
      executableName: "Design Jury Beta",
      installerTitle: "Design Jury Beta",
      productName: "Design Jury Beta",
      publicAppBundleName: "Design Jury Beta.app",
      systemAppBundleName: "Design Jury Beta.app",
    });
    expect(resolveMacPaths(config).appPath).toMatch(/Design Jury Beta\.app$/);
  });

  it("uses first-class preview app identity for preview release namespaces", () => {
    const config = makeConfig("/work", "release-preview");

    expect(resolveMacInstallIdentity(config)).toEqual({
      appId: "io.design-jury.desktop.preview",
      executableName: "Design Jury Preview",
      installerTitle: "Design Jury Preview",
      productName: "Design Jury Preview",
      publicAppBundleName: "Design Jury Preview.app",
      systemAppBundleName: "Design Jury Preview.app",
    });
    expect(resolveMacPaths(config).appPath).toMatch(/Design Jury Preview\.app$/);
  });

  it("uses first-class nightly app identity for nightly release versions and namespaces", () => {
    const nightlyVersionConfig = {
      ...makeConfig("/work", "release-stable"),
      appVersion: "0.8.0.nightly.2",
    };
    const nightlyNamespaceConfig = makeConfig("/work", "release-nightly");

    expect(resolveMacInstallIdentity(nightlyVersionConfig)).toEqual({
      appId: "io.design-jury.desktop.nightly",
      executableName: "Design Jury Nightly",
      installerTitle: "Design Jury Nightly",
      productName: "Design Jury Nightly",
      publicAppBundleName: "Design Jury Nightly.app",
      systemAppBundleName: "Design Jury Nightly.app",
    });
    expect(resolveMacPaths(nightlyVersionConfig).appPath).toMatch(/Design Jury Nightly\.app$/);
    expect(resolveMacInstallIdentity(nightlyNamespaceConfig)).toMatchObject({
      productName: "Design Jury Nightly",
      publicAppBundleName: "Design Jury Nightly.app",
    });
  });
});
