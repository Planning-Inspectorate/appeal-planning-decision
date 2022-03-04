const {
  constants: {
    TYPE_OF_PLANNING_APPLICATION: {
      HOUSEHOLDER_PLANNING,
      SOMETHING_ELSE,
      I_HAVE_NOT_MADE_A_PLANNING_APPLICATION,
      PRIOR_APPROVAL,
    },
  },
} = require('@pins/business-rules');
const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { TYPE_OF_PLANNING_APPLICATION },
  },
} = require('../../lib/views');
const mapPlanningApplication = require('../../lib/full-appeal/map-planning-application');

const getTypeOfPlanningApplication = (req, res) => {
  const { appeal } = req.session;

  res.render(TYPE_OF_PLANNING_APPLICATION, {
    typeOfPlanningApplication: appeal.typeOfPlanningApplication,
  });
};

const postTypeOfPlanningApplication = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  const typeOfPlanningApplication = body['type-of-planning-application'];

  if (errors['type-of-planning-application']) {
    return res.render(TYPE_OF_PLANNING_APPLICATION, {
      typeOfPlanningApplication,
      errors,
      errorSummary,
    });
  }

  try {
    appeal.appealType = mapPlanningApplication(typeOfPlanningApplication);
    appeal.typeOfPlanningApplication = typeOfPlanningApplication;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);
    return res.render(TYPE_OF_PLANNING_APPLICATION, {
      typeOfPlanningApplication,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  switch (typeOfPlanningApplication) {
    case HOUSEHOLDER_PLANNING:
      return res.redirect('/before-you-start/listed-building-householder');
    case PRIOR_APPROVAL:
      return res.redirect('/before-you-start/prior-approval-existing-home');
    case SOMETHING_ELSE:
    case I_HAVE_NOT_MADE_A_PLANNING_APPLICATION:
      return res.redirect('/before-you-start/use-a-different-service');
    default:
      return res.redirect('/before-you-start/any-of-following');
  }
};

module.exports = {
  getTypeOfPlanningApplication,
  postTypeOfPlanningApplication,
};
