export const goToAppealsServicePage = (url) =>{
    cy.visit(`${Cypress.env('APPEALS_BASE_URL')}/${url}`);

 // cy.htmlvalidate();
  /* cy.checkPageA11y({
     exclude: ['.govuk-radios__input'],
   });*/
}
