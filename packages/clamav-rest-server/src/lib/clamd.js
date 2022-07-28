/* istanbul ignore file */
const NodeClam = require('clamscan');
const { Readable } = require('stream');
const config = require('./config');
const logger = require('./logger');

const sendFile = async (file) => {
	if (typeof file === 'undefined') {
		throw new Error('invalid or empty file');
	}
	logger.info('sending file');
	const ClamScan = new NodeClam().init({
		removeInfected: true,
		clamdscan: {
			host: config.services.clamav.host || 'localhost',
			port: config.services.clamav.port || 3310,
			active: true,
			bypassRest: false
		},
		preference: 'clamdscan'
	});

	// Get instance by resolving ClamScan promise object
	ClamScan.then(async (client) => {
		try {
			// You can re-use the `clamscan` object as many times as you want
			const version = await client.getVersion();
			console.log(`ClamAV Version: ${version}`);

			// const {isInfected, file, viruses} = await client.isInfected('/some/file.zip');
			// if (isInfected) console.log(`${file} is infected with ${viruses}!`);

			const fileStream = Readable();
			fileStream.push(file.data);
			fileStream.push(null);

			return client.scanStream(fileStream);

			// return client.scanStream(Readable.from(file.toString()));
		} catch (err) {
			// Handle any errors raised by the code in the try block
			console.log(err);
			logger.error(err, 'error calling clamav client');
			throw err;
		}
	}).catch((err) => {
		// Handle errors that may have occurred during initialization
		console.log(err);
		logger.error(err, 'error initializing clamav client');
		throw err;
	});
};

module.exports = {
	sendFile
};
