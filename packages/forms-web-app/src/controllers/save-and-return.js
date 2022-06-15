const { saveAppeal } = require('../lib/appeals-api-wrapper');
const { VIEW } = require('../lib/submit-appeal/views');

exports.postSaveAndReturn = async (req, res) => {
  await saveAppeal(req.session.appeal);
  res.redirect(`/${VIEW.SUBMIT_APPEAL.APPLICATION_SAVED}`);
};
