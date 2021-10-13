const { validate: validateUuid } = require('uuid');
const { VIEW } = require('../lib/views');

module.exports = (req, res, next) => {
  const { id: appealId = '' } = req.params;

  if (!appealId || !validateUuid(appealId)) {
    res.status(404).send();
    return;
  }

  const questionnaire = req.session?.appealReply;

  if (!questionnaire) {
    req.log.error('Error retrieving questionnaire');
    res.status(404).send();
    return;
  }

  if (questionnaire.state.toUpperCase() === 'SUBMITTED') {
    res.redirect(`/appeal-questionnaire/${appealId}/${VIEW.ALREADY_SUBMITTED}`);
    return;
  }

  next();
};
