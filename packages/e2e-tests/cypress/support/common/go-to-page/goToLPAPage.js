export const goToLPAPage = (url, id, disableJs) =>{
  if (id) {
    cy.visit(`${Cypress.env('LPA_BASE_URL')}/${id}/${url}`, {
      failOnStatusCode: false,
      script: !disableJs,
    });
  } else {
    cy.get('@appeal').then((appeal) => {
      cy.wrap(`${Cypress.env('LPA_BASE_URL')}/${appeal.id}/${url}`).then((url) => {
        cy.visit(url, {
          failOnStatusCode: false,
          script: !disableJs,
        });
      });
    });
  }
  cy.htmlvalidate();
 /* cy.checkPageA11y({
    exclude: ['.govuk-radios__input'],
  });*/
  }
