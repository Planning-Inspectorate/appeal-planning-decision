const uuid = require('uuid');

class AppealFixtures {

	/**
	 * 
	 * @param param0 You can specify the following keys in this object, but defaults are provided:
	 * <ul>
	 * <li><i>id</i>: set to '' by default</li>
	 * <li><i>decision</i>: Valid values are: 'granted', 'refused', or 'nodecisionreceived'. Set to 'granted' by default.</li>
	 * <li><i>planningApplicationType</i>: Valid values are: 'householder-planning', 'full-appeal', 'outline-planning',
	 * 'prior-approval', 'reserved-matters', or 'removal-or-variation-of-conditions. Set to 'householder-planning' by default.</li>
	 * <li>ownsSite</i>: Valid values are boolean true/false. Defaults to false.
	 * <li>agentAppeal</i>: Valid values are boolean true/false. Defaults to false.
	 * </ul>
	 * @returns Given no changes to input parameters, a new, valid, householder appeal.
	 */
	newHouseholderAppeal({id = '', decision = 'granted', planningApplicationType = 'householder-planning', ownsSite = false, agentAppeal = false} = {}) { 
		let appeal: any = {
			id: id,
			horizonId: 'HORIZON123',
			lpaCode: 'E69999999',
			decisionDate: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			submissionDate: new Date(),
			state: 'DRAFT',
			appealType: '1001',
			typeOfPlanningApplication: planningApplicationType,
			planningApplicationNumber: '12345',
			email: 'test@pins.com',
			eligibility: {
				applicationDecision: decision,
				enforcementNotice: false,
				householderPlanningPermission: true,
				isClaimingCosts: false,
				isListedBuilding: false,
				hasPriorApprovalForExistingHome: true,
				hasHouseholderPermissionConditions: true
			},
			aboutYouSection: {
				yourDetails: {
					isOriginalApplicant: true,
					name: 'Appellant Name'
				}
			},
			requiredDocumentsSection: {
				originalApplication: {
					uploadedFile: this.#getFileJson()
				},
				decisionLetter: {
					uploadedFile: this.#getFileJson()
				}
			},
			yourAppealSection: {
				appealStatement: {
					uploadedFile: this.#getFileJson(),
					hasSensitiveInformation: false
				},
				otherDocuments: {
					uploadedFiles: [
						this.#getFileJson(),
						this.#getFileJson()
					]
				}
			},
			appealSiteSection: {
				siteAddress: {
					addressLine1: 'Site Address 1',
					addressLine2: 'Site Address 2',
					town: 'Site Town',
					county: 'Site County',
					postcode: 'SW1 1AA'
				},
				siteOwnership: {
					ownsWholeSite: ownsSite,
					haveOtherOwnersBeenTold: ownsSite ? null : true
				},
				siteAccess: {
					canInspectorSeeWholeSiteFromPublicRoad: false,
					howIsSiteAccessRestricted: 'A very restricted site'
				},
				healthAndSafety: {
					hasIssues: true,
					healthAndSafetyIssues: 'A very dangerous site',
					details: 'nails'
				}
			},
			appealSubmission: {
				appealPDFStatement: {
					uploadedFile: this.#getFileJson()
				}
			},
			sectionStates: {
				aboutYouSection: {
					yourDetails: 'COMPLETED'
				},
				requiredDocumentsSection: {
					originalApplication: 'COMPLETED',
					decisionLetter: 'COMPLETED'
				},
				yourAppealSection: {
					appealStatement: 'COMPLETED',
					otherDocuments: 'COMPLETED'
				},
				appealSiteSection: {
					siteAddress: 'COMPLETED',
					siteAccess: 'COMPLETED',
					siteOwnership: 'COMPLETED',
					healthAndSafety: 'COMPLETED'
				}
			}
		}

		if (agentAppeal) {
			appeal.aboutYouSection.yourDetails.isOriginalApplicant = false;
			appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = 'Appellant Name';
			appeal.aboutYouSection.yourDetails.name = 'Agent Name';
		}

		return appeal;
	};

	/**
	 * 
	 * @param param0 You can specify the following keys in this object, but defaults are provided:
	 * <ul>
	 * <li><i>id</i>: set to '' by default</li>
	 * <li><i>decision</i>: Valid values are: 'granted', 'refused', or 'nodecisionreceived'. Set to 'granted' by default.</li>
	 * <li><i>planningApplicationType</i>: Valid values are: 'householder-planning', 'full-appeal', 'outline-planning',
	 * 'prior-approval', 'reserved-matters', or 'removal-or-variation-of-conditions. Set to 'householder-planning' by default.</li>
	 * <li>ownsAllLand</i>: Valid values are boolean true/false. Defaults to false.
	 * </ul>
	 * @returns Given no changes to input paramters, a new, valid, full appeal.
	 */
	newFullAppeal({
		id = '', 
		decision = 'granted', 
		planningApplicationType = 'householder-planning', //todo: is this correct?
		ownsAllLand = false, 
		agentAppeal = false, 
		appellantCompanyName = null, 
		agentCompanyName = null
	} = {}) {
		let appeal: any = {
			id: id,
			horizonId: "",
			lpaCode: "E69999999",
			planningApplicationNumber: '12345',
			email: "test@pins.com",
			createdAt: new Date(),
			updatedAt: new Date(),
			submissionDate: new Date(),
			decisionDate: new Date(),
			typeOfPlanningApplication: planningApplicationType,
			appealType: "1005",
			state: "DRAFT",
			eligibility: {
				hasHouseholderPermissionConditions: true,
				hasPriorApprovalForExistingHome: true,
				enforcementNotice: false,
				applicationDecision: decision
			},
			contactDetailsSection: {
				contact: {
					name: "Appellant Name"
				},
				isOriginalApplicant: true
			},
			appealSiteSection: {
				healthAndSafety: {
					details: "nails",
					hasIssues: true
				},
				visibleFromRoad: {
					isVisible: false,
					details: "a MASSIVE wall"
				},
				agriculturalHolding: {},
				siteOwnership: {
					ownsAllTheLand: ownsAllLand
				},
				siteAddress: {
					addressLine1: "Site Address 1",
					addressLine2: "Site Address 2",
					town: "Site Town",
					county: "Site County",
					postcode: "SW1 1AA"
				}
			},
			appealDecisionSection: {
				draftStatementOfCommonGround: {
					uploadedFile: this.#getFileJson()
				},
				inquiry: {},
				hearing: {
					reason: 'I can not write with these weathered hands'
				},
				procedureType: 'Hearing'
			},
			planningApplicationDocumentsSection: {
				originalDecisionNotice: {
					uploadedFile: this.#getFileJson()
				},
				letterConfirmingApplication: {
					uploadedFile: this.#getFileJson()
				},
				designAccessStatement: {
					uploadedFile: this.#getFileJson()
				},
				decisionLetter: {
					uploadedFile: this.#getFileJson()
				},
				originalApplication: {
					uploadedFile: this.#getFileJson()
				},
				plansDrawingsSupportingDocuments: {
					uploadedFiles: [
						this.#getFileJson(),
						this.#getFileJson()
					]
				},
				descriptionDevelopmentCorrect: {},
				ownershipCertificate: {
					uploadedFile: this.#getFileJson(),
					submittedSeparateCertificate: null
				}
			},
			appealDocumentsSection: {
				supportingDocuments: {
					uploadedFiles: [
						this.#getFileJson(),
						this.#getFileJson()
					],
					hasSupportingDocuments: null
				},
				planningObligationDeadline: {
					plansPlanningObligation: null
				},
				draftPlanningObligations: {
					plansPlanningObligation: null
				},
				planningObligations: {
					plansPlanningObligation: null
				},
				plansDrawings: {
					uploadedFiles: [
						this.#getFileJson(),
						this.#getFileJson()
					],
					hasPlansDrawings: null
				},
				appealStatement: {
					hasSensitiveInformation: null,
					uploadedFile: this.#getFileJson()
				}
			},
			appealSubmission: {
				appealPDFStatement: {
					uploadedFile: this.#getFileJson()
				}
			},
			sectionStates: {
				appealDocumentsSection: {
					newSupportingDocuments: "NOT STARTED",
					supportingDocuments: "NOT STARTED",
					draftPlanningObligations: "NOT STARTED",
					planningObligationDeadline: "NOT STARTED",
					planningObligationDocuments: "NOT STARTED",
					planningObligationStatus: "NOT STARTED",
					plansPlanningObligation: "NOT STARTED",
					newPlansDrawings: "NOT STARTED",
					plansDrawings: "NOT STARTED",
					appealStatement: "NOT STARTED"
				},
				planningApplicationDocumentsSection: {
					letterConfirmingApplication: "NOT STARTED",
					originalDecisionNotice: "NOT STARTED",
					designAccessStatementSubmitted: "NOT STARTED",
					designAccessStatement: "NOT STARTED",
					decisionLetter: "NOT STARTED",
					originalApplication: "NOT STARTED",
					plansDrawingsSupportingDocuments: "NOT STARTED",
					descriptionDevelopmentCorrect: "NOT STARTED",
					ownershipCertificate: "NOT STARTED"
				},
				appealDecisionSection: {
					draftStatementOfCommonGround: "NOT STARTED",
					inquiryExpectedDays: "NOT STARTED",
					inquiry: "NOT STARTED",
					hearing: "NOT STARTED",
					procedureType: "NOT STARTED"
				},
				appealSiteSection: {
					tellingTheLandowners: "NOT STARTED",
					advertisingYourAppeal: "NOT STARTED",
					identifyingTheLandOwners: "NOT STARTED",
					knowTheOwners: "NOT STARTED",
					someOfTheLand: "NOT STARTED",
					healthAndSafety: "COMPLETED",
					visibleFromRoad: "NOT STARTED",
					otherTenants: "NOT STARTED",
					tellingTheTenants: "NOT STARTED",
					areYouATenant: "NOT STARTED",
					agriculturalHolding: "NOT STARTED",
					ownsAllTheLand: "NOT STARTED",
					siteAddress: "COMPLETED"
				},
				contactDetailsSection: {
					appealingOnBehalfOf: "NOT STARTED",
					contact: "NOT STARTED",
					isOriginalApplicant: "NOT STARTED"
				}
			}
		};

		if (agentAppeal) {
			appeal.contactDetailsSection.isOriginalApplicant = false;
			appeal.contactDetailsSection.contact.name = "Agent Name"
			appeal.contactDetailsSection.appealingOnBehalfOf = { 
				name: "Appellant Name"
			}
		}

		if (agentAppeal == false && appellantCompanyName) {
			appeal.contactDetailsSection.contact.companyName = appellantCompanyName
		}

		if (agentAppeal && agentCompanyName) {
			appeal.contactDetailsSection.contact.companyName = agentCompanyName;
		}

		if (agentAppeal && appellantCompanyName) {
			appeal.contactDetailsSection.appealingOnBehalfOf.companyName = appellantCompanyName
		}

		return appeal;
	}

	/**
	 * 
	 * @returns All documents have the same name because, in all testing circumstances, we don't care about the ordering of 
	 * files, just that the correct number of them have been used in different contexts. Due to the way in which MockServer 
	 * records and returns verifications, and how files may be retrieved in tests, getting the file order to match up in 
	 * tests themselves is a real pain, and this is always due to the file names being in the wrong order. So, if the file
	 * names are all the same, we don't get this issue
	 */
	#getFileJson() {
		return {
			id: uuid.v4(),
			name: 'test-pdf.pdf',
			originalFileName: 'test-pdf.pdf',
			fileName: 'test-pdf.pdf',
			location: '',
			size: 8334
		}
	}
}

module.exports = AppealFixtures