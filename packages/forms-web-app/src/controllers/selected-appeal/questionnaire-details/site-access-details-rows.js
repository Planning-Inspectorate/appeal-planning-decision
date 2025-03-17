const { formatSiteAccessDetails, formatSiteSafetyRisks, boolToYesNo } = require('@pins/common');
const { formatNeighbouringAddressWithBreaks } = require('@pins/common/src/lib/format-address');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.siteAccessRows = (caseData) => {
	const neighbourAddressesArray = caseData.NeighbouringAddresses || [];

	const accessForInspectionBool = !!caseData.siteAccessDetails?.[1];

	const hasNeighbourAddressesField = caseData.NeighbouringAddresses !== undefined;
	const hasNeighboursText = neighbourAddressesArray.length ? 'Yes' : 'No';

	/**
	 * @type {import("@pins/common/src/view-model-maps/rows/def").Rows}
	 */
	const rows = [
		{
			keyText: 'Might the inspector need access to the appellant’s land or property?',
			valueText: boolToYesNo(accessForInspectionBool),
			condition: () => true
		},
		{
			keyText: 'Reason for Inspector access',
			valueText: formatSiteAccessDetails(caseData),
			condition: () => accessForInspectionBool
		},
		{
			keyText: 'Might the inspector need to enter a neighbour’s land or property?',
			valueText: hasNeighboursText,
			condition: () => hasNeighbourAddressesField
		},
		{
			keyText: 'Reason for Inspector visit',
			valueText: caseData.reasonForNeighbourVisits || '',
			condition: () => hasNeighbourAddressesField && !!caseData.reasonForNeighbourVisits
		}
	];

	if (hasNeighbourAddressesField && neighbourAddressesArray.length) {
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
		condition: () => true
	});

	return rows;
};
