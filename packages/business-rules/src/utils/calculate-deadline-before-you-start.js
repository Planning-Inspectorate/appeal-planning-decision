const deadlineDate = require('../rules/appeal/deadline-date');
const { parseISO } = require('date-fns');

/**
 * @param {Object} params
 * @param {{
 * 	appealType: string,
 *  decisionDate: string|Date|null,
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
	let date = null;
	if (typeof appeal.decisionDate === 'string') date = parseISO(appeal.decisionDate);
	else if (appeal.decisionDate instanceof Date) date = appeal.decisionDate;

	return deadlineDate({
		decisionDate: date,
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
