import { answerDoesNotOwnTheWholeAppeal } from '../appeal-submission-appeal-site-ownership/answerDoesNotOwnTheWholeAppeal';
import { clickSaveAndContinue } from '../appeal-navigation/clickSaveAndContinue';
import { answerHaveToldOtherOwnersAppeal } from '../appeal-submission-appeal-site-ownership/answerHaveToldOtherOwnersAppeal';

export const alterDetailsAboutVisitingTheAppealSite = () => {
  cy.get('[data-cy="siteOwnership"]').click();

  answerDoesNotOwnTheWholeAppeal();
  clickSaveAndContinue();

  answerHaveToldOtherOwnersAppeal();
  clickSaveAndContinue();
};
