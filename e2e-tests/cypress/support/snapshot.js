const lighthouseTargets = {
  "performance": Cypress.env('lighthouse-performance'),
  "accessibility": Cypress.env('lighthouse-accessibility'),
  "best-practices": Cypress.env('lighthouse-best-practices'),
  "seo": Cypress.env('lighthouse-seo'),
  "pwa": Cypress.env('lighthouse-pwa'),
}

module.exports = (command) => {
  cy.wait(Cypress.env('demoDelay'));

  if (Cypress.env('lighthouse')) {
    cy.lighthouse(lighthouseTargets);
  }

  if (Cypress.env('pa11y')) {
    cy.pa11y();
  }
}
