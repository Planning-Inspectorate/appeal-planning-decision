/**
 * @param {string} appealNumber
 * @param {string } status
 * @returns {string }
 */
exports.formatCommentHeadlineText = (appealNumber, status) => {
	switch (status) {
		case 'decided':
			return `Decision for appeal ${appealNumber}`;
		default:
			return `Appeal ${status} for comment`;
	}
};
