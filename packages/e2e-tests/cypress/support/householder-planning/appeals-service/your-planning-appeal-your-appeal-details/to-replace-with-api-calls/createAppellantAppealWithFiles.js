import APPELLANT_APPEAL_WITH_FILES from './appellant-appeal-with-files';
import { provideCompleteAppeal } from '../../appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickCheckYourAnswers } from '../../appeal-navigation/clickCheckYourAnswers';
import { clickSaveAndContinue } from '../../appeal-navigation/clickSaveAndContinue';
import { agreeToTheDeclaration } from '../../appellant-confirms-declaration/agreeToTheDeclaration';
import { confirmAppealSubmitted } from '../../appellant-confirms-declaration/confirmAppealSubmitted';

export const createAppellantAppealWithFiles = () => {
  provideCompleteAppeal(APPELLANT_APPEAL_WITH_FILES);
  clickCheckYourAnswers();
  clickSaveAndContinue();
  agreeToTheDeclaration();
  confirmAppealSubmitted();

  cy.get('[data-cy="submission-information-appeal-id"]')
    .should('not.be.visible')
    .invoke('val')
    .as('appellantAppealWithFilesAppealId');
};
