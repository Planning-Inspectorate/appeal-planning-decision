const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { HEALTH_SAFETY_ISSUES, VISIBLE_FROM_ROAD },
  },
} = require('../../../lib/full-appeal/views');
// const { getTaskStatus } = require('../../../services/task.service');
const { NOT_STARTED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealSiteSection';
const taskName = 'visibleFromRoad';

const getVisibleFromRoad = (req, res) => {
  const { visibleFromRoad } = req.session.appeal[sectionName];
  res.render(VISIBLE_FROM_ROAD, {
    visibleFromRoad,
  });
};

const postVisibleFromRoad = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  const visibleFromRoad = {
    isVisible: body['visible-from-road'] && body['visible-from-road'] === 'yes',
    details: body['visible-from-road-details'],
  };

  if (Object.keys(errors).length > 0) {
    return res.render(VISIBLE_FROM_ROAD, {
      visibleFromRoad,
      errors,
      errorSummary,
    });
  }

  try {
    appeal[sectionName][taskName] = visibleFromRoad;
    // appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    appeal.sectionStates[sectionName][taskName] = NOT_STARTED;

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(VISIBLE_FROM_ROAD, {
      visibleFromRoad,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${HEALTH_SAFETY_ISSUES}`);
};

module.exports = {
  getVisibleFromRoad,
  postVisibleFromRoad,
};
