module.exports = {
  system({title, body}, cb) {
    const myNotification = new Notification(title, {
      body
    });

    myNotification.onclick = () => {
      cb();
    }
  }
}
