/**
 * @typedef {import("./appeals-view").AppealViewModel} AppealViewModel
 * @param {AppealViewModel} appeal
 * @returns {AppealViewModel["status"]}
 */
exports.getAppealStatus = (appeal) =>
	appeal.interestedPartyRepsDueDate && new Date(appeal.interestedPartyRepsDueDate) > new Date()
		? 'open'
		: 'closed';
