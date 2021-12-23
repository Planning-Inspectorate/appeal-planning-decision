const pinsYup = require('../../lib/pins-yup');
const { APPEAL_ID, APPEAL_STATE, TYPE_OF_PLANNING_APPLICATION } = require('../../constants');

const insert = pinsYup
  .object()
  .noUnknown(true)
  .shape({
    id: pinsYup.string().uuid().required(),
    horizonId: pinsYup.string().trim().max(20).nullable(),
    lpaCode: pinsYup.string().trim().max(20).nullable(),
    state: pinsYup.string().oneOf(Object.values(APPEAL_STATE)).default(APPEAL_STATE.DRAFT),
    appealType: pinsYup.string().oneOf(Object.values(APPEAL_ID)),
    beforeYouStartSection: pinsYup
      .object()
      .shape({
        typeOfPlanningApplication: pinsYup.lazy((typeOfPlanningApplication) => {
          if (typeOfPlanningApplication) {
            return pinsYup.string().oneOf(Object.values(TYPE_OF_PLANNING_APPLICATION));
          }
          return pinsYup.string().nullable();
        }),
      })
      .noUnknown(true),
    contactDetailsSection: pinsYup
      .object()
      .shape({
        name: pinsYup.lazy((name) => {
          if (name) {
            return pinsYup
              .string()
              .min(2)
              .max(80)
              .matches(/^[a-z\-' ]+$/i)
              .required();
          }
          return pinsYup.string().nullable();
        }),
        companyName: pinsYup.string().max(50).nullable(),
        email: pinsYup.string().email().max(255).nullable(),
      })
      .noUnknown(true),
    sectionStates: pinsYup.object().shape({}),
  });

module.exports = insert;
