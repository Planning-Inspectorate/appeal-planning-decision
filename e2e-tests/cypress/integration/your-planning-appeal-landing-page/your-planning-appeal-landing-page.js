import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from '../common/standard-appeal';
import format from 'date-fns/format'

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

Then('the user sees the appropriate general data along with data for step 1', () => {
  cy.get('[data-cy="appellant-name"]').should(
    'have.text',
    STANDARD_APPEAL.aboutYouSection.yourDetails.name,
  );
  cy.get('[data-cy="appellant-address"]').should(
    'have.text',
    `${STANDARD_APPEAL.appealSiteSection.siteAddress.addressLine1}${STANDARD_APPEAL.appealSiteSection.siteAddress.addressLine2}${STANDARD_APPEAL.appealSiteSection.siteAddress.town}${STANDARD_APPEAL.appealSiteSection.siteAddress.county}${STANDARD_APPEAL.appealSiteSection.siteAddress.postcode}`,
  );
  cy.get('[data-cy="appeal-submission-date"]').should(
    'have.text',
    format(new Date(), 'D MMMM YYYY')
  );
});

Then('the user sees the 404 page', () => {
  cy.confirmNavigationPageNotFoundPage();
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
});
