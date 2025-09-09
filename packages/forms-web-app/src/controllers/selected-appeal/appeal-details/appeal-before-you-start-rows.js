const { boolToYesNo } = require('@pins/common');
const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseDetailed} caseData
 * @param {string} lpaName
 * @returns {Rows}
 */
exports.bysRows = (caseData, lpaName) => [
	{
		keyText: 'Which local planning authority (LPA) do you want to appeal against?',
		valueText: lpaName,
		condition: () => true
	},
	{
		keyText: 'Have you received an enforcement notice?',
		valueText: boolToYesNo(false), // is always false for appeals that have been submitted
		condition: () => true
	},
	{
		keyText: 'What type of application is your appeal about?',
		valueText: caseData.typeOfPlanningApplication
			? applicationTypeMappings[caseData.typeOfPlanningApplication]
			: '',
		condition: () => true
	},
	{
		keyText: 'What date did you submit your application?',
		valueText: formatDateForDisplay(caseData.applicationDate),
		condition: (caseData) => caseData.applicationDate != null
	},
	{
		keyText: 'Was your application granted or refused?',
		valueText: mapApplicationDecision(caseData.applicationDecision),
		condition: () => true
	},
	{
		keyText:
			caseData.applicationDecision == 'not_received'
				? 'What date was your decision due from the local planning authority?'
				: 'What is the date on the decision letter from the local planning authority?',
		valueText: formatDateForDisplay(caseData.applicationDecisionDate),
		condition: () => true
	}
];

const applicationTypeMappings = {
	'full-appeal': 'Full planning',
	'householder-planning': 'Householder planning',
	'listed-building': 'Listed building consent',
	advertisement: 'Displaying an advertisement',
	'minor-commercial-development': 'Minor commercial development',
	'minor-commercial-advertisement': 'Minor commercial advertisement',
	'outline-planning': 'Outline planning',
	'prior-approval': 'Prior approval',
	'reserved-matters': 'Reserved matters',
	'removal-or-variation-of-conditions': 'Removal or variation of conditions',
	'something-else': 'Something else',
	'i-have-not-made-a-planning-application': 'I have not made a planning application'
};

const mapApplicationDecision = (/** @type {string} */ decison) => {
	if (decison === 'not_received') return 'I have not received a decision';
	return decison.replace(/^\w/, (c) => c.toUpperCase());
};
