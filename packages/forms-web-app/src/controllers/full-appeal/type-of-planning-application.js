const {
  constants: {
    TYPE_OF_PLANNING_APPLICATION: {
      HOUSEHOLDER_PLANNING,
      SOMETHING_ELSE,
      I_HAVE_NOT_MADE_A_PLANNING_APPLICATION,
    },
  },
} = require('@pins/business-rules');
const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');

const { VIEW } = require('../../lib/views');

exports.getTypeOfPlanningApplication = async (req, res) => {
  res.render(VIEW.FULL_APPEAL.TYPE_OF_PLANNING_APPLICATION, {
    backLink: `${VIEW.FULL_APPEAL.LOCAL_PLANNING_DEPARTMENT}`,
  });
};

const redirect = (selection, res) => {
  if (selection === HOUSEHOLDER_PLANNING) {
    res.redirect(`/before-you-start/listed-building-householder`);
    return;
  }

  if (selection === SOMETHING_ELSE || selection === I_HAVE_NOT_MADE_A_PLANNING_APPLICATION) {
    res.redirect(`/before-you-start/use-a-different-service`);
    return;
  }

  res.redirect(`/before-you-start/any-of-following`);
};

exports.postTypeOfPlanningApplication = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  const selection = body['type-of-planning-application'];
  appeal.beforeYouStartSection = { typeOfPlanningApplication: selection };

  if (errors['type-of-planning-application']) {
    return res.render(VIEW.FULL_APPEAL.TYPE_OF_PLANNING_APPLICATION, {
      appeal,
      errors,
      errorSummary,
      backLink: `${VIEW.FULL_APPEAL.LOCAL_PLANNING_DEPARTMENT}`,
    });
  }

  try {
    req.session.appeal = await createOrUpdateAppeal(appeal);
    return redirect(selection, res);
  } catch (e) {
    logger.error(e);

    return res.render(VIEW.FULL_APPEAL.TYPE_OF_PLANNING_APPLICATION, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: 'pageId' }],
      backLink: `${VIEW.FULL_APPEAL.LOCAL_PLANNING_DEPARTMENT}`,
    });
  }
};
