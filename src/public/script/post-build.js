const fs = require('fs');
const path = require('path');

const buildBasePath = path.join(__dirname, '..', 'build');
const buildAssetManifestPath = path.join(buildBasePath, 'asset-manifest.json');
const endBasePath = path.join(__dirname, '..', '..', '..', 'dist', 'view', 'static');
try {
  fs.mkdirSync(endBasePath);
} catch (ex) { }

const buildPayload = fs.readFileSync(buildAssetManifestPath, 'utf8');
const { files } = JSON.parse(buildPayload);

const mainJs = files['main.js'];
const mainCss = files['main.css'];

const mainJsPath = path.join(buildBasePath, mainJs);
const endJsPath = path.join(endBasePath, 'index.js');
fs.copyFileSync(mainJsPath, endJsPath);

const mainCssPath = path.join(buildBasePath, mainCss);
const endCssPath = path.join(endBasePath, 'index.css');
fs.copyFileSync(mainCssPath, endCssPath);