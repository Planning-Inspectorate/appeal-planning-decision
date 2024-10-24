const {
	formatYesOrNo,
	formatDesignations,
	formatDocumentDetails,
	documentExists
} = require('@pins/common');
const { APPEALS_CASE_DATA } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed} caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */

exports.constraintsRows = (caseData) => {
	const documents = caseData.Documents || [];
	const isNotHAS = caseData.appealTypeCode !== APPEALS_CASE_DATA.APPEAL_TYPE_CODE.HAS;

	const affectedListedBuildings = caseData.AffectedListedBuildings;
	const showAffectedListed = !!(affectedListedBuildings && affectedListedBuildings.length);
	const affectedListedBuildingText = showAffectedListed ? 'Yes' : 'No';

	const rows = [
		// todo: s78 needs a type on relation
		// {
		// 	keyText: 'Changes a listed building',
		// 	valueText: formatYesOrNo(caseData, 'changesListedBuilding'),
		// 	condition: () => caseData.changesListedBuilding
		// },
		// {
		// 	keyText: 'Listed building details',
		// 	valueText: '', // TODO data model will need adjusting for possible multiple buildings
		// 	condition: () => (caseData.changedListedBuildingNumber ? true : undefined)
		// },
		{
			keyText: 'Is this the correct type of appeal',
			valueText: formatYesOrNo(caseData, 'isCorrectAppealType'),
			condition: () => conditionYesOrNo(caseData.isCorrectAppealType)
		},
		{
			keyText: 'Affects a listed building',
			valueText: affectedListedBuildingText,
			condition: () => conditionYesOrNo(caseData.AffectedListedBuildings)
		},
		{
			// todo: bring in listed building details after move of listed building data to sql
			keyText: 'Listed building details',
			valueText: affectedListedBuildings?.map((x) => x.listedBuildingReference).join('\n') || '',
			condition: () => showAffectedListed
		},
		{
			keyText: 'Affects a scheduled monument',
			valueText: formatYesOrNo(caseData, 'scheduledMonument'),
			condition: () => isNotHAS && conditionYesOrNo(caseData.scheduledMonument)
		},
		{
			keyText: 'Conservation area',
			valueText: formatYesOrNo(caseData, 'conservationArea'),
			condition: () => conditionYesOrNo(caseData.conservationArea)
		},
		{
			keyText: 'Uploaded conservation area map and guidance',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP),
			condition: () =>
				!!caseData.conservationArea &&
				documentExists(documents, APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP),
			isEscaped: true
		},
		{
			keyText: 'Protected species',
			valueText: formatYesOrNo(caseData, 'protectedSpecies'),
			condition: () => isNotHAS && conditionYesOrNo(caseData.protectedSpecies)
		},
		{
			keyText: 'Green belt',
			valueText: formatYesOrNo(caseData, 'isGreenBelt'),
			condition: () => conditionYesOrNo(caseData.isGreenBelt)
		},
		{
			keyText: 'Area of outstanding natural beauty',
			valueText: formatYesOrNo(caseData, 'areaOutstandingBeauty'),
			condition: () => isNotHAS && conditionYesOrNo(caseData.areaOutstandingBeauty)
		},
		{
			keyText: 'Designated sites',
			valueText: formatDesignations(caseData),
			condition: () => isNotHAS && !!formatDesignations(caseData)
		},
		{
			keyText: 'Tree Preservation Order',
			valueText: formatYesOrNo(caseData, 'treePreservationOrder'),
			condition: () => isNotHAS && conditionYesOrNo(caseData.treePreservationOrder)
		},
		{
			keyText: 'Uploaded Tree Preservation Order extent',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.TREE_PRESERVATION_PLAN),
			condition: () =>
				isNotHAS &&
				!!caseData.treePreservationOrder &&
				documentExists(documents, APPEAL_DOCUMENT_TYPE.TREE_PRESERVATION_PLAN),
			isEscaped: true
		},
		{
			keyText: 'Gypsy or Traveller',
			valueText: formatYesOrNo(caseData, 'gypsyTraveller'),
			condition: () => isNotHAS && conditionYesOrNo(caseData.gypsyTraveller)
		},
		{
			keyText: 'Public right of way',
			valueText: formatYesOrNo(caseData, 'publicRightOfWay'),
			condition: () => isNotHAS && conditionYesOrNo(caseData.publicRightOfWay)
		},
		{
			keyText: 'Uploaded definitive map and statement extract',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.DEFINITIVE_MAP_STATEMENT),
			condition: () =>
				isNotHAS && documentExists(documents, APPEAL_DOCUMENT_TYPE.DEFINITIVE_MAP_STATEMENT),
			isEscaped: true
		}
	];

	return rows;
};

/**
 * @param {any} input
 * @returns {boolean}
 */
const conditionYesOrNo = (input) => {
	return !(input === undefined || input === null);
};
