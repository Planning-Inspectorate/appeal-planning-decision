const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	formatter: hasFormatter
} = require('../../../../../../services/back-office-v2/formatters/has/questionnaire');
const {
	formatter: s78Formatter
} = require('../../../../../../services/back-office-v2/formatters/s78/questionnaire');
const {
	formatter: s20Formatter
} = require('../../../../../../services/back-office-v2/formatters/s20/questionnaire');
const {
	formatter: casPlanningFormatter
} = require('../../../../../../services/back-office-v2/formatters/cas-planning/questionnaire');

const { getLPAQuestionnaireByAppealId } = require('../service');

const backOfficeV2Service = new BackOfficeV2Service();

/**
 * @typedef {import('../questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

/**
 * @param {string|null} appealTypeCode
 * @returns {function(string, LPAQuestionnaireSubmission): *}
 */
const getFormatter = (appealTypeCode) => {
	switch (appealTypeCode) {
		case CASE_TYPES.HAS.processCode:
			return hasFormatter;
		case CASE_TYPES.S78.processCode:
			return s78Formatter;
		case CASE_TYPES.S20.processCode:
			return s20Formatter;
		case CASE_TYPES.CAS_PLANNING.processCode:
			return casPlanningFormatter;
		default:
			throw new Error('unknown formatter');
	}
};

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	try {
		const questionnaire = await getLPAQuestionnaireByAppealId(req.params.caseReference);

		if (!questionnaire) {
			throw ApiError.questionnaireNotFound();
		}

		const formatter = getFormatter(questionnaire.AppealCase.appealTypeCode);

		await backOfficeV2Service.submitQuestionnaire(
			req.params.caseReference,
			questionnaire,
			formatter
		);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitResponse();
	}

	res.sendStatus(200);
};
