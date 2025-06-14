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

	/** @type {import('pins-data-model/src/schemas').AppellantSubmissionCommand} */
	const formattedHAS1 = {
		casedata: {
			submissionId: expect.any(String),
			advertisedAppeal: null,
			appellantCostsAppliedFor: false,
			applicationDate: '2024-01-01T00:00:00.000Z',
			applicationDecision: 'refused',
			applicationDecisionDate: '2024-01-01T00:00:00.000Z',
			applicationReference: '123',
			caseProcedure: 'written',
			caseSubmissionDueDate: '2024-03-25T23:59:59.999Z',
			caseSubmittedDate: expect.any(String), // it's based on a new Date() so we can't get it exactly
			caseType: 'D',
			changedDevelopmentDescription: false,
			enforcementNotice: false,
			floorSpaceSquareMetres: 22,
			knowsAllOwners: null,
			knowsOtherOwners: 'Yes',
			lpaCode: 'LPA_001',
			nearbyCaseReferences: [],
			neighbouringSiteAddresses: null,
			originalDevelopmentDescription: 'A test description',
			ownersInformed: null,
			ownsAllLand: true,
			ownsSomeLand: null,
			siteAccessDetails: ['Come and see'],
			siteAddressCounty: 'Somewhere',
			siteAddressLine1: 'Somewhere',
			siteAddressLine2: 'Somewhere St',
			siteAddressPostcode: 'SOM3 W3R',
			siteAddressTown: 'Somewhereville',
			siteAreaSquareMetres: 22,
			siteSafetyDetails: ["It's dangerous"],
			isGreenBelt: false,
			typeOfPlanningApplication: null
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
		users: [
			{
				emailAddress: expect.any(String),
				firstName: 'Testy',
				lastName: 'McTest',
				salutation: null,
				serviceUserType: 'Appellant',
				telephoneNumber: '12345657',
				organisation: 'Test'
			}
		]
	};

	/** @type {import('pins-data-model/src/schemas').AppellantSubmissionCommand} */
	const formattedHAS2 = {
		casedata: {
			submissionId: expect.any(String),
			advertisedAppeal: null,
			appellantCostsAppliedFor: false,
			applicationDate: '2024-01-01T00:00:00.000Z',
			applicationDecision: 'refused',
			applicationDecisionDate: '2024-01-01T00:00:00.000Z',
			applicationReference: '234',
			caseProcedure: 'written',
			caseSubmissionDueDate: '2024-03-25T23:59:59.999Z',
			caseSubmittedDate: expect.any(String), // it's based on a new Date() so we can't get it exactly
			caseType: 'D',
			changedDevelopmentDescription: false,
			enforcementNotice: false,
			floorSpaceSquareMetres: 25,
			knowsAllOwners: null,
			knowsOtherOwners: null,
			lpaCode: 'LPA_001',
			nearbyCaseReferences: [],
			neighbouringSiteAddresses: null,
			originalDevelopmentDescription: 'A test description',
			ownersInformed: null,
			ownsAllLand: true,
			ownsSomeLand: null,
			siteAccessDetails: ['Come and see'],
			siteAddressCounty: 'Somewhere',
			siteAddressLine1: 'Somewhere',
			siteAddressLine2: 'Somewhere St',
			siteAddressPostcode: 'SOM3 W3R',
			siteAddressTown: 'Somewhereville',
			siteAreaSquareMetres: 25,
			siteSafetyDetails: ["It's dangerous"],
			isGreenBelt: false,
			typeOfPlanningApplication: null
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
		users: [
			{
				emailAddress: expect.any(String),
				firstName: 'Testy',
				lastName: 'McTest',
				salutation: null,
				serviceUserType: 'Agent',
				telephoneNumber: '12345657',
				organisation: 'Test Agents'
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

	/** @type {import('pins-data-model/src/schemas').AppellantSubmissionCommand} */
	const formattedS78 = {
		casedata: {
			submissionId: expect.any(String),
			advertisedAppeal: true,
			appellantCostsAppliedFor: true,
			applicationDate: expect.any(String),
			applicationDecision: 'granted',
			applicationDecisionDate: expect.any(String),
			applicationReference: '567',
			caseProcedure: 'written',
			caseSubmissionDueDate: expect.any(String),
			caseSubmittedDate: expect.any(String), // it's based on a new Date() so we can't get it exactly
			caseType: 'W',
			changedDevelopmentDescription: true,
			enforcementNotice: false,
			floorSpaceSquareMetres: 100,
			knowsAllOwners: 'No',
			knowsOtherOwners: 'Yes',
			lpaCode: 'LPA_001',
			nearbyCaseReferences: ['case123'],
			neighbouringSiteAddresses: null,
			originalDevelopmentDescription: 'Original description',
			ownersInformed: true,
			ownsAllLand: true,
			ownsSomeLand: false,
			siteAccessDetails: ['Access details'],
			siteAddressCounty: 'Somewhere',
			siteAddressLine1: 'Somewhere',
			siteAddressLine2: 'Somewhere St',
			siteAddressPostcode: 'SOM3 W3R',
			siteAddressTown: 'Somewhereville',
			siteAreaSquareMetres: 100,
			siteSafetyDetails: ['Safety details'],
			isGreenBelt: true,

			agriculturalHolding: true,
			tenantAgriculturalHolding: true,
			otherTenantsAgriculturalHolding: true,
			informedTenantsAgriculturalHolding: true,

			planningObligation: true,
			statusPlanningObligation: 'test',

			appellantProcedurePreference: 'inquiry',
			appellantProcedurePreferenceDetails: 'details',
			appellantProcedurePreferenceDuration: 13,
			appellantProcedurePreferenceWitnessCount: 3,
			developmentType: null,
			typeOfPlanningApplication: null
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
		users: [
			{
				emailAddress: expect.any(String),
				firstName: 'Testy',
				lastName: 'McTest',
				salutation: null,
				serviceUserType: 'Agent',
				telephoneNumber: '12345657',
				organisation: null
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

	let appeal1;
	let appeal2;
	let appeal3;

	beforeAll(async () => {
		const user = await sqlClient.appealUser.create({
			data: { email: crypto.randomUUID() + '@example.com' }
		});
		validUser = user.id;
		validEmail = user.email;

		const appeals = [
			{ id: crypto.randomUUID() },
			{ id: crypto.randomUUID() },
			{ id: crypto.randomUUID() }
		];
		await sqlClient.appeal.createMany({ data: appeals });

		await sqlClient.appealToUser.createMany({
			data: [
				{
					appealId: appeals[0].id,
					userId: user.id,
					role: 'Appellant'
				},
				{
					appealId: appeals[1].id,
					userId: user.id,
					role: 'Appellant'
				},
				{
					appealId: appeals[2].id,
					userId: user.id,
					role: 'Appellant'
				}
			]
		});

		await sqlClient.appellantSubmission.createMany({
			data: [
				{
					appealId: appeals[0].id,
					LPACode: 'LPA_001',
					appealTypeCode: 'HAS',
					applicationDecisionDate: new Date('2024-01-01'),
					applicationDecision: 'refused',
					onApplicationDate: new Date('2024-01-01'),
					isAppellant: true,
					contactFirstName: 'Testy',
					contactLastName: 'McTest',
					contactCompanyName: 'Test',
					ownsAllLand: true,
					appellantGreenBelt: false,
					updateDevelopmentDescription: false,
					knowsOtherOwners: 'yes',
					costApplication: false,
					appellantSiteSafety: 'yes',
					appellantSiteSafety_appellantSiteSafetyDetails: "It's dangerous",
					appellantSiteAccess: 'yes',
					appellantSiteAccess_appellantSiteAccessDetails: 'Come and see',
					applicationReference: '123',
					developmentDescriptionOriginal: 'A test description',
					appellantLinkedCaseReference: 'no',
					contactPhoneNumber: '12345657',
					siteAreaSquareMetres: 22,
					appellantLinkedCaseAdd: false,
					appellantLinkedCase: false,
					uploadOriginalApplicationForm: true,
					uploadApplicationDecisionLetter: false,
					uploadAppellantStatement: false,
					uploadCostApplication: false,
					uploadChangeOfDescriptionEvidence: false
				},
				{
					appealId: appeals[1].id,
					LPACode: 'LPA_002',
					appealTypeCode: 'HAS',
					applicationDecisionDate: new Date('2024-01-01'),
					applicationDecision: 'refused',
					onApplicationDate: new Date('2024-01-01'),
					isAppellant: false,
					appellantFirstName: 'Test App',
					appellantLastName: 'Testington',
					contactFirstName: 'Testy',
					contactLastName: 'McTest',
					contactCompanyName: 'Test Agents',
					ownsAllLand: true,
					appellantGreenBelt: false,
					updateDevelopmentDescription: false,
					costApplication: false,
					appellantSiteSafety: 'yes',
					appellantSiteSafety_appellantSiteSafetyDetails: "It's dangerous",
					appellantSiteAccess: 'yes',
					appellantSiteAccess_appellantSiteAccessDetails: 'Come and see',
					applicationReference: '234',
					developmentDescriptionOriginal: 'A test description',
					appellantLinkedCaseReference: 'no',
					contactPhoneNumber: '12345657',
					siteAreaSquareMetres: 25,
					appellantLinkedCaseAdd: false,
					appellantLinkedCase: false,
					uploadOriginalApplicationForm: true,
					uploadApplicationDecisionLetter: false,
					uploadAppellantStatement: false,
					uploadCostApplication: false,
					uploadChangeOfDescriptionEvidence: false
				},
				{
					appealId: appeals[2].id,
					LPACode: '123',
					appealTypeCode: 'S78',
					applicationReference: '567',
					onApplicationDate: new Date(),
					applicationDecision: 'granted',
					applicationDecisionDate: new Date(),
					appellantSiteAccess_appellantSiteAccessDetails: 'Access details',
					appellantSiteSafety_appellantSiteSafetyDetails: 'Safety details',
					appellantGreenBelt: true,
					siteAreaSquareMetres: 100,
					ownsAllLand: true,
					ownsSomeLand: false,
					knowsOtherOwners: 'yes',
					knowsAllOwners: 'no',
					advertisedAppeal: true,
					informedOwners: true,
					developmentDescriptionOriginal: 'Original description',
					updateDevelopmentDescription: true,
					appellantFirstName: 'Test App',
					appellantLastName: 'Testington',
					contactFirstName: 'Testy',
					contactLastName: 'McTest',
					contactPhoneNumber: '12345657',
					costApplication: true,
					isAppellant: false,
					agriculturalHolding: true,
					tenantAgriculturalHolding: true,
					otherTenantsAgriculturalHolding: true,
					informedTenantsAgriculturalHolding: true,
					planningObligation: true,
					statusPlanningObligation: 'test',
					appellantProcedurePreference: 'inquiry',
					appellantPreferInquiryDetails: 'details',
					appellantPreferInquiryDuration: 13,
					appellantPreferInquiryWitnesses: 3
				}
			]
		});

		const submissions = await sqlClient.appellantSubmission.findMany({
			where: {
				appealId: {
					in: appeals.map((a) => a.id)
				}
			},
			select: {
				id: true,
				appealId: true
			}
		});

		appeal1 = submissions.filter((x) => x.appealId === appeals[0].id)[0];
		appeal2 = submissions.filter((x) => x.appealId === appeals[1].id)[0];
		appeal3 = submissions.filter((x) => x.appealId === appeals[2].id)[0];

		await sqlClient.submissionDocumentUpload.createMany({
			data: [
				{
					fileName: 'img.jpg',
					originalFileName: 'oimg.jpg',
					appellantSubmissionId: appeal1.id,
					name: 'img.jpg',
					location: '/img.jpg',
					type: 'jpg',
					storageId: '001'
				},
				{
					fileName: 'img.jpg',
					originalFileName: 'oimg.jpg',
					appellantSubmissionId: appeal2.id,
					name: 'img.jpg',
					location: '/img.jpg',
					type: 'jpg',
					storageId: '001'
				},
				{
					fileName: 'img.jpg',
					originalFileName: 'oimg.jpg',
					appellantSubmissionId: appeal3.id,
					name: 'img.jpg',
					location: '/img.jpg',
					type: 'jpg',
					storageId: '001'
				}
			]
		});

		await sqlClient.submissionAddress.createMany({
			data: [
				{
					appellantSubmissionId: appeal1.id,
					addressLine1: 'Somewhere',
					addressLine2: 'Somewhere St',
					townCity: 'Somewhereville',
					postcode: 'SOM3 W3R',
					fieldName: 'siteAddress',
					county: 'Somewhere'
				},
				{
					appellantSubmissionId: appeal2.id,
					addressLine1: 'Somewhere',
					addressLine2: 'Somewhere St',
					townCity: 'Somewhereville',
					postcode: 'SOM3 W3R',
					fieldName: 'siteAddress',
					county: 'Somewhere'
				},
				{
					appellantSubmissionId: appeal3.id,
					addressLine1: 'Somewhere',
					addressLine2: 'Somewhere St',
					townCity: 'Somewhereville',
					postcode: 'SOM3 W3R',
					fieldName: 'siteAddress',
					county: 'Somewhere'
				}
			]
		});

		await sqlClient.submissionLinkedCase.createMany({
			data: [
				{
					caseReference: 'case123',
					fieldName: 'linked',
					appellantSubmissionId: appeal3.id
				}
			]
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

		it('should format appeals and send to service bus', async () => {
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

			await appealsApi.post(`/api/v2/appellant-submissions/${appeal1.id}/submit`).expect(200);

			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-appellant-submission',
				[formattedHAS1],
				'Create'
			);
			mockEventClient.sendEvents.mockClear();
			expectEmails('householder planning');

			await appealsApi.post(`/api/v2/appellant-submissions/${appeal2.id}/submit`).expect(200);

			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-appellant-submission',
				[formattedHAS2],
				'Create'
			);
			mockEventClient.sendEvents.mockClear();
			expectEmails('householder planning');

			await appealsApi.post(`/api/v2/appellant-submissions/${appeal3.id}/submit`).expect(200);

			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-appellant-submission',
				[formattedS78],
				'Create'
			);
			mockEventClient.sendEvents.mockClear();
			expectEmails('full planning');
		});

		it('404s if the appeal submission can not be found', () => {
			appealsApi
				.post('/api/v2/appellant-submissions/nope/submit')
				.expect(404)
				.end(() => {});
		});
	});
};
