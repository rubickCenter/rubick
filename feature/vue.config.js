const path = require("path");

module.exports = {
  outputDir: path.join(__dirname, "../public/feature"),
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",
};
