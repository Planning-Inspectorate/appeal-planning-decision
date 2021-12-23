import AGENT_APPEAL_WITH_FILES from './agent-appeal-with-files';
import { provideCompleteAppeal } from '../../appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickCheckYourAnswers } from '../../appeal-navigation/clickCheckYourAnswers';
import { clickSaveAndContinue } from '../../appeal-navigation/clickSaveAndContinue';
import { confirmAppealSubmitted } from '../../appellant-confirms-declaration/confirmAppealSubmitted';
import { agreeToTheDeclaration } from '../../appellant-confirms-declaration/agreeToTheDeclaration';

export const createAgentAppealWithFiles = () => {
  provideCompleteAppeal(AGENT_APPEAL_WITH_FILES);
  clickCheckYourAnswers();
  clickSaveAndContinue();
  agreeToTheDeclaration();
  confirmAppealSubmitted();

  cy.get('[data-cy="submission-information-appeal-id"]')
    .should('not.be.visible')
    .invoke('val')
    .as('agentAppealWithFilesAppealId');
};
