import { clickBackLinkAndValidateUrl } from './clickBackLinkAndValidateUrl';

export const validateBackStepsWithinAppealJourney = () => {
  cy.url().should('match', /\/appellant-submission\/site-access-safety$/);

  [
    /\/appellant-submission\/site-access$/,
    /\/appellant-submission\/site-ownership$/,
    /\/appellant-submission\/site-location$/,
    /\/before-you-appeal$/,
  ].forEach((expectedUrl) => {
    clickBackLinkAndValidateUrl({ expectedUrl });
  });
};
