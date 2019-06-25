require('dotenv').config();
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');
const SWPrecachePlugin = require('sw-precache-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const loaders = {
  vueStyle: 'vue-style-loader',
  minicss: {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: process.env.NODE_ENV === 'development',
    },
  },
  postcss: {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: [require('autoprefixer')()],
    },
  },
  less: {
    loader: 'less-loader',
    options: {
      modifyVars: {
        fontbase: `'${process.env.FONT_URL}'`,
      },
    },
  },
};

const config = merge(base, {
  entry: {
    app: './src/entry-client.js',
  },
  resolve: {
    alias: {
      'create-api': './create-api-client.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.(less)$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              loaders.vueStyle,
              loaders.minicss,
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:8]',
                },
              },
              loaders.postcss,
              loaders.less,
            ],
          },
          {
            use: [
              loaders.vueStyle,
              loaders.minicss,
              'css-loader',
              loaders.postcss,
              loaders.less,
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[hash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[hash].css' : '[id].css',
    }),
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"client"',
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.TAG_MANAGER_ID': JSON.stringify(process.env.TAG_MANAGER_ID),
      'process.env.MODE': JSON.stringify(process.env.MODE),
      'process.env.FONT_URL': JSON.stringify(process.env.FONT_URL),
    }),
    new VueSSRClientPlugin(),
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    // extract vendor chunks for better caching
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        // a module is extracted into the vendor chunk if...
        // it's inside node_modules
        // and not a CSS file (due to extract-text-webpack-plugin limitation)
        vendors: {
          test: module =>
            /node_modules/.test(module.context) &&
            !/\.css$/.test(module.request),
        },
      },
    },
  },
});

if (process.env.NODE_ENV === 'production') {
  // auto generate service worker
  config.plugins.push(new SWPrecachePlugin({
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
