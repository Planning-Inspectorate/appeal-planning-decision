/**
 * @typedef {import('appeals-service-api').Api.AppealStatement} AppealStatement
 */

const { formatDocumentDetails } = require('@pins/common');

/**
 * @param {AppealStatement[]} statement
 */
exports.formatStatement = (statement) => {
	return statement.map((statement, index) => {
		const documents = statement.StatementDocuments?.map((doc) => doc.Document);
		const documentDetails = formatDocumentDetails(documents, 'appealStatement'); //Update when data model set

		const fullText = statement.statement;
		const truncated = fullText.length > 150;
		const truncatedText = truncated ? fullText.substring(0, 150) + '...' : fullText;
		return {
			key: {
				text: `Statement ${index + 1}`
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
