const path = require("path");

module.exports = {
  outputDir: path.join(__dirname, "../public/runner"),
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",
};
