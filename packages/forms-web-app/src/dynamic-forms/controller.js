// common controllers for dynamic forms
const { SECTION_STATUS } = require('./section');
const { getJourney } = require('./journey-factory');
const logger = require('../lib/logger');
const ListAddMoreQuestion = require('./dynamic-components/list-add-more/question');
const questionUtils = require('./dynamic-components/utils/question-utils');

/**
 * @typedef {import('@pins/common/src/dynamic-forms/journey-types').JourneyType} JourneyType
 * @typedef {import('./journey').Journey} Journey
 * @typedef {import('./question')} Question
 * @typedef {import('./section').Section} Section
 */

/**
 * @typedef {Object} SectionView
 * @property {string} heading
 * @property {string} status
 * @property {Object} list
 * @property {Array.<RowView>} list.rows
 */

/**
 * @typedef {Object} RowView
 * @property {{ text: string }} key
 * @property {{ text: string } | { html: string }} value
 * @property {{ items: ActionView[] }} actions
 */

/**
 * @typedef {Object} ActionView
 * @property {string} href
 * @property {string} text
 * @property {string} [visuallyHiddenText]
 */

/**
 * build a view model for a section in the journey overview
 * @param {string} name
 * @param {string} status
 * @returns {SectionView} a representation of a section
 */
function buildSectionViewModel(name, status) {
	return {
		heading: name,
		status: status,
		list: {
			rows: []
		}
	};
}

/**
 * build a view model for a row in the journey overview
 * @param {string} key
 * @param {string} value
 * @param {ActionView} action
 * @returns {RowView} a representation of a row
 */
function buildSectionRowViewModel(key, value, action) {
	return {
		key: {
			text: key
		},
		value: {
			html: value
		},
		actions: {
			items: [action]
		}
	};
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {string} pageCaption
 * @param {object} viewData
 */
exports.list = async (req, res, pageCaption, viewData) => {
	//render check your answers view
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);

	const summaryListData = {
		sections: [],
		completedSectionCount: 0
	};

	for (const section of journey.sections) {
		const status = section.getStatus(journeyResponse);
		const sectionView = buildSectionViewModel(section.name, status);

		// update completed count
		if (status === SECTION_STATUS.COMPLETE) {
			summaryListData.completedSectionCount++;
		}

		// add questions
		for (const question of section.questions) {
			// don't show question on tasklist if set to false
			if (question.taskList === false) {
				continue;
			}

			const answers = journey.response?.answers;
			let answer = answers[question.fieldName];
			const conditionalAnswer = questionUtils.getConditionalAnswer(answers, question, answer);
			if (conditionalAnswer) {
				answer = {
					value: answer,
					conditional: conditionalAnswer
				};
			}
			const rows = question.formatAnswerForSummary(section.segment, journey, answer);
			rows.forEach((row) => {
				let viewModelRow = buildSectionRowViewModel(row.key, row.value, row.action);
				sectionView.list.rows.push(viewModelRow);
			});
		}

		summaryListData.sections.push(sectionView);
	}

	const declarationUrl = `/appeals/householder/submit/declaration?id=${journey.response.referenceId}`;

	return res.render(journey.listingPageViewPath, {
		...viewData,
		declarationUrl,
		pageCaption,
		summaryListData,
		journeyComplete: journey.isComplete(),
		layoutTemplate: journey.journeyTemplate,
		journeyTitle: journey.journeyTitle
	});
};

/**
 * @type {import('express').Handler}
 */
exports.question = async (req, res) => {
	//render an individual question
	const { section, question } = req.params;
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);

	const sectionObj = journey.getSection(section);
	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj || !sectionObj) {
		return res.redirect(journey.taskListUrl);
	}

	const viewModel = questionObj.prepQuestionForRendering(sectionObj, journey);
	return questionObj.renderAction(res, viewModel);
};

/**
 * @type {import('express').Handler}
 */
exports.save = async (req, res) => {
	//save the response
	const { section, question } = req.params;
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);

	const sectionObj = journey.getSection(section);
	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj || !sectionObj) {
		return res.redirect(journey.taskListUrl);
	}

	try {
		return await questionObj.saveAction(req, res, journey, sectionObj, journeyResponse);
	} catch (err) {
		logger.error(err);

		const viewModel = questionObj.prepQuestionForRendering(sectionObj, journey, {
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
		return questionObj.renderAction(res, viewModel);
	}
};

/**
 * @type {import('express').Handler}
 */
exports.remove = async (req, res) => {
	//save the response
	const { section, question, answerId } = req.params;
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);

	const sectionObj = journey.getSection(section);
	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj || !sectionObj) {
		return res.redirect(journey.taskListUrl);
	}

	try {
		if (questionObj instanceof ListAddMoreQuestion) {
			const goBack = await questionObj.removeAction(req, journeyResponse, answerId);
			if (goBack === true) {
				return res.redirect(journey.getNextQuestionUrl(section, questionObj.fieldName, goBack));
			}
			return res.redirect(journey.getCurrentQuestionUrl(section, question));
		}

		throw new Error(`Cannot remove answer for ${section}/${question}`);
	} catch (err) {
		logger.error(err);

		const viewModel = questionObj.prepQuestionForRendering(sectionObj, journey, {
			errorSummary: [{ text: 'Failed to remove answer', href: '#' }]
		});

		return questionObj.renderAction(res, viewModel);
	}
};

/**
 * @type {import('express').Handler}
 */
exports.submit = async (req, res) => {
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);
	const referenceId = res.locals.journeyResponse.referenceId;

	const journeyUrl = (journeyId) => {
		if (journeyId === 'has-questionnaire') {
			return 'householder/';
		} else if (journeyId === 's78-questionnaire') {
			return 'full-planning/';
		} else return '';
	};

	if (!journey.isComplete()) {
		res.sendStatus(400);
		return;
	}

	await req.appealsApiClient.submitLPAQuestionnaire(referenceId);

	return res.redirect(
		'/manage-appeals/' +
			journeyUrl(journeyResponse.journeyId) +
			encodeURIComponent(referenceId) +
			'/questionnaire-submitted/'
	);
};

/**
 * @type {import('express').Handler}
 */
exports.submitAppellantSubmission = async (req, res) => {
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);
	const id = res.locals.journeyResponse.referenceId;

	if (!journey.isComplete()) {
		res.sendStatus(400).render('./error/not-found.njk');
		return;
	}

	await req.appealsApiClient.submitAppellantSubmission(id);

	return res.redirect('/appeals/householder/submit/submitted?id=' + encodeURIComponent(id));
};

/**
 * @type {import('express').Handler}
 */
exports.appellantSubmissionDeclaration = async (req, res) => {
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);
	if (!journey.isComplete()) {
		// return error message and redirect
		return res.status(400).render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-declaration/index', {
		layoutTemplate: journey.journeyTemplate
	});
};

/**
 * @type {import('express').Handler}
 */
exports.lpaSubmitted = async (req, res) => {
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);
	if (!journey.isComplete()) {
		// return error message and redirect
		return res.status(400).render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-screen/lpa');
};

/**
 * @type {import('express').Handler}
 */
exports.appellantSubmitted = async (req, res) => {
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);
	if (!journey.isComplete()) {
		// return error message and redirect
		return res.status(400).render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-screen/appellant');
};
