const {
	STANDARD_TRIPLE_CONFIRM_OPTIONS,
	PLANNING_OBLIGATION_STATUS_OPTION
} = require('../../src/constants');

const appeal = {
	id: 'fc7cb757-fe21-46dd-b3fd-121c385cd884',
	horizonId: 'HORIZON123',
	lpaCode: 'E69999999',
	planningApplicationNumber: 'ABCDE12345',
	decisionDate: new Date(),
	createdAt: new Date(),
	updatedAt: new Date(),
	submissionDate: new Date(),
	state: 'SUBMITTED',
	appealType: '1005',
	typeOfPlanningApplication: 'full-appeal',
	email: 'testemail@example.com',
	eligibility: {
		applicationCategories: ['none_of_these'],
		applicationDecision: 'granted',
		enforcementNotice: false,
		hasPriorApprovalForExistingHome: true,
		hasHouseholderPermissionConditions: false,
		isListedBuilding: false
	},
	contactDetailsSection: {
		isOriginalApplicant: true,
		contact: {
			name: 'a name',
			companyName: 'Test Company'
		},
		appealingOnBehalfOf: {
			name: '',
			companyName: ''
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
			ownsAllTheLand: true,
			ownsSomeOfTheLand: false,
			knowsTheOwners: 'yes',
			hasIdentifiedTheOwners: true,
			tellingTheLandowners: [...STANDARD_TRIPLE_CONFIRM_OPTIONS],
			advertisingYourAppeal: [...STANDARD_TRIPLE_CONFIRM_OPTIONS]
		},
		agriculturalHolding: {
			isAgriculturalHolding: true,
			isTenant: true,
			hasOtherTenants: true,
			tellingTheTenants: [...STANDARD_TRIPLE_CONFIRM_OPTIONS]
		},
		visibleFromRoad: {
			isVisible: false,
			details: 'Access via the road at the side of the property'
		},
		healthAndSafety: {
			hasIssues: true,
			details: 'The site has poor mobile reception'
		}
	},
	appealDecisionSection: {
		procedureType: 'Hearing',
		hearing: {
			reason: 'Reason for having a hearing'
		},
		inquiry: {
			reason: 'Reason for having an inquiry',
			expectedDays: 2
		},
		draftStatementOfCommonGround: {
			uploadedFile: {
				id: '3e0a6cf1-d3a2-49d1-9759-f775c59b90c8',
				name: 'draftStatementOfCommonGround.pdf',
				fileName: 'draftStatementOfCommonGround.pdf',
				originalFileName: 'draftStatementOfCommonGround.pdf',
				location: '3e0a6cf1-d3a2-49d1-9759-f775c59b90c8/draftStatementOfCommonGround.pdf',
				size: 1000
			}
		}
	},
	planningApplicationDocumentsSection: {
		ownershipCertificate: {
			submittedSeparateCertificate: true,
			uploadedFile: {
				id: '482c8ba6-dfa6-4bba-bf9c-b024e3d8c281',
				name: 'ownershipCertificate.pdf',
				fileName: 'ownershipCertificate.pdf',
				originalFileName: 'ownershipCertificate.pdf',
				location: '482c8ba6-dfa6-4bba-bf9c-b024e3d8c281/ownershipCertificate.pdf',
				size: 900
			}
		},
		descriptionDevelopmentCorrect: {
			details: '',
			isCorrect: false
		},
		plansDrawingsSupportingDocuments: {
			uploadedFiles: [
				{
					id: 'e8e26cae-720f-4bc7-8d9b-cc601b0a80ca',
					name: 'plansDrawingsSupportingDocuments1.pdf',
					fileName: 'plansDrawingsSupportingDocuments1.pdf',
					originalFileName: 'plansDrawingsSupportingDocuments1.pdf',
					location: 'e8e26cae-720f-4bc7-8d9b-cc601b0a80ca/plansDrawingsSupportingDocuments1.pdf',
					size: 1000
				},
				{
					id: '73ce77bf-7bdb-40ea-8787-d45fd580c592',
					name: 'plansDrawingsSupportingDocuments2.pdf',
					fileName: 'plansDrawingsSupportingDocuments2.pdf',
					originalFileName: 'plansDrawingsSupportingDocuments2.pdf',
					location: '73ce77bf-7bdb-40ea-8787-d45fd580c592/plansDrawingsSupportingDocuments2.pdf',
					size: 1000
				}
			]
		},
		originalApplication: {
			uploadedFile: {
				id: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282',
				name: 'originalApplication.pdf',
				fileName: 'originalApplication.pdf',
				originalFileName: 'originalApplication.pdf',
				location: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282/originalApplication.pdf',
				size: 1000
			}
		},
		letterConfirmingApplication: {
			uploadedFile: {
				id: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282',
				name: 'letterConfirmingApplication.pdf',
				fileName: 'letterConfirmingApplication.pdf',
				originalFileName: 'letterConfirmingApplication.pdf',
				location: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282/letterConfirmingApplication.pdf',
				size: 1000
			}
		},
		originalDecisionNotice: {
			uploadedFile: {
				id: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282',
				name: 'originalDecisionNotice.pdf',
				fileName: 'originalDecisionNotice.pdf',
				originalFileName: 'originalDecisionNotice.pdf',
				location: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282/originalDecisionNotice.pdf',
				size: 1000
			}
		},
		decisionLetter: {
			uploadedFile: {
				id: '89b73320-8165-43f9-83e8-43bc0d927140',
				name: 'decisionLetter.pdf',
				fileName: 'decisionLetter.pdf',
				originalFileName: 'decisionLetter.pdf',
				location: '89b73320-8165-43f9-83e8-43bc0d927140/decisionLetter.pdf',
				size: 1000
			}
		},
		designAccessStatement: {
			isSubmitted: true,
			uploadedFile: {
				id: '4325a1bb-7bae-4d31-bdeb-8147248def03',
				name: 'designAccessStatement.pdf',
				fileName: 'designAccessStatement.pdf',
				originalFileName: 'designAccessStatement.pdf',
				location: '4325a1bb-7bae-4d31-bdeb-8147248def03/designAccessStatement.pdf',
				size: 1000
			}
		}
	},
	appealDocumentsSection: {
		appealStatement: {
			uploadedFile: {
				id: '87e645e4-1050-458b-93df-1bff89b5b87c',
				name: 'appealStatement.pdf',
				fileName: 'appealStatement.pdf',
				originalFileName: 'appealStatement.pdf',
				location: '87e645e4-1050-458b-93df-1bff89b5b87c/appealStatement.pdf',
				size: 1000
			},
			hasSensitiveInformation: false
		},
		plansDrawings: {
			hasPlansDrawings: true,
			uploadedFiles: [
				{
					id: '89280aa4-d925-4525-8050-938d5db41a5a',
					name: 'plansDrawings1.pdf',
					fileName: 'plansDrawings1.pdf',
					originalFileName: 'plansDrawings1.pdf',
					location: '89280aa4-d925-4525-8050-938d5db41a5a/plansDrawings1.pdf',
					size: 1000
				},
				{
					id: '5ac54094-4356-4dc4-ba33-efcdbccaa834',
					name: 'plansDrawings2.pdf',
					fileName: 'plansDrawings2.pdf',
					originalFileName: 'plansDrawings2.pdf',
					location: '5ac54094-4356-4dc4-ba33-efcdbccaa834/plansDrawings2.pdf',
					size: 1000
				}
			]
		},
		supportingDocuments: {
			hasSupportingDocuments: true,
			uploadedFiles: [
				{
					id: '059c3060-b112-4520-bf85-21a3894016ab',
					name: 'supportingDocuments1.pdf',
					fileName: 'supportingDocuments1.pdf',
					originalFileName: 'supportingDocuments1.pdf',
					location: '059c3060-b112-4520-bf85-21a3894016ab/supportingDocuments1.pdf',
					size: 1000
				},
				{
					id: '4e501f91-0572-4c50-b0d2-28748b46454a',
					name: 'supportingDocuments2.pdf',
					fileName: 'supportingDocuments2.pdf',
					originalFileName: 'supportingDocuments2.pdf',
					location: '4e501f91-0572-4c50-b0d2-28748b46454a/supportingDocuments2.pdf',
					size: 1000
				}
			]
		},
		planningObligations: {
			plansPlanningObligation: true,
			planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.FINALISED,
			uploadedFiles: [
				{
					id: 'e8e26cae-720f-4bc7-8d9b-cc601b0a80ca',
					name: 'plansDrawingsSupportingDocuments1.pdf',
					fileName: 'plansDrawingsSupportingDocuments1.pdf',
					originalFileName: 'plansDrawingsSupportingDocuments1.pdf',
					location: 'e8e26cae-720f-4bc7-8d9b-cc601b0a80ca/plansDrawingsSupportingDocuments1.pdf',
					size: 1000
				},
				{
					id: '73ce77bf-7bdb-40ea-8787-d45fd580c592',
					name: 'plansDrawingsSupportingDocuments2.pdf',
					fileName: 'plansDrawingsSupportingDocuments2.pdf',
					originalFileName: 'plansDrawingsSupportingDocuments2.pdf',
					location: '73ce77bf-7bdb-40ea-8787-d45fd580c592/plansDrawingsSupportingDocuments2.pdf',
					size: 1000
				}
			]
		},
		draftPlanningObligations: {
			plansPlanningObligation: true,
			planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.DRAFT,
			uploadedFiles: [
				{
					id: 'e8e26cae-720f-4bc7-8d9b-cc601b0a80ca',
					name: 'plansDrawingsSupportingDocuments1.pdf',
					fileName: 'plansDrawingsSupportingDocuments1.pdf',
					originalFileName: 'plansDrawingsSupportingDocuments1.pdf',
					location: 'e8e26cae-720f-4bc7-8d9b-cc601b0a80ca/plansDrawingsSupportingDocuments1.pdf',
					size: 1000
				},
				{
					id: '73ce77bf-7bdb-40ea-8787-d45fd580c592',
					name: 'plansDrawingsSupportingDocuments2.pdf',
					fileName: 'plansDrawingsSupportingDocuments2.pdf',
					originalFileName: 'plansDrawingsSupportingDocuments2.pdf',
					location: '73ce77bf-7bdb-40ea-8787-d45fd580c592/plansDrawingsSupportingDocuments2.pdf',
					size: 1000
				}
			]
		},
		planningObligationDeadline: {
			plansPlanningObligation: true,
			planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.NOT_STARTED
		}
	},
	appealSubmission: {
		appealPDFStatement: {
			uploadedFile: {
				id: '01739574-e34c-4da0-8163-17e55268af7c',
				name: 'appealPDFStatement.pdf',
				fileName: 'appealPDFStatement.pdf',
				originalFileName: 'appealPDFStatement.pdf',
				location: '01739574-e34c-4da0-8163-17e55268af7c/appealPDFStatement.pdf',
				size: 1000
			}
		}
	},
	sectionStates: {
		contactDetailsSection: {
			isOriginalApplicant: 'NOT STARTED',
			contact: 'NOT STARTED',
			appealingOnBehalfOf: 'NOT STARTED'
		},
		appealSiteSection: {
			siteAddress: 'NOT STARTED',
			ownsAllTheLand: 'NOT STARTED',
			agriculturalHolding: 'NOT STARTED',
			areYouATenant: 'NOT STARTED',
			tellingTheTenants: 'NOT STARTED',
			otherTenants: 'NOT STARTED',
			visibleFromRoad: 'NOT STARTED',
			healthAndSafety: 'NOT STARTED',
			someOfTheLand: 'NOT STARTED',
			knowTheOwners: 'NOT STARTED',
			identifyingTheLandOwners: 'NOT STARTED',
			advertisingYourAppeal: 'NOT STARTED',
			tellingTheLandowners: 'NOT STARTED'
		},
		appealDecisionSection: {
			procedureType: 'NOT STARTED',
			hearing: 'NOT STARTED',
			inquiry: 'NOT STARTED',
			inquiryExpectedDays: 'NOT STARTED',
			draftStatementOfCommonGround: 'NOT STARTED'
		},
		planningApplicationDocumentsSection: {
			originalApplication: 'NOT STARTED',
			ownershipCertificate: 'NOT STARTED',
			descriptionDevelopmentCorrect: 'NOT STARTED',
			plansDrawingsSupportingDocuments: 'NOT STARTED',
			designAccessStatementSubmitted: 'NOT STARTED',
			letterConfirmingApplication: 'NOT STARTED',
			designAccessStatement: 'NOT STARTED',
			decisionLetter: 'NOT STARTED',
			originalDecisionNotice: 'NOT STARTED'
		},
		appealDocumentsSection: {
			appealStatement: 'NOT STARTED',
			plansDrawings: 'NOT STARTED',
			newPlansDrawings: 'NOT STARTED',
			plansPlanningObligation: 'NOT STARTED',
			planningObligationStatus: 'NOT STARTED',
			planningObligationDocuments: 'NOT STARTED',
			draftPlanningObligations: 'NOT STARTED',
			planningObligationDeadline: 'NOT STARTED',
			supportingDocuments: 'NOT STARTED',
			newSupportingDocuments: 'NOT STARTED'
		}
	}
};

module.exports = appeal;
