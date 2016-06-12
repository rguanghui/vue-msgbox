/*eslint-env node */
var options = require('./webpack.base.js');
options.entry = './src';
options.output = {
  library: 'VueMsgbox',
  libraryTarget: 'umd',
  filename: 'vue-msgbox.js',
  path: './lib'
};
options.externals = {
  vue: {
    root: 'Vue',
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue'
  }
};
module.exports = options;
