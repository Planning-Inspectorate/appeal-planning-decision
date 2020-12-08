import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When("the user {string} the terms and conditions", (accepts_doesNotAccept) => {
  switch (accepts_doesNotAccept) {
    case 'accepts':
      cy.acceptTermsAndConditions();
      break;
    case 'does not accept':
      cy.doNotAcceptTermsAndConditions();
      break;
  }
});

Then("the user is informed that they must accept the terms and conditions to proceed", () => {
  cy.confirmTermsAndConditionsAreRequired();
});

Then("the appeal {string} submitted", (is_isNot) => {
  switch (is_isNot) {
    case 'is':
      cy.confirmAppealSubmitted();
      break;
    case 'is not':
      cy.confirmAppealNotSubmitted();
      break;
  }
});
