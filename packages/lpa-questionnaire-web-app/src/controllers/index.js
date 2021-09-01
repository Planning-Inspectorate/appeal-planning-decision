const { VIEW } = require('../lib/views');
const { redirect } = require('../util/render');

exports.getIndex = (req, res) => {
  redirect(res, 'appeal-questionnaire', `${req.params.id}/${VIEW.TASK_LIST}`, req.session.backLink);
};
