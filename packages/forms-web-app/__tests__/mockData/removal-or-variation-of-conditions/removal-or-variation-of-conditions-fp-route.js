const appeal = {
  sectionStates: {
    appealDocumentsSection: {
      newSupportingDocuments: 'NOT STARTED',

      supportingDocuments: 'NOT STARTED',

      newPlansDrawings: 'NOT STARTED',

      plansDrawings: 'NOT STARTED',

      appealStatement: 'NOT STARTED',
    },

    planningApplicationDocumentsSection: {
      designAccessStatementSubmitted: 'NOT STARTED',

      designAccessStatement: 'NOT STARTED',

      decisionLetter: 'NOT STARTED',

      originalApplication: 'NOT STARTED',

      plansDrawingsSupportingDocuments: 'NOT STARTED',

      applicationNumber: 'NOT STARTED',
    },

    appealDecisionSection: {
      draftStatementOfCommonGround: 'NOT STARTED',

      inquiryExpectedDays: 'NOT STARTED',

      inquiry: 'NOT STARTED',

      hearing: 'NOT STARTED',

      procedureType: 'NOT STARTED',
    },

    appealSiteSection: {
      tellingTheLandowners: 'NOT STARTED',

      advertisingYourAppeal: 'NOT STARTED',

      identifyingTheLandOwners: 'NOT STARTED',

      knowTheOwners: 'NOT STARTED',

      someOfTheLand: 'NOT STARTED',

      healthAndSafety: 'NOT STARTED',

      visibleFromRoad: 'NOT STARTED',

      otherTenants: 'NOT STARTED',

      tellingTheTenants: 'NOT STARTED',

      areYouATenant: 'NOT STARTED',

      agriculturalHolding: 'NOT STARTED',

      ownsAllTheLand: 'NOT STARTED',

      siteAddress: 'NOT STARTED',
    },

    contactDetailsSection: {
      appealingOnBehalfOf: 'NOT STARTED',

      contact: 'NOT STARTED',

      isOriginalApplicant: 'NOT STARTED',
    },
  },

  appealSubmission: {
    appealPDFStatement: {
      uploadedFile: {
        size: null,

        location: null,

        originalFileName: '',

        fileName: '',

        name: '',

        id: null,
      },
    },
  },

  appealDocumentsSection: {
    supportingDocuments: {
      uploadedFiles: [],

      hasSupportingDocuments: null,
    },

    plansDrawings: {
      uploadedFiles: [],

      hasPlansDrawings: null,
    },

    appealStatement: {
      hasSensitiveInformation: null,

      uploadedFile: {
        size: null,

        location: null,

        originalFileName: '',

        fileName: '',

        name: '',

        id: null,
      },
    },
  },

  planningApplicationDocumentsSection: {
    designAccessStatement: {
      uploadedFile: {
        size: null,

        location: null,

        originalFileName: '',

        fileName: '',

        name: '',

        id: null,
      },

      isSubmitted: null,
    },

    decisionLetter: {
      uploadedFile: {
        size: null,

        location: null,

        originalFileName: '',

        fileName: '',

        name: '',

        id: null,
      },
    },

    originalApplication: {
      uploadedFile: {
        size: null,

        location: null,

        originalFileName: '',

        fileName: '',

        name: '',

        id: null,
      },
    },

    plansDrawingsSupportingDocuments: {
      uploadedFiles: [],
    },

    applicationNumber: null,
  },

  appealDecisionSection: {
    draftStatementOfCommonGround: {
      uploadedFile: {
        size: null,

        location: null,

        originalFileName: '',

        fileName: '',

        name: '',

        id: null,
      },
    },

    inquiry: {
      expectedDays: null,

      reason: null,
    },

    hearing: {
      reason: null,
    },

    procedureType: null,
  },

  appealSiteSection: {
    healthAndSafety: {
      details: null,

      hasIssues: null,
    },

    visibleFromRoad: {
      details: null,

      isVisible: null,
    },

    agriculturalHolding: {
      tellingTheTenants: null,

      hasOtherTenants: null,

      isTenant: null,

      isAgriculturalHolding: null,
    },

    siteOwnership: {
      advertisingYourAppeal: null,

      tellingTheLandowners: null,

      hasIdentifiedTheOwners: null,

      knowsTheOwners: null,

      ownsAllTheLand: null,

      ownsSomeOfTheLand: null,
    },

    siteAddress: {
      postcode: null,

      county: null,

      town: null,

      addressLine2: null,

      addressLine1: null,
    },
  },

  contactDetailsSection: {
    appealingOnBehalfOf: {
      companyName: null,

      name: null,
    },

    contact: {
      email: null,

      companyName: null,

      name: null,
    },

    isOriginalApplicant: null,
  },

  eligibility: {
    hasHouseholderPermissionConditions: false,

    hasPriorApprovalForExistingHome: null,

    enforcementNotice: null,

    applicationDecision: 'refused',

    applicationCategories: ['none_of_these'],
  },

  typeOfPlanningApplication: 'removal-or-variation-of-conditions',

  appealType: '1005',

  state: 'DRAFT',

  updatedAt: '2022-05-11T17:19:58.023Z',

  createdAt: '2022-05-11T17:19:37.227Z',

  decisionDate: '2022-02-20T00:00:00.000Z',

  lpaCode: 'E60000068',

  id: 'c9413b2d-e3ac-4544-a700-bfc6078475e0',
};

module.exports = appeal;
