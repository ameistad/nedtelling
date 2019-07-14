const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => ({
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/src-sw.js', to: 'sw.js', type: 'file' }
    ])
  ],
  devtool: 'source-map'
})
