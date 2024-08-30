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
		new Date(appeal.interestedPartyRepsDueDate) > new Date()
	) {
		return 'open';
	}
	return 'closed';
};
