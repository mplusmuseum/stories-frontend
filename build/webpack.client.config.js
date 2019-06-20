require('dotenv').config();
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');
const SWPrecachePlugin = require('sw-precache-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');


const config = merge(base, {
  entry: {
    app: './src/entry-client.js',
  },
  resolve: {
    alias: {
      'create-api': './create-api-client.js',
    },
  },
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"',
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.TAG_MANAGER_ID': JSON.stringify(process.env.TAG_MANAGER_ID),
      'process.env.MODE': JSON.stringify(process.env.MODE),
      'process.env.FONT_URL': JSON.stringify(process.env.FONT_URL),
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // a module is extracted into the vendor chunk if...
        return (
          // it's inside node_modules
          /node_modules/.test(module.context) &&
          // and not a CSS file (due to extract-text-webpack-plugin limitation)
          !/\.css$/.test(module.request)
        );
      },
    }),
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
    }),
    new VueSSRClientPlugin(),
  ],
});

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'mplus-app',
      filename: 'service-worker.js',
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/],
    }));
  config.plugins.push(new LodashModuleReplacementPlugin({
    // @TODO Try and remove these somehow
    shorthands: true,
    cloning: true,
    paths: true,
    collections: true,
  }));
  // Bundle analyzer
  config.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'disabled',
    generateStatsFile: true,
  }));
}

module.exports = config;
