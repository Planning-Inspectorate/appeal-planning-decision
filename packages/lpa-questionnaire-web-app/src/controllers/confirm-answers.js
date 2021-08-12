const { VIEW } = require('../lib/views');
const checkAnswersSections = require('../lib/check-answers-sections');
const { renderView } = require('../util/render');

module.exports = (req, res) => {
  const { appealReply } = req.session;
  const sections = checkAnswersSections(appealReply, req.params.id);

  // Set backLink property in session
  req.session.backLink = `/appeal-questionnaire/${req.params.id}/${VIEW.CONFIRM_ANSWERS}`;

  renderView(res, VIEW.CONFIRM_ANSWERS, {
    prefix: 'appeal-questionnaire',
    taskListLink: `/appeal-questionnaire/${req.params.id}/${VIEW.TASK_LIST}`,
    submissionLink: `/appeal-questionnaire/${req.params.id}/${VIEW.INFORMATION_SUBMITTED}`,
    sections,
  });
};
