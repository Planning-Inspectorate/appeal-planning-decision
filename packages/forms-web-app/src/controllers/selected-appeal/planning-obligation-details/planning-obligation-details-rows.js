const { sortDocumentsByDate, documentExists, formatDocumentDetails } = require('@pins/common');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

/**
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 */

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed} caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */

exports.planningObligationRows = (caseData) => {
	const documents = caseData.Documents || [];
	const sortedDcocuments = sortDocumentsByDate(documents);

	const rows = [
		{
			keyText: 'Do you have a planning obligation to support your appeal?',
			valueText: 'Yes',
			condition: () => caseData.planningObligation
		},
		{
			keyText: 'Planning obligation',
			valueText: formatDocumentDetails(sortedDcocuments, APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION),
			isEscaped: true
		}
	];

	return rows;
};
