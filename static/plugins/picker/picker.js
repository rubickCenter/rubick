const {ipcRenderer} = require("electron");
let colorDomBoxs = null;

ipcRenderer.on("updatePicker", ((e, args) => {
  if (!colorDomBoxs) {
    colorDomBoxs = [];
    document.querySelectorAll(".content>div").forEach((e => {
      colorDomBoxs.push(e.querySelectorAll(":scope > div"))
    }));
  }
  for (let i = 0; i < 9; i ++){
    for (let j = 0; j < 9; j ++) {
      colorDomBoxs[i][j].style.background = '#' + args[i][j]
    }
  }
}));

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") ipcRenderer.send("closePicker");
  },
  false
);
