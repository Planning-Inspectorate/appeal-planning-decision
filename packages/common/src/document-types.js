// TODO: Make an abstract "Document" class and implement concrete classes accordingly. See https://stackoverflow.com/questions/597769/how-do-i-create-an-abstract-base-class-in-javascript
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
		horizonDocumentGroupType: 'Evidence',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	decisionLetter: {
		name: 'decisionLetter',
		multiple: false,
		displayName: 'Decision notice',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	appealStatement: {
		name: 'appealStatement',
		multiple: false,
		displayName: 'Appeal Statement',
		horizonDocumentGroupType: 'Evidence',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	otherDocuments: {
		name: 'otherDocuments',
		multiple: true,
		displayName: 'Supporting Documents',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Other Evidence from Appellant/Agent'
	},
	designAccessStatement: {
		name: 'designAccessStatement',
		multiple: false,
		displayName: 'Design and access statement',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	draftStatementOfCommonGround: {
		name: 'draftStatementOfCommonGround',
		multiple: false,
		displayName: 'Draft statement of common ground',
		horizonDocumentGroupType: 'Evidence',
		horizonDocumentType: 'Statement of Common Ground'
	},
	plansDrawingsSupportingDocuments: {
		name: 'plansDrawingsSupportingDocuments',
		multiple: true,
		displayName: 'Plans, drawings and supporting documents',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Plans Post LPA Decision'
	},
	appealPdf: {
		name: 'appealPdf',
		multiple: false,
		displayName: '',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	decisionPlans: {
		name: 'decisionPlans',
		multiple: true,
		displayName: 'Plans used to reach decision',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	officersReport: {
		name: 'officersReport',
		multiple: true,
		displayName: 'Planning Officers report',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	interestedParties: {
		name: 'interestedParties',
		multiple: true,
		displayName: 'Application publicity',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	representations: {
		name: 'representations',
		multiple: true,
		displayName: 'Representations',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	notifyingParties: {
		name: 'notifyingParties',
		multiple: true,
		displayName: 'Application notification',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	siteNotices: {
		name: 'siteNotices',
		multiple: true,
		displayName: '',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	conservationAreaMap: {
		name: 'conservationAreaMap',
		multiple: true,
		displayName: '',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	planningHistory: {
		name: 'planningHistory',
		multiple: true,
		displayName: 'Details of planning history',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	otherPolicies: {
		name: 'otherPolicies',
		multiple: true,
		displayName: 'Other relevant polices',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	statutoryDevelopment: {
		name: 'statutoryDevelopment',
		multiple: true,
		displayName: 'Statutory development plan policy',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	supplementaryDocuments: {
		name: 'supplementaryDocuments',
		multiple: true,
		displayName: 'Supplementary Planning Documents',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	questionnairePdf: {
		name: 'questionnairePdf',
		multiple: false,
		displayName: '',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	originalDecisionNotice: {
		name: 'originalDecisionNotice',
		multiple: false,
		displayName: 'Original Decision Notice',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'LPA Decision Notice'
	},
	ownershipCertificate: {
		name: 'ownershipCertificate',
		multiple: false,
		displayName: 'Ownership certificate and agricultural land declaration',
		horizonDocumentGroupType: 'Evidence',
		horizonDocumentType: 'Appellant Statement and Appendices'
	},
	planningObligations: {
		name: 'planningObligations',
		multiple: true,
		displayName: 'Planning obligation',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Planning Obligation'
	},
	letterConfirmingApplication: {
		name: 'letterConfirmingApplication',
		multiple: false,
		displayName: 'Letter Confirming Application',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	draftPlanningObligations: {
		name: 'draftPlanningObligations',
		multiple: true,
		displayName: 'Draft planning obligation',
		horizonDocumentGroupType: 'Initial Documents',
		horizonDocumentType: 'Planning Obligation'
	}
};

module.exports = documentTypes;
