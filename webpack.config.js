const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
module.exports = {
  entry: './src/main.js',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    open: false, 
    writeToDisk:false, 
  },
  plugins: [
    //  new BundleAnalyzerPlugin(),
  ],
  experiments: {
    // topLevelAwait: true,
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool:'source-map'
};