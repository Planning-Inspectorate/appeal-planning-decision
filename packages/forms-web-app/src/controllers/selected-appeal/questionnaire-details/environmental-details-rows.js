const {
	formatEnvironmentalImpactSchedule,
	formatDevelopmentDescription,
	formatSensitiveArea,
	formatYesOrNo,
	formatDocumentDetails,
	documentExists
} = require('@pins/common');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.environmentalRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Schedule type',
			valueText: formatEnvironmentalImpactSchedule(caseData),
			condition: () => caseData.environmentalImpactSchedule
		},
		{
			keyText: 'Development description',
			valueText: formatDevelopmentDescription(caseData),
			condition: () => caseData.developmentDescription
		},
		{
			keyText: 'In, partly in, or likely to affect sensitive area',
			valueText: formatSensitiveArea(caseData),
			condition: () => !!caseData.sensitiveAreaDetails
		},
		{
			keyText: 'Meets or exceeds threshold or criteria in column 2',
			valueText: formatYesOrNo(caseData, 'columnTwoThreshold'),
			condition: () => caseData.columnTwoThreshold
		},
		{
			keyText: 'Uploaded screening direction',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.EIA_SCREENING_DIRECTION),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.EIA_SCREENING_DIRECTION),
			isEscaped: true
		},
		{
			keyText: 'Issued screening opinion',
			valueText: formatYesOrNo(caseData, 'screeningOpinion'),
			condition: () => caseData.screeningOpinion
		},
		{
			keyText: 'Uploaded screening opinion',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.EIA_SCREENING_OPINION),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.EIA_SCREENING_OPINION),
			isEscaped: true
		},
		{
			keyText: 'Screening opinion indicated environmental statement needed',
			valueText: formatYesOrNo(caseData, 'requiresEnvironmentalStatement'),
			condition: () => caseData.requiresEnvironmentalStatement
		},
		{
			keyText: 'Did Environmental statement',
			valueText: formatYesOrNo(caseData, 'completedEnvironmentalStatement'),
			condition: () => caseData.completedEnvironmentalStatement
		},
		{
			keyText: 'Uploaded environmental statement',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.EIA_ENVIRONMENTAL_STATEMENT),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.EIA_ENVIRONMENTAL_STATEMENT),
			isEscaped: true
		}
	];
};
