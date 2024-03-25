const { formatDate } = require('#utils/format-date');

/**
 * @typedef {import("./appeals-view").AppealViewModel} AppealViewModel
 * @param {AppealViewModel} appeal
 * @param {string | undefined} status
 * @returns {string }
 */
exports.formatDeadlineText = (appeal, status) => {
	const formattedDeadline = formatDate(appeal.interestedPartyRepsDueDate);

	switch (status) {
		case 'open':
			return `You can comment on this appeal until 11:59pm on ${formattedDeadline}.`;
		case 'closed':
			return `The deadline for comment was ${formattedDeadline}.`;
		default:
			return '';
	}
};
