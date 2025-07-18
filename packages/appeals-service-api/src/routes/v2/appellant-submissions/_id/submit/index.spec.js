const crypto = require('crypto');
const config = require('../../../../../configuration/config');
const lpaEmail = 'lpa@example.com';

/**
 * @typedef {import('../appellant-submission').AppellantSubmission} AppellantSubmission
 */

/**
 * @param {Object} dependencies
 * @param {function(): import('@prisma/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {import('supertest').Agent} dependencies.appealsApi
 * @param {import('../../../index.test').NotifyClientMock} dependencies.mockNotifyClient
 * @param {import('../../../index.test').EventClientMock} dependencies.mockEventClient
 * @param {import('../../../index.test').BlobMetaGetterMock} dependencies.mockBlobMetaGetter
 */
module.exports = ({
	getSqlClient,
	setCurrentSub,
	appealsApi,
	mockNotifyClient,
	mockEventClient,
	mockBlobMetaGetter
}) => {
	const sqlClient = getSqlClient();

	let validUser = '';
	let validEmail = '';

	const submissionData = {
		common: {
			LPACode: '123',
			appellantGreenBelt: true,
			advertisedAppeal: true,
			developmentDescriptionOriginal: 'Original description',
			updateDevelopmentDescription: true,
			costApplication: true
		},
		application: {
			applicationReference: '123',
			onApplicationDate: new Date(),
			applicationDecision: 'refused',
			applicationDecisionDate: new Date()
		},
		site: {
			appellantSiteAccess_appellantSiteAccessDetails: 'Access details',
			appellantSiteSafety_appellantSiteSafetyDetails: 'Safety details',
			siteAreaSquareMetres: 100,
			ownsAllLand: false,
			ownsSomeLand: true,
			knowsOtherOwners: 'yes',
			knowsAllOwners: null,
			informedOwners: true
		},
		procedurePreference: {
			appellantProcedurePreference: 'inquiry',
			appellantPreferInquiryDetails: 'details',
			appellantPreferInquiryDuration: 13,
			appellantPreferInquiryWitnesses: 3
		},
		developmentType: {
			majorMinorDevelopment: 'minor',
			typeDevelopment: 'dwellings'
		},
		planningObligation: {
			planningObligation: true,
			statusPlanningObligation: 'test'
		},
		agricultural: {
			agriculturalHolding: true,
			tenantAgriculturalHolding: true,
			otherTenantsAgriculturalHolding: true,
			informedTenantsAgriculturalHolding: true
		},
		withAgent: {
			appellantFirstName: 'Test App',
			appellantLastName: 'Testington',
			contactFirstName: 'Testy',
			contactLastName: 'McTest',
			contactPhoneNumber: '12345657',
			contactCompanyName: 'Test',
			isAppellant: false
		},
		withAppellant: {
			isAppellant: true,
			contactFirstName: 'Testy',
			contactLastName: 'McTest',
			contactCompanyName: 'Test',
			contactPhoneNumber: '12345657'
		},
		address: {
			addressLine1: 'Somewhere',
			addressLine2: 'Somewhere St',
			townCity: 'Somewhereville',
			postcode: 'SOM3 W3R',
			fieldName: 'siteAddress',
			county: 'Somewhere'
		},
		document: {
			fileName: 'img.jpg',
			originalFileName: 'oimg.jpg',
			name: 'img.jpg',
			location: '/img.jpg',
			type: 'jpg',
			storageId: '001'
		},
		linkedCase: {
			caseReference: 'case123',
			fieldName: 'linked'
		}
	};

	const expectedData = {
		common: {
			lpaCode: 'LPA_001',
			submissionId: expect.any(String),
			caseSubmissionDueDate: expect.any(String),
			caseSubmittedDate: expect.any(String),
			appellantCostsAppliedFor: true,
			advertisedAppeal: true,
			isGreenBelt: true,
			changedDevelopmentDescription: true,
			nearbyCaseReferences: ['case123'],
			neighbouringSiteAddresses: null,
			originalDevelopmentDescription: 'Original description',
			caseProcedure: 'written',
			enforcementNotice: false
		},
		application: {
			applicationDate: expect.any(String),
			applicationDecision: 'refused',
			applicationDecisionDate: expect.any(String),
			applicationReference: '123'
		},
		site: {
			siteAddressLine1: 'Somewhere',
			siteAddressLine2: 'Somewhere St',
			siteAddressTown: 'Somewhereville',
			siteAddressCounty: 'Somewhere',
			siteAddressPostcode: 'SOM3 W3R',
			siteAreaSquareMetres: 100,
			floorSpaceSquareMetres: 100,
			siteSafetyDetails: ['Safety details'],
			siteAccessDetails: ['Access details'],
			knowsAllOwners: null,
			knowsOtherOwners: 'Yes',
			ownersInformed: true,
			ownsAllLand: false,
			ownsSomeLand: true
		},
		agricultural: {
			agriculturalHolding: true,
			tenantAgriculturalHolding: true,
			otherTenantsAgriculturalHolding: true,
			informedTenantsAgriculturalHolding: true
		},
		nullAgricultural: {
			agriculturalHolding: null,
			tenantAgriculturalHolding: null,
			otherTenantsAgriculturalHolding: null,
			informedTenantsAgriculturalHolding: null
		},
		planningObligation: {
			planningObligation: true,
			statusPlanningObligation: 'test'
		},
		procedurePreference: {
			appellantProcedurePreference: 'inquiry',
			appellantProcedurePreferenceDetails: 'details',
			appellantProcedurePreferenceDuration: 13,
			appellantProcedurePreferenceWitnessCount: 3
		},
		developmentType: {
			developmentType: 'minor-dwellings'
		},
		documents: [
			{
				dateCreated: '2024-03-01T13:48:35.847Z',
				documentId: '001',
				documentType: 'appellantCostsApplication',
				documentURI: 'https://example.com',
				filename: 'img.jpg',
				mime: 'image/jpeg',
				originalFilename: 'oimg.jpg',
				size: 10293
			}
		],
		appellantUsers: [
			{
				emailAddress: expect.any(String),
				firstName: 'Testy',
				lastName: 'McTest',
				salutation: null,
				serviceUserType: 'Appellant',
				telephoneNumber: '12345657',
				organisation: 'Test'
			}
		],
		agentUsers: [
			{
				emailAddress: expect.any(String),
				firstName: 'Testy',
				lastName: 'McTest',
				salutation: null,
				serviceUserType: 'Agent',
				telephoneNumber: '12345657',
				organisation: 'Test'
			},
			{
				emailAddress: null,
				firstName: 'Test App',
				lastName: 'Testington',
				salutation: null,
				serviceUserType: 'Appellant',
				telephoneNumber: null,
				organisation: null
			}
		]
	};

	/**
	 * @type {Array<{
	 * testName: string,
	 * appeal: {id: string},
	 * submission: import('@prisma/client').AppellantSubmission,
	 * expectedData: import('@planning-inspectorate/data-model/src/schemas').AppellantSubmissionCommand
	 * }> }
	 */
	const testData = [
		{
			testName: 'HAS appellant',
			appeal: {
				id: crypto.randomUUID()
			},
			submission: {
				...submissionData.application,
				...submissionData.site,
				...submissionData.common,
				...submissionData.withAppellant,
				id: crypto.randomUUID(),
				appealTypeCode: 'HAS',
				typeOfPlanningApplication: 'householder-planning'
			},
			expectedData: {
				casedata: {
					...expectedData.application,
					...expectedData.site,
					...expectedData.common,
					caseType: 'D',
					typeOfPlanningApplication: 'householder-planning'
				},
				documents: expectedData.documents,
				users: expectedData.appellantUsers,
				emailString: 'householder'
			}
		},
		{
			testName: 'HAS agent',
			appeal: {
				id: crypto.randomUUID()
			},
			submission: {
				...submissionData.application,
				...submissionData.site,
				...submissionData.common,
				...submissionData.withAgent,
				id: crypto.randomUUID(),
				appealTypeCode: 'HAS',
				typeOfPlanningApplication: 'householder-planning'
			},
			expectedData: {
				casedata: {
					...expectedData.application,
					...expectedData.site,
					...expectedData.common,
					caseType: 'D',
					typeOfPlanningApplication: 'householder-planning'
				},
				documents: expectedData.documents,
				users: expectedData.agentUsers,
				emailString: 'householder'
			}
		},
		{
			testName: 'S78',
			appeal: {
				id: crypto.randomUUID()
			},
			submission: {
				...submissionData.application,
				...submissionData.site,
				...submissionData.common,
				...submissionData.withAgent,
				...submissionData.procedurePreference,
				...submissionData.developmentType,
				...submissionData.planningObligation,
				...submissionData.agricultural,
				id: crypto.randomUUID(),
				appealTypeCode: 'S78',
				typeOfPlanningApplication: 'reserved-matters'
			},
			expectedData: {
				casedata: {
					...expectedData.application,
					...expectedData.site,
					...expectedData.common,
					...expectedData.agricultural,
					...expectedData.planningObligation,
					...expectedData.procedurePreference,
					...expectedData.developmentType,
					caseType: 'W',
					typeOfPlanningApplication: 'reserved-matters'
				},
				documents: expectedData.documents,
				users: expectedData.agentUsers,
				emailString: 'full planning'
			}
		},
		{
			testName: 'S20',
			appeal: {
				id: crypto.randomUUID()
			},
			submission: {
				...submissionData.application,
				...submissionData.site,
				...submissionData.common,
				...submissionData.withAgent,
				...submissionData.procedurePreference,
				...submissionData.developmentType,
				...submissionData.planningObligation,
				id: crypto.randomUUID(),
				appealTypeCode: 'S20',
				typeOfPlanningApplication: 'listed-building'
			},
			expectedData: {
				casedata: {
					...expectedData.application,
					...expectedData.site,
					...expectedData.common,
					...expectedData.planningObligation,
					...expectedData.procedurePreference,
					...expectedData.developmentType,
					...expectedData.nullAgricultural,
					caseType: 'Y',
					typeOfPlanningApplication: 'listed-building'
				},
				documents: expectedData.documents,
				users: expectedData.agentUsers,
				emailString: 'listed building'
			}
		}
	];

	beforeAll(async () => {
		const user = await sqlClient.appealUser.create({
			data: { email: crypto.randomUUID() + '@example.com' }
		});
		validUser = user.id;
		validEmail = user.email;

		await sqlClient.appeal.createMany({ data: testData.map((x) => x.appeal) });
		await sqlClient.appealToUser.createMany({
			data: testData.map((x) => {
				return {
					appealId: x.appeal.id,
					userId: validUser,
					role: 'Appellant'
				};
			})
		});

		await sqlClient.appellantSubmission.createMany({
			data: testData.map((x) => {
				return {
					...x.submission,
					appealId: x.appeal.id
				};
			})
		});

		await sqlClient.submissionDocumentUpload.createMany({
			data: testData.map((x) => {
				return {
					...submissionData.document,
					appellantSubmissionId: x.submission.id
				};
			})
		});

		await sqlClient.submissionAddress.createMany({
			data: testData.map((x) => {
				return {
					...submissionData.address,
					appellantSubmissionId: x.submission.id
				};
			})
		});

		await sqlClient.submissionLinkedCase.createMany({
			data: testData.map((x) => {
				return {
					...submissionData.linkedCase,
					appellantSubmissionId: x.submission.id
				};
			})
		});
	});

	describe('/api/v2/appeal-cases/:caseReference/submit', () => {
		/**
		 * @param {string} appealType
		 */
		const expectEmails = (appealType) => {
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(2);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				validEmail,
				{
					personalisation: {
						subject: `We have received your appeal`,
						content: expect.stringContaining(
							'We will process your appeal and send a confirmation email.'
						)
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				lpaEmail,
				{
					personalisation: {
						subject: `We have received a ${appealType} appeal`,
						content: expect.stringContaining('We have received an appeal against this decision.')
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			mockNotifyClient.sendEmail.mockClear();
		};

		it.each(testData)(
			'should format %s appeal and send to service bus',
			async ({ submission, expectedData }) => {
				mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
					return async () => ({
						lastModified: '2024-03-01T14:48:35.847Z',
						createdOn: '2024-03-01T13:48:35.847Z',
						metadata: {
							mime_type: 'image/jpeg',
							size: 10293,
							document_type: 'uploadCostApplication'
						},
						_response: { request: { url: 'https://example.com' } }
					});
				});

				setCurrentSub(validUser);

				await appealsApi.post(`/api/v2/appellant-submissions/${submission.id}/submit`).expect(200);

				expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
					'appeal-fo-appellant-submission',
					[
						{
							casedata: expectedData.casedata,
							documents: expectedData.documents,
							users: expectedData.users
						}
					],
					'Create'
				);
				mockEventClient.sendEvents.mockClear();
				expectEmails(expectedData.emailString);
			}
		);

		it('404s if the appeal submission can not be found', () => {
			appealsApi
				.post('/api/v2/appellant-submissions/nope/submit')
				.expect(404)
				.end(() => {});
		});
	});
};
