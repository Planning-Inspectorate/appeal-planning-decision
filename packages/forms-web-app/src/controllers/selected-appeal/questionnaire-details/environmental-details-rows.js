const {
	formatEnvironmentalImpactSchedule,
	formatDevelopmentDescription,
	formatSensitiveArea,
	formatYesOrNo,
	formatDocumentDetails,
	documentExists,
	boolToYesNo
} = require('@pins/common');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	APPEAL_DOCUMENT_TYPE,
	APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE
} = require('@planning-inspectorate/data-model');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.environmentalRows = (caseData) => {
	const documents = caseData.Documents || [];

	const isHASAppeal = caseData.appealTypeCode === CASE_TYPES.HAS.processCode;
	if (isHASAppeal) return [];

	const isSchedule1 =
		caseData.environmentalImpactSchedule === APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_1;
	const isSchedule2 =
		caseData.environmentalImpactSchedule === APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_2;

	return [
		{
			keyText: 'Schedule type',
			valueText: formatEnvironmentalImpactSchedule(caseData),
			condition: () => true
		},
		{
			keyText: 'Development description',
			valueText: formatDevelopmentDescription(caseData),
			condition: () => isSchedule2
		},
		{
			keyText: 'In, partly in, or likely to affect sensitive area',
			valueText: formatSensitiveArea(caseData),
			condition: () => isSchedule2
		},
		{
			keyText: 'Meets or exceeds threshold or criteria in column 2',
			valueText: formatYesOrNo(caseData, 'columnTwoThreshold'),
			condition: () => isSchedule2
		},
		{
			keyText: 'Issued screening opinion',
			valueText: formatYesOrNo(caseData, 'screeningOpinion'),
			condition: () => !isSchedule1
		},
		{
			keyText: 'Uploaded screening opinion',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.EIA_SCREENING_OPINION),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.EIA_SCREENING_OPINION),
			isEscaped: true
		},
		{
			keyText: 'Received scoping opinion',
			valueText: boolToYesNo(documentExists(documents, APPEAL_DOCUMENT_TYPE.EIA_SCOPING_OPINION)),
			condition: () => !isSchedule1
		},
		{
			keyText: 'Uploaded scoping opinion',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.EIA_SCOPING_OPINION),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.EIA_SCOPING_OPINION),
			isEscaped: true
		},
		{
			keyText: 'Screening opinion indicated environmental statement needed',
			valueText: formatYesOrNo(caseData, 'requiresEnvironmentalStatement'),
			condition: () => caseData.screeningOpinion
		},
		{
			keyText: 'Did Environmental statement',
			valueText: formatYesOrNo(caseData, 'completedEnvironmentalStatement'),
			condition: () => true
		},
		{
			keyText: 'Uploaded environmental statement',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.EIA_ENVIRONMENTAL_STATEMENT),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.EIA_ENVIRONMENTAL_STATEMENT),
			isEscaped: true
		},
		{
			keyText: 'Uploaded screening direction',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.EIA_SCREENING_DIRECTION),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.EIA_SCREENING_DIRECTION),
			isEscaped: true
		}
	];
};
