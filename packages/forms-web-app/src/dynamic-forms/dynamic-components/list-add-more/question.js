// const { getJourney } = require('../../journey-factory');
const Question = require('../../question');
const AddMoreQuestion = require('../add-more/question');

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
	static FULL_WIDTH = 'govuk-grid-column-full';
	static TWO_THIRDS_WIDTH = 'govuk-grid-column-two-thirds';

	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {AddMoreQuestion} params.subQuestion
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {string} [params.subQuestionLabel]
	 * @param {string} [params.subQuestionTitle] the text used as the key for display on task list
	 * @param {string} [params.subQuestionFieldLabel]
	 * @param {string} [params.subQuestionInputClasses]
	 * @param {string} [params.width]
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
		subQuestionTitle,
		subQuestionFieldLabel,
		subQuestionInputClasses,
		validators,
		width
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

		if (!subQuestion || !(subQuestion instanceof AddMoreQuestion)) {
			throw new Error('addMore is mandatory');
		}

		this.subQuestion = subQuestion;
		this.subQuestionLabel = subQuestionLabel ?? 'Answer';
		this.subQuestionTitle = subQuestionTitle;
		this.subQuestionFieldLabel = subQuestionFieldLabel;
		this.subQuestionInputClasses = subQuestionInputClasses;
		this.width = width ?? ListAddMoreQuestion.TWO_THIRDS_WIDTH;
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
	 * @param {import('express').Response} res - the express response
	 * @param {QuestionViewModel} viewModel additional data to send to view
	 * @returns {void}
	 */
	renderAction(res, viewModel) {
		// if addMoreAnswers is present then we are rendering the list add more component
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
		const answers = this.subQuestion.getAddMoreAnswers(
			journey.response,
			this.subQuestion.fieldName
		);
		customViewData = customViewData ?? {};
		customViewData.width = this.width;
		// get viewModel for listing component
		if (this.#hasAtLeastOneAnswer(answers)) {
			const viewModel = super.prepQuestionForRendering(section, journey, customViewData);
			viewModel.addMoreAnswers = this.#addListingDataToViewModel(journey, section);
			return viewModel;
		}

		// get viewModel for addMore subquestion
		const viewModel = this.subQuestion.prepQuestionForRendering(section, journey, customViewData);
		viewModel.question.label = this.subQuestionFieldLabel;
		viewModel.question.inputClasses = this.subQuestionInputClasses;
		return viewModel;
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {Array.<Object>}
	 */
	formatAnswerForSummary(sectionSegment, journey) {
		let rowParams = [];

		const answerArray = this.subQuestion.getAddMoreAnswers(
			journey.response,
			this.subQuestion.fieldName
		);

		for (let i = 0; i < answerArray?.length; i++) {
			const answer = answerArray[i];
			const action = this.getAction(sectionSegment, journey);
			const key = this.subQuestionTitle ?? this.subQuestionLabel;
			rowParams.push({
				key,
				value: this.subQuestion.format(answer),
				action: action
			});
		}

		return rowParams;
	}

	/**
	 * Returns the action link for the question
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {String}
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
	 * @returns {Array.<addMoreAnswer>} list of existing answers to the sub question
	 */
	#addListingDataToViewModel(journey, section) {
		const addMoreAnswers = [];
		const answers = this.subQuestion.getAddMoreAnswers(
			journey.response,
			this.subQuestion.fieldName
		);

		let i = 1;
		for (const item in answers) {
			const answer = answers[item];
			const answerId = answer.id;
			addMoreAnswers.push({
				label: `${this.subQuestionLabel} ${i}`,
				answer: this.subQuestion.format(answer),
				removeLink: journey.addToCurrentQuestionUrl(section.segment, this.fieldName, '/' + answerId)
			});
			i++;
		}

		return addMoreAnswers;
	}

	/**
	 * Takes the data to save from the addMore and adds to existing array
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise.<Object>}
	 */
	async getDataToSave(req, journeyResponse) {
		// get current answers
		const responseToSave = {
			answers: {
				[this.fieldName]: []
			}
		};

		// get answer to addMore
		const individual = await this.subQuestion.getDataToSave(req, journeyResponse);
		responseToSave.answers[this.fieldName].push(individual);

		// update journey response
		journeyResponse.answers[this.fieldName] = responseToSave.answers[this.fieldName];
		return responseToSave;
	}

	/**
	 * Handles redirect after saving, add more questions loop back to themselves
	 * @param {import('express').Response} res
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
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Journey} journey
	 * @param {Section} section
	 * @param {JourneyResponse} journeyResponse
	 * @returns {Promise<void>}
	 */
	saveAction = async (req, res, journey, section, journeyResponse) => {
		let isAddMorePage = true;
		if (!req.body[this.fieldName]) {
			if (
				Object.getOwnPropertyNames(req.body).find(
					(prop) => prop === this.subQuestion.fieldName || prop.includes(this.subQuestion.fieldName)
				)
			) {
				isAddMorePage = false;
			}
		}

		if (isAddMorePage) {
			const errorViewModel = this.checkForValidationErrors(req, section, journey);
			if (errorViewModel) {
				return this.renderAction(res, errorViewModel);
			}

			const addMoreAnswer = req.body[this.fieldName];

			if (addMoreAnswer === 'yes') {
				const viewModel = this.subQuestion.prepQuestionForRendering(section, journey);
				viewModel.backLink = journey.getCurrentQuestionUrl(section.segment, this.fieldName);
				viewModel.navigation = ['', viewModel.backLink];
				viewModel.question.label = this.subQuestionFieldLabel;
				viewModel.question.inputClasses = this.subQuestionInputClasses;
				return this.renderAction(res, viewModel);
			} else if (addMoreAnswer === 'no') {
				return res.redirect(journey.getNextQuestionUrl(section.segment, this.fieldName, false));
			}
		}

		// check for validation errors
		const errorViewModel = this.subQuestion.checkForValidationErrors(req, section, journey);
		if (errorViewModel) {
			errorViewModel.question.label = this.subQuestionFieldLabel;
			errorViewModel.question.inputClasses = this.subQuestionInputClasses;
			return this.renderAction(res, errorViewModel);
		}

		// save
		let responseToSave = await this.getDataToSave(req, journeyResponse);
		journey.response[this.fieldName] = responseToSave.answers[this.fieldName];

		await this.subQuestion.saveList(req, this.fieldName, journeyResponse, responseToSave);

		responseToSave = {
			answers: {
				[this.fieldName]: true
			}
		};

		await this.saveResponseToDB(req.appealsApiClient, journey.response, responseToSave);

		// check for saving errors
		const saveViewModel = this.subQuestion.checkForSavingErrors(req, section, journey);
		if (saveViewModel) {
			return this.renderAction(res, saveViewModel);
		}

		// move to the next question
		return this.#handleNextQuestion(res, journey, section.segment, this.fieldName);
	};

	/**
	 * removes answer with answerId from response if present
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse
	 * @param {string} answerId
	 * @returns {Promise<JourneyResponse | boolean> } updated JourneyResponse
	 */
	async removeAction(req, journeyResponse, answerId) {
		return this.subQuestion.removeList(req, journeyResponse, answerId);
	}
}

module.exports = ListAddMoreQuestion;
