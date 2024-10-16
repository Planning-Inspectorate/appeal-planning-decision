/**
 * @typedef {import('appeals-service-api').Api.AppealFinalComment} AppealFinalComment
 */

const { formatDocumentDetails } = require('@pins/common');

/**
 * @param {AppealFinalComment[]} comments
 */
exports.formatFinalComment = (comments) => {
	return comments.map((comment, index) => {
		const documents = comment.FinalCommentDocuments?.map((doc) => doc.Document);
		const documentDetails = formatDocumentDetails(documents, 'appealFinalComment'); //Update when data model set

		const fullText = comment.comments;
		const truncated = fullText.length > 150;
		const truncatedText = truncated ? fullText.substring(0, 150) + '...' : fullText;
		return {
			key: {
				text: `Final Comments ${index + 1}`
			},
			value: {
				text: fullText,
				truncatedText: truncatedText,
				truncated: truncated,
				documents: documentDetails
			}
		};
	});
};
