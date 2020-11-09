const VIEW = {
  LISTED_BUILDING: 'eligibility/listed-building',
  LISTED_OUT: 'eligibility/listed-out',
};

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
  res.render(VIEW.LISTED_OUT);
};

exports.getListedBuilding = (req, res) => {
  res.render(VIEW.LISTED_BUILDING, { FORM_FIELD });
};

exports.postListedBuilding = (req, res) => {
  const { body } = req;

  const { errors = {}, errorSummary = {} } = body;

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.LISTED_BUILDING, {
      errors,
      errorSummary,
      FORM_FIELD,
    });
    return;
  }

  if (body['is-your-appeal-about-a-listed-building'] === 'yes') {
    res.redirect('/eligibility/listed-out');
    return;
  }

  res.redirect('/eligibility/appeal-statement');
};
