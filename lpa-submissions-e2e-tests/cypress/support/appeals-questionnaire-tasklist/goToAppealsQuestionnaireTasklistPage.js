import lpaSubmissionTaskList from '../PageObjects/appeals-questionnaire-tasklist-pageobjects'

module.exports = () =>{
    let path = '/task-list';
    cy.visit(path, {failOnStatusCode:false});
   // cy.checkA11y(path);
    cy.url().should('contain',path);
 };
