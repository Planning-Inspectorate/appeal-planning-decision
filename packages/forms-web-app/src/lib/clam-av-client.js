const ClamAVClient = require('@pins/common/src/client/clamav-client');
const {
	fileUpload: { clamAVHost, clamAVPort }
} = require('../config');

const clamAVClient = new ClamAVClient(clamAVHost, clamAVPort);
module.exports = clamAVClient;
