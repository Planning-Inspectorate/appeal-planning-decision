const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');

const { VIEW } = require('../../lib/views');

const listedBuilding = VIEW.HOUSEHOLDER_PLANNING.LISTED_BUILDING;
const backLink = `/${VIEW.HOUSEHOLDER_PLANNING.TYPE_OF_PLANNING_APPLICATION}`;

exports.getListedBuilding = async (req, res) => {
  res.render(listedBuilding, { backLink });
};

const redirect = (selection, res) => {
  if (selection === 'yes') {
    res.redirect(`/${VIEW.HOUSEHOLDER_PLANNING.USE_A_DIFFERENT_SERVICE}`);
    return;
  }

  res.redirect(`/${VIEW.HOUSEHOLDER_PLANNING.ENFORCEMENT_NOTICE}`);
};

exports.postListedBuilding = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  const selection = body['listed-building'];

  if (errors['listed-building']) {
    res.render(listedBuilding, {
      appeal,
      errors,
      errorSummary,
      backLink,
    });
  }

  appeal.eligibility = {
    ...appeal.eligibility,
    isListedBuilding: selection === 'yes',
  };

  if (!errors['listed-building']) {
    try {
      req.session.appeal = await createOrUpdateAppeal(appeal);
      redirect(selection, res);
    } catch (e) {
      logger.error(e);

      res.render(listedBuilding, {
        appeal,
        errors,
        errorSummary: [{ text: e.toString(), href: 'pageId' }],
        backLink,
      });
    }
  }
};
