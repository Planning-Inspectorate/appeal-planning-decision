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
			return `<p>You can comment on this appeal until 11:59pm on ${formattedDeadline}.</p>`;
		case 'closed':
			return `<p>The deadline for comment was ${formattedDeadline}.</p><p>You cannot add a comment</>`;
		default:
			return '';
	}
};
