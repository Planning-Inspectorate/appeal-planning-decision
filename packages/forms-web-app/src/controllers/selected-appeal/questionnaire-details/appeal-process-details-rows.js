const {
	formatProcedurePreference,
	boolToYesNo,
	formatConditions,
	formatRelatedAppeals
} = require('@pins/common');
const { CASE_RELATION_TYPES } = require('@pins/common/src/database/data-static');
const { isNotUndefinedOrNull } = require('#lib/is-not-undefined-or-null');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.appealProcessRows = (caseData) => {
	const formattedNearby = formatRelatedAppeals(caseData, CASE_RELATION_TYPES.nearby);
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
			condition: () => isNotUndefinedOrNull(caseData.relations)
		},
		{
			keyText: 'Appeal references',
			valueText: showNearby ? formattedNearby : '',
			condition: () => showNearby
		},
		{
			keyText: 'Extra conditions',
			valueText: formatConditions(caseData),
			condition: () => isNotUndefinedOrNull(caseData.changedDevelopmentDescription)
		}
	];
};
