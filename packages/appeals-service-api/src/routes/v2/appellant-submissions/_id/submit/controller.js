const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../services/back-office-v2');
const { getForBOSubmission } = require('../service');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	formatter: hasFormatter
} = require('../../../../../services/back-office-v2/formatters/has/appeal');
const {
	formatter: s78Formatter
} = require('../../../../../services/back-office-v2/formatters/s78/appeal');

const backOfficeV2Service = new BackOfficeV2Service();

/**
 * @typedef {import('../../repo').FullAppellantSubmission} FullAppellantSubmission
 */

/**
 * @param {string|null} appealTypeCode
 * @returns {function(FullAppellantSubmission): *}
 */
const getFormatter = (appealTypeCode) => {
	switch (appealTypeCode) {
		case CASE_TYPES.HAS.processCode:
			return hasFormatter;
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
	const appellantSubmissionId = req.params.id;

	const appellantSubmission = await getForBOSubmission({ appellantSubmissionId, userId });

	if (!appellantSubmission) throw new Error(`Appeal submission ${appellantSubmissionId} not found`);

	const formatter = getFormatter(appellantSubmission.appealTypeCode);

	try {
		await backOfficeV2Service.submitAppellantSubmission({ appellantSubmission, userId, formatter });
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitAppellantSubmission();
	}

	res.sendStatus(200);
};
