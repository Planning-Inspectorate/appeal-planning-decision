const validation = require('../validation');
const { parseISO } = require('date-fns');

/**
 * @param {Object} params
 * @param {{
 * 	appealType: string|null,
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
const calculateWithinDeadlineFromBeforeYouStart = ({ appeal }) => {
	let date = null;
	if (typeof appeal.decisionDate === 'string') date = parseISO(appeal.decisionDate);
	else if (appeal.decisionDate instanceof Date) date = appeal.decisionDate;

	return validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod({
		givenDate: date,
		appealType: appeal.appealType,
		applicationDecision: appeal.eligibility?.applicationDecision,
		isListedBuilding: appeal.eligibility?.isListedBuilding,
		enforcementEffectiveDate: appeal.eligibility?.enforcementEffectiveDate,
		hasContactedPlanningInspectorate: appeal.eligibility?.hasContactedPlanningInspectorate
	});
};

module.exports = {
	calculateWithinDeadlineFromBeforeYouStart
};
