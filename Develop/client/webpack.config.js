const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { InjectManifest } = require('workbox-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = () => {
  return {
    // Entry point for files
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
      editor: './src/js/editor.js',
    },
    // Output for our bundles
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Webpack Plugin',
      }),
        // Injects our custom service worker
        new InjectManifest({
          swSrc: './src-sw.js',
          swDest: 'src-sw.js',
        }),
        // Webpack configuration to copy the favicon file from the src directory to the dist directory
        new CopyWebpackPlugin({
          patterns: [
            {
              from: './favicon.ico',
              to: 'favicon.ico',
            },
          ],
        }),
      new WorkboxPlugin.GenerateSW(),
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'My PWA',
        short_name: 'Contact',
        description: 'My awesome Progressive Web App!',
        background_color: '#225ca3',
        theme_color: '#225ca3',
        start_url: './',
        publicPath: './',
        scope: './',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          }
        ]
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  };
};