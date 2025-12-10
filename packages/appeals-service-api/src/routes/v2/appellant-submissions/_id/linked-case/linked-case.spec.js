const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, appealsApi }) => {
	const sqlClient = getSqlClient();
	/**
	 * @returns {Promise<string>}
	 */
	const createSubmission = async () => {
		const user = await sqlClient.appealUser.create({
			data: {
				email: crypto.randomUUID() + '@example.com'
			}
		});
		const appeal = await sqlClient.appeal.create({
			select: {
				AppellantSubmission: true
			},
			data: {
				Users: {
					create: {
						userId: user.id,
						role: APPEAL_USER_ROLES.APPELLANT
					}
				},
				AppellantSubmission: {
					create: {
						LPACode: 'Q9999',
						appealTypeCode: 'HAS'
					}
				}
			}
		});

		return appeal.AppellantSubmission?.id;
	};

	describe('/appellant-submissions/:id/linked-case', () => {
		it('post', async () => {
			const testAppellantSubmissionId = await createSubmission();

			const response = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/linked-case`)
				.send({
					fieldName: 'abc',
					caseReference: '123'
				});

			expect(response.body.SubmissionLinkedCase.length).toEqual(1);
			expect(response.body).toEqual(
				expect.objectContaining({
					SubmissionLinkedCase: expect.arrayContaining([
						expect.objectContaining({
							appellantSubmissionId: testAppellantSubmissionId,
							caseReference: '123',
							fieldName: 'abc',
							lPAQuestionnaireSubmissionId: null
						})
					])
				})
			);
		});

		it('delete', async () => {
			const testId = await createSubmission();
			const createResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testId}/linked-case`)
				.send({
					fieldName: 'abc',
					caseReference: '123'
				});

			const deleteResponse = await appealsApi.delete(
				`/api/v2/appellant-submissions/${testId}/linked-case/${createResponse.body.SubmissionLinkedCase[0].id}`
			);

			expect(deleteResponse.statusCode).toEqual(200);
			expect(deleteResponse.body.SubmissionLinkedCase.length).toEqual(0);
		});
	});
};
