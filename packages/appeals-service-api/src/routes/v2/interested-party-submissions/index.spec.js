const supertest = require('supertest');
const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { sendEvents } = require('../../../../src/infrastructure/event-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../__tests__/developer/fixtures/appeals-case-data');
const { isFeatureActive } = require('../../../configuration/featureFlag');
/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;
let validUser;
const validLpa = 'Q9999';
jest.mock('../../../configuration/featureFlag');
jest.mock('../../../../src/services/object-store');
jest.mock('../../../../src/infrastructure/event-client', () => ({
	sendEvents: jest.fn()
}));
jest.setTimeout(30000);
beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE ////
	/////////////////////////////
	sqlClient = createPrismaClient();
	/////////////////////
	///// SETUP APP ////
	///////////////////
	appealsApi = supertest(app);
	await seedStaticData(sqlClient);
	const user = await sqlClient.appealUser.create({
		data: {
			email: crypto.randomUUID() + '@example.com'
		}
	});
	validUser = user.id;
});
const expectedNewIPUser = {
	salutation: null,
	firstName: 'Testy',
	lastName: 'McTest',
	emailAddress: 'testEmail@test.com',
	serviceUserType: 'InterestedParty',
	telephoneNumber: null,
	organisation: null
};
jest.mock('../../../services/back-office-v2/formatters/utils', () => ({
	getDocuments: jest.fn(() => []),
	createInterestedPartyNewUser: jest.fn(() => expectedNewIPUser)
}));
const utils = require('../../../services/back-office-v2/formatters/utils');
beforeEach(async () => {
	isFeatureActive.mockImplementation(() => {
		return true;
	});
	utils.getDocuments.mockReset();
	utils.createInterestedPartyNewUser.mockReset();
});
afterEach(async () => {
	jest.clearAllMocks();
});
afterAll(async () => {
	await sqlClient.$disconnect();
});
/**
 * @returns {Promise<string|undefined>}
 */
const createAppeal = async (caseRef) => {
	const appeal = await sqlClient.appeal.create({
		include: {
			AppealCase: true
		},
		data: {
			Users: {
				create: {
					userId: validUser,
					role: APPEAL_USER_ROLES.APPELLANT
				}
			},
			AppealCase: {
				create: {
					...createTestAppealCase(caseRef, 'S78', validLpa),
					finalCommentsDueDate: new Date().toISOString()
				}
			}
		}
	});
	return appeal.AppealCase?.caseReference;
};
const testIPSubmissionData = {
	caseReference: '808',
	firstName: 'Testy',
	lastName: 'McTest',
	emailAddress: 'testEmail@test.com',
	comments: 'Test comment'
};
const formattedComment1 = {
	caseReference: '808',
	representation: 'Test comment',
	representationSubmittedDate: expect.any(String),
	representationType: 'comment',
	documents: [],
	newUser: expectedNewIPUser
};

describe('/api/v2/interested-party-submissions', () => {
	it('creates an interested party submission and formats that submission', async () => {
		utils.getDocuments.mockReturnValue([]);
		utils.createInterestedPartyNewUser.mockReturnValue(expectedNewIPUser);
		await createAppeal('808');
		const response = await appealsApi
			.post(`/api/v2/interested-party-submissions`)
			.send(testIPSubmissionData);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('caseReference', testIPSubmissionData.caseReference);
		expect(response.body).toHaveProperty('firstName', testIPSubmissionData.firstName);
		expect(response.body).toHaveProperty('lastName', testIPSubmissionData.lastName);
		expect(response.body).toHaveProperty('emailAddress', testIPSubmissionData.emailAddress);
		expect(response.body).toHaveProperty('comments', testIPSubmissionData.comments);

		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedComment1],
			'Create'
		);
	});
});
