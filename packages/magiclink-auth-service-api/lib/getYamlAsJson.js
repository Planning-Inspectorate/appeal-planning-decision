const fs = require('fs');
const yaml = require('js-yaml');
const logger = require('../src/util/logger');

module.exports = (filePath) => {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    logger.debug('Successfully loaded file');
    const spec = yaml.safeLoad(fileContents);
    logger.debug(`Loaded magic link api spec doc`);
    return spec;
  } catch (err) {
    logger.error(`problem loading magic link api spec doc\n${err}`);
    return null;
  }
};
