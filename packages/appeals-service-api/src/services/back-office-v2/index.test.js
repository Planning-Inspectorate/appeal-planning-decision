const BackOfficeV2Service = require('./index');
const forwarders = require('./forwarders');
const { SchemaValidator } = require('./validate');

const { isFeatureActive } = require('../../configuration/featureFlag');

const { getUserById } = require('../../routes/v2/users/service');
const { getForEmailCaseAndType } = require('../../routes/v2/service-users/service');

const { markAppealAsSubmitted } = require('../../routes/v2/appellant-submissions/_id/service');
const {
	markQuestionnaireAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/service');
const { getCaseAndAppellant } = require('../../routes/v2/appeal-cases/service');

const {
	getLPAStatementByAppealId,
	markStatementAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-statement-submission/service');
const {
	getLPAFinalCommentByAppealId,
	markLPAFinalCommentAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-final-comment-submission/service');
const {
	getLpaProofOfEvidenceByAppealId,
	markLpaProofOfEvidenceAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-proof-evidence-submission/service');
const {
	getAppellantFinalCommentByAppealId,
	markAppellantFinalCommentAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/appellant-final-comment-submission/service');
const {
	getAppellantProofOfEvidenceByAppealId,
	markAppellantProofOfEvidenceAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/appellant-proof-evidence-submission/service');
const {
	getRule6ProofOfEvidenceByAppealId,
	markRule6ProofOfEvidenceAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/rule-6-proof-evidence-submission/service');
const {
	getRule6StatementByAppealId,
	markRule6StatementAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/rule-6-statement-submission/service');

const {
	sendSubmissionReceivedEmailToAppellantV2,
	sendSubmissionReceivedEmailToLpaV2,
	sendCommentSubmissionConfirmationEmailToIp,
	sendLpaStatementSubmissionReceivedEmailToLpaV2,
	sendAppellantFinalCommentSubmissionEmailToAppellantV2,
	sendAppellantProofEvidenceSubmissionEmailToAppellantV2,
	sendLPAProofEvidenceSubmissionEmailToLPAV2,
	sendRule6ProofEvidenceSubmissionEmailToRule6PartyV2,
	sendRule6StatementSubmissionEmailToRule6PartyV2,
	sendLPAFinalCommentSubmissionEmailToLPAV2,
	sendLPAHASQuestionnaireSubmittedEmailV2
} = require('#lib/notify.js');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

jest.mock('#lib/logger.js');
jest.mock('#lib/notify.js');
jest.mock('../../configuration/featureFlag');

jest.mock('./validate');
jest.mock('./forwarders');
jest.mock('../../routes/v2/users/service');
jest.mock('../../routes/v2/service-users/service');
jest.mock('../../routes/v2/appellant-submissions/_id/service');
jest.mock('../../routes/v2/appeal-cases/service');
jest.mock('../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/service');
jest.mock('../../routes/v2/appeal-cases/_caseReference/lpa-statement-submission/service');
jest.mock('../../routes/v2/appeal-cases/_caseReference/lpa-final-comment-submission/service');
jest.mock('../../routes/v2/appeal-cases/_caseReference/lpa-proof-evidence-submission/service');
jest.mock('../../routes/v2/appeal-cases/_caseReference/appellant-final-comment-submission/service');
jest.mock(
	'../../routes/v2/appeal-cases/_caseReference/appellant-proof-evidence-submission/service'
);
jest.mock('../../routes/v2/appeal-cases/_caseReference/rule-6-proof-evidence-submission/service');
jest.mock('../../routes/v2/appeal-cases/_caseReference/rule-6-statement-submission/service');

// todo: this shouldn't be needed
jest.mock('../../db/db-client');

describe('BackOfficeV2Service', () => {
	/** @type {import('./index')} */
	let backOfficeV2Service;

	const testCaseRef = 'abc';
	const testUserID = '123';
	const mockUser = { email: 'test', serviceUserId: '321' };
	const mockServiceUser = { firstName: 'first', lastName: 'last' };

	// schema validator
	const mockValidator = jest.fn();
	const mockGetValidator = jest
		.spyOn(SchemaValidator.prototype, 'getValidator')
		.mockImplementation(() => mockValidator);

	beforeEach(() => {
		backOfficeV2Service = new BackOfficeV2Service();
		getUserById.mockResolvedValue(mockUser);
		getForEmailCaseAndType.mockResolvedValue(mockServiceUser);
		isFeatureActive.mockResolvedValue(true);
		mockValidator.mockReturnValue(true);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('submitAppellantSubmission', () => {
		const mockAppealSubmissions = [
			['householder', { id: 'a1', appealTypeCode: 'HAS' }],
			['planning', { id: 'a2', appealTypeCode: 'S78' }],
			['listed building', { id: 'a3', appealTypeCode: 'S20' }],
			['CAS planning', { id: 'a4', appealTypeCode: 'CAS_PLANNING' }],
			['CAS advert', { id: 'a5', appealTypeCode: 'CAS_ADVERTS' }],
			['advert', { id: 'a6', appealTypeCode: 'ADVERTS' }]
		];

		const mockFormattedAppeal = {};

		const mockResult = { test: 1 };

		// formatter
		const mockAppealFormatter = jest.fn();
		mockAppealFormatter.mockReturnValue(mockFormattedAppeal);

		// forwarder
		forwarders.appeal = jest.fn();
		forwarders.appeal.mockResolvedValue(mockResult);

		it.each(mockAppealSubmissions)('should submit Appeal (type: %s)', async (_, submission) => {
			const lpa = { test: 1 };
			const result = await backOfficeV2Service.submitAppellantSubmission({
				appellantSubmission: submission,
				email: mockUser.email,
				lpa,
				formatter: mockAppealFormatter
			});

			expect(mockAppealFormatter).toHaveBeenCalledWith(submission, lpa);
			expect(mockGetValidator).toHaveBeenCalled();
			expect(mockValidator).toHaveBeenCalledWith(mockFormattedAppeal);
			expect(forwarders.appeal).toHaveBeenCalledWith([mockFormattedAppeal]);
			expect(markAppealAsSubmitted).toHaveBeenCalledWith(submission.id);
			expect(sendSubmissionReceivedEmailToLpaV2).toHaveBeenCalledWith(submission);
			expect(sendSubmissionReceivedEmailToAppellantV2).toHaveBeenCalledWith(
				submission,
				mockUser.email
			);
			expect(result).toEqual(mockResult);
		});

		it('should error if unhandled appeal type', async () => {
			const badAppealSubmission = {
				id: 'a1',
				appealTypeCode: 'Nope'
			};
			await expect(
				backOfficeV2Service.submitAppellantSubmission({
					appellantSubmission: badAppealSubmission,
					userId: testUserID,
					formatter: mockAppealFormatter
				})
			).rejects.toThrow(
				`Appeal submission ${badAppealSubmission.id} has an invalid appealTypeCode`
			);
		});

		it.each(mockAppealSubmissions)(
			'should error if validation fails (type: %s)',
			async (_, submission) => {
				mockValidator.mockReturnValue(false);

				await expect(
					backOfficeV2Service.submitAppellantSubmission({
						appellantSubmission: submission,
						userId: testUserID,
						formatter: mockAppealFormatter
					})
				).rejects.toThrow(
					'Payload was invalid when checked against appellant submission command schema'
				);

				expect(mockGetValidator).toHaveBeenCalled();
			}
		);
	});

	describe('submitQuestionnaire', () => {
		const mockLPAQs = [
			[
				'householder',
				{
					AppealCase: {
						LPACode: 'Q9999',
						appealTypeCode: 'HAS'
					}
				}
			],
			[
				'planning',
				{
					AppealCase: {
						LPACode: 'Q9999',
						appealTypeCode: 'S78'
					}
				}
			],
			[
				'listed building',
				{
					AppealCase: {
						LPACode: 'Q9999',
						appealTypeCode: 'S20'
					}
				}
			],
			[
				'CAS planning',
				{
					AppealCase: {
						LPACode: 'Q9999',
						appealTypeCode: 'CAS_PLANNING'
					}
				}
			],
			[
				'CAS advert',
				{
					AppealCase: {
						LPACode: 'Q9999',
						appealTypeCode: 'CAS_ADVERTS'
					}
				}
			],
			[
				'advert',
				{
					AppealCase: {
						LPACode: 'Q9999',
						appealTypeCode: 'ADVERTS'
					}
				}
			]
		];

		const mockFormattedLpaq = {
			test: 1,
			casedata: {
				lpaQuestionnaireSubmittedDate: new Date()
			}
		};

		const mockCaseAndAppellant = {
			users: [
				{
					serviceUserType: SERVICE_USER_TYPE.AGENT,
					emailAddress: 'test'
				}
			]
		};
		const mockResult = { test: 1 };

		// formatter
		const mockFormatter = jest.fn();
		mockFormatter.mockReturnValue(mockFormattedLpaq);

		// forwarder
		forwarders.questionnaire = jest.fn();
		forwarders.questionnaire.mockResolvedValue(mockResult);

		it.each(mockLPAQs)('should submit LPAQ (type: %s)', async (_, lpaq) => {
			getCaseAndAppellant.mockResolvedValue(mockCaseAndAppellant);

			const result = await backOfficeV2Service.submitQuestionnaire(
				testCaseRef,
				lpaq,
				mockFormatter
			);

			expect(mockFormatter).toHaveBeenCalledWith(testCaseRef, lpaq);
			expect(mockGetValidator).toHaveBeenCalled();
			expect(mockValidator).toHaveBeenCalledWith(mockFormattedLpaq);
			expect(forwarders.questionnaire).toHaveBeenCalledWith([mockFormattedLpaq]);
			expect(markQuestionnaireAsSubmitted).toHaveBeenCalledWith(
				testCaseRef,
				mockFormattedLpaq.casedata.lpaQuestionnaireSubmittedDate
			);
			expect(getCaseAndAppellant).toHaveBeenCalledWith({ caseReference: testCaseRef });
			expect(sendLPAHASQuestionnaireSubmittedEmailV2).toHaveBeenCalledWith(
				mockCaseAndAppellant,
				mockCaseAndAppellant.users[0].emailAddress
			);
			expect(result).toEqual(mockResult);
		});

		it.each(mockLPAQs)('should use appellant email if no agent (type: %s)', async (_, lpaq) => {
			const mockCaseAndAppellant2 = {
				users: [
					{
						serviceUserType: SERVICE_USER_TYPE.APPELLANT,
						emailAddress: 'test2'
					}
				]
			};

			getCaseAndAppellant.mockResolvedValue(mockCaseAndAppellant2);

			await backOfficeV2Service.submitQuestionnaire(testCaseRef, lpaq, mockFormatter);

			expect(sendLPAHASQuestionnaireSubmittedEmailV2).toHaveBeenCalledWith(
				mockCaseAndAppellant2,
				mockCaseAndAppellant2.users[0].emailAddress
			);
		});

		it('should error if unhandled appeal type', async () => {
			const testCase = {
				AppealCase: {
					LPACode: 'Q9999',
					appealTypeCode: 'Nope'
				}
			};
			await expect(
				backOfficeV2Service.submitQuestionnaire(testCaseRef, testCase, mockFormatter)
			).rejects.toThrow("Questionnaire's associated AppealCase has an invalid appealTypeCode");
		});

		it.each(mockLPAQs)('should error if validation fails (type: %s)', async (_, lpaq) => {
			mockValidator.mockReturnValue(false);

			await expect(
				backOfficeV2Service.submitQuestionnaire(testCaseRef, lpaq, mockFormatter)
			).rejects.toThrow(
				'Payload was invalid when checked against lpa questionnaire command schema'
			);
		});
	});

	describe('submitInterestedPartySubmission', () => {
		const mockFormattedIPComment = {};
		const mockResult = { test: 1 };

		// formatter
		const mockIPCommentFormatter = jest.fn();
		mockIPCommentFormatter.mockReturnValue(mockFormattedIPComment);

		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);

		it('should submit IP comment', async () => {
			const interestedPartySubmission1 = {
				id: '123',
				caseReference: '234',
				emailAddress: 'testEmail@test.com',
				AppealCase: {
					LPACode: 'Q1111',
					appealTypeCode: 'S78'
				}
			};

			await backOfficeV2Service.submitInterestedPartySubmission(
				interestedPartySubmission1,
				mockIPCommentFormatter
			);

			expect(sendCommentSubmissionConfirmationEmailToIp).toHaveBeenCalledWith(
				interestedPartySubmission1
			);
		});

		it('should not send email if IP comment has no email', async () => {
			const interestedPartySubmission2 = {
				id: '123',
				caseReference: '234',
				AppealCase: {
					LPACode: 'Q1111',
					appealTypeCode: 'S78'
				}
			};

			await backOfficeV2Service.submitInterestedPartySubmission(
				interestedPartySubmission2,
				mockIPCommentFormatter
			);

			expect(sendCommentSubmissionConfirmationEmailToIp).not.toHaveBeenCalled();
		});
	});

	describe('submitLPAStatementSubmission', () => {
		const mockAppealStatements = [
			{
				AppealCase: {
					id: 'a1',
					appealTypeCode: 'S78'
				}
			},
			{
				AppealCase: {
					id: 'a2',
					appealTypeCode: 'S20'
				}
			}
		];

		const mockFormattedAppealFinalComment = {};

		const mockResult = { test: 1 };

		// formatter
		const mockAppealStatementFormatter = jest.fn();
		mockAppealStatementFormatter.mockReturnValue(mockFormattedAppealFinalComment);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);
		it.each(mockAppealStatements)('should submit lpa statement', async (statement) => {
			getLPAStatementByAppealId.mockResolvedValue(statement);

			await backOfficeV2Service.submitLPAStatementSubmission(
				testCaseRef,
				mockAppealStatementFormatter
			);

			expect(getLPAStatementByAppealId).toHaveBeenCalledWith(testCaseRef);
			expect(markStatementAsSubmitted).toHaveBeenCalledWith(testCaseRef, expect.any(String));
			expect(sendLpaStatementSubmissionReceivedEmailToLpaV2).toHaveBeenCalledWith(statement);
		});
	});

	describe('submitLPAFinalCommentSubmission', () => {
		const mockAppealFinalComments = [
			{
				AppealCase: {
					id: 'a1',
					appealTypeCode: 'S78'
				}
			},
			{
				AppealCase: {
					id: 'a2',
					appealTypeCode: 'S20'
				}
			}
		];

		const mockFormattedAppealFinalComment = {};

		const mockResult = { test: 1 };

		// formatter
		const mockAppealFinalCommentFormatter = jest.fn();
		mockAppealFinalCommentFormatter.mockReturnValue(mockFormattedAppealFinalComment);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);
		it.each(mockAppealFinalComments)('should submit lpa final comment', async (finalComment) => {
			getLPAFinalCommentByAppealId.mockResolvedValue(finalComment);

			await backOfficeV2Service.submitLPAFinalCommentSubmission(
				testCaseRef,
				mockAppealFinalCommentFormatter
			);

			expect(getLPAFinalCommentByAppealId).toHaveBeenCalledWith(testCaseRef);
			expect(markLPAFinalCommentAsSubmitted).toHaveBeenCalledWith(testCaseRef, expect.any(String));
			expect(sendLPAFinalCommentSubmissionEmailToLPAV2).toHaveBeenCalledWith(finalComment);
		});
	});

	describe('submitLpaProofEvidenceSubmission', () => {
		const mockAppealProofEvidences = [
			{
				AppealCase: {
					id: 'a1',
					appealTypeCode: 'S78'
				}
			},
			{
				AppealCase: {
					id: 'a2',
					appealTypeCode: 'S20'
				}
			}
		];

		const mockFormattedAppealFinalComment = {};

		const mockResult = { test: 1 };

		// formatter
		const mockLPAProofsFormatter = jest.fn();
		mockLPAProofsFormatter.mockReturnValue(mockFormattedAppealFinalComment);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);
		it.each(mockAppealProofEvidences)('should submit lpa proof', async (proofEvidence) => {
			getLpaProofOfEvidenceByAppealId.mockResolvedValue(proofEvidence);

			await backOfficeV2Service.submitLpaProofEvidenceSubmission(
				testCaseRef,
				mockLPAProofsFormatter
			);

			expect(getLpaProofOfEvidenceByAppealId).toHaveBeenCalledWith(testCaseRef);
			expect(markLpaProofOfEvidenceAsSubmitted).toHaveBeenCalledWith(
				testCaseRef,
				expect.any(String)
			);
			expect(sendLPAProofEvidenceSubmissionEmailToLPAV2).toHaveBeenCalledWith(proofEvidence);
		});
	});

	describe('submitAppellantFinalCommentSubmission', () => {
		const mockAppealFinalComments = [
			{
				AppealCase: {
					id: 'a1',
					appealTypeCode: 'S78'
				}
			},
			{
				AppealCase: {
					id: 'a2',
					appealTypeCode: 'S20'
				}
			}
		];
		const mockFormattedAppealFinalComment = {};

		const mockResult = { test: 1 };

		// formatter
		const mockAppealFinalCommentFormatter = jest.fn();
		mockAppealFinalCommentFormatter.mockReturnValue(mockFormattedAppealFinalComment);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);

		it.each(mockAppealFinalComments)(
			'should submit appellant final comment',
			async (finalComment) => {
				getAppellantFinalCommentByAppealId.mockResolvedValue(finalComment);

				await backOfficeV2Service.submitAppellantFinalCommentSubmission(
					testCaseRef,
					testUserID,
					mockAppealFinalCommentFormatter
				);

				expect(getAppellantFinalCommentByAppealId).toHaveBeenCalledWith(testCaseRef);
				expect(getUserById).toHaveBeenCalledWith(testUserID);
				expect(markAppellantFinalCommentAsSubmitted).toHaveBeenCalledWith(
					testCaseRef,
					expect.any(String)
				);
				expect(sendAppellantFinalCommentSubmissionEmailToAppellantV2).toHaveBeenCalledWith(
					finalComment,
					mockUser.email
				);
			}
		);

		it.each(mockAppealFinalComments)(
			'should error if no service user details',
			async (finalComment) => {
				getAppellantFinalCommentByAppealId.mockResolvedValue(finalComment);
				getForEmailCaseAndType.mockResolvedValue(null);

				await expect(
					backOfficeV2Service.submitAppellantFinalCommentSubmission({
						testCaseRef,
						testUserID,
						mockAppealFinalCommentFormatter
					})
				).rejects.toThrow(`cannot find appellant service user`);
			}
		);
	});

	describe('submitAppellantProofEvidenceSubmission', () => {
		const mockAppellantProofs = [
			{
				AppealCase: {
					id: 'a1',
					appealTypeCode: 'S78',
					LPACode: 'Q1111'
				}
			},
			{
				AppealCase: {
					id: 'a1',
					appealTypeCode: 'S20',
					LPACode: 'Q1111'
				}
			}
		];

		const mockFormattedAppellantProofs = {};

		const mockResult = { test: 1 };

		// formatter
		const mockAppellantProofsFormatter = jest.fn();
		mockAppellantProofsFormatter.mockReturnValue(mockFormattedAppellantProofs);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);

		it.each(mockAppellantProofs)('should submit appellant proof', async (proof) => {
			getAppellantProofOfEvidenceByAppealId.mockResolvedValue(proof);

			await backOfficeV2Service.submitAppellantProofEvidenceSubmission(
				testCaseRef,
				testUserID,
				mockAppellantProofsFormatter
			);

			expect(getAppellantProofOfEvidenceByAppealId).toHaveBeenCalledWith(testCaseRef);
			expect(getUserById).toHaveBeenCalledWith(testUserID);
			expect(markAppellantProofOfEvidenceAsSubmitted).toHaveBeenCalledWith(
				testCaseRef,
				expect.any(String)
			);
			expect(sendAppellantProofEvidenceSubmissionEmailToAppellantV2).toHaveBeenCalledWith(
				proof,
				mockUser.email
			);
		});

		it.each(mockAppellantProofs)('should error if no service user', async (proof) => {
			getAppellantProofOfEvidenceByAppealId.mockResolvedValue(proof);
			getForEmailCaseAndType.mockResolvedValue(null);

			await expect(
				backOfficeV2Service.submitAppellantProofEvidenceSubmission(
					testCaseRef,
					testUserID,
					mockAppellantProofsFormatter
				)
			).rejects.toThrow(`cannot find appellant service user`);
		});
	});

	describe('submitRule6ProofOfEvidenceSubmission', () => {
		const mockR6Proofs = {
			AppealCase: {
				id: 'a1',
				appealTypeCode: 'S78',
				LPACode: 'Q1111'
			}
		};

		const mockFormattedR6Proofs = {};

		const mockResult = { test: 1 };

		// formatter
		const mockR6ProofsFormatter = jest.fn();
		mockR6ProofsFormatter.mockReturnValue(mockFormattedR6Proofs);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);
		it('should submit rule6 proof', async () => {
			getRule6ProofOfEvidenceByAppealId.mockResolvedValue(mockR6Proofs);

			await backOfficeV2Service.submitRule6ProofOfEvidenceSubmission(
				testCaseRef,
				testUserID,
				mockR6ProofsFormatter
			);

			expect(getRule6ProofOfEvidenceByAppealId).toHaveBeenCalledWith(testUserID, testCaseRef);
			expect(getUserById).toHaveBeenCalledWith(testUserID);
			expect(markRule6ProofOfEvidenceAsSubmitted).toHaveBeenCalledWith(
				testUserID,
				testCaseRef,
				expect.any(String)
			);
			expect(sendRule6ProofEvidenceSubmissionEmailToRule6PartyV2).toHaveBeenCalledWith(
				mockR6Proofs,
				mockUser.email,
				mockServiceUser
			);
		});
	});

	describe('submitRule6StatementSubmission', () => {
		const mockR6Statement = {
			AppealCase: {
				id: 'a1',
				appealTypeCode: 'S78',
				LPACode: 'Q1111'
			}
		};

		const mockFormattedR6Statement = {};

		const mockResult = { test: 1 };

		// formatter
		const mockR6StatementFormatter = jest.fn();
		mockR6StatementFormatter.mockReturnValue(mockFormattedR6Statement);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);

		it('should submit rule6 statement', async () => {
			getRule6StatementByAppealId.mockResolvedValue(mockR6Statement);

			await backOfficeV2Service.submitRule6StatementSubmission(
				testCaseRef,
				testUserID,
				mockR6StatementFormatter
			);

			expect(getRule6StatementByAppealId).toHaveBeenCalledWith(testUserID, testCaseRef);
			expect(getUserById).toHaveBeenCalledWith(testUserID);
			expect(markRule6StatementAsSubmitted).toHaveBeenCalledWith(testUserID, testCaseRef);
			expect(sendRule6StatementSubmissionEmailToRule6PartyV2).toHaveBeenCalledWith(
				mockR6Statement,
				mockUser.email,
				mockServiceUser
			);
		});
	});
});
