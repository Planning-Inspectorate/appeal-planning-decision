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
} = require('#lib/notify');
const { SERVICE_USER_TYPE } = require('pins-data-model');

jest.mock('#lib/logger');
jest.mock('#lib/notify');
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
	/** @type {import('../../../../src/services/back-office-v2/index')} */
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
		const mockAppealSubmission = {
			id: 'a1',
			appealTypeCode: 'HAS'
		};

		const mockFormattedAppeal = {};

		const mockResult = { test: 1 };

		// formatter
		const mockAppealFormatter = jest.fn();
		mockAppealFormatter.mockReturnValue(mockFormattedAppeal);

		// forwarder
		forwarders.appeal = jest.fn();
		forwarders.appeal.mockResolvedValue(mockResult);

		it('should submit Appeal', async () => {
			const lpa = { test: 1 };
			const result = await backOfficeV2Service.submitAppellantSubmission({
				appellantSubmission: mockAppealSubmission,
				email: mockUser.email,
				lpa,
				formatter: mockAppealFormatter
			});

			expect(mockAppealFormatter).toHaveBeenCalledWith(mockAppealSubmission, lpa);
			expect(mockGetValidator).toHaveBeenCalled();
			expect(mockValidator).toHaveBeenCalledWith(mockFormattedAppeal);
			expect(forwarders.appeal).toHaveBeenCalledWith([mockFormattedAppeal]);
			expect(markAppealAsSubmitted).toHaveBeenCalledWith(mockAppealSubmission.id);
			expect(sendSubmissionReceivedEmailToLpaV2).toHaveBeenCalledWith(mockAppealSubmission);
			expect(sendSubmissionReceivedEmailToAppellantV2).toHaveBeenCalledWith(
				mockAppealSubmission,
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

		it('should error if validation fails', async () => {
			mockValidator.mockReturnValue(false);

			await expect(
				backOfficeV2Service.submitAppellantSubmission({
					appellantSubmission: mockAppealSubmission,
					userId: testUserID,
					formatter: mockAppealFormatter
				})
			).rejects.toThrow(
				'Payload was invalid when checked against appellant submission command schema'
			);

			expect(mockGetValidator).toHaveBeenCalled();
		});
	});

	describe('submitQuestionnaire', () => {
		const mockLPAQ = {
			AppealCase: {
				LPACode: 'Q9999',
				appealTypeCode: 'HAS'
			}
		};

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

		it('should submit LPAQ', async () => {
			getCaseAndAppellant.mockResolvedValue(mockCaseAndAppellant);

			const result = await backOfficeV2Service.submitQuestionnaire(
				testCaseRef,
				mockLPAQ,
				mockFormatter
			);

			expect(mockFormatter).toHaveBeenCalledWith(testCaseRef, mockLPAQ);
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

		it('should use appellant email if no agent', async () => {
			const mockCaseAndAppellant2 = {
				users: [
					{
						serviceUserType: SERVICE_USER_TYPE.APPELLANT,
						emailAddress: 'test2'
					}
				]
			};

			getCaseAndAppellant.mockResolvedValue(mockCaseAndAppellant2);

			await backOfficeV2Service.submitQuestionnaire(testCaseRef, mockLPAQ, mockFormatter);

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

		it('should error if validation fails', async () => {
			mockValidator.mockReturnValue(false);

			await expect(
				backOfficeV2Service.submitQuestionnaire(testCaseRef, mockLPAQ, mockFormatter)
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
		const mockAppealStatement = {
			AppealCase: {
				id: 'a1',
				appealTypeCode: 'S78'
			}
		};

		const mockFormattedAppealFinalComment = {};

		const mockResult = { test: 1 };

		// formatter
		const mockAppealStatementFormatter = jest.fn();
		mockAppealStatementFormatter.mockReturnValue(mockFormattedAppealFinalComment);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);
		it('should submit lpa statement', async () => {
			getLPAStatementByAppealId.mockResolvedValue(mockAppealStatement);

			await backOfficeV2Service.submitLPAStatementSubmission(
				testCaseRef,
				mockAppealStatementFormatter
			);

			expect(getLPAStatementByAppealId).toHaveBeenCalledWith(testCaseRef);
			expect(markStatementAsSubmitted).toHaveBeenCalledWith(testCaseRef, expect.any(String));
			expect(sendLpaStatementSubmissionReceivedEmailToLpaV2).toHaveBeenCalledWith(
				mockAppealStatement
			);
		});
	});

	describe('submitLPAFinalCommentSubmission', () => {
		const mockAppealFinalComment = {
			AppealCase: {
				id: 'a1',
				appealTypeCode: 'S78'
			}
		};

		const mockFormattedAppealFinalComment = {};

		const mockResult = { test: 1 };

		// formatter
		const mockAppealFinalCommentFormatter = jest.fn();
		mockAppealFinalCommentFormatter.mockReturnValue(mockFormattedAppealFinalComment);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);
		it('should submit lpa final comment', async () => {
			getLPAFinalCommentByAppealId.mockResolvedValue(mockAppealFinalComment);

			await backOfficeV2Service.submitLPAFinalCommentSubmission(
				testCaseRef,
				mockAppealFinalCommentFormatter
			);

			expect(getLPAFinalCommentByAppealId).toHaveBeenCalledWith(testCaseRef);
			expect(markLPAFinalCommentAsSubmitted).toHaveBeenCalledWith(testCaseRef, expect.any(String));
			expect(sendLPAFinalCommentSubmissionEmailToLPAV2).toHaveBeenCalledWith(
				mockAppealFinalComment
			);
		});
	});

	describe('submitLpaProofEvidenceSubmission', () => {
		const mockAppealProofEvidence = {
			AppealCase: {
				id: 'a1',
				appealTypeCode: 'S78'
			}
		};

		const mockFormattedAppealFinalComment = {};

		const mockResult = { test: 1 };

		// formatter
		const mockLPAProofsFormatter = jest.fn();
		mockLPAProofsFormatter.mockReturnValue(mockFormattedAppealFinalComment);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);
		it('should submit lpa proof', async () => {
			getLpaProofOfEvidenceByAppealId.mockResolvedValue(mockAppealProofEvidence);

			await backOfficeV2Service.submitLpaProofEvidenceSubmission(
				testCaseRef,
				mockLPAProofsFormatter
			);

			expect(getLpaProofOfEvidenceByAppealId).toHaveBeenCalledWith(testCaseRef);
			expect(markLpaProofOfEvidenceAsSubmitted).toHaveBeenCalledWith(
				testCaseRef,
				expect.any(String)
			);
			expect(sendLPAProofEvidenceSubmissionEmailToLPAV2).toHaveBeenCalledWith(
				mockAppealProofEvidence
			);
		});
	});

	describe('submitAppellantFinalCommentSubmission', () => {
		const mockAppealFinalComment = {
			AppealCase: {
				id: 'a1',
				appealTypeCode: 'S78'
			}
		};

		const mockFormattedAppealFinalComment = {};

		const mockResult = { test: 1 };

		// formatter
		const mockAppealFinalCommentFormatter = jest.fn();
		mockAppealFinalCommentFormatter.mockReturnValue(mockFormattedAppealFinalComment);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);

		it('should submit appellant final comment', async () => {
			getAppellantFinalCommentByAppealId.mockResolvedValue(mockAppealFinalComment);

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
				mockAppealFinalComment,
				mockUser.email
			);
		});

		it('should error if no service user details', async () => {
			getAppellantFinalCommentByAppealId.mockResolvedValue(mockAppealFinalComment);
			getForEmailCaseAndType.mockResolvedValue(null);

			await expect(
				backOfficeV2Service.submitAppellantFinalCommentSubmission({
					testCaseRef,
					testUserID,
					mockAppealFinalCommentFormatter
				})
			).rejects.toThrow(`cannot find appellant service user`);
		});
	});

	describe('submitAppellantProofEvidenceSubmission', () => {
		const mockAppellantProofs = {
			AppealCase: {
				id: 'a1',
				appealTypeCode: 'S78',
				LPACode: 'Q1111'
			}
		};

		const mockFormattedAppellantProofs = {};

		const mockResult = { test: 1 };

		// formatter
		const mockAppellantProofsFormatter = jest.fn();
		mockAppellantProofsFormatter.mockReturnValue(mockFormattedAppellantProofs);

		// forwarder
		forwarders.representation = jest.fn();
		forwarders.representation.mockResolvedValue(mockResult);

		it('should submit appellant proof', async () => {
			getAppellantProofOfEvidenceByAppealId.mockResolvedValue(mockAppellantProofs);

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
				mockAppellantProofs,
				mockUser.email
			);
		});

		it('should error if no service user', async () => {
			getAppellantProofOfEvidenceByAppealId.mockResolvedValue(mockAppellantProofs);
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
				mockUser.email
			);
		});
	});
});
