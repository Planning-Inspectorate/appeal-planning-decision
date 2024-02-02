/**
 * @param {import("./appeals-view").AppealViewModel} appeal
 * @returns {void}
 */
const openOrClosed = (appeal) => {
	const currentDate = new Date();
	if (
		appeal.interestedPartyRepsDueDate &&
		new Date(appeal.interestedPartyRepsDueDate) > currentDate
	) {
		appeal.status = 'open';
	} else {
		appeal.status = 'closed';
	}
};

module.exports = { openOrClosed };
