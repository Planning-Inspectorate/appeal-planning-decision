const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const config = require('../../../configuration/config');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../__tests__/developer/fixtures/appeals-case-data');

const validLpa = 'Q9999';

const expectedNewIPUser = {
	salutation: null,
	firstName: 'Testy',
	lastName: 'McTest',
	emailAddress: 'testEmail@test.com',
	serviceUserType: 'InterestedParty',
	telephoneNumber: null,
	organisation: null
};

const testIPSubmissionData = {
	caseReference: '808',
	firstName: 'Testy',
	lastName: 'McTest',
	emailAddress: 'testEmail@test.com',
	comments: 'Test comment'
};

const formattedComment1 = {
	caseReference: '808',
	representation: 'Test comment',
	representationSubmittedDate: expect.any(String),
	representationType: 'comment',
	documents: [],
	newUser: expectedNewIPUser
};

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client').PrismaClient} dependencies.getSqlClient
 * @param {import('supertest').Agent} dependencies.appealsApi
 * @param {import('../index.test').NotifyClientMock} dependencies.mockNotifyClient
 * @param {import('../index.test').EventClientMock} dependencies.mockEventClient
 */
module.exports = ({ getSqlClient, appealsApi, mockNotifyClient, mockEventClient }) => {
	const sqlClient = getSqlClient();
	let validUser = '';

	/** @returns {Promise<string|undefined>} */
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
					create: {
						...createTestAppealCase(caseRef, 'S78', validLpa),
						finalCommentsDueDate: new Date().toISOString()
					}
				}
			}
		});
		return appeal.AppealCase?.caseReference;
	};

	describe('/api/v2/interested-party-submissions', () => {
		beforeAll(async () => {
			const user = await sqlClient.appealUser.create({
				data: {
					email: crypto.randomUUID() + '@example.com'
				}
			});
			validUser = user.id;
		});

		const expectEmails = (/** @type {string} */ caseRef) => {
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				testIPSubmissionData.emailAddress,
				{
					personalisation: {
						subject: `We've received your comment: ${caseRef}`,
						content: expect.stringContaining(
							`The inspector will review all of the evidence. We will contact you by email when we make a decision.`
						)
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			mockNotifyClient.sendEmail.mockClear();
		};
		it('creates an interested party submission and formats that submission', async () => {
			const caseRef = '808';
			await createAppeal(caseRef);
			const response = await appealsApi
				.post(`/api/v2/interested-party-submissions`)
				.send(testIPSubmissionData);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('caseReference', testIPSubmissionData.caseReference);
			expect(response.body).toHaveProperty('firstName', testIPSubmissionData.firstName);
			expect(response.body).toHaveProperty('lastName', testIPSubmissionData.lastName);
			expect(response.body).toHaveProperty('emailAddress', testIPSubmissionData.emailAddress);
			expect(response.body).toHaveProperty('comments', testIPSubmissionData.comments);

			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedComment1],
				'Create'
			);
			expectEmails(caseRef);
		});
	});
};
