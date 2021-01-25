module.exports = () =>{
    cy.visit('/lpa-submission/lpa-task-list')
    cy.url().should('contain','/lpa-submission/lpa-task-list')
}
