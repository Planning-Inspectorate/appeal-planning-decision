 /// <reference types = "Cypress"/>

const { default: AppealsQuestionnaireTaskList } = require("../PageObjects/appeals-questionnaire-tasklist-pageobjects")
import AppealsQuestionnaireTaskList from '../../PageObjects/appeals-questionnaire-tasklist-pageobjects';
const tasklist = new AppealsQuestionnaireTaskList()
module.exports = () =>{

  let path = 'appeals-questionnaire/placeholder'
  cy.visit(path, {failOnStatusCode:false})
  cy.checkA11y(path)
}
