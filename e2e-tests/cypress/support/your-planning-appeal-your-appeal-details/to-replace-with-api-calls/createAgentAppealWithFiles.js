import AGENT_APPEAL_WITH_FILES from './agent-appeal-with-files';

module.exports = () => {
  cy.provideCompleteAppeal(AGENT_APPEAL_WITH_FILES);
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
  cy.agreeToTheDeclaration();
  cy.confirmAppealSubmitted();

  cy.get('[data-cy="submission-information-appeal-id"]')
    .should('not.be.visible')
    .invoke('val')
    .as('agentAppealWithFilesAppealId');
};
