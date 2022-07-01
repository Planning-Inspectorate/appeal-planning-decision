const NodeClam = require('clamscan');
const { Readable } = require('stream');
const config = require('./config');
const logger = require('./logger');

const sendFile = async (file) => {
	if (typeof file === 'undefined') {
		throw new Error('invalid or empty file');
	}
	logger.info('sending file');
	const client = new NodeClam().init({
		removeInfected: true,
		clamdscan: {
			host: config.services.clamav.host || 'localhost',
			port: config.services.clamav.port || 3310,
			bypass_test: true
		},
		preference: 'clamdscan'
	});
	const readableStream = Readable.from(file.toString());
	return client.scanStream(readableStream);
};

module.exports = {
	sendFile
};
