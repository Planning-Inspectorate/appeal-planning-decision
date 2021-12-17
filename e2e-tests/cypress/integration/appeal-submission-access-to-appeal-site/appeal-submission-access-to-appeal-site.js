import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the user is prompted to provide access to the inspector visiting the appeal site', () => {
  cy.goToAccessSitePage();
});

When('the user does not select any option', () => {});

When('the user selects {string} to provide access', (answer) => {
  if (answer === 'Yes') {
    cy.answerCanSeeTheWholeAppeal();
    cy.clickSaveAndContinue();
  } else {
    cy.answerCannotSeeTheWholeAppeal();
  }
});

When(
  'the user does provide additional information with character length exceeding the limit',
  () => {
    cy.provideMoreDetails('word'.repeat(64));
  },
);

When('the user {string} provide additional information', (provided) => {
  if (provided === 'does') {
    cy.provideMoreDetails('More information');
  }
  cy.clickSaveAndContinue();
});

Then('the user can see the selected option {string} submitted', (submitted) => {
  if (submitted.includes('Yes')) {
    cy.confirmAccessSiteAnswered('yes');
  } else if (submitted.includes('No')) {
    cy.confirmAccessSiteAnswered('no', 'More information');
  } else {
    throw new Error('unknown selected option');
  }
});

Then('the user can see that there is no option submitted', () => {
  cy.confirmAccessSiteNotSubmitted();
});

Then('the user is informed that {string}', (reason) => {
  switch (reason) {
    case 'further information is required to gain access to the restricted site':
      cy.confirmAccessSiteWasRejectedBecause('Tell us how access is restricted');
      break;
    default:
      throw new Error('The reason "' + reason + '" is unknown');
  }
});

Then('the user is told {string}', (reason) => {
  cy.confirmAccessSiteWasRejectedBecause(reason);
});
