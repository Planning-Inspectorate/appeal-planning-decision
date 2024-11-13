const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');

/**
 * @typedef {import("./appeals-view").AppealViewModel} AppealViewModel
 * @param {AppealViewModel} appeal
 * @param {string | undefined} status
 * @returns {string }
 */
exports.formatCommentDeadlineText = (appeal, status) => {
	if (!appeal.interestedPartyRepsDueDate) return '';

	const formattedDeadline = formatDateForDisplay(appeal.interestedPartyRepsDueDate, {
		format: 'd MMMM yyyy'
	});

	switch (status) {
		case 'open':
			return `You can comment on this appeal until 11:59pm on ${formattedDeadline}.`;
		case 'closed':
			return `The deadline for comment was ${formattedDeadline}.`;
		default:
			return '';
	}
};
