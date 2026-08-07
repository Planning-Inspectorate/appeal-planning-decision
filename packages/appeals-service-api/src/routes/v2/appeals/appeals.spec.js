const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { SERVICE_USER_TYPE, APPEAL_SOURCE } = require('@planning-inspectorate/data-model');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../__tests__/developer/fixtures/appeals-case-data');

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, appealsApi }) => {
	const sqlClient = getSqlClient();

	/**
	 * @param {string} userId
	 * @param {string} role
	 * @returns {Promise<import('@pins/database/src/client/client').Appeal>}
	 */
	const createV2DraftAppeal = async (userId, role) => {
		return sqlClient.appeal.create({
			data: {
				Users: { create: { userId, role } },
				AppellantSubmission: {
					create: { LPACode: 'lpa_001', appealTypeCode: 'HAS', submitted: false }
				}
			}
		});
	};

	/**
	 * @param {string} userId
	 * @param {string} role
	 * @param {string} caseRef
	 * @returns {Promise<import('@pins/database/src/client/client').AppealCase>}
	 */
	const createAppealWithCase = async (userId, role, caseRef) => {
		return sqlClient.appealCase.create({
			data: {
				Appeal: { create: { Users: { create: { userId, role } } } },
				...createTestAppealCase(caseRef, 'HAS', 'lpa_001')
			}
		});
	};

	describe('/api/v2/appeals', () => {
		describe('GET /', () => {
			describe('no user', () => {
				it('returns 404 when userId not in db', async () => {
					setCurrentSub(crypto.randomUUID());
					const response = await appealsApi
						.get('/api/v2/appeals')
						.query({ role: APPEAL_USER_ROLES.APPELLANT });
					expect(response.status).toBe(404);
				});
			});

			describe('no appeals', () => {
				let user;

				beforeAll(async () => {
					user = await sqlClient.appealUser.create({
						data: { email: crypto.randomUUID() + '@example.com' }
					});
				});

				it('returns 400 for invalid role', async () => {
					setCurrentSub(user.id);
					const response = await appealsApi.get('/api/v2/appeals').query({ role: 'NotARole' });
					expect(response.status).toBe(400);
				});

				it('returns empty array when user has no appeals', async () => {
					setCurrentSub(user.id);
					const response = await appealsApi
						.get('/api/v2/appeals')
						.query({ role: APPEAL_USER_ROLES.APPELLANT });
					expect(response.status).toBe(200);
					expect(response.body).toEqual([]);
				});
			});

			const appellantAgentRoles = [APPEAL_USER_ROLES.APPELLANT, APPEAL_USER_ROLES.AGENT];
			for (const role of appellantAgentRoles) {
				describe(`${role} access`, () => {
					let user;
					let draft;
					let nonOwnedCaseRef;
					let ownedCase;

					beforeAll(async () => {
						user = await sqlClient.appealUser.create({
							data: { email: crypto.randomUUID() + '@example.com' }
						});
						// another user
						const otherUser = await sqlClient.appealUser.create({
							data: { email: crypto.randomUUID() + '@example.com' }
						});

						draft = await createV2DraftAppeal(user.id, role);
						await createV2DraftAppeal(otherUser.id, role);
						const caseRef = 'appellant-' + crypto.randomUUID().slice(0, 8);
						nonOwnedCaseRef = 'otherUser-' + crypto.randomUUID().slice(0, 8);
						ownedCase = await createAppealWithCase(user.id, APPEAL_USER_ROLES.APPELLANT, caseRef);
						await createAppealWithCase(otherUser.id, APPEAL_USER_ROLES.APPELLANT, nonOwnedCaseRef);
					});

					it("returns only that user's appeals", async () => {
						setCurrentSub(user.id);
						const response = await appealsApi.get('/api/v2/appeals').query({ role });
						expect(response.status).toBe(200);
						expect(response.body).toHaveLength(2);
						expect(response.body).toEqual(
							expect.arrayContaining([
								expect.objectContaining({ id: draft.id }),
								expect.objectContaining({ id: ownedCase.id })
							])
						);
					});
				});
			}

			describe('rule 6 access', () => {
				let user;
				let caseRef;

				beforeAll(async () => {
					user = await sqlClient.appealUser.create({
						data: { email: crypto.randomUUID() + '@example.com' }
					});
					const otherUser = await sqlClient.appealUser.create({
						data: { email: crypto.randomUUID() + '@example.com' }
					});
					caseRef = 'r6-' + crypto.randomUUID().slice(0, 8);
					await createAppealWithCase(user.id, APPEAL_USER_ROLES.RULE_6_PARTY, caseRef);
					await createAppealWithCase(
						otherUser.id,
						APPEAL_USER_ROLES.RULE_6_PARTY,
						'otherUser-' + crypto.randomUUID().slice(0, 8)
					);
					await createAppealWithCase(
						otherUser.id,
						APPEAL_USER_ROLES.APPELLANT,
						'otherUser2-' + crypto.randomUUID().slice(0, 8)
					);
				});

				it('returns cases for rule 6 party', async () => {
					setCurrentSub(user.id);
					const response = await appealsApi
						.get('/api/v2/appeals')
						.query({ role: APPEAL_USER_ROLES.RULE_6_PARTY });
					expect(response.status).toBe(200);
					expect(response.body).toEqual(
						expect.arrayContaining([expect.objectContaining({ caseReference: caseRef })])
					);
				});
			});

			describe('linked appeals', () => {
				let user;
				let leadCaseRef;
				let childCaseRef;

				beforeAll(async () => {
					user = await sqlClient.appealUser.create({
						data: { email: crypto.randomUUID() + '@example.com' }
					});
					leadCaseRef = 'lead-' + crypto.randomUUID().slice(0, 8);
					childCaseRef = 'child-' + crypto.randomUUID().slice(0, 8);

					await createAppealWithCase(user.id, APPEAL_USER_ROLES.APPELLANT, leadCaseRef);
					await createAppealWithCase(user.id, APPEAL_USER_ROLES.APPELLANT, childCaseRef);
					await sqlClient.appealCaseRelationship.create({
						data: { type: 'linked', caseReference: childCaseRef, caseReference2: leadCaseRef }
					});
				});

				it('returns cases with linked case data attached', async () => {
					setCurrentSub(user.id);
					const response = await appealsApi
						.get('/api/v2/appeals')
						.query({ role: APPEAL_USER_ROLES.APPELLANT });
					expect(response.status).toBe(200);
					const lead = response.body.find((c) => c.caseReference === leadCaseRef);
					expect(lead).toBeDefined();
					expect(lead.linkedCases).toEqual(
						expect.arrayContaining([
							expect.objectContaining({
								leadCaseReference: leadCaseRef,
								childCaseReference: childCaseRef
							})
						])
					);
				});
			});

			describe('ownership checks for reps', () => {
				let user;
				let caseRef;
				let serviceUserId;

				beforeAll(async () => {
					const email = 'a' + crypto.randomUUID() + '@example.com';
					serviceUserId = 'su-' + crypto.randomUUID().slice(0, 8);
					user = await sqlClient.appealUser.create({ data: { email } });
					caseRef = 'reps-' + crypto.randomUUID().slice(0, 8);

					await createAppealWithCase(user.id, APPEAL_USER_ROLES.RULE_6_PARTY, caseRef);
					await sqlClient.serviceUser.create({
						data: {
							id: serviceUserId,
							serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
							caseReference: caseRef,
							emailAddress: email.toUpperCase() // different casing from user email
						}
					});
					await sqlClient.representation.create({
						data: {
							representationId: crypto.randomUUID(),
							caseReference: caseRef,
							source: APPEAL_SOURCE.CITIZEN,
							serviceUserId,
							representationType: 'comment'
						}
					});

					const otheremail = 'b' + crypto.randomUUID() + '@example.com';
					const otherServiceUserId = 'su-' + crypto.randomUUID().slice(0, 8);
					await sqlClient.serviceUser.create({
						data: {
							id: otherServiceUserId,
							serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
							caseReference: caseRef,
							emailAddress: otheremail
						}
					});
					await sqlClient.representation.create({
						data: {
							representationId: crypto.randomUUID(),
							caseReference: caseRef,
							source: APPEAL_SOURCE.CITIZEN,
							serviceUserId: otherServiceUserId,
							representationType: 'comment'
						}
					});
				});

				it('marks representations as owned by the logged-in user', async () => {
					setCurrentSub(user.id);
					const response = await appealsApi
						.get('/api/v2/appeals')
						.query({ role: APPEAL_USER_ROLES.RULE_6_PARTY });
					expect(response.status).toBe(200);
					const appealCase = response.body.find((c) => c.caseReference === caseRef);
					expect(appealCase).toBeDefined();
					expect(appealCase.Representations).toEqual(
						expect.arrayContaining([
							expect.objectContaining({ serviceUserId, userOwnsRepresentation: true })
						])
					);
				});
			});
		});

		describe('GET /draft/:id', () => {
			let user;

			beforeAll(async () => {
				user = await sqlClient.appealUser.create({
					data: { email: crypto.randomUUID() + '@example.com' }
				});
			});

			it('returns 403 when user does not exist', async () => {
				setCurrentSub(crypto.randomUUID());
				const response = await appealsApi.get(`/api/v2/appeals/draft/${crypto.randomUUID()}`);
				expect(response.status).toBe(403);
			});

			it('returns 404 when appeal does not belong to user', async () => {
				setCurrentSub(user.id);
				const response = await appealsApi.get(`/api/v2/appeals/draft/${crypto.randomUUID()}`);
				expect(response.status).toBe(404);
			});

			it('returns v2 draft for the user', async () => {
				const draft = await createV2DraftAppeal(user.id, APPEAL_USER_ROLES.APPELLANT);
				setCurrentSub(user.id);
				const response = await appealsApi.get(`/api/v2/appeals/draft/${draft.id}`);
				expect(response.status).toBe(200);
				expect(response.body).toMatchObject({
					id: draft.id,
					AppellantSubmission: { submitted: false }
				});
			});

			it('returns 404 when submission is already submitted', async () => {
				const appeal = await sqlClient.appeal.create({
					data: {
						Users: { create: { userId: user.id, role: APPEAL_USER_ROLES.APPELLANT } },
						AppellantSubmission: {
							create: { LPACode: 'lpa_001', appealTypeCode: 'HAS', submitted: true }
						}
					}
				});
				setCurrentSub(user.id);
				const response = await appealsApi.get(`/api/v2/appeals/draft/${appeal.id}`);
				expect(response.status).toBe(404);
			});
		});
	});
};
