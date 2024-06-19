const http = require('http');
const supertest = require('supertest');

const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');

const { isFeatureActive } = require('../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../configuration/featureFlag');
jest.mock('../../../../src/services/object-store');

// jest.setTimeout(140000);

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
				serviceUserType: 'Appellant',
				caseReference: 'ref_001'
			});

			expect(response.status).toEqual(200);

			const serviceUser = await sqlClient.serviceUser.findFirst({
				where: {
					id: 'usr_001'
				}
			});

			expect(serviceUser.serviceUserType).toBe('Appellant');
		});

		it('should create an appeal user if non exist with a matching email address', async () => {
			const response = await appealsApi.put('/api/v2/service-users').send({
				id: 'usr_002',
				serviceUserType: 'Appellant',
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
				serviceUserType: 'Appellant',
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
					caseReference: 'ref_004',
					LPACode: 'lpa_001',
					LPAName: 'test',
					appealTypeCode: '1001',
					appealTypeName: 'HAS',
					decision: 'refused',
					originalCaseDecisionDate: new Date().toISOString(),
					costsAppliedForIndicator: false,
					LPAApplicationReference: '010101',
					siteAddressLine1: 'address',
					siteAddressPostcode: 'POST CODE',
					Appeal: {
						create: {}
					}
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
				serviceUserType: 'Appellant',
				emailAddress: 'newnewhuman@example.com',
				caseReference: 'ref_004'
			});

			expect(response.status).toEqual(200);

			const appealToUser = await sqlClient.appealToUser.findFirst({
				where: { appealId: appealCase.Appeal.id }
			});

			expect(appealToUser).not.toBe(null);
			expect(appealToUser.role).toBe('appellant');
		});
	});

	describe('update user', () => {
		it('should update service users', async () => {
			await sqlClient.serviceUser.create({
				data: {
					id: 'usr_005',
					serviceUserType: 'Appellant',
					caseReference: '000001',
					emailAddress: 'name@example.com'
				}
			});

			const response = await appealsApi.put('/api/v2/service-users').send({
				id: 'usr_005',
				serviceUserType: 'Appellant',
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
	});
});
