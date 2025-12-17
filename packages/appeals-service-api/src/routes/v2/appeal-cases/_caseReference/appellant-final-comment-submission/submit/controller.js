const ApiError = require('#errors/apiError');
const logger = require('#lib/logger.js');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();
const { getAppellantFinalCommentByAppealId } = require('../service');
const { getFormatter } = require('../../get-representation-formatter');

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	const userId = req.auth.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const { caseReference } = req.params;

	const appellantFinalCommentSubmission = await getAppellantFinalCommentByAppealId(caseReference);

	if (!appellantFinalCommentSubmission) {
		throw ApiError.finalCommentsNotFound();
	}
	const { appealTypeCode } = appellantFinalCommentSubmission.AppealCase;

	const formatter = getFormatter(appealTypeCode);

	try {
		await backOfficeV2Service.submitAppellantFinalCommentSubmission(
			req.params.caseReference,
			userId,
			formatter
		);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitFinalCommentResponse();
	}

	res.sendStatus(200);
};
