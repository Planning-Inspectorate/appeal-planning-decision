const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();
const { getAppellantFinalCommentByAppealId } = require('../service');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	formatter: s78Formatter
} = require('../../../../../../services/back-office-v2/formatters/s78/representation');

/**
 * @typedef {import('../../../../../../services/back-office-v2/formatters/s78/representation').TypedRepresentationSubmission} TypedRepresentationSubmission
 * @typedef {import('../../../../../../services/back-office-v2/formatters/s78/representation').RepresentationTypes} RepresentationTypes
 *
 */

/**
 * @param {string|null} appealTypeCode
 * @returns {function(string, string | null, RepresentationTypes, TypedRepresentationSubmission): *}
 */
const getFormatter = (appealTypeCode) => {
	switch (appealTypeCode) {
		case CASE_TYPES.S78.processCode:
			return s78Formatter;
		default:
			throw new Error('unknown formatter');
	}
};

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
