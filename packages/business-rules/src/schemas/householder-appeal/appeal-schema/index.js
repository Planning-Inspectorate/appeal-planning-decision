const pinsYup = require('../../../lib/pins-yup');
const emailValidation = require('./email/email-validation');
const typeOfPlanningApplicationValidation = require('./type-of-planning-application/type-of-planning-application-validation');
const appealTypeValidation = require('./appeal-type/appeal-type-validation');
const stateValidation = require('./state/state-validation');
const planningApplicationNumberValidation = require('./planning-application-number/planning-application-number-validation');
const lpaCodeValidation = require('./lpa-code/lpa-code-validation');
const idValidation = require('./id/id-validation');
const eligibilityValidation = require('./eligibility/eligibility-validation');
const dateValidation = require('../../components/date-validation');

const appealValidationSchema = () => {
	return pinsYup
		.object()
		.noUnknown(true)
		.shape({
			id: idValidation(),
			lpaCode: lpaCodeValidation(),
			planningApplicationNumber: planningApplicationNumberValidation(),
			decisionDate: dateValidation(),
			createdAt: dateValidation(true),
			updatedAt: dateValidation(true),
			state: stateValidation(),
			appealType: appealTypeValidation(),
			typeOfPlanningApplication: typeOfPlanningApplicationValidation(),
			email: emailValidation(),
			hideFromDashboard: pinsYup.bool().nullable(),
			eligibility: eligibilityValidation()
		});
};

module.exports = appealValidationSchema;
