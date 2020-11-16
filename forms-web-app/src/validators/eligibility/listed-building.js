const { body } = require('express-validator');
const { FORM_FIELD } = require('../../controllers/eligibility/listed-building');

const rules = () => {
  const isYourAppealAListedBuildingId = 'is-your-appeal-about-a-listed-building';

  const isYourAppealAListedBuildingPossibleValues = FORM_FIELD[
    isYourAppealAListedBuildingId
  ].items.reduce((acc, item) => [...acc, item.value], []);

  return [
    body(isYourAppealAListedBuildingId)
      .notEmpty()
      .withMessage('Select yes if your appeal is about a listed building')
      .bail()
      .isIn(isYourAppealAListedBuildingPossibleValues),
  ];
};

module.exports = {
  rules,
};
