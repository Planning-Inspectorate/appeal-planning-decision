const pinsYup = require('../../../lib/pins-yup');
const { SECTION_STATE } = require('../../../constants');
const appealDetails = require('../../components/appeal-details-validation/appeal-details-validation');
const eligibilityValidation = require('./eligibility/eligibility-validation');
const contactDetailsValidation = require('./sections/contact-details/contact-details-validation');
const appealSiteValidation = require('./sections/appeal-site/appeal-site-validation');
const appealDecisionValidation = require('./sections/appeal-decision/appeal-decision-validation');
const planningApplicationDocumentsValidation = require('./sections/planning-application-documents/planning-application-documents-validation');
const appealDocumentsValidation = require('./sections/appeal-documents/appeal-documents-validation');
const appealSubmissionValidation = require('./sections/appeal-submission/appeal-submission-validation');

const appealValidationSchema = () => {
	return pinsYup
		.object()
		.noUnknown(true)
		.shape({
			...appealDetails(),
			eligibility: eligibilityValidation(),
			contactDetailsSection: contactDetailsValidation(),
			appealSiteSection: appealSiteValidation(),
			appealDecisionSection: appealDecisionValidation(),
			planningApplicationDocumentsSection: planningApplicationDocumentsValidation(),
			appealDocumentsSection: appealDocumentsValidation(),
			appealSubmission: appealSubmissionValidation(),
			sectionStates: pinsYup
				.object()
				.shape({
					contactDetailsSection: pinsYup
						.object()
						.shape({
							isOriginalApplicant: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							contact: pinsYup.string().oneOf(Object.values(SECTION_STATE)).default('NOT STARTED'),
							appealingOnBehalfOf: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED')
						})
						.noUnknown(true),
					appealSiteSection: pinsYup
						.object()
						.shape({
							siteAddress: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							ownsAllTheLand: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							agriculturalHolding: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							areYouATenant: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							tellingTheTenants: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							otherTenants: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							visibleFromRoad: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							healthAndSafety: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							someOfTheLand: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							knowTheOwners: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							identifyingTheLandOwners: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							advertisingYourAppeal: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							tellingTheLandowners: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED')
						})
						.noUnknown(true),
					appealDecisionSection: pinsYup
						.object()
						.shape({
							procedureType: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							hearing: pinsYup.string().oneOf(Object.values(SECTION_STATE)).default('NOT STARTED'),
							inquiry: pinsYup.string().oneOf(Object.values(SECTION_STATE)).default('NOT STARTED'),
							inquiryExpectedDays: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							draftStatementOfCommonGround: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED')
						})
						.noUnknown(true),
					planningApplicationDocumentsSection: pinsYup
						.object()
						.shape({
							ownershipCertificate: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							descriptionDevelopmentCorrect: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							plansDrawingsSupportingDocuments: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							originalApplication: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							decisionLetter: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							designAccessStatement: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							designAccessStatementSubmitted: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							originalDecisionNotice: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							letterConfirmingApplication: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED')
						})
						.noUnknown(true),
					appealDocumentsSection: pinsYup
						.object()
						.shape({
							appealStatement: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							plansDrawings: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							newPlansDrawings: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							plansPlanningObligation: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							planningObligationStatus: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							planningObligationDocuments: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							planningObligationDeadline: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							draftPlanningObligations: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							supportingDocuments: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED'),
							newSupportingDocuments: pinsYup
								.string()
								.oneOf(Object.values(SECTION_STATE))
								.default('NOT STARTED')
						})
						.noUnknown(true)
				})
				.noUnknown(true)
		});
};

module.exports = appealValidationSchema;
