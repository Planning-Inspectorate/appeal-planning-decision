const yup = require('yup');
const { parseDateString } = require('./helpers/parseDateString');

function document() {
  return yup
    .object()
    .shape({
      uploadedFile: yup
        .object()
        .shape({
          name: yup.string().max(255).ensure().required(),
          id: yup
            .string()
            .uuid()
            .transform((value) => (!value ? null : value))
            .required(),
        })
        .noUnknown(true),
    })
    .noUnknown(true);
}

module.exports = yup
  .object()
  .noUnknown(true)
  .shape({
    id: yup.lazy((id) => {
      if (id !== undefined) {
        return yup.string().uuid().required();
      }
      return yup.mixed().notRequired();
    }),
    horizonId: yup.lazy((horizonId) => {
      if (horizonId !== undefined) {
        return yup.string().trim().max(20).nullable();
      }
      return yup.mixed().notRequired();
    }),
    lpaCode: yup.lazy((lpaCode) => {
      if (lpaCode !== undefined) {
        return yup.string().trim().max(20).nullable();
      }
      return yup.mixed().notRequired();
    }),
    decisionDate: yup.lazy((decisionDate) => {
      if (decisionDate !== undefined) {
        return yup.date().transform(parseDateString).nullable();
      }
      return yup.mixed().notRequired();
    }),
    state: yup.lazy((state) => {
      if (state !== undefined) {
        return yup.string().oneOf(['DRAFT', 'SUBMITTED']);
      }
      return yup.mixed().notRequired();
    }),
    eligibility: yup.lazy((eligibility) => {
      if (eligibility !== undefined) {
        return yup
          .object()
          .shape({
            enforcementNotice: yup.lazy((enforcementNotice) => {
              if (enforcementNotice !== undefined) {
                return yup.bool().required();
              }
              return yup.mixed().notRequired();
            }),
            isClaimingCosts: yup.lazy((isClaimingCosts) => {
              if (isClaimingCosts !== undefined) {
                return yup.bool().required();
              }
              return yup.mixed().notRequired();
            }),
          })
          .noUnknown(true);
      }
      return yup.mixed().notRequired();
    }),
    aboutYouSection: yup.lazy((aboutYouSection) => {
      if (aboutYouSection !== undefined) {
        return yup
          .object()
          .shape({
            yourDetails: yup.object().shape({
              isOriginalApplicant: yup.lazy((isOriginalApplicant) => {
                if (isOriginalApplicant !== undefined) {
                  return yup.bool().nullable().required();
                }
                return yup.mixed().notRequired();
              }),
              name: yup.lazy((name) => {
                if (name !== undefined) {
                  return yup.string().max(80).ensure().required();
                }
                return yup.mixed().notRequired();
              }),
              email: yup.lazy((emailValue) => {
                if (emailValue !== undefined) {
                  return yup.string().email().max(255).ensure().required();
                }
                return yup.mixed().notRequired();
              }),
              appealingOnBehalfOf: yup.lazy((appealingOnBehalfOf) => {
                if (appealingOnBehalfOf !== undefined) {
                  return yup.string().max(80).ensure().nullable();
                }
                return yup.mixed().notRequired();
              }),
            }),
          })
          .noUnknown(true);
      }
      return yup.mixed().notRequired();
    }),
    requiredDocumentsSection: yup.lazy((requiredDocumentsSection) => {
      if (requiredDocumentsSection !== undefined) {
        return yup
          .object()
          .shape({
            applicationNumber: yup.lazy((applicationNumber) => {
              if (applicationNumber !== undefined) {
                return yup.string().max(30).required();
              }
              return yup.mixed().notRequired();
            }),
            originalApplication: yup.lazy((originalApplication) => {
              if (originalApplication !== undefined) {
                return document();
              }
              return yup.mixed().notRequired();
            }),
            decisionLetter: yup.lazy((decisionLetter) => {
              if (decisionLetter !== undefined) {
                return document();
              }
              return yup.mixed().notRequired();
            }),
          })
          .noUnknown(true);
      }
      return yup.mixed().notRequired();
    }),
    yourAppealSection: yup.lazy((yourAppealSection) => {
      if (yourAppealSection !== undefined) {
        return yup.object().shape({
          appealStatement: yup.lazy((appealStatement) => {
            if (appealStatement !== undefined) {
              return document().shape({ hasSensitiveInformation: yup.bool().required() });
            }
            return yup.mixed().notRequired();
          }),
          otherDocuments: yup.lazy((otherDocuments) => {
            if (otherDocuments !== undefined) {
              return yup.object().shape({
                uploadedFiles: yup.array().of(
                  yup
                    .object()
                    .shape({
                      name: yup.string().max(255).ensure().required(),
                      id: yup
                        .string()
                        .uuid()
                        .transform((value) => (!value ? null : value))
                        .required(),
                    })
                    .noUnknown(true)
                ),
              });
            }
            return yup.mixed().notRequired();
          }),
        });
      }
      return yup.mixed().notRequired();
    }),
    appealSiteSection: yup.lazy((value) => {
      if (value !== undefined) {
        return yup.object().shape({
          siteAddress: yup.lazy((siteAddressValue) => {
            if (siteAddressValue !== undefined) {
              return yup
                .object()
                .shape({
                  addressLine1: yup.string().max(60).ensure().required(),
                  addressLine2: yup.string().max(60).ensure(),
                  town: yup.string().max(60).ensure(),
                  county: yup.string().max(60).ensure().required(),
                  postcode: yup.string().max(8).ensure().required(),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
          siteOwnership: yup.lazy((siteOwnershipValue) => {
            if (siteOwnershipValue !== undefined) {
              return yup
                .object()
                .shape({
                  ownsWholeSite: yup.bool().required(),
                  haveOtherOwnersBeenTold: yup.bool().nullable().default(null),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
          siteAccess: yup.lazy((siteAccessValue) => {
            if (siteAccessValue !== undefined) {
              return yup
                .object()
                .shape({
                  canInspectorSeeWholeSiteFromPublicRoad: yup.bool().required(),
                  howIsSiteAccessRestricted: yup.string().max(255).ensure(),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
          healthAndSafety: yup.lazy((healthAndSafetyValue) => {
            if (healthAndSafetyValue !== undefined) {
              return yup
                .object()
                .shape({
                  hasIssues: yup.bool().required(),
                  healthAndSafetyIssues: yup.string().max(255).ensure(),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
        });
      }
      return yup.mixed().notRequired();
    }),

    sectionStates: yup.lazy((value) => {
      if (value !== undefined) {
        return yup.object().shape({
          aboutYouSection: yup.object({
            yourDetails: yup.string().oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED']).required(),
          }),
          requiredDocumentsSection: yup.object({
            applicationNumber: yup
              .string()
              .oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED'])
              .required(),
            originalApplication: yup
              .string()
              .oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED'])
              .required(),
            decisionLetter: yup
              .string()
              .oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED'])
              .required(),
          }),
          yourAppealSection: yup.object({
            appealStatement: yup
              .string()
              .oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED'])
              .required(),
            otherDocuments: yup
              .string()
              .oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED'])
              .required(),
          }),
          appealSiteSection: yup.object({
            siteAccess: yup.string().oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED']).required(),
            siteOwnership: yup
              .string()
              .oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED'])
              .required(),
            healthAndSafety: yup
              .string()
              .oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED'])
              .required(),
          }),
        });
      }
      return yup.mixed().notRequired();
    }),
  });
