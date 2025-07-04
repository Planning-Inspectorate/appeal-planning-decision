const {
	formatYesOrNo,
	formatDesignations,
	formatDocumentDetails,
	documentExists,
	boolToYesNo
} = require('@pins/common');
const { CASE_TYPES, caseTypeLookup } = require('@pins/common/src/database/data-static');

const { LISTED_RELATION_TYPES } = require('@pins/common/src/database/data-static');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');
const { isNotUndefinedOrNull } = require('#lib/is-not-undefined-or-null');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed} caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */

exports.constraintsRows = (caseData) => {
	const documents = caseData.Documents || [];

	const isHASAppeal = caseData.appealTypeCode === CASE_TYPES.HAS.processCode;

	const affectedListedBuildings = caseData.ListedBuildings?.filter(
		(x) => x.type === LISTED_RELATION_TYPES.affected
	);
	const changedListedBuildings = caseData.ListedBuildings?.filter(
		(x) => x.type === LISTED_RELATION_TYPES.changed
	);
	const showAffectedListed = !!(affectedListedBuildings && affectedListedBuildings.length);
	const showChangedListed = !!(changedListedBuildings && changedListedBuildings.length);
	const affectedListedBuildingText = boolToYesNo(showAffectedListed);
	const changedListedBuildingText = boolToYesNo(showChangedListed);

	const hasConservationMap = documentExists(documents, APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP);
	const conservationAreaText = boolToYesNo(hasConservationMap);

	const rows = [
		{
			keyText: `Is a ${
				caseTypeLookup(caseData.appealTypeCode, 'processCode')?.caption.toLowerCase() || 'unknown'
			} appeal the correct type of appeal?`,
			valueText: formatYesOrNo(caseData, 'isCorrectAppealType'),
			condition: () => isNotUndefinedOrNull(caseData.isCorrectAppealType)
		},
		{
			keyText: 'Changes a listed building',
			valueText: changedListedBuildingText,
			condition: () => !isHASAppeal
		},
		{
			keyText: 'Listed building details',
			valueText: changedListedBuildings?.map((x) => x.listedBuildingReference).join('\n') || '',
			condition: () => showChangedListed
		},
		{
			keyText: 'Affects a listed building',
			valueText: affectedListedBuildingText,
			condition: () => true
		},
		{
			keyText: 'Listed building details',
			valueText: affectedListedBuildings?.map((x) => x.listedBuildingReference).join('\n') || '',
			condition: () => showAffectedListed
		},
		{
			keyText: 'Was a grant or loan made to preserve the listed building at the appeal site?',
			valueText: formatYesOrNo(caseData, 'preserveGrantLoan'),
			condition: () => isNotUndefinedOrNull(caseData.preserveGrantLoan)
		},
		{
			keyText: 'Was Historic England consulted?',
			valueText: formatYesOrNo(caseData, 'consultHistoricEngland'),
			condition: () => isNotUndefinedOrNull(caseData.consultHistoricEngland)
		},
		{
			keyText: 'Uploaded consultation with Historic England',
			valueText: formatDocumentDetails(
				documents,
				APPEAL_DOCUMENT_TYPE.HISTORIC_ENGLAND_CONSULTATION
			),
			condition: () =>
				documentExists(documents, APPEAL_DOCUMENT_TYPE.HISTORIC_ENGLAND_CONSULTATION),
			isEscaped: true
		},
		{
			keyText: 'Affects a scheduled monument',
			valueText: formatYesOrNo(caseData, 'scheduledMonument'),
			condition: () => !isHASAppeal && isNotUndefinedOrNull(caseData.scheduledMonument)
		},
		{
			keyText: 'Conservation area',
			valueText: conservationAreaText,
			condition: () => true
		},
		{
			keyText: 'Uploaded conservation area map and guidance',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP),
			condition: () => hasConservationMap,
			isEscaped: true
		},
		{
			keyText: 'Protected species',
			valueText: formatYesOrNo(caseData, 'protectedSpecies'),
			condition: () => isNotUndefinedOrNull(caseData.protectedSpecies)
		},
		{
			keyText: 'Green belt',
			valueText: formatYesOrNo(caseData, 'isGreenBelt'),
			condition: () => isNotUndefinedOrNull(caseData.isGreenBelt)
		},
		{
			keyText: 'Area of outstanding natural beauty',
			valueText: formatYesOrNo(caseData, 'areaOutstandingBeauty'),
			condition: () => isNotUndefinedOrNull(caseData.areaOutstandingBeauty)
		},
		{
			keyText: 'Designated sites',
			valueText: formatDesignations(caseData),
			condition: () => !isHASAppeal
		},
		{
			keyText: 'Tree Preservation Order',
			valueText: boolToYesNo(
				documentExists(documents, APPEAL_DOCUMENT_TYPE.TREE_PRESERVATION_PLAN)
			),
			condition: () => !isHASAppeal
		},
		{
			keyText: 'Uploaded Tree Preservation Order extent',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.TREE_PRESERVATION_PLAN),
			condition: () =>
				!isHASAppeal && documentExists(documents, APPEAL_DOCUMENT_TYPE.TREE_PRESERVATION_PLAN),
			isEscaped: true
		},
		{
			keyText: 'Gypsy or Traveller',
			valueText: formatYesOrNo(caseData, 'gypsyTraveller'),
			condition: () => isNotUndefinedOrNull(caseData.gypsyTraveller)
		},
		{
			keyText: 'Public right of way',
			valueText: formatYesOrNo(caseData, 'publicRightOfWay'),
			condition: () => isNotUndefinedOrNull(caseData.publicRightOfWay)
		},
		{
			keyText: 'Uploaded definitive map and statement extract',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.DEFINITIVE_MAP_STATEMENT),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.DEFINITIVE_MAP_STATEMENT),
			isEscaped: true
		}
	];

	return rows;
};
