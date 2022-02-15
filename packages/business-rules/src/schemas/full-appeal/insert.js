const pinsYup = require('../../lib/pins-yup');
const parseDateString = require('../../utils/parse-date-string');
const {
  APPEAL_ID,
  APPEAL_STATE,
  APPLICATION_DECISION,
  APPLICATION_CATEGORIES,
  I_AGREE,
  KNOW_THE_OWNERS,
  SECTION_STATE,
  TYPE_OF_PLANNING_APPLICATION,
  STANDARD_TRIPLE_CONFIRM_OPTIONS,
} = require('../../constants');

const insert = pinsYup
  .object()
  .noUnknown(true)
  .shape({
    id: pinsYup.string().trim().uuid().required(),
    horizonId: pinsYup.string().trim().max(20).nullable(),
    lpaCode: pinsYup.string().trim().max(20).nullable(),
    decisionDate: pinsYup.date().transform(parseDateString).nullable(),
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
    eligibility: pinsYup.object().shape({
      applicationCategories: pinsYup.lazy((applicationCategories) => {
        if (applicationCategories) {
          if (typeof applicationCategories === 'string') {
            return pinsYup.string().oneOf(Object.values(APPLICATION_CATEGORIES));
          }
          return pinsYup.object().oneOf(Object.values(APPLICATION_CATEGORIES));
        }
        return pinsYup.object().nullable();
      }),
      applicationDecision: pinsYup.lazy((applicationDecision) => {
        if (applicationDecision) {
          return pinsYup.string().oneOf(Object.values(APPLICATION_DECISION));
        }
        return pinsYup.string().nullable();
      }),
      enforcementNotice: pinsYup.bool().nullable(),
    }),
    contactDetailsSection: pinsYup
      .object()
      .shape({
        isOriginalApplicant: pinsYup.bool().nullable(),
        contact: pinsYup
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
            ownsSomeOfTheLand: pinsYup.bool().nullable(),
            ownsAllTheLand: pinsYup.bool().nullable(),
            knowsTheOwners: pinsYup.lazy((knowsTheOwners) => {
              if (knowsTheOwners) {
                return pinsYup.string().oneOf(Object.values(KNOW_THE_OWNERS));
              }
              return pinsYup.string().nullable();
            }),
            hasIdentifiedTheOwners: pinsYup.lazy((identifyingTheOwners) => {
              if (identifyingTheOwners) {
                return pinsYup.string().oneOf([I_AGREE]);
              }
              return pinsYup.string().nullable();
            }),
            tellingTheLandowners: pinsYup.array().nullable().allOf(STANDARD_TRIPLE_CONFIRM_OPTIONS),
            tellingTheTenants: pinsYup.array().nullable().allOf(STANDARD_TRIPLE_CONFIRM_OPTIONS),
          })
          .noUnknown(true),
        agriculturalHolding: pinsYup
          .object()
          .shape({
            isAgriculturalHolding: pinsYup.bool().nullable(),
            isTenant: pinsYup.bool().nullable(),
            hasOtherTenants: pinsYup.bool().nullable(),
          })
          .noUnknown(true),
        visibleFromRoad: pinsYup
          .object()
          .shape({
            isVisible: pinsYup.bool().nullable(),
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
            hasIssues: pinsYup.bool().nullable(),
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
        designAccessStatement: pinsYup
          .object()
          .shape({
            isSubmitted: pinsYup.bool().nullable(),
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
    appealDocumentsSection: pinsYup
      .object()
      .shape({
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
        plansDrawings: pinsYup
          .object()
          .shape({
            hasPlansDrawings: pinsYup.bool().nullable().default(null),
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
              .ensure(),
          })
          .noUnknown(true),
        supportingDocuments: pinsYup
          .object()
          .shape({
            hasSupportingDocuments: pinsYup.bool().nullable().default(null),
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
              .ensure(),
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
    sectionStates: pinsYup
      .object()
      .shape({
        contactDetailsSection: pinsYup
          .object()
          .shape({
            isOriginalApplicant: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            contact: pinsYup.string().oneOf(Object.values(SECTION_STATE)).default('NOT STARTED'),
            appealingOnBehalfOf: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
          })
          .noUnknown(true),
        appealSiteSection: pinsYup
          .object()
          .shape({
            siteAddress: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            siteOwnership: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            agriculturalHolding: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            visibleFromRoad: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            healthAndSafety: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
          })
          .noUnknown(true),
        planningApplicationDocumentsSection: pinsYup
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
            designAccessStatement: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
          })
          .noUnknown(true),
        appealDocumentsSection: pinsYup
          .object()
          .shape({
            appealStatement: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            plansDrawings: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            supportingDocuments: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
          })
          .noUnknown(true),
      })
      .noUnknown(true),
  });

module.exports = insert;
