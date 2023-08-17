// common controllers for dynamic forms
const { getAppealByLPACodeAndId } = require('../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../services/lpa-user.service');
const { HasJourney } = require('./has-questionnaire/journey');

// todo:
// test
// refactor?
// remove hard coded tie ins to has questionnaire: pass in journey type via route, get links from journey implementation?
// cleaner means of handling question type in urls
// jsdoc

const {
	VIEW: {
		TASK_LIST: { QUESTIONNAIRE }
	}
} = require('./dynamic-components/views');
//todo: should this be tied to a particular view, or can this be obtained from Journey object?

exports.list = async (req, res) => {
	//render check your answers view
	const { caseRef } = req.params;

	const user = getLPAUserFromSession(req);
	const caseReference = encodeURIComponent(caseRef);
	const appeal = await getAppealByLPACodeAndId(user.lpaCode, caseReference);

	const summaryListData = { sections: [] };
	const answers = req.session.lpaAnswers || {};
	const questionnaire = new HasJourney({ answers: answers });

	for (let i = 0; i < questionnaire.sections.length; i++) {
		const section = {
			heading: questionnaire.sections[i].name,
			list: {
				rows: []
			}
		};
		for (let j = 0; j < questionnaire.sections[i].questions.length; j++) {
			const question = questionnaire.sections[i].questions[j];
			if (true && question.taskList !== false) {
				if (question.format === undefined) {
					const row = {
						key: {
							text: question.title ?? question.question
						},
						value: {
							text: question.altText ?? answers[question.fieldName] ?? 'Not started'
						},
						actions: {
							items: [
								{
									href: `/manage-appeals/questionnaire/${encodeURIComponent(caseRef)}/${
										questionnaire.sections[i].segment
									}/${questionnaire.sections[i].questions[j].fieldName}`,
									text: 'Answer',
									visuallyHiddenText: question.question
								}
							]
						}
					};
					section.list.rows.push(row);
				} else {
					const rows = question.format(
						answers,
						caseRef,
						questionnaire.sections[i].segment,
						questionnaire.sections[i].questions[j].fieldName
					);
					for (let k = 0; k < rows.length; k++) {
						const row = {
							key: {
								text: rows[k].title
							},
							value: {
								text: rows[k].value
							},
							actions: {
								items: [
									{
										href: rows[k].ctaLink,
										text: rows[k].ctaText
									}
								]
							}
						};
						section.list.rows.push(row);
					}
				}
			}
		}
		summaryListData.sections.push(section);
	}
	return res.render(QUESTIONNAIRE, {
		appeal,
		summaryListData,
		layoutTemplate: '../../../views/layouts/lpa-dashboard/main.njk'
	}); //todo: use layout property on HASJourney object
};

exports.question = async (req, res) => {
	//render an individual question
	const { caseRef, section, question } = req.params;
	const answers = req.session.lpaAnswers || {};
	const questionnaire = new HasJourney({ answers: answers });

	const questionObj = questionnaire.getQuestionBySectionAndName(section, question);
	if (questionObj.renderAction != undefined) {
		await questionObj.renderAction(req, res);
	} else {
		const answer = answers[questionObj.fieldName] || '';
		const backLink = questionnaire.getNextQuestionUrl(caseRef, section, question, answers, true);
		const viewModel = {
			appealId: caseRef,
			question: questionObj.prepQuestionForRendering(answers),
			answer: answer,
			backLink: backLink,
			navigation: ['', backLink]
		};
		return res.render(`dynamic-components/${questionObj.type}/index`, viewModel);
	}
};

exports.save = async (req, res) => {
	//save the response
	//for now, we'll just save it to the session
	//TODO: Needs to run validation!
	const { caseRef, section, question } = req.params;
	const answers = req.session.lpaAnswers || {};
	const questionnaire = new HasJourney({ answers: answers });

	const questionObj = questionnaire.getQuestionBySectionAndName(section, question);
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	if (Object.keys(errors).length > 0) {
		const answer = answers[questionObj.fieldName] || '';
		const backLink = questionnaire.getCurrentQuestionUrl(caseRef, section, question, answers, true);
		const viewModel = {
			appealId: caseRef,
			question: questionObj.prepQuestionForRendering(answers),
			answer: answer,
			backLink: backLink,
			navigation: ['', backLink],
			errors: errors,
			errorSummary: errorSummary
		};
		return res.render(`dynamic-components/${questionObj.type}/index`, viewModel);
	}

	if (questionObj.saveAction != undefined) {
		await questionObj.saveAction(req, res);
	} else {
		// const answers = req.body;
		req.session.lpaAnswers = req.session.lpaAnswers || {};
		req.session.lpaAnswers[questionObj.fieldName] = req.body[questionObj.fieldName];
		for (let propName in req.body) {
			if (propName.startsWith(questionObj.fieldName + '_')) {
				req.session.lpaAnswers[propName] = req.body[propName];
			}
		}
		//move to the next question
		const updatedQuestionnaire = new HasJourney({ answers: req.session.lpaAnswers });
		res.redirect(
			updatedQuestionnaire.getNextQuestionUrl(
				caseRef,
				section,
				question,
				req.session.lpaAnswers,
				false
			)
		);
	}
};
