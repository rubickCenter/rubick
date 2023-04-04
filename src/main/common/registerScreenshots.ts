import Screenshots from 'electron-screenshots';
let screenshots;

const initScreenShots = () => {
  screenshots = new Screenshots();
};

export { initScreenShots, screenshots };
