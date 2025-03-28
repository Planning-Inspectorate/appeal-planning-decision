const {
	formatProcedurePreference,
	boolToYesNo,
	formatConditions,
	formatSubmissionRelatedAppeals
} = require('@pins/common');
const { fieldNames } = require('@pins/common/src/dynamic-forms/field-names');

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

	return [
		{
			keyText: 'Appeal procedure',
			valueText: formatProcedurePreference(caseData),
			condition: () => !!caseData.lpaProcedurePreference
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
			keyText: 'Extra conditions',
			valueText: formatConditions(caseData),
			condition: () => caseData.newConditionDetails !== undefined
		}
	];
};
