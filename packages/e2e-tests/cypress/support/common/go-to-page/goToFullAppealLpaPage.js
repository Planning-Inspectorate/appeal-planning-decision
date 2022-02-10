export const goToFullAppealLpaPage = (url, id, disableJs) =>{
  if (id) {
    cy.visit(`${Cypress.env('LPA_BASE_URL')}/full-appeal/${id}/${url}`, {
      failOnStatusCode: false,
      script: !disableJs,
    });
  } else {
    cy.get('@fullAppeal').then((fullappeal) => {
      cy.wrap(`${Cypress.env('LPA_BASE_URL')}/full-appeal/${fullappeal.id}/${url}`).then((url) => {
        cy.visit(url, {
          failOnStatusCode: false,
          script: !disableJs,
        });
      });
    });
  }
  cy.htmlvalidate();
  cy.checkPageA11y();
}
