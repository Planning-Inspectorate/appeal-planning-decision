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
		.map((comment, index) => ({
			key: {
				text: `Interested party ${index + 1}`
			},
			value: {
				text: comment.comment
			}
		}));
};
