module.exports = () => {
  cy.provideAddressLine1('1 Taylor Road');
  cy.provideAddressLine2('Clifton');
  cy.provideTownOrCity('Bristol');
  cy.provideCounty('South Glos');
  cy.providePostcode('BS8 1TG');
  cy.clickSaveAndContinue();

  cy.answerOwnsTheWholeAppeal();
  cy.clickSaveAndContinue();

  cy.answerCanSeeTheWholeAppeal();
  cy.clickSaveAndContinue();

  cy.answerSiteHasNoIssues();
};
