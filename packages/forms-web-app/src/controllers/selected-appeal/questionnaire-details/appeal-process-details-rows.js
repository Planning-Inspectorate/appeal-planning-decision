const {
	formatProcedurePreference,
	boolToYesNo,
	formatConditions,
	formatSubmissionRelatedAppeals
} = require('@pins/common');
const { fieldNames } = require('@pins/common/src/dynamic-forms/field-names');
const { isNotUndefinedOrNull } = require('#lib/is-not-undefined-or-null');
const { isExpeditedPart1Eligible } = require('#lib/is-expedited-part1-eligible');
const { nl2br } = require('@pins/common/src/utils');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.appealProcessRows = (caseData) => {
	const formattedNearby = formatSubmissionRelatedAppeals(
		caseData,
		fieldNames.nearbyAppealReference
	);
	const showNearby = !!formattedNearby;

	const formatSignificantChanges = (caseData) => {
		const changes = caseData.anySignificantChangesLpa?.split(',').map((s) => s.trim()) || [];
		if (changes.length === 0) return '';
		const mapping = [
			{
				key: 'adopted-a-new-local-plan',
				label: 'Adopted a new local plan',
				details: caseData.anySignificantChangesLpa_localPlanSignificantChanges
			},
			{
				key: 'national-policy-change',
				label: 'National policy changes',
				details: caseData.anySignificantChangesLpa_nationalPolicySignificantChanges
			},
			{
				key: 'court-judgement',
				label: 'Court judgment',
				details: caseData.anySignificantChangesLpa_courtJudgementSignificantChanges
			},
			{
				key: 'other',
				label: 'Other',
				details: caseData.anySignificantChangesLpa_otherSignificantChanges
			}
		];

		return nl2br(
			mapping
				.filter((m) => changes.includes(m.key))
				.map((m) => {
					const details = m.details ? `\n${m.details}` : '';
					return `${m.label}:${details}`;
				})
				.join('\n\n')
		);
	};

	/**
	 * @param {AppealCaseDetailed} caseData
	 * @param {DetailsContext} context
	 * @returns {Rows}
	 */
	const getExpeditedDetailsRows = (caseData) => {
		return [
			{
				keyText: 'Significant changes since application',
				valueText: formatSignificantChanges(caseData),
				condition: (caseData) => isNotUndefinedOrNull(caseData.anySignificantChangesLpa),
				isEscaped: true
			}
		];
	};
	const rows = [
		{
			keyText: 'Appeal procedure',
			valueText: formatProcedurePreference(caseData),
			condition: () => isNotUndefinedOrNull(caseData.lpaProcedurePreference)
		},
		{
			keyText: 'Appeals near the site',
			valueText: boolToYesNo(showNearby),
			condition: () => true
		},
		{
			keyText: 'Appeal references',
			valueText: showNearby ? formattedNearby : '',
			condition: () => showNearby,
			isEscaped: true
		},
		{
			keyText: 'Are there any proposed conditions?',
			valueText: formatConditions(caseData),
			condition: () => isNotUndefinedOrNull(caseData.newConditionDetails)
		}
	];

	if (
		isExpeditedPart1Eligible({
			...caseData,
			eligibility: { applicationDecision: caseData.applicationDecision }
		})
	) {
		rows.push(...getExpeditedDetailsRows(caseData));
	}
	return rows;
};
