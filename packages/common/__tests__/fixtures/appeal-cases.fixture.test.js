const { getCaseFixture } = require('./appeal-cases.fixture');
const {
	APPEAL_CASE_DECISION_OUTCOME,
	APPEAL_CASE_STATUS,
	APPEAL_CASE_VALIDATION_OUTCOME,
	APPEAL_CASE_PROCEDURE
} = require('@planning-inspectorate/data-model');

const { CASE_TYPES } = require('@pins/common/src/database/data-static');

describe('appeal-cases.fixtures', () => {
	it('should return a valid appeal case fixture', () => {
		const appealTypeCode = CASE_TYPES.HAS.processCode;
		const caseStatus = APPEAL_CASE_STATUS.COMPLETE;
		const caseProcedure = APPEAL_CASE_PROCEDURE.WRITTEN;

		const appealCaseFixture = getCaseFixture(appealTypeCode, caseStatus, caseProcedure);

		expect(appealCaseFixture).toHaveProperty('appealTypeCode', appealTypeCode);
		expect(appealCaseFixture).toHaveProperty('caseStatus', caseStatus);
		expect(appealCaseFixture).toHaveProperty('caseProcedure', caseProcedure);

		const result = appealCaseFixture.setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.VALID);
		expect(result).toHaveProperty('caseValidationOutcome', APPEAL_CASE_VALIDATION_OUTCOME.VALID);
		expect(result).toHaveProperty('caseValidationOutcomeDate');
		expect(appealCaseFixture).toHaveProperty(
			'caseValidationOutcome',
			APPEAL_CASE_VALIDATION_OUTCOME.VALID
		);
		expect(appealCaseFixture).toHaveProperty('caseValidationOutcomeDate');

		const result2 = appealCaseFixture.setDecisionOutcome(
			APPEAL_CASE_DECISION_OUTCOME.ALLOWED,
			true
		);
		expect(result2).toHaveProperty('caseDecisionOutcome', APPEAL_CASE_DECISION_OUTCOME.ALLOWED);
		expect(result2).toHaveProperty('caseDecisionOutcomeDate');
		expect(result2).toHaveProperty('caseDecisionOutcomePublishedDate');
		expect(appealCaseFixture).toHaveProperty(
			'caseDecisionOutcome',
			APPEAL_CASE_DECISION_OUTCOME.ALLOWED
		);
		expect(appealCaseFixture).toHaveProperty('caseDecisionOutcomeDate');
		expect(appealCaseFixture).toHaveProperty('caseDecisionOutcomePublishedDate');
	});
});
