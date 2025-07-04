const { buildQueryString } = require('@pins/common/src/client/utils');
const { LISTED_RELATION_TYPES } = require('@pins/common/src/database/data-static');
const config = require('../../../configuration/config');
const {
	createTestAppealCase
} = require('../../../../__tests__/developer/fixtures/appeals-case-data');
const {
	exampleHASDataModel
} = require('../../../../__tests__/developer/fixtures/appeals-HAS-data-model');
const {
	exampleS78DataModel
} = require('../../../../__tests__/developer/fixtures/appeals-S78-data-model');
const {
	exampleS20DataModel
} = require('../../../../__tests__/developer/fixtures/appeals-S20-data-model');

/**
 * @param {Object} dependencies
 * @param {function(): import('@prisma/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentLpa
 * @param {import('../index.test').NotifyClientMock} dependencies.mockNotifyClient
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentLpa, mockNotifyClient, appealsApi }) => {
	const sqlClient = getSqlClient();

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

	afterAll(async () => {
		await _clearSqlData();
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
						setCurrentLpa(lpa);

						const response = await appealsApi
							.get(`/api/v2/appeal-cases` + buildQueryString({ 'lpa-code': lpa }))
							.send();
						expect(response.status).toBe(200);
						expect(response.body.length).toEqual(testCases.filter((c) => c.LPACode === lpa).length);
					});
				}

				it(`400 if lpa code in query doesn't match token`, async () => {
					setCurrentLpa('invalidLpa');

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
			const expectEmail = (email, appealReferenceNumber) => {
				expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
				expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
					config.services.notify.templates.generic,
					email,
					{
						personalisation: {
							subject: `We have processed your appeal: ${appealReferenceNumber}`,
							content: expect.stringContaining('We have processed your appeal.')
						},
						reference: expect.any(String),
						emailReplyToId: undefined
					}
				);
				mockNotifyClient.sendEmail.mockClear();
			};

			afterAll(async () => {
				await _clearSqlData();
			});

			it(`creates initial case`, async () => {
				const data = structuredClone(hasExample);
				const testCaseRef = 'put-initial-case-test';
				const submission = await sqlClient.appellantSubmission.create({
					data: {
						appealTypeCode: 'HAS',
						LPACode: 'Q1111',
						Appeal: { create: {} }
					},
					select: {
						id: true,
						Appeal: {
							select: {
								id: true
							}
						}
					}
				});
				const email = 'test@example.com';
				const user = await sqlClient.appealUser.upsert({
					where: { email },
					create: { email },
					update: {}
				});

				await sqlClient.appealToUser.create({
					data: {
						userId: user.id,
						appealId: submission.Appeal.id,
						role: 'Appellant'
					}
				});
				data.submissionId = submission.Appeal.id;
				data.caseReference = testCaseRef;
				const response = await appealsApi.put(`/api/v2/appeal-cases/` + testCaseRef).send(data);
				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty('caseReference', testCaseRef);
				expectEmail(email, testCaseRef);
			});

			const hasExample = { ...exampleHASDataModel };
			const s78Example = { ...exampleS78DataModel };
			const s20Example = { ...exampleS20DataModel };

			for (const testCase of testCases) {
				it(`upserts case for ${testCase.caseReference}`, async () => {
					hasExample.caseReference = testCase.caseReference;
					const response = await appealsApi
						.put(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send(hasExample);
					expect(response.status).toBe(200);
					expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
				});

				it(`upserts S78 case for ${testCase.caseReference}`, async () => {
					s78Example.caseReference = testCase.caseReference;
					const response = await appealsApi
						.put(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send(s78Example);
					expect(response.status).toBe(200);
					expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
				});

				it(`upserts S20 case for ${testCase.caseReference}`, async () => {
					s20Example.caseReference = testCase.caseReference;
					const response = await appealsApi
						.put(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send(s20Example);
					expect(response.status).toBe(200);
					expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
				});
			}

			const testCase1 = testCases[0];

			it('upserts all relational data for HAS', async () => {
				hasExample.caseReference = testCase1.caseReference;
				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(hasExample);

				await sqlClient.appealCaseListedBuilding.create({
					data: {
						AppealCase: {
							connect: {
								caseReference: testCase1.caseReference
							}
						},
						ListedBuilding: {
							create: {
								reference: 'unknown'
							}
						}
					}
				});

				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(hasExample);

				const appealCase = await sqlClient.appealCase.findFirst({
					where: { caseReference: testCase1.caseReference },
					include: {
						ListedBuildings: true,
						AppealCaseLpaNotificationMethod: true,
						NeighbouringAddresses: true,
						CaseType: true,
						ProcedureType: true
					}
				});

				expect(
					appealCase?.ListedBuildings.filter((x) => x.type === LISTED_RELATION_TYPES.affected)
						.length
				).toBe(3); // the number of listed buildings in example json
				expect(appealCase?.AppealCaseLpaNotificationMethod.length).toBe(2); // the number of notification methods in example json
				expect(appealCase?.NeighbouringAddresses.length).toBe(4); // the number of neighbouring addresses in example json
				expect(appealCase?.CaseType?.processCode).toBe('HAS');
				expect(appealCase?.ProcedureType?.name).toBe('Written');

				const appealRelations = await sqlClient.appealCaseRelationship.findMany({
					where: {
						OR: [
							{
								caseReference: testCase1.caseReference
							},
							{
								caseReference2: testCase1.caseReference
							}
						]
					}
				});
				expect(appealRelations.length).toBe(5); // nearbyCaseReferences (linked bi-directional) + leadCaseReference (one-directional)
			});

			it('upserts all relational data for S78', async () => {
				s78Example.caseReference = testCase1.caseReference;
				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(s78Example);

				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(s78Example);

				const appealCase = await sqlClient.appealCase.findFirst({
					where: { caseReference: testCase1.caseReference },
					include: {
						ListedBuildings: true,
						AppealCaseLpaNotificationMethod: true,
						NeighbouringAddresses: true,
						CaseType: true,
						ProcedureType: true
					}
				});

				expect(
					appealCase?.ListedBuildings.filter((x) => x.type === LISTED_RELATION_TYPES.affected)
						.length
				).toBe(3); // the number of listed buildings in example json
				expect(appealCase?.AppealCaseLpaNotificationMethod.length).toBe(2); // the number of notification methods in example json
				expect(appealCase?.NeighbouringAddresses.length).toBe(4); // the number of neighbouring addresses in example json
				expect(appealCase?.CaseType?.processCode).toBe('S78');
				expect(appealCase?.ProcedureType?.name).toBe('Written');

				const appealRelations = await sqlClient.appealCaseRelationship.findMany({
					where: {
						OR: [
							{
								caseReference: testCase1.caseReference
							},
							{
								caseReference2: testCase1.caseReference
							}
						]
					}
				});
				expect(appealRelations.length).toBe(5); // nearbyCaseReferences (linked bi-directional) + leadCaseReference (one-directional)
			});

			it('upserts all relational data for S20', async () => {
				s20Example.caseReference = testCase1.caseReference;
				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(s20Example);

				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(s20Example);

				const appealCase = await sqlClient.appealCase.findFirst({
					where: { caseReference: testCase1.caseReference },
					include: {
						ListedBuildings: true,
						AppealCaseLpaNotificationMethod: true,
						NeighbouringAddresses: true,
						CaseType: true,
						ProcedureType: true
					}
				});

				expect(
					appealCase?.ListedBuildings.filter((x) => x.type === LISTED_RELATION_TYPES.affected)
						.length
				).toBe(3); // the number of listed buildings in example json
				expect(appealCase?.AppealCaseLpaNotificationMethod.length).toBe(2); // the number of notification methods in example json
				expect(appealCase?.NeighbouringAddresses.length).toBe(4); // the number of neighbouring addresses in example json
				expect(appealCase?.CaseType?.processCode).toBe('S20');
				expect(appealCase?.ProcedureType?.name).toBe('Written');
				expect(appealCase?.preserveGrantLoan).toBe(true);
				expect(appealCase?.consultHistoricEngland).toBe(true);

				const appealRelations = await sqlClient.appealCaseRelationship.findMany({
					where: {
						OR: [
							{
								caseReference: testCase1.caseReference
							},
							{
								caseReference2: testCase1.caseReference
							}
						]
					}
				});
				expect(appealRelations.length).toBe(5); // nearbyCaseReferences (linked bi-directional) + leadCaseReference (one-directional)
			});

			it('links to initial submission', async () => {
				const appeal = await sqlClient.appeal.create({});

				hasExample.caseReference = 'link-to-submission';
				hasExample.submissionId = appeal.id;

				await appealsApi.put(`/api/v2/appeal-cases/` + hasExample.caseReference).send(hasExample);

				const appealCase = await sqlClient.appealCase.findFirst({
					where: { caseReference: hasExample.caseReference },
					select: {
						appealId: true
					}
				});

				expect(appealCase?.appealId).toBe(appeal.id);
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
};
