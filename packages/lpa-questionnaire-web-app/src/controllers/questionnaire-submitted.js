const { VIEW } = require('../lib/views');

exports.getQuestionnaireSubmitted = (req, res) => {
  res.render(VIEW.QUESTIONNAIRE_SUBMITTED, {});
};
