const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();
const { getLPAFinalCommentByAppealId } = require('../service');
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
