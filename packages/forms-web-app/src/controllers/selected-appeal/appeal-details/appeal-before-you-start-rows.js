const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseDetailed} caseData
 * @param {string} lpaName
 * @returns {Rows}
 */
exports.bysRows = (caseData, lpaName) => {
	const isEnforcementListed = caseData.appealTypeCode === CASE_TYPES.ENFORCEMENT_LISTED.processCode;

	const isEnforcement =
		isEnforcementListed || caseData.appealTypeCode === CASE_TYPES.ENFORCEMENT.processCode;

	return [
		{
			keyText: 'Which local planning authority (LPA) do you want to appeal against?',
			valueText: lpaName,
			condition: () => true
		},
		{
			keyText: 'Have you received an enforcement notice?',
			valueText: caseData.enforcementNotice ? 'Yes' : 'No',
			condition: () => true
		},
		{
			keyText: 'What type of application is your appeal about?',
			valueText: caseData.typeOfPlanningApplication
				? applicationTypeMappings[caseData.typeOfPlanningApplication]
				: '',
			condition: () => !isEnforcement
		},
		{
			keyText: 'What date did you submit your application?',
			valueText: formatDateForDisplay(caseData.applicationDate),
			condition: (caseData) => caseData.applicationDate != null && !isEnforcement
		},
		{
			keyText: 'Was your application granted or refused?',
			valueText: mapApplicationDecision(caseData.applicationDecision),
			condition: () => !isEnforcement
		},
		{
			keyText:
				caseData.applicationDecision == 'not_received'
					? 'What date was your decision due from the local planning authority?'
					: 'What is the date on the decision letter from the local planning authority?',
			valueText: formatDateForDisplay(caseData.applicationDecisionDate),
			condition: () => !isEnforcement
		},
		{
			keyText: 'Is your enforcement notice about a listed building?',
			valueText: isEnforcementListed ? 'Yes' : 'No',
			condition: () => isEnforcement
		},
		{
			keyText: 'What is the issue date on your enforcement notice?',
			valueText: formatDateForDisplay(caseData.issueDateOfEnforcementNotice),
			condition: () => isEnforcement
		},
		{
			keyText: 'What is the effective date on your enforcement notice?',
			valueText: formatDateForDisplay(caseData.effectiveDateOfEnforcementNotice),
			condition: () => isEnforcement
		},
		{
			keyText:
				'Did you contact the Planning Inspectorate to tell them you will appeal the enforcement notice?',
			valueText: 'Yes',
			condition: (caseData) => isEnforcement && caseData.contactPlanningInspectorateDate != null
		},
		{
			keyText: 'When did you contact the Planning Inspectorate?',
			valueText: formatDateForDisplay(caseData.contactPlanningInspectorateDate),
			condition: (caseData) => isEnforcement && caseData.contactPlanningInspectorateDate != null
		},
		{
			keyText: 'What is the reference number on the enforcement notice?',
			valueText: caseData.enforcementReference ?? '',
			condition: () => isEnforcement
		}
	];
};

const applicationTypeMappings = {
	'full-appeal': 'Full planning',
	'householder-planning': 'Householder planning',
	'listed-building': 'Listed building consent',
	advertisement: 'Displaying an advertisement',
	'lawful-development-certificate': 'Lawful development certificate',
	'minor-commercial-development': 'Minor commercial development',
	'minor-commercial-advertisement': 'Minor commercial advertisement',
	'outline-planning': 'Outline planning',
	'prior-approval': 'Prior approval',
	'reserved-matters': 'Reserved matters',
	'removal-or-variation-of-conditions': 'Removal or variation of conditions',
	'something-else': 'Something else',
	'i-have-not-made-a-planning-application': 'I have not made a planning application'
};

const mapApplicationDecision = (/** @type {string | null | undefined} */ decision) => {
	if (!decision) return;
	if (decision === 'not_received') return 'I have not received a decision';
	return decision.replace(/^\w/, (c) => c.toUpperCase());
};
