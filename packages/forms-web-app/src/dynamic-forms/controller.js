// common controllers for dynamic forms
const { getAppealByLPACodeAndId } = require('../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../services/lpa-user.service');
const {
	getJourney,
	getJourneyResponseByType,
	saveResponseToSessionByType
} = require('./journey-types');

// todo:
// test
// cleaner means of handling question type in urls

const {
	VIEW: {
		TASK_LIST: { QUESTIONNAIRE }
	}
} = require('./dynamic-components/views');
//todo: should this be tied to a particular view, or can this be obtained from Journey object?

/**
 * @typedef {import('./journey-types').JourneyType} JourneyType
 */

/**
 * @typedef {Object} SectionView
 * @property {string} heading
 * @property {Object} list
 * @property {Array.<RowView>} list.rows
 */

/**
 * @typedef {Object} RowView
 * @property {Object} key
 * @property {string} key.text
 * @property {Object} value
 * @property {string} value.text
 * @property {Object} actions
 * @property {Array.<ActionView>} actions.items
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
 * @returns {SectionView} a representation of a section
 */
function buildSectionViewModel(name) {
	return {
		heading: name,
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
			text: value
		},
		actions: {
			items: [action]
		}
	};
}

/**
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {JourneyType} journeyId
 */
exports.list = async (req, res, journeyId) => {
	//render check your answers view
	const { referenceId } = req.params;

	const user = getLPAUserFromSession(req);
	const encodedReferenceId = encodeURIComponent(referenceId);
	const appeal = await getAppealByLPACodeAndId(user.lpaCode, encodedReferenceId);

	const summaryListData = { sections: [] };
	const journeyResponse = getJourneyResponseByType(req, journeyId, referenceId);
	const journey = getJourney(journeyResponse);

	for (const section of journey.sections) {
		const sectionView = buildSectionViewModel(section.name);

		for (const question of section.questions) {
			// don't show question on tasklist if set to false
			if (question.taskList === false) {
				continue;
			}

			// use custom formatting function
			if (question.format) {
				const rows = question.format(
					journey.response.answers,
					referenceId,
					section.segment,
					question.fieldName
				);

				for (let rowData of rows) {
					const action = {
						href: rowData.ctaLink,
						text: rowData.ctaText
					};

					const row = buildSectionRowViewModel(rowData.title, rowData.value, action);
					sectionView.list.rows.push(row);
				}

				continue;
			}

			// default question format
			const key = question.title ?? question.question;
			const value =
				question.altText ?? journey.response?.answers[question.fieldName] ?? 'Not started';
			const action = {
				href: journey.getCurrentQuestionUrl(section.segment, question.fieldName),
				text: 'Answer',
				visuallyHiddenText: question.question
			};

			const row = buildSectionRowViewModel(key, value, action);
			sectionView.list.rows.push(row);
		}

		summaryListData.sections.push(sectionView);
	}

	return res.render(QUESTIONNAIRE, {
		appeal,
		summaryListData,
		layoutTemplate: '../../../views/layouts/lpa-dashboard/main.njk'
	}); //todo: use layout property on HASJourney object
};

/**
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {JourneyType} journeyId
 */
exports.question = async (req, res, journeyId) => {
	//render an individual question
	const { referenceId, section, question } = req.params;
	const journeyResponse = getJourneyResponseByType(req, journeyId, referenceId);
	const journey = getJourney(journeyResponse);

	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj) {
		return res.redirect(journey.baseUrl);
	}

	if (questionObj.renderAction) {
		return await questionObj.renderAction(req, res);
	}

	const answer = journey.response.answers[questionObj.fieldName] || '';
	const backLink = journey.getNextQuestionUrl(section, question, true);
	const viewModel = {
		appealId: referenceId,
		question: questionObj.prepQuestionForRendering(journeyResponse.answers),
		answer: answer,
		backLink: backLink,
		navigation: ['', backLink]
	};
	return res.render(`dynamic-components/${questionObj.type}/index`, viewModel);
};

/**
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {JourneyType} journeyId
 */
exports.save = async (req, res, journeyId) => {
	//save the response
	//for now, we'll just save it to the session
	//TODO: Needs to run validation!
	const { referenceId, section, question } = req.params;
	const journeyResponse = getJourneyResponseByType(req, journeyId, referenceId);
	const journey = getJourney(journeyResponse);

	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj) {
		return res.redirect(journey.baseUrl);
	}

	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	// show errors
	if (Object.keys(errors).length > 0) {
		const answer = journeyResponse.answers[questionObj.fieldName] || '';
		const backLink = journey.getCurrentQuestionUrl(section, question);
		const viewModel = {
			appealId: referenceId,
			question: questionObj.prepQuestionForRendering(journeyResponse.answers),
			answer: answer,
			backLink: backLink,
			navigation: ['', backLink],
			errors: errors,
			errorSummary: errorSummary
		};
		return res.render(`dynamic-components/${questionObj.type}/index`, viewModel);
	}

	// use custom saveAction
	if (questionObj.saveAction) {
		return await questionObj.saveAction(req, res);
	}

	// set answer on response
	journeyResponse.answers[questionObj.fieldName] = req.body[questionObj.fieldName];
	for (let propName in req.body) {
		if (propName.startsWith(questionObj.fieldName + '_')) {
			journeyResponse.answers[propName] = req.body[propName];
		}
	}

	// save response to session
	saveResponseToSessionByType(req, journeyResponse);

	//move to the next question
	const updatedQuestionnaire = getJourney(journeyResponse);
	return res.redirect(updatedQuestionnaire.getNextQuestionUrl(section, question, false));
};