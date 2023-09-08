const { questions } = require('./questions');
const { Journey } = require('../journey');
const { Section } = require('../section');

const baseHASUrl = '/manage-appeals/questionnaire';
const hasJourneyTemplate = 'has-questionnaire/template.njk';
const listingPageViewPath = 'dynamic-components/task-list/questionnaire';

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 */

/**
 * A Journey for LPA's responding to a HAS appeal
 * @class
 */
class HasJourney extends Journey {
	/**
	 * creates an instance of a HAS Journey
	 * @param {JourneyResponse} response - an onject that handles the response for this journey (needs to always be passed in as it contains the journey url segment)
	 */
	constructor(response) {
		super(
			`${baseHASUrl}/${encodeURIComponent(response.referenceId)}`,
			response,
			hasJourneyTemplate,
			listingPageViewPath
		);

		this.sections.push(
			new Section('Constraints, designations and other issues', 'constraints')
				.addQuestion(questions.appealTypeAppropriate)
				.addQuestion(questions.listedBuildingCheck)
				.addQuestion(questions.listedBuildingNumber)
				.withCondition(
					response.answers && response.answers[questions.listedBuildingCheck.fieldName] == 'yes'
				)
				.addQuestion(questions.conservationArea)
				.addQuestion(questions.conservationAreaUpload)
				.withCondition(
					response.answers && response.answers[questions.conservationArea.fieldName] == 'yes'
				)
				// .addQuestion(questions.listedBuildingDetail)
				// .withCondition(response.answers[questions.listedBuildingCheck.fieldName] == 'yes')
				// .addQuestion(questions.listedBuildingDetailList)
				// .withCondition(response.answers[questions.listedBuildingCheck.fieldName] == 'yes')

				// .addQuestion(questions.conservationAreaUpload)
				// .withCondition(response.answers[questions.conservationArea.fieldName] == 'yes')
				.addQuestion(questions.greenBelt),
			new Section('Notifying people about the application', 'notified')
				.addQuestion(questions.whoWasNotified)
				.addQuestion(questions.howYouNotifiedPeople)
				.addQuestion(questions.displaySiteNotice)
				.addQuestion(questions.uploadSiteNotice)
				.addQuestion(questions.lettersToNeighbours)
				.addQuestion(questions.uploadLettersToNeighbours)
				.withCondition(
					response.answers && response.answers[questions.lettersToNeighbours.fieldName] == 'yes'
				)
				.addQuestion(questions.pressAdvert)
				.addQuestion(questions.pressAdvertUpload)
				.withCondition(
					response.answers && response.answers[questions.pressAdvert.fieldName] == 'yes'
				),
			// .addQuestion(questions.siteNoticeUpload)
			// .withCondition(
			// 	(response.answers[questions.howYouNotifiedPeople.fieldName] ?? '').includes('Site notice')
			// )
			// .addQuestion(questions.lettersToNeighboursUpload)
			// .withCondition(
			// 	(response.answers[questions.howYouNotifiedPeople.fieldName] ?? '').includes(
			// 		'Letters to neighbours'
			// 	)
			// )
			// .addQuestion(questions.advertisementUpload)
			// .withCondition(
			// 	(response.answers[questions.howYouNotifiedPeople.fieldName] ?? '').includes(
			// 		'Advertisement'
			// 	)
			// )
			new Section('Consultation responses and representations', 'consultation')
				.addQuestion(questions.representationsFromOthers)
				.addQuestion(questions.representationUpload)
				.withCondition(
					response.answers &&
						response.answers[questions.representationsFromOthers.fieldName] == 'yes'
				),
			new Section(
				"Planning officer's report and supplementary documents",
				'planning-officer-report'
			).addQuestion(questions.planningOfficersReportUpload),
			new Section('Site access', 'site-access')
				.addQuestion(questions.accessForInspection)
				.addQuestion(questions.neighbouringSite)
				.addQuestion(questions.potentialSafetyRisks),
			new Section('Appeal process', 'appeal-process')
				.addQuestion(questions.appealsNearSite)
				.addQuestion(questions.addNewConditions)
				.withCondition(
					response.answers && response.answers[questions.appealsNearSite.fieldName] == 'no'
				)
				.addQuestion(questions.otherAppealReference)
				.withCondition(
					response.answers && response.answers[questions.appealsNearSite.fieldName] == 'yes'
				),
			new Section('Submit', 'submit')
		);
	}
}

module.exports = { HasJourney, baseHASUrl };
