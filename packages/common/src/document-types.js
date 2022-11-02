// TODO: Make an abstract "Document" class and implement concrete classes accordingly. See https://stackoverflow.com/questions/597769/how-do-i-create-an-abstract-base-class-in-javascript
// TODO: Make these accessible via a GET on the documents-service-api endpoint since this means any updates can be retrieved immediately by all teams.
/**
 * Each document type below has a Horizon group type and document type so that, when the document lands in Horizon,
 * it is shuffled into the correct directory in the case worker's UI. Most documents have the defaults of
 * 'Other Evidence from Appelant/Agent' and 'Initial Documents' for the 'Horizon Document Type' and 'Horizon group type' respectively.
 */
const documentTypes = {
	originalApplication: {
		name: 'originalApplication',
		multiple: false,
		displayName: 'Planning application form',
		horizonDocumentType: 'Application Form',
		horizonDocumentGroupType: 'Evidence'
	},
	decisionLetter: {
		name: 'decisionLetter',
		multiple: false,
		displayName: 'Decision notice',
		horizonDocumentType: 'LPA Decision Notice',
		horizonDocumentGroupType: 'Initial Documents'
	},
	appealStatement: {
		name: 'appealStatement',
		multiple: false,
		displayName: 'Appeal Statement',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Evidence'
	},
	otherDocuments: {
		name: 'otherDocuments',
		multiple: true,
		displayName: 'Supporting Documents',
		horizonDocumentType: 'Other Evidence from Appellant/Agent',
		horizonDocumentGroupType: 'Initial Documents'
	},
	designAccessStatement: {
		name: 'designAccessStatement',
		multiple: false,
		displayName: 'Design and access statement',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	draftStatementOfCommonGround: {
		name: 'draftStatementOfCommonGround',
		multiple: false,
		displayName: 'Draft statement of common ground',
		horizonDocumentType: 'Statement of Common Ground',
		horizonDocumentGroupType: 'Important Information'
	},
	plansDrawingsSupportingDocuments: {
		name: 'plansDrawingsSupportingDocuments',
		multiple: true,
		displayName: 'Plans, drawings and supporting documents',
		horizonDocumentType: 'Application Plans',
		horizonDocumentGroupType: 'Initial Documents'
	},
	appealPdf: {
		name: 'appealPdf',
		multiple: false,
		displayName: '',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	decisionPlans: {
		name: 'decisionPlans',
		multiple: true,
		displayName: 'Plans used to reach decision',
		horizonDocumentType: 'Plans Post LPA Decision',
		horizonDocumentGroupType: 'Initial Documents'
	},
	officersReport: {
		name: 'officersReport',
		multiple: true,
		displayName: 'Planning Officers report',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	interestedParties: {
		name: 'interestedParties',
		multiple: true,
		displayName: 'Application publicity',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	representations: {
		name: 'representations',
		multiple: true,
		displayName: 'Representations',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	notifyingParties: {
		name: 'notifyingParties',
		multiple: true,
		displayName: 'Application notification',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	siteNotices: {
		name: 'siteNotices',
		multiple: true,
		displayName: '',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	conservationAreaMap: {
		name: 'conservationAreaMap',
		multiple: true,
		displayName: '',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	planningHistory: {
		name: 'planningHistory',
		multiple: true,
		displayName: 'Details of planning history',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	otherPolicies: {
		name: 'otherPolicies',
		multiple: true,
		displayName: 'Other relevant polices',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	statutoryDevelopment: {
		name: 'statutoryDevelopment',
		multiple: true,
		displayName: 'Statutory development plan policy',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	supplementaryDocuments: {
		name: 'supplementaryDocuments',
		multiple: true,
		displayName: 'Supplementary Planning Documents',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	questionnairePdf: {
		name: 'questionnairePdf',
		multiple: false,
		displayName: '',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	originalDecisionNotice: {
		name: 'originalDecisionNotice',
		multiple: false,
		displayName: 'Original Decision Notice',
		horizonDocumentType: 'LPA Decision Notice',
		horizonDocumentGroupType: 'Initial Documents'
	},
	ownershipCertificate: {
		name: 'ownershipCertificate',
		multiple: false,
		displayName: 'Ownership certificate and agricultural land declaration',
		horizonDocumentType: 'Appellant Statement and Appendices',
		horizonDocumentGroupType: 'Evidence'
	},
	planningObligations: {
		name: 'planningObligations',
		multiple: true,
		displayName: 'Planning obligation',
		horizonDocumentType: 'Planning Obligation',
		horizonDocumentGroupType: 'Initial Documents'
	},
	letterConfirmingApplication: {
		name: 'letterConfirmingApplication',
		multiple: false,
		displayName: 'Letter Confirming Application',
		horizonDocumentType: 'Appellant Initial Documents',
		horizonDocumentGroupType: 'Initial Documents'
	},
	draftPlanningObligations: {
		name: 'draftPlanningObligations',
		multiple: true,
		displayName: 'Draft planning obligation',
		horizonDocumentType: 'Planning Obligation',
		horizonDocumentGroupType: 'Initial Documents'
	}
};

module.exports = documentTypes;
