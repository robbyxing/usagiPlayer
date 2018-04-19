var webpack = require("webpack");

module.exports = {
  entry: {
    'UsagiPlayer': "./src/index.js"
  },
  output: {
    path: __dirname + "/dist",
    filename: "usagiplayer.min.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      }
    ]
  }
};
