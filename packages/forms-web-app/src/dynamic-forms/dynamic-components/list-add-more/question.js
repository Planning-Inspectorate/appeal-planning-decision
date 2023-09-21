const Question = require('../../question');
const uuid = require('uuid');

/**
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 */

/**
 * @typedef {Object} addMoreAnswer
 * @property {string} label
 * @property {string} answer
 * @property {string} removeLink
 */

/**
 * @class
 */
class ListAddMoreQuestion extends Question {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {Question} params.subQuestion
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {string} [params.subQuestionLabel]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({
		title,
		question,
		fieldName,
		subQuestion,
		url,
		pageTitle,
		description,
		subQuestionLabel,
		validators
	}) {
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

		if (!subQuestion || !(subQuestion instanceof Question)) {
			throw new Error('subQuestion parameter is mandatory');
		}

		this.subQuestion = subQuestion;
		this.subQuestionLabel = subQuestionLabel ?? 'Answer';
	}

	/**
	 * Answers to the question
	 * @param {Object} answers
	 * @returns
	 */
	#hasAtLeastOneAnswer(answers) {
		return answers && Object.keys(answers).length > 0;
	}

	/**
	 * renders the question
	 * @param {ExpressResponse} res - the express response
	 * @param {QuestionViewModel} viewModel additional data to send to view
	 * @returns {void}
	 */
	renderAction(res, viewModel) {
		// if addMoreAnswers is present then we are rendering the add more component
		if (viewModel.addMoreAnswers) {
			return super.renderAction(res, viewModel);
		}

		return this.subQuestion.renderAction(res, viewModel);
	}

	/**
	 * gets the view model for this question
	 * @param {Section} section - the current section
	 * @param {Journey} journey - the journey we are in
	 * @param {Object|undefined} [customViewData] additional data to send to view
	 * @returns {QuestionViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData) {
		const answers = journey.response.answers[this.fieldName];

		// get viewModel for add more component
		if (this.#hasAtLeastOneAnswer(answers)) {
			const viewModel = super.prepQuestionForRendering(section, journey, customViewData);
			viewModel.addMoreAnswers = this.#addListingDataToViewModel(journey, section);
			return viewModel;
		}

		// get viewModel for subQuestion
		return this.subQuestion.prepQuestionForRendering(section, journey, customViewData);
	}

	/**
	 * @param {Journey} journey
	 * @param {Section} section - the current section
	 * @returns {Array.<addMoreAnswer>} list of existing answers to the sub question
	 */
	#addListingDataToViewModel(journey, section) {
		const addMoreAnswers = [];

		const answers = journey.response.answers[this.fieldName];

		let i = 1;
		for (const item in answers) {
			const answer = answers[item];
			addMoreAnswers.push({
				label: `${this.subQuestionLabel} ${i}`,
				answer: this.subQuestion.formatAnswerForSummary(answer[this.subQuestion.fieldName]),
				removeLink:
					journey.getCurrentQuestionUrl(section.segment, this.fieldName) + '/' + answer.addMoreId
			});
			i++;
		}

		return addMoreAnswers;
	}

	/**
	 * Takes the data to save from the subquestion and nests with property name
	 * @param {ExpressRequest} req
	 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise.<Object>}
	 */
	async getDataToSave(req, journeyResponse) {
		// get current answers
		let responseToSave = {
			answers: {
				[this.fieldName]: []
			}
		};

		if (journeyResponse.answers[this.fieldName]) {
			responseToSave.answers[this.fieldName] = [...journeyResponse.answers[this.fieldName]];
		}

		// get answer to subquestion
		const individual = await this.subQuestion.getDataToSave(req, journeyResponse);

		responseToSave.answers[this.fieldName].push({
			...individual.answers,
			addMoreId: uuid.v4()
		});

		journeyResponse.answers[this.fieldName] = responseToSave.answers[this.fieldName];

		return responseToSave;
	}

	/**
	 * Handles redirect after saving, add more questions loop back to themselves
	 * @param {ExpressResponse} res
	 * @param {Journey} journey
	 * @param {string} sectionSegment
	 * @param {string} questionSegment
	 * @returns {void}
	 */
	#handleNextQuestion(res, journey, sectionSegment, questionSegment) {
		return res.redirect(journey.getCurrentQuestionUrl(sectionSegment, questionSegment));
	}

	/**
	 * Save an uploaded file
	 * @param {ExpressRequest} req
	 * @param {ExpressResponse} res
	 * @param {Journey} journey
	 * @param {Section} section
	 * @param {JourneyResponse} journeyResponse
	 * @returns {Promise<void>}
	 */
	saveAction = async (req, res, journey, section, journeyResponse) => {
		const isAddMorePage = Object.prototype.hasOwnProperty.call(req.body, 'add-more-question');
		const addMoreAnswer = req.body[this.fieldName];

		if (isAddMorePage) {
			const errorViewModel = this.checkForValidationErrors(req, section, journey);
			if (errorViewModel) {
				return this.renderAction(res, errorViewModel);
			}

			if (addMoreAnswer === 'yes') {
				const viewModel = this.subQuestion.prepQuestionForRendering(section, journey);
				viewModel.backLink = journey.getCurrentQuestionUrl(section.segment, this.fieldName);
				viewModel.navigation = ['', viewModel.backLink];
				return this.renderAction(res, viewModel);
			} else if (addMoreAnswer === 'no') {
				return res.redirect(journey.getNextQuestionUrl(section.segment, this.fieldName, false));
			}
		}

		// check for validation errors
		const errorViewModel = this.subQuestion.checkForValidationErrors(req, section, journey);
		if (errorViewModel) {
			return this.renderAction(res, errorViewModel);
		}

		// save
		const responseToSave = await this.getDataToSave(req, journeyResponse);
		await this.saveResponseToDB(journey.response, responseToSave);

		// check for saving errors
		const saveViewModel = this.subQuestion.checkForSavingErrors(req, section, journey);
		if (saveViewModel) {
			return this.renderAction(res, saveViewModel);
		}

		// move to the next question
		const updatedJourney = new journey.constructor(journeyResponse);
		return this.#handleNextQuestion(res, updatedJourney, section.segment, this.fieldName);
	};

	/**
	 * removes answer with answerId from response if present
	 * @param {JourneyResponse} journeyResponse
	 * @param {string} addMoreId
	 * @returns {JourneyResponse} updated JourneyResponse
	 */
	async removeAction(journeyResponse, addMoreId) {
		let responseToSave = {
			answers: {
				[this.fieldName]: []
			}
		};

		if (journeyResponse.answers[this.fieldName]) {
			responseToSave.answers[this.fieldName] = [...journeyResponse.answers[this.fieldName]];
		}

		const removeIndex = responseToSave.answers[this.fieldName].findIndex(
			(answer) => answer.addMoreId === addMoreId
		);

		if (removeIndex >= 0) {
			responseToSave.answers[this.fieldName].splice(removeIndex, 1);
			await this.saveResponseToDB(journeyResponse, responseToSave);
			journeyResponse.answers[this.fieldName] = responseToSave.answers[this.fieldName];
		}

		return journeyResponse;
	}
}

module.exports = ListAddMoreQuestion;
