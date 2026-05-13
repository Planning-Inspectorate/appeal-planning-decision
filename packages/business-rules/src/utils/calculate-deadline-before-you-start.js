const deadlineDate = require('../rules/appeal/deadline-date');
const { parseISO } = require('date-fns');

/**
 * @param {Object} params
 * @param {{
 * 	appealType: string,
 *  decisionDate: string|null,
 *  eligibility: {
 *   applicationDecision: string|null,
 *   isListedBuilding: boolean|undefined,
 *   enforcementEffectiveDate: string|null,
 *   hasContactedPlanningInspectorate: boolean|null
 *  }
 * }} params.appeal
 * @returns {Date|null}
 * @throws {BusinessRulesError}
 */
const calculateDeadlineFromBeforeYouStart = ({ appeal }) => {
	return deadlineDate({
		decisionDate: appeal.decisionDate ? parseISO(appeal.decisionDate) : null,
		appealType: appeal.appealType,
		applicationDecision: appeal.eligibility?.applicationDecision,
		isListedBuilding: appeal.eligibility?.isListedBuilding,
		enforcementEffectiveDate: appeal.eligibility?.enforcementEffectiveDate,
		hasContactedPlanningInspectorate: appeal.eligibility?.hasContactedPlanningInspectorate
	});
};

module.exports = {
	calculateDeadlineFromBeforeYouStart
};
