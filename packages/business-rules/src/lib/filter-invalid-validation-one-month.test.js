const {
	ifInvalidOnlyRecentValidation,
	ifInvalidOnlyOldValidation
} = require('./filter-invalid-validation-one-month');
const { getCaseFixture } = require('@pins/common/__tests__/fixtures/appeal-cases.fixture.js');
const {
	APPEAL_CASE_STATUS,
	APPEAL_CASE_VALIDATION_OUTCOME,
	APPEAL_CASE_PROCEDURE
} = require('@planning-inspectorate/data-model');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

describe('filter-invalid-validation-one-month', () => {
	describe('ifInvalidOnlyRecentValidation', () => {
		it('ignores non invalid appeals', () => {
			const appeals = [
				getCaseFixture(
					CASE_TYPES.HAS.processCode,
					APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
					APPEAL_CASE_PROCEDURE.WRITTEN
				)
			];
			const result = appeals.filter(ifInvalidOnlyRecentValidation);
			expect(result).toEqual(appeals);
		});

		it('hides invalid appeals from case decision', () => {
			const appeals = [
				getCaseFixture(
					CASE_TYPES.HAS.processCode,
					APPEAL_CASE_STATUS.INVALID,
					APPEAL_CASE_PROCEDURE.WRITTEN
				)
					.setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.VALID)
					.setDecisionOutcome(APPEAL_CASE_VALIDATION_OUTCOME.INVALID, true)
			];
			const result = appeals.filter(ifInvalidOnlyRecentValidation);
			expect(result).toEqual([]);
		});

		it('hides invalid appeals from a long time ago', () => {
			const appeals = [
				getCaseFixture(
					CASE_TYPES.HAS.processCode,
					APPEAL_CASE_STATUS.INVALID,
					APPEAL_CASE_PROCEDURE.WRITTEN
				).setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.INVALID, new Date('2025-12-01'))
			];
			const result = appeals.filter(ifInvalidOnlyRecentValidation);
			expect(result).toEqual([]);
		});

		it('shows invalid appeals from a recent date', () => {
			const appeals = [
				getCaseFixture(
					CASE_TYPES.HAS.processCode,
					APPEAL_CASE_STATUS.INVALID,
					APPEAL_CASE_PROCEDURE.WRITTEN
				).setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.INVALID)
			];
			const result = appeals.filter(ifInvalidOnlyRecentValidation);
			expect(result).toEqual(appeals);
		});
	});

	describe('ifInvalidOnlyOldValidation', () => {
		it('ignores non invalid appeals', () => {
			const appeals = [
				getCaseFixture(
					CASE_TYPES.HAS.processCode,
					APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
					APPEAL_CASE_PROCEDURE.WRITTEN
				)
			];
			const result = appeals.filter(ifInvalidOnlyOldValidation);
			expect(result).toEqual(appeals);
		});

		it('hides invalid appeals from case decision', () => {
			const appeals = [
				getCaseFixture(
					CASE_TYPES.HAS.processCode,
					APPEAL_CASE_STATUS.INVALID,
					APPEAL_CASE_PROCEDURE.WRITTEN
				)
					.setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.VALID)
					.setDecisionOutcome(APPEAL_CASE_VALIDATION_OUTCOME.INVALID, true)
			];
			const result = appeals.filter(ifInvalidOnlyOldValidation);
			expect(result).toEqual([]);
		});

		it('shows invalid appeals from a long time ago', () => {
			const appeals = [
				getCaseFixture(
					CASE_TYPES.HAS.processCode,
					APPEAL_CASE_STATUS.INVALID,
					APPEAL_CASE_PROCEDURE.WRITTEN
				).setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.INVALID, new Date('2025-12-01'))
			];
			const result = appeals.filter(ifInvalidOnlyOldValidation);
			expect(result).toEqual(appeals);
		});

		it('hides invalid appeals from a recent date', () => {
			const appeals = [
				getCaseFixture(
					CASE_TYPES.HAS.processCode,
					APPEAL_CASE_STATUS.INVALID,
					APPEAL_CASE_PROCEDURE.WRITTEN
				).setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.INVALID)
			];
			const result = appeals.filter(ifInvalidOnlyOldValidation);
			expect(result).toEqual([]);
		});
	});
});
