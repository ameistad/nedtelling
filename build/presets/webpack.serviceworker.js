
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = () => ({
  plugins: [
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/src-sw.js',
      swDest: 'sw.js'
    })
  ]
});
