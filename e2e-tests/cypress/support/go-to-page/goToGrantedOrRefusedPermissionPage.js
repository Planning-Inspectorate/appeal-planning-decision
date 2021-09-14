module.exports = () => {
    cy.visit('/eligibility/granted-or-refused-permission');
    cy.wait(Cypress.env('demoDelay'));
}