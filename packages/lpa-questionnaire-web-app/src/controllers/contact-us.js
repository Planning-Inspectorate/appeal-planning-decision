const { VIEW } = require('../lib/views');
const { renderView } = require('../util/render');

async function renderContactUs(req, res) {
  return renderView(res, VIEW.CONTACT_US, {
    prefix: 'appeal-questionnaire',
    backLink: req?.session?.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
  });
}

module.exports = {
  renderContactUs,
};
