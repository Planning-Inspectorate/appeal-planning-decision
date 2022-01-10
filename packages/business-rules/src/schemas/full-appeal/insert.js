const pinsYup = require('../../lib/pins-yup');
const { APPEAL_ID, APPEAL_STATE, TYPE_OF_PLANNING_APPLICATION } = require('../../constants');

const insert = pinsYup
  .object()
  .noUnknown(true)
  .shape({
    id: pinsYup.string().trim().uuid().required(),
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
    requiredDocumentsSection: pinsYup
      .object()
      .shape({
        originalApplication: pinsYup
          .object()
          .shape({
            uploadedFile: pinsYup
              .object()
              .shape({
                name: pinsYup.string().trim().max(255).ensure(),
                originalFileName: pinsYup.string().trim().max(255).ensure(),
                id: pinsYup.string().trim().uuid().nullable().default(null),
              })
              .noUnknown(true),
          })
          .noUnknown(true),
        designAccessStatement: pinsYup
          .object()
          .shape({
            uploadedFile: pinsYup
              .object()
              .shape({
                name: pinsYup.string().trim().max(255).ensure(),
                originalFileName: pinsYup.string().trim().max(255).ensure(),
                id: pinsYup.string().trim().uuid().nullable().default(null),
              })
              .noUnknown(true),
          })
          .noUnknown(true),
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
    appealSiteSection: pinsYup.object().shape({
      siteAddress: pinsYup
        .object()
        .shape({
          addressLine1: pinsYup.string().max(60).nullable(),
          addressLine2: pinsYup.string().max(60).nullable(),
          town: pinsYup.string().max(60).nullable(),
          county: pinsYup.string().max(60).nullable(),
          postcode: pinsYup.string().max(8).nullable(),
        })
        .noUnknown(true),
    }),
    sectionStates: pinsYup.object().shape({}),
  });

module.exports = insert;
