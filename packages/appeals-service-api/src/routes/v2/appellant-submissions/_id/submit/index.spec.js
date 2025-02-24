const supertest = require('supertest');
const http = require('http');
const app = require('../../../../../app');
const { sendEvents } = require('../../../../../../src/infrastructure/event-client');
const { createPrismaClient } = require('#db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const crypto = require('crypto');

const server = http.createServer(app);
const appealsApi = supertest(server);
let validUser;
const sqlClient = createPrismaClient();

/**
 * @typedef {import('../appellant-submission').AppellantSubmission} AppellantSubmission
 */

jest.mock('../../../../../../src/configuration/featureFlag', () => ({
	isFeatureActive() {
		return true;
	}
}));
jest.mock('../../../../../../src/infrastructure/event-client', () => ({
	sendEvents: jest.fn()
}));
jest.mock('../../../../../../src/services/object-store');
jest.mock('../../../../../../src/services/lpa.service', () => {
	class LpaService {
		getLpaByCode() {
			return {
				getLpaCode: () => 'LPA_001'
			};
		}
	}
	return LpaService;
});
jest.mock('#lib/notify');
jest.mock('express-oauth2-jwt-bearer', () => {
	let currentSub = '';

	return {
		auth: jest.fn(() => {
			return (req, _res, next) => {
				req.auth = {
					payload: {
						sub: currentSub
					}
				};
				next();
			};
		}),
		setCurrentSub: (newSub) => {
			currentSub = newSub;
		}
	};
});
jest.mock('express-oauth2-jwt-bearer');

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
	await seedStaticData(sqlClient);

	const user = await sqlClient.appealUser.create({
		data: { email: crypto.randomUUID() + '@example.com' }
	});
	validUser = user.id;

	const appeals = [
		{ id: 'f70dd26f-3776-4685-a79c-a81dbe8790b6' },
		{ id: '29eee0be-d395-4039-a277-7435e7ab0b66' },
		{ id: '7e791a1c-e0ca-4089-9fce-bdef405b9ce1' }
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

afterAll(async () => {
	await sqlClient.$disconnect();
});

describe('/api/v2/appeal-cases/:caseReference/submit', () => {
	it('should format appeals and send to service bus', async () => {
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		await appealsApi.post(`/api/v2/appellant-submissions/${appeal1.id}/submit`).expect(200);

		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-appellant-submission',
			[formattedHAS1],
			'Create'
		);

		await appealsApi.post(`/api/v2/appellant-submissions/${appeal2.id}/submit`).expect(200);

		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-appellant-submission',
			[formattedHAS2],
			'Create'
		);

		await appealsApi.post(`/api/v2/appellant-submissions/${appeal3.id}/submit`).expect(200);

		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-appellant-submission',
			[formattedS78],
			'Create'
		);
	});

	it('404s if the appeal submission can not be found', () => {
		appealsApi
			.post('/api/v2/appellant-submissions/nope/submit')
			.expect(404)
			.end(() => {});
	});
});
