const { questions } = require('../questions');
const { Journey } = require('../journey');
const { Section } = require('../section');
const {
	questionHasAnswerBuilder,
	questionsHaveAnswersBuilder,
	questionHasNonEmptyStringAnswer,
	questionHasNonEmptyNumberAnswer
} = require('../dynamic-components/utils/question-has-answer');

const baseS78SubmissionUrl = '/appeals/full-planning';
const taskListUrl = 'appeal-form/your-appeal';
const s78JourneyTemplate = 'submission-form-template.njk';
const listingPageViewPath = 'dynamic-components/task-list/submission';
const informationPageViewPath = 'dynamic-components/submission-information';
const journeyTitle = 'Appeal a planning decision';

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 */

/**
 * A Journey for appellants starting an appeal
 * @class
 */
class S78AppealFormJourney extends Journey {
	/**
	 * creates an instance of a HAS Journey
	 * @param {JourneyResponse} response - an object that handles the response for this journey (needs to always be passed in as it contains the journey url segment)
	 */
	constructor(response) {
		super({
			baseUrl: `${baseS78SubmissionUrl}?id=${response.referenceId}`,
			taskListUrl: taskListUrl,
			response: response,
			journeyTemplate: s78JourneyTemplate,
			listingPageViewPath: listingPageViewPath,
			informationPageViewPath: informationPageViewPath,
			journeyTitle: journeyTitle,
			returnToListing: true
		});
		console.log('###', response);
		const questionHasAnswer = questionHasAnswerBuilder(response);
		const questionsHaveAnswers = questionsHaveAnswersBuilder(response);
		const questionHasNonEmptyString = questionHasNonEmptyStringAnswer(response);
		const questionHasNonEmptyNumber = questionHasNonEmptyNumberAnswer(response);

		const shouldDisplayIdentifyingLandowners = (() => {
			if (questionHasAnswer(questions.ownsAllLand, 'yes')) return false;
			if (
				questionHasAnswer(questions.ownsSomeLand, 'yes') &&
				questionHasAnswer(questions.knowsWhoOwnsRestOfLand, 'yes')
			)
				return false;
			if (
				questionHasAnswer(questions.ownsSomeLand, 'no') &&
				questionHasAnswer(questions.knowsWhoOwnsLandInvolved, 'yes')
			)
				return false;

			return true;
		})();

		const shouldDisplayTellingLandowners = (() => {
			if (questionHasAnswer(questions.ownsAllLand, 'yes')) return false;

			if (
				questionsHaveAnswers(
					[
						[questions.ownsSomeLand, 'yes'],
						[questions.knowsWhoOwnsRestOfLand, 'no']
					],
					{ logicalCombinator: 'and' }
				) ||
				questionsHaveAnswers(
					[
						[questions.ownsSomeLand, 'no'],
						[questions.knowsWhoOwnsLandInvolved, 'no']
					],
					{ logicalCombinator: 'and' }
				)
			)
				return false;

			return true;
		})();

		const shouldDisplayTellingTenants = (() => {
			if (
				questionHasAnswer(questions.agriculturalHolding, 'yes') &&
				(questionHasAnswer(questions.tenantAgriculturalHolding, 'no') ||
					questionsHaveAnswers(
						[
							[questions.tenantAgriculturalHolding, 'yes'],
							[questions.otherTenantsAgriculturalHolding, 'yes']
						],
						{ logicalCombinator: 'and' }
					))
			)
				return true;

			return false;
		})();

		/**
		 * @param {JourneyResponse} response
		 * @returns {boolean}
		 */
		const shouldDisplayUploadDecisionLetter = (response) => {
			return response.answers.applicationDecision !== 'nodecisionreceived';
		};

		this.sections.push(
			new Section('Prepare appeal', 'prepare-appeal')
				.addQuestion(questions.applicationName)
				.addQuestion(questions.applicantName)
				.withCondition(questionHasAnswer(questions.applicationName, 'no'))
				.addQuestion(questions.contactDetails)
				.addQuestion(questions.contactPhoneNumber)
				.addQuestion(questions.appealSiteAddress)
				.addQuestion(questions.s78SiteArea)
				.addQuestion(questions.appellantGreenBelt)
				.addQuestion(questions.ownsAllLand)
				.addQuestion(questions.ownsSomeLand)
				.withCondition(questionHasAnswer(questions.ownsAllLand, 'no'))
				.addQuestion(questions.knowsWhoOwnsRestOfLand)
				.withCondition(
					questionsHaveAnswers(
						[
							[questions.ownsSomeLand, 'yes'],
							[questions.ownsAllLand, 'no']
						],
						{ logicalCombinator: 'and' }
					)
				)
				.addQuestion(questions.knowsWhoOwnsLandInvolved)
				.withCondition(
					questionsHaveAnswers(
						[
							[questions.ownsSomeLand, 'no'],
							[questions.ownsAllLand, 'no']
						],
						{ logicalCombinator: 'and' }
					)
				)
				.addQuestion(questions.identifyingLandowners)
				.withCondition(shouldDisplayIdentifyingLandowners)
				.addQuestion(questions.advertisingAppeal)
				.withCondition(
					shouldDisplayIdentifyingLandowners &&
						questionHasAnswer(questions.identifyingLandowners, 'yes')
				)
				.addQuestion(questions.tellingLandowners)
				.withCondition(shouldDisplayTellingLandowners)
				.addQuestion(questions.agriculturalHolding)
				.addQuestion(questions.tenantAgriculturalHolding)
				.withCondition(questionHasAnswer(questions.agriculturalHolding, 'yes'))
				.addQuestion(questions.otherTenantsAgriculturalHolding)
				.withCondition(
					questionsHaveAnswers(
						[
							[questions.agriculturalHolding, 'yes'],
							[questions.tenantAgriculturalHolding, 'yes']
						],
						{ logicalCombinator: 'and' }
					)
				)
				.addQuestion(questions.informedTenantsAgriculturalHolding)
				.withCondition(shouldDisplayTellingTenants)
				.addQuestion(questions.inspectorAccess)
				.addQuestion(questions.healthAndSafety)
				.addQuestion(questions.enterApplicationReference)
				.addQuestion(questions.planningApplicationDate())
				.addQuestion(questions.enterDevelopmentDescription)
				.addQuestion(questions.updateDevelopmentDescription)
				.addQuestion(questions.appellantProcedurePreference)
				.addQuestion(questions.appellantPreferHearing)
				.withCondition(questionHasAnswer(questions.appellantProcedurePreference, 'hearing'))
				.addQuestion(questions.appellantPreferInquiry)
				.withCondition(questionHasAnswer(questions.appellantProcedurePreference, 'inquiry'))
				.addQuestion(questions.inquiryHowManyDays)
				.withCondition(
					questionHasAnswer(questions.appellantProcedurePreference, 'inquiry') &&
						questionHasNonEmptyString(questions.appellantPreferInquiry)
				)
				.addQuestion(questions.inquiryHowManyWitnesses)
				.withCondition(
					questionHasAnswer(questions.appellantProcedurePreference, 'inquiry') &&
						questionHasNonEmptyString(questions.appellantPreferInquiry) &&
						questionHasNonEmptyNumber(questions.inquiryHowManyDays)
				)
				.addQuestion(questions.anyOtherAppeals)
				.addQuestion(questions.linkAppeals)
				.withCondition(questionHasAnswer(questions.anyOtherAppeals, 'yes')),
			new Section('Upload documents', 'upload-documents')
				.addQuestion(questions.uploadOriginalApplicationForm)
				.addQuestion(questions.uploadChangeOfDescriptionEvidence)
				.withCondition(questionHasAnswer(questions.updateDevelopmentDescription, 'yes'))
				.addQuestion(questions.uploadApplicationDecisionLetter)
				.withCondition(shouldDisplayUploadDecisionLetter(response))
				.addQuestion(questions.submitPlanningObligation)
				.addQuestion(questions.planningObligationStatus)
				.withCondition(questionHasAnswer(questions.submitPlanningObligation, 'yes'))
				.addQuestion(questions.uploadPlanningObligation)
				.withCondition(
					questionsHaveAnswers(
						[
							[questions.submitPlanningObligation, 'yes'],
							[questions.planningObligationStatus, 'finalised']
						],
						{ logicalCombinator: 'and' }
					)
				)
				.addQuestion(questions.separateOwnershipCert)
				.addQuestion(questions.uploadSeparateOwnershipCert)
				.withCondition(questionHasAnswer(questions.separateOwnershipCert, 'yes'))
				.addQuestion(questions.uploadAppellantStatement)
				.addQuestion(questions.uploadStatementCommonGround)
				.withCondition(
					questionsHaveAnswers(
						[
							[questions.appellantProcedurePreference, 'hearing'],
							[questions.appellantProcedurePreference, 'inquiry']
						],
						{ logicalCombinator: 'or' }
					)
				)
				.addQuestion(questions.costApplication)
				.addQuestion(questions.uploadCostApplication)
				.withCondition(questionHasAnswer(questions.costApplication, 'yes'))
				.addQuestion(questions.designAccessStatement)
				.addQuestion(questions.uploadDesignAccessStatement)
				.withCondition(questionHasAnswer(questions.designAccessStatement, 'yes'))
				.addQuestion(questions.uploadPlansDrawingsDocuments)
				.addQuestion(questions.newPlansDrawings)
				.addQuestion(questions.uploadNewPlansDrawings)
				.withCondition(questionHasAnswer(questions.newPlansDrawings, 'yes'))
				.addQuestion(questions.otherNewDocuments)
				.addQuestion(questions.uploadOtherNewDocuments)
				.withCondition(questionHasAnswer(questions.otherNewDocuments, 'yes'))
		);
	}
}

module.exports = { S78AppealFormJourney, baseS78SubmissionUrl, taskListUrl };
