const { formatYesOrNo, formatDesignations, formatDocumentDetails } = require('@pins/common');

/**
 * @param {import('appeals-service-api').Api.AppealCaseWithAppellant} caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */

exports.constraintsRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Is this the correct type of appeal',
			valueText: formatYesOrNo(caseData, 'correctAppealType'),
			condition: (caseData) => caseData.correctAppealType
		},
		{
			keyText: 'Changes a listed building',
			valueText: formatYesOrNo(caseData, 'changesListedBuilding'),
			condition: (caseData) => caseData.changesListedBuilding
		},
		{
			keyText: 'Listed Building details',
			valueText: '', // TODO data model will need adjusting for possible multiple buildings
			condition: (caseData) => (caseData.changedListedBuildingNumber ? true : undefined)
		},
		{
			keyText: 'Affects a listed building',
			valueText: formatYesOrNo(caseData, 'affectsListedBuilding'),
			condition: (caseData) => caseData.affectsListedBuilding
		},
		{
			keyText: 'Listed Building details',
			valueText: '', // TODO data model will need adjusting for possible multiple buildings
			condition: (caseData) => (caseData.affectedListedBuildingNumber ? true : undefined)
		},
		{
			keyText: 'Affects a scheduled monument',
			valueText: formatYesOrNo(caseData, 'scheduledMonument'),
			condition: (caseData) => caseData.scheduledMonument
		},
		{
			keyText: 'Conservation area',
			valueText: formatYesOrNo(caseData, 'conservationArea'),
			condition: (caseData) => caseData.conservationArea
		},
		{
			keyText: 'Uploaded conservation area map and guidance',
			valueText: formatDocumentDetails(documents, 'conservationMap'),
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
			valueText: formatDesignations(caseData),
			condition: (caseData) => caseData.designatedSites
		},
		{
			keyText: 'Tree Preservation Order',
			valueText: formatYesOrNo(caseData, 'treePreservationOrder'),
			condition: (caseData) => caseData.treePreservationOrder
		},
		{
			keyText: 'Uploaded Tree Preservation Order extent',
			valueText: formatDocumentDetails(documents, 'treePreservationPlan'),
			condition: (caseData) => caseData.uploadTreePreservationOrder
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
		},
		{
			keyText: 'Uploaded definitive map and statement extract',
			valueText: formatDocumentDetails(documents, 'definitiveMap'),
			condition: (caseData) => caseData.uploadDefinitiveMapStatement
		}
	];
};
