const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');

let validUser = '';
const validLpa = 'Q9999';
const invalidLpa = 'nope';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {function(string): void} dependencies.setCurrentLpa
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, setCurrentLpa, appealsApi }) => {
	const sqlClient = getSqlClient();

	describe('/appeal-cases/_caseReference/lpa-final-comment-submission', () => {
		beforeAll(async () => {
			const user = await sqlClient.appealUser.create({
				data: {
					email: crypto.randomUUID() + '@example.com'
				}
			});
			validUser = user.id;
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
						create: createTestAppealCase(caseRef, 'S78', validLpa)
					}
				}
			});
			return appeal.AppealCase?.caseReference;
		};

		it('should create a new lpa final comment', async () => {
			const testCaseRef = '4639866';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const lpaFinalCommentData = {
				lpaFinalComment: true,
				lpaFinalCommentDetails: 'This is the first lpa test final comment',
				lpaFinalCommentDocuments: false
			};

			const createResponse = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`)
				.send(lpaFinalCommentData);

			expect(createResponse.status).toEqual(200);
			expect(createResponse.body).toMatchObject(lpaFinalCommentData);
		});

		it('should retrieve an existing lpa final comment', async () => {
			const testCaseRef = '4639867';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const lpaFinalCommentData = {
				lpaFinalComment: true,
				lpaFinalCommentDetails: 'This is a second lpa test final comment',
				lpaFinalCommentDocuments: false
			};

			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`)
				.send(lpaFinalCommentData);

			const response = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`
			);

			expect(response.status).toEqual(200);
			expect(response.body).toMatchObject({
				...lpaFinalCommentData,
				caseReference: testCaseRef
			});
		});

		it('should patch/ update an existing lpa final comment', async () => {
			const testCaseRef = '4639868';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const originalLpaFinalCommentData = {
				lpaFinalComment: true,
				lpaFinalCommentDetails: 'This is the third lpa test final comment'
			};

			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`)
				.send(originalLpaFinalCommentData);

			const updatedLpaFinalCommentData = {
				lpaFinalComment: true,
				lpaFinalCommentDetails: 'This is what we really wanted to say in an update comment',
				lpaFinalCommentDocuments: false
			};

			const updatedResponse = await appealsApi
				.patch(`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`)
				.send(updatedLpaFinalCommentData);

			expect(updatedResponse.status).toEqual(200);
			expect(updatedResponse.body).toMatchObject({
				...updatedLpaFinalCommentData,
				caseReference: testCaseRef
			});
		});

		it('should return 403 if invalid lpa user', async () => {
			const testCaseRef = '4639869';
			await createAppeal(testCaseRef);

			setCurrentLpa(invalidLpa);
			setCurrentSub(validUser);

			const lpaFinalCommentData = {
				lpaFinalComment: true,
				lpaFinalCommentDetails: 'This is the invalid lpa test final comment',
				lpaFinalCommentDocuments: false
			};

			const response = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`)
				.send(lpaFinalCommentData);

			expect(response.status).toEqual(403);
			expect(response.body[0]).toEqual('forbidden');
		});
	});
};
