import { clickBackLinkAndValidateUrl } from './clickBackLinkAndValidateUrl';

export const validateBackStepsFromOriginalPlanningApplicationToTaskList = () => {
  cy.url().should('match', /\/appellant-submission\/upload-decision$/);

  [
    /\/appellant-submission\/upload-application$/,
    /\/appellant-submission\/application-number$/,
    /\/appellant-submission\/task-list$/,
  ].forEach((expectedUrl) => {
    clickBackLinkAndValidateUrl({ expectedUrl });
  });
};
