const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE, SERVICE_USER_TYPE } = require('pins-data-model');
const crypto = require('crypto');
const config = require('../../../../../../configuration/config');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');

/**
 * @type {string}
 */
let validUser;
const validLpa = 'Q9999';
/**
 * @type {string}
 */
let validEmail;
const testServiceUserId = 'testAppUserId1';

/**
 * @param {Object} dependencies
 * @param {function(): import('@prisma/client').PrismaClient} dependencies.getSqlClient
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
		const email = crypto.randomUUID() + '@example.com';
		const user = await sqlClient.appealUser.create({
			data: {
				email
			}
		});

		validUser = user.id;
		validEmail = user.email;
	});

	/**
	 * @returns {Promise<void>}
	 */
	const createAppeal = async (/** @type {string} */ caseRef, caseType) => {
		await sqlClient.appeal.create({
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
						proofsOfEvidenceDueDate: new Date().toISOString()
					}
				}
			}
		});

		await sqlClient.serviceUser.create({
			data: {
				internalId: crypto.randomUUID(),
				emailAddress: validEmail,
				id: testServiceUserId,
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: caseRef
			}
		});
	};

	const appealTypes = ['S78', 'S20'];

	describe('/api/v2/appeal-cases/:caseReference/appellant-proof-evidence-submission/submit', () => {
		const expectEmails = (/** @type {string} */ caseRef) => {
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				validEmail,
				{
					personalisation: {
						subject: `We have received your proof of evidence and witnesses: ${caseRef}`,
						content: expect.stringContaining(
							'We will contact you when the local planning authority and any other parties submit their proof of evidence and witnesses.'
						)
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			mockNotifyClient.sendEmail.mockClear();
		};

		it.each(appealTypes)(
			'Formats appellant proof of evidence submission for case %s',
			async (caseType) => {
				mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
					return async () => ({
						lastModified: '2024-03-01T14:48:35.847Z',
						createdOn: '2024-03-01T13:48:35.847Z',
						metadata: {
							mime_type: 'doc',
							size: 10293,
							document_type: 'uploadAppellantProofOfEvidenceDocuments'
						},
						_response: { request: { url: 'https://example.com' } }
					});
				});

				const caseRef = crypto.randomUUID();
				await createAppeal(caseRef, caseType);
				setCurrentLpa(validLpa);
				setCurrentSub(validUser);
				const appellantProofOfEvidenceData = {
					uploadAppellantProofOfEvidenceDocuments: true,
					appellantWitnesses: false
				};
				const result = await appealsApi
					.post(`/api/v2/appeal-cases/${caseRef}/appellant-proof-evidence-submission`)
					.send(appellantProofOfEvidenceData);
				await sqlClient.submissionDocumentUpload.create({
					data: {
						id: crypto.randomUUID(),
						fileName: 'doc.pdf',
						originalFileName: 'mydoc.pdf',
						type: 'uploadAppellantProofOfEvidenceDocuments',
						location: 'https://example.com',
						name: 'doc.pdf',
						appellantProofOfEvidenceId: result.body.id,
						storageId: crypto.randomUUID()
					}
				});

				await appealsApi
					.post(`/api/v2/appeal-cases/${caseRef}/appellant-proof-evidence-submission/submit`)
					.expect(200);

				expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
					'appeal-fo-representation-submission',
					[
						{
							caseReference: caseRef,
							representation: null,
							representationSubmittedDate: expect.any(String),
							representationType: 'proofs_evidence',
							serviceUserId: testServiceUserId,
							documents: [
								{
									dateCreated: expect.any(String),
									documentId: expect.any(String),
									documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_PROOF_OF_EVIDENCE,
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
				mockEventClient.sendEvents.mockClear();
				expectEmails(caseRef);
			}
		);

		it.each(appealTypes)(
			'Formats appellant proof of evidence submission with both docs for case %s',
			async (caseType) => {
				mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
					return async (location) => ({
						lastModified: '2024-03-01T14:48:35.847Z',
						createdOn: '2024-03-01T13:48:35.847Z',
						metadata: {
							mime_type: 'doc',
							size: 10293,
							document_type:
								location === 'https://example.com/proof'
									? 'uploadAppellantProofOfEvidenceDocuments'
									: 'uploadAppellantWitnessesEvidence'
						},
						_response: { request: { url: 'https://example.com' } }
					});
				});

				const caseRef = crypto.randomUUID();
				await createAppeal(caseRef, caseType);
				setCurrentLpa(validLpa);
				setCurrentSub(validUser);
				const appellantProofOfEvidenceData = {
					uploadAppellantProofOfEvidenceDocuments: true,
					appellantWitnesses: true,
					uploadAppellantWitnessesEvidence: true
				};
				const result = await appealsApi
					.post(`/api/v2/appeal-cases/${caseRef}/appellant-proof-evidence-submission`)
					.send(appellantProofOfEvidenceData);
				await sqlClient.submissionDocumentUpload.createMany({
					data: [
						{
							id: crypto.randomUUID(),
							fileName: 'doc.pdf',
							originalFileName: 'mydoc.pdf',
							type: 'uploadAppellantProofOfEvidenceDocuments',
							location: 'https://example.com/proof',
							name: 'doc.pdf',
							appellantProofOfEvidenceId: result.body.id,
							storageId: crypto.randomUUID()
						},
						{
							id: crypto.randomUUID(),
							fileName: 'doc.pdf',
							originalFileName: 'mydoc.pdf',
							type: 'uploadAppellantWitnessesEvidence',
							location: 'https://example.com',
							name: 'doc.pdf',
							appellantProofOfEvidenceId: result.body.id,
							storageId: crypto.randomUUID()
						}
					]
				});

				await appealsApi
					.post(`/api/v2/appeal-cases/${caseRef}/appellant-proof-evidence-submission/submit`)
					.expect(200);

				expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
					'appeal-fo-representation-submission',
					[
						{
							caseReference: caseRef,
							representation: null,
							representationSubmittedDate: expect.any(String),
							representationType: 'proofs_evidence',
							serviceUserId: testServiceUserId,
							documents: expect.arrayContaining([
								{
									dateCreated: expect.any(String),
									documentId: expect.any(String),
									documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_PROOF_OF_EVIDENCE,
									documentURI: 'https://example.com',
									filename: 'doc.pdf',
									mime: 'doc',
									originalFilename: 'mydoc.pdf',
									size: 10293
								},
								{
									dateCreated: expect.any(String),
									documentId: expect.any(String),
									documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_WITNESSES_EVIDENCE,
									documentURI: 'https://example.com',
									filename: 'doc.pdf',
									mime: 'doc',
									originalFilename: 'mydoc.pdf',
									size: 10293
								}
							])
						}
					],
					'Create'
				);
				mockEventClient.sendEvents.mockClear();
				expectEmails(caseRef);
			}
		);

		it('404s if the proof of evidence submission cannot be found', async () => {
			await appealsApi
				.post('/api/v2/appeal-cases/nothere/appellant-proof-evidence-submissions/submit')
				.expect(404);
		});
	});
};
