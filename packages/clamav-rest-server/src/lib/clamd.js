/* istanbul ignore file */
const NodeClam = require('clamscan');
const { Readable } = require('stream');
const config = require('./config');
const logger = require('./logger');

const sendFile = async (file) => {
	// console.log(file);
	if (typeof file === 'undefined') {
		throw new Error('invalid or empty file');
	}
	logger.info('sending file');
	const clamScan = await GetClamClient();
	try {
		const version = await clamScan.getVersion();
		logger.info(`ClamAV Version: ${version}`);

		const fileStream = Readable();
		fileStream.push(file);
		fileStream.push(null);

		const result = await clamScan.scanStream(fileStream);

		logger.info(result);

		// If is infected is null or undefined (which can happen in certain cases) then throw an error
		if (result.isInfected == null) {
			throw new Error('Could not scan file');
		}

		return result;
	} catch (err) {
		// Handle errors that may have occurred during initialization
		logger.error(err, 'error scanning file');
		throw err;
	}
};

async function GetClamClient() {
	try {
		const ClamScan = await new NodeClam().init({
			removeInfected: true,
			clamdscan: {
				host: config.services.clamav.host || 'localhost',
				port: config.services.clamav.port || 3310,
				active: true,
				bypassRest: false
			},
			preference: 'clamdscan'
		});
		return ClamScan;
	} catch (err) {
		// Handle errors that may have occurred during initialization
		console.log(err);
		logger.error(err, 'error starting file scan');
		throw err;
	}
}

module.exports = {
	sendFile
};
