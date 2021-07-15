/* istanbul ignore file */
const NodeClam = require('clamscan');
const fs = require('fs');

module.exports = async (fileInformation, errorMessage) => {
  if (typeof fileInformation?.tempFilePath !== 'undefined') {
    const clamscan = await new NodeClam().init({
      debug_mode: true,
      clamdscan: {
        host: '127.0.0,1',
        port: 3310,
        bypass_test: true,
      },
    });

    const fileStream = fs.createReadStream(fileInformation.tempFilePath);

    // eslint-disable-next-line camelcase
    const { is_infected } = await clamscan.scan_stream(fileStream);

    // eslint-disable-next-line camelcase
    if (is_infected) {
      throw new Error(errorMessage);
    }
  }

  return true;
};
