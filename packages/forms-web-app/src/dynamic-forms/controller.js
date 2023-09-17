// common controllers for dynamic forms
const { getAppealByLPACodeAndId, patchQuestionResponse } = require('../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../services/lpa-user.service');
const { SECTION_STATUS } = require('./section');
const { getJourney } = require('./journey-factory');
const logger = require('../lib/logger');

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

	return res.render(journey.listingPageViewPath, {
		appeal,
		summaryListData,
		layoutTemplate: journey.journeyTemplate,
		pageCaption: `Appeal ${appeal.caseReference}`
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

	if (questionObj.renderAction) {
		return await questionObj.renderAction(req, res);
	}

	const answer = journey.response.answers[questionObj.fieldName] || '';

	return questionObj.renderPage(res, {
		layoutTemplate: journey.journeyTemplate,
		pageCaption: sectionObj?.name,
		backLink: journey.getNextQuestionUrl(section, question, true),
		listLink: journey.baseUrl,
		answers: journey.response.answers,
		answer,
		journeyTitle: journey.journeyTitle
	});
};

/**
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {JourneyType} journeyId
 */
exports.save = async (req, res, journeyId) => {
	//save the response
	//TODO: Needs to run validation!

	const { referenceId, section, question } = req.params;
	const encodedReferenceId = encodeURIComponent(referenceId);
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);

	const sectionObj = journey.getSection(section);
	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj || !sectionObj) {
		return res.redirect(journey.baseUrl);
	}

	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	try {
		// use custom saveAction
		if (questionObj.saveAction) {
			return await questionObj.saveAction(req, res, journey, sectionObj, journeyResponse);
		}

		// show errors
		if (Object.keys(errors).length > 0) {
			const answer = journeyResponse.answers[questionObj.fieldName] || '';

			return questionObj.renderPage(
				res,
				{
					layoutTemplate: journey.journeyTemplate,
					pageCaption: sectionObj?.name,
					backLink: journey.getNextQuestionUrl(section, question, true),
					listLink: journey.baseUrl,
					answers: journey.response.answers,
					answer
				},
				{
					errors,
					errorSummary
				}
			);
		}

		// set answer on response
		let responseToSave = { answers: {} };

		journeyResponse.answers[questionObj.fieldName] = req.body[questionObj.fieldName];
		responseToSave.answers[questionObj.fieldName] = req.body[questionObj.fieldName];
		for (let propName in req.body) {
			if (propName.startsWith(questionObj.fieldName + '_')) {
				journeyResponse.answers[propName] = req.body[propName];
				responseToSave.answers[propName] = req.body[propName];
			}
		}

		// save answer to database
		await patchQuestionResponse(journeyId, encodedReferenceId, responseToSave);

		//move to the next question
		const updatedQuestionnaire = getJourney(journeyResponse);
		return res.redirect(updatedQuestionnaire.getNextQuestionUrl(section, question, false));
	} catch (err) {
		logger.error(err);
		const answer = journeyResponse.answers[questionObj.fieldName] || '';
		return questionObj.renderPage(
			res,
			{
				layoutTemplate: journey.journeyTemplate,
				pageCaption: sectionObj?.name,
				backLink: journey.getNextQuestionUrl(section, question, true),
				listLink: journey.baseUrl,
				answers: journey.response.answers,
				answer
			},
			{
				errorSummary: [{ text: err.toString(), href: '#' }]
			}
		);
	}
};
