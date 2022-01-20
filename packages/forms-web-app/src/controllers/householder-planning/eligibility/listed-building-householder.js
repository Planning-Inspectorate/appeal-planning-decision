const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { VIEW } = require('../../../lib/householder-planning/views');

const backLink = '/before-you-start/type-of-planning-application';

exports.getListedBuildingHouseholder = async (req, res) => {
  res.render(VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.LISTED_BUILDING_HOUSEHOLDER, { backLink });
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
    return res.render(VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.LISTED_BUILDING_HOUSEHOLDER, {
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
    return redirect(selection, res);
  } catch (e) {
    logger.error(e);

    return res.render(VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.LISTED_BUILDING_HOUSEHOLDER, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: 'pageId' }],
      backLink,
    });
  }
};
