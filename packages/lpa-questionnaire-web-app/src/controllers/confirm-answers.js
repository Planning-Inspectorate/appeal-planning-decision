const { VIEW } = require('../lib/views');
const checkAnswersSections = require('../lib/check-answers-sections');

module.exports = (req, res) => {
  const { appealReply } = req.session;
  const sections = checkAnswersSections(appealReply, req.params.id);

  // Set backLink property in session
  req.session.backLink = `/${req.params.id}/${VIEW.CONFIRM_ANSWERS}`;

  res.render(VIEW.CONFIRM_ANSWERS, {
    taskListLink: `/${req.params.id}/${VIEW.TASK_LIST}`,
    submissionLink: `/${req.params.id}/${VIEW.INFORMATION_SUBMITTED}`,
    sections,
  });
};
