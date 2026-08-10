const generatePdf = require('../lib/generatePdf');
const logger = require('../lib/logger');

/**
 * @param {unknown} body
 * @returns {string}
 */
const getHtml = (body) => {
	if (Buffer.isBuffer(body)) return body.toString('utf8');
	const error = new Error(`Expected body to be a Buffer, but got ${typeof body}`);
	error.statusCode = 400;
	throw error;
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const postGeneratePdf = async (req, res) => {
	try {
		const html = getHtml(req.body);
		const postedBodySize = req.headers['content-length']
			? Number(req.headers['content-length'])
			: undefined;

		logger.info({ postedBodySize, htmlLength: html.length }, 'POST request to generate pdf');
		logger.debug({ html }, 'html to convert to pdf:');
		const pdfBuffer = await generatePdf(html);
		res.contentType('application/pdf').send(pdfBuffer);
	} catch (err) {
		const error = err instanceof Error ? err : new Error(String(err));
		logger.error({ err: error }, 'Failed to download pdf');
		res.status(error.statusCode ?? 500).send({
			message: error.message
		});
	}
};

module.exports = {
	postGeneratePdf
};
