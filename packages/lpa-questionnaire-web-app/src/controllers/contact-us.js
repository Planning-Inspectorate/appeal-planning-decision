const { VIEW } = require('../lib/views');
const { renderView } = require('../util/render');

function getContactUs(req, res) {
  return renderView(res, VIEW.CONTACT_US, {
    prefix: 'appeal-questionnaire',
    backLink: req?.session?.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
  });
}

module.exports = {
  getContactUs,
};
