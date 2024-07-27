/**
 * @typedef {import('appeals-service-api').Api.InterestedPartyComment} InterestedPartyComment
 */

/**
 * @param {InterestedPartyComment[]} comments
 * @returns {Array}
 */
exports.formatComments = (comments) => {
	return comments
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
		.map((comment, index) => {
			const fullText = comment.comment;
			const truncated = fullText.length > 150;
			const truncatedText = truncated ? fullText.substring(0, 150) + '...' : fullText;
			return {
				key: {
					text: `Interested party ${index + 1}`
				},
				value: {
					text: fullText,
					truncatedText: truncatedText,
					truncated: truncated
				}
			};
		});
};
