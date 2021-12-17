module.exports = ({ sectionTitle }) => {
  cy.get('button').contains(sectionTitle).click();
  cy.wait(Cypress.env('demoDelay'));
};
