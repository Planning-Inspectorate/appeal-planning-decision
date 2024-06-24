// TODO: Make an abstract "Document" class and implement concrete classes accordingly. See https://stackoverflow.com/questions/597769/how-do-i-create-an-abstract-base-class-in-javascript
// TODO: Make these accessible via a GET on the documents-service-api endpoint since this means any updates can be retrieved immediately by all teams.
/**
 * Each document type below has a Horizon group type and document type so that, when the document lands in Horizon,
 * it is shuffled into the correct directory in the case worker's UI. Most documents have the defaults of
 * 'Other Evidence from Appellant/Agent' and 'Initial Documents' for the 'Horizon Document Type' and 'Horizon group type' respectively.
 */

const lpaOwner = 'lpa-user';
const appellantOwner = 'appellant';

const documentTypes = {
	originalApplication: {
		name: 'originalApplication',
		multiple: false,
		displayName: 'Planning application form',
		involvement: 'LPA',
		owner: appellantOwner,
		horizonDocumentType: 'Application Form',
		horizonDocumentGroupType: 'Evidence'
	},
	decisionLetter: {
		name: 'decisionLetter',
		multiple: false,
		displayName: 'Decision notice',
		involvement: 'Appellant',
		owner: appellantOwner,
		horizonDocumentType: 'LPA Decision Notice',
		horizonDocumentGroupType: 'Initial Documents'
	},
	appealStatement: {
		name: 'appealStatement',
		multiple: false,
		displayName: 'Appeal Statement',
		involvement: 'LPA',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	otherDocuments: {
		name: 'otherDocuments',
		multiple: true,
		displayName: 'Supporting Documents',
		involvement: 'Appellant',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	designAccessStatement: {
		name: 'designAccessStatement',
		multiple: false,
		displayName: 'Design and access statement',
		involvement: 'Appellant',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	draftStatementOfCommonGround: {
		name: 'draftStatementOfCommonGround',
		multiple: false,
		displayName: 'Draft statement of common ground',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Statement of Common Ground',
		horizonDocumentGroupType: 'Important Information'
	},
	plansDrawingsSupportingDocuments: {
		name: 'plansDrawingsSupportingDocuments',
		multiple: true,
		displayName: 'Plans, drawings and supporting documents',
		involvement: 'Appellant',
		owner: appellantOwner,
		horizonDocumentType: 'Application Plans',
		horizonDocumentGroupType: 'Initial Documents'
	},
	appealPdf: {
		name: 'appealPdf',
		multiple: false,
		displayName: '',
		involvement: 'Appellant',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	decisionPlans: {
		name: 'decisionPlans',
		multiple: true,
		displayName: 'Plans used to reach decision',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Plans Post LPA Decision',
		horizonDocumentGroupType: 'Initial Documents'
	},
	officersReport: {
		name: 'officersReport',
		multiple: true,
		displayName: 'Planning Officers report',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	interestedParties: {
		name: 'interestedParties',
		multiple: true,
		displayName: 'Application publicity',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	representations: {
		name: 'representations',
		multiple: true,
		displayName: 'Representations',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	notifyingParties: {
		name: 'notifyingParties',
		multiple: true,
		displayName: 'Application notification',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	siteNotices: {
		name: 'siteNotices',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	planningHistory: {
		name: 'planningHistory',
		multiple: true,
		displayName: 'Details of planning history',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	otherPolicies: {
		name: 'otherPolicies',
		multiple: true,
		displayName: 'Other relevant polices',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	statutoryDevelopment: {
		name: 'statutoryDevelopment',
		multiple: true,
		displayName: 'Statutory development plan policy',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	supplementaryDocuments: {
		name: 'supplementaryDocuments',
		multiple: true,
		displayName: 'Supplementary Planning Documents',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	questionnairePdf: {
		name: 'questionnairePdf',
		multiple: false,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	originalDecisionNotice: {
		name: 'originalDecisionNotice',
		multiple: false,
		displayName: 'Original Decision Notice',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'LPA Decision Notice',
		horizonDocumentGroupType: 'Initial Documents'
	},
	ownershipCertificate: {
		name: 'ownershipCertificate',
		multiple: false,
		displayName: 'Ownership certificate and agricultural land declaration',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Statement and Appendices',
		horizonDocumentGroupType: 'Evidence'
	},
	planningObligations: {
		name: 'planningObligations',
		multiple: true,
		displayName: 'Planning obligation',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Planning Obligation',
		horizonDocumentGroupType: 'Initial Documents'
	},
	letterConfirmingApplication: {
		name: 'letterConfirmingApplication',
		multiple: false,
		displayName: 'Letter Confirming Application',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	draftPlanningObligations: {
		name: 'draftPlanningObligations',
		multiple: true,
		displayName: 'Draft planning obligation',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Planning Obligation',
		horizonDocumentGroupType: 'Initial Documents'
	},
	uploadDocuments: {
		name: 'uploadDocuments',
		multiple: true,
		displayName: 'Upload documents',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Final Comments',
		horizonDocumentGroupType: 'Evidence'
	},
	finalComment: {
		name: 'finalComment',
		multiple: false,
		displayName: 'final Comment',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: 'Appellant Final Comments',
		horizonDocumentGroupType: 'Evidence'
	},
	conservationMap: {
		name: 'conservationMap',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: "Local Authority's Questionnaire",
		horizonDocumentGroupType: 'Evidence'
	},
	whoWasNotified: {
		name: 'whoWasNotified',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: "Local Authority's Questionnaire",
		horizonDocumentGroupType: 'Evidence'
	},
	uploadLettersToNeighbours: {
		name: 'uploadLettersToNeighbours',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'LPA Questionnaire Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	pressAdvertUpload: {
		name: 'pressAdvertUpload',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'LPA Questionnaire Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	consultationResponsesUpload: {
		name: 'consultationResponsesUpload',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'Consultation Responses',
		horizonDocumentGroupType: 'Evidence'
	},
	uploadSiteNotice: {
		name: 'uploadSiteNotice',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'LPA Questionnaire Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	representationUpload: {
		name: 'representationUpload',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'Consultation Responses',
		horizonDocumentGroupType: 'Evidence'
	},
	planningOfficersReportUpload: {
		name: 'planningOfficersReportUpload',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'LPA Questionnaire Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	emergingPlanUpload: {
		name: 'emergingPlanUpload',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'Emerging Plans',
		horizonDocumentGroupType: 'Evidence'
	},
	uploadDevelopmentPlanPolicies: {
		name: 'uploadDevelopmentPlanPolicies',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'LPA Questionnaire Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	uploadOtherRelevantPolicies: {
		name: 'uploadOtherRelevantPolicies',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'LPA Questionnaire Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	communityInfrastructureLevyUpload: {
		name: 'communityInfrastructureLevyUpload',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadNeighbourLetterAddresses: {
		name: 'uploadNeighbourLetterAddresses',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'Appeal Notification Letter',
		horizonDocumentGroupType: 'Evidence'
	},
	treePreservationPlanUpload: {
		name: 'treePreservationPlanUpload',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'LPA Questionnaire Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	uploadDefinitiveMap: {
		name: 'uploadDefinitiveMap',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'LPA Questionnaire Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	supplementaryPlanningUpload: {
		name: 'supplementaryPlanningUpload',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'Supplementary Guidance',
		horizonDocumentGroupType: 'Evidence'
	},
	uploadEnvironmentalStatement: {
		name: 'uploadEnvironmentalStatement',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'LPA Questionnaire Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	screeningOpinionUpload: {
		name: 'screeningOpinionUpload',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: 'LPA Questionnaire Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	uploadScreeningDirection: {
		name: 'uploadScreeningDirection',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: lpaOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadOriginalApplicationForm: {
		name: 'uploadOriginalApplicationForm',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadApplicationDecisionLetter: {
		name: 'uploadApplicationDecisionLetter',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadChangeOfDescriptionEvidence: {
		name: 'uploadChangeOfDescriptionEvidence',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadAppellantStatement: {
		name: 'uploadAppellantStatement',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadCostApplication: {
		name: 'uploadCostApplication',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadPlanningObligation: {
		name: 'uploadPlanningObligation',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadDesignAccessStatement: {
		name: 'uploadDesignAccessStatement',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadPlansDrawings: {
		name: 'uploadPlansDrawings',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadNewPlansDrawings: {
		name: 'uploadNewPlansDrawings',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadOtherNewDocuments: {
		name: 'uploadOtherNewDocuments',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadStatementCommonGround: {
		name: 'uploadStatementCommonGround',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	},
	uploadOwnershipCertificate: {
		name: 'uploadOwnershipCertificate',
		multiple: true,
		displayName: '',
		involvement: '',
		owner: appellantOwner,
		horizonDocumentType: '', // Does not exist in horizon
		horizonDocumentGroupType: '' // Does not exist in horizon
	}
};

module.exports = documentTypes;
