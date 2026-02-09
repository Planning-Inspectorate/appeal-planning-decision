// TODO: Make an abstract "Document" class and implement concrete classes accordingly. See https://stackoverflow.com/questions/597769/how-do-i-create-an-abstract-base-class-in-javascript
// TODO: Make these accessible via a GET on the documents-service-api endpoint since this means any updates can be retrieved immediately by all teams.
/**
 * Each document type below has a Horizon group type and document type so that, when the document lands in Horizon,
 * it is shuffled into the correct directory in the case worker's UI. Most documents have the defaults of
 * 'Other Evidence from Appellant/Agent' and 'Initial Documents' for the 'Horizon Document Type' and 'Horizon group type' respectively.
 */

const lpaOwner = 'LPAUser';
const appellantOwner = 'Appellant';
const pinsOwner = 'PINs';
const rule6Owner = 'Rule6Party';
const interestedParty = 'InterestedParty';
const { CASE_TYPES } = require('./database/data-static');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');

/**
 * @typedef {Object} DocType
 * @property {string} name internal name for the doc type
 * @property {string} [dataModelName] the value used in the \@planning-inspectorate/data-model
 * @property {function(string): 'LPAUser'|'Appellant'|'PINs'|'Rule6Party'|'InterestedParty'} owner who owns/uploads this document type
 * @property {boolean} publiclyAccessible if, when published, this document can be accessed without a user needing to log in
 */

/**
 * @type {Object<string, DocType>}
 */
const documentTypes = {
	planningObligations: {
		name: 'planningObligations',
		dataModelName: APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	conservationMap: {
		name: 'conservationMap',
		dataModelName: APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	whoWasNotified: {
		name: 'whoWasNotified',
		dataModelName: APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	pressAdvertUpload: {
		name: 'pressAdvertUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_PRESS_ADVERT,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	consultationResponsesUpload: {
		name: 'consultationResponsesUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.CONSULTATION_RESPONSES,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadSiteNotice: {
		name: 'uploadSiteNotice',
		dataModelName: APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_SITE_NOTICE,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	representationUpload: {
		name: 'representationUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.OTHER_PARTY_REPRESENTATIONS,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	planningOfficersReportUpload: {
		name: 'planningOfficersReportUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.PLANNING_OFFICER_REPORT,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	emergingPlanUpload: {
		name: 'emergingPlanUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.EMERGING_PLAN,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadDevelopmentPlanPolicies: {
		name: 'uploadDevelopmentPlanPolicies',
		dataModelName: APPEAL_DOCUMENT_TYPE.DEVELOPMENT_PLAN_POLICIES,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadOtherRelevantPolicies: {
		name: 'uploadOtherRelevantPolicies',
		dataModelName: APPEAL_DOCUMENT_TYPE.OTHER_RELEVANT_POLICIES,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	communityInfrastructureLevyUpload: {
		name: 'communityInfrastructureLevyUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.COMMUNITY_INFRASTRUCTURE_LEVY,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadNeighbourLetterAddresses: {
		name: 'uploadNeighbourLetterAddresses',
		dataModelName: APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_LETTER_TO_NEIGHBOURS,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	treePreservationPlanUpload: {
		name: 'treePreservationPlanUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.TREE_PRESERVATION_PLAN,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadDefinitiveMap: {
		name: 'uploadDefinitiveMap',
		dataModelName: APPEAL_DOCUMENT_TYPE.DEFINITIVE_MAP_STATEMENT,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	supplementaryPlanningUpload: {
		name: 'supplementaryPlanningUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.SUPPLEMENTARY_PLANNING,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadEnvironmentalStatement: {
		name: 'uploadEnvironmentalStatement',
		dataModelName: APPEAL_DOCUMENT_TYPE.EIA_ENVIRONMENTAL_STATEMENT,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	screeningOpinionUpload: {
		name: 'screeningOpinionUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.EIA_SCREENING_OPINION,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	scopingOpinionUpload: {
		name: 'scopingOpinionUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.EIA_SCOPING_OPINION,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadScreeningDirection: {
		name: 'uploadScreeningDirection',
		dataModelName: APPEAL_DOCUMENT_TYPE.EIA_SCREENING_DIRECTION,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadOriginalApplicationForm: {
		name: 'uploadOriginalApplicationForm',
		dataModelName: APPEAL_DOCUMENT_TYPE.ORIGINAL_APPLICATION_FORM,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadApplicationDecisionLetter: {
		name: 'uploadApplicationDecisionLetter',
		dataModelName: APPEAL_DOCUMENT_TYPE.APPLICATION_DECISION_LETTER,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadChangeOfDescriptionEvidence: {
		name: 'uploadChangeOfDescriptionEvidence',
		dataModelName: APPEAL_DOCUMENT_TYPE.CHANGED_DESCRIPTION,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadAppellantStatement: {
		name: 'uploadAppellantStatement',
		dataModelName: APPEAL_DOCUMENT_TYPE.APPELLANT_STATEMENT,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadCostApplication: {
		name: 'uploadCostApplication',
		dataModelName: APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadPlanningObligation: {
		name: 'uploadPlanningObligation',
		dataModelName: APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadDesignAccessStatement: {
		name: 'uploadDesignAccessStatement',
		dataModelName: APPEAL_DOCUMENT_TYPE.DESIGN_ACCESS_STATEMENT,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadPlansDrawings: {
		name: 'uploadPlansDrawings',
		dataModelName: APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS,
		owner: (appealTypeCode) => {
			if (appealTypeCode === CASE_TYPES.HAS.processCode) return lpaOwner;
			return appellantOwner;
		},
		publiclyAccessible: false
	},
	uploadNewPlansDrawings: {
		name: 'uploadNewPlansDrawings',
		dataModelName: APPEAL_DOCUMENT_TYPE.NEW_PLANS_DRAWINGS,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadOtherNewDocuments: {
		name: 'uploadOtherNewDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.OTHER_NEW_DOCUMENTS,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadStatementCommonGround: {
		name: 'uploadStatementCommonGround',
		dataModelName: APPEAL_DOCUMENT_TYPE.STATEMENT_COMMON_GROUND,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadOwnershipCertificate: {
		name: 'uploadOwnershipCertificate',
		dataModelName: APPEAL_DOCUMENT_TYPE.OWNERSHIP_CERTIFICATE,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadLpaStatementDocuments: {
		name: 'uploadLpaStatementDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.LPA_STATEMENT,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadAppellantStatementDocuments: {
		name: 'uploadAppellantStatementDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.APPELLANT_STATEMENT,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadRule6StatementDocuments: {
		name: 'uploadRule6StatementDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.RULE_6_STATEMENT,
		owner: (_appealTypeCode) => rule6Owner,
		publiclyAccessible: false
	},
	uploadAppellantFinalCommentDocuments: {
		name: 'uploadAppellantFinalCommentDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.APPELLANT_FINAL_COMMENT,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadLPAFinalCommentDocuments: {
		name: 'uploadLPAFinalCommentDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.LPA_FINAL_COMMENT,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadGroundAFeeReceipt: {
		name: 'uploadGroundAFeeReceipt',
		dataModelName: APPEAL_DOCUMENT_TYPE.GROUND_A_FEE_RECEIPT,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadPriorCorrespondence: {
		name: 'uploadPriorCorrespondence',
		dataModelName: APPEAL_DOCUMENT_TYPE.PRIOR_CORRESPONDENCE_WITH_PINS,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadEnforcementNotice: {
		name: 'uploadEnforcementNotice',
		dataModelName: APPEAL_DOCUMENT_TYPE.ENFORCEMENT_NOTICE,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadEnforcementNoticePlan: {
		name: 'uploadEnforcementNoticePlan',
		dataModelName: APPEAL_DOCUMENT_TYPE.ENFORCEMENT_NOTICE_PLAN,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	groundASupportingDocuments: {
		name: 'groundASupportingDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.GROUND_A_SUPPORTING,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	groundBSupportingDocuments: {
		name: 'groundBSupportingDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.GROUND_B_SUPPORTING,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	groundCSupportingDocuments: {
		name: 'groundCSupportingDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.GROUND_C_SUPPORTING,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	groundDSupportingDocuments: {
		name: 'groundDSupportingDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.GROUND_D_SUPPORTING,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	groundESupportingDocuments: {
		name: 'groundESupportingDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.GROUND_E_SUPPORTING,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	groundFSupportingDocuments: {
		name: 'groundFSupportingDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.GROUND_F_SUPPORTING,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	groundGSupportingDocuments: {
		name: 'groundGSupportingDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.GROUND_G_SUPPORTING,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	groundHSupportingDocuments: {
		name: 'groundHSupportingDocuments',
		dataModelName: 'groundHSupporting', // to be updated once data model confirmed
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	groundISupportingDocuments: {
		name: 'groundISupportingDocuments',
		dataModelName: 'groundISupporting', // to be updated once data model confirmed
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	groundJSupportingDocuments: {
		name: 'groundJSupportingDocuments',
		dataModelName: 'groundJSupporting', // to be updated once data model confirmed
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	groundKSupportingDocuments: {
		name: 'groundKSupportingDocuments',
		dataModelName: 'groundKSupporting', // to be updated once data model confirmed
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	caseDecisionLetter: {
		name: 'caseDecisionLetter',
		dataModelName: APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER,
		owner: (_appealTypeCode) => pinsOwner,
		publiclyAccessible: true
	},
	uploadAppellantProofOfEvidenceDocuments: {
		name: 'uploadAppellantProofOfEvidenceDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.APPELLANT_PROOF_OF_EVIDENCE,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadAppellantWitnessesEvidence: {
		name: 'uploadAppellantWitnessesEvidence',
		dataModelName: APPEAL_DOCUMENT_TYPE.APPELLANT_WITNESSES_EVIDENCE,
		owner: (_appealTypeCode) => appellantOwner,
		publiclyAccessible: false
	},
	uploadLpaProofOfEvidenceDocuments: {
		name: 'uploadLpaProofOfEvidenceDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.LPA_PROOF_OF_EVIDENCE,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadRule6ProofOfEvidenceDocuments: {
		name: 'uploadRule6ProofOfEvidenceDocuments',
		dataModelName: APPEAL_DOCUMENT_TYPE.RULE_6_PROOF_OF_EVIDENCE,
		owner: (_appealTypeCode) => rule6Owner,
		publiclyAccessible: false
	},
	uploadLpaWitnessesEvidence: {
		name: 'uploadLpaWitnessesEvidence',
		dataModelName: APPEAL_DOCUMENT_TYPE.LPA_WITNESSES_EVIDENCE,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadRule6WitnessesEvidence: {
		name: 'uploadRule6WitnessesEvidence',
		dataModelName: APPEAL_DOCUMENT_TYPE.RULE_6_WITNESSES_EVIDENCE,
		owner: (_appealTypeCode) => rule6Owner,
		publiclyAccessible: false
	},
	lpaQuestionnaireSubmission: {
		name: 'lpaQuestionnaireSubmission',
		dataModelName: 'lpaQuestionnaireSubmission', // To be amended as needed once data model confirmed
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	appealNotification: {
		name: 'appealNotification',
		dataModelName: APPEAL_DOCUMENT_TYPE.APPEAL_NOTIFICATION,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	uploadHistoricEnglandConsultation: {
		name: 'uploadHistoricEnglandConsultation',
		dataModelName: APPEAL_DOCUMENT_TYPE.HISTORIC_ENGLAND_CONSULTATION,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	interestedPartyComment: {
		name: 'interestedPartyComment',
		dataModelName: APPEAL_DOCUMENT_TYPE.INTERESTED_PARTY_COMMENT,
		owner: (_appealTypeCode) => interestedParty,
		publiclyAccessible: false
	},
	appellantCostsDecisionLetter: {
		name: 'appellantCostsDecisionLetter',
		dataModelName: APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_DECISION_LETTER,
		owner: (_appealTypeCode) => pinsOwner,
		publiclyAccessible: false
	},
	lpaCostsDecisionLetter: {
		name: 'lpaCostsDecisionLetter',
		dataModelName: APPEAL_DOCUMENT_TYPE.LPA_COSTS_DECISION_LETTER,
		owner: (_appealTypeCode) => pinsOwner,
		publiclyAccessible: false
	},
	appellantCaseCorrespondence: {
		name: 'appellantCaseCorrespondence',
		dataModelName: APPEAL_DOCUMENT_TYPE.APPELLANT_CASE_CORRESPONDENCE,
		owner: (_appealTypeCode) => pinsOwner,
		publiclyAccessible: false
	},
	lpaCaseCorrespondence: {
		name: 'lpaCaseCorrespondence',
		dataModelName: APPEAL_DOCUMENT_TYPE.LPA_CASE_CORRESPONDENCE,
		owner: (_appealTypeCode) => pinsOwner,
		publiclyAccessible: false
	},
	enforcementStopNoticeUpload: {
		name: 'enforcementStopNoticeUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.STOP_NOTICE,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	enforcementDevelopmentRightsUpload: {
		name: 'enforcementDevelopmentRightsUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.ARTICLE_4_DIRECTION,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	listOfPeopleSentEnforcementNotice: {
		name: 'listOfPeopleSentEnforcementNotice',
		dataModelName: APPEAL_DOCUMENT_TYPE.ENFORCEMENT_LIST,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	localDevelopmentOrderUpload: {
		name: 'localDevelopmentOrderUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.LOCAL_DEVELOPMENT_ORDER,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	previousPlanningPermissionUpload: {
		name: 'previousPlanningPermissionUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.PLANNING_PERMISSION,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	enforcementNoticeDateApplicationUpload: {
		name: 'enforcementNoticeDateApplicationUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.LPA_ENFORCEMENT_NOTICE,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	enforcementNoticePlanUpload: {
		name: 'enforcementNoticePlanUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.LPA_ENFORCEMENT_NOTICE_PLAN,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	planningContraventionNoticeUpload: {
		name: 'planningContraventionNoticeUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.PLANNING_CONTRAVENTION_NOTICE,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	relatedApplicationsUpload: {
		name: 'relatedApplicationsUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.RELATED_APPLICATIONS,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	},
	otherRelevantMattersUpload: {
		name: 'otherRelevantMattersUpload',
		dataModelName: APPEAL_DOCUMENT_TYPE.OTHER_RELEVANT_MATTERS,
		owner: (_appealTypeCode) => lpaOwner,
		publiclyAccessible: false
	}
};

/**
 * @param {any} value value to lookup
 * @param {keyof DocType} lookupProp property to check
 * @returns {DocType|null} result based on the returnProp
 */
const getDocType = (value, lookupProp) => {
	for (const docType in documentTypes) {
		if (documentTypes[docType][lookupProp] === value) {
			return documentTypes[docType];
		}
	}

	return null;
};

module.exports = {
	documentTypes,
	getDocType
};
