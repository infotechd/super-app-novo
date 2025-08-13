const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = getDefaultConfig(__dirname);

// Exclude backend (Node server) code from the mobile bundle
config.resolver = config.resolver || {};
config.resolver.blockList = exclusionList([
  /packages[\/\\]backend[\/\\].*/,
]);

module.exports = config;