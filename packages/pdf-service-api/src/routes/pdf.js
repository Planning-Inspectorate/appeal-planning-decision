const express = require('express');
const bodyParser = require('body-parser');
const { postGeneratePdf } = require('../controllers/pdf');
const config = require('../config');

/**
 * @param {import('http').IncomingMessage} req
 * @returns {boolean}
 */
const acceptsPdfBody = (req) => {
	const contentType = req.headers['content-type'] || '';

	return contentType.startsWith('application/gzip') || contentType.startsWith('text/html');
};

const router = express.Router();

router.post(
	'/generate',
	bodyParser.raw({
		inflate: true,
		limit: config.fileUpload.maxSizeInBytes,
		type: acceptsPdfBody
	}),
	postGeneratePdf
);

module.exports = router;
