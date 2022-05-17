import { selectRadioButton } from './selectRadioButton';

export const selectApplicationCertificatesSeparate = (option) => {
  cy.url().should('contain', 'full-appeal/submit-appeal/application-certificates-included');
  selectRadioButton(option);
};
