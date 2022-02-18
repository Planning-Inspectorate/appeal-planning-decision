exports.appealDocument = {
  id: null,
  horizonId: null,
  lpaCode: null,
  decisionDate: null,
  submissionDate: null,
  state: 'DRAFT',
  appealType: null,
  typeOfPlanningApplication: null,
  eligibility: {
    applicationDecision: null,
    applicationCategories: null,
    enforcementNotice: null,
    householderPlanningPermission: null,
    isClaimingCosts: null,
    isListedBuilding: null,
  },
  aboutYouSection: {
    yourDetails: {
      isOriginalApplicant: null,
      name: null,
      email: null,
      appealingOnBehalfOf: '',
      companyName: '',
    },
  },
  requiredDocumentsSection: {
    applicationNumber: '',
    originalApplication: {
      uploadedFile: {
        name: '',
        id: null,
      },
    },
    decisionLetter: {
      uploadedFile: {
        name: '',
        id: null,
      },
    },
    designAccessStatement: {
      uploadedFile: {
        name: '',
        id: null,
      },
    },
  },
  yourAppealSection: {
    appealStatement: {
      uploadedFile: {
        name: '',
        id: null,
      },
      hasSensitiveInformation: null,
    },
    otherDocuments: {
      uploadedFiles: [],
    },
  },
  appealSiteSection: {
    siteAddress: {
      addressLine1: '',
      addressLine2: '',
      town: '',
      county: '',
      postcode: '',
    },
    siteOwnership: {
      ownsWholeSite: null,
      haveOtherOwnersBeenTold: null,
    },
    siteAccess: {
      canInspectorSeeWholeSiteFromPublicRoad: null,
      howIsSiteAccessRestricted: '',
    },
    healthAndSafety: {
      hasIssues: null,
      healthAndSafetyIssues: '',
    },
    ownsSomeOfTheLand: null,
    ownsAllTheLand: null,
    knowsTheOwners: null,
    isAgriculturalHolding: null,
    isAgriculturalHoldingTenant: null,
    areOtherTenants: null,
    isVisibleFromRoad: null,
    visibleFromRoadDetails: null,
    hasHealthSafetyIssues: null,
    healthSafetyIssuesDetails: null,
    identifyingTheOwners: null,
  },
  appealSubmission: {
    appealPDFStatement: {
      uploadedFile: {
        name: '',
        id: null,
      },
    },
  },
  contactDetailsSection: {
    name: null,
    email: null,
    companyName: null,
  },
  planningApplicationDocumentsSection: {
    applicationNumber: null,
    isDesignAccessStatementSubmitted: null,
    originalApplication: {
      uploadedFile: {
        name: '',
        id: null,
      },
    },
    decisionLetter: {
      uploadedFile: {
        name: '',
        id: null,
      },
    },
    designAccessStatement: {
      uploadedFile: {
        name: '',
        id: null,
      },
    },
  },
  sectionStates: {
    aboutYouSection: {
      yourDetails: 'NOT STARTED',
    },
    requiredDocumentsSection: {
      applicationNumber: 'NOT STARTED',
      originalApplication: 'NOT STARTED',
      decisionLetter: 'NOT STARTED',
    },
    yourAppealSection: {
      appealStatement: 'NOT STARTED',
      otherDocuments: 'NOT STARTED',
    },
    appealSiteSection: {
      siteAddress: 'NOT STARTED',
      siteAccess: 'NOT STARTED',
      siteOwnership: 'NOT STARTED',
      healthAndSafety: 'NOT STARTED',
      ownsSomeOfTheLand: 'NOT STARTED',
      ownsAllTheLand: 'NOT STARTED',
      knowsTheOwners: 'NOT STARTED',
      isAgriculturalHolding: 'NOT STARTED',
      isAgriculturalHoldingTenant: 'NOT STARTED',
      areOtherTenants: 'NOT STARTED',
      isVisibleFromRoad: 'NOT STARTED',
      visibleFromRoadDetails: 'NOT STARTED',
      hasHealthSafetyIssues: 'NOT STARTED',
      healthSafetyIssuesDetails: 'NOT STARTED',
    },
    contactDetailsSection: 'NOT STARTED',
    aboutAppealSiteSection: 'NOT STARTED',
    planningApplicationDocumentsSection: {
      isDesignAccessStatementSubmitted: 'NOT STARTED',
      originalApplication: 'NOT STARTED',
      decisionLetter: 'NOT STARTED',
      designAccessStatement: 'NOT STARTED',
    },
  },
};
