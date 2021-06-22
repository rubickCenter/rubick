const {ipcRenderer, clipboard, nativeImage, remote} = require('electron')

const fs = require('fs')
const { getScreenSources } = require('./desktop-capturer')
const { CaptureEditor } = require('./capture-editor')
const { getCurrentScreen } = require('./utils')

const $canvas = document.getElementById('js-canvas')
const $bg = document.getElementById('js-bg')
const $sizeInfo = document.getElementById('js-size-info')
const $toolbar = document.getElementById('js-toolbar')
const $jsMask= document.getElementById('js-mask')

const $btnClose = document.getElementById('js-tool-close')
const $btnOk = document.getElementById('js-tool-ok')
const $btnSave = document.getElementById('js-tool-save')
const $btnReset = document.getElementById('js-tool-reset')

let currentScreen;

(async () => {
    currentScreen = await getCurrentScreen();
})();
// 右键取消截屏
document.body.addEventListener('mousedown', (e) => {
    if (e.button === 2) {
        window.close()
    }
}, true)

// console.time('capture')
getScreenSources({}, (imgSrc) => {
    $jsMask.style.display = 'block';
    let capture = new CaptureEditor($canvas, $bg, imgSrc)

    let onDrag = (selectRect) => {
        $toolbar.style.display = 'none'
        $sizeInfo.style.display = 'block'
        $sizeInfo.innerText = `${selectRect.w} * ${selectRect.h}`
        if (selectRect.y > 35) {
            $sizeInfo.style.top = `${selectRect.y - 30}px`
        } else {
            $sizeInfo.style.top = `${selectRect.y + 10}px`
        }
        $sizeInfo.style.left = `${selectRect.x}px`
    }
    capture.on('start-dragging', onDrag)
    capture.on('dragging', onDrag)

    let onDragEnd = () => {
        if (capture.selectRect) {
            ipcRenderer.send('capture-screen', {
                type: 'select',
                screenId: currentScreen.id,
            })
            const {
                r, b,
            } = capture.selectRect
            $toolbar.style.display = 'flex'
            $toolbar.style.top = `${b + 15}px`
            $toolbar.style.right = `${window.screen.width - r}px`
        }
    }
    capture.on('end-dragging', onDragEnd)

    ipcRenderer.on('capture-screen', (e, { type, screenId }) => {
        if (type === 'select') {
            if (screenId && screenId !== currentScreen.id) {
                capture.disable()
            }
        }
    })

    capture.on('reset', () => {
        $toolbar.style.display = 'none'
        $sizeInfo.style.display = 'none'
    })

    $btnClose.addEventListener('click', () => {
        ipcRenderer.send('capture-screen', {
            type: 'complete',
        })
        window.close()
    })

    $btnReset.addEventListener('click', () => {
        capture.reset()
    })

    let selectCapture = () => {
        if (!capture.selectRect) {
            return
        }
        let url = capture.getImageUrl()
        remote.getCurrentWindow().hide()
        clipboard.writeImage(nativeImage.createFromDataURL(url))
        ipcRenderer.send('capture-screen', {
            type: 'complete',
            url,
        })

    }
    $btnOk.addEventListener('click', selectCapture)

    $btnSave.addEventListener('click', () => {
        let url = capture.getImageUrl()

        remote.getCurrentWindow().hide()
        remote.dialog.showSaveDialog({
            filters: [{
                name: 'Images',
                extensions: ['png', 'jpg', 'gif'],
            }],
        }).then(({filePath}) => {
            if (filePath) {
                fs.writeFile(filePath, new Buffer(url.replace('data:image/png;base64,', ''), 'base64'), () => {
                    ipcRenderer.send('capture-screen', {
                        type: 'complete'
                    })
                    window.close()
                })
            } else {
                ipcRenderer.send('capture-screen', {
                    type: 'complete'
                })
                window.close()
            }
        })
    })

    window.addEventListener('keypress', (e) => {
        if (e.code === 'Enter') {
            selectCapture()
        }
    })
})



