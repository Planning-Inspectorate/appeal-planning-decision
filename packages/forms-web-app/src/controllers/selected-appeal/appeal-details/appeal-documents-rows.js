const { formatDocumentDetails, formatNewDescription } = require('@pins/common');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseDetailed} caseData
 * @param {string} userType
 * @returns {Rows}
 */
exports.documentsRows = (caseData, userType) => {
	const documents = caseData.Documents || [];
	const isAppellantOrAgent = userType === (APPEAL_USER_ROLES.APPELLANT || APPEAL_USER_ROLES.AGENT);

	return [
		{
			keyText: 'Application form',
			valueText: formatDocumentDetails(documents, 'originalApplicationForm'),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'New description of development',
			valueText: formatNewDescription(caseData),
			condition: () => true
		},
		{
			keyText: 'Plans, drawings and supporting documents',
			valueText: formatDocumentDetails(documents, 'plansDrawings'),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Separate ownership certificate in application',
			valueText: formatDocumentDetails(documents, 'ownershipCertificate'),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Design and access statement in application',
			valueText: formatDocumentDetails(documents, 'designAccessStatement'),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Decision letter',
			valueText: formatDocumentDetails(documents, 'lpaDecisionLetter'),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Appeal statement',
			valueText: formatDocumentDetails(documents, 'appellantStatement'),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'New plans or drawings',
			valueText: formatDocumentDetails(documents, 'newPlansDrawings'),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Planning obligation status',
			valueText: caseData.statusPlanningObligation,
			condition: (caseData) => caseData.statusPlanningObligation
		},
		{
			keyText: 'Planning obligation',
			valueText: formatDocumentDetails(documents, 'planningObligation'),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'New supporting documents',
			valueText: formatDocumentDetails(documents, 'otherNewDocuments'),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Draft statement of common ground',
			valueText: formatDocumentDetails(documents, 'statementCommonGround'),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Evidence of agreement to change description of development',
			valueText: formatDocumentDetails(documents, 'changedDescription'),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Costs application',
			valueText: formatDocumentDetails(documents, 'costsApplication'),
			condition: (caseData) => isAppellantOrAgent && caseData.appellantCostsAppliedFor,
			isEscaped: true
		}
	];
};
