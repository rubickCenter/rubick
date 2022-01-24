import path from "path";
import originfs from "original-fs";

const app_paths = [
  "/usr/share/applications",
  "/var/lib/snapd/desktop/applications",
  `${window.process.env.HOME}/.local/share/applications`,
];
const emptyIcon = "";

function dirAppRead(dir, target) {
  let files: Array<string> | null = null;
  try {
    if (!originfs.existsSync(dir)) return;
    files = originfs.readdirSync(dir);
  } catch (e) {
    return;
  }
  if (files.length !== 0) {
    for (const file of files) {
      const app = path.join(dir, file);
      path.extname(app) === ".desktop" && target.push(app);
    }
  }
}

function convertEntryFile2Feature(appPath) {
  let appInfo: any = null;
  try {
    appInfo = originfs.readFileSync(appPath, "utf8");
  } catch (e) {
    return null;
  }
  if (!appInfo.includes("[Desktop Entry]")) {
    return null;
  }
  appInfo = appInfo
    .substr(appInfo.indexOf("[Desktop Entry]"))
    .replace("[Desktop Entry]", "")
    .trim();

  /**
   * appInfo eg:
   * Version=1.0
   * Name=FireFox
   * Name[ar]=***
   * Name[ast]=***
   * [Desktop Action new-private-window]
   * Name=***
   */
  const splitIndex = appInfo.indexOf("\n[");

  if (splitIndex > 0) {
    appInfo = appInfo.substr(0, splitIndex).trim();
  }

  const targetAppInfo: any = {};
  appInfo.match(/^[\w\-[\]]+ ?=.*$/gm).forEach((e) => {
    const index = e.indexOf("=");
    targetAppInfo[e.substr(0, index).trim()] = e.substr(index + 1).trim();
  });

  /**
   * targetAppInfo = {
   * Type: "Application",
   * Version: "1.0",
   * Exec: "xxxx",
   * }
   */

  if (targetAppInfo.Type !== "Application") {
    return null;
  }
  if (!targetAppInfo.Exec) {
    return null;
  }
  if (
    targetAppInfo.NoDisplay === "true" &&
    !targetAppInfo.Exec.startsWith("gnome-control-center")
  ) {
    return null;
  }
  let os = String(window.process.env.DESKTOP_SESSION).toLowerCase();
  if (os === "ubuntu") {
    os = "gnome";
    if (
      targetAppInfo.OnlyShowIn &&
      !targetAppInfo.OnlyShowIn.toLowerCase().includes(os)
    ) {
      return null;
    }
  }
  if (
    targetAppInfo.NotShowIn &&
    targetAppInfo.NotShowIn.toLowerCase().includes(os)
  ) {
    return null;
  }
  let icon = targetAppInfo.Icon;
  if (!icon) return null;
  if (icon.startsWith("/")) {
    if (!originfs.existsSync(icon)) return null;
  } else if (
    appPath.startsWith("/usr/share/applications") ||
    appPath.startsWith("/var/lib/snapd/desktop/applications")
  ) {
    icon = getIcon(icon);
  } else {
    if (
      !appPath.startsWith(
        (window as any).process.env.HOME + "/.local/share/applications"
      )
    )
      return null;
    appPath = path.join(
      (window as any).process.env.HOME,
      ".local/share/icons",
      appPath + ".png"
    );
    originfs.existsSync(appPath) || (appPath = emptyIcon);
  }
  let desc = "";
  const LANG = (window as any).process.env.LANG.split(".")[0];
  if (`Comment[${LANG}]` in targetAppInfo) {
    desc = targetAppInfo[`Comment[${LANG}]`];
  } else if (targetAppInfo.Comment) {
    desc = targetAppInfo.Comment;
  } else {
    desc = appPath;
  }

  let execPath = targetAppInfo.Exec.replace(/ %[A-Za-z]/g, "")
    .replace(/"/g, "")
    .trim();
  targetAppInfo.Terminal === "true" &&
    (execPath = "gnome-terminal -x " + execPath);

  const info = {
    value: "plugin",
    pluginType: "app",
    desc,
    icon: "file://" + icon,
    keyWords: [targetAppInfo.Name],
    action: execPath,
  };

  if ("X-Ubuntu-Gettext-Domain" in targetAppInfo) {
    const cmd = targetAppInfo["X-Ubuntu-Gettext-Domain"];
    cmd && cmd !== targetAppInfo.Name && info.keyWords.push(cmd);
  }
  return info;
}

function getIcon(filePath) {
  const themes = [
    "ubuntu-mono-dark",
    "ubuntu-mono-light",
    "Yaru",
    "hicolor",
    "Adwaita",
    "Humanity",
  ];

  const sizes = ["48x48", "48", "scalable", "256x256", "512x512", "256", "512"];
  const types = [
    "apps",
    "categories",
    "devices",
    "mimetypes",
    "legacy",
    "actions",
    "places",
    "status",
    "mimes",
  ];
  const exts = [".png", ".svg"];
  for (const theme of themes) {
    for (const size of sizes) {
      for (const type of types) {
        for (const ext of exts) {
          let iconPath = path.join(
            "/usr/share/icons",
            theme,
            size,
            type,
            filePath + ext
          );
          if (originfs.existsSync(iconPath)) return iconPath;
          iconPath = path.join(
            "/usr/share/icons",
            theme,
            type,
            size,
            filePath + ext
          );
          if (originfs.existsSync(iconPath)) return iconPath;
        }
      }
    }
  }
  return originfs.existsSync(path.join("/usr/share/pixmaps", filePath + ".png"))
    ? path.join("/usr/share/pixmaps", filePath + ".png")
    : emptyIcon;
}

export default () => {
  const apps: any = [];
  const fileList = [];
  app_paths.forEach((dir) => {
    dirAppRead(dir, fileList);
  });

  fileList.forEach((e) => {
    apps.push(convertEntryFile2Feature(e));
  });
  return apps.filter((app) => !!app);
};
