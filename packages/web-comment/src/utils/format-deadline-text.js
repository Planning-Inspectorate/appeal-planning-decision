const { format: formatDate } = require('date-fns');

/**
 * @typedef {import("./appeals-view").AppealViewModel} AppealViewModel
 * @param {AppealViewModel} appeal
 * @param {string | undefined} status
 * @returns {string }
 */
exports.formatDeadlineText = (appeal, status) => {
	if (!appeal.interestedPartyRepsDueDate) return '';

	const formattedDeadline = formatDate(new Date(appeal.interestedPartyRepsDueDate), 'd MMMM yyyy');

	switch (status) {
		case 'open':
			return `You can comment on this appeal until 11:59pm on ${formattedDeadline}.`;
		case 'closed':
			return `The deadline for comment was ${formattedDeadline}.`;
		default:
			return '';
	}
};
