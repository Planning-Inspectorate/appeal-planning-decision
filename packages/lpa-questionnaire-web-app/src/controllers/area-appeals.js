const { VIEW } = require('../lib/views');

exports.getAreaAppeals = (req, res) => {
  res.render(VIEW.AREA_APPEALS);
};

exports.postAreaAppeals = async ({ body }, res) => {
  const { errors = {}, errorSummary = [] } = body;

  // TODO: add fallback here for existing form data
  const values = {
    'appeal-reference-numbers': body['appeal-reference-numbers'],
    'adjacent-appeals': body['adjacent-appeals'],
  };

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.AREA_APPEALS, {
      errors,
      errorSummary,
      values,
    });
    return;
  }

  res.redirect('/task-list');
};
