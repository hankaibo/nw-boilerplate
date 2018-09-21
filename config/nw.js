const path = require('path');
const pkg = require('../package.json');

function resolve() {
  return path.resolve.apply(path, [__dirname, '..'].concat(...arguments));
}

const curReleasesPath = resolve('./dist', pkg.version);

module.exports = {
  nw: {
    // Manifest Format: http://docs.nwjs.io/en/latest/References/Manifest%20Format/
    manifest: [
      'name',
      'appName',
      'version',
      'description',
      'author',
      { main: './app.html' },
      'manifestUrl',
      'window',
      'nodejs',
      'js-flags',
      'node-remote'
    ],
    // see document: https://github.com/nwjs/nw-builder
    builder: {
      files: [resolve('./app/**')],
      platforms: ['win32', 'win64'],
      version: '0.33.3',
      flavor: 'normal',
      cacheDir: resolve('./node_modules/_nw-builder-cache/'),
      buildDir: resolve('./dist'),
      winIco: resolve('./resources/logo.ico'),
      macIcns: resolve('./resources/logo.icns'),
      buildType: function() {
        return this.appVersion;
      }
    },
    setup: {
      issPath: resolve('./config/setup.iss'),
      files: curReleasesPath,
      resourcesPath: resolve('./resources'),
      appPublisher: 'hankaibo',
      appURL: 'http://www.littleprincess.cn/',
      appId: '{{968DED50-F043-4A60-8189-CC6952FA27F6}}',
      outputFileName: function(data) {
        return data.name + '-' + data.version;
      }
    },
    upgrade: {
      outputFile: resolve('./releases/upgrade.json'),
      publicPath: 'http://localhost:8080/releases/',
      files: [curReleasesPath]
    }
  }
};
