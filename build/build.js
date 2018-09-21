const fs = require('fs');
const path = require('path');
const util = require('util');
const NwBuilder = require('nw-builder');
const pkg = require('../package.json');
const config = require('../config/nw.js');
const buildWinSetup = require('./build-setup.js');
const buildUpgrade = require('./build-upgrade');

process.on('uncaughtException', function(err) {
  console.log(err.stack);
  console.log('NOT exit...');
});

let manifest = {};
const manifestPath = resolve('app', './package.json');

config.nw.manifest.forEach(function(v, i) {
  if (util.isString(v)) {
    manifest[v] = pkg[v];
  } else if (util.isObject(v)) {
    manifest = util._extend(manifest, v);
  }
});

fs.writeFile(manifestPath, JSON.stringify(manifest, null, '  '), 'utf-8', function(err) {
  if (err) throw err;

  // start build app
  if (!config.nw.builder) {
    return;
  }

  const nw = new NwBuilder(config.nw.builder);
  nw.build()
    .then(function() {
      console.log('all done!');
      // build windows setup
      if (config.noSetup) return;
      if (~config.nw.builder.platforms.toString().indexOf('win')) {
        buildWinSetup().then(() => buildUpgrade(manifest));
      } else {
        buildUpgrade(manifest);
      }
    })
    .catch(function(error) {
      console.error(error);
    });
});

function resolve() {
  return path.resolve.apply(path, [__dirname, '..'].concat(...arguments));
}
