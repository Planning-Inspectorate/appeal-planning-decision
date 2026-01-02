const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, appealsApi }) => {
	const sqlClient = getSqlClient();
	let validUser = '';
	describe('/api/v2/appeals/{id}', () => {
		beforeAll(async () => {
			const user = await sqlClient.appealUser.create({
				data: {
					email: crypto.randomUUID() + '@example.com'
				}
			});
			validUser = user.id;
		});

		/**
		 * @returns {Promise<string>}
		 */
		const createAppeal = async () => {
			const appeal = await sqlClient.appeal.create({
				data: {
					legacyAppealSubmissionId: '8d89379a-e7b5-4a03-bdc7-1817f67d5e7b',
					legacyAppealSubmissionDecisionDate: new Date(),
					legacyAppealSubmissionState: 'DRAFT',
					Users: {
						create: {
							userId: validUser,
							role: APPEAL_USER_ROLES.APPELLANT
						}
					}
				}
			});
			return appeal.id;
		};

		it('should update an appeal with legacy fields set to null', async () => {
			const appealId = await createAppeal();
			console.log(appealId);
			const response = await appealsApi.patch(`/api/v2/appeals/${appealId}`).send({
				legacyAppealSubmissionId: null,
				legacyAppealSubmissionDecisionDate: null,
				legacyAppealSubmissionState: null
			});
			expect(response.status).toEqual(200);
			const updatedAppeal = await sqlClient.appeal.findUnique({
				where: { id: appealId },
				select: {
					legacyAppealSubmissionId: true,
					legacyAppealSubmissionDecisionDate: true,
					legacyAppealSubmissionState: true
				}
			});
			expect(updatedAppeal).toMatchObject({
				legacyAppealSubmissionId: null,
				legacyAppealSubmissionDecisionDate: null,
				legacyAppealSubmissionState: null
			});
		});
		it('should return 404 if the appeal does not exist', async () => {
			const nonExistentId = '00000000-0000-0000-0000-000000000000';
			const response = await appealsApi.patch(`/api/v2/appeals/${nonExistentId}`).send({
				legacyAppealSubmissionId: null
			});
			expect(response.status).toEqual(404);
		});
	});
};
