const supertest = require('supertest');
const http = require('http');
const app = require('../../../../../app');
const { sendEvents } = require('../../../../../../src/infrastructure/event-client');
const { createPrismaClient } = require('#db-client');
const crypto = require('crypto');

const server = http.createServer(app);
const appealsApi = supertest(server);
let validUser;
const sqlClient = createPrismaClient();

/**
 * @typedef {import('../appellant-submission').AppellantSubmission} AppellantSubmission
 */

jest.mock('../service', () => ({
	/**
	 * @param {{appellantSubmissionId: string}} args
	 * @returns {Partial<AppellantSubmission> | null}
	 */
	getForBOSubmission: ({ appellantSubmissionId }) => {
		switch (appellantSubmissionId) {
			case '001':
				return {
					appealId: 'f70dd26f-3776-4685-a79c-a81dbe8790b6',
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
					// @ts-ignore
					siteAreaSquareMetres: 22,
					appellantLinkedCaseAdd: false,
					appellantLinkedCase: false,
					SubmissionLinkedCase: [],
					uploadOriginalApplicationForm: true,
					uploadApplicationDecisionLetter: false,
					uploadAppellantStatement: false,
					uploadCostApplication: false,
					uploadChangeOfDescriptionEvidence: false,
					SubmissionDocumentUpload: [
						{
							id: 'img_001',
							fileName: 'img.jpg',
							originalFileName: 'oimg.jpg',
							appellantSubmissionId: '001',
							name: 'img.jpg',
							location: '/img.jpg',
							type: 'jpg',
							storageId: '001',
							questionnaireId: '001'
						}
					],
					siteAddress: true,
					SubmissionAddress: [
						{
							id: 'add_001',
							appellantSubmissionId: '001',
							addressLine1: 'Somewhere',
							addressLine2: 'Somewhere St',
							townCity: 'Somewhereville',
							postcode: 'SOM3 W3R',
							fieldName: 'siteAddress',
							questionnaireId: '001',
							county: 'Somewhere'
						}
					],
					SubmissionListedBuilding: [],
					Appeal: {
						Users: [
							{
								AppealUser: {
									email: 'test@test.com'
								}
							}
						]
					}
				};
			case '002':
				return {
					appealId: '29eee0be-d395-4039-a277-7435e7ab0b66',
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
					// @ts-ignore
					siteAreaSquareMetres: 25,
					appellantLinkedCaseAdd: false,
					appellantLinkedCase: false,
					SubmissionLinkedCase: [],
					uploadOriginalApplicationForm: true,
					uploadApplicationDecisionLetter: false,
					uploadAppellantStatement: false,
					uploadCostApplication: false,
					uploadChangeOfDescriptionEvidence: false,
					SubmissionDocumentUpload: [
						{
							id: 'img_002',
							fileName: 'img.jpg',
							originalFileName: 'oimg.jpg',
							appellantSubmissionId: '002',
							name: 'img.jpg',
							location: '/img.jpg',
							type: 'jpg',
							storageId: '001',
							questionnaireId: '002'
						}
					],
					siteAddress: true,
					SubmissionAddress: [
						{
							id: 'add_002',
							appellantSubmissionId: '002',
							addressLine1: 'Somewhere',
							addressLine2: 'Somewhere St',
							townCity: 'Somewhereville',
							postcode: 'SOM3 W3R',
							fieldName: 'siteAddress',
							questionnaireId: '002',
							county: 'Somewhere'
						}
					],
					SubmissionListedBuilding: [],
					Appeal: {
						Users: [
							{
								AppealUser: {
									email: 'test@test.com'
								}
							}
						]
					}
				};
			default:
				return null;
		}
	},
	markAppealAsSubmitted: jest.fn()
}));

jest.mock('../../../../../../src/configuration/featureFlag', () => ({
	isFeatureActive() {
		return true;
	}
}));

jest.mock('../../../../../../src/infrastructure/event-client', () => ({
	sendEvents: jest.fn()
}));

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
		submissionId: 'f70dd26f-3776-4685-a79c-a81dbe8790b6',
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
		isGreenBelt: false
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
			emailAddress: 'test@test.com',
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
		submissionId: '29eee0be-d395-4039-a277-7435e7ab0b66',
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
		isGreenBelt: false
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
			emailAddress: 'test@test.com',
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

beforeAll(async () => {
	const user = await sqlClient.appealUser.create({
		data: { email: crypto.randomUUID() + '@example.com' }
	});
	validUser = user.id;
});

describe('/api/v2/appeal-cases/:caseReference/submit', () => {
	it.each([
		['HAS', '001', formattedHAS1],
		['HAS', '002', formattedHAS2]
	])('Formats %s appeal submission then sends it to back office', async (_, id, expectation) => {
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		await appealsApi.post(`/api/v2/appellant-submissions/${id}/submit`).expect(200);

		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-appellant-submission',
			[expectation],
			'Create'
		);
	});

	it('404s if the appeal submission can not be found', () => {
		appealsApi
			.post('/api/v2/appellant-submissions/003/submit')
			.expect(404)
			.end(() => {});
	});
});
