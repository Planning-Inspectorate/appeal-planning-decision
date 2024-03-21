const {
	formatEnvironmentalImpactSchedule,
	formatDevelopmentDescription,
	formatSensitiveArea,
	formatYesOrNo,
	formatDocumentDetails
} = require('@pins/common');

/**
 * @param {import('appeals-service-api').Api.AppealCaseWithAppellant } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.environmentalRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Schedule type',
			valueText: formatEnvironmentalImpactSchedule(caseData),
			condition: (caseData) => caseData.environmentalImpactSchedule
		},
		{
			keyText: 'Development description',
			valueText: formatDevelopmentDescription(caseData),
			condition: (caseData) => caseData.developmentDescription
		},
		{
			keyText: 'In, partly in, or likely to affect sensitive area',
			valueText: formatSensitiveArea(caseData),
			condition: (caseData) => caseData.sensitiveArea
		},
		{
			keyText: 'Meets or exceeds threshold or criteria in column 2',
			valueText: formatYesOrNo(caseData, 'columnTwoThreshold'),
			condition: (caseData) => caseData.columnTwoThreshold
		},
		{
			keyText: 'Issued screening opinion',
			valueText: formatYesOrNo(caseData, 'screeningOpinion'),
			condition: (caseData) => caseData.screeningOpinion
		},
		{
			keyText: 'Uploaded screening opinion',
			valueText: formatDocumentDetails(documents, 'screeningOpinion'),
			condition: (caseData) => caseData.uploadScreeningOpinion
		},
		{
			keyText: 'Screening opinion indicated environmental statement needed',
			valueText: formatYesOrNo(caseData, 'requiresEnvironmentalStatement'),
			condition: (caseData) => caseData.requiresEnvironmentalStatement
		},
		{
			keyText: 'Did Environmental statement',
			valueText: formatYesOrNo(caseData, 'completedEnvironmentalStatement'),
			condition: (caseData) => caseData.completedEnvironmentalStatement
		},
		{
			keyText: 'Uploaded environmental statement',
			valueText: formatDocumentDetails(documents, 'environmentalStatement'),
			condition: (caseData) => caseData.uploadEnvironmentalStatement
		},
		{
			keyText: 'Screening direction',
			valueText: formatDocumentDetails(documents, 'screeningDirection'),
			condition: (caseData) => caseData.uploadScreeningDirection
		}
	];
};
