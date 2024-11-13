const { formatSiteAccessDetails, formatSiteSafetyRisks, boolToYesNo } = require('@pins/common');
const { formatNeighbouringAddressWithBreaks } = require('@pins/common/src/lib/format-address');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.siteAccessRows = (caseData) => {
	const neighbourAddressesArray = caseData.NeighbouringAddresses || [];

	//todo: siteAccessDetails and siteSafetyRisks logic will need updating when data model updated
	// to specify which details provided by LPAQ and which provided by appellant
	const showAccessForInspection = caseData.siteAccessDetails !== undefined;
	const accessForInspectionBool = !!caseData.siteAccessDetails?.filter((value) => value !== null)
		.length;

	const showSiteSafetyDetails = caseData.siteSafetyDetails !== undefined;
	const hasSiteSafetyDetails = !!caseData.siteSafetyDetails?.filter((value) => value !== null)
		.length;

	const hasNeighbourAddressesField = caseData.NeighbouringAddresses !== undefined;
	const hasNeighboursText = neighbourAddressesArray.length ? 'Yes' : 'No';

	/**
	 * @type {import("@pins/common/src/view-model-maps/rows/def").Rows}
	 */
	const rows = [
		{
			keyText: 'Access for inspection',
			valueText: boolToYesNo(accessForInspectionBool),
			condition: () => showAccessForInspection
		},
		{
			keyText: 'Reason for Inspector access',
			valueText: caseData.siteAccessDetails
				? formatSiteAccessDetails(caseData.siteAccessDetails)
				: '',
			condition: () => accessForInspectionBool
		},
		{
			keyText: 'Inspector visit to neighbour',
			valueText: hasNeighboursText,
			condition: () => hasNeighbourAddressesField
		},
		{
			keyText: 'Reason for Inspector visit',
			valueText: caseData.neighbouringSiteAccessDetails || '',
			condition: () => !!caseData.neighbouringSiteAccessDetails
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
		valueText: formatSiteSafetyRisks(caseData, hasSiteSafetyDetails),
		condition: () => showSiteSafetyDetails
	});

	return rows;
};
