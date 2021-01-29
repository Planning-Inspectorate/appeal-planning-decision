import lpaSubmissionTaskList from '../support/PageObjects/lpa-submission-tasklist-pageobjects'
module.exports = () =>{
    let path = 'appeal-questionnaire/task-list'
    cy.visit(path, {failOnStatusCode:false})
    cy.checkA11y(path)
    cy.url().should('contain',path)
 }
