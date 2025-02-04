const pinsYup = require('../../lib/pins-yup');
const parseDateString = require('../../utils/parse-date-string');
const {
	APPEAL_ID,
	APPEAL_STATE,
	APPLICATION_CATEGORIES,
	APPLICATION_DECISION,
	KNOW_THE_OWNERS,
	PROCEDURE_TYPE,
	SECTION_STATE,
	TYPE_OF_PLANNING_APPLICATION,
	STANDARD_TRIPLE_CONFIRM_OPTIONS,
	PLANNING_OBLIGATION_STATUS_OPTION
} = require('../../constants');

const update = pinsYup
	.object()

	.shape({
		id: pinsYup.string().trim().uuid().required(),
		horizonId: pinsYup.string().trim().max(20).nullable(),
		lpaCode: pinsYup.string().trim().max(20).required(),
		planningApplicationNumber: pinsYup.string().max(30).required(),
		decisionDate: pinsYup.lazy((decisionDate) => {
			return pinsYup
				.date()
				.isInThePast(decisionDate)
				.isWithinDeadlinePeriod(decisionDate)
				.transform(parseDateString)
				.required();
		}),
		createdAt: pinsYup.date().transform(parseDateString).required(),
		updatedAt: pinsYup.date().transform(parseDateString).required(),
		submissionDate: pinsYup.date().transform(parseDateString).nullable(),
		state: pinsYup.string().oneOf(Object.values(APPEAL_STATE)).required(),
		appealType: pinsYup.string().oneOf(Object.values(APPEAL_ID)).required(),
		typeOfPlanningApplication: pinsYup
			.string()
			.oneOf(Object.values(TYPE_OF_PLANNING_APPLICATION))
			.required(),
		email: pinsYup.string().email().max(255).required(),
		eligibility: pinsYup.object().shape({
			applicationCategories: pinsYup
				.array()
				.allOfSelectedOptions('applicationCategories', [APPLICATION_CATEGORIES.NON_OF_THESE])
				.required(),
			applicationDecision: pinsYup.string().oneOf(Object.values(APPLICATION_DECISION)).required(),
			enforcementNotice: pinsYup.bool().required(),
			hasPriorApprovalForExistingHome: pinsYup.bool().nullable(),
			hasHouseholderPermissionConditions: pinsYup.bool().nullable(),
			isListedBuilding: pinsYup.bool().nullable()
		}),
		contactDetailsSection: pinsYup.object().shape({
			isOriginalApplicant: pinsYup.bool().required(),
			contact: pinsYup.object().shape({
				name: pinsYup
					.string()
					.min(2)
					.max(80)
					.matches(/^[a-z\-' ]+$/i)
					.required(),
				companyName: pinsYup.string().max(50).nullable()
			}),
			appealingOnBehalfOf: pinsYup.object().shape({
				name: pinsYup
					.string()
					.max(80)
					.matches(/^[a-z\-' ]*$/i)
					.nullable(),
				companyName: pinsYup.string().nullable()
			})
		}),
		appealSiteSection: pinsYup.object().shape({
			siteAddress: pinsYup.object().shape({
				addressLine1: pinsYup.string().max(60).required(),
				addressLine2: pinsYup.string().max(60).nullable(),
				town: pinsYup.string().max(60).nullable(),
				county: pinsYup.string().max(60).nullable(),
				postcode: pinsYup.string().max(8).required()
			}),
			siteOwnership: pinsYup.object().shape({
				ownsSomeOfTheLand: pinsYup.bool().nullable(),
				ownsAllTheLand: pinsYup.bool().required(),
				knowsTheOwners: pinsYup.lazy((knowsTheOwners) => {
					if (knowsTheOwners) {
						return pinsYup.string().oneOf(Object.values(KNOW_THE_OWNERS));
					}
					return pinsYup.string().nullable();
				}),
				hasIdentifiedTheOwners: pinsYup.bool().nullable(),
				tellingTheLandowners: pinsYup
					.array()
					.nullable()
					.allOfValidOptions(STANDARD_TRIPLE_CONFIRM_OPTIONS),
				advertisingYourAppeal: pinsYup
					.array()
					.nullable()
					.allOfValidOptions(STANDARD_TRIPLE_CONFIRM_OPTIONS)
			}),
			agriculturalHolding: pinsYup.object().shape({
				isAgriculturalHolding: pinsYup.bool().required(),
				isTenant: pinsYup.bool().nullable(),
				hasOtherTenants: pinsYup.bool().nullable(),
				tellingTheTenants: pinsYup
					.array()
					.nullable()
					.allOfValidOptions(STANDARD_TRIPLE_CONFIRM_OPTIONS)
			}),
			visibleFromRoad: pinsYup.object().shape({
				isVisible: pinsYup.bool().required(),
				details: pinsYup.lazy((details) => {
					return pinsYup.mixed().conditionalText({
						fieldValue: details,
						fieldName: 'details',
						targetFieldName: 'isVisible',
						emptyError: 'Tell us how visibility is restricted',
						tooLongError: 'How visibility is restricted must be $maxLength characters or less',
						maxLength: 1000
					});
				})
			}),
			healthAndSafety: pinsYup.object().shape({
				hasIssues: pinsYup.bool().required(),
				details: pinsYup.lazy((details) => {
					return pinsYup.mixed().conditionalText({
						fieldValue: details,
						fieldName: 'details',
						targetFieldName: 'hasIssues',
						targetFieldValue: true,
						emptyError: 'Tell us about the health and safety issues',
						tooLongError: 'Health and safety information must be $maxLength characters or less',
						maxLength: 1000
					});
				})
			})
		}),
		appealDecisionSection: pinsYup.object().shape({
			procedureType: pinsYup.string().oneOf(Object.values(PROCEDURE_TYPE)).required(),
			hearing: pinsYup.object().shape({
				reason: pinsYup.string().trim().max(1000).nullable()
			}),
			inquiry: pinsYup.object().shape({
				reason: pinsYup.string().trim().max(1000).nullable(),
				expectedDays: pinsYup.number().integer().min(1).max(999).nullable()
			}),
			draftStatementOfCommonGround: pinsYup.object().shape({
				uploadedFile: pinsYup.object().shape({
					id: pinsYup.string().trim().uuid().nullable().default(null),
					name: pinsYup.string().trim().max(255).ensure(),
					fileName: pinsYup.string().trim().max(255).ensure(),
					originalFileName: pinsYup.string().trim().max(255).ensure(),
					location: pinsYup.string().trim().nullable(),
					size: pinsYup.number().nullable()
				})
			})
		}),
		planningApplicationDocumentsSection: pinsYup.object().shape({
			ownershipCertificate: pinsYup.object().shape({
				submittedSeparateCertificate: pinsYup.bool().nullable(),
				uploadedFile: pinsYup.object().shape({
					id: pinsYup.string().trim().uuid().nullable(),
					name: pinsYup.string().trim().max(255).nullable(),
					fileName: pinsYup.string().trim().max(255).nullable(),
					originalFileName: pinsYup.string().trim().max(255).nullable(),
					location: pinsYup.string().trim().nullable(),
					size: pinsYup.number().nullable()
				})
			}),
			descriptionDevelopmentCorrect: pinsYup.object().shape({
				isCorrect: pinsYup.bool().nullable(),
				details: pinsYup.lazy((details) => {
					return pinsYup.mixed().conditionalText({
						fieldValue: details,
						fieldName: 'details',
						targetFieldName: 'description-development-correct',
						emptyError:
							"Select yes if your proposed development haven't changed after you submitted your application",
						tooLongError: 'Agreed description of development must be $maxLength characters or less'
					});
				})
			}),
			plansDrawingsSupportingDocuments: pinsYup.object().shape({
				uploadedFiles: pinsYup
					.array()
					.of(
						pinsYup.object().shape({
							id: pinsYup.string().trim().uuid().required(),
							name: pinsYup.string().trim().max(255).required(),
							fileName: pinsYup.string().trim().max(255).required(),
							originalFileName: pinsYup.string().trim().max(255).required(),
							location: pinsYup.string().trim().required(),
							size: pinsYup.number().required()
						})
					)
					.ensure()
			}),
			originalApplication: pinsYup.object().shape({
				uploadedFile: pinsYup.object().shape({
					id: pinsYup.string().trim().uuid().required(),
					name: pinsYup.string().trim().max(255).required(),
					fileName: pinsYup.string().trim().max(255).required(),
					originalFileName: pinsYup.string().trim().max(255).required(),
					location: pinsYup.string().trim().required(),
					size: pinsYup.number().required()
				})
			}),
			decisionLetter: pinsYup.object().shape({
				uploadedFile: pinsYup.object().shape({
					id: pinsYup.string().trim().uuid().nullable(),
					name: pinsYup.string().trim().max(255).nullable(),
					fileName: pinsYup.string().trim().max(255).nullable(),
					originalFileName: pinsYup.string().trim().max(255).nullable(),
					location: pinsYup.string().trim().nullable(),
					size: pinsYup.number().nullable()
				})
			}),
			designAccessStatement: pinsYup.object().shape({
				isSubmitted: pinsYup.bool().required(),
				uploadedFile: pinsYup.object().shape({
					id: pinsYup.string().trim().uuid().nullable(),
					name: pinsYup.string().trim().max(255).nullable(),
					fileName: pinsYup.string().trim().max(255).nullable(),
					originalFileName: pinsYup.string().trim().max(255).nullable(),
					location: pinsYup.string().trim().nullable(),
					size: pinsYup.number().nullable()
				})
			}),
			letterConfirmingApplication: pinsYup.object().shape({
				uploadedFile: pinsYup.object().shape({
					id: pinsYup.string().trim().uuid().nullable(),
					name: pinsYup.string().trim().max(255).nullable(),
					fileName: pinsYup.string().trim().max(255).nullable(),
					originalFileName: pinsYup.string().trim().max(255).nullable(),
					location: pinsYup.string().trim().nullable(),
					size: pinsYup.number().nullable()
				})
			}),
			originalDecisionNotice: pinsYup.object().shape({
				uploadedFile: pinsYup.object().shape({
					id: pinsYup.string().trim().uuid().nullable(),
					name: pinsYup.string().trim().max(255).nullable(),
					fileName: pinsYup.string().trim().max(255).nullable(),
					originalFileName: pinsYup.string().trim().max(255).nullable(),
					location: pinsYup.string().trim().nullable(),
					size: pinsYup.number().nullable()
				})
			})
		}),
		appealDocumentsSection: pinsYup.object().shape({
			appealStatement: pinsYup.object().shape({
				uploadedFile: pinsYup.object().shape({
					id: pinsYup.string().trim().uuid().required(),
					name: pinsYup.string().trim().max(255).required(),
					fileName: pinsYup.string().trim().max(255).required(),
					originalFileName: pinsYup.string().trim().max(255).required(),
					location: pinsYup.string().trim().required(),
					size: pinsYup.number().required()
				}),
				hasSensitiveInformation: pinsYup.bool().required()
			}),
			plansDrawings: pinsYup.object().shape({
				hasPlansDrawings: pinsYup.bool().required(),
				uploadedFiles: pinsYup
					.array()
					.of(
						pinsYup.object().shape({
							id: pinsYup.string().trim().uuid().nullable(),
							name: pinsYup.string().trim().max(255).nullable(),
							fileName: pinsYup.string().trim().max(255).nullable(),
							originalFileName: pinsYup.string().trim().max(255).nullable(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable()
						})
					)
					.ensure()
			}),

			planningObligations: pinsYup.object().shape({
				plansPlanningObligation: pinsYup.bool().nullable(),
				planningObligationStatus: pinsYup.lazy((planningObligationStatus) => {
					if (planningObligationStatus) {
						return pinsYup.string().oneOf(Object.values(PLANNING_OBLIGATION_STATUS_OPTION));
					}
					return pinsYup.string().nullable();
				}),
				uploadedFiles: pinsYup
					.array()
					.of(
						pinsYup.object().shape({
							id: pinsYup.string().trim().uuid().nullable(),
							name: pinsYup.string().trim().max(255).nullable(),
							fileName: pinsYup.string().trim().max(255).nullable(),
							originalFileName: pinsYup.string().trim().max(255).nullable(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable()
						})
					)
					.ensure()
			}),
			draftPlanningObligations: pinsYup.object().shape({
				plansPlanningObligation: pinsYup.bool().nullable().default(null),
				planningObligationStatus: pinsYup.lazy((planningObligationStatus) => {
					if (planningObligationStatus) {
						return pinsYup.string().oneOf(Object.values(PLANNING_OBLIGATION_STATUS_OPTION));
					}
					return pinsYup.string().nullable();
				}),
				uploadedFiles: pinsYup
					.array()
					.of(
						pinsYup.object().shape({
							id: pinsYup.string().trim().uuid().nullable(),
							name: pinsYup.string().trim().max(255).nullable(),
							fileName: pinsYup.string().trim().max(255).nullable(),
							originalFileName: pinsYup.string().trim().max(255).nullable(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable()
						})
					)
					.ensure()
			}),
			planningObligationDeadline: pinsYup.object().shape({
				plansPlanningObligation: pinsYup.bool().nullable().default(null),
				planningObligationStatus: pinsYup.lazy((planningObligationStatus) => {
					if (planningObligationStatus) {
						return pinsYup.string().oneOf(Object.values(PLANNING_OBLIGATION_STATUS_OPTION));
					}
					return pinsYup.string().nullable();
				})
			}),
			supportingDocuments: pinsYup.object().shape({
				hasSupportingDocuments: pinsYup.bool().required(),
				uploadedFiles: pinsYup
					.array()
					.of(
						pinsYup.object().shape({
							id: pinsYup.string().trim().uuid().nullable(),
							name: pinsYup.string().trim().max(255).nullable(),
							fileName: pinsYup.string().trim().max(255).nullable(),
							originalFileName: pinsYup.string().trim().max(255).nullable(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable()
						})
					)
					.ensure()
			})
		}),
		appealSubmission: pinsYup.object().shape({
			appealPDFStatement: pinsYup.object().shape({
				uploadedFile: pinsYup.object().shape({
					id: pinsYup.string().trim().uuid().required(),
					name: pinsYup.string().trim().max(255).required(),
					fileName: pinsYup.string().trim().max(255).required(),
					originalFileName: pinsYup.string().trim().max(255).required(),
					location: pinsYup.string().trim().required(),
					size: pinsYup.number().required()
				})
			})
		}),
		sectionStates: pinsYup.object().shape({
			contactDetailsSection: pinsYup.object().shape({
				isOriginalApplicant: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				contact: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				appealingOnBehalfOf: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required()
			}),
			appealSiteSection: pinsYup.object().shape({
				siteAddress: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				ownsAllTheLand: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				agriculturalHolding: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				areYouATenant: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				tellingTheTenants: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				otherTenants: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				visibleFromRoad: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				healthAndSafety: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				someOfTheLand: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				knowTheOwners: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				identifyingTheLandOwners: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				advertisingYourAppeal: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				tellingTheLandowners: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required()
			}),
			appealDecisionSection: pinsYup.object().shape({
				procedureType: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				hearing: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				inquiry: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				inquiryExpectedDays: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				draftStatementOfCommonGround: pinsYup
					.string()
					.oneOf(Object.values(SECTION_STATE))
					.required()
			}),
			planningApplicationDocumentsSection: pinsYup.object().shape({
				ownershipCertificate: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				descriptionDevelopmentCorrect: pinsYup
					.string()
					.oneOf(Object.values(SECTION_STATE))
					.required(),
				plansDrawingsSupportingDocuments: pinsYup
					.string()
					.oneOf(Object.values(SECTION_STATE))
					.required(),
				originalApplication: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				decisionLetter: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				designAccessStatement: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				letterConfirmingApplication: pinsYup
					.string()
					.oneOf(Object.values(SECTION_STATE))
					.required(),
				designAccessStatementSubmitted: pinsYup
					.string()
					.oneOf(Object.values(SECTION_STATE))
					.required(),
				originalDecisionNotice: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required()
			}),
			appealDocumentsSection: pinsYup.object().shape({
				appealStatement: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				plansDrawings: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				newPlansDrawings: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				plansPlanningObligation: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				planningObligationStatus: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				planningObligationDocuments: pinsYup
					.string()
					.oneOf(Object.values(SECTION_STATE))
					.required(),
				planningObligationDeadline: pinsYup
					.string()
					.oneOf(Object.values(SECTION_STATE))
					.default('NOT STARTED'),
				draftPlanningObligations: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				supportingDocuments: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
				newSupportingDocuments: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required()
			})
		})
	});

module.exports = update;
