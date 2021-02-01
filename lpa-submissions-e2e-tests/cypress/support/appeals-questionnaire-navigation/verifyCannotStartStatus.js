 /// <reference types = "Cypress"/>
 import AppealsQuestionnaireTaskList from '../PageObjects/appeals-questionnaire-tasklist-pageobjects';
 const tasklist = new AppealsQuestionnaireTaskList()
module.exports = () =>{
  tasklist
  .checkCannotStartStatus()
  .find('.govuk-tag').contains('CANNOT START YET')
}
