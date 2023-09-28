// common controllers for dynamic forms

const { getAppealByLPACodeAndId } = require('../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../services/lpa-user.service');
const { SECTION_STATUS } = require('./section');
const { getJourney } = require('./journey-factory');
const logger = require('../lib/logger');
const ListAddMoreQuestion = require('./dynamic-components/list-add-more/question');

/**
 * @typedef {import('./journey-factory').JourneyType} JourneyType
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
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
exports.list = async (req, res) => {
	//render check your answers view
	const { referenceId } = req.params;

	const user = getLPAUserFromSession(req);
	const encodedReferenceId = encodeURIComponent(referenceId);
	const appeal = await getAppealByLPACodeAndId(user.lpaCode, encodedReferenceId);

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
						text: rowData.ctaText,
						visuallyHiddenText: question.question
					};

					const row = buildSectionRowViewModel(rowData.title, rowData.value, action);
					sectionView.list.rows.push(row);
				}

				continue;
			}

			const answer = journey.response?.answers[question.fieldName];
			// default question format
			const key = question.title ?? question.question;
			const value = question.formatAnswerForSummary(answer, journeyResponse);
			const action = {
				href: journey.getCurrentQuestionUrl(section.segment, question.fieldName),
				text: typeof answer === 'undefined' || answer === null ? 'Answer' : 'Change',
				visuallyHiddenText: question.question
			};

			const row = buildSectionRowViewModel(key, value, action);
			sectionView.list.rows.push(row);
		}

		summaryListData.sections.push(sectionView);
	}

	return res.render(journey.listingPageViewPath, {
		appeal,
		summaryListData,
		layoutTemplate: journey.journeyTemplate,
		pageCaption: `Appeal ${appeal.caseReference}`,
		journeyTitle: journey.journeyTitle
	});
};

/**
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
exports.question = async (req, res) => {
	//render an individual question
	const { section, question } = req.params;
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);

	const sectionObj = journey.getSection(section);
	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj || !sectionObj) {
		return res.redirect(journey.baseUrl);
	}

	const viewModel = questionObj.prepQuestionForRendering(sectionObj, journey);
	return questionObj.renderAction(res, viewModel);
};

/**
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
exports.save = async (req, res) => {
	//save the response
	const { section, question } = req.params;
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);

	const sectionObj = journey.getSection(section);
	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj || !sectionObj) {
		return res.redirect(journey.baseUrl);
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

exports.remove = async (req, res) => {
	//save the response
	const { section, question, answerId } = req.params;
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);

	const sectionObj = journey.getSection(section);
	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj || !sectionObj) {
		return res.redirect(journey.baseUrl);
	}

	try {
		if (questionObj instanceof ListAddMoreQuestion) {
			await questionObj.removeAction(journeyResponse, answerId);
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
