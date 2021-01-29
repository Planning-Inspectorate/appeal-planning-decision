 /// <reference types = "Cypress"/>
 import AppealsQuestionnaireTaskList from '../../PageObjects/appeals-questionnaire-tasklist-pageobjects';
 const tasklist = new AppealsQuestionnaireTaskList()
 
module.exports = () =>{
  tasklist.getExtraConditions().click();
  let path = 'appeals-questionnaire/placeholder'
  cy.visit(path, {failOnStatusCode:false})
  cy.checkA11y(path)
}
