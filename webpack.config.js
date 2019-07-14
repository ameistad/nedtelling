const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const modeConfig = env => require(`./build/webpack.${env.mode}.js`)(env);
const loadPresets = require('./build/loadPresets')

module.exports = ({ mode, presets }) => {
  return webpackMerge(
    {
      mode,
      entry: './src/index.js',
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader',
              'postcss-loader'
            ]
          }
        ]
      },
      plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: './src/index.html'
        }),
        new CopyWebpackPlugin(
          [
            { from: 'src/icons', to: 'icons/' },
            'src/manifest.webmanifest'
          ],
          { ignore: ['.DS_Store'] }
        )
      ]
    },
    modeConfig({ mode, presets }),
    loadPresets({ mode, presets })
  )
}
