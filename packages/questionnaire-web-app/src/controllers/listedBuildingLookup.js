/***********************************************************
 * This is just an example controller to show how we might *
 * defer to a separate controller for more custom          *
 * rendering / saving logic.                               *
 ***********************************************************/
const formHelper = require('../lib/dynamicformhelper');


exports.enterNumber = async (req, res) => {
    const hasQuestionnaire = require('../definitions/questionnaire/hasQuestionnaire');
    const questionnaire = hasQuestionnaire.questionnaire;
    const {appealId, section, question} = req.params;
    var questionObj = await formHelper.getQuestionBySectionAndName(questionnaire, section, question);
    var answers = req.session.lpaAnswers || {};
    var answer = answers[questionObj.fieldName] || "";
    var backLink = await formHelper.getNextQuestionUrl(questionnaire, appealId, section, question, answers, true);
    var viewModel = {
        "appealId": appealId,
        "question": formHelper.prepQuestionForRendering(questionObj, answers),
        "answer": answer,
        "backLink": backLink,
        "navigation": ["",backLink]
    };
    res.render(`questions/listed-building-lookup`, viewModel);
};

exports.lookupCode = async (req, res) => {
    //code to lookup code and save response goes here...

    //for now, we'll just save it to the session
    const hasQuestionnaire = require('../definitions/questionnaire/hasQuestionnaire');
    const questionnaire = hasQuestionnaire.questionnaire;
    const {appealId, section, question} = req.params;
    var questionObj = await formHelper.getQuestionBySectionAndName(questionnaire, section, question);

    var answers = req.body;
    req.session.lpaAnswers = req.session.lpaAnswers || {};
    req.session.lpaAnswers[questionObj.fieldName] = req.session.lpaAnswers[questionObj.fieldName] || {};
    debugger;
    req.session.lpaAnswers['listed-detail-list'] = req.session.lpaAnswers['listed-detail-list'] || [];

    req.session.lpaAnswers['listed-detail-list'].push({
        grade: "II",
        listingNumber: req.body[questionObj.fieldName],
        name: "155, York Road, Bedminster, Bristol, BS3 4AL"
    });
   
    //move to the next question
    res.redirect(await formHelper.getNextQuestionUrl(questionnaire, appealId, section, question, req.session.lpaAnswers, false));
};

exports.manageListedBuildings = async (req, res) => {
    const hasQuestionnaire = require('../definitions/questionnaire/hasQuestionnaire');
    const questionnaire = hasQuestionnaire.questionnaire;
    const {appealId, section, question} = req.params;
    var questionObj = await formHelper.getQuestionBySectionAndName(questionnaire, section, question);
    const listedBuildings = req.session.lpaAnswers[questionObj.fieldName];
    debugger;
   return res.render('questions/listed-building-list', {
		listedBuildings
	});
}

