import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { resolveWinInstallIdentity } from "../src/win/identity.js";

describe("resolveWinInstallIdentity", () => {
  it("keeps the default namespace on the canonical Windows display name", () => {
    expect(resolveWinInstallIdentity({ namespace: "default" })).toMatchObject({
      displayName: "Design Jury",
      shortcutName: "Design Jury.lnk",
      uninstallerName: "Uninstall Design Jury.exe",
    });
  });

  it("uses the canonical Windows display name for stable release namespaces", () => {
    expect(resolveWinInstallIdentity({ namespace: "release-stable-win" })).toMatchObject({
      appPathsKey: "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Design Jury.exe",
      displayName: "Design Jury",
      registryKey: "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Design Jury-release-stable-win",
      shortcutName: "Design Jury.lnk",
      uninstallerName: "Uninstall Design Jury.exe",
    });
  });

  it("uses first-class beta display identity for beta release namespaces", () => {
    expect(resolveWinInstallIdentity({ namespace: "release-beta-win" })).toMatchObject({
      appPathsKey: "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Design Jury Beta.exe",
      displayName: "Design Jury Beta",
      registryKey: "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Design Jury-release-beta-win",
      shortcutName: "Design Jury Beta.lnk",
      uninstallerName: "Uninstall Design Jury Beta.exe",
    });
  });

  it("keeps non-release beta-like namespaces isolated from the real beta channel identity", () => {
    expect(resolveWinInstallIdentity({ namespace: "beta-local-flow" })).toMatchObject({
      appPathsKey: "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Design Jury beta-local-flow.exe",
      displayName: "Design Jury beta-local-flow",
      registryKey: "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Design Jury-beta-local-flow",
      shortcutName: "Design Jury beta-local-flow.lnk",
      uninstallerName: "Uninstall Design Jury beta-local-flow.exe",
    });
  });

  it("uses first-class preview display identity for preview release namespaces", () => {
    expect(resolveWinInstallIdentity({ namespace: "release-preview-win" })).toMatchObject({
      appPathsKey: "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Design Jury Preview.exe",
      displayName: "Design Jury Preview",
      registryKey: "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Design Jury-release-preview-win",
      shortcutName: "Design Jury Preview.lnk",
      uninstallerName: "Uninstall Design Jury Preview.exe",
    });
  });

  it("uses first-class nightly display identity for nightly release versions and namespaces", () => {
    expect(resolveWinInstallIdentity({
      appVersion: "0.8.0.nightly.2",
      namespace: "release-stable-win",
    })).toMatchObject({
      appPathsKey: "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Design Jury Nightly.exe",
      displayName: "Design Jury Nightly",
      registryKey: "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Design Jury-release-stable-win",
      shortcutName: "Design Jury Nightly.lnk",
      uninstallerName: "Uninstall Design Jury Nightly.exe",
    });
    expect(resolveWinInstallIdentity({ namespace: "release-nightly-win" })).toMatchObject({
      displayName: "Design Jury Nightly",
      shortcutName: "Design Jury Nightly.lnk",
    });
  });

  it("keeps the registry DisplayName free of the package version", async () => {
    const source = await readFile(new URL("../src/win/custom-installer.ts", import.meta.url), "utf8");
    expect(source).toContain('WriteRegStr HKCU "${registryKey}" "DisplayName" "${productName}"');
    expect(source).not.toContain('"DisplayName" "${productName} \\${APP_VERSION}"');
  });

  it("checks the silent install target directory for running instances before overwriting files", async () => {
    const source = await readFile(new URL("../src/win/custom-installer.ts", import.meta.url), "utf8");
    const silentCheck = source.slice(source.indexOf("silent_check:"), source.indexOf("IfFileExists \"$INSTDIR\\\\${exeName}\" existing_install"));
    expect(silentCheck).toContain('IfFileExists "$INSTDIR\\\\${exeName}" 0 silent_detect_running_instances');
    expect(silentCheck).toContain('StrCpy $RunningInstancesInstallRoot "$INSTDIR"');
    expect(silentCheck.indexOf('StrCpy $RunningInstancesInstallRoot "$INSTDIR"')).toBeLessThan(
      silentCheck.indexOf("Call DetectRunningInstances"),
    );
  });
});
