const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');

const { VIEW } = require('../../lib/views');

exports.getTypeOfPlanningApplication = async (req, res) => {
  res.render(VIEW.FULL_PLANNING.TYPE_OF_PLANNING_APPLICATION, {
    backLink: `${VIEW.FULL_PLANNING.LOCAL_PLANNING_DEPARTMENT}`,
  });
};

const redirect = (selection, res) => {
  if (selection === 'householder-planning') {
    res.redirect(`/before-you-start/listed-building`);
    return;
  }

  if (selection === 'something-else' || selection === 'i-have-not-made-a-planning-application') {
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
    res.render(VIEW.FULL_PLANNING.TYPE_OF_PLANNING_APPLICATION, {
      appeal,
      errors,
      errorSummary,
      backLink: `${VIEW.FULL_PLANNING.LOCAL_PLANNING_DEPARTMENT}`,
    });
  }

  if (!errors['type-of-planning-application']) {
    try {
      req.session.appeal = await createOrUpdateAppeal(appeal);
      redirect(selection, res);
    } catch (e) {
      logger.error(e);

      res.render(VIEW.FULL_PLANNING.TYPE_OF_PLANNING_APPLICATION, {
        appeal,
        errors,
        errorSummary: [{ text: e.toString(), href: 'pageId' }],
        backLink: `${VIEW.FULL_PLANNING.LOCAL_PLANNING_DEPARTMENT}`,
      });
    }
  }
};
