import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import moment from 'moment';
import { matchWhatWeCanFrom, STANDARD_APPEAL } from './standard-appeal';
import appealsServiceApiConfig from '../../../../packages/appeals-service-api/src/lib/config';

const queueValidationEnabled = Cypress.env('QUEUE_VALIDATION_ENABLED');
const notifyValidationEnabled = Cypress.env('NOTIFY_VALIDATION_ENABLED');
const notifyValidationBaseUrl =
  Cypress.env('NOTIFY_VALIDATION_PROTOCOL') +
  '://' +
  Cypress.env('NOTIFY_VALIDATION_HOST') +
  ':' +
  Cypress.env('NOTIFY_VALIDATION_PORT') +
  '/';

Given('a prospective appellant has provided appeal information', () => {
  cy.provideCompleteAppeal({
    ...STANDARD_APPEAL,
    aboutYouSection: {
      yourDetails: {
        isOriginalApplicant: true,
        name: 'Appellant Name',
        email: 'valid@email.com',
        appealingOnBehalfOf: null,
      },
    },
  });
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
});

Given('an agent has provided appeal information', () => {
  cy.provideCompleteAppeal({
    ...STANDARD_APPEAL,
    aboutYouSection: {
      yourDetails: {
        isOriginalApplicant: false,
        name: 'Agent Name',
        email: 'valid@email.com',
        appealingOnBehalfOf: 'Appellant Name',
      },
    },
  });
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
});

Given(
  'a prospective appellant has provided appeal information where the whole site can be seen',
  () => {
    cy.provideCompleteAppeal({
      ...STANDARD_APPEAL,
      appealSiteSection: {
        ...STANDARD_APPEAL.appealSiteSection,
        siteAccess: {
          howIsSiteAccessRestricted: '',
          canInspectorSeeWholeSiteFromPublicRoad: true,
        },
      },
    });
    cy.clickCheckYourAnswers();
    cy.clickSaveAndContinue();
  },
);

Given(
  'a prospective appellant has provided appeal information where the whole site cannot be seen',
  () => {
    cy.provideCompleteAppeal({
      ...STANDARD_APPEAL,
      appealSiteSection: {
        ...STANDARD_APPEAL.appealSiteSection,
        siteAccess: {
          howIsSiteAccessRestricted: 'Restricted access',
          canInspectorSeeWholeSiteFromPublicRoad: false,
        },
      },
    });
    cy.clickCheckYourAnswers();
    cy.clickSaveAndContinue();
  },
);

Given(
  'a prospective appellant has provided appeal information where they own the whole site',
  () => {
    cy.provideCompleteAppeal({
      ...STANDARD_APPEAL,
      appealSiteSection: {
        ...STANDARD_APPEAL.appealSiteSection,
        siteOwnership: {
          haveOtherOwnersBeenTold: null,
          ownsWholeSite: true,
        },
      },
    });
    cy.clickCheckYourAnswers();
    cy.clickSaveAndContinue();
  },
);

Given(
  'a prospective appellant has provided appeal information where they do not own the whole site while confirming owner has been informed',
  () => {
    cy.provideCompleteAppeal({
      ...STANDARD_APPEAL,
      appealSiteSection: {
        ...STANDARD_APPEAL.appealSiteSection,
        siteOwnership: {
          haveOtherOwnersBeenTold: true,
          ownsWholeSite: false,
        },
      },
    });
    cy.clickCheckYourAnswers();
    cy.clickSaveAndContinue();
  },
);

Given(
  'a prospective appellant has provided appeal information where they do not own the whole site while confirming owner has not been informed',
  () => {
    cy.provideCompleteAppeal({
      ...STANDARD_APPEAL,
      appealSiteSection: {
        ...STANDARD_APPEAL.appealSiteSection,
        siteOwnership: {
          haveOtherOwnersBeenTold: false,
          ownsWholeSite: false,
        },
      },
    });
    cy.clickCheckYourAnswers();
    cy.clickSaveAndContinue();
  },
);

Given('documents have been provided as part of an appeal', () => {
  cy.provideCompleteAppeal({
    ...STANDARD_APPEAL,
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
  });
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
});

Given('an appellant has prepared an appeal', () => {
  cy.provideCompleteAppeal({
    ...STANDARD_APPEAL,
    aboutYouSection: {
      yourDetails: {
        isOriginalApplicant: true,
        name: 'Valid Appellant Name',
        email: 'valid@email.com',
        appealingOnBehalfOf: null,
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
  });
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
});

Given('an agent has prepared an appeal', () => {
  cy.provideCompleteAppeal({
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
  });
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
});

When('the appeal is submitted', () => {
  cy.confirmNavigationTermsAndConditionsPage();
  cy.task('listenToQueue');
  cy.agreeToTheDeclaration();
  cy.confirmAppealSubmitted();
});

Then('a case is created for the appellant', () => {
  if (queueValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      const expected = require('../../fixtures/ucd-831-ac1.json');
      const reasonableExpectation = matchWhatWeCanFrom(expected);

      expect(actualMessage).toEqual(reasonableExpectation);
    });
  }
});

Then('a case is created for the appellant and the agent', () => {
  if (queueValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      const expected = require('../../fixtures/as-102-ac1.json');
      const reasonableExpectation = matchWhatWeCanFrom(expected);
      expect(actualMessage).toEqual(reasonableExpectation);
    });
  }
});

Then('a case is created for a case officer where an inspector does not require site access', () => {
  if (queueValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      const expected = require('../../fixtures/expected-appeal-where-an-inspector-does-not-require-site-access.json');
      const reasonableExpectation = matchWhatWeCanFrom(expected);
      expect(actualMessage).toEqual(reasonableExpectation);
    });
  }
});

Then('a case is created for a case officer where an inspector requires site access', () => {
  if (queueValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      const expected = require('../../fixtures/expected-appeal-where-an-inspector-does-require-site-access.json');
      const reasonableExpectation = matchWhatWeCanFrom(expected);
      expect(actualMessage).toEqual(reasonableExpectation);
    });
  }
});

Then('a case is created for a case officer with Certificate A', () => {
  if (queueValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      const expected = require('../../fixtures/expected-appeal-with-certificate-a.json');
      const reasonableExpectation = matchWhatWeCanFrom(expected);
      expect(actualMessage).toEqual(reasonableExpectation);
    });
  }
});

Then(
  'a case without Certificate A is created for a case officer while recording that owner has been informed',
  () => {
    if (queueValidationEnabled) {
      cy.task('getLastFromQueue').then((actualMessage) => {
        const expected = require('../../fixtures/expected-appeal-without-certificate-a-other-owner-informed.json');
        const reasonableExpectation = matchWhatWeCanFrom(expected);
        expect(actualMessage).toEqual(reasonableExpectation);
      });
    }
  },
);

Then(
  'a case without Certificate A is created for a case officer while recording that owner has not been informed',
  () => {
    if (queueValidationEnabled) {
      cy.task('getLastFromQueue').then((actualMessage) => {
        const expected = require('../../fixtures/expected-appeal-without-certificate-a-other-owner-not-informed.json');
        const reasonableExpectation = matchWhatWeCanFrom(expected);
        expect(actualMessage).toEqual(reasonableExpectation);
      });
    }
  },
);

Then('the associated documents will be available for the case worker to review', () => {
  if (queueValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      const expected = require('../../fixtures/expected-appeal-with-many-documents.json');
      const reasonableExpectation = matchWhatWeCanFrom(expected);
      cy.log(`actualMessage = \n${JSON.stringify(actualMessage, null, 2)}`);
      cy.log(`reasonableExpectation = \n${JSON.stringify(reasonableExpectation, null, 2)}`);
      expect(actualMessage).toEqual(reasonableExpectation);
    });
  }
});

Then('the LPA will receive an email notification of the appeal', () => {
  if (queueValidationEnabled && notifyValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      const templateId = Cypress.env(
        'SRV_NOTIFY_APPEAL_SUBMISSION_RECEIVED_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID',
      );
      const validationUrl = `${notifyValidationBaseUrl}notifications?template_id=${templateId}&reference=${actualMessage.appeal.id}`;

      cy.request(validationUrl).then((response) => {
        expect(response.body).to.have.length(1);

        expect(response.body).toEqual([
          {
            template_id: '79488d5d-7efd-4273-a11f-e73f11d19676',
            email_address: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
            personalisation: {
              LPA: 'System Test Borough Council',
              date: moment(actualMessage.appeal.submissionDate).format('DD MMMM YYYY'),
              'planning application number': 'ValidNumber/12345',
              'site address': '1 Taylor Road\nClifton\nBristol\nSouth Glos\nBS8 1TG',
            },
            reference: actualMessage.appeal.id,
            type: 'email',
            id: expect.any(Number),
          },
        ]);
      });
    });
  }
});

And('an email notification is sent', () => {
  if (queueValidationEnabled && notifyValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      cy.request(
        notifyValidationBaseUrl +
          'notifications?reference=' +
          actualMessage.appeal.id +
          '&email_address=' +
          actualMessage.appeal.aboutYouSection.yourDetails.email,
      )
        .its('body')
        .should('have.length', 1);
    });
  }
});

And('a confirmation email containing a link to the appeal pdf is sent to the appellant', () => {
  if (queueValidationEnabled && notifyValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      cy.request(
        notifyValidationBaseUrl +
          'notifications?reference=' +
          actualMessage.appeal.id +
          '&email_address=' +
          actualMessage.appeal.aboutYouSection.yourDetails.email,
      )
        .its('body')
        .should('have.length', 1);
    });
  }
});

And('a confirmation email containing a link to the appeal pdf is sent to the agent', () => {
  if (queueValidationEnabled && notifyValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      cy.request(
        notifyValidationBaseUrl +
          'notifications?reference=' +
          actualMessage.appeal.id +
          '&email_address=' +
          actualMessage.appeal.aboutYouSection.yourDetails.email,
      )
        .its('body')
        .should('have.length', 1);
    });
  }
});
