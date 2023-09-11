// common controllers for dynamic forms
const { patchQuestionResponse } = require('../lib/appeals-api-wrapper');
const { getJourney } = require('./journey-factory');
const logger = require('../lib/logger');

/**
 * @typedef {import('./journey-factory').JourneyType} JourneyType
 */

/**
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
exports.list = async (req, res) => {
	//render check your answers view
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);
	const listingPageDetails = await journey.getListingPageData(req);

	return res.render(journey.listingPageViewPath, {
		layoutTemplate: journey.journeyTemplate,
		summaryListData: listingPageDetails.summaryListData,
		customData: listingPageDetails.customData,
		pageCaption: listingPageDetails.pageCaption
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
		answer
	});
};

/**
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {JourneyType} journeyId
 */
exports.save = async (req, res, journeyId) => {
	//save the response
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
