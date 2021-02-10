const { VIEW } = require('../../lib/views');

const FORM_FIELD = {
  'is-your-appeal-about-a-listed-building': {
    id: 'is-your-appeal-about-a-listed-building',
    items: [
      {
        value: 'yes',
        text: 'Yes',
      },
      {
        value: 'no',
        text: 'No',
      },
    ],
  },
};

exports.FORM_FIELD = FORM_FIELD;

exports.getServiceNotAvailableForListedBuildings = (req, res) => {
  res.render(VIEW.ELIGIBILITY.LISTED_OUT);
};

exports.getListedBuilding = (req, res) => {
  res.render(VIEW.ELIGIBILITY.LISTED_BUILDING, { FORM_FIELD });
};

exports.postListedBuilding = (req, res) => {
  const { body } = req;

  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.ELIGIBILITY.LISTED_BUILDING, {
      errors,
      errorSummary,
      FORM_FIELD,
    });
    return;
  }

  if (body['is-your-appeal-about-a-listed-building'] === 'yes') {
    res.redirect(`/${VIEW.ELIGIBILITY.LISTED_OUT}`);
    return;
  }

  res.redirect(`/${VIEW.ELIGIBILITY.COSTS}`);
};
