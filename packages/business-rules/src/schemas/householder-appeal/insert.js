const pinsYup = require('../../lib/pins-yup');
const parseDateString = require('../../utils/parse-date-string');
const {
  APPEAL_ID,
  APPEAL_STATE,
  APPLICATION_DECISION,
  SECTION_STATE,
  TYPE_OF_PLANNING_APPLICATION,
} = require('../../constants');

const insert = pinsYup
  .object()
  .noUnknown(true)
  .shape({
    id: pinsYup.string().uuid().required(),
    horizonId: pinsYup.string().trim().max(20).nullable(),
    lpaCode: pinsYup.string().trim().max(20).nullable(),
    decisionDate: pinsYup.date().transform(parseDateString).nullable(),
    createdAt: pinsYup.date().transform(parseDateString).required(),
    updatedAt: pinsYup.date().transform(parseDateString).required(),
    submissionDate: pinsYup.date().transform(parseDateString).nullable(),
    state: pinsYup.string().oneOf(Object.values(APPEAL_STATE)).default(APPEAL_STATE.DRAFT),
    appealType: pinsYup.lazy((appealType) => {
      if (appealType) {
        return pinsYup.string().oneOf(Object.values(APPEAL_ID));
      }
      return pinsYup.string().nullable();
    }),
    typeOfPlanningApplication: pinsYup.lazy((typeOfPlanningApplication) => {
      if (typeOfPlanningApplication) {
        return pinsYup.string().oneOf(Object.values(TYPE_OF_PLANNING_APPLICATION));
      }
      return pinsYup.string().nullable();
    }),
    eligibility: pinsYup
      .object()
      .shape({
        applicationDecision: pinsYup.lazy((applicationDecision) => {
          if (applicationDecision) {
            return pinsYup.string().oneOf(Object.values(APPLICATION_DECISION));
          }
          return pinsYup.string().nullable();
        }),
        enforcementNotice: pinsYup.bool().nullable(),
        householderPlanningPermission: pinsYup.bool().nullable(),
        isClaimingCosts: pinsYup.bool().nullable(),
        isListedBuilding: pinsYup.bool().nullable(),
        hasPriorApprovalForExistingHome: pinsYup.bool().nullable(),
      })
      .noUnknown(true),
    aboutYouSection: pinsYup
      .object()
      .shape({
        yourDetails: pinsYup.object().shape({
          isOriginalApplicant: pinsYup.bool().nullable(),
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
          email: pinsYup.string().email().max(255).nullable(),
          appealingOnBehalfOf: pinsYup
            .string()
            .max(80)
            .matches(/^[a-z\-' ]*$/i)
            .nullable(),
        }),
      })
      .noUnknown(true),
    requiredDocumentsSection: pinsYup
      .object()
      .shape({
        applicationNumber: pinsYup.string().max(30).nullable(),
        originalApplication: pinsYup
          .object()
          .shape({
            uploadedFile: pinsYup
              .object()
              .shape({
                id: pinsYup.string().trim().uuid().nullable().default(null),
                name: pinsYup.string().trim().max(255).ensure(),
                fileName: pinsYup.string().trim().max(255).ensure(),
                originalFileName: pinsYup.string().trim().max(255).ensure(),
                location: pinsYup.string().trim().nullable(),
                size: pinsYup.number().nullable(),
              })
              .noUnknown(true),
          })
          .noUnknown(true),
        decisionLetter: pinsYup
          .object()
          .shape({
            uploadedFile: pinsYup
              .object()
              .shape({
                id: pinsYup.string().trim().uuid().nullable().default(null),
                name: pinsYup.string().trim().max(255).ensure(),
                fileName: pinsYup.string().trim().max(255).ensure(),
                originalFileName: pinsYup.string().trim().max(255).ensure(),
                location: pinsYup.string().trim().nullable(),
                size: pinsYup.number().nullable(),
              })
              .noUnknown(true),
          })
          .noUnknown(true),
      })
      .noUnknown(true),
    yourAppealSection: pinsYup.object().shape({
      appealStatement: pinsYup
        .object()
        .shape({
          uploadedFile: pinsYup
            .object()
            .shape({
              id: pinsYup.string().trim().uuid().nullable().default(null),
              name: pinsYup.string().trim().max(255).ensure(),
              fileName: pinsYup.string().trim().max(255).ensure(),
              originalFileName: pinsYup.string().trim().max(255).ensure(),
              location: pinsYup.string().trim().nullable(),
              size: pinsYup.number().nullable(),
            })
            .noUnknown(true),
          hasSensitiveInformation: pinsYup.bool().nullable().default(null),
        })
        .noUnknown(true),
      otherDocuments: pinsYup
        .object()
        .shape({
          uploadedFiles: pinsYup
            .array()
            .of(
              pinsYup
                .object()
                .shape({
                  id: pinsYup.string().trim().uuid().nullable().default(null),
                  name: pinsYup.string().trim().max(255).ensure(),
                  fileName: pinsYup.string().trim().max(255).ensure(),
                  originalFileName: pinsYup.string().trim().max(255).ensure(),
                  location: pinsYup.string().trim().nullable(),
                  size: pinsYup.number().nullable(),
                })
                .noUnknown(true),
            )
            .nullable()
            .default([]),
        })
        .noUnknown(true),
    }),
    appealSubmission: pinsYup.object().shape({
      appealPDFStatement: pinsYup
        .object()
        .shape({
          uploadedFile: pinsYup
            .object()
            .shape({
              id: pinsYup.string().trim().uuid().nullable().default(null),
              name: pinsYup.string().trim().max(255).ensure(),
              fileName: pinsYup.string().trim().max(255).ensure(),
              originalFileName: pinsYup.string().trim().max(255).ensure(),
              location: pinsYup.string().trim().nullable(),
              size: pinsYup.number().nullable(),
            })
            .noUnknown(true),
        })
        .noUnknown(true),
    }),
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
      siteOwnership: pinsYup
        .object()
        .shape({
          ownsWholeSite: pinsYup.bool().nullable(),
          haveOtherOwnersBeenTold: pinsYup.bool().nullable(),
        })
        .noUnknown(true),
      siteAccess: pinsYup
        .object()
        .shape({
          canInspectorSeeWholeSiteFromPublicRoad: pinsYup.bool().nullable(),
          howIsSiteAccessRestricted: pinsYup.string().max(255).nullable(),
        })
        .noUnknown(true),
      healthAndSafety: pinsYup
        .object()
        .shape({
          hasIssues: pinsYup.bool().nullable(),
          healthAndSafetyIssues: pinsYup.string().max(255).ensure(),
        })
        .noUnknown(true),
    }),
    sectionStates: pinsYup.object().shape({
      aboutYouSection: pinsYup
        .object()
        .shape({
          yourDetails: pinsYup.string().oneOf(Object.values(SECTION_STATE)).default('NOT STARTED'),
        })
        .noUnknown(true),
      requiredDocumentsSection: pinsYup
        .object()
        .shape({
          applicationNumber: pinsYup
            .string()
            .oneOf(Object.values(SECTION_STATE))
            .default('NOT STARTED'),
          originalApplication: pinsYup
            .string()
            .oneOf(Object.values(SECTION_STATE))
            .default('NOT STARTED'),
          decisionLetter: pinsYup
            .string()
            .oneOf(Object.values(SECTION_STATE))
            .default('NOT STARTED'),
        })
        .noUnknown(true),
      yourAppealSection: pinsYup
        .object()
        .shape({
          appealStatement: pinsYup
            .string()
            .oneOf(Object.values(SECTION_STATE))
            .default('NOT STARTED'),
          otherDocuments: pinsYup
            .string()
            .oneOf(Object.values(SECTION_STATE))
            .default('NOT STARTED'),
        })
        .noUnknown(true),
      appealSiteSection: pinsYup
        .object()
        .shape({
          siteAddress: pinsYup.string().oneOf(Object.values(SECTION_STATE)).default('NOT STARTED'),
          siteAccess: pinsYup.string().oneOf(Object.values(SECTION_STATE)).default('NOT STARTED'),
          siteOwnership: pinsYup
            .string()
            .oneOf(Object.values(SECTION_STATE))
            .default('NOT STARTED'),
          healthAndSafety: pinsYup
            .string()
            .oneOf(Object.values(SECTION_STATE))
            .default('NOT STARTED'),
        })
        .noUnknown(true),
    }),
  });

module.exports = insert;
