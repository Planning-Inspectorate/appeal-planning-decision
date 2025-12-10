const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, appealsApi }) => {
	const sqlClient = getSqlClient();

	describe('/appellant-submissions/_id/individual', () => {
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

		it('post creates or updates the named individual', async () => {
			setCurrentSub(validUser);

			const testIndividual = {
				firstName: 'testFirstName',
				lastName: 'testLastName',
				fieldName: 'testQuestion'
			};

			// adds first named individual
			const individualResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/individual`)
				.send(testIndividual);

			expect(individualResponse.status).toEqual(200);
			expect(individualResponse.body.SubmissionIndividual.length).toBe(1);
			expect(individualResponse.body.SubmissionIndividual[0]).toEqual(
				expect.objectContaining(testIndividual)
			);

			// updates named individual
			const firstId = individualResponse.body.SubmissionIndividual[0].id;
			const individualResponse2 = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/individual`)
				.send({
					id: firstId,
					...testIndividual,
					firstName: 'changedFirstName'
				});

			expect(individualResponse2.status).toEqual(200);
			expect(individualResponse2.body.SubmissionIndividual.length).toBe(1);
			expect(individualResponse2.body.SubmissionIndividual[0]).toEqual(
				expect.objectContaining({
					id: firstId,
					firstName: 'changedFirstName'
				})
			);

			// adds new named individual
			const individualResponse3 = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/individual`)
				.send(testIndividual);

			expect(individualResponse3.status).toEqual(200);
			expect(individualResponse3.body.SubmissionIndividual.length).toBe(2);
		});

		it('post should 403 with invalid user', async () => {
			setCurrentSub(invalidUser);

			const testIndividual = {
				firstName: 'testFirstName',
				lastName: 'testLastName',
				fieldName: 'testQuestion'
			};

			const individualResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/individual`)
				.send(testIndividual);

			expect(individualResponse.status).toEqual(403);
		});

		it('delete removes the named individual', async () => {
			setCurrentSub(validUser);

			const testIndividual = {
				firstName: 'testFirstName',
				lastName: 'testLastName',
				fieldName: 'testQuestion'
			};

			// adds first named individual
			const individualResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/individual`)
				.send(testIndividual);

			expect(individualResponse.status).toEqual(200);

			const individualId = individualResponse.body.SubmissionIndividual[0].id;
			const individualCount = individualResponse.body.SubmissionIndividual.length;

			// delete named individual
			const deleteResponse = await appealsApi
				.delete(
					`/api/v2/appellant-submissions/${testAppellantSubmissionId}/individual/${individualId}`
				)
				.send();

			expect(deleteResponse.body.SubmissionIndividual.length).toBe(individualCount - 1);
			expect(deleteResponse.status).toEqual(200);
		});

		it('delete should 403 with invalid user', async () => {
			setCurrentSub(validUser);

			const testIndividual = {
				firstName: 'testFirstName',
				lastName: 'testLastName',
				fieldName: 'testQuestion'
			};

			// adds first named individual
			const individualResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/individual`)
				.send(testIndividual);

			expect(individualResponse.status).toEqual(200);

			const individualId = individualResponse.body.SubmissionIndividual[0].id;

			setCurrentSub(invalidUser);

			// delete named individual
			const deleteResponse = await appealsApi
				.delete(
					`/api/v2/appellant-submissions/${testAppellantSubmissionId}/individual/${individualId}`
				)
				.send();

			expect(deleteResponse.status).toEqual(403);
		});
	});
};
