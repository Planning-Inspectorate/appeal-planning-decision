const { isEnforcementChildLinkedAppeal } = require('@pins/common/src/lib/linked-appeals');

/**
 * @typedef {import("./appeals-view").AppealViewModel} AppealViewModel
 * @param {AppealViewModel} appeal
 * @returns {AppealViewModel["status"]}
 */
exports.getAppealStatus = (appeal) => {
	if (appeal.caseDecisionOutcomeDate) {
		return 'decided';
	} else if (
		appeal.interestedPartyRepsDueDate &&
		new Date(appeal.interestedPartyRepsDueDate) > new Date() &&
		!isEnforcementChildLinkedAppeal(appeal)
	) {
		return 'open';
	}
	return 'closed';
};
