module.exports = (addressLine1) => {
  // provide the address line one
  cy.get('#site-address-line-one').type(`{selectall}{backspace}${addressLine1}`);

  cy.wait(Cypress.env('demoDelay'));
};
