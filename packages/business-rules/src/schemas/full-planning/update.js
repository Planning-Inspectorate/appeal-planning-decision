const pinsYup = require('../../lib/pins-yup');
const { APPEAL_ID, APPEAL_STATE, TYPE_OF_PLANNING_APPLICATION } = require('../../constants');

const update = pinsYup
  .object()
  .noUnknown(true)
  .shape({
    id: pinsYup.string().uuid().required(),
    horizonId: pinsYup.string().trim().max(20).nullable(),
    lpaCode: pinsYup.string().trim().max(20).required(),
    state: pinsYup.string().oneOf(Object.values(APPEAL_STATE)).required(),
    appealType: pinsYup.string().oneOf(Object.values(APPEAL_ID)).required(),
    beforeYouStartSection: pinsYup
      .object()
      .shape({
        typeOfPlanningApplication: pinsYup
          .string()
          .oneOf(Object.values(TYPE_OF_PLANNING_APPLICATION))
          .required(),
      })
      .noUnknown(true),
    contactDetailsSection: pinsYup
      .object()
      .shape({
        name: pinsYup
          .string()
          .min(2)
          .max(80)
          .matches(/^[a-z\-' ]+$/i)
          .required(),
        companyName: pinsYup.string().max(50).nullable(),
        email: pinsYup.string().email().max(255).required(),
      })
      .noUnknown(true),
    sectionStates: pinsYup.object().shape({}),
  });

module.exports = update;
