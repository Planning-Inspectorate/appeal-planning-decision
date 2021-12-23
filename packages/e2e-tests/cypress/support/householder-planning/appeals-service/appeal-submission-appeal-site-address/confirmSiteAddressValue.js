import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmSiteAddressValue = (addressLine1, addressLine2, townCity, county, postcode) => {
  goToAppealsPage(pageURLAppeal.goToSiteAddressPage);
  cy.wait(Cypress.env('demoDelay'));
  cy.get('#site-address-line-one').should('have.value', addressLine1);
  cy.get('#site-address-line-two').should('have.value', addressLine2);
  cy.get('#site-town-city').should('have.value', townCity);
  cy.get('#site-county').should('have.value', county);
  cy.get('#site-postcode').should('have.value', postcode);
  //cy.wait(Cypress.env('demoDelay'));
};
