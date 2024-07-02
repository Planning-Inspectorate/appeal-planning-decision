export interface MigrateResult {
	/** records checked */
	total?: number;
	/** already migrated */
	alreadyProcessed?: number;
	/** skipped due to missing data on appeal */
	skipped?: number;
	/** successfully migrated */
	migrated?: number;
	/** array appeal id with error message */
	errors?: string[];
}

export type AppealUsers = AppealUser[];

export interface AppealUserUpdate {
	/** @example "false" */
	isEnrolled?: boolean;
	lpaStatus?: 'added' | 'confirmed' | 'removed';
}

/** An appeal case from the Back Office, with appellant service user */
export type AppealCaseWithAppellant = AppealCase & {
	/** A Service User */
	appellant?: ServiceUser;
};

/** An appeal case with rule 6 parties */
export type AppealCaseWithRule6Parties = AppealCase & {
	Rule6Parties?: Rule6Party[];
};

/** An appeal case from the Back Office */
export interface AppealCase {
	/**
	 * front office appeal case ID
	 * @format uuid
	 */
	id?: string;
	/**
	 * appeal case reference (aka appeal number)
	 * @example "6123456"
	 */
	caseReference: string;
	/**
	 * a code to identify the LPA this case relates to
	 * @example "Q9999"
	 */
	LPACode: string;
	/**
	 * the name of the LPA this case relates to
	 * @example "System Test Borough Council"
	 */
	LPAName: string;
	/**
	 * appeal type short-code such as HAS or S78
	 * @example "HAS"
	 */
	appealTypeCode: string;
	/** @example "Householder" */
	appealTypeName?: string;
	/** original planning application decision by the LPA */
	decision: 'granted' | 'refused';
	/**
	 * the date the original planning application was decided by the LPA
	 * @format date-time
	 */
	originalCaseDecisionDate: string;
	costsAppliedForIndicator: boolean;
	/** the LPA's reference for the original planning application */
	LPAApplicationReference: string;
	appellantCasePublished?: string;
	appellantProofEvidenceSubmitted?: boolean;
	appellantProofEvidencePublished?: boolean;
	appellantFinalCommentsSubmitted?: boolean;
	appellantFinalCommentDetails?: string;
	appellantFirstName?: string;
	appellantLastName?: string;
	siteAddressLine1: string;
	siteAddressLine2?: string;
	siteAddressTown?: string;
	siteAddressCounty?: string;
	siteAddressPostcode: string;
	/**
	 * the date LPA's questionnaire is due
	 * @format date-time
	 */
	questionnaireDueDate?: string;
	/**
	 * the date LPA's questionnaire was received
	 * @format date-time
	 */
	questionnaireReceived?: string;
	/**
	 * the date LPA's questionnaire was submitted
	 * @format date-time
	 */
	lpaQuestionnaireSubmittedDate?: string;
	/**
	 * the date LPA's questionnaire was published
	 * @format date-time
	 */
	lpaQuestionnairePublishedDate?: string;
	lpaQuestionnairePublished?: boolean;
	lpaQuestionnaireSubmitted?: boolean;
	doesAffectAScheduledMonument?: boolean;
	lpaStatementPublished?: boolean;
	lpaProofEvidenceSubmitted?: boolean;
	lpaProofEvidencePublished?: boolean;
	lpaFinalCommentsPublished?: boolean;
	/** Is this the correct type of appeal */
	correctAppealType?: boolean;
	/** Does the development change a listed building */
	changesListedBuilding?: boolean;
	/** the list entry number */
	changedListedBuildingNumber?: number;
	/** Add another building or site */
	addChangedListedBuilding?: boolean;
	/** Does the proposed development affect the setting of listed buildings */
	affectsListedBuilding?: boolean;
	/** the list entry number */
	affectedListedBuildingNumber?: number;
	/** Add another building or site */
	addAffectedListedBuilding?: boolean;
	/** Would the development affect a scheduled monument */
	scheduledMonument?: boolean;
	/** Is the site in, or next to a conservation area */
	conservationArea?: boolean;
	/** Upload conservation map and guidance */
	uploadConservation?: boolean;
	/** Would the development affect a protected species */
	protectedSpecies?: boolean;
	/** Is the site in a green belt */
	greenBelt?: boolean;
	/** Is the appeal site in an area of outstanding natural beauty */
	areaOutstandingBeauty?: boolean;
	/** Is the development in, near or likely to affect any designated sites */
	designatedSites?: string;
	otherDesignationDetails?: string;
	/** Does a Tree Preservation Order (TPO) apply to any part of the appeal site */
	treePreservationOrder?: boolean;
	/** Upload a plan showing the extent of the order */
	uploadTreePreservationOrder?: boolean;
	/** Does the development relate to anyone claiming to be a Gypsy or Traveller */
	gypsyTraveller?: boolean;
	/** Would a public right of way need to be removed or diverted */
	publicRightOfWay?: boolean;
	/** Upload the definitive map and statement extract */
	uploadDefinitiveMapStatement?: boolean;
	/** Is the development a schedule 1 or schedule 2 development */
	environmentalImpactSchedule?: string;
	/** Description of development */
	developmentDescription?: string;
	/** Is the development in, partly in, or likely to affect a sensitive area */
	sensitiveArea?: boolean;
	/** Tell us about the sensitive area */
	sensitiveAreaDetails?: string;
	/** Does the development meet or exceed the threshold or criteria in column 2 */
	columnTwoThreshold?: boolean;
	/** Have you issued a screening opinion */
	screeningOpinion?: boolean;
	/** Upload your screening opinion and any correspondence */
	uploadScreeningOpinion?: boolean;
	/** Did your screening opinion say the development needed an environmental statement */
	requiresEnvironmentalStatement?: boolean;
	/** Upload the screening direction */
	uploadScreeningDirection?: boolean;
	/** Upload the environmental statement and supporting information */
	uploadEnvironmentalStatement?: boolean;
	/** Did the applicant submit an environmental statement */
	completedEnvironmentalStatement?: boolean;
	/** Who did you notify about this application */
	uploadWhoNotified?: boolean;
	/** How did you notify relevant parties about the planning application */
	notificationMethod?: string;
	/** Upload the site notice */
	uploadSiteNotice?: boolean;
	/** Upload the letters and emails */
	uploadLettersEmails?: boolean;
	/** Upload the press advertisement */
	uploadPressAdvert?: boolean;
	/** Did you consult all the relevant statutory consultees about the development */
	statutoryConsultees?: boolean;
	/** Which bodies did you consult */
	consultedBodiesDetails?: string;
	/** Do you have any consultation responses or standing advice from statutory consultees to upload */
	consultationResponses?: boolean;
	/** Upload the consultation responses and standing advice */
	uploadConsultationResponses?: boolean;
	/** Did you receive representations from members of the public or other parties */
	otherPartyRepresentations?: boolean;
	/** Upload the representations */
	uploadRepresentations?: boolean;
	/** Upload the planning officers report */
	uploadPlanningOfficerReport?: boolean;
	/** Upload relevant policies from your statutory development plan */
	uploadDevelopmentPlanPolicies?: boolean;
	/** Do you have an emerging plan that is relevant to this appeal */
	emergingPlan?: boolean;
	/** Upload the emerging plan and supporting information */
	uploadEmergingPlan?: boolean;
	/** Upload any other relevant policies */
	uploadOtherPolicies?: boolean;
	/** Did any supplementary planning documents inform the outcome of the application */
	supplementaryPlanningDocs?: boolean;
	/** Upload the relevant supplementary planning documents */
	uploadSupplementaryPlanningDocs?: boolean;
	/** Do you have a community infrastructure levy */
	infrastructureLevy?: boolean;
	/** Upload your community infrastructure levy */
	uploadInfrastructureLevy?: boolean;
	/** Is the community infrastructure levy formally adopted */
	infrastructureLevyAdopted?: boolean;
	/**
	 * When was the community infrastructure levy formally adopted
	 * @format date-time
	 */
	infrastructureLevyAdoptedDate?: string;
	/**
	 * When do you expect to formally adopt the community infrastructure levy
	 * @format date-time
	 */
	infrastructureLevyExpectedDate?: string;
	/** Might the inspector need access to the appellants land or property */
	lpaSiteAccess?: boolean;
	/** the reason */
	lpaSiteAccessDetails?: string;
	/** Might the inspector need to enter a neighbours land or property */
	neighbouringSiteAccess?: boolean;
	/** the reason */
	neighbouringSiteAccessDetails?: string;
	/** Do you want to add another neighbour to be visited */
	addNeighbouringSiteAccess?: boolean;
	/** Are there any potential safety risks */
	lpaSiteSafetyRisks?: boolean;
	/** Add details of the potential risk and what the inspector might need */
	lpaSiteSafetyRiskDetails?: string;
	/** Which procedure do you think is most appropriate for this appeal */
	lpaProcedurePreference?: string;
	/** Why would you prefer a hearing */
	lpaPreferHearingDetails?: string;
	/** How many days would you expect the inquiry to last */
	lpaPreferInquiryDuration?: string;
	/** Why would you prefer an inquiry */
	lpaPreferInquiryDetails?: string;
	/** Are there any other ongoing appeals next to, or close to the site */
	nearbyAppeals?: boolean;
	/** Enter an appeal reference number */
	nearbyAppealReference?: string;
	/** Add another appeal */
	addNearbyAppeal?: boolean;
	/** Are there any new conditions */
	newConditions?: boolean;
	/** Tell us about the new conditions */
	newConditionDetails?: string;
	/** Enter your statement */
	lpaStatement?: string;
	/** Do you have additional documents to support your appeal statement */
	lpaStatementDocuments?: boolean;
	/** Upload your new supporting documents */
	uploadLpaStatementDocuments?: boolean;
	/** Do you want to submit a final comment */
	lpaFinalComment?: boolean;
	/** What are your final comments */
	lpaFinalCommentDetails?: string;
	/** Upload your proof of evidence and summary */
	uploadLpaProofEvidence?: boolean;
	/** Do you need to add any witnesses */
	lpaWitnesses?: boolean;
	/** Upload your witnesses and their evidence */
	uploadLpaWitnessEvidence?: boolean;
	/** Upload witness timings */
	uploadLpaWitnessTimings?: boolean;
	/** Upload rebuttals */
	uploadLpaRebuttal?: boolean;
	rule6StatementPublished?: boolean;
	rule6ProofsEvidencePublished?: boolean;
	interestedPartyCommentsPublished?: boolean;
	/** whether the appeal was received */
	caseReceived?: boolean;
	/**
	 * the date the appeal was received
	 * @format date-time
	 */
	receiptDate?: string;
	/** whether the appeal is published */
	casePublished?: boolean;
	/**
	 * the date the appeal was published
	 * @format date-time
	 */
	casePublishedDate?: string;
	/**
	 * the date the appeal was started
	 * @format date-time
	 */
	startDate?: string;
	/**
	 * the date the appeal was marked valid
	 * @format date-time
	 */
	appealValidDate?: string;
	/**
	 * the date the appeal was decided
	 * @format date-time
	 */
	caseDecisionDate?: string;
	/**
	 * the date interested party comments are accepted until
	 * @format date-time
	 */
	interestedPartyRepsDueDate?: string;
	/** @format date-time */
	caseValidDate?: string;
	/**
	 * the date the appeal was withdrawn
	 * @format date-time
	 */
	appealWithdrawnDate?: string;
	/**
	 * the date statements are due
	 * @format date-time
	 */
	statementDueDate?: string;
	/**
	 * the date the appellant's statement was forwarded
	 * @format date-time
	 */
	appellantStatementForwarded?: string;
	/**
	 * the date the appellant's statement was received
	 * @format date-time
	 */
	appellantStatementSubmitted?: string;
	/**
	 * the date the LPA's statement was forwarded
	 * @format date-time
	 */
	LPAStatementForwarded?: string;
	/**
	 * the date the LPA's statement was received
	 * @format date-time
	 */
	LPAStatementSubmitted?: string;
	/**
	 * the date comments are due
	 * @format date-time
	 */
	finalCommentsDueDate?: string;
	/**
	 * the date the appellant's comments were forwarded
	 * @format date-time
	 */
	appellantCommentsForwarded?: string;
	/**
	 * the date the appellant's comments were received
	 * @format date-time
	 */
	appellantCommentsSubmitted?: string;
	/**
	 * the date the LPA's comments were forwarded
	 * @format date-time
	 */
	LPACommentsForwarded?: string;
	/**
	 * the date the LPA's comments were received
	 * @format date-time
	 */
	LPACommentsSubmitted?: string;
	/**
	 * the date proofs of evidence are due
	 * @format date-time
	 */
	proofsOfEvidenceDueDate?: string;
	/**
	 * the date the appellant's proofs of evidence were forwarded
	 * @format date-time
	 */
	appellantsProofsForwarded?: string;
	/**
	 * the date the appellant's proofs of evidence were received
	 * @format date-time
	 */
	appellantsProofsSubmitted?: string;
	/**
	 * the date the LPA's proofs of evidence were forwarded
	 * @format date-time
	 */
	LPAProofsForwarded?: string;
	/**
	 * the date the LPA's proofs of evidence were received
	 * @format date-time
	 */
	LPAProofsSubmitted?: string;
	procedure?: string;
	/** the Inspector's outcome/decision for this case */
	outcome?: 'allowed' | 'dismissed' | 'split decision' | 'invalid';
	/** the Inspector's outcome/decision for this case */
	caseDecisionOutcome?: 'allowed' | 'dismissed' | 'split decision' | 'invalid';
	caseDecisionPublished?: boolean;
	/** the current status of the appeal */
	appealStatus?:
		| 'assign_case_officer'
		| 'validation'
		| 'ready_to_start'
		| 'lpa_questionnaire_due'
		| 'statement_review'
		| 'final_comment_review'
		| 'issue_determination'
		| 'complete'
		| 'invalid'
		| 'withdrawn'
		| 'closed'
		| 'awaiting_transfer'
		| 'transferred';
	isAppellant?: boolean;
	appellantCompanyName?: string;
	contactFirstName?: string;
	contactLastName?: string;
	contactCompanyName?: string;
	appellantPhoneNumber?: string;
	/** @format date-time */
	onApplicationDate?: string;
	ownsAllLand?: boolean;
	ownsSomeLand?: boolean;
	knowsOtherOwners?: boolean;
	identifiedOwners?: boolean;
	advertisedAppeal?: boolean;
	informedOwners?: boolean;
	appellantGreenBelt?: boolean;
	siteAreaSquareMetres?: number;
	agriculturalHolding?: boolean;
	tenantAgriculturalHolding?: boolean;
	otherTenantsAgriculturalHolding?: boolean;
	informedTenantsAgriculturalHolding?: boolean;
	appellantSiteAccess?: boolean;
	appellantSiteAccessDetails?: string;
	appellantSiteSafety?: boolean;
	appellantSiteSafetyDetails?: string;
	appellantProcedurePreference?: string;
	appellantPreferHearingDetails?: string;
	appellantPreferInquiryDetails?: string;
	appellantLinkedCase?: boolean;
	updateDevelopmentDescription?: boolean;
	developmentDescriptionDetails?: string;
	statusPlanningObligation?: string;
	Documents?: object[];
	NeighbouringAddresses?: object[];
	SubmissionLinkedCase?: object[];
}

/** An appeal submission created in the Front Office */
export interface AppealSubmission {
	_id?: string;
	uuid: string;
	/** @format date-time */
	createdAt: string;
	/** @format date-time */
	updatedAt?: string;
	appeal?: {
		id?: string;
		state?: 'DRAFT' | 'SUBMITTED';
		lpaCode?: string;
		/** @format date-time */
		decisionDate?: string;
		appealType?:
			| '1000'
			| '1001'
			| '1002'
			| '1003'
			| '1004'
			| '1005'
			| '1006'
			| '1007'
			| '1008'
			| '1009'
			| '1010'
			| '1011';
		typeOfPlanningAppeal?: string;
		appealSiteSection?: {
			siteAddress?: {
				postcode?: string;
				county?: string;
				town?: string;
				addressLine1?: string;
				addressLine2?: string;
			};
		};
	};
}

/** An mapping of an appeal to a user */
export interface AppealToUser {
	/**
	 * user email
	 * @format email
	 * @example "me@example.com"
	 */
	email: string;
	/**
	 * Unique identifier of appeal (SQL)
	 * @format uuid
	 */
	appealId: string;
	/** Role user has on the appeal */
	role: 'appellant' | 'agent' | 'interestedParty';
}

/** An appeal user */
export interface AppealUser {
	/**
	 * appeal user ID
	 * @format uuid
	 */
	id: string;
	/**
	 * the user's email address
	 * @format email
	 */
	email: string;
	/** is this user enrolled? (have they been sent a registration confirmation email) */
	isEnrolled?: boolean;
	/** service user ID to map to service users */
	serviceUserId?: number;
	/** is this an LPA user? */
	isLpaUser?: boolean;
	/** if an LPA user, the LPA this user belongs to */
	lpaCode?: string;
	/** if an LPA user, whether this user is an admin for that LPA */
	isLpaAdmin?: boolean;
	/** if an LPA user, the status of this user, e.g. have they logged in and confirmed their email? */
	lpaStatus?: 'added' | 'confirmed' | 'removed';
}

/** An appellant submission */
export interface AppellantSubmission {
	/** @format uuid */
	id?: string;
	LPACode?: string;
	appealTypeCode?: 'HAS' | 'S78';
	/** @format date-time */
	applicationDecisionDate?: string;
	applicationDecision?: string;
	appealId?: string;
	caseTermsAccepted?: boolean;
	/** whether the appeal has been submitted to BO */
	submitted?: boolean;
	/** blob storage id of submission pdf used to generate download link */
	submissionPdfId?: string;
	/** @format date-time */
	onApplicationDate?: string;
	isAppellant?: boolean;
	appellantFirstName?: string;
	appellantLastName?: string;
	appellantCompanyName?: string;
	contactFirstName?: string;
	contactLastName?: string;
	contactCompanyName?: string;
	ownsAllLand?: boolean;
	ownsSomeLand?: boolean;
	knowsAllOwners?: string;
	knowsOtherOwners?: string;
	informedOwners?: boolean;
	advertisedAppeal?: boolean;
	appellantGreenBelt?: boolean;
	updateDevelopmentDescription?: boolean;
	identifiedOwners?: boolean;
	costApplication?: boolean;
	appellantProcedurePreference?: string;
	agriculturalHolding?: boolean;
	informedTenantsAgriculturalHolding?: boolean;
	otherTenantsAgriculturalHolding?: boolean;
	ownershipCertificate?: boolean;
	newPlansDrawings?: boolean;
	otherNewDocuments?: boolean;
	designAccessStatement?: boolean;
	planningObligation?: boolean;
	appellantSiteSafety?: string;
	appellantSiteSafety_appellantSiteSafetyDetails?: string | null;
	appellantSiteAccess?: string;
	appellantSiteAccess_appellantSiteAccessDetails?: string | null;
	statusPlanningObligation?: string;
	applicationReference?: string;
	developmentDescriptionOriginal?: string;
	appellantLinkedCaseReference?: string;
	appellantPhoneNumber?: string;
	appellantPreferHearingDetails?: string;
	appellantPreferInquiryDetails?: string;
	siteAreaSquareMetres?: number;
	siteAreaUnits?: string;
	appellantPreferInquiryDuration?: number;
	appellantPreferInquiryWitnesses?: number;
	siteArea?: number;
	tenantAgriculturalHolding?: boolean;
	appellantLinkedCaseAdd?: boolean;
	appellantLinkedCase?: boolean;
	SubmissionLinkedCase?: object[];
	uploadOriginalApplicationForm?: boolean;
	uploadApplicationDecisionLetter?: boolean;
	uploadAppellantStatement?: boolean;
	uploadCostApplication?: boolean;
	uploadChangeOfDescriptionEvidence?: boolean;
	uploadOwnershipCertificate?: boolean;
	uploadStatementCommonGround?: boolean;
	uploadDesignAccessStatement?: boolean;
	uploadPlansDrawings?: boolean;
	uploadNewPlansDrawings?: boolean;
	uploadOtherNewDocuments?: boolean;
	uploadPlanningObligation?: boolean;
	SubmissionDocumentUpload?: object[];
	siteAddress?: boolean;
	SubmissionAddress?: object[];
	SubmissionListedBuilding?: object[];
}

/** A document associated with an appeal */
export interface DataModelDocument {
	/** The unique identifier for the document */
	documentId: string;
	/** Internal case identifier */
	caseId: number;
	/** External case identifier */
	caseReference: string;
	/** A document can have multiple versions and this indicates the latest version */
	version: number;
	/** Current stored name of the document */
	filename: string;
	/** Original name of document */
	originalFilename: string;
	/** The file size in bytes */
	size: number;
	/** The mime type for the current version of the file */
	mime: string;
	/** The internal location of the document */
	documentURI: string;
	/** The location of the published document will be null if the datePublished is not set */
	publishedDocumentURI: string;
	/** Indicates the virus check status for the current document */
	virusCheckStatus: 'not_scanned' | 'scanned' | 'affected';
	/** A MD5 hash to check the validity of the file */
	fileMD5: string;
	/**
	 * The creation date for the document
	 * @format date-time
	 */
	dateCreated: string;
	/**
	 * The date the document was received
	 * @format date-time
	 */
	dateReceived: string;
	/**
	 * The date the document was published
	 * @format date-time
	 */
	datePublished: string;
	/**
	 * The last update date for the document
	 * @format date-time
	 */
	lastModified: string;
	/** The internal code for an appeal type e.g. Householder (D) */
	caseType: 'C' | 'D' | 'F' | 'G' | 'H' | 'L' | 'Q' | 'S' | 'V' | 'W' | 'X' | 'Y' | 'Z';
	/** Indicates the redaction status for the document */
	redactedStatus: 'not_redacted' | 'redacted' | 'no_redaction_required';
	/** The type of document used for exchange migrations and consumption from the appeal back-office system */
	documentType:
		| 'appellantCaseCorrespondence'
		| 'appellantCaseWithdrawalLetter'
		| 'appellantCostsApplication'
		| 'appellantCostsCorrespondence'
		| 'appellantCostsWithdrawal'
		| 'appellantStatement'
		| 'applicationDecisionLetter'
		| 'changedDescription'
		| 'originalApplicationForm'
		| 'whoNotified'
		| 'conservationMap'
		| 'lpaCaseCorrespondence'
		| 'lpaCostsApplication'
		| 'lpaCostsCorrespondence'
		| 'lpaCostsWithdrawal'
		| 'otherPartyRepresentations'
		| 'planningOfficerReport'
		| 'costsDecisionLetter'
		| 'caseDecisionLetter'
		| 'crossTeamCorrespondence'
		| 'inspectorCorrespondence';
	/** The system mastering the metadata for the current document */
	sourceSystem: 'back-office-appeals' | 'horizon' | 'acp' | 'sharepoint';
	/** Indicates where the documents originates from */
	origin: 'pins' | 'citizen' | 'lpa' | 'ogd';
	/** Owner of the current document */
	owner: string;
	/** Name of person who authored document */
	author: string;
	/** A custom description for the document */
	description: string;
	/** The stage in the appeal process that has created the document */
	caseStage:
		| 'appellant-case'
		| 'lpa-questionnaire'
		| 'statements'
		| 'third-party-comments'
		| 'final-comments'
		| 'appeal-decision'
		| 'costs';
	/** The folder ID containing the document in Horizon */
	horizonFolderId: string;
}

/** A document associated with an appeal */
export interface Document {
	/** document ID */
	id: string;
	filename: string;
	originalFilename: string;
	size: number;
	documentURI: string;
	/** @format date-time */
	dateCreated: string;
	/** @format date-time */
	dateReceived?: string;
	/** @format date-time */
	lastModified?: string;
	virusCheckStatus?: string;
	published?: boolean;
	redacted?: boolean;
	documentType: string;
	sourceSystem: string;
	origin: string;
	stage: string;
	caseReference: string;
}

export interface ErrorBody {
	code?: string;
	errors?: string[];
}

/** An appeal case event */
export interface Event {
	/** type of event */
	type: 'siteVisit' | 'hearing' | 'inquiry' | 'inHouse' | 'preInquiry';
	/** additional event type detail */
	subtype: 'accompanied' | 'unaccompanied' | 'accessRequired' | 'virtual';
	/**
	 * the date the event starts
	 * @format date-time
	 */
	startDate: string;
	/**
	 * the date the event ends
	 * @format date-time
	 */
	endDate: string;
}

/** A questionnaire submitted by an LPA */
export interface LPAQuestionnaireSubmission {
	/** @format uuid */
	id: string;
	AppealCase: {
		LPACode: string;
	};
	/** whether the questionnaire has been submitted to BO */
	submitted?: boolean;
	appealCaseReference: string;
	correctAppealType?: boolean;
	affectsListedBuilding?: boolean;
	affectedListedBuildingNumber?: string;
	addAffectedListedBuilding?: boolean;
	changesListedBuilding?: boolean;
	changedListedBuildingNumber?: string;
	addChangedListedBuilding?: boolean;
	conservationArea?: boolean;
	uploadConservation?: boolean;
	greenBelt?: boolean;
	uploadWhoNotified?: boolean;
	displaySiteNotice?: boolean;
	lettersToNeighbours?: boolean;
	uploadLettersEmails?: boolean;
	pressAdvert?: boolean;
	uploadPressAdvert?: boolean;
	consultationResponses?: boolean;
	uploadConsultationResponses?: boolean;
	notificationMethod?: string;
	uploadSiteNotice?: boolean;
	otherPartyRepresentations?: boolean;
	uploadRepresentations?: boolean;
	uploadPlanningOfficerReport?: boolean;
	lpaSiteAccess?: boolean;
	lpaSiteAccessDetails?: string;
	neighbourSiteAccess?: boolean;
	neighbourSiteAccessDetails?: string;
	addNeighbourSiteAccess?: boolean;
	neighbourSiteAddress?: boolean;
	lpaSiteSafetyRisks?: boolean;
	lpaSiteSafetyRiskDetails?: string;
	lpaProcedurePreference?: string;
	lpaPreferHearingDetails?: string;
	lpaPreferInquiryDuration?: string;
	lpaPreferInquiryDetails?: string;
	nearbyAppeals?: boolean;
	nearbyAppealReference?: string;
	addNearbyAppeal?: boolean;
	newConditions?: boolean;
	newConditionDetails?: string;
	emergingPlan?: boolean;
	uploadEmergingPlan?: boolean;
	uploadDevelopmentPlanPolicies?: boolean;
	uploadOtherPolicies?: boolean;
	infrastructureLevy?: boolean;
	uploadInfrastructureLevy?: boolean;
	infrastructureLevyAdopted?: boolean;
	/** @format date-time */
	infrastructureLevyAdoptedDate?: string;
	/** @format date-time */
	infrastructureLevyExpectedDate?: string;
	uploadLettersInterestedParties?: boolean;
	treePreservationOrder?: boolean;
	uploadTreePreservationOrder?: boolean;
	uploadDefinitiveMapStatement?: boolean;
	supplementaryPlanningDocs?: boolean;
	uploadSupplementaryPlanningDocs?: boolean;
	affectsScheduledMonument?: boolean;
	gypsyTraveller?: boolean;
	statutoryConsultees?: boolean;
	consultedBodiesDetails?: string;
	protectedSpecies?: boolean;
	publicRightOfWay?: boolean;
	areaOutstandingBeauty?: boolean;
	designatedSites?: string;
	otherDesignations?: string;
	screeningOpinion?: boolean;
	environmentalStatement?: boolean;
	environmentalImpactSchedule?: string;
	uploadEnvironmentalStatement?: boolean;
	columnTwoThreshold?: boolean;
	sensitiveArea?: boolean;
	sensitiveAreaDetails?: string;
	uploadScreeningOpinion?: boolean;
	uploadScreeningDirection?: boolean;
	developmentDescription?: string;
	requiresEnvironmentalStatement?: boolean;
}

/** The neighbouring address related to an appeal */
export interface NeighbouringAddress {
	/**
	 * identifier for the neighbouring address of an associated appeal
	 * @format uuid
	 */
	id: string;
	/** appeal reference the address is associated to */
	caseReference: string;
	/** first line of the address */
	addressLine1: string;
	/** first line of the address */
	addressLine2?: string;
	/** the town or city of the address */
	townCity: string;
	/** the postcode of the adress */
	postcode: string;
}

/** Information about a rule 6 party involved in an appeal */
export interface Rule6Party {
	/**
	 * identifier for rule 6 party
	 * @format uuid
	 */
	id: string;
	/** appeal reference the rule 6 party is associated to */
	caseReference: string;
	/** first name of the main contact for rule 6 party */
	firstName: string;
	/** last name of the main contact for rule 6 party */
	lastName: string;
	/** whether the rule 6 party is over 18 */
	over18: boolean;
	/** the name of the rule 6 party */
	partyName: string;
	/**
	 * email address of the rule 6 party
	 * @format email
	 */
	partyEmail: string;
	/** first line of address of the rule 6 party */
	addressLine1: string;
	/** second line of address of the rule 6 party */
	addressLine2?: string;
	/** town of the rule 6 party's address */
	addressTown?: string;
	/** county of the rule 6 party */
	addressCounty?: string;
	/** postcode of the rule 6 party */
	addressPostcode: string;
	/** the status of the rule 6 party's involvement */
	partyStatus?: string;
	/** indicates if the rule 6 party evidence has been submitted */
	proofEvidenceSubmitted?: boolean;
	/**
	 * the date and time the evidence was submitted
	 * @format date-time
	 */
	proofEvidenceSubmittedDate?: string;
	/** indicates if the rule 6 party evidence has been received */
	proofEvidenceReceived?: boolean;
	/**
	 * the date and time the evidence was received
	 * @format date-time
	 */
	proofEvidenceReceivedDate?: string;
	/** the validation outcome of the rule 6 party evidence */
	proofEvidenceValidationOutcome?: string;
	/**
	 * the date and time the validation outcome was given
	 * @format date-time
	 */
	proofEvidenceValidationOutcomeDate?: string;
	/** details about the validation of the rule 6 party evidence */
	proofEvidenceValidationDetails?: string;
	/** the statement from the rule 6 party */
	statement?: string;
	/** indicates if the rule 6 party has submitted documents */
	statementDocuments?: boolean;
	/** indicates if the rule 6 party has submitted witness information */
	witnesses?: boolean;
	/** indicates if the rule 6 party statement has been submitted */
	statementSubmitted?: boolean;
	/**
	 * the date and time the statement was submitted
	 * @format date-time
	 */
	statementSubmittedDate?: string;
	/** indicates if the rule 6 party statement has been received */
	statementReceived?: boolean;
	/**
	 * the date and time the statement was received
	 * @format date-time
	 */
	statementReceivedDate?: string;
	/** the validation outcome of the rule 6 party statement */
	statementValidationOutcome?: string;
	/**
	 * the date and time the validation outcome was given
	 * @format date-time
	 */
	statementValidationOutcomeDate?: string;
	/** details about the validation of the rule 6 party statement */
	statementValidationDetails?: string;
}

/** A Service User */
export interface ServiceUser {
	/** A unique identifier for the entity. */
	id: string;
	/** A formal greeting, e.g., Mr, Mrs, Ms. */
	salutation?: string;
	/** The first name of the individual. */
	firstName?: string;
	/** The last name of the individual. */
	lastName?: string;
	/** The first line of the address. */
	addressLine1?: string;
	/** The second line of the address, usually includes suite or apartment number. */
	addressLine2?: string;
	/** The town or city of the address. */
	addressTown?: string;
	/** The county in which the town or city is located. */
	addressCounty?: string;
	/** The postal code for the address. */
	postcode?: string;
	/** The country of the address. */
	addressCountry?: string;
	/** The name of the organisation associated with the individual. */
	organisation?: string;
	/** The type or nature of the organisation. */
	organisationType?: string;
	/** The individual's role or position within the organisation. */
	role?: string;
	/** The primary telephone contact number. */
	telephoneNumber?: string;
	/** An alternate or secondary phone number. */
	otherPhoneNumber?: string;
	/** A fax contact number. */
	faxNumber?: string;
	/** The primary email address for contact. */
	emailAddress?: string;
	/** Website address or URL. */
	webAddress?: string;
	/** Type or category of the service user.ationContact, Subscriber] */
	serviceUserType: string;
	/** Reference number for a particular case or incident. */
	caseReference: string;
	/** The originating system from where the data was sourced. */
	sourceSystem?: string;
	/** Unique identifier from the source system. */
	sourceSuid?: string;
}

/** The address related to a submission */
export interface SubmissionAddress {
	/**
	 * identifier for the submission address of an associated appeal
	 * @format uuid
	 */
	id: string;
	/**
	 * lpa questionnaire id this address is associated with, can be null
	 * @format uuid
	 */
	questionnaireId?: string;
	/**
	 * appeal submission id this address is associated with, can be null
	 * @format uuid
	 */
	appellantSubmissionId?: string;
	/** which question this address is associated with for the submission */
	fieldName: string;
	/** first line of the address */
	addressLine1: string;
	/** first line of the address */
	addressLine2?: string;
	/** the town or city of the address */
	townCity: string;
	/** the county address */
	county?: string;
	/** the postcode of the address */
	postcode: string;
}

/** A case linked to a submitted appeal or questionnaire */
export interface SubmissionLinkedCase {
	/**
	 * identifier for the submission linked case
	 * @format uuid
	 */
	id: string;
	/**
	 * lpa questionnaire id this linked appeal is associated with, can be null
	 * @format uuid
	 */
	lpaQuestionnaireSubmissionId?: string;
	/**
	 * appeal submission id this linked appeal is associated with, can be null
	 * @format uuid
	 */
	appellantSubmissionId?: string;
	/** which question this linked case is associated with for the submission */
	fieldName: string;
	/** case reference for linked appeal */
	caseReference: string;
	/**
	 * the appeal case id that the linked appeal is associated with once submission or questionnaire accepted by back office
	 * @format uuid
	 */
	appealCaseId?: string;
}
