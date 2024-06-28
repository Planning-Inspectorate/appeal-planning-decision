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
		})
	};
});

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

describe('events v2', () => {
	describe('create event', () => {
		it('should return 500 if unknown field supplied', async () => {
			const response = await appealsApi.put('/api/v2/events').send({
				id: 'doc_001',
				unknownField: '123'
			});

			expect(response.status).toBe(500);
		});

		it('should create an event', async () => {
			await sqlClient.appealCase.create({
				data: {
					caseReference: 'ref_e001',
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

			/** @type {import('pins-data-model/src/schemas').AppealEvent} */
			const event = {
				eventId: 'eve_001',
				caseReference: 'ref_e001',
				eventType: 'site_visit_access_required',
				eventName: 'very cool event',
				eventStatus: 'confirmed',
				isUrgent: true,
				eventPublished: true,
				eventStartDateTime: new Date('01-01-2024').toISOString(),
				eventEndDateTime: new Date('01-02-2024').toISOString(),
				notificationOfSiteVisit: new Date('01-01-2023').toISOString(),
				addressLine1: 'Somewhere',
				addressLine2: 'Somewhere St',
				addressTown: 'Somewhereville',
				addressCounty: 'Somwhereset',
				addressPostcode: 'SOM3 W3R'
			};
			const response = await appealsApi.put('/api/v2/events').send(event);

			expect(response.status).toEqual(200);

			const dbEvent = await sqlClient.event.findFirst({
				where: {
					id: 'eve_001'
				},
				include: {
					AppealCase: true
				}
			});

			expect(dbEvent).not.toBe(null);
		});

		it('should update an event', async () => {
			await sqlClient.appealCase.create({
				data: {
					caseReference: 'ref_e002',
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

			/** @type {import('pins-data-model/src/schemas').AppealEvent} */
			await sqlClient.event.create({
				data: {
					id: 'eve_002',
					caseReference: 'ref_e002',
					type: 'site_visit_access_required',
					name: 'very cool event',
					status: 'confirmed',
					isUrgent: true,
					published: true,
					startDate: new Date('01-01-2024').toISOString(),
					endDate: new Date('01-02-2024').toISOString(),
					notificationOfSiteVisit: new Date('01-01-2023').toISOString()
				}
			});

			const dbEventOriginal = await sqlClient.event.findFirst({
				where: {
					id: 'eve_002'
				},
				include: {
					AppealCase: true
				}
			});

			expect(dbEventOriginal).not.toBe(null);
			expect(dbEventOriginal?.type).toBe('site_visit_access_required');

			const event = {
				eventId: 'eve_002',
				caseReference: 'ref_001',
				eventType: 'hearing_virtual', // updating this
				eventName: 'very cool event',
				eventStatus: 'confirmed',
				isUrgent: true,
				eventPublished: true,
				eventStartDateTime: new Date('01-01-2024').toISOString(),
				eventEndDateTime: new Date('01-02-2024').toISOString(),
				notificationOfSiteVisit: new Date('01-01-2023').toISOString(),
				addressLine1: 'Somewhere',
				addressLine2: 'Somewhere St',
				addressTown: 'Somewhereville',
				addressCounty: 'Somwhereset',
				addressPostcode: 'SOM3 W3R'
			};

			const response = await appealsApi.put('/api/v2/events').send(event);

			expect(response.status).toEqual(200);

			const dbEventModified = await sqlClient.event.findFirst({
				where: {
					id: 'eve_002'
				},
				include: {
					AppealCase: true
				}
			});

			expect(dbEventModified).not.toBe(null);
			expect(dbEventModified?.type).toBe('hearing_virtual');
		});
	});
});
