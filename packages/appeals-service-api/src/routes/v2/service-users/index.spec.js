const http = require('http');
const supertest = require('supertest');

const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const {
	createTestAppealCase
} = require('../../../../__tests__/developer/fixtures/appeals-case-data');

const { isFeatureActive } = require('../../../configuration/featureFlag');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { SERVICE_USER_TYPE } = require('pins-data-model');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../configuration/featureFlag');

jest.setTimeout(10000);

beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE ////
	/////////////////////////////
	sqlClient = createPrismaClient();

	/////////////////////
	///// SETUP APP ////
	///////////////////
	let server = http.createServer(app);
	appealsApi = supertest(server);

	await seedStaticData(sqlClient);
});

beforeEach(async () => {
	// turn all feature flags on
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

afterEach(async () => {
	jest.clearAllMocks();
});

afterAll(async () => {
	await sqlClient.$disconnect();
});

describe('service users v2', () => {
	describe('create user', () => {
		it('should return 500 if unknown field supplied', async () => {
			const response = await appealsApi.put('/api/v2/service-users').send({
				id: 'usr_001',
				unknownField: '123'
			});

			expect(response.status).toBe(500);
		});

		it('should create a service user', async () => {
			const response = await appealsApi.put('/api/v2/service-users').send({
				id: 'usr_001',
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: 'ref_001'
			});

			expect(response.status).toEqual(200);

			const serviceUser = await sqlClient.serviceUser.findFirst({
				where: {
					id: 'usr_001',
					caseReference: 'ref_001'
				}
			});

			expect(serviceUser.serviceUserType).toBe(SERVICE_USER_TYPE.APPELLANT);
		});

		it('should create an appeal user if non exist with a matching email address', async () => {
			const response = await appealsApi.put('/api/v2/service-users').send({
				id: 'usr_002',
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: 'ref_002',
				emailAddress: 'newhuman@example.com'
			});

			expect(response.status).toEqual(200);

			const appealUser = await sqlClient.appealUser.findFirst({
				where: {
					email: 'newhuman@example.com'
				}
			});

			expect(appealUser.serviceUserId).toBe('usr_002');
		});

		it('should update an appeal user if one exists with a matching email address', async () => {
			await sqlClient.appealUser.create({
				data: {
					email: 'existinghuman@example.com'
				}
			});

			const response = await appealsApi.put('/api/v2/service-users').send({
				id: 'usr_003',
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: 'ref_003',
				emailAddress: 'existinghuman@example.com'
			});

			expect(response.status).toEqual(200);

			const appealUser = await sqlClient.appealUser.findFirst({
				where: {
					email: 'existinghuman@example.com'
				}
			});

			expect(appealUser.serviceUserId).toBe('usr_003');
		});

		it('should add an appealToUser relation if a matching appeal exists', async () => {
			await sqlClient.appealCase.create({
				data: {
					Appeal: { create: {} },
					...createTestAppealCase('ref_004', 'HAS', 'lpa_001')
				}
			});

			const appealCase = await sqlClient.appealCase.findFirst({
				where: {
					caseReference: 'ref_004'
				},
				select: {
					Appeal: {
						select: {
							id: true
						}
					}
				}
			});

			if (!appealCase?.Appeal?.id)
				throw new Error('something went wrong when creating test appealCase');

			const response = await appealsApi.put('/api/v2/service-users').send({
				id: 'usr_004',
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				emailAddress: 'newnewhuman@example.com',
				caseReference: 'ref_004'
			});

			expect(response.status).toEqual(200);

			const appealToUser = await sqlClient.appealToUser.findFirst({
				where: { appealId: appealCase.Appeal.id }
			});

			expect(appealToUser).not.toBe(null);
			expect(appealToUser.role).toBe(APPEAL_USER_ROLES.APPELLANT);
		});
	});

	describe('update user', () => {
		it('should update service users', async () => {
			await sqlClient.serviceUser.create({
				data: {
					id: 'usr_005',
					serviceUserType: SERVICE_USER_TYPE.APPELLANT,
					caseReference: '000001',
					emailAddress: 'name@example.com'
				}
			});

			const response = await appealsApi.put('/api/v2/service-users').send({
				id: 'usr_005',
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: '000001',
				emailAddress: 'name@example.com',
				postcode: 'POST CODE'
			});

			expect(response.status).toEqual(200);

			const serviceUser = await sqlClient.serviceUser.findFirst({
				where: {
					id: 'usr_005'
				}
			});

			expect(serviceUser?.postcode).toBe('POST CODE');
		});

		it('should update an existing appealToUser relation', async () => {
			const userId = 'usr_006';
			const email = `${userId}@example.com`;
			const caseRef = 'ref_006';

			await sqlClient.serviceUser.create({
				data: {
					id: userId,
					serviceUserType: SERVICE_USER_TYPE.APPELLANT,
					caseReference: caseRef,
					emailAddress: email
				}
			});

			const appealCase = await sqlClient.appealCase.create({
				data: {
					Appeal: { create: {} },
					...createTestAppealCase(caseRef, 'HAS', 'lpa_001')
				}
			});

			const appealUser = await sqlClient.appealUser.create({
				data: {
					email: email,
					serviceUserId: userId
				}
			});

			await sqlClient.appealToUser.create({
				data: {
					appealId: appealCase.appealId,
					userId: appealUser.id,
					role: APPEAL_USER_ROLES.AGENT
				}
			});

			const response = await appealsApi.put('/api/v2/service-users').send({
				id: userId,
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: caseRef,
				emailAddress: email
			});

			expect(response.status).toEqual(200);

			const relations = await sqlClient.appealToUser.findMany({
				where: {
					appealId: appealCase.appealId,
					userId: appealUser.id
				}
			});

			expect(relations.length).toBe(1);
			expect(relations[0].role).toBe(APPEAL_USER_ROLES.APPELLANT);
		});

		it('should add a rule6 with same user to appealToUser', async () => {
			const userId = 'usr_007';
			const email = `${userId}@example.com`;
			const caseRef = 'ref_007';

			await sqlClient.serviceUser.create({
				data: {
					id: userId,
					serviceUserType: SERVICE_USER_TYPE.AGENT,
					caseReference: caseRef,
					emailAddress: email
				}
			});

			const appealCase = await sqlClient.appealCase.create({
				data: {
					Appeal: { create: {} },
					...createTestAppealCase(caseRef, 'HAS', 'lpa_001')
				}
			});

			const appealUser = await sqlClient.appealUser.create({
				data: {
					email: email,
					serviceUserId: userId
				}
			});

			await sqlClient.appealToUser.create({
				data: {
					appealId: appealCase.appealId,
					userId: appealUser.id,
					role: APPEAL_USER_ROLES.AGENT
				}
			});

			const response = await appealsApi.put('/api/v2/service-users').send({
				id: userId,
				serviceUserType: APPEAL_USER_ROLES.RULE_6_PARTY,
				caseReference: caseRef,
				emailAddress: email
			});

			expect(response.status).toEqual(200);

			const relations = await sqlClient.appealToUser.findMany({
				where: {
					appealId: appealCase.appealId
				}
			});

			expect(relations.length).toBe(2);
			expect(relations.some((x) => x.role === APPEAL_USER_ROLES.AGENT)).toBe(true);
			expect(relations.some((x) => x.role === APPEAL_USER_ROLES.RULE_6_PARTY)).toBe(true);
		});
	});
});
