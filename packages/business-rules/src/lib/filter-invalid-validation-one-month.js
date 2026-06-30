const {
	APPEAL_CASE_STATUS,
	APPEAL_CASE_VALIDATION_OUTCOME
} = require('@planning-inspectorate/data-model');
const { differenceInCalendarDays } = require('date-fns');
const INVALID_APPEAL_TIME_LIMIT = 28;

/**
 * filters out invalid appeals that have not been invalidated within the last 28 days from appellant case validation
 * @param {import('appeals-service-api').Api.AppealCaseDetailed} appeal
 * @returns {boolean}
 */
const ifInvalidOnlyRecentValidation = (appeal) => {
	// don't impact non invalid appeals
	if (appeal.caseStatus !== APPEAL_CASE_STATUS.INVALID) return true;

	// remove appeals given invalid decision
	if (appeal.caseValidationOutcome !== APPEAL_CASE_VALIDATION_OUTCOME.INVALID) return false;

	// if we don't know when the appeal was invalidated, we can't show it
	if (!appeal.caseValidationDate) return false;

	const daysSinceInvalidated = differenceInCalendarDays(
		new Date(),
		new Date(appeal.caseValidationDate)
	);

	// only show the validation invalid appeals if they were marked as invalid within the last 28 days
	return daysSinceInvalidated < INVALID_APPEAL_TIME_LIMIT;
};

/**
 * filters out invalid appeals that have not been invalidated within the last 28 days from appellant case validation
 * @param {import('appeals-service-api').Api.AppealCaseDetailed} appeal
 * @returns {boolean}
 */
const ifInvalidOnlyOldValidation = (appeal) => {
	// don't impact non invalid appeals
	if (appeal.caseStatus !== APPEAL_CASE_STATUS.INVALID) return true;

	// remove appeals given invalid decision
	if (appeal.caseValidationOutcome !== APPEAL_CASE_VALIDATION_OUTCOME.INVALID) return false;

	// if we don't know when the appeal was invalidated, we can't show it
	if (!appeal.caseValidationDate) return false;

	const daysSinceInvalidated = differenceInCalendarDays(
		new Date(),
		new Date(appeal.caseValidationDate)
	);

	// only show the validation invalid appeals if they were marked as invalid within the last 28 days
	return daysSinceInvalidated >= INVALID_APPEAL_TIME_LIMIT;
};

module.exports = {
	ifInvalidOnlyOldValidation,
	ifInvalidOnlyRecentValidation,
	INVALID_APPEAL_TIME_LIMIT
};
