const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');

const { VIEW } = require('../../../lib/householder-planning/views');

const listedBuilding = VIEW.HOUSEHOLDER_PLANNING.LISTED_BUILDING;
const backLink = `/before-you-start/type-of-planning-application`;

exports.getListedBuildingHouseholder = async (req, res) => {
  res.render(listedBuilding, { backLink });
};

const redirect = (selection, res) => {
  if (selection === 'yes') {
    res.redirect(`/before-you-start/use-a-different-service`);
    return;
  }

  res.redirect('/before-you-start/granted-or-refused-householder');
};

exports.postListedBuildingHouseholder = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  const selection = body['listed-building-householder'];

  if (errors['listed-building-householder']) {
    return res.render(listedBuilding, {
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
};
