module.exports = () => {
  cy.get('[data-cy="applicationNumber"]').click();
  cy.providePlanningApplicationNumber('ValidNumber/12345');
  cy.clickSaveAndContinue();

  cy.uploadPlanningApplicationFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();
};
