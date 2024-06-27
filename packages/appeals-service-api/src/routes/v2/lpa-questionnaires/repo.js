const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('pins-data-model').Schemas.LPAQuestionnaireCommand} DataModelLPAQuestionnaireSubmission
 * @typedef {import('@prisma/client').LPAQuestionnaireSubmission} PrismaLPAQuestionnaireSubmission
 * @typedef {import('@prisma/client').SubmissionDocumentUpload} PrismaDocument
 * @typedef {import('@prisma/client').SubmissionAddress} PrismaAddress
 * @typedef {import('@prisma/client').SubmissionLinkedCase} PrismaLinkedCase
 * @typedef {import('@prisma/client').SubmissionListedBuilding} PrismaListedBuilding
 */

/**
 *
 * @param {DataModelLPAQuestionnaireSubmission["documents"]} documents
 * @param {string} type
 * @returns
 */
const hasDocument = (documents, type) =>
	documents.some(({ documentType }) => documentType === type);

/**
 * @param {DataModelLPAQuestionnaireSubmission} dataModelLPAQuestionnaireSubmission
 * @returns {[
 *   Omit<PrismaLPAQuestionnaireSubmission, 'id'>,
 *   Omit<PrismaDocument, 'id' | 'questionnaireId' | 'appellantSubmissionId' | 'name'>[],
 *   PrismaAddress[],
 *   PrismaLinkedCase[],
 *   PrismaListedBuilding[]
 * ]}
 */
const mapDataModelToFODB = ({ casedata, documents }) => [
	{
		appealCaseReference: casedata.caseReference,
		submitted: true,
		correctAppealType: casedata.isCorrectAppealType,
		affectsListedBuilding: !!casedata.affectedListedBuildingNumbers?.length,
		affectedListedBuildingNumber: casedata.affectedListedBuildingNumbers?.[0] ?? null, // I'm not happy about this, how is this used?
		addAffectedListedBuilding: false, // presumably?
		conservationArea: casedata.inConservationArea,
		uploadConservation: hasDocument(documents, 'conservationMap'),
		greenBelt: casedata.isGreenBelt,
		uploadWhoNotified: hasDocument(documents, 'whoNotified'),
		notificationMethod: casedata.notificationMethod?.join('\n') ?? null,
		otherPartyRepresentations: hasDocument(documents, 'whoNotified'),
		uploadRepresentations: hasDocument(documents, 'whoNotified'),
		uploadPlanningOfficerReport: hasDocument(documents, 'planningOfficerReport'),
		lpaSiteAccess: casedata.siteAccessDetails?.length ? 'yes' : 'no',
		lpaSiteAccess_lpaSiteAccessDetails: casedata.siteAccessDetails?.join('\n') ?? null,
		neighbourSiteAccess: casedata.neighbouringSiteAddresses?.length ? 'yes' : 'no',
		neighbourSiteAccess_neighbourSiteAccessDetails:
			casedata.neighbouringSiteAddresses?.reduce(
				(acc, cur) => acc + cur.neighbouringSiteAccessDetails + '\n',
				''
			) ?? null,
		addNeighbourSiteAccess: false,
		neighbourSiteAddress: !!casedata.neighbouringSiteAddresses?.length,
		lpaSiteSafetyRisks: casedata.siteSafetyDetails?.length ? 'yes' : 'no',
		lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails: casedata.siteSafetyDetails?.join('\n') ?? null,
		nearbyAppeals: !!casedata.nearbyCaseReferences?.length,
		addNearbyAppeal: false,
		newConditions: casedata.newConditionDetails?.length ? 'yes' : 'no',
		newConditions_newConditionDetails: casedata.newConditionDetails,
		// Not currently in data model
		changesListedBuilding: null,
		changedListedBuildingNumber: null,
		addChangedListedBuilding: null,
		displaySiteNotice: null,
		lettersToNeighbours: null,
		uploadLettersEmails: null,
		pressAdvert: null,
		uploadPressAdvert: null,
		consultationResponses: null,
		uploadConsultationResponses: null,
		uploadSiteNotice: null,
		lpaProcedurePreference: null,
		lpaPreferHearingDetails: null,
		lpaProcedurePreference_lpaPreferInquiryDuration: null,
		lpaPreferInquiryDetails: null,
		emergingPlan: null,
		uploadEmergingPlan: null,
		uploadDevelopmentPlanPolicies: null,
		uploadOtherPolicies: null,
		infrastructureLevy: null,
		uploadInfrastructureLevy: null,
		infrastructureLevyAdopted: null,
		infrastructureLevyAdoptedDate: null,
		infrastructureLevyExpectedDate: null,
		uploadLettersInterestedParties: null,
		treePreservationOrder: null,
		uploadTreePreservationOrder: null,
		uploadDefinitiveMapStatement: null,
		supplementaryPlanningDocs: null,
		uploadSupplementaryPlanningDocs: null,
		affectsScheduledMonument: null,
		gypsyTraveller: null,
		statutoryConsultees: null,
		statutoryConsultees_consultedBodiesDetails: null,
		protectedSpecies: null,
		publicRightOfWay: null,
		areaOutstandingBeauty: null,
		designatedSites: null,
		designatedSites_otherDesignations: null,
		screeningOpinion: null,
		environmentalStatement: null,
		environmentalImpactSchedule: null,
		uploadEnvironmentalStatement: null,
		columnTwoThreshold: null,
		sensitiveArea: null,
		sensitiveArea_sensitiveAreaDetails: null,
		uploadScreeningOpinion: null,
		uploadScreeningDirection: null,
		developmentDescription: null,
		requiresEnvironmentalStatement: null
	},
	documents.map((document) => ({
		fileName: document.filename,
		originalFileName: document.originalFilename,
		location: document.documentURI,
		type: document.documentType ?? '',
		storageId: document.documentId
	})),
	[],
	[],
	[]
];

module.exports = class Repo {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * @param {DataModelLPAQuestionnaireSubmission} data
	 * @returns {Promise<void>}
	 */
	async put(data) {
		return this.dbClient.$transaction(async (tx) => {
			const [submission] = mapDataModelToFODB(data);
			const existingSubmission = await tx.lPAQuestionnaireSubmission.findFirst({
				where: {
					appealCaseReference: submission.appealCaseReference
				}
			});
			if (existingSubmission) {
				await tx.lPAQuestionnaireSubmission.update({
					where: {
						id: existingSubmission.id
					},
					data: submission
				});
			}
		});
	}
};
