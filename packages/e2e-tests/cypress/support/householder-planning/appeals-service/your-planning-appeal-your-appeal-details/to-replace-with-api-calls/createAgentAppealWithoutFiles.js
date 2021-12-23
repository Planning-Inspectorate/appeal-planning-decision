import AGENT_APPEAL_WITHOUT_FILES from './agent-appeal-without-files';
import { provideCompleteAppeal } from '../../../../householder-planning/appeals-service/appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickCheckYourAnswers } from '../../appeal-navigation/clickCheckYourAnswers';
import { clickSaveAndContinue } from '../../appeal-navigation/clickSaveAndContinue';
import { agreeToTheDeclaration } from '../../appellant-confirms-declaration/agreeToTheDeclaration';
import { confirmAppealSubmitted } from '../../appellant-confirms-declaration/confirmAppealSubmitted';

export const createAgentAppealWithoutFiles = () => {
  provideCompleteAppeal(AGENT_APPEAL_WITHOUT_FILES);
  clickCheckYourAnswers();
  clickSaveAndContinue();
  agreeToTheDeclaration();
  confirmAppealSubmitted();

  cy.get('[data-cy="submission-information-appeal-id"]')
    .should('not.be.visible')
    .invoke('val')
    .as('agentAppealWithoutFilesAppealId');
};
