const logger = require('../lib/logger');
const { patchResponse } = require('../services/responses.service');

const patchResponseByReferenceId = async (req, res) => {
	let statusCode = 200;
	let body = {};
	try {
		body = await patchResponse(req.params.formId, req.params.referenceId, req.body.answers);
	} catch (error) {
		logger.error(`Failed to patch response: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
};

module.exports = { patchResponseByReferenceId };
