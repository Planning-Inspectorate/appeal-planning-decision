const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { formatDocumentsAsBulletedList } = require('@pins/common');
const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @param {{ caseData: import('appeals-service-api').Api.AppealCaseDetailed, userType: string }} params
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.caseValidationDocumentRows = ({ caseData, userType }) => {
	const documents = caseData.Documents || [];
	if ([LPA_USER_ROLE, APPEAL_USER_ROLES.APPELLANT].includes(/** @type {any} */ (userType))) {
		return formatCaseValidationDocumentRows(documents);
	}
	return [];
};

/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 */
const formatCaseValidationDocumentRows = (documents) => {
	const appellantCaseValidationDocs = documents.filter(
		(doc) => doc.documentType === APPEAL_DOCUMENT_TYPE.APPELLANT_CASE_CORRESPONDENCE
	);

	if (appellantCaseValidationDocs.length > 0) {
		return [
			{
				keyText: 'Additional documents',
				valueText: formatDocumentsAsBulletedList(appellantCaseValidationDocs),
				condition: (/** @type {import('appeals-service-api').Api.AppealCaseDetailed} */ caseData) =>
					!!caseData.caseValidationOutcome,
				isEscaped: true
			}
		];
	}
	return [];
};
