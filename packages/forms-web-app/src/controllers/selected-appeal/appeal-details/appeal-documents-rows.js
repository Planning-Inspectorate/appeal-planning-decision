const { formatDocumentDetails, formatNewDescription } = require('@pins/common');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

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
	const isAppellantOrAgent =
		userType === APPEAL_USER_ROLES.APPELLANT || userType === APPEAL_USER_ROLES.AGENT;

	return [
		{
			keyText: 'Application form',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.ORIGINAL_APPLICATION_FORM),
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
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Separate ownership certificate in application',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.OWNERSHIP_CERTIFICATE),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Design and access statement in application',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.DESIGN_ACCESS_STATEMENT),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Decision letter',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.APPLICATION_DECISION_LETTER),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Appeal statement',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.APPELLANT_STATEMENT),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'New plans or drawings',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.NEW_PLANS_DRAWINGS),
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
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'New supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.OTHER_NEW_DOCUMENTS),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Draft statement of common ground',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.STATEMENT_COMMON_GROUND),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Evidence of agreement to change description of development',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.CHANGED_DESCRIPTION),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Costs application',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION),
			condition: (caseData) => isAppellantOrAgent && caseData.appellantCostsAppliedFor,
			isEscaped: true
		}
	];
};
