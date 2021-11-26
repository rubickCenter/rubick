import commonConst from "@/common/utils/commonConst";

let appSearch;

if (commonConst.macOS()) {
  appSearch = require("./darwin");
} else if (commonConst.windows()) {
  appSearch = require("./win");
} else if (commonConst.linux()) {
  appSearch = require("./linux");
}

export default appSearch.default;
