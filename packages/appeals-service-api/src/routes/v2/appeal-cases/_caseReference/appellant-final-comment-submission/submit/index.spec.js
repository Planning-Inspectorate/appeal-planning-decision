const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');

const config = require('../../../../../../configuration/config');

let validUser = '';
let email = '';
const validLpa = 'Q9999';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {function(string): void} dependencies.setCurrentLpa
 * @param {import('supertest').Agent} dependencies.appealsApi
 * @param {import('../../../../index.test').BlobMetaGetterMock} dependencies.mockBlobMetaGetter
 * @param {import('../../../../index.test').EventClientMock} dependencies.mockEventClient
 * @param {import('../../../../index.test').NotifyClientMock} dependencies.mockNotifyClient
 */
module.exports = ({
	getSqlClient,
	setCurrentSub,
	setCurrentLpa,
	mockBlobMetaGetter,
	mockEventClient,
	mockNotifyClient,
	appealsApi
}) => {
	const sqlClient = getSqlClient();

	beforeAll(async () => {
		email = crypto.randomUUID() + '@example.com';
		const user = await sqlClient.appealUser.create({
			data: {
				email
			}
		});
		validUser = user.id;
	});

	/**
	 * @returns {Promise<void>}
	 */
	const createAppeal = async (caseRef, caseType) => {
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
					create: createTestAppealCase(caseRef, caseType, validLpa)
				}
			}
		});

		await sqlClient.serviceUser.create({
			data: {
				internalId: crypto.randomUUID(),
				emailAddress: email,
				id: crypto.randomUUID(),
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: appeal.AppealCase?.caseReference
			}
		});
	};

	const appealTypes = ['S78', 'S20', 'ADVERTS'];

	describe('/api/v2/appeal-cases/:caseReference/appellant-final-comment-submissions/submit', () => {
		const expectEmail = (email, appealReferenceNumber) => {
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				email,
				{
					personalisation: {
						subject: `We have received your final comments: ${appealReferenceNumber}`,
						content: expect.stringContaining(
							'We will contact you if the local planning authority submits final comments.'
						) // content in v2AppellantFinalComments (v2-appellant-final-comments.md) but not v2LpaFinalComments (v2-lpa-final-comments.md)
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			mockNotifyClient.sendEmail.mockClear();
		};

		it.each(appealTypes)(
			'Formats appellant final comment submission for case %s',
			async (caseType) => {
				const caseRef = crypto.randomUUID();
				await createAppeal(caseRef, caseType);
				setCurrentLpa(validLpa);
				setCurrentSub(validUser);

				const appellantFinalCommentData = {
					appellantFinalComment: true,
					appellantFinalCommentDetails: 'This is a test comment',
					appellantFinalCommentDocuments: false
				};

				await appealsApi
					.post(`/api/v2/appeal-cases/${caseRef}/appellant-final-comment-submission`)
					.send(appellantFinalCommentData);

				await appealsApi
					.post(`/api/v2/appeal-cases/${caseRef}/appellant-final-comment-submission/submit`)
					.expect(200);

				expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
					'appeal-fo-representation-submission',
					[
						{
							caseReference: caseRef,
							representation: 'This is a test comment',
							representationSubmittedDate: expect.any(String),
							representationType: 'final_comment',
							serviceUserId: expect.any(String),
							documents: []
						}
					],
					'Create'
				);

				expectEmail(email, caseRef);
			}
		);

		it.each(appealTypes)(
			'Formats appellant final comment submission with documents for case %s',
			async (caseType) => {
				mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
					return async () => ({
						lastModified: '2024-03-01T14:48:35.847Z',
						createdOn: '2024-03-01T13:48:35.847Z',
						metadata: {
							mime_type: 'doc',
							size: 10293,
							document_type: 'uploadAppellantFinalCommentDocuments'
						},
						_response: { request: { url: 'https://example.com' } }
					});
				});

				const caseRef = crypto.randomUUID();
				await createAppeal(caseRef, caseType);
				setCurrentLpa(validLpa);
				setCurrentSub(validUser);

				const appellantFinalCommentData = {
					appellantFinalComment: true,
					appellantFinalCommentDetails: 'Another final comment text for appellant case 002',
					appellantFinalCommentDocuments: true,
					uploadAppellantFinalCommentDocuments: true
				};

				const result = await appealsApi
					.post(`/api/v2/appeal-cases/${caseRef}/appellant-final-comment-submission`)
					.send(appellantFinalCommentData);

				await sqlClient.submissionDocumentUpload.create({
					data: {
						id: crypto.randomUUID(),
						fileName: 'doc.pdf',
						originalFileName: 'mydoc.pdf',
						type: 'any',
						location: 'https://example.com',
						name: 'doc.pdf',
						appellantFinalCommentId: result.body.id,
						storageId: crypto.randomUUID()
					}
				});

				await appealsApi
					.post(`/api/v2/appeal-cases/${caseRef}/appellant-final-comment-submission/submit`)
					.expect(200);

				expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
					'appeal-fo-representation-submission',
					[
						{
							caseReference: caseRef,
							representation: 'Another final comment text for appellant case 002',
							representationSubmittedDate: expect.any(String),
							representationType: 'final_comment',
							serviceUserId: expect.any(String),
							documents: [
								{
									dateCreated: expect.any(String),
									documentId: expect.any(String),
									documentType: 'appellantFinalComment',
									documentURI: 'https://example.com',
									filename: 'doc.pdf',
									mime: 'doc',
									originalFilename: 'mydoc.pdf',
									size: 10293
								}
							]
						}
					],
					'Create'
				);

				expectEmail(email, caseRef);
			}
		);

		it('404s if the final comment submission cannot be found', async () => {
			await appealsApi
				.post('/api/v2/appeal-cases/nothere/appellant-final-comment-submissions/submit')
				.expect(404);
		});
	});
};
