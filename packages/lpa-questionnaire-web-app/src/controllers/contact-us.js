const { VIEW } = require('../lib/views');

async function renderContactUs(req, res) {
  res.render(VIEW.CONTACT_US, {
    backLink: req?.session?.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
  });
}

exports.modules = {
  renderContactUs,
};
