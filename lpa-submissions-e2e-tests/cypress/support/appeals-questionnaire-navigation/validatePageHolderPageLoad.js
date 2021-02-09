 /// <reference types = "Cypress"/>
 import AppealsQuestionnaireTaskList from '../PageObjects/appeals-questionnaire-tasklist-pageobjects';
 const tasklist = new AppealsQuestionnaireTaskList()
module.exports = () =>{
  tasklist.getPlaceholderPageTitle().invoke('text')
  .then(text =>{
    expect(text).to.contain ('Task not ready');
  })
}
