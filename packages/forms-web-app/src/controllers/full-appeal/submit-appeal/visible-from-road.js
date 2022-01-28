const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { HEALTH_SAFETY_ISSUES, VISIBLE_FROM_ROAD },
  },
} = require('../../../lib/full-appeal/views');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'appealSiteSection';
const isVisibleFromRoadTask = 'isVisibleFromRoad';
const visibleFromRoadDetailsTask = 'visibleFromRoadDetails';

const getVisibleFromRoad = (req, res) => {
  const {
    appeal: { [sectionName]: { isVisibleFromRoad, visibleFromRoadDetails } = {} },
  } = req.session;
  res.render(VISIBLE_FROM_ROAD, {
    isVisibleFromRoad,
    visibleFromRoadDetails,
  });
};

const postVisibleFromRoad = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  const isVisibleFromRoad = body['visible-from-road'] && body['visible-from-road'] === 'yes';
  const visibleFromRoadDetails = body['visible-from-road-details'];

  if (Object.keys(errors).length > 0) {
    return res.render(VISIBLE_FROM_ROAD, {
      isVisibleFromRoad,
      visibleFromRoadDetails,
      errors,
      errorSummary,
    });
  }

  try {
    appeal[sectionName] = appeal[sectionName] || {};
    appeal[sectionName][isVisibleFromRoadTask] = isVisibleFromRoad;
    appeal[sectionName][visibleFromRoadDetailsTask] = visibleFromRoadDetails;
    appeal.sectionStates[sectionName] = appeal.sectionStates[sectionName] || {};
    appeal.sectionStates[sectionName].isVisibleFromRoad = getTaskStatus(
      appeal,
      sectionName,
      isVisibleFromRoadTask
    );
    appeal.sectionStates[sectionName].visibleFromRoadDetails = getTaskStatus(
      appeal,
      sectionName,
      visibleFromRoadDetailsTask
    );

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(VISIBLE_FROM_ROAD, {
      isVisibleFromRoad,
      visibleFromRoadDetails,
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
