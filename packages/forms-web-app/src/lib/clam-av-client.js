const ClamAVClient = require('@pins/common/src/client/clamav-rest-client');
const {
	fileUpload: { clamAVHost }
} = require('../config');

const clamAVClient = new ClamAVClient(clamAVHost);
module.exports = clamAVClient;
