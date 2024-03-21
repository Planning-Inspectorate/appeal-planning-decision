const { formatProcedurePreference, formatYesOrNo, formatConditions } = require('@pins/common');

/**
 * @param {import('appeals-service-api').Api.AppealCaseWithAppellant } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.appealProcessRows = (caseData) => {
	return [
		{
			keyText: 'Appeal procedure',
			valueText: formatProcedurePreference(caseData),
			condition: (caseData) => caseData.lpaProcedurePreference
		},
		{
			keyText: 'Appeals near the site',
			valueText: formatYesOrNo(caseData, 'nearbyAppeals'),
			condition: (caseData) => caseData.nearbyAppeals
		},
		{
			keyText: 'Appeal references',
			valueText: '', // TODO data model will need adjusting for possible multiple appeals
			condition: (caseData) => caseData.nearbyAppealReference
		},
		{
			keyText: 'Extra conditions',
			valueText: formatConditions(caseData),
			condition: (caseData) => caseData.newConditions
		}
	];
};
