const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, appealsApi }) => {
	const sqlClient = getSqlClient();

	describe('/appellant-submissions/_id/appeal-ground', () => {
		let testAppellantSubmissionId;
		let invalidUser;
		let validUser;

		beforeAll(async () => {
			const user = await sqlClient.appealUser.create({
				data: {
					email: crypto.randomUUID() + '@example.com'
				}
			});
			const user2 = await sqlClient.appealUser.create({
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
							appealTypeCode: 'ENFORCEMENT'
						}
					}
				}
			});
			validUser = user.id;
			invalidUser = user2.id;
			testAppellantSubmissionId = appeal.AppellantSubmission?.id;
		});

		it('post creates or updates the appealGround', async () => {
			setCurrentSub(validUser);

			const testAppealGround = {
				groundName: 'a',
				facts: 'testFacts',
				addSupportingDocuments: null
			};

			// adds first appeal ground
			const appealGroundResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/appeal-ground`)
				.send(testAppealGround);

			expect(appealGroundResponse.status).toEqual(200);
			expect(appealGroundResponse.body.SubmissionAppealGround.length).toBe(1);
			expect(appealGroundResponse.body.SubmissionAppealGround[0]).toEqual(
				expect.objectContaining(testAppealGround)
			);

			// updates appeal ground
			const firstId = appealGroundResponse.body.SubmissionAppealGround[0].id;
			const appealGroundResponse2 = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/appeal-ground`)
				.send({
					id: firstId,
					...testAppealGround,
					facts: 'changedTestFacts'
				});

			expect(appealGroundResponse2.status).toEqual(200);
			expect(appealGroundResponse2.body.SubmissionAppealGround.length).toBe(1);
			expect(appealGroundResponse2.body.SubmissionAppealGround[0]).toEqual(
				expect.objectContaining({
					id: firstId,
					facts: 'changedTestFacts'
				})
			);

			// adds new appeal ground
			const appealGroundResponse3 = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/appeal-ground`)
				.send(testAppealGround);

			expect(appealGroundResponse3.status).toEqual(200);
			expect(appealGroundResponse3.body.SubmissionAppealGround.length).toBe(2);
		});

		it('post handles parallel calls', async () => {
			setCurrentSub(validUser);

			const testAppealGroundA = {
				groundName: 'a',
				facts: 'testFactsA',
				addSupportingDocuments: null
			};
			const testAppealGroundB = {
				groundName: 'b',
				facts: 'testFactsB',
				addSupportingDocuments: null
			};
			const testAppealGroundC = {
				groundName: 'c',
				facts: 'testFactsC',
				addSupportingDocuments: null
			};

			const [response1, response2, response3] = await Promise.all([
				appealsApi
					.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/appeal-ground`)
					.send(testAppealGroundA),
				appealsApi
					.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/appeal-ground`)
					.send(testAppealGroundB),
				appealsApi
					.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/appeal-ground`)
					.send(testAppealGroundC)
			]);

			expect(response1.status).toEqual(200);
			expect(response2.status).toEqual(200);
			expect(response3.status).toEqual(200);
		});

		it('post should 403 with invalid user', async () => {
			setCurrentSub(invalidUser);

			const testAppealGround = {
				groundName: 'a',
				facts: 'testFacts',
				addSupportingDocuments: null
			};

			const appealGroundResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/appeal-ground`)
				.send(testAppealGround);

			expect(appealGroundResponse.status).toEqual(403);
		});

		it('delete removes the appeal ground', async () => {
			setCurrentSub(validUser);

			const testAppealGround = {
				groundName: 'a',
				facts: 'testFacts',
				addSupportingDocuments: null
			};

			// adds first appeal ground
			const appealGroundResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/appeal-ground`)
				.send(testAppealGround);

			expect(appealGroundResponse.status).toEqual(200);

			const appealGroundId = appealGroundResponse.body.SubmissionAppealGround[0].id;
			const appealGroundCount = appealGroundResponse.body.SubmissionAppealGround.length;

			// delete appeal ground
			const deleteResponse = await appealsApi
				.delete(
					`/api/v2/appellant-submissions/${testAppellantSubmissionId}/appeal-ground/${appealGroundId}`
				)
				.send();

			expect(deleteResponse.body.SubmissionAppealGround.length).toBe(appealGroundCount - 1);
			expect(deleteResponse.status).toEqual(200);
		});

		it('delete should 403 with invalid user', async () => {
			setCurrentSub(validUser);

			const testAppealGround = {
				groundName: 'a',
				facts: 'testFacts',
				addSupportingDocuments: null
			};

			// adds first appeal ground
			const appealGroundResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/appeal-ground`)
				.send(testAppealGround);

			expect(appealGroundResponse.status).toEqual(200);

			const appealGroundId = appealGroundResponse.body.SubmissionAppealGround[0].id;

			setCurrentSub(invalidUser);

			// delete appeal ground
			const deleteResponse = await appealsApi
				.delete(
					`/api/v2/appellant-submissions/${testAppellantSubmissionId}/appeal-ground/${appealGroundId}`
				)
				.send();

			expect(deleteResponse.status).toEqual(403);
		});
	});
};
