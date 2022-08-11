const pinsYup = require('../../../lib/pins-yup');

const { idValidation } = require('./id/id');
const { eligibilityValidation } = require('./eligibility/eligibility');
const {
	contactDetailsSectionValidation
} = require('./sections/contact-details-section/contact-details-section');
const {
	appealSiteSectionValidation
} = require('./sections/appeal-site-section/appeal-site-section');
const {
	appealDecisionSectionValidation
} = require('./sections/appeal-decision-section/appeal-decision-section');
const {
	planningApplicationDocumentsSectionValidation
} = require('./sections/planning-application-documents-section/planning-application-documents-section');
const {
	appealDocumentsSectionValidation
} = require('./sections/appeal-documents-section/appeal-documents-section');
const { appealSubmissionValidation } = require('./sections/appeal-submission/appeal-submission');
const { sectionStatesValidation } = require('./section-states/section-states');
const { dateValidation } = require('../../components/insert/date-validation');
const { stringValidation } = require('../../components/insert/string-validation');
const { stateValidation } = require('./state/state');
const { appealTypeValidation } = require('./appeal-type/appeal-type');
const {
	typeOfPlanningApplicationValidation
} = require('./type-of-planning-application/type-of-planning-application');

const appealValidationSchema = () => {
	return pinsYup
		.object()
		.noUnknown(true)
		.shape({
			id: idValidation(),
			horizonId: stringValidation(20),
			lpaCode: stringValidation(20),
			planningApplicationNumber: stringValidation(30),
			decisionDate: dateValidation(),
			createdAt: dateValidation(true),
			updatedAt: dateValidation(true),
			submissionDate: dateValidation(),
			state: stateValidation(),
			appealType: appealTypeValidation(),
			typeOfPlanningApplication: typeOfPlanningApplicationValidation(),
			email: pinsYup.string().email().max(255).nullable(),
			eligibility: eligibilityValidation(),
			contactDetailsSection: contactDetailsSectionValidation(),
			appealSiteSection: appealSiteSectionValidation(),
			appealDecisionSection: appealDecisionSectionValidation(),
			planningApplicationDocumentsSection: planningApplicationDocumentsSectionValidation(),
			appealDocumentsSection: appealDocumentsSectionValidation(),
			appealSubmission: appealSubmissionValidation(),
			sectionStates: sectionStatesValidation()
		});
};

module.exports = { appealValidationSchema };
