const { remote, ipcRenderer } = require('electron');

let currentWindow = remote.getCurrentWindow()

exports.getCurrentScreen = () => {
    let { x, y } = currentWindow.getBounds();
    ipcRenderer.send('capture-screen', {
        type: 'getAllDisplays',
        winId: currentWindow.id,
        x,
        y,
    });
    return new Promise(resolve => {
        ipcRenderer.on('getAllDisplays', (e, { type, winId, screen}) => {
            if (winId === currentWindow.id) {
                resolve(screen)
            }
        })
    })
}
