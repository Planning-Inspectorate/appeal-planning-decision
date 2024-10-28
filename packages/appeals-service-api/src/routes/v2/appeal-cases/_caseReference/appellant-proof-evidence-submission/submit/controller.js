const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	const userId = req.auth.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	try {
		await backOfficeV2Service.submitAppellantProofEvidenceSubmission(
			req.params.caseReference,
			userId
		);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitResponse();
	}

	res.sendStatus(200);
};
