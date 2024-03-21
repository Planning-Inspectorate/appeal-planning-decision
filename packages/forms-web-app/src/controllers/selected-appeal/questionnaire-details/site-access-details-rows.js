const { formatYesOrNo, formatSiteSafetyRisks } = require('@pins/common');
const { formatNeibouringAddressWithBreaks } = require('@pins/common/src/lib/format-address');

/**
 * @param {import('appeals-service-api').Api.AppealCaseWithAppellant } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.siteAccessRows = (caseData) => {
	const neighbourAdresses = caseData.NeighbouringAddresses || [];
	/**
	 * @type {import("@pins/common/src/view-model-maps/rows/def").Rows}
	 */
	const rows = [
		{
			keyText: 'Access for inspection',
			valueText: formatYesOrNo(caseData, 'lpaSiteAccess'),
			condition: (caseData) => caseData.uploadPlanningOfficerReport
		},
		{
			keyText: 'Reason for Inspector access',
			valueText: `${caseData.lpaSiteAccessDetails}`,
			condition: (caseData) => caseData.lpaSiteAccessDetails
		},
		{
			keyText: 'Inspector visit to neighbour',
			valueText: formatYesOrNo(caseData, 'neighbouringSiteAccess'),
			condition: (caseData) => caseData.neighbouringSiteAccess
		},
		{
			keyText: 'Reason for Inspector visit',
			valueText: `${caseData.neighbouringSiteAccessDetails}`,
			condition: (caseData) => caseData.neighbouringSiteAccessDetails
		}
	];

	if (caseData.addNeighbouringSiteAccess) {
		neighbourAdresses.forEach((address, index) => {
			const formattedAddress = formatNeibouringAddressWithBreaks(address);
			rows.push({
				keyText: `Neighbouring site ${index + 1}`,
				valueText: formattedAddress,
				condition: () => true
			});
		});
	}

	if (caseData.lpaSiteSafetyRisks) {
		rows.push({
			keyText: 'Potential safety risks',
			valueText: formatSiteSafetyRisks(caseData),
			condition: () => true
		});
	}
	return rows;
};
