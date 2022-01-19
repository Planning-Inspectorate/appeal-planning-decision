const pinsYup = require('../../lib/pins-yup');
const parseDateString = require('../../utils/parse-date-string');
const singleDocumentInsert = require('../components/insert/single-document');
const multiDocumentInsert = require('../components/insert/multi-document');
const sectionState = require('../components/section-state');
const { APPEAL_ID, APPEAL_STATE, APPLICATION_DECISION } = require('../../constants');

const insert = pinsYup
  .object()
  .noUnknown(true)
  .shape({
    id: pinsYup.string().uuid().required(),
    horizonId: pinsYup.string().trim().max(20).nullable(),
    lpaCode: pinsYup.string().trim().max(20).nullable(),
    decisionDate: pinsYup.date().transform(parseDateString).nullable(),
    submissionDate: pinsYup.date().transform(parseDateString).nullable(),
    state: pinsYup.string().oneOf(Object.values(APPEAL_STATE)).default(APPEAL_STATE.DRAFT),
    appealType: pinsYup
      .string()
      .oneOf([...Object.values(APPEAL_ID), null])
      .nullable(),
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
        originalApplication: singleDocumentInsert().nullable(),
        decisionLetter: singleDocumentInsert().nullable(),
      })
      .noUnknown(true),
    yourAppealSection: pinsYup.object().shape({
      appealStatement: singleDocumentInsert().shape({
        hasSensitiveInformation: pinsYup.bool().nullable().default(null),
      }),
      otherDocuments: multiDocumentInsert(),
    }),
    appealSubmission: pinsYup.object().shape({
      appealPDFStatement: singleDocumentInsert(),
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
          healthAndSafetyIssues: pinsYup.string().max(255).nullable(),
        })
        .noUnknown(true),
    }),
    sectionStates: pinsYup.object().shape({
      aboutYouSection: pinsYup
        .object()
        .shape({
          yourDetails: sectionState().required(),
        })
        .noUnknown(true),
      requiredDocumentsSection: pinsYup
        .object()
        .shape({
          applicationNumber: sectionState().required(),
          originalApplication: sectionState().required(),
          decisionLetter: sectionState().required(),
        })
        .noUnknown(true),
      yourAppealSection: pinsYup
        .object()
        .shape({
          appealStatement: sectionState().required(),
          otherDocuments: sectionState().required(),
        })
        .noUnknown(true),
      appealSiteSection: pinsYup
        .object()
        .shape({
          siteAddress: sectionState().required(),
          siteAccess: sectionState().required(),
          siteOwnership: sectionState().required(),
          healthAndSafety: sectionState().required(),
        })
        .noUnknown(true),
    }),
  });

module.exports = insert;
