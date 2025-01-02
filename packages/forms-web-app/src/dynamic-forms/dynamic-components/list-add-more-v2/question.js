const Question = require('../../question');

/**
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {QuestionViewModel & { addMoreAnswers?: Array<AddMoreAnswer>, question: QuestionViewModel['question'] & { label?: string, inputClasses?: string } }} ListAddModeViewModel
 */

/**
 * @typedef {Object} AddMoreAnswer
 * @property {string} label
 * @property {string} answer
 * @property {string} removeLink
 */

/**
 * @class
 */
class ListAddMoreQuestion extends Question {
	static FULL_WIDTH = 'govuk-grid-column-full';
	static TWO_THIRDS_WIDTH = 'govuk-grid-column-two-thirds';

	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({ title, question, fieldName, url, pageTitle, description, validators }) {
		super({
			title,
			question,
			viewFolder: 'list-add-more',
			fieldName,
			url,
			pageTitle,
			description,
			validators
		});
	}

	/**
	 * gets the view model for this question
	 * @param {Section} section - the current section
	 * @param {Journey} journey - the journey we are in
	 * @param {Object} [customViewData] additional data to send to view
	 * @returns {ListAddModeViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData) {
		const viewModel = super.prepQuestionForRendering(section, journey, {
			...customViewData
		});
		const addMoreAnswers = this.#addListingDataToViewModel(journey, section);
		return { ...viewModel, addMoreAnswers };
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {string | null} _
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {Array<{
	 *   key: string;
	 *   value: string | Object;
	 *   action: {
	 *     href: string;
	 *     text: string;
	 *     visuallyHiddenText: string;
	 *   };
	 * }>}
	 */
	// TODO sort this out
	formatAnswerForSummary(sectionSegment, journey, _) {
		let rowParams = [];

		const answerArray = [{ a: 'thing' }, { a: 'nother thing' }];

		for (let i = 0; i < answerArray?.length; i++) {
			const answer = answerArray[i];
			const action = this.getAction(sectionSegment, journey);
			const key = 'Sub Q label';
			rowParams.push({
				key,
				value: answer.a,
				action
			});
		}

		return rowParams;
	}

	/**
	 * Returns the action link for the question
	 * @param {Journey} journey
	 * @param {string} sectionSegment
	 * @returns {{
	 *   href: string;
	 *   text: string;
	 *   visuallyHiddenText: string;
	 * }}
	 */
	getAction(sectionSegment, journey) {
		const action = {
			href: journey.getCurrentQuestionUrl(sectionSegment, this.fieldName),
			text: 'Change',
			visuallyHiddenText: this.question
		};
		return action;
	}

	/**
	 * @param {Journey} journey
	 * @param {Section} section - the current section
	 * @returns {Array<AddMoreAnswer>} list of existing answers to the sub question
	 */
	#addListingDataToViewModel(journey, section) {
		const addMoreAnswers = [];

		for (const _ in [{ a: 'thing' }, { a: 'nother thing' }]) {
			addMoreAnswers.push({
				label: `Sub Q label`,
				answer: 'Sub Q formatted Answer',
				removeLink: journey.addToCurrentQuestionUrl(
					section.segment,
					this.fieldName,
					'/' + 'derive id from answer'
				)
			});
		}

		return addMoreAnswers;
	}

	// /**
	//  * removes answer with answerId from response if present
	//  * @param {import('express').Request} req
	//  * @param {JourneyResponse} journeyResponse
	//  * @param {string} answerId
	//  * @returns {Promise<JourneyResponse | boolean> } updated JourneyResponse
	//  */
	// async removeAction(req, journeyResponse, answerId) {
	// 	return this.subQuestion.removeList(req, journeyResponse, answerId);
	// }

	// /**
	//  * @param {JourneyResponse} journeyResponse
	//  * @returns {boolean}
	//  */
	// isAnswered(journeyResponse) {
	// 	return false;
	// }

	/**
	 * Save the answer to the question
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Journey} journey
	 * @param {Section} section
	 * @returns {Promise<void>}
	 */
	async saveAction(req, res, journey, section) {
		// check for validation errors
		const errorViewModel = this.checkForValidationErrors(req, section, journey);
		if (errorViewModel) {
			return this.renderAction(res, errorViewModel);
		}

		console.log('🚀 ~ ListAddMoreQuestion ~ saveAction ~ res.body:', res.body);
		journey.response.answers[this.fieldName] = res.body[this.fieldName];

		// move to the next question
		return this.handleNextQuestion(res, journey, section.segment, this.fieldName);
	}
}

module.exports = ListAddMoreQuestion;
