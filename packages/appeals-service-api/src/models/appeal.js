const appealDocument = {
  id: null,
  lpaCode: null,
  decisionDate: null,
  state: 'DRAFT',
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
      siteAccess: 'NOT STARTED',
      siteOwnership: 'NOT STARTED',
      healthAndSafety: 'NOT STARTED',
    },
  },
  eligibility: {
    enforcementNotice: null,
    householderPlanningPermission: null,
    isClaimingCosts: null,
  },
};

module.exports = {
  appealDocument,
};
