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
        typeOfPlanningApplication: pinsYup
          .string()
          .oneOf(Object.values(TYPE_OF_PLANNING_APPLICATION)),
      })
      .noUnknown(true),
  });

module.exports = insert;
