import { selectRadioButton } from './selectRadioButton';

export const selectApplicationCertificatesIncluded = (option) => {
  cy.url().should('contain', 'full-appeal/submit-appeal/application-certificates-included');
  selectRadioButton(option);
};
