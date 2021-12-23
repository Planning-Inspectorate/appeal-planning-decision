import { provideCompleteAppeal } from '../../appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickCheckYourAnswers } from '../../appeal-navigation/clickCheckYourAnswers';
import { clickSaveAndContinue } from '../../appeal-navigation/clickSaveAndContinue';
import { agreeToTheDeclaration } from '../../appellant-confirms-declaration/agreeToTheDeclaration';
import { confirmAppealSubmitted } from '../../appellant-confirms-declaration/confirmAppealSubmitted';
import { STANDARD_APPEAL } from '../../../../../integration/common/householder-planning/appeals-service/standard-appeal';
export const createAppellantAppealWithoutFiles = () => {
  provideCompleteAppeal(STANDARD_APPEAL);
  clickCheckYourAnswers();
  clickSaveAndContinue();
  agreeToTheDeclaration();
  confirmAppealSubmitted();

  cy.get('[data-cy="submission-information-appeal-id"]')
    .should('not.be.visible')
    .invoke('val')
    .as('appellantAppealWithoutFilesAppealId');
};
