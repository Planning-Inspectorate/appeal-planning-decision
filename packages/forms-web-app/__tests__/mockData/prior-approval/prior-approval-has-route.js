const appeal = {
  sectionStates: {
    appealSiteSection: {
      healthAndSafety: 'NOT STARTED',

      siteOwnership: 'NOT STARTED',

      siteAccess: 'NOT STARTED',

      siteAddress: 'NOT STARTED',
    },

    yourAppealSection: {
      otherDocuments: 'NOT STARTED',

      appealStatement: 'NOT STARTED',
    },

    requiredDocumentsSection: {
      decisionLetter: 'NOT STARTED',

      originalApplication: 'NOT STARTED',

      applicationNumber: 'NOT STARTED',
    },

    aboutYouSection: {
      yourDetails: 'NOT STARTED',
    },

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

    contactDetailsSection: {
      appealingOnBehalfOf: 'NOT STARTED',

      contact: 'NOT STARTED',

      isOriginalApplicant: 'NOT STARTED',
    },
  },

  appealSiteSection: {
    healthAndSafety: {
      healthAndSafetyIssues: '',

      hasIssues: null,
    },

    siteAccess: {
      howIsSiteAccessRestricted: null,

      canInspectorSeeWholeSiteFromPublicRoad: null,
    },

    siteOwnership: {},

    siteAddress: {
      postcode: null,

      county: null,

      town: null,

      addressLine2: null,

      addressLine1: null,
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

  yourAppealSection: {
    otherDocuments: {
      uploadedFiles: [],
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

  requiredDocumentsSection: {
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

    applicationNumber: null,
  },

  aboutYouSection: {
    yourDetails: {
      appealingOnBehalfOf: null,

      email: null,

      name: null,

      isOriginalApplicant: null,
    },
  },

  eligibility: {
    hasHouseholderPermissionConditions: null,

    hasPriorApprovalForExistingHome: true,

    enforcementNotice: false,

    applicationDecision: 'refused',

    isListedBuilding: false,
  },

  typeOfPlanningApplication: 'prior-approval',

  appealType: '1001',

  state: 'DRAFT',

  updatedAt: '2022-05-11T16:52:03.466Z',

  createdAt: '2022-05-11T16:49:51.636Z',

  decisionDate: '2022-02-20T00:00:00.000Z',

  lpaCode: 'E60000068',

  id: '431ef050-68b6-450e-8e90-72eea26f93f7',
};

module.exports = appeal;
