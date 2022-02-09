const appeal = {
  id: 'fc7cb757-fe21-46dd-b3fd-121c385cd884',
  horizonId: 'HORIZON123',
  lpaCode: 'E69999999',
  state: 'SUBMITTED',
  appealType: '1005',
  typeOfPlanningApplication: 'full-appeal',
  decisionDate: new Date(),
  eligibility: {
    applicationCategories: 'none_of_these',
    applicationDecision: 'granted',
    enforcementNotice: false,
  },
  aboutYouSection: {
    yourDetails: {
      isOriginalApplicant: true,
      appealingOnBehalfOf: '',
      companyName: '',
    },
  },
  yourAppealSection: {
    appealStatement: {
      uploadedFile: {
        name: 'appealStatement.pdf',
        originalFileName: 'appealStatement.pdf',
        id: '87e645e4-1050-458b-93df-1bff89b5b87c',
      },
      hasSensitiveInformation: false,
    },
  },
  contactDetailsSection: {
    name: 'a name',
    email: 'testemail@example.com',
    companyName: 'Test Company',
  },
  appealSiteSection: {
    siteAddress: {
      addressLine1: 'Site Address 1',
      addressLine2: 'Site Address 2',
      town: 'Site Town',
      county: 'Site County',
      postcode: 'SW1 1AA',
    },
    ownsSomeOfTheLand: false,
    ownsAllTheLand: true,
    knowsTheOwners: 'yes',
    identifyingTheOwners: 'i-agree',
    isAgriculturalHolding: true,
    isAgriculturalHoldingTenant: true,
    areOtherTenants: true,
    isVisibleFromRoad: false,
    visibleFromRoadDetails: 'Access via the road at the side of the property',
    hasHealthSafetyIssues: true,
    healthSafetyIssuesDetails: 'The site has poor mobile reception',
  },
  appealSubmission: {
    appealPDFStatement: {
      uploadedFile: {
        name: 'Appeal-form.pdf',
        id: '01739574-e34c-4da0-8163-17e55268af7c',
        originalFileName: 'Appeal-form.pdf',
        fileName: 'Appeal-form.pdf',
        location: 'f8adeda29ecc373097a06d1cc98e4e41',
        size: 74375,
      },
    },
  },
  planningApplicationDocumentsSection: {
    applicationNumber: 'ABCDE12345',
    isDesignAccessStatementSubmitted: true,
    originalApplication: {
      uploadedFile: {
        name: 'originalApplication.pdf',
        originalFileName: 'originalApplication.pdf',
        id: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282',
      },
    },
    designAccessStatement: {
      uploadedFile: {
        name: 'designAccessStatement',
        originalFileName: 'designAccessStatement',
        id: '4325a1bb-7bae-4d31-bdeb-8147248def03',
      },
    },
    decisionLetter: {
      uploadedFile: {
        name: 'decisionLetter.pdf',
        originalFileName: 'decisionLetter.pdf',
        id: '89b73320-8165-43f9-83e8-43bc0d927140',
      },
    },
  },
};

module.exports = appeal;
