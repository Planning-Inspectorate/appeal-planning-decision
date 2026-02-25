const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('node:crypto');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

let validUser = '';
const validLpa = 'Q9999';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
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
		const user = await sqlClient.appealUser.create({
			data: {
				email: crypto.randomUUID() + '@example.com'
			}
		});
		validUser = user.id;
	});

	const config = require('../../../../../../configuration/config');

	/**
	 * @returns {Promise<string|undefined>}
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
					create: {
						...createTestAppealCase(caseRef, caseType, validLpa),
						finalCommentsDueDate: new Date().toISOString()
					}
				}
			}
		});
		return appeal.AppealCase?.caseReference;
	};

	const appealTypes = Object.values(CASE_TYPES)
		.filter((caseType) => !caseType.expedited)
		.map((caseType) => caseType.processCode);

	describe('/api/v2/appeal-cases/:caseReference/lpa-final-comment-submission/submit', () => {
		const expectEmail = (email, appealReferenceNumber) => {
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				email,
				{
					personalisation: {
						subject: `We've received your final comments: ${appealReferenceNumber}`,
						content: expect.stringContaining(
							'We will contact you when the appellant submits their final comments.'
						) // content in v2LpaFinalComments (v2-lpa-final-comments.md) but not v2AppellantFinalComments (v2-appellant-final-comments.md)
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			mockNotifyClient.sendEmail.mockClear();
		};

		it.each(appealTypes)(
			'Formats lpa final comment submission without docs %s',
			async (caseType) => {
				const id = crypto.randomUUID();
				const finalComment = {
					caseReference: id,
					representation: 'This is a test comment',
					representationSubmittedDate: expect.any(String),
					representationType: 'final_comment',
					lpaCode: 'Q9999',
					documents: []
				};

				await createAppeal(id, caseType);
				setCurrentLpa(validLpa);
				setCurrentSub(validUser);
				const lpaFinalCommentData = {
					lpaFinalComment: true,
					lpaFinalCommentDetails: 'This is a test comment',
					lpaFinalCommentDocuments: false
				};
				await appealsApi
					.post(`/api/v2/appeal-cases/${id}/lpa-final-comment-submission`)
					.send(lpaFinalCommentData);
				await appealsApi
					.post(`/api/v2/appeal-cases/${id}/lpa-final-comment-submission/submit`)
					.expect(200);
				expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
					'appeal-fo-representation-submission',
					[finalComment],
					'Create'
				);
				expectEmail('lpa@example.com', id);
			}
		);

		it.each(appealTypes)('Formats lpa final comment submission with docs %s', async (caseType) => {
			const id = crypto.randomUUID();
			const finalComment = {
				caseReference: id,
				representation: 'This is a test comment',
				representationSubmittedDate: expect.any(String),
				representationType: 'final_comment',
				lpaCode: 'Q9999',
				documents: [
					{
						dateCreated: expect.any(String),
						documentId: expect.any(String),
						documentType: 'lpaFinalComment',
						documentURI: 'https://example.com',
						filename: 'doc.pdf',
						mime: 'doc',
						originalFilename: 'mydoc.pdf',
						size: 10293
					}
				]
			};

			mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
				return async () => ({
					lastModified: '2024-03-01T14:48:35.847Z',
					createdOn: '2024-03-01T13:48:35.847Z',
					metadata: {
						mime_type: 'doc',
						size: 10293,
						document_type: 'uploadLPAFinalCommentDocuments'
					},
					_response: { request: { url: 'https://example.com' } }
				});
			});

			await createAppeal(id, caseType);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const lpaFinalCommentData = {
				lpaFinalComment: true,
				lpaFinalCommentDetails: `This is a test comment`,
				lpaFinalCommentDocuments: true,
				uploadLPAFinalCommentDocuments: true
			};
			const result = await appealsApi
				.post(`/api/v2/appeal-cases/${id}/lpa-final-comment-submission`)
				.send(lpaFinalCommentData);
			await sqlClient.submissionDocumentUpload.create({
				data: {
					id: crypto.randomUUID(),
					fileName: 'doc.pdf',
					originalFileName: 'mydoc.pdf',
					type: 'uploadLPAFinalCommentDocuments',
					location: 'https://example.com',
					name: 'doc.pdf',
					lpaFinalCommentId: result.body.id,
					storageId: crypto.randomUUID()
				}
			});
			await appealsApi
				.post(`/api/v2/appeal-cases/${id}/lpa-final-comment-submission/submit`)
				.expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[finalComment],
				'Create'
			);
			expectEmail('lpa@example.com', id);
		});

		it('404s if the final comment submission cannot be found', async () => {
			await appealsApi
				.post('/api/v2/appeal-cases/nothere/lpa-final-comment-submissions/submit')
				.expect(404);
		});
	});
};
