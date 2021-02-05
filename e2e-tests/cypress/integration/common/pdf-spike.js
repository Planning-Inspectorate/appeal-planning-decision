import {Then} from "cypress-cucumber-preprocessor/steps"

Given('mandatory tasks are completed', () => {
  cy.goToWhoAreYouPage();
  cy.answerYesOriginalAppellant();
  cy.clickSaveAndContinue();

  cy.provideDetailsName('Valid Name');
  cy.provideDetailsEmail('valid@email.com');
  cy.clickSaveAndContinue();

  cy.promptUserToProvidePlanningApplicationNumber();
  cy.providePlanningApplicationNumber('ValidNumber/12345');
  cy.goToPlanningApplicationSubmission();
  cy.uploadPlanningApplicationFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();

  cy.goToDecisionLetterPage();
  cy.uploadDecisionLetterFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();

  cy.goToAppealStatementSubmission();
  cy.checkNoSensitiveInformation();
  cy.uploadAppealStatementFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();

  cy.goToSiteAddressPage();
  cy.provideAddressLine1('1 Taylor Road');
  cy.provideAddressLine2('Clifton');
  cy.provideTownOrCity('Bristol');
  cy.provideCounty('South Glos');
  cy.providePostcode('BS8 1TG');
  cy.clickSaveAndContinue();

  cy.goToWholeSiteOwnerPage();
  cy.answerOwnsTheWholeAppeal();
  cy.clickSaveAndContinue();

  cy.goToAccessSitePage();
  cy.answerCanSeeTheWholeAppeal();
  cy.clickSaveAndContinue();

  cy.goToHealthAndSafetyPage();
  cy.answerSiteHasNoIssues();
  cy.clickSaveAndContinue();
});

When('the appeal tasks are presented', () => {
  cy.goToTaskListPage();
});


Then('I can make a pdf of my appeal', () => {
  cy.visit('/appellant-submission/check-answers');


  cy.get(`[data-cy="appeal.id"]`).invoke('text').then((id) => {
    cy.downloadFile(
      `${Cypress.config().baseUrl}/pdf/download/${id}`,
      'cypress/fixtures/Download',
      `${id}.pdf`
    );

     cy.task('getPdfContent', `cypress/fixtures/Download/${id}.pdf`).then(content => {
      expect(content).to.contain('Valid Name');
     });
  });

})
