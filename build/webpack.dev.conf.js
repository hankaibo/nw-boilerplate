const merge = require('webpack-merge');
const base = require('./webpack.base.conf');

module.exports = env => {
  return merge(base(env), {});
};
