import { STANDARD_APPEAL } from '../../../integration/common/standard-appeal';

module.exports = {
  ...STANDARD_APPEAL,
  aboutYouSection: {
    yourDetails: {
      isOriginalApplicant: false,
      name: 'Valid Agent Name',
      email: 'valid@email.com',
      appealingOnBehalfOf: 'Original Applicant',
    },
  },
  requiredDocumentsSection: {
    applicationNumber: 'doc-test/321',
    originalApplication: {
      uploadedFile: {
        name: 'mock-planning-application-form.pdf',
      },
    },
    decisionLetter: {
      uploadedFile: {
        name: 'mock-decision-letter.pdf',
      },
    },
  },
  yourAppealSection: {
    appealStatement: {
      uploadedFile: {
        name: 'mock-appeal-statement.pdf',
      },
      hasSensitiveInformation: false,
    },
    otherDocuments: {
      uploadedFiles: [
        { name: 'mock-additional-document-1.pdf' },
        { name: 'mock-additional-document-2.jpeg' },
      ],
    },
  },
};
