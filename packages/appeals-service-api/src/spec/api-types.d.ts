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
	/** indicates if the rule 6 party evidence has been received */
	rule6ProofsEvidenceReceived?: boolean;
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
