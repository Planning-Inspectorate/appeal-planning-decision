const pinsYup = require('../../lib/pins-yup');
const parseDateString = require('../../utils/parse-date-string');
const {
  APPEAL_ID,
  APPEAL_STATE,
  APPLICATION_DECISION,
  APPLICATION_CATEGORIES,
  KNOW_THE_OWNERS,
  PROCEDURE_TYPE,
  SECTION_STATE,
  TYPE_OF_PLANNING_APPLICATION,
  STANDARD_TRIPLE_CONFIRM_OPTIONS,
  PLANNING_OBLIGATION_STATUS_OPTION,
} = require('../../constants');

const insert = pinsYup
  .object()
  .noUnknown(true)
  .shape({
    id: pinsYup.string().trim().uuid().required(),
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
        applicationCategories: pinsYup.lazy((applicationCategories) => {
          if (applicationCategories) {
            return pinsYup
              .array()
              .allOfSelectedOptions('applicationCategories', Object.values(APPLICATION_CATEGORIES));
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
        hasPriorApprovalForExistingHome: pinsYup.bool().nullable(),
        hasHouseholderPermissionConditions: pinsYup.bool().nullable(),
      })
      .noUnknown(true),
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
            hasIdentifiedTheOwners: pinsYup.bool().nullable(),
            tellingTheLandowners: pinsYup
              .array()
              .nullable()
              .allOfValidOptions(STANDARD_TRIPLE_CONFIRM_OPTIONS),
            advertisingYourAppeal: pinsYup
              .array()
              .nullable()
              .allOfValidOptions(STANDARD_TRIPLE_CONFIRM_OPTIONS),
          })
          .noUnknown(true),
        agriculturalHolding: pinsYup
          .object()
          .shape({
            isAgriculturalHolding: pinsYup.bool().nullable(),
            isTenant: pinsYup.bool().nullable(),
            hasOtherTenants: pinsYup.bool().nullable(),
            tellingTheTenants: pinsYup
              .array()
              .nullable()
              .allOfValidOptions(STANDARD_TRIPLE_CONFIRM_OPTIONS),
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
    appealDecisionSection: pinsYup
      .object()
      .shape({
        procedureType: pinsYup.lazy((procedureType) => {
          if (procedureType) {
            return pinsYup.string().oneOf(Object.values(PROCEDURE_TYPE));
          }
          return pinsYup.string().nullable().default(null);
        }),
        hearing: pinsYup
          .object()
          .shape({
            reason: pinsYup.string().trim().max(255).nullable(),
          })
          .noUnknown(true),
        inquiry: pinsYup
          .object()
          .shape({
            reason: pinsYup.string().trim().max(255).nullable(),
            expectedDays: pinsYup.number().integer().min(1).max(999).nullable(),
          })
          .noUnknown(true),
        draftStatementOfCommonGround: pinsYup
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
    planningApplicationDocumentsSection: pinsYup
      .object()
      .shape({
        applicationNumber: pinsYup.string().max(30).nullable(),
        ownershipCertificate: pinsYup
          .object()
          .shape({
            submittedSeparateCertificate: pinsYup.bool().nullable().default(null),
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
        proposedDevelopmentChanged: pinsYup
          .object()
          .shape({
            isProposedDevelopmentChanged: pinsYup.bool().nullable(),
            details: pinsYup.lazy((details) => {
              return pinsYup.mixed().conditionalText({
                fieldValue: details,
                fieldName: 'details',
                targetFieldName: 'proposed-development-changed',
                emptyError:
                  'Select yes if your proposed development changed after you submitted your application',
                tooLongError:
                  'How proposed development changed must be $maxLength characters or less',
              });
            }),
          })
          .noUnknown(true),
        plansDrawingsSupportingDocuments: pinsYup
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
              .ensure(),
          })
          .noUnknown(true),
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
        originalDecisionNotice: pinsYup
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
          letterConfirmingApplication: pinsYup
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

        planningObligations: pinsYup.object().shape({
          plansPlanningObligation: pinsYup.bool().nullable().default(null),
          planningObligationStatus: pinsYup.lazy((planningObligationStatus) => {
            if (planningObligationStatus) {
              return pinsYup.string().oneOf(Object.values(PLANNING_OBLIGATION_STATUS_OPTION));
            }
            return pinsYup.string().nullable();
          }),
        }),
        draftPlanningObligations: pinsYup.object().shape({
          plansPlanningObligation: pinsYup.bool().nullable().default(null),
          planningObligationStatus: pinsYup.lazy((planningObligationStatus) => {
            if (planningObligationStatus) {
              return pinsYup.string().oneOf(Object.values(PLANNING_OBLIGATION_STATUS_OPTION));
            }
            return pinsYup.string().nullable();
          }),
        }),

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
            ownsAllTheLand: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            agriculturalHolding: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            areYouATenant: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            tellingTheTenants: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            otherTenants: pinsYup
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
            someOfTheLand: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            knowTheOwners: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            identifyingTheLandOwners: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            advertisingYourAppeal: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            tellingTheLandowners: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
          })
          .noUnknown(true),
        appealDecisionSection: pinsYup
          .object()
          .shape({
            procedureType: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            hearing: pinsYup.string().oneOf(Object.values(SECTION_STATE)).default('NOT STARTED'),
            inquiry: pinsYup.string().oneOf(Object.values(SECTION_STATE)).default('NOT STARTED'),
            inquiryExpectedDays: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            draftStatementOfCommonGround: pinsYup
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
            ownershipCertificate: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            proposedDevelopmentChanged: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            plansDrawingsSupportingDocuments: pinsYup
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
            designAccessStatementSubmitted: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            originalDecisionNotice: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            letterConfirmingApplication: pinsYup
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
            newPlansDrawings: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            plansPlanningObligation: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            planningObligationStatus: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            planningObligationDocuments: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            draftPlanningObligations: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            supportingDocuments: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
            newSupportingDocuments: pinsYup
              .string()
              .oneOf(Object.values(SECTION_STATE))
              .default('NOT STARTED'),
          })
          .noUnknown(true),
      })
      .noUnknown(true),
  });

module.exports = insert;
