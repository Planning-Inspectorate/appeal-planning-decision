const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();
const { getLPAFinalCommentByAppealId } = require('../service');
const { getFormatter } = require('../../get-representation-formatter');

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	try {
		const finalComments = await getLPAFinalCommentByAppealId(req.params.caseReference);

		if (!finalComments) {
			throw ApiError.finalCommentsNotFound();
		}

		const formatter = getFormatter(finalComments.AppealCase.appealTypeCode);

		await backOfficeV2Service.submitLPAFinalCommentSubmission(req.params.caseReference, formatter);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitFinalCommentResponse();
	}

	res.sendStatus(200);
};
