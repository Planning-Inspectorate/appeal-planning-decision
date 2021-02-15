const yup = require('yup');
const parseDateString = require('../../../lib/parse-date-string');

exports.insertAppeal = yup
  .object()
  .noUnknown(true)
  .shape({
    id: yup.string().uuid().required(),
    horizonId: yup.string().trim().max(20).nullable(),
    lpaCode: yup.string().trim().max(20).nullable().default(null),
    decisionDate: yup.date().transform(parseDateString).nullable().default(null),
    state: yup.string().oneOf(['DRAFT', 'SUBMITTED']).default('DRAFT'),
    aboutYouSection: yup.object().shape({
      yourDetails: yup.object().shape({
        isOriginalApplicant: yup.bool().nullable().default(null),
        name: yup.string().max(80).ensure(),
        email: yup.string().email().max(255).ensure(),
        appealingOnBehalfOf: yup.string().max(80).ensure(),
      }),
    }),
    requiredDocumentsSection: yup.object().shape({
      applicationNumber: yup.string().max(30).ensure(),
      originalApplication: yup.object().shape({
        uploadedFile: yup.object().shape({
          name: yup.string().max(255).ensure(),
          id: yup
            .string()
            .uuid()
            .transform((value) => (!value ? null : value))
            .nullable()
            .default(null),
        }),
      }),
      decisionLetter: yup.object().shape({
        uploadedFile: yup.object().shape({
          name: yup.string().max(255).ensure(),
          id: yup
            .string()
            .uuid()
            .transform((value) => (!value ? null : value))
            .nullable()
            .default(null),
        }),
      }),
    }),
    yourAppealSection: yup.object().shape({
      appealStatement: yup.object().shape({
        uploadedFile: yup.object().shape({
          name: yup.string().max(255).ensure(),
          id: yup
            .string()
            .uuid()
            .transform((value) => (!value ? null : value))
            .nullable()
            .default(null),
        }),
        hasSensitiveInformation: yup.bool().nullable().default(null),
      }),
      otherDocuments: yup.object().shape({
        uploadedFiles: yup
          .array()
          .of(
            yup.object().shape({
              name: yup.string().max(255).ensure(),
              id: yup
                .string()
                .uuid()
                .transform((value) => (!value ? null : value))
                .nullable()
                .default(null),
            })
          )
          .nullable()
          .default([]),
      }),
    }),
    appealSiteSection: yup.object().shape({
      siteAddress: yup.object().shape({
        addressLine1: yup.string().max(60).ensure(),
        addressLine2: yup.string().max(60).ensure(),
        town: yup.string().max(60).ensure(),
        county: yup.string().max(60).ensure(),
        postcode: yup.string().max(8).ensure(),
      }),
      siteOwnership: yup.object().shape({
        ownsWholeSite: yup.bool().nullable().default(null),
        haveOtherOwnersBeenTold: yup.bool().nullable().default(null),
      }),
      siteAccess: yup.object({
        canInspectorSeeWholeSiteFromPublicRoad: yup.bool().nullable().default(null),
        howIsSiteAccessRestricted: yup.string().max(255).ensure(),
      }),
      healthAndSafety: yup.object({
        hasIssues: yup.bool().nullable().default(null),
        healthAndSafetyIssues: yup.string().max(255).ensure(),
      }),
    }),
    sectionStates: yup.object({
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
        decisionLetter: yup.string().oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED']).required(),
      }),
      yourAppealSection: yup.object({
        appealStatement: yup.string().oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED']).required(),
        otherDocuments: yup.string().oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED']).required(),
      }),
      appealSiteSection: yup.object({
        siteAccess: yup.string().oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED']).required(),
        siteOwnership: yup.string().oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED']).required(),
        healthAndSafety: yup.string().oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED']).required(),
      }),
    }),
    eligibility: yup.object().shape({
      enforcementNotice: yup.bool().nullable().default(null),
      householderPlanningPermission: yup.bool().nullable().default(null),
      isClaimingCosts: yup.bool().nullable().default(null),
    }),
  });
