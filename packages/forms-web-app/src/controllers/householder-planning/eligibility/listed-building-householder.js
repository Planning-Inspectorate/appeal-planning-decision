const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: { LISTED_BUILDING_HOUSEHOLDER },
    },
  },
} = require('../../../lib/householder-planning/views');

const sectionName = 'eligibility';

const getListedBuildingHouseholder = async (req, res) => {
  const {
    [sectionName]: { isListedBuilding },
    typeOfPlanningApplication,
  } = req.session.appeal;
  res.render(LISTED_BUILDING_HOUSEHOLDER, {
    isListedBuilding,
    typeOfPlanningApplication,
  });
};

const postListedBuildingHouseholder = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const {
    appeal,
    appeal: { typeOfPlanningApplication },
  } = req.session;

  const isListedBuilding = body['listed-building-householder'] === 'yes';

  if (Object.keys(errors).length > 0) {
    return res.render(LISTED_BUILDING_HOUSEHOLDER, {
      isListedBuilding,
      typeOfPlanningApplication,
      errors,
      errorSummary,
    });
  }

  try {
    appeal[sectionName].isListedBuilding = isListedBuilding;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(LISTED_BUILDING_HOUSEHOLDER, {
      isListedBuilding,
      typeOfPlanningApplication,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return isListedBuilding
    ? res.redirect(`/before-you-start/use-existing-service-listed-building`)
    : res.redirect('/before-you-start/granted-or-refused-householder');
};

module.exports = {
  getListedBuildingHouseholder,
  postListedBuildingHouseholder,
};
