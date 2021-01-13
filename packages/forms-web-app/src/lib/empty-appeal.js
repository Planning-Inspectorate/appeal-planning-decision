module.exports.APPEAL_DOCUMENT = {
  empty: {
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
      otherAppeals: {},
    },
    appealSiteSection: {
      siteAddress: {
        addressLine1: null,
        addressLine2: null,
        town: null,
        county: null,
        postcode: null,
      },
      siteOwnership: {
        ownsWholeSite: null,
        haveOtherOwnersBeenTold: null,
      },
      siteAccess: {
        canInspectorSeeWholeSiteFromPublicRoad: null,
        howIsSiteAccessRestricted: null,
      },
      healthAndSafety: {
        hasIssues: null,
        healthAndSafetyIssues: null,
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
        otherAppeals: 'NOT STARTED',
      },
      appealSiteSection: {
        siteAccess: 'NOT STARTED',
        siteOwnership: 'NOT STARTED',
        healthAndSafety: 'NOT STARTED',
      },
    },
  },
};
