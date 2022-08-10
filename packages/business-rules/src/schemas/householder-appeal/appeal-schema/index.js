const pinsYup = require('../../../lib/pins-yup');
const emailValidation = require('./email/email-validation');
const aboutYouValidation = require('./sections/about-you/aboutYouValidation');
const requiredDocumentsValidation = require('./sections/required-documents/required-documents-validation');
const yourAppealValidation = require('./sections/your-appeal/your-appeal-validation');
const appealSubmissionValidation = require('./sections/appeal-submission/appeal-submission-validation');
const appealSiteValidation = require('./sections/appeal-site/appeal-site-validation');
const sectionStatesValidation = require('./section-states/section-states-validation');
const typeOfPlanningApplicationValidation = require('./type-of-planning-application/type-of-planning-application-validation');
const appealTypeValidation = require('./appeal-type/appeal-type-validation');
const stateValidation = require('./state/state-validation');
const submissionDateValidation = require('./submission-date/submission-date-validation');
const createdAtValidation = require('./created-at/created-at-validation');
const updatedAtValidation = require('./updated-at/updated-at-validation');
const decisionDateValidation = require('./decision-date/decision-date-validation');
const planningApplicationNumberValidation = require('./planning-application-number/planning-application-number-validation');
const lpaCodeValidation = require('./lpa-code/lpa-code-validation');
const horizonIdValidation = require('./horizon-id/horizon-id-validation');
const idValidation = require('./id/id-validation');
const eligibilityValidation = require('./eligibility/eligibility-validation');

const appealValidationSchema = () => {
	return pinsYup.object().noUnknown(true).shape({
		id: idValidation(),
		horizonId: horizonIdValidation(),
		lpaCode: lpaCodeValidation(),
		planningApplicationNumber: planningApplicationNumberValidation(),
		decisionDate: decisionDateValidation(),
		createdAt: createdAtValidation(),
		updatedAt: updatedAtValidation(),
		submissionDate: submissionDateValidation(),
		state: stateValidation(),
		appealType: appealTypeValidation(),
		typeOfPlanningApplication: typeOfPlanningApplicationValidation(),
		email: emailValidation(),
		eligibility: eligibilityValidation(),
		aboutYouSection: aboutYouValidation(),
		requiredDocumentsSection: requiredDocumentsValidation(),
		yourAppealSection: yourAppealValidation(),
		appealSubmission: appealSubmissionValidation(),
		appealSiteSection: appealSiteValidation(),
		sectionStates: sectionStatesValidation()
	});
};

module.exports = appealValidationSchema;
