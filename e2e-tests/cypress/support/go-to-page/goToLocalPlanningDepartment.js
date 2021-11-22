import { acceptCookiesBanner } from '../common/accept-cookies-banner';

export const goToLocalPlanningDepartment = () =>{
  cy.visit('/before-you-start/local-planning-depart');
  acceptCookiesBanner();
  cy.checkPageA11y({
    exclude: ['.govuk-radios__input'],
  });
}
