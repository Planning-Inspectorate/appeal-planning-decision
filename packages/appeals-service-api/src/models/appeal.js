exports.appealDocument = {
  id: null,
  horizonId: null,
  lpaCode: null,
  decisionDate: null,
  submissionDate: null,
  state: 'DRAFT',
  appealType: '1001',
  eligibility: {
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
    },
    contactDetailsSection: 'NOT STARTED',
    aboutAppealSiteSection: 'NOT STARTED',
    planningApplicationDocumentsSection: 'NOT STARTED',
    appealDocumentsSection: 'NOT STARTED',
  },
};
