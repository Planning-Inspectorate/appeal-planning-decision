const { formatDocumentDetails, formatYesOrNo, formatDate } = require('@pins/common');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.planningOfficerReportRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Uploaded planning officer’s report',
			valueText: formatDocumentDetails(documents, 'planningOfficerReport'),
			condition: () => caseData.uploadPlanningOfficerReport,
			isEscaped: true
		},
		{
			keyText: 'Uploaded policies from statutory development plan',
			valueText: formatDocumentDetails(documents, 'developmentPlanPolicies'),
			condition: () => caseData.uploadDevelopmentPlanPolicies,
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
			condition: () => caseData.uploadEmergingPlan,
			isEscaped: true
		},
		{
			keyText: 'Uploaded other relevant policies',
			valueText: formatDocumentDetails(documents, 'otherRelevantPolicies'),
			condition: () => caseData.uploadOtherPolicies,
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
			condition: () => caseData.uploadSupplementaryPlanningDocs,
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
			condition: () => caseData.uploadInfrastructureLevy,
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
