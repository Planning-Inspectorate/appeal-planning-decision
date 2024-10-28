const { formatYesOrNo, formatSiteSafetyRisks } = require('@pins/common');
const { formatNeighbouringAddressWithBreaks } = require('@pins/common/src/lib/format-address');
const { isNotUndefinedOrNull } = require('#lib/is-not-undefined-or-null');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.siteAccessRows = (caseData) => {
	const neighbourAddressesArray = caseData.NeighbouringAddresses || [];

	const hasNeighbourAddresses = caseData.NeighbouringAddresses !== undefined;
	const hasNeighboursText = neighbourAddressesArray.length ? 'Yes' : 'No';

	/**
	 * @type {import("@pins/common/src/view-model-maps/rows/def").Rows}
	 */
	const rows = [
		{
			keyText: 'Access for inspection',
			valueText: formatYesOrNo(caseData, 'lpaSiteAccess'),
			condition: () => isNotUndefinedOrNull(caseData.lpaSiteAccess)
		},
		{
			keyText: 'Reason for Inspector access',
			valueText: `${caseData.lpaSiteAccessDetails}`,
			condition: () => !!caseData.lpaSiteAccessDetails
		},
		{
			keyText: 'Inspector visit to neighbour',
			valueText: hasNeighboursText,
			condition: () => hasNeighbourAddresses
		},
		{
			keyText: 'Reason for Inspector visit',
			valueText: caseData.neighbouringSiteAccessDetails || '',
			condition: () => !!caseData.neighbouringSiteAccessDetails
		}
	];

	if (hasNeighbourAddresses && neighbourAddressesArray.length) {
		neighbourAddressesArray.forEach((address, index) => {
			const formattedAddress = formatNeighbouringAddressWithBreaks(address);
			rows.push({
				keyText: `Neighbouring site ${index + 1}`,
				valueText: formattedAddress,
				condition: () => true
			});
		});
	}

	rows.push({
		keyText: 'Potential safety risks',
		valueText: formatSiteSafetyRisks(caseData),
		condition: () => isNotUndefinedOrNull(caseData.lpaSiteSafetyRisks)
	});

	return rows;
};
