const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require('path');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    disableHostCheck: true,
    stats: "minimal",
    contentBase: [path.join(__dirname, '../dist'), './public'],
    publicPath: '/public/',
    writeToDisk: true // for development service worker
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
  },
  plugins: [
    new WorkboxWebpackPlugin.GenerateSW({
      swDest: 'sw.js',
      include: [
        /.js$/,
        /.css$/,
        "/",
        "index.html"
      ],
      maximumFileSizeToCacheInBytes: 13000000,
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    })
  ]
});
