const {
	formatDocumentDetails,
	documentExists,
	formatYesOrNo,
	formatDate
} = require('@pins/common');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.planningOfficerReportRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Uploaded planning officer’s report',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANNING_OFFICER_REPORT),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.PLANNING_OFFICER_REPORT),
			isEscaped: true
		},
		{
			keyText: 'Uploaded policies from statutory development plan',
			valueText: formatDocumentDetails(documents, 'developmentPlanPolicies'),
			condition: () => documentExists(documents, 'developmentPlanPolicies'),
			isEscaped: true
		},
		{
			keyText: 'Emerging plan',
			valueText: formatYesOrNo(caseData, 'emergingPlan'),
			condition: () => caseData.emergingPlan
		},
		{
			keyText: 'Uploaded emerging plan and supporting information',
			valueText: formatDocumentDetails(documents, 'emergingPlan'),
			condition: () => documentExists(documents, 'emergingPlan'),
			isEscaped: true
		},
		{
			keyText: 'Uploaded other relevant policies',
			valueText: formatDocumentDetails(documents, 'otherRelevantPolicies'),
			condition: () => documentExists(documents, 'otherRelevantPolicies'),
			isEscaped: true
		},
		{
			keyText: 'Supplementary planning documents',
			valueText: formatYesOrNo(caseData, 'supplementaryPlanningDocs'),
			condition: () => caseData.supplementaryPlanningDocs
		},
		{
			keyText: 'Uploaded supplementary planning documents',
			valueText: formatDocumentDetails(documents, 'supplementaryPlanningDocs'),
			condition: () => documentExists(documents, 'supplementaryPlanningDocs'),
			isEscaped: true
		},
		{
			keyText: 'Community infrastructure levy',
			valueText: formatYesOrNo(caseData, 'infrastructureLevy'),
			condition: () => caseData.infrastructureLevy
		},
		{
			keyText: 'Uploaded community infrastructure levy',
			valueText: formatDocumentDetails(documents, 'infrastructureLevy'),
			condition: () => documentExists(documents, 'infrastructureLevy'),
			isEscaped: true
		},
		{
			keyText: 'Community infrastructure levy formally adopted',
			valueText: formatYesOrNo(caseData, 'infrastructureLevyAdopted'),
			condition: () => caseData.infrastructureLevyAdopted
		},
		{
			keyText: 'Date community infrastructure levy adopted',
			valueText: formatDate(caseData.infrastructureLevyAdoptedDate),
			condition: () => caseData.infrastructureLevyAdoptedDate
		},
		{
			keyText: 'Date community infrastructure levy expected to be adopted',
			valueText: formatDate(caseData.infrastructureLevyExpectedDate),
			condition: () => caseData.infrastructureLevyExpectedDate
		}
	];
};
