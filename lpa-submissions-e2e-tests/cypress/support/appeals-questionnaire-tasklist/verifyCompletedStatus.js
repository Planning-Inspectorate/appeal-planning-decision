 /// <reference types = "Cypress"/>
 import AppealsQuestionnaireTaskList from '../PageObjects/appeals-questionnaire-tasklist-pageobjects';
 const tasklist = new AppealsQuestionnaireTaskList()
module.exports = (name) =>{
  tasklist
  .checkCompletedTaskStatus(name)
  .find('.govuk-tag').contains('COMPLETED')
}
