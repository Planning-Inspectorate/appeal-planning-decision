import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmNumberSupportingDocumentsAccepted = (numberAccepted) => {
  //cy.goToSupportingDocumentsPage();
  goToAppealsPage(pageURLAppeal.goToSupportingDocumentsPage);

  if (numberAccepted) {
    cy.get('.moj-multi-file-upload__list').within(() => {
      cy.get('.govuk-summary-list__row').should('have.length', numberAccepted);
    });
  } else {
    cy.get('.moj-multi-file-upload__list').should('not.exist');
  }

  cy.wait(Cypress.env('demoDelay'));
};
