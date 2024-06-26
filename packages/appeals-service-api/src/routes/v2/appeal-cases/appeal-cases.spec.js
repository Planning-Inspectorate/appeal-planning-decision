const http = require('http');
const supertest = require('supertest');
const { buildQueryString } = require('@pins/common/src/client/utils');
const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');

const { isFeatureActive } = require('../../../configuration/featureFlag');
const { blobMetaGetter } = require('../../../../src/services/object-store');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../configuration/featureFlag');
jest.mock('../../../../src/services/object-store');
jest.mock('express-oauth2-jwt-bearer', () => {
	let currentSub = 'abc';

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

blobMetaGetter;

jest.setTimeout(10000);

/** @type {string[]} */
let appealCaseIds = [];

const now = new Date();
let caseRef = 5555555;

/**
 *
 * @param {string} lpaCode
 * @param {string} postCode
 * @param {boolean} casePublished
 * @returns {import('@prisma/client').Prisma.AppealCaseCreateInput}
 */
function appealCase(lpaCode, postCode, casePublished = true) {
	caseRef++;
	return {
		Appeal: { create: {} },
		caseReference: caseRef.toString(),
		LPAApplicationReference: caseRef + 'APP',
		originalCaseDecisionDate: now,
		appealTypeCode: 'HAS',
		appealTypeName: 'Householder',
		decision: 'refused',
		siteAddressLine1: '123 Fake Street',
		siteAddressTown: 'Testville',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: postCode,
		costsAppliedForIndicator: false,
		LPACode: lpaCode,
		LPAName: lpaCode,
		casePublished
	};
}
const postCodes = ['BS1 6PM', 'BS1 6AA', 'BS1 6PO', 'BS1 6PP'];
const LPAs = ['LPA1', 'LPA1a', 'LPA2', 'LPA2a', 'LPA3', 'LPA3a'];

/** @type {import('@prisma/client').Prisma.AppealCaseCreateInput[]} */
const publishedTestCases = [
	appealCase('LPA1', 'BS1 6PM'),
	appealCase('LPA1', 'BS1 6AA'),
	appealCase('LPA1', 'BS1 6PO'),
	appealCase('LPA1a', 'BS1 6PP'),
	appealCase('LPA1', 'BS1 6PP'),
	appealCase('LPA2', 'BS1 6PM'),
	appealCase('LPA2a', 'BS1 6AA'),
	appealCase('LPA2', 'BS1 6AA'),
	appealCase('LPA3', 'BS1 6PO'),
	appealCase('LPA3a', 'BS1 6PO')
];

/** @type {import('@prisma/client').Prisma.AppealCaseCreateInput[]} */
const notPublishedCases = [
	appealCase('LPA1', 'BS1 6PM', false),
	appealCase('LPA1', 'BS1 6AA', false),
	appealCase('LPA1', 'BS1 6PO', false),
	appealCase('LPA1a', 'BS1 6PP', false),
	appealCase('LPA1', 'BS1 6PP', false),
	appealCase('LPA2', 'BS1 6PM', false),
	appealCase('LPA2a', 'BS1 6AA', false),
	appealCase('LPA2', 'BS1 6AA', false),
	appealCase('LPA3', 'BS1 6PO', false),
	appealCase('LPA3a', 'BS1 6PO', false)
];

/** @type {import('@prisma/client').Prisma.AppealCaseCreateInput[]} */
const testCases = [...publishedTestCases, ...notPublishedCases];

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
	await _clearSqlData();
	await sqlClient.$disconnect();
});

describe('appeal-cases', () => {
	describe('list', () => {
		describe('validate request', () => {
			const tests = [
				{
					name: 'empty',
					params: {},
					want: {
						status: 400,
						errors: ['lpa-code || postcode is required']
					}
				},
				{
					name: 'invalid',
					params: { hello: 'world' },
					want: {
						status: 400,
						errors: ['lpa-code || postcode is required']
					}
				},
				{
					name: 'invalid bool',
					params: { postcode: 'BS1', 'decided-only': 'decided' },
					want: {
						status: 400,
						errors: ['decided-only must be true or false']
					}
				},
				{
					name: 'valid',
					params: { postcode: 'BS1', 'decided-only': 'true' },
					want: {
						status: 200
					}
				}
			];

			for (const { name, params, want } of tests) {
				it(name, async () => {
					const response = await appealsApi
						.get(`/api/v2/appeal-cases` + buildQueryString(params))
						.send();
					expect(response.status).toBe(want.status);
					expect(response.body.errors).toEqual(want.errors);
				});
			}
		});

		describe('by lpa code', () => {
			beforeAll(async () => {
				// seed cases
				for (const data of testCases) {
					await _createSqlAppealCase(data);
				}
			});
			afterAll(async () => {
				await _clearSqlData();
			});

			for (const lpa of LPAs) {
				it(`returns for ${lpa}`, async () => {
					const response = await appealsApi
						.get(`/api/v2/appeal-cases` + buildQueryString({ 'lpa-code': lpa }))
						.send();
					expect(response.status).toBe(200);
					expect(response.body.length).toEqual(testCases.filter((c) => c.LPACode === lpa).length);
				});
			}
		});

		describe('by postcode', () => {
			beforeAll(async () => {
				// seed cases
				for (const data of testCases) {
					await _createSqlAppealCase(data);
				}
			});
			afterAll(async () => {
				await _clearSqlData();
			});

			for (const postCode of postCodes) {
				it(`returns for ${postCode}`, async () => {
					const response = await appealsApi
						.get(`/api/v2/appeal-cases` + buildQueryString({ postcode: postCode }))
						.send();
					expect(response.status).toBe(200);
					expect(response.body.length).toEqual(
						// only published cases
						publishedTestCases.filter((c) => c.siteAddressPostcode === postCode).length
					);
				});
			}
		});
	});

	describe('count', () => {
		describe('by lpa code', () => {
			beforeAll(async () => {
				// seed cases
				for (const data of testCases) {
					await _createSqlAppealCase(data);
				}
			});
			afterAll(async () => {
				await _clearSqlData();
			});

			for (const lpa of LPAs) {
				it(`returns count for ${lpa}`, async () => {
					const response = await appealsApi
						.get(`/api/v2/appeal-cases/count` + buildQueryString({ 'lpa-code': lpa }))
						.send();
					expect(response.status).toBe(200);
					expect(response.body).toEqual({
						count: testCases.filter((c) => c.LPACode === lpa).length
					});
				});
			}
		});
	});

	describe('get', () => {
		beforeAll(async () => {
			// seed cases
			for (const data of testCases) {
				await _createSqlAppealCase(data);
			}
		});
		afterAll(async () => {
			await _clearSqlData();
		});

		// only published cases
		for (const testCase of publishedTestCases) {
			it(`returns case for ${testCase.caseReference}`, async () => {
				const response = await appealsApi
					.get(`/api/v2/appeal-cases/` + testCase.caseReference)
					.send();
				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
			});
		}

		// only not published cases
		for (const testCase of notPublishedCases) {
			it(`doesn't return non-published case ${testCase.caseReference}`, async () => {
				const response = await appealsApi
					.get(`/api/v2/appeal-cases/` + testCase.caseReference)
					.send();
				expect(response.status).toBe(404);
			});
		}

		it(`returns 404 when not found`, async () => {
			const response = await appealsApi.get(`/api/v2/appeal-cases/abcdefg`).send();
			expect(response.status).toBe(404);
		});
	});

	describe('put', () => {
		afterAll(async () => {
			await _clearSqlData();
		});

		for (const testCase of testCases) {
			it(`upserts case for ${testCase.caseReference}`, async () => {
				const response = await appealsApi
					.put(`/api/v2/appeal-cases/` + testCase.caseReference)
					.send(testCase);
				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
			});
		}

		it(`returns 400 for bad requests`, async () => {
			const data = {
				...testCases[2]
			};
			// @ts-ignore
			delete data.appealTypeCode;
			const response = await appealsApi.put(`/api/v2/appeal-cases/abcdefg`).send(data);
			expect(response.status).toBe(400);
		});
	});
});

/**
 * @returns {Promise.<void>}
 */
const _clearSqlData = async () => {
	const testAppealsClause = {
		in: appealCaseIds
	};

	await sqlClient.appealCase.deleteMany({
		where: {
			id: testAppealsClause
		}
	});
	appealCaseIds = [];
};

/**
 * @param {import('@prisma/client').Prisma.AppealCaseCreateInput} data
 * @returns {Promise.<import('@prisma/client').AppealCase>}
 */
async function _createSqlAppealCase(data) {
	const appeal = await sqlClient.appealCase.create({ data });

	appealCaseIds.push(appeal.id);

	return appeal;
}
