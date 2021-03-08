import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps';
import {matchWhatWeCanFrom, STANDARD_APPEAL} from './standard-appeal';

const queueValidationEnabled = Cypress.env('QUEUE_VALIDATION_ENABLED');

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


Given('a prospective appellant has provided appeal information where the whole site can be seen', () => {
  cy.provideCompleteAppeal({
    ...STANDARD_APPEAL,
    appealSiteSection: {
      ...STANDARD_APPEAL.appealSiteSection,
      siteAccess: {
        howIsSiteAccessRestricted: "",
        canInspectorSeeWholeSiteFromPublicRoad: true,
      },
    },
  });
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
});

Given('a prospective appellant has provided appeal information where the whole site cannot be seen', () => {
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
});

Given('a prospective appellant has provided appeal information where they own the whole site', () => {
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
});

Given('a prospective appellant has provided appeal information where they do not own the whole site while confirming owner has been informed', () => {
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
});

Given('a prospective appellant has provided appeal information where they do not own the whole site while confirming owner has not been informed', () => {
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

Then('a case without Certificate A is created for a case officer while recording that owner has been informed', () => {
  if (queueValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      const expected = require('../../fixtures/expected-appeal-without-certificate-a-other-owner-informed.json');
      const reasonableExpectation = matchWhatWeCanFrom(expected);
      expect(actualMessage).toEqual(reasonableExpectation);
    });
  }
});

Then('a case without Certificate A is created for a case officer while recording that owner has not been informed', () => {
  if (queueValidationEnabled) {
    cy.task('getLastFromQueue').then((actualMessage) => {
      const expected = require('../../fixtures/expected-appeal-without-certificate-a-other-owner-not-informed.json');
      const reasonableExpectation = matchWhatWeCanFrom(expected);
      expect(actualMessage).toEqual(reasonableExpectation);
    });
  }
});

