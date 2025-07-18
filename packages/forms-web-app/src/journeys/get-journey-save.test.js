const {
	getSaveFunction,
	getUploadDoumentFunction,
	getRemoveDocumentFunction
} = require('./get-journey-save');
const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { JOURNEY_TYPE } = require('@pins/common/src/dynamic-forms/journey-types');

describe('getSaveFunction', () => {
	const mockApiClient = {
		patchLPAQuestionnaire: jest.fn(),
		updateAppellantSubmission: jest.fn(),
		patchLPAStatement: jest.fn(),
		patchRule6StatementSubmission: jest.fn(),
		patchAppellantFinalCommentSubmission: jest.fn(),
		patchLPAFinalCommentSubmission: jest.fn(),
		patchAppellantProofOfEvidenceSubmission: jest.fn(),
		patchLpaProofOfEvidenceSubmission: jest.fn(),
		patchRule6ProofOfEvidenceSubmission: jest.fn()
	};

	it('returns patchLPAQuestionnaire for questionnaire LPA', () => {
		const journeyType = { type: JOURNEY_TYPE.questionnaire, userType: LPA_USER_ROLE };
		const fn = getSaveFunction(journeyType, mockApiClient);
		fn();
		expect(mockApiClient.patchLPAQuestionnaire).toHaveBeenCalled();
	});

	it('returns updateAppellantSubmission for appealForm appellant', () => {
		const journeyType = { type: JOURNEY_TYPE.appealForm, userType: APPEAL_USER_ROLES.APPELLANT };
		const fn = getSaveFunction(journeyType, mockApiClient);
		fn();
		expect(mockApiClient.updateAppellantSubmission).toHaveBeenCalled();
	});

	it('returns patchLPAStatement for statement LPA', () => {
		const journeyType = { type: JOURNEY_TYPE.statement, userType: LPA_USER_ROLE };
		const fn = getSaveFunction(journeyType, mockApiClient);
		fn();
		expect(mockApiClient.patchLPAStatement).toHaveBeenCalled();
	});

	it('returns patchRule6StatementSubmission for statement rule6', () => {
		const journeyType = { type: JOURNEY_TYPE.statement, userType: APPEAL_USER_ROLES.RULE_6_PARTY };
		const fn = getSaveFunction(journeyType, mockApiClient);
		fn();
		expect(mockApiClient.patchRule6StatementSubmission).toHaveBeenCalled();
	});

	it('returns patchAppellantFinalCommentSubmission for finalComments appellant', () => {
		const journeyType = { type: JOURNEY_TYPE.finalComments, userType: APPEAL_USER_ROLES.APPELLANT };
		const fn = getSaveFunction(journeyType, mockApiClient);
		fn();
		expect(mockApiClient.patchAppellantFinalCommentSubmission).toHaveBeenCalled();
	});

	it('returns patchLPAFinalCommentSubmission for finalComments LPA', () => {
		const journeyType = { type: JOURNEY_TYPE.finalComments, userType: LPA_USER_ROLE };
		const fn = getSaveFunction(journeyType, mockApiClient);
		fn();
		expect(mockApiClient.patchLPAFinalCommentSubmission).toHaveBeenCalled();
	});

	it('returns patchAppellantProofOfEvidenceSubmission for proofEvidence appellant', () => {
		const journeyType = { type: JOURNEY_TYPE.proofEvidence, userType: APPEAL_USER_ROLES.APPELLANT };
		const fn = getSaveFunction(journeyType, mockApiClient);
		fn();
		expect(mockApiClient.patchAppellantProofOfEvidenceSubmission).toHaveBeenCalled();
	});

	it('returns patchLpaProofOfEvidenceSubmission for proofEvidence LPA', () => {
		const journeyType = { type: JOURNEY_TYPE.proofEvidence, userType: LPA_USER_ROLE };
		const fn = getSaveFunction(journeyType, mockApiClient);
		fn();
		expect(mockApiClient.patchLpaProofOfEvidenceSubmission).toHaveBeenCalled();
	});

	it('returns patchRule6ProofOfEvidenceSubmission for proofEvidence rule6', () => {
		const journeyType = {
			type: JOURNEY_TYPE.proofEvidence,
			userType: APPEAL_USER_ROLES.RULE_6_PARTY
		};
		const fn = getSaveFunction(journeyType, mockApiClient);
		fn();
		expect(mockApiClient.patchRule6ProofOfEvidenceSubmission).toHaveBeenCalled();
	});

	it('throws if no save function found', () => {
		const journeyType = { type: 'unknown', userType: 'unknown' };
		expect(() => getSaveFunction(journeyType, mockApiClient)).toThrow(
			'No save function found for journey type: unknown_unknown'
		);
	});
});

describe('getUploadDoumentFunction', () => {
	const mockApiClient = {
		postLPASubmissionDocumentUpload: jest.fn(),
		postAppellantSubmissionDocumentUpload: jest.fn(),
		postLPAStatementDocumentUpload: jest.fn(),
		postRule6StatementDocumentUpload: jest.fn(),
		postAppellantFinalCommentDocumentUpload: jest.fn(),
		postLPAFinalCommentDocumentUpload: jest.fn(),
		postAppellantProofOfEvidenceDocumentUpload: jest.fn(),
		postLpaProofOfEvidenceDocumentUpload: jest.fn(),
		postRule6ProofOfEvidenceDocumentUpload: jest.fn()
	};
	const baseJourney = { id: 'id', caseType: 'caseType' };

	it('returns postLPASubmissionDocumentUpload for questionnaire LPA', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.questionnaire,
			userType: LPA_USER_ROLE
		};
		const fn = getUploadDoumentFunction(journeyType, mockApiClient);
		fn('fileId', {});
		expect(mockApiClient.postLPASubmissionDocumentUpload).toHaveBeenCalled();
	});

	it('returns postAppellantSubmissionDocumentUpload for appealForm appellant', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.appealForm,
			userType: APPEAL_USER_ROLES.APPELLANT
		};
		const fn = getUploadDoumentFunction(journeyType, mockApiClient);
		fn('fileId', {});
		expect(mockApiClient.postAppellantSubmissionDocumentUpload).toHaveBeenCalled();
	});

	it('returns postLPAStatementDocumentUpload for statement LPA', () => {
		const journeyType = { ...baseJourney, type: JOURNEY_TYPE.statement, userType: LPA_USER_ROLE };
		const fn = getUploadDoumentFunction(journeyType, mockApiClient);
		fn('fileId', {});
		expect(mockApiClient.postLPAStatementDocumentUpload).toHaveBeenCalled();
	});

	it('returns postRule6StatementDocumentUpload for statement rule6', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.statement,
			userType: APPEAL_USER_ROLES.RULE_6_PARTY
		};
		const fn = getUploadDoumentFunction(journeyType, mockApiClient);
		fn('fileId', {});
		expect(mockApiClient.postRule6StatementDocumentUpload).toHaveBeenCalled();
	});

	it('returns postAppellantFinalCommentDocumentUpload for finalComments appellant', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.finalComments,
			userType: APPEAL_USER_ROLES.APPELLANT
		};
		const fn = getUploadDoumentFunction(journeyType, mockApiClient);
		fn('fileId', {});
		expect(mockApiClient.postAppellantFinalCommentDocumentUpload).toHaveBeenCalled();
	});

	it('returns postLPAFinalCommentDocumentUpload for finalComments LPA', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.finalComments,
			userType: LPA_USER_ROLE
		};
		const fn = getUploadDoumentFunction(journeyType, mockApiClient);
		fn('fileId', {});
		expect(mockApiClient.postLPAFinalCommentDocumentUpload).toHaveBeenCalled();
	});

	it('returns postAppellantProofOfEvidenceDocumentUpload for proofEvidence appellant', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.proofEvidence,
			userType: APPEAL_USER_ROLES.APPELLANT
		};
		const fn = getUploadDoumentFunction(journeyType, mockApiClient);
		fn('fileId', {});
		expect(mockApiClient.postAppellantProofOfEvidenceDocumentUpload).toHaveBeenCalled();
	});

	it('returns postLpaProofOfEvidenceDocumentUpload for proofEvidence LPA', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.proofEvidence,
			userType: LPA_USER_ROLE
		};
		const fn = getUploadDoumentFunction(journeyType, mockApiClient);
		fn('fileId', {});
		expect(mockApiClient.postLpaProofOfEvidenceDocumentUpload).toHaveBeenCalled();
	});

	it('returns postRule6ProofOfEvidenceDocumentUpload for proofEvidence rule6', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.proofEvidence,
			userType: APPEAL_USER_ROLES.RULE_6_PARTY
		};
		const fn = getUploadDoumentFunction(journeyType, mockApiClient);
		fn('fileId', {});
		expect(mockApiClient.postRule6ProofOfEvidenceDocumentUpload).toHaveBeenCalled();
	});

	it('throws if no upload function found', () => {
		const journeyType = { ...baseJourney, type: 'unknown', userType: LPA_USER_ROLE };
		expect(() => getUploadDoumentFunction(journeyType, mockApiClient)).toThrow(
			'No save function found for journey type: unknown_LPAUser'
		);
	});
});

describe('getRemoveDocumentFunction', () => {
	const mockApiClient = {
		deleteLPASubmissionDocumentUpload: jest.fn(),
		deleteAppellantSubmissionDocumentUpload: jest.fn(),
		deleteLPAStatementDocumentUpload: jest.fn(),
		deleteRule6StatementDocumentUpload: jest.fn(),
		deleteAppellantFinalCommentDocumentUpload: jest.fn(),
		deleteLPAFinalCommentDocumentUpload: jest.fn(),
		deleteAppellantProofOfEvidenceDocumentUpload: jest.fn(),
		deleteLpaProofOfEvidenceDocumentUpload: jest.fn(),
		deleteRule6ProofOfEvidenceDocumentUpload: jest.fn()
	};
	const baseJourney = { id: 'id', caseType: 'caseType' };

	it('returns deleteLPASubmissionDocumentUpload for questionnaire LPA', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.questionnaire,
			userType: LPA_USER_ROLE
		};
		const fn = getRemoveDocumentFunction(journeyType, mockApiClient);
		fn('fileId', 'docId');
		expect(mockApiClient.deleteLPASubmissionDocumentUpload).toHaveBeenCalled();
	});

	it('returns deleteAppellantSubmissionDocumentUpload for appealForm appellant', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.appealForm,
			userType: APPEAL_USER_ROLES.APPELLANT
		};
		const fn = getRemoveDocumentFunction(journeyType, mockApiClient);
		fn('fileId', 'docId');
		expect(mockApiClient.deleteAppellantSubmissionDocumentUpload).toHaveBeenCalled();
	});

	it('returns deleteLPAStatementDocumentUpload for statement LPA', () => {
		const journeyType = { ...baseJourney, type: JOURNEY_TYPE.statement, userType: LPA_USER_ROLE };
		const fn = getRemoveDocumentFunction(journeyType, mockApiClient);
		fn('fileId', 'docId');
		expect(mockApiClient.deleteLPAStatementDocumentUpload).toHaveBeenCalled();
	});

	it('returns deleteRule6StatementDocumentUpload for statement rule6', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.statement,
			userType: APPEAL_USER_ROLES.RULE_6_PARTY
		};
		const fn = getRemoveDocumentFunction(journeyType, mockApiClient);
		fn('fileId', 'docId');
		expect(mockApiClient.deleteRule6StatementDocumentUpload).toHaveBeenCalled();
	});

	it('returns deleteAppellantFinalCommentDocumentUpload for finalComments appellant', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.finalComments,
			userType: APPEAL_USER_ROLES.APPELLANT
		};
		const fn = getRemoveDocumentFunction(journeyType, mockApiClient);
		fn('fileId', 'docId');
		expect(mockApiClient.deleteAppellantFinalCommentDocumentUpload).toHaveBeenCalled();
	});

	it('returns deleteLPAFinalCommentDocumentUpload for finalComments LPA', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.finalComments,
			userType: LPA_USER_ROLE
		};
		const fn = getRemoveDocumentFunction(journeyType, mockApiClient);
		fn('fileId', 'docId');
		expect(mockApiClient.deleteLPAFinalCommentDocumentUpload).toHaveBeenCalled();
	});

	it('returns deleteAppellantProofOfEvidenceDocumentUpload for proofEvidence appellant', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.proofEvidence,
			userType: APPEAL_USER_ROLES.APPELLANT
		};
		const fn = getRemoveDocumentFunction(journeyType, mockApiClient);
		fn('fileId', 'docId');
		expect(mockApiClient.deleteAppellantProofOfEvidenceDocumentUpload).toHaveBeenCalled();
	});

	it('returns deleteLpaProofOfEvidenceDocumentUpload for proofEvidence LPA', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.proofEvidence,
			userType: LPA_USER_ROLE
		};
		const fn = getRemoveDocumentFunction(journeyType, mockApiClient);
		fn('fileId', 'docId');
		expect(mockApiClient.deleteLpaProofOfEvidenceDocumentUpload).toHaveBeenCalled();
	});

	it('returns deleteRule6ProofOfEvidenceDocumentUpload for proofEvidence rule6', () => {
		const journeyType = {
			...baseJourney,
			type: JOURNEY_TYPE.proofEvidence,
			userType: APPEAL_USER_ROLES.RULE_6_PARTY
		};
		const fn = getRemoveDocumentFunction(journeyType, mockApiClient);
		fn('fileId', 'docId');
		expect(mockApiClient.deleteRule6ProofOfEvidenceDocumentUpload).toHaveBeenCalled();
	});

	it('throws if no delete function found', () => {
		const journeyType = { ...baseJourney, type: 'unknown', userType: LPA_USER_ROLE };
		expect(() => getRemoveDocumentFunction(journeyType, mockApiClient)).toThrow(
			'No delete function found for journey type: unknown_LPAUser'
		);
	});
});
