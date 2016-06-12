/*eslint-env node */
const cssnext = require('postcss-cssnext');
const postcssFlexFallback = require('postcss-flex-fallback');

module.exports = {
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.js$/, loader: 'babel' }
    ]
  },
  vue: {
    loaders: {
      js: 'babel!eslint'
    },
    postcss: [
      cssnext({ browsers: ['last 2 versions', 'Android >= 2.1'] }),
      postcssFlexFallback()
    ],
    autoprefixer: false
  }
};
