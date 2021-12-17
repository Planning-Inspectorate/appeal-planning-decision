import { STANDARD_APPEAL } from '../../../integration/common/standard-appeal';

module.exports = () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
  cy.agreeToTheDeclaration();
  cy.confirmAppealSubmitted();

  cy.get('[data-cy="submission-information-appeal-id"]')
    .should('not.be.visible')
    .invoke('val')
    .as('appellantAppealWithoutFilesAppealId');
};
