const {dateForXDaysAgo} = require('./date-for-x-days-ago');

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
          uploadedFiles: [
            ...hardCodedExpectations.appeal.yourAppealSection.otherDocuments.uploadedFiles.map(
              (hardcodedFile) => {
                return {
                  ...hardcodedFile,
                  id: expect.any(String),
                  location: expect.any(String),
                };
              },
            ),
          ],
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
            name: 'Appeal-form.pdf',
            fileName: 'Appeal-form.pdf',
            originalFileName: 'Appeal-form.pdf',
            location: expect.any(String),
            size: expect.any(String),
          },
        },
      },
    },
  };
};

const STANDARD_APPEAL = {
  decisionDate: dateForXDaysAgo(30),
  eligibility: {
    hasHouseholderPermissionConditions: null,
    hasPriorApprovalForExistingHome: null,
    isListedBuilding: false,
    isClaimingCosts: false,
    householderPlanningPermission: true,
    enforcementNotice: false,
    applicationDecision: 'refused'
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
        size: 12956,
        location: '03d8f6ed-d7ec-4d4e-a486-21de614e1843/eca0218b-c6bf-43bc-8e99-6353b549de29/appeal-statement-valid.pdf',
        originalFileName: 'appeal-statement-valid.pdf',
        fileName: 'appeal-statement-valid.pdf',
        name: 'appeal-statement-valid.pdf',
        id: 'eca0218b-c6bf-43bc-8e99-6353b549de29'
      },
    },
    decisionLetter: {
      uploadedFile: {
        size: 9144,
        location: '3d8f6ed-d7ec-4d4e-a486-21de614e1843/ee5c5845-e547-4979-a277-52c745ff692d/mock-decision-letter.pdf',
        originalFileName: 'mock-decision-letter.pdf',
        fileName: 'mock-decision-letter.pdf',
        name: 'mock-decision-letter.pdf',
        id: 'ee5c5845-e547-4979-a277-52c745ff692d'
      },
    },
  },
  yourAppealSection: {
    appealStatement: {
      uploadedFile: {
        size: 11978,
        location: '03d8f6ed-d7ec-4d4e-a486-21de614e1843/3489fcbe-c163-4908-8c71-1892d1aa9e2a/appeal-statement-valid.docx',
        originalFileName: 'appeal-statement-valid.docx',
        fileName: 'appeal-statement-valid.docx',
        name: 'appeal-statement-valid.docx',
        id: 'cf5531db-aab8-48c8-acb5-f5875b108e39'
      },
      hasSensitiveInformation: false,
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


const STANDARD_AGENT_APPEAL = {
  ...STANDARD_APPEAL,
  aboutYouSection: {
    yourDetails: {
      isOriginalApplicant: false,
      name: 'Agent Name',
      email: 'valid@email.com',
      appealingOnBehalfOf: 'Valid Name',
    },
  },
};

const APPEAL_NOT_OWNER_OTHERS_NOT_INFORMED = {
  decisionDate: dateForXDaysAgo(30),
  eligibility: {
    hasHouseholderPermissionConditions: null,
    hasPriorApprovalForExistingHome: null,
    isListedBuilding: false,
    isClaimingCosts: false,
    householderPlanningPermission: true,
    enforcementNotice: false,
    applicationDecision: 'refused'
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
        size: 12956,
        location: '03d8f6ed-d7ec-4d4e-a486-21de614e1843/eca0218b-c6bf-43bc-8e99-6353b549de29/appeal-statement-valid.pdf',
        originalFileName: 'appeal-statement-valid.pdf',
        fileName: 'appeal-statement-valid.pdf',
        name: 'appeal-statement-valid.pdf',
        id: 'eca0218b-c6bf-43bc-8e99-6353b549de29'
      },
    },
    decisionLetter: {
      uploadedFile: {
        size: 9144,
        location: '3d8f6ed-d7ec-4d4e-a486-21de614e1843/ee5c5845-e547-4979-a277-52c745ff692d/mock-decision-letter.pdf',
        originalFileName: 'mock-decision-letter.pdf',
        fileName: 'mock-decision-letter.pdf',
        name: 'mock-decision-letter.pdf',
        id: 'ee5c5845-e547-4979-a277-52c745ff692d'
      },
    },
  },
  yourAppealSection: {
    appealStatement: {
      uploadedFile: {
        size: 11978,
        location: '03d8f6ed-d7ec-4d4e-a486-21de614e1843/3489fcbe-c163-4908-8c71-1892d1aa9e2a/appeal-statement-valid.docx',
        originalFileName: 'appeal-statement-valid.docx',
        fileName: 'appeal-statement-valid.docx',
        name: 'appeal-statement-valid.docx',
        id: 'cf5531db-aab8-48c8-acb5-f5875b108e39'
      },
      hasSensitiveInformation: false,
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
      ownsWholeSite: false,
      haveOtherOwnersBeenTold: false,
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

const APPEAL_NOT_OWNER_OTHERS_INFORMED = {
  decisionDate: dateForXDaysAgo(30),
  eligibility: {
    hasHouseholderPermissionConditions: null,
    hasPriorApprovalForExistingHome: null,
    isListedBuilding: false,
    isClaimingCosts: false,
    householderPlanningPermission: true,
    enforcementNotice: false,
    applicationDecision: 'refused'
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
        size: 12956,
        location: '03d8f6ed-d7ec-4d4e-a486-21de614e1843/eca0218b-c6bf-43bc-8e99-6353b549de29/appeal-statement-valid.pdf',
        originalFileName: 'appeal-statement-valid.pdf',
        fileName: 'appeal-statement-valid.pdf',
        name: 'appeal-statement-valid.pdf',
        id: 'eca0218b-c6bf-43bc-8e99-6353b549de29'
      },
    },
    decisionLetter: {
      uploadedFile: {
        size: 9144,
        location: '3d8f6ed-d7ec-4d4e-a486-21de614e1843/ee5c5845-e547-4979-a277-52c745ff692d/mock-decision-letter.pdf',
        originalFileName: 'mock-decision-letter.pdf',
        fileName: 'mock-decision-letter.pdf',
        name: 'mock-decision-letter.pdf',
        id: 'ee5c5845-e547-4979-a277-52c745ff692d'
      },
    },
  },
  yourAppealSection: {
    appealStatement: {
      uploadedFile: {
        size: 11978,
        location: '03d8f6ed-d7ec-4d4e-a486-21de614e1843/3489fcbe-c163-4908-8c71-1892d1aa9e2a/appeal-statement-valid.docx',
        originalFileName: 'appeal-statement-valid.docx',
        fileName: 'appeal-statement-valid.docx',
        name: 'appeal-statement-valid.docx',
        id: 'cf5531db-aab8-48c8-acb5-f5875b108e39'
      },
      hasSensitiveInformation: false,
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
      ownsWholeSite: false,
      haveOtherOwnersBeenTold: true,
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
  STANDARD_AGENT_APPEAL,
  APPEAL_NOT_OWNER_OTHERS_INFORMED,
  APPEAL_NOT_OWNER_OTHERS_NOT_INFORMED,
};
