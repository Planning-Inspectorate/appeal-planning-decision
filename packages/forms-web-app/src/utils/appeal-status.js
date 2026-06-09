const { isEnforcementChildLinkedAppeal } = require('@pins/common/src/lib/linked-appeals');
const { utcToZonedTime } = require('date-fns-tz');
const targetTimezone = 'Europe/London';

/**
 * @typedef {import("./appeals-view").AppealViewModel} AppealViewModel
 * @param {AppealViewModel} appeal
 * @returns {AppealViewModel["status"]}
 */
exports.getAppealStatus = (appeal) => {
	const { caseDecisionOutcomeDate, interestedPartyRepsDueDate } = appeal;

	if (caseDecisionOutcomeDate) {
		return 'decided';
	} else if (
		interestedPartyRepsDueDate &&
		utcToZonedTime(new Date(interestedPartyRepsDueDate), targetTimezone) >
			utcToZonedTime(new Date(), targetTimezone) &&
		!isEnforcementChildLinkedAppeal(appeal)
	) {
		return 'open';
	}
	return 'closed';
};
