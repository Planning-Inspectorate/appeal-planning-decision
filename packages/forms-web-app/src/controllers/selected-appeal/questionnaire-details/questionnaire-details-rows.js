const {
	formatYesOrNo,
	formatDesignations,
	formatSensitiveArea,
	formatDocumentDetails,
	formatEnvironmentalImpactSchedule,
	formatDevelopmentDescription,
	formatDate,
	formatSiteSafetyRisks,
	formatProcedurePreference,
	formatConditions
} = require('@pins/common');
const { formatNeibouringAddressWithBreaks } = require('@pins/common/src/lib/format-address');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
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
			keyText: 'Conservation area map and guidance',
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
			keyText: 'Tree Preservation Order plan',
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
			keyText: 'Definitive map and statement extract',
			valueText: formatDocumentDetails(documents, 'definitiveMap'),
			condition: (caseData) => caseData.uploadDefinitiveMapStatement
		}
	];
};

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
 */
exports.environmentalRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Schedule type',
			valueText: formatEnvironmentalImpactSchedule(caseData),
			condition: (caseData) => caseData.environmentalImpactSchedule
		},
		{
			keyText: 'Development description',
			valueText: formatDevelopmentDescription(caseData),
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
			valueText: formatDocumentDetails(documents, 'screeningOpinion'),
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
			valueText: formatDocumentDetails(documents, 'environmentalStatement'),
			condition: (caseData) => caseData.uploadEnvironmentalStatement
		},
		{
			keyText: 'Screening direction',
			valueText: formatDocumentDetails(documents, 'screeningDirection'),
			condition: (caseData) => caseData.uploadScreeningDirection
		}
	];
};

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
 */
exports.notifiedRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Who was notified',
			valueText: formatDocumentDetails(documents, 'whoNotified'),
			condition: (caseData) => caseData.uploadWhoNotified
		},
		// TODO data model will need adjusting for possible multiple answers
		// {
		// 	keyText: 'Type of Notification',
		// 	valueText: formatNotificationMethod(caseData),
		// 	condition: (caseData) => caseData.notificationMethod
		// },
		{
			keyText: 'Site notice',
			valueText: formatDocumentDetails(documents, 'siteNotice'),
			condition: (caseData) => caseData.uploadSiteNotice
		},
		{
			keyText: 'Letters to neighbours',
			valueText: formatDocumentDetails(documents, 'lettersNeighbours'),
			condition: (caseData) => caseData.uploadLettersEmails
		},
		{
			keyText: 'Press advert',
			valueText: formatDocumentDetails(documents, 'pressAdvert'),
			condition: (caseData) => caseData.uploadPressAdvert
		}
	];
};

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
 */
exports.consultationRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Statutory consultees',
			valueText: formatYesOrNo(caseData, 'statutoryConsultees'),
			condition: (caseData) => caseData.statutoryConsultees
		},
		{
			keyText: 'Responses or standing advice to upload',
			valueText: formatYesOrNo(caseData, 'consultationResponses'),
			condition: (caseData) => caseData.consultationResponses
		},
		{
			keyText: 'Consultation responses',
			valueText: formatDocumentDetails(documents, 'consultationResponses'),
			condition: (caseData) => caseData.uploadConsultationResponses
		},
		{
			keyText: 'Representations from other parties',
			valueText: formatYesOrNo(caseData, 'otherPartyRepresentations'),
			condition: (caseData) => caseData.otherPartyRepresentations
		},
		{
			keyText: 'Upload representations from other parties',
			valueText: formatDocumentDetails(documents, 'otherPartyRepresentations'),
			condition: (caseData) => caseData.uploadRepresentations
		}
	];
};

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
 */
exports.planningOfficerReportRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Planning officer’s report',
			valueText: formatDocumentDetails(documents, 'planningOfficerReport'),
			condition: (caseData) => caseData.uploadPlanningOfficerReport
		},
		{
			keyText: 'Upload policies from statutory development plan',
			valueText: formatDocumentDetails(documents, 'developmentPlanPolicies'),
			condition: (caseData) => caseData.uploadDevelopmentPlanPolicies
		},
		{
			keyText: 'Emerging plan',
			valueText: formatYesOrNo(caseData, 'emergingPlan'),
			condition: (caseData) => caseData.emergingPlan
		},
		{
			keyText: 'Uploaded emerging plan and supporting information',
			valueText: formatDocumentDetails(documents, 'emergingPlan'),
			condition: (caseData) => caseData.uploadEmergingPlan
		},
		{
			keyText: 'Uploaded other relevant policies',
			valueText: formatDocumentDetails(documents, 'otherRelevantPolicies'),
			condition: (caseData) => caseData.uploadOtherPolicies
		},
		{
			keyText: 'Supplementary planning documents',
			valueText: formatYesOrNo(caseData, 'supplementaryPlanningDocs'),
			condition: (caseData) => caseData.supplementaryPlanningDocs
		},
		{
			keyText: 'Uploaded supplementary planning documents',
			valueText: formatDocumentDetails(documents, 'supplementaryPlanningDocs'),
			condition: (caseData) => caseData.uploadSupplementaryPlanningDocs
		},
		{
			keyText: 'Community infrastructure levy',
			valueText: formatYesOrNo(caseData, 'infrastructureLevy'),
			condition: (caseData) => caseData.infrastructureLevy
		},
		{
			keyText: 'Uploaded community infrastructure levy',
			valueText: formatDocumentDetails(documents, 'infrastructureLevy'),
			condition: (caseData) => caseData.uploadInfrastructureLevy
		},
		{
			keyText: 'Community infrastructure levy formally adopted',
			valueText: formatYesOrNo(caseData, 'infrastructureLevyAdopted'),
			condition: (caseData) => caseData.infrastructureLevyAdopted
		},
		{
			keyText: 'Date community infrastructure levy adopted',
			valueText: formatDate(caseData.infrastructureLevyAdoptedDate),
			condition: (caseData) => caseData.infrastructureLevyAdoptedDate
		},
		{
			keyText: 'Date community infrastructure levy expected to be adopted',
			valueText: formatDate(caseData.infrastructureLevyExpectedDate),
			condition: (caseData) => caseData.infrastructureLevyExpectedDate
		}
	];
};

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
 */
exports.siteAccessRows = (caseData) => {
	const neighbourAdresses = caseData.NeighbouringAddresses || [];
	/**
	 * @type {Rows}
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

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
 */
exports.appealProcessRows = (caseData) => {
	return [
		{
			keyText: 'Appeal procedure',
			valueText: formatProcedurePreference(caseData),
			condition: (caseData) => caseData.lpaProcedurePreference
		},
		{
			keyText: 'Appeals near the site',
			valueText: formatYesOrNo(caseData, 'nearbyAppeals'),
			condition: (caseData) => caseData.nearbyAppeals
		},
		{
			keyText: 'Appeal references',
			valueText: '', // TODO data model will need adjusting for possible multiple appeals
			condition: (caseData) => caseData.nearbyAppealReference
		},
		{
			keyText: 'Extra conditions',
			valueText: formatConditions(caseData),
			condition: (caseData) => caseData.newConditions
		}
	];
};
