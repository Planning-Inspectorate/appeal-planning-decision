import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  STANDARD_AGENT_APPEAL,
  STANDARD_APPEAL,
} from '../common/standard-appeal';
import format from 'date-fns/format'

Given('an {string} has submitted an appeal', (appellantOrAgent) => {
  const appeal = appellantOrAgent === 'appellant' ? STANDARD_APPEAL : STANDARD_AGENT_APPEAL;
  cy.provideCompleteAppeal(appeal);
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
  cy.agreeToTheDeclaration();
});

Given('an agent or appellant has submitted an appeal', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
  cy.agreeToTheDeclaration();
});

When('your planning appeal page is viewed with a valid appealId', () => {
  cy.confirmAppealSubmitted();
  cy.get('[data-cy="submission-information-appeal-id"]')
    .invoke('val')
    .then((appealId) => {
      cy.visit(`/your-planning-appeal/${appealId}`);
      cy.wait(Cypress.env('demoDelay'));
    });
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
});

When('your planning appeal page is viewed with an incorrect appealId', () => {
  cy.visit('/your-planning-appeal/unknown-appeal-id', { failOnStatusCode: false });
  cy.wait(Cypress.env('demoDelay'));
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
});

Then('the user sees the appropriate general data for {string} along with data for step 1', (appellantOrAgent) => {
  let isAppellant = appellantOrAgent === 'appellant';
  const appeal = isAppellant ? STANDARD_APPEAL : STANDARD_AGENT_APPEAL;
  const appellantName = isAppellant ? appeal.aboutYouSection.yourDetails.name : appeal.aboutYouSection.yourDetails.appealingOnBehalfOf;
  cy.get('[data-cy="appellant-name"]').should(
    'have.text',
    appellantName,
  );
  cy.get('[data-cy="appellant-address"]').should(
    'have.text',
    `${appeal.appealSiteSection.siteAddress.addressLine1}${appeal.appealSiteSection.siteAddress.addressLine2}${appeal.appealSiteSection.siteAddress.town}${appeal.appealSiteSection.siteAddress.county}${appeal.appealSiteSection.siteAddress.postcode}`,
  );
  cy.get('[data-cy="appeal-submission-date"]').should(
    'have.text',
    format(new Date(), 'd MMMM yyyy')
  );
});

Then('the user sees the label for appellant name as {string}', (label) => {
  cy.get('[class=govuk-summary-list__key]').first().should(
    'contain',
    label,
  );
});

Then('the user sees the 404 page', () => {
  cy.confirmNavigationPageNotFoundPage();
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
});
