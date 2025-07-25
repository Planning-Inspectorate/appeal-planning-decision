const {
	formatDocumentDetails,
	documentExists,
	formatYesOrNo,
	boolToYesNo
} = require('@pins/common');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');

const { isNotUndefinedOrNull } = require('#lib/is-not-undefined-or-null');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.planningOfficerReportRows = (caseData) => {
	const documents = caseData.Documents || [];

	const hasEmergingPlan = documentExists(documents, APPEAL_DOCUMENT_TYPE.EMERGING_PLAN);
	const emergingPlanText = boolToYesNo(hasEmergingPlan);

	const hasSupplementaryPlanning = documentExists(
		documents,
		APPEAL_DOCUMENT_TYPE.SUPPLEMENTARY_PLANNING
	);
	const supplementaryPlanningText = boolToYesNo(hasSupplementaryPlanning);
	return [
		{
			keyText: "Planning officer's report",
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANNING_OFFICER_REPORT),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.PLANNING_OFFICER_REPORT),
			isEscaped: true
		},
		{
			keyText: 'Plans, drawings and list of plans',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS),
			condition: () =>
				caseData.appealTypeCode === CASE_TYPES.HAS.processCode &&
				documentExists(documents, APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS),
			isEscaped: true
		},
		{
			keyText: 'Policies from statutory development plan',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.DEVELOPMENT_PLAN_POLICIES),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.DEVELOPMENT_PLAN_POLICIES),
			isEscaped: true
		},
		{
			keyText: 'Emerging plan',
			valueText: emergingPlanText,
			condition: () => true
		},
		{
			keyText: 'Uploaded emerging plan and supporting information',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.EMERGING_PLAN),
			condition: () => hasEmergingPlan,
			isEscaped: true
		},
		{
			keyText: 'Uploaded other relevant policies',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.OTHER_RELEVANT_POLICIES),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.OTHER_RELEVANT_POLICIES),
			isEscaped: true
		},
		{
			keyText: 'Supplementary planning documents',
			valueText: supplementaryPlanningText,
			condition: () => true
		},
		{
			keyText: 'Uploaded supplementary planning documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.SUPPLEMENTARY_PLANNING),
			condition: () => hasSupplementaryPlanning,
			isEscaped: true
		},
		{
			keyText: 'Community infrastructure levy',
			valueText: formatYesOrNo(caseData, 'infrastructureLevy'),
			condition: () => isNotUndefinedOrNull(caseData.infrastructureLevy)
		},
		{
			keyText: 'Uploaded community infrastructure levy',
			valueText: formatDocumentDetails(
				documents,
				APPEAL_DOCUMENT_TYPE.COMMUNITY_INFRASTRUCTURE_LEVY
			),
			condition: () =>
				documentExists(documents, APPEAL_DOCUMENT_TYPE.COMMUNITY_INFRASTRUCTURE_LEVY),
			isEscaped: true
		},
		{
			keyText: 'Community infrastructure levy formally adopted',
			valueText: formatYesOrNo(caseData, 'infrastructureLevyAdopted'),
			condition: () => isNotUndefinedOrNull(caseData.infrastructureLevyAdopted)
		},
		{
			keyText: 'Date community infrastructure levy adopted',
			valueText: formatDateForDisplay(caseData.infrastructureLevyAdoptedDate),
			condition: () => !!caseData.infrastructureLevyAdoptedDate
		},
		{
			keyText: 'Date community infrastructure levy expected to be adopted',
			valueText: formatDateForDisplay(caseData.infrastructureLevyExpectedDate),
			condition: () => !!caseData.infrastructureLevyExpectedDate
		}
	];
};
