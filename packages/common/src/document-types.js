
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
		horizonGroupType: 'Evidence',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	decisionLetter: {
		name: 'decisionLetter',
		multiple: false,
		displayName: 'Decision notice',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	appealStatement: {
		name: 'appealStatement',
		multiple: false,
		displayName: 'Appeal Statement',
		horizonGroupType: 'Evidence',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	otherDocuments: {
		name: 'otherDocuments',
		multiple: true,
		displayName: 'Supporting Documents',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Other Evidence from Appellant/Agent'	
	},
	designAccessStatement: {
		name: 'designAccessStatement',
		multiple: false,
		displayName: 'Design and access statement',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	draftStatementOfCommonGround: {
		name: 'draftStatementOfCommonGround',
		multiple: false,
		displayName: 'Draft statement of common ground',
		horizonGroupType: 'Evidence',
		horizonDocumentType: 'Statement of Common Ground'
	},
	plansDrawingsSupportingDocuments: {
		name: 'plansDrawingsSupportingDocuments',
		multiple: true,
		displayName: 'Plans, drawings and supporting documents',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Plans Post LPA Decision'
	},
	appealPdf: {
		name: 'appealPdf',
		multiple: false,
		displayName: '',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	decisionPlans: {
		name: 'decisionPlans',
		multiple: true,
		displayName: 'Plans used to reach decision',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	officersReport: {
		name: 'officersReport',
		multiple: true,
		displayName: 'Planning Officers report',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	interestedParties: {
		name: 'interestedParties',
		multiple: true,
		displayName: 'Application publicity',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	representations: {
		name: 'representations',
		multiple: true,
		displayName: 'Representations',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	notifyingParties: {
		name: 'notifyingParties',
		multiple: true,
		displayName: 'Application notification',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	siteNotices: {
		name: 'siteNotices',
		multiple: true,
		displayName: '',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	conservationAreaMap: {
		name: 'conservationAreaMap',
		multiple: true,
		displayName: '',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	planningHistory: {
		name: 'planningHistory',
		multiple: true,
		displayName: 'Details of planning history',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	otherPolicies: {
		name: 'otherPolicies',
		multiple: true,
		displayName: 'Other relevant polices',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	statutoryDevelopment: {
		name: 'statutoryDevelopment',
		multiple: true,
		displayName: 'Statutory development plan policy',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	supplementaryDocuments: {
		name: 'supplementaryDocuments',
		multiple: true,
		displayName: 'Supplementary Planning Documents',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	questionnairePdf: {
		name: 'questionnairePdf',
		multiple: false,
		displayName: '',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	originalDecisionNotice: {
		name: 'originalDecisionNotice',
		multiple: false,
		displayName: 'Original Decision Notice',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'LPA Decision Notice'
	},
	ownershipCertificate: {
		name: 'ownershipCertificate',
		multiple: false,
		displayName: 'Ownership certificate and agricultural land declaration',
		horizonGroupType: 'Evidence',
		horizonDocumentType: 'Appellant Statement and Appendices'
	},
	planningObligations: {
		name: 'planningObligations',
		multiple: true,
		displayName: 'Planning obligation',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Planning Obligation'
	},
	letterConfirmingApplication: {
		name: 'letterConfirmingApplication',
		multiple: false,
		displayName: 'Letter Confirming Application',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Appellant Initial Documents'
	},
	draftPlanningObligations: {
		name: 'draftPlanningObligations',
		multiple: true,
		displayName: 'Draft planning obligation',
		horizonGroupType: 'Initial Documents',
		horizonDocumentType: 'Draft Planning Obligation'
	}
};

module.exports = documentTypes;
