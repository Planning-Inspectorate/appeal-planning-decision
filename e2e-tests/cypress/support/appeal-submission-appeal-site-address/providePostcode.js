module.exports = (postcode) => {
  // provide the postcode
  cy.get('#site-postcode').type(`{selectall}{backspace}${postcode}`);

  cy.snapshot();
};
