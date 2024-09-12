const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	try {
		await backOfficeV2Service.submitAppellantFinalCommentSubmission(req.params.caseReference);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitResponse();
	}

	res.sendStatus(200);
};
