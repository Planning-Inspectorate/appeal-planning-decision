const { formatDocumentDetails, formatNewDescription } = require('@pins/common');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseWithAppellant} caseData
 * @returns {Rows}
 */
exports.documentsRows = (caseData) => {
	const documents = caseData.Documents || [];

	return [
		{
			keyText: 'Application form',
			valueText: formatDocumentDetails(documents, 'originalApplicationForm'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'New description of development',
			valueText: formatNewDescription(caseData),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Plans, drawings and supporting documents',
			valueText: formatDocumentDetails(documents, 'plansDrawings'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Separate ownership certificate in application',
			valueText: formatDocumentDetails(documents, 'ownershipCertificate'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Design and access statement in application',
			valueText: formatDocumentDetails(documents, 'designAccessStatement'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Decision letter',
			valueText: formatDocumentDetails(documents, 'lpaDecisionLetter'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Appeal statement',
			valueText: formatDocumentDetails(documents, 'appellantStatement'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'New plans or drawings',
			valueText: formatDocumentDetails(documents, 'newPlansDrawings'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Planning obligation status',
			valueText: caseData.statusPlanningObligation,
			condition: (caseData) => caseData.statusPlanningObligation
		},
		{
			keyText: 'Planning obligation',
			valueText: formatDocumentDetails(documents, 'planningObligation'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'New supporting documents',
			valueText: formatDocumentDetails(documents, 'otherNewDocuments'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Draft statement of common ground',
			valueText: formatDocumentDetails(documents, 'statementCommonGround'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Evidence of agreement to change description of development',
			valueText: formatDocumentDetails(documents, 'changedDescription'),
			condition: (caseData) => caseData
		}
	];
};
