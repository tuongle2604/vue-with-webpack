const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    host: "0.0.0.0",
    // port: 8080,
    disableHostCheck: true,
    stats: "minimal"
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [
          { loader: "vue-style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader",
            options: {
              // prependData: `@import "@/styles/variables.scss";`
            }
          }
        ]
      }
    ]
  }
});
