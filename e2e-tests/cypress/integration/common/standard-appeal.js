const { dateForXDaysAgo } = require('./date-for-x-days-ago');

const matchWhatWeCanFrom = (hardCodedExpectations) => {
  return {
    ...hardCodedExpectations,
    _id: expect.any(String),
    uuid: expect.any(String),
    appeal: {
      ...hardCodedExpectations.appeal,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      id: expect.any(String),
      submissionDate: expect.any(String),
      decisionDate: expect.any(String),
      yourAppealSection: {
        ...hardCodedExpectations.appeal.yourAppealSection,
        appealStatement: {
          ...hardCodedExpectations.appeal.yourAppealSection.appealStatement,
          uploadedFile: {
            ...hardCodedExpectations.appeal.yourAppealSection.appealStatement.uploadedFile,
            id: expect.any(String),
            location: expect.any(String),
          },
        },
        otherDocuments: {
          ...hardCodedExpectations.appeal.yourAppealSection.otherDocuments,
          uploadedFiles: [...hardCodedExpectations.appeal.yourAppealSection.otherDocuments.uploadedFiles.map( (hardcodedFile ) => {
            return {
              ...hardcodedFile,
              id: expect.any(String),
              location: expect.any(String),
            }
          })],
        },
      },
      requiredDocumentsSection: {
        ...hardCodedExpectations.appeal.requiredDocumentsSection,
        originalApplication: {
          ...hardCodedExpectations.appeal.requiredDocumentsSection.originalApplication,
          uploadedFile: {
            ...hardCodedExpectations.appeal.requiredDocumentsSection.originalApplication
              .uploadedFile,
            id: expect.any(String),
            location: expect.any(String),
          },
        },
        decisionLetter: {
          ...hardCodedExpectations.appeal.requiredDocumentsSection.decisionLetter,
          uploadedFile: {
            ...hardCodedExpectations.appeal.requiredDocumentsSection.decisionLetter.uploadedFile,
            id: expect.any(String),
            location: expect.any(String),
          },
        },
      },
      appealSubmission: {
        appealPDFStatement: {
          uploadedFile: {
            id: expect.any(String),
            name: "Appeal-form.pdf",
            location: expect.any(String),
            size: expect.any(Number),
          },
        },
      },
    },
  };
};

const STANDARD_APPEAL = {
  decisionDate: dateForXDaysAgo(30),
  eligibility: {
    householderPlanningPermission: true,
    eligibleLocalPlanningDepartment: true,
    isClaimingCosts: false,
    isListedBuilding: true,
  },
  aboutYouSection: {
    yourDetails: {
      isOriginalApplicant: true,
      name: 'Valid Name',
      email: 'valid@email.com',
      appealingOnBehalfOf: null,
    },
  },
  requiredDocumentsSection: {
    applicationNumber: 'ValidNumber/12345',
    originalApplication: {
      uploadedFile: {
        name: 'appeal-statement-valid.doc',
      },
    },
    decisionLetter: {
      uploadedFile: {
        name: 'appeal-statement-valid.doc',
      },
    },
  },
  yourAppealSection: {
    appealStatement: {
      uploadedFile: {
        name: 'appeal-statement-valid.doc',
      },
      hasSensitiveInformation: null,
    },
    otherDocuments: {
      uploadedFiles: [],
    },
  },
  appealSiteSection: {
    siteAddress: {
      addressLine1: '1 Taylor Road',
      addressLine2: 'Clifton',
      town: 'Bristol',
      county: 'South Glos',
      postcode: 'BS8 1TG',
    },
    siteOwnership: {
      ownsWholeSite: true,
      haveOtherOwnersBeenTold: null,
    },
    siteAccess: {
      canInspectorSeeWholeSiteFromPublicRoad: true,
      howIsSiteAccessRestricted: '',
    },
    healthAndSafety: {
      hasIssues: false,
      healthAndSafetyIssues: '',
    },
  },
};

module.exports = {
  matchWhatWeCanFrom,
  STANDARD_APPEAL,
};
