const http = require('http');
const supertest = require('supertest');
const { buildQueryString } = require('@pins/common/src/client/utils');
const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');

const { isFeatureActive } = require('../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../configuration/featureFlag');

jest.setTimeout(10000);

/** @type {string[]} */
let appealCaseIds = [];

const now = new Date();
let caseRef = 1000000;

/**
 *
 * @param {string} lpaCode
 * @param {string} postCode
 * @returns {import('@prisma/client').Prisma.AppealCaseCreateInput}
 */
function appealCase(lpaCode, postCode) {
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
		LPAName: lpaCode
	};
}
const postCodes = ['BS1 6PM', 'BS1 6PN', 'BS1 6PO', 'BS1 6PP'];
const LPAs = ['LPA1', 'LPA1a', 'LPA2', 'LPA2a', 'LPA3', 'LPA3a'];

/** @type {import('@prisma/client').Prisma.AppealCaseCreateInput[]} */
const testCases = [
	appealCase('LPA1', 'BS1 6PM'),
	appealCase('LPA1', 'BS1 6PN'),
	appealCase('LPA1', 'BS1 6PO'),
	appealCase('LPA1a', 'BS1 6PP'),
	appealCase('LPA1', 'BS1 6PP'),
	appealCase('LPA2', 'BS1 6PM'),
	appealCase('LPA2a', 'BS1 6PN'),
	appealCase('LPA2', 'BS1 6PN'),
	appealCase('LPA3', 'BS1 6PO'),
	appealCase('LPA3a', 'BS1 6PO')
];

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
	// clear sql db
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
						testCases.filter((c) => c.siteAddressPostcode === postCode).length
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

		for (const testCase of testCases) {
			it(`returns case for ${testCase.caseReference}`, async () => {
				const response = await appealsApi
					.get(`/api/v2/appeal-cases/` + testCase.caseReference)
					.send();
				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
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
