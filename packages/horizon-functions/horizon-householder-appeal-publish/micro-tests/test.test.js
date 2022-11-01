const uploadedDocumentMapper = require('../uploadedDocumentMapper');
describe('DocumentUploadMapper', () => {
	it('provides success', () => {
		//given a valid appeal obejct
		//When is passed into uploadedDocumentMapper
		const result = uploadedDocumentMapper(appeal);
		//Then recieve array of Doc IDs
		expect(result).toEqual(expect.arrayContaining(mappedDocuments));
		expect(result.length).toEqual(mappedDocuments.length);
	});
});

const mappedDocuments = [
	{ id: 'add6e082-18b1-42c6-a49b-fc24ba41c94c' },
	{ id: '5bea37a0-b45b-4621-803f-29989cb8df24' },
	{ id: '9150fbde-30fe-4825-b420-c54dcba215b3' },
	{ id: '0e088392-2dc3-4544-8704-677c17682397' },
	{ id: '1b0309ad-c7a4-4aea-a3c0-fd24bebc89b3' },
	{ id: 'c648ab76-e65a-49c9-903c-4c8ea3f0fad6' },
	{ id: '057f24c1-9f41-4cd9-a164-ba9019889ac9' },
	{ id: 'a41b8b5b-3519-47a0-a10b-c3127513f652' },
	{ id: '967a02eb-9f1d-4b57-a9e8-0ca554cd1697' },
	{ id: '0965c5d9-605d-4529-82d7-fd5b599911c5' },
	{ id: 'eb2dfcf2-5c07-4da2-bfa6-c6f1108f3de9' },
	{ id: 'eb2dfcf2-5c07-4da2-bfa6-c6f1108feded' },
	{ id: 'eb2dfcf2-5c07-4da2-bfa6-c6f110martyn' }
];

const appeal = {
	_id: '5cc573e1-50d3-4c1c-adc7-30b23ed99f7d',
	uuid: '5cc573e1-50d3-4c1c-adc7-30b23ed99f7d',
	appeal: {
		sectionStates: {
			appealDocumentsSection: {
				newSupportingDocuments: 'COMPLETED',
				supportingDocuments: 'COMPLETED',
				draftPlanningObligations: 'COMPLETED',
				planningObligationDeadline: 'NOT STARTED',
				planningObligationDocuments: 'NOT STARTED',
				planningObligationStatus: 'COMPLETED',
				plansPlanningObligation: 'COMPLETED',
				newPlansDrawings: 'COMPLETED',
				plansDrawings: 'COMPLETED',
				appealStatement: 'COMPLETED'
			},
			planningApplicationDocumentsSection: {
				letterConfirmingApplication: 'COMPLETED',
				originalDecisionNotice: 'NOT STARTED',
				designAccessStatementSubmitted: 'COMPLETED',
				designAccessStatement: 'COMPLETED',
				decisionLetter: 'NOT STARTED',
				originalApplication: 'COMPLETED',
				plansDrawingsSupportingDocuments: 'COMPLETED',
				descriptionDevelopmentCorrect: 'COMPLETED',
				ownershipCertificate: 'COMPLETED'
			},
			appealDecisionSection: {
				draftStatementOfCommonGround: 'COMPLETED',
				inquiryExpectedDays: 'NOT STARTED',
				inquiry: 'NOT STARTED',
				hearing: 'COMPLETED',
				procedureType: 'COMPLETED'
			},
			appealSiteSection: {
				tellingTheLandowners: 'NOT STARTED',
				advertisingYourAppeal: 'NOT STARTED',
				identifyingTheLandOwners: 'NOT STARTED',
				knowTheOwners: 'NOT STARTED',
				someOfTheLand: 'NOT STARTED',
				healthAndSafety: 'COMPLETED',
				visibleFromRoad: 'COMPLETED',
				otherTenants: 'NOT STARTED',
				tellingTheTenants: 'NOT STARTED',
				areYouATenant: 'NOT STARTED',
				agriculturalHolding: 'COMPLETED',
				ownsAllTheLand: 'COMPLETED',
				siteAddress: 'COMPLETED'
			},
			contactDetailsSection: {
				appealingOnBehalfOf: 'NOT STARTED',
				contact: 'COMPLETED',
				isOriginalApplicant: 'COMPLETED'
			}
		},
		appealSubmission: {
			appealPDFStatement: {
				uploadedFile: {
					size: 32562,
					location:
						'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/9150fbde-30fe-4825-b420-c54dcba215b3/ - 12345 - planning-appeal-for-planning-application-12345.pdf',
					originalFileName: '- 12345 - planning-appeal-for-planning-application-12345.pdf',
					fileName: '- 12345 - planning-appeal-for-planning-application-12345.pdf',
					name: '- 12345 - planning-appeal-for-planning-application-12345.pdf',
					id: '9150fbde-30fe-4825-b420-c54dcba215b3'
				}
			}
		},
		appealDocumentsSection: {
			supportingDocuments: {
				uploadedFiles: [
					{
						size: 25692,
						location:
							'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/eb2dfcf2-5c07-4da2-bfa6-c6f1108f3de9/CORRESPONDENCE WITH LPA - 12345 - other-supporting-docs.pdf',
						originalFileName: 'other-supporting-docs.pdf',
						fileName: 'other-supporting-docs.pdf',
						name: 'other-supporting-docs.pdf',
						id: 'eb2dfcf2-5c07-4da2-bfa6-c6f1108f3de9'
					},
					{
						size: 25692,
						location:
							'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/eb2dfcf2-5c07-4da2-bfa6-c6f1108f3de9/CORRESPONDENCE WITH LPA - 12345 - other-supporting-docs.pdf',
						originalFileName: 'other-supporting-docs.pdf',
						fileName: 'other-supporting-docs.pdf',
						name: 'other-supporting-docs.pdf',
						id: 'eb2dfcf2-5c07-4da2-bfa6-c6f1108feded'
					},
					{
						size: 25692,
						location: null,
						originalFileName: null,
						fileName: null,
						name: null,
						id: null
					}
				],
				hasSupportingDocuments: true
			},
			planningObligationDeadline: {
				planningObligationStatus: 'draft',
				plansPlanningObligation: null
			},
			draftPlanningObligations: {
				planningObligationStatus: null,
				plansPlanningObligation: null,
				uploadedFiles: [
					{
						id: 'a41b8b5b-3519-47a0-a10b-c3127513f652',
						name: 'draft-planning-obligation.pdf',
						fileName: 'draft-planning-obligation.pdf',
						originalFileName: 'draft-planning-obligation.pdf',
						location:
							'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/a41b8b5b-3519-47a0-a10b-c3127513f652/DRAFT PLANNING OBLIGATION - 12345 - draft-planning-obligation.pdf',
						size: '88200'
					},
					{
						size: 25692,
						location:
							'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/eb2dfcf2-5c07-4da2-bfa6-c6f1108f3de9/CORRESPONDENCE WITH LPA - 12345 - other-supporting-docs.pdf',
						originalFileName: 'other-supporting-docs.pdf',
						fileName: 'other-supporting-docs.pdf',
						name: 'other-supporting-docs.pdf',
						id: 'eb2dfcf2-5c07-4da2-bfa6-c6f110martyn'
					}
				]
			},
			planningObligations: {
				planningObligationStatus: null,
				plansPlanningObligation: true
			},
			plansDrawings: {
				uploadedFiles: [
					{
						size: 3036,
						location:
							'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/0965c5d9-605d-4529-82d7-fd5b599911c5/LIST OF PLANS SUBMITTED AFTER LPA DECISION - 12345 - plans-drawings.jpeg',
						originalFileName: 'plans-drawings.jpeg',
						fileName: 'plans-drawings.jpeg',
						name: 'plans-drawings.jpeg',
						id: '0965c5d9-605d-4529-82d7-fd5b599911c5'
					}
				],
				hasPlansDrawings: true
			},
			appealStatement: {
				hasSensitiveInformation: false,
				uploadedFile: {
					size: 25692,
					location:
						'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/add6e082-18b1-42c6-a49b-fc24ba41c94c/ - 12345 - appeal-statement-valid.pdf',
					originalFileName: 'appeal-statement-valid.pdf',
					fileName: 'appeal-statement-valid.pdf',
					name: 'appeal-statement-valid.pdf',
					id: 'add6e082-18b1-42c6-a49b-fc24ba41c94c'
				}
			}
		},
		planningApplicationDocumentsSection: {
			originalDecisionNotice: {
				uploadedFile: {
					horizonDocumentGroupType: null,
					horizonDocumentType: null,
					size: null,
					location: null,
					originalFileName: '',
					fileName: '',
					name: '',
					id: null
				}
			},
			letterConfirmingApplication: {
				uploadedFile: {
					size: 88875,
					location:
						'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/057f24c1-9f41-4cd9-a164-ba9019889ac9/LPA ACKNOWLEDGEMENT - 12345 - letter-confirming-planning-application.pdf',
					originalFileName: 'letter-confirming-planning-application.pdf',
					fileName: 'letter-confirming-planning-application.pdf',
					name: 'letter-confirming-planning-application.pdf',
					id: '057f24c1-9f41-4cd9-a164-ba9019889ac9'
				}
			},
			designAccessStatement: {
				uploadedFile: {
					size: 25692,
					location:
						'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/0e088392-2dc3-4544-8704-677c17682397/ - 12345 - design-and-access-statement.pdf',
					originalFileName: 'design-and-access-statement.pdf',
					fileName: 'design-and-access-statement.pdf',
					name: 'design-and-access-statement.pdf',
					id: '0e088392-2dc3-4544-8704-677c17682397'
				},
				isSubmitted: true
			},
			decisionLetter: {
				uploadedFile: {
					horizonDocumentGroupType: null,
					horizonDocumentType: null,
					size: null,
					location: null,
					originalFileName: '',
					fileName: '',
					name: '',
					id: null
				}
			},
			originalApplication: {
				uploadedFile: {
					size: 25692,
					location:
						'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/5bea37a0-b45b-4621-803f-29989cb8df24/APPLICATION FORM - 12345 - planning-application-form.pdf',
					originalFileName: 'planning-application-form.pdf',
					fileName: 'planning-application-form.pdf',
					name: 'planning-application-form.pdf',
					id: '5bea37a0-b45b-4621-803f-29989cb8df24'
				}
			},
			plansDrawingsSupportingDocuments: {
				uploadedFiles: [
					{
						size: 25692,
						location:
							'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/967a02eb-9f1d-4b57-a9e8-0ca554cd1697/ - 12345 - plans-drawings-and-supporting-documents.pdf',
						originalFileName: 'plans-drawings-and-supporting-documents.pdf',
						fileName: 'plans-drawings-and-supporting-documents.pdf',
						name: 'plans-drawings-and-supporting-documents.pdf',
						id: '967a02eb-9f1d-4b57-a9e8-0ca554cd1697'
					}
				]
			},
			descriptionDevelopmentCorrect: { isCorrect: true, details: '' },
			ownershipCertificate: {
				uploadedFile: {
					size: 25692,
					location:
						'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/c648ab76-e65a-49c9-903c-4c8ea3f0fad6/OWNERSHIP CERTIFICATE - 12345 - ownership-certificate-and-agricultural-land-declaration.pdf',
					originalFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf',
					fileName: 'ownership-certificate-and-agricultural-land-declaration.pdf',
					name: 'ownership-certificate-and-agricultural-land-declaration.pdf',
					id: 'c648ab76-e65a-49c9-903c-4c8ea3f0fad6'
				},
				submittedSeparateCertificate: true
			}
		},
		appealDecisionSection: {
			draftStatementOfCommonGround: {
				uploadedFile: {
					size: 35297,
					location:
						'5cc573e1-50d3-4c1c-adc7-30b23ed99f7d/1b0309ad-c7a4-4aea-a3c0-fd24bebc89b3/DRAFT STATEMENT OF COMMON GROUND - 12345 - draft-statement-of-common-ground.pdf',
					originalFileName: 'draft-statement-of-common-ground.pdf',
					fileName: 'draft-statement-of-common-ground.pdf',
					name: 'draft-statement-of-common-ground.pdf',
					id: '1b0309ad-c7a4-4aea-a3c0-fd24bebc89b3'
				}
			},
			inquiry: { expectedDays: null, reason: null },
			hearing: { reason: 'Test' },
			procedureType: 'Written'
		},
		appealSiteSection: {
			healthAndSafety: { hasIssues: false, details: '' },
			visibleFromRoad: { isVisible: true, details: '' },
			agriculturalHolding: {
				tellingTheTenants: null,
				hasOtherTenants: null,
				isTenant: null,
				isAgriculturalHolding: false
			},
			siteOwnership: {
				advertisingYourAppeal: null,
				tellingTheLandowners: null,
				hasIdentifiedTheOwners: null,
				knowsTheOwners: null,
				ownsAllTheLand: true,
				ownsSomeOfTheLand: null
			},
			siteAddress: {
				addressLine1: 'Test Building',
				addressLine2: 'Test Street',
				town: 'Test city',
				county: 'Test County',
				postcode: 'DN16 2SE'
			}
		},
		contactDetailsSection: {
			appealingOnBehalfOf: { companyName: null, name: null },
			contact: { name: 'Test Test', companyName: '' },
			isOriginalApplicant: true
		},
		eligibility: {
			hasHouseholderPermissionConditions: null,
			hasPriorApprovalForExistingHome: null,
			enforcementNotice: false,
			applicationDecision: 'nodecisionreceived',
			applicationCategories: ['none_of_these']
		},
		email: 'test@example.com',
		typeOfPlanningApplication: 'full-appeal',
		appealType: '1005',
		state: 'SUBMITTED',
		updatedAt: '2022-10-28T15:57:54.595Z',
		createdAt: '2022-10-28T15:55:55.400Z',
		decisionDate: '2022-10-05T12:00:00.000Z',
		planningApplicationNumber: '12345',
		lpaCode: 'E69999999',
		id: '5cc573e1-50d3-4c1c-adc7-30b23ed99f7d',
		submissionDate: '2022-10-28T15:57:54.595Z'
	}
};
