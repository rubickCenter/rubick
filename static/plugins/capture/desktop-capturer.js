const {desktopCapturer} = require('electron');

exports.getScreenSources = async ({ types = ['screen'] } = {}, callback) => {
    let curScreen = await getCurrentScreen();
    let screenWidth = curScreen.bounds.width
    let screenHeight = curScreen.bounds.height
    desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
            width: screenWidth * curScreen.scaleFactor,
            height: screenHeight * curScreen.scaleFactor,
        }
    }).then((sources) => {
        let imgSrc = sources.filter(s => s.id.indexOf(curScreen.id) >= 0)[0].thumbnail.toDataURL()
        callback(imgSrc)
    })
}
