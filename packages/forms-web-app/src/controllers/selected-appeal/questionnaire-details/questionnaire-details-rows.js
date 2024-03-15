const { formatYesOrNo, formatDesignations, formatSensitiveArea } = require('@pins/common');

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
			keyText: 'Affects a listed building',
			valueText: formatYesOrNo(caseData, 'affectsListedBuilding'),
			condition: (caseData) => caseData.affectsListedBuilding
		},
		{
			keyText: 'Listed Buildings',
			valueText: '', //TODO ? needs another entity with 1:many relation
			condition: (caseData) =>
				caseData.affectedListedBuildingNumber || caseData.changedListedBuildingNumber
					? true
					: undefined
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
			keyText: 'Conservation area map and guidance',
			valueText: '', //TODO add document
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
			keyText: 'Tree Preservation Order plan',
			valueText: '', //TODO add document
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
			keyText: 'Definitive map and statement extract',
			valueText: '', //TODO add document
			condition: (caseData) => caseData.uploadDefinitiveMapStatement
		}
	];
};

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
 */
exports.environmentalRows = (caseData) => {
	return [
		{
			keyText: 'Schedule type',
			valueText: `${caseData.environmentalImpactSchedule}`,
			condition: (caseData) => caseData.environmentalImpactSchedule
		},
		{
			keyText: 'Development description',
			valueText: `${caseData.developmentDescription}`,
			condition: (caseData) => caseData.developmentDescription
		},
		{
			keyText: 'Sensitive area',
			valueText: formatSensitiveArea(caseData),
			condition: (caseData) => caseData.sensitiveArea
		},
		{
			keyText: 'Meets column 2 threshold',
			valueText: formatYesOrNo(caseData, 'columnTwoThreshold'),
			condition: (caseData) => caseData.columnTwoThreshold
		},
		{
			keyText: 'Issued screening opinion',
			valueText: formatYesOrNo(caseData, 'screeningOpinion'),
			condition: (caseData) => caseData.screeningOpinion
		},
		{
			keyText: 'Screening opinion correspondence',
			valueText: '', //TODO add document
			condition: (caseData) => caseData.uploadScreeningOpinion
		},
		{
			keyText: 'Requires environmental statement',
			valueText: formatYesOrNo(caseData, 'requiresEnvironmentalStatement'),
			condition: (caseData) => caseData.requiresEnvironmentalStatement
		},
		{
			keyText: 'Completed environmental statement',
			valueText: formatYesOrNo(caseData, 'completedEnvironmentalStatement'),
			condition: (caseData) => caseData.completedEnvironmentalStatement
		},
		{
			keyText: 'Environmental statement and supporting information',
			valueText: '', // TODO add document
			condition: (caseData) => caseData.uploadEnvironmentalStatement
		},
		{
			keyText: 'Screening direction',
			valueText: '', // TODO add document
			condition: (caseData) => caseData.uploadScreeningDirection
		}
	];
};
