 /// <reference types = "Cypress"/>
import defaultPathId from '../../utils/defaultPathId';
import AppealsQuestionnaireTaskList from '../PageObjects/appeals-questionnaire-tasklist-pageobjects';
const tasklist = new AppealsQuestionnaireTaskList();

module.exports = (id = defaultPathId) => {
  tasklist.getExtraConditions().click();
  const path = `/${id}/placeholder`;
  cy.visit(path, {failOnStatusCode:false});
  // cy.checkA11y(path);
}
