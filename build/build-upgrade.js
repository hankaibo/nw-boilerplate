const fs = require('fs');
const path = require('path');

const rootPath = path.resolve(__dirname, '../');

const config = require(path.resolve(rootPath, './config/nw'));

const setupCnf = config.nw.setup;
const updCnf = config.nw.upgrade;
const platforms = {
  'win32-setup': {
    name: 'win32',
    ext: '.exe'
  },
  'win64-setup': {
    name: 'win64',
    ext: '.exe'
  },
  osx32: {
    name: 'osx32',
    ext: '.app'
  },
  osx64: {
    name: 'osx64',
    ext: '.app'
  },
  linux32: {
    name: 'linux32',
    ext: '.gz'
  },
  linux64: {
    name: 'linux64',
    ext: '.gz'
  }
};

// `./output/pc.json`
module.exports = makeUpgrade;

function makeUpgrade(manifest) {
  let upgradeJson = Object.assign({}, manifest, { packages: {} });

  // due to files
  updCnf.files.forEach(function(curPath) {
    let files = fs.readdirSync(curPath);

    files.forEach(function(fileName) {
      const platform = platforms[fileName];
      if (!platform) {
        return;
      }

      const filePath = getFilePath(manifest, platform, fileName);
      const size = getFileSize(curPath, manifest, platform, fileName);
      upgradeJson.packages[platform.name] = { url: updCnf.publicPath + filePath, size: size };
    });
    makeJson(upgradeJson);
  });
}

function getFilePath(manifest, platform, fileName) {
  const file = getFile(manifest, platform, fileName);
  return manifest.version + '/' + file;
}

function getFileSize(curPath, manifest, platform, fileName) {
  const file = getFile(manifest, platform, fileName);
  return fs.statSync(path.resolve(curPath, file)).size;
}

function getFile(manifest, platform, fileName) {
  let name = manifest.name;
  if (typeof setupCnf.outputFileName === 'function') {
    name = setupCnf.outputFileName({ name: manifest.name, version: manifest.version, platform });
  }
  return fileName + '/' + name + platform.ext;
}

function makeJson(json) {
  let upgradeAssetsRoot = path.parse(updCnf.outputFile).dir;
  if (!fs.existsSync(upgradeAssetsRoot)) {
    fs.mkdirSync(upgradeAssetsRoot);
  }

  fs.writeFile(updCnf.outputFile, JSON.stringify(json, null, '  '), 'utf-8', function(err) {
    if (err) {
      console.log(err);
    }
    console.log('\n', 'build upgrade.json in:\n', updCnf.outputFile, '\n');
  });
}
