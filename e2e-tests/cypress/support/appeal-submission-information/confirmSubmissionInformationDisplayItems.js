module.exports = (information) => {
  console.log(`information`, information);
  console.log(`Object.keys(information)`, Object.keys(information));
  Object.keys(information).forEach((cypressTag) => {
    cy.get(`[data-cy="${cypressTag}"]`)
      .invoke('text')
      .then((text) => {
        expect(text).to.eq(information[cypressTag]);
      });
    cy.wait(Cypress.env('demoDelay'));
  });
};
