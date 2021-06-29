const NodeClam = require('clamscan');
const fs = require('fs');

module.exports = async (fileInformation, errorMessage) => {
  if (typeof fileInformation?.tempFilePath !== 'undefined') {
    const clamscan = await new NodeClam().init({
      debug_mode: true,
      clamdscan: {
        host: 'clamav-server',
        port: 3310,
        bypass_test: true,
      },
    });

    const fileStream = fs.createReadStream(fileInformation.tempFilePath);

    const { is_infected } = await clamscan.scan_stream(fileStream);

    if (is_infected) {
      throw new Error(errorMessage);
    }
  }

  return true;
};
