module.exports = {
  sectionStates: {
    aboutYouSection: {
      yourDetails: 'COMPLETED',
    },
    requiredDocumentsSection: {
      applicationNumber: 'COMPLETED',
      originalApplication: 'NOT STARTED',
      decisionLetter: 'NOT STARTED',
    },
    yourAppealSection: {
      appealStatement: 'NOT STARTED',
      otherDocuments: 'NOT STARTED',
      otherAppeals: 'NOT STARTED',
    },
    appealSiteSection: {
      siteAccess: 'COMPLETED',
      siteOwnership: 'COMPLETED',
      healthAndSafety: 'COMPLETED',
      siteAddress: 'COMPLETED',
    },
  },
  appealSiteSection: {
    healthAndSafety: {
      hasIssues: false,
      healthAndSafetyIssues: '',
    },
    siteAccess: {
      howIsSiteAccessRestricted: '',
      canInspectorSeeWholeSiteFromPublicRoad: true,
    },
    siteOwnership: {
      ownsWholeSite: true,
      haveOtherOwnersBeenTold: null,
    },
    siteAddress: {
      addressLine1: '999 Letsby Avenue',
      addressLine2: '',
      town: 'Sheffield',
      county: 'South Yorkshire',
      postcode: 'S9 1XY',
    },
  },
  yourAppealSection: {
    appealStatement: {
      uploadedFile: {
        id: 'e4cb9e13-90ad-4c1e-b339-fb0803c2b064',
        name: 'Birthday-Quiz.pdf',
        location: 'e8e8124217d256a7cb03a6410f9f3d10',
        size: 429927,
      },
      hasSensitiveInformation: false,
    },
    otherDocuments: {
      uploadedFiles: [],
    },
    otherAppeals: {
      hasOtherAppeal: null,
      otherAppealRefNumber: '',
    },
  },
  requiredDocumentsSection: {
    applicationNumber: 'ABC/123',
    originalApplication: {
      uploadedFile: {
        id: '61024954-2dd7-41c2-95ea-0fc2e35fa9bb',
        name: 'attinghamparkbees.jpg',
        location: '0d6f62cf1fa8d0797060e5eb6b8dad8f',
        size: 189549,
      },
    },
    decisionLetter: {
      uploadedFile: {
        id: '59c55221-ddaa-4ef8-ba48-c2570b3418e8',
        name: 'attinghamparkbees.jpg',
        location: '36d62a0dcb32c3648c8b0f023383464f',
        size: 189549,
      },
    },
  },
  submission: {
    pdfStatement: {
      uploadedFile: null,
    },
  },
  aboutYouSection: {
    yourDetails: {
      appealingOnBehalfOf: '',
      email: 'bob@smith.com',
      name: 'Bob Smith',
      isOriginalApplicant: true,
    },
  },
  state: 'DRAFT',
  decisionDate: null,
  lpaCode: 'E69999999',
  id: '89aa8504-773c-42be-bb68-029716ad9756',
};
