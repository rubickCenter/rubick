const {TouchBar} = require('electron')
const path = require('path')
const si = require('systeminformation');
const spawn = require('child_process').spawn;

const {TouchBarButton, TouchBarSpacer} = TouchBar;

const LOAD_NORMAL = "#2ecc71";
const LOAD_MEDIUM = "#f1c40f";
const LOAD_HIGH = "#d35400";
const LOAD_SEVERE = "#e74c3c";

const cpu = new TouchBarButton({
  label: '',
  backgroundColor: "#bdc3c7",
  icon: path.join(__dirname, 'icons/chip.png'),
  iconPosition: "left",
  click: () => {
    spawn("/System/Applications/Utilities/Activity Monitor.app/Contents/MacOS/Activity\ Monitor", []);
  }
});

const memory = new TouchBarButton({
  label: '',
  backgroundColor: "#bdc3c7",
  icon: path.join(__dirname, 'icons/ram.png'),
  iconPosition: "left"
});

const network = new TouchBarButton({
  label: '',
  backgroundColor: '#3498db',
  icon: path.join(__dirname, 'icons/internet.png'),
  iconPosition: "left"
});

const battery = new TouchBarButton({
  label: '',
  backgroundColor: "#bdc3c7",
  icon: path.join(__dirname, 'icons/power.png'),
  iconPosition: "left"
});

const updateData = () => {
  si.currentLoad(function(data) {
    if (typeof data !== 'undefined' && data){
      const load = data.currentLoad.toFixed(0)
      cpu.label = load+"%"
      if (load <= 20) cpu.backgroundColor = LOAD_NORMAL;
      else if (load > 20 && load <= 40) cpu.backgroundColor = LOAD_MEDIUM;
      else if (load > 40 && load <= 80) cpu.backgroundColor = LOAD_HIGH;
      else if (load > 80 && load <= 100) cpu.backgroundColor = LOAD_SEVERE;
    }
  })
  si.mem(function(data) {
    if (typeof data !== 'undefined' && data){
      const load = ((100* data.active ) / data.total).toFixed(0)
      memory.label = load+"%"
      if (load <= 20) memory.backgroundColor = LOAD_NORMAL;
      else if (load > 20 && load <= 40) memory.backgroundColor = LOAD_MEDIUM;
      else if (load > 40 && load <= 80) memory.backgroundColor = LOAD_HIGH;
      else if (load > 80 && load <= 100) memory.backgroundColor = LOAD_SEVERE;
    }

  })
  si.networkStats("", function(data) {
    if (typeof data !== 'undefined' && data){
      const kbtx = (data[0].tx_sec * 0.001).toFixed(0)
      const kbrx = (data[0].rx_sec * 0.001).toFixed(0)
      const l = (kbtx+kbrx).toString().length

      network.label = "⇡"+ (kbtx*0.001).toFixed(2)
        +" ⇣"+ (kbrx*0.001).toFixed(2) +" MB/s"

    }
  })

  si.battery( function(data) {
    if (typeof data !== 'undefined' && data){
      if (data.ischarging){
        battery.icon = path.join(__dirname, 'icons/charger.png')
      }else{
        battery.icon = path.join(__dirname, 'icons/power.png')
      }
      const load = data.percent.toFixed(0)
      battery.label = load+"%"
      if (load <= 20) battery.backgroundColor = LOAD_SEVERE;
      else if (load > 20 && load <= 40) battery.backgroundColor = LOAD_HIGH;
      else if (load > 40 && load <= 80) battery.backgroundColor = LOAD_MEDIUM;
      else if (load > 80 && load <= 100) battery.backgroundColor = LOAD_NORMAL
    }
  })
}

const touchBar = new TouchBar({
  items: [
    cpu,
    new TouchBarSpacer({size: 'small'}),
    memory,
    new TouchBarSpacer({size: 'small'}),
    network,
    new TouchBarSpacer({size: 'small'}),
    battery,
  ]
})

let intervalObj;

const start = (window) => {
  window.on('blur', () => {
    clearInterval(intervalObj);
  });
  window.on('focus', () => {
    intervalObj = setInterval(() => {
      updateData();
    }, 1000);
  });
  updateData();
}

export default {
  start,
  touchBar,
}
