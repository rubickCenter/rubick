# Linux arm64 build notes

This note documents the current local path for building a Linux arm64 package for Rubick.
It is intended for maintainers and users who want to test an arm64 Debian package before an official release is published.

## Supported target

- The current Electron Builder configuration in `vue.config.js` defines the Linux package target as `deb`.
- The Linux icon directory is `public/icons/` and the package product name is `rubick`.
- The project uses Electron `26.0.0`, Electron Builder, and Vue CLI Electron Builder.
- The repository pins Node.js `16.20.2` in the `volta` section of `package.json`.
- Building on a native arm64 Linux host is the safest option because native dependencies are installed for the host architecture.
- Cross-building from x64 Linux may require extra Electron Builder and system configuration that is outside the default project setup.

## Prerequisites

- Use Linux arm64/aarch64 for the machine or container that runs the package build.
- Use Node.js `16.20.2` when possible; Volta can install the pinned version automatically.
- Use the npm version resolved by the project lockfile and scripts instead of mixing package managers.
- Install standard Debian packaging helpers such as `dpkg`, `fakeroot`, and `rpm` if Electron Builder reports missing tools.
- Install build essentials such as `python3`, `make`, and `g++` so native Node modules can rebuild.
- Ensure Git subdirectories are clean before packaging because Electron Builder copies the app output into the final artifact.

## Commands

```bash
npm install
npm run postinstall
npm run electron:build -- --linux deb --arm64
```

If the build environment already runs on arm64, Electron Builder may also infer the host architecture:

```bash
npm run electron:build -- --linux deb
```

## Expected artifact

- The default Linux output is a Debian package because `vue.config.js` sets `linux.target` to `deb`.
- The generated file is written under the Electron Builder output directory, commonly `dist_electron/`.
- The artifact name is controlled by Electron Builder when no Linux-specific `artifactName` is set.
- Check the build log for the exact `.deb` path and architecture suffix.
- For issue triage, include the package filename, host architecture from `uname -m`, and Node version from `node -v`.

## Native dependency notes

- `uiohook-napi` and clipboard-related packages may need architecture-specific native binaries or a local rebuild.
- If `npm install` fails on a native module, remove `node_modules` and reinstall on the same arm64 host used for packaging.
- Run `npm run postinstall` after dependency changes so `electron-builder install-app-deps` can rebuild Electron native modules.
- Avoid copying `node_modules` from an x64 machine into an arm64 build environment.

## Troubleshooting

- If Electron download fails, configure the Electron mirror used by your network and retry `npm install`.
- If the build fails with a missing system package, install the package named in the Electron Builder error and rerun the same command.
- If the resulting package installs but the app does not start, run it from a terminal and attach the native module error to the issue.
- If the artifact architecture is not arm64, confirm the build command includes `--arm64` or that the host is actually `aarch64`.
- If cross-building is required, document the host distribution and Electron Builder version because results can vary by distro.

Related discussion: https://github.com/rubickCenter/rubick/issues/486
