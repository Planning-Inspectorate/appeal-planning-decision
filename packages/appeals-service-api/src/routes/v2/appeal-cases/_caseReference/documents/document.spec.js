const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');
const {
	createTestDocData
} = require('../../../../../../__tests__/developer/fixtures/appeals-document-data');

let validUserId = '';
const validLpa = 'Q9999';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, appealsApi }) => {
	const sqlClient = getSqlClient();

	beforeAll(async () => {
		const user = await sqlClient.appealUser.create({
			data: {
				email: crypto.randomUUID() + '@example.com'
			}
		});

		validUserId = user.id;
	});

	beforeEach(() => {
		setCurrentSub(validUserId);
	});

	/**
	 * @param {string} caseRef
	 * @returns {Promise<string>}
	 */
	const createAppeal = async (caseRef) => {
		const appeal = await sqlClient.appeal.create({
			include: {
				AppealCase: true
			},
			data: {
				Users: {
					create: {
						userId: validUserId,
						role: APPEAL_USER_ROLES.APPELLANT
					}
				},
				AppealCase: {
					create: createTestAppealCase(caseRef, 'S78', validLpa)
				}
			}
		});
		return appeal.AppealCase?.caseReference;
	};

	const decisionDocumentTypes = [
		APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_DECISION_LETTER,
		APPEAL_DOCUMENT_TYPE.LPA_COSTS_DECISION_LETTER,
		APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER
	];

	describe('/appeal-cases/_caseReference/documents/', () => {
		it('get should retrieve the documents - no documentTypes query param', async () => {
			const testCaseRef = '3636563';
			await createAppeal(testCaseRef);

			await sqlClient.document.createMany({
				data: decisionDocumentTypes.map((type) => ({
					...createTestDocData(testCaseRef, type)
				}))
			});

			const documentResponse = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/documents`
			);

			expect(documentResponse.status).toEqual(200);
			expect(documentResponse.body.length).toBe(3);
		});

		it('get should retrieve specified document types if document types query param included', async () => {
			const testCaseRef = '3636564';
			await createAppeal(testCaseRef);

			await sqlClient.document.createMany({
				data: decisionDocumentTypes.map((type) => ({
					...createTestDocData(testCaseRef, type)
				}))
			});

			const eventResponse = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/documents?documentTypes=${APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER}`
			);

			expect(eventResponse.status).toEqual(200);
			expect(eventResponse.body.length).toBe(1);
		});
	});
};
