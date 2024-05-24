const { formatDocumentDetails, formatNewDescription } = require('@pins/common');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 * @typedef {import('appeals-service-api').Api.Document[]} Documents
 */

/**
 * @param {AppealCaseWithAppellant} caseData
 * @param {string} userType
 * @returns {Rows}
 */
exports.documentsRows = (caseData, userType) => {
	/** @type {Documents} */
	// @ts-ignore
	const documents = caseData.Documents || [];
	const isAppellantOrAgent = userType === (APPEAL_USER_ROLES.APPELLANT || APPEAL_USER_ROLES.AGENT);

	return [
		{
			keyText: 'Application form',
			valueText: formatDocumentDetails(documents, 'originalApplicationForm'),
			shouldDisplay: true
		},
		{
			keyText: 'New description of development',
			valueText: formatNewDescription(caseData),
			shouldDisplay: true
		},
		{
			keyText: 'Plans, drawings and supporting documents',
			valueText: formatDocumentDetails(documents, 'plansDrawings'),
			shouldDisplay: true
		},
		{
			keyText: 'Separate ownership certificate in application',
			valueText: formatDocumentDetails(documents, 'ownershipCertificate'),
			shouldDisplay: true
		},
		{
			keyText: 'Design and access statement in application',
			valueText: formatDocumentDetails(documents, 'designAccessStatement'),
			shouldDisplay: true
		},
		{
			keyText: 'Decision letter',
			valueText: formatDocumentDetails(documents, 'lpaDecisionLetter'),
			shouldDisplay: true
		},
		{
			keyText: 'Appeal statement',
			valueText: formatDocumentDetails(documents, 'appellantStatement'),
			shouldDisplay: true
		},
		{
			keyText: 'New plans or drawings',
			valueText: formatDocumentDetails(documents, 'newPlansDrawings'),
			shouldDisplay: true
		},
		{
			keyText: 'Planning obligation status',
			valueText: caseData.statusPlanningObligation,
			shouldDisplay: !!caseData.statusPlanningObligation
		},
		{
			keyText: 'Planning obligation',
			valueText: formatDocumentDetails(documents, 'planningObligation'),
			shouldDisplay: true
		},
		{
			keyText: 'New supporting documents',
			valueText: formatDocumentDetails(documents, 'otherNewDocuments'),
			shouldDisplay: true
		},
		{
			keyText: 'Draft statement of common ground',
			valueText: formatDocumentDetails(documents, 'statementCommonGround'),
			shouldDisplay: true
		},
		{
			keyText: 'Evidence of agreement to change description of development',
			valueText: formatDocumentDetails(documents, 'changedDescription'),
			shouldDisplay: true
		},
		{
			keyText: 'Costs application',
			valueText: formatDocumentDetails(documents, 'costsApplication'),
			shouldDisplay: isAppellantOrAgent && caseData.costsAppliedForIndicator
		}
	];
};
