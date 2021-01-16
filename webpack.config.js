const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  entry: __dirname + "/web/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins:
    process.env.NODE_ENV === "development" ? [new BundleAnalyzerPlugin()] : [],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: __dirname + "/backend/static",
  },
  devServer: {
    contentBase: __dirname + "/backend/static",
    port: 9000,
    index: "index.html",
    filename: "bundle.js",
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
};
