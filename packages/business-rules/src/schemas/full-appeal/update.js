const pinsYup = require('../../lib/pins-yup');
const parseDateString = require('../../utils/parse-date-string');
const {
  APPEAL_ID,
  APPEAL_STATE,
  APPLICATION_DECISION,
  I_AGREE,
  KNOW_THE_OWNERS,
  SECTION_STATE,
  TYPE_OF_PLANNING_APPLICATION,
} = require('../../constants');

const update = pinsYup
  .object()
  .noUnknown(true)
  .shape({
    id: pinsYup.string().trim().uuid().required(),
    horizonId: pinsYup.string().trim().max(20).nullable(),
    lpaCode: pinsYup.string().trim().max(20).required(),
    decisionDate: pinsYup.lazy((decisionDate) => {
      return pinsYup
        .date()
        .isInThePast(decisionDate)
        .isWithinDeadlinePeriod(decisionDate)
        .transform(parseDateString)
        .required();
    }),
    state: pinsYup.string().oneOf(Object.values(APPEAL_STATE)).required(),
    appealType: pinsYup.string().oneOf(Object.values(APPEAL_ID)).required(),
    typeOfPlanningApplication: pinsYup
      .string()
      .oneOf(Object.values(TYPE_OF_PLANNING_APPLICATION))
      .required(),
    eligibility: pinsYup
      .object()
      .shape({
        applicationCategories: pinsYup.string().matches('none_of_these').required(),
        applicationDecision: pinsYup.string().oneOf(Object.values(APPLICATION_DECISION)).required(),
        enforcementNotice: pinsYup.bool().required(),
      })
      .noUnknown(true),
    contactDetailsSection: pinsYup
      .object()
      .shape({
        isOriginalApplicant: pinsYup.bool().required(),
        contact: pinsYup
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
        appealingOnBehalfOf: pinsYup
          .object()
          .shape({
            name: pinsYup
              .string()
              .max(80)
              .matches(/^[a-z\-' ]*$/i)
              .nullable(),
            companyName: pinsYup.string().nullable(),
          })
          .noUnknown(true),
      })
      .noUnknown(true),
    appealSiteSection: pinsYup
      .object()
      .shape({
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
        siteOwnership: pinsYup
          .object()
          .shape({
            ownsSomeOfTheLand: pinsYup.bool().required(),
            ownsAllTheLand: pinsYup.bool().required(),
            knowsTheOwners: pinsYup.string().oneOf(Object.values(KNOW_THE_OWNERS)).required(),
            hasIdentifiedTheOwners: pinsYup.lazy((identifyingTheOwners) => {
              if (identifyingTheOwners) {
                return pinsYup.string().oneOf([I_AGREE]);
              }
              return pinsYup.string().nullable();
            }),
          })
          .noUnknown(true),
        agriculturalHolding: pinsYup
          .object()
          .shape({
            isAgriculturalHolding: pinsYup.bool().required(),
            isTenant: pinsYup.bool().required(),
            hasOtherTenants: pinsYup.bool().required(),
          })
          .noUnknown(true),
        visibleFromRoad: pinsYup
          .object()
          .shape({
            isVisible: pinsYup.bool().required(),
            details: pinsYup.lazy((details) => {
              return pinsYup.mixed().conditionalText({
                fieldValue: details,
                fieldName: 'details',
                targetFieldName: 'isVisible',
                emptyError: 'Tell us how visibility is restricted',
                tooLongError: 'How visibility is restricted must be $maxLength characters or less',
              });
            }),
          })
          .noUnknown(true),
        healthAndSafety: pinsYup
          .object()
          .shape({
            hasIssues: pinsYup.bool().required(),
            details: pinsYup.lazy((details) => {
              return pinsYup.mixed().conditionalText({
                fieldValue: details,
                fieldName: 'details',
                targetFieldName: 'hasIssues',
                targetFieldValue: true,
                emptyError: 'Tell us about the health and safety issues',
                tooLongError: 'Health and safety information must be $maxLength characters or less',
              });
            }),
          })
          .noUnknown(true),
      })
      .noUnknown(true),
    planningApplicationDocumentsSection: pinsYup
      .object()
      .shape({
        applicationNumber: pinsYup.string().max(30).required(),
        originalApplication: pinsYup
          .object()
          .shape({
            uploadedFile: pinsYup
              .object()
              .shape({
                id: pinsYup.string().trim().uuid().required(),
                name: pinsYup.string().trim().max(255).required(),
                fileName: pinsYup.string().trim().max(255).required(),
                originalFileName: pinsYup.string().trim().max(255).required(),
                location: pinsYup.string().trim().required(),
                size: pinsYup.number().required(),
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
                id: pinsYup.string().trim().uuid().required(),
                name: pinsYup.string().trim().max(255).required(),
                fileName: pinsYup.string().trim().max(255).required(),
                originalFileName: pinsYup.string().trim().max(255).required(),
                location: pinsYup.string().trim().required(),
                size: pinsYup.number().required(),
              })
              .noUnknown(true),
          })
          .noUnknown(true),
        designAccessStatement: pinsYup
          .object()
          .shape({
            isSubmitted: pinsYup.bool().required(),
            uploadedFile: pinsYup
              .object()
              .shape({
                id: pinsYup.string().trim().uuid().required(),
                name: pinsYup.string().trim().max(255).required(),
                fileName: pinsYup.string().trim().max(255).required(),
                originalFileName: pinsYup.string().trim().max(255).required(),
                location: pinsYup.string().trim().required(),
                size: pinsYup.number().required(),
              })
              .noUnknown(true),
          })
          .noUnknown(true),
      })
      .noUnknown(true),
    appealDocumentsSection: pinsYup
      .object()
      .shape({
        appealStatement: pinsYup
          .object()
          .shape({
            uploadedFile: pinsYup
              .object()
              .shape({
                id: pinsYup.string().trim().uuid().required(),
                name: pinsYup.string().trim().max(255).required(),
                fileName: pinsYup.string().trim().max(255).required(),
                originalFileName: pinsYup.string().trim().max(255).required(),
                location: pinsYup.string().trim().required(),
                size: pinsYup.number().required(),
              })
              .noUnknown(true),
            hasSensitiveInformation: pinsYup.bool().required(),
          })
          .noUnknown(true),
        plansDrawings: pinsYup
          .object()
          .shape({
            hasPlansDrawings: pinsYup.bool().required(),
            uploadedFile: pinsYup
              .object()
              .shape({
                id: pinsYup.string().trim().uuid().required(),
                name: pinsYup.string().trim().max(255).required(),
                fileName: pinsYup.string().trim().max(255).required(),
                originalFileName: pinsYup.string().trim().max(255).required(),
                location: pinsYup.string().trim().required(),
                size: pinsYup.number().required(),
              })
              .noUnknown(true),
          })
          .noUnknown(true),
        supportingDocuments: pinsYup
          .object()
          .shape({
            hasSupportingDocuments: pinsYup.bool().required(),
          })
          .noUnknown(true),
      })
      .noUnknown(true),
    appealSubmission: pinsYup
      .object()
      .shape({
        appealPDFStatement: pinsYup
          .object()
          .shape({
            uploadedFile: pinsYup
              .object()
              .shape({
                id: pinsYup.string().trim().uuid().required(),
                name: pinsYup.string().trim().max(255).required(),
                fileName: pinsYup.string().trim().max(255).required(),
                originalFileName: pinsYup.string().trim().max(255).required(),
                location: pinsYup.string().trim().required(),
                size: pinsYup.number().required(),
              })
              .noUnknown(true),
          })
          .noUnknown(true),
      })
      .noUnknown(true),
    sectionStates: pinsYup
      .object()
      .shape({
        contactDetailsSection: pinsYup
          .object()
          .shape({
            isOriginalApplicant: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
            contact: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
            appealingOnBehalfOf: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
          })
          .noUnknown(true),
        appealSiteSection: pinsYup
          .object()
          .shape({
            siteAddress: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
            siteOwnership: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
            agriculturalHolding: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
            visibleFromRoad: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
            healthAndSafety: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
          })
          .noUnknown(true),
        planningApplicationDocumentsSection: pinsYup
          .object()
          .shape({
            applicationNumber: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
            originalApplication: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
            decisionLetter: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
            designAccessStatement: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
          })
          .noUnknown(true),
        appealDocumentsSection: pinsYup
          .object()
          .shape({
            appealStatement: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
            plansDrawings: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
            supportingDocuments: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
          })
          .noUnknown(true),
      })
      .noUnknown(true),
  });

module.exports = update;
