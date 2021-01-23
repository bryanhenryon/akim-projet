const path = require("path");

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
            @import "@/assets/scss/main.scss";
            `
      }
    }
  },
  outputDir: path.resolve(__dirname, "../public")
};
