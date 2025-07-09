const { getSaveFunction } = require('./get-journey-save');
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
