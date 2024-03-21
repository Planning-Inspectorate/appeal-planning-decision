const { formatDocumentDetails, formatYesOrNo, formatDate } = require('@pins/common');

/**
 * @param {import('appeals-service-api').Api.AppealCaseWithAppellant } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.planningOfficerReportRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Uploaded planning officer’s report',
			valueText: formatDocumentDetails(documents, 'planningOfficerReport'),
			condition: (caseData) => caseData.uploadPlanningOfficerReport
		},
		{
			keyText: 'Uploaded policies from statutory development plan',
			valueText: formatDocumentDetails(documents, 'developmentPlanPolicies'),
			condition: (caseData) => caseData.uploadDevelopmentPlanPolicies
		},
		{
			keyText: 'Emerging plan',
			valueText: formatYesOrNo(caseData, 'emergingPlan'),
			condition: (caseData) => caseData.emergingPlan
		},
		{
			keyText: 'Uploaded emerging plan and supporting information',
			valueText: formatDocumentDetails(documents, 'emergingPlan'),
			condition: (caseData) => caseData.uploadEmergingPlan
		},
		{
			keyText: 'Uploaded other relevant policies',
			valueText: formatDocumentDetails(documents, 'otherRelevantPolicies'),
			condition: (caseData) => caseData.uploadOtherPolicies
		},
		{
			keyText: 'Supplementary planning documents',
			valueText: formatYesOrNo(caseData, 'supplementaryPlanningDocs'),
			condition: (caseData) => caseData.supplementaryPlanningDocs
		},
		{
			keyText: 'Uploaded supplementary planning documents',
			valueText: formatDocumentDetails(documents, 'supplementaryPlanningDocs'),
			condition: (caseData) => caseData.uploadSupplementaryPlanningDocs
		},
		{
			keyText: 'Community infrastructure levy',
			valueText: formatYesOrNo(caseData, 'infrastructureLevy'),
			condition: (caseData) => caseData.infrastructureLevy
		},
		{
			keyText: 'Uploaded community infrastructure levy',
			valueText: formatDocumentDetails(documents, 'infrastructureLevy'),
			condition: (caseData) => caseData.uploadInfrastructureLevy
		},
		{
			keyText: 'Community infrastructure levy formally adopted',
			valueText: formatYesOrNo(caseData, 'infrastructureLevyAdopted'),
			condition: (caseData) => caseData.infrastructureLevyAdopted
		},
		{
			keyText: 'Date community infrastructure levy adopted',
			valueText: formatDate(caseData.infrastructureLevyAdoptedDate),
			condition: (caseData) => caseData.infrastructureLevyAdoptedDate
		},
		{
			keyText: 'Date community infrastructure levy expected to be adopted',
			valueText: formatDate(caseData.infrastructureLevyExpectedDate),
			condition: (caseData) => caseData.infrastructureLevyExpectedDate
		}
	];
};
