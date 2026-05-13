const { appeal, generic } = require('../../validation');
const createYupError = require('../../utils/create-yup-error');

function isInThePast(value, ...rest) {
	const errorMessage = rest.errorMessage || 'must be in the past';
	return this.test('decisionDate', null, function test() {
		return generic.date.isInThePast(value) || createYupError.call(this, errorMessage);
	});
}

function isWithinDeadlinePeriod(value, ...rest) {
	const errorMessage = rest.errorMessage || 'must be before the deadline date';
	return this.test('decisionDate', null, function test() {
		return (
			appeal.decisionDate.isWithinDecisionDateExpiryPeriod({
				givenDate: value,
				appealType: this.options.parent.appealType,
				applicationDecision: this.options.parent.eligibility?.applicationDecision,
				isListedBuilding: this.options.parent.eligibility?.isListedBuilding,
				enforcementEffectiveDate: this.options.parent.eligibility?.enforcementEffectiveDate,
				hasContactedPlanningInspectorate:
					this.options.parent.eligibility?.hasContactedPlanningInspectorate
			}) || createYupError.call(this, errorMessage)
		);
	});
}

module.exports = {
	isInThePast,
	isWithinDeadlinePeriod
};
