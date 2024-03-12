const { formatYesOrNo } = require('@pins/common');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
 */

exports.constraintsRows = (caseData) => {
	return [
		{
			keyText: 'Changes a listed building',
			valueText: formatYesOrNo(caseData, 'changesListedBuilding'),
			condition: (caseData) => caseData.changesListedBuilding
		},
		{
			keyText: 'Affects a listed building',
			valueText: formatYesOrNo(caseData, 'affectsListedBuilding'),
			condition: (caseData) => caseData.affectsListedBuilding
		},
		{
			keyText: 'Listed Buildings',
			valueText: '', //TODO
			condition: (caseData) => caseData.affectedListedBuildingNumber
		},
		{
			keyText: 'Affects a scheduled monument',
			valueText: formatYesOrNo(caseData, 'affectsScheduledMonument'),
			condition: (caseData) => caseData.affectsScheduledMonument
		},
		{
			keyText: 'Conservation area',
			valueText: formatYesOrNo(caseData, 'conservationArea'),
			condition: (caseData) => caseData.conservationArea
		},
		{
			keyText: 'Conservation area map and guidance',
			valueText: '', //TODO
			condition: (caseData) => caseData.uploadConservation
		},
		{
			keyText: 'Protected Species',
			valueText: formatYesOrNo(caseData, 'protectedSpecies'),
			condition: (caseData) => caseData.protectedSpecies
		},
		{
			keyText: 'Green belt',
			valueText: formatYesOrNo(caseData, 'greenBelt'),
			condition: (caseData) => caseData.greenBelt
		},
		{
			keyText: 'Area of outstanding natural beauty',
			valueText: formatYesOrNo(caseData, 'areaOutstandingBeauty'),
			condition: (caseData) => caseData.areaOutstandingBeauty
		},
		{
			keyText: 'Designated sites',
			valueText: `${caseData.designatedSites}`,
			condition: (caseData) => caseData.designatedSites
		},
		{
			keyText: 'Tree Preservation Order',
			valueText: formatYesOrNo(caseData, 'treePreservationOrder'),
			condition: (caseData) => caseData.treePreservationOrder
		},
		{
			keyText: 'Gypsy or Traveller',
			valueText: formatYesOrNo(caseData, 'gypsyTraveller'),
			condition: (caseData) => caseData.gypsyTraveller
		},
		{
			keyText: 'Public right of way',
			valueText: formatYesOrNo(caseData, 'publicRightOfWay'),
			condition: (caseData) => caseData.publicRightOfWay
		}
	];
};
