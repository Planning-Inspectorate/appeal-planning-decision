import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from '../common/standard-appeal';

Given('an agent or appellant has submitted an appeal ', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
  cy.agreeToTheDeclaration();
});

When('your planning appeal page is viewed with a correct appealId', () => {
  cy.visit('/appellant-submission/confirmation');
  cy.get('[data-cy="submission-information-appeal-id"]')
    .invoke('val')
    .then((appealId) => {
      cy.visit(`/your-planning-appeal/${appealId}`);
    });
});

When('your planning appeal page is viewed with an incorrect appealId', () => {
  cy.visit('/your-planning-appeal/unknown-appeal-id', { failOnStatusCode: false });
});

Then('the user sees the appropriate general data along with data for step 1', () => {
  cy.get('[data-cy="appelant-name"]').should(
    'equal',
    STANDARD_APPEAL.aboutYouSection.yourDetails.name,
  );
  cy.get('[data-cy="appelant-address"]').should(
    'equal',
    `${STANDARD_APPEAL.appealSiteSection.siteAddress.addressLine1}, ${STANDARD_APPEAL.appealSiteSection.siteAddress.addressLine2}, ${STANDARD_APPEAL.appealSiteSection.siteAddress.town}, ${STANDARD_APPEAL.appealSiteSection.siteAddress.county}, ${STANDARD_APPEAL.appealSiteSection.siteAddress.postcode}`,
  );
});

Then('the user sees the 404 page', () => {
  cy.confirmNavigationPageNotFoundPage();
});
