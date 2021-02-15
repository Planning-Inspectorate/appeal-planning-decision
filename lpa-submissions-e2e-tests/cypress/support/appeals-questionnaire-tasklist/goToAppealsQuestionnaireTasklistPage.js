import lpaSubmissionTaskList from '../PageObjects/appeals-questionnaire-tasklist-pageobjects'
import defaultPathId from '../../utils/defaultPathId';
module.exports = (id = defaultPathId) =>{
    let path = `/${id}/task-list`;
    cy.visit(path, {failOnStatusCode:false});
    cy.checkPageA11y(path);
    cy.url().should('contain',path);
 };
