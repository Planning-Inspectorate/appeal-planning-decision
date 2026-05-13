const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const deadlineDate = require('../rules/appeal/deadline-date');

/**
 * @param {Object} params
 * @param {{
 * 	appealTypeCode: string,
 *  applicationDecisionDate: Date|null,
 *  isListedBuilding: boolean|null,
 *  applicationDecision: string|null,
 *  enforcementEffectiveDate: string|null,
 *  hasContactedPlanningInspectorate: boolean|null
 * }} params.appellantSubmission
 * @returns {Date|null}
 * @throws {BusinessRulesError}
 */
const calculateDeadlineFromAppellantSubmission = ({ appellantSubmission }) => {
	return deadlineDate({
		decisionDate: appellantSubmission.applicationDecisionDate,
		appealType: CASE_TYPES[appellantSubmission.appealTypeCode].id.toString(),
		applicationDecision: appellantSubmission.applicationDecision,
		isListedBuilding: appellantSubmission.isListedBuilding,
		enforcementEffectiveDate: appellantSubmission.enforcementEffectiveDate,
		hasContactedPlanningInspectorate: appellantSubmission.hasContactedPlanningInspectorate
	});
};

module.exports = {
	calculateDeadlineFromAppellantSubmission
};
