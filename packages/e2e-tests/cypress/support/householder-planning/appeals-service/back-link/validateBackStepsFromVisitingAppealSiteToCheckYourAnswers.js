import { clickBackLinkAndValidateUrl } from './clickBackLinkAndValidateUrl';

export const validateBackStepsFromVisitingAppealSiteToCheckYourAnswers = () => {
  cy.url().should('match', /\/appellant-submission\/site-access$/);

  [
    /\/appellant-submission\/site-ownership-certb$/,
    /\/appellant-submission\/site-ownership$/,
    /\/appellant-submission\/check-answers$/,
  ].forEach((expectedUrl) => {
    clickBackLinkAndValidateUrl({ expectedUrl });
  });
};
