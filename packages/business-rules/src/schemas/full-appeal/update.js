const pinsYup = require('../../lib/pins-yup');
const { APPEAL_ID, APPEAL_STATE, TYPE_OF_PLANNING_APPLICATION } = require('../../constants');

const update = pinsYup
  .object()
  .noUnknown(true)
  .shape({
    id: pinsYup.string().trim().uuid().required(),
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
    aboutYouSection: pinsYup
      .object()
      .shape({
        yourDetails: pinsYup.object().shape({
          appealingOnBehalfOf: pinsYup
            .string()
            .max(80)
            .matches(/^[a-z\-' ]*$/i)
            .nullable(),
          companyName: pinsYup.string().nullable(),
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
                name: pinsYup.string().trim().max(255).required(),
                originalFileName: pinsYup.string().trim().max(255).required(),
                id: pinsYup.string().trim().uuid().required(),
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
                name: pinsYup.string().trim().max(255).required(),
                originalFileName: pinsYup.string().trim().max(255).required(),
                id: pinsYup.string().trim().uuid().required(),
              })
              .noUnknown(true),
          })
          .noUnknown(true),
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
    appealSiteSection: pinsYup.object().shape({
      siteAddress: pinsYup
        .object()
        .shape({
          addressLine1: pinsYup.string().max(60).required(),
          addressLine2: pinsYup.string().max(60).nullable(),
          town: pinsYup.string().max(60).nullable(),
          county: pinsYup.string().max(60).nullable(),
          postcode: pinsYup.string().max(8).required(),
        })
        .noUnknown(true),
    }),
    sectionStates: pinsYup.object().shape({}),
  });

module.exports = update;
