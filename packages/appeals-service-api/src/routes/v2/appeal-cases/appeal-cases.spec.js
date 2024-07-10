const http = require('http');
const supertest = require('supertest');
const { buildQueryString } = require('@pins/common/src/client/utils');
const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');

const { isFeatureActive } = require('../../../configuration/featureFlag');
const { blobMetaGetter } = require('../../../../src/services/object-store');
const {
	createTestAppealCase
} = require('../../../../__tests__/developer/fixtures/appeals-case-data');
const {
	exampleHASDataModel
} = require('../../../../__tests__/developer/fixtures/appeals-HAS-data-model');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

const validLpa = 'Q9999';
const invalidLpa = 'nope';

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
jest.mock('@pins/common/src/middleware/validate-token', () => {
	let currentLpa = validLpa;

	return {
		validateToken: jest.fn(() => {
			return (req, _res, next) => {
				req.id_token = {
					lpaCode: currentLpa
				};
				next();
			};
		}),
		setCurrentLpa: (newLpa) => {
			currentLpa = newLpa;
		}
	};
});

blobMetaGetter;

jest.setTimeout(10000);

/** @type {string[]} */
let appealCaseIds = [];

let caseRef = 5555555;

/**
 * @param {string} lpaCode
 * @param {string} postCode
 * @param {boolean} casePublished
 * @returns {import('@prisma/client').Prisma.AppealCaseCreateInput}
 */
function appealCase(lpaCode, postCode, casePublished = true) {
	caseRef++;

	const appealCase = createTestAppealCase(
		caseRef.toString(),
		'HAS',
		lpaCode,
		postCode,
		casePublished
	);

	appealCase.Appeal = { create: {} };

	return appealCase;
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
					const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
					setCurrentLpa(lpa);

					const response = await appealsApi
						.get(`/api/v2/appeal-cases` + buildQueryString({ 'lpa-code': lpa }))
						.send();
					expect(response.status).toBe(200);
					expect(response.body.length).toEqual(testCases.filter((c) => c.LPACode === lpa).length);
				});
			}

			it(`400 if lpa code in query doesn't match token`, async () => {
				const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
				setCurrentLpa(invalidLpa);

				const response = await appealsApi
					.get(`/api/v2/appeal-cases` + buildQueryString({ 'lpa-code': LPAs[0] }))
					.send();
				expect(response.status).toBe(400);
			});
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

		const example = { ...exampleHASDataModel };

		for (const testCase of testCases) {
			it(`upserts case for ${testCase.caseReference}`, async () => {
				example.caseReference = testCase.caseReference;
				const response = await appealsApi
					.put(`/api/v2/appeal-cases/` + testCase.caseReference)
					.send(example);
				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
			});
		}

		it('upserts all relational data', async () => {
			example.caseReference = testCases[0].caseReference;
			await appealsApi.put(`/api/v2/appeal-cases/` + testCases[0].caseReference).send(example);

			await sqlClient.appealCaseListedBuilding.create({
				data: {
					AppealCase: {
						connect: {
							caseReference: testCases[0].caseReference
						}
					},
					ListedBuilding: {
						create: {
							reference: 'unknown'
						}
					}
				}
			});

			await appealsApi.put(`/api/v2/appeal-cases/` + testCases[0].caseReference).send(example);

			const appealCase = await sqlClient.appealCase.findFirst({
				where: { caseReference: testCases[0].caseReference },
				include: {
					AffectedListedBuildings: true,
					AppealCaseLpaNotificationMethod: true,
					NeighbouringAddresses: true,
					CaseType: true,
					ProcedureType: true
				}
			});

			expect(appealCase?.AffectedListedBuildings.length).toBe(3); // the number of listed buildings in example json
			expect(appealCase?.AppealCaseLpaNotificationMethod.length).toBe(2); // the number of notification methods in example json
			expect(appealCase?.NeighbouringAddresses.length).toBe(4); // the number of neighbouring addresses in example json
			expect(appealCase?.CaseType?.processCode).toBe('HAS');
			expect(appealCase?.ProcedureType?.name).toBe('Written');

			const appealRelations = await sqlClient.appealCaseRelationship.findMany({
				where: {
					OR: [
						{
							caseReference: testCases[0].caseReference
						},
						{
							caseReference2: testCases[0].caseReference
						}
					]
				}
			});
			expect(appealRelations.length).toBe(5); // nearbyCaseReferences (linked bi-directional) + leadCaseReference (one-directional)
		});

		it(`returns 400 for bad requests`, async () => {
			const badData = {
				caseType: 'D'
			};
			const response = await appealsApi.put(`/api/v2/appeal-cases/abcdefg`).send(badData);
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
