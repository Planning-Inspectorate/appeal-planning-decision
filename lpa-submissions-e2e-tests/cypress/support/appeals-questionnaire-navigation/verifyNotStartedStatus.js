 /// <reference types = "Cypress"/>
 import AppealsQuestionnaireTaskList from '../PageObjects/appeals-questionnaire-tasklist-pageobjects';
 const tasklist = new AppealsQuestionnaireTaskList()
module.exports = (name) =>{
  tasklist
  .checkNotstartedTaskStatus(name)
  .find('.govuk-tag').contains('NOT STARTED')
}
