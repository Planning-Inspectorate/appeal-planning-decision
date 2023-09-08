const logger = require('../lib/logger');
const clamd = require('../lib/clamd');

const processFile = async (req, res) => {
	const { file } = req?.files || undefined;

	if (typeof file === 'undefined') {
		logger.warn('file is not defined');
		return res.sendStatus(400);
	}

	try {
		const [uploadedFile] = file;
		logger.info('sending file to clamav', { controller: 'processFile' });
		return res.send(await clamd.sendFile(uploadedFile.buffer));
	} catch (error) {
		logger.error(error, 'error uploading file to clamav');
		return res.sendStatus(500);
	}
};

module.exports = {
	processFile
};
