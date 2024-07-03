const { formatYesOrNo, formatDesignations, formatDocumentDetails } = require('@pins/common');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');

/**
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 */

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed} caseData
 * @param {AppealToUserRoles|LpaUserRole|null} user
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */

exports.constraintsRows = (caseData, user) => {
	const documents = caseData.Documents || [];

	const affectedListedBuildings = caseData.AffectedListedBuildings;
	const showAffectedListed = !!(affectedListedBuildings && affectedListedBuildings.length);

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
			keyText: 'Affects a listed building',
			valueText: 'Yes',
			condition: () => showAffectedListed
		},
		{
			// todo: bring in listed building details after move of listed building data to sql
			keyText: 'Listed building details',
			valueText: affectedListedBuildings?.map((x) => x.listedBuildingReference).join('\n'),
			condition: () => showAffectedListed
		},
		{
			keyText: 'Affects a scheduled monument',
			valueText: formatYesOrNo(caseData, 'scheduledMonument'),
			condition: () => caseData.scheduledMonument
		},
		{
			keyText: 'Conservation area',
			valueText: formatYesOrNo(caseData, 'conservationArea'),
			condition: () => caseData.conservationArea
		},
		{
			keyText: 'Uploaded conservation area map and guidance',
			valueText: formatDocumentDetails(documents, 'conservationMap'),
			condition: () => caseData.uploadConservation,
			isEscaped: true
		},
		{
			keyText: 'Protected species',
			valueText: formatYesOrNo(caseData, 'protectedSpecies'),
			condition: () => caseData.protectedSpecies
		},
		{
			keyText: 'Green belt',
			valueText: formatYesOrNo(caseData, 'isGreenBelt'),
			condition: () => caseData.isGreenBelt
		},
		{
			keyText: 'Area of outstanding natural beauty',
			valueText: formatYesOrNo(caseData, 'areaOutstandingBeauty'),
			condition: () => caseData.areaOutstandingBeauty
		},
		{
			keyText: 'Designated sites',
			valueText: formatDesignations(caseData),
			condition: () => caseData.designatedSites
		},
		{
			keyText: 'Tree Preservation Order',
			valueText: formatYesOrNo(caseData, 'treePreservationOrder'),
			condition: () => caseData.treePreservationOrder
		},
		{
			keyText: 'Uploaded Tree Preservation Order extent',
			valueText: formatDocumentDetails(documents, 'treePreservationPlan'),
			condition: () => caseData.uploadTreePreservationOrder,
			isEscaped: true
		},
		{
			keyText: 'Gypsy or Traveller',
			valueText: formatYesOrNo(caseData, 'gypsyTraveller'),
			condition: () => caseData.gypsyTraveller
		},
		{
			keyText: 'Public right of way',
			valueText: formatYesOrNo(caseData, 'publicRightOfWay'),
			condition: () => caseData.publicRightOfWay
		},
		{
			keyText: 'Uploaded definitive map and statement extract',
			valueText: formatDocumentDetails(documents, 'definitiveMap'),
			condition: () => caseData.uploadDefinitiveMapStatement,
			isEscaped: true
		}
	];

	if (user === LPA_USER_ROLE) {
		rows.unshift({
			keyText: 'Is this the correct type of appeal',
			valueText: formatYesOrNo(caseData, 'isCorrectAppealType'),
			condition: () => caseData.isCorrectAppealType
		});
	}

	return rows;
};
