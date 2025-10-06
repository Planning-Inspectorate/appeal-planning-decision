/**
 * @typedef {import("./appeals-view").AppealViewModel} AppealViewModel
 * @param {AppealViewModel} appeal
 * @returns {AppealViewModel["status"]}
 */
exports.getAppealStatus = (appeal) => {
	if (appeal.caseDecisionOutcomeDate) {
		return 'decision_issued';
	} else if (
		appeal.interestedPartyRepsDueDate &&
		new Date(appeal.interestedPartyRepsDueDate) > new Date()
	) {
		return 'open_for_comments';
	}
	return 'closed';
};
