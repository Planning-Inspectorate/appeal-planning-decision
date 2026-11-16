const { CASE_TYPES, GROUP_C_PROCESS_CODES } = require('@pins/common/src/database/data-static');
const deadlineDate = require('../rules/appeal/deadline-date');

/**
 * @param {Object} params
 * @param {{
 * 	appealTypeCode: string,
 *  applicationDecisionDate: Date|null,
 *  isListedBuilding: boolean|string|null,
 *  applicationDecision: string|null,
 *  enforcementEffectiveDate: string|null,
 *  hasContactedPlanningInspectorate: boolean|null
 * }} params.appellantSubmission
 * @returns {Date|null}
 * @throws {BusinessRulesError}
 */
const calculateDeadlineFromAppellantSubmission = ({ appellantSubmission }) => {
	if (GROUP_C_PROCESS_CODES.includes(appellantSubmission?.appealTypeCode)) {
		return null;
	}

	return deadlineDate({
		decisionDate: appellantSubmission.applicationDecisionDate,
		appealType: CASE_TYPES[appellantSubmission.appealTypeCode].id.toString(),
		applicationDecision: appellantSubmission.applicationDecision,
		isListedBuilding:
			typeof appellantSubmission.isListedBuilding === 'string'
				? appellantSubmission.isListedBuilding === 'yes'
				: appellantSubmission.isListedBuilding,
		enforcementEffectiveDate: appellantSubmission.enforcementEffectiveDate,
		hasContactedPlanningInspectorate: appellantSubmission.hasContactedPlanningInspectorate
	});
};

module.exports = {
	calculateDeadlineFromAppellantSubmission
};
