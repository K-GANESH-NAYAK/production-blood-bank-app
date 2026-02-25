const webpack = require('webpack');

module.exports = function override(config) {
  // Polyfills for Node core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    buffer: require.resolve('buffer/'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util/'),
    url: require.resolve('url/'),
    process: require.resolve('process/browser.js'),
  };

  // Fix for .mjs strict ESM imports (Redux Toolkit & React Router)
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false, // disables the "fully specified" rule
    },
  });

  // Provide global variables
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: ['process/browser'],
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};
