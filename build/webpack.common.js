const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: [
    "babel-polyfill",
    path.resolve(__dirname, "../src/main.js"),
    path.resolve(__dirname, "../src/styles/index.scss")
  ],
  output: {
    filename: "[name].[hash].js",
    publicPath: "/",
    path: path.resolve(__dirname, "../dist")
  },
  resolve: {
    extensions: [".vue", ".js", ".scss"],
    alias: {
      "@": path.resolve(__dirname, "../src")
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        use: "eslint-loader",
        enforce: "pre"
      },
      {
        test: /.vue$/,
        use: "vue-loader"
      },
      {
        test: /.js$/,
        use: "babel-loader",
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "images",
          esModule: false
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({ template: "./public/index.html" })
  ]
};
