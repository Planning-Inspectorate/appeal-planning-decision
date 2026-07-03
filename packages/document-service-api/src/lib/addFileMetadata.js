const { randomUUID } = require('node:crypto');

const addFileMetadata = (req, res, next) => {
	if (!req.file) {
		req.file = {};
	}

	req.file.id = randomUUID();
	req.file.uploadDate = new Date().toISOString();
	next();
};

module.exports = addFileMetadata;
