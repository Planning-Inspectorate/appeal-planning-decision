/**
 * @typedef {import('appeals-service-api').Api.FinalComment} FinalComment
 * @typedef {import('appeals-service-api').Api.AppealStatement} AppealStatement
 * @typedef {import('appeals-service-api').Api.InterestedPartyComment} InterestedPartyComment
 */

const { formatDocumentDetails } = require('@pins/common');

/**
 * @typedef {FinalComment | AppealStatement | InterestedPartyComment} CommentOrStatement
 * @param {CommentOrStatement[]} items
 * @param {Object} options
 * @param {string} options.titlePrefix
 * @param {boolean} [options.includeDocuments]
 * @param {string} [options.docsJoinTable]
 * @param {string} [options.documentType]
 * @param {boolean} [options.sortByDate]
 */
const formatCommentOrStatement = (
	items,
	{
		titlePrefix,
		includeDocuments = false,
		docsJoinTable = '',
		documentType = '',
		sortByDate = false
	}
) => {
	if (sortByDate) {
		items = items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
	}

	return items.map((item, index) => {
		const fullText = item.comments || item.statement || item.comment;
		const truncated = fullText.length > 150;
		const truncatedText = truncated ? fullText.substring(0, 150) + '...' : fullText;

		let documentDetails = undefined;
		if (includeDocuments && item[`${docsJoinTable}Documents`]) {
			const documents = item[`${docsJoinTable}Documents`].map((doc) => doc.Document);
			documentDetails = formatDocumentDetails(documents, documentType);
		}

		return {
			key: { text: `${titlePrefix} ${index + 1}` },
			value: {
				text: fullText,
				truncatedText: truncatedText,
				truncated: truncated,
				documents: documentDetails
			}
		};
	});
};

exports.formatFinalComment = (comments) => {
	return formatCommentOrStatement(comments, {
		titlePrefix: 'Final Comments',
		includeDocuments: true,
		docsJoinTable: 'FinalComment',
		documentType: 'finalComment' // To be updated once data model confirmed
	});
};

exports.formatStatement = (statements) => {
	return formatCommentOrStatement(statements, {
		titlePrefix: 'Statement',
		includeDocuments: true,
		docsJoinTable: 'Statement',
		documentType: 'appealStatement' // To be updated once data model confirmed
	});
};

exports.formatComments = (comments) => {
	return formatCommentOrStatement(comments, {
		titlePrefix: 'Interested Party',
		includeDocuments: false,
		sortByDate: true
	});
};
