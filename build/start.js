const childProcess = require('child_process');
const webpack = require('webpack');
const nwPath = require('nw').findpath();
const config = require('./webpack.base.conf');

const env = 'development';
const compiler = webpack(config(env));
let nwStarted = false;

const watching = compiler.watch({}, (err, stats) => {
  if (!err && !stats.hasErrors() && !nwStarted) {
    nwStarted = true;

    childProcess.spawn(nwPath, ['.'], { stdio: 'inherit' }).on('close', () => {
      watching.close();
    });
  }
});
