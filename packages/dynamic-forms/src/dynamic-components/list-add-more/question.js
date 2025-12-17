const Question = require('../../question');

const CaseAddMoreQuestion = require('../case-add-more/question');
const AddressAddMoreQuestion = require('../address-add-more/question');
const ListedBuildingAddMoreQuestion = require('../listed-building-add-more/question');
const IndividualAddMoreQuestion = require('../individual-add-more/question');

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

const subQuestions = {
	case: CaseAddMoreQuestion,
	address: AddressAddMoreQuestion,
	'listed-building': ListedBuildingAddMoreQuestion,
	individual: IndividualAddMoreQuestion
};

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
	 * @param {string} [params.hint]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {import('../../question-props').SubQuestionProps} [params.subQuestionProps]
	 * @param {string} [params.subQuestionLabel]
	 * @param {string} [params.subQuestionTitle] the text used as the key for display on task list
	 * @param {string} [params.subQuestionFieldLabel]
	 * @param {string} [params.subQuestionInputClasses]
	 * @param {string} [params.width]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor(params) {
		if (!params.subQuestionProps) throw new Error('subQuestionProps are required');

		super({
			...params,
			viewFolder: 'list-add-more'
		});

		this.subQuestion = new subQuestions[params.subQuestionProps.type](params.subQuestionProps);

		this.baseTaskUrl = params.url ?? '';
		this.subQuestionUrl = params.subQuestionProps.url ?? `${this.baseTaskUrl}-address`;

		this.subQuestionLabel = params.subQuestionLabel ?? 'Answer';
		this.subQuestionTitle = params.subQuestionTitle;
		this.subQuestionFieldLabel = params.subQuestionFieldLabel;
		this.subQuestionInputClasses = params.subQuestionInputClasses;
		this.width = params.width ?? ListAddMoreQuestion.TWO_THIRDS_WIDTH;
	}

	getRoutes() {
		return [this.baseTaskUrl, this.subQuestionUrl].filter(Boolean);
	}

	/**
	 * Gets the URL slug for the current state of the question
	 * @param {JourneyResponse} response
	 * @returns {string}
	 */
	getQuestionUrl(response) {
		const answers = this.subQuestion.getAddMoreAnswers(response, this.subQuestion.fieldName);

		return this.#hasAtLeastOneAnswer(answers) ? this.baseTaskUrl : this.subQuestionUrl;
	}

	/**
	 * gets the view model for this question
	 * @param {Section | undefined} section - the current section
	 * @param {any} [answer] - the current answer
	 */
	getQuestionModel(section, answer) {
		const model = super.getQuestionModel(section, answer);

		if (this.url === this.subQuestionUrl) {
			model.fieldName = this.subQuestionUrl;
		}

		return model;
	}

	/**
	 * Answers to the question
	 * @param {Record<string, unknown>} answers
	 * @returns {boolean}
	 */
	#hasAtLeastOneAnswer(answers) {
		return answers && Object.keys(answers).length > 0;
	}

	/**
	 * renders the question
	 * @param {import('express').Response} res - the express response
	 * @param {ListAddModeViewModel} viewModel additional data to send to view
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
	 * @param {Object} options - the current section
	 * @param {Section} options.section - the current section
	 * @param {Journey} options.journey - the journey we are in
	 * @param {Object} [options.customViewData] additional data to send to view
	 * @param {string} [options.sessionBackLink] additional data to send to view
	 * @returns {ListAddModeViewModel}
	 */
	prepQuestionForRendering({ section, journey, customViewData, sessionBackLink }) {
		const answers = this.subQuestion.getAddMoreAnswers(
			journey.response,
			this.subQuestion.fieldName
		);

		// Set default URL based on data presence
		this.url = this.#hasAtLeastOneAnswer(answers) ? this.baseTaskUrl : this.subQuestionUrl;

		// get viewModel for listing component
		if (this.#hasAtLeastOneAnswer(answers)) {
			const viewModel = super.prepQuestionForRendering({
				section,
				journey,
				sessionBackLink,
				customViewData: {
					...customViewData,
					width: this.width
				}
			});
			const addMoreAnswers = this.#addListingDataToViewModel(journey, section);
			return { ...viewModel, addMoreAnswers };
		}

		// get viewModel for addMore subquestion
		const viewModel = this.subQuestion.prepQuestionForRendering({
			section,
			journey,
			sessionBackLink,
			customViewData: {
				...customViewData,
				width: this.width
			}
		});

		return {
			...viewModel,
			question: {
				...viewModel.question,
				label: this.subQuestionFieldLabel,
				inputClasses: this.subQuestionInputClasses
			}
		};
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
	formatAnswerForSummary(sectionSegment, journey, _) {
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
	 * @returns {Promise<{ answers: Record<string, unknown>; }>}
	 */
	async getDataToSave(req, journeyResponse) {
		// get current answers
		const responseToSave = {
			answers: {
				/** @type {Array<Awaited<ReturnType<ListAddMoreQuestion['getDataToSave']>>>} */
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
	 * @param {function(string, Object): Promise<any>} saveFunction
	 * @param {Journey} journey
	 * @param {Section} section
	 * @param {JourneyResponse} journeyResponse
	 * @returns {Promise<void>}
	 */
	saveAction = async (req, res, saveFunction, journey, section, journeyResponse) => {
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
				const viewModel = this.subQuestion.prepQuestionForRendering({ section, journey });
				const backLink = journey.getCurrentQuestionUrl(section.segment, this.fieldName);
				const navigation = ['', viewModel.backLink];
				const questionLabel = this.subQuestionFieldLabel;
				const questionInputClasses = this.subQuestionInputClasses;

				return this.renderAction(res, {
					...viewModel,
					backLink,
					navigation,
					question: {
						...viewModel.question,
						label: questionLabel,
						inputClasses: questionInputClasses
					}
				});
			} else if (addMoreAnswer === 'no') {
				const next =
					journey.getNextQuestionUrl(section.segment, this.fieldName, false) || journey.taskListUrl;
				return res.redirect(next);
			}
		}

		// check for validation errors
		const errorViewModel = this.subQuestion.checkForValidationErrors(req, section, journey);
		if (errorViewModel) {
			const questionLabel = this.subQuestionFieldLabel;
			const questionInputClasses = this.subQuestionInputClasses;
			return this.renderAction(res, {
				...errorViewModel,
				question: {
					...errorViewModel.question,
					label: questionLabel,
					inputClasses: questionInputClasses
				}
			});
		}

		// save
		let responseToSave = await this.getDataToSave(req, journeyResponse);

		await this.subQuestion.saveList(req, this.fieldName, journeyResponse, responseToSave);

		responseToSave = {
			answers: {
				[this.fieldName]: true
			}
		};

		await saveFunction(journeyResponse.referenceId, responseToSave.answers);

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

	/**
	 * @param {JourneyResponse} journeyResponse
	 * @returns {boolean}
	 */
	isAnswered(journeyResponse) {
		if (this.subQuestion instanceof AddressAddMoreQuestion) {
			if (!Array.isArray(journeyResponse.answers.SubmissionAddress))
				throw new Error('SubmissionAddress was an unexpected shape');
			return journeyResponse.answers.SubmissionAddress.some(
				(address) => address.fieldName === this.subQuestion.fieldName
			);
		}

		if (this.subQuestion instanceof CaseAddMoreQuestion) {
			if (!Array.isArray(journeyResponse.answers.SubmissionLinkedCase))
				throw new Error('SubmissionLinkedCase was an unexpected shape');
			return journeyResponse.answers.SubmissionLinkedCase.some(
				(caseref) => caseref.fieldName === this.subQuestion.fieldName
			);
		}

		if (this.subQuestion instanceof ListedBuildingAddMoreQuestion) {
			if (!Array.isArray(journeyResponse.answers.SubmissionListedBuilding))
				throw new Error('SubmissionListedBuilding was an unexpected shape');
			return journeyResponse.answers.SubmissionListedBuilding.some(
				(listed) => listed.fieldName === this.subQuestion.fieldName
			);
		}

		return false;
	}
}

module.exports = ListAddMoreQuestion;
