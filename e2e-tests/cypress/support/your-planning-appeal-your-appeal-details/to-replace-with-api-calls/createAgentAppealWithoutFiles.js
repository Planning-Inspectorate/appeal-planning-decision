import AGENT_APPEAL_WITHOUT_FILES from './agent-appeal-without-files';

module.exports = () => {
  cy.provideCompleteAppeal(AGENT_APPEAL_WITHOUT_FILES);
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
  cy.agreeToTheDeclaration();
  cy.confirmAppealSubmitted();

  cy.get('[data-cy="submission-information-appeal-id"]')
    .should('not.be.visible')
    .invoke('val')
    .as('agentAppealWithoutFilesAppealId');
};
