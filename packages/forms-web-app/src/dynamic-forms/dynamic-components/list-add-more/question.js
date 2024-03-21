const { apiClient } = require('#lib/appeals-api-client');
const Question = require('../../question');
const AddMoreQuestion = require('../add-more/question');
const AddressAddMoreQuestion = require('../address-add-more/question');

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
	 * @param {ExpressResponse} res - the express response
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
		const isAddressQuestion = this.subQuestion instanceof AddressAddMoreQuestion;
		const answers = isAddressQuestion
			? journey.response.answers.SubmissionNeighbourAddress
			: journey.response.answers[this.fieldName];
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
	 * @param {Object} answer
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {Array.<Object>}
	 */
	formatAnswerForSummary(sectionSegment, journey, answer) {
		const isAddressQuestion = this.subQuestion instanceof AddressAddMoreQuestion;
		let rowParams = [];
		const answerArray = isAddressQuestion
			? journey.response.answers.SubmissionNeighbourAddress
			: answer;
		for (let i = 0; i < answerArray?.length; i++) {
			const action = this.getAction(sectionSegment, journey);
			rowParams.push({
				key: `${this.subQuestionLabel} ${i + 1}`,
				value: this.subQuestion.format(isAddressQuestion ? answerArray[i] : answerArray[i].value),
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
		const isAddressQuestion = this.subQuestion instanceof AddressAddMoreQuestion;
		const addMoreAnswers = [];
		const answers = isAddressQuestion
			? journey.response.answers.SubmissionNeighbourAddress
			: journey.response.answers[this.fieldName];

		let i = 1;
		for (const item in answers) {
			const answer = answers[item];
			addMoreAnswers.push({
				label: `${this.subQuestionLabel} ${i}`,
				answer: this.subQuestion.format(isAddressQuestion ? answer : answer.value),
				removeLink:
					journey.getCurrentQuestionUrl(section.segment, this.fieldName) + '/' + answer.addMoreId
			});
			i++;
		}

		return addMoreAnswers;
	}

	/**
	 * Takes the data to save from the addMore and adds to existing array
	 * @param {ExpressRequest} req
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

		// get existing answers
		if (journeyResponse.answers[this.fieldName]) {
			responseToSave.answers[this.fieldName] = journeyResponse.answers[this.fieldName];
		}

		// get answer to addMore
		const individual = await this.subQuestion.getDataToSave(req, journeyResponse);
		responseToSave.answers[this.fieldName].push(individual);

		// update journey response
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

		if (this.subQuestion instanceof AddressAddMoreQuestion) {
			const addresses = responseToSave.answers[this.fieldName];
			await Promise.all(
				addresses.map((address) => {
					return apiClient.postSubmissionNeighbourAddress(
						journeyResponse.referenceId,
						address.value
					);
				})
			);
			responseToSave = {
				answers: {
					[this.fieldName]: true
				}
			};
		}

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
		return journeyResponse.answers[this.fieldName]?.length > 0 ? journeyResponse : true;
	}
}

module.exports = ListAddMoreQuestion;
