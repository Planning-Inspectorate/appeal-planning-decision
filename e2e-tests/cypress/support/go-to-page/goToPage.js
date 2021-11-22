import { acceptCookiesBanner } from '../common/accept-cookies-banner';

export const goToPage = (url) =>{
  cy.visit(url);
  acceptCookiesBanner();
  cy.checkPageA11y({
    exclude: ['.govuk-radios__input'],
  });
}
