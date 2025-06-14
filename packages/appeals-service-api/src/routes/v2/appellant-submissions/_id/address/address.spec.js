const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');

/**
 * @param {Object} dependencies
 * @param {function(): import('@prisma/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, appealsApi }) => {
	const sqlClient = getSqlClient();

	describe('/appellant-submissions/_id/address', () => {
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
							appealTypeCode: 'HAS'
						}
					}
				}
			});
			validUser = user.id;
			invalidUser = user2.id;
			testAppellantSubmissionId = appeal.AppellantSubmission?.id;
		});

		it('post creates or updates the address', async () => {
			setCurrentSub(validUser);

			const testAddress = {
				addressLine1: 'line 1',
				addressLine2: 'line 2',
				townCity: 'test town',
				postcode: 'postcode',
				fieldName: 'question-field-name',
				county: 'county'
			};

			// adds first address
			const addressResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
				.send(testAddress);

			expect(addressResponse.status).toEqual(200);
			expect(addressResponse.body.SubmissionAddress.length).toBe(1);
			expect(addressResponse.body.SubmissionAddress[0]).toEqual(
				expect.objectContaining(testAddress)
			);

			// updates address
			const firstId = addressResponse.body.SubmissionAddress[0].id;
			const addressResponse2 = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
				.send({
					id: firstId,
					...testAddress,
					addressLine1: 'changed'
				});

			expect(addressResponse2.status).toEqual(200);
			expect(addressResponse2.body.SubmissionAddress.length).toBe(1);
			expect(addressResponse2.body.SubmissionAddress[0]).toEqual(
				expect.objectContaining({
					id: firstId,
					addressLine1: 'changed'
				})
			);

			// adds new address
			const addressResponse3 = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
				.send(testAddress);

			expect(addressResponse3.status).toEqual(200);
			expect(addressResponse3.body.SubmissionAddress.length).toBe(2);
		});

		it('post should 403 with invalid user', async () => {
			setCurrentSub(invalidUser);

			const testAddress = {
				addressLine1: 'line 1',
				addressLine2: 'line 1',
				townCity: 'test town',
				postcode: 'postcode',
				fieldName: 'question-field-name',
				county: 'county'
			};

			const addressResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
				.send(testAddress);

			expect(addressResponse.status).toEqual(403);
		});

		it('delete removes the address', async () => {
			setCurrentSub(validUser);

			const testAddress = {
				addressLine1: 'line 1',
				addressLine2: 'line 1',
				townCity: 'test town',
				postcode: 'postcode',
				fieldName: 'question-field-name',
				county: 'county'
			};

			// adds first address
			const addressResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
				.send(testAddress);

			expect(addressResponse.status).toEqual(200);

			const addressId = addressResponse.body.SubmissionAddress[0].id;
			const addressCount = addressResponse.body.SubmissionAddress.length;

			// delete address
			const deleteResponse = await appealsApi
				.delete(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address/${addressId}`)
				.send();

			expect(deleteResponse.body.SubmissionAddress.length).toBe(addressCount - 1);
			expect(deleteResponse.status).toEqual(200);
		});

		it('delete should 403 with invalid user', async () => {
			setCurrentSub(validUser);

			const testAddress = {
				addressLine1: 'line 1',
				addressLine2: 'line 1',
				townCity: 'test town',
				postcode: 'postcode',
				fieldName: 'question-field-name',
				county: 'county'
			};

			// adds first address
			const addressResponse = await appealsApi
				.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
				.send(testAddress);

			expect(addressResponse.status).toEqual(200);

			const addressId = addressResponse.body.SubmissionAddress[0].id;

			setCurrentSub(invalidUser);

			// delete address
			const deleteResponse = await appealsApi
				.delete(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address/${addressId}`)
				.send();

			expect(deleteResponse.status).toEqual(403);
		});
	});
};
