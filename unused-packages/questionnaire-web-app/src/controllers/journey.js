/***********************************************************
 * This is a generic controller which can handle the       *
 * rendering and saving of the majority of the questions / *
 * question types in the questionnaire                     *
 ***********************************************************/

const { HasJourney } = require('../definitions/journey/hasJourney');
const formHelper = require('../lib/dynamicformhelper');


exports.list = async (req, res) => {
    //render check your answers view
    const {appealId} = req.params;
    var summaryListData = { sections: [] };
    var answers = req.session.lpaAnswers || {};
    const questionnaire = new HasJourney({ answers: answers });

    for (let i=0; i < questionnaire.sections.length; i++) {
        var section = {
            heading: questionnaire.sections[i].name,
            list: {
                rows: []
            }
        };
        for (let j = 0; j < questionnaire.sections[i].questions.length; j++) {
            var question = questionnaire.sections[i].questions[j];
            if (true && question.taskList !== false) {
                if (question.format === undefined) {
                    var row = {
                        key: {
                        text: question.title ?? question.question
                        },
                        value: {
                        text: question.altText ?? answers[question.fieldName] ?? "Not started"
                        },
                        actions: {
                            items: [
                                {
                                href: `/questionnaire/${appealId}/${questionnaire.sections[i].segment}/${questionnaire.sections[i].questions[j].fieldName}`,
                                text: "Change",
                                visuallyHiddenText: question.question
                                }
                            ]
                        }
                    }
                    section.list.rows.push(row);
                } else {
                    var rows = question.format(answers, appealId, questionnaire.sections[i].segment, questionnaire.sections[i].questions[j].fieldName);
                    for (var k=0; k<rows.length; k++) {
                        var row = {
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
                        }
                        section.list.rows.push(row);
                    }
                }
            }
        }
        summaryListData.sections.push(section);
    }
    return res.render(`questions/summary`, summaryListData);
};

exports.question = async (req, res) => {
    //render an individual question
    const {appealId, section, question} = req.params;
    var answers = req.session.lpaAnswers || {};
    const questionnaire = new HasJourney({ answers: answers });

    var questionObj = questionnaire.getQuestionBySectionAndName(section, question);
    if (questionObj.renderAction != undefined)
    {
        await questionObj.renderAction(req, res);
    }
    else
    {
        var answer = answers[questionObj.fieldName] || "";
        var backLink = questionnaire.getNextQuestionUrl(appealId, section, question, answers, true);
        var viewModel = {
            "appealId": appealId,
            "question": questionObj.prepQuestionForRendering(answers),
            "answer": answer,
            "backLink": backLink,
            "navigation": ["",backLink]
        };
        return res.render(`questions/${questionObj.type}`, viewModel);
    }
};

exports.save = async (req, res) => {
    //save the response
    //for now, we'll just save it to the session
    //TODO: Needs to run validation!
    const {appealId, section, question} = req.params;
    var answers = req.session.lpaAnswers || {};
    var questionnaire = new HasJourney({ answers: answers });

    var questionObj = questionnaire.getQuestionBySectionAndName(section, question);
    const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

    if (Object.keys(errors).length > 0) {
        var answer = answers[questionObj.fieldName] || "";
        var backLink = questionnaire.getCurrentQuestionUrl(appealId, section, question, answers, true);
        var viewModel = {
            "appealId": appealId,
            "question": questionObj.prepQuestionForRendering(answers),
            "answer": answer,
            "backLink": backLink,
            "navigation": ["",backLink],
            "errors": errors,
            "errorSummary": errorSummary
        };
        return res.render(`questions/${questionObj.type}`, viewModel);
		};

    if (questionObj.saveAction != undefined)
    {
        await questionObj.saveAction(req, res);
    }
    else
    {
        var answers = req.body;
        req.session.lpaAnswers = req.session.lpaAnswers || {};
        req.session.lpaAnswers[questionObj.fieldName] = req.body[questionObj.fieldName];
        for(var propName in req.body) {
            if (propName.startsWith(questionObj.fieldName + "_"))
            {
                req.session.lpaAnswers[propName] = req.body[propName];
            }
        }
        //move to the next question
        var updatedQuestionnaire = new HasJourney({ answers: req.session.lpaAnswers });
        res.redirect(updatedQuestionnaire.getNextQuestionUrl(appealId, section, question, req.session.lpaAnswers, false));
    }
};
