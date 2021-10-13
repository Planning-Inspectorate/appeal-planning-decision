const moment = require('moment');
const { validate: validateUuid } = require('uuid');
const { VIEW } = require('../lib/views');
const { renderView } = require('../util/render');
const { getAppeal } = require('../lib/appeals-api-wrapper');

exports.getAlreadySubmitted = async (req, res) => {
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

  let appeal;
  try {
    appeal = await getAppeal(appealId);
  } catch (err) {
    req.log.error({ err }, 'Error retrieving appeal');
    res.status(404).send();
    return;
  }

  if (!appeal) {
    req.log.error(`Appeal with id ${appealId} not found.`);
    res.status(404).send();
    return;
  }

  renderView(res, VIEW.ALREADY_SUBMITTED, {
    prefix: 'appeal-questionnaire',
    horizonId: appeal.horizonId,
    submissionDate: moment(questionnaire.submissionDate).format('D MMMM YYYY'),
  });
};
