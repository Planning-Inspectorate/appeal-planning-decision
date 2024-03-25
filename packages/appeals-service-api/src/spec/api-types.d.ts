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
	apellantCasePublished?: string;
	appellantProofEvidenceSubmitted?: boolean;
	appellantProofEvidencePublished?: boolean;
	appellantFinalCommentsSubmitted?: boolean;
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
	yourFirstName?: string;
	yourLastName?: string;
	yourCompanyName?: string;
	ownsAllLand?: boolean;
	ownsSomeLand?: boolean;
	knowsOtherOwners?: boolean;
	identifiedOwners?: boolean;
	advertisedAppeal?: boolean;
	informedOwners?: boolean;
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
	updateDevelopmentDescription?: boolean;
	developmentDescriptionDetails?: string;
	statusPlanningObligation?: string;
	Documents?: object[];
	NeighbouringAddresses?: object[];
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

/** A questionnaire submitted by an LPA */
export interface LPAQuestionnaireSubmission {
	/** @format uuid */
	id: string;
	AppealCase: {
		LPACode: string;
	};
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
	/**
	 * front office appeal case ID
	 * @format uuid
	 */
	id: string;
	/**
	 * appeal case reference (aka appeal number)
	 * @example "6123456"
	 */
	caseReference: string;
	serviceUserType: 'Applicant' | 'Appellant' | 'Agent' | 'RepresentationContact' | 'Subscriber';
	salutation?: string;
	firstName?: string;
	lastName?: string;
	emailAddress?: string;
}
