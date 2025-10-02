const dateValidation = require('../date-validation');
const appealTypeValidation = require('./appeal-type/appeal-type-validation');
const emailValidation = require('./email/email-validation');
const horizonIdValidation = require('./horizon-id/horizon-id-validation');
const idValidation = require('./id/id-validation');
const lpaCodeValidation = require('./lpa-code/lpa-code-validation');
const planningApplicationNumberValidation = require('./planning-application-number/planning-application-number-validation');
const stateValidation = require('./state/state-validation');
const typeOfPlanningApplicationValidation = require('./type-of-planning-application/type-of-planning-application-validation');
const pinsYup = require('../../../lib/pins-yup');

const appealDetailsValidation = () => {
	return {
		id: idValidation(),
		horizonId: horizonIdValidation(),
		lpaCode: lpaCodeValidation(),
		planningApplicationNumber: planningApplicationNumberValidation(),
		decisionDate: dateValidation(),
		createdAt: dateValidation(true),
		updatedAt: dateValidation(true),
		submissionDate: dateValidation(),
		state: stateValidation(),
		appealType: appealTypeValidation(),
		typeOfPlanningApplication: typeOfPlanningApplicationValidation(),
		email: emailValidation(),
		hideFromDashboard: pinsYup.bool().nullable()
	};
};

module.exports = appealDetailsValidation;
